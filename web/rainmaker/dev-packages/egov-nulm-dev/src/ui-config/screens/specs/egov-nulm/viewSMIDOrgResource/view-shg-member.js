import {
    getCommonContainer,
    getCommonGrayCard,
    getCommonSubHeader,
    getLabel,
    getLabelWithValue
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
  import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
  const indentNumber = getQueryArg(window.location.href, "indentNumber");
  const gotoCreatePage = (state, dispatch) => {
    let createUrl="";
    if(indentNumber)
     createUrl = `/egov-store-asset/create-purchase-order?indentNumber=${indentNumber}&step=2`;
     else
     createUrl = `/egov-store-asset/create-purchase-order?step=2`;
    dispatch(setRoute(createUrl));
  };
  
  const assignmentCard = {
    uiFramework: "custom-containers",
    componentPath: "MultiItem",
    props: {
      className: "review-hr",
      scheama: getCommonGrayCard({
        memberDetailsCardContainer: getCommonContainer({
            applicationId: getLabelWithValue(
            {
              labelName: "Member Id",
              labelKey: "NULM_SHG_MEMBER_ID"
            },
            { jsonPath: "NulmShgRequest.smidShgMemberApplication[0].applicationId" }
          ),
          name: getLabelWithValue(
            {
              labelName: "Member Name",
              labelKey: "NULM_SHG_MEMBER_NAME"
            },
            { jsonPath: "NulmShgRequest.smidShgMemberApplication[0].name" }
          ),
          applicationStatus: getLabelWithValue(
            {
              labelName: "Status",
              labelKey: "NULM_SHG_MEMBER_STATUS"
            },
            { jsonPath: "NulmShgRequest.smidShgMemberApplication[0].applicationStatus" }
          ),
          viewDetail: {
            uiFramework: "custom-atoms-local",
            moduleName: "egov-nulm",
            componentPath: "ViewMemberLinkContainer",
            props: {
              urlLink: `view-shg-member`,
              visibility: "hidden",
              labelText:"NULM_SHG_MEMBER_VIEW_DETAIL",
              jsonPath: "NulmShgRequest.smidShgMemberApplication[0].applicationId",
            },
            visible: true
          },
        })
      }),
  
      items: [],
      hasAddItem: false,
      isReviewPage: true,
      sourceJsonPath: "NulmShgRequest.smidShgMemberApplication",
      prefixSourceJsonPath:
        "children.cardContent.children.memberDetailsCardContainer.children",
      afterPrefixJsonPath: "children.value.children.key"
    },
    type: "array"
  };
  
  export const getmemberDetailsView = (isReview = true) => {
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
              labelName: "SHG Members",
              labelKey: "NULM_SMID_SHG_MEMBER_HEADER"
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
  