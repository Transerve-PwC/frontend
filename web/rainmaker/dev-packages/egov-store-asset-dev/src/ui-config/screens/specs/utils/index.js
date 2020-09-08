import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { validate } from "egov-ui-framework/ui-redux/screen-configuration/utils";
import {
  getUserInfo, getOPMSTenantId, getapplicationType, localStorageGet, lSRemoveItem,
  setOPMSTenantId, lSRemoveItemlocal, getapplicationNumber
} from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import set from "lodash/set";
import {
  getQueryArg,
  getTransformedLocalStorgaeLabels,
  getLocaleLabels
} from "egov-ui-framework/ui-utils/commons";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { httpRequest } from "../../../../ui-utils/api";
import { getprintpdf } from "../../../../ui-utils/storecommonsapi";
import isUndefined from "lodash/isUndefined";
import {
  getCommonCard,
  getCommonValue,
  getCommonCaption,
  getPattern
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { sampleGetBill } from "../../../../ui-utils/sampleResponses";
import {
  getTenantId
} from "egov-ui-kit/utils/localStorageUtils";

export const getCommonApplyFooter = children => {
  return {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {
      className: "apply-wizard-footer"
    },
    children
  };
};

export const transformById = (payload, id) => {
  return (
    payload &&
    payload.reduce((result, item) => {
      result[item[id]] = {
        ...item
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

export const validateFields = (
  objectJsonPath,
  state,
  dispatch,
  screen = "apply"
) => {
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
            )
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
export const convertDateToEpochIST = (dateString, dayStartOrEnd = "dayend") => {
  //example input format : "2018-10-02"
  try {
    const parts = dateString.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
    const DateObj = new Date(Date.UTC(parts[1], parts[2] - 1, parts[3]));
  //  DateObj.setMinutes(DateObj.getMinutes() + DateObj.getTimezoneOffset());
    if (dayStartOrEnd === "dayend") {
      DateObj.setHours(DateObj.getHours() + 24);
      DateObj.setSeconds(DateObj.getSeconds() - 1);
    }
    return DateObj.getTime();
  } catch (e) {
    return dateString;
  }
};

export const getEpochForDate = date => {
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

export const ifUserRoleExists = role => {
  let userInfo = JSON.parse(getUserInfo());
  const roles = get(userInfo, "roles");
  const roleCodes = roles ? roles.map(role => role.code) : [];
  if (roleCodes.indexOf(role) > -1) {
    return true;
  } else return false;
};

export const convertEpochToDate = dateEpoch => {
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
        financialDates.startDate = `01/04/${date.getFullYear().toString()}`;
        financialDates.endDate = `31/03/${(date.getFullYear() + 1).toString()}`;
        break;
      case "yyyy-mm-dd":
        financialDates.startDate = `${date.getFullYear().toString()}-04-01`;
        financialDates.endDate = `${(date.getFullYear() + 1).toString()}-03-31`;
        break;
    }
  } else {
    switch (format) {
      case "dd/mm/yyyy":
        financialDates.startDate = `01/04/${(
          date.getFullYear() - 1
        ).toString()}`;
        financialDates.endDate = `31/03/${date.getFullYear().toString()}`;
        break;
      case "yyyy-mm-dd":
        financialDates.startDate = `${(
          date.getFullYear() - 1
        ).toString()}-04-01`;
        financialDates.endDate = `${date.getFullYear().toString()}-03-31`;
        break;
    }
  }
  return financialDates;
};

export const showCityPicker = (state, dispatch) => {
  let toggle = get(
    state.screenConfiguration.screenConfig["home"],
    "components.cityPickerDialog.props.open",
    false
  );
  dispatch(
    handleField("home", "components.cityPickerDialog", "props.open", !toggle)
  );
};

export const OPMSTenantId = (state, dispatch) => {
  const tenantId = get(
    state.screenConfiguration.preparedFinalObject,
    "citiesByModule.citizenTenantId"
  );
  setOPMSTenantId(tenantId);
  window.location.href =
    process.env.NODE_ENV === "production"
      ? `/egov-opms/home?tenantId=${tenantId}`
      : `/egov-opms/home?tenantId=${tenantId}`;
}

export const gotoApplyWithStep = (state, dispatch, step) => {

  const applicationNumber = getQueryArg(window.location.href, "applicationNumber");
  const applicationNumberQueryString = applicationNumber ? `&applicationNumber=${applicationNumber}` : ``;
  const tetantQueryString = applicationNumber ? `&tenantId=${getOPMSTenantId()}` : ``;
  const applicationTpye = getapplicationType();
  let applyUrl = '';

  applyUrl = process.env.REACT_APP_SELF_RUNNING === "true"
    ? `/egov-ui-framework/egov-opms/apply?step=${step}${applicationNumberQueryString}`
    : applicationTpye === `PETNOC` ?
      `/egov-opms/apply?step=${step}${applicationNumberQueryString}${tetantQueryString}` :
      applicationTpye === `SELLMEATNOC` ?
        `/egov-opms/applysellmeat?step=${step}${applicationNumberQueryString}${tetantQueryString}` :
        applicationTpye === `ROADCUTNOC` ?
          `/egov-opms/applyroadcuts?step=${step}${applicationNumberQueryString}${tetantQueryString}` :
          applicationTpye === `ADVERTISEMENTNOC` ?
            `/egov-opms/advertisementApply?step=${step}${applicationNumberQueryString}${tetantQueryString}` : ``
    ;



  dispatch(setRoute(applyUrl));
};
export const showHideAdhocPopups = (state, dispatch, screenKey) => {

  //alert(JSON.stringify( state.screenConfiguration.screenConfig[screenKey]))

  let toggle = get(
    state.screenConfiguration.screenConfig[screenKey],
    "components.undertakingdialog.props.open",
    false
  );
  dispatch(
    handleField(screenKey, "components.undertakingdialog", "props.open", !toggle)
  );
};
export const epochToYmdDate = et => {
  if (!et) return null;
  if (typeof et === "string") return et;
  let d = new Date(et),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
};
export const epochToYmd = et => {
  // Return null if et already null
  if (!et) return null;
  // Return the same format if et is already a string (boundary case)
  if (typeof et === "string") return et;
  let date = new Date(et);
  let day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  let month =
    date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
  // date = `${date.getFullYear()}-${month}-${day}`;
  var formatted_date = date.getFullYear() + "-" + month + "-" + day;
  return formatted_date;
};
export const showHideAdhocPopup = (state, dispatch, screenKey) => {

  //alert(JSON.stringify( state.screenConfiguration.screenConfig[screenKey]))

  let toggle = get(
    state.screenConfiguration.screenConfig[screenKey],
    "components.adhocDialog.props.open",
    false
  );
  dispatch(
    handleField(screenKey, "components.adhocDialog", "props.open", !toggle)
  );
};



export const showHideAdhocPopupopms = (state, dispatch, screenKey, type) => {

  localStorage.setItem('updateNocType', type)
  // //alert(  localStorage.getItem('updateNocType')+type)
  // set(
  //   state,
  //   "screenConfig.components.adhocDialog.children.popup",
  //   adhocPopup2
  // );
  ////alert(JSON.stringify( state.screenConfiguration.screenConfig[screenKey]))

  setTimeout(function () {
    let toggle = get(
      state.screenConfiguration.screenConfig[screenKey],
      "components.adhocDialog.props.open",
      false
    );
    dispatch(
      handleField(screenKey, "components.adhocDialog", "props.open", !toggle)
    );

  }, 500);

  /*
  
  export const showHideAdhocPopupopmsReject = (state, dispatch, screenKey, type) => {
  
    setTimeout(function () {
      let toggle = get(
        state.screenConfiguration.screenConfig[screenKey],
        "components.adhocDialog3.props.open",
        false
      );
      dispatch(
        handleField(screenKey, "components.adhocDialog3", "props.open", !toggle)
      );
  
      }, 500);
    
   };
   */
}
export const showHideAdhocPopupopmsReassign = (state, dispatch, screenKey, type) => {

  setTimeout(function () {
    let toggle = get(
      state.screenConfiguration.screenConfig[screenKey],
      "components.adhocDialog2.props.open",
      false
    );
    dispatch(
      handleField(screenKey, "components.adhocDialog2", "props.open", !toggle)
    );

  }, 500);

};
/* export const showHideAdhocPopupopmsApprove = (state, dispatch, screenKey,type) => {
     
     setTimeout(function(){ 
      let toggle = get(
        state.screenConfiguration.screenConfig[screenKey],
        "components.adhocDialog1.props.open",
        false
      );
      dispatch(
        handleField(screenKey, "components.adhocDialog1", "props.open", !toggle)
      ); 
  
      }, 500);
    
   }; */
export const getCommonGrayCard = children => {
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
              overflow: "visible"
            }
          })
        },
        gridDefination: {
          xs: 12
        }
      }
    },
    gridDefination: {
      xs: 12
    }
  };
};

