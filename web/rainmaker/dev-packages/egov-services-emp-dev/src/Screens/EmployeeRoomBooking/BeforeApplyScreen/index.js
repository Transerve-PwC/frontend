import React, { Component } from "react";
import { Card, Image, Icon, Button,TextField } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import isEmpty from "lodash/isEmpty";
import "./index.css";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { httpRequest } from "egov-ui-kit/utils/api";
import { connect } from "react-redux";
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";

class CheckApplication extends Component {



  state = {
    ApplicationNumber: ""
  }

  CheckApplicationNo = async (event) => {
    let { prepareFinalObject } = this.props;
    this.setState(
      { ApplicationNumber: event.target.value }); 
      prepareFinalObject("RoomBookingData.ApplicationNumber", event.target.value)

      
  };

  ApplyRoomBooking = async (event) => {
    console.log("comeinegov-services/Employee/ApplyRoomBooking")
    this.props.history.push(`/egov-services/Employee/ApplyRoomBooking`);
};
  
Reset = async (event) => {
    let { prepareFinalObject } = this.props;
    this.setState(
      { ApplicationNumber:""},
      prepareFinalObject("RoomBookingData.ApplicationNumber",this.state.ApplicationNumber)
      );
     
  };

  render() {
    let { ApplicationNumber} = this.state
let {DataForRoomBooking} = this.props

    const hintTextStyle = {
      letterSpacing: "0.7px",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      width: "90%",
      overflow: "hidden"
    };

    return (
      <div>
        <div style={{float: 'left', width: '100%', padding: '36px 15px' }}>
      <div className="col-xs-12" style={{background:'#fff', padding: '15px 0'}}>
       

      <div className="col-sm-6 col-xs-6">       
          <TextField
            id="CCBookingType"
            name="CCBookingType"
            type="text"
            value={DataForRoomBooking.bookingsModelList[0].bkBookingType}
            pattern="[A-Za-z]"
            required = {true}
            hintText={
              <Label
                label="BK_MYBK_CC_RB_BOOKINGTYPE"
                color="rgba(0, 0, 0, 0.3799999952316284)"
                fontSize={16}
                labelStyle={hintTextStyle}
              />
            }
            floatingLabelText={
              <Label
                key={0}
                label="BK_MYBK_CC_RB_BOOKINGTYPE"
                color="rgba(0,0,0,0.60)"
                fontSize="12px"
              />
            }
            onChange={(e) => this.CheckApplicationNo(e)}
            underlineStyle={{ bottom: 7 }}
            underlineFocusStyle={{ bottom: 7 }}
            hintStyle={{ width: "100%" }}
          />
        </div>

        <div className="col-sm-6 col-xs-6">       
          <TextField
            id="CCSector"
            name="CCSector"
            type="text"
            value={DataForRoomBooking.bookingsModelList[0].bkSector}
            pattern="[A-Za-z]"
            required = {true}
            hintText={
              <Label
                label="BK_MYBK_APPLICANT_SECTOR_FOR_PARK"
                color="rgba(0, 0, 0, 0.3799999952316284)"
                fontSize={16}
                labelStyle={hintTextStyle}
              />
            }
            floatingLabelText={
              <Label
                key={0}
                label="BK_MYBK_APPLICANT_SECTOR_FOR_PARK"
                color="rgba(0,0,0,0.60)"
                fontSize="12px"
              />
            }
            onChange={(e) => this.CheckApplicationNo(e)}
            underlineStyle={{ bottom: 7 }}
            underlineFocusStyle={{ bottom: 7 }}
            hintStyle={{ width: "100%" }}
          />
        </div>

        <div className="col-sm-6 col-xs-6">       
          <TextField
            id="NameOfApplicant"
            name="NameOfApplicant"
            type="text"
            value={DataForRoomBooking.bookingsModelList[0].bkApplicantName}
            pattern="[A-Za-z]"
            required = {true}
            hintText={
              <Label
                label="BK_MYBK_APPLICANT_NAME"
                color="rgba(0, 0, 0, 0.3799999952316284)"
                fontSize={16}
                labelStyle={hintTextStyle}
              />
            }
            floatingLabelText={
              <Label
                key={0}
                label="BK_MYBK_APPLICANT_NAME"
                color="rgba(0,0,0,0.60)"
                fontSize="12px"
              />
            }
            onChange={(e) => this.CheckApplicationNo(e)}
            underlineStyle={{ bottom: 7 }}
            underlineFocusStyle={{ bottom: 7 }}
            hintStyle={{ width: "100%" }}
          />
        </div>

        <div className="col-sm-6 col-xs-6">       
          <TextField
            id="BookingPurpose"
            name="BookingPurpose"
            type="text"
            value={DataForRoomBooking.bookingsModelList[0].bkBookingPurpose}
            pattern="[A-Za-z]"
            required = {true}
            hintText={
              <Label
                label="BK_MYBK_NAME_PURPOSE_PLACEHOLDER"
                color="rgba(0, 0, 0, 0.3799999952316284)"
                fontSize={16}
                labelStyle={hintTextStyle}
              />
            }
            floatingLabelText={
              <Label
                key={0}
                label="BK_MYBK_NAME_PURPOSE_PLACEHOLDER"
                color="rgba(0,0,0,0.60)"
                fontSize="12px"
              />
            }
            onChange={(e) => this.CheckApplicationNo(e)}
            underlineStyle={{ bottom: 7 }}
            underlineFocusStyle={{ bottom: 7 }}
            hintStyle={{ width: "100%" }}
          />
        </div>
        <div className="col-sm-6 col-xs-6">       
          <TextField
            id="VenueNameLocation"
            name="VenueNameLocation"
            type="text"
            value={DataForRoomBooking.bookingsModelList[0].bkLocation}
            pattern="[A-Za-z]"
            required = {true}
            hintText={
              <Label
                label="BK_MYBK_NAME_LOCATION_PLACEHOLDER"
                color="rgba(0, 0, 0, 0.3799999952316284)"
                fontSize={16}
                labelStyle={hintTextStyle}
              />
            }
            floatingLabelText={
              <Label
                key={0}
                label="BK_MYBK_NAME_LOCATION_PLACEHOLDER"
                color="rgba(0,0,0,0.60)"
                fontSize="12px"
              />
            }
            onChange={(e) => this.CheckApplicationNo(e)}
            underlineStyle={{ bottom: 7 }}
            underlineFocusStyle={{ bottom: 7 }}
            hintStyle={{ width: "100%" }}
          />
        </div>
        <div className="col-sm-6 col-xs-6">       
          <TextField
            id="fromdate"
            name="fromdate"
            type="text"
            value={DataForRoomBooking.bookingsModelList[0].bkFromDate}
            pattern="[A-Za-z]"
            required = {true}
            hintText={
              <Label
                label="BK_From_Date"
                color="rgba(0, 0, 0, 0.3799999952316284)"
                fontSize={16}
                labelStyle={hintTextStyle}
              />
            }
            floatingLabelText={
              <Label
                key={0}
                label="BK_From_Date"
                color="rgba(0,0,0,0.60)"
                fontSize="12px"
              />
            }
            onChange={(e) => this.CheckApplicationNo(e)}
            underlineStyle={{ bottom: 7 }}
            underlineFocusStyle={{ bottom: 7 }}
            hintStyle={{ width: "100%" }}
          />
        </div>
        <div className="col-sm-6 col-xs-6">       
          <TextField
            id="todate"
            name="todate"
            type="text"
            value={DataForRoomBooking.bookingsModelList[0].bkToDate}
            pattern="[A-Za-z]"
            required = {true}
            hintText={
              <Label
                label="BK_MY_BK_ROOM_TO_DATE"
                color="rgba(0, 0, 0, 0.3799999952316284)"
                fontSize={16}
                labelStyle={hintTextStyle}
              />
            }
            floatingLabelText={
              <Label
                key={0}
                label="BK_MY_BK_ROOM_TO_DATE"
                color="rgba(0,0,0,0.60)"
                fontSize="12px"
              />
            }
            onChange={(e) => this.CheckApplicationNo(e)}
            underlineStyle={{ bottom: 7 }}
            underlineFocusStyle={{ bottom: 7 }}
            hintStyle={{ width: "100%" }}
          />
        </div>

                    <Button
                     className="responsive-action-button"
                      label={<Label buttonLabel={true} label="Book Room" />}
                      fullWidth={true}
                      primary={true}
                      style={{ float: 'right', marginRight: '50px', marginTop: '40px' }}
                      onClick={(e) => this.ApplyRoomBooking(e)
           } />

        </div>
        
        </div>
        </div>
    );
  }
}

const mapStateToProps = state => {
  const { complaints, common, auth, form } = state;
  const { userInfo } = state.auth;

  let DataForRoomBooking = state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.RoomBookingData : "NA"


  return {
    state,userInfo,DataForRoomBooking
  }
}
const mapDispatchToProps = dispatch => {
  return {
      toggleSnackbarAndSetText: (open, message, error) =>
      dispatch(toggleSnackbarAndSetText(open, message, error)),
      prepareFinalObject: (jsonPath, value) =>
      dispatch(prepareFinalObject(jsonPath, value)),
  }
}

export default (connect(
  mapStateToProps,
  mapDispatchToProps
)(CheckApplication))