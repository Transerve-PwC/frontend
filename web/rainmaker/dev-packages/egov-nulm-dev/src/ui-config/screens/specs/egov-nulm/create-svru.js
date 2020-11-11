import {
  getStepperObject,
  getCommonHeader,
  getCommonContainer
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { footer } from "./createSVRUResource/footer";

import { SepDetails } from "./createSVRUResource/sep-Details";
import { documentDetails } from "./createSVRUResource/documentDetails";
import get from "lodash/get";
import set from "lodash/set";
import { httpRequest } from "../../../../ui-utils";
import { prepareFinalObject,handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { NULMConfiguration } from "../../../../ui-utils/sampleResponses";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { prepareDocumentsUploadData } from "../../../../ui-utils/storecommonsapi";
import commonConfig from "../../../../config/common";
import { TFCDetails } from './createSVRUResource/tfc-details';
import { bankDetailToProcess } from './createSVRUResource/bankDetailToProcess';
import { SanctionDetails } from './createSVRUResource/sanctionDetails';
import {NULM_SEP_CREATED,
  FORWARD_TO_TASK_FORCE_COMMITTEE,
  APPROVED_BY_TASK_FORCE_COMMITTEE,
  REJECTED_BY_TASK_FORCE_COMMITTEE,
  SENT_TO_BANK_FOR_PROCESSING,
SANCTION_BY_BANK} from '../../../../ui-utils/commons'
export const stepsData = [
  { labelName: "Street Vendor Details", labelKey: "NULM_SVRU_VENDER_HEARDER" },
  { labelName: "Documents", labelKey: "NULM_SEP_DOCUMENT_HEADER" },
];
export const stepper = getStepperObject(
  { props: { activeStep: 0 } },
  stepsData
);


export const header = getCommonContainer({
  header: getCommonHeader({
    labelName: `Street Vendor Registration Update`,
    labelKey: "NULM_APPLICATION_FOR_SVRU_PROGRAM"
  })
});

const formAvailabiltyBaseOnStatus = () => {
    const status = window.localStorage.getItem("SEP_Status");
    switch(status){
      case NULM_SEP_CREATED : return {SepDetails}
      case FORWARD_TO_TASK_FORCE_COMMITTEE :  return {SepDetails,TFCDetails}
      case APPROVED_BY_TASK_FORCE_COMMITTEE :  return {SepDetails,TFCDetails,bankDetailToProcess}
      case REJECTED_BY_TASK_FORCE_COMMITTEE :   return {SepDetails,TFCDetails,bankDetailToProcess}
      case SENT_TO_BANK_FOR_PROCESSING :   return {SepDetails,TFCDetails,bankDetailToProcess,SanctionDetails}
      case SANCTION_BY_BANK :    return {SepDetails,TFCDetails,bankDetailToProcess,SanctionDetails}
      default : return {SepDetails}
    }
   
}

export const formwizardFirstStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form1"
  },
  children: formAvailabiltyBaseOnStatus()
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
              name: "SUSVRDocuments",

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

    //  let DocumentType_PriceList = NULMConfiguration().DocumentType_SEP;
    dispatch(prepareFinalObject("applyScreenMdmsData", get(response, "MdmsRes")));

    // setting documents
    prepareDocumentsUploadData(state, dispatch, 'SVRUApplication');

    return true;
  } catch (e) {
    console.log(e);
  }
};


