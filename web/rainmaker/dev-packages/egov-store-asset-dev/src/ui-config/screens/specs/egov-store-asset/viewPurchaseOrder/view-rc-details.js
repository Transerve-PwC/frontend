import {
  getBreak,
  getCommonContainer,
  getCommonGrayCard,
  getCommonSubHeader,
  getLabel,
  getLabelWithValue
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import {  checkValueForNA } from "../../utils";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
const indentNumber = getQueryArg(window.location.href, "indentNumber");
const gotoCreatePage = (state, dispatch) => {
  let createUrl="";
  if(indentNumber)
   createUrl = `/egov-store-asset/create-purchase-order?indentNumber=${indentNumber}&step=1`;
   else
   createUrl = `/egov-store-asset/create-purchase-order?step=1`;
   const {purchaseOrders}  = state.screenConfiguration.preparedFinalObject;             
   if(purchaseOrders &&purchaseOrders[0])
   {
     createUrl = `/egov-store-asset/create-purchase-order?poNumber=${purchaseOrders[0].purchaseOrderNumber}&tenantId=${getTenantId()}&step=2`;
   }
  dispatch(setRoute(createUrl));
};


export const getRCDetailsView = (isReview = true) => {
  return getCommonGrayCard({
    headerDiv: {
      uiFramework: "custom-atoms",
      componentPath: "Container",
      props: {
        style: { marginBottom: "10px" }
      },
      children: {
        header: {
          gridDefination: {
            xs: 12,
            sm: 10
          },
          ...getCommonSubHeader({
            labelName: "Tender/Quotation/Rate Contract Detail",
            labelKey: "STORE_PO_RC_DETAIL_HEADER"
          })
        },
        editSection: {
          componentPath: "Button",
          props: {
            color: "primary"
          },
          visible: isReview,
          gridDefination: {
            xs: 12,
            sm: 2,
            align: "right"
          },
          children: {
            editIcon: {
              uiFramework: "custom-atoms",
              componentPath: "Icon",
              props: {
                iconName: "edit"
              }
            },
            buttonLabel: getLabel({
              labelName: "Edit",
              labelKey: "STORE_SUMMARY_EDIT"
            })
          },
          onClickDefination: {
            action: "condition",
            callBack: gotoCreatePage
          }
        }
      }
    },
    viewOne: getCommonContainer({
      rateContractNumber: getLabelWithValue(
        {
          labelName: "Rate Contract/Tender/Quotation No.",
          labelKey: "STORE_PURCHASE_ORDER_RC_NO"
        },
        { jsonPath: "purchaseOrders[0].priceList[0].rateContractNumber",
        callBack: checkValueForNA }
      ),
      rateContractDate: getLabelWithValue(
        { labelName: "Rate Contract/Tender/Quotation Date", labelKey: "STORE_PURCHASE_ORDER_RC_DATE" },
        { jsonPath: "purchaseOrders[0].priceList[0].rateContractDate" ,
        callBack: checkValueForNA}
      ),
      agreementNumber: getLabelWithValue(
        {
          labelName: "Agreement No.",
          labelKey: "STORE_PURCHASE_ORDER_AGRMENT_NO"
        },
        { jsonPath: "purchaseOrders[0].priceList[0].agreementNumber",
        callBack: checkValueForNA }
      ),
      agreementDate: getLabelWithValue(
        { labelName: "Agreement Date", labelKey: "STORE_PURCHASE_ORDER_AGREEMNT_DT" },
        {
          jsonPath: "purchaseOrders[0].priceList[0].agreementDate",
          callBack: checkValueForNA
        }
      ),
      agreementStartDate: getLabelWithValue(
        { labelName: "Agreement From Date", labelKey: "STORE_PURCHASE_ORDER_AGREEMNT_FRM_DT" },
        {
          jsonPath: "purchaseOrders[0].priceList[0].agreementStartDate",
          callBack: checkValueForNA
        }
      ),
      agreementEndDate: getLabelWithValue(
        { labelName: "Agreement To Date", labelKey: "STORE_PURCHASE_ORDER_AGREEMNT_TO_DT" },
        {
          jsonPath: "purchaseOrders[0].priceList[0].agreementEndDate",
          callBack: checkValueForNA
        }
      ),
    }),
  });
};
