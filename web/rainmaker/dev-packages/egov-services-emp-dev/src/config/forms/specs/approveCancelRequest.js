const formConfig = {
    name: "approveCancelRequest",
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
      businessService: {
        id: "Booking-type",
        jsonPath: "Booking.businessService",
        value:''
      },
      CancelStatus: {
        id: "Booking-Status",
        jsonPath: "Booking.bkStatus",
        value:''
      },
      assignee: {
        id: "Booking-type",
        jsonPath: "Booking.assignee",
        value:''
      },
      // assignee: {
      //   id: "Booking-type",
      //   jsonPath: "Booking.bkBookingType",
      //   value:''
      // },
     
        // createdBy: {
        //   id: "createdby",
        //   jsonPath: "Booking.Remarks[0].bkCreatedBy",
        //   value:''
        // },
        // createdOn: {
        //   id: "application-number",
        //   jsonPath: "Booking.Remarks[0].bkCreatedOn",
        //   value:''
        // },
        remarks: {
          id: "application-number",
          jsonPath: "Booking.remarks",
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
        value: "",
      },
    },
    submit: {
      type: "submit",
      label: "CS_COMMON_SUBMIT",
      id: "reopencomplaint-submit-action",
    },
    action: "_update",
    redirectionRoute: "/egov-services/resolve-success",
    saveUrl: "/bookings/park/community/_update",
  };
  
  export default formConfig;
  