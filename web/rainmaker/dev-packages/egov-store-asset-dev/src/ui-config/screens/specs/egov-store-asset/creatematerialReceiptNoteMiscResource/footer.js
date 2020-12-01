import get from "lodash/get";
import {
  dispatchMultipleFieldChangeAction,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  getButtonVisibility,
  getCommonApplyFooter,
  ifUserRoleExists,
  epochToYmd,
  validateFields,
  getLocalizationCodeValue
} from "../../utils";
import{getmaterialissuesSearchResults,GetMdmsNameBycode} from '../../../../../ui-utils/storecommonsapi'
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { getTenantId,getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import { prepareFinalObject , handleScreenConfigurationFieldChange as handleField, } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {ValidateCard , ValidateCardUserQty} from '../../../../../ui-utils/storecommonsapi'
import { findLastKey } from "lodash";
// import "./index.css";

const moveToReview = dispatch => {
  const IndentId = getQueryArg(window.location.href, "IndentId");
  const reviewUrl =
    process.env.REACT_APP_SELF_RUNNING === "true"
      ? `/egov-ui-framework/egov-store-asset/reviewmaterialreceiptmisc?step=0`
      : `/egov-store-asset/reviewmaterialreceiptmisc?step=0`;
  dispatch(setRoute(reviewUrl));
};

export const callBackForNext = async (state, dispatch) => {
  let activeStep = get(
    state.screenConfiguration.screenConfig["createMaterialReceiptNoteMisc"],
    "components.div.children.stepper.props.activeStep",
    0
  );
  let isFormValid = true;
  if (activeStep === 0) {
    const isMaterialDetailsValid = validateFields(
      "components.div.children.formwizardFirstStep.children.MaterialReceiptMiscNote.children.cardContent.children.MaterialReceiptNoteContainer.children",
      state,
      dispatch,
      "createMaterialReceiptNoteMisc"
    );
    let issueNumber = get(
      state.screenConfiguration.preparedFinalObject,
      `materialReceipt[0].issueNumber`,
      ''
    ); 
    let isAdHoc = get(
      state.screenConfiguration.preparedFinalObject,
      `materialReceipt[0].isAdHoc`,
      ''
    ); 

    // if(isAdHoc)
    // {
    //   if(issueNumber)
    //   {
    //     if (!(isMaterialDetailsValid)) {
    //       isFormValid = false;
    //     }
    //   }
    //   else{
    //     const errorMessage = {
    //       labelName: "Please Enter Issuen Number for Search",
    //       labelKey: "STORE_ISSUENUMBER_SEARCH_VALIDATION"
    //     };
    //     dispatch(toggleSnackbar(true, errorMessage, "warning"));

    //   }

    // }
    // else
    // {
      if(isMaterialDetailsValid)
      {
        const userInfo = JSON.parse(getUserInfo());
        let businessService  = get(state, `screenConfiguration.preparedFinalObject.createScreenMdmsData.store-asset.businessService`,[]) 
        // filter store based on login user role and assign business service
        let roles = userInfo.roles
        for (let index = 0; index < roles.length; index++) {
        const element = roles[index];
        businessService = businessService.filter(x=>x.role === element.code)
        if(businessService.length==1)
        {
          let deptCategory =
        get(state, "screenConfiguration.preparedFinalObject.materialReceipt[0].receivingStore.department.deptCategory",'') 
          dispatch(prepareFinalObject("businessService",businessService[0].name));
          dispatch(prepareFinalObject("deptCategory",deptCategory));
          //isAdHoc: "YES"
          let isAdHoc = get(
            state.screenConfiguration.preparedFinalObject,
            `materialReceipt[0].isAdHoc`,
            ''
          ); 
          if(isAdHoc === 'YES')
          {
          
          if(businessService[0].name !== deptCategory)
          {
            dispatch(
              toggleSnackbar(
                true,
                { labelName: "Indenting department name and loged user role must be same", labelKey: "STORE_MISC_BUSINESS_SERVICE_VALIDATION" },
                "warning"
              )
            );
            return;

          }
          else
          {
            isFormValid = true;
          }
        }
        else
        {
          isFormValid = true;
        }

        }
              
        }
        
      }
      else{
       
        isFormValid = false;
      }
      if (!(isMaterialDetailsValid)) {
        isFormValid = false;
      }
   // }

  }
  if (activeStep === 1) {
    let storeDetailsCardPath =
      "components.div.children.formwizardSecondStep.children.materialReceiptMiscDetail.children.cardContent.children.materialReceiptCard.props.items";
    let storeDetailsItems = get(
      state.screenConfiguration.screenConfig.createMaterialReceiptNoteMisc,
      storeDetailsCardPath,
      []
    );
    let isstoreDetailsValid = true;
    for (var j = 0; j < storeDetailsItems.length; j++) {
      if (
        (storeDetailsItems[j].isDeleted === undefined ||
          storeDetailsItems[j].isDeleted !== false) &&
        !validateFields(
          `${storeDetailsCardPath}[${j}].item${j}.children.cardContent.children.materialReceiptCardContainer.children`,
          state,
          dispatch,
          "createMaterialReceiptNoteMisc"
        )
      )
        isstoreDetailsValid = false;
    }
    if (!isstoreDetailsValid) {
      isFormValid = false
    }
  }
  if (activeStep === 2) {   
    let isPuchasingInformationValid = validateFields(
      "components.div.children.formwizardThirdStep.children.otherDetails.children.cardContent.children.View1.children.cardContent.children.PuchasingInformationContainer.children",
      state,
      dispatch,
      "createMaterialReceiptNoteMisc"
    );
    isPuchasingInformationValid = true;
    
    if (!isPuchasingInformationValid) {
      isFormValid = false;
    }
    if(isFormValid)
    {

    
    if(true)
    moveToReview(dispatch);
    else{
    

    }
    
  }
    else{

      const errorMessage = {
        labelName: "Please fill all fields",
        labelKey: "ERR_FILL_ALL_FIELDS"
      };
      dispatch(toggleSnackbar(true, errorMessage, "warning"));

    }
  }
  if (activeStep !== 2) {
    if (isFormValid) {
        
      const CurrentDate = new Date();

      let receiptDate = get(
        state.screenConfiguration.preparedFinalObject,
        "materialReceipt[0].receiptDate",
        null
      );

    
      if(Number(receiptDate))
      receiptDate = epochToYmd(receiptDate)

      const  receiptDate_ = new Date(receiptDate)

      let IsValidDate = true
      let IsValidStartDate = true  
      if(receiptDate_>CurrentDate )
    {
      IsValidDate = false
    }
      if(IsValidDate)
      {
        if(activeStep===1)
        {
        // validate duplicate card
        let cardJsonPath =
        "components.div.children.formwizardSecondStep.children.materialReceiptMiscDetail.children.cardContent.children.materialReceiptCard.props.items";
        let pagename = `createMaterialReceiptNoteMisc`;
        let jasonpath =  "materialReceipt[0].receiptDetails";
        let value = "material.code";
        let InputQtyValue = "receivedQty";
        let CompareQtyValue = "qtyIssued";
        let DuplicatItem = ValidateCard(state,dispatch,cardJsonPath,pagename,jasonpath,value)
        let balanceQuantity = "balanceQuantity";
        let doubleqtyCheck = false
        let InvaldQtyCard = ValidateCardUserQty(state,dispatch,cardJsonPath,pagename,jasonpath,value,InputQtyValue,CompareQtyValue,balanceQuantity,doubleqtyCheck)
        if((DuplicatItem && DuplicatItem[0])||(InvaldQtyCard &&InvaldQtyCard[0]))
        {
          let LocalizationCodeValue = getLocalizationCodeValue("STORE_MATERIAL_DUPLICATE_VALIDATION")
          let LocalizationCodeValueQty = getLocalizationCodeValue("STORE_MATERIAL_INVALID_MISC_RECEIPT_QTY_VALIDATION")
          if((!DuplicatItem[0].IsDuplicatItem && !InvaldQtyCard[0].IsInvalidQty) &&  !InvaldQtyCard[0].IsZeroQty)
            {
      
              // refresh card item
              var storeMappingTemp = [];
          let  storeMapping =  get(
            state.screenConfiguration.preparedFinalObject,
            `materialReceipt[0].receiptDetails`,
            []
          );
          for(var i = 0; i < storeMapping.length; i++){
              if(storeMappingTemp.indexOf(storeMapping[i]) == -1){
                storeMappingTemp.push(storeMapping[i]);
              }
          }
          storeMappingTemp = storeMappingTemp.filter((item) => item.isDeleted === undefined || item.isDeleted !== false);
          if(storeMappingTemp.length>0)
          {
            dispatch(prepareFinalObject("materialReceipt[0].receiptDetails",storeMappingTemp)
          );
            }
            if(activeStep ===1)
            moveToReview(dispatch)
            else
            changeStep(state, dispatch);
          }
          else{
            if(DuplicatItem[0].IsDuplicatItem)
            {
              const errorMessage = {              
                labelName: "Duplicate Material Added",
                //labelKey:   `STORE_MATERIAL_DUPLICATE_VALIDATION ${DuplicatItem[0].duplicates}`
                // labelKey:   `${LocalizationCodeValue}` `${DuplicatItem[0].duplicates}`
                labelKey:   LocalizationCodeValue+' '+DuplicatItem[0].duplicates
              };
              dispatch(toggleSnackbar(true, errorMessage, "warning"));
            }
            else if (InvaldQtyCard[0].IsInvalidQty)
            {
              let indentNumber="";
              // indentNumber = getQueryArg(window.location.href, "indentNumber");
              // if(indentNumber){
              const errorMessage = {
              
                labelName: "Ordered Qty less then Indent Qty for",
                //labelKey:   `STORE_MATERIAL_DUPLICATE_VALIDATION ${DuplicatItem[0].duplicates}`
                // labelKey:   `${LocalizationCodeValue}` `${DuplicatItem[0].duplicates}`
                labelKey:   LocalizationCodeValueQty+' '+InvaldQtyCard[0].duplicates
              };
              dispatch(toggleSnackbar(true, errorMessage, "warning"));
           // }
            
      
            }
            else if (InvaldQtyCard[0].IsZeroQty)
            {
              const LocalizationCodeValueZeroQty = getLocalizationCodeValue("STORE_MATERIAL_INVALLID_QTY_VALIDATION")
              const errorMessage = {              
                labelName: "Quantity can not be Zero for",
                labelKey:   LocalizationCodeValueZeroQty+' '+InvaldQtyCard[0].duplicates
              };
              dispatch(toggleSnackbar(true, errorMessage, "warning")); 
            }
            else{
              if(activeStep ===1)
              moveToReview(dispatch)
              else
              changeStep(state, dispatch);              
            }
          }
        }
        else{
          if(activeStep ===1)
          moveToReview(dispatch)
          else
          changeStep(state, dispatch);  
        }
      }
      else{
        if(activeStep ===1)
              moveToReview(dispatch)
              else
              {
                let issueNumber = get(
                  state.screenConfiguration.preparedFinalObject,
                  `materialReceipt[0].issueNumber`,
                  ''
                ); 
                let isAdHoc = get(
                  state.screenConfiguration.preparedFinalObject,
                  `materialReceipt[0].isAdHoc`,
                  ''
                ); 
                let storeUpdate = get(
                  state.screenConfiguration.preparedFinalObject,
                  `materialReceiptRead[0].storeUpdate`,
                  false
                ); 
            
                if(isAdHoc ==='YES')
                {
                  if(issueNumber && storeUpdate)
                  {
                    changeStep(state, dispatch);  
                  }
                  else{                    
                    const step = getQueryArg(window.location.href, "step");
                    const tenantId = getQueryArg(window.location.href, "tenantId");
                    if(!step && !tenantId){                   
                    const errorMessage = {
                      labelName: "Please Enter Issuen Number for Search",
                      labelKey: "STORE_ISSUENUMBER_SEARCH_VALIDATION"
                    };
                    dispatch(toggleSnackbar(true, errorMessage, "warning"));
                  }
                  else
                  {
                    changeStep(state, dispatch); 
                  }
                    
            
                  }
            
                }
                else
                {
                  changeStep(state, dispatch);  
                }
                
              }
             
      }

      

      }
      else{
      const errorMessage = {
        labelName: "Input Date Must be less then or equal to current date",
        labelKey: "STORE_MATERIAL_MASTER_CURRENT_DATE_VALIDATION"
      };
      dispatch(toggleSnackbar(true, errorMessage, "warning"));

      }
     
    } 
    else {


      let issueNumber = get(
        state.screenConfiguration.preparedFinalObject,
        `materialReceipt[0].issueNumber`,
        ''
      ); 
      let isAdHoc = get(
        state.screenConfiguration.preparedFinalObject,
        `materialReceipt[0].isAdHoc`,
        ''
      ); 
      let storeUpdate = get(
        state.screenConfiguration.preparedFinalObject,
        `materialReceiptRead[0].storeUpdate`,
        false
      ); 
  
      if(isAdHoc ==='YES')
      {
        if(issueNumber && storeUpdate)
        {
         
          if(!isFormValid)
          {
            const errorMessage = {
              labelName: "Please fill all fields",
              labelKey: "ERR_FILL_ALL_FIELDS"
            };
            dispatch(toggleSnackbar(true, errorMessage, "warning"));
          }
          else
          {
            changeStep(state, dispatch); 
          }
        }
        else{
          const errorMessage = {
            labelName: "Please Enter Issuen Number for Search",
            labelKey: "STORE_ISSUENUMBER_SEARCH_VALIDATION"
          };
          dispatch(toggleSnackbar(true, errorMessage, "warning"));

        }
      }
      else
      {
        const errorMessage = {
          labelName: "Please fill all fields",
          labelKey: "ERR_FILL_ALL_FIELDS"
        };
        dispatch(toggleSnackbar(true, errorMessage, "warning"));

      }
      
    }
  }
};

export const changeStep = (
  state,
  dispatch,
  mode = "next",
  defaultActiveStep = -1
) => {
  let activeStep = get(
    state.screenConfiguration.screenConfig["createMaterialReceiptNoteMisc"],
    "components.div.children.stepper.props.activeStep",
    0
  );
  if (defaultActiveStep === -1) {
    activeStep = mode === "next" ? activeStep + 1 : activeStep - 1;
  } else {
    activeStep = defaultActiveStep;
  }

  const isPreviousButtonVisible = activeStep > 0 ? true : false;
  const isNextButtonVisible = activeStep < 4 ? true : false;
  const isPayButtonVisible = activeStep === 4 ? true : false;
  const actionDefination = [
    {
      path: "components.div.children.stepper.props",
      property: "activeStep",
      value: activeStep
    },
    {
      path: "components.div.children.footer.children.previousButton",
      property: "visible",
      value: isPreviousButtonVisible
    },
    {
      path: "components.div.children.footer.children.nextButton",
      property: "visible",
      value: isNextButtonVisible
    },
    {
      path: "components.div.children.footer.children.payButton",
      property: "visible",
      value: isPayButtonVisible
    }
  ];
  dispatchMultipleFieldChangeAction("createMaterialReceiptNoteMisc", actionDefination, dispatch);
  renderSteps(activeStep, dispatch);
};

export const renderSteps = (activeStep, dispatch) => {
  switch (activeStep) {
    case 0:
      dispatchMultipleFieldChangeAction(
        "createMaterialReceiptNoteMisc",
        getActionDefinationForStepper(
          "components.div.children.formwizardFirstStep"
        ),
        dispatch
      );
      break;
    case 1:
      dispatchMultipleFieldChangeAction(
        "createMaterialReceiptNoteMisc",
        getActionDefinationForStepper(
          "components.div.children.formwizardSecondStep"
        ),
        dispatch
      );
      break;
    case 2:
      dispatchMultipleFieldChangeAction(
        "createMaterialReceiptNoteMisc",
        getActionDefinationForStepper(
          "components.div.children.formwizardThirdStep"
        ),
        dispatch
      );
      break;
    case 3:
      dispatchMultipleFieldChangeAction(
        "createMaterialReceiptNoteMisc",
        getActionDefinationForStepper(
          "components.div.children.formwizardFourthStep"
        ),
        dispatch
      );
      break;
    default:
      dispatchMultipleFieldChangeAction(
        "createMaterialReceiptNoteMisc",
        getActionDefinationForStepper(
          "components.div.children.formwizardFifthStep"
        ),
        dispatch
      );
  }
};

export const getActionDefinationForStepper = path => {
  const actionDefination = [
    {
      path: "components.div.children.formwizardFirstStep",
      property: "visible",
      value: true
    },
    {
      path: "components.div.children.formwizardSecondStep",
      property: "visible",
      value: false
    },
    {
      path: "components.div.children.formwizardThirdStep",
      property: "visible",
      value: false
    },
   
  ];
  for (var i = 0; i < actionDefination.length; i++) {
    actionDefination[i] = {
      ...actionDefination[i],
      value: false
    };
    if (path === actionDefination[i].path) {
      actionDefination[i] = {
        ...actionDefination[i],
        value: true
      };
    }
  }
  return actionDefination;
};

export const callBackForPrevious = (state, dispatch) => {
  changeStep(state, dispatch, "previous");
};

export const footer = getCommonApplyFooter({
  previousButton: {
    componentPath: "Button",
    props: {
      variant: "outlined",
      color: "primary",
      style: {
        minWidth: "200px",
        height: "48px",
        marginRight: "16px"
      }
    },
    children: {
      previousButtonIcon: {
        uiFramework: "custom-atoms",
        componentPath: "Icon",
        props: {
          iconName: "keyboard_arrow_left"
        }
      },
      previousButtonLabel: getLabel({
        labelName: "Previous Step",
        labelKey: "STORE_COMMON_BUTTON_PREV_STEP"
      })
    },
    onClickDefination: {
      action: "condition",
      callBack: callBackForPrevious
    },
    visible: false
  },
  nextButton: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        minWidth: "200px",
        height: "48px",
        marginRight: "45px"
      }
    },
    children: {
      nextButtonLabel: getLabel({
        labelName: "Next Step",
        labelKey: "STORE_COMMON_BUTTON_NXT_STEP"
      }),
      nextButtonIcon: {
        uiFramework: "custom-atoms",
        componentPath: "Icon",
        props: {
          iconName: "keyboard_arrow_right"
        }
      }
    },
    onClickDefination: {
      action: "condition",
      callBack: callBackForNext
    }
  },
  payButton: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        minWidth: "200px",
        height: "48px",
        marginRight: "45px"
      }
    },
    children: {
      submitButtonLabel: getLabel({
        labelName: "Submit",
        labelKey: "STORE_COMMON_BUTTON_SUBMIT"
      }),
      submitButtonIcon: {
        uiFramework: "custom-atoms",
        componentPath: "Icon",
        props: {
          iconName: "keyboard_arrow_right"
        }
      }
    },
    onClickDefination: {
      action: "condition",
      callBack: callBackForNext
    },
    visible: false
  }
});
 export const handleSearchMaterial = async(state, dispatch)=>{

  
  let issueNumber = get(
    state.screenConfiguration.preparedFinalObject,
    `materialReceipt[0].issueNumber`,
    ''
  ); 
  if(issueNumber)
  {
    let queryObject = [
      {
        key: "tenantId",
        value: getTenantId()
      }];
    queryObject.push({
      key: "issueNoteNumber",
      value: issueNumber
    });
    let response = await getmaterialissuesSearchResults(queryObject, dispatch);
    try {

      if(response.materialIssues.length===0)
      {
        dispatch(
              toggleSnackbar(
                true,
                { labelName: "No Records found for Input parameter", labelKey: "STORE_NO_RECORDS_FOUND" },
                "warning"
              )
            );
           
      }
      else if(response.materialIssues.length>0)
      {

        if(response.materialIssues[0].issueType==='INDENTISSUE' && response.materialIssues[0].materialIssueStatus==='Approved')
        {
          let material=[];
          // GetMdmsNameBycode(action,state, dispatch,"createScreenMdmsData.store-asset.Material","MAT02")
           let materialList = response.materialIssues[0].materialIssueDetails;
           for (let index = 0; index < materialList.length; index++) {
             const element = materialList[index];
             material.push(
               {
                 materialcode:element.material.code,
                 //dispatch(prepareFinalObject("materialIssues[0].materialIssueDetails[0].material.name",GetMdmsNameBycode(action,state, dispatch,"createScreenMdmsData.store-asset.Material",Material[0].materialCode)));
                 materialName:GetMdmsNameBycode(state, dispatch,"createScreenMdmsData.store-asset.Material",element.material.code),
                 uom:element.uom,
                 id:element.id,
                 quantityIssued:element.quantityIssued,
                 orderNumber:element.orderNumber,
                 issuedToEmployee:response.materialIssues[0].issuedToEmployee,
                 issuedToDesignation:response.materialIssues[0].issuedToDesignation,
                 //unitRate://to be deside
               }
               
             )
           }
           dispatch(prepareFinalObject("materialReceipt[0].receivingStore.code", response.materialIssues[0].toStore.code));
           dispatch(prepareFinalObject("materialReceipt[0].receivingStore.name", response.materialIssues[0].toStore.name));
           dispatch(
          handleField(
            `createMaterialReceiptNoteMisc`,
            "components.div.children.formwizardFirstStep.children.MaterialReceiptMiscNote.children.cardContent.children.MaterialReceiptNoteContainer.children.StoreName",
            "props.value",
            response.materialIssues[0].toStore.name
          )
        );
           dispatch(prepareFinalObject("materialReceipt[0].receivingStore.department.name", response.materialIssues[0].toStore.department.name));
           dispatch(prepareFinalObject("materialReceipt[0].receivingStore.department.deptCategory", response.materialIssues[0].toStore.department.deptCategory));
           dispatch(prepareFinalObject("materialReceipt[0].receivingStore.divisionName", response.materialIssues[0].toStore.divisionName));
           dispatch(prepareFinalObject("MiscMaterilList", material));
           dispatch(prepareFinalObject("materialReceiptRead[0].storeUpdate",true));

           const userInfo = JSON.parse(getUserInfo());
          let businessService  = get(state, `screenConfiguration.preparedFinalObject.createScreenMdmsData.store-asset.businessService`,[]) 
          // filter store based on login user role and assign business service
          let roles = userInfo.roles
          for (let index = 0; index < roles.length; index++) {
          const element = roles[index];
          businessService = businessService.filter(x=>x.role === element.code)
          if(businessService.length==1)
          {
            // dispatch(prepareFinalObject("businessService",businessService[0].name));
            // dispatch(prepareFinalObject("deptCategory",response.materialIssues[0].toStore.department.deptCategory));
            if(businessService[0].name !== response.materialIssues[0].toStore.department.deptCategory)
            dispatch(
              toggleSnackbar(
                true,
                { labelName: "Indenting department name and loged user role must be same", labelKey: "STORE_MISC_BUSINESS_SERVICE_VALIDATION" },
                "warning"
              )
            );
          }
         // console.log(businessService[0].name)
          // response = response.stores.filter(x=>x.department.deptCategory===businessService[0].name)
          // break;        
          }
        }
        else{
          dispatch(
            toggleSnackbar(
              true,
              { labelName: "Please Enter Approved Material Indent Issue Number.", labelKey: "STORE_MISC_CREATION_VALIDATION" },
              "warning"
            )
          );
          
          }

      }
     
    } catch (error) {
      dispatch(
        toggleSnackbar(
          true,
          { labelName: "Unable to parse search results!" },
          "error"
        )
      );
    }

  }
  else{
    const step = getQueryArg(window.location.href, "step");
    const tenantId = getQueryArg(window.location.href, "tenantId");    
    if(!step && !tenantId){
    const errorMessage = {
      labelName: "Please Enter Issuen Number for Search",
      labelKey: "STORE_ISSUENUMBER_SEARCH_VALIDATION"
    };
    dispatch(toggleSnackbar(true, errorMessage, "warning"));
  }
  let material=[];
  let materialReceipt = get(
    state.screenConfiguration.preparedFinalObject,
    `materialReceipt`,
    []
  ); 
  if(materialReceipt && materialReceipt[0])
  {
  for (let index = 0; index < materialReceipt[0].receiptDetails.length; index++) {
    const element = materialReceipt[0].receiptDetails[index];
    material.push(
      {
        materialcode:element.material.code,
        //dispatch(prepareFinalObject("materialIssues[0].materialIssueDetails[0].material.name",GetMdmsNameBycode(action,state, dispatch,"createScreenMdmsData.store-asset.Material",Material[0].materialCode)));
        materialName:GetMdmsNameBycode(state, dispatch,"createScreenMdmsData.store-asset.Material",element.material.code),
        uom:element.uom,
        id:element.id,
        quantityIssued:element.receivedQty,
        orderNumber:0,
        issuedToEmployee:"",
        issuedToDesignation:"",
        //unitRate://to be deside
      })
  }
}
  dispatch(prepareFinalObject("MiscMaterilList", material));
  dispatch(prepareFinalObject("materialReceiptRead[0].storeUpdate",true));

  }

}
