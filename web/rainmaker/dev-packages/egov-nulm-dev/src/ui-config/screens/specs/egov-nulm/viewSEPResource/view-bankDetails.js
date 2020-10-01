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
  
  export const getBankToProcessDetailsView = (isReview = true) => {
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
              labelName: "Bank Details for Processing",
              labelKey: "NULM_SEP_BANK_DETAILS_FOR_PROCESSING"
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
        committeeBankName: getLabelWithValue(
          {
            labelName: "Bank Name (Only in Chandigarh)",
            labelKey: "NULM_SEP_BANK_NAME"
          },
          { jsonPath: "NULMSEPRequest.committeeBankName" }
        ),
        committeeBranchName: getLabelWithValue(
          {
            labelName: "Branch Name",
            labelKey: "NULM_SEP_BRANCH_NAME"
          },
          { jsonPath: "NULMSEPRequest.committeeBranchName" }
        ),
        applicationForwardedOnDate: getLabelWithValue(
          { labelName: "Application forwarded to Bank On", 
           labelKey: "NULM_SEP_APPLICATION_FORWD_BANK_DATE" },
          { jsonPath: "NULMSEPRequest.applicationForwardedOnDate" }
        ),
      }),
    });
  };
  