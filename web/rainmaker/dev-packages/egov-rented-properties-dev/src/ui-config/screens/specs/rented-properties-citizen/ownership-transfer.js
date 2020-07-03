import React from "react";
import { getCommonHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
import FormIcon from "../../../../ui-atoms-local/Icons/FormIcon";
import TradeLicenseIcon from "../../../../ui-atoms-local/Icons/TradeLicenseIcon";
import "../utils/index.css";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";

const tenantId = getTenantId();

const header = getCommonHeader(
    {
      labelName: "Transfer of Transit site In case of Legal Heir",
      labelKey: "RP_OWNER_SHIP_TRANSFER_HEADER"
    },
    {
      classes: {
        root: "common-header-cont"
      }
    }
  );

const cardItems = [{
    label: {
        labelKey: "RP_APPLY_OWNERSHIP_TRANFER",
        labelName: "Apply for Ownership Transfer"
    },
    icon: <TradeLicenseIcon />,
    route: `ownership-apply?tenantId=${tenantId}`
  },
  {
    label: {
        labelKey: "RP_MY_APPLICATIONS",
        labelName: "My Applications"
    },
    icon: <FormIcon />,
    route: "ownership-my-applications"
  }
]

const ownershipHome = {
    uiFramework: "material-ui",
    name: "ownership-transfer",
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
            listCard: {
              uiFramework: "custom-molecules-local",
              moduleName: "egov-tradelicence",
              componentPath: "HowItWorks"
            }
          }
        }
      }
    }

export default ownershipHome