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
      labelKey: "EST_MANIMAJRA_SALE_GIFT_EXCHANGE_FAMILY_TRANSFER_DEED",
      labelName: "Entry of ownership on the basis of Sale/gift/ exchange/family transfer deed"
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
      labelKey: "EST_TRANSFER_OF_OWNERSHIP_REGISTERED_WILL",
      labelName: "Entry of ownership on the basis of registered will"
    },
    icon: < EstateIcon / > ,
    route: "ownership-transfer?type=registeredWill",
    buttonLabel: getLabel({
      labelName: "Apply",
      labelKey: "EST_APPLY"
    })
  },
  {
    label: {
      labelKey: "EST_MANIMAJRA_OWNERSHIP_UNREGISTERED_WILL",
      labelName: "Entry of ownership on the basis of un-registered will"
    },
    icon: < EstateIcon / > ,
    route: "ownership-transfer?type=unregisteredWill",
    buttonLabel: getLabel({
      labelName: "Apply",
      labelKey: "EST_APPLY"
    })
  },
  {
    label: {
      labelKey: "EST_MANIMAJRA_OWNERSHIP_INTESTATE_DEATH_WILL",
      labelName: "Entry of ownership on the basis of intestate death (without will)"
    },
    icon: < EstateIcon / > ,
    route: "ownership-transfer?type=intestateDeath",
    buttonLabel: getLabel({
      labelName: "Apply",
      labelKey: "EST_APPLY"
    })
  },
  {
    label: {
      labelKey: "EST_MANIMAJRA_OWNERSHIP_COURT_DECREE_FAMILY_SETTLEMENT",
      labelName: "Entry of ownership on the basis of court decree/family settlement"
    },
    icon: < EstateIcon / > ,
    route: "ownership-transfer?type=partnershipDeed",
    buttonLabel: getLabel({
      labelName: "Apply",
      labelKey: "EST_APPLY"
    })
  },
  {
    label: {
      labelKey: "EST_MANIMAJRA_ALLOTMENT_NEW_HOUSE_NO",
      labelName: "Allotment of new house number"
    },
    icon: < EstateIcon / > ,
    route: "",
    buttonLabel: getLabel({
      labelName: "Apply",
      labelKey: "EST_APPLY"
    })
  },
  {
    label: {
      labelKey: "EST_MANIMAJRA_ISSUANCE_OWNERSHIP_NDC",
      labelName: "Issuance of ownership/No Due Certificate"
    },
    icon: < EstateIcon / > ,
    route: "",
    buttonLabel: getLabel({
      labelName: "Apply",
      labelKey: "EST_APPLY"
    })
  },
  {
    label: {
      labelKey: "EST_MANIMAJRA_NOC_WATER_SEWEARAGE_ELECTRICITY_CONNECTION_OWNERSHIP_CONVERSION_RESIADENTIAL_TO_COMMERCIAL",
      labelName: "NOC for water/sewerage and electricity connection/ownership letter/conversion of residential into commercial"
    },
    icon: < EstateIcon / > ,
    route: "",
    buttonLabel: getLabel({
      labelName: "Apply",
      labelKey: "EST_APPLY"
    })
  }
]


const ManimajraBranchApply = {
  uiFramework: "material-ui",
  name: "manimajra-branch-apply",
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

export default ManimajraBranchApply