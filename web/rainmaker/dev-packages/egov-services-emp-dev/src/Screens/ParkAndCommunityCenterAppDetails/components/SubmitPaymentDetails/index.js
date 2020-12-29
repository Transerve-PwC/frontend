import React, { Component } from 'react';
import { Tabs, Card, TextField, Icon, Button } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import { createPACCApplication, updatePACCApplication,fetchPayment,fetchApplications } from "egov-ui-kit/redux/bookings/actions";
import { connect } from "react-redux";
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import EditIcon from '@material-ui/icons/Edit';
import "./index.css";
import Footer from "../../../../modules/footer"
import PaymentReceiptDetail from "../PaymentReceiptDetail"
import PaymentOptionDetails from "../PaymentOptionDetails"
import PaymentDetails from "../PaymentDetails"
import SubmitPaymentDetails from "../SubmitPaymentDetails"
import { getFileUrlFromAPI } from '../../../../modules/commonFunction'
import jp from "jsonpath";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { httpRequest } from "egov-ui-kit/utils/api"
import PaymentSuccessForEmployee from "../../../PaymentSuccessForEmployee"



class SummaryDetails extends Component {

state = {
sucessPage : false
}

   
componentDidMount = async () => {
      
 let { TotalAmount,billId, userInfo,ApplicantName,ApplicantMobNum,paymentMode,PaidBy,justTry} = this.props;

 console.log("this.props---",this.props)

 let PaymentReqBody = {
    "Payment" : {         
        "paymentDetails": [
            {
              "businessService": "PACC",
              "billId": billId,
              "totalDue": TotalAmount,
              "totalAmountPaid": TotalAmount
            }
          ],
          "tenantId": userInfo.tenantId,
          "totalDue": TotalAmount,
          "paymentMode": paymentMode,
          "paidBy": PaidBy,
          "mobileNumber": ApplicantMobNum,
          "payerName": ApplicantName,
          "totalAmountPaid": TotalAmount
        }
    }

 console.log("PaymentReqBody--",PaymentReqBody)

let EmpPayment = await httpRequest(
            "collection-services/payments/_create?",
            "_search",[],
            PaymentReqBody
            );

console.log("EmpPayment--",EmpPayment)

let ReceiptNum = EmpPayment && EmpPayment ? EmpPayment.Payments[0].paymentDetails[0].receiptNumber : "notFound"
console.log("ReceiptNum--",ReceiptNum)

prepareFinalObject("CollectionReceiptNum",ReceiptNum),

justTry

 }

  render() {

  return(
      <div>
        {console.log("dfgh")}
        {/* {this.state.sucessPage == true ? 
        <PaymentSuccessForEmployee/>: ''} */}
      </div>
  )
    }
}

const mapStateToProps = state => {   
const { bookings, common, auth, form } = state;
    const { createPACCApplicationData} = bookings;
    const { userInfo } = state.auth;
    const { facilationChargesSuccess, arrayName } = bookings;
    const { applicationData } = bookings;
    let selectedComplaint = applicationData ? applicationData.bookingsModelList[0] : ''
    
    let ApplicantName = selectedComplaint ? selectedComplaint.bkApplicantName : 'notFound'
    console.log("ApplicantName--",ApplicantName)
    let ApplicantMobNum = selectedComplaint ? selectedComplaint.bkMobileNumber : 'notFound'
    console.log("ApplicantMobNum--",ApplicantMobNum)
    const { paymentData } = bookings;
    let paymentDataOne = paymentData ? paymentData : "wrong";
    console.log("paymentDataOne--",paymentDataOne)
    let checkBillLength =  paymentDataOne != "wrong" ? paymentDataOne.Bill.length > 0 : "";
    let totalAmountSuPage = checkBillLength ? paymentDataOne.Bill[0].totalAmount: "notfound";
    console.log("totalAmountSuPage-",totalAmountSuPage)
    let paymentDetails;
    paymentDetails = paymentData ? paymentData.Bill[0] : '';
    let TotalAmount  = paymentDetails ? paymentDetails.totalAmount : "NotFoundAnyAmount";
    console.log("TotalAmount--",TotalAmount)
    let billId = paymentDetails ? paymentData.Bill[0].billDetails[0].billId : "NotFoundAnyBillId";
    console.log("billId--",billId)
    let billAccountDetailsArray =  checkBillLength ? paymentDataOne.Bill[0].billDetails[0].billAccountDetails : "NOt found Any Array"
    console.log("billAccountDetailsArray--",billAccountDetailsArray)
    let one = 0;
    let two = 0;
    let three = 0;
    let four = 0;
    let five = 0;
    let six = 0;
for(let i = 0; i < billAccountDetailsArray.length ; i++ ){

    if(billAccountDetailsArray[i].taxHeadCode == "PACC"){
        one = billAccountDetailsArray[i].amount
    }
    else if(billAccountDetailsArray[i].taxHeadCode == "LUXURY_TAX"){
        two = billAccountDetailsArray[i].amount
    }
    else if(billAccountDetailsArray[i].taxHeadCode == "REFUNDABLE_SECURITY"){
        three = billAccountDetailsArray[i].amount
    }
    else if(billAccountDetailsArray[i].taxHeadCode == "PACC_TAX"){
        four = billAccountDetailsArray[i].amount
    }
    else if(billAccountDetailsArray[i].taxHeadCode == "PACC_ROUND_OFF"){
        five = billAccountDetailsArray[i].amount
    }
    else if(billAccountDetailsArray[i].taxHeadCode == "FACILITATION_CHARGE"){
        six = billAccountDetailsArray[i].amount
    }
}

console.log("one--",one)
console.log("two--",two)
console.log("three--",three)
console.log("four--",four)
console.log("five--",five)
console.log("six--",six)

    

    let myLocation = state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.availabilityCheckData:"";  
    let myLocationtwo = myLocation?myLocation.bkLocation:"";  


    let fCharges;
    if (arrayName && arrayName.length > 0) {
      arrayName.forEach((item) => {
        item.forEach((value) => {
          if (value.code == "FACILITATION_CHARGE") { 
            fCharges = value
          }
        })
      })
    }
    let documentMap = state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.documentMap : "";




let paymentMode = 
state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.paymentMode:"";  

console.log("paymentMode--",paymentMode)

return {paymentMode,createPACCApplicationData,userInfo,paymentDataOne,
    documentMap,facilationChargesSuccess,billId,ApplicantName,ApplicantMobNum,
    fCharges,myLocationtwo,totalAmountSuPage,one,two,three,four,five,six,paymentDetails,TotalAmount}

}

const mapDispatchToProps = dispatch => {
    return {
        prepareFinalObject: (jsonPath, value) => dispatch(prepareFinalObject(jsonPath, value)),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SummaryDetails);
