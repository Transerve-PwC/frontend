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
    marginTop: '85px', 
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
    
      

        this.props.prepareFinalObject('mdmsRes.sectorList', this.props.sectorList)
        this.props.prepareFinalObject('mdmsRes.isActiveList', [{name: "Yes"},{name: "No"}])
        if(this.props.updateData!=={})
        {
            this.setState({updateData: this.props.updateData})
            this.props.prepareFinalObject('updateData', this.props.updateData)
            this.props.updateData.isActive===true?this.props.prepareFinalObject('updateData.isActive', "Yes"):this.props.prepareFinalObject('updateData.isActive', "No")

            
        }else 
        {   
            this.setState({updateData: {}})
            this.props.prepareFinalObject('updateData', {})
            
        }
    
     
    }

    componentDidUpdate(prevProps){
    

      this.props.prepareFinalObject('mdmsRes.sectorList', this.props.sectorList)
      this.props.prepareFinalObject('mdmsRes.isActiveList', [{name: "Yes"},{name: "No"}])
        if(this.props.updateData !== prevProps.updateData){

            this.setState({updateData: this.props.updateData, errors: {}})
            this.props.prepareFinalObject('updateData', this.props.updateData)
            

            if(Object.keys(this.props.updateData).length === 0){
                this.setState({create: true})
            }else{
                this.setState({create: false})
                this.props.updateData.isActive===true?this.props.prepareFinalObject('updateData.isActive', "Yes"):this.props.prepareFinalObject('updateData.isActive', "No")
            }
        }

    }
    


    state={

        updateData: {}, 
        errors: {},
        create: true, 
        mdmsRes: {}, 
      
    }


    validate (){

        let temp= {}
        const submitData= this.state.updateData
        
        temp.amount= submitData.amount? false: true,
        //temp.bookingAllowedFor= submitData.bookingAllowedFor? false: true,
        temp.cgstRate= submitData.cgstRate? false: true,
        temp.cleaningCharges= submitData.cleaningCharges? false: true,
        temp.dimensionSqrYards= submitData.dimensionSqrYards? false: true,
        temp.imagePath= submitData.imagePath? false: true,
        temp.isActive= submitData.isActive? false: true, 
        temp.locationChangeAmount= submitData.locationChangeAmount? false: true,
        temp.luxuryTax= submitData.luxuryTax? false: true,
        temp.name= submitData.name? false: true,
        temp.normalType= submitData.normalType? false: true,
        temp.oldrent1= submitData.oldrent1? false: true,
        temp.radius= submitData.radius? false: true,
        temp.refundabelSecurity= submitData.refundabelSecurity? false: true,
        temp.rent= submitData.rent? false: true,
        temp.rentNextSession= submitData.rentNextSession? false: true,
        temp.reviserate1= submitData.reviserate1? false: true,
        temp.sccid= submitData.sccid? false: true,
        temp.scid= submitData.scid? false: true,
        temp.sector= submitData.sector? false: true,
        temp.surcharge= submitData.surcharge? false: true,
        temp.utgstRate= submitData.utgstRate? false: true,
        temp.venueType= submitData.venueType? false: true,
        temp.x= submitData.x? false: true,
        temp.y= submitData.y? false: true,
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
              
              "PaccFeeDetails": [
                {
                    "paccAmount": this.state.updateData.amount,
                    "bookingAllowedFor": this.state.updateData.bookingAllowedFor,
                    "cgstRate": this.state.updateData.cgstRate,
                    "cleaningCharges": this.state.updateData.cleaningCharges,
                    "dimensionSqrYards": this.state.updateData.dimensionSqrYards,
                    "imagePath": this.state.updateData.imagePath,
                    "isActive": (this.state.updateData.isActive==="Yes"? true: false),
                    "locationChangeAmount": this.state.updateData.locationChangeAmount,
                    "luxuryTax":this.state.updateData.luxuryTax,
                    "name": this.state.updateData.name,
                    "normalType": this.state.updateData.normalType,
                    "oldrent1":this.state.updateData.oldrent1,
                    "radius": this.state.updateData.radius,
                    "refundabelSecurity": this.state.updateData.refundabelSecurity,
                    "rent": this.state.updateData.rent,
                    "rentNextSession": this.state.updateData.rentNextSession,
                    "reviserate1": this.state.updateData.reviserate1,
                    "sccid":this.state.updateData.sccid,
                    "scid": this.state.updateData.scid,
                    "sector": this.state.updateData.sector,
                    "surcharge": this.state.updateData.surcharge,
                    "utgstRate": this.state.updateData.utgstRate,
                    "venueType": this.state.updateData.venueType,
                    "x": this.state.updateData.x,
                    "y": this.state.updateData.y,
                    "fromDate" : `${this.state.updateData.fromDate} ${time}`
                }
            ],
              }
            const responseStatus = await httpRequest(
                  
              "bookings/master/pacc/fee/_create",
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
              
              "PaccFeeDetails": [
                {    
                    "id": this.state.updateData.id,
                    "paccAmount": this.state.updateData.amount,
                    "bookingAllowedFor": this.state.updateData.bookingAllowedFor,
                    "cgstRate": this.state.updateData.cgstRate,
                    "cleaningCharges": this.state.updateData.cleaningCharges,
                    "dimensionSqrYards": this.state.updateData.dimensionSqrYards,
                    "imagePath": this.state.updateData.imagePath,
                    "isActive": (this.state.updateData.isActive==="Yes"? true: false),
                    "locationChangeAmount": this.state.updateData.locationChangeAmount,
                    "luxuryTax":this.state.updateData.luxuryTax,
                    "name": this.state.updateData.name,
                    "normalType": this.state.updateData.normalType,
                    "oldrent1":this.state.updateData.oldrent1,
                    "radius": this.state.updateData.radius,
                    "refundabelSecurity": this.state.updateData.refundabelSecurity,
                    "rent": this.state.updateData.rent,
                    "rentNextSession": this.state.updateData.rentNextSession,
                    "reviserate1": this.state.updateData.reviserate1,
                    "sccid":this.state.updateData.sccid,
                    "scid": this.state.updateData.scid,
                    "sector": this.state.updateData.sector,
                    "surcharge": this.state.updateData.surcharge,
                    "utgstRate": this.state.updateData.utgstRate,
                    "venueType": this.state.updateData.venueType,
                    "x": this.state.updateData.x,
                    "y": this.state.updateData.y,
                    "fromDate" : `${this.state.updateData.fromDate} ${time}`
                }
            ],
              }
              const responseStatus = await httpRequest(
                    
                "bookings/master/pacc/fee/_update",
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
         
      
       Object.keys(this.props.sectorList).length === 0?<div > <CircularProgress style={{position: "fixed" , top: '50%', left: '50%'}} /> </div> :
      <div>

        <Dialog
            classes={{ paper :classes.dialogStyle}}
            minWidth="md"
            open={this.props.open}
            onClose={this.props.handleClose}
            aria-labelledby="form-dialog-title"
         >
        <DialogTitle id="form-dialog-title">Edit Park And Community Center Fee Master</DialogTitle>
        <DialogContent style={{overflow : 'auto'}}>
          <DialogContentText style={{margin : '15px '}}>
            Please fill the form to update fee master of Park And Community Center 
          </DialogContentText>
          <div className="col-xs-12 col-sm-12">
            
          <div className="col-xs-12 col-sm-4">
          <TextFieldContainer
            type="number"
            error={this.state.errors.dimensionSqrYards }
            label={{
              labelName : "Dimension In Sqr Yards",
              labelKey: "BK_PACC_ADMIN_DIMENSION_LABEL",
              }}
            onChange={(e, value) => {
              let updateData = {...this.state.updateData}
              let errors= {...this.state.errors}
              errors.dimensionSqrYards=""
              updateData.dimensionSqrYards= e.target.value
              this.setState({updateData:updateData, errors:errors})
              prepareFinalObject('updateData.dimensionSqrYards', e.target.value)
            }}
            
            fullWidth="true"
            placeholder= {{
              labelName: "Dimension In Sqr Yards",
              labelKey: "BK_PACC_ADMIN_DIMENSION_LABEL",
            }}
            
            jsonPath="updateData.dimensionSqrYards"
             
            InputLabelProps={{
            shrink: true,
           }}
          />
            </div>
          <div className="col-xs-12 col-sm-4">
          <TextFieldContainer
            type="number"
            error={this.state.errors.scid }
            label={{
              labelName : "Scid",
              labelKey: "BK_PACC_ADMIN_SCID_LABEL",
              }}
            onChange={(e, value) => {
              let updateData = {...this.state.updateData}
              let errors= {...this.state.errors}
              errors.scid=""
              updateData.scid= e.target.value
              this.setState({updateData:updateData, errors:errors})
              prepareFinalObject('updateData.scid', e.target.value)
            }}
            
            fullWidth="true"
            placeholder= {{
              labelName: "Scid",
              labelKey: "BK_PACC_ADMIN_SCID_LABEL",
            }}
            
            jsonPath="updateData.scid"
             
            InputLabelProps={{
            shrink: true,
           }}
          />
            </div>
          <div className="col-xs-12 col-sm-4">
          <TextFieldContainer
            type="number"
            error={this.state.errors.sccid }
            label={{
              labelName : "Sccid",
              labelKey: "BK_PACC_ADMIN_SCCID_LABEL",
              }}
            onChange={(e, value) => {
              let updateData = {...this.state.updateData}
              let errors= {...this.state.errors}
              errors.sccid=""
              updateData.sccid= e.target.value
              this.setState({updateData:updateData, errors:errors})
              prepareFinalObject('updateData.sccid', e.target.value)
            }}
            
            fullWidth="true"
            placeholder= {{
              labelName: "Sccid",
              labelKey: "BK_PACC_ADMIN_SCCID_LABEL",
            }}
            
            jsonPath="updateData.sccid"
             
            InputLabelProps={{
            shrink: true,
           }}
          />
            </div>
          </div>
          <div className="col-xs-12 col-sm-12">
          < div className="col-xs-12 col-sm-4">
          <TextFieldContainer
            type="number"
            error={this.state.errors.x }
            label={{
              labelName : "X Cordinate",
              labelKey: "BK_PACC_ADMIN_X_LABEL",
              }}
            onChange={(e, value) => {
              let updateData = {...this.state.updateData}
              let errors= {...this.state.errors}
              errors.x=""
              updateData.x= e.target.value
              this.setState({updateData:updateData, errors:errors})
              prepareFinalObject('updateData.x', e.target.value)
            }}
            
            fullWidth="true"
            placeholder= {{
              labelName: "X Cordinate",
              labelKey: "BK_PACC_ADMIN_X_LABEL",
            }}
            
            jsonPath="updateData.x"
             
            InputLabelProps={{
            shrink: true,
           }}
          />
            </div>

          
          <div className="col-xs-12 col-sm-4">
          <TextFieldContainer
            type="number"
            error={this.state.errors.y }
            label={{
              labelName : "Y Cordinate",
              labelKey: "BK_PACC_ADMIN_Y_LABEL",
              }}
            onChange={(e, value) => {
              let updateData = {...this.state.updateData}
              let errors= {...this.state.errors}
              errors.y=""
              updateData.y= e.target.value
              this.setState({updateData:updateData, errors:errors})
              prepareFinalObject('updateData.y', e.target.value)
            }}
            
            fullWidth="true"
            placeholder= {{
              labelName: "Y Cordinate",
              labelKey: "BK_PACC_ADMIN_Y_LABEL",
            }}
            
            jsonPath="updateData.y"
             
            InputLabelProps={{
            shrink: true,
           }}
          />
            </div>
            <div className="col-xs-12 col-sm-4">
          <TextFieldContainer
            type="number"
            error={this.state.errors.rent }
            label={{
              labelName : "Rent",
              labelKey: "BK_PACC_ADMIN_RENT_LABEL",
              }}
            onChange={(e, value) => {
              let updateData = {...this.state.updateData}
              let errors= {...this.state.errors}
              errors.rent=""
              updateData.rent= e.target.value
              this.setState({updateData:updateData, errors:errors})
              prepareFinalObject('updateData.rent', e.target.value)
            }}
            
            fullWidth="true"
            placeholder= {{
              labelName: "Rent",
              labelKey: "BK_PACC_ADMIN_RENT_LABEL",
            }}
            
            jsonPath="updateData.rent"
             
            InputLabelProps={{
            shrink: true,
           }}
          />
            </div>  
          </div>
          <div className="col-xs-12 col-sm-12">
           
          <div className="col-xs-12 col-sm-4">
          <TextFieldContainer
            type="number"
            error={this.state.errors.cleaningCharges }
            label={{
              labelName : "Cleaning Charges",
              labelKey: "BK_PACC_ADMIN_CLEANING_CHARGES_LABEL",
              }}
            onChange={(e, value) => {
              let updateData = {...this.state.updateData}
              let errors= {...this.state.errors}
              errors.cleaningCharges=""
              updateData.cleaningCharges= e.target.value
              this.setState({updateData:updateData, errors:errors})
              prepareFinalObject('updateData.cleaningCharges', e.target.value)
            }}
            
            fullWidth="true"
            placeholder= {{
              labelName: "Cleaning Charges",
              labelKey: "BK_PACC_ADMIN_CLEANING_CHARGES_LABEL_LABEL",
            }}
            
            jsonPath="updateData.cleaningCharges"
             
            InputLabelProps={{
            shrink: true,
           }}
          />
            </div>
          
          <div className="col-xs-12 col-sm-4">
          <TextFieldContainer
            type="number"
            error={this.state.errors.surcharge }
            label={{
              labelName : "Surcharge",
              labelKey: "BK_PACC_ADMIN_SURCHARGE_LABEL",
              }}
            onChange={(e, value) => {
              let updateData = {...this.state.updateData}
              let errors= {...this.state.errors}
              errors.surcharge=""
              updateData.surcharge= e.target.value
              this.setState({updateData:updateData, errors:errors})
              prepareFinalObject('updateData.surcharge', e.target.value)
            }}
            
            fullWidth="true"
            placeholder= {{
              labelName: "Surcharge",
              labelKey: "BK_PACC_ADMIN_SURCHARGE_LABEL",
            }}
            
            jsonPath="updateData.surcharge"
             
            InputLabelProps={{
            shrink: true,
           }}
          />
            </div> 
          
          <div className="col-xs-12 col-sm-4">
          <TextFieldContainer
            type="number"
            error={this.state.errors.luxuryTax }
            label={{
              labelName : "Luxury Tax",
              labelKey: "BK_PACC_ADMIN_LUXURY_TAX_LABEL",
              }}
            onChange={(e, value) => {
              let updateData = {...this.state.updateData}
              let errors= {...this.state.errors}
              errors.luxuryTax=""
              updateData.luxuryTax= e.target.value
              this.setState({updateData:updateData, errors:errors})
              prepareFinalObject('updateData.luxuryTax', e.target.value)
            }}
            
            fullWidth="true"
            placeholder= {{
              labelName: "Luxury Tax",
              labelKey: "BK_PACC_ADMIN_LUXURY_TAX_LABEL",
            }}
            
            jsonPath="updateData.luxuryTax"
             
            InputLabelProps={{
            shrink: true,
           }}
          />
            </div> 
          
          </div>
          <div className="col-xs-12 col-sm-12">
            
          <div className="col-xs-12 col-sm-4">
          <TextFieldContainer
            
            error={this.state.errors.name }
            label={{
              labelName : "Name",
              labelKey: "BK_PACC_ADMIN_NAME_LABEL",
              }}
            onChange={(e, value) => {
              let updateData = {...this.state.updateData}
              let errors= {...this.state.errors}
              errors.name=""
              updateData.name= e.target.value
              this.setState({updateData:updateData, errors:errors})
              prepareFinalObject('updateData.name', e.target.value)
            }}
            
            fullWidth="true"
            placeholder= {{
              labelName: "Name",
              labelKey: "BK_PACC_ADMIN_NAME_LABEL",
            }}
            
            jsonPath="updateData.name"
             
            InputLabelProps={{
            shrink: true,
           }}
          />
            </div>
          
          <div className="col-xs-12 col-sm-4">
          <TextFieldContainer
            type="number"
            error={this.state.errors.radius }
            label={{
              labelName : "Radius",
              labelKey: "BK_PACC_ADMIN_RADIUS_LABEL",
              }}
            onChange={(e, value) => {
              let updateData = {...this.state.updateData}
              let errors= {...this.state.errors}
              errors.radius=""
              updateData.radius= e.target.value
              this.setState({updateData:updateData, errors:errors})
              prepareFinalObject('updateData.radius', e.target.value)
            }}
            
            fullWidth="true"
            placeholder= {{
              labelName: "Radius",
              labelKey: "BK_PACC_ADMIN_RADIUS_LABEL",
            }}
            
            jsonPath="updateData.radius"
             
            InputLabelProps={{
            shrink: true,
           }}
          />
            </div>  
          
          <div className="col-xs-12 col-sm-4">
          <TextFieldContainer
            type="number"
            error={this.state.errors.locationChangeAmount }
            label={{
              labelName : "Location Change Amount",
              labelKey: "BK_PACC_ADMIN_LOCATION_CHANGE_AMOUNT_LABEL",
              }}
            onChange={(e, value) => {
              let updateData = {...this.state.updateData}
              let errors= {...this.state.errors}
              errors.locationChangeAmount=""
              updateData.locationChangeAmount= e.target.value
              this.setState({updateData:updateData, errors:errors})
              prepareFinalObject('updateData.locationChangeAmount', e.target.value)
            }}
            
            fullWidth="true"
            placeholder= {{
              labelName: "Location Change Amount",
              labelKey: "BK_PACC_ADMIN_LOCATION_CHANGE_AMOUNT_LABEL",
            }}
            
            jsonPath="updateData.locationChangeAmount"
             
            InputLabelProps={{
            shrink: true,
           }}
          />
            </div>  
          </div>
          <div className="col-xs-12 col-sm-12">
           
          <div className="col-xs-12 col-sm-4">
          <TextFieldContainer
            type="number"
            error={this.state.errors.utgstRate }
            label={{
              labelName : "Utgst Rate",
              labelKey: "BK_PACC_ADMIN_UTGST_RATE_LABEL",
              }}
            onChange={(e, value) => {
              let updateData = {...this.state.updateData}
              let errors= {...this.state.errors}
              errors.utgstRate=""
              updateData.utgstRate= e.target.value
              this.setState({updateData:updateData, errors:errors})
              prepareFinalObject('updateData.utgstRate', e.target.value)
            }}
            
            fullWidth="true"
            placeholder= {{
              labelName: "Utgst Rate",
              labelKey: "BK_PACC_ADMIN_UTGST_RATE_LABEL",
            }}
            
            jsonPath="updateData.utgstRate"
             
            InputLabelProps={{
            shrink: true,
           }}
          />
            </div>
           
          <div className="col-xs-12 col-sm-4">
          <TextFieldContainer
            type="number"
            error={this.state.errors.cgstRate }
            label={{
              labelName : "Cgst Rate",
              labelKey: "BK_PACC_ADMIN_CGST_RATE_LABEL",
              }}
            onChange={(e, value) => {
              let updateData = {...this.state.updateData}
              let errors= {...this.state.errors}
              errors.cgstRate=""
              updateData.cgstRate= e.target.value
              this.setState({updateData:updateData, errors:errors})
              prepareFinalObject('updateData.cgstRate', e.target.value)
            }}
            
            fullWidth="true"
            placeholder= {{
              labelName: "Cgst Rate",
              labelKey: "BK_PACC_ADMIN_CGST_RATE_LABEL",
            }}
            
            jsonPath="updateData.cgstRate"
             
            InputLabelProps={{
            shrink: true,
           }}
          />
            </div>
          
          <div className="col-xs-12 col-sm-4">
          <TextFieldContainer
            type="number"
            error={this.state.errors.refundabelSecurity }
            label={{
              labelName : "Refundabel Security",
              labelKey: "BK_PACC_ADMIN_REFUNDABLE_SECURITY_LABEL",
              }}
            onChange={(e, value) => {
              let updateData = {...this.state.updateData}
              let errors= {...this.state.errors}
              errors.refundabelSecurity=""
              updateData.refundabelSecurity= e.target.value
              this.setState({updateData:updateData, errors:errors})
              prepareFinalObject('updateData.refundabelSecurity', e.target.value)
            }}
            
            fullWidth="true"
            placeholder= {{
              labelName: "Refundabel Security",
              labelKey: "BK_PACC_ADMIN_REFUNDABLE_SECURITY_LABEL",
            }}
            
            jsonPath="updateData.refundabelSecurity"
             
            InputLabelProps={{
            shrink: true, 
           }}
          />
            </div>  
            </div> 
          <div className="col-xs-12 col-sm-12">
           
          <div className="col-xs-12 col-sm-4">
          <TextFieldContainer
            type="number"
            error={this.state.errors.reviserate1 }
            label={{
              labelName : "Revise Rate 1",
              labelKey: "BK_PACC_ADMIN_REVISE_RATE_LABEL",
              }}
            onChange={(e, value) => {
              let updateData = {...this.state.updateData}
              let errors= {...this.state.errors}
              errors.reviserate1=""
              updateData.reviserate1= e.target.value
              this.setState({updateData:updateData, errors:errors})
              prepareFinalObject('updateData.reviserate1', e.target.value)
            }}
            
            fullWidth="true"
            placeholder= {{
              labelName: "Revise Rate 1",
              labelKey: "BK_PACC_ADMIN_REVISE_RATE_LABEL",
            }}
            
            jsonPath="updateData.reviserate1"
             
            InputLabelProps={{
            shrink: true,
           }}
          />
            </div>
          
          <div className="col-xs-12 col-sm-4">
          <TextFieldContainer
            type="number"
            error={this.state.errors.oldrent1 }
            label={{
              labelName : "Old Rent 1",
              labelKey: "BK_PACC_ADMIN_OLD_RENT_LABEL",
              }}
            onChange={(e, value) => {
              let updateData = {...this.state.updateData}
              let errors= {...this.state.errors}
              errors.oldrent1=""
              updateData.oldrent1= e.target.value
              this.setState({updateData:updateData, errors:errors})
              prepareFinalObject('updateData.oldrent1', e.target.value)
            }}
            
            fullWidth="true"
            placeholder= {{
              labelName: "Old Rent 1",
              labelKey: "BK_PACC_ADMIN_OLD_RENT_LABEL",
            }}
            
            jsonPath="updateData.oldrent1"
             
            InputLabelProps={{
            shrink: true,
           }}
          />
            </div>  
           
          <div className="col-xs-12 col-sm-4">
          <TextFieldContainer
            type="number"
            error={this.state.errors.rentNextSession }
            label={{
              labelName : "Rent Next Session",
              labelKey: "BK_PACC_ADMIN_RENT_NEXT_SESSION_LABEL",
              }}
            onChange={(e, value) => {
              let updateData = {...this.state.updateData}
              let errors= {...this.state.errors}
              errors.rentNextSession=""
              updateData.rentNextSession= e.target.value
              this.setState({updateData:updateData, errors:errors})
              prepareFinalObject('updateData.rentNextSession', e.target.value)
            }}
            
            fullWidth="true"
            placeholder= {{
              labelName: "Rent Next Session",
              labelKey: "BK_PACC_ADMIN_RENT_NEXT_SESSION_LABEL",
            }}
            
            jsonPath="updateData.rentNextSession"
             
            InputLabelProps={{
            shrink: true,
           }}
          />
            </div>  
            
          </div>
          <div className="col-xs-12 col-sm-12">
          <div className="col-xs-12 col-sm-4">
          <TextFieldContainer
            
            error={this.state.errors.venueType }
            label={{
              labelName : "Venue Type",
              labelKey: "BK_PACC_ADMIN_VENUE_TYPE_LABEL",
              }}
            onChange={(e, value) => {
              let updateData = {...this.state.updateData}
              let errors= {...this.state.errors}
              errors.venueType=""
              updateData.venueType= e.target.value
              this.setState({updateData:updateData, errors:errors})
              prepareFinalObject('updateData.venueType', e.target.value)
            }}
            
            fullWidth="true"
            placeholder= {{
              labelName: "Venue Type",
              labelKey: "BK_PACC_ADMIN_VENUE_TYPE_LABEL",
            }}
            
            jsonPath="updateData.venueType"
             
            InputLabelProps={{
            shrink: true,
           }}
          />
            </div> 
            <div className="col-xs-12 col-sm-4">
          <TextFieldContainer
            
            error={this.state.errors.bookingAllowedFor }
            label={{
              labelName : "Booking Allowed For",
              labelKey: "BK_PACC_ADMIN_BOOKING_ALLOWED_FOR_LABEL",
              }}
            onChange={(e, value) => {
              let updateData = {...this.state.updateData}
              let errors= {...this.state.errors}
              errors.bookingAllowedFor=""
              updateData.bookingAllowedFor= e.target.value
              this.setState({updateData:updateData, errors:errors})
              prepareFinalObject('updateData.bookingAllowedFor', e.target.value)
            }}
            
            fullWidth="true"
            placeholder= {{
              labelName: "Booking Allowed For",
              labelKey: "BK_PACC_ADMIN_BOOKING_ALLOWED_FOR_LABEL",
            }}
            
            jsonPath="updateData.bookingAllowedFor"
             
            InputLabelProps={{
            shrink: true,
           }}
          />
            </div>   
            <div className="col-xs-12 col-sm-4">
          <TextFieldContainer
            
            error={this.state.errors.imagePath }
            label={{
              labelName : "Image Path",
              labelKey: "BK_PACC_ADMIN_IMAGE_PATH_LABEL",
              }}
            onChange={(e, value) => {
              let updateData = {...this.state.updateData}
              let errors= {...this.state.errors}
              errors.imagePath=""
              updateData.imagePath= e.target.value
              this.setState({updateData:updateData, errors:errors})
              prepareFinalObject('updateData.imagePath', e.target.value)
            }}
            
            fullWidth="true"
            placeholder= {{
              labelName: "Image Path",
              labelKey: "BK_PACC_ADMIN_IMAGE_PATH_LABEL",
            }}
            
            jsonPath="updateData.imagePath"
             
            InputLabelProps={{
            shrink: true,
           }}
          />
            </div>   
          </div>
          <div className="col-xs-12 col-sm-12"> 
          <div className="col-xs-12 col-sm-4">
          <TextFieldContainer
            
            error={this.state.errors.normalType }
            label={{
              labelName : "Normal Type",
              labelKey: "BK_PACC_ADMIN_NORMAL_TYPE_LABEL",
              }}
            onChange={(e, value) => {
              let updateData = {...this.state.updateData}
              let errors= {...this.state.errors}
              errors.normalType=""
              updateData.normalType= e.target.value
              this.setState({updateData:updateData, errors:errors})
              prepareFinalObject('updateData.normalType', e.target.value)
            }}
            
            fullWidth="true"
            placeholder= {{
              labelName: "Normal Type",
              labelKey: "BK_PACC_ADMIN_NORMAL_TYPE_LABEL",
            }}
            
            jsonPath="updateData.normalType"
             
            InputLabelProps={{
            shrink: true,
           }}
          />
          </div> 
          <div className="col-xs-12 col-sm-4">
            
            <TextFieldContainer 
            error={this.state.errors.sector }
            select="true"
            optionValue="code"
            optionLabel="code"
            label={{
                labelName : "Sector",
                labelKey: "BK_PACC_ADMIN_SECTOR_LABEL",
            }}
            placeholder= {{
                labelName: "Sector",
                labelKey: "BK_PACC_ADMIN_SECTOR_LABEL",
            }}
            onChange={(e, key, value)=> { 
            
              let updateData =this.state.updateData
              updateData.sector= e.target.value
              let errors= {...this.state.errors}
              errors.sector=""
              this.setState({updateData: updateData, errors: errors})
              prepareFinalObject('updateData.sector', e.target.value)
            }}
            required= "true" 
            sourceJsonPath= "mdmsRes.sectorList"
            jsonPath="updateData.sector"
            
            gridDefination= {{
                xs: 12,
                sm: 6
            }}
         />
         </div> 
         <div className="col-xs-12 col-sm-4">
            
            <TextFieldContainer 
            error={this.state.errors.isActive }
            select="true"
            optionValue="name"
            optionLabel="name"
            label={{
                labelName : "Is Active",
                labelKey: "BK_PACC_ADMIN_IS_ACTIVE_LABEL",
            }}
            placeholder= {{
                labelName: "Is Active",
                labelKey: "BK_PACC_ADMIN_IS_ACTIVE_LABEL",
            }}
            onChange={(e, key, value)=> { 
            
              let updateData =this.state.updateData
              updateData.isActive= e.target.value
              let errors= {...this.state.errors}
              errors.isActive=""
              this.setState({updateData: updateData, errors: errors})
              prepareFinalObject('updateData.isActive', e.target.value)
            }}
            required= "true" 
            sourceJsonPath= "mdmsRes.isActiveList"
            jsonPath="updateData.isActive"
            
            gridDefination= {{
                xs: 12,
                sm: 6
            }}
         />
         </div> 

          </div>
          <div className="col-xs-12 col-sm-12"> 
            
          <div className="col-xs-12 col-sm-4">
          <TextFieldContainer
            type="number"
            error={this.state.errors.amount }
            label={{
              labelName : "Amount",
              labelKey: "BK_PACC_ADMIN_AMOUNT_LABEL",
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
              labelKey: "BK_PACC_ADMIN_AMOUNT_LABEL",
            }}
            
            jsonPath="updateData.amount"
             
            InputLabelProps={{
            shrink: true,
           }}
          />
            </div> 
            <div className="col-xs-12 col-sm-4">
            <TextFieldContainer 
            error={this.state.errors.fromDate }
            
            optionValue="code"
            optionLabel="code"
            label={{
                labelName : "Valid From Date",
                labelKey: "BK_PACC_ADMIN_VALID_FROM_DATE_LABEL",
            }}
            placeholder= {{
                labelName: "Valid From Date",
                labelKey: "BK_PACC_ADMIN_VALID_FROM_DATE_LABEL",
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