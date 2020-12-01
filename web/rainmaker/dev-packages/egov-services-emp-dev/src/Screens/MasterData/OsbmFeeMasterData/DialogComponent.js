import { Button,  TextField } from "components";
import { httpRequest } from "egov-ui-kit/utils/api";
import LoadingIndicator from "egov-ui-kit/components/LoadingIndicator";
import React, { Component } from 'react'
import { Toast } from "components";
import { SortDialog, Screen } from "modules/common";
import CircularProgress from "@material-ui/core/CircularProgress";
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import { withStyles } from "@material-ui/core/styles";

import { connect } from "react-redux";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import TextFieldContainer from 'egov-ui-framework/ui-containers/TextFieldContainer'


const styles= theme=>({
  
  text : {
    " &  .Mui-error": {
      color: "primary"
    }
  }, 

 
  dialogStyle: {
    minWidth: '960px',
  },
 
  root: {
    "& .MuiInput-underline:after": {
      borderBottomColor: " #f44336"
    }
  }, 
  
  [theme.breakpoints.down('sm')]: {
    
   
    dialogStyle: {
      minHeight: '100%', 
      margin : '0px',
      minWidth: '0px',
      maxWidth: '960px'
    }
  }



})



class DialogComponent extends Component {


    async componentDidMount(){
    
      

        this.setState({mdmsRes: this.props.mdmsResOsbm})
        this.props.prepareFinalObject('mdmsRes', this.props.mdmsResOsbm)
     
     
    }

    componentDidUpdate(prevProps){
    
        
        if(this.props.updateMasterData !== prevProps.updateMasterData){

                
            this.setState({mdmsRes: this.props.mdmsResOsbm})
            this.props.prepareFinalObject('mdmsRes', this.props.mdmsResOsbm)
            
            this.setState({updateData: this.props.updateMasterData, errors: {}})
            this.props.prepareFinalObject('updateData', this.props.updateMasterData)

            if(Object.keys(this.props.updateMasterData).length === 0){
                this.setState({create: true})
            }else{
                this.setState({create: false})
            }
        }

    }
    


    state={

        updateData: {}, 
        errors: {},
        create: true, 
        mdmsRes: {}, 
        setOpen : false
    }


    validate (){

        let temp= {}
        const submitData= this.state.updateData
        temp.villageCity=submitData.villageCity? false: true
        temp.residentialCommercial=submitData.residentialCommercial? false: true
        temp.storage=submitData.storage? false: true
        temp.durationInMonths=submitData.durationInMonths? false: true
        temp.constructionType=submitData.constructionType? false: true
        temp.amount=submitData.amount? false: true
        temp.fromDate=submitData.fromDate? false: true

        this.setState({errors: temp})

        return Object.values(temp).every(x => x=="")
    }

