
import CircularProgress from "@material-ui/core/CircularProgress";
import { httpRequest } from "egov-ui-kit/utils/api";
import TableUi from '../Table/index'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { Paper } from '@material-ui/core';
import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Button, TextFieldIcon } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import   DialogComponent from './DialogComponent'
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from "material-ui/svg-icons/action/search";
import {getDateInEpoch, epochToYmd} from "egov-ui-framework/ui-utils/commons"
import { connect } from "react-redux";

const styles=theme=>({

 
  addIcon: {
    visibility: 'hidden'
  },
  [theme.breakpoints.only('xs')]: {
    addIcon: {
      visibility: 'visible'
    }
  }
})

class SimpleTable extends React.Component {

  
  async componentDidMount(){
    
    let mdmsBody = {

        MdmsCriteria: {
            tenantId: "ch",
            moduleDetails: [
                {
                    moduleName: "tenant",
                    masterDetails: [
                        {
                            name: "tenants",
                        },
                    ],
                },
                {
                    moduleName: "Booking",
                    masterDetails: [
                      
                        {
                            name: "CityType",
                        },
                       
                        {
                          name: "Area",
                      },
                       
                        {
                            name: "Duration",
                        },
                        {
                            name: "VillageCity",
                        },
                        {
                            name: "Type_of_Construction",
                        },
                        
                    ],
                },
            ],
        },
    };
    
  
      
      const {MdmsRes:{Booking}} = await httpRequest(
            
        "/egov-mdms-service/v1/_search",
        "_search",
        [],
        mdmsBody
      );
  
    
       this.setState({mdmsResOsbm: Booking})
       console.log(this.state.mdmsResOsbm, "stateresponse")
  

    this.setState({updateData: {}})
    
    this.fetchTableData()
  
     
    }


  async fetchTableData(){
    this.setState({isLoading: true})
    
    const headers=[   
      "Id",
      "Village/City",
      "Residential / Commercial",
      "Storage",
      "Duration In Months",
      "Construction Type",
      "Amount In Rs.",
      "Last Modified Date",
      "Created Date",
      "Valid From Date", 
      "Valid To Date", 
      "Action"
    ]

    const foundUser = this.props.userInfo && this.props.userInfo.roles.some(el => el.code === 'BK_MCC_HELPDESK_USER');
    if(foundUser)
    {

    let feeResponse = await httpRequest(
        "bookings/master/osbm/fee/_fetch",
        "_search",
        [],[]
      );
      let  feeData=this.state.data
      let feeDataRes=feeResponse.data
      
      feeData.headers=headers  
      feeData.rows= feeDataRes
      this.setState({data: feeData})
    }  
    else{
        let feeData={}
        feeData.headers=headers
        feeData.rows= []
        this.setState({data: feeData})
      }
      
      this.setState({isLoading: false})
  }
    

  state = {
    
    searchValue : '',
    data:{
      rows: [],
      headers: []
    },
    mdmsRes: {}, 
    sectorList: [],
    page: 0,
    rowsPerPage: 5,
    isLoading: true, 
    open: false,
    updateData: {},
    columnHideIndex:[0],
    mdmsResOsbm: {},
    filterfun: {
      fn: (item) => {
        return item;
      }
    }, 
    validFromDate :''

  };
  
  handleEditClick (row) {
     
     let fromDateData= new Date(row.fromDate) 
     fromDateData = new Date(fromDateData.getTime() + 86400000)  //adding 1 day in mili second
     fromDateData= epochToYmd(fromDateData)
     
     let updateData={}
     Object.assign(updateData, row)
     updateData.fromDate= fromDateData

     this.setState({updateData})
     this.setState({validFromDate: fromDateData})
     this.handleClickOpen();
   }
  
 

  handleClickOpen() {
    this.setState({ open: true });
  }

  handleClose() {
    this.setState({ open: false });
    this.setState({ updateData: {} });
    this.fetchTableData()
  }

    
  handleSearch(e) {
    const target = e.target;
    let filterfun = this.state.filterfun;
    filterfun.fn = (item) => {
      if (target.value === "") return item;
      else {
        return item.filter(
          (x) =>
          x.villageCity.toLowerCase().includes(target.value.toLowerCase()) ||
          x.residentialCommercial.toLowerCase().includes(target.value.toLowerCase()) ||
          x.storage.toLowerCase().includes(target.value.toLowerCase()) ||
          x.durationInMonths.toString().includes(target.value) ||
          x.constructionType.toLowerCase().includes(target.value.toLowerCase()) ||
          x.amount.toString().includes(target.value) 
        );
      }
    };
    this.setState({ filterfun: filterfun });
  }

  handleCreateNew(){
    this.setState({updateData: {}})
    this.setState({validFromDate: new Date()})
    this.setState({open: true})
  }

  render() {
    
   const emptyRows =
   this.state.rowsPerPage - Math.min(this.state.rowsPerPage, this.state.data.length - this.state.page * this.state.rowsPerPage);
   const {classes}= this.props
    return (
      this.state.isLoading===true ? <div > <CircularProgress style={{position: "fixed" , top: '50%', left: '50%'}} /> </div>:
     <div> 
        <div align ="right"  >
         <Button primary={true}  label="Create New" style={{margin: '15px'}} onClick={()=>{ this.handleCreateNew() }}/>
        
          
      </div>  
      
      
      
      
      <div class="col-xs-12 " style={{ wordBreak: "break-word"}}>

        <Paper style={{overflowX: 'auto'}}>
        <div> 
        <div  style={{display: "flex", justifyContent: "space-between" }}>
        <div style={{width: '75%', margin: '10px' }}>
        <TextFieldIcon
                textFieldStyle={{ height: "48px" , width: '100%'}}
                inputStyle={{
                  marginTop: "4px",
                  left: 0,
                  position: "absolute",
                }}
                iconPosition="after"
                onChange={(e) => {   
                  this.setState({searchValue: e.target.value}) 
                  this.handleSearch(e)}}
                underlineShow={true}
                fullWidth={false}
                hintText={<Label label="BK_ADMIN_SEARCH_BUTTON" />}
                Icon={SearchIcon}
                value={this.state.searchValue}
                id="search-mdms"
                iconStyle={{
                  height: "20px",
                  width: "35px",
                  fill: "#767676",
                }}
              />
              </div>
              
              <IconButton  style={{margin: '10px'}} className={classes.addIcon} size="small" aria-label="add" onClick={()=>this.handleCreateNew()}>
                                  <AddCircleOutlineIcon
                                    size="small"
                                    style={{ fontSize: "20px" }}
                                  />
                                </IconButton>
         </div>
        
        <TableUi data={this.state.data}    columnHideIndex={this.state.columnHideIndex} filterfun={this.state.filterfun} handleEditClick={this.handleEditClick.bind(this)} />
        </div>
        
        </Paper>
        <div>
         <DialogComponent  mdmsResOsbm ={ this.state.mdmsResOsbm} validFromDate={ this.state.validFromDate} open={this.state.open}   handleClose={this.handleClose.bind(this)} updateMasterData={this.state.updateData} /> 
        </div>
        </div> 
    
          
      </div> 
    );
  }
}





const mapStateToProps = state => {
  console.log('state in all app', state)
  
  const { userInfo } = state.auth;

  return {userInfo}
};


export default withStyles(styles)(connect(
  mapStateToProps,
  null
)(SimpleTable))