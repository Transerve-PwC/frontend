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
    // }else if(!re.test(this.props.email)){
    //   this.props.toggleSnackbarAndSetText(
    //     true,
    //     {
    //       labelName: "Please enter valid email address",
    //       labelKey: `BK_ERROR_MESSAGE_EMAIL_VALIDATION`
    //     },
    //     "warning"
    //   );
    // }else if(!mb.test(this.props.mobileNo)){
    //   this.props.toggleSnackbarAndSetText(
    //     true,
    //     {
    //       labelName: "Please enter valid mobile number",
    //       labelKey: `BK_ERROR_MESSAGE_FOR_MOBILE_VALIDATION`
    //     },
    //     "warning"
    //   );

    // }
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
    console.log('facilitationCharges==1',facilitationCharges,'finalRent===1',applicationPmode)
    
   
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
console.log('arrayData',arrayData)

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
        
       {/* <div className="col-sm-6 col-xs-6">
          <TextField
            id="bankName"
            name="bankName"
            type="text"
            required = {true}
            value={bankName}
            hintText={
              <Label
                label="BK_MYBK_BANK_NAME_PLACEHOLDER"
                color="rgba(0, 0, 0, 0.3799999952316284)"
                fontSize={16}
                labelStyle={hintTextStyle}
              />
            }
            floatingLabelText={
              <Label
                key={0}
                label="BK_MYBK_CREATE_BANK_NAME"
                color="rgba(0,0,0,0.60)"
                fontSize="12px"
              />
            }
            onChange={handleChange('bankName')}
            underlineStyle={{ bottom: 7 }}
            underlineFocusStyle={{ bottom: 7 }}
            hintStyle={{ width: "100%" }}
          />
        </div>
         */}
        <div className="col-sm-6 col-xs-6">
          <TextField
            id="transactionNumber"
            name="transactionNumber"
            type="string"
            required = {true}
            value={transactionNumber}
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
          {/* <Select
            maxWidth={false}
            labelId="demo-controlled-open-select-label-Locality"
            id="demo-controlled-open-select-locality"
            open={this.state.SetOpen}
            onClose={() => this.handleClose()}
            onOpen={() => this.handleOpen()}
            value={paymentMode}
            displayEmpty
            onChange={handleChange('paymentMode')}
          >
             {arrayData.map((child, index) => (
            <MenuItem value={child.name}>{child.name}</MenuItem>
            ))}
           
          </Select> */}
        </FormControl>          
          {/* <TextField
            id="paymentMode"
            name="paymentMode"
            type="text"
            required = {true}
            value={paymentMode}
            hintText={
              <Label
                label="BK_MYBK_PAYMENTMODE_PLACEHOLDER"
                color="rgba(0, 0, 0, 0.3799999952316284)"
                fontSize={16}
                labelStyle={hintTextStyle}
              />
            }
            floatingLabelText={
              <Label
                key={0}
                label="BK_MYBK_CREATE_PAYMENTMODE"
                color="rgba(0,0,0,0.60)"
                fontSize="12px"
              />
            }
            onChange={handleChange('paymentMode')}
            underlineStyle={{ bottom: 7 }}
            underlineFocusStyle={{ bottom: 7 }}
            hintStyle={{ width: "100%" }}
          /> */}
        
        </div>    
        
        <div className="col-sm-6 col-xs-6">
          <TextField
            id="amount"
            name="amount"
            type="number"
            required = {true}
            value={amount}
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
            onChange={handleChange('finalRent')}
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
                    hintText={
                      <Label
                        color="rgba(0, 0, 0, 0.3799999952316284)"
                        required = {true}   
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
        
{/*         
        
        
          <TextField
            id="transactionDate"
            name="transactionDate"
            type="text"
            required = {true}
            value={transactionDate}
            hintText={
              <Label
                label="BK_MYBK_TRDATE_PLACEHOLDER"
                color="rgba(0, 0, 0, 0.3799999952316284)"
                fontSize={16}
                labelStyle={hintTextStyle}
              />
            }
            floatingLabelText={
              <Label
                key={0}
                label="BK_MYBK_CREATE_TRDATE"
                color="rgba(0,0,0,0.60)"
                fontSize="12px"
              />
            }
            onChange={handleChange('transactionDate')}
            underlineStyle={{ bottom: 7 }}
            underlineFocusStyle={{ bottom: 7 }}
            hintStyle={{ width: "100%" }}
          /> */}
        
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
  console.log('state 22222222222222222',state)
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