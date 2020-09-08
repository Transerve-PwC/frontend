import React, { Component } from "react";
import { Card, TextField, Button,AutoSuggestDropdown } from "components";
import { fetchComplaints } from "egov-ui-kit/redux/complaints/actions";
import Label from "egov-ui-kit/utils/translationNode";
import { Complaints, Screen } from "modules/common";
import { getTranslatedLabel } from "egov-ui-kit/utils/commons";
import {
  transformComplaintForComponent,
  fetchFromLocalStorage
} from "egov-ui-kit/utils/commons";
import isEqual from "lodash/isEqual";
import { connect } from "react-redux";
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";
import "./index.css";

const roleFromUserInfo = (roles = [], role) => {
  const roleCodes = roles.map(role => {
    return role.code;
  });
  return roleCodes && roleCodes.length && roleCodes.indexOf(role) > -1
    ? true
    : false;
};

const displayStatus = (status = "") => {
  let statusObj = {};
  if (status.toLowerCase().includes("overdue")) {
    statusObj.status = status; //Replace by localisation label
    statusObj.statusMessage = "";
  }
  if (status.toLowerCase().includes("left")) {
    statusObj.status = status; //Replace by localisation label
    statusObj.statusMessage = "";
  }
  return statusObj;
};

class SearchScreen extends Component {
  state = {
    complaintNo: "",
    mobileNo: "",
    complaints: [],
    search: false,
    value: 0,
    errorText: "",
    noComplaintMessage: "ES_MYCOMPLAINTS_NO_COMPLAINTS_ASSIGNED",
    categoriesArr : [],
    deptname:""
  };

  componentDidMount = async () => {
    // let { fetchComplaints } = this.props;
    // fetchComplaints([{ key: "status", value: "assigned,open,reassignrequested,closed,rejected,resolved" }], true, true);
    this.setState({
      noComplaintMessage: ""
    });
    let inputType = document.getElementsByTagName("input");
    for (let input in inputType) {
      if (inputType[input].type === "number") {
        inputType[input].addEventListener("mousewheel", function() {
          this.blur();
        });
      }
    }
  };
  getLocalizedLabel = (label) => {
    const { localizationLabels } = this.props;
    return getTranslatedLabel(label, localizationLabels);
  };
  department = {
    id: "department",
    jsonPath: "services[0].department",
    floatingLabelText: this.getLocalizedLabel("Department"),
    hintText: this.getLocalizedLabel("select department"),
    errorMessage: this.getLocalizedLabel("HR_DEPARTMENT_PLACEHOLDER"),
    boundary: true,
    dropDownData: [],
    errorStyle: { position: "absolute", bottom: -8, zIndex: 5 },
    errorText: "",
}

  onComplaintClick = complaintNo => {
    this.props.history.push(`/complaint-details/${complaintNo}`);
  };

  onComplaintChange = e => {
    // const inputValue = e.target.value;
    // this.setState({ complaintNo: inputValue });
    const complaintNo = e.target.value;
    this.setState({ complaintNo });
    if (complaintNo.length < 6) {
      this.setState({
        errorText: "ERR_COMPLAINT_NUMBER_SEARCH"
      });
    } else {
      this.setState({ errorText: "" });
    }
  };

  onMobileChange = e => {
    const inputValue = e.target.value;
    this.setState({ mobileNo: inputValue });
  };

