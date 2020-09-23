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
import { fetchApplicaionSector } from "../../../../redux/bookings/actions";
import "./index.css";
import Footer from "../../../../modules/footer"

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
// import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';



class BookingsDetails extends Component {
  state = {
    open: false, setOpen: false,
    value: 'Park'
  }
  handleChangeRadio = (event) => {
    console.log('event.target.value', event.target.value)

  };
  componentDidMount = async () => {
    let { fetchApplicaionSector } = this.props;
    fetchApplicaionSector();
  }
  continue = e => {
    e.preventDefault();
    const { jobTitle, jobCompany, toggleSnackbarAndSetText, utGST, GSTnumber, jobLocation, handleChange, facilitationCharges, approverName, dimension, location, cleaningCharges, comment, houseNo, rent, purpose, surcharge, cGST, locality, type, residenials,fromDate,toDate } = this.props;
//|| purpose == "" || locality == "" || residenials == "" || dimension == "" || location == "" || cleaningCharges == "" || rent == "" || facilitationCharges == "" || surcharge == "" || utGST == "" || cGST== "" || GSTnumber == "" || type == ""||fromDate==""||toDate==""
    if (houseNo == "") {

      toggleSnackbarAndSetText(
        true,
        {
          labelName: "Error_Message_For_Water_tanker_Application",
          labelKey: `BK_Error_Message_For_Water_tanker_Application`
        },
        "warning"
      );
    } else if (fromDate > this.state.toDate) {
      toggleSnackbarAndSetText(
        true,
        {
          labelName: "From_Date_Is_Greater_Than_To_Date",
          labelKey: `From_Date_Is_Greater_Than_To_Date`
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
 
 
  render() {
    const { jobTitle, jobCompany, jobLocation, complaintSector,surcharge,fromDate,toDate,onFromDateChange,onToDateChange, utGST,cGST, GSTnumber, handleChange, dimension, location, facilitationCharges, cleaningCharges, rent, approverName, comment, houseNo, type, purpose, locality, residenials } = this.props;
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
              id="houseNo"
              name="houseNo"
              type="text"

              value={houseNo}
              hintText={
                <Label
                  label="BK_MYBK_CITIZEN_HOUSE_NUMBER_PLACEHOLDER"
                  color="rgba(0, 0, 0, 0.3799999952316284)"
                  fontSize={16}
                  labelStyle={hintTextStyle}
                />
              }
              floatingLabelText={
                <Label
                  key={0}
                  label="BK_MYBK_CREATE_HOUSE_NUMBER"
                  color="rgba(0,0,0,0.60)"
                  fontSize="12px"
                />
              }
              onChange={handleChange('houseNo')}
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
              value={location}
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
              id="type"
              name="type"
              type="text"
              value={type}
              hintText={
                <Label
                  label="BK_MYBK_TYPE_PLACEHOLDER"
                  color="rgba(0, 0, 0, 0.3799999952316284)"
                  fontSize={16}
                  labelStyle={hintTextStyle}
                />
              }
              floatingLabelText={
                <Label
                  key={0}
                  label="BK_MYBK_CREATE_TYPE"
                  color="rgba(0,0,0,0.60)"
                  fontSize="12px"
                />
              }
              onChange={handleChange('type')}
              underlineStyle={{ bottom: 7 }}
              underlineFocusStyle={{ bottom: 7 }}
              hintStyle={{ width: "100%" }}
            />
          </div>
     
             
             <div className="col-sm-6 col-xs-6">
                  <TextField
                    id="from-Date"
                    name="from-Date"
                    value={fromDate}
                    hintText={
                      <Label
                        color="rgba(0, 0, 0, 0.3799999952316284)"
                        fontSize={16}
                        labelStyle={hintTextStyle}
                      />
                    }
                    floatingLabelText={
                      <Label
                        key={1}
                        label="From Date"
                        color="rgba(0,0,0,0.60)"
                        fontSize="12px"
                      />
                    }
                    onChange={onFromDateChange}
                    underlineStyle={{bottom: 7,borderBottom: "1px solid #e0e0e0"}}
                    underlineFocusStyle={{bottom: 7,borderBottom: "1px solid #e0e0e0"}}
                    hintStyle={{ width: "100%" }}
                    type="date"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </div>
                <div className="col-sm-6 col-xs-6">
                  <TextField
                    id="to-date"
                    name="to-date"
                    value={toDate}
                    hintText={
                      <Label
                        color="rgba(0, 0, 0, 0.3799999952316284)"
                        fontSize={16}
                        labelStyle={hintTextStyle}
                      />
                    }
                    floatingLabelText={
                      <Label
                        key={1}
                        label="To Date"
                        color="rgba(0,0,0,0.60)"
                        fontSize="12px"
                      />
                    }
                    onChange={onToDateChange}
                    underlineStyle={{
                      bottom: 7,
                      borderBottom: "1px solid #e0e0e0"
                    }}
                    underlineFocusStyle={{
                      bottom: 7,
                      borderBottom: "1px solid #e0e0e0"
                    }}
                    hintStyle={{ width: "100%" }}
                    type="date"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </div>
            
          <div className="col-sm-6 col-xs-6">
            <TextField
              id="dimension"
              name="dimension"
              type="text"

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

          <div className="col-sm-6 col-xs-6">
            <FormControl style={{ width: '100%' }}>
              <InputLabel shrink style={{ width: '100%' }} id="demo-controlled-open-select-label">Locality</InputLabel>
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

          </div>

          <div className="col-sm-6 col-xs-6">
            <FormControl style={{ width: '100%' }}>
              <InputLabel shrink style={{ width: '100%' }} id="demo-controlled-open-select-label">Residentials/Commercials</InputLabel>
              <Select
                maxWidth={false}
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
