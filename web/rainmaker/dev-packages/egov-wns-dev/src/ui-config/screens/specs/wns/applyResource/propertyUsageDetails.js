import {
    getCommonGrayCard,
    getCommonSubHeader,
    getCommonContainer,
    getTextField,
    getPattern,
    getLabelWithValue,
    getLabel,
    getSelectField,
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import get from 'lodash/get';
import set from "lodash/set";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";

  const displaysubUsageType = (usageType, dispatch, state) => {

    let subTypeValues = get(
            state.screenConfiguration.preparedFinalObject,
            "applyScreenMdmsData.PropertyTax.subUsageType"
          );

        let subUsage=[];
        subUsage = subTypeValues.filter(cur => {
                    return (cur.code.startsWith(usageType))
                  });
            dispatch(prepareFinalObject("propsubusagetypeForSelectedusageCategory",subUsage));
}

  const PropertyUsageDetails = getCommonContainer({
    propertyUsageType: getSelectField({
        label: { labelKey: "WS_PROPERTY_USAGE_TYPE_LABEL" },
        sourceJsonPath: "applyScreenMdmsData.PropertyTax.UsageType",
        placeholder: { labelKey: "WS_PROPERTY_USAGE_TYPE_LABEL_PLACEHOLDER" },
        required: true,
        gridDefination: { xs: 12, sm: 6 },
        jsonPath: "applyScreen.waterProperty.usageCategory",
        props: {
            optionValue: "code",
            optionLabel: "name",
        },
       beforeFieldChange: async (action, state, dispatch) => {
                    displaysubUsageType(action.value, dispatch, state);
               }
      }),

      propertySubUsageType: getSelectField({
        label: { labelKey: "WS_PROPERTY_SUB_USAGE_TYPE_LABEL" },
        sourceJsonPath: "propsubusagetypeForSelectedusageCategory",
        placeholder: { labelKey: "WS_PROPERTY_SUB_USAGE_TYPE_LABEL_PLACEHOLDER" },
        //required: true,
        gridDefination: { xs: 12, sm: 6 },
        jsonPath: "applyScreen.waterProperty.usageSubCategory",
        props: {
            optionValue: "code",
            optionLabel: "name",
        },
      }),
  });

export const PropertyUsageHeader = getCommonSubHeader({
       labelKey: "WS_COMMON_PROPERTY_USAGE_HEADER",
      labelName: "Property Usage Detail"
 })
  
export const getPropertyUsageDetails = (isEditable = true) => {
  return getCommonContainer({
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
          }
        },
      }
    },
    PropertyUsageDetails: PropertyUsageDetails
  });
};