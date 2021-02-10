import React, { Component } from "react";
import { Button, Icon } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import CommonSuccessMessage from "../../modules/CommonSuccessMessage";

import "./index.css";
import { connect } from "react-redux";

class PublishSuccess extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bkData: {}
    }
  };
  continueComplaintSubmit = () => {
    this.props.history.push(`/egov-services/all-applications`);
  };
  render() {
    let {applicationNumber} = this.props;
    return (
      <div className="success-message-main-screen resolve-success">
        <CommonSuccessMessage
          headermessage="Booking Cancellation"
          successmessage="Booking cancelled successfully"
          secondaryLabel="Your booking has been cancelled and refund process initiated successfully"
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
  let applicationNumber = bookingDetails ? bookingDetails.bkApplicationNumber : '';
 
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
)(PublishSuccess);
