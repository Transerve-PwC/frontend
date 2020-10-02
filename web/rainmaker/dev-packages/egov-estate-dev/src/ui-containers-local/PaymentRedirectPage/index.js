import React, { Component } from "react";
import get from "lodash/get";
import { httpRequest } from "../../ui-utils/api";
import { withRouter } from "react-router";
import { getSearchApplicationsResults } from "../../ui-utils/commons";

class PaymentRedirect extends Component {
  componentDidMount = async () => {
    let { search } = this.props.location;
    const txnQuery=search.split('&')[0].replace('eg_pg_txnid','transactionId');
    try {
      let pgUpdateResponse = await httpRequest(
        "post",
        "pg-service/transaction/v1/_update" + txnQuery,
        "_update",
        [],
        {}
      );
      let consumerCode = get(pgUpdateResponse, "Transaction[0].consumerCode");
      let tenantId = get(pgUpdateResponse, "Transaction[0].tenantId");
      const queryObject = [
        {
          key: "tenantId",
          value: tenantId
        },
        {
          key: "applicationNumber",
          value: consumerCode
        }
      ];
      const response = await getSearchApplicationsResults(queryObject);
      const Applications = get(response, "Applications");
      const {branchType, moduleType, applicationType} = Applications[0];
       const type = `${branchType}_${moduleType}_${applicationType}`;
      if (get(pgUpdateResponse, "Transaction[0].txnStatus") === "FAILURE") {
        window.location.href = `${
          process.env.NODE_ENV === "production" ? "/citizen" : ""
        }/estate/acknowledgement?purpose=${"pay"}&status=${"failure"}&applicationNumber=${consumerCode}&tenantId=${tenantId}&type=${type}`;
      } else {
        let transactionId = get(pgUpdateResponse, "Transaction[0].txnId");
        window.location.href = `${
          process.env.NODE_ENV === "production" ? "/citizen" : ""
        }/estate/acknowledgement?purpose=${"pay"}&status=${"success"}&applicationNumber=${consumerCode}&tenantId=${tenantId}&type=${type}`;
      }
    } catch (e) {
      alert(e);
    }
  };
  render() {
    return <div />;
  }
}

export default withRouter(PaymentRedirect);
