import React from "react";
import Loadable from "react-loadable";

// pgr employee specific screens
// import { ReOpenComplaint, ReopenAcknowledgement } from "../modules/common";

const Loading = () => <div />;

const Login = Loadable({
  loader: () => import("../Screens/User/Login"),
  loading: Loading
});
const OTP = Loadable({
  loader: () => import("../Screens/User/OTP"),
  loading: Loading
});

const AllRequests = Loadable({
  loader: () => import("../Screens/AllApplications"),
  loading: Loading
});
const MasterData = Loadable({
  loader: () => import("../Screens/MasterData"),
  loading: Loading
});
const ApplicationResolved = Loadable({
  loader: () => import("../Screens/ApplicationResolved"),
  loading: Loading
});

const ParkAndCommunityCenterAppDetails=Loadable({
  loader: () => import("../Screens/ParkAndCommunityCenterAppDetails"),
  loading: Loading
});

const ApplicationSummary = Loadable({
  loader: () => import("../Screens/ApplicationDetails"),
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
//NewLocationApplicationDetails
const NewLocationApplicationDetails = Loadable({
  loader: () => import("../Screens/NewLocationApplicationDetails"),
  loading: Loading
});

const ServiceHome = Loadable({
  loader: () => import("../Screens/ApplicationDetails"),
  loading: Loading
});


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

const ApplyWaterTanker = Loadable({
  loader: () => import("../Screens/ApplyWaterTanker"),
  loading: Loading
})


const ApplyPArkAndCommunity= Loadable({
  loader: () => import("../Screens/ApplyParkAndCommunity"),
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
    path: "egov-services/booking-resolved/:applicationId?",
    component: ApplicationResolved,
    needsAuthentication: true,
    options: {
      hideFooter: true,
      title: "MYBK_APPLICATION_DETAILS_RESOLVE",
      titleBackground: true, // Use this if you need white background for title in web version
      redirectionUrl
    }
  },
 
  {
    path: "egov-services/park-and-community-center-appDetails-details/:applicationId",
    component: ParkAndCommunityCenterAppDetails,
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
      title: "BK_CS_HEADER_APPLICATION_SUMMARY",
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
    path: "egov-services/osmcc-application-details/:applicationId",
    component: OSWMCCApplicationDetails,
    needsAuthentication: true,
    options: {
      hideFooter: true,
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
      // title: "BK_CS_HEADER_APPLICATION_SUMMARY",
      redirectionUrl
    }
  },
  {
    path: "egov-services/resolve-success",
    component: ResolveSuccess,
    needsAuthentication: true,
    options: {
      hideBackButton: true,
      hideFooter: true,
      title: "CS_COMPLAINT_DETAILS_COMPLAINT_RESOLVED",
      hideTitle: true,
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
      redirectionUrl
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
      redirectionUrl
    }
  },
  {
    path: "egov-services/application-rejected",
    component: ApplicationRejected,
    needsAuthentication: true,
    options: {
      title: "ES_COMPLAINT_REJECTED_HEADER",
      hideTitle: true,
      hideFooter: true,
      redirectionUrl,
      hideBackButton: true
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
      redirectionUrl
    }
  }
];

export default routes;