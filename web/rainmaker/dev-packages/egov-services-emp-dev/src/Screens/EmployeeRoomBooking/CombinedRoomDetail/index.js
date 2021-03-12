import React, { Component } from "react";
import { Card, Image, Icon, Button } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import isEmpty from "lodash/isEmpty";
import { connect } from "react-redux";
import "./index.css";

class CGBookingDetails extends Component {



 
render() {
let duplicateDiscount;
let duplicateAcRoom;
let duplicateNonAcRoom;
if(this.props.totalACRoom == 0){
  duplicateAcRoom = "0"
}
else{
  duplicateAcRoom = this.props.totalACRoom
}
if(this.props.totalNonAcRoom == 0){
  duplicateNonAcRoom = "0"
}
else{
  duplicateNonAcRoom = this.props.totalNonAcRoom
}
if(this.props.discountForRoom == 0){
  duplicateDiscount = "0"
}
else {
  duplicateDiscount = this.props.discountForRoom
}

return (
      <div>
        <Card
          textChildren={
            <div>
              <div className="rainmaker-displayInline">
                
                <Label label="BK_MYBK_COMMUNITY_CENTER_DETAILS" containerStyle={{ marginLeft: "13px" }} labelClassName="dark-heading" />
              </div>
              <div key={10} className="complaint-detail-full-width">
                <div className="complaint-detail-detail-section-status row">
                  <div className="col-md-4">
                    <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MY_BK_ROOM_APPLICATION_NUMBER" />
                    <Label
                      className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                      label={this.props.ApplicationNumber}
                      id="complaint-details-submission-date"
                      labelStyle={{ color: "inherit" }}
                    />
                  </div>
                  <div className="col-md-4">
                    <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MY_BK__AC_ROOM_TOTAL_NUMBER" />
                    <Label
                      className="col-xs-6  col-sm-8 col-md-10  status-result-color"
                      id="complaint-details-current-status"
                      labelStyle={{ color: "inherit" }}
                      label={duplicateAcRoom}
                    />
                  </div>
                  <div className="col-md-4">
                    <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MY_BK_NON_AC_ROOM_TOTAL_NUMBER" />
                    <Label
                      className="col-xs-6  col-sm-8 col-md-10  status-result-color"
                      id="complaint-details-current-status"
                      labelStyle={{ color: "inherit" }}
                      label={duplicateNonAcRoom}
                    />
                  </div>
                  <div className="col-md-4">
                    <Label className="col-xs-112  col-sm-12 col-md-12 status-color" label="BK_MY_BK_ROOM_CREATED_DATE" />
                    <Label
                      className="col-xs-12 col-sm-12 col-md-12  status-result-color"
                     
                      id="complaint-details-submission-date"
                      labelStyle={{ color: "inherit" }}
                      label={this.props.CreatedDate}//bkIfscCode
                    />
                  </div>
             
                  <div className="col-md-4">
                    <Label className="col-xs-112  col-sm-12 col-md-12 status-color" label="BK_MY_BK_ROOM_FROM_DATE" />
                    <Label
                      className="col-xs-12 col-sm-12 col-md-12  status-result-color"
                    
                      id="complaint-details-submission-date"
                      labelStyle={{ color: "inherit" }}
                      label={this.props.FromDate}
                    />
                  </div>
                  <div className="col-md-4">
                    <Label className="col-xs-112  col-sm-12 col-md-12 status-color" label="BK_MY_BK_ROOM_TO_DATE" />
                    <Label
                      className="col-xs-12 col-sm-12 col-md-12  status-result-color"
                    
                      id="complaint-details-submission-date"
                      labelStyle={{ color: "inherit" }}
                      label={this.props.ToDate}
                    />
                  </div>
                  {/* <div className="col-md-4">
                    <Label className="col-xs-112  col-sm-12 col-md-12 status-color" label="BK_MY_BK_ROOM_APPLIED_DISCOUNT" />
                    <Label
                      className="col-xs-12 col-sm-12 col-md-12  status-result-color"
                    
                      id="complaint-details-submission-date"
                      labelStyle={{ color: "inherit" }}
                      label={duplicateDiscount}
                    />
                  </div> */}
               
                </div>
              </div>
          </div>
        }
      />
    </div>
  );
}
}


const mapStateToProps = state => {

    const { complaints, common, auth, form,bookings } = state;
  
    return {
      state
    }

}
const mapDispatchToProps = dispatch => {
    return {
        toggleSnackbarAndSetText: (open, message, error) =>
            dispatch(toggleSnackbarAndSetText(open, message, error)),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CGBookingDetails);

