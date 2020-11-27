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
  updateOpeningBalance,
  getWFPayload
} from "../../../../../ui-utils/storecommonsapi";
import {ValidateCard, ValidateCardUserQty} from '../../../../../ui-utils/storecommonsapi'

import {
  convertDateToEpoch,
  epochToYmdDate,
  epochToYmd,
  showHideAdhocPopup,
  validateFields,
  getLocalizationCodeValue
} from "../../utils";
import { getTenantId,getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
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
    let MaterialDetailsCardPath =
    "components.div.children.OpeningBalanceDetails.children.cardContent.children.View2.children.cardContent.children.OpeningbalenceDetailsCard.props.items";
  let MasterDetailsItems = get(
    state.screenConfiguration.screenConfig.createopeningbalence,
    MaterialDetailsCardPath,
    []
  );
  let isMasterDetailsValid = true;
  for (var j = 0; j < MasterDetailsItems.length; j++) {
    if (
      (MasterDetailsItems[j].isDeleted === undefined ||
        MasterDetailsItems[j].isDeleted !== false) &&
      !validateFields(
        `${MaterialDetailsCardPath}[${j}].item${j}.children.cardContent.children.rltnDetailsCardContainer.children`,
        state,
        dispatch,
        "createopeningbalence"
      )
    )
    isMasterDetailsValid = false;
  }
    
    if(isFinancialYearContainerValid && isMasterDetailsValid)
    {
      // Date vadiation 
      let expiryDateValid = true
      let receiptDateValid = true
      const CurrentDate = new Date();
      let receivedDate = get(
        state.screenConfiguration.preparedFinalObject,
        "materialReceipt[0].receiptDetails[0].receivedDate",
        null
      );
      let expiryDate = get(
        state.screenConfiguration.preparedFinalObject,
        "materialReceipt[0].receiptDetails[0].expiryDate",
        null
      );

      let materialReceiptObject = get(
        state.screenConfiguration.preparedFinalObject,
        "materialReceipt",
        []
      );
      let receiptDetails_ = returnEmptyArrayIfNull(
        get(materialReceiptObject[0], "receiptDetails", [])
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
    let  receiptDate_ = new Date(receivedDate)
    let  expiryDate_ = new Date(expiryDate)
      for (let index = 0; index < receiptDetails_.length; index++) {
        const element = receiptDetails_[index]; 
        receiptDate_ = new Date(element.receivedDate)
        expiryDate_ = new Date(element.expiryDate)
        if(receivedDate>=CurrentDate)
        {
          receiptDateValid = false
          break;
        }
        if(expiryDate_<CurrentDate)
        {
          expiryDateValid = false
          break;
        }
      }
    //validate duplicate card
    let cardJsonPath =
    "components.div.children.OpeningBalanceDetails.children.cardContent.children.View2.children.cardContent.children.OpeningbalenceDetailsCard.props.items";
    let pagename = "createopeningbalence";
    let jasonpath =  "materialReceipt[0].receiptDetails";//indents[0].indentDetails
    let value = "material.code";
    let DuplicatItem = ValidateCard(state,dispatch,cardJsonPath,pagename,jasonpath,value)
    let InputQtyValue = "userReceivedQty";
    let CompareQtyValue = "indentQuantity";
    let balanceQuantity = "balanceQty";
    let doubleqtyCheck = false
    let InvaldQtyCard = ValidateCardUserQty(state,dispatch,cardJsonPath,pagename,jasonpath,value,InputQtyValue,CompareQtyValue,balanceQuantity,doubleqtyCheck)
    let stores = get(state, "screenConfiguration.preparedFinalObject.store.stores",[]) 
    let storecode = get(state,"screenConfiguration.preparedFinalObject.materialReceipt[0].receivingStore.code")
    stores = stores.filter(x=>x.code == storecode)//.materialType.code
    const userInfo = JSON.parse(getUserInfo());
    let businessServiceName =''
    let businessService  = get(state, `screenConfiguration.preparedFinalObject.searchScreenMdmsData.store-asset.businessService`,[]) 
    // filter store based on login user role and assign business service
    let roles = userInfo.roles
    businessService = businessService.filter(x=>x.role === roles[0].code)
    if(businessService.length==1)
    businessServiceName =businessService[0].name;
    if(stores &&stores[0])
        {
          if(stores[0].department.deptCategory !== businessServiceName )
          {
            const errorMessage = {
              labelName: "Select valid store",
              labelKey: "STORE_OPENING_BALANCE_STORE_SELECTION_VALIDATION"
            };
            dispatch(toggleSnackbar(true, errorMessage, "warning"));
          }
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
    else  if(stores &&stores[0])
    {
      if(stores[0].department.deptCategory !== businessServiceName )
      {
        const errorMessage = {
          labelName: "Select valid store",
          labelKey: "STORE_OPENING_BALANCE_STORE_SELECTION_VALIDATION"
        };
        dispatch(toggleSnackbar(true, errorMessage, "warning"));
      }
      else  if(DuplicatItem && DuplicatItem[0])
      {
        const LocalizationCodeValue = getLocalizationCodeValue("STORE_MATERIAL_DUPLICATE_VALIDATION")
          const LocalizationCodeValueZeroQty = getLocalizationCodeValue("STORE_MATERIAL_INVALLID_QTY_VALIDATION")
          if(!DuplicatItem[0].IsDuplicatItem && !InvaldQtyCard[0].IsZeroQty)
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
                        if (id) {
                          createUpdateOpeningBalence(state, dispatch, "UPDATE");
                        } else {
                          createUpdateOpeningBalence(state, dispatch, "CREATE");
                        }
            }
            else{
              if(DuplicatItem[0].IsDuplicatItem)
              {
                const errorMessage = {
                  labelName: "Duplicate Material Added",
                  //labelKey:   `STORE_MATERIAL_DUPLICATE_VALIDATION ${DuplicatItem[0].duplicates}`
                  labelKey:   LocalizationCodeValue+' '+DuplicatItem[0].duplicates
                };
                dispatch(toggleSnackbar(true, errorMessage, "warning"));
              }
              else if (InvaldQtyCard[0].IsZeroQty)
              {
                const errorMessage = {                
                  labelName: "Quantity can not be Zero for",
                  labelKey:   LocalizationCodeValueZeroQty+' '+InvaldQtyCard[0].duplicates
                };
                dispatch(toggleSnackbar(true, errorMessage, "warning"));
              }
              
            }
  
      }
     else{
  
      if (id) {
        createUpdateOpeningBalence(state, dispatch, "UPDATE");
      } else {
        createUpdateOpeningBalence(state, dispatch, "CREATE");
      }
    }
    }
   
  }
  };
  const returnEmptyArrayIfNull = value => {
    if (value === null || value === undefined) {
      return [];
    } else {
      return value;
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

  //   let receivedDate =
  // get(state, "screenConfiguration.preparedFinalObject.materialReceipt[0].receiptDetails[0].receiptDetailsAddnInfo[0].receivedDate",0) 
  // receivedDate = convertDateToEpoch(receivedDate);
  // set(materialReceiptObject[0],"receiptDetails[0].receiptDetailsAddnInfo[0].receivedDate", receivedDate);
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
// set(materialReceiptObject[0],"receiptDate",receivedDate);
  set(materialReceiptObject[0],"mrnStatus","CREATED");
  set(materialReceiptObject[0],"receiptDetails[0].material.description","");
 
  }
  
  set(materialReceiptObject[0],"receiptDetails[0].receivedQty","");

  //let expiryDate =
  // get(state, "screenConfiguration.preparedFinalObject.materialReceipt[0].receiptDetails[0].receiptDetailsAddnInfo[0].expiryDate",0) 
  // expiryDate = convertDateToEpoch(expiryDate);
  // set(materialReceiptObject[0],"receiptDetails[0].receiptDetailsAddnInfo[0].expiryDate", expiryDate);
  let receiptDetails_ = returnEmptyArrayIfNull(
    get(materialReceiptObject[0], "receiptDetails", [])
  );
  for (let index = 0; index < receiptDetails_.length; index++) {
    const element = receiptDetails_[index]; 
    let UOM = get(state, "screenConfiguration.preparedFinalObject.material.materials",[]) 
    let MaterialCode = get(state, `screenConfiguration.preparedFinalObject.materialReceipt[0].receiptDetails[${index}].material.code`,'') 
    let UOMCode = UOM.filter((x) => x.code ===MaterialCode)
    console.log(UOMCode);
      set(materialReceiptObject[0],`receiptDetails[${index}].uom.code`,UOMCode[0].baseUom.code);  
       set(materialReceiptObject[0], `receiptDetails[${index}].receiptDetailsAddnInfo[0].lotNo`, element.lotNo);
       set(materialReceiptObject[0], `receiptDetails[${index}].receiptDetailsAddnInfo[0].userQuantity`, element.userQuantity);
       set(materialReceiptObject[0], `receiptDetails[${index}].receiptDetailsAddnInfo[0].oldReceiptNumber`, element.oldReceiptNumber);       
       set(materialReceiptObject[0], `receiptDetails[${index}].receiptDetailsAddnInfo[0].receivedDate`, convertDateToEpoch(element.receivedDate, "dayStart"));
       set(materialReceiptObject[0], `receiptDetails[${index}].receiptDetailsAddnInfo[0].expiryDate`, convertDateToEpoch(element.expiryDate, "dayStart"));
       set(materialReceiptObject[0], `receiptDetails[${index}].receivedDate`, convertDateToEpoch(element.receivedDate, "dayStart"));
       set(materialReceiptObject[0], `receiptDetails[${index}].expiryDate`, convertDateToEpoch(element.expiryDate, "dayStart"));
       //set(materialReceiptObject[0],"receiptDate",convertDateToEpoch(element.receiptDate));
  }

  set(materialReceiptObject[0],"tenantId", tenantId);

  
    if (action === "CREATE") {
      try {
        let wfobject = getWFPayload(state,dispatch)

        let response = await createOpeningBalance(
          queryObject,         
          materialReceiptObject,
          dispatch,
          wfobject
        );
        if(response){
          let mrnNumber = response.materialReceipt[0].mrnNumber
//          dispatch(setRoute(`/egov-store-asset/acknowledgement?screen=OPENINGBALANCE&mode=create&code=${mrnNumber}`));
            dispatch(setRoute(`/egov-store-asset/view-opening-balence?applicationNumber=${mrnNumber}&tenantId=${response.materialReceipt[0].tenantId}`));
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