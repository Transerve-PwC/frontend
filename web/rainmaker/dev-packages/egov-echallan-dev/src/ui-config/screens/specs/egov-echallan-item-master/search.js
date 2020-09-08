import { getCommonHeader, getLabel, getBreak } from "egov-ui-framework/ui-config/screens/specs/utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { adhocPopup } from "./Popup/addPopup"
import { serachResultGrid } from "./searchResource/serachResultGrid";
import { searchResultApiResponse } from './searchResource/searchResultApiResponse'
import { setapplicationType } from "egov-ui-kit/utils/localStorageUtils/";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject, toggleSnackbar, toggleSpinner
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {footer} from "./searchResource/footer";

import { showHideAdhocPopup, clearlocalstorageAppDetails } from "../utils";
import { ItemMasterDeletionPopup } from "../egov-echallan/payResource/adhocPopup";

const hasButton = getQueryArg(window.location.href, "hasButton");
let enableButton = true;
enableButton = hasButton && hasButton === "false" ? false : true;

const pageResetAndChange = (state, dispatch, screenKey) => {
  
  dispatch(prepareFinalObject("ItemMaster", {}));
  showHideAdhocPopup(state, dispatch, screenKey)
};

const header = getCommonHeader({
  labelName: "Item Master",
  labelKey: "EC_ITEM_MASTER_HEADER"
});

const ITEMMASTERSearchAndResult = {
  uiFramework: "material-ui",
  name: "search",
  beforeInitScreen: (action, state, dispatch) => {
    clearlocalstorageAppDetails(state);
    setapplicationType('Item-Master');
    searchResultApiResponse(action, state, dispatch);
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Form",
      props: {
        className: "common-div-css",
        id: "serachResultGrid",
      },
      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",
          children: {
            header: {
              gridDefination: {
                xs: 12,
                sm: 6
              },
              ...header
            },
            //footer: footer
          }
        },
        //pendingApprovals,
        breakAfterSearch: getBreak(),
        serachResultGrid,
        breakAfterSearch: getBreak(),
        footer
      }
    },
    adhocDialog: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-echallan",
      componentPath: "PopupContainer",
      props: {
        open: false,
        maxWidth: "sm",
        screenKey: "search"
      },
      children: {
        popup: adhocPopup
      },
     
      // onClickDefination: {
      //   action: "condition",
      //   callBack: (state, dispatch) => {
      //     
      //     console.log("%%%%%")
      //     pageResetAndChange(state, dispatch, "create")
      //   }
      // }
    },
    deleteConfirmation: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-echallan",
      componentPath: "DeleteConfirmationContainer",
      props: {
        open: false,
        maxWidth: "sm",
        screenKey: "search"
      },
      children: {
        popup: ItemMasterDeletionPopup
      },
      visible: true
    },
  }
};

export default ITEMMASTERSearchAndResult;
