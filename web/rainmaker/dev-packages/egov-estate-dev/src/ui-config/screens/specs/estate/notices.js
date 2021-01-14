import {
  getCommonHeader,
  getCommonContainer,
  getLabel,
  getCommonCard,
  getCommonTitle,
  getTextField
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getQueryArg, setDocuments } from "egov-ui-framework/ui-utils/commons";
import { 
  prepareFinalObject,
  handleScreenConfigurationFieldChange as handleField,
  toggleSpinner
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getSearchResults, getSearchApplicationsResults } from "../../../../ui-utils/commons";
import {onTabChange, headerrow, tabs, tabsAllotment} from './search-preview';
import get from "lodash/get";
import { getTenantId} from "egov-ui-kit/utils/localStorageUtils";
import { getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";

let isPropertyMasterOrAllotmentOfSite;

const getData = async (action, state, dispatch, fileNumber) => {
  dispatch(prepareFinalObject("workflow.ProcessInstances", []))
  const userInfo = JSON.parse(getUserInfo());
  const {roles = []} = userInfo
  const findItem = roles.find(item => item.code === "ES_EB_DEALING_ASSISTANT");
  if(fileNumber){
    // await searchResults(action, state, dispatch, fileNumber)
    let queryObject = [
      { key: "fileNumber", value: fileNumber }
    ];
    let payload = await getSearchApplicationsResults(queryObject);
    let propertiesPayload = await getSearchResults(queryObject);
    if(!!propertiesPayload){ 
      let properties = propertiesPayload.Properties;
      dispatch(prepareFinalObject("Properties", properties)); 
    }
    if(!!payload) {
      let applicationsTemp = payload.Applications;
      let propertyPayload = get(state.screenConfiguration.preparedFinalObject, "Properties[0]")
      let propertyIdNotice =  propertyPayload.id;
      let applicationsPayload = applicationsTemp.map(item => {
        if(item.applicationType === "IssuanceOfNotice"){
          let applicationDetails = item.applicationDetails
          let applicationDocuments = item.applicationDocuments
          let applicationNumber = item.applicationNumber
          let applicationType = item.applicationType
          return {
            applicationType, applicationNumber, applicationDetails, applicationDocuments
          }
        }
        
      })
      applicationsPayload = applicationsPayload.filter(x => x !== undefined);
      applicationsTemp = [{...applicationsTemp, applicationsPayload}]
      applicationsPayload = [{applicationsPayload}]
      dispatch(prepareFinalObject("ApplicationsTemp", applicationsPayload));
      let approvedflagdata = get(state.screenConfiguration.preparedFinalObject, "Properties[0]")
      isPropertyMasterOrAllotmentOfSite = approvedflagdata.propertyMasterOrAllotmentOfSite;
      let approvedFlagState = approvedflagdata.state

      return {
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
                  activeIndex: (isPropertyMasterOrAllotmentOfSite == "PROPERTY_MASTER") ? 8 : 5,
                  onTabChange
                },
                type: "array",
              },
              rightdiv: {
                uiFramework: "custom-atoms",
                componentPath: "Container",
                props: {
                  style: { justifyContent: "flex-end", marginTop: 10 }
                },
                gridDefination: {
                  xs: 12,
                  sm: 12,
                  align: "right"
                },
                children: {
                  issuanceOfNoticeButton: buttonComponent("Create Issuance of Notice", `/estate/_apply?propertyId=${propertyIdNotice}&applicationType=EstateBranch_InternalServices_IssuanceOfNotice&fileNumber=${fileNumber}`),
                  
                },
                visible: (approvedFlagState === "ES_APPROVED" && !!findItem) ? true : false
              },
              viewFour: {
                uiFramework: "custom-containers-local",
                moduleName: "egov-estate",
                componentPath: "MultipleDocumentsContainer",
                props: {
                  sourceJsonPath:"ApplicationsTemp[0].applicationsPayload",
                  btnhide: false,
                  businessService:"ES",
                  className: "review-documents",
                  contents: [
                    {
                      label: "ES_NOTICE_APPLICATION_NUMBER",
                      jsonPath: "applicationNumber",
                      url:`/estate/preview?tenantId=${getTenantId()}`
                    },
                    {
                      label: "ES_NOTICE_TYPE",
                      jsonPath: "applicationDetails.typeOfNotice"
                    },
                    {
                      label: "ES_APPLICATION_TYPE",
                      jsonPath: "applicationType"
                    },
                  
                  ]
                }
              },
            
          }
        }
      }
    }
  }
  
}



const buttonComponent = (label, route) => ({
  componentPath: "Button",
  gridDefination: {
    xs: 6,
    sm: 2
  },
  props: {
    variant: "contained",
    style: {
      color: "white",
      backgroundColor: "#fe7a51",
      borderColor:"#fe7a51",
      borderRadius: "2px",
      height: "48px"
    }
  },
  children: {
    buttonLabel: getLabel({
      labelName: label,
      labelKey: label
    })
  },
  onClickDefination: {
    action: "condition",
    callBack: (state, dispatch) => {
      dispatch(setRoute(route));
    }
  }
})

const commonNotices = {
  uiFramework: "material-ui",
  name: "notices",
  hasBeforeInitAsync: true,
  beforeInitScreen: async (action, state, dispatch) => {
      const fileNumber = getQueryArg(window.location.href, "fileNumber");
      dispatch(toggleSpinner())
      const components = await getData(action, state, dispatch, fileNumber)
      dispatch(toggleSpinner())
      // setTimeout(() => updateAllFields(action, state, dispatch), 100)
      return {
        "type": "INIT_SCREEN",
        "screenKey": "notices",
        "screenConfig": {
          "uiFramework": "material-ui",
          "name": "notices",
          components
        }
      }
  }
}

export default commonNotices;