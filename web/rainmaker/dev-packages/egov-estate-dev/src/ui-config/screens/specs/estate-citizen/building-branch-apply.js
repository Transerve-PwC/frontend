import React from "react";
import {
  getCommonHeader,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import FormIcon from "../../../../ui-atoms-local/Icons/FormIcon";
import "../utils/index.css";
import {
  getTenantId
} from "egov-ui-kit/utils/localStorageUtils";
import { EstateIcon } from "../../../../ui-atoms-local";

const tenantId = getTenantId();

const cardItems = [{
    label: {
      labelKey: "EST_BUILDING_ISSUANCE_NOC_ELECTRICITY_WATER_SEWERAGE_CONNECTION",
      labelName: "Issuance of No Objection Certificate (NOC) for Electricity/ Water/ Sewerage Connections"
    },
    icon: < EstateIcon / > ,
    route: `property-search?type=EstateBranch_OwnershipTransfer_SaleDeed`,
    buttonLabel: getLabel({
      labelName: "Apply",
      labelKey: "EST_APPLY"
    })
  },
  {
    label: {
      labelKey: "EST_BUILDING_SEARCH_YOUR_APPLICATION",
      labelName: "Search Your Application"
    },
    icon: < EstateIcon / > ,
    route: "ownership-transfer?type=registeredWill",
    buttonLabel: getLabel({
      labelName: "Apply",
      labelKey: "EST_APPLY"
    })
  }
]


const BuildingBranchApply = {
  uiFramework: "material-ui",
  name: "building-branch-apply",
  // beforeInitScreen: (action, state, dispatch) => {
  //   return action
  // },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      children: {
        applyCard: {
          moduleName: "egov-estate",
          uiFramework: "custom-molecules-local",
          componentPath: "VerticalCardItems",
          props: {
            items: cardItems,
            history: {},
            style: {
              width: "100%"
            },
            gridDefination: {
              xs: 12,
              sm: 12
            }
          }
        }
      }
    }
  }
}

export default BuildingBranchApply