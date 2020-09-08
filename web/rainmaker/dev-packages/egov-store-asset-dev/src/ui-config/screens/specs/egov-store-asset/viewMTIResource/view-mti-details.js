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
  const createUrl = `/egov-store-asset/create-material-transfer-indent?step=1`;
  dispatch(setRoute(createUrl));
};

const assignmentCard = {
  uiFramework: "custom-containers",
  componentPath: "MultiItem",
  props: {
    className: "review-hr",
    scheama: getCommonGrayCard({
      mtiDetailsCardContainer: getCommonContainer({
        materialName: getLabelWithValue(
          {
            labelName: "Material Name",
            labelKey: "STORE_MATERIAL_NAME"
          },
          { jsonPath: "indents[0].indentDetails[0].material.name" }
        ),
        uomName: getLabelWithValue(
          { labelName: "UOM Name", labelKey: "STORE_PURCHASE_ORDER_UOM" },
          {
            jsonPath: "indents[0].indentDetails[0].uom.name",    
          }
        ),
        quantityRequired: getLabelWithValue(
          {
            labelName: "Quantity Required",
            labelKey: "STORE_MATERIAL_INDENT_QUANTITY_REQUIRED"
          },
          { jsonPath: "indents[0].indentDetails[0].userQuantity" }
        ),
        // unitRate: getLabelWithValue(
        //   {
        //     labelName: "Unit Rate",
        //     labelKey: "STORE_MATERIAL_RECEIPT_UNIT_RATE"
        //   },
        //   { jsonPath: "indents[0].indentDetails[0].material.description" }
        // ),
        // totalValue: getLabelWithValue(
        //   { labelName: "Total Value", labelKey: "STORE_MATERIAL_INDENT_NOTE_TOTAL_VALUE" },
        //   {
        //     jsonPath: "indents[0].indentDetails[0].indentQuantity",
        //   }
        // ),
        // Remark: getLabelWithValue(
        //   { labelName: "Remark", labelKey: "STORE_MATERIAL_INDENT_NOTE_REMARK" },
        //   {
        //     jsonPath: "indents[0].indentDetails[0].userQuantity",
        //   }
        // ),
      })
    }),

    items: [],
    hasAddItem: false,
    isReviewPage: true,
    sourceJsonPath: "indents[0].indentDetails",
    prefixSourceJsonPath:
      "children.cardContent.children.mtiDetailsCardContainer.children",
    afterPrefixJsonPath: "children.value.children.key"
  },
  type: "array"
};

export const getMTIDetailsView = (isReview = true) => {
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
            labelName: "Material Transfer Indent Details",
            labelKey: "STORE_MTI_DETAILS_HEADER"
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
    viewOne: assignmentCard
  });
};
