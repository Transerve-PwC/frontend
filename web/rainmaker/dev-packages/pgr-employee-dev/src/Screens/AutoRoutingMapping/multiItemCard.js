import React from 'react';
import { Multiselect } from "multiselect-react-dropdown";
import { Card, TextFieldIcon, TextField,AutoSuggestDropdown } from "components";
import { getTranslatedLabel } from "egov-ui-kit/utils/commons";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
import Label from "egov-ui-kit/utils/translationNode";
const MultiItemCard = (props) => {

        const {employee,empDetails,multiDropdownStyle,sectors,sectorArr,handleSelect,handleRemove,prepareFinalObject,handleDeleteCard,handleAddCard,autoRouting,multiselectRef,handleEmployeeChange,getLocalizedLabel} = props;
    console.log("autoRouting",autoRouting)
    return(
        <div>
            {autoRouting && autoRouting.map( (item , index) => {

           return ( <Card 
             textChildren={
                 <div>  
                        <div xs={12} align="right">
                          <IconButton
                            style={{
                              width: "40px",
                              height: "40px"
                            }}
                            onClick={e => handleDeleteCard(e, item)}
                            aria-label="Remove"
                          >
                              <Icon>
                           <i class="material-icons">clear</i>
                           </Icon>
                          </IconButton>
                        </div>
                    <div className="row" xs={12}>
                <div className="col-sm-6 col-xs-12">
                <AutoSuggestDropdown
                className="fix-for-layout-break"
                fullWidth={true}
                onChange={(chosenEmployee, index) => {
                        handleEmployeeChange(chosenEmployee,item)
                }}
                {...employee}
                dataSource={empDetails}
                floatingLabelText={getLocalizedLabel("PGR_AUTOROUTE_MAPPING_EMPLOYEE")}
                hintText={getLocalizedLabel("PGR_AUTOROUTE_MAPPING_EMPLOYEE_PLACEHOLDER")}
                errorMessage={getLocalizedLabel("PGR_AUTOROUTE_MAPPING_EMPLOYEE_PLACEHOLDER")}
                value = {item.employee.label}
                />
                </div>
                <div  className="col-sm-12 col-md-12 col-xs-12" style={{display:"flex"}}>
                <Label  label="PGR_AUTOROUTE_MAPPING_SECTOR"  fontSize={14}  dark={true} bold={true}  style={{flex: 1}}  />
                  <span style={{color:"red",marginTop:4}}>
                  {" "}
                  *
                 </span>
                </div>
                <div className="col-sm-12 col-md-12 col-xs-12" >   
                  <Multiselect   
                    options={sectors}  
                    closeIcon="close"      
                    displayValue="label"       
                    onSelect={(selectedList, selectedItem) => handleSelect(selectedList, selectedItem,prepareFinalObject,"sector",item)}                   
                    onRemove={(selectedList, selectedItem) => handleRemove(selectedList, selectedItem,prepareFinalObject,"sector",item)} 
                    ref={multiselectRef}    
                    style={multiDropdownStyle}
                    closeIcon={"circle"}     
                    placeholder={getLocalizedLabel("PGR_AUTOROUTE_MAPPING_SECTOR_PLACEHOLDER")} 
                    selectedValues={item.sector}       
                    avoidHighlightFirstOption             
                   />   
                  </div> 
                 </div>
                  <div xs={12} align="right">
                          <IconButton
                            style={{
                              width: "40px",
                              height: "40px"
                            }}
                            onClick={e => handleAddCard(e)}
                            aria-label="Remove"
                          >
                              <Icon>
                           <i class="material-icons">add</i>
                           </Icon>
                          </IconButton>
                        </div>
                  </div>  
             }
             />
           )} )}
        </div>
    )
}

export default MultiItemCard;