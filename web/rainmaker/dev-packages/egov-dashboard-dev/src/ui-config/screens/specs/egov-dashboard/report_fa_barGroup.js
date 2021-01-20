import { getCommonContainer, getCommonHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getFileUrlFromAPI, getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { getTenantId, getUserInfo, setapplicationNumber, setapplicationType } from "egov-ui-kit/utils/localStorageUtils";
import jp from "jsonpath";
import get from "lodash/get";
import set from "lodash/set";
import { httpRequest } from "../../../../ui-utils";
import { getSearchResultsView, setApplicationNumberBox } from "../../../../ui-utils/commons";
import { clearlocalstorageAppDetails } from "../utils";
import { addressdetails } from './serviceRequestDetails/addressdetails';
import { ownerdetails } from './serviceRequestDetails/ownerdetails';
import { servicerequestdetails } from './serviceRequestDetails/servicerequestdetails';
import { uploadimage } from './serviceRequestDetails/uploadimage';
import { getCommonApplyFooter } from "../utils";
import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";


const APIGraphData = {
  "graphData" : [
      {
          "month" : "Jan",
          "raisedComplaints" : 10,
          "categoryComplaints" : [10,20,30]
      },
      {
          "month" : "Feb",
          "raisedComplaints" : 20,
          "categoryComplaints" : [10,20,30]
      },
      {
          "month" : "Mar",
          "raisedComplaints" : 30,
          "categoryComplaints" : [10,20,30]
      },
      {
        "month" : "April",
        "raisedComplaints" : 50,
        "categoryComplaints" : [80,20,35]
    },
      ],
  "category" : ["PR", "HC", "TL"]
}

const getRedirectionURL = () => {
  /* Mseva 2.0 changes */
  const redirectionURL = "/egov-report/home"
  return redirectionURL;
};

const callBackForNext = async (state, dispatch) => {
  dispatch(
    toggleSnackbar(
      true,
      { labelName: "ERROR", labelKey: "Route to home page" },
      "warning"
    )
  );
};

export const footer = getCommonApplyFooter({
  // nextButton: {
  //   componentPath: "Button",
  //   props: {
  //     variant: "contained",
  //     color: "primary",
  //     style: {
  //       minWidth: "200px",
  //       height: "48px",
  //       marginRight: "45px"
  //     }
  //   },
  //   children: {
  //     nextButtonLabel: getLabel({
  //       labelName: "BUTTON",
  //       labelKey: "BUTTON"
  //     }),

      
  //   },
  //   onClickDefination: {
  //     action: "condition",
  //     callBack: callBackForNext
  //   },
  //   visible: true
  // },
  gotoHome: {
    componentPath: "Button",
    
    props: {
      variant: "outlined",
      className:"home-footer",
      color: "primary",
      style: {
    //    minWidth: "200px",
        height: "48px",
        marginRight: "16px"
      }
    },
    children: {
      downloadReceiptButtonLabel: getLabel({
        labelName: "GO TO HOME",
        labelKey: "Home"
      })
    },
    onClickDefination: {
      action: "page_change",
      path: `${getRedirectionURL()}`
    }
  }

});

export const header = getCommonHeader(
  {
    labelName: "Report",
    labelKey: "Report Graph Line Bar Groups"
  },
  {
    classes: {
      root: "common-header-cont"
    }
  }
)

export const reportCardGraph =  {
    uiFramework: "custom-molecules-local",
    moduleName: "egov-report",
    componentPath: "ReportMoleculeBarGroup",
    props: {
    formKey: `newapplication`,
    data : JSON.stringify(APIGraphData)
    },
    style: {
      minWidth: "1200px",
      height: "500px",
      marginRight: "45px"
    },
    visible: true,
    // required: true
}

const screenConfig = {
  uiFramework: "material-ui",
  name: "report_fa_barGroup",
  beforeInitScreen: (action, state, dispatch) => {

    dispatch(
      handleField("report_fa_barGroup",
      "components.div.children.reportCardGraph",
      "props.value",
      {"demo" : "DEMO"}
      )
      );

    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Div",
          children: {
            header: {
              gridDefination: {
                xs: 12,
                sm: 12
              },
              ...header
            }
          }
        }, 
        reportCardGraph,
        footer
      }
    }
  }
};

export default screenConfig;