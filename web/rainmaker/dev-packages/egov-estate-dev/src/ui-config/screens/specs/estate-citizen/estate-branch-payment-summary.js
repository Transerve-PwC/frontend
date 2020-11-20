import {
    getCommonCard,getCommonGrayCard,getCommonTitle
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { prepareFinalObject,handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getSearchResults } from "../../../../ui-utils/commons";
import { getOwnerDetails,getAllotmentDetails } from "../estate/preview-resource/owner-properties";
import {onTabChange, headerrow, tabs} from './estate-branch-search-preview'
import {getMdmsData} from "../estate/estate-payment"
import { securityInfo ,penaltyInfo} from "../estate/preview-resource/preview-properties";
import {penaltyStatmentResult} from "../estate/searchResource/functions"
import {getRentSummaryCard} from "../utils"

const rentSummaryHeader = getCommonTitle({
    labelName: "Rent Summary",
    labelKey: "ES_RENT_SUMMARY_HEADER"
  }, {
    style: {
      marginBottom: 18,
      marginTop: 18
    }
  })

const rentSummary = getCommonGrayCard({
    rentSection: getRentSummaryCard({
      sourceJsonPath: "Properties[0].estateRentSummary",
      dataArray: ["balanceRent", "balanceGST", "balanceGSTPenalty", "balanceRentPenalty", "balanceAmount"]
    })
  });

const rentSummaryDetails = {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    children: {
    rentCard: getCommonCard({
      header: rentSummaryHeader,
      detailsContainer: rentSummary
    })
    }
  }

const penaltySummary = getCommonCard(penaltyInfo(false))
const securitySummary = getCommonCard(securityInfo(false))

const detailsContainer = {
    uiFramework: "custom-atoms",
    componentPath: "Form",
    props: {
      id: "apply_form1"
    },
    children: {
      rentSummaryDetails,
      penaltySummary,
      securitySummary
    },
    visible: true
  }

const beforeInitFn = async (action, state, dispatch, fileNumber) => {
    getMdmsData(dispatch);
    let propertyId = getQueryArg(window.location.href, "propertyId")
    const queryObject = [
      {key: "fileNumber", value: fileNumber}
    ]
    const response = await getSearchResults(queryObject)
    if(!!response.Properties && !!response.Properties.length) {
       dispatch(prepareFinalObject("Properties", response.Properties))
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


const EstateBranchPaymentSummary = {
  uiFramework: "material-ui",
  name: "estate-branch-payment-summary",
  beforeInitScreen: (action, state, dispatch) => {
    let fileNumber = getQueryArg(window.location.href, "fileNumber");
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
            header1: {
              gridDefination: {
                xs: 12,
                sm: 8
              },
             ...headerrow
            },
            }
          },
          tabSection: {
            uiFramework: "custom-containers-local",
            moduleName: "egov-estate",
            componentPath: "CustomTabContainer",
            props: {
              tabs,
              activeIndex: 2,
              onTabChange
            },
            type: "array",
          },
          detailsContainer
      }
    }
  }
};

export default EstateBranchPaymentSummary;