import {
  dispatchMultipleFieldChangeAction,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import get from "lodash/get";
import { getCommonApplyFooter, validateFields, validateFieldsForGenPress,getTextToLocalMapping } from "../../utils";
import "./index.css";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { httpRequest } from "../../../../../ui-utils";
import {
  createUpdateNocApplication,
  prepareDocumentsUploadData
,createPressNote,updatePressNote,truncData} from "../../../../../ui-utils/commons";

import { prepareFinalObject,  handleScreenConfigurationFieldChange as handleField  } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTenantId } from "../../../../../../../../packages/lib/egov-ui-kit/utils/localStorageUtils/index";
import { localStorageGet} from "egov-ui-kit/utils/localStorageUtils";
//import store from "../../../../../ui-redux/store";
import commonConfig from '../../../../../config/common';
import { getFileUrlFromAPI} from "egov-ui-framework/ui-utils/commons";
import jp from "jsonpath";
import store from "ui-redux/store";

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




// toggleactionmenu
const toggleactionmenu = (state, dispatch) => {
	
  var x = document.getElementById("custom-atoms-pressapplyfooter");
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
//  let validatestepformflag = validatestepform(3)
  let email=localStorageGet("email")
//alert(isFormValid)

let isFormValid = validateFieldsForGenPress(
  "components.div.children.formwizardThirdStep.children.EmailSmsContent.children.cardContent.children",
  state,
  dispatch,
  "generatepressNote"
);
isFormValid=true
  let sms=get(state.screenConfiguration.preparedFinalObject, "pressnote.SMSContent")
// let isFormValid = validatestepformflag[0];
  //hasFieldToaster = validatestepformflag[1];
  let reduxDocuments = get(state, "screenConfiguration.preparedFinalObject.PressNoteDocuments", {});
  let press_documents = [];
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
      press_documents.push(temp)
    }
  });




  if(isFormValid)
  {
if(email!=="<p><br></p>" && (sms.length>0 && sms.length<=180))
{
  let pressnoteuuId=getQueryArg(window.location.href, "pressnoteuuId");
  let pressdata=''
  
  if(pressnoteuuId){

  if( localStorageGet("PressNoteList")!== null){
		pressdata=JSON.parse(localStorageGet("PressNoteList"))
  }
  else{
	pressdata=JSON.parse(localStorageGet("PressNoteListAll"))
  
  }
 
  let arr=[]
  for(let i=0;i<pressdata.length;i++)
  {
  let obj= {
    "pressMasterUuid":pressdata[i]['Press master UUID'],  
  
  }
  arr.push(obj)
  }
  let pressnotedate=get(state.screenConfiguration.preparedFinalObject, "pressnote.date")
  pressnotedate=pressnotedate.split('-')

  let date= pressnotedate[2]+'/'+pressnotedate[1]+'/'+pressnotedate[0];
  let payload={
  "RequestBody":{

    "tenantId": getTenantId(),
    "pressNoteSubject":get(state.screenConfiguration.preparedFinalObject, "pressnote.pressSubject"),
    "pressNoteDate":date,
    "filenumber":get(state.screenConfiguration.preparedFinalObject, "pressnote.fileNumber"),
    // "noteContent":get(state.screenConfiguration.preparedFinalObject, "pressnote.pressnote"),
    "noteContent":localStorageGet("pressnote"),
    "smsContent":get(state.screenConfiguration.preparedFinalObject, "pressnote.SMSContent"),
    "emailContent":[ {
     "emailSubject":get(state.screenConfiguration.preparedFinalObject, "pressnote.subjectemail"),
     "emailBody":localStorageGet("email"),
        }],
    "moduleCode":localStorageGet("modulecode"),
    "templateType":"PRESS_RELEASE",
    "documentAttachment":press_documents,
    // [{"fileStoreId":get(state.screenConfiguration.preparedFinalObject, "documentsUploadRedux[0].documents[0].fileStoreId"),
    // }],
   "moduleCode": localStorageGet("modulecode"),
  "publicationList":arr,
  "pressNoteUuid":get(state.screenConfiguration.preparedFinalObject, "pressnote.pressnote"),
  }
  }

 updatePressNote(dispatch,payload);
 
  }
  
  
  
  
  else{
    
    if(get(state.screenConfiguration.preparedFinalObject, "pressnote.subjectemail") !==  undefined && get(state.screenConfiguration.preparedFinalObject, "pressnote.subjectemail") !==  "")
    {
  
  
  let pressdata='';
  if(localStorageGet("PressNoteList")!== null){
		pressdata=JSON.parse(localStorageGet("PressNoteList"))
  }
  else{
	pressdata=JSON.parse(localStorageGet("PressNoteListAll"))
  
  }
  let arr=[]
  for(let i=0;i<pressdata.length;i++)
  {
    let obj= {
      "pressMasterUuid":pressdata[i]['Press master UUID'],
      
      
      }
      arr.push(obj)
      }
      let pressnotedate=get(state.screenConfiguration.preparedFinalObject, "pressnote.date")
      pressnotedate=pressnotedate.split('-')

     let date= pressnotedate[2]+'/'+pressnotedate[1]+'/'+pressnotedate[0];
      let payload={
      "RequestBody":{
    
        "tenantId": getTenantId(),
        "pressNoteSubject":get(state.screenConfiguration.preparedFinalObject, "pressnote.pressSubject"),
        "pressNoteDate":date,
        "filenumber":get(state.screenConfiguration.preparedFinalObject, "pressnote.fileNumber"),
        //"noteContent":get(state.screenConfiguration.preparedFinalObject, "pressnote.pressnote"),
        "noteContent":localStorageGet("pressnote"),
        "smsContent":get(state.screenConfiguration.preparedFinalObject, "pressnote.SMSContent"),
        "emailContent":[ {
         "emailSubject":get(state.screenConfiguration.preparedFinalObject, "pressnote.subjectemail"),
         "emailBody":localStorageGet("email"),
            }],
        "moduleCode":localStorageGet("modulecode"),
        "templateType":"PRESS_RELEASE",
        "documentAttachment":press_documents,
        "noteDocument": [{"fileStoreId":get(state.screenConfiguration.preparedFinalObject, "Pressdoc"),
        "fileName:":get(state.screenConfiguration.preparedFinalObject, "PressdocName") }],
       "moduleCode": localStorageGet("modulecode"),
      "publicationList":arr
      }
      }
  createPressNote(dispatch,payload);
  
  }
  else{
    dispatch(
      toggleSnackbar(
        true,
        { labelName: "Please fill subject field!", labelKey: "PR_SUBJECT_FIELD_MANDATORY" },
        "warning"
      )
    );
  }}
}
else{
  dispatch(
    toggleSnackbar(
      true,
      { labelName: "Please fill all mandatory field!", labelKey: "PR_MANDATORY_FIELDS"

    },
      "warning"
    )
  );
}
}
else{
  dispatch(
    toggleSnackbar(
      true,
      { labelName: "Please fill all mandatory field!", labelKey: "PR_MANDATORY_FIELDS"

    },
      "warning"
    )
  );
}
  };
  
