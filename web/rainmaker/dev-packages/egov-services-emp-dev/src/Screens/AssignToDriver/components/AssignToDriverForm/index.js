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
    // display: 'flex',
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




const RejectComplaintForm = ({ form, options,classes, bkStatus, mobileNumber, driverFullName, handleValidation, onDriverNameChange, approverName, onApproverNameChange, onMobileChange, onSubmit, bookingservice, bookingtype, applicationNumber, createdBy, tenantId, ontextAreaChange, handleOptionChange, optionSelected, commentValue }) => {


  if (form && form.fields) {
    let formValue = { ...form.fields };
    formValue.applicationNumber.value = applicationNumber;
    formValue.tenantId.value = tenantId;
    // formValue.createdBy.value = createdBy;
    formValue.remarks.value = commentValue;
    // formValue.createdOn.value = new Date();
    formValue.bookingType.value = bookingtype;
    formValue.driverName.value = driverFullName;
    formValue.mobileNumber.value = mobileNumber;
    formValue.approverName.value = approverName;
    formValue.businessService.value = bookingservice
  }
  const fields = form.fields || {};
  const submit = form.submit;
  return (
    <div>
      {/* <div className="custom-padding-for-screens">
        <b>Application Number: </b>{applicationNumber}
      </div> */}
      <div className="custom-padding-for-screens">
       
        {(!bkStatus.includes("Paid") &&
          <div className="reject-complaint-textArea"
            style={{ paddingLeft: 8 }}
          >
            <TextField
              id="approver-name"
              name="approver-name"
              type="string"
              value={approverName}
            //   onInput = {(e) =>{
            //     e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,50)
            // }}
              hintText={
                <Label
                  label="BK_MYBK_APPROVER_NAME_PLACEHOLDER"
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
                  label="BK_MYBK_CREATE_APPROVER_NAME"
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
        <div className="reject-complaint-textArea"
          style={{ paddingLeft: 8 }}
        >
          <TextField
            id="driver-name"
            name="driver-name"
            type="string"
            value={driverFullName}
          //   onInput = {(e) =>{
          //     e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,50)
          // }}
            hintText={
              <Label
                label="BK_MYBK_DRIVER_NAME_PLACEHOLDER"
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
                label="BK_MYBK_CREATE_DRIVER_NAME"
                color="rgba(0,0,0,0.60)"
                fontSize="12px"
              />
            }
            onChange={onDriverNameChange}
            underlineStyle={{ bottom: 7 }}
            underlineFocusStyle={{ bottom: 7 }}
            hintStyle={{ width: "100%" }}
          />
        </div>

        <div className="reject-complaint-textArea"
          style={{ paddingLeft: 8 }}
        >
          <TextField
            id="mobile-no"
            name="mobile-no"
            type="number"
            value={mobileNumber}
            onInput = {(e) =>{
              e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,13)
              // e.target.value = Math.min(10, parseInt(e.target.value) ).toString().slice(0,10)
          }}
            hintText={
              <Label
                label="BK_MYBK_DRIVER_MOBILE_NUMBER_PLACEHOLDER"
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
                label="BK_MYBK_CREATE_DRIVER_MOBILE_NUMBER"
                color="rgba(0,0,0,0.60)"
                fontSize="12px"
              />
            }
            onChange={onMobileChange}
            underlineStyle={{ bottom: 7 }}
            underlineFocusStyle={{ bottom: 7 }}
            hintStyle={{ width: "100%" }}
          />
        </div>
      </div>
      <div className={classes.btnWrapper}>
        {(() => {
          if(!bkStatus.includes("Paid")){
          if (driverFullName && mobileNumber.length===10 && approverName) {
            return <button
            onClick={handleValidation}
            className={classes.button}
            id="rejectcomplaint-submit-action"
            primary={true}
            {...submit}
            fullWidth={true}
          >Assign</button>
           }else{
            return <button
            onClick={handleValidation}
            style={{ backgroundColor: "darkgray" }}
            className={classes.button}
            id="rejectcomplaint-submit-action"
            primary={true}
            {...submit}
            fullWidth={true}
            disabled
            >Assign</button>
           }
          }else{
            if (driverFullName && mobileNumber.length===10 ) {
              return <button
              onClick={handleValidation}
              className={classes.button}
              id="rejectcomplaint-submit-action"
              primary={true}
              {...submit}
              fullWidth={true}
            >Assign</button>
             }else{
             
              return <button
              onClick={handleValidation}
              style={{ backgroundColor: "darkgray" }}
              className={classes.button}
              id="rejectcomplaint-submit-action"
              primary={true}
              {...submit}
              fullWidth={true}
              disabled
            >Assign</button>
             
             }
          }
         
        })()}
      
    </div>
    </div>
  );
};

export default withStyles( styles )( RejectComplaintForm );
