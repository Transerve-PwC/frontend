import {
  getCommonHeader, getCommonCard
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  getQueryArg
} from "egov-ui-framework/ui-utils/commons";
import {
  getTenantId
} from "egov-ui-kit/utils/localStorageUtils";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  getReviewPropertyInfo,
  getReviewAuction,
  getReviewAdditional
} from "../estate/applyResource/reviewProperty";
import { getSearchResults } from "../../../../ui-utils/commons";

const beforeInitFn = async (action, state, dispatch, fileNumber) => {
  if (fileNumber) {
    let queryObject = [{
        key: "tenantId",
        value: getTenantId()
      },
      {
        key: "fileNumber",
        value: fileNumber
      }
    ];

    let payload = await getSearchResults(queryObject);

    if (payload) {
      let properties = payload.Properties;
      dispatch(prepareFinalObject("Properties[0]", properties[0]));
    }
  }
}

var reviewPropertyInfo = getReviewPropertyInfo(false);
var reviewAuction = getReviewAuction(false);
var reviewNocDetails = getReviewAdditional(false);

const propertyDetails = getCommonCard({
  reviewPropertyInfo,
  reviewAuction,
  reviewNocDetails
})

const screenConfig = {
  uiFramework: "material-ui",
  name: "estate-branch-search-preview",
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
            header: getCommonHeader({
              labelName: "Property Details",
              labelKey: "EST_COMMON_PROPERTY_DETAILS"
            })
          }
        },
        propertyDetails
      }
    }
  }
}

export default screenConfig;