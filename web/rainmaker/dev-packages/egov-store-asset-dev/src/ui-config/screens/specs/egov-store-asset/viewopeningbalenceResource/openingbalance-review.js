import { getCommonCard } from "egov-ui-framework/ui-config/screens/specs/utils";

import { getOpeningBalanceDetailsView } from "./view-openingbalance-details"
import { getReceiptDetailsView } from "./view-material-receipt-note-details"
// import { getStoreDetailsView } from "./view-store-details"
// import { getOtherDetailsView } from "./view-other-details";
import { masterCommonFooter } from "./footer";

export const OpeningBalanceReviewDetails = isReview => {
  const viewMaterialDetails = getOpeningBalanceDetailsView(isReview);
   const viewReceiptDetails = getReceiptDetailsView(isReview); 
  // const viewOtherDetails = getOtherDetailsView(isReview);
  const footer = isReview ? masterCommonFooter() : {};
  return getCommonCard({
    viewMaterialDetails, 
     viewReceiptDetails,   
    // viewOtherDetails,
    footer
  });
};
