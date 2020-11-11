import React, { Component } from "react";
import { FeesEstimateCard } from "../../ui-molecules-local";
import { connect } from "react-redux";
import get from "lodash/get";

class RefundAmountContainer extends Component {

    render() {
        const { refundAmount } = this.props;
        return (
            <div style={{marginLeft: "23px"}}>
                Refund Amount - <span style={{fontWeight:"bold"}}>Rs. {refundAmount}</span>
            </div>
        )
    }
}



const mapStateToProps = (state, ownProps) => {
    const { screenConfiguration } = state;



    const bookingDate = get(
        screenConfiguration,
        "preparedFinalObject.Booking.bkFromDate",
        []
    )
    var billAccountDetails = get(
        screenConfiguration,
        "preparedFinalObject.ReceiptTemp[0].Bill[0].billDetails[0].billAccountDetails",
        []
    );
    let bookingAmount = 0;
    for(let i = 0; i<billAccountDetails.length; i++){
        if(billAccountDetails[i].taxHeadCode == "REFUNDABLE_SECURITY"){
            bookingAmount += billAccountDetails[i].amount;
        }
        if(billAccountDetails[i].taxHeadCode == "PACC"){
            bookingAmount += billAccountDetails[i].amount;
        }
    }

    const txnTotalAmount = get(
        screenConfiguration,
        "preparedFinalObject.ReceiptTemp[0].Bill[0].totalAmount",
        []
    )
    var date1 = new Date(bookingDate);
    var date2 = new Date();

    var Difference_In_Time = date1.getTime() - date2.getTime();

    // To calculate the no. of days between two dates
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

    let refundAmount = 0
    if (Difference_In_Days > 29) {
        const refundPercent = get(
            screenConfiguration,
            "preparedFinalObject.cancelParkCcScreenMdmsData.Booking.bookingCancellationRefundCalc[0].MORETHAN30DAYS.refundpercentage",
            []
        )

        refundAmount = (parseFloat(bookingAmount)*refundPercent)/100
    } else if (Difference_In_Days > 15 && Difference_In_Days < 30) {
        const refundPercent = get(
            screenConfiguration,
            "preparedFinalObject.cancelParkCcScreenMdmsData.Booking.bookingCancellationRefundCalc[0].LETTHAN30MORETHAN15DAYS.refundpercentage",
            []
        )
        refundAmount = (parseFloat(bookingAmount)*refundPercent)/100
    }


    return { refundAmount };
};

export default connect(mapStateToProps, null)(RefundAmountContainer);
