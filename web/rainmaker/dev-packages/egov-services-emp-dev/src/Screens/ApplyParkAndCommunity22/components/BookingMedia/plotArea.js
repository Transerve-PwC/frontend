import React from "react";
// import Helmet from "react-helmet";
  import DayPicker, { DateUtils } from "react-day-picker";
  import { httpRequest } from "egov-ui-kit/utils/api";
import {
    prepareFinalObject,
    toggleSnackbar,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
    getAvailabilityDataPCC,
    getBetweenDays,
} from "egov-ui-kit/redux/bookings/actions";
import get from "lodash/get";
import set from "lodash/set";

class PlotArea extends React.Component {
    constructor(props) {
        super(props);
    }

    getAvailabilityData = async (e, item) => {

        this.props.prepareFinalObject(
            "bkBookingData",
            item
        );
        const { availabilityCheckData } = this.props;
        // console.log('availabilityCheckData in getAvailabilityData function', availabilityCheckData,item);
        set(
            this.props.calendarVisiblity.checkavailability_pcc,
            "components.div.children.availabilityCalendarWrapper.visible",
            true
        );
        this.props.prepareFinalObject(
            "availabilityCheckData.bkBookingVenue",
            item.id
        );
        this.props.prepareFinalObject(
            "availabilityCheckData.bkLocation",
            item.name
        );
        this.props.prepareFinalObject("Booking.bkBookingVenue", item.id);

        let requestBody = {
            bookingType: availabilityCheckData.bkBookingType,
            bookingVenue:item.id,
            sector: availabilityCheckData.bkSector,
        };
// console.log('requestBody4321',requestBody)
        //  const response = await getAvailabilityDataPCC(requestBody);

        let responseData = await httpRequest(
            "/bookings/park/community/availability/_search",
            "_search", [],
            requestBody
          );
           console.log('response in response', responseData)

         let response= { status: "success", data: responseData.data };

        let responseStatus = get(response, "status", "");
        console.log('response in checkData', response)
        if (responseStatus == "SUCCESS" || responseStatus == "success") {
            console.log('in if condition data')
            let data = response.data;
            let reservedDates = [];
            var daylist = [];
            data.map((dataitem) => {
                let start = dataitem.fromDate;
                let end = dataitem.toDate;
                daylist = getBetweenDays(start, end);
                daylist.map((v) => {
                    reservedDates.push(v.toISOString().slice(0, 10));
                });
            });
           
            this.props.prepareFinalObject(
                "availabilityCheckData.reservedDays",
                reservedDates
            );
            console.log('availabilityCheckData in rsv date',availabilityCheckData)
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: "smooth",
            });
        } else {
            let errorMessage = {
                labelName: "Something went wrong, Try Again later!",
                labelKey: "", //UPLOAD_FILE_TOAST
            };
            this.props.toggleSnackbar(true, errorMessage, "error");
        }
    };

    render() {
        console.log("render in ploatArea",this.props);
        const { masterDataPCC, availabilityCheckData } = this.props;
        return masterDataPCC.map((item) => {
            // console.log('itemmmmm',item)
            let coords = `${item.x},${item.y},${item.radius}`;
            // console.log('coords',coords)
            let venueId = item.id;
            return (
                <area
                    key={item.id}
                    alt={item.name}
                    title={item.name}
                    onClick={(e) => this.getAvailabilityData(e, item)}
                    // onClick={(item.id) => {
                    //     window.scrollTo({
                    //         top: document.body.scrollHeight,
                    //         behavior: "smooth",
                    //     });
                    // }}
                    shape="circle"
                    coords={coords}
                    style={{
                        cursor: "pointer",
                    }}
                    target="_self"
                />
            );
        });
    }
}
const mapStateToProps = (state) => {
    console.log('state in mapstatetoprops',state)
    return {
        calendarVisiblity: state.screenConfiguration.screenConfig,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        prepareFinalObject: (jsonPath, value) =>
            dispatch(prepareFinalObject(jsonPath, value)),
        toggleSnackbar: (jsonPath, value) =>
            dispatch(toggleSnackbar(jsonPath, value)),
        changeRoute: (path) => dispatch(setRoute(path)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PlotArea);
