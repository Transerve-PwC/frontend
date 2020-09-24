import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { httpRequest } from "egov-ui-framework/ui-utils/api";
import get from "lodash/get";
import set from "lodash/set";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { getSearchResults } from "../../ui-utils/commons";
import {
  getAccessToken, getOPMSTenantId, getLocale, getUserInfo,
  localStorageGet, setapplicationNumber, getapplicationNumber, getapplicationType,
  lSRemoveItem
} from "egov-ui-kit/utils/localStorageUtils";

class PaymentRedirect extends Component {
  componentDidMount = async () => {
    let { search } = this.props.location;
    try {
      let pgUpdateResponse = await httpRequest(
        "post", "pg-service/transaction/v1/_update" + search, "_update", [],
        {}
      );

      let consumerCode = get(pgUpdateResponse, "Transaction[0].consumerCode");
      let tenantId = get(pgUpdateResponse, "Transaction[0].tenantId");
      if (get(pgUpdateResponse, "Transaction[0].txnStatus") === "FAILURE") {

        if (getapplicationType() === 'PETNOC') {
          this.props.setRoute(
            `/egov-opms/acknowledgement?purpose=${"pay"}&status=${"failure"}&applicationNumber=${consumerCode}&tenantId=${tenantId}`
          );
        }
        else if (getapplicationType() === 'SELLMEATNOC') {
          this.props.setRoute(
            `/egov-opms/acknowledgement-sellmeat?purpose=${"pay"}&status=${"failure"}&applicationNumber=${consumerCode}&tenantId=${tenantId}`
          );
        }
        else if (getapplicationType() === 'ROADCUTNOC') {
          this.props.setRoute(
            `/egov-opms/acknowledgement-roadcut?purpose=${"pay"}&status=${"failure"}&applicationNumber=${consumerCode}&tenantId=${tenantId}`
          );
        }
        else {
          this.props.setRoute(
            `/egov-opms/acknowledgement-adv?purpose=${"pay"}&status=${"failure"}&applicationNumber=${consumerCode}&tenantId=${tenantId}`
          );
        }

      } else {
        let data =
        {
          "applicationType": getapplicationType(),
          "tenantId": getOPMSTenantId(),
          "applicationStatus": "PAID",
          "applicationId": consumerCode,
          "currentState": getapplicationType() == "ROADCUTNOC" ? "APPROVED" : "INITIATED",
          "dataPayload": {
            "amount": localStorageGet(`amount`),
            "gstAmount": localStorageGet(`gstAmount`)
            //"performanceBankGuaranteeCharges": localStorageGet(`performanceBankGuaranteeCharges`)
          },
          "auditDetails": {
            "createdBy": 1,
            "lastModifiedBy": 1,
            "createdTime": 1578894136873,
            "lastModifiedTime": 1578894136873
          }
        }

        let response = await getSearchResults([
          { key: "tenantId", value: tenantId },
          { key: "applicationNumber", value: consumerCode }
        ]);

        response = await httpRequest(
          "post", "pm-services/noc/_updateappstatus", "", [], data);
        lSRemoveItem(`amount`);
        lSRemoveItem(`gstAmount`);
        lSRemoveItem(`performanceBankGuaranteeCharges`)

        let transactionId = get(pgUpdateResponse, "Transaction[0].txnId");
        // this.props.setRoute(
        // `/egov-opms/acknowledgement?purpose=${"pay"}&status=${"success"}&applicationNumber=${consumerCode}&tenantId=${tenantId}&secondNumber=${transactionId}`
        // );

        if (getapplicationType() === 'PETNOC') {
          this.props.setRoute(
            `/egov-opms/acknowledgement?purpose=${"pay"}&status=${"success"}&applicationNumber=${consumerCode}&tenantId=${tenantId}&secondNumber=${transactionId}`
          );
        }
        else if (getapplicationType() === 'SELLMEATNOC') {
          this.props.setRoute(
            `/egov-opms/acknowledgement-sellmeat?purpose=${"pay"}&status=${"success"}&applicationNumber=${consumerCode}&tenantId=${tenantId}&secondNumber=${transactionId}`
          );
        }
        else if (getapplicationType() === 'ROADCUTNOC') {
          this.props.setRoute(
            `/egov-opms/acknowledgement-roadcut?purpose=${"pay"}&status=${"success"}&applicationNumber=${consumerCode}&tenantId=${tenantId}&secondNumber=${transactionId}`
          );
        }
        else {
          this.props.setRoute(
            `/egov-opms/acknowledgement-adv?purpose=${"pay"}&status=${"success"}&applicationNumber=${consumerCode}&tenantId=${tenantId}&secondNumber=${transactionId}`
          );
        }



      }
    } catch (e) {
      //alert(e);
    }
  };
  render() {
    return <div />;
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setRoute: route => dispatch(setRoute(route))
  };
};

export default connect(
  null,
  mapDispatchToProps
)(withRouter(PaymentRedirect));
