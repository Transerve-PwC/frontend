import { getSearchResults } from "../../../../../ui-utils/commons";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTenantId, getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";

export const fetchData = async (action, state, dispatch) => {
    let data = get(state, "screenConfiguration.preparedFinalObject.MyBooking");
    let newData = {};
    if (data == undefined) {
        newData = {
            applicationNumber: "",
            mobileNumber: "",
            fromDate: "",
            toDate: "",
            applicationStatus: "",
            bookingType: "",
            tenantId: process.env.REACT_APP_NAME === "Citizen" ? JSON.parse(getUserInfo()).permanentCity : getTenantId(),
            uuid: JSON.parse(getUserInfo()).uuid,
        };
    } else {
        if (data.applicationNumber == undefined) {
            data.applicationNumber = "";
        }
        if (data.mobileNumber == undefined) {
            data.mobileNumber = "";
        }
        if (data.fromDate == undefined) {
            data.fromDate = "";
        }
        if (data.toDate == undefined) {
            data.toDate = "";
        }
        if (data.applicationStatus == undefined) {
            data.applicationStatus = "";
        }
        if (data.bookingType == undefined) {
            data.bookingType = "";
        }
        newData = {
            tenantId: getTenantId().split(".")[0],
            uuid: JSON.parse(getUserInfo()).uuid,
        };
        newData = Object.assign(newData, data);
    }
    const response = await getSearchResults(newData);

    try {
        if (response.bookingsModelList.length > 0) {
            dispatch(
                prepareFinalObject("searchResults", response.bookingsModelList)
            );
            dispatch(
                prepareFinalObject(
                    "myApplicationsCount",
                    response.bookingsModelList.length
                )
            );
        }
        // else {
        //   dispatch(prepareFinalObject("searchResults", response.bookingsModelList));
        //   dispatch(
        //     prepareFinalObject("myApplicationsCount", response.bookingsModelList.length)
        //   );
        // }
    } catch (error) {
        console.log(error);
    }
};
