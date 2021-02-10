import React from "react";
import DayPicker, {
  DateUtils,
} from "../../../../contributed-modules/react-day-picker";
import {
  prepareFinalObject,
  toggleSnackbar,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { connect } from "react-redux";
import "../../../../contributed-modules/react-day-picker/lib/style.css";
import "./index.css";
import { Card, Image, Icon, Button } from "components";
import get from "lodash/get";
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";

class BookingCalendar extends React.Component {
  constructor(props) {
    super(props);
    console.log("constructor--", this.state);
    this.state = this.getInitialState();
    this.state = {
      filterfromDate: "",
      filtertoDate: "",
      dselectedDays: [],
      CheckFromDateExist: false,
      newFrom: "",
      newTo: "",
      CheckBothDataExist: false,
    };
  }

  componentDidMount() {
    console.log("inComponentDidMount");
    const {
      availabilityCheckData,
      oldToDate,
      oldAvailabilityCheckData,
      oldFromDate,oldBookingData,
      witholDdATA,
    } = this.props;
    console.log("propsbooking--", this.props);
    console.log("witholDdATA--", witholDdATA);
    if (
      (oldAvailabilityCheckData &&
        oldAvailabilityCheckData.FromDate != undefined) ||
      (oldBookingData &&
        oldBookingData != "notfound" &&
        oldBookingData.bkFromDate != undefined)
    ) {
      console.log("nnnnnnnnnnnnnnnn");
      console.log("checking from--", new Date(oldFromDate))
      this.setState(
        {
          from: new Date(oldFromDate),
          to: new Date(oldToDate),
          enteredTo: new Date(oldToDate),
        },
        () =>
          console.log(
            "NewFrom:",
            this.state.from
              ? this.state.from.toLocaleDateString()
              : this.state.from,
            "toNew:",
            this.state.to.toLocaleDateString()
          )
      );
    }

    if (availabilityCheckData && availabilityCheckData.reservedDays) {
      console.log("forNewData");
      let pushReservedDay = [];
      availabilityCheckData.reservedDays.length > 0 &&
        availabilityCheckData.reservedDays.map((el) => {
          pushReservedDay.push(new Date(el));
        });
      console.log("availabilityCheckData@@", availabilityCheckData);

      if (availabilityCheckData.bkFromDate) {
        this.setState(
          {
            dselectedDays: pushReservedDay,
            from: new Date(availabilityCheckData.bkFromDate),
            to: new Date(availabilityCheckData.bkToDate),
            enteredTo: new Date(availabilityCheckData.bkToDate),
          },
          console.log("testing state--", this.state)
        );
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log("propsInCommercial--",this.props)
    if (
      nextProps.availabilityCheckData === undefined ||
      nextProps.availabilityCheckData.length === 0
    ) {
      console.log("asasasasasasas");
      this.setState({
        dselectedDays: [],
        from: null,
        to: null,
        enteredTo: null,
      });
    }
    else {
console.log("comeInCommercialElseCondition")
      // if(availabilityCheckData.reservedDaysforCommercial != undefined){
      //   console.log("SecondElseCondition")
      //   let pushReservedDay = [];
      //   nextProps.availabilityCheckData.reservedDaysforCommercial.length > 0 &&
      //     nextProps.availabilityCheckData.reservedDaysforCommercial.map((el) => {
      //       pushReservedDay.push(new Date(el));
      //     });
      //   let previousDates = this.getPreviousTodayDates();
      //   previousDates.map((val) => {
      //     pushReservedDay.push(val);
      //   });
      //   console.log("yyyyyyyyyyy");
      //   this.setState({
      //     dselectedDays: pushReservedDay,
      //   });
      // }

      if (
        nextProps.availabilityCheckData.bkFromDate === null &&
        nextProps.availabilityCheckData.bkToDate === null
      ) {
        console.log("wertyuio");
        this.setState({
          from: null,
          to: null,
          enteredTo: null,
        });
      }
      if ("reservedDays" in nextProps.availabilityCheckData) {
        let pushReservedDay = [];
        nextProps.availabilityCheckData.reservedDays.length > 0 &&
          nextProps.availabilityCheckData.reservedDays.map((el) => {
            pushReservedDay.push(new Date(el));
          });
        let previousDates = this.getPreviousTodayDates();
        previousDates.map((val) => {
          pushReservedDay.push(val);
        });
        console.log("yyyyyyyyyyy");
        this.setState({
          dselectedDays: pushReservedDay,
        });
      }

      if ("bkApplicationNumber" in nextProps.availabilityCheckData) {
        if (
          nextProps.availabilityCheckData.bkFromDate !== null &&
          nextProps.availabilityCheckData.bkToDate !== null
        ) {
          console.log("iiiiiiiii");
          this.setState(
            {
              from: new Date(nextProps.availabilityCheckData.bkFromDate),
              to: new Date(nextProps.availabilityCheckData.bkToDate),
              enteredTo: new Date(nextProps.availabilityCheckData.bkToDate),
            },
            console.log("qqqqtext--", this.state)
          );
        } else if (
          nextProps.availabilityCheckData.bkFromDate !== null &&
          nextProps.availabilityCheckData.bkToDate === null
        ) {
          console.log("ppppppppppp");
          this.setState(
            {
              from: new Date(nextProps.availabilityCheckData.bkFromDate),
              to: null,
              enteredTo: null,
            },
            console.log("ppppptext--", this.state)
          );
        } else {
          this.setState(this.getInitialState());
        }
      }
    }
  }

  getInitialState() {
    return {
      from: null,
      to: null,
      enteredTo: null,
    };
  }

  isSelectingFirstDay(from, to, day) {
    const { oldAvailabilityCheckData } = this.props;
    if (oldAvailabilityCheckData) {
      console.log(oldAvailabilityCheckData, "oldAvailabilityCheckDatalast");
      console.log(from, to, "Lastfromtodate");
      if (from && to) {
        console.log("GetBothDates");
        return true;
      } else if (from == null && to == null) {
        console.log("GetBothDatesAsNull");
        return true;
      } else if (to && from == null) {
        console.log("GetFromDateNUll");
        return true;
      } else {
        console.log("BothElse");
        return false;
      }
    } else {
      console.log("isSelectingFirstDay-", from, to, day);
      const isBeforeFirstDay = from && DateUtils.isDayBefore(day, from);
      console.log("isBeforeFirstDay-", isBeforeFirstDay);
      const isRangeSelected = from && to; //
      console.log("isRangeSelected-", isRangeSelected);
      console.log("FromDate-", from);
      console.log("ToDate-", to);
      console.log(
        "!from || isBeforeFirstDay || isRangeSelected--Return",
        !from || isBeforeFirstDay || isRangeSelected
      );
      let funRet = !from || isBeforeFirstDay || isRangeSelected;
      console.log("funRet-", funRet);
      if (funRet) {
        console.log(" true funRet");
        this.setState({
          CheckFromDateExist: true,
        });
      }
      if (!funRet) {
        console.log("!funRet");
        this.setState({
          CheckFromDateExist: false,
        });
      }
      return funRet;
    }
  }

  handleDayClick = (day, modifiers = {}) => {
    console.log("handleDayClick");
    const { oldAvailabilityCheckData } = this.props;
    const { from, to } = this.state;
    console.log("handleDayClick-of-to-", from, to);
    console.log("day-handleDayClick-", day ? day : "gggggg");
    if (from && to && day >= from && day <= to) {
      console.log("one--", from, to, day);
      this.handleResetClick();
      return;
    }
    if (this.isSelectingFirstDay(from, to, day)) {
      console.log("isSelectingFirstDay-", from, to, day);
      if (day >= new Date()) {
        //indatevenuechange come in this condition
        console.log("isSelectingFirstDay-if", day);
        this.props.prepareFinalObject("availabilityCheckData.bkFromDate", day);
        this.props.prepareFinalObject(
          //screenConfiguration.preparedFinalObject.oldAvailabilityCheckData.bkToDate
          "oldAvailabilityCheckData.bkToDate",
          null
        );
        this.setState({
          from: day,
          to: null,
          enteredTo: null,
        });
      } else {
        this.handleResetClick();
        console.log("handleResetClick-");
      }
    } else {
      console.log("third..");
      console.log("day-third", day);
      this.setState({
        to: day,
        enteredTo: day,
      });
      this.props.prepareFinalObject("availabilityCheckData.bkToDate", day);
      console.log("third..state--", this.state);
      this.checkRangeValidity();
    }
  };

  handleDayMouseEnter = (day) => {
    console.log("handleDayMouseEnter");
    const { from, to } = this.state;
    const { oldAvailabilityCheckData } = this.props;
    console.log("Mouse-functionProps-", oldAvailabilityCheckData);
    console.log("handleDayMouseEnter-from", from, to);
    console.log("handleDayMouseEnter-", day);
    if (!this.isSelectingFirstDay(from, to, day)) {
      console.log(this.isSelectingFirstDay(from, to, day));
      this.setState({
        enteredTo: day,
      });
      console.log("handleDayMouseEnter-entered", this.state.enteredTo);
    }
  };

  handleResetClick = () => {
    this.setState(this.getInitialState());
    this.props.prepareFinalObject("availabilityCheckData.bkToDate", null);
    this.props.prepareFinalObject("availabilityCheckData.bkFromDate", null);
  };

  checkRangeValidity() {
    let Range = {
      from: this.state.from,
      to: this.state.enteredTo,
    };
    for (let i = 0; i < this.state.dselectedDays.length; i++) {
      let bookedDate = this.state.dselectedDays[i];

      if (DateUtils.isDayInRange(bookedDate, Range)) {
        this.props.toggleSnackbarAndSetText(
          true,
          {
            labelName: "Selected Range Should Not Contain Reserved Date",
            labelKey: `Selected Range Should Not Contain Reserved Date`,
          },
          "warning"
        );
        this.handleResetClick();
      } else {
        //  this.props.showBookButton()
      }
    }
  }

  getPreviousTodayDates() {
    let date = new Date();
    var d = date.getDate();
    let m = date.getMonth();
    let y = date.getFullYear();
    var defaultDisabledDate = [];
    while (d > 1) {
      d = d - 1;
      let nd = new Date(y, m, d);

      defaultDisabledDate.push(nd);
    }
    return defaultDisabledDate;
  }

  render() {
    const { ChangeFromDate, ChangeToDate, resetDate,locality } = this.props;
    console.log("renderbookingprops--", this.props);

    let { from, to, enteredTo } = this.state;
    console.log("stateBooking--", this.state);
    if (resetDate && ChangeFromDate && ChangeToDate) {
      from = ChangeFromDate;
      to = ChangeToDate;
    }
    const modifiers = { start: from, end: enteredTo };
    console.log("modifiers--", modifiers);
    const disabledDays = { before: this.state.from };
    const selectedDays = [from, { from, to: enteredTo }];
    console.log("selectedDays--", selectedDays);
    const WEEK_DAY_LONG = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const DATAE = this.getPreviousTodayDates();
    const past = {
      value: DATAE.map((val) => {
        return new Date(val);
      }),
    };
    let data = new Date();
    let newData = new Date(data.setMonth(data.getMonth() + 5));
    console.log("newData-", newData);
    console.log(
      "this.render.state--",
      this.state.changeoldfromDate ? this.state.changeoldfromDate : "fghj"
    );
    return (
      <div style={{
        marginTop: "14%"    
      }}>      
      <div className="calendar-wrapper">
        <div className="calendar-section">
          {console.log(
            "oldFromDate-return-",
            this.state.changeoldfromDate
              ? this.state.changeoldfromDate
              : "nnnnn"
          )}
          <DayPicker
            className="Selectable"
            numberOfMonths={2}
            initialMonth={new Date()}
            disabledDays={this.state.dselectedDays}
            fromMonth={new Date()}
            toMonth={newData}
            modifiers={modifiers}
            weekdaysShort={WEEK_DAY_LONG}
            selectedDays={selectedDays}
            onDayClick={this.handleDayClick}
            onDayMouseEnter={this.handleDayMouseEnter}
          />
        </div>
        <div className="calendar-info">
          {/* <h2 className="calendar-info-title">
                        Select From &amp; To Date in Calendar{" "}
                    </h2> */}
          <div style={{ marginBottom: 12 }}>
            <span
              style={{
                display: "block",
                color: "rgba(0, 0, 0, 0.54)",
                fontSize: 12,
                fontWeight: 400,
                lineHeight: "1.375em",
              }}
            >
              Booking Venue
            </span>
            <span
              // bkVenue,oldFromDate,oldToDate

              style={{
                color: "rgba(0, 0, 0, 0.87)",
                fontSize: 16,
                fontWeight: 400,
                lineHeight: "19px",
                letterSpacing: "0.67px",
              }}
            >
              {" "}
              {locality === ""
                ? "------------"
                : locality}
            </span>
          </div>

          <div style={{ marginBottom: 12 }}>
            <span
              style={{
                display: "block",
                color: "rgba(0, 0, 0, 0.54)",
                fontSize: 12,
                fontWeight: 400,
                lineHeight: "1.375em",
              }}
            >
              From Date
            </span>
            <span
              style={{
                color: "rgba(0, 0, 0, 0.87)",
                fontSize: 16,
                fontWeight: 400,
                lineHeight: "19px",
                letterSpacing: "0.67px",
              }}
            >
              {console.log(
                "fromBeforeDisplay--",
                from ? from.toLocaleDateString() : from
              )}
              {!from ? "--/--/----" : from.toLocaleDateString()}
            </span>
          </div>
          <div style={{ marginBottom: 12 }}>
            <span
              style={{
                display: "block",
                color: "rgba(0, 0, 0, 0.54)",
                fontSize: 12,
                fontWeight: 400,
                lineHeight: "1.375em",
              }}
            >
              To Date
            </span>
            <span
              style={{
                color: "rgba(0, 0, 0, 0.87)",
                fontSize: 16,
                fontWeight: 400,
                lineHeight: "19px",
                letterSpacing: "0.67px",
              }}
            >
              {console.log("tobeforeDisplay--", to)}
              {!to ? "--/--/----" : to.toLocaleDateString()}
            </span>
          </div>
        </div>
      </div> 
      </div>                         /*end of 1 div*/
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    prepareFinalObject: (jsonPath, value) =>
      dispatch(prepareFinalObject(jsonPath, value)),
    changeRoute: (path) => dispatch(setRoute(path)),
    toggleSnackbarAndSetText: (open, message, error) =>
      dispatch(toggleSnackbarAndSetText(open, message, error)),
    showError: () =>
      dispatch(
        toggleSnackbar(
          true,
          {
            labelName: "Selected Range Should Not Contain Reserved Date",
            labelKey: "",
          },
          "warning"
        )
      ),
    showError2: () =>
      dispatch(
        toggleSnackbar(
          true,
          {
            labelName: "First Check Availability By Filling Above Form",
            labelKey: "",
          },
          "warning"
        )
      ),
    showError3: () =>
      dispatch(
        toggleSnackbar(
          true,
          {
            labelName: "Please select date greater then today",
            labelKey: "",
          },
          "warning"
        )
      ),
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
export default connect(mapStateToProps, mapDispatchToProps)(BookingCalendar);
