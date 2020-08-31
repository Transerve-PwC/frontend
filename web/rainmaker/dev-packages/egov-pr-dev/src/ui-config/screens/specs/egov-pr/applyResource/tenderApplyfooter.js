import {
  dispatchMultipleFieldChangeAction,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import get from "lodash/get";
import { getCommonApplyFooter, validateFields, getTextToLocalMapping,validateFieldsForGenPress } from "../../utils";
import "./index.css";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { httpRequest } from "../../../../../ui-utils";
import {
  createUpdateNocApplication,
  prepareDocumentsUploadData
,publishTenderNotice,updatePressNote,truncData} from "../../../../../ui-utils/commons";

import { prepareFinalObject,  handleScreenConfigurationFieldChange as handleField  } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTenantId, localStorageSet } from "egov-ui-kit/utils/localStorageUtils";
import {  localStorageGet} from "egov-ui-kit/utils/localStorageUtils";
import store from "../../../../../ui-redux/store";
import { getFileUrlFromAPI} from "egov-ui-framework/ui-utils/commons";
import jp from "jsonpath";

const state = store.getState();

// const truncData=(str, length, ending)=> {
//   if (length == null) {
//     length = 20;
//   }
//   if (ending == null) {
//     ending = '...';
//   }
//   if (str.length > length) {
//     return str.substring(0, length - ending.length) + ending;
//   } else {
//     return str;
//   }
// };
const toggleactionmenu = (state, dispatch) => {
	
  var x = document.getElementById("custom-atoms-tenderApplyfooter");
 	 // if (x.style.display === "none") {
   if(window.getComputedStyle(x).display === "none") {   
    x.style.display = "block";
    x.classList.add("addpadding");
	  } else {
    x.style.display = "none";
    x.classList.remove("addpadding");
	  }
}


const setReviewPageRoute = (state, dispatch) => {
	             let id=getQueryArg(window.location.href, "eventuuId")            

	if(id){
		  let tenantId = getTenantId()
  const appendUrl =
    process.env.REACT_APP_SELF_RUNNING === "true" ? "/egov-ui-framework" : "";
  const reviewUrl = `${appendUrl}/egov-pr/summary?eventuuId=${id}&tenantId=${tenantId}`;
  dispatch(setRoute(reviewUrl));
	}
	else{
	
	
  let tenantId = getTenantId()
  const eventId = get(
    state,
    "screenConfiguration.preparedFinalObject.EVENT.ResponseBody.eventId"
  );
 
  const eventuuId = get(
    state,
    "screenConfiguration.preparedFinalObject.EVENT.ResponseBody.eventDetailUuid"
  );
 
  const appendUrl =
    process.env.REACT_APP_SELF_RUNNING === "true" ? "/egov-ui-framework" : "";
  const reviewUrl = `${appendUrl}/egov-pr/summary?eventId=${eventId}&eventuuId=${eventuuId}&tenantId=${tenantId}`;
  dispatch(setRoute(reviewUrl));
	}
};


