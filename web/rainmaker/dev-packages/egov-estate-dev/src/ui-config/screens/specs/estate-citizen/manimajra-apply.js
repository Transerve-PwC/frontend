import React from "react";
import "../utils/index.css";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { toggleSpinner } from "egov-ui-kit/redux/common/actions";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { getMdmsData } from "../utils";
import { getSearchResults } from "../../../../ui-utils/commons";
import { ESTATE_SERVICES_MDMS_MODULE } from "../../../../ui-constants";

const _applicationTypes = [
  {
    "name": "Entry of Ownership on the basis of Sale/gift/exchange/family transfer deed",
    "code": "ES_ENTRY_OF_OWNERSHIP_SALE_GIFT",
    "type": "ManiMajra_CitizenService_SaleGift",
    "active": true,
    "category": "ES_OWNERSHIP_TRANSFER",
    "filter": true
  },
  {
    "name": "Entry of Ownership on the basis of Registered Will",
    "code": "ES_ENTRY_OF_OWNERSHIP_REGISTERED_WILL",
    "type": "ManiMajra_CitizenService_RegisteredWill",
    "active": true,
    "category": "ES_OWNERSHIP_TRANSFER",
    "filter": true
  },
  {
    "name": "Entry of Ownership on the basis of Registered Will",
    "code": "ES_ENTRY_OF_OWNERSHIP_UNREGISTERED_WILL",
    "type": "ManiMajra_CitizenService_UnRegisteredWill",
    "active": true,
    "category": "ES_OWNERSHIP_TRANSFER",
    "filter": true
  },
  {
    "name": "Allotment of new house number",
    "code": "ES_ALLOTMENT_OF_NEW_HOUSE_NUMBER",
    "type": "ManiMajra_OtherCitizenService_AllotmentOfHouse",
    "active": true,
    "filter": true
  }
]

const getData = async (action, state, dispatch) => {
   /* await new Promise((resolve) => {
        setTimeout(resolve, 0)
    })
    const queryObject = {
      MdmsCriteria: {
        tenantId: getTenantId(),
        moduleDetails: [
          {
            moduleName: ESTATE_SERVICES_MDMS_MODULE,
            masterDetails: [
              { name: "applicationTypes" }
            ]
          }
        ]
      }
    }
    const response = await getMdmsData(queryObject); */
    const propertyId = getQueryArg(window.location.href, "propertyId")
    const fileNumber = getQueryArg(window.location.href, "fileNumber")
    const propertyQueryObject = [
      {key: "propertyIds", value: propertyId},
      {key: "fileNumber", value: fileNumber}
    ]
    const propertyResponse = await getSearchResults(propertyQueryObject)
    try {
      const property = propertyResponse.Properties[0]
      const applicationTypes = _applicationTypes;
      // const applicationTypes = response.MdmsRes.EstateServices.applicationTypes
      const listItems = applicationTypes.filter(item => eval(item.filter)).reduce((prev, curr) => {
        if(!!curr.category) {
          let type = {}
          const findIndex = prev.findIndex(item => item.code === curr.category);
          if(findIndex !== -1) {
            type = {...prev[findIndex], SubTypes: [...prev[findIndex].SubTypes, {...curr, route: `_apply?applicationType=${curr.type}&propertyId=${propertyId}&fileNumber=${fileNumber}`}]}
            return [...prev.slice(0, findIndex), type, ...prev.slice(findIndex+1)]
          } else {
            type = {code: curr.category, name: curr.category, SubTypes: [{...curr, route: `_apply?applicationType=${curr.type}&propertyId=${propertyId}&fileNumber=${fileNumber}`}] }
            return [...prev, type]
          }
        } else {
          return [...prev, {...curr, route: `_apply?applicationType=${curr.type}&propertyId=${propertyId}&fileNumber=${fileNumber}`}]
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

const manimajraHome = {
  uiFramework: "material-ui",
  name: "manimajra-apply",
  hasBeforeInitAsync: true,
  beforeInitScreen: async (action, state, dispatch) => {
    dispatch(toggleSpinner())
        // await getPropertyData(action, state, dispatch)
        const components = await getData(action, state, dispatch)
        dispatch(toggleSpinner())
        return {
          "type": "INIT_SCREEN",
          "screenKey": "manimajra-apply",
          "screenConfig": {
            "uiFramework": "material-ui",
            "name": "manimajra-apply",
            components
          }
        }
  }
}

export default manimajraHome;