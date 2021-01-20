import get from "lodash/get";
import {
  dispatchMultipleFieldChangeAction,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
    prepareDocumentsUploadData,
    savebillGeneration
} from "../../../../../ui-utils/commons";
import { convertDateToEpoch } from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { toggleSnackbar,prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  getButtonVisibility,
  getCommonApplyFooter,
  ifUserRoleExists,
  validateFields,
  epochToYmd,
  getLocalizationCodeValue
} from "../../utils";


export const getFileUrl = (linkText="") => {
  const linkList = linkText.split(",");
  let fileURL = '';
  linkList&&linkList.map(link => {
    if (!link.includes('large') && !link.includes('medium') && !link.includes('small')) {
      fileURL = link;
    }
  })
  return fileURL;
}

export const saveBilling = async (state, dispatch) => {
let fileUpload = false;
let fileUrl=''
// check validation for file uplaod
if (get(state.screenConfiguration.preparedFinalObject, "documentsUploadRedux") !== undefined) {
  fileUrl =
  get(state, "screenConfiguration.preparedFinalObject.documentsUploadRedux[0].documents[0].fileUrl",'') 
  let fileName =
  get(state, "screenConfiguration.preparedFinalObject.documentsUploadRedux[0].documents[0].fileName",'')
  if(fileUrl) 
{
fileUrl = getFileUrl(fileUrl)
fileUpload = true
}
}

  if(fileUpload)
  {
    try {
    
      const tenantId =  getTenantId();
      let queryObject = [
        {
          key: "tenantId",
          value: tenantId
        }
      ];
      let billGeneration={
        Document:{
          fileStoreUrl:fileUrl
        }
      }
      let response = await savebillGeneration(
        queryObject,        
        billGeneration,
        dispatch,      
      );
      if(response){
       
      }
    } catch (error) {
      //furnishindentData(state, dispatch);
    }

  }
  else{
    const errorMessage = {
      labelName: "Please upload valid file before submit",
      labelKey: "WS_UPLOAD_BILL_VALIDATION"
    };
    dispatch(toggleSnackbar(true, errorMessage, "warning"));
  }

};



export const footer = getCommonApplyFooter({

  payButton: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        minWidth: "200px",
        height: "48px",
        marginRight: "45px"
      }
    },
    children: {
      submitButtonLabel: getLabel({
        labelName: "Submit",
        labelKey: "STORE_COMMON_BUTTON_SUBMIT"
      }),
      submitButtonIcon: {
        uiFramework: "custom-atoms",
        componentPath: "Icon",
        props: {
          iconName: "keyboard_arrow_right"
        }
      }
    },
    onClickDefination: {
      action: "condition",
      callBack: saveBilling
    },
    visible: true
  }
});
