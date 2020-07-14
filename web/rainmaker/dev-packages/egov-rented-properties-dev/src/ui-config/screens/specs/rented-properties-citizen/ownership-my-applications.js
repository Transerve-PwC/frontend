import { getCommonHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
import { getOwnershipSearchResults } from "../../../../ui-utils/commons";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";

const header = getCommonHeader(
  {
    labelName: "My Applications",
    labelKey: "TL_MY_APPLICATIONS_HEADER"
  },
  {
    classes: {
      root: "common-header-cont"
    }
  }
);

const getData = async (action, state, dispatch) => {
  const response = await getOwnershipSearchResults();
  if(!!response && !!response.Owners && !!response.Owners.length) {
    dispatch(prepareFinalObject("searchResults", response.Owners));
  }
}


const screenConfig = {
  uiFramework: "material-ui",
  name: "ownership-my-applications",
  beforeInitScreen: (action, state, dispatch) => {
    getData(action, state, dispatch)
    return action
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      children: {
        header: header,
        applicationsCard: {
          uiFramework: "custom-molecules",
          componentPath: "SingleApplication",
          visible: true,
          props: {
            contents: [
              {
                label: "RP_COMMON_TABLE_COL_APPLICAITON_NUMBER",
                jsonPath: "ownerDetails.applicationNumber"
              },
              {
                label: "RP_PROPERTY_ID_LABEL",
                jsonPath: "property.id"
              },
              {
                label: "RP_ALLOTMENT_NUMBER",
                jsonPath: "allotmenNumber",
              },
              {
                label: "RP_COMMON_TABLE_COL_OWNER_NAME",
                jsonPath: "ownerDetails.name"
              },
              {
                label: "RP_COMMON_TABLE_COL_STATUS",
                jsonPath: "applicationState"
              }
            ],
            moduleName: "OWNERSHIPTRANSFERRP",
            homeURL: "/rented-properties/home"
          }
        }
      }
    }
  }
};

export default screenConfig;
