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
     const createUrl = `/egov-nulm/log-maintenance?step=0`;
    dispatch(setRoute(createUrl));
  };
  
  export const getpropertyOwnerDetailsView = (isReview = true) => {
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
              labelName: "Owner Information Details",
              labelKey: "PT_COMMON_OWNER_INFORMATION"
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
        mobileNumber: getLabelWithValue(
          {
            labelName: "Mobile No.",
            labelKey: "PT_COMMON_APPLICANT_MOBILE_NO_LABEL"
          },
          { jsonPath: "Properties[0].owners[0].mobileNumber" }
        ),
        applicantName: getLabelWithValue(
          {
            labelName: "Name",
            labelKey: "PT_COMMON_APPLICANT_NAME_LABEL"
          },
          { jsonPath: "Properties[0].owners[0].name" }
        ),
        guardianName: getLabelWithValue(
          {
            labelName: "Father/Husband's Name",
            labelKey: "PT_COMMON_FATHER_OR_HUSBAND_NAME"
          },
          { jsonPath: "Properties[0].owners[0].fatherOrHusbandName" }
        ),
        applicantAddress: getLabelWithValue(
            {
              labelName: "Correspondence Address",
              labelKey: "PT_COMMON_CORRESPONDENCE_ADDRESS_LABEL"
            },
            { jsonPath: "Properties[0].owners[0].correspondenceAddress" }
          ),
      }),
    });
  };
  