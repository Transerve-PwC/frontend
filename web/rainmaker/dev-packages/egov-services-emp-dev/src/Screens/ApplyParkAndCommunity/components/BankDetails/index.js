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
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
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
    e.preventDefault();
    const { BankAccountName, NomineeName, BankAccountNumber, toggleSnackbarAndSetText,IFSCCode,AccountHolderName, handleChange,accountType,AccountType,classes,prepareFinalObject } = this.props;
    if (BankAccountName == "" || NomineeName == "" || BankAccountNumber == "" || IFSCCode == "" || AccountHolderName == "") {


      toggleSnackbarAndSetText(
        true,
        {
          labelName: "Error_Message_For_Water_tanker_Application",
          labelKey: `BK_ERROR_MESSAGE_FOR_ALL_FILLED_REQUIRED`
        },
        "warning"
      );
    } 
    else {
      this.props.nextStep();
    }
  }
  onCitizenNameChange = e => {

  }
  back = e => {
    e.preventDefault();
    this.props.prevStep();
  }

  newBookingType = async (event) => {
    let { prepareFinalObject } = this.props;
    this.setState(
      { NewbkBookingType: event.target.value }); 
      prepareFinalObject("NewbkBookingTypeApplicant", event.target.value)
  };

  render() {
    const { BankAccountName, NomineeName, BankAccountNumber, IFSCCode,AccountHolderName, handleChange,accountType,AccountType,classes,prepareFinalObject} = this.props;
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
     
      <div className="col-sm-6 col-xs-6">       
          <TextField
            id="Bank Account Name"
            name="Bank Account Name"
            type="text"
            value={BankAccountName}
            pattern="[A-Za-z]"
            required = {true}
            hintText={
              <Label
                label="Bank Name"// label="BK_MYBK_Bank_Account_Name"
                color="rgba(0, 0, 0, 0.3799999952316284)"
                fontSize={16}
                labelStyle={hintTextStyle}
              />
            }
            floatingLabelText={
              <Label
                key={0}
                label="Bank Name"
                color="rgba(0,0,0,0.60)"
                fontSize="12px"
              />
            }
            onChange={handleChange('BankAccountName')}
            underlineStyle={{ bottom: 7 }}
            underlineFocusStyle={{ bottom: 7 }}
            hintStyle={{ width: "100%" }}
          />
        </div>
        
        <div className="col-sm-6 col-xs-6">
          <TextField
            id="Nominee Name"
            name="Nominee Name"
            type="string"
            value={NomineeName}
            required = {true}
            hintText={
              <Label
              label="Nominee Name"    // label="BK_MYBK_Nominee_Name"
                color="rgba(0, 0, 0, 0.3799999952316284)"
                fontSize={16}
                labelStyle={hintTextStyle}
              />
            }
            floatingLabelText={
              <Label
                key={0}
                label="Nominee Name"
                color="rgba(0,0,0,0.60)"
                fontSize="12px"
              />
            }
            onChange={handleChange('NomineeName')}
            underlineStyle={{ bottom: 7 }}
            underlineFocusStyle={{ bottom: 7 }}
            hintStyle={{ width: "100%" }}
          />
        
        </div>
        
        <div className="col-sm-6 col-xs-6">
          <TextField
            id="Bank Account Number"
            name="Bank Account Number"
            type="text"
            value={BankAccountNumber}
            required = {true}
            hintText={
              <Label
              label="Bank Account Number" // label="BK_MYBK_Bank_Account_Number"
                color="rgba(0, 0, 0, 0.3799999952316284)"
                fontSize={16}
                labelStyle={hintTextStyle}
              />
            }
            floatingLabelText={
              <Label
                key={0}
                label="Bank Account Number"
                color="rgba(0,0,0,0.60)"
                fontSize="12px"
              />
            }
            onChange={handleChange('BankAccountNumber')}
            underlineStyle={{ bottom: 7 }}
            underlineFocusStyle={{ bottom: 7 }}
            hintStyle={{ width: "100%" }}
          />
        
        </div>    

        <div className="col-sm-6 col-xs-6">
            <TextField
              id="IFSC Code"
              name="IFSC Code"
              type="text"
              value={IFSCCode}
              required = {true}
              hintText={
                <Label
                label="IFSC Code" // label="BK_MYBK_IFSCCode"
                  color="rgba(0, 0, 0, 0.3799999952316284)"
                  fontSize={16}
                  labelStyle={hintTextStyle}
                />
              }
              floatingLabelText={
                <Label
                  key={0}
                  label="IFSC Code"
                  color="rgba(0,0,0,0.60)"
                  fontSize="12px"
                />
              }
              onChange={handleChange('IFSCCode')}
              underlineStyle={{ bottom: 7 }}
              underlineFocusStyle={{ bottom: 7 }}
              hintStyle={{ width: "100%" }}
            />
          </div>

          <div className="col-sm-6 col-xs-6">
            <TextField
              id="Account Holder Name"
              name="Account Holder Name"
              type="text"
              value={AccountHolderName}
              required = {true}
              hintText={
                <Label
                label="Account Holder Name"// label="BK_MYBK_AccountHolderName"
                  color="rgba(0, 0, 0, 0.3799999952316284)"
                  fontSize={16}
                  labelStyle={hintTextStyle}
                />
              }
              floatingLabelText={
                <Label
                  key={0}
                  label="Account Holder Name"
                  color="rgba(0,0,0,0.60)"
                  fontSize="12px"
                />
              }
              onChange={handleChange('AccountHolderName')}
              underlineStyle={{ bottom: 7 }}
              underlineFocusStyle={{ bottom: 7 }}
              hintStyle={{ width: "100%" }}
            />
          </div>

          {/*newRequirement*/} 
          <div className="col-sm-12" style={{marginTop: '19px'}}> 
            <FormControl component="fieldset">  {/*label="BK_MYBK_BankAccount_Type"*/}
              <FormLabel component="legend"><Label label="Bank Account Type" /></FormLabel>
              <RadioGroup row aria-label="position" name="gender1"  value={accountType} onChange={AccountType}>
                <FormControlLabel className={classes.cool} value="Saving" control={<Radio color="primary" />} label="Saving" />
                <FormControlLabel className={classes.cool} value="Current"  control={<Radio color="primary" />} label="Current" />
            </RadioGroup>
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
