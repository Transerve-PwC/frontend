import get from "lodash/get";
import set from "lodash/set";
import {
  dispatchMultipleFieldChangeAction,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
    prepareDocumentsUploadData
} from "../../../../../ui-utils/commons";
import { convertDateToEpoch } from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { toggleSnackbar,prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getFileUrl } from "egov-ui-framework/ui-utils/commons";
import {
  getButtonVisibility,
  getCommonApplyFooter,
  ifUserRoleExists,
  validateFields,
  epochToYmd
} from "../../utils";
import {
  getLocaleLabels,
  getTransformedLocalStorgaeLabels,
} from "egov-ui-framework/ui-utils/commons";
// import "./index.css";

  const moveToReview = dispatch => {
    const reviewUrl =`/egov-nulm/review-suh`;
    dispatch(setRoute(reviewUrl));
  };



export const callBackForNext = async (state, dispatch) => {
  let activeStep = get(
    state.screenConfiguration.screenConfig["create-suh"],
    "components.div.children.stepper.props.activeStep",
    0
  );
  const {NulmSuhRequest} = state.screenConfiguration.preparedFinalObject;
  let isFormValid = true;
  let documentsPreview =[];
  let addressPicture =[];
  let programPicture =[];
  let documentAttachment =[];
  let facilityPicture =[];
  if (activeStep === 0) {
    const isSepDetailsValid = validateFields(
      "components.div.children.formwizardFirstStep.children.SuhDetails.children.cardContent.children.SuhDetailsContainer.children",
      state,
      dispatch,
      "create-suh"
    );
    
    if(NulmSuhRequest && ( !NulmSuhRequest.hasOwnProperty("ownership") || !NulmSuhRequest.hasOwnProperty("category"))){
      isFormValid = false;
    }
    if(NulmSuhRequest && ( !NulmSuhRequest.hasOwnProperty("weatherCondition") )){
      set( NulmSuhRequest, "weatherCondition", "No" );
    }
    if (!isSepDetailsValid) {
     isFormValid = false;
    }
  }

  if(activeStep === 1){
    let isFacilityValid = true;
    const facilityArray =  ["isBedding","isWashingOfLinen","isCleaningOfPremises","isRecreationfacilities","isDrinkingWater","isMeals","isLockerForInmates","isFireSafetyMeasure","isOfficeSetUp","isFirstAidKitAndTrainingToStaff", "isDisplayOfEmergencyNumbers","isToilet"]
    const facilityRemark = [ "beddingRemark", "washingOfLinenRemark", "cleaningOfPremiseRemark","recreationfacilitiesRemark","drinkingWaterRemark","mealsRemark","lockerForInmatetRemark","fireSafetyMeasureRemark","officeSetUpRemark", "firstAidKitAndTrainingToStaffRemark","displayOfEmergencyNumbersRemark","toiletRemark"];          
  
    facilityArray.forEach((value,index) => {
      if(NulmSuhRequest && NulmSuhRequest.suhFacilitiesDetails && NulmSuhRequest.suhFacilitiesDetails[0][value]==="Yes"  ){
        if( !NulmSuhRequest.suhFacilitiesDetails[0][facilityRemark[index]]){
          isFacilityValid = false;
        }    
      }else{
        set( NulmSuhRequest, `suhFacilitiesDetails[0]${value}`, "No" );
      }
    })

    if(!isFacilityValid){
      
      const errorMessage = {
        labelName: "Please fill remark for Fields with option as YES",
        labelKey: "NULM_SUH_FILL_REMARK_ERR"
      };
      dispatch(toggleSnackbar(true, errorMessage, "warning"));
      return;
    }
  }
  if(activeStep === 2){
    let isRecordValid = true;
   const recordArray = ["isAssetInventoryRegister","isAccountRegister", "isAttendanceRegisterOfStaff","isShelterManagementCommitteeRegister", "isPersonnelAndSalaryRegister", "isHousekeepingAndMaintenanceRegister","isComplaintAndSuggestionRegister", "isVisitorRegister","isProfileRegister"];
  const recordRemark = [ "assetInventoryRegisterRemark", "accountRegisterRemark",  "attendanceRegisterOfStaffRemark", "shelterManagementCommitteeRegisteRemark", "personnelAndSalaryRegisterRemark", "housekeepingAndMaintenanceRegisterRemark", "complaintAndSuggestionRegisterRemark","visitorRegisterRemark","profileRegisterRemark"];         
  recordArray.forEach((value,index) => {
      if(NulmSuhRequest && NulmSuhRequest.suhRecordMaintenance && NulmSuhRequest.suhRecordMaintenance[0][value]==="Yes"  ){
        if( !NulmSuhRequest.suhRecordMaintenance[0][recordRemark[index]]){
          isRecordValid = false;
        }    
      }else{
        set( NulmSuhRequest, `suhRecordMaintenance[0]${value}`, "No" );
      }
    })

    if(!isRecordValid){
      
      const errorMessage = {
        labelName: "Please fill remark for Fields with option as YES",
        labelKey: "NULM_SUH_FILL_REMARK_ERR"
      };
      dispatch(toggleSnackbar(true, errorMessage, "warning"));
      return;
    }
  }
  if(activeStep === 3){
    let isStaffValid = true;
    const staffArray = ["isManager","isSecurityStaff","isCleaner"];
    const staffRemark = ["managerRemark", "securityStaffRemark", "cleanerRemark"];
    staffArray.forEach((value,index) => {
      if(NulmSuhRequest && NulmSuhRequest.suhStaffMaintenance && NulmSuhRequest.suhStaffMaintenance[0][value]==="Yes"  ){
        if( !NulmSuhRequest.suhStaffMaintenance[0][staffRemark[index]]){
          isStaffValid = false;
        }    
      }else{
        set( NulmSuhRequest, `suhStaffMaintenance[0]${value}`, "No" );
      }
    })

    if(!isStaffValid){
      
      const errorMessage = {
        labelName: "Please fill remark for Fields with option as YES",
        labelKey: "NULM_SUH_FILL_REMARK_ERR"
      };
      dispatch(toggleSnackbar(true, errorMessage, "warning"));
      return;
    }
  }
  if(activeStep === 4){
    let isOtherValid = true;
    const otherDetailArray = ["isConstitutionOfShelterManagementCommittee", "isSocialAudit", "isLinkageToCentralGovtWelfareSchemes", "isLinkageToPublicHealthInitiatives", "isLinkageToOtherGovtSchemes", "isLinkageToLocalCommunity","isLinkageToSocialWorkersAndPhilanthropists","isUserCharges", "isIECAndPromotionalInitiatives", "isQuarterlyReporting","isVisits"];
    const otherDetailRemark =["constitutionOfShelterManagementCommitteeRemark","socialAuditRemark","linkageToCentralGovtWelfareSchemesRemark","linkageToPublicHealthInitiativesRemark", "linkageToOtherGovtSchemesRemark", "linkageToLocalCommunityRemark","linkageToSocialWorkersAndPhilanthropistsRemark","userChargesRemark","iecAndPromotionalInitiativesRemark","quarterlyReportingRemark","visitsRemark"];
    otherDetailArray.forEach((value,index) => {
      if(NulmSuhRequest && NulmSuhRequest[value]==="Yes"  ){
        if( !NulmSuhRequest[otherDetailRemark[index]]){
          isOtherValid = false;
        }    
      }else{
        set( NulmSuhRequest, `${value}`, "No" );
      }
    })

    if(!isOtherValid){
      
      const errorMessage = {
        labelName: "Please fill remark for Fields with option as YES",
        labelKey: "NULM_SUH_FILL_REMARK_ERR"
      };
      dispatch(toggleSnackbar(true, errorMessage, "warning"));
      return;
    }
  }
 if (activeStep === 5) {
    const localisationLabels = getTransformedLocalStorgaeLabels();
    const documents = get(state.screenConfiguration.preparedFinalObject, "documentsContract");
    const uploadedDocs = get(state.screenConfiguration.preparedFinalObject, "documentsUploadRedux");
    const isDocRequired =  documents.map(doc => {
            return  doc.cards && doc.cards[0].required;
        })

      let docArray = new Array(isDocRequired.length)
        
      uploadedDocs &&  Object.entries(uploadedDocs).forEach(ele => {         
        docArray[ele[0]] = ele[1];
        if(ele[1] &&  ele[1].documents && ele[1].documents.length>0){
          let obj = {
            title: documents[ele[0]].title,
            linkText: "VIEW", 
            link:  getFileUrl(ele[1].documents[0].fileUrl),  
            name:   ele[1].documents[0].fileName,    
          }
          let reqObj = {
            documentType :  getLocaleLabels(documents[ele[0]].code,documents[ele[0]].code,localisationLabels),  
            filestoreId:   ele[1].documents[0].fileStoreId,
          }
          if( documents[ele[0]].code === "AddressPicture1" ||documents[ele[0]].code === "AddressPicture2" ){
             addressPicture.push(reqObj);
          }
          else if( documents[ele[0]].code === "ProgramPicture1" ||documents[ele[0]].code === "ProgramPicture2" ){
            programPicture.push(reqObj);
         }
         else if(documents[ele[0]].code === "FacilityPicture1" ||documents[ele[0]].code === "FacilityPicture2" ){
          facilityPicture.push(reqObj);
          }
          else{
            documentAttachment.push(reqObj);
          }
        
          documentsPreview.push(obj)
        }
    
    })

        for(let i = 0 ; i < isDocRequired.length ; i++){
          if(isDocRequired[i]){
                  if( docArray[i] && docArray[i].documents){
                    isFormValid = true;
                  }     
                  else{
                    isFormValid = false;
                    break;
                  } 
          }
        }
    }
 

    if(activeStep == 5 && !isFormValid){
      dispatch(
        toggleSnackbar(
          true,
          { labelName: "Please upload mandatory documents!", labelKey: "" },
          "warning"
        ))
    }
  else if(activeStep != 1 && !isFormValid){
    const errorMessage = {
      labelName: "Please fill all fields",
      labelKey: "ERR_FILL_ALL_FIELDS"
    };
    dispatch(toggleSnackbar(true, errorMessage, "warning"));
  }
else if(activeStep == 5 && isFormValid){

  dispatch(prepareFinalObject("NulmSuhRequest.addressPicture", addressPicture));
  dispatch(prepareFinalObject("NulmSuhRequest.programPicture", programPicture));
  dispatch(prepareFinalObject("NulmSuhRequest.documentAttachment", documentAttachment));
  dispatch(prepareFinalObject("NulmSuhRequest.suhFacilitiesDetails[0].facilityPicture", facilityPicture));
  dispatch(prepareFinalObject("documentsPreview", documentsPreview));
  moveToReview(dispatch);
}
  else{
    changeStep(state, dispatch);
  }
};

