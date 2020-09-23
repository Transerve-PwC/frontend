import React, { Component } from "react";
import { Card, Image, Icon, Button } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import isEmpty from "lodash/isEmpty";
import "./index.css";



class BwtApplicantDetails extends Component {
 
  render() {
    const { status,driverName, applicationNo, driverMobileNumber,approverName, areaRequired,bkDuration,bkCategory,submittedDate, bkMobileNumber, dateCreated, address, sector, houseNo, bookingType, mapAction, images, action, role } = this.props;
    const titleKey = applicationNo.toUpperCase();

    return (
      <div>
        <Card
          textChildren={
            <div>
              <div className="rainmaker-displayInline">
                <Label label="BK_MYBK_DRIVER_DETAILS" containerStyle={{ marginLeft: "13px" }} labelClassName="dark-heading" />
              </div>
              <div key={10} className="complaint-detail-full-width">
                <div className="complaint-detail-detail-section-status row">
                  <div className="col-md-4">
                    <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_CREATE_DRIVER_NAME" />
                    <Label
                      className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                      label={driverName?driverName:'NA'}
                      id="complaint-details-submission-date"
                      labelStyle={{ color: "inherit" }}
                    />
                  </div>
                
                  <div className="col-md-4">
                    <Label className="col-xs-112  col-sm-12 col-md-12 status-color" label="BK_MYBK_CREATE_DRIVER_MOBILE_NUMBER" />
                    <Label
                      className="col-xs-12 col-sm-12 col-md-12  status-result-color"
                     
                      id="complaint-details-submission-date"
                      labelStyle={{ color: "inherit" }}
                      label={driverMobileNumber?driverMobileNumber:'NA'}
                    />
                  </div>
                  <div className="col-md-4">
                    <Label className="col-xs-112  col-sm-12 col-md-12 status-color" label="BK_MYBK_CREATE_APPROVER_NAME" />
                    <Label
                      className="col-xs-12 col-sm-12 col-md-12  status-result-color"
                   
                      id="complaint-details-submission-date"
                      labelStyle={{ color: "inherit" }}
                      label={approverName?approverName:"NA"}
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

export default BwtApplicantDetails;
