import React, { Component } from "react";
import { Tabs, Card, TextField, Icon, Button, TextArea } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";
import { connect } from "react-redux";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";

import "../index.css";
import FormControl from "@material-ui/core/FormControl";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { fetchApplicaionSector } from "egov-ui-kit/redux/bookings/actions";
import BookingMedia from "../../BookingMedia";
//import BookingCalendar from "../BookingCalendar"; //CommercialBookingCalendar
import BookingCalendar from "./reserveDates"
import CommercialBookingCalendar from "../../CommercialBookingCalendar";
import { httpRequest } from "egov-ui-kit/utils/api";
import get from "lodash/get";
import set from "lodash/set";
import BookingTimeSlot from "../../BookingTimeSlot";
import SelectedTimeSlotInfo from "../../SelectedTimeSlotInfo";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { withStyles } from "@material-ui/core/styles";
// import DayPicker, {
//   DateUtils,
// } from "../../../../contributed-modules/react-day-picker";

const styles = (theme) => ({
  cool: {
    "& .MuiFormControlLabel-label": {
      marginBottom: "0px",
    },
  },
  label: {
    marginBottom: "0px !important",
  },
});

class CheckAvailability extends Component {
  state = {
    NewbkBookingType: "Normal Booking",
    vanueType: "",
    oldBookingData: "",
    SetForCommercial: false,
    SetForParkComm: true,
    open: false,
    setOpen: false,
    showCalendar: false,
    calendarAfterImg: false,
    locality:
      this.props.oldBookingData != "notfound"
        ? this.props.oldBookingData.Sector
        : "",
    masterDataPCC: [],
    SectorArrayCommercial: [],
    availabilityCheckData: {
      bkSector: this.props.oldBookingData
        ? this.props.oldBookingData.Sector
        : "",
      bkBookingType: this.props.oldBookingData
        ? this.props.oldBookingData.bkBookingType
        : "Parks",
    },
    OldAvailabilityCheckData: { bkBookingType: "Parks" },
    MediaState: {
      bkSector: this.props.oldBookingData
        ? this.props.oldBookingData.Sector
        : "",
      bkBookingType: this.props.oldBookingData
        ? this.props.oldBookingData.bkBookingType
        : "",
    },
    setAllForCG: false,
    holdingremark: "",
    showHoldingRemark: false,
    submitButtonTriggered: false,
    holdingRemarkLength: 0
  };

  handleClose = () => {
    this.setState({
      setOpen: false,
    });
  };

  handleOpen = () => {
    this.setState({
      setOpen: true,
    });
  };
  handleChange = async (event) => {
    let { userInfo, prepareFinalObject } = this.props;
    // this.setState({ vanueType: event.target.value },this.SetDataParkCom());
    this.setState(
      { vanueType: event.target.value },
      prepareFinalObject("DropDownValue", event.target.value)
    );

    if (this.state.vanueType != undefined) {
      if (this.state.vanueType == "Commercial Ground") {
        // alert("Commercial Ground");
      } else if (
        this.state.vanueType === "Community Center" ||
        this.state.vanueType === "Parks"
      ) {
        // alert("park & community");
      }
    }
    this.setState({
      availabilityCheckData: { bkBookingType: event.target.value },
    });
  };


  newBookingType = async (event) => {
    let { prepareFinalObject } = this.props;
    this.setState(
      { NewbkBookingType: event.target.value });
    prepareFinalObject("NewbkBookingTypeNewReq", event.target.value)
  };

  getBetweenDays = function (start, end) {
    let arr = [];
    // let endDate = new Date(end);
    for (
      let dt = new Date(start);
      dt <= new Date(end);
      dt.setDate(dt.getDate() + 1)
    ) {
      arr.push(new Date(dt));
    }
    return arr;
  };

