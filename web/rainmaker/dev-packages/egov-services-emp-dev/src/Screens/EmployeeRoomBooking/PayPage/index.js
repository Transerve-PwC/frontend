import React, { Component } from 'react';
import { Tabs, Card, TextField, Icon, Button } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import { createPACCApplication, updatePACCApplication,fetchPayment,fetchApplications,fetchDataAfterPayment } from "egov-ui-kit/redux/bookings/actions";
import { connect } from "react-redux";
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import EditIcon from '@material-ui/icons/Edit';
import "./index.css"; 
import Footer from "../../../modules/footer"
import PaymentReceiptDetail from "../PaymentReceiptDetail"
import PaymentOptionDetails from "../PaymentOptionDetails"
import PaymentDetails from "../PaymentDetails"  
// import DateVenueChangePayDetail from "../DateVenueChangePayDetail"
// import SubmitPaymentDetails from "../SubmitPaymentDetails"
import { getFileUrlFromAPI } from '../../../modules/commonFunction'
import jp from "jsonpath";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { httpRequest } from "egov-ui-kit/utils/api" //PaymentDetailsTwo
// import PaymentDetailsTwo from "../PaymentDetailsTwo"  
  
class SummaryDetails extends Component {

    state = {
        PayerName : '',
        mobileNo : '',
        PaidBy : '',
        PaymentReceiptNumber : '',
        transactionDate : '',
        ChequeNo: '',
        ChequeDate: '',
        IFSC:'',
        BankName: '',
        BankBranch: '',
        DDno: '',
        ddDate: '',
        ddIFSC: '',
        ddBank: '',
        ddBranch: '',
        last4Digits: '',
        TrxNo: '',
        repeatTrxNo: '',
        SubmitDetails: false,
        justTry : ''
    }

    componentDidMount = async () => {

        let fetchUrl = window.location.pathname;
        console.log(fetchUrl)
         
        let fetchApplicationNumber = fetchUrl.substring(fetchUrl.lastIndexOf('/') + 1)
        console.log("fetchApplicationNumber--",fetchApplicationNumber)
       
        let { createPACCApplication, userInfo, documentMap,fetchPayment,fetchDataAfterPayment,prepareFinalObject,fetchApplications } = this.props;
        let { firstName, venueType, bokingType, bookingData, email, mobileNo, surcharge, fromDate, toDate,myLocationtwo,
            utGST, cGST, GSTnumber, dimension, location, facilitationCharges, cleaningCharges, rent, houseNo, type, purpose, locality, residenials, facilationChargesSuccess,discountType } = this.props;


            // await fetchApplications(
            //     {
            //         "applicationNumber": fetchApplicationNumber, 'uuid': userInfo.uuid,
            //         "applicationStatus": "",
            //         "mobileNumber": "", "bookingType": "",
            //         "tenantId":userInfo.tenantId
            //     }
            // );

 fetchPayment(
    [{ key: "consumerCode", value: fetchApplicationNumber }, { key: "businessService", value: "BOOKING_BRANCH_SERVICES.COMMUNITY_CENTRES_JHANJ_GHAR" }, { key: "tenantId", value: userInfo.tenantId }
    ])

 fetchDataAfterPayment(
        [{ key: "consumerCodes", value: fetchApplicationNumber }, { key: "tenantId", value: userInfo.tenantId }
        ])

   
    }

    handleChange = input => e => {
        const {prepareFinalObject} = this.props
        this.setState({ [input]: e.target.value });
        prepareFinalObject(input, e.target.value)

    }
  
    transactionDateChange = e => {
        const {prepareFinalObject} = this.props
        const trDate = e.target.value;
        this.setState({
            transactionDate: trDate
        })
        prepareFinalObject("transactionDate", trDate)
    }

    changeChequeDate = e => {
        const {prepareFinalObject} = this.props
        const cqDate = e.target.value
        this.setState({
           ChequeDate: cqDate
        })
        prepareFinalObject("ChequeDate", cqDate)
 }

 changeDdDate = e => {
    const {prepareFinalObject} = this.props
    const cDdDate = e.target.value
    this.setState({
        ddDate: cDdDate
    })
    prepareFinalObject("ChangeDdDate", cDdDate)
}

