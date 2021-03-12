import React, { Component } from "react";
import { connect } from "react-redux";
import formHOC from "egov-ui-kit/hocs/form";
import { Screen } from "modules/common";
import PaccCancelledApproveForm from "./components/PaccCancelledApproveForm";
import { fetchApplications, fetchResponseForRefdunf, fetchDataAfterPayment } from "egov-ui-kit/redux/bookings/actions";
import Label from "egov-ui-kit/utils/translationNode";
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";
import { handleFieldChange } from "egov-ui-kit/redux/form/actions";
import "./index.css";
import { httpRequest } from "egov-ui-kit/utils/api";
import { loginRequest, wrapRequestBody, } from "egov-ui-kit/utils/api";
import {
  getLocale
} from "egov-ui-kit/utils/localStorageUtils";



const CancelRequestApprovedHOC = formHOC({
  formKey: "approveCancelRequest",
  isCoreConfiguration: 'false',
})(PaccCancelledApproveForm);


class CancelRequestApproved extends Component {
  state = {
    valueSelected: "",
    commentValue: "",
    assignee: "",
    assignToMe: [],
    setOpen: false,
    FinApirequestBody: ""
  };

  async calculateAppliedRefundHeads(ledgers, bookingDate, tenantId) {

    let calculatedAppliedRefundWithGLCodes = [];
    var CheckDate = new Date(bookingDate);

    var todayDate = new Date();

    if (todayDate < CheckDate) {


      let mdmsBody = {
        MdmsCriteria: {
          tenantId: tenantId,
          moduleDetails: [

            {
              moduleName: "Booking",
              masterDetails: [
                {
                  name: "bookingCancellationRefundCalc",
                }
              ],
            },

          ],
        },
      };

      let refundPercentage = '';

      let payloadRes = null;
      payloadRes = await httpRequest(
        "egov-mdms-service/v1/_search",
        "_search", [],
        mdmsBody
      );

      refundPercentage = payloadRes.MdmsRes.Booking.bookingCancellationRefundCalc[0];


      var date1 = new Date(bookingDate);

      var date2 = new Date();

      var Difference_In_Time = date1.getTime() - date2.getTime();

      // To calculate the no. of days between two dates
      var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

      let refundAmount = 0
      if (Difference_In_Days > 29) {
        let refundPercent = refundPercentage.MORETHAN30DAYS.refundpercentage;



        for (let g = 0; g < ledgers.length; g++) {

          if (ledgers[g].taxHeadCode === "PARKING_LOTS_MANUAL_OPEN_SPACE_BOOKING_BRANCH") {
            calculatedAppliedRefundWithGLCodes.push({
              "glcode": ledgers[g].glcode,
              "debitAmount": ((parseFloat(ledgers[g].debitAmount) * refundPercent) / 100),
              "creditAmount": 0.0,
              "taxHeadCode": ledgers[g].taxHeadCode
            });
          }
          if (ledgers[g].taxHeadCode === "SECURITY_MANUAL_OPEN_SPACE_BOOKING_BRANCH") {
            calculatedAppliedRefundWithGLCodes.push({
              "glcode": ledgers[g].glcode,
              "debitAmount": parseFloat(ledgers[g].debitAmount),
              "creditAmount": 0.0,
              "taxHeadCode": ledgers[g].taxHeadCode
            });
          }
        }
      } else if (Difference_In_Days > 15 && Difference_In_Days < 30) {
        let refundPercent = refundPercentage.LETTHAN30MORETHAN15DAYS.refundpercentage;
        for (let g = 0; g < ledgers.length; g++) {

          if (ledgers[g].taxHeadCode === "PARKING_LOTS_MANUAL_OPEN_SPACE_BOOKING_BRANCH") {
            calculatedAppliedRefundWithGLCodes.push({
              "glcode": ledgers[g].glcode,
              "debitAmount": ((parseFloat(ledgers[g].debitAmount) * refundPercent) / 100),
              "creditAmount": 0.0,
              "taxHeadCode": ledgers[g].taxHeadCode
            });
          }
          if (ledgers[g].taxHeadCode === "SECURITY_MANUAL_OPEN_SPACE_BOOKING_BRANCH") {
            calculatedAppliedRefundWithGLCodes.push({
              "glcode": ledgers[g].glcode,
              "debitAmount": parseFloat(ledgers[g].debitAmount),
              "creditAmount": 0.0,
              "taxHeadCode": ledgers[g].taxHeadCode
            });
          }
        }
      }


      return calculatedAppliedRefundWithGLCodes;
    } else if (todayDate > CheckDate) {
      //This is the case of Security Refund
      for (let g = 0; g < ledgers.length; g++) {


        if (ledgers[g].taxHeadCode === "SECURITY_MANUAL_OPEN_SPACE_BOOKING_BRANCH") {
          calculatedAppliedRefundWithGLCodes.push({
            "glcode": ledgers[g].glcode,
            "debitAmount": parseFloat(ledgers[g].debitAmount),
            "creditAmount": 0.0,
            "taxHeadCode": ledgers[g].taxHeadCode
          });
        }
      }

      return calculatedAppliedRefundWithGLCodes;
    }
  }
  async componentDidMount() {
    let { fetchApplications, match, payload, payloadTwo, paymentDetailsForReceipt, userInfo, matchparams, applicationNumber, trasformData, fetchResponseForRefdunf, selectedComplaint } = this.props;

    let dateForCancel = selectedComplaint.bkFromDate;

    let AllGlCode;
    let selectedGlCodeArray = [];
    let mdmsBody = {
      MdmsCriteria: {
        tenantId: userInfo.tenantId,
        moduleDetails: [
          {
            moduleName: "tenant",
            masterDetails: [
              {
                name: "tenants",
              },
            ],
          },
          {
            moduleName: "Booking",
            masterDetails: [
              {
                name: "BOOKING_GL_CODE_MAPPING"
              },
              {
                name: "bookingCancellationRefundCalc",
              }
            ],
          },
        ],
      },
    };

    try {
      let payload = null;
      payload = await httpRequest(
        "/egov-mdms-service/v1/_search",
        "_search",
        [],
        mdmsBody
      );

      AllGlCode = payload.MdmsRes.Booking.BOOKING_GL_CODE_MAPPING

    } catch (e) {
      console.log(e);
    }

    let RequestData = [
      { key: "consumerCodes", value: selectedComplaint.bkApplicationNumber },
      { key: "tenantId", value: userInfo.tenantId }
    ];

    let ResponseOfPaymentCall = await httpRequest(
      "collection-services/payments/_search",
      "_search",
      RequestData,
    );



    let findBusinessService = ResponseOfPaymentCall.Payments[0].paymentDetails[0].businessService
    let billAccountDetails = ResponseOfPaymentCall.Payments[0].paymentDetails[0].bill.billDetails[0].billAccountDetails;


    for (let i = 0; i < AllGlCode.length; i++) {
      if (AllGlCode[i].billingservicecode == findBusinessService) {
        selectedGlCodeArray.push(AllGlCode[i])
      }
    }

    let ledgers = [];
    for (let j = 0; j < selectedGlCodeArray.length; j++) {

      for (let k = 0; k < billAccountDetails.length; k++) {

        if (selectedGlCodeArray[j].taxhead === billAccountDetails[k].taxHeadCode) {

          ledgers.push({
            "glcode": selectedGlCodeArray[j].glcode,
            "debitAmount": billAccountDetails[k].amount,  //refund amount
            "creditAmount": 0.0,
            "taxHeadCode": billAccountDetails[k].taxHeadCode
          });
        }
      }
    }



    let calculateAppliedRefundHeads = await this.calculateAppliedRefundHeads(ledgers, dateForCancel, userInfo.tenantId);

    if (selectedComplaint.bkApplicationStatus == "PENDING_FOR_DISBURSEMENT") {


      //condition for employee cancelation
      if (selectedComplaint.bkAction == "OFFLINE_CANCEL") {



        let Receipt = {
          "receiptNumber": paymentDetailsForReceipt.Payments[0].paymentDetails[0].receiptNumber,
          "isCitizenRefund": "Y",
          "citizenName": selectedComplaint.bkApplicantName,
          "correspondingAddress": selectedComplaint.bkHouseNo,
          "bankName": selectedComplaint.bkBankName,
          "bankAccount": selectedComplaint.bkBankAccountNumber,
          "ifscCode": selectedComplaint.bkIfscCode,

          "ledgers": calculateAppliedRefundHeads

        }


        this.setState({ FinApirequestBody: Receipt })




      } else {



        let Receipt = {
          "receiptNumber": paymentDetailsForReceipt.Payments[0].paymentDetails[0]
            .receiptNumber,
          "isCitizenRefund": "Y",
          "citizenName": selectedComplaint.bkApplicantName,
          "correspondingAddress": selectedComplaint.bkHouseNo,
          "bankName": selectedComplaint.bkBankName,
          "bankAccount": selectedComplaint.bkBankAccountNumber,
          "ifscCode": selectedComplaint.bkIfscCode,
          "ledgers": calculateAppliedRefundHeads

        }

        this.setState({ FinApirequestBody: Receipt })


      }

    }


    fetchApplications(
      {
        'uuid': userInfo.uuid, "applicationNumber": applicationNumber,
        "applicationStatus": "",
        "mobileNumber": "", "bookingType": "", "tenantId": userInfo.tenantId
      }
    );
    let requestbody = { "applicationNumber": applicationNumber, "action": trasformData.bkAction }

    let AssigneeFromAPI = await httpRequest(
      "bookings/api/employee/assignee/_search",
      "_search", [],
      requestbody
    );
    //refund API

    this.setState({
      assignToMe: AssigneeFromAPI
    })
  }



