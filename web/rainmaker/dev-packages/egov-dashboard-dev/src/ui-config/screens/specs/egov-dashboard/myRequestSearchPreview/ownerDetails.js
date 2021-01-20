import { getCommonContainer, getCommonGrayCard, getCommonSubHeader, getLabelWithValue } from "egov-ui-framework/ui-config/screens/specs/utils";

export const ownerDetails = getCommonGrayCard({
  header: {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    props: {
      style: { marginBottom: "10px" }
    },
    children: {
      header: {
        gridDefination: {
          xs: 8
        },
        ...getCommonSubHeader({
          labelName: "Owner details",
          labelKey: "HC_OWNER_DETAILS_HEADER"
        })
      },
 
    }
  },
  
  
  
  
  
  scheama: getCommonGrayCard({
    propertyContainer: getCommonContainer({
      nameofVeterinaryDoctor: getLabelWithValue(
        {
          labelName: "Name of Owner",
          labelKey: "HC_OWNER_NAME_LABLE"
        },
        {
          
          
          
          
          
          
          
          jsonPath: "myRequestDetails.owner_name"
        }
      ),
      contactNumber: getLabelWithValue(
        {
          labelName: "Contact Number",
          labelKey: "HC_CONTACT_NUMBER_LABLE"
        },
        {
          
          
          
          
          
          
          
          jsonPath: "myRequestDetails.contact_number"
        }
      ),
      email: getLabelWithValue(
        {
          labelName: "Email",
          labelKey: "HC_EMAIL_LABEL"
        },
        {
          
          
          
          jsonPath: "myRequestDetails.email_id"
        }
      )
    })
  })

});
