import React from "react";
import { connect } from "react-redux";
import { Grid, Typography, Button } from "@material-ui/core";
import { Container } from "egov-ui-framework/ui-atoms";
import {
  LabelContainer,
  TextFieldContainer
} from "egov-ui-framework/ui-containers";
import { Dialog, DialogContent } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { withStyles } from "@material-ui/core/styles";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import "./index.css";
import { get } from "lodash";
import { UploadMultipleFiles } from "egov-ui-framework/ui-molecules";

const styles = theme => ({
  root: {
    marginTop: 24,
    width: "100%"
  }
});

const getEpochForDate = (date) => {
  const dateSplit = date.split("/");
  return new Date(dateSplit[2], dateSplit[1] - 1, dateSplit[0]).getTime();
};
const getEpochForDateGrant = (dateString, dayStartOrEnd = "dayend") => {
  //example input format : "2018-10-02"
  try {
    const parts = dateString.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
    const DateObj = new Date(Date.UTC(parts[1], parts[2] - 1, parts[3]));
    DateObj.setMinutes(DateObj.getMinutes() + DateObj.getTimezoneOffset());
    if (dayStartOrEnd === "dayend") {
      DateObj.setHours(DateObj.getHours() + 24);
      DateObj.setSeconds(DateObj.getSeconds() - 1);
    }
    return DateObj.getTime();
  } catch (e) {
    return dateString;
  }
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
    }
  },
  applicationCharges: {
    label: {
      labelName: "Application Charges",
      labelKey: "WF_APPLICATION_CHARGES"
    },
    placeholder: {
      labelName: "Enter Application Charges",
      labelKey: "WF_APPLICATION_CHARGES_PLACEHOLDER"
    }
  },
  publicationCharges: {
    label: {
      labelName: "Publication Charges",
      labelKey: "WF_PUBLICATION_CHARGES"
    },
    placeholder: {
      labelName: "Enter Publication Charges",
      labelKey: "WF_PUBLICATION_CHARGES_PLACEHOLDER"
    }
  },
  nameOfTheBank:{
    label: {
      labelName: "Name of the bank (Text field)",
      labelKey: "WF_BANK_NAME"
    },
    placeholder: {
      labelName: "Enter Bank Name",
      labelKey: "WF_BANK_NAME_PLACEHOLDER"
    },
    required: true
  },
  mortageAmount:{
    label: {
      labelName: "Enter mortgage amount",
      labelKey: "WF_MORTAGE_AMOUNT"
    },
    placeholder: {
      labelName: "Enter mortgage amount",
      labelKey: "WF_MORTAGE_AMOUNT"
    },
    required: true,
  },
  sanctionLetterNo:{
    label: {
      labelName: "Sanction letter number",
      labelKey: "WF_SANCTION_LETTER_LABEL"
    },
    placeholder: {
      labelName: "Enter Sanction letter number",
      labelKey: "WF_SANCTION_LETTER_PLACEHOLDER"
    },
    required: true,
  },
  mortageEndDate:{
    datepicker: true,
    label: {
      labelName: "Mortgage end date ",
      labelKey: "WF_MORTAGAGEEND_DATE_LABEL"
    },
    placeholder: {
      labelName: "Enter Mortgage end date",
      labelKey: "WF_MORTAGAGEEND_DATE_PLACEHOLDER"
    },
    required: true
  },
  sanctioningDate:{
    label: {
      labelName: "Date of sanctioning",
      labelKey: "WF_SANCTIONING_DATE_LABEL"
    },
    placeholder: {
      labelName: "Enter Date of sanctioning",
      labelKey: "WF_SANCTIONING_DATE_PLACEHOLDER"
    },
    required: true
  }
  
  
};

class ActionDialog extends React.Component {
  state = {
    employeeList: [],
    roles: ""
  };

  // onEmployeeClick = e => {
  //   const { handleFieldChange, toggleSnackbar } = this.props;
  //   const selectedValue = e.target.value;
  //   const currentUser = JSON.parse(getUserInfo()).uuid;
  //   if (selectedValue === currentUser) {
  //     toggleSnackbar(
  //       true,
  //       "Please mark to different Employee !",
  //       "error"
  //     );
  //   } else {
  //     handleFieldChange("Licenses[0].assignee", e.target.value);
  //   }
  // };

