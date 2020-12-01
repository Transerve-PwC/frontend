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

  render() {

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
              <div className="col-md-4">
                                {/* <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_PAYMENT_RCPT_NO_LABEL" />
                                <Label
                                    labelStyle={{ color: "inherit" }}
                                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                                    id="complaint-details-complaint-number"
                                    label={firstName}
                                />
                            </div>
                            <div className="col-md-4">
                                <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_APPLICANT_DETAILS_EMAIL" />
                                <Label
                                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                                    id="complaint-details-current-status"
                                    labelStyle={{ color: "inherit" }}
                                    label={email}
                                />
                            </div>
                            <div className="col-md-4">
                                <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_APPLICANT_MOBILENUMBER" />
                                <Label
                                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                                    id="complaint-details-current-status"
                                    labelStyle={{ color: "inherit" }}
                                    label={mobileNo}
                                /> */}


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
                // onChange={(e) => {   
                //   this.setState({searchValue: e.target.value}) 
                //   this.handleSearch(e)}}
                underlineShow={true}
                fullWidth={false}
                hintText={<Label label="BK_ADMIN_SEARCH_BUTTON" />}
                Icon={SearchIcon}
                // value={this.state.searchValue}
                id="search-mdms"
                iconStyle={{
                  height: "20px",
                  width: "35px",
                  fill: "#767676",
                }}
              />
              </div>
         </div>
        </div>
        
        </Paper>

<div className="col-sm-6 col-xs-6">
          <TextField
            id="email"
            name="email"
            type="string"
            value={"email"}
            required = {true}
            hintText={
              <Label
                label="BK_MYBK_CITIZEN_EMAIL_PLACEHOLDER"
                color="rgba(0, 0, 0, 0.3799999952316284)"
                fontSize={16}
                // labelStyle={hintTextStyle}
              />
            }
            floatingLabelText={
              <Label
                key={0}
                label="BK_MYBK_CREATE_CITIZEN_EMAIL"
                color="rgba(0,0,0,0.60)"
                fontSize="12px"
              />
            }
            // onChange={handleChange('email')}
            underlineStyle={{ bottom: 7 }}
            underlineFocusStyle={{ bottom: 7 }}
            hintStyle={{ width: "100%" }}
          />
        
        </div>


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
