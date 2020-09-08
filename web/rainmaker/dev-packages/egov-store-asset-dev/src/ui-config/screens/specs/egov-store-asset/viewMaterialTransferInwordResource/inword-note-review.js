import { getCommonCard } from "egov-ui-framework/ui-config/screens/specs/utils";

import { getMaterialTransferInwordNoteListDetailsView } from "./view-material-transfer-inword-note"
 import { getMaterialTransferNoteDetailsView } from "./view-material-transfer-inword-note-details"
// import { getOtherDetailsView } from "./view-other-details";
import { masterCommonFooter } from "./footer";

export const MaterialTransferInwordReviewDetails = isReview => {
  const viewMaterialTransferInwordListDetails = getMaterialTransferInwordNoteListDetailsView(isReview);
    const viewMaterialTransferNoteDetails = getMaterialTransferNoteDetailsView(isReview); 
  // const viewOtherDetails = getOtherDetailsView(isReview);
  const footer = isReview ? masterCommonFooter() : {};
  return getCommonCard({
    viewMaterialTransferInwordListDetails, 
    viewMaterialTransferNoteDetails,   
    // viewOtherDetails,
    footer
  });
};
