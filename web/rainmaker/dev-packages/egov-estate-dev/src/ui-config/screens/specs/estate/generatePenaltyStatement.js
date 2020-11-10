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
import {propertyInfo} from './preview-resource/preview-properties'
import { getTodaysDateInYMD } from "../utils";
import {penaltyDetailsTable} from "./searchResource/searchResults"

const header = getCommonHeader({
    labelName: "Penalty",
    labelKey: "ES_PENALTY_HEADER"
  });

const beforeInitFn = async (action, state, dispatch, fileNumber) => {
//   if(fileNumber){
//       let queryObject = [
//           { key: "fileNumber", value: fileNumber }
//         ];
//    const response =  await getSearchResults(queryObject);
//     if(!!response) {
//       let {estateDemands, estatePayments} = response.Properties[0].propertyDetails;
//       estateDemands = estateDemands || []
//       estatePayments = estatePayments || []
//       setXLSTableData({demands:estateDemands,payments:estatePayments, componentJsonPath: "components.div.children.paymentDetailsTable", screenKey: "payment-details"})
//     }
//   }
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

const propertyDetails = getCommonCard(propertyInfo(false))

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
            //   callBack: searchApiCallAccountStatement
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

const generatePenaltyStatement = {
  uiFramework: "material-ui",
  name: "generatePenaltyStatement",
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
          penaltyStatementFilter,
          breakAfterSearch: getBreak(),
          penaltyDetailsTable
      }
    }
  }
};

export default generatePenaltyStatement;