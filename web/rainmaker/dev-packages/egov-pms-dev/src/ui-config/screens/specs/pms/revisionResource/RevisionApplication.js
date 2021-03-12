import {
  getBreak,
  getCommonCard,
  getCommonContainer,
  getCommonGrayCard,
  getCommonTitle,
  getSelectField,
  getTextField,
  getDateField,
  getPattern,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";

import {
  prepareFinalObject,
  handleScreenConfigurationFieldChange as handleField
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import set from "lodash/set";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {  
  WFConfig, 
  ActionMessage
  } from "../../../../../ui-utils/sampleResponses";
  import { httpRequest } from "../../../../../ui-utils";
  import { getPMSPattern } from "../../../../../ui-utils/commons";

export const pensionerPensionDiscontinuation = async (state, dispatch) => {
try {  
  const tenantId = getQueryArg(window.location.href, "tenantId");
  let queryObject = [
  {
  key: "tenantId",
  value: tenantId
  }];  
  let ProcessInstances= get(state.screenConfiguration.preparedFinalObject,"ProcessInstances", [])   
  let response = await httpRequest(
  "post",
  "/pension-services/v1/_pensionerPensionDiscontinuation",
  "",
  [],
  { 
    ProcessInstances: [
                        {
                        tenantId:tenantId,
                        pensioner:{
                        pensionerNumber:ProcessInstances[0].pensioner.pensionerNumber,
                        }
                        
                        }
                      ] 
  }
  );
  console.log(response);
  toggleSnackbar(
    true,
    {
    labelName: "Pension is discontineou of this pensioner from next month!",
    labelKey: "PENSION_REVIEW_PENSIONER_DISCONTINUATION_SUCCESS_MESSAGE"
    },
    "success"
    );

}
catch (e) {
console.log(e)
toggleSnackbar(
true,
{
labelName: "Workflow returned empty object !",
labelKey: "PENSION_API_EXCEPTION_ERROR"
},
"error"
);
}
}

export const revisionDetails = (IsEdit) => {
  //export const pensionDetails = getCommonCard({ 
    return getCommonCard({
    header: getCommonTitle(
      {
        labelName: "Pension Information",
        labelKey: "PENSION_EMPLOYEE_PENSION_INFORMATION"
      },
      {
        style: {
          marginBottom: 18
        }
      }
    ),
   
   
    break: getBreak(),
    pensionDetailsConatiner: getCommonContainer({
     
     
      //1
      effectiveStartYear:{
        ...getSelectField({
        label: {
          labelName: "effectiveStartYear",
          labelKey: "PENSION_EMPLOYEE_PENSION_ESY"
        },
        props:{
          className:"applicant-details-error"
        }, 
        placeholder: {
          labelName: "effectiveStartYear",
          labelKey: "PENSION_EMPLOYEE_PENSION_ESY"
        },
        required:false,
         minValue:0,
          maxLength:18,
        props: {
          //disabled:false,
          disabled:!IsEdit,       
        },
        // localePrefix: {
        //   moduleName: "egov-pms",
        //  masterName: "maritalStatus"
        // },
        sourceJsonPath:
        "applyScreenMdmsData.pension.PensionRevisionYear",
       
        jsonPath: "ProcessInstances[0].pensionRevision[0].effectiveStartYear"
      }),
     
            
    },
    effectiveStartMonth:{
      ...getSelectField({
      label: {
        labelName: "effectiveStartMonth",
        labelKey: "PENSION_EMPLOYEE_PENSION_ESM"
      },
      props:{
        className:"applicant-details-error"
      }, 
      placeholder: {
        labelName: "effectiveStartMonth",
        labelKey: "PENSION_EMPLOYEE_PENSION_ESM"
      },
      required:false,
       minValue:0,
        maxLength:18,
      props: {
       // disabled:false,
        disabled:!IsEdit,       
      },
      // localePrefix: {
      //   moduleName: "PENSION",
      //  masterName: "MONTH"
      // },
      sourceJsonPath:
      "applyScreenMdmsData.pension.PensionRevisionMonth",
     
      jsonPath: "ProcessInstances[0].pensionRevision[0].effectiveStartMonth"
    }),
   
          
  },
   //1_
   effectiveEndYear:{
    ...getSelectField({
    label: {
      labelName: "effectiveEndYear",
      labelKey: "PENSION_EMPLOYEE_PENSION_EEY"
    },
    props:{
      className:"applicant-details-error"
    }, 
    placeholder: {
      labelName: "effectiveEndYear",
      labelKey: "PENSION_EMPLOYEE_PENSION_EEY"
    },
    required:false,
     minValue:0,
      maxLength:18,
    props: {
     disabled:false,       
    },
    // localePrefix: {
    //   moduleName: "egov-pms",
    //  masterName: "maritalStatus"
    // },
    sourceJsonPath:
    "applyScreenMdmsData.pension.PensionRevisionYear",
   
    jsonPath: "ProcessInstances[0].pensionRevision[0].effectiveEndYear"
  }),
 
        
},
effectiveEndMonth:{
  ...getSelectField({
  label: {
    labelName: "effectiveEndMonth",
    labelKey: "PENSION_EMPLOYEE_PENSION_EEM"
  },
  props:{
    className:"applicant-details-error"
  }, 
  placeholder: {
    labelName: "effectiveEndMonth",
    labelKey: "PENSION_EMPLOYEE_PENSION_EEM"
  },
  required:false,
   minValue:0,
    maxLength:18,
  props: {
    disabled:false,       
  },
  // localePrefix: {
  //   moduleName: "PENSION",
  //  masterName: "MONTH"
  // },
  sourceJsonPath:
  "applyScreenMdmsData.pension.PensionRevisionMonth",
 
  jsonPath: "ProcessInstances[0].pensionRevision[0].effectiveEndMonth"
}),

      
},
      //2
      basicPension: getTextField({
        label: {
          labelName: "basicPension",
          labelKey: "PENSION_EMPLOYEE_PENSION_BP_R"
        },
        props:{
          className:"applicant-details-error"
        }, 
        placeholder: {
          labelName: "basicPension",
          labelKey: "PENSION_EMPLOYEE_PENSION_BP_R"
        },
        required:false,
         minValue:0,
          maxLength:18,
        props: {
          disabled:!IsEdit,        
        },
        pattern: getPMSPattern("Amount"),
        jsonPath: "ProcessInstances[0].pensionRevision[0].basicPension"
      }),
      totalPension: getTextField({
        label: {
          labelName: "totalPension",
          labelKey: "PENSION_EMPLOYEE_PENSION_TP_R"
        },
        props:{
          className:"applicant-details-error"
        }, 
        placeholder: {
          labelName: "totalPension",
          labelKey: "PENSION_EMPLOYEE_PENSION_TP_R"
        },
         required:false,
         minValue:0,
          maxLength:18,
         props: {
          disabled:true, 
        },
        pattern: getPMSPattern("Amount"),
        jsonPath: "ProcessInstances[0].pensionRevision[0].totalPension"
      }),
     
      //3
      da: getTextField({
        label: {
          labelName: "da",
          labelKey: "PENSION_EMPLOYEE_PENSION_DA_R"
        },
        props:{
          className:"applicant-details-error"
        }, 
        placeholder: {
          labelName: "da",
          labelKey: "PENSION_EMPLOYEE_PENSION_DA_R"
        },
        required:false,
         minValue:0,
          maxLength:18,
        props: {
          disabled:!IsEdit,        
        },
        pattern: getPMSPattern("Amount"),
        jsonPath: "ProcessInstances[0].pensionRevision[0].da"
      }),
      overPayment: getTextField({
        label: {
          labelName: "overPayment",
          labelKey: "PENSION_EMPLOYEE_PENSION_OVER_PAYMENT_R"
        },
        props:{
          className:"applicant-details-error"
        }, 
        placeholder: {
          labelName: "overPayment",
          labelKey: "PENSION_EMPLOYEE_PENSION_OVER_PAYMENT_R"
        },
         required:false,
         minValue:0,
          maxLength:18,
         props: {
          disabled:!IsEdit, 
        },
        pattern: getPMSPattern("Amount"),
        jsonPath: "ProcessInstances[0].pensionRevision[0].overPayment"
      }),
     
      //4
      commutedPension: getTextField({
        label: {
          labelName: "commutedPension",
          labelKey: "PENSION_EMPLOYEE_PENSION_COMMMUTED_PEENSION_R"
        },
        props:{
          className:"applicant-details-error"
        }, 
        visible: true,
        placeholder: {
          labelName: "commutedPension",
          labelKey: "PENSION_EMPLOYEE_PENSION_COMMMUTED_PEENSION_R"
        },
       required:false,
        minValue:0,
          maxLength:18,
        props: {
          disabled:!IsEdit,   
        },
        pattern: getPMSPattern("Amount"),
        jsonPath: "ProcessInstances[0].pensionRevision[0].commutedPension"
        
      }),
      incomeTax: getTextField({
        label: {
          labelName: "incomeTax",
          labelKey: "PENSION_EMPLOYEE_PENSION_INCOMETAX_R"
        },
        props:{
          className:"applicant-details-error"
        }, 
        placeholder: {
          labelName: "incomeTax",
          labelKey: "PENSION_EMPLOYEE_PENSION_INCOMETAX_R"
        },
        required:false,
        minValue:0,
          maxLength:18,
        visible: true,
        props: {
          disabled:!IsEdit, 
        },
        pattern: getPMSPattern("Amount"),
        jsonPath: "ProcessInstances[0].pensionRevision[0].incomeTax"
      }),

      //5
      additionalPension: getTextField({
        label: {
          labelName: "additionalPension",
          labelKey: "PENSION_EMPLOYEE_PENSION_AP_R"
        },
        props:{
          className:"applicant-details-error"
        }, 
        visible: true,
        placeholder: {
          labelName: "additionalPension",
          labelKey: "PENSION_EMPLOYEE_PENSION_AP_R"
        },
       required:false,
        minValue:0,
          maxLength:18,
        props: {
          disabled:!IsEdit,     
        },
        pattern: getPMSPattern("Amount"),
        jsonPath: "ProcessInstances[0].pensionRevision[0].additionalPension"
        
      }),
      cess: getTextField({
        label: {
          labelName: "cess",
          labelKey: "PENSION_EMPLOYEE_PENSION_CESS_R"
        },
        props:{
          className:"applicant-details-error"
        }, 
        placeholder: {
          labelName: "cess",
          labelKey: "PENSION_EMPLOYEE_PENSION_CESS_R"
        },
        required:false,
        minValue:0,
          maxLength:18,
        visible: true,
        props: {
          disabled:!IsEdit, 
        },
        pattern: getPMSPattern("Amount"),
        jsonPath: "ProcessInstances[0].pensionRevision[0].cess"
      }), 

     //6
     interimRelief: getTextField({
        label: {
          labelName: "interimRelief",
          labelKey: "PENSION_EMPLOYEE_PENSION_IR_R"
        },
        props:{
          className:"applicant-details-error"
        }, 
        placeholder: {
          labelName: "interimRelief",
          labelKey: "PENSION_EMPLOYEE_PENSION_IR_R"
        },
        required:false,
         minValue:0,
          maxLength:18,
          visible:true,
        props: {
          disabled:!IsEdit,       
        },
        pattern: getPMSPattern("Amount"),
        jsonPath: "ProcessInstances[0].pensionRevision[0].interimRelief"
      }),
      pensionDeductions: getTextField({
        label: {
          labelName: "pensionDeductions",
          labelKey: "PENSION_EMPLOYEE_PENSION_PD_R"
        },
        props:{
          className:"applicant-details-error"
        }, 
        placeholder: {
          labelName: "pensionDeductions",
          labelKey: "PENSION_EMPLOYEE_PENSION_PD_R"
        },
         required:false,
         minValue:0,
          maxLength:18,
          visible:true,
        props: {
          disabled:!IsEdit, 
        },
        pattern: getPMSPattern("Amount"),
        jsonPath: "ProcessInstances[0].pensionRevision[0].pensionDeductions"
      }),

 
       //7
       fma: getTextField({
        label: {
          labelName: "fma",
          labelKey: "PENSION_EMPLOYEE_PENSION_FMA"
        },
        props:{
          className:"applicant-details-error"
        }, 
        placeholder: {
          labelName: "fma",
          labelKey: "PENSION_EMPLOYEE_PENSION_FMA"
        },
        required:false,
         minValue:0,
          maxLength:18,
        props: {
          disabled:!IsEdit,      
        },
        pattern: getPMSPattern("Amount"),
        jsonPath: "ProcessInstances[0].pensionRevision[0].fma"
      }),
      netDeductions: getTextField({
        label: {
          labelName: "netDeductions",
          labelKey: "PENSION_EMPLOYEE_PENSION_NET_DEDUCTION_R"
        },
        props:{
          className:"applicant-details-error"
        }, 
        placeholder: {
          labelName: "netDeductions",
          labelKey: "PENSION_EMPLOYEE_PENSION_NET_DEDUCTION_R"
        },
         required:false,
         minValue:0,
          maxLength:18,
         props: {
           disabled:true,
        },
        pattern: getPMSPattern("Amount"),
        jsonPath: "ProcessInstances[0].pensionRevision[0].netDeductions"
      }),
    
      //8
      miscellaneous: getTextField({
        label: {
          labelName: "miscellaneous",
          labelKey: "PENSION_EMPLOYEE_PENSION_MISCELLENOUS_R"
        },
        props:{
          className:"applicant-details-error"
        }, 
        placeholder: {
          labelName: "miscellaneous",
          labelKey: "PENSION_EMPLOYEE_PENSION_MISCELLENOUS_R"
        },
        required:false,
         minValue:0,
          maxLength:18,
          visible:true,
        props: {
          disabled:!IsEdit,       
        },
        pattern: getPMSPattern("Amount"),
        jsonPath: "ProcessInstances[0].pensionRevision[0].miscellaneous"
      }),
      finalCalculatedPension: getTextField({
        label: {
          labelName: "finalCalculatedPension",
          labelKey: "PENSION_EMPLOYEE_PENSION_FINAL_DEDUCTION_R"
        },
        props:{
          className:"applicant-details-error"
        }, 
        placeholder: {
          labelName: "finalCalculatedPension",
          labelKey: "PENSION_EMPLOYEE_PENSION_FINAL_DEDUCTION_R"
        },
         required:false,
         minValue:0,
          maxLength:18,
          visible:true,
        props: {
           disabled:true,
        },
        pattern: getPMSPattern("Amount"),
        jsonPath: "ProcessInstances[0].pensionRevision[0].finalCalculatedPension"
      }),
     
      //9
      woundExtraordinaryPension: getTextField({
        label: {
          labelName: "woundExtraordinaryPension",
          labelKey: "PENSION_EMPLOYEE_PENSION_WOUNDED_PENSION_R"
        },
        gridDefination: {
          xs: 6
        },
        props:{
          className:"applicant-details-error"
        }, 
        placeholder: {
          labelName: "woundExtraordinaryPension",
          labelKey: "PENSION_EMPLOYEE_PENSION_WOUNDED_PENSION_R"
        },
        required:false,
         minValue:0,
          maxLength:18,
          visible:true,
        props: {
          disabled:!IsEdit,      
        },
        pattern: getPMSPattern("Amount"),
        jsonPath: "ProcessInstances[0].pensionRevision[0].woundExtraordinaryPension"
      }),      
      //10
      remarks: getTextField({
        label: {
          labelName: "remarks",
          labelKey: "PENSION_EMPLOYEE_PENSION_REMARKS_R"
        },
        props:{
          className:"applicant-details-error"
        }, 
        placeholder: {
          labelName: "remarks",
          labelKey: "PENSION_EMPLOYEE_PENSION_REMARKS_R"
        },
       required:false,
        minValue:0,
          maxLength:18,
        props: {
          disabled:!IsEdit,    
        },
        pattern: getPMSPattern("Address"),
        jsonPath: "ProcessInstances[0].pensionRevision[0].remarks"
      }),     
      attendantAllowance: getTextField({
        label: {
          labelName: "attendantAllowance",
          labelKey: "PENSION_EMPLOYEE_PENSION_FINAL_TEN_ALLOWANCE_R"
        },
        props:{
          className:"applicant-details-error"
        }, 
        placeholder: {
          labelName: "attendantAllowance",
          labelKey: "PENSION_EMPLOYEE_PENSION_FINAL_TEN_ALLOWANCE_R"
        },
         required:false,
         minValue:0,
          maxLength:18,
          visible:true,
        props: {
          disabled:!IsEdit, 
        },
        pattern: getPMSPattern("Amount"),
        jsonPath: "ProcessInstances[0].pensionRevision[0].attendantAllowance"
      }),

     
    })
  });
  }
