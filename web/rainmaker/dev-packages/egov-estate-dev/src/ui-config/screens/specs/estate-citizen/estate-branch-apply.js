import React from "react";
import "../utils/index.css";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { toggleSpinner } from "egov-ui-kit/redux/common/actions";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { getMdmsData } from "../utils";
import { getSearchResults } from "../../../../ui-utils/commons";

const applicationTypes = [
  {
    "name": "Transfer of Ownership on the basis of Registered Sale/Gift/Exchange/Family Transfer Deed",
    "code": "ES_TRANSFER_OF_OWNERSHIP_REGISTERED_DEED",
    "type": "EstateBranch_OwnershipTransfer_SaleDeed",
    "active": true,
    "category": "ES_OWNERSHIP_TRANSFER"
  },
  {
    "name": "Transfer of Ownership on the basis of Registered Will",
    "code": "ES_TRANSFER_OF_OWNERSHIP_REGISTERED_WILL",
    "type": "EstateBranch_OwnershipTransfer_RegisteredWill",
    "active": true,
    "category": "ES_OWNERSHIP_TRANSFER"
  },
  {
    "name": "Transfer of Ownership on the basis of Un-registered Will",
    "code": "ES_TRANSFER_OF_OWNERSHIP_UNREGISTERED_WILL",
    "type": "EstateBranch_OwnershipTransfer_UnRegisteredWill",
    "active": true,
    "category": "ES_OWNERSHIP_TRANSFER"
  },
  {
    "name": "Transfer of Ownership on the basis of Intestate Death",
    "code": "ES_TRANSFER_OF_OWNERSHIP_INTESTATE_DEATH",
    "type": "EstateBranch_OwnershipTransfer_IntestateDeath",
    "active": true,
    "category": "ES_OWNERSHIP_TRANSFER"
  },
  {
    "name": "Transfer of Ownership on the basis of Partnership deed/Dissolution deed/Change of Director in case of Private Limited Company",
    "code": "ES_TRANSFER_OF_OWNERSHIP_PARTNERSHIP_DEED",
    "type": "EstateBranch_OwnershipTransfer_PatnershipDeed",
    "active": true,
    "companyDetails": true,
    "category": "ES_OWNERSHIP_TRANSFER"
  },
  {
    "name": "Transfer of Ownership on the basis of Court Decree/Family Settlement",
    "code": "ES_TRANSFER_OF_OWNERSHIP_COURT_DECREE",
    "type": "EstateBranch_OwnershipTransfer_FamilySettlement",
    "active": true,
    "courtDetails": true,
    "category": "ES_OWNERSHIP_TRANSFER"
  },
  {
    "name": "No Objection Certificate for Transfer of Lease Rights by way of Sale/Gift/Family Transfer Deed/Exchange Deed",
    "code": "ES_NO_OBJECTION_CERTIFICATE",
    "type": "EstateBranch_OtherCitizenService_NOC",
    "active": true,
    "category": "ES_NO_OBJECTION_NO_DUE_CERTIFICATE"
  },
  {
    "name": "No Dues Certificate",
    "code": "ES_NO_DUES_CERTIFICATE",
    "type": "EstateBranch_OtherCitizenService_NDC",
    "active": true,
    "category": "ES_NO_OBJECTION_NO_DUE_CERTIFICATE"
  },
  {
    "name": "Conversion of Property from residential to Commercial (SCF to SCO)",
    "code": "ES_CONVERSION_OF_PROPERTY_RES_TO_COMM",
    "type": "EstateBranch_OtherCitizenService_ScfToSco",
    "active": true,
    "companyDetails": true,
    "category": "ES_CONVERSION_OF_PROPERTY"
  },
  {
    "name": "Conversion from Leasehold to Freehold Property",
    "code": "ES_CONVERSION_FROM_LEASEHOLD_TO_FREEHOLD",
    "type": "EstateBranch_OtherCitizenService_LeaseholdToFreehold",
    "active": true,
    "category": "ES_CONVERSION_OF_PROPERTY"
  },
  {
    "name": "Duplicate Allotment Letter/Possession Letter",
    "code": "ES_DUPLICATE_ALLOTMENT_POSSESSION_LETTER",
    "type": "EstateBranch_OtherCitizenService_DuplicateCopy",
    "active": true
  },
  {
    "name": "Execution of Lease Deed/Deed of Conveyance",
    "code": "ES_EXECUTION_OF_LEASE_DEED",
    "type": "EstateBranch_OtherCitizenService_LeaseDeed",
    "active": true
  },
  {
    "name": "Permission to Mortgage",
    "code": "ES_PERMISSION_TO_MORTGAGE",
    "type": "EstateBranch_OtherCitizenService_Mortgage",
    "active": true
  },
  {
    "name": "Change of Trade",
    "code": "ES_CHANGE_OF_TRADE",
    "type": "EstateBranch_OtherCitizenService_ChangeInTrade",
    "active": true
  }
]

