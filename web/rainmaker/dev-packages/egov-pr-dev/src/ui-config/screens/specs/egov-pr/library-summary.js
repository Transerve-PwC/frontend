import {
  getCommonCard,
  getCommonContainer,
  getCommonHeader,
  getLabelWithValue,
  getBreak,
  getCommonParagraph ,
  getLabel,
   
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
import {localStorageGet} from "egov-ui-kit/utils/localStorageUtils";
import { documentsEventSummary,documentslibrarySummary,documentslibrarySummary1,documentslibrarySummary2,documentslibrarySummary3,documentslibrarySummary4,documentslibrarySummary5 } from "./summaryResource/documentsSummary";
import { librarysummaryFooter } from "./applyResource/librarysummaryFooter";
import { propertySummary } from "./summaryResource/propertySummary";
import { generateBill } from "../utils/index";
import { getTenantId ,geteventuuid} from "../../../../../../../packages/lib/egov-ui-kit/utils/localStorageUtils/index";
import {getSearchResultsView,getSearchResultsViewLibrary} from "../egov-pr/searchResource/citizenSearchFunctions";
import "./publishtender.css"
import { httpRequest, baserequestURL } from "../../../../ui-utils";
import { checkLibraryVisibility } from "../../../../ui-utils/commons";
import commonConfig from '../../../../config/common';
import {
  getUserInfo
 } from "egov-ui-kit/utils/localStorageUtils";

const header = getCommonContainer({
  header: getCommonHeader({
    labelName: "Library Details",
    labelKey: "PR_LIBRARY_DETAILS_HEADER"
  }),
  eventId: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-pr",
    componentPath: "ApplicationNoContainer",
    props: {
      number: getQueryArg(window.location.href, "eventId")
    }

  },
});


export const handleEvent =( state, dispatch) => {
  let fileid=get(
    state.screenConfiguration.preparedFinalObject,
    "fileid"
  )
  
   let tenantId = getTenantId();
   let invitedGuestlist = [];
   var data_result="";
   let eventId = getQueryArg(window.location.href, "eventuuId"); 
   let mdmsBody = {
         "tenantId": tenantId,
         "moduleCode":localStorageGet("modulecode"),   
         "eventDetailUuid": eventId,
         "documentList":[
                   {
                    "documentType":"",
                    "documentId":[
                   {
                    "fileStoreId":fileid
                   }
                    ]
                   }
                 ]
   };
   
    console.log(mdmsBody)
   try {
   let payload = null;
   let delete_api = baserequestURL+"/prscp-services/v1/library/_delete";
   payload =  httpRequest("post", delete_api, "_delete", [], { RequestBody: mdmsBody }).then(response => {
  
   console.log(response)
   if(response.ResponseInfo.status === "Success")
   {
     window.location.reload();
   }
   else
   {
     alert("Internal Error, Try Again!")
   }
 
     }).catch(error => {
     alert("Invalid Request")
     });
   } catch (e) {
   console.log(e);
   }
		
 };


export const ConfirmMsg = getCommonContainer({
   
  msgContainer: getCommonContainer({
    subText: getCommonParagraph({
      labelName: "Are you sure you want to remove this media?",
      
      labelKey: "PR_LIBRARY_CONFIRM_MSG"
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
        callBack: (action, state, dispatch) => { window.location.reload(); }
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
          labelName: "OK",
          labelKey: "PR_OK_BUTTON"
        }),
        
      },
      onClickDefination: {


        action: "condition",
        callBack:handleEvent
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
const getMdmsData = async (action, state, dispatch) => {

  let mdmsBody = {
    MdmsCriteria: {
      tenantId: commonConfig.tenantId,
      moduleDetails: [
        {
          moduleName: "RAINMAKER-PR",
          masterDetails: [ { name: "LibraryRoleCheck" }
          
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
  name: "library-summary",
  beforeInitScreen: (action, state, dispatch) => {
    
    getMdmsData(action, state, dispatch).then(response => {
      let mdmsresponse=  get(
        state,
        "screenConfiguration.preparedFinalObject.applyScreenMdmsData",
        {}
      );
      checkLibraryVisibility(action, state, dispatch,mdmsresponse,JSON.parse(getUserInfo()).roles)
    })



    let payload={
      "requestBody":{
              "tenantId":getTenantId(),
              "eventDetailUuid": getQueryArg(window.location.href, "eventuuId") ,
              "scheduledStatus":"",
              "eventStatus":"PUBLISHED",
              "moduleCode": localStorageGet("modulecode"),
              
      }
      
            }
    getSearchResultsView(state, dispatch,payload)
    getSearchResultsViewLibrary(state, dispatch,payload)
    
    
// Hide edit buttons
set(
  action,
  "screenConfig.components.div.children.body.children.cardContent.children.documentsSummary.children.cardContent.children.header.children.editSection.visible",
  false
);
set(
  action,
  "screenConfig.components.div.children.body.children.cardContent.children.propertySummary.children.cardContent.children.header.children.editSection.visible",
  false
);

set(
  action,
  "screenConfig.components.div.children.body.children.cardContent.children.documentslibrarySummary.children.cardContent.children.header.children.editSection.visible",
  false
);
set(
  action,
  "screenConfig.components.div.children.body.children.cardContent.children.documentslibrarySummary1.children.cardContent.children.header.children.editSection.visible",
  false
);
set(
  action,
  "screenConfig.components.div.children.body.children.cardContent.children.documentslibrarySummary2.children.cardContent.children.header.children.editSection.visible",
  false
);
set(
  action,
  "screenConfig.components.div.children.body.children.cardContent.children.documentslibrarySummary3.children.cardContent.children.header.children.editSection.visible",
  false
);
set(
  action,
  "screenConfig.components.div.children.body.children.cardContent.children.documentslibrarySummary4.children.cardContent.children.header.children.editSection.visible",
  false
);
set(
  action,
  "screenConfig.components.div.children.body.children.cardContent.children.documentslibrarySummary5.children.cardContent.children.header.children.editSection.visible",
  false
);
    
    prepareDocumentsView(state, dispatch);
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
         
        propertySummary: propertySummary,
         
           documentsSummary: documentsEventSummary,
           documentslibrarySummary:documentslibrarySummary,
           documentslibrarySummary1:documentslibrarySummary1,
           documentslibrarySummary2:documentslibrarySummary2,
           documentslibrarySummary3:documentslibrarySummary3,
           documentslibrarySummary4:documentslibrarySummary4,
           documentslibrarySummary5:documentslibrarySummary5
        }),
        librarysummaryFooter: librarysummaryFooter
      }
    },
    adhocDialog: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-pr",
      componentPath: "DialogContainer",
      props: {
        open: false,
        maxWidth: "xs",
        screenKey: "library-summary"
      },
      children: {
        popup: ConfirmMsg
      }
    },
  }
};

export default screenConfig;
