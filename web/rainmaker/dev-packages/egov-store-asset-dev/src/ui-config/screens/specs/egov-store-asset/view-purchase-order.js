import {
    getCommonHeader,
    getLabel,
    getCommonContainer
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import get from "lodash/get";
  import set from "lodash/set";
  import { POReviewDetails } from "./viewPurchaseOrder/po-review";
  import { poViewFooter } from "./viewPurchaseOrder/footer";
  import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
  import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
  import { getstoreTenantId } from "../../../../ui-utils/storecommonsapi";
  import {
    convertDateToEpoch,
    epochToYmdDate,
    showHideAdhocPopup,
    validateFields
  } from "../utils";
  import { IndentConfigType } from "../../../../ui-utils/sampleResponses";
  import { httpRequest } from "../../../../ui-utils";
  import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import { getSearchResults } from "../../../../ui-utils/commons";
  import{WorkFllowStatus} from '../../../../ui-utils/sampleResponses'
  //print function UI start SE0001
import { downloadAcknowledgementForm} from '../utils'
//print function UI end SE0001
let applicationNumber = getQueryArg(window.location.href, "applicationNumber");
let status = getQueryArg(window.location.href, "Status");
let ConfigStatus = WorkFllowStatus().WorkFllowStatus;
let IsEdit = true;
console.log(ConfigStatus);
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
        pagename:"PO"
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
      visibility: "hidden"
    },
    visible: true
  };
 else return {};
};
//print function UI start SE0001
/** MenuButton data based on status */
const printPdf = async (state, dispatch) => {
  downloadAcknowledgementForm("Purchase Order");
}
let printMenu = [];
let receiptPrintObject = {
  label: { labelName: "Receipt", labelKey: "STORE_PRINT_PO" },
  link: () => {
    downloadAcknowledgementForm("Purchase Order");
  },
  leftIcon: "receipt"
};
printMenu = [receiptPrintObject];
//pint function UI End SE0001
  export const header = getCommonContainer({
    header: getCommonHeader({
      labelName: `View Purchase Order`,
      labelKey: "STORE_PURCHASE_ORDER_VIEW"
    }),
    applicationNumber: applicationNumberContainer(),
    status: statusContainer()
  });
  
  const tradeView = POReviewDetails(false);
  
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
          }
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
  const setDateInYmdFormat = (obj, values) => {
    values.forEach(element => {
      set(obj, element, epochToYmdDate(get(obj, element)));
    });
  };
  const furnishindentData = (state, dispatch) => {
    let purchaseOrders = get(
      state.screenConfiguration.preparedFinalObject,
      "purchaseOrders",
      []
    );
     setDateInYmdFormat(purchaseOrders[0], ["expectedDeliveryDate", "purchaseOrderDate"]); 
     //get set total value
     let totalIndentQty = 0;
     let totalvalue = 0
     let TotalQty = 0;
     let indentQuantity = get(purchaseOrders[0], `purchaseOrderDetails[${0}].purchaseIndentDetails[0].indentDetail.indentQuantity`,0)
     for (let index = 0; index < purchaseOrders[0].purchaseOrderDetails.length; index++) {
       const element = purchaseOrders[0].purchaseOrderDetails[index];
       let userQuantity = get(purchaseOrders[0], `purchaseOrderDetails[${index}].userQuantity`,0)
       let unitPrice = get(purchaseOrders[0], `purchaseOrderDetails[${index}].unitPrice`,0)
       
       let poOrderedQuantity = get(purchaseOrders[0], `purchaseOrderDetails[${index}].purchaseIndentDetails[0].indentDetail.poOrderedQuantity`,0)
       let indentNumber = get(purchaseOrders[0], `purchaseOrderDetails[${index}].indentNumber`,'')
       let orderQuantity = get(purchaseOrders[0], `purchaseOrderDetails[${index}].orderQuantity`,0)
       set(purchaseOrders[0], `purchaseOrderDetails[${index}].indentNumber`,indentNumber);
       set(purchaseOrders[0], `purchaseOrderDetails[${index}].indentQuantity`,indentQuantity);
       set(purchaseOrders[0], `purchaseOrderDetails[${index}].poOrderedQuantity`,poOrderedQuantity);
      
       totalvalue = totalvalue+(unitPrice*userQuantity)
       //totalIndentQty = totalIndentQty+ indentQuantity
       TotalQty = TotalQty+ orderQuantity
       set(purchaseOrders[0], `purchaseOrderDetails[${index}].totalValue`,totalvalue);
     } 
     if(purchaseOrders[0].rateType==='Gem')
     set(purchaseOrders[0], `supplier.name`,purchaseOrders[0].supplier.code);
     dispatch(prepareFinalObject(`purchaseOrders[0].totalIndentQty`, indentQuantity));
     dispatch(prepareFinalObject(`purchaseOrders[0].totalvalue`, totalvalue));
     dispatch(prepareFinalObject(`purchaseOrders[0].totalQty`, TotalQty));

    dispatch(prepareFinalObject("purchaseOrders", purchaseOrders));
  };
  const screenConfig = {
    uiFramework: "material-ui",
    name: "view-purchase-order",
    beforeInitScreen: (action, state, dispatch) => {
      //let poNumber = getQueryArg(window.location.href, "poNumber");
      let poNumber = getQueryArg(window.location.href, "applicationNumber");

      let tenantId = getQueryArg(window.location.href, "tenantId");
      const queryObject = [{ key: "tenantId", value: tenantId},{ key: "purchaseOrderNumber", value: poNumber}];
      getSearchResults(queryObject, dispatch,"purchaseOrder")
      .then(response =>{
        if(response){
         
          dispatch(prepareFinalObject("purchaseOrders", [...response.purchaseOrders]));       
          furnishindentData(state, dispatch);

          //call indent api for Approved indent

          let queryObjectI = [
            {
              key: "tenantId",
              value: tenantId
            },
            {
              key: "indentType",
              value: IndentConfigType().IndntType.INEDENT
            },
            {
              key: "indentStatus",
              value: IndentConfigType().indentStatus
            },
          ];
          getSearchResults(queryObjectI, dispatch,"indents")
          .then(response =>{
            if(response){
              dispatch(prepareFinalObject("indents", [...response.indents])); 
            }
          });
      if(response.purchaseOrders && response.purchaseOrders[0].supplier.code){
        const queryObject = [{ key: "tenantId", value: getTenantId()},{ key: "suppliers", value: response.purchaseOrders[0].supplier.code}];
        if(response.purchaseOrders[0].rateType !=="Gem")
        {

        getSearchResults(queryObject, dispatch,"priceList")
        .then(response =>{
          if(response){
            let priceList = [{rateContractNumber:"",rateContractDate:"",agreementNumber:"",agreementDate:"",agreementStartDate:"",agreementEndDate:""}];
            
            priceList[0].rateContractNumber  =  response.priceLists[0].rateContractNumber;
            priceList[0].rateContractDate   = new Date(response.priceLists[0].rateContractDate).toISOString().substr(0,10);
            priceList[0].agreementNumber   =   response.priceLists[0].agreementNumber;
            priceList[0].agreementDate   =   new Date(response.priceLists[0].agreementDate).toISOString().substr(0,10);
            priceList[0].agreementStartDate   = new Date(response.priceLists[0].agreementStartDate).toISOString().substr(0,10);
            priceList[0].agreementEndDate   =  new Date(response.priceLists[0].agreementEndDate).toISOString().substr(0,10);
            dispatch(prepareFinalObject("searchMaster.priceList", response.priceLists));  
                dispatch(prepareFinalObject("purchaseOrders[0].priceList", priceList));          
           }  
        }); 
      }
        
       }
      }
    });  
    //   getMdmsData(action, state, dispatch, tenantId);
      return action;
    },
    components: {
      div: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
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
                //   sm: 10
                // },
                ...header
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
                    labelKey: "STORE_PRINT_PO",
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
              dataPath: "purchaseOrders",
              updateUrl: "/store-asset-services/purchaseorders/_updateStatus"
            }
          },
            tradeView
          //footer: poViewFooter()
          //footer: IsEdit? poViewFooter():{},
        }
      },
    }
  };
  
  export default screenConfig;
  