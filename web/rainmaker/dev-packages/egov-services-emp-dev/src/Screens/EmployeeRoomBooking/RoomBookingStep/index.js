import React, { Component } from 'react';
import { Tabs, Card, TextField, Icon, Button } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";
import { connect } from "react-redux";
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import Grid from '@material-ui/core/Grid';
import Footer from "../../../modules/footer"
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
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
const styles= theme=>({


  cool: {
   lebel :{
      marginBottom: 0
    }
  },
})

class ApplicatInfo extends Component {

  state = {
    NewbkBookingType: "Normal Booking",
    open: false, setOpen: false,
    ReasonForDiscount : "",
      isCheckedOne: true,
      isCheckedTwo: false,
      isCheckedThree: false,
    
  }

  componentDidMount = async () => {


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

  back = e => {
    e.preventDefault();
    this.props.prevStep();
  }

  continue = e => {
    let re = /\S+@\S+\.\S+/;
    let mb=/^\d{10}$/;
    let fname = /^[a-zA-Z'-]+$/;
    e.preventDefault();
    // if(this.props.email==""||this.props.mobileNo==""||this.props.houseNo==""){
    //   this.props.toggleSnackbarAndSetText(
    //     true,
    //     {
    //       labelName: "Error_Message_For_Water_tanker_Application",
    //       labelKey: `BK_ERROR_MESSAGE_FOR_WATER_TANKER_APPLICATION`
    //     },
    //     "warning"
    //   );
    // }
    // else if(!re.test(this.props.email)){
    //   this.props.toggleSnackbarAndSetText(
    //     true,
    //     {
    //       labelName: "Please enter valid email address",
    //       labelKey: `BK_ERROR_MESSAGE_EMAIL_VALIDATION`
    //     },
    //     "warning"
    //   );
    // }else if(!mb.test(this.props.mobileNo)){
    //   this.props.toggleSnackbarAndSetText(
    //     true,
    //     {
    //       labelName: "Please enter valid mobile number",
    //       labelKey: `BK_ERROR_MESSAGE_FOR_MOBILE_VALIDATION`
    //     },
    //     "warning"
    //   );

    // }
    // else{this.props.nextStep();}
    this.props.nextStep();
  }
  onCitizenNameChange = e => {

  }
  toggleChangeOne = () => {
    this.setState({
      isCheckedOne: !this.state.isCheckedOne,
    });
  }
  toggleChangeTwo = () => {
    this.setState({
      isCheckedTwo: !this.state.isCheckedTwo,
    });
  }
  toggleChangeThree = () => {
    this.setState({
      isCheckedThree: !this.state.isCheckedThree,
    });
  }
  newBookingType = async (event) => {
    let { prepareFinalObject } = this.props;
    this.setState(
      { NewbkBookingType: event.target.value }); 
      prepareFinalObject("NewbkBookingTypeApplicant", event.target.value)
  };

  ResonForDiscount = async (event) => {
    let { prepareFinalObject } = this.props;
    this.setState(
      { ReasonForDiscount: event.target.value }); 
      prepareFinalObject("ReasonForDiscount", event.target.value)
  };

  render() {
    const { firstName, email, mobileNo, lastName,houseNo, handleChange,discountType,handleChangeDiscount,classes,prepareFinalObject} = this.props;
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
            value={this.props.RoomBookingData.totalAcRooms}
            pattern="[A-Za-z]"
            required = {true}
            hintText={
              <Label
                label="BK_MYBK_CC_ROOM_TOTAL_AC_ROOM"
                color="rgba(0, 0, 0, 0.3799999952316284)"
                fontSize={16}
                labelStyle={hintTextStyle}
              />
            }
            floatingLabelText={
              <Label
                key={0}
                label="BK_MYBK_CC_ROOM_TOTAL_AC_ROOM"
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
            value={this.props.RoomBookingData.totalNonAcRooms}
            required = {true}
            hintText={
              <Label
                label="BK_MYBK_CC_ROOM_TOTAL_NON_AC_ROOM"
                color="rgba(0, 0, 0, 0.3799999952316284)"
                fontSize={16}
                labelStyle={hintTextStyle}
              />
            }
            floatingLabelText={
              <Label
                key={0}
                label="BK_MYBK_CC_ROOM_TOTAL_NON_AC_ROOM"
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
            value={this.props.RoomBookingData.bookedAcRooms}
            required = {true}
            hintText={
              <Label
                label="BK_MYBK_CC_ROOM_BOOK_AC_ROOM"
                color="rgba(0, 0, 0, 0.3799999952316284)"
                fontSize={16}
                labelStyle={hintTextStyle}
              />
            }
            floatingLabelText={
              <Label
                key={0}
                label="BK_MYBK_CC_ROOM_BOOK_AC_ROOM"
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
              value={this.props.RoomBookingData.bookedNonAcRooms}
              required = {true}
              hintText={
                <Label
                  label="BK_MYBK_CC_ROOM_BOOK_NON_AC_ROOM"
                  color="rgba(0, 0, 0, 0.3799999952316284)"
                  fontSize={16}
                  labelStyle={hintTextStyle}
                />
              }
              floatingLabelText={
                <Label
                  key={0}
                  label="BK_MYBK_CC_ROOM_BOOK_NON_AC_ROOM"
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
              id="houseNo"
              name="houseNo"
              type="text"
              value={this.props.RoomBookingData.availableAcRooms}
              required = {true}
              hintText={
                <Label
                  label="BK_MYBK_CC_ROOM_BOOK_AVA_AC_ROOM"
                  color="rgba(0, 0, 0, 0.3799999952316284)"
                  fontSize={16}
                  labelStyle={hintTextStyle}
                />
              }
              floatingLabelText={
                <Label
                  key={0}
                  label="BK_MYBK_CC_ROOM_BOOK_AVA_AC_ROOM"
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
              id="houseNo"
              name="houseNo"
              type="text"
              value={this.props.RoomBookingData.availableNonAcRooms}
              required = {true}
              hintText={
                <Label
                  label="BK_MYBK_CC_ROOM_BOOK_AVA_NON_AC_ROOM"
                  color="rgba(0, 0, 0, 0.3799999952316284)"
                  fontSize={16}
                  labelStyle={hintTextStyle}
                />
              }
              floatingLabelText={
                <Label
                  key={0}
                  label="BK_MYBK_CC_ROOM_BOOK_AVA_NON_AC_ROOM"
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
            <FormControl style={{ width: '100%' }}>
              <InputLabel shrink style={{ width: '100%' }} id="demo-controlled-open-select-label"><Label
                required={true}
                label="BK_MYBK_TYPES_OF_ROOM_TO_BOOK"
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
                value={this.props.TypeOfRoomToBook}
                onChange={handleChange('TypeOfRoomToBook')}
              >
                <MenuItem value="" disabled>Types Of Room</MenuItem>
                <MenuItem value='AC'>AC</MenuItem>
                <MenuItem value='NON-AC'>NON-AC</MenuItem>
                <MenuItem value='Both'>Both</MenuItem>
              </Select>
            </FormControl>
          </div>
        
        

          {/* <label>
        <input type="checkbox"
          defaultChecked={this.state.isCheckedOne}
          onChange={this.toggleChangeOne}
        />
        AC Room
      </label>

      <label>
        <input type="checkbox"
          defaultChecked={this.state.isCheckedTwo}
          onChange={this.toggleChangeTwo}
        />
        Non-AC Room
      </label>

      <label>
        <input type="checkbox"
          defaultChecked={this.state.isCheckedThree}
          onChange={this.toggleChangeThree}
        />
       Both
      </label> */}
    {this.props.TypeOfRoomToBook === 'AC' ? 
      <div className="col-sm-6 col-xs-6">       
      <TextField
        id="name"
        name="name"
        type="text"
        value={this.props.AccRoomToBook}
        pattern="[A-Za-z]"
        required = {true}
        hintText={
          <Label
            label="BK_MYBK_NO_ACC_ROOM_TO_BOOK"
            color="rgba(0, 0, 0, 0.3799999952316284)"
            fontSize={16}
            labelStyle={hintTextStyle}
          />
        }
        floatingLabelText={
          <Label
            key={0}
            label="BK_MYBK_NO_ACC_ROOM_TO_BOOK"
            color="rgba(0,0,0,0.60)"
            fontSize="12px"
          />
        }
        onChange={handleChange('AccRoomToBook')}
        underlineStyle={{ bottom: 7 }}
        underlineFocusStyle={{ bottom: 7 }}
        hintStyle={{ width: "100%" }}
      />
    </div>
    : ""}
        
    {this.props.TypeOfRoomToBook === 'NON-AC' ? 
     <div className="col-sm-6 col-xs-6">       
     <TextField
       id="name"
       name="name"
       type="text"
       value={this.props.NonAccRoomToBook}
       pattern="[A-Za-z]"
       required = {true}
       hintText={
         <Label
           label="BK_MYBK_NO_NON_ACC_ROOM_TO_BOOK"
           color="rgba(0, 0, 0, 0.3799999952316284)"
           fontSize={16}
           labelStyle={hintTextStyle}
         />
       }
       floatingLabelText={
         <Label
           key={0}
           label="BK_MYBK_NO_NON_ACC_ROOM_TO_BOOK"
           color="rgba(0,0,0,0.60)"
           fontSize="12px"
         />
       }
       onChange={handleChange('NonAccRoomToBook')}
       underlineStyle={{ bottom: 7 }}
       underlineFocusStyle={{ bottom: 7 }}
       hintStyle={{ width: "100%" }}
     />
   </div>
    : ""}
       
       {this.props.TypeOfRoomToBook === 'Both' ? 
       <div>
         <div className="col-sm-6 col-xs-6">       
         <TextField
           id="name"
           name="name"
           type="text"
           value={this.props.AccRoomToBook}
           pattern="[A-Za-z]"
           required = {true}
           hintText={
             <Label
               label="BK_MYBK_NO_ACC_ROOM_TO_BOOK"
               color="rgba(0, 0, 0, 0.3799999952316284)"
               fontSize={16}
               labelStyle={hintTextStyle}
             />
           }
           floatingLabelText={
             <Label
               key={0}
               label="BK_MYBK_NO_ACC_ROOM_TO_BOOK"
               color="rgba(0,0,0,0.60)"
               fontSize="12px"
             />
           }
           onChange={handleChange('AccRoomToBook')}
           underlineStyle={{ bottom: 7 }}
           underlineFocusStyle={{ bottom: 7 }}
           hintStyle={{ width: "100%" }}
         />
       </div>
         <div className="col-sm-6 col-xs-6">       
         <TextField
           id="name"
           name="name"
           type="text"
           value={this.props.NonAccRoomToBook}
           pattern="[A-Za-z]"
           required = {true}
           hintText={
             <Label
               label="BK_MYBK_NO_NON_ACC_ROOM_TO_BOOK"
               color="rgba(0, 0, 0, 0.3799999952316284)"
               fontSize={16}
               labelStyle={hintTextStyle}
             />
           }
           floatingLabelText={
             <Label
               key={0}
               label="BK_MYBK_NO_NON_ACC_ROOM_TO_BOOK"
               color="rgba(0,0,0,0.60)"
               fontSize="12px"
             />
           }
           onChange={handleChange('NonAccRoomToBook')}
           underlineStyle={{ bottom: 7 }}
           underlineFocusStyle={{ bottom: 7 }}
           hintStyle={{ width: "100%" }}
         />
       </div>
</div>
       : ""}

<div className="col-sm-6 col-xs-6">
            <FormControl style={{ width: '100%' }}>
              <InputLabel shrink style={{ width: '100%' }} id="demo-controlled-open-select-label"><Label
                required={true}
                label="BK_MYBK_FROM_DATE"
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
                value={this.props.roomFromDate}
                onChange={handleChange('roomFromDate')}
              >
                <MenuItem value="" disabled>From Date</MenuItem>
                <MenuItem value={this.props.fromDate}>{this.props.fromDate}</MenuItem>
                <MenuItem value={this.props.toDate}>{this.props.toDate}</MenuItem>
              </Select>
            </FormControl>
          </div>

          <div className="col-sm-6 col-xs-6">
            <FormControl style={{ width: '100%' }}>
              <InputLabel shrink style={{ width: '100%' }} id="demo-controlled-open-select-label"><Label
                required={true}
                label="BK_MYBK_TO_DATE"
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
                value={this.props.roomToDate}
                onChange={handleChange('roomToDate')}
              >
                <MenuItem value="" disabled>To Date</MenuItem>
                <MenuItem value={this.props.fromDate}>{this.props.fromDate}</MenuItem>
                <MenuItem value={this.props.toDate}>{this.props.toDate}</MenuItem>
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
)(withStyles(styles)(ApplicatInfo)))
