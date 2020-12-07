import get from "lodash/get";
import set from "lodash/set";
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
  getLocalizationCodeValue,
  epochToYmdDate

} from "../../utils";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {ValidateCardMultiItem , ValidateCardQty} from '../../../../../ui-utils/storecommonsapi'
// import "./index.css";
import { getSearchResults } from "../../../../../ui-utils/commons";

const moveToReview = dispatch => {
  const IndentId = getQueryArg(window.location.href, "IndentId");
  const reviewUrl =
  
    process.env.REACT_APP_SELF_RUNNING === "true"
      ? `/egov-ui-framework/egov-store-asset/reviewmaterialreceipt?step=0`
      : `/egov-store-asset/reviewmaterialreceipt?step=0`;
  dispatch(setRoute(reviewUrl));
};
const getpurchaseOrder = async ( state,dispatch)=>{
  const tenantId = getTenantId();
  let storecode = get(state,"screenConfiguration.preparedFinalObject.materialReceipt[0].receivingStore.code",'')
  let suppliercode = get(state,"screenConfiguration.preparedFinalObject.materialReceipt[0].supplier.code",'')
  let storecodename = get(state,"screenConfiguration.preparedFinalObject.materialReceipt[0].receivingStore.name",'')
  let suppliercodename = get(state,"screenConfiguration.preparedFinalObject.materialReceipt[0].supplier.name",'')
 // alert(storecode +'_'+suppliercode)
  let queryObject = [
    {
      key: "tenantId",
      value: tenantId
    }];
    queryObject.push({
      key: "store",
      value: storecode
    });
  //   if(suppliercode)
  //   {
  //   queryObject.push({
  //     key: "supplierCode",
  //     value: suppliercode
  //   });
  // }
  queryObject.push({
    key: "status",
    value: "Approved,Partially Receipted"
  });
  try {
    let response = await getSearchResults(queryObject, dispatch,"purchaseOrder");
    dispatch(prepareFinalObject("purchaseOrder", response));
    if(response)
    {
      if(response.purchaseOrders.length ===0)
      {
        let LocalizationCodeValue = getLocalizationCodeValue("STORE_MATERIAL_PO_LIST_VALIDATION")
        const errorMessage = {
              
          labelName: "Purchase Orders does not exit for",
          labelKey:   LocalizationCodeValue+' store  '+storecodename +' and supplier '+suppliercodename
        };
        dispatch(toggleSnackbar(true, errorMessage, "warning"));
      }
    }
  } catch (e) {
    console.log(e);
  }
}
export const callBackForNext = async (state, dispatch) => {
  let activeStep = get(
    state.screenConfiguration.screenConfig["createMaterialReceiptNote"],
    "components.div.children.stepper.props.activeStep",
    0
  );
  let isFormValid = true;
  if (activeStep === 0) {
    const isMaterialDetailsValid = validateFields(
      "components.div.children.formwizardFirstStep.children.MaterialReceiptNote.children.cardContent.children.MaterialReceiptNoteContainer.children",
      state,
      dispatch,
      "createMaterialReceiptNote"
    );
    
    if (!(isMaterialDetailsValid)) {
      isFormValid = false;
    }
  }
  if (activeStep === 1) {
    let storeDetailsCardPath =
      "components.div.children.formwizardSecondStep.children.materialReceiptDetail.children.cardContent.children.materialReceiptCard.props.items";
    let storeDetailsItems = get(
      state.screenConfiguration.screenConfig.createMaterialReceiptNote,
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
          "createMaterialReceiptNote"
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
      "createMaterialReceiptNote"
    );
    isPuchasingInformationValid = true;
    
    if (!isPuchasingInformationValid) {
      isFormValid = false;
    }
    if(isFormValid)
    {
      let materialReceipt = get(
        state.screenConfiguration.preparedFinalObject,
        "materialReceipt",
        []
      );
      if(materialReceipt && materialReceipt[0])
      {
      for (let index = 0; index < materialReceipt[0].receiptDetails.length; index++) {
        const element = materialReceipt[0].receiptDetails[index];       
           set(materialReceipt[0], `receiptDetails[${index}].lotNo`, element.lotNo);
           set(materialReceipt[0], `receiptDetails[${index}].serialNo`, element.serialNo);
           set(materialReceipt[0], `receiptDetails[${index}].batchNo`, element.batchNo);
           set(materialReceipt[0], `receiptDetails[${index}].manufactureDate`, epochToYmdDate(element.manufactureDate));
           set(materialReceipt[0], `receiptDetails[${index}].expiryDate`, epochToYmdDate(element.expiryDate));
           
      }
    }
      moveToReview(dispatch);
    
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
      let supplierBillDate = get(
        state.screenConfiguration.preparedFinalObject,
        "materialReceipt[0].supplierBillDate",
        null
      );
      let challanDate = get(
        state.screenConfiguration.preparedFinalObject,
        "materialReceipt[0].challanDate",
        null
      );
      let inspectionDate = get(
        state.screenConfiguration.preparedFinalObject,
        "materialReceipt[0].inspectionDate",
        null
      );
    
      if(Number(receiptDate))
      receiptDate = epochToYmd(receiptDate)
      if(Number(supplierBillDate))
      supplierBillDate = epochToYmd(supplierBillDate)
      if(Number(challanDate))
      challanDate = epochToYmd(challanDate)
      if(Number(inspectionDate))
      inspectionDate = epochToYmd(inspectionDate)
      const  receiptDate_ = new Date(receiptDate)
      const  supplierBillDate_ = new Date(supplierBillDate)
      const  challanDate_ = new Date(challanDate)
      const  inspectionDate_ = new Date(inspectionDate)
      let IsValidDate = true
      let IsValidStartDate = true  
      if(receiptDate_>CurrentDate || supplierBillDate_> CurrentDate|| challanDate_> CurrentDate|| inspectionDate_> CurrentDate)
    {
      IsValidDate = false
    }
    if(IsValidDate)
    {
      let activeStep = get(
        state.screenConfiguration.screenConfig["createMaterialReceiptNote"],
        "components.div.children.stepper.props.activeStep",
        0
      );
        if(activeStep ===0)
        {
          getpurchaseOrder(state, dispatch);
        }
        if(activeStep ===1)
        {
        // check validation for file uplaod
        if (get(state.screenConfiguration.preparedFinalObject, "documentsUploadRedux") !== undefined) {
        let fileUrl =
        get(state, "screenConfiguration.preparedFinalObject.documentsUploadRedux[0].documents[0].fileUrl",'') 
        let fileName =
        get(state, "screenConfiguration.preparedFinalObject.documentsUploadRedux[0].documents[0].fileName",'') 
        if(fileUrl) 
        {
        fileUrl = getFileUrl(fileUrl)
        }
        let  documentsPreview= [
        {
        title: "STORE_DOCUMENT_TYPE_MATERIAL_RECEIPT_NOTE",
        linkText: "VIEW", 
        link:fileUrl,//"https://chstage.blob.core.windows.net/fileshare/ch/undefined/July/15/1594826295177document.pdf?sig=R3nzPxT9MRMfROREe6LHEwuGfeVxB%2FKneAeWrDJZvOs%3D&st=2020-07-15T15%3A21%3A01Z&se=2020-07-16T15%3A21%3A01Z&sv=2016-05-31&sp=r&sr=b",
        name: fileName, 
        },]

        dispatch(
        prepareFinalObject("documentsPreview", documentsPreview)
        );
        if(activeStep===1)
        {
        //card validation
        let cardJsonPath =
        "components.div.children.formwizardSecondStep.children.materialReceiptDetail.children.cardContent.children.materialReceiptCard.props.items";
        let pagename = "createMaterialReceiptNote";
        let jasonpath =  "materialReceipt[0].receiptDetails";
        let value = "purchaseOrderDetail.purchaseOrderNumber";
        let value2 ="material.code";
        let value3 ="supplier.code"
        let DuplicatItem = ValidateCardMultiItem(state,dispatch,cardJsonPath,pagename,jasonpath,value,value2)
       // let DuplicatItemsupllier = ValidateCardMultiItemSupplier(state,dispatch,cardJsonPath,pagename,jasonpath,value3,value2)
        
        let InputQtyValue = "receivedQty";
        let InputQtyValue2= "acceptedQty";
        let CompareQtyValue = "orderQuantity";
        let balanceQuantity = "balanceQuantity";
      let doubleqtyCheck = false
        let InvaldQtyCard = ValidateCardQty(state,dispatch,cardJsonPath,pagename,jasonpath,value,InputQtyValue,CompareQtyValue,balanceQuantity,doubleqtyCheck,value2,InputQtyValue2)
     
        if((DuplicatItem && DuplicatItem[0])||(InvaldQtyCard &&InvaldQtyCard[0]))
        {
          let LocalizationCodeValue = getLocalizationCodeValue("STORE_MATERIAL_DUPLICATE_VALIDATION")
          let LocalizationCodeValueQty = getLocalizationCodeValue("STORE_MATERIAL_INVALID_RECEIPT_QTY_VALIDATION")
         
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
          {
            let id = get(
              state.screenConfiguration.preparedFinalObject,
              "materialReceipt[0].id",
              null
            );
            if(id)
            {
              moveToReview(dispatch);           
            }
            else{
              const documents = get(state.screenConfiguration.preparedFinalObject, "documentsContract");
              const uploadedDocs = get(state.screenConfiguration.preparedFinalObject, "documentsUploadRedux");
              const isDocRequired =  documents.map(doc => {
                      return  doc.cards && doc.cards[0].required;
                  })
                  let docArray = new Array(isDocRequired.length)

                  if( uploadedDocs[0] && uploadedDocs[0].documents){
                   // isFormValid = true;
                   let duplicatesupplier = false;
                   //logic for different supplier

                   let CardItem = get(
                    state.screenConfiguration.screenConfig[`${pagename}`],
                    cardJsonPath,
                    []
                  );
                 let supcode =[];
                  for (let index = 0; index < CardItem.length; index++) {
                    if(CardItem[index].isDeleted === undefined ||
                    CardItem[index].isDeleted !== false)
                    {
                    let code = get(state.screenConfiguration.preparedFinalObject,`${jasonpath}[${index}].${value3}`,'')  
                    //code = GetMdmsNameBycode(state, dispatch,"createScreenMdmsData.store-asset.Material",code)  
                      if(code ==="")  
                      code =get(state.screenConfiguration.preparedFinalObject,`${jasonpath}[${index-1}].${value3}`,'') 
                    supcode.push(code)
                    }
                  }
                  if(supcode.length >1)
                  {
                    for (let index = 1; index < supcode.length; index++) {
                      const element = supcode[index];
                      if(element !== supcode[0] )
                      {
                        duplicatesupplier = true
                        break;
                      }
                      
                    }

                  }
                  
                   //
                   if(duplicatesupplier)
                   {
                    let LocalizationCodeValuesupplier = getLocalizationCodeValue("STORE_MATERIAL_INVALID_SUPPLIER_VALIDATION")
                     const errorMessage = {              
                       labelName: "Supplier must be same for different PO",
                       //labelKey:   `STORE_MATERIAL_DUPLICATE_VALIDATION ${DuplicatItem[0].duplicates}`
                        labelKey:   `${LocalizationCodeValuesupplier}`
                       //labelKey:   LocalizationCodeValuesupplier+' '+DuplicatItemsupllier[0].duplicates
                     };
                     dispatch(toggleSnackbar(true, errorMessage, "warning"));
                   }
                   else
                   {
                    let supname = get(state.screenConfiguration.preparedFinalObject,`${jasonpath}[${0}].${'supplier.name'}`,'') 
                    dispatch(prepareFinalObject("materialReceipt[0].supplier.name",supname));
                    moveToReview(dispatch);
                   }
                      
                  }
                  else
                  {
                    dispatch(
                      toggleSnackbar(
                        true,
                        { labelName: "Please uplaod mandatory documents!", labelKey: "" },
                        "warning"
                      ))
                  }
            }
          }
         // moveToReview(dispatch)
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
              // let indentNumber="";
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
            // else{
            //   changeStep(state, dispatch);
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

          }
        }
        // else if(DuplicatItemsupllier && DuplicatItemsupllier[0])
        // {

        // }
      }
      else
      changeStep(state, dispatch);
        }

        else{
        dispatch(
        toggleSnackbar(
        true,
        { labelName: "Please uplaod mandatory documents!", labelKey: "" },
        "warning"
        ))

        }
        }
        else{
          changeStep(state, dispatch);
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
      const errorMessage = {
        labelName: "Please fill all fields",
        labelKey: "ERR_FILL_ALL_FIELDS"
      };
      dispatch(toggleSnackbar(true, errorMessage, "warning"));
    }
  }
};
export const getFileUrl = (linkText="") => {
  const linkList = linkText.split(",");
  let fileURL = '';
  linkList&&linkList.map(link => {
    if (!link.includes('large') && !link.includes('medium') && !link.includes('small')) {
      fileURL = link;
    }
  })
  return fileURL;
}
export const changeStep = (
  state,
  dispatch,
  mode = "next",
  defaultActiveStep = -1
) => {
  let activeStep = get(
    state.screenConfiguration.screenConfig["createMaterialReceiptNote"],
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
  dispatchMultipleFieldChangeAction("createMaterialReceiptNote", actionDefination, dispatch);
  renderSteps(activeStep, dispatch);
};

export const renderSteps = (activeStep, dispatch) => {
  switch (activeStep) {
    case 0:
      dispatchMultipleFieldChangeAction(
        "createMaterialReceiptNote",
        getActionDefinationForStepper(
          "components.div.children.formwizardFirstStep"
        ),
        dispatch
      );
      break;
    case 1:
      dispatchMultipleFieldChangeAction(
        "createMaterialReceiptNote",
        getActionDefinationForStepper(
          "components.div.children.formwizardSecondStep"
        ),
        dispatch
      );
      break;
    case 2:
      dispatchMultipleFieldChangeAction(
        "createMaterialReceiptNote",
        getActionDefinationForStepper(
          "components.div.children.formwizardThirdStep"
        ),
        dispatch
      );
      break;
    case 3:
      dispatchMultipleFieldChangeAction(
        "createMaterialReceiptNote",
        getActionDefinationForStepper(
          "components.div.children.formwizardFourthStep"
        ),
        dispatch
      );
      break;
    default:
      dispatchMultipleFieldChangeAction(
        "createMaterialReceiptNote",
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
