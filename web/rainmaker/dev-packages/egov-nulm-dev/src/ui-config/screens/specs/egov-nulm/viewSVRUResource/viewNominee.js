import {
    getCommonContainer,
    getCommonGrayCard,
    getCommonSubHeader,
    getLabel,
    getLabelWithValue
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
  import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
  import { checkValueForNA } from "../../utils";
  const gotoCreatePage = (state, dispatch) => {
    const createUrl = `/egov-nulm/create-svru?step=1`;
    dispatch(setRoute(createUrl));
  };
  
  const assignmentCard = {
    uiFramework: "custom-containers",
    componentPath: "MultiItem",
    props: {
      className: "review-hr",
      scheama: getCommonGrayCard({
        nomineeDetailsCardContainer: getCommonContainer({
            name: getLabelWithValue(
            {
              labelName: "Name",
              labelKey: "NULM_SUH_LOG_NAME"
            },
            { jsonPath: "NulmSusvRenewRequest.susvApplicationFamilyDetails[0].name",
          callBack:checkValueForNA }
          ),
          age: getLabelWithValue(
            { labelName: "Age", labelKey: "NULM_SEP_AGE" },
            {
              jsonPath: "NulmSusvRenewRequest.susvApplicationFamilyDetails[0].age", 
              callBack:checkValueForNA   
            }
          ),
          relation: getLabelWithValue(
            {
              labelName: "Relation",
              labelKey: "NULM_SUSV_RELATION"
            },
            { jsonPath: "NulmSusvRenewRequest.susvApplicationFamilyDetails[0].relation",
            callBack:checkValueForNA }
          ),
     
        })
      }),
  
      items: [],
      hasAddItem: false,
      isReviewPage: true,
      sourceJsonPath: "NulmSusvRenewRequest.susvApplicationFamilyDetails",
      prefixSourceJsonPath:
        "children.cardContent.children.nomineeDetailsCardContainer.children",
      afterPrefixJsonPath: "children.value.children.key"
    },
    type: "array"
  };
  
  export const getNomineeDetailsView = (isReview = true) => {
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
              labelName: "Nominee Details",
              labelKey: "NULM_SUSV_NOMINEE_DETAILS"
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
      viewOne: assignmentCard
    });
  };
  