import { getCommonCard, getCommonTitle } from "egov-ui-framework/ui-config/screens/specs/utils";
import { getReviewProperty, getReviewOwner, getReviewAddress, getReviewRentDetails, getReviewPaymentDetails } from "./review-property";
import {getReviewApplicantDetails, getreviewPropertyAddressDetails,getDuplicateCopyReviewPropertyAddressDetails,getDuplicateCopyPreviewApplicantDetails} from './review-applications'
import { getReviewDocuments} from "./review-documents";
import { getReviewApplicantDetailsMortgage, getreviewPropertyAddressDetailsMortgage } from './review-applications-mortgage'

const reviewPropertyDetails = getReviewProperty();
const reviewOwnerDetails = getReviewOwner();
const reviewAddressDetails = getReviewAddress();
const reviewRentDetails = getReviewRentDetails();
const reviewPaymentDetails = getReviewPaymentDetails();
const reviewDocuments = getReviewDocuments(true, "apply");
const reviewApplicantDetails = getReviewApplicantDetails();
const reviewPropertyAddressDetails = getreviewPropertyAddressDetails()
const reviewApplicantDetailsMortgage = getReviewApplicantDetailsMortgage();
const reviewPropertyAddressDetailsMortgage = getreviewPropertyAddressDetailsMortgage();
const reviewFreshLicenceDocuments = getReviewDocuments(true, "ownership-apply", "OwnersTemp[0].reviewDocData")
const reviewDuplicatePropertytDetails = getDuplicateCopyReviewPropertyAddressDetails()
const reviewDuplicateApplicantDetails = getDuplicateCopyPreviewApplicantDetails()
const reviewDupliateCopyDocuments = getReviewDocuments(true,"duplicate-copy-apply","DuplicateTemp[0].reviewDocData")
const reviewMortgageDocuments = getReviewDocuments(true, "mortage-apply", "MortgageApplicationsTemp[0].reviewDocData")
const header = getCommonTitle({
  labelName: "Summary",
  labelKey: "RP_PM_SUMMARY_HEADER"
})

const rentHistoryHeader = getCommonTitle({
  labelName: "Upload Account Statement",
  labelKey: "RP_PM_UPLOAD_ACCOUNT_STATEMENT_HEADER"
})

export const rentedReviewDetails = getCommonCard({
      header,
      reviewPropertyDetails,
      reviewOwnerDetails,
      reviewAddressDetails,
      reviewRentDetails,
      reviewPaymentDetails,
      reviewDocuments
})

export const rentHistoryDetails = getCommonCard({
  rentHistoryHeader,
  rentHistoryUploadCSV,
  // reviewPropertyDetails,
  // reviewOwnerDetails,
  // reviewAddressDetails,
  // reviewRentDetails,
  // reviewPaymentDetails,
  // reviewDocuments
})

export const ownerShipReviewDetails = getCommonCard({
    header,
    reviewPropertyAddressDetails,
    reviewApplicantDetails,
    reviewFreshLicenceDocuments
})


export const duplicateCopyDetails = getCommonCard({
    header,
    reviewDuplicatePropertytDetails,
    reviewDuplicateApplicantDetails,
    reviewDupliateCopyDocuments
})
export const mortgageReviewDetails = getCommonCard({
  header,
  reviewPropertyAddressDetailsMortgage,
  reviewApplicantDetailsMortgage,
  reviewMortgageDocuments
})