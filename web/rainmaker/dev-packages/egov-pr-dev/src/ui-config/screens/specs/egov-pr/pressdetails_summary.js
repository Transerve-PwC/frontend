import {
  getBreak,
  getCommonCard,
  getCommonContainer,
  getCommonHeader,
  getLabelWithValue,
  getStepperObject,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import {
  getFileUrlFromAPI,
  getQueryArg,
  getTransformedLocale,
  setBusinessServiceDataToLocalStorage
} from "egov-ui-framework/ui-utils/commons";
import jp from "jsonpath";
import get from "lodash/get";
import set from "lodash/set";
import {
  pressdetailsSummary  
} from "./summaryResourcePressdetails/pressdetailsSummary";
import {
  getAccessToken,
  getTenantId,
  getLocale,
  getUserInfo,
  getapplicationNumber
} from "egov-ui-kit/utils/localStorageUtils";

import { presssummaryfooter } from './applyResource/presssummaryfooter'

export const callBackForDelete = async (state, dispatch) => {
  changeStep(state, dispatch, "previous");
};



const screenConfig = {
  uiFramework: "material-ui",
  name: "pressdetails_summary",
 
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


            }
          }
        },
       
        body:  getCommonCard({         
          pressdetailsSummary: pressdetailsSummary,
          
        }),
         
        presssummaryfooter,
       }
    }
  }
};

export default screenConfig;
