import React from "react";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { toggleSpinner } from "egov-ui-kit/redux/common/actions";

class ConfirmDialog extends React.Component {
  handleClickOpen = () => {
  };

  handleClose = () => {
    this.props.handleField(
      this.props.screenKey,
      `components.div.children.confirmDialog`,
      `props.open`,
      false
    )
  };

  handleYes = () => {
    let { preparedFinalObject, populateBiddersTable, handleField, prepareFinalObject, toggleSpinner } = this.props;
    let { Properties, BidderData, refundData } = preparedFinalObject;
    let { biddersList, isMarked, screenKey, componentJsonPath } = refundData;

    toggleSpinner();

    setTimeout(() => {
      biddersList = biddersList.map((item, index) => {
        if (BidderData[1] == item.bidderName) {
          item.refundStatus = isMarked ? "Initiated" : "-";
        }
        return item;
      });

      populateBiddersTable(biddersList, screenKey, componentJsonPath)

      let refundedBidders = biddersList.filter(item => item.refundStatus == "Initiated");
      handleField(
        screenKey,
        "components.div.children.submitButton",
        "visible",
        (biddersList.length === refundedBidders.length)
      )
      handleField(
        screenKey,
        "components.div.children.saveButton",
        "visible",
        (biddersList.length !== refundedBidders.length)
      )

      if (biddersList.length == refundedBidders.length) {
        biddersList = biddersList.map(item => ({ ...item, action: "SUBMIT" }));
      }
      else {
        biddersList = biddersList.map(item => ({ ...item, action: "", state: "" }));
      }

      let properties = [{ ...Properties[0], propertyDetails: { ...Properties[0].propertyDetails, bidders: biddersList } }]
      prepareFinalObject(
        "Properties",
        properties
      )
      toggleSpinner();
    }, 1000)
    this.handleClose();
  };

  handleCancel = () => {
    this.handleClose();
  };
  
  render() {
    return (
      <div>
        <Dialog
          open={this.props.open}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {this.props.title}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {this.props.content}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCancel} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleYes} color="primary" autoFocus>
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

const mapSateToProps = state => {
  const { screenConfiguration } = state;
  const { preparedFinalObject } = screenConfiguration;
  return { preparedFinalObject }
};

const mapDispatchToProps = dispatch => {
  return {
    handleField: (formKey, path, props, value) =>
      dispatch(handleField(formKey, path, props, value)),
    prepareFinalObject: (path, value) =>
      dispatch(prepareFinalObject(path, value)),
    toggleSpinner: () => 
      dispatch(toggleSpinner())
  };
};

export default connect(
  mapSateToProps,
  mapDispatchToProps
)(ConfirmDialog);