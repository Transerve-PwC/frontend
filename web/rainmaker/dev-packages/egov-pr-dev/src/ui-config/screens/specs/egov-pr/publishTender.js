import {getCommonContainer,getCommonHeader,getStepperObject,getCommonTitle ,getBreak} from "egov-ui-framework/ui-config/screens/specs/utils";
import { tenderApplyfooter,takeactionfooter } from "./applyResource/tenderApplyfooter";
import jp from "jsonpath";
import {localStorageSet} from "egov-ui-kit/utils/localStorageUtils";
import { tenderDetails, EmailSmsContent} from "./tenderResources/tenderDetails";
import { getQueryArg,getFileUrlFromAPI } from "egov-ui-framework/ui-utils/commons";
import {  getTextToLocalMapping } from "../utils";
import {prepareFinalObject,handleScreenConfigurationFieldChange as handleField} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { httpRequest } from "../../../../ui-utils";
import set from "lodash/set";
import get from "lodash/get";
import {prepareDocumentsUploadData, furnishNocResponsePressNote,getSearchResultsViewPressnotedata,  getsampleemailtemplate,} from "../../../../ui-utils/commons";
import {getPressGridDatatender} from "./searchResource/citizenSearchFunctions";
import { PressMasterListForTender,searchGridSecondstep } from "./searchResource/searchResults";
import { localStorageGet } from "egov-ui-kit/utils/localStorageUtils";
import './publishtender.css';
import { getSearchResultsforTenderView } from "./searchResource/citizenSearchFunctions";

import commonConfig from '../../../../config/common';

export const stepsData = [
  { labelName: "PUBLISH TENDER DETAILS", labelKey: "PR_PUBLISH_TENDER_DETAILS" },
  { labelName: "PUBLICATION NAME LISXT", labelKey: "PR_PUBLICATION_NAME_LIST" },
  { labelName: "EMAIL SMS CONTENT", labelKey: "PR_EMAIL_SMS_CONTENT" }
];
export const stepper = getStepperObject(
  { props: { activeStep: 0 } },
  stepsData
);


export const header = getCommonContainer({
  header: getCommonHeader({
    labelName: `Publish Tender Notice Details`, 
    labelKey: "PR_PUBLISH_TENDER_NOTICE_DETAILS"
  }),
 
});

export const formwizardFirstStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form1"
  },
  children: {
   
    tenderDetails,
    break: getBreak(),
    break: getBreak(),
    publicationheader: getCommonTitle({
      labelName: "select publication list",
      labelKey: "PR_SELECT_PUBLICATION"
    },
    {
      style: {
        marginBottom: 18
      }
    }
    ),
    break: getBreak(),
    break: getBreak(),
    PressMasterListForTender,
    }
};

export const formwizardSecondStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form2"
  },
  children: {
    searchGridSecondstep
  },
  visible: false
};

export const formwizardThirdStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form3"
  },
  children: {
    EmailSmsContent,

  },
  visible: false
};

