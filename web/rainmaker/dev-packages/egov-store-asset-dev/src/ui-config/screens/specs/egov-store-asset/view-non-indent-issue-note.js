import {
  getCommonHeader,
  getLabel,
  getCommonContainer
} from "egov-ui-framework/ui-config/screens/specs/utils";
import get from "lodash/get";
import { IndentNoteReviewDetails } from "./viewnonindentIssueNoteResource/indent-note-review";
import { masterViewFooter } from "./viewnonindentIssueNoteResource/footer";
import { getMaterialNonIndentData } from "./viewnonindentIssueNoteResource/functions";
import { showHideAdhocPopup } from "../utils";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { httpRequest } from "../../../../ui-utils";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";

import { getstoreTenantId } from "../../../../ui-utils/storecommonsapi";
import{WorkFllowStatus} from '../../../../ui-utils/sampleResponses'
//print function UI start SE0001
import { downloadAcknowledgementForm} from '../utils'
//print function UI end SE0001
let applicationNumber = getQueryArg(window.location.href, "applicationNumber");
let status = getQueryArg(window.location.href, "Status");
let IsEdit = true;
let ConfigStatus = WorkFllowStatus().WorkFllowStatus;
console.log(ConfigStatus);
ConfigStatus = ConfigStatus.filter(x=>x.code === status)
if(ConfigStatus.length >0)
IsEdit = false;
const applicationNumberContainer = () => {

  if (applicationNumber)
    return {
      uiFramework: "custom-atoms-local",
      moduleName: "egov-store-asset",
      componentPath: "ApplicationNoContainer",
      props: {
        number: `${applicationNumber}`,
        visibility: "hidden",
        pagename:"Non Indent"
      },
      visible: true
    };
  else return {};
};

const statusContainer = () => {

if(status)
    return {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-store-asset",
    componentPath: "ApplicationStatusContainer",
    props: {
     status: `${status}`,
      visibility: "hidden",      
    },
    visible: true
  };
 else return {};
};
export const header = getCommonContainer({
  header: getCommonHeader({
    labelName: `Non-Indent Material Issue Note`,
    labelKey: "STORE_MATERIAL_INDENT_NOTE_NON_INDENT_MATERIAL_ISSUE_NOTE_HEADER"
  }),
  applicationNumber: applicationNumberContainer(),
  status: statusContainer()
});

const createMatrialIndentNoteHandle = async (state, dispatch) => {

  let issueNoteNumber = getQueryArg(window.location.href, "applicationNumber");
  dispatch(setRoute(`/egov-store-asset/createMaterialNonIndentNote?issueNoteNumber=${issueNoteNumber}`));
};
const creatScrapHandle = async (state, dispatch) => {
  let issueNoteNumber = getQueryArg(window.location.href, "applicationNumber");
  dispatch(setRoute(`/egov-store-asset/create-scrap-material?issueNoteNumber=${issueNoteNumber}`));
};
//print function UI start SE0001
/** MenuButton data based on status */
let printMenu = [];
let receiptPrintObject = {
  label: { labelName: "Receipt", labelKey: "STORE_PRINT_NON_INDENT" },
  link: () => {
    downloadAcknowledgementForm("Non Indent");
  },
  leftIcon: "receipt"
};
printMenu = [receiptPrintObject];
//pint function UI End SE0001
const masterView = IndentNoteReviewDetails(false);
const getMdmsData = async (action, state, dispatch, tenantId) => {
  const tenant = getstoreTenantId();
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: tenant,
      moduleDetails: [
        {
          moduleName: "egov-hrms",
          masterDetails: [
            {
              name: "DeactivationReason",
              filter: "[?(@.active == true)]"
            }
          ]
        },
        {
          moduleName: "common-masters",
          masterDetails: [
            { name: "UOM", filter: "[?(@.active == true)]" },
           
          ]
        },
        {
          moduleName: "store-asset",
          masterDetails: [
            { name: "Material" }, //filter: "[?(@.active == true)]" },           
                      
          ],
        },
      ]
    }
  };
  try {
    const payload = await httpRequest(
      "post",
      "/egov-mdms-service/v1/_search",
      "_search",
      [],
      mdmsBody
    );
    dispatch(prepareFinalObject("viewScreenMdmsData", payload.MdmsRes));
  } catch (e) {
    console.log(e);
  }
};

