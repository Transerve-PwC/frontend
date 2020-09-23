import {
  getCommonGrayCard,
  getCommonSubHeader,
  getCommonContainer,
  getLabelWithValue as _getLabelWithValue,
  getDivider,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { changeStep } from "./footer";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { convertEpochToDate, calculateAge, getLicensePeriod } from "../../utils";
import { RC_PEDAL_RICKSHAW_LOADING_REHRI, DL_PEDAL_RICKSHAW_LOADING_REHRI, LICENSE_DHOBI_GHAT, RENEWAL_RENT_DEED_SHOP } from "../../../../../ui-constants";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import set from "lodash/set";

function getLabelWithValue(...params) {
    const label = _getLabelWithValue(...params);
    label.gridDefination.xs = 12;
    return label;
}

export const CONST_VALUES = {REGISTRATION_CERTIFICATE_FOR_PEDAL_RICKSHAW_LOADING_REHRI : RC_PEDAL_RICKSHAW_LOADING_REHRI, 
    DRIVING_LICENSE_FOR_PEDAL_RICKSHAW_LOADING_REHRI : DL_PEDAL_RICKSHAW_LOADING_REHRI,
    LICENSE_FOR_DHOBI_GHAT: LICENSE_DHOBI_GHAT,
    RENEWAL_OF_RENT_DEED_OF_PLATFORMSHOP_AT_OLD_BOOK_MARKET: RENEWAL_RENT_DEED_SHOP}

const accessoriesCard = {
  uiFramework: "custom-containers",
  componentPath: "MultiItem",
  props: {
      className: "review-trade-search-preview",
      scheama: getCommonGrayCard({
          accessoriesCardContainer: getCommonContainer({
              reviewAccessoryType: getLabelWithValue(
                  {
                      labelName: "Accesory Type",
                      labelKey: "TL_REVIEWACCESSORY_TYPE_LABEL"
                  },
                  {
                      jsonPath:
                          "Licenses[0].tradeLicenseDetail.accessories[0].accessoryCategory",
                      localePrefix: {
                          moduleName: "TRADELICENSE",
                          masterName: "ACCESSORIESCATEGORY"
                      }
                  }
              ),
              reviewAccessoryUOM: getLabelWithValue(
                  {
                      labelName: "UOM",
                      labelKey: "TL_NEW_TRADE_DETAILS_UOM_UOM_PLACEHOLDER"
                  },
                  { jsonPath: "Licenses[0].tradeLicenseDetail.accessories[0].uom" }
              ),
              reviewAccessoryUOMValue: getLabelWithValue(
                  {
                      labelName: "UOM Value",
                      labelKey: "TL_NEW_TRADE_DETAILS_UOM_VALUE_LABEL"
                  },
                  { jsonPath: "Licenses[0].tradeLicenseDetail.accessories[0].uomValue" }
              ),
              reviewAccessoryCount: getLabelWithValue(
                  {
                      labelName: "Accessory Count",
                      labelKey: "TL_NEW_TRADE_ACCESSORY_COUNT"
                  },
                  { jsonPath: "Licenses[0].tradeLicenseDetail.accessories[0].count" }
              )
          })
      }),

      items: [],
      hasAddItem: false,
      isReviewPage: true,
      sourceJsonPath: "Licenses[0].tradeLicenseDetail.accessories",
      prefixSourceJsonPath:
          "children.cardContent.children.accessoriesCardContainer.children",
      afterPrefixJsonPath: "children.value.children.key"
  },
  type: "array"
};

const tradeTypeCard = {
  uiFramework: "custom-containers",
  componentPath: "MultiItem",
  props: {
      className: "review-trade-search-preview",
      scheama: getCommonGrayCard({
          tradeTypeCardContainer: getCommonContainer({
              reviewTradeCategory: getLabelWithValue(
                  {
                      labelName: "Trade Category",
                      labelKey: "TL_NEW_TRADE_DETAILS_TRADE_CAT_LABEL"
                  },
                  {
                      jsonPath: "Licenses[0].tradeLicenseDetail.tradeUnits[0].tradeType",
                      localePrefix: {
                          moduleName: "TRADELICENSE",
                          masterName: "TRADETYPE"
                      },
                      callBack: value => {
                          return value.split(".")[0];
                      }
                  }
              ),
              reviewTradeType: getLabelWithValue(
                  {
                      labelName: "Trade Type",
                      labelKey: "TL_NEW_TRADE_DETAILS_TRADE_TYPE_LABEL"
                  },
                  {
                      jsonPath: "Licenses[0].tradeLicenseDetail.tradeUnits[0].tradeType",
                      localePrefix: {
                          moduleName: "TRADELICENSE",
                          masterName: "TRADETYPE"
                      },
                      callBack: value => {
                          return value.split(".")[1];
                      }
                  }
              ),
              reviewTradeSubtype: getLabelWithValue(
                  {
                      labelName: "Trade Sub-Type",
                      labelKey: "TL_NEW_TRADE_DETAILS_TRADE_SUBTYPE_LABEL"
                  },
                  {
                      jsonPath: "Licenses[0].tradeLicenseDetail.tradeUnits[0].tradeType",
                      localePrefix: {
                          moduleName: "TRADELICENSE",
                          masterName: "TRADETYPE"
                      }
                  }
              ),

              reviewTradeUOM: getLabelWithValue(
                  {
                      labelName: "UOM (Unit of Measurement)",
                      labelKey: "TL_NEW_TRADE_DETAILS_UOM_LABEL"
                  },
                  { jsonPath: "Licenses[0].tradeLicenseDetail.tradeUnits[0].uom" }
              ),
              reviewTradeUOMValue: getLabelWithValue(
                  {
                      labelName: "UOM Value",
                      labelKey: "TL_NEW_TRADE_DETAILS_UOM_VALUE_LABEL"
                  },
                  { jsonPath: "Licenses[0].tradeLicenseDetail.tradeUnits[0].uomValue" }
              )
          })
      }),
      items: [],
      hasAddItem: false,
      isReviewPage: true,
      sourceJsonPath: "Licenses[0].tradeLicenseDetail.tradeUnits",
      prefixSourceJsonPath:
          "children.cardContent.children.tradeTypeCardContainer.children",
      afterPrefixJsonPath: "children.value.children.key"
  },
  type: "array"
};

const tradeLicenseType = getQueryArg(window.location.href, "tlType");

const tradeTypeLabel = {
    labelName: "Trade Type",
    labelKey: "TL_TABLE_TRADE_TYPE_LABEL"
}
const serviceTypeLabel = {
    labelName: "Service Type",
    labelKey: "TL_TABLE_SERVICE_TYPE_LABEL"
}
const tradeTypeValue = {
    jsonPath: "Licenses[0].businessService"
}

const applicantTypeLabel = {
    labelName: "Application Type",
    labelKey: "TL_APPLICATION_TYPE_LABEL"
}
const applicationTypeValue = {
    jsonPath: "Licenses[0].applicationType"
}

const oldLicenseNumberLabel = {
    labelName: "Old License Number",
    labelKey: "TL_OLD_LICENSE_NUMBER_LABEL"
}
const oldLicenseNumberValue = {
    jsonPath: "Licenses[0].oldLicenseNumber",
}

const oldLicenseValidToLabel = {
    labelName: "Old License Validity Date",
    labelKey: "TL_OLD_LICENSE_VALIDITY_DATE_LABEL"
}
const oldLicenseValidToValue = {
    jsonPath: "Licenses[0].tradeLicenseDetail.additionalDetail.oldLicenseValidTo",
    callBack: convertEpochToDate
}

const applicantNameLabel = {
    labelName: "Applicant Name",
    labelKey: "TL_APPLICANT_NAME_LABEL"
}
const applicantNameValue = {
    jsonPath: "Licenses[0].tradeLicenseDetail.owners[0].name"
}

const fatherOrHusbandsNameLabel = {
    labelName: "Father/Husband's Name",
    labelKey: "TL_FATHER_OR_HUSBANDS_NAME_LABEL"
}
const fatherOrHusbandsNameValue = {
        jsonPath: "Licenses[0].tradeLicenseDetail.owners[0].fatherOrHusbandName"
    }

const relationLabel = {
    labelName: "Relationship",
    labelKey: "TL_COMMON_RELATIONSHIP_LABEL"
}

const relationValue = {
    jsonPath: "Licenses[0].tradeLicenseDetail.owners[0].relationship",
    localePrefix: {
        moduleName: "COMMON",
        masterName: "RELATION"
      }
}

const fullAddressLabel = {
    labelName: "Full Address",
    labelKey: "TL_FULL_ADDRESS_LABEL"
}
const fullAddressValue = {
    jsonPath: "Licenses[0].tradeLicenseDetail.owners[0].permanentAddress"
}

const occupationLabel = {
    labelName: "Occupation",
    labelKey: "TL_OCCUPATION_LABEL"
}
const occupationValue = {
    jsonPath: "Licenses[0].tradeLicenseDetail.additionalDetail.occupation"
}

const dobLabel = {
    labelName: "Date Of Birth",
    labelKey: "TL_DOB_LABEL"
}
const dobValue = {
    jsonPath: "Licenses[0].tradeLicenseDetail.owners[0].dob",
    callBack: convertEpochToDate
}

const ageLabel = {
    labelName: "Age",
    labelKey: "TL_AGE_LABEL"
}
const ageValue = {
    jsonPath: "Licenses[0].tradeLicenseDetail.owners[0].dob",
    callBack: calculateAge
}

const licensePeriodLabel = {
    labelName: "License Period",
    labelKey: "TL_LICENSE_PERIOD_LABEL"
}
const licensePeriodValue = {
    jsonPath: "Licenses[0].tradeLicenseDetail.additionalDetail.licensePeriod",
    callBack: getLicensePeriod
}

const mobileNumberLabel = {
    labelName: "Mobile No.",
    labelKey: "TL_MOBILE_NO_LABEL"
}
const mobileNumberValue = {
    jsonPath: "Licenses[0].tradeLicenseDetail.owners[0].mobileNumber"
}

const emailAddressLabel = {
    labelName: "Email Address",
    labelKey: "TL_EMAIL_LABEL"
}
const emailAddressValue = {
    jsonPath: "Licenses[0].tradeLicenseDetail.owners[0].emailId"
}

const tradeLabel = {
    labelName: "Trade",
    labelKey: "TL_TRADE_LABEL"
}
const tradeValue = {
    jsonPath: "Licenses[0].tradeLicenseDetail.additionalDetail.tradeValue"
}

const particularsOfAreaLabel = {
    labelName: "Particulars Of Area",
    labelKey: "TL_PARTICULARS_OF_AREA"
}
const particularsOfAreaValue = {
    jsonPath: "Licenses[0].tradeLicenseDetail.additionalDetail.particularsOfArea"
}

const completeResidentialAddressLabel = {
    labelName: "Complete Residential Address",
    labelKey: "TL_COMPLETE_RESIDENTIAL_ADDRESS_LABEL"
}
const completeResidentialAddressValue = {
    jsonPath: "Licenses[0].tradeLicenseDetail.address.addressLine1"
}

const permanentAddressLabel = {
    labelName: "Permanent Address",
    labelKey: "TL_PERMANENT_ADDRESS_LABEL"
}
const permanentAddressValue = {
    jsonPath: "Licenses[0].tradeLicenseDetail.owners[0].permanentAddress"
}

const platformNumberLabel = {
    labelName: "Platform/Shop Number",
    labelKey: "TL_PLATFORM_NUMBER_LABEL"
}
const platformNumberValue = {
    jsonPath: "Licenses[0].tradeLicenseDetail.additionalDetail.platformNumber"
}

const placeOfWorkLabel = {
    labelName: "Place of Work",
    labelKey: "TL_PLACE_OF_WORK_LABEL"
}
const placeOfWorkValue = {
    jsonPath: "Licenses[0].tradeLicenseDetail.additionalDetail.placeOfWork"
}

const businessStartDateLabel = {
    labelName: "Date from when doing Business at Site",
    labelKey: "TL_BUSINESS_START_DATE_LABEL"
}
const businessStartDateValue = {
    jsonPath: "Licenses[0].tradeLicenseDetail.additionalDetail.businessStartDate",
    callBack: convertEpochToDate
}

const familyMonthlyIncomeLabel = {
    labelName: "Family Monthly Income from all sources",
    labelKey: "TL_FAMILY_MONTHLY_INCOME_LABEL"
}
const familyMonthlyIncomeValue = {
    jsonPath: "Licenses[0].tradeLicenseDetail.additionalDetail.familyMonthlyIncome"
}

export const getReviewDetails = ( state, dispatch,screenName, screenpath1, screenpath2, isEditable = false) => {
        const {businessService} = state.screenConfiguration.preparedFinalObject.Licenses[0]
        const {reviewTradeDetailsObj, reviewOwnerDetailsObj} = getReviewTradeDetailsObj(businessService, isEditable);
        dispatch(
            handleField(
                screenName,
                screenpath1,
                "children",
                reviewTradeDetailsObj
            )
          );
        dispatch(
            handleField(
                screenName,
                screenpath2,
                "children",
                reviewOwnerDetailsObj
            )
          );
        // set(
        //     action.screenConfig,
        //     screenpath,
        //     obj
        //   )
}

export const getReviewTradeDetailsObj = (licenseType, isEditable) => {
    var reviewTradeDetailsObj = {}
    var reviewOwnerDetailsObj = {}
    // if (!isEditable) {
        reviewTradeDetailsObj['tradeType'] = getLabelWithValue(tradeTypeLabel, {...tradeTypeValue, localePrefix: {
            moduleName: "TL",
            masterName: "GROUP"
        }})
        reviewTradeDetailsObj['serviceType'] = getLabelWithValue(serviceTypeLabel, {...tradeTypeValue, localePrefix: {
            moduleName: "TL",
            masterName: "SHORT"
        }})
    // }
    if (licenseType == RC_PEDAL_RICKSHAW_LOADING_REHRI) {
        reviewTradeDetailsObj["applicationType"] = getLabelWithValue(applicantTypeLabel, applicationTypeValue);
        reviewTradeDetailsObj["oldLicenseNumber"] = getLabelWithValue(oldLicenseNumberLabel, oldLicenseNumberValue);
        reviewTradeDetailsObj["oldLicenseValidTo"] = getLabelWithValue(oldLicenseValidToLabel, oldLicenseValidToValue);
        reviewOwnerDetailsObj["applicantName"] = getLabelWithValue(applicantNameLabel, applicantNameValue);
        reviewOwnerDetailsObj["fatherOrHusbandsName"] = getLabelWithValue(fatherOrHusbandsNameLabel, fatherOrHusbandsNameValue);
        reviewOwnerDetailsObj["relation"] = getLabelWithValue(relationLabel, relationValue);
        reviewOwnerDetailsObj["occupation"] = getLabelWithValue(occupationLabel, occupationValue);
        reviewOwnerDetailsObj["fullAddress"] = getLabelWithValue(fullAddressLabel, fullAddressValue);
        reviewOwnerDetailsObj["dateOfBirth"] = getLabelWithValue(dobLabel, dobValue);
        reviewOwnerDetailsObj["age"] = getLabelWithValue(ageLabel, ageValue);
        reviewTradeDetailsObj["licensePeriod"] = getLabelWithValue(licensePeriodLabel, licensePeriodValue);
        reviewOwnerDetailsObj["mobileNumber"] = getLabelWithValue(mobileNumberLabel, mobileNumberValue);
        reviewOwnerDetailsObj["emailAddress"] = getLabelWithValue(emailAddressLabel, emailAddressValue);

        return {reviewTradeDetailsObj, reviewOwnerDetailsObj};
    }
    if (licenseType == DL_PEDAL_RICKSHAW_LOADING_REHRI) {
        reviewTradeDetailsObj["applicationType"] = getLabelWithValue(applicantTypeLabel, applicationTypeValue);
        reviewTradeDetailsObj["oldLicenseNumber"] = getLabelWithValue(oldLicenseNumberLabel, oldLicenseNumberValue);
        reviewTradeDetailsObj["oldLicenseValidTo"] = getLabelWithValue(oldLicenseValidToLabel, oldLicenseValidToValue);
        reviewOwnerDetailsObj["applicantName"] = getLabelWithValue(applicantNameLabel, applicantNameValue);
        reviewOwnerDetailsObj["fatherOrHusbandsName"] = getLabelWithValue(fatherOrHusbandsNameLabel, fatherOrHusbandsNameValue);
        reviewOwnerDetailsObj["relation"] = getLabelWithValue(relationLabel, relationValue);
        reviewOwnerDetailsObj["occupation"] = getLabelWithValue(occupationLabel, occupationValue);
        reviewOwnerDetailsObj["fullAddress"] = getLabelWithValue(fullAddressLabel, fullAddressValue);
        reviewOwnerDetailsObj["dateOfBirth"] = getLabelWithValue(dobLabel, dobValue);
        reviewOwnerDetailsObj["age"] = getLabelWithValue(ageLabel, ageValue);
        reviewTradeDetailsObj["licensePeriod"] = getLabelWithValue(licensePeriodLabel, licensePeriodValue);
        reviewOwnerDetailsObj["mobileNumber"] = getLabelWithValue(mobileNumberLabel, mobileNumberValue);
        reviewOwnerDetailsObj["emailAddress"] = getLabelWithValue(emailAddressLabel, emailAddressValue);
        
        return {reviewTradeDetailsObj, reviewOwnerDetailsObj};
    }
    if (licenseType == LICENSE_DHOBI_GHAT) {
        reviewTradeDetailsObj["applicationType"] = getLabelWithValue(applicantTypeLabel, applicationTypeValue);
        reviewTradeDetailsObj["oldLicenseNumber"] = getLabelWithValue(oldLicenseNumberLabel, oldLicenseNumberValue);
        reviewOwnerDetailsObj["applicantName"] = getLabelWithValue(applicantNameLabel, applicantNameValue);
        reviewOwnerDetailsObj["fatherOrHusbandsName"] = getLabelWithValue(fatherOrHusbandsNameLabel, fatherOrHusbandsNameValue);
        reviewOwnerDetailsObj["relation"] = getLabelWithValue(relationLabel, relationValue);
        reviewOwnerDetailsObj["fullAddress"] = getLabelWithValue(fullAddressLabel, fullAddressValue);
        reviewOwnerDetailsObj["dateOfBirth"] = getLabelWithValue(dobLabel, dobValue);
        reviewOwnerDetailsObj["age"] = getLabelWithValue(ageLabel, ageValue);
        reviewTradeDetailsObj["trade"] = getLabelWithValue(tradeLabel, tradeValue);
        reviewTradeDetailsObj["particularsOfArea"] = getLabelWithValue(particularsOfAreaLabel, particularsOfAreaValue);
        reviewTradeDetailsObj["licensePeriod"] = getLabelWithValue(licensePeriodLabel, licensePeriodValue);
        reviewOwnerDetailsObj["mobileNumber"] = getLabelWithValue(mobileNumberLabel, mobileNumberValue);
        reviewOwnerDetailsObj["emailAddress"] = getLabelWithValue(emailAddressLabel, emailAddressValue);

        return {reviewTradeDetailsObj, reviewOwnerDetailsObj};
    }
    if (licenseType == RENEWAL_RENT_DEED_SHOP) {
        reviewOwnerDetailsObj["applicantName"] = getLabelWithValue(applicantNameLabel, applicantNameValue);
        reviewOwnerDetailsObj["fatherOrHusbandsName"] = getLabelWithValue(fatherOrHusbandsNameLabel, fatherOrHusbandsNameValue);
        reviewOwnerDetailsObj["relation"] = getLabelWithValue(relationLabel, relationValue);
        reviewOwnerDetailsObj["dateOfBirth"] = getLabelWithValue(dobLabel, dobValue);
        reviewOwnerDetailsObj["age"] = getLabelWithValue(ageLabel, ageValue);
        reviewOwnerDetailsObj["completeResidentialAddress"] = getLabelWithValue(completeResidentialAddressLabel, completeResidentialAddressValue);
        reviewOwnerDetailsObj["permanentAddress"] = getLabelWithValue(permanentAddressLabel, permanentAddressValue);
        reviewTradeDetailsObj["platformNumber"] = getLabelWithValue(platformNumberLabel, platformNumberValue);
        reviewTradeDetailsObj["placeOfWork"] = getLabelWithValue(placeOfWorkLabel, placeOfWorkValue);
        reviewTradeDetailsObj["trade"] = getLabelWithValue(tradeLabel, tradeValue);
        reviewTradeDetailsObj["businessStartDate"] = getLabelWithValue(businessStartDateLabel, businessStartDateValue);
        reviewOwnerDetailsObj["familyMonthlyIncome"] = getLabelWithValue(familyMonthlyIncomeLabel, familyMonthlyIncomeValue);
        reviewTradeDetailsObj["licensePeriod"] = getLabelWithValue(licensePeriodLabel, licensePeriodValue);
        reviewOwnerDetailsObj["mobileNumber"] = getLabelWithValue(mobileNumberLabel, mobileNumberValue);
        reviewOwnerDetailsObj["emailAddress"] = getLabelWithValue(emailAddressLabel, emailAddressValue);
        return {reviewTradeDetailsObj, reviewOwnerDetailsObj};
    }
    return false;
}

export const getReviewTrade = (isEditable = true) => {
  return getCommonGrayCard({
      headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",
          props: {
              style: { marginBottom: "10px" }
          },
          children: {
              header: {
                  gridDefination: {
                      xs: 8,
                      sm: 10
                  },
                  ...getCommonSubHeader({
                      labelName: "Trade Details",
                      labelKey: "TL_TRADE_DETAILS_HEADER"
                  })
              },
              editSection: {
                  componentPath: "Button",
                  props: {
                      color: "primary",
                      style: {
                        padding: "0px 16px",
                        minHeight: "initial"
                      }
                  },
                  visible: isEditable,
                  gridDefination: {
                      xs: 4,
                      sm: 2,
                      align: "right"
                  },
                  children: {
                      editIcon: {
                          uiFramework: "custom-atoms",
                          componentPath: "Icon",
                          props: {
                              iconName: "edit"
                          }
                      },
                      buttonLabel: getLabel({
                          labelName: "Edit",
                          labelKey: "TL_SUMMARY_EDIT"
                      })
                  },
                  onClickDefination: {
                      action: "condition",
                      callBack: (state, dispatch) => {
                          changeStep(state, dispatch, "", 0);
                      }
                  }
              }
          }
      },
      viewOne: getCommonContainer({}),
    //   div1: getDivider(),
      // viewTwo: tradeTypeCard,
      // div2: getDivider(),
      // viewThree: accessoriesCard,

      // div3: getDivider(),
/*         viewFour: getCommonContainer({
          reviewPropertyID: getLabelWithValue(
              {
                  labelName: "Property Assessment ID",
                  labelKey: "TL_EMP_APPLICATION_PT_ASS_ID"
              },
              { jsonPath: "Licenses[0].propertyId" }
          ),
          reviewCity: getLabelWithValue(
              {
                  labelName: "City",
                  labelKey: "TL_NEW_TRADE_DETAILS_CITY_LABEL"
              },
              {
                  jsonPath: "Licenses[0].tradeLicenseDetail.address.city",
                  localePrefix: {
                      moduleName: "TENANT",
                      masterName: "TENANTS"
                  }
              }
          ),
          reviewDoorNo: getLabelWithValue(
              {
                  labelName: "Door/House No.",
                  labelKey: "TL_NEW_TRADE_DETAILS_DOOR_NO_LABEL"
              },
              { jsonPath: "Licenses[0].tradeLicenseDetail.address.doorNo" }
          ),
          reviewBuildingName: getLabelWithValue(
              {
                  labelName: "Building/Company Name",
                  labelKey: "TL_NEW_TRADE_DETAILS_BLDG_NAME_LABEL"
              },
              { jsonPath: "Licenses[0].tradeLicenseDetail.address.buildingName" }
          ),
          reviewStreetName: getLabelWithValue(
              {
                  labelName: "Street Name",
                  labelKey: "TL_NEW_TRADE_DETAILS_SRT_NAME_LABEL"
              },
              { jsonPath: "Licenses[0].tradeLicenseDetail.address.street" }
          ),
          reviewMohalla: getLabelWithValue(
              {
                  labelName: "Mohalla",
                  labelKey: "TL_NEW_TRADE_DETAILS_MOHALLA_LABEL"
              },
              { jsonPath: "Licenses[0].tradeLicenseDetail.address.locality.name" }
          ),
          reviewPincode: getLabelWithValue(
              {
                  labelName: "Pincode",
                  labelKey: "TL_NEW_TRADE_DETAILS_PIN_LABEL"
              },
              { jsonPath: "Licenses[0].tradeLicenseDetail.address.pincode" }
          ),
          reviewElectricityNo: getLabelWithValue(
              {
                  labelName: "Electricity Connection No.",
                  labelKey: "TL_NEW_TRADE_DETAILS_ELEC_CON_NO_LABEL"
              },
              {
                  jsonPath:
                      "Licenses[0].tradeLicenseDetail.additionalDetail.electricityConnectionNo"
              }
          )
      }) */
  });
};

