import {
    getCommonGrayCard,
    getCommonSubHeader,
    getCommonContainer,
    getTextField,
    getSelectField,
    getPattern,
    getLabelWithValue,
    getLabel
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import get from "lodash/get";
import set from 'lodash/set';
import { prepareFinalObject, handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import { changeStep } from "../viewBillResource/footer";
  let IsEdit = process.env.REACT_APP_NAME === "Citizen"?false:true;
  // const getHeader = label => {
  //   return {
  //     uiFramework: "custom-molecules-local",
  //     moduleName: "egov-wns",
  //     componentPath: "DividerWithLabel",
  //     props: {
  //       className: "hr-generic-divider-label",
  //       labelProps: {},
  //       dividerProps: {},
  //       label
  //     },
  //     type: "array"
  //   };
  // };
  
  // const properyDetailsHeader = getHeader({
  //   labelKey: "WS_COMMON_PROP_DETAIL_HEADER"
  // });
  // const propertyLocationDetailsHeader = getHeader({
  //   labelKey: "WS_COMMON_PROP_LOC_DETAIL_HEADER"
  // });
  
  // const propertyDetails = getCommonContainer({
  //   propertyType: getLabelWithValue(
  //     {
  //       labelKey: "WS_PROPERTY_TYPE_LABEL"
  //     },
  //     {
  //       jsonPath:
  //       "WaterConnection[0].property.propertyTypeData"
  //     }
  //   ),
  //   propertyUsageType: getLabelWithValue(
  //     {
  //       labelKey: "WS_PROPERTY_USAGE_TYPE_LABEL"
  //     },
  //     { jsonPath: "WaterConnection[0].property.usageCategory" }
  //   ),
  //   plotSize: getLabelWithValue(
  //     {
  //       labelKey: "WS_PROP_DETAIL_PLOT_SIZE_LABEL"
  //     },
  //     {
  //       jsonPath: "WaterConnection[0].property.landArea"
  //     }
  //   )
  // })
  
  // const locationOnMap = WaterConnection[0].property.address.locality.code + WaterConnection[0].property.address.locality.code
  
  export const propertyLocationDetails = getCommonContainer({
    // city: getLabelWithValue(
    //   {
    //     labelKey: "WS_PROP_DETAIL_CITY"
    //   },
    //   {
    //     jsonPath: "applyScreen.property.address.city",
    //   }
    // ),
    city: {
      ...getTextField({
        label: { labelKey: "WS_PROP_DETAIL_CITY_INPUT" },
        placeholder: { labelKey: "WS_PROP_DETAIL_CITY_INPUT_PLACEHOLDER" },
        required: false,
       // sourceJsonPath: "applyScreenMdmsData.City",
        gridDefination: { xs: 12, sm: 6 },
       // errorMessage: "ERR_INVALID_BILLING_PERIOD",
        jsonPath: "applyScreen.property.address.city",
        props: {
          // optionValue: "code",
          // optionLabel: "name",
          disabled: true
        },
      }),
      beforeFieldChange: async (action, state, dispatch) => {
      
      }
    },
    locality: {
      ...getTextField({
      uiFramework: "custom-containers-local",
      moduleName: "egov-wns",
      componentPath: "AutosuggestContainer",
      jsonPath: "applyScreen.property.address.locality.code",
      required: true,
      props: {
        optionLabel: "name",
        optionValue: "code",
        disabled: IsEdit,
        style: {
          width: "100%",
          cursor: "pointer"
        },
        label: { labelName: "Sector/Locality", labelKey: "WS_PROP_DETAIL_LOCALITY_MOHALLA_LABEL_INPUT" },
        placeholder: {
          labelName: "Select Sector/Locality",
          labelKey: "WS_PROP_DETAIL_LOCALITY_MOHALLA_LABEL_INPUT_PLACEHOLDER"
        },
       
       // sourceJsonPath: "applyScreenMdmsData.ws-services-locality",
        sourceJsonPath: "applyScreenMdmsData.ws-services-masters.sectorList",
        labelsFromLocalisation: true,
        suggestions: [],
        fullwidth: true,
        required: true,
        inputLabelProps: {
          shrink: true
        },
        // localePrefix: {
        //   moduleName: "ACCESSCONTROL_ROLES",
        //   masterName: "ROLES"
        // },
        isMulti: false,
      },
      gridDefination: {
        xs: 12,
        sm: 6
      }
    }),
    beforeFieldChange: async (action, state, dispatch) => {
      if(action.value)
      {
        //alert(action.value)
        let sectorList = get(
          state.screenConfiguration.preparedFinalObject,
          "applyScreenMdmsData.ws-services-masters.sectorList",
          []
        );
        sectorList = sectorList.filter(x=>x.code === action.value.value);
        if(sectorList && sectorList[0])
        {
          dispatch(prepareFinalObject("applyScreen.subdiv", sectorList[0].subdivision));
          dispatch(prepareFinalObject("applyScreen.property.address.locality.name", action.value.label));
        }
      }
      
    }
    },
    // plotOrHouseOrSurveyNo: getLabelWithValue(
    //   {
    //     labelKey: "WS_PROP_DETAIL_DHNO",
    //     labelName:"Door/House No."
    //   },
    //   {
    //     jsonPath: "applyScreen.property.address.doorNo",
    //   }
    // ),
    plotOrHouseOrSurveyNo: {
      ...getTextField({
        label: { labelKey: "WS_PROP_DETAIL_DHNO_INPUT" },
        placeholder: { labelKey: "WS_PROP_DETAIL_DHNO_INPUT_PLACEHOLDER" },
        required: true,
        props:{
          disabled: IsEdit,
        },
       // sourceJsonPath: "applyScreenMdmsData.ws-services-masters.waterSource",
        gridDefination: { xs: 12, sm: 6 },
       // errorMessage: "ERR_INVALID_BILLING_PERIOD",
        jsonPath: "applyScreen.property.address.doorNo",
        pattern: getPattern("alpha-numeric-with-space-and-newline"),
      }),
      beforeFieldChange: async (action, state, dispatch) => {
      
      }
    },
    // buildingOrColonyName: getLabelWithValue(
    //   {
    //     labelKey: "WS_PROP_DETAIL_BUILD_NAME_LABEL"
    //   },
    //   {
    //     jsonPath: "applyScreen.property.address.buildingName"
    //   }
    // ),
    buildingOrColonyName: {
      ...getTextField({
        label: { labelKey: "WS_PROP_DETAIL_BUILD_NAME_LABEL_INPUT" },
        placeholder: { labelKey: "WS_PROP_DETAIL_BUILD_NAME_LABEL_INPUT_PLACEHOLDER" },
        required: true,  
        props:{
          disabled: IsEdit,
        } ,    
        gridDefination: { xs: 12, sm: 6 },
       // errorMessage: "ERR_INVALID_BILLING_PERIOD",
        jsonPath: "applyScreen.property.address.buildingName"
      }),
      beforeFieldChange: async (action, state, dispatch) => {
      
      }
    },
    // streetName: getLabelWithValue(
    //   {
    //     labelKey: "WS_PROP_DETAIL_STREET_NAME"
    //   },
    //   {
    //     jsonPath: "applyScreen.property.address.street"
    //   }
    // ),
    streetName: {
      ...getTextField({
        label: { labelKey: "WS_PROP_DETAIL_STREET_NAME_INPUT" },
        placeholder: { labelKey: "WS_PROP_DETAIL_STREET_NAME_INPUT_PLACEHOLDER" },
        required: true,
       props:{
        disabled: IsEdit,
       },
        gridDefination: { xs: 12, sm: 6 },
       // errorMessage: "ERR_INVALID_BILLING_PERIOD",
        jsonPath: "applyScreen.property.address.street"
      }),
      beforeFieldChange: async (action, state, dispatch) => {
      
      }
    },
    // locality: getLabelWithValue(
    //   {
    //     labelKey: "WS_PROP_DETAIL_LOCALITY_MOHALLA_LABEL",
    //     labelName:"Locality/Mohalla"
    //   },
    //   {
    //     jsonPath: "applyScreen.property.address.locality.name",
    //   }
    // ),
    // locality: {
    //   ...getSelectField({
    //     label: { labelKey: "WS_PROP_DETAIL_LOCALITY_MOHALLA_LABEL_INPUT" },
    //     placeholder: { labelKey: "WS_PROP_DETAIL_LOCALITY_MOHALLA_LABEL_INPUT_PLACEHOLDER" },
    //     required: true,
    //     sourceJsonPath: "applyScreenMdmsData.ws-services-locality",
    //     gridDefination: { xs: 12, sm: 6 },
    //    // errorMessage: "ERR_INVALID_BILLING_PERIOD",
    //     jsonPath: "applyScreen.property.address.locality.name"
    //   }),
    //   beforeFieldChange: async (action, state, dispatch) => {
      
    //   }
    // },

    // pincode: getLabelWithValue(
    //   {
    //     labelKey: "WS_PROP_DETAIL_PINCODE"
    //   },
    //   { jsonPath: "applyScreen.property.address.pincode" }
    // ),
    pincode: {
      ...getTextField({
        label: { labelKey: "WS_PROP_DETAIL_PINCODE_INPUT" },
        placeholder: { labelKey: "WS_PROP_DETAIL_PINCODE_INPUT_PLACEHOLDER" },
        required: false,
        props:{
          disabled: IsEdit,
        },
        pattern: getPattern("Pincode"),
        gridDefination: { xs: 12, sm: 6 },
       // errorMessage: "ERR_INVALID_BILLING_PERIOD",
        jsonPath: "applyScreen.property.address.pincode"
      }),
      beforeFieldChange: async (action, state, dispatch) => {
      
      }
    },
    // ExistingPropertyId: getLabelWithValue(
    //   {
    //     labelKey: "WS_PROPERTY_EXIST_ID_LABEL",
    //     labelName:"Existing Property ID"
    //   },
    //   { jsonPath: "applyScreen.property.oldPropertyId" }
    // ), 
   })
  
  export const getPropertyDetails = (isEditable = true) => {
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
            },
            ...getCommonSubHeader({
              labelKey: "WS_COMMON_PROP_LOC_DETAIL_HEADER",
              labelName:"Property Location Details"
            })
          },
          // editSection: {
          //   componentPath: "Button",
          //   props: {
          //     color: "primary"
          //   },
          //   visible: isEditable,
          //   gridDefination: {
          //     xs: 12,
          //     sm: 2,
          //     align: "right"
          //   },
          //   children: {
          //     editIcon: {
          //       uiFramework: "custom-atoms",
          //       componentPath: "Icon",
          //       props: {
          //         iconName: "edit"
          //       }
          //     },
          //     buttonLabel: getLabel({
          //       labelName: "Edit",
          //       labelKey: "TL_SUMMARY_EDIT"
          //     })
          //   },
          //   onClickDefination: {
          //     action: "condition",
          //     callBack: (state, dispatch) => {
          //       changeStep(state, dispatch, "", 1);
          //     }
          //   }
          // }
        }
      },
      // viewOne: properyDetailsHeader,
      // viewTwo: propertyDetails,
      // viewThree: propertyLocationDetailsHeader,
      viewFour: propertyLocationDetails
    });
  };
  
  
  