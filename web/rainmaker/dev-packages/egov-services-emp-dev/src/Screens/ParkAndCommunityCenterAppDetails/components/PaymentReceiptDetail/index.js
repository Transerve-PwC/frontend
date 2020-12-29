import React, { Component } from "react";
import { Tabs, Card, TextField, Icon, Button,TextFieldIcon } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import isEmpty from "lodash/isEmpty";
import CircularProgress from "@material-ui/core/CircularProgress";
import { httpRequest } from "egov-ui-kit/utils/api";
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { Paper } from '@material-ui/core';
import SearchIcon from "material-ui/svg-icons/action/search";



class CGBookingDetails extends Component {


  state = {
   ReceiptNumber: "",
   Date: ""
  };

  onFromDateChange = e => {
    const Date = e.target.value;
    this.setState({
      Date
    })
  }

  ReceiptNumberChange = e => {
    const ReceiptNumber = e.target.value;
    this.setState({
      ReceiptNumber
    })
  }

render() {

  const { PaymentReceiptNumber, transactionDate, transactionDateChange, handleChange} = this.props

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
                
                <Label label="BK_MYBK_PAYMENT_RCPT_DETAILS" containerStyle={{ marginLeft: "13px" }} labelClassName="dark-heading" />
              </div>
              <div key={10} className="complaint-detail-full-width">
              
              <div className="complaint-detail-detail-section-status row">
             
<div className="col-sm-6 col-xs-12">
          <TextField
            id="PaymentReceiptNumber"
            name="PaymentReceiptNumber"
            type="string"
            value={PaymentReceiptNumber}
            required = {true}
            hintText={
              <Label
                label="BK_MYBK_RECEIPT_NUMBER"
                color="rgba(0, 0, 0, 0.3799999952316284)"
                fontSize={16}
                labelStyle={hintTextStyle}
              />
            }
            floatingLabelText={
              <Label
                key={0}
                label="BK_MYBK_RECEIPT_NUMBER"
                color="rgba(0,0,0,0.60)"
                fontSize="12px"
              />
            }
            onChange={handleChange('PaymentReceiptNumber')}
            underlineStyle={{ bottom: 7 }}
            underlineFocusStyle={{ bottom: 7 }}
            hintStyle={{ width: "100%" }}
          />
        
        </div>

        <div className="col-sm-6 col-xs-12" style={{ minHeight: '72px', paddingTop: "10px" }}>
                  <TextField
                    id="transactionDate"
                    name="transactionDate"
                    value={transactionDate}
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
                            </div>
                          </div>
            </div>
         
        }
      />
    </div>
  );
}
}

export default CGBookingDetails;
