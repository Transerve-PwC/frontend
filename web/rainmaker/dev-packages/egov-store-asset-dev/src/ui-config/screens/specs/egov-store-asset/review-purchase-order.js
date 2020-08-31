import {
  getCommonHeader,
  getCommonContainer,
  getCommonSubHeader
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { POReviewDetails } from "./viewPurchaseOrder/po-review";


export const header = getCommonContainer({
  header: getCommonHeader({
    labelName: "Puchase Order- Summary",
    labelKey: "STORE_PURCHASE_ORDER_SUMMARY"
  })
});

export const subHeader = getCommonContainer({
  subHeader: getCommonSubHeader({
    labelName:
      "Verify entered details before submission.",
    labelKey: "STORE_PURCHASE_ORDER_SUB_HEADER"
  })
});

const tradeReview = POReviewDetails(true);

const screenConfig = {
  uiFramework: "material-ui",
  name: "review-purchase-order",
  beforeInitScreen: (action, state, dispatch) => {
    // COMMA SEPARATED ROLES IN REVIEW SCREEN
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        className: "common-div-css"
      },
      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",
          children: {
            header: {
              gridDefination: {
                xs: 12,
                sm: 10
              },
              ...header
            },
            subHeader: {
              gridDefination: {
                xs: 12,
                sm: 10
              },
              ...subHeader
            }
          }
        },
        tradeReview
      }
    }
  }
};

export default screenConfig;
