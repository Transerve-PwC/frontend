import {
  getCommonHeader,
  getCommonContainer
} from "egov-ui-framework/ui-config/screens/specs/utils";

import { MasterReviewDetails } from "./viewMaterialMasterResource/master-review";
import { masterViewFooter } from "./viewMaterialMasterResource/footer";
import { getMaterialmasterData } from "./viewMaterialMasterResource/functions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";  
import { showHideAdhocPopup } from "../utils";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { httpRequest } from "../../../../ui-utils";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";

export const header = getCommonContainer({
  header: getCommonHeader({
    labelName: `View Material Master`,
    labelKey: "STORE_VIEW_MATERIAL_MASTER"
  })
});
const masterView = MasterReviewDetails(false);
const getMdmsData = async (action, state, dispatch, tenantId) => {
  const tenant = tenantId || getTenantId();
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: tenant,
      moduleDetails: [
        {
          moduleName: "egov-hrms",
          masterDetails: [
            {
              name: "DeactivationReason",
              filter: "[?(@.active == true)]"
            }
          ]
        },
        {
          moduleName: "common-masters",
          masterDetails: [
            { name: "UOM", filter: "[?(@.active == true)]" },
           
          ]
        }
      ]
    }
  };
  try {
    const payload = await httpRequest(
      "post",
      "/egov-mdms-service/v1/_search",
      "_search",
      [],
      mdmsBody
    );
    dispatch(prepareFinalObject("viewScreenMdmsData", payload.MdmsRes));
  } catch (e) {
    console.log(e);
  }
};

const screenConfig = {
  uiFramework: "material-ui",
  name: "view-material-master",
  beforeInitScreen: (action, state, dispatch) => {
    let code = getQueryArg(window.location.href, "code");
    let tenantId = getQueryArg(window.location.href, "tenantId");
   
   // showHideAdhocPopup(state, dispatch);
    getMdmsData(action, state, dispatch, tenantId);
    getMaterialmasterData(state, dispatch, code, tenantId);
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        className: "common-div-css"
      },
      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",
          children: {
            header: {
              gridDefination: {
                xs: 12,
                sm: 10
              },
              ...header
            }
          }
        },
        masterView,
        footer: masterViewFooter()
      }
    },
   
    
  }
};

export default screenConfig;
