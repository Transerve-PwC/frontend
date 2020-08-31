import {
  getCommonHeader,
  getLabel,
  getCommonContainer
} from "egov-ui-framework/ui-config/screens/specs/utils";
import get from "lodash/get";
import { MTIReviewDetails } from "./viewMTIResource/mti-review";
import { poViewFooter } from "./viewMTIResource/footer";
import { getMaterialIndentTransferData } from "./viewMTIResource/functions";
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
        pagename:"Indent Transfer"
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
    labelName: `View  Indent Transfer`,
    labelKey: "STORE_INDENT_TRANSFER_VIEW"
  }),
  applicationNumber: applicationNumberContainer(),
  status: statusContainer()
});

const createMatrialIndentNoteHandle = async (state, dispatch) => {

  let id = getQueryArg(window.location.href, "id");
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
let printMenu = [];
let receiptPrintObject = {
  label: { labelName: "Receipt", labelKey: "STORE_PRINT_INDENT_TFR" },
  link: () => {
    downloadAcknowledgementForm("Indent Transfer");
  },
  leftIcon: "receipt"
};
printMenu = [receiptPrintObject];
//pint function UI End SE0001
const masterView = MTIReviewDetails(false);
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
  name: "view-indent-transfer",
  beforeInitScreen: (action, state, dispatch) => {
    let id = getQueryArg(window.location.href, "id");
    let tenantId = getQueryArg(window.location.href, "tenantId");
   
   // showHideAdhocPopup(state, dispatch);
    getMdmsData(action, state, dispatch, tenantId);
    getMaterialIndentTransferData(state, dispatch, id, tenantId);
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
                  labelName: "Add Material Indent Outword",
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
        footer: IsEdit? poViewFooter():{},
      }
    },
   
    
  }
};

export default screenConfig;
