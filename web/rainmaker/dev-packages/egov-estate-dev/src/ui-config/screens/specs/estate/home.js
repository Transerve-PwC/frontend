import React from "react";
import { getCommonHeader } from "egov-ui-framework/ui-config/screens/specs/utils";

const header = getCommonHeader(
    {
      labelName: "Estate",
      labelKey: "TL_ESTATE_HEADER"
    },
    {
      classes: {
        root: "common-header-cont"
      }
    }
  );


 const estateHome = {
    uiFramework: "material-ui",
    name: "home",
    components: {
      div: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          header
        }
      },
    }
  };
  
  export default estateHome;