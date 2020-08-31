import {
  getCommonHeader,
  getLabel,
  getBreak
} from "egov-ui-framework/ui-config/screens/specs/utils";

import { showHideAdhocPopup, resetFields, getRequiredDocData } from "../utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { pendingApprovals } from "./searchResource/pendingApprovals";
import { pressGrid } from "./searchResource/pressGrid";
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
import { getPressMasterGridData } from "./searchResource/citizenSearchFunctions";
import { pressMasterFilter } from "./gridFilter/Filter";
import { httpRequest } from "../../../../ui-utils";
import commonConfig from '../../../../config/common';

const hasButton = getQueryArg(window.location.href, "hasButton");
let enableButton = true;
enableButton = hasButton && hasButton === "false" ? false : true;

const header = getCommonHeader({
  labelName: "Press Master List",
  labelKey: "PR_PRESS_MASTER_HEADING"
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
          masterDetails: [{ name: "pressType" }]
        }]
       
        


      
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
    let obj1={}
    obj['name']="ALL"
    obj['code']="ALL"
   
    

    obj1['name']="Select Type Of The Press"
  payload.MdmsRes["RAINMAKER-PR"].pressType.unshift(obj1)
  payload.MdmsRes["RAINMAKER-PR"].pressType.push(obj)
 
    dispatch(prepareFinalObject("applyScreenMdmsData", payload.MdmsRes));
  } catch (e) {
    console.log(e);
  }
};
const PRSearchAndResult = {
  uiFramework: "material-ui",
  name: "pressGrid",
  beforeInitScreen: (action, state, dispatch) => {
    dispatch(prepareFinalObject("PublicRelation[0].filterEvent", {}));
    dispatch(prepareFinalObject("PublicRelation[0].filterInviteEvent", {}));
   dispatch(prepareFinalObject("PublicRelation[0].filterpress", {}));
    dispatch(prepareFinalObject("PublicRelation[0].filtertender", {}));
    dispatch(prepareFinalObject("PublicRelation[0].filterpressMaster", {}));
    dispatch(prepareFinalObject("PublicRelation[0].filterLibraryEvent", {}));
    

  getPressMasterGridData(action, state, dispatch);
  getMdmsData(action, state, dispatch)
  
    const tenantId = getTenantId();
   
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
        id: "pressGrid"
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
            },
          }
        
        },
        pressMasterFilter,
        breakAfterSearch: getBreak(),
        pressGrid
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