 onButtonClick = (buttonLabel, isDocRequired) => {
    let {state, dataPath, toggleSnackbar} = this.props
    dataPath = `${dataPath}[0]`
    const data = get(state.screenConfiguration.preparedFinalObject, dataPath) || []
    const applicationState = data.applicationState
    const duplicateCopyApplicationState = data.state    
  if(this.props.moduleName === "OwnershipTransferRP" && (applicationState === "OT_PENDINGSAVERIFICATION" || applicationState === "OT_PENDINGAPRO") && (buttonLabel === "FORWARD" || buttonLabel === "SUBMIT") ) {
    const value = applicationState === "OT_PENDINGSAVERIFICATION" ? data.ownerDetails.dueAmount : data.ownerDetails.aproCharge
    if(!value) {
      toggleSnackbar(
              true,
              { labelName: "Please enter all required fields", labelKey: "Please enter all required fields"},
              "error"
            );
      return
    }
    else if(isNaN(value)) {
      toggleSnackbar(
              true,
              { labelName: "Please enter only numbers", labelKey: "Please enter only numbers"},
              "error"
            );
      return
    }
  } else if(this.props.moduleName === "DuplicateCopyOfAllotmentLetterRP" && (duplicateCopyApplicationState === "DC_PENDINGSAVERIFICATION" || duplicateCopyApplicationState === "DC_PENDINGAPRO") && (buttonLabel === "FORWARD" || buttonLabel === "SUBMIT")) {
    const value = duplicateCopyApplicationState === "DC_PENDINGSAVERIFICATION" ? data.applicant[0].feeAmount : data.applicant[0].aproCharge
    if(!value) {
      toggleSnackbar(
              true,
              { labelName: "Please enter all required fields", labelKey: "Please enter all required fields"},
              "error"
            );
      return
    }
    else if(isNaN(value)) {
      toggleSnackbar(
              true,
              { labelName: "Please enter only numbers", labelKey: "Please enter only numbers"},
              "error"
            );
      return
    }
  }
    this.props.onButtonClick(buttonLabel, isDocRequired)
 }

  getButtonLabelName = label => {
    switch (label) {
      case "FORWARD":
        return "Verify and Forward";
      case "MARK":
        return "Mark";
      case "REJECT":
        return "Reject";
      case "CANCEL":
      case "APPROVE":
        return "APPROVE";
      case "PAY":
        return "Pay";
      case "SENDBACK":
        return "Send Back"; 
      default:
        return label;
    }
  };

