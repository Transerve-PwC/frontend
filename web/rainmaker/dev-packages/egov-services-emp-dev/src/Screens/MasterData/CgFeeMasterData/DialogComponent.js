import { Button,  TextField } from "components";
import { httpRequest } from "egov-ui-kit/utils/api";
import LoadingIndicator from "egov-ui-kit/components/LoadingIndicator";
import React, { Component } from 'react';
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import SelectField from "material-ui/SelectField";
import CircularProgress from "@material-ui/core/CircularProgress";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import TextFieldContainer from 'egov-ui-framework/ui-containers/TextFieldContainer'




const useStyle= theme=>({

  dialogStyle: {
    minWidth: '960px',
  },
 
  text: {
   padding: '0px' 
  },
  
  [theme.breakpoints.down('sm')]: {

   
    dialogStyle: {
      minWidth: '0px',
      maxWidth: '960px'
    }
  }
})



class DialogComponent extends Component {



  async componentDidMount(){
    this.setState({mdmsRes: this.props.mdmsResCg})
    this.props.prepareFinalObject('mdmsRes', this.props.mdmsResCg)

    if(this.props.updateData!=={})
    {
        this.setState({updateData: this.props.updateData})
        this.props.prepareFinalObject('updateData', this.props.updateData)
    }else 
    {   
        this.setState({updateData: {}})
        this.props.prepareFinalObject('updateData', {})
    }

 
}

componentDidUpdate(prevProps){

    
    if(this.props.updateData !== prevProps.updateData){

        this.setState({mdmsRes: this.props.mdmsResCg})
        this.props.prepareFinalObject('mdmsRes', this.props.mdmsResCg)
        this.setState({updateData: this.props.updateData, errors: {}})
        this.props.prepareFinalObject('updateData', this.props.updateData)
        if(Object.keys(this.props.updateData).length === 0){
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
      
    }


    validate (){

        let temp= {}
        const submitData= this.state.updateData
        //temp.locality=submitData.locality? false: true
        temp.category=submitData.category? false: true
        temp.ratePerDay=submitData.ratePerDay?false: true
        temp.bookingVenue=submitData.bookingVenue? false: true
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
              
              "GfcpFeeDetails":[
                {
                    locality: null,
                    category:this.state.updateData.category,
                    ratePerDay:this.state.updateData.ratePerDay,
                    bookingVenue:this.state.updateData.bookingVenue,
                    fromDate : `${this.state.updateData.fromDate} ${time}`
                }
             ],
            }
            const responseStatus = await httpRequest(
                  
              "bookings/master/gfcp/fee/_create",
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
                "GfcpFeeDetails":[
                  {
                      id: this.state.updateData.id,
                      locality: this.state.updateData.locality,
                      category:this.state.updateData.category,
                      ratePerDay:this.state.updateData.ratePerDay,
                      bookingVenue:this.state.updateData.bookingVenue,
                      fromDate : `${this.state.updateData.fromDate} ${time}`
                  }
                ]
                }
              const responseStatus = await httpRequest(
                    
                "bookings/master/gfcp/fee/_update",
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
        console.log(this.state.mdmsRes, "owl")
       
        const {classes, prepareFinalObject} =this.props
        return (

      
        Object.keys(this.state.mdmsRes).length === 0?<div > <CircularProgress style={{position: "fixed" , top: '50%', left: '50%'}} /> </div>:
        
       
        <div>

        <Dialog
            classes={{ paper :classes.dialogStyle}}
            maxWidth="md"
            open={this.props.open}
            onClose={this.props.handleClose}
            aria-labelledby="form-dialog-title"
         >
        <DialogTitle id="form-dialog-title">Edit Commercial Ground Fee Master</DialogTitle>
         
        <DialogContent>
          <DialogContentText style={{margin : '15px '}}>
            Please fill the form to update fee master of Commercial Ground
          </DialogContentText>
          
          <div className="col-xs-12 col-sm-12"   > 
          <div className="col-xs-12 col-sm-6"   >

            
          <TextFieldContainer 
            error={this.state.errors.bookingVenue }
            select="true"
            optionValue="code"
            optionLabel="code"
            label={{
                labelName : "Booking Venue",
                labelKey: "BK_CG_ADMIN_BOOKING_VENUE_LABEL",
            }}
            placeholder= {{
                labelName: "Booking Venue",
                labelKey: "BK_CG_ADMIN_BOOKING_VENUE_LABEL",
            }}
            onChange={(e, key, value)=> { 
            
              let updateData =this.state.updateData
              updateData.bookingVenue= e.target.value
              let errors= {...this.state.errors}
              errors.bookingVenue=""
              this.setState({updateData: updateData, errors: errors})
              prepareFinalObject('updateData.bookingVenue', e.target.value)
              
            }}
            required= "true" 
            sourceJsonPath= "mdmsRes.Booking_Vanue"
            jsonPath="updateData.bookingVenue"
             
            gridDefination= {{
                xs: 12,
                sm: 6
            }}
         />
           
                
            </div> 
          <div className="col-xs-12 col-sm-6"   >

        <TextFieldContainer 
            error={this.state.errors.category }
            select="true"
            optionValue="code"
            optionLabel="code"
            label={{
                labelName : "Category",
                labelKey: "BK_CG_ADMIN_CATEGORY_LABEL",
            }}
            placeholder= {{
                labelName: "Category",
                labelKey: "BK_CG_ADMIN_CATEGORY_LABEL",
            }}
            onChange={(e, key, value)=> { 
            
              let updateData =this.state.updateData
              updateData.category= e.target.value
              let errors= {...this.state.errors}
              errors.category=""
              this.setState({updateData: updateData, errors: errors})
              prepareFinalObject('updateData.category', e.target.value)
            }}
            required= "true" 
            sourceJsonPath= "mdmsRes.Commerical_Ground_Cat"
            jsonPath="updateData.category"
            
            gridDefination= {{
                xs: 12,
                sm: 6
            }}
         />
         </div> 
          </div> 
          <div className="col-xs-12 col-sm-12"   > 
         
        <div className="col-xs-12 col-sm-6"   > 
         <TextFieldContainer

            type= {"number"}
            error={this.state.errors.ratePerDay }
            label={{
            labelName : "Rate Per Day",
            labelKey: "BK_CG_ADMIN_RATE_PER_DAY_LABEL",
            }}
            onChange={(e, value) => {
              let updateData = {...this.state.updateData}
              let errors= {...this.state.errors}
              errors.ratePerDay=""
              updateData.ratePerDay= e.target.value
              this.setState({updateData:updateData, errors:errors})
              prepareFinalObject('updateData.ratePerDay', e.target.value)
            }}
            
            fullWidth="true"
            placeholder= {{
            labelName: "Rate Per Day",
            labelKey: "BK_CG_ADMIN_RATE_PER_DAY_LABEL",
             }}
            jsonPath="updateData.ratePerDay"
             
            InputLabelProps={{
            shrink: true,
           }}
          /> 
          </div>
          <div className="col-xs-12 col-sm-6">
          <TextFieldContainer 
            error={this.state.errors.fromDate }
            
            optionValue="code"
            optionLabel="code"
            label={{
                labelName : "Valid From Date",
                labelKey: "BK_CG_ADMIN_VALID_FROM_DATE_LABEL",
            }}
            placeholder= {{
                labelName: "Valid From Date",
                labelKey: "BK_CG_ADMIN_VALID_FROM_DATE_LABEL",
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



export default withStyles(useStyle)(connect(
  mapStateToProps,
  mapDispatchToProps
)( DialogComponent) )