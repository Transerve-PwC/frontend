import { getCommonCard, getSelectField, getTextField, getDateField, getCommonTitle, getPattern, getCommonContainer } from "egov-ui-framework/ui-config/screens/specs/utils";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTodaysDateInYMD } from "../../utils";
import get from "lodash/get";
import {  getDuplicateDetailsFromProperty } from "../../../../../ui-utils/apply";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { set } from "lodash";
export const propertyHeader = getCommonTitle(
        {
            labelName: "Property Details",
            labelKey: "RP_PROPERTY_DETAILS_HEADER"
        },
        {
            style: {
                    marginBottom: 18,
                    marginTop: 18
            }
        }
      )

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

export const colonyFieldDup = {
  ...colonyFieldConfig,
  placeholder: {
    labelName: "",
    labelKey: ""
  },
  required:false,
  props: {
    disabled: true
  }}
let colonySelectedCode = [];
const colonyField = {
    ...colonyFieldConfig,
    beforeFieldChange: (action, state, dispatch) => {
        const rentedPropertyColonies = get(state.screenConfiguration.preparedFinalObject, "applyScreenMdmsData.rentedPropertyColonies") || []
        const findItem = rentedPropertyColonies.find(item => item.code === action.value)
        const propertyAreas = !!findItem ? findItem.area.map(item => ({
          code: item.code,
          label: item.sqyd
        })) : [];
        colonySelectedCode.push(findItem.code)
        const rentPerSqyd = !!findItem ? findItem.costPerSqyd : ""
        dispatch(prepareFinalObject("colonySelectedCode", colonySelectedCode))
        dispatch(prepareFinalObject("applyScreenMdmsData.propertyAreas", propertyAreas))
        dispatch(prepareFinalObject("Properties[0].propertyDetails.rentPerSqyd", rentPerSqyd))
        let interestRatePerYear = get(state.screenConfiguration.screenConfig["apply"],"components.div.children.formwizardFirstStep.children.rentDetails.children.cardContent.children.detailsContainer.children.interestRatePerYear.props.value");
        let rentIncrementPercentage = get(state.screenConfiguration.screenConfig["apply"],"components.div.children.formwizardFirstStep.children.rentDetails.children.cardContent.children.detailsContainer.children.rentIncrementPercentage.props.value");
        let rentIncrementPeriod = get(state.screenConfiguration.screenConfig["apply"], "components.div.children.formwizardFirstStep.children.rentDetails.children.cardContent.children.detailsContainer.children.rentIncrementPeriod.props.value");

        // compare mdms colony data values for rent with field values if same dispatch 
        //if not same dont dispatch

        rentedPropertyColonies.map(item => {
          // check if colonies are same
          // What if changing colony again how to keep track of change in value? -- push then to an array. see the last item if not same as previous dispatch new values.
            if (action.value === item.code) {
              if((colonySelectedCode[colonySelectedCode.length - 1] === colonySelectedCode[colonySelectedCode.length - 2]) && !!interestRatePerYear && !!rentIncrementPercentage && !!rentIncrementPeriod && (item.interestRateOrYear !== parseInt(interestRatePerYear) || item.rentIncrementPercentage !== parseInt(rentIncrementPercentage) || item.rentIncrementPeriod !== parseInt(rentIncrementPeriod))){
                dispatch(
                  handleField(
                      "apply",
                      "components.div.children.formwizardFirstStep.children.rentDetails.children.cardContent.children.detailsContainer.children.interestRatePerYear",
                      "props.value",
                      interestRatePerYear.toString()
                  )
              )
              dispatch(
                  handleField(
                      "apply",
                      "components.div.children.formwizardFirstStep.children.rentDetails.children.cardContent.children.detailsContainer.children.rentIncrementPercentage",
                      "props.value",
                      rentIncrementPercentage.toString()
                  )
              )
              dispatch(
                  handleField(
                      "apply",
                      "components.div.children.formwizardFirstStep.children.rentDetails.children.cardContent.children.detailsContainer.children.rentIncrementPeriod",
                      "props.value",
                      rentIncrementPeriod.toString()
                  )
              )
              }
              else{
                dispatch(
                  handleField(
                      "apply",
                      "components.div.children.formwizardFirstStep.children.rentDetails.children.cardContent.children.detailsContainer.children.interestRatePerYear",
                      "props.value",
                      item.interestRateOrYear.toString()
                  )
              )
              dispatch(
                  handleField(
                      "apply",
                      "components.div.children.formwizardFirstStep.children.rentDetails.children.cardContent.children.detailsContainer.children.rentIncrementPercentage",
                      "props.value",
                      item.rentIncrementPercentage.toString()
                  )
              )
              dispatch(
                  handleField(
                      "apply",
                      "components.div.children.formwizardFirstStep.children.rentDetails.children.cardContent.children.detailsContainer.children.rentIncrementPeriod",
                      "props.value",
                      item.rentIncrementPeriod.toString()
                  )
              )
              }
                
            }
        })
        if(action.value === 'COLONY.KUMHAR' || action.value === 'COLONY.MILK'){
            dispatch(
                handleField(
                    "apply",
                    "components.div.children.formwizardThirdStep.children.paymentDocumentsDetails.children.cardContent.children.documentList",
                    "props.getUrl",
                    "/rp-services/v1/excel/read?fileFormat=0"
                )
            );
        }else{
            dispatch(
                handleField(
                    "apply",
                    "components.div.children.formwizardThirdStep.children.paymentDocumentsDetails.children.cardContent.children.documentList",
                    "props.getUrl",
                    "/rp-services/v1/excel/read?fileFormat=1"
                )
            );
        }
      }
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
    pattern:getPattern("Pincode"),
    errorMessage: "RP_ERR_PINCODE_FIELD",
    afterFieldChange: (action, state, dispatch) => {
      if (action.value.length > 6) {
          dispatch(
              handleField(
                "apply",
                action.componentJsonpath,
                "errorMessage",
                "RP_ERR_PINCODE_FIELD_MAXLENGTH"
              )
          )
          dispatch(
              handleField(
                "apply",
                action.componentJsonpath,
                "props.errorMessage",
                "RP_ERR_PINCODE_FIELD_MAXLENGTH"
              )
          )
      }
      else {
          dispatch(
              handleField(
                "apply",
                action.componentJsonpath,
                "errorMessage",
                "RP_ERR_PINCODE_FIELD"
              )
          )
          dispatch(
              handleField(
                "apply",
                action.componentJsonpath,
                "props.errorMessage",
                "RP_ERR_PINCODE_FIELD"
              )
          )
      }
    }
  }

