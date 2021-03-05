import { validate } from "egov-ui-framework/ui-redux/screen-configuration/utils";
import {
    getUserInfo,
    getTenantId,
    lSRemoveItem,
    lSRemoveItemlocal,
} from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import set from "lodash/set";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { httpRequest } from "../../../../ui-utils/api";
import {
    getCommonCard,
    getCommonCaption,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getFileUrlFromAPI } from "egov-ui-framework/ui-utils/commons";
import { getBookingWorkflowHistory, getSearchResultsView , } from "../../../../ui-utils/commons";
import axios from "axios";

export const getCommonApplyFooter = (children) => {
    return {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        props: {
            className: "apply-wizard-footer",
        },
        children,
    };
};

export const transformById = (payload, id) => {
    return (
        payload &&
        payload.reduce((result, item) => {
            result[item[id]] = {
                ...item,
            };

            return result;
        }, {})
    );
};

export const getTranslatedLabel = (labelKey, localizationLabels) => {
    let translatedLabel = null;
    if (localizationLabels && localizationLabels.hasOwnProperty(labelKey)) {
        translatedLabel = localizationLabels[labelKey];
        if (
            translatedLabel &&
            typeof translatedLabel === "object" &&
            translatedLabel.hasOwnProperty("message")
        )
            translatedLabel = translatedLabel.message;
    }
    return translatedLabel || labelKey;
};

export const validateFields = (objectJsonPath, state, dispatch, screen) => {
    const fields = get(
        state.screenConfiguration.screenConfig[screen],
        objectJsonPath,
        {}
    );
    let isFormValid = true;
    for (var variable in fields) {
        if (fields.hasOwnProperty(variable)) {
            if (
                fields[variable] &&
                fields[variable].props &&
                (fields[variable].props.disabled === undefined ||
                    !fields[variable].props.disabled) &&
                !validate(
                    screen,
                    {
                        ...fields[variable],
                        value: get(
                            state.screenConfiguration.preparedFinalObject,
                            fields[variable].jsonPath
                        ),
                    },
                    dispatch,
                    true
                )
            ) {
                isFormValid = false;
            }
        }
    }
    return isFormValid;
};

export const convertDateToEpoch = (dateString, dayStartOrEnd = "dayend") => {
    //example input format : "2018-10-02"
    try {
        const parts = dateString.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
        const DateObj = new Date(Date.UTC(parts[1], parts[2] - 1, parts[3]));
        DateObj.setMinutes(DateObj.getMinutes() + DateObj.getTimezoneOffset());
        if (dayStartOrEnd === "dayend") {
            DateObj.setHours(DateObj.getHours() + 24);
            DateObj.setSeconds(DateObj.getSeconds() - 1);
        }
        return DateObj.getTime();
    } catch (e) {
        return dateString;
    }
};

export const getEpochForDate = (date) => {
    const dateSplit = date.split("/");
    return new Date(dateSplit[2], dateSplit[1] - 1, dateSplit[0]).getTime();
};

export const sortByEpoch = (data, order) => {
    if (order) {
        return data.sort((a, b) => {
            return a[a.length - 1] - b[b.length - 1];
        });
    } else {
        return data.sort((a, b) => {
            return b[b.length - 1] - a[a.length - 1];
        });
    }
};

export const convertEpochToDate = (dateEpoch) => {
    const dateFromApi = new Date(dateEpoch);
    let month = dateFromApi.getMonth() + 1;
    let day = dateFromApi.getDate();
    let year = dateFromApi.getFullYear();
    month = (month > 9 ? "" : "0") + month;
    day = (day > 9 ? "" : "0") + day;
    return `${day}/${month}/${year}`;
};

export const getCurrentFinancialYear = () => {
    var today = new Date();
    var curMonth = today.getMonth();
    var fiscalYr = "";
    if (curMonth > 3) {
        var nextYr1 = (today.getFullYear() + 1).toString();
        fiscalYr = today.getFullYear().toString() + "-" + nextYr1;
    } else {
        var nextYr2 = today.getFullYear().toString();
        fiscalYr = (today.getFullYear() - 1).toString() + "-" + nextYr2;
    }
    return fiscalYr;
};

export const getFinancialYearDates = (format, et) => {
    /** Return the starting date and ending date (1st April to 31st March)
     *  of the financial year of the given date in ET. If no ET given then
     *  return the dates for the current financial year */
    var date = !et ? new Date() : new Date(et);
    var curMonth = date.getMonth();
    var financialDates = { startDate: "NA", endDate: "NA" };
    if (curMonth > 3) {
        switch (format) {
            case "dd/mm/yyyy":
                financialDates.startDate = `01/04/${date
                    .getFullYear()
                    .toString()}`;
                financialDates.endDate = `31/03/${(
                    date.getFullYear() + 1
                ).toString()}`;
                break;
            case "yyyy-mm-dd":
                financialDates.startDate = `${date
                    .getFullYear()
                    .toString()}-04-01`;
                financialDates.endDate = `${(
                    date.getFullYear() + 1
                ).toString()}-03-31`;
                break;
        }
    } else {
        switch (format) {
            case "dd/mm/yyyy":
                financialDates.startDate = `01/04/${(
                    date.getFullYear() - 1
                ).toString()}`;
                financialDates.endDate = `31/03/${date
                    .getFullYear()
                    .toString()}`;
                break;
            case "yyyy-mm-dd":
                financialDates.startDate = `${(
                    date.getFullYear() - 1
                ).toString()}-04-01`;
                financialDates.endDate = `${date
                    .getFullYear()
                    .toString()}-03-31`;
                break;
        }
    }
    return financialDates;
};

export const showHideAdhocPopup = (state, dispatch, screenKey) => {
    let toggle = get(
        state.screenConfiguration.screenConfig[screenKey],
        "components.adhocDialog.props.open",
        false
    );
    dispatch(
        handleField(screenKey, "components.adhocDialog", "props.open", !toggle)
    );
};

export const getCommonGrayCard = (children) => {
    return {
        uiFramework: "custom-atoms",
        componentPath: "Container",
        children: {
            body: {
                uiFramework: "custom-atoms",
                componentPath: "Div",
                children: {
                    ch1: getCommonCard(children, {
                        style: {
                            backgroundColor: "rgb(242, 242, 242)",
                            boxShadow: "none",
                            borderRadius: 0,
                            overflow: "visible",
                        },
                    }),
                },
                gridDefination: {
                    xs: 12,
                },
            },
        },
        gridDefination: {
            xs: 12,
        },
    };
};

export const getLabelOnlyValue = (value, props = {}) => {
    return {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
            xs: 6,
            sm: 4,
        },
        props: {
            style: {
                marginBottom: "16px",
            },
            ...props,
        },
        children: {
            value: getCommonCaption(value),
        },
    };
};

export const convertDateTimeToEpoch = (dateTimeString) => {
    //example input format : "26-07-2018 17:43:21"
    try {
        const parts = dateTimeString.match(
            /(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2}):(\d{2})/
        );
        return Date.UTC(
            +parts[3],
            parts[2] - 1,
            +parts[1],
            +parts[4],
            +parts[5]
        );
    } catch (e) {
        return dateTimeString;
    }
};

export const getReceiptData = async (queryObject) => {
    try {
        const response = await httpRequest(
            "post",
            "collection-services/payments/_search",
            "",
            queryObject
        );
        return response;
    } catch (error) {
        console.log(error);
        return {};
    }
};

export const getBill = async (queryObject) => {
    try {
        const response = await httpRequest(
            "post",
            "/billing-service/bill/v2/_fetchbill",
            "",
            queryObject
        );
        return response;
    } catch (error) {
        console.log(error, "errornew");
    }
};

export const createEstimateData = (billObject) => {
    const billDetails = billObject;
    let fees =
        billDetails &&
        billDetails[0].billAccountDetails &&
        billDetails[0].billAccountDetails.map((item) => {
            return {
                name: {
                    labelName: item.taxHeadCode,
                    labelKey: item.taxHeadCode,
                },
                value: item.amount,
                order: item.order,
                info: {
                    labelName: item.taxHeadCode,
                    labelKey: item.taxHeadCode,
                },
            };
        });
    // fees.sort(function (x, y) {
    //     return x.order - y.order;
    // });
    return fees;
};

export const generateBill = async (
    state,
    dispatch,
    applicationNumber,
    tenantId,
    bookingType
) => {
    const tenantIdn = process.env.REACT_APP_NAME === "Citizen" ? JSON.parse(getUserInfo()).permanentCity : getTenantId();
    try {
        if (applicationNumber && tenantId && bookingType) {
            let queryObject = [
                { key: "tenantId", value: tenantIdn },
                { key: "consumerCode", value: applicationNumber },
                { key: "businessService", value: bookingType },
            ];
            const payload = await getBill(queryObject);
            if (payload) {
                dispatch(
                    prepareFinalObject("ReceiptTemp[0].Bill", payload.Bill)
                );
                console.log("payload.Bill", payload.Bill);
                const estimateData = createEstimateData(payload.Bill);
                estimateData &&
                    estimateData.length &&
                    dispatch(
                        prepareFinalObject(
                            "applyScreenMdmsData.estimateCardData",
                            estimateData
                        )
                    );
            }
        }
    } catch (e) {
        console.log(e);
    }
};

export const generageBillCollection = async (
    state,
    dispatch,
    applicationNumber,
    tenantId
) => {
    try {
        if (applicationNumber && tenantId) {
            let queryObject = [
                { key: "tenantId", value: tenantId },
                { key: "consumerCodes", value: applicationNumber },
            ];
            const payload = await httpRequest(
                "post",
                "/collection-services/payments/_search",
                "",
                queryObject
            );
            if (payload) {
                dispatch(
                    prepareFinalObject("ReceiptTemp[0].Bill", [
                        payload.Payments[0].paymentDetails[0].bill,
                    ])
                );
                const estimateData = createEstimateData(
                    payload.Payments[0].paymentDetails[0].bill.billDetails
                );
                estimateData &&
                    estimateData.length &&
                    dispatch(
                        prepareFinalObject(
                            "applyScreenMdmsData.estimateCardData",
                            estimateData
                        )
                    );
            }
        }
    } catch (error) {
        console.log(error);
    }
};

export const clearlocalstorageAppDetails = (state) => {
    set(state, "screenConfiguration.preparedFinalObject", {});
    lSRemoveItemlocal("applicationType");
    lSRemoveItemlocal("applicationNumber");
    lSRemoveItemlocal("applicationStatus");
    lSRemoveItemlocal("footerApplicationStatus");
    lSRemoveItemlocal("app_noc_status");
    lSRemoveItemlocal("this_adv_code");
    lSRemoveItemlocal("this_adv_id");
    lSRemoveItemlocal("ApplicationNumber");
    lSRemoveItemlocal("gstAmount");
    lSRemoveItemlocal("amount");
    lSRemoveItemlocal("performanceBankGuaranteeCharges");
    lSRemoveItemlocal("applicationMode");
    lSRemoveItemlocal("undertakig");
    lSRemoveItemlocal("this_sub_adv_id");
    lSRemoveItemlocal("this_sub_adv_code");
    lSRemoveItemlocal("undertaking");

    lSRemoveItem("ApplicationNumber");
    lSRemoveItem("applicationType");
    lSRemoveItem("applicationNumber");
    lSRemoveItem("applicationStatus");
    lSRemoveItem("footerApplicationStatus");
    lSRemoveItem("app_noc_status");
    lSRemoveItem("this_adv_code");
    lSRemoveItem("this_adv_id");
    lSRemoveItem("gstAmount");
    lSRemoveItem("amount");
    lSRemoveItem("performanceBankGuaranteeCharges");
    lSRemoveItem("applicationMode");
    lSRemoveItem("undertakig");
    lSRemoveItem("this_sub_adv_code");
    lSRemoveItem("this_sub_adv_id");
    lSRemoveItem("undertaking");
};

