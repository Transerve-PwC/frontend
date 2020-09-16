const { getCommonContainer, getCommonHeader } = require("egov-ui-framework/ui-config/screens/specs/utils");
const { getQueryArg } = require("egov-ui-framework/ui-utils/commons");
const { getSearchApplicationsResults } = require("../../../../ui-utils/commons");
const { setThirdStep } = require("../estate-citizen/applyResource/review");


const headerrow = getCommonContainer({
    header: getCommonHeader({
      labelName: "Search preview",
      labelKey: "EST_COMMON_SEARCH_PREVIEW"
    })
  });

const getData = async (action, state, dispatch) => {
    const applicationNumber = getQueryArg(window.location.href, "appliationNumber");
    if(!applicationNumber) {
        return {}
    }
    const tenantId = getQueryArg(window.location.href, "tenantId");
    const queryObject = [
        {key: "applicationNumber", value: applicationNumber}
      ]
    const response = await getSearchApplicationsResults(queryObject)
    try {
       const {Applications = []} = response;
       const {branchType, moduleType, applicationType} = Applications[0];
       const type = `${branchType}_${moduleType}_${applicationType}`;
       const reviewDetails = await setThirdStep(state, dispatch, type, Applications[0], false);
        return {
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
                           ...headerrow
                          },
                          helpSection: {
                            uiFramework: "custom-atoms",
                            componentPath: "Container",
                            props: {
                              color: "primary",
                              style: { justifyContent: "flex-end" }
                            },
                            gridDefination: {
                              xs: 12,
                              sm: 4,
                              align: "right"
                            }
                          }
                          }
                        },
                        taskStatus: {
                          uiFramework: "custom-containers-local",
                          moduleName: "egov-estate",
                          componentPath: "WorkFlowContainer",
                          props: {
                            dataPath: "Applications",
                            moduleName: moduleType,
                            updateUrl: "/est-services/application/_update"
                          }
                        },
                        reviewDetails
                    }
                  }
            }
        }
    } catch (error) {
        return {}
    }
 }



const commonPreview = {
    uiFramework: "material-ui",
    name: "preview",
    hasBeforeInitAsync: true,
    beforeInitScreen: async (action, state, dispatch) => {
        dispatch(toggleSpinner())
        const components = await getData(action, state, dispatch)
        dispatch(toggleSpinner())
        return {
          "type": "INIT_SCREEN",
          "screenKey": "preview",
          "screenConfig": {
            "uiFramework": "material-ui",
            "name": "preview",
            components
          }
        }
    }
}