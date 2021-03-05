
import get from "lodash/get";
import {prepareFinalObject, handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getSearchPensionerForPensionRevision,getSearchPensioner } from "../../../../../ui-utils/commons";
import { convertEpochToDate, convertDateToEpoch } from "../../utils/index";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { textToLocalMapping } from "./searchResult";
import { validateFields, getTextToLocalMapping } from "../../utils";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { httpRequest } from "../../../../../ui-utils/api";
import {  
   WFConfig
  } from "../../../../../ui-utils/sampleResponses";
export const createRevisedPension = async (state, dispatch) => {
  const tenantId = getQueryArg(window.location.href, "tenantId");
  let IsValidPensionData = validateFields(
      "components.div.children.revisionDetails.children.cardContent.children.pensionDetailsConatiner.children",
      state,
      dispatch,
      "revisionDetails"
    );
    try{
    if(IsValidPensionData)
    {
      let IsValidMonth = true
      let Month = get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].pensionRevision[0].effectiveStartMonth", 0)
      let Year = get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].pensionRevision[0].effectiveStartYear", 0)
      if(Year!== null)
    {

      if(Year >= Number(new Date().getFullYear()))
    {
      if(Month< (Number(new Date().getMonth()) +1) && Year === Number(new Date().getFullYear()))
      IsValidMonth = true
      //IsValidMonth = false
        if(IsValidMonth)
        {
            let IsValidSubmissionDate = true;
            let configDayMonth = 0;
            let ConfigDay = get(state.screenConfiguration.preparedFinalObject,"applyScreenMdmsData.pension.PensionConfig", [])
            for (let index = 0; index < ConfigDay.length; index++) {
              const element = ConfigDay[index].key;
              if(ConfigDay[index].key ==="DAY_OF_MONTHLY_PENSION_REGISTER_GENERATION")
              {
                configDayMonth= Number(ConfigDay[index].value)
                break;
              }
            } 

            if(Month == (Number(new Date().getMonth()) +1))
            {
              if(configDayMonth<new Date().getDate() && Year === Number(new Date().getFullYear()))
              //IsValidSubmissionDate = false;
              IsValidSubmissionDate = true;
            }
                        
            if(IsValidSubmissionDate)
            {
              //let  effectiveStartYear_ = response.ProcessInstances[0].pensionRevision.filter((x)=> x.effectiveStartMonth >= 7 && x.effectiveStartMonth <= 8);//.slice(0,1);
              let pensionRevisionTemp = get(state.screenConfiguration.preparedFinalObject,"pensionRevisionTemp", [])

              pensionRevisionTemp = pensionRevisionTemp.filter((x)=>x.effectiveStartYear >= Year)             
              pensionRevisionTemp = pensionRevisionTemp.filter((x)=>x.effectiveStartMonth >= Month && x.effectiveStartYear >= Year)
              if(pensionRevisionTemp.length === 0)
              {             
              let ProcessInstances= get(state.screenConfiguration.preparedFinalObject,"ProcessInstances", [])
              let response = await httpRequest(
                  "post",
                  "/pension-services/v1/_createRevisedPension",
                  "",
                  [],
                  { 
                    ProcessInstances: [
                                        {
                                        //tenantId:tenantId,
                                        tenantId:getTenantId(),
                                        pensioner:ProcessInstances[0].pensioner,
                                        pensionRevision:[ProcessInstances[0].pensionRevision[0]]
                                        }
                                      ] 
                  }
                  );
                  let payload_= get(
                    response,
                    "ProcessInstances",
                    []
                  );

                  let  data =[
                    {
                      pensionRevision:payload_[0].pensionRevision,
                      pensioner :ProcessInstances[0].pensioner,
                      pensionerFinalCalculatedBenefitDetails:ProcessInstances[0].pensionerFinalCalculatedBenefitDetails,
                      PensionersBasicData:get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].PensionersBasicData", [] )
                    } ];
                  dispatch(prepareFinalObject("ProcessInstances", data, []));
                  const tenantId = getTenantId();
                  const pensionerNumber = getQueryArg(
                    window.location.href,
                    "pensionerNumber"
                  );
                  let queryObject = [
                    {
                      key: "pensionerNumber",
                    value: pensionerNumber
                     
                    }];
                  queryObject.push({
                    key: "tenantId",
                    value: tenantId
                  });
                  const response_ = await getSearchPensioner(queryObject);
                  dispatch(prepareFinalObject("pensionRevisionTemp", response.ProcessInstances[0].pensionRevision, []));
                  dispatch( toggleSnackbar(
                    true,
                    {
                    labelName: "Pension Revesion add edit success meaasge!",
                    labelKey: "PENSION_ADD_EDIT_SUCCESS_MESSAGE"
                    },
                    "success"
                    ));
                  }
                  else
                  {
                    dispatch( toggleSnackbar(
                      true,
                      { labelName: "Data Exist for selcted Year and Month!", labelKey: 'PENSION_DATA_EXIST_SUBMMISION_MONTH' },
                      "warning"
                    ));
                  }
            }
            else{
              dispatch( toggleSnackbar(
                  true,
                  { labelName: "Revsion data can't be update on or after dat of monthly pension register generation!", labelKey: 'PENSION_INVALID_SUBMMISION_DATE' },
                  "warning"
                ));

            }
          

        }
        else{
          dispatch( toggleSnackbar(
              true,
              { labelName: "invalid current year previous month", labelKey: 'PENSION_INVALID_CURRENT_YEAR_PREVIOUS_MONTH' },
              "warning"
            ));
        }
      }
      else
    {
      dispatch( toggleSnackbar(
        true,
        { labelName: "Invalid Year", labelKey: 'PENSION_INVALID_REVESION_CURRENT_YEAR' },
        "warning"
      ));

    }
    }
    else
    {
      dispatch( toggleSnackbar(
        true,
        { labelName: "Invalid Year", labelKey: 'PENSION_INVALID_REVESION_CURRENT_YEAR' },
        "warning"
      ));

    }
    }
    
    else
    {
      dispatch( toggleSnackbar(
          true,
          { labelName: "Input Valid data", labelKey: 'PENSION_REVESION_INVALID_INPUT_MESSAGE' },
          "warning"
        ));
    }
  }
  catch (e){
     
      dispatch(
      toggleSnackbar(
          true,
          {
          labelName: "Workflow returned empty object !",
          labelKey: "PENSION_ERROR_REVISED_PENSION_ADD_EDIT"
          },
          "error"
          ));
  }

}
export const calculateRevisedPension = async (state, dispatch) => {
  const tenantId = getQueryArg(window.location.href, "tenantId");
  let IsValidPensionData = validateFields(
      "components.div.children.revisionDetails.children.cardContent.children.pensionDetailsConatiner.children",
      state,
      dispatch,
      "revisionDetails"
    );
    try{

    if(IsValidPensionData)
    {
        let IsValidMonth = true
        let Month = get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].pensionRevision[0].effectiveStartMonth", 0)
        let Year = get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].pensionRevision[0].effectiveStartYear", 0)
        if(Year!== null)
    {

      if(Year >= Number(new Date().getFullYear()))
    {
       
        if(Month< (Number(new Date().getMonth()) +1) && Year === Number(new Date().getFullYear()))
        IsValidMonth = true
        //IsValidMonth = false
        if(IsValidMonth)
        {
          let IsValidSubmissionDate = true;
          let configDayMonth = 0;
          let ConfigDay = get(state.screenConfiguration.preparedFinalObject,"applyScreenMdmsData.pension.PensionConfig", [])
          for (let index = 0; index < ConfigDay.length; index++) {
            const element = ConfigDay[index].key;
            if(ConfigDay[index].key ==="DAY_OF_MONTHLY_PENSION_REGISTER_GENERATION")
            {
              configDayMonth= Number(ConfigDay[index].value)
              break;
            }
          } 

          if(Month == (Number(new Date().getMonth()) +1))
          {
           
            if(configDayMonth<new Date().getDate() && Year === Number(new Date().getFullYear()))
            //IsValidSubmissionDate = false;
            IsValidSubmissionDate = true;
          }
            if(IsValidSubmissionDate)
            {
              let ProcessInstances= get(state.screenConfiguration.preparedFinalObject,"ProcessInstances", [])
              let response = await httpRequest(
                  "post",
                  "/pension-calculator/v1/_calculateRevisedPension",
                  "",
                  [],
                  { 
                    ProcessInstances: [
                                        {
                                        tenantId:tenantId,
                                        pensionRevision:[ProcessInstances[0].pensionRevision[0]]
                                        }
                                      ] 
                  }
                  );
                  let payload_= get(
                    response,
                    "ProcessInstances",
                    []
                  );
                  let  data =[
                    {
                      pensionRevision:payload_[0].pensionRevision,
                      pensioner :ProcessInstances[0].pensioner,
                      pensionerFinalCalculatedBenefitDetails:ProcessInstances[0].pensionerFinalCalculatedBenefitDetails,
                      PensionersBasicData:get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].PensionersBasicData", [] )
                    } ];
                  dispatch(prepareFinalObject("ProcessInstances", data, []));
                  
            }
            else{
              dispatch( toggleSnackbar(
                  true,
                  { labelName: "Revsion data can't be update on or after dat of monthly pension register generation!", labelKey: 'PENSION_INVALID_SUBMMISION_DATE' },
                  "warning"
                ));

            }
          

        }
        else{
          dispatch( toggleSnackbar(
              true,
              { labelName: "invalid current year previous month", labelKey: 'PENSION_INVALID_CURRENT_YEAR_PREVIOUS_MONTH' },
              "warning"
            ));
        }
      }
      else
    {
      dispatch( toggleSnackbar(
        true,
        { labelName: "Invalid Year", labelKey: 'PENSION_INVALID_REVESION_CURRENT_YEAR' },
        "warning"
      ));

    }
    }
    else
    {
      dispatch( toggleSnackbar(
        true,
        { labelName: "Invalid Year", labelKey: 'PENSION_INVALID_REVESION_CURRENT_YEAR' },
        "warning"
      ));

    }
    }
    
    else
    {
      dispatch( toggleSnackbar(
          true,
          { labelName: "Input Valid data", labelKey: 'PENSION_REVESION_INVALID_INPUT_MESSAGE' },
          "warning"
        ));
    }
  }
  catch (e){
     
      dispatch(
      toggleSnackbar(
          true,
          {
          labelName: "Workflow returned empty object !",
          labelKey: "PENSION_ERROR_REVISED_PENSION_ADD_EDIT"
          },
          "error"
          ));
  }

}
export const updateRevisedPension = async (state, dispatch) => {
  const tenantId = getQueryArg(window.location.href, "tenantId");
  let IsValidPensionData = validateFields(
      "components.div.children.revisionDetails.children.cardContent.children.pensionDetailsConatiner.children",
      state,
      dispatch,
      "revisionDetails"
    );
    try{
    if(IsValidPensionData)
    {
      let IsValidMonth = true
      let Month = get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].pensionRevision[0].effectiveStartMonth", 0)
      let Year = get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].pensionRevision[0].effectiveStartYear", 0)
      if(Year!== null)
    {

      if(Year >= Number(new Date().getFullYear()))
  {
      if(Month< (Number(new Date().getMonth()) +1) && Year === Number(new Date().getFullYear()))     
      if(Month< (Number(new Date().getMonth()) +1))
     
      IsValidMonth = true
      //IsValidMonth = false
        if(IsValidMonth)
        {
          let IsValidSubmissionDate = true;
          let configDayMonth = 0;
          let ConfigDay = get(state.screenConfiguration.preparedFinalObject,"applyScreenMdmsData.pension.PensionConfig", [])
          for (let index = 0; index < ConfigDay.length; index++) {
            const element = ConfigDay[index].key;
            if(ConfigDay[index].key ==="DAY_OF_MONTHLY_PENSION_REGISTER_GENERATION")
            {
              configDayMonth= Number(ConfigDay[index].value)
              break;
            }
          } 

          if(Month == (Number(new Date().getMonth()) +1))
          {
            if(configDayMonth<new Date().getDate() && Year === Number(new Date().getFullYear()))
            //IsValidSubmissionDate = false;
            IsValidSubmissionDate = true;
          }
            if(IsValidSubmissionDate)
            {
              let ProcessInstances= get(state.screenConfiguration.preparedFinalObject,"ProcessInstances", [])
              let response = await httpRequest(
                  "post",
                  "/pension-services/v1/_updateRevisedPension",
                  "",
                  [],
                  { 
                    ProcessInstances: [
                                        {
                                          tenantId:tenantId,
                                          pensioner:ProcessInstances[0].pensioner,
                                          pensionRevision:[ProcessInstances[0].pensionRevision[0]]
                                        }
                                      ] 
                  }
                  );
                  let payload_= get(
                    response,
                    "ProcessInstances",
                    []
                  );

                  let  data =[
                    {
                      pensionRevision:payload_[0].pensionRevision,
                      pensioner :ProcessInstances[0].pensioner,
                      pensionerFinalCalculatedBenefitDetails:ProcessInstances[0].pensionerFinalCalculatedBenefitDetails,
                      PensionersBasicData:get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].PensionersBasicData", [] )
                    } ];
                  dispatch(prepareFinalObject("ProcessInstances", data, []));
                  dispatch( toggleSnackbar(
                    true,
                    {
                    labelName: "Pension Revesion add edit success meaasge!",
                    labelKey: "PENSION_ADD_EDIT_SUCCESS_MESSAGE"
                    },
                    "success"
                    ));
            }
            else{
              dispatch( toggleSnackbar(
                  true,
                  { labelName: "Revsion data can't be update on or after dat of monthly pension register generation!", labelKey: 'PENSION_INVALID_SUBMMISION_DATE' },
                  "warning"
                ));

            }
          

        }
        else{
          dispatch( toggleSnackbar(
              true,
              { labelName: "invalid current year previous month", labelKey: 'PENSION_INVALID_CURRENT_YEAR_PREVIOUS_MONTH' },
              "warning"
            ));
        }
      }
      else
    {
      dispatch( toggleSnackbar(
        true,
        { labelName: "Invalid Year", labelKey: 'PENSION_INVALID_REVESION_CURRENT_YEAR' },
        "warning"
      ));

    }
      }
      else
      {
        dispatch( toggleSnackbar(
          true,
          { labelName: "Invalid Year", labelKey: 'PENSION_INVALID_REVESION_CURRENT_YEAR' },
          "warning"
        ));

      }
    }
    
    else
    {
      dispatch( toggleSnackbar(
          true,
          { labelName: "Input Valid data", labelKey: 'PENSION_REVESION_INVALID_INPUT_MESSAGE' },
          "warning"
        ));
    }
  }
  catch (e){
      //alert(e.message)
      dispatch(
      toggleSnackbar(
          true,
          {
          labelName: "Workflow returned empty object !",
          labelKey: "PENSION_ERROR_REVISED_PENSION_ADD_EDIT"
          },
          "error"
          ));
  }
  
}


