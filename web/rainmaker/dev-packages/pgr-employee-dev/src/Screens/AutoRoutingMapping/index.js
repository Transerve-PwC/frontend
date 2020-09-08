import React, { Component } from "react";
import { connect } from "react-redux";
import { Screen } from "modules/common";
//import Card from '@material-ui/core/Card';
import { Multiselect } from "multiselect-react-dropdown";
import { Card, TextFieldIcon, TextField,AutoSuggestDropdown,Button } from "components";
import { getTranslatedLabel } from "egov-ui-kit/utils/commons";
import Label from "egov-ui-kit/utils/translationNode";
import { fetchEmployeeToAssign } from "egov-ui-kit/redux/common/actions";
import { handleFieldChange } from "egov-ui-kit/redux/form/actions";
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";
import {   prepareFinalObject  } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { fetchComplaintAutoRouting } from "egov-ui-kit/redux/complaints/actions";
import MultiItemCard from './multiItemCard';
import { httpRequest } from "egov-ui-kit/utils/api";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { result } from "lodash";
class AutoRoutingMapping extends Component {
    constructor(props){
        super(props);
        this.multiselectRef = React.createRef();
       
        this.state = {
            category:"",
            officerlevel1 : [],
            officerlevel2 :[],
            categoriesArr : [],
            sectorArr :[],
            unAllocatedSector:[],
            autoRouting : [{id: new Date().getTime() ,sector:[],employee:""}] ,
            searchResponse: {},
        }
        this.multiDropdownStyle = {
            chips: {
              background: "#FE7A51"
            },
            searchBox: {
              border: "none",
              borderBottom: "1px solid #cccccc",
              borderRadius: "0px",
            },
            multiselectContainer: {
              color: "#FE7A51",
              flex : 1
            },    
          optionListContainer:{
              "position" : "relative !important",
              "z-index" : "99999"
          }
          };

          this.onSelect = this.onSelect.bind(this);
          this.onRemove = this.onRemove.bind(this);
        //  this.onEmployeeChange = this.onEmployeeChange(this);
    }
    componentDidMount = () => {
        let { fetchEmployeeToAssign,fetchComplaintAutoRouting } = this.props;
        const queryParams = [{ key: "roles", value: "PGR_LME" }]; //
        fetchEmployeeToAssign(queryParams);
        fetchComplaintAutoRouting();
      };
    getLocalizedLabel = (label) => {
        const { localizationLabels } = this.props;
        return getTranslatedLabel(label, localizationLabels);
      };
       department = {
        id: "department",
        required: true,
        jsonPath: "services[0].department",
        floatingLabelText: this.getLocalizedLabel("CS_ADDCOMPLAINT_DEPARTMENT"),
        hintText: this.getLocalizedLabel("HR_DEPARTMENT_PLACEHOLDER"),
        errorMessage: this.getLocalizedLabel("HR_DEPARTMENT_PLACEHOLDER"),
        boundary: true,
        dropDownData: [],
        errorStyle: { position: "absolute", bottom: -8, zIndex: 5 },
        errorText: "",
    }
    category = {
      id: "category",
      required: true,
      jsonPath: "services[0].category",
      floatingLabelText: this.getLocalizedLabel("PGR_AUTOROUTE_MAPPING_CATEGORY"),
      hintText: this.getLocalizedLabel("PGR_AUTOROUTE_MAPPING_CATEGORY_PLACEHOLDER"),
      errorMessage: this.getLocalizedLabel("PGR_AUTOROUTE_MAPPING_CATEGORY_PLACEHOLDER"),
      boundary: true,
      dropDownData: [],
      errorStyle: { position: "absolute", bottom: -8, zIndex: 5 },
      errorText: "",
  }
     employee = {
      id: "employee",
      required: true,
      jsonPath: "services[0].employee",
      floatingLabelText: this.getLocalizedLabel("PGR_AUTOROUTE_MAPPING_EMPLOYEE"),
      hintText: this.getLocalizedLabel("PGR_AUTOROUTE_MAPPING_EMPLOYEE_PLACEHOLDER"),
      errorMessage: this.getLocalizedLabel("PGR_AUTOROUTE_MAPPING_EMPLOYEE_PLACEHOLDER"),
      boundary: true,
      dropDownData: [],
      errorStyle: { position: "absolute", bottom: -8, zIndex: 5 },
      errorText: "",
  }

