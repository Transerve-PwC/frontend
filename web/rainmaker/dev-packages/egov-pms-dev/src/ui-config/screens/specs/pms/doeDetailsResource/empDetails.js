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
  getPattern,
  
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getPMSPattern } from "../../../../../ui-utils/commons";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import set from "lodash/set";
import { getCommonApplyFooter, validateFields,convertDateToEpoch } from "../../utils";
import { httpRequest } from "../../../../../ui-utils";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  furnishNocResponse,
  getSearchResults
} from "../../../../../ui-utils/commons";
import {
  
  objectToDropdown, getTextToLocalMapping
  
} from "../../utils";


import {
  prepareFinalObject as pFO,
  
} from "egov-ui-framework/ui-redux/screen-configuration/actions";

let DpendentIndex = 0;
let MsSelect =''
const ActionCalculateDependentPension = async (state, dispatch) => {

  let validDependent = true;
  let isDependentValidDOB = true;

  let depJsonPath =
  "components.div.children.formwizardFirstStep.children.empDetails.children.cardContent.children.dependentUnitcard.props.items";
let dependent = get(
  state.screenConfiguration.screenConfig.doeDetails,
  depJsonPath,
  []
);
for (var i = 0; i < dependent.length; i++) {
  if (
    (dependent[i].isDeleted === undefined ||
      dependent[i].isDeleted !== false) &&
    !validateFields(
      `${depJsonPath}[${i}].item${i}.children.cardContent.children.dependentUnitcardContainer.children`,
      state,
      dispatch,
      "doeDetails"
    )
  )
  { 
    const fields = get(
    state.screenConfiguration.screenConfig["doeDetails"],
    `${depJsonPath}[${i}].item${i}.children.cardContent.children.dependentUnitcardContainer.children`,
    {}
  );
  if((fields.Address.isFieldValid ===false
    ||fields.Name.isFieldValid === false
    ||fields.Phone.isFieldValid === false
    ||fields.dob.isFieldValid ===false
    || fields.relationType.isFieldValid ===false))
    {
      validDependent = false

    }
    else{
      validDependent = true;
      if(fields.relationType.props.value )
      {
        if((fields.relationType.props.value ==='DAUGHTER' 
        || fields.relationType.props.value ==='SISTER'
        || fields.relationType.props.value ==='STEP_SISTER') && fields.maritalStatus.isFieldValid ===false)
            {
              validDependent = false
            }
            else{
              validDependent = true
            }
      }
      
      
    }
 
  }
 
}


if(validDependent)
    {
      

      let dept = get(
        state.screenConfiguration.preparedFinalObject,
        "ProcessInstances[0].dependents",
        []
      );
      
      for (let index = 0; index < dept.length; index++) {
        const element = dept[index];
       // if ((dept[index].isDeleted === undefined || dept[index].isDeleted !== false))
       if(element)
        {
          
         const  dob = new Date(element.dob);
         const  end =  new Date() ;      
         if(dob>end)
         {
           
          
           isDependentValidDOB = false;
          
           break;
         }      
        
        }
       
        
      }
    }
if(validDependent && isDependentValidDOB)
{


  const tenantId = getQueryArg(window.location.href, "tenantId");
  let dependentstemp = get(
    state.screenConfiguration.preparedFinalObject,
    "ProcessInstances[0].dependents",
    []
  );
  dependentstemp = dependentstemp.filter((item) => item.isDeleted === undefined || item.isDeleted !== false);
    console.log(dependentstemp)
    console.log("payload_")

    let payloadtemp = get(
      state.screenConfiguration.preparedFinalObject,
      "ProcessInstances",
      []
    );
  set(payloadtemp[0], 
    "dependents",
    dependentstemp);
    dispatch(prepareFinalObject("ProcessInstances", payloadtemp)); 
//   let depJsonPath =
//   "components.div.children.formwizardFirstStep.children.empDetails.children.cardContent.children.dependentUnitcard.props.items";
// let dependentstemp = get(
//   state.screenConfiguration.screenConfig.doeDetails,
//   depJsonPath,
//   []
// );
  for (let index = 0; index < dependentstemp.length; index++) {
    const element = dependentstemp[index];
    
    if ((dependentstemp[index].isDeleted === undefined ))//|| dependentstemp[index].isDeleted !== false))
   
    {  
       
      console.log(dependentstemp[index]);
      set(state,`screenConfiguration.preparedFinalObject.ProcessInstances[0].dependents[${index}].dob`, convertDateToEpoch(element.dob, "dob"));
      set(state,`screenConfiguration.preparedFinalObject.ProcessInstances[0].dependents[${index}].name`, (element.name));
      set(state,`screenConfiguration.preparedFinalObject.ProcessInstances[0].dependents[${index}].address`, (element.address));
      set(state,`screenConfiguration.preparedFinalObject.ProcessInstances[0].dependents[${index}].mobileNumber`, Number(element.mobileNumber));
      set(state,`screenConfiguration.preparedFinalObject.ProcessInstances[0].dependents[${index}].relationship`, (element.relationship));
      set(state,`screenConfiguration.preparedFinalObject.ProcessInstances[0].dependents[${index}].isDisabled`, Boolean(element.isDisabled));
      set(state,`screenConfiguration.preparedFinalObject.ProcessInstances[0].dependents[${index}].isEligibleForGratuity`, Boolean(element.isEligibleForGratuity));
      set(state,`screenConfiguration.preparedFinalObject.ProcessInstances[0].dependents[${index}].isEligibleForPension`, Boolean(element.isEligibleForPension));
      set(state,`screenConfiguration.preparedFinalObject.ProcessInstances[0].dependents[${index}].isGrandChildFromDeceasedSon`, Boolean(element.isGrandChildFromDeceasedSon));
      set(state,`screenConfiguration.preparedFinalObject.ProcessInstances[0].dependents[${index}].isHollyDependent`, Boolean(element.isHollyDependent));
      set(state,`screenConfiguration.preparedFinalObject.ProcessInstances[0].dependents[${index}].maritalStatus`, (element.maritalStatus));
      set(state,`screenConfiguration.preparedFinalObject.ProcessInstances[0].dependents[${index}].noSpouseNoChildren`, Boolean(element.noSpouseNoChildren)); 
    
    
    }
    
  }
  let payload_ = get(
    state.screenConfiguration.preparedFinalObject,
    "ProcessInstances[0].dependents",
    []
  );
 
  let WFBody = {
    ProcessInstances: [
      {
        tenantId: tenantId,
        dependents:payload_,
      }       
  ]
  };
 
  try {
    let payload = null;
    
    let response = await httpRequest(
      "post",
      "/pension-services/v1/_checkDependentEligibilityForBenefit",
      "",
      [],
      WFBody
    );
     payload = get(
      state.screenConfiguration.preparedFinalObject,
      "ProcessInstances",
      []
    );
    console.log(response)
    console.log("response")
    if(response!== undefined)
    {
      let dependents =[
        {
          name: "name 1",
          dob: 0,
          address: "Adddress1",
          mobileNumber: 0,
          relationship: "Son",
          isDisabled: true,
          maritalStatus: false,
          isHollyDependent: true,
          noSpouseNoChildren: true,
          isGrandChildFromDeceasedSon: true,
          isEligibleForGratuity: true,
          isEligibleForPension: true
        }
      ]

      dependents = response.ProcessInstances[0].dependents; 
     // set(payload[0], 
       // "dependents", 
       // dependents);
       //dispatch(prepareFinalObject("ProcessInstances", payload));      
      //set gratuity text box and lable based on api responce
      for (let index = 0; index < response.ProcessInstances[0].dependents.length; index++) {        
        //alert(response.ProcessInstances[0].dependents[index].isEligibleForPension);
        set(state.screenConfiguration.screenConfig.doeDetails,
         "components.div.children.formwizardFirstStep.children.empDetails.children.cardContent.children.dependentUnitcard.props.items[" + index + "].item" + index + ".children.cardContent.children.dependentUnitcardContainer.children.PensionEligible.visible"
         ,response.ProcessInstances[0].dependents[index].isEligibleForPension)
         //
         if(response.ProcessInstances[0].dependents[index].isEligibleForPension)
         {
         
         dispatch(
          handleField(
          "doeDetails",
          "components.div.children.formwizardFirstStep.children.empDetails.children.cardContent.children.dependentUnitcard.props.items[" + index + "].item" + index + ".children.cardContent.children.dependentUnitcardContainer.children.PensionEligible",
          "props.style",
          { display: "inline-block" }
          ));
         }
         if(response.ProcessInstances[0].dependents[index].isEligibleForGratuity)
         {
         
         dispatch(
          handleField(
          "doeDetails",
          "components.div.children.formwizardFirstStep.children.empDetails.children.cardContent.children.dependentUnitcard.props.items[" + index + "].item" + index + ".children.cardContent.children.dependentUnitcardContainer.children.gratuityEligible",
          "props.style",
          { display: "inline-block" }
          ));
          dispatch(
            handleField(
            "doeDetails",
            "components.div.children.formwizardFirstStep.children.empDetails.children.cardContent.children.dependentUnitcard.props.items[" + index + "].item" + index + ".children.cardContent.children.dependentUnitcardContainer.children.gratuityPercentage",
            "props.style",
            { display: "inline-block" }
            ));
         }
          //
          if(response.ProcessInstances[0].dependents[index].isEligibleForGratuity)
          {
         // set default 0 for gratuity amount ProcessInstances[0].dependents[0].gratuityPercentage
         dispatch(prepareFinalObject(`ProcessInstances[0].dependents[${index}].gratuityPercentage`,0));
        set(state.screenConfiguration.screenConfig.doeDetails,
        "components.div.children.formwizardFirstStep.children.empDetails.children.cardContent.children.dependentUnitcard.props.items[" + index + "].item" + index + ".children.cardContent.children.dependentUnitcardContainer.children.gratuityEligible.visible"
        ,response.ProcessInstances[0].dependents[index].isEligibleForGratuity)
        set(state.screenConfiguration.screenConfig.doeDetails,
          "components.div.children.formwizardFirstStep.children.empDetails.children.cardContent.children.dependentUnitcard.props.items[" + index + "].item" + index + ".children.cardContent.children.dependentUnitcardContainer.children.gratuityPercentage.visible"
          ,response.ProcessInstances[0].dependents[index].isEligibleForGratuity)
          // dispatch(
          //   handleField(
          //   "doeDetails",
          //   "components.div.children.formwizardFirstStep.children.empDetails.children.cardContent.children.dependentUnitcard.props.items[" + index + "].item" + index + ".children.cardContent.children.dependentUnitcardContainer.children.gratuityEligible",
          //   "props.style",
          //   { display: "inline-block" }
          //   ));
          //   dispatch(
          //     handleField(
          //     "doeDetails",
          //     "components.div.children.formwizardFirstStep.children.empDetails.children.cardContent.children.dependentUnitcard.props.items[" + index + "].item" + index + ".children.cardContent.children.dependentUnitcardContainer.children.gratuityPercentage",
          //     "props.style",
          //     { display: "inline-block" }
          //     ));
        }

          
                  
      }
      set(payload[0], 
        "dependents", 
        dependents);   
       dispatch(prepareFinalObject("ProcessInstances", payload)); 
      //  for (let index = 0; index < response.ProcessInstances[0].dependents.length; index++) {
      //  set(state.screenConfiguration.screenConfig.doeDetails,
      //    "components.div.children.formwizardFirstStep.children.empDetails.children.cardContent.children.dependentUnitcard.props.items[" + index + "].item" + index + ".children.cardContent.children.dependentUnitcardContainer.children.PensionEligible.visible"
      //    ,response.ProcessInstances[0].dependents[index].isEligibleForPension)
      //   set(state.screenConfiguration.screenConfig.doeDetails,
      //   "components.div.children.formwizardFirstStep.children.empDetails.children.cardContent.children.dependentUnitcard.props.items[" + index + "].item" + index + ".children.cardContent.children.dependentUnitcardContainer.children.gratuityEligible.visible"
      //   ,response.ProcessInstances[0].dependents[index].isEligibleForGratuity)
      //   set(state.screenConfiguration.screenConfig.doeDetails,
      //     "components.div.children.formwizardFirstStep.children.empDetails.children.cardContent.children.dependentUnitcard.props.items[" + index + "].item" + index + ".children.cardContent.children.dependentUnitcardContainer.children.gratuityPercentage.visible"
      //     ,response.ProcessInstances[0].dependents[index].isEligibleForGratuity)
      //  }
       
       
    }


  }
  catch(error)
  {
    dispatch(toggleSnackbar(true, { labelName: error.message }, "error"));
  }
}
  else{
    let errorMessage = {
      labelName:
        "Please fill all mandatory fields and upload the documents !",
      labelKey: "PENSION_ERR_UPLOAD_REQUIRED_DOCUMENTS"
    };
    if (!isDependentValidDOB)
    {
      errorMessage = {
        labelName:
          "Date of birth should be less then current date!",
        labelKey: "PENSION_ERR_FILL_EMP_VALD_DATE_OF_BIRTH"
      };
    }
    else if(!validDependent)
    {
      errorMessage = {
        labelName:
          "Enter valid Dependent Information, then procced !",
        labelKey: "PENSION_ERR_FILL_EMP_VALD_DEPENDENT_INFORMATION"
      };

    }
    dispatch(toggleSnackbar(true, errorMessage, "warning"));
  }
}

