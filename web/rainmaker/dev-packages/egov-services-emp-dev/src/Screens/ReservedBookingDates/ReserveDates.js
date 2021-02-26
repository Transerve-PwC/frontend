import React from "react";
import DayPicker, {
    DateUtils,
} from "../../contributed-modules/react-day-picker";
import {
    prepareFinalObject,
    toggleSnackbar,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { connect } from "react-redux";
import "../../contributed-modules/react-day-picker/lib/style.css";
import "../ApplyParkAndCommunity/components/BookingCalendar/index.css";
import get from "lodash/get";
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";

export default class Example extends React.Component {
    constructor(props) {
        super(props);
        this.handleDayClick = this.handleDayClick.bind(this);
        this.state = {
            selectedDays: [],
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
    }

    render() {
        return (
            <div>
                <div className="calendar-wrapper">
                    <div className="calendar-section">
                        <DayPicker
                            numberOfMonths={2}
                            initialMonth={new Date()}
                            selectedDays={this.state.selectedDays}
                            onDayClick={this.handleDayClick}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
