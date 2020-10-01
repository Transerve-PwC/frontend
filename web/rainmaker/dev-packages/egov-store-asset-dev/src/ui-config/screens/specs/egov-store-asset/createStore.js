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
import { getSTOREPattern} from "../../../../ui-utils/commons";
let isEditMode = getQueryArg(window.location.href, "edited");
const storeName = getQueryArg(window.location.href, "name");
const tenantId = getQueryArg(window.location.href, "tenantId");
const callBackForUpdate = async (state, dispatch) => {
  console.log("update");
  let isFormValid = true;

  isFormValid = validateFields(
    "components.div.children.formwizardFirstStep.children.formDetail.children.cardContent.children.addStoreDetails.children",
    state,
    dispatch,
    "createStore"
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
  console.log("submit");
  let isFormValid = true;

  isFormValid = validateFields(
    "components.div.children.formwizardFirstStep.children.formDetail.children.cardContent.children.addStoreDetails.children",
    state,
    dispatch,
    "createStore"
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
    const { stores } = screenConfiguration.preparedFinalObject;
    const tenantId = getTenantId();
    stores[0].tenantId = tenantId;
    stores[0].active = true;


    const queryObject = [
      {
        key: "tenantId",
        value: tenantId
      }
    ];

    const requestBody = { stores };
    console.log("requestbody", requestBody);
    try {
      const response = await httpRequest(
        "post",
        "store-asset-services/stores/_create",
        "",
        queryObject,
        requestBody
      );
      if (response) {
        dispatch(setRoute(`/egov-store-asset/acknowledgement?screen=storeMaster&mode=create&code=${response.stores[0].name}`));
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
  console.log("reset");

  const checkBoxButton = ["isCentralStore", "active"];
  const textFields = [
    "code",
    "divisionName",
    "name",
    "department",
    "description",
    "billingAddress",
    "deliveryAddress",
    "storeInCharge",
    "contactNo1",
    "contactNo2",
    "email",
    "officeLocation",
  ];
  for (let i = 0; i < checkBoxButton.length; i++) {
    if (checkBoxButton[i]) {
      dispatch(
        handleField(
          "createStore",
          `components.div.children.formwizardFirstStep.children.formDetail.children.cardContent.children.addStoreDetails.children.${checkBoxButton[i]}`,
          "props.value",
          false
        )
      );
    }
  }

  // document.getElementById('central-store').removeAttribute('checked');

  for (let i = 0; i < textFields.length; i++) {
    if (
      state.screenConfiguration.screenConfig.createStore.components.div.children
        .formwizardFirstStep.children.formDetail.children.cardContent.children
        .addStoreDetails.children[textFields[i]].props.value
    ) {
      dispatch(
        handleField(
          "createStore",
          `components.div.children.formwizardFirstStep.children.formDetail.children.cardContent.children.addStoreDetails.children.${textFields[i]}`,
          "props.value",
          ""
        )
      );
    }
  }

  dispatch(prepareFinalObject("stores", []));
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
    labelName: `Store`,
    labelKey: "STORE_COMMON_STORE_MASTER",
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
          labelName: "Add Store",
          labelKey: "STORE_DETAILS_ADD_STORE",
        },
        {
          style: {
            marginBottom: 18,
          },
        }
      ),
      break: getBreak(),

      addStoreDetails: getCommonContainer({
        name: getTextField({
          label: {
            labelName: "Store Name",
            labelKey: "STORE_DETAILS_STORE_NAME",
          },
          props: {
            className: "applicant-details-error",
          },
          placeholder: {
            labelName: "Enter Store Name",
            labelKey: "STORE_DETAILS_STORE_NAME_PLACEHOLDER",
          },
          required: true,
            errorMessage:"STORE_VALIDATION_STORE_NAME",
          pattern: getPattern("Name"),
         

          jsonPath: "stores[0].name",
        }),
        code: getTextField({
          label: {
            labelName: "Store Code",
            labelKey: "STORE_DETAILS_STORE_CODE",
          },
          props: {
            className: "applicant-details-error",
          },
          placeholder: {
            labelName: "Enter Store Code",
            labelKey: "STORE_DETAILS_STORE_CODE_PLACEHOLDER",
          },
          required: true,
            errorMessage:"STORE_VALIDATION_STORE_CODE",

          pattern: getPattern("non-empty-alpha-numeric"),
         
          jsonPath: "stores[0].code",
        }),
        department: getSelectField({
          label: {
            labelName: "Department Name",
            labelKey: "STORE_DETAILS_DEPARTMENT_NAME",
          },
          props: {
            className: "applicant-details-error",
            optionLabel: "name",
            optionValue: "code",
          },
          placeholder: {
            labelName: "Select Department Name",
            labelKey: "STORE_DETAILS_DEPARTMENT_NAME_PLACEHOLDER",
          },
          jsonPath: "stores[0].department.code",
          sourceJsonPath: "createScreenMdmsData.store-asset.Department",
          required: true,
            errorMessage:"STORE_VALIDATION_DEPARTMENT_SELECT",
        }),
        description: getTextField({
          label: {
            labelName: "Store Description",
            labelKey: "STORE_DETAILS_STORE_DESCRIPTION",
          },
          props: {
            className: "applicant-details-error",
            multiline: "multiline",
            rowsMax: 2,
          },
          placeholder: {
            labelName: "Enter Store Description",
            labelKey: "STORE_DETAILS_STORE_DESCRIPTION_PLACEHOLDER",
          },
          required: true,
            errorMessage:"STORE_VALIDATION_DESCRIPTION",
          pattern: getSTOREPattern("Comment"),
         
          jsonPath: "stores[0].description",
        }),
        divisionName: getTextField({
          label: {
            labelName: "Division Name",
            labelKey: "STORE_DETAILS_DIVISION_NAME",
          },
          props: {
            className: "applicant-details-error",
          },
          placeholder: {
            labelName: "Enter Division Name",
            labelKey: "STORE_DETAILS_DIVISION_NAME_PLACEHOLDER",
          },
          required: true,
            errorMessage:"STORE_VALIDATION_DIVISION_NAME",
          pattern: getPattern("non-empty-alpha-numeric"),
         
          jsonPath: "stores[0].divisionName",
        }),
        isCentralStore: {
          uiFramework: "custom-containers-local",
          moduleName: "egov-store-asset",
          componentPath: "CheckboxContainer",
          jsonPath: "stores[0].isCentralStore",
          gridDefination: {
            xs: 6,
          },
          isFieldValid: true,
          required: false,

          props: {
            content: "STORE_DETAILS_CENTRAL_STORE",
            jsonPath: "stores[0].isCentralStore",
            id: "central-store",
            screenName: "createStore",
            checkBoxPath:
              "components.div.children.formwizardFirstStep.children.formDetail.children.cardContent.children.addStoreDetails.children.isCentralStore",
          },
        },
        billingAddress: getTextField({
          label: {
            labelName: "Billing Address",
            labelKey: "STORE_DETAILS_BILLING_ADDRESS",
          },
          props: {
            className: "applicant-details-error",
            multiline: "multiline",
            rowsMax: 2,
          },
          placeholder: {
            labelName: "Enter Billing Address",
            labelKey: "STORE_DETAILS_BILLING_ADDRESS_PLACEHOLDER",
          },
          required: true,
            errorMessage:"STORE_VALIDATION_BILLING_ADDRESS",
          pattern: getSTOREPattern("Comment"),
         
          jsonPath: "stores[0].billingAddress",
        }),
        deliveryAddress: getTextField({
          label: {
            labelName: "Delivery Address",
            labelKey: "STORE_DETAILS_DELIVERY_ADDRESS",
          },
          props: {
            className: "applicant-details-error",
            multiline: "multiline",
            rowsMax: 2,
          },
          placeholder: {
            labelName: "Enter Delivery Address",
            labelKey: "STORE_DETAILS_DELIVERY_ADDRESS_PLACEHOLDER",
          },
          required: true,
            errorMessage:"STORE_VALIDATION_DELIVERY_ADDRESS",
          pattern: getSTOREPattern("Comment"),
         
          jsonPath: "stores[0].deliveryAddress",
        }),
        storeInCharge: getSelectField({
          label: {
            labelName: "Store In-charge Employee Name",
            labelKey: "STORE_DETAILS_IN_CHARGE_EMPLOYEE",
          },
          props: {
            className: "applicant-details-error",
            optionLabel: "name",
            optionValue: "code",
          },
          placeholder: {
            labelName: "Select In-charge Employee Name",
            labelKey: "STORE_DETAILS_IN_CHARGE_EMPLOYEE_PLACEHOLDER",
          },
          sourceJsonPath: "createScreenMdmsData1.employee",
          jsonPath: "stores[0].storeInCharge.code",
          required: true,
            errorMessage:"STORE_VALIDATION_STORE_INCHARGE_SELECT",
        }),
        contactNo1: getTextField({
          label: {
            labelName: "Contact No.1",
            labelKey: "STORE_DETAILS_CONTACT_NUMBER_1",
          },
          props: {
            className: "applicant-details-error",
          },
          placeholder: {
            labelName: "Enter contact number",
            labelKey: "STORE_DETAILS_CONTACT_NUMBER_PLACEHOLDER",
          },
          required: true,
            errorMessage:"STORE_VALIDATION_CONTACT_NUMBER",
          pattern: getPattern("MobileNo"),
         
          jsonPath: "stores[0].contactNo1",
        }),
        contactNo2: getTextField({
          label: {
            labelName: "Contact No.2",
            labelKey: "STORE_DETAILS_CONTACT_NUMBER_2",
          },
          props: {
            className: "applicant-details-error",
          },
          placeholder: {
            labelName: "Enter contact number",
            labelKey: "STORE_DETAILS_CONTACT_NUMBER_PLACEHOLDER",
          },
          pattern: getPattern("MobileNo"),
         

          jsonPath: "stores[0].contactNo2",
        }),
        email: getTextField({
          label: {
            labelName: "Email Address",
            labelKey: "STORE_DETAILS_EMAIL",
          },
          props: {
            className: "applicant-details-error",
          },
          placeholder: {
            labelName: "Enter email",
            labelKey: "STORE_DETAILS_EMAIL_PLACEHOLDER",
          },
          pattern: getPattern("Email"),
          errorMessage:"STORE_VALIDATION_EMAIL",
          jsonPath: "stores[0].email",
        }),
        officeLocation: getSelectField({
          label: {
            labelName: "Office Location",
            labelKey: "STORE_DETAILS_OFFICE_LOCATION",
          },
          props: {
            className: "applicant-details-error",
            optionLabel: "name",
            optionValue: "code",
          },
          placeholder: {
            labelName: "Select Office Location",
            labelKey: "STORE_DETAILS_OFFICE_LOCATION_PLACEHOLDER",
          },
          jsonPath: "stores[0].officeLocation.code",
          sourceJsonPath: "createScreenMdmsData.store-asset.Location",
          required: true,
            errorMessage:"STORE_VALIDATION_OFFICE_LOCATION",
        }),
        active: {
          uiFramework: "custom-containers-local",
          moduleName: "egov-store-asset",
          componentPath: "CheckboxContainer",
          jsonPath: "stores[0].active",
          gridDefination: {
            xs: 12,
          },
          isFieldValid: true,
          required: false,

          props: {
            content: "STORE_DETAILS_ACTIVE",
            jsonPath: "stores[0].active",
            screenName: "createStore",
            checkBoxPath:
              "components.div.children.formwizardFirstStep.children.formDetail.children.cardContent.children.addStoreDetails.children.active",
          },
        },
        inActiveDate: {
          ...getDateField({
            label: {
              labelName: "In-active Date",
              labelKey: "STORE_DETAILS_IN_ACTIVE_DATE",
            },
            placeholder: {
              labelName: "In-active Date",
              labelKey: "STORE_DETAILS_IN_ACTIVE_DATE_PLACEHOLDER",
            },
            pattern: getPattern("Date"),
            jsonPath: "stores[0].inActiveDate",
            props: {
              style: {
                //visibility: 'hidden'  -----    this will hide the field but space will be allocated
                display: "none", //have this if u dont want space as well
              },
            },
          }),
        },
      }),
    }),
  },
};

