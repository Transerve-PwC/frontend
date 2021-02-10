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

    state = {
        bookingLocation: '',
        fromTime: '',
        toTime: '',
        bkDisplayFromDateTime: '',
        bkDisplayToDateTime: ''
      }

      componentDidMount() {
        const { oldAvailabilityCheckData,bookingLocation, fromDate, toDate, fromTime, toTime, bkDisplayFromDateTime,  bkDisplayToDateTime, bookingVenue, oldFromDate, oldToDate} = this.props;
       console.log("propsComINslotComp--",this.props)
        if(oldAvailabilityCheckData){
        console.log("selectedTimeSlotIFcondition")    
       this.setState({
    bookingLocation :bookingVenue,
    fromTime: oldAvailabilityCheckData.TimeSlotfromTime,
    toTime: oldAvailabilityCheckData.TimeSlotToTime,
    bkDisplayFromDateTime: oldAvailabilityCheckData.ConcatFromDateTime,
    bkDisplayToDateTime: oldAvailabilityCheckData.ConcatToDateTime
})
        }
        else{
            this.setState({
                bookingLocation,
                fromTime,
                toTime,
                bkDisplayFromDateTime,
                bkDisplayToDateTime
            }) 
        }

    }


      componentWillReceiveProps(nextProps) {
          console.log("nextPropsOdSelectedTimeSlot--",nextProps)
        const { oldAvailabilityCheckData,bookingLocation, fromDate, toDate, fromTime, toTime, bkDisplayFromDateTime,  
        bkDisplayToDateTime, bookingVenue, oldFromDate, oldToDate} = nextProps;
        console.log("propscomponentWillReceiveProps--",this.props)

        if(nextProps.fromTime.length > 0 && nextProps.toTime.length > 0){
       console.log("1234567")
        this.setState({
            bookingLocation :bookingLocation,
            fromTime: fromTime,
            toTime: toTime,
            bkDisplayFromDateTime: bkDisplayFromDateTime,
            bkDisplayToDateTime: bkDisplayToDateTime
        }) 
     }
    }
      

    render() {
//         const { bookingLocation, fromDate, toDate, fromTime, toTime, bkDisplayFromDateTime,  bkDisplayToDateTime} = this.props;
//    console.log("propsInSelectedTimeSlot--",this.props)

const { bookingLocation, fromTime, toTime, bkDisplayFromDateTime,  bkDisplayToDateTime} = this.state;
   console.log("StateInSelectedTimeSlot--",this.state)
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
                    >{console.log("locationInSelectedTimeSlot--",bookingLocation)}
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
                        {console.log("fromTime--",fromTime)};
                        {console.log("bkDisplayFromDateTime--23",bkDisplayFromDateTime)}
                        {console.log("fromTime && fromTime.length == 0?'--/--/--':bkDisplayFromDateTime",
                        fromTime && fromTime.length == 0?'--/--/--':bkDisplayFromDateTime
                        )}
                        {fromTime && fromTime.length == 0?'--/--/--':bkDisplayFromDateTime}
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
                        {console.log("toTime && toTime.length == 0?'--/--/--':bkDisplayToDateTime--",toTime && toTime.length == 0?'--/--/--':bkDisplayToDateTime)}
                        {console.log("toTime--",toTime)}
                        {console.log("bkDisplayToDateTime23--",bkDisplayToDateTime)}
                        {toTime && toTime.length == 0?'--/--/--':bkDisplayToDateTime}
                    </span>
                </Grid>
            </Grid>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    let bookingLocation = get(
        state,
        "screenConfiguration.preparedFinalObject.availabilityCheckData.bkLocation",
        []
    );
    console.log("bookingLocation--bookingLocation",bookingLocation)

    let bkFromDate = get(
        state,
        "screenConfiguration.preparedFinalObject.Booking.bkFromDate",
        []
    );
    console.log("bkFromDate=bkFromDate",bkFromDate)

    let bkToDate = get(
        state,
        "screenConfiguration.preparedFinalObject.Booking.bkToDate",
        []
    );
    console.log("bkToDate=bkToDate,",bkToDate)

    let bkFromTime = get(
        state,
        "screenConfiguration.preparedFinalObject.Booking.bkFromTime",
        []
    );
console.log("bkFromTime--bkFromTime",bkFromTime)
    let bkToTime = get(
        state,
        "screenConfiguration.preparedFinalObject.Booking.bkToTime",
        []
    );
    console.log("bkToTime--bkToTime",bkToTime)
    let bkDisplayFromDateTime = get(
        state,
        "screenConfiguration.preparedFinalObject.DisplayPacc.bkDisplayFromDateTime",
        []
    );
    console.log("bkDisplayFromDateTime--bkDisplayFromDateTime",bkDisplayFromDateTime)
    let bkDisplayToDateTime = get(
        state,
        "screenConfiguration.preparedFinalObject.DisplayPacc.bkDisplayToDateTime",
        []
    );
    console.log("bkDisplayToDateTime--bkDisplayToDateTime",bkDisplayToDateTime)
    return { 
        bookingLocation: bookingLocation,
        fromDate: bkFromDate,
        toDate: bkToDate,
        fromTime: bkFromTime,
        toTime: bkToTime,
        bkDisplayFromDateTime: bkDisplayFromDateTime,
        bkDisplayToDateTime: bkDisplayToDateTime

     };
};

export default withStyles(styles)(
    connect(mapStateToProps, null)(SelectedTimeSlotInfo)
);