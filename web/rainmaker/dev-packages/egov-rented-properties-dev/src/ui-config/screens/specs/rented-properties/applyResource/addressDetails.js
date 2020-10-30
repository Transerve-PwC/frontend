import { getCommonCard, getSelectField, getTextField, getDateField, getCommonTitle, getPattern, getCommonContainer } from "egov-ui-framework/ui-config/screens/specs/utils";
import { transitNumberLookUp, propertyHeader, pincodeField,colonyFieldDup, pincodeFieldTransitSite } from '../applyResource/propertyDetails'
import { getDetailsFromProperty,getDetailsFromPropertyMortgage,getDetailsFromPropertyTransit } from "../../../../../ui-utils/apply";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";

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
    afterFieldChange: (action, state, dispatch) => {
      if (action.value.length > 100) {
          dispatch(
              handleField(
                "apply",
                action.componentJsonpath,
                "errorMessage",
                "RP_ERR_AREA_LOCALITY_FIELD_MAXLENGTH"
              )
          )
          dispatch(
              handleField(
                "apply",
                action.componentJsonpath,
                "props.errorMessage",
                "RP_ERR_AREA_LOCALITY_FIELD_MAXLENGTH"
              )
          )
      }
      else if(action.value.length < 3){
        dispatch(
          handleField(
            "apply",
            action.componentJsonpath,
            "errorMessage",
            "RP_ERR_AREA_LOCALITY_FIELD_MINLENGTH"
          )
      )
      dispatch(
          handleField(
            "apply",
            action.componentJsonpath,
            "props.errorMessage",
            "RP_ERR_AREA_LOCALITY_FIELD_MINLENGTH"
          )
      )
      }
      else {
          dispatch(
              handleField(
                "apply",
                action.componentJsonpath,
                "errorMessage",
                "RP_ERR_AREA_FIELD"
              )
          )
          dispatch(
              handleField(
                "apply",
                action.componentJsonpath,
                "props.errorMessage",
                "RP_ERR_AREA_FIELD"
              )
          )
      }
    }
  }


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
    minLength: 1,
    maxLength: 1000,
    required: true,
    errorMessage: "RP_ERR_COMMENTS_FIELD",
    afterFieldChange: (action, state, dispatch) => {
      if (action.value.length > 1000) {
          dispatch(
              handleField(
                "transit-site-images",
                action.componentJsonpath,
                "errorMessage",
                "RP_ERR_COMMENTS_FIELD_MAXLENGTH"
              )
          )
          dispatch(
              handleField(
                "transit-site-images",
                action.componentJsonpath,
                "props.errorMessage",
                "RP_ERR_COMMENTS_FIELD_MAXLENGTH"
              )
          )
      }
      else {
          dispatch(
              handleField(
                "transit-site-images",
                action.componentJsonpath,
                "errorMessage",
                "RP_ERR_COMMENTS_FIELD"
              )
          )
          dispatch(
              handleField(
                "transit-site-images",
                action.componentJsonpath,
                "props.errorMessage",
                "RP_ERR_COMMENTS_FIELD"
              )
          )
      }
    }
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
      afterFieldChange: (action, state, dispatch) => {
        dispatch(
            prepareFinalObject(
              "Owners[0].property.id",
              ""
            )
          )
        dispatch(
            prepareFinalObject(
              "Owners[0].property.pincode",
              ""
            )
          )
          dispatch(
            prepareFinalObject(
              "Owners[0].property.colony",
              ""
            )
          )
          dispatch(
            prepareFinalObject(
              "Owners[0].ownerDetails.fatherOrHusband",
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
    afterFieldChange: (action, state, dispatch) => {
      dispatch(
          prepareFinalObject(
            "MortgageApplications[0].property.id",
            ""
          )
        )
      dispatch(
          prepareFinalObject(
            "MortgageApplications[0].property.pincode",
            ""
          )
        )
        dispatch(
          prepareFinalObject(
            "MortgageApplications[0].property.colony",
            ""
          )
        )
        dispatch(
          prepareFinalObject(
            "MortgageApplications[0].applicant[0].name",
            ""
          )
        )
        dispatch(
          prepareFinalObject(
            "MortgageApplications[0].applicant[0].guardian",
            ""
          )
        )
        dispatch(
          prepareFinalObject(
            "MortgageApplications[0].applicant[0].relationship",
            ""
          )
        )
        dispatch(
          prepareFinalObject(
            "MortgageApplications[0].applicant[0].adhaarNumber",
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
        dispatch(
          prepareFinalObject(
            "PropertyImagesApplications[0].property.colony",
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
            colony:getSelectField({...colonyFieldDup,jsonPath:"Owners[0].property.colony"}),
            pincode: getTextField({...pincodeField, placeholder: {
              labelName: "",
              labelKey: ""
            }, jsonPath: "Owners[0].property.pincode", required: false, props: {...pincodeField.props, disabled: true}}),
        })
    }
}

const getOwnershipAddressDetailsMortgage = () => {
  return {
      header: propertyHeader,
      detailsContainer: getCommonContainer({
          ownershipTransitNumber: getTextField(mortgageTransitNumberField),
         colony:getSelectField({...colonyFieldDup,jsonPath:"MortgageApplications[0].property.colony"}),
         pincode: getTextField({...pincodeField,placeholder: {
          labelName: "",
          labelKey: ""
        }, jsonPath: "MortgageApplications[0].property.pincode", required: false, props: {...pincodeField.props, disabled: true}}),
      })
  }
}
const getTransitSitePropertyDetails = () => {
  return {
      header: propertyHeader,
      detailsContainer: getCommonContainer({
          transitNumber: getTextField(TransitsiteTransitNumberField),
         colony:getSelectField({...colonyFieldDup,jsonPath:"PropertyImagesApplications[0].property.colony"}),
         pincode: getTextField({...pincodeField, placeholder: {
          labelName: "",
          labelKey: ""
        }, jsonPath: "PropertyImagesApplications[0].property.pincode", required: false, props: {...pincodeField.props, disabled: true}}),
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