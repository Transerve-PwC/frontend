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
     const createUrl = `/egov-nulm/create-sep?step=0`;
    dispatch(setRoute(createUrl));
  };
  
  export const getTFCDetailsView = (isReview = true) => {
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
              labelName: "Task Force Committee",
              labelKey: "NULM_SEP_TASK_FORCE_COMMITTEE_HEADER"
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
        taskCommitteeApprovedAmount: getLabelWithValue(
          {
            labelName: "Amount approved by task force committee",
            labelKey: "NULM_SEP_AMOUNT_APPOVED_BY_TFC"
          },
          { jsonPath: "NULMSEPRequest.taskCommitteeApprovedAmount" }
        ),
        taskCommitteeRemark: getLabelWithValue(
          {
            labelName: "Task force committee remarks",
            labelKey: "NULM_SEP_REMARK_BY_TFC"
          },
          { jsonPath: "NULMSEPRequest.taskCommitteeRemark" }
        ),
        taskCommitteeActionDate: getLabelWithValue(
          { labelName: "Task committee Action Date", 
           labelKey: "NULM_SEP_DATE_BY_TCF" },
          { jsonPath: "NULMSEPRequest.taskCommitteeActionDate" }
        ),
        taskCommitteeStatus: getLabelWithValue(
          {
            labelName: "Status",
            labelKey: "NULM_SEP_STATUS_BY_TCF"
          },
          { jsonPath: "NULMSEPRequest.taskCommitteeStatus" }
        ), 
      }),
    });
  };
  