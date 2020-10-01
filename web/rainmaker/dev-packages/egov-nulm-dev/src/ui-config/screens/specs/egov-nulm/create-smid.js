import {
    getStepperObject,
    getCommonHeader,
    getCommonContainer
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import { footer } from "./createSMIDResource/footer";
  
  import { SMIDDetails } from "./createSMIDResource/smid-Details";
  import { documentDetails } from "./createSMIDResource/documentDetails";
  import get from "lodash/get";
  import set from "lodash/set";
  import { httpRequest } from "../../../../ui-utils";
  import { prepareFinalObject, handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
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
                name: "SMIDDocuments",
              },
              {
                name: "Qualification",
                
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
                      code: "NULM_SMID_DOCUMENT_GOVT_ID",
                      description: "Govt ID & Address Proof",
                      documentType: "smidDocument",
                      fileType: "PDF_IMAGE",
                      required: true, 
                    },
                    { accept: "application/pdf,image/*",
                      active: true,
                      code: "NULM_SMID_DOCUMENT_PHOTO_APPLICANT",
                      description: "Photo of the applicant",
                      documentType: "smidDocument",
                      fileType: "PDF_IMAGE",
                      required: true, 
                    }
                  
                  ]
    const resp = {SMIDDocuments}
   // dispatch(prepareFinalObject("applyScreenMdmsDocumentType.NULM", resp));
    dispatch(prepareFinalObject("applyScreenMdmsData", get(response, "MdmsRes")));
  
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
      // dispatch(
      //   handleField(
      //     state.screenConfiguration.screenConfig["create-smid"],
      //     "components.div.children.formwizardFirstStep.children.SMIDDetails.children.cardContent.children.SMIDDetailsContainer.children.minority",
      //     "props.style",
      //     { display: "none" }
      //   )
      // );
      let minority =
      get(state.screenConfiguration.preparedFinalObject, "NULMSMIDRequest.minority",false) 
      let isInsurance =
      get(state.screenConfiguration.preparedFinalObject, "NULMSMIDRequest.isInsurance",false) 
      let isStreetVendor =
      get(state.screenConfiguration.preparedFinalObject, "NULMSMIDRequest.isStreetVendor",false) 
      let isRegistered =
      get(state.screenConfiguration.preparedFinalObject, "NULMSMIDRequest.isRegistered",false) 
      let isHomeless =
      get(state.screenConfiguration.preparedFinalObject, "NULMSMIDRequest.isHomeless",false) 

      if(!isHomeless)
        dispatch(prepareFinalObject("NULMSMIDRequest.isHomeless","NO"));
      // if(minority)
      // {
      //  dispatch(
      //    handleField(
      //      "create-smid",
      //      "components.div.children.formwizardFirstStep.children.SMIDDetails.children.cardContent.children.SMIDDetailsContainer.children.minority",
      //      "props",
      //      { display: "inline-block" }
      //    )
      //  );
      // }
      // else{
      //  dispatch(
      //    handleField(
      //      "create-smid",
      //      "components.div.children.formwizardFirstStep.children.SMIDDetails.children.cardContent.children.SMIDDetailsContainer.children.minority",
      //      "props",
      //      { display: "none" }
      //    )
      //  );
   
      // }
      // set(
      //   action.screenConfig,
      //   "components.div.children.formwizardFirstStep.children.SMIDDetails.children.cardContent.children.SMIDDetailsContainer.children.minorityUI",
      //   { isFieldValid: true }
      // );
      if(!minority)
      {
        set(
          action.screenConfig,
          "components.div.children.formwizardFirstStep.children.SMIDDetails.children.cardContent.children.SMIDDetailsContainer.children.minorityUI.props.style",
          { display: "none" }
        );
        // dispatch(
        //   handleField(
        //     `create-smid`,
        //     "components.div.children.formwizardFirstStep.children.SMIDDetails.children.cardContent.children.SMIDDetailsContainer.children.minorityUI",
        //     "props.style",
        //     { display: "none" }
        //   )
        // );  
        
        dispatch(prepareFinalObject("NULMSMIDRequest.minority","NO"));
      }
 
      else
      {
        // dispatch(
        //   handleField(
        //     `create-smid`,
        //     "components.div.children.formwizardFirstStep.children.SMIDDetails.children.cardContent.children.SMIDDetailsContainer.children.minorityUI",
        //     "props.style",
        //     { display: "inline-block" }
        //   )
        // ); 
        set(
          action.screenConfig,
          "components.div.children.formwizardFirstStep.children.SMIDDetails.children.cardContent.children.SMIDDetailsContainer.children.minorityUI.props.style",
          { display: "inline-block" }
        );  
      }
      
      if(!isInsurance)
      {
        dispatch(prepareFinalObject("NULMSMIDRequest.insuranceThrough",null));
        dispatch(prepareFinalObject("NULMSMIDRequest.isInsurance","NO"));
        set(
          action.screenConfig,
          "components.div.children.formwizardFirstStep.children.SMIDDetails.children.cardContent.children.SMIDDetailsContainer.children.insuranceThrough.props.style",
          { display: "none" }
        );
      }
      
      else
      set(
        action.screenConfig,
        "components.div.children.formwizardFirstStep.children.SMIDDetails.children.cardContent.children.SMIDDetailsContainer.children.insuranceThrough.props.style",
        { display: "inline-block" }
      );
    
      if(!isStreetVendor)
      {
         dispatch(prepareFinalObject("NULMSMIDRequest.isRegistered","NO"));
         dispatch(prepareFinalObject("NULMSMIDRequest.isStreetVendor","NO"));
        // dispatch(
        //   handleField(
        //     `create-smid`,
        //     "components.div.children.formwizardFirstStep.children.SMIDDetails.children.cardContent.children.SMIDDetailsContainer.children.RegistredCMC",
        //     "props.style",
        //     { display: "none" }
        //   )
        // ); 
        set(
          action.screenConfig,
          "components.div.children.formwizardFirstStep.children.SMIDDetails.children.cardContent.children.SMIDDetailsContainer.children.RegistredCMC.props.style",
          { display: "none" }
        ); 
      }     
      else

      {
        set(
          action.screenConfig,
          "components.div.children.formwizardFirstStep.children.SMIDDetails.children.cardContent.children.SMIDDetailsContainer.children.RegistredCMC.props.style",
          { display: "inline-block" }
        ); 
      }
      // dispatch(
      //   handleField(
      //     `create-smid`,
      //     "components.div.children.formwizardFirstStep.children.SMIDDetails.children.cardContent.children.SMIDDetailsContainer.children.RegistredCMC",
      //     "props.style",
      //     { display: "inline-block" }
      //   )
      // ); 
      if(!isRegistered)
      {
        dispatch(prepareFinalObject("NULMSMIDRequest.cobNumber",''));
        set(
          action.screenConfig,
          "components.div.children.formwizardFirstStep.children.SMIDDetails.children.cardContent.children.SMIDDetailsContainer.children.cobNumber.props.style",
          { display: "none" }
        );
      }
   
      else
      set(
        action.screenConfig,
        "components.div.children.formwizardFirstStep.children.SMIDDetails.children.cardContent.children.SMIDDetailsContainer.children.cobNumber.props.style",
        { display: "inline-block" }
      );
     // dispatch(prepareFinalObject("NULMSMIDRequest.insuranceThrough",''));
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
  
  
  
  
  