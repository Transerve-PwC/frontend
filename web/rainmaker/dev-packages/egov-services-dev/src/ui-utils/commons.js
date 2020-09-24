import {
    handleScreenConfigurationFieldChange as handleField,
    prepareFinalObject,
    toggleSnackbar,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
    getTenantId,
    getUserInfo,
    setapplicationNumber,
} from "egov-ui-kit/utils/localStorageUtils";
import jp from "jsonpath";
import get from "lodash/get";
import set from "lodash/set";
import store from "redux/store";
import { getCurrentFinancialYear } from "../ui-config/screens/specs/utils";
import { httpRequest } from "./api";

const role_name = JSON.parse(getUserInfo()).roles[0].code;

export const getSearchResults = async (queryObject) => {
    try {
        const response = await httpRequest(
            "post",
            "/bookings/api/citizen/_search",
            "",
            [],
            queryObject
        );
        return response;
    } catch (error) {
        store.dispatch(
            toggleSnackbar(
                true,
                { labelName: error.message, labelCode: error.message },
                "error"
            )
        );
    }
};

export const getPaymentGateways = async () => {
    try {
        const payload = await httpRequest(
            "post",
            "/pg-service/gateway/v1/_search",
            ""
        );
        return payload;
    } catch (error) {
        store.dispatch(
            toggleSnackbar(
                true,
                { labelName: error.message, labelKey: error.message },
                "error"
            )
        );
    }
};

export const getSearchResultsView = async (queryObject) => {
    try {
        const response = await httpRequest(
            "post",
            "/bookings/api/citizen/_search",
            "",
            [],
            {
                tenantId: queryObject[0]["value"],
                applicationNumber: queryObject[1]["value"],
                applicationStatus: "",
                mobileNumber: "",
                fromDate: "",
                toDate: "",
                bookingType: "",
                uuid: JSON.parse(getUserInfo()).uuid,
            }
        );
        return response;
    } catch (error) {
        store.dispatch(
            toggleSnackbar(
                true,
                { labelName: error.message, labelCode: error.message },
                "error"
            )
        );
    }
};

export const getSearchResultsViewForNewLocOswmcc = async (queryObject) => {
    try {
        const response = await httpRequest(
            "post",
            "/bookings/newLocation/citizen/osujm/_search",
            "",
            [],
            {
                tenantId: queryObject[0]["value"],
                applicationNumber: queryObject[1]["value"],
                applicationStatus: "",
                mobileNumber: "",
                fromDate: "",
                toDate: "",
                uuid: JSON.parse(getUserInfo()).uuid,
            }
        );
        return response;
    } catch (error) {
        store.dispatch(
            toggleSnackbar(
                true,
                { labelName: error.message, labelCode: error.message },
                "error"
            )
        );
    }
};

