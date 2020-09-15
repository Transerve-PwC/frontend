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
      labelKey: "EST_TRANSFER_OF_OWNERSHIP_REGISTERED_DEED",
      labelName: "Transfer of Ownership on the basis of Registered Sale/Gift/Exchange/Family Transfer Deed"
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
      labelName: "Transfer of Ownership on the basis of Registered Will"
    },
    icon: < EstateIcon / > ,
    route: "property-search?type=EstateBranch_OwnershipTransfer_RegisteredWill",
    buttonLabel: getLabel({
      labelName: "Apply",
      labelKey: "EST_APPLY"
    })
  },
  {
    label: {
      labelKey: "EST_TRANSFER_OF_OWNERSHIP_UNREGISTERED_WILL",
      labelName: "Transfer of Ownership on the basis of Un-registered Will"
    },
    icon: < EstateIcon / > ,
    route: "property-search?type=EstateBranch_OwnershipTransfer_UnRegisteredWill",
    buttonLabel: getLabel({
      labelName: "Apply",
      labelKey: "EST_APPLY"
    })
  },
  {
    label: {
      labelKey: "EST_TRANSFER_OF_OWNERSHIP_INTESTATE_DEATH",
      labelName: "Transfer of Ownership on the basis of Intestate Death (without will)"
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
      labelKey: "EST_TRANSFER_OF_OWNERSHIP_PARTNERSHIP_DEED",
      labelName: "Transfer of Ownership on the basis of Partnership deed/Dissolution deed/Change of Director in case of Private Limited Company"
    },
    icon: < EstateIcon / > ,
    route: "property-search?type=EstateBranch_OwnershipTransfer_PatnershipDeed",
    buttonLabel: getLabel({
      labelName: "Apply",
      labelKey: "EST_APPLY"
    })
  },
  {
    label: {
      labelKey: "EST_TRANSFER_OF_PROPERTY",
      labelName: "Transfer of Property on the basis of Court Decree/Family Settlement"
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
      labelKey: "EST_NO_OBJECTION_CERTIFICATE",
      labelName: "No Objection Certificate for Transfer of Lease Rights by way of Sale/Gift/Family Transfer Deed/Exchange Deed"
    },
    icon: < EstateIcon / > ,
    route: "property-search?type=EstateBranch_OtherCitizen_NOC",
    buttonLabel: getLabel({
      labelName: "Apply",
      labelKey: "EST_APPLY"
    })
  },
  {
    label: {
      labelKey: "EST_EXECUTION_OF_LEASE_DEED",
      labelName: "Execution of Lease Deed/Deed of Conveyance"
    },
    icon: < EstateIcon / > ,
    route: "property-search?type=EstateBranch_OtherCitizen_LeaseDeed",
    buttonLabel: getLabel({
      labelName: "Apply",
      labelKey: "EST_APPLY"
    })
  },
  {
    label: {
      labelKey: "EST_NO_DUES_CERTIFICATE",
      labelName: "No Dues Certificate"
    },
    icon: < EstateIcon / > ,
    route: "property-search?type=EstateBranch_OtherCitizen_NDC",
    buttonLabel: getLabel({
      labelName: "Apply",
      labelKey: "EST_APPLY"
    })
  },
  {
    label: {
      labelKey: "EST_PERMISSION_TO_MORTGAGE",
      labelName: "Permission to Mortgage"
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
      labelKey: "EST_CONVERSION_FROM_LEASEHOLD_TO_FREEHOLD",
      labelName: "Conversion from Leasehold to Freehold Property"
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
      labelKey: "EST_DUPLICATE_ALLOTMENT_POSSESSION_LETTER",
      labelName: "Duplicate Allotment Letter/Possession Letter"
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
      labelKey: "EST_CONVERSION_OF_PROPERTY_RES_TO_COMM",
      labelName: "Conversion of Property from residential to Commercial (SCF to SCO)"
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
      labelKey: "EST_CHANGE_OF_TRADE",
      labelName: "Change of Trade"
    },
    icon: < EstateIcon / > ,
    route: "",
    buttonLabel: getLabel({
      labelName: "Apply",
      labelKey: "EST_APPLY"
    })
  }
]


const estateBranchHome = {
  uiFramework: "material-ui",
  name: "estate-branch-apply",
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

export default estateBranchHome