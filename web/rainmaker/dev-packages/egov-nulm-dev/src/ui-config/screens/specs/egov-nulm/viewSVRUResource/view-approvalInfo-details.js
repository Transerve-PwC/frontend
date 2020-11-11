import {
  getCommonContainer,
  getCommonGrayCard,
  getCommonSubHeader,
  getLabel,
  getLabelWithValue
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";

const gotoCreatePage = (state, dispatch) => {
   const createUrl = `/egov-store-asset/create-material-transfer-outward?step=2`;
  dispatch(setRoute(createUrl));
};

export const getApprovalInfoView = (isReview = true) => {
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
            labelName: "Approval Information",
            labelKey: "STORE_PO_APPROVAL_INFO_HEADER"
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
              labelKey: "HR_SUMMARY_EDIT"
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
      approvalDate: getLabelWithValue(
        {
          labelName: "Approval Date",
          labelKey: "STORE_PURCHASE_APPROVAL_DATE"
        },
        { jsonPath: "purchaseOrders[0].purchaseType" }
      ),
      approvalName: getLabelWithValue(
        {
          labelName: "Approval Name",
          labelKey: "STORE_PURCHASE_APPROVAL_NAME"
        },
        { jsonPath: "purchaseOrders[0].store.name" }
      ),
      approvalDesignation: getLabelWithValue(
        { labelName: "Approval Designation", labelKey: "STORE_PURCHASE_APPROVAL_DSGNTN" },
        { jsonPath: "purchaseOrders[0].purchaseOrderDate" }
      ),
      approvalStatus: getLabelWithValue(
        {
          labelName: "Approval Status",
          labelKey: "STORE_PURCHASE_APPROVAL_STATUS"
        },
        { jsonPath: "purchaseOrders[0].rateType" }
      ), 
      approvalRemark: getLabelWithValue(
        {
          labelName: "Approval Remark",
          labelKey: "STORE_PURCHASE_ORDER_APPROVAL_RMRK"
        },
        { jsonPath: "purchaseOrders[0].rateType" }
      ), 
      
    }),
  });
};
