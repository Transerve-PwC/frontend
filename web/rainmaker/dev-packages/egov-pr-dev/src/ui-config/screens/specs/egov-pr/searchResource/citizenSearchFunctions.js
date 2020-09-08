import {getEmployeeByUUidHRMS, truncData,toTitleCase,convertTime,getEmployeeByUUid,getLibraryGridData,getPressNoteGridData,getSearchResultsViewPressnotedata,getPressMasterGridData1,getCommittiee,getSearchResultsViewEvent,getSearchResultsViewLI, getSearchResults ,getEventGridData,getInviteGuestGridData,getTenderGridData,getBillingGrid,getPublishTenderGrid , getEventeelistGridData, getSearchResultsForTenderSummary, getPressMasterSearchResultsViewMain} from "../../../../../ui-utils/commons";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { prepareFinalObject, handleScreenConfigurationFieldChange as handleField  } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import {localStorageGet, localStorageSet, lSRemoveItemlocal, lSRemoveItem} from "egov-ui-kit/utils/localStorageUtils";
import { httpRequest } from "../../../../../ui-utils";
import { getDetailsForOwner, getTextToLocalMapping } from "../../utils";
import { showHidesearchDepartmentEmployeesResults } from "./functions";
import jp from "jsonpath";
import get from "lodash/get";
import set from "lodash/set";
//import store from "redux/store";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import {  showHideAdhocPopupopmsReject } from "../../utils";
import store from "ui-redux/store";
import {
  getFileUrlFromAPI,
  getQueryArg,
  getTransformedLocale
} from "egov-ui-framework/ui-utils/commons";
import commonConfig from '../../../../../config/common';

// export const fetchData = async (action, state, dispatch) => {
//   const response = await getSearchResults();
 
//   try {
//     if (response && response.PublicRelations && response.PublicRelations.length > 0) {
//       dispatch(prepareFinalObject("searchResults", response.PublicRelations));
//       dispatch(
//         prepareFinalObject("myApplicationsCount", response.PublicRelations.length)
//       );
//     }
//   } catch (error) {
//     console.log(error);
//   }
// };

// const toTitleCase=(str)=> {
//   return str.replace(/\w\S*/g, function(txt){
//       return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
//   });
// } 
// const convertTime =(time)=> {
//   // Check correct time format and split into components
  
//   //time=time+":00"
//   time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)?$/) || [time];
  
//   if (time.length > 1) { // If time format correct
//   time = time.slice(1); // Remove full string match value
//   time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
//   time[0] = +time[0] % 12 || 12; // Adjust hours
//   }
//   return time.join(''); // return adjusted time or original string
//   }
  // const truncData=(str, length, ending)=> {
  //   if (length == null) {
  //     length = 20;
  //   }
  //   if (ending == null) {
  //     ending = '...';
  //   }
  //   if (str.length > length) {
  //     return str.substring(0, length - ending.length) + ending;
  //   } else {
  //     return str;
  //   }
  // };
export const getGridData = async (action, state, dispatch) => {
  const response = await getEventGridData();
  try {
    if (response && response.ResponseBody && response.ResponseBody.length > 0) {
     
    //  value.split(" ")[0];
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
      for(let j=0;j<response.ResponseBody.length;j++)
      {
if(response.ResponseBody[j].organizerDepartmentName===payload.MdmsRes["common-masters"].Department[i].code)
{
  response.ResponseBody[j]['EmpName']=payload.MdmsRes["common-masters"].Department[i].name
}
      }

    }
  

    let data = response.ResponseBody.map(item => ({


      [getTextToLocalMapping("Event Id")]:
      item.eventId || "-",
      [getTextToLocalMapping("Event Title")]:
      truncData(item.eventTitle) || "-",
      [getTextToLocalMapping("Organizer Department")]:
      item.EmpName|| "-",
      [getTextToLocalMapping("Organizer Employee")]:
      item.organizerUsernName || "-",
    [getTextToLocalMapping("Date & Time")]:item.startDate.split(" ")[0] +" "+convertTime(item.startTime)+" "+"To"+" "+item.endDate.split(" ")[0] +" "+convertTime(item.endTime) || "-",
   [getTextToLocalMapping("Schedule Status")]:
      item.status || "-",
      [getTextToLocalMapping("Event Status")]:
      item.eventStatus || "-",
      [getTextToLocalMapping("Event UUID")]:
      item.eventDetailUuid || "-",
     }));
    
     dispatch(
       handleField(
         "search",
         "components.div.children.searchResults",
         "props.data",
         data
       )
     );
    
     showHideTable(true, dispatch);
  


    }
  } catch (error) {
    console.log(error);
  }
};
export const getlibraryGridData = async (action, state, dispatch) => {
  
  const response = await getLibraryGridData();
  try {
    if (response && response.ResponseBody && response.ResponseBody.length > 0) {
     
//  value.split(" ")[0];
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
      for(let j=0;j<response.ResponseBody.length;j++)
      {
if(response.ResponseBody[j].organizerDepartmentName===payload.MdmsRes["common-masters"].Department[i].code)
{
  response.ResponseBody[j]['EmpName']=payload.MdmsRes["common-masters"].Department[i].name
}
      }

    }
 

    let data = response.ResponseBody.map(item => ({
      [getTextToLocalMapping("Event Id")]:
      item.eventId || "-",
      [getTextToLocalMapping("Event Title")]:
      truncData(item.eventTitle) || "-",
      [getTextToLocalMapping("Organizer Department")]:
      item.EmpName|| "-",
      [getTextToLocalMapping("Organizer Employee")]:
      item.organizerUsernName || "-",
   [getTextToLocalMapping("Date & Time")]:item.startDate.split(" ")[0] +" "+convertTime(item.startTime)+" "+"To"+" "+item.endDate.split(" ")[0] +" "+convertTime(item.endTime) || "-",
   [ getTextToLocalMapping("Schedule Status")]:
      item.status || "-",
      [getTextToLocalMapping("Event Status")]:
      item.eventStatus || "-",
      [getTextToLocalMapping("Event UUID")]:
      item.eventDetailUuid || "-",
      

     
      
     }));
 
     dispatch(
       handleField(
         "library-search",
         "components.div.children.searchResultsLibrary",
         "props.data",
         data
       )
     );
    
  


    }
  } catch (error) {
    console.log(error);
  }
};
export const getPressGridData = async (action, state, dispatch) => {
  
  const response = await getPressNoteGridData();
  try {
    if (response && response.ResponseBody && response.ResponseBody.length > 0) {
 
    let data = response.ResponseBody.map(item => ({
      [getTextToLocalMapping("Date")]:
      item.pressNoteDate || "-",
      [getTextToLocalMapping("File Number")]:
      truncData(item.fileNumber) || "-",
      [getTextToLocalMapping("Subject")]:
      truncData(item.pressNoteSubject) || "-",
      [getTextToLocalMapping("Press Note List UUID")]:
      item.pressNoteUuid || "-",
    
      
     }));
  
     dispatch(
       handleField(
         "pressNoteList",
         "components.div.children.searchResultsPressList",
         "props.data",
         data
       )
     );
    
  


    }
  } catch (error) {
    console.log(error);
  }
};

export const getPressGridDatanote = async (action, state, dispatch) => {
  
  const response = await getPressMasterGridData1();
  try {
    if (response && response.ResponseBody && response.ResponseBody.length > 0) {
    
	let selectedrows = []
	let allrows = response.ResponseBody;
	localStorageSet("gridobjlength", allrows.length)
	allrows.map(item => {
			selectedrows.push(JSON.stringify(item))
	})
	localStorageSet("gridobj",selectedrows);
	
	
	
    let data = response.ResponseBody.map(item => ({
		
      [getTextToLocalMapping("Publication Name")]:
      truncData(item.publicationName) || "-",
      [ getTextToLocalMapping("Type of the Press")]:
      item.pressType || "-",
      [getTextToLocalMapping("Personnel Name")]:
      truncData(item.personnelName) || "-",
      [getTextToLocalMapping("Email Id")]:
      item.email || "-",
      [getTextToLocalMapping("Mobile Number")]:
      item.mobile || "-",
      [getTextToLocalMapping("Press master UUID")]:
      item.pressMasterUuid || "-",
    
      
     }));


 
     dispatch(
       handleField(
         "generatepressNote",
         "components.div.children.formwizardFirstStep.children.searchResultsPressMasterList",
         "props.data",
         data
       )
     );
		
  
return response.ResponseBody;
    }
  } catch (error) {
    console.log(error);
  }
};

