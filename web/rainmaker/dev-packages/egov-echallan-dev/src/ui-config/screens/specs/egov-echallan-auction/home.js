import { getCommonHeader, getLabel, getBreak } from "egov-ui-framework/ui-config/screens/specs/utils";
import { serachResultGrid } from "./searchResource/serachResultGrid";
import {searchResultApiResponse } from './searchResource/searchResultApiResponse'
import { setapplicationType } from "egov-ui-kit/utils/localStorageUtils/";

const header = getCommonHeader({
  labelName: "Manage Challan",
  labelKey: 'EC_AUCTION_CHALLAN'
});

const MANAGECHALLANSearchAndResult = {
  uiFramework: "material-ui",
  name: "home",
  beforeInitScreen: (action, state, dispatch) => {
    setapplicationType('e-Challan');
    searchResultApiResponse(action, state, dispatch);
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Form",
      props: {
        className: "common-div-css",
        id: "serachResultGrid"
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
        serachResultGrid
      }
    },
  }
};

export default MANAGECHALLANSearchAndResult;
