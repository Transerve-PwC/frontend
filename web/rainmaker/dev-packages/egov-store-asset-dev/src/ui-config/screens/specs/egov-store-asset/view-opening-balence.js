import {
    getBreak,
    getCommonHeader,
    getLabel,
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import { getCommonApplyFooter, validateFields } from "../utils";
  import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
  import set from "lodash/set";
  import { httpRequest,getsto } from "../../../../ui-utils";
  import { getstoreTenantId,getStoresSearchResults } from "../../../../ui-utils/storecommonsapi";

  import { getTenantId , getOPMSTenantId} from "egov-ui-kit/utils/localStorageUtils";
  import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
  import { OpeningBalanceReviewDetails } from "./viewopeningbalenceResource/openingbalance-review";
import { masterViewFooter } from "./viewopeningbalenceResource/footer";
import { getOpeningBalanceData } from "./viewopeningbalenceResource/functions";
  const hasButton = getQueryArg(window.location.href, "hasButton");
  let enableButton = true;
  export const getLabelWithValue = (label, value, props = {}) => {
    return {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      gridDefination: {
        xs: 12,
        sm: 6,
      },
      props: {
        style: {
          marginBottom: "16px",
          wordBreak: "break-word",
        },
        ...props,
      },
      children: {
        label: getCommonCaption(label),
        value: getCommonValue(value),
      },
    };
  };
  //Edit Button
  const callBackForEdit = async (state, dispatch) => {
    // window.location.href = `/employee/egov-store-asset/createStore?tenantId=${tenantId}&name=${storeName}&edited=true`;
    const applicationNumber = getQueryArg(window.location.href, "applicationNumber");
    const tenantId = getQueryArg(window.location.href, "tenantId");
    const createUrl =
      process.env.REACT_APP_SELF_RUNNING === "true"
        ? `/egov-ui-framework/egov-store-asset/createopeningbalence?applicationNumber=${applicationNumber}&tenantId=${tenantId}`
        : `/egov-store-asset/createopeningbalence?applicationNumber=${applicationNumber}&tenantId=${tenantId}`;
    dispatch(setRoute(createUrl));
  };
  export const footer = getCommonApplyFooter({
    editButton: {
      componentPath: "Button",
      props: {
        variant: "contained",
        color: "primary",
        style: {
          // minWidth: "200px",
          height: "48px",
          marginRight: "45px",
        },
      },
      children: {
        submitButtonLabel: getLabel({
          labelName: "Edit",
          labelKey: "STORE_DETAILS_EDIT_BUTTON",
        }),
      },
      onClickDefination: {
        action: "condition",
        callBack: callBackForEdit,
      },
    },
  });
  //enableButton = hasButton && hasButton === "false" ? false : true;
  
  const header = getCommonHeader({
    labelName: "Opening Balance",
    labelKey: "STORE_OPENING_BALANCE",
  });
  const masterView = OpeningBalanceReviewDetails(false);
  const createMaterialMasterHandle = async (state, dispatch) => {
    dispatch(setRoute(`/egov-store-asset/createopeningbalence`));
  };
  
  const getMDMSData = async (action, state, dispatch) => {
    const tenantId = getstoreTenantId();
    let mdmsBody = {
      MdmsCriteria: {
        tenantId: tenantId,
        moduleDetails: [
          {
            moduleName: "store-asset",
            masterDetails: [
              { name: "Material" },
              { name: "MaterialType"},
            ],
          },
         
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
  const getstoreData = async (action, state, dispatch) => {
    const tenantId = getTenantId();
    let queryObject = [
      {
        key: "tenantId",
        value: tenantId
      }];
    try {
      let response = await getStoresSearchResults(queryObject, dispatch);
      dispatch(prepareFinalObject("store", response));
    } catch (e) {
      console.log(e);
    }
  };
  
  const getData = async (action, state, dispatch) => {
    await getMDMSData(action, state, dispatch);
    await getstoreData(action,state, dispatch);
   
  };
  
  const screenConfig = {
    uiFramework: "material-ui",
    name: "view-opening-balence",
    beforeInitScreen: (action, state, dispatch) => {
      getData(action, state, dispatch);
      let applicationNumber = getQueryArg(window.location.href, "applicationNumber");
      let tenantId = getQueryArg(window.location.href, "tenantId"); 
     // let applicationNumber = getQueryArg(window.location.href, "applicationNumber");      
      getOpeningBalanceData(state, dispatch, applicationNumber, tenantId);
      return action;
    },
    components: {
      div: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        props: {
          className: "common-div-css"
        },
        children: {
          headerDiv: {
            uiFramework: "custom-atoms",
            componentPath: "Container",
            children: {
              header: {
                gridDefination: {
                  xs: 12,
                  sm: 10
                },
                ...header
              }
            }
          },
          taskStatus: {
            uiFramework: "custom-containers-local",
            componentPath: "WorkFlowContainer",
            moduleName: "egov-store-asset",
            visible: process.env.REACT_APP_NAME === "Citizen" ? false : true,
            props: {
              moduleName: "StoreManagement",
              dataPath: "materialReceipt",
              updateUrl: "/store-asset-services/openingbalance/_updateStatus"
            }
          },
          masterView,
          //footer,
         // footer: masterViewFooter()
        }
      },
     
      
    }
  };
  
  export default screenConfig;
  