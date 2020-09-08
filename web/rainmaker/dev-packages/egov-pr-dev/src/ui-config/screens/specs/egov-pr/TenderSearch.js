import {
    getCommonHeader,
    getLabel,
    getBreak
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  
  import { showHideAdhocPopup, resetFields, getRequiredDocData } from "../utils";
  import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
  import { pendingApprovals } from "./searchResource/pendingApprovals";
  import { publishTenderSearchResults } from "./searchResource/searchResults";
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
  import { getGridDataPublishTender } from "./searchResource/citizenSearchFunctions";
  import { TenderFilter } from "./gridFilter/Filter";
  import {
    getUserInfo
   } from "egov-ui-kit/utils/localStorageUtils";
   import { httpRequest } from "../../../../ui-utils";
import commonConfig from '../../../../config/common';
  const hasButton = getQueryArg(window.location.href, "hasButton");
  let enableButton = true;
  enableButton = hasButton && hasButton === "false" ? false : true;
  
  const header = getCommonHeader({
    labelName: "Tender Notice Details",
    labelKey: "PR_TENDER_NOTICE_DETAILS"
  });
  
  const pageResetAndChange = (state, dispatch) => {
    dispatch(
      prepareFinalObject("PublicRelations", [{ "PublicRelationDetails.PublicRelationType": "NEW" }])
    );
    
  };
  const getMdmsData = async (action, state, dispatch) => {

    let mdmsBody = {
      MdmsCriteria: {
        tenantId: commonConfig.tenantId,
        moduleDetails: [
          {
            moduleName: "RAINMAKER-PR",
            masterDetails: [ { name: "TenderStatusCheck" }
            
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
    
        
      dispatch(prepareFinalObject("applyScreenMdmsData", payload.MdmsRes));
    } catch (e) {
      console.log(e);
    }
  };
  const PRSearchAndResult = {
    uiFramework: "material-ui",
    name: "TenderSearch",
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
  
      getMdmsData(action, state, dispatch).then(response => {
        let mdmsresponse=  get(
          state,
          "screenConfiguration.preparedFinalObject.applyScreenMdmsData",
          {}
        );
        let role=JSON.parse(getUserInfo()).roles
        mdmsresponse["RAINMAKER-PR"].TenderStatusCheck.map(res => {
          role.map(roleName=>{
            if( roleName.code === res.isRole )
            {
              getGridDataPublishTender(action, state, dispatch,res.TenderListStatus);

            }})})
     

       // checkTenderVisibility(action, state, dispatch,mdmsresponse,getQueryArg(window.location.href, "Status"),JSON.parse(getUserInfo()).roles)
      })
      
  
  
      const tenantId = getTenantId();
      const BSqueryObject = [
        { key: "tenantId", value: tenantId },
        { key: "businessServices", value: "PRSCP" }
      ];
     
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
          id: "TenderSearch"
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
              }
            }
          
  
            
          },
        
          TenderFilter,
          breakAfterSearch: getBreak(),
          publishTenderSearchResults
        }
      },
      adhocDialog: {
        uiFramework: "custom-containers-local",
        moduleName: "egov-pr",
        componentPath: "DialogContainer",
        props: {
          open: false,
          maxWidth: false,
          screenKey: "TenderSearch"
        },
        children: {
          popup: {}
        }
      }
    }
  };
  
  export default PRSearchAndResult;
  