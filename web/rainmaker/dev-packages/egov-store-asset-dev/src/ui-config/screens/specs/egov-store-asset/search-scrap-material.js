import {
    getBreak,
    getCommonHeader,
    getLabel,
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
  import set from "lodash/set";
  import { httpRequest } from "../../../../ui-utils";
  import { searchForm } from "./searchScrapResourse/searchForm";
  import { searchResults } from "./searchScrapResourse/searchResults";
  import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
  import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
  import { getSearchResults } from "../../../../ui-utils/commons";
  import commonConfig from '../../../../config/common';
  const hasButton = getQueryArg(window.location.href, "hasButton");
  let enableButton = true;
  //enableButton = hasButton && hasButton === "false" ? false : true;
  
  const header = getCommonHeader({
    labelName: "Scrap Material",
    labelKey: "STORE_SCRAP_CREATE_HEADER",
  });
  
  const addPurchaseOrderHandle = async (state, dispatch) => {
    dispatch(setRoute(`/egov-store-asset/create-scrap-material`));
  };
  
  const getMDMSData = async (action, state, dispatch) => {

    let mdmsBody = {
      MdmsCriteria: {
         tenantId: commonConfig.tenantId,
         moduleDetails: [
          {
            moduleName: "store-asset",
            masterDetails: [
              { name: "RateType", filter: "[?(@.active == true)]" }
            ],
  
          }
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
    await getMDMSData(action, state, dispatch);
  };
  
  const purchaseOrderSearchAndResult = {
    uiFramework: "material-ui",
    name: "search-scrap-material",
    beforeInitScreen: (action, state, dispatch) => {
        const queryObject = [{ key: "tenantId", value: getTenantId()  }];
            //fetching store name
            getSearchResults(queryObject, dispatch,"storeMaster")
            .then(response =>{
              if(response){
                const storeNames = response.stores.map(item => {
                  let code = item.code;
                  let name = item.name;
                  return{code,name}
                } )
                dispatch(prepareFinalObject("searchMaster.storeNames", storeNames));
              }
            });
      
            // fetching MDMS data
     // getData(action, state, dispatch);
     //set search param blank
dispatch(prepareFinalObject("searchScreen",{}));
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
                visible: false,
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
                    labelName: "Add Purchase Order",
                    labelKey: "STORE_ADD_NEW_PURCHASE_ORDR_BUTTON",
                  }),
                },
                onClickDefination: {
                  action: "condition",
                  callBack: addPurchaseOrderHandle,
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
  
  export default purchaseOrderSearchAndResult;
  