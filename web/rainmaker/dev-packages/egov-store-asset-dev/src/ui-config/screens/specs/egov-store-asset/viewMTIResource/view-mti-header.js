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
   const createUrl = `/egov-store-asset/create-material-transfer-indent?step=0`;
  dispatch(setRoute(createUrl));
};

export const getMTIHeaderView = (isReview = true) => {
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
            labelName: "Material Transfer Indent",
            labelKey: "STORE_MTI_HEADER"
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
      indentStore: getLabelWithValue(
        {
          labelName: "Indenting Store",
          labelKey: "STORE_MATERIAL_INDENT_NOTE_INDENTING_STORE"
        },
        { jsonPath: "indents[0].indentStore.name" }
      ),
      indentDeptName: getLabelWithValue(
        {
          labelName: "Indenting Dept. Name",
          labelKey: "STORE_MTON_INDENT_DEPT_NAME"
        },
        { jsonPath: "indents[0].indentStore.department.name" }
      ),
      divisionName: getLabelWithValue(
        {
          labelName: "Indenting division Name",
          labelKey: "STORE_INDENTING_DIVISION_NAME"
        },
        { jsonPath: "indents[0].indentStore.divisionName" }
      ),
      indentDate: getLabelWithValue(
        {
          labelName: "Indent Date",
          labelKey: "STORE_MATERIAL_INDENT_INDENT_DATE"
        },
        { jsonPath: "indents[0].indentDate" }
      ),
      indentPurpose: getLabelWithValue(
        { labelName: "Indent Purpose", labelKey: "STORE_MATERIAL_INDENT_INDENT_PURPOSE" },
        { jsonPath: "indents[0].indentPurpose" }
      ),
      issuingStoreName: getLabelWithValue(
        {
          labelName: "Issuing Store Name",
          labelKey: "STORE_MATERIAL_INDENT_NOTE_ISSUING_STORE_NAME"
        },
        { jsonPath: "indents[0].issueStore.name" }
      ),
      remarks: getLabelWithValue(
        { labelName: "Remarks", labelKey: "STORE_PURCHASE_ORDER_REMARK" },
        {
          jsonPath: "indents[0].narration",
        }
      ),
      createdBy: getLabelWithValue(
        { labelName: "Created by", labelKey: "STORE_PURCHASE_ORDER_CREATEBY" },
        {
          jsonPath: "indents[0].indentCreatedBy",
        }
      ),
      designation: getLabelWithValue(
        { labelName: "Designation", labelKey: "STORE_PURCHASE_ORDER_DSGNTN" },
        {
          jsonPath: "indents[0].designation",
        }
      ),
    }),
  });
};
