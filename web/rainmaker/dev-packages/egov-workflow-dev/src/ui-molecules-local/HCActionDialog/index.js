import { Button, Dialog, DialogContent, Grid, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import { Container } from "egov-ui-framework/ui-atoms";
import { LabelContainer, TextFieldContainer } from "egov-ui-framework/ui-containers";
import { UploadMultipleFiles } from "egov-ui-framework/ui-molecules";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { httpRequest } from "egov-ui-framework/ui-utils/api";
import ImageUpload from "egov-ui-kit/common/common/ImageUpload";
import { getTenantId, getHCRoles, getUserInfo, getapplicationNumber } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import React from "react";
import store from "../../ui-redux/store";

import AutoSuggestDropdown from "egov-ui-kit/components/AutoSuggestDropdown";



import "./index.css";

const styles = theme => ({
  root: {
    marginTop: 24,
    width: "100%"
  }
});
export const commonConfigHcActionDialog = {

  tenantId: "ch.chandigarh"
};
const fieldConfig = {
  approverName: {
    label: {
      labelName: "Assignee Name",
      labelKey: "WF_ASSIGNEE_NAME_LABEL"
    },
    placeholder: {
      labelName: "Select assignee Name",
      labelKey: "WF_ASSIGNEE_NAME_PLACEHOLDER"
    }
  },
  comments: {
    label: {
      labelName: "Comments",
      labelKey: "WF_COMMON_COMMENTS"
    },
    placeholder: {
      labelName: "Enter Comments",
      labelKey: "WF_ADD_HOC_CHARGES_POPUP_COMMENT_LABEL"
    },
    required: true
  },
  roleName: {
    label: {
      labelName: "Role Name",
      labelKey: "WF_ROLE_LABEL"
    },
    placeholder: {
      labelName: "Select Role",
      labelKey: "WF_ROLE_PLACEHOLDER"
    },
    required: true
  },
};

class HCActionDialog extends React.Component {

  state = {
    employeeList: [],
    roles: "",
    allEmployeeList: [],
    allEmployeeListOfSDO: [],
    allEmployeeListOfJE: [],
    allEmployeeListOfCompletedStage: [],
    allRoleListOfForwardForCompletion: [],
    allRoleListrequestClarification: [],
    allRoleListForVerifyForClosure: [],


    handleChange: this.props.handleFieldChange,
    path: this.props.dataPath,


  };
  componentDidUpdate() {
    let { currentState } = this.props


    if (parseInt(currentState) && this.state.allEmployeeList.length > 0) {
      this.setState({ allEmployeeList: [] })
    }
  }
  componentDidMount() {

    var businessServiceData = JSON.parse(localStorage.getItem("businessServiceData"))
    this.getProcessInstanceDataForServiceRequest()

    // var finalRequestClarificationRoles = this.getCommonValuesFromHCRoles(requestClarificationRoleArrayFromProcessInstance, HCRoles)

    var HCRoles = [JSON.parse(getHCRoles())]
    this.setAllRoleListAsPerAction(businessServiceData, ['VERIFIED AND FORWARDED TO SDO', 'EDITED AT VERIFIED AND FORWARDED TO SDO'], 'FORWARD FOR INSPECTION', HCRoles)
    this.setAllRoleListAsPerAction(businessServiceData, ['INSPECTION', 'EDITED AT INSPECTION'], 'INSPECT', HCRoles)
    this.setAllRoleListAsPerAction(businessServiceData, ['FORWARDED FOR COMPLETION'], 'COMPLETE', HCRoles)
    this.setAllRoleListAsPerAction(businessServiceData, ['VERIFIED FOR CLOSURE', 'APPROVED'], 'VERIFY FOR CLOSURE', HCRoles)
  }




  getButtonLabelName = label => {

    switch (label) {

      case "VERIFY AND FORWARD":
        return "Verify and Forward";
      case "VERIFY AND FORWARD TO SDO":
        return "Verify and Forward to SDO";
      case "FORWARD FOR INSPECTION":
        return "Forward For Inspection";
      case "INSPECT":
        return "Inspect";
      case "REJECT":
        return "Reject";
      case "REQUEST CLARIFICATION":
        return "Request Clarification";
      case "APPROVE":
        return "APPROVE";
      case "COMPLETE":
        return "Complete";
      case "VERIFY FOR CLOSURE":
        return "Verify for Closure";
      case "FORWARD FOR COMPLETION":
        return "Forward for Completion";
      default:
        return label;
    }
  };

  getProcessInstanceDataForServiceRequest = async () => {

    var tenantIdCommonConfig

    if (getTenantId() != commonConfigHcActionDialog.tenantId) {
      tenantIdCommonConfig = JSON.parse(getUserInfo()).permanentCity
    }
    else {
      tenantIdCommonConfig = getTenantId()
    }
    const queryObj = [
      {
        key: "businessIds",
        value: getapplicationNumber()
      },
      {
        key: "tenantId",
        value: tenantIdCommonConfig
      },
      {
        key: "history",
        value: true
      },
    ];
    var payload = await httpRequest(
      "post",
      "/egov-workflow-v2/egov-wf/process/_search",
      "",
      queryObj
    );
    //sorting process instance data by time
    var SortedProcessInstanceBylastModifiedTimeOfEachObject = []
    var RoleListProcessInstance = []
    SortedProcessInstanceBylastModifiedTimeOfEachObject =
      payload &&
      payload.ProcessInstances.sort(function (a, b) {
        var valueA, valueB;

        valueA = a.auditDetails.lastModifiedTime;
        valueB = b.auditDetails.lastModifiedTime;
        if (valueA < valueB) {
          return -1;
        }
        else if (valueA > valueB) {
          return 1;
        }
        return 0;
      })

    RoleListProcessInstance = SortedProcessInstanceBylastModifiedTimeOfEachObject.map(item => item.assigner.roles)
    var RoleListSingleArray = []
    RoleListProcessInstance.forEach(RoleObject => {
      if (RoleObject.length > 1) {
        RoleObject.forEach(insideRoleObject => {
          RoleListSingleArray.push(insideRoleObject.code)
        });
      }
      else if (RoleObject.length === 1) {
        RoleListSingleArray.push(RoleObject[0].code)
      }
    });
    // console.log("###@$$#@#$@#$@#$23", RoleListSingleArray)
    // var finalRoleListSingleArray = RoleListSingleArray.map(role => role.code);
    var HCRoles = [JSON.parse(getHCRoles())]
    var finalRequestClarificationRoles = this.getCommonValuesFromHCRoles(RoleListSingleArray, HCRoles)
    var reversedfinalRequestClarificationRoles = finalRequestClarificationRoles.reverse()
    var finalMappedValues = reversedfinalRequestClarificationRoles.map((item, index) => {
      // const name = get(item, "user.name")     
      return {
        value: item.code,
        label: item.name
      };
    });
    this.setState({ allRoleListrequestClarification: finalMappedValues })
    // return finalRoleListSingleArray

  }

  getCommonValuesFromHCRoles = (roleArray, HCRoles) => {
    var commonRoles = []
    roleArray.map(function (element) {
      HCRoles[0].map(function (elementHCRole) {
        if (elementHCRole.code === element) {
          if (!commonRoles.includes(elementHCRole)) {
            commonRoles.push(elementHCRole)
          }
        }
      })
    });


    return commonRoles
  }
  parseJSONBasedOnActionToReturnRoleList = (businessServiceData, applicationStatusArray, actionToBeChecked) => {

    var inspectionStates = businessServiceData[0].states.filter(function (state) {
      if (applicationStatusArray.includes(state.applicationStatus))
        return state
    });
    var allRoleListInspection = []
    var allActionsListInspection = []

    allActionsListInspection = inspectionStates.map(element => element.actions)

    var roleList = []
    allActionsListInspection.map(function (ActionsElement) {
      ActionsElement.map(function (eachActionsElement) {
        if (eachActionsElement.action == actionToBeChecked) {
          roleList = eachActionsElement.roles
          allRoleListInspection.push(...roleList)
        }
      })
    });

    var uniqueRoleList = allRoleListInspection.filter((a, b) => allRoleListInspection.indexOf(a) === b)
    return uniqueRoleList

  }
  setAllRoleListAsPerAction = (businessServiceData, applicationStatusList, action, HCRoles) => {
    var roleArray = this.parseJSONBasedOnActionToReturnRoleList(businessServiceData, applicationStatusList, action)
    var commonRoleList = this.getCommonValuesFromHCRoles(roleArray, HCRoles);
    if (action === "COMPLETE") {
      var finalRoleListForwardForCompletion = []

      commonRoleList.map((item) => {
        finalRoleListForwardForCompletion.push({
          value: item.code,
          label: item.name
        })

      });
      this.setState({ allRoleListOfForwardForCompletion: finalRoleListForwardForCompletion });
    }

    //removed common roles for verify for closure and complete
    if (action === "VERIFY FOR CLOSURE") {
      var finalRoleListVerifyForClosure = []

      //getting role list for complete
      var HCRoles = [JSON.parse(getHCRoles())]
      var roleArrayForComplete = this.parseJSONBasedOnActionToReturnRoleList(businessServiceData, ['FORWARDED FOR COMPLETION'], 'COMPLETE')
      var roleListForComplete = this.getCommonValuesFromHCRoles(roleArrayForComplete, HCRoles);
      //role list for complete obtained above


      //excluding role list  of complete       
      if (roleListForComplete != undefined && roleListForComplete != 0) {
        var RoleListForVerifyForClosure = commonRoleList.filter(function (RoleFromCommonRoleList) {
          return !roleListForComplete.find(function (RoleFromCompleteState) {
            return RoleFromCommonRoleList.code === RoleFromCompleteState.code
          })
        })


        //setting the final rolelist here with value label 
        RoleListForVerifyForClosure.map((item) => {
          finalRoleListVerifyForClosure.push({
            value: item.code,
            label: item.name
          })

        });
      }
      else {
        commonRoleList.map((item) => {
          finalRoleListVerifyForClosure.push({
            value: item.code,
            label: item.name
          })

        });

      }
      this.setState({ allRoleListForVerifyForClosure: finalRoleListVerifyForClosure });

    }
    var roleListForAction = commonRoleList.map(role => role.code);
    this.setEmployeeListInStateAsPerAction(roleListForAction, action)
  }
  setEmployeeListInStateAsPerAction = async (rolename, roleAction) => {
    const tenantId = getTenantId();
    const queryObj = [
      {
        key: "roles",
        value: rolename
      },
      {
        key: "tenantId",
        value: tenantId
      }
    ];
    const payload = await httpRequest(
      "post",
      "/egov-hrms/employees/_search",
      "",
      queryObj
    );
    // debugger;


    var dropdownEmployeeList = []
    dropdownEmployeeList =
      payload &&
      payload.Employees.map((item, index) => {
        const name = get(item, "user.name")
        return {
          value: item.id + "#" + item.uuid,
          label: name
        };
      });

    if (roleAction === 'FORWARD FOR INSPECTION') {
      this.setState({ allEmployeeListOfSDO: dropdownEmployeeList });

    }
    if (roleAction === 'COMPLETE') {
      this.setState({ allEmployeeListOfCompletedStage: dropdownEmployeeList });
    }
    else if (roleAction === 'INSPECT') {
      this.setState({ allEmployeeListOfJE: dropdownEmployeeList });
    }
  }
  getEmployeeList = async (rolename) => {

    const tenantId = getTenantId();
    const queryObj = [
      {
        key: "roles",
        value: rolename
      },
      {
        key: "tenantId",
        value: tenantId
      }
    ];
    const payload = await httpRequest(
      "post",
      "/egov-hrms/employees/_search",
      "",
      queryObj
    );
    // debugger;


    var dropdownEmployeeList = []
    dropdownEmployeeList =
      payload &&
      payload.Employees.map((item, index) => {
        const name = get(item, "user.name")
        return {
          value: item.id + "#" + item.uuid,
          label: name
        };
      });
    this.setState({ allEmployeeList: dropdownEmployeeList });
    // console.log("RRRRRrr",employeeListData)

  }

  render() {

    let {
      open,
      onClose,
      dropDownData,
      handleFieldChange,
      onButtonClick,
      dialogData,
      dataPath,

    } = this.props;
    const {
      buttonLabel,
      showEmployeeList,
      dialogHeader,
      moduleName,
      isDocRequired,

      // dispatch
    } = dialogData;



    const { getButtonLabelName } = this;
    let { state } = this.props


    try {
      let servicerequestmedia = get(state, "form.workflow.files.wfDocuments");
      let media = []


      servicerequestmedia.map((item, index) => {
        media.push({
          fileName: item.file.name || "document",
          fileStoreId: item.fileStoreId,
          documentType: item.file.type || "image"
        })

      });

      store.dispatch(prepareFinalObject("services[0].wfDocuments", media));
    }
    catch (e) {

    }
    let fullscreen = false;
    if (window.innerWidth <= 768) {
      fullscreen = true;
    }
    dataPath = `${dataPath}[0]`;
    return (

      <Dialog
        fullScreen={fullscreen}
        open={open}
        onClose={onClose}
        maxWidth={false}
        // style={{zIndex:2000}}
        style={{ top: "10%" }}
      >
        <DialogContent
          children={
            <Container
              children={
                <Grid
                  container="true"
                  spacing={12}
                  marginTop={16}
                  className="action-container"
                >
                  <Grid
                    style={{
                      alignItems: "center",
                      display: "flex",
                      maxWidth: "80%"
                    }}
                    item
                    sm={10}
                  >
                    <Typography component="h2" variant="subheading">
                      <LabelContainer {...dialogHeader} />
                    </Typography>
                  </Grid>

                  <Grid
                    item
                    sm={2}
                    style={{
                      textAlign: "right",
                      cursor: "pointer",
                      position: "absolute",
                      right: "16px",
                      top: "16px"
                    }}
                    onClick={onClose
                    }
                  >
                    <CloseIcon />
                  </Grid>


                  {/* non mandatory assignee list of SDO*/}
                  {(buttonLabel === "VERIFY AND FORWARD TO SDO") && showEmployeeList && (
                    <Grid
                      item
                      sm="12"
                      style={{
                        marginTop: 16
                      }}
                    >
                      
                      <div>

                        <LabelContainer
                          labelName="Assignee Name"
                          labelKey="WF_ASSIGNEE_NAME_LABEL"
                        />
                        {/* </div> */}
                        <AutoSuggestDropdown
                          style={{ marginRight: "15px", width: "100%" }}
                          // label= {{ labelName: "Assignee Name",
                          // labelKey:"WF_ASSIGNEE_NAME_LABEL"}}
                          placeholder={"Select Assignee Name"}
                          className="fix-for-layout-break"
                          fullWidth={true}
                          dataSource={this.state.allEmployeeListOfSDO}
                          onChange={e => { handleFieldChange(`${dataPath}.assignee`, [e.value]) }}

                          {...this.state.allEmployeeListOfSDO}
                        />

                      </div>


                    </Grid>)}





                  {/* non mandatory assignee list of JE */}
                  {(buttonLabel === "FORWARD FOR INSPECTION") && showEmployeeList && (

                    <Grid
                      item
                      sm="12"
                      style={{
                        marginTop: 16
                      }}
                    >
                      <div
                        >

                        <LabelContainer
                          labelName="Assignee Name"
                          labelKey="WF_ASSIGNEE_NAME_LABEL"
                        />
                      
                      <AutoSuggestDropdown
                        style={{ marginRight: "15px", width: "100%" }}
                        label={"WF_ASSIGNEE_NAME_PLACEHOLDER"}
                        placeholder={"Select Assignee Name"}
                        className="fix-for-layout-break"
                        fullWidth={true}
                        dataSource={this.state.allEmployeeListOfJE}
                        onChange={e => { handleFieldChange(`${dataPath}.assignee`, [e.value]) }}

                        {...this.state.allEmployeeListOfJE}
                      />
</div>
                    </Grid>)}


                  {/* mandatory role  list verify forward*/}
                  {(buttonLabel === "VERIFY AND FORWARD") && showEmployeeList && (
                    <Grid
                      item
                      sm="12"
                      style={{
                        marginTop: 16
                      }}
                    >
                      <TextFieldContainer
                        select={true}
                        style={{ marginRight: "15px", width: "100%" }}
                        label={fieldConfig.roleName.label}
                        placeholder={fieldConfig.roleName.placeholder}
                        data={dropDownData}
                        optionValue="value"
                        optionLabel="label"
                        hasLocalization={false}
                        onChange={e => { handleFieldChange(`${dataPath}.roleList`, [e.target.value]); handleFieldChange(`${dataPath}.assignee`, []); this.getEmployeeList(e.target.value) }}
                        jsonPath={`${dataPath}.roleList[0]`}
                      />
                    </Grid>
                  )}

                  {/* mandatory role  list of REQUEST CLARIFICATION*/}
                  {(buttonLabel === "REQUEST CLARIFICATION") && showEmployeeList && (
                    <Grid
                      item
                      sm="12"
                      style={{
                        marginTop: 16
                      }}
                    >

                      <TextFieldContainer
                        select={true}
                        style={{ marginRight: "15px", width: "100%" }}
                        label={fieldConfig.roleName.label}
                        placeholder={fieldConfig.roleName.placeholder}
                        data={this.state.allRoleListrequestClarification}

                        optionValue="value"
                        optionLabel="label"
                        // value = {this.state.allRoleListrequestClarification[0].value}
                        hasLocalization={false}
                        onChange={e => { handleFieldChange(`${dataPath}.roleList`, [e.target.value]); handleFieldChange(`${dataPath}.assignee`, []); this.getEmployeeList(e.target.value) }}

                        // onChange={this.props.onChange; this.handleChange}
                        jsonPath={`${dataPath}.roleList[0]`}
                      />
                    </Grid>
                  )}
                  {/* mandatory role  list of Verify for closure*/}
                  {(buttonLabel === "VERIFY FOR CLOSURE") && showEmployeeList && (
                    <Grid
                      item
                      sm="12"
                      style={{
                        marginTop: 16
                      }}
                    >

                      <TextFieldContainer
                        select={true}
                        style={{ marginRight: "15px", width: "100%" }}
                        label={fieldConfig.roleName.label}
                        placeholder={fieldConfig.roleName.placeholder}
                        data={this.state.allRoleListForVerifyForClosure}
                        optionValue="value"
                        optionLabel="label"
                        hasLocalization={false}
                        onChange={e => { handleFieldChange(`${dataPath}.roleList`, [e.target.value]); handleFieldChange(`${dataPath}.assignee`, []); this.getEmployeeList(e.target.value) }}
                        jsonPath={`${dataPath}.roleList[0]`}
                      />
                    </Grid>
                  )}
                  {/* mandatory role list for Forward for closure*/}
                  {(buttonLabel === "FORWARD FOR COMPLETION") && showEmployeeList && (
                    <Grid
                      item
                      sm="12"
                      style={{
                        marginTop: 16
                      }}
                    >
                      <TextFieldContainer
                        select={true}
                        style={{ marginRight: "15px", width: "100%" }}
                        label={fieldConfig.roleName.label}
                        placeholder={fieldConfig.roleName.placeholder}
                        data={this.state.allRoleListOfForwardForCompletion}
                        optionValue="value"
                        optionLabel="label"
                        hasLocalization={false}
                        onChange={e => { handleFieldChange(`${dataPath}.roleList`, [e.target.value]); handleFieldChange(`${dataPath}.assignee`, []); this.getEmployeeList(e.target.value) }}

                        // onChange={this.props.onChange; this.handleChange}
                        jsonPath={`${dataPath}.roleList[0]`}
                      />
                    </Grid>
                  )}



                  {/* non mandatory assignee for 
                  VERIFY AND FORWARD
                   REQUEST CLARIFICATION,
                   APPROVE 
                   VERIFY FOR CLOSURE
                    FORWARD FOR COMPLETION */}
                  {(buttonLabel === "REQUEST CLARIFICATION" ||
                    buttonLabel === "VERIFY AND FORWARD" ||
                    buttonLabel === "FORWARD FOR COMPLETION" ||
                    buttonLabel === "VERIFY FOR CLOSURE") && showEmployeeList && (
                      <Grid
                        item
                        sm="12"
                        style={{
                          marginTop: 16
                        }}
                      >

                        <div >

                          <LabelContainer
                            labelName="Assignee Name"
                            labelKey="WF_ASSIGNEE_NAME_LABEL"
                          />
                        
                        
                        <LabelContainer
                          labelName="Assignee Name"
                          labelKey="WF_ASSIGNEE_NAME_LABEL"
                        />
                        <AutoSuggestDropdown
                          style={{ marginRight: "15px", width: "100%" }}
                          label={"WF_ASSIGNEE_NAME_PLACEHOLDER"}
                          placeholder={"Select Assignee Name"}
                          className="fix-for-layout-break"
                          fullWidth={true}
                          dataSource={this.state && this.state.allEmployeeList}
                          onChange={e => { handleFieldChange(`${dataPath}.assignee`, [e.value]) }}
                          {...this.state.allEmployeeList}
                        />
                        </div>
                      </Grid>

                    )}







                  {/* code for comments is just here not anywhere else, after this, button code starts */}
                  <Grid item sm="12">

                    <label className="commentsLabel">{fieldConfig.comments.label.labelName} *</label>
                    <textarea className="form-control comments" rows="5" placeholder={fieldConfig.comments.placeholder.labelName} onChange={e => handleFieldChange(`${dataPath}.comment`, e.target.value)} maxLength={250} />
                  </Grid>

                  {/*button and image code starts */}
                  {/*only upload already captured documents, image, PDF */}
                  {(buttonLabel === "VERIFY AND FORWARD TO SDO" || buttonLabel === "VERIFY AND FORWARD" || buttonLabel === "REQUEST CLARIFICATION" || buttonLabel === "APPROVE" || buttonLabel === "REJECT" || buttonLabel === "FORWARD FOR INSPECTION" || buttonLabel === "FORWARD FOR COMPLETION" || buttonLabel === "VERIFY FOR CLOSURE") && (<Grid item sm="12">
                    <Typography
                      component="h3"
                      variant="subheading"
                      style={{
                        color: "rgba(0, 0, 0, 0.8700000047683716)",
                        fontFamily: "Roboto",
                        fontSize: "14px",
                        fontWeight: 400,
                        lineHeight: "20px",
                        marginBottom: "8px"
                      }}
                    >
                      <div className="rainmaker-displayInline">

                        {isDocRequired && (
                          <span style={{ marginLeft: 5, color: "red" }}>*</span>
                        )}
                      </div>
                    </Typography>
                    <div
                      style={{
                        color: "rgba(0, 0, 0, 0.60)",
                        fontFamily: "Roboto",
                        fontSize: "14px",
                        fontWeight: 400,
                        lineHeight: "20px"
                      }}
                    >
                      <LabelContainer
                        labelName="Only .jpg and .pdf files. 5MB max file size."
                        labelKey="WF_APPROVAL_UPLOAD_SUBHEAD"
                      />
                    </div>
                    <UploadMultipleFiles
                      maxFiles={4}
                      inputProps={{
                        accept: "image/*, .pdf, .png, .jpeg"
                      }}
                      buttonLabel={{ labelName: "UPLOAD FILES", labelKey: "HC_UPLOAD_FILES_BUTTON" }}
                      jsonPath={`${dataPath}.wfDocuments`}
                      maxFileSize={5000}
                    />
                    <LabelContainer
                      labelName="Upload Document Should be less than 5MB"
                      labelKey="HC_UPLOAD_DOCUMENT_MSG_LABEL"
                    />
                    <Grid sm={12} style={{ textAlign: "right" }} className="bottom-button-container">
                      <Button
                        variant={"contained"}
                        color={"primary"}
                        style={{
                          minWidth: "200px",
                          height: "48px",
                          marginBottom: "8px",
                        }}
                        className="bottom-button"
                        onClick={() =>
                          onButtonClick(buttonLabel, isDocRequired)
                        }
                      >
                        <LabelContainer
                          labelName={getButtonLabelName(buttonLabel)}
                          labelKey={
                            moduleName
                              ? `WF_${moduleName.toUpperCase()}_${buttonLabel}`
                              : ""
                          }
                        />
                      </Button>
                    </Grid>
                  </Grid>
                  )}

                  {/* upload camera image */}
                  {(buttonLabel === "INSPECT" || buttonLabel === "COMPLETE") && (<Grid item sm="12">
                    <Typography
                      component="h3"
                      variant="subheading"
                      style={{
                        color: "rgba(0, 0, 0, 0.8700000047683716)",
                        fontFamily: "Roboto",
                        fontSize: "14px",
                        fontWeight: 400,
                        lineHeight: "20px",
                        marginBottom: "8px"
                      }}
                    >
                      <div className="rainmaker-displayInline">
                        {isDocRequired && (
                          <span style={{ marginLeft: 5, color: "red" }}>*</span>
                        )}
                      </div>
                    </Typography>
                    <div
                      style={{
                        color: "rgba(0, 0, 0, 0.60)",
                        fontFamily: "Roboto",
                        fontSize: "14px",
                        fontWeight: 400,
                        lineHeight: "20px"
                      }}
                    >
                      <LabelContainer
                        labelName="Only .jpg and .pdf files. 5MB max file size."
                        labelKey="WF_APPROVAL_UPLOAD_SUBHEAD"
                      />
                    </div>
                    <ImageUpload module="egov-workflow" formKey={"workflow"} fieldKey={`wfDocuments`} />

                    <Grid sm={12} style={{ textAlign: "right", marginTop: "16px", paddingTop: "10px" }} className="bottom-button-container">
                      <Button
                        variant={"contained"}
                        color={"primary"}
                        style={{
                          minWidth: "200px",
                          height: "48px",
                          marginBottom: "8px",
                        }}
                        className="bottom-button"
                        onClick={() =>
                          onButtonClick(buttonLabel, isDocRequired)
                        }
                      >
                        <LabelContainer
                          labelName={getButtonLabelName(buttonLabel)}
                          labelKey={
                            moduleName
                              ? `WF_${moduleName.toUpperCase()}_${buttonLabel}`
                              : ""
                          }
                        />
                      </Button>
                    </Grid>
                  </Grid>
                  )}

                </Grid>
              }
            />
          }
        />
      </Dialog>
    );

  }
}
export default withStyles(styles)(HCActionDialog);