    onSelect(selectedList, selectedItem,prepareFinalObject,officer,autoroute ={}) {  
   
        if(officer === "EO1"){
                this.setState({officerlevel1 : selectedList},()=>{
                  prepareFinalObject("AutoroutingEscalationMap.escalationOfficer1", this.state.officerlevel1);
                })
        }
       else if(officer === "EO2"){
            this.setState({officerlevel2 : selectedList},()=>{
              prepareFinalObject("AutoroutingEscalationMap.escalationOfficer2", this.state.officerlevel2);
            })
        }
        else if(officer === "sector") {
          const unAllocatedSector = this.state.unAllocatedSector;
           const newAutoRoutingArr = this.state.autoRouting.map(data => {
             if(data.id === autoroute.id)
                 data.sector = selectedList;            
            return data;
           })

           let index = unAllocatedSector.findIndex(sec => sec.value === selectedItem.value);
           if (index > -1) {
                 unAllocatedSector.splice(index, 1);
           }
           this.setState({autoRouting : newAutoRoutingArr,unAllocatedSector})
        }
      }
  
      onRemove(selectedList, removedItem,prepareFinalObject,officer,autoroute ={}) {  
         
          if(officer === "EO1"){
              this.setState({officerlevel1 : selectedList},()=>{
                prepareFinalObject("AutoroutingEscalationMap.escalationOfficer1", this.state.officerlevel1);
              })     
          }
          else if(officer === "EO2"){
              this.setState({officerlevel2 : selectedList},()=>{
                prepareFinalObject("AutoroutingEscalationMap.escalationOfficer2", this.state.officerlevel2);
              })
           }
           else if(officer === "sector") {
            const unAllocatedSector = this.state.unAllocatedSector;
            const newAutoRoutingArr = this.state.autoRouting.map(data => {
              if(data.id === autoroute.id)
                  data.sector = selectedList;
             return data;
            })

            let index = unAllocatedSector.findIndex(sec => sec.value === removedItem.value);
            if (index < 0) {
              unAllocatedSector.push(removedItem);
            }
               
            this.setState({autoRouting : newAutoRoutingArr,unAllocatedSector})
         }
    }

    onEmployeeChange = (chosenEmployee,autoroute)=> {
      const newAutoRoutingArr = this.state.autoRouting.map(data => {
        if(data.id === autoroute.id)
            data.employee = chosenEmployee;
       
       return data;
      })
      this.setState({autoRouting : newAutoRoutingArr})

    }

    onDeleteCard = (e , element) => {
      const {autoRouting}  = this.state;
      if(autoRouting.length > 1){
      let filteredAutoRouting = autoRouting.filter( routeObj => routeObj.id !== element.id)
          this.setState({autoRouting : filteredAutoRouting})
      }
    }

    onAddCard = (e) => {
      const {autoRouting} = this.state
      
      this.setState ({autoRouting : [...autoRouting , {id:new Date().getTime(),sector:[],employee:""}]})
    }

    populatingAutoRoutingData = async(category) => {
        const {AutoroutingEscalation} = this.props;
        // api call for fething autRouting
        const queryParams  = [{ key: "tenantId", value: getTenantId() }, { key: "category", value: category.value } ];
        const response = await httpRequest("/rainmaker-pgr/v1/masters/autorouting/_fetch", "_search", queryParams);

        if(response && response.autoroutingmap &&  response.autoroutingmap.autorouting.length>0){
          const rawdata =  response.autoroutingmap.autorouting;
          this.generateActualDataSource(rawdata);
          this.setState({searchResponse : response.autoroutingmap })
        }
      //  const rawdata = Object.values(AutoroutingEscalation).filter(ele => ele.category === category.value);
        
    }