export const getLabelOnlyValue = (value, props = {}) => {
  return {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    gridDefination: {
      xs: 6,
      sm: 4
    },
    props: {
      style: {
        marginBottom: "16px"
      },
      ...props
    },
    children: {
      value: getCommonCaption(value)
    }
  };
};

export const convertDateTimeToEpoch = dateTimeString => {
  //example input format : "26-07-2018 17:43:21"
  try {
    const parts = dateTimeString.match(
      /(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2}):(\d{2})/
    );
    return Date.UTC(+parts[3], parts[2] - 1, +parts[1], +parts[4], +parts[5]);
  } catch (e) {
    return dateTimeString;
  }
};


export const getReceiptData = async queryObject => {
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

export const getMdmsData = async queryObject => {
  try {
    const response = await httpRequest(
      "post",
      "egov-mdms-service/v1/_get",
      "",
      queryObject
    );
    return response;
  } catch (error) {
    console.log(error);
    return {};
  }
};

export const getBill = async queryObject => {
  try {
    const response = await httpRequest(
      "post", "/billing-service/bill/v2/_fetchbill", "",
      queryObject
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const searchBill = async (dispatch, applicationNumber, tenantId) => {
  try {
    let queryObject = [
      { key: "tenantId", value: tenantId },
      { key: "consumerCodes", value: applicationNumber }
    ];

    // Get Receipt
    let payload = await httpRequest("post", "/collection-services/payments/_search", "", queryObject);

    // Get Bill
    const response = await getBill([
      { key: "tenantId", value: tenantId },
      { key: "consumerCode", value: applicationNumber },
      { key: "businessService", value: "OPMS" }
    ]);

    // If pending payment then get bill else get receipt
    let billData = get(payload, "Receipt[0].Bill") || get(response, "Bill");
    if (billData) {
      dispatch(prepareFinalObject("ReceiptTemp[0].Bill", billData));
      const estimateData = createEstimateData(billData[0]);
      estimateData &&
        estimateData.length &&
        dispatch(prepareFinalObject("applyScreenMdmsData.estimateCardData", estimateData));

    }
  } catch (e) {
    console.log(e);
  }
};


export const createDemandForRoadCutNOC = async (state, ispatch, applicationNumber, tenantId) => {
  try {
    let amount =
      get(state.screenConfiguration.preparedFinalObject, "nocApplicationDetail.[0].amount");
    let performancebankguaranteecharges =
      get(state.screenConfiguration.preparedFinalObject, "nocApplicationDetail.[0].performancebankguaranteecharges");
    let gstamount =
      get(state.screenConfiguration.preparedFinalObject, "nocApplicationDetail.[0].gstamount");
    let userInfo = JSON.parse(getUserInfo());
    userInfo.pwdExpiryDate = 0;
    userInfo.createdDate = 0;
    userInfo.lastModifiedDate = 0;
    userInfo.dob = 0;
    let currentFinancialYr = getCurrentFinancialYear();
    //Changing the format of FY
    let fY1 = currentFinancialYr.split("-")[1];
    fY1 = fY1.substring(2, 4);
    currentFinancialYr = currentFinancialYr.split("-")[0] + "-" + fY1;

    let queryObject = [
      { key: "tenantId", value: tenantId },
      { key: "consumerCodes", value: applicationNumber }
    ];
    let querydemand = {
      "CalulationCriteria": [
        {
          "opmsDetail": {
            "financialYear": currentFinancialYr,
            "applicationNumber": applicationNumber,
            "applicationType": getapplicationType(), // "ROADCUTNOC",
            "amountRoadCut": amount,
            "bankPerformanceRoadCut": performancebankguaranteecharges,
            "gstRoadCut": gstamount,
            "owners": [userInfo],
            "tenantId": getOPMSTenantId()
          },
          "applicationNumber": applicationNumber,
          "tenantId": getOPMSTenantId()
        }
      ]
    };

    // Get Receipt
    let payload = await httpRequest(
      "post",
      "/pm-calculator/v1/_calculate",
      "",
      queryObject,
      querydemand
    );
  } catch (e) {
    console.log(e);
  }
};


export const searchdemand = async (dispatch, applicationNumber, tenantId) => {
  try {
    let currentFinancialYr = getCurrentFinancialYear();
    //Changing the format of FY
    let fY1 = currentFinancialYr.split("-")[1];
    fY1 = fY1.substring(2, 4);
    currentFinancialYr = currentFinancialYr.split("-")[0] + "-" + fY1;
    let userInfo = JSON.parse(getUserInfo());

    console.log('userInfo', userInfo);
    userInfo.pwdExpiryDate = 0;
    userInfo.createdDate = 0;
    userInfo.lastModifiedDate = 0;
    userInfo.dob = 0;

    let queryObject = [
      { key: "tenantId", value: tenantId },
      { key: "consumerCodes", value: applicationNumber }
    ];
    let querydemand = {
      "CalulationCriteria": [
        {
          "opmsDetail": {
            "financialYear": currentFinancialYr, // "2019-20",
            "applicationNumber": applicationNumber,
            "applicationType": getapplicationType(),  //"PETNOC",
            "owners": [userInfo],
            "tenantId": getOPMSTenantId(),
          },
          "applicationNumber": applicationNumber,
          "tenantId": getOPMSTenantId()
        }
      ]
    };

    // Get Receipt
    let payload = await httpRequest(
      "post",
      "/pm-calculator/v1/_calculate",
      "",
      queryObject,
      querydemand
    );



    // Get Bill
    // const response = await getBill([
    // {
    // key: "tenantId",
    // value: tenantId
    // },
    // {
    // key: "applicationNumber",
    // value: applicationNumber
    // }
    // ]);

    // If pending payment then get bill else get receipt
    // let billData = get(payload, "Receipt[0].Bill") || get(response, "Bill");

    // if (billData) {
    // dispatch(prepareFinalObject("ReceiptTemp[0].Bill", billData));
    // const estimateData = createEstimateData(billData[0]);
    // estimateData &&
    // estimateData.length &&
    // dispatch(
    // prepareFinalObject(
    // "applyScreenMdmsData.estimateCardData",
    // estimateData
    // )
    // );
    // }
  } catch (e) {
    console.log(e);
  }
};


export const createEstimateData = billObject => {
  const billDetails = billObject && billObject.billDetails;
  let fees =
    billDetails &&
    billDetails[0].billAccountDetails &&
    billDetails[0].billAccountDetails.map(item => {
      return {
        name: { labelName: item.taxHeadCode, labelKey: item.taxHeadCode },
        value: item.amount,
        order: item.order,
        info: { labelName: item.taxHeadCode, labelKey: item.taxHeadCode }
      };
    });
  fees.sort(function (x, y) {
    return x.order - y.order;
  });
  return fees;
};

export const generateBill = async (dispatch, applicationNumber, tenantId) => {
  try {
    if (applicationNumber && tenantId) {
      const queryObj = [
        { key: "tenantId", value: tenantId },
        { key: "consumerCode", value: applicationNumber },
        { key: "businessService", value: "OPMS" }
      ];
      const payload = await getBill(queryObj);
      // let payload = sampleGetBill();
      if (payload && payload.Bill[0]) {
        dispatch(prepareFinalObject("ReceiptTemp[0].Bill", payload.Bill));
        const estimateData = createEstimateData(payload.Bill[0]);
        estimateData &&
          estimateData.length &&
          dispatch(prepareFinalObject("applyScreenMdmsData.estimateCardData", estimateData));
      }
    }
  } catch (e) {
    console.log(e);
  }
};

export const resetFields = (state, dispatch) => {
  dispatch(
    handleField(
      "search",
      "components.div.children.NOCApplication.children.cardContent.children.appNOCAndMobNumContainer.children.NOCNo",
      "props.value",
      ""
    )
  );
  dispatch(
    handleField(
      "search",
      "components.div.children.NOCApplication.children.cardContent.children.appNOCAndMobNumContainer.children.applicationNo",
      "props.value",
      ""
    )
  );
  dispatch(
    handleField(
      "search",
      "components.div.children.NOCApplication.children.cardContent.children.appNOCAndMobNumContainer.children.ownerMobNo",
      "props.value",
      ""
    )
  );
  dispatch(
    handleField(
      "search",
      "components.div.children.NOCApplication.children.cardContent.children.appStatusAndToFromDateContainer.children.applicationNo",
      "props.value",
      ""
    )
  );
  dispatch(
    handleField(
      "search",
      "components.div.children.NOCApplication.children.cardContent.children.appStatusAndToFromDateContainer.children.fromDate",
      "props.value",
      ""
    )
  );
  dispatch(
    handleField(
      "search",
      "components.div.children.NOCApplication.children.cardContent.children.appStatusAndToFromDateContainer.children.toDate",
      "props.value",
      ""
    )
  );
};

export const getTextToLocalMapping = label => {

  const localisationLabels = getTransformedLocalStorgaeLabels();
  switch (label) {
    case "Application No":
      return getLocaleLabels(
        "Application No",
        "applicationId",
        localisationLabels
      );
    case "Application Status":
      return getLocaleLabels(
        "Application Status",
        "applicationStatus",
        localisationLabels
      );
    case "Applicant Name":
      return getLocaleLabels(
        "Applicant Name",
        "applicantName",
        localisationLabels
      );
    case "NOC No":
      return getLocaleLabels(
        "NOC No",
        "NOC_COMMON_TABLE_COL_NOC_NO_LABEL",
        localisationLabels
      );

    case "NOC Type":
      return getLocaleLabels("NOC Type", "NOC_TYPE_LABEL", localisationLabels);
    case "Owner Name":
      return getLocaleLabels(
        "Owner Name",
        "NOC_COMMON_TABLE_COL_OWN_NAME_LABEL",
        localisationLabels
      );

    case "Application Date":
      return getLocaleLabels(
        "Application Date",
        "NOC_COMMON_TABLE_COL_APP_DATE_LABEL",
        localisationLabels
      );

    case "Status":
      return getLocaleLabels(
        "Status",
        "NOC_COMMON_TABLE_COL_STATUS_LABEL",
        localisationLabels
      );




    //master
    case "Price Book Id":
      return getLocaleLabels(
        "Price Book Id",
        "priceBookId",
        localisationLabels
      );

    case "categoryId":
      return getLocaleLabels(
        "categoryId",
        "categoryId",
        localisationLabels
      );
    case "subCategoryId":
      return getLocaleLabels(
        "subCategoryId",
        "subCategoryId",
        localisationLabels
      );
    case "perDayPrice":
      return getLocaleLabels(
        "perDayPrice",
        "perDayPrice",
        localisationLabels
      );
    case "perWeekPrice":
      return getLocaleLabels(
        "perWeekPrice",
        "perWeekPrice",
        localisationLabels
      );
    case "perMonthPrice":
      return getLocaleLabels(
        "perMonthPrice",
        "perMonthPrice",
        localisationLabels
      );
    case "annualPrice":
      return getLocaleLabels(
        "annualPrice",
        "annualPrice",
        localisationLabels
      );
    case "effectiveFromDate":
      return getLocaleLabels(
        "effectiveFromDate",
        "effectiveFromDate",
        localisationLabels
      );
    case "effectiveToDate":
      return getLocaleLabels(
        "effectiveToDate",
        "effectiveToDate",
        localisationLabels
      );
    //reprt1

    case "Application Date":
      return getLocaleLabels(
        "Application Date",
        "NOC_COMMON_TABLE_COL_APP_DATE_LABEL",
        localisationLabels
      );

    case "Status":
      return getLocaleLabels(
        "Status",
        "NOC_COMMON_TABLE_COL_STATUS_LABEL",
        localisationLabels
      );

    //master
    case "applcationType":
      return getLocaleLabels(
        "applcationType",
        "applcationType",
        localisationLabels
      );

    case "totalNoOfApplicationReceived":
      return getLocaleLabels(
        "totalNoOfApplicationReceived",
        "totalNoOfApplicationReceived",
        localisationLabels
      );
    case "noOfApplicationProcessed":
      return getLocaleLabels(
        "noOfApplicationProcessed",
        "noOfApplicationProcessed",
        localisationLabels
      );
    case "noOfApplicationPending":
      return getLocaleLabels(
        "noOfApplicationPending",
        "noOfApplicationPending",
        localisationLabels
      );
    case "noOfApplicationRejected":
      return getLocaleLabels(
        "noOfApplicationRejected",
        "noOfApplicationRejected",
        localisationLabels
      );

    case "totalNoOfApplicationApproved":
      return getLocaleLabels(
        "totalNoOfApplicationApproved",
        "totalNoOfApplicationApproved",
        localisationLabels
      );
    case "revenueCollected":
      return getLocaleLabels(
        "revenueCollected",
        "revenueCollected",
        localisationLabels
      );
    case "totalNoApplicationApprovedWithNilCharges":
      return getLocaleLabels(
        "totalNoApplicationApprovedWithNilCharges",
        "totalNoApplicationApprovedWithNilCharges",
        localisationLabels
      );


    case "avgTimeTakenToProcessRequest":
      return getLocaleLabels(
        "avgTimeTakenToProcessRequest",
        "avgTimeTakenToProcessRequest",
        localisationLabels
      );

    case "pendingMoreThan10AndLessThan30Days":
      return getLocaleLabels(
        "pendingMoreThan10AndLessThan30Days",
        "pendingMoreThan10AndLessThan30Days",
        localisationLabels
      );
    case "sector":
      return getLocaleLabels(
        "sector",
        "sector",
        localisationLabels
      );
    case "pendingMoreThan30Days":
      return getLocaleLabels(
        "pendingMoreThan30Days",
        "pendingMoreThan30Days",
        localisationLabels
      );

    case "YearMonth":
      return getLocaleLabels(
        "YearMonth",
        "YearMonth",
        localisationLabels
      );


    case "approve":
      return getLocaleLabels(
        "approve",
        "approve",
        localisationLabels
      );
    case "rev":
      return getLocaleLabels(
        "rev",
        "rev",
        localisationLabels
      );

    case "exempted":
      return getLocaleLabels(
        "exempted",
        "exempted",
        localisationLabels
      );

    case "INITIATED":
      return getLocaleLabels("Initiated,", "NOC_INITIATED", localisationLabels);
    case "APPLIED":
      getLocaleLabels("Applied", "NOC_APPLIED", localisationLabels);
    case "PAID":
      getLocaleLabels("Paid", "WF_NEWPM_PENDINGAPPROVAL", localisationLabels);

    case "APPROVED":
      return getLocaleLabels("Approved", "NOC_APPROVED", localisationLabels);
    case "REJECTED":
      return getLocaleLabels("Rejected", "NOC_REJECTED", localisationLabels);
    case "CANCELLED":
      return getLocaleLabels("Cancelled", "NOC_CANCELLED", localisationLabels);
    
  }
};

export const showHideAdhocPopupopmsReject = (state, dispatch, screenKey, type) => {

  setTimeout(function () {
    let toggle = get(
      state.screenConfiguration.screenConfig[screenKey],
      "components.adhocDialog3.props.open",
      false
    );
    dispatch(
      handleField(screenKey, "components.adhocDialog3", "props.open", !toggle)
    );

  }, 500);

};
/*
export const showHideAdhocPopupopmsReassign = (state, dispatch, screenKey,type) => {
    
    setTimeout(function(){ 
     let toggle = get(
       state.screenConfiguration.screenConfig[screenKey],
       "components.adhocDialog2.props.open",
       false
     );
     dispatch(
       handleField(screenKey, "components.adhocDialog2", "props.open", !toggle)
     ); 
 
     }, 500);
   
  };
  */

export const showHideAdhocPopupopmsApprove = (state, dispatch, screenKey, type) => {

  setTimeout(function () {
    let toggle = get(
      state.screenConfiguration.screenConfig[screenKey],
      "components.adhocDialog1.props.open",
      false
    );
    dispatch(
      handleField(screenKey, "components.adhocDialog1", "props.open", !toggle)
    );

  }, 500);

};
export const showHideAdhocPopupopmsForward = (state, dispatch, screenKey, type) => {

  setTimeout(function () {
    let toggle = get(
      state.screenConfiguration.screenConfig[screenKey],
      "components.adhocDialogForward.props.open",
      false
    );
    dispatch(
      handleField(screenKey, "components.adhocDialogForward", "props.open", !toggle)
    );

  }, 500);

};

export const getOPMSPattern = type => {
  switch (type) {
    case "cin":
      return /^([L|U]{1})([0-9]{5})([A-Za-z]{2})([0-9]{4})([A-Za-z]{3})([0-9]{6})$/i;
  }
};


export const createDemandForAdvNOC = async (state, ispatch) => {
  try {

    let advdetails = get(state.screenConfiguration.preparedFinalObject, "ADVTCALCULATENOC");

    let durationAdvertisement = advdetails.duration; // JSON.parse(advdetails).duration;
    let fromDateAdvertisement = advdetails.fromDateToDisplay;
    let toDateAdvertisement = advdetails.toDateToDisplay;
    let squareFeetAdvertisement = advdetails.space;
    let exemptedCategory = advdetails.exemptedCategory;
    let userInfo = JSON.parse(getUserInfo());
    userInfo.pwdExpiryDate = 0;
    userInfo.createdDate = 0;
    userInfo.lastModifiedDate = 0;
    userInfo.dob = 0;
    let currentFinancialYr = getCurrentFinancialYear();
    //Changing the format of FY
    let fY1 = currentFinancialYr.split("-")[1];
    fY1 = fY1.substring(2, 4);
    currentFinancialYr = currentFinancialYr.split("-")[0] + "-" + fY1;


    let queryObject = [
      { key: "tenantId", value: getOPMSTenantId() },
      { key: "consumerCodes", value: getapplicationNumber() }
    ];
    let querydemand = {
      "CalulationCriteria": [
        {
          "opmsDetail": {
            "financialYear": currentFinancialYr,
            "applicationNumber": getapplicationNumber(),
            "applicationType": getapplicationType(), //"ADVERTISEMENTNOC",
            "isExamptedAdvertisement": exemptedCategory,
            "categoryIdAdvertisement": localStorageGet('this_adv_id'),
            "subCategotyIdAdvertisement": localStorageGet('this_sub_adv_id'),
            "durationAdvertisement": durationAdvertisement,
            "fromDateAdvertisement": fromDateAdvertisement,
            "toDateAdvertisement": toDateAdvertisement,
            "squareFeetAdvertisement": squareFeetAdvertisement,
            "owners": [userInfo],
            "tenantId": getOPMSTenantId()
          },
          "applicationNumber": getapplicationNumber(),
          "tenantId": getOPMSTenantId(),
        }
      ]
    };

    // Get Receipt
    let payload = await httpRequest("post", "/pm-calculator/v1/_calculate", "",
      queryObject,
      querydemand
    );
    return payload;
  } catch (e) {
    console.log(e);
  }
};

export const clearlocalstorageAppDetails = (state) => {
  set(state, "screenConfiguration.preparedFinalObject", {});
  lSRemoveItemlocal('applicationType');
  lSRemoveItemlocal('applicationNumber');
  lSRemoveItemlocal('applicationStatus');
  lSRemoveItemlocal('footerApplicationStatus');
  lSRemoveItemlocal('app_noc_status');
  lSRemoveItemlocal('this_adv_code');
  lSRemoveItemlocal('this_adv_id');
  lSRemoveItemlocal('ApplicationNumber');
  lSRemoveItemlocal('gstAmount');
  lSRemoveItemlocal('amount');
  lSRemoveItemlocal('performanceBankGuaranteeCharges');
  lSRemoveItemlocal('applicationMode');
  lSRemoveItemlocal('undertakig');
  lSRemoveItemlocal('this_sub_adv_id');
  lSRemoveItemlocal('this_sub_adv_code');
  lSRemoveItemlocal('undertaking');

  lSRemoveItem('ApplicationNumber');
  lSRemoveItem('applicationType');
  lSRemoveItem('applicationNumber');
  lSRemoveItem('applicationStatus');
  lSRemoveItem('footerApplicationStatus');
  lSRemoveItem('app_noc_status');
  lSRemoveItem('this_adv_code');
  lSRemoveItem('this_adv_id');
  lSRemoveItem('gstAmount');
  lSRemoveItem('amount');
  lSRemoveItem('performanceBankGuaranteeCharges');
  lSRemoveItem('applicationMode');
  lSRemoveItem('undertakig');
  lSRemoveItem('this_sub_adv_code');
  lSRemoveItem('this_sub_adv_id');
  lSRemoveItem('undertaking');
}


export const getTodaysDateInYMD = () => {
  let date = new Date();
  let month = date.getMonth() + 1;
  let day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  date = `${date.getFullYear()}-${month}-${day}`;
  return date;
};

export const getLocalizationCodeValue =lable =>{
  const localisationLabels = getTransformedLocalStorgaeLabels();
  return getLocaleLabels(
    lable,
    lable,
    //"PENSION_COMMON_TABLE_COL_EMMPLOYEE_NAME",
    localisationLabels
  );

}
export const checkValueForNA = value => {
  return value ? value : "NA";
};
// for file store id
export const getFileUrlFromAPI = async (fileStoreId,tenantId) => {
  const queryObject = [
  	{ key: "tenantId", value: tenantId },
   // { key: "tenantId", value: tenantId || commonConfig.tenantId.length > 2 ? commonConfig.tenantId.split('.')[0] : commonConfig.tenantId },
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
export const downloadReceiptFromFilestoreID=(fileStoreId,mode,tenantId)=>{
  getFileUrlFromAPI(fileStoreId,tenantId).then(async(fileRes) => {
    if (mode === 'download') {
      var win = window.open(fileRes[fileStoreId], '_blank');
      if(win){
        win.focus();
      }
    }
    else {
     // printJS(fileRes[fileStoreId])
      var response =await axios.get(fileRes[fileStoreId], {
        //responseType: "blob",
        responseType: "arraybuffer",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/pdf"
        }
      });
      console.log("responseData---",response);
      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      var myWindow = window.open(fileURL);
      if (myWindow != undefined) {
        myWindow.addEventListener("load", event => {
          myWindow.focus();
          myWindow.print();
        });
      }
    
    }
  });
  
}
export const downloadInventoryPdf = async ( searchScreenObject, Reportname,mode="download") => {
  let tenantId =  getTenantId()
  let Url =``;
  if(Reportname ==="OB")
  Url =`/store-asset-services/openingbalance/_report`
  else if(Reportname==='INV')
  Url =`/store-asset-services/receiptnotes/_inventoryreport`
  let queryObject = [
    {
      key: "tenantId",
      value: tenantId
    }
  ]
     for (var key in searchScreenObject) {  
  
              queryObject.push({ key: key, value: (searchScreenObject[key]) });
            }
    try { 
        queryObject.push({
              key: "isprint",
              value: true
            });   
      const response = await getprintpdf(queryObject,Url);
      if(response)
      {
        let filestoreId = response.filestoreIds[0]
        downloadReceiptFromFilestoreID(filestoreId,mode,tenantId)
      }
     
    } catch (exception) {
      alert('Some Error Occured while downloading Acknowledgement form!');
    }
  
  }
export const downloadAcknowledgementForm = async ( pagename,mode="download") => {
  let tenantId =  getQueryArg(window.location.href, "tenantId");
  let APIUrl =`store-asset-services/indents/_print`
  let ApplicationNo ='';
  let queryObject = [
    {
      key: "tenantId",
      value: tenantId
    }
  ]
switch(pagename)
{
  case "Indent":
    ApplicationNo = getQueryArg(window.location.href, "applicationNumber");
    queryObject.push({
      key: "indentNumber",
      value:ApplicationNo
    });
    queryObject.push({
      key: "indentType",
      value:"Indent"
    });
    APIUrl = `store-asset-services/indents/_print`
    break;
    case "Non Indent":
      ApplicationNo = getQueryArg(window.location.href, "applicationNumber");
      queryObject.push({
        key: "issueNoteNumber",
        value:ApplicationNo
      });
     
      APIUrl = `store-asset-services/materialissues-ni/_print`
      break;

    case "Material Receipt":
      ApplicationNo = getQueryArg(window.location.href, "applicationNumber");
    queryObject.push({
      key: "mrnNumber",
      value:ApplicationNo
    });
   
    APIUrl = `store-asset-services/receiptnotes/_print`
    break;
    case "Material Receipt Misc":
      ApplicationNo = getQueryArg(window.location.href, "applicationNumber");
    queryObject.push({
      key: "mrnNumber",
      value:ApplicationNo
    });
   
    APIUrl = `store-asset-services/miscellaneousreceiptnotes/_print`
    break;
    case "Indent Transfer":
      ApplicationNo= getQueryArg(window.location.href, "applicationNumber");
    queryObject.push({
      key: "indentNumber",
      value:ApplicationNo
    });
    queryObject.push({
      key: "indentType",
      value:"Transfer Indent"
    });
    APIUrl = `store-asset-services/indents/_print`
    break;
    case "Purchase Order":
      ApplicationNo = getQueryArg(window.location.href, "applicationNumber");
    queryObject.push({
      key: "purchaseOrderNumber",
      value:ApplicationNo
    });
   
    APIUrl = `store-asset-services/purchaseorders/_print`
    break;
    case "Indent Outward":
      ApplicationNo = getQueryArg(window.location.href, "applicationNumber");
      queryObject.push({
        key: "issueNoteNumber",
        value:ApplicationNo
      });
     
      APIUrl = `store-asset-services/materialissues-to/_print`
      break;
    case "Indent Inward":
        ApplicationNo = getQueryArg(window.location.href, "applicationNumber");
        queryObject.push({
          key: "mrnNumber",
          value:ApplicationNo
        });
       
        APIUrl = `store-asset-services/transferinwards/_print`
        break;
     case "Indent Issue":
          ApplicationNo = getQueryArg(window.location.href, "applicationNumber");
          queryObject.push({
            key: "issueNoteNumber",
            value:ApplicationNo
          });
          queryObject.push({
            key: "indentType",
            value:"Indent"
          });
          APIUrl = `store-asset-services/materialissues/_print`
          break;
          // case "Inventry":
          //   // let searchScreenObject = get(
          //   //   state.screenConfiguration.preparedFinalObject,
          //   //   "searchScreen",
          //   //   {}
          //   // );
          //   let queryObject = [
          //     {
          //       key: "tenantId",
          //       value: getTenantId()
          //     }
             
          //   ];
          //   for (var key in searchScreenObject) {  
  
          //     queryObject.push({ key: key, value: (searchScreenObject[key]) });
          //   }
           
          //   queryObject.push({
          //     key: "isprint",
          //     value: true
          //   });
          //   APIUrl = `/store-asset-services/receiptnotes/_inventoryreport`
          //   break;
    
  

}
    // if(tenantId.includes("."))
    // {

    // var vStr = tenantId.split('.');

    // tenantId = vStr[0];
    // }  
    try {    
      const response = await getprintpdf(queryObject,APIUrl);
      if(response)
      {
        let filestoreId = response.filestoreIds[0]
        downloadReceiptFromFilestoreID(filestoreId,mode,tenantId)
      }
     
    } catch (exception) {
      alert('Some Error Occured while downloading Acknowledgement form!');
    }
  
  }