  render() { 
    let {
      open,
      onClose,
      dropDownData,
      handleFieldChange,
      onButtonClick,
      dialogData,
      dataPath,
      state
    } = this.props;
    const {
      buttonLabel,
      showEmployeeList,
      dialogHeader,
      moduleName,
      isDocRequired
    } = dialogData;
    const { getButtonLabelName } = this;
    let fullscreen = false;
    if (window.innerWidth <= 768) {
      fullscreen = true;
    }
    if (dataPath === "FireNOCs") {
      dataPath = `${dataPath}[0].fireNOCDetails`
    } else if (dataPath === "BPA") {
      dataPath = `${dataPath}`;
    } else {
      dataPath = `${dataPath}[0]`;
    }

    const applicationState = (get(state.screenConfiguration.preparedFinalObject, dataPath) || []).applicationState
    const duplicateCopyApplicationState = (get(state.screenConfiguration.preparedFinalObject, dataPath) || []).state
    return (
      <Dialog
        fullScreen={fullscreen}
        open={open}
        onClose={onClose}
        maxWidth="sm"
        style={{zIndex:2000}}
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
                      display: "flex"
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
                    onClick={onClose}
                  >
                    <CloseIcon />
                  </Grid>
                  {showEmployeeList && !!dropDownData.length && (
                    <Grid
                      item
                      sm="12"
                      style={{
                        marginTop: 16
                      }}
                    >
                      <TextFieldContainer
                        select={true}
                        style={{ marginRight: "15px", width: "90%" }}
                        label={fieldConfig.approverName.label}
                        placeholder={fieldConfig.approverName.placeholder}
                        data={dropDownData}
                        optionValue="value"
                        optionLabel="label"
                        hasLocalization={false}
                        //onChange={e => this.onEmployeeClick(e)}
                        onChange={e =>
                          handleFieldChange(
                            `${dataPath}.assignee`,
                            [e.target.value]
                          )
                        }
                        jsonPath={`${dataPath}.assignee[0]`}
                      />
                    </Grid>
                  )}
                  <Grid item sm="12">
                    {/* <TextFieldContainer
                      InputLabelProps={{ shrink: true }}
                      label={fieldConfig.comments.label}
                      onChange={e =>
                        handleFieldChange(`${dataPath}.comment`, e.target.value)
                      }
                      jsonPath={`${dataPath}.comment`}
                      placeholder={fieldConfig.comments.placeholder}
                    /> */}
                    <label className="commentsLabel">{fieldConfig.comments.label.labelName}</label>
                    <textarea className="form-control comments" rows="5" placeholder={fieldConfig.comments.placeholder.labelName} onChange={e => handleFieldChange(`${dataPath}.comment`, e.target.value)}/>
                  </Grid>
    
                  {moduleName === "OwnershipTransferRP" && (applicationState === "OT_PENDINGSAVERIFICATION" || applicationState === "OT_PENDINGAPRO") && (buttonLabel === "FORWARD" || buttonLabel === "SUBMIT") && (
                    <Grid item sm="12">
                    <TextFieldContainer
                      required={true}
                      style={{ width: "90%" }}
                      InputLabelProps={{ shrink: true }}
                      label={applicationState === "OT_PENDINGSAVERIFICATION" ? fieldConfig.applicationCharges.label : fieldConfig.publicationCharges.label}
                      onChange={e =>
                        handleFieldChange(applicationState === "OT_PENDINGSAVERIFICATION" ? `${dataPath}.ownerDetails.dueAmount` : `${dataPath}.ownerDetails.aproCharge` , e.target.value)
                      }
                      jsonPath={applicationState === "OT_PENDINGSAVERIFICATION" ? `${dataPath}.ownerDetails.dueAmount` : `${dataPath}.ownerDetails.aproCharge`}
                      placeholder={applicationState === "OT_PENDINGSAVERIFICATION" ? fieldConfig.applicationCharges.placeholder : fieldConfig.publicationCharges.placeholder}
                    />
                  </Grid>
                  )}

                  {moduleName === "DuplicateCopyOfAllotmentLetterRP" && (duplicateCopyApplicationState === "DC_PENDINGSAVERIFICATION" || duplicateCopyApplicationState === "DC_PENDINGAPRO") && (buttonLabel === "FORWARD" || buttonLabel === "SUBMIT") && (
                    <Grid item sm="12">
                    <TextFieldContainer
                      required={true}
                      style={{ width: "90%" }}
                      InputLabelProps={{ shrink: true }}
                      label={duplicateCopyApplicationState === "DC_PENDINGSAVERIFICATION" ? fieldConfig.applicationCharges.label : fieldConfig.publicationCharges.label}
                      onChange={e =>
                        handleFieldChange(duplicateCopyApplicationState === "DC_PENDINGSAVERIFICATION" ? `${dataPath}.applicant[0].feeAmount` : `${dataPath}.applicant[0].aproCharge` , e.target.value)
                      }
                      jsonPath={duplicateCopyApplicationState === "DC_PENDINGSAVERIFICATION" ? `${dataPath}.applicant[0].feeAmount` : `${dataPath}.applicant[0].aproCharge`}
                      placeholder={duplicateCopyApplicationState === "DC_PENDINGSAVERIFICATION" ? fieldConfig.applicationCharges.placeholder : fieldConfig.publicationCharges.placeholder}
                    />
                  </Grid>
                  )}

                {moduleName === "PermissionToMortgage" && (duplicateCopyApplicationState === "MG_PENDINGGRANTDETAIL" ) && (
                    <Grid item sm="12">
                      <TextFieldContainer
                      InputLabelProps={{ shrink: true }}
                      required={true}  
                      label= {fieldConfig.nameOfTheBank.label}
                      onChange={e =>
                        handleFieldChange( `${dataPath}.mortgageApprovedGrantDetails[0].bankName` , e.target.value)
                      }
                      jsonPath={`${dataPath}.mortgageApprovedGrantDetails[0].bankName`}
                      placeholder={fieldConfig.nameOfTheBank.placeholder }
                    />
                    <TextFieldContainer
                      InputLabelProps={{ shrink: true }}
                      required={true}
                      label= {fieldConfig.mortageAmount.label}
                      onChange={e =>
                        handleFieldChange( `${dataPath}.mortgageApprovedGrantDetails[0].mortgageAmount` , e.target.value)
                      }
                      jsonPath={`${dataPath}.mortgageApprovedGrantDetails[0].mortgageAmount`}
                      placeholder={fieldConfig.mortageAmount.placeholder }
                    />
                      <TextFieldContainer
                      required={true}
                      InputLabelProps={{ shrink: true }}
                      label= {fieldConfig.sanctionLetterNo.label}
                      onChange={e =>
                        handleFieldChange( `${dataPath}.mortgageApprovedGrantDetails[0].sanctionLetterNumber` , e.target.value)
                      }
                      jsonPath={`${dataPath}.mortgageApprovedGrantDetails[0].sanctionLetterNumber`}
                      placeholder={fieldConfig.sanctionLetterNo.placeholder }
                    />
                    <TextFieldContainer
                      required={true}
                       type="date"
                       defaultValue={new Date()}
                       InputLabelProps={{ shrink: true }}
                       label= {fieldConfig.sanctioningDate.label}
                       onChange={e =>
                        handleFieldChange( `${dataPath}.mortgageApprovedGrantDetails[0].sanctionDate` , getEpochForDateGrant(e.target.value))
                      }
                      jsonPath={`${dataPath}.mortgageApprovedGrantDetails[0].sanctionDate`}
                       />
                        <TextFieldContainer
                       type="date"
                       required={true}
                       defaultValue={new Date()}
                       InputLabelProps={{ shrink: true }}
                       label= {fieldConfig.mortageEndDate.label}
                       onChange={e =>
                        handleFieldChange( `${dataPath}.mortgageApprovedGrantDetails[0].mortgageEndDate` , getEpochForDateGrant(e.target.value))
                      }
                      jsonPath={`${dataPath}.mortgageApprovedGrantDetails[0].mortgageEndDate`}
                       />   
                     </Grid>
                  )}
                  {((moduleName === "OwnershipTransferRP" && applicationState === "OT_PENDINGCLAPPROVAL") || (moduleName === "DuplicateCopyOfAllotmentLetterRP" && duplicateCopyApplicationState === "DC_PENDINGCLAPPROVAL")) && buttonLabel === "REJECT" && (<Grid item sm="12">
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
                        <LabelContainer
                          labelName="Supporting Documents"
                          labelKey="WF_APPROVAL_UPLOAD_HEAD"
                        />
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
                      buttonLabel={{ labelName: "UPLOAD FILES",labelKey : "RP_UPLOAD_FILES_BUTTON" }}
                      jsonPath={`${dataPath}.wfDocuments`}
                      maxFileSize={5000}
                    />
                    </Grid>)}
                    <Grid sm={12} style={{ textAlign: "right" }} className="bottom-button-container">
                      <Button
                        variant={"contained"}
                        color={"primary"}
                        style={{
                          minWidth: "200px",
                          height: "48px"
                        }}
                        className="bottom-button"
                        onClick={() =>
                          this.onButtonClick(buttonLabel, isDocRequired)
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
              }
            />
          }
        />
      </Dialog>
    );
  }
}
export default withStyles(styles)(ActionDialog);
