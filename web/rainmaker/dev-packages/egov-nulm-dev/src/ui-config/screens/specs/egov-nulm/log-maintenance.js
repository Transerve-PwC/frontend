import {
    getStepperObject,
    getCommonHeader,
    getCommonContainer
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import { footer } from "./createLogMaintenanceResource/footer";
  
  import { SUHLogDetails } from "./createLogMaintenanceResource/log-Details";
  import { documentDetails } from "./createLogMaintenanceResource/documentDetails";
  import get from "lodash/get";
  import { httpRequest } from "../../../../ui-utils";
  import { prepareFinalObject,handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
  import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
  import { prepareDocumentsUploadData } from "../../../../ui-utils/storecommonsapi";
  import commonConfig from "../../../../config/common";
  import { getSearchResults } from "../../../../ui-utils/commons";
  export const stepsData = [
    { labelName: "Log Details", labelKey: "NULM_SUH_LOG_DETAILS" },
  ];
  export const stepper = getStepperObject(
    { props: { activeStep: 0 } },
    stepsData
  );
  
  
  export const header = getCommonContainer({
    header: getCommonHeader({
      labelName: `SUH Log Maintenance`,
      labelKey: "NULM_SUH_LOG_MAINTENANCE"
    })
  });
  
  export const formwizardFirstStep = {
    uiFramework: "custom-atoms",
    componentPath: "Form",
    props: {
      id: "apply_form1"
    },
    children: {
      SUHLogDetails
    }
  };
  
  export const formwizardSecondStep = {
    uiFramework: "custom-atoms",
    componentPath: "Form",
    props: {
      id: "apply_form2"
    },
    children: {
      documentDetails
    },
    visible: false
  };

 
const getShelterName = async(action, state, dispatch) => {
    try{
      let NulmSuhRequest = {};
      NulmSuhRequest.tenantId = "ch.chandigarh";
      NulmSuhRequest.applicationStatus = "Approved";
      const requestBody = {NulmSuhRequest}
      let response = await getSearchResults([],requestBody, dispatch,"suhShelterName");
      if(response){
        const shelterName = response.ResponseBody.map(suhObj => {
           let shelter = {};
           shelter.name = suhObj.name_of_shelter;
           shelter.code = suhObj.name_of_shelter;

           return shelter;
        });
        
        shelterName &&  dispatch(prepareFinalObject(`createScreenMdmsData.shelterName`,shelterName));
   
      }
    }
    catch(err){
      console.log(err);
    }
}
  
  const screenConfig = {
    uiFramework: "material-ui",
    name: `log-maintenance`,
    // hasBeforeInitAsync:true,
    beforeInitScreen: (action, state, dispatch) => {
  
     getShelterName(action, state, dispatch);
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
          stepper,
          formwizardFirstStep,
          footer
        }
      }
    }
  };
  
  export default screenConfig;
  
  
  
  
  