export const convertDateInDMY = (inputDate) => {

    if (inputDate) {

        if (typeof (inputDate) != "object") {

            if (inputDate.includes("#")) {
                let [date, time] = inputDate.split("#");

                let today = new Date(date);
                var dd = today.getDate();
                var mm = today.getMonth() + 1;
                var yyyy = today.getFullYear();
                if (dd < 10) {
                    dd = "0" + dd;
                }

                if (mm < 10) {
                    mm = "0" + mm;
                }

                return dd + "/" + mm + "/" + yyyy + ", " + time;
            } else {


                let today = new Date(inputDate);
                var dd = today.getDate();
                var mm = today.getMonth() + 1;
                var yyyy = today.getFullYear();
                if (dd < 10) {
                    dd = "0" + dd;
                }

                if (mm < 10) {
                    mm = "0" + mm;
                }

                return dd + "/" + mm + "/" + yyyy;
            }



            //return today;

        } else {
            let today = new Date(inputDate);
            var dd = today.getDate();
            var mm = today.getMonth() + 1;
            var yyyy = today.getFullYear();
            if (dd < 10) {
                dd = "0" + dd;
            }

            if (mm < 10) {
                mm = "0" + mm;
            }

            today = dd + "/" + mm + "/" + yyyy;
            return today;
        }

    } else {
        return "";
    }
};

export const getTodaysDateInYMD = () => {
    let date = new Date();
    let month =
        date.getMonth() + 1 < 10
            ? `0${date.getMonth() + 1}`
            : date.getMonth() + 1;
    let day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    date = `${date.getFullYear()}-${month}-${day}`;
    return date;
};
export const convertDateInYMD = (data) => {
    let date = new Date(data);
    //date = date.valueOf();
    let month =
        date.getMonth() + 1 < 10
            ? `0${date.getMonth() + 1}`
            : date.getMonth() + 1;
    let day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    date = `${date.getFullYear()}-${month}-${day}`;
    // date = epochToYmdDate(date);
    return date;
};

export const getNextMonthDateInYMD = () => {
    //For getting date of same day but of next month
    let date = getTodaysDateInYMD();
    date =
        date.substring(0, 5) +
        (parseInt(date.substring(5, 7)) + 1) +
        date.substring(7, 10);
    return date;
};


export const getReceiptUrlFromFilestoreID = async (fileStoreId, mode, tenantId) => {
    const fileRes = await getFileUrlFromAPIForPdf(fileStoreId, tenantId)
    return fileRes[fileStoreId]

}


export const downloadReceiptFromFilestoreID = (fileStoreId, mode, tenantId) => {
    getFileUrlFromAPI(fileStoreId, tenantId).then(async (fileRes) => {
        if (mode === "download") {
            var win = window.open(fileRes[fileStoreId], "_blank");
            if (win) {
                win.focus();
            }
        } else {
            // printJS(fileRes[fileStoreId])
            var response = await axios.get(fileRes[fileStoreId], {
                //responseType: "blob",
                responseType: "arraybuffer",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/pdf",
                },
            });
            console.log("responseData---", response);
            const file = new Blob([response.data], { type: "application/pdf" });
            const fileURL = URL.createObjectURL(file);
            var myWindow = window.open(fileURL);
            if (myWindow != undefined) {
                myWindow.addEventListener("load", (event) => {
                    myWindow.focus();
                    myWindow.print();
                });
            }
        }
    });
};

const NumInWords = (number) => {
    const first = [
        "",
        "One ",
        "Two ",
        "Three ",
        "Four ",
        "Five ",
        "Six ",
        "Seven ",
        "Eight ",
        "Nine ",
        "Ten ",
        "Eleven ",
        "Twelve ",
        "Thirteen ",
        "Fourteen ",
        "Fifteen ",
        "Sixteen ",
        "Seventeen ",
        "Eighteen ",
        "Nineteen ",
    ];
    const tens = [
        "",
        "",
        "Twenty",
        "Thirty",
        "Forty",
        "Fifty",
        "Sixty",
        "Seventy",
        "Eighty",
        "Ninety",
    ];
    const mad = ["", "Thousand", "Million", "Billion", "Trillion"];
    let word = "";

    for (let i = 0; i < mad.length; i++) {
        let tempNumber = number % (100 * Math.pow(1000, i));
        if (Math.floor(tempNumber / Math.pow(1000, i)) !== 0) {
            if (Math.floor(tempNumber / Math.pow(1000, i)) < 20) {
                word =
                    first[Math.floor(tempNumber / Math.pow(1000, i))] +
                    mad[i] +
                    " " +
                    word;
            } else {
                word =
                    tens[Math.floor(tempNumber / (10 * Math.pow(1000, i)))] +
                    " "+
                    first[Math.floor(tempNumber / Math.pow(1000, i)) % 10] +
                    mad[i] +
                    " " +
                    word;
            }
        }

        tempNumber = number % Math.pow(1000, i + 1);
        if (Math.floor(tempNumber / (100 * Math.pow(1000, i))) !== 0)
            word =
                first[Math.floor(tempNumber / (100 * Math.pow(1000, i)))] +
                "Hunderd " +
                word;
    }
    return word + "Rupees Only";
};

