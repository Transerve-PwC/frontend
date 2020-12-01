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

  continue = e => {
    let re = /\S+@\S+\.\S+/;
    let mb=/^\d{10}$/;
    let fname = /^[a-zA-Z'-]+$/;
    e.preventDefault();
    if(this.props.email==""||this.props.mobileNo==""||this.props.houseNo==""){
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

  render() {
    const { firstName, email, mobileNo, lastName,houseNo, handleChange,discountType,handleChangeDiscount,classes,prepareFinalObject } = this.props;

    prepareFinalObject("MNumToCreateCitizen", mobileNo);

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

        <div className="col-sm-6 col-xs-6">
            <TextField
              id="houseNo"
              name="houseNo"
              type="text"
              value={houseNo}
              required = {true}
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
  {/*"col-sm-6 col-xs-6"*/}
          <div className="col-sm-12" style={{marginTop: '19px'}}>
            <FormControl component="fieldset">
              <FormLabel component="legend"><Label label="BK_MYBK_CATEGORY_TYPE" /></FormLabel>
              <RadioGroup row aria-label="position" name="gender1" value={discountType} onChange={handleChangeDiscount}>
                <FormControlLabel className={classes.cool} value="General" control={<Radio color="primary" />} label="General" />
                <FormControlLabel className={classes.cool} value="100%"  control={<Radio color="primary" />} label="Discount 100%" />
                <FormControlLabel className={classes.cool} value="50%" control={<Radio color="primary" />} label="Discount 50%"/>
                <FormControlLabel className={classes.cool} value="20%" control={<Radio color="primary"/>} label="Discount 20%"/>
                <FormControlLabel className={classes.cool} value="KirayaBhog" control={<Radio color="primary" />} label="Kiraya/Bhog" />
                <FormControlLabel className={classes.cool} value="ReligiousFunction" control={<Radio color="primary" />} label="Religious Function" />
            </RadioGroup>
            </FormControl>
            
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
