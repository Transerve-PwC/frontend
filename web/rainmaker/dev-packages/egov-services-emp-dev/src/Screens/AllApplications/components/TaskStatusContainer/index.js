import React from "react";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
    color: "#FE7A51"
  },
  leftIcon: {
    marginRight: theme.spacing.unit
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  },
  iconSmall: {
    fontSize: 20
  }
});

class TastStatusContainer extends React.Component {
  state = {
    open: false
  };

  handleViewHistory = () => {
    this.setState({
      open: true
    });
  };

  handleDialogClose = () => {
    this.setState({
      open: false
    });
  };

  render() {
    
    const { classes, ProcessInstances } = this.props;
    let currentObj =
      ProcessInstances && ProcessInstances[ProcessInstances.length - 1];
      if(currentObj && currentObj.businessService && currentObj.businessService === "OSBM"){
        let assigness = [];
          if(currentObj.assignes) {
            currentObj.assignes.forEach(user => {
              assigness.push(user.name);
            });
            currentObj.assignee={};
            currentObj.assignee.name = assigness.join(',');
          }
      }
     return (
      <div>

        <p>hello return </p>
      </div>
    );
  }
}

export default withStyles(styles)(TastStatusContainer);
