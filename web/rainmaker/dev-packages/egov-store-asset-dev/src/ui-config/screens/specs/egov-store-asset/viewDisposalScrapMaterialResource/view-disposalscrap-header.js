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
   const createUrl = `/egov-store-asset/create-dispose-scrap-material?step=0`;
  dispatch(setRoute(createUrl));
};

export const getDisposalScrapHeaderView = (isReview = true) => {
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
            labelName: "Disposal",
            labelKey: "STORE_DISPOSAL_SCRAP_HEADER"
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
    viewOne: getCommonContainer({
      storeName: getLabelWithValue(
        {
          labelName: "Store Name",
          labelKey: "STORE_DETAILS_STORE_NAME"
        },
        { jsonPath: "disposals[0].store.name" }
      ),
      disposalDate: getLabelWithValue(
        {
          labelName: "Disposal Date",
          labelKey: "STORE_DISPOSAL_SCRAP_DATE"
        },
        { jsonPath: "disposals[0].disposalDate" }
      ),
      companyName: getLabelWithValue(
        { labelName: "Handover to Person/Company Name",
         labelKey: "STORE_DISPOSAL_SCRAP_PERSON_COMPANY" },
        { jsonPath: "disposals[0].handOverTo" }
      ),
      auctionOrder: getLabelWithValue(
        { labelName: "Auction Order No.", labelKey: "STORE_DISPOSAL_SCRAP_ACTION_ORDER" },
        { jsonPath: "disposals[0].auctionNumber" }
      ),
      disposalRemark: getLabelWithValue(
        { labelName: "Disposal Remarks", labelKey: "STORE_DISPOSAL_SCRAP_DISPOSAL_RMK" },
        { jsonPath: "disposals[0].description" }
      ),
      disposalBy: getLabelWithValue(
        { labelName: "Disposal by", labelKey: "STORE_DISPOSAL_SCRAP_DISPOSALBY" },
        {
          jsonPath: "disposals[0].createdBy"
        }
      ),
      designation: getLabelWithValue(
        { labelName: "Designation", labelKey: "STORE_PURCHASE_ORDER_DSGNTN" },
        {
          jsonPath: "disposals[0].designation",
        }
      ),
    }),
  });
};