  getSectorDataFromAPI = async (availabilityCheck) => {

    let venueType = availabilityCheck.bkBookingType;

    let sector = availabilityCheck.bkSector.toUpperCase();

    let { userInfo } = this.props;
    let requestbody = {
      venueType: venueType,
      tenantId: userInfo.tenantId,
      sector: sector,
    };

    let sectorDataFromMaster = await httpRequest(
      "bookings/park/community/master/_fetch?",
      "_search",
      [],
      requestbody
    );

    this.setState({ masterDataPCC: sectorDataFromMaster.data });

  };
  //togetimage
  toGetOldImage = async (oldBookingData) => {

    let venueType = oldBookingData.bkBookingType;

    let sector = oldBookingData.Sector
      ? oldBookingData.Sector.toUpperCase()
      : "";

    let { userInfo } = this.props;
    let requestbody = {
      venueType: venueType,
      tenantId: userInfo.tenantId,
      sector: sector,
    };

    let sectorDataFromMaster = await httpRequest(
      "bookings/park/community/master/_fetch?",
      "_search",
      [],
      requestbody
    );

    this.setState({ masterDataPCC: sectorDataFromMaster.data });

  };

  //for parkCommunity and date/venue change Sector handling
  sectorHandleChange = (input) => (e) => {
    this.setState({ setAllForCG: false, showHoldingRemark: true });

    this.setState({ masterDataPCC: [] });
    let availabilityCheck = {
      bkSector: e.target.value,
      bkBookingType: this.state.vanueType,
    };

    this.setState({ availabilityCheckData: availabilityCheck });
    this.getSectorDataFromAPI(availabilityCheck);

    this.setState({ [input]: e.target.value });
  };

  //for commercial sector handling
  sectorHandleForCommercial = async (e) => {
    this.setState({ setAllForCG: true, showHoldingRemark: true });
    const { prepareFinalObject } = this.props;

    this.setState({ masterDataPCC: [] });


    let requestBody = {
      bookingType: "GROUND_FOR_COMMERCIAL_PURPOSE",
      bookingVenue: e.target.value,
    };
    let availabilityData = await httpRequest(
      "bookings/commercial/ground/availability/_search",
      "",
      [],
      requestBody
    );

    let data = availabilityData.data;

    let reservedDates = [];
    var daylist = [];
    data.map((dataitem) => {
      let start = dataitem.fromDate;
      let end = dataitem.toDate;
      daylist = this.getBetweenDays(start, end);
      daylist.map((v) => {
        reservedDates.push(v.toISOString().slice(0, 10));
      });
    });

    prepareFinalObject("availabilityCheckData.reservedDays", reservedDates);
    prepareFinalObject(
      "availabilityCheckData.reservedDaysforCommercial",
      reservedDates
    );


    prepareFinalObject(
      "availabilityCheckData.reservedDaysforCommercialTwo",
      reservedDates
    );

    let availabilityCheck = {
      bkSector: e.target.value,
      bkBookingType: this.state.vanueType,
    };

    this.setState({ availabilityCheckData: availabilityCheck });
    this.getSectorDataFromAPI(availabilityCheck);

    this.setState({ locality: e.target.value },
      prepareFinalObject(
        "CommercialEmpBooking.BookingVenue", e.target.value
      )
    );

    this.getCommercialCategoryData()
  };
  getCommercialCategoryData = async () => {

    const { userInfo, prepareFinalObject } = this.props

    let tenantId = userInfo.tenantId;
    let mdmsBody = {
      MdmsCriteria: {
        tenantId: tenantId,
        moduleDetails: [
          {
            moduleName: "tenant",
            masterDetails: [
              {
                name: "tenants",
              },
            ],
          },
          {
            moduleName: "Booking",
            masterDetails: [
              {
                name: "Com_Ground_Documents",
              },
              {
                name: "Commerical_Ground_Cat",
              },

            ],
          },
        ],
      },
    };
    let payload = null;
    payload = await httpRequest(
      "/egov-mdms-service/v1/_search",
      "_search",
      [],
      mdmsBody
    );

    prepareFinalObject("CommercialEmpBooking.CommercialEmplData", payload.MdmsRes);
    //MdmsRes.Booking.Commerical_Ground_Cat
    prepareFinalObject("CommercialEmpBooking.CommercialEmplCategory", payload.MdmsRes.Booking.Commerical_Ground_Cat);

  }