export const getDurationDateWithTime = (fromDate, toDate, fromTime, toTime) => {
    console.log(`${fromDate} - ${toDate} - ${fromTime} - ${toTime}`);
    let monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];
    let startDate = new Date(fromDate);
    let finalStartDate =
        startDate.getDate() +
        " " +
        monthNames[startDate.getMonth()] +
        " " +
        startDate.getFullYear() + ", " + fromTime;

    let endDate = new Date(toDate);
    endDate.setMonth(endDate.getMonth());
    let finalEndDate =
        endDate.getDate() +
        " " +
        monthNames[endDate.getMonth()] +
        " " +
        endDate.getFullYear() + ", " + toTime;
    let finalDate = finalStartDate + " to " + finalEndDate;
    return finalDate;
};
export const getDurationDate = (fromDate, toDate) => {
    let monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];
    let startDate = new Date(fromDate);
    let finalStartDate =
        startDate.getDate() +
        " " +
        monthNames[startDate.getMonth()] +
        " " +
        startDate.getFullYear();

    let endDate = new Date(toDate);
    endDate.setMonth(endDate.getMonth());
    let finalEndDate =
        endDate.getDate() +
        " " +
        monthNames[endDate.getMonth()] +
        " " +
        endDate.getFullYear();
    let finalDate = finalStartDate + " to " + finalEndDate;
    return finalDate;
};
const getMdmsTenantsData = async () => {
    let tenantId = getTenantId().split(".")[0];
    let mdmsBody = {
        MdmsCriteria: {
            tenantId: tenantId,
            moduleDetails: [
                {
                    moduleName: "tenant",
                    masterDetails: [
                        {
                            name: "tenants",
                        },
                    ],
                },
                {
                    "moduleName": "Booking",
                    "masterDetails": [
                        {
                            "name": "PDF_BOOKING_DETAILS"
                        }
                    ]
                }

            ],
        },
    };
    try {
        let payload = await httpRequest(
            "post",
            "/egov-mdms-service/v1/_search",
            "_search",
            [],
            mdmsBody
        );
        return payload.MdmsRes.tenant;
    } catch (e) {
        console.log(e);
    }
};
export const downloadReceipt = async (
    state,
    applicationNumber,
    tenantId = "ch.chandigarh",
    flag = 'false',
    mode = "download"
) => {


    // tenantId = process.env.REACT_APP_NAME === "Citizen" ? JSON.parse(getUserInfo()).permanentCity : getTenantId();
    // let applicationData = get(
    //     state.screenConfiguration.preparedFinalObject,
    //     "Booking"
    // );

    let applicationData = {}
    let receiptUrl = ""
    let receiptVal
    let roomDataForGivenApplicationNumber= {}
    if (flag === 'false') {

        applicationData = get(
        state.screenConfiguration.preparedFinalObject,
        "Booking"
         );
            if(applicationData.roomsModel!==undefined  && applicationData.roomsModel.length>0 ){

                let communityApplicationNumber= get(
                state.screenConfiguration.preparedFinalObject,
                "Booking.bkApplicationNumber"
                 );
                 const response = await getSearchResultsView([
                    { key: "tenantId", value: tenantId },
                    { key: "applicationNumber", value: communityApplicationNumber },
                ]);
                let recData = get(response, "bookingsModelList", []);
                recData[0].roomsModel= prepareRoomCard(recData[0].roomsModel)
                console.log('plRoomData', recData)


                if(applicationData.bkApplicationNumber!==applicationNumber){

                    recData[0].roomsModel.map( (e)=>{
                        if(e.roomApplicationNumber===applicationNumber) {
                            roomDataForGivenApplicationNumber =e
                        }
                     })
                }
                applicationData = recData[0];
            }
            else{
                const response = await getSearchResultsView([
                    { key: "tenantId", value: tenantId },
                    { key: "applicationNumber", value: applicationNumber },
                ]);
                let recData = get(response, "bookingsModelList", []);


                applicationData = recData[0];

            }

    }
    else if (flag === 'true') {
        Object.assign(applicationData, state)

        if(applicationData.roomsModel!==undefined  && applicationData.roomsModel.length>0){
            applicationData.roomsModel= prepareRoomCard(applicationData.roomsModel)

        }
    }

    const refundDetailsResp = await getRefundDetails(applicationNumber, tenantId);

    let bankName = refundDetailsResp.data[0].gateway;
    const receiptQueryString = [
        { key: "consumerCodes", value: applicationNumber },
        {
            key: "tenantId",

            // value: tenantId.length > 2 ? tenantId.split('.')[0] : tenantId,
            value: tenantId,

        },
    ];
    const FETCHRECEIPT = {
        GET: {
            URL: "/collection-services/payments/_search",
            ACTION: "_get",
        },
    };
    const DOWNLOADRECEIPT = {
        GET: {
            URL: "/pdf-service/v1/_create",
            // ACTION: "_get",
        },
    };

    console.log(receiptQueryString, "nero rcpt ata");
    try {
        let payloadReceiptDetails = await httpRequest(
            "post",
            FETCHRECEIPT.GET.URL,
            FETCHRECEIPT.GET.ACTION,
            receiptQueryString
        )

        let queryStr = "";
        if (applicationData.roomsModel !== undefined && applicationData.roomsModel.length> 0 && applicationData.bkApplicationNumber!==applicationNumber) {
            queryStr = [
                { key: "key", value: "room-payment-receipt" },
                {
                    key: "tenantId",
                    value: tenantId,

                },
            ];
        } else if (applicationData.businessService === "PACC") {
            queryStr = [
                { key: "key", value: "pacc-payment-receipt-new" },
                {
                    key: "tenantId",
                    value: tenantId,

                },
            ];
        } else if (applicationData.businessService === "BWT") {
            queryStr = [
                { key: "key", value: "bk-wt-payment-receipt" },
                {
                    key: "tenantId",
                    value: tenantId,

                },
            ];
        } else {
            queryStr = [
                { key: "key", value: "bk-payment-receipt" },
                {
                    key: "tenantId",
                    value: tenantId,

                },
            ];
        }
        if (
            payloadReceiptDetails &&
            payloadReceiptDetails.Payments &&
            payloadReceiptDetails.Payments.length == 0
        ) {
            console.log("Could not find any receipts");
            return;
        }
        let tenantData = await getMdmsTenantsData();
        console.log(tenantData,"nero TenatntData")
        let paymentInfoData = "";
        let bankInfo = {};
        let tenantInfo = "";
        if (applicationData.businessService === "PACC") {
            paymentInfoData = {
                paymentDate: convertEpochToDate(
                    payloadReceiptDetails.Payments[0].transactionDate,
                    "dayend"
                ),
                transactionId:
                    payloadReceiptDetails.Payments[0].transactionNumber,
                bookingPeriod: getDurationDate(
                    applicationData.bkFromDate,
                    applicationData.bkToDate
                ),
                bookingItem: `Online Payment Against Booking of ${applicationData.bkLocation}`,
                baseCharge: parseFloat(applicationData.bkRent).toFixed(2),
                cleaningCharges: parseFloat(
                    applicationData.bkCleansingCharges
                ).toFixed(2),
                surcharges: parseFloat(
                    applicationData.bkSurchargeRent
                ).toFixed(2),
                facilitationCharge: "0.00",
                gst: (
                    parseFloat(applicationData.bkUtgst) +
                    parseFloat(applicationData.bkCgst)
                ).toFixed(2),
                totalAmount: (
                    parseFloat(applicationData.bkRent) +
                    parseFloat(applicationData.bkCleansingCharges) +
                    parseFloat(applicationData.bkSurchargeRent)
                ).toFixed(2),

                amountInWords: NumInWords(
                    parseFloat(applicationData.bkRent) +
                    parseFloat(applicationData.bkCleansingCharges) +
                    parseFloat(applicationData.bkSurchargeRent)
                ),
                paymentItemExtraColumnLabel: "Booking Period",

                paymentMode: payloadReceiptDetails.Payments[0].paymentMode,
                bankName: bankName,
                receiptNo:
                    payloadReceiptDetails.Payments[0].paymentDetails[0]
                        .receiptNumber,
                cleaningCharges: parseFloat(
                    applicationData.bkCleansingCharges
                ).toFixed(2),
                baseCharge: parseFloat(applicationData.bkRent).toFixed(2),
                cgst: parseFloat(applicationData.bkCgst),
                utgst: parseFloat(applicationData.bkUtgst),
                totalgst: (
                    parseFloat(applicationData.bkUtgst) +
                    parseFloat(applicationData.bkCgst)
                ).toFixed(2),
                refundableCharges: applicationData.bkRefundAmount,
                totalPayment: (
                    parseFloat(applicationData.bkRent) +
                    parseFloat(applicationData.bkCleansingCharges) +
                    parseFloat(applicationData.bkSurchargeRent)
                ).toFixed(2),
                paymentDate: convertEpochToDate(
                    payloadReceiptDetails.Payments[0].transactionDate,
                    "dayend"
                ),
                paymentType: payloadReceiptDetails.Payments[0].paymentMode,
                facilitationCharge: applicationData.bkFacilitationCharges ? parseFloat(applicationData.bkFacilitationCharges).toFixed(2) : 0,
                discType: "NotFound",
                totalPaymentInWords: NumInWords(
                    payloadReceiptDetails.Payments[0].totalAmountPaid
                ),
                custGSTN: applicationData.bkCustomerGstNo? applicationData.bkCustomerGstNo : "NA",
                mcGSTN: "04AAALM0758K1Z1",

            };
            bankInfo.accountholderName = applicationData.bkBankAccountHolder;
            bankInfo.rBankName = applicationData.bkBankName;
            bankInfo.rBankACNo = applicationData.bkBankAccountNumber;
            bankInfo.rIFSCCode = applicationData.bkIfscCode;
            tenantInfo = {
                municipalityName:
                    tenantData.tenants[0].city.municipalityName,
                address: tenantData.tenants[0].address,
                contactNumber: tenantData.tenants[0].contactNumber,
                webSite: tenantData.tenants[0].domainUrl,
                logoUrl: "https://chstage.blob.core.windows.net/fileshare/logo.png",

                statecode: "04",
                hsncode: "9963"
            }

        } else {
            let tax = 0;
            let amount = 0;
            if (applicationData.businessService === "OSBM") {
                tax = payloadReceiptDetails.Payments[0].paymentDetails[0].bill.billDetails[0].billAccountDetails.filter(
                    (el) => el.taxHeadCode.includes("CGST_UTGST_MANUAL_OPEN_SPACE_BOOKING_BRANCH")
                )[0].amount;
                amount = payloadReceiptDetails.Payments[0].paymentDetails[0].bill.billDetails[0].billAccountDetails.filter(
                    (el) => el.taxHeadCode.includes("PARKING_LOTS_MANUAL_OPEN_SPACE_BOOKING_BRANCH")
                )[0].amount;
            } else if (applicationData.businessService === "BWT") {
                amount = payloadReceiptDetails.Payments[0].paymentDetails[0].bill.billDetails[0].billAccountDetails.filter(
                    (el) => el.taxHeadCode.includes("WATER_TANKAR_CHARGES_BOOKING_BRANCH")
                )[0].amount;
            } else {
                amount = payloadReceiptDetails.Payments[0].paymentDetails[0].bill.billDetails[0].billAccountDetails.filter(
                    (el) => !el.taxHeadCode.includes("TAX")
                )[0].amount;
                tax = payloadReceiptDetails.Payments[0].paymentDetails[0].bill.billDetails[0].billAccountDetails.filter(
                    (el) => el.taxHeadCode.includes("TAX")
                )[0].amount;
            }
            paymentInfoData = {
                paymentDate: convertEpochToDate(
                    payloadReceiptDetails.Payments[0].transactionDate,
                    "dayend"
                ),
                transactionId:
                    payloadReceiptDetails.Payments[0].transactionNumber,
                bookingPeriod:
                    payloadReceiptDetails.Payments[0].paymentDetails[0].bill
                        .businessService === "BOOKING_BRANCH_SERVICES.MANUAL_OPEN_SPACE" ||
                        payloadReceiptDetails.Payments[0].paymentDetails[0].bill
                            .businessService === "GFCP" ||
                        payloadReceiptDetails.Payments[0].paymentDetails[0].bill
                            .businessService === "OSUJM"
                        ? getDurationDate(
                            applicationData.bkFromDate,
                            applicationData.bkToDate
                        )
                        : `${applicationData.bkDate} , ${applicationData.bkTime} `,
                bookingItem: `Online Payment Against Booking of ${payloadReceiptDetails.Payments[0].paymentDetails[0].bill
                    .businessService === "GFCP"
                    ? "Commercial Ground"
                    : payloadReceiptDetails.Payments[0]
                        .paymentDetails[0].bill.businessService ===
                        "BOOKING_BRANCH_SERVICES.MANUAL_OPEN_SPACE"
                        ? "Open Space for Building Material"
                        : payloadReceiptDetails.Payments[0]
                            .paymentDetails[0].bill.businessService ===
                            "OSUJM"
                            ? "Open Space within MCC jurisdiction"
                            : "Water Tanker"
                    }`,
                amount: amount,
                tax: tax,
                grandTotal:
                    payloadReceiptDetails.Payments[0].totalAmountPaid,
                amountInWords: NumInWords(
                    payloadReceiptDetails.Payments[0].totalAmountPaid
                ),
                paymentItemExtraColumnLabel:
                    payloadReceiptDetails.Payments[0].paymentDetails[0].bill
                        .businessService === "BOOKING_BRANCH_SERVICES.MANUAL_OPEN_SPACE" ||
                        payloadReceiptDetails.Payments[0].paymentDetails[0].bill
                            .businessService === "GFCP" ||
                        payloadReceiptDetails.Payments[0].paymentDetails[0].bill
                            .businessService === "OSUJM"
                        ? "Booking Period"
                        : "Date & Time",
                paymentMode: payloadReceiptDetails.Payments[0].paymentMode,
                bankName: bankName,
                receiptNo:
                    payloadReceiptDetails.Payments[0].paymentDetails[0]
                        .receiptNumber,
            };
        }
        console.log(paymentInfoData, "nero Qry str");
        var date2 = new Date();

        var generatedDateTime = `${date2.getDate()}-${date2.getMonth() + 1}-${date2.getFullYear()}, ${date2.getHours()}:${date2.getMinutes() < 10 ? "0" : ""}${date2.getMinutes()}`;

        let receiptData = [
            {
                applicantDetail: {
                    name: payloadReceiptDetails.Payments[0].payerName,
                    mobileNumber:
                        payloadReceiptDetails.Payments[0].mobileNumber,
                    houseNo: applicationData.bkHouseNo,
                    permanentAddress: applicationData.bkCompleteAddress,
                    permanentCity:
                        payloadReceiptDetails.Payments[0].tenantId,
                    sector: applicationData.bkSector,
                    placeOfService: applicationData.businessService === "PACC" ? "Chandigarh" : ""
                },
                booking: {
                    bkApplicationNumber:
                        payloadReceiptDetails.Payments[0].paymentDetails[0]
                            .bill.consumerCode,
                    applicationDate: applicationData.bkDateCreated,
                    bkLocation: applicationData.bkLocation,
                    bkDept: applicationData.bkBookingType,
                    bkFromTo: getDurationDate(
                        applicationData.bkFromDate,
                        applicationData.bkToDate
                    )

                },
                paymentInfo: paymentInfoData,
                payerInfo: {
                    payerName: payloadReceiptDetails.Payments[0].payerName,
                    payerMobile:
                        payloadReceiptDetails.Payments[0].mobileNumber,
                },
                generatedBy: {
                    generatedBy: JSON.parse(getUserInfo()).name,
                    generatedDateTime: generatedDateTime
                },
                bankInfo,
                tenantInfo
            },
        ];
        if(applicationData.roomsModel!==undefined  && applicationData.roomsModel.length>0 && applicationData.bkApplicationNumber!==applicationNumber){

            paymentInfoData = {
                currentDate:  `${date2.getDate()}-${date2.getMonth() + 1}-${date2.getFullYear()}`,
                cleaningCharges: "0",
                paymentDate: convertEpochToDate(
                    payloadReceiptDetails.Payments[0].transactionDate,
                    "dayend"
                ),
                transactionId:
                    payloadReceiptDetails.Payments[0].transactionNumber,
                bookingPeriod: getDurationDate(
                    applicationData.roomsModel[0].fromDate,
                    applicationData.roomsModel[0].toDate
                ),
                cgst: (payloadReceiptDetails.Payments[0].paymentDetails[0].bill.billDetails[0].billAccountDetails.filter(
                    (el) => el.taxHeadCode.includes("BKROOM_TAX")
                )[0].amount)/2,
                utgst: (payloadReceiptDetails.Payments[0].paymentDetails[0].bill.billDetails[0].billAccountDetails.filter(
                    (el) => el.taxHeadCode.includes("BKROOM_TAX")
                )[0].amount)/2,
                totalgst: payloadReceiptDetails.Payments[0].paymentDetails[0].bill.billDetails[0].billAccountDetails.filter(
                    (el) => el.taxHeadCode.includes("BKROOM_TAX")
                )[0].amount,

                paymentType: "ONLINE",
                mcGSTN: "aasdadad",
                discType: "",
                custGSTN: "asd",
                bookingItem: `Online Payment Against Booking of ${applicationData.bkLocation}`,
                baseCharge: payloadReceiptDetails.Payments[0].paymentDetails[0].bill.billDetails[0].billAccountDetails.filter(
                    (el) => el.taxHeadCode==="BKROOM"
                )[0].amount,
                cleaningCharges: "",
                surcharges: "",
                facilitationCharge: "0.00",
                gst:  payloadReceiptDetails.Payments[0].paymentDetails[0].bill.billDetails[0].billAccountDetails.filter(
                    (el) => el.taxHeadCode.includes("BKROOM_TAX")
                )[0].amount,
                totalAmount:payloadReceiptDetails.Payments[0].totalAmountPaid ,

                amountInWords: NumInWords(payloadReceiptDetails.Payments[0].totalAmountPaid),
                paymentItemExtraColumnLabel: "Booking Period",

                paymentMode: payloadReceiptDetails.Payments[0].paymentMode,
                bankName: bankName,
                receiptNo:
                    payloadReceiptDetails.Payments[0].paymentDetails[0]
                        .receiptNumber,
            };
             receiptData = [
                {
                     applicantDetails: {
                        name: payloadReceiptDetails.Payments[0].payerName,

                    },
                    booking: {

                      noOfAcRooms: roomDataForGivenApplicationNumber.totalNoOfACRooms,
                        noOfNonAcRooms:roomDataForGivenApplicationNumber.totalNoOfNonACRooms ,
                          placeOfService: "Chandigarh",
                        bkDept : applicationData.bkBookingType,
                        bkStartDate:applicationData.bkFromDate,
                        bkEndDate:applicationData.bkToDate,
                        bkLocation: applicationData.bkLocation,
                        bookingPupose: applicationData.bkBookingPurpose,
                        bkApplicationNumber:
                            payloadReceiptDetails.Payments[0].paymentDetails[0]
                                .bill.consumerCode,
                    },
                    paymentInfo: paymentInfoData,
                    payerInfo: {
                        payerName: payloadReceiptDetails.Payments[0].payerName,
                        payerMobile:
                            payloadReceiptDetails.Payments[0].mobileNumber,
                    },
                    generatedBy: {
                        generatedBy: JSON.parse(getUserInfo()).name,
                        generatedDateTime: generatedDateTime
                    },
                    bankInfo: {
                         accountholderName :  applicationData.bkBankAccountHolder ,
                         rBankName :  applicationData.bkBankName ,
                         rBankACNo :  applicationData.bkBankAccountNumber ,
                         rIFSCCode :  applicationData.bkIfscCode
                    },
                    tenantInfo: {
                            municipalityName: "Municipal Corporation Chandigarh",
                            address: "New Deluxe Building, Sector 17, Chandigarh",
                            contactNumber: "+91-172-2541002, 0172-2541003",
                            logoUrl: "https://chstage.blob.core.windows.net/fileshare/logo.png",
                            webSite: "http://mcchandigarh.gov.in",
                            mcGSTN: "aasdadad",
                            statecode: "998",
                            hsncode: "45"
                },
                },
            ];
        }



        let res = await httpRequest(
            "post",
            DOWNLOADRECEIPT.GET.URL,
            "",
            queryStr,
            { BookingInfo: receiptData },
            { Accept: "application/json" },
            { responseType: "arraybuffer" }
        )
        res.filestoreIds[0];
        if (res && res.filestoreIds && res.filestoreIds.length > 0) {
            receiptVal = res.filestoreIds.map(async (fileStoreId) => {

                if (flag === 'false') {
                    downloadReceiptFromFilestoreIDForPdf(fileStoreId, mode, tenantId);
                }
                else if (flag === 'true') {


                    receiptUrl = await getReceiptUrlFromFilestoreID(fileStoreId, mode, tenantId)
                    return receiptUrl

                }
            });

        } else {
            console.log("Error In Receipt Download");
        }



    } catch (exception) {
        console.log(exception, "Nero PDF Exception")
        alert("Some Error Occured while downloading Receipt!");
    }


    return receiptVal


};

