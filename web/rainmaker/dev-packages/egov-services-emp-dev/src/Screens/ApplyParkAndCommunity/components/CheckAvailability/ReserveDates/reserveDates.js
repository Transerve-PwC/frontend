import React from "react";
import DayPicker, {
    DateUtils,
} from "../../../../../contributed-modules/react-day-picker";
import {
    prepareFinalObject,
    toggleSnackbar,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { connect } from "react-redux";
import "../../../../../contributed-modules/react-day-picker/lib/style.css";
import "../../../../ApplyParkAndCommunity/components/BookingCalendar/index.css";

import get from "lodash/get";
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";

class Example extends React.Component {
    constructor(props) {
        super(props);
        this.handleDayClick = this.handleDayClick.bind(this);
        this.state = {
            selectedDays: [],
            disabledDays: []
        };
    }

    handleDayClick(day, { selected }) {
        const { selectedDays } = this.state;
        if (selected) {
            const selectedIndex = selectedDays.findIndex(selectedDay =>
                DateUtils.isSameDay(selectedDay, day)
            );
            selectedDays.splice(selectedIndex, 1);
        } else {
            selectedDays.push(day);
        }
        this.setState({ selectedDays });
        this.props.prepareFinalObject("availabilityCheckData.holdDatesForSave", selectedDays);
    }



    componentWillReceiveProps(nextProps) {
        const { availabilityCheckData } = nextProps;
        // console.log(pushReservedDay, "Nero Console")

        //     this.setState({selectedDays: pushReservedDay});
        // if ("reservedDays" in resetDate) {
        //     console.log(resetDate.reservedDays, "Nero Reser")
        // }

        if (availabilityCheckData && availabilityCheckData.reservedDays) {

            let pushReservedDay = [];
            availabilityCheckData.reservedDays.length > 0 &&
                availabilityCheckData.reservedDays.map((el) => {
                    pushReservedDay.push(new Date(el));
                });
            //console.log("availabilityCheckData@@", availabilityCheckData, resetDate);
            this.setState({ disabledDays: pushReservedDay });
        }
    }

    getInitialState() {
        return {
            from: null,
            to: null,
            enteredTo: null,
        };
    }

    render() {
        // const {availabilityCheckData} = this.props;
        //console.log(availabilityCheckData, "neeraj")

        return (
            <div>
                <div className="calendar-wrapper">
                    <div className="calendar-section">
                        <DayPicker
                            numberOfMonths={2}
                            initialMonth={new Date()}
                            disabledDays={this.state.disabledDays}
                            onDayClick={this.handleDayClick}
                            selectedDays={this.state.selectedDays}
                        />
                    </div>
                </div>
            </div>
        );
    }
}


const mapDispatchToProps = (dispatch) => {
    return {
      prepareFinalObject: (jsonPath, value) =>
        dispatch(prepareFinalObject(jsonPath, value)),


    };
  };
const mapStateToProps = (state, ownProps) => {
    let resetDate = state.screenConfiguration.preparedFinalObject
        ? state.screenConfiguration.preparedFinalObject.availabilityCheckData
        : "";
    console.log("ValueofResetDate--", resetDate);
    //oldAvailabilityCheckData.bkBookingVenue

    let bkVenue = state.screenConfiguration.preparedFinalObject
        .oldAvailabilityCheckData
        ? state.screenConfiguration.preparedFinalObject.oldAvailabilityCheckData
            .bkBookingVenue
        : "notfound";
    console.log("bkVenue--", bkVenue);

    let oldFromDate = state.screenConfiguration.preparedFinalObject
        .oldAvailabilityCheckData
        ? state.screenConfiguration.preparedFinalObject.oldAvailabilityCheckData
            .FromDate
        : "notfound";
    console.log("oldFromDate--Redux", new Date(oldFromDate).toLocaleDateString());

    let oldToDate = state.screenConfiguration.preparedFinalObject
        .oldAvailabilityCheckData
        ? state.screenConfiguration.preparedFinalObject.oldAvailabilityCheckData
            .bkToDate
        : "notfound";
    console.log("oldToDate--Redux", oldToDate);

    let ChangeFromDate = resetDate ? resetDate.bkFromDate : "";
    let ChangeToDate = resetDate ? resetDate.bkToDate : "";
    let availabilityCheckData = get(
        state,
        "screenConfiguration.preparedFinalObject.availabilityCheckData",
        []
    );

    if (availabilityCheckData && availabilityCheckData.reservedDays) {
        availabilityCheckData = availabilityCheckData;
    }

    if (availabilityCheckData.reservedDays) {
        return {
            availabilityCheckData,
            resetDate,
            ChangeFromDate,
            ChangeToDate,
            state,
            bkVenue,
            oldFromDate,
            oldToDate,
        };
    } else {
        return {
            resetDate,
            ChangeFromDate,
            ChangeToDate,
            state,
            bkVenue,
            oldFromDate,
            oldToDate,
        };
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(Example);
//export default Example;