export const changeStep = (
  state,
  dispatch,
  mode = "next",
  defaultActiveStep = -1
) => {
  let activeStep = get(
    state.screenConfiguration.screenConfig["create-suh"],
    "components.div.children.stepper.props.activeStep",
    0
  );
  if (defaultActiveStep === -1) {
    activeStep = mode === "next" ? activeStep + 1 : activeStep - 1;
  } else {
    activeStep = defaultActiveStep;
  }

  const isPreviousButtonVisible = activeStep > 0 ? true : false;
  const isNextButtonVisible = activeStep < 5 ? true : false;
  const isPayButtonVisible = activeStep === 5 ? true : false;
  const actionDefination = [
    {
      path: "components.div.children.stepper.props",
      property: "activeStep",
      value: activeStep
    },
    {
      path: "components.div.children.footer.children.previousButton",
      property: "visible",
      value: isPreviousButtonVisible
    },
    {
      path: "components.div.children.footer.children.nextButton",
      property: "visible",
      value: isNextButtonVisible
    },
    {
      path: "components.div.children.footer.children.payButton",
      property: "visible",
      value: isPayButtonVisible
    }
  ];
  dispatchMultipleFieldChangeAction("create-suh", actionDefination, dispatch);
  renderSteps(activeStep, dispatch);
};

