import { getCommonCard, getSelectField, getTextField, getDateField, getCommonTitle, getPattern, getCommonContainer } from "egov-ui-framework/ui-config/screens/specs/utils";
import { transitNumberConfig, propertyHeader } from '../applyResource/propertyDetails'
import { getDetailsFromProperty } from "../../../../../ui-utils/apply";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";

const addressHeader = getCommonTitle(
    {
        labelName: "Address Details",
        labelKey: "RP_ADDRESS_DETAILS_HEADER"
    },
    {
        style: {
                marginBottom: 18,
                marginTop: 18
        }
    }
  )

export const areaField = {
    label: {
        labelName: "Area",
        labelKey: "RP_AREA_LABEL"
    },
    placeholder: {
        labelName: "Enter Area",
        labelKey: "RP_AREA_PLACEHOLDER"
    },
    gridDefination: {
        xs: 12,
        sm: 6
    },
    minLength: 3,
    maxLength: 20,
    required: true,
  }

export const pincodeField = {
    label: {
        labelName: "Pincode",
        labelKey: "RP_PINCODE_LABEL"
    },
    placeholder: {
        labelName: "Enter Pincode",
        labelKey: "RP_PINCODE_PLACEHOLDER"
    },
    gridDefination: {
        xs: 12,
        sm: 6
    },
    minLength: 6,
    maxLength: 6,
    required: true,
  }

const getAddressDetails = () => {
    return {
        header: addressHeader,
        detailsContainer: getCommonContainer({
            area: getTextField({...areaField, jsonPath: "Properties[0].propertyDetails.address.area"}),
            pincode: getTextField({...pincodeField, jsonPath: "Properties[0].propertyDetails.address.pincode"}),
        })
    }
}

const areaNameField = {
    ...areaField,
    minLength: 1,
    maxLength: 100,
    required: true,
    jsonPath: "Properties[0].propertyDetails.address.areaName"
}

const ownershipTransitNumberField = {
    ...transitNumberConfig,
    jsonPath: "Owners[0].property.transitNumber",
    iconObj: {
        iconName: "search",
        position: "end",
        color: "#FE7A51",
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) => {
            getDetailsFromProperty(state, dispatch);
          }
        }
      },
      title: {
        value:
          "If you have already assessed your property, then please search your property by your transit Number",
        key: "If you have already assessed your property, then please search your property by your transit Number"
      },
      infoIcon: "info_circle",
      beforeFieldChange: (action, state, dispatch) => {
        dispatch(
            prepareFinalObject(
              "Owners[0].property.id",
              ""
            )
          )
        dispatch(
            prepareFinalObject(
              "Properties[0].area",
              ""
            )
          )
          dispatch(
            prepareFinalObject(
              "Properties[0].pincode",
              ""
            )
          )
      }
}

const getOwnershipAddressDetails = () => {
    return {
        header: propertyHeader,
        detailsContainer: getCommonContainer({
            ownershipTransitNumber: getTextField(ownershipTransitNumberField),
            areaName: getTextField({...areaNameField, jsonPath: "Owners[0].property.area", required: false, props: {...areaNameField.props, disabled: true}}),
            pincode: getTextField({...pincodeField, jsonPath: "Owners[0].property.pincode", required: false, props: {...pincodeField.props, disabled: true}}),
        })
    }
}

export const addressDetails = getCommonCard(getAddressDetails())
export const ownershipAddressDetails = getCommonCard(getOwnershipAddressDetails())
