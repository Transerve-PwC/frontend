import {
  dispatchMultipleFieldChangeAction,
  getLabel,
  convertEpochToDate
} from "egov-ui-framework/ui-config/screens/specs/utils";
import get from "lodash/get";
import { getCommonApplyFooter } from "../../utils";
import "./index.css";
import {  disabledFieldsAddEdit } from "./serachResultGrid";
import { getUserInfo } from "egov-ui-kit/utils/localStorageUtils/";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject, toggleSnackbar, toggleSpinner
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import store from "ui-redux/store";
import { showHideAdhocPopupTrue, clearlocalstorageAppDetails, } from "../../utils";


const pageResetAndChange = (state, dispatch, screenKey) => {
  
  dispatch(prepareFinalObject("ItemMaster", {}));
  showHideAdhocPopupTrue(state, dispatch, screenKey)
};
export const footer = getCommonApplyFooter({
 
  addButton: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        minWidth: "200px",
        height: "48px",
        marginRight: "40px"
      }
    },
    children: {
      buttonLabel: getLabel({
        labelName: "ADD ITEM MASTER",
        labelKey: 'EC_HOME_SEARCH_RESULTS_NEW_APP_BUTTON'
      }),
 
    },
       onClickDefination: {
            action: "condition",
            callBack: (state, dispatch) => {
              
              pageResetAndChange(state, dispatch, 'search');
            }
          },
          roleDefination: {
            rolePath: "user-info.roles",
            roles: ["challanEAO"],
            //path : "tradelicence/apply"

          }
    // onClickDefination: {
    //   action: "condition",
    //   callBack: updateAuctioDetails
    // }
  },
});
