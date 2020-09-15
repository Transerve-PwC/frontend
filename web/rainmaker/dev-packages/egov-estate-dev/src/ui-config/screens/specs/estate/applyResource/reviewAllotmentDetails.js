import {
  getCommonCard,
  getCommonTitle
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  getReviewPropertyInfo,
  getReviewAdditional,
  getReviewAuctionAllotment
} from "./reviewProperty";

var reviewPropertyInfo = getReviewPropertyInfo(true, "allotment");
var reviewAdditional = getReviewAdditional(true, "allotment");
var reviewAuctionAllotment = getReviewAuctionAllotment()

const header = getCommonTitle({
  labelName: "Please review your Application and Submit",
  labelKey: "TL_SUMMARY_HEADER"
})

export const reviewAllotmentDetails = getCommonCard({
  header,
  reviewPropertyInfo,
  reviewAdditional,
  reviewAuctionAllotment
})