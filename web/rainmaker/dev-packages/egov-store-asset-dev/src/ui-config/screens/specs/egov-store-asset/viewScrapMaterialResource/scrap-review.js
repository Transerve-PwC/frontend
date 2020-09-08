import { getCommonCard } from "egov-ui-framework/ui-config/screens/specs/utils";

import { getScrapHeaderView } from "./view-scrap-header";
import { getScrapMaterialDetailsView } from "./view-scrapMaterial-details";
import { getApprovalInfoView } from "./view-approvalInfo-details";
import { poCommonFooter } from "./footer";

export const ScrapReviewDetails = isReview => {
  const viewScrapHeader = getScrapHeaderView(isReview);
  const viewScrapMaterialDetails = getScrapMaterialDetailsView(isReview);
  const viewApprovalInfo = getApprovalInfoView(isReview);
  const footer = isReview ? poCommonFooter() : {};
  return getCommonCard({
    viewScrapHeader,
    viewScrapMaterialDetails,
    viewApprovalInfo,
    footer
  });
};
