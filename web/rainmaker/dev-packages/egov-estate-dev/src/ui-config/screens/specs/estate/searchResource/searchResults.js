import React from "react";
import {
  sortByEpoch,
  getEpochForDate,
  getTextToLocalMapping
} from "../../utils";
import { searchApiCall } from "./functions";
import { localStorageGet,getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import { getLocaleLabels } from "egov-ui-framework/ui-utils/commons";

const userInfo = JSON.parse(getUserInfo());
const tenantId = getTenantId();

export const APPLICATION_NO = getLocaleLabels("APPLICATION NUMBER", "RP_COMMON_TABLE_COL_APPLICAITON_NUMBER")
export const PROPERTY_ID = getLocaleLabels("PROPERTY ID", "RP_COMMON_TABLE_COL_PROPERTY_ID")
export const OWNER_NAME = getLocaleLabels("APPLICANT NAME", "RP_COMMON_TABLE_COL_APPLICANT_NAME")
export const STATUS = getLocaleLabels("APPLICATION STATUS", "RP_COMMON_TABLE_COL_APPLICATION_STATUS")
export const LAST_MODIFIED_ON = getLocaleLabels("LAST MODIFIED ON", "RP_COMMON_TABLE_COL_LAST_MODIFIED_ON")


export const searchResults = {
  uiFramework: "custom-molecules",
  componentPath: "Table",
  visible: true,
  props: {
    columns: [
      getTextToLocalMapping("File Number"),
      getTextToLocalMapping("Sector Number"),
      getTextToLocalMapping("Status"),
      LAST_MODIFIED_ON
    ],
    options: {
      filter: false,
      download: false,
      responsive: "stacked",
      selectableRows: false,
      hover: true,
      rowsPerPageOptions: [10, 15, 20],
      onRowClick: (row, index) => {
        onRowClick(row);
      }
    },
    customSortColumn: {
      column: "Application Date",
      sortingFn: (data, i, sortDateOrder) => {
        const epochDates = data.reduce((acc, curr) => {
          acc.push([...curr, getEpochForDate(curr[4], "dayend")]);
          return acc;
        }, []);
        const order = sortDateOrder === "asc" ? true : false;
        const finalData = sortByEpoch(epochDates, !order).map(item => {
          item.pop();
          return item;
        });
        return { data: finalData, currentOrder: !order ? "asc" : "desc" };
      }
    }
  }
};

const onRowClick = rowData => {
  const {roles = []} = userInfo
  const findItem = roles.find(item => item.code === "CTL_CLERK");
  window.location.href = `search-preview?filenumber=${rowData[0]}&tenantId=${tenantId}`;
  // if(rowData[3].toUpperCase() === "PM_DRAFTED" && !!findItem) {
  //   window.location.href = `apply?tenantId=${getTenantId()}&transitNumber=${rowData[0]}`
  // } else {
  //   window.location.href = `search-preview?transitNumber=${rowData[0]}&tenantId=${getTenantId()}`;
  // }
};





