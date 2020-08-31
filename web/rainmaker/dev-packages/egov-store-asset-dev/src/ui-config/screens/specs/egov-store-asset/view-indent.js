import {
  getCommonHeader,
  getLabel,
  getCommonContainer
} from "egov-ui-framework/ui-config/screens/specs/utils";
import get from "lodash/get";
import { IndentListReviewDetails } from "./viewindentResource/indent-review";
import { masterViewFooter } from "./viewindentResource/footer";
import { getMaterialIndentData } from "./viewindentResource/functions";
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
let applicationNumber = getQueryArg(window.location.href, "indentNumber");
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
        pagename:"Indent"
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
    labelName: `View Material  Indent Note`,
    labelKey: "STORE_VIEW_INDENT"
  }),
  applicationNumber: applicationNumberContainer(),
  status: statusContainer()
});

const createMatrialIndentNoteHandle = async (state, dispatch) => {

  let IndentId = getQueryArg(window.location.href, "id");
  dispatch(setRoute(`/egov-store-asset/createMaterialIndentNote?IndentId=${IndentId}`));
};
const creatPOHandle = async (state, dispatch) => {
  let indents = get(
    state.screenConfiguration.preparedFinalObject,
    `indents`,
    []
  );
  let indentNumber = indents[0].indentNumber;
  dispatch(setRoute(`/egov-store-asset/create-purchase-order?indentNumber=${indentNumber}`));
};
//print function UI start SE0001
/** MenuButton data based on status */
let printMenu = [];
let receiptPrintObject = {
  label: { labelName: "Receipt", labelKey: "STORE_PRINT_INDENT" },
  link: () => {
    downloadAcknowledgementForm("Indent");
  },
  leftIcon: "receipt"
};
printMenu = [receiptPrintObject];
//pint function UI End SE0001
const masterView = IndentListReviewDetails(false);
const getMdmsData = async (action, state, dispatch, tenantId) => {
  const tenant =  getstoreTenantId();
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

const screenConfig = {
  uiFramework: "material-ui",
  name: "view-indent",
  beforeInitScreen: (action, state, dispatch) => {
    let id = getQueryArg(window.location.href, "id");
    let tenantId = getQueryArg(window.location.href, "tenantId");
   
   // showHideAdhocPopup(state, dispatch);
    getMdmsData(action, state, dispatch, tenantId);
    getMaterialIndentData(state, dispatch, id, tenantId);
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
              visible: true,// enableButton,
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
              visible: true,// enableButton,
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
        masterView,
        // footer: masterViewFooter()
        footer: IsEdit? masterViewFooter():{},
      }
    },
   
    
  }
};

export default screenConfig;