const getMdmsData = async (action, state, dispatch) => {
  let tenantId =commonConfig.tenantId;

  
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: tenantId,
      moduleDetails: [
       
        {
          moduleName: "tenant",
          masterDetails: [
            {
              name: "tenants"
            }
          ]
        },


        {
          moduleName: "tenant",
          masterDetails: [
            {
              name: "tenants"
            }
          ]
        }
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


export const prepareEditFlow = async (
  state,
  dispatch,
  applicationNumber,
  tenantId,
  action
) => {
  let args = getQueryArg(window.location.href, "pressnoteuuId");
  if(args)
  {
  let payload={
    "requestBody":{
            "tenantId":getTenantId(),
            "pressNoteUuid":getQueryArg(window.location.href, "pressnoteuuId") ,
           "moduleCode": localStorageGet("modulecode"),
            
    }
    
          }
        
         
   let response = await getSearchResultsViewPressnotedata(payload)

 if(response.ResponseBody.length>0)
 {
  
   let empdata=await getPressGridDatatender(action, state, dispatch);
   
 let data=''
 let selectedrowslocal=[];
 let selectedRows=[];
 empdata.map(function (item, index) {
   
   if(item.pressMasterUuid){
   response.ResponseBody[0].publicationList.map(function (commiteeMember,index1) {
     if(commiteeMember.pressMasterUuid===item.pressMasterUuid){
     
       data =response.ResponseBody[0].publicationList.map(item => ({
        [getTextToLocalMapping("Publication Name")]:
        item.publicationName || "-",
        [ getTextToLocalMapping("Type of the Press")]:
        item.pressType || "-",
        [getTextToLocalMapping("Name")]:
        item.personnelName || "-",
        [getTextToLocalMapping("Email Id")]:
        item.email || "-",
        [getTextToLocalMapping("Mobile Number")]:
        item.mobile || "-",
        [getTextToLocalMapping("Press master UUID")]:
        item.pressMasterUuid || "-",
      
        
        }));
     
       selectedRows.push(index)
       
     }
   });
 }
   });
 dispatch(
   handleField(
     "publishTender",
     "components.div.children.formwizardFirstStep.children.PressMasterListForTender",
     "props.options.rowsSelected",
     selectedRows
   )
 );
 
 
 dispatch(
  handleField(
    "publishTender",
    "components.div.children.formwizardSecondStep.children.searchGridSecondstep",
    "props.data",
    data
  ));


  let documentsPreview = [];
  
  let fileStoreIds1 = response.ResponseBody[0].documentAttachment
  documentsPreview.push({
    
    fileStoreId:fileStoreIds1[0].fileStoreId ,
    
  })

  let fileStoreIds = jp.query(documentsPreview, "$.*.fileStoreId");
  
  let fileUrls =
  fileStoreIds.length > 0 ? await getFileUrlFromAPI(fileStoreIds) : {};
documentsPreview = documentsPreview.map(function (doc, index) {

doc["fileUrl"] = fileUrls && fileUrls[doc.fileStoreId] && fileUrls[doc.fileStoreId].split(",")[0] || "";

  doc["fileName"] =
    (fileUrls[doc.fileStoreId] &&
      decodeURIComponent(
        fileUrls[doc.fileStoreId]
          .split(",")[0]
          .split("?")[0]
          .split("/")
          .pop()
          .slice(13)
      )) ||
    `Document - ${index + 1}`;
   
  return doc;
});


dispatch(prepareFinalObject("documentsUploadRedux[0].documents", documentsPreview));


  let Refurbishresponse = furnishNocResponsePressNote(response);
  dispatch(prepareFinalObject("pressnote", Refurbishresponse));
}
 }
 let documentsPreview = [];
 
   
  

};

const screenConfig = {
  uiFramework: "material-ui",
  name: "publishTender",
  beforeInitScreen: (action, state, dispatch) => {
    const applicationNumber = getQueryArg(
      window.location.href,
      "applicationNumber"
    );
    const tenantId = getQueryArg(window.location.href, "tenantId");
    const step = getQueryArg(window.location.href, "step");
	//TenderDocuments
	 // Get Sample email tmplate for event 
      localStorageSet("eventifforinvitatoin", "");
      localStorageSet("templateMappedUuid", "");
      localStorageSet("templateType", "TENDER_NOTICE");
      localStorageSet("templateModuleName", "TENDER");
      localStorageSet("subject", []);
      dispatch(prepareFinalObject("TenderDocuments",[]));


      localStorageSet("sms", "");
      localStorageSet("email", "");
      localStorageSet("EmailTemplate", "");
      localStorageSet("smsTemplate", "");
     getsampleemailtemplate(action, state, dispatch);
    //localStorage.setItem("PressTenderList",[])
    localStorageSet("PressTenderList", []);	

    //Set Module Name
    set(state, "screenConfiguration.moduleName", "egov-pr");
    getPressGridDatatender(action, state, dispatch);
    // Set MDMS Data
    // Set MDMS Data


    let payload1 = {
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
    getSearchResultsforTenderView(state, dispatch, payload1)

    getMdmsData(action, state, dispatch).then(response => {
      prepareDocumentsUploadData(state, dispatch, 'create_pressnote');
    });

    // Search in case of EDIT flow
    prepareEditFlow(state, dispatch, applicationNumber, tenantId,action);
   

    // Code to goto a specific step through URL
    if (step && step.match(/^\d+$/)) {
      let intStep = parseInt(step);
      set(
        action.screenConfig,
        "components.div.children.stepper.props.activeStep",
        intStep
      );
      let formWizardNames = [
        "formwizardFirstStep",
        "formwizardSecondStep",
         "formwizardThirdStep",
        // "formwizardFourthStep"
      ];
      for (let i = 0; i < 1; i++) {
        set(
          action.screenConfig,
          `components.div.children.${formWizardNames[i]}.visible`,
          i == step
        );
        set(
          action.screenConfig,
          `components.div.children.footer.children.previousButton.visible`,
          step != 0
        );
      }
    }

    set(
		action.screenConfig,  "components.div.children.formwizardThirdStep.children.EmailSmsContent.children.cardContent.children.SMSContent.props.value",
        localStorageGet("smsTemplate")
    );

    return action;
  },

  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      children: {
        header: header,
       
      }
    }
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
        stepper,
      
        formwizardFirstStep,
        formwizardSecondStep,
       formwizardThirdStep,
       
        tenderApplyfooter,
        takeactionfooter
      }
    }
  }
};

export default screenConfig;
