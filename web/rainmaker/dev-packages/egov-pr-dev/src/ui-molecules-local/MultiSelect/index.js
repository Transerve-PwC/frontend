import React, { Component } from 'react';
import ReactDOM from "react-dom";
//import  MultiSelectReact  from 'multi-select-react';
import get from "lodash/get";
import set from "lodash/set";
import "./styles.css";
import {
  localStorageGet,
  localStorageSet,
  lSRemoveItemlocal,
  lSRemoveItem,
  getTenantId
} from "egov-ui-kit/utils/localStorageUtils";
import { httpRequest } from "../../ui-utils";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { Multiselect } from "multiselect-react-dropdown";

const styles = theme => ({
  root: {
    margin: "16px 8px",
    backgroundColor: theme.palette.background.paper
  }
});


class MultiSelect extends Component {
  constructor(props) {
    super(props);
	
	console.log("propsssssssssssss");
	console.log(props);
    this.state = {
      plainArray: ["Option 1", "Option 2", "Option 3", "Option 4", "Option 5"],
      // objectArray: [
        // { key: "Option 1", cat: "Group 1" },
        // { key: "Option 2", cat: "Group 1" },
        // { key: "Option 3", cat: "Group 1" },
        // { key: "Option 4", cat: "Group 2" },
        // { key: "Option 5", cat: "Group 2" },
        // { key: "Option 6", cat: "Group 2" },
        // { key: "Option 7", cat: "Group 2" }
      // ],
	  objectArray : [],
      selectedValues: []
    };
	
	
    this.style = {
      chips: {
        background: "#FE7A51"
      },
      searchBox: {
        border: "none",
        borderBottom: "1px solid blue",
        borderRadius: "0px",
      },
      multiselectContainer: {
        color: "#FE7A51"
      },    
	optionListContainer:{
		"position" : "relative !important",
		"z-index" : "99999"
	}
	};
    this.addItem = this.addItem.bind(this);
    this.GetDepartments = this.GetDepartments.bind(this);
  }
  
  componentDidMount(){
		this.GetDepartments().then(response => {
		//	alert("Get employees in module")
		
		
    });
    
		
    if(localStorageGet("selectedDepartmentsInvite") !== null)
    {
        let selected = [];
        
      let temp = localStorageGet("selectedDepartmentsInvite") !== null ? JSON.parse(localStorageGet("selectedDepartmentsInvite")) : [];
      selected.push(temp)
      // temp.map(item => {
      //   let key = item.cat
      //   response.map(function(dept, index) {
      //     let tempsel= { key: dept.name, cat: dept.code, active: dept.active }
      //     if(key == dept.code)
      //     {
      //       selected.push(tempsel)
            
      //     }
      //   });
      // });
      
      
      this.setState({
        selectedValues : temp
      });
      
    }
  }
  
  
// Get Departments 
  GetDepartments = async () => {
  let tenantId = getTenantId();
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: tenantId,
      moduleDetails: [
        {
          moduleName: "common-masters",
          masterDetails: [{ name: "Department" }]
        },
        { moduleName: "PublicRelation", masterDetails: [{ name: "Documents" }] }
      ]
    }
  };
  try {
    let payload = null;
	 const queryStr = [
        { key: "moduleName", value: "masters" },
        { key: "tenantId", value: tenantId },
        { key: "masterName", value: "setContentToState" },
      ];
	 
    payload = await httpRequest(
      "post",
      "egov-mdms-service/v1/_search",
      "_search",
      queryStr,
      mdmsBody
    );
    //dispatch(prepareFinalObject("applyScreenMdmsData.departments", payload));
	console.log("Payloadddddddddddddddd");
	console.log(payload);
	let optionvalues = []
	  payload.MdmsRes["common-masters"].Department.map(function(item, index) {
			let temp= { key: item.name, cat: item.code, active: item.active }
			optionvalues.push(temp)
		});
		
		console.log("optionvalues");
		console.log(optionvalues);
	  this.setState({
		objectArray : optionvalues
	  })
	  
	  let id=getQueryArg(window.location.href, "committeeUUID")
		if (id) {	
				this.addItem(payload.MdmsRes["common-masters"].Department);
			}	
  } catch (e) {
    console.log(e);
  }
};
  
  
  
  
  addItem = async (response) => {
  
	console.log("resposee deppppttttttt");
	console.log(response);
	if(localStorageGet("selectedDepartmentsInvite") !== null)
	{
      let selected = [];
      
		let temp = localStorageGet("selectedDepartmentsInvite") !== null ? JSON.parse(localStorageGet("selectedDepartmentsInvite")) : [];
		
		temp.map(item => {
			let key = item.cat
			response.map(function(dept, index) {
				let tempsel= { key: dept.name, cat: dept.code, active: dept.active }
				if(key == dept.code)
				{
					selected.push(tempsel)
					
				}
			});
		});
		
		
		this.setState({
			selectedValues : selected
		});
		
	}
	
  }

	onSelect(selectedList, selectedItem) {
		//alert("selected")
		console.log(selectedList)
		console.log(selectedItem)
		localStorageSet("selectedDepartmentsInvite",JSON.stringify(selectedList))
	}
	 
	onRemove(selectedList, removedItem) {
		//alert("Removed")
		console.log(selectedList)
		console.log(removedItem)
		localStorageSet("selectedDepartmentsInvite",JSON.stringify(selectedList))
	}  

  render() {
   // const { selectedValues } = this.state;
    return (
      <div className="App selectemployeebox col-md-10 col-sm-10 col-xs-12">
        
        {/* <div className="col-xs-12 "> */}
         
          <div className="examples">
            <Multiselect
              options={this.state.objectArray}
              closeIcon="close"
              displayValue="key"
			  onSelect={this.onSelect} // Function will trigger on select event
			  onRemove={this.onRemove} // Function will trigger on remove event
			  style={this.style}
              selectedValues={this.state.selectedValues}
              avoidHighlightFirstOption
              
            />
            
          {/* </div> */}
        </div>
      </div>
    );
  }
 } 

 
export default withStyles(styles)(MultiSelect);
