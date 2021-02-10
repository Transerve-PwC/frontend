
import { getBreak, getCommonHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { httpRequest } from "egov-ui-framework/ui-utils/api";
import { getUserInfo, getTenantId, setapplicationType } from "egov-ui-kit/utils/localStorageUtils";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import set from "lodash/set";
import React from "react";
import { getDashboardDropdownData } from "../../../../ui-utils/commons";

// let role_name = JSON.parse(getUserInfo()).roles[0].code

const header = getCommonHeader(
  {
    labelName: "Dashboard",
    labelKey: "DASHBOARD_HOME_HEADER"
  },
  {
    classes: {
      root: "common-header-cont"
    },
    style: {
      padding: "0px 0px 0px 8px"
    },
  }
);
let cardItems = [];
// // if (role_name === 'CITIZEN' || role_name === "EE") {
  
var cardList = [];
var data = [ 
  {
    cardName : "DASHBOARD_1",
    roles: ["EMPLOYEE"],
    icon: "material-icons module-page-icon",
    route: "PGRDashboard"
  },
  {
    cardName : "DASHBOARD_2",
    roles: ["HC_COMMISSIONERMCC", "COMMISSIONERMCC"],
    icon: "material-icons module-page-icon",
    route: "HCDashboard"
  }
]

  // const cardlist = [
  //   {
  //     label: {
  //       labelName: "PGR Dashboard",
  //       labelKey: "DASHBOARD_1"
  //     },
      
  //     icon: <i
  //         viewBox="0 -8 35 42"
  //         color="primary"
  //         font-size="40px"
  //         class="material-icons module-page-icon" style={{ fontSize: "40px" }}>
  //         wysiwyg
  //     </i>,
  //     route: "PGRDashboard"

  //   },
  //   {
  //     label: {
  //       labelName: "HC Dashboard",
  //       labelKey: "DASHBOARD_2"
  //     },
      
  //     icon: <i
  //         viewBox="0 -8 35 42"
  //         color="primary"
  //         font-size="40px"
  //         class="material-icons module-page-icon" style={{ fontSize: "40px" }}>
  //         wysiwyg
  //     </i>,
  //     route: "HCDashboard"

  //   }
  // ];
  // cardItems = cardlist;
  cardItems = cardList;

  const defaultDate = (date) => {
  var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;

  return [year, month, day].join('-');
}

const displayCards = async (action, state, dispatch) => {

  let roles = JSON.parse(getUserInfo()).roles;
  //debugger;

  cardList = [{
    label: {
      labelName: "WrokFlow Previewm",
      labelKey: "WORKFLOW_PREVIEW_TITLE"
    },
    
    icon: <i
        viewBox="0 -8 35 42"
        color="primary"
        font-size="40px"
        class="material-icons module-page-icon" style={{ fontSize: "40px" }}>
        wysiwyg
    </i>,
    route: "review"

  }]

  let mdmsCardList = get(state, "screenConfiguration.preparedFinalObject.applyScreenMdmsData.dashboard.dashboardCardList",
    []
  );
  data = mdmsCardList
  data.map((item)=>{
    roles.some(r => {
      if (item.roles.includes(r.code)) {
        if (cardList.length > 0) {
          if (!cardList.find((x) => x.cardName == item.cardName)) {
            cardList.push(
              setDatatoCard(item)
            )
          }
        } else {
          cardList.push(
            setDatatoCard(item)
          )
        }
      }
    });  
  });

  dispatch(
    handleField(
      "home",
      "components.div.children.headerDiv.children.applyCard",
      "props.items",
      cardList
    )
  );

}


const setDatatoCard =(item) => {
  return {
    label: {
      labelName: "PGR Dashboard",
      labelKey: item.cardName
    },
    
    icon: <i
        viewBox="0 -8 35 42"
        color="primary"
        font-size="40px"
        class="material-icons module-page-icon" style={{ fontSize: "40px" }}>
        wysiwyg
    </i>,
    route: item.route
  
  }
}

const getDropDownData = async (action, state, dispatch) => {

  debugger
  // let data = getDashboardDropdownData(state, dispatch, status)

  // Date default
  var fromDate = new Date()
  var formatDt = defaultDate(fromDate)
  dispatch(prepareFinalObject("dahsboardHome.defaultFromDate", formatDt));
  dispatch(prepareFinalObject("dahsboardHome.defaulttoDate", formatDt));
}

const getMdmsData = async (action, state, dispatch) => {

  //debugger;
  
  let tenantId = getTenantId();
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: tenantId,
      moduleDetails: [
        {
          moduleName: "dashboard",
          masterDetails: [
            {
              name: "dashboardCardList"
            }
          ]
        }
      ]
    }
  };
  try {
    let payload = null;
    payload = await httpRequest(
      "post",
      "/egov-mdms-service/v1/_search",
      "_search",
      [],
      mdmsBody
    );


    dispatch(prepareFinalObject("applyScreenMdmsData", payload.MdmsRes));
  } catch (e) {
    console.log(e);
  }
};

const DashboardHome = {
  uiFramework: "material-ui",
  name: "home",
  beforeInitScreen: (action, state, dispatch) => {
  

    //debugger;
    getDropDownData(action, state, dispatch);


    
    getMdmsData(action, state, dispatch).then(response => {
      displayCards(action, state, dispatch);
      // setcardList(state, dispatch);
    });
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Form",
      props: {
        className: "common-div-css",
        id: "dashboardReportFilter"
      },
      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",

          children: {
            header: {
              ...header
            },
            applyCard: {
              uiFramework: "custom-molecules",
              componentPath: "LandingPage",
              props: {
                items: [],
                history: {}
              }
            },
          }
        },
      }
    },
      }
};

export default DashboardHome;