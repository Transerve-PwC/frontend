import React, { Component } from 'react';
import { Tabs, Card, TextField, Icon, Button } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";
import { connect } from "react-redux";
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import Grid from '@material-ui/core/Grid';
import Footer from "../../../../modules/footer"
import { fetchApplications, fetchApplicaionSector } from "egov-ui-kit/redux/bookings/actions";
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import MenuItem from '@material-ui/core/MenuItem';
import "./index.css";
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
class ApplicatInfo extends Component {
  state = {
    open: false, setOpen: false
  }
  componentDidMount = async () => {

    let {
      role,
      userInfo, fetchApplicaionSector,
    } = this.props;
    fetchApplicaionSector();}
  
  continue = e => {
    let re = /\S+@\S+\.\S+/;
    let mb=/^\d{10}$/;
    e.preventDefault();
    if(this.props.amount==""||this.props.transactionDate==""){


      this.props.toggleSnackbarAndSetText(
        true,
        {
          labelName: "Error_Message_For_fill_all_fields",
          labelKey: `BK_ERROR_MESSAGE_FILLED_VALIDATION`
        },
        "warning"
      );
    }
 else{this.props.nextStep();}
    
  }
  onCitizenNameChange = e => {

  }
  handleClose = () => {
    this.setState({
      setOpen: false
    })
  };

  handleOpen = () => {
    this.setState({
      setOpen: true
    })
  };
  back = e => {
    e.preventDefault();
    this.props.prevStep();
  }
  render() {
    let { bankName, transactionNumber,finalRent,facilitationCharges,applicationPmode,  discountType,rent, paymentMode, amount,transactionDate,transactionDateChange, handleChange } = this.props;

    let sectorData=[];
    sectorData.push(applicationPmode);
    let arrayData=[];
    let y=sectorData.forEach((item,index)=>{
      if(item){
    let finalValues=Object.values(item);
    finalValues.forEach((event)=>{
          arrayData.push(event);
      })
    }
    })


    const hintTextStyle = {
      letterSpacing: "0.7px",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      width: "90%",
      overflow: "hidden"
    };
    return (
      <div style={{float: 'left', width: '100%', padding: '36px 15px' }}>
      <div className="col-xs-12" style={{background:'#fff', padding: '15px 0'}}>
        <div className="col-sm-6 col-xs-6">
          <TextField
            id="transactionNumber"
            name="transactionNumber"
            type="string"
            value={transactionNumber}
            required = {true} 
            hintText={
              <Label
                label="BK_MYBK_TRANSACTION_NUMBER_PLACEHOLDER"
                color="rgba(0, 0, 0, 0.3799999952316284)"
                fontSize={16}
                labelStyle={hintTextStyle}
              />
            }
            floatingLabelText={
              <Label
                key={0}
                label="BK_MYBK_CREATE_TRANSACTION_NUMBER"
                color="rgba(0,0,0,0.60)"
                fontSize="12px"
              />
            }
            onChange={handleChange('transactionNumber')}
            underlineStyle={{ bottom: 7 }}
            underlineFocusStyle={{ bottom: 7 }}
            hintStyle={{ width: "100%" }}
          />
        
        </div>
        
        <div className="col-sm-6 col-xs-6">
        <FormControl style={{ width: '100%' }}>
        <InputLabel shrink style={{ width: '100%' }} id="demo-controlled-open-select-label"><Label  
                  required = {true}   
                  label="BK_MYBK_PAYMENT_MODE"
                /></InputLabel>
          <Select
            maxWidth={false}
            required = {true}   
            labelId="demo-controlled-open-select-label-Locality"
            id="demo-controlled-open-select-locality"
            open={this.state.SetOpen}
            onClose={() => this.handleClose()}
            onOpen={() => this.handleOpen()}
            value={paymentMode}
            displayEmpty
            onChange={handleChange('paymentMode')}
          >
             <MenuItem value="" disabled>Payment Mode</MenuItem>
             {arrayData.map((child, index) => (
            <MenuItem value={child.name}>{child.name}</MenuItem>
            ))}
           
          </Select>
        </FormControl>
        
        </div>    
        
        <div className="col-sm-6 col-xs-6">
          <TextField
            id="amount"
            name="amount"
            type="number"
            value={rent}
            required = {true}   
            hintText={
              <Label
                label="BK_MYBK_AMOUNT_PLACEHOLDER"
                color="rgba(0, 0, 0, 0.3799999952316284)"
                fontSize={16}
                labelStyle={hintTextStyle}
              />
            }
            floatingLabelText={
              <Label
                key={0}
                label="BK_MYBK_CREATE_AMOUNT"
                color="rgba(0,0,0,0.60)"
                fontSize="12px"
              />
            }
            onChange={handleChange('amount')}
            underlineStyle={{ bottom: 7 }}
            underlineFocusStyle={{ bottom: 7 }}
            hintStyle={{ width: "100%" }}
          />
        
        </div>    
        <div className="col-sm-6 col-xs-6">
        
        <TextField
                    id="transactionDate"
                    name="transactionDate"
                    value={transactionDate}
                    required = {true}   
                    hintText={
                      <Label
                        color="rgba(0, 0, 0, 0.3799999952316284)"
                        fontSize={16}
                        labelStyle={hintTextStyle}
                      />
                    }
                  
                    floatingLabelText={
                      <Label
                        key={1}
                        label="BK_MYBK_TRDATE_PLACEHOLDER"
                        color="rgba(0,0,0,0.60)"
                        fontSize="12px"
                      />
                    }
                    onChange={(e, value) => transactionDateChange(e)}
                    underlineStyle={{
                      bottom: 7,
                      borderBottom: "1px solid #e0e0e0"
                    }}
                    underlineFocusStyle={{
                      bottom: 7,
                      borderBottom: "1px solid #e0e0e0"
                    }}
                    hintStyle={{ width: "100%" }}

                    type="date"
                    defaultValue="2017-05-24"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
        
        </div>    
      
        <Footer className="apply-wizard-footer" style={{ display: 'flex', justifyContent: 'flex-end' }} children={
          <div className="col-sm-12 col-xs-12" style={{textAlign: 'right'}}>
          <Button
              className="responsive-action-button"
              primary={true}
              label={<Label buttonLabel={true} label="BK_CORE_COMMON_GOBACK" />}
              fullWidth={true}
              onClick={this.back}
              style={{ marginRight: 18 }}
              startIcon={<ArrowBackIosIcon />}
            />
          
          
          <Button
            className="responsive-action-button"
            primary={true}
            label={<Label buttonLabel={true} label="BK_CORE_COMMON_GONEXT" />}
            fullWidth={true}
            onClick={this.continue}
            startIcon={<ArrowForwardIosIcon />}
          />
        
        </div> 
        }></Footer>
      </div> 
      </div>
    );
  }
}



const mapStateToProps = state => {
  const { bookings, common, auth, form } = state;
  let {applicationPmode}=bookings
  return {
    applicationPmode
  }
}
const mapDispatchToProps = dispatch => {
  return {
      toggleSnackbarAndSetText: (open, message, error) =>
      dispatch(toggleSnackbarAndSetText(open, message, error)),
      fetchApplicaionSector: () =>
      dispatch(fetchApplicaionSector()),
  }
}


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ApplicatInfo);