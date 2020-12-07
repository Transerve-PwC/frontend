import {
    getBreak,
    getCommonHeader,
    getLabel,
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import { getQueryArg, } from "egov-ui-framework/ui-utils/commons";
  import set from "lodash/set";
  import { httpRequest } from "../../../../ui-utils";
  import { searchForm } from "./searchPayslipResource/searchForm";
  //import { searchResults } from "./searchPayslipResource/searchResults";
  import { getTenantId,getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
  import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
  import commonConfig from '../../../../config/common';
  import {  
    samplePaySlip
    } from "../../../../ui-utils/sampleResponses";
  const hasButton = getQueryArg(window.location.href, "hasButton");
  let enableButton = true;
  //enableButton = hasButton && hasButton === "false" ? false : true;
  
  const header = getCommonHeader({
    labelName: "Search Pay Slip",
    labelKey: "INTIGRATION_PAYSLIP",
  });
  
  const getEmployeeData = async (action, state, dispatch) => {

    const tenantId = getTenantId();
    const userInfo = JSON.parse(getUserInfo());
    if(userInfo){
      dispatch(prepareFinalObject("indents[0].indentCreatedBy", userInfo.name));
      const queryParams = [{ key: "uuids", value: userInfo.uuid },{ key: "tenantId", value:  tenantId }];
      try { 
        const payload = await httpRequest(
          "post",
          "/egov-hrms/employees/_search",
          "_search",
          queryParams
        );
        if(payload){ 
          dispatch(prepareFinalObject("searchScreen.empCode", payload.Employees[0].code));
        }
        
      } catch (e) {
        console.log(e);
      }
    }
    
  };
  
  const getMDMSData = async (action, state, dispatch) => {

    const tenantId = getTenantId();
  
    let mdmsBody = {
      
    };
  
    try {
      const payload = await httpRequest(
        "post",
        "/integration-services/pt/v1/_getSectorList",
        "_search",
        [],
        mdmsBody
      );
      dispatch(prepareFinalObject("searchScreenMdmsData", payload.ResponseBody[0]));
    } catch (e) {
      console.log(e);
    }
  };


  
  const sepSearchAndResult = {
    uiFramework: "material-ui",
    name: "payslipsearch",
    beforeInitScreen: (action, state, dispatch) => {
            // fetching MDMS data
      //getMDMSData(action, state, dispatch);

      // set yaer current year with last 3 year
      let year =[]
      year.push(
        {
          code:Number(new Date().getFullYear()),
          name:Number(new Date().getFullYear())
        }
      )
      for (let index = 0; index < 3; index++) {        
        year.push(
          {
            code:Number(new Date().getFullYear())-(index+1),
            name:Number(new Date().getFullYear())-(index+1),
          }
        )
      }
      dispatch(prepareFinalObject("intigration.year", year));
      dispatch(prepareFinalObject("searchScreen", {}));
      // FROM local
      let  APIData =samplePaySlip();
      // from api


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
      dispatch(prepareFinalObject("APIData.PaySlip.Allowances",[]));
      const storedata = getEmployeeData(action,state, dispatch);
      return action;
    },
    components: {
      div: {
        uiFramework: "custom-atoms",
        componentPath: "Form",
        props: {
          className: "common-div-css",
          id: "search",
        },
        children: {
          headerDiv: {
            uiFramework: "custom-atoms",
            componentPath: "Container",
  
            children: {
              header: {
                gridDefination: {
                  xs: 12,
                  sm: 6,
                },
                ...header,
              },

            },
          },
          searchForm,
          breakAfterSearch: getBreak(),
          payslipData: {
            uiFramework: "custom-containers-local",        
            componentPath: "PayslipContainer",
            moduleName: "egov-integration",
              props: {
                dataPath: "records",
                moduleName: "RTI",
                pageName:"INTIGRATION_PAYSLIP",
  
              }
          },
        },
      },
    },
  };
  
  export default sepSearchAndResult;
  