export const getPressGridDatatender = async (action, state, dispatch) => {
  
  const response = await getPressMasterGridData1();
  try {
		
	
    if (response && response.ResponseBody && response.ResponseBody.length > 0) {
     
	 let selectedrows = []
	let allrows = response.ResponseBody;
	localStorageSet("gridobjlength", allrows.length)
	allrows.map(item => {
			selectedrows.push(JSON.stringify(item))
	})
	localStorageSet("gridobj",selectedrows);
	
    let data = response.ResponseBody.map(item => ({
      [getTextToLocalMapping("Publication Name")]:
      item.publicationName || "-",
      [ getTextToLocalMapping("Type of the Press")]:
      item.pressType || "-",
      [getTextToLocalMapping("Personnel Name")]:
      truncData(item.personnelName) || "-",
      [getTextToLocalMapping("Email Id")]:
      item.email || "-",
      [getTextToLocalMapping("Mobile Number")]:
      item.mobile || "-",
      [getTextToLocalMapping("Press master UUID")]:
      item.pressMasterUuid || "-",
    
      
     }));


  
     dispatch(
       handleField(
         "publishTender",
         "components.div.children.formwizardFirstStep.children.PressMasterListForTender",
         "props.data",
         data
       )
     );
    
  
return response.ResponseBody;
    }
  } catch (error) {
    console.log(error);
  }
};


export const getPressGridDataforview = async (action, state, dispatch) => {
  
  const response = await getPressNoteGridData();
  
  try {
    if (response && response.ResponseBody && response.ResponseBody.length > 0) {



    let selectedrows = []
    let allrows = response.ResponseBody[0].publicationList;
    console.log(allrows)
    if(allrows!==null)
    {
    localStorageSet("gridobjlength", allrows.length)
    allrows.map(item => {
        selectedrows.push(JSON.stringify(item))
    })
    localStorageSet("gridobj",selectedrows);
  }
      let temp = response.ResponseBody[0].publicationList;
    if(temp.length > 0){  
    let data = response.ResponseBody[0].publicationList.map(item => ({

      
      [getTextToLocalMapping("Publication Name")]:
      truncData(item.publicationName) || "-",
      [ getTextToLocalMapping("Type of the Press")]:
      item.pressType || "-",
      [ getTextToLocalMapping("Personnel Name")]:
      truncData(item.personnelName) || "-",
      [ getTextToLocalMapping("Email Id")]:
      item.email || "-",
      [getTextToLocalMapping("Mobile Number")]:
      item.mobile || "-",
      [getTextToLocalMapping("Event UUID")]:
      item.pressMasterUuid || "-",
      
     }));
    
	// Bind data to Grid
     dispatch(
       handleField(
         "pressnote-summary",
         "components.div.children.body.children.cardContent.children.pressnoteSummary.children.cardContent.children.cardfifth.props.scheama.children.cardContent.children.grid",
         "props.data",
         data
       )
     );
    
	// resend grid data bind
	 dispatch(
       handleField(
         "pressnote-summary",
         "components.div.children.body.children.cardContent.children.resendbody.children.cardContent.children.guestlist",
         "props.data",
         data
       )
     );
	
	 localStorageSet("resend_guest_list",JSON.stringify(data));
  
   
    }
    else
    {
        
            dispatch(
              toggleSnackbar(
                true,
                { labelName: "Invitations Not Send to This Press Release", labelKey: "PR_NO_INVITEES_PRESS" },
                "warning"
              )
            );

          dispatch(
          handleField(
          "pressnote-summary",
          "components.div.children.body.children.cardContent.children.resendbody",
          "visible",
          false
          )
          );
          
          dispatch(
          handleField(
          "pressnote-summary",
          "components.div.children.pressnoteFooter.children.resendbutton",
          "visible",
          false
          )
          );

    }
  //   showHideTable(true, dispatch);
  


    }
  } catch (error) {
    console.log(error);
  }
};
export const getInviateGuestGridData = async (action, state, dispatch) => {
  const response = await getInviteGuestGridData();
  try {
    if (response && response.nocApplicationDetail && response.nocApplicationDetail.length > 0) {
     

    let data = response.nocApplicationDetail.map(item => ({
       [getTextToLocalMapping("Event Id")]:
         item.applicationId || "-",
       [getTextToLocalMapping("Date & Time")]:item.applicationStatus || "-",
       [getTextToLocalMapping("Commitiee")]:
         item.applicantName || "-",
       
         [getTextToLocalMapping("Budjet")]:
         item.applicantName || "-",[getTextToLocalMapping("Status")]:
         item.applicantName || "-",
     }));
    
     dispatch(
       handleField(
         "searchInviteGuest",
         "components.div.children.searchInviteGuestResults",
         "props.data",
         data
       )
     );
    
  


    }
  } catch (error) {
    console.log(error);
  }
};

export const getGridDataTender = async (action, state, dispatch) => {
  const response = await getTenderGridData();
  
  try {
    if (response && response.ResponseBody  && response.ResponseBody.length > 0) {
    let data = response.ResponseBody.map(item => ({
      
       [getTextToLocalMapping("Tender Notice ID")]:item.tenderNoticeId || "-",
       [getTextToLocalMapping("Subject")]:item.tenderSubject || "-",
       [getTextToLocalMapping("Date")]:item.tenderDate || "-",
       [getTextToLocalMapping("File Number")]:item.fileNumber || "-"
     }));
    
     dispatch(
       handleField(
         "tenderSearch",
         "components.div.children.tenderSearchResults",
         "props.data",
         data
       )
     );
    // showHideTable(true, dispatch);
    }
  } catch (error) {
    console.log(error);
  }
};

export const getGridDataBilling = async (action, state, dispatch) => {
  const response = await getBillingGrid();
  
  try {
    if (response && response.ResponseBody && response.ResponseBody.length > 0) {
    let data = response.ResponseBody.map(item => ({
      [getTextToLocalMapping("Tender Notice ID")]:item.tenderNoticeId || "-",
      [getTextToLocalMapping("Date")]:item.tenderDate || "-",
      [getTextToLocalMapping("File Number")]:item.fileNumber || "-",
      [getTextToLocalMapping("Subject")]:item.tenderSubject || "-",
      [getTextToLocalMapping("Size of Publication")]:item.publicationSize || "-"
     }));
    
     dispatch(
       handleField(
         "billingSearch",
         "components.div.children.billingSearchResults",
         "props.data",
         data
       )
     );
    // showHideTable(true, dispatch);
    }
  } catch (error) {
    console.log(error);
  }
};

export const getGridDataPublishTender = async (action, state, dispatch,status) => {
  const response = await getPublishTenderGrid(status);
  
  try {
    if (response && response.ResponseBody && response.ResponseBody.length > 0) {


    let data = response.ResponseBody.map(item => ({
       [getTextToLocalMapping("Tender Notice ID")]:item.tenderNoticeId || "-",
       [getTextToLocalMapping("Date")]:item.tenderDate.split(" ")[0] || "-",
       [getTextToLocalMapping("File Number")]:truncData(item.fileNumber) || "-",
       [getTextToLocalMapping("Subject")]:truncData(item.tenderSubject) || "-",
       [getTextToLocalMapping("Department User")]:item.createdByName || "-",
       [getTextToLocalMapping("tenderNoticeUuid")]:item.tenderNoticeUuid || "-",
       [getTextToLocalMapping("tenderNoticeStatus")]:item.tenderNoticeStatus || "-"
       
     }));
    
     dispatch(
       handleField(
         "TenderSearch",
         "components.div.children.publishTenderSearchResults",
         "props.data",
         data
       )
     );
     //showHideTable(true, dispatch);
    }
  } catch (error) {
    console.log(error);
  }
};




