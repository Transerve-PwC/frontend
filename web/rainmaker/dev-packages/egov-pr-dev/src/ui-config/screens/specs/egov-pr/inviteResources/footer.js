import {
  dispatchMultipleFieldChangeAction,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import get from "lodash/get";
import { getCommonApplyFooter, validateFields, showHideAdhocPopupopmsReject } from "../../utils";
import "./index.css";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { httpRequest } from "../../../../../ui-utils";
import {
  createUpdateNocApplication,
  prepareDocumentsUploadData
} from "../../../../../ui-utils/commons";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { invitationtoguests } from "../../../../../ui-utils/commons.js"
import {localStorageGet, localStorageSet, lSRemoveItemlocal, lSRemoveItem} from "egov-ui-kit/utils/localStorageUtils";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import commonConfig from '../../../../../config/common';
import jp from "jsonpath";
import { getFileUrlFromAPI  } from "egov-ui-framework/ui-utils/commons";

import { watch } from "fs";
let activeStepforbtn = 0;


// toggleactionmenu
const toggleactionmenu = (state, dispatch) => {
	
  var x = document.getElementById("custom-atoms-Invitefooter");
 	 // if (x.style.display === "none") {
   if(window.getComputedStyle(x).display === "none") {   
    x.style.display = "block";
    x.classList.add("addpadding");
	  } else {
    x.style.display = "none";
    x.classList.remove("addpadding");
	  }
}


const invitationtoguest= (state, dispatch) => {
  
  let subject=get(state.screenConfiguration.preparedFinalObject, "CreateInvite.subjectemail")
let sms=get(state.screenConfiguration.preparedFinalObject, "CreateInvite.SMSContent")
let email=localStorage.getItem('email')
if(subject!=null)
{
  if((subject.length>0 && subject.length<=180) && (sms.length>0 && sms.length<=180)&& email!=="<p><br></p>")
  {
  invitationtoguests(state, dispatch)
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
}


const setReviewPageRoute = (state, dispatch) => {
  let tenantId = get(
    state,
    "screenConfiguration.preparedFinalObject.PublicRelations[0].PublicRelationDetails.propertyDetails.address.city"
  );
  const applicationNumber = get(
    state,
    "screenConfiguration.preparedFinalObject.PublicRelations[0].PublicRelationDetails.applicationNumber"
  );
  const appendUrl =
    process.env.REACT_APP_SELF_RUNNING === "true" ? "/egov-ui-framework" : "";
  const reviewUrl = `${appendUrl}/egov-pr/summary?applicationNumber=${applicationNumber}&tenantId=${tenantId}`;
  dispatch(setRoute(reviewUrl));
};






const moveTosummary = (state, dispatch) => {

	 const appendUrl =
    process.env.REACT_APP_SELF_RUNNING === "true" ? "/egov-ui-framework" : "";
  const reviewUrl = `${appendUrl}/egov-pr/InviteGuestListSummary`;
  dispatch(setRoute(reviewUrl));

}
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
  let tenantId =  commonConfig.tenantId;
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: tenantId,
      moduleDetails: [
        { moduleName: "PublicRelation", masterDetails: [{ name: "Documents" }] }
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
        "applyScreenMdmsData.PublicRelation.Documents",
        payload.MdmsRes.PublicRelation.Documents
      )
    );
    prepareDocumentsUploadData(state, dispatch);
  } catch (e) {
    console.log(e);
  }
};