export const empDetails = (data) => {
const dependentUnitcard = {
  uiFramework: "custom-containers",
  componentPath: "MultiItem",
  props: {
    
    scheama: getCommonGrayCard({
      header: getCommonSubHeader(
        {
          labelName: "Dependent Infornamtion",
          labelKey: "PENSION_EMPLOYEE_DEPENDENT"
        },
        {
          style: {
            marginBottom: 18
          }
        }
      ),
      dependentUnitcardContainer: getCommonContainer(
        {
          relationType: {
            ...getSelectField({
              label: {
                labelName: "relation Type",
                labelKey: "PENSION_DEPENDENT_TYPE"
              },
              placeholder: {
                labelName: "Select relation Type",
                labelKey: "PENSION_DEPENDENT_TYPE"
              },
              required: true,
             
              jsonPath: "ProcessInstances[0].dependents[0].relationship",
              localePrefix: {
                moduleName: "egov-PENSION",
               masterName: "relationType"
              },
              props: {
                jsonPathUpdatePrefix: "ProcessInstances[0].dependents",
                setDataInField: true,
                disabled: data[2].employeeLeaveUpdate,  
                className:"applicant-details-error"
              },
              sourceJsonPath:
              "applyScreenMdmsData.pension.relationships",
              //"applyScreenMdmsData.relationships",
             
            }),
            beforeFieldChange: (action, state, dispatch) => {
             // alert(action.value+'i am in before field channge')
              let cardIndex = action.componentJsonpath.split("items[")[1].split("]")[0];
              DpendentIndex = cardIndex;
             let dependent = get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].dependents", [] )
             console.log(dependent)
             console.log("dependent")
             
               if(action.value==="SON" )
              {
                
                //set isDisable property
                dispatch(
                  handleField(
                    "doeDetails",
                    "components.div.children.formwizardFirstStep.children.empDetails.children.cardContent.children.dependentUnitcard.props.items[" + cardIndex + "].item" + cardIndex + ".children.cardContent.children.dependentUnitcardContainer.children.IsDisableOption",
                    "props.style",
                    { display: "inline-block" }
                  )
                ); 
                
                dispatch(
                  handleField(
                    "doeDetails",
                    "components.div.children.formwizardFirstStep.children.empDetails.children.cardContent.children.dependentUnitcard.props.items[" + cardIndex + "].item" + cardIndex + ".children.cardContent.children.dependentUnitcardContainer.children.maritalStatus",
                    "props.style",
                    { display: "none" }
                  )
                ); 
                dispatch(
                  handleField(
                    "doeDetails",
                    "components.div.children.formwizardFirstStep.children.empDetails.children.cardContent.children.dependentUnitcard.props.items[" + cardIndex + "].item" + cardIndex + ".children.cardContent.children.dependentUnitcardContainer.children.IsHollyDependentOption",
                    "props.style",
                    { display: "none" }
                  )
                ); 
                dispatch(
                  handleField(
                    "doeDetails",
                    "components.div.children.formwizardFirstStep.children.empDetails.children.cardContent.children.dependentUnitcard.props.items[" + cardIndex + "].item" + cardIndex + ".children.cardContent.children.dependentUnitcardContainer.children.IsNoSpauseNoChildrenOption",
                    "props.style",
                    { display: "none" }
                  )
                ); 
                dispatch(
                  handleField(
                    "doeDetails",
                    "components.div.children.formwizardFirstStep.children.empDetails.children.cardContent.children.dependentUnitcard.props.items[" + cardIndex + "].item" + cardIndex + ".children.cardContent.children.dependentUnitcardContainer.children.IsGrandChildFromDeceasedSonOption",
                    "props.style",
                    { display: "none" }
                  )
                ); 


              }
              else if( action.value==="DAUGHTER")
              {
                
                //set isDisable property
                dispatch(
                  handleField(
                    "doeDetails",
                    "components.div.children.formwizardFirstStep.children.empDetails.children.cardContent.children.dependentUnitcard.props.items[" + cardIndex + "].item" + cardIndex + ".children.cardContent.children.dependentUnitcardContainer.children.IsDisableOption",
                    "props.style",
                    { display: "inline-block" }
                  )
                ); 
                
                dispatch(
                  handleField(
                    "doeDetails",
                    "components.div.children.formwizardFirstStep.children.empDetails.children.cardContent.children.dependentUnitcard.props.items[" + cardIndex + "].item" + cardIndex + ".children.cardContent.children.dependentUnitcardContainer.children.maritalStatus",
                    "props.style",
                    { display: "inline-block" }
                  )
                ); 
                dispatch(
                  handleField(
                    "doeDetails",
                    "components.div.children.formwizardFirstStep.children.empDetails.children.cardContent.children.dependentUnitcard.props.items[" + cardIndex + "].item" + cardIndex + ".children.cardContent.children.dependentUnitcardContainer.children.IsHollyDependentOption",
                    "props.style",
                    { display: "none" }
                  )
                ); 
                dispatch(
                  handleField(
                    "doeDetails",
                    "components.div.children.formwizardFirstStep.children.empDetails.children.cardContent.children.dependentUnitcard.props.items[" + cardIndex + "].item" + cardIndex + ".children.cardContent.children.dependentUnitcardContainer.children.IsNoSpauseNoChildrenOption",
                    "props.style",
                    { display: "none" }
                  )
                ); 
                dispatch(
                  handleField(
                    "doeDetails",
                    "components.div.children.formwizardFirstStep.children.empDetails.children.cardContent.children.dependentUnitcard.props.items[" + cardIndex + "].item" + cardIndex + ".children.cardContent.children.dependentUnitcardContainer.children.IsGrandChildFromDeceasedSonOption",
                    "props.style",
                    { display: "none" }
                  )
                ); 


              }
              else if(action.value==="SISTER"||action.value==="STEP_SISTER")
              {
                //marital status[daughter/sister/step sister
                dispatch(
                  handleField(
                    "doeDetails",
                    "components.div.children.formwizardFirstStep.children.empDetails.children.cardContent.children.dependentUnitcard.props.items[" + cardIndex + "].item" + cardIndex + ".children.cardContent.children.dependentUnitcardContainer.children.IsDisableOption",
                    "props.style",
                    { display: "none" }
                  )
                ); 
                
                dispatch(
                  handleField(
                    "doeDetails",
                    "components.div.children.formwizardFirstStep.children.empDetails.children.cardContent.children.dependentUnitcard.props.items[" + cardIndex + "].item" + cardIndex + ".children.cardContent.children.dependentUnitcardContainer.children.maritalStatus",
                    "props.style",
                    { display: "inline-block" }
                  )
                ); 
                dispatch(
                  handleField(
                    "doeDetails",
                    "components.div.children.formwizardFirstStep.children.empDetails.children.cardContent.children.dependentUnitcard.props.items[" + cardIndex + "].item" + cardIndex + ".children.cardContent.children.dependentUnitcardContainer.children.IsHollyDependentOption",
                    "props.style",
                    { display: "none" }
                  )
                ); 
                dispatch(
                  handleField(
                    "doeDetails",
                    "components.div.children.formwizardFirstStep.children.empDetails.children.cardContent.children.dependentUnitcard.props.items[" + cardIndex + "].item" + cardIndex + ".children.cardContent.children.dependentUnitcardContainer.children.IsNoSpauseNoChildrenOption",
                    "props.style",
                    { display: "none" }
                  )
                ); 
                dispatch(
                  handleField(
                    "doeDetails",
                    "components.div.children.formwizardFirstStep.children.empDetails.children.cardContent.children.dependentUnitcard.props.items[" + cardIndex + "].item" + cardIndex + ".children.cardContent.children.dependentUnitcardContainer.children.IsGrandChildFromDeceasedSonOption",
                    "props.style",
                    { display: "none" }
                  )
                ); 


                
              }
              else if(action.value==="FATHER"|| action.value==="MOTHER")
              {
                //is wholly dependent[father/ mother]
                //is no spause no children[father/ mother]
                dispatch(
                  handleField(
                    "doeDetails",
                    "components.div.children.formwizardFirstStep.children.empDetails.children.cardContent.children.dependentUnitcard.props.items[" + cardIndex + "].item" + cardIndex + ".children.cardContent.children.dependentUnitcardContainer.children.IsDisableOption",
                    "props.style",
                    { display: "none" }
                  )
                ); 
                
                dispatch(
                  handleField(
                    "doeDetails",
                    "components.div.children.formwizardFirstStep.children.empDetails.children.cardContent.children.dependentUnitcard.props.items[" + cardIndex + "].item" + cardIndex + ".children.cardContent.children.dependentUnitcardContainer.children.maritalStatus",
                    "props.style",
                    { display: "none" }
                  )
                ); 
                dispatch(
                  handleField(
                    "doeDetails",
                    "components.div.children.formwizardFirstStep.children.empDetails.children.cardContent.children.dependentUnitcard.props.items[" + cardIndex + "].item" + cardIndex + ".children.cardContent.children.dependentUnitcardContainer.children.IsHollyDependentOption",
                    "props.style",
                    { display: "inline-block" }
                  )
                ); 
                dispatch(
                  handleField(
                    "doeDetails",
                    "components.div.children.formwizardFirstStep.children.empDetails.children.cardContent.children.dependentUnitcard.props.items[" + cardIndex + "].item" + cardIndex + ".children.cardContent.children.dependentUnitcardContainer.children.IsNoSpauseNoChildrenOption",
                    "props.style",
                    { display: "inline-block" }
                  )
                ); 
                dispatch(
                  handleField(
                    "doeDetails",
                    "components.div.children.formwizardFirstStep.children.empDetails.children.cardContent.children.dependentUnitcard.props.items[" + cardIndex + "].item" + cardIndex + ".children.cardContent.children.dependentUnitcardContainer.children.IsGrandChildFromDeceasedSonOption",
                    "props.style",
                    { display: "none" }
                  )
                ); 
 

                
              }
              else if(action.value==="GRAND_CHILD")
              {
                //is grand child from deceased son [grand child] 
                dispatch(
                  handleField(
                    "doeDetails",
                    "components.div.children.formwizardFirstStep.children.empDetails.children.cardContent.children.dependentUnitcard.props.items[" + cardIndex + "].item" + cardIndex + ".children.cardContent.children.dependentUnitcardContainer.children.IsDisableOption",
                    "props.style",
                    { display: "none" }
                  )
                ); 
                
                dispatch(
                  handleField(
                    "doeDetails",
                    "components.div.children.formwizardFirstStep.children.empDetails.children.cardContent.children.dependentUnitcard.props.items[" + cardIndex + "].item" + cardIndex + ".children.cardContent.children.dependentUnitcardContainer.children.maritalStatus",
                    "props.style",
                    { display: "none" }
                  )
                ); 
                dispatch(
                  handleField(
                    "doeDetails",
                    "components.div.children.formwizardFirstStep.children.empDetails.children.cardContent.children.dependentUnitcard.props.items[" + cardIndex + "].item" + cardIndex + ".children.cardContent.children.dependentUnitcardContainer.children.IsHollyDependentOption",
                    "props.style",
                    { display: "none" }
                  )
                ); 
                dispatch(
                  handleField(
                    "doeDetails",
                    "components.div.children.formwizardFirstStep.children.empDetails.children.cardContent.children.dependentUnitcard.props.items[" + cardIndex + "].item" + cardIndex + ".children.cardContent.children.dependentUnitcardContainer.children.IsNoSpauseNoChildrenOption",
                    "props.style",
                    { display: "none" }
                  )
                ); 
                dispatch(
                  handleField(
                    "doeDetails",
                    "components.div.children.formwizardFirstStep.children.empDetails.children.cardContent.children.dependentUnitcard.props.items[" + cardIndex + "].item" + cardIndex + ".children.cardContent.children.dependentUnitcardContainer.children.IsGrandChildFromDeceasedSonOption",
                    "props.style",
                    { display: "inline-block" }
                  )
                ); 


              }
              else 
              {
                dispatch(
                  handleField(
                    "doeDetails",
                    "components.div.children.formwizardFirstStep.children.empDetails.children.cardContent.children.dependentUnitcard.props.items[" + cardIndex + "].item" + cardIndex + ".children.cardContent.children.dependentUnitcardContainer.children.IsDisableOption",
                    "props.style",
                    { display: "none" }
                  )
                ); 
                
                dispatch(
                  handleField(
                    "doeDetails",
                    "components.div.children.formwizardFirstStep.children.empDetails.children.cardContent.children.dependentUnitcard.props.items[" + cardIndex + "].item" + cardIndex + ".children.cardContent.children.dependentUnitcardContainer.children.maritalStatus",
                    "props.style",
                    { display: "none" }
                  )
                ); 
                dispatch(
                  handleField(
                    "doeDetails",
                    "components.div.children.formwizardFirstStep.children.empDetails.children.cardContent.children.dependentUnitcard.props.items[" + cardIndex + "].item" + cardIndex + ".children.cardContent.children.dependentUnitcardContainer.children.IsHollyDependentOption",
                    "props.style",
                    { display: "none" }
                  )
                ); 
                dispatch(
                  handleField(
                    "doeDetails",
                    "components.div.children.formwizardFirstStep.children.empDetails.children.cardContent.children.dependentUnitcard.props.items[" + cardIndex + "].item" + cardIndex + ".children.cardContent.children.dependentUnitcardContainer.children.IsNoSpauseNoChildrenOption",
                    "props.style",
                    { display: "none" }
                  )
                ); 
                dispatch(
                  handleField(
                    "doeDetails",
                    "components.div.children.formwizardFirstStep.children.empDetails.children.cardContent.children.dependentUnitcard.props.items[" + cardIndex + "].item" + cardIndex + ".children.cardContent.children.dependentUnitcardContainer.children.IsGrandChildFromDeceasedSonOption",
                    "props.style",
                    { display: "none" }
                  )
                ); 

              }
             // alert(data[0].employeeOtherDetailsUpdate)
              if(data[0].employeeOtherDetailsUpdate)
              {
                let isEligibleForGratuity = get(
                  state,
                  `screenConfiguration.preparedFinalObject.ProcessInstances[0].dependents[${cardIndex}].isEligibleForGratuity`,
                  false
                );
                if(isEligibleForGratuity)
                {
                  dispatch(
                    handleField(
                      "doeDetails",
                      "components.div.children.formwizardFirstStep.children.empDetails.children.cardContent.children.dependentUnitcard.props.items[" + cardIndex + "].item" + cardIndex + ".children.cardContent.children.dependentUnitcardContainer.children.gratuityEligible",
                      "props.style",
                      { display: "inline-block" }
                    )
                  ); 
  
                }
                else{
                  dispatch(
                    handleField(
                      "doeDetails",
                      "components.div.children.formwizardFirstStep.children.empDetails.children.cardContent.children.dependentUnitcard.props.items[" + cardIndex + "].item" + cardIndex + ".children.cardContent.children.dependentUnitcardContainer.children.gratuityEligible",
                      "props.style",
                      { display: "none" }
                    )
                  ); 
  
                }
                let isEligibleForPension = get(
                  state,
                  `screenConfiguration.preparedFinalObject.ProcessInstances[0].dependents[${cardIndex}].isEligibleForPension`,
                  false
                );
                if(isEligibleForPension)
                {
                  dispatch(
                    handleField(
                      "doeDetails",
                      "components.div.children.formwizardFirstStep.children.empDetails.children.cardContent.children.dependentUnitcard.props.items[" + cardIndex + "].item" + cardIndex + ".children.cardContent.children.dependentUnitcardContainer.children.PensionEligible",
                      "props.style",
                      { display: "inline-block" }
                    )
                  ); 
  
                }
                else{
                  dispatch(
                    handleField(
                      "doeDetails",
                      "components.div.children.formwizardFirstStep.children.empDetails.children.cardContent.children.dependentUnitcard.props.items[" + cardIndex + "].item" + cardIndex + ".children.cardContent.children.dependentUnitcardContainer.children.PensionEligible",
                      "props.style",
                      { display: "none" }
                    )
                  ); 
  
                }
               }
                //set gratuity text box and lable based on api responce
                
      // for (let index = 0; index < dependent.length; index++) {        
     
      //   set(state.screenConfiguration.screenConfig.doeDetails,
      //    "components.div.children.formwizardFirstStep.children.empDetails.children.cardContent.children.dependentUnitcard.props.items[" + index + "].item" + index + ".children.cardContent.children.dependentUnitcardContainer.children.PensionEligible.visible"
      //    ,dependent[index].isEligibleForPension)
      //   set(state.screenConfiguration.screenConfig.doeDetails,
      //   "components.div.children.formwizardFirstStep.children.empDetails.children.cardContent.children.dependentUnitcard.props.items[" + index + "].item" + index + ".children.cardContent.children.dependentUnitcardContainer.children.gratuityEligible.visible"
      //   ,dependent[index].isEligibleForGratuity)
      //   set(state.screenConfiguration.screenConfig.doeDetails,
      //     "components.div.children.formwizardFirstStep.children.empDetails.children.cardContent.children.dependentUnitcard.props.items[" + index + "].item" + index + ".children.cardContent.children.dependentUnitcardContainer.children.gratuityPercentage.visible"
      //     ,dependent[index].isEligibleForGratuity)
      //   }
             
            }
          },

          dob: getDateField({
            label: {
              labelName: "Date of Birth",
              labelKey: "PENSION_DOB"
            },
            props:{
              className:"applicant-details-error"
            }, 
            placeholder: {
              labelName: "Date of Birth",
              labelKey: "PENSION_DOB"
            },
            required: true,
            minValue:0,
            props: {
              disabled: data[0].employeeOtherDetailsUpdate,      
            },
            pattern: getPattern("Date"),
            jsonPath: "ProcessInstances[0].dependents[0].dob"
          }),
          Name: getTextField({
            label: {
              labelName: "Dependent Name",
              labelKey: "PENSION_DEPENDENT_NAME"
            },
            props:{
              className:"applicant-details-error"
            }, 
            placeholder: {
              labelName: "Dependent Name",
              labelKey: "PENSION_DEPENDENT_NAME"
            },
            required: true,
            minValue:0,
            props: {
              disabled: data[0].employeeOtherDetailsUpdate,      
            },
            pattern: getPattern("Name"),
            jsonPath: "ProcessInstances[0].dependents[0].name"
          }),
          Address: getTextField({
            label: {
              labelName: "Address",
              labelKey: "PENSION_DEPENDENT_ADDRESS"
            },
            props:{
              className:"applicant-details-error"
            }, 
            placeholder: {
              labelName: "Address",
              labelKey: "PENSION_DEPENDENT_ADDRESS"
            },
            required: true,
            minValue:0,
            props: {
              disabled: data[0].employeeOtherDetailsUpdate,      
            },
            pattern: getPMSPattern("Address"),
            jsonPath: "ProcessInstances[0].dependents[0].address"
          }),
          bankAddress: getTextField({
            label: {
              labelName: "Bank address",
              labelKey: "PENSION_EMPLOYEE_PENSION_BA"
            },
            props:{
              className:"applicant-details-error"
            }, 
            placeholder: {
              labelName: "Bank address",
              labelKey: "PENSION_EMPLOYEE_PENSION_BA"
            },
            required:false,
            props: {
              disabled: data[0].employeeOtherDetailsUpdate,      
            },
            pattern: getPMSPattern("Address"),
            jsonPath: "ProcessInstances[0].dependents[0].bankDetails"
          }),
          accountNumber: getTextField({
            label: {
              labelName: "A/C N0.",
              labelKey: "PENSION_EMPLOYEE_PENSION_AN"
            },
            props:{
              className:"applicant-details-error"
            }, 
            placeholder: {
              labelName: "A/C N0.",
              labelKey: "PENSION_EMPLOYEE_PENSION_AN"
            },
            required: true,
            minValue:0,
            props: {
              disabled: data[0].employeeOtherDetailsUpdate,      
            },
            pattern: getPMSPattern("Amount"),
            jsonPath: "ProcessInstances[0].dependents[0].bankAccountNumber"
          }),
          bankCode: getTextField({
            label: {
              labelName: "Bank Code",
              labelKey: "PENSION_BANK_CODE"
            },
            props:{
              className:"applicant-details-error"
            }, 
            placeholder: {
              labelName: "Bank Code",
              labelKey: "PENSION_BANK_CODE"
            },
            required:false,
            maxLength:18,
            props: {
              disabled: data[0].employeeOtherDetailsUpdate,      
            },
            pattern: getPMSPattern("Name"),
            jsonPath: "ProcessInstances[0].dependents[0].bankCode"
          }),
          bankIfsc: getTextField({
            label: {
              labelName: "Bank IFSC Code",
              labelKey: "PENSION_BANK_IFSC"
            },
            props:{
              className:"applicant-details-error"
            }, 
            placeholder: {
              labelName: "Bank IFSC Code",
              labelKey: "PENSION_BANK_IFSC"
            },
            maxLength:18,
            required:false,
            props: {
              disabled: data[0].employeeOtherDetailsUpdate,      
            },
            pattern: getPMSPattern("Name"),
            jsonPath: "ProcessInstances[0].dependents[0].bankIfsc"
          }),
          Phone: getTextField({
            label: {
              labelName: "Phone",
              labelKey: "PENSION_DEPENDENT_CONTACT"
            },
            props:{
              className:"applicant-details-error"
            }, 
            placeholder: {
              labelName: "Phone",
              labelKey: "PENSION_DEPENDENT_CONTACT"
            },
            required: true,
            minValue:0,
            props: {
              disabled: data[0].employeeOtherDetailsUpdate,      
            },
            pattern: getPattern("MobileNo"),
            jsonPath: "ProcessInstances[0].dependents[0].mobileNumber"
          }),
          maritalStatus: {
            ...getSelectField({
              label: {
                labelName: "maritalStatus Type",
                labelKey: "PENSION_DEPENDENT_MARITAL_STATUS_TYPE"
              },
              placeholder: {
                labelName: "Select Marital Status",
                labelKey: "PENSION_DEPENDENT_MARITAL_STATUS_TYPE"
              },
              required: true,
             
              jsonPath: "ProcessInstances[0].dependents[0].maritalStatus",
              localePrefix: {
                moduleName: "egov-PENSION",
               masterName: "maritalStatus"
              },
              props: {
                jsonPathUpdatePrefix: "ProcessInstances[0].dependents",
                setDataInField: true,
                disabled: data[0].employeeLeaveUpdate,  
                className:"applicant-details-error"
              },
              sourceJsonPath:
              "applyScreenMdmsData.pension.marritalStatus",
              //"applyScreenMdmsData.RelationshipType",
             
            }),
            
          },
          
          IsDisableOption:getCommonContainer(
            {
              isDisabled: {
                uiFramework: "custom-containers-local",
                moduleName: "egov-pms",
               componentPath: "CheckboxContainer",
               gridDefination: {
                xs: 6
              },
                isFieldValid: true,
                required:false,
        
                props: {         
                  content: "PENSION_EMPLOYEE_DEPENDENT_DISABLED",
                  componentname:"isDisabled",
                  jsonPath: "ProcessInstances[0].dependents[0].isDisabled",
                  compJPath:
                  "components.div.children.formwizardFirstStep.children.empDetails.children.cardContent.children.dependentUnitcard.props.items",
                  //components.div.children.formwizardFirstStep.children.empDetails.children.cardContent.children.dependentUnitcard.props.items
                screenKey: "doeDetails",
                 disabled: data[0].employeeOtherDetailsUpdate,
                 style:{
                  display:'none',
                  } 
                }
        
            
              },
            }
          ),         
          IsmaritalStatusOption:getCommonContainer(
            { 
            //   maritalStatus: {
            //   uiFramework: "custom-containers-local",
            //   moduleName: "egov-pms",
            //  componentPath: "CheckboxContainer",
            //  gridDefination: {
            //   xs: 6
            // },
            //   isFieldValid: true,
            //   required:false,
      
            //   props: {         
            //     content: "PENSION_EMPLOYEE_DEPENDENT_MS",
            //     jsonPath: "ProcessInstances[0].dependents[0].maritalStatus",
            //     disabled: data[0].employeeOtherDetailsUpdate,
            //   }
      
          
            // },

           // mari
              
            }
          ),
           IsHollyDependentOption:getCommonContainer(
            {
              isHollyDependent: {
                uiFramework: "custom-containers-local",
                moduleName: "egov-pms",
               componentPath: "CheckboxContainer",
               gridDefination: {
                xs: 6
              },
                isFieldValid: true,
                required:false,
        
                props: {         
                  content: "PENSION_EMPLOYEE_DEPENDENT_HD",
                  jsonPath: "ProcessInstances[0].dependents[0].isHollyDependent",
                  componentname:"isHollyDependent",                  
                  compJPath:
                  "components.div.children.formwizardFirstStep.children.empDetails.children.cardContent.children.dependentUnitcard.props.items",
                   screenKey: "doeDetails",
                  disabled: data[0].employeeOtherDetailsUpdate,
                  style:{
                    display:'none',
                    } 
                }
        
            
              },
            }
          ),
          IsNoSpauseNoChildrenOption:getCommonContainer(
            {
                 noSpouseNoChildren: {
                uiFramework: "custom-containers-local",
                moduleName: "egov-pms",
               componentPath: "CheckboxContainer",
               gridDefination: {
                xs: 6
              },
                isFieldValid: true,
                required:false,
        
                props: { 
                  style:{
                    display:'none',
                    } ,        
                  content: "PENSION_EMPLOYEE_DEPENDENT_DISABLED_NO_S_NO_C",
                  jsonPath: "ProcessInstances[0].dependents[0].noSpouseNoChildren",
                  componentname:"noSpouseNoChildren",                  
                  compJPath:
                  "components.div.children.formwizardFirstStep.children.empDetails.children.cardContent.children.dependentUnitcard.props.items",
                   screenKey: "doeDetails",
                  disabled: data[0].employeeOtherDetailsUpdate,
                }
              },             
            }
          ),
          IsGrandChildFromDeceasedSonOption:getCommonContainer(
            {
              isGrandChildFromDeceasedSon: {
                uiFramework: "custom-containers-local",
                moduleName: "egov-pms",
               componentPath: "CheckboxContainer",
               gridDefination: {
                xs: 6
              },
                isFieldValid: true,
                required:false,
        
                props: { 
                  style:{
                    display:'none',
                    } ,        
                  content: "PENSION_EMPLOYEE_DEPENDENT_GCDS",
                  jsonPath: "ProcessInstances[0].dependents[0].isGrandChildFromDeceasedSon",
                  componentname:"isGrandChildFromDeceasedSon",                  
                  compJPath:
                  "components.div.children.formwizardFirstStep.children.empDetails.children.cardContent.children.dependentUnitcard.props.items",
                   screenKey: "doeDetails",
                  disabled: data[0].employeeOtherDetailsUpdate,
                }
        
            
              },
              
            }
          ),
          
          gratuityPercentage: getTextField({
            label: {
              labelName: "Gratuity percentage",
              labelKey: "PENSION_DEPENDENT_GC"
            },
            props:{
              className:"applicant-details-error"
            }, 
            placeholder: {
              labelName: "Gratuity percentage",
              labelKey: "PENSION_DEPENDENT_GC"
            },
            required: true,
      
            minValue:0,
            props: {
              disabled: data[0].employeeOtherDetailsUpdate, 
              style:{
              //display:'inline-block',
              }     
            },
            pattern: getPattern("Amount"),
            jsonPath: "ProcessInstances[0].dependents[0].gratuityPercentage"
          }),
          gratuityEligible: getLabelWithValue(

            {
              labelName: "Gratuity Eligible Lable Text",
              labelKey: "PENSION_DEPENDENT_ELIGIBLE_FOR_GRATUITY"
            },
          
            {
              //jsonPath: "ProcessInstances[0].dependents[0].isEligibleForGratuity",
              props: {               
                setDataInField: true,  
                jsonPath: "ProcessInstances[0].dependents[0].isEligibleForGratuity"             
              },
            },
                     
          ), 
          PensionEligible: getLabelWithValue(
            {
              labelName: "Dependent is eligible for pension",
              labelKey: "PENSION_DEPENDENT_ELIGIBLE_FOR_PENSION"
            },
            {
              //jsonPath: "ProcessInstances[0].dependents[0].isEligibleForPension",
              props: {               
                setDataInField: true,  
                jsonPath: "ProcessInstances[0].dependents[0].isEligibleForPension"             
              },
            },
           
            
                     
          ), 
          // leaveCount: getTextField({
          // label: {
          //   labelName: "leaveCount",
          //   labelKey: "PENSION_EMPLOYEE_LEAVECOUNT"
          // },
          // placeholder: {
          //   labelName: "leaveCount",
          //   labelKey: "PENSION_EMPLOYEE_LEAVECOUNT"
          // },
          // required: true,
          // props: {
          //   disabled: data[2].employeeLeaveUpdate,
          //   setDataInField: true,
          //   jsonPath: "ProcessInstances[0].dependents[0].leaveCount"
          // },
          // jsonPath: "ProcessInstances[0].dependents[0].leaveCount",
           
          // }),
          
        },
        {
          style: {
            overflow: "visible"
          }
        }
      )
    }),
    items: [],
    addItemLabel: {
      labelName: "ADD relation",
      labelKey: "PENSION_ADD_DEPENDENT"
    },
    isReviewPage:data[2].employeeLeaveUpdate,
    hasAddItem:!data[2].employeeLeaveUpdate,
    
    props: {
      disabled: data[2].employeeLeaveUpdate,      
    },
    headerName: "TradeUnits",
    headerJsonPath:
      "children.cardContent.children.header.children.head.children.Accessories.props.label",
    sourceJsonPath: "ProcessInstances[0].dependents",
    prefixSourceJsonPath:
      "children.cardContent.children.dependentUnitcardContainer.children",
    onMultiItemAdd: (state, muliItemContent) => {
      return setFieldsOnAddItem(state, muliItemContent);
    }
  },
  type: "array"
};
const setFieldsOnAddItem = (state, multiItemContent) => {
  console.log(multiItemContent)
  console.log("multiItemContent")
  const preparedFinalObject = JSON.parse(
    JSON.stringify(state.screenConfiguration.preparedFinalObject)
  );
  for (var variable in multiItemContent) {
    
    const value = get(
      preparedFinalObject,
      multiItemContent[variable].props.jsonPath
    );
   
    if (multiItemContent[variable].props.setDataInField && value) {
      if (
        multiItemContent[variable].props.jsonPath.split(".")[0] ===
          "ProcessInstances[0]" &&
        multiItemContent[variable].props.jsonPath.split(".").pop() ===
          "relationType"
      ) {
        const relationTypeData = get(
          preparedFinalObject,
          `applyScreenMdmsData.pension.relationships`,
          []
        );
        
        const tradeTypeDropdownData =
          relationTypeData &&
          relationTypeData.relationship &&
          Object.keys(relationTypeData.relationship).map(item => {
            
            return { code: item, active: true };
          });
          
        multiItemContent[variable].props.data = tradeTypeDropdownData;
        const data = relationTypeData[value];
        
        //console.log(data)
        //console.log(multiItemContent["EmployeeLeaveType"].props.data)
        //alert("relationTypeData")
        if (data) {
          multiItemContent["EmployeeLeaveType"].props.data = this.objectToDropdown(
            data
          );
        }
      } else if (
        multiItemContent[variable].props.jsonPath.split(".").pop() ===
        "EmployeeLeaveType"
      ) {
        const data = get(
          preparedFinalObject,
          `applyScreenMdmsData.pensionleaveType.${value.split(".")[0]}.${
            value.split(".")[1]
          }`
        );
        if (data) {
          multiItemContent[variable].props.data = data;
        }
      } else if (
        multiItemContent[variable].props.jsonPath.split(".").pop() ===
          "uomValue" &&
        value > 0
      ) {
        multiItemContent[variable].props.disabled = false;
        multiItemContent[variable].props.required = true;
      }
    }
    if (
      multiItemContent[variable].props.setDataInField &&
      multiItemContent[variable].props.disabled
    ) {
      if (
        multiItemContent[variable].props.jsonPath.split(".").pop() ===
        "uomValue"
      ) {
        const disabledValue = get(
          state.screenConfiguration.screenConfig["doeDetails"],
          `${multiItemContent[variable].componentJsonpath}.props.disabled`,
          true
        );
        multiItemContent[variable].props.disabled = disabledValue;
      }
    }
    else
    {
      //alert('i am in else'+variable+'value' +value)

      if(variable ==='Name' && value === undefined)
      {
        
        multiItemContent["gratuityEligible"].props.style = {display:"none"};
        multiItemContent["PensionEligible"].props.style = {display:"none"};
       
      }
      else if (variable ==='Name' && value)
      {        
        let index =multiItemContent.Name.index        
       // let gratuityEligible = get();
      const isEligibleForGratuity = get(state,`screenConfiguration.preparedFinalObject.ProcessInstances[0].dependents[${index}].isEligibleForGratuity`,false);
      const isEligibleForPension = get(state,`screenConfiguration.preparedFinalObject.ProcessInstances[0].dependents[${index}].isEligibleForPension`,false);
       if(isEligibleForGratuity)
       {
        multiItemContent["gratuityEligible"].props.style = {display:"inline-block"};
        multiItemContent["gratuityPercentage"].props.style = {display:"inline-block"};
       }
       else
       {
        multiItemContent["gratuityEligible"].props.style = {display:"none"};
        multiItemContent["gratuityPercentage"].props.style = {display:"none"};
       }
        if(isEligibleForPension)
        {
          multiItemContent["PensionEligible"].props.style = {display:"inline-block"};
        }
        else
        {
         multiItemContent["PensionEligible"].props.style = {display:"none"};
        }
      }
      else if(variable ==='IsDisableOption' && value === undefined)
      {
        multiItemContent[variable].props.style = {display:"none"};
      }
      else if(variable ==='IsHollyDependentOption' && value === undefined)
      {
        multiItemContent[variable].props.style = {display:"none"};
      }
      else if(variable ==='IsNoSpauseNoChildrenOption' && value === undefined)
      {
        multiItemContent[variable].props.style = {display:"none"};
      }
      else if(variable ==='IsGrandChildFromDeceasedSonOption' && value === undefined)
      {
        multiItemContent[variable].props.style = {display:"none"};
      }
      else if(variable ==='maritalStatus' && value === undefined)
      {
        
        multiItemContent[variable].props.style = {display:"none"};
      }
      else if(variable ==='gratuityPercentage' && value === undefined)
      {
        
        multiItemContent[variable].props.style = {display:"none"};
      }
     
     
      
    }

  }

  return multiItemContent;
};
return getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Employee Details",
      labelKey: "PENSION_SEQUENCE_EMPLOYEE_DETAILS"
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),
  break: getBreak(),
  employeedetails: getCommonContainer({
   
   
    employeename: getTextField({
      label: {
        labelName: "Employee Name",
        labelKey: "PENSION_EMPLOYEE_NAME"
      },
      props:{
        className:"applicant-details-error"
      }, 
      placeholder: {
        labelName: "Employee Name",
        labelKey: "PENSION_EMPLOYEE_NAME"
      },
      required: false,
      props: {
        disabled: true,       
      },
      pattern: getPattern("name"),
      jsonPath: "ProcessInstances[0].employee.user.name"
    }),
    employeecode: getTextField({
      label: {
        labelName: "Employee Code",
        labelKey: "PENSION_EMPLOYEE_CODE"
      },
      props:{
        className:"applicant-details-error"
      }, 
      placeholder: {
        labelName: "Employee Code",
        labelKey: "PENSION_EMPLOYEE_CODE"
      },
      required: false,
      props: {
        disabled: true,       
      },
      pattern: getPattern("name"),
      jsonPath: "ProcessInstances[0].employee.code"
    }),
    designation: getTextField({
      label: {
        labelName: "Designation",
        labelKey: "PENSION_EMPLOYEE_DESIGNATION"
      },
      props:{
        className:"applicant-details-error"
      },
      placeholder: {
        labelName: "Designation",
        labelKey: "PENSION_EMPLOYEE_DESIGNATION"
      },
      required: false,
      props: {
        disabled: true,       
      },
      pattern: getPattern("name"),
      jsonPath: "ProcessInstances[0].employee.assignments[0].designation"
    }),
    department: getTextField({
      label: {
        labelName: "department",
        labelKey: "PENSION_EMPLOYEE_DEPARTMENT"
      },
      props:{
        className:"applicant-details-error"
      },
      placeholder: {
        labelName: "department",
        labelKey: "PENSION_EMPLOYEE_DEPARTMENT"
      },
      required: false,
      props: {
        disabled: true,       
      },
      pattern: getPattern("name"),
      jsonPath: "ProcessInstances[0].employee.assignments[0].department"
    }),
    mobileNumber: getTextField({
      label: {
        labelName: "mobileNumber",
        labelKey: "PENSION_EMPLOYEE_MOBILE_NUMBER"
      },
      props:{
        className:"applicant-details-error"
      },
      placeholder: {
        labelName: "mobileNumber",
        labelKey: "PENSION_EMPLOYEE_MOBILE_NUMBER"
      },
      required: false,
      props: {
        disabled: true,       
      },
      pattern: getPattern("name"),
      jsonPath: "ProcessInstances[0].employee.user.mobileNumber"
    }),
    gender: getTextField({
      label: {
        labelName: "gender",
        labelKey: "PENSION_EMPLOYEE_GENDER"
      },
      props:{
        className:"applicant-details-error"
      },
      placeholder: {
        labelName: "gender",
        labelKey: "PENSION_EMPLOYEE_GENDER"
      },
      required: false,
      props: {
        disabled: true,       
      },
      pattern: getPattern("name"),
      jsonPath: "ProcessInstances[0].employee.user.gender"
    }),
    fatherhusbandname: getTextField({
      label: {
        labelName: "father/husband name",
        labelKey: "PENSION_EMPLOYEE_FATHER_HUSBAND_NAME"
      },
      props:{
        className:"applicant-details-error"
      },
      placeholder: {
        labelName: "father/husband name",
        labelKey: "PENSION_EMPLOYEE_FATHER_HUSBAND_NAME"
      },
      required: false,
      props: {
        disabled: true,       
      },
      pattern: getPattern("name"),
      jsonPath: "ProcessInstances[0].employee.user.fatherOrHusbandName"
    }),
    employeeType: getTextField({
      label: {
        labelName: "Employee Type",
        labelKey: "PENSION_EMPLOYEE_TYPE"
      },
      props:{
        className:"applicant-details-error"
      }, 
      placeholder: {
        labelName: "Employee Type",
        labelKey: "PENSION_EMPLOYEE_TYPE"
      },
      required: false,
      props: {
        disabled: true,       
      },
      pattern: getPattern("name"),
      jsonPath: "ProcessInstances[0].employee.employeeType"
    }),
    dob: {
      ...getDateField({
        label: {
          labelName: "Date of Birth",
          labelKey: "PENSION_DOB"
        },
        placeholder: {
          labelName: "Date of Birth",
          labelName: "PENSION_DOB"
        },
        required: false,
        
        pattern: getPattern("Date"),
        jsonPath: "ProcessInstances[0].employee.user.dob",
        props: {
          className:"applicant-details-error",
          disabled:true
        }
      }),
      visible: true
    },
    dateOfAppointment: {
      ...getDateField({
        label: {
          labelName: "Date of Appointment",
          labelKey: "PENSION_DOJ"
        },
        placeholder: {
          labelName: "Date of Appointment",
          labelName: "PENSION_DOJ"
        },
        required: false,
       
        pattern: getPattern("Date"),
        jsonPath: "ProcessInstances[0].employee.dateOfAppointment",
        props: {
          className:"applicant-details-error",
          disabled:true
        }
      }),
      visible: true
    },
    dateOfRetirement: {
      ...getDateField({
        label: {
          labelName: "Date of Retirement",
          labelKey: "PENSION_DOR"
        },
        placeholder: {
          labelName: "Date of Retirement",
          labelName: "PENSION_DOR"
        },
        required: false,
       
        pattern: getPattern("Date"),
        jsonPath: "ProcessInstances[0].employee.dateOfRetirement",
        props: {
          className:"applicant-details-error",
          disabled:true
        }
      }),
      visible: true
    },
    dateOfDeath: {
      ...getDateField({
        label: {
          labelName: "dateOfDeath",
          labelKey: "PENSION_DOD"
        },
        placeholder: {
          labelName: "dateOfDeath",
          labelName: "PENSION_DOD"
        },
        required: false,
       
        pattern: getPattern("Date"),
        jsonPath: "ProcessInstances[0].employee.dateOfDeath",
        props: {
          className:"applicant-details-error",
          disabled:true
        }
      }),
      visible: true
    },
   
  
    // permanentAddress: getTextField({
    //   label: {
    //     labelName: "permanent Address",
    //     labelKey: "PENSION_EMPLOYEE_PENSION_RESIDENTIAL_ADDRESS"
    //   },
    //   props:{
    //     className:"applicant-details-error"
    //   },
    //   placeholder: {
    //     labelName: "Enter permanent Address",
    //     labelKey: "PENSION_EMPLOYEE_PENSION_RESIDENTIAL_ADDRESS"
    //   },
    //   required: false,
    //   props: {
    //     disabled: true,       
    //   },
    //   pattern: getPattern("Name"),
    //   jsonPath: "ProcessInstances[0].employee.user.permanentAddress"
    // }),
    // permanentCity: getTextField({
    //   label: {
    //     labelName: "City",
    //     labelKey: "PENSION_EMPLOYEE_PENSION_CITY"
    //   },
    //   props:{
    //     className:"applicant-details-error"
    //   },
    //   placeholder: {
    //     labelName: "Enter City",
    //     labelKey: "PENSION_EMPLOYEE_PENSION_CITY"
    //   },
    //   required: false,
    //   props: {
    //     disabled: true,       
    //   },
    //   pattern: getPattern("Name"),
    //   jsonPath: "ProcessInstances[0].employee.user.permanentCity"
    // }),
    // permanentPinCode: getTextField({
    //   label: {
    //     labelName: "permanent Pin Code",
    //     labelKey: "PENSION_EMPLOYEE_PENSION_PINCODE"
    //   },
    //   props:{
    //     className:"applicant-details-error"
    //   },
    //   placeholder: {
    //     labelName: "Enter Pin Code",
    //     labelKey: "PENSION_EMPLOYEE_PENSION_PINCODE"
    //   },
    //   required: false,
    //   props: {
    //     disabled: true,       
    //   },
    //   pattern: getPattern("Pincode"),
    //   jsonPath: "ProcessInstances[0].employee.user.permanentPinCode"
    // }),
    correspondenceAddress: getTextField({
      label: {
        labelName: "correspondence Address",
        labelKey: "PENSION_EMPLOYEE_PENSION_CA"
      },
      props:{
        className:"applicant-details-error"
      },
      placeholder: {
        labelName: "Enter correspondence Address",
        labelKey: "PENSION_EMPLOYEE_PENSION_CA"
      },
      required: false,
      props: {
        disabled: true,       
      },
      pattern: getPattern("Name"),
      jsonPath: "ProcessInstances[0].employee.user.correspondenceAddress"
    }),
    // correspondenceCity: getTextField({
    //   label: {
    //     labelName: "City",
    //     labelKey: "PENSION_EMPLOYEE_PENSION_CITY"
    //   },
    //   props:{
    //     className:"applicant-details-error"
    //   },
    //   placeholder: {
    //     labelName: "Enter City",
    //     labelKey: "PENSION_EMPLOYEE_PENSION_CITY"
    //   },
    //   required: false,
    //   props: {
    //     disabled: true,       
    //   },
    //   pattern: getPattern("Name"),
    //   jsonPath: "ProcessInstances[0].employee.user.correspondenceCity"
    // }),
    // correspondencePinCode: getTextField({
    //   label: {
    //     labelName: "Pin Code",
    //     labelKey: "PENSION_EMPLOYEE_PENSION_PINCODE"
    //   },
    //   props:{
    //     className:"applicant-details-error"
    //   },
    //   placeholder: {
    //     labelName: "Enter Pin Code",
    //     labelKey: "PENSION_EMPLOYEE_PENSION_PINCODE"
    //   },
    //   required: false,
    //   props: {
    //     disabled: true,       
    //   },
    //   pattern: getPattern("Pincode"),
    //   jsonPath: "ProcessInstances[0].employee.user.correspondencePinCode"
    // }),
   
  }),
  break:getBreak(),
  pensiondepCalculation: {
    componentPath: "Button",
    gridDefination: {
      xs: 12,
      sm: 12,
      align: "right"
    },
    visible: !data[0].employeeOtherDetailsUpdate,
    props: {
      variant: "contained",
      color: "primary",
      style: {
        color: "white",
        borderRadius: "2px",
        width: "250px",
        height: "48px"
      }
    },

    children: {
     

      buttonLabel: getLabel({
        labelName: "NEW APPLICATION",
        labelKey: "PENSION_DEPENDENT_PENSION_CALCULATION"
      })
    },
    onClickDefination: {
      action: "condition",
      callBack: ActionCalculateDependentPension
    },
    
  },
  dependentUnitcard,
  
});
}
