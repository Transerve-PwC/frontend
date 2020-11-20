import {
    getBreak,
    getCommonHeader,
    getLabel,
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions"; 
  import { searchForm } from "./linkconnectionResource/searchForm";
  import { searchResults } from "./linkconnectionResource/searchResults";
  import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
  
  const header = getCommonHeader({
    labelName: "Search Water & Sewerage Connection",
    labelKey: "WS_SEARCH_CONNECTION_HEADER",
  });
 
  
  const sepSearchAndResult = {
    uiFramework: "material-ui",
    name: "link-connection",
    beforeInitScreen: (action, state, dispatch) => {
           
     
      dispatch(prepareFinalObject("searchScreen", {}));
      return action;
    },
    components: {
      div: {
        uiFramework: "custom-atoms",
        componentPath: "Form",
        props: {
          className: "common-div-css",
          id: "search",
        },
        children: {
          headerDiv: {
            uiFramework: "custom-atoms",
            componentPath: "Container",
  
            children: {
              header: {
                gridDefination: {
                  xs: 12,
                  sm: 6,
                },
                ...header,
              },
              
            },
          },
          searchForm,
          breakAfterSearch: getBreak(),
          searchResults,
        },
      },
    },
  };
  
  export default sepSearchAndResult;
  