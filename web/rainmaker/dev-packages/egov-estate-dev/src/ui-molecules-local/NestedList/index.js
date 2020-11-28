import React, {Component} from 'react'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import LabelContainer from 'egov-ui-framework/ui-containers/LabelContainer'
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import  {connect} from 'react-redux'
import {
    getQueryArg
  } from "egov-ui-framework/ui-utils/commons";

const styles = theme => ({
    root: {
      backgroundColor: theme.palette.background.paper,
      marginBottom: theme.spacing.unit * 2,
      marginTop: theme.spacing.unit * 5
    },
    listItem: {
        display: "flex", 
        justifyContent: "space-between",
        paddingTop: theme.spacing.unit * 3,
        paddingBottom: theme.spacing.unit * 3,
    },
    nested: {
      paddingLeft: theme.spacing.unit * 4,
      paddingTop: theme.spacing.unit * 3,
      paddingBottom: theme.spacing.unit * 3,
      borderTopWidth: 0.5,
      borderColor: "#D3D3D3",
      borderTopStyle: "solid"
    },
  });

class NestedList extends Component {

    state = {
        open: ""
    }

    handleClick = (index) => () => {
        const {open} = this.state
        this.setState({
            open: open === index ? "" : index
        })
    }

    goToScreen = (datum) => () => {
        const {
            setRoute
          } = this.props;
        setRoute(datum.route);
    }

    render() {
        const {items, classes} = this.props;
        return(
            <div>
                <List>
                    {items.map((item, index) => (
                        <div className={classes.root}>
                            <ListItem className={classes.listItem} button onClick={!!item.type ? this.goToScreen(item) : this.handleClick(index)}>
                                <LabelContainer
                                    labelKey={item.code}
                                    labelName={item.name}
                                    style={{
                                        fontSize: 14,
                                        color: "rgba(0, 0, 0, 0.8700000047683716)"
                                    }}
                                />
                                {!!item.SubTypes && !!item.SubTypes.length && (<div style= {{textAlign: "right"}}>
                                {this.state.open === index ? <ExpandLess /> : <ExpandMore />}
                                </div>)}
                            </ListItem>
                            {!!item.SubTypes && !!item.SubTypes.length && (<Collapse in={this.state.open === index} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                {item.SubTypes.map((datum) => (<ListItem button className={classes.nested} onClick={this.goToScreen(datum)}>
                                    <LabelContainer
                                    labelKey={datum.code}
                                    labelName={datum.name}
                                    style={{
                                        fontSize: 14,
                                        color: "rgba(0, 0, 0, 0.8700000047683716)"
                                    }}
                                    />
                                </ListItem>))}
                                </List>
                            </Collapse>)}
                        </div>
                    ))}
                </List>    
            </div>
        )
    }
}

NestedList.propTypes = {
    classes: PropTypes.object.isRequired,
  };

  const mapDispatchToProps = dispatch => {
    return {
        setRoute: path => dispatch(setRoute(path))
    }
  }
  
  export default withStyles(styles)(connect(null, mapDispatchToProps)(NestedList));