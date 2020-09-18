import React from "react";
import { getCommonHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
import FormIcon from "../../../../ui-atoms-local/Icons/FormIcon";
import TradeLicenseIcon from "../../../../ui-atoms-local/Icons/TradeLicenseIcon";
import "../utils/index.css";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { setBusinessServiceDataToLocalStorage } from "egov-ui-framework/ui-utils/commons";

const tenantId = getTenantId();

const header = getCommonHeader(
    {
      labelName: "Mortgage",
      labelKey: "RP_MORTAGE_HEADER"
    },
    {
      classes: {
        root: "common-header-cont"
      }
    }
  );

const cardItems = [{
    label: {
        labelKey: "Apply",
        labelName: "Apply"
    },
    icon: <TradeLicenseIcon />,
    route: `mortage-apply`
  },
  {
    label: {
        labelKey: "RP_MY_APPLICATIONS",
        labelName: "My Applications"
    },
    icon: <FormIcon />,
    route: "mortage-my-applications"
  }
]

const getData = async (action, state, dispatch) => {
  const queryObject = [{ key: "tenantId", value: getTenantId() }, 
                      { key: "businessServices", value: "PermissionToMortgage" }]
  await setBusinessServiceDataToLocalStorage(queryObject, dispatch);
}

const mortageHome = {
    uiFramework: "material-ui",
    name: "mortage",
    beforeInitScreen: (action, state, dispatch) => {
      getData(action, state, dispatch)
      return action
    },
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
            }
          }
        }
      }
    }

export default mortageHome