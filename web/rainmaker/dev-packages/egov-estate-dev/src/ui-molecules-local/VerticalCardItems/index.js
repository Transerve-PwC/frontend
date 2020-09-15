import React from "react";
import { connect } from "react-redux";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import get from "lodash/get";
import LabelContainer from 'egov-ui-framework/ui-containers/LabelContainer'
// import LabelContainer from "../../ui-containers/LabelContainer";
import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import "./index.css";
import Button from "@material-ui/core/Button";

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    borderRadius: 0,
    marginTop: 0,
    height: 110,
    alignItems: "center",
    // justifyContent: "center",
    display: "flex",
    cursor: "pointer"
  },
  icon: {
    color: "#fe7a51"
  },
  item: {
    padding: 8
  }
});

class VerticalCardItems extends React.Component {
  goToAppy = route => {
    const {
      setRoute
    } = this.props;
    setRoute(route);
  }

  render() {
    const { classes, items } = this.props;
    return (
      <Grid container className="horizontal-card-main-grid">
        {items.map(obj => {
          return !obj.hide ? (
            <Grid
              className={classes.item}
              item
              xs={12}
              sm={12}
              align="center"
            >
              <Card
                className={`${classes.paper} module-card-style`}
              >
                <CardContent classes={{ root: "card-content-style" }}>
                  <div style={{float: "left", padding: "0px 10px", display: "inline-block"}}>
                    <LabelContainer
                      labelKey={obj.label.labelKey}
                      labelName={obj.label.labelName}
                      style={{
                        fontSize: 14,
                        color: "rgba(0, 0, 0, 0.8700000047683716)"
                      }}
                    />
                  </div>
                  <div style={{float: "right",padding: "0px 10px",display: "inline-block"}}>
                  <Button
                      variant={"contained"}
                      color={"primary"}
                      className="bottom-button"
                      onClick={ () => this.goToAppy(obj.route) }
                    >
                      <LabelContainer
                        labelName={obj.buttonLabel.props.labelName}
                        labelKey={obj.buttonLabel.props.labelKey}
                      />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Grid>
          ) : null;
        })}
      </Grid>
    );
  }
}

const mapStateToProps = state => {
  const screenConfig = get(state.screenConfiguration, "screenConfig");
  const moduleName = get(state.screenConfiguration, "moduleName");
  return { screenConfig, moduleName };
};

const mapDispatchToProps = dispatch => {
  return {
    handleField: (screenKey, jsonPath, fieldKey, value) =>
      dispatch(handleField(screenKey, jsonPath, fieldKey, value)),
    setRoute: path => dispatch(setRoute(path)),
    prepareFinalObject: (jsonPath, value) =>
      dispatch(prepareFinalObject(jsonPath, value))
  };
};

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(VerticalCardItems)
);