// GET EMPLOYEES
export const GetEmployees = async (state, dispatch) => {
  let Emp= get(state.screenConfiguration.preparedFinalObject, "CreateInvite", []);
  let empname = get(state.screenConfiguration.preparedFinalObject, "CreateInvite.employeename", []);
 
  let tenantId = getTenantId();
  
   	console.log(typeof empname)
   let departments = [];
   let departments_query = [];
   
  if(Emp.hasOwnProperty("employeename")===true)
  {
   lSRemoveItem("Invitelist");
   lSRemoveItemlocal("Invitelist");
   lSRemoveItem("InvitelistAll");
   lSRemoveItemlocal("InvitelistAll");
  }
  
   var fetchflag = true;
  //  lSRemoveItem("Invitelist");
	// lSRemoveItemlocal("Invitelist");
	
	departments = localStorageGet('selectedDepartmentsInvite') ? JSON.parse(localStorageGet('selectedDepartmentsInvite')) : "";
  if(departments.length > 0 )	
  {
	
	 departments.map(function(item, index) {
			let temp= item.cat;
			departments_query.push(temp)
		});
  }
  else{
   
    if(empname == "")
    {
       fetchflag = false;
		 dispatch(
              toggleSnackbar(
                true,
                { labelName: "Select Departments!", labelKey: "SELECT_DEPARTMENTS" },
                "warning"
              )
            );
     }        
  }
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: tenantId,
      moduleDetails: [
        {
          moduleName: "common-masters",
          masterDetails: [{ name: "OwnerType" }, { name: "OwnerShipCategory" }]
        },
        {
          moduleName: "PublicRelation",
          masterDetails: [{ name: "BuildingType" }, { name: "PRStations" }]
        },
        {
          moduleName: "egov-location",
          masterDetails: [
            {
              name: "TenantBoundary"
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
        { moduleName: "PublicRelation", masterDetails: [{ name: "Documents" }] }
      ]
    }
  };
  try {
    let payload = null;
	 
	   const queryStr = [
        { key: "departments", value: departments_query.join() },
        { key: "names", value: empname },
		{ key: "tenantId", value: getTenantId() },
      ] 

      if(fetchflag)
    {  
    payload = await httpRequest(
      "post",
      "/egov-hrms/employees/_search",
      "_search",
      queryStr,
      {}
    );
	
   let response = payload.Employees;
	
    if (response) {
    
	 
	 // get department name 
	 let mdmsBody = {
        MdmsCriteria: {
          tenantId:commonConfig.tenantId,
          moduleDetails: [
            {
              moduleName: "RAINMAKER-PR",
              masterDetails: [{ name: "eventType" }, { name: "eventStatus" },{ name: "eventDocuments" },  { name: "eventSector" },]
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
                },
                {
                  name: "Designation"
                }
  
  
                
              ]
            },
          ]
        }
      };
        let payload1 = null;
        payload1 = await httpRequest(
          "post",
          "/egov-mdms-service/v1/_search",
          "_search",
          [],
          mdmsBody
        );
		
        for(let i=0;i<payload1.MdmsRes["common-masters"].Department.length;i++)
        {
          for(let j=0;j<response.length;j++)
          {
		  
    if(response[j].assignments[0].department === payload1.MdmsRes["common-masters"].Department[i].code)
    {
	
      response[j].assignments[0]['DeptName']=payload1.MdmsRes["common-masters"].Department[i].name;
	  
    }
  
          }
			
        }
  
  let selectedrows = []
  let selectedIndexRows=[]
	let allrows = response;
	localStorageSet("gridobjlength", allrows.length)
	allrows.map(item => {
    delete item.user.roles
			selectedrows.push(JSON.stringify(item))
  })
  
	localStorageSet("gridobj",selectedrows);
  let preSelectedRows =JSON.parse(localStorageGet("Invitelist"));
  let preSelectedRowsAll =JSON.parse(localStorageGet("InvitelistAll"));

  if(preSelectedRows!==null)
  {
  console.log('departments_query')

  console.log(departments_query)
	
//   preSelectedRows = preSelectedRows.filter((el) => {
//      return departments_query.includes(el.DepartmentName)

 
// });	
  
console.log('preSelectedRows')
console.log(preSelectedRows)
  }
	
    let data = response.map(item => ({
      [getTextToLocalMapping("Department")]:
         item.assignments[0].DeptName || "-",
       [getTextToLocalMapping("Employee Name")]: (item.user !== null ? item.user.userName : "-") || "-",
       [getTextToLocalMapping("Mobile No")]: (item.user !== null ? item.user.mobileNumber : "-") || "-",
       [getTextToLocalMapping("Email ID")]: (item.user !== null ? item.user.emailId : "-") || "-",
       [getTextToLocalMapping("Employee ID")]: (item.user !== null ? item.user.uuid : "-") || "-",
      
     }));
     if(preSelectedRows!==null){
    
      console.log(typeof(preSelectedRows))
      response.map(function (item, index) {
        if(item.user!=null && item.user.uuid){
      
          preSelectedRows.map(function (commiteeMember,index1) {
          if(commiteeMember[4]===item.user.uuid){
           
            selectedIndexRows.push(index)
            commiteeMember[5]=index
         
            
            
          }
        });

      }
        });
 localStorageSet("Invitelist",JSON.stringify(preSelectedRows))
  
    }
    if(preSelectedRowsAll!==null){
    
      console.log(typeof(preSelectedRowsAll))
      response.map(function (item, index) {
        if(item.user!=null && item.user.uuid){
      
          preSelectedRowsAll.map(function (commiteeMember,index1) {
          if(commiteeMember[4]===item.user.uuid){
           
            selectedIndexRows.push(index)
            commiteeMember[5]=index
         
            
            
          }
        });

      }
        });
 localStorageSet("InvitelistAll",JSON.stringify(preSelectedRowsAll))
 localStorageSet("Invitelist",JSON.stringify(preSelectedRowsAll))

    }
	  dispatch(
       handleField(
         "createInvite",	
		 "components.adhocDialoginternal.children.grid.children.cardContent.children.invireselgrid",
         "props.data",
         data
       )
     );
     dispatch(
      handleField(
        "createInvite",
        "components.adhocDialoginternal.children.grid.children.cardContent.children.invireselgrid",
        "props.options.rowsSelected",
        selectedIndexRows
      )
    );
  }
  else
  {

	dispatch(
              toggleSnackbar(
                true,
                { labelName: "Failed to fetch employees!", labelKey: "FAIL_EMPLOYEE_FETCH" },
                "warning"
              )
            );
  }
}
  }
  catch(e){
	console.log(e);
  }
}
  export const setCommittiee = async (action, state, dispatch,data) => {
  const response = await getCommittiee(data);
 // toTitleCase(response.ResponseBody[0].committeeName)

  try {
    if (response) {
      for(let i=0;i<response.ResponseBody.length;i++)
{
  //toTitleCase(response.ResponseBody[i].committeeName)

  let obj={}
  obj['code']=response.ResponseBody[i].committeeUuid
  obj['name']=toTitleCase(response.ResponseBody[i].committeeName)
  response.ResponseBody[i]=obj
}
     
      dispatch(prepareFinalObject("committieeData", response.ResponseBody));
      
    }
  } catch (error) {
    console.log(error);
  }
};


export const showinvitelist = async (state, dispatch) => {
	
	
let selectedrows = localStorageGet("Invitelist") === null ? localStorageGet("InvitelistAll") :  localStorageGet("Invitelist") ;
   //let selectedrows =[]
   if(localStorageGet("Invitelist") === null  && localStorageGet("InvitelistAll")===null )
   {
    // alert('Select at least one Employee ')
     var msg=`Select at least one Employee`
     dispatch(toggleSnackbar(true, { labelName:msg}, "warning")); 
    
     
   }
   else{
   // selectedrows=localStorageGet("Invitelist")

   
	 selectedrows = JSON.parse(selectedrows);
	
	// Create Payload to Save Internal Guest List
	let tenantId = getTenantId();
	let invitedGuestlist = [];
	var data_result="";
	 let temp = {}
	let invitedGuest = selectedrows.map((item , index)=>{
       invitedGuestlist[index] = {
						"eventGuestType":"INTERNAL",
						"departmentName":item[0],
						"userUuid":"as45a4s5d5as", 
						"pressMasterUuid":"asd5a5as",
						"guestName":item[1],
						"guestEmail":item[3],
						"guestMobile":item[2]
				}
			
     }
	 );
	
	console.log("invitedGuestlistTTTTTTTTTTTTTT");
	 console.log(invitedGuestlist)
	let mdmsBody = {
				"tenantId":tenantId,
				"eventDetailUuid": localStorageGet("eventifforinvitatoin"),
				"moduleCode":localStorageGet("modulecode"),   
				"inviteGuest": invitedGuestlist
	};
	
	 console.log(mdmsBody)
	try {
    let payload = null;
	
  payload = await httpRequest("post", "/prscp-services/v1/invitation/guest/_add", "_add", [], { RequestBody: mdmsBody });
  

	
	if(payload.ResponseInfo.status === "Success")
	{
		
		window.location.reload();
	}
	else
	{
		
		 dispatch(
              toggleSnackbar(
                true,
                { labelName: "Unable to save data", labelKey: "UNABLE_TO_SAVE" },
                "warning"
              )
            );
	}
  } catch (e) {
    console.log(e);
  }
	     
	 dispatch(
       handleField(
         "createInvite",
         "components.div.children.formwizardFirstStep.children.searchInvitedEmployeesResults",
         "props.data",
         data_result
       )
     );
	 
	  dispatch(
       	handleField(
			"createInvite",
			"components.adhocDialoginternal",
			"visible",
			false
		)
      );
	   lSRemoveItem("Invitelist");
	
  lSRemoveItemlocal("Invitelist");
  lSRemoveItem("InvitelistAll");
  lSRemoveItemlocal("InvitelistAll");
  dispatch(prepareFinalObject("CreateInvite", {}));
         }

}	

export const SearchEmployees = async (state, dispatch) => {
	
	 let empname = get(state.screenConfiguration.preparedFinalObject, "CreateInvite.employeename", []);
	  
  if(empname.length > 0)
  {
    GetEmployeebyName(state, dispatch, empname);
  }
  else
  {
   
	dispatch(
              toggleSnackbar(
                true,
                { labelName: "Enter Employee Name", labelKey: "ENTER_EMPLOYEE_NAME" },
                "warning"
              )
            );
  }
	

	
	
}	

