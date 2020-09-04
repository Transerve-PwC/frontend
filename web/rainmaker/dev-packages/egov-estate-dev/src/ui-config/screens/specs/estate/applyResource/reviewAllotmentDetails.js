import {
  getCommonCard,
  getCommonTitle
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  getReviewPropertyInfo,
  getReviewAdditional
} from "./reviewProperty";

var reviewPropertyInfo = getReviewPropertyInfo();
var reviewAdditional = getReviewAdditional();

const header = getCommonTitle({
  labelName: "Please review your Application and Submit",
  labelKey: "TL_SUMMARY_HEADER"
})

export const reviewAllotmentDetails = getCommonCard({
  header,
  reviewPropertyInfo,
  reviewAdditional
})