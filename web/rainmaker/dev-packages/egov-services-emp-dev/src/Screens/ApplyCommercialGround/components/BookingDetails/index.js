import React, { Component } from 'react';
import { Tabs, Card, TextField, Icon, Button } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";
import { connect } from "react-redux";
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { fetchApplicaionSector, fetchfacilationCharges } from "egov-ui-kit/redux/bookings/actions";
import "./index.css";
import Footer from "../../../../modules/footer"
import moment from 'moment';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import FormLabel from '@material-ui/core/FormLabel';


class BookingsDetails extends Component {
  state = {
    open: false, setOpen: false,
    genderValue: "female"
  }


  componentDidMount = async () => {
    let { fetchApplicaionSector } = this.props;
    fetchApplicaionSector();
    this.props.fetchfacilationCharges();

  }
  continue = e => {
    e.preventDefault();
    const { jobTitle, jobCompany, toggleSnackbarAndSetText, utGST, GSTnumber, jobLocation, handleChange, facilitationCharges, approverName, dimension, location, cleaningCharges, comment, houseNo, rent, purpose, surcharge, cGST, locality, type, residenials, fromDate, toDate } = this.props;
    if (purpose == "" || residenials == "") {


      toggleSnackbarAndSetText(
        true,
        {
          labelName: "Error_Message_For_Water_tanker_Application",
          labelKey: `BK_ERROR_MESSAGE_FOR_ALL_FILLED_REQUIRED`
        },
        "warning"
      );
    } else if (fromDate > this.state.toDate) {
      toggleSnackbarAndSetText(
        true,
        {
          labelName: "From_Date_Is_Greater_Than_To_Date",
          labelKey: `BK_FROM_DATE_SHOULSD_GREATER_THAN_TO_DATE`
        },
        "warning"
      );
    }
    else {
      this.props.nextStep();
    }
  }

  back = e => {
    e.preventDefault();
    this.props.prevStep();
  }
  handleClose = () => {
    this.setState({
      setOpen: false
    })
  };