  onSearch = () => {
    const { complaintNo, mobileNo,categoriesArr } = this.state;
    const { fetchComplaints, toggleSnackbarAndSetText } = this.props;
    let queryObj = [];
    if (complaintNo) {
      queryObj.push({ key: "serviceRequestId", value: complaintNo });
    }
    if (mobileNo) {
      queryObj.push({ key: "phone", value: mobileNo });
    }
    if(categoriesArr.length > 0){
      const allCategory = categoriesArr.map(cat => cat.label)
      queryObj.push({ key: "category", value: allCategory });
    }
    if (complaintNo) {
      if (complaintNo.length >= 6) {
        fetchComplaints(queryObj, true, true);
      } else {
        toggleSnackbarAndSetText(
          true,
          {
            labelName: "Entered value is less than 6 characters in length.",
            labelKey: `ERR_VALUE_LESS_THAN_SIX_CHARACTERS`
          },
          "error"
        );
      }
    } else if (mobileNo) {
      fetchComplaints(queryObj, true, true);
    }
    else if (categoriesArr.length > 0) {
      fetchComplaints(queryObj, true, true);
    }
    // if (complaintNo || mobileNo) {
    //   fetchComplaints(queryObj, true, true);
    // }
    this.setState({
      search: true,
      noComplaintMessage: "ES_MYCOMPLAINTS_NO_COMPLAINTS_ASSIGNED"
    });
  };

  clearSearch = () => {
    const { fetchComplaints } = this.props;
    fetchComplaints([{ key: "status", value: null }]);
    this.setState({
      mobileNo: "",
      complaintNo: "",
      search: false,
      noComplaintMessage: "",
      deptname:"",
      categoriesArr:[],
    });
  };

  onChange = value => {
    this.setState({ value });
  };

  render() {
    const hintTextStyle = {
      letterSpacing: "0.7px",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      width: "90%",
      overflow: "hidden"
    };
    const { loading, history, transformedComplaints, role,departmentName,categories } = this.props;
    const {
      mobileNo,
      complaintNo,
      search,
      errorText,
      noComplaintMessage,
      deptname
    } = this.state;
    const { onComplaintClick } = this;
    return (
      <Screen loading={loading}>
        <div className="form-without-button-cont-generic">
          <Card
            id="complaint-search-card"
            className="complaint-search-main-card"
            textChildren={
              <div className="complaint-search-cont clearfix">
                <div className="col-xs-12" style={{ paddingLeft: 8 }}>
                  <Label
                    label="CORE_COMMON_SEARCH_COMPLAINT"
                    fontSize={16}
                    dark={true}
                    bold={true}
                  />
                </div>
                <div
                  className="col-sm-4 col-xs-12"
                  style={{ paddingLeft: 8, paddingRight: 40 }}
                >
                  <TextField
                    id="mobile-no"
                    name="mobile-no"
                    type="number"
                    value={mobileNo}
                    hintText={
                      <Label
                        label="CORE_COMMON_MOBILE_NUMBER_PLACEHOLDER"
                        color="rgba(0, 0, 0, 0.3799999952316284)"
                        fontSize={16}
                        labelStyle={hintTextStyle}
                      />
                    }
                    floatingLabelText={
                      <Label
                        key={0}
                        label="ES_CREATECOMPLAINT_MOBILE_NUMBER"
                        color="rgba(0,0,0,0.60)"
                        fontSize="12px"
                      />
                    }
                    onChange={(e, value) => this.onMobileChange(e)}
                    underlineStyle={{ bottom: 7 }}
                    underlineFocusStyle={{ bottom: 7 }}
                    hintStyle={{ width: "100%" }}
                  />
                </div>
                <div className="col-sm-4 col-xs-12" style={{ paddingLeft: 8 }}>
                  <TextField
                    id="complaint-no"
                    name="complaint-no"
                    value={complaintNo}
                    hintText={
                      <Label
                        label="ES_MYCOMPLAINTS_COMPLAINT_NO"
                        color="rgba(0, 0, 0, 0.3799999952316284)"
                        fontSize={16}
                        labelStyle={hintTextStyle}
                      />
                    }
                    errorText={<Label label={errorText} color="red" />}
                    floatingLabelText={
                      <Label
                        key={1}
                        label="CS_COMPLAINT_SUBMITTED_COMPLAINT_NO"
                        color="rgba(0,0,0,0.60)"
                        fontSize="12px"
                      />
                    }
                    onChange={(e, value) => this.onComplaintChange(e)}
                    underlineStyle={{
                      bottom: 7,
                      borderBottom: "1px solid #e0e0e0"
                    }}
                    underlineFocusStyle={{
                      bottom: 7,
                      borderBottom: "1px solid #e0e0e0"
                    }}
                    hintStyle={{ width: "100%" }}
                  />
                </div>
                <div className="col-sm-4 col-xs-12" style={{ paddingLeft: 8 }}>
                <AutoSuggestDropdown
                className="fix-for-layout-break"
                fullWidth={true}
                onChange={(chosendepartment, index) => {

                  let filterCategory = categories.filter ( cat => cat.dept === chosendepartment.value);
                  console.log("categoris\es",filterCategory)
                    this.setState({categoriesArr : filterCategory , deptname:chosendepartment.label})
               //   prepareFinalObject("AutoroutingEscalationMap.category", chosenCity.label);
                }}
                {...this.department}
                dataSource={departmentName}
                value = {deptname}
                />
                  </div>
                <div
                  className="col-sm-12 col-xs-12 csr-action-buttons"
                  style={{ marginTop: 10, paddingRight: 8 , textAlign: "center"}}
                >
                  <Button
                    label={
                      <Label
                        buttonLabel={true}
                        label="ES_MYCOMPLAINTS_SEARCH_BUTTON"
                      />
                    }
                    style={{ marginRight: 28, width: "36%" }}
                    backgroundColor="#fe7a51"
                    labelStyle={{
                      letterSpacing: 0.7,
                      padding: 0,
                      color: "#fff"
                    }}
                    buttonStyle={{ border: 0 }}
                    onClick={() => this.onSearch()}
                  />
                  <Button
                    label={
                      <Label
                        buttonLabel={true}
                        color="#fe7a51"
                        label="ES_MYCOMPLAINTS_CLEAR_SEARCH_BUTTON"
                      />
                    }
                    labelStyle={{
                      letterSpacing: 0.7,
                      padding: 0,
                      color: "#fe7a51"
                    }}
                    buttonStyle={{ border: "1px solid #fe7a51" }}
                    style={{ width: "36%" }}
                    onClick={() => this.clearSearch()}
                  />
                </div>
              </div>
            }
          />
          <div>
            <Complaints
              noComplaintMessage={noComplaintMessage}
              onComplaintClick={onComplaintClick}
              complaints={noComplaintMessage ? transformedComplaints : []}
              role={role}
              complaintLocation={true}
            />
          </div>
        </div>
      </Screen>
    );
  }
}

