import React, { Component } from "react";
import { Card, Image, Icon, Button } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import isEmpty from "lodash/isEmpty";
import "./index.css";
// import HistoryIcon from "@material-ui/icons/History";
// import { LabelContainer } from "egov-ui-framework/ui-containers";
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
import NewLocationEditDetails from "../NewLocationEditDetails"
import PropTypes from "prop-types";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import StepContent from "@material-ui/core/StepContent";
import Divider from "@material-ui/core/Divider";
import { getCurrentStatus } from "../TaskStatusComponents";
import { LabelContainer } from "egov-ui-framework/ui-containers";


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
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      togglepopup: false,
    };
  };
  editButtonOnClick = (e, complaintNo, label) => {
    this.setState({
      togglepopup: !this.state.togglepopup,
      // actionOnApplication: label
    })


  }

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

 
  render() {
    const { status, historyApiData, applicantName, areaRequirement, landmark, localityAddress, applicationNo, submittedDate, dateCreated, address, sector, houseNo, businessService, mapAction, images, action, role } = this.props;
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
               

                <div className="col-8" style={{ paddingLeft: "10px" }}>
                  <Label label="BK_MCC_NEW_LOCATION_DETAILS" containerStyle={{ marginLeft: "13px" }} labelClassName="dark-heading" />
                </div>

                {/* <button onClick={() => this.editButtonOnClick()}>Edit Details</button> */}

              </div>
              <div key={10} className="complaint-detail-full-width">


                <div className="complaint-detail-detail-section-status row">
                  <div className="col-md-4">
                    <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_NEW_LOCATION_LOCALITY" />
                    <Label
                      labelStyle={{ color: "inherit" }}
                      className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                      id="complaint-details-complaint-number"
                      label={localityAddress}
                    />
                  </div>
                  <div className="col-md-4">
                    <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_NEW_LOCATION_ADDRESS" />
                    <Label
                      className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                      id="complaint-details-current-status"
                      labelStyle={{ color: "inherit" }}
                      label={address}
                    />
                  </div>
                  <div className="col-md-4">
                    <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_NEW_LOCATION_LANDMARK" />
                    <b><Label
                      className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                      // label={submittedDate}
                      id="complaint-details-submission-date"
                      labelStyle={{ color: "inherit" }}
                      label={landmark}
                    /></b>
                  </div>
                  <div className="col-md-4">
                    <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MCC_LOCATION_AREA" />
                    <Label
                      className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                      label={submittedDate}
                      id="complaint-details-submission-date"
                      labelStyle={{ color: "inherit" }}
                      label={areaRequirement}
                    />
                  </div>

                </div>
              </div>
            </div>
          }
        />


        <DialogContainer
          toggle={this.state.togglepopup}
          // actionTittle={this.state.actionTittle}
          togglepopup={this.editButtonOnClick}
          children={<NewLocationEditDetails
            address='New delhi'
            area="500 feet"
          />}
        />



      </div>
    );
  }
}

export default BookingDetails;