    generateActualDataSource(rawdata){
        const {empDetails,sectors} = this.props;
        if(rawdata){
          let allocatedSectors = [];
          const escalationOfficer1 = rawdata[0].escalationOfficer1.map(code => {
                                        return empDetails.find(emp => emp.value === code)
                                        }).filter(result => result)

          const escalationOfficer2 = rawdata[0].escalationOfficer2.map(code => {
                                        return empDetails.find(emp => emp.value === code)
                                        }).filter(result => result)
                                  
          const autoRouting =   rawdata[0].autoRouting &&  rawdata[0].autoRouting.map((detail,index) => {
            let sectorEmpDetail ={}
            let employee ="";
            sectorEmpDetail.id = new Date().getTime()+index;
                if(detail.Employee && detail.Employee.trim()){
                    employee = empDetails.find(emp => emp.value === detail.Employee)
                }
                if(employee){
                  sectorEmpDetail.employee = employee;
                }else{
                   sectorEmpDetail.employee = {value: "", label: "", dept: ""}
                }

                sectorEmpDetail.sector = detail.Sector.map(code =>{
                  
                   return sectors.find(sec =>{
                     if(sec.value === code){
                      if(!allocatedSectors.includes(code))
                           allocatedSectors.push(code)
                     return sec.value === code
                     }
                   })
                   }).filter(result => result)

                   return sectorEmpDetail;
                
          });

          const unAllocatedSector = sectors.filter(sec => (!allocatedSectors.includes(sec.value)));

          this.setState({officerlevel1 : escalationOfficer1, officerlevel2:escalationOfficer2,autoRouting,unAllocatedSector})
        }
    }

    formValidation = (form) => {
      let isValid = true;

        if(!form.escalationOfficer1.length>0 || !form.escalationOfficer2.length>0 || !form.category){
          isValid = false;
        };

        if(form.autoRouting.length>0 ){
          form.autoRouting.forEach(row => {
              if(!row.Employee || !row.Sector.length>0)
                isValid = false;
          })
        }
      return isValid;
    }

    onSubmit = async(e) => {
     const {officerlevel1,officerlevel2,autoRouting,category} = this.state;
     const { toggleSnackbarAndSetText } = this.props;
     let AutoroutingEscalationMap ={};
     let isDataValid = true;
     let SectorArr =[];
     let duplicateSector =[];
     let sectroErrMsg ="";
        AutoroutingEscalationMap.category = category;
        AutoroutingEscalationMap.escalationOfficer1 = officerlevel1.map(eo => eo.value);
        AutoroutingEscalationMap.escalationOfficer2 = officerlevel2.map(eo => eo.value);
        AutoroutingEscalationMap.autoRouting = autoRouting.map(ar => {
            let autoroute ={};
            autoroute.Employee = ar.employee.value;
            autoroute.Sector = ar.sector.map(sec =>{
              if(!SectorArr.includes(sec.value)){
                SectorArr.push(sec.value)
              }
              else{
                duplicateSector.push(sec.label);
                isDataValid = false;
              }
              return sec.value;
            } );
           
            return autoroute;
        });
        if(duplicateSector.length>1){
          sectroErrMsg = `${duplicateSector.join()}  ${this.getLocalizedLabel("PGR_AUTOROUTE_MAPPINGR_DUPLICATE_SECTOR_MORE")}` 
        }
        else{
          sectroErrMsg = `${duplicateSector.join()}  ${this.getLocalizedLabel("PGR_AUTOROUTE_MAPPINGR_DUPLICATE_SECTOR_ONE")}`
        }

      // form validation 
       const  isFormValid = this.formValidation(AutoroutingEscalationMap);
          
        if(!isDataValid){
          e.preventDefault();
          toggleSnackbarAndSetText(
            true,
            {
              labelName: "Same sector can not be assign to many employee",
              labelKey: sectroErrMsg
            },
            "error"
          );
        }  
        else if(!isFormValid){
          e.preventDefault();
          toggleSnackbarAndSetText(
            true,
            {
              labelName: "Please fill all fields",
              labelKey: "ERR_FILL_ALL_FIELDS"
            },
            "warning"
          );
        }
        else{
          const {searchResponse} = this.state
          let autoroutingmap = {autorouting:{}};
          autoroutingmap.tenantId = getTenantId();
          autoroutingmap.autorouting.active = true;
          autoroutingmap.autorouting.category = AutoroutingEscalationMap.category;
          autoroutingmap.autorouting.autoRouting = AutoroutingEscalationMap.autoRouting;
          autoroutingmap.autorouting.escalationOfficer1 = AutoroutingEscalationMap.escalationOfficer1;
          autoroutingmap.autorouting.escalationOfficer2 = AutoroutingEscalationMap.escalationOfficer2;

          const requestBody = {autoroutingmap}
           //  console.log("requestbody",requestBody )
           try {
          const response = await httpRequest("rainmaker-pgr/v1/masters/autorouting/_update", "_search", [], requestBody);
            if(response){
              window.location.href = "/employee/master/autoRouting-success";
            }
           }
           catch (e) {
            console.log(e);
          }
        }

       
    }

