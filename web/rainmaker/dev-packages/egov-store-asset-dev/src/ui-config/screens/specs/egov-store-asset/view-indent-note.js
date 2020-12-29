import {
  getCommonHeader,
  getLabel,
  getCommonContainer
} from "egov-ui-framework/ui-config/screens/specs/utils";
import get from "lodash/get";
import { IndentNoteReviewDetails } from "./viewindentIssueNoteResource/indent-note-review";
import { masterViewFooter } from "./viewindentIssueNoteResource/footer";
import { getMaterialIndentData } from "./viewindentIssueNoteResource/functions";
import { showHideAdhocPopup } from "../utils";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { httpRequest } from "../../../../ui-utils";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import{WorkFllowStatus} from '../../../../ui-utils/sampleResponses'
import { getstoreTenantId } from "../../../../ui-utils/storecommonsapi";
//print function UI start SE0001
import { downloadAcknowledgementForm} from '../utils'
//print function UI end SE0001
let IsEdit = true;
let applicationNumber = getQueryArg(window.location.href, "applicationNumber");
let status = getQueryArg(window.location.href, "Status");
let ConfigStatus = WorkFllowStatus().WorkFllowStatus;
ConfigStatus = ConfigStatus.filter(x=>x.code.toUpperCase() === status.toUpperCase())
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
        pagename:"Indent Note"
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
      pagename:"Indent Note"
    },
    visible: true
  };
 else return {};
};
export const header = getCommonContainer({
  header: getCommonHeader({
    labelName: `View Indent Material Issue Note`,
    labelKey: "STORE_VIEW_INDENT_MATERIAL_ISSUE_NOTE"
  }),
  applicationNumber: applicationNumberContainer(),
    status: statusContainer()
});

const createMatrialIndentNoteHandle = async (state, dispatch) => {
//  const IndentId = getQueryArg(window.location.href, "IndentId");
  let issueNumber = getQueryArg(window.location.href, "applicationNumber");
  let indents = get(
    state.screenConfiguration.preparedFinalObject,
    `materialIssues`,
    []
  );
  let IndentId = indents[0].indent.id;
  dispatch(setRoute(`/egov-store-asset/createMaterialIndentNote?issueNumber=${issueNumber}&&IndentId=${IndentId}`));
};
const creatPOHandle = async (state, dispatch) => {
  let indents = get(
    state.screenConfiguration.preparedFinalObject,
    `materialIssues`,
    []
  );
  let indentNumber = indents[0].indent.indentNumber;
  if(indentNumber)
  dispatch(setRoute(`/egov-store-asset/create-purchase-order?indentNumber=${indentNumber}`));
};
//print function UI start SE0001
/** MenuButton data based on status */
const printPdf = async (state, dispatch) => {
  downloadAcknowledgementForm("Indent Issue");
}
let printMenu = [];
let receiptPrintObject = {
  label: { labelName: "Receipt", labelKey: "STORE_PRINT_INDENT_ISSUE_NOTE" },
  link: () => {
    downloadAcknowledgementForm("Indent Issue");
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
          moduleName: "store-asset",
          masterDetails: [
            { name: "Material" }, //filter: "[?(@.active == true)]" },           
            { name: "IndentPurpose"},// filter: "[?(@.active == true)]" },
            
          ],
        },
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
              { name: "Department", filter: "[?(@.active == true)]" },
              { name: "Designation", filter: "[?(@.active == true)]" }
            
          ]
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
const getData = async (action, state, dispatch) => {
   
  await getEmployeeData(action, state, dispatch);
}
const getEmployeeData = async (action, state, dispatch) => {
  //fecthing employee details 
  const queryParams = [{ key: "roles", value: "EMPLOYEE" },{ key: "tenantId", value:  getTenantId() }];
  const payload = await httpRequest(
    "post",
    "/egov-hrms/employees/_search",
    "_search",
    queryParams,
  );
  if(payload){
    if (payload.Employees) {
      const empDetails =
      payload.Employees.map((item, index) => {
          const deptCode = item.assignments[0] && item.assignments[0].department;
          const designation =   item.assignments[0] && item.assignments[0].designation;
          const empCode = item.code;
          const empName = `${item.user.name}`;
        return {
                code : empCode,
                name : empName,
                dept : deptCode,
                designation:designation,
        };
      });
    
      if(empDetails){
        dispatch(prepareFinalObject("createScreenMdmsData.employee",empDetails));  
      }
      
    }
  }

}
const screenConfig = {
  uiFramework: "material-ui",
  name: "view-indent-note",
  beforeInitScreen: (action, state, dispatch) => {
    //let issueNumber = getQueryArg(window.location.href, "issueNumber");
    let tenantId = getQueryArg(window.location.href, "tenantId");
    let issueNumber = getQueryArg(window.location.href, "applicationNumber");
    getMdmsData(action, state, dispatch, tenantId);
   // getData(action, state, dispatch);
    getMaterialIndentData(state, dispatch, issueNumber, tenantId);
   // showHideAdhocPopup(state, dispatch);
   
    //IsEdit = false;
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
              //   sm: 6,               
              //  // align: "right",
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
                  labelName: "Add Material Indent Note",
                  labelKey: "STORE_MATERIAL_INDENT_NOTE_ADD",
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
                  labelName: "Add Purchase Order",
                  labelKey: "STORE_ADD_NEW_PURCHASE_ORDR_BUTTON",
                }),
              },
              onClickDefination: {
                action: "condition",
                callBack: creatPOHandle,
              },
            },
            //print function UI start SE0001
            printMenu: {
              componentPath: "Button", 
              gridDefination: {
                xs: 12,
                sm: 4,
                md:3,
                lg:3,
                // align: "right",
              },             
              visible: true,
              props: {
                variant: "contained",
                color: "primary",
                style: {
                  color: "white",
                  borderRadius: "2px",
                  // width: "250px",
                  height: "48px",
                },
              },

              children: {
                plusIconInsideButton: {
                  uiFramework: "custom-atoms",
                  componentPath: "Icon",
                  props: {
                    iconName: "print",
                    style: {
                      fontSize: "24px",
                    },
                  },
                },

                buttonLabel: getLabel({
                  labelName: "Indent note",
                  labelKey: "STORE_PRINT_INDENT_ISSUE_NOTE",
                }),
              },
              onClickDefination: {
                action: "condition",
                callBack: printPdf,
              },
             
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
        masterView,
        //footer: IsEdit? masterViewFooter():{},
      }
    },
   
    
  }
};

export default screenConfig;
