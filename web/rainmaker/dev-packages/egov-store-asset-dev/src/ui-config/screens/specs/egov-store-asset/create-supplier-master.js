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
    getCommonGrayCard,    
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
  import get from "lodash/get";
  import { httpRequest } from "../../../../ui-utils/api";
  import { fetchLocalizationLabel } from "egov-ui-kit/redux/app/actions";
  import { getLocale } from "egov-ui-kit/utils/localStorageUtils";
  import commonConfig from '../../../../config/common';
  import { getSearchResults } from "../../../../ui-utils/commons";
  
  const supplierName = getQueryArg(window.location.href, "name");
  const tenantId = getQueryArg(window.location.href, "tenantId");
  let isEditMode = getQueryArg(window.location.href, "edited");

 const isAllFieldsValid = (state, dispatch) =>{
  let isFormValid = true;
  let isBankDetailsValid = true;
        isFormValid = validateFields(
          "components.div.children.addSupplier.children.formDetail.children.cardContent.children.supplierDetails.children",
          state,
          dispatch,
          "create-supplier-master"
        );

      isBankDetailsValid =  validateFields(
        "components.div.children.bankInformation.children.formDetail.children.cardContent.children.bankInformationDetails.children",
        state,
        dispatch,
        "create-supplier-master"
      );
  return !isFormValid || !isBankDetailsValid;
 }

  const callBackForUpdate = async (state, dispatch) => {
    if (isAllFieldsValid(state, dispatch)) {
      const errorMessage = {
        labelName: "Please fill all fields",
        labelKey: "ERR_FILL_ALL_FIELDS",
      };
      dispatch(toggleSnackbar(true, errorMessage, "warning"));
    } else  {
      //trigger api for update supplier master
      const {screenConfiguration} = state;
      const {suppliers} = screenConfiguration.preparedFinalObject;
      const tenantId = getTenantId();
      suppliers[0].tenantId = tenantId;
      const queryObject = [ { key: "tenantId",  value: tenantId } ];
  
      const requestBody = {suppliers};
      try {
        const response = await httpRequest(
          "post",
          "store-asset-services/suppliers/_update",
          "",
          queryObject,
          requestBody
        );
         if(response){
          dispatch(setRoute(`/egov-store-asset/acknowledgement?screen=suppliermaster&mode=update&code=${suppliers[0].name}`));
         }
    
      } catch (error) {
        dispatch(toggleSnackbar(true, { labelName: error.message, labelCode: error.message }, "error" ) );
      }
  
    }
  };
  //Submit Button
  const callBackForSubmit = async (state, dispatch) => {
    if (isAllFieldsValid(state, dispatch)) {
      const errorMessage = {
        labelName: "Please fill all fields",
        labelKey: "ERR_FILL_ALL_FIELDS",
      };
      dispatch(toggleSnackbar(true, errorMessage, "warning"));
    } else  {
      //trigger api for create store
      const {screenConfiguration} = state;
      const {suppliers} = screenConfiguration.preparedFinalObject;
      const tenantId = getTenantId();
      suppliers[0].tenantId = tenantId;
      suppliers[0].active = true;
  
      const queryObject = [
        {
          key: "tenantId",
          value: tenantId
        }
      ];
  
      const requestBody = {suppliers};
      console.log("requestbody", requestBody);
      try {
        const response = await httpRequest(
          "post",
          "store-asset-services/suppliers/_create",
          "",
          queryObject,
          requestBody
        );
         if(response){
          dispatch(setRoute(`/egov-store-asset/acknowledgement?screen=suppliermaster&mode=create&code=${suppliers[0].name}`));
         }
    
      } catch (error) {
        dispatch(toggleSnackbar(true, { labelName: error.message, labelCode: error.message }, "error" ) );
      }
  
    }
  };
  
  // Reset Button
  const callBackForReset = async (state, dispatch) => {
   
    const textFields = ["type","code","name","address","contactNo","faxNo","website","email","description", "panNo", "tinNo","contactPerson","contactPersonNo","gstNo"];

    const bankInfoField =["bankCode","bankBranch","acctNo","ifsc","micr"];

    for (let i = 0; i < textFields.length; i++) {
      const fieldValue = state.screenConfiguration.screenConfig['create-supplier-master'].components.div.children.addSupplier.children.formDetail.children.cardContent.children.supplierDetails.children[textFields[i]].props.value;
      if (fieldValue) {
        dispatch(
          handleField(
            "create-supplier-master",
            `components.div.children.addSupplier.children.formDetail.children.cardContent.children.supplierDetails.children.${textFields[i]}`,
            "props.value",
            ""
          )
        );
      }
    }

    for (let i = 0; i < bankInfoField.length; i++) {
      const fieldValue = state.screenConfiguration.screenConfig['create-supplier-master'].components.div.children.bankInformation.children.formDetail.children.cardContent.children.bankInformationDetails.children[bankInfoField[i]].props.value;
      if ( fieldValue) {
        dispatch(
          handleField(
            "create-supplier-master",
            `components.div.children.bankInformation.children.formDetail.children.cardContent.children.bankInformationDetails.children.${bankInfoField[i]}`,
            "props.value",
            ""
          )
        );
      }
    }
  
    dispatch(prepareFinalObject("suppliers", []));
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
      labelName: `Supplier Master`,
      labelKey: "STORE_COMMON_SUPPLIER_MASTER",
    }),
  });
  export const addSupplier = {
    uiFramework: "custom-atoms",
    componentPath: "Form",
    props: {
      id: "apply_form1",
    },
    children: {
      formDetail: getCommonCard({
        header: getCommonTitle(
          {
            labelName: "Add Supplier",
            labelKey: "STORE_COMMON_ADD_SUPPLIER_MASTER",
          },
          {
            style: {
              marginBottom: 18,
            },
          }
        ),
        break: getBreak(),
  
        supplierDetails: getCommonContainer({
            type: getSelectField({
                label: {
                  labelName: "Supplier Type",
                  labelKey: "STORE_SUPPLIER_MASTER_SUPPLIER_TYPE",
                },
                props: {
                  className: "applicant-details-error",
                   optionValue: "code",
                  optionLabel: "name",
                },
                sourceJsonPath: "createScreenMdmsData.store-asset.SupplierType",
                placeholder: {
                  labelName: "select supplier type",
                  labelKey: "STORE_SUPPLIER_MASTER_TYPE_SELECT",
                },
                required:true,
                jsonPath: "suppliers[0].type",
              }),
          name: getTextField({
            label: {
              labelName: "Supplier Name",
              labelKey: "STORE_SUPPLIER_MASTER_SUPPLIER_NAME",
            },
            props: {
              className: "applicant-details-error",
            },
            placeholder: {
              labelName: "Enter Supplier Name",
              labelKey: "STORE_SUPPLIER_MASTER_SUPPLIER_NAME_PLACEHOLDER",
            },
            required: true,
            pattern: getPattern("Name"),
            errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
  
            jsonPath: "suppliers[0].name",
          }),
          code: getTextField({
            label: {
              labelName: "Supplier Code",
              labelKey: "STORE_SUPPLIER_MASTER_SUPPLIER_CODE",
            },
            props: {
              className: "applicant-details-error",
            },
            placeholder: {
              labelName: "enter supplier code",
              labelKey: "STORE_SUPPLIER_MASTER_SUPPLIER_CODE_PLACEHOLDER",
            },
            required: true,
            pattern: getPattern("non-empty-alpha-numeric"),
            errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
            jsonPath: "suppliers[0].code",
          }),
          address: getTextField({
            label: {
              labelName: "Supplier Address",
              labelKey: "STORE_SUPPLIER_MASTER_SUPPLIER_ADDRESS",
            },
            props: {
              className: "applicant-details-error",
              multiline: "multiline",
              rowsMax: 2,
            },
            placeholder: {
              labelName: "Enter Supplier Address",
              labelKey: "STORE_SUPPLIER_MASTER_SUPPLIER_ADDRESS_PLACEHOLDER",
            },
            required: true,
            pattern: getPattern("alpha-numeric-with-space-and-newline"),
            errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
            jsonPath: "suppliers[0].address",
          }),
          contactNo: getTextField({
            label: {
              labelName: "Supplier Contact",
              labelKey: "STORE_SUPPLIER_MASTER_SUPPLIER_CONTACT",
            },
            props: {
              className: "applicant-details-error",
            },
            placeholder: {
              labelName: "enter supplier contact",
              labelKey: "STORE_SUPPLIER_MASTER_SUPPLIER_CONTACT_PLACEHOLDER",
            },
            required: true,
            pattern: getPattern("MobileNo"),
            errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
            jsonPath: "suppliers[0].contactNo",
          }),
          faxNo: getTextField({
            label: {
              labelName: "Fax No.",
              labelKey: "STORE_SUPPLIER_MASTER_SUPPLIER_FAX",
            },
            props: {
              className: "applicant-details-error",
            },
            placeholder: {
              labelName: "enter fax no.",
              labelKey: "STORE_SUPPLIER_MASTER_SUPPLIER_FAX_PLACEHOLDER",
            },
            pattern: getPattern("numeric-only"),
            errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
            jsonPath: "suppliers[0].faxNo",
          }),
          website: getTextField({
            label: {
              labelName: "website",
              labelKey: "STORE_SUPPLIER_MASTER_SUPPLIER_WEBSITE",
            },
            props: {
              className: "applicant-details-error",
            },
            placeholder: {
              labelName: "enter website",
              labelKey: "STORE_SUPPLIER_MASTER_SUPPLIER_WEBSITE_PLACEHOLDER",
            },
            pattern: getPattern("validUrl"),
            errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
            jsonPath: "suppliers[0].website",
          }),
          email: getTextField({
            label: {
              labelName: "Email Address",
              labelKey: "STORE_SUPPLIER_MASTER_SUPPLIER_EMAIL",
            },
            props: {
              className: "applicant-details-error",
            },
            placeholder: {
              labelName: "enter email address",
              labelKey: "STORE_SUPPLIER_MASTER_SUPPLIER_EMAIL_PLACEHOLDER",
            },
            pattern: getPattern("Email"),
            errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
            jsonPath: "suppliers[0].email",
          }),
          description: getTextField({
            label: {
              labelName: "narration",
              labelKey: "STORE_SUPPLIER_MASTER_SUPPLIER_NARRATION",
            },
            props: {
              className: "applicant-details-error",
              multiline: "multiline",
              rowsMax: 2,
            },
            placeholder: {
              labelName: "Enter narration",
              labelKey: "STORE_SUPPLIER_MASTER_SUPPLIER_NARRATION_PLACEHOLDER",
            },
            pattern: getPattern("alpha-numeric-with-space-and-newline"),
            errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
            jsonPath: "suppliers[0].description",
          }),
          panNo: getTextField({
            label: {
              labelName: "Pan No.",
              labelKey: "STORE_SUPPLIER_MASTER_SUPPLIER_PAN",
            },
            props: {
              className: "applicant-details-error",
            },
            placeholder: {
              labelName: "enter Pan No.",
              labelKey: "STORE_SUPPLIER_MASTER_SUPPLIER_PAN_PLACEHOLDER",
            },
            pattern: getPattern("PAN"),
            errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
            jsonPath: "suppliers[0].panNo",
          }),
          tinNo: getTextField({
            label: {
              labelName: "Tin No.",
              labelKey: "STORE_SUPPLIER_MASTER_SUPPLIER_TIN",
            },
            props: {
              className: "applicant-details-error",
            },
            placeholder: {
              labelName: "enter Tin no.",
              labelKey: "STORE_SUPPLIER_MASTER_SUPPLIER_TIN_PLACEHOLDER",
            },
            pattern: getPattern("TINNo"),
            errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
            jsonPath: "suppliers[0].tinNo",
          }),
          // cstNo: getTextField({
          //   label: {
          //     labelName: "C.S.T No.",
          //     labelKey: "STORE_SUPPLIER_MASTER_SUPPLIER_CST",
          //   },
          //   props: {
          //     className: "applicant-details-error",
          //   },
          //   placeholder: {
          //     labelName: "enter C.S.T No.",
          //     labelKey: "STORE_SUPPLIER_MASTER_SUPPLIER_CST_PLACEHOLDER",
          //   },
          //   pattern: getPattern("CSTNo"),
          //   errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
          //   jsonPath: "suppliers[0].cstNo",
          // }),
          // vatNo: getTextField({
          //   label: {
          //     labelName: "VAT No.",
          //     labelKey: "STORE_SUPPLIER_MASTER_SUPPLIER_VAT",
          //   },
          //   props: {
          //     className: "applicant-details-error",
          //   },
          //   placeholder: {
          //     labelName: "enter VAT No.",
          //     labelKey: "STORE_SUPPLIER_MASTER_SUPPLIER_VAT_PLACEHOLDER",
          //   },
          //   pattern: getPattern("VATNo"),
          //   errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
          //   jsonPath: "suppliers[0].vatNo",
          // }),
           gstNo: getTextField({
            label: {
              labelName: "GST No.",
              labelKey: "STORE_SUPPLIER_MASTER_GST",
            },
            props: {
              className: "applicant-details-error",
            },
            placeholder: {
              labelName: "enter GST No.",
              labelKey: "STORE_SUPPLIER_MASTER_GST_PLACEHOLDER",
            },
            required: true,
            pattern: getPattern("GSTNo"),
            errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
            jsonPath: "suppliers[0].gstNo",
          }),
          contactPerson: getTextField({
            label: {
              labelName: "Contact Person",
              labelKey: "STORE_SUPPLIER_MASTER_CONTACT_PERSON",
            },
            props: {
              className: "applicant-details-error",
            },
            placeholder: {
              labelName: "enter Contact Person",
              labelKey: "STORE_SUPPLIER_MASTER_CONTACT_PERSON_PLACEHOLDER",
            },
            pattern: getPattern("alpha-only"),
            errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
            jsonPath: "suppliers[0].contactPerson",
          }),
          contactPersonNo: getTextField({
            label: {
              labelName: "Contact No.",
              labelKey: "STORE_SUPPLIER_MASTER_CONTACT",
            },
            props: {
              className: "applicant-details-error",
            },
            placeholder: {
              labelName: "enter Contact No.",
              labelKey: "STORE_SUPPLIER_MASTER_CONTACT_PLACEHOLDER",
            },
            pattern: getPattern("MobileNo"),
            errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
            jsonPath: "suppliers[0].contactPersonNo",
          }),
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
              jsonPath: "suppliers[0].inActiveDate",
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
  
  export  const bankInformation = {
    uiFramework: "custom-atoms",
    componentPath: "Form",
    props: {
      id: "apply_form2",
    },
    children: {
      formDetail: getCommonCard({
        header: getCommonTitle(
          {
            labelName: "Bank Information",
            labelKey: "STORE_COMMON_ADD_BANK_INFORMATION",
          },
          {
            style: {
              marginBottom: 18,
            },
          }
        ),
        break: getBreak(),
  
        bankInformationDetails: getCommonContainer({      
          bankCode:getSelectField({
            label: {
              labelName: "Bank Name",
              labelKey: "STORE_SUPPLIER_MASTER_BANK_NAME",
            },
            props: {
              className: "applicant-details-error",
               optionValue: "code",
              optionLabel: "name",
            },
            sourceJsonPath: "createScreenMdmsData.store-asset.BankCodes",
            placeholder: {
              labelName: "select Bank Name",
              labelKey: "STORE_SUPPLIER_MASTER_TYPE_SELECT",
            },
            required:true,
            jsonPath: "suppliers[0].bankCode",
          }),
          bankBranch: getTextField({
            label: {
              labelName: "bank branch",
              labelKey: "STORE_SUPPLIER_MASTER_BANK_BRANCH",
            },
            props: {
              className: "applicant-details-error",
            },
            placeholder: {
              labelName: "enter bank branch",
              labelKey: "STORE_SUPPLIER_MASTER_BANK_BRANCH_PLACEHOLDER",
            },
            required: true,
            pattern: getPattern("non-empty-alpha-numeric"),
            errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
            jsonPath: "suppliers[0].bankBranch",
          }),
          acctNo: getTextField({
            label: {
              labelName: "Bank Account No.",
              labelKey: "STORE_SUPPLIER_MASTER_BANK_ACCOUNT",
            },
            props: {
              className: "applicant-details-error",
            },
            placeholder: {
              labelName: "Bank Account No.",
              labelKey: "STORE_SUPPLIER_MASTER_BANK_ACCOUNT_PLACEHOLDER",
            },
            required: true,
            pattern: getPattern("numeric-only"),
            errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
            jsonPath: "suppliers[0].acctNo",
          }),
          ifsc: getTextField({
            label: {
              labelName: "Bank IFSC Code",
              labelKey: "STORE_SUPPLIER_MASTER_BANK_IFSC",
            },
            props: {
              className: "applicant-details-error",
            },
            placeholder: {
              labelName: "enter Bank IFSC Code",
              labelKey: "STORE_SUPPLIER_MASTER_BANK_IFSC_PLACEHOLDER",
            },
            required: true,
            pattern: getPattern("non-empty-alpha-numeric"),
            errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
            jsonPath: "suppliers[0].ifsc",
          }),
          micr: getTextField({
            label: {
              labelName: "MICR Code",
              labelKey: "STORE_SUPPLIER_MASTER_MICR_CODE",
            },
            props: {
              className: "applicant-details-error",
            },
            placeholder: {
              labelName: "enter MICR Code",
              labelKey: "STORE_SUPPLIER_MASTER_MICR_CODE_PLACEHOLDER",
            },
            pattern: getPattern("non-empty-alpha-numeric"),
            errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
            jsonPath: "suppliers[0].micr",
          }),
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
              { name: "SupplierType", filter: "[?(@.active == true)]" },
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
      dispatch(prepareFinalObject("createScreenMdmsData", payload.MdmsRes));
    } catch (e) {
      console.log(e);
    }
  };
  
  const getBankName  = async (action, state, dispatch) => {
    const queryObject = [ { key: "tenantId", value: getTenantId()  } ];

    try {
      const response = await httpRequest(
        "post",
        "egf-master/banks/_search",
        "",
        queryObject,
        {}
      );
       if(response){
        const bankNames = response.banks.map(item => {
          let code = item.code;
          let name = item.name;
          return{code,name}
        } )
        dispatch(prepareFinalObject("supplierMaster.banknames", bankNames));
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

  const getData = async (action, state, dispatch) => {
    await getMDMSData(action, state, dispatch);
   // await getBankName(action,state,dispatch);
  };


  const screenConfig = {
    uiFramework: "material-ui",
    name: "create-supplier-master",
    beforeInitScreen: (action, state, dispatch) => {
      const name = getQueryArg(window.location.href, "name");
    const edited = getQueryArg(window.location.href, "edited");
    if(!name && !edited){
      dispatch(prepareFinalObject("supplier[0]",null));
      isEditMode = false
    }
      //mdms call
      getData(action, state, dispatch);
      //Condition for update mode
      if (isEditMode) {
        const queryObject = [{ key: "name", value: supplierName  },{ key: "tenantId", value: tenantId  }];
  
        getSearchResults(queryObject, dispatch,"supplier")
        .then(response =>{
          dispatch(prepareFinalObject("suppliers", [...response.suppliers]));
        });
      }
  
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
          addSupplier,
          bankInformation,
          footer,
        },
      },
    },
  };
  
  export default screenConfig;
  