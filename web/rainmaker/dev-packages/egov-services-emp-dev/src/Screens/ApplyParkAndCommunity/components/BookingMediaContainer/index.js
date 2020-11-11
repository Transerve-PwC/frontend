import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { BookingMedia } from "./BookingMedia";
import { connect } from "react-redux";
import get from "lodash/get";

const styles = (theme) => ({
    button: {
        margin: theme.spacing.unit,
        padding: "8px 38px",
    },
    input: {
        display: "none !important",
    },
});

class BookingMediaContainer extends Component {
    render() {
        const { ...rest } = this.props;
        return <BookingMedia {...rest} />;
    }
}

const mapStateToProps = (state) => {
    let masterDataPCC = get(
        state,
        "screenConfiguration.preparedFinalObject.masterData",
        []
    );

    let availabilityCheckData = get(
        state,
        "screenConfiguration.preparedFinalObject.availabilityCheckData",
        []
    );
    return { masterDataPCC, availabilityCheckData };
};

export default withStyles(styles)(
    connect(mapStateToProps, null)(BookingMediaContainer)
);
