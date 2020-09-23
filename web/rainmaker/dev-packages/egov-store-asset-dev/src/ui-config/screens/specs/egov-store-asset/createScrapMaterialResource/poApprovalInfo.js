import {
  getCommonCard,
  getCommonTitle,
  getTextField,
  getDateField,
  getSelectField,
  getCommonContainer,
  getPattern
} from "egov-ui-framework/ui-config/screens/specs/utils";

import { getSTOREPattern} from "../../../../../ui-utils/commons";
export const poApprovalInfo = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Approval Information",
      labelKey: "STORE_PO_APPROVAL_INFO_HEADER"
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),
  poApprovalInfoContainer: getCommonContainer({
    approvalDate: {
      ...getDateField({
        label: {
          labelName: "Approval Date",
          labelKey: "STORE_PURCHASE_APPROVAL_DATE",
        },
        placeholder: {
          labelName: "Approval Date",
          labelKey: "STORE_PURCHASE_APPROVAL_DATE",
        },
        pattern: getPattern("Date"),
        jsonPath: "purchaseOrders[0].approvalDate",
        props: {
        },
      }),
    },
    approvalName: {
      ...getTextField({
        label: {
          labelName: "Approval Name",
          labelKey: "STORE_PURCHASE_APPROVAL_NAME"
        },
        placeholder: {
          labelName: "Enter Approval Name",
          labelKey: "STORE_PURCHASE_APPROVAL_NAME_PLACEHOLDER"
        },
        pattern: getPattern("Name"),
        jsonPath: "purchaseOrders[0].approvalName"
      })
    },
   
    approvalDesignation: {
      ...getTextField({
        label: {
          labelName: "Approval Designation",
          labelKey: "STORE_PURCHASE_APPROVAL_DSGNTN"
        },
        placeholder: {
          labelName: "Enter Approval Designation",
          labelKey: "STORE_PURCHASE_APPROVAL_DSGNTN_PLACEHOLDER"
        },
        pattern: getPattern("Name"),
        jsonPath: "purchaseOrders[0].approvalDesignation"
      })
    },
    approvalStatus: {
      ...getSelectField({
        label: { labelName: "Approval Status", labelKey: "STORE_PURCHASE_APPROVAL_STATUS" },
        placeholder: {
          labelName: "Select Approval Status",
          labelKey: "STORE_PURCHASE_APPROVAL_STATUS_PLACEHOLDER"
        },
        jsonPath: "purchaseOrders[0].approvalStatus.code",
        sourceJsonPath: "createScreenMdmsData1.material-type.stores",
        props: {
          className: "hr-generic-selectfield",
          optionValue: "code",
          optionLabel: "name"
        }
      }),
    },
    approvalRemark: getTextField({
      label: {
        labelName: "Approval Remark",
        labelKey: "STORE_PURCHASE_ORDER_APPROVAL_RMRK",
      },
      props: {
        className: "applicant-details-error",
        multiline: "multiline",
        rowsMax: 2,
      },
      placeholder: {
        labelName: "Enter remark",
        labelKey: "STORE_PURCHASE_ORDER_APPROVAL_RMRK_PLCEHLDER",
      },
      pattern: getSTOREPattern("Comment"),
      errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
      jsonPath: "purchaseOrders[0].approvalRemark",
    }),
  })
});

