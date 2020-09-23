import React, { Component } from "react";
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Grid } from "@material-ui/core";
import {
    LabelContainer,
  } from "egov-ui-framework/ui-containers";
import Checkbox from '@material-ui/core/Checkbox';
import {connect} from 'react-redux'
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { checkValueForNA } from "egov-ui-framework/ui-config/screens/specs/utils";
import Label from "egov-ui-framework/ui-containers/LabelContainer";
import { get } from "lodash";
import {ExpandLessRounded, ExpandMoreRounded} from '@material-ui/icons';

const styles = theme => ({
    root: {
      width: '100%',
      marginTop: 24
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
    }
})

class ExpansionPanelMolecule extends Component {

    constructor(props) {
      super(props);
        this.state = {
            open: true
        }
    }

    changeExpansion = () => {
        this.setState({
            open: !this.state.open
        })
    }

    changeValue = (datum) => () => {
        const {value, jsonPath, valueJsonPath} = this.props;
        const id = get(datum, valueJsonPath)
        if(id === value) {
            this.props.prepareFinalObject(jsonPath, "")
        } else {
            this.props.prepareFinalObject(jsonPath, id)
            this.changeExpansion();
        }
    }

    generateLabelKey = (content, item) => {
        let LabelKey = "";
        if (content.prefix && content.suffix) {
          LabelKey = `${content.prefix}${get(item, content.jsonPath,"").replace(
            /[._:-\s\/]/g,
            "_"
          )}${content.suffix}`;
        } else if (content.prefix) {
          LabelKey = `${content.prefix}${get(item, content.jsonPath,"").replace(
            /[._:-\s\/]/g,
            "_"
          )}`;
        } else if (content.suffix) {
          LabelKey = `${get(item, content.jsonPath,"").replace(/[._:-\s\/]/g, "_")}${
            content.suffix
          }`;
        } else if(content.callBack) {
          LabelKey = content.callBack(get(item, content.jsonPath,""))
        } else {
          LabelKey = `${get(item, content.jsonPath,"")}`;
        }
        return LabelKey;
      };

    render() {
        let {data, contents, valueJsonPath, classes, header} = this.props;
        data = data || []
        const {open} = this.state
        return(
          !data.length ? null :
            (<div className={classes.root}>
                <ExpansionPanel expanded={!!open} onChange={this.changeExpansion}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreRounded />} >
                <Grid xs={12} sm={12} container>
                        <Typography variant="headline">{header}</Typography>
                </Grid>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                <Grid sm={12} xs={12} container> 
                    {contents.map((content, index) => (
                      <Grid content xs={4} sm={4}>
                      <Grid xs={12} sm={12}>
                      <Label
                        labelKey={content.label}
                        fontSize={14}
                        style={{
                          fontSize: 14,
                          color: "rgba(0, 0, 0, 0.60"
                        }}
                      />
                      </Grid>
                      </Grid>
                      ))
                    }
                    {data.map((datum, index) => (
                      <React.Fragment>
                            {contents.map((content, ind) => (
                                <Grid content xs={4} sm={4}>
                                <Grid xs={12} sm={12}>
                                <Label
                                  labelKey={this.generateLabelKey(content, datum)}
                                  fontSize={14}
                                  checkValueForNA={checkValueForNA}
                                  style={{
                                    fontSize: 14,
                                    color: "rgba(0, 0, 0, 0.87"
                                  }}
                                />
                                </Grid>
                              </Grid>
                            ))}
                        </React.Fragment>
                    ))}
                    </Grid>
                </ExpansionPanelDetails>
                </ExpansionPanel>
            </div>)
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
      prepareFinalObject: (jsonPath, value) =>
        dispatch(prepareFinalObject(jsonPath, value))
    };
  };

export default withStyles(styles)(
    connect(
      null,
      mapDispatchToProps
    )(ExpansionPanelMolecule)
  );