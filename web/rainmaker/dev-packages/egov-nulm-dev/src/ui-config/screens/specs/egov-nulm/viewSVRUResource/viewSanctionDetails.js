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
  
  export const getSanctionDetailsView = (isReview = true) => {
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
              labelName: "Sanction Details",
              labelKey: "NULM_SEP_SANCTION_DETAILS"
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
        sanctionDate: getLabelWithValue(
          {
            labelName: "Sanction Date",
            labelKey: "NULM_SEP_SANCTION_DATE"
          },
          { jsonPath: "NULMSEPRequest.sanctionDate" }
        ),
        sanctionRemarks: getLabelWithValue(
          {
            labelName: "Sanction Remarks",
            labelKey: "NULM_SEP_SANCTION_REMARK"
          },
          { jsonPath: "NULMSEPRequest.sanctionRemarks" }
        ),
      }),
    });
  };
  