export const downloadCertificate = async (
    state,
    applicationNumber,
    tenantId = "ch.chandigarh",
    flag = 'false',
    mode = "download"
) => {
    let applicationData = {}
    tenantId = "ch.chandigarh"
    //tenantId = process.env.REACT_APP_NAME === "Citizen" ? JSON.parse(getUserInfo()).permanentCity : getTenantId();
    let bookingWfHistory = await getBookingWorkflowHistory(applicationNumber, tenantId);

    let apporvedByDetail = {
        approvedBy: "Renil Commissioner",
        role: "Additional Commissioner",
    };


    if (bookingWfHistory && bookingWfHistory.length > 0) {
        for (let i = 0; i < bookingWfHistory.length; i++) {
            if (bookingWfHistory[i].assignee != null) {
                apporvedByDetail.approvedBy = bookingWfHistory[i].assignee.name;
                let filteredRole = bookingWfHistory[i].assignee.roles.filter((role) => {
                    return role.code == "BK_OSBM_APPROVER";
                });
                if(filteredRole !== undefined && filteredRole.length > 0)
                {

                    apporvedByDetail.role = filteredRole[0].name;
                }
            }
        }
    }


    let receiptUrl = ""
    let receiptVal
    let roomDataForGivenApplicationNumber= {}
    if (flag === 'false') {

        applicationData = get(
        state.screenConfiguration.preparedFinalObject,
        "Booking"
         );
            if(applicationData.roomsModel!==undefined  && applicationData.roomsModel.length>0 ){

                let communityApplicationNumber= get(
                state.screenConfiguration.preparedFinalObject,
                "Booking.bkApplicationNumber"
                 );
                 const response = await getSearchResultsView([
                    { key: "tenantId", value: tenantId },
                    { key: "applicationNumber", value: communityApplicationNumber },
                ]);
                let recData = get(response, "bookingsModelList", []);
                recData[0].roomsModel= prepareRoomCard(recData[0].roomsModel)
                console.log('plRoomData', recData)


                if(applicationData.bkApplicationNumber!==applicationNumber){

                    recData[0].roomsModel.map( (e)=>{
                        if(e.roomApplicationNumber===applicationNumber) {
                            roomDataForGivenApplicationNumber =e
                        }
                     })
                }
                applicationData = recData[0];
            }
            else{
                const response = await getSearchResultsView([
                    { key: "tenantId", value: tenantId },
                    { key: "applicationNumber", value: applicationNumber },
                ]);
                let recData = get(response, "bookingsModelList", []);


                applicationData = recData[0];

            }

    }
    else if (flag === 'true') {
        Object.assign(applicationData, state)

        if(applicationData.roomsModel!==undefined  && applicationData.roomsModel.length>0){
            applicationData.roomsModel= prepareRoomCard(applicationData.roomsModel)

        }
    }
    const refundDetailsResp = await getRefundDetails(applicationNumber, tenantId);

    let bankName = refundDetailsResp.data[0].gateway;
    let tenantData = await getMdmsTenantsData();

    const receiptQueryString = [
        { key: "consumerCodes", value: applicationNumber },
        {
            key: "tenantId",

            // value: tenantId.length > 2 ? tenantId.split('.')[0] : tenantId,
            value: tenantId,

        },
    ];
    const FETCHRECEIPT = {
        GET: {
            URL: "/collection-services/payments/_search",
            ACTION: "_get",
        },
    };
    const DOWNLOADRECEIPT = {
        GET: {
            URL: "/pdf-service/v1/_create",
            // ACTION: "_get",
        },
    };

    const DOWNLOADCERTIFICATE = {
        GET: {
            URL: "/pdf-service/v1/_create",
             // ACTION: "_get",
        },
    };
    let payloadReceiptDetails={}
    if(applicationData.roomsModel!==undefined  && applicationData.roomsModel.length>0 && applicationData.bkApplicationNumber!==applicationNumber){
       payloadReceiptDetails = await httpRequest(
            "post",
            FETCHRECEIPT.GET.URL,
            FETCHRECEIPT.GET.ACTION,
            receiptQueryString
        )


    }

        let queryStr = [
            {
                key: "key",
                value:(applicationData.roomsModel!==undefined  && applicationData.roomsModel.length>0 && applicationData.bkApplicationNumber!==applicationNumber)
                        ?"bk-room-booking-pl"
                        :applicationData.businessService == "OSBM"
                        ? "bk-osbm-pl"
                        : applicationData.businessService == "PACC"
                            ? "bk-pk-booking-pl"
                            : applicationData.businessService == "OSUJM"
                                ? "bk-oswmcc-booking-pl"
                                :"bk-cg-pl",
            },

            { key: "tenantId", value: tenantId },

        ];

        let bookingDuration = '';
        if (applicationData.businessService == "PACC" && applicationData.bkBookingType == "Community Center") {
            if (applicationData.timeslots && applicationData.timeslots.length > 0) {

                var [fromTime, toTime] = applicationData.timeslots[0].slot.split('-')

                bookingDuration = getDurationDateWithTime(
                    applicationData.bkFromDate,
                    applicationData.bkToDate,
                    fromTime,
                    toTime
                )


            }
        } else {
            bookingDuration = getDurationDate(
                applicationData.bkFromDate,
                applicationData.bkToDate
            )
        }
        var date2 = new Date();

        let paymentInfo = {};
        let bankInfo = {};
        if (applicationData.businessService === "PACC") {
            //console.log(applicationData, "nero AvvapplicationDatassssss")
            const receiptQueryString = [
                { key: "consumerCodes", value: applicationData.bkApplicationNumber },
                {
                    key: "tenantId",

                    // value: tenantId.length > 2 ? tenantId.split('.')[0] : tenantId,
                    value: tenantId,

                },
            ];
            const FETCHRECEIPT = {
                GET: {
                    URL: "/collection-services/payments/_search",
                    ACTION: "_get",
                },
            };
            let payloadReceiptDetails = await httpRequest(
                "post",
                FETCHRECEIPT.GET.URL,
                FETCHRECEIPT.GET.ACTION,
                receiptQueryString
            )


            paymentInfo.cleaningCharges = parseFloat(
                applicationData.bkCleansingCharges
            ).toFixed(2);
            paymentInfo.baseCharge = parseFloat(applicationData.bkRent).toFixed(2);
            paymentInfo.cgst = parseFloat(applicationData.bkCgst);
            paymentInfo.utgst = parseFloat(applicationData.bkUtgst);
            paymentInfo.totalgst = (
                parseFloat(applicationData.bkUtgst) +
                parseFloat(applicationData.bkCgst)
            ).toFixed(2);
            paymentInfo.refundableCharges = applicationData.bkRefundAmount;
            paymentInfo.totalPayment = (
                parseFloat(applicationData.bkRent) +
                parseFloat(applicationData.bkCleansingCharges) +
                parseFloat(applicationData.bkSurchargeRent)
            ).toFixed(2);
            paymentInfo.paymentDate = convertEpochToDate(
                payloadReceiptDetails.Payments[0].transactionDate,
                "dayend"
            );
            paymentInfo.receiptNo = payloadReceiptDetails.Payments[0].paymentDetails[0]
                .receiptNumber;
            paymentInfo.custGSTN = applicationData.bkCustomerGstNo? applicationData.bkCustomerGstNo : "NA";
            paymentInfo.mcGSTN = "04AAALM0758K1Z1";

            bankInfo.accountholderName = applicationData.bkBankAccountHolder;
            bankInfo.rBankName = applicationData.bkBankName;
            bankInfo.rBankACNo = applicationData.bkBankAccountNumber;
            bankInfo.rIFSCCode = applicationData.bkIfscCode;



        }
        var generatedDateTime = `${date2.getDate()}-${date2.getMonth() + 1}-${date2.getFullYear()}, ${date2.getHours()}:${date2.getMinutes() < 10 ? "0" : ""}${date2.getMinutes()}`;

        let certificateData = [
            {
                applicantDetail: {
                    name: applicationData.bkApplicantName,
                    mobileNumber: applicationData.bkMobileNumber,
                    houseNo: applicationData.bkHouseNo,
                    permanentAddress:
                        applicationData.businessService == "PACC"
                            ? applicationData.bkHouseNo
                            : applicationData.bkCompleteAddress,
                    permanentCity: tenantData.tenants[0].city.name,
                    sector: applicationData.bkSector,
                    fatherName: applicationData.bkFatherName,
                    placeOfService: applicationData.businessService == "PACC" ? "Chandigarh" : ""
                },
                bookingDetail: {
                    applicationNumber: applicationNumber,
                    applicationDate: convertDateInDMY(
                        applicationData.bkDateCreated
                    ),
                    bookingType: applicationData.bkBookingType,
                    villageOrCity: applicationData.bkVillCity,
                    residentialOrCommercial: applicationData.bkType,
                    areaRequired: applicationData.bkAreaRequired,
                    category: applicationData.bkCategory,
                    typeOfConstruction: applicationData.bkConstructionType,
                    permissionPeriod: getDurationDate(
                        applicationData.bkFromDate,
                        applicationData.bkToDate
                    ),
                    bookingPeriod: bookingDuration,
                    venueName: applicationData.bkLocation,
                    sector: applicationData.bkSector,
                    groundName: applicationData.bkSector,
                    bookingPupose: applicationData.bkBookingPurpose,
                    duration:
                        applicationData.bkDuration == "1"
                            ? `${applicationData.bkDuration} Month`
                            : `${applicationData.bkDuration} Months`,

                    categoryImage: "",
                    statecode: applicationData.businessService == "PACC" ? "04" : "",
                    hsncode: applicationData.businessService == "PACC" ? "9963" : "NA",
                },
                approvedBy: apporvedByDetail,
                tenantInfo: {
                    municipalityName:
                        tenantData.tenants[0].city.municipalityName,
                    address: tenantData.tenants[0].address,
                    contactNumber: tenantData.tenants[0].contactNumber,
                    webSite: tenantData.tenants[0].domainUrl,
                },
                generatedBy: {
                    generatedBy: JSON.parse(getUserInfo()).name,

                },
                paymentInfo,
                bankInfo
            },
        ];
        let paymentInfoData={}
        if(applicationData.roomsModel!==undefined  && applicationData.roomsModel.length>0 && applicationData.bkApplicationNumber!==applicationNumber){

            paymentInfoData = {

                cleaningCharges: "0",
                baseCharge:  payloadReceiptDetails.Payments[0].paymentDetails[0].bill.billDetails[0].billAccountDetails.filter(
                    (el) => el.taxHeadCode==="BKROOM"
                )[0].amount,
                cgst:  (payloadReceiptDetails.Payments[0].paymentDetails[0].bill.billDetails[0].billAccountDetails.filter(
                    (el) => el.taxHeadCode.includes("BKROOM_TAX")
                )[0].amount)/2,
                utgst:  (payloadReceiptDetails.Payments[0].paymentDetails[0].bill.billDetails[0].billAccountDetails.filter(
                    (el) => el.taxHeadCode.includes("BKROOM_TAX")
                )[0].amount)/2,
                totalgst:  (payloadReceiptDetails.Payments[0].paymentDetails[0].bill.billDetails[0].billAccountDetails.filter(
                    (el) => el.taxHeadCode.includes("BKROOM_TAX")
                )[0].amount),
                refundableCharges: "",
                totalPayment: payloadReceiptDetails.Payments[0].totalAmountPaid,
                paymentDate: convertEpochToDate(
                    payloadReceiptDetails.Payments[0].transactionDate,
                    "dayend"
                ),
                receiptNo: payloadReceiptDetails.Payments[0].paymentDetails[0]
                .receiptNumber,
                currentDate:  `${new Date().getDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear()}`,
                paymentType: payloadReceiptDetails.Payments[0].paymentMode,
                facilitationCharge: "Not Applicable",
                custGSTN: applicationData.bkCustomerGstNo ,
                mcGSTN: "",
                bankName: bankName,
                transactionId: payloadReceiptDetails.Payments[0].transactionNumber,
                totalPaymentInWords:  NumInWords(payloadReceiptDetails.Payments[0].totalAmountPaid),
                discType: "0"

            };
            certificateData = [
                {
                applicantDetails: {
                        name: payloadReceiptDetails.Payments[0].payerName,
                        permanentAddress: applicationData.bkHouseNo,
                        permanentCity: tenantData.tenants[0].city.name,
                        placeOfService: "Chandigarh"

                    },
                    bookingDetails: {
                        bkLocation: applicationData.bkLocation,
                        bkDept : applicationData.bkBookingType,

                        noOfACRooms: roomDataForGivenApplicationNumber.totalNoOfACRooms,
                        noOfNonACRooms:roomDataForGivenApplicationNumber.totalNoOfNonACRooms,
                         bookingPupose: applicationData.bkBookingPurpose,
                        bkStartDate:applicationData.bkFromDate,
                        bkEndDate:applicationData.bkToDate,
                        placeOfService: "Chandigarh",
                        venueName: applicationData.bkLocation,
                        sector: applicationData.bkSector,
                        bookingType:applicationData.bkBookingType,
                        applicationDate: convertDateInDMY(
                            applicationData.bkDateCreated
                        ),
                        bookingPeriod: bookingDuration,
                        bkApplicationNumber:
                            payloadReceiptDetails.Payments[0].paymentDetails[0]
                                .bill.consumerCode,
                    },

                    payerInfo: {
                        payerName: payloadReceiptDetails.Payments[0].payerName,
                        payerMobile:
                            payloadReceiptDetails.Payments[0].mobileNumber,
                    },
                    paymentInfo:  paymentInfoData,
                    generatedBy: {
                        generatedBy: JSON.parse(getUserInfo()).name,
                        generatedDateTime: generatedDateTime
                    },
                    bankInfo: {
                         accountholderName :  applicationData.bkBankAccountHolder ,
                         rBankName :  applicationData.bkBankName ,
                         rBankACNo :  applicationData.bkBankAccountNumber ,
                         rIFSCCode :  applicationData.bkIfscCode
                    },
                    tenantInfo: {
                            municipalityName: "Municipal Corporation Chandigarh",
                            address: "New Deluxe Building, Sector 17, Chandigarh",
                            contactNumber: "+91-172-2541002, 0172-2541003",
                            logoUrl: "https://chstage.blob.core.windows.net/fileshare/logo.png",
                            webSite: "http://mcchandigarh.gov.in",
                            mcGSTN: "aasdadad",
                            statecode: "998",
                            hsncode: "45"
                },
                },
            ];
        }

        let res = await httpRequest(
            "post",
            DOWNLOADCERTIFICATE.GET.URL,
            "",
            queryStr,
            { BookingInfo: certificateData },
            { Accept: "application/json" },
            { responseType: "arraybuffer" }
        )


        if (res && res.filestoreIds && res.filestoreIds.length > 0) {

            receiptVal = res.filestoreIds.map(async (fileStoreId) => {

                if (flag === 'false') {
                    downloadReceiptFromFilestoreIDForPdf(fileStoreId, mode, tenantId);
                }
                else if (flag === 'true') {


                    receiptUrl = await getReceiptUrlFromFilestoreID(fileStoreId, mode, tenantId)
                    return receiptUrl

                }

            });
        } else {
            console.log("Error In Permission Letter Download");
        }

        //   })

    return receiptVal
};

