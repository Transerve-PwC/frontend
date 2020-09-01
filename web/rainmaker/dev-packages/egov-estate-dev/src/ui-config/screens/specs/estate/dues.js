import {
  getCommonHeader,
  getBreak,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { propertyDueDetails,duesSummaryForm,enterDuesForm } from "./dues-resource/search-dues-screen";
// import { accountStatementResults } from "./searchResource/searchResults";

const header = getCommonHeader({
  labelName: "DUES",
  labelKey: "ESTATE_DUES_HEADER"
});

const DuesDetails = {
  uiFramework: "material-ui",
  name: "search-account-statement",
  beforeInitScreen: (action, state, dispatch) => {
    dispatch(prepareFinalObject("searchScreen", {}))
    return action
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Form",
      props: {
        className: "common-div-css",
        id: "search"
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
            }
          }
        },
        propertyDueDetails,
        breakAfterSearch: getBreak(),
        duesSummaryForm,
        breakAfterSearch: getBreak(),
        enterDuesForm
      }
    }
  }
};

export default DuesDetails;