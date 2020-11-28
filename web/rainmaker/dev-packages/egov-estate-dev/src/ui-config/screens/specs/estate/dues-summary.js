import {
  getCommonCard, convertEpochToDate, getCommonTitle, getCommonGrayCard
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { prepareFinalObject, handleScreenConfigurationFieldChange as handleField, toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getSearchResults } from "../../../../ui-utils/commons";
import { onTabChange, headerrow, tabs, tabsAllotment } from './search-preview'
import { getBreak } from "egov-ui-framework/ui-config/screens/specs/utils";
import { getRentSummaryCard } from "../utils";
import { securityInfo, penaltyInfo } from "./preview-resource/preview-properties";
import { httpRequest } from "../../../../ui-utils/api"

let isPropertyMasterOrAllotmentOfSite;

const beforeInitFn = async (action, state, dispatch, fileNumber) => {
  if (fileNumber) {
    let queryObject = [{ key: "fileNumber", value: fileNumber }];
    const response = await getSearchResults(queryObject)

    if (!!response.Properties) {
      dispatch(prepareFinalObject("Properties", response.Properties))
      let properties = response.Properties
      const propertyId = properties[0].id;
      let Criteria = {
        fromdate: properties[0].propertyDetails.auditDetails.createdTime || "",
        todate: ""
      }
      Criteria = { ...Criteria, propertyid: propertyId }

      try {
        const responsePenalty = await httpRequest(
          "post",
          '/est-services/violation/_penalty_statement',
          "",
          [],
          { Criteria }
        )

        const responseSecurity = await httpRequest(
          "post",
          '/est-services/security_deposit/_statement',
          "",
          [],
         { Criteria : { propertyid: propertyId }}
        )

        dispatch(
          prepareFinalObject(
            "PenaltyStatementSummary",
            responsePenalty.PenaltyStatementSummary
          )
        );

        dispatch(
          prepareFinalObject(
            "SecurityStatementSummary",
            responseSecurity.SecurityDepositStatementSummary
          )
        );
      } catch (error) {
        console.log(error)
        dispatch(toggleSnackbar(true, error.message, "error"));
      }
    }
  }
}

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

const detailsContainer = {
  uiFramework: "custom-atoms",
  componentPath: "Div",
  children: {
    rentCard: getCommonCard({
      header: rentSummaryHeader,
      detailsContainer: rentSummary
    }),
    penaltyCard: getCommonCard(penaltyInfo(false)),
    securityCard: getCommonCard(securityInfo(false))
  }
}

const EstateDuesSummary = {
  uiFramework: "material-ui",
  name: "rent-information",
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
            tabs: (isPropertyMasterOrAllotmentOfSite == "PROPERTY_MASTER") ? tabs : tabsAllotment,
            activeIndex: (isPropertyMasterOrAllotmentOfSite == "PROPERTY_MASTER") ? 10 : 7,
            onTabChange
          },
          type: "array",
        },
        breakAfterSearch: getBreak(),
        detailsContainer
      }
    }
  }
};

export default EstateDuesSummary;