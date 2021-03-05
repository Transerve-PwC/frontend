import React, { Component } from "react";
import { Card, Image, Icon, Button } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import isEmpty from "lodash/isEmpty";
import { connect } from "react-redux";
import "./index.css";

class CGBookingDetails extends Component {

render() {
   
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
                                <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_APPLICANT_SECTOR_FOR_PARK" />
                                <Label
                                    labelStyle={{ color: "inherit" }}
                                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                                     id="complaint-details-complaint-number"
                                    label={this.props.location}
                                />
                            </div>
                            {/* <div className="col-md-4">
                                <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_CC_ROOM_NUMBER_OF_DAYS" />
                                <Label
                                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                                    id="complaint-details-current-status"
                                    labelStyle={{ color: "inherit" }}
                                    label={this.props.NoOfDays}
                                />
                            </div> */}
                            <div className="col-md-4">
                                <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_CITIZEN_HOUSE_NUMBER_PLACEHOLDER" />
                                <Label
                                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                                    id="complaint-details-current-status"
                                    labelStyle={{ color: "inherit" }}
                                    label={this.props.houseNo}
                                />
                            </div>

                            {/* <div className="col-md-4">
                                <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_ROOM_LOCALITY" />
                                <Label
                                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                                    id="complaint-details-current-status"
                                    labelStyle={{ color: "inherit" }}
                                    label={this.props.locality}
                                />
                            </div> */}

                            <div className="col-md-4">
                                <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MY_BK_ROOM_FROM_DATE" />
                                <Label
                                    labelStyle={{ color: "inherit" }}
                                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                                    id="complaint-details-complaint-number"
                                    label={this.props.fromDate}
                                />
                            </div>
                            <div className="col-md-4">
                                <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MY_BK_ROOM_TO_DATE" />
                                <Label
                                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                                    id="complaint-details-current-status"
                                    labelStyle={{ color: "inherit" }}
                                    label={this.props.toDate}
                                />
                            </div>     
                            <div className="col-md-4">
                                <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_DIMENSION_PLACEHOLDER" />
                                <Label
                                    labelStyle={{ color: "inherit" }}
                                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                                    id="complaint-details-complaint-number"
                                    label={this.props.dimension}
                                />
                            </div>

                            {/* <div className="col-md-4">
                                <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_ROOM_REFUNDABLE_SECURITY" />
                                <Label
                                    labelStyle={{ color: "inherit" }}
                                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                                    id="complaint-details-complaint-number"
                                    label={this.props.RefundableSecurity}
                                />
                            </div> */}

                            <div className="col-md-4">
                                <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_CLEANING_CHARGES_PLACEHOLDER" />
                                <Label
                                    labelStyle={{ color: "inherit" }}
                                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                                    id="complaint-details-complaint-number"
                                    label={this.props.cleaningCharges}
                                />
                            </div>

                            <div className="col-md-4">
                                <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_RENT_PLACEHOLDER" />
                                <Label
                                    labelStyle={{ color: "inherit" }}
                                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                                    id="complaint-details-complaint-number"
                                    label={this.props.Rent}
                                />
                            </div>

                            <div className="col-md-4">
                                <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_CGST_PLACEHOLDER" />
                                <Label
                                    labelStyle={{ color: "inherit" }}
                                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                                    id="complaint-details-complaint-number"
                                    label={this.props.cgst}
                                />
                            </div>

                            <div className="col-md-4">
                                <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="UTGST" />
                                <Label
                                    labelStyle={{ color: "inherit" }}
                                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                                    id="complaint-details-complaint-number"
                                    label={this.props.utgst}
                                />
                            </div>

                            <div className="col-md-4">
                                <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="Surcharge On Rent" />
                                <Label
                                    labelStyle={{ color: "inherit" }}
                                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                                    id="complaint-details-complaint-number"
                                    label={this.props.surcharge}
                                />
                            </div>

                            <div className="col-md-4">
                                <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_FACILITATION_CHARGES_PLACEHOLDER" />
                                <Label
                                    labelStyle={{ color: "inherit" }}
                                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                                    id="complaint-details-complaint-number"
                                    label={"100"}
                                />
                            </div>

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