const moveToReview = (state, dispatch) => {
  
  const documentsFormat = Object.values(
    get(state.screenConfiguration.preparedFinalObject, "documentsUploadRedux")
  );

  let validateDocumentField = false;

  for (let i = 0; i < documentsFormat.length; i++) { 
    let isDocumentRequired = get(documentsFormat[i], "isDocumentRequired");
    let isDocumentTypeRequired = get(
      documentsFormat[i],
      "isDocumentTypeRequired"
    );

    let documents = get(documentsFormat[i], "documents");
    if (isDocumentRequired) {
      if (documents && documents.length > 0) {
        if (isDocumentTypeRequired) {
          if (get(documentsFormat[i], "dropdown.value")) {
            validateDocumentField = true;
          } else {
            dispatch(
              toggleSnackbar(
                true,
                { labelName: "Please select type of Document!", labelKey: "" },
                "warning"
              )
            );
            validateDocumentField = false;
            break;
          }
        } else {
          validateDocumentField = true;
        }
      } else {
        dispatch(
          toggleSnackbar(
            true,
            { labelName: "Please uplaod mandatory documents!", labelKey: "" },
            "warning"
          )
        );
        validateDocumentField = false;
        break;
      }
    } else {
      validateDocumentField = true;
    }
  }

  if (validateDocumentField) {
    setReviewPageRoute(state, dispatch);
  }
};