export const getSearchResultsView= async (state, dispatch,data) => {
  const response = await getSearchResultsViewEvent(data);
  
  let startdate=response.ResponseBody[0].startDate
  startdate=startdate.split(" ")
  let startdate1=startdate[0]
  startdate1=startdate1.split("-")
  let startdate2=startdate1[1]+'/'+startdate1[2]+'/'+startdate1[0]

  let enddate=response.ResponseBody[0].endDate
  enddate=enddate.split(" ")
  let enddate1=enddate[0]
  enddate1=enddate1.split("-")
  
  let enddate2=enddate1[1]+'/'+enddate1[2]+'/'+enddate1[0]


  let startDate=startdate2+" "+response.ResponseBody[0].startTime
  let endDate=enddate2+" "+response.ResponseBody[0].endTime

let facebookurl=response.ResponseBody[0].facebookUrl
facebookurl="<a>"+facebookurl+"</a>"

  
  response.ResponseBody[0]['newfacebookUrl']=facebookurl
  response.ResponseBody[0]['startDateStartTime']=startDate
  response.ResponseBody[0]['endDateEndTime']=endDate
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: commonConfig.tenantId,
      moduleDetails: [
        {
          moduleName: "RAINMAKER-PR",
          masterDetails: [{ name: "eventType" }, { name: "eventStatus" },{ name: "eventDocuments" },  { name: "eventSector" },, { name: "localityAreaName" }]
        },
       
        // {
        //   moduleName: "tenant",
        //   masterDetails: [
        //     {
        //       name: "tenants"
        //     }
        //   ]
        // },


        // {
        //   moduleName: "tenant",
        //   masterDetails: [
        //     {
        //       name: "tenants"
        //     }
        //   ]
        // },
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
      for(let j=0;j<response.ResponseBody.length;j++)
      {
if(response.ResponseBody[j].organizerDepartmentName===payload.MdmsRes["common-masters"].Department[i].code)
{
  response.ResponseBody[j]['EmpName']=payload.MdmsRes["common-masters"].Department[i].name
}
      }

    }



dispatch(prepareFinalObject("eventDetails", response.ResponseBody));

  let documentsPreview = [];
  
      // Get all documents from response
      let PublicRelation = get(state, "screenConfiguration.preparedFinalObject.eventDetails[0]", {});
      let doc=JSON.parse(PublicRelation.eventString)
   
      let doctitle = [];
      if(doc.length>0)
      {
        for(let i=0; i<doc.length; i++) {
      let eventDoc =  PublicRelation.hasOwnProperty('eventString')?doc[i]['fileStoreId']:''
          doctitle.push(doc[i]['fileName:']);
     
      if (eventDoc !== '' || eventDoc!==undefined) {
        documentsPreview.push({
          title: doc[i]['fileName:'],
          title: doc[i]['fileName:'],
          fileStoreId: eventDoc,
          linkText: "View"
        })
        let fileStoreIds = jp.query(documentsPreview, "$.*.fileStoreId");
        let fileUrls =
          fileStoreIds.length > 0 ? await getFileUrlFromAPI(fileStoreIds) : {};

        documentsPreview = documentsPreview.map(function (doc, index) {
  
              console.log("mappppppppppp");
              console.log(doc)
      doc["link"] = fileUrls && fileUrls[doc.fileStoreId] && fileUrls[doc.fileStoreId].split(",")[0] || "";
      
          return doc;
        });
      }
      }
    }

    
        dispatch(prepareFinalObject("documentsPreview", documentsPreview));
    


	return response;
	
}	
export const getSearchResultsViewLibrary= async (state, dispatch,data) => {
  
  const response = await getSearchResultsViewLI(data);
  
dispatch(prepareFinalObject("library", response.ResponseBody));

  
let documentsPreview1=[];
let documentsPreview2=[];
let documentsPreview3=[];
let documentsPreview4=[];
let documentsPreview5=[]
let documentsPreview6 =[];

      
        // Get all documents from response
        let PublicRelation = get(state, "screenConfiguration.preparedFinalObject.library[0]", {});
    
    

      let buildingDocuments = jp.query(
        PublicRelation,
        "$.documentList.*"
      );
    

      let allDocuments = [
        ...buildingDocuments
      ];
     
          allDocuments.forEach(doc => {
         
      let document={}
 
            let doc1=JSON.parse(doc.fileStoreId)
      let eventDoc =  doc1[0]['fileStoreId'];
      if(doc.documentType=="EVENT.PHOTO_GALLERY_DOCUMENTS"){

        document={
          title: "PR_PHOTO_GALLERY_DOCUMENTS",
          fileStoreId: eventDoc,
          linkText1: "DELETE",
          linkText: "View"
        }

      documentsPreview5.push(document);
      }
else if(doc.documentType=="EVENT.COMMUNICATION_DOCUMENTS"){

  document={
    title: "PR_COMMUNICATION_DOCUMENTS",
    fileStoreId: eventDoc,
    linkText1: "DELETE",
    linkText: "View"
  }

documentsPreview1.push(document);
}
else if(doc.documentType=="EVENT.PRESS_NOTES_DOCUMENTS"){

  document={
    title: "PR_PRESS_NOTES_DOCUMENTS",
    fileStoreId: eventDoc,
    linkText1: "DELETE",
    linkText: "View"
  }

documentsPreview2.push(document);
}
else if(doc.documentType=="EVENT.ADVERTISEMENTS_DOCUMENTS"){

  document={
    title: "PR_ADVERTISEMENTS_DOCUMENTS",
    fileStoreId: eventDoc,
    linkText1: "DELETE",
    linkText: "View"
  }

documentsPreview3.push(document);
}
else if(doc.documentType=="EVENT.NEWS_CLIPPINGS_DOCUMENTS"){

  document={
    title:"PR_NEWS_CLIPPINGS_DOCUMENTS" ,
    fileStoreId: eventDoc,
    linkText1: "DELETE",
    linkText: "View"
  }

documentsPreview4.push(document)
}
else if(doc.documentType=="EVENT.AUDIO_VISUALS_DOCUMENTS"){

  document={
    title: "PR_AUDIO_VISUALS_DOCUMENTS",
    fileStoreId: eventDoc,
    linkText1: "DELETE",
    linkText: "View"
  }

documentsPreview6.push(document);
}
          })
           getfile(documentsPreview1,dispatch,1)
              getfile(documentsPreview2,dispatch,2)
            getfile(documentsPreview3,dispatch,3)
            getfile(documentsPreview4,dispatch,4)
           getfile(documentsPreview5,dispatch,5)
          getfile(documentsPreview6,dispatch,6)


}
export const getSearchResultsViewPressnote= async (state, dispatch,data) => {
  const response = await getSearchResultsViewPressnotedata(data);
 ;
  
 
  
dispatch(prepareFinalObject("ResponseBody", response.ResponseBody));

  
  
  
  let documentsPreview = [];
 

 let PublicRelation = get(
    state,
    "screenConfiguration.preparedFinalObject.ResponseBody[0]",
    {}
  );
  
  
 // let emailcontent = JSON.parse(PublicRelation.emailContent)
  
	localStorageSet("noteContent",PublicRelation.noteContent)
  localStorageSet("noteSubject",PublicRelation.emailContent[0].emailSubject)
  localStorageSet("noteEmailContent",PublicRelation.emailContent[0].emailBody)
  localStorageSet("notesmsContent",PublicRelation.smsContent)

  //let doc=JSON.parse(PublicRelation.documentAttachment)
 // let doc=JSON.parse(PublicRelation.eventString)
  
  let doc=PublicRelation.documentAttachment
console.log(doc.length)

let doctitle = [];
if(doc.length>0)
{
  for(let i=0; i<doc.length; i++) {
let eventDoc = PublicRelation.hasOwnProperty('documentAttachment')?doc[0]['fileStoreId']:''
    doctitle.push(doc[i]['fileName:']);

if (eventDoc !== '' || eventDoc!==undefined) {
  documentsPreview.push({
    title: doc[i]['fileName:'],
  // title: doc[i]['fileName'],
    fileStoreId: eventDoc,
    linkText: "View"
  })
  let fileStoreIds = jp.query(documentsPreview, "$.*.fileStoreId");
  let fileUrls =
    fileStoreIds.length > 0 ? await getFileUrlFromAPI(fileStoreIds) : {};

  documentsPreview = documentsPreview.map(function (doc, index) {

doc["link"] = fileUrls && fileUrls[doc.fileStoreId] && fileUrls[doc.fileStoreId].split(",")[0] || "";

    return doc;
  });
}
}
}


  dispatch(prepareFinalObject("documentsPreview", documentsPreview));


	
}
const getfile= async (documentsPreview1,dispatch,count) =>{
  if(documentsPreview1!= undefined && documentsPreview1.length>0){
    let fileStoreIds= jp.query(documentsPreview1, "$.*.fileStoreId",);

    
  
  if(fileStoreIds){
let fileUrls =
fileStoreIds.length > 0 ? await getFileUrlFromAPI(fileStoreIds) : {};
 documentsPreview1.map((doc, index) => {
doc["link"] =
  (fileUrls &&
    fileUrls[doc.fileStoreId] &&
    fileUrls[doc.fileStoreId].split(",")[0]) ||
  "";
doc["name"] =
  (fileUrls[doc.fileStoreId] &&
    decodeURIComponent(
      fileUrls[doc.fileStoreId]
        .split(",")[0]
        .split("?")[0]
        .split("/")
        .pop()
        .slice(13)
    )) ||
  `Document - ${index + 1}`;

return doc;

});
dispatch(prepareFinalObject("documentsPreview"+count, documentsPreview1));

}
}
}
export const InviteDeleteConfirm = async (data, state, dispatch) => {
  store.dispatch(prepareFinalObject("RowDataForInvite",data));

  showHideAdhocPopupopmsReject(store.getState(), store.dispatch, "createInvite", "pressMaster")

}
// Delete a guest from invitation list grid
export const deleteguestbyid = async ( state, dispatch) => {

 
      let data=get(
        state.screenConfiguration.preparedFinalObject,
        "RowDataForInvite"
      )
  
 
	// if(confirm("Are you sure you want to remove this guest?"))
	// {
		let tenantId = getTenantId();
		let invitedGuestlist = [];
		var data_result="";
			
		let mdmsBody = {
					"tenantId":tenantId,
					"eventDetailUuid": localStorageGet("eventifforinvitatoin"),
					"moduleCode":localStorageGet("modulecode"),   
					 "inviteGuest":[
									 {
										"eventGuestUuid": data[6]
									 }
								   ],
		};
		
		 console.log(mdmsBody)
		try {
		let payload = null;
		
		payload = await httpRequest("post", "/prscp-services/v1/invitation/guest/_delete", "_delete", [], { RequestBody: mdmsBody });
    
		console.log("Payloadddddddddddddddd");
		console.log(payload);
		
		if(payload.ResponseInfo.status === "Success")
		{
			window.location.reload();
		}
		else
		{
			dispatch(
              toggleSnackbar(
                true,
                { labelName: "Unable to Delet Guest", labelKey: "Unable_TO_DELETE_GUEST" },
                "warning"
              )
            );
		}
	
	  } catch (e) {
		console.log(e);
	  }
	// }
	// else{
	// 	return false;
	// }		
}	


