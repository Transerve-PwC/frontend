import React, { Component } from "react";
import { Image, Card, Icon } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import FloatingActionButton from "material-ui/FloatingActionButton";
import "./index.css";

class SuccessMessage extends Component {
  render() {
    const { successmessage, employeeName, secondaryLabel, applicationNumber, tertiaryLabel, icon, backgroundColor } = this.props;
    const label1 = `Application No.${applicationNumber}`
    return (
      <div className="wt-app-details">
        <div className="container-fluid">
          <div className="row spl-application-header" style={{ marginTop: '40px', marginBottom: '30px', marginLeft: '-6px' }}>
            <div className="col-sm-6 spl-app-header-text">  <Label label={"BK_MYBK_PCC_APPLICATION_REQUEST"} /></div>
            {/* <div className="col-sm-5 spl-app-header-number" > <Label label={label1} /></div> */}
            {/* <div class="col-sm-5">  </div> */}
          </div>

        </div>
        <Card

          className="complaint-card" style={{ margin: '0px 21px', padding: '30px 8px' }}
          textChildren={
            <div className="complaint-card-wrapper" style={{
              paddingLeft: '20px',
              paddingBottom: '15px'
            }}>
              <div class="row">
                <div class="col-sm-1"> <FloatingActionButton className="floating-button" style={{ boxShadow: 0, marginTop: 15 }} backgroundColor={backgroundColor}>
                  {icon}
                </FloatingActionButton></div>
                <div class="col-sm-7" >
                  <Label className="thankyou-text" style={{ fontSize: 30, fontWeight: 'bold'}} label={successmessage} color="#767676" />
                  <Label className="thankyou-text-message" label={secondaryLabel} color="#767676" /></div>
                    <div class="col-sm-4 application-number-div">
                    <Label  className="application-text-one"    
                    labelClassName={"myDOC"}
                    label={"BK_MYBK_WATER_TANKER_REQUESTNO"} />
                    <Label className="application-text-two"  
                    labelClassName={"myDOC"}
                    label={applicationNumber} />
                     </div>
              </div>

            </div>
          }
        />
        <style>{
          `
            .wt-app-details .label-container.thankyou-text div{
              letter-spacing: 0.7px;
              font-size:27px !important;
            }
            .wt-app-details .label-container.thankyou-text-message div{
              letter-spacing: 0.7px;
              font-size:14px !important;
            }
            .wt-app-details .application-number-div .application-text-one div.label-text{float:right !important;font-weight:400;font-size:16px !important}
            .wt-app-details .application-number-div .application-text-two div.label-text{float:right !important;font-weight:500;font-size:24px !important}
            .wt-app-details .spl-application-header .spl-app-header-text div.label-text{font-size: 24px !important;font-weight: 400;}
            .wt-app-details .spl-application-header .spl-app-header-number{ background-color: rgba(0, 0, 0, 0.6);
              color: rgba(255, 255, 255, 0.87);
              margin-left: 8px;
              padding-left: 19px;
              padding-right: 19px;
              text-align: center;
              vertical-align: middle;
              line-height: 35px;
              font-size: 16px;}
              .wt-app-details .spl-application-header .spl-app-header-number .label-container div{color:white}
            `
        }
        </style>
      </div>




    );
  }
}

export default SuccessMessage;
