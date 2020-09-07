import {
  getCommonCard,
  getCommonTitle
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  getReviewPropertyInfo,
  getReviewAuction,
  getReviewAdditional
} from "./reviewProperty";

const header = getCommonTitle({
  labelName: "Please review your Application and Submit",
  labelKey: "TL_SUMMARY_HEADER"
})

if (typeof getReviewPropertyInfo != "undefined" && typeof getReviewAuction != "undefined" && typeof getReviewAdditional != "undefined") {
  var reviewPropertyInfo = getReviewPropertyInfo();
  var reviewAuction = getReviewAuction();
  var reviewAdditional = getReviewAuction();
}

export const reviewDetails = getCommonCard({
  header,
  reviewPropertyInfo,
  reviewAuction,
  reviewAdditional
})