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
import { getSearchResults ,setXLSTableData } from "../../../../ui-utils/commons";
import {getReviewPayment} from './preview-resource/payment-details'
import {onTabChange, headerrow, tabs} from './estate-penalty'
import {paymentDetailsTable} from './applyResource/applyConfig'
import { getBreak } from "egov-ui-framework/ui-config/screens/specs/utils";
import {propertyInfo,securityInfo} from './preview-resource/preview-properties'
import { getTodaysDateInYMD } from "../utils";
import {penaltyDetailsTable} from "./searchResource/searchResults"
import {generatePenaltyStatementApiCall} from './searchResource/functions'
import {penaltyStatmentResult} from './searchResource/functions'
const header = getCommonHeader({
    labelName: "Security Fee",
    labelKey: "ES_SECURITY_FEE_HEADER"
  });

const beforeInitFn = async (action, state, dispatch, fileNumber) => {

    const queryObject = [{
    key: "fileNumber",
    value: fileNumber
    }]
    const response = await getSearchResults(queryObject)
    if (!!response.Properties && !!response.Properties.length) {
    dispatch(prepareFinalObject("Properties", response.Properties))
    dispatch(prepareFinalObject("propertyPenalties", []))
    if(!!response) {
      let properties = response.Properties
      const propertyId = properties[0].id;   
      let Criteria = {
        fromdate: properties[0].propertyDetails.auditDetails.createdTime || "",
        todate:   ""
      }
      Criteria = {...Criteria, propertyid: propertyId}
      await penaltyStatmentResult (state,dispatch, Criteria)
    }

    }
}

export const propertyDetails = getCommonCard(propertyInfo(false))
export const securitySummary = getCommonCard(securityInfo(false))

export const penaltyStatementFilter = getCommonCard({  
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
          required: true,
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
        required: true,
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
                labelName: "Generate Penalty Statement",
                labelKey: "ES_GENERATE_PENALTY_STATEMENT"
              })
            },
            onClickDefination: {
              action: "condition",
              callBack: generatePenaltyStatementApiCall
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

const securityFeeContainer = {
  uiFramework: "material-ui",
  name: "securityFee",
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
          propertyDetails,
          securitySummary,
        //   penaltyStatementFilter,
          breakAfterSearch: getBreak(),
          penaltyDetailsTable
      }
    }
  }
};

export default securityFeeContainer;