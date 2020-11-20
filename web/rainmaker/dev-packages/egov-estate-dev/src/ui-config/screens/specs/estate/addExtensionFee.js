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

  const extensionFeeDetailsHeader = getCommonTitle({
    labelName: "Extension Details",
    labelKey: "ES_EXTENSION_DETAILS_HEADER"
  }, {
    style: {
      marginBottom: 18,
      marginTop: 18
    }
  })
  
  const amountField = {
    label: {
        labelName: "Amount",
        labelKey: "ES_AMOUNT_LABEL"
    },
    placeholder: {
        labelName: "Enter Amount",
        labelKey: "ES_AMOUNT_PLACEHOLDER"
    },
    gridDefination: {
        xs: 12,
        sm: 6
    },
    pattern: getPattern("Amount"),
    required: true,
    jsonPath: "propertyPenalties[0].penaltyAmount"
  }
  
  export const extensionFeeDetails = getCommonCard({
    header: extensionFeeDetailsHeader,
    detailsContainer: getCommonContainer({
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
      extensionFeeDetails
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
    addPenalty(state,dispatch)
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
  
  export const onTabChange = async(tabIndex, dispatch, state) => {
    const fileNumber = getQueryArg(window.location.href, "fileNumber");
    const propertyId = getQueryArg(window.location.href, "propertyId")
    let path = "";
    if (tabIndex === 0) {
      path = `/estate/addExtensionFee?propertyId=${propertyId}&fileNumber=${fileNumber}`;
    }
    else if (tabIndex === 1) {
      path = `/estate/generateExtensionStatement?propertyId=${propertyId}&fileNumber=${fileNumber}`
    }
    dispatch(setRoute(path))
  }
  
  export const tabs = [
    {
      tabButton: { labelName: "Add Extension Fee", labelKey: "ES_EXTENSION_FEE_HEADER" }
    },
    {
      tabButton: { labelName: "Extension Fee Statement", labelKey: "ES_EXTENSION_FEE_STATEMENT" }
    }
  ]
  
  const addExtensionFee = {
    uiFramework: "material-ui",
    name: "addExtensionFee",
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
                ...extensionFeeDetailsHeader
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
  
  export default addExtensionFee;