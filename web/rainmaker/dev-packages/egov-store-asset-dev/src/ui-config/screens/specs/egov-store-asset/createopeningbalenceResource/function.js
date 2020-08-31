import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import {
  prepareFinalObject,
  toggleSnackbar
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import set from "lodash/set";
import {
  createOpeningBalance,
  getOpeningBalanceSearchResults,
  updateOpeningBalance
} from "../../../../../ui-utils/storecommonsapi";
import {
  convertDateToEpoch,
  epochToYmdDate,
  epochToYmd,
  showHideAdhocPopup,
  validateFields
} from "../../utils";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {  
  samplematerialsSearch,
  
  } from "../../../../../ui-utils/sampleResponses";
export const handleCreateUpdateOpeningBalence = (state, dispatch) => {
    let id = get(
      state.screenConfiguration.preparedFinalObject,
      "materialReceipt[0].id",
      null
    );

    // Validation for Openning Balance

    const isFinancialYearContainerValid = validateFields(
      "components.div.children.OpeningBalanceDetails.children.cardContent.children.View1.children.cardContent.children.FinancialYearContainer.children",
      state,
      dispatch,
      "createopeningbalence"
    );
    const isOpeningBalanceContainer = validateFields(
      "components.div.children.OpeningBalanceDetails.children.cardContent.children.View2.children.cardContent.children.OpeningBalanceContainer.children",
      state,
      dispatch,
      "createopeningbalence"
    );
    
    if(isFinancialYearContainerValid && isOpeningBalanceContainer)
    {
      // Date vadiation 
      let expiryDateValid = true
      let receiptDateValid = true
      const CurrentDate = new Date();
      let receivedDate = get(
        state.screenConfiguration.preparedFinalObject,
        "materialReceipt[0].receiptDetails[0].receiptDetailsAddnInfo[0].receivedDate",
        null
      );
      let expiryDate = get(
        state.screenConfiguration.preparedFinalObject,
        "materialReceipt[0].receiptDetails[0].receiptDetailsAddnInfo[0].expiryDate",
        null
      );
      if(Number(receivedDate))
      {
        //alert('i am number')
        receivedDate = epochToYmd(receivedDate)
      }
      if(Number(expiryDate))
    {
      //alert('i am number')
      expiryDate = epochToYmd(expiryDate)
    }
    const  receiptDate_ = new Date(receivedDate)
    const  expiryDate_ = new Date(expiryDate)
    if(receivedDate>=CurrentDate)
    {
      receiptDateValid = false
    }
    if(expiryDate_<CurrentDate)
    {
      expiryDateValid = false
    }
    if(!expiryDateValid)
    {
      const errorMessage = {
        labelName: "Expiry Date Must be greater then current date ",
        labelKey: "STORE_OPENING_BALANCE_EXPIRY_DATE_VALIDATION"
      };
      dispatch(toggleSnackbar(true, errorMessage, "warning"));
    }
    else if (!receiptDateValid)
    {
      const errorMessage = {
        labelName: "Receipt Date Must be less then or equal current date",
        labelKey: "STORE_OPENING_BALANCE_RECEIPT_DATE_VALIDATION"
      };
      dispatch(toggleSnackbar(true, errorMessage, "warning"));
    }
   else{
     
   

    if (id) {
      createUpdateOpeningBalence(state, dispatch, "UPDATE");
    } else {
      createUpdateOpeningBalence(state, dispatch, "CREATE");
    }
  }
  }
  };
  
  export const createUpdateOpeningBalence = async (state, dispatch, action) => {
    const pickedTenant = get(
      state.screenConfiguration.preparedFinalObject,
      "materialReceipt[0].tenantId"
    );
    const tenantId =  getTenantId();
    let queryObject = [
      {
        key: "tenantId",
        value: tenantId
      }
    ];
   
    let materialReceiptObject = get(
      state.screenConfiguration.preparedFinalObject,
      "materialReceipt",
      []
    );
  

     // set date field in eoch formate

    let receivedDate =
  get(state, "screenConfiguration.preparedFinalObject.materialReceipt[0].receiptDetails[0].receiptDetailsAddnInfo[0].receivedDate",0) 
  receivedDate = convertDateToEpoch(receivedDate);
  set(materialReceiptObject[0],"receiptDetails[0].receiptDetailsAddnInfo[0].receivedDate", receivedDate);
  let id = get(
    state.screenConfiguration.preparedFinalObject,
    "materialReceipt[0].id",
    null
  );
  if(id === null)
  {
    // const CurrentDate_ = new Date();
    // let receiptDate = convertDateToEpoch(CurrentDate_);
  set(materialReceiptObject[0],"mrnNumber","");
  set(materialReceiptObject[0],"receiptDate",receivedDate);
  set(materialReceiptObject[0],"mrnStatus","CREATED");
  set(materialReceiptObject[0],"receiptDetails[0].material.description","");
  }
  
  let UOM = get(state, "screenConfiguration.preparedFinalObject.material.materials",[]) 
  let MaterialCode = get(state, "screenConfiguration.preparedFinalObject.materialReceipt[0].receiptDetails[0].material.code",'') 
  let UOMCode = UOM.filter((x) => x.code ===MaterialCode)
  console.log(UOMCode);
  set(materialReceiptObject[0],"receiptDetails[0].uom.code",UOMCode[0].baseUom.code);
  set(materialReceiptObject[0],"receiptDetails[0].receivedQty","");

  let expiryDate =
  get(state, "screenConfiguration.preparedFinalObject.materialReceipt[0].receiptDetails[0].receiptDetailsAddnInfo[0].expiryDate",0) 
  expiryDate = convertDateToEpoch(expiryDate);
  set(materialReceiptObject[0],"receiptDetails[0].receiptDetailsAddnInfo[0].expiryDate", expiryDate);
  set(materialReceiptObject[0],"tenantId", tenantId);

  
    if (action === "CREATE") {
      try {
       
        let response = await createOpeningBalance(
          queryObject,         
          materialReceiptObject,
          dispatch
        );
        if(response){
          let mrnNumber = response.materialReceipt[0].mrnNumber
          dispatch(setRoute(`/egov-store-asset/acknowledgement?screen=OPENINGBALANCE&mode=create&code=${mrnNumber}`));
         }
      } catch (error) {
        //furnishmaterialsData(state, dispatch);
      }
    } else if (action === "UPDATE") {
      try {
        let response = await updateOpeningBalance(
          queryObject,
          materialReceiptObject,
          dispatch
        );
        if(response){
          let mrnNumber = response.materialReceipt[0].mrnNumber
          dispatch(setRoute(`/egov-store-asset/acknowledgement?screen=OPENINGBALANCE&mode=update&code=${mrnNumber}`));
         }
      } catch (error) {
        //furnishmaterialsData(state, dispatch);
      }
    }
  
  };
  
  export const getOpeningBalanceData = async (
    state,
    dispatch,
    code,
    tenantId
  ) => {
    let queryObject = [
      {
        key: "code",
        value: code
      },
      {
        key: "tenantId",
        value: tenantId
      }
    ];
  
   let response = await getOpeningBalanceSearchResults(queryObject, dispatch);
  // let response = samplematerialsSearch();
    dispatch(prepareFinalObject("materials", get(response, "materials")));
    dispatch(
      handleField(
        "create",
        "components.div.children.headerDiv.children.header.children.header.children.key",
        "props",
        {
          labelName: "Edit Material Maste",
          labelKey: "STORE_EDITMATERIAL_MASTER_HEADER"
        }
      )
    );
   // furnishmaterialsData(state, dispatch);
  };