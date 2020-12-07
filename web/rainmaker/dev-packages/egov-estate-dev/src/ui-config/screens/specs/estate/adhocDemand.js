import {
    handleScreenConfigurationFieldChange as handleField,
    prepareFinalObject,
    toggleSnackbar
  } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import {
    getCommonHeader,
    getCommonCard,
    getCommonContainer,
    getTextField,
    getDateField,
    getPattern,
    getCommonTitle,
    getLabel
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  
  import {
    getSearchResults
  } from "../../../../ui-utils/commons";
  import {
    propertyInfo
  } from "./preview-resource/preview-properties";
  import {
    getQueryArg
  } from "egov-ui-framework/ui-utils/commons";
  import {addHocDemandUpdate} from '../../../../ui-utils/apply'
  import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
  import get from "lodash/get";
  import { validateFields,getTodaysDateInYMD } from "../utils";
  
  const header = getCommonHeader({
    labelName: "Adhoc Demand",
    labelKey: "ES_ADHOC_DEMAND_HEADER"
  });
  
  
  const beforeInitFn = async (action, state, dispatch) => {
    let fileNumber = getQueryArg(window.location.href, "fileNumber")
    const queryObject = [{
      key: "fileNumber",
      value: fileNumber
    }]
    const response = await getSearchResults(queryObject)
    if (!!response.Properties && !!response.Properties.length) {
      dispatch(prepareFinalObject("Properties", response.Properties))
    }
  }
  
  const adhocDetailsHeader = getCommonTitle({
    labelName: "Adhoc Demand Details",
    labelKey: "ES_ADHOC_DEMAND_DETAILS_HEADER"
  }, {
    style: {
      marginBottom: 18,
      marginTop: 18
    }
  })
  
  const RentField = {
    label: {
        labelName: "Rent",
        labelKey: "ES_RENT_LABEL"
    },
    placeholder: {
        labelName: "Enter Rent",
        labelKey: "ES_RENT_PLACEHOLDER"
    },
    gridDefination: {
        xs: 12,
        sm: 6
    },
    required: true,
    jsonPath: "adhocDetails.rent"
  }

  const gstField = {
    label: {
        labelName: "GST",
        labelKey: "ES_GST_LABEL"
    },
    placeholder: {
        labelName: "Enter Gst",
        labelKey: "ES_GST_PLACEHOLDER"
    },
    gridDefination: {
        xs: 12,
        sm: 6
    },
    required: true,
    jsonPath: "adhocDetails.gst"
  }

  const interestOnRentField = {
    label: {
        labelName: "Interest on Rent",
        labelKey: "ES_INTEREST_ON_RENT_LABEL"
    },
    placeholder: {
        labelName: "Enter Interest on Rent",
        labelKey: "ES_INTEREST_ON_RENT_PLACEHOLDER"
    },
    gridDefination: {
        xs: 12,
        sm: 6
    },
    required: true,
    jsonPath: "adhocDetails.penaltyInterest"
  }

  const intestOnGstField = {
    label: {
        labelName: "Interest On Gst",
        labelKey: "ES_INTEREST_ON_GST_LABEL"
    },
    placeholder: {
        labelName: "Enter Gst",
        labelKey: "ES_INTEREST_ON_GST_PLACEHOLDER"
    },
    gridDefination: {
        xs: 12,
        sm: 6
    },
    required: true,
    jsonPath: "adhocDetails.gstInterest"
  }

const dateOfAdjustmentEntryField = {
  label: {
    labelName: "Date of Adjustment entry",
    labelKey: "ES_ADJUSTMENT_ENTRY_DATE_LABEL"
  },
  placeholder: {
    labelName: "Select Date",
    labelKey: "ES_ADJUSTMENT_ENTRY_PLACEHOLDER"
  },
  required: true,
  pattern: getPattern("Date"),
  jsonPath: "adhocDetails.adjustmentDate",
  props: {
      inputProps: {
          max: getTodaysDateInYMD()
      }
  }
}

const commentsField = {
  label: {
      labelName: "Comments",
      labelKey: "ES_COMMENTS_LABEL"
  },
  placeholder: {
      labelName: "Enter Comments",
      labelKey: "ES_COMMENTS_PLACEHOLDER"
  },
  gridDefination: {
      xs: 12,
      sm: 6
  },
  jsonPath: "adhocDetails.comment"
}
    
  
  export const adhocDetails = getCommonCard({
    header: adhocDetailsHeader,
    detailsContainer: getCommonContainer({
      rent:getTextField(RentField),
      rentInterest: getTextField(interestOnRentField),
      gst:getTextField(gstField),
      gstInterest:getTextField(intestOnGstField) ,
      adjustmentEntryDate: getDateField(dateOfAdjustmentEntryField),
      comments : getTextField(commentsField)
    })
  })
    
  const detailsContainer = {
    uiFramework: "custom-atoms",
    componentPath: "Form",
    props: {
      id: "apply_form1"
    },
    children: {
        adhocDetails
    },
    visible: true
  }
  
  export const getCommonApplyFooter = children => {
    return {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        className: "apply-wizard-footer"
      },
      children
    };
  };
  
  const callBackForSubmit = (state, dispatch) => {
    let isValid = true;
    isValid = validateFields("components.div.children.detailsContainer.children.adhocDetails.children.cardContent.children.detailsContainer.children", state, dispatch, "adhocDemand")
    if(!isValid){
      let errorMessage = {
        labelName:
            "Please Enter Mandatory Fields",
        labelKey: "ES_ERR_MANDATORY_FIELDS"
    };
    dispatch(toggleSnackbar(true, errorMessage, "warning"));
    }
    if(!!isValid){
      addHocDemandUpdate(state,dispatch)
    }
   
  }
  
  const submitFooter = getCommonApplyFooter({
    submitButton: {
      componentPath: "Button",
      props: {
        variant: "contained",
        color: "primary",
        style: {
          minWidth: "180px",
          height: "48px",
          marginRight: "45px",
          borderRadius: "inherit"
        }
      },
      children: {
        submitButtonLabel: getLabel({
          labelName: "Submit",
          labelKey: "ES_COMMON_SUBMIT"
        })
      },
      onClickDefination: {
        action: "condition",
        callBack: (state, dispatch) => {
          callBackForSubmit(state, dispatch)
        },
      },
      visible: true
    }
  })
  
  const adHocDemand = {
    uiFramework: "material-ui",
    name: "adhocDemand",
    beforeInitScreen: (action, state, dispatch) => {
      dispatch(prepareFinalObject("adhocDetails",{}))
      beforeInitFn(action, state, dispatch);
      return action
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
          detailsContainer,
          footer: submitFooter
        }
      }
    }
  }
  
  export default adHocDemand;