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
   const createUrl = `/egov-store-asset/create-scrap-material?step=0`;
  dispatch(setRoute(createUrl));
};

export const getScrapHeaderView = (isReview = true) => {
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
            labelName: "Scrap",
            labelKey: "STORE_SCRAP_HEADER"
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
    viewOne: getCommonContainer({
      storeName: getLabelWithValue(
        {
          labelName: "Store Name",
          labelKey: "STORE_DETAILS_STORE_NAME"
        },
        { jsonPath: "scraps[0].store.name" }
      ),
      scrapDate: getLabelWithValue(
        {
          labelName: "Scrap Date",
          labelKey: "STORE_SCRAP_DATE"
        },
        { jsonPath: "scraps[0].scrapDate" }
      ),
      remarks: getLabelWithValue(
        { labelName: "Scrap Remarks", labelKey: "STORE_SCRAP_REMARK" },
        { jsonPath: "scraps[0].description" }
      ),
      createdBy: getLabelWithValue(
        { labelName: "Scrap Created by", labelKey: "STORE_SCRAP_CREATEBY" },
        {
          jsonPath: "scraps[0].createdBy"
        }
      ),
      designation: getLabelWithValue(
        { labelName: "Designation", labelKey: "STORE_PURCHASE_ORDER_DSGNTN" },
        {
          jsonPath: "scraps[0].designation",
        }
      ),
    }),
  });
};
