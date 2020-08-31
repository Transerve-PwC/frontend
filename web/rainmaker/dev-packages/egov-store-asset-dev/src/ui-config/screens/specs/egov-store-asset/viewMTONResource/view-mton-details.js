import {
  getCommonContainer,
  getCommonGrayCard,
  getCommonSubHeader,
  getLabel,
  getLabelWithValue
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";

const gotoCreatePage = (state, dispatch) => {
  const createUrl = `/egov-store-asset/create-material-transfer-outward?step=1`;
  dispatch(setRoute(createUrl));
};

const assignmentCard = {
  uiFramework: "custom-containers",
  componentPath: "MultiItem",
  props: {
    className: "review-hr",
    scheama: getCommonGrayCard({
      mtonDetailsCardContainer: getCommonContainer({
        materialName: getLabelWithValue(
          {
            labelName: "Material Name",
            labelKey: "STORE_MATERIAL_NAME"
          },
          { jsonPath: "materialIssues[0].materialIssueDetails[0].material.name" }
        ),
        // quantityRequired: getLabelWithValue(
        //   {
        //     labelName: "Quantity Required",
        //     labelKey: "STORE_MATERIAL_INDENT_QUANTITY_REQUIRED"
        //   },
        //   { jsonPath: "materialIssues[0].materialIssueDetails[0].indentNumber" }
        // ),
        // balanceQuantity: getLabelWithValue(
        //   {
        //     labelName: "Balance Quantity",
        //     labelKey: "STORE_PURCHASE_ORDER_BLNC_QLTY"
        //   },
        //   { jsonPath: "materialIssues[0].materialIssueDetails[0].indentNumber" }
        // ),
        issedQuantity: getLabelWithValue(
          { labelName: "Qty Issued", labelKey: "STORE_MATERIAL_INDENT_NOTE_QTY_ISSUED" },
          {
            jsonPath: "materialIssues[0].materialIssueDetails[0].userQuantityIssued",    
          }
        ),
        uomName: getLabelWithValue(
          { labelName: "UOM Name", labelKey: "STORE_PURCHASE_ORDER_UOM" },
          {
            jsonPath: "materialIssues[0].materialIssueDetails[0].uom.name",    
          }
        ),
        // unitRate: getLabelWithValue(
        //   {
        //     labelName: "Unit Rate",
        //     labelKey: "STORE_MATERIAL_RECEIPT_UNIT_RATE"
        //   },
        //   { jsonPath: "materialIssues[0].materialIssueDetails[0].material.description" }
        // ),
        // totalValue: getLabelWithValue(
        //   { labelName: "Total Value", labelKey: "STORE_MATERIAL_INDENT_NOTE_TOTAL_VALUE" },
        //   {
        //     jsonPath: "materialIssues[0].materialIssueDetails[0].indentQuantity",
        //   }
        // ),
        // balAfterIssue: getLabelWithValue(
        //   {
        //     labelName: "Balance Qty After Issue",
        //     labelKey: "STORE_MATERIAL_INDENT_NOTE_QTY_BALANCE_QTY_AFTER_ISSUE"
        //   },
        //   { jsonPath: "materialIssues[0].materialIssueDetails[0].indentNumber" }
        // ),
        Remark: getLabelWithValue(
          { labelName: "Remark", labelKey: "STORE_MATERIAL_INDENT_NOTE_REMARK" },
          {
            jsonPath: "materialIssues[0].materialIssueDetails[0].description",
          }
        ),
      })
    }),

    items: [],
    hasAddItem: false,
    isReviewPage: true,
    sourceJsonPath: "materialIssues[0].materialIssueDetails",
    prefixSourceJsonPath:
      "children.cardContent.children.mtonDetailsCardContainer.children",
    afterPrefixJsonPath: "children.value.children.key"
  },
  type: "array"
};

export const getMTONDetailsView = (isReview = true) => {
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
            labelName: "Material Transfer Outward Details",
            labelKey: "STORE_MTON_DETAILS_HEADER"
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
              labelKey: "HR_SUMMARY_EDIT"
            })
          },
          onClickDefination: {
            action: "condition",
            callBack: gotoCreatePage
          }
        }
      }
    },
    viewOne: assignmentCard
  });
};