const screenConfig = {
  uiFramework: "material-ui",
  name: "view-non-indent-issue-note",
  beforeInitScreen: (action, state, dispatch) => {
    //let issueNoteNumber = getQueryArg(window.location.href, "issueNoteNumber");
    let tenantId = getQueryArg(window.location.href, "tenantId");
    let issueNoteNumber = getQueryArg(window.location.href, "applicationNumber");
    getMdmsData(action, state, dispatch, tenantId);
    getMaterialNonIndentData(state, dispatch, issueNoteNumber, tenantId);
   // showHideAdhocPopup(state, dispatch);
   
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
              // gridDefination: {
              //   xs: 12,
              //   sm: 12,
              // },
              ...header
            },
           
            newApplicationButton: {
              componentPath: "Button",
              gridDefination: {
                xs: 12,
                sm: 4,
                md:3,
                lg:3,
                // align: "right",
              },
              visible: false,// enableButton,
              props: {
                variant: "contained",
                color: "primary",
                style: {
                  color: "white",
                  borderRadius: "2px",
                  width: "250px",
                  height: "48px",
                },
              },

              children: {
                plusIconInsideButton: {
                  uiFramework: "custom-atoms",
                  componentPath: "Icon",
                  props: {
                    iconName: "add",
                    style: {
                      fontSize: "24px",
                    },
                  },
                },

                buttonLabel: getLabel({
                  labelName: "Add Material Non Indent Note",
                  labelKey: "STORE_MATERIAL_NON_INDENT_NOTE",
                }),
              },
              onClickDefination: {
                action: "condition",
                callBack: createMatrialIndentNoteHandle,
              },
            },
            newPOButton: {
              componentPath: "Button",         
              gridDefination: {
                xs: 12,
                sm: 4,
                md:3,
                lg:3,
                // align: "right",
              },   
              visible: false,// enableButton,
              props: {
                variant: "contained",
                color: "primary",
                style: {
                  color: "white",
                  borderRadius: "2px",
                  width: "250px",
                  height: "48px",
                },
              },

              children: {
                plusIconInsideButton: {
                  uiFramework: "custom-atoms",
                  componentPath: "Icon",
                  props: {
                    iconName: "add",
                    style: {
                      fontSize: "24px",
                    },
                  },
                },

                buttonLabel: getLabel({
                  labelName: "Add Scrap",
                  labelKey: "STORE_ADD_NEW_SCRAP_BUTTON",
                }),
              },
              onClickDefination: {
                action: "condition",
                callBack: creatScrapHandle,
              },
            },
             //print function UI start SE0001
             printMenu: {
              uiFramework: "custom-atoms-local",
              moduleName: "egov-tradelicence",
              componentPath: "MenuButton",
              gridDefination: {
                xs: 12,
                sm: 4,
                md:3,
                lg:3,
                align: "right",
              },  
              visible: true,// enableButton,
              props: {
                data: {
                  label: {
                    labelName:"PRINT",
                    labelKey:"STORE_PRINT"
                  },
                  leftIcon: "print",
                  rightIcon: "arrow_drop_down",
                  props: { variant: "outlined", style: { marginLeft: 10 } },
                  menu: printMenu
                }
              }
            }
            //print function UI End SE0001
          }
        },
        taskStatus: {
          uiFramework: "custom-containers-local",
          componentPath: "WorkFlowContainer",
          moduleName: "egov-store-asset",
          visible: process.env.REACT_APP_NAME === "Citizen" ? false : true,
          props: {
            moduleName: "StoreManagement",
            dataPath: "materialIssues",
            updateUrl: "/store-asset-services/materialissues/_updateStatus"

          }
        },
        masterView
       // footer: IsEdit? masterViewFooter():{},
      }
    },
   
    
  }
};

export default screenConfig;
