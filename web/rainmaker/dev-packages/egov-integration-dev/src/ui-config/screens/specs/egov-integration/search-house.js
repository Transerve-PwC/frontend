import {
    getBreak,
    getCommonHeader,
    getLabel,
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
  import set from "lodash/set";
  import { httpRequest } from "../../../../ui-utils";
  import { searchForm } from "./searchHouseResource/searchForm";
  import { searchResults } from "./searchHouseResource/searchResults";
  import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
  import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
  import commonConfig from '../../../../config/common';
  const hasButton = getQueryArg(window.location.href, "hasButton");
  let enableButton = true;
  //enableButton = hasButton && hasButton === "false" ? false : true;
  
  const header = getCommonHeader({
    labelName: "Search By HouseNo",
    labelKey: "INTIGRATION_SEARCH_BY_HOUSE",
  });
  
  const redirectproperty = async (state, dispatch) => {
    dispatch(setRoute(`/egov-integration/dashboardPT`));
  };
  
  const getMDMSData = async (action, state, dispatch) => {

    const tenantId = getTenantId();
  
    let mdmsBody = {
      
    };
  
    try {
      const payload = await httpRequest(
        "post",
        "/integration-services/pt/v1/_getSectorList",
        "_search",
        [],
        mdmsBody
      );
      dispatch(prepareFinalObject("searchScreenMdmsData", payload.ResponseBody[0]));
    } catch (e) {
      console.log(e);
    }
  };

  const getData = async (action, state, dispatch) => {

  
  };
  
  const sepSearchAndResult = {
    uiFramework: "material-ui",
    name: "search-house",
    beforeInitScreen: (action, state, dispatch) => {
            // fetching MDMS data
            getMDMSData(action, state, dispatch);
     
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
              newApplicationButton: {
                componentPath: "Button",
                gridDefination: {
                  xs: 12,
                  sm: 6,
                  align: "right",
                },
                visible: process.env.REACT_APP_NAME === "Employee"? false : true,
                props: {
                  variant: "contained",
                  color: "primary",
                  style: {
                    color: "white",
                    borderRadius: "2px",
                    width: "250px",
                    height: "48px",
                  },
                },
  
                children: {
                  plusIconInsideButton: {
                    uiFramework: "custom-atoms",
                    componentPath: "Icon",
                    props: {
                     // iconName: "add",
                      style: {
                        fontSize: "24px",
                      },
                    },
                  },
  
                  buttonLabel: getLabel({
                    labelName: "Search By Property Id",
                    labelKey: "INTIGRATION_SEARCH_BY_PROPERTY",
                  }),
                },
                onClickDefination: {
                  action: "condition",
                  callBack: redirectproperty,
                },
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
  