// Invite Press InvitePress


export const InvitePress = async (state, dispatch) => {
  
let selectedrows = localStorageGet("selectedPressList");
console.log(selectedrows)
if(selectedrows!=="[]")
{
if(selectedrows!==null)
{
	
  selectedrows = JSON.parse(selectedrows);
	// Create Payload to Save Internal Guest List
	let tenantId = getTenantId();
	let invitedGuestlist = [];
	var data_result="";
	 let temp = {}
	let invitedGuest = selectedrows.map((item , index)=>{
       invitedGuestlist[index] = {
						"eventGuestType":"PRESS",
						"departmentName":item[0],
						"userUuid":"as45a4s5d5as", 
						"pressMasterUuid":item.pressMasterUuid,
						"guestName":item.personnelName,
						"guestEmail":item.email,
						"guestMobile":item.mobile
				}
			
     }
	 );
	

	let mdmsBody = {
				"tenantId":tenantId,
				"eventDetailUuid": localStorageGet("eventifforinvitatoin"),
				"moduleCode":localStorageGet("modulecode"),   
				"inviteGuest": invitedGuestlist
	};
	
	 console.log(mdmsBody)
	try {
    let payload = null;
	
	payload = await httpRequest("post", "/prscp-services/v1/invitation/guest/_add", "_add", [], { RequestBody: mdmsBody });
 
	
	if(payload.ResponseInfo.status === "Success")
	{
			window.location.reload();
	}
	else
	{
	
		dispatch(
              toggleSnackbar(
                true,
                { labelName: "Unable to save data", labelKey: "FAIL_TO_SAVE" },
                "warning"
              )
            );
	}
  } catch (e) {
    console.log(e);
  }
	     
	 dispatch(
       handleField(
         "createInvite",
         "components.div.children.formwizardFirstStep.children.searchInvitedEmployeesResults",
         "props.data",
         data_result
       )
     );
	 
	  dispatch(
       	handleField(
			"createInvite",
			"components.adhocDialoginternal",
			"props.open",
			false
		)
      );
	 
}	
else{
  dispatch(
    toggleSnackbar(
      true,
      { labelName: "Please select all mandatory feilds", labelKey: "PR_RPRESS_GUEST_REQMSG" },
      "warning"
    )
  );
}
}
else{
  dispatch(
    toggleSnackbar(
      true,
      { labelName: "Please select all mandatory feilds", labelKey: "PR_RPRESS_GUEST_REQMSG" },
      "warning"
    )
  );
}
}


// Event List grid data
export const getEventListforInvitation = async (action, state, dispatch) => {
  const response = await getEventGridData();
  try {
    if (response && response.ResponseBody && response.ResponseBody.length > 0) {
     
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
      for(let j=0;j<response.ResponseBody.length;j++)
      {
if(response.ResponseBody[j].organizerDepartmentName===payload.MdmsRes["common-masters"].Department[i].code)
{
  response.ResponseBody[j]['EmpName']=payload.MdmsRes["common-masters"].Department[i].name
}
      }
}
	 
	 	console.log(response);
	const eventarray = response.ResponseBody.filter((el) => {
			return (el.status !== "EXPIRED" && el.eventStatus !== "CANCELLED");
	});	
    let data = eventarray.map(item => ({	
		 
			   [getTextToLocalMapping("Event Id")]:
			  item.eventId || "-",
			  [getTextToLocalMapping("Event Title")]:
        truncData(item.eventTitle) || "-",
			  [getTextToLocalMapping("Organizer Department")]:
			  item.EmpName|| "-",
			  [getTextToLocalMapping("Organizer Employee")]:
			  item.organizerUsernName || "-",
			[getTextToLocalMapping("Date & Time")]:item.startDate.split(" ")[0] +" "+convertTime(item.startTime)+" "+"To"+" "+item.endDate.split(" ")[0] +" "+convertTime(item.endTime) || "-",
		   [getTextToLocalMapping("Schedule Status")]:
			  item.status || "-",
			  [getTextToLocalMapping("Event Status")]:
			  item.eventStatus || "-",
			  [getTextToLocalMapping("Event UUID")]:
			  item.eventDetailUuid || "-",
			  
	  
     }));
     
    
     dispatch(
       handleField(
         "eventList",
         "components.div.children.eventlistforinvitation",
         "props.data",
         data
       )
     );
   

    }
  } catch (error) {
    console.log(error);
  }
}
// Get Invited Guest list for an event 

// Event List grid data
export const getEventInviteeList = async (action, state, dispatch) => {
  const response = await getEventeelistGridData();
  let data_result = '';
  try {
		if(response.ResponseInfo.status === "Success")
		{

      let resultsetdata = response.ResponseBody	
      
      let resultset = resultsetdata.filter((el) => {
        return (el.sentFlag !== true);
    });	
				  data_result = resultset.map(item => ({
		 
		  [getTextToLocalMapping("Guest Type")]:item["eventGuestType"] !== null ? item["eventGuestType"] : "-",
		   [getTextToLocalMapping("Guest Name")]: item["guestName"] !== null ? item["guestName"] : "-",
		   [getTextToLocalMapping("Guest Email")]:item["guestEmail"] !== null ? item["guestEmail"] : "-",
		   [getTextToLocalMapping("Guest Mobile Number")]:item["guestMobile"] !== null ? item["guestMobile"] : "-",
		   [getTextToLocalMapping("Status")]: "Upcoming",	   
		   [getTextToLocalMapping("Guest ID")]:  item["eventGuestUuid"] !== null ? item["eventGuestUuid"] : "-"
		   
		  
		 
			
		
			}));
		}
	}
   catch (error) {
    console.log(error);
  }
  
    localStorageSet("InviteeCount", data_result.length);
   dispatch(
       handleField(
         "createInvite",
         "components.div.children.formwizardFirstStep.children.searchInvitedEmployeesResults",
         "props.data",
         data_result
       )
     );
	 
	 
};


