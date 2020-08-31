import { getCommonCard } from "egov-ui-framework/ui-config/screens/specs/utils";

import { getMTONHeaderView } from "./view-mton-header";
import { getMTONDetailsView } from "./view-mton-details";
import { getApprovalInfoView } from "./view-approvalInfo-details";
import { poCommonFooter } from "./footer";
import {totalIssueValue} from "../createMaterialTransferOutwardResource/totalIssueValue";
export const MTONReviewDetails = isReview => {
  const viewMTONHeader = getMTONHeaderView(isReview);
  const viewMTONDetails = getMTONDetailsView(isReview);
  const viewApprovalInfo = getApprovalInfoView(isReview);
  const footer = isReview ? poCommonFooter() : {};
  return getCommonCard({
    viewMTONHeader,
    viewMTONDetails,
    totalIssueValue,
    viewApprovalInfo,
    footer
  });
};
