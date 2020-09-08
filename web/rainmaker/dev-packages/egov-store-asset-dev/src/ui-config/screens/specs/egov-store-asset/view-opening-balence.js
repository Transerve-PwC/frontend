import {
    getBreak,
    getCommonHeader,
    getLabel,
  } from "egov-ui-framework/ui-config/screens/specs/utils";
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
      let id = getQueryArg(window.location.href, "id");
      let tenantId = getQueryArg(window.location.href, "tenantId");     
      getOpeningBalanceData(state, dispatch, id, tenantId);
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
          masterView,
          footer: masterViewFooter()
        }
      },
     
      
    }
  };
  
  export default screenConfig;
  