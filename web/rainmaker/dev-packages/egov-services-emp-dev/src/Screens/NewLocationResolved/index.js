import React, { Component } from "react";
import { connect } from "react-redux";
import formHOC from "egov-ui-kit/hocs/form";
import { Screen } from "modules/common";
import NewLocationResolvedForm from "./components/NewLocationResolvedForm";
import { fetchMccApplications } from "egov-ui-kit/redux/bookings/actions";
import Label from "egov-ui-kit/utils/translationNode";
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";
import { handleFieldChange } from "egov-ui-kit/redux/form/actions";
import "./index.css";
import { httpRequest } from "egov-ui-kit/utils/api";

const NewLocationResolvedHOC = formHOC({
  formKey: "approveLocation",
  isCoreConfiguration: 'false',
})(NewLocationResolvedForm);


class NewLocationResolved extends Component {
  state = {
    valueSelected: "",
    commentValue: "",
    assignee:"",
    assignToMe:[],
    setOpen: false
  };
  async componentDidMount() {
    let { fetchMccApplications, match, userInfo,applicationNumber,trasformData } = this.props;
    
    fetchMccApplications(
      { 'uuid': userInfo.uuid, "applicationNumber": applicationNumber,
      "applicationStatus":"",
      "mobileNumber":"","bookingType":"","tenantId":userInfo.tenantId }
    );
    let requestbody={"applicationNumber": applicationNumber, "sector":trasformData.sector, "action":trasformData.action}
    let AssigneeFromAPI = await httpRequest(
			"bookings/api/employee/assignee/_search",
			"_search",[],
			requestbody
    );
   
    this.setState({
			assignToMe: AssigneeFromAPI
		})
  }

  

  commentsValue = {};

  handleCommentsChange = (e, value) => {
    this.commentsValue.textVal = e.target.value;
    this.setState({
      commentValue: e.target.value
    });
    this.concatComments(this.commentsValue);
  };

  handleChangeAssigneeData= (e, value) => {
    this.setState({
      assignee: e.target.value
    });

  }
  handleClose = () => {
    this.setState({
      setOpen: false
    })
  };

  handleOpen = () => {
    this.setState({
      setOpen: true
    })
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
    this.props.handleFieldChange("approveLocation", "comments", concatvalue);
  };

  onSubmit = e => {
    const { valueSelected, commentValue } = this.state;
    const { toggleSnackbarAndSetText } = this.props;
  };

  render() {
    let { match, userInfo } = this.props;

    const { handleCommentsChange, handleOptionsChange, onSubmit,handleChangeAssigneeData ,handleOpen,handleClose} = this;
    const { valueSelected, commentValue ,assignee,assignToMe} = this.state;
    const { trasformData, businessServiceData,applicationNumber } = this.props;
    const foundFirstLavels = userInfo && userInfo.roles.some(el => el.code === 'BK_MCC_APPROVER');
   
    return (
      
        <NewLocationResolvedHOC
          // options={this.options}
          handleOpen={handleOpen}
          handleClose={handleClose}
          handleChangeAssignee={handleChangeAssigneeData}
          ontextAreaChange={handleCommentsChange}
          handleOptionChange={handleOptionsChange}
          // optionSelected={valueSelected}
          commentValue={commentValue}
          foundFirstLavels={foundFirstLavels}
          assignee={assignee}
          assignToMe={assignToMe}
          applicationNumber={applicationNumber}
          createdBy={userInfo.name}
          tenantId={userInfo.tenantId}
          onSubmit={onSubmit}
          userInfo={userInfo}
          // bookingtype={trasformData.bkBookingType}
          bookingservice={businessServiceData?businessServiceData:''}
          setOpen={this.state.setOpen}
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
)(NewLocationResolved);
