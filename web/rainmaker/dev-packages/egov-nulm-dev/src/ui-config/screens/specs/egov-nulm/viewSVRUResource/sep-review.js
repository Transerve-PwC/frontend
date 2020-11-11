import { getCommonCard } from "egov-ui-framework/ui-config/screens/specs/utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { getSEPDetailsView } from "./view-sep-details";
import {reviewDocuments} from "./reviewDocuments"
import { getApprovalInfoView } from "./view-approvalInfo-details";
import{getTFCDetailsView} from './view-tfcdetails';
import {getBankToProcessDetailsView} from './view-bankDetails';
import {getSanctionDetailsView} from './viewSanctionDetails'
import {getNomineeDetailsView} from './viewNominee';
import { poCommonFooter } from "./footer";
import {NULM_SEP_CREATED,
  FORWARD_TO_TASK_FORCE_COMMITTEE,
  APPROVED_BY_TASK_FORCE_COMMITTEE,
  REJECTED_BY_TASK_FORCE_COMMITTEE,
  SENT_TO_BANK_FOR_PROCESSING,
SANCTION_BY_BANK} from '../../../../../ui-utils/commons';


const formAvailabiltyBaseOnStatus = (isReview) => {
  let status = getQueryArg(window.location.href, "status");

  const viewSEPDetails = getSEPDetailsView(isReview);
  const viewNomineeDetails  = getNomineeDetailsView(isReview);
  const viewDocuments = reviewDocuments(isReview);
  const viewApprovalInfo = getApprovalInfoView(isReview);
  const viewTFCDetails = getTFCDetailsView(isReview);
  const viewBankToProcessDetails = getBankToProcessDetailsView(isReview);
  const viewSanctionDetails = getSanctionDetailsView(isReview);

  // switch(status){
  //   case NULM_SEP_CREATED : return {viewSEPDetails,viewDocuments}
  //   case FORWARD_TO_TASK_FORCE_COMMITTEE :  return {viewSEPDetails,viewDocuments}
  //   case APPROVED_BY_TASK_FORCE_COMMITTEE :  return  {viewSEPDetails,viewTFCDetails,viewDocuments}
  //   case REJECTED_BY_TASK_FORCE_COMMITTEE :  return  {viewSEPDetails,viewTFCDetails,viewDocuments}
  //   case SENT_TO_BANK_FOR_PROCESSING :   return  {viewSEPDetails,viewTFCDetails,viewBankToProcessDetails,viewDocuments}
  //   case SANCTION_BY_BANK :   return  {viewSEPDetails,viewTFCDetails,viewBankToProcessDetails,viewSanctionDetails,viewDocuments}
  //   default : return {viewSEPDetails,viewDocuments}
  // }
  return {viewSEPDetails,viewNomineeDetails,viewDocuments}
 
}

export const SEPReviewDetails = isReview => {
  const viewSEPBasedonAvailibilty = formAvailabiltyBaseOnStatus(isReview);
  const footer = isReview ? poCommonFooter() : {};
  return getCommonCard({
    ...viewSEPBasedonAvailibilty,
 //   viewApprovalInfo,
    footer
  });
};
