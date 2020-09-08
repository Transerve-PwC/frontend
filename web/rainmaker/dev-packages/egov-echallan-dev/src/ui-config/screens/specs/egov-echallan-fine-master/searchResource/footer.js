import {
  dispatchMultipleFieldChangeAction,
  getLabel,
  convertEpochToDate
} from "egov-ui-framework/ui-config/screens/specs/utils";
import get from "lodash/get";
import { getCommonApplyFooter, checkForRole } from "../../utils";
import "./index.css";
import {  disabledFieldsAddEdit } from "./serachResultGrid";
import { getUserInfo } from "egov-ui-kit/utils/localStorageUtils/";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject, toggleSnackbar, toggleSpinner
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import store from "ui-redux/store";
import { showHideAdhocPopupTrue, clearlocalstorageAppDetails } from "../../utils";


const pageResetAndChange = (state, dispatch, screenKey) => {
  let userInfo = JSON.parse(getUserInfo());
  const roles = get(userInfo, "roles");
if(checkForRole(roles, 'challanEAO')){    
    isVisibility(true)
  }

  dispatch(prepareFinalObject("FineMaster", {}));
  dispatch(
    prepareFinalObject(
      "applyScreenMdmsData.egec.EncroachmentType-new",
      get(state, 'screenConfiguration.preparedFinalObject.applyScreenMdmsData.egec.EncroachmentType', [])
    )
  );
  disabledFieldsAddEdit(state,false);
  showHideAdhocPopupTrue(state, dispatch, screenKey)
};
const isVisibility=(isVisible)=>{
  
  if(isVisible){
   store.dispatch(
          handleField(
            "search",
            "components.adhocDialog.children.popup.children.header.children.div1.children.div",
            "props.visible",
            isVisible
          )
      ),
      store.dispatch(
        handleField(
          "search",
          "components.adhocDialog.children.popup.children.header.children.div1.children.div1",
          "visible",
          false
        )
      )
    }
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
        labelName: "ADD FINE MASTER",
        labelKey: 'EC_HOME_SEARCH_RESULTS_FINE_MASTER_NEW_APP_BUTTON'
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
