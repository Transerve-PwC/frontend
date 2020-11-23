import {
    getCommonCard
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { prepareFinalObject,handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getSearchResults ,setXLSTableData } from "../../../../ui-utils/commons";
import {getReviewPayment} from './preview-resource/payment-details'
import {onTabChange, headerrow, tabs} from './search-preview'
import {paymentDetailsTable} from './applyResource/applyConfig'
import { getBreak } from "egov-ui-framework/ui-config/screens/specs/utils";
import {getReviewGroundRent,getReviewAdvanceRent,getReviewLicenseFee,getReviewSecurity} from "./applyResource/reviewProperty"

var reviewGroundRent = getReviewGroundRent(false);
var reviewLicenseFee = getReviewLicenseFee(false);
var reviewAdvanceRent = getReviewAdvanceRent(false);
var reviewSecurity = getReviewSecurity(false);

const reviewGroundDetails = getCommonCard({
  reviewGroundRent,
  reviewAdvanceRent,
  reviewSecurity,
})

const LicenceDetails = getCommonCard({
  reviewLicenseFee,
  reviewAdvanceRent,
  reviewSecurity,
})

const beforeInitFn = async (action, state, dispatch, fileNumber) => {
  if(fileNumber){
      let queryObject = [
          { key: "fileNumber", value: fileNumber }
        ];
   const response =  await getSearchResults(queryObject)
    if(!!response) {
      dispatch(prepareFinalObject("Properties", response.Properties))
      const isGroundRent = response.Properties[0].propertyDetails.paymentConfig.isGroundRent
      if(isGroundRent){
        dispatch(
          handleField(
            "rentInformation",
            "components.div.children",
            "reviewDetails",
            reviewGroundDetails
          )
        );
      }else{
        dispatch(
          handleField(
            "rentInformation",
            "components.div.children",
            "reviewDetails",
            LicenceDetails
          )
        );
      }
    }
  }
}


const rentInformation = {
  uiFramework: "material-ui",
  name: "rentInformation",
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
              activeIndex: 6,
              onTabChange
            },
            type: "array",
          },
          breakAfterSearch: getBreak(),
          reviewDetails : reviewGroundDetails 
      }
    }
  }
};

export default rentInformation;