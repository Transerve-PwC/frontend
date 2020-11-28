import {
    getCommonCard,
    getCommonHeader
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { prepareFinalObject,handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getSearchResults } from "../../../../ui-utils/commons";
import { getBreak } from "egov-ui-framework/ui-config/screens/specs/utils";
import {propertyInfo,securityInfo} from './preview-resource/preview-properties'
import {securityDetailsTable} from "./searchResource/searchResults"
import {securityStatmentResult} from './searchResource/functions'
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
    dispatch(prepareFinalObject("SecurityPaymentDetails", []))
    if(!!response) {
      const properties = response.Properties
      const propertyId = properties[0].id;   
      const Criteria = { propertyid: propertyId}
      await securityStatmentResult (state,dispatch, Criteria)
    }

    }
}

export const propertyDetails = getCommonCard(propertyInfo(false))
export const securitySummary = getCommonCard(securityInfo(false))

const securityFeeContainer = {
  uiFramework: "material-ui",
  name: "estate-security-fee",
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
          breakAfterSearch: getBreak(),
          securityDetailsTable
      }
    }
  }
};

export default securityFeeContainer;