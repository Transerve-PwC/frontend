import { getCommonCard, getCommonContainer, getCommonHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  getFileUrlFromAPI,
  getQueryArg,
  getTransformedLocale
} from "egov-ui-framework/ui-utils/commons";
import { documentsSummary } from "./summaryResource/tenderDocumentsSummary";
import { getTenantId, getapplicationNumber,localStorageGet,localStorageSet} from "egov-ui-kit/utils/localStorageUtils";
import { getSearchResultsforTenderView } from "./searchResource/citizenSearchFunctions";
import { tenderSummaryfooter } from './applyResource/tenderFooter';
import { ResendTenderInviteGrid } from './tenderResources/tenderDetails';
import { tenderPublishSummary } from "./summaryResource/tenderSummary";
import {
 getUserInfo
} from "egov-ui-kit/utils/localStorageUtils";
import set from "lodash/set";
import "../../../../customstyle.css";
import "./publishtender.css";
import { checkForRole,checkTenderVisibility } from "../../../../ui-utils/commons";
import { httpRequest } from "../../../../ui-utils";
import commonConfig from '../../../../config/common';
import get from "lodash/get";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import store from "ui-redux/store";

const titlebar = getCommonContainer({
  header: getCommonHeader({
    labelName: "Tender Notice Details",
    labelKey: "PR_TENDER_NOTICE_DETAILS"
  }),
  tenderNoticeId: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-pr",
    componentPath: "TenderContainer",
    props: {
      number:getQueryArg(window.location.href, "tenderId"),
    }
  },


  
});
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

const screenConfig = {
  uiFramework: "material-ui",
  name: "tender-Summary-Publish",
  beforeInitScreen: (action, state, dispatch) => {
    set(
      action,
      "screenConfig.components.div.children.body.children.cardContent.children.tenderPublishSummary.children.cardContent.children.header.children.editSection.visible",
      false
    );
    getMdmsData(action, state, dispatch).then(response => {
      let mdmsresponse=  get(
        state,
        "screenConfiguration.preparedFinalObject.applyScreenMdmsData",
        {}
      );
      checkTenderVisibility(action, state, dispatch,mdmsresponse,getQueryArg(window.location.href, "Status"),JSON.parse(getUserInfo()).roles)
    })


	localStorageSet("resendmodule", "TENDER");
  localStorageSet("eventifforinvitatoin",getQueryArg(window.location.href, "tenderuuId"));
  localStorageSet("ResendInvitelist", []);	
  localStorageSet("ResendInvitelistAll", []);	

			
	let payload = {
      "RequestBody": {
        "tenantId": getTenantId(),
        "moduleCode": localStorageGet("modulecode"),
       
        "tenderNoticeUuid": getQueryArg(window.location.href, "tenderuuId"),
        "tenderNoticeId": getQueryArg(window.location.href, "tenderId"),
        "fileNumber":"",
        "tenderSubject":"",
        "tenderNoticeStatus":"",
        "fromDate":"",
        "toDate":"",
         "defaultGrid":false
        
      }
    }
    getSearchResultsforTenderView(state, dispatch, payload)


    
    

    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        className: "common-div-css"
      },
      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",
          children: {
            header: {
              gridDefination: {
                xs: 12,
                sm: 10
              },
              ...titlebar
            }
          }
        },
        body: getCommonCard({
          tenderPublishSummary: tenderPublishSummary,
          documentsSummary: documentsSummary,
        }),
    Resendbody:
    // checkForRole(JSON.parse(getUserInfo()).roles, 'DEPARTMENTUSER')
    //  || getQueryArg(window.location.href, "Status")=="CREATED" ?{}: 
     getCommonCard({
		   headerresend: {},	
       
        ResendTenderInviteGrid:{}

        }),
        
       tenderSummaryfooter:tenderSummaryfooter
      }
    }
  }
};

export default screenConfig;
