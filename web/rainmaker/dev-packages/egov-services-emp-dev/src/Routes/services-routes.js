import React from "react";
import Loadable from "react-loadable";

// pgr employee specific screens
import { ReOpenComplaint, ReopenAcknowledgement } from "../modules/common";

const Loading = () => <div />;

const Login = Loadable({
  loader: () => import("../Screens/User/Login"),
  loading: Loading
});
const OTP = Loadable({
  loader: () => import("../Screens/User/OTP"),
  loading: Loading
});

const RequestReAssign = Loadable({
  loader: () => import("../Screens/RequestReAssign"),
  loading: Loading
});
// const AllComplaints = Loadable({
//   loader: () => import("../Screens/AllComplaints"),
//   loading: Loading
// });
const AllRequests = Loadable({
  loader: () => import("../Screens/AllApplications"),
  loading: Loading
});


const ServicesTest = Loadable({
  loader: () => import("../Screens/ServicesTest"),
  loading: Loading
})

const MasterData = Loadable({
  loader: () => import("../Screens/MasterData"),
  loading: Loading
});
const OsbmFeeMasterData = Loadable({
  loader: () => import("../Screens/MasterData/OsbmFeeMasterData"),
  loading: Loading
});
const OsujmFeeMasterData = Loadable({
  loader: () => import("../Screens/MasterData/OsujmFeeMasterData"),
  loading: Loading
});
const PaccMasterData = Loadable({
  loader: () => import("../Screens/MasterData/PaccMasterData"),
  loading: Loading
});
const ApproverMasterData = Loadable({
  loader: () => import("../Screens/MasterData/ApproverMasterData"),
  loading: Loading
});
const ApplicationResolved = Loadable({
  loader: () => import("../Screens/ApplicationResolved"),
  loading: Loading
});
// const ComplaintCreated = Loadable({
//   loader: () => import("../Screens/ComplaintCreated"),
//   loading: Loading
// });
const ApplicationSummary = Loadable({
  loader: () => import("../Screens/ApplicationDetails"),
  loading: Loading
});


const ParkAndCommunityCenterAppDetails=Loadable({
  loader: () => import("../Screens/ParkAndCommunityCenterAppDetails"),
  loading: Loading
});
const LocationSummary = Loadable({
  loader: () => import("../Screens/LocationSummaryComponent"),
  loading: Loading
});

const CGApplicationDetails = Loadable({
  loader: () => import("../Screens/CGApplicationDetails"),
  loading: Loading
});

const AllMCCApplication = Loadable({
  loader: () => import("../Screens/AllMCCApplication"),
  loading: Loading
});

const OSWMCCApplicationDetails = Loadable({
  loader: () => import("../Screens/OSWMCCApplicationDetails"),
  loading: Loading
});

const ApplicationBWTSummary = Loadable({
  loader: () => import("../Screens/BwtApplicationDetails"),
  loading: Loading
});
//Successpagepcc
const CreateSuccessForPCC= Loadable({
  loader: () => import("../Screens/CreateSuccessForPCC"),
  loading: Loading
});
//NewLocationApplicationDetails
const NewLocationApplicationDetails = Loadable({
  loader: () => import("../Screens/NewLocationApplicationDetails"),
  loading: Loading
});
//payment-success-page   PaymentSuccessForEmployee
const PaymentSuccessForEmployee = Loadable({
  loader: () => import("../Screens/PaymentSuccessForEmployee"),
  loading: Loading
});


const CheckAvailabilityPcc= Loadable({
  loader: () => import("../Screens/ApplyParkAndCommunity/components/CheckAvailability"),
  loading: Loading
})

const PaymentReceiptDteail = Loadable({
  loader: () => import("../Screens/ParkAndCommunityCenterAppDetails/components/PayPage"),
  loading: Loading
})

const ServiceHome = Loadable({
  loader: () => import("../Screens/ApplicationDetails"),
  loading: Loading
});


