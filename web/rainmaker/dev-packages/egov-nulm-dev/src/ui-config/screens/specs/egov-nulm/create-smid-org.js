import {
    getStepperObject,
    getCommonHeader,
    getCommonContainer
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import { footer } from "./createSMIDOrgResources/footer";
  
  import { SMIDOrgDetails } from "./createSMIDOrgResources/org-Details";
  import { documentDetails } from "./createSMIDOrgResources/documentDetails";
  import get from "lodash/get";
  import { httpRequest } from "../../../../ui-utils";
  import { prepareFinalObject,handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
  import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
  import { prepareDocumentsUploadData } from "../../../../ui-utils/storecommonsapi";
  import commonConfig from "../../../../config/common";
  
  export const stepsData = [
    { labelName: "SMID Details", labelKey: "NULM_APPLICATION_FOR_SMID_DETAILS" },
  ];
  export const stepper = getStepperObject(
    { props: { activeStep: 0 } },
    stepsData
  );
  
  
  export const header = getCommonContainer({
    header: getCommonHeader({
      labelName: `Application for SMID program`,
      labelKey: "NULM_APPLICATION_FOR_SMID_PROGRAM"
    })
  });
  
  export const formwizardFirstStep = {
    uiFramework: "custom-atoms",
    componentPath: "Form",
    props: {
      id: "apply_form1"
    },
    children: {
      SMIDOrgDetails
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

 
  const getMdmsData = async (state, dispatch) => {
    let tenantId = commonConfig.tenantId;
    let mdmsBody = {
      MdmsCriteria: {
        tenantId: tenantId,
        moduleDetails: [
          {
            moduleName: "NULM",
            masterDetails: [
              {
                name: "SEPDocuments",
              }
            ]
          },
  
  
        ]
      }
    };
    try {
      const response = await httpRequest(
        "post",
        "/egov-mdms-service/v1/_search",
        "_search",
        [],
        mdmsBody
      );
      // document type 
  
      //  let DocumentType_PriceList = NULMConfiguration().DocumentType_SEP;
      dispatch(prepareFinalObject("applyScreenMdmsData", get(response, "MdmsRes")));
  
      // setting documents
      prepareDocumentsUploadData(state, dispatch, 'SEPApplication');
  
      return true;
    } catch (e) {
      console.log(e);
    }
  };
  
  
  const screenConfig = {
    uiFramework: "material-ui",
    name: `create-smid-org`,
    // hasBeforeInitAsync:true,
    beforeInitScreen: (action, state, dispatch) => {
  
    //  const mdmsDataStatus = getMdmsData(state, dispatch);
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
        //  formwizardSecondStep,
          footer
        }
      }
    }
  };
  
  export default screenConfig;
  
  
  
  
  