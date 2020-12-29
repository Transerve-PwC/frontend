import React, { Component } from "react";
import { connect } from "react-redux";
import formHOC from "egov-ui-kit/hocs/form";
import { Screen } from "modules/common";
import PaccCancelledApproveForm from "./components/PaccCancelledApproveForm";
import { fetchApplications,fetchResponseForRefdunf,fetchDataAfterPayment } from "egov-ui-kit/redux/bookings/actions";
import Label from "egov-ui-kit/utils/translationNode";
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";
import { handleFieldChange } from "egov-ui-kit/redux/form/actions";
import "./index.css";
import { httpRequest } from "egov-ui-kit/utils/api";
import { loginRequest,wrapRequestBody, } from "egov-ui-kit/utils/api";
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
    assignee:"",
    assignToMe:[],
    setOpen: false
  };

  async componentDidMount() {
    let { fetchApplications, match, payload, payloadTwo, userInfo,matchparams,applicationNumber,trasformData,fetchResponseForRefdunf,selectedComplaint } = this.props;
    console.log("propsincompcancelpage--",payload)
    console.log("applicationNumber--",applicationNumber)
    console.log("match--",match)
    console.log("matchparams--",matchparams)
    console.log("selectedComplaint--",selectedComplaint)
    let dateForCancel = selectedComplaint.bkFromDate;
    console.log("dateForCancel--",dateForCancel)
    if(selectedComplaint.bkApplicationStatus == "PENDING_FOR_DISBURSEMENT"){


      //condition for employee cancelation
if(selectedComplaint.bkAction == "OFFLINE_CANCEL"){

  let dataOne = {
    "mobileNumber":"9876543210"
  }

        let ResOfUSearch = await httpRequest(
          "user/_search",
          "_search",[],
          dataOne
        );
      
        console.log("ResOfUSearch--",ResOfUSearch)
      
       let newUserName =  ResOfUSearch.user.length >0 ? ResOfUSearch.user[0].userName : "NumberNotFound"
       console.log("newUserName--",newUserName)
       let newToken = await loginRequest(newUserName,"123456","","password","ch","CITIZEN");
       console.log("newToken-1",newToken)
       console.log("newToken--",newToken.access_token)
       let authToken = newToken.access_token;
// let log = console.log;
// log("hgjb")
      // loginRequest(newUserName,"123456","","password","ch","CITIZEN").then(res=>{
      //   console.log("res--",res)
      //   console.log("res.access_token--",res.access_token)
      //   authToken = res.access_token;
      // })
      // console.log("newToken--",newToken)
      // console.log("authToken--",authToken)

      let RequestData = [
        { key: "consumerCode", value: applicationNumber },
        { key: "tenantId", value: userInfo.tenantId }
        ];

    let customRequestInfo = {
    apiId: "Rainmaker",
    ver: ".01",
    ts: "",
    action: "_search",
    did: "1",
    key: "",
    msgId: `20170310130900|${getLocale()}`,
    // requesterId: "",
    authToken: authToken,
      }
      console.log("customRequestInfo--",customRequestInfo)
      let payloadfund = await httpRequest(
        "pg-service/transaction/v1/_search",
        "_search",
        RequestData,
        customRequestInfo
        );
      
        console.log("RequestData--",RequestData)
        console.log("payloadfund--",payloadfund)
        console.log("payloadfund.Transaction--",payloadfund.Transaction)
  
        const gateway = payloadfund.Transaction.length > 0 ? payloadfund.Transaction[0].gateway : "somethingWentWrong"
        console.log("gateway--",gateway)
        const txnStatus = payloadfund.Transaction.length > 0 ? payloadfund.Transaction[0].txnStatus : "somethingWentWrong"
        console.log("txnStatus--",txnStatus)
        const txnStatusMsg = payloadfund.Transaction.length > 0 ? payloadfund.Transaction[0].txnStatusMsg : "somethingWentWrong"
       console.log("txnStatusMsg--",txnStatusMsg)
        const txnAmount = payloadfund.Transaction.length > 0 ? payloadfund.Transaction[0].txnAmount : "somethingWentWrong"
       console.log("txnAmount--",txnAmount)
        const txnId = payloadfund.Transaction.length > 0 ? payloadfund.Transaction[0].txnId : "somethingWentWrong"
       console.log("txnId--",txnId)
        const gatewayTxnId = payloadfund.Transaction.length > 0 ? payloadfund.Transaction[0].gatewayTxnId : "somethingWentWrong"
       console.log("gatewayTxnId--",gatewayTxnId)



      //   let data={
      //     "RefundTransaction" : {
      //     "additionalDetails": {},
          
      //     "gateway": gateway,
      //     "gatewayRefundStatusCode": txnStatus,
      //     "gatewayRefundStatusMsg": txnStatusMsg,
      //     "gatewayTxnId": gatewayTxnId,
      //     "refundAmount": "90",
      //     "tenantId": userInfo.tenantId,
      //     "txnAmount": txnAmount,
      //     "txnId": txnId
      
      //   }
      // }

      let data={
        "RefundTransaction" : {
        "additionalDetails": {},
        
        "gateway": "PAYTM",
        "gatewayRefundStatusCode": "SUCCESS",
        "gatewayRefundStatusMsg": "Transaction successful",
        "gatewayTxnId": "20201102111212800110168673802038850",
        "refundAmount": "90",
        "tenantId": userInfo.tenantId,
        "txnAmount": "8071.00",
        "txnId": "P20110200088230"
    
      }
    }
      
        let ResOfRefund = await httpRequest(
          "pg-service/transaction/v1/_refund",
          "_search",[],
          data
        );
      
        console.log("ResOfRefund--",ResOfRefund)
      
      
      
      }
      else{
        let RequestData = [
          { key: "consumerCode", value: applicationNumber },
          { key: "tenantId", value: userInfo.tenantId }
          ];
        let payloadfund = await httpRequest(
          "pg-service/transaction/v1/_search",
          "_search",
          RequestData
          );
        
          console.log("RequestData--",RequestData)
          console.log("payloadfund--",payloadfund)
          console.log("payloadfund.Transaction--",payloadfund.Transaction)
    
          const gateway = payloadfund.Transaction.length > 0 ? payloadfund.Transaction[0].gateway : "somethingWentWrong"
          console.log("gateway--",gateway)
          const txnStatus = payloadfund.Transaction.length > 0 ? payloadfund.Transaction[0].txnStatus : "somethingWentWrong"
         console.log("txnStatus--",txnStatus)
          const txnStatusMsg = payloadfund.Transaction.length > 0 ? payloadfund.Transaction[0].txnStatusMsg : "somethingWentWrong"
        console.log("txnStatusMsg--",txnStatusMsg)
          const txnAmount = payloadfund.Transaction.length > 0 ? payloadfund.Transaction[0].txnAmount : "somethingWentWrong"
         console.log("txnAmount--",txnAmount)
          const txnId = payloadfund.Transaction.length > 0 ? payloadfund.Transaction[0].txnId : "somethingWentWrong"
       console.log("txnId--",txnId)
          const gatewayTxnId = payloadfund.Transaction.length > 0 ? payloadfund.Transaction[0].gatewayTxnId : "somethingWentWrong"
    console.log("gatewayTxnId--",gatewayTxnId)
  
    let totalRes = await this.calculateCancelledBookingRefundAmount(applicationNumber, userInfo.tenantId, dateForCancel);
    console.log("totalRes--",totalRes)

    //RefundAmountRefundAPI
    /* 
    "gatewayTxnId": gatewayTxnId,
      "refundAmount": totalRes,
      "tenantId": userInfo.tenantId,
    */

    // let totalRefAmount = await this.RefundAmountRefundAPI(applicationNumber, userInfo.tenantId, dateForCancel);
    // console.log("totalRefAmount--",totalRefAmount)
  
    let data={
      "RefundTransaction" : {
      "additionalDetails": {},
      
      "gateway": gateway,
      "gatewayRefundStatusCode": txnStatus,
      "gatewayRefundStatusMsg": txnStatusMsg,
      "gatewayTxnId": gatewayTxnId,
      "refundAmount": totalRes,
      "tenantId": userInfo.tenantId,
      "txnAmount": txnAmount,
      "txnId": txnId
  
    }
  }
  
    let ResOfRefund = await httpRequest(
      "pg-service/transaction/v1/_refund",
      "_search",[],
      data
    );
  
    console.log("ResOfRefund--",ResOfRefund)


      }
           
  }
   
      
      fetchApplications(
        { 'uuid': userInfo.uuid, "applicationNumber": applicationNumber,
        "applicationStatus":"",
        "mobileNumber":"","bookingType":"","tenantId":userInfo.tenantId }
      );
      let requestbody={"applicationNumber": applicationNumber, "action":trasformData.bkAction}
      
      let AssigneeFromAPI = await httpRequest(
        "bookings/api/employee/assignee/_search",
        "_search",[],
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

//   CallingAPI =(num,id) => {

// const myLast =  await httpRequest(
                
//   `pg-service/transaction/v1/_search=${num}${id}`,
//   "_search",
//   [],
  
// );
//   }

  handleChangeAssigneeData= (e, value) => {
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

  onSubmit = e => {
    const { valueSelected, commentValue } = this.state;
    const { toggleSnackbarAndSetText } = this.props;
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
const {payloadone, payload, payloadTwo, ConRefAmt} = this.props;
console.log("propsforcalculateCancelledBookingRefundAmount--",this.props)

    if (applicationNumber && tenantId) {
      
        console.log(payload, "Payment Details");
        if (payload) {

if(ConRefAmt == true){

  let billAccountDetails = payload.Payments[0].paymentDetails[0].bill.billDetails[0].billAccountDetails;
  let bookingAmount = 0;
  for (let i = 0; i < billAccountDetails.length; i++) {
      if (billAccountDetails[i].taxHeadCode == "REFUNDABLE_SECURITY") {
          bookingAmount += billAccountDetails[i].amount;
      }
  }

  return bookingAmount;

}


else {
            let billAccountDetails = payload.Payments[0].paymentDetails[0].bill.billDetails[0].billAccountDetails;
            let bookingAmount = 0;
            for (let i = 0; i < billAccountDetails.length; i++) {
                if (billAccountDetails[i].taxHeadCode == "REFUNDABLE_SECURITY") {
                    bookingAmount += billAccountDetails[i].amount;
                }
                if (billAccountDetails[i].taxHeadCode == "PACC") {
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
                "_search",[],
                mdmsBody
            );


/*
payloadRes = await httpRequest(
                "/egov-mdms-service/v1/_search",
                "_search",
                mdmsBody
            );
*/

            // let dataforSectorAndCategory = await httpRequest( 	
            //   "bookings/api/employee/_search",
            //   "_search",[],
            //   complaintCountRequest
            //   );
            console.log(payloadRes, "RefundPercentage");
            refundPercentage = payloadRes.MdmsRes.Booking.bookingCancellationRefundCalc[0];
console.log("refundPercentage--2--",refundPercentage)

          var date1 = new Date(bookingDate);
          console.log("date1--",date1) 
            var date2 = new Date();
console.log("date2--",date2)
            var Difference_In_Time = date1.getTime() - date2.getTime();
console.log("Difference_In_Time--",Difference_In_Time)
            // To calculate the no. of days between two dates
            var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
console.log("Difference_In_Days--",Difference_In_Days)
            let refundAmount = 0
            if (Difference_In_Days > 29) {
                let refundPercent = refundPercentage.MORETHAN30DAYS.refundpercentage;
                console.log("refundPercent--1",refundPercent)

                refundAmount = (parseFloat(bookingAmount) * refundPercent) / 100
            } else if (Difference_In_Days > 15 && Difference_In_Days < 30) {

                let refundPercent = refundPercentage.LETTHAN30MORETHAN15DAYS.refundpercentage;
                refundAmount = (parseFloat(bookingAmount) * refundPercent) / 100
                console.log("refundPercent--2",refundPercent)
            }


            return refundAmount;
          }


        }
    }


}


  render() {
    let { match, userInfo,dataforRefund } = this.props;
    console.log("MainData--dataforRefund--",dataforRefund)

    const { handleCommentsChange, handleOptionsChange, onSubmit,handleChangeAssigneeData ,handleOpen,handleClose} = this;
    const { valueSelected, commentValue ,assignee,assignToMe} = this.state;
    const { trasformData, businessServiceData,applicationNumber,Cancelstatus } = this.props;
    let CheckCancelStatus;
    if(CancelStatus == "CANCEL"){
      CheckCancelStatus = Cancelstatus
    }
    else{
      CheckCancelStatus = "null"
   }
   console.log("CheckCancelStatus--",CheckCancelStatus)
    const foundFirstLavels = userInfo && userInfo.roles.some(el => el.code ===  'BK_CLERK'||el.code === 'BK_DEO');
    const foundSecondLavel = userInfo && userInfo.roles.some(el => el.code === 'BK_SENIOR_ASSISTANT');
    const foundthirdLavel = userInfo&&userInfo.roles.some(el => el.code === 'BK_AUDIT_DEPARTMENT');
    const foundFourthLavel = userInfo&&userInfo.roles.some(el => el.code === 'BK_CHIEF_ACCOUNT_OFFICER');
    const foundFifthLavel = userInfo&&userInfo.roles.some(el => el.code === 'BK_PAYMENT_PROCESSING_AUTHORITY');
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
         CancelStatus={CheckCancelStatus?CheckCancelStatus:""}
          bookingservice={businessServiceData?businessServiceData:''}
          setOpen={this.state.setOpen}
        />
      
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { bookings = {} } = state || {};
  const { applicationData,dataforRefund } = bookings;
  const { fetchPaymentAfterPayment } = bookings;
  let myMobNum = state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.MNumToCreateCitizen:"wrongNumber";  
  console.log("myMobNum--",myMobNum)
  
  let ConRefAmt = state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.ConditionForAmount:"notFound";  
  console.log("ConRefAmt--",ConRefAmt)
  let payloadone = fetchPaymentAfterPayment;
  console.log("payload--in--mapstatetoprops--",payloadone)

  // const serviceRequestId = ownProps.match.params.applicationId;
  let trasformData = applicationData?applicationData.bookingsModelList[0]:'';

  console.log("trasformData--",trasformData)
  console.log("applicationData--",applicationData)

  // console.log("dataforRefund--",dataforRefund)

  let businessServiceData = applicationData.businessService;

  console.log("businessServiceData--",businessServiceData)

  let Cancelstatus = trasformData.bkStatus;
  console.log("Cancelstatus--",Cancelstatus)

  return { trasformData, businessServiceData,dataforRefund,payloadone,ConRefAmt,Cancelstatus};
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








