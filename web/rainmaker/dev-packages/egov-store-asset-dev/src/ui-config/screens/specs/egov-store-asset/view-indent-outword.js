import {
  getCommonHeader,
  getLabel,
  getCommonContainer
} from "egov-ui-framework/ui-config/screens/specs/utils";
import get from "lodash/get";
import { MTONReviewDetails } from "./viewMTONResource/mton-review";
import { poViewFooter } from "./viewMTONResource/footer";
import { getIndentOutwordData } from "./viewMTONResource/functions";
import { showHideAdhocPopup } from "../utils";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { httpRequest } from "../../../../ui-utils";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { getstoreTenantId } from "../../../../ui-utils/storecommonsapi";
import{WorkFllowStatus} from '../../../../ui-utils/sampleResponses'
let applicationNumber = getQueryArg(window.location.href, "applicationNumber");
//print function UI start SE0001
import { downloadAcknowledgementForm} from '../utils'
//print function UI end SE0001
let status = getQueryArg(window.location.href, "Status");
let IsEdit = true;
let enableButton = true;
if(status.toUpperCase() ===WorkFllowStatus().WorkFllowRejected.toUpperCase())
enableButton = false
else if(status.toUpperCase() !==WorkFllowStatus().WorkFllowApproved.toUpperCase())
enableButton = false
let ConfigStatus = WorkFllowStatus().WorkFllowStatus;
console.log(ConfigStatus);
ConfigStatus = ConfigStatus.filter(x=>x.code === status.toUpperCase())
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
        pagename:"Indent Transfer Outword"
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
    labelName: `View Material Transfer Outward Note`,
    labelKey: "STORE_MTON_VIEW"
  }),
  applicationNumber: applicationNumberContainer(),
  status: statusContainer()
});

const createMatrialIndentNoteHandle = async (state, dispatch) => {

//  let id = getQueryArg(window.location.href, "id");
  let materialIssues = get(
    state.screenConfiguration.preparedFinalObject,
    `materialIssues`,
    []
  );
  let id = materialIssues[0].id;
  dispatch(setRoute(`/egov-store-asset/create-material-transfer-indent?id=${id}`));
};
const createMatrialIndentOutwordHandle=async (state, dispatch) => {
  let indents = get(
    state.screenConfiguration.preparedFinalObject,
    `indents`,
    []
  );
  let indentNumber = indents[0].indentNumber;
  if(indentNumber)  
  dispatch(setRoute(`/egov-store-asset/create-material-transfer-outward?indentNumber=${indentNumber}`));
};
//print function UI start SE0001
/** MenuButton data based on status */
const printPdf = async (state, dispatch) => {
  downloadAcknowledgementForm("Indent Outward");
}
let printMenu = [];
let receiptPrintObject = {
  label: { labelName: "Receipt", labelKey: "STORE_PRINT_INDENT_OUTWORD" },
  link: () => {
    downloadAcknowledgementForm("Indent Outward");
  },
  leftIcon: "receipt"
};
printMenu = [receiptPrintObject];
//pint function UI End SE0001
const masterView = MTONReviewDetails(false);
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
            {
              name: "UOM",
              filter: "[?(@.active == true)]"
            },
            
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
  name: "view-indent-outword",
  beforeInitScreen: (action, state, dispatch) => {
    let id = getQueryArg(window.location.href, "id");
    let tenantId = getQueryArg(window.location.href, "tenantId");
    let applicationNumber = getQueryArg(window.location.href, "applicationNumber");

   // showHideAdhocPopup(state, dispatch);
    getMdmsData(action, state, dispatch, tenantId);
    getIndentOutwordData(state, dispatch, id, tenantId,applicationNumber);
    getData(action, state, dispatch);
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
                  labelKey: "STORE_MATERIAL_INDENT_TRANSFER",
                }),
              },
              onClickDefination: {
                action: "condition",
                callBack: createMatrialIndentNoteHandle,
              },
            },
            indentoutwordButton: {
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
                  labelName: "Add Material Transfer Outword Note",
                  labelKey: "STORE_MATERIAL_INDENT_OUTWORD",
                }),
              },
              onClickDefination: {
                action: "condition",
                callBack: createMatrialIndentOutwordHandle,
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
                              labelKey: "STORE_PRINT_INDENT_OUTWORD",
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
            updateUrl: "/store-asset-services/materialissues-to/_updateStatus"

          }
        },
        masterView
        //footer: IsEdit? poViewFooter():{},
      }
    },
   
    
  }
};

export default screenConfig;
