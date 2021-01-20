import { getBreak, getCommonCard, getCommonContainer, getCommonTitle, getPattern, getSelectField, getTextField } from "egov-ui-framework/ui-config/screens/specs/utils";


export const applicationNumber = getCommonContainer({
  break:getBreak(),
  header: getCommonTitle(
    {
      labelName: "APPLICATION_NUMBER",
      labelKey: "HC_APPLICATION_NUMBER_LABEL"
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),
});




export const serviceDetails = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "SERVICE_REQUEST_DETAILS",
      labelKey: "HC_SERVICE_REQUEST_DETAILS_LABEL"
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),


  break: getBreak(),
  serviceDetailsContainer: getCommonContainer({
  typeofrequest: {
    ...getSelectField({
      label: {
        labelName: "TYPE_OF_SERVICE_REQUEST",
        labelKey: "HC_TYPES_OF_SERVICE_REQUEST_LABEL"
      },     
      optionLabel: "name",
      optionValue: "name",
      placeholder: {
        labelName: "TYPE_OF_SERVICE_REQUEST",
        labelKey: "HC_TYPES_OF_SERVICE_REQUEST_PLACEHOLDER"
      },
      sourceJsonPath: "applyScreenMdmsData.eg-horticulture.ServiceType",
      jsonPath: "SERVICEREQUEST.serviceType",
      errorMessage:"ERR_DEFAULT_INPUT_FIELD_MSG",
      
    })
  },
  nooftrees:{
    ...getTextField({
       label:{
          labelName:"NUMBER_OF_TREES_FOR_CUTTING_PRUNING_REMOVAL",
          labelKey:"HC_NUMBER_OF_TREES_FOR_CUTTING_PRUNING_REMOVAL_LABEL"
       },
       placeholder:{
          labelName:"NUMBER_OF_TREES_FOR_CUTTING_PRUNING_REMOVAL",
          labelKey:"HC_NUMBER_OF_TREES_FOR_CUTTING_PRUNING_REMOVAL_PLACEHOLDER"
       },
       required:true,
       pattern:getPattern("DoorHouseNo"),
       errorMessage:"ERR_DEFAULT_INPUT_FIELD_MSG",
       jsonPath:"SERVICEREQUEST.treeCount"
    })
  },
  })
});