export const prepareDocumentsUploadData = (state, dispatch, type) => {
    let documents = "";

    if (type == "apply_osbm") {
        documents = get(
            state,
            "screenConfiguration.preparedFinalObject.applyScreenMdmsData.Booking.Documents",
            []
        );
    } else if (type == "apply_oswmcc_newloc") {
        documents = get(
            state,
            "screenConfiguration.preparedFinalObject.applyScreenMdmsData.Booking.OSWMCC_New_Loc_Documents",
            []
        );
    } else if (type == "apply_OSUJM") {
        documents = get(
            state,
            "screenConfiguration.preparedFinalObject.applyScreenMdmsData.Booking.OSUJM_Documents",
            []
        );
    } else if (type == "apply_cgb") {
        documents = get(
            state,
            "screenConfiguration.preparedFinalObject.applyScreenMdmsData.Booking.Com_Ground_Documents",
            []
        );
    } else if (type == "apply_pcc") {
        documents = get(
            state,
            "screenConfiguration.preparedFinalObject.applyScreenMdmsData.Booking.PCC_Document",
            []
        );
    }

    documents = documents.filter((item) => {
        return item.active;
    });
    let documentsContract = [];
    let tempDoc = {};
    documents.forEach((doc) => {
        let card = {};
        card["code"] = doc.documentType;
        card["title"] = doc.documentType;
        card["cards"] = [];
        tempDoc[doc.documentType] = card;
    });

    documents.forEach((doc) => {
        // Handle the case for multiple
        if (
            doc.code === "BK_DOC_DOC_PICTURE" &&
            doc.hasMultipleRows &&
            doc.options
        ) {
            let buildingsData = get(
                state,
                "screenConfiguration.preparedFinalObject.applyScreenMdmsData.Booking.Documents",
                []
            );

            buildingsData.forEach((building) => {
                let card = {};
                card["name"] = building.name;
                card["code"] = doc.code;
                card["hasSubCards"] = true;
                card["subCards"] = [];
                doc.options.forEach((subDoc) => {
                    let subCard = {};
                    subCard["name"] = subDoc.code;
                    subCard["required"] = subDoc.required ? true : false;
                    card.subCards.push(subCard);
                });
                tempDoc[doc.documentType].cards.push(card);
            });
        } else {
            let card = {};
            card["name"] = `BK_${doc.code}`;
            card["code"] = `BK_${doc.code}`;
            card["required"] = doc.required ? true : false;
            if (doc.hasDropdown && doc.dropdownData) {
                let dropdown = {};
                dropdown.label = "BK_SELECT_DOC_DD_LABEL";
                dropdown.required = true;
                dropdown.menu = doc.dropdownData.filter((item) => {
                    return item.active;
                });
                dropdown.menu = dropdown.menu.map((item) => {
                    return {
                        code: item.code,
                        label: getTransformedLocale(item.code),
                    };
                });
                card["dropdown"] = dropdown;
            }
            tempDoc[doc.documentType].cards.push(card);
        }
    });

    Object.keys(tempDoc).forEach((key) => {
        documentsContract.push(tempDoc[key]);
    });

    dispatch(prepareFinalObject("documentsContract", documentsContract));
};

