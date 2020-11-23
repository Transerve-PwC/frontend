import {
  getCommonCard, convertEpochToDate
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { prepareFinalObject,handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getSearchResults ,setXLSTableData } from "../../../../ui-utils/commons";
import {onTabChange, headerrow, tabs} from './search-preview'
import { getBreak } from "egov-ui-framework/ui-config/screens/specs/utils";
import { getReviewLicenseFee, getReviewInterest, getReviewSecurity, getReviewGroundRent, rentDetailsTable, getReviewPremiumAmount, installmentTable, getReviewAdvanceRent } from "./applyResource/reviewProperty";
import { getTextToLocalMapping } from "../utils"

const beforeInitFn = async (action, state, dispatch, fileNumber) => {
  if(fileNumber){
    let queryObject = [{ key: "fileNumber", value: fileNumber }];
    const response =  await getSearchResults(queryObject);
    if(!!response) {
      let properties = response.Properties;
      dispatch(prepareFinalObject("Properties[0]", properties[0]));
      let demandGenerationType = properties[0].propertyDetails.paymentConfig.isGroundRent;
      let installments = properties[0].propertyDetails.paymentConfig.premiumAmountConfigItems ? properties[0].propertyDetails.paymentConfig.premiumAmountConfigItems : []
      let rentInfo = properties[0].propertyDetails.paymentConfig.paymentConfigItems ? properties[0].propertyDetails.paymentConfig.paymentConfigItems : [];
      let propertyMasterOrAllotmentOfSite = properties[0].propertyMasterOrAllotmentOfSite;

      let rentData = rentInfo.map(item => ({
        [getTextToLocalMapping("Rent amount")]: item.groundRentAmount || 0,
        [getTextToLocalMapping("Start month")]: item.groundRentStartMonth || 0,
        [getTextToLocalMapping("End month")]: item.groundRentEndMonth || 0,
        [getTextToLocalMapping("Till")]: (item.groundRentEndMonth/12).toFixed(2) || 0,
      }));

      let installmentData = installments.map(item => ({
        [getTextToLocalMapping("Installment")]: item.premiumAmount || 0,
        [getTextToLocalMapping("Due date of installment")]: convertEpochToDate(item.premiumAmountDate) || "-",
      }))

      let isInterestFixedLabel = properties[0].propertyDetails.paymentConfig.isIntrestApplicable ? "ES_FIXED_INTEREST_LABEL" : "ES_YEARLY_INTEREST_LABEL";

      dispatch(
        handleField(
          action.screenKey,
          "components.div.children.reviewRentInfo.children.cardContent.children.premiumAmountDetails",
          "visible",
          !!(propertyMasterOrAllotmentOfSite == "ALLOTMENT_OF_SITE")
        )
      )
      dispatch(
        handleField(
          action.screenKey,
          "components.div.children.reviewRentInfo.children.cardContent.children.installmentTable",
          "visible",
          !!(propertyMasterOrAllotmentOfSite == "ALLOTMENT_OF_SITE")
        )
      )
      dispatch(
        handleField(
          action.screenKey,
          "components.div.children.reviewRentInfo.children.cardContent.children.breakAfterSearch1",
          "visible",
          !!(propertyMasterOrAllotmentOfSite == "ALLOTMENT_OF_SITE")
        )
      )

      dispatch(
        handleField(
          action.screenKey,
          "components.div.children.reviewRentInfo.children.cardContent.children.interestDetails.children.cardContent.children.viewInterest.children.percentageOfInterest.children.label.children.key",
          "props.labelKey",
          isInterestFixedLabel 
        )
      )
      dispatch(
        handleField(
          action.screenKey,
          "components.div.children.reviewRentInfo.children.cardContent.children.rentTable",
          "props.data",
          rentData
        )
      );
      dispatch(
        handleField(
          action.screenKey,
          "components.div.children.reviewRentInfo.children.cardContent.children.installmentTable",
          "props.data",
          installmentData
        )
      );

      dispatch(
        handleField(
          action.screenKey,
          "components.div.children.reviewRentInfo.children.cardContent.children.groundRentDetails",
          "visible",
          !!demandGenerationType
        )
      )
      dispatch(
        handleField(
          action.screenKey,
          "components.div.children.reviewRentInfo.children.cardContent.children.licenseFeeDetails",
          "visible",
          !demandGenerationType
        )
      )
    }
  }
}


const EstateRentInfo = {
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
            tabs,
            activeIndex: 7,
            onTabChange
          },
          type: "array",
        },
        breakAfterSearch: getBreak(),
        reviewRentInfo : getCommonCard({
          premiumAmountDetails: getReviewPremiumAmount(false, 0, "apply"),
          breakAfterSearch1: getBreak(),
          installmentTable: installmentTable,
          groundRentDetails: getReviewGroundRent(false, 0, "apply"),
          breakAfterSearch2: getBreak(),
          rentTable: rentDetailsTable,
          licenseFeeDetails: getReviewLicenseFee(false, 0, "apply"),
          advanceRentDetails: getReviewAdvanceRent(false, 0, "apply"),
          interestDetails: getReviewInterest(false, 0, "apply"),
          securityDetails: getReviewSecurity(false, 0, "apply")
        })
    }
  }
}
};

export default EstateRentInfo;