import React, { Component } from "react";
import { FeesEstimateCard } from "../../ui-molecules-local";
import { connect } from "react-redux";
import get from "lodash/get";

class EstimateCardContainer extends Component {

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
    const fees = formatTaxHeaders(
        sortBillDetails(
            get(
                screenConfiguration,
                "preparedFinalObject.ReceiptTemp[0].Bill[0].billDetails",
                []
            )
        )[0]
    );

		let businessService = get(screenConfiguration,
                "preparedFinalObject.ReceiptTemp[0].Bill[0].businessService",
                []
            )
    //if(businessService == "OSBM"){
    if(businessService == "BOOKING_BRANCH_SERVICES.MANUAL_OPEN_SPACE"){

		let tax = fees[1].value;
		fees.splice(1, 1);
		let ugstValue = tax/2;
		let cgstValue = tax/2;
		let ugst = {
		info: {labelKey: "BK_OSBM_UGST_PERCENT", labelName: "9% UGST"},
		name: {labelKey: "BK_OSBM_UGST_PERCENT", labelName: "9% UGST"},
		order: 0,
		value: ugstValue.toFixed(2)
		};
		fees.push(ugst);
		let cgst = {
		info: {labelKey: "BK_OSBM_CGST_PERCENT", labelName: "9% CGST"},
		name: {labelKey: "BK_OSBM_CGST_PERCENT", labelName: "9% CGST"},
		order: 0,
		value: cgstValue.toFixed(2)
		};
		fees.push(cgst);


		}

    const baseCharge = get(
        screenConfiguration,
        "preparedFinalObject.BaseCharge",
        []
    )
    // const fees = get(screenConfiguration, "preparedFinalObject.applyScreenMdmsData.estimateCardData", []);
    const billDetails = get(
        screenConfiguration,
        "preparedFinalObject.ReceiptTemp[0].Bill[0].billDetails",
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
    const estimate = {
        header: { labelName: "Fee Estimate", labelKey: "BK_SUMMARY_FEE_EST" },
        fees,
        totalAmount,
        arrears,
    };
    return { estimate, baseCharge };
};

export default connect(mapStateToProps, null)(EstimateCardContainer);
