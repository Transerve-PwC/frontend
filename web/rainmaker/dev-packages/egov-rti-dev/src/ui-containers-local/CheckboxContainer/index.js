import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import FormGroup from "@material-ui/core/FormGroup";
import { connect } from "react-redux";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import "./index.scss";
import get from "lodash/get";
import {
  getLocaleLabels,
} from "egov-ui-framework/ui-utils/commons";
const styles = {
  root: {
    color: "#FE7A51",
    "&$checked": {
      color: "#FE7A51",
    },
  },
  checked: {},
};

const checked = {
  checked: "Connect-CheckboxLabels--checked-209",
  root: "Connect-CheckboxLabels--root-208",
};

class CheckboxLabels extends React.Component {
  state = {
    checkedG: false,
  };

  handleChange = (name) => (event) => {
    const {
      jsonPath,
      approveCheck,
      onFieldChange,
      isChecked,
      screenName,
      checkBoxPath,
    } = this.props;
    this.setState({ [name]: event.target.checked }, () => {
      const fieldName = jsonPath.split(".").reverse()[0];
      onFieldChange(screenName, checkBoxPath, "props.value", !isChecked);
      approveCheck(jsonPath, !isChecked);
    });
  };

  render() {
    const { classes, content, id, isChecked, disabled,localizationLabels } = this.props;
    //set localization value
    let translatedLabel = getLocaleLabels(
      content,
      content,
      localizationLabels
    );
    console.log("check box", this.state.checkedG, isChecked);
    return (
      <FormGroup row>
        <FormControlLabel
          classes={{ label: "checkbox-label" }}
          control={
            <Checkbox
              checked={isChecked}
              onChange={this.handleChange("checkedG")}
              value={isChecked}
              id={id}
              classes={{
                root: classes.root,
                checked: classes.checked,
              }}
              disabled={disabled ? true : false}
            />
          }
         // label={content}
          label={translatedLabel}
        />
      </FormGroup>
    );
  }
}

const mapStateToProps = (state, ownprops) => {
  const { screenConfiguration,app } = state;
  const { jsonPath } = ownprops;
  const { preparedFinalObject } = screenConfiguration;
  const isChecked = get(preparedFinalObject, jsonPath, false);
  const { localizationLabels } = app;
  return { preparedFinalObject, jsonPath, isChecked,localizationLabels };
};

const mapDispatchToProps = (dispatch) => {
  return {
    approveCheck: (jsonPath, value) => {
      dispatch(prepareFinalObject(jsonPath, value));
    },
    onFieldChange: (screenkey, jsonPath, props, value) => {
      dispatch(handleField(screenkey, jsonPath, props, value));
    },
  };
};

CheckboxLabels.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(CheckboxLabels)
);
