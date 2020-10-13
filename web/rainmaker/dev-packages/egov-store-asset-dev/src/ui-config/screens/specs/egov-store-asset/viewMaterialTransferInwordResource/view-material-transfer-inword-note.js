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
const gotoCreatePage = (state, dispatch) => {
  const IndentId = getQueryArg(window.location.href, "IndentId");
  const createUrl =
  process.env.REACT_APP_SELF_RUNNING === "true"
  ? `/egov-ui-framework/egov-store-asset/createMaterialTransferInword?step=0`
  : `/egov-store-asset/createMaterialTransferInword?step=0`;
  dispatch(setRoute(createUrl));
};

const getHeader = label => {
  return {
    uiFramework: "custom-molecules-local",
    moduleName: "egov-hrms",
    componentPath: "DividerWithLabel",
    props: {
      className: "hr-generic-divider-label",
      labelProps: {},
      dividerProps: {},
      label
    },
    type: "array"
  };
};


export const getMaterialTransferInwordNoteListDetailsView = (isReview = true) => {
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
            labelName: "Material Transfer Inward ",
            labelKey: "STORE_MATERIAL_TRANSFER_INWARD"
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
   
    break1: getBreak(),
    viewOne: getCommonContainer({

      // mrnNUmber: getLabelWithValue(
      //   {
      //     labelName: "Material Receipt Number",
      //     labelKey: "STORE_MATERIAL_COMMON_MRN_NUMBER"
      //   },
      //   { jsonPath: "transferInwards[0].mrnNumber" }
      // ),
      TransferOutwordNo: getLabelWithValue(
        {
          labelName: "Transfer Outword No.",
          labelKey: "STORE_MATERIAL_OUTWORD_NO"
        },
        { jsonPath: "transferInwards[0].issueNumber" }
      ),
      receiptDate: getLabelWithValue(
        {labelName: "Receipt Date",
        labelKey: "STORE_MATERIAL_RECEIPT_RECEIPT_DATE " },
        { jsonPath: "transferInwards[0].receiptDate", }
      ),
    
      receiptType: getLabelWithValue(
        
          { labelName: "Receipt Type", labelKey: "STORE_MATERIAL_RECEIPT_RECEIPT_TYPE" },
        
        {  jsonPath: "transferInwards[0].receiptType", }
      ),
      // outwordDate: getLabelWithValue(
      //    { labelName: "Outword Date", labelKey: "STORE_MATERIAL_OUTWORD_DATE" },
      //   { jsonPath: "transferInwards[0].issueDate", }
      // ),
      intendingstore: getLabelWithValue(
        {labelName: "Indenting Store", labelKey: "STORE_MATERIAL_TRANSFER_INDENTING_STORE" },
        { jsonPath: "transferInwards[0].receivingStore.name", }
      ),
      issuingtore: getLabelWithValue(
        {labelName: "Issuing Store Name", labelKey: "STORE_MATERIAL_INDENT_NOTE_ISSUING_STORE_NAME" },
        { jsonPath: "transferInwards[0].issueingStore.name", }
      ),
      // purposeofIndent: getLabelWithValue(
      //   {labelName: "Purpose of Indent", labelKey: "STORE_MATERIAL_TRANSFER_PURPOSE_OF_INDENT" },
      //   { jsonPath: "transferInwards[0].indent.indentPurpose", }
      // ),
      createdBy: getLabelWithValue(
        { labelName: "Created by", labelKey: "STORE_PURCHASE_ORDER_CREATEBY" },
        {
          jsonPath: "transferInwards[0].createdByName",
        }
      ),
      designation: getLabelWithValue(
        { labelName: "Designation", labelKey: "STORE_PURCHASE_ORDER_DSGNTN" },
        {
          jsonPath: "transferInwards[0].designation",
        }
      ),
      Remark: getLabelWithValue(
        {  labelName: "Remark",
        labelKey: "STORE_MATERIAL_INDENT_NOTE_REMARK" },
        {
          jsonPath: "transferInwards[0].inspectionRemarks",
        }
      ),
      // receiveBy: getLabelWithValue(
      //   {  labelName: "Receive By", labelKey: "STORE_MATERIAL_RECEIPT_RECEIPT_TYPE" },
      //   {
      //     jsonPath: "materialReceipt[0].receiveBy",
      //   }
      // ),
      // degignation: getLabelWithValue(
      //   {  labelName: "degignation", labelKey: "STORE_MATERIAL_INDENT_NOTE_DESIGNATION"  },
      //   {
      //     jsonPath: "materialReceipt[0].degignation",
      //   }
      // ),
      // status: getLabelWithValue(
      //   {  labelName: "status", labelKey: "STORE_MATERIAL_INDENT_NOTE_STATUS"},
      //   {
      //     jsonPath: "materialReceipt[0].status",
      //   }
      // ),

    }),


  });
};
