import React, { Component } from 'react';
import { Tabs, Card, TextField, Icon, Button } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";
import { connect } from "react-redux";
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import Grid from '@material-ui/core/Grid';
import Footer from "../../../../modules/footer"
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
 import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';
import "./index.css"; 
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { withStyles } from "@material-ui/core/styles";

const styles= theme=>({

  cool: {
   lebel :{
      marginBottom: 0
    }
  },
})

class ApplicatInfo extends Component {

  state = {
    NewbkBookingType: "Normal Booking"
  }

  componentDidMount = async () => {


  }

  continue = e => {
    let re = /\S+@\S+\.\S+/;
    let mb=/^\d{10}$/;
    let fname = /^[a-zA-Z'-]+$/;
    e.preventDefault();
    if(this.props.email==""||this.props.mobileNo==""||this.props.firstName==""||this.props.FatherName==""){
      this.props.toggleSnackbarAndSetText(
        true,
        {
          labelName: "Error_Message_For_Water_tanker_Application",
          labelKey: `BK_ERROR_MESSAGE_FOR_WATER_TANKER_APPLICATION`
        },
        "warning"
      );
    }
    else if(!re.test(this.props.email)){
      this.props.toggleSnackbarAndSetText(
        true,
        {
          labelName: "Please enter valid email address",
          labelKey: `BK_ERROR_MESSAGE_EMAIL_VALIDATION`
        },
        "warning"
      );
    }else if(!mb.test(this.props.mobileNo)){
      this.props.toggleSnackbarAndSetText(
        true,
        {
          labelName: "Please enter valid mobile number",
          labelKey: `BK_ERROR_MESSAGE_FOR_MOBILE_VALIDATION`
        },
        "warning"
      );

    }
    else{this.props.nextStep();}
    
  }
  onCitizenNameChange = e => {

  }

  newBookingType = async (event) => {
    let { prepareFinalObject } = this.props;
    this.setState(
      { NewbkBookingType: event.target.value }); 
      prepareFinalObject("NewbkBookingTypeApplicant", event.target.value)
  };

  render() {
    const { firstName, email, mobileNo, FatherName,completeAddress, handleChange,discountType,handleChangeDiscount,classes,prepareFinalObject} = this.props;
    const hintTextStyle = {
      letterSpacing: "0.7px",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      width: "90%",
      overflow: "hidden"
    };
    return (
      <div style={{float: 'left', width: '100%', padding: '36px 15px' }}>
      <div className="col-xs-12" style={{background:'#fff', padding: '15px 0'}}>
     {/*applicant Name*/}
      <div className="col-sm-6 col-xs-6">       
          <TextField
            id="name"
            name="name"
            type="text"
            value={firstName}
            pattern="[A-Za-z]"
            required = {true}
            hintText={
              <Label
                label="BK_MYBK_NAME_CITIZEN_PLACEHOLDER"
                color="rgba(0, 0, 0, 0.3799999952316284)"
                fontSize={16}
                labelStyle={hintTextStyle}
              />
            }
            floatingLabelText={
              <Label
                key={0}
                label="BK_MYBK_CREATE_CITIZEN_NAME"
                color="rgba(0,0,0,0.60)"
                fontSize="12px"
              />
            }
            onChange={handleChange('firstName')}
            underlineStyle={{ bottom: 7 }}
            underlineFocusStyle={{ bottom: 7 }}
            hintStyle={{ width: "100%" }}
          />
        </div>
       {/*Father Name*/}
       <div className="col-sm-6 col-xs-6">
          <TextField
            id="Father's Name"
            name="Father's Name"
            type="string"
            value={FatherName}
            required = {true}
            hintText={
              <Label
                label="BK_CGB_FATHERNAME_PLACEHOLDER"
                color="rgba(0, 0, 0, 0.3799999952316284)"
                fontSize={16}
                labelStyle={hintTextStyle}
              />
            }
            floatingLabelText={
              <Label
                key={0}
                label="BK_CGB_FATHERNAME_PLACEHOLDER"
                color="rgba(0,0,0,0.60)"
                fontSize="12px"
              />
            }
            onChange={handleChange('FatherName')}
            underlineStyle={{ bottom: 7 }}
            underlineFocusStyle={{ bottom: 7 }}
            hintStyle={{ width: "100%" }}
          />       
        </div>
        {/*applicant email*/}
        <div className="col-sm-6 col-xs-6">
          <TextField
            id="email"
            name="email"
            type="string"
            value={email}
            required = {true}
            hintText={
              <Label
                label="BK_MYBK_CITIZEN_EMAIL_PLACEHOLDER"
                color="rgba(0, 0, 0, 0.3799999952316284)"
                fontSize={16}
                labelStyle={hintTextStyle}
              />
            }
            floatingLabelText={
              <Label
                key={0}
                label="BK_MYBK_CREATE_CITIZEN_EMAIL"
                color="rgba(0,0,0,0.60)"
                fontSize="12px"
              />
            }
            onChange={handleChange('email')}
            underlineStyle={{ bottom: 7 }}
            underlineFocusStyle={{ bottom: 7 }}
            hintStyle={{ width: "100%" }}
          />       
        </div>
        {/*Applicant Mobile Number*/}
        <div className="col-sm-6 col-xs-6">
          <TextField
            id="mobile-no"
            name="mobile-no"
            type="text"
            value={mobileNo}
            required = {true}
            hintText={
              <Label
                label="BK_MYBK_CITIZEN_MOBILENO_PLACEHOLDER"
                color="rgba(0, 0, 0, 0.3799999952316284)"
                fontSize={16}
                labelStyle={hintTextStyle}
              />
            }
            floatingLabelText={
              <Label
                key={0}
                label="BK_MYBK_CREATE_CITIZEN_MOBILENO"
                color="rgba(0,0,0,0.60)"
                fontSize="12px"
              />
            }
            onChange={handleChange('mobileNo')}
            underlineStyle={{ bottom: 7 }}
            underlineFocusStyle={{ bottom: 7 }}
            hintStyle={{ width: "100%" }}
          />
        
        </div>    
        {/*Complete Address*/}
        <div className="col-sm-6 col-xs-6">
            <TextField
              id="completeAddress"
              name="completeAddress"
              type="text"
              value={completeAddress}
              required = {true}
              hintText={
                <Label
                  label="BK_CGB_COMPLETE_ADDRESS_PLACEHOLDER"
                  color="rgba(0, 0, 0, 0.3799999952316284)"
                  fontSize={16}
                  labelStyle={hintTextStyle}
                />
              }
              floatingLabelText={
                <Label
                  key={0}
                  label="BK_CGB_COMPLETE_ADDRESS_PLACEHOLDER"
                  color="rgba(0,0,0,0.60)"
                  fontSize="12px"
                />
              }
              onChange={handleChange('completeAddress')}
              underlineStyle={{ bottom: 7 }}
              underlineFocusStyle={{ bottom: 7 }}
              hintStyle={{ width: "100%" }}
            />
          </div>
       
      <Footer className="apply-wizard-footer" style={{ display: 'flex', justifyContent: 'flex-end' }} children={
      <div className="col-sm-12 col-xs-12" style={{textAlign: 'right'}}>
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
  const { complaints, common, auth, form } = state;
  return {
    state
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
)(withStyles(styles)(ApplicatInfo)))
