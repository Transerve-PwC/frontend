import {
  getCommonGrayCard,
  getCommonSubHeader,
  getCommonContainer,
  getLabelWithValue,
  getTextField,
  getSelectField,
  getPattern,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import get from 'lodash/get';
import { prepareFinalObject,
   handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { propertySearchApiCall } from './functions';
import { handlePropertySubUsageType, handleNA } from '../../utils';

let IsEdit = process.env.REACT_APP_NAME === "Citizen"?false:true;
const displaysubUsageType = (usageType, dispatch, state) => {

  let UsageCategory = get(
          state.screenConfiguration.preparedFinalObject,
          "applyScreenMdmsData.PropertyTax.subUsageType"
        );
      let  subUsageType=[];
      UsageCategory.forEach(item=>{
        if(item.code.split(`${usageType}.`).length==2){
          subUsageType.push({
              active:item.active,
              name:item.name,
              code:item.code,
              fromFY:item.fromFY
            })
          }
      });
      if(subUsageType.length>0)
      {
        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.IDDetails.children.cardContent.children.propertyIDDetails.children.viewTwo.children.propertySubUsageType",
            "required",
            true
          )
        );
      }
      else{
        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.IDDetails.children.cardContent.children.propertyIDDetails.children.viewTwo.children.propertySubUsageType",
            "required",
            false
          )
        );
      }
          dispatch(prepareFinalObject("applyScreenMdmsData.subUsageType",subUsageType));
}
export const propertyHeader = getCommonSubHeader({
  labelKey: "WS_COMMON_PROP_DETAIL",
  labelName: "Property Details"
})

export const propertyID = getCommonContainer({
  propertyID: getTextField({
    label: { labelKey: "WS_PROPERTY_ID_LABEL" },
    placeholder: { labelKey: "WS_PROPERTY_ID_PLACEHOLDER" },
    gridDefination: { xs: 12, sm: 5, md: 5 },
    required: false,
    visible:false,
    props: {
      style: {
        width: "100%"
      }
    },
    sourceJsonPath: "applyScreen.property.propertyId",
    // title: {
    //   value: "Fill the form by searching your old approved trade license",
    //   // key: "TL_OLD_TL_NO"
    // },
    // pattern: /^[a-zA-Z0-9-]*$/i,
    //errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
    jsonPath: "searchScreen.propertyIds",
  }),
  // searchButton: {
  //   componentPath: "Button",
  //   gridDefination: { xs: 12, sm: 1, md: 1 },
  //   props: {
  //     variant: "contained",
  //     style: {
  //       color: "white",
  //       marginTop: "19px",
  //       marginBottom: "10px",
  //       marginLeft: "10px",
  //       marginRight: "10px",
  //       backgroundColor: "rgba(0, 0, 0, 0.6000000238418579)",
  //       borderRadius: "2px",
  //       width: "95%",
  //       height: "32px"
  //     }
  //   },
  //   children: {
  //     buttonLabel: getLabel({
  //       labelKey: "WS_SEARCH_CONNECTION_SEARCH_BUTTON"
  //     })
  //   },
  //   onClickDefination: {
  //     action: "condition",
  //     callBack: propertySearchApiCall
  //   },
  // },
  // clickHereLink: {
  //   uiFramework: "custom-atoms-local",
  //   moduleName: "egov-wns",
  //   componentPath: "AddLinkForProperty",
  //   props: { url: "/wns/apply" },
  //   gridDefination: { xs: 12, sm: 4, md: 4 }
  // }
})

