import {
    getBreak,
    getCommonCard,
    getCommonContainer,
    getCommonGrayCard,
    getCommonTitle,
    getSelectField,
    getTextField,
    getPattern,
    getLabel,
    getCommonParagraph,
    getDateField
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
import { documentsSummary } from "../summaryResource/tenderDocumentsSummary";

  import "./index.css";

  import store from "ui-redux/store";
  import { prepareFinalObject, handleScreenConfigurationFieldChange as handleField  } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  
  
  import { MultipleDocumentDetails} from "./emaildocumentDetails";
  
  

  export const tenderDetails = getCommonCard({
    subHeader: getCommonTitle({
        labelName: "Publish Tender Notice Details",
        labelKey: "PR_PUBLISH_TENDER_NOTICE_DETAILS"
    }),
    
    appStatusAndToFromDateContainer: getCommonContainer({
        
       	  
          sizeOfPublication: {
            ...getTextField({
              label: {
                labelName: "Size Of Publication",
                labelKey: "PR_TENDER_SIZE_OF_PUBLICATION"
              },
              placeholder: {
                labelName: "Size Of Publication",
                labelKey: "PR_TENDER_SIZE_OF_PUBLICATION_PLACEHOLDER"
              },
              pattern: getPattern("fileNumber"),
              errorMessage: "PR_TENDER_SIZE_OF_PUBLICATION_INVALID",
              required: false,
              jsonPath: "tender.publicationsize"
            })
          } 
    })
  });


  
  
  
  
export const EmailSmsContent = getCommonCard({
	

  subjectemail: {
    ...getTextField({
      label: {
        labelName: "Subject",
        labelKey: "PR_EMAIL_Subject"
      },
      placeholder: {
       labelName: "Subject",
        labelKey: "PR_EMAIL_Subject_PLACEHOLDER"
      },
      pattern: getPattern("subjectvalidation"),
      errorMessage: "PR_TENDER_EMAIL_SUBJECT_INVALID",
      required: true,
      jsonPath: "tender.subjectemail",
	   gridDefination: {
          xs: 12,
          sm: 12,
          md: 12
        }
    })
  } ,
	headeremail: getCommonParagraph(
    {
      labelName: "Email Template",
      labelKey: "PR_EMAIL_TEMPLATE"
    },
    {
     style: {
        marginBottom: 20,
		marginTop: 20
      }
    }
  ),
  break: getBreak(),
   break: getBreak(),

  EmailContent: {
     uiFramework: "custom-molecules-local",
          moduleName: "egov-pr",
          componentPath: "RichTextEditor",
          props: { label : "email"}
  },
  break: getBreak(),
  documentsSummary,
    break: getBreak(),
    MultipleDocumentDetails,
    
   break: getBreak(),
   headersms: getCommonParagraph(
    {
      labelName: "SMS Template",
      labelKey: "PR_SMS_TEMPLATE"
    },
    {
      style: {
        marginBottom: 20,
		marginTop: 20
      }
    }
  ),
  break: getBreak(),
   break: getBreak(),
   
  // SMSContent: {
     // uiFramework: "custom-molecules-local",
          // moduleName: "egov-pr",
          // componentPath: "RichTextEditor",
          // props: { label : "sms"}
  // },
  SMSContent: {
    ...getTextField({
      label: {
        labelName: "SMS Template",
        labelKey: "PR_SMS_TEMPLATE"
      },
     
      pattern:getPattern("subjectvalidation"),
      errorMessage: "PR_SMS_INVALID",
      required: true,
      jsonPath: "tender.SMSContent",
      props:{
        className:"textfield-enterable-selection",
        multiline: true,
        rows: "4"
      },
	   gridDefination: {
          xs: 12,
          sm: 12,
          md: 12
        }
    })
  }
  });  


//  Resend Tender Invites

const onPressselectAll = async (type, rowData, allrowdata, currentRowsSelected , allRowsSelected) => {

	
  if(allRowsSelected.length == localStorageGet("gridobjlength"))
  {
			let selectedrows = [];
			let selectedrows1=[];
					
			 let tempdata = localStorageGet("gridobj");
       let avlData=localStorageGet("ResendInvitelistAll")
       if(avlData)
       {
        localStorageSet("ResendInvitelistAll", "");	
       localStorageSet("ResendInvitelist", "");	
        
       }
      else{
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
    }
  }
		else
		{
			if(allRowsSelected.length == 0)
			{
				localStorageSet("ResendInvitelist","");
			}
			localStorageSet("ResendInvitelistAll", "");
			
		}

}
const onPressselect = async (type, rowData, allrowdata, index) => {

	
	if(allrowdata == "resend")
	{
		
		if(type == "cell")
		{
			
			//console.log(type);
			//console.log("Current" + rowData);
			//console.log("All "+allrowdata);
		}
		else
		{	
			
			console.log(type);
			console.log( rowData);
			;
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
                "tender-Summary-Publish",
                "components.div.children.Resendbody.children.cardContent.children.ResendTenderInviteGrid",
                "props.options.rowsSelected",
                selIndex1
              )
             
            );
                
              }
              })
            }
              if(checked===false){
                let temp = rowData
                temp.push(index.dataIndex)
                
				selectedrows.push(temp)
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
        "tender-Summary-Publish",
        "components.div.children.Resendbody.children.cardContent.children.ResendTenderInviteGrid",
        "props.options.rowsSelected",
        selIndex1
      )
     
    );
              }
			}
			else
			{
        let temp = JSON.parse(localStorageGet("ResendInvitelist"));
        let temp2 = rowData
        temp2.push(index.dataIndex)
        				console.log("temppppppppppppp")
        console.log(temp)
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
            "tender-Summary-Publish",
            "components.div.children.Resendbody.children.cardContent.children.ResendTenderInviteGrid",
            "props.options.rowsSelected",
            selIndex1
          )
         
        );
          }
          })
    if(checked===false){
      //   selectedrows = temp;
      //   let temp2=rowData
      //  temp2.push(index.rowIndex)
        
      //   selectedrows.push(temp2)
// 

//         selectedrows = temp;
// 				selectedrows.push(temp)

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
        "tender-Summary-Publish",
        "components.div.children.Resendbody.children.cardContent.children.ResendTenderInviteGrid",
        "props.options.rowsSelected",
        selIndex1
      )
     
    );	
    }
			}	
		}
	}
	else
	{
		if(type == "cell")
		{
			//console.log(type);
			//console.log("Current" + rowData);
			//console.log("All "+allrowdata);
		}
		else
		{	
			console.log(type);
			console.log( rowData);
			;
			let selectedrows = [];
			let localinvdata = localStorageGet("ResendInvitelist");
			if(localinvdata === null || localinvdata === "undefined")
			{

        let tempAll = JSON.parse(localStorageGet("ResendInvitelistAll"));
		
        let checked=false;
        tempAll.map((item,index)=>{
          if(item[5] === rowData[5])
          {
            checked=true;
            tempAll.splice(index,1)
            localStorageSet("ResendInvitelist", JSON.stringify(tempAll));	
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
            "tender-Summary-Publish",
            "components.div.children.Resendbody.children.cardContent.children.ResendTenderInviteGrid",
            "props.options.rowsSelected",
            selIndex1
          )
         
        );
          }
          })
          if(checked===false){
let temp=rowData
            temp.push(index.dataIndex)
				selectedrows.push(rowData)

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
        "tender-Summary-Publish",
        "components.div.children.Resendbody.children.cardContent.children.ResendTenderInviteGrid",
        "props.options.rowsSelected",
        selIndex1
      )
     
    );
          }
			}
			else
			{
        let temp = JSON.parse(localStorageGet("ResendInvitelist"));
        temp.push(index.dataIndex)
				console.log("temppppppppppppp")
        console.log(temp)
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
            "tender-Summary-Publish",
            "components.div.children.Resendbody.children.cardContent.children.ResendTenderInviteGrid",
            "props.options.rowsSelected",
            selIndex1
          )
         
        );
          }
          })
          if(checked===false){
				selectedrows = temp;
				selectedrows.push(temp)
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
        "tender-Summary-Publish",
        "components.div.children.Resendbody.children.cardContent.children.ResendTenderInviteGrid",
        "props.options.rowsSelected",
        selIndex1
      )
     
    );
          }	
			}	
		}
	}
	
};

export const ResendTenderInviteGrid = {
  
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
       selectableRowsHeader : true,
       
	// disableToolbarSelect : true,
	 selectableRowsOnClick : false,
      rowsPerPageOptions: [5, 10, 15],
	  onRowsSelect:(currentRowsSelected , allRowsSelected,state,dispatch,action) =>{
		
		onPressselectAll('cell','','resend',currentRowsSelected , allRowsSelected)
    },
    customToolbarSelect: () => {},
	  onRowClick: (row, index) => {
	    
		onPressselect('rowdata',row,"resend",index)
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