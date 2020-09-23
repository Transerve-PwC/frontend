import React from "react";
import "../utils/index.css";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { toggleSpinner } from "egov-ui-kit/redux/common/actions";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { getMdmsData } from "../utils";

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
    const response = await getMdmsData(queryObject);
    try {
    const {applicationTypes = []} = !!response && !!response.MdmsRes && response.MdmsRes.EstatePropertyService ? response.MdmsRes.EstatePropertyService : {} 
    const listItems = applicationTypes.reduce((prev, curr) => {
    const propertyId = getQueryArg(window.location.href, "propertyId")
    const item = !!curr.SubTypes && !!curr.SubTypes.length ?
      {...curr, SubTypes: curr.SubTypes.map(subType => ({
        ...subType, route: `apply?applicationType=${subType.type}&propertyId=${propertyId}`
      }))}
    : {...curr, route: `apply?applicationType=${curr.type}&propertyId=${propertyId}`} 
    return [...prev, item]
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