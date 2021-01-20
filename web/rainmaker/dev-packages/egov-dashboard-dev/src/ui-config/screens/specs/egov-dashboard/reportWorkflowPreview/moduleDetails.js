import { getCommonContainer, getCommonGrayCard, getCommonSubHeader, getLabelWithValue } from "egov-ui-framework/ui-config/screens/specs/utils";

export const moduleDetails = getCommonGrayCard({
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
          labelName: "",
          labelKey: "Module Details"
        })
      },
 
    }
  },
  
  
  
  
  
  scheama: getCommonGrayCard({
    propertyContainer: getCommonContainer({
      nameofVeterinaryDoctor: getLabelWithValue(
        {
          labelName: "",
          labelKey: "Module Name"
        },
        {
          jsonPath: "WF_PREVIEW.BusinessServices[0].businessService"
        },
      ),
      contactNumber: getLabelWithValue(
        {
          labelName: "",
          labelKey: "Module Description"
        },
        {
          jsonPath: "WF_PREVIEW.BusinessServices[0].business"
        }
      )
    })
  })

});