export const getSearchResultsforTenderView= async (state, dispatch,data) => {
  const response = await getSearchResultsForTenderSummary(data);
  set(state, "screenConfiguration.preparedFinalObject.tenderDetails",response.ResponseBody);

  localStorageSet("noteContent", response.ResponseBody[0].noteContent)

  let documentsPreview = [];
  
  let doc=response.ResponseBody[0].tenderDocument[0]['fileStoreId']
 
  if (doc !== '') {
    documentsPreview.push({
      title: "TENDER_DOCUMENT",
      fileStoreId: doc,
      linkText: "View"
    })
    let fileStoreIds = jp.query(documentsPreview, "$.*.fileStoreId");
    let fileUrls =
      fileStoreIds.length > 0 ? await getFileUrlFromAPI(fileStoreIds) : {};
    documentsPreview = documentsPreview.map(function (doc, index) {
  
  doc["link"] = fileUrls && fileUrls[doc.fileStoreId] && fileUrls[doc.fileStoreId].split(",")[0] || "";
  doc['fileUrl']=fileUrls && fileUrls[doc.fileStoreId] && fileUrls[doc.fileStoreId].split(",")[0] || "";
  
      doc["name"] =
        (fileUrls[doc.fileStoreId] &&
          decodeURIComponent(
            fileUrls[doc.fileStoreId]
              .split(",")[0]
              .split("?")[0]
              .split("/")
              .pop()
              .slice(13)
          )) ||
        `Document - ${index + 1}`;


        doc['fileName']=(fileUrls[doc.fileStoreId] &&
          decodeURIComponent(
            fileUrls[doc.fileStoreId]
              .split(",")[0]
              .split("?")[0]
              .split("/")
              .pop()
              .slice(13)
          )) ||
        `Document - ${index + 1}`;
      return doc;
    });
  }
  

 // let PublicRelation = get(state, "screenConfiguration.preparedFinalObject.eventDetails[0]", {});
//   let doc=response.ResponseBody[0].tenderDocument

//   let doctitle = [];
//   if(doc.length>0)
//   {
//     for(let i=0; i<doc.length; i++) {
//   let eventDoc =  doc[i]['fileStoreId']
//       doctitle.push(doc[i]['fileName:']);
 
//   if (eventDoc !== '' || eventDoc!==undefined) {
//     documentsPreview.push({
//       title: doc[i]['fileName:'],
//       title: doc[i]['fileName:'],
//       fileStoreId: eventDoc,
//       linkText: "View"
//     })
//     let fileStoreIds = jp.query(documentsPreview, "$.*.fileStoreId");
//     let fileUrls =
//       fileStoreIds.length > 0 ? await getFileUrlFromAPI(fileStoreIds) : {};

//     documentsPreview = documentsPreview.map(function (doc, index) {

//   doc["link"] = fileUrls && fileUrls[doc.fileStoreId] && fileUrls[doc.fileStoreId].split(",")[0] || "";
//   doc['fileUrl']=fileUrls && fileUrls[doc.fileStoreId] && fileUrls[doc.fileStoreId].split(",")[0] || "";

//       return doc;
//     });
//   }
//   }
// }


    dispatch(prepareFinalObject("documentsPreview", documentsPreview));

    localStorageSet('tenderFilStore',doc)

    dispatch(prepareFinalObject("documentsUploadRedux[0].documents", documentsPreview));
    
    let selectedrows = []
    let allrows = response.ResponseBody[0].publicationList;
    console.log(allrows)
    if(allrows!==null)
    {
    localStorageSet("gridobjlength", allrows.length)
    allrows.map(item => {
        selectedrows.push(JSON.stringify(item))
    })
    localStorageSet("gridobj",selectedrows);
 
    
	 let resenddata = response.ResponseBody[0].publicationList===null?[]:
   response.ResponseBody[0].publicationList.map(item => ({
 
      [getTextToLocalMapping("Publication Name")]:
      truncData(item.publicationName) || "-",
      [ getTextToLocalMapping("Type of the Press")]:
      item.pressType || "-",
      [ getTextToLocalMapping("Personnel Name")]:
      truncData(item.personnelName) || "-",
      [ getTextToLocalMapping("Email Id")]:
      item.email || "-",
      [getTextToLocalMapping("Mobile Number")]:
      item.mobile || "-",
      [getTextToLocalMapping("Event UUID")]:
      item.pressMasterUuid || "-",
      
     }));
   
	 dispatch(
       handleField(
         "tender-Summary-Publish",
         "components.div.children.Resendbody.children.cardContent.children.ResendTenderInviteGrid",
         "props.data",
         resenddata
       )
     );
	
    }
}	

// GET EMPLOYEE Name
export const GetEmployeebyName = async (state, dispatch,empname) => {
  let tenantId = getTenantId();
   	
   
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: tenantId,
      moduleDetails: [
        {
          moduleName: "common-masters",
          masterDetails: [{ name: "OwnerType" }, { name: "OwnerShipCategory" }]
        },
        {
          moduleName: "PublicRelation",
          masterDetails: [{ name: "BuildingType" }, { name: "PRStations" }]
        },
        {
          moduleName: "egov-location",
          masterDetails: [
            {
              name: "TenantBoundary"
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
        { moduleName: "PublicRelation", masterDetails: [{ name: "Documents" }] }
      ]
    }
  };
  try {
    let payload = null;
	 const queryStr = [
        { key: "names", value: empname },
		{ key: "tenantId", value: tenantId }
      ]
    payload = await httpRequest(
      "post",
      "/egov-hrms/employees/_search",
      "_search",
      queryStr,
      {}
    );

   let response = payload.Employees;
	
    if (response) {
    
	 
    let data = response.map(item => ({
      
      [getTextToLocalMapping("Department")]:
         item.assignments[0].department || "-",
       [getTextToLocalMapping("Name")]: (item.user !== null ? item.user.name : "-") || "-",
       [getTextToLocalMapping("Mobile No")]: (item.user !== null ? item.user.mobileNumber : "-") || "-",
       [getTextToLocalMapping("Email ID")]: (item.user !== null ? item.user.emailId : "-") || "-"
       
      
     }));
    
	 
	  dispatch(
       handleField(
         "createInvite",	
		 "components.adhocDialoginternal.children.grid.children.cardContent.children.invireselgrid",
         "props.data",
         data
       )
     );
	 
  }
  else
  {
	
	 dispatch(
              toggleSnackbar(
                true,
                { labelName: "Failed to fetch employees", labelKey: "FAIL_EMPLOYEE_FETCH" },
                "warning"
              )
            );
  }
  }
  catch(e){
	console.log(e);
  }
}

//press masterDetails

export const getPressMasterGridData = async (action, state, dispatch) => {
  const response = await getPressMasterGridData1();
  try {
  
	
	let selectedrows = []
	let allrows = response.ResponseBody;
	localStorageSet("gridobjlength", allrows.length)
	allrows.map(item => {
		selectedrows.push(JSON.stringify(item))
	})
	localStorageSet("gridobj",selectedrows);
	
    if (response && response.ResponseBody && response.ResponseBody.length > 0) {
     
	
    let data = response.ResponseBody.map(item => ({
	  
      [getTextToLocalMapping("Press Id")]:
      item.pressMasterUuid || "-",
      [getTextToLocalMapping("Publication name")]:
      truncData(item.publicationName) || "-",
      [getTextToLocalMapping("Type of the press")]:
      item.pressType || "-",
      [getTextToLocalMapping("Personnel Name")]:
      truncData(item.personnelName) || "-",
      
    
      [getTextToLocalMapping("Email Id")]:
      item.email || "-",
    [getTextToLocalMapping("Mobile No")]:item.mobile || "-",
  
    
     }));
   
     dispatch(
       handleField(
         "pressGrid",
         "components.div.children.pressGrid",
         "props.data",
         data
       )
     );
    
	

    }
  } catch (error) {
    console.log(error);
  }
};








export const getPressMasterSearchResultsView= async (state, dispatch,data) => {
  const response = await getPressMasterSearchResultsViewMain(data);
  
dispatch(prepareFinalObject("pressMasterDetails", response.ResponseBody));
}

export const getSearchResultsforTenderViewBilling= async (state, dispatch,data) => {
  const response = await getSearchResultsForTenderSummary(data);
  
  set(state, "screenConfiguration.preparedFinalObject.tenderDetails",response.ResponseBody);

  
}	






//committee
export const GetCommiteeEmployees = async (state, dispatch,value,id) => {
  let Emp= get(state.screenConfiguration.preparedFinalObject, "CreateInvite", []);
  let empname = get(state.screenConfiguration.preparedFinalObject, "CreateInvite.employeename", []);
 
  let tenantId = getTenantId();
  
   	console.log(typeof empname)
   let departments = [];
   let departments_query = [];
   
  if(Emp.hasOwnProperty("employeename")===true)
  {
   lSRemoveItem("committeelist");
   lSRemoveItemlocal("committeelist");
   lSRemoveItem("committeelistAll");
   lSRemoveItemlocal("committeelistAll");
  }
 
  if(localStorageGet('selectedDepartmentsInvite') !== null && localStorageGet('selectedDepartmentsInvite') !== "[]")	
  {
	departments = JSON.parse(localStorageGet('selectedDepartmentsInvite'));
	 departments.map(function(item, index) {
			let temp= item.cat;
			departments_query.push(temp)
		});
  }
  else{
 //   alert("Select at least one department");
    var msg=`Select at least one department`
     dispatch(toggleSnackbar(true, { labelName:msg}, "warning")); 
    
  }
  
  try {
    let payload = null;
	
	 const queryStr = [
    
      { key: "departments", value: departments_query.join() },
        { key: "names", value: empname },
		{ key: "tenantId", value: getTenantId() },
      ]
    payload = await httpRequest(
      "post",
      "/egov-hrms/employees/_search",
      "_search",
      queryStr,
      {}
    );
	
   let response = payload.Employees;
	
    if (response) {
    
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
              },
              {
                name: "Designation"
              }


              
            ]
          },
        ]
      }
    };
      let payload1 = null;
      payload1 = await httpRequest(
        "post",
        "/egov-mdms-service/v1/_search",
        "_search",
        [],
        mdmsBody
      );
      
  
  
      for(let i=0;i<payload1.MdmsRes["common-masters"].Department.length;i++)
      {
        for(let j=0;j<response.length;j++)
        {
  if(response[j].assignments[0].department===payload1.MdmsRes["common-masters"].Department[i].code)
  {
    response[j].assignments[0]['EmpName']=payload1.MdmsRes["common-masters"].Department[i].name
  }

        }
  
      }


      for(let i=0;i<payload1.MdmsRes["common-masters"].Designation.length;i++)
      {
        for(let j=0;j<response.length;j++)
        {
  if(response[j].assignments[0].designation===payload1.MdmsRes["common-masters"].Designation[i].code)
  {
    response[j].assignments[0]['DesignationName']=payload1.MdmsRes["common-masters"].Designation[i].name
  }
  
        }
  
      }
	  
	  // get grid data
    let selectedrows = []
    let selectedIndexRows=[]
	let allrows = response;
	localStorageSet("gridobjlength", allrows.length)
	allrows.map(item => {
    delete item.user.roles
    
		selectedrows.push(JSON.stringify(item))
	})
	localStorageSet("gridobj",selectedrows);
  let preSelectedRows = 	JSON.parse(localStorageGet("committeelist"));
  let preSelectedRowsAll= 	JSON.parse(localStorageGet("committeelistAll"));

  if(preSelectedRows!==null)
  {
  console.log('departments_query')

  console.log(departments_query)
	
  preSelectedRows = preSelectedRows.filter((el) => {
     return departments_query.includes(el.DepartmentName)

 
});	
  
console.log('preSelectedRows')
console.log(preSelectedRows)
  }

	  
    let data = response.map(item => ({
     
      [getTextToLocalMapping("Department")]:
         item.assignments[0].EmpName || "-",
         [getTextToLocalMapping("Designation")]: item.assignments[0].DesignationName || "-",
       [getTextToLocalMapping("Employee Name")]: (item.user !== null ? item.user.name : "-") || "-",
       [getTextToLocalMapping("Mobile No")]: (item.user !== null ? item.user.mobileNumber : "-") || "-",
       [getTextToLocalMapping("Email ID")]: (item.user !== null ? item.user.emailId : "-") || "-",
       [getTextToLocalMapping("Department Id")]: (item.user !== null ? item.assignments[0].id : "-") || "-",
       [getTextToLocalMapping("Employee ID")]: (item.user !== null ? item.user.uuid : "-") || "-",
       [getTextToLocalMapping("DepartmentName")]:
       item.assignments[0].department || "-",
       
     }));
     if(preSelectedRows!==null){
    
      console.log(typeof(preSelectedRows))
      response.map(function (item, index) {
        if(item.user!=null && item.user.uuid){
      
          preSelectedRows.map(function (commiteeMember,index1) {
          if(commiteeMember['Employee ID']===item.user.uuid){
           
            selectedIndexRows.push(index)
            commiteeMember['index']=index
          //  localStorageSet("committeelist")
            
            
          }
        });

      }
        });
 localStorageSet("committeelist",JSON.stringify(preSelectedRows))
  
    }

    if(preSelectedRowsAll!==null){
    
      console.log(typeof(preSelectedRowsAll))
      response.map(function (item, index) {
        if(item.user!=null && item.user.uuid){
      
          preSelectedRowsAll.map(function (commiteeMember,index1) {
          if(commiteeMember['Employee ID']===item.user.uuid){
           
            selectedIndexRows.push(index)
            commiteeMember['index']=index
          //  localStorageSet("committeelist")
            
            
          }
        });

      }
        });
 localStorageSet("committeelist",JSON.stringify(preSelectedRowsAll))
 localStorageSet("committeelistAll",JSON.stringify(preSelectedRowsAll))

  
    }
	 
     dispatch(
      handleField(
        "createCommitteeMaster",
        "components.div.children.formwizardFirstStep.children.searchDepartmentEmployeesResults_committee.children.cardContent.children.committieegrid",
        "props.data",
        data
      )
    );
    dispatch(
      handleField(
        "createCommitteeMaster",
        "components.div.children.formwizardFirstStep.children.searchDepartmentEmployeesResults_committee.children.cardContent.children.committieegrid",
        "props.options.rowsSelected",
        selectedIndexRows
      )
    );
    return response
   
  }
  else
  {
	alert("Failed to fetch employees")
  }
  }
  catch(e){
	console.log(e);
  }
}


