import React, { Component } from "react";
import { connect } from "react-redux";
import formHOC from "egov-ui-kit/hocs/form";
import { Screen } from "modules/common";
import ApplicationResolvedForm from "./components/ApplicationResolvedForm";
import { fetchApplications } from"egov-ui-kit/redux/bookings/actions";
import Label from "egov-ui-kit/utils/translationNode";
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";
import { handleFieldChange } from "egov-ui-kit/redux/form/actions";
import "./index.css";

const ApplicationResolvedHOC = formHOC({
  formKey: "approveBooking",
  isCoreConfiguration:'false'
})(ApplicationResolvedForm);


class ApplicationResolved extends Component {
  state = {
    valueSelected: "",
    commentValue: ""
  };
  componentDidMount() {
     let { fetchApplications, match, userInfo,applicationNumber } = this.props;
    fetchApplications(
      { 'uuid': userInfo.uuid, "applicationNumber": applicationNumber,
      "applicationStatus":"",
      "mobileNumber":"",
      "bookingType":"",
      "tenantId":userInfo.tenantId }
      
    );
  }
  commentsValue = {};
  handleCommentsChange = (e, value) => {
    this.commentsValue.textVal = e.target.value;
    this.setState({
      commentValue: e.target.value
    });
    
  };
  handleOptionsChange = (event, value) => {
  };
  concatComments = val => {
    this.props.handleFieldChange("approveBooking", "comments", this.state.commentValue);
  };

  onSubmit = e => {
  };

  render() {
    let { match, userInfo } = this.props;

    const { handleCommentsChange, handleOptionsChange, onSubmit } = this;
    const { valueSelected, commentValue } = this.state;
    const { trasformData, businessServiceData,applicationNumber } = this.props;
  
    return (
      
        <ApplicationResolvedHOC
          
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
    fetchApplications: (criteria, hasUsers, overWrite) =>
      dispatch(fetchApplications(criteria, hasUsers, overWrite)),
    handleFieldChange: (formKey, fieldKey, value) =>
      dispatch(handleFieldChange(formKey, fieldKey, value)),
    toggleSnackbarAndSetText: (open, message, error) =>
      dispatch(toggleSnackbarAndSetText(open, message, error))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ApplicationResolved);
