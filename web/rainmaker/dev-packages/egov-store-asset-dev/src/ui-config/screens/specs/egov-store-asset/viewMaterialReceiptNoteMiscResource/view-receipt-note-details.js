import {
  getBreak,
  getCommonContainer,
  getCommonGrayCard,
  getCommonSubHeader,
  getLabel,
  getLabelWithValue
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
const gotoCreatePage = (state, dispatch) => {
  const IndentId = getQueryArg(window.location.href, "IndentId");
  const createUrl =
  process.env.REACT_APP_SELF_RUNNING === "true"
  ? `/egov-ui-framework/egov-store-asset/createMaterialReceiptNoteMisc?step=0`
  : `/egov-store-asset/createMaterialReceiptNoteMisc?step=0`;
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


export const getReceiptNoteListDetailsView = (isReview = true) => {
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
            labelName: "Miscellaneous Material Receipte",
            labelKey: "STORE_MATERIAL_RECEIPT_MATERIAL_MISC"
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
          labelName: " Store Name",
          labelKey: "STORE_DETAILS_STORE_NAME"
        },
        {  jsonPath: "materialReceipt[0].receivingStore.name", }
      ),
      indentDeptName: getLabelWithValue(
        {
          labelName: "Indenting Dept. Name",
          labelKey: "STORE_MTON_INDENT_DEPT_NAME"
        },
        { jsonPath: "materialReceipt[0].receivingStore.department.name" }
      ),
      divisionName: getLabelWithValue(
        {
          labelName: "Indenting division Name",
          labelKey: "STORE_INDENTING_DIVISION_NAME"
        },
        { jsonPath: "materialReceipt[0].receivingStore.divisionName" }
      ),
      ReceiptDate: getLabelWithValue(
        {labelName: "Receipt Date",
        labelKey: "STORE_MATERIAL_RECEIPT_RECEIPT_DATE " },
        { jsonPath: "materialReceipt[0].receiptDate", }
      ),
      ReceiptType: getLabelWithValue(
        {
          labelName: "Receipt Type", labelKey: "STORE_MATERIAL_RECEIPT_RECEIPT_TYPE"
        },
        { jsonPath: "materialReceipt[0].receiptType" }
      ),
      ReceiptType: getLabelWithValue(
        {
          labelName: "Receipt Purpose", labelKey: "STORE_MISC_RECEIPT_PURPOSE"
        },
        { jsonPath: "materialReceipt[0].receiptPurpose" }
      ),
      createdBy: getLabelWithValue(
        { labelName: "Created by", labelKey: "STORE_PURCHASE_ORDER_CREATEBY" },
        {
          jsonPath: "materialReceipt[0].createdByName",
        }
      ),
      designation: getLabelWithValue(
        { labelName: "Designation", labelKey: "STORE_PURCHASE_ORDER_DSGNTN" },
        {
          jsonPath: "materialReceipt[0].designation",
        }
      ),

      Remark: getLabelWithValue(
        {  labelName: "Remark",
        labelKey: "STORE_MATERIAL_INDENT_NOTE_REMARK" },
        {
          jsonPath: "materialReceipt[0].description",
        }
      ),

    }),


  });
};
