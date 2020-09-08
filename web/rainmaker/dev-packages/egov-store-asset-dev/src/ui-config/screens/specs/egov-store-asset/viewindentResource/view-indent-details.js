import {
  getBreak,
  getCommonContainer,
  getCommonGrayCard,
  getCommonSubHeader,
  getLabel,
  getLabelWithValue
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";

const gotoCreatePage = (state, dispatch) => {
  const createUrl =
    process.env.REACT_APP_SELF_RUNNING === "true"
      ? `/egov-ui-framework/egov-store-asset/creatindent?step=0`
      : `/egov-store-asset/creatindent?step=0`;
  dispatch(setRoute(createUrl));
};

const getHeader = label => {
  return {
    uiFramework: "custom-molecules-local",
    moduleName: "egov-hrms",
    componentPath: "DividerWithLabel",
    props: {
      className: "hr-generic-divider-label",
      labelProps: {},
      dividerProps: {},
      label
    },
    type: "array"
  };
};


export const getIndentListDetailsView = (isReview = true) => {
  return getCommonGrayCard({
    headerDiv: {
      uiFramework: "custom-atoms",
      componentPath: "Container",
      props: {
        style: { marginBottom: "10px" }
      },
      children: {
        header: {
          gridDefination: {
            xs: 12,
            sm: 10
          },
          ...getCommonSubHeader({
            labelName: "Material Indent",
            labelKey: "STORE_MATERIAL_INDENT_MATERIAL_INDENT"
          })
        },
        editSection: {
          componentPath: "Button",
          props: {
            color: "primary"
          },
          visible: isReview,
          gridDefination: {
            xs: 12,
            sm: 2,
            align: "right"
          },
          children: {
            editIcon: {
              uiFramework: "custom-atoms",
              componentPath: "Icon",
              props: {
                iconName: "edit"
              }
            },
            buttonLabel: getLabel({
              labelName: "Edit",
              labelKey: "STORE_SUMMARY_EDIT"
            })
          },
          onClickDefination: {
            action: "condition",
            callBack: gotoCreatePage
          }
        }
      }
    },
   
    break1: getBreak(),
    viewOne: getCommonContainer({
      StoreName: getLabelWithValue(
        {
          labelName: "Store Name",
            labelKey: "STORE_DETAILS_STORE_NAME"
        },
        {  jsonPath: "indents[0].indentStore.name", }
      ),
      divisionName: getLabelWithValue(
        { labelName: "Division Name", labelKey: "STORE_DETAILS_DIVISION_NAME" },
        { jsonPath: "indents[0].indentStore.divisionName" }
      ),
      departmentName: getLabelWithValue(
        { labelName: "Department Name", labelKey: "STORE_DETAILS_DEPARTMENT_NAME" },
        { jsonPath: "indents[0].indentStore.department.name" }
      ),
      IndentDate: getLabelWithValue(
        { labelName: "Indent Date",
        labelKey: "STORE_MATERIAL_INDENT_INDENT_DATE" },
        { jsonPath: "indents[0].indentDate", }
      ),
      IndentPurpose: getLabelWithValue(
        {
          labelName: "Indent Purpose", labelKey: "STORE_MATERIAL_INDENT_INDENT_PURPOSE"
        },
        { jsonPath: "indents[0].indentPurpose" }
      ),
      InventryType: getLabelWithValue(
        { labelName: "Inventry Type", labelKey: "STORE_INVENTRY_TYPE" },
        {
          jsonPath: "indents[0].inventoryType",
        }
      ),
      ExpectedDeliveryDate: getLabelWithValue(
        { labelName: "Expected Delivery Date",
        labelKey: "STORE_MATERIAL_INDENT_EXPECTED_DELIVERY_DATE" },
        {
          jsonPath: "indents[0].expectedDeliveryDate"
        }
      ),
      Naration: getLabelWithValue(
        { labelName: "Naration",
        labelKey: "STORE_MATERIAL_INDENT_NARATION" },
        {
          jsonPath: "indents[0].narration",
        }
      ),
      createdBy: getLabelWithValue(
        { labelName: "Created by", labelKey: "STORE_PURCHASE_ORDER_CREATEBY" },
        {
          jsonPath: "indents[0].createdByName",
        }
      ),
      designation: getLabelWithValue(
        { labelName: "Designation", labelKey: "STORE_PURCHASE_ORDER_DSGNTN" },
        {
          jsonPath: "indents[0].designation",
        }
      ),
      
      
    }),


  });
};
