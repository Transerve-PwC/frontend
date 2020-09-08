import get from "lodash/get";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getSearchResults ,getLocaliyReportData} from "../../../../../ui-utils/commons";
import { convertEpochToDate, convertDateToEpoch } from "../../utils/index";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { textToLocalMapping } from "./searchResults";
import { validateFields, getTextToLocalMapping } from "../../utils";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { localStorageGet } from "egov-ui-kit/utils/localStorageUtils";
import commonConfig from '../../../../../config/common';

import { httpRequest } from "../../../../../ui-utils";


const showHidesearchDepartmentEmployeesResults = (booleanHideOrShow, dispatch) => {
  dispatch(
    handleField(
      "createInvite",
      "components.div.children.formwizardFirstStep.children.searchDepartmentEmployeesResults",
      "visible",
      booleanHideOrShow
    )
  );
};






export const TimeSeriesReportSearch = async (state, dispatch) => {
  let monthdata=[1,2,3,4,5,6,7,8,9,10,11,12]
let month=get(
  state.screenConfiguration.preparedFinalObject,
  "TimeseriesReport.Month"
)
let year=get(
  state.screenConfiguration.preparedFinalObject,
  "TimeseriesReport.Year"
)

let Aggrigate=get(
  state.screenConfiguration.preparedFinalObject,
  "TimeseriesReport.AggrigatedBy"
)
if(  year!==undefined && Aggrigate!==undefined && Aggrigate.label!=="Select Aggregated By" && year.label!=="Select Year" )
{
  
  if(Aggrigate.label==="Department")
  {
let data={

  "tenantId":getTenantId(),
  "reportName":"MISTimeSeriesDepartmentReportReport",
  "searchParams":[
    {
      "name":"moduleCode",
      "input":localStorageGet("modulecode")
    },
    {
      "name":"year",
      "input":parseInt(
 
      year.label
      )

    },
    {
      "name":"month",
      "input":month===undefined?monthdata:month.label==="ALL"?monthdata:[parseInt(month.value)]
    }
  ]
 
}

const response = await getLocaliyReportData(data);
let mdmsBody = {
  MdmsCriteria: {
    tenantId: commonConfig.tenantId,
    moduleDetails: [
      {
        moduleName: "RAINMAKER-PR",
        masterDetails: [{ name: "eventType" }, { name: "eventStatus" },{ name: "eventDocuments" },  { name: "eventSector" },, { name: "localityAreaName" }]
      },
     
      {
        moduleName: "tenant",
        masterDetails: [
          {
            name: "tenants"
          }
        ]
      },


      {
        moduleName: "tenant",
        masterDetails: [
          {
            name: "tenants"
          }
        ]
      },
      {
        moduleName: "common-masters",
        masterDetails: [
          {
            name: "Department"
          }
        ]
      },
    ]
  }
};
  let payload = null;
  payload = await httpRequest(
    "post",
    "/egov-mdms-service/v1/_search",
    "_search",
    [],
    mdmsBody
  );
  


  for(let i=0;i<payload.MdmsRes["common-masters"].Department.length;i++)
  {
    for(let j=0;j<response.reportData.length;j++)
    {
if(response.reportData[j][0]===payload.MdmsRes["common-masters"].Department[i].code)
{
response.reportData[j][0]=payload.MdmsRes["common-masters"].Department[i].name
}
    }

  }
  
    try {
     
      let data1 = response.reportData.map(item => ({
         [getTextToLocalMapping("Aggregate By Department")]:
           item[0] || "-",
           [getTextToLocalMapping("Year")]:
           item[1] || "-",
           [getTextToLocalMapping("Month")]:
           item[2] || "-",
         [getTextToLocalMapping("New Events")]:
         item[5] || "-",
         
         [getTextToLocalMapping("Ongoing Events")]:
           item[4] || "-",
         [getTextToLocalMapping("Closed Events")]:
         item[6] || "-",
         [getTextToLocalMapping("Archived Events")]:
         item[7] || "-", [getTextToLocalMapping("Number Events")]:
         item[3] || "-",
         
       }));
      dispatch(
        handleField(
          "TimeSeriesReport",
          "components.div.children.TimeSeriessearchResults",
          "props.data",
          data1
        )
      );
      showHideTimeseriesEventTable(false, dispatch);
      
      showHideTimeseriesDeptTable(true, dispatch);
     
    } catch (error) {
      dispatch(
        toggleSnackbar(
          true,
          { labelName: error.message, labelKey: error.message },
          "error"
        )
      );
      console.log(error);
    }
 // }
  }
  else{


    let data={
      
        "tenantId":getTenantId(),
        "reportName":"MISTimeSeriesEventTypeReportReport",
        "searchParams":[
          {
            "name":"moduleCode",
            "input":localStorageGet("modulecode")
          },
          {
            "name":"year",
            "input":parseInt(
           
            year.label
            )
          },
          {
            "name":"month",
            "input":month===undefined?monthdata:month.label==="ALL"?monthdata:[parseInt(month.value)]
          }
        ]
       
      }
      const response = await getLocaliyReportData(data);
          try {
           
            let data1 = response.reportData.map(item => ({
              
               [getTextToLocalMapping("Aggregate By Event Type")]:
                 item[0] || "-",
                 [getTextToLocalMapping("Year")]:
                 item[1] || "-",
                 [getTextToLocalMapping("Month")]:
                 item[2] || "-",
               [getTextToLocalMapping("New Events")]:
               item[5] || "-",
               
             
               [getTextToLocalMapping("Ongoing Events")]:
                 item[4] || "-",
               [getTextToLocalMapping("Closed Events")]:
               item[6] || "-",
               [getTextToLocalMapping("Archived Events")]:
               item[7] || "-", [getTextToLocalMapping("Number Events")]:
               item[3] || "-",
             }));
            dispatch(
              handleField(
                "TimeSeriesReport",
                "components.div.children.TimeSeriessearchEventResults",
                "props.data",
                data1
              )
            );
            
            showHideTimeseriesDeptTable(false, dispatch);
            showHideTimeseriesEventTable(true, dispatch);
            
          } catch (error) {
            dispatch(
              toggleSnackbar(
                true,
                { labelName: error.message, labelKey: error.message },
                "error"
              )
            );
            console.log(error);
          }
       // }


  
    }    }
    else{
      dispatch(
              toggleSnackbar(
                true,
                {
                  labelName: "Please fill All Requried Fields.",
                  labelKey: "PR_SEARCH_SELECT_REQURIED_FIELDS_TOAST_MESSAGE"
                },
                "warning"
              )
            );
    }
};


