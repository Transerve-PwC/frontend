import { getCommonApplyFooter, validateFields } from "../utils";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import { applyOwnershipTransfer, getDetailsFromProperty } from "../../../../ui-utils/apply";
import { previousButton, submitButton, nextButton, changeStep, moveToSuccess, DETAILS_STEP, DOCUMENT_UPLOAD_STEP, SUMMARY_STEP } from "../rented-properties/applyResource/footer-duplicate-copy";
import { some } from "lodash";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";

const callBackForNext = async(state, dispatch) => {
    let activeStep = get(
        state.screenConfiguration.screenConfig["duplicate-copy-apply"],
        "components.div.children.stepper.props.activeStep",
        0
    );
    let isFormValid = true;
    let hasFieldToaster = true;
    if(activeStep === DETAILS_STEP) {
        const isTransitDetailsValid = validateFields(
          "components.div.children.formwizardFirstStep.children.transitSiteDetails.children.cardContent.children.detailsContainer.children",            
          state,
          dispatch,
          "duplicate-copy-apply"
        )
        const isApplicantDetailsValid = validateFields(
          "components.div.children.formwizardFirstStep.children.applicantDetails.children.cardContent.children.detailsContainer.children",            
          state,
          dispatch,
          "duplicate-copy-apply"
        )
        const isOwnershipAddressDetailsValid = validateFields(
          "components.div.children.formwizardFirstStep.children.ownershipAddressDetails.children.cardContent.children.detailsContainer.children",            
          state,
          dispatch,
          "duplicate-copy-apply"
        )
        if( !!isApplicantDetailsValid && !!isOwnershipAddressDetailsValid) {
          const propertyId = get(state.screenConfiguration.preparedFinalObject, "Owners[0].propertyId");
          const transitNumber = get(state.screenConfiguration.preparedFinalObject, "Properties[0].transitNumber")
          if(!propertyId) {
            const res = await getDetailsFromProperty(state, dispatch)
            if(!!res) {
              const applyRes = applyOwnershipTransfer(state, dispatch, activeStep)
              if(!applyRes) {
                return
              }
            } else {
              return
            }
          }
        } else {
            isFormValid = false;
        }
    }
    if(activeStep === DOCUMENT_UPLOAD_STEP) {
      const uploadedDocData = get(
        state.screenConfiguration.preparedFinalObject,
        "Properties[0].propertyDetails.applicationDocuments",
        []
    );

    const uploadedTempDocData = get(
        state.screenConfiguration.preparedFinalObject,
        "PropertiesTemp[0].applicationDocuments",
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
                      link: item.fileUrl && item.fileUrl.split(",")[0],
                      linkText: "View",
                      name: item.fileName
                  };
              });
              dispatch(
                prepareFinalObject("PropertiesTemp[0].reviewDocData", reviewDocData)
            );
    }
    }
    if(activeStep === SUMMARY_STEP) {
      const rentedData = get(
        state.screenConfiguration.preparedFinalObject,
        "Properties[0]"
    );
    // isFormValid = await applyOwnershipTransfer(state, dispatch);
      if (isFormValid) {
          moveToSuccess(rentedData, dispatch);
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