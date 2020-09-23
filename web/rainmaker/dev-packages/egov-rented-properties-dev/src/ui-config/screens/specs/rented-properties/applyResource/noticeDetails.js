import { getCommonCard, getSelectField, getTextField, getDateField, getCommonTitle, getPattern, getCommonContainer } from "egov-ui-framework/ui-config/screens/specs/utils";
import { getTodaysDateInYMD } from "../../utils";
import get from "lodash/get";
import { getRecoveryValueProperty} from "../../../../../ui-utils/apply";
import { transitNumberConfig } from "./propertyDetails";

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
  const rentHolderHeader = getCommonTitle(
    {
        labelName: "Rent holder Particulars",
        labelKey: "RP_RENT_HOLDER_PARTICULAR_HEADER"
    },
    {
        style: {
                marginBottom: 18,
                marginTop: 18
        }
    }
  )  
const fatherOrHusbandsNameField = {
    label: {
        labelName: "Father/ Husband's Name",
        labelKey: "RP_FATHER_OR_HUSBANDS_NAME_LABEL"
    },
    gridDefination: {
        xs: 12,
        sm: 6
    },
    minLength: 4,
    maxLength: 40,
    required: true,
    jsonPath: "Properties[0].owners[0].ownerDetails.fatherOrHusband",
    errorMessage:"RP_ERR_FATHER_OR_HUSBAND_FIELD",
    props: {
        disabled: true
      }
}

const getEditorField = {
    gridDefination: {
        xs: 12,
        sm: 6
    },
    label: {
        labelName: "Editor",
        labelKey: "RP_EDITOR_LABEL"
    },
    placeholder: { 
        labelName: "Editor",
        labelKey: "RP_EDITOR_LABEL"
    },
    props:{
        multiline: true,
        rows: "4"
    },
    visible: true,
    jsonPath: "Properties[0].owners[0].ownerDetails.editor"
  }

const originalAllotteField = {
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
    props: {
        disabled: true
      },
    jsonPath: "Properties[0].owners[0].ownerDetails.name"
}

const getDocumentField = {
    label: {
        labelName: "Documents Given",
        labelKey: "RP_DOCUMENTS_GIVEN_LABEL"
    },
    placeholder: {
        labelName: "Documents Given",
        labelKey: "RP_DOCUMENTS_GIVEN_LABEL"
    },
    gridDefination: {
        xs: 12,
        sm: 6
    },
    minLength: 4,
    maxLength: 40,
    jsonPath: "Properties[0].owners[0].ownerDetails.documentsGiven" 
}

const getViolationField = {
    label: {
        labelName: "Violations",
        labelKey: "RP_VIOLATIONS_LABEL"
    },
    placeholder: {
        labelName: "Enter Comments",
        labelKey: "RP_VIOLATIONS_PLACEHOLDER"
    },
    gridDefination: {
        xs: 12,
        sm: 6
    },
    props:{
        multiline: true,
        rows: "4"
    },
    visible:true,
      required:true,
    jsonPath: "Images[0].description" 
}

const transitNumberField = {
    ...transitNumberConfig,
    placeholder: {
        labelName: "",
        labelKey: ""
      },
    props: {
        disabled: true
      },
    jsonPath: "Properties[0].transitNumber"
  }
  const allotmentNumberField = {
    label: {
        labelName: "Allotment Number",
        labelKey: "RP_ALLOTMENT_NUMBER_LABEL"
    },
    // placeholder: {
    //     labelName: "Enter Allotment Number",
    //     labelKey: "RP_ALLOTMENT_NUMBER_PLACEHOLDER"
    // },
    gridDefination: {
        xs: 12,
        sm: 6
    },
    minLength: 3,
    maxLength: 20,
    required: true,
    jsonPath: "Properties[0].owners[0].allotmenNumber",
    errorMessage:"RP_ERR_ALLOTMENT_NUMBER_FIELD",
    props: {
        disabled: true
      }
  }  

  const allotmentDateField = {
    label: {
        labelName: "Date of Allotment",
        labelKey: "RP_ALLOTMENT_DATE_LABEL"
    },
    // placeholder: {
    //     labelName: "Enter Date of Allotment",
    //     labelKey: "RP_ALLOTMENT_DATE_PLACEHOLDER"
    // },
    required: true,
    pattern: getPattern("Date"),
    jsonPath: "Properties[0].owners[0].ownerDetails.allotmentStartdate",
    props: {
        disabled: true,
        inputProps: {
            max: getTodaysDateInYMD()
        }
    }
  }