const AssignComplaint = Loadable({
  loader: () => import("../Screens/AssignComplaint"),
  loading: Loading
});
const EmployeeDirectory = Loadable({
  loader: () => import("../Screens/EmployeeDirectory"),
  loading: Loading
});
// const ClosedComplaints = Loadable({
//   loader: () => import("../Screens/ClosedComplaints"),
//   loading: Loading
// });
const RejectComplaint = Loadable({
  loader: () => import("../Screens/RejectComplaint"),
  loading: Loading
});
const RejectBWTComplaint = Loadable({
  loader: () => import("../Screens/RejectBWTBooking"),
  loading: Loading
});

const deliverBooking= Loadable({
  loader: () => import("../Screens/DeliveredBWTBooking"),
  loading: Loading
});
const notDeliverBooking= Loadable({
  loader: () => import("../Screens/NotDeliveredBWTBooking"),
  loading: Loading
});

const AssignToDriver= Loadable({
  loader: () => import("../Screens/AssignToDriver"),
  loading: Loading
});
const ApplicationRejected = Loadable({
  loader: () => import("../Screens/ApplicationRejected"),
  loading: Loading
});
// const ComplaintAssigned = Loadable({
//   loader: () => import("../Screens/ComplaintAssigned"),
//   loading: Loading
// });
const ResolveSuccess = Loadable({
  loader: () => import("../Screens/ResolveSuccess"),
  loading: Loading
});

const PublishSuccess = Loadable({
  loader: () => import("../Screens/PublishSuccess"),
  loading: Loading
});
const NewLocationApproved= Loadable({
  loader: () => import("../Screens/NewLocationApproved"),
  loading: Loading
});
const CreateSuccess= Loadable({
  loader: () => import("../Screens/CreateWBTApplicationSuccess"),
  loading: Loading
});
const AssignToDriverSuccess = Loadable({
  loader: () => import("../Screens/AssignToDriverSuccess"),
  loading: Loading
});

const RejectBWTApplicationSuccess= Loadable({
  loader: () => import("../Screens/RejectBWTApplicationSuccess"),
  loading: Loading
});

const DeliveredApplicationSuccess= Loadable({
  loader: () => import("../Screens/DeliveredBWTApplicationSuccess"),
  loading: Loading
});
const ReassignSuccess = Loadable({
  loader: () => import("../Screens/ReassignSuccess"),
  loading: Loading
});
// const CreateComplaint = Loadable({
//   loader: () => import("../Screens/CreateComplaint"),
//   loading: Loading
// });
const SearchScreen = Loadable({
  loader: () => import("../Screens/SearchScreen"),
  loading: Loading
});

const ApplyWaterTanker = Loadable({
  loader: () => import("../Screens/ApplyWaterTanker"),
  loading: Loading
})


const CgFeeMasterData = Loadable({
  loader: () => import("../Screens/MasterData/CgFeeMasterData"),
  loading: Loading
})


const ApplyPArkAndCommunity= Loadable({
  loader: () => import("../Screens/ApplyParkAndCommunity"),
  loading: Loading
})

const testing= Loadable({
  loader: () => import("../Screens/testing"),
  loading: Loading
})

const MyTry = Loadable({
  loader: () => import("../Screens/MyTry/payment-methods"),
  loading: Loading
})