  componentDidMount = async () => {
    let {
      fetchApplicaionSector,
      oldBookingData,
      prepareFinalObject,
      userInfo,
    } = this.props;


    let PreBookingData = {
      bkSector: oldBookingData.Sector,
      bkBookingType: oldBookingData.bkBookingType,
    };
    //commercial api call
    let mdmsBody = {
      MdmsCriteria: {
        tenantId: userInfo.tenantId,
        moduleDetails: [
          {
            moduleName: "tenant",
            masterDetails: [
              {
                name: "tenants",
              },
            ],
          },
          {
            moduleName: "Booking",
            masterDetails: [
              {
                name: "Booking_Vanue",
              },
            ],
          },
        ],
      },
    };

    try {
      let payload = null;
      payload = await httpRequest(
        "/egov-mdms-service/v1/_search",
        "_search",
        [],
        mdmsBody
      );

      let MdmsResBookingSector = payload.MdmsRes.Booking.Booking_Vanue;
      let CommercialSector = [];

      MdmsResBookingSector.forEach((event) => {

        CommercialSector.push(event);

      });
      this.setState({
        SectorArrayCommercial: CommercialSector,
      });
    } catch (e) {
      console.log(e);
    }
    //commercial
    fetchApplicaionSector();
    this.setState({
      oldBookingData,
    });
    if (oldBookingData != "notfound") {

      this.toGetOldImage(oldBookingData);

      let requestBody = {
        tenantId: "ch.chandigarh",
        bookingType: oldBookingData.bkBookingType,
        bookingVenue: oldBookingData.bkBookingVenueID,
        sector: oldBookingData.Sector,
      };
      let availabilityData = await httpRequest(
        "/bookings/park/community/availability/_search",
        "_search",
        [],
        requestBody
      );


      let data = availabilityData.data;
      let reservedDates = [];
      var daylist = [];
      data.map((dataitem) => {
        let start = dataitem.fromDate;
        let end = dataitem.toDate;
        daylist = this.getBetweenDays(start, end);
        daylist.map((v) => {
          reservedDates.push(v.toISOString().slice(0, 10));
        });
      });

      prepareFinalObject("availabilityCheckData.reservedDays", reservedDates);

      prepareFinalObject("availabilityCheckData.reservedTimeSlotsData", data);

      this.setState({
        // locality : oldBookingData.Sector,
        // vanueType : oldBookingData.bkBookingType,
        OldAvailabilityCheckData: PreBookingData,
        showCalendar: true,
        // oldAvailabilityCheckData :oldBookingData.Sector
      });

      let requestbody = {
        venueType: oldBookingData.bkBookingType,
        tenantId: userInfo.tenantId,
        sector: oldBookingData.Sector,
      };

      let sectorDataFromMaster = await httpRequest(
        "bookings/park/community/master/_fetch?",
        "_search",
        [],
        requestbody
      );

      this.setState({ masterDataPCC: sectorDataFromMaster.data });

    }
  };

  callBackForResetCalender = () => {

   // window.location.href = "/egov-services/reservedates";
   this.props.history.push("/egov-services/reservedbookingdates");
  };

