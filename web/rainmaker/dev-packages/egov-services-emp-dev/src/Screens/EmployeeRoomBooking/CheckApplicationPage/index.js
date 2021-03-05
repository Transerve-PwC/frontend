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

findApplicationNumber = async (event) => {
  let { prepareFinalObject,userInfo,toggleSnackbarAndSetText } = this.props;
  alert("ComeInfindApplicationNumber")
  // let complaintCountRequest = 
  // {
  //   "applicationNumber": this.state.ApplicationNumber, 'uuid': userInfo.uuid,
  //   "applicationStatus": "",
  //   "mobileNumber": "", "bookingType": "","tenantId" : userInfo.tenantId
  // }
 
  let complaintCountRequest = 
  {
    "applicationNumber": this.state.ApplicationNumber, 
  }
  
let dataforSectorAndCategory = await httpRequest( 	
  "bookings/api/community/center/_search",
    "_search",[],
    complaintCountRequest 
  );
console.log("dataforSectorAndCategory --",dataforSectorAndCategory)
if(dataforSectorAndCategory.bookingsModelList.length > 0){

  prepareFinalObject("RoomBookingData", dataforSectorAndCategory)
  prepareFinalObject("SetPaymentURL", this.props.history.push)
  console.log("historyPropsToConsole--",this.props.history.push)
  console.log("historyPropsToConsole--",this.props.history)
  this.props.history.push(`/egov-services/ApplyRoomBooking`);

}
else{
  
  toggleSnackbarAndSetText(
    true,
    {
      labelName: "No Application Found With This Application Number",
      labelKey: `BK_ERR_APPLICATION_NOT_FOUND`
    },
    "error"
  );

}
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
            id="ApplicationNumber"
            name="ApplicationNumber"
            type="text"
            value={ApplicationNumber}
            pattern="[A-Za-z]"
            required = {true}
            hintText={
              <Label
                label="Enter Application Number"
                color="rgba(0, 0, 0, 0.3799999952316284)"
                fontSize={16}
                labelStyle={hintTextStyle}
              />
            }
            floatingLabelText={
              <Label
                key={0}
                label="Enter Application Number"
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
                      label={<Label buttonLabel={true} label="Search" />}
                      fullWidth={true}
                      primary={true}
                      style={{ float: 'right', marginRight: '50px', marginTop: '40px' }}
                      onClick={(e) => this.findApplicationNumber(e)
           } />
 
            <Button
			 		  label={
			 			<Label
			 			  buttonLabel={true}
			 			  color="#fe7a51"
			 			  label="Reset"
			 			/>
			 		  }
			 		  labelStyle={{
			 			letterSpacing: 0.7,
			 			padding: 0,
			 			color: "#fe7a51",
			 		  }}
			 		  buttonStyle={{ border: "1px solid #fe7a51" }}
			 		  style={{ width: "15%", marginLeft: "2%", marginTop: '40px'}}
			 		  onClick={(e) => this.Reset(e)}
			 		/>  

        </div>
        
        </div>
        </div>
    );
  }
}

const mapStateToProps = state => {
  const { complaints, common, auth, form } = state;
 console.log("complaints-complaints",complaints)
 console.log("complaints-common",common)
 console.log("complaints-auth",auth)
 console.log("complaints-form",form)
  const { userInfo } = state.auth;

  return {
    state,userInfo
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