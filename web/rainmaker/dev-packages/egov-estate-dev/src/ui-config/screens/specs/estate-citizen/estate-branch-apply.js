import React from "react";
import "../utils/index.css";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { toggleSpinner } from "egov-ui-kit/redux/common/actions";

const getData = async (action, state, dispatch) => {
   await new Promise((resolve) => {
        setTimeout(resolve, 0)
    })
  const {ApplicationTypes} = require("./applicationTypes.json"); //change to mdms
  const listItems = ApplicationTypes.reduce((prev, curr) => {
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