import { getCommonHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
const header = getCommonHeader(
  {
    labelKey: "COMMON_HOW_IT_WORKS"
  },
  {
    classes: {
      root: "common-header-cont"
    }
  }
);

const screenConfig = {
    uiFramework: "material-ui",
    name: "how-it-works",
    components: {
      div: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          header: header,
          applicationsCard: {
            uiFramework: "custom-molecules-local",
            moduleName: "egov-tradelicence",
            componentPath: "TlHowItWorks"
          }
        }
      }
    }
  };
  
  export default screenConfig;