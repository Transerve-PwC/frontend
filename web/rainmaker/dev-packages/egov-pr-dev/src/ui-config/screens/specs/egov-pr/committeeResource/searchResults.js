import React from "react";
import { Link } from "react-router-dom";
import get from "lodash/get";
import {
  getBreak,
  getCommonCard,
  getCommonContainer,
  getCommonGrayCard,
  getCommonSubHeader,
  getCommonHeader,
  getCommonTitle,
  getSelectField,
  getTextField,
  getDateField,
  getPattern,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  sortByEpoch,
  getEpochForDate,
  getTextToLocalMapping
} from "../../utils";
import {
  getLocalization,
  getTenantId,
  localStorageGet, 
  localStorageSet,
  lSRemoveItemlocal,
  lSRemoveItem
} from "egov-ui-kit/utils/localStorageUtils";
import {
  getLocaleLabels,
  getTransformedLocalStorgaeLabels
} from "egov-ui-framework/ui-utils/commons";
import { prepareFinalObject, handleScreenConfigurationFieldChange as handleField  } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import set from "lodash/set";
import store from "ui-redux/store";
const getLocalTextFromCode = localCode => {
  return JSON.parse(getLocalization("localization_en_IN")).find(
    item => item.code === localCode
  );
};
import {showinvitelist, deleteguestbyid} from "../searchResource/citizenSearchFunctions"




const onRowDelete = async (rowData, allrowdata) => {

	
	deleteguestbyid(rowData)
}


const load_invite_summary = rowData => {
		const reviewUrl = `event_summary?eventId=${rowData[0]}&eventuuId=${rowData[6]}&tenantId=`+getTenantId();
    window.location.href =reviewUrl;
   // dispatch(setRoute(load_invite_summary));
 }

