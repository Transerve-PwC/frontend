const formConfig = {
    name: "approveWBTBooking",
    fields: {
      comments: {
        id: "comments-reopen",
        jsonPath: "Booking.comments",
      },
      applicationNumber: {
        id: "application-number",
        jsonPath: "Booking.bkApplicationNumber",
        value:''
      },
      bookingType: {
        id: "booking-type",
        jsonPath: "Booking.bkBookingType",
        value:''
      },
      businessService: {
        id: "businessService",
        jsonPath: "Booking.businessService",
        value:''
      },
      driverName: {
        id: "driverName",
        jsonPath: "Booking.bkDriverName",
        value:''
      },
      approverName: {
        id: "approverName",
        jsonPath: "Booking.bkApproverName",
        value:''
      },
      mobileNumber: {
        id: "driverMobileNumber",
        jsonPath: "Booking.bkContactNo",
        value:''
      },
      
        // createdBy: {
        //   id: "createdby",
        //   jsonPath: "Booking.bookingsRemarks[0].bkCreatedBy",
        //   value:''
        // },
        // createdOn: {
        //   id: "application-number",
        //   jsonPath: "Booking.bookingsRemarks[0].bkCreatedOn",
        //   value:''
        // },
        remarks: {
          id: "application-number",
          jsonPath: "Booking.bkRemarks",
          value:''
        }
     ,
      tenantId: {
        id: "tenantId",
        jsonPath: "Booking.tenantId",
        value:''
      },
      textarea: {
        id: "textarea",
        hintText: "CS_COMMON_COMMENTS_PLACEHOLDER",
      },
      action: {
        id: "action",
        jsonPath: "Booking.bkAction",
        value: "ASSIGNDRIVER",
      },
    },
    submit: {
      type: "submit",
      label: "CS_COMMON_SUBMIT",
      id: "reopencomplaint-submit-action",
    },
    action: "_update",
    redirectionRoute: "/egov-services/DriverAssigned",
    saveUrl: "/bookings/api/_update",
  };
  
  export default formConfig;
  