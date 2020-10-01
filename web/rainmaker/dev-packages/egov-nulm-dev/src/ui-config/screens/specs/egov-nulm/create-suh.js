import {
    getStepperObject,
    getCommonHeader,
    getCommonContainer
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import { footer } from "./createSUHResource/footer";
  import { SuhDetails } from "./createSUHResource/suh-Details";
  import { facilityDetails } from "./createSUHResource/facility-available";
  import { recordMaintenance } from "./createSUHResource/record-maintenance";
  import { staffDetails } from "./createSUHResource/staff";
  import {otherDetails} from './createSUHResource/other-details'
  import { documentDetails } from "./createSUHResource/documentDetails";
  import get from "lodash/get";
  import { httpRequest } from "../../../../ui-utils";
  import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
  import { NULMConfiguration } from "../../../../ui-utils/sampleResponses";
  import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
  import { prepareDocumentsUploadData } from "../../../../ui-utils/storecommonsapi";
  import commonConfig from "../../../../config/common";
  import { getSearchResults } from "../../../../ui-utils/commons";
  export const stepsData = [
    { labelName: "SUH Details", labelKey: "NULM_SUH_DETAILS" },
    { labelName: "Facilities Available", labelKey: "NULM_SUH_FACILITIES_AVAILABLE" },
    { labelName: "Record Maintenance", labelKey: "NULM_SUH_RECORD_MAINTENANCE" },
    { labelName: "Staff", labelKey: "NULM_SUH_STAFF" },
    { labelName: "Other Details", labelKey: "NULM_SUH_OTHER_DETAILS" },
    { labelName: "Documents", labelKey: "NULM_SEP_DOCUMENT_HEADER" },
  ];
  export const stepper = getStepperObject(
    { props: { activeStep: 0 } },
    stepsData
  );
  
  
  export const header = getCommonContainer({
    header: getCommonHeader({
      labelName: `SUH Program`,
      labelKey: "NULM_APPLICATION_FOR_SUH_PROGRAM"
    })
  });
  
  export const formwizardFirstStep = {
    uiFramework: "custom-atoms",
    componentPath: "Form",
    props: {
      id: "apply_form1"
    },
    children: {
        SuhDetails
    }
  };
  
  export const formwizardSecondStep = {
    uiFramework: "custom-atoms",
    componentPath: "Form",
    props: {
      id: "apply_form2"
    },
    children: {
        facilityDetails
    },
    visible: false
  };
  
  export const formwizardThirdStep = {
    uiFramework: "custom-atoms",
    componentPath: "Form",
    props: {
      id: "apply_form3"
    },
    children: {
      recordMaintenance
    },
    visible: false
  };
  export const formwizardFourthStep = {
    uiFramework: "custom-atoms",
    componentPath: "Form",
    props: {
      id: "apply_form4"
    },
    children: {
      staffDetails
    },
    visible: false
  };
  
  export const formwizardFifthStep = {
    uiFramework: "custom-atoms",
    componentPath: "Form",
    props: {
      id: "apply_form5"
    },
    children: {
      otherDetails
    },
    visible: false
  };
  export const formwizardsixthStep = {
    uiFramework: "custom-atoms",
    componentPath: "Form",
    props: {
      id: "apply_form6"
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
                name: "shelterBackground"      
              },
              {
                name: "operationAndManagementOfShelters"      
              },
              {
                name: "shelterClassification"      
              },
              {
                name: "shelterOtherClassification"      
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
  
    const SUHDocuments = [{ accept: "application/pdf,image/*",
                      active: true,
                      code: "NULM_SUH_ADDRESS_PICTURE_1",
                      description: "Upload Address Picure 1",
                      documentType: "AddressPicture1",
                      fileType: "PDF_IMAGE",
                      required: true, 
                      },
                      { accept: "application/pdf,image/*",
                      active: true,
                      code: "NULM_SUH_ADDRESS_PICTURE_2",
                      description: "Upload Address Picure 2",
                      documentType: "AddressPicture2",
                      fileType: "PDF_IMAGE",
                      required: false, 
                      },
                      { accept: "application/pdf,image/*",
                      active: true,
                      code: "NULM_SUH_FACILITY_PICTURE_1",
                      description: "Upload Facility Picure 1",
                      documentType: "FacilityPicture1",
                      fileType: "PDF_IMAGE",
                      required: true, 
                      },
                      { accept: "application/pdf,image/*",
                      active: true,
                      code: "NULM_SUH_FACILITY_PICTURE_2",
                      description: "Upload Facility Picure 2",
                      documentType: "FacilityPicture2",
                      fileType: "PDF_IMAGE",
                      required: false, 
                    },
                      { accept: "application/pdf,image/*",
                      active: true,
                      code: "NULM_SUH_PROGRAM_PICTURE_1",
                      description: "Upload  Picure for  program 1",
                      documentType: "ProgramPicture1",
                      fileType: "PDF_IMAGE",
                      required: true, 
                    },
                    { accept: "application/pdf,image/*",
                    active: true,
                    code: "NULM_SUH_PROGRAM_PICTURE_2",
                    description: "Upload Picure for  program 2",
                    documentType: "ProgramPicture2",
                    fileType: "PDF_IMAGE",
                    required: false, 
                    },
                    { accept: "application/pdf,image/*",
                    active: true,
                    code: "NULM_SMID_DOCUMENT_UPLOAD",
                    description: "Upload Relevent Document",
                    documentType: "AdditionAttachment",
                    fileType: "PDF_IMAGE",
                    required: true, 
                  }]
    const resp = {SUHDocuments}
    dispatch(prepareFinalObject("applyScreenMdmsData.NULM", resp));
  dispatch(prepareFinalObject("createScreenMdmsData", get(response, "MdmsRes")));
  
      // setting documents
      prepareDocumentsUploadData(state, dispatch, 'SUHApplication');
  
      return true;
    } catch (e) {
      console.log(e);
    }
  };
  
  const getShelterName = async(action, state, dispatch) => {
    try{
      let OrganizationRequest = {};
      OrganizationRequest.tenantId = "ch.chandigarh";
      const requestBody = {OrganizationRequest}
      let response = await getSearchResults([],requestBody, dispatch,"organization");
      if(response){
        const shelterName = response.ResponseBody.map(orgObj => {
           let shelter = {};
           shelter.name = orgObj.organizationName;
           shelter.code = orgObj.organizationUuid;

           return shelter;
        });
        
        shelterName &&  dispatch(prepareFinalObject(`createScreenMdmsData1.NULM.assignTo`,shelterName));
   
      }
    }
    catch(err){
      console.log(err);
    }
}
  
  const screenConfig = {
    uiFramework: "material-ui",
    name: `create-suh`,
    // hasBeforeInitAsync:true,
    beforeInitScreen: (action, state, dispatch) => {
  
      const mdmsDataStatus = getMdmsData(state, dispatch);
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
          formwizardSecondStep,
          formwizardThirdStep,
          formwizardFourthStep,
          formwizardFifthStep,
          formwizardsixthStep,
          footer
        }
      }
    }
  };
  
  export default screenConfig;
  
  
  
  
  