const getMdmsData = async (state, dispatch) => {
  
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: commonConfig.tenantId,
      moduleDetails: [
        {
          moduleName: "RAINMAKER-PR",

          masterDetails: [{ name: "eventType" }, { name: "eventStatus" },{ name: "eventDocuments" }, { name: "eventSector" }]
        },
      ]
    }
  };
  try {
    let payload = await httpRequest(
      "post",
      "/egov-mdms-service/v1/_search",
      "_search",
      [],
      mdmsBody
    );

    dispatch(
      prepareFinalObject(
        "applyScreenMdmsData.PR.Documents",
        payload.MdmsRes.PR.Documents
      )
    );
    prepareDocumentsUploadData(state, dispatch);
  } catch (e) {
    console.log(e);
  }
};

const callBackForNext = async (state, dispatch) => {
  toggleactionmenu(state, dispatch)
  let activeStep = get(
    state.screenConfiguration.screenConfig["generatepressNote"],
    "components.div.children.stepper.props.activeStep",
    0
  );
 
 
  let isFormValid = false;
  let hasFieldToaster = false;
  let isFirstCardValid = validateFields(
    "components.div.children.formwizardFirstStep.children.pressnotedetails.children.cardContent.children.appStatusAndToFromDateContainer.children",
    state,
    dispatch,
    "generatepressNote"
  );
  let isSecondCardValid = validateFields(
    "components.div.children.formwizardFirstStep.children.pressnotedata.children.cardContent.children.appStatusAndToFromDateContainer.children",
    state,
    dispatch,
    "generatepressNote"
  );
   isFormValid =isFirstCardValid & isSecondCardValid
  //  hasFieldToaster = validatestepformflag[1];
if(isFormValid===1)
{
  isFormValid=true
}
else if(isFormValid===0)
{
  isFormValid=false
}
if (activeStep === 2) {
  dispatch(prepareFinalObject("documentsUploadRedux[0]", {}));
  
}
  if (activeStep === 0) {
    if(get(state.screenConfiguration.preparedFinalObject, "pressnote.SMSContent")===undefined)
    {
		 dispatch(
       handleField(
         "generatepressNote",
         "components.div.children.formwizardThirdStep.children.EmailSmsContent.children.cardContent.children.SMSContent",
         "props.value",
         localStorageGet("smsTemplate")
       )
     );
    }
    if(localStorageGet("PressNoteList") === null && localStorageGet("PressNoteListAll")===null){
      isFormValid=false
      hasFieldToaster = true;
    }
    //let GenPressdoc =get(state.screenConfiguration.preparedFinalObject, "documentsUploadRedux[0].documents")
// if(GenPressdoc===undefined)
// {
//   isFormValid=false
//   hasFieldToaster = true;
// }
    
		let data1= localStorageGet("PressNoteList") === null ? JSON.parse( localStorageGet("PressNoteListAll")) : JSON.parse( localStorageGet("PressNoteList"))
		if(localStorageGet("PressNoteList")!=="[]")
    {
		if( isFormValid === true  && (localStorageGet("PressNoteList") !== null || localStorageGet("PressNoteListAll") !== null))
	{	
    
    let documentsPreview = [];
    
    let doc =get(state.screenConfiguration.preparedFinalObject, "documentsUploadRedux[0].documents")
  if(doc!==undefined)
 {

    let doctitle = [];
    if(doc.length>0)
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
    
    dispatch(prepareFinalObject("Pressdoc", doc[0]['fileStoreId']));
    dispatch(prepareFinalObject("PressdocName", doc[0]['fileName']));

    
      dispatch(prepareFinalObject("documentsPreview", documentsPreview));
      

    let data1='';
    if(localStorageGet("PressNoteList")!== null){
      data1=JSON.parse(localStorageGet("PressNoteList"))
    }
    else{
      data1=JSON.parse(localStorageGet("PressNoteListAll"))
    
    }
		let data =data1.map(item => ({

      
      [getTextToLocalMapping("Publication Name")]:
      truncData(item['Publication Name']) || "-",
      [ getTextToLocalMapping("Type of the Press")]:
      item['Type of the Press'] || "-",
      [ getTextToLocalMapping("Personnel Name")]:
      truncData(item['Personnel Name']) || "-",
      [ getTextToLocalMapping("Email Id")]:
      item['Email Id'] || "-",
      [getTextToLocalMapping("Mobile Number")]:
      item['Mobile Number'] || "-",
      [getTextToLocalMapping("Press master UUID")]:
      item['Press master UUID'] || "-",
    
      
     }));

     dispatch(
      handleField(
        "generatepressNote",
        "components.div.children.formwizardSecondStep.children.searchGridSecondstep",
        "props.data",
        data
      ));
	
  
  changeStep(state, dispatch, 'next', activeStep);
      }
      else{
        dispatch(
          toggleSnackbar(
            true,
            {   labelName: "Please fill all mandatory fields and select atleast one Press!",
    labelKey: "PR_ERR_FILL_ALL_PRESS_MANDATORY_FIELDS_TOAST" },
            "warning"
          )
        );
      }
	}
	else
	{
    dispatch(
      handleField(
        "generatepressNote",
        "components.div.children.formwizardFirstStep.children.searchResultsPressMasterList",
        "props.options.rowsSelected",
        []
      )
    );
		dispatch(
              toggleSnackbar(
                true,
                {   labelName: "Please fill all mandatory fields and select atleast one Press!",
        labelKey: "PR_ERR_FILL_ALL_PRESS_MANDATORY_FIELDS_TOAST" },
                "warning"
              )
            );
  }
}
else{

  dispatch(
    handleField(
      "generatepressNote",
      "components.div.children.formwizardFirstStep.children.searchResultsPressMasterList",
      "props.options.rowsSelected",
      []
    )
  );
  dispatch(
    toggleSnackbar(
      true,
      {   labelName: "Please fill all mandatory fields and select atleast one Press!",
labelKey: "PR_ERR_FILL_ALL_PRESS_MANDATORY_FIELDS_TOAST" },
      "warning"
    )
  );
}



 }


  if (activeStep !== 2) {
    if (get(state, "screenConfiguration.preparedFinalObject.documentsUploadRedux.0.documents.0.fileStoreId", "")=="") {
      hasFieldToaster=true;
      isFormValid=false;
      } 

    if (isFormValid ) {
      let responseStatus = "success";
      if (activeStep === 1) {
        prepareDocumentsUploadData(state, dispatch, 'create_pressnote');
        
        
      } 
      
      responseStatus === "success" && changeStep(state, dispatch);
    } else if (hasFieldToaster) {
      let errorMessage = {
        labelName: "Please fill all mandatory fields and select atleast one Press!",
        labelKey: "PR_ERR_FILL_ALL_PRESS_MANDATORY_FIELDS_TOAST"
      };
      switch (activeStep) {
        case 1:
          errorMessage = {
             labelName: "Please fill all mandatory fields and select atleast one Press!",
        labelKey: "PR_ERR_FILL_ALL_PRESS_MANDATORY_FIELDS_TOAST"
          };
          break;
        case 2:
          errorMessage = {
            labelName:
               "Please check the Missing/Invalid field, then proceed!",
            labelKey: "PR_ERR_FILL_ALL_MANDATORY_FIELDS_TOAST"
          };
          break;
      }
      dispatch(toggleSnackbar(true, errorMessage, "warning"));
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
    state.screenConfiguration.screenConfig["generatepressNote"],
    "components.div.children.stepper.props.activeStep",
    0
  );
 
  if (defaultActiveStep === -1) {
   
    activeStep = mode === "next" ? activeStep + 1 : activeStep - 1;
   
  } else {
    activeStep = defaultActiveStep;
  }

  const isPreviousButtonVisible = activeStep >0 ? true : false;

  const isNextButtonVisible = activeStep < 2 ? true : false;
  const isPayButtonVisible = activeStep === 2 ? true : false;
  const iscancleButtonVisible = activeStep === 2 ? true : false; 
 // const isactionButtonVisible = activeStep === 3 ? true : false;

  const actionDefination = [
    {
      path: "components.div.children.stepper.props",
      property: "activeStep",
      value: activeStep
    },
    {
      path: "components.div.children.pressapplyfooter.children.previousButton",
      property: "visible",
      value: isPreviousButtonVisible
    },
    {
      path: "components.div.children.pressapplyfooter.children.nextButton",
      property: "visible",
      value: isNextButtonVisible
    },
    {
      path: "components.div.children.pressapplyfooter.children.payButton",
      property: "visible",
      value: isPayButtonVisible
    },
    {
      path: "components.div.children.pressapplyfooter.children.cancleButton",
      property: "visible",
      value: iscancleButtonVisible
    }
    // {
      
    //   path: "components.div.children.takeactionfooter",
    //   property: "visible",
    //   value: false
    // },
  ];
  dispatchMultipleFieldChangeAction("generatepressNote", actionDefination, dispatch);
  renderSteps(activeStep, dispatch);
};

export const renderSteps = (activeStep, dispatch) => {
  switch (activeStep) {
    case 0:
      dispatchMultipleFieldChangeAction(
        "generatepressNote",
        getActionDefinationForStepper(
          "components.div.children.formwizardFirstStep"
        ),
        dispatch
      );
      break;
    case 1:
      dispatchMultipleFieldChangeAction(
        "generatepressNote",
        getActionDefinationForStepper(
          "components.div.children.formwizardSecondStep"
        ),
        dispatch
      );
      break;
    case 2:
      dispatchMultipleFieldChangeAction(
        "generatepressNote",
        getActionDefinationForStepper(
          "components.div.children.formwizardThirdStep"
        ),
        dispatch
      );
      break;
    default:
      dispatchMultipleFieldChangeAction(
        "generatepressNote",
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

export const redirectfunction = async (state, dispatch) => {
  const appendUrl =
  process.env.REACT_APP_SELF_RUNNING === "true" ? "/egov-ui-framework" : "";
  const reviewUrl = `${appendUrl}/egov-pr/pressnotesHome`;
      dispatch(setRoute(reviewUrl));
}

export const callBackForPrevious = (state, dispatch) => {
  toggleactionmenu(state, dispatch)
  
  let tempAll = JSON.parse(localStorageGet("PressNoteListAll"));
      
 

if(tempAll)
{

  let selIndex= JSON.parse(localStorageGet("PressNoteListAll"));

 let selIndex1=[]
      selIndex.map((item,index)=>{
      
         selIndex1.push(item['index'])	
      
       })
      
   
   dispatch(
    handleField(
      "generatepressNote",
      "components.div.children.formwizardFirstStep.children.searchResultsPressMasterList",
      "props.options.rowsSelected",
      selIndex1
    )
  );

    }
   
  changeStep(state, dispatch, "previous");
};

export const pressapplyfooter = getCommonApplyFooter({
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
  visible:false

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
      }),
     
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
        labelKey: "PR_COMMON_BUTTON_SUBMIT"
      }),
     
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
        labelName: "UPLOAD",
        labelKey: "PR_COMMON_BUTTON_CANCLE"
      }),
    
    },
    onClickDefination: {
      action: "condition",
      callBack: redirectfunction
    },
    visible: false
  },
});






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
