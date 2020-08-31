import {
    getCommonCard,
    getCommonContainer,
    getCommonTitle,
    getPattern,
    getSelectField,
    getTextField,
    getCommonHeader,
    getBreak,
    getCheckBoxwithLabel,
    getDateField,
    getLabel,
    getLabelWithValue,
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import {
    handleScreenConfigurationFieldChange as handleField,
    prepareFinalObject,
    toggleSnackbar,
  } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import { getCommonApplyFooter, validateFields } from "../utils";
  import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
  import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
  import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
  import { getSearchResults } from "../../../../ui-utils/commons";
  import get from "lodash/get";
  import { httpRequest } from "../../../../ui-utils/api";
  import { fetchLocalizationLabel } from "egov-ui-kit/redux/app/actions";
  import { getLocale } from "egov-ui-kit/utils/localStorageUtils";
  import commonConfig from '../../../../config/common';
  import store from "egov-ui-framework/ui-redux/store";
  let isEditMode = getQueryArg(window.location.href, "edited");
  const storeName = getQueryArg(window.location.href, "name");
  const tenantId = getQueryArg(window.location.href, "tenantId");
  const callBackForUpdate = async (state, dispatch) => {
    console.log("update");
    let isFormValid = true;
  
    isFormValid = validateFields(
      "components.div.children.formwizardFirstStep.children.formDetail.children.cardContent.children.addOrganization.children",
      state,
      dispatch,
      "register-organization"
    );
  
    if (!isFormValid) {
      const errorMessage = {
        labelName: "Please fill all fields",
        labelKey: "ERR_FILL_ALL_FIELDS",
      };
      dispatch(toggleSnackbar(true, errorMessage, "warning"));
    } else {
      //trigger api for update store
      const { screenConfiguration } = state;
      const { stores } = screenConfiguration.preparedFinalObject;
      const tenantId = getTenantId();
      stores[0].tenantId = tenantId;
     
      stores[0].officeLocation.tenantId = tenantId;
  
      const queryObject = [
        {
          key: "tenantId",
          value: tenantId
        }
      ];
  
      const requestBody = { stores };
  
      try {
        const response = await httpRequest(
          "post",
          "store-asset-services/stores/_update",
          "",
          queryObject,
          requestBody
        );
        if (response) {
          dispatch(setRoute(`/egov-store-asset/acknowledgement?screen=storeMaster&mode=update&code=${response.stores[0].name}`));
        }
  
      } catch (error) {
        dispatch(
          toggleSnackbar(
            true,
            { labelName: error.message, labelCode: error.message },
            "error"
          )
        );
      }
    }
  };
  //Submit Button
  const callBackForSubmit = async (state, dispatch) => {
    
    let isFormValid = true;
  
    isFormValid = validateFields(
      "components.div.children.formwizardFirstStep.children.formDetail.children.cardContent.children.addOrganization.children",
      state,
      dispatch,
      "register-organization"
    );
  
    if (!isFormValid) {
      const errorMessage = {
        labelName: "Please fill all fields",
        labelKey: "ERR_FILL_ALL_FIELDS",
      };
      dispatch(toggleSnackbar(true, errorMessage, "warning"));
    } else {
      //trigger api for create store
      const { screenConfiguration } = state;
      const { OrganizationRequest } = screenConfiguration.preparedFinalObject;
      const tenantId = getTenantId();
      OrganizationRequest.tenantId = tenantId;

      const queryObject = [];
      const requestBody = { OrganizationRequest };
      console.log("requestbody", requestBody);
      try {
        const response = await httpRequest(
          "post",
          "/nulm-services/v1/organization/_create",
          "",
          queryObject,
          requestBody
        );
        if (response) {
          dispatch(setRoute(`/egov-nulm/acknowledgement?screen=regOrganization&mode=create&code=${OrganizationRequest.organizationName}`));
        }
  
      } catch (error) {
        dispatch(
          toggleSnackbar(
            true,
            { labelName: error.message, labelCode: error.message },
            "error"
          )
        );
      }
  
    }
  };
  
  // Reset Button
  const callBackForReset = async (state, dispatch) => {
   
    const textFields = [
      "organizationName",
      "address",
      "emailId",
      "representativeName",
      "mobileNo",
      "registrationNo",
    ];
  
    for (let i = 0; i < textFields.length; i++) {
      if (
        state.screenConfiguration.screenConfig['register-organization'].components.div.children
          .formwizardFirstStep.children.formDetail.children.cardContent.children
          .addOrganization.children[textFields[i]].props.value
      ) {
        dispatch(
          handleField(
            "register-organization",
            `components.div.children.formwizardFirstStep.children.formDetail.children.cardContent.children.addOrganization.children.${textFields[i]}`,
            "props.value",
            ""
          )
        );
      }
    }
  
    dispatch(prepareFinalObject("OrganizationRequest", {}));
  };
  
  export const buttonController = () => {
    if (isEditMode)
      return {
        updateButton: {
          componentPath: "Button",
          props: {
            variant: "contained",
            color: "primary",
            style: {
              // minWidth: "200px",
              height: "48px",
              marginRight: "16px",
            },
          },
          children: {
            updateButtonLabel: getLabel({
              labelName: "update",
              labelKey: "STORE_DETAILS_UPDATE_BUTTON",
            }),
          },
          onClickDefination: {
            action: "condition",
            callBack: callBackForUpdate,
          },
          visible: true,
        },
      };
    else
      return {
        resetButton: {
          componentPath: "Button",
          props: {
            variant: "outlined",
            color: "primary",
            style: {
              // minWidth: "200px",
              height: "48px",
              marginRight: "16px",
            },
          },
          children: {
            resetButtonLabel: getLabel({
              labelName: "Reset",
              labelKey: "STORE_DETAILS_RESET_BUTTON",
            }),
          },
          onClickDefination: {
            action: "condition",
            callBack: callBackForReset,
          },
          visible: true,
        },
        submitButton: {
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
              labelName: "Submit",
              labelKey: "STORE_DETAILS_SUBMIT_BUTTON",
            }),
          },
          onClickDefination: {
            action: "condition",
            callBack: callBackForSubmit,
          },
        },
      };
  };
  
  export const header = getCommonContainer({
    header: getCommonHeader({
      labelName: `Register Organization`,
      labelKey: "NULM_NGO_REG_ORGANIZATION_HEADER",
    }),
  });
  export const formwizardFirstStep = {
    uiFramework: "custom-atoms",
    componentPath: "Form",
    props: {
      id: "apply_form1",
    },
    children: {
      formDetail: getCommonCard({
        header: getCommonTitle(
          {
            labelName: "Organization Details",
            labelKey: "NULM_NGO_REG_ORGANIZATION_DETAILS",
          },
          {
            style: {
              marginBottom: 18,
            },
          }
        ),
        break: getBreak(),
  
        addOrganization: getCommonContainer({
            organizationName: {
                ...getTextField({
                  label: {
                    labelName: "Organization Name",
                    labelKey: "NULM_NGO_REG_ORGANIZATION_NAME"
                  },
                  placeholder: {
                    labelName: "Enter Organization Name",
                    labelKey: "NULM_NGO_REG_ORGANIZATION_NAME_PLACEHOLDER"
                  },
                  required: true,
                  pattern: getPattern("Name") || null,
                  jsonPath: "OrganizationRequest.organizationName"
                })
              },
          
              address: {
                ...getTextField({
                  label: {
                    labelName: "Organization address",
                    labelKey: "NULM_NGO_REG_ORGANIZATION_ADDRESS"
                  },
                  placeholder: {
                    labelName: "Enter Organization address",
                    labelKey: "NULM_NGO_REG_ORGANIZATION_ADDRESS_PLACEHOLDER"
                  },
                  required: true,
                  pattern: getPattern("Address") || null,
                  jsonPath: "OrganizationRequest.address"
                })
              },
              emailId: {
                ...getTextField({
                  label: {
                    labelName: "Email address",
                    labelKey: "NULM_NGO_REG_EMAIL_ADDRESS"
                  },
                  placeholder: {
                    labelName: "Enter Email address",
                    labelKey: "NULM_NGO_REG_EMAIL_ADDRESS_PLACEHOLDER"
                  },
                  required: true,
                  pattern: getPattern("Email") || null,
                  jsonPath: "OrganizationRequest.emailId"
                })
              },
              representativeName: {
                ...getTextField({
                  label: {
                    labelName: "Name of authorized representative",
                    labelKey: "NULM_NGO_REG_NAME_OF_AUTHORIZED_REPRESENTATIVE"
                  },
                  placeholder: {
                    labelName: "Enter Name of authorized representative",
                    labelKey: "NULM_NGO_REG_NAME_OF_AUTHORIZED_REPRESENTATIVE_PLACEHOLDER"
                  },
                  required: true,
                  pattern: getPattern("Name") || null,
                  jsonPath: "OrganizationRequest.representativeName"
                })
              },
          
              mobileNo: {
                ...getTextField({
                  label: {
                    labelName: "Contact no of authorized representative",
                    labelKey: "NULM_NGO_REG_CONTACT_NO_OF_AUTHORIZED_REPRESENTATIVE"
                  },
                  placeholder: {
                    labelName: "Enter Contact no of authorized representative",
                    labelKey: "NULM_NGO_REG_CONTACT_NO_OF_AUTHORIZED_REPRESENTATIVE_PLACEHOLDER"
                  },
                  required: true,
                  pattern: getPattern("MobileNo") || null,
                  jsonPath: "OrganizationRequest.mobileNo"
                })
              },
          
              registrationNo: {
                ...getTextField({
                  label: {
                    labelName: "Registration number of the organization",
                    labelKey: "NULM_NGO_REG_NUMBER_OF_THE_ORG"
                  },
                  placeholder: {
                    labelName: "Enter Registration number of the organization",
                    labelKey: "NULM_NGO_REG_NUMBER_OF_THE_ORG_PLACEHOLDER"
                  },
                  required: true,
                  pattern: getPattern("alpha-numeric") || null,
                  jsonPath: "OrganizationRequest.registrationNo"
                })
              },
        }),
      }),
    },
  };
  
  export const footer = getCommonApplyFooter({
    ...buttonController(),
  });

  
  const screenConfig = {
    uiFramework: "material-ui",
    name: "register-organization",
    beforeInitScreen: (action, state, dispatch) => {
      
      return action;
    },
    components: {
      div: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        props: {
          className: "common-div-css",
        },
        children: {
          headerDiv: {
            uiFramework: "custom-atoms",
            componentPath: "Container",
            children: {
              header: {
                gridDefination: {
                  xs: 12,
                  sm: 10,
                },
                ...header,
              },
            },
          },
          formwizardFirstStep,
          footer,
        },
      },
    },
  };
  
  export default screenConfig;
  