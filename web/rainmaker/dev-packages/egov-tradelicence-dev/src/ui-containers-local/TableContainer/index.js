import React, {Component} from 'react';
import {connect} from 'react-redux'
import Table from 'egov-ui-framework/ui-molecules/Table'
import { getLocaleLabels } from 'egov-ui-framework/ui-utils/commons';
import { convertEpochToDate } from '../../ui-config/screens/specs/utils';
import { get } from 'lodash';

class TableContainer extends Component {

    _getLocaleLabels = (label) => {
        return getLocaleLabels(label, label, this.props.localizationLabels)
    }

    render() {
        let {data = [], ...rest} = this.props;
        const columns = [
            this._getLocaleLabels("TL_TABLE_COL_APP_NO"),
            this._getLocaleLabels("TL_TABLE_COL_LIC_NO"),
            this._getLocaleLabels("TL_TABLE_TRADE_TYPE_LABEL"),
            this._getLocaleLabels("TL_TABLE_SERVICE_TYPE_LABEL"),
            this._getLocaleLabels("TL_TABLE_COL_OWN_NAME"),
            this._getLocaleLabels("TL_TABLE_COL_APP_DATE"),
            this._getLocaleLabels("TL_TABLE_COL_FIN_YEAR"),
            {
              name: this._getLocaleLabels("TL_TABLE_COL_APP_TYPE"),
              options: {
                filter: false,
                customBodyRender: value => (
                  <span>
                    {this._getLocaleLabels(value)}
                  </span>
                )
              }
            },
            {
              name: this._getLocaleLabels("TL_TABLE_COL_STATUS"),
              options: {
                filter: false,
                customBodyRender: value => (
                  <span
                    style={
                      value === "APPROVED" ? { color: "green" } : { color: "red" }
                    }
                  >
                    {this._getLocaleLabels(value)}
                  </span>
                )
              }
            },
            {
              name: "tenantId",
              options: {
                display: false,
                viewColumns: false
              }
            },
            {
              name:"status1",
              options: {
                display: false,
                viewColumns: false
              }
            },
          ]
           data = data.map(item => ({
  
            [this._getLocaleLabels("TL_TABLE_COL_APP_NO")]:
              item.applicationNumber || "-",
            [this._getLocaleLabels("TL_TABLE_COL_LIC_NO")]: item.licenseNumber || "-",
            [this._getLocaleLabels("TL_TABLE_TRADE_TYPE_LABEL")]:   this._getLocaleLabels(item.businessService + "_GROUP", item.businessService + "_GROUP"),
            [this._getLocaleLabels("TL_TABLE_SERVICE_TYPE_LABEL")]: this._getLocaleLabels(item.businessService + "_SHORT", item.businessService + "_SHORT"),
            [this._getLocaleLabels("TL_TABLE_COL_OWN_NAME")]:
              item.tradeLicenseDetail.owners[0].name || "-",
            [this._getLocaleLabels("TL_TABLE_COL_APP_DATE")]:
              convertEpochToDate(item.applicationDate) || "-",
              [this._getLocaleLabels("TL_TABLE_COL_FIN_YEAR")]:
              item.financialYear || "-",
              [this._getLocaleLabels("TL_TABLE_COL_APP_TYPE")]:
              item.applicationType || "Renew",
            [this._getLocaleLabels("TL_TABLE_COL_STATUS")]: this._getLocaleLabels(item.status) || "-",
            ["tenantId"]: item.tenantId,
            ["status1"]: item.status || "-"
          }));
          const title = this._getLocaleLabels("TL_HOME_SEARCH_RESULTS_TABLE_HEADING")
          return(
            <Table {...rest} columns={columns} data={data} title={`${title}(${data.length})`}/>
        )
    }
}

export default connect(({app, screenConfiguration}) => {
    const { localizationLabels = [] } = app;
    const { preparedFinalObject } = screenConfiguration;
    const data = get(preparedFinalObject, "_searchResults")
    return { localizationLabels, data }
})(TableContainer)