export const downloadApplication = async (
    state,
    applicationNumber,
    tenantId,
    mode = "download"
) => {
    let tenantData = await getMdmsTenantsData();
    tenantId = process.env.REACT_APP_NAME === "Citizen" ? JSON.parse(getUserInfo()).permanentCity : getTenantId();
    //tenantId

    let applicationData = get(
        state.screenConfiguration.preparedFinalObject,
        "Booking"
    );

    const response = await getSearchResultsView([
        { key: "tenantId", value: tenantId },
        { key: "applicationNumber", value: applicationNumber },
    ]);
    let recData = get(response, "bookingsModelList", []);
    let documentName = '';
    let document2 = '';
    if (applicationData.businessService != "NLUJM") {
        let attachedDocuments = get(
            state.screenConfiguration.preparedFinalObject,
            "documentsPreview"
        );
        documentName = attachedDocuments && attachedDocuments[0].name;
        console.log(attachedDocuments, "Nero AttachedDocument");
        if (applicationData.businessService == "OSBM") {
            let attachedDocuments = get(
                state.screenConfiguration.preparedFinalObject,
                "approvalDocument"
            );
            document2 = attachedDocuments && attachedDocuments[0].name;
        }
    }
    let paymentData = get(
        state.screenConfiguration.preparedFinalObject,
        "ReceiptTemp[0].Bill[0]"
    );


    const DOWNLOADAPPLICATION = {
        GET: {
            URL: "/pdf-service/v1/_create",
            // ACTION: "_get",
        },
    };
    try {
        const queryStr = [
            {
                key: "key",
                value:
                    applicationData.businessService == "OSBM"
                        ? "bk-osbm-app-form"
                        : applicationData.businessService == "GFCP"
                            ? "bk-cg-app-form"
                            : applicationData.businessService == "PACC"
                                ? "pacc-booking-app-form"
                                : applicationData.businessService == "NLUJM"
                                    ? "bk-oswmcc-newloc-app-form"
                                    : applicationData.businessService == "OSUJM"
                                        ? "oswmcc-booking-app-form"
                                        : applicationData.bkStatus.includes("Paid")
                                            ? "bk-wt-app-form"
                                            : "bk-wt-unpaid-app-form",
            },
            { key: "tenantId", value: tenantId },
        ];

        let bookingDataOsbm = {
            applicationNumber: applicationNumber,
            houseNo: applicationData.bkHouseNo,
            locality: applicationData.bkSector,
            completeAddress: applicationData.bkCompleteAddress,
            applicationDate: applicationData.bkDateCreated,
            villageOrCity: applicationData.bkVillCity,
            propertyType: applicationData.bkType,
            storageAreaRequired: applicationData.bkAreaRequired,
            category: applicationData.bkCategory,
            typeOfConstruction: applicationData.bkConstructionType,
            // permissionPeriod: "From 18-03-2020 To 17-04-2020",
            duration:
                applicationData.bkDuration == "1"
                    ? `${applicationData.bkDuration} Month`
                    : `${applicationData.bkDuration} Months`,
            categoryImage: "",
            // categoryImage: applicationData.bkCategory === "Cat-A" ? "http://3.6.65.87:3000/static/media/cat-a.4e1bc5ec.jpeg" : applicationData.bkCategory === "Cat-B" ? "" : "http://3.6.65.87:3000/static/media/cat-c.4e1bc5ec.jpeg"
        };
        let bookingDataWt = {
            applicationNumber: applicationNumber,
            name: applicationData.bkApplicantName,
            mobileNumber: applicationData.bkMobileNumber,
            email: applicationData.bkEmail,
            houseNo: applicationData.bkHouseNo,
            locality: applicationData.bkSector,
            completeAddress: applicationData.bkCompleteAddress,
            applicationDate: applicationData.bkDateCreated,
            propertyType: applicationData.bkType,
            date: convertDateInDMY(applicationData.bkDate),
            time: applicationData.bkTime,
            applicationStatus: applicationData.bkApplicationStatus === "PENDINGASSIGNMENTDRIVER" ? "Request Verification Pending" : applicationData.bkApplicationStatus === "PENDINGUPDATE" ? "Out for Delivery" : applicationData.bkApplicationStatus === "DELIVERED" ? "Processed" : applicationData.bkApplicationStatus,
            applicationType: applicationData.bkStatus,
        };
        let bookingDataGFCP = {
            applicationNumber: applicationNumber,
            venue: applicationData.bkBookingVenue,
            bookingCategory: applicationData.bkCategory,
            bookingPeriod: getDurationDate(
                applicationData.bkFromDate,
                applicationData.bkToDate
            ),
            bookingPurpose: applicationData.bkBookingPurpose,
        };
        let bookingDataOSUJM = {
            applicationNumber: applicationNumber,
            applicationDate: applicationData.bkDateCreated,
            venueName: applicationData.bkBookingVenue,
            sector: applicationData.bkSector,
            bookingPeriod: getDurationDate(
                applicationData.bkFromDate,
                applicationData.bkToDate
            ),
            bookingPurpose: applicationData.bkBookingPurpose,
            status:  applicationData.bkApplicationStatus === "PENDINGAPPROVAL" ? "Pending Approval" : applicationData.bkApplicationStatus === "PENDINGPAYMENT" ? "Pending Payment" : applicationData.bkApplicationStatus === "APPROVED" ? "Approved" : applicationData.bkApplicationStatus,
        
        };
        let bookingDataPacc = {
            applicationNumber: applicationNumber,
            applicationDate: applicationData.bkDateCreated,
            venueName: applicationData.bkLocation,
            sector: applicationData.bkSector,
            bookingPeriod: getDurationDate(
                applicationData.bkFromDate,
                applicationData.bkToDate
            ),
            bookingPurpose: applicationData.bkBookingPurpose,
            parkDim: applicationData.bkDimension,
        };

        var date2 = new Date();

        var generatedDateTime = `${date2.getDate()}-${date2.getMonth() + 1}-${date2.getFullYear()}, ${date2.getHours()}:${date2.getMinutes() < 10 ? "0" : ""}${date2.getMinutes()}`;
        let appData = "";
        let baseCharge = null;
        let taxes = null;
        let ugst = null;
        let cgst = null;

        if (applicationData.businessService == "OSBM") {

            baseCharge = paymentData.billDetails[0].billAccountDetails.filter(
                (el) => el.taxHeadCode.includes("PARKING_LOTS_MANUAL_OPEN_SPACE_BOOKING_BRANCH")
            )[0].amount;
            taxes = paymentData.billDetails[0].billAccountDetails.filter(
                (el) => el.taxHeadCode.includes("CGST_UTGST_MANUAL_OPEN_SPACE_BOOKING_BRANCH")
            )[0].amount;
            ugst = taxes / 2;
            cgst = taxes / 2;

        } else if (applicationData.businessService == "BWT") {
            baseCharge = paymentData.billDetails[0].billAccountDetails.filter(
                (el) => el.taxHeadCode.includes("WATER_TANKAR_CHARGES_BOOKING_BRANCH")
            )[0].amount;

        } else if(applicationData.businessService == "OSUJM") {

            baseCharge = paymentData.billDetails[0].billAccountDetails.filter(
                (el) => (el.taxHeadCode=="OSUJM")
            )[0].amount;
            taxes = paymentData.billDetails[0].billAccountDetails.filter(
                (el) => el.taxHeadCode.includes("TAX")
            )[0].amount;

        }else {

            baseCharge = paymentData.billDetails[0].billAccountDetails.filter(
                (el) => !el.taxHeadCode.includes("TAX")
            )[0].amount;
            taxes = paymentData.billDetails[0].billAccountDetails.filter(
                (el) => el.taxHeadCode.includes("TAX")
            )[0].amount;

        }

        if (applicationData.businessService == "NLUJM") {
            appData = [
                {
                    applicantDetail: {
                        name: applicationData.applicantName,
                        mobileNumber: applicationData.contact,
                        permanentAddress: applicationData.applicantAddress,
                        email: applicationData.mailAddress,
                    },
                    locationDetail: {
                        applicationNumber: applicationData.applicationNumber,
                        locality: applicationData.sector,
                        address: applicationData.localityAddress,
                        areaReq: applicationData.areaRequirement,
                        landmark: applicationData.landmark,
                    },
                    generatedBy: {
                        generatedBy: JSON.parse(getUserInfo()).name,
                        generatedDateTime: generatedDateTime
                    },
                },
            ];
        } else if (applicationData.businessService == "PACC") {
            appData = [
                {
                    applicantDetail: {
                        name: applicationData.bkApplicantName,
                        mobileNumber: applicationData.bkMobileNumber,
                        houseNo: applicationData.bkHouseNo,
                        permanentAddress: applicationData.bkHouseNo,
                        permanentCity: tenantData.tenants[0].city.name,
                        sector: applicationData.bkSector,
                        email: applicationData.bkEmail,
                        fatherName: applicationData.bkFatherName,
                        DOB: null,
                    },
                    bookingDetail:
                        applicationData.businessService === "OSBM"
                            ? bookingDataOsbm
                            : applicationData.businessService === "PACC"
                                ? bookingDataPacc
                                : applicationData.businessService === "GFCP"
                                    ? bookingDataGFCP
                                    : applicationData.businessService === "OSUJM"
                                        ? bookingDataOSUJM
                                        : bookingDataWt,
                    feeDetail: {
                        baseCharge: applicationData.bkRent,
                        cleaningCharge: applicationData.bkCleansingCharges,
                        surcharges: applicationData.bkSurchargeRent,
                        facilitationCharge: 0,
                        utgst: applicationData.bkUtgst,
                        cgst: applicationData.bkCgst,
                        gst: applicationData.bkUtgst + applicationData.bkCgst,
                        totalAmount:
                            parseFloat(applicationData.bkRent) +
                            parseFloat(applicationData.bkCleansingCharges) +
                            parseFloat(applicationData.bkSurchargeRent),
                    },
                    generatedBy: {
                        generatedBy: JSON.parse(getUserInfo()).name,
                        generatedDateTime: generatedDateTime
                    },
                    documentDetail: {
                        documentName: documentName
                    },
                },
            ];
        } else {
            appData = [
                {
                    applicantDetail: {
                        name: applicationData.bkApplicantName,
                        mobileNumber: applicationData.bkMobileNumber,
                        houseNo: applicationData.bkHouseNo,
                        permanentAddress: applicationData.bkCompleteAddress,
                        permanentCity: tenantData.tenants[0].city.name,
                        sector: applicationData.bkSector,
                        email: applicationData.bkEmail,
                        fatherName: applicationData.bkFatherName,
                        DOB: null,
                    },
                    bookingDetail:
                        applicationData.businessService === "OSBM"
                            ? bookingDataOsbm
                            : applicationData.businessService === "GFCP"
                                ? bookingDataGFCP
                                : applicationData.businessService === "OSUJM"
                                    ? bookingDataOSUJM
                                    : bookingDataWt,
                    // feeDetail: {
                    //     baseCharge:
                    //         paymentData === undefined
                    //             ? null
                    //             : paymentData.billDetails[0].billAccountDetails.filter(
                    //                 (el) => !el.taxHeadCode.includes("TAX")
                    //             )[0].amount,
                    //     taxes:
                    //         paymentData === undefined
                    //             ? null
                    //             : paymentData.billDetails[0].billAccountDetails.filter(
                    //                 (el) => el.taxHeadCode.includes("TAX")
                    //             )[0].amount,
                    //     ugst:
                    //         paymentData === undefined
                    //             ? null
                    //             : paymentData.billDetails[0].billAccountDetails.filter(
                    //                 (el) => el.taxHeadCode.includes("TAX")
                    //             )[0].amount/2,
                    //     cgst:
                    //         paymentData === undefined
                    //             ? null
                    //             : paymentData.billDetails[0].billAccountDetails.filter(
                    //                 (el) => el.taxHeadCode.includes("TAX")
                    //             )[0].amount/2,
                    //     totalAmount:
                    //         paymentData === undefined
                    //             ? null
                    //             : paymentData.totalAmount,
                    // },
                    feeDetail: {
                        baseCharge: baseCharge,
                        taxes: taxes,
                        ugst: ugst,
                        cgst: cgst,
                        totalAmount:
                            paymentData === undefined
                                ? null
                                : paymentData.totalAmount,
                    },
                    generatedBy: {
                        generatedBy: JSON.parse(getUserInfo()).name,
                        generatedDateTime: generatedDateTime
                    },
                    documentDetail: {
                        documentName: documentName,
                        document2: document2
                    },
                },
            ];
        }

        httpRequest(
            "post",
            DOWNLOADAPPLICATION.GET.URL,
            "",
            queryStr,
            { BookingInfo: appData },
            { Accept: "application/json" },
            { responseType: "arraybuffer" }
        ).then((res) => {
            res.filestoreIds[0];
            if (res && res.filestoreIds && res.filestoreIds.length > 0) {
                res.filestoreIds.map((fileStoreId) => {
                    downloadReceiptFromFilestoreIDForPdf(fileStoreId, mode, tenantId);
                });
            } else {
                console.log("Error In Application Download");
            }
        });
        //   })
    } catch (exception) {
        console.log(exception, "Something Went Wront")
        alert("Some Error Occured while downloading Application!");
    }
};

