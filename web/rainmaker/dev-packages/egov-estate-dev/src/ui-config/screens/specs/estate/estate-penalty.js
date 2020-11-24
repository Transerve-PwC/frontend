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
  getSelectField,
  getPattern,
  getCommonGrayCard,
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
import {addPenalty} from '../../../../ui-utils/apply'
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import get from "lodash/get";
import { validateFields } from "../utils";

const header = getCommonHeader({
  labelName: "Penalty",
  labelKey: "ES_PENALTY_HEADER"
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
    dispatch(prepareFinalObject("propertyPenalties", []))
  }
}

const penaltyDetailsHeader = getCommonTitle({
  labelName: "Penalty Details",
  labelKey: "ES_PENALTY_DETAILS_HEADER"
}, {
  style: {
    marginBottom: 18,
    marginTop: 18
  }
})

const getPenaltyTypeRadioButton = {
  uiFramework: "custom-containers",
  componentPath: "RadioGroupContainer",
  gridDefination: {
      xs: 12,
      sm: 6,
  },
  jsonPath: "propertyPenalties[0].violationType",
  props: {
      label: {
          name: "Penalty Type",
          key: "ES_PENALTY_TYPE_LABEL"
      },
      buttons: [{
          labelName: "Penalty for violation of T&C",
          labelKey: "ES_COMMON_PENALTY_FOR_VIOLATION_T&C",
          value: "violating T & C"
      },
      {
          label: "Penalty for Cheque bounce",
          labelKey: "ES_COMMON_PENALTY_FOR_CHEQUE_BOUNCE",
          value: "check bounse"
      }],
      errorMessage: "ES_ERR_PENALTY_TYPE_FIELD",
      jsonPath: "propertyPenalties[0].violationType",
      required: true,
  },
  required: true,
  type: "array"
};

const amountField = {
  label: {
      labelName: "Amount",
      labelKey: "ES_AMOUNT_LABEL"
  },
  placeholder: {
      labelName: "Enter Amount",
      labelKey: "ES_AMOUNT_PLACEHOLDER"
  },
  errorMessage: "ES_ERR_PENALTY_AMOUNT_FIELD",
  gridDefination: {
      xs: 12,
      sm: 6
  },
  pattern: getPattern("Amount"),
  required: true,
  jsonPath: "propertyPenalties[0].penaltyAmount"
}

export const penaltyDetails = getCommonCard({
  header: penaltyDetailsHeader,
  detailsContainer: getCommonContainer({
    penaltyType: getPenaltyTypeRadioButton,
    amount: getTextField(amountField)
  })
})

const propertyDetails = getCommonCard(propertyInfo(false))

const detailsContainer = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form1"
  },
  children: {
    propertyDetails,
    penaltyDetails
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
  isValid = validateFields("components.div.children.detailsContainer.children.penaltyDetails.children.cardContent.children.detailsContainer.children", state, dispatch, "estate-penalty")
  if(!isValid){
    let errorMessage = {
      labelName:
          "Please Enter Mandatory Fields",
      labelKey: "ES_ERR_MANDATORY_FIELDS"
  };
  dispatch(toggleSnackbar(true, errorMessage, "warning"));
  }
  if(!!isValid){
    addPenalty(state,dispatch)
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
        labelKey: "ES_COMMON_ADD_PENALTY"
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

export const onTabChange = async(tabIndex, dispatch, state) => {
  const fileNumber = getQueryArg(window.location.href, "fileNumber");
  const propertyId = getQueryArg(window.location.href, "propertyId")
  let path = "";
  if (tabIndex === 0) {
    path = `/estate/estate-penalty?propertyId=${propertyId}&fileNumber=${fileNumber}`;
  }
  else if (tabIndex === 1) {
    path = `/estate/generatePenaltyStatement?propertyId=${propertyId}&fileNumber=${fileNumber}`
  }
  dispatch(setRoute(path))
}

export const tabs = [
  {
    tabButton: { labelName: "Add Penalty", labelKey: "ES_PENALTY_HEADER" }
  },
  {
    tabButton: { labelName: "Penalty Statement", labelKey: "ES_PENALTY_STATEMENT" }
  }
]

const estatePenalty = {
  uiFramework: "material-ui",
  name: "estate-penalty",
  beforeInitScreen: (action, state, dispatch) => {
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
        tabSection: {
          uiFramework: "custom-containers-local",
          moduleName: "egov-estate",
          componentPath: "CustomTabContainer",
          props: {
            tabs,
            activeIndex: 0,
            onTabChange
          },
          type: "array",
        },
        detailsContainer,
        footer: submitFooter
      }
    }
  }
}

export default estatePenalty;