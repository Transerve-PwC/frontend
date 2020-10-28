import {
  getCommonCard,
  getCommonContainer,
  getCommonTitle,
  getTextField,
  getSelectField
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  prepareFinalObject
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import "./index.css";
import { httpRequest } from "../../../../../ui-utils/api";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { fetchLocalizationLabel } from "egov-ui-kit/redux/app/actions";
import { getLocale } from "egov-ui-kit/utils/localStorageUtils";


export const propertyLocationDetails = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Mutation Details",
      labelKey: "PT_COMMON_PROPERTY_LOCATION_DETAILS"
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),
  propertyLocationDetailsContainer: getCommonContainer({

    city: getTextField({
      label: {
        labelKey: "PT_COMMON_CITY"
      },
      placeholder: {
        labelKey: "PT_COMMON_CITY_PLACEHOLDER"
      },
      gridDefination: {
        xs: 12,
        sm: 6
      },
      props: {
        disabled :true,
       },
      required: true,
      jsonPath: "Properties[0].address.city",//db sake
    //  errorMessage: "PT_COMMON_ERR_INVALID_DOOR_NO",
     
    }),
    localityOrMohalla: getTextField({
      label: {
        labelKey: "PT_COMMON_LOCALITY_OR_MOHALLA"
      },
      placeholder: {
        labelKey: "PT_COMMON_LOCALITY_OR_MOHALLA_PLACEHOLDER"
      },
      gridDefination: {
        xs: 12,
        sm: 6
      },
      props: {
        disabled :true,
       },
      required: true,
      pattern: /^[a-zA-Z0-9-]*$/i,
    //  errorMessage: "PT_COMMON_ERR_INVALID_DOOR_NO",
      jsonPath: "Properties[0].address.locality.name"
    }),
    doorNo: getTextField({
      label: {
        labelKey: "PT_COMMON_DOOR_NO_LABEL"
      },
      placeholder: {
        labelKey: "PT_COMMON_SEARCH_DOOR_NO_PLACEHOLDER"
      },
      gridDefination: {
        xs: 12,
        sm: 6
      },
      props: {
        disabled :true,
       },
      required: true,
      pattern: /^[a-zA-Z0-9-]*$/i,
      errorMessage: "PT_COMMON_ERR_INVALID_DOOR_NO",
      jsonPath: "Properties[0].address.doorNo"
    }),
    // buildingOrColonyName: getTextField({
    //   label: {
    //     labelKey: "PT_COMMON_BUILDING_COLONY_LABEL"
    //   },
    //   placeholder: {
    //     labelKey: "PT_COMMON_SEARCH_BUILDING_COLONY_PLACEHOLDER"
    //   },
    //   gridDefination: {
    //     xs: 12,
    //     sm: 6
    //   },
    //   required: true,
    //   pattern: /^[a-zA-Z0-9-]*$/i,
    //   errorMessage: "PT_COMMON_ERR_INVALID_BUILDING_COLONY",
    //   jsonPath: "Property.address.buildingName"
    // })
  })
});
