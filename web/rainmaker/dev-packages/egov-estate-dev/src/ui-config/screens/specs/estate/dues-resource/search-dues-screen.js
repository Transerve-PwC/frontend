import {
  getCommonCard,
  getCommonTitle,
  getTextField,
  getSelectField,
  getCommonContainer,
  getCommonParagraph,
  getPattern,
  getDateField,
  getLabel,
  getCommonHeader
} from "egov-ui-framework/ui-config/screens/specs/utils";
// import { getTodaysDateInYMD } from "../../utils";
import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
// import { searchApiCall, searchTransferProperties,searchDuplicateCopy, searchMortgage, searchAccountStatement} from "./functions";
// import { getAccountStatementProperty } from "../../../../../ui-utils/apply";


const FileNumberField = {
  label: {
      labelName: "File Number",
      labelKey: "ESTATE_FILE_NUMBER"
  },
  placeholder: {
      labelName: "Enter File Number",
      labelKey: "ESTATE_FILE_NUMBER_PLACEHOLDER"
  },
  gridDefination: {
      xs: 12,
      sm: 6
  },
  required: false,
  jsonPath: "searchScreen.transitNumber"
}

const allotmentNumber = {
  label: {
      labelName: "Allotment Number",
      labelKey: "ESTATE_ALLOTMENT_NUMBER_LABEL"
  },
  placeholder: {
      labelName: "Enter Allotment Number",
      labelKey: "ESTATE_ALLOTMENT_NUMBER_PLACEHOLDER"
  },
  gridDefination: {
      xs: 12,
      sm: 6
  },
  required: false,
  props:{
    disabled:true
  },
  jsonPath: "searchScreen.pincode"
}

const category = {
  label: {
      labelName: "Category",
      labelKey: "ESTATE_DUES_CATEGORY_LABEL"
  },
  placeholder: {
      labelName: "Enter Category",
      labelKey: "ESTATE_DUES_CATEGORY_PLACEHOLDER"
  },
  gridDefination: {
      xs: 12,
      sm: 6
  },
  required: false,
  props:{
    disabled:true
  },
  jsonPath: "searchScreen.pincode"
}

const propertyType = {
  label: {
      labelName: "Property Type",
      labelKey: "ESTATE_PROPERTY_TYPE_LABEL"
  },
  placeholder: {
      labelName: "Enter Property Type",
      labelKey: "ESTATE_PROPERTY_TYPE_PLACEHOLDER"
  },
  gridDefination: {
      xs: 12,
      sm: 6
  },
  required: false,
  props:{
    disabled:true
  },
  jsonPath: "searchScreen.pincode"
}

const premiumAmount = {
  label: {
      labelName: "Premium Amount",
      labelKey: "ESTATE_PREMIUM_AMOUNT_LABEL"
  },
  placeholder: {
      labelName: "Enter Premium Amount",
      labelKey: "ESTATE_PREMIUM_AMOUNT_PLACEHOLDER"
  },
  gridDefination: {
      xs: 12,
      sm: 6
  },
  required: false,
  props:{
    disabled:true
  },
  jsonPath: "searchScreen.pincode"
}

const groundRent = {
  label: {
      labelName: "Ground Rent",
      labelKey: "ESTATE_GROUND_RENT_LABEL"
  },
  placeholder: {
      labelName: "Enter Ground Rent",
      labelKey: "ESTATE_GROUND_RENT_PLACEHOLDER"
  },
  gridDefination: {
      xs: 12,
      sm: 6
  },
  required: false,
  props:{
    disabled:true
  },
  jsonPath: "searchScreen.pincode"
}

const adcancedRent = {
  label: {
      labelName: "Advanced Rent",
      labelKey: "ESTATE_ADVANCED_RENT_LABEL"
  },
  placeholder: {
      labelName: "Enter Advanced Rent",
      labelKey: "ESTATE_ADVANCED_RENT_PLACEHOLDER"
  },
  gridDefination: {
      xs: 12,
      sm: 6
  },
  required: false,
  props:{
    disabled:true
  },
  jsonPath: "searchScreen.pincode"
}

const extensionFee = {
  label: {
      labelName: "Entension Fee",
      labelKey: "ESTATE_EXTENSION_FEE_LABEL"
  },
  placeholder: {
      labelName: "Enter Entension Fee",
      labelKey: "ESTATE_EXTENSION_FEE_PLACEHOLDER"
  },
  gridDefination: {
      xs: 12,
      sm: 6
  },
  required: false,
  props:{
    disabled:true
  },
  jsonPath: "searchScreen.pincode"
}


const penalty = {
  label: {
      labelName: "Penalty",
      labelKey: "ESTATE_PENALTY_LABEL"
  },
  placeholder: {
      labelName: "Enter Penalty",
      labelKey: "ESTATE_PENALTY_PLACEHOLDER"
  },
  gridDefination: {
      xs: 12,
      sm: 6
  },
  required: false,
  props:{
    disabled:true
  },
  jsonPath: "searchScreen.pincode"
}

