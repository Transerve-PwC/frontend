import {
  getCommonCard,
  getCommonTitle,
  getTextField,
  getSelectField,
  getCommonContainer,
  getCommonParagraph,
  getPattern,
  getDateField,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { searchApiCall } from "./functions";
import { setServiceType } from "../applyResource/tradeDetails";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";

export const tradeLicenseApplication = getCommonCard({
  subHeader: getCommonTitle({
    labelName: "Search Trade License Application",
    labelKey: "TL_HOME_SEARCH_RESULTS_HEADING"
  }),
  subParagraph: getCommonParagraph({
    labelName: "Provide at least one parameter to search for an application",
    labelKey: "TL_HOME_SEARCH_RESULTS_DESC"
  }),
  appTradeAndMobNumContainer: getCommonContainer({
    applicationNo: getTextField({
      label: {
        labelName: "Application No.",
        labelKey: "TL_HOME_SEARCH_RESULTS_APP_NO_LABEL"
      },
      placeholder: {
        labelName: "Enter Application No.",
        labelKey: "TL_HOME_SEARCH_RESULTS_APP_NO_PLACEHOLDER"
      },
      gridDefination: {
        xs: 12,
        sm: 4
      },
      required: false,
      pattern: /^[a-zA-Z0-9-]*$/i,
      errorMessage: "ERR_INVALID_APPLICATION_NO",
      jsonPath: "searchScreen.applicationNumber"
    }),

    tradeLicenseNo: getTextField({
      label: {
        labelName: "Trade License No.", labelKey: "TL_HOME_SEARCH_RESULTS_TL_NO_LABEL"
      },
      placeholder: {
        labelName: "Enter Trade License No.", labelKey: "TL_HOME_SEARCH_RESULTS_TL_NO_PLACEHOLDER"
      },
      gridDefination: {
        xs: 12,
        sm: 4
      },
      required: false,
      pattern: /^[a-zA-Z0-9-]*$/i,
      errorMessage: "ERR_INVALID_TRADE_LICENSE_NO",
      jsonPath: "searchScreen.licenseNumber"
    }),
    ownerMobNo: getTextField({
      label: {
        labelName: "Owner Mobile No.",
        labelKey: "TL_HOME_SEARCH_RESULTS_OWN_MOB_LABEL"
      },
      placeholder: {
        labelName: "Enter your mobile No.",
        labelKey: "TL_HOME_SEARCH_RESULTS_OWN_MOB_PLACEHOLDER"
      },
      gridDefination: {
        xs: 12,
        sm: 4
      },
      iconObj: {
        label: "+91 |",
        position: "start"
      },
      required: false,
      pattern: getPattern("MobileNo"),
      jsonPath: "searchScreen.mobileNumber",
      errorMessage: "ERR_INVALID_MOBILE_NUMBER"
    })
  }),
  applicationTypeAndToFromDateContainer: getCommonContainer({
    applicationType: 
      getSelectField({
        label: {
          labelName: "Application Type",
          labelKey: "TL_APPLICATION_TYPE_LABEL"
        },
        placeholder: {
          labelName: "Select Application Type",
          labelKey: "TL_APPLICATION_TYPE_PLACEHOLDER"
        },
        localePrefix: {
          moduleName: "TradeLicense",
          masterName: "ApplicationType"
        },
        jsonPath:
          "searchScreen.applicationType",
        data: [{
          code : "New"
        },
        {
          code : "Renew"
        }],
        // sourceJsonPath: "applyScreenMdmsData.searchScreen.applicationType",
        gridDefination: {
          xs: 12,
          sm: 4
        },
        props: {
          className: "applicant-details-error"
        }
      }),
    fromDate: getDateField({
      label: { labelName: "From Date", labelKey: "TL_COMMON_FROM_DATE_LABEL" },
      placeholder: {
        labelName: "Select From Date",labelKey: "TL_FROM_DATE_PLACEHOLDER"
      },
      jsonPath: "searchScreen.fromDate",
      gridDefination: {
        xs: 12,
        sm: 4
      },
      pattern: getPattern("Date"),
      errorMessage: "ERR_INVALID_DATE",
      required: false
    }),

    toDate: getDateField({
      label: { labelName: "To Date", labelKey: "TL_COMMON_TO_DATE_LABEL" },
      placeholder: {
        labelName: "Select to Date",
        labelKey: "TL_COMMON_TO_DATE_PLACEHOLDER"
      },
      jsonPath: "searchScreen.toDate",
      gridDefination: {
        xs: 12,
        sm: 4
      },
      pattern: getPattern("Date"),
      errorMessage: "ERR_INVALID_DATE",
      required: false
    })
  }),
  appStatusContainer: getCommonContainer({
    applicationNo: getSelectField({
      label: {
        labelName: "Application status",
        labelKey: "TL_HOME_SEARCH_RESULTS_APP_STATUS_LABEL"
      },
      placeholder: {
        labelName: "Select Application Status",
        labelKey: "TL_HOME_SEARCH_RESULTS_APP_STATUS_PLACEHOLDER"
      },
      required: false,
      localePrefix: {
        moduleName: "WF",
        masterName: "NEWTL"
      },
      jsonPath: "searchScreen.status",
      data:[
      ],
      // sourceJsonPath: "applyScreenMdmsData.searchScreen.status",
      gridDefination: {
        xs: 12,
        sm: 4
      }
    }),

    tradeType: {...getSelectField({
      label: {
        labelName: "License Type",
        labelKey: "TL_TABLE_TRADE_TYPE_LABEL"
    },
    placeholder: {
        labelName: "Select License Type",
        labelKey: "TL_TRADE_TYPE_PLACEHOLDER"
    },
    required: false,
    jsonPath: "searchScreen.licenseType",
    optionValue: "code",
    optionLabel: "label",
    sourceJsonPath: "applyScreenMdmsData.searchScreen.tradeType",
    gridDefination: {
        xs: 12,
        sm: 4
    }
    }),
    beforeFieldChange:(action, state, dispatch) => {
      setServiceType(action, state, dispatch, action.value, "search", "components.div.children.tradeLicenseApplication.children.cardContent.children.appStatusContainer.children.serviceType.props", "searchScreen.businessService")
    }
  },
    serviceType: getSelectField(
      {
        label: {
            labelName: "Service Type",
            labelKey: "TL_TABLE_SERVICE_TYPE_LABEL"
        },
        placeholder: {
            labelName: "Select Service Type",
            labelKey: "TL_SERVICE_TYPE_PLACEHOLDER"
        },
        required: false,
        jsonPath: "searchScreen.businessService",
        optionValue: "code",
        optionLabel: "label",
        data: [],
        gridDefination: {
            xs: 12,
            sm: 4 
        }
    })
  }),
  

  button: getCommonContainer({
    // firstCont: {

    buttonContainer: getCommonContainer({
      // firstCont: {
      //   uiFramework: "custom-atoms",
      //   componentPath: "Div",
      //   gridDefination: {
      //     xs: 12,
      //     sm: 4
      //   }
      // },
      resetButton: {
        componentPath: "Button",
        gridDefination: {
          xs: 6,
          sm: 6
        },
        props: {
          variant: "outlined",
          style: {
            color: "rgba(0, 0, 0, 0.6000000238418579)",
            borderColor: "rgba(0, 0, 0, 0.6000000238418579)",
            width: "70%",
            height: "48px",
            margin: "8px",
            float: "right"
          }
        },
        children: {
          buttonLabel: getLabel({
            labelName: "Reset",
            labelKey: "TL_HOME_SEARCH_RESULTS_BUTTON_RESET"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: resetFields
        }
      },
      searchButton: {
        componentPath: "Button",
        gridDefination: {
          xs: 6,
          sm: 6
        },
        props: {
          variant: "contained",
          style: {
            color: "white",
            margin: "8px",
            backgroundColor: "rgba(0, 0, 0, 0.6000000238418579)",
            borderRadius: "2px",
            width: "70%",
            height: "48px"
          }
        },
        children: {
          buttonLabel: getLabel({
            labelName: "Search",
            labelKey: "TL_HOME_SEARCH_RESULTS_BUTTON_SEARCH"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: searchApiCall
        }
      },
      // lastCont: {
      //   uiFramework: "custom-atoms",
      //   componentPath: "Div",
      //   gridDefination: {
      //     xs: 12,
      //     sm: 4
      //   }
      // }
    })
  })
});

function resetFields(state, dispatch) {
  dispatch(
    handleField(
      "search",
      "components.div.children.tradeLicenseApplication.children.cardContent.children.appStatusContainer.children.applicationNo",
      "props.value",
      ""
    )
  )
  dispatch(
    handleField(
      "search",
      "components.div.children.tradeLicenseApplication.children.cardContent.children.appStatusContainer.children.serviceType",
      "props.value",
      ""
    )
  )
  dispatch(
    handleField(
      "search",
      "components.div.children.tradeLicenseApplication.children.cardContent.children.appStatusContainer.children.tradeType",
      "props.value",
      ""
    )
  )

  dispatch(
    handleField(
      "search",
      "components.div.children.tradeLicenseApplication.children.cardContent.children.appTradeAndMobNumContainer.children.applicationNo",
      "props.value",
      ""
    )
  )
  dispatch(
    handleField(
      "search",
      "components.div.children.tradeLicenseApplication.children.cardContent.children.appTradeAndMobNumContainer.children.ownerMobNo",
      "props.value",
      ""
    )
  )
  dispatch(
    handleField(
      "search",
      "components.div.children.tradeLicenseApplication.children.cardContent.children.appTradeAndMobNumContainer.children.tradeLicenseNo",
      "props.value",
      ""
    )
  )

  dispatch(
    handleField(
      "search",
      "components.div.children.tradeLicenseApplication.children.cardContent.children.applicationTypeAndToFromDateContainer.children.applicationType",
      "props.value",
      ""
    )
  )
  dispatch(
    handleField(
      "search",
      "components.div.children.tradeLicenseApplication.children.cardContent.children.applicationTypeAndToFromDateContainer.children.fromDate",
      "props.value",
      ""
    )
  )
  dispatch(
    handleField(
      "search",
      "components.div.children.tradeLicenseApplication.children.cardContent.children.applicationTypeAndToFromDateContainer.children.toDate",
      "props.value",
      ""
    )
  )
}
