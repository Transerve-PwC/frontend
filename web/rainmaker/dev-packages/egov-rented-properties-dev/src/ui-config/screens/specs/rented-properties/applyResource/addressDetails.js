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
    labelName: "Locality",
    labelKey: "RP_LOCALITY_LABEL"
},
placeholder: {
    labelName: "Enter Locality",
    labelKey: "RP_LOCALITY_PLACEHOLDER"
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
  export const colonyFieldConfig = {
    label: {
        labelName: "Colony",
        labelKey: "RP_COLONY_LABEL"
    },
    placeholder: {
        labelName: "Select Colony",
        labelKey: "RP_SELECT_COLONY_PLACEHOLDER"
    },
    required: true,
    jsonPath: "Properties[0].colony",
    optionValue: "code",
    optionLabel: "label",
    sourceJsonPath: "applyScreenMdmsData.propertyTypes",
    gridDefination: {
        xs: 12,
        sm: 6
    },
    errorMessage: "RP_ERR_COLONY_FIELD",
}
const colonyFieldOwnerShip = {
  ...colonyFieldConfig,
  required:false,
  props: {
    disabled: true
  },
  jsonPath: "Owners[0].property.colony",
  beforeFieldChange: (action, state, dispatch) => {
      const rentedPropertyColonies = get(state.screenConfiguration.preparedFinalObject, "applyScreenMdmsData.rentedPropertyColonies") || []
      const findItem = rentedPropertyColonies.find(item => item.code === action.value)
      const propertyAreas = !!findItem ? findItem.area.map(item => ({
        code: item.code,
        label: item.sqyd
      })) : [];
      const rentPerSqyd = !!findItem ? findItem.costPerSqyd : ""
      dispatch(prepareFinalObject("applyScreenMdmsData.propertyAreas", propertyAreas))
      dispatch(prepareFinalObject("Properties[0].propertyDetails.rentPerSqyd", rentPerSqyd))
    }}


    const colonyFieldMortagage = {
      ...colonyFieldConfig,
      required:false,
      props: {
        disabled: true
      },
      jsonPath: "MortgageApplications[0].property.colony",
      beforeFieldChange: (action, state, dispatch) => {
          const rentedPropertyColonies = get(state.screenConfiguration.preparedFinalObject, "applyScreenMdmsData.rentedPropertyColonies") || []
          const findItem = rentedPropertyColonies.find(item => item.code === action.value)
          const propertyAreas = !!findItem ? findItem.area.map(item => ({
            code: item.code,
            label: item.sqyd
          })) : [];
          const rentPerSqyd = !!findItem ? findItem.costPerSqyd : ""
          dispatch(prepareFinalObject("applyScreenMdmsData.propertyAreas", propertyAreas))
          dispatch(prepareFinalObject("Properties[0].propertyDetails.rentPerSqyd", rentPerSqyd))
        }}


        const colonyFieldImages = {
          ...colonyFieldConfig,
          required:false,
          props: {
            disabled: true
          },
          jsonPath: "PropertyImagesApplications[0].property.colony",
          beforeFieldChange: (action, state, dispatch) => {
              const rentedPropertyColonies = get(state.screenConfiguration.preparedFinalObject, "applyScreenMdmsData.rentedPropertyColonies") || []
              const findItem = rentedPropertyColonies.find(item => item.code === action.value)
              const propertyAreas = !!findItem ? findItem.area.map(item => ({
                code: item.code,
                label: item.sqyd
              })) : [];
              const rentPerSqyd = !!findItem ? findItem.costPerSqyd : ""
              dispatch(prepareFinalObject("applyScreenMdmsData.propertyAreas", propertyAreas))
              dispatch(prepareFinalObject("Properties[0].propertyDetails.rentPerSqyd", rentPerSqyd))
            }}


  export const colonyField = {
    label: {
      labelName: "Colony",
      labelKey: "RP_COLONY_NAME_LABEL"
  },
  placeholder: {
      labelName: "Enter Colony",
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
const colonyNameField = {
  ...colonyField,
  minLength: 1,
  maxLength: 100,
  required: true,
  jsonPath: "Properties[0].propertyDetails.address.colony"
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
            //areaName: getTextField({...colonyNameField, jsonPath: "Owners[0].property.colony", required: false, props: {...colonyNameField.props, disabled: true}}),
            colony:getSelectField(colonyFieldOwnerShip),
            pincode: getTextField({...pincodeField, jsonPath: "Owners[0].property.pincode", required: false, props: {...pincodeField.props, disabled: true}}),
        })
    }
}

const getOwnershipAddressDetailsMortgage = () => {
  return {
      header: propertyHeader,
      detailsContainer: getCommonContainer({
          ownershipTransitNumber: getTextField(mortgageTransitNumberField),
         // areaName: getTextField({...colonyNameField, jsonPath: "MortgageApplications[0].property.colony", required: false, props: {...colonyNameField.props, disabled: true}}),
         colony:getSelectField(colonyFieldMortagage),
         pincode: getTextField({...pincodeField, jsonPath: "MortgageApplications[0].property.pincode", required: false, props: {...pincodeField.props, disabled: true}}),
      })
  }
}
const getTransitSitePropertyDetails = () => {
  return {
      header: propertyHeader,
      detailsContainer: getCommonContainer({
          transitNumber: getTextField(TransitsiteTransitNumberField),
         // areaName: getTextField({...colonyNameField,jsonPath: "PropertyImagesApplications[0].property.colony", required: false, props: {...colonyNameField.props, disabled: true}}),
         colony:getSelectField(colonyFieldImages),
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