import React, { Component } from 'react'

import { Card, CardContent, Grid, Typography, Button } from "@material-ui/core";
import { Container } from "egov-ui-framework/ui-atoms";
import { LabelContainer } from "egov-ui-framework/ui-containers";
import HistoryIcon from "@material-ui/icons/History";
import { withStyles } from "@material-ui/core/styles";
import {  RoomDetailsComponents } from "../../ui-molecules-local";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { connect } from "react-redux";
import {
  prepareFinalObject,
 
} from "egov-ui-framework/ui-redux/screen-configuration/actions";


const styles = theme => ({
  card:  {
    backgroundColor: "rgb(242, 242, 242)",
    boxShadow: "none",
    borderRadius: 0,
    overflow: "visible"
  },
  button: {
    margin: theme.spacing.unit,
    color: "#FE7A51"
  },
  leftIcon: {
    marginRight: theme.spacing.unit
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  },
  iconSmall: {
    fontSize: 20
  }
});
class index extends Component {
  constructor(props) {
    super(props);

}
componentDidUpdate(preprops){

  console.log('roomprops', this.props.value)
 
}



handleViewDetails(applicationNumber,roomApplicationNumber , obj){
  this.props.prepareFinalObject("roomDetailPageData", obj)
  this.props.changeRoute(`/egov-services/roombooking-search-preview?applicationNumber=${applicationNumber}&tenantId=ch.chandigarh&businessService=BKROOM&roomapplicationNumber=${roomApplicationNumber}`)
}

prepareRoomCard(nonOptimisedRoomData){
  
  let tempArray = [];
  let roomModels= nonOptimisedRoomData
  var roomsData = roomModels
    .map((roomData) => {
      if (!tempArray.includes(roomData.roomApplicationNumber)) {
        tempArray.push(roomData.roomApplicationNumber);
        let slicearray = roomModels.slice(
          roomModels.findIndex((element) => {
            if (element === roomData) {
              return true;
            }
          }) + 1,
          roomModels.length
        );
        let duplicateObject = slicearray.filter(
          (data) =>
            data.roomApplicationNumber === roomData.roomApplicationNumber
        );
        if (duplicateObject.length > 0) {
          let newObj = {
            roomApplicationNumber: roomData.roomApplicationNumber,
            toDate: roomData.toDate,
            fromDate: roomData.fromDate,
            typeOfRooms: "BOTH"
          };
          if (duplicateObject[0].typeOfRoom === "NON-AC") {
            newObj.totalNoOfACRooms = roomData.totalNoOfRooms;
            newObj.totalNoOfNonACRooms = duplicateObject[0].totalNoOfRooms;
          } else {
            newObj.totalNoOfACRooms = duplicateObject[0].totalNoOfRooms;
            newObj.totalNoOfNonACRooms = roomData.totalNoOfRooms;
          }
          return newObj;
        } else {
          let newObj = {
            roomApplicationNumber: roomData.roomApplicationNumber,
            toDate: roomData.toDate,
            fromDate: roomData.fromDate
          };
          if (roomData.typeOfRoom === "NON-AC") {
            newObj.totalNoOfACRooms = 0;
            newObj.typeOfRooms = "NON-AC";
            newObj.totalNoOfNonACRooms = roomData.totalNoOfRooms;
          } else {
            newObj.totalNoOfACRooms = roomData.totalNoOfRooms;
            newObj.typeOfRooms = "AC";
            newObj.totalNoOfNonACRooms = 0;
          }
          return newObj;
        }
      }
      return;
    }).filter(Boolean);
    console.log('roomsData1234', roomsData)
    return roomsData
}

  render() {
   let {classes} =this.props
    return (
      
      <div>
        {this.props.value && this.prepareRoomCard(this.props.value.roomsModel).map((obj)=>{
          return(
            <Card className={classes.card}>
            <CardContent>
              <Container
                children={
                  <div style={{ width: "100%" }}>
                    <Grid container="true" spacing={12} marginTop={16}>
                      <Grid
                        style={{ alignItems: "center", display: "flex" }}
                        item
                        sm={6}
                        xs={6}
                      >
                        <Typography component="h2" variant="subheading">
                          <LabelContainer
                            labelName= {`Room Details for ${obj.roomApplicationNumber}`}
                            labelKey={`Room Details for ${obj.roomApplicationNumber}`}
                          />
                        </Typography>
                      </Grid>
                      <Grid item sm={6} xs={6} style={{ textAlign: "right" }}>
                        <Button
                          className={classes.button}
                          onClick={()=>{this.handleViewDetails(this.props.value.bkApplicationNumber, obj.roomApplicationNumber , obj)}}
                        >
                          <LabelContainer
                            labelName="VIEW DETAILS"
                            labelKey="VIEW DETAILS"
                            color="#FE7A51"
                          />
                        </Button>
                      </Grid>
                    </Grid>
                  <RoomDetailsComponents currentObj= {obj} />
                  </div>
                }
              />
            </CardContent>
          </Card>
        
          )
         

        })}
    </div>

    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    prepareFinalObject: (jsonPath, value) =>
            dispatch(prepareFinalObject(jsonPath, value)),
      changeRoute: (path) => dispatch(setRoute(path)),
  };
};

export default withStyles(styles)(connect(null, mapDispatchToProps)(index));
//export default withStyles(styles)(index)