const showHideTimeseriesEventTable = (booleanHideOrShow, dispatch) => {
  dispatch(
    handleField(
      "TimeSeriesReport",
      "components.div.children.TimeSeriessearchEventResults",
      "visible",
      booleanHideOrShow
    )
  );
};

const showHideTimeseriesDeptTable = (booleanHideOrShow, dispatch) => {
  dispatch(
    handleField(
      "TimeSeriesReport",
      "components.div.children.TimeSeriessearchResults",
      "visible",
      booleanHideOrShow
    )
  );
};
export const EventReportSearch = async (state, dispatch) => {
  let dept=get(
    state.screenConfiguration.preparedFinalObject,
    "eventReport.dept"
  )
  
  if(dept!=undefined )
  {
let data={

  "tenantId":getTenantId(),
  "reportName":"MISNumberOfEventReportReport",
    "searchParams":[
    {
      "name":"moduleCode",
      "input":localStorageGet("modulecode")
    },
    {
      "name":"departmentName",
      "input":dept.value=="ALL"?"":dept.value
    }
  ]
 
}

const response = await getLocaliyReportData(data);
let mdmsBody = {
  MdmsCriteria: {
    tenantId:commonConfig.tenantId,
    moduleDetails: [
      {
        moduleName: "RAINMAKER-PR",
        masterDetails: [{ name: "eventType" }, { name: "eventStatus" },{ name: "eventDocuments" },  { name: "eventSector" },, { name: "localityAreaName" }]
      },
     
      {
        moduleName: "tenant",
        masterDetails: [
          {
            name: "tenants"
          }
        ]
      },


      {
        moduleName: "tenant",
        masterDetails: [
          {
            name: "tenants"
          }
        ]
      },
      {
        moduleName: "common-masters",
        masterDetails: [
          {
            name: "Department"
          }
        ]
      },
    ]
  }
};
  let payload = null;
  payload = await httpRequest(
    "post",
    "/egov-mdms-service/v1/_search",
    "_search",
    [],
    mdmsBody
  );
  


  for(let i=0;i<payload.MdmsRes["common-masters"].Department.length;i++)
  {
    for(let j=0;j<response.reportData.length;j++)
    {
if(response.reportData[j][0]===payload.MdmsRes["common-masters"].Department[i].code)
{
response.reportData[j][0]=payload.MdmsRes["common-masters"].Department[i].name
}
    }

  }
  
    try {
     
      let data1 = response.reportData.map(item => ({
        // alert(item)
         [getTextToLocalMapping("Department Name")]:
           item[0] || "-",
         [getTextToLocalMapping("Ongoing Events")]: item[2] || "-",
         [getTextToLocalMapping("New Events")]:
           item[3] || "-",
         [getTextToLocalMapping("Closed Events")]:
         item[4] || "-",
         [getTextToLocalMapping("Archived Events")]:
         item[5] || "-", [getTextToLocalMapping("Number Uploads")]:
         item[6] || "-",
       }));
      dispatch(
        handleField(
          "EventReport",
          "components.div.children.EventReportSearchResults",
          "props.data",
          data1
        )
      );
      
    } catch (error) {
      dispatch(
        toggleSnackbar(
          true,
          { labelName: error.message, labelKey: error.message },
          "error"
        )
      );
      console.log(error);
    }
  }
  else{
    dispatch(
            toggleSnackbar(
              true,
              {
                labelName: "Please fill All Requried Fields search",
                labelKey: "PR_SEARCH_SELECT_REQURIED_FIELDS_TOAST_MESSAGE"
              },
              "warning"
            )
          );
  }
};
export const LocalityReportSearch = async (state, dispatch) => {
  //showHideTable(false, dispatch);
  let fromDate=get(
    state.screenConfiguration.preparedFinalObject,
    "LocalityReport.fromDate"
  )
  let todate=get(
    state.screenConfiguration.preparedFinalObject,
    "LocalityReport.toDate"
  )
  let localityName=get(
    state.screenConfiguration.preparedFinalObject,
    "LocalityReport.localityname"
  )
  if(fromDate!==undefined && todate!==undefined && localityName!==undefined)
  {
    var date1 = new Date(fromDate);
    var date2 = new Date(todate);
   
    if(fromDate<=todate)
    {
let data={

  "tenantId":getTenantId(),
  "reportName":"MISEventLocalityWiseReport",
  "searchParams":[
    {
      "name":"moduleCode",
      "input":localStorageGet("modulecode")
    },
    {
      "name":"fromDate",
      "input":get(
        state.screenConfiguration.preparedFinalObject,
        "LocalityReport.fromDate"
      )
    },
    {
      "name":"toDate",
      "input":get(
        state.screenConfiguration.preparedFinalObject,
        "LocalityReport.toDate"
      )
    },
    // {
    //   "name":"localityName",
    //   "input":get(
    //     state.screenConfiguration.preparedFinalObject,
    //     "LocalityReport.localityname"
    //   )=="ALL"?"":get(
    //     state.screenConfiguration.preparedFinalObject,
    //     "LocalityReport.localityname"
    //   )
    // }
    {
      "name":"localityName",
      "input":localityName.label=="ALL"?"":localityName.label
      
    }
  ]
}


const response = await getLocaliyReportData(data);
    try {
     
      let data1 = response.reportData.map(item => ({
         [getTextToLocalMapping("Locality Name")]:
           item[0] || "-",
        [getTextToLocalMapping("New Events")]: item[3] || "-",
         [getTextToLocalMapping("Ongoing Events")]:
           item[2] || "-",
         [getTextToLocalMapping("Closed Events")]:
         item[4] || "-",
         [getTextToLocalMapping("Archived Events")]:
         item[5] || "-", [getTextToLocalMapping("Number Events")]:
         item[1] || "-",
       }));
      dispatch(
        handleField(
          "LocalityReports",
          "components.div.children.LocalityReportSearchResults",
          "props.data",
          data1
        )
      );
      
    } catch (error) {
      dispatch(
        toggleSnackbar(
          true,
          { labelName: error.message, labelKey: error.message },
          "error"
        )
      );
      console.log(error);
    }
  } 
  else{
    
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "From Date should be less than todate",
          labelKey: "ERR_FILL_FROM_DATE_<_TODATE"
        },
        "warning"
      )
    );
  }
}

  
  else{
    dispatch(
            toggleSnackbar(
              true,
              {
                labelName: "Please fill All Requried Fields search",
                labelKey: "PR_SEARCH_SELECT_REQURIED_FIELDS_TOAST_MESSAGE"
              },
              "warning"
            )
          );
  }

};
