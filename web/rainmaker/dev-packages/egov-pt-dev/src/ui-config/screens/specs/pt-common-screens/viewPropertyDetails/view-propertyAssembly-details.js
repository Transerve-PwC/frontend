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

export const getpropertyAssemblyDetailsView = (isReview = true) => {
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
            labelName: "Property Details",
            labelKey: "PT_COMMON_PROPERTY_DETAILS_HEADER"
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
      propertyType: getLabelWithValue(
        {
          labelName: "Property Type",
          labelKey: "PT_COMMON_PROPERTY_TYPE"
        },
        { jsonPath: "Properties[0].propertyType" }
      ),
      totalLandArea: getLabelWithValue(
        {
          labelName: "Total Land Area",
          labelKey: "PT_COMMON_TOTAL_LAND_AREA"
        },
        { jsonPath: "Properties[0].landArea" }
      ),
      totalConstructedArea: getLabelWithValue(
        {
          labelName: "Total Constructed Area",
          labelKey: "PT_COMMON_TOTAL_CONSTRUCTED_AREA"
        },
        { jsonPath: "Properties[0].totalConstructedArea" }
      ),
    }),
  });
};