export const footer = getCommonApplyFooter({
  ...buttonController(),
});
const getMDMSData = async (action, state, dispatch) => {

  const tenantId = getTenantId();

  let mdmsBody = {

    MdmsCriteria: {
      tenantId: commonConfig.tenantId,
      moduleDetails: [
        {
          moduleName: "store-asset",
          masterDetails: [
            { name: "Department", filter: "[?(@.active == true)]" },
            { name: "Location", filter: "[?(@.active == true)]" },
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

    dispatch(prepareFinalObject("createScreenMdmsData", payload.MdmsRes));
  } catch (e) {
    console.log(e);
  }

};


const getData = async (action, state, dispatch) => {
  await getMDMSData(action, state, dispatch);
  try {
    //fecthing employee details 
    const queryParams = [{ key: "roles", value: "EMPLOYEE" },{ key: "tenantId", value:  getTenantId() }];
    const payload = await httpRequest(
      "post",
      "/egov-hrms/employees/_search",
      "_search",
      queryParams,
    );
    if(payload){
      if (payload.Employees) {
        const empDetails =
        payload.Employees.map((item, index) => {
            const deptCode = item.assignments[0] && item.assignments[0].department;
            const empCode = item.code;
            const empName = `${item.user.name}`;
          return {
                  code : empCode,
                  name : empName,
                  dept : deptCode
          };
        });
      
        if(empDetails){
          dispatch(prepareFinalObject("createScreenMdmsData1.employee",empDetails));  
        }
      }
    }
  } catch (e) {
    console.log(e);
  }
 
};

const screenConfig = {
  uiFramework: "material-ui",
  name: "createStore",
  beforeInitScreen: (action, state, dispatch) => {
    const name = getQueryArg(window.location.href, "name");
    const edited = getQueryArg(window.location.href, "edited");
    if(!name && !edited){
      dispatch(prepareFinalObject("stores[0]",null));
      isEditMode = false
    }
    if (isEditMode) {
      const queryObject = [{ key: "name", value: storeName }, { key: "tenantId", value: tenantId }];

      getSearchResults(queryObject, dispatch, "storeMaster")
        .then(response => {
          dispatch(prepareFinalObject("stores", [...response.stores]));
          dispatch(
            handleField(
              "createStore",
              `components.div.children.formwizardFirstStep.children.formDetail.children.cardContent.children.addStoreDetails.children.code`,
              "props.disabled",
              true
            )
          );
        });
    }
    else {
      dispatch(prepareFinalObject("stores[0].active", true));
    }
    getData(action, state, dispatch);
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
