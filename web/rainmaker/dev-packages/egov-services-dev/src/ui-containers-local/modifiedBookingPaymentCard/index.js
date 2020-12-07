import React, { Component } from "react";
import { FeesEstimateCard } from "../../ui-molecules-local";
import { connect } from "react-redux";
import get from "lodash/get";

class modifiedBookingPaymentCard extends Component {

    render() {
        return <FeesEstimateCard estimate={this.props.estimate} baseCharge={this.props.baseCharge} />;
    }
}

const sortBillDetails = (billDetails = []) => {
    let sortedBillDetails = [];

    sortedBillDetails = billDetails.sort((x, y) => y.fromPeriod - x.fromPeriod);
    return sortedBillDetails;
};

const formatTaxHeaders = (billDetail = {}) => {
    let formattedFees = [];
    const { billAccountDetails = [] } = billDetail;
    formattedFees = billAccountDetails.map((taxHead) => {
        return {
            info: {
                labelKey: `BK_FEE_HEAD_${taxHead.taxHeadCode}`,
                labelName: `BK_FEE_HEAD_${taxHead.taxHeadCode}`,
            },
            name: {
                labelKey: `BK_FEE_HEAD_${taxHead.taxHeadCode}`,
                labelName: `BK_FEE_HEAD_${taxHead.taxHeadCode}`,
            },
            value: taxHead.amount.toFixed(2),
            order: taxHead.order,
        };
    });
    formattedFees.sort(function (x, y) {
        return y.value - x.value;
    });
    //formattedFees.reverse();
    return formattedFees;
};

const mapStateToProps = (state, ownProps) => {
    const { screenConfiguration } = state;
    let fees1 = formatTaxHeaders(
        sortBillDetails(
            get(
                screenConfiguration,
                "preparedFinalObject.ModifiedBookingOldBill[0].Bill[0].billDetails",
                []
            )
        )[0]
    );

    console.log(fees1, "Nero Fees")
    let businessService = get(screenConfiguration,
        "preparedFinalObject.ModifiedBookingOldBill[0].Bill[0].businessService",
        []
    )


    const baseCharge = get(
        screenConfiguration,
        "preparedFinalObject.BaseCharge",
        []
    )
    // const fees = get(screenConfiguration, "preparedFinalObject.applyScreenMdmsData.estimateCardData", []);
    const billDetails = get(
        screenConfiguration,
        "preparedFinalObject.ModifiedBookingOldBill[0].Bill[0].billDetails",
        []
    );
    let totalAmount = 0;
    let arrears = 0;
    for (let billDetail of billDetails) {
        totalAmount += billDetail.amount;
    }
    if (totalAmount > 0) {
        arrears = totalAmount - billDetails[0].amount;
    }

    let newArray = [];
    for (let i = 0; i < fees1.length; i++) {
        if (i == 0) {
            newArray.push(fees1[i]);
        }
        if (i == 1) {
            newArray.push(fees1[i]);
        }
    }
    let fees = newArray;
    const estimate = {
        header: { labelName: "Date/Venue Change Charge", labelKey: "BK_FEE_HEAD_PACC_LOCATION_AND_VENUE_CHANGE_AMOUNT" },
        fees,
        totalAmount,
        arrears,
    };
    // console.log(fee, "Nero new fee")
    return { estimate, baseCharge };
};

export default connect(mapStateToProps, null)(modifiedBookingPaymentCard);