    async handleSubmit  (){
        if(this.validate()){

           if(this.state.create===true)
           {
             
          
            let today = new Date();
            let time =
              today.getHours() +
              ":" +
              today.getMinutes() +
              ":" +
              today.getSeconds();


            var reqBody =  {
              
              
              "OsbmFeeDetails": [

                {

                  "villageCity": this.state.updateData.villageCity ,
                  "residentialCommercial": this.state.updateData.residentialCommercial,
                  "storage":this.state.updateData.storage,
                  "durationInMonths":this.state.updateData.durationInMonths,
                  "constructionType":this.state.updateData.constructionType,
                  "amount":this.state.updateData.amount, 
                  "fromDate" : `${this.state.updateData.fromDate} ${time}`

                }
               
               ]
              }
            const responseStatus = await httpRequest(
                  
              "bookings/master/osbm/fee/_create",
              "_search",
              [],
              reqBody
            );
            if(responseStatus.status== '200'){
              this.props.toggleSnackbarAndSetText(
                true,
                {labelName: "Created Successfully",
                labelKey: `Created Successfully`} ,
                "success"
              );
              }else{
              this.props.toggleSnackbarAndSetText(
                true,
                {labelName: "Create Failed.Try Again",
                labelKey: `Create Failed.Try Again`} ,
                "error"
              );
              }
              
              this.props.handleClose()

            console.log(responseStatus, "createresponse")
          
              

    
           }
           else
           
           {
            let today = new Date();
            let time =
              today.getHours() +
              ":" +
              today.getMinutes() +
              ":" +
              today.getSeconds();

              var reqBody =  {
              
                "OsbmFeeDetails": [

                  {

                    "id": this.state.updateData.id,
                    "villageCity": this.state.updateData.villageCity ,
                    "residentialCommercial": this.state.updateData.residentialCommercial,
                    "storage":this.state.updateData.storage,
                    "durationInMonths":this.state.updateData.durationInMonths,
                    "constructionType":this.state.updateData.constructionType,
                    "amount":this.state.updateData.amount, 
                    "fromDate" : `${this.state.updateData.fromDate} ${time}`
  
                  }
                 
                 ]
                }
              const responseStatus = await httpRequest(
                    
                "bookings/master/osbm/fee/_update",
                "_search",
                [],
                reqBody
              );
              if(responseStatus.status== '200'){
              this.props.toggleSnackbarAndSetText(
                true,
                {labelName: "Updated Successfully",
                labelKey: `Updated Successfully`} ,
                "success"
              );
              }else{
              this.props.toggleSnackbarAndSetText(
                true,
                {labelName: "Update Failed.Try Again",
                labelKey: `Update Failed.Try Again`} ,
                "error"
              );
              }
              
              this.props.handleClose()
              console.log(responseStatus, "createresponse")
            }
  
           
        }
        else{
          this.props.toggleSnackbarAndSetText(
            true,
            {labelName: "Please Fill All Required Fields",
            labelKey: `Please Fill All Required Fields`} ,
            "warning"
          );
        }
        
    }

    
    render() {
    
       
        const {classes,prepareFinalObject} =this.props
        return (

      
        Object.keys(this.state.mdmsRes).length === 0?<div > <CircularProgress style={{position: "fixed" , top: '50%', left: '50%'}} /> </div> :
      <div>
{console.log(this.state.updateData)}
        <Dialog
            classes={{ paper :classes.dialogStyle}}
            minWidth="md"
            open={this.props.open}
            onClose={this.props.handleClose}
            aria-labelledby="form-dialog-title"
         >
        <DialogTitle id="form-dialog-title">Edit Open Space Fee Master</DialogTitle>
        <DialogContent style={{overflow : 'auto'}}>
          {/* <DialogContentText style={{margin : '15px '}}>
            Please fill the form to update fee master of OSBM
          </DialogContentText> */}
          <div className="col-xs-12 col-sm-12">
          <div className="col-xs-12 col-sm-6">
          <TextFieldContainer 
            error={this.state.errors.villageCity }
            select="true"
            optionValue="code"
            optionLabel="code"
            label={{
                labelName : "Village/City",
                labelKey: "BK_OSBM_ADMIN_VILLAGE/CITY_LABEL",
            }}
            placeholder= {{
                labelName: "Village/City",
                labelKey: "BK_OSBM_ADMIN_VILLAGE/CITY_LABEL",
            }}
            onChange={(e, key, value)=> { 
            
              let updateData =this.state.updateData
              updateData.villageCity= e.target.value
              let errors= {...this.state.errors}
              errors.villageCity=""
              this.setState({updateData: updateData, errors: errors})
              prepareFinalObject('updateData.villageCity', e.target.value)
              
            }}
            required= "true" 
            sourceJsonPath= "mdmsRes.VillageCity"
            jsonPath="updateData.villageCity"
             
            gridDefination= {{
                xs: 12,
                sm: 6
            }}
         />
         
          </div>
          <div className="col-xs-12 col-sm-6">
            
          <TextFieldContainer 
            error={this.state.errors.residentialCommercial }
            select="true"
            optionValue="code"
            optionLabel="code"
            label={{
                labelName : "City Type",
                labelKey: "BK_OSBM_ADMIN_CITY_TYPE_LABEL",
            }}
            placeholder= {{
                labelName: "City Type",
                labelKey: "BK_OSBM_ADMIN_CITY_TYPE_LABEL",
            }}
            onChange={(e, key, value)=> { 
            
              let updateData =this.state.updateData
              updateData.residentialCommercial= e.target.value
              let errors= {...this.state.errors}
              errors.residentialCommercial=""
              this.setState({updateData: updateData, errors: errors})
              prepareFinalObject('updateData.residentialCommercial', e.target.value)
              
            }}
            required= "true" 
            sourceJsonPath= "mdmsRes.CityType"
            jsonPath="updateData.residentialCommercial"
             
            gridDefination= {{
                xs: 12,
                sm: 6
            }}
         />
         
          </div>
          </div>
          <div className="col-xs-12 col-sm-12">
          <div className="col-xs-12 col-sm-6">
              
          
          {this.state.updateData.constructionType==="New"?
            <TextFieldContainer 
            error={this.state.errors.durationInMonths }
            select="true"
            optionValue="code"
            optionLabel="code"
            label={{
                labelName : "Duration",
                labelKey: "BK_OSBM_ADMIN_DURATION_LABEL",
            }}
            placeholder= {{
                labelName: "Duration",
                labelKey: "BK_OSBM_ADMIN_DURATION_LABEL",
            }}
            onChange={(e, key, value)=> { 
            
              let updateData =this.state.updateData
              updateData.durationInMonths= e.target.value
              let errors= {...this.state.errors}
              errors.durationInMonths=""
              this.setState({updateData: updateData, errors: errors})
              prepareFinalObject('updateData.durationInMonths', e.target.value)
              
            }}
            required= "true" 
            sourceJsonPath= "mdmsRes.Duration"
            jsonPath="updateData.durationInMonths"
             
            gridDefination= {{
                xs: 12,
                sm: 6
            }}
         />   
           :
           <TextFieldContainer 
            error={this.state.errors.durationInMonths }
            select="true"
            optionValue="code"
            optionLabel="code"
            label={{
                labelName : "Duration",
                labelKey: "BK_OSBM_ADMIN_DURATION_LABEL",
            }}
            placeholder= {{
                labelName: "Duration",
                labelKey: "BK_OSBM_ADMIN_DURATION_LABEL",
            }}
            onChange={(e, key, value)=> { 
            
              let updateData =this.state.updateData
              updateData.durationInMonths= e.target.value
              let errors= {...this.state.errors}
              errors.durationInMonths=""
              this.setState({updateData: updateData, errors: errors})
              prepareFinalObject('updateData.durationInMonths', e.target.value)
              
            }}
            required= "true" 
            sourceJsonPath= "mdmsRes.Duration"
            jsonPath="updateData.durationInMonths"
             
            gridDefination= {{
                xs: 12,
                sm: 6
            }}
         />  
          }
          </div> 
          <div className="col-xs-12 col-sm-6">
          <TextFieldContainer 
            error={this.state.errors.storage }
            select="true"
            optionValue="code"
            optionLabel="code"
            label={{
                labelName : "Area",
                labelKey: "BK_OSBM_ADMIN_AREA_LABEL",
            }}
            placeholder= {{
                labelName: "Area",
                labelKey: "BK_OSBM_ADMIN_AREA_LABEL",
            }}
            onChange={(e, key, value)=> { 
            
              let updateData =this.state.updateData
              updateData.storage= e.target.value
              let errors= {...this.state.errors}
              errors.storage=""
              this.setState({updateData: updateData, errors: errors})
               prepareFinalObject('updateData.storage', e.target.value)
              
            }}
            required= "true" 
            sourceJsonPath= "mdmsRes.Area"
            jsonPath="updateData.storage"
             
            gridDefination= {{
                xs: 12,
                sm: 6
            }}
         />
        </div> 
        </div> 
          <div className="col-xs-12 col-sm-12">
          <div className="col-xs-12 col-sm-6">
          <TextFieldContainer 
            error={this.state.errors.constructionType }
            select="true"
            optionValue="code"
            optionLabel="code"
            label={{
                labelName : "Type of Construction",
                labelKey: "BK_OSBM_ADMIN_CONSTRUCTION_TYPE_LABEL",
            }}
            placeholder= {{
                labelName: "Type of Construction",
                labelKey: "BK_OSBM_ADMIN_CONSTRUCTION_TYPE_LABEL",
            }}
            onChange={(e, key, value)=> { 
            
              let updateData =this.state.updateData
              updateData.constructionType= e.target.value
              let errors= {...this.state.errors}
              errors.constructionType=""
              this.setState({updateData: updateData, errors: errors})
              prepareFinalObject('updateData.constructionType', e.target.value)
              
            }}
            required= "true" 
            sourceJsonPath= "mdmsRes.Type_of_Construction"
            jsonPath="updateData.constructionType"
             
            gridDefination= {{
                xs: 12,
                sm: 6
            }}
         />
          </div> 
          <div className="col-xs-12 col-sm-6">
          <TextFieldContainer
            error={this.state.errors.amount }
            label={{
              labelName : "Amount",
              labelKey: "BK_OSBM_ADMIN_AMOUNT_LABEL",
              }}
            onChange={(e, value) => {
              
              let updateData = {...this.state.updateData}
              let errors= {...this.state.errors}
              errors.amount=""
              updateData.amount= e.target.value
              this.setState({updateData:updateData, errors:errors})
               prepareFinalObject('updateData.amount', e.target.value)
            }}
            
            fullWidth="true"
            placeholder= {{
              labelName: "Amount",
              labelKey: "BK_OSBM_ADMIN_AMOUNT_LABEL",
            }}
            
            jsonPath="updateData.amount"
             
            InputLabelProps={{
            shrink: true,
           }}
          />
            </div> 
          </div>
          <div className="col-xs-12 col-sm-12">
          <div className="col-xs-12 col-sm-6">
          <TextFieldContainer 
            error={this.state.errors.fromDate }
            
            optionValue="code"
            optionLabel="code"
            label={{
                labelName : "From Date",
                labelKey: "BK_OSBM_ADMIN_FROM_DATE_LABEL",
            }}
            placeholder= {{
                labelName: "From Date",
                labelKey: "BK_OSBM_ADMIN_FROM_DATE_LABEL",
            }}
            type= "date"
            onChange={(e, key, value)=> { 

              
              
              let date = new Date(e.target.value);
              let oldDate = new Date(this.props.validFromDate)
              if (date.getTime() > oldDate.getTime()) {
                
                
                let updateData =this.state.updateData
                updateData.fromDate= e.target.value
                
                let errors= {...this.state.errors}
                errors.fromDate=""
                this.setState({updateData: updateData, errors: errors})
                prepareFinalObject('updateData.fromDate', e.target.value)

              } else {
                if(this.state.create===true){
                  this.props.toggleSnackbarAndSetText(
                    true,
                    {labelName: "Valid From Date Should Be Greater then Today",
                    labelKey: `Valid From Date Should Be Greater then Today`} ,
                    "error"
                  );
                }else{
                  this.props.toggleSnackbarAndSetText(
                    true,
                    {labelName: "New Valid From Date Should Be Greater then Selected Date",
                    labelKey: `New Valid From Date Should Be Greater then Selected Date`} ,
                    "error"
                  );
                }
               
              

                }
              
            }}
            required= "true" 
            
            jsonPath="updateData.fromDate"
            gridDefination= {{
                xs: 12,
                sm: 6
            }}
         />
          </div> 
          </div>
        </DialogContent>
                 <DialogActions>
          <Button label="Cancel" onClick={()=>{ this.props.handleClose()
            this.setState({errors : {}})}} color="secondary"/>
           
          <Button label={this.state.create===true? "Create":"Update"} onClick={()=>{ this.handleSubmit() }} primary={true} />
            
        </DialogActions>
    
      </Dialog>
                
    </div>
        
        
   )
 }
}






const mapStateToProps = (state, ownProps) => {
  const { screenConfiguration } = state;
  const { preparedFinalObject } = screenConfiguration;
  return {preparedFinalObject}
}



const mapDispatchToProps = dispatch => {
  return {
    prepareFinalObject: (jsonPath, value) =>
    dispatch(prepareFinalObject(jsonPath, value)),
   
    toggleSnackbarAndSetText: (open, message, error) =>
    dispatch(toggleSnackbarAndSetText(open, message, error)),
    
  };
};


export default (connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)( DialogComponent) ))