  commentsValue = {};

  handleCommentsChange = (e, value) => {
    this.commentsValue.textVal = e.target.value;
    this.setState({
      commentValue: e.target.value
    });
    this.concatComments(this.commentsValue);
  };

  handleChangeAssigneeData = (e, value) => {
    this.setState({
      assignee: e.target.value
    });

  }
  handleClose = () => {
    this.setState({
      setOpen: false
    })
  };

  handleOpen = () => {
    this.setState({
      setOpen: true
    })
  };



  handleOptionsChange = (event, value) => {
    this.setState({ valueSelected: value });
    this.commentsValue.radioValue = value;
    this.concatComments(this.commentsValue);
  };
  concatComments = val => {
    let com1 = "";
    let com2 = "";
    if (val.radioValue) {
      com1 = val.radioValue + ";";
    }
    if (val.textVal) {
      com2 = val.textVal;
    }
    let concatvalue = com1 + com2;
    this.props.handleFieldChange("approveCancelRequest", "comments", concatvalue);
  };

  onSubmit = async (e) => {

    const { valueSelected, commentValue, FinApirequestBody } = this.state;
    const { toggleSnackbarAndSetText } = this.props;
    console.log(FinApirequestBody, "Hello Nero")
    // let ResOfRefund = await httpRequest(
    //   "https://chandigarh-uat.chandigarhsmartcity.in/services/EGF/refund/_processRefund",
    //   "_search", [],
    //   FinApirequestBody
    // );
    // console.log(ResOfRefund, "Nero API Success");
    return false;
  };

