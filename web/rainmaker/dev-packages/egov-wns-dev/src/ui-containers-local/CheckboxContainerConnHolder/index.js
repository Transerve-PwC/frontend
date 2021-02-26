import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import FormGroup from "@material-ui/core/FormGroup";
import { connect } from "react-redux";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import LabelContainer from "egov-ui-framework/ui-containers/LabelContainer";
import get from "lodash/get";
import { toggleConnHolderDetails } from "../CheckboxContainer/toggleFeilds"

const styles = {
  root: {
    color: "#FE7A51",
    "&$checked": {
      color: "#FE7A51"
    }
  },
  checked: {}
};

class CheckboxLabels extends React.Component {
  state = {
    checkedG: null
  };

  componentDidMount = () => {
    /*const { preparedFinalObject, approveCheck, jsonPath, onFieldChange } = this.props;    
    let isChecked = get(preparedFinalObject, jsonPath);
    if (isChecked) this.setState({ checkedG: isChecked });
    else {
      this.setState({ checkedG: true })
      this.updateOwnerFileds();
    } */
    const { classes, content, label, isChecked, approveCheck, onFieldChange, jsonPath } = this.props;
    if(isChecked === false){
      toggleConnHolderDetails(onFieldChange, true);
      approveCheck(jsonPath, isChecked)
    }else{
      toggleConnHolderDetails(onFieldChange, false);
      approveCheck(jsonPath, isChecked)
    }
  };

  updateOwnerFileds = () => {
    const {
      sourceJsonPaths,
      destinationJsonPaths,
      disbaleComponentJsonPaths,
      onFieldChange,
      screenKey,
      preparedFinalObject,
      approveCheck,
      jsonPath,
      state
    } = this.props;

    toggleConnHolderDetails(onFieldChange, false);
    approveCheck(jsonPath, this.props.isChecked)

  }
  handleChange = name => event => {
    const {
      sourceJsonPaths,
      destinationJsonPaths,
      disbaleComponentJsonPaths,
      onFieldChange,
      screenKey,
      preparedFinalObject,
      approveCheck,
      section,
      jsonPath
    } = this.props;

    const isChecked = event.target.checked;
    if (isChecked) {
      toggleConnHolderDetails(onFieldChange, false);
      //set Owner Information
      if(preparedFinalObject.applyScreen.property.owners && preparedFinalObject.applyScreen.property.owners[0])
      {
      const mobileNumber =  get(preparedFinalObject.applyScreen.property.owners[0], "mobileNumber");
      const name =  get(preparedFinalObject.applyScreen.property.owners[0], "name");
      const emailId =  get(preparedFinalObject.applyScreen.property.owners[0], "emailId");
      const correspondenceAddress =  get(preparedFinalObject.applyScreen.property.owners[0], "correspondenceAddress");
      //const ownerType =  get(preparedFinalObject.applyScreen.property.owners[0], "correspondenceAddress");
      approveCheck('connectionHolders[0].mobileNumber', mobileNumber)
      approveCheck('connectionHolders[0].name', name)
      approveCheck('connectionHolders[0].emailId', emailId)
      approveCheck('connectionHolders[0].correspondenceAddress', correspondenceAddress)
     approveCheck('connectionHolders[0].ownerType', "INDIVIDUAL.SINGLEOWNER")
      }


    } else {
      toggleConnHolderDetails(onFieldChange, true);
      approveCheck('connectionHolders[0].mobileNumber', null)
      approveCheck('connectionHolders[0].name', null)
      approveCheck('connectionHolders[0].emailId', null)
      approveCheck('connectionHolders[0].correspondenceAddress', null)
    }
    if(section !== undefined)
    {
      if(section === 'SECURITY')
        {
          //
          //

        }

    }

    this.setState({ [name]: isChecked }, () =>
      approveCheck(jsonPath, isChecked)
    );
  };

