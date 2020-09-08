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
  const createUrl = `/egov-store-asset/create-dispose-scrap-material?step=1`;
  dispatch(setRoute(createUrl));
};

const assignmentCard = {
  uiFramework: "custom-containers",
  componentPath: "MultiItem",
  props: {
    className: "review-hr",
    scheama: getCommonGrayCard({
      DisposeScrapMaterialDetailsCardContainer: getCommonContainer({
        materialName: getLabelWithValue(
          {
            labelName: "Material Name",
            labelKey: "STORE_MATERIAL_NAME"
          },
          { jsonPath: "disposals[0].disposalDetails[0].material.name" }
        ),
        lotNo: getLabelWithValue(
          { labelName: "LOT No.", labelKey: "STORE_SCRAP_LOT_NO" },
          {
            jsonPath: "disposals[0].disposalDetails[0].lotNumber",    
          }
        ),
        balanceQuantity: getLabelWithValue(
          {
            labelName: "Balance Quantity",
            labelKey: "STORE_PURCHASE_ORDER_BLNC_QLTY"
          },
          { jsonPath: "disposals[0].disposalDetails[0].balanceQuantity" }
        ),
        balanceValue: getLabelWithValue(
          { labelName: "Balance Value", labelKey: "STORE_SCRAP_BAL_VALUE" },
          {
            jsonPath: "disposals[0].disposalDetails[0].balanceValue",
          }
        ),
        unitRate: getLabelWithValue(
          {
            labelName: "Unit Rate",
            labelKey: "STORE_MATERIAL_RECEIPT_UNIT_RATE"
          },
          { jsonPath: "disposals[0].disposalDetails[0].unitRate" }
        ),
        disposalQty: getLabelWithValue(
          { labelName: "Dispsal Qty", labelKey: "STORE_DISPOSAL_SCRAP_QUANTITY" },
          {
            jsonPath: "disposals[0].disposalDetails[0].disposalQuantity",
          }
        ),
        disposalValue: getLabelWithValue(
          { labelName: "Disposal Value", labelKey: "STORE_DISPOSAL_SCRAP_VALUE" },
          {
            jsonPath: "disposals[0].disposalDetails[0].disposalValue",
          }
        ),
      })
    }),

    items: [],
    hasAddItem: false,
    isReviewPage: true,
    sourceJsonPath: "disposals[0].disposalDetails",
    prefixSourceJsonPath:
      "children.cardContent.children.DisposeScrapMaterialDetailsCardContainer.children",
    afterPrefixJsonPath: "children.value.children.key"
  },
  type: "array"
};

export const getDisposalScrapMaterialDetailsView = (isReview = true) => {
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
            labelName: "Disposal Material Details",
            labelKey: "STORE_DISPOSAL_SCRAP_DETAILS_HEADER"
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
