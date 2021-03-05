import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import FormGroup from '@material-ui/core/FormGroup';
import LabelContainer from "egov-ui-framework/ui-containers/LabelContainer";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import "./index.css";
import { toggleWater, toggleSewerage } from './toggleFeilds';
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";

const styles = {
  root: {
    color: "#FE7A51",
    "&$checked": {
      color: "#FE7A51"
    }
  },
  formControl: {
    marginTop: 0,
    paddingBottom: 0
  },
  group: {
    display: "inline-block",
    margin: 0
  },
  checked: {},
  radioRoot: {
    marginBottom: 12
  },
  formLabel: {
    fontSize: 12,
    fontWeight: 400,
    letterSpacing: 0.56
  }
};

class CheckboxLabels extends React.Component {
  state = { checkedSewerage: false, checkedWater: false, interChange: false,checkedTubewell:false }

  componentWillMount() {
    const { preparedFinalObject } = this.props;
    let checkedWater = (preparedFinalObject && preparedFinalObject.applyScreen.water) ? preparedFinalObject.applyScreen.water : false;
    let checkedSewerage = (preparedFinalObject && preparedFinalObject.applyScreen.sewerage) ? preparedFinalObject.applyScreen.sewerage : false;
    let checkedTubewell = (preparedFinalObject && preparedFinalObject.applyScreen.tubewell) ? preparedFinalObject.applyScreen.tubewell : false;
    this.setState({ checkedSewerage: checkedSewerage, checkedWater: checkedWater ,checkedTubewell: checkedTubewell})
  }

  handleWater = name => event => {
    const { jsonPathWater, approveCheck, onFieldChange,jsonPathTubewell,jsonPathSewerage } = this.props;
    this.setState({ [name]: event.target.checked, interChange: true ,checkedTubewell : false,checkedSewerage : false}, () => {
      if (this.state.checkedWater) {
        toggleWater(onFieldChange, true);
        // check sector list then set sector list for SW to WS
        const { preparedFinalObject } = this.props;
        const wssectorList = preparedFinalObject.applyScreenMdmsData['ws-services-masters'].wssectorList
        approveCheck('applyScreenMdmsData.ws-services-masters.sectorList', wssectorList);
        // set sub div auto if list is change
        const {property} = preparedFinalObject.applyScreen//.property.locality.code
        if(property)
        {
          if(property.address&&property.address.locality)
          {
            if(property.address.locality.code)
          {
            //alert(action.value)
            let sectorList = [];
            let code = ''
            if(property.address.locality.code.label)
            {
              code = property.address.locality.code.value
            }
            else
            code = property.address.locality.code
            sectorList = wssectorList.filter(x=>x.code === code);
            if(sectorList && sectorList[0])
            {
              approveCheck("applyScreen.subdiv", sectorList[0].subdivision);
              approveCheck("applyScreen.property.address.locality.name", code);
            }
          }

          }
        }
        
        if (this.state.checkedSewerage) { 
          toggleSewerage(onFieldChange, false); 
        }
        else { toggleSewerage(onFieldChange, false); }
      } else { toggleWater(onFieldChange, false); }
      approveCheck(jsonPathWater, this.state.checkedWater);
      approveCheck(jsonPathTubewell, false);
      approveCheck(jsonPathSewerage, false);
      //approveCheck(jsonPathSewerage, false);
    });
  };

