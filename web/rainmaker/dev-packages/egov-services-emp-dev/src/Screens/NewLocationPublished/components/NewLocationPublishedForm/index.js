import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Button } from "components";
import { ImageUpload } from "modules/common";
import { TextArea } from "modules/common";


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

const NewLocationForm = ({ form, options,userInfo, onSubmit,bookingservice,bookingtype,applicationNumber,createdBy,tenantId, ontextAreaChange, handleOptionChange, optionSelected, commentValue, classes }) => {
 
  if(form && form.fields){
    let formValue={...form.fields};

    // const foundFirstLavel = userInfo&&userInfo.roles.some(el => el.code === 'MCC_APPROVER');
    // if(foundFirstLavel){
    //   formValue.action.value='APPROVE';
    // }
    // const foundSecondLavel = userInfo&&userInfo.roles.some(el => el.code === 'OSD_APPROVER');
  
    // if(foundSecondLavel){
    //   formValue.action.value='APPROVEOSD';
    // }
    // const foundthirdLavel = userInfo&&userInfo.roles.some(el => el.code === 'ADMIN_APPROVER');
  
    // if(foundSecondLavel){
    //   formValue.action.value='PUBLISH';
    // }
    
formValue.applicationNumber.value=applicationNumber;
formValue.tenantId.value=tenantId;
// formValue.createdBy.value=createdBy;
formValue.remarks.value=commentValue;
// formValue.createdOn.value=new Date();
// formValue.bookingType.value=bookingtype;
formValue.businessService.value=bookingservice

  }

  
  const fields = form.fields || {};
  const submit = form.submit;
  return (
    <div>
       <div className="custom-padding-for-screens">
        <div className="complaint-resolved-main-container">
          <TextArea onChange={ontextAreaChange} value={commentValue} {...fields.textarea} />
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
            >Publish</button>

          } else {
            return <button
              onClick={onSubmit}
              className={classes.button}
              id="rejectcomplaint-submit-action"
              primary={true}
              {...submit}
              fullWidth={true}
            >Publish</button>
          }
        })()}

      </div>
    </div>
  );
};

export default withStyles( styles )( NewLocationForm );

