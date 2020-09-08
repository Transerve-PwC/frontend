import { getCommonCard } from "egov-ui-framework/ui-config/screens/specs/utils";

import { getSHGMemberDetailsView } from "./view-shg-member-details";
import {reviewDocuments} from "./reviewDocuments"
import { getApprovalInfoView } from "./view-approvalInfo-details";
import { poCommonFooter } from "./footer";

export const ShgMemberReviewDetails = isReview => {
  const viewSMIDDetails = getSHGMemberDetailsView(isReview);
  const viewDocuments = reviewDocuments(isReview);
  const viewApprovalInfo = getApprovalInfoView(isReview);
  const footer = isReview ? poCommonFooter() : {};
  return getCommonCard({
    viewSMIDDetails,
    viewDocuments,
 //   viewApprovalInfo,
    footer
  });
};
