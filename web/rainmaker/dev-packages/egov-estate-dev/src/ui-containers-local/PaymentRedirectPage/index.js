import React, { Component } from "react";
import get from "lodash/get";
import { httpRequest } from "../../ui-utils/api";
import { withRouter } from "react-router";
import { getSearchApplicationsResults } from "../../ui-utils/commons";

class PaymentRedirect extends Component {
  componentDidMount = async () => {
    let { search } = this.props.location;
    const txnQuery=search.split('&')[0].replace('eg_pg_txnid','transactionId');
    // const businessService = (search.split("=")[13]).split("&")[0]
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
      let path = ""
      if (get(pgUpdateResponse, "Transaction[0].txnStatus") === "FAILURE") {
        path = `${
          process.env.NODE_ENV === "production" ? "/citizen" : ""
        }/estate/acknowledgement?purpose=${"pay"}&status=${"failure"}&applicationNumber=${consumerCode}&tenantId=${tenantId}`;
      } else {
        let transactionId = get(pgUpdateResponse, "Transaction[0].txnId");
        path = `${
          process.env.NODE_ENV === "production" ? "/citizen" : ""
        }/estate/acknowledgement?purpose=${"pay"}&status=${"success"}&applicationNumber=${consumerCode}&tenantId=${tenantId}`;
      }
      if(!!Applications.length) {
        const {branchType, moduleType, applicationType} = Applications[0];
         const type = `${branchType}_${moduleType}_${applicationType}`;
         path = `${path}&type=${type}`
      } else {
        path = `${path}`
      }
      window.location.href = path
    } catch (e) {
      alert(e);
    }
  };
  render() {
    return <div />;
  }
}

export default withRouter(PaymentRedirect);