  handleSewerage = name => event => {
    const { jsonPathSewerage, approveCheck, onFieldChange,jsonPathTubewell,jsonPathWater } = this.props;
    this.setState({ [name]: event.target.checked, interChange: true,checkedWater : false,checkedTubewell:false }, () => {
      if (this.state.checkedSewerage) {
        toggleSewerage(onFieldChange, true);
       // check sector list then set sector list for SW to WS
       const { preparedFinalObject } = this.props;
       const swSectorList = preparedFinalObject.applyScreenMdmsData['ws-services-masters'].swSectorList
       approveCheck('applyScreenMdmsData.ws-services-masters.sectorList', swSectorList);
       // set sub div auto if list is change
       const {property} = preparedFinalObject.applyScreen//.property.locality.code
       if(property)
       {
         if(property.address && property.address.locality)
         {
           if(property.address.locality.code)
         {
           //alert(action.value)
           let sectorList = [];
           let code = ''
           if(property.address.locality.code.label)
           {
             code = property.address.locality.code.value
           }
           else
           code = property.address.locality.code
           sectorList = swSectorList.filter(x=>x.code === code);
           if(sectorList && sectorList[0])
           {
            approveCheck("applyScreen.subdiv", sectorList[0].subdivision);
            approveCheck("applyScreen.property.address.locality.name", code);
           }
         }

         }
       }
        
        if (this.state.checkedWater) { toggleWater(onFieldChange, false); }
        else { toggleWater(onFieldChange, false); }
      } else { toggleSewerage(onFieldChange, false); }
      approveCheck(jsonPathSewerage, this.state.checkedSewerage);
      //approveCheck(jsonPathSewerage, false);
      approveCheck(jsonPathTubewell, false);
      approveCheck(jsonPathWater, false);
    });
  }
  handleTubewell = name => event => {
    const { jsonPathTubewell, approveCheck, onFieldChange,jsonPathWater,jsonPathSewerage } = this.props;
    this.setState({ [name]: event.target.checked, interChange: true,checkedWater : false,checkedSewerage : false }, () => {
      if (this.state.checkedTubewell) {
        toggleWater(onFieldChange, false);
        if (this.state.checkedSewerage) { toggleSewerage(onFieldChange, false); }
        else { toggleSewerage(onFieldChange, false); }
      } 
      approveCheck(jsonPathTubewell, this.state.checkedTubewell);
      approveCheck(jsonPathWater, false);
      approveCheck(jsonPathSewerage, false);
    });
  }


  render() {
    const { classes, required, preparedFinalObject } = this.props;
    let checkedWater, checkedSewerage,checkedTubewell;
    let IsEdit = process.env.REACT_APP_NAME === "Citizen"?false:true;
    if (this.state.interChange) {
      checkedWater = this.state.checkedWater;
      checkedSewerage = this.state.checkedSewerage;
      checkedTubewell = this.state.checkedTubewell;
    } else {
      checkedWater = (preparedFinalObject && preparedFinalObject.applyScreen.water) ? preparedFinalObject.applyScreen.water : false;
      checkedSewerage = (preparedFinalObject && preparedFinalObject.applyScreen.sewerage) ? preparedFinalObject.applyScreen.sewerage : false;
      checkedTubewell = (preparedFinalObject && preparedFinalObject.applyScreen.tubewell) ? preparedFinalObject.applyScreen.tubewell : false;
    }


    return (
      <div className={classes.root}>
        <FormControl component="fieldset" className={classes.formControl} required={required}>
          <FormLabel className={classes.formLabel}>
            <LabelContainer className={classes.formLabel} labelKey="WS_APPLY_FOR" />
          </FormLabel>
          <FormGroup row>
            <FormControlLabel
              classes={{ label: "checkbox-button-label" }}
              control={
                <Checkbox
                  checked={checkedWater}
                  disabled={IsEdit}
                  onChange={this.handleWater("checkedWater")}
                  classes={{ root: classes.radioRoot, checked: classes.checked }}
                  color="primary"
                />}
              label={<LabelContainer labelKey="WS_APPLY_WATER" />}
            />
            <FormControlLabel
              classes={{ label: "checkbox-button-label" }}
              control={
                <Checkbox
                  checked={checkedSewerage}
                  disabled={IsEdit}
                  onChange={this.handleSewerage("checkedSewerage")}
                  classes={{ root: classes.radioRoot, checked: classes.checked }}
                  color="primary"
                />}
              label={<LabelContainer labelKey="WS_APPLY_SEWERAGE" />}
            />
              <FormControlLabel
              classes={{ label: "checkbox-button-label" }}
              control={
                <Checkbox
                  checked={checkedTubewell}
                  disabled={IsEdit}
                  onChange={this.handleTubewell("checkedTubewell")}
                  classes={{ root: classes.radioRoot, checked: classes.checked }}
                  color="primary"
                />}
              label={<LabelContainer labelKey="WS_APPLY_TUBEWELL" />}
            />
          </FormGroup>
        </FormControl>
      </div>
    )
  }
}

const mapStateToProps = (state, ownprops) => {
  const { screenConfiguration } = state;
  const { jsonPathWater, jsonPathSewerage ,jsonPathTubewell} = ownprops;
  const { preparedFinalObject } = screenConfiguration;
  return { preparedFinalObject, jsonPathWater, jsonPathSewerage,jsonPathTubewell };
};

const mapDispatchToProps = dispatch => {
  return { approveCheck: (jsonPath, value) => { dispatch(prepareFinalObject(jsonPath, value)); } };
};

CheckboxLabels.propTypes = { classes: PropTypes.object.isRequired };

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(CheckboxLabels));
