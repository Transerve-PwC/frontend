import { getCommonCard } from "egov-ui-framework/ui-config/screens/specs/utils";

import { getPurchaseOrderHeaderView } from "./view-po-header";
import { getRCDetailsView } from "./view-rc-details";
import { getPODetailsView } from "./view-po-details";
import {totalPOValue} from '../createPurchaseOrderResource/totalPOValue';
import { poCommonFooter } from "./footer";

export const POReviewDetails = isReview => {
  const viewPurchaseOrderHeader = getPurchaseOrderHeaderView(isReview);
  const viewRateContractDetails = getRCDetailsView(isReview);
  const viewPODetails = getPODetailsView(isReview);
  const footer = isReview ? poCommonFooter() : {};
  return getCommonCard({
    viewPurchaseOrderHeader,
    viewRateContractDetails,
    viewPODetails,
    totalPOValue,
    footer
  });
};