const propertyDetails = getCommonContainer({
  // propertyType: getLabelWithValue(
  //   {
  //     labelKey: "WS_PROPERTY_TYPE_LABEL"
  //   },
  //   {
  //     jsonPath:
  //       "applyScreen.property.propertyType",
  //     callBack: handleNA,
  //     localePrefix: {
  //       moduleName: "WS",
  //       masterName: "PROPTYPE"
  //     }

  //   }
  // ),

  propertyUsageType:getSelectField({
      label: { labelKey: "WS_PROPERTY_USAGE_TYPE_LABEL_INPUT" },
      placeholder: { labelKey: "WS_PROPERTY_USAGE_TYPE_LABEL_INPUT_PLACEHOLDER" },
      required: true,
      sourceJsonPath: "applyScreenMdmsData.PropertyTax.UsageType",
      gridDefination: { xs: 12, sm: 6 },
     // errorMessage: "ERR_INVALID_BILLING_PERIOD",
      jsonPath: "applyScreen.property.usageCategory",
      props: {
        optionValue: "code",
        optionLabel: "name",
        disabled: IsEdit
      },
      beforeFieldChange: async (action, state, dispatch) => {
        displaysubUsageType(action.value, dispatch, state);
      let subUsageType=  get(state.screenConfiguration.preparedFinalObject, "applyScreenMdmsData.subUsageType",[]);
        if(subUsageType.length===0)
        {
        dispatch(prepareFinalObject("applyScreen.property.subusageCategory", action.value));
        }

       
   }
    }),
    

  propertySubUsageType: {
    ...getSelectField({
      label: { labelKey: "WS_PROPERTY_SUB_USAGE_TYPE_LABEL_INPUT" },
      placeholder: { labelKey: "WS_PROPERTY_SUB_USAGE_TYPE_LABEL_INPUT_PLACEHOLDER" },
     // required: true,
      sourceJsonPath: "applyScreenMdmsData.subUsageType",
      gridDefination: { xs: 12, sm: 6 },
     // errorMessage: "ERR_INVALID_BILLING_PERIOD",
      jsonPath: "applyScreen.property.subusageCategory",
      props: {
        optionValue: "code",
        optionLabel: "name",
        disabled: IsEdit
      }
    }),
    beforeFieldChange: async (action, state, dispatch) => {
      if(action.value)
      {
        dispatch(prepareFinalObject("applyScreen.property.usageCategory", action.value));
      }
    
    }
  },
  plotSize: {
    ...getTextField({
      label: { labelKey: "WS_PROP_DETAIL_PLOT_SIZE_LABEL_INPUT" },
      placeholder: { labelKey: "WS_PROP_DETAIL_PLOT_SIZE_LABEL_INPUT_PLACEHOLDER" },
      required: true,
      sourceJsonPath: "applyScreenMdmsData.ws-services-masters.waterSource",
      gridDefination: { xs: 12, sm: 6 },
      pattern: getPattern("numeric-only"),
      props:{
        disabled: IsEdit
      },
     // errorMessage: "ERR_INVALID_BILLING_PERIOD",
      jsonPath: "applyScreen.property.landArea"
    }),
    beforeFieldChange: async (action, state, dispatch) => {
    
    }
  },
  superBuiltUpArea: {
    ...getTextField({
      label: { labelKey: "WS_PROP_DETAIL_BUILD_UP_AREA_LABEL_INPUT" },
      placeholder: { labelKey: "WS_PROP_DETAIL_BUILD_UP_AREA_LABEL_INPUT_PLACEHOLDER" },
      required: true,
      props:{
        disabled: IsEdit
      },
     // sourceJsonPath: "applyScreenMdmsData.ws-services-masters.waterSource",
      gridDefination: { xs: 12, sm: 6 },
      pattern: getPattern("numeric-only"),
     // errorMessage: "ERR_INVALID_BILLING_PERIOD",
      jsonPath: "applyScreen.property.superBuiltUpArea"
    }),
    beforeFieldChange: async (action, state, dispatch) => {
    
    }
  },

  propertyFloornumber : {
    ...getSelectField({
      label: { labelKey: "WS_PROPERTY_FLOOR_NUMBER_LABEL_INPUT" },
      placeholder: { labelKey: "WS_PROPERTY_FLOOR_NUMBER_LABEL_INPUT_PLACEHOLDER" },
      required: true,
      sourceJsonPath: "applyScreenMdmsData.PropertyTax.Floor",
      gridDefination: { xs: 12, sm: 6 },
     // errorMessage: "ERR_INVALID_BILLING_PERIOD",
      jsonPath: "applyScreen.property.noOfFloors",
      props: {
        optionValue: "code",
        optionLabel: "name",
        disabled: IsEdit
      }
    }),
    beforeFieldChange: async (action, state, dispatch) => {
      dispatch(prepareFinalObject("applyScreen.property.address.floorNo", action.value));
    
    }
  },
  // propertyUsageType: getLabelWithValue(
  //   {
  //     labelKey: "WS_PROPERTY_USAGE_TYPE_LABEL"
  //   },
  //   {
  //     jsonPath: "applyScreen.property.usageCategory",
  //     callBack: handleNA,
  //     localePrefix: {
  //       moduleName: "WS",
  //       masterName: "PROPUSGTYPE"
  //     }
  //   }
  // ),
  // propertySubUsageType: getLabelWithValue(
  //   {
  //     labelKey: "WS_PROPERTY_SUB_USAGE_TYPE_LABEL",
  //     labelName: "Property Sub Usage Type"
  //   },
  //   {
  //     jsonPath: "applyScreen.property.units[0].usageCategory",
  //     callBack: handlePropertySubUsageType,
  //     localePrefix: {
  //       moduleName: "WS",
  //       masterName: "PROPSUBUSGTYPE"
  //     }
  //   }
  // ),
  // plotSize: getLabelWithValue(
  //   {
  //     labelKey: "WS_PROP_DETAIL_PLOT_SIZE_LABEL"
  //   },
  //   {
  //     jsonPath: "applyScreen.property.landArea",
  //     callBack: handleNA

  //   }
  // ),
  // numberOfFloors: getLabelWithValue(
  //   {
  //     labelKey: "WS_PROPERTY_NO_OF_FLOOR_LABEL",
  //     labelName: "Number Of Floors"
  //   },
  //   {
  //     jsonPath: "applyScreen.property.noOfFloors",
  //     callBack: handleNA
  //   }
  // ),
  // rainwaterHarvestingFacility: getLabelWithValue(
  //   {
  //     labelKey: "WS_SERV_DETAIL_CONN_RAIN_WATER_HARVESTING_FAC",
  //     labelName: "Rainwater Harvesting Facility"
  //   },
  //   {
  //     jsonPath: "applyScreen.property.rainWaterHarvesting",
  //     callBack: handleNA
  //   }
  // )
})



export const getPropertyIDDetails = (isEditable = true) => {
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
        }
      }
    },
    viewTwo: propertyDetails
  });
};