const callBackForSubmit = async (state, dispatch) => {
  // let validatestepformflag = validatestepform(3)
  let email=localStorageGet("email")
  let sms=get(state.screenConfiguration.preparedFinalObject, "tender.SMSContent")
  // validatestepformflag[0];

 let isFormValid =true
  isFormValid = validateFieldsForGenPress(
  "components.div.children.formwizardThirdStep.children.EmailSmsContent.children.cardContent.children",
  state,
  dispatch,
  "publishTender"
);
 if(isFormValid)
 {
  if(email!=="<p><br></p>" && (sms.length>0 && sms.length<=180))
  {
  if(get(state.screenConfiguration.preparedFinalObject, "tender.subjectemail") !==  undefined && get(state.screenConfiguration.preparedFinalObject, "tender.subjectemail") !==  "")
  {

    
    let reduxDocuments = get(state, "screenConfiguration.preparedFinalObject.TenderDocuments", {});
    let tender_documents = [];
  //let documentAttachment =get(state.screenConfiguration.preparedFinalObject, "documentsUploadRedux[0].documents[0].fileStoreId")
    jp.query(reduxDocuments, "$.*").forEach(doc => {
      if (doc.documents && doc.documents.length > 0) {
        if (doc.documentCode === "EVENT.EVENT_FILE_DOCUMENT") {
          ownerDocuments = [
            ...ownerDocuments,
            {
  
              fileStoreId: doc.documents[0].fileStoreId
            }
          ];
        } else if (!doc.documentSubCode) {
  
          otherDocuments = [
            ...otherDocuments,
            {
  
              fileStoreId: doc.documents[0].fileStoreId
            }
          ];
        }
      }
      else {
        let temp = { "fileStoreId": doc.fileStoreId, "fileName:": doc.fileName }
        tender_documents.push(temp)
      }
    });
  
  
  
  
  let pressdata= localStorageGet("PressTenderList") === null ? JSON.parse(localStorageGet("PressTenderListAll")) : JSON.parse(localStorageGet("PressTenderList"))
  let arr=[]
  
  for(let i=0;i<pressdata.length;i++)
  {
    let obj= {
      "pressMasterUuid":pressdata[i]['Press master UUID'],
    }
      arr.push(obj)
      }
  
      let payload={
      "RequestBody":{
       
         "tenantId": getTenantId(),
           "tenderNoticeId":getQueryArg(window.location.href, "tenderId"),
           "templateType":"TENDER_NOTICE",
           "smsContent":get(state.screenConfiguration.preparedFinalObject, "tender.SMSContent"),
           "emailContent":[
                 {
                  "emailSubject":get(state.screenConfiguration.preparedFinalObject, "tender.subjectemail"),
                  "emailBody":localStorageGet("email"),
                 }
            ],
        "publicationSize":get(state.screenConfiguration.preparedFinalObject, "tender.publicationsize"),
        "tenderNoticeUuid":getQueryArg(window.location.href, "tenderuuId"),
       "moduleCode":localStorageGet("modulecode"),
       "documentAttachment":tender_documents,
        "publicationList":arr,
        "tenderNoticeStatus":"PUBLISHED"
      }
      }
  
  publishTenderNotice(dispatch,payload);
  
  }
    else{
      dispatch(
        toggleSnackbar(
          true,
          { labelName: "Please fill subject field!", labelKey: "PR_SUBJECT_FIELD_MANDATORY" },
          "warning"
        )
      );
    }
  }
  else{
    dispatch(
      toggleSnackbar(
        true,
        { labelName: "Please fill all mandatory field!", labelKey: "PR_MANDATORY_FIELDS" },
        "warning"
      )
    );
  }
  }
  else{
    dispatch(
      toggleSnackbar(
        true,
        { labelName: "Please fill all mandatory field!", labelKey: "PR_MANDATORY_FIELDS" },
        "warning"
      )
    );
  }
  };
  


  const callBackForNext = async (state, dispatch) => {
    toggleactionmenu(state, dispatch)



    let activeStep = get(
      state.screenConfiguration.screenConfig["publishTender"],
      "components.div.children.stepper.props.activeStep",
      0
    );
   
    let errorMessage = '';
  
    let isFormValid = false;
     let hasFieldToaster = false;
  
   
    isFormValid = validateFields(
    "components.div.children.formwizardFirstStep.children.tenderDetails.children.cardContent.children.appStatusAndToFromDateContainer.children",
    state,
    dispatch,
    "publishTender"
  );
  if(localStorageGet("PressTenderList") === null && localStorageGet("PressTenderListAll")===null){
    hasFieldToaster = true;
  }
  else{
    hasFieldToaster = false;
  }
    if (activeStep === 0) {
      if(get(state.screenConfiguration.preparedFinalObject,"tender.SMSContent")===undefined)
      {
      dispatch(
        handleField(
        "publishTender",
        "components.div.children.formwizardThirdStep.children.EmailSmsContent.children.cardContent.children.SMSContent",
        "props.value",
        localStorageGet("smsTemplate")
        )
        );
      }
      let data1= localStorageGet("PressTenderList") === null ? JSON.parse(localStorageGet("PressTenderListAll")) : JSON.parse( localStorageGet("PressTenderList"))
      
      if( isFormValid === true && hasFieldToaster == false)
    {	


      let documentsPreview = [];
    //  localStorageSet('TenderDoc',get(state.screenConfiguration.preparedFinalObject, "documentsUploadRedux[0].documents"))
      let doc =get(state.screenConfiguration.preparedFinalObject, "documentsUploadRedux[0].documents")
      //?get(state.screenConfiguration.preparedFinalObject, "documentsUploadRedux[0].documents")
      //:  localStorageGet('TenderDoc')
     
      let doctitle = [];
if(doc)
{
      if( doc.length>0)
      {
        for(let i=0; i<doc.length; i++) {
      let eventDoc = doc[0]['fileStoreId']
          doctitle.push(doc[i]['fileName:']);
      
      if (eventDoc !== '' || eventDoc!==undefined) {
        documentsPreview.push({
          title: doc[i]['fileName:'],
          title: doc[i]['fileName:'],
          fileStoreId: eventDoc,
          linkText: "View"
        })
        let fileStoreIds = jp.query(documentsPreview, "$.*.fileStoreId");
        let fileUrls =
          fileStoreIds.length > 0 ? await getFileUrlFromAPI(fileStoreIds) : {};
      
        documentsPreview = documentsPreview.map(function (doc, index) {
      
      doc["link"] = fileUrls && fileUrls[doc.fileStoreId] && fileUrls[doc.fileStoreId].split(",")[0] || "";
        doc["name"] =
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
      }
      }
      }
    }
      
        dispatch(prepareFinalObject("documentsPreview", documentsPreview));
      
      
      


      let data1=localStorageGet("PressTenderList") === null ? JSON.parse(localStorageGet("PressTenderListAll")) : JSON.parse( localStorageGet("PressTenderList"))
      let data =data1.map(item => ({
  
        
        [getTextToLocalMapping("Publication Name")]:
        truncData(item['Publication Name']) || "-",
        [ getTextToLocalMapping("Type of the Press")]:
        item['Type of the Press'] || "-",
        [ getTextToLocalMapping("Personnel Name")]:
        truncData(item['Personnel Name'])|| "-",
        [ getTextToLocalMapping("Email Id")]:
        item['Email Id'] || "-",
        [getTextToLocalMapping("Mobile Number")]:
        item['Mobile Number'] || "-",
        [getTextToLocalMapping("Press master UUID")]:
        item['Press master UUID'] || "-",
      
        
       }));
  
       dispatch(
        handleField(
          "publishTender",
          "components.div.children.formwizardSecondStep.children.searchGridSecondstep",
          "props.data",
          data
        ));
    
     

    changeStep(state, dispatch, 'next', activeStep);
    }
    else
    {
  
  let errorMessage = 
  {   labelName: "Please select atleast one Press!",
labelKey: "PR_ERR_FILL_ALL_PUBLISHED_TENDER_MANDATORY_FIELDS_TOAST" }
  

dispatch(handleField(
      "publishTender",
      "components.div.children.formwizardFirstStep.children.PressMasterListForTender",
      "props.options.rowsSelected",
      []
    ))
  dispatch(toggleSnackbar(true, errorMessage, "warning"));
    }
   }
  
  
  
    if (activeStep !== 2) {
      
  
      if (isFormValid) {
        let responseStatus = "success";
        if (activeStep === 1) {
      
          
          
        } 
        
        if( isFormValid === true && hasFieldToaster == false)
        {	
      responseStatus === "success" && changeStep(state, dispatch);
        }
        else
        {
      //     dispatch(
      //       toggleSnackbar(
      //         true,
      //         {   labelName: "Please fill all mandatory fields and select atleast one Press!",
      // labelKey: "PR_ERR_FILL_ALL_PRESS_MANDATORY_FIELDS_TOAST" },
      //         "warning"
      //       )
      //     );
        }
      } else if (hasFieldToaster) {
       
  
  
  
  
       if(get(state.screenConfiguration.preparedFinalObject, "tender.publicationsize")==="")
       {
        hasFieldToaster=true;
       }
       else if(localStorageGet("PressTenderList") === null && localStorageGet("PressTenderListAll")===null){
        isFormValid = false;
          hasFieldToaster = true;
        }
     
      
       
      }
    }
  };
  


export const changeStep = (
  state,
  dispatch,
  mode = "next",
  defaultActiveStep = -1
) => {


  
  
  let activeStep = get(
    state.screenConfiguration.screenConfig["publishTender"],
    "components.div.children.stepper.props.activeStep",
    0
  );
 
  if (defaultActiveStep === -1) {
   
    activeStep = mode === "next" ? activeStep + 1 : activeStep - 1;
   
  } else {
    activeStep = defaultActiveStep;
  }
  
  if(get(state.screenConfiguration.preparedFinalObject,"tender.SMSContent")===undefined)
  {
  dispatch(
    handleField(
    "publishTender",
    "components.div.children.formwizardThirdStep.children.EmailSmsContent.children.cardContent.children.SMSContent",
    "props.value",
    localStorageGet("smsTemplate")
    )
    );
  }
  const isPreviousButtonVisible = activeStep > 0 ? true : false;

  const isNextButtonVisible = activeStep < 2 ? true : false;
  const isPayButtonVisible = activeStep === 2 ? true : false;
  const iscancleButtonVisible = activeStep === 2 ? true : false;
  const actionDefination = [
    {
      path: "components.div.children.stepper.props",
      property: "activeStep",
      value: activeStep
    },
    {
      path: "components.div.children.tenderApplyfooter.children.previousButton",
      property: "visible",
      value: isPreviousButtonVisible
    },
    {
      path: "components.div.children.tenderApplyfooter.children.nextButton",
      property: "visible",
      value: isNextButtonVisible
    },
    {
      path: "components.div.children.tenderApplyfooter.children.payButton",
      property: "visible",
      value: isPayButtonVisible
    },
    {
      path: "components.div.children.tenderApplyfooter.children.cancleButton",
      property: "visible",
      value: iscancleButtonVisible
    }
  ];
  dispatchMultipleFieldChangeAction("publishTender", actionDefination, dispatch);
  renderSteps(activeStep, dispatch);
};

export const renderSteps = (activeStep, dispatch) => {
  switch (activeStep) {
    case 0:
      dispatchMultipleFieldChangeAction(
        "publishTender",
        getActionDefinationForStepper(
          "components.div.children.formwizardFirstStep"
        ),
        dispatch
      );
      break;
    case 1:
      dispatchMultipleFieldChangeAction(
        "publishTender",
        getActionDefinationForStepper(
          "components.div.children.formwizardSecondStep"
        ),
        dispatch
      );
      break;
    case 2:
      dispatchMultipleFieldChangeAction(
        "publishTender",
        getActionDefinationForStepper(
          "components.div.children.formwizardThirdStep"
        ),
        dispatch
      );
      break;
    default:
      dispatchMultipleFieldChangeAction(
        "publishTender",
        getActionDefinationForStepper(
          "components.div.children.formwizardFourthStep"
        ),
        dispatch
      );
  }
};

export const getActionDefinationForStepper = path => {
  const actionDefination = [
    {
      path: "components.div.children.formwizardFirstStep",
      property: "visible",
      value: true
    },
    {
      path: "components.div.children.formwizardSecondStep",
      property: "visible",
      value: false
    },
    {
      path: "components.div.children.formwizardThirdStep",
      property: "visible",
      value: false
    },
    {
      path: "components.div.children.formwizardFourthStep",
      property: "visible",
      value: false
    }

  ];
  for (var i = 0; i < actionDefination.length; i++) {
    actionDefination[i] = {
      ...actionDefination[i],
      value: false
    };
    if (path === actionDefination[i].path) {
      actionDefination[i] = {
        ...actionDefination[i],
        value: true
      };
    }
  }
  return actionDefination;
};

export const callBackForPrevious = (state, dispatch) => {
  toggleactionmenu(state, dispatch)

  changeStep(state, dispatch, "previous");
};

export const redirectfunction = async (state, dispatch) => {
  const appendUrl =
  process.env.REACT_APP_SELF_RUNNING === "true" ? "/egov-ui-framework" : "";
  const reviewUrl = `${appendUrl}/egov-pr/TenderSearch`;
      dispatch(setRoute(reviewUrl));
}

export const tenderApplyfooter = getCommonApplyFooter({
  previousButton: {
    componentPath: "Button",
    props: {
      variant: "outlined",
      color: "primary",
      style: {
        height: "48px",
        marginRight: "16px",
        // width: "30%"
        minWidth: "220px",
        background:"#fff",
        border: "1px solid #ddd" ,
        color: "#000"
        
      }
    },
    gridDefination: {
      xs: 12,
      sm: 12,
      md: 12
    },
    children: {
     
      previousButtonLabel: getLabel({
        labelName: "Previous Step",
        labelKey: "PR_COMMON_BUTTON_PREV_STEP"
      })
    },
    onClickDefination: {
      action: "condition",
      callBack: callBackForPrevious
    },
    visible: false
  },
  nextButton: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        height: "48px",
        marginRight: "16px",
        // width: "30%"
        minWidth: "220px",
        background:"#fff",
        border: "1px solid #ddd" ,
        color: "#000"
        
      }
    },
    gridDefination: {
      xs: 12,
      sm: 12,
      md: 12
    },
    children: {
      nextButtonLabel: getLabel({
        labelName: "Next Step",
        labelKey: "PR_COMMON_BUTTON_NXT_STEP"
      })
     
    },
    onClickDefination: {
      action: "condition",
      callBack: callBackForNext
    }
  },
 
  payButton: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        height: "48px",
        marginRight: "16px",
        // width: "30%"
        minWidth: "220px",
        background:"#fff",
        border: "1px solid #ddd" ,
        color: "#000"
        
      }
    },
    gridDefination: {
      xs: 12,
      sm: 12,
      md: 12
    },
    children: {
      submitButtonLabel: getLabel({
        labelName: "Submit",
        labelKey: "PR_COMMON_BUTTON_PUBLISH"
      })
     
    },
    onClickDefination: {
      action: "condition",
      callBack: callBackForSubmit
    },