export const GetMonthlydata = async (state, dispatch) => {
    showHideTable(false, dispatch);
        
        // const response = get(
        //     state.screenConfiguration.preparedFinalObject,
        //     "ProcessInstances",
        //     []
        //   );
          let queryObject = [
                    {
                        key: "pensionerNumber",
                    value:  getQueryArg(window.location.href, "pensionerNumber")
                    
                    }];
                    queryObject.push({
                    key: "tenantId",
                    value: getTenantId()
                    });
                    const response_ = await getSearchPensioner(queryObject);
    const response = await getSearchPensionerForPensionRevision(queryObject);
      //dispatch(prepareFinalObject("ProcessInstances", response.ProcessInstances, []));
          if(response.ProcessInstances[0].pensionRevision.length===0)
          {
            dispatch(
                  toggleSnackbar(
                    true,
                    { labelName: "No Records found for Input parameter", labelKey: "PENSION_NO_RECORDS_FOUND" },
                    "warning"
                  )
                );
                hjud7
               // break;
          }
          let data = response.ProcessInstances[0].pensionRevision.map(item => {            
        
           
        
            return {
              //[getTextToLocalMapping("Action")]: get(item, "action", "-") || "-",
              [getTextToLocalMapping("effectiveStartYear")]: get(item, "effectiveStartYear", "-") || "-",
              [getTextToLocalMapping("effectiveStartMonth")]: get(item, "effectiveStartMonth", "-") || "-",         
             // [getTextToLocalMapping("basicPension")]: get(item, "basicPension", "0") || "0",
              [getTextToLocalMapping("totalPension")]: get(item, "totalPension", "0") || "0",          
              [getTextToLocalMapping("netDeductions")]: get(item, "netDeductions", "0") || "0", 
              [getTextToLocalMapping("finalCalculatedPension")]: get(item, "finalCalculatedPension", "0") || "0", 
             //
             
             
            };
          });
          
          dispatch(
                  handleField(
                    "revision",
                    "components.div.children.searchResults",
                    "props.data",
                    data
                  )
                );
                dispatch(
                  handleField(
                    "revision",
                    "components.div.children.searchResults",
                    "props.title",
                    `${getTextToLocalMapping(
                      "Search Results for Pensioner Monthly Data"
                    )} (${response.ProcessInstances[0].pensionRevision.length})`
                  )
                );
        // dispatch(
        //   handleField(
        //     "revision",
        //     "components.div.children.card.children.cardContent.children.searchResults",
        //     "props.data",
        //     data
        //   )
        // );
        // dispatch(
        //   handleField(
        //     "revision",
        //     "components.div.children.card.children.cardContent.children.searchResults",
        //     "props.title",
        //     `${getTextToLocalMapping(
        //       "Search Results for Pensioner Monthly Data"
        //     )} (${response.ProcessInstances[0].pensionRevision.length})`
        //   )
        // );
        //showHideProgress(false, dispatch);
        showHideTable(true, dispatch);
        let  data_ =[
          {
            pensionRevision:response.ProcessInstances[0].pensionrevesion,
            pensioner :response.ProcessInstances[0].pensioner,
            pensionerFinalCalculatedBenefitDetails:response.ProcessInstances[0].pensionerFinalCalculatedBenefitDetails,
            PensionersBasicData : get(response_, "Pensioners", [])
          } ];
       // dispatch(prepareFinalObject("ProcessInstances", response.ProcessInstances, []));
        dispatch(prepareFinalObject("ProcessInstances", data_, []));

        if(response.ProcessInstances[0].pensioner.businessService ===WFConfig().businessServiceRRP)
        {
          dispatch(
            handleField(
              "revision",
              "components.div.children.pensionerverifiedData",
              "props.style",
              { display: "inline-block" }
            )
          );
          dispatch(
            handleField(
              "revision",
              "components.div.children.card",
              "props.style",
              { display: "inline-block" }
            )
          );
        }
        else  if(response.ProcessInstances[0].pensioner.businessService ===WFConfig().businessServiceDOE)
        {
          dispatch(
            handleField(
              "revision",
              "components.div.children.pensionerverifiedDataDOE",
              "props.style",
              { display: "inline-block" }
            )
          );
        }
        else  if(response.ProcessInstances[0].pensioner.businessService ===WFConfig().businessServiceDOP)
        {
          dispatch(
            handleField(
              "revision",
              "components.div.children.pensionerverifiedDataDOP",
              "props.style",
              { display: "inline-block" }
            )
          );
        }

       
   
  
  };
  const showHideTable = (booleanHideOrShow, dispatch) => {
    dispatch(
      handleField(
        "revision",
        "components.div.children.searchResults",
        "visible",
        booleanHideOrShow
      )
    );
  };