  //refunded Amount
  // RefundAmountRefundAPI = async (applicationNumber, tenantId, bookingDate) => {
  //   const {payloadone, payload, payloadTwo} = this.props;
  //   console.log("propsforcalculateCancelledBookingRefundAmount--",this.props)

  //       if (applicationNumber && tenantId) {

  //           console.log(payload, "Payment Details");
  //           if (payload) {

  //               let billAccountDetails = payload.Payments[0].paymentDetails[0].bill.billDetails[0].billAccountDetails;
  //               let bookingAmount = 0;
  //               for (let i = 0; i < billAccountDetails.length; i++) {
  //                   if (billAccountDetails[i].taxHeadCode == "REFUNDABLE_SECURITY") {
  //                       bookingAmount += billAccountDetails[i].amount;
  //                   }
  //               }

  //               return bookingAmount;

  //           }
  //       }


  //   }



  // suggested by neeraj sir
  calculateCancelledBookingRefundAmount = async (applicationNumber, tenantId, bookingDate) => {
    const { payloadone, payload, payloadTwo, ConRefAmt } = this.props;


    var CheckDate = new Date(bookingDate);

    var todayDate = new Date();



    if (applicationNumber && tenantId) {


      if (payload) {

        if (todayDate > CheckDate) {

          let billAccountDetails = payload.Payments[0].paymentDetails[0].bill.billDetails[0].billAccountDetails;
          let bookingAmount = 0;
          for (let i = 0; i < billAccountDetails.length; i++) {
            if (billAccountDetails[i].taxHeadCode == "SECURITY_MANUAL_OPEN_SPACE_BOOKING_BRANCH") {
              bookingAmount += billAccountDetails[i].amount;
            }
          }

          return bookingAmount;

        }
        if (todayDate < CheckDate) {

          let billAccountDetails = payload.Payments[0].paymentDetails[0].bill.billDetails[0].billAccountDetails;
          let bookingAmount = 0;
          for (let i = 0; i < billAccountDetails.length; i++) {
            if (billAccountDetails[i].taxHeadCode == "SECURITY_MANUAL_OPEN_SPACE_BOOKING_BRANCH") {
              bookingAmount += billAccountDetails[i].amount;
            }
            if (billAccountDetails[i].taxHeadCode == "PARKING_LOTS_MANUAL_OPEN_SPACE_BOOKING_BRANCH") {
              bookingAmount += billAccountDetails[i].amount;
            }
          }



          let mdmsBody = {
            MdmsCriteria: {
              tenantId: tenantId,
              moduleDetails: [

                {
                  moduleName: "Booking",
                  masterDetails: [
                    {
                      name: "bookingCancellationRefundCalc",
                    }
                  ],
                },

              ],
            },
          };

          let refundPercentage = '';

          let payloadRes = null;
          payloadRes = await httpRequest(
            "egov-mdms-service/v1/_search",
            "_search", [],
            mdmsBody
          );

          refundPercentage = payloadRes.MdmsRes.Booking.bookingCancellationRefundCalc[0];


          var date1 = new Date(bookingDate);

          var date2 = new Date();

          var Difference_In_Time = date1.getTime() - date2.getTime();

          // To calculate the no. of days between two dates
          var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

          let refundAmount = 0
          if (Difference_In_Days > 29) {
            let refundPercent = refundPercentage.MORETHAN30DAYS.refundpercentage;


            refundAmount = (parseFloat(bookingAmount) * refundPercent) / 100
          } else if (Difference_In_Days > 15 && Difference_In_Days < 30) {

            let refundPercent = refundPercentage.LETTHAN30MORETHAN15DAYS.refundpercentage;
            refundAmount = (parseFloat(bookingAmount) * refundPercent) / 100

          }


          return refundAmount;
        }


      }
    }


  }


