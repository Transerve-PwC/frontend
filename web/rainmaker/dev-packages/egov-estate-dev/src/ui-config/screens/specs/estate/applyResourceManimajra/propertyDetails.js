import {
  getCommonCard,
  getSelectField,
  getTextField,
  getDateField,
  getCommonTitle,
  getPattern,
  getCommonContainer,
  dispatchMultipleFieldChangeAction
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { fileNumberField } from "../applyResource/propertyDetails";
import { mohallaField, categoryField, subCategoryField, siteNumberField, sectorNumberField, propertyDetailsHeader } from "../applyResourceBuildingBranch/propertyDetails";
import {
  displayDefaultErr,
  _getPattern,
  displayCustomErr
} from "../../utils";
import moment from 'moment'
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";

let screenName = "apply-manimajra"

const houseNumberField = {
  label: {
    labelName: "House/Shop Number",
    labelKey: "ES_HOUSE_SHOP_NUMBER_LABEL"
  },
  placeholder: {
    labelName: "Enter House/Shop Number",
    labelKey: "ES_HOUSE_SHOP_NUMBER_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  required: true,
  pattern: _getPattern("fileNumber"),
  jsonPath: "Properties[0].propertyDetails.houseNumber",
  afterFieldChange: (action, state, dispatch) => {
    if (action.value.length > 50) {
      displayCustomErr(action.componentJsonpath, dispatch, "ES_ERR_MAXLENGTH_50", screenName);
    } else {
      displayDefaultErr(action.componentJsonpath, dispatch, screenName);
    }
  }
}

const streetField = {
  label: {
    labelName: "Street",
    labelKey: "ES_STREET_LABEL"
  },
  placeholder: {
    labelName: "Enter Street Number",
    labelKey: "ES_STREET_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  required: true,
  minLength: 2,
  maxLength: 100,
  jsonPath: "Properties[0].propertyDetails.street",
  afterFieldChange: (action, state, dispatch) => {
    if (action.value.length > 100) {
      displayCustomErr(action.componentJsonpath, dispatch, "ES_ERR_MAXLENGTH_100", screenName);
    } else {
      displayDefaultErr(action.componentJsonpath, dispatch, screenName);
    }
  }
}

const areaofPropertyField = {
  label: {
      labelName: "Area of the Property(in sq yds)",
      labelKey: "ES_AREA_YDS_LABEL"
  },
  placeholder: {
      labelName: "Enter Area of the Property(in sq yds)",
      labelKey: "ES_AREA_YDS_PLACEHOLDER"
  },
  gridDefination: {
      xs: 12,
      sm: 6
  },
  pattern: _getPattern("areaOfProperty"),
  required: true,
  jsonPath: "Properties[0].propertyDetails.areaSqft"
}

export const propertyTypeField = {
  label: {
      labelName: "Property Type",
      labelKey: "ES_PROPERTY_TYPE_LABEL"
  },
  placeholder: {
      labelName: "Select Property Type",
      labelKey: "ES_PROPERTY_TYPE_PLACEHOLDER"
  },
  required: true,
  jsonPath: "Properties[0].propertyDetails.propertyType",
  sourceJsonPath: "applyScreenMdmsData.EstateServices.propertyTypeMM",
  gridDefination: {
      xs: 12,
      sm: 6
  },
  props:{
    value : "PROPERTY_TYPE.JANTA_READY_MARKET"
  },
  beforeFieldChange: (action, state, dispatch) => {

    const monthlyData = [
       {label:"JAN",code:"01"},{label:"FEB",code:"02"},{label:"MAR",code:"03"},{label:"APR",code:"04"},{label:"MAY",code:"05"},{label:"JUN",code:"06"},{label:"JUL",code:"07"},
      {label:"AUG",code:"08"},{label:"SEP",code:"09"},{label:"OCT",code:"10"},{label:"NOV",code:"11"},{label:"DEC",code:"12"}
    ]
    
    var yearlyData = []
    const min = 1992
    const max = moment(new Date()).format('YYYY')
    for(var i = min; i <= max; i++){
      yearlyData.push({"code": i})
    }
    dispatch(
      handleField(
        action.screenKey,
        "components.div.children.formwizardEighthStep.children.reviewDetails.children.cardContent.children",
        "monthlyDetails.visible",
         false
      )
    )
    dispatch(
      handleField(
        action.screenKey,
        "components.div.children.formwizardEighthStep.children.reviewDetails.children.cardContent.children",
        "annualDetails.visible",
         false
      )
    )
    dispatch(
      handleField(
        action.screenKey,
        "components.div.children.formwizardFirstStep.children",
        "monthlyDetails.visible",
         false
      )
    )
    dispatch(
      handleField(
        action.screenKey,
        "components.div.children.formwizardFirstStep.children",
        "annualDetails.visible",
        false
      )
    )
    dispatch(
      handleField(
        action.screenKey,
        "components.div.children.formwizardFirstStep.children.monthlyDetails.children.cardContent.children.detailsContainer.children.monthly",
        "props.data",
        monthlyData
      )
    )

    dispatch(
      handleField(
        action.screenKey,
        "components.div.children.formwizardFirstStep.children.annualDetails.children.cardContent.children.detailsContainer.children.annual",
        "props.data",
        yearlyData
      )
    )
    
    switch(action.value){
       case 'PROPERTY_TYPE.JANTA_READY_MARKET':
       case 'PROPERTY_TYPE.PUNJAB_AGRO_JUICE':
          dispatch(
            handleField(
              action.screenKey,
              "components.div.children.formwizardFirstStep.children",
              "monthlyDetails.visible",
               true
            )
          )
          dispatch(
            handleField(
              action.screenKey,
              "components.div.children.formwizardFirstStep.children",
              "annualDetails.visible",
              true
            )
          )

          dispatch(
            handleField(
              action.screenKey,
              "components.div.children.formwizardEighthStep.children.reviewDetails.children.cardContent.children",
              "monthlyDetails.visible",
               true
            )
          )
          dispatch(
            handleField(
              action.screenKey,
              "components.div.children.formwizardEighthStep.children.reviewDetails.children.cardContent.children",
              "annualDetails.visible",
               true
            )
          )
         break;
      // case 'PROPERTY_TYPE.PUNJAB_AGRO_JUICE':
      //     dispatch(
      //       handleField(
      //         action.screenKey,
      //         "components.div.children.formwizardFirstStep.children",
      //         "monthlyDetails.visible",
      //          true
      //       )
      //     )

      //     dispatch(
      //       handleField(
      //         action.screenKey,
      //         "components.div.children.formwizardEighthStep.children.reviewDetails.children.cardContent.children",
      //         "monthlyDetails.visible",
      //          true
      //       )
      //     )
          
      //    break;
      case 'PROPERTY_TYPE.OTHERS':
        //do nothing
        break;    
    }
  }
}

export const demandTypeField = {
  label: {
      labelName: "Demand Type",
      labelKey: "ES_DEMAND_TYPE_LABEL"
  },
  placeholder: {
      labelName: "Select Demand Type",
      labelKey: "ES_DEMAND_TYPE_PLACEHOLDER"
  },
  required: true,
  jsonPath: "Properties[0].propertyDetails.demandType",
  optionValue: "code",
  optionLabel: "label",
  data:[
    {label:"Monthly",code:"MONTHLY"},{label:"Annually",code:"ANNUALLY"}
 ],
  gridDefination: {
      xs: 12,
      sm: 6
  }
  
}


export const propertyDetails = getCommonCard({
  header: propertyDetailsHeader,
  detailsContainer: getCommonContainer({
      fileNumber: getTextField(fileNumberField),
      houseNumber: getTextField(houseNumberField),
      mohalla: getTextField(mohallaField),
      street: getTextField(streetField),
      areaOfProperty: getTextField(areaofPropertyField),
      propertyType: getSelectField(propertyTypeField),
      // demandType:getSelectField(demandTypeField),
      category: getSelectField(categoryField),
      subCategory: getSelectField(subCategoryField),
      siteNumber: getTextField(siteNumberField),
      sectorNumber: getSelectField(sectorNumberField)
  })
})

export const annualTextField = {
  label: {
      labelName: "Annual License fee Pending from",
      labelKey: "ES_ANNUAL_LICENSE_FEE_PENDING_LABEL"
  },
  placeholder: {
      labelName: "Select Year",
      labelKey: "ES_SELECT_YEAR_PLACEHOLDER"
  },
  required: true,
  jsonPath: "Properties[0].propertyDetails.mmDemandStartYear",
  gridDefination: {
      xs: 12,
      sm: 6
  }
 
}

export const monthTextField = {
  label: {
      labelName: "Monthly Charges pending from",
      labelKey: "ES_MONTHLY_CHARGES_PENDING_LABEL"
  },
  placeholder: {
      labelName: "Select Month",
      labelKey: "ES_SELECT_MONTH_PLACEHOLDER"
  },
  optionValue: "code",
  optionLabel: "label",
  required: true,
  jsonPath: "Properties[0].propertyDetails.mmDemandStartMonth",
  gridDefination: {
      xs: 12,
      sm: 6
  }
 
}

export const annualDetailsHeader = getCommonTitle({
  labelName: "Annual Details",
  labelKey: "ES_ANNUAL_DETAILS_HEADER"
}, {
  style: {
      marginBottom: 18,
      marginTop: 18
  }
})

export const monthlyDetailsHeader = getCommonTitle({
  labelName: "Monthly Details",
  labelKey: "ES_MONTHLY_DETAILS_HEADER"
}, {
  style: {
      marginBottom: 18,
      marginTop: 18
  }
})

export const annualDetails = getCommonCard({
  header: annualDetailsHeader,
  detailsContainer: getCommonContainer({
      annual: getSelectField(annualTextField)
  })
})

export const monthlyDetails = getCommonCard({
  header: monthlyDetailsHeader,
  detailsContainer: getCommonContainer({
      monthly: getSelectField(monthTextField)
  })
})