  convertEpochToDate = (dateEpoch) => {
    const dateFromApi = new Date(dateEpoch);
    let month = dateFromApi.getMonth() + 1;
    let day = dateFromApi.getDate();
    let year = dateFromApi.getFullYear();
    month = (month > 9 ? "" : "0") + month;
    day = (day > 9 ? "" : "0") + day;
    return `${year}-${month}-${day}`;
  };
  callBackForHoldDates = async (e) => {
    const { stateData } = this.props;
    console.log(stateData, "Nero stateData")
    let venueName = '';
    let holdDatesforSave = stateData.screenConfiguration.preparedFinalObject.availabilityCheckData.holdDatesForSave;
    let bookingPropertyType = stateData.screenConfiguration.preparedFinalObject.DropDownValue === "Commercial Ground" || stateData.screenConfiguration.preparedFinalObject.DropDownValue === "Community Center" ? stateData.screenConfiguration.preparedFinalObject.DropDownValue : "Parks";
    if (stateData.screenConfiguration.preparedFinalObject.DropDownValue !== "Commercial Ground") {
      venueName = stateData.screenConfiguration.preparedFinalObject.bkBookingData.id;
    } else {
      venueName = stateData.screenConfiguration.preparedFinalObject.CommercialEmpBooking.BookingVenue;
    }

    //let venueName = stateData.screenConfiguration.preparedFinalObject.availabilityCheckData.bkLocation;
    console.log(this.state.holdingremark.length, "Nero Hold Remark");
    this.setState({holdingRemarkLength: this.state.holdingremark.length})
    //ssconsole.log(holdDatesforSave.length, "Nero Holding Date")
    if (this.state.holdingremark.length < 1) {
      //console.log(holdDatesforSave && holdDatesforSave.length, "hjhjhjh");
      toggleSnackbarAndSetText(
        true,
        {
          labelName: "Select fill all the mandetory fields",
          labelKey: `BK_ERR_VALUE_HOLDING_DATES`
        },
        "error"
      );
     // return false;
    }
    const { prepareFinalObject } = this.props;

    let holdingDatesArray = [];
    if (holdDatesforSave && holdDatesforSave.length > 0) {
      for (let i = 0; i < holdDatesforSave.length; i++) {
        holdingDatesArray.push({
          fromDate: this.convertEpochToDate(holdDatesforSave[i]),
          toDate: this.convertEpochToDate(holdDatesforSave[i]),
          locked: true,
          holdingremark: this.state.holdingremark,
          bookingVenue: venueName,
          venueType: bookingPropertyType
        });
      }
    }

    let requestBody = { commercialGrndAvailabilityLock: holdingDatesArray }

    let apiResponse = await httpRequest(
      "bookings/commercial/ground/availability/_lock?",
      "_search",
      [],
      requestBody
    );
    if (apiResponse.status == "200") {
      //window.location.href = "/egov-services/reservedbookingdates";
      this.props.history.push(`/egov-services/reservedbookingdates`);
    }

  }
  calculateBetweenDaysCount = (startDate, endDate) => {
    const oneDay = 24 * 60 * 60 * 1000;
    const firstDate = new Date(startDate);
    const secondDate = new Date(endDate);

    const daysCount =
      Math.round(Math.abs((firstDate - secondDate) / oneDay)) + 1;
    return daysCount;
  };

