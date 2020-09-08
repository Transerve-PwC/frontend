import React from "react";
import { getCommonHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
import { getRequiredDocData, checkForRole } from "../utils";
import {
  getUserInfo, setOPMSTenantId, getTenantId, getOPMSTenantId
} from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import set from "lodash/set";
import { httpRequest } from "egov-ui-framework/ui-utils/api";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject
} from "egov-ui-framework/ui-redux/screen-configuration/actions";


let roles = JSON.parse(getUserInfo()).roles
const header = getCommonHeader(
  {
    labelName: "OPMS",
    labelKey: "ACTION_TEST_OPMS"
  },
  {
    style: {
      padding: "20px",
    }
  },
  {
    classes: {
      root: "common-header-cont"
    }
  }
);

let PETNOC = {
  label: {
    labelKey: "Permission to Keep Pet Dog",
    labelName: "Permission to Keep Pet Dog"
  },
  icon: <i
    viewBox="0 -8 35 42"
    color="primary"
    font-size="40px"
    class="material-icons module-page-icon" style={{ fontSize: "42px" }}>
    pets
  </i>,
  route: "search"
}

let SELLMEATNOC = {
  label: {
    labelKey: "Permission to Sell Meat",
    labelName: "Permission to Sell Meat"
  },
  icon: <i
    viewBox="0 -8 35 42"
    color="primary"
    class="material-icons module-page-icon" style={{ fontSize: "42px" }}>
    restaurant
  </i>,
  route: "sellmeat-search"
}

let ADVERTISEMENTNOC = {
  label: {
    labelKey: "Permission for Advertisement",
    labelName: "Permission for Advertisement"
  },
  icon: <i
    viewBox="0 -8 35 42"
    color="primary"
    class="material-icons module-page-icon" style={{ fontSize: "42px" }}>
    picture_in_picture
  </i>,
  route: "advertisement-search"
}
let ROADCUTNOC = {
  label: {
    labelKey: "Permission for Road Cut",
    labelName: "Permission for Road Cut"
  },
  icon: <i
    viewBox="0 -8 35 42"
    color="primary"
    class="material-icons module-page-icon" style={{ fontSize: "42px" }}>
    report_problem
  </i>,
  route: "roadcut-search"
}
let allCardList = [{ "code": "PETNOC", "value": PETNOC }, { "code": "SELLMEATNOC", "value": SELLMEATNOC },
{ "code": "ADVERTISEMENTNOC", "value": ADVERTISEMENTNOC },
{ "code": "ROADCUTNOC", "value": ROADCUTNOC }]


const getMdmsData = async (action, state, dispatch) => {

  let tenantId = getOPMSTenantId();
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: tenantId,
      moduleDetails: [
        {
          moduleName: "egpm",
          masterDetails: [
            {
              name: "cardList"
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
const setcardList = (state, dispatch) => {
  let mdmsCardList = get(state, "screenConfiguration.preparedFinalObject.applyScreenMdmsData.egpm.cardList",
    []
  );
  let employeeCardList = []
  let roles = JSON.parse(getUserInfo()).roles
  mdmsCardList.map((item, index) => {
    roles.some(r => {
      if (item.roles.includes(r.code)) {
        if (employeeCardList.length > 0) {
          if (!employeeCardList.find((x) => x.code == item.code)) {
            if (JSON.parse(getUserInfo()).type === "CITIZEN") {
              allCardList[index].value.route = item.routeCitizen;
              employeeCardList.push(allCardList[index])
            } else {
              employeeCardList.push(allCardList[index])
            }
          }
        } else {
          if (JSON.parse(getUserInfo()).type === "CITIZEN") {
            allCardList[index].value.route = item.routeCitizen;
            employeeCardList.push(allCardList[index])
          } else {
            employeeCardList.push(allCardList[index])
          }
        }
      }
    })
  });

  const cards = employeeCardList.map((item, index) => {
    return item.value
  });

  dispatch(
    handleField(
      "home",
      "components.div.children.applyCard",
      "props.items",
      cards
    )
  );
}
const PermissionManagementSearchAndResult = {
  uiFramework: "material-ui",
  name: "home",
  beforeInitScreen: (action, state, dispatch) => {
    let UsertenantInfo = JSON.parse(getUserInfo()).permanentCity;
    if (JSON.parse(getUserInfo()).type === "CITIZEN")
      setOPMSTenantId(UsertenantInfo);
    else
      setOPMSTenantId(getTenantId());

    getMdmsData(action, state, dispatch).then(response => {
      setcardList(state, dispatch)
    });
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      children: {
        header: header,
        applyCard: {
          uiFramework: "custom-molecules",
          componentPath: "LandingPage",
          props: {
            items: [],
            history: {},
            module: "PRSCP"
          }
        }
      }
    },
    adhocDialog: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-opms",
      componentPath: "DialogContainer",
      props: {
        open: false,
        maxWidth: false,
        screenKey: "home",


      },
      children: {
        popup: {}
      }
    }
  }
};

export default PermissionManagementSearchAndResult;
