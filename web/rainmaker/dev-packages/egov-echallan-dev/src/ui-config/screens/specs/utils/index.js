import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { validate } from "egov-ui-framework/ui-redux/screen-configuration/utils";
import { getUserInfo, getTenantId, getapplicationNumber } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import { getQueryArg, getTransformedLocalStorgaeLabels, getLocaleLabels } from "egov-ui-framework/ui-utils/commons";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { httpRequest } from "../../../../ui-utils/api";
import isUndefined from "lodash/isUndefined";
import {
  getCommonCard,
  getCommonValue,
  getCommonCaption,
  getPattern
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { sampleGetBill } from "../../../../ui-utils/sampleResponses";
import set from "lodash/set";
import { lSRemoveItem, lSRemoveItemlocal } from "egov-ui-kit/utils/localStorageUtils";
import { getUserDetailsOnMobile, fetchMdmsData, sendPaymentReceiptOverMail, fetchSIName } from "../../../../ui-utils/commons";

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

export const getCommonApplyHeader = children => {
  return {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {
      className: "apply-wizard-headerChallan"
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
        fields[variable].jsonPath !== undefined &&
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


export const showHideAdhocPopupAuction = (state, dispatch, screenKey) => {
  let toggle = get(
    state.screenConfiguration.screenConfig[screenKey],
    "components.adhocDialog.props.open",
    false
  );
  dispatch(
    handleField(screenKey, "components.adhocDialog", "props.open", !toggle)
  );
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

export const showHideAdhocPopupTrue = (state, dispatch, screenKey) => {
  dispatch(
    handleField("search", "components.adhocDialog", "props.open", true)
  );
};

export const showHideDeleteConfirmation = (state, dispatch, screenKey) => {
  let toggle = get(
    state.screenConfiguration.screenConfig[screenKey],
    "components.deleteConfirmation.props.open",
    false
  );
  dispatch(
    handleField(screenKey, "components.deleteConfirmation", "props.open", !toggle)
  );
};


export const showHideChallanConfirmation = (state, dispatch, screenKey) => {
  let toggle = get(
    state.screenConfiguration.screenConfig[screenKey],
    "components.deleteConfirmation.props.open",
    false
  );
  dispatch(
    handleField(screenKey, "components.deleteConfirmation", "props.open", !toggle)
  );
};

export const showHideAdhocPopupVendorError = (state, dispatch, screenKey) => {
  let toggle = get(
    state.screenConfiguration.screenConfig[screenKey],
    "components.adhocDialog.props.open",
    false
  );
  dispatch(
    handleField(screenKey, "components.adhocDialog", "props.open", !toggle)
  );
};
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


export const createDemandForChallan = async (state, dispatch, tenantId) => {
  try {

    let challanDetails = get(state.screenConfiguration.preparedFinalObject, "eChallanDetail[0]");
    let usercontact = await getUserDetailsOnMobile('CITIZEN', challanDetails.contactNumber);


    let fineAmount = challanDetails.fineAmount;
    let penaltyAmount = challanDetails.penaltyAmount;
    let challanNumber = challanDetails.challanId;
    //let encroachmentType = challanDetails.encroachmentType;

    //let userInfo = JSON.parse(getUserInfo());
    //this user info is masked for demand generation while this is dummyuser

    // userInfo.pwdExpiryDate = 0;
    // userInfo.createdDate = 0;
    // userInfo.lastModifiedDate = 0;
    // userInfo.dob = 0;
    let currentFinancialYr = getCurrentFinancialYear();
    //Changing the format of FY
    let fY1 = currentFinancialYr.split("-")[1];
    fY1 = fY1.substring(2, 4);
    currentFinancialYr = currentFinancialYr.split("-")[0] + "-" + fY1;


    let queryObject = [
      { key: "tenantId", value: tenantId },
      { key: "consumerCodes", value: challanNumber }
    ];
    let querydemand = {
      "CalulationCriteria": [
        {
          "ecDetail": {
            "financialYear": currentFinancialYr,
            "tenantId": tenantId,
            "challanNumber": challanNumber,
            "fineAmount": fineAmount,
            "penaltyAmount": penaltyAmount,
            "uuid": usercontact.user[0].uuid !== "undefined" ? usercontact.user[0].uuid : "737b1d07-b421-475d-b9f6-302b9a273911", //usercontact[0].uuid,
          },
          "tenantId": tenantId,
        }
      ]
    };

    // Get Receipt
    let payload = await httpRequest("post", "/ec-calculator/v1/_calculate", "",
      queryObject,
      querydemand
    );
    return payload;
  } catch (e) {

    console.log(e);
  }
};

export const getBill = async queryObject => {
  try {
    const response = await httpRequest(
      "post",
      "/billing-service/bill/v2/_fetchbill",
      "",
      queryObject
    );

    return response;
  } catch (error) {
    console.log(error);
  }
};

export const searchBill = async (dispatch, applicationNumber, tenantId, paymentStatus) => {
  try {
    let queryObject = [
      { key: "tenantId", value: tenantId },
      { key: "consumerCodes", value: applicationNumber }
    ];

    // Get Receipt
    let payload = await httpRequest(
      "post", "/collection-services/payments/_search", "", queryObject
    );

    // Get Bill

    http://localhost:9002/billing-service/bill/v2/_fetchbill?tenantId=ch.chandigarh&consumerCode=MCC-EC-000202&businessService=EC
    const queryObj = [
      {
        key: "tenantId",
        value: tenantId
      },
      {
        key: "consumerCode",
        value: applicationNumber
      },
      { key: "businessService", value: "EC" }
    ];

    let response = [];
    if (paymentStatus !== 'PAID') {
      response = await getBill(queryObj);
    } else {
      response = await billingsearchBill(queryObj, dispatch);
    }
    // If pending payment then get bill else get receipt
    let billData = get(payload, "Payment[0].Bill") || get(response, "Bill");

    if (billData) {
      dispatch(prepareFinalObject("ReceiptTemp[0].Bill", billData));
      const estimateData = createEstimateData(billData[0]);
      estimateData &&
        estimateData.length &&
        dispatch(
          prepareFinalObject(
            "applyScreenMdmsData.estimateCardData",
            estimateData
          )
        );
    }
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
        info: { labelName: item.taxHeadCode, labelKey: item.taxHeadCode }
      };
    });
  return fees;
};

export const createBill = async (queryObject, dispatch) => {
  try {
    const response = await httpRequest(
      "post",
      "/billing-service/bill/v2/_fetchbill",
      "",
      queryObject
    );
    return response;
  } catch (error) {
    dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelKey: error.message },
        "error"
      )
    );
    console.log(error, 'fetxh');
  }
};

