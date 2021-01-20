import {
    getCommonCard,
    getCommonContainer,
    getCommonTitle,
    getPattern,
    getSelectField,
    getTextField,
    getCommonHeader,
    getBreak,
    getCheckBoxwithLabel,
    getDateField,
    getLabel,
    getLabelWithValue,
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import {
    prepareDocumentsUploadData,
    
  } from "../../../../ui-utils/commons";

  import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
  import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";

  import get from "lodash/get";
  import { httpRequest } from "../../../../ui-utils/api";

import { documentDetails } from "./uploadResource/documentDetails";
import { footer } from "./uploadResource/footer";
export const header = getCommonContainer({
    header: getCommonHeader({
      labelName: `Bill Generation File Upload`,
      labelKey: "WS_BILL_GENERATION_FILE_UPLOAD",
    }),
  });
const screenConfig = {
    uiFramework: "material-ui",
    name: "upload",
    beforeInitScreen: (action, state, dispatch) => {
      const name = getQueryArg(window.location.href, "name");
      const edited = getQueryArg(window.location.href, "edited");
      let  DocumentType_wsbillupload= [
        {
            code: "WS_DOCUMENT_TYPE_BII_UPLOAD",
            isMandatory: true, 
            required:true,
            documentType:"STORE_DOCUMENT_TYPE_RATE_CONTRACT_QUATION"  , 
            url: '',       
            active: true
        },]
        // dispatch(
        //   prepareFinalObject("createScreenMdmsData", get(response, "MdmsRes"))
        // );
      dispatch(
        prepareFinalObject("DocumentType_wsbillupload", DocumentType_wsbillupload)
      );
      prepareDocumentsUploadData(state, dispatch, 'wsupload');
     
      return action;
    },
    components: {
      div: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        props: {
          className: "common-div-css",
        },
        children: {
          headerDiv: {
            uiFramework: "custom-atoms",
            componentPath: "Container",
            children: {
              header: {
                gridDefination: {
                  xs: 12,
                  sm: 10,
                },
                ...header,
              },
            },
          },
          documentDetails,
          footer,
        },
      },
    },
  };
  
  export default screenConfig;