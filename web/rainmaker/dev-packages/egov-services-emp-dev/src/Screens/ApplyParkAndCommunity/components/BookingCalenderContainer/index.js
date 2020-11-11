import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { BookingCalendar } from "../../ui-molecules-local";
import { connect } from "react-redux";
import get from "lodash/get";

const styles = (theme) => ({
    button: {
        margin: theme.spacing.unit,
        padding: "8px 38px",
    },
    input: {
        display: "none !important",
    },
});

class BookingCalenderContainer extends Component {
    render() {
        const { ...rest } = this.props;
        return <BookingCalendar {...rest} />;
    }
}

const mapStateToProps = (state, ownProps) => {
    let availabilityCheckData = get(
        state,
        "screenConfiguration.preparedFinalObject.availabilityCheckData",
        []
    );
    let bookingVenue = get(
        state.screenConfiguration.preparedFinalObject.availabilityCheckData,
        ownProps.venueDataKey,
        []
    );
    return { availabilityCheckData, bookingVenue };
};

export default withStyles(styles)(
    connect(mapStateToProps, null)(BookingCalenderContainer)
);
