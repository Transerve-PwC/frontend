import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { convertEpochToDate, convertDateToEpoch, truncData } from "../../utils/index";
import {
  prepareFinalObject,
  handleScreenConfigurationFieldChange as handleField
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { validateFields, getTextToLocalMappingInventoryDetail, getTextToLocalMappingManageChallan, getTextToLocalMappingViewSeizure, getTextToLocalMappingPaymentDetail, getTodayDate, resetAllFields } from "../../utils";
import set from "lodash/set";
import { fetchReportData } from "../../../../../ui-utils/commons";
import get from "lodash/get";
import { getTodaysDateInYMD } from "egov-ui-framework/ui-config/screens/specs/utils";
import { getTenantId, getUserInfo } from "egov-ui-kit/utils/localStorageUtils";

export const searchResultViewSeizureApiResponse = async (state, dispatch) => {
  let Todate = get(
    state.screenConfiguration.preparedFinalObject,
    "searchViewSeizureReport[0].ToDate", '')

  let fromdate = get(
    state.screenConfiguration.preparedFinalObject,
    "searchViewSeizureReport[0].FromDate", '')

  let storeItemDateprocess = getTodaysDateInYMD();

  let encroachmentType = get(
    state.screenConfiguration.preparedFinalObject,
    "searchViewSeizureReport[0].EncroachmentType", ''
  ) === '0' ? '' : get(
    state.screenConfiguration.preparedFinalObject,
    "searchViewSeizureReport[0].EncroachmentType", ''
  ).trim();

  let sector = get(
    state.screenConfiguration.preparedFinalObject,
    "searchViewSeizureReport[0].sector", ''
  ) === '0' ? '' : get(
    state.screenConfiguration.preparedFinalObject,
    "searchViewSeizureReport[0].sector", ''
  ).trim();

  let siName = get(
    state.screenConfiguration.preparedFinalObject,
    "searchViewSeizureReport[0].SIName", ''
  ) === '0' ? '' : get(
    state.screenConfiguration.preparedFinalObject,
    "searchViewSeizureReport[0].SIName", ''
  ).trim();

  let challanStatus = get(
    state.screenConfiguration.preparedFinalObject,
    "searchViewSeizureReport[0].Status", ''
  ) === '0' ? '' : get(
    state.screenConfiguration.preparedFinalObject,
    "searchViewSeizureReport[0].Status", ''
  ).trim();

  if ((fromdate === undefined || fromdate === '')) {
    dispatch(
      toggleSnackbar(
        true,
        { labelName: "Please fill Date", labelKey: "EC_ERR_FILL_DATE" },
        "warning"
      )
    );
  } else if ((Todate === undefined || Todate === '')) {
    dispatch(
      toggleSnackbar(
        true,
        { labelName: "Please fill Date", labelKey: "EC_ERR_FILL_DATE" },
        "warning"
      )
    );
  }
  else if (fromdate > Todate) {
    dispatch(
      toggleSnackbar(
        true,
        { labelName: "Start Date should be less than End date", labelKey: "EC_ERR_FILL_FROM_DATE_LESS_THAN_TODATE" }, "warning"
      )
    );
  }
  else if (Todate > storeItemDateprocess) {
    dispatch(
      toggleSnackbar(
        true,
        { labelName: "End Date should be less than Today Date", labelKey: "EC_ERR_FILL_TODATE_GREATER_DATE" },
        "warning"
      )
    );
  }

  else {
    let dataReq = {
      "RequestBody": {
        "tenantId": getTenantId(),
        "reportType": "Seizure",
        "fromDate": fromdate,
        "toDate": Todate,
        "encroachmentType": encroachmentType,
        "sector": sector,
        "siName": siName,
        "challanStatus": challanStatus,
      }
    }

    try {
      const response = await fetchReportData(dataReq)
      let sectorValue = get(state, 'screenConfiguration.preparedFinalObject.applyScreenMdmsData.egec.sector', []);
      let encroachValue = get(state, 'screenConfiguration.preparedFinalObject.applyScreenMdmsData.egec.EncroachmentType', []);

      let data = [];
      if (response.ResponseBody === null) {
        date = {
          [getTextToLocalMappingViewSeizure("challanId")]: "-",
          [getTextToLocalMappingViewSeizure("challanDate")]: "-",
          [getTextToLocalMappingViewSeizure("enchroachmentType")]: "-",
          [getTextToLocalMappingViewSeizure("siName")]: "-",
          [getTextToLocalMappingViewSeizure("sector")]: "-",
          [getTextToLocalMappingViewSeizure("paymentAmount")]: "-",
          [getTextToLocalMappingViewSeizure("violatorName")]: "-",
          [getTextToLocalMappingViewSeizure("challanStatus")]: "-",
          [getTextToLocalMappingViewSeizure("paymentStatus")]: "-",
        }
      } else {
        let SeizureReport = response.ResponseBody;

        SeizureReport.map(function (item, index) {
          let temp = [];
          let __FOUND = sectorValue.find(function (sectorRecord, index) {
            if (sectorRecord.code == item['sector'])
              return true;
          });
          let __FOUNDENCROACH = encroachValue.find(function (encroachRecord, index) {
            if (encroachRecord.code == item['encroachmentType'])
              return true;
          });
          let paymentStatus = item.paymentStatus === 'PENDING' ? 'UNPAID' : 'PAID';

          temp[0] = item['challanId'];
          temp[1] = truncData(item['violatorName'], 25);
          temp[2] = convertEpochToDate(item['violationDate']);
          temp[3] = __FOUNDENCROACH.name;
          temp[4] = item['siName'];
          temp[5] = __FOUND.name;
          temp[6] = item['paymentAmount'].toString();
          temp[7] = item['challanStatus'];
          temp[8] = paymentStatus;
          data.push(temp);
        });

      }
      dispatch(
        handleField(
          "reportSearchViewSeizure",
          "components.div.children.searchViewSeizureReport",
          "props.data",
          data
        )
      );
      showHideViewSeizureTable(true, dispatch);


    } catch (error) {
      dispatch(
        toggleSnackbar(
          true,
          { labelName: error.message, labelKey: error.message },
          "error"
        )
      );
      console.log(error);
    }
  }
};

export const searchResultPaymentDetailsApiResponse = async (state, dispatch) => {
  let fromdate = get(
    state.screenConfiguration.preparedFinalObject,
    "paymentdetailReport[0].FromDate", '')

  let Todate = get(
    state.screenConfiguration.preparedFinalObject,
    "paymentdetailReport[0].ToDate", '')

  let paymentStatus = get(
    state.screenConfiguration.preparedFinalObject,
    "paymentdetailReport[0].paymentStatus", ''
  )
  console.log("paymentStatus", paymentStatus)

  let storeItemDateprocess = getTodaysDateInYMD();
  if ((fromdate === undefined || fromdate === '')) {
    dispatch(
      toggleSnackbar(
        true,
        { labelName: "Please fill Date", labelKey: "EC_ERR_FILL_DATE" },
        "warning"
      )
    );
  } else if ((Todate === undefined || Todate === '')) {
    dispatch(
      toggleSnackbar(
        true,
        { labelName: "Please fill Date", labelKey: "EC_ERR_FILL_DATE" },
        "warning"
      )
    );
  }
  else if (fromdate > Todate) {
    dispatch(
      toggleSnackbar(
        true,
        { labelName: "Start Date should be less than End Date", labelKey: "EC_ERR_FILL_FROM_DATE_LESS_THAN_TODATE" }, "warning"
      )
    );
  }
  else if (Todate > storeItemDateprocess) {
    dispatch(
      toggleSnackbar(
        true,
        { labelName: "End Date should be less than Today", labelKey: "EC_ERR_FILL_TODATE_GREATER_DATE" }, "warning"
      )
    );
  }

  else {
    let dataReq = {
      "RequestBody": {
        "tenantId": getTenantId(),
        "reportType": "Payment",
        "fromDate": fromdate,
        "toDate": Todate,
        "paymentStatus": paymentStatus === 'Paid' ? 'PAID' : paymentStatus === 'All' ? '' : paymentStatus === '' ? '' : 'PENDING',
      }
    }
    try {
      let sectorValue = get(state, 'screenConfiguration.preparedFinalObject.applyScreenMdmsData.egec.sector', []);

      const response = await fetchReportData(dataReq)
      let data = [];
      if (response.ResponseBody === null) {
        data = {
          [getTextToLocalMappingPaymentDetail("challanId")]: "-",
          [getTextToLocalMappingPaymentDetail("encroachmentType")]: "-",
          [getTextToLocalMappingPaymentDetail("violationDate")]: "-",
          [getTextToLocalMappingPaymentDetail("siName")]: "-",
          [getTextToLocalMappingPaymentDetail("paymentMode")]: "-",
          [getTextToLocalMappingPaymentDetail("paymentStatus")]: "-",
          [getTextToLocalMappingPaymentDetail("sector")]: "-",
          [getTextToLocalMappingPaymentDetail("paymentAmount")]: "-",
          [getTextToLocalMappingPaymentDetail("violatorName")]: "-",

        }
      } else {

        let PaymentReport = response.ResponseBody;
        PaymentReport.map(function (item, index) {
          let temp = [];
          let __FOUND = sectorValue.find(function (sectorRecord, index) {
            if (sectorRecord.code == item['sector'])
              return true;
          });

          temp[0] = item['challanId'] || "-";
          temp[1] = item['encroachmentType'] || "-";
          temp[2] = truncData(item['violatorName'], 25) || "-";
          temp[3] = item['paymentAmount'].toString() || "-";
          temp[4] = convertEpochToDate(item['violationDate']) || "-";
          temp[5] = item['siName'] || "-";
          temp[6] = item['paymentMode'] || "NA";
          temp[7] = item['challanStatus'] || "NA";
          temp[8] = item['paymentStatus'] === 'PENDING' ? 'UNPAID' : 'PAID' || "-";
          temp[9] = __FOUND.name || "-";
          data.push(temp);
        });

      }
      dispatch(
        handleField(
          "reportPaymentDetails",
          "components.div.children.serachReportPaymentDetailGrid",
          "props.data",
          data
        )
      );
      showHidePaymentDetailsTable(true, dispatch);
      // const objectJsonPath = `components.div.children.searchTextPaymentDetailsreport.children.cardContent.children`;
      // const children = get(
      //   state.screenConfiguration.screenConfig["reportPaymentDetails"],
      //   objectJsonPath,
      //   {}
      // );
      // resetAllFields(children, dispatch, state, 'reportPaymentDetails');
    } catch (error) {
      dispatch(
        toggleSnackbar(
          true,
          { labelName: error.message, labelKey: error.message },
          "error"
        )
      );
      console.log(error);
    }
  }
};
export const searchResultInventoryDetailApiResponse = async (state, dispatch) => {
  let fromdate = get(
    state.screenConfiguration.preparedFinalObject,
    "itemAgingReport[0].FromDate", '')

  let Todate = get(
    state.screenConfiguration.preparedFinalObject,
    "itemAgingReport[0].ToDate", '')

  let timeLine = get(
    state.screenConfiguration.preparedFinalObject,
    "itemAgingReport[0].itemAgeingTimeline", ''
  )
  let itemsAgeFrom, itemsAgeTo;
  if (timeLine === "All") {
    itemsAgeFrom = "All";
    itemsAgeTo = 0;
  }

  if (timeLine === "0-10") {
    itemsAgeFrom = 0;
    itemsAgeTo = 10;
  }
  else if (timeLine === "11-20") {
    itemsAgeFrom = 11;
    itemsAgeTo = 20;
  }
  else if (timeLine === "21-30") {
    itemsAgeFrom = 21;
    itemsAgeTo = 30;
  }
  else if (timeLine === "30-Above") {
    itemsAgeFrom = 30;
    itemsAgeTo = 10000;
  }

  if (itemsAgeFrom != undefined || itemsAgeTo != undefined) {
    let dataReq = {
      "RequestBody": {
        "tenantId": getTenantId(),
        "reportType": "Item Age",
        "fromDate": fromdate,
        "toDate": Todate,
        "itemsAgeFrom": itemsAgeFrom,
        "itemsAgeTo": itemsAgeTo
      }
    }

    try {
      let data = [];
      const response = await fetchReportData(dataReq)
      if (response.ResponseBody === null) {
        data = {
          [getTextToLocalMappingInventoryDetail("challanId")]: "-",
          [getTextToLocalMappingInventoryDetail("itemName")]: "-",
          [getTextToLocalMappingInventoryDetail("itemQuantity")]:
            "-",
          [getTextToLocalMappingInventoryDetail("itemStoreDepositDate")]:
            "-",
          [getTextToLocalMappingInventoryDetail("challanstatus")]:
            "-",
          [getTextToLocalMappingInventoryDetail("age")]:
            "-",
        };
      } else {

        let InventoryReport = response.ResponseBody;
        InventoryReport.map(function (item, index) {
          let temp = [];
          temp[0] = item['challanId'] || "-";
          temp[1] = truncData(item['itemName'], 25) || "-";
          temp[2] = item['itemQuantity'].toString() || "0";
          temp[3] = convertEpochToDate(item['itemStoreDepositDate']) || "-";
          temp[4] = item['challanStatus'] || "-";
          temp[5] = item['age'].toString() || "0";
          data.push(temp);
        });
      }

      dispatch(
        handleField(
          "reportInventoryDetail",
          "components.div.children.serachReportInventoryDetailGrid",
          "props.data",
          data
        )
      );
      showHideInventoryDetailsTable(true, dispatch);
      // const objectJsonPath = `components.div.children.searchTextItemAgingreport.children.cardContent.children`;
      // const children = get(
      //   state.screenConfiguration.screenConfig["reportInventoryDetail"],
      //   objectJsonPath,
      //   {}
      // );
      // resetAllFields(children, dispatch, state, 'reportInventoryDetail');
    } catch (error) {
      dispatch(
        toggleSnackbar(
          true,
          { labelName: error.message, labelKey: error.message },
          "error"
        )
      );
      console.log(error);
    }
  }
  else {
    dispatch(
      toggleSnackbar(
        true,
        { labelName: "select timelime", labelKey: "EC_ERR_INVENTARY_DETAIL_SELECT_TIMELINE" },
        "warning"
      )
    );
  }
};

export const searchResultMisApiResponse = async (action, state, dispatch) => {
  const response = await fetchMISData()

  console.log("res", response)
  try {

    if (response) {
      dispatch(
        handleField(
          "reportMIS",
          "components.div.children.serachReportMisGrid",
          "props.data",
          data
        )
      );
      showHideMisTable(true, dispatch);
    }
  } catch (error) {
    console.log(error);
  }
};

const showHideTable = (booleanHideOrShow, dispatch) => {
  dispatch(
    handleField(
      "search",
      "components.div.children.serachResultGrid",
      "visible",
      booleanHideOrShow
    )
  );
};
const showHideViewSeizureTable = (booleanHideOrShow, dispatch) => {
  dispatch(
    handleField(
      "reportSearchViewSeizure",
      "components.div.children.searchViewSizureReport",
      "visible",
      booleanHideOrShow
    )
  );
};
const showHidePaymentDetailsTable = (booleanHideOrShow, dispatch) => {
  dispatch(
    handleField(
      "reportPaymentDetails",
      "components.div.children.serachReportPaymentDetailGrid",
      "visible",
      booleanHideOrShow
    )
  );
};
const showHideInventoryDetailsTable = (booleanHideOrShow, dispatch) => {
  dispatch(
    handleField(
      "reportInventoryDetail",
      "components.div.children.serachReportInventoryDetailGrid",
      "visible",
      booleanHideOrShow
    )
  );
};
const showHideMisTable = (booleanHideOrShow, dispatch) => {
  dispatch(
    handleField(
      "reportMIS",
      "components.div.children.serachReportMisGrid",
      "visible",
      booleanHideOrShow
    )
  );
};

