import { getCommonCard, getSelectField, getTextField, getDateField, getCommonTitle, getPattern, getCommonContainer } from "egov-ui-framework/ui-config/screens/specs/utils";
import { transitNumberLookUp, propertyHeader, pincodeField } from '../applyResource/propertyDetails'
import { getDetailsFromProperty,getDetailsFromPropertyMortgage,getDetailsFromPropertyTransit } from "../../../../../ui-utils/apply";
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
  const commentsHeader = getCommonTitle(
    {
        labelName: "Transit Site Comments",
        labelKey: "RP_TRANSITSIT_COMMENTS_HEADER"
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
    labelName: "Colony Name",
    labelKey: "RP_COLONY_NAME_LABEL"
},
placeholder: {
    labelName: "Enter Colony Name",
    labelKey: "RP_COLONY_NAME_PLACEHOLDER"
},
    gridDefination: {
        xs: 12,
        sm: 6
    },
    minLength: 3,
    maxLength: 100,
    required: true,
    errorMessage: "RP_ERR_AREA_FIELD",
  }

  export const commentsField = {
    label: {
        labelName: "Comments",
        labelKey: "RP_TRANSIT_COMMENTS_LABEL"
    },
    placeholder: {
        labelName: "Enter Comments for Transit Site",
        labelKey: "RP_TRANSIT_COMMENTS_PLACEHOLDER"
    },
    gridDefination: {
        xs: 12,
        sm: 6
    },
    props:{
      multiline: true,
      rows: "4"
  },
  visible: true,
    // minLength: 1,
    // maxLength: 1000,
    required: true,
    errorMessage: "RP_ERR_COMMENTS_FIELD",
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
    ...transitNumberLookUp,
    jsonPath: "Owners[0].property.transitNumber",
    iconObj: {
        ...transitNumberLookUp.iconObj,
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) => {
            getDetailsFromProperty(state, dispatch);
          }
        }
      },
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

const mortgageTransitNumberField = {
  ...transitNumberLookUp,
  jsonPath: "MortgageApplications[0].property.transitNumber",
  iconObj: {
      ...transitNumberLookUp.iconObj,
      onClickDefination: {
        action: "condition",
        callBack: (state, dispatch) => {
          getDetailsFromPropertyMortgage(state, dispatch);
        }
      }
    },
    beforeFieldChange: (action, state, dispatch) => {
      dispatch(
          prepareFinalObject(
            "MortgageApplications[0].property.id",
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

const TransitsiteTransitNumberField = {
  ...transitNumberLookUp,
  jsonPath: "PropertyImagesApplications[0].property.transitNumber",
  iconObj: {
      ...transitNumberLookUp.iconObj,
      onClickDefination: {
        action: "condition",
        callBack: (state, dispatch) => {
          getDetailsFromPropertyTransit(state, dispatch);
        }
      }
    },
    beforeFieldChange: (action, state, dispatch) => {
      dispatch(
          prepareFinalObject(
            "PropertyImagesApplications[0].property.id",
            ""
          )
        )
      dispatch(
          prepareFinalObject(
            "PropertyImagesApplications[0].property.area",
            ""
          )
        )
        dispatch(
          prepareFinalObject(
            "PropertyImagesApplications[0].property.pincode",
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

const getOwnershipAddressDetailsMortgage = () => {
  return {
      header: propertyHeader,
      detailsContainer: getCommonContainer({
          ownershipTransitNumber: getTextField(mortgageTransitNumberField),
          areaName: getTextField({...areaNameField, jsonPath: "MortgageApplications[0].property.area", required: false, props: {...areaNameField.props, disabled: true}}),
          pincode: getTextField({...pincodeField, jsonPath: "MortgageApplications[0].property.pincode", required: false, props: {...pincodeField.props, disabled: true}}),
      })
  }
}
const getTransitSitePropertyDetails = () => {
  return {
      header: propertyHeader,
      detailsContainer: getCommonContainer({
          transitNumber: getTextField(TransitsiteTransitNumberField),
          areaName: getTextField({...areaNameField,jsonPath: "PropertyImagesApplications[0].property.area", required: false, props: {...areaNameField.props, disabled: true}}),
          pincode: getTextField({...pincodeField, jsonPath: "PropertyImagesApplications[0].property.pincode", required: false, props: {...pincodeField.props, disabled: true}}),
      })
  }
}
const getTransitSiteComments = () => {
  return {
      header: commentsHeader,
      detailsContainer: getCommonContainer({
          comments: getTextField({...commentsField,jsonPath: "PropertyImagesApplications[0].description",  props: {...commentsField.props}})
      })
  }
}



export const addressDetails = getCommonCard(getAddressDetails())
export const ownershipAddressDetails = getCommonCard(getOwnershipAddressDetails())
export const ownershipAddressDetailsMortgage = getCommonCard(getOwnershipAddressDetailsMortgage())
export const transitSitePropertyDetails = getCommonCard(getTransitSitePropertyDetails())
export const transitSiteComments = getCommonCard(getTransitSiteComments());