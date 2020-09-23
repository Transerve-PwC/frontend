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


  const ConnectionConversionDetails = getCommonContainer({
    connectionUsagesType: getSelectField({
        label: { labelKey: "WS_CONN_CONVERSION_USAGE_TYPE" },
        //sourceJsonPath: "applyScreenMdmsData.ws-services-calculation.pipeSize",
        placeholder: { labelKey: "WS_CONN_CONVERSION_USAGE_TYPE_PLACEHOLDER" },
        required: true,
        gridDefination: { xs: 12, sm: 6 },
        jsonPath: "WaterConnection[0].connectionUsagesType",
        props: {
            optionValue: "code",
            optionLabel: "name",
          data:
          [
            {
              "id": 1,
              "code": "DOMESTIC",
              "name": "Domestic"
            },
            {
              "id": 2,
              "code": "COMMERCIAL",
              "name": "Commercial"
            }
          ]
        },
      }),
  });

export const ConnectionConversionHeader = getCommonSubHeader({
       labelKey: "WS_COMMON_CONNECTION_CONVERSION_HEADER",
      labelName: "Connection Conversion Detail"
 })
  
export const getConnectionConversionDetails = (isEditable = true) => {
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
    ConnectionConversionDetails: ConnectionConversionDetails
  });
};