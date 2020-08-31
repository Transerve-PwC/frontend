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
  ? `/egov-ui-framework/egov-store-asset/createMaterialIndentNote?step=0&IndentId=${IndentId}`
  : `/egov-store-asset/createMaterialIndentNote?step=0&IndentId=${IndentId}`;
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


export const getIndentNoteListDetailsView = (isReview = true) => {
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
            labelName: "Indent Material Issue",
            labelKey: "STORE_MATERIAL_INDENT_NOTE_INDENT_MATERIAL_ISSUE"
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
      IssueStoreName: getLabelWithValue(
        {
          labelName: "Issuing Store Name",
          labelKey: "STORE_MATERIAL_INDENT_NOTE_ISSUING_STORE_NAME"
        },
        {  jsonPath: "materialIssues[0].fromStore.name", }
      ),
      IssueDate: getLabelWithValue(
        { labelName: "Issue Date",
        labelKey: "STORE_MATERIAL_INDENT_NOTE_ISSUE_DATE" },
        { jsonPath: "materialIssues[0].issueDate", }
      ),
      IndentingStore: getLabelWithValue(
        {
          labelName: "Indenting Store", labelKey: "STORE_MATERIAL_INDENT_NOTE_INDENTING_STORE"
        },
        { jsonPath: "materialIssues[0].toStore.name" }
      ),
      IndentingDetpName: getLabelWithValue(
        { labelName: "Indenting Dept. Name",
        labelKey: "STORE_MATERIAL_INDENT_NOTE_INDENTING_DEP_NAME" },
        {
          jsonPath: "materialIssues[0].fromStore.department.name",
        }
      ),
      IssueToEmployee: getLabelWithValue(
        { labelName: "Issue To Employee",
        labelKey: "STORE_MATERIAL_INDENT_NOTE_ISSUE_TO_EMPLOYEE" },
        {
          jsonPath: "materialIssues[0].issuedToEmployee"
        }
      ),
      issuedToDesignation: getLabelWithValue(
        {labelName: "Designation", labelKey: "STORE_MATERIAL_INDENT_NOTE_DESIGNATION" },
        {
          jsonPath: "materialIssues[0].issuedToDesignation",
        }
      ),
      Remark: getLabelWithValue(
        { labelName: "Remark",
        labelKey: "STORE_MATERIAL_INDENT_NOTE_REMARK" },
        {
          jsonPath: "materialIssues[0].description",
        }
      ),
      // IssueBy: getLabelWithValue(
      //   { labelName: "Issue By",
      //   labelKey: "STORE_MATERIAL_INDENT_NOTE_ISSUE_BY" },
      //   {
      //     jsonPath: "materialIssues[0].IssueBy",
      //   }
      // ),
      // DesignationIssueBy: getLabelWithValue(
      //   { labelName: "Designation", labelKey: "STORE_MATERIAL_INDENT_NOTE_DESIGNATION" },
      //   {
      //     jsonPath: "materialIssues[0].DesignationIssueBy",
      //   }
      // ),
      // Status: getLabelWithValue(
      //   { labelName: "Status",
      //   labelKey: "STORE_MATERIAL_INDENT_NOTE_STATUS" },
      //   {
      //     jsonPath: "materialIssues[0].materialIssueStatus",
      //   }
      // ),
      
    }),


  });
};
