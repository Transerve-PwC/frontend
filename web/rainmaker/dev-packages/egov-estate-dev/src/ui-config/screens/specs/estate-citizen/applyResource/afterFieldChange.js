import { dispatchMultipleFieldChangeAction } from "egov-ui-framework/ui-config/screens/specs/utils";
import get from "lodash/get";


export const setFieldProperty = ({dispatch, actionDefiniton }) => {
    dispatchMultipleFieldChangeAction("apply", actionDefiniton, dispatch)
  }

  export const getComponentJsonPath = ({cardName, fieldName}) => {
    return `components.div.children.formwizardFirstStep.children.${cardName}.children.cardContent.children.details_container.children.${fieldName}`
  }

  const getOwnerDetails = (state, id) => {
    const owners = get(state.screenConfiguration.preparedFinalObject, "property.propertyDetails.owners")
    const ownerData = owners.find(item => item.id === id)
    const remainingOwners = owners.filter(item => item.id !== id).map(item => ({code: item.id, label: item.ownerDetails.ownerName}))
    return {remainingOwners, ownerData}
  }


export const afterFieldChange = (action, state, dispatch) => {
  const field = action.componentJsonpath.split(".").pop()
  let actionDefiniton = []
  switch(field) {
    case "ES_SELECT_SELLER_OR_TRANSFEROR_LABEL": {
      const {ownerData = {}, remainingOwners = []} = getOwnerDetails(state, action.value)
      const { ownerDetails, share, cpNumber } = ownerData
      actionDefiniton = [
        {
          path: getComponentJsonPath({cardName: "ES_OWNER_DETAILS_HEADER", fieldName: "ES_SELLER_TRANSFEROR_FATHER_HUSBAND_NAME_LABEL"}),
          property: "props.value",
          value: ownerDetails.guardianName
        },
        {
          path: getComponentJsonPath({cardName: "ES_OWNER_DETAILS_HEADER", fieldName: "ES_SELLER_TRANSFEROR_ADDRESS_LABEL"}),
          property: "props.value",
          value: ownerDetails.address
        },
        {
          path: getComponentJsonPath({cardName: "ES_OWNER_DETAILS_HEADER", fieldName: "ES_PERCENT_SHARE_LABEL"}),
          property: "props.value",
          value: share
        },
        {
          path: getComponentJsonPath({cardName: "ES_PURCHASER_DETAILS_HEADER", fieldName: "ES_PURCHASER_TRANSFEREE_TYPE_LABEL"}),
          property: "visible",
          value: !!remainingOwners.length
        },
        {
          path: getComponentJsonPath({
            cardName: "ES_PURCHASER_DETAILS_HEADER",
            fieldName: "ES_PURCHASER_TRANSFEREE_ID"
          }),
          property: "visible",
          value: !!remainingOwners.length
        },
        {
          path: getComponentJsonPath({
            cardName: "ES_PURCHASER_DETAILS_HEADER",
            fieldName: "ES_PURCHASER_TRANSFEREE_ID"
          }),
          property: "props.data",
          value: remainingOwners
        }
      ]
      break
    }
    case "ES_PURCHASER_TRANSFEREE_TYPE_LABEL": {
      actionDefiniton = [
        {
          path: getComponentJsonPath({
            cardName: "ES_PURCHASER_DETAILS_HEADER",
            fieldName: "ES_PURCHASER_TRANSFEREE_ID"
          }),
          property: "visible",
          value: action.value === "Existing"
        },
        {
          path: getComponentJsonPath({
            cardName: "ES_PURCHASER_DETAILS_HEADER",
            fieldName: "ES_PURCHASER_TRANSFEREE_NAME_LABEL"
          }),
          property: "visible",
          value: action.value === "New"
        }
      ]
    }
    break
  }
  setFieldProperty({dispatch, actionDefiniton})
}