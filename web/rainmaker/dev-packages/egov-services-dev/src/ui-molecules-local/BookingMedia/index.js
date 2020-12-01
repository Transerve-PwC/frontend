import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import PlotArea from "./plotArea";
import CC from "./Sector 39_CG1731_Photo.jpg";
import Park from "./park11.jpeg";

class BookingMedia extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { masterDataPCC, availabilityCheckData, pacc_image_initial_path } = this.props;
        let pacc_image = 'No data found in selected Locality. Please select other Locality';
        let masterDataExists = 0;
        if (masterDataPCC.length > 0) {
            masterDataExists = 1;
            pacc_image = pacc_image_initial_path + "/" + masterDataPCC[0].imagePath;
        }

        return (
            <div>
            <div style={{"textAlign": "center", "fontSize": "large", "marginBottom": "20px"}} >Select venue from below picture</div>
                <img
                    id="imageMap-pccMaps"
                    src={`${pacc_image

                        }`}
                    // src={`https://zfunds3.s3.ap-south-1.amazonaws.com/${masterDataPCC[0].imagePath}`}
                    // border="0"
                    useMap="#pccMaps"
                    alt=""
                />
                <map name="pccMaps" id="pccMaps">
                    <PlotArea
                        masterDataPCC={masterDataPCC}
                        availabilityCheckData={availabilityCheckData}
                    />
                </map>
            </div>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        pacc_image_initial_path: state.screenConfiguration.preparedFinalObject.applyScreenMdmsData.Booking.Booking_Config[0].Value,
    };
};

// const mapDispatchToProps = (dispatch) => {
//     return {
//         prepareFinalObject: (jsonPath, value) =>
//             dispatch(prepareFinalObject(jsonPath, value)),
//         changeRoute: (path) => dispatch(setRoute(path)),
//     };
// };

export default connect(mapStateToProps, null)(BookingMedia);
