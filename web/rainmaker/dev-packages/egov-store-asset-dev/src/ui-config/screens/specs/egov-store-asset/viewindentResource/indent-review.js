import { getCommonCard } from "egov-ui-framework/ui-config/screens/specs/utils";
import {totalValue} from '../createindentResource/totalValue';
import { getIndentListDetailsView } from "./view-indent-details"
 import { getIndentDetailsView } from "./view-material-indent-details"
// import { getOtherDetailsView } from "./view-other-details";
import { masterCommonFooter } from "./footer";

export const IndentListReviewDetails = isReview => {
  const viewMaterialDetails = getIndentListDetailsView(isReview);
    const viewIndentDetails = getIndentDetailsView(isReview); 
  // const viewOtherDetails = getOtherDetailsView(isReview);
  const footer = isReview ? masterCommonFooter() : {};
  return getCommonCard({
    viewMaterialDetails, 
    viewIndentDetails,   
    totalValue,
    footer
  });
};
