import {
    getCommonContainer,
    getCommonCard,
    getPattern,
    getDateField,
    getLabel,
    getCommonHeader
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { prepareFinalObject,handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getSearchResults  } from "../../../../ui-utils/commons";
import {onTabChange, tabs} from './addExtensionFee'
import { getBreak } from "egov-ui-framework/ui-config/screens/specs/utils";
import {propertyInfo,extensionFeeInfo} from './preview-resource/preview-properties'
import { getTodaysDateInYMD } from "../utils";
import {extensionFeeDetailsTable} from "./searchResource/searchResults"
import {generateExtensionStatementApiCall,extensionStatmentResult} from "./searchResource/functions"
const header = getCommonHeader({
    labelName: "Extension Fee",
    labelKey: "ES_EXTENSION_FEE_HEADER"
  });

const beforeInitFn = async (action, state, dispatch, fileNumber) => {

    const queryObject = [{
    key: "fileNumber",
    value: fileNumber
    }]
    const response = await getSearchResults(queryObject)
    if (!!response.Properties && !!response.Properties.length) {
    dispatch(prepareFinalObject("Properties", response.Properties))
    dispatch(prepareFinalObject("ExtensionFees", []))
    if(!!response) {
      let properties = response.Properties
      const propertyId = properties[0].id;   
      let Criteria = {
        fromDate: properties[0].propertyDetails.auditDetails.createdTime || "",
        toDate:   ""
      }
      Criteria = {...Criteria, propertyid: propertyId}
      await extensionStatmentResult (state,dispatch, Criteria)
    }

    }
}

export const propertyDetails = getCommonCard(propertyInfo(false))
export const extensionFeeSummary = getCommonCard(extensionFeeInfo(false))

export const extensionStatementFilter = getCommonCard({  
    dateContainer: getCommonContainer({
        from:getDateField({
          label: {
            labelName: "From",
            labelKey: "ES_FROM_DATE_LABEL"
        },
        placeholder: {
            labelName: "Enter From Date",
            labelKey: "ES_FROM_DATE_PLACEHOLDER"
        },
          pattern: getPattern("Date"),
          gridDefination:{
            xs: 12,
            sm: 6
          },
          required: false,
          jsonPath: "searchScreen.fromDate",
          props: {
              inputProps: {
                  max: getTodaysDateInYMD()
              }
          }
        }),
        to:getDateField({
          label: {
            labelName: "To",
            labelKey: "ES_TO_DATE_LABEL"
        },
        placeholder: {
            labelName: "Enter To Date",
            labelKey: "ES_TO_DATE_PLACEHOLDER"
        },
        pattern: getPattern("Date"),
        required: false,
        jsonPath: "searchScreen.toDate",
        props: {
            inputProps: {
                max: getTodaysDateInYMD()
            }
        }
        })
      }),
      button: getCommonContainer({
        buttonContainer: getCommonContainer({
          firstCont: {
            uiFramework: "custom-atoms",
            componentPath: "Div",
            gridDefination: {
              xs: 12,
              sm: 4
            }
          },
          filterButton: {
            componentPath: "Button",
            gridDefination: {
              xs: 12,
              sm: 4
            },
            props: {
              variant: "contained",
              style: {
                color: "white",
                backgroundColor: "#fe7a51",
                borderRadius: "2px",
                width: "80%",
                height: "48px",
                margin: "0px 0px 20px 0px"      
              }
            },
            children: {
              buttonLabel: getLabel({
                labelName: "Generate Statement",
                labelKey: "ES_GENERATE_EXTENSION_STATEMENT"
              })
            },
            onClickDefination: {
              action: "condition",
              callBack: generateExtensionStatementApiCall
            }
          }, lastCont: {
            uiFramework: "custom-atoms",
            componentPath: "Div",
            gridDefination: {
              xs: 12,
              sm: 4
            }
          }
        })
      })
  })

const extensionFeeContainer = {
  uiFramework: "material-ui",
  name: "generateExtensionStatement",
  beforeInitScreen: (action, state, dispatch) => {
    const fileNumber = getQueryArg(window.location.href, "fileNumber");
    beforeInitFn(action, state, dispatch, fileNumber);
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        className: "common-div-css search-preview"
      },
      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",
          children: {
            header: {
              gridDefination: {
                xs: 12,
                sm: 8
              },
              ...header
            },
            }
          },  
          tabSection: {
            uiFramework: "custom-containers-local",
            moduleName: "egov-estate",
            componentPath: "CustomTabContainer",
            props: {
              tabs,
              activeIndex: 1,
              onTabChange
            },
            type: "array",
          }, 
          propertyDetails,
          extensionFeeSummary,
          extensionStatementFilter,
          breakAfterSearch: getBreak(),
          extensionFeeDetailsTable
      }
    }
  }
};

export default extensionFeeContainer;