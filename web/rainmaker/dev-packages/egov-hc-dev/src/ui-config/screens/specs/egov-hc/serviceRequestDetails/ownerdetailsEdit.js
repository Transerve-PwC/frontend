import { getBreak, getCommonCard, getCommonContainer, getCommonTitle, getPattern, getTextField } from "egov-ui-framework/ui-config/screens/specs/utils";

export const ownerdetailsEdit = getCommonCard({
    header: getCommonTitle(
      {
        labelName: "Owner Details",
        labelKey: "HC_OWNER_DETAILS_HEADER"
      },
      {
        style: {
          marginBottom: 18
        }
      }
    ),
  
  
    break: getBreak(),
    ownerdetailsContainer: getCommonContainer({
    ownername:{
      ...getTextField({
         label:{
            labelName:"Name of Owner",
            labelKey:"HC_OWNER_NAME_LABLE"
         },
         placeholder:{
            labelName:"Enter Name of Owner",
            labelKey:"HC_OWNER_NAME_LABLE_PLACEHOLDER"
         },
         gridDefination: {
          xs: 12,
          sm: 12,
          md: 12,
          lg:12
        },
         required:true,
         pattern:getPattern("HCOwnerName"),
         errorMessage:"ERR_INVALID_OWNER_NAME_FIELD_MSG",
         jsonPath:"SERVICEREQUEST.ownerName",
         props:{
          className:"applicant-details-error",
          disabled : true,
        },
      })
    },
    contactno:{
      ...getTextField({
         label:{
            labelName:"Contact Number",
            labelKey:"HC_CONTACT_NUMBER_LABLE"
         },
         placeholder:{
            labelName:"Enter Contact Number",
            labelKey:"HC_CONTACT_NUMBER_LABLE_PLACEHOLDER"
         },
         gridDefination: {
          xs: 12,
          sm: 12,
          md: 12,
          lg:12
        },
         required:true,
         pattern:getPattern("HCMobileNo"),
         errorMessage:"ERR_INVALID_CONTACT_NO_FIELD_MSG",
         jsonPath:"SERVICEREQUEST.contactNumber",
         props:{
          disabled : true,
        },
      })
    },
    email:{
        ...getTextField({
           label:{
              labelName:"Email",
              labelKey:"HC_EMAIL_LABEL"
           },
           placeholder:{
              labelName:"Enter Email",
              labelKey:"HC_EMAIL_LABEL_PLACEHOLDER"
           },
           gridDefination: {
            xs: 12,
            sm: 12,
            md: 12,
            lg:12
          },
           required:true,
           pattern:getPattern("HCEmail"),
           errorMessage: "ERR_INVALID_EMAIL_FIELD_MSG",
           jsonPath:"SERVICEREQUEST.email",
           props:{
            disabled : true,
          },
        })
      },
    })
  });
