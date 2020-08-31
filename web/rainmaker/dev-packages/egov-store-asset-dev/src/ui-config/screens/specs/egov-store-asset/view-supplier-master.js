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
  import commonConfig from '../../../../config/common';
  import { httpRequest } from "../../../../ui-utils/api";
  import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
  const supplierName = getQueryArg(window.location.href, "name");
  const tenantId = getQueryArg(window.location.href, "tenantId");
  const headerrow = getCommonContainer({
    header: getCommonHeader({ labelKey: "STORE_COMMON_SUPPLIER_MASTER" }),
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
    window.location.href = `/employee/egov-store-asset/create-supplier-master?tenantId=${tenantId}&name=${supplierName}&edited=true`;
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
      type: getLabelWithValue(
        { labelKey: "STORE_SUPPLIER_MASTER_SUPPLIER_TYPE" },
        { jsonPath: "suppliers[0].type" }
      ),
      name: getLabelWithValue(
        { labelKey: "STORE_SUPPLIER_MASTER_SUPPLIER_NAME" },
        { jsonPath: "suppliers[0].name" }
      ),
      code: getLabelWithValue(
        { labelKey: "STORE_SUPPLIER_MASTER_SUPPLIER_CODE" },
        {
          jsonPath: "suppliers[0].code",
        }
      ),
      address: getLabelWithValue(
        { labelKey: "STORE_SUPPLIER_MASTER_SUPPLIER_ADDRESS" },
        { jsonPath: "suppliers[0].address" }
      ),
      contactNo: getLabelWithValue(
        { labelKey: "STORE_SUPPLIER_MASTER_SUPPLIER_CONTACT" },
        { jsonPath: "suppliers[0].contactNo" }
      ),
      faxNo: getLabelWithValue(
        { labelKey: "STORE_SUPPLIER_MASTER_SUPPLIER_FAX" },
        { jsonPath: "suppliers[0].faxNo" }
      ),
      website: getLabelWithValue(
        { labelKey: "STORE_SUPPLIER_MASTER_SUPPLIER_WEBSITE" },
        { jsonPath: "suppliers[0].website" }
      ),
      email: getLabelWithValue(
        { labelKey: "STORE_SUPPLIER_MASTER_SUPPLIER_EMAIL" },
        { jsonPath: "suppliers[0].email" }
      ),
      description: getLabelWithValue(
        { labelKey: "STORE_SUPPLIER_MASTER_SUPPLIER_NARRATION" },
        { jsonPath: "suppliers[0].description" }
      ),
      panNo: getLabelWithValue(
        { labelKey: "STORE_SUPPLIER_MASTER_SUPPLIER_PAN" },
        { jsonPath: "suppliers[0].panNo" }
      ),
  
      tinNo: getLabelWithValue(
        { labelKey: "STORE_SUPPLIER_MASTER_SUPPLIER_TIN" },
        { jsonPath: "suppliers[0].tinNo" }
      ),
      // cstNo: getLabelWithValue(
      //   { labelKey: "STORE_SUPPLIER_MASTER_SUPPLIER_CST" },
      //   { jsonPath: "suppliers[0].cstNo" }
      // ),
      // vatNo: getLabelWithValue(
      //   { labelKey: "STORE_SUPPLIER_MASTER_SUPPLIER_VAT" },
      //   { jsonPath: "suppliers[0].vatNo" }
      // ),
      gstNo: getLabelWithValue(
        { labelKey: "STORE_SUPPLIER_MASTER_GST" },
        { jsonPath: "suppliers[0].gstNo" }
      ),
      contactPerson: getLabelWithValue(
        { labelKey: "STORE_SUPPLIER_MASTER_CONTACT_PERSON" },
        { jsonPath: "suppliers[0].contactPerson" }
      ),
  
      contactPersonNo: getLabelWithValue(
        { labelKey: "STORE_SUPPLIER_MASTER_CONTACT" },
        { jsonPath: "suppliers[0].contactPersonNo" }
      ),
    });
  };
  export const renderBankInfo =() => {
    return getCommonContainer({
      bankCode: getLabelWithValue(
        { labelKey: "STORE_SUPPLIER_MASTER_BANK_NAME" },
        {
          jsonPath: "suppliers[0].bankCode",
        }
      ),
      bankBranch: getLabelWithValue(
        { labelKey: "STORE_SUPPLIER_MASTER_BANK_BRANCH" },
        { jsonPath: "suppliers[0].bankBranch" }
      ),
      acctNo: getLabelWithValue(
        { labelKey: "STORE_SUPPLIER_MASTER_BANK_ACCOUNT" },
        { jsonPath: "suppliers[0].acctNo" }
      ),
      ifsc: getLabelWithValue(
        { labelKey: "STORE_SUPPLIER_MASTER_BANK_IFSC" },
        { jsonPath: "suppliers[0].ifsc" }
      ),
      micr: getLabelWithValue(
        { labelKey: "STORE_SUPPLIER_MASTER_MICR_CODE" },
        { jsonPath: "suppliers[0].micr" }
      ),
    });
  };
  export const getSupplierDetails = () => {
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
              labelKey: "STORE_COMMON_VIEW_SUPPLIER",
            }),
          },
        },
      },
      viewOne: renderService(),
    });
  };

  export const getBankInfoDetails =() => {
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
              labelKey: "STORE_COMMON_VIEW_BANK_INFO",
            }),
          },
        },
      },
      viewOne: renderBankInfo(),
    });
  };
  const viewSupplier = getSupplierDetails();
  const viewBankInfo = getBankInfoDetails();
  const getMDMSData = async (action, state, dispatch) => {

    const tenantId = getTenantId();
  
    let mdmsBody = {
      MdmsCriteria: {
        tenantId: commonConfig.tenantId,
        moduleDetails: [
          {
            moduleName: "store-asset",
            masterDetails: [
              { name: "BankCodes", filter: "[?(@.active == true)]" }
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
      if(payload){
        const {screenConfiguration} = state;
        if(screenConfiguration){
          const {suppliers} = screenConfiguration.preparedFinalObject;
          payload.MdmsRes['store-asset'].BankCodes.forEach(bank => {
              if(bank.code === suppliers[0].bankCode )
              dispatch(prepareFinalObject("suppliers[0].bankCode", bank.name ));
          })
        
        }
      }
      
    } catch (e) {
      console.log(e);
    }
  };
  const getData = async (action, state, dispatch) => {
    await getMDMSData(action, state, dispatch);
  }
  const screenConfig = {
    uiFramework: "material-ui",
    name: "view-supplier-master",
    beforeInitScreen: (action, state, dispatch) => {
     
      const queryObject = [{ key: "name", value: supplierName  },{ key: "tenantId", value: tenantId  }];
  
      getSearchResults(queryObject, dispatch,"supplier")
      .then(response =>{
        dispatch(prepareFinalObject("suppliers", [...response.suppliers]));
        getData(action, state, dispatch);
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
          viewSupplier,
          viewBankInfo,
          footer,
        },
      },
    },
  };
  
  export default screenConfig;
  