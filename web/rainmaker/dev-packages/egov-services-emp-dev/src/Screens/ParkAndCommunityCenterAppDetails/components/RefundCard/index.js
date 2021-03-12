import React, { Component } from "react";
import { Card, Image, Icon, Button } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import isEmpty from "lodash/isEmpty";
import "./index.css";
import { httpRequest } from "egov-ui-kit/utils/api";
import { fetchDataAfterPayment} from "egov-ui-kit/redux/bookings/actions";
import { connect } from "react-redux";



class AppDetails extends Component {

  constructor(props) {
		super(props);
		this.state = {
      totalAmount : '',
      payload : '',
      one: '',
      NewReFund: '',
      lastAmountShow: ''
		};
	};

  async componentDidMount() {

    const {applicationNo, bkFromDate, bkToDate, tenantId,paymentDetails,fetchDataAfterPayment,fetchPaymentAfterPayment,hh} = this.props
    console.log("propsInrefundPage--",this.props)

    console.log("hh-com-",hh ? hh : "nnnn")
if(hh != "NotFound"){
    this.setState({
      one : hh
    })
  }
    // fetchDataAfterPayment(
		// 	[{ key: "consumerCodes", value: applicationNo }, { key: "tenantId", value: tenantId }
    // 	])
    //New Approach
    let RequestData = [
      { key: "consumerCodes", value: applicationNo },
      { key: "tenantId", value: tenantId }
      ];
    let payloadfundAmount = await httpRequest(
      "collection-services/payments/_search?",
      "_search",
      RequestData
      );

      console.log("RequestData--for-Refund-payment",RequestData)
      console.log("payloadfund--for-Refund-payment",payloadfundAmount)
      console.log("payloadfund.payloadfundAmount--",payloadfundAmount.Payments)

      let AmountFromBackEnd = payloadfundAmount.Payments
      console.log("AmountFromBackEnd--",AmountFromBackEnd)
      console.log("typeOfAmountFromBackEnd--",typeof(AmountFromBackEnd))

//first  function
    let SecondFunRefAmt = await this.BookingRefundAmount(applicationNo, tenantId, bkFromDate,AmountFromBackEnd);
    console.log("totalRes--inrefundPageoneone",SecondFunRefAmt)

    const labelLast = `Refund Amount - Rs.${SecondFunRefAmt}`
    console.log("labelLast-labelLast",labelLast)
    this.setState({
      lastAmountShow : labelLast
    })

//BookingRefundAmount
    // let totalRes = await this.calculateCancelledBookingRefundAmount(applicationNo, tenantId, bkFromDate,AmountFromBackEnd);
    // console.log("totalRes--inrefundPage",totalRes)

    // this.setState({
    //   totalAmount: totalRes
    // })

  }

  componentWillReceiveProps(nextProps) {
    console.log("propsInRefundPage--",nextProps)
    if(nextProps.RefAmount){
      console.log("comeInrefundIfCondition")
      this.setState({
        NewReFund : nextProps.RefAmount
      },console.log("NewStatnextProps.RefAmount--",this.state.NewReFund))
    }
    }

