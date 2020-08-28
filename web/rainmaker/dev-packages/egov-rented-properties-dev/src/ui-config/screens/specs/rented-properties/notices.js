import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {onTabChange, headerrow, tabs} from './search-preview'
import { getSearchResults } from "../../../../ui-utils/commons";
import {  downloadPrintContainer,footerReviewTop } from "./applyResource/reviewFooter";
import { set, get } from "lodash";
import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { getTenantId} from "egov-ui-kit/utils/localStorageUtils";
import { getImages } from "./property-transitImages";
import { getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import NoticedetailsPreview from "./noticestabNoticepreview";


let transitNumber = getQueryArg(window.location.href, "transitNumber");
// export const noticeIdValue = (state) => {
//   const noticearr = get(state.screenConfiguration.preparedFinalObject, "Properties[0].notices.memoNumber")
//   return noticearr
// }

export const searchResults = async (action, state, dispatch, transitNumber) => {
const userInfo = JSON.parse(getUserInfo());
const {roles = []} = userInfo
const findItem = roles.find(item => item.code === "RP_CLERK");
  let queryObject = [
    { key: "transitNumber", value: transitNumber }
  ];
  let payload = await getSearchResults(queryObject);
  if(payload) {
    let properties = payload.Properties;
      let {notices = []} = properties[0]
      if(notices != null){
        notices = await getImages(notices);
        notices = notices.map(item => {
          let { applicationDocuments, urls } = item;
          applicationDocuments = applicationDocuments.map((image, index) => ({ ...image, url: urls[index],
          name: urls[index].split("?")[0].split("/").pop().slice(13)
          }));
          return { ...item, applicationDocuments };
        });
        properties = [{...properties[0], notices}]
      }
      dispatch(prepareFinalObject("Properties[0]", properties[0]));     
  }
  let properties = get(state.screenConfiguration.preparedFinalObject, "Properties[0]")
  let approvedflagdata = properties.masterDataState
  if(findItem === null || findItem === undefined || approvedflagdata != "PM_APPROVED"){
    let pathBtn = "components.div.children.rightdiv"
    dispatch(
      handleField(
        "notices",
        pathBtn,
        "visible",
        false
      )
    );
   }
 }

 const beforeInitFn = async (action, state, dispatch, transitNumber) => {
  dispatch(prepareFinalObject("workflow.ProcessInstances", []))
  if(transitNumber){
    await searchResults(action, state, dispatch, transitNumber)
  }
  // const printCont = downloadPrintContainer(
  //   action,
  //   state,
  //   dispatch,
  //   // status,
  //   // applicationNumber,
  //   // tenantId
  // );
  // const CitizenprintCont=footerReviewTop(
  //   action,
  //   state,
  //   dispatch,
  //   // status,
  //   // applicationNumber,
  //   // tenantId,
  //   //financialYear
  // );
  // 
  // process.env.REACT_APP_NAME === "Citizen"
  //   ? set(
  //       action,
  //       "screenConfig.components.div.children.headerDiv.children.helpSection.children",
  //       CitizenprintCont
  //     )
  //   : set(
  //       action,
  //       "screenConfig.components.div.children.headerDiv.children.helpSection.children",
  //       printCont
  //     );
}

const buttonComponent = (label, route) => ({
  componentPath: "Button",
  gridDefination: {
    xs: 12,
    sm: 2
  },
  props: {
    variant: "contained",
    style: {
      color: "white",
      backgroundColor: "#fe7a51",
      borderColor:"#fe7a51",
      borderRadius: "2px",
      height: "48px"
    }
  },
  children: {
    buttonLabel: getLabel({
      labelName: label,
      labelKey: label
    })
  },
  onClickDefination: {
    action: "condition",
    callBack: (state, dispatch) => {
      dispatch(setRoute(route));
    }
  }
})

const notices = {
    uiFramework: "material-ui",
    name: "notices",
    beforeInitScreen: (action, state, dispatch) => {
      beforeInitFn(action, state, dispatch, transitNumber);
      return action;
    },
    components: {
      div: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        props: {
          className: "common-div-css search-preview"
        },
        children: {
          headerDiv: {
            uiFramework: "custom-atoms",
            componentPath: "Container",
            children: {
              header1: {
                gridDefination: {
                  xs: 12,
                  sm: 8
                },
               ...headerrow
              },
              helpSection: {
                uiFramework: "custom-atoms",
                componentPath: "Container",
                props: {
                  color: "primary",
                  style: { justifyContent: "flex-end" }
                },
                gridDefination: {
                  xs: 12,
                  sm: 4,
                  align: "right"
                }
              }
              }
            },
            tabSection: {
              uiFramework: "custom-containers-local",
              moduleName: "egov-rented-properties",
              componentPath: "CustomTabContainer",
              props: {
                tabs,
                onTabChange,
                activeIndex: 2
              },
              type: "array",
            },
            rightdiv: {
              uiFramework: "custom-atoms",
              componentPath: "Container",
              props: {
                style: { justifyContent: "flex-end", marginTop: 10 }
              },
              gridDefination: {
                xs: 12,
                sm: 12,
                align: "right"
              },
              children: {
                recoveryButton: buttonComponent("Create Recovery Notice", `/rented-properties/notice-recovry?tenantId=${getTenantId()}`),
                violationButton: buttonComponent("Create Violation Notice", `/rented-properties/notice-violation?tenantId=${getTenantId()}`)
              }
            },
            viewFour: {
              uiFramework: "custom-containers-local",
              moduleName: "egov-rented-properties",
              componentPath: "MultipleDocumentsContainer",
              props: {
                sourceJsonPath:"Properties[0].notices",
                btnhide: false,
                businessService:"RP",
                className: "review-documents",
                contents: [
                  {
                    label: "RP_NOTICE_ID",
                    jsonPath: "memoNumber",
                    url:`/rented-properties/noticestabNoticepreview?tenantId=${getTenantId()}`
                  },
                  {
                    label: "RP_NOTICE_TYPE",
                    jsonPath: "noticeType"
                  },
                  {
                    label: "RP_TRANSIT_SITE",
                    jsonPath: "property.transitNumber"
                  },
                  {
                    label: "RP_MEMO_DATE",
                    jsonPath: "memoDate",
                    type: "date"
                  }
                ]
              }
            },
        }
      }
    }
  };

  export default notices;