import React from "react";
import { getCommonHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
import "../utils/index.css";
import FormIcon from "../../../../ui-atoms-local/Icons/FormIcon";
import TradeLicenseIcon from "../../../../ui-atoms-local/Icons/TradeLicenseIcon";
import { getUserInfo } from "egov-ui-kit/utils/localStorageUtils";

const userInfo = JSON.parse(getUserInfo());
const {roles = []} = userInfo
const isSurveyor = roles.find(item => item.code === "RP_SURVEYOR");
const isClerk = roles.find(item => item.code === "RP_CLERK")

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

  let cardItems = [{
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
  }
]


cardItems = !!isSurveyor ? [...cardItems, {
  label: {
      labelKey: "RP_CAPTURING_TRANSIT_SITE_IMAGE_HEADER",
      labelName: "Capturing Transit Site Images"
  },
  icon: <FormIcon />,
  route: "transit-site-images"
}] : !!isClerk ? [...cardItems, {
  label: {
      labelKey: "RP_OFFLINE_RENT_PAYMENT_HEADER",
      labelName: "Offline Rent Payment"
  },
  icon: <FormIcon />,
  route: "payment"
},
{
  label: {
      labelKey: "RP_CAPTURING_TRANSIT_SITE_IMAGE_HEADER",
      labelName: "Capturing Transit Site Images"
  },
  icon: <FormIcon />,
  route: "transit-site-images"
}] : cardItems


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
          labelName: "Pay Rent",
          labelKey: "RP_PAY_RENT_HEADER"
        },
        icon: <TradeLicenseIcon />,
        route: `payment`
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