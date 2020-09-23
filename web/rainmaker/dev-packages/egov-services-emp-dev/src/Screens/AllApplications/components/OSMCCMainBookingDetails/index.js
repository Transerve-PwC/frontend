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

  convertEpochToDate = (dateEpoch) => {
    const dateFromApi = new Date(dateEpoch);
    let month = dateFromApi.getMonth() + 1;
    let day = dateFromApi.getDate();
    let year = dateFromApi.getFullYear();
    month = (month > 9 ? "" : "0") + month;
    day = (day > 9 ? "" : "0") + day;
    return `${day}-${month}-${year}`;
  };




  render() {
    const { status, historyApiData, areaRequired,bkBookingVenue,bkFromDate, bkToDate,applicantName, applicationNo, submittedDate, dateCreated, address, sector, houseNo, bookingType, mapAction, images, action, role } = this.props;
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
                <div style={{ position: "absolute", right: "100px" }} className="col-4">
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
                                        ? `BK_WF_${item.businessService.toUpperCase()}_${
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
                    <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_APPLICATION_DETAILS_CURRENT_STATUS" />
                    <Label
                      className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                      id="complaint-details-current-status"
                      labelStyle={{ color: "inherit" }}
                      label={status}
                    />          
                  </div>
                  <div className="col-md-4">
                    <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_APPLICATION_BOOKING_VENUE" />
                    <Label
                      className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                      id="complaint-details-booking-venue"
                      labelStyle={{ color: "inherit" }}
                      label={bkBookingVenue}
                    />          
                  </div>
                  <div className="col-md-4">
                  <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_APPLICATION_FROM_DATE" />
                  <Label
                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                  
                    id="complaint-details-submission-date"
                    labelStyle={{ color: "inherit" }}
                    label= {this.convertEpochToDate(
                      bkFromDate,"dayend"
                    )}
                   
                  />
                </div>

                <div className="col-md-4">
                  <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_APPLICATION_TO_DATE" />
                  <Label
                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                   
                    id="complaint-details-submission-date"
                    labelStyle={{ color: "inherit" }}
                  
                    label= {this.convertEpochToDate(
                      bkToDate,"dayend"
                    )}
                  />
                </div> 
                  <div className="col-md-4">
                    <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_APPLICATION_DETAILS_SUBMISSION_DATE" />
                    <b><Label
                      className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                      label={submittedDate}
                      id="complaint-details-submission-date"
                      labelStyle={{ color: "inherit" }}
                      label={dateCreated}
                    /></b>
                  </div>
                  <div className="col-md-4">
                    <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_APPLICATION_BOOKING_TYPE" />
                    <Label
                      className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                      label={submittedDate}
                      id="complaint-details-submission-date"
                      labelStyle={{ color: "inherit" }}
                      label={bookingType}
                    />
                  </div>
                  <div className="col-md-4">
                    <Label className="col-xs-112  col-sm-12 col-md-12 status-color" label="BK_MCC_LOCATION_AREA" />
                    <Label
                      className="col-xs-12 col-sm-12 col-md-12  status-result-color"
                      id="complaint-details-submission-date"
                      labelStyle={{ color: "inherit" }}
                      label={areaRequired?areaRequired:'NA'}
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
