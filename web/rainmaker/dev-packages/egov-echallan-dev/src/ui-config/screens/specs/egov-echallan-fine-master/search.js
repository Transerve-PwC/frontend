import { getCommonHeader, getLabel, getBreak } from "egov-ui-framework/ui-config/screens/specs/utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { adhocPopup } from "./popup/addpopup"
import { serachResultGrid, disabledFieldsAddEdit } from "./searchResource/serachResultGrid";
import { searchResultApiResponse } from './searchResource/searchResultApiResponse'
import { setapplicationType, getTenantId, getUserInfo } from "egov-ui-kit/utils/localStorageUtils/";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject, toggleSnackbar, toggleSpinner
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import store from "ui-redux/store";
import { showHideAdhocPopup, clearlocalstorageAppDetails, checkForRole } from "../utils";
import get from "lodash/get";
import { footer } from "./searchResource/footer";
import { fetchMdmsData } from "../../../../ui-utils/commons";

const hasButton = getQueryArg(window.location.href, "hasButton");
let enableButton = true;
enableButton = hasButton && hasButton === "false" ? false : true;

let userInfo = JSON.parse(getUserInfo());
const roles = get(userInfo, "roles");

const header = getCommonHeader({
  labelName: "Fine Master",
  labelKey: "EC_FINE_MASTER_HEADER"
});

const FineMasterSearchAndResult = {
  uiFramework: "material-ui",
  name: "search",
  beforeInitScreen: (action, state, dispatch) => {
    clearlocalstorageAppDetails(state);
    setapplicationType('Fine-Master');
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
          }
        },
        breakAfterSearch: getBreak(),
        serachResultGrid,
        breakAfterSearch: getBreak(),
        footer : checkForRole(roles, 'challanEAO') ?  footer : {}
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
    }
  }
};

export default FineMasterSearchAndResult;