    render() {
        const {departmentName , empDetails ,categories, prepareFinalObject,sectors} = this.props;
        const {officerlevel1,officerlevel2,categoriesArr,sectorArr,autoRouting,category} =this.state;
        return(
            <Screen >
             <Card 
             textChildren={
                 <div>
                <div className="col-sm-6 col-xs-12">
                <AutoSuggestDropdown
                className="fix-for-layout-break"
                fullWidth={true}
                onChange={(chosendepartment, index) => {

                  let filterCategory = categories.filter ( cat => cat.dept === chosendepartment.value);
                    this.setState({categoriesArr : filterCategory ,category:"",officerlevel1:[],officerlevel2:[],unAllocatedSector:[],autoRouting:[{id: new Date().getTime() ,sector:[],employee:""}]})
               //   prepareFinalObject("AutoroutingEscalationMap.category", chosenCity.label);
                }}
                {...this.department}
                floatingLabelText = {this.getLocalizedLabel("CS_ADDCOMPLAINT_DEPARTMENT")}
                hintText={this.getLocalizedLabel("HR_DEPARTMENT_PLACEHOLDER")}
                errorMessage={this.getLocalizedLabel("HR_DEPARTMENT_PLACEHOLDER")}
                dataSource={departmentName}
                />
                </div>
                <div className="col-sm-6 col-xs-12">
                <AutoSuggestDropdown
                className="fix-for-layout-break"
                fullWidth={true}
                onChange={(chosenCategory, index) => {
                  this.setState({category : chosenCategory.value}, () => {
                    this.populatingAutoRoutingData(chosenCategory);
                    prepareFinalObject("AutoroutingEscalationMap.category", chosenCategory.label);
                  })
                
                }}
                {...this.category}
                floatingLabelText={this.getLocalizedLabel("PGR_AUTOROUTE_MAPPING_CATEGORY")}
                hintText={this.getLocalizedLabel("PGR_AUTOROUTE_MAPPING_CATEGORY_PLACEHOLDER")}
                errorMessage={this.getLocalizedLabel("PGR_AUTOROUTE_MAPPING_CATEGORY_PLACEHOLDER")}
                dataSource={categoriesArr}
                value = {category}
                />
                </div>
                <div className="col-sm-6 col-xs-12"></div>
                <div className="col-sm-12 col-md-12 col-xs-12" style={{display:"flex"}} >   
                <Label  label="PGR_AUTOROUTE_MAPPING_ESCALATION_OFFICER1"  fontSize={14}  dark={true} bold={true}  style={{flex: 1}}  />
                <span style={{color:"red",marginTop:4}}>
                  {" "}
                  *
                </span>
                  <Multiselect   
                    options={empDetails}  
                    closeIcon="close"      
                    displayValue="label"       
                    onSelect={(selectedList, selectedItem) => this.onSelect(selectedList, selectedItem,prepareFinalObject,"EO1")}                   
                    onRemove={(selectedList, selectedItem) => this.onRemove(selectedList, selectedItem,prepareFinalObject,"EO1")} 
                    ref={this.multiselectRef}    
                    style={this.multiDropdownStyle}
                    closeIcon={"circle"}     
                    placeholder={ this.getLocalizedLabel("PGR_AUTOROUTE_MAPPING_ESCALATION_OFFICER1_PLACEHOLDER")} 
                    selectedValues={officerlevel1}       
                    avoidHighlightFirstOption             
                   />   
                  </div>   
                  <div className="col-sm-12 col-md-12 col-xs-12" style={{display:"flex"}} >   
                  <Label  label="PGR_AUTOROUTE_MAPPING_ESCALATION_OFFICER2"  fontSize={14}  dark={true} bold={true}  style={{flex: 1}}  />
                  <span style={{color:"red",marginTop:4}}>
                  {" "}
                  *
                 </span>
                  <Multiselect   
                    options={empDetails}  
                    closeIcon="close"      
                    displayValue="label"       
                    onSelect={(selectedList, selectedItem) => this.onSelect(selectedList, selectedItem,prepareFinalObject,"EO2")}                   
                    onRemove={(selectedList, selectedItem) => this.onRemove(selectedList, selectedItem,prepareFinalObject,"EO2")} 
                    ref={this.multiselectRef}    
                    style={this.multiDropdownStyle}
                    closeIcon={"circle"}     
                    placeholder={this.getLocalizedLabel("PGR_AUTOROUTE_MAPPING_ESCALATION_OFFICER2_PLACEHOLDER")} 
                    selectedValues={officerlevel2}       
                    avoidHighlightFirstOption             
                   />   
                  </div>   
                  </div>  
             }
             />
             <MultiItemCard 
                employee ={this.employee}
                empDetails = {empDetails}
                sectors ={sectors}
                sectorArr = {sectorArr}
                multiDropdownStyle={this.multiDropdownStyle}
                handleSelect = {this.onSelect}
                handleRemove = {this.onRemove}
                prepareFinalObject ={prepareFinalObject}
                autoRouting = {autoRouting}
                handleDeleteCard ={this.onDeleteCard}
                handleAddCard ={this.onAddCard}
                multiselectRef={this.multiselectRef}
                handleEmployeeChange = {this.onEmployeeChange}
                getLocalizedLabel={this.getLocalizedLabel} 
              />
              <Card 
                textChildren={
                  <div>
                        <Label  label="Unallocated Sector's"  fontSize={14}  dark={true} bold={true}  style={{flex: 1}}  />
                    <p>{this.state.unAllocatedSector.map(sec =>  sec.label+" , ")}</p>
                  </div>
                }
              />
                <div className="responsive-action-button-cont">
              <Button
                id="sumit-button-autorouting"
                className="responsive-action-button"
                primary={true}
                label={<Label buttonLabel={true} label="CS_COMMON_SUBMIT" />}
                fullWidth={true}
                onClick={(e) => this.onSubmit(e)}
              />
            </div>
    
          </Screen>
        )
    } 
}

