import {
    getStepperObject,
    getCommonHeader,
    getCommonContainer
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import { footer } from "./createSMIDResource/footer";
  
  import { SMIDDetails } from "./createSMIDResource/smid-Details";
  import { documentDetails } from "./createSMIDResource/documentDetails";
  import get from "lodash/get";
  import { httpRequest } from "../../../../ui-utils";
  import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
  import { NULMConfiguration } from "../../../../ui-utils/sampleResponses";
  import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
  import { prepareDocumentsUploadData } from "../../../../ui-utils/storecommonsapi";
  import commonConfig from "../../../../config/common";
  
  export const stepsData = [
    { labelName: "SMID Details", labelKey: "NULM_APPLICATION_FOR_SMID_PROGRAM" },
    { labelName: "Documents", labelKey: "NULM_SEP_DOCUMENT_HEADER" },
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
        SMIDDetails
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
  
  // export const formwizardThirdStep = {
  //   uiFramework: "custom-atoms",
  //   componentPath: "Form",
  //   props: {
  //     id: "apply_form3"
  //   },
  //   children: {
  //     documentDetails
  //   },
  //   visible: false
  // };
  
  
  
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
  
    const SMIDDocuments = [{ accept: "application/pdf,image/*",
                      active: true,
                      code: "NULM_SMID_DOCUMENT_UPLOAD",
                      description: "Upload Relevent Document",
                      documentType: "smidDocument",
                      fileType: "PDF_IMAGE",
                      required: true, 
                    }]
    const resp = {SMIDDocuments}
    dispatch(prepareFinalObject("applyScreenMdmsData.NULM", resp));
//dispatch(prepareFinalObject("applyScreenMdmsData", get(response, "MdmsRes")));
  
      // setting documents
      prepareDocumentsUploadData(state, dispatch, 'SMIDApplication');
  
      return true;
    } catch (e) {
      console.log(e);
    }
  };
  
  
  const screenConfig = {
    uiFramework: "material-ui",
    name: `create-smid`,
    // hasBeforeInitAsync:true,
    beforeInitScreen: (action, state, dispatch) => {
  
      const mdmsDataStatus = getMdmsData(state, dispatch);
  
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
          formwizardSecondStep,
          footer
        }
      }
    }
  };
  
  export default screenConfig;
  
  
  
  
  