// import CreateEmployee from "modules/employee/pgr/CreateEmployee";
const redirectionUrl = "/user/login";
const routes = [
  {
    path: "user/login",
    component: Login,
    needsAuthentication: false,
    redirectionUrl: "/"
  },
  {
    path: "user/otp",
    component: OTP,
    needsAuthentication: false,
    redirectionUrl: "/"
  },
  // {
  //   path: "all-complaints",
  //   component: AllComplaints,
  //   needsAuthentication: true,
  //   options: {
  //     hideFooter: true,
  //     title: "ES_OPEN_COMPLAINTS_HEADER",
  //     hideTitle: false,
  //     redirectionUrl,
  //     hideFor: "ao",
  //     customFor: "csr",
  //     customTitle: "ES_ALL_COMPLAINTS_HEADER"
  //   }
  // },
  {
    path: "egov-services/all-applications",
    component: AllRequests,
    needsAuthentication: true,
    options: {
      hideFooter: true,
      title: "ES_OPEN_APPLICAION_HEADER",
      hideTitle: false,
      // redirectionUrl,
      // hideFor: "ao",
      customFor: "employee",
      customTitle: "BK_MYBK_ALL_APPLICAION_HEADER"
    }
  },
  {
    path: "egov-services/PaymentReceiptDteail/:applicationId",
    component: PaymentReceiptDteail,
    needsAuthentication: true,
    options: {
      hideFooter: true,
      // title: "ES_OPEN_APPLICAION_HEADER",
      hideTitle: false,
      customFor: "employee",
      customTitle: "BK_MYBK_PAYMENT_RCPT_DETAILS"
    }
  },
  {
    path: "egov-services/ServicesTest",
    component: ServicesTest,
    needsAuthentication: true,
    options: {
      hideFooter: true,
      title: "ES_OPEN_APPLICAION_HEADER",
      hideTitle: false,
      // redirectionUrl,
      // hideFor: "ao",
      customFor: "employee",
      customTitle: "BK_MYBK_ALL_APPLICAION_HEADER"
    }
  },


//successPageForPCC
{
  path: "egov-services/create-success-pcc",
  component: CreateSuccessForPCC,
  needsAuthentication: true,
  options: {
    hideBackButton: true,
    customFor: "employee",
    hideFooter: true,
    title: "CS_COMPLAINT_DETAILS_COMPLAINT_RESOLVED",
    hideTitle: true,
    redirectionUrl
  }
},

// PaymentForEmployee
{
  path: "egov-services/success-payment",
  component: PaymentSuccessForEmployee,
  needsAuthentication: true,
  options: {
    hideBackButton: true,
    customFor: "employee",
    hideFooter: true,
    title: "CS_COMPLAINT_DETAILS_COMPLAINT_RESOLVED",
    hideTitle: true,
    redirectionUrl
  }
},


//newMasterData
{
  path: "egov-services/MasterData",
  component: MasterData,
  needsAuthentication: true,
  options: {
    hideFooter: true,
    title: "ES_OPEN_APPLICAION_HEADER",
    hideTitle: false,
    redirectionUrl,
    hideFor: "ao",
    customFor: "employee",
    customTitle: "MYBK_ALL_APPLICAION_HEADER"
  }
},
{
  path: "egov-services/checkavailability_pcc",
  component: CheckAvailabilityPcc,
  needsAuthentication: true,
  options: {
    hideFooter: true,
    title: "BK_MYBK_APPLY_PACC_REQUEST_HEADER",
    
    customTitle: "BK_MYBK_CHECK_AVAILABILITY_HEADER"
  }
},
  
{
  path: "egov-services/admin/osbmFee",
  component: OsbmFeeMasterData,
  needsAuthentication: true,
  options: {
    hideFooter: true,
    title: "BK_MYBK_ADMIN_OSBM_FEE_HEADER",
  
    hideTitle: false,
    redirectionUrl,
    hideFor: "ao",
    customFor: "employee",
    customTitle: "BK_MYBK_ADMIN_OSBM_FEE_HEADER"
  }
},
{
  path: "egov-services/admin/approver",
  component: ApproverMasterData,
  needsAuthentication: true,
  options: {
    hideFooter: true,
    title: "BK_MYBK_ADMIN_APPROVER_FEE_HEADER",
    hideTitle: false,
    redirectionUrl,
    hideFor: "ao",
    customFor: "employee",
    customTitle: "BK_MYBK_ADMIN_APPROVER_FEE_HEADER"
  }
},
{
  path: "egov-services/admin/cgfee",
  component: CgFeeMasterData,
  needsAuthentication: true,
  options: {
    hideFooter: true,
    title: "BK_MYBK_ADMIN_CG_FEE_HEADER",
    hideTitle: false,
    redirectionUrl,
    hideFor: "ao",
    customFor: "employee",
    customTitle: "BK_MYBK_ADMIN_CG_FEE_HEADER"
  }
},
{
  path: "egov-services/admin/osujmfee",
  component: OsujmFeeMasterData,
  needsAuthentication: true,
  options: {
    hideFooter: true,
    title: "BK_MYBK_ADMIN_OSUJM_FEE_HEADER",
    hideTitle: false,
    redirectionUrl,
    hideFor: "ao",
    customFor: "employee",
    customTitle: "BK_MYBK_ADMIN_OSUJM_FEE_HEADER"
  }
},
{
  path: "egov-services/admin/pacc",
  component: PaccMasterData,
  needsAuthentication: true,
  options: {
    hideFooter: true,
    title: "BK_MYBK_ADMIN_PACC_FEE_HEADER",
    hideTitle: false,
    redirectionUrl,
    hideFor: "ao",
    customFor: "employee",
    customTitle: "BK_MYBK_ADMIN_PACC_FEE_HEADER"
  }
},

  {
    path: "egov-services/applywatertanker",
    component: ApplyWaterTanker,
    needsAuthentication: true,
    options: {
      hideFooter: true,
      title: "BK_MYBK_APPLY_SPECIAL_REQUEST_HEADER",
      hideTitle: false,
      redirectionUrl,
      hideFor: "ao",
      customFor: "employee",
      customTitle: "BK_MYBK_APPLY_SPECIAL_REQUEST_HEADER"
    }
  },

  {
    path: "egov-services/applyPark-community-center",
    component: ApplyPArkAndCommunity,
    needsAuthentication: true,
    options: {
      hideFooter: true,
      title: "BK_MYBK_APPLY_PACC_REQUEST_HEADER",
      hideTitle: false,
      redirectionUrl,
      hideFor: "ao",
      customFor: "employee",
      customTitle: "BK_MYBK_APPLY_PACC_REQUEST_HEADER"
    }
  },
  {
    path: "search-complaint",
    component: SearchScreen,
    needsAuthentication: true,
    options: { hideFooter: true, title: "CORE_COMMON_SEARCH_COMPLAINT" }
  },
  {
    path: "egov-services/booking-resolved/:applicationId?",
    component: ApplicationResolved,
    needsAuthentication: true,
    options: {
      hideFooter: true,
      customFor: "employee",
      title: "MYBK_APPLICATION_DETAILS_RESOLVE",
      titleBackground: true, // Use this if you need white background for title in web version
      redirectionUrl
    }
  },
  {
    path: "egov-services/application-details/:applicationId",
    component: ApplicationSummary,
    needsAuthentication: true,
    options: {
      hideFooter: true,
      // title: "BK_CS_HEADER_APPLICATION_SUMMARY",
      redirectionUrl
    }
  },
  {
    path: "egov-services/park-and-community-center-appDetails-details/:applicationId",
    component: ParkAndCommunityCenterAppDetails,
    needsAuthentication: true,
    options: {
      hideFooter: true,
      customFor: "employee",
      // title: "BK_CS_HEADER_APPLICATION_SUMMARY",
      redirectionUrl
    }
  },

  
  {
    path: "egov-services/new-location-details/:applicationId",
    component: LocationSummary,
    needsAuthentication: true,
    options: {
      hideFooter: true,
      // title: "BK_CS_HEADER_APPLICATION_SUMMARY",
      redirectionUrl
    }
  },
 
  {
    path: "egov-services/cg-application-details/:applicationId",
    component: CGApplicationDetails,
    needsAuthentication: true,
    options: {
      hideFooter: true,
      customFor: "employee",
      // title: "BK_CS_HEADER_APPLICATION_SUMMARY",
      redirectionUrl
    }
  },
  {
    path: "egov-services/newLocation-application-details/:applicationId",
    component: NewLocationApplicationDetails,
    needsAuthentication: true,
    options: {
      hideFooter: true,
      customFor: "employee",
      // title: "BK_CS_HEADER_APPLICATION_SUMMARY",
      redirectionUrl
    }
  },
  {
    path: "egov-services/all-MccApplications",
    component: AllMCCApplication,
    needsAuthentication: true,
    options: {
      hideFooter: true,
      customFor: "employee",
      title: "BK_CS_HEADER_APPLICATION_SUMMARY",
      redirectionUrl
    }
  },

  {
    path: "egov-services/osmcc-application-details/:applicationId",
    component: OSWMCCApplicationDetails,
    needsAuthentication: true,
    options: {
      hideFooter: true,
      customFor: "employee",
      // title: "BK_CS_HEADER_APPLICATION_SUMMARY",
      redirectionUrl
    }
  },
 
  {
    path: "egov-services/bwt-application-details/:applicationId",
    component: ApplicationBWTSummary,
    needsAuthentication: true,
    options: {
      hideFooter: true,
      customFor: "employee",
      // title: "BK_CS_HEADER_APPLICATION_SUMMARY",
      redirectionUrl
    }
  },
  {
    path: "egov-services/home123",
    component: ApplicationSummary,
    needsAuthentication: true,
    options: {
      hideFooter: true,
      title: "BK_CS_HEADER_APPLICATION_SUMMARY",
      redirectionUrl
    }
  },
  // 
  
  // {
  //   path: "complaint-reassigned/:serviceRequestId?",
  //   component: ComplaintAssigned,
  //   needsAuthentication: true,
  //   options: {
  //     hideFooter: true,
  //     title: "ES_COMPLAINT_REASSIGNED_HEADER",
  //     hideTitle: true,
  //     redirectionUrl
  //   }
  // },
  {
    path: "egov-services/resolve-success",
    component: ResolveSuccess,
    needsAuthentication: true,
    options: {
      hideBackButton: true,
      hideFooter: true,
      title: "CS_COMPLAINT_DETAILS_COMPLAINT_RESOLVED",
      hideTitle: true,
      customFor: "employee",
      redirectionUrl
    }
  },
  {
    path: "egov-services/publish-success",
    component: PublishSuccess,
    needsAuthentication: true,
    options: {
      hideBackButton: true,
      hideFooter: true,
      title: "CS_COMPLAINT_DETAILS_COMPLAINT_RESOLVED",
      hideTitle: true,
      customFor: "employee",
      redirectionUrl
    }
  },


  {
    path: "egov-services/newLocation-approved",
    component: NewLocationApproved,
    needsAuthentication: true,
    options: {
      hideBackButton: true,
      hideFooter: true,
      title: "CS_COMPLAINT_DETAILS_COMPLAINT_RESOLVED",
      hideTitle: true,
      customFor: "employee",
      redirectionUrl
    }
  },
  {
    path: "egov-services/assign-to-success",
    component: AssignToDriverSuccess,
    needsAuthentication: true,
    options: {
      hideBackButton: true,
      hideFooter: true,
      title: "CS_COMPLAINT_DETAILS_COMPLAINT_RESOLVED",
      hideTitle: true,
      customFor: "employee",
      redirectionUrl
    }
  },

  {
    path: "egov-services/reject-bwt-application-success",
    component: RejectBWTApplicationSuccess,
    needsAuthentication: true,
    options: {
      hideBackButton: true,
      hideFooter: true,
      title: "CS_COMPLAINT_DETAILS_COMPLAINT_RESOLVED",
      hideTitle: true,
      customFor: "employee",
      redirectionUrl
    }
  },

  {
    path: "egov-services/delivered-bwt-application-success",
    component: DeliveredApplicationSuccess,
    needsAuthentication: true,
    options: {
      hideBackButton: true,
      hideFooter: true,
      title: "CS_COMPLAINT_DETAILS_COMPLAINT_RESOLVED",
      hideTitle: true,
      customFor: "employee",
      redirectionUrl
    }
  },
  {
    path: "reassign-success",
    component: ReassignSuccess,
    needsAuthentication: true,
    options: {
      hideBackButton: true,
      hideFooter: true,
      hideTitle: true,
      title: "CS_COMMON_RE-ASSIGN REQUESTED",
      redirectionUrl
    }
  },
  // {
  //   path: "complaint-assigned/:serviceRequestId?",
  //   component: ComplaintAssigned,
  //   needsAuthentication: true,
  //   options: {
  //     hideBackButton: true,
  //     hideFooter: true,
  //     hideTitle: true,
  //     title: "ES_COMPLAINT_ASSIGNED_HEADER",
  //     redirectionUrl
  //   }
  // },
  {
    path: "egov-services/application-rejected",
    component: ApplicationRejected,
    needsAuthentication: true,
    options: {
      title: "ES_COMPLAINT_REJECTED_HEADER",
      hideTitle: true,
      hideFooter: true,
      customFor: "employee",
      redirectionUrl,
      hideBackButton: true
    }
  },
  {
    path: "assign-complaint/:serviceRequestId?",
    component: AssignComplaint,
    needsAuthentication: true,
    options: {
      title: "ES_ASSIGN_TO_EMPLOYEE_HEADER",
      hideFooter: true,
      redirectionUrl
    }
  },
  {
    path: "reassign-complaint/:serviceRequestId?",
    component: AssignComplaint,
    needsAuthentication: true,
    options: {
      title: "ES_REASSIGN_TO_EMPLOYEE_HEADER",
      hideFooter: true,
      redirectionUrl
    }
  },
  {
    path: "employee-directory",
    component: EmployeeDirectory,
    needsAuthentication: true,
    options: {
      title: "ES_EMPLOYEE_DIRECTORY_HEADER",
      hideFooter: true,
      redirectionUrl
    }
  },
  {
    path: "egov-services/reject-booking/:applicationId?",
    component: RejectComplaint,
    needsAuthentication: true,
    options: {
      // title: "ES_REASON_TO_REJECT_HEADER",
      titleBackground: true, // Use this if you need white background for title in web version
      hideFooter: true,
      customFor: "employee",
      redirectionUrl
    }
  },
  {
    path: "egov-services/reject-bwt-booking/:applicationId?",
    component: RejectBWTComplaint,
    needsAuthentication: true,
    options: {
      // title: "ES_REASON_TO_REJECT_HEADER",
      titleBackground: true, // Use this if you need white background for title in web version
      hideFooter: true,
      customFor: "employee",
      redirectionUrl
    }
  },

  {
    path: "egov-services/deliver-application/:applicationId?",
    component: deliverBooking,
    needsAuthentication: true,
    options: {
      // title: "ES_REASON_TO_REJECT_HEADER",
      titleBackground: true, // Use this if you need white background for title in web version
      hideFooter: true,
      customFor: "employee",
      redirectionUrl
    }
  },
  {
    path: "egov-services/not-deliver-application/:applicationId?",
    component: notDeliverBooking,
    needsAuthentication: true,
    options: {
      // title: "ES_REASON_TO_REJECT_HEADER",
      titleBackground: true, // Use this if you need white background for title in web version
      hideFooter: true,
      customFor: "employee",
      redirectionUrl
    }
  },
  
 
  {
    path: "egov-services/assignto-driver/:applicationId?",
    component: AssignToDriver,
    needsAuthentication: true,
    options: {
       title: "BK_MYBK_ASSIGN_TO_DRIVER_HEADER",
      titleBackground: true, // Use this if you need white background for title in web version
      hideFooter: true,
      customFor: "employee",
      redirectionUrl
    }
  },

  {
    path: "/egov-services/testing",
    component: testing,
    needsAuthentication: true,
    options: {
      hideFooter: true,
      title: "BK_MYBK_PCC_APPLICATION_REQUEST",
      hideTitle: false,
      customFor: "employee"
    }
  },


  {
    path: "egov-services/ServicesTest",
    component: ServicesTest,
    needsAuthentication: true,
    options: {
      hideFooter: true,
      title: "ES_OPEN_APPLICAION_HEADER",
      hideTitle: false,
      // redirectionUrl,
      // hideFor: "ao",
      customFor: "employee",
      customTitle: "BK_MYBK_ALL_APPLICAION_HEADER"
    }
  },

  {
    path: "egov-services/create-success",
    component: CreateSuccess,
    needsAuthentication: true,
    options: {
      hideBackButton: true,
      hideFooter: true,
      title: "CS_COMPLAINT_DETAILS_COMPLAINT_RESOLVED",
      hideTitle: true,
      customFor: "employee",
    }
  },

  {
    path: "/egov-services/MyTry",
    component: MyTry,
    needsAuthentication: true,
    options: {
      hideFooter: false,
      hideBackButton: true,
      title: "BK_MYBK_PCC_APPLICATION_REQUEST",
      customFor: "employee",
    }
  },

];

export default routes;