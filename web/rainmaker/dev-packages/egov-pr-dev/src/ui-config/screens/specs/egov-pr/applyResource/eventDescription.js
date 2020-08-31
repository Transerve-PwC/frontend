import {
    getBreak,
    getCommonCard,
    getCommonContainer,
    getCommonGrayCard,
    getCommonTitle,
    getSelectField,
    getTextField,
    getPattern
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import {
    prepareFinalObject,
    handleScreenConfigurationFieldChange as handleField
  } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import get from "lodash/get";
  import "./index.css";
  
  let previousUoms = [];
  
  const dynamic = (uom, path, buildingIndex) => {
    return {
      ...getTextField({
        label: {
          labelKey: `PR_PROPERTY_DETAILS_${uom}_LABEL`
        },
        placeholder: {
          labelKey: `PR_PROPERTY_DETAILS_${uom}_PLACEHOLDER`
        },
        pattern: /^[0-9]*$/i,
        jsonPath: `PublicRelations[0].PublicRelationDetails.buildings[${buildingIndex}].uomsMap.${uom}`,
        required: false,
        props: { type: "number", className:"applicant-details-error" },
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        }
      }),
      componentJsonpath: `${path}.${uom}`
    };
  };
  
  const prepareSelectField = (uom, start, end) => {
    let data = [];
    for (let i = start; i <= end; i++) {
      data.push({ code: `${i}` });
    }
    return {
      ...getSelectField({
        label: {
          labelKey: `PR_PROPERTY_DETAILS_${uom}_LABEL`
        },
        placeholder: {
          labelKey: `PR_PROPERTY_DETAILS_${uom}_PLACEHOLDER`
        },
        pattern: /^[0-9]*$/i,
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        required: false,
        jsonPath: `PublicRelations[0].PublicRelationDetails.buildings[0].uomsMap.${uom}`,
        data: data,
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        },
        props:{
          className:"applicant-details-error"
        }
      })
    };
  };
  
  const prepareTextField = uom => {
    return {
      ...getTextField({
        label: {
          labelKey: `PR_PROPERTY_DETAILS_${uom}_LABEL`
        },
        placeholder: {
          labelKey: `PR_PROPERTY_DETAILS_${uom}_PLACEHOLDER`
        },
        pattern: /^\d{0,10}$/i,
        
      //   onInput:(e)=>{ 
      //     e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,2)
      // },
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        // required: true,
        jsonPath: `PublicRelations[0].PublicRelationDetails.buildings[0].uomsMap.${uom}`,
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        },
        props:{
          className:"applicant-details-error"
        }
      })
    };
  };
  
  const checkUomIsDefault = uom => {
    if (
      [
        "NO_OF_FLOORS",
        "NO_OF_BASEMENTS",
        "PLOT_SIZE",
        "BUILTUP_AREA",
        "HEIGHT_OF_BUILDING"
      ].indexOf(uom) >= 0
    ) {
      return true;
    }
    return false;
  };
  
  const setMandatory = (dispatch, path, value) => {
    dispatch(handleField("apply", path, "required", value));
    dispatch(handleField("apply", path, "props.required", value));
  };
  
  const commonBuildingData = buildingType => {
    let plotSize = {};
    if (buildingType === "SINGLE") {
      plotSize = {
        ...getTextField({
          label: {
            labelName: "Plot Size (in Sq meters)",
            labelKey: "PR_PROPERTY_DETAILS_PLOT_SIZE_LABEL"
          },
          placeholder: {
            labelName: "Enter Plot Size (in Sq meters)",
            labelKey: "PR_PROPERTY_DETAILS_PLOT_SIZE_PLACEHOLDER"
          },
          pattern: /^[0-9]*$/i,
          errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
          jsonPath: "PublicRelations[0].PublicRelationDetails.buildings[0].plotsize",
          gridDefination: {
            xs: 12,
            sm: 12,
            md: 6
          },
          props:{
            className:"applicant-details-error"
          }
        })
      };
    }
    return {
      buildingName: {
        ...getTextField({
          label: {
            labelName: "Name of the Building",
            labelKey: "PR_PROPERTY_DETAILS_NAME_OF_BUILDING_LABEL"
          },
          placeholder: {
            labelName: "Enter Name of the Building",
            labelKey: "PR_PROPERTY_DETAILS_NAME_OF_BUILDING_PLACEHOLDER"
          },
          required: false,
          pattern: getPattern("TradeName"),
          errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
          jsonPath: "PublicRelations[0].PublicRelationDetails.buildings[0].name",
          // props: {
          //   style: {
          //     maxWidth: "400px"
          //   }
          // },
          gridDefination: {
            xs: 12,
            sm: 12,
            md: 6
          },
          props:{
            className:"applicant-details-error"
          }
        })
      },
      dummyDiv: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        },
        props: {
          disabled: true
        }
      },
      buildingUsageType: {
        ...getSelectField({
          label: {
            labelName: "Building Usage Type as per NBC",
            labelKey: "PR_PROPERTY_DETAILS_BUILDING_USAGE_TYPE_LABEL"
          },
          placeholder: {
            labelName: "Select Building Usage Type",
            labelKey: "PR_PROPERTY_DETAILS_BUILDING_USAGE_TYPE_PLACEHOLDER"
          },
          required: false,
          localePrefix: {
            moduleName: "PublicRelation",
            masterName: "BuildingType"
          },
          jsonPath: "PublicRelations[0].PublicRelationDetails.buildings[0].usageTypeMajor",
          sourceJsonPath: "applyScreenMdmsData.DropdownsData.BuildingUsageType",
          gridDefination: {
            xs: 12,
            sm: 12,
            md: 6
          },
          props:{
            className:"applicant-details-error"
          }
        }),
        beforeFieldChange: (action, state, dispatch) => {
          let path = action.componentJsonpath.replace(
            /.buildingUsageType$/,
            ".buildingSubUsageType"
          );
          let buildingUsageTypeData = get(
            state,
            "screenConfiguration.preparedFinalObject.applyScreenMdmsData.PublicRelation.BuildingType",
            []
          );
          let buildingSubUsageTypeData = buildingUsageTypeData.filter(item => {
            return item.active && item.code.startsWith(action.value);
          });
          dispatch(
            handleField("apply", path, "props.data", buildingSubUsageTypeData)
          );
        }
      },
      buildingSubUsageType: {
        ...getSelectField({
          label: {
            labelName: "Building Usage Subtype as per NBC",
            labelKey: "PR_PROPERTY_DETAILS_BUILDING_USAGE_SUBTYPE_LABEL"
          },
          placeholder: {
            labelName: "Select Building Usage Subtype",
            labelKey: "PR_PROPERTY_DETAILS_BUILDING_USAGE_SUBTYPE_PLACEHOLDER"
          },
          required: false,
          localePrefix: {
            moduleName: "PublicRelation",
            masterName: "BuildingType"
          },
          jsonPath: "PublicRelations[0].PublicRelationDetails.buildings[0].usageType",
          gridDefination: {
            xs: 12,
            sm: 12,
            md: 6
          },
          props:{
            className:"applicant-details-error"
          }
        }),
        beforeFieldChange: (action, state, dispatch) => {
          // Get the list of uom for selected building subtype
          let uomsList = get(
            state,
            "screenConfiguration.preparedFinalObject.applyScreenMdmsData.PublicRelation.BuildingType",
            []
          ).filter(item => {
            return item.code === action.value;
          });
          let uoms = get(uomsList, "[0].uom", []);
  
          // Get the path of the current childrens
          let path = action.componentJsonpath.replace(
            /.buildingSubUsageType$/,
            ""
          );
  
          // Get the index in case on multi-item
          let buildingIndex = get(path.match(/\d+/), "[0]", 0);
  
          // Remove previous dynamic uoms
          previousUoms.forEach(uom => {
            !checkUomIsDefault(uom) &&
              dispatch(handleField("apply", `${path}.${uom}`, "visible", false));
          });
  
          // Set required fields defaults
          setMandatory(dispatch, `${path}.PLOT_SIZE`, false);
          setMandatory(dispatch, `${path}.BUILTUP_AREA`, false);
          setMandatory(dispatch, `${path}.HEIGHT_OF_BUILDING`, false);
  
          // Dynamically create UOM's based on building subtype selection
          uoms.forEach(uom => {
            if (checkUomIsDefault(uom)) {
              setMandatory(dispatch, `${path}.${uom}`, true);
            } else {
              dispatch(
                handleField("apply", path, uom, dynamic(uom, path, buildingIndex))
              );
            }
          });
  
          // Set previous uoms array
          previousUoms = uoms;
        }
      },
      NO_OF_FLOORS: prepareSelectField("NO_OF_FLOORS", 1, 20),
      NO_OF_BASEMENTS: prepareSelectField("NO_OF_BASEMENTS", 0, 5),
      PLOT_SIZE: prepareTextField("PLOT_SIZE"),
      BUILTUP_AREA: prepareTextField("BUILTUP_AREA"),
      HEIGHT_OF_BUILDING: prepareTextField("HEIGHT_OF_BUILDING")
    };
  };
  
  export const eventDescription = getCommonCard({
    header: getCommonTitle(
      {
        labelName: "Event Description",
        labelKey: "PR_EVENT_DESCRIPTION_HEADER"
      },
      
      {
        style: {
          marginBottom: 18
        } 
      }
    ),
    break: getBreak(),
    propertyDetailsConatiner: getCommonContainer({
        DescriptionOfEvent: getTextField({
        label: {
          labelName: "Description Of Event",
          labelKey: "PR_EVENT_DESCRIPTION_LABEL"
        },
        placeholder: {
          labelName: "Description Of Event",
          labelKey: "PR_EVENT_DESCRIPTION_LABEL"
        },
        gridDefination:{
xs:12,
xm:12
        },
        props:{
          
                  className:"textfield-enterable-selection",
                  multiline: true,
                  rows: "4"
                },
        required: true,
        pattern: getPattern("PREventDescription"),
        errorMessage: "PR_EVENT_DESCRIPTION_INVALID",
        jsonPath: "PublicRelation[0].CreateEventDetails.eventDescription"
      }),
     
    })
  });
  