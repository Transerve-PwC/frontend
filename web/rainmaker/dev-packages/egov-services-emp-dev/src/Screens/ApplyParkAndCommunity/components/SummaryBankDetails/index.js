import React, { Component } from "react";
import { Card, Image, Icon, Button } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import isEmpty from "lodash/isEmpty";
import { connect } from "react-redux";
import "./index.css";
import EditIcon from '@material-ui/icons/Edit';
class CGBookingDetails extends Component {

  render() {
    const {BankAccountName,NomineeName,BankAccountNumber,IFSCCode,AccountHolderName,accountType,firstStep} = this.props;
return (
      <div>
        <Card
          textChildren={
            <div>
              <div className="rainmaker-displayInline">
                {/*BK_MYKB_BANK_DETAILS*/}
                <Label label="BANK DETAILS" containerStyle={{ marginLeft: "13px" }} labelClassName="dark-heading" />
                <button
                        style={{ color: "#FE7A51", border: "none", outline: "none", fontWeight: "650", float: 'right',marginLeft: "73%", marginRight: '43px', marginTop: '-11px', background: "white" }}
                        onClick={(e)=>this.props.firstStep(e)}
                        >  
                        <EditIcon />
                        <h5 style={{ fontSize: "14px", marginTop: "-27px", marginBottom: "15px", marginLeft: "59px" }}>
                            Edit
                       
              </h5>
                    </button>
              </div>
              <div key={10} className="complaint-detail-full-width">
              
              <div className="complaint-detail-detail-section-status row">
              <div className="col-md-4">
                                <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="Bank Name" />
                                <Label
                                    labelStyle={{ color: "inherit" }}
                                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                                    id="complaint-details-complaint-number"
                                    label={BankAccountName}
                                />
                            </div>
                            <div className="col-md-4">
                                <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="Nominee Name" />
                                <Label
                                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                                    id="complaint-details-current-status"
                                    labelStyle={{ color: "inherit" }}
                                    label={NomineeName}
                                />
                            </div>
                            <div className="col-md-4">
                                <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="Bank Account Number" />
                                <Label
                                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                                    id="complaint-details-current-status"
                                    labelStyle={{ color: "inherit" }}
                                    label={BankAccountNumber}
                                />
                            </div>
                            <div className="col-md-4">
                                <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="IFSC Code" />
                                <Label
                                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                                    id="complaint-details-current-status"
                                    labelStyle={{ color: "inherit" }}
                                    label={IFSCCode}
                                />
                            </div>
                            <div className="col-md-4">
                                <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_AccountHolderName" />
                                <Label
                                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                                    id="complaint-details-current-status"
                                    labelStyle={{ color: "inherit" }}
                                    label={AccountHolderName}
                                />
                            </div>
                            <div className="col-md-4">
                                <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="Bank Account Type" />
                                <Label
                                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                                    id="complaint-details-current-status"
                                    labelStyle={{ color: "inherit" }}
                                    label={accountType}
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