  render() {
    let { match, userInfo, dataforRefund } = this.props;


    const { handleCommentsChange, handleOptionsChange, onSubmit, handleChangeAssigneeData, handleOpen, handleClose } = this;
    const { valueSelected, commentValue, assignee, assignToMe } = this.state;
    const { trasformData, businessServiceData, applicationNumber, Cancelstatus } = this.props;
    let CheckCancelStatus;
    if (Cancelstatus == "CANCEL") {
      CheckCancelStatus = Cancelstatus
    }
    else {
      CheckCancelStatus = "null"
    }

    const foundFirstLavels = userInfo && userInfo.roles.some(el => el.code === 'BK_CLERK' || el.code === 'BK_DEO');
    const foundSecondLavel = userInfo && userInfo.roles.some(el => el.code === 'BK_SENIOR_ASSISTANT');
    const foundthirdLavel = userInfo && userInfo.roles.some(el => el.code === 'BK_AUDIT_DEPARTMENT');
    const foundFourthLavel = userInfo && userInfo.roles.some(el => el.code === 'BK_CHIEF_ACCOUNT_OFFICER');
    const foundFifthLavel = userInfo && userInfo.roles.some(el => el.code === 'BK_PAYMENT_PROCESSING_AUTHORITY');
    const foundSixthLavel = userInfo && userInfo.roles.some(el => el.code === 'BK_E-SAMPARK-CENTER');
    const foundSevenLavel = userInfo && userInfo.roles.some(el => el.code === 'BK_SUPERVISOR');
    const foundEightLavel = userInfo && userInfo.roles.some(el => el.code === 'BK_OSD');
    return (

      <CancelRequestApprovedHOC
        // options={this.options}
        handleOpen={handleOpen}
        handleClose={handleClose}
        handleChangeAssignee={handleChangeAssigneeData}
        ontextAreaChange={handleCommentsChange}
        handleOptionChange={handleOptionsChange}
        // optionSelected={valueSelected}
        commentValue={commentValue}
        foundFirstLavels={foundFirstLavels}
        foundSecondLavel={foundSecondLavel}
        foundthirdLavel={foundthirdLavel}
        foundFourthLavel={foundFourthLavel}
        foundFifthLavel={foundFifthLavel}
        foundSixthLavel={foundSixthLavel}
        foundSevenLavel={foundSevenLavel}
        foundEightLavel={foundEightLavel}
        assignee={assignee}
        assignToMe={assignToMe}
        applicationNumber={applicationNumber}
        createdBy={userInfo.name}
        tenantId={userInfo.tenantId}
        onSubmit={onSubmit}
        userInfo={userInfo}
        // bookingtype={trasformData.bkBookingType}
        CancelStatus={CheckCancelStatus ? CheckCancelStatus : ""}
        bookingservice={businessServiceData ? businessServiceData : ''}
        setOpen={this.state.setOpen}
      />

    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { bookings = {} } = state || {};
  const { applicationData, dataforRefund } = bookings;
  const { fetchPaymentAfterPayment } = bookings;
  // let myMobNum = state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.MNumToCreateCitizen:"wrongNumber";
  // console.log("myMobNum--",myMobNum)

  let ConRefAmt = state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.ConditionForAmount : "notFound";

  let payloadone = fetchPaymentAfterPayment;


  let paymentDetailsForReceipt = fetchPaymentAfterPayment;




  // const serviceRequestId = ownProps.match.params.applicationId;
  let trasformData = applicationData ? applicationData.bookingsModelList[0] : '';



  // console.log("dataforRefund--",dataforRefund)

  let businessServiceData = applicationData.businessService;



  let Cancelstatus = trasformData.bkStatus;


  return { trasformData, businessServiceData, dataforRefund, payloadone, ConRefAmt, Cancelstatus, paymentDetailsForReceipt };
}


const mapDispatchToProps = dispatch => {
  return {
    fetchApplications: criteria => dispatch(fetchApplications(criteria)),//fetchResponseForRefdunf
    fetchResponseForRefdunf: criteria => dispatch(fetchResponseForRefdunf(criteria)),
    // fetchDataAfterPayment: criteria => dispatch(fetchDataAfterPayment(criteria)),
    handleFieldChange: (formKey, fieldKey, value) =>
      dispatch(handleFieldChange(formKey, fieldKey, value)),
    toggleSnackbarAndSetText: (open, message, error) =>
      dispatch(toggleSnackbarAndSetText(open, message, error)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CancelRequestApproved);








