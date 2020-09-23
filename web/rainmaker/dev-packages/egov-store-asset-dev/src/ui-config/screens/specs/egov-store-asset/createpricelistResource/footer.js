import get from "lodash/get";
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
import {
  getButtonVisibility,
  getCommonApplyFooter,
  ifUserRoleExists,
  validateFields,
  epochToYmd,
  getLocalizationCodeValue
} from "../../utils";
import {ValidateCard} from '../../../../../ui-utils/storecommonsapi'
// import "./index.css";

const moveToReview = dispatch => {
  const reviewUrl =
    process.env.REACT_APP_SELF_RUNNING === "true"
      ? `/egov-ui-framework/egov-store-asset/reviewpricelist`
      : `/egov-store-asset/reviewpricelist`;
  dispatch(setRoute(reviewUrl));
};

export const callBackForNext = async (state, dispatch) => {
  let activeStep = get(
    state.screenConfiguration.screenConfig["createpricelist"],
    "components.div.children.stepper.props.activeStep",
    0
  );
  let isFormValid = true;
  if (activeStep === 0) {
    const isSupplierDetailsValid = validateFields(
      "components.div.children.formwizardFirstStep.children.SupplierDetails.children.cardContent.children.SupplierDetailsContainer.children",
      state,
      dispatch,
      "createpricelist"
    );
    
    if (!(isSupplierDetailsValid)) {
      isFormValid = false;
    }
   // prepareDocumentsUploadData(state, dispatch,"pricelist");
  }
  if (activeStep === 1) {
    let MaterialDetailsCardPath =
      "components.div.children.formwizardSecondStep.children.MaterialPriceDetails.children.cardContent.children.MaterialDetailsCard.props.items";
    let MasterDetailsItems = get(
      state.screenConfiguration.screenConfig.createpricelist,
      MaterialDetailsCardPath,
      []
    );
    let isMasterDetailsValid = true;
    for (var j = 0; j < MasterDetailsItems.length; j++) {
      if (
        (MasterDetailsItems[j].isDeleted === undefined ||
          MasterDetailsItems[j].isDeleted !== false) &&
        !validateFields(
          `${MaterialDetailsCardPath}[${j}].item${j}.children.cardContent.children.storeDetailsCardContainer.children`,
          state,
          dispatch,
          "createpricelist"
        )
      )
      isMasterDetailsValid = false;
    }
    if (!isMasterDetailsValid) {
      isFormValid = false
    }
    if(isFormValid)
    {

      // check validation for file uplaod
      if (get(state.screenConfiguration.preparedFinalObject, "documentsUploadRedux") !== undefined) {
        let fileUrl =
        get(state, "screenConfiguration.preparedFinalObject.documentsUploadRedux[0].documents[0].fileUrl",'') 
        let fileName =
        get(state, "screenConfiguration.preparedFinalObject.documentsUploadRedux[0].documents[0].fileName",'') 
    if(fileUrl) 
    {
  fileUrl = getFileUrl(fileUrl)
    }
  let  documentsPreview= [
    {
      title: "STORE_DOCUMENT_TYPE_RATE_CONTRACT_QUATION",
      linkText: "VIEW", 
      link:fileUrl,//"https://chstage.blob.core.windows.net/fileshare/ch/undefined/July/15/1594826295177document.pdf?sig=R3nzPxT9MRMfROREe6LHEwuGfeVxB%2FKneAeWrDJZvOs%3D&st=2020-07-15T15%3A21%3A01Z&se=2020-07-16T15%3A21%3A01Z&sv=2016-05-31&sp=r&sr=b",
      name: fileName, 
    },]
   
  dispatch(
    prepareFinalObject("documentsPreview", documentsPreview)
  );
  if(activeStep===1)
  {
  //validate duplicate card
  let cardJsonPath =
  "components.div.children.formwizardSecondStep.children.MaterialPriceDetails.children.cardContent.children.MaterialDetailsCard.props.items";
  let pagename = "createpricelist";
  let jasonpath =  "priceLists[0].priceListDetails";
  let value = "material.code";
  let DuplicatItem = ValidateCard(state,dispatch,cardJsonPath,pagename,jasonpath,value)
  if(DuplicatItem && DuplicatItem[0])
  {
    if(!DuplicatItem[0].IsDuplicatItem)
            {

              // refresh card item
              var storeMappingTemp = [];
          let  storeMapping =  get(
            state.screenConfiguration.preparedFinalObject,
            `priceLists[0].priceListDetails`,
            []
          );
          for(var i = 0; i < storeMapping.length; i++){
              if(storeMappingTemp.indexOf(storeMapping[i]) == -1){
                storeMappingTemp.push(storeMapping[i]);
              }
          }
          storeMappingTemp = storeMappingTemp.filter((item) => item.isDeleted === undefined || item.isDeleted !== false);
          if(storeMappingTemp.length>0)
          {
            dispatch(prepareFinalObject("priceLists[0].priceListDetails",storeMappingTemp)
          );
            }

            let id = get(
              state.screenConfiguration.preparedFinalObject,
              "priceLists[0].id",
              null
            );
            if(id)
            {
              moveToReview(dispatch);
           
            }
            else{
              const documents = get(state.screenConfiguration.preparedFinalObject, "documentsContract");
              const uploadedDocs = get(state.screenConfiguration.preparedFinalObject, "documentsUploadRedux");
              const isDocRequired =  documents.map(doc => {
                      return  doc.cards && doc.cards[0].required;
                  })
                  let docArray = new Array(isDocRequired.length)

                  if( uploadedDocs[0] && uploadedDocs[0].documents){
                   // isFormValid = true;
                    moveToReview(dispatch);
                  }
                  else
                  {
                    dispatch(
                      toggleSnackbar(
                        true,
                        { labelName: "Please uplaod mandatory documents!", labelKey: "" },
                        "warning"
                      ))
                  }
            }

    //  moveToReview(dispatch);
          }
          else{
            const LocalizationCodeValue = getLocalizationCodeValue("STORE_MATERIAL_DUPLICATE_VALIDATION")
            const errorMessage = {
              labelName: "Duplicate Material Added",
              //labelKey:   `STORE_MATERIAL_DUPLICATE_VALIDATION ${DuplicatItem[0].duplicates}`
              labelKey:   LocalizationCodeValue+' '+DuplicatItem[0].duplicates
            };
            dispatch(toggleSnackbar(true, errorMessage, "warning"));
          }
  }
  else{
    //
    let id = get(
      state.screenConfiguration.preparedFinalObject,
      "priceLists[0].id",
      null
    );
    if(id)
    {
      moveToReview(dispatch);
   
    }
    else{
      if (get(state.screenConfiguration.preparedFinalObject, "documentsUploadRedux") !== undefined) {
        moveToReview(dispatch);
      }
      else{
        dispatch(
          toggleSnackbar(
            true,
            { labelName: "Please uplaod mandatory documents!", labelKey: "" },
            "warning"
          ))

      }
     

    }
  }
}

      }
      else{

        let id = get(
          state.screenConfiguration.preparedFinalObject,
          "priceLists[0].id",
          null
        );
        if(id)
        {
          moveToReview(dispatch);
       
        }
        else{
          dispatch(
            toggleSnackbar(
              true,
              { labelName: "Please uplaod mandatory documents!", labelKey: "" },
              "warning"
            ))

        }
      }
    
  }
    else{

      const errorMessage = {
        labelName: "Please fill all fields",
        labelKey: "ERR_FILL_ALL_FIELDS"
      };
      dispatch(toggleSnackbar(true, errorMessage, "warning"));

    }
  }
  if (activeStep !== 1) {
    if (isFormValid) {
          // get date and validate     
    const CurrentDate = new Date();
    let agreementDate = get(
      state.screenConfiguration.preparedFinalObject,
      "priceLists[0].agreementDate",
      null
    );
    let rateContractDate = get(
      state.screenConfiguration.preparedFinalObject,
      "priceLists[0].rateContractDate",
      null
    );
    let agreementStartDate = get(
      state.screenConfiguration.preparedFinalObject,
      "priceLists[0].agreementStartDate",
      null
    );
    let agreementEndDate = get(
      state.screenConfiguration.preparedFinalObject,
      "priceLists[0].agreementEndDate",
      null
    );
    if(Number(agreementEndDate))
    {
      //alert('i am number')
      agreementEndDate = epochToYmd(agreementEndDate)
    }
    // else{
    //   agreementEndDate = convertDateToEpoch(agreementEndDate);
    // }
    if(Number(agreementDate))
    {
      //alert('i am number')
      agreementDate = epochToYmd(agreementDate)
    }
    // else{
    //   AgreementDate = convertDateToEpoch(AgreementDate);
    // }
    if(Number(agreementStartDate))
    {
      //alert('i am number')
      agreementStartDate = epochToYmd(agreementStartDate)
    }
    // else{
    //   agreementStartDate = convertDateToEpoch(agreementStartDate);
    // }
    if(Number(rateContractDate))
    {
      //alert('i am number')
      rateContractDate = epochToYmd(rateContractDate)
    }
    // else{
    //   rateContractDate = convertDateToEpoch(rateContractDate);
    // }
    const  rateContractDate_ = new Date(rateContractDate)
    const  AgreementDate_ = new Date(agreementDate)
    const  agreementStartDate_ = new Date(agreementStartDate)
    const  agreementEndDate_ = new Date(agreementEndDate)
    let IsValidDate = true
    let IsValidStartDate = true    
    if(rateContractDate_>CurrentDate || AgreementDate_> CurrentDate|| agreementStartDate_> CurrentDate)
    {
      IsValidDate = false
    }
    else{
      if(agreementStartDate_>agreementEndDate_)
      {
        IsValidStartDate = false
      }
     

    }
    if(IsValidDate)
    {
      if(IsValidStartDate)
      {
        if(AgreementDate_ >= agreementStartDate_ && AgreementDate_ <= agreementEndDate_ )
        {
          if(rateContractDate_<AgreementDate_)
          {
            changeStep(state, dispatch);
          }
          else{
            const errorMessage = {
              labelName: "Rate contract date should be less than Agreement date",
              labelKey: "STORE_MATERIAL_MASTER_RATE_CONTRACT_DATE_VALIDATION"
            };
            dispatch(toggleSnackbar(true, errorMessage, "warning"));
          }

        }
        else
        {
          const errorMessage = {
            labelName: "Agreement date should be in between Start date and End date",
            labelKey: "STORE_MATERIAL_MASTER_AGREMENT_DATE_VALIDATION"
          };
          dispatch(toggleSnackbar(true, errorMessage, "warning"));
        }
        
      }
     
      else
      {
        const errorMessage = {
          labelName: "Agreement start date Date is Less then End date",
          labelKey: "STORE_MATERIAL_MASTER_AGREMENT_STARTT_DATE_VALIDATION"
        };
        dispatch(toggleSnackbar(true, errorMessage, "warning"));
      }
    }
   
    else{
     // pop earnning Message
     const errorMessage = {
      labelName: "Input Date Must be less then or equal to current date",
      labelKey: "STORE_MATERIAL_MASTER_CURRENT_DATE_VALIDATION"
    };
    dispatch(toggleSnackbar(true, errorMessage, "warning"));

    }
    } else {
      const errorMessage = {
        labelName: "Please fill all fields",
        labelKey: "ERR_FILL_ALL_FIELDS"
      };
      dispatch(toggleSnackbar(true, errorMessage, "warning"));
    }
  }
};
export const getFileUrl = (linkText="") => {
  const linkList = linkText.split(",");
  let fileURL = '';
  linkList&&linkList.map(link => {
    if (!link.includes('large') && !link.includes('medium') && !link.includes('small')) {
      fileURL = link;
    }
  })
  return fileURL;
}
export const changeStep = (
  state,
  dispatch,
  mode = "next",
  defaultActiveStep = -1
) => {
  let activeStep = get(
    state.screenConfiguration.screenConfig["createpricelist"],
    "components.div.children.stepper.props.activeStep",
    0
  );
  if (defaultActiveStep === -1) {
    activeStep = mode === "next" ? activeStep + 1 : activeStep - 1;
  } else {
    activeStep = defaultActiveStep;
  }

  const isPreviousButtonVisible = activeStep > 0 ? true : false;
  const isNextButtonVisible = activeStep < 4 ? true : false;
  const isPayButtonVisible = activeStep === 4 ? true : false;
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
  dispatchMultipleFieldChangeAction("createpricelist", actionDefination, dispatch);
  renderSteps(activeStep, dispatch);
};

export const renderSteps = (activeStep, dispatch) => {
  switch (activeStep) {
    case 0:
      dispatchMultipleFieldChangeAction(
        "createpricelist",
        getActionDefinationForStepper(
          "components.div.children.formwizardFirstStep"
        ),
        dispatch
      );
      break;
    case 1:
      dispatchMultipleFieldChangeAction(
        "createpricelist",
        getActionDefinationForStepper(
          "components.div.children.formwizardSecondStep"
        ),
        dispatch
      );
      break;
    case 2:
      dispatchMultipleFieldChangeAction(
        "createpricelist",
        getActionDefinationForStepper(
          "components.div.children.formwizardThirdStep"
        ),
        dispatch
      );
      break;
   
    default:
      dispatchMultipleFieldChangeAction(
        "createpricelist",
        getActionDefinationForStepper(
          "components.div.children.formwizardFifthStep"
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
