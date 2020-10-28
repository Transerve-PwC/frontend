import { getCommonCard } from "egov-ui-framework/ui-config/screens/specs/utils";

import { getReceiptNoteListDetailsView } from "./view-receipt-note-details"
 import { getReceiptNoteDetailsView } from "./view-material-receipt-note-details"
// import { getOtherDetailsView } from "./view-other-details";
import { getDocumentView } from "./documentsSummary";
import { masterCommonFooter } from "./footer";
import {totalValue} from '../creatematerialReceiptNoteResource/totalValue';
export const MaterialReceiptReviewDetails = isReview => {
  const viewReceiptNoteListDetails = getReceiptNoteListDetailsView(isReview);
    const viewReceiptNoteDetails = getReceiptNoteDetailsView(isReview); 
    const viewgetDocumentDetails = getDocumentView(isReview);
  // const viewOtherDetails = getOtherDetailsView(isReview);
  const footer = isReview ? masterCommonFooter() : {};
  return getCommonCard({
    viewReceiptNoteListDetails, 
    viewReceiptNoteDetails, 
    totalValue,  
    // viewOtherDetails,
    viewgetDocumentDetails,
   // documentsSummary: documentsSummary,
    footer
  });
};
