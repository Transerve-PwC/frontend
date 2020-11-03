import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import {connect} from 'react-redux'
import LabelContainer from "egov-ui-framework/ui-containers/LabelContainer";
import { getLocaleLabels, appendModulePrefix } from "egov-ui-framework/ui-utils/commons";
import { get, isEmpty } from "lodash";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import FormLabel from "@material-ui/core/FormLabel";
import FormHelperText from '@material-ui/core/FormHelperText';

const styles = theme => ({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    formControl: {
      margin: theme.spacing.unit,
      minWidth: 120,
      maxWidth: 300,
    },
    formLabel: {
        fontSize: 12,
        fontWeight: 400,
        letterSpacing: 0.56
    }
  });


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

class MultipleSelect extends React.Component {
    constructor(props){
      super(props)
      this.state = {
        name: this.props.value || []
      }
    }
  
    handleChange = event => {
      this.setState({ name: event.target.value });
      this.props.prepareFinalObject(this.props.jsonPath, event.target.value)
    };
  
    render() {
      const { classes, theme, label, options, localizationLabels, localePrefix, required, error, helperText, placeholder } = this.props;
      return (
        <div className={classes.root}>
          <FormControl className={classes.formControl} required={required}>
          <FormLabel className={classes.formLabel}>
            {label && label.key && (
              <LabelContainer
                className={classes.formLabel}
                labelName={label.name}
                labelKey={label.key}
              />
            )}
          </FormLabel>
            <Select
              multiple
              value={this.state.name}
              onChange={this.handleChange}
              input={<Input id="select-multiple-checkbox" />}
              renderValue={selected => selected.map(item => getLocaleLabels(item, localePrefix && !isEmpty(localePrefix)
                ? appendModulePrefix(item, localePrefix)
                : item, localizationLabels)).join(', ')}
              MenuProps={MenuProps}
            >
              <MenuItem value="" disabled>
              <LabelContainer
                labelName={placeholder.name}
                labelKey={placeholder.key}
              />
              </MenuItem>
              {options.map((option, key) => (
                <MenuItem key={key} value={option.code}>
                    <Checkbox checked={this.state.name.indexOf(option.code) > -1} color="primary"/>
                    <ListItemText primary={getLocaleLabels(
                    option.code,
                    localePrefix && !isEmpty(localePrefix)
                        ? appendModulePrefix(option.code, localePrefix)
                        : option.label,
                    localizationLabels
                    )} />
                </MenuItem>
              ))}
            </Select>
            {!!error && (<FormHelperText>{helperText}</FormHelperText>)}
          </FormControl>
        </div>
      );
    }
  }
  
  MultipleSelect.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
  };

  const mapStateToProps = (state, ownProps) => {
    const { screenConfiguration, app } = state;
    const {jsonPath} = ownProps
    const { localizationLabels } = app;
    const { preparedFinalObject } = screenConfiguration;
    const value = get(preparedFinalObject, jsonPath)
    return {localizationLabels, value}
  }

  const mapDispatchToProps = dispatch => {
    return {
        prepareFinalObject: (path, value) => {
            dispatch(prepareFinalObject(path, value))
        }
    }
  }

  
  export default withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(MultipleSelect));