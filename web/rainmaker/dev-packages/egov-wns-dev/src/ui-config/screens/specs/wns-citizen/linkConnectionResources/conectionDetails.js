import {
    getBreak,
    getCommonCard,
    getCommonGrayCard,
    getCommonTitle,
    getCommonSubHeader,
    getTextField,
    getLabel,
    getDateField,
    getSelectField,
    getCommonContainer,
    getLabelWithValue,
    getPattern
  } from "egov-ui-framework/ui-config/screens/specs/utils";
export const conectionDetails = () => {
   
  
    return getCommonCard({
      header: getCommonTitle(
        {
          labelName: "Employee Details",
          labelKey: "WS_COMMON_TABLE_COL_SERVICE_LABEL"
        },
        {
          style: {
            marginBottom: 18
          }
        }
      ),
      break: getBreak(),
      conectiondetails: getCommonContainer({
       
       
        service: getLabelWithValue(
      {
        labelKey: "WS_COMMON_TABLE_COL_SERVICE_LABEL"
      },
      {
        jsonPath: "combinedSearchResults[0].service",
      }
    ),
    consumerno: getLabelWithValue(
      {
        labelKey: "WS_COMMON_TABLE_COL_CONSUMER_NO_LABEL"
      },
      {
        jsonPath: "combinedSearchResults[0].connectionNo",
      }
    ),
    ownername: getLabelWithValue(
      {
        labelKey: "WS_COMMON_TABLE_COL_OWN_NAME_LABEL"
      },
      {
        jsonPath: "combinedSearchResults[0].property.address.service",
      }
    ),
    status: getLabelWithValue(
      {
        labelKey: "WS_COMMON_TABLE_COL_STATUS_LABEL"
      },
      {
        jsonPath: "combinedSearchResults[0].status",
      }
    ),
    address: getLabelWithValue(
      {
        labelKey: "WS_COMMON_TABLE_COL_ADDRESS"
      },
      {
        jsonPath: "combinedSearchResults[0].property.address.service",
      }
    ),
       
       
        
       
      }),
      break:getBreak(),
     
     
      
    });
    }