import { getCommonCard } from "egov-ui-framework/ui-config/screens/specs/utils";

import { getSEPDetailsView } from "./view-sep-details";
import {reviewDocuments} from "./reviewDocuments"
import { getApprovalInfoView } from "./view-approvalInfo-details";
import { poCommonFooter } from "./footer";

export const SEPReviewDetails = isReview => {
  const viewSEPDetails = getSEPDetailsView(isReview);
  const viewDocuments = reviewDocuments(isReview);
  const viewApprovalInfo = getApprovalInfoView(isReview);
  const footer = isReview ? poCommonFooter() : {};
  return getCommonCard({
    viewSEPDetails,
    viewDocuments,
 //   viewApprovalInfo,
    footer
  });
};
