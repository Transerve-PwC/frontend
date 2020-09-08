import { getCommonCard } from "egov-ui-framework/ui-config/screens/specs/utils";

import { getMTIHeaderView } from "./view-mti-header";
import { getMTIDetailsView } from "./view-mti-details";
import { getApprovalInfoView } from "./view-approvalInfo-details";
import { poCommonFooter } from "./footer";

export const MTIReviewDetails = isReview => {
  const viewMTIHeader = getMTIHeaderView(isReview);
  const viewMTIDetails = getMTIDetailsView(isReview);
  const viewApprovalInfo = getApprovalInfoView(isReview);
  const footer = isReview ? poCommonFooter() : {};
  return getCommonCard({
    viewMTIHeader,
    viewMTIDetails,
   // viewApprovalInfo,
    footer
  });
};
