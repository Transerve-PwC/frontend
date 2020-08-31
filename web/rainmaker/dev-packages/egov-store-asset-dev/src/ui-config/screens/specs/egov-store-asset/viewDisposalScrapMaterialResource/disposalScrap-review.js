import { getCommonCard } from "egov-ui-framework/ui-config/screens/specs/utils";

import { getDisposalScrapHeaderView } from "./view-disposalscrap-header";
import { getDisposalScrapMaterialDetailsView } from "./view-disposalscrapMaterial-details";
import { getApprovalInfoView } from "./view-approvalInfo-details";
import { poCommonFooter } from "./footer";

export const DisposalScrapReviewDetails = isReview => {
  const viewDisposalScrapHeader = getDisposalScrapHeaderView(isReview);
  const viewDisposalScrapMaterialDetails = getDisposalScrapMaterialDetailsView(isReview);
  const viewApprovalInfo = getApprovalInfoView(isReview);
  const footer = isReview ? poCommonFooter() : {};
  return getCommonCard({
    viewDisposalScrapHeader,
    viewDisposalScrapMaterialDetails,
    viewApprovalInfo,
    footer
  });
};
