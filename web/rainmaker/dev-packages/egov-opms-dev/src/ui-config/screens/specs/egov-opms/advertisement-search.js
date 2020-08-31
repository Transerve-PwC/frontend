import {
  getCommonHeader,
  getLabel,
  getBreak
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { searchResultsAdvertisement } from "./searchResource/searchResults";
import { setBusinessServiceDataToLocalStorage } from "egov-ui-framework/ui-utils/commons";
import { SearchFormForEmployee } from "./searchResource/EmployeeSearchForm";
import "./searchGrid.css";
import {
  getOPMSTenantId,
  localStorageGet,
  setapplicationType
} from "egov-ui-kit/utils/localStorageUtils";
import find from "lodash/find";
import set from "lodash/set";
import get from "lodash/get";
import {
  prepareFinalObject,
  handleScreenConfigurationFieldChange as handleField
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getRequiredDocuments } from "./requiredDocuments/reqDocs";
import { getGridDataAdvertisement, getTextAdvertisement } from "./searchResource/citizenSearchFunctions";

const hasButton = getQueryArg(window.location.href, "hasButton");
let enableButton = true;
enableButton = hasButton && hasButton === "false" ? false : true;

const header = getCommonHeader({
  labelName: "Advertisement NOC",
  labelKey: "ADVT_COMMON_NOC"
});


const NOCSearchAndResult = {
  uiFramework: "material-ui",
  name: "advertisement-search",
  beforeInitScreen: (action, state, dispatch) => {
    setapplicationType("ADVERTISEMENTNOC")
    //getGridDataAdvertisement(action, state, dispatch);


    const tenantId = getOPMSTenantId();
    const BSqueryObject = [
      { key: "tenantId", value: tenantId },
      { key: "businessServices", value: "ADVERTISEMENTNOC" }
    ];
    setBusinessServiceDataToLocalStorage(BSqueryObject, dispatch);
    const businessServiceData = JSON.parse(
      localStorageGet("businessServiceData")
    );
    const data = find(businessServiceData, { businessService: "ADVERTISEMENTNOC" });
    const { states } = data || [];
    if (states && states.length > 0) {
      const status = states.map((item, index) => {
        return {
          code: item.state,
          name: getTextAdvertisement(item.state, "0")
        }
      });
      let arr = status.slice(1)
      arr = arr.filter(item => item.code != "WITHDRAWREJECTED")
      arr = arr.filter(item => item.code != "WITHDRAWAPPROVAL")
      arr.push({ code: "APPROVEFORWITHDRAW", name: getTextAdvertisement("APPROVEFORWITHDRAW", "0") })
      arr.push({ code: "REJECTEFORWITHDRAW", name: getTextAdvertisement("REJECTEFORWITHDRAW", "0") })

      dispatch(
        prepareFinalObject(
          "applyScreenMdmsData.searchScreen.status",
          arr.filter(item => item.code != null)
        )
      );
    }
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Form",
      props: {
        className: "common-div-css",
        id: "advertisement-search"
      },
      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",

        },

        SearchFormForEmployee,
        breakAfterSearch: getBreak(),
        searchResultsAdvertisement
      }
    },
    adhocDialog: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-opms",
      componentPath: "DialogContainer",
      props: {
        open: false,
        maxWidth: false,
        screenKey: "advertisement-search"
      },
      children: {
        popup: {}
      }
    }
  }
};

export default NOCSearchAndResult;
