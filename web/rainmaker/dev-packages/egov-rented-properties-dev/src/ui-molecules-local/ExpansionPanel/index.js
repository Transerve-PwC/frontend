import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import Typography from "@material-ui/core/Typography";
import { Grid } from "@material-ui/core";
import { connect } from "react-redux";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { checkValueForNA } from "egov-ui-framework/ui-config/screens/specs/utils";
import Label from "egov-ui-framework/ui-containers/LabelContainer";
import { get } from "lodash";
import { ExpandLessRounded, ExpandMoreRounded } from "@material-ui/icons";
import {
  getTextToLocalMapping
} from "../../ui-config/screens/specs/utils";
const styles = (theme) => ({
  root: {
    width: "100%",
    marginTop: 24,
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
  },
});

class ExpansionPanelMolecule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  changeExpansion = () => {
    this.setState({
      open: !this.state.open,
    });
  };

  generateLabelKey = (content, item) => {
    let LabelKey = "";
    if (content.prefix && content.suffix) {
      LabelKey = `${content.prefix}${get(item, content.jsonPath, "").replace(
        /[._:-\s\/]/g,
        "_"
      )}${content.suffix}`;
    } else if (content.prefix) {
      LabelKey = `${content.prefix}${get(item, content.jsonPath, "").replace(
        /[._:-\s\/]/g,
        "_"
      )}`;
    } else if (content.suffix) {
      LabelKey = `${get(item, content.jsonPath, "").replace(
        /[._:-\s\/]/g,
        "_"
      )}${content.suffix}`;
    } else if (content.callBack) {
      LabelKey = content.callBack(get(item, content.jsonPath, ""));
    } else {
      LabelKey = `${get(item, content.jsonPath, "")}`;
    }
    if (content.symbol) {
      LabelKey = `${LabelKey}${content.symbol}`;
    }
    return LabelKey;
  };

  render() {
    let {
      data,
      properties,
      contents,
      classes,
      header,
      onButtonClick,
      emptyMessage,
    } = this.props;
    data = data || [];
    const { open } = this.state;
    console.log(properties)
    return (
      <div className={classes.root}>
        <ExpansionPanel
          expanded={!!open}
          onChange={this.changeExpansion}
          style={{ backgroundColor: "rgb(242, 242, 242)" }}
        >
          <ExpansionPanelSummary expandIcon={<ExpandMoreRounded />}>
            <Grid xs={12} sm={12} container>
              <Typography variant="headline">{getTextToLocalMapping(header)}</Typography>
            </Grid>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Grid sm={12} xs={12}>
              {!!data.length ? (
                data.map((datum, index) => (
                  <Grid style={{ marginBottom: 12 }}>
                    {contents.map((content, ind) => (
                      <Grid container>
                        <Grid datum xs={6}>
                          <Label
                            labelKey={content.label}
                            fontSize={14}
                            style={{
                              fontSize: 14,
                              color: "rgba(0, 0, 0, 0.60",
                            }}
                          />
                        </Grid>
                        <Grid datum xs={6}>
                          <Label
                            labelKey={this.generateLabelKey(content, datum)}
                            fontSize={14}
                            checkValueForNA={checkValueForNA}
                            style={{
                              fontSize: 14,
                              color: "rgba(0, 0, 0, 0.87)",
                            }}
                          />
                        </Grid>
                      </Grid>
                    ))}
                    {!!onButtonClick && (
                      <div
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          onButtonClick(datum, this.props.preparedFinalObject,properties)
                        }
                      >
                        <Label
                          labelKey="RP_DOWNLOAD_RECEIPT"
                          textTransform={"uppercase"}
                          style={{
                            color: "#fe7a51",
                            fontSize: 14,
                            textTransform: "uppercase",
                          }}
                        />
                      </div>
                    )}
                  </Grid>
                ))
              ) : (
                <div>
                  <Label
                    labelKey={getTextToLocalMapping(emptyMessage)}
                    fontSize={14}
                    style={{
                      fontSize: 14,
                      color: "red",
                    }}
                  />
                </div>
              )}
            </Grid>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    prepareFinalObject: (jsonPath, value) =>
      dispatch(prepareFinalObject(jsonPath, value)),
  };
};

const mapStateToProps = (state) => {
  const { screenConfiguration } = state;
  return { preparedFinalObject: screenConfiguration.preparedFinalObject };
};

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(ExpansionPanelMolecule)
);