const mapStateToProps = state => {
  const { complaints, common } = state || {};
  const { localizationLabels } = state.app;
  const { categoriesById, byId, complaintDepartment } = complaints;
  const { fetchSuccess, loading } = complaints;
  //const loading = !isEmpty(categoriesById) ? (fetchSuccess ? false : true) : true;
  const { citizenById, employeeById } = common || {};
  const { userInfo } = state.auth;
  const role =
    roleFromUserInfo(userInfo.roles, "GRO") ||
    roleFromUserInfo(userInfo.roles, "DGRO")
      ? "ao"
      : roleFromUserInfo(userInfo.roles, "CSR")
      ? "csr"
      : "employee";
  let transformedComplaints = transformComplaintForComponent(
    complaints,
    role,
    employeeById,
    citizenById,
    categoriesById,
    displayStatus
  );
  const departmentName = complaintDepartment && Object.values(complaintDepartment).map(dept => {
    let label = dept.name;
    let value = dept.code;
    return {
        label,
        value
    }
})
let categories =[];
if(categoriesById){
  Object.values(categoriesById).forEach(category => {
    let  dept = category.department;
    let value = category.menuPath;
    let label = category.menuPath;
    const cat = {
        dept ,
        value,
        label
    }
      if(!categories.some(item => item.value === cat.value))
           categories.push(cat)
  })
}

  return { role, loading, transformedComplaints,departmentName,categories,localizationLabels };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchComplaints: (criteria, hasUsers, overWrite) =>
      dispatch(fetchComplaints(criteria, hasUsers, overWrite)),
    toggleSnackbarAndSetText: (open, message, error) =>
      dispatch(toggleSnackbarAndSetText(open, message, error))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchScreen);
