import { getCommonCard } from "egov-ui-framework/ui-config/screens/specs/utils";

import { getSMIDDetailsView } from "./view-smid-details";
import {reviewDocuments} from "./reviewDocuments"
import { getApprovalInfoView } from "./view-approvalInfo-details";
import { poCommonFooter } from "./footer";

export const SMIDReviewDetails = isReview => {
  const viewSMIDDetails = getSMIDDetailsView(isReview);
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