visible:false
  },
  cancleButton: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        height: "48px",
        marginRight: "16px",
        // width: "30%"
        minWidth: "220px",
        background:"#fff",
        border: "1px solid #ddd" ,
        color: "#000"
        
      }
    },
    gridDefination: {
      xs: 12,
      sm: 12,
      md: 12
    },
    children: {
      submitButtonLabel: getLabel({
        labelName: "Cancel",
        labelKey: "PR_COMMON_BUTTON_CANCLE"
      }),
     
    },
    onClickDefination: {
      action: "condition",
      callBack: redirectfunction
    },
    visible: false
  }
});




export const validatestepform = (activeStep, isFormValid, hasFieldToaster) => {
 
  let allAreFilled = true;
  if (activeStep == 0) {
 
    activeStep+=1;
    document.getElementById("apply_form" + activeStep).querySelectorAll("[required]").forEach(function (i) {
   
      if (!i.value) {
        i.focus();
        allAreFilled = false;
        i.parentNode.classList.add("MuiInput-error-853");
        i.parentNode.parentNode.classList.add("MuiFormLabel-error-844");
      }
      if (i.getAttribute("aria-invalid") === 'true' && allAreFilled) {
        i.parentNode.classList.add("MuiInput-error-853");
        i.parentNode.parentNode.classList.add("MuiFormLabel-error-844");
        allAreFilled = false;
        isFormValid = false;
        hasFieldToaster = true;
      }
    })


  } 
  if (allAreFilled == false) {
	
    isFormValid = false;
    hasFieldToaster = true;
  }
  else if(localStorageGet("PressTenderList") === null && localStorageGet("PressTenderListAll")===null){
	isFormValid = false;
    hasFieldToaster = true;
  }
  else {
    isFormValid = true;
    hasFieldToaster = false;
  }
  return [isFormValid, hasFieldToaster]
};

export const takeactionfooter = getCommonApplyFooter({
  actionbutton: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        height: "48px",
        marginRight: "16px" 
      }
    },
    children: {
       
      pressguestbuttonLabel: getLabel({
        labelName: "Take Action",
        labelKey: "PR_TAKE_ACTION"
      }),
	  nextButtonIcon: {
        uiFramework: "custom-atoms",
        componentPath: "Icon",
        props: {
          iconName: "keyboard_arrow_up"
        }
      },
    },
    onClickDefination: {
      action: "condition",
       callBack: (state, dispatch) =>{
           toggleactionmenu(state, dispatch)
    }
    },
    visible: true
  }
}); 