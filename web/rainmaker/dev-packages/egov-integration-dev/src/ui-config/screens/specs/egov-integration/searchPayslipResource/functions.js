import get from "lodash/get";
import find from "lodash/find";
import {
  handleScreenConfigurationFieldChange as handleField,
  toggleSnackbar,
  toggleSpinner,
  prepareFinalObject
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getSearchResults } from "../../../../../ui-utils/commons";
import { getTextToLocalMapping } from "./searchResults";
import { validateFields,convertDateToEpoch } from "../../utils";
import { getTenantId,getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import set from "lodash/set";
import {  
  samplePaySlip
  } from "../../../../../ui-utils/sampleResponses";
export const searchApiCall = async (state, dispatch) => {
  let { localisationLabels } = state.app || {};
 // showHideTable(false, dispatch);
  const tenantId = "ch.chandigarh" // process.env.REACT_APP_NAME === "Employee" ?  getTenantId() : JSON.parse(getUserInfo()).permanentCity;

  let queryObject = [];
  let searchScreenObject = get(
    state.screenConfiguration.preparedFinalObject,
    "searchScreen",
    {}
  );
  const isSearchFormValid = validateFields(
    "components.div.children.searchForm.children.cardContent.children.searchFormContainer.children",
    state,
    dispatch,
    "payslipsearch"
  );

  if (!isSearchFormValid) {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Please fill all required field",
          labelKey: "ERROR_FILL_ALL_VALID_FIELDS",
        },
        "warning"
      )
    );
  }  
  else {
    // Add selected search fields to queryobject
    // for (var key in searchScreenObject) {      
      
    //     queryObject.push({ key: key, value: searchScreenObject[key] });
      
    // }
 // let hrmsRequest = {...searchScreenObject};
   //NulmSuhRequest.tenantId = tenantId;
   const requestBody = {
    hrmsRequest:{
      empCode:searchScreenObject.empCode,
      month:searchScreenObject.month,
      year:searchScreenObject.year,
    }
  }
  dispatch(toggleSpinner())
  let response = await getSearchResults([],requestBody, dispatch, "getpayslip");
    // dispatch(prepareFinalObject("RecordSet", response.ResponseBody[0].RecordSet));
       // FROM local
       let  APIData = [];//samplePaySlip();

       if(response)
       {
        APIData = get(response,"ResponseBody.MCPaySlip",{})
       }
       // from api
 if(!APIData.PaySlip.NoRecordFound)
 {
  let Allowances =[];
  let Deductions = [];
  let Allowances_total =0
  let Deductions_total =0
  let Allowances_Deductions=[];
  let ItemType = APIData.PaySlip.Allowances_Deductions.ItemType
  let Value = APIData.PaySlip.Allowances_Deductions.Value
  let ItemName = APIData.PaySlip.Allowances_Deductions.ItemName
  if(ItemType.length>0)
  {
    for (let index = 0; index <ItemType.length; index++) {
      const element = ItemType[index];
      const Value_ = Value[index];
      const ItemName_ = ItemName[index];
      // Allowances_Deductions.push(
      //   {
      //     code:element,
      //     Value:Value_,
      //     ItemName:ItemName_
      //   }
      // )
      if(element ==="A")
      {
        Allowances.push(
        {
          code:element,
          Value:Value_,
          ItemName:ItemName_
        }
      )
      Allowances_total = Allowances_total+ Value_
      }
      else if(element ==="D")
      {
        Deductions.push(
        {
          code:element,
          Value:Value_,
          ItemName:ItemName_
        }
      )
      Deductions_total = Deductions_total+ Value_
      }          
    }        
  }
  
if(Allowances.length>Deductions.length)
  for (let index = 0; index < Allowances.length; index++) {
    const Allowances_ = Allowances[index];
    const Deductions_ = Deductions[index];
    
    Allowances_Deductions.push(
      {
        Allowances_Text: Allowances_ !== undefined? Allowances_.ItemName :'',
        Allowances_Amount:Allowances_ !== undefined? Allowances_.Value :'',
        Deductions_Text: Deductions_!== undefined? Deductions_.ItemName :'',
        Deductions_Amount:Deductions_!== undefined? Deductions_.Value :'',
      } 
    )       
  }
  else if(Allowances.length<Deductions.length)
  for (let index = 0; index < Deductions.length; index++) {
    const Allowances_ = Allowances[index];
    const Deductions_ = Deductions[index];
    Allowances_Deductions.push(
      {
        Allowances_Text: Allowances_ !== undefined? Allowances_.ItemName :'',
        Allowances_Amount:Allowances_ !== undefined? Allowances_.Value :'',
        Deductions_Text: Deductions_!== undefined? Deductions_.ItemName :'',
        Deductions_Amount:Deductions_!== undefined? Deductions_.Value :'',
      } 
    )       
  }
  else{
    for (let index = 0; index < Allowances.length; index++) {
      const Allowances_ = Allowances[index];
      const Deductions_ = Deductions[index];
      Allowances_Deductions.push(
        {
          Allowances_Text: Allowances_ !== undefined? Allowances_.ItemName :'',
          Allowances_Amount:Allowances_ !== undefined? Allowances_.Value :'',
          Deductions_Text: Deductions_!== undefined? Deductions_.ItemName :'',
          Deductions_Amount:Deductions_!== undefined? Deductions_.Value :'',
        } 
      )       
    }

  }
  
  Allowances_Deductions.push(
    {
      Allowances_Text: 'Total Allowances',
      Allowances_Amount:Allowances_total,
      Deductions_Text: 'Total Deductions',
      Deductions_Amount:Deductions_total,
    }
  )
  Allowances_Deductions.push(
    {
      Allowances_Text: '',
      Allowances_Amount:'',
      Deductions_Text: 'Net Pay',
      Deductions_Amount:Allowances_total - Deductions_total,
    }
  )
  let PaySlip ={
    //Deductions:Deductions,

    Allowances:Allowances_Deductions,
    Designation:APIData.PaySlip.Designation,
    EmployeeCode:APIData.PaySlip.EmployeeCode,
    DDOName:APIData.PaySlip.DDOName,
    DDOCode:APIData.PaySlip.DDOCode,
    PayScale:APIData.PaySlip.PayScale,
    PayCommission:APIData.PaySlip.PayCommission,
    Name:APIData.PaySlip.Name,
    FatherName:APIData.PaySlip.FatherName,
  }
 // dispatch(prepareFinalObject("PaySlip",PaySlip));
  dispatch(prepareFinalObject("APIData.PaySlip",PaySlip));

 }
 else
 {
  dispatch(prepareFinalObject("APIData.PaySlip.Allowances",[]));
  dispatch(
        toggleSnackbar(
          true,
          { labelName: APIData.PaySlip.NoRecordFound },
          "warning"
        )
      );


 }
 

       dispatch(toggleSpinner())
    try {
      // let data = response.ResponseBody[0].RecordSet.map((item) => {
  
      //   return {
      //     [getTextToLocalMapping("Property ID")]: get(item, "PROPERTYID", "-") || "-",
      //     [getTextToLocalMapping("House No")]: get(item, "HOUSENO", "-") || "-",
      //     [getTextToLocalMapping("Owner Name")]: get(item, "PROPERTYOWNER", "-") || "-",
      //     [getTextToLocalMapping("Mobile No")]: get(item, "Number", "-") || "-",
          
      //   };
      // });

      // dispatch(
      //   handleField(
      //     "payslipsearch",
      //     "components.div.children.searchResults",
      //     "props.data",
      //     data
      //   )
      // );
      // dispatch(
      //   handleField(
      //     "payslipsearch",
      //     "components.div.children.searchResults",
      //     "props.title",
      //     `${getTextToLocalMapping("Search Results for House")} (${
      //       response.ResponseBody[0].RecordSet.length
      //     })`
      //   )
      // );
      // showHideTable(true, dispatch);
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
};

const showHideTable = (booleanHideOrShow, dispatch) => {
  dispatch(
    handleField(
      "payslipsearch",
      "components.div.children.searchResults",
      "visible",
      booleanHideOrShow
    )
  );
};