  holdingRemarkChange = (e) => {

    this.setState({ holdingremark: e.target.value });
  }
  render() {
    const {
      firstName,
      email,
      mobileNo,
      lastName,
      stateData,
      handleChange,
      sImageUrl,
      applicationSector,
      complaintSector,
      bkVenue,
      oldFromDate,
      oldToDate,
      classes,
      oldBookingData,
      DropDownValue,
      NewBookToDate,
      NewBookFromDate
    } = this.props;

    let sectorData = [];
    let vanueData = this.props.stateData.screenConfiguration.preparedFinalObject
      .bkBookingData;


    sectorData.push(applicationSector);

    let arrayData = [];
    let witholDdATA = console.log("witholDdATA");

    let y = sectorData.forEach((item, index) => {
      if (item) {
        let finalValues = Object.values(item);
        finalValues.forEach((event) => {
          // console.log("event-cpage--", event);
          arrayData.push(event);
          // console.log("arrayData-cpage--", arrayData);
        });
      }
    });
    const hintTextStyle = {
      letterSpacing: "0.7px",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      width: "90%",
      overflow: "hidden",
    };
    const radioformControl = {
      marginBottom: "0px",
    };

    const stylr = {};

    const changeCalendar = () => {
      console.log("I am handlecalendar");
      this.setState(
        {
          showCalendar: true,
        },
        console.log("showCalendar--SettToTrue", this.state.showCalendar)
      );
    };
    const handleCalAfterImage = () => {
      this.setState({ calendarAfterImg: true });
    };

    return (
      <div>
        <div style={{ float: "left", width: "100%", padding: "36px 15px" }}>
          <div
            className="col-xs-12"
            style={{ background: "#fff", padding: "15px 0" }}
          >
            <div>
              <div style={{ paddingBottom: "5px", marginLeft: "15px" }}>
                {/* <Label
                  label="BK_MYBK_CHECK_AVAILABILITY"
                  labelClassName="dark-heading"
                /> */}
              </div>
              <div className="col-sm-6 col-xs-6">
                <FormControl component="fieldset">
                  <FormLabel component="legend">
                    <Label label="BK_MYBK_EMP_HOLD_DATES_TYPE" />
                  </FormLabel>
                  <RadioGroup
                    row
                    aria-label="position"
                    name="gender1"
                    value={this.state.vanueType}
                    onChange={this.handleChange}
                  >
                    <FormControlLabel
                      value="Community Center"
                      control={<Radio color="primary" />}
                      label="Community Center"
                      classes={classes.label}
                      labelPlacement="end"
                    />
                    <FormControlLabel
                      value="Parks"
                      control={<Radio color="primary" />}
                      label="Park"
                      classes={classes.label}
                      labelPlacement="end"
                    />
                    <FormControlLabel
                      value="Commercial Ground"
                      control={<Radio color="primary" />}
                      label="Commercial Ground"
                      classes={classes.label}
                      labelPlacement="end"
                    />
                  </RadioGroup>
                </FormControl>
              </div>
            </div>



            {/*condition rendering for Dropdown according to Booking Type*/}
            {this.props.DropDownValue != "notfound" &&
              this.props.DropDownValue === "Commercial Ground" ? (
                <div>
                  <div className="col-sm-6 col-xs-6">
                    {" "}
                    {/*for commercial selection*/}
                    {console.log("comeInCommercial")}
                    <FormControl style={{ width: "100%" }}>
                      <InputLabel
                        shrink
                        style={{ width: "100%" }}
                        id="demo-controlled-open-select-label"
                      >
                        <Label label="Booking Venue" />
                      </InputLabel>
                      <Select
                        maxWidth={false}
                        labelId="demo-controlled-open-select-label-Locality"
                        id="demo-controlled-open-select-locality"
                        open={this.state.SetOpen}
                        onClose={() => this.handleClose()}
                        onOpen={() => this.handleOpen()}
                        value={this.state.locality}
                        displayEmpty
                        // onChange={this.sectorHandleForCommercial()}
                        onChange={(e) => {
                          this.sectorHandleForCommercial(e);
                        }}
                      >
                        <MenuItem value="" disabled>
                          Booking Venue
                      </MenuItem>
                        {this.state.SectorArrayCommercial.map((child, index) => (
                          <MenuItem value={child.code}>{child.name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                </div>
              ) : (
                <div>
                  {console.log("comeInpark")}
                  <div className="col-sm-6 col-xs-6">
                    {" "}
                    {/*for park & community*/}
                    {console.log("comeInsecondPark")}
                    <FormControl style={{ width: "100%" }}>
                      <InputLabel
                        shrink
                        style={{ width: "100%" }}
                        id="demo-controlled-open-select-label"
                      >
                        <Label label="Locality" />
                      </InputLabel>
                      <Select
                        maxWidth={false}
                        labelId="demo-controlled-open-select-label-Locality"
                        id="demo-controlled-open-select-locality"
                        open={this.state.SetOpen}
                        onClose={() => this.handleClose()}
                        onOpen={() => this.handleOpen()}
                        value={this.state.locality}
                        displayEmpty
                        onChange={this.sectorHandleChange("locality")}
                      >
                        <MenuItem value="" disabled>
                          Locality
                      </MenuItem>
                        {arrayData.map((child, index) => (
                          <MenuItem value={child.code}>{child.name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                </div>
              )}

            {/* sector drop down for date/venue change */}
            {console.log(
              "this.state.oldBookingData--12345",
              this.state.oldBookingData
            )}


            {/*Import Booking Media for Commercial*/}
            {this.state.setAllForCG && this.state.vanueType === "Commercial Ground" &&
              this.state.locality ? (

                <div
                  className="col-sm-12 col-xs-12"

                >
                  <BookingCalendar
                    witholDdATA={"withNewData"}
                    masterDataPCC={this.state.masterDataPCC}
                    availabilityCheckData={this.state.availabilityCheckData}
                    bookingVenue={this.props && this.props.bookingVenue}
                    oldBookingData={this.state.oldBookingData}
                  /> </div>
              ) : (
                ""
              )}


            {/*for old availbility check Import Image*/}
            {this.state.availabilityCheckData &&
              this.state.availabilityCheckData.bkSector && this.state.setAllForCG === false ? (
                <BookingMedia
                  changeCalendar={changeCalendar}
                  handleCalAfterImage={handleCalAfterImage}
                  one={"withBookingMediaNew"}
                  masterDataPCC={this.state.masterDataPCC}
                  availabilityCheckData={this.state.availabilityCheckData}
                  pacc_image_initial_path={sImageUrl && sImageUrl[0].Value}
                />
              ) : ""}




            {this.state.availabilityCheckData &&
              this.state.availabilityCheckData.bkSector && !this.state.setAllForCG &&
              vanueData != undefined &&
              vanueData.bookingAllowedFor == "" &&
              this.state.showCalendar &&
              this.state.calendarAfterImg && (
                <BookingCalendar
                  witholDdATA={"withNewData"}
                  masterDataPCC={this.state.masterDataPCC}
                  availabilityCheckData={this.state.availabilityCheckData}
                  bookingVenue={this.props && this.props.bookingVenue}
                  oldBookingData={this.state.oldBookingData}
                />
              )}

            {/*Button Code For Submit And Reset*/}
            {this.state && this.state.showHoldingRemark ?
              <div style={{ marginBottom: "50px" }}>
                <Label label="Reason for locking dates" />
                <TextArea
                  isRequired={true}
                  value={this.state.holdingremark}
                  onChange={this.holdingRemarkChange}
                  hintText="BK_MYBK_DATE_LOCK_REMARK"

                /> </div> : ""
            }

            {this.state && this.state.submitButtonTriggered && this.state.holdingRemarkLength < 1 ?
              <div style={{ marginBottom: "50px" }}>
                <Label style={{color: "red"}}label="Fill all mandetory fields then proceed" />
                </div> : ""
            }
            {/*start of book button for commercil*/}
            {this.state.setAllForCG && this.state.vanueType === "Commercial Ground" &&
              this.state.locality && (
                <div
                  className="col-sm-12 col-xs-12"
                  style={{ textAlign: "right" }}
                >
                  <Button
                    className="responsive-action-button"
                    primary={true}
                    label={
                      <Label
                        buttonLabel={true}
                        label="BK_MYBK_EMP_CANCEL_BUTTON"
                      />
                    }
                    fullWidth={true}
                    onClick={this.callBackForResetCalender}
                    style={{ marginRight: 18 }}
                    startIcon={<ArrowForwardIosIcon />}
                  />
                  <Button
                    className="responsive-action-button"
                    primary={true}
                    label={
                      <Label buttonLabel={true} label="BK_PARK_HOLD_DATES" />
                    }
                    fullWidth={true}
                    onClick={this.callBackForHoldDates}
                    startIcon={<ArrowForwardIosIcon />}
                  />
                </div>
              )}
            {/*end of book button for commercil*/}

            {this.state.setAllForCG === false && this.state.availabilityCheckData &&
              this.state.availabilityCheckData.bkSector &&
              vanueData != undefined && (
                <div
                  className="col-sm-12 col-xs-12"
                  style={{ textAlign: "right" }}
                >
                  <Button
                    className="responsive-action-button"
                    primary={true}
                    label={
                      <Label
                        buttonLabel={true}
                        label="BK_MYBK_EMP_CANCEL_BUTTON"
                      />
                    }
                    fullWidth={true}
                    onClick={this.callBackForResetCalender}
                    style={{ marginRight: 18 }}
                    startIcon={<ArrowForwardIosIcon />}
                  />
                  <Button
                    className="responsive-action-button"
                    primary={true}
                    label={
                      <Label buttonLabel={true} label="BK_PARK_HOLD_DATES" />
                    }
                    fullWidth={true}
                    onClick={this.callBackForHoldDates}
                    startIcon={<ArrowForwardIosIcon />}
                  />
                </div>
              )}

            {/*</Footer>*/}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { bookings, common, auth, form } = state;
  let stateData = state;
  const { complaintSector, sImageUrl, applicationSector } = bookings;
  var BothDateSame;
  var bookingVenueData =
    state &&
    state.screenConfiguration.preparedFinalObject.availabilityCheckData;  //bkLocation

  let bookingVenue =
    bookingVenueData && bookingVenueData.bkLocation
      ? bookingVenueData.bkLocation
      : "NotFound";

  const { userInfo } = state.auth;
  let bkVenue = state.screenConfiguration.preparedFinalObject
    .oldAvailabilityCheckData
    ? state.screenConfiguration.preparedFinalObject.oldAvailabilityCheckData
      .bkBookingVenue
    : "notfound";


  let oldFromDate = state.screenConfiguration.preparedFinalObject
    .oldAvailabilityCheckData
    ? state.screenConfiguration.preparedFinalObject.oldAvailabilityCheckData
      .bkFromDate
    : "notfound";


  let oldToDate = state.screenConfiguration.preparedFinalObject
    .oldAvailabilityCheckData
    ? state.screenConfiguration.preparedFinalObject.oldAvailabilityCheckData
      .bkToDate
    : "notfound";


  let oldBookingData = state.screenConfiguration.preparedFinalObject
    .oldAvailabilityCheckData
    ? state.screenConfiguration.preparedFinalObject.oldAvailabilityCheckData
    : "notfound";


  let DropDownValue = state.screenConfiguration.preparedFinalObject
    .DropDownValue
    ? state.screenConfiguration.preparedFinalObject.DropDownValue
    : "notfound";

  let NewBookFromDate = state.screenConfiguration.preparedFinalObject.availabilityCheckData && state.screenConfiguration.preparedFinalObject.availabilityCheckData.bkFromDate || "notFound"


  let NewBookToDate = state.screenConfiguration.preparedFinalObject.availabilityCheckData && state.screenConfiguration.preparedFinalObject.availabilityCheckData.bkToDate || "notFound"


  if (NewBookFromDate != "notFound" && NewBookToDate != "notFound") {

    let d1 = new Date(NewBookFromDate)
    let d2 = new Date(NewBookToDate)
    if (d1.getTime() === d2.getTime()) {
      BothDateSame = "BothDateSame"

    }
    else {
      console.log("BothDateSame-Second", BothDateSame)
    }
  }

  let AppStatus = state.screenConfiguration.preparedFinalObject.PreviousBookingData && state.screenConfiguration.preparedFinalObject.PreviousBookingData.ApplicationStatus || "notFound"


  let AgainNewFromDate = state.screenConfiguration.preparedFinalObject.PreviousBookingData && state.screenConfiguration.preparedFinalObject.PreviousBookingData.NewBookingFromDate || "notFound"


  let AgainNewToDate = state.screenConfiguration.preparedFinalObject.PreviousBookingData && state.screenConfiguration.preparedFinalObject.PreviousBookingData.NewBookingToDate || "notFound"


  let PrevFromDate = state.screenConfiguration.preparedFinalObject.PreviousBookingData && state.screenConfiguration.preparedFinalObject.PreviousBookingData.FromDate || "notFound"


  let PrevToDate = state.screenConfiguration.preparedFinalObject.PreviousBookingData && state.screenConfiguration.preparedFinalObject.PreviousBookingData.ToDate || "notFound"




  return {
    userInfo, NewBookFromDate, NewBookToDate, AppStatus, AgainNewFromDate, AgainNewFromDate, PrevFromDate, PrevToDate,
    DropDownValue, BothDateSame,
    complaintSector,
    bookingVenue,
    stateData,
    sImageUrl,
    applicationSector,
    bkVenue,
    oldFromDate,
    oldToDate,
    oldBookingData,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    toggleSnackbarAndSetText: (open, message, error) =>
      dispatch(toggleSnackbarAndSetText(open, message, error)),
    fetchApplicaionSector: () => dispatch(fetchApplicaionSector()),
    prepareFinalObject: (jsonPath, value) =>
      dispatch(prepareFinalObject(jsonPath, value)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(CheckAvailability));