export const getAvailabilityData = async (sectorData) => {
    let requestBody = {
        bookingType: "GROUND_FOR_COMMERCIAL_PURPOSE",
        bookingVenue: sectorData,
    };
    try {
        const response = await httpRequest(
            "post",
            "bookings/commercial/ground/availability/_search",
            "",
            [],
            requestBody
        );
        return response;
    } catch (exception) {
        console.log(exception);
    }
};
export const getAvailabilityDataOSWMCC = async (
    bookingSector,
    bookingVenue
) => {
    let requestBody = {
        bookingType: "OSUJM",
        bkSector: bookingSector,
        bookingVenue: bookingVenue,
        // bkSector: "SECTOR-17",
        // bookingVenue: "RamLila Ground",
    };
    try {
        const response = await httpRequest(
            "post",
            "bookings/osujm/availability/_search",
            "",
            [],
            requestBody
        );
        return { status: "success", data: response.data };
    } catch (exception) {
        console.log(exception);
    }
};

export const getNewLocatonImages = async (bookingSector, bookingArea) => {
    let requestBody = {
        sector: bookingSector,
        venue: bookingArea,
    };
    try {
        const response = await httpRequest(
            "post",
            "bookings/newLocation/osujm/_document",
            "",
            [],
            requestBody
        );
        // return response;
        return { status: "success", data: response };
    } catch (exception) {
        console.log(exception);
    }
};
export const getBetweenDays = function (start, end) {
    let arr = [];
    // let endDate = new Date(end);
    for (
        let dt = new Date(start);
        dt <= new Date(end);
        dt.setDate(dt.getDate() + 1)
    ) {
        arr.push(new Date(dt));
    }
    return arr;
};

