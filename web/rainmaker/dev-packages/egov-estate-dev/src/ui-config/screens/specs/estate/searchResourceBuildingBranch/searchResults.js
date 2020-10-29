import React from "react";
import {
  sortByEpoch,
  getEpochForDate,
  getTextToLocalMapping
} from "../../utils";
import { getTenantId, getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import { getLocaleLabels, getQueryArg } from "egov-ui-framework/ui-utils/commons";
import {
  ESTATE_APPROVED_STATE,
  ESTATE_DRAFTED_STATE
} from "../../../../../ui-constants"

const tenantId = getTenantId();
const userInfo = JSON.parse(getUserInfo());
const {
    roles = []
} = userInfo
const findItem = roles.find(item => item.code === "ES_EB_SECTION_OFFICER");

export const LAST_MODIFIED_ON = getLocaleLabels("LAST MODIFIED ON", "ES_LAST_MODIFIED_ON_LABEL")

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
    }
  }
};

const onRowClick = rowData => {
  console.log(rowData);

  if (rowData[2].toUpperCase() === ESTATE_DRAFTED_STATE) {
    window.location.href = `apply-building-branch?fileNumber=${rowData[0]}&tenantId=${tenantId}`;
  }
  else {
    window.location.href = `search-preview-building-branch?fileNumber=${rowData[0]}&tenantId=${tenantId}`;
  }
};





