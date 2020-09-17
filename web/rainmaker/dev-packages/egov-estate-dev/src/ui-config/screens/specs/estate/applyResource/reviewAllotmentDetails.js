import {
  getCommonCard,
  getCommonTitle
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  getReviewPropertyInfo,
  getReviewAdditional,
  getReviewAuctionAllotment,
  getReviewCompanyDetails,
  getReviewPremiumAmount,
  getReviewGroundRent, 
  getReviewLicenseFee,
  getReviewAdvanceRent,
  getReviewSecurity
} from "./reviewProperty";

var reviewPropertyInfo = getReviewPropertyInfo(true, "allotment");
var reviewAdditional = getReviewAdditional(true, "allotment");
var reviewAuctionAllotment = getReviewAuctionAllotment();
var reviewPremiumAmount = getReviewPremiumAmount();
var reviewGroundRent = getReviewGroundRent();
var reviewLicenseFee = getReviewLicenseFee();
var reviewAdvanceRent = getReviewAdvanceRent();
var reviewSecurity = getReviewSecurity();
var reviewCompanyDetails = getReviewCompanyDetails();

const header = getCommonTitle({
  labelName: "Please review your Application and Submit",
  labelKey: "TL_SUMMARY_HEADER"
})

export const reviewAllotmentDetails = getCommonCard({
  header,
  reviewPropertyInfo,
  reviewAdditional,
  reviewAuctionAllotment,
  reviewCompanyDetails,
  reviewPremiumAmount,
  reviewGroundRent,
  reviewLicenseFee,
  reviewAdvanceRent,
  reviewSecurity
})