export const billingsearchBill = async (queryObject, dispatch) => {
  try {
    const response = await httpRequest(
      "post",
      "/billing-service/bill/v2/_search",
      "",
      queryObject
    );
    return response;
  } catch (error) {
    dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelKey: error.message },
        "error"
      )
    );
    console.log(error, 'fetxh');
  }
};


export const generateBill = async (dispatch, applicationNumber, tenantId) => {
  try {

    if (applicationNumber && tenantId) {
      const queryObj = [
        {
          key: "tenantId",
          value: tenantId
        },
        {
          key: "consumerCode",
          value: applicationNumber
        },
        { key: "businessService", value: "EC" }
      ];
      const payload = await createBill(queryObj, dispatch);
      // let payload = sampleGetBill();

      if (payload && payload.Bill[0]) {
        dispatch(prepareFinalObject("ReceiptTemp[0].Bill", payload.Bill));
        const estimateData = createEstimateData(payload.Bill[0]);
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

export const getTextToLocalSeizedItemDetailHeader = label => {
  const localisationLabels = getTransformedLocalStorgaeLabels();
  switch (label) {
    case "itemName":
      return getLocaleLabels(
        "Item Name",
        "EC_SM_TABLE_COL_ITEM_NAME",
        localisationLabels
      );
    case "quantity":
      return getLocaleLabels(
        "Seized Quantity",
        "EC_SM_TABLE_COL_SEIZED_QTY",
        localisationLabels
      );
    case "siRemark":
      return getLocaleLabels(
        "SI Remark",
        "EC_SM_TABLE_COL_SI_REMARK",
        localisationLabels
      );
    case "actualQtyRecd":
      return getLocaleLabels(
        "Intact QTY RECD",
        "EC_SM_TABLE_COL_ACTUAL_QTY_RECD",
        localisationLabels
      );
    case "damageLostQty":
      return getLocaleLabels(
        "Damage / Lost Qty",
        "EC_SM_TABLE_COL_DAMAGE_QTY",
        localisationLabels
      );
    case "smRemark":
      return getLocaleLabels(
        "Remark",
        "EC_SM_TABLE_COL_SM_REMARK",
        localisationLabels
      );
    case "violationItemUuid":
      return getLocaleLabels(
        "Violation Item Id",
        "EC_SM_TABLE_COL_VIOLATION_ITEM_ID",
        localisationLabels
      );
    case "violationUuid":
      return getLocaleLabels(
        "Violation Id",
        "EC_SM_TABLE_COL_VIOLATION_ID",
        localisationLabels
      );
    case "isVerified":
      return getLocaleLabels(
        "Verified",
        "EC_SM_TABLE_COL_IS_VERIFIED",
        localisationLabels
      );
    case "isAuctioned":
      return getLocaleLabels(
        "Auctioned",
        "EC_SM_TABLE_COL_IS_AUCTIONED",
        localisationLabels
      );
    case "isReturned":
      return getLocaleLabels(
        "Returned",
        "EC_SM_TABLE_COL_IS_RETURNED",
        localisationLabels
      );
    case "AUCTIONED_SEIZED_ITEM_DETAILS":
      return getLocaleLabels(
        "Auction Seized Item Details",
        "EC_AUCTIONED_SEIZED_ITEM_DETAILS_HOD_HEADER",
        localisationLabels
      )
    case "AuctionedQty":
      return getLocaleLabels(
        "Auctioned Quantity",
        "EC_AUCTIONED_QTY",
        localisationLabels
      )
    case "AuctionedDate":
      return getLocaleLabels(
        "Auction Date",
        "EC_AUCTIONED_SEIZED_DATE",
        localisationLabels
      )
    case "storeQtyRecd":
      return getLocaleLabels(
        "Store Qty",
        "EC_AUCTIONED_STORE_QTY",
        localisationLabels
      )
    case "availableQty":
      return getLocaleLabels(
        "Auctioned Qty",
        "EC_AUCTIONED_AVAILABLE_QTY",
        localisationLabels
      )
    case "intactQtyGreater":
      return getLocaleLabels(
        "Intact qty recd. cannot be greater then seized qty",
        "EC_INTACT_QTY_GREATER_SEIZED_QTY",
        localisationLabels
      )
    case "sumQtyGreater":
      return getLocaleLabels(
        "Sum of damage and intact qty cannot be greater then seized qty",
        "EC_SUM_OF_DAMAGE_INTACT_QTY_GREATER_SEIZED_QTY",
        localisationLabels
      )
    case "damageQtyGreater":
      return getLocaleLabels(
        "Defect/Damage qty cannot be greater then seized qty",
        "EC_DAMAGE_QTY_GREATER_SEIZED_QTY",
        localisationLabels
      )
    case "intactQtyBlank":
      return getLocaleLabels(
        "Intact quantity cannot be left blank or be less then 0",
        "EC_FOOTER_INTACT_QTY_BLANK",
        localisationLabels
      )
    case "damageQtyBlank":
      return getLocaleLabels(
        "Damage quantity should be 0",
        "EC_FOOTER_DAMAGE_QTY_ZERO",
        localisationLabels
      )
    case "damageQtyRequired":
      return getLocaleLabels(
        "Since intact quantity is less then the seized quantity, damage quantity is required",
        "EC_FOOTER_DAMAGE_QTY_REQUIRED",
        localisationLabels
      )
    case "remarkRequired":
      return getLocaleLabels(
        "Remark is required",
        "EC_FOOTER_REMARK_REQUIRED",
        localisationLabels
      )
    case "intactDamageQtyNotEqual":
      return getLocaleLabels(
        "Intact & damage quantity should be equal to seized quantity",
        "EC_FOOTER_INTACT_DAMAGE_QTY_NOT_EQUAL",
        localisationLabels
      )
    case "challanVerified":
      return getLocaleLabels(
        "Challan verified and updated to store successfully!",
        "EC_FOOTER_CHALLAN_VERIFIED",
        localisationLabels
      )
    case "challanVerifiedFail":
      return getLocaleLabels(
        "Challan verification/updation failed!. Please try after some time",
        "EC_FOOTER_CHALLAN_VERIFICATION_FAILED",
        localisationLabels
      )
    case "pendingAlert":
      return getLocaleLabels(
        "Record needs to be approved first, before editing it!",
        "EC_ITEM_MASTER_PENDING_Alert",
        localisationLabels)
  };
}

export const getTextToLocalMapping = label => {
  const localisationLabels = getTransformedLocalStorgaeLabels();
  switch (label) {
    case "imageofViolator":
    case "EC_ViolatorImage":
    case "EC_VIOLATOR_IMAGE":
    case "VIOLATORIMAGE":
    case "ViolatorImage":
      return getLocaleLabels(
        "Violator Image", "EC_VIOLATORIMAGE", localisationLabels);

    case "idProofofViolator":
    case "EC_ViolatorIdProof":
    case "VIOLATORIDPROOF":
    case "ViolatorIdProof":
    case "EC_ID_PROOF_OF_VIOLATOR":
      return getLocaleLabels(
        "ID PROOF", "EC_VIOLATORIDPROOF", localisationLabels);

    case "violationDocuments":
    case "EC_violationDocuments":
    case "EC_imageofViolations":
      return getLocaleLabels(
        "Violation Images", "EC_IMAGEOFVIOLATIONS", localisationLabels);
    case "StoreManagerUpload":
    case "EC_StoreManagerUpload":
      return getLocaleLabels(
        "Store Manager Proof", "EC_StoreManagerUpload", localisationLabels);

  }
};

export const getTextToLocalMappingFineMaster = label => {
  const localisationLabels = getTransformedLocalStorgaeLabels();
  switch (label) {
    case "fineUuid":
      return getLocaleLabels(
        "Fine UUID",
        "EC_COMMON_TABLE_COL_FINE_MASTER_FINEUUID",
        localisationLabels
      );
    case "approvalStatus":
      return getLocaleLabels(
        "Status",
        "EC_COMMON_TABLE_COL_FINE_MASTER_STATUS",
        localisationLabels
      );
    case "encroachmentType":
      return getLocaleLabels(
        "Encroachment Type",
        "EC_COMMON_TABLE_COL_FINE_MASTER_ENCROACHMENT_TYPE",
        localisationLabels
      );
    case "numberOfViolation":
      return getLocaleLabels(
        "Violation Count / Vehicle Type",
        "EC_COMMON_TABLE_COL_FINE_MASTER_VIOLATION_COUNT",
        localisationLabels
      );
    case "penaltyAmount":
      return getLocaleLabels(
        "Penalty Amount",
        "EC_POPUP_FINE_MASTER_AMOUNT_LABEL",
        // "EC_COMMON_TABLE_COL_FINE_MASTER_PENALTY_AMOUNT",
        localisationLabels
      );
    case "isActive":
      return getLocaleLabels(
        "Active",
        "EC_COMMON_TABLE_COL_FINE_MASTER_ISACTIVE",
        localisationLabels
      );
    case 'EC_COMMON_TABLE_HEADER_FINE_MASTER':
      return getLocaleLabels(
        'Search Results for FINE - Master',
        'EC_COMMON_TABLE_HEADER_FINE_MASTER',
        localisationLabels
      )
    case 'storageCharges':
      return getLocaleLabels(
        'Storage Charges (Per Day)',
        'EC_COMMON_TABLE_COL_FINE_MASTER_STORAGE_CHARGES',
        localisationLabels
      )
    case 'effectiveStartDate':
      return getLocaleLabels(
        'Start Date',
        'EC_COMMON_TABLE_COL_FINE_MASTER_START_DATE',
        localisationLabels
      )
    case 'effectiveEndDate':
      return getLocaleLabels(
        'End Date',
        'EC_COMMON_TABLE_COL_FINE_MASTER_END_DATE',
        localisationLabels
      )
  }
};

export const getTextToLocalMappingItemMaster = label => {
  const localisationLabels = getTransformedLocalStorgaeLabels();
  switch (label) {
    case "itemName":
      return getLocaleLabels(
        "Item Name",
        "EC_COMMON_TABLE_COL_ITEM_NAME",
        localisationLabels
      );
    case "description":
      return getLocaleLabels(
        "Item Description",
        "EC_COMMON_TABLE_COL_ITEM_DESCRIPTION",
        localisationLabels
      );
    case "approvalStatus":
      return getLocaleLabels(
        "Status",
        "EC_COMMON_TABLE_COL_STATUS",
        localisationLabels
      );
    case "tenantId":
      return getLocaleLabels(
        "Tenant ID",
        "EC_COMMON_TABLE_COL_TENANTID",
        localisationLabels
      );
    case "itemUuid":
      return getLocaleLabels(
        "Item Id",
        "EC_COMMON_TABLE_COL_ITEMUUID",
        localisationLabels
      );
    case "isActive":
      return getLocaleLabels(
        "Active",
        "EC_COMMON_TABLE_COL_ISACTIVE",
        localisationLabels
      );
    case 'EC_COMMON_TABLE_HEADER_ITEM_MASTER':
      return getLocaleLabels(
        'Search Results for Item - Master',
        'EC_COMMON_TABLE_HEADER_ITEM_MASTER',
        localisationLabels
      )
    case 'EC_SUCCESS_TOASTER':
      return getLocaleLabels(
        'Item Master Inserted successfully!',
        'EC_SUCCESS_TOASTER',
        localisationLabels
      )
  }
};

export const getTextToLocalMappingManageChallan = label => {
  const localisationLabels = getTransformedLocalStorgaeLabels();
  switch (label) {

    case "manageChallan":
      return getLocaleLabels(
        "manage Challan ",
        "EC_COMMON_TABLE_HEADER_MANAGE_CHALLAN",
        localisationLabels
      );
    case "challanId":
      return getLocaleLabels(
        "challan No",
        "EC_COMMON_TABLE_COL_SI_CHALLAN_NO",
        localisationLabels
      );
    case "encroachmentType":
      return getLocaleLabels(
        "Encroachment Type",
        "EC_COMMON_TABLE_COL_SI_ITEM_ENCROACHMENT_TYPE",
        localisationLabels
      );
    case "violationDate":
      return getLocaleLabels(
        "Violation Date",
        "EC_COMMON_TABLE_COL_SI_VIOLATION_DATE",
        localisationLabels
      );
    case "violatorName":
      return getLocaleLabels(
        "Violator Name",
        "EC_COMMON_TABLE_COL_SI_VIOLATOR_NAME",
        localisationLabels
      );
    case "sector":
      return getLocaleLabels(
        "Sector",
        "EC_COMMON_TABLE_COL_SI_VIOLATION_SECTOR",
        localisationLabels
      );
    case "contactNumber":
      return getLocaleLabels(
        "Violator Contact Number",
        "EC_COMMON_TABLE_COL_SI_VIOLATOR_CONTACT_NUMBER",
        localisationLabels
      );
    case "siName":
      return getLocaleLabels(
        "SI Name",
        "EC_COMMON_TABLE_COL_SI_NAME",
        localisationLabels
      );
    case "status":
      return getLocaleLabels(
        "Status",
        "EC_COMMON_TABLE_COL_SI_CHALLAN_STATUS",
        localisationLabels
      );
    case "tenantId":
      return getLocaleLabels(
        "Tenant Id",
        "EC_COMMON_TABLE_COL_SI_CHALLAN_TENANTID",
        localisationLabels
      );
    case "gridpaymentstatus":
      return getLocaleLabels(
        "Payment Status",
        "EC_COMMON_TABLE_COL_SI_CHALLAN_PAYMENT_STATUS",
        localisationLabels
      );
  }
};

export const getTextToLocalMappingArticleGrid = label => {
  const localisationLabels = getTransformedLocalStorgaeLabels();
  switch (label) {
    case "ItemName":
      return getLocaleLabels(
        "Item Name",
        "EC_COMMON_TABLE_COL_ARTICLE_SEIZED_ITEM_NAME",
        localisationLabels
      );
    case "SeizedQty":
      return getLocaleLabels(
        "Seized Qty",
        "EC_COMMON_TABLE_COL_ARTICLE_SEIZED_QUANTITY",
        localisationLabels
      );
    case "VehicleNumber":
      return getLocaleLabels(
        "Vehicle Number",
        "EC_COMMON_TABLE_COL_ARTICLE_SEIZED_VEHICLE_NUMBER",
        localisationLabels
      );
    case "Remark":
      return getLocaleLabels(
        "Remark",
        "EC_COMMON_TABLE_COL_ARTICLE_SEIZED_REMARKS",
        localisationLabels
      );
    case "Other":
      return getLocaleLabels(
        "Other Item",
        "EC_COMMON_TABLE_COL_ARTICLE_SEIZED_OTHER_ITEM_NAME",
        localisationLabels
      );
  }
};

export const getTextToLocalMappingViewSizure = label => {
  const localisationLabels = getTransformedLocalStorgaeLabels();
  switch (label) {
    case "challanNo":
      return getLocaleLabels(
        "challanNo",
        "EC_COMMON_TABLE_COL_CHALLAN_NO",
        localisationLabels
      );
    case "challanDate":
      return getLocaleLabels(
        "challanDate",
        "EC_COMMON_TABLE_COL_ITEM_CHALLAN_DATE",
        localisationLabels
      );
    case "enchroachmentType":
      return getLocaleLabels(
        "enchroachmentType",
        "EC_COMMON_TABLE_COL_VEHICLE_ENCHROACHMENT_TYPE",
        localisationLabels
      );
    case "SIName":
      return getLocaleLabels(
        "SIName",
        "EC_COMMON_TABLE_COL_SI_NAME",
        localisationLabels
      );
    case "sectordetails":
      return getLocaleLabels(
        "sectordetails",
        "EC_COMMON_TABLE_COL_SECTORDETAILS",
        localisationLabels
      );
    case "amount":
      return getLocaleLabels(
        "amount",
        "EC_COMMON_TABLE_COL_AMOUNT",
        localisationLabels
      );
  }
};

export const getTextToLocalMappingChallanSummary = label => {
  const localisationLabels = getTransformedLocalStorgaeLabels();
  switch (label) {
    case "challanNo":
      return getLocaleLabels(
        "challanNo",
        "EC_COMMON_TABLE_COL_CHALLAN_NO",
        localisationLabels
      );
    case "challanDate":
      return getLocaleLabels(
        "challanDate",
        "EC_COMMON_TABLE_COL_ITEM_CHALLAN_DATE",
        localisationLabels
      );
    case "enchroachmentType":
      return getLocaleLabels(
        "enchroachmentType",
        "EC_COMMON_TABLE_COL_VEHICLE_ENCHROACHMENT_TYPE",
        localisationLabels
      );
    case "SIName":
      return getLocaleLabels(
        "SIName",
        "EC_COMMON_TABLE_COL_SI_NAME",
        localisationLabels
      );
    case "sectordetails":
      return getLocaleLabels(
        "sectordetails",
        "EC_COMMON_TABLE_COL_SECTORDETAILS",
        localisationLabels
      );
    case "amount":
      return getLocaleLabels(
        "amount",
        "EC_COMMON_TABLE_COL_AMOUNT",
        localisationLabels
      );
    case "itemName":
      return getLocaleLabels(
        "Item Name",
        "EC_COMMON_TABLE_COL_SI_ITEM_NAME",
        localisationLabels
      );
    case "quantity":
      return getLocaleLabels(
        "Quantity",
        "EC_COMMON_TABLE_COL_QUANTITY",
        localisationLabels
      );
    case "vehicleNumber":
      return getLocaleLabels(
        "Vehicle Number",
        "EC_COMMON_TABLE_COL_VEHICLE_NO",
        localisationLabels
      );
    case "vehicleType":
      return getLocaleLabels(
        "Vehicle Type",
        "EC_COMMON_TABLE_COL_VEHICLE_TYPE",
        localisationLabels
      );

    case "remark":
      return getLocaleLabels(
        "Remark",
        "EC_COMMON_TABLE_COL_REMARK",
        localisationLabels
      );
    case "Seized_Item_List":
      return getLocaleLabels(
        "SEIZED ITEM List",
        "EC_SEARCH_PRIVIEW_SEIZED_ITEM_DETAIL",
        localisationLabels
      );
  }
};

export const getTextToLocalMappingVendorDetail = label => {
  const localisationLabels = getTransformedLocalStorgaeLabels();
  switch (label) {
    case "vendorUuid":
      return getLocaleLabels(
        "vendorUuid",
        "EC_VENDOR_COMMON_TABLE_COL_VENDORUUID_NUMBER",
        localisationLabels
      );
    case "passNo":
      return getLocaleLabels(
        "passNo",
        "EC_VENDOR_COMMON_TABLE_COL_PASS_NUMBER",
        localisationLabels
      );
    case "covNo":
      return getLocaleLabels(
        "COV Number",
        "EC_VENDOR_COMMON_TABLE_COL_COV_NUMBER",
        localisationLabels
      );
    case "name":
      return getLocaleLabels(
        "Name",
        "EC_VENDOR_COMMON_TABLE_COL_NAME",
        localisationLabels
      );
    case "fatherSpouseName":
      return getLocaleLabels(
        "Fathers Name/Spouse Name",
        "EC_VENDOR_COMMON_TABLE_COL_FATHER_NAME",
        localisationLabels
      );
    case "address":
      return getLocaleLabels(
        "Residential Address",
        "EC_VENDOR_COMMON_TABLE_COL_RESIDENTIAL_ADDRESS",
        localisationLabels
      );
    case "contactNumber":
      return getLocaleLabels(
        "Mobile Number",
        "EC_VENDOR_COMMON_TABLE_COL_MOBILE_NUMBER",
        localisationLabels
      );
    case "vendorCategory":
      return getLocaleLabels(
        'Category Of VENDOR',
        "EC_VENDOR_COMMON_TABLE_COL_CATEGORY_OF_VENDOR",
        localisationLabels
      );
    case "streetVendorArea":
      return getLocaleLabels(
        'Sector',
        'EC_AREA_OF_STREET_VENDING_SECTOR_VILLAGE',
        localisationLabels
      )
    case "transportMode":
      return getLocaleLabels(
        'Mode of Transport',
        'EC_MODE_OF_TRANSPORT',
        localisationLabels
      )
      case "isActive":
        return getLocaleLabels(
          'Active',
          'EC_IS_ACTIVE',
          localisationLabels
        )
    case "remark":
      return getLocaleLabels(
        'Remark',
        'EC_VENDOR_COMMON_TABLE_COL_REMARK',
        localisationLabels
      )
    case "tenantId":
      return getLocaleLabels(
        'Tenant Id',
        'EC_TENANT_ID',
        localisationLabels
      )

    case "isActive":
      return getLocaleLabels(
        'isActive',
        "EC_VENDOR_COMMON_TABLE_COL_ISACTIVE_VENDOR",
        localisationLabels
      );
    case 'EC_COMMON_TABLE_HEADER_VENDOR_MASTER':
      return getLocaleLabels(
        'Search Results for Vendor - Master',
        'EC_COMMON_TABLE_HEADER_VENDOR_MASTER',
        localisationLabels
      )
  }
};

export const getTextToLocalMappingVendorErrorDetail = label => {
  const localisationLabels = getTransformedLocalStorgaeLabels();
  switch (label) {
    case "vendorUuid":
      return getLocaleLabels(
        "vendorUuid",
        "EC_VENDOR_COMMON_TABLE_COL_VENDORUUID_NUMBER",
        localisationLabels
      );
    case "passNo":
      return getLocaleLabels(
        "passNo",
        "EC_VENDOR_COMMON_TABLE_COL_PASS_NUMBER",
        localisationLabels
      );
    case "covNo":
      return getLocaleLabels(
        "COV Number",
        "EC_VENDOR_COMMON_TABLE_COL_COV_NUMBER",
        localisationLabels
      );
    case "name":
      return getLocaleLabels(
        "Name",
        "EC_VENDOR_COMMON_TABLE_COL_NAME",
        localisationLabels
      );
    case "fatherSpouseName":
      return getLocaleLabels(
        "Fathers Name/Spouse Name",
        "EC_VENDOR_COMMON_TABLE_COL_FATHER_NAME",
        localisationLabels
      );
    case "address":
      return getLocaleLabels(
        "Residential Address",
        "EC_VENDOR_COMMON_TABLE_COL_RESIDENTIAL_ADDRESS",
        localisationLabels
      );
    case "contactNumber":
      return getLocaleLabels(
        "Mobile Number",
        "EC_VENDOR_COMMON_TABLE_COL_MOBILE_NUMBER",
        localisationLabels
      );
    case "vendorCategory":
      return getLocaleLabels(
        'Category Of VENDOR',
        "EC_VENDOR_COMMON_TABLE_COL_CATEGORY_OF_VENDOR",
        localisationLabels
      );
    case "streetVendorArea":
      return getLocaleLabels(
        'Sector',
        'EC_AREA_OF_STREET_VENDING_SECTOR_VILLAGE',
        localisationLabels
      )
    case "transportMode":
      return getLocaleLabels(
        'Mode of Transport',
        'EC_MODE_OF_TRANSPORT',
        localisationLabels
      )
    case "remark":
      return getLocaleLabels(
        'Remark',
        'EC_VENDOR_COMMON_TABLE_COL_REMARK',
        localisationLabels
      )
    case "tenantId":
      return getLocaleLabels(
        'Tenant Id',
        'EC_TENANT_ID',
        localisationLabels
      )

    case "isActive":
      return getLocaleLabels(
        'isActive',
        "EC_VENDOR_COMMON_TABLE_COL_ISACTIVE_VENDOR",
        localisationLabels
      );
    case 'EC_COMMON_TABLE_HEADER_VENDOR_MASTER':
      return getLocaleLabels(
        'Search Results for Vendor - Master',
        'EC_COMMON_TABLE_HEADER_VENDOR_MASTER',
        localisationLabels
      )
  }
};
export const clearlocalstorageAppDetails = (state) => {
  set(state, "screenConfiguration.preparedFinalObject", {});
  lSRemoveItemlocal('applicationType');
  lSRemoveItemlocal('applicationStatus');
  lSRemoveItemlocal('ApplicationNumber');
  lSRemoveItemlocal('applicationMode');
  lSRemoveItemlocal('ecroachmentType');
  lSRemoveItemlocal('FineMasterGrid');
  lSRemoveItemlocal('ItemMasterGrid');
  lSRemoveItemlocal('EChallanPaymentMailSent');
  //lSRemoveItemlocal('eChallanMasterGrid');

  lSRemoveItem('applicationType');
  lSRemoveItem('applicationStatus');
  lSRemoveItem('ApplicationNumber');
  lSRemoveItem('applicationMode');
  lSRemoveItem('ecroachmentType');
  lSRemoveItem('FineMasterGrid');
  lSRemoveItem('ItemMasterGrid');
  lSRemoveItem('EChallanPaymentMailSent');
  //lSRemoveItem('eChallanMasterGrid');
}


const a = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ', 'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen ']
const b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']

const regex = /^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/

const getLT20 = (n) => a[Number(n)]
const get20Plus = (n) => b[n[0]] + ' ' + a[n[1]]

export const numWords = (input) => {
  const num = Number(input)
  if (isNaN(num)) return ''
  if (num === 0) return 'zero'

  const numStr = num.toString()
  if (numStr.length > 9) {
    throw new Error('overflow') // Does not support converting more than 9 digits yet
  }

  const [, n1, n2, n3, n4, n5] = ('000000000' + numStr).substr(-9).match(regex) // left pad zeros

  let str = ''
  str += n1 != 0 ? (getLT20(n1) || get20Plus(n1)) + 'crore ' : ''
  str += n2 != 0 ? (getLT20(n2) || get20Plus(n2)) + 'lakh ' : ''
  str += n3 != 0 ? (getLT20(n3) || get20Plus(n3)) + 'thousand ' : ''
  str += n4 != 0 ? getLT20(n4) + 'hundred ' : ''
  str += n5 != 0 && str != '' ? 'and ' : ''
  str += n5 != 0 ? (getLT20(n5) || get20Plus(n5)) : ''

  return str.trim()
}

export const showHideAdhocPopupReceivePayment = (state, dispatch, screenKey, type) => {
  //setTimeout(function () {
  //  const objectJsonPath = `components.receivePayment.children.popup`;
  //  const children = get(
  //     state.screenConfiguration.screenConfig["search-preview"],
  //     objectJsonPath,
  //     {}
  //   );
  //   resetAllFields(children, dispatch, state, 'search-preview');
  let toggle = get(
    state.screenConfiguration.screenConfig[screenKey],
    "components.receivePayment.props.open", false
  );
  dispatch(
    handleField(screenKey, "components.receivePayment", "props.open", !toggle)
  );

  //}, 500);

};

export const showHideAdhocPopupForwardUploadDocs = (state, dispatch, screenKey) => {
  //setTimeout(function () {

  let toggle = get(
    state.screenConfiguration.screenConfig[screenKey],
    "components.forwardViolation.props.open", false
  );
  dispatch(
    handleField(screenKey, "components.forwardViolation", "props.open", !toggle)
  );

  //}, 500);

};
////Report localisation call
export const getTextToLocalMappingInventoryDetail = label => {
  const localisationLabels = getTransformedLocalStorgaeLabels();
  switch (label) {
    case "Inventoy_Report_Header":
      return getLocaleLabels(
        "Ageing Report",
        "EC_REPORT_INVENTORY_COMMON_TABLE_HED_AGEING",
        localisationLabels
      );
    case "challanId":
      return getLocaleLabels(
        "Challan No",
        "EC_REPORT_INVENTORY_COMMON_TABLE_COL_CHALLAN_NO",
        localisationLabels
      );
    case "itemName":
      return getLocaleLabels(
        "Item Name",
        "EC_REPORT_INVENTORY_COMMON_TABLE_COL_ITEM_NAME",
        localisationLabels
      );
    case "itemQuantity":
      return getLocaleLabels(
        "Item Quantity",
        "EC_COMMON_INVENTORY_TABLE_COL_ITEM_QUANTITY",
        localisationLabels
      );
    case "itemStoreDepositDate":
      return getLocaleLabels(
        "Item Store Deposit Date",
        "EC_REPORT_INVENTORY_COMMON_TABLE_COL_ITEM_STORE_DEPOSIT_DATE",
        localisationLabels
      );
    case "challanstatus":
      return getLocaleLabels(
        "Challan Status",
        "EC_REPORT_INVENTORY_COMMON_TABLE_COL_CHALLAN_STATUS",
        localisationLabels
      );
    case "age":
      return getLocaleLabels(
        "Age",
        "EC_REPORT_INVENTORY_COMMON_TABLE_COL_AGE",
        localisationLabels
      );
  }
};

export const getTextToLocalMappingPaymentDetail = label => {
  const localisationLabels = getTransformedLocalStorgaeLabels();
  switch (label) {


    case "EC_VIEW_PAYMENT_REPORT_TITLE_HEADER":
      return getLocaleLabels(
        "payment Report",
        "EC_VIEW_PAYMENT_REPORT_TITLE_HEADER",
        localisationLabels
      );

    case "challanId":
      return getLocaleLabels(
        "Challan No",
        "EC_COMMON_TABLE_COL_PAYMENT_MAPPING_CHALLAN_NO",
        localisationLabels
      );
    case "violatorName":
      return getLocaleLabels(
        "Violator Name",
        "EC_COMMON_TABLE_COL_PAYMENT_MAPPING_VIOLATOR_NAME",
        localisationLabels
      );
    case "violationDate":
      return getLocaleLabels(
        "Challan Date",
        "EC_COMMON_TABLE_COL_PAYMENT_MAPPING_CHALLAN_DATE",
        localisationLabels
      );
    // case "enchroachmentType":
    //   return getLocaleLabels(
    //     "Enchroachment Type",
    //     "EC_COMMON_TABLE_COL_PAYMENT_MAPPING_ENCHROACHMENT_TYPE",
    //     localisationLabels
    //   );
    case "siName":
      return getLocaleLabels(
        "SI Name",
        "EC_COMMON_TABLE_COL_PAYMENT_MAPPING_SI_NAME",
        localisationLabels
      );
    case "paymentMode":
      return getLocaleLabels(
        "Mode",
        "EC_COMMON_TABLE_COL_PAYMENT_MAPPING_PAYMENT_MODE",
        localisationLabels
      );
    case "encroachmentType":
      return getLocaleLabels(
        "EncroachmentType",
        "EC_COMMON_TABLE_COL_PAYMENT_MAPPING_ENCROACHMENT_TYPE",
        localisationLabels
      );
    case "paymentStatus":
      return getLocaleLabels(
        "Status",
        "EC_COMMON_TABLE_COL_PAYMENT_MAPPING_PAID_UNPAID",
        localisationLabels
      );
    case "sector":
      return getLocaleLabels(
        "Sector Details",
        "EC_COMMON_TABLE_COL_PAYMENT_MAPPING_SECTOR",
        localisationLabels
      );
    case "paymentAmount":
      return getLocaleLabels(
        "Amount",
        "EC_COMMON_TABLE_COL_PAYMENT_MAPPING_AMOUNT",
        localisationLabels
      );
    case "challanStatus":
      return getLocaleLabels(
        "Challan Status",
        "EC_COMMON_TABLE_COL_VIEW_SEIZURE_CHALLAN_STATUS",
        localisationLabels
      );
  }
};

export const getTextToLocalMappingViewSeizure = label => {
  const localisationLabels = getTransformedLocalStorgaeLabels();
  switch (label) {
    case "EC_VIEW_SEIZURE_REPORT_TITLE_HEADER":
      return getLocaleLabels(
        "seizureReport",
        "EC_VIEW_SEIZURE_REPORT_TITLE_HEADER",
        localisationLabels
      );
    case "challanId":
      return getLocaleLabels(
        "Challan No",
        "EC_COMMON_TABLE_COL_VIEW_SEIZURE_CHALLAN_NO",
        localisationLabels
      );
    case "challanDate":
      return getLocaleLabels(
        "Challan Date",
        "EC_COMMON_TABLE_COL_VIEW_SEIZURE_CHALLAN_DATE",
        localisationLabels
      );
    case "enchroachmentType":
      return getLocaleLabels(
        "Enchroachment Type",
        "EC_COMMON_TABLE_COL_VIEW_SEIZURE_ENCHROACHMENT_TYPE",
        localisationLabels
      );
    case "siName":
      return getLocaleLabels(
        "SI Name",
        "EC_COMMON_TABLE_COL_VIEW_SEIZURE_SI_NAME",
        localisationLabels
      );
    case "sector":
      return getLocaleLabels(
        "Sector",
        "EC_COMMON_TABLE_COL_VIEW_SEIZURE_SECTOR_DETAILS",
        localisationLabels
      );
    case "paymentAmount":
      return getLocaleLabels(
        "Amount",
        "EC_COMMON_TABLE_COL_VIEW_SEIZURE_AMOUNT",
        localisationLabels
      );
    case "violatorName":
      return getLocaleLabels(
        "Violator Name",
        "EC_COMMON_TABLE_COL_VIEW_SEIZURE_VIOLATOR_NAME",
        localisationLabels
      );
    case "paymentStatus":
      return getLocaleLabels(
        "Payment Status",
        "EC_COMMON_TABLE_COL_VIEW_SEIZURE_PAYMENT_STATUS",
        localisationLabels
      );
    case "challanStatus":
      return getLocaleLabels(
        "Challan Status",
        "EC_COMMON_TABLE_COL_VIEW_SEIZURE_CHALLAN_STATUS",
        localisationLabels
      );
  }
};


export const getTextToLocalMappingAuctionGrid = label => {
  const localisationLabels = getTransformedLocalStorgaeLabels();
  switch (label) {
    case "itemName":
      return getLocaleLabels(
        "Item Name",
        "EC_AUCTION_TABLE_COL_AUCTION_ITEM_NAME",
        localisationLabels
      );
    case "seizedQty":
      return getLocaleLabels(
        "Quantity",
        "EC_AUCTION_TABLE_COL_AUCTION_QUANTITY",
        localisationLabels
      );
    case "auctionDate":
      return getLocaleLabels(
        "Auction Date",
        "EC_AUCTION_COMMON_TABLE_COL_AUCTION_DATE",
        localisationLabels
      );
    case "contactNumber":
      return getLocaleLabels(
        "Purchaser Contact",
        "EC_AUCTION_TABLE_COL_PURCHASER_CONTACT",
        localisationLabels
      );
    case "purchaseName":
      return getLocaleLabels(
        "Purchaser Name",
        "EC_AUCTION_TABLE_COL_PURCHASER_NAME",
        localisationLabels
      );
    case "purchaseQuantity":
      return getLocaleLabels(
        "Purchaser Quantity",
        "EC_AUCTION_TABLE_COL_PURCHASER_QUANTITY",
        localisationLabels
      );
    case "amount":
      return getLocaleLabels(
        "Amount",
        "EC_AUCTION_TABLE_COL_AMOUNT",
        localisationLabels
      );
    case "itemStoreUuid":
      return getLocaleLabels(
        "itemStoreUuid", "EC_AUCTION_TABLE_COL_ITEM_STORE_UUID",
        localisationLabels
      )
  }
};

export const getTextToLocalMappingAuctionDetailGrid = label => {
  const localisationLabels = getTransformedLocalStorgaeLabels();
  switch (label) {
    case "itemName":
      return getLocaleLabels(
        "Item Name",
        "EC_AUCTION_HISTORY_TABLE_COL_AUCTION_ITEM_NAME",
        localisationLabels
      );
    case "purchaserName":
      return getLocaleLabels(
        "Purchaser Name",
        "EC_AUCTION_HISTORY_TABLE_COL_AUCTION_PURCHASER_NAME",
        localisationLabels
      );
    case "auctionDate":
      return getLocaleLabels(
        "Auction Date",
        "EC_AUCTION_HISTORY_COMMON_TABLE_COL_AUCTION_DATE",
        localisationLabels
      );
    case "auctionAmount":
      return getLocaleLabels(
        "Auction Amount",
        "EC_AUCTION_HISTORY_TABLE_COL_PURCHASER_AMOUNT",
        localisationLabels
      );
    case "auctionQuantity":
      return getLocaleLabels(
        "Auction Quantity",
        "EC_AUCTION_HISTORY_TABLE_COL_PURCHASER_QUANTITY",
        localisationLabels
      );
    case "purchaserContactNo":
      return getLocaleLabels(
        "Purchaser Contact Number",
        "EC_AUCTION_HISTORY_TABLE_COL_PURCHASER_CONTACT_NUMBER",
        localisationLabels
      );
    case "status":
      return getLocaleLabels(
        "Status",
        "EC_AUCTION_HISTORY_DETAIL_TABLE_COL_STATUS",
        localisationLabels
      );
  }
};
export const resetAllFields = (children, dispatch, state, screenKey) => {
  for (var child in children) {
    if (children[child].children) {

      for (var innerChild in children[child].children) {
        if (
          get(
            state.screenConfiguration.screenConfig[screenKey],
            `${
            children[child].children[innerChild].componentJsonpath
            }.props.value`
          )
        ) {

          dispatch(
            handleField(
              screenKey,
              children[child].children[innerChild].componentJsonpath,
              "props.disabled",
              false
            )
          );
          if (get(
            state.screenConfiguration.screenConfig[screenKey],
            `${
            children[child].children[innerChild].componentJsonpath
            }.componentPath`
          ) === 'AutosuggestContainer') {
            dispatch(
              handleField(
                screenKey,
                children[child].children[innerChild].componentJsonpath,
                "props.value",
                "0"
              )
            );
          } else {
            dispatch(
              handleField(
                screenKey,
                children[child].children[innerChild].componentJsonpath,
                "props.value",
                ""
              )
            );
          }
          dispatch(
            handleField(
              screenKey,
              children[child].children[innerChild].componentJsonpath,
              "props.error",
              false
            )
          );
          dispatch(
            handleField(
              screenKey,
              children[child].children[innerChild].componentJsonpath,
              "isFieldValid",
              true
            )
          );
          dispatch(
            handleField(
              screenKey,
              children[child].children[innerChild].componentJsonpath,
              "props.helperText",
              ""
            )
          );
        }
      }
    }
  }
};

export const callbackforsearchPreviewAction = async (state, dispatch) => {
  const appendUrl =
    process.env.REACT_APP_SELF_RUNNING === "true" ? "/egov-ui-framework" : "";
  const reviewUrl = `${appendUrl}/egov-echallan/echallan-landing`;
  dispatch(setRoute(reviewUrl));

};

export const getDiffernceBetweenTodayDate = (violationDate) => {

  let storeItemDate = new Date();
  let vo = new Date(getEpochForDate(violationDate));

  let diff_time = storeItemDate.getTime() - vo.getTime();
  let diff_days = diff_time / (1000 * 3600 * 24);

  return diff_days;
}

export const getDiffernceBetweenTwoDates = (startDate, endDate) => {

  let diff_time = new Date(getEpochForDate(startDate)).getTime() - new Date(getEpochForDate(endDate)).getTime();
  let diff_days = diff_time / (1000 * 3600 * 24);

  return diff_days;
}

export const checkForRole = (roleList, roleToCheck) => {
  return roleList.map(role => {
    return role.code
  }).includes(roleToCheck)
}

export const fetchRoleCode = (iscalledforInnerGrid, appstatus) => {
  let userRoleInfo = JSON.parse(getUserInfo()).roles;
  let rolecode = '';
  let si_Counter = 0;
  let isChallanSM = false;
  let isChallanSI = false;
  let isChallanHOD = false;
  let isChallanEAO = false;
  if (!iscalledforInnerGrid) {
    if (checkForRole(userRoleInfo, 'challanSM')) {
      isChallanSM = true;
    }
    if (checkForRole(userRoleInfo, 'challanHOD')) {
      isChallanHOD = true;
    }
    if (checkForRole(userRoleInfo, 'challanSI')) {
      isChallanSI = true;
    }
    if (checkForRole(userRoleInfo, 'challanEAO')) {
      isChallanEAO = true;
    }
    if (!isChallanSM && !isChallanHOD && isChallanSI) {
      rolecode = 'challanSI';
    }
    if (isChallanSM && !isChallanHOD && !isChallanSI) {
      rolecode = 'challanSM';
    }
    if (!isChallanSM && isChallanHOD && !isChallanSI) {
      rolecode = 'challanHOD';
    }
    if (isChallanSM && isChallanHOD && isChallanSI) {
      rolecode = 'challanSI';
    }
    if (isChallanSM && isChallanHOD && !isChallanSI) {
      rolecode = 'challanSM';
    }
    if (isChallanSM && !isChallanHOD && isChallanSI) {
      rolecode = 'challanSI';
    }
    if (!isChallanSM && isChallanHOD && isChallanSI) {
      rolecode = 'challanSI';
    }
  } else {
    //userRoleInfo.forEach(element => {
    if (checkForRole(userRoleInfo, 'challanSM')) {
      rolecode = 'challanSM';
      si_Counter += 1
    }
    if (checkForRole(userRoleInfo, 'challanSI')) {
      rolecode = 'challanSI';
      si_Counter += 1
    }
    if (checkForRole(userRoleInfo, 'challanHOD')) {
      rolecode = 'challanHOD';
      si_Counter += 1
    }
    if (checkForRole(userRoleInfo, 'CITIZEN')) {
      rolecode = 'CITIZEN';
    }
    if (checkForRole(userRoleInfo, 'challanEAO')) {
      rolecode = 'challanEAO';
    }
    //});
  }

  return si_Counter > 1 ? iscalledforInnerGrid
    ? (appstatus === ('RELEASED FROM STORE' || 'RELEASED ON GROUND' || 'CLOSED') || appstatus === 'CHALLAN ISSUED') ? 'challanSI'
      : 'challanSM' : 'challanSI' : rolecode;
}

export const generateReceiptNumber = (challanId) => {
  let receiptNumber = challanId.split('-')[0] + "-" + challanId.split('-')[1] + "-RN-" + challanId.split('-')[2]
  return receiptNumber;
}


export const getMdmsSectorData = async (action, state, dispatch) => {
  let tenantId = getTenantId().length > 2 ? getTenantId().split('.')[0] : getTenantId();;
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: tenantId,
      moduleDetails: [
        {
          moduleName: "egec",
          masterDetails: [
            {
              name: "sector"
            },
          ]
        },

      ]
    }
  };
  await fetchMdmsData(state, dispatch, mdmsBody, true);
};

export const sendReceiptBymail = async (state, dispatch, ReceiptLink, violatorDetails, isReceipt) => {
  try {

    let notificationTemplate = "";
    let receiptlin = [];
    let body = "";
    let RequestBody = {};
    let payload = violatorDetails;
    if (isReceipt) {
      notificationTemplate = get(state, "screenConfiguration.preparedFinalObject.applyScreenMdmsData.egec.NotificationTemplate[1]", {});
      body = notificationTemplate.body.replace('<violator>',payload.violatorName).replace('<ChallanId>', payload.challanId);
      notificationTemplate.attachments[0].url = ReceiptLink;
    } else {
      notificationTemplate = get(state, "screenConfiguration.preparedFinalObject.applyScreenMdmsData.egec.NotificationTemplate[0]", {});
      body = notificationTemplate.body.replace('<violator>',payload.violatorName).replace('<ChallanId>', payload.challanId).replace('<EnchroachmentType>', payload.encroachmentType).replace('<Date and Time>', payload.violationDate + " " + payload.violationTime).replace('<Link>', '<Link>');
      notificationTemplate.attachments[0].url = ReceiptLink
    }

    receiptlin.push(ReceiptLink);
    RequestBody.email = payload.emailId;
    RequestBody.subject = notificationTemplate.subject;
    RequestBody.body = body;
    //RequestBody.attachmentUrls = receiptlin;
    RequestBody.attachments = notificationTemplate.attachments
    RequestBody.isHtml = notificationTemplate.isHtml;
    RequestBody.tenantId = getTenantId();

    const response = await sendPaymentReceiptOverMail(RequestBody);

  } catch (error) {
    console.log(error);
  }

}

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

export const getMdmsEncroachmentSectorData = async (action, state, dispatch) => {
  let tenantId = getTenantId().length > 2 ? getTenantId().split('.')[0] : getTenantId();;
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: tenantId,
      moduleDetails: [
        {
          moduleName: "egec",
          masterDetails: [
            {
              name: "EncroachmentType"
            },
            {
              name: "paymentType"
            },
            {
              name: "paymentStatus"
            },
            {
              name: "sector"
            },
            {
              name: "NumberOfViolation"
            },
            {
              name: "VehicleType"
            },
            {
              name: "ChallanStatus"
            },
            {
              name: "cardList"
            }
          ]
        },

      ]
    }
  };
  await fetchMdmsData(state, dispatch, mdmsBody, false);
};


export const truncData = (str, length, ending) => {
  if (length == null) {
    length = 20;
  }
  if (ending == null) {
    ending = '...';
  }
  if (str.length > length) {
    return str.substring(0, length - ending.length) + ending;
  } else {
    return str;
  }
};


export const getSiNameDetails = async (action, state, dispatch) => {
  //http://192.168.12.114:8096/egov-hrms/employees/_search?roles=challanSM&tenantId=ch.chandigarh
  try {
    const queryStr = [
      { key: "tenantId", value: getTenantId() },
      { key: "roles", value: "challanSI" },
    ];
    await fetchSIName(state, dispatch, queryStr);


  } catch (e) {
    console.log(e);
  }

};

export const integer_to_roman = (num) => {
  if (typeof num !== 'number')
    return false;

  var digits = String(+num).split(""),
    key = ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM",
      "", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC",
      "", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"],
    roman_num = "",
    i = 3;
  while (i--)
    roman_num = (key[+digits.pop() + (i * 10)] || "") + roman_num;
  return Array(+digits.join("") + 1).join("M") + roman_num;
}