    submit = async (e) => {
    
        let ApplicantName = this.props.RoomBookingData.bookingsModelList[0].bkApplicantName
        let ApplicantMobNum = this.props.RoomBookingData.bookingsModelList[0].bkMobileNumber
        console.log("propsInpayPage--",this.props)
        
    // alert("hello generate receipt")
    const { TotalAmount,billId, userInfo,prepareFinalObject,paymentMode,ppaidBy,pChequeNo,
    ChnChqDate,newDDno,NewTrxNo,NewddDate,pddIFSC,pIFSC} = this.props
    console.log("this.props---",this.props)
   
    let ppMode = paymentMode && paymentMode ? paymentMode: ' '
    let PaymentReqBody
    if(ppMode == "Cash"){
        PaymentReqBody = {
            "Payment" : {         
                "paymentDetails": [
                    {
                      "businessService": "BKROOM",
                      "billId": billId,
                      "totalDue": TotalAmount,
                      "totalAmountPaid": TotalAmount
                    }
                  ],
                  "tenantId": userInfo.tenantId,
                  "totalDue": TotalAmount,
                  "paymentMode": ppMode,
                  "paidBy": ppaidBy,
                  "mobileNumber": ApplicantMobNum,
                  "payerName": ApplicantName,
                  "totalAmountPaid": TotalAmount
                }
            }
    }
    if(ppMode == "Cheque"){
        PaymentReqBody = {
            "Payment" : {         
                "paymentDetails": [
                    {
                      "businessService": "BKROOM",
                      "billId": billId,
                      "totalDue": TotalAmount,
                      "totalAmountPaid": TotalAmount
                    }
                  ],
                  "tenantId": userInfo.tenantId,
                  "totalDue": TotalAmount,
                  "paymentMode": ppMode,
                  "paidBy": ppaidBy,
                  "mobileNumber": ApplicantMobNum,
                  "payerName": ApplicantName,
                  "transactionNumber": pChequeNo,
                  "instrumentNumber": pChequeNo,
                  "instrumentDate": ChnChqDate,
                  "totalAmountPaid": TotalAmount
                }
            }
    }  
    if(ppMode == "DD"){
        PaymentReqBody = {
            "Payment" : {         
                "paymentDetails": [
                    {
                      "businessService": "BKROOM",
                      "billId": billId,
                      "totalDue": TotalAmount,
                      "totalAmountPaid": TotalAmount
                    }
                  ],
                  "tenantId": userInfo.tenantId,
                  "totalDue": TotalAmount,
                  "paymentMode": ppMode,
                  "paidBy": ppaidBy,
                  "mobileNumber": ApplicantMobNum,
                  "payerName": ApplicantName,
                  "transactionNumber": newDDno,
                  "instrumentNumber": newDDno,
                  "instrumentDate": NewddDate,
                  "totalAmountPaid": TotalAmount
                }
            }
    }  
    if(ppMode == "Card"){
        PaymentReqBody = {
            "Payment" : {         
                "paymentDetails": [
                    {
                      "businessService": "BKROOM",
                      "billId": billId,
                      "totalDue": TotalAmount,
                      "totalAmountPaid": TotalAmount
                    }
                  ],
                  "tenantId": userInfo.tenantId,
                  "totalDue": TotalAmount,
                  "paymentMode": ppMode,
                  "paidBy": ppaidBy,
                  "mobileNumber": ApplicantMobNum,
                  "payerName": ApplicantName,
                  "transactionNumber": NewTrxNo,
                  "instrumentNumber": NewTrxNo,
                  "totalAmountPaid": TotalAmount
                }
            }
    }  

        
        
console.log("PaymentReqBody--",PaymentReqBody)

let EmpPayment = await httpRequest(
            "collection-services/payments/_create?",
            "_search",[],
            PaymentReqBody
            );

console.log("EmpPayment--",EmpPayment)

prepareFinalObject("ResponseOfCashPayment",EmpPayment)

let ReceiptNum = EmpPayment && EmpPayment ? EmpPayment.Payments[0].paymentDetails[0].receiptNumber : "notFound"
console.log("ReceiptNum--",ReceiptNum)

prepareFinalObject("CollectionReceiptNum",ReceiptNum)

this.props.history.push(`/egov-services/Room-Payment-Success`);
    }