  calculateCancelledBookingRefundAmount = async (applicationNumber, tenantId, bookingDate,AmountFromBackEnd) => {
    const {payloadone, payload, payloadTwo, ConRefAmt,fetchPaymentAfterPayment} = this.props;
    console.log("propsforcalculateCancelledBookingRefundAmount--",this.props)

    this.setState({
      payload :AmountFromBackEnd
    })

    var CheckDate = new Date(bookingDate);
    console.log("CheckDate--",CheckDate)
    var todayDate = new Date();
    console.log("todayDate--",todayDate)


        if (applicationNumber && tenantId) {

            console.log("Payment Details",this.state.payload ? this.state.payload : "NOTFOUND");
            if (this.state.payload) {

              if(todayDate > CheckDate){
                // alert("refundCondition")
                let billAccountDetails = this.state.payload.Payments[0].paymentDetails[0].bill.billDetails[0].billAccountDetails;
                let bookingAmount = 0;
                for (let i = 0; i < billAccountDetails.length; i++) {
                    if (billAccountDetails[i].taxHeadCode == "SECURITY_MANUAL_OPEN_SPACE_BOOKING_BRANCH") {
                        bookingAmount += billAccountDetails[i].amount;
                    }
                }

                return bookingAmount;

              }
              if(todayDate < CheckDate) {
                // alert("cancelCondition")
                let billAccountDetails =this.state.payload.Payments[0].paymentDetails[0].bill.billDetails[0].billAccountDetails;
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
                    "_search",[],
                    mdmsBody
                );
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

    BookingRefundAmount = async (applicationNumber, tenantId, bookingDate,AmountFromBackEnd) => {
      const {payloadone, payload, payloadTwo, ConRefAmt,fetchPaymentAfterPayment} = this.props;
      console.log("propsforcalculateCancelledBookingRefundAmount--second",this.props)

      // this.setState({
      //   payload :AmountFromBackEnd
      // })

      var CheckDate = new Date(bookingDate);
      console.log("CheckDate--",CheckDate)
      var todayDate = new Date();
      console.log("todayDate--",todayDate)


          if (applicationNumber && tenantId) {

              console.log("Payment Details--second",AmountFromBackEnd ? AmountFromBackEnd : "NOTFOUND");
              if (AmountFromBackEnd && AmountFromBackEnd) {
                if(todayDate > CheckDate){
                  // alert("refundCondition")   [0].paymentDetails
                  let billAccountDetails = AmountFromBackEnd[0].paymentDetails[0].bill.billDetails[0].billAccountDetails;
                  let bookingAmount = 0;
                  for (let i = 0; i < billAccountDetails.length; i++) {
                      if (billAccountDetails[i].taxHeadCode == "SECURITY_MANUAL_OPEN_SPACE_BOOKING_BRANCH") {
                          bookingAmount += billAccountDetails[i].amount;
                      }
                  }

                  return bookingAmount;

                }
                if(todayDate < CheckDate) {
                  // alert("cancelCondition")
                  let billAccountDetails = AmountFromBackEnd[0].paymentDetails[0].bill.billDetails[0].billAccountDetails;
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
                      "_search",[],
                      mdmsBody
                  );
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
    const { RefAmount } = this.props;
    // console.log("stateOftotal--",this.state.totalAmount, this.state.one)
    // console.log("this.props--RefAmount",RefAmount)
    // const label1 = `Refund Amount - Rs.${RefAmount}`
    // const label2 = `Refund Amount - Rs.${this.state.totalAmount}`
    // const label3 = `Refund Amount - Rs.${this.state.NewReFund}`
    return (
      <div>
        <Card
          textChildren={
            <div>
              <div className="rainmaker-displayInline">
                <Label label="BK_MYBK_REFUND_DETAILS" containerStyle={{ marginLeft: "13px" }} labelClassName="dark-heading" />
              </div>
              <div key={10} className="complaint-detail-full-width">
                <div className="complaint-detail-detail-section-status row">
                  <div className="col-md-4">
                    <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label={this.state.lastAmountShow}/>
                  </div>
                  {/* <h5>{this.state.NewReFund}</h5>
                  <h3>{this.state.lastAmountShow}</h3> */}
                </div>
              </div>
            </div>
          }
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { bookings, common, auth, form } = state;

  const { fetchPaymentAfterPayment } = bookings;

  let hh = fetchPaymentAfterPayment ? fetchPaymentAfterPayment : "NotFound"
  console.log("hh--",hh)
  console.log("fetchPaymentAfterPayment-map--",fetchPaymentAfterPayment)
  return {
    fetchPaymentAfterPayment,hh
  }

}

const mapDispatchToProps = dispatch => {
  return {
    fetchDataAfterPayment: (jsonPath, value) => dispatch(fetchDataAfterPayment(jsonPath, value)),
  }
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(AppDetails);

