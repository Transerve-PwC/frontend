import {
    getBreak,
    getCommonHeader,
    getLabel,
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
  import set from "lodash/set";
  import { httpRequest } from "../../../../ui-utils";
  import { searchForm } from "./searchPurchaseOrderResourse/searchForm";
  import { searchResults } from "./searchPurchaseOrderResourse/searchResults";
  import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
  import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
  import { getSearchResults } from "../../../../ui-utils/commons";
  import commonConfig from '../../../../config/common';
  import{UserRoles} from '../../../../ui-utils/sampleResponses'
  let roles = UserRoles().UserRoles;
  const hasButton = getQueryArg(window.location.href, "hasButton");
  let enableButton = true;
  //enableButton = hasButton && hasButton === "false" ? false : true;
  
  const header = getCommonHeader({
    labelName: "Non-Indent PO/Purchase Indent PO",
    labelKey: "STORE_COMMON_PURCHASE_ORDER",
  });
  
  const addPurchaseOrderHandle = async (state, dispatch) => {
    dispatch(setRoute(`/egov-store-asset/create-purchase-order`));
  };
  
  const getMDMSData = async (action, state, dispatch) => {

    const tenantId = getTenantId();
  
    let mdmsBody = {
      MdmsCriteria: {
         tenantId: commonConfig.tenantId,
         moduleDetails: [
          {
            moduleName: "store-asset",
            masterDetails: [
              { name: "PORateType", filter: "[?(@.active == true)]" },
              { name: "InventoryType", filter: "[?(@.active == true)]" },
              { name: "IndentPurpose"},// filter: "[?(@.active == true)]" },
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
  const getcreatorList = async (action, state, dispatch) => {
    const tenantId = getTenantId();  
    let queryObject = [
      {
        key: "tenantId",
        value: tenantId
      }];
  
    try {
     let response = await getSearchResults(queryObject, dispatch,"creatorList");

      if(response)
      {
        let payloadprocess = [];
    for (let index = 0; index < response.users.length; index++) {
      const element = response.users[index];
      let pay = {
        element: element
      }
      payloadprocess.push(pay);
    }
    dispatch(prepareFinalObject("applyScreenMdmsData.creatorList", payloadprocess));
      }
      
    } catch (e) {
      console.log(e);
    }
  };

  const getData = async (action, state, dispatch) => {
    await getMDMSData(action, state, dispatch);
    await getcreatorList(action, state, dispatch)
  };
  
  const purchaseOrderSearchAndResult = {
    uiFramework: "material-ui",
    name: "search-purchase-order",
    beforeInitScreen: (action, state, dispatch) => {
            // fetching store name for populating dropdown
            const queryObject = [{ key: "tenantId", value: getTenantId()  }];
  
            getSearchResults(queryObject, dispatch,"supplier")
            .then(response =>{
              if(response){
                const supplierNames = response.suppliers.map(item => {
                  let code = item.code;
                  let name = item.name;
                  return{code,name}
                } )
                dispatch(prepareFinalObject("searchMaster.supplierName", supplierNames));
              }
            });
        
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
      getData(action, state, dispatch);
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
                visible: enableButton,
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
                roleDefination: {
                  rolePath: "user-info.roles",
                  roles: roles
                }
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
  