  handleOpen = () => {
    this.setState({
      setOpen: true
    })
  };
  handleChangeDiscount = (event) => {
   
    this.setState({ genderValue: event.target.value });
  };

 
  render() {
    const { arrayName, result,fCharges, jobTitle, jobCompany, jobLocation, handleChangeDiscount, discountType, dimension, complaintSector, fromDate, surcharge, toDate, onFromDateChange, onToDateChange, utGST, cGST, GSTnumber, handleChange, location, facilitationCharges, cleaningCharges, rent, approverName, comment, houseNo, type, purpose, locality, residenials, facilationChargesSuccess 
      ,cgToDate,cgFromDate,cgBookingVenue,cgCategoryType,cgCategory
    } = this.props;

    let StrfromDate = moment(cgFromDate).format("YYYY-MM-DD");
    let strtoDate  = moment(cgToDate).format("YYYY-MM-DD");

    const hintTextStyle = {
      letterSpacing: "0.7px",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      width: "90%",
      overflow: "hidden"
    };
    return (

      <div style={{ float: 'left', width: '100%', padding: '36px 15px' }}>
        <div className="col-xs-12" style={{ background: '#fff', padding: '15px 0' }}>


          <div className="col-sm-6 col-xs-6">
            <TextField
              id="fromdate"
              name="fromdate"
              type="text"
              value={StrfromDate}
              required={true}
              hintText={
                <Label
                  label="BK_MYBK_fromdate"
                  color="rgba(0, 0, 0, 0.3799999952316284)"
                  fontSize={16}
                  labelStyle={hintTextStyle}
                />
              }
              floatingLabelText={
                <Label
                  key={0}
                  label="BK_MYBK_CREATE_PURPOSE"
                  color="rgba(0,0,0,0.60)"
                  fontSize="12px"
                />
              }
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
  value={strtoDate}
  required={true}
  disabled
  hintText={
    <Label
      label="BK_CGB_TO_DATE_PLACEHOLDER"
      color="rgba(0, 0, 0, 0.3799999952316284)"
      fontSize={16}
      labelStyle={hintTextStyle}
    />
  }
  floatingLabelText={
    <Label
      key={0}
      label="BK_CGB_TO_DATE_PLACEHOLDER"
      color="rgba(0,0,0,0.60)"
      fontSize="12px"
    />
  }
  underlineStyle={{ bottom: 7 }}
  underlineFocusStyle={{ bottom: 7 }}
  hintStyle={{ width: "100%" }}
/>
</div>
       
          <div className="col-sm-6 col-xs-6">
            <TextField
              id="cgBookingVenue"
              name="cgBookingVenue"
              type="text"
              value={cgBookingVenue}
              required={true}
              hintText={
                <Label
                  label="BK_CGB_BOOKING_VENUE_LABEL"
                  color="rgba(0, 0, 0, 0.3799999952316284)"
                  fontSize={16}
                  labelStyle={hintTextStyle}
                />
              }
              floatingLabelText={
                <Label
                  key={0}
                  label="BK_CGB_BOOKING_VENUE_LABEL"
                  color="rgba(0,0,0,0.60)"
                  fontSize="12px"
                />
              }
              underlineStyle={{ bottom: 7 }}
              underlineFocusStyle={{ bottom: 7 }}
              hintStyle={{ width: "100%" }}
            />
          </div>
         
          <div className="col-sm-6 col-xs-6">
            <TextField
              id="purpose"
              name="purpose"
              type="text"
              value={purpose}
              required={true}
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
                  label="BK_MYBK_CREATE_PURPOSE"
                  color="rgba(0,0,0,0.60)"
                  fontSize="12px"
                />
              }
              onChange={handleChange('purpose')}
              underlineStyle={{ bottom: 7 }}
              underlineFocusStyle={{ bottom: 7 }}
              hintStyle={{ width: "100%" }}
            />
          </div>


          <div className="col-sm-6 col-xs-6">
            <TextField
              id="cgCategoryType"
              name="cgCategoryType"
              type="text"
              value={"ABC"}
              required={true}
              hintText={
                <Label
                  label="BK_CGB_CATEGORY_LABEL"
                  color="rgba(0, 0, 0, 0.3799999952316284)"
                  fontSize={16}
                  labelStyle={hintTextStyle}
                />
              }
              floatingLabelText={
                <Label
                  key={0}
                  label="BK_CGB_CATEGORY_LABEL"
                  color="rgba(0,0,0,0.60)"
                  fontSize="12px"
                />
              }
              onChange={handleChange('cgCategoryType')}
              underlineStyle={{ bottom: 7 }}
              underlineFocusStyle={{ bottom: 7 }}
              hintStyle={{ width: "100%" }}
            />
          </div>
          {/* <div className="col-sm-6 col-xs-6">
            <FormControl style={{ width: '100%' }}>
              <InputLabel shrink style={{ width: '100%' }} id="demo-controlled-open-select-label"><Label
                required={true}
                label="BK_MYBK_NORMAL_RESIDENTIAL"
              /></InputLabel>
              <Select
                maxWidth={false}
                required={true}
                labelId="demo-controlled-open-select-label"
                id="demo-controlled-open-select"
                open={this.state.SetOpen}
                displayEmpty
                onClose={() => this.handleClose()}
                onOpen={() => this.handleOpen()}
                value={residenials}
                onChange={handleChange('residenials')}
              >
                <MenuItem value="" disabled>Normal/Residential</MenuItem>
                <MenuItem value='Nomal'>Nomal</MenuItem>
                <MenuItem value='Residential'>Residential</MenuItem>
              </Select>
            </FormControl>
          </div> */}
                <div className="col-sm-6 col-xs-6">
                  {console.log("comeInCommercial")}
                  <FormControl style={{ width: "100%" }}>
                    <InputLabel
                     required={true}
                      shrink
                      style={{ width: "100%" }}
                      id="demo-controlled-open-select-label"
                    >
                      <Label label="Booking Category" />
                    </InputLabel>
                    <Select
                      maxWidth={false}
                      labelId="demo-controlled-open-select-label-Locality"
                      id="demo-controlled-open-select-locality"
                      open={this.state.SetOpen}
                      onClose={() => this.handleClose()}
                      onOpen={() => this.handleOpen()}
                      value={cgCategoryType}
                      displayEmpty
                      // onChange={this.sectorHandleForCommercial()}
                      onChange={handleChange('cgCategoryType')}
                    >
                      <MenuItem value="" disabled>
                        Booking Category
                      </MenuItem>
                      {cgCategory.map((child, index) => (
                        <MenuItem value={child.code}>{child.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>

         
          <Footer className="apply-wizard-footer" style={{ display: 'flex', justifyContent: 'flex-end' }} children={
            <div className="col-sm-12 col-xs-12" style={{ textAlign: 'right' }}>
              <Button
                className="responsive-action-button"
                primary={true}
                label={<Label buttonLabel={true} label="BK_CORE_COMMON_GOBACK" />}
                fullWidth={true}
                onClick={this.back}
                style={{ marginRight: 18 }}
                startIcon={<ArrowBackIosIcon />}
              />
              <Button
                className="responsive-action-button"
                primary={true}
                label={<Label buttonLabel={true} label="BK_CORE_COMMON_GONEXT" />}
                fullWidth={true}
                onClick={this.continue}
                startIcon={<ArrowForwardIosIcon />}
              />
            </div>
          }></Footer>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => {
  const { complaints, common, auth, form, bookings } = state;
  const { complaintSector } = complaints;
  const { facilationChargesSuccess, arrayName } = bookings;
  let cgFromDate = state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.availabilityCheckData.bkFromDate:"two"
  console.log("cgFromDate--",cgFromDate)
  let cgToDate = state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.availabilityCheckData.bkToDate:"two"
  console.log("cgToDate--",cgToDate)
  let cgBookingVenue = state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.CommercialEmpBooking.BookingVenue:"two"
  console.log("cgBooking--",cgBookingVenue)
  let cgCategory = state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.CommercialEmpBooking.CommercialEmplCategory:"two"
  console.log("cgCategory--",cgCategory)
  
  return {
    complaintSector,cgToDate,cgFromDate,cgBookingVenue,cgCategory,
    facilationChargesSuccess
  }
}
const mapDispatchToProps = dispatch => {
  return {
    toggleSnackbarAndSetText: (open, message, error) =>
      dispatch(toggleSnackbarAndSetText(open, message, error)),
    fetchApplicaionSector: criteria => dispatch(fetchApplicaionSector(criteria)),
    fetchfacilationCharges: () => dispatch(fetchfacilationCharges()),
    
  }
}


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BookingsDetails);