export const transitNumberConfig = {
        label: {
            labelName: "Transit Site/Plot number",
            labelKey: "RP_SITE_PLOT_LABEL"
        },
        placeholder: {
            labelName: "Enter Transit Site/Plot number",
            labelKey: "RP_SITE_PLOT_PLACEHOLDER"
        },
        gridDefination: {
            xs: 12,
            sm: 6
        },
        minLength: 1,
        maxLength: 5,
        required: true,
        pattern:getPattern("TransitNumberValidation"),
        errorMessage: "RP_ERR_TRANSIT_FIELD",
        afterFieldChange: (action, state, dispatch) => {
          if (parseInt(action.value) > 10000) {
              dispatch(
                  handleField(
                    "apply",
                    action.componentJsonpath,
                    "errorMessage",
                    "RP_ERR_TRANSIT_FIELD_MAXLENGTH"
                  )
              )
              dispatch(
                  handleField(
                    "apply",
                    action.componentJsonpath,
                    "props.errorMessage",
                    "RP_ERR_TRANSIT_FIELD_MAXLENGTH"
                  )
              )
          }
          else {
              dispatch(
                  handleField(
                    "apply",
                    action.componentJsonpath,
                    "errorMessage",
                    "RP_ERR_TRANSIT_FIELD"
                  )
              )
              dispatch(
                  handleField(
                    "apply",
                    action.componentJsonpath,
                    "props.errorMessage",
                    "RP_ERR_TRANSIT_FIELD"
                  )
              )
          }
        }
}

