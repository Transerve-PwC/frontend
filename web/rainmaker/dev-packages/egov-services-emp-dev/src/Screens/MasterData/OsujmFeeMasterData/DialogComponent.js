import { Button,  TextField } from "components";
import { httpRequest } from "egov-ui-kit/utils/api";
import React, { Component } from 'react'
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import CircularProgress from "@material-ui/core/CircularProgress";
import { withStyles } from "@material-ui/core/styles";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import TextFieldContainer from 'egov-ui-framework/ui-containers/TextFieldContainer'
import { connect } from "react-redux";

const useStyle= theme=>({
  dialogStyle: {
    minWidth: '960px',
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

      this.setState({sectorList: this.props.sectorList})
      this.props.prepareFinalObject('mdmsRes.sectorList', this.props.sectorList)
      this.props.prepareFinalObject('mdmsRes.slabList', [{code: "1st"},{code: "2nd"},{code: "3rd"},{code: "4th"},{code: "5th"},])

        if(this.props.updateData!=={})
        {
            this.setState({updateData: this.props.updateData})
            this.props.prepareFinalObject('updateDataObject', this.props.updateData)
        }else 
        {   
            this.setState({updateData: {}})
            this.props.prepareFinalObject('updateDataObject', {})
            
        }
    
     
    }

    componentDidUpdate(prevProps){
    
        
        if(this.props.updateData !== prevProps.updateData){

          this.setState({sectorList: this.props.sectorList})
          this.props.prepareFinalObject('mdmsRes.sectorList', this.props.sectorList)
          this.props.prepareFinalObject('mdmsRes.slabList', [{code: "1st"},{code: "2nd"},{code: "3rd"},{code: "4th"},{code: "5th"},])

            this.setState({updateData: this.props.updateData, errors: {}})
            this.props.prepareFinalObject('updateDataObject', this.props.updateData)


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
        sectorList: [] , 
        mdmsRes:{}
      
    }


    validate (){

        let temp= {}
        const submitData= this.state.updateData
        temp.sector=submitData.sector? false: true
        temp.slab=submitData.slab? false: true
        temp.areaFrom=submitData.areaFrom? false: true
        temp.areaTo=submitData.areaTo? false: true
        temp.ratePerSqrFeetPerDay=submitData.ratePerSqrFeetPerDay? false: true
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
              
              "OsujmFeeDetails":[
                {
                    "sector": this.state.updateData.sector,
                    "slab":this.state.updateData.slab,
                    "areaFrom":this.state.updateData.areaFrom,
                    "areaTo":this.state.updateData.areaTo,
                    "ratePerSqrFeetPerDay":this.state.updateData.ratePerSqrFeetPerDay,
                    "fromDate" : `${this.state.updateData.fromDate} ${time}`
                    
                }
              ]
              }
            const responseStatus = await httpRequest(
                  
              "bookings/master/osujm/fee/_create",
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
              
                "OsujmFeeDetails": [

                  {

                    "id": this.state.updateData.id,
                    "sector": this.state.updateData.sector,
                    "slab":this.state.updateData.slab,
                    "areaFrom":this.state.updateData.areaFrom,
                    "areaTo":this.state.updateData.areaTo,
                    "ratePerSqrFeetPerDay":this.state.updateData.ratePerSqrFeetPerDay,
                    "fromDate" : `${this.state.updateData.fromDate} ${time}`
                    
  
                  }
                 
                 ]
                }
              const responseStatus = await httpRequest(
                    
                "bookings/master/osujm/fee/_update",
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
        
       
        const {classes, prepareFinalObject} =this.props
        return (

      
          this.state.sectorList.length === 0 ?<div > <CircularProgress style={{position: "fixed" , top: '50%', left: '50%'}} /> </div>  :
        
        
        <div> 
        <div>

        <Dialog
            classes={{ paper :classes.dialogStyle}}
            minWidth="md"
            open={this.props.open}
            onClose={this.props.handleClose}
            aria-labelledby="form-dialog-title"
         >
        <DialogTitle id="form-dialog-title">Edit Open Space Under MCC Juridiction Fee Master</DialogTitle>
         
        <DialogContent style={{overflow : 'auto'}}>
          <DialogContentText style={{margin : '15px '}}>
            Please fill the form to update fee master of Open Space Under MCC Juridiction
          </DialogContentText>
          <div className="col-xs-12 col-sm-12">
          <div className="col-xs-12 col-sm-6">
          <TextFieldContainer 
            error={this.state.errors.slab }
            select="true"
            optionValue="code"
            optionLabel="code"
            label={{
                labelName : "Slab",
                labelKey: "BK_OSUJM_ADMIN_SLAB_LABEL",
            }}
            placeholder= {{
                labelName: "Slab",
                labelKey: "BK_OSUJM_ADMIN_SLAB_LABEL",
            }}
            onChange={(e, key, value)=> { 
            
              let updateData =this.state.updateData
              updateData.slab= e.target.value
              let errors= {...this.state.errors}
              errors.slab=""
              this.setState({updateData: updateData, errors: errors})
              prepareFinalObject('updateDataObject.slab', e.target.value)
            }}
            required= "true" 
            sourceJsonPath= "mdmsRes.slabList"
            jsonPath="updateDataObject.slab"
            
            gridDefination= {{
                xs: 12,
                sm: 6
            }}
         />
         
            </div> 
          
          <div className="col-xs-12 col-sm-6">
          <TextFieldContainer 
            error={this.state.errors.sector }
            select="true"
            optionValue="code"
            optionLabel="code"
            label={{
                labelName : "Sector",
                labelKey: "BK_OSUJM_ADMIN_SECTOR_LABEL",
            }}
            placeholder= {{
                labelName: "Sector",
                labelKey: "BK_OSUJM_ADMIN_SECTOR_LABEL",
            }}
            onChange={(e, key, value)=> { 
            
              let updateData =this.state.updateData
              updateData.sector= e.target.value
              let errors= {...this.state.errors}
              errors.sector=""
              this.setState({updateData: updateData, errors: errors})
              prepareFinalObject('updateDataObject.sector', e.target.value)
            }}
            required= "true" 
            sourceJsonPath= "mdmsRes.sectorList"
            jsonPath="updateDataObject.sector"
            
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
            error={this.state.errors.areaFrom }
            label={{
            labelName : "Area From",
            labelKey: "BK_OSUJM_ADMIN_AREA_FROM_LABEL",
            }}
            onChange={(e, value) => {
              let updateData = {...this.state.updateData}
              let errors= {...this.state.errors}
              errors.areaFrom=""
              updateData.areaFrom= e.target.value
              this.setState({updateData:updateData, errors:errors})
              prepareFinalObject('updateDataObject.areaFrom', e.target.value)
            }}
            fullWidth="true"
            placeholder= {{
            labelName: "Area From",
            labelKey: "BK_OSUJM_ADMIN_AREA_FROM_LABEL",
             }}
            jsonPath="updateDataObject.areaFrom"
             
            InputLabelProps={{
            shrink: true,
           }}
           type="number"
          />
          </div>
          <div className="col-xs-12 col-sm-6">  
          <TextFieldContainer
            error={this.state.errors.areaTo }
            type="number"
            label={{
            labelName : "Area To",
            labelKey: "BK_OSUJM_ADMIN_AREA_TO_LABEL",
            }}
            onChange={(e, value) => {
              let updateData = {...this.state.updateData}
              let errors= {...this.state.errors}
              errors.areaTo=""
              updateData.areaTo= e.target.value
              this.setState({updateData:updateData, errors:errors})
              prepareFinalObject('updateDataObject.areaTo', e.target.value)
            }}
            fullWidth="true"
            placeholder= {{
            labelName: "Area To",
            labelKey: "BK_OSUJM_ADMIN_AREA_TO_LABEL",
             }}
            jsonPath="updateDataObject.areaTo"
             
            InputLabelProps={{
            shrink: true,
           }}
           
          />

          </div>
          </div>
          <div className="col-xs-12 col-sm-12">
          <div className="col-xs-12 col-sm-6">
          <TextFieldContainer
            type="number"
            error={this.state.errors.ratePerSqrFeetPerDay }
            label={{
            labelName : "Rate Per SqrFeet Per Day",
            labelKey: "BK_OSUJM_ADMIN_RATE_LABEL",
            }}
            onChange={(e, value) => {
              let updateData = {...this.state.updateData}
              let errors= {...this.state.errors}
              errors.ratePerSqrFeetPerDay=""
              updateData.ratePerSqrFeetPerDay= e.target.value
              this.setState({updateData:updateData, errors:errors})
              prepareFinalObject('updateDataObject.ratePerSqrFeetPerDay', e.target.value)
            }}
            fullWidth="true"
            placeholder= {{
            labelName: "Rate Per SqrFeet Per Day",
            labelKey: "BK_OSUJM_ADMIN_RATE_LABEL",
             }}
            jsonPath="updateDataObject.ratePerSqrFeetPerDay"
             
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
                labelKey: "BK_OSUJM_ADMIN_VALID_FROM_DATE_LABEL",
            }}
            placeholder= {{
                labelName: "Valid From Date",
                labelKey: "BK_OSUJM_ADMIN_VALID_FROM_DATE_LABEL",
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
            
            jsonPath="updateDataObject.fromDate"
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