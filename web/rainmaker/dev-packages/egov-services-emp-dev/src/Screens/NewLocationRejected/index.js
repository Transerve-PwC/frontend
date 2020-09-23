import React, { Component } from "react";
import { connect } from "react-redux";
import formHOC from "egov-ui-kit/hocs/form";
import { Screen } from "modules/common";
import NewLocationRejectedForm from "./components/NewLocationRejectedForm";
import { fetchMccApplications } from "egov-ui-kit/redux/bookings/actions";
import Label from "egov-ui-kit/utils/translationNode";
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";
import { handleFieldChange } from "egov-ui-kit/redux/form/actions";
import "./index.css";

const NewLocationRejectHOC = formHOC({
  formKey: "rejectNewLocation",
  isCoreConfiguration: 'false',
})(NewLocationRejectedForm);


class RejectNewLocation extends Component {
  state = {
    valueSelected: "",
    commentValue: ""
  };
  componentDidMount() {
      let { fetchMccApplications, match, userInfo,applicationNumber } = this.props;
   
    fetchMccApplications(
      { 'uuid': userInfo.uuid, "applicationNumber": applicationNumber,
      "applicationStatus":"",
      "mobileNumber":"","bookingType":"","tenantId":userInfo.tenantId }
      // { "applicationNumber": match.params.applicationId }
    );
  }

  options = [
    {
      value: "Not a valid application",
      label: <Label label="ES_REASSIGN_OPTION_ONE" />
    },
    {
      value: "Out of operational scope",
      label: <Label label="ES_REJECT_OPTION_TWO" />
    },
    { value: "Operation already underway", label: <Label label="ES_REJECT_OPTION_THREE" /> },
    { value: "Other", label: <Label label="ES_REJECT_OPTION_FOUR" /> }
  ];

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
    this.props.handleFieldChange("rejectNewLocation", "comments", concatvalue);
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
        <NewLocationRejectHOC
          // options={this.options}
          ontextAreaChange={handleCommentsChange}
          handleOptionChange={handleOptionsChange}
          // optionSelected={valueSelected}
          commentValue={commentValue}
          applicationNumber={applicationNumber}
          createdBy={userInfo.name}
          tenantId={userInfo.tenantId}
          onSubmit={onSubmit}
          // bookingtype={trasformData.bkBookingType}
          bookingservice={businessServiceData?businessServiceData:''}
        />
    );
  }
}

const mapStateToProps = state => {
  const { bookings = {} } = state || {};
  const { MccApplicationData } = bookings;
 
  let trasformData = MccApplicationData?MccApplicationData.osujmNewLocationModelList[0]:'';
  let businessServiceData = MccApplicationData.businessService;
  return { trasformData, businessServiceData };
}


const mapDispatchToProps = dispatch => {
  return {
    fetchMccApplications: criteria => dispatch(fetchMccApplications(criteria)),
    handleFieldChange: (formKey, fieldKey, value) =>
      dispatch(handleFieldChange(formKey, fieldKey, value)),
    toggleSnackbarAndSetText: (open, message, error) =>
      dispatch(toggleSnackbarAndSetText(open, message, error))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RejectNewLocation);