export const transitNumberLookUp = {
    ...transitNumberConfig,
    placeholder: {
        labelName: "Enter Transit site/Plot Number and click on search icon",
        labelKey: "RP_SITE_PLOT_SEARCH_PLACEHOLDER"
    },
    iconObj: {
      iconName: "search",
      position: "end",
      color: "#FE7A51"
    },
    title: {
      value:
        "If you have already assessed your property, then please search your property by your transit number",
      key: "If you have already assessed your property, then please search your property by your transit number"
    },
    infoIcon: "info_circle",
    errorMessage: "RP_SITE_PLOT_SEARCH_PLACEHOLDER"
}

const duplicateCopyTransitField = {
    ...transitNumberLookUp,
    jsonPath: "DuplicateCopyApplications[0].property.transitNumber",
    iconObj: {
        ...transitNumberLookUp.iconObj,
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) => {
            getDuplicateDetailsFromProperty(state, dispatch);
          }
        }
      },
      afterFieldChange: (action, state, dispatch) => {
        dispatch(
            prepareFinalObject(
              "DuplicateCopyApplications[0].property.id",
              ""
            )
          )
        dispatch(
            prepareFinalObject(
              "DuplicateCopyApplications[0].property.pincode",
              ""
            )
          )
          dispatch(
            prepareFinalObject(
              "DuplicateCopyApplications[0].property.colony",
              ""
            )
          )
          dispatch(
            prepareFinalObject(
              "DuplicateCopyApplications[0].applicant[0].name",
              ""
            )
          )
          dispatch(
            prepareFinalObject(
              "DuplicateCopyApplications[0].applicant[0].guardian",
              ""
            )
          )
          dispatch(
            prepareFinalObject(
              "DuplicateCopyApplications[0].applicant[0].relationship",
              ""
            )
          )
          dispatch(
            prepareFinalObject(
              "DuplicateCopyApplications[0].applicant[0].adhaarNumber",
              ""
            )
          )
      }
}

const noticeTransitNumberField = {
    ...transitNumberConfig,
    jsonPath: "DuplicateCopyApplications[0].property.transitNumber",
}

