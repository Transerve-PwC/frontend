import React, { Component } from "react";
import { connect } from "react-redux";
import formHOC from "egov-ui-kit/hocs/form";
import { Screen } from "modules/common";
import RejectApplicationForm from "./components/RejectApplicationForm";
import { fetchApplications } from "egov-ui-kit/redux/bookings/actions";
import Label from "egov-ui-kit/utils/translationNode";
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";
import { handleFieldChange } from "egov-ui-kit/redux/form/actions";
import "./index.css";

const RejectApplicationHOC = formHOC({
  formKey: "rejectBooking",
  isCoreConfiguration: 'false',
})(RejectApplicationForm);


class RejectComplaint extends Component {
  state = {
    valueSelected: "",
    commentValue: ""
  };
  componentDidMount() {
     let { fetchApplications, match, userInfo,applicationNumber } = this.props;
    fetchApplications(
      { 'uuid': userInfo.uuid, "applicationNumber": applicationNumber,
      "applicationStatus":"",
      "mobileNumber":"","bookingType":"",
      "tenantId":userInfo.tenantId }
      
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
    this.props.handleFieldChange("rejectBooking", "comments", concatvalue);
  };

  onSubmit = e => {

    const { valueSelected, commentValue } = this.state;
    
    const { toggleSnackbarAndSetText } = this.props;
  };

  render() {
    let { match, userInfo } = this.props;

    const { handleCommentsChange, handleOptionsChange, onSubmit } = this;
    const { valueSelected, commentValue } = this.state;
    const { trasformData, businessServiceData,applicationNumber } = this.props;
    
    return (
      
        <RejectApplicationHOC
          
          ontextAreaChange={handleCommentsChange}
          handleOptionChange={handleOptionsChange}
          
          commentValue={commentValue}
          applicationNumber={applicationNumber}
          createdBy={userInfo.name}
          tenantId={userInfo.tenantId}
          onSubmit={onSubmit}
          bookingtype={trasformData.bkBookingType}
          bookingservice={businessServiceData?businessServiceData:''}
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
)(RejectComplaint);
