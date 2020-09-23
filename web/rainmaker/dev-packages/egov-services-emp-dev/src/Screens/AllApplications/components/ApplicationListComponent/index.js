import React from "react";
import { Image, Card, Icon } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import { getDateFromEpoch } from "egov-ui-kit/utils/commons";
import isEmpty from "lodash/isEmpty";
import "./index.css";

export default class CustomComplaints extends React.Component{
    constructor(props){
        super(props);
        this.state = {

        }
     
    }

convertEpochToDate = (dateEpoch) => {
  const dateFromApi = new Date(dateEpoch);
  let month = dateFromApi.getMonth() + 1;
  let day = dateFromApi.getDate();
  let year = dateFromApi.getFullYear();
  month = (month > 9 ? "" : "0") + month;
  day = (day > 9 ? "" : "0") + day;
  return `${day}-${month}-${year}`;
};

    render(){
        const {complaints, complaintLocation, role, onComplaintClick, noComplaintMessage, heightOffset} = this.props
       
       console.log('complaints in component list',complaints)
        return !complaints ? (
          <div className="no-complaints-message-cont" style={heightOffset && { height: `calc(100vh - ${heightOffset})` }}>
            <Label label={noComplaintMessage} dark={true} fontSize={"16px"} labelStyle={{ letterSpacing: "0.7px" }} />
          </div>
        ) : (
          complaints.map((complaint, complaintIndex) => {
          
           
            const complaintHeader = complaint.header && "SERVICEDEFS." + complaint.header.toUpperCase();
            return (
              <div id={"complaint-" + complaintIndex} className="complaints-card-main-cont" key={`complaint-${complaintIndex}`}>
                <Card
                  className="complaint-card"
                  textChildren={
                    <div className="complaint-card-wrapper">

                      <div className="complaint-number-cont row application-format">
                        <div className="complaint-number complaint-date">
                          <Label fontSize="12px" className="col-md-6" label={"BK_MYBK_COMMON_APPLICATION_NO"} />
                          {/* <Label fontSize="12px" label={" : "} /> */}
                          <Label fontSize="12px" className="col-md-6" label={complaint.bkApplicationNumber} className="complaint-complaint-number" />
                        </div>
                      </div>

                      <div className="complaint-number-cont row application-format">
                        {/* <div className="complaint-number complaint-date"> */}
                          <Label fontSize="12px" className="col-md-6" label={"BK_MYBK_APPLICATION_DETAILS_CURRENT_STATUS"} />
                          {/* <Label fontSize="12px" label={" : "} /> */}
                          <Label fontSize="12px" className="col-md-6" label={'BK_'+complaint.bkApplicationStatus} className="complaint-complaint-number" />
                        {/* </div> */}
                      </div>
                      <div className="complaint-number-cont row application-format">
                        <div className="complaint-number complaint-date">
                          <Label fontSize="12px" className="col-md-6"   label={"BK_MYBK_APPLICATION_BOOKING_TYPE"} />
                          <Label fontSize="12px" className="col-md-6"   label={'BK_'+complaint.bkBookingType} className="complaint-complaint-number" />
                        </div>
                      </div>
                     
                      <div className="complaint-number-cont row application-format">
                        <div className="complaint-number complaint-date">
                          <Label fontSize="12px" className="col-md-6"   label={"BK_MYBK_APPLICATION_DETAILS_SUBMISSION_DATE"} />
                          <Label fontSize="12px" className="col-md-6"   label= {this.convertEpochToDate(
                      complaint.bkDateCreated,"dayend"
                    )} className="complaint-complaint-number" />
                        {/*label={complaint.bkDateCreated}*/}
                          {/* label= {this.convertEpochToDate(
                      dateCreated,"dayend"
                    )} */}
                        </div>
                      </div>
                   

                      {/* 
                      <div className="complaint-number-cont row">
                        <div className="complaint-number complaint-date">
                          <Label fontSize="12px" className="col-md-6"  label={"BK_MYBK_APPLICANT_SECTOR"} />
                          <Label fontSize="12px" className="col-md-6"  label={complaint.bkSector} className="complaint-complaint-number" />
                        </div>
                      </div> */}

                     <button style={{color:"#FE7A51",border: "none",fontWeight: "500",outline:"none", background: "white"}} onClick={(e) => {
                    onComplaintClick(encodeURIComponent(complaint.bkApplicationNumber),complaint.bkBookingType);
                  }}>VIEW DETAILS</button>
      
                    </div>
                  }
                />
              </div>
            );
          })
        );
    }
}