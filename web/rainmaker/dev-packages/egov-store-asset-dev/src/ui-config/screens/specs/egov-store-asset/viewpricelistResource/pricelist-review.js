import { getCommonCard } from "egov-ui-framework/ui-config/screens/specs/utils";

import { getPriceListDetailsView } from "./view-pricelist-details"
 import { getStoreDetailsView } from "./view-price-store-details"
 import { documentsSummary } from "./documentsSummary";
// import { getOtherDetailsView } from "./view-other-details";
import { masterCommonFooter } from "./footer";

export const PriceListReviewDetails = isReview => {
  const viewMaterialDetails = getPriceListDetailsView(isReview);
    const viewStoreDetails = getStoreDetailsView(isReview); 
  // const viewOtherDetails = getOtherDetailsView(isReview);
  const footer = isReview ? masterCommonFooter() : {};
  return getCommonCard({
    viewMaterialDetails, 
    viewStoreDetails,   
    // viewOtherDetails,    
      documentsSummary: documentsSummary,
   
    footer
  });
};
