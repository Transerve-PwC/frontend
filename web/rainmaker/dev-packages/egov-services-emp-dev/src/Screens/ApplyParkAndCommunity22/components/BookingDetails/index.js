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
import { fetchApplicaionSector } from "egov-ui-kit/redux/bookings/actions";
import "./index.css";
import Footer from "../../../../modules/footer"

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
// import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
// import { RadioButton } from '../RadioButton'

class BookingsDetails extends Component {
  state = {
    open: false, setOpen: false,
    genderValue: "female"
  }


  componentDidMount = async () => {
    let { fetchApplicaionSector } = this.props;
    fetchApplicaionSector();
  }
  continue = e => {
    e.preventDefault();
    const {jobTitle, jobCompany, toggleSnackbarAndSetText, utGST, GSTnumber, jobLocation, handleChange, facilitationCharges, approverName, dimension, location, cleaningCharges, comment, houseNo, rent, purpose, surcharge, cGST, locality, type, residenials, fromDate, toDate } = this.props;
    //|| purpose == "" || locality == "" || residenials == "" || dimension == "" || location == "" || cleaningCharges == "" || rent == "" || facilitationCharges == "" || surcharge == "" || utGST == "" || cGST== "" || GSTnumber == "" || type == ""||fromDate==""||toDate==""
    if (purpose == "" || facilitationCharges == "" || residenials == "") {

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
    console.log('event.target.value gnser',event.target.value)
    this.setState({ genderValue: event.target.value });
  };

  options = [
    {
      value: "Not a valid application",
      label: <Label label="ES_REASSIGN_OPTION_ONE" />
    },
    {
      value: "Out of operational scope",
      label: <Label label="ES_REJECT_OPTION_TWO" />
    },
    { value: "Operation already underway", label: <Label label="ES_REJECT_OPTION_THREE" /> },
    { value: "Other", label: <Label label="ES_REJECT_OPTION_FOUR" /> }
  ];
  render() {
    const { jobTitle, jobCompany, jobLocation, handleChangeDiscount,discountType,dimension, complaintSector, fromDate, surcharge, toDate, onFromDateChange, onToDateChange, utGST, cGST, GSTnumber, handleChange, location, facilitationCharges, cleaningCharges, rent, approverName, comment, houseNo, type, purpose, locality, residenials } = this.props;
    // let dimension="Wed Sep 23 2020 12:00:00 GMT+0530 (India Standard Time)"
    console.log(' in booking rent in', rent)
    let sectorData = [];
    sectorData.push(complaintSector);

    let arrayData = [];

    let y = sectorData.forEach((item, index) => {
      let finalValues = Object.values(item);
      finalValues.forEach((event) => {
        arrayData.push(event);
      })
    })

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
              id="purpose"
              name="purpose"
              type="text"
              required = {true}
              value={purpose}
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
              id="location"
              name="location"
              type="text"
              required = {true}
              value={location}
              disabled
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
                  label="BK_MYBK_CREATE_LOCATION"
                  color="rgba(0,0,0,0.60)"
                  fontSize="12px"
                />
              }
              onChange={handleChange('location')}
              underlineStyle={{ bottom: 7 }}
              underlineFocusStyle={{ bottom: 7 }}
              hintStyle={{ width: "100%" }}
            />
          </div>
          <div className="col-sm-6 col-xs-6">
            <TextField
              id="cleaningCharges"
              name="cleaningCharges"
              type="text"
              required = {true}
              value={cleaningCharges}
              hintText={
                <Label
                  label="BK_MYBK_CLEANING_CHARGES_PLACEHOLDER"
                  color="rgba(0, 0, 0, 0.3799999952316284)"
                  fontSize={16}
                  labelStyle={hintTextStyle}
                />
              }
              floatingLabelText={
                <Label
                  key={0}
                  label="BK_MYBK_CREATE_CLEANING_CHARGES"
                  color="rgba(0,0,0,0.60)"
                  fontSize="12px"
                />
              }
              onChange={handleChange('cleaningCharges')}
              underlineStyle={{ bottom: 7 }}
              underlineFocusStyle={{ bottom: 7 }}
              hintStyle={{ width: "100%" }}
            />
          </div>
          <div className="col-sm-6 col-xs-6">
            <TextField
              id="rent"
              name="rent"
              type="text"
              required = {true}
              value={rent}
              hintText={
                <Label
                  label="BK_MYBK_RENT_PLACEHOLDER"
                  color="rgba(0, 0, 0, 0.3799999952316284)"
                  fontSize={16}
                  labelStyle={hintTextStyle}
                />
              }
              floatingLabelText={
                <Label
                  key={0}
                  label="BK_MYBK_CREATE_RENT"
                  color="rgba(0,0,0,0.60)"
                  fontSize="12px"
                />
              }
              onChange={handleChange('rent')}
              underlineStyle={{ bottom: 7 }}
              underlineFocusStyle={{ bottom: 7 }}
              hintStyle={{ width: "100%" }}
            />
          </div>
          <div className="col-sm-6 col-xs-6">
            <TextField
              id="facilitationCharges"
              name="facilitationCharges"
              type="text"
              required = {true}
              value={facilitationCharges}
              hintText={
                <Label
                  label="BK_MYBK_FACILITATION_CHARGES_PLACEHOLDER"
                  color="rgba(0, 0, 0, 0.3799999952316284)"
                  fontSize={16}
                  labelStyle={hintTextStyle}
                />
              }
              floatingLabelText={
                <Label
                  key={0}
                  label="BK_MYBK_CREATE_FCHARGES"
                  color="rgba(0,0,0,0.60)"
                  fontSize="12px"
                />
              }
              onChange={handleChange('facilitationCharges')}
              underlineStyle={{ bottom: 7 }}
              underlineFocusStyle={{ bottom: 7 }}
              hintStyle={{ width: "100%" }}
            />
          </div>
          <div className="col-sm-6 col-xs-6">
            <TextField
              id="surcharge"
              name="surcharge"
              type="text"
              required = {true}
              value={surcharge}
              hintText={
                <Label
                  label="BK_MYBK_NAME_SURCHARGE_PLACEHOLDER"
                  color="rgba(0, 0, 0, 0.3799999952316284)"
                  fontSize={16}
                  labelStyle={hintTextStyle}
                />
              }
              floatingLabelText={
                <Label
                  key={0}
                  label="BK_MYBK_CREATE_SURCHARGE"
                  color="rgba(0,0,0,0.60)"
                  fontSize="12px"
                />
              }
              onChange={handleChange('surcharge')}
              underlineStyle={{ bottom: 7 }}
              underlineFocusStyle={{ bottom: 7 }}
              hintStyle={{ width: "100%" }}
            />
          </div>
          <div className="col-sm-6 col-xs-6">
            <TextField
              id="utGST"
              name="utGST"
              type="text"
              required = {true}
              value={utGST}
              hintText={
                <Label
                  label="BK_MYBK_UTGST_PLACEHOLDER"
                  color="rgba(0, 0, 0, 0.3799999952316284)"
                  fontSize={16}
                  labelStyle={hintTextStyle}
                />
              }
              floatingLabelText={
                <Label
                  key={0}
                  label="BK_MYBK_CREATE_UTGST"
                  color="rgba(0,0,0,0.60)"
                  fontSize="12px"
                />
              }
              onChange={handleChange('utGST')}
              underlineStyle={{ bottom: 7 }}
              underlineFocusStyle={{ bottom: 7 }}
              hintStyle={{ width: "100%" }}
            />
          </div>
          <div className="col-sm-6 col-xs-6">
            <TextField
              id="cGST"
              name="cGST"
              type="text"
              required = {true}
              value={cGST}
              hintText={
                <Label
                  label="BK_MYBK_CGST_PLACEHOLDER"
                  color="rgba(0, 0, 0, 0.3799999952316284)"
                  fontSize={16}
                  labelStyle={hintTextStyle}
                />
              }
              floatingLabelText={
                <Label
                  key={0}
                  label="BK_MYBK_CREATE_CGST"
                  color="rgba(0,0,0,0.60)"
                  fontSize="12px"
                />
              }
              onChange={handleChange('cGST')}
              underlineStyle={{ bottom: 7 }}
              underlineFocusStyle={{ bottom: 7 }}
              hintStyle={{ width: "100%" }}
            />
          </div>
          <div className="col-sm-6 col-xs-6">
            <TextField
              id="GSTnumber"
              name="GSTnumber"
              type="text"
              // required = {true}
              value={GSTnumber}
              hintText={
                <Label
                  label="BK_MYBK_NAME_GSTNUMBER_PLACEHOLDER"
                  color="rgba(0, 0, 0, 0.3799999952316284)"
                  fontSize={16}
                  labelStyle={hintTextStyle}
                />
              }
              floatingLabelText={
                <Label
                  key={0}
                  label="BK_MYBK_CREATE_GSTNUMBER"
                  color="rgba(0,0,0,0.60)"
                  fontSize="12px"
                />
              }
              onChange={handleChange('GSTnumber')}
              underlineStyle={{ bottom: 7 }}
              underlineFocusStyle={{ bottom: 7 }}
              hintStyle={{ width: "100%" }}
            />
          </div>
       
         <div className="col-sm-6 col-xs-6">
            <TextField
              id="locality"
              name="locality"
              type="text"
              required = {true}
              value={locality}
              hintText={
                <Label
                  label="BK_MYBK_SETCOR_PLACEHOLDER"
                  color="rgba(0, 0, 0, 0.3799999952316284)"
                  fontSize={16}
                  labelStyle={hintTextStyle}
                />
              }
              floatingLabelText={
                <Label
                  key={0}
                  label="BK_MYBK_SETCOR_PLACEHOLDER"
                  color="rgba(0,0,0,0.60)"
                  fontSize="12px"
                />
              }
              onChange={handleChange('locality')}
              underlineStyle={{ bottom: 7 }}
              underlineFocusStyle={{ bottom: 7 }}
              hintStyle={{ width: "100%" }}
            />
          </div> 


          <div className="col-sm-6 col-xs-6">
          
            <TextField
            id="from-Date"
            name="from-Date"
            type="text"
            required = {true}
            value={fromDate}
            disabled={true}
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
            onChange={handleChange('toDate')}
            underlineStyle={{ bottom: 7 }}
            underlineFocusStyle={{ bottom: 7 }}
            hintStyle={{ width: "100%" }}
          />
          </div>
          <div className="col-sm-6 col-xs-6">
            <TextField
              id="to-date"
              name="to-date"
              type="text"
              required = {true}
              value={toDate}
              disabled={true}
              hintText={
                <Label
                  label="BK_TO_DATE"
                  color="rgba(0, 0, 0, 0.3799999952316284)"
                  fontSize={16}
                  labelStyle={hintTextStyle}
                />
              }
              floatingLabelText={
                <Label
                  key={0}
                  label="BK_TO_DATE"
                  color="rgba(0,0,0,0.60)"
                  fontSize="12px"
                />
              }
              onChange={handleChange('toDate')}
              underlineStyle={{ bottom: 7 }}
              underlineFocusStyle={{ bottom: 7 }}
              hintStyle={{ width: "100%" }}
            />
          </div>
          <div className="col-sm-6 col-xs-6">
            <TextField
              id="dimension"
              name="dimension"
              type="text"
              required = {true}
              value={dimension}
              hintText={
                <Label
                  label="BK_MYBK_DIMENSION_PLACEHOLDER"
                  color="rgba(0, 0, 0, 0.3799999952316284)"
                  fontSize={16}
                  labelStyle={hintTextStyle}
                />
              }
              floatingLabelText={
                <Label
                  key={0}
                  label="BK_MYBK_CREATE_DIMENSION_AREA"
                  color="rgba(0,0,0,0.60)"
                  fontSize="12px"
                />
              }
              onChange={handleChange('dimension')}
              underlineStyle={{ bottom: 7 }}
              underlineFocusStyle={{ bottom: 7 }}
              hintStyle={{ width: "100%" }}
            />
          </div>

          {/* <div style={{marginTop:'10px'}}className="col-sm-6 col-xs-6">
            <FormControl style={{ width: '100%' }}>
              <InputLabel shrink style={{ width: '100%' }} id="demo-controlled-open-select-label"><Label label="BK_MYBK_LOCALITY" /></InputLabel>
              <Select
                maxWidth={false}
                labelId="demo-controlled-open-select-label-Locality"
                id="demo-controlled-open-select-locality"
                open={this.state.SetOpen}
                onClose={() => this.handleClose()}
                onOpen={() => this.handleOpen()}
                value={locality}
                displayEmpty
                onChange={handleChange('locality')}
              >
                {arrayData.map((child, index) => (
                  <MenuItem value={child.name}>{child.name}</MenuItem>
                ))}

              </Select>
            </FormControl>

          </div> */}

          <div className="col-sm-6 col-xs-6">
            <FormControl style={{ width: '100%' }}>
              <InputLabel shrink style={{ width: '100%' }} id="demo-controlled-open-select-label"><Label  
                  required = {true}   
                  label="BK_MYBK_NORMAL_RESIDENTIAL"
                /></InputLabel>
              <Select
                maxWidth={false}
                required = {true}
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
          </div>
{/* 
          <div className="col-sm-6 col-xs-6" style={{marginTop: '19px'}}>
            <FormControl component="fieldset">
              <FormLabel component="legend"><Label label="BK_MYBK_CATEGORY_TYPE" /></FormLabel>
              <RadioGroup row aria-label="position" name="gender1" value={discountType} onChange={handleChangeDiscount}>
                <FormControlLabel value="General" control={<Radio color="primary" />} label="General" />
                <FormControlLabel value="100%" control={<Radio color="primary" />} label="Discount 100%" />
                <FormControlLabel value="50%" control={<Radio color="primary" />} label="Discount 50%" />
                <FormControlLabel value="20%" control={<Radio color="primary" />} label="Discount 20%" />
                <FormControlLabel value="KirayaBhog" control={<Radio color="primary" />} label="Kiraya/Bhog" />
                <FormControlLabel value="ReligiousFunction" control={<Radio color="primary" />} label="Religious Function" />
              </RadioGroup>
            </FormControl>
          </div> */}
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
  const { bookings, common, auth, form } = state;
  const { complaintSector } = bookings;

  return {
    complaintSector
  }
}
const mapDispatchToProps = dispatch => {
  return {
    toggleSnackbarAndSetText: (open, message, error) =>
      dispatch(toggleSnackbarAndSetText(open, message, error)),
    fetchApplicaionSector: criteria => dispatch(fetchApplicaionSector(criteria)),
  }
}


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BookingsDetails);
