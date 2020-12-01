import React, { Component } from "react";
import { Button, Icon } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import CommonSuccessMessage from "../../modules/CommonSuccessMessage";

class RejectBWTApplicationSuccess extends Component {
  continueComplaintSubmit = () => {
   
    this.props.history.push(`/egov-services/all-applications`);
  };
  render() {
    return (
      <div className="success-message-main-screen">
        <CommonSuccessMessage
         headermessage="BK_ES_APPLICATION_HEADER_MESSAGE_REJECT"
          successmessage="BK_ES_COMPLAINT_REJECT_SUCCESS_MESSAGE"
          secondaryLabel="BK_CS_COMMON_SEND_MESSAGE_REJECTED A Notification Rgarding Application Rejetion has been sent to the applicant registered Mobile No."
          icon={<Icon action="navigation" name="close" />}
          backgroundColor={"#e74c3c"}
        />

        <div className="responsive-action-button-cont">
          <Button
            className="responsive-action-button"
            primary={true}
            label={<Label buttonLabel={true} label="CORE_COMMON_GOTOHOME" />}
            fullWidth={true}
            onClick={this.handleComplaintReassigned}
          />
        </div>
      </div>
    );
  }
}

export default RejectBWTApplicationSuccess;
