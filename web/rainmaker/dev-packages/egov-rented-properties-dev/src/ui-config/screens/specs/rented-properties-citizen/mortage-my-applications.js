import { getCommonHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getMortgageSearchResults } from "../../../../ui-utils/commons";

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
  const response = await getMortgageSearchResults();
  if(!!response && !!response.MortgageApplications && !!response.MortgageApplications.length) {
    dispatch(prepareFinalObject("searchResults", response.MortgageApplications));
  }
}

const screenConfig = {
  uiFramework: "material-ui",
  name: "mortage-my-applications",
  beforeInitScreen: (action, state, dispatch) => {
    dispatch(prepareFinalObject("actualResults", []));
    dispatch(prepareFinalObject("searchResults", []));
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
                jsonPath: "applicationNumber"
              },
              // {
              //   label: "RP_PROPERTY_ID_LABEL",
              //   jsonPath: "property.id"
              // },
              {
                label: "RP_ALLOTMENT_NUMBER",
                jsonPath: "allotmentNumber",
              },
              {
                label: "RP_COMMON_TABLE_COL_OWNER_NAME",
                jsonPath: "applicant[0].name"
              },
              {
                label: "RP_COMMON_TABLE_COL_STATUS",
                jsonPath: "state"
              }
            ],
            moduleName: "MORTGAGERP",
            homeURL: "/rented-properties/home"
          }
        }
      }
    }
  }
};

export default screenConfig;
