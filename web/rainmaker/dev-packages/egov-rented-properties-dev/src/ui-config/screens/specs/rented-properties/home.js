import React from "react";
import { getCommonHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
import "../utils/index.css";
import FormIcon from "../../../../ui-atoms-local/Icons/FormIcon";

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

]

const cardItems2 = [
  {
    label: {
        labelKey: "ACCOUNT_STATEMENT_GENERATION_HEADER",
        labelName: "Account Statement Generation"
    },
    icon: <FormIcon />,
    route: "search-transfer-properties"
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
    route: "search-transfer-properties"
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
            uiFramework: "custom-molecules",
            componentPath: "LandingPage",
            props: {
              items: cardItems,
              history: {},
              style: {
                width: "100%"
              }
            }
          },
          applyCard2: {
            uiFramework: "custom-molecules",
            componentPath: "LandingPage",
            props: {
              items: cardItems2,
              history: {},
              style: {
                width: "100%"
              }
            }
          },
        //   listCard: {
        //     uiFramework: "custom-molecules-local",
        //     moduleName: "egov-tradelicence",
        //     componentPath: "HowItWorks"
        //   }
        }
      }
      }
    }
  
  export default home;