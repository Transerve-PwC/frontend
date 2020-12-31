import React, { Component } from "react";
import get from "lodash/get";
import { httpRequest } from "../../ui-utils/api";
import { withRouter } from "react-router";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import LabelContainer from 'egov-ui-framework/ui-containers/LabelContainer'
import Button from "@material-ui/core/Button";
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
    // justifyContent: "center",
    display: "flex",
  },
  icon: {
    color: "#fe7a51"
  },
  item: {
    padding: 8
  }
});
class PaymentRedirect extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isPending: false,
      timer: 60,
      showTimer: false
    }
  }

  componentDidMount = () => {
    this.redirectPayment()
  }

  redirectPayment = async () => {
    this._clearInterval()
    let { search } = this.props.location;
    const txnQuery=search.split('&')[0].replace('eg_pg_txnid','transactionId');
    const service=search.split('=')[6]
    const buisenessservice=service.split("&")[0] 
    try {
      let pgUpdateResponse = await httpRequest(
        "post",
        "pg-service/transaction/v1/_update" + txnQuery,
        "_update",
        [],
        {}
      );
      let consumerCode = get(pgUpdateResponse, "Transaction[0].consumerCode");
      let tenantId = get(pgUpdateResponse, "Transaction[0].tenantId");
      const paymentStatus = get(pgUpdateResponse, "Transaction[0].txnStatus")
      if(paymentStatus === "FAILURE" || paymentStatus === "SUCCESS") {
      const queryObject = [
        {
          key: "tenantId",
          value: tenantId
        },
        {
          key: "applicationNumber",
          value: consumerCode
        }
      ];
      if (get(pgUpdateResponse, "Transaction[0].txnStatus") === "FAILURE") {
        window.location.href = `${
          process.env.NODE_ENV === "production" ? "/citizen" : ""
        }/rented-properties/acknowledgement?purpose=${"pay"}&status=${"failure"}&applicationNumber=${consumerCode}&tenantId=${tenantId}&businessService=${buisenessservice}`;
      } else {
        let transactionId = get(pgUpdateResponse, "Transaction[0].txnId");
        window.location.href = `${
          process.env.NODE_ENV === "production" ? "/citizen" : ""
        }/rented-properties/acknowledgement?purpose=${"pay"}&status=${"success"}&applicationNumber=${consumerCode}&tenantId=${tenantId}&secondNumber=${transactionId}`;
      }
    } else {
      this.startInterval()
    }
    } catch (e) {
      alert(e);
    }
  };

  _clearInterval = () => {
    clearInterval(this.interval)
    clearInterval(this.timer)
    this.setState({
      timer: 60,
      showTimer: false
    })
  }

  startTimer = () => {
    if(this.state.timer < 1) {
      clearInterval(this.timer)
    } else {
      this.setState({
        timer: this.state.timer - 1
      })
    }
  }

  startInterval = () => {
    this.setState({
      isPending: true,
      showTimer: true,
      timer: 60
    })
    this.interval = setInterval(this.redirectPayment, 60000);
    this.timer = setInterval(this.startTimer, 1000)
  }

  componentWillUnmount() {
    this._clearInterval()
  }

  buttonClick = () => {
    this.setState({
      showTimer: false
    })
    this._clearInterval()
    this.redirectPayment()
  }

  render() {
    const { classes } = this.props;
    return !!this.state.isPending ? (
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
                  labelKey="ES_PAYMENT_PROGRESS"
                  labelName="ES_PAYMENT_PROGRESS"
                  style={{
                    fontSize: 14,
                    color: "rgba(0, 0, 0, 0.8700000047683716)"
                  }}
                />
                {!!this.state.showTimer && !!this.state.timer && (<div>We will refresh the status in {this.state.timer}</div>)}
                  </div>
                  {!!this.state.showTimer && !!this.state.timer && (<div style={{float: "right",padding: "0px 10px",display: "inline-block"}}>
                  <Button
                      variant={"contained"}
                      color={"primary"}
                      className="bottom-button"
                      onClick={this.buttonClick}>
                      <LabelContainer
                        labelName="ES_REFRESH"
                        labelKey="ES_REFRESH"
                      />
                    </Button>
                  </div>)}
                </CardContent>
              </Card>
        </Grid>
    ) : <div/>
  }
}

export default withRouter(withStyles(styles)(PaymentRedirect));