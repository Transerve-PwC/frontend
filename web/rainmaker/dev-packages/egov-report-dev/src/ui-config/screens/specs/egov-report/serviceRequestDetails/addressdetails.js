import { getBreak, getCommonCard, getCommonContainer, getCommonTitle, getPattern, getSelectField, getTextField } from "egov-ui-framework/ui-config/screens/specs/utils";


const getMapLocator = textSchema => {
  return {
    uiFramework: "custom-molecules-local",
    moduleName: "egov-hc",
    componentPath: "MapLocator",
    props: {}
  };
};

export const addressdetails =  getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Address Details",
      labelKey: "Address Details"
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),


  break: getBreak(),
  addressdetailsContainer: getCommonContainer({
  location:{
    ...getTextField({
       label:{
          labelName:"Location",
          labelKey:"HC_LOCATION_LABEL"
       },
       placeholder:{
          labelName:"Location",
          labelKey:"HC_LOCATION_LABEL_PLACEHOLDER"
       },
       gridDefination: {
        xs: 12,
        sm: 12,
        md: 12,
        lg:12
      },
      //  required:true,
      pattern:getPattern("BuildingStreet"),
       errorMessage:"ERR_DEFAULT_INPUT_FIELD_MSG",
       jsonPath:"SERVICEREQUEST.address"
    })
  },
  locality: {
    ...getSelectField({
      label: {
        labelName: "Locality/Mohalla",
        labelKey: "HC_LOCALITY_MOHALLA_LABEL"
      },     
      optionLabel: "name",
      optionValue: "name",
      placeholder: {
        labelName: "Locality/Mohalla",
        labelKey: "HC_LOCALITY_MOHALLA_LABEL_PLACEHOLDER"
      },
      gridDefination: {
        xs: 12,
        sm: 12,
        md: 12,
        lg:12
      },
      sourceJsonPath: "applyScreenMdmsData.RAINMAKER-PGR.Sector",
      jsonPath: "SERVICEREQUEST.mohalla",
      errorMessage:"ERR_DEFAULT_INPUT_FIELD_MSG",
      required: true,
        props: {
          className: "applicant-details-error",
          required: true
          // disabled: true
        },
      
    })
  },
  houseno:{
      ...getTextField({
         label:{
            labelName:"House No. and Street Name",
            labelKey:"HC_HOUSE_NO_STREET_NAME_LABEL"
         },
         placeholder:{
            labelName:"House no and Street Name",
            labelKey:"HC_HOUSE_NO_STREET_NAME_LABEL_PLACEHOLDER"
         },
         gridDefination: {
          xs: 12,
          sm: 12,
          md: 12,
          lg:12
        },
        //  required:true,
        pattern:getPattern("BuildingStreet"),
         errorMessage:"ERR_DEFAULT_INPUT_FIELD_MSG",
         jsonPath:"SERVICEREQUEST.houseNoAndStreetName"
      })
    },
    // SILocationDetailsConatiner: getCommonContainer({
    //   propertyGisCoordinates:
    //   {
    //     uiFramework: "custom-atoms",
    //     componentPath: "Div",
    //     props: {
    //       className: "gis-div-css",
    //       style: {
    //         width: "100%",
    //         cursor: "pointer"
    //       },
    //       jsonPath:
    //         "SERVICEREQUEST.latitude"
    //     },
    //     jsonPath: "SERVICEREQUEST.latitude",
    //     onClickDefination: {
    //       action: "condition",
    //       callBack: showHideMapPopup
    //     },
    //     gridDefination: {
    //       xs: 12,
    //       sm: 6
    //     },
    //     children: {
    //       gisTextField: {
    //         ...getTextField({
    //           label: {
    //             labelName: "Locate on Map",
    //             labelKey: "HC_VIOLATION_DETAILS_GIS_CORD_LABEL"
    //           },
    //           placeholder: {
    //             labelName: "Select your property location on map",
    //             labelKey: "EC_VIOLATION_DETAILS_GIS_CORD_PLACEHOLDER"
    //           },
    //           jsonPath:
    //             "SERVICEREQUEST.latitude",
    //           iconObj: {
    //             iconName: "gps_fixed",
    //             position: "end"
    //           },
    //           gridDefination: {
    //             xs: 12,
    //             sm: 12
    //           },
    //           props: {
    //             disabled: true,
    //             cursor: "pointer",
    //             jsonPath:
    //               "SERVICEREQUEST.latitude"
    //           }
    //         })
    //       }
    //     }
    //   }
    // }),
    landmark:{
      ...getTextField({
         label:{
            labelName:"Landmark",
            labelKey:"HC_LANDMARK_LABEL"
         },
         placeholder:{
            labelName:"Landmark",
            labelKey:"HC_LANDMARK_LABEL_PLACEHOLDER"
         },
         gridDefination: {
          xs: 12,
          sm: 12,
          md: 12,
          lg:12
        },
        //  required:true,
        pattern:getPattern("BuildingStreet"),
         errorMessage:"Invalid Landmark",
         jsonPath:"SERVICEREQUEST.landmark"
      })

    },
    mapsDialog: {
      componentPath: "Dialog",
      props: {
        open: false
      },
      children: {
        dialogContent: {
          componentPath: "DialogContent",
          children: {
            popup: getMapLocator()
          }
        }
      }

    },
  })
});
