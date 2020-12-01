import {
  getCommonCard,
  getCommonTitle
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  getReviewPropertyInfo,
  getReviewAdditional,
  getReviewAuction,
  getReviewCompanyDetails,
  getReviewPremiumAmount,
  getReviewGroundRent, 
  getReviewLicenseFee,
  getReviewAdvanceRent,
  getReviewSecurity,
  getReviewFirmDetails,
  getReviewProprietorshipDetails,
  getReviewInterest
} from "./reviewProperty";

if (typeof getReviewPropertyInfo != "undefined") {
  var reviewPropertyInfo = getReviewPropertyInfo(true, "allotment");
  var reviewAdditional = getReviewAdditional(true, "allotment");
  var reviewAuctionAllotment = getReviewAuction(true, "allotment");
  var reviewPremiumAmount = getReviewPremiumAmount();
  var reviewGroundRent = getReviewGroundRent();
  var reviewLicenseFee = getReviewLicenseFee();
  var reviewAdvanceRent = getReviewAdvanceRent();
  var reviewSecurity = getReviewSecurity();
  var companyDetails = getReviewCompanyDetails(true, "allotment");
  var firmDetails = getReviewFirmDetails(true, "allotment");
  var proprietorDetails = getReviewProprietorshipDetails(true, "allotment");
  var reviewInterestDetails = getReviewInterest(true, "allotment")
}

const header = getCommonTitle({
  labelName: "Please review your Application and Submit",
  labelKey: "ES_SUMMARY_HEADER"
})

export const reviewAllotmentDetails = getCommonCard({
  header,
  reviewPropertyInfo,
  reviewAdditional,
  reviewAuctionAllotment,
  companyDetails,
  firmDetails,
  proprietorDetails,
  reviewPremiumAmount,
  reviewGroundRent,
  reviewLicenseFee,
  reviewAdvanceRent,
  reviewSecurity,
  reviewInterestDetails
})