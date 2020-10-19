import {
  getCommonContainer,
  getCommonHeader,
  getStepperObject,
  getCommonTitle,
  getBreak

} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getCurrentFinancialYear } from "../utils";
import { pressapplyfooter,takeactionfooter } from "./applyResource/pressapplyfooter";

import jp from "jsonpath";
import {localStorageSet} from "egov-ui-kit/utils/localStorageUtils";

import { pressnotedetails ,pressnotedata, EmailSmsContent} from "./pressnoteresources/pressnotedetails";

import { pressNotedocumentDetails } from "./applyResource/documentDetails";
import { getQueryArg,getFileUrlFromAPI } from "egov-ui-framework/ui-utils/commons";

import { getTextToLocalMapping } from "../utils";

import {
  prepareFinalObject,
  handleScreenConfigurationFieldChange as handleField
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { httpRequest } from "../../../../ui-utils";

import set from "lodash/set";
import get from "lodash/get";
import {
  prepareDocumentsUploadData,
  //getSearchResults,
  furnishResponsePressNote,

  getSearchResultsViewPressnotedata,
    getsampleemailtemplate,templateType
} from "../../../../ui-utils/commons";
import { localStorageGet } from "egov-ui-kit/utils/localStorageUtils";

import {getPressGridDatanote} from "../egov-pr/searchResource/citizenSearchFunctions";
import { searchResultsPressMasterList,searchGridSecondstep } from "./searchResource/searchResults";
import { getPressGridData } from "./searchResource/citizenSearchFunctions";
import "./publishtender.css";
import commonConfig from '../../../../config/common';

export const stepsData = [
  { labelName: "PRESS NOTE DETAILS", labelKey: "PR_GENERATE_PRESS_NOTE_DETAILS" },
  { labelName: "PUBLICATION NAME LISXT", labelKey: "PR_PUBLICATION_NAME_LIST" },
  { labelName: "EMAIL SMS CONTENT", labelKey: "PR_EMAIL_SMS_CONTENT" }
];
export const stepper = getStepperObject(
  { props: { activeStep: 0 } },
  stepsData
);


export const header = getCommonContainer({
  header: getCommonHeader({
    labelName: `Generate press note`, 
    labelKey: "PR_GENERATE_PRESS_NOTE"
  }),
 
});

export const formwizardFirstStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form1"
  },
  children: {
   
   pressnotedetails,
   pressnotedata,
   pressNotedocumentDetails,
   break: getBreak(),

  //  publicationheader: getCommonHeader({
    publicationheader: getCommonTitle({
    
				labelName: "select publication list",
				labelKey: "PR_SELECT_PUBLICATION"
      },
      {
        style: {
          marginBottom: 18,
        }
      }
      ),
      break: getBreak(),
      break: getBreak(),


   searchResultsPressMasterList,
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
  let tenantId =  commonConfig.tenantId;

  
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: tenantId,
      moduleDetails: [
        {
          moduleName: "RAINMAKER-PR",
          masterDetails: [{ name: "pressnoteDocuments" }, { name: "localityAreaName" }]
        },
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
        },
        {
          moduleName: "common-masters",
          masterDetails: [
            {
              name: "Department"
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
  let invitedguests = response.ResponseBody[0].publicationList;

  const guestarray = invitedguests.filter((el) => {
    return (el.notifyStatus !== true);
});	



   let empdata=await getPressGridDatanote(action, state, dispatch);
   
 let data=''
 let selectedrowslocal=[];
 let selectedRows=[];
 let selectedrows1=[];
 empdata.map(function (item, index) {
   
   if(item.pressMasterUuid){
   response.ResponseBody[0].publicationList.map(function (commiteeMember,index1) {
     if(commiteeMember.pressMasterUuid===item.pressMasterUuid){
      let obj={}
      obj['Publication Name']=item.publicationName
     obj['Type of the Press']= item.pressType
     obj['Personnel Name']=item.personnelName
     obj['Email Id']=item.email
     obj['Mobile Number']=item.mobile
     obj['Press master UUID']=item.pressMasterUuid

    selectedrows1.push(obj)
      localStorageSet("PressNoteList", JSON.stringify(selectedrows1));
       data =response.ResponseBody[0].publicationList.map(item => ({
        [getTextToLocalMapping("Publication Name")]:
        item.publicationName || "-",
        [ getTextToLocalMapping("Type of the Press")]:
        item.pressType || "-",
        [getTextToLocalMapping("Personnel Name")]:
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
     "generatepressNote",
     "components.div.children.formwizardFirstStep.children.searchResultsPressMasterList",
     "props.options.rowsSelected",
     selectedRows
   )
 );
 
 
 dispatch(
  handleField(
    "generatepressNote",
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


  let Refurbishresponse = furnishResponsePressNote(response);
  dispatch(prepareFinalObject("pressnote", Refurbishresponse));
}
 }


};

const screenConfig = {
  uiFramework: "material-ui",
  name: "generatepressNote",
  beforeInitScreen: (action, state, dispatch) => {
    dispatch(prepareFinalObject("pressnote", {}));
    dispatch(prepareFinalObject("PressNoteDocuments", []));
    dispatch(prepareFinalObject("AllIndex", ""));
    dispatch(prepareFinalObject("documentsPreview", []));

    
    const applicationNumber = getQueryArg(
      window.location.href,
      "applicationNumber"
    );
    const tenantId = getQueryArg(window.location.href, "tenantId");
    const step = getQueryArg(window.location.href, "step");
    localStorageSet("pressnote", "");
      localStorageSet("eventifforinvitatoin", "");
      localStorageSet("templateMappedUuid", "");
      localStorageSet("templateType", "PRESS_RELEASE");
      localStorageSet("templateModuleName", "PRESSNOTE");
      localStorageSet("subject", []);

      localStorageSet("sms", "");
      localStorageSet("email", "");
      localStorageSet("EmailTemplate", "");
      localStorageSet("smsTemplate", "");
     getsampleemailtemplate(action, state, dispatch);
    localStorageSet("PressNoteList", []);	
    localStorageSet("PressNoteListAll", []);	

    //Set Module Name
    set(state, "screenConfiguration.moduleName", "egov-pr");
    getPressGridDatanote(action, state, dispatch);
    // Set MDMS Data
    // Set MDMS Data
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
        pressapplyfooter,
        takeactionfooter
      }
    }
  }
};

export default screenConfig;
