import {
    getBreak,
    getCommonHeader,
    getLabel,
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
  import set from "lodash/set";
  import { httpRequest } from "../../../../ui-utils";
  import { searchForm } from "./searchSupplierMasterResource/searchForm";
  import { searchResults } from "./searchSupplierMasterResource/searchResults";
  import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
  import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
  import commonConfig from '../../../../config/common';
  import { getSearchResults } from "../../../../ui-utils/commons";
  const hasButton = getQueryArg(window.location.href, "hasButton");
  let enableButton = true;
  //enableButton = hasButton && hasButton === "false" ? false : true;
  
  const header = getCommonHeader({
    labelName: "Supplier Master",
    labelKey: "STORE_COMMON_SUPPLIER_MASTER",
  });
  
  const createSupplierMasterHandle = async (state, dispatch) => {
    dispatch(setRoute(`/egov-store-asset/create-supplier-master`));
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
              { name: "SupplierType", filter: "[?(@.active == true)]" }
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
  
  const getData = async (action, state, dispatch) => {
    await getMDMSData(action, state, dispatch);
    const queryObject = [{ key: "tenantId", value: getTenantId()  }];
  
    getSearchResults(queryObject, dispatch,"supplier")
    .then(response =>{

      if(response){
        const supplierNames = response.suppliers.map(item => {
          let code = item.name;
          let name = item.name;
          return{code,name}
        } )
        dispatch(prepareFinalObject("searhSupplierMaster.supplierName", supplierNames));
      }
    });
  };
  
  const supplierMasterSearchAndResult = {
    uiFramework: "material-ui",
    name: "search-supplier-master",
    beforeInitScreen: (action, state, dispatch) => {
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
                    labelName: "Add Supplier Master",
                    labelKey: "STORE_ADD_NEW_SUPPLIER_MATERIAL_BUTTON",
                  }),
                },
                onClickDefination: {
                  action: "condition",
                  callBack: createSupplierMasterHandle,
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
  
  export default supplierMasterSearchAndResult;
  