const getData = async (action, state, dispatch) => {
   await new Promise((resolve) => {
        setTimeout(resolve, 0)
    })
    const queryObject = {
      MdmsCriteria: {
        tenantId: getTenantId(),
        moduleDetails: [
          {
            moduleName: "EstatePropertyService",
            masterDetails: [
              { name: "applicationTypes" }
            ]
          }
        ]
      }
    }
    // const response = await getMdmsData(queryObject);
    const propertyId = getQueryArg(window.location.href, "propertyId")
    const propertyQueryObject = [
      {key: "propertyId", value: propertyId}
    ]
    const propertyResponse = await getSearchResults(propertyQueryObject)
    try {
      const property = propertyResponse.Properties[0]
      const listItems = applicationTypes.filter(item => !!item.companyDetails ? !!property.propertyDetails.companyName && !!property.propertyDetails.companyType : !!item.courtDetails ? !!property.propertyDetails.decreeDate && !!property.propertyDetails.courtDetails && !!property.propertyDetails.civilTitledAs : true).reduce((prev, curr) => {
        if(!!curr.category) {
          let type = {}
          const findIndex = prev.findIndex(item => item.code === curr.category);
          if(findIndex !== -1) {
            type = {...prev[findIndex], SubTypes: [...prev[findIndex].SubTypes, {...curr, route: `_apply?applicationType=${curr.type}&propertyId=${propertyId}`}]}
            return [...prev.slice(0, findIndex), type, ...prev.slice(findIndex+1)]
          } else {
            type = {code: curr.category, name: curr.category, SubTypes: [{...curr, route: `_apply?applicationType=${curr.type}&propertyId=${propertyId}`}] }
            return [...prev, type]
          }
        } else {
          return [...prev, {...curr, route: `_apply?applicationType=${curr.type}&propertyId=${propertyId}`}]
        }
      }, [])
    return {
        div: {
          uiFramework: "custom-atoms",
          componentPath: "Div",
          children: {
            applyCard: {
              moduleName: "egov-estate",
              uiFramework: "custom-containers-local",
              componentPath: "NestedListContainer",
              props: {
                items: listItems,
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
  } catch (error) {
      console.log("error", error)
      return {}
  }
}

const estateBranchHome = {
  uiFramework: "material-ui",
  name: "estate-branch-apply",
  hasBeforeInitAsync: true,
  beforeInitScreen: async (action, state, dispatch) => {
    dispatch(toggleSpinner())
        // await getPropertyData(action, state, dispatch)
        const components = await getData(action, state, dispatch)
        dispatch(toggleSpinner())
        return {
          "type": "INIT_SCREEN",
          "screenKey": "estate-branch-apply",
          "screenConfig": {
            "uiFramework": "material-ui",
            "name": "estate-branch-apply",
            components
          }
        }
  }
}

export default estateBranchHome