export const getPerDayRateCgb = async (bookingVenue) => {
    let requestBody = {
        bookingVenue: bookingVenue,
        category: "Company",
    };
    try {
        const response = await httpRequest(
            "post",
            "bookings/commercial/ground/fee/_search",
            "",
            [],
            requestBody
        );
        // return response;
        return { status: "success", data: response.data };
    } catch (exception) {
        console.log(exception);
    }
};

export const checkAvaialbilityAtSubmitCgb = async (bookingVenue, from, to) => {
    let requestBody = {
        Booking: {
            bkBookingType: "GROUND_FOR_COMMERCIAL_PURPOSE",
            bkBookingVenue: bookingVenue,
            bkFromDate: from,
            bkToDate: to,
        },
    };
    try {
        const response = await httpRequest(
            "post",
            "bookings/commercial/ground/booked/dates/_search",
            "",
            [],
            requestBody
        );
        // return response;
        return { status: "success", data: response.data };
    } catch (exception) {
        console.log(exception);
    }
};
export const checkAvaialbilityAtSubmitOsujm = async (
    sector,
    bookingVenue,
    from,
    to
) => {
    let requestBody = {
        Booking: {
            bkSector: sector,
            bkBookingType: "OSUJM",
            bkBookingVenue: bookingVenue,
            bkFromDate: from,
            bkToDate: to,
        },
    };
    try {
        const response = await httpRequest(
            "post",
            "bookings/osujm/booked/dates/_fetch",
            "",
            [],
            requestBody
        );
        // return response;
        return { status: "success", data: response.data };
    } catch (exception) {
        console.log(exception);
    }
};
export const checkAvaialbilityAtSubmit = async (bookingData, dispatch) => {
    let businessService = bookingData.businessService;
    let requestBody = {};
    let isAvailable = true;
    if (businessService === "GFCP") {
        requestBody = {
            Booking: {
                bkBookingType: "GROUND_FOR_COMMERCIAL_PURPOSE",
                bkBookingVenue: bookingData.bkBookingVenue,
                bkFromDate: bookingData.bkFromDate,
                bkToDate: bookingData.bkToDate,
            },
        };
        try {
            const bookedDates = await httpRequest(
                "post",
                "bookings/commercial/ground/booked/dates/_search",
                "",
                [],
                requestBody
            );
            bookedDates.data.length > 0
                ? bookedDates.data.map((val) => {
                    if (val === from || val === to) {
                        isAvailable = false;
                    } else {
                        isAvailable = true
                    }
                })
                : (isAvailable = true);
        } catch (exception) {
            console.log(exception);
        }
    } else if (businessService === "OSUJM") {
        requestBody = {
            Booking: {
                bkSector: bookingData.bkSector,
                bkBookingType: "OSUJM",
                bkBookingVenue: bookingData.bkBookingVenue,
                bkFromDate: bookingData.bkFromDate,
                bkToDate: bookingData.bkToDate,
            },
        };

        try {
            const bookedDates = await httpRequest(
                "post",
                "bookings/osujm/booked/dates/_fetch",
                "",
                [],
                requestBody
            );
            bookedDates.data.length > 0
                ? bookedDates.data.map((val) => {
                    if (val === from || val === to) {
                        isAvailable = false;
                    } else {
                        isAvailable = true
                    }
                })
                : (isAvailable = true);
        } catch (exception) {
            console.log(exception);
        }
    } else {
        isAvailable = true;
    }
    return isAvailable;
};

export const getPerDayRateOSWMCC = async (bookingSector, bookingArea) => {
    let requestBody = {
        Booking: {
            bkSector: bookingSector,
            bkAreaRequired: bookingArea,
        },
    };
    try {
        const response = await httpRequest(
            "post",
            "bookings/osujm/fee/_search",
            "",
            [],
            requestBody
        );
        // return response;
        return { status: "success", data: response.data };
    } catch (exception) {
        console.log(exception);
    }
};
export const getTextFieldReadOnly = (textScheama) => {
    const {
        label = {},
        readOnlyValue,
        placeholder = {},
        localePrefix = {},
        required = false,
        pattern,
        jsonPath = "",
        sourceJsonPath = "",
        cityDropdown = "",
        data = [],
        optionValue = "code",
        optionLabel = "code",
        iconObj = {},
        gridDefination = {
            xs: 12,
            sm: 6,
        },
        props = {},
        minLength,
        maxLength,
        minValue,
        maxValue,
        infoIcon,
        title = {},
        errorMessage = "",
        requiredMessage = "",
        ...rest
    } = textScheama;
    return {
        uiFramework: "custom-containers-local",
        moduleName: "egov-services",
        componentPath: "TextFieldContainerReadOnly",
        props: {
            label,
            readOnlyValue,
            InputLabelProps: {
                shrink: true,
            },
            placeholder,
            localePrefix,
            fullWidth: true,
            required,
            data,
            optionValue,
            optionLabel,
            sourceJsonPath,
            cityDropdown,
            jsonPath,
            iconObj,
            title,
            infoIcon,
            errorMessage,
            ...props,
        },
        gridDefination,
        required,
        pattern,
        jsonPath,
        minLength,
        maxLength,
        minValue,
        maxValue,
        errorMessage,
        requiredMessage,
        ...rest,
    };
};

export const getMasterDataPCC = async (requestBody) => {
    try {
        const response = await httpRequest(
            "post",
            "/bookings/park/community/master/_fetch",
            "",
            [],
            requestBody
        );
        console.log(response, "master data response");
        return { status: "success", data: response.data };
    } catch (exception) {
        console.log(exception);
    }
};
export const getAvailabilityDataPCC = async (requestBody) => {
    try {
        const response = await httpRequest(
            "post",
            "/bookings/park/community/availability/_search",
            "",
            [],
            requestBody
        );
        console.log(response, "availability data response");
        return { status: "success", data: response.data };
    } catch (exception) {
        console.log(exception);
    }
};

export const getRefundDetails = async (bookingId, tenantId) => {


    const queryStr = [
        {
            key: "consumerCode",
            value: bookingId,
        },
        { key: "tenantId", value: "ch.chandigarh" },
    ];


    try {
        const response = await httpRequest(
            "post",
            "/pg-service/transaction/v1/_search",
            "",
            queryStr,
            []
        );

        return { status: "success", data: response.Transaction };
    } catch (exception) {
        console.log(exception);
    }
};

export const goForRefund = async (refundDataObj) => {


    let requestBody = { RefundTransaction: refundDataObj };


    try {
        const response = await httpRequest(
            "post",
            "/pg-service/transaction/v1/_refund",
            "",
            [],
            requestBody
        );

        return { status: "success", data: response };
    } catch (exception) {
        console.log(exception);
    }
};

export const downloadCancelledBookingReceipt = async (
    state,
    applicationNumber,
    tenantId,
    mode = "download"
) => {


    tenantId = process.env.REACT_APP_NAME === "Citizen" ? JSON.parse(getUserInfo()).permanentCity : getTenantId();


    let applicationData = get(
        state.screenConfiguration.preparedFinalObject,
        "Booking"
    );
    const receiptQueryString = [
        { key: "consumerCodes", value: applicationNumber },
        {
            key: "tenantId",
            value: tenantId,
        },
    ];
    const FETCHRECEIPT = {
        GET: {
            URL: "/collection-services/payments/_search",
            ACTION: "_get",
        },
    };
    const DOWNLOADRECEIPT = {
        GET: {
            URL: "/pdf-service/v1/_create",
            // ACTION: "_get",
        },
    };
    let tenantData = await getMdmsTenantsData();
    let refundAmount = await calculateCancelledBookingRefundAmount(applicationNumber, tenantId, applicationData.bkFromDate);
    let bookingCancelledDate = await getBookingCancelledDate(applicationNumber, tenantId);
    try {
        httpRequest(
            "post",
            FETCHRECEIPT.GET.URL,
            FETCHRECEIPT.GET.ACTION,
            receiptQueryString
        ).then((payloadReceiptDetails) => {
            let queryStr = "";
            if (applicationData.businessService === "PACC") {
                queryStr = [
                    { key: "key", value: "bk-cancel-receipt" },
                    {
                        key: "tenantId",
                        value: tenantId,
                    },
                ];


            }
            if (
                payloadReceiptDetails &&
                payloadReceiptDetails.Payments &&
                payloadReceiptDetails.Payments.length == 0
            ) {
                console.log("Could not find any receipts");
                return;
            }

            let paymentInfoData = "";
            let date2obj = new Date(payloadReceiptDetails.Payments[0].transactionDate);
            const txnDate = date2obj.toDateString();
            const [txnTime] = date2obj.toTimeString().split(" ");
            const txnDateTime = `${txnDate}, ${txnTime}`;

            var date2 = new Date();

            var generatedDateTime = `${date2.getDate()}-${date2.getMonth() + 1}-${date2.getFullYear()}, ${date2.getHours()}:${date2.getMinutes() < 10 ? "0" : ""}${date2.getMinutes()}`;
            if (applicationData.businessService === "PACC") {
                paymentInfoData = {

                    totalAmountPaid: (
                        parseFloat(applicationData.bkRent) +
                        parseFloat(applicationData.bkCleansingCharges) +
                        parseFloat(applicationData.bkSurchargeRent)
                    ).toFixed(2),

                    refundAmountInWords: NumInWords(
                        parseFloat(refundAmount)
                    ),
                    refundAmount: parseFloat(refundAmount).toFixed(2),


                };
            }
            let receiptData = [
                {
                    applicantDetail: {
                        name: payloadReceiptDetails.Payments[0].payerName,
                        mobileNumber:
                            payloadReceiptDetails.Payments[0].mobileNumber,
                        houseNo: applicationData.bkHouseNo,
                        permanentAddress: applicationData.bkCompleteAddress,
                        permanentCity:
                            payloadReceiptDetails.Payments[0].tenantId,
                        sector: applicationData.bkSector,
                    },
                    booking: {
                        bkApplicationNumber:
                            payloadReceiptDetails.Payments[0].paymentDetails[0]
                                .bill.consumerCode,
                        bookingCancellationDate: bookingCancelledDate,
                        bookingVenue: applicationData.bkLocation,
                        bookingDuration: getDurationDate(
                            applicationData.bkFromDate,
                            applicationData.bkToDate
                        ),
                        bkCancellationReasoon: applicationData.bkRemarks
                    },
                    paymentInfo: paymentInfoData,
                    tenantInfo: {
                        municipalityName: tenantData.tenants[0].city.municipalityName,
                        address: tenantData.tenants[0].address,
                        contactNumber: tenantData.tenants[0].contactNumber,
                        webSite: tenantData.tenants[0].domainUrl,
                    },
                    generatedBy: {
                        generatedBy: JSON.parse(getUserInfo()).name,
                        generatedDateTime: generatedDateTime
                    },
                },
            ];

            httpRequest(
                "post",
                DOWNLOADRECEIPT.GET.URL,
                "",
                queryStr,
                { BookingInfo: receiptData },
                { Accept: "application/json" },
                { responseType: "arraybuffer" }
            ).then((res) => {
                res.filestoreIds[0];
                if (res && res.filestoreIds && res.filestoreIds.length > 0) {
                    res.filestoreIds.map((fileStoreId) => {
                        downloadReceiptFromFilestoreIDForPdf(fileStoreId, mode, tenantId);
                    });
                } else {
                    console.log("Error In Receipt Download");
                }
            });
        });
    } catch (exception) {
        alert("Some Error Occured while downloading Receipt!");
    }
};

