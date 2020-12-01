import React, { Component } from "react";
import { Button, Icon } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import CommonSuccessMessage from "../../modules/CommonSuccessMessage";
import { connect } from "react-redux";


class DeliveredBWTApplicationSuccess extends Component {
  continueComplaintSubmit = () => {
    this.props.history.push(`/egov-services/all-applications`);
  };
  render() {
    let {applicationNumber} = this.props;
    return (
      <div className="success-message-main-screen resolve-success">
        <CommonSuccessMessage
        headermessage="BK_ES_APPLICATION_HEADER_MESSAGE_DELIVERED"
          successmessage="BK_ES_APPLICATION_DELIVERED_SUCCESS_MESSAGE"
          secondaryLabel="BK_MYBK_SUCCESSFULLY_DELIVERED_SEND_MESSAGE"
          containerStyle={{ display: "inline-block" }}
          icon={<Icon action="navigation" name="check" />}
          backgroundColor={"#22b25f"}
          applicationNumber={applicationNumber && applicationNumber}
        />
        <div className="responsive-action-button-cont">
          <Button
            id="resolve-success-continue"
            primary={true}
            label={<Label buttonLabel={true} label="BK_CORE_COMMON_GOTOHOME" />}
            fullWidth={true}
            onClick={this.continueComplaintSubmit}
            className="responsive-action-button"
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { bookings, common, auth, form } = state;
  const { applicationData } = bookings;
  let bookingDetails = applicationData ? applicationData.bookingsModelList[0] : '';
 
  //bkApplicationNumber
  let applicationNumber = applicationData ? applicationData.bookingsModelList[0].bkApplicationNumber : '';
 
  return {
    bookingDetails,
    applicationNumber
  }
}

const mapDispatchToProps = dispatch => {
  return {}
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DeliveredBWTApplicationSuccess);