const violationPenalty = {
  label: {
      labelName: "Violation Penalty",
      labelKey: "ESTATE_VIOLATION_PENALTY_LABEL"
  },
  placeholder: {
      labelName: "Enter Violation Penalty",
      labelKey: "ESTATE_VIOLATION_PENALTY_PLACEHOLDER"
  },
  gridDefination: {
      xs: 12,
      sm: 6
  },
  required: false,
  props:{
    disabled:true
  },
  jsonPath: "searchScreen.pincode"
}

const chequeBouncePenalty = {
  label: {
      labelName: "Cheque Bounce Penalty",
      labelKey: "ESTATE_CHEQUE_BOUNCE_PENALTY_LABEL"
  },
  placeholder: {
      labelName: "Enter Cheque Bounce Penalty",
      labelKey: "ESTATE_CHEQUE_BOUNCE_PENALTY_PLACEHOLDER"
  },
  gridDefination: {
      xs: 12,
      sm: 6
  },
  required: false,
  props:{
    disabled:true
  },
  jsonPath: "searchScreen.pincode"
}

const dueType = {
  label: {
      labelName: "Due Type",
      labelKey: "ESTATE_DUE_TYPE_LABEL"
  },
  placeholder: {
      labelName: "Enter Due Type",
      labelKey: "ESTATE_DUE_TYPE_PLACEHOLDER"
  },
  gridDefination: {
      xs: 12,
      sm: 6
  },
  required: false,
  props:{
    disabled:true
  },
  jsonPath: "searchScreen.pincode"
}

const enterAmount = {
  label: {
      labelName: "Amount",
      labelKey: "ESTATE_AMOUNT_LABEL"
  },
  placeholder: {
      labelName: "Enter Amount",
      labelKey: "ESTATE_AMOUNT_PLACEHOLDER"
  },
  gridDefination: {
      xs: 12,
      sm: 6
  },
  required: false,
  props:{
    disabled:true
  },
  jsonPath: "searchScreen.pincode"
}

const areaOfProperty = {
  label: {
      labelName: "Area Of Property",
      labelKey: "ESTATE_AREA_OF_PROPERTY_LABEL"
  },
  placeholder: {
      labelName: "Enter Area Of Property",
      labelKey: "ESTATE_AREA_OF_PROPERTY_PLACEHOLDER"
  },
  gridDefination: {
      xs: 12,
      sm: 6
  },
  props:{
    disabled:true
  },
  required: false,
  jsonPath: "searchScreen.ownername"
}

const dateOfAllotment = {
  label: {
    labelName: "Date Of Allotment",
    labelKey: "ESTATE_DATE_OF_ALLOTMENT_LABEL"
},
placeholder: {
    labelName: "Enter Date Of Allotment",
    labelKey: "ESTATE_DATE_OF_ALLOTMENT_PLACEHOLDER"
},
  pattern: getPattern("Date"),
  jsonPath: "searchScreen.fromDate",
  props: {
      inputProps: {
          // max: getTodaysDateInYMD()
      }
  }
}

const filterButtonItem = {
  firstCont: {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    gridDefination: {
      xs: 12,
      sm: 4
    }
  },
  filterButton: {
    componentPath: "Button",
    gridDefination: {
      xs: 12,
      sm: 4
    },
    props: {
      variant: "contained",
      style: {
        color: "white",
        backgroundColor: "#fe7a51",
        borderRadius: "2px",
        width: "80%",
        height: "48px"
      }
    },
    children: {
      buttonLabel: getLabel({
        labelName: "Next",
        labelKey: "ESTATE_DUES_NEXT_BUTTON"
      })
    }
  }
}

// want
const fileNumber = {
  ...FileNumberField,
  required: true,
  iconObj: {
    iconName: "search",
    position: "end",
    color: "#FE7A51",
    onClickDefination: {
      action: "condition",
      callBack: (state, dispatch) => {
        // getAccountStatementProperty(state, dispatch);
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
          "searchScreen.area",
          ""
        )
      )
    dispatch(
        prepareFinalObject(
          "searchScreen.pincode",
          ""
        )
      )
      dispatch(
        prepareFinalObject(
          "searchScreen.ownername",
          ""
        )
      )
  }
}

export const propertyDueDetails = getCommonCard({
  propertyDueDetailsHeader: getCommonHeader({
    labelName: "Property Due Details",
    labelKey: "ESTATE_PROPERTY_DUE_DETAILS_HEADER"
  }),
  applicationNoContainer: getCommonContainer({
    transitNumber: getTextField(fileNumber),
    area:getTextField(propertyType)
  }),
  statusContainer: getCommonContainer({
    pincode:getTextField(category),
    ownername:getTextField(areaOfProperty)
  }),
  dateContainer:getCommonContainer({
      from:getDateField({...dateOfAllotment}),
      to:getTextField(allotmentNumber)
  })
})

