import {
  getCommonCard,
  getCommonContainer,
  getCommonHeader,
  getLabelWithValue,
  getBreak,
  getLabel,
  getCommonParagraph
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  getFileUrlFromAPI,
  getQueryArg,
  getTransformedLocale
} from "egov-ui-framework/ui-utils/commons";
import jp from "jsonpath";
import get from "lodash/get";
import set from "lodash/set";
import { documentsEventSummary } from "./summaryResource/documentsSummary";
import { EventSummaryFooter,ApplySummaryfooter } from "./summaryResource/footer";
import { eventdetailsSummary } from "./summaryResource/eventdetailsSummary";
import {getSearchResultsView} from "../egov-pr/searchResource/citizenSearchFunctions"
import { localStorageGet, localStorageSet } from "egov-ui-kit/utils/localStorageUtils";
import { getTenantId} from "egov-ui-kit/utils/localStorageUtils";
import {
  
  handleScreenConfigurationFieldChange as handleField
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { cancelEventApplication,checkVisibility } from "../../../../ui-utils/commons";
import {  showHideAdhocPopupopmsReject } from "../utils";
import { httpRequest } from "../../../../ui-utils";
import commonConfig from '../../../../config/common';

const header = getCommonContainer({
  header: getCommonHeader({
    labelName: "Manage Event",
    labelKey: "PR_MANAGE_EVENT_HEADER"
  }),
  eventId: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-pr",
    componentPath: "ApplicationNoContainer",
    props: {
    number: ''
    }

  },
  status:getQueryArg(window.location.href, "status")==="null"?{}: 
  {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-pr",
    componentPath: "StatusContainer",
    props: {
      number: ''
     
    }

  }
  
});
const cancelNocApplication = async (state, dispatch) => {

let data={"RequestBody":{
  
      
              "tenantId": getTenantId(),
              "moduleCode": localStorageGet("modulecode"),
              "eventDetailUuid": getQueryArg(window.location.href, "eventuuId"),
              "eventStatus": "CANCELLED"
          } }
          cancelEventApplication(state, dispatch,data)

 
       
  //}
};
const closePopup = async (state, dispatch) => {


  showHideAdhocPopupopmsReject(state, dispatch, "summary", "pressMaster")

         
    
  };



  const getMdmsData = async (action, state, dispatch) => {

    let mdmsBody = {
      MdmsCriteria: {
        tenantId: commonConfig.tenantId,
        moduleDetails: [
          {
            moduleName: "RAINMAKER-PR",
            masterDetails: [ { name: "StatusCheck" }
            
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

export const ConfirmMsg = getCommonContainer({
   
  msgContainer: getCommonContainer({
    subText: getCommonParagraph({
      labelName: "Are you sure you want to cancel this event?",
      
      labelKey: "PR_EVENT_CONFIRM_MSG"
    }
    ,
      
      {
        style: {
          wordBreak:"break-all"
        }
      }
    ),
  }),
    break: getBreak(),
    btnContainer: getCommonContainer({

    cancel: {
      componentPath: "Button",
      props: {
        variant: "outlined",
      //  color: "primary",
        style: {
          color: "rgb(254, 122, 81)",
          border: "1px solid rgb(254, 122, 81)",
          borderRadius: "2px",
          height: "38px",
          marginRight: "16px",
          marginTop: "40px",
          minWidth:"80px",

        }
      },
      children: {
        nextButtonLabel: getLabel({
          labelName: "Cancel",
          labelKey: "PR_BUTTON_CANCEL"
        }),
      
      },
      onClickDefination: {


        action: "condition",
        callBack:closePopup
      }
    },
    submit: {
      componentPath: "Button",
      props: {
        variant: "contained",
       color: "primary",
        style: {
          borderRadius: "2px",
          height: "38px",
          marginRight: "16px",
          marginTop: "40px",
          minWidth:"80px",

        }
      },
      children: {
        nextButtonLabel: getLabel({
          labelName: "Ok",
          labelKey: "PR_OK_BUTTON"
        }),
       
      },
      onClickDefination: {


        action: "condition",
        callBack:cancelNocApplication
      }
    }

  })
});
const prepareDocumentsView = async (state, dispatch) => {
  
  let documentsPreview = [];
  let reduxDocuments = get(
    state,
    "screenConfiguration.preparedFinalObject.documentsUploadRedux",
    {}
  );
  jp.query(reduxDocuments, "$.*").forEach(doc => {
    if (doc.documents && doc.documents.length > 0) {
      documentsPreview.push({
        title: getTransformedLocale(doc.documentCode),
        name: doc.documents[0].fileName,
        fileStoreId: doc.documents[0].fileStoreId,
        linkText: "View"
      });
    }
  });
  let fileStoreIds = jp.query(documentsPreview, "$.*.fileStoreId");
  let fileUrls =
    fileStoreIds.length > 0 ? await getFileUrlFromAPI(fileStoreIds) : [];
  documentsPreview = documentsPreview.map(doc => {
    doc["link"] = fileUrls[doc.fileStoreId];
    return doc;
  });
 dispatch(prepareFinalObject("documentsPreview", documentsPreview));
    
}

const setSearchResponse = async (state, action, dispatch, tenantId,payload) => {


let response=await getSearchResultsView(state, dispatch,payload)
dispatch(prepareFinalObject("EventSummary", get(response, "ResponseBody", [])));
let EventId=getQueryArg(window.location.href, "eventId")
 dispatch(
  handleField(
    "summary",
    "components.div.children.headerDiv.children.header.children.eventId",
"props.number",
EventId
  )
);
let mdmsresponse=  get(
  state,
  "screenConfiguration.preparedFinalObject.applyScreenMdmsData",
  {}
);
let status=getQueryArg(window.location.href, "status")
let eventStatus=getQueryArg(window.location.href, "eventstatus")

if(status!=="null")
{
  
mdmsresponse["RAINMAKER-PR"].StatusCheck.map(res => {
  if(status === res.scheduleStatus && eventStatus==res.eventStatus)
{
 
  dispatch(
    handleField(
      "summary",
      "components.div.children.headerDiv.children.header.children.status",
  "props.number",
  res.isStatus
    )
  );
}



})
}
else{
  dispatch(
    handleField(
      "summary",
      "components.div.children.headerDiv.children.header.children",
  "status",
  {}
    )
  );
}
}  
const screenConfig = {
  uiFramework: "material-ui",
  name: "summary",
  beforeInitScreen: (action, state, dispatch) => {
    
    localStorageSet("EventId","")

    let EventId=getQueryArg(window.location.href, "eventId")
    localStorageSet("EventId",EventId)
//  dispatch(
//   handleField(
//     "summary",
//     "components.div.children.headerDiv.children.header.children.eventId",
// "props.number",
// EventId
//   )
// );

    let eventstatus=getQueryArg(window.location.href, "status")
    if(eventstatus!=="null")
    {
    set(
      action,
      "screenConfig.components.div.children.body.children.cardContent.children.eventdetailsSummary.children.cardContent.children.header.children.editSection.visible",
     false )
  
      
      set(
        action,
        "screenConfig.components.div.children.body.children.cardContent.children.documentsSummary.children.cardContent.children.header.children.editSection.visible",
        false)
      }
    getMdmsData(action, state, dispatch).then(response => {
      let mdmsresponse=  get(
        state,
        "screenConfiguration.preparedFinalObject.applyScreenMdmsData",
        {}
      );
      checkVisibility(action, state, dispatch,mdmsresponse,getQueryArg(window.location.href, "status"),getQueryArg(window.location.href, "eventstatus"))
    })

      let payload={
      "requestBody":{
              "tenantId":getTenantId(),
              "eventDetailUuid":getQueryArg(window.location.href, "eventuuId")            ,
              "scheduledStatus":"",
              "eventStatus":getQueryArg(window.location.href, "eventstatus"),
              "moduleCode":localStorageGet("modulecode"),
              
      }
      
            }

  
   

    setSearchResponse(state, action, dispatch, getTenantId(),payload);
    
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
              ...header
            }
          }
        },
        body: getCommonCard({
         
          eventdetailsSummary: eventdetailsSummary,
         
           documentsSummary: documentsEventSummary
        }),
        EventSummaryFooter: getQueryArg(window.location.href, "page")==="apply"?ApplySummaryfooter:EventSummaryFooter
      }
    },
    adhocDialog: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-pr",
      componentPath: "DialogContainer",
      props: {
        open: false,
        maxWidth: "xs",
        screenKey: "summary"
      },
      children: {
        popup: ConfirmMsg
      }
    },
  }
};

export default screenConfig;
