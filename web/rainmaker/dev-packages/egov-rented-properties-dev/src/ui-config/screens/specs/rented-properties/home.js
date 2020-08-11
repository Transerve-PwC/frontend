import React from "react";
import { getCommonHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
import "../utils/index.css";
import FormIcon from "../../../../ui-atoms-local/Icons/FormIcon";
import TradeLicenseIcon from "../../../../ui-atoms-local/Icons/TradeLicenseIcon";

const header = getCommonHeader(
    {
      labelName: "Rented Properties",
      labelKey: "RP_COMMON_RENTED_PROPERTIES"
    },
    {
      classes: {
        root: "common-header-cont"
      }
    }
  );

  const cardItems = [{
    label: {
        labelKey: "RP_PROPERTY_MASTER_HEADER",
        labelName: "Property Master"
    },
    icon: <FormIcon />,
    route: "search"
  },
  {
    label: {
        labelKey: "RP_OWNERSHIP_TRANSFER_HEADER",
        labelName: "Ownership Transfer"
    },
    icon: <FormIcon />,
    route: "search-transfer-properties"
  },
  {
    label: {
        labelKey: "DUPLICATE_COPY_HEADER",
        labelName: "Duplicate copy of Allotment letter"
    },
    icon: <FormIcon />,
    route: "search-duplicate-copy"
  },
  {
    label: {
        labelKey: "MORTAGE_HEADER",
        labelName: "Mortgage"
    },
    icon: <FormIcon />,
    route: "search-mortgage"
  },
  {
    label: {
        labelKey: "ACCOUNT_STATEMENT_GENERATION_HEADER",
        labelName: "Account Statement Generation"
    },
    icon: <FormIcon />,
    route: "search-account-statement"
  },
  {
    label: {
        labelKey: "RP_OFFLINE_RENT_AMOUNT_PAYMENT_HEADER",
        labelName: "Offline rent amount"
    },
    icon: <FormIcon />,
    route: "search-transfer-properties"
  },
  {
    label: {
        labelKey: "RP_GENERATING_NOTICE_HEADER",
        labelName: "Generating notice for Violation/Recovery"
    },
    icon: <FormIcon />,
    route: "search-transfer-properties"
  },
  {
    label: {
        labelKey: "RP_CAPTURING_TRANSIT_SITE_IMAGE_HEADER",
        labelName: "Capturing Transit Site Images"
    },
    icon: <FormIcon />,
    route: "transit-site-images"
  }
]

const citizenCardItems = [{
  label: {
    labelName: "Transfer of Transit site In case of Legal Heir (Ownership Transfer)",
    labelKey: "OWNER_SHIP_TRANSFER_HEADER"
  },
  icon: <TradeLicenseIcon />,
  route: `/rented-properties-citizen/ownership-transfer`
  },
  {
    label: {
      labelName: "Duplicate copy of Allotment letter",
      labelKey: "DUPLICATE_COPY_HEADER"
    },
    icon: <TradeLicenseIcon />,
    route: `/rented-properties-citizen/duplicate-copy`
    },
    {
      label: {
        labelName: "Mortgage",
        labelKey: "MORTAGE_HEADER"
      },
      icon: <TradeLicenseIcon />,
      route: `/rented-properties-citizen/mortage`
      },
      {
        label: {
          labelName: "Account Statement Generation",
          labelKey: "ACCOUNT_STATEMENT_GENERATION_HEADER"
        },
        icon: <TradeLicenseIcon />,
        route: `/rented-properties-citizen/account-statement`
        }
]

  const home = {
    uiFramework: "material-ui",
    name: "home",
    components: {
      div: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          header: header,
          applyCard: {
            moduleName: "egov-rented-properties",
            uiFramework: "custom-molecules-local",
            componentPath: "LandingPage",
            props: {
              items: process.env.REACT_APP_NAME === "Citizen" ? citizenCardItems : cardItems,
              history: {},
              style: {
                width: "100%"
              }
            }
          }
        }
      }
      }
    }
  
  export default home;