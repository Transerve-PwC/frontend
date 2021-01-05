import { getCommonApplyFooter, validateFields } from "../utils";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import { getDetailsFromPropertyMortgage,applyMortgage } from "../../../../ui-utils/apply";
import { previousButton, submitButton, nextButton, changeStep, moveToSuccess, DETAILS_STEP, DOCUMENT_UPLOAD_STEP, SUMMARY_STEP } from "../rented-properties/applyResource/footer";
import { some } from "lodash";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { PERMISSIONTOMORTGAGE } from "../../../../ui-constants";
import { handleScreenConfigurationFieldChange as handleField,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
const callBackForNextMortgage = async(state, dispatch) => {
  dispatch(handleField(
    "mortage-apply",
    "components.div.children.footer.children.nextButton",
    "props.disabled",
    true
  ))
  let activeStep = get(
      state.screenConfiguration.screenConfig["mortage-apply"],
      "components.div.children.stepper.props.activeStep",
      0
  );
  
  let isFormValid = true;
  let hasFieldToaster = true;
  if(activeStep === DETAILS_STEP) {
      const isOwnerDetailsValid = validateFields(
        "components.div.children.formwizardFirstStep.children.applicantDetailsMortgage.children.cardContent.children.detailsContainer.children",            
        state,
        dispatch,
        "mortage-apply"
      )
      
      const isAddressDetailsValid = validateFields(
        "components.div.children.formwizardFirstStep.children.ownershipAddressDetailsMortgage.children.cardContent.children.detailsContainer.children",            
        state,
        dispatch,
        "mortage-apply"
      )
      if(!!isOwnerDetailsValid && !!isAddressDetailsValid) {
        const propertyId = get(state.screenConfiguration.preparedFinalObject, "MortgageApplications[0].property.id");
        let res = true;
        if(!propertyId) {
          res = await getDetailsFromPropertyMortgage(state, dispatch)
        }
        if(!!res) {
          const applyRes = await applyMortgage(state, dispatch, activeStep)
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
      "MortgageApplications[0].applicationDocuments",
      []
  );

  const uploadedTempDocData = get(
      state.screenConfiguration.preparedFinalObject,
      "MortgageApplicationsTemp[0].applicationDocuments",
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
              prepareFinalObject("MortgageApplicationsTemp[0].reviewDocData", reviewDocData)
          );
          const Res = await applyMortgage(state, dispatch, activeStep)
  }
  }
  if(activeStep === SUMMARY_STEP) {
  isFormValid = await applyMortgage(state, dispatch,activeStep);
    if (isFormValid) {
      const rentedData = get(
        state.screenConfiguration.preparedFinalObject,
        "MortgageApplications[0]"
    );
        moveToSuccess(rentedData, dispatch, PERMISSIONTOMORTGAGE);
    }
  }
  if(activeStep !== SUMMARY_STEP) {
      if (isFormValid) {
          changeStep(state, dispatch, "mortage-apply");
      } else if (hasFieldToaster) {
          let errorMessage = {
              labelName:
                  "Please fill all mandatory fields and upload the documents !",
              labelKey: "RP_ERR_FILL_MANDATORY_FIELDS_UPLOAD_DOCS"
          };
          switch (activeStep) {
              case DETAILS_STEP:
                  errorMessage = {
                      labelName:
                          "Please fill all mandatory fields, then do next !",
                      labelKey: "RP_ERR_FILL_RENTED_MANDATORY_FIELDS"
                  };
                  break;
              case DOCUMENT_UPLOAD_STEP:
                  errorMessage = {
                      labelName: "Please upload all the required documents !",
                      labelKey: "RP_ERR_UPLOAD_REQUIRED_DOCUMENTS"
                  };
                  break;
          }
          dispatch(toggleSnackbar(true, errorMessage, "warning"));
          dispatch(handleField(
            "mortage-apply",
            "components.div.children.footer.children.nextButton",
            "props.disabled",
            false
          ))
      }
  }
}

export const callBackForPreviousMortgage = (state, dispatch) => {
  changeStep(state, dispatch, "mortage-apply", "previous");
};


export const mortgagefooter = getCommonApplyFooter({
  previousButton: {
    ...previousButton,
    onClickDefination: {
      action: "condition",
      callBack: callBackForPreviousMortgage
    },
  },
  nextButton: {
    ...nextButton,
    onClickDefination: {
      action: "condition",
      callBack: callBackForNextMortgage
    }
  },
  submitButton: {
    ...submitButton,
    onClickDefination: {
      action: "condition",
      callBack: callBackForNextMortgage
    },
  }
});