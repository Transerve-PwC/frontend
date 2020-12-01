import React from "react";
import { Button, TextField } from "components";
import { ImageUpload } from "modules/common";
import { TextArea } from "modules/common";
import { withStyles } from "@material-ui/core/styles";
import Label from "egov-ui-kit/utils/translationNode";

import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const styles = theme => ({
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
      outline: 0
    }
  }
});

const NewLocationResolvedForm = ({ form,handleChangeAssignee,assignToMe,foundFirstLavels,assignee,handleOpen,handleClose, options,setOpen, userInfo, classes, onSubmit, bookingservice, bookingtype, applicationNumber, createdBy, tenantId, ontextAreaChange, handleOptionChange, optionSelected, commentValue }) => {
 


  if (form && form.fields) {
    let formValue = { ...form.fields };

    const foundFirstLavel = userInfo && userInfo.roles.some(el => el.code === 'BK_MCC_APPROVER');
    if (foundFirstLavel) {
      formValue.action.value = 'APPROVE';
    }
 

    const foundSecondLavel = userInfo && userInfo.roles.some(el => el.code === 'BK_OSD_APPROVER');

    if (foundSecondLavel) {
      formValue.action.value = 'APPROVEOSD';
    }
    // const foundthirdLavel = userInfo&&userInfo.roles.some(el => el.code === 'ADMIN_APPROVER');

    // if(foundthirdLavel){
    //   formValue.action.value='PUBLISH';
    // }

    formValue.applicationNumber.value = applicationNumber;
    formValue.tenantId.value = tenantId;
    // formValue.createdBy.value = createdBy;
    formValue.remarks.value = commentValue;
    // formValue.createdOn.value = new Date();
     formValue.assignee.value=assignee;
    formValue.businessService.value = bookingservice

  }
  const fields = form.fields || {};
  const submit = form.submit;

  return (
    <div>
      <div className="custom-padding-for-screens">
        <div className="complaint-resolved-main-container">
{(foundFirstLavels &&
          <FormControl style={{ width: '100%' }}>
            <InputLabel shrink style={{ width: '100%' }} id="demo-controlled-open-select-label">Assignee</InputLabel>
            <Select
              maxWidth={false}
              labelId="demo-controlled-open-select-label-Locality"
              id="demo-controlled-open-select-locality"
              open={setOpen}
              onClose={handleClose}
              onOpen={handleOpen}
              value={assignee}
              displayEmpty
              onChange={handleChangeAssignee}
            >
              {assignToMe.map((child, index) => (
            <MenuItem value={child.uuid}>{child.userName}</MenuItem>
            ))}
              {/* <MenuItem value='sumit kumar'>sumit kumar</MenuItem>
              <MenuItem value='sonu kumar'>sonu kumar</MenuItem>
              <MenuItem value='rahul kumar'>rahul kumar</MenuItem> */}

            </Select>
          </FormControl>


 )} 


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

          {/* <TextArea onChange={ontextAreaChange} value={commentValue} {...fields.textarea} /> */}
        </div>
      </div>

      <div className={classes.btnWrapper}>
        {(() => {
          if (!commentValue) {
            return <button
              onClick={onSubmit}
              style={{ backgroundColor: "darkgray" }}
              className={classes.button}
              id="rejectcomplaint-submit-action"
              primary={true}
              {...submit}
              fullWidth={true}
              disabled
            >Approve</button>

          } else {
            return <button
              onClick={onSubmit}
              className={classes.button}
              id="rejectcomplaint-submit-action"
              primary={true}
              {...submit}
              fullWidth={true}
            >Approve</button>
          }
        })()}

      </div>
    </div>
    
  );
};

export default withStyles(styles)(NewLocationResolvedForm);
