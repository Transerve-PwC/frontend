import { getCommonHeader, getCommonContainer } from "egov-ui-framework/ui-config/screens/specs/utils";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import "./index.css";

export const dashboardTypeSearchResults = {
    uiFramework: "custom-molecules-local",
    moduleName: "egov-dashboard",
    componentPath: "ReportMolecule",
    props: {
    formKey: `newapplication`,
    data : []
    },
    style: {
    },
    visible: true,
}


export const PGRDashboardResults = {
    uiFramework: "custom-molecules-local",
    moduleName: "egov-dashboard",
    componentPath: "DescriptionDashboard",
    props: {
    // className: "dashboard-graph",
    formKey: `newapplication`,
    data : []
    },
    style: {
    },
    visible: true,
}


// export const dashboardSearchResultHorizontalBar =  {
//   uiFramework: "custom-molecules-local",
//   moduleName: "egov-dashboard",
//   componentPath: "HorizontalBarMolecule",
//   props: {
//   formKey: `newapplication`,
//   data : []
//   },
//   style: {
//     // minWidth: "1200px",
//     // height: "500px",
//     // marginRight: "45px"
//   },
//   visible: true,
//   // required: true
// }