export const SearchCommitteeEmployees = async (state, dispatch) => {
	
	 let empname = get(state.screenConfiguration.preparedFinalObject, "CreateInvite.employeename", []);

	
	GetCommiteeEmployeebyName(state, dispatch, empname);

	
}	


export const GetCommiteeEmployeebyName = async (state, dispatch,empname) => {
  let tenantId = getTenantId();
   
  
  try {
    let payload = null;
	 const queryStr = [
        { key: "names", value: empname },
		{ key: "tenantId", value: tenantId }
      ]
    payload = await httpRequest(
      "post",
      "/egov-hrms/employees/_search",
      "_search",
      queryStr,
      {}
    );
	console.log("payloaddddddddddddd");
	console.log(payload)
   let response = payload.Employees;
	
    if (response) {
    	 
    let data = response.map(item => ({
     
      [getTextToLocalMapping("Department")]:
         item.assignments[0].department || "-",
       [getTextToLocalMapping("Employee Name")]: (item.user !== null ? item.user.name : "-") || "-",
       [getTextToLocalMapping("Mobile No")]: (item.user !== null ? item.user.mobileNumber : "-") || "-",
       [getTextToLocalMapping("Email ID")]: (item.user !== null ? item.user.emailId : "-") || "-",
       
       [getTextToLocalMapping("Department Id")]: (item.user !== null ? item.assignments[0].id : "-") || "-",
       [getTextToLocalMapping("Employee ID")]: (item.user !== null ? item.user.uuid : "-") || "-"
       
     }));
    

   
    
	  dispatch(
      handleField(
        "createCommitteeMaster",
        "components.div.children.formwizardFirstStep.children.searchDepartmentEmployeesResults_committee.children.cardContent.children.committieegrid",
        "props.data",
        data
      )
    );
	 
  }
  else
  {
	alert("Failed to fetch employees")
  }
  }
  catch(e){
	console.log(e);
  }
}


export const getCommitieeGridByIdData = async (action, state, dispatch,payload_committie) => {
  
   const response = await getCommittiee(payload_committie);
 
 for(let i=0;i<response.ResponseBody[0].committeeMember.length;i++)
 {
   if(response.ResponseBody[0].committeeMember[i].userUuid!=='-')
   {
     let empdata1=[{ key: "uuids", value: response.ResponseBody[0].committeeMember[i].userUuid }]
    const responseEmp= await getEmployeeByUUidHRMS(empdata1);
   
     response.ResponseBody[0].committeeMember[i]['Email']=responseEmp.Employees[0].user.emailId
     response.ResponseBody[0].committeeMember[i]['Name']= responseEmp.Employees[0].user.name
     response.ResponseBody[0].committeeMember[i]['Mob']= responseEmp.Employees[0].user.mobileNumber
     response.ResponseBody[0].committeeMember[i]['designation']= responseEmp.Employees[0].assignments[0].designation
   }
   else{
    response.ResponseBody[0].committeeMember[i]['Email']='-'
    response.ResponseBody[0].committeeMember[i]['Name']= '-'
    response.ResponseBody[0].committeeMember[i]['Mob']= '-'
    response.ResponseBody[0].committeeMember[i]['designation']= '-'


   }
 }
 
   try {
     if (response && response.ResponseBody && response.ResponseBody.length > 0) {
      
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
                },
                {
                  name: "Designation"
                }
  
  
                
              ]
            },
          ]
        }
      };
        let payload1 = null;
        payload1 = await httpRequest(
          "post",
          "/egov-mdms-service/v1/_search",
          "_search",
          [],
          mdmsBody
        );
		
        for(let i=0;i<payload1.MdmsRes["common-masters"].Department.length;i++)
        {
          for(let j=0;j<response.ResponseBody[0].committeeMember.length;j++)
          {
    if(response.ResponseBody[0].committeeMember[j].departmentName===payload1.MdmsRes["common-masters"].Department[i].code)
    {
      response.ResponseBody[0].committeeMember[j]['DeptName']=payload1.MdmsRes["common-masters"].Department[i].name
    }
  
          }
    
        }
  
        for(let i=0;i<payload1.MdmsRes["common-masters"].Designation.length;i++)
        {
          for(let j=0;j<response.ResponseBody[0].committeeMember.length;j++)
          {
    if(response.ResponseBody[0].committeeMember[j].designation===payload1.MdmsRes["common-masters"].Designation[i].code)
    {
      response.ResponseBody[0].committeeMember[j]['DesignationName']=payload1.MdmsRes["common-masters"].Designation[i].name
    }
    
          }
    
        }
       let data = response.ResponseBody[0].committeeMember.map(item => ({
       
         [getTextToLocalMapping("Department")]:
            item.DeptName || "-",
           [getTextToLocalMapping("Employee Name")]: (item.Name !== null ? item.Name : "-") || "-",
         [getTextToLocalMapping("Mobile No")]: (item.Mob !== null ? item.Mob : "-") || "-",
           [getTextToLocalMapping("Email ID")]: (item.Email !== null ? item.Email : "-") || "-",
          [getTextToLocalMapping("Department Id")]: (item.departmentUuid  !== null ? item.departmentUuid: "-") || "-",
          [getTextToLocalMapping("Employee ID")]: (item.userUuid !== null ? item.userUuid : "-") || "-",
          [getTextToLocalMapping("Designation")]:
          item.DesignationName || "-",
        }));
        dispatch(
         handleField(
           "committee_summary",
           "components.div.children.body.children.cardContent.children.committeeSummary.children.cardContent.children.cardTwo.props.items[0].item0.children.cardContent.children.applicantContainer.children.grid",
           "props.data",
           data
         )
       );
       dispatch(prepareFinalObject("CommiteeGetData", response.ResponseBody));
       
 
   
   
 
 
     }
   } catch (error) {
     console.log(error);
   }
 };





