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
    
    this.props.prepareFinalObject('mdmsRes.sectorList', this.props.sectorList) 
    this.setState({roleCode: this.props.roleCode})
    this.props.prepareFinalObject('mdmsRes.roleCode', this.props.roleCode)
 
}

 async componentDidUpdate(prevProps){



    if(this.props.updateData !== prevProps.updateData){

        this.props.prepareFinalObject('mdmsRes.sectorList', this.props.sectorList)
        this.props.prepareFinalObject('mdmsRes.roleCode', this.props.roleCode)
        this.props.prepareFinalObject('updateData', this.props.updateData)
        this.setState({errors: {}})
        
     
        if(Object.keys(this.props.updateData).length === 0){
            
            this.setState({create: true})
            
        }
        else if(Object.keys(this.props.updateData).length > 3)
        {
            this.setState({create: false})
            
            
        }
        if(this.props.updateData.roleCode )
        {
         
          this.props.roleCode.map(async dt=>{
           
            if(dt.name===this.props.updateData.roleCode){
            
              this.props.prepareFinalObject('updateData.roleCode', dt.code)
              
              
              let updateData ={
                ...this.props.updateData, 
                roleCode: dt.code
                

              }
              this.setState({updateData: updateData})
              
              await this.fetchApproverFromRoleCode(dt.code)
              this.setState({hideUuid: false})
              this.state.approverList.map(dt=> {
            
                if(dt.name===this.props.updateData.name){
              
                  this.props.prepareFinalObject('updateData.uuid', dt.code)
                        
                  let updateDataNew ={
                    ...this.state.updateData, 
                    uuid: dt.code, 


                  }
                  
                  this.setState({updateData: updateDataNew})
                  
                }
              })
      
            }
          })
        }
      
    }
    
  
  }

    state={
        hideUuid : true, 
        updateData: {}, 
        errors: {},
        create: true, 
        mdmsRes: {}, 
        sectorList: [], 
        roleCode :[], 
        approverList : [], 
        
    }

     
    async fetchApproverFromRoleCode (role){

      let reqBody =  {
              
        "roleCode": role

      }
    
      const responseStatus = await httpRequest(
                
          'bookings/master/user/_search',
          "_search",
          [],
          reqBody
          
      );
        
       console.log(responseStatus, "res")
       let approverList=[]
       responseStatus.data.map((dt)=>{
         approverList.push({  code: `${dt.uuid}+${dt.id}`, name : dt.userName})
       })
       this.props.prepareFinalObject('approverList', approverList)
       this.setState({ approverList })
          
  }

    validate (){

        let temp= {}
        const submitData= this.state.updateData
        temp.sector=submitData.sector? false: true
        temp.uuid=submitData.uuid? false: true
        temp.roleCode=submitData.roleCode?false: true
        
        

        this.setState({errors: temp})

        return Object.values(temp).every(x => x=="")
    }

    async handleSubmit  (){

        if(this.validate()){

           if(this.state.create===true)
           {
            let requesetBodyParam= this.state.updateData.uuid.split('+')
            var reqBody =  {
              
              "ApproverDetails":[
                  {
                   
                      "sector": this.state.updateData.sector,
                      "uuid": requesetBodyParam[0],
                      "roleCode": this.state.updateData.roleCode,
                      "userId": requesetBodyParam[1]
                  }
               ],
           
            }
            const responseStatus = await httpRequest(
                
            "bookings/master/approver/_create",
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
            let requesetBodyParam= this.state.updateData.uuid.split('+')
            var reqBody =  {
              
              "ApproverDetails":[
                  {
                      "id": this.state.updateData.id,   
                      "sector": this.state.updateData.sector,
                      "uuid": requesetBodyParam[0],
                      "roleCode": this.state.updateData.roleCode,
                      "userId": requesetBodyParam[1]
                  }
               ],

              }
              const responseStatus = await httpRequest(
                  
              "bookings/master/approver/_update",
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
        
    }
    
    render() {
        
       
        const {classes, prepareFinalObject} =this.props
        return (

      
        Object.keys(this.props.sectorList).length === 0?<div > <CircularProgress style={{position: "fixed" , top: '50%', left: '50%'}} /> </div>:
        
        
        <div>
         
        <Dialog
            classes={{ paper :classes.dialogStyle}}
            maxWidth="md"
            open={this.props.open}
            onClose={this.props.handleClose}
            aria-labelledby="form-dialog-title"
         >
        <DialogTitle id="form-dialog-title">Edit Approver Master</DialogTitle>
         
        <DialogContent>
          <DialogContentText style={{margin : '15px '}}>
            Please fill the form to update Approver Details
          </DialogContentText>
          
          <div className="col-xs-12 col-sm-12"   > 
          <div className="col-xs-12 col-sm-6"   >

            
          <TextFieldContainer 
            error={this.state.errors.roleCode }
            select="true"
            optionValue="code"
            optionLabel="name"
            label={{
                labelName : "Role Code",
                labelKey: "BK_APPROVER_ADMIN_ROLE_CODE_LABEL",
            }}
            placeholder= {{
                labelName: "Role Code",
                labelKey: "BK_APPROVER_ADMIN_ROLE_CODE_LABEL",
            }}
            onChange={(e, key, value)=> { 
              
              let updateData =this.state.updateData
              updateData.roleCode= e.target.value
              let errors= {...this.state.errors}
              errors.roleCode=""
              this.setState({updateData: updateData, errors: errors})
              prepareFinalObject('updateData.roleCode', e.target.value)

              this.fetchApproverFromRoleCode(e.target.value)
              this.setState({hideUuid: false})
            }}
            required= "true" 
            sourceJsonPath= "mdmsRes.roleCode"
            jsonPath="updateData.roleCode"
             
            gridDefination= {{
                xs: 12,
                sm: 6
            }}
         />
         </div> 
         <div className="col-xs-12 col-sm-6"   >

        <TextFieldContainer 
            error={this.state.errors.sector }
            select="true"
            optionValue="code"
            optionLabel="code"
            label={{
                labelName : "Sector",
                labelKey: "BK_APPROVER_ADMIN_ADMIN_SECTOR_LABEL",
            }}
            placeholder= {{
                labelName: "Sector",
                labelKey: "BK_APPROVER_ADMIN_ADMIN_SECTOR_LABEL",
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
          
            
      </div>      
     <div className="col-xs-12 col-sm-12"   >   
     
     {this.state.hideUuid===true ?<div> </div> : 
      <div className="col-xs-12 col-sm-6"   >

        
            <TextFieldContainer 
              error={this.state.errors.uuid }
              select="true"
              optionValue="code"
              optionLabel="name"
              label={{
                  labelName : "User",
                  labelKey: "BK_APPROVER_ADMIN_UUID_LABEL",
              }}
              placeholder= {{
                  labelName: "User",
                  labelKey: "BK_APPROVER_ADMIN_UUID_LABEL",
              }}
              onChange={(e, key, value)=> { 
              
                let updateData =this.state.updateData
                updateData.uuid= e.target.value
                let errors= {...this.state.errors}
                errors.uuid=""
                this.setState({updateData: updateData, errors: errors})
                prepareFinalObject('updateData.uuid', e.target.value)
                
               
              }}
              required= "true" 
              sourceJsonPath= "approverList"
              jsonPath="updateData.uuid"
              
              gridDefination= {{
                  xs: 12,
                  sm: 6
              }}
            />
            </div> 
        }
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