  render() {
    const { classes, content, label,preparedFinalObject,section } = this.props;
    let isChecked = (this.state.checkedG === null)?this.props.isChecked:this.state.checkedG;
    let isdisabled = false
    //isFerruleApplicable should be enable to change the value in step  PENDING_FOR_SECURITY_DEPOSIT
    if(preparedFinalObject.WaterConnection.length>0)
    {
      if(preparedFinalObject.WaterConnection[0].waterApplication)
      {
        const {applicationStatus} = preparedFinalObject.WaterConnection[0];
        if(applicationStatus !== undefined)
        {
          if(applicationStatus ==='PENDING_FOR_SECURITY_DEPOSIT')
          {
            isdisabled = false
          }
          else
          {
            isdisabled = true
            isChecked = true//preparedFinalObject.WaterConnection[0].waterApplication.isFerruleApplicable
           // approveCheck('WaterConnection[0].waterApplication.isFerruleApplicable', true)
            
          }
        }
        else
        {
          if(section === undefined)
          {
            isdisabled = false
            isChecked = false

          }
          else{
            isdisabled = true

          }
          

        }
  
      }

    }
    
 
    return (
      <FormGroup row>
        <FormControlLabel
          classes={{ label: "checkbox-label" }}
          control={
            <Checkbox
              checked={isChecked}
              disabled={isdisabled}
              onChange={this.handleChange("checkedG")}
              value={isChecked}
              classes={{
                root: classes.root,
                checked: classes.checked
              }}
            />
          }
          label={
            label &&
            label.key && (
              <LabelContainer
                className={classes.formLabel}
                labelName={label.name}
                labelKey={label.key}
              />
            )
          }
        />
      </FormGroup>
    );
  }
}

const mapStateToProps = (state, ownprops) => {
  const { screenConfiguration } = state;
  const { jsonPath } = ownprops;
  const { preparedFinalObject } = screenConfiguration;
  return { preparedFinalObject, jsonPath };
};

const mapDispatchToProps = dispatch => {
  return {
    approveCheck: (jsonPath, value) => {
      dispatch(prepareFinalObject(jsonPath, value));
    }
  };
};

CheckboxLabels.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CheckboxLabels)
);




// if(sourceJsonPaths){
//   sourceJsonPaths.forEach((sourceJSonPath, index) => {
//     // approveCheck(
//     //   destinationJsonPaths[index],
//     //   get(preparedFinalObject, sourceJSonPath)
//     // );
//     console.log("===sourcevalue",get(preparedFinalObject, sourceJSonPath))
//     onFieldChange(
//       screenKey,
//       disbaleComponentJsonPaths[index],
//       "props.value",
//       get(preparedFinalObject, sourceJSonPath)
//     );
//   });
// }


// sourceJsonPaths &&
// destinationJsonPaths &&
// destinationJsonPaths.forEach((destinationJsonPath, index) => {
//   approveCheck(destinationJsonPath[index], "");
// });

// disbaleComponentJsonPaths &&
    //   disbaleComponentJsonPaths.map(componentJsonPath => {
    //     onFieldChange(
    //       screenKey,
    //       componentJsonPath,
    //       "props.disabled",
    //       event.target.checked
    //     );
    //   });
    //true

      // disbaleComponentJsonPaths &&
      //   disbaleComponentJsonPaths.forEach((disbaleComponentJsonPath, index) => {
      //     approveCheck(disbaleComponentJsonPath[index], "");
      //   });
      // disbaleComponentJsonPaths &&
      //   disbaleComponentJsonPaths.map(componentJsonPath => {
      //     onFieldChange(screenKey, componentJsonPath, "props.value", "");
      //   });

      

      //  this.updateOwnerFileds();
      // if(destinationJsonPaths){
      //   destinationJsonPaths.forEach((destinationJsonPath, index) => {
      //     approveCheck(
      //       destinationJsonPaths[index],
      //       get(preparedFinalObject, destinationJsonPath)
      //     );
      //     onFieldChange(
      //       screenKey,
      //       disbaleComponentJsonPaths[index],
      //       "props.value",
      //       get(preparedFinalObject, destinationJsonPath)
      //     );
      //   });
      // }