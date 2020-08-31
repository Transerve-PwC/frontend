import {
    getCommonGrayCard,
    getCommonSubHeader,
    getCommonContainer,
    getCommonTitle,
    getCommonHeader,
    getCommonCaption,
    getCommonValue,
    getLabel,
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import {
    handleScreenConfigurationFieldChange as handleField,
    prepareFinalObject,
    toggleSnackbar,
  } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import { getCommonApplyFooter, validateFields } from "../utils";
  import { getSearchResults } from "../../../../ui-utils/commons";
  import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
  import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
  import { httpRequest } from "../../../../ui-utils/api";
  const storeName = getQueryArg(window.location.href, "name");
  const tenantId = getQueryArg(window.location.href, "tenantId");
  const headerrow = getCommonContainer({
    header: getCommonHeader({ labelKey: "STORE_STOCK_AGING_SLABS" }),
    connectionNumber: {
      uiFramework: "custom-atoms-local",
      moduleName: "egov-opms-asset",
      componentPath: "ConsumerNoContainer",
      props: {
        number: 127676376,
      },
    },
  });
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
    window.location.href = `/employee/egov-store-asset/create-stock-slab?tenantId=${tenantId}&name=${storeName}&edited=true`;
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
  export const renderService = () => {
    return getCommonContainer({
      fromSlab: getLabelWithValue(
        { labelKey: "STORE_STOCK_AGING_FROM_SLAB" },
        {
          jsonPath: "stores[0].name",
        }
      ),
      toSlab: getLabelWithValue(
        { labelKey: "STORE_STOCK_AGING_TO_SLAB" },
        { jsonPath: "stores[0].code" }
      ),
      active: {
        uiFramework: "custom-containers-local",
        moduleName: "egov-store-asset",
        componentPath: "CheckboxContainer",
        jsonPath: "stores[0].active",
        gridDefination: {
          xs: 12,
        },
        isFieldValid: true,
        props: {
          content: "STORE_DETAILS_ACTIVE",
          jsonPath: "stores[0].active",
          id: "central-store",
          disabled: true,
          screenName: "view-stock-slab",
          checkBoxPath:
            "components.div.children.formwizardFirstStep.children.formDetail.children.cardContent.children.addStoreDetails.children.isCentralStore",
        },
      },
  
    });
  };
  
  export const getStockSlabDetails = () => {
    return getCommonGrayCard({
      headerDiv: {
        uiFramework: "custom-atoms",
        componentPath: "Container",
        props: {
          style: { marginBottom: "10px" },
        },
        children: {
          header: {
            gridDefination: {
              xs: 12,
              sm: 10,
            },
            ...getCommonSubHeader({
              labelKey: "STORE_COMMON_VIEW_STOCK_SLAB",
            }),
          },
        },
      },
      viewOne: renderService(),
    });
  };
  
    
  const stockSlabView = getStockSlabDetails();
  const screenConfig = {
    uiFramework: "material-ui",
    name: "view-stock-slab",
    beforeInitScreen: (action, state, dispatch) => {
  
      const queryObject = [{ key: "name", value: storeName  },{ key: "tenantId", value: tenantId  }];
  
      getSearchResults(queryObject, dispatch,"storeMaster")
      .then(response =>{
        dispatch(prepareFinalObject("stores", [...response.stores]));
      });
       return action;
    },
    components: {
      div: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        props: {
          className: "common-div-css search-preview",
          id: "connection-details",
        },
        children: {
          headerDiv: {
            uiFramework: "custom-atoms",
            componentPath: "Container",
            children: {
              header1: {
                gridDefination: {
                  xs: 12,
                  sm: 8,
                },
                ...headerrow,
              },
            },
          },
          stockSlabView,
          footer,
        },
      },
    },
  };
  
  export default screenConfig;
  