import { getCommonCard } from "egov-ui-framework/ui-config/screens/specs/utils";
import {getmemberDetailsView} from './view-shg-member'
import { getSMIDOrgDetailsView } from "./view-org-details";
import {reviewDocuments} from "./reviewDocuments"
import { getApprovalInfoView } from "./view-approvalInfo-details";
import { poCommonFooter } from "./footer";

export const SMIDOrgReviewDetails = isReview => {
  const viewSMIDOrgDetails = getSMIDOrgDetailsView(isReview);
  const viewmemberDetails = !isReview ? getmemberDetailsView(isReview) : {}
  const viewDocuments = reviewDocuments(isReview);
  const viewApprovalInfo = getApprovalInfoView(isReview);
  const footer = isReview ? poCommonFooter() : {};
  return getCommonCard({
    viewSMIDOrgDetails,
    viewmemberDetails,
  //  viewDocuments,
 //   viewApprovalInfo,
    footer
  });
};
