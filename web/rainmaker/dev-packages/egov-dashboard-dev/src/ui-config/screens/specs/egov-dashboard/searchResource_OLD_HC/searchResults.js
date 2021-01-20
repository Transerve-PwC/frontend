import { getCommonHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { getEpochForDate, getTextToLocalMapping, sortByEpoch } from "../../utils";
import "./index.css";



const onRowClickServiceRequestsSearch = rowData => {
  switch (rowData[5]) {
    case "INITIATED":
      window.location.href = `apply?applicationNumber=${rowData[0]}&tenantId=${getTenantId()}`;
      break;
    default:
      window.location.href = `search-preview?applicationNumber=${
        rowData[0]
      }&tenantId=${getTenantId()}`;
      break;
  }
};

export const searchResultsServiceRequest ={
  uiFramework: "custom-molecules",
  componentPath: "Table",
  visible: true,
  props: {
    data:[
      { Name: "Joe James", Company: "Test Corp", City: "Yonkers", State: "NY" },
      { Name: "John Walsh", Company: "Test Corp", City: "Hartford", State: "CT" },
      { Name: "Bob Herm", Company: "Test Corp", City: "Tampa", State: "FL" },
      { Name: "James Houston", Company: "Test Corp", City: "Dallas", State: "TX" },
    ],
    columns: ["Name", "Company", "City", "State"],
    

    options: {
      filter: false,
      download: false,
      responsive: "stacked",
      selectableRows: false,      
      hover: true,
      rowsPerPageOptions: [10, 15, 20],
      onRowClick: (row, index) => {
        onRowClickServiceRequestsSearch(row);
      }
    },
    customSortColumn: {
      column: "Service Request Date",
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


const header = getCommonHeader(
  {
      labelName: "My Service Requests",
      labelKey: "HC_MY_APPLICATIONS_HEADER"
  },
  {
      classes: {
          root: "common-header-cont"
      }
  }
);