const callBackForNext = async (state, dispatch) => {
 // toggleactionmenu(state, dispatch)
 let doc =localStorageGet("EmaildAttachment")
if(doc!=="null" )
{
  
  let documentsPreview = [];
      
      let fileStoreIds1 = JSON.parse(doc)
      if(fileStoreIds1[0].fileStoreId!=="")
      {
      documentsPreview.push({
      
      fileStoreId:fileStoreIds1[0].fileStoreId ,
      
      })
      
      let fileStoreIds = jp.query(documentsPreview, "$.*.fileStoreId");
      
      let fileUrls =
      fileStoreIds.length > 0 ? await getFileUrlFromAPI(fileStoreIds) : {};
       documentsPreview = documentsPreview.map(function (doc, index) {
      
    doc["fileUrl"] = fileUrls && fileUrls[doc.fileStoreId] && fileUrls[doc.fileStoreId].split(",")[0] || "";
 //   doc["fileUrl"] ='aaa';
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
    }
  }
  // if(get(state.screenConfiguration.preparedFinalObject, "CreateInvite.SMSContent")===undefined)
  // {
      if( localStorageGet("EmailTemplatesubject")!==null)
      {
      dispatch(
        handleField(
          "createInvite",
          "components.div.children.formwizardSecondStep.children.EmailSmsContent.children.cardContent.children.subjectemail",
          "props.value",
          localStorageGet("EmailTemplatesubject")
        )
      );
        }

  var x = document.getElementById("custom-atoms-Invitefooter");
  x.classList.remove("addpadding");

  let activeStep = get(
    state.screenConfiguration.screenConfig["createInvite"],
    "components.div.children.stepper.props.activeStep",
    0
  );
   activeStepforbtn = activeStep;
  
  let isFormValid = true;
  let hasFieldToaster = false;
  if(get(state.screenConfiguration.preparedFinalObject, "CreateInvite.SMSContent")===undefined)
  {
  dispatch(
    handleField(
      "createInvite",
      "components.div.children.formwizardSecondStep.children.EmailSmsContent.children.cardContent.children.SMSContent",
      "props.value",
      localStorageGet("smsTemplate")
    )
  );
    }
  if (activeStep === 1) {

   

    let isPropertyLocationCardValid = validateFields(
      "components.div.children.formwizardSecondStep.children.propertyLocationDetails.children.cardContent.children.propertyDetailsConatiner.children",
      state,
      dispatch
    );
    let isSinglePropertyCardValid = validateFields(
      "components.div.children.formwizardSecondStep.children.propertyDetails.children.cardContent.children.propertyDetailsConatiner.children.buildingDataCard.children.singleBuildingContainer.children.singleBuilding.children.cardContent.children.singleBuildingCard.children",
      state,
      dispatch
    );

    // Multiple buildings cards validations
    let multiplePropertyCardPath =
      "components.div.children.formwizardSecondStep.children.propertyDetails.children.cardContent.children.propertyDetailsConatiner.children.buildingDataCard.children.multipleBuildingContainer.children.multipleBuilding.props.items";
    let multiplePropertyCardItems = get(
      state.screenConfiguration.screenConfig.createInvite,
      multiplePropertyCardPath,
      []
    );
    let isMultiplePropertyCardValid = true;
    for (var j = 0; j < multiplePropertyCardItems.length; j++) {
      if (
        (multiplePropertyCardItems[j].isDeleted === undefined ||
          multiplePropertyCardItems[j].isDeleted !== false) &&
        !validateFields(
          `${multiplePropertyCardPath}[${j}].item${j}.children.cardContent.children.multipleBuildingCard.children`,
          state,
          dispatch,
          "createInvite"
        )
      )
        isMultiplePropertyCardValid = false;
    }

    let noOfBuildings = get(
      state,
      "screenConfiguration.preparedFinalObject.PublicRelations[0].PublicRelationDetails.noOfBuildings"
    );
    if (noOfBuildings === "SINGLE") {
      isMultiplePropertyCardValid = true;
    } else {
      isSinglePropertyCardValid = true;
    }

    if (
      !isSinglePropertyCardValid ||
      !isPropertyLocationCardValid ||
      !isMultiplePropertyCardValid
    ) {
      isFormValid = false;
      hasFieldToaster = true;
    }
  }

 
  if(activeStep === 0){
		 
	if(localStorageGet("InviteeCount") > 0)
	{
		changeStep(state, dispatch);
	}
	else
	{
		//alert("");
		 dispatch(
              toggleSnackbar(
                true,
                { labelName: "Select Invitees!", labelKey: "PR_SELECT_INVITEE" },
                "warning"
              )
            );
	}
  }
  
  if (activeStep === 2) {
  
    let isApplicantTypeCardValid = validateFields(
      "components.div.children.formwizardThirdStep.children.applicantDetails.children.cardContent.children.applicantTypeContainer.children.applicantTypeSelection.children",
      state,
      dispatch
    );
    let isSingleApplicantCardValid = validateFields(
      "components.div.children.formwizardThirdStep.children.applicantDetails.children.cardContent.children.applicantTypeContainer.children.singleApplicantContainer.children.individualApplicantInfo.children.cardContent.children.applicantCard.children",
      state,
      dispatch
    );
    let isInstitutionCardValid = validateFields(
      "components.div.children.formwizardThirdStep.children.applicantDetails.children.cardContent.children.applicantTypeContainer.children.institutionContainer.children.institutionInfo.children.cardContent.children.applicantCard.children",
      state,
      dispatch
    );

    // Multiple applicants cards validations
    let multipleApplicantCardPath =
      "components.div.children.formwizardThirdStep.children.applicantDetails.children.cardContent.children.applicantTypeContainer.children.multipleApplicantContainer.children.multipleApplicantInfo.props.items";
    // "components.div.children.formwizardThirdStep.children.applicantDetails.children.cardContent.children.applicantTypeContainer.children.multipleApplicantContainer.children.multipleApplicantInfo.props.items[0].item0.children.cardContent.children.applicantCard"
    let multipleApplicantCardItems = get(
      state.screenConfiguration.screenConfig.createInvite,
      multipleApplicantCardPath,
      []
    );
    let isMultipleApplicantCardValid = true;
    for (var j = 0; j < multipleApplicantCardItems.length; j++) {
      if (
        (multipleApplicantCardItems[j].isDeleted === undefined ||
          multipleApplicantCardItems[j].isDeleted !== false) &&
        !validateFields(
          `${multipleApplicantCardPath}[${j}].item${j}.children.cardContent.children.applicantCard.children`,
          state,
          dispatch,
          "createInvite"
        )
      )
        isMultipleApplicantCardValid = false;
    }

    let selectedApplicantType = get(
      state,
      "screenConfiguration.preparedFinalObject.PublicRelations[0].PublicRelationDetails.applicantDetails.ownerShipType",
      "SINGLE"
    );
    if (selectedApplicantType.includes("INSTITUTIONAL")) {
      isSingleApplicantCardValid = true;
      isMultipleApplicantCardValid = true;
    } else if (selectedApplicantType.includes("MULTIPLEOWNERS")) {
      isSingleApplicantCardValid = true;
      isInstitutionCardValid = true;
    } else {
      isMultipleApplicantCardValid = true;
      isInstitutionCardValid = true;
    }

    if (
      !isApplicantTypeCardValid ||
      !isSingleApplicantCardValid ||
      !isInstitutionCardValid ||
      !isMultipleApplicantCardValid
    ) {
      isFormValid = false;
      hasFieldToaster = true;
    }
  }

  if (activeStep === 1) {
  
    moveTosummary(state, dispatch);
  }
 
};

export const changeStep = (
  state,
  dispatch,
  mode = "next",
  defaultActiveStep = -1
) => {
  let activeStep = get(
    state.screenConfiguration.screenConfig["createInvite"],
    "components.div.children.stepper.props.activeStep",
    0
  );

  // if(mode === "previous"){
  //   window.location.reload()
  // }
  if (defaultActiveStep === -1) {
      activeStep = mode === "next" ? activeStep + 1 : activeStep - 1;
   
  } else {
    activeStep = defaultActiveStep;
  }

  const isPreviousButtonVisible = activeStep > 0 ? true : false;
  const isNextButtonVisible = activeStep < 2 ? true : false;
  const isPayButtonVisible = activeStep === 2 ? true : false;
  const isinviteVisible = activeStep === 0 ? true : false;
  const ispressinviteVisible = (activeStep === 0 &&  localStorageGet("modulecode") === "PR")? true : false;
  
  const sendinviteVisible = activeStep === 1 ? true : false;
  const isactionButtonVisible = activeStep === 1 ? false : true;
  const actionDefination = [
    {
      path: "components.div.children.stepper.props",
      property: "activeStep",
      value: activeStep
    },
    {
      path: "components.div.children.Invitefooter.children.previousButton",
      property: "visible",
      value: isPreviousButtonVisible
    },
    {
      path: "components.div.children.Invitefooter.children.nextButton",
      property: "visible",
      value: isNextButtonVisible
    },
    {
      path: "components.div.children.Invitefooter.children.payButton",
      property: "visible",
      value: isPayButtonVisible
    },
	{
      path: "components.div.children.Invitefooter.children.pressguestbutton",
      property: "visible",
      value: ispressinviteVisible
    },
	{
      path: "components.div.children.Invitefooter.children.internalguestbutton",
      property: "visible",
      value: isinviteVisible
    },
	{
      path: "components.div.children.Invitefooter.children.externalguestbutton",
      property: "visible",
      value: isinviteVisible 
    },
	{
      path: "components.div.children.Invitefooter.children.nextButton",
      property: "visible",
      value: isinviteVisible 
    },
	{
      path: "components.div.children.Invitefooter.children.InviteEmployeebtn",
      property: "visible",
      value: sendinviteVisible
    },

    {
      path: "components.div.children.takeactionfooter",
      property: "visible",
      value: isactionButtonVisible
    },

  ];
  dispatchMultipleFieldChangeAction("createInvite", actionDefination, dispatch);
  renderSteps(activeStep, dispatch);
};

export const renderSteps = (activeStep, dispatch) => {
  switch (activeStep) {
    case 0:
      dispatchMultipleFieldChangeAction(
        "createInvite",
        getActionDefinationForStepper(
          "components.div.children.formwizardFirstStep"
        ),
        dispatch
      );
      break;
    case 1:
      dispatchMultipleFieldChangeAction(
        "createInvite",
        getActionDefinationForStepper(
          "components.div.children.formwizardSecondStep"
        ),
        dispatch
      );
      break;
    case 2:
      dispatchMultipleFieldChangeAction(
        "createInvite",
        getActionDefinationForStepper(
          "components.div.children.formwizardThirdStep"
        ),
        dispatch
      );
      break;
    default:
      dispatchMultipleFieldChangeAction(
        "createInvite",
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
  var x = document.getElementById("custom-atoms-Invitefooter");
  x.classList.add("addpadding");
  changeStep(state, dispatch, "previous");
};


export const Invitefooter = getCommonApplyFooter({
  pressguestbutton: {
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
       
      pressguestbuttonLabel: getLabel({
        labelName: "ADD PRESS GUEST",
        labelKey: "PR_ADD_PRESS_GUEST_BUTTON"
      }),
	  nextButtonIcon: {
        uiFramework: "custom-atoms",
        componentPath: "Icon",
        props: {
          iconName: "keyboard_arrow_right"
        }
      },
    },
    onClickDefination: {
      action: "condition",
       callBack: (state, dispatch) =>{
        
            showHideAdhocPopupopmsReject(state, dispatch, "createInvite", "press")
    }
    },
    visible: localStorageGet("modulecode") === "PR" ? true : false
  },
    externalguestbutton: {
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
       
      externalguestbuttonLabel: getLabel({
        labelName: "ADD EXTERNAL GUEST",
        labelKey: "PR_ADD_EXTERNAL_GUEST_BUTTON"
      }),
	  nextButtonIcon: {
        uiFramework: "custom-atoms",
        componentPath: "Icon",
        props: {
          iconName: "keyboard_arrow_right"
        }
      }
    },
    onClickDefination: {
      action: "condition",
        callBack: (state, dispatch) =>{ 
          dispatch(prepareFinalObject("documentsUploadRedux", {}));

		       showHideAdhocPopupopmsReject(state, dispatch, "createInvite","external")
    }
    },
    visible: true
  },
  internalguestbutton: {
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
     
      internalguestbuttonLabel: getLabel({
        labelName: "ADD INTERNAL GUEST",
        labelKey: "PR_ADD_INTERNAL__BTN_"
      }),
	   nextButtonIcon: {
        uiFramework: "custom-atoms",
        componentPath: "Icon",
        props: {
          iconName: "keyboard_arrow_right"
        }
      }
    },
    onClickDefination: {
      action: "condition",
      callBack: (state, dispatch) =>{
            showHideAdhocPopupopmsReject(state, dispatch, "createInvite","internal")
    }
    },
    visible: true
  },
  previousButton: {
    componentPath: "Button",
    props: {
      variant: "outlined",
      color: "primary",
      style: {
        height: "48px",
        marginRight: "16px" ,

      }
    },
    children: {
      previousButtonIcon: {
        uiFramework: "custom-atoms",
        componentPath: "Icon",
        props: {
          iconName: "keyboard_arrow_left"
        }
      },
      previousButtonLabel: getLabel({
        labelName: "Previous Step",
        labelKey: "PR_COMMON_BTN_PREV_STEP"
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
        labelKey: "PR_COMMON_BTN_NXT_STEP"
      }),
      nextButtonIcon: {
        uiFramework: "custom-atoms",
        componentPath: "Icon",
        props: {
          iconName: "keyboard_arrow_right"
        }
      }
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
        marginRight: "45px",

      }
    },
   
    children: {
      submitButtonLabel: getLabel({
        labelName: "Submit",
        labelKey: "PR_COMMON_BTN_SUBMIT"
      }),
      submitButtonIcon: {
        uiFramework: "custom-atoms",
        componentPath: "Icon",
        props: {
          iconName: "keyboard_arrow_right"
        }
      }
    },
    onClickDefination: {
      action: "condition",
      callBack: callBackForNext
    },
    visible: false
  }, 
  InviteEmployeebtn: {
			componentPath: "Button",
			props: {
			  variant: "contained",
			  color: "primary",
			  style: {
			  height: "48px",
        marginRight: "45px",

			  }
      },
			children: {
       
			  nextButtonLabel: getLabel({
				labelName: "Send Invitation",
				labelKey: "PR_INVITATION_BUTTON"
			  }),
			  nextButtonIcon: {
				uiFramework: "custom-atoms",
				componentPath: "Icon",
				props: {
				  iconName: "keyboard_arrow_right"
				}
			  }
			},
			onClickDefination: {
			  action: "condition",
        //callBack: (state, dispatch) => {invitationtoguests(state, dispatch) }
        callBack: invitationtoguest

			},
			visible : false
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


