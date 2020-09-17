import {
    getCommonCard,
    getSelectField,
    getTextField,
    getDateField,
    getCommonTitle,
    getPattern,
    getCommonContainer,
    getCommonGrayCard,
    getLabel,
    dispatchMultipleFieldChangeAction
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import {
    prepareFinalObject,
    handleScreenConfigurationFieldChange as handleField,
  } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { get } from "lodash";
import { getActionDefinationForOwnerDetailsFields } from './ownerDetails'

  
  export const auctionDetailsHeader = getCommonTitle({
    labelName: "Company Details",
    labelKey: "EST_COMPANY_DETAILS_HEADER"
  }, {
    style: {
      marginBottom: 18,
      marginTop: 18
    }
  })
  
  const getIsCompanyRegisteredRadioButton = {
    uiFramework: "custom-containers",
    componentPath: "RadioGroupContainer",
    gridDefination: {
      xs: 12,
      sm: 12,
    },
    jsonPath: "Properties[0].propertyDetails.isCompanyRegistered",
    props: {
      label: {
        name: "Is Company Registered",
        key: "EST_IS_COMPANY_REGISTERED_LABEL"
      },
      buttons: [{
          labelName: "YES",
          labelKey: "COMMON_YES",
          value: "YES"
        },
        {
          label: "NO",
          labelKey: "COMMON_NO",
          value: "NO"
        }
      ],
      jsonPath: "Properties[0].propertyDetails.isCompanyRegistered",
      required: true,
      value: "YES"
    },
    required: true,
    type: "array",
    beforeFieldChange: (action, state, dispatch) => {
      let propertyPartnersItems = get(
        state.screenConfiguration.screenConfig,
        "allotment.components.div.children.formwizardThirdStepAllotment.children.CompanyDetails.children.cardContent.children.partnerDetails.children.multipleApplicantContainer.children.multipleApplicantInfo.props.items"
      );
      let propertyOwnersItems = get(
        state.screenConfiguration.screenConfig,
        "allotment.components.div.children.formwizardFifthStepAllotment.children.ownerDetails.children.cardContent.children.detailsContainer.children.multipleApplicantContainer.children.multipleApplicantInfo.props.items"
      );
      if (action.value == "NO") {
        dispatchMultipleFieldChangeAction(
          "allotment",
          getActionDefinationForCompanyDetailsFields(true),
          dispatch
        );
        dispatchMultipleFieldChangeAction(
          "allotment",
          getActionDefinationForPartnerDetailsFields(true, propertyPartnersItems.length),
          dispatch
        );
        dispatchMultipleFieldChangeAction(
          "allotment",
          getActionDefinationForOwnerDetailsFields(false, propertyOwnersItems.length),
          dispatch
        );
      }
      else {
        dispatchMultipleFieldChangeAction(
          "allotment",
          getActionDefinationForCompanyDetailsFields(false),
          dispatch
        );
        dispatchMultipleFieldChangeAction(
          "allotment",
          getActionDefinationForPartnerDetailsFields(false, propertyPartnersItems.length),
          dispatch
        );
        dispatchMultipleFieldChangeAction(
          "allotment",
          getActionDefinationForOwnerDetailsFields(true, propertyOwnersItems.length),
          dispatch
        );
      }
    }
  };

  const companyNameField = {
    label: {
      labelName: "Company Name",
      labelKey: "EST_COMPANY_NAME_LABEL"
    },
    placeholder: {
      labelName: "Enter Company Name",
      labelKey: "EST_COMPANY_NAME_PLACEHOLDER"
    },
    gridDefination: {
      xs: 12,
      sm: 6
    },
    maxLength: 250,
    jsonPath: "Properties[0].propertyDetails.companyName"
  }
  
  const companyAddressField = {
    label: {
      labelName: "Company Address",
      labelKey: "EST_ESTATE_COMPANY_ADDRESS_LABEL"
    },
    placeholder: {
      labelName: "Enter Company Address",
      labelKey: "EST_ESTATE_COMPANY_ADDRESS_PLACEHOLDER"
    },
    gridDefination: {
      xs: 12,
      sm: 6
    },
    maxLength: 250,
    jsonPath: "Properties[0].propertyDetails.companyAddress"
  }
  
  const companyRegNoField = {
    label: {
      labelName: "Company Registration Number",
      labelKey: "EST_COMPANY_REG_NO_LABEL"
    },
    placeholder: {
      labelName: "Enter Company Registration Number",
      labelKey: "EST_COMPANY_REG_NO_PLACEHOLDER"
    },
    gridDefination: {
      xs: 12,
      sm: 6
    },
    maxLength: 250,
    jsonPath: "Properties[0].propertyDetails.companyRegNo"
  }
  
  const companyTypeField = {
    label: {
      labelName: "Company Type",
      labelKey: "EST_COMPANY_TYPE_LABEL"
    },
    placeholder: {
      labelName: "Enter Company Type",
      labelKey: "EST_COMPANY_TYPE_PLACEHOLDER"
    },
    gridDefination: {
      xs: 12,
      sm: 6
    },
    maxLength: 250,
    jsonPath: "Properties[0].propertyDetails.companyType"
  }
  
  const CompanyShareholderNameField = {
    label: {
      labelName: "Company Shareholder Name",
      labelKey: "EST_COMPANY_SHAREHOLDER_NAME_LABEL"
    },
    placeholder: {
      labelName: "Enter Company Shareholder Name",
      labelKey: "EST_COMPANY_SHAREHOLDER_NAME_PLACEHOLDER"
    },
    gridDefination: {
      xs: 12,
      sm: 6
    },
    maxLength: 250,
    jsonPath: "Properties[0].propertyDetails.companyShareHolderName"
  }
  
  const companyShare = {
    label: {
      labelName: "Company Share %",
      labelKey: "EST_COMPANY_SHARE_LABEL"
    },
    placeholder: {
      labelName: "Enter Company Share %",
      labelKey: "EST_COMPANY_SHARE_PLACEHOLDER"
    },
    gridDefination: {
      xs: 12,
      sm: 6
    },
    maxLength: 250,
    jsonPath: "Properties[0].propertyDetails.companyShare"
  }

  const PartnerName = {
    label: {
      labelName: "Partner Name",
      labelKey: "EST_PARTNER_NAME_LABEL"
    },
    placeholder: {
      labelName: "Enter Partner Name",
      labelKey: "EST_PARTNER_NAME_PLACEHOLDER"
    },
    gridDefination: {
      xs: 12,
      sm: 6
    },
    maxLength: 250,
    jsonPath: "Properties[0].propertyDetails.partners[0].partnerDetails.partnerName"
  }

  const PartnerHusbandFatherName = {
    label: {
      labelName: "Father/Husband Name",
      labelKey: "EST_FATHER_HUSBAND_NAME_LABEL"
    },
    placeholder: {
      labelName: "Enter Father/Husband Name",
      labelKey: "EST_FATHER_HUSBAND_NAME_PLACEHOLDER"
    },
    gridDefination: {
      xs: 12,
      sm: 6
    },
    maxLength: 250,
    jsonPath: "Properties[0].propertyDetails.partners[0].partnerDetails.guardianName"
  }

  const partnerAddress = {
    label: {
      labelName: "Partner Address",
      labelKey: "EST_PARTNER_ADDRESS_LABEL"
    },
    placeholder: {
      labelName: "Enter Partner Address",
      labelKey: "EST_PARTNER_ADDRESS_PLACEHOLDER"
    },
    gridDefination: {
      xs: 12,
      sm: 6
    },
    maxLength: 250,
    jsonPath: "Properties[0].propertyDetails.partners[0].partnerDetails.address"
  }

  const partnerMobileNumber = {
    label: {
      labelName: "Partner Mobile Number",
      labelKey: "EST_PARTNER_MOBILE_LABEL"
    },
    placeholder: {
      labelName: "Enter Partner Mobile Number",
      labelKey: "EST_PARTNER_MOBILE_PLACEHOLDER"
    },
    gridDefination: {
      xs: 12,
      sm: 6
    },
    pattern: getPattern("MobileNo"),
    maxLength: 250,
    jsonPath: "Properties[0].propertyDetails.partners[0].partnerDetails.mobileNumber"
  }
  
  const partnerShare = {
    label: {
      labelName: "Partner Share",
      labelKey: "EST_PARTNER_SHARE_LABEL"
    },
    placeholder: {
      labelName: "Enter Partner Share",
      labelKey: "EST_PARTNER_SHARE_PLACEHOLDER"
    },
    gridDefination: {
      xs: 12,
      sm: 6
    },
    maxLength: 250,
    jsonPath: "Properties[0].propertyDetails.partners[0].partnerDetails.share"
  }

  const partnerCPNumber = {
    label: {
      labelName: "Partner CP Number",
      labelKey: "EST_PARTNER_CP_NUMBER_LABEL"
    },
    placeholder: {
      labelName: "Enter Partner CP Number",
      labelKey: "EST_PARTNER_CP_NUMBER_PLACEHOLDER"
    },
    gridDefination: {
      xs: 12,
      sm: 6
    },
    maxLength: 250,
    jsonPath: "Properties[0].propertyDetails.partners[0].partnerDetails.cpNumber"
  }

  const getRelationshipRadioButton = {
    uiFramework: "custom-containers",
    componentPath: "RadioGroupContainer",
    gridDefination: {
      xs: 12,
      sm: 6,
    },
    jsonPath: "Properties[0].propertyDetails.partners[0].partnerDetails.guardianRelation",
    props: {
      label: {
        name: "Relationship",
        key: "EST_RELATIONSHIP_LABEL"
      },
      buttons: [{
          labelName: "Father",
          labelKey: "COMMON_RELATION_FATHER",
          value: "FATHER"
        },
        {
          label: "Husband",
          labelKey: "COMMON_RELATION_HUSBAND",
          value: "HUSBAND"
        }
      ],
      jsonPath: "Properties[0].propertyDetails.partners[0].partnerDetails.guardianRelation",
      // required: true,
    },
    // required: true,
    type: "array",
  };
  
  const commonCompanyDetails = () => {
    return getCommonGrayCard({
      header: getCommonTitle({
        labelName: "Company Details",
        labelKey: "EST_COMPANY_DETAILS"
      }, {
        style: {
          marginBottom: 18
        }
      }),
      isCompanyRegisteredCard: getCommonContainer({
        isCompanyRegistered: getIsCompanyRegisteredRadioButton
      }),
      auctionCard: getCommonContainer({
        companyName: getTextField(companyNameField),
        companyAddressField: getTextField(companyAddressField),
        companyRegNoField: getTextField(companyRegNoField),
        companyTypeField: getTextField(companyTypeField),
        CompanyShareholderNameField: getTextField(CompanyShareholderNameField),
        companyShare: getTextField(companyShare)
      })
    });
  };

  const CompanyPartnerDetails = () => {
    return getCommonGrayCard({
      header: getCommonTitle({
        labelName: "partner Details",
        labelKey: "EST_PARTNER_DETAILS"
      }, {
        style: {
          marginBottom: 18
        }
      }),
      partnerCard: getCommonContainer({
        PartnerName: getTextField(PartnerName),
        PartnerHusbandFatherName: getTextField(PartnerHusbandFatherName),
        relationship: getRelationshipRadioButton,
        partnerAddress: getTextField(partnerAddress),
        partnerMobileNumber: getTextField(partnerMobileNumber),
        partnerShare: getTextField(partnerShare),
        partnerCPNumber: getTextField(partnerCPNumber)
      })
    });
  };

  const partnersCotainer = getCommonContainer({
    multipleApplicantContainer: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        style: {
          width: "100%"
        }
      },
      children: {
        multipleApplicantInfo: {
          uiFramework: "custom-containers",
          componentPath: "MultiItem",
          props: {
            scheama: CompanyPartnerDetails(),
            items: [],
            addItemLabel: {
              labelName: "Add Partner",
              labelKey: "EST_COMMON_ADD_PARTNER_LABEL"
            },
            headerName: "Partner Information",
            headerJsonPath: "children.cardContent.children.header.children.Partner Information.props.label",
            sourceJsonPath: "Properties[0].propertyDetails.partners",
            prefixSourceJsonPath: "children.cardContent.children.auctionCard.children"
          },
          type: "array"
        }
      }
    }
  })

  
  export const CompanyDetails = getCommonCard({
    header: auctionDetailsHeader,
    companyDetails: commonCompanyDetails(),
    partnerDetails: partnersCotainer
  })

  export const getActionDefinationForCompanyDetailsFields = (disabled = true) => {
    const actionDefination = [{
      path: "components.div.children.formwizardThirdStepAllotment.children.CompanyDetails.children.cardContent.children.companyDetails.children.cardContent.children.auctionCard.children.CompanyShareholderNameField",
      property: "props.disabled",
      value: disabled
    },
    {
      path: "components.div.children.formwizardThirdStepAllotment.children.CompanyDetails.children.cardContent.children.companyDetails.children.cardContent.children.auctionCard.children.companyAddressField",
      property: "props.disabled",
      value: disabled
    },
    {
      path: "components.div.children.formwizardThirdStepAllotment.children.CompanyDetails.children.cardContent.children.companyDetails.children.cardContent.children.auctionCard.children.companyName",
      property: "props.disabled",
      value: disabled
    },
    {
      path: "components.div.children.formwizardThirdStepAllotment.children.CompanyDetails.children.cardContent.children.companyDetails.children.cardContent.children.auctionCard.children.companyRegNoField",
      property: "props.disabled",
      value: disabled
    },
    {
      path: "components.div.children.formwizardThirdStepAllotment.children.CompanyDetails.children.cardContent.children.companyDetails.children.cardContent.children.auctionCard.children.companyShare",
      property: "props.disabled",
      value: disabled
    },
    {
      path: "components.div.children.formwizardThirdStepAllotment.children.CompanyDetails.children.cardContent.children.companyDetails.children.cardContent.children.auctionCard.children.companyTypeField",
      property: "props.disabled",
      value: disabled
    }];
    return actionDefination;
  }
  
  export const getActionDefinationForPartnerDetailsFields = (disabled = true, noOfItems) => {
    const actionDefination = [{
      path: "components.div.children.formwizardThirdStepAllotment.children.CompanyDetails.children.cardContent.children.partnerDetails.children.multipleApplicantContainer.children.multipleApplicantInfo.props.scheama.children.cardContent.children.partnerCard.children.PartnerHusbandFatherName",
      property: "props.disabled",
      value: disabled
    },
    {
      path: "components.div.children.formwizardThirdStepAllotment.children.CompanyDetails.children.cardContent.children.partnerDetails.children.multipleApplicantContainer.children.multipleApplicantInfo.props.scheama.children.cardContent.children.partnerCard.children.PartnerName",
      property: "props.disabled",
      value: disabled
    },
    {
      path: "components.div.children.formwizardThirdStepAllotment.children.CompanyDetails.children.cardContent.children.partnerDetails.children.multipleApplicantContainer.children.multipleApplicantInfo.props.scheama.children.cardContent.children.partnerCard.children.partnerAddress",
      property: "props.disabled",
      value: disabled
    },
    {
      path: "components.div.children.formwizardThirdStepAllotment.children.CompanyDetails.children.cardContent.children.partnerDetails.children.multipleApplicantContainer.children.multipleApplicantInfo.props.scheama.children.cardContent.children.partnerCard.children.partnerCPNumber",
      property: "props.disabled",
      value: disabled
    },
    {
      path: "components.div.children.formwizardThirdStepAllotment.children.CompanyDetails.children.cardContent.children.partnerDetails.children.multipleApplicantContainer.children.multipleApplicantInfo.props.scheama.children.cardContent.children.partnerCard.children.partnerMobileNumber",
      property: "props.disabled",
      value: disabled
    },
    {
      path: "components.div.children.formwizardThirdStepAllotment.children.CompanyDetails.children.cardContent.children.partnerDetails.children.multipleApplicantContainer.children.multipleApplicantInfo.props.scheama.children.cardContent.children.partnerCard.children.partnerShare",
      property: "props.disabled",
      value: disabled
    },
    {
      path: "components.div.children.formwizardThirdStepAllotment.children.CompanyDetails.children.cardContent.children.partnerDetails.children.multipleApplicantContainer.children.multipleApplicantInfo.props.scheama.children.cardContent.children.partnerCard.children.relationship.props.buttons[0]",
      property: "disabled",
      value: disabled
    },
    {
      path: "components.div.children.formwizardThirdStepAllotment.children.CompanyDetails.children.cardContent.children.partnerDetails.children.multipleApplicantContainer.children.multipleApplicantInfo.props.scheama.children.cardContent.children.partnerCard.children.relationship.props.buttons[1]",
      property: "disabled",
      value: disabled
    }
  ];
  
    for (var i=0; i<noOfItems; i++) {
      actionDefination.push({
        path: `components.div.children.formwizardThirdStepAllotment.children.CompanyDetails.children.cardContent.children.partnerDetails.children.multipleApplicantContainer.children.multipleApplicantInfo.props.items[${i}].item${i}.children.cardContent.children.partnerCard.children.PartnerHusbandFatherName`,
        property: "props.disabled",
        value: disabled
      })
      actionDefination.push({
        path: `components.div.children.formwizardThirdStepAllotment.children.CompanyDetails.children.cardContent.children.partnerDetails.children.multipleApplicantContainer.children.multipleApplicantInfo.props.items[${i}].item${i}.children.cardContent.children.partnerCard.children.PartnerName`,
        property: "props.disabled",
        value: disabled
      })
      actionDefination.push({
        path: `components.div.children.formwizardThirdStepAllotment.children.CompanyDetails.children.cardContent.children.partnerDetails.children.multipleApplicantContainer.children.multipleApplicantInfo.props.items[${i}].item${i}.children.cardContent.children.partnerCard.children.partnerAddress`,
        property: "props.disabled",
        value: disabled
      })
      actionDefination.push({
        path: `components.div.children.formwizardThirdStepAllotment.children.CompanyDetails.children.cardContent.children.partnerDetails.children.multipleApplicantContainer.children.multipleApplicantInfo.props.items[${i}].item${i}.children.cardContent.children.partnerCard.children.partnerCPNumber`,
        property: "props.disabled",
        value: disabled
      })
      actionDefination.push({
        path: `components.div.children.formwizardThirdStepAllotment.children.CompanyDetails.children.cardContent.children.partnerDetails.children.multipleApplicantContainer.children.multipleApplicantInfo.props.items[${i}].item${i}.children.cardContent.children.partnerCard.children.partnerMobileNumber`,
        property: "props.disabled",
        value: disabled
      })
      actionDefination.push({
        path: `components.div.children.formwizardThirdStepAllotment.children.CompanyDetails.children.cardContent.children.partnerDetails.children.multipleApplicantContainer.children.multipleApplicantInfo.props.items[${i}].item${i}.children.cardContent.children.partnerCard.children.partnerShare`,
        property: "props.disabled",
        value: disabled
      })
      actionDefination.push({
        path: `components.div.children.formwizardThirdStepAllotment.children.CompanyDetails.children.cardContent.children.partnerDetails.children.multipleApplicantContainer.children.multipleApplicantInfo.props.items[${i}].item${i}.children.cardContent.children.partnerCard.children.relationship.props.buttons[0]`,
        property: "disabled",
        value: disabled
      })
      actionDefination.push({
        path: `components.div.children.formwizardThirdStepAllotment.children.CompanyDetails.children.cardContent.children.partnerDetails.children.multipleApplicantContainer.children.multipleApplicantInfo.props.items[${i}].item${i}.children.cardContent.children.partnerCard.children.relationship.props.buttons[1]`,
        property: "disabled",
        value: disabled
      })
    }
    
    return actionDefination;
  }
