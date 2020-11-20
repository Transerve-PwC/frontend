import { getLocaleLabels } from "egov-ui-framework/ui-utils/commons";

export const WF_PROPERTY_MASTER = "ES-EB-PropertyMaster"
export const ES_MONTH = getLocaleLabels("ES_MONTH", "ES_MONTH")
export const ES_RENT_DUE = getLocaleLabels("ES_RENT_DUE", "ES_RENT_DUE")
export const ES_RENT_RECEIVED = getLocaleLabels("ES_RENT_RECEIVED", "ES_RENT_RECEIVED")
export const ES_RECEIPT_NO = getLocaleLabels("ES_RECEIPT_NO", "ES_RECEIPT_NO")
export const ES_DATE = getLocaleLabels("ES_DATE", "ES_DATE")
export const ES_RENT_DUE_DATE = getLocaleLabels("ES_RENT_DUE_DATE", "ES_RENT_DUE_DATE")
export const ES_PENALTY_INTEREST = getLocaleLabels("ES_PENALTY_INTEREST", "ES_PENALTY_INTEREST")
export const ES_ST_GST_RATE = getLocaleLabels("ES_ST_GST_RATE", "ES_ST_GST_RATE")
export const ES_ST_GST_DUE = getLocaleLabels("ES_ST_GST_DUE", "ES_ST_GST_DUE")
export const ES_PAID = getLocaleLabels("ES_PAID", "ES_PAID")
export const ES_DATE_OF_RECEIPT = getLocaleLabels("ES_DATE_OF_RECEIPT", "ES_DATE_OF_RECEIPT")
export const ES_NO_OF_DAYS = getLocaleLabels("ES_NO_OF_DAYS", "ES_NO_OF_DAYS")
export const ES_INTEREST_ON_DELAYED_PAYMENT = getLocaleLabels("ES_INTEREST_ON_DELAYED_PAYMENT", "ES_INTEREST_ON_DELAYED_PAYMENT")
export const ESTATE_SERVICES_MDMS_MODULE = "EstateServices"
export const WF_ALLOTMENT_OF_SITE = "ES-EB-AllotmentOfSite";
export const ESTATE_APPROVED_STATE = "ES_APPROVED";
export const ESTATE_DRAFTED_STATE = "ES_DRAFTED";
export const WF_BB_PROPERTY_MASTER = "ES-BB-PropertyMaster";
export const BB_PM_APPROVED_STATE = "ES_PM_APPROVED";
export const ESTATE_PROPERTY_MASTER_BILLING_BUSINESS_SERVICE = "ESTATE_SERVICE_ESTATE_BRANCH.PROPERTY_MASTER";
export const WF_MM_PROPERTY_MASTER = "ES-MM-PropertyMaster";

export const BUILDING_BRANCH_TABS = [
  {
    tabButton: { labelName: "Property Details", labelKey: "ES_PROPERTY_DETAILS" }
  },
  {
    tabButton: { labelName: "Owner Details", labelKey: "ES_OWNER_DETAILS" }
  },
  {
    tabButton: { labelName: "Owner Documents", labelKey: "ES_OWNER_DOCUMENTS" }
  }
]

export const MANIMAJRA_BRANCH_TABS = [
  {
    tabButton: { labelName: "Property Details", labelKey: "ES_PROPERTY_DETAILS" }
  },
  {
    tabButton: { labelName: "Owner Details", labelKey: "ES_OWNER_DETAILS" }
  },
  {
    tabButton: { labelName: "Owner Documents", labelKey: "ES_OWNER_DOCUMENTS" }
  },
  {
    tabButton: { labelName: "Previous Owner Details", labelKey: "ES_PREVIOUS_OWNER_DETAILS" }
  },
  {
    tabButton: { labelName: "Previous Owner Documents", labelKey: "ES_PREVIOUS_OWNER_DOCUMENTS" }
  },
  {
    tabButton: { labelName: "Payment Details", labelKey: "ES_PAYMENT_DETAILS" }
  },
  {
    tabButton: { labelName: "Court Case", labelKey: "ES_COURT_CASE" }
  }
]