const transitNumberField = {
    ...transitNumberConfig,
    jsonPath: "Properties[0].transitNumber"
  }

  const allotmentDateField = {
    label: {
        labelName: "Date of Allotment",
        labelKey: "RP_ALLOTMENT_DATE_LABEL"
    },
    placeholder: {
        labelName: "Enter Date of Allotment",
        labelKey: "RP_ALLOTMENT_DATE_PLACEHOLDER"
    },
    required: true,
    pattern: getPattern("Date"),
    jsonPath: "Properties[0].owners[0].ownerDetails.allotmentStartdate",
    props: {
        inputProps: {
            max: getTodaysDateInYMD()
        }
    },
    errorMessage: "RP_ERR_ALLOTMENT_DATE_FIELD",
  }

  const allotmentNumberField = {
    label: {
        labelName: "Allotment Number",
        labelKey: "RP_ALLOTMENT_NUMBER_LABEL"
    },
    placeholder: {
        labelName: "Enter Allotment Number",
        labelKey: "RP_ALLOTMENT_NUMBER_PLACEHOLDER"
    },
    gridDefination: {
        xs: 12,
        sm: 6
    },
    minLength: 3,
    maxLength: 20,
    required: true,
    jsonPath: "Properties[0].owners[0].allotmenNumber",
    errorMessage: "RP_ERR_ALLOTMENT_NUMBER_FIELD",
  }

  const areaField = {
    label: {
        labelName: "Area of the property (in Sq.yd)",
        labelKey: "RP_AREA_PROPERTY_LABEL_IN_UNITS"
    },
    placeholder: {
        labelName: "Enter Area of the property",
        labelKey: "RP_AREA_PROPERTY_PLACEHOLDER"
    },
    required: true,
    minLength: 2,
    maxLength: 20,
    pattern: getPattern("numeric-only"),
    jsonPath: "Properties[0].propertyDetails.area",
    // optionValue: "code",
    // optionLabel: "label",
    // sourceJsonPath: "applyScreenMdmsData.propertyAreas",
    gridDefination: {
        xs: 12,
        sm: 6
    },
    errorMessage: "RP_ERR_AREA_FIELD",
    afterFieldChange: (action, state, dispatch) => {
      if (action.value.length > 20) {
          dispatch(
              handleField(
                "apply",
                action.componentJsonpath,
                "errorMessage",
                "RP_ERR_AREA_FIELD_MAXLENGTH"
              )
          )
          dispatch(
              handleField(
                "apply",
                action.componentJsonpath,
                "props.errorMessage",
                "RP_ERR_AREA_FIELD_MAXLENGTH"
              )
          )
      }
      else if(action.value.length < 2){
        dispatch(
          handleField(
            "apply",
            action.componentJsonpath,
            "errorMessage",
            "RP_ERR_AREA_FIELD_MINLENGTH"
          )
      )
      dispatch(
          handleField(
            "apply",
            action.componentJsonpath,
            "props.errorMessage",
            "RP_ERR_AREA_FIELD_MINLENGTH"
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

  const posessionDateField = {
    label: {
        labelName: "Date of Possession",
        labelKey: "RP_POSSESSION_DATE_LABEL"
    },
    placeholder: {
        labelName: "Enter Date of Possession",
        labelKey: "RP_POSSESSION_DATE_PLACEHOLDER"
    },
    required: true,
    pattern: getPattern("Date"),
    jsonPath: "Properties[0].owners[0].ownerDetails.posessionStartdate",
    props: {
        inputProps: {
            max: getTodaysDateInYMD()
        }
    },
    errorMessage: "RP_ERR_POSESSION_DATE_FIELD",
  }
 

const getPropertyDetails = () => {
    return {
        header: propertyHeader,
        detailsContainer: getCommonContainer({
            colony: getSelectField(colonyField),
            transitNumber: getTextField(transitNumberField),
            areaOfProperty: getTextField(areaField),
            // dateOfAllotment: getDateField(allotmentDateField),
            // allotmentNumber: getTextField(allotmentNumberField),
            // posessionDate: getDateField(posessionDateField)
        })
    }
}

export const transitSiteHeader = getCommonTitle(
    {
        labelName: "Transit Site Details",
        labelKey: "RP_TRANSIT_SITE_DETAILS_HEADER"
    },
    {
        style: {
                marginBottom: 18,
                marginTop: 18
        }
    }
  )

  const ownerNameField = {
    label: {
        labelName: "Owner Name",
        labelKey: "RP_OWNER_NAME_LABEL"
    },
    // placeholder: {
    //     labelName: "Enter Owner Name",
    //     labelKey: "RP_OWNER_NAME_PLACEHOLDER"
    // },
    gridDefination: {
        xs: 12,
        sm: 6
    },
    minLength: 4,
    maxLength: 40,
    disabled: true,
    jsonPath: "",
    errorMessage: "",
  }  
  export const colonyFieldlabel = {
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
    const colonyNameFielddata = {
        ...colonyFieldlabel,
        minLength: 1,
        maxLength: 100,
        required: true,
        jsonPath: "Properties[0].propertyDetails.address.colony"
      }

const getTransitSiteDetails = () => {
    return {
        header: transitSiteHeader,
        detailsContainer: getCommonContainer({
            transitNumber: getTextField(duplicateCopyTransitField),
            colony:getSelectField({...colonyFieldDup,jsonPath:"DuplicateCopyApplications[0].property.colony"}),
            pincode: getTextField({...pincodeField, placeholder: {
                labelName: "",
                labelKey: ""
              }, jsonPath: "DuplicateCopyApplications[0].property.pincode", required: false, props: {...pincodeField.props, disabled: true}}),
        })
    }
}

export const propertyDetails = getCommonCard(getPropertyDetails())
export const transitSiteDetails = getCommonCard(getTransitSiteDetails())