export const duesSummaryForm = getCommonCard({
  propertyDueSummaryHeader: getCommonHeader({
    labelName: "Dues Summary",
    labelKey: "ESTATE_DUES_SUMMARY_HEADER"
  }),
  applicationNoContainer: getCommonContainer({
    transitNumber: getTextField(premiumAmount),
    area:getTextField(adcancedRent)
  }),
  statusContainer: getCommonContainer({
    pincode:getTextField(groundRent),
    ownername:getTextField(extensionFee)
  }),
  statusContainer: getCommonContainer({
    pincode:getTextField(penalty),
    ownername:getTextField(chequeBouncePenalty)
  }),
  statusContainer: getCommonContainer({
    pincode:getTextField(violationPenalty)
  }),
  
})

export const enterDuesForm = getCommonCard({
  subParagraph: getCommonParagraph({
    labelName: "Enter Due",
    labelKey: "ESTATE_ENTER_DUES_LABEL"
  }),
  applicationNoContainer: getCommonContainer({
    pincode:getTextField(dueType),
    ownername:getTextField(enterAmount)
  }),
  button: getCommonContainer({
    buttonContainer: getCommonContainer(
      {...filterButtonItem, filterButton: {...filterButtonItem.filterButton, 
        onClickDefination: {
          action: "condition",
          // callBack: searchAccountStatement
        }
      }, lastCont: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 12,
          sm: 4
        }
      }
    })
  })
})



function resetFields(state, dispatch) {
  dispatch(
    handleField(
      "search",
      "components.div.children.rentedPropertyApplication.children.cardContent.children.colonyContainer.children.colony",
      "props.value",
      ""
    )
  )
  dispatch(
    handleField(
      "search",
      "components.div.children.rentedPropertyApplication.children.cardContent.children.colonyContainer.children.status",
      "props.value",
      ""
    )
  )
  dispatch(
    handleField(
      "search",
      "components.div.children.rentedPropertyApplication.children.cardContent.children.transitNumberContainer.children.phone",
      "props.value",
      ""
    )
  )

  dispatch(
    handleField(
      "search",
      "components.div.children.rentedPropertyApplication.children.cardContent.children.transitNumberContainer.children.transitNumber",
      "props.value",
      ""
    )
  )
}

function resetMortageFields(state, dispatch) {
  dispatch(
    handleField(
      "search-mortgage",
      "components.div.children.searchMortgageApplication.children.cardContent.children.applicationNoContainer.children.applicationNo",
      "props.value",
      ""
    )
  )
  dispatch(
    handleField(
      "search-mortgage",
      "components.div.children.searchMortgageApplication.children.cardContent.children.applicationNoContainer.children.transitNumber",
      "props.value",
      ""
    )
  )
  dispatch(
    handleField(
      "search-mortgage",
      "components.div.children.searchMortgageApplication.children.cardContent.children.statusContainer.children.mobileNo",
      "props.value",
      ""
    )
  )

  dispatch(
    handleField(
      "search-mortgage",
      "components.div.children.searchMortgageApplication.children.cardContent.children.statusContainer.children.status",
      "props.value",
      ""
    )
  )
}


function resetDuplicateFields(state, dispatch) {
  dispatch(
    handleField(
      "search-duplicate-copy",
      "components.div.children.searchDuplicateCopyApplication.children.cardContent.children.applicationNoContainer.children.applicationNo",
      "props.value",
      ""
    )
  )
  dispatch(
    handleField(
      "search-duplicate-copy",
      "components.div.children.searchDuplicateCopyApplication.children.cardContent.children.applicationNoContainer.children.transitNumber",
      "props.value",
      ""
    )
  )
  dispatch(
    handleField(
      "search-duplicate-copy",
      "components.div.children.searchDuplicateCopyApplication.children.cardContent.children.statusContainer.children.mobileNo",
      "props.value",
      ""
    )
  )

  dispatch(
    handleField(
      "search-duplicate-copy",
      "components.div.children.searchDuplicateCopyApplication.children.cardContent.children.statusContainer.children.status",
      "props.value",
      ""
    )
  )
}


function resetOwnershipFields(state, dispatch) {
  dispatch(
    handleField(
      "search-transfer-properties",
      "components.div.children.ownerShipTransferApplication.children.cardContent.children.applicationNoContainer.children.applicationNo",
      "props.value",
      ""
    )
  )
  dispatch(
    handleField(
      "search-transfer-properties",
      "components.div.children.ownerShipTransferApplication.children.cardContent.children.applicationNoContainer.children.transitNumber",
      "props.value",
      ""
    )
  )
  dispatch(
    handleField(
      "search-transfer-properties",
      "components.div.children.ownerShipTransferApplication.children.cardContent.children.statusContainer.children.mobileNo",
      "props.value",
      ""
    )
  )

  dispatch(
    handleField(
      "search-transfer-properties",
      "components.div.children.ownerShipTransferApplication.children.cardContent.children.statusContainer.children.status",
      "props.value",
      ""
    )
  )
}