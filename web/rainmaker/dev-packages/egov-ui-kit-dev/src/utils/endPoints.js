export const LOCALATION = {
  GET: {
    URL: "localization/messages/v1/_search",
    ACTION: "_search",
  },
};

export const COMPLAINT = {
  GET: {
    URL: "rainmaker-pgr/v1/requests/_search",
    ACTION: "_search",
  },
};

export const DRAFTS = {
  GET: {
    URL: "pt-services-v2/drafts/_search",
    ACTION: "_search",
  },
};

export const FILE_UPLOAD = {
  POST: {
    URL: "filestore/v1/files",
  },
};

export const CATEGORY = {
  GET: {
    URL: "egov-mdms-service/v1/_search",
    ACTION: "_search",
  },
};

export const AUTH = {
  LOGOUT: {
    URL: "/user/_logout",
    ACTION: "_logout",
  },
};

export const FINANCE = {
  LOGOUT: {
    URL: "/services/EGF/rest/ClearToken",
    ACTION: "_finance_logout",
  },
};

export const USER = {
  SEARCH: {
    URL: "/user/_search",
    ACTION: "search",
  },
  UPDATE: {
    URL: "/profile/_update",
    ACTION: "create",
  },
};

export const OTP = {
  RESEND: {
    URL: "/user-otp/v1/_send",
    ACTION: "_send",
  },
};

export const EMPLOYEE = {
  GET: {
    URL: "/egov-hrms/employees/_search",
    ACTION: "_search",
  },
};

export const EMPLOYEE_ASSIGN = {
  GET: {
    URL: "/egov-hrms/employees/_search",
    ACTION: "_search",
  },
};

export const CITIZEN = {
  GET: {
    URL: "/user/v1/_search",
    ACTION: "_search",
  },
};

export const MDMS = {
  GET: {
    URL: "/egov-mdms-service/v1/_search",
    ACTION: "_search",
  },
};

export const TENANT = {
  POST: {
    URL: "egov-location/location/v11/tenant/_search",
    ACTION: "_search",
  },
};

export const SPEC = {
  GET: {
    URL: "spec-directory",
    ACTION: "_search",
  },
};

export const CITY = {
  GET: {
    URL: "/egov-mdms-service/v1/_search",
    ACTION: "_search",
  },
};

export const FLOOR = {
  GET: {
    URL: "/egov-mdms-service/v1/_search",
    ACTION: "_search",
  },
};
export const ACTIONMENU = {
  GET: {
    URL: "/access/v1/actions/mdms/_get",
    ACTION: "_get",
  },
};

export const PROPERTY = {
  GET: {
    URL: "/property-services/property/_search",
    ACTION: "_get",
  },
};

export const DRAFT = {
  GET: {
    URL: "/pt-services-v2/drafts/_search",
    ACTION: "_get",
  },
};

export const PGService = {
  GET: {
    URL: "/pg-service/transaction/v1/_search",
    ACTION: "_get",
  },
};

export const RECEIPT = {
  GET: {
    URL: "/collection-services/receipts/_search",
    ACTION: "_get",
  },
};

export const BOUNDARY = {
  GET: {
    URL: "/egov-location/location/v11/boundarys/_search",
    ACTION: "_get",
  },
};

export const EVENTSCOUNT = {
  GET: {
    URL: "/egov-user-event/v1/events/notifications/_count",
    ACTION: "_search",
  },
};

export const NOTIFICATIONS = {
  GET: {
    URL: "/egov-user-event/v1/events/_search",
    ACTION: "_search",
  },
};

export const FETCHBILL = {
  GET: {
    URL: "/billing-service/bill/v2/_fetchbill",
    ACTION: "_get",
  },
};
export const FETCHRECEIPT = {
  GET: {
    URL: "/collection-services/payments/_search",
    ACTION: "_get",
  },
};
export const DOWNLOADRECEIPT = {
  GET: {
    URL: "/pdf-service/v1/_create",
    ACTION: "_get",
  },
};
export const FETCHASSESSMENTS = {
  GET: {
    URL: "/property-services/assessment/_search",
    ACTION: "_search",
  },
};


export const APPLICATION = {
  POST: {
    URL: "bookings/api/employee/_search",
    ACTION: "_search",
  },
};
export const PAYMENT = {
  POST: {
    URL: "billing-service/bill/v2/_fetchbill?",
    ACTION: "_search",
  },
};

export const AFTERPAYMENTAPI = {
  POST: {
    URL: "collection-services/payments/_search?",
    ACTION: "_search",
  },
};
export const DWONLOADPAYMENTRECEIPT = {
  POST: {
    URL: "pdf-service/v1/_create?key=bk-payment-receipt",
    ACTION: "_search",
  },
};

export const HISTORY = {
  POST: {
    URL: "bookings/api/egov-workflow/process/_search?",
    ACTION: "_search",
  },
};

export const DOWNLOADAPPLICATION = {
  POST: {
    URL:"pdf-service/v1/_create?key=bk-osbm-app-form&tenatId=ch",
    ACTION: "_search",
  },
};

export const DOWNLOADBWTAPPLICATION = {
  POST: {
    URL:"pdf-service/v1/_create?key=bk-wt-app-form",
    ACTION: "_search",
  },
};

export const MCCAPPLICATION = { 
  POST: {
    URL: "bookings/newLocation/employee/osujm/_search",
    ACTION: "_search",
  },
  };
export const DWONLOADPERMISSIONLETTER = {
  POST: {
    URL: "pdf-service/v1/_create?key=bk-osbm-pl",
    ACTION: "_search",
  },
};
export const CREATEBWTAPPLICATION = {
  POST: {
    URL: "bookings/api/_create?",
    ACTION: "_search",
  },
};

export const PerDayRateAmount = {
  POST: {
    URL: "bookings/commercial/ground/fee/_search",
    ACTION: "_search",
  },
};
export const OSBMPerDayRateAmount = {
  POST: {
    URL: "bookings/osujm/fee/_search",
    ACTION: "_search",
  },
};
export const DWONLOADNEWRECEIPTFORCG = {
  POST: {
    URL: "pdf-service/v1/_create?key=bk-payment-receipt",
    ACTION: "_search",
  },
};
export const PermissionLetterDWNOSMCC = {
  POST: {
    URL: "pdf-service/v1/_create?key=bk-oswmcc-booking-pl",
    ACTION: "_search",
  },
};
export const ApplicationDWNOSMCC = {
  POST: {
    URL: "pdf-service/v1/_create?key=oswmcc-booking-app-form",
    ACTION: "_search",
  },
};
export const DWONLOADPAYMENTRECEIPTFORCG = {
  POST: {
    URL: "pdf-service/v1/_create?key=bk-cg-pl",
    ACTION: "_search",
  },
};
export const DWONLOADAPPLICATIONFORCG = {
  POST: {
    URL: "pdf-service/v1/_create?key=bk-cg-app-form",
    ACTION: "_search",
  },
};
export const CREATEPACCAPPLICATION = {
  POST: {
    URL: "bookings/park/community/_create?",
    ACTION: "_search",
  },
};
export const DWONLOADAPPFORPCC = {
  POST: {
    URL: "pdf-service/v1/_create?key=bk-pacc-app-form",
    ACTION: "_search",
  },
};
export const DWONLOADPLFORPCC = {
  POST: {
    URL: "pdf-service/v1/_create?key=bk-pacc-booking-pl",
    ACTION: "_search",
  },
};
export const DWONLOADRECEIPTFORPCC = {
  POST: {
    URL: "pdf-service/v1/_create?key=pacc-payment-receipt",
    ACTION: "_search",
  },
};

