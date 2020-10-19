import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import get from "lodash/get";
import Grid from "@material-ui/core/Grid";

const styles = (theme) => ({
    button: {
        margin: theme.spacing.unit,
        padding: "8px 38px",
    },
    input: {
        display: "none !important",
    },
});

class SelectedTimeSlotInfo extends Component {
    render() {
        const { bookingLocation, fromDate, toDate, fromTime, toTime, bkDisplayFromDateTime,  bkDisplayToDateTime, timeSlots} = this.props;
        console.log(this.props,"kj  nero rops");
        return (
            <Grid container={true}>
                <Grid item={true} xs={1}>
                    <span
                        style={{
                            display: "block",
                            color: "rgba(0, 0, 0, 0.54)",
                            fontSize: 16,
                            fontWeight: 400,
                            lineHeight: "1.375em",
                        }}
                    >
                        Venue:
                    </span>

                </Grid>
                <Grid item={true} xs={11}>

                    <span
                        style={{
                            color: "rgba(0, 0, 0, 0.87)",
                            fontSize: 16,
                            fontWeight: 400,
                            display: "block",
                            marginBottom: "10px",
                            letterSpacing: "0.67px",
                        }}
                    >
                        {bookingLocation}
                    </span>
                </Grid>
                <Grid item={true} xs={1}>
                    <span
                        style={{
                            display: "block",
                            color: "rgba(0, 0, 0, 0.54)",
                            fontSize: 16,
                            fontWeight: 400,
                            lineHeight: "1.375em",
                        }}
                    >
                        From:
                    </span>

                </Grid>
                <Grid item={true} xs={11}>

                    <span
                        style={{
                            color: "rgba(0, 0, 0, 0.87)",
                            fontSize: 16,
                            fontWeight: 400,
                            display: "block",
                            marginBottom: "10px",
                            letterSpacing: "0.67px",
                        }}
                    >
                        {timeSlots && timeSlots.length > 0? bkDisplayFromDateTime:'--/--/--'}
                    </span>
                </Grid>
                <Grid item={true} xs={1}>
                    <span
                        style={{
                            display: "block",
                            color: "rgba(0, 0, 0, 0.54)",
                            fontSize: 16,
                            fontWeight: 400,
                            lineHeight: "1.375em",
                        }}
                    >
                        To:
                    </span>

                </Grid>
                <Grid item={true} xs={11}>

                    <span
                        style={{
                            color: "rgba(0, 0, 0, 0.87)",
                            fontSize: 16,
                            fontWeight: 400,
                            display: "block",
                            marginBottom: "10px",
                            letterSpacing: "0.67px",
                        }}
                    >
                        {timeSlots && timeSlots.length > 0?bkDisplayToDateTime:'--/--/--'}
                    </span>
                </Grid>
            </Grid>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    console.log(state, "Nero State");
    let bookingLocation = get(
        state,
        "screenConfiguration.preparedFinalObject.availabilityCheckData.bkLocation",
        []
    );
    let bkFromDate = get(
        state,
        "screenConfiguration.preparedFinalObject.Booking.bkFromDate",
        []
    );
    let bkToDate = get(
        state,
        "screenConfiguration.preparedFinalObject.Booking.bkToDate",
        []
    );

    let bkFromTime = get(
        state,
        "screenConfiguration.preparedFinalObject.Booking.bkFromTime",
        []
    );

    let bkToTime = get(
        state,
        "screenConfiguration.preparedFinalObject.Booking.bkToTime",
        []
    );

    let timeSlots = get(
        state,
        "screenConfiguration.preparedFinalObject.Booking.timeslots",
        []
    );

    let bkDisplayFromDateTime = get(
        state,
        "screenConfiguration.preparedFinalObject.DisplayPacc.bkDisplayFromDateTime",
        []
    );

    let bkDisplayToDateTime = get(
        state,
        "screenConfiguration.preparedFinalObject.DisplayPacc.bkDisplayToDateTime",
        []
    );
    return {
        bookingLocation: bookingLocation,
        fromDate: bkFromDate,
        toDate: bkToDate,
        fromTime: bkFromTime,
        toTime: bkToTime,
        bkDisplayFromDateTime: bkDisplayFromDateTime,
        bkDisplayToDateTime: bkDisplayToDateTime,
        timeSlots: timeSlots

     };
};

export default withStyles(styles)(
    connect(mapStateToProps, null)(SelectedTimeSlotInfo)
);
