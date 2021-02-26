import React from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import {
  LabelContainer,
  DownloadFileContainer
} from "egov-ui-framework/ui-containers";
import { convertEpochToDate } from "egov-ui-framework/ui-config/screens/specs/utils";
import {
    convertDateInDMY
} from "../../ui-config/screens/specs/utils/index";
import {
  
  getUserInfo,
} from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
//import "./index.css";

export const getCurrentStatus = status => {
  switch (status) {
    case "INITIATED":
      return "Initiated";
    case "APPLIED":
      return "Pending for Document verification";
    case "FIELDINSPECTION":
      return "Pending for Field inspection";
    case "PENDINGPAYMENT":
      return "Pending payment";
    case "PENDINGAPPROVAL":
      return "Pending approval";
    case "APPROVED":
      return "Approved";
  }
};

const RoomDetailsComponents = ({ currentObj, index }) => {
  let userData1=getUserInfo()
  var userData = JSON.parse(userData1);
  
  return (
    <Grid
      container={true}
      spacing={12}
      style={{ paddingLeft: 10, paddingBottom: 20 }}
    >
      {/* <Grid
        item
        xs={12}
        sm={6}
        md={4}
        lg={2}
        style={{ marginTop: 15, paddingRight: 20 }}
      >
        <Typography variant="caption">
          <LabelContainer labelName="Room Application No." labelKey="Room Application No." />
        </Typography>
        <Typography variant="body2">
          <LabelContainer
            labelName={get(currentObj, "roomApplicationNumber")}
          />
        </Typography>
      </Grid> */}
      <Grid
        item
        xs={12}
        sm={6}
        md={4}
        lg={2}
        style={{ marginTop: 15, paddingRight: 20 }}
      >
          <Typography variant="caption">
          <LabelContainer labelName="Type of Booked Room" labelKey="Type of Booked Room" />
        </Typography>
        <Typography variant="body2">
          <LabelContainer
            labelName={get(currentObj, "typeOfRooms")}
          />
        </Typography>
      </Grid>
      <Grid
        item
        xs={12}
        sm={6}
        md={4}
        lg={2}
        style={{ marginTop: 15, paddingRight: 20 }}
      > 
        <Typography variant="caption">
        <LabelContainer labelName="No. of Booked AC Rooms" labelKey="No. of Booked AC Rooms" />
        </Typography>
        <Typography variant="body2">
        <LabelContainer
            labelName={get(currentObj, "totalNoOfACRooms")}
        />
        </Typography>
        
      </Grid>
      <Grid
        item
        xs={12}
        sm={6}
        md={4}
        lg={2}
        style={{ marginTop: 15, paddingRight: 20 }}
      > 
        <Typography variant="caption">
        <LabelContainer labelName="No. of Booked NON AC Rooms" labelKey="No. of Booked NON AC Rooms" />
        </Typography>
        <Typography variant="body2">
        <LabelContainer
            labelName={get(currentObj, "totalNoOfNonACRooms")}
        />
        </Typography>
        
      </Grid>
      <Grid
        item
        xs={12}
        sm={6}
        md={4}
        lg={2}
        style={{ marginTop: 15, paddingRight: 20 }}
      >
        <Typography variant="caption">
          <LabelContainer labelName="From Date" labelKey="From Date" />
        </Typography>
        <Typography variant="body2">
          <LabelContainer
            labelName={convertDateInDMY(
              get(currentObj, "fromDate")
            )}
          />
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} style={{ marginTop: 15 }}>
      <Typography variant="caption">
          <LabelContainer labelName="To Date" labelKey="To Date" />
        </Typography>
        <Typography variant="body2">
          <LabelContainer
            labelName={convertDateInDMY(
              get(currentObj, "toDate")
            )}
          />
        </Typography>
      </Grid>
    
    </Grid>
  );
};

export default RoomDetailsComponents;