export const getReviewOwner = (isEditable = true) => {
    return getCommonGrayCard({
        headerDiv: {
            uiFramework: "custom-atoms",
            componentPath: "Container",
            props: {
                style: { marginBottom: "10px" }
            },
            children: {
                header: {
                    gridDefination: {
                        xs: 8,
                        sm: 10
                    },
                    ...getCommonSubHeader({
                        labelName: "Owner Details",
                        labelKey: "TL_OWNER_DETAILS_HEADER"
                    })
                },
                editSection: {
                    componentPath: "Button",
                    props: {
                        color: "primary",
                        style: {
                            padding: "0px 16px",
                            minHeight: "initial"
                        }
                    },
                    visible: isEditable,
                    gridDefination: {
                        xs: 4,
                        sm: 2,
                        align: "right"
                    },
                    children: {
                        editIcon: {
                            uiFramework: "custom-atoms",
                            componentPath: "Icon",
                            props: {
                                iconName: "edit"
                            }
                        },
                        buttonLabel: getLabel({
                            labelName: "Edit",
                            labelKey: "TL_SUMMARY_EDIT"
                        })
                    },
                    onClickDefination: {
                        action: "condition",
                        callBack: (state, dispatch) => {
                            changeStep(state, dispatch, "", 0);
                        }
                    }
                }
            }
        },
        viewOne: getCommonContainer({})
    })
}