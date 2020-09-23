import React, { Component } from "react";
import Image from "egov-ui-kit/components/Image";
import  Card  from  "egov-ui-kit/components/Card";;

import { connect } from "react-redux";
import get from "lodash/get";
import {
	getQueryArg,
	setBusinessServiceDataToLocalStorage,
	getFileUrlFromAPI,
	setDocuments
} from "egov-ui-framework/ui-utils/commons";
import jp from "jsonpath";
class ImageList extends Component {
    componentDidMount = async () => {
 
    }
    render() {
        let style = {
            display: "inline-block",
            marginRight: "20px"
        }
        let { data } = this.props;
        return data.length > 0 ? (
            data.map((item, index) => { 
                return item.fileUrl !== undefined && <div style={style}> <Image size="medium" width={200} height={154} source={item.fileUrl} /></div>
            })

        ) : (
                "No Document Available."
            );
    }
}

const mapStateToProps = (state, ownProps) => {
    const { screenConfiguration } = state;

    const data = get(
        screenConfiguration.preparedFinalObject,
        ownProps.sourceJsonPath,
        []
    );
    return { data };
};

export default connect(mapStateToProps, null)(ImageList);