export const createUpdateOsbApplication = async (state, dispatch, action) => {
    let response = "";
    let tenantId = process.env.REACT_APP_NAME === "Citizen" ? JSON.parse(getUserInfo()).permanentCity : getTenantId();

    let method = action === "INITIATE" ? "CREATE" : "UPDATE";
    try {
        let payload = get(
            state.screenConfiguration.preparedFinalObject,
            "Booking",
            []
        );
        let reduxDocuments = get(
            state,
            "screenConfiguration.preparedFinalObject.documentsUploadRedux",
            {}
        );
        let bookingDocuments = [];
        let otherDocuments = [];

        jp.query(reduxDocuments, "$.*").forEach((doc) => {
            if (doc.documents && doc.documents.length > 0) {
                if (doc.documentCode === "BK_DOC.DOC_PICTURE") {
                    bookingDocuments = [
                        ...bookingDocuments,
                        {
                            fileStoreId: doc.documents[0].fileStoreId,
                        },
                    ];
                } else if (!doc.documentSubCode) {
                    otherDocuments = [
                        ...otherDocuments,
                        {
                            fileStoreId: doc.documents[0].fileStoreId,
                        },
                    ];
                }
            }
        });

        set(payload, "wfDocuments", bookingDocuments);
        set(payload, "bkBookingType", "OSBM");
        set(payload, "tenantId", tenantId);
        set(payload, "bkAction", action);
        set(payload, "businessService", "OSBM");
        set(payload, "financialYear", `${getCurrentFinancialYear()}`);

        if (method === "CREATE") {
            response = await httpRequest(
                "post",
                "/bookings/api/_create",
                "",
                [],
                {
                    Booking: payload,
                }
            );
            if (
                response.data.bkApplicationNumber !== "null" ||
                response.data.bkApplicationNumber !== ""
            ) {
                dispatch(prepareFinalObject("Booking", response.data));
                setapplicationNumber(response.data.bkApplicationNumber);
                setApplicationNumberBox(state, dispatch);
                return { status: "success", data: response.data };
            } else {
                return { status: "fail", data: response.data };
            }
        } else if (method === "UPDATE") {
            response = await httpRequest(
                "post",
                "/bookings/api/_update",
                "",
                [],
                {
                    Booking: payload,
                }
            );
            setapplicationNumber(response.data.bkApplicationNumber);
            dispatch(prepareFinalObject("Booking", response.data));
            return { status: "success", data: response.data };
        }
    } catch (error) {
        dispatch(toggleSnackbar(true, { labelName: error.message }, "error"));

        // Revert the changed pfo in case of request failure
        let bookingData = get(
            state,
            "screenConfiguration.preparedFinalObject.Booking",
            []
        );
        dispatch(prepareFinalObject("Booking", bookingData));

        return { status: "failure", message: error };
    }
};
export const createUpdatePCCApplication = async (state, dispatch, action) => {
    let response = "";
    let tenantId = process.env.REACT_APP_NAME === "Citizen" ? JSON.parse(getUserInfo()).permanentCity : getTenantId();

    let method = action === "INITIATE" ? "CREATE" : "UPDATE";
    try {
        let payload = get(
            state.screenConfiguration.preparedFinalObject,
            "Booking",
            []
        );
        let reduxDocuments = get(
            state,
            "screenConfiguration.preparedFinalObject.documentsUploadRedux",
            {}
        );
        let bookingDocuments = [];
        let otherDocuments = [];

        jp.query(reduxDocuments, "$.*").forEach((doc) => {
            if (doc.documents && doc.documents.length > 0) {
                if (doc.documentCode === "BK_PCC_DOCUMENT") {
                    bookingDocuments = [
                        ...bookingDocuments,
                        {
                            fileStoreId: doc.documents[0].fileStoreId,
                        },
                    ];
                } else if (!doc.documentSubCode) {
                    otherDocuments = [
                        ...otherDocuments,
                        {
                            fileStoreId: doc.documents[0].fileStoreId,
                        },
                    ];
                }
            }
        });

        set(payload, "wfDocuments", bookingDocuments);
        set(payload, "tenantId", tenantId);
        set(payload, "bkAction", action);
        set(payload, "businessService", "PACC");
        // set(payload, "timeslots", [{
        //     "slot" : "9:00 AM - 8:59 AM"
           
        // }]);
        // set(payload, "totime", "9:00 AM");
        // set(payload, "fromtime", "8:59 AM");
        set(payload, "financialYear", `${getCurrentFinancialYear()}`);

        if (method === "CREATE") {
            response = await httpRequest(
                "post",
                "/bookings/park/community/_create",
                "",
                [],
                {
                    Booking: payload,
                }
            );
            if (
                response.data.bkApplicationNumber !== "null" ||
                response.data.bkApplicationNumber !== ""
            ) {
                dispatch(prepareFinalObject("Booking", response.data));
                setapplicationNumber(response.data.bkApplicationNumber);
                setApplicationNumberBox(state, dispatch);


                if (response.data.timeslots && response.data.timeslots.length > 0) {
                    console.log(response.data.timeslots, "Hello Nero");
                    var [fromTime, toTime] = response.data.timeslots[0].slot.split('-')
                    let DisplayPaccObject = {
                        bkDisplayFromDateTime: response.data.bkFromDate + "#" + fromTime,
                        bkDisplayToDateTime: response.data.bkToDate + "#" + toTime
                    }

                    dispatch(prepareFinalObject("DisplayTimeSlotData", DisplayPaccObject))
                    // dispatch(prepareFinalObject("DisplayPacc", { bkDisplayFromDateTime: response.data.bkFromDate + "#" + fromTime }));
                    // dispatch(prepareFinalObject("DisplayPacc", { bkDisplayToDateTime: response.data.bkToDate + "#" + toTime }));

                }


                return { status: "success", data: response.data };
            } else {
                return { status: "fail", data: response.data };
            }
        } else if (method === "UPDATE") {
            response = await httpRequest(
                "post",
                "/bookings/park/community/_update",
                "",
                [],
                {
                    Booking: payload,
                }
            );
            setapplicationNumber(response.data.bkApplicationNumber);
            dispatch(prepareFinalObject("Booking", response.data));
            return { status: "success", data: response.data };
        }
    } catch (error) {
        dispatch(toggleSnackbar(true, { labelName: error.message }, "error"));

        // Revert the changed pfo in case of request failure
        let bookingData = get(
            state,
            "screenConfiguration.preparedFinalObject.Booking",
            []
        );
        dispatch(prepareFinalObject("Booking", bookingData));

        return { status: "failure", message: error };
    }
};
export const createUpdateOSWMCCApplication = async (
    state,
    dispatch,
    action
) => {
    let response = "";
    let tenantId = process.env.REACT_APP_NAME === "Citizen" ? JSON.parse(getUserInfo()).permanentCity : getTenantId();
    let method = action === "INITIATE" ? "CREATE" : "UPDATE";
    try {
        let payload = get(
            state.screenConfiguration.preparedFinalObject,
            "Booking",
            []
        );
        let reduxDocuments = get(
            state,
            "screenConfiguration.preparedFinalObject.documentsUploadRedux",
            {}
        );

        let bookingDocuments = [];
        let otherDocuments = [];

        jp.query(reduxDocuments, "$.*").forEach((doc) => {
            if (doc.documents && doc.documents.length > 0) {
                if (doc.documentCode === "BK_OSUJM_DOCUMENT") {
                    bookingDocuments = [
                        ...bookingDocuments,
                        {
                            fileStoreId: doc.documents[0].fileStoreId,
                        },
                    ];
                } else if (!doc.documentSubCode) {
                    otherDocuments = [
                        ...otherDocuments,
                        {
                            fileStoreId: doc.documents[0].fileStoreId,
                        },
                    ];
                }
            }
        });

        set(payload, "wfDocuments", bookingDocuments);
        set(payload, "bkBookingType", "OSUJM");
        set(payload, "tenantId", tenantId);
        set(payload, "bkAction", action);
        set(payload, "businessService", "OSUJM");
        // set(payload, "bkAreaRequired", payload.bkAreaRequired);
        set(payload, "financialYear", `${getCurrentFinancialYear()}`);

        if (method === "CREATE") {
            response = await httpRequest(
                "post",
                "/bookings/api/_create",
                "",
                [],
                {
                    Booking: payload,
                }
            );
            if (
                response.data.bkApplicationNumber !== "null" ||
                response.data.bkApplicationNumber !== ""
            ) {
                dispatch(prepareFinalObject("Booking", response.data));
                setapplicationNumber(response.data.bkApplicationNumber);
                setApplicationNumberBox(state, dispatch);
                return { status: "success", data: response.data };
            } else {
                return { status: "fail", data: response.data };
            }
        } else if (method === "UPDATE") {
            response = await httpRequest(
                "post",
                "/bookings/api/_update",
                "",
                [],
                {
                    Booking: payload,
                }
            );
            setapplicationNumber(response.data.bkApplicationNumber);
            dispatch(prepareFinalObject("Booking", response.data));
            return { status: "success", data: response.data };
        }
    } catch (error) {
        dispatch(toggleSnackbar(true, { labelName: error.message }, "error"));

        // Revert the changed pfo in case of request failure
        let bookingData = get(
            state,
            "screenConfiguration.preparedFinalObject.Booking",
            []
        );
        dispatch(prepareFinalObject("Booking", bookingData));

        return { status: "failure", message: error };
    }
};
export const createUpdateOSWMCCNewLocation = async (
    state,
    dispatch,
    action
) => {
    let response = "";
    let tenantId = process.env.REACT_APP_NAME === "Citizen" ? JSON.parse(getUserInfo()).permanentCity : getTenantId();

    let method = action === "INITIATE" ? "CREATE" : "UPDATE";
    try {
        let payload = get(
            state.screenConfiguration.preparedFinalObject,
            "Booking",
            []
        );
        let reduxDocuments = get(
            state,
            "screenConfiguration.preparedFinalObject.documentsUploadRedux",
            {}
        );
        let bookingDocuments = [];
        jp.query(reduxDocuments, "$.*").forEach((doc) => {
            if (doc.documents && doc.documents.length > 0) {
                if (!doc.documentSubCode) {
                    bookingDocuments = [
                        ...bookingDocuments,
                        {
                            fileStoreId: doc.documents[0].fileStoreId,
                            documentType: doc.documentType,
                        },
                    ];
                }
            }
        });

        set(payload, "wfDocuments", bookingDocuments);

        set(payload, "tenantId", tenantId);
        set(payload, "action", action);
        set(payload, "businessService", "NLUJM");
        set(payload, "idProof", "Adhar");
        set(payload, "financialYear", `${getCurrentFinancialYear()}`);

        if (method === "CREATE") {
            response = await httpRequest(
                "post",
                "/bookings/newLocation/_create",
                "",
                [],
                {
                    NewLocationDetails: payload,
                }
            );
            if (
                response.data.applicationNumber !== "null" ||
                response.data.applicationNumber !== ""
            ) {
                dispatch(prepareFinalObject("Booking", response.data));
                setapplicationNumber(response.data.applicationNumber);
                setApplicationNumberBox(state, dispatch);
                return { status: "success", data: response.data };
            } else {
                return { status: "fail", data: response.data };
            }
        } else if (method === "UPDATE") {
            response = await httpRequest(
                "post",
                "/bookings/newLocation/_update",
                "",
                [],
                {
                    NewLocationDetails: payload,
                }
            );
            setapplicationNumber(response.data.applicationNumber);
            dispatch(prepareFinalObject("Booking", response.data));
            return { status: "success", data: response.data };
        }
    } catch (error) {
        dispatch(toggleSnackbar(true, { labelName: error.message }, "error"));

        // Revert the changed pfo in case of request failure
        let bookingData = get(
            state,
            "screenConfiguration.preparedFinalObject.Booking",
            []
        );
        dispatch(prepareFinalObject("Booking", bookingData));

        return { status: "failure", message: error };
    }
};
export const createUpdateCgbApplication = async (state, dispatch, action) => {
    let response = "";
    let tenantId = process.env.REACT_APP_NAME === "Citizen" ? JSON.parse(getUserInfo()).permanentCity : getTenantId();
    // let applicationNumber =
    //     getapplicationNumber() === "null" ? "" : getapplicationNumber();
    let method = action === "INITIATE" ? "CREATE" : "UPDATE";

    try {
        let payload = get(
            state.screenConfiguration.preparedFinalObject,
            "Booking",
            []
        );
        let reduxDocuments = get(
            state,
            "screenConfiguration.preparedFinalObject.documentsUploadRedux",
            {}
        );
        let bookingDocuments = [];
        let otherDocuments = [];

        jp.query(reduxDocuments, "$.*").forEach((doc) => {
            if (doc.documents && doc.documents.length > 0) {
                if (doc.documentCode === "BK_GFCP_DOCUMENT") {
                    bookingDocuments = [
                        ...bookingDocuments,
                        {
                            fileStoreId: doc.documents[0].fileStoreId,
                        },
                    ];
                } else if (!doc.documentSubCode) {
                    otherDocuments = [
                        ...otherDocuments,
                        {
                            fileStoreId: doc.documents[0].fileStoreId,
                        },
                    ];
                }
            }
        });

        set(payload, "wfDocuments", bookingDocuments);
        set(payload, "bkBookingType", "GROUND_FOR_COMMERCIAL_PURPOSE");
        set(payload, "tenantId", tenantId);
        set(payload, "bkAction", action);
        set(payload, "businessService", "GFCP");
        set(payload, "financialYear", `${getCurrentFinancialYear()}`);

        if (method === "CREATE") {
            response = await httpRequest(
                "post",
                "/bookings/api/_create",
                "",
                [],
                {
                    Booking: payload,
                }
            );
            if (
                response.data.bkApplicationNumber !== "null" ||
                response.data.bkApplicationNumber !== ""
            ) {
                dispatch(prepareFinalObject("Booking", response.data));
                setapplicationNumber(response.data.bkApplicationNumber);
                // setApplicationNumberBox(state, dispatch);
                return { status: "success", data: response.data };
            } else {
                return { status: "fail", data: response.data };
            }
        } else if (method === "UPDATE") {
            response = await httpRequest(
                "post",
                "/bookings/api/_update",
                "",
                [],
                {
                    Booking: payload,
                }
            );
            setapplicationNumber(response.data.bkApplicationNumber);
            dispatch(prepareFinalObject("Booking", response.data));
            return { status: "success", data: response.data };
        }
    } catch (error) {
        dispatch(toggleSnackbar(true, { labelName: error.message }, "error"));

        // Revert the changed pfo in case of request failure
        let BookingData = get(
            state,
            "screenConfiguration.preparedFinalObject.Booking",
            []
        );
        dispatch(prepareFinalObject("Booking", BookingData));

        return { status: "failure", message: error };
    }
};
export const createUpdateWtbApplication = async (state, dispatch, action) => {
    let response = "";
    let tenantId = process.env.REACT_APP_NAME === "Citizen" ? JSON.parse(getUserInfo()).permanentCity : getTenantId();
    // let applicationNumber =
    //     getapplicationNumber() === "null" ? "" : getapplicationNumber();
    let method = action === "INITIATE" ? "CREATE" : "UPDATE";

    try {
        let payload = get(
            state.screenConfiguration.preparedFinalObject,
            "Booking",
            []
        );
        set(payload, "bkBookingType", "WATER_TANKERS");
        set(payload, "tenantId", tenantId);
        set(payload, "bkAction", action);
        set(payload, "businessService", "BWT");
        set(payload, "financialYear", `${getCurrentFinancialYear()}`);
        // setapplicationMode(status);

        if (method === "CREATE") {
            response = await httpRequest(
                "post",
                "/bookings/api/_create",
                "",
                [],
                {
                    Booking: payload,
                }
            );
            if (
                response.data.bkApplicationNumber !== "null" ||
                response.data.bkApplicationNumber !== ""
            ) {
                dispatch(prepareFinalObject("Booking", response.data));
                setapplicationNumber(response.data.bkApplicationNumber);
                setApplicationNumberBox(state, dispatch);
                return { status: "success", data: response.data };
            } else {
                return { status: "fail", data: response.data };
            }
        } else if (method === "UPDATE") {
            response = await httpRequest(
                "post",
                "/bookings/api/_update",
                "",
                [],
                {
                    Booking: payload,
                }
            );
            setapplicationNumber(response.data.bkApplicationNumber);
            dispatch(prepareFinalObject("Booking", response.data));
            return { status: "success", data: response.data };
        }
    } catch (error) {
        dispatch(toggleSnackbar(true, { labelName: error.message }, "error"));

        // Revert the changed pfo in case of request failure
        let BookingData = get(
            state,
            "screenConfiguration.preparedFinalObject.Booking",
            []
        );
        dispatch(prepareFinalObject("Booking", BookingData));

        return { status: "failure", message: error };
    }
};

