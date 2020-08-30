import { getCommonApplyFooter, validateFields } from "../utils";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import { applyOwnershipTransfer, submittransitsiteimages ,getDetailsFromPropertyTransit ,getDetailsFromProperty ,applyDuplicateCopy, getDuplicateDetailsFromProperty} from "../../../../ui-utils/apply";
import { previousButton, submitButton, nextButton, changeStep, moveToSuccess, DETAILS_STEP, DOCUMENT_UPLOAD_STEP, SUMMARY_STEP, submitButtontransit ,payment } from "../rented-properties/applyResource/footer";
import { some } from "lodash";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { OWNERSHIPTRANSFERRP, TRANSITSITEIMAGES, DUPLICATECOPYOFALLOTMENTLETTERRP } from "../../../../ui-constants";
import { localStorageGet,getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { getOwnershipSearchResults, getDuplicateCopySearchResults } from "../../../../ui-utils/commons"
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";

const callBackForNext = async(state, dispatch) => {
    let activeStep = get(
        state.screenConfiguration.screenConfig["ownership-apply"],
        "components.div.children.stepper.props.activeStep",
        0
    );
    
    let isFormValid = true;
    let hasFieldToaster = true;
    if(activeStep === DETAILS_STEP) {
      const transitNumber = get(
        state.screenConfiguration.preparedFinalObject, 
        "Owners[0].property.transitNumber",
        "");
      const applicationNumber = get(
        state.screenConfiguration.preparedFinalObject,
        "Owners[0].ownerDetails.applicationNumber"
      )

      // the following block of code prevents a citizen from initiating a new application in case if another application with same transit number is in progress i.e. it is not rejected or approved
      if (!!transitNumber) {
        const queryObject = [
          {key: "transitNumber", value: transitNumber}
        ]

        const errorMessage = {
          labelName:
            "Unable to process your request, as another application with same transit number is already in progress",
          labelKey: "ERR_OT_ANOTHER_APPLICATION_ALREADY_IN_PROGRESS_ERR"
        };

        const applicationNo = getQueryArg(window.location.href, "applicationNumber") || applicationNumber
        let response = await getOwnershipSearchResults(queryObject);
        response = response.Owners;

        const draftedApplication = response.filter(item => item.applicationState == "OT_DRAFTED")

        // citizen should not be able to create a new application with same transit number when there is an application that is already present in drafted state.
        if (draftedApplication.length) {
          // check applicationNo to differentiate between new and drafted application
          if (!applicationNo) {
            return dispatch(toggleSnackbar(true, errorMessage, "error"));
          }
        }

        const filteredResponse = response.filter(item => (item.applicationState == "OT_PENDINGCLARIFICATION" || item.applicationState == "OT_PENDINGCLVERIFICATION" || item.applicationState == "OT_PENDINGJAVERIFICATION" || item.applicationState == "OT_PENDINGSAVERIFICATION" || item.applicationState == "OT_PENDINGSIVERIFICATION" || item.applicationState == "OT_PENDINGCAAPPROVAL" || item.applicationState == "OT_PENDINGAPRO" || item.applicationState == "OT_PENDINGSAAPPROVAL" || item.applicationState == "OT_PENDINGPAYMENT" || item.applicationState == "OT_PENDINGCLAPPROVAL" || item.applicationState == "OT_PENDINGSAREJECTION"))

        if (filteredResponse.length) {
          return dispatch(toggleSnackbar(true, errorMessage, "error"));
        }
      }

        const isOwnerDetailsValid = validateFields(
          "components.div.children.formwizardFirstStep.children.applicantDetails.children.cardContent.children.detailsContainer.children",            
          state,
          dispatch,
          "ownership-apply"
        )
        
        const isAddressDetailsValid = validateFields(
          "components.div.children.formwizardFirstStep.children.ownershipAddressDetails.children.cardContent.children.detailsContainer.children",            
          state,
          dispatch,
          "ownership-apply"
        )
        if(!!isOwnerDetailsValid && !!isAddressDetailsValid) {
          const propertyId = get(state.screenConfiguration.preparedFinalObject, "Owners[0].property.id");
          let res = true;
          if(!propertyId) {
            res = await getDetailsFromProperty(state, dispatch)
          }
          if(!!res) {
            const applyRes = await applyOwnershipTransfer(state, dispatch, activeStep)
            if(!applyRes) {
              return
            }
          } else {
            return
          }
        } else {
            isFormValid = false;
        }
    }
    if(activeStep === DOCUMENT_UPLOAD_STEP) {
      const uploadedDocData = get(
        state.screenConfiguration.preparedFinalObject,
        "Owners[0].ownerDetails.ownershipTransferDocuments",
        []
    );

    const uploadedTempDocData = get(
        state.screenConfiguration.preparedFinalObject,
        "OwnersTemp[0].ownershipTransferDocuments",
        []
    );

    for (var y = 0; y < uploadedTempDocData.length; y++) {
      if (
          uploadedTempDocData[y].required &&
          !some(uploadedDocData, { documentType: uploadedTempDocData[y].name })
      ) {
          isFormValid = false;
      }
    }
    if(isFormValid) {
      const reviewDocData =
              uploadedDocData &&
              uploadedDocData.map(item => {
                  return {
                      title: `RP_${item.documentType}`,
                      link: item.fileUrl && item.fileUrl.toString().split(",")[0],
                      linkText: "Download",
                      name: item.fileName
                  };
              });
              dispatch(
                prepareFinalObject("OwnersTemp[0].reviewDocData", reviewDocData)
            );
    }
    }
    if(activeStep === SUMMARY_STEP) {
    isFormValid = await applyOwnershipTransfer(state, dispatch);
      if (isFormValid) {
        const rentedData = get(
          state.screenConfiguration.preparedFinalObject,
          "Owners[0]"
      );
          moveToSuccess(rentedData, dispatch, OWNERSHIPTRANSFERRP);
      }
    }
    if(activeStep !== SUMMARY_STEP) {
        if (isFormValid) {
            changeStep(state, dispatch, "ownership-apply");
        } else if (hasFieldToaster) {
            let errorMessage = {
                labelName:
                    "Please fill all mandatory fields and upload the documents !",
                labelKey: "ERR_FILL_MANDATORY_FIELDS_UPLOAD_DOCS"
            };
            switch (activeStep) {
                case DETAILS_STEP:
                    errorMessage = {
                        labelName:
                            "Please fill all mandatory fields, then do next !",
                        labelKey: "ERR_FILL_RENTED_MANDATORY_FIELDS"
                    };
                    break;
                case DOCUMENT_UPLOAD_STEP:
                    errorMessage = {
                        labelName: "Please upload all the required documents !",
                        labelKey: "ERR_UPLOAD_REQUIRED_DOCUMENTS"
                    };
                    break;
            }
            dispatch(toggleSnackbar(true, errorMessage, "warning"));
        }
    }
}


const callBackForNextTransitImages = async(state, dispatch) => {
        let imageupload=true
        let uploadFlag = false;
        let activeStep = 1;
        let isFormValid = true;
        let hasFieldToaster = true;
      if(activeStep === 1){
      const isOwnerDetailsValid = validateFields(
        "components.div.children.formwizardFirstStep.children.transitSiteComments.children.cardContent.children.detailsContainer.children",   
                 
        state,
        dispatch,
        "transit-site-images"
      )
      
      const isDetailsValid = validateFields(
        "components.div.children.formwizardFirstStep.children.transitSitePropertyDetails.children.cardContent.children.detailsContainer.children",       
             
        state,
        dispatch,
        "transit-site-images"
      )
      const images=get(
        state, 'form.newapplication.files.media', []
      )
      console.log(images)
      if(images.length===0){
        imageupload=false
      }
      if(!!isOwnerDetailsValid  && !!isDetailsValid && !!imageupload) {
        const propertyId = get(state.screenConfiguration.preparedFinalObject, "PropertyImagesApplications[0].property.id");
        let res = true;
        if(!propertyId) {
          res = await getDetailsFromPropertyTransit(state, dispatch)
        }
        if(!!res) {
          const applytrans = await submittransitsiteimages(state, dispatch)
          if(!applytrans){
            return
          }
        } 
        else {
          return 
        }
      }
     else{
       isFormValid = false;
     } 
    } 
      if (isFormValid) {
        const transitData = get(
          state.screenConfiguration.preparedFinalObject,
          "PropertyImagesApplications[0]"
      );
      moveToSuccess(transitData, dispatch, TRANSITSITEIMAGES);
      }

     if (!isFormValid) {
        
        let errorMessage = {
          labelName:
              "Please fill all mandatory fields and upload at least one the images !",
          labelKey: "ERR_FILL_MANDATORY_FIELDS_AND_UPLOAD_IMG"
      };
      dispatch(toggleSnackbar(true, errorMessage, "warning"));
    } 
}

const callBackForNextDuplicate = async(state, dispatch) => {
    let activeStep = get(
        state.screenConfiguration.screenConfig["duplicate-copy-apply"],
        "components.div.children.stepper.props.activeStep",
        0
    );
    let isFormValid = true;
    let hasFieldToaster = true;
    if(activeStep === DETAILS_STEP) {
        const transitNumber = get(
          state.screenConfiguration.preparedFinalObject, 
          "DuplicateCopyApplications[0].property.transitNumber",
          "");
        const applicationNumber = get(
          state.screenConfiguration.preparedFinalObject,
          "DuplicateCopyApplications[0].applicationNumber"
        )

        // the following block of code prevents a citizen from initiating a new application in case if another application with same transit number is in progress i.e. it is not rejected or approved
        if (!!transitNumber) {
          const queryObject = [
            {key: "transitNumber", value: transitNumber}
          ]

          const errorMessage = {
            labelName:
              "Unable to process your request, as another application with same transit number is already in progress",
            labelKey: "ERR_DC_ANOTHER_APPLICATION_ALREADY_IN_PROGRESS_ERR"
          };

          const applicationNo = getQueryArg(window.location.href, "applicationNumber") || applicationNumber
          let response = await getDuplicateCopySearchResults(queryObject);
          response = response.DuplicateCopyApplications;

          const draftedApplication = response.filter(item => item.state == "DC_DRAFTED")

          // citizen should not be able to create a new application with same transit number when there is an application that is already present in drafted state.
          if (draftedApplication.length) {
            // check applicationNo to differentiate between new and drafted application
            if (!applicationNo) {
              return dispatch(toggleSnackbar(true, errorMessage, "error"));
            }
          }

          const filteredResponse = response.filter(item => (item.state == "DC_PENDINGCLARIFICATION" || item.state == "DC_PENDINGCLVERIFICATION" || item.state == "DC_PENDINGJAVERIFICATION" || item.state == "DC_PENDINGSAVERIFICATION" || item.state == "DC_PENDINGSIVERIFICATION" || item.state == "DC_PENDINGCAAPPROVAL" || item.state == "DC_PENDINGAPRO" || item.state == "DC_PENDINGSAAPPROVAL" || item.state == "DC_PENDINGPAYMENT" || item.state == "DC_PENDINGCLAPPROVAL" || item.state == "DC_PENDINGSAREJECTION"))

          if (filteredResponse.length) {
            return dispatch(toggleSnackbar(true, errorMessage, "error"));
          }
        }
        
        const isOwnerDetailsValid = validateFields(
          "components.div.children.formwizardFirstStep.children.rentHolderDetailsForDuplicateProperties.children.cardContent.children.detailsContainer.children",            
          state,
          dispatch,
          "duplicate-copy-apply"
        )
        const isAddressDetailsValid = validateFields(
          "components.div.children.formwizardFirstStep.children.transitSiteDetails.children.cardContent.children.detailsContainer.children",            
          state,
          dispatch,
          "duplicate-copy-apply"
        )
        if(!!isOwnerDetailsValid && !!isAddressDetailsValid) {
          const propertyId = get(state.screenConfiguration.preparedFinalObject, "DuplicateCopyApplications[0].property.id");
          let res = true;
          if(!propertyId) {
            res = await getDuplicateDetailsFromProperty(state, dispatch)
          }
          if(!!res) {
            const applyRes = await applyDuplicateCopy(state, dispatch, activeStep)
            if(!applyRes) {
              return
            }
          } else {
            return
          }
        } else {
            isFormValid = false;
        }
    }
    if(activeStep === DOCUMENT_UPLOAD_STEP) {
  
    const uploadedDocData = get(
        state.screenConfiguration.preparedFinalObject,
        "DuplicateCopyApplications[0].applicationDocuments",
        []
    );

    const uploadedTempDocData = get(
        state.screenConfiguration.preparedFinalObject,
        "DuplicateTemp[0].ownershipTransferDocuments",
        []
    );

    for (var y = 0; y < uploadedTempDocData.length; y++) {
      if (
          uploadedTempDocData[y].required &&
          !some(uploadedDocData, { documentType: uploadedTempDocData[y].name })
      ) {
          isFormValid = false;
      }
    }
    if(isFormValid) {
      const reviewDocData =
              uploadedDocData &&
              uploadedDocData.map(item => {
                  return {
                      title: `RP_${item.documentType}`,
                      link: item.fileUrl && item.fileUrl.toString().split(",")[0],
                      linkText: "Download",
                      name: item.fileName
                  };
              });
              dispatch(
                prepareFinalObject("DuplicateTemp[0].reviewDocData", reviewDocData)
            );
    }
    }
    if(activeStep === SUMMARY_STEP) {
      const rentedData = get(
        state.screenConfiguration.preparedFinalObject,
        "DuplicateCopyApplications[0]"
    );
    isFormValid = await applyDuplicateCopy(state, dispatch);
      if (isFormValid) {
          moveToSuccess(rentedData, dispatch, DUPLICATECOPYOFALLOTMENTLETTERRP);
      }
    }
    if(activeStep !== SUMMARY_STEP) {
        if (isFormValid) {
            changeStep(state, dispatch, "duplicate-copy-apply");
        } else if (hasFieldToaster) {
            let errorMessage = {
                labelName:
                    "Please fill all mandatory fields and upload the documents !",
                labelKey: "ERR_FILL_MANDATORY_FIELDS_UPLOAD_DOCS"
            };
            switch (activeStep) {
                case DETAILS_STEP:
                    errorMessage = {
                        labelName:
                            "Please fill all mandatory fields, then do next !",
                        labelKey: "ERR_FILL_RENTED_MANDATORY_FIELDS"
                    };
                    break;
                case DOCUMENT_UPLOAD_STEP:
                    errorMessage = {
                        labelName: "Please upload all the required documents !",
                        labelKey: "ERR_UPLOAD_REQUIRED_DOCUMENTS"
                    };
                    break;
            }
            dispatch(toggleSnackbar(true, errorMessage, "warning"));
        }
    }
}

const callBackForPrevious = (state, dispatch) => {
  changeStep(state, dispatch, "ownership-apply", "previous");
};


export const footer = getCommonApplyFooter({
    previousButton: {
      ...previousButton,
      onClickDefination: {
        action: "condition",
        callBack: callBackForPrevious
      },
    },
    nextButton: {
      ...nextButton,
      onClickDefination: {
        action: "condition",
        callBack: callBackForNext
      }
    },
    submitButton: {
      ...submitButton,
      onClickDefination: {
        action: "condition",
        callBack: callBackForNext
      },
    }
  });

const callBackForPreviousDuplicate = (state, dispatch) => {
  changeStep(state, dispatch, "duplicate-copy-apply", "previous");
};

  
export const duplicatefooter = getCommonApplyFooter({
    previousButton: {
      ...previousButton,
      onClickDefination: {
        action: "condition",
        callBack: callBackForPreviousDuplicate
      },
    },
    nextButton: {
      ...nextButton,
      onClickDefination: {
        action: "condition",
        callBack: callBackForNextDuplicate
      }
    },
    submitButton: {
      ...submitButton,
      onClickDefination: {
        action: "condition",
        callBack: callBackForNextDuplicate
      },
    }
  });

  export const transitsiteimagefooter = getCommonApplyFooter({
    
    submitButton: {
      ...submitButtontransit,
      onClickDefination: {
        action: "condition",
        callBack: callBackForNextTransitImages
      },
    }
  });

export const accountGenerationFooter = getCommonApplyFooter({ 
  submitButton: {
    ...payment,
    onClickDefination: {
      action: "condition",
      callBack: (state, dispatch) => {
        dispatch(setRoute(`/rented-properties-citizen/PaymentRedirectPage?tenantId=${getTenantId()}`));
      }
    },
  }
});
