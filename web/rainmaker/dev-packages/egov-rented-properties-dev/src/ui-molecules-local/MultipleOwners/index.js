import React, { Component } from "react";
import Label from "egov-ui-framework/ui-containers/LabelContainer";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography"
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import { checkValueForNA } from "egov-ui-framework/ui-config/screens/specs/utils";
import get from "lodash/get";

const styles = {
    card: {
      paddingTop: 8,
      borderRadius: "inherit"
    }
  };

 class MultipleOwners extends Component {

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
        const {data = [], contents, classes} = this.props
        return (
            <div>
                {!!data.length && data.map((datum, index) => (
                    <Card className={classes.card}>
                    <CardContent>
                    <Grid container>
                        {contents.map((content) => (
                            <Grid xs={6} sm={3} 
                            style={{
                                marginBottom: "8px",
                                marginTop: "8px",
                                wordBreak : "break-word"
                              }}>
                            <Grid xs={12} sm={12}>
                            <Typography variant="caption">
                            <Label
                              labelKey={content.label}
                            //   fontSize={14}
                            />
                            </Typography>
                            </Grid>
                            <Grid xs={12} sm={12}>
                            <Typography variant="body2">
                            <Label
                              labelKey={this.generateLabelKey(content, datum)}
                            //   fontSize={14}
                              checkValueForNA={checkValueForNA}
                            />
                            </Typography>
                            </Grid>
                            </Grid>)
                        )}
                    </Grid>
                    </CardContent>
                    </Card>)
                    )}
            </div>
        )
    }
}

export default withStyles(styles)(MultipleOwners)