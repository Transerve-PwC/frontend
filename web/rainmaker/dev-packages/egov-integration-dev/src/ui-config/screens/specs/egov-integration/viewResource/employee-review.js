import { getCommonCard } from "egov-ui-framework/ui-config/screens/specs/utils";

import { getEmployeeDetailsView } from "./view-employee-details";
// import { getEmployeeJoiningRelievingDetailsView } from "./view-jurisdiction-details";
// import { getEmployeeBacklogLeaveDetailsView } from "./view-assignment-details";
import { hrCommonFooter } from "./footer";

export const employeeReviewDetails = isReview => {
  const viewBasicEmployeeDetails = getEmployeeDetailsView(isReview);
  // const viewEmployeeJoiningRelievingDetails = getEmployeeJoiningRelievingDetailsView(isReview);
  // const viewEmployeeBacklogLeaveDetails = getEmployeeBacklogLeaveDetailsView(isReview); 
  const footer = isReview ? hrCommonFooter() : {};
  return getCommonCard({
    viewBasicEmployeeDetails,
    // viewEmployeeJoiningRelievingDetails,
    // viewEmployeeBacklogLeaveDetails,    
    footer
  });
};