const onAllEmployeeselect = async (rowData, allrowdata,state,dispatch,action) => {

	
		if(rowData.length == localStorageGet("gridobjlength") && allrowdata.length == localStorageGet("gridobjlength"))
		{
			let selectedrows = [];
	
			 let tempdata = localStorageGet("gridobj");
			 console.log(tempdata);
		
			 let tempdata1 = tempdata.split('},{').join('}|{');
			 let tempdata2 = tempdata1.split('|')
					 
				tempdata2.map( (item,index)=> {
				
					console.log((item));
					let temp = JSON.parse(item) 
					 let obj={}
					  obj['Department']= temp.assignments ? temp.assignments[0].EmpName : "-"
					  obj['Designation']=temp.assignments ? temp.assignments[0].DesignationName : "-"
					  obj['Employee Name']= temp.user? temp.user.name : "-"
					  obj['Mobile No']=temp.user ? temp.user.mobileNumber : "-"
					  obj['Email ID']=temp.user ? temp.user.emailId : "-"
					  obj['Department Id']=temp.assignments ? temp.assignments[0].id:"-"
					  obj['Employee ID']=temp.user ? temp.user.uuid : "-"
            obj['DepartmentName']=temp.assignments ? temp.assignments[0].department : "-"
            obj['index']=index
					selectedrows.push(obj)
					
			})
			localStorageSet("committeelistAll", JSON.stringify(selectedrows));	
		}
		else
		{
			if(rowData.length == 0)
			{
				localStorageSet("committeelist","");
			}
			localStorageSet("committeelistAll", "");
			
		}
} 
const onEmployeeselect = async (type, rowData, state,dispatch,action,index,allRowsSelected) => {

	if(type == "cell")
	{
    console.log('cellindex')
    console.log(allRowsSelected)
	}
	else
	{	
    console.log('index')
    console.log(index.dataIndex)
    console.log(allRowsSelected)
		
		let selectedrows = [];
    let localinvdata = localStorageGet("committeelist");
     
var selectedRows1=[]
		console.log("committeelist");
		console.log( localinvdata);
		if(localinvdata === null || localinvdata === "undefined" || localinvdata === "[]")
		{
      let tempAll = JSON.parse(localStorageGet("committeelistAll"));
      
      let checked =false;

if(tempAll!==null)
{
     
      tempAll.map((item,index)=>{
        if(item['Employee ID'] === rowData[6])
        {
          checked=true;
          tempAll.splice(index,1)
          localStorageSet("committeelist", JSON.stringify(tempAll));	
          let selIndex1=[]
          let selIndex= JSON.parse(localStorageGet("committeelist"));
          localStorageSet("committeelistAll", "");
          selIndex.map((item,index)=>{
          
             selIndex1.push(item['index'])	
             
          
           })
           
       store.dispatch(
         handleField(
           "createCommitteeMaster",
           "components.div.children.formwizardFirstStep.children.searchDepartmentEmployeesResults_committee.children.cardContent.children.committieegrid",
           "props.options.rowsSelected",
           selIndex1
         )
       );
        }
        })

      }
if(checked===false){
      let obj={}
       obj['Department']=rowData[0]
      obj['Employee Name']=rowData[2]
      obj['Mobile No']=rowData[3]
      obj['Email ID']=rowData[4]
      obj['Department Id']=rowData[5]
      obj['Employee ID']=rowData[6]
      obj['Designation']=rowData[1]
      obj['DepartmentName']=rowData[7]
      obj['index']=index.dataIndex
      selectedrows.push(obj)
      
    localStorageSet("committeelist", JSON.stringify(selectedrows));
let selIndex1=[]
   let selIndex= JSON.parse(localStorageGet("committeelist"));
   selIndex.map((item,index)=>{
  
      selIndex1.push(item['index'])	
      
   
    })
    
store.dispatch(
  handleField(
    "createCommitteeMaster",
    "components.div.children.formwizardFirstStep.children.searchDepartmentEmployeesResults_committee.children.cardContent.children.committieegrid",
    "props.options.rowsSelected",
    selIndex1
  )
);
    


      let data = selectedrows.map(item => ({
        
        [getTextToLocalMapping("Department")]:
        item.Department || "-",
         [getTextToLocalMapping("Name")]: item['Employee Name'] || "-",
         [getTextToLocalMapping("Mobile No")]: item['Mobile No'] || "-",
         [getTextToLocalMapping("Email ID")]:  item['Email ID'] || "-",
         [getTextToLocalMapping("Department Id")]: item['Department Id'] || "-",
         [getTextToLocalMapping("Employee ID")]:  item['Employee ID'] || "-",
         [getTextToLocalMapping("Designation")]:  item['Designation'] || "-",
         [getTextToLocalMapping("DepartmentName")]:  item['DepartmentName'] || "-"
         
         
       
        
       }));
     
      }  




      
    
      
		}
		else
		{
   
      
console.log('in else')
      let temp = JSON.parse(localStorageGet("committeelist"));
      



  let flag=false;


    
    
      let checked =false;
    temp.map((item,index)=>{
      if(item['Employee ID'] === rowData[6])
      {
        checked=true;
        temp.splice(index,1)
        localStorageSet("committeelist", JSON.stringify(temp));	
        let selIndex1=[]
        let selIndex= JSON.parse(localStorageGet("committeelist"));
        selIndex.map((item,index)=>{
        
           selIndex1.push(item['index'])	
           
        
         })
         
     store.dispatch(
       handleField(
         "createCommitteeMaster",
         "components.div.children.formwizardFirstStep.children.searchDepartmentEmployeesResults_committee.children.cardContent.children.committieegrid",
         "props.options.rowsSelected",
         selIndex1
       )
     );
      }
      })
if(checked===false){
  selectedrows = temp;
  let obj={}
  
  obj['Department']=rowData[0]
  obj['Employee Name']=rowData[2]
  obj['Mobile No']=rowData[3]
  obj['Email ID']=rowData[4]
  obj['Department Id']=rowData[5]
  obj['Employee ID']=rowData[6]
  obj['Designation']=rowData[1]
  obj['DepartmentName']=rowData[7]
  obj['index']=index.dataIndex
  selectedrows.push(obj)
  localStorageSet("committeelist", JSON.stringify(selectedrows));	
  

  let selIndex1=[]
     let selIndex= JSON.parse(localStorageGet("committeelist"));
     selIndex.map((item,index)=>{
     
        selIndex1.push(item['index'])	
        
     
      })
      
  store.dispatch(
    handleField(
      "createCommitteeMaster",
      "components.div.children.formwizardFirstStep.children.searchDepartmentEmployeesResults_committee.children.cardContent.children.committieegrid",
      "props.options.rowsSelected",
      selIndex1
    )
  );
      


}


   console.log(localStorageGet("committeelist"))
    

      let data = selectedrows.map(item => ({
      
        [getTextToLocalMapping("Department")]:
        item.Department || "-",
         [getTextToLocalMapping("Employee Name")]: item['Employee Name'] || "-",
         [getTextToLocalMapping("Mobile No")]: item['Mobile No'] || "-",
         [getTextToLocalMapping("Email ID")]:  item['Email ID'] || "-",
         [getTextToLocalMapping("Department Id")]: item['Department Id'] || "-",
         [getTextToLocalMapping("Employee ID")]:  item['Employee ID'] || "-",
         [getTextToLocalMapping("DepartmentName")]:  item['DepartmentName'] || "-"
         
        
       }));
     
      
     
    
    }	
	}
  
};

 


