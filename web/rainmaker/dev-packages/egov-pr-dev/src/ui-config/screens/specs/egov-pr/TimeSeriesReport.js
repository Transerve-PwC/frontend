import {
  getCommonHeader,
  getLabel,
  getBreak
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { httpRequest } from "../../../../ui-utils";

import { showHideAdhocPopup, resetFields, getRequiredDocData } from "../utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { pendingApprovals } from "./searchResource/pendingApprovals";
import { searchResults } from "./searchResource/searchResults";
import { setBusinessServiceDataToLocalStorage } from "egov-ui-framework/ui-utils/commons";
import {
  getTenantId,
  localStorageGet
} from "egov-ui-kit/utils/localStorageUtils";
import find from "lodash/find";
import set from "lodash/set";
import get from "lodash/get";
import {
  prepareFinalObject,
  handleScreenConfigurationFieldChange as handleField
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getRequiredDocuments } from "./requiredDocuments/reqDocs";
import { getGridData } from "./searchResource/citizenSearchFunctions";
import {EventFilter} from "./gridFilter/Filter";
import { TimeSeriesReport } from "./searchResource/Report";
import { TimeSeriessearchResults,TimeSeriessearchEventResults } from "./searchResource/searchResults";
import {  localStorageSet } from "egov-ui-kit/utils/localStorageUtils";
import "./publishtender.css";
import commonConfig from '../../../../config/common';
const hasButton = getQueryArg(window.location.href, "hasButton");
let enableButton = true;
enableButton = hasButton && hasButton === "false" ? false : true;

const header = getCommonHeader({
  labelName: "Time Series Report",
  labelKey: "PR_TIME_SERIES_REPORT"
});

const pageResetAndChange = (state, dispatch) => {
  dispatch(
    prepareFinalObject("PublicRelations", [{ "PublicRelationDetails.PublicRelationType": "NEW" }])
  );
  
};
const getMdmsData = async (action, state, dispatch) => {
  
  let tenantId = commonConfig.tenantId;
    
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: tenantId,
      moduleDetails: [
        {
          moduleName: "RAINMAKER-PR",
          masterDetails: [{ name: "eventReportYear" },{ name: "eventReportMonth" }, { name: "eventReportAggregatedBy" }]
        },
  
        {
          moduleName: "tenant",
          masterDetails: [
            {
              name: "tenants"
            }
          ]
        },
       
      ]
    }
  };
  try {
    let payload = null;
    payload = await httpRequest(
      "post",
      "/egov-mdms-service/v1/_search",
      "_search",
      [],
      mdmsBody
    );
   

    let obj={}
    obj['name']="ALL"
    obj['code']="ALL"
     payload.MdmsRes["RAINMAKER-PR"].eventReportMonth.unshift(obj)
     let obj1={}
     let obj2={}
     let obj3={}
  obj1['name']="Select Year"
  payload.MdmsRes["RAINMAKER-PR"].eventReportYear.unshift(obj1)


  
  obj2['name']="Select Month"
  payload.MdmsRes["RAINMAKER-PR"].eventReportMonth.push(obj2)

  
  obj3['name']="Select Aggregated By"
  payload.MdmsRes["RAINMAKER-PR"].eventReportAggregatedBy.unshift(obj3)
    dispatch(prepareFinalObject("applyScreenMdmsData", payload.MdmsRes));


  } catch (e) {
    console.log(e);
  }
};
const PRSearchAndResult = {
  uiFramework: "material-ui",
  name: "TimeSeriesReport",
  beforeInitScreen: (action, state, dispatch) => {
    dispatch(prepareFinalObject("TimeseriesReport", {}));
    dispatch(prepareFinalObject("eventReport", {}));
    dispatch(prepareFinalObject("LocalityReport", {}));
    dispatch(prepareFinalObject("PublicRelation[0].filterEvent", {}));
    dispatch(prepareFinalObject("PublicRelation[0].filterInviteEvent", {}));
    dispatch(prepareFinalObject("PublicRelation[0].filterpress", {}));
    dispatch(prepareFinalObject("PublicRelation[0].filtertender", {}));
    dispatch(prepareFinalObject("PublicRelation[0].filterpressMaster", {}));
    dispatch(prepareFinalObject("PublicRelation[0].filterLibraryEvent", {}));
  //getGridData(action, state, dispatch);


    const tenantId = getTenantId();

    getMdmsData(action, state, dispatch)

    getRequiredDocData(action, state, dispatch).then(() => {
      let documents = get(
        state,
        "screenConfiguration.preparedFinalObject.searchScreenMdmsData.PublicRelation.Documents",
        []
      );
      set(
        action,
        "screenConfig.components.adhocDialog.children.popup",
        getRequiredDocuments(documents)
      );
    });
    const modulecode = getQueryArg(
      window.location.href,
      "modulecode"
    );
  
    
	localStorageSet("modulecode",modulecode);
  
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Form",
      props: {
        className: "common-div-css",
       id: "TimeSeriesReport"
      },
      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",

          children: {
            header: {
              gridDefination: {
                xs: 12,
                sm: 6
              },
              ...header
            }}
         
        },
        TimeSeriesReport,
       
        breakAfterSearch: getBreak(),
        TimeSeriessearchResults,
        TimeSeriessearchEventResults
      }
    },
    adhocDialog: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-pr",
      componentPath: "DialogContainer",
      props: {
        open: false,
        maxWidth: false,
        screenKey: "search"
      },
      children: {
        popup: {}
      }
    }
  }
};

export default PRSearchAndResult;
