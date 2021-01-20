import React, { Component } from "react";
import { connect } from "react-redux";
import { MapLocation } from "../../ui-atoms-local";
import axios from 'axios'
import { defaultLocation } from "../../ui-config/hc-app-config";
import { Button, Icon } from "egov-ui-framework/ui-atoms";
import isEmpty from "lodash/isEmpty";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import "./index.scss";
import { MAP_API_KEY_FOR_ADDRESS, MAX_LENGTH_OF_ADDRESS } from "../../ui-config/hc-app-config";

const pickBtn = {
  display: "block"
};

var add = {};

class MapLocator extends Component {
 
  constructor(props) {
    
    
    super(props);
    this.state = {
      showMyAddress: true,
      currLoc: {},
      pickedLoc: {},
    };
  }

  componentDidMount() {
   
    
    let myLocation = {};
    
    if (this.state.showMyAddress === true && myLocation) {
      this.setState({
        currLoc: myLocation
      });
    }
  }

 
  getMyLocation = () => {
   
    // debugger
    if (navigator.geolocation) {

      navigator.geolocation.getCurrentPosition(position => {
        // debugger
        // console.log("po", position)
        this.setState({
            currLoc: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              // address:this.displayLocation(position.coords.latitude, position.coords.longitude)
            }
          });
          // console.log("po", this.state)
        },
        function (error) {
          console.log(error.code);
        }
      );
    }
  };

  setPickedLocation = (lati, long) => {
    add.lat = lati;
    add.lng = long;
    // add.address=this.displayLocation(lati, long);
    // this.getMyLocation()
  };

  closeMapPopup = () => {
    this.props.handleField(
      "servicerequest",
      "components.div.children.formwizardFirstStep.children.servicerequestdetails.children.cardContent.children.servicerequestdetailsContainer.children.mapsDialog",
      "props.open",
      false
    );
  };

  onClickPick = async () => {
    //  debugger  
    var current_address
    await axios.get('https://maps.googleapis.com/maps/api/geocode/json?latlng='+add.lat+','+add.lng+'&key='+MAP_API_KEY_FOR_ADDRESS+'').then(response=> {current_address=JSON.stringify(response.data.results[0].formatted_address)}).catch((error) => {
    this.setState({ error: error.message })
  });
   var updated_address_first_Split = current_address.split('"')[1]
   var updated_address_second_Split = updated_address_first_Split.split('"')[0]
    // var trimmed_address = updated_address_second_Split.parseS.substring(0, MAX_LENGTH_OF_ADDRESS)
    this.props.handleField(
      "servicerequest",
      "components.div.children.formwizardFirstStep.children.servicerequestdetails.children.cardContent.children.servicerequestdetailsContainer.children.SILocationDetailsConatiner.children.propertyGisCoordinates.children.gisTextField",
      "props.value",
      `${updated_address_second_Split}`
    );
    this.props.prepareFinalObject(
      "SERVICEREQUEST.latitude",
      add.lat
    );
    this.props.prepareFinalObject(
      "SERVICEREQUEST.longitude",
      add.lng
    );
    this.props.prepareFinalObject(
      "SERVICEREQUEST.address",
      updated_address_second_Split
    );

    this.closeMapPopup();
    
    
    
  };

  convertToAddress = add => {
    const { lat, lng } = add;
    this.setState({
      currLoc: {}
    });
    lat &&
      this.props.handleFieldChange(
        this.props.formKey,
        "latitude",
        parseFloat(lat).toFixed(6)
      );
    lng &&
      this.props.handleFieldChange(
        this.props.formKey,
        "longitude",
        parseFloat(lng).toFixed(6)
      );
      
    var geocoder = new window.google.maps.Geocoder();
    geocoder.geocode(
      { location: { lat: lat, lng: lng } },
      (results, status) => {
        if (status === "OK") {
          if (results[0]) {
            
            this.props.handleFieldChange(
              this.props.formKey,
              "address",
              results[0].formatted_address
            );
          }
        }
      }
    );
  };

  onCLickMapBackBtn = () => {
    // debugger
    this.setPrevPageFlag();
    this.props.history.goBack();
  };

  setPrevPageFlag = () => {
    if (this.props.formKey === "propertyTax") {
      sessionStorage.setItem("backFromPTMap", true);
    }
  };

  render() {
    let { currLoc } = this.state;
    const { location } = this.props;
    var _currloc = !isEmpty(currLoc)
      ? currLoc
      : isEmpty(location)
        ? defaultLocation
        : location;
    return (
      <div style={{ height: "100vh", width: "100vw" }}>
        <div className="back-btn">
          <Icon
            id="map-back-btn"
            style={{
              width: "200px",
              height: "48px",
              marginRight: "16px"
            }}
            variant={"outlined"}
            color={"primary"}
            action="navigation"
            name={"arrow-back"}
            onClick={this.onCLickMapBackBtn}
          />
        </div>
        <MapLocation
          currLoc={_currloc}
          setLocation={this.setPickedLocation}
          getMyLoc={this.getMyLocation}
          
          hideTerrainBtn={true}
          dragInfoBox={false}
          viewLocation={false}
        />
        <div className="responsive-action-button-cont" style={{background: "#fff", display: "flex", marginTop: "5px"}}>
          <Button
            id="map-close-button"
            className="pick responsive-action-button"
            children={"Close"}
            style={{
              ...pickBtn,
              width: "200px",
              height: "48px",
              marginRight: "16px"
            }}
            variant={"outlined"}
            color={"primary"}
            onClick={this.closeMapPopup}
          />
          <Button
            id="map-pick-button"
            className="pick responsive-action-button"
            children={"Pick"}
            style={{
              ...pickBtn,
              width: "200px",
              height: "48px",
              marginRight: "16px"
            }}
            variant={"contained"}
            color={"primary"}
            onClick={this.onClickPick}
          />
        </div>
      </div>
    );
  }
}















const mapDispatchToProps = dispatch => {
  return {
    handleField: (formKey, path, props, value) =>
      dispatch(handleField(formKey, path, props, value)),
    prepareFinalObject: (path, value) =>
      dispatch(prepareFinalObject(path, value))
  };
};

export default connect(
  null,
  mapDispatchToProps
)(MapLocator);
