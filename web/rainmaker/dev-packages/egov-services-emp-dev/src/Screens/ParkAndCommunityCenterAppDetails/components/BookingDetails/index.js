import React, { Component } from "react";
import { Card, Image, Icon, Button } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import isEmpty from "lodash/isEmpty";
import "./index.css";

import DialogContainer from "../../../../modules/DialogContainer"

import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import TaskStatusComponents from "../TaskStatusComponents";
import TaskStatusContainer from "../TaskStatusContainer";

import PropTypes from "prop-types";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import StepContent from "@material-ui/core/StepContent";
import Divider from "@material-ui/core/Divider";
import { getCurrentStatus } from "../TaskStatusComponents";
import { LabelContainer } from "egov-ui-framework/ui-containers";
import HistoryIcon from '@material-ui/icons/History';

const styles = (theme) => ({
  root: {
    marginTop: 24,
    width: "100%"
  },
  closeButton: {
    position: 'absolute',
    right: "10px",
    top: "5px"
  }

});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
}))(MuiDialogContent);

class BookingDetails extends Component {
  state = {
    open: false
  };


  handleClickOpen = () => {

    this.setState({
      open: true
    })

  };
  handleClose = () => {
    this.setState({
      open: false
    })
  };

  navigateToComplaintType = () => {
    this.props.history.push("/complaint-type");
  };
  getImageSource = (imageSource, size) => {
    const images = imageSource.split(",");
    if (!images.length) {
      return null;
    }
    switch (size) {
      case "small":
        imageSource = images[2];
        break;
      case "medium":
        imageSource = images[1];
        break;
      case "large":
      default:
        imageSource = images[0];
    }
    return imageSource || images[0];
  };
  onImageClick = (source) => {
    window.open(this.getImageSource(source, "large"), 'Image');
    // this.props.history.push(`/image?source=${source}`);
  };
  render() {
    const { bkToDate,bkCgst,bkUtgst,bkRent,bkSurchargeRent,bkFromDate,bkBookingPurpose,status, historyApiData, applicantName, applicationNo, submittedDate, dateCreated,bkLocation,bkDimension, address, sector, houseNo, bookingType, mapAction, images, action, role } = this.props;
    var ProcessInstances = [];

    if (historyApiData != undefined && historyApiData.ProcessInstances && historyApiData.ProcessInstances.length > 0) {
      ProcessInstances = [...historyApiData.ProcessInstances];
    }
    return (
      <div>
        <Card
          textChildren={
            <div>
              <div className="rainmaker-displayInline row">

                <div className="col-8" style={{paddingLeft:"10px"}}>
                  <Label label="BK_MYBK_APPLICATION_DETAILS" containerStyle={{ marginLeft: "13px" }} labelClassName="dark-heading" />
                </div>
              </div>
              <div key={10} className="complaint-detail-full-width">
                <Dialog maxWidth={false} style={{ zIndex: 2000 }} onClose={() => { this.handleClose() }} aria-labelledby="customized-dialog-title" open={this.state.open} >
                  <DialogContent>
                    <Typography>

                      <Stepper orientation="vertical">
                        {ProcessInstances.map(
                          (item, index) =>
                            item && (
                              <Step key={index} active={true}>
                                <StepLabel>
                                  <LabelContainer
                                    labelName={getCurrentStatus(item.state.applicationStatus)}
                                    labelKey={
                                       item.businessService
                                        ? `WF_${item.businessService.toUpperCase()}_${
                                        item.state.applicationStatus
                                        }`
                                        : ""
                                    }
                                  />
                                </StepLabel>
                                <StepContent>
                                  <TaskStatusComponents currentObj={item} index={index} />
                                  <Divider style={{ width: "1000px" }} />
                                </StepContent>
                              </Step>
                            )
                        )}
                      </Stepper>
                    </Typography>
                  </DialogContent>
                </Dialog>


                <div className="complaint-detail-detail-section-status row">
                  <div className="col-md-4">
                    <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_COMMON_APPLICATION_NO" />
                    <Label
                      labelStyle={{ color: "inherit" }}
                      className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                      id="complaint-details-complaint-number"
                      label={applicationNo}
                    />
                  </div>
                  <div className="col-md-4">
                    <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_APPLICATION_BOOKING_TYPE" />
                    <Label
                      className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                      // label={submittedDate}
                      id="complaint-details-submission-date"
                      labelStyle={{ color: "inherit" }}
                      label={bookingType}
                    />
                  </div>
                  <div className="col-md-4">
                    <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_PCC_PURPOSE_LABEL" />
                    <Label
                      className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                      // label={submittedDate}
                      id="complaint-details-submission-date"
                      labelStyle={{ color: "inherit" }}
                      label={bkBookingPurpose}
                    />
                  </div>
                  <div className="col-md-4">
                    <Label className="col-xs-112  col-sm-12 col-md-12 status-color" label="BK_MYBK_APPLICANT_SECTOR_FOR_PARK" />
                    <Label
                      className="col-xs-12 col-sm-12 col-md-12  status-result-color"
                    
                      id="complaint-details-submission-date"
                      labelStyle={{ color: "inherit" }}
                      label={sector}
                    />
                  </div>
                  <div className="col-md-4">
                    <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_APPLICATION_DETAILS_CURRENT_STATUS" />
                    <Label
                      className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                      id="complaint-details-current-status"
                      labelStyle={{ color: "inherit" }}
                      label={status}
                    />
                  </div>


                  <div className="col-md-4">
                    <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_APPLICATION_DETAILS_SUBMISSION_DATE" />
                    <b><Label
                      className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                      // label={submittedDate}
                      id="complaint-details-submission-date"
                      labelStyle={{ color: "inherit" }}
                      label={dateCreated}
                    /></b>
                  </div> 

                  <div className="col-md-4">
                    <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_PCC_FROM_DATE_LABEL" />
                    <b><Label
                      className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                      // label={submittedDate}
                      id="complaint-details-submission-date"
                      labelStyle={{ color: "inherit" }}
                      label={bkFromDate}
                    /></b>
                  </div>

                  <div className="col-md-4">
                    <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_PCC_TO_DATE_LABEL" />
                    <b><Label
                      className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                      // label={submittedDate}
                      id="complaint-details-submission-date"
                      labelStyle={{ color: "inherit" }}
                      label={bkToDate}
                    /></b>
                  </div>
                 
                  <div className="col-md-4">
                    <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_PCC_LOCATION_LABEL" />  {/*BK_MYBK_PARK_LOCATIION_BOOKING*/}
                    <Label
                      className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                      // label={submittedDate}
                      id="complaint-details-submission-date"
                      labelStyle={{ color: "inherit" }}
                      label={bkLocation}
                    />
                  </div>
                  <div className="col-md-4">
                    <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_PCC_DIMENSION_LABEL" /> {/*BK_MYBK_PARK_DIMENTION_AREA*/}
                    <Label
                      className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                      // label={submittedDate}
                      id="complaint-details-submission-date"
                      labelStyle={{ color: "inherit" }}
                      label={bkDimension + "Sq.Yards"}
                    />
                  </div>
                  <div className="col-md-4">
                    <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_PCC_SURCHARGE_RENT_LABEL" /> {/*BK_MYBK_PARK_DIMENTION_AREA*/}
                    <Label
                      className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                      // label={submittedDate}
                      id="complaint-details-submission-date"
                      labelStyle={{ color: "inherit" }}
                      label={bkSurchargeRent}
                    />
                  </div>
                  <div className="col-md-4">
                    <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_PCC_RENT_LABEL" /> {/*BK_MYBK_PARK_DIMENTION_AREA*/}
                    <Label
                      className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                      // label={submittedDate}
                      id="complaint-details-submission-date"
                      labelStyle={{ color: "inherit" }}
                      label={bkRent}
                    />
                  </div>
                  <div className="col-md-4">
                    <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_PCC_UTGST_LABEL" /> {/*BK_MYBK_PARK_DIMENTION_AREA*/}
                    <Label
                      className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                      // label={submittedDate}
                      id="complaint-details-submission-date"
                      labelStyle={{ color: "inherit" }}
                      label={bkUtgst}
                    />
                  </div>
                  <div className="col-md-4">
                    <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_PCC_CGST_LABEL" /> {/*BK_MYBK_PARK_DIMENTION_AREA*/}
                    <Label
                      className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                      // label={submittedDate}
                      id="complaint-details-submission-date"
                      labelStyle={{ color: "inherit" }}
                      label={bkCgst}
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

export default BookingDetails;
