import React from "react";
import { Link } from "react-router-dom";
import get from "lodash/get";
import {
  sortByEpoch,
  getEpochForDate,
  getTextToLocalMapping
} from "../../utils";
import {
  getLocalization,
  getTenantId,
  localStorageGet,
  getUserInfo
,localStorageSet} from "egov-ui-kit/utils/localStorageUtils";
import {
  getLocaleLabels,
  getTransformedLocalStorgaeLabels
} from "egov-ui-framework/ui-utils/commons";
import {
  getCommonContainer,
  getCommonHeader,
 
  getStepperObject
} from "egov-ui-framework/ui-config/screens/specs/utils";
import "./index.css";
import { prepareFinalObject, handleScreenConfigurationFieldChange as handleField  } from "egov-ui-framework/ui-redux/screen-configuration/actions";

import { getTenderGridData } from "../../../../../ui-utils/commons";
import store from "ui-redux/store";
const state = store.getState();

const getLocalTextFromCode = localCode => {
  return JSON.parse(getLocalization("localization_en_IN")).find(
    item => item.code === localCode
  );
};




export const searchResults = {
  uiFramework: "custom-molecules",
  
  componentPath: "Table",
  visible: true,
  props: {
   data: [],
    columns: [
      getTextToLocalMapping("Event Id"),
      getTextToLocalMapping("Event Title"),
	   {
        name: getTextToLocalMapping("Organizer Department"),
       
      },
      getTextToLocalMapping("Organizer Employee"),
      getTextToLocalMapping("Date & Time"),
      getTextToLocalMapping("Schedule Status"),
      getTextToLocalMapping("Event Status"),
     
      {
        name: getTextToLocalMapping("Event UUID"),
        options: {
          display: false,
          filter: false,
          display: "excluded",
        }
      }
    ],
    options: {
      filter: false,
      download: false,
      responsive: "stacked",
      selectableRows: false,
      hover: true,
      rowsPerPageOptions: [10, 15, 20],
    
     
      onRowClick: (row, index) => {
        onRowClick(row);
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

export const searchResultsPressList = {
  uiFramework: "custom-molecules",
  
  componentPath: "Table",
  visible: true,
  props: {
   data: [],
    columns: [
      getTextToLocalMapping("Date"),
      getTextToLocalMapping("File Number"),
      getTextToLocalMapping("Subject"),
      {
        name: getTextToLocalMapping("Press Note List UUID"),
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
     
      onRowClick: (row, index) => {
        onRowClickpressnote(row);
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

const onAllEmployeeselect = async (rowData, allrowdata,state,dispatch,action) => {

	console.log("SELCT ALL CLICKKKKKKKKKKKKKKKKK Employee");
	console.log(rowData)
  console.log(allrowdata)
  console.log("allrowdata")
	console.log(localStorageGet("gridobj"))
		if(rowData.length == localStorageGet("gridobjlength") && allrowdata.length == localStorageGet("gridobjlength"))
		{
			let selectedrows = [];
			let selectedrows1=[];
					
			 let tempdata = localStorageGet("gridobj");
	//	 console.log(tempdata);
			 let tempdata1 = tempdata.split('},{').join('}|{');
			 let tempdata2 = tempdata1.split('|')
					 
				tempdata2.map( (item,index) => {
					console.log((item));
					let temp = JSON.parse(item) 
					 let obj={}
					 
            obj['Publication Name']= temp.publicationName ? temp.publicationName : "-"
					  obj['Type of the Press']= temp.pressType? temp.pressType : "-"
					  obj['Personnel Name']=temp.personnelName ? temp.personnelName : "-"
					  obj['Email Id']=temp.email ? temp.email : "-"
					  obj['Mobile Number']=temp.mobile ? temp.mobile : "-"
					  obj['Press master UUID']=temp.pressMasterUuid ? temp.pressMasterUuid : "-"
          
					  obj['index']=index
            

					selectedrows.push(obj)
					
			})
			localStorageSet("PressNoteListAll", JSON.stringify(selectedrows));	
		}
		else
		{
			if(rowData.length == 0)
			{
				localStorageSet("PressNoteList","");
			}
			localStorageSet("PressNoteListAll", "");
			
		}
} 

const onEmployeeselect = async (type, rowData, allrowdata,index) => {

	
	if(type == "cell")
	{
		console.log(type);
		console.log("Current" + rowData);
		console.log("All "+allrowdata);
		
		
	}
	else
	{	
    
    console.log(type);
    console.log("Current" + rowData);
		console.log( rowData);
		;
    let selectedrows = [];
    let selectedrows1=[];
		let localinvdata = localStorageGet("PressNoteList");
  	if(localinvdata === null || localinvdata === "undefined" || localinvdata === "[]" )
 // if(selectedrows1.length===0)
		{
      

      let tempAll = JSON.parse(localStorageGet("PressNoteListAll"));
      
      let checked =false;

if(tempAll!==null)
{
     
      tempAll.map((item,index)=>{
        if(item['Press master UUID'] === rowData[5])
        {
          checked=true;
          tempAll.splice(index,1)
          localStorageSet("PressNoteList", JSON.stringify(tempAll));	
          let selIndex1=[]
          let selIndex= JSON.parse(localStorageGet("PressNoteList"));
          localStorageSet("PressNoteListAll","");	
          
          selIndex.map((item,index)=>{
          
             selIndex1.push(item['index'])	
          
           })
           console.log('selectedRows1')
           
           console.log(selIndex1)
       
       console.log('selectedRows1')
       
       store.dispatch(
        handleField(
          "generatepressNote",
          "components.div.children.formwizardFirstStep.children.searchResultsPressMasterList",
          "props.options.rowsSelected",
          selIndex1
        )
      );
    
        }
        })

      }
if(checked===false){



      selectedrows.push(rowData)
      let obj={}
      obj['Publication Name']=rowData[0]
     obj['Type of the Press']=rowData[1]
     obj['Personnel Name']=rowData[2]
     obj['Email Id']=rowData[3]
     obj['Mobile Number']=rowData[4]
     obj['Press master UUID']=rowData[5]
     obj['index']=index.dataIndex
   selectedrows1.push(obj)
   let selIndex1=[]
      localStorageSet("PressNoteList", JSON.stringify(selectedrows1));
      let selIndex= JSON.parse(localStorageGet("PressNoteList"));
      selIndex.map((item,index)=>{
      
         selIndex1.push(item['index'])	
      
       })
       console.log('selectedRows1')
       
       console.log(selIndex1)
   
   console.log('selectedRows1')
   
   store.dispatch(
    handleField(
      "generatepressNote",
      "components.div.children.formwizardFirstStep.children.searchResultsPressMasterList",
      "props.options.rowsSelected",
      selIndex1
    )
   
  );

}
		}
		else
		{
      console.log(JSON.parse(localStorageGet("PressNoteList")))
      let temp = JSON.parse(localStorageGet("PressNoteList"));
      let selectedrows2=selectedrows1
			console.log("temppppppppppppp")
			console.log(temp)
	
      selectedrows.push(rowData)


      let checked =false;
      temp.map((item,index)=>{
        if(item['Press master UUID'] === rowData[5])
        {
          checked=true;
          temp.splice(index,1)
          localStorageSet("PressNoteList", JSON.stringify(temp));	
          let selIndex1=[]
          let selIndex= JSON.parse(localStorageGet("PressNoteList"));
          selIndex.map((item,index)=>{
          
             selIndex1.push(item['index'])	
          
           })
           console.log('selectedRows1')
           
           console.log(selIndex1)
       
       console.log('selectedRows1')
       
       store.dispatch(
        handleField(
          "generatepressNote",
          "components.div.children.formwizardFirstStep.children.searchResultsPressMasterList",
          "props.options.rowsSelected",
          selIndex1
        )
       
      );
    
        }
        })

        if(checked===false){

          selectedrows1 = temp;

      let obj={}
       obj['Publication Name']=rowData[0]
      obj['Type of the Press']=rowData[1]
      obj['Personnel Name']=rowData[2]
      obj['Email Id']=rowData[3]
      obj['Mobile Number']=rowData[4]
    obj['Press master UUID']=rowData[5]
    obj['index']=index.dataIndex
    selectedrows1.push(obj)
      localStorageSet("PressNoteList", JSON.stringify(selectedrows1));	
      let selIndex1=[]
      let selIndex= JSON.parse(localStorageGet("PressNoteList"));
      selIndex.map((item,index)=>{
      
         selIndex1.push(item['index'])	
      
       })
       console.log('selectedRows1')
       
       console.log(selIndex1)
   
   console.log('selectedRows1')
   
   store.dispatch(
    handleField(
      "generatepressNote",
      "components.div.children.formwizardFirstStep.children.searchResultsPressMasterList",
      "props.options.rowsSelected",
      selIndex1
    )
   
  );




        }
    selectedrows1=selectedrows2
    console.log('selectedrows2')
    console.log(selectedrows2)
    }	
    let data1=JSON.parse( localStorageGet("PressNoteList"))
    
	}
  
};

export const searchResultsPressMasterList = {
  uiFramework: "custom-molecules",
  
  componentPath: "Table",
  visible: true,
  props: {
   data: [],
    columns: [
      getTextToLocalMapping("Publication Name"),
      getTextToLocalMapping("Type of the Press"),
      getTextToLocalMapping("Personnel Name"),
      getTextToLocalMapping("Email Id"),
      getTextToLocalMapping("Mobile Number"),
      {
        name: getTextToLocalMapping("Press master UUID"),
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
    filterSelected: [],
    filterType: 'checkbox',
    
    selectToolbarPlacement: "none",
    selectableRowsHeader:true,
    hover: true,
    disableToolbarSelect:false,
	 selectableRowsOnClick : false,
    rowsPerPageOptions: [5, 10, 15, 20],
    onRowsSelect:(currentRowsSelected , allRowsSelected,state,dispatch,action) =>{
    onAllEmployeeselect(currentRowsSelected , allRowsSelected,state,dispatch,action)
    },
    customToolbarSelect: () => {},
    onRowClick: (row, index,state,dispatch,action) => {
    onEmployeeselect('rowdata',row,state,index)
    },
   
   
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


const onAllPressselect = async (rowData, allrowdata,state,dispatch,action) => {

	console.log("SELCT ALL CLICKKKKKKKKKKKKKKKKK Employee");
	console.log(rowData)
	console.log(allrowdata)
	
		if(rowData.length == localStorageGet("gridobjlength") && allrowdata.length == localStorageGet("gridobjlength"))
		{
			let selectedrows = [];
			let selectedrows1=[];
					
			 let tempdata = localStorageGet("gridobj");
		
			 let tempdata1 = tempdata.split('},{').join('}|{');
			 let tempdata2 = tempdata1.split('|')
					 
				tempdata2.map( (item,index) => {
					
					console.log((item));
					let temp = JSON.parse(item) 
					 let obj={}
					 	obj['Publication Name']=temp.publicationName
						obj['Type of the Press']=temp.pressType
						obj['Personnel Name']=temp.personnelName
						obj['Email Id']=temp.email
						obj['Mobile Number']=temp.mobile
						obj['Press master UUID']=temp.pressMasterUuid
            obj['index']=index
            
					selectedrows.push(obj)
					
			})
			localStorageSet("PressTenderListAll", JSON.stringify(selectedrows));	
		}
		else
		{
			if(rowData.length == 0)
			{
				localStorageSet("PressTenderList","");
			}
			localStorageSet("PressTenderListAll", "");
			
		}
} 

const onEmployeeselect1 = async (type, rowData, allrowdata,index) => {

	
	if(type == "cell")
	{
	
	}
	else
	{	
    console.log(type);
    console.log("Current" + rowData);
		console.log( rowData);
		;
    let selectedrows = [];
    let selectedrows1=[];
		let localinvdata = localStorageGet("PressTenderList");
  	if(localinvdata === null || localinvdata === "undefined" || localinvdata === "[]" )

		{
      

      let tempAll = JSON.parse(localStorageGet("PressTenderListAll"));
      
      let checked =false;

if(tempAll!==null)
{
     
      tempAll.map((item,index)=>{
        if(item['Press master UUID'] === rowData[5])
        {
          checked=true;
          tempAll.splice(index,1)
          localStorageSet("PressTenderList", JSON.stringify(tempAll));	
          
      let selIndex1=[]
      let selIndex= JSON.parse(localStorageGet("PressTenderList"));
      localStorageSet("PressTenderListAll", "");
      selIndex.map((item,index)=>{
      
         selIndex1.push(item['index'])	
      
       })
       console.log('selectedRows1')
       
       console.log(selIndex1)
   
   console.log('selectedRows1')
   

   store.dispatch(
    handleField(
      "publishTender",
      "components.div.children.formwizardFirstStep.children.PressMasterListForTender",
      "props.options.rowsSelected",
      selIndex1
    )
   
  );
        }
        })

      }
if(checked===false){
      selectedrows.push(rowData)
      let obj={}
      obj['Publication Name']=rowData[0]
     obj['Type of the Press']=rowData[1]
     obj['Personnel Name']=rowData[2]
     obj['Email Id']=rowData[3]
     obj['Mobile Number']=rowData[4]
     obj['Press master UUID']=rowData[5]
     obj['index']=index.dataIndex
     
   selectedrows1.push(obj)
      localStorageSet("PressTenderList", JSON.stringify(selectedrows1));

      let selIndex1=[]
      let selIndex= JSON.parse(localStorageGet("PressTenderList"));
      selIndex.map((item,index)=>{
      
         selIndex1.push(item['index'])	
      
       })
       console.log('selectedRows1')
       
       console.log(selIndex1)
   
   console.log('selectedRows1')
   

   store.dispatch(
    handleField(
      "publishTender",
      "components.div.children.formwizardFirstStep.children.PressMasterListForTender",
      "props.options.rowsSelected",
      selIndex1
    )
   
  );
}
		}
		else
		{
      console.log(JSON.parse(localStorageGet("PressTenderList")))
      let temp = JSON.parse(localStorageGet("PressTenderList"));
      let selectedrows2=selectedrows1
			console.log("temppppppppppppp")
      console.log(temp)
      
      let checked =false;
      temp.map((item,index)=>{
        if(item['Press master UUID'] === rowData[5])
        {
          checked=true;
          temp.splice(index,1)
          localStorageSet("PressTenderList", JSON.stringify(temp));	

      let selIndex1=[]
      let selIndex= JSON.parse(localStorageGet("PressTenderList"));
      selIndex.map((item,index)=>{
      
         selIndex1.push(item['index'])	
      
       })
       console.log('selectedRows1')
       
       console.log(selIndex1)
   
   console.log('selectedRows1')
   

   store.dispatch(
    handleField(
      "publishTender",
      "components.div.children.formwizardFirstStep.children.PressMasterListForTender",
      "props.options.rowsSelected",
      selIndex1
    )
   
  );
          
        }
        })
  if(checked===false){

			selectedrows1 = temp;
      selectedrows.push(rowData)
      let obj={}
       obj['Publication Name']=rowData[0]
      obj['Type of the Press']=rowData[1]
      obj['Personnel Name']=rowData[2]
      obj['Email Id']=rowData[3]
      obj['Mobile Number']=rowData[4]
    obj['Press master UUID']=rowData[5]
    obj['index']=index.dataIndex
    
    selectedrows1.push(obj)
      localStorageSet("PressTenderList", JSON.stringify(selectedrows1));	

      let selIndex1=[]
      let selIndex= JSON.parse(localStorageGet("PressTenderList"));
      selIndex.map((item,index)=>{
      
         selIndex1.push(item['index'])	
      
       })
       console.log('selectedRows1')
       
       console.log(selIndex1)
   
   console.log('selectedRows1')
   

   store.dispatch(
    handleField(
      "publishTender",
      "components.div.children.formwizardFirstStep.children.PressMasterListForTender",
      "props.options.rowsSelected",
      selIndex1
    )
   
  );
  }
    selectedrows1=selectedrows2
    console.log('selectedrows2')
    console.log(selectedrows2)
    }	
    let data1=JSON.parse( localStorageGet("PressTenderList"))



    let data =data1.map(item => ({

      
      [getTextToLocalMapping("Publication Name")]:
      item['Publication Name'] || "-",
      [ getTextToLocalMapping("Type of the Press")]:
      item['Type of the Press'] || "-",
      [ getTextToLocalMapping("Personnel Name")]:
      item['Personnel Name'] || "-",
      [ getTextToLocalMapping("Email Id")]:
      item['Email Id'] || "-",
      [getTextToLocalMapping("Mobile Number")]:
      item['Mobile Number'] || "-",
      [getTextToLocalMapping("Press master UUID")]:
      item['Press master UUID'] || "-",
    
      
     }));

    
	}
  
};

export const PressMasterListForTender = {
  uiFramework: "custom-molecules",
  
  componentPath: "Table",
  visible: true,
  props: {
   data: [],
    columns: [
      getTextToLocalMapping("Publication Name"),
      getTextToLocalMapping("Type of the Press"),
      getTextToLocalMapping("Personnel Name"),
      getTextToLocalMapping("Email Id"),
      getTextToLocalMapping("Mobile Number"),
      {
        name: getTextToLocalMapping("Press master UUID"),
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
    filterSelected: [],
    filterType: 'checkbox',
   
     selectableRowsHeader : true,
	 selectableRowsOnClick : false,
    rowsPerPageOptions: [5, 10, 15, 20],
    onRowsSelect:(currentRowsSelected , allRowsSelected,state,dispatch,action) =>{
		onAllPressselect(currentRowsSelected , allRowsSelected,state,dispatch,action)
   },
    customToolbarSelect: () => {},
    onRowClick: (row, index,state,dispatch,action) => {
    onEmployeeselect1('rowdata',row,state,index)
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
    
 
 
};
export const searchGridSecondstep = {
  uiFramework: "custom-molecules",
  componentPath: "Table",
  visible: true,
  props: {
    
   data: [],
    columns: [
      getTextToLocalMapping("Publication Name"),
      getTextToLocalMapping("Type of the Press"),
      getTextToLocalMapping("Personnel Name"),
      getTextToLocalMapping("Email Id"),
      getTextToLocalMapping("Mobile Number"),
      {
        name: getTextToLocalMapping("Press master UUID"),
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
    onRowClick: (row, index) => {
    }
  },
  selectedRows: {
    text: "row(s) selectedaaaaaaaaaaaaaaaaa",
    // delete: "Delete",
    // deleteAria: "Delete Selected Rows",
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
const onRowClick = rowData => {
  const page="search"

  
    const reviewUrl = `summary?eventId=${rowData[0]}&eventuuId=${rowData[7]}&page=${page}&status=${rowData[5]}&eventstatus=${rowData[6]}&tenantId=`+getTenantId();
    
    
        window.location.href =reviewUrl;
 
     
  


  
};
export const searchResultsLibrary = {
  uiFramework: "custom-molecules",
  
  componentPath: "Table",
  visible: true,
  props: {
   data: [],
    columns: [
      getTextToLocalMapping("Event Id"),
      getTextToLocalMapping("Event Title"),
      {
        name: getTextToLocalMapping("Organizer Department"),
        
      },
      getTextToLocalMapping("Organizer Employee"),
      getTextToLocalMapping("Date & Time"),
      getTextToLocalMapping("Schedule Status"),
      getTextToLocalMapping("Event Status"),
	   {
        name: getTextToLocalMapping("Event UUID"),
        options: {
          display: false,
          filter: false,
          display: "excluded",
        }
      }
    ],
    options: {
      filter: false,
      download: false,
      responsive: "stacked",
      selectableRows: false,
      hover: true,
    
      rowsPerPageOptions: [10, 15, 20],
      onRowClick: (row, index) => {
        onRowClicklibrary(row);
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
const onRowClicklibrary = rowData => {
  const reviewUrl = `library-summary?eventId=${rowData[0]}&eventuuId=${rowData[7]}&tenantId=`+getTenantId();
window.location.href =reviewUrl;
 
};

const onRowClickpressnote = rowData => {
  const reviewUrl = `pressnote-summary?pressnoteuuId=${rowData[3]}&tenantId=`+getTenantId();
 
 window.location.href =reviewUrl;
 
};

export const searchInviteGuest = {
  uiFramework: "custom-molecules",
  
  componentPath: "Table",
  visible: true,
  props: {
   data: [],
    columns: [
      getTextToLocalMapping("Event Id"),
      getTextToLocalMapping("Date & Time"),
      getTextToLocalMapping("Commitiee"),
      getTextToLocalMapping("Budjet"),
      getTextToLocalMapping("Status"),
     
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



// Invite Summary List 
export const searchResultsinvitesummary = {
  uiFramework: "custom-molecules",
  
  componentPath: "Table",
  visible: true,
  props: {
   data: [],
    columns: [
      getTextToLocalMapping("Guest Name"),
      getTextToLocalMapping("Email"),
      getTextToLocalMapping("Contact No.")
     
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

export const tenderSearchResults = {
  uiFramework: "custom-molecules",
  
  componentPath: "Table",
  visible: true,
  props: {
   data: [],
    columns: [
      getTextToLocalMapping("Tender Notice ID"),
      getTextToLocalMapping("Date"),
      getTextToLocalMapping("File Number"),
      getTextToLocalMapping("Subject")
      

    ],
    options: {
      filter: false,
      download: false,
      responsive: "stacked",
      selectableRows: false,
      hover: true,
    
      rowsPerPageOptions: [10, 15, 20],
       onRowClick: (row, index) => {
         onTenderRowClick(row);
       }
    },
   
  }
};

const onTenderRowClick = rowData => {
      window.location.href = `tender-Summary?applicationNumber=${rowData[0]}&tenantId=${getTenantId()}`;
};

export const billingSearchResults = {
  uiFramework: "custom-molecules",
  
  componentPath: "Table",
  visible: true,
  props: {
   data: [],
    columns: [
      getTextToLocalMapping("Tender Notice ID"),
      getTextToLocalMapping("Publication Name"),
      getTextToLocalMapping("Date"),
      getTextToLocalMapping("File Number"),
      getTextToLocalMapping("Subject"),
      getTextToLocalMapping("Size of Publication")
  

    ],
    options: {
      filter: false,
      download: false,
      responsive: "stacked",
      selectableRows: false,
      hover: true,
      rowsPerPageOptions: [10, 15, 20],
      
    },
    
  }
};

export const publishTenderSearchResults = {
  uiFramework: "custom-molecules",
  
  componentPath: "Table",
  visible: true,
  props: {
   data: [],
    columns: [
      getTextToLocalMapping("Tender Notice ID"),
      getTextToLocalMapping("Date"),
      getTextToLocalMapping("File Number"),
      getTextToLocalMapping("Subject"),
      {
      
      name: getTextToLocalMapping("Department User"),
      options: {
        display: false,
        filter: false,
        display: "excluded",
      
      }
      },
      {
        name: getTextToLocalMapping("tenderNoticeUuid"),
        options: {
          display: false,
          filter: false,
          display: "excluded",
        
        }
      },
      getTextToLocalMapping("tenderNoticeStatus"),
      
    ],
    options: {
      filter: false,
      download: false,
      responsive: "stacked",
      selectableRows: false,
    
      
      hover: true,
      rowsPerPageOptions: [10, 15, 20],
      onRowClick: (row, index) => {
        onPubTenderRowClick(row);
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

const onPubTenderRowClick = rowData => {
 
    window.location.href = `tender-Summary-Publish?tenderId=${rowData[0]}&tenderuuId=${rowData[5]}&Status=${rowData[6]}&tenantId=${getTenantId()}`;
    
 
};


export const pressGrid = {
  uiFramework: "custom-molecules",
  
  componentPath: "Table",
  visible: true,
  props: {
   data: [],
    columns: [
      getTextToLocalMapping("Name"),
      getTextToLocalMapping("Type of the press"),
      getTextToLocalMapping("Publication name"),
      getTextToLocalMapping("Email Id"),
      getTextToLocalMapping("Mobile No"),
      
     
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

export const masterGrid = {
  
  uiFramework: "custom-molecules",
  
  componentPath: "Table",
  visible: true,
  props: {
   data: [],
    columns: [
      getTextToLocalMapping("Publication Name"),
      getTextToLocalMapping("Type of the Press"),
      getTextToLocalMapping("Personnel Name"),
      getTextToLocalMapping("Email Id"),
      getTextToLocalMapping("Mobile Number"),
	  {
        name: getTextToLocalMapping("Event UUID"),
        options: {
          display: false,
          filter: false,
          display: "excluded",
       }
      }
    ],
  
    options: {
      filter: false,
      download: false,
      responsive: "stacked",
      selectableRows: false,
      hover: true,
    
      
      rowsPerPageOptions: [5, 10, 15],
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







export const TimeSeriessearchResults = {
  uiFramework: "custom-molecules",
  
  componentPath: "Table",
  visible: true,
  props: {
   data: [],
    columns: [
      getTextToLocalMapping("Aggregate By Department"),
      getTextToLocalMapping("Year"),
      getTextToLocalMapping("Month"),
      getTextToLocalMapping("Number Events"),
      getTextToLocalMapping("New Events"),
      getTextToLocalMapping("Ongoing Events"),
      getTextToLocalMapping("Closed Events"),
      getTextToLocalMapping("Archived Events"),
    
   
     
    ],
    title: "Time Series Report(Department)",
    
    options: {
      filter: false,
      download: true,
      responsive: "stacked",
      selectableRows: false,
      hover: true,
     
      downloadOptions: {
        filename: "TimeSeriesReport(Department).csv",
        separator: ",",
        filterOptions: {
          useDisplayedColumnsOnly: true,
          useDisplayedRowsOnly: false,
        },
      },
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

export const TimeSeriessearchEventResults = {
  uiFramework: "custom-molecules",
  
  componentPath: "Table",
  visible: false,
  props: {
   data: [],
    columns: [
      getTextToLocalMapping("Aggregate By Event Type"),
      
      getTextToLocalMapping("Year"),
      getTextToLocalMapping("Month"),
      
      getTextToLocalMapping("Number Events"),
      getTextToLocalMapping("New Events"),
      getTextToLocalMapping("Ongoing Events"),
      getTextToLocalMapping("Closed Events"),
      getTextToLocalMapping("Archived Events"),
      
   
     
    ],
    title: "Time Series Report(Event Type)",
    
    options: {
      filter: false,
      download: true,
      responsive: "stacked",
      selectableRows: false,
      hover: true,
      downloadOptions: {
        filename: "TimeSeriesReport(Event Type).csv",
        separator: ",",
        filterOptions: {
          useDisplayedColumnsOnly: true,
          useDisplayedRowsOnly: false,
        },
      },
      
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


export const LocalityReportSearchResults = {
  uiFramework: "custom-molecules",
  componentPath: "Table",
  visible: true,
  props: {
   data: [],
    columns: [
      getTextToLocalMapping("Locality Name"),
      getTextToLocalMapping("Number Events"),
      
      getTextToLocalMapping("New Events"),
      getTextToLocalMapping("Ongoing Events"),
      getTextToLocalMapping("Closed Events"),
      getTextToLocalMapping("Archived Events"),
    

     
    ],
    title: "Locality Wise Report",
    
    options: {
      filter: false,
      download: true,
      responsive: "stacked",
      selectableRows: false,
      hover: true,
      downloadOptions: {
        filename: "LocalityWiseReport.csv",
        separator: ",",
        filterOptions: {
          useDisplayedColumnsOnly: true,
          useDisplayedRowsOnly: false,
        },
      },
      
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




}}




export const EventReportSearchResults = {
  uiFramework: "custom-molecules",
 
  componentPath: "Table",
  visible: true,
  props: {
   data: [],
    columns: [
      getTextToLocalMapping("Department Name"),
      getTextToLocalMapping("New Events"), 
      getTextToLocalMapping("Ongoing Events"),
      
      getTextToLocalMapping("Closed Events"),
      getTextToLocalMapping("Archived Events"),
      getTextToLocalMapping("Number Uploads"),
    
     
    ],
    title: "Events Report",
    
    options: {
      filter: false,
      download: true,
      responsive: "stacked",
      selectableRows: false,
      hover: true,
      downloadOptions: {
        filename: "Eventreport.csv",
        separator: ",",
        filterOptions: {
          useDisplayedColumnsOnly: true,
          useDisplayedRowsOnly: false,
        },
      },
      
      rowsPerPageOptions: [10, 15, 20],
      // onRowClick: (row, index) => {
      //   onRowClick(row);
      // }
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



//  Resend Press Invites

const onPressselectAll = async (type, rowData, allrowdata, currentRowsSelected , allRowsSelected) => {
    
  

  let selectedrows = [];
  let selectedrows1=[];
      
   let tempdata = localStorageGet("gridobj");
   if(allRowsSelected.length == localStorageGet("gridobjlength"))
   {
   let avlData=localStorageGet("ResendInvitelistAll")
   if(avlData)
   {
   	
    localStorageSet("ResendInvitelistAll", "");	
    localStorageSet("ResendInvitelist", "");	
    
   }
  else{
   console.log('Presssssssstempdata');
   console.log(tempdata);
  //  let avlData=localStorageGet("ResendInvitelistAll")
  //  if(avlData)
  //  {
  //   localStorageSet("ResendInvitelistAll", []);	
    
  //  }
  //  else{
  // let tempdata1 = tempdata.split('},{').join('}|');
   let tempdata1 = tempdata.split('},{').join('}|{');
   let tempdata2 = tempdata1.split('|')
       
    tempdata2.map( (item,index) => {
      //console.log("------");
      console.log((item));
      let temp = JSON.parse(item) 
       let obj=[]
        obj[0]= temp.publicationName ? temp.publicationName : "-"
        obj[1]= temp.pressType? temp.pressType : "-"
        obj[2]=temp.personnelName ? temp.personnelName : "-"
        obj[3]=temp.email ? temp.email : "-"
        obj[4]=temp.mobile ? temp.mobile : "-"
        obj[5]=temp.pressMasterUuid ? temp.pressMasterUuid : "-"
        obj[6]=index
      selectedrows.push(obj)

  })
  localStorageSet("ResendInvitelistAll", JSON.stringify(selectedrows));	

   //}

  }
}
  else{
  localStorageSet("ResendInvitelistAll", "");	
  //localStorageSet("ResendInvitelist", "");	
  
  if(allRowsSelected.length == 0)
  {
    localStorageSet("ResendInvitelist", "");
  }
}
}
const onPressselect = async (type, rowData,index) => {


			let selectedrows = [];
      let localinvdata = localStorageGet("ResendInvitelist");
      
			if(localinvdata === null || localinvdata === "undefined" || localinvdata==="[]")
			{


        let tempAll = JSON.parse(localStorageGet("ResendInvitelistAll"));
		
        let checked=false;
		if(tempAll!=null)
        {
        tempAll.map((item,index)=>{
          if(item[5] === rowData[5])
          {
            checked=true;
            tempAll.splice(index,1)
            localStorageSet("ResendInvitelist", JSON.stringify(tempAll));	
            let selIndex1=[]
            let selIndex= JSON.parse(localStorageGet("ResendInvitelist"));
            localStorageSet("ResendInvitelistAll", "");

            selIndex.map((item,index)=>{
            
               selIndex1.push(item[6])	
            
             })
             console.log('selectedRows1')
             
             console.log(selIndex1)
         
         console.log('selectedRows1')
         
         store.dispatch(
          handleField(
            "pressnote-summary",
            "components.div.children.body.children.cardContent.children.resendbody.children.cardContent.children.guestlist",
            "props.options.rowsSelected",
            selIndex1
          )
         
        );
            
          }
          })
		}
    if(checked===false){
				let temp = rowData
        //temp.splice(0, 2,"PRESS");
        temp.push(index.dataIndex)
        
				selectedrows.push(temp)
				console.log("ROwdata 1");
				console.log( selectedrows);
        localStorageSet("ResendInvitelist", JSON.stringify(selectedrows));
        let selIndex1=[]
        let selIndex= JSON.parse(localStorageGet("ResendInvitelist"));
        selIndex.map((item,index)=>{
        
           selIndex1.push(item[6])	
        
         })
         console.log('selectedRows1')
         
         console.log(selIndex1)
     
     console.log('selectedRows1')
     
     store.dispatch(
      handleField(
        "pressnote-summary",
        "components.div.children.body.children.cardContent.children.resendbody.children.cardContent.children.guestlist",
        "props.options.rowsSelected",
        selIndex1
      )
     
    );
    }
			}
			else
			{
				let temp = JSON.parse(localStorageGet("ResendInvitelist"));
				console.log(temp)
        let temp2 = rowData
        temp2.push(index.dataIndex)
     //   temp2=temp2+index
     console.log('index.dataIndex')
     
     console.log(index.dataIndex)
      //  temp2.splice(6, 2,index.rowIndex);
        console.log('temp2222222222222222')
        console.log(temp2)
       
        let checked=false;
        temp.map((item,index)=>{
          if(item[5] === rowData[5])
          {
            checked=true;
            temp.splice(index,1)
            localStorageSet("ResendInvitelist", JSON.stringify(temp));	
            let selIndex1=[]
            let selIndex= JSON.parse(localStorageGet("ResendInvitelist"));
            selIndex.map((item,index)=>{
            
               selIndex1.push(item[6])	
            
             })
             console.log('selectedRows1')
             
             console.log(selIndex1)
         
         console.log('selectedRows1')
         
         store.dispatch(
          handleField(
            "pressnote-summary",
            "components.div.children.body.children.cardContent.children.resendbody.children.cardContent.children.guestlist",
            "props.options.rowsSelected",
            selIndex1
          )
         
        );
            
          }
          })
    if(checked===false){
        temp.push(temp2)
        
				selectedrows = (temp)
				
        localStorageSet("ResendInvitelist", JSON.stringify(selectedrows));	
        let selIndex1=[]
        let selIndex= JSON.parse(localStorageGet("ResendInvitelist"));
        selIndex.map((item,index)=>{
        
           selIndex1.push(item[6])	
        
         })
         console.log('selectedRows1')
         
         console.log(selIndex1)
     
     console.log('selectedRows1')
     
     store.dispatch(
      handleField(
        "pressnote-summary",
        "components.div.children.body.children.cardContent.children.resendbody.children.cardContent.children.guestlist",
        "props.options.rowsSelected",
        selIndex1
      )
     
    );
			}	
    }
		
	
};


export const ResendPressInviteGrid = {
  
  uiFramework: "custom-molecules",
  
  componentPath: "Table",
  visible: true,
  props: {
   data: [],
    columns: [
      getTextToLocalMapping("Publication Name"),
      getTextToLocalMapping("Type of the Press"),
      getTextToLocalMapping("Personnel Name"),
      getTextToLocalMapping("Email Id"),
      getTextToLocalMapping("Mobile Number"),
	  {
        name: getTextToLocalMapping("Event UUID"),
        options: {
          display: false,
          filter: false,
          display: "excluded",
       }
      }
    ],
    options: {
      filter: false,
      download: false,
      responsive: "stacked",
      selectableRows: true,
    
      
      hover: true,
      rowsPerPageOptions: [5, 10, 15],
	  onRowsSelect:(currentRowsSelected , allRowsSelected) =>{
		
		onPressselectAll('cell','','resend',currentRowsSelected , allRowsSelected)
    },
    customToolbarSelect: () => {}	,
	  onRowClick: (row, index) => {
		onPressselect('row',row,index);
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