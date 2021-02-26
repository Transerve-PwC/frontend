import { Button, TextField } from "components";
import { httpRequest } from "egov-ui-kit/utils/api";
import LoadingIndicator from "egov-ui-kit/components/LoadingIndicator";
import React, { Component } from 'react'
import { Toast } from "components";
import { SortDialog, Screen } from "modules/common";
import CircularProgress from "@material-ui/core/CircularProgress";
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import { withStyles } from "@material-ui/core/styles";

import { connect } from "react-redux";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import TextFieldContainer from 'egov-ui-framework/ui-containers/TextFieldContainer'


const styles = theme => ({

  text: {
    " &  .Mui-error": {
      color: "primary"
    }
  },


  dialogStyle: {
    minWidth: '960px',
  },

  root: {
    "& .MuiInput-underline:after": {
      borderBottomColor: " #f44336"
    }
  },

  [theme.breakpoints.down('sm')]: {


    dialogStyle: {
      minHeight: '100%',
      margin: '0px',
      minWidth: '0px',
      maxWidth: '960px'
    }
  }



})



class DialogComponent extends Component {


  async componentDidMount() {

    console.log(this.props, "Nero Component didmount")


  }

  // componentWillReceiveProps(nextProps) {
  //   console.log(this.props, "Nero NExtprops")
  // }
  componentDidUpdate(prevProps) {

    // console.log(prevProps, "Nero Prevprops")
    //       if(this.props.preparedFinalObject.PopupDataForHoldDates !== prevProps.preparedFinalObject.PopupDataForHoldDates){


    //         this.setState({
    //           bookingVenue: preparedFinalObject && preparedFinalObject.PopupDataForHoldDates.bookingVenue,
    //           lockedDate: preparedFinalObject && preparedFinalObject.PopupDataForHoldDates.fromDate,
    //           id: preparedFinalObject && preparedFinalObject.PopupDataForHoldDates.id
    //         });
    //       }
    if (this.props.updateMasterData !== prevProps.updateMasterData) {




      this.setState({ updateData: this.props.updateMasterData, errors: {} })
      this.props.prepareFinalObject('updateData', this.props.updateMasterData)


    }

  }



  state = {

    updateData: {},
    errors: {},
    create: true,
    mdmsRes: {},
    setOpen: false,
    bookingVenue: "",
    lockedDate: "",
    id: "",

  }

  async handleSubmit() {
    console.log(this.props, "Nero Props");
    //return false;
    const headers = [
      "Id",
      "Venue name",
      "Dates locked",
      "",
      "",
      "Action",
      "",
      "",
      ""
    ]
    var reqBody = {


      "commercialGrndAvailabilityLock": [

        {

          id: this.props.preparedFinalObject.updateData.id,
          //bookingVenue: this.state.updateData.residentialCommercial,
          locked: false,
          //fromDate: this.state.lockedDate


        }

      ]
    }
    let unlock = "0";
    const responseStatus = await httpRequest(

      "bookings/commercial/ground/updateAvailability/_lock",
      "_search",
      [],
      reqBody
    );
    if (responseStatus.status == '200') {
      unlock = "1";


      this.setState({ isLoading: true })
      let feeResponse = await httpRequest(
        "bookings/commercial/ground/lock/dates/_fetch",
        "_search",
        [], []
      );
      this.setState({ isLoading: true })
      let tableData = {};

      if (feeResponse && feeResponse.data.length > 0) {

        tableData.headers = headers;
        tableData.rows = feeResponse.data;
        this.setState({ data: tableData })
        this.setState({ isLoading: false })
      }
    } else {
      this.props.toggleSnackbarAndSetText(
        true,
        {
          labelName: "Something went wrong.Try Again",
          labelKey: `Something went wrong.Try Again`
        },
        "error"
      );
    }

    this.props.handleClose()
    if(unlock === "1"){
      this.props.toggleSnackbarAndSetText(
        true,
        {
          labelName: "Date unlocked Successfully",
          labelKey: `Date unlocked Successfully`
        },
        "success"
      );
    }
  }


  render() {
    const { classes } = this.props


    return (
      //Object.keys(this.state.updateData).length === 0?<div > <CircularProgress style={{position: "fixed" , top: '50%', left: '50%'}} /> </div> :

      <div>
        <Dialog
          classes={{ paper: classes.dialogStyle }}
          minWidth="md"
          open={this.props.open}
          onClose={this.props.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Are you sure to unlock the selected Date</DialogTitle>

          <DialogContent>

            <div className="col-xs-12 col-sm-12">
              <div className="col-xs-12 col-sm-6">
                <TextFieldContainer


                  label={{
                    labelName: "Venue name",
                    labelKey: "BK_EMP_ADMIN_VENUE_NAME",
                  }}
                  placeholder={{
                    labelName: "Venue name",
                    labelKey: "BK_EMP_ADMIN_VENUE_NAME",
                  }}

                  jsonPath="updateData.bookingVenue"

                  gridDefination={{
                    xs: 12,
                    sm: 6
                  }}
                />

              </div>
              <div className="col-xs-12 col-sm-6">
                <TextFieldContainer


                  label={{
                    labelName: "Locked date",
                    labelKey: "BK_EMP_ADMIN_LOCKED_DATE",
                  }}
                  placeholder={{
                    labelName: "Locked date",
                    labelKey: "BK_EMP_ADMIN_LOCKED_DATE",
                  }}

                  jsonPath="updateData.fromDate"

                  gridDefination={{
                    xs: 12,
                    sm: 6
                  }}
                />

              </div>
            </div>
          </DialogContent>

          <DialogActions>
            <Button label="Cancel" onClick={() => {
              this.props.handleClose()
              this.setState({ errors: {} })
            }} color="secondary" />

            <Button label="Unlock" onClick={() => { this.handleSubmit() }} primary={true} />

          </DialogActions>
        </Dialog>

      </div>


    )
  }
}






const mapStateToProps = (state, ownProps) => {
  console.log(state, "Nero mapStateProps")
  const { screenConfiguration } = state;
  const { preparedFinalObject } = screenConfiguration;
  return { preparedFinalObject }
}



const mapDispatchToProps = dispatch => {
  return {
    prepareFinalObject: (jsonPath, value) =>
      dispatch(prepareFinalObject(jsonPath, value)),

    toggleSnackbarAndSetText: (open, message, error) =>
      dispatch(toggleSnackbarAndSetText(open, message, error)),

  };
};


export default (connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(DialogComponent)))