    firstStep = e => {
        e.preventDefault();
        this.props.firstStep();
    }
    back = e => {
        e.preventDefault();
        this.props.prevStep();
    }
    callApiForDocumentData = async (e) => {
        const { documentMap, userInfo } = this.props;
        var documentsPreview = [];
        if (documentMap && Object.keys(documentMap).length > 0) {
            let keys = Object.keys(documentMap);
            let values = Object.values(documentMap);
            let id = keys[0],
                fileName = values[0];

            documentsPreview.push({
                title: "DOC_DOC_PICTURE",
                fileStoreId: id,
                linkText: "View",
            });
            let changetenantId = userInfo.tenantId ? userInfo.tenantId.split(".")[0] : "ch";
            let fileStoreIds = jp.query(documentsPreview, "$.*.fileStoreId");
            let fileUrls =
                fileStoreIds.length > 0 ? await getFileUrlFromAPI(fileStoreIds, changetenantId) : {};


            documentsPreview = documentsPreview.map(function (doc, index) {
                doc["link"] =
                    (fileUrls &&
                        fileUrls[doc.fileStoreId] &&
                        fileUrls[doc.fileStoreId].split(",")[0]) ||
                    "";

                doc["name"] =
                    (fileUrls[doc.fileStoreId] &&
                        decodeURIComponent(
                            fileUrls[doc.fileStoreId]
                                .split(",")[0]
                                .split("?")[0]
                                .split("/")
                                .pop()
                                .slice(13)
                        )) ||
                    `Document - ${index + 1}`;
                return doc;
            });
            setTimeout(() => {
                window.open(documentsPreview[0].link);
            }, 100);
            prepareFinalObject('documentsPreview', documentsPreview)
        }
    }

    render() {
        // const { firstName, fCharges,result, email, mobileNo, locality, surcharge, fromDate, toDate, facilationChargesSuccess,
        //     onFromDateChange, onToDateChange, utGST, cGST, GSTnumber, handleChange, bankName, amount, transactionDate, transactionNumber, paymentMode,
        //     dimension, location, facilitationCharges, cleaningCharges, rent, approverName, comment, houseNo, type, purpose, residenials, documentMap,
        //     BK_FEE_HEAD_PACC,LUXURY_TAX,REFUNDABLE_SECURITY,PACC_TAX,totalAmountSuPage,one,two,three,four,five,six,
        //     PACPACC_ROUND_OFFC_TAX,FACILITATION_CHARGE
        //     } = this.props;


            // console.log(",one,two,three,four,five,six--",one,two,three,four,five,six)
            // console.log("propsInRendersummary--",this.props)
            // let fc = fCharges?fCharges.facilitationCharge:'100';
            // console.log("stateofBooking--",this.state.createPACCApp)
  const {paymentDetails, TotalAmount,billId, userInfo} = this.props;
  let ApplicantName = this.props.RoomBookingData.bookingsModelList[0].bkApplicantName
  let ApplicantMobNum = this.props.RoomBookingData.bookingsModelList[0].bkMobileNumber
  console.log("propsInpayPage--",this.props)
  let { PayerName, mobileNo, PaidBy, transactionDate, PaymentReceiptNumber,ChequeNo,ChequeDate,IFSC,BankName,last4Digits,TrxNo,repeatTrxNo,
BankBranch,DDno,ddDate,ddIFSC,ddBank,ddBranch} = this.state;
console.log("this.state--",ChequeNo)  
console.log("this.state--PaidBy",PaidBy)
         return (
            <div>
                <div className="form-without-button-cont-generic">
                    <div classsName="container">
                        <div className="col-xs-12">
{/* {this.props.ApplicantAppStatus != "OFFLINE_RE_INITIATED" ? 
 <PaymentDetails
 paymentDetails={paymentDetails && paymentDetails}
  />     
: ""} */}

 <PaymentDetails
 one={this.props.one}
 two={this.props.two}
 three={this.props.three}
 four={this.props.four}
 paymentDetails={paymentDetails && paymentDetails}
  />     

                       
{/* 
{this.props.ApplicantAppStatus == "OFFLINE_RE_INITIATED" ? 
<DateVenueChangePayDetail 
paymentDetails={paymentDetails && paymentDetails}
Status={this.props.ApplicantAppStatus && this.props.ApplicantAppStatus}
/>
:""} */}
                            
               <PaymentOptionDetails 
               PaymentReceiptNumber={PaymentReceiptNumber}
               PayerName={PayerName}
               ChequeNo={ChequeNo}
               ChequeDate={ChequeDate}
               IFSC={IFSC}
               BankName={BankName}
               BankBranch={BankBranch}
               DDno={DDno}
               ddDate={ddDate}
               ddIFSC={ddIFSC}
               ddBank={ddBank}
               ddBranch={ddBranch}
               last4Digits={last4Digits}
               TrxNo={TrxNo}
               repeatTrxNo={repeatTrxNo}
               handleChange={this.handleChange}
               changeChequeDate={this.changeChequeDate}
               changeDdDate={this.changeDdDate}
               mobileNo={mobileNo}
               PaidBy={PaidBy}
               ApplicantMobNum={ApplicantMobNum && ApplicantMobNum ? ApplicantMobNum : "notFound"}
               ApplicantName={ApplicantName && ApplicantName ? ApplicantName : "Notfound"}
               />

< PaymentReceiptDetail 
                PaymentReceiptNumber={PaymentReceiptNumber}
                handleChange={this.handleChange}
                transactionDateChange={this.transactionDateChange}
                transactionDate={transactionDate}
               />

 {this.state.SubmitDetails == true ? 
              <SubmitPaymentDetails
               TotalAmount={TotalAmount}
               billId={billId}
               userInfo={userInfo}
               ApplicantName={ApplicantName}
               ApplicantMobNum={ApplicantMobNum}
               PaidBy={PaidBy}
               justTry={this.state.justTry}
               />
               : console.log("your state is not true till yet--",this.state.SubmitDetails)}


                            <div className="col-xs-12" style={{ marginLeft: '10px' }}>
                                <div className="col-sm-12 col-xs-12" style={{ marginBottom: '90px' }}>
                                    <div className="complaint-detail-detail-section-status row">
                                        <div className="col-md-4">
                                        </div>
                                    </div>
                                </div>
                            </div>


                        </div>

                    </div></div>
                    
                <Footer className="apply-wizard-footer" style={{ display: 'flex', justifyContent: 'flex-end' }} children={
                    <div className="responsive-action-button-cont">
                        {/* <Button
                            className="responsive-action-button"
                            primary={true}
                            label={<Label buttonLabel={true} label="BK_CORE_COMMON_GOBACK" />}
                            fullWidth={true}
                            onClick={this.back}
                            style={{ marginRight: 18 }}
                            startIcon={<ArrowBackIosIcon />}
                        /> */}
                        <Button
                            className="responsive-action-button"
                            primary={true}
                            label={<Label buttonLabel={true} label="BK_MYBK_GENERATE_RECEIPT" />}
                            fullWidth={true}
                            onClick={this.submit}
                            style={{ rightIcon: "arrow_drop_down" }}
                        />
                    </div>
                }></Footer>

            </div>
        );
    }
}


