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
  localStorageGet,

  localStorageSet
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
import commonConfig from '../../../../config/common';

import {EventFilter} from "./gridFilter/Filter";

import {GetSortOrder} from "../../../../ui-utils/commons";



const hasButton = getQueryArg(window.location.href, "hasButton");
let enableButton = true;
enableButton = hasButton && hasButton === "false" ? false : true;

const header = getCommonHeader({
  labelName: "MANAGE EVENT",
  labelKey: "PR_MANAGE_EVENT"
});

const pageResetAndChange = (state, dispatch) => {
  dispatch(
    prepareFinalObject("PublicRelations", [{ "PublicRelationDetails.PublicRelationType": "NEW" }])
  );
  
};
const getMdmsData = async (action, state, dispatch) => {
  
  let tenantId =commonConfig.tenantId;
      
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: tenantId,
      moduleDetails: [
        {
          moduleName: "RAINMAKER-PR",
          masterDetails: [{ name: "eventStatus" }, { name: "eventScheduledStatus" }]
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
    
   
    let obj1={}
    let obj2={}
    

    obj1['name']="Select Schedule Status"
    payload.MdmsRes["RAINMAKER-PR"].eventScheduledStatus.unshift(obj1)
    obj2['name']="Select Event Status"
    payload.MdmsRes["RAINMAKER-PR"].eventStatus.unshift(obj2)
    dispatch(prepareFinalObject("applyScreenMdmsData", payload.MdmsRes));
  } catch (e) {
    console.log(e);
  }
};
const PRSearchAndResult = {
  uiFramework: "material-ui",
  name: "search",
  beforeInitScreen: (action, state, dispatch) => {
 dispatch(prepareFinalObject("PublicRelation[0].filterEvent", {}));
    dispatch(prepareFinalObject("PublicRelation[0].filterInviteEvent", {}));
    dispatch(prepareFinalObject("PublicRelation[0].filterpress", {}));
    dispatch(prepareFinalObject("PublicRelation[0].filtertender", {}));
    dispatch(prepareFinalObject("PublicRelation[0].filterpressMaster", {}));
    dispatch(prepareFinalObject("PublicRelation[0].filterLibraryEvent", {}));
    dispatch(prepareFinalObject("TimeseriesReport", {}));
    dispatch(prepareFinalObject("LocalityReport", {}));
    dispatch(prepareFinalObject("eventReport", {}));

  getGridData(action, state, dispatch);

  localStorageSet("shoWHideCancel","search")
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
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Form",
      props: {
        className: "common-div-css",
        id: "search"
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
        EventFilter,
        breakAfterSearch: getBreak(),
        searchResults
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
