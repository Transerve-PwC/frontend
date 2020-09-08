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
  const code = getQueryArg(window.location.href, "code");
  const tenantId = getQueryArg(window.location.href, "tenantId");
  const headerrow = getCommonContainer({
    header: getCommonHeader({ labelKey: "NULM_NGO_REG_ORGANIZATION_HEADER" }),
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
    window.location.href = `/employee/egov-nulm/register-organization?tenantId=${tenantId}&code=${code}&edited=true`;
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
     organizationName: getLabelWithValue(
        { labelKey: "NULM_NGO_REG_ORGANIZATION_NAME" },
        { jsonPath: "OrganizationRequest.organizationName" }
      ),
      address: getLabelWithValue(
        { labelKey: "NULM_NGO_REG_ORGANIZATION_ADDRESS" },
        { jsonPath: "OrganizationRequest.address" }
      ),
      emailId: getLabelWithValue(
        { labelKey: "NULM_NGO_REG_EMAIL_ADDRESS" },
        { jsonPath: "OrganizationRequest.emailId" }
      ),
      representativeName: getLabelWithValue(
        { labelKey: "NULM_NGO_REG_NAME_OF_AUTHORIZED_REPRESENTATIVE" },
        { jsonPath: "OrganizationRequest.representativeName" }
      ),   
      mobileNo: getLabelWithValue(
        { labelKey: "NULM_NGO_REG_CONTACT_NO_OF_AUTHORIZED_REPRESENTATIVE" },
        { jsonPath: "OrganizationRequest.mobileNo" }
      ),
      registrationNo: getLabelWithValue(
        { labelKey: "NULM_NGO_REG_NUMBER_OF_THE_ORG" },
        { jsonPath: "OrganizationRequest.registrationNo" }
      ),
     
    });
  };
  
  export const getOrgDetails = () => {
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
              labelKey: "NULM_NGO_REG_ORGANIZATION_DETAILS",
            }),
          },
        },
      },
      viewOne: renderService(),
    });
  };
  
  
  const storeView = getOrgDetails();
  const screenConfig = {
    uiFramework: "material-ui",
    name: "view-organization",
    beforeInitScreen: (action, state, dispatch) => {
      let OrganizationRequest = {};
      OrganizationRequest.tenantId = tenantId;
      OrganizationRequest.organizationUuid= code;
      const requestBody = {OrganizationRequest}
      getSearchResults([],requestBody, dispatch,"organization")
      .then(response =>{
        if(response && response.ResponseBody)
              dispatch(prepareFinalObject("OrganizationRequest", response.ResponseBody[0]));
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
          storeView,
        //  footer,
        },
      },
    },
  };
  
  export default screenConfig;
  