export const calculateCancelledBookingRefundAmount = async (applicationNumber, tenantId, bookingDate) => {
    tenantId = process.env.REACT_APP_NAME === "Citizen" ? JSON.parse(getUserInfo()).permanentCity : getTenantId();
    if (applicationNumber && tenantId) {
        let queryObject = [
            { key: "tenantId", value: tenantId },
            { key: "consumerCodes", value: applicationNumber },
        ];
        const payload = await httpRequest(
            "post",
            "/collection-services/payments/_search",
            "",
            queryObject
        );
        if (payload) {

            let billAccountDetails = payload.Payments[0].paymentDetails[0].bill.billDetails[0].billAccountDetails;
            let bookingAmount = 0;
            let refundSecurity = 0;
            for (let i = 0; i < billAccountDetails.length; i++) {
                if (billAccountDetails[i].taxHeadCode == "REFUNDABLE_SECURITY") {
                    bookingAmount += billAccountDetails[i].amount;
                    refundSecurity += billAccountDetails[i].amount;
                }
                if (billAccountDetails[i].taxHeadCode == "PACC") {
                    bookingAmount += billAccountDetails[i].amount;
                }
            }



            let mdmsBody = {
                MdmsCriteria: {
                    tenantId: tenantId,
                    moduleDetails: [

                        {
                            moduleName: "Booking",
                            masterDetails: [
                                {
                                    name: "bookingCancellationRefundCalc",
                                }
                            ],
                        },

                    ],
                },
            };

            let refundPercentage = '';

            let payloadRes = null;
            payloadRes = await httpRequest(
                "post",
                "/egov-mdms-service/v1/_search",
                "_search",
                [],
                mdmsBody
            );

            refundPercentage = payloadRes.MdmsRes.Booking.bookingCancellationRefundCalc[0];


            var date1 = new Date(bookingDate);
            var date2 = new Date();

            var Difference_In_Time = date1.getTime() - date2.getTime();

            // To calculate the no. of days between two dates
            var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

            let refundAmount = 0
            if (Difference_In_Days > 29) {
                let refundPercent = refundPercentage.MORETHAN30DAYS.refundpercentage;

                refundAmount = (parseFloat(bookingAmount) * refundPercent) / 100
            } else if (Difference_In_Days > 15 && Difference_In_Days < 30) {

                let refundPercent = refundPercentage.LETTHAN30MORETHAN15DAYS.refundpercentage;
                refundAmount = (parseFloat(bookingAmount) * refundPercent) / 100
            } else if (refundSecurity > 0) {
                refundAmount = refundSecurity;
            }

            return refundAmount;

        }
    }


}

export const getBookingCancelledDate = async (applicationNumber, tenantId) => {
    if (applicationNumber && tenantId) {
        let queryObject = [
            { key: "tenantId", value: tenantId },
            { key: "businessIds", value: applicationNumber },
        ];
        const payload = await httpRequest(
            "post",
            "/egov-workflow-v2/egov-wf/process/_search",
            "",
            queryObject
        );

        if (payload) {

            let cancelledTimeStamp = payload.ProcessInstances[0].auditDetails.createdTime;

            let date2 = new Date(cancelledTimeStamp);

            let gdate = ('0' + date2.getDate()).slice(-2) + '/'
                + ('0' + (date2.getMonth() + 1)).slice(-2) + '/'
                + date2.getFullYear();
            return gdate;


        }
    }
}

export const updateBillDemand = async (
    state,
    dispatch,
    applicationNumber,
    tenantId,
    bookingType
) => {
    const tenantIdn = process.env.REACT_APP_NAME === "Citizen" ? JSON.parse(getUserInfo()).permanentCity : getTenantId();
    let applicationData = get(
        state.screenConfiguration.preparedFinalObject,
        "Booking"
    );

    console.log(applicationNumber, tenantIdn, bookingType, "Neor App");
    //try {
    if (applicationNumber && tenantIdn && bookingType) {
        let applicationData = get(
            state.screenConfiguration.preparedFinalObject,
            "Booking"
        );

        console.log(applicationData, "Neor App");
        try {
            const response = await httpRequest(
                "post",
                "/bookings/park/community/demand/_update",
                "",
                [],
                {
                    Booking: applicationData,
                }
            );
            return response;
        } catch (error) {
            console.log(error, "errornew");
        }
    }
    // } catch (e) {
    //     console.log(e);
    // }
};

export const calculateBetweenDaysCount = (startDate, endDate) => {
    const oneDay = 24 * 60 * 60 * 1000;
    const firstDate = new Date(startDate);
    const secondDate = new Date(endDate);

    const daysCount =
        Math.round(Math.abs((firstDate - secondDate) / oneDay)) + 1;
    return daysCount;
};


export const downloadReceiptFromFilestoreIDForPdf = (fileStoreId, mode, tenantId) => {
    getFileUrlFromAPIForPdf(fileStoreId, tenantId).then(async (fileRes) => {
        if (mode === "download") {
            var win = window.open(fileRes[fileStoreId], "_blank");
            if (win) {
                win.focus();
            }
        } else {
            // printJS(fileRes[fileStoreId])
            var response = await axios.get(fileRes[fileStoreId], {
                //responseType: "blob",
                responseType: "arraybuffer",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/pdf",
                },
            });
            console.log("responseData---", response);
            const file = new Blob([response.data], { type: "application/pdf" });
            const fileURL = URL.createObjectURL(file);
            var myWindow = window.open(fileURL);
            if (myWindow != undefined) {
                myWindow.addEventListener("load", (event) => {
                    myWindow.focus();
                    myWindow.print();
                });
            }
        }
    });
};
export const getFileUrlFromAPIForPdf = async (fileStoreId, tenantId) => {
    console.log(tenantId, "My Tenant Id");

    const queryObject = [
        { key: "tenantId", value: tenantId },
        //    { key: "tenantId", value: tenantId || commonConfig.tenantId.length > 2 ? commonConfig.tenantId.split('.')[0] : commonConfig.tenantId },
        { key: "fileStoreIds", value: fileStoreId }
    ];
    try {
        const fileUrl = await httpRequest(
            "get",
            "/filestore/v1/files/url",
            "",
            queryObject
        );
        return fileUrl;
    } catch (e) {
        console.log(e);
    }
};

export const getAllbillsOfBooking = async (applicationNumber, tenantId) => {
    let queryObject = [
        { key: "tenantId", value: tenantId },
        { key: "consumerCode", value: applicationNumber },

    ];
    try {
        const response = await httpRequest(
            "post",
            "/billing-service/bill/v2/_search",
            "",
            queryObject
        );
        return response;
    } catch (error) {
        console.log(error, "errornew");
    }
};







export const prepareRoomCard= (nonOptimisedRoomData)=>{

    let tempArray = [];
    let roomModels= nonOptimisedRoomData
    var roomsData = roomModels
      .map((roomData) => {
        if (!tempArray.includes(roomData.roomApplicationNumber)) {
          tempArray.push(roomData.roomApplicationNumber);
          let slicearray = roomModels.slice(
            roomModels.findIndex((element) => {
              if (element === roomData) {
                return true;
              }
            }) + 1,
            roomModels.length
          );
          let duplicateObject = slicearray.filter(
            (data) =>
              data.roomApplicationNumber === roomData.roomApplicationNumber
          );
          if (duplicateObject.length > 0) {
            let newObj = {
              roomApplicationNumber: roomData.roomApplicationNumber,
              toDate: roomData.toDate,
              fromDate: roomData.fromDate,
              typeOfRooms: "BOTH"
            };
            if (duplicateObject[0].typeOfRoom === "NON-AC") {
              newObj.totalNoOfACRooms = roomData.totalNoOfRooms;
              newObj.totalNoOfNonACRooms = duplicateObject[0].totalNoOfRooms;
            } else {
              newObj.totalNoOfACRooms = duplicateObject[0].totalNoOfRooms;
              newObj.totalNoOfNonACRooms = roomData.totalNoOfRooms;
            }
            return newObj;
          } else {
            let newObj = {
              roomApplicationNumber: roomData.roomApplicationNumber,
              toDate: roomData.toDate,
              fromDate: roomData.fromDate
            };
            if (roomData.typeOfRoom === "NON-AC") {
              newObj.totalNoOfACRooms = 0;
              newObj.typeOfRooms = "NON-AC";
              newObj.totalNoOfNonACRooms = roomData.totalNoOfRooms;
            } else {
              newObj.totalNoOfACRooms = roomData.totalNoOfRooms;
              newObj.typeOfRooms = "AC";
              newObj.totalNoOfNonACRooms = 0;
            }
            return newObj;
          }
        }
        return;
      }).filter(Boolean);
      console.log('roomsData1234', roomsData)
      return roomsData
  }