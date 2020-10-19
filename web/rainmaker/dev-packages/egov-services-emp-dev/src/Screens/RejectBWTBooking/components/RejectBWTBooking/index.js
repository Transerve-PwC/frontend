import React from "react";
import { Button, TextField } from "components";
import { Question } from "modules/common";
import { TextArea } from "modules/common";
import Label from "egov-ui-kit/utils/translationNode";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ( {
  root: {
    width: "100%",
    textAlign: 'right'
  },
  btnWrapper: {
    width: '100%',
    textAlign: 'right'
  },
  button: {
    height: "48px",
    minWidth: "200px",
    border: "none",
    color: "#fff",
    fontWeight: "bold",
    fontSize: "14px",
    borderRadius: "5px",
    backgroundColor: '#FE7A51',
    textTransform: 'uppercase',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: "pointer",
    boxShadow: '0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)',
    "&:hover, &:focus": {       
        backgroundColor: '#DB6844',
        color: "#fff",
        border: "none"
    },
    "&:active": {        
        backgroundColor: '#DB6844',
        color: "#fff",
        border: "none"
    },
    "&:focus": {
        outline:0
    }
  }
});

const RejectComplaintForm = ({ form, options,classes, bkStatus, mobileNumber, driverFullName, onDriverNameChange, approverName, onApproverNameChange, onMobileChange, onSubmit, bookingservice, bookingtype, applicationNumber, createdBy, tenantId, ontextAreaChange, handleOptionChange, optionSelected, commentValue }) => {
  
  

  if (form && form.fields) {
    let formValue = { ...form.fields };
    formValue.applicationNumber.value = applicationNumber;
    formValue.tenantId.value = tenantId;
    // formValue.createdBy.value = createdBy;
    formValue.remarks.value = commentValue;
    // formValue.createdOn.value = new Date();
    formValue.bookingType.value = bookingtype;
    
    formValue.approverName.value = approverName;
    formValue.businessService.value = bookingservice
  }

  const fields = form.fields || {};
  const submit = form.submit;
  return (
    <div>
      <div className="custom-padding-for-screens">
        <div className="reject-complaint-textArea">

        <TextField
              id="comment-value"
              name="comment-value"
              type="string"
              value={commentValue}
              hintText={
                <Label
                  label="BK_MYBK_ADD_COMMENTS_PLACEHOLDER"
                  color="rgba(0, 0, 0, 0.3799999952316284)"
                  fontSize={16}
                  labelStyle={{
                    letterSpacing: "0.7px",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    width: "90%",
                    overflow: "hidden"
                  }}
                />
              }
              onChange={ontextAreaChange}
              underlineStyle={{ bottom: 7 }}
              underlineFocusStyle={{ bottom: 7 }}
              hintStyle={{ width: "100%" }}
            />
          
         
        </div>
        {(bkStatus != 'Paid' &&
          <div className="reject-complaint-textArea"
            style={{ paddingLeft: 8 }}
          >
            <TextField
              id="approver-name"
              name="approver-name"
              type="string"
              value={approverName}
              hintText={
                <Label
                  label="BK_MYBK_REJECTOR_NAME_PLACEHOLDER_TEXT"
                  color="rgba(0, 0, 0, 0.3799999952316284)"
                  fontSize={16}
                  labelStyle={{
                    letterSpacing: "0.7px",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    width: "90%",
                    overflow: "hidden"
                  }}
                />
              }
              floatingLabelText={
                <Label
                  key={0}
                  label="BK_MYBK_CREATE_REJECTOR_NAME_TEXT"
                  color="rgba(0,0,0,0.60)"
                  fontSize="12px"
                />
              }
              onChange={onApproverNameChange}
              underlineStyle={{ bottom: 7 }}
              underlineFocusStyle={{ bottom: 7 }}
              hintStyle={{ width: "100%" }}
            />
          </div>
        )}
      </div>
      <div className={classes.btnWrapper}>
        {(() => {
          if (!commentValue&&(!approverName)) {
            return <button
              onClick={onSubmit}
              style={{ backgroundColor: "darkgray" }}
              className={classes.button}
              id="rejectcomplaint-submit-action"
              primary={true}
              {...submit}
              fullWidth={true}
              disabled
            >Reject</button>

          } else {
            return <button
              onClick={onSubmit}
              className={classes.button}
              id="rejectcomplaint-submit-action"
              primary={true}
              {...submit}
              fullWidth={true}
            >Reject</button>
          }
        })()}

      </div>
    </div>
  );
};


export default withStyles( styles )( RejectComplaintForm );