const screenConfig = {
  uiFramework: "material-ui",
  name: `create-svru`,
  // hasBeforeInitAsync:true,
  beforeInitScreen: (action, state, dispatch) => {
    
    const mdmsDataStatus = getMdmsData(state, dispatch);
    if(state.screenConfiguration.preparedFinalObject && state.screenConfiguration.preparedFinalObject.NulmSusvRenewRequest){

      const {NulmSusvRenewRequest} = state.screenConfiguration.preparedFinalObject ;
      if(NulmSusvRenewRequest && NulmSusvRenewRequest.applicationUuid){
      const radioButtonValue = ["changeOfLocation",];
    
      radioButtonValue.forEach(value => {
        if(NulmSusvRenewRequest[value] && NulmSusvRenewRequest[value]=== true ){
          dispatch(prepareFinalObject(`NulmSusvRenewRequest[${value}]`, "Yes" ));
        }else{
          dispatch(prepareFinalObject(`NulmSusvRenewRequest[${value}]`, "No" ));
        }
      })

      
    }
    else{
      const radioButtonValue = ["changeOfLocation",];
      radioButtonValue.forEach(value => {
        
          dispatch(prepareFinalObject(`NulmSusvRenewRequest[${value}]`, "No" ));
        
      })
     // dispatch(prepareFinalObject(`NulmSusvRenewRequest.isDisabilityCertificateAvailable`, "No" ));
    }
    if(NulmSusvRenewRequest)
    {
      if(NulmSusvRenewRequest.lookingFor !== undefined)
      {

      if( NulmSusvRenewRequest.lookingFor ==='Application for Transfer of Registration on Death Cases')
      {
        set(
          action.screenConfig,
          "components.div.children.formwizardFirstStep.children.SepDetails.children.cardContent.children.SepDetailsContainer.children.nameOfProposedNewStreetVendor.props.style",
          { display: "inline-block" }
        ); 
        set(
          action.screenConfig,
          "components.div.children.formwizardFirstStep.children.SepDetails.children.cardContent.children.SepDetailsContainer.children.nominieedetails.props.style",
          { display: "none" }
        );        
        
      }
      else
      {
        set(
          action.screenConfig,
          "components.div.children.formwizardFirstStep.children.SepDetails.children.cardContent.children.SepDetailsContainer.children.nameOfProposedNewStreetVendor.props.style",
          { display: "none" }
        ); 
        set(
          action.screenConfig,
          "components.div.children.formwizardFirstStep.children.SepDetails.children.cardContent.children.SepDetailsContainer.children.nominieedetails.props.style",
          { display: "none" }
        );
        
      }
    }
    else
    {
      set(
        action.screenConfig,
        "components.div.children.formwizardFirstStep.children.SepDetails.children.cardContent.children.SepDetailsContainer.children.nameOfProposedNewStreetVendor.props.style",
        { display: "none" }
      ); 
      set(
        action.screenConfig,
        "components.div.children.formwizardFirstStep.children.SepDetails.children.cardContent.children.SepDetailsContainer.children.nominieedetails.props.style",
        { display: "none" }
      );

    }
      if(NulmSusvRenewRequest.lookingFor === true)
      {
        set(
          action.screenConfig,
          "components.div.children.formwizardFirstStep.children.SepDetails.children.cardContent.children.SepDetailsContainer.children.proposedAddress.props.style",
          { display: "inline-block" }
        );

      }
      else
      {
        set(
          action.screenConfig,
          "components.div.children.formwizardFirstStep.children.SepDetails.children.cardContent.children.SepDetailsContainer.children.proposedAddress.props.style",
          { display: "none" }
        );

      }    
  
    }
    else
    {
      set(
        action.screenConfig,
        "components.div.children.formwizardFirstStep.children.SepDetails.children.cardContent.children.SepDetailsContainer.children.nameOfProposedNewStreetVendor.props.style",
        { display: "none" }
      ); 
      set(
        action.screenConfig,
        "components.div.children.formwizardFirstStep.children.SepDetails.children.cardContent.children.SepDetailsContainer.children.nominieedetails.props.style",
        { display: "none",width:"100%" }
      ); 
      set(
        action.screenConfig,
        "components.div.children.formwizardFirstStep.children.SepDetails.children.cardContent.children.SepDetailsContainer.children.proposedAddress.props.style",
        { display: "none" }
      );
      
    }
  }
  else{
    set(
      action.screenConfig,
      "components.div.children.formwizardFirstStep.children.SepDetails.children.cardContent.children.SepDetailsContainer.children.nameOfProposedNewStreetVendor.props.style",
      { display: "none" }
    ); 
    set(
      action.screenConfig,
      "components.div.children.formwizardFirstStep.children.SepDetails.children.cardContent.children.SepDetailsContainer.children.nominieedetails.props.style",
      { display: "none" }
    );
  }


 

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
        // formwizardThirdStep,


        footer
      }
    }
  }
};

export default screenConfig;