export const searchDepartmentEmployeesResults = getCommonCard({
   invireselgrid : {
  uiFramework: "custom-molecules",
 
  componentPath: "Table",
  visible: true,
  props: {
   data: [],
    columns: [
      getTextToLocalMapping("Department"),
      getTextToLocalMapping("Employee Name"),
      getTextToLocalMapping("Mobile No"),
      getTextToLocalMapping("Email ID"),
      
     
    ],
    options: {
      filter: false,
      download: false,
      responsive: "stacked",
      selectableRows: true,
	  filterType: 'checkbox',
      hover: true,
    
      
	  selectableRowsHeader : false,
      rowsPerPageOptions: [5, 10, 15, 20],
	  onRowsSelect:(currentRowsSelected , allRowsSelected) =>{
		onEmployeeselect('cell','')
	  },
      onRowClick: (row, index) => {
     
        onEmployeeselect('rowdata',row,dispatch)
      },
	  
	  selectedRows: {
      text: "row(s) selected",
      delete: "Delete",
      deleteAria: "Delete Selected Rows",
    }
	  
	  
    },
    customSortColumn: {
      column: "Application Date",
      sortingFn: (data, i, sortDateOrder) => {
        const epochDates = data.reduce((acc, curr) => {
          acc.push([...curr, getEpochForDate(curr[4], "dayend")]);
          return acc;
        }, []);
        const order = sortDateOrder === "asc" ? true : false;
        const finalData = sortByEpoch(epochDates, !order).map(item => {
          item.pop();
          return item;
        });
        return { data: finalData, currentOrder: !order ? "asc" : "desc" };
      }
    }
  }
}, 
Invite: {
			componentPath: "Button",
			props: {
			  variant: "contained",
			  color: "primary",
			  style: {
			   // minWidth: "200px",
				height: "48px",
				marginRight: "45px"
			  }
			},
			children: {
			  nextButtonLabel: getLabel({
				labelName: "Invite Employees",
				labelKey: "PR_INVITE_EMPLOYEES_BUTTON"
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
			  callBack: (action, state, dispatch) => { showinvitelist(action, state, dispatch) }
			}
		}

});

export const searchInvitedEmployeesResults = {
  uiFramework: "custom-molecules",
  componentPath: "Table",
  visible: true,
  props: {
   data: [],
    columns: [
		getTextToLocalMapping("Guest Type"),
		getTextToLocalMapping("Guest Name"),
		getTextToLocalMapping("Guest Email"),
		getTextToLocalMapping("Guest Mobile Number"),
		getTextToLocalMapping("Status"),
		getTextToLocalMapping("Guest Action"),
		getTextToLocalMapping("Guest ID"),
		
    ],
    options: {
      filter: false,
      download: false,
      responsive: "stacked",
      selectableRows: false,
      
      hover: true,
	  disableToolbarSelect : false,
	  selectableRows: false,
      rowsPerPageOptions: [5, 10, 15, 20],
	 
      onRowClick: (rowsDeleted, data) => {
        onRowDelete(rowsDeleted, data);
      }
    },
    customSortColumn: {
      column: "Application Date",
      sortingFn: (data, i, sortDateOrder) => {
        const epochDates = data.reduce((acc, curr) => {
          acc.push([...curr, getEpochForDate(curr[4], "dayend")]);
          return acc;
        }, []);
        const order = sortDateOrder === "asc" ? true : false;
        const finalData = sortByEpoch(epochDates, !order).map(item => {
          item.pop();
          return item;
        });
        return { data: finalData, currentOrder: !order ? "asc" : "desc" };
      }
    }
  }
};




// List of events to invite guests
export const eventlistforinvitation = {
  uiFramework: "custom-molecules",
  // moduleName: "egov-tradelicence",
  componentPath: "Table",
  visible: true,
  props: {
   data: [],
    columns: [
      getTextToLocalMapping("Event Id"),
      getTextToLocalMapping("Event Title"),
      getTextToLocalMapping("Date & Time"),
	  getTextToLocalMapping("Committee"),
      getTextToLocalMapping("Budget"),
      getTextToLocalMapping("Event Status"),
      getTextToLocalMapping("Event UUID")
    ],
    options: {
      filter: false,
      download: false,
      responsive: "stacked",
      selectableRows: false,
      hover: true,
      
      rowsPerPageOptions: [10, 15, 20],
      onRowClick: (row, index) => {
        load_invite_summary(row);
      }
    },
    customSortColumn: {
      column: "Application Date",
      sortingFn: (data, i, sortDateOrder) => {
        const epochDates = data.reduce((acc, curr) => {
          acc.push([...curr, getEpochForDate(curr[4], "dayend")]);
          return acc;
        }, []);
        const order = sortDateOrder === "asc" ? true : false;
        const finalData = sortByEpoch(epochDates, !order).map(item => {
          item.pop();
          return item;
        });
        return { data: finalData, currentOrder: !order ? "asc" : "desc" };
      }
    }
  }
};

export const searchDepartmentEmployeesResults_committee = getCommonCard({
  header: getCommonTitle(
    {
      labelName: `Select Employee`, 
      labelKey: "PR_SELECT_EMPLOYEE"
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),
  // gridtitle :  getCommonHeader({
  //     labelName: `Select Employee`, 
  //     labelKey: "PR_SELECT_EMPLOYEE"
  //   }),
  committieegrid : {
 uiFramework: "custom-molecules",
 componentPath: "Table",
 visible: true,
 props: {
  data: [],
   columns: [
     getTextToLocalMapping("Department"),
     getTextToLocalMapping("Designation"),
     getTextToLocalMapping("Employee Name"),
     getTextToLocalMapping("Mobile No"),
     getTextToLocalMapping("Email ID"),
     {
      name: getTextToLocalMapping("Department Id"),
      options: {
        display: false,
         filter: false,
          display: "excluded",
        
      }
    },{
      name: getTextToLocalMapping("Employee ID"),
      options: {
        display: false,
        filter: false,
        display: "excluded",
      }
    },
   
    {
      name: getTextToLocalMapping("DepartmentName"),
      options: {
        display: false,
        filter: false,
        display: "excluded",
      
      }
    },

    
   ],
  
   options: {
     filter: false,
     download: false,
     responsive: "stacked",
     selectableRows: true,
     rowsSelected: [],     
     filterType: 'checkbox',
     
     
     hover: true,
	 selectableRowsHeader : true,
	 selectableRowsOnClick : false,
     rowsPerPageOptions: [5, 10, 15, 20],
	onRowsSelect:(currentRowsSelected , allRowsSelected,state,dispatch,action) =>{
    onAllEmployeeselect(currentRowsSelected , allRowsSelected,state,dispatch,action)
  
   },
   customToolbarSelect: () => {},
     onRowClick: (row, index,state,dispatch,action,allRowsSelected) => {
         onEmployeeselect('rowdata',row,state,dispatch,action,index,allRowsSelected)
     },
  
   },
  //  selectedRows: {
  //   text: "row(s) selected",
  //   // delete: "Delete",
  //   // deleteAria: "Delete Selected Rows",
  // },
   customSortColumn: {
     column: "Application Date",
     sortingFn: (data, i, sortDateOrder) => {
       const epochDates = data.reduce((acc, curr) => {
         acc.push([...curr, getEpochForDate(curr[4], "dayend")]);
         return acc;
       }, []);
       const order = sortDateOrder === "asc" ? true : false;
       const finalData = sortByEpoch(epochDates, !order).map(item => {
         item.pop();
         return item;
       });
       return { data: finalData, currentOrder: !order ? "asc" : "desc" };
     }
   }
 }
}, 
committiee_btn: {
     componentPath: "Button",
     visible: false,
     
     props: {
       variant: "contained",
       color: "primary",
       style: {
        // minWidth: "200px",
       height: "48px",
       marginRight: "45px"
       }
     },
     children: {
       nextButtonLabel: getLabel({
       labelName: "Invite Employees",
       labelKey: "PR_INVITE_EMPLOYEES_BUTTON"
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
    
     }
   }

});



export const searchDepartmentEmployeesResults_committee1 = {
  uiFramework: "custom-molecules",
  
  componentPath: "Table",
  visible: true,
  props: {
   data:[],
    columns: [
      getTextToLocalMapping("Department"),
      getTextToLocalMapping("Designation"),
      
      getTextToLocalMapping("Employee Name"),
      getTextToLocalMapping("Mobile No"),
      getTextToLocalMapping("Email ID"),
      {
        name: getTextToLocalMapping("Department Id"),
        options: {
          display: false,
          filter: false,
          display: "excluded",
          
        }
      },{
        name: getTextToLocalMapping("Employee ID"),
        options: {
          display: false,
          filter: false,
          display: "excluded",
         
        }
      },
      

   
    
    ],
  
    options: {
      filter: false,
      download: false,
      responsive: "stacked",
      selectableRows: false,
     
      
      hover: true,
      rowsPerPageOptions: [10, 15, 20],
         
     
    },
    customSortColumn: {
      column: "Application Date",
      sortingFn: (data, i, sortDateOrder) => {
        const epochDates = data.reduce((acc, curr) => {
          acc.push([...curr, getEpochForDate(curr[4], "dayend")]);
          return acc;
        }, []);
        const order = sortDateOrder === "asc" ? true : false;
        const finalData = sortByEpoch(epochDates, !order).map(item => {
          item.pop();
          return item;
        });
        return { data: finalData, currentOrder: !order ? "asc" : "desc" };
      }
    }
  }
};
export const searchDepartmentEmployeesResults_committeeSummary = {
  uiFramework: "custom-molecules",
  
  componentPath: "Table",
  visible: true,
  props: {
    data:[],
    columns: [
      getTextToLocalMapping("Department"),
      getTextToLocalMapping("Designation"),
      
      getTextToLocalMapping("Employee Name"),
      getTextToLocalMapping("Mobile No"),
      getTextToLocalMapping("Email ID"),
      
      
      {
        name: getTextToLocalMapping("Department Id"),
        options: {
          display: false,
          filter: false,
          display: "excluded",
        }
      },{
        name: getTextToLocalMapping("Employee ID"),
        options: {
          display: false,
          filter: false,
          display: "excluded",
        }
      },
      
    ],
    options: {
      filter: false,
      download: false,
      responsive: "stacked",
      selectableRows: false,
      hover: true,
    
      
      rowsPerPageOptions: [10, 15, 20],
       customToolbarSelect: () => {},
      onRowClick: (row, index) => {
       
      }
    },
    customSortColumn: {
      column: "Application Date",
      sortingFn: (data, i, sortDateOrder) => {
        const epochDates = data.reduce((acc, curr) => {
          acc.push([...curr, getEpochForDate(curr[4], "dayend")]);
          return acc;
        }, []);
        const order = sortDateOrder === "asc" ? true : false;
        const finalData = sortByEpoch(epochDates, !order).map(item => {
          item.pop();
          return item;
        });
        return { data: finalData, currentOrder: !order ? "asc" : "desc" };
      }
    }
  }
};
