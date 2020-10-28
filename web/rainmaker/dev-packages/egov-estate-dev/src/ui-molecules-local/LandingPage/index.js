import React from "react";
import { connect } from "react-redux";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { Link } from "react-router-dom";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import get from "lodash/get";
import LabelContainer from 'egov-ui-framework/ui-containers/LabelContainer'
// import LabelContainer from "../../ui-containers/LabelContainer";
import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import Icon from "egov-ui-kit/components/Icon";
import "./index.css";

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    borderRadius: 0,
    marginTop: 0,
    height: 110,
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    cursor: "pointer"
  },
  icon: {
    color: "#fe7a51"
  },
  item: {
    padding: 8
  },
  leftIcon: {
    marginRight: theme.spacing.unit
  },
});

class LandingPage extends React.Component {
  onCardCLick = route => {
    const {
      screenConfig,
      handleField,
      setRoute,
      moduleName,
      jsonPath,
      value
    } = this.props;
    if (typeof route === "string") {
      setRoute(route);
    } else {
      if (moduleName === "fire-noc") {
        prepareFinalObject("FireNOCs", [
          { "fireNOCDetails.fireNOCType": "NEW" }
        ]);
      }
      let toggle = get(
        screenConfig[route.screenKey],
        `${route.jsonPath}.props.open`,
        false
      );
      handleField(route.screenKey, route.jsonPath, "props.open", !toggle);
    }
  };

  renderCard = (item, length) => {
    const {applicationCount, classes} = this.props
    return (
      !item.hide ? (
        <Grid
          className={classes.item}
          item
          xs={12}
          sm={length > 4 ? 12 / 4 : 12 / length}
          align="center"
        >
          <Card
            className={`${classes.paper} module-card-style`}
            onClick={() => this.onCardCLick(item.route)}
          >
            <CardContent classes={{ root: "card-content-style" }}>
            {!!item.leftIcon ? <Icon action={item.leftIcon.split(":")[0]} name={item.leftIcon.split(":")[1]} style={{ width: "48px", height: "46.02px",color:"#fe7a51" }} /> : item.icon}
              <div>
                <LabelContainer
                  labelKey={item.label.labelKey}
                  labelName={item.label.labelName}
                  style={{
                    fontSize: 14,
                    color: "rgba(0, 0, 0, 0.8700000047683716)"
                  }}
                  dynamicArray={applicationCount ? [applicationCount] : [0]}
                />
              </div>
            </CardContent>
          </Card>
        </Grid>
      ) : null
    )
  }


  render() {
    const { classes, items, applicationCount, isArray } = this.props;
    return (
      <Grid container className="landing-page-main-grid">
        {!!isArray ? items.map(obj => {
          return (
            <React.Fragment>
              <Grid xs={12} sm={12}>
              <div>{obj.parentModule}</div>
              </Grid>
              {obj.items.map(item => this.renderCard(item, obj.items.length))}
            </React.Fragment>
          )
        })  : items.map(obj => this.renderCard(obj, items.length))
        }
      </Grid>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  let {jsonPath, items} = ownProps
  if(!!jsonPath) {
    const menu = get(state, jsonPath) || [];
    const estateCards = menu.filter(item => item.url === "estate-card");
    items = estateCards.reduce((prev, curr) => {
      const findIndex = prev.findIndex(item => item.parentModule === curr.parentModule)
      if(findIndex !== -1) {
        prev = [...prev.slice(0, findIndex), 
          {...prev[findIndex], 
            items: [...prev[findIndex].items, 
              { label: {
                    labelKey: curr.displayName,
                    labelName: curr.displayName
                  },
                  leftIcon: curr.leftIcon,
                  route: curr.queryParams ? `${curr.navigationURL}?${curr.queryParams}` : curr.navigationURL 
              }
            ]
          },
          ...prev.slice(findIndex+1)
        ]
      } else {
        prev = [...prev, {
            parentModule: curr.parentModule, 
            items: [
              {
                label: {
                  labelKey: curr.displayName,
                  labelName: curr.displayName
                },
                leftIcon: curr.leftIcon,
                route: curr.queryParams ? `${curr.navigationURL}?${curr.queryParams}` : curr.navigationURL
              }
            ]
          }
        ]
      }
      return prev
    }, [])
  }
  const screenConfig = get(state.screenConfiguration, "screenConfig");
  const moduleName = get(state.screenConfiguration, "moduleName");
  const applicationCount = get(
    state.screenConfiguration.preparedFinalObject,
    "myApplicationsCount"
  );
  return { screenConfig, moduleName, applicationCount, items };
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
  )(LandingPage)
);
