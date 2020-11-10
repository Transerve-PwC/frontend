import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import { Tooltip } from "egov-ui-framework/ui-molecules";
import { LabelContainer } from "egov-ui-framework/ui-containers";
import "./index.css";

const formatAmount = (x) => {
    return x.toString().split('.')[0].length > 3 ? x.toString().substring(0,x.toString().split('.')[0].length-3).replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + x.toString().substring(x.toString().split('.')[0].length-3): x.toString();
}

const styles = {
  card: {
    backgroundColor: "rgb(242, 242, 242)",
    boxShadow: "none",
    borderRadius: 0
  },
  whiteCard: {
    padding: 18,
    marginTop: 24,
    boxShadow: "none",
    borderRadius: 0
  },
  whiteCardText: {
    padding: 8,
    color: "rgba(0, 0, 0, 0.6000000238418579)",
    fontFamily: "Roboto",
    fontSize: 14,
    fontWeight: 400,
    letterSpacing: 0.65
  },
  toolTipIcon: {
    color: "rgba(0, 0, 0, 0.3799999952316284)",
    paddingLeft: 5,
    paddingTop: 1
  },
  bigheader: {
    color: "rgba(0, 0, 0, 0.8700000047683716)",
    fontFamily: "Roboto",
    fontSize: "34px",
    fontWeight: 500,
    letterSpacing: "1.42px",
    lineHeight: "41px"
  },
  taxStyles: {
    color: "rgba(0, 0, 0, 0.87)",
    fontSize: 16,
    fontWeight: 400,
    lineHeight: "19px",
    letterSpacing: 0.67,
    fontFamily: "Roboto",
    marginBottom: 16
  }
};

function totalAmount(rentSummary, dataArray) {
    const {rent} = rentSummary
    const totalAmount = dataArray.reduce((prev, curr) => prev + rent[curr], 0)
    return totalAmount;
}

function RentSummaryCard(props) {
  const { classes, rentSummary, dataArray } = props;
  const {rent} = rentSummary
  const total = totalAmount(rentSummary, dataArray).toFixed(2);
  const totalHeadClassName = "es-total-amount-value " + classes.bigheader;
  return (
    <Grid container>
      <Grid xs={12} sm={7}>
        <div style={{ marginTop: 48, maxWidth: 600 }}>
            {dataArray.map(item => (
                <Grid container>
                <Grid container xs={8}>
                  <LabelContainer
                    labelName={item}
                    labelKey={`ES_${item.toUpperCase()}`}
                    style={styles.taxStyles}
                  />
                </Grid>
                <Grid xs={4} align="right">
                  <LabelContainer
                    labelName={formatAmount(rent[item])}
                    labelKey={formatAmount(rent[item]) ? formatAmount(rent[item].toFixed(2)) : 0}
                    style={styles.taxStyles}
                  />
                </Grid>
              </Grid>
            ))}
          <Divider style={{ marginBottom: 16 }} />
          <Grid container>
            <Grid item xs={6}>
              <Typography variant="body2">
                <LabelContainer
                  labelName="Total Due"
                  labelKey="ES_TOTAL_DUE"
                />
              </Typography>
            </Grid>
            <Grid
              item
              xs={6}
              align="right"
              style={{ paddingRight: 0 }}
              className="es-application-table-total-value"
            >
              <Typography variant="body2">{isNaN(total) ? 0 : formatAmount(total)}</Typography>
            </Grid>
          </Grid>
        </div>
      </Grid>
      <Grid xs={12} sm={5}>
        <Typography
          variant="body2"
          align="right"
          className="es-total-amount-text"
        >
          <LabelContainer
            labelName="Total Due"
            labelKey="ES_TOTAL_DUE"
          />
        </Typography>
        <Typography className={totalHeadClassName} align="right">
          Rs {isNaN(total) ? 0 : formatAmount(total)}
        </Typography>
      </Grid>
    </Grid>
  );
}

export default withStyles(styles)(RentSummaryCard);