export const getCommitieeGridData = async (action, state, dispatch) => {
  let payload_committie={
    "tenantId": getTenantId(),
    "RequestBody":{
    
    "committeeUuid": "",
    "committeeName": "",
    "committeeDescription": "",
    "isActive": true,
    "tenantId": getTenantId(),
    "moduleCode": localStorageGet("modulecode"),
    "committeeMember": [ ]
    }
    }
  const response = await getCommittiee(payload_committie);
  try {
    if (response && response.ResponseBody && response.ResponseBody.length > 0) {
     

    let data = response.ResponseBody.map(item => ({
      [getTextToLocalMapping("Committee Id")]:
      item.committeeUuid || "-",
      [getTextToLocalMapping("Committee Name")]:
      truncData(item.committeeName) || "-",
      [getTextToLocalMapping("PR_CREATEDON")]:
      item.createdOn || "-",
      [getTextToLocalMapping("PR_CREATORNAME")]:
      item.creatorName || "-",
      [getTextToLocalMapping("PR_TOTALCOMMITTEEMEMBER")]:
      item.totalCommitteeMember || "-",
     
     }));



     
  
     dispatch(
       handleField(
         "committeeGrid",
         "components.div.children.committeeMasterGrid",
         "props.data",
         data
       )
     );
    
     showHideTable(true, dispatch);
  


    }
  } catch (error) {
    console.log(error);
  }
};



// Invite External Users

export const InviteExternalEmployees = async (state, dispatch, excelid) => {
	let tenantId = getTenantId();
	let mdmsBody = {
				"tenantId":tenantId,
				"eventDetailUuid": localStorageGet("eventifforinvitatoin"),
				"externalFileStoreId":excelid,
				"eventGuestType":"EXTERNAL",
				"moduleCode":localStorageGet("modulecode")  
				
	};

	 console.log(mdmsBody)
	try {
    let payload = null;
	payload = await httpRequest("post", "/prscp-services/v1/invitation/guest/_upload", "_add", [], { RequestBody: mdmsBody });
  
 	
	if(payload.ResponseInfo.status === "Success")
	{
		window.location.reload();
	}
	else
	{
		
		 dispatch(
              toggleSnackbar(
                true,
                { labelName: "Unable to save data", labelKey: "PR_FILE_UNABLE_TO_SAVE" },
                "warning"
              )
            );
	}
  } catch (e) {
    console.log(e);
    dispatch(
      toggleSnackbar(
        true,
        { labelName: "Unable to save data", labelKey: "PR_FILE_UNABLE_TO_SAVE" },
        "warning"
      )
    );
  }  
}  








///////RESEND INVITATION /////////
export const resendinvitationpress = async (state, dispatch, type) => {
  let data1=localStorageGet("ResendInvitelist")
  let data2=localStorageGet("ResendInvitelistAll")
 

  
  if(localStorageGet("ResendInvitelist") !==  null || localStorageGet("ResendInvitelistAll") !==  null)
  {
    

  let response = resendinvitation(state, dispatch, type="press")
  
  }
  else{
    dispatch(
      handleField(
        "pressnote-summary",
        "components.div.children.body.children.cardContent.children.resendbody.children.cardContent.children.guestlist",
        "props.options.rowsSelected",
        []
      ))
		dispatch(
		  toggleSnackbar(
			true,
			{ labelName: "Please Select Employee!", labelKey: "PR_EMPLOYEE_FIELD_MANDATORY" },
			"warning"
		  )
		);
	  }	
}

export const resendinvitationtender = async (state, dispatch, type) => {
  
 if(localStorageGet("ResendInvitelist") !==  null || localStorageGet("ResendInvitelistAll") !==  null  )
    {
		let response = resendinvitation(state, dispatch, type="tender")
	}
	  else{
      dispatch(
        handleField(
          "tender-Summary-Publish",
          "components.div.children.Resendbody.children.cardContent.children.ResendTenderInviteGrid",
          "props.options.rowsSelected",
          []
        ))
		dispatch(
		  toggleSnackbar(
			true,
			{ labelName: "Please Select Employee!", labelKey: "PR_EMPLOYEE_FIELD_MANDATORY" },
			"warning"
		  )
		);
	  }	
}
export const resendinvitationevent = async (state, dispatch, type) => {
  
 
		let response = resendinvitation(state, dispatch, type="event")
	
	  
}
export const resendinvitation = async (state, dispatch, type="event") => {

  
  
  if(localStorageGet("ResendInvitelist")!=="[]" || localStorageGet("ResendInvitelistAll")!==null )
  {
  if(localStorageGet("ResendInvitelist") !==  null || localStorageGet("ResendInvitelistAll") !==  null )
  {
   let selectedrows = ''
   

   if(localStorageGet("ResendInvitelist")!==null ){
    selectedrows = localStorageGet("ResendInvitelist");
 }
 else{
  selectedrows = localStorageGet("ResendInvitelistAll");
 }
	 selectedrows = JSON.parse(selectedrows);
	 
	 console.log("selectedrowwwwwwwwwwwwwwwwwwww");
	 console.log(selectedrows)
	let tenantId = getTenantId();
	let invitedGuestlist = [];
	var data_result="";
	 let temp = {}
 
	 if(type == "event")
	 {
		let invitedGuest = selectedrows.map((item , index)=>{
		   invitedGuestlist[index] = {
							"receiverUuid":item[4],
							"receiverName":item[1],
							"receiverEmail":item[3],
							"receiverMobile":item[2],
					}
				
		 }
		 );
	 }
	 else if(type == "press")
	 {
		let invitedGuest = selectedrows.map((item , index)=>{
		   invitedGuestlist[index] = {
							"receiverUuid":item[5],
							"receiverName":item[2],
							"receiverEmail":item[3],
							"receiverMobile":item[4],
					}
				
		 }
		 );
	 }
	 else
	 {

    console.log('selectedrows')
    console.log(selectedrows)
    
		let invitedGuest = selectedrows.map((item , index)=>{
		   invitedGuestlist[index] = {
					

              "receiverUuid":item[5],
							"receiverName":item[2],
							"receiverEmail":item[3],
							"receiverMobile":item[4],
					}
				
		 }
		 );
	 
	 }
	let mdmsBody = {
				"tenantId":tenantId,
				"moduleCode":localStorageGet("modulecode"),   
				"moduleName":localStorageGet("resendmodule"),
				"invitationUuid":localStorageGet("eventifforinvitatoin"),
				"defaultAll":false,
				"contactDetails":invitedGuestlist
  
	};
		 console.log(mdmsBody)
	try {
    let payload = null;
	payload = await httpRequest("post", "/prscp-services/v1/template/_resend", "_add", [], { RequestBody: mdmsBody });
  	
	if(payload.ResponseInfo.status === "Success")
	{
    dispatch(
      toggleSnackbar(
        true,
        { labelName: "Notifications resent successfully.", labelKey: "PR_RESEND_MSG" },
        "success"
      )
    );
    
    setTimeout(function(){  
		
	
      if(localStorageGet("resendmodule") === "EVENT")
      {

    //    window.location.href= "/egov-pr/eventList";
    dispatch(setRoute(`eventList`))
    
    
	  }	
	  else if(localStorageGet("resendmodule") == "PRESSNOTE")
      {
//        window.location.href = "/egov-pr/pressNoteList";
	dispatch(setRoute(`pressNoteList`))
	  }	
	  else
	  {
      //window.location.href= "/egov-pr/TenderSearch";
		dispatch(setRoute(`TenderSearch`))
	  }	
      
   
  
  }, 1500); 
	}
	else
	{
	
		 dispatch(
              toggleSnackbar(
                true,
                { labelName: "Unable to save data", labelKey: "UNABLE_TO_SAVE" },
                "warning"
              )
            );
	}
  } catch (e) {
    console.log(e);
  }
}	
else{
  dispatch(
    toggleSnackbar(
    true,
    { labelName: "Please Select Employee!", labelKey: "PR_GUEST_FIELD_MANDATORY" },
    "warning"
    )
  );
  }
  }
  else{
    
    if(type!="event"){
      dispatch(
        toggleSnackbar(
        true,
        { labelName: "Please Select Employee!", labelKey: "PR_EMPLOYEE_FIELD_MANDATORY" },
        "warning"
        )
      );
      }	
      else{
        dispatch(
          handleField(
            "event_summary",
            "components.div.children.resendbody.children.cardContent.children.guestlist",
            "props.options.rowsSelected",
            []
          )
        );
    dispatch(
      toggleSnackbar(
      true,
      { labelName: "Please Select Employee!", labelKey: "PR_GUEST_FIELD_MANDATORY" },
      "warning"
      )
    );
  }
}
}