const mapStateToProps = state => {

    const { bookings, common, auth, form } = state;
    const { createPACCApplicationData} = bookings;
    const { userInfo } = state.auth;
    const { facilationChargesSuccess, arrayName } = bookings;
    const { applicationData } = bookings;
    console.log("BookingInPayment--",bookings)
let RoomBookingData = state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.RoomBookingData : "NA"
  console.log("-RoomBookingData-",RoomBookingData)  
const { paymentData } = bookings;
let paymentDataOne = paymentData ? paymentData : "wrong";
let paidBy = state.screenConfiguration.preparedFinalObject.PaidBy ?  state.screenConfiguration.preparedFinalObject.PaidBy : " ";
let ppaidBy = paidBy && paidBy ? paidBy : " "
console.log("ppaidBy--",ppaidBy)


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

    if(billAccountDetailsArray[i].taxHeadCode == "CGST_UTGST_COMMUNITY_CENTRES_JHANJ_GHAR_BOOKING_BRANCH"){
        one = billAccountDetailsArray[i].amount
    }
    else if(billAccountDetailsArray[i].taxHeadCode == "RENT_COMMUNITY_CENTRES_JHANJ_GHAR_BOOKING_BRANCH"){
        two = billAccountDetailsArray[i].amount
    }
}

console.log("one--",one)
console.log("two--",two)
console.log("three--",three)
console.log("four--",four)
console.log("five--",five)
console.log("six--",six)

let paymentMode = 
state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.paymentMode:"";  

console.log("paymentMode--",paymentMode)


    return {
        ppaidBy, RoomBookingData,userInfo,paymentMode,one,two,three,four,five,six,paymentDataOne,checkBillLength,totalAmountSuPage,paymentDetails,TotalAmount,billId,billAccountDetailsArray
    }

}
const mapDispatchToProps = dispatch => {
    return {
        // fetchApplications: criteria => dispatch(fetchApplications(criteria)),
        fetchDataAfterPayment: criteria => dispatch(fetchDataAfterPayment(criteria)),
        // createPACCApplication: (criteria, hasUsers, overWrite) => dispatch(createPACCApplication(criteria, hasUsers, overWrite)),
        // updatePACCApplication: (criteria, hasUsers, overWrite) => dispatch(updatePACCApplication(criteria, hasUsers, overWrite)),
        toggleSnackbarAndSetText: (open, message, error) =>
            dispatch(toggleSnackbarAndSetText(open, message, error)),
            fetchPayment: criteria => dispatch(fetchPayment(criteria)), 
            prepareFinalObject: (jsonPath, value) =>
            dispatch(prepareFinalObject(jsonPath, value)),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SummaryDetails);