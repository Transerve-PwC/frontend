import React, { Component } from "react";
import { Tabs, TextField, Card, Icon, Button,TextFieldIcon } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { connect } from "react-redux";
import get from "lodash/get";
import { toggleSpinner } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "material-ui/svg-icons/action/search";
import { withStyles } from "@material-ui/core/styles";
import { Paper } from '@material-ui/core';
import "./index.css";
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";

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


class CGBookingDetails extends Component {

  state = {
    ReceiptNumber: "",
    MNumber: "",
    paidByChange: "",
    firstOption: true,
    SecondOption: false,
    thirdOption: false,
    fourthOption: false,
    PaymentMode : '',
    OfflineBankName : '',
    OfflineBranchName : ''
   };

  ToFccOne = (ifscCode) => {

    const { prepareFinalObject, toggleSnackbarAndSetText } = this.props;
   console.log("ToFccOne--",ifscCode)
    if (ifscCode) {
      fetch(`https://ifsc.razorpay.com/${ifscCode}`)
        .then(response => {
          return response.json();
        })
        .then(payload => {
          if (payload === "Not Found") {
            toggleSnackbarAndSetText(
              true,
              {
                labelName: "ERR_BANK_DETAILS_NOT_FOUND_FOR_IFSC",
                labelKey: `ERR_BANK_DETAILS_NOT_FOUND_FOR_IFSC`
              },
              "error"  
            );
          } else {
            const bankName = get(payload, "BANK");
            const bankBranch = get(payload, "BRANCH");   
            this.setState({
              OfflineBankName: bankName,
              OfflineBranchName: bankBranch
            })  
              prepareFinalObject("OfflineBank.name", bankName)
              prepareFinalObject(
                "OfflineBranch.name",
                bankBranch
              )
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

   ReceiptNumberChange = e => {
    const paidByChange = e.target.value;
    this.setState({
      paidByChange
    })
  }
   
  ReceiptNumberChange = e => {
    const ReceiptNumber = e.target.value;
    this.setState({
      ReceiptNumber
    })
  }
  onFromDateChange = e => {
    const Date = e.target.value;
    this.setState({
      MNumber
    })
  }

  GOTOCASH = e => {
    console.log("GOTOCASH--")
    this.setState({
      SecondOption: false,
      fourthOption: false,
      thirdOption: false,
      firstOption: true
    })
  }
  Second = e => {
    alert("hello Second"),
    this.setState({
      thirdOption: false,
      fourthOption: false,
      firstOption: false,
      SecondOption: true
    })
  }
//Third
Third = e => {
  alert("hello Third"),
  this.setState({
    thirdOption: true,
    fourthOption: false,
    SecondOption: false,
    firstOption: false
  })
}
//Fourth
Fourth = e => {
  alert("hello Fourth"),
  this.setState({
    fourthOption: true,
    thirdOption: false,
    SecondOption: false,
    firstOption: false
  })
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

  render() {
    const {classes}= this.props

    const {PayerName, mobileNo,handleChange,PaidBy,PaymentReceiptNumber, ApplicantMobNum, ApplicantName,ChequeNo,ChequeDate,IFSC,BankName,last4Digits,TrxNo,repeatTrxNo,
      BankBranch,DDno,ddDate,ddIFSC,ddBank,ddBranch,prepareFinalObject,changeChequeDate,changeDdDate} = this.props;
console.log("propsInpaymentOption--",this.props)
console.log("stateOfPaymentOption--",this.state.OfflineBranchName ? this.state.OfflineBranchName : "fgh")
console.log("stateOfPay--",this.state.OfflineBankName ? this.state.OfflineBankName : " sdfg")
   
const hintTextStyle = {
      letterSpacing: "0.7px",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      width: "90%",
      overflow: "hidden"
    };
return (
      <div>

<Card
  textChildren={
    <div>
       <div className="rainmaker-displayInline">      
       <Label label="BK_MYBK_PAYMENT_CAP_PMT" containerStyle={{ marginLeft: "13px" }} labelClassName="dark-heading" />              </div>
    <div key={10} className="complaint-detail-full-width">
    
    <div className="complaint-detail-detail-section-status row">
    <div className="col-xs-12" style={{ paddingLeft: 8 }}>
    <div className="col-sm-3 col-xs-12" style={{ paddingLeft: 8 }}>
             <button
              style={{ color: "#FE7A51", border: "none", outline: "none", fontWeight: "500", float: 'left',background: "white" }}
              // className="ViewPaymentModeButton"
              onClick={(e)=>this.GOTOCASH(e)}
              >
              <h5 style={{ fontSize: "14px", marginTop: "-7px", marginBottom: "15px", marginLeft: "28px" }}>
                  CASH
             
         </h5>
      </button>
      </div>
      <div className="col-sm-3 col-xs-12" style={{ paddingLeft: 8 }}>
      <button
              style={{ color: "#FE7A51", border: "none", outline: "none", fontWeight: "500", float: 'left',background: "white" }}
              // className="ViewPaymentModeButton"
              onClick={(e)=>this.Second(e)}
              >
              <h5 style={{ fontSize: "14px", marginTop: "-7px", marginBottom: "15px", marginLeft: "-107px" }}>
              CHEQUE 
         </h5>
      </button>
      </div>
      <div className="col-sm-3 col-xs-12" style={{ paddingLeft: 8 }}>
      <button
              style={{ color: "#FE7A51", border: "none", outline: "none", fontWeight: "500", float: 'left',background: "white" }}
              // className="ViewPaymentModeButton"
              onClick={(e)=>this.Third(e)}
              >
              <h5 style={{ fontSize: "14px", marginTop: "-7px", marginBottom: "15px", marginLeft: "-239px" }}>
              DD
         </h5>
      </button>
      </div>
      <div className="col-sm-3 col-xs-12" style={{ paddingLeft: 8 }}>
      <button
              style={{ color: "#FE7A51", border: "none", outline: "none", fontWeight: "500", float: 'left',background: "white" }}
              // className="ViewPaymentModeButton"
              onClick={(e)=>this.Fourth(e)}
              >
              <h5 style={{ fontSize: "14px", marginTop: "-7px", marginBottom: "15px", marginLeft: "-367px" }}>
              Credit/DebitCard
         </h5>
      </button>
      </div>
    </div>
    <hr class="MuiDividerLine" style={{ marginbottom: "16px" }}></hr>
    {this.state.firstOption == true ?  
    <div>
    <div className="col-xs-12" style={{ paddingLeft: 8 }}>
    <div className="col-sm-6 col-xs-12">
    <FormControl style={{ width: '100%' }}>
      <InputLabel shrink style={{ width: '100%' }} id="demo-controlled-open-select-label"><Label
        required={true}
        label="BK_MYBK_PAYMENT_PAID_BY_LABEL"
      /></InputLabel>
      <Select
        maxWidth={false}
        required={true}
        labelId="demo-controlled-open-select-label"
        id="demo-controlled-open-select"
        open={this.state.SetOpen}
        displayEmpty
        onClose={() => this.handleClose()}
        onOpen={() => this.handleOpen()}
        value={PaidBy}
        onChange={handleChange('PaidBy')}
      >
        <MenuItem value="" disabled>BK_MYBK_PAYMENT_PAID_BY_LABEL</MenuItem>
        <MenuItem value='OWNER'>OWNER</MenuItem>
        <MenuItem value='OTHER'>OTHER</MenuItem>
      </Select>
    </FormControl>
</div>
<div className="col-sm-6 col-xs-12">
<TextField
            id="PayerName"
            name="PayerName"
            type="string"
            value={ApplicantName}
            required = {true}
            hintText={
              <Label
                label="BK_MYBK_PAYMENT_PAYER_NAME_LABEL"
                color="rgba(0, 0, 0, 0.3799999952316284)"
                fontSize={16}
                labelStyle={hintTextStyle}
              />
            }
            floatingLabelText={
              <Label
                key={0}
                label="BK_MYBK_PAYMENT_PAYER_NAME_LABEL"
                color="rgba(0,0,0,0.60)"
                fontSize="12px"
              />
            }
            onChange={handleChange('PayerName')}
            underlineStyle={{ bottom: 7 }}
            underlineFocusStyle={{ bottom: 7 }}
            hintStyle={{ width: "100%" }}
          />
</div>
</div>
<div className="col-xs-12" style={{ paddingLeft: 8 }}>
<div className="col-sm-6 col-xs-12">
<TextField
            id="Number"
            name="Number"
            type="Number"
            value={ApplicantMobNum}
            required = {true}  
            hintText={
              <Label
                label="BK_MYBK_PAYER_MOB_LABEL"
                color="rgba(0, 0, 0, 0.3799999952316284)"
                fontSize={16}
                labelStyle={hintTextStyle}
              />
            }
            floatingLabelText={
              <Label
                key={0}
                label="BK_MYBK_PAYER_MOB_LABEL"
                color="rgba(0,0,0,0.60)"
                fontSize="12px"
              />
            }
            onChange={handleChange('mobileNo')}
            underlineStyle={{ bottom: 7 }}
            underlineFocusStyle={{ bottom: 7 }}
            hintStyle={{ width: "100%" }}
          />   
</div>
</div>
{prepareFinalObject("paymentMode","Cash")}
</div>
: ""
  }
</div>
{this.state.SecondOption == true ? 
<div>
<div className="col-xs-12" style={{ paddingLeft: 8 }}>
<div className="col-sm-6 col-xs-12">
    <FormControl style={{ width: '100%' }}>
      <InputLabel shrink style={{ width: '100%' }} id="demo-controlled-open-select-label"><Label
        required={true}
        label="BK_MYBK_PAYMENT_PAID_BY_LABEL"
      /></InputLabel>
      <Select
        maxWidth={false}
        required={true}
        labelId="demo-controlled-open-select-label"
        id="demo-controlled-open-select"
        open={this.state.SetOpen}
        displayEmpty
        onClose={() => this.handleClose()}
        onOpen={() => this.handleOpen()}
        value={PaidBy}
        onChange={handleChange('PaidBy')}
      >
        <MenuItem value="" disabled>BK_MYBK_PAYMENT_PAID_BY_LABEL</MenuItem>
        <MenuItem value='OWNER'>OWNER</MenuItem>
        <MenuItem value='OTHER'>OTHER</MenuItem>
      </Select>
    </FormControl>
</div>
<div className="col-sm-6 col-xs-12">
<TextField
            id="PayerName"
            name="PayerName"
            type="string"
            value={ApplicantName}
            required = {true}
            hintText={
              <Label
                label="BK_MYBK_PAYMENT_PAYER_NAME_LABEL"
                color="rgba(0, 0, 0, 0.3799999952316284)"
                fontSize={16}
                labelStyle={hintTextStyle}
              />
            }
            floatingLabelText={
              <Label
                key={0}
                label="BK_MYBK_PAYMENT_PAYER_NAME_LABEL"
                color="rgba(0,0,0,0.60)"
                fontSize="12px"
              />
            }
            onChange={handleChange('PayerName')}
            underlineStyle={{ bottom: 7 }}
            underlineFocusStyle={{ bottom: 7 }}
            hintStyle={{ width: "100%" }}
          />
</div>
</div>
<div className="col-xs-12" style={{ paddingLeft: 8 }}>
<div className="col-sm-6 col-xs-12">
<TextField
            id="Number"
            name="Number"
            type="Number"
            value={ApplicantMobNum}
            required = {true}  
            hintText={
              <Label
                label="BK_MYBK_PAYER_MOB_LABEL"
                color="rgba(0, 0, 0, 0.3799999952316284)"
                fontSize={16}
                labelStyle={hintTextStyle}
              />
            }
            floatingLabelText={
              <Label
                key={0}
                label="BK_MYBK_PAYER_MOB_LABEL"
                color="rgba(0,0,0,0.60)"
                fontSize="12px"
              />
            }
            onChange={handleChange('mobileNo')}
            underlineStyle={{ bottom: 7 }}
            underlineFocusStyle={{ bottom: 7 }}
            hintStyle={{ width: "100%" }}
          />   
</div>
</div>
 <div className="col-xs-12" style={{ paddingLeft: 8 }}>   
<div className="col-sm-6 col-xs-12">
          <TextField
            id="ChequeNo"
            name="ChequeNo"
            type="string"
            value={ChequeNo}
            required = {true}
            hintText={
              <Label
                label="Enter Cheque  no."
                color="rgba(0, 0, 0, 0.3799999952316284)"
                fontSize={16}
                labelStyle={hintTextStyle}
              />
            }
            floatingLabelText={
              <Label
                key={0}
                label="Enter Cheque  no."
                color="rgba(0,0,0,0.60)"
                fontSize="12px"
              />
            }
            onChange={handleChange('ChequeNo')}
            underlineStyle={{ bottom: 7 }}
            underlineFocusStyle={{ bottom: 7 }}
            hintStyle={{ width: "100%" }}
          />
        </div>
        <div className="col-sm-6 col-xs-12" style={{ minHeight: '72px', paddingTop: "10px" }}>
                  <TextField
                  id="ChequeDate"
                  name="ChequeDate"
                  value={ChequeDate}
                    hintText={
                      <Label
                        color="rgba(0, 0, 0, 0.3799999952316284)"
                        fontSize={16}
                        labelStyle={hintTextStyle}
                      />
                    }
                    // errorText={<Label label={errorText} color="red" />}
                    floatingLabelText={
                      <Label
                        key={1}
                        label="Enter Cheque Date"
                        color="rgba(0,0,0,0.60)"
                        fontSize="12px"
                      />
                    }
                    onChange={(e, value) => changeChequeDate(e)}
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
      
        <div className="col-sm-6 col-xs-12">
        <TextFieldIcon
              style={{ width: "474px" }}
               hintText={
              <Label
                label="IFSC"
                color="rgba(0, 0, 0, 0.3799999952316284)"
                fontSize={16}
                labelStyle={hintTextStyle}
              />
            }

           floatingLabelText={
              <Label
                key={0}
                label="IFSC"
                color="rgba(0,0,0,0.60)"
                fontSize="12px"
              />
            }   
                id="IFSC"
                name="IFSC"
                value={IFSC}
				        required = {true}
                iconPosition="after"
                className = "setWidth"
                textFieldStyle = {{width: "474px"}}
                onChange={handleChange('IFSC')}
                underlineStyle={{
                  bottom: 7,
                  borderBottom: "1px solid #e0e0e0"
                }}
                underlineFocusStyle={{
                  bottom: 7,
                  borderBottom: "1px solid #e0e0e0"
                }}                     
                hintStyle={{ width: "100%" }}
                underlineShow={true}
                fullWidth={false}
                Icon={SearchIcon} 
                onIconClick= {(e)=>{this.ToFccOne(IFSC)}}  
                id="search-mdms"
                // iconStyle={{
                //   height: "20px",
                //   // width: "35px",
                //   width: "474px",
                //   fill: "#767676",
                // }}
              />
        </div>
        <div className="col-sm-6 col-xs-12">
          <TextField
            id="BankName"
            name="BankName"
            type="text"
            value={this.state.OfflineBankName ? this.state.OfflineBankName : " "}
            required = {true}
            hintText={
              <Label
                label="Enter bank name"
                color="rgba(0, 0, 0, 0.3799999952316284)"
                fontSize={16}
                labelStyle={hintTextStyle}
              />
            }
            floatingLabelText={
              <Label
                key={0}
                label="Enter bank name"
                color="rgba(0,0,0,0.60)"
                fontSize="12px"
              />
            }
            onChange={handleChange('BankName')}
            underlineStyle={{ bottom: 7 }}
            underlineFocusStyle={{ bottom: 7 }}
            hintStyle={{ width: "100%" }}
          />
        </div>
       
        <div className="col-sm-6 col-xs-12">
          <TextField
            id="BankBranch"
            name="BankBranch"
            type="text"
            value={this.state.OfflineBranchName ? this.state.OfflineBranchName : " "}
            required = {true}
            hintText={
              <Label
                label="Enter bank branch"
                color="rgba(0, 0, 0, 0.3799999952316284)"
                fontSize={16}
                labelStyle={hintTextStyle}
              />
            }
            floatingLabelText={
              <Label
                key={0}
                label="Enter bank branch"
                color="rgba(0,0,0,0.60)"
                fontSize="12px"
              />
            }
            onChange={handleChange('BankBranch')}
            underlineStyle={{ bottom: 7 }}
            underlineFocusStyle={{ bottom: 7 }}
            hintStyle={{ width: "100%" }}
          />
        </div>
        {prepareFinalObject("paymentMode","Cheque")}
        </div>
        </div>
: " "}
{this.state.thirdOption == true ? 
<div>
<div className="col-xs-12" style={{ paddingLeft: 8 }}>
<div className="col-sm-6 col-xs-12">
    <FormControl style={{ width: '100%' }}>
      <InputLabel shrink style={{ width: '100%' }} id="demo-controlled-open-select-label"><Label
        required={true}
        label="BK_MYBK_PAYMENT_PAID_BY_LABEL"
      /></InputLabel>
      <Select
        maxWidth={false}
        required={true}
        labelId="demo-controlled-open-select-label"
        id="demo-controlled-open-select"
        open={this.state.SetOpen}
        displayEmpty
        onClose={() => this.handleClose()}
        onOpen={() => this.handleOpen()}
        value={PaidBy}
        onChange={handleChange('PaidBy')}
      >
        <MenuItem value="" disabled>BK_MYBK_PAYMENT_PAID_BY_LABEL</MenuItem>
        <MenuItem value='OWNER'>OWNER</MenuItem>
        <MenuItem value='OTHER'>OTHER</MenuItem>
      </Select>
    </FormControl>
</div>
<div className="col-sm-6 col-xs-12">
<TextField
            id="PayerName"
            name="PayerName"
            type="string"
            value={ApplicantName}
            required = {true}
            hintText={
              <Label
                label="BK_MYBK_PAYMENT_PAYER_NAME_LABEL"
                color="rgba(0, 0, 0, 0.3799999952316284)"
                fontSize={16}
                labelStyle={hintTextStyle}
              />
            }
            floatingLabelText={
              <Label
                key={0}
                label="BK_MYBK_PAYMENT_PAYER_NAME_LABEL"
                color="rgba(0,0,0,0.60)"
                fontSize="12px"
              />
            }
            onChange={handleChange('PayerName')}
            underlineStyle={{ bottom: 7 }}
            underlineFocusStyle={{ bottom: 7 }}
            hintStyle={{ width: "100%" }}
          />
</div>
</div>
<div className="col-xs-12" style={{ paddingLeft: 8 }}>
<div className="col-sm-6 col-xs-12">
<TextField
            id="Number"
            name="Number"
            type="Number"
            value={ApplicantMobNum}
            required = {true}  
            hintText={
              <Label
                label="BK_MYBK_PAYER_MOB_LABEL"
                color="rgba(0, 0, 0, 0.3799999952316284)"
                fontSize={16}
                labelStyle={hintTextStyle}
              />
            }
            floatingLabelText={
              <Label
                key={0}
                label="BK_MYBK_PAYER_MOB_LABEL"
                color="rgba(0,0,0,0.60)"
                fontSize="12px"
              />
            }
            onChange={handleChange('mobileNo')}
            underlineStyle={{ bottom: 7 }}
            underlineFocusStyle={{ bottom: 7 }}
            hintStyle={{ width: "100%" }}
          />   
</div>
</div>
<div className="col-xs-12" style={{ paddingLeft: 8 }}> 
<div className="col-sm-6 col-xs-12">
          <TextField
            id="DDno"
            name="DDno"
            type="string"
            value={DDno}
            required = {true}
            hintText={
              <Label
                label="Enter DD  no."
                color="rgba(0, 0, 0, 0.3799999952316284)"
                fontSize={16}
                labelStyle={hintTextStyle}
              />
            }
            floatingLabelText={
              <Label
                key={0}
                label="Enter DD  no."
                color="rgba(0,0,0,0.60)"
                fontSize="12px"
              />
            }
            onChange={handleChange('DDno')}
            underlineStyle={{ bottom: 7 }}
            underlineFocusStyle={{ bottom: 7 }}
            hintStyle={{ width: "100%" }}
          />
        </div>

        <div className="col-sm-6 col-xs-12" style={{ minHeight: '72px', paddingTop: "10px" }}>
                  <TextField
                    id="ddDate"
                    name="ddDate"
                    value={ddDate}
                    hintText={
                      <Label
                        color="rgba(0, 0, 0, 0.3799999952316284)"
                        fontSize={16}
                        labelStyle={hintTextStyle}
                      />
                    }
                    // errorText={<Label label={errorText} color="red" />}
                    floatingLabelText={
                      <Label
                        key={1}
                        label="PAYMENT_DD_DATE"
                        color="rgba(0,0,0,0.60)"
                        fontSize="12px"
                      />
                    }
                    onChange={(e, value) => changeDdDate(e)}
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

       <div className="col-sm-6 col-xs-12">
        <TextFieldIcon
              style={{ width: "474px" }}
               hintText={
              <Label
                label="IFSC"
                color="rgba(0, 0, 0, 0.3799999952316284)"
                fontSize={16}
                labelStyle={hintTextStyle}
              />
            }

           floatingLabelText={
              <Label
                key={0}
                label="IFSC"
                color="rgba(0,0,0,0.60)"
                fontSize="12px"
              />
            }   
                id="ddIFSC"
                name="ddIFSC"
                value={ddIFSC}
				        required = {true}
                iconPosition="after"
                className = "setWidth"
                textFieldStyle = {{width: "474px"}}
                onChange={handleChange('ddIFSC')}
                underlineStyle={{
                  bottom: 7,
                  borderBottom: "1px solid #e0e0e0"
                }}
                underlineFocusStyle={{
                  bottom: 7,
                  borderBottom: "1px solid #e0e0e0"
                }}                     
                hintStyle={{ width: "100%" }}
                underlineShow={true}
                fullWidth={false}
                Icon={SearchIcon} 
                onIconClick= {(e)=>{this.ToFccOne(ddIFSC)}}  
                id="search-mdms"
              />
        </div>
        {/* <div className="col-sm-6 col-xs-12">
          <TextField
            id="ddIFSC"
            name="ddIFSC"
            type="string"
            value={ddIFSC}
            required = {true}
            hintText={
              <Label
                label="Enter bank IFSC"
                color="rgba(0, 0, 0, 0.3799999952316284)"
                fontSize={16}
                labelStyle={hintTextStyle}
              />
            }
            floatingLabelText={
              <Label
                key={0}
                label="Enter bank IFSC"
                color="rgba(0,0,0,0.60)"
                fontSize="12px"
              />
            }
            onChange={handleChange('ddIFSC')}
            underlineStyle={{ bottom: 7 }}
            underlineFocusStyle={{ bottom: 7 }}
            hintStyle={{ width: "100%" }}
          />
        </div> */}
        <div className="col-sm-6 col-xs-12">
          <TextField
            id="ddBank"
            name="ddBank"
            type="string"
            value={this.state.OfflineBankName ? this.state.OfflineBankName : " "}
            required = {true}
            hintText={
              <Label
                label="Enter bank name"
                color="rgba(0, 0, 0, 0.3799999952316284)"
                fontSize={16}
                labelStyle={hintTextStyle}
              />
            }
            floatingLabelText={
              <Label
                key={0}
                label="Enter bank name"
                color="rgba(0,0,0,0.60)"
                fontSize="12px"
              />
            }
            onChange={handleChange('ddBank')}
            underlineStyle={{ bottom: 7 }}
            underlineFocusStyle={{ bottom: 7 }}
            hintStyle={{ width: "100%" }}
          />
        </div>


        <div className="col-sm-6 col-xs-12">
          <TextField
            id="ddBranch"
            name="ddBranch"
            type="string"
            value={this.state.OfflineBranchName ? this.state.OfflineBranchName : " "}
            required = {true}
            hintText={
              <Label
                label="Enter bank branch"
                color="rgba(0, 0, 0, 0.3799999952316284)"
                fontSize={16}
                labelStyle={hintTextStyle}
              />
            }
            floatingLabelText={
              <Label
                key={0}
                label="Enter bank branch"
                color="rgba(0,0,0,0.60)"
                fontSize="12px"
              />
            }
            onChange={handleChange('ddBranch')}
            underlineStyle={{ bottom: 7 }}
            underlineFocusStyle={{ bottom: 7 }}
            hintStyle={{ width: "100%" }}
          />
        </div>
   {prepareFinalObject("paymentMode","DD")}
        </div>
        </div>
: " "}
{/*fourth Step*/}

{this.state.fourthOption == true ? 
<div>
<div className="col-xs-12" style={{ paddingLeft: 8 }}>
<div className="col-sm-6 col-xs-12">
    <FormControl style={{ width: '100%' }}>
      <InputLabel shrink style={{ width: '100%' }} id="demo-controlled-open-select-label"><Label
        required={true}
        label="BK_MYBK_PAYMENT_PAID_BY_LABEL"
      /></InputLabel>
      <Select
        maxWidth={false}
        required={true}
        labelId="demo-controlled-open-select-label"
        id="demo-controlled-open-select"
        open={this.state.SetOpen}
        displayEmpty
        onClose={() => this.handleClose()}
        onOpen={() => this.handleOpen()}
        value={PaidBy}
        onChange={handleChange('PaidBy')}
      >
        <MenuItem value="" disabled>BK_MYBK_PAYMENT_PAID_BY_LABEL</MenuItem>
        <MenuItem value='OWNER'>OWNER</MenuItem>
        <MenuItem value='OTHER'>OTHER</MenuItem>
      </Select>
    </FormControl>
</div>
<div className="col-sm-6 col-xs-12">
<TextField
            id="PayerName"
            name="PayerName"
            type="string"
            value={ApplicantName}
            required = {true}
            hintText={
              <Label
                label="BK_MYBK_PAYMENT_PAYER_NAME_LABEL"
                color="rgba(0, 0, 0, 0.3799999952316284)"
                fontSize={16}
                labelStyle={hintTextStyle}
              />
            }
            floatingLabelText={
              <Label
                key={0}
                label="BK_MYBK_PAYMENT_PAYER_NAME_LABEL"
                color="rgba(0,0,0,0.60)"
                fontSize="12px"
              />
            }
            onChange={handleChange('PayerName')}
            underlineStyle={{ bottom: 7 }}
            underlineFocusStyle={{ bottom: 7 }}
            hintStyle={{ width: "100%" }}
          />
</div>
</div>
<div className="col-xs-12" style={{ paddingLeft: 8 }}>
<div className="col-sm-6 col-xs-12">
<TextField
            id="Number"
            name="Number"
            type="Number"
            value={ApplicantMobNum}
            required = {true}  
            hintText={
              <Label
                label="BK_MYBK_PAYER_MOB_LABEL"
                color="rgba(0, 0, 0, 0.3799999952316284)"
                fontSize={16}
                labelStyle={hintTextStyle}
              />
            }
            floatingLabelText={
              <Label
                key={0}
                label="BK_MYBK_PAYER_MOB_LABEL"
                color="rgba(0,0,0,0.60)"
                fontSize="12px"
              />
            }
            onChange={handleChange('mobileNo')}
            underlineStyle={{ bottom: 7 }}
            underlineFocusStyle={{ bottom: 7 }}
            hintStyle={{ width: "100%" }}
          />   
</div>
</div>
 <div className="col-xs-12" style={{ paddingLeft: 8 }}>
  <div className="col-sm-6 col-xs-12">
          <TextField
            id="last4Digits"
            name="last4Digits"
            type="string"
            value={last4Digits}
            required = {true}
            hintText={
              <Label
                label="Enter Last 4 digits of the card"
                color="rgba(0, 0, 0, 0.3799999952316284)"
                fontSize={16}
                labelStyle={hintTextStyle}
              />
            }
            floatingLabelText={
              <Label
                key={0}
                label="Enter Last 4 digits of the card"
                color="rgba(0,0,0,0.60)"
                fontSize="12px"
              />
            }
            onChange={handleChange('last4Digits')}
            underlineStyle={{ bottom: 7 }}
            underlineFocusStyle={{ bottom: 7 }}
            hintStyle={{ width: "100%" }}
          />
        </div>

        <div className="col-sm-6 col-xs-12">
          <TextField
            id="TrxNo"
            name="TrxNo"
            type="string"
            value={TrxNo}
            required = {true}
            hintText={
              <Label
                label="Enter transaction no."
                color="rgba(0, 0, 0, 0.3799999952316284)"
                fontSize={16}
                labelStyle={hintTextStyle}
              />
            }
            floatingLabelText={
              <Label
                key={0}
                label="Enter transaction no."
                color="rgba(0,0,0,0.60)"
                fontSize="12px"
              />
            }
            onChange={handleChange('TrxNo')}
            underlineStyle={{ bottom: 7 }}
            underlineFocusStyle={{ bottom: 7 }}
            hintStyle={{ width: "100%" }}
          />
        </div>

        <div className="col-sm-6 col-xs-12">
          <TextField
            id="repeatTrxNo"
            name="repeatTrxNo"
            type="string"
            value={repeatTrxNo}
            required = {true}
            hintText={
              <Label
                label="Re-Enter Transaction No."
                color="rgba(0, 0, 0, 0.3799999952316284)"
                fontSize={16}
                labelStyle={hintTextStyle}
              />
            }
            floatingLabelText={
              <Label
                key={0}
                label="Re-Enter Transaction No."
                color="rgba(0,0,0,0.60)"
                fontSize="12px"
              />
            }
            onChange={handleChange('repeatTrxNo')}
            underlineStyle={{ bottom: 7 }}
            underlineFocusStyle={{ bottom: 7 }}
            hintStyle={{ width: "100%" }}
          />
        </div>
        {prepareFinalObject("paymentMode","Card")}
        </div>
        </div>
: " "}

{/*end Of fourth Step*/}
</div>
</div>  
  }
/>         
</div>
  );
}
}

// const mapStateToProps = state => {

//   const { bookings, common, auth, form } = state;

//   let PaymentBankName = state.screenConfiguration.preparedFinalObject.OfflineBank.name ? state.screenConfiguration.preparedFinalObject.OfflineBank.name:"";  
//   console.log("PaymentBankName--",PaymentBankName)

//   let PaymentBranchName = state.screenConfiguration.preparedFinalObject.OfflineBranch.name ? state.screenConfiguration.preparedFinalObject.OfflineBranch.name:"";  
// console.log("PaymentBranchName--",PaymentBranchName)

// return{
//   PaymentBranchName,PaymentBankName
// }
  
// }


const mapDispatchToProps = dispatch => {
  return {
          prepareFinalObject: (jsonPath, value) =>
          dispatch(prepareFinalObject(jsonPath, value)),
          toggleSnackbarAndSetText: (open, message, error) =>
          dispatch(toggleSnackbarAndSetText(open, message, error)),
  }
}

// export default CGBookingDetails;
// export default connect(
//   null,
//   mapDispatchToProps
// )(CGBookingDetails);

export default withStyles(styles)(connect(
  null,
  mapDispatchToProps
)(CGBookingDetails))