export const getImageUrlByFile = (file) => {
    return new Promise((resolve) => {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
            const fileurl = e.target.result;
            resolve(fileurl);
        };
    });
};

export const getFileSize = (file) => {
    const size = parseFloat(file.size / 1024).toFixed(2);
    return size;
};

export const isFileValid = (file, acceptedFiles) => {
    const mimeType = file["type"];
    return (
        (mimeType &&
            acceptedFiles &&
            acceptedFiles.indexOf(mimeType.split("/")[1]) > -1) ||
        false
    );
};

export const setApplicationNumberBox = (state, dispatch) => {
    let applicationNumber = get(
        state,
        "state.screenConfiguration.preparedFinalObject.Booking.bkApplicationNumber",
        null
    );

    if (applicationNumber) {
        dispatch(
            handleField(
                "apply",
                "components.div.children.headerDiv.children.header.children.applicationNumber",
                "visible",
                true
            )
        );
        dispatch(
            handleField(
                "apply",
                "components.div.children.headerDiv.children.header.children.applicationNumber",
                "props.number",
                applicationNumber
            )
        );
    }
};

export const findItemInArrayOfObject = (arr, conditionCheckerFn) => {
    for (let i = 0; i < arr.length; i++) {
        if (conditionCheckerFn(arr[i])) {
            return arr[i];
        }
    }
};

export const getNewLocationsSearchResults = async (queryObject) => {
    try {
        const response = await httpRequest(
            "post",
            "/bookings/newLocation/citizen/osujm/_search",
            "",
            [],
            queryObject
        );
        return response;
    } catch (error) {
        store.dispatch(
            toggleSnackbar(
                true,
                { labelName: error.message, labelCode: error.message },
                "error"
            )
        );
    }
};