export const renderSteps = (activeStep, dispatch) => {
  switch (activeStep) {
    case 0:
      dispatchMultipleFieldChangeAction(
        "create-suh",
        getActionDefinationForStepper(
          "components.div.children.formwizardFirstStep"
        ),
        dispatch
      );
      break;
    case 1:
      dispatchMultipleFieldChangeAction(
        "create-suh",
        getActionDefinationForStepper(
          "components.div.children.formwizardSecondStep"
        ),
        dispatch
      );
      break;
    case 2:
      dispatchMultipleFieldChangeAction(
        "create-suh",
        getActionDefinationForStepper(
          "components.div.children.formwizardThirdStep"
        ),
        dispatch
      );
      break;
      case 3:
        dispatchMultipleFieldChangeAction(
          "create-suh",
          getActionDefinationForStepper(
            "components.div.children.formwizardFourthStep"
          ),
          dispatch
        );
        break;
      case 4:
        dispatchMultipleFieldChangeAction(
          "create-suh",
          getActionDefinationForStepper(
            "components.div.children.formwizardFifthStep"
          ),
          dispatch
        );
        break;  
        case 5:
          dispatchMultipleFieldChangeAction(
            "create-suh",
            getActionDefinationForStepper(
              "components.div.children.formwizardsixthStep"
            ),
            dispatch
          );
          break; 
    default:
      dispatchMultipleFieldChangeAction(
        "create-suh",
        getActionDefinationForStepper(
          "components.div.children.formwizardsixthStep"
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
    },
    {
      path: "components.div.children.formwizardFifthStep",
      property: "visible",
      value: false
    },  
    {
      path: "components.div.children.formwizardsixthStep",
      property: "visible",
      value: false
    }, 
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
  changeStep(state, dispatch, "previous");
};

export const footer = getCommonApplyFooter({
  previousButton: {
    componentPath: "Button",
    props: {
      variant: "outlined",
      color: "primary",
      style: {
        minWidth: "200px",
        height: "48px",
        marginRight: "16px"
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
        labelKey: "STORE_COMMON_BUTTON_PREV_STEP"
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
        minWidth: "200px",
        height: "48px",
        marginRight: "45px"
      }
    },
    children: {
      nextButtonLabel: getLabel({
        labelName: "Next Step",
        labelKey: "STORE_COMMON_BUTTON_NXT_STEP"
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
        minWidth: "200px",
        height: "48px",
        marginRight: "45px"
      }
    },
    children: {
      submitButtonLabel: getLabel({
        labelName: "Submit",
        labelKey: "STORE_COMMON_BUTTON_SUBMIT"
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
  }
});
