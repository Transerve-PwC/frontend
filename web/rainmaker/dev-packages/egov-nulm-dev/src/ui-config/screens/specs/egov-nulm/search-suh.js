import {
    getBreak,
    getCommonHeader,
    getLabel,
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
  import set from "lodash/set";
  import { httpRequest } from "../../../../ui-utils";
  import { searchForm } from "./searchSUHResource/searchForm";
  import { searchResults } from "./searchSUHResource/searchResults";
  import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
  import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
  import commonConfig from '../../../../config/common';
  const hasButton = getQueryArg(window.location.href, "hasButton");
  let enableButton = true;
  //enableButton = hasButton && hasButton === "false" ? false : true;
  
  const header = getCommonHeader({
    labelName: "SUH Program",
    labelKey: "NULM_APPLICATION_FOR_SUH_PROGRAM",
  });
  
  const createSUHHandle = async (state, dispatch) => {
    dispatch(setRoute(`/egov-nulm/create-suh`));
  };
  
  const getMDMSData = async (action, state, dispatch) => {

    const tenantId = getTenantId();
  
    let mdmsBody = {
      MdmsCriteria: {
         tenantId: commonConfig.tenantId,
         moduleDetails: [
          {
            moduleName: "tenant",
            masterDetails: [{ name: "tenants" }],
          },
        ],
      },
    };
  
    try {
      const payload = await httpRequest(
        "post",
        "/egov-mdms-service/v1/_search",
        "_search",
        [],
        mdmsBody
      );
      dispatch(prepareFinalObject("searchScreenMdmsData", payload.MdmsRes));
    } catch (e) {
      console.log(e);
    }
  };

  const getData = async (action, state, dispatch) => {

   const  data =  process.env.REACT_APP_NAME === "Employee" ?  [
    {
      value: "CREATED",
      label: "Created"
    },
    {
      value: "APPROVED",
      label: "Approved"
    },
    {
      value: "REJECTED",
      label: "Rejected"
    }
   ]:[
      {
        value: "CREATED",
        label: "Created"
      },
      {
        value: "DRAFTED",
        label: "Drafted"
      },
      {
        value: "APPROVED",
        label: "Approved"
      },
      {
        value: "REJECTED",
        label: "Rejected"
      }
    ];
    dispatch(prepareFinalObject("searchScreenMdmsData.suh.status", data));
   // await getMDMSData(action, state, dispatch);
  };
  
  const suhSearchAndResult = {
    uiFramework: "material-ui",
    name: "search-suh",
    beforeInitScreen: (action, state, dispatch) => {
      dispatch(prepareFinalObject("NulmSuhRequest", {}));  
      dispatch(prepareFinalObject("searchScreen", {}));
            // fetching MDMS data
      getData(action, state, dispatch);
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
                visible: process.env.REACT_APP_NAME === "Employee"? true : false,
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
                      iconName: "add",
                      style: {
                        fontSize: "24px",
                      },
                    },
                  },
  
                  buttonLabel: getLabel({
                    labelName: "Add SUH",
                    labelKey: "NULM_ADD_NEW_SUH_BUTTON",
                  }),
                },
                onClickDefination: {
                  action: "condition",
                  callBack: createSUHHandle,
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
  
  export default suhSearchAndResult;
  