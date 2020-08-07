import {
  getCommonCard,
  getCommonTitle
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  getReviewPropertyInfo,
  getReviewAuction,
  // getReviewAllotment,
  getReviewAdditional,
  getReviewOwner,
  getReviewPurchaser,
  getReviewPayment,
  getReviewCourtCase
} from "./reviewProperty";

import {
  getReviewDocuments
} from "./reviewDocuments";


const reviewPropertyInfo = getReviewPropertyInfo();
const reviewAuction = getReviewAuction();
// const reviewAllotment = getReviewAllotment();
const reviewAdditional = getReviewAdditional();
const reviewOwnerDetails = getReviewOwner();
const reviewPurchaserDetails = getReviewPurchaser();
const reviewCourtCaseDetails = getReviewCourtCase();
const reviewPaymentDetails = getReviewPayment();
const reviewDocuments = getReviewDocuments();

const header = getCommonTitle({
  labelName: "Please review your Application and Submit",
  labelKey: "TL_SUMMARY_HEADER"
})

export const reviewDetails = getCommonCard({
  header,
  reviewPropertyInfo,
  reviewAuction,
  // reviewAllotment,
  reviewAdditional,
  // reviewOwnerDetails,
  // reviewPurchaserDetails,
  // reviewPaymentDetails,
  reviewCourtCaseDetails,
  // reviewDocuments
})