const mapStateToProps = state => {
    const { complaints,common } = state;
    const { localizationLabels } = state.app;
    const {complaintDepartment,categoriesById,complaintSector,AutoroutingEscalation} = complaints 
    const {
        departmentById,
        designationsById,
        employeeToAssignById
      } = state.common;
   
      const empDetails =
      employeeToAssignById &&
      Object.values(employeeToAssignById).map((item, index) => {
          const deptCode = item.assignments[0] && item.assignments[0].department;
          const empCode = item.userName;
          const empName = `${item.name} (${item.userName})`;
        return {
                value : empCode,
                label : empName,
                dept : deptCode
        };
      });


   const departmentName = complaintDepartment && Object.values(complaintDepartment).map(dept => {
        let label = dept.name;
        let value = dept.code;
        return {
            label,
            value
        }
    })

    let categories =[];
    if(categoriesById){
      Object.values(categoriesById).forEach(category => {
        let  dept = category.department;
        let value = category.menuPath;
        let label = category.menuPath;
        const cat = {
            dept ,
            value,
            label
        }
          if(!categories.some(item => item.value === cat.value))
               categories.push(cat)
      })
    }

    const sectors = complaintSector && Object.values(complaintSector).map(sec => {
      let label = sec.name;
      let value = sec.code;
      return {
          label,
          value
      }
    })

    return { departmentName,localizationLabels,empDetails,categories,sectors,AutoroutingEscalation };
  };
  
  const mapDispatchToProps = dispatch => {
    return {
          fetchComplaintAutoRouting:() =>
             dispatch(fetchComplaintAutoRouting()),
         fetchEmployeeToAssign: (queryParams, requestBody) =>
             dispatch(fetchEmployeeToAssign(queryParams, requestBody)),
          handleFieldChange: (formKey, fieldKey, value) =>
             dispatch(handleFieldChange(formKey, fieldKey, value)),
          prepareFinalObject: (jsonPath, value) =>
             dispatch(prepareFinalObject(jsonPath, value)),
          toggleSnackbarAndSetText: (open, message, error) =>
             dispatch(toggleSnackbarAndSetText(open, message, error))
      };
  };

export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(AutoRoutingMapping);
  