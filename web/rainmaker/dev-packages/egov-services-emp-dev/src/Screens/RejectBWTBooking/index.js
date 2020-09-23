import React, { Component } from "react";
import { connect } from "react-redux";
import formHOC from "egov-ui-kit/hocs/form";
import { Screen } from "modules/common";
import RejectBWTBookingForm from "./components/RejectBWTBooking";
import { fetchApplications } from "egov-ui-kit/redux/bookings/actions";
import Label from "egov-ui-kit/utils/translationNode";
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";
import { handleFieldChange } from "egov-ui-kit/redux/form/actions";
import "./index.css";

const RejectBWTBokingHOC = formHOC({
  formKey: "rejectBWTBooking",
  isCoreConfiguration: 'false',
})(RejectBWTBookingForm);


class RejectBWTBooking extends Component {
  state = {
    valueSelected: "",
    commentValue: "",
    mobileNo: "",
    driverFullName: '',
    approverName: ''

  };
  componentDidMount() {

    let { fetchApplications, match, userInfo,applicationNumber } = this.props;
    fetchApplications(
      {
        'uuid': userInfo.uuid, "applicationNumber": applicationNumber,
        "applicationStatus": "",
				"tenantId":userInfo.tenantId
      }
    );
  }



  commentsValue = {};

  handleCommentsChange = (e, value) => {
    this.commentsValue.textVal = e.target.value;
    this.setState({
      commentValue: e.target.value
    });
    this.concatComments(this.commentsValue);
  };
  handleOptionsChange = (event, value) => {
    this.setState({ valueSelected: value });
    this.commentsValue.radioValue = value;
    this.concatComments(this.commentsValue);
  };
  concatComments = val => {
    let com1 = "";
    let com2 = "";
    if (val.radioValue) {
      com1 = val.radioValue + ";";
    }
    if (val.textVal) {
      com2 = val.textVal;
    }
    let concatvalue = com1 + com2;
    this.props.handleFieldChange("rejectBWTBooking", "comments", concatvalue);
  };

  onMobileChange = (e) => {
    const inputValue = e.target.value;
    this.setState({ mobileNo: inputValue });
  };

  onDriverNameChange = (e) => {
    const driverName = e.target.value;
    this.setState({ driverFullName: driverName });

  }
  onApproverNameChange = (e) => {
    const approverFullName = e.target.value;
    this.setState({ approverName: approverFullName });

  }

  onSubmit = e => {
    const { valueSelected, commentValue } = this.state;
    
    const { toggleSnackbarAndSetText } = this.props;
  };

  render() {
    let { match, userInfo } = this.props;

    const { handleCommentsChange, handleOptionsChange, onSubmit, onMobileChange, onDriverNameChange, onApproverNameChange } = this;
    const { valueSelected, commentValue, mobileNo, driverFullName, approverName } = this.state;
    const { trasformData, businessServiceData,applicationNumber } = this.props;
    
    return (
      
        <RejectBWTBokingHOC
          ontextAreaChange={handleCommentsChange}
          handleOptionChange={handleOptionsChange}
          commentValue={commentValue}
          mobileNumber={mobileNo}
          driverFullName={driverFullName}
          applicationNumber={applicationNumber}
          createdBy={userInfo.name}
          tenantId={userInfo.tenantId}
          onSubmit={onSubmit}
          bookingtype={trasformData.bkBookingType}
          bkStatus={trasformData.bkStatus}
          bookingservice={businessServiceData ? businessServiceData : ''}
          onMobileChange={onMobileChange}
          onDriverNameChange={onDriverNameChange}
          onApproverNameChange={onApproverNameChange}
          approverName={approverName}
        />
      
    );
  }
}

const mapStateToProps = state => {
  const { bookings = {} } = state || {};
  const { applicationData } = bookings;
  let trasformData = applicationData.bookingsModelList[0];
  let businessServiceData = applicationData.businessService;
  return { trasformData, businessServiceData };
}


const mapDispatchToProps = dispatch => {
  return {
    fetchApplications: criteria => dispatch(fetchApplications(criteria)),
    handleFieldChange: (formKey, fieldKey, value) =>
      dispatch(handleFieldChange(formKey, fieldKey, value)),
    toggleSnackbarAndSetText: (open, message, error) =>
      dispatch(toggleSnackbarAndSetText(open, message, error))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RejectBWTBooking);