const demandNoticeFromDate = {
    label: {
        labelName: "Demand Notice First Date",
        labelKey: "RP_DEMAND_NOTICE_FIRST_DATE"
    },
    placeholder: {
        labelName: "Enter Demand Notice First Date",
        labelKey: "RP_DEMAND_DATE_PLACEHOLDER"
    },
    required: true,
    pattern: getPattern("Date"),
    jsonPath: "Properties[0].owners[0].ownerDetails.demandStartdate",
    props: {
        inputProps: {
            max: getTodaysDateInYMD()
        },
        disabled:true
    },
    errorMessage:"RP_ERR_DEMAND_NOTICE_FROM_DATE_FIELD"
  }

  const demandNoticeLastDate = {
    label: {
        labelName: "Demand Notice Last Date",
        labelKey: "RP_DEMAND_NOTICE_LAST_DATE"
    },
    placeholder: {
        labelName: "Enter Demand Notice Last Date",
        labelKey: "RP_DEMAND_DATE_PLACEHOLDER"
    },
    required: true,
    pattern: getPattern("Date"),
    jsonPath: "Properties[0].owners[0].ownerDetails.demandlastdate",
    props: {
        inputProps: {
            max: getTodaysDateInYMD()
        },
        disabled:true
    },
    errorMessage:"RP_ERR_DEMAND_NOTICE_LAST_DATE_FIELD"
  }
  const recoveryType = {
    label: {
        labelName: "Recovery Type",
        labelKey: "RP_RECOVERY_TYPE"
    },
    placeholder: {
        labelName: "Enter Recovery Type",
        labelKey: "RP_RECOVERY_TYPE_PLACEHOLDER"
    },
    required: true,
    jsonPath: "Properties[0].colony",
    optionValue: "code",
    optionLabel: "label",
    sourceJsonPath: "applyScreenMdmsData.propertyTypes",
    jsonPath: "Properties[0].owners[0].ownerDetails.recoveryType",
    errorMessage:"RP_ERR_RECOVERY_TYPE_FIELD"
}

const recoveryTypeField = {
    ...recoveryType,
    beforeFieldChange: (action, state, dispatch) => {
        const rentedPropertyColonies = get(state.screenConfiguration.preparedFinalObject, "applyScreenMdmsData.rentedPropertyColonies") || []
        const findItem = rentedPropertyColonies.find(item => item.code === action.value)
      },
      afterFieldChange:(action, state, dispatch)=>{
        getRecoveryValueProperty(action, state, dispatch);
      }
}

const paymentAmountFieldNotice = {
    label: {
        labelName: "Due Amount",
        labelKey: "RP_DUE_AMOUNT_LABEL"
    },
    placeholder: {
        labelName: "Enter Due Amount",
        labelKey: "RP_ENTER_DUE_AMOUNT"
    },
    minLength: 1,
    //maxLength: 8,
    required: true,
    jsonPath: "Properties[0].owners[0].ownerDetails.payment[0].amountPaid",
    errorMessage:"RP_ERR_DUE_AMOUNT_FIELD"

}
const getOwnerDetailsForNotice = () => {
    return {
        header: rentHolderHeader,
        detailsContainer: getCommonContainer({
        fatherOrHusbandsName:getTextField(fatherOrHusbandsNameField),
        originalAllotte :getTextField(originalAllotteField),
        // violations:getTextField(getViolationField),
        editor : getTextField(getEditorField),
        })
    }
}
const getOwnerDetailsForViolationNotice = () => {
    return {
        header: rentHolderHeader,
        detailsContainer: getCommonContainer({
        fatherOrHusbandsName:getTextField(fatherOrHusbandsNameField),
        originalAllotte :getTextField(originalAllotteField),
        violations:getTextField(getViolationField),
        editor : getTextField(getEditorField),
        })
    }
}

const getPropertyDetailsForNotice = () => {
    return {
        header: propertyHeader,
        detailsContainer: getCommonContainer({
            transitNumber: getTextField(transitNumberField),
            allotmentNumber: getTextField(allotmentNumberField),
            memoDate: getDateField(allotmentDateField),
        })
    }
}
const getPaymentDetailsNotice = () => {
    return {
            detailsContainer: getCommonContainer({    
            demandNoticeFromDate: getDateField(demandNoticeFromDate),
            demandNoticeLastDate: getDateField(demandNoticeLastDate),
            recoveryType: getSelectField(recoveryTypeField),
            paymentAmount: getTextField(paymentAmountFieldNotice),
        })
    }
}

export const ownerDetailsForNotice = getCommonCard(getOwnerDetailsForNotice())
export const ownerDetailsForViolationNotice = getCommonCard(getOwnerDetailsForViolationNotice())
export const noticePropertyDetails = getCommonCard(getPropertyDetailsForNotice())

export const paymentDetailsNotice=getCommonCard(getPaymentDetailsNotice())









