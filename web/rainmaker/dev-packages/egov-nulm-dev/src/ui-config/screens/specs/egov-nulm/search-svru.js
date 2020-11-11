import {
    getBreak,
    getCommonHeader,
    getLabel,
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
  import set from "lodash/set";
  import { httpRequest } from "../../../../ui-utils";
  import { searchForm } from "./searchSVRUResource/searchForm";
  import { searchResults } from "./searchSVRUResource/searchResults";
  import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
  import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
  import commonConfig from '../../../../config/common';
  const hasButton = getQueryArg(window.location.href, "hasButton");
  let enableButton = true;
  //enableButton = hasButton && hasButton === "false" ? false : true;
  
  const header = getCommonHeader({
    labelName: "Street Vendor Registration Update",
    labelKey: "NULM_APPLICATION_FOR_SVRU_PROGRAM",
  });
  
  const createSEPHandle = async (state, dispatch) => {
    dispatch(setRoute(`/egov-nulm/create-svru`));
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
      value: "Created",
      label: "Created"
    },
    {
      value: "Forwarded to Task Force Committee",
      label: "Forwarded to Task Force Committee"
    },
    {
      value: "Approved by Task Force Committee",
      label: "Approved by Task Force Committee"
    },
    {
      value: "Rejected by Task Force Committee",
      label: "Rejected by Task Force Committee"
    },
    {
      value: "Sent to Bank for Processing",
      label: "Sent to Bank for Processing"
    },
    {
      value: "Sanctioned by Bank",
      label: "Sanctioned by Bank"
    },
   ]:[
      {
        value: "Created",
        label: "Created"
      },
      {
        value: "Forwarded to Task Force Committee",
        label: "Forwarded to Task Force Committee"
      },
      {
        value: "Approved by Task Force committee",
        label: "Approved by Task Force committee"
      },
      {
        value: "Rejected by Task Force committee",
        label: "Rejected by Task Force committee"
      },
      {
        value: "Sent to Bank for Processing",
        label: "Sent to Bank for Processing"
      },
      {
        value: "Sanctioned by Bank",
        label: "Sanctioned by Bank"
      },
      {
        value: "Drafted",
        label: "Created"
      },
     
    ];
    dispatch(prepareFinalObject("searchScreenMdmsData.svru.status", data));
   // await getMDMSData(action, state, dispatch);
  };
  
  const sepSearchAndResult = {
    uiFramework: "material-ui",
    name: "search-svru",
    beforeInitScreen: (action, state, dispatch) => {
            // fetching MDMS data
      getData(action, state, dispatch);
      dispatch(prepareFinalObject("NulmSusvRenewRequest", {}));
    dispatch(prepareFinalObject(`documentsUploadRedux`,{}));
    
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
                      iconName: "add",
                      style: {
                        fontSize: "24px",
                      },
                    },
                  },
  
                  buttonLabel: getLabel({
                    labelName: "Add svru",
                    labelKey: "NULM_ADD_NEW_SVRU_BUTTON",
                  }),
                },
                onClickDefination: {
                  action: "condition",
                  callBack: createSEPHandle,
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
  