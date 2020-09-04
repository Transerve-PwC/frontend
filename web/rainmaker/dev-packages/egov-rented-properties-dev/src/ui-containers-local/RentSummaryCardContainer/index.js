import React, { Component } from "react";
import { RentSummaryCard } from "../../ui-molecules-local";
import { connect } from "react-redux";
import get from "lodash/get";

class RentSummaryCardContainer extends Component {
  render() {
    return <RentSummaryCard rentSummary={this.props.rentSummary} />;
  }
}

const mapStateToProps = (state, ownProps) => {
  const { screenConfiguration } = state;
  const rent = get(
    screenConfiguration.preparedFinalObject,
    ownProps.sourceJsonPath,
    []
  );
  const rentSummary = {
    header: { labelName: "Rent Summary", labelKey: "RP_RENT_SUMMARY_HEADER" },
    rent
  };
  return { rentSummary };
};

export default connect(
  mapStateToProps,
  null
)(RentSummaryCardContainer);
