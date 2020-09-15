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
import {ExpandLessRounded} from '@material-ui/icons';

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
        super(props)
        this.state = {
            open: !this.props.value
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
        const {data, contents, valueJsonPath, classes, header} = this.props;
        const {open} = this.state
        return(
            <div className={classes.root}>
                <ExpansionPanel expanded={!!open}>
                <ExpansionPanelSummary>
                <Grid xs={12} sm={12} container>
                    <Grid xs={6} sm={8}>
                    <div>
                        <Typography variant="headline">{header}</Typography>
                    </div>
                    </Grid>
                    <Grid xs={6} sm={4} style={{textAlign: "right"}}>
                    {!open ? (<Button
                        variant={"contained"}
                        color={"primary"}
                        style={{
                          minWidth: "200px",
                          height: "48px"
                        }}
                        className="bottom-button"
                        onClick={this.changeExpansion}
                      >
                        <LabelContainer
                          labelName="Change"
                          labelKey="Change"
                        />
                      </Button>) : !!this.props.value && (
                          <ExpandLessRounded onClick={this.changeExpansion}/>
                      )}
                    </Grid>
                </Grid>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    {data.map((datum, index) => (
                        <Grid sm={12} xs={12} key={index} container>
                            <Grid content xs={2} sm={1}>
                            <Checkbox
                            color="primary"
                            checked={this.props.value ===  get(datum, valueJsonPath)}
                            onChange={this.changeValue(datum)}
                            />
                            </Grid>
                            {contents.map((content, ind) => (
                                <Grid content xs={3} sm={3}>
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
                        </Grid>
                    ))}
                </ExpansionPanelDetails>
                </ExpansionPanel>
            </div>
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