import {
  getCommonHeader,
  getLabel,
  getBreak
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { pressDetailsApplication} from "./searchResource/pressDetailsMasterCreate";
import { pressFooter } from "./applyResource/pressFooter";

import {
  prepareFinalObject,
  handleScreenConfigurationFieldChange as handleField
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  getQueryArg,
  getTransformedLocalStorgaeLabels,
  getLocaleLabels
} from "egov-ui-framework/ui-utils/commons";
import { getTenantId  } from "egov-ui-kit/utils/localStorageUtils";
import { httpRequest } from "../../../../ui-utils";
import {getPressMasterSearchResultsViewMain} from "../../../../ui-utils/commons";
import { localStorageGet } from "egov-ui-kit/utils/localStorageUtils";
import {
 
  furnishNocResponse_PressMaster
} from "../../../../ui-utils/commons";
import commonConfig from '../../../../config/common';


const header = getCommonHeader({
  labelName: "Create Press Master",
      labelKey: "PR_PRESS_DETAILS_CREATE_PRESS_MASTER"
});


const getMdmsData = async (action, state, dispatch) => {
 
  let tenantId =commonConfig.tenantId;

  let mdmsBody = {
    MdmsCriteria: {
      tenantId: tenantId,
      moduleDetails: [
        {
          moduleName: "RAINMAKER-PR",
          masterDetails: [{ name: "pressType" }]
        }]
       
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
export const prepareEditFlow = async (
  state,
  dispatch,
 
) => {
  

 let payload={
  "RequestBody":{ 
      "tenantId":getTenantId(),
      "pressMasterUuid":getQueryArg(window.location.href, "presstId"),
      "moduleCode":localStorageGet("modulecode")
     }
  
        }
        let response = await getPressMasterSearchResultsViewMain(payload)

        if(response.ResponseBody.length>0)
        {
         
         let Refurbishresponse = furnishNocResponse_PressMaster(response);
         dispatch(prepareFinalObject("PRESSDETAILS", Refurbishresponse));
       
        }

    
};
const pressDetails = {
  uiFramework: "material-ui",
  name: "pressDetailsMasterCreate",
  beforeInitScreen: (action, state, dispatch) => {
    dispatch(prepareFinalObject("PRESSDETAILS", {}));
  getMdmsData(action, state, dispatch)
let id=getQueryArg(window.location.href, "presstId")
if(id){
  prepareEditFlow(state, dispatch);
  
}
  
   
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Form",
      props: {
        className: "common-div-css",
        id: "pressDetailsMasterCreate"
      },
      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",

          children: {
            header: {
              gridDefination: {
                xs: 12,
                sm: 6
              },
              ...header
            },
           
          }
        },
         pressDetailsApplication,
         pressFooter 

      }
    },
    
    
  }
};

export default pressDetails;
