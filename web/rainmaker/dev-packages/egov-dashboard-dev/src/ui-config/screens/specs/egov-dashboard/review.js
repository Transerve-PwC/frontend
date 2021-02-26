import { getCommonCard, getTextField, getCommonContainer, getCommonHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getFileUrlFromAPI, getQueryArg, setBusinessServiceDataToLocalStorage } from "egov-ui-framework/ui-utils/commons";
import { getTenantId, getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
// import "../../../../customstyle.css";
import { workflowPreview, previewWF, getWorkflowDropdownData } from "../../../../ui-utils/commons";
import { getCommonApplyFooter } from "../utils";
import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import "./WFindex.css"

let role_name = JSON.parse(getUserInfo()).roles[0].code;

const getDropdonDta = async(state, dispatch, status) => {
  let response = await getWorkflowDropdownData(state, dispatch, status)
}

const SearchWorkflowPreview = async (state, dispatch, status) => {

  //debugger;
  let response = await workflowPreview(state, dispatch, status);
}

const sortDataReportDropDown  = (selectedModuleName, state, dispatch) => {
  //debugger;
  const selectedModuleNameData = selectedModuleName;
  var dropdownTwo = get(state, "screenConfiguration.preparedFinalObject.DropdownItem");
  dropdownTwo = dropdownTwo[selectedModuleNameData.value].businessService;
  var dropdownTwoService= []
  var dropdownTwoDesc= []
  var desc = {}
  for(var i=0; i<dropdownTwo.length; i++){
    var dropdownOneData = {"name":dropdownTwo[i].businessService, "code": dropdownTwo[i].businessService}
    dropdownTwoService.push(dropdownOneData)
    desc[dropdownTwo[i].businessService] = dropdownTwo[i].businessServiceDescription
    // dropdownTwoDesc.push(dropdownTwo[i].businessServiceDescription)
    dropdownTwoDesc.push(desc);
  }

  // First Element in Dropdown One
  var element = {"label": dropdownTwoService[0].name, "value": dropdownTwoService[0].code};
  dispatch(prepareFinalObject("selectedDropDownTwoData", element));
  
  dispatch(
  handleField(
    "review",
    "components.div.children.body.children.cardContent.children.buisnessService2",
    "props.value",
    element
  )
  );

  dispatch(prepareFinalObject("DropdownTwo", dropdownTwoService));
  dispatch(prepareFinalObject("DropdownDescription", desc));

}

export const WorkflowReport = getCommonCard({
  reportCardGraph : {
    uiFramework: "custom-molecules-local",
    moduleName: "egov-dashboard",
    componentPath: "ReportPreview",
    props: {
    formKey: `newapplication`,
    data : []
    },
    style: {
        minWidth: "1200px",
        height: "500px",
        marginRight: "45px"
    },
    visible: true,
    // required: true
},
})

const getRedirectionURL = () => {
  /* Mseva 2.0 changes */
  const redirectionURL = "/egov-dashboard/home"
  return redirectionURL;
};

export const footer = getCommonApplyFooter({
  nextButton: {
    componentPath: "Button",
    props: {
      variant: "outlined",
      color: "primary",
      style: {
        // minWidth: "200px",
        height: "48px",
        marginRight: "45px"
      }
    },
    children: {
      nextButtonLabel: getLabel({
        labelName: "Home",
        labelKey: "DASHBOARD_WF_HOME_BTN_LABEL"
      }),

      
    },
    onClickDefination: {
      action: "page_change",
      path: `${getRedirectionURL()}`
    },
    visible: true
  }  
});

const titlebar = getCommonContainer({
  header: getCommonHeader({
    labelName: "Workflow Preview",
    labelKey: "DASHBOARD_WF_NAME_TITLE"
  })        
});

const screenConfig = {
  uiFramework: "material-ui",
  name: "review",
  beforeInitScreen: (action, state, dispatch) => {

    let response = getDropdonDta(state, dispatch, status);

    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Form",
      props: {
        className: "common-div-css"
      },
      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",
          children: {
            header: {
              gridDefination: {
                xs: 12,
                sm: 12
              },
              ...titlebar
            }
          } 
        },
        body : getCommonCard({
          buisnessService: {
            uiFramework: "custom-containers-local",
            moduleName: "egov-report",
            componentPath: "AutosuggestContainer",
            jsonPath: "selectedDropDownOneData",
            required: true,
            gridDefination: {
                    xs: 6,
                    sm: 2,
                    md: 2,
                    lg:6
                  },
            props: {
              style: {
              width: "100%",
              cursor: "pointer"
              },
            className: "citizen-city-picker",
            label: { labelName: "Module Name", labelKey: "DASHBOARD_WF_MODULE_DROPDOWN_LABEL" },
            placeholder: {
            labelName: "Select Module Name",
            labelKey: "WF_REPORT_DROPDOWN_PLACEHOLDER"
          },
          sourceJsonPath: "DropdownOne",
          jsonPath: "selectedDropDownOneData",
          maxLength:5,
          labelsFromLocalisation: false,
          suggestions: [],
          fullwidth: true,
          required: true,
          inputLabelProps: {
            shrink: true
          },
          isMulti: false,
          labelName: "name",
          valueName: "name"
          },
          afterFieldChange: (action, state, dispatch) => {

            var selectedModuleName = get(state, "screenConfiguration.preparedFinalObject.selectedDropDownOneData")

            if (selectedModuleName.value != undefined)
            {
              sortDataReportDropDown(selectedModuleName, state, dispatch)
            }
          }
          },
          buisnessService2: {
            uiFramework: "custom-containers-local",
            moduleName: "egov-dashboard",
            componentPath: "AutosuggestContainer",
            jsonPath: "selectedDropDownTwoData",
            required: true,
            // disabled: true,
            // visible: false,
            gridDefination: {
                    xs: 6,
                    sm: 2,
                    md: 2,
                    lg:6
                  },
            props: {
              style: {
              width: "100%",
              marginLeft: "50px",
              cursor: "pointer"
              },
            className: "citizen-city-picker",
            label: { labelName: "Report Name", labelKey: "DASHBOARD_WF_REPORT_DROPDOWN_LABEL" },
            placeholder: {
            labelName: "Select Module Name",
            labelKey: "WF_REPORT_DROPDOWN_PLACEHOLDER"
            },
            sourceJsonPath: "DropdownTwo",
            jsonPath: "selectedDropDownTwoData",
            maxLength:5,
            labelsFromLocalisation: false,
            suggestions: [],
            fullwidth: true,
            required: true,
            inputLabelProps: {
              shrink: true,
            },
            isMulti: false,
            labelName: "name",
            valueName: "name"
          },

          },
          searchBTN: {
            componentPath: "Button",
            props: {
              variant: "outlined",
              color: "primary",
              style: {
                // minWidth: "200px",
                height: "50px",
                // marginLeft: "45px",
                marginRight: "45px"
              }
            },
            children: {
              nextButtonLabel: getLabel({
                labelName: "Search",
                labelKey: "DASHBOARD_WF_SEARCH_BTN_LABEL"
              }),

              
            },
            onClickDefination: {
              // action: "page_change",
              // path: `${getRedirectionURL()}`
              action: "condition",
              callBack: SearchWorkflowPreview
            },
            visible: true
          },
        }),
        WorkflowReport,
        footer
        }
    }
  }
};

export default screenConfig;
