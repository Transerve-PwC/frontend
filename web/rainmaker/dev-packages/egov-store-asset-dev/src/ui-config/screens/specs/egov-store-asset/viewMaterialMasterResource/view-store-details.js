import {
  getCommonContainer,
  getCommonGrayCard,
  getCommonSubHeader,
  getLabel,
  getLabelWithValue
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";

const gotoCreatePage = (state, dispatch) => {
  const createUrl =
  process.env.REACT_APP_SELF_RUNNING === "true"
    ? `/egov-ui-framework/egov-store-asset/creatematerialmaster?step=1`
    : `/egov-store-asset/creatematerialmaster?step=1`;
  dispatch(setRoute(createUrl));
};

const storeCard = {
  uiFramework: "custom-containers",
  componentPath: "MultiItem",
  props: {
    className: "review-hr",
    scheama: getCommonGrayCard({
      storeCardContainer: getCommonContainer({
        reviewStoreName: getLabelWithValue(
          {
            labelName: "Store Name",
            labelKey: "STORE_COMMON_TABLE_COL_STORE_NAME"
          },
          { jsonPath: "materials[0].storeMapping[0].store.code",
          
        }
        ),
        reviewDepartment: getLabelWithValue(
          {
            labelName: "Department",
            labelKey: "STORE_COMMON_TABLE_COL_DEPARTMENT"
          },
          { jsonPath: "materials[0].storeMapping[0].department.Name.Code",
          
         }
        ),
        // reviewAccountCode: getLabelWithValue(
        //   { labelName: "Account Code", labelKey: "STORE_MATERIAL_ACCOUNT_CODE" },
        //   {
        //     jsonPath: "materials[0].storeMapping[0].chartofAccount.glcode",
            
        //   }
        // ),
        Active: getLabelWithValue(
          { labelName: "Active", labelKey: "MATERIAL_TYPE_ACTIVE" },
          {
            jsonPath: "materials[0].storeMapping[0].active",
          }
        )
      })
    }),

    items: [],
    hasAddItem: false,
    isReviewPage: true,
    sourceJsonPath: "materials[0].storeMapping",
    prefixSourceJsonPath:
      "children.cardContent.children.storeCardContainer.children",
    afterPrefixJsonPath: "children.value.children.key"
  },
  type: "array"
};

export const getStoreDetailsView = (isReview = true) => {
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
            labelName: "Material Map Store Details",
            labelKey: "STORE_MATERIAL_MAP_STORE_DETAILS"
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
    viewOne: storeCard
  });
};
