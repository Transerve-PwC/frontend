import { getCommonContainer, getCommonHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { getTenantId, setapplicationType } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import set from "lodash/set";
import { httpRequest } from "../../../../ui-utils";
import { prepareDocumentsUploadData } from "../../../../ui-utils/commons";
import { clearlocalstorageAppDetails } from "../utils";
import { footer } from "./serviceRequestDetails/footer";
import { idProofDocumentDetails } from './serviceRequestDetails/idProofDocumentDetails';
import { ownerdetails } from './serviceRequestDetails/ownerdetails';
import { servicerequestdetails } from './serviceRequestDetails/servicerequestdetails';
import { uploadimage } from './serviceRequestDetails/uploadimage';





export const header = getCommonContainer({
  header: getCommonHeader({
    labelName: `Service Request`, 
    labelKey: "HC_SERVICE_REQUEST_HEADER"
  }),
  
  applicationNumber: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-hc",
    componentPath: "ApplicationNoContainer",
    props: {
      number: "NA"
    },
    visible: false
  }
});

export const formwizardImageStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form1"
  },
  children: {
    uploadimage
  }
};
export const formwizardIDProofStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form4"
  },
  children: {
    idProofDocumentDetails
  }
};
export const formwizardFirstStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form2"
  },
  children: {
    servicerequestdetails
  }
};

export const formwizardSecondStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form3"
  },
  children: {
    ownerdetails
  }
};



const getMdmsData = async (action, state, dispatch) => {

  let tenantId = getTenantId();
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: tenantId,
      moduleDetails: [
        {
          moduleName: "tenant",
          masterDetails: [
            {
              name: "tenants"
            }
          ]
        },
        {
          moduleName: "eg-horticulture",
          masterDetails: [
            {
              name: "ServiceType"
            },
            { name: "IDProofDocument" }
          ]
        },
        {
          moduleName: "RAINMAKER-PGR",
          masterDetails: [
            {
              name: "Sector"
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



const screenConfig = {
  uiFramework: "material-ui",
  name: "servicerequest",
  beforeInitScreen: (action, state, dispatch) => {
   
    let media = [];
    
    let servicerequestmedia = get(state, "form.newapplication.files.media", []);
    servicerequestmedia.map((item, index) => {
      media.push(item.fileStoreId)
    });
        
    
    set(state, "form.newapplication.files.media", []);
        
     
    const applicationNumber = getQueryArg(window.location.href, "applicationNumber");
    !applicationNumber ? clearlocalstorageAppDetails(state) : '';
    setapplicationType('HORTICULTURE');
 
    set(state, "screenConfiguration.moduleName", "hc");
 
    getMdmsData(action, state, dispatch).then(response => {
      prepareDocumentsUploadData(state, dispatch, 'serviceRequestIDProof');
    });
 
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
                xs: 18,
                sm: 20
              },
              ...header
            }
          }
        },
        
        formwizardImageStep,
        formwizardIDProofStep,
        formwizardFirstStep,
        formwizardSecondStep,       
        footer
      }
    }
  }
};

export default screenConfig;