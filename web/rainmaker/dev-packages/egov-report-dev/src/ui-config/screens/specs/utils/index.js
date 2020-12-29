import { downloadReceiptFromFilestoreID } from "egov-common/ui-utils/commons";
import { getCommonCaption, getCommonCard } from "egov-ui-framework/ui-config/screens/specs/utils";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { validate } from "egov-ui-framework/ui-redux/screen-configuration/utils";
import { getLocaleLabels, getTransformedLocalStorgaeLabels } from "egov-ui-framework/ui-utils/commons";
import { getTenantId, getUserInfo, lSRemoveItem, lSRemoveItemlocal } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import set from "lodash/set";
import { httpRequest } from "../../../../ui-utils/api";

export const getCommonApplyFooter = children => {
  return {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {
      className: "apply-wizard-footer",
      style:{
        width:"100%",       
     }
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

export const downloadAcknowledgementForm = (serviceRequest,mode) => {

    const queryStr = [
      { key: "key", value: "hcServiceRequest" },
      { key: "tenantId", value: "ch" }
    ]
    
    const DOWNLOADRECEIPT = {
      GET: {
        URL: "/pdf-service/v1/_create",
        ACTION: "_get",
      },
    };
    try {
      httpRequest("post", DOWNLOADRECEIPT.GET.URL, DOWNLOADRECEIPT.GET.ACTION, queryStr, { serviceRequest }, { 'Accept': 'application/json' }, { responseType: 'arraybuffer' })
        .then(res => {
          res.filestoreIds[0]
          if (res && res.filestoreIds && res.filestoreIds.length > 0) {
            res.filestoreIds.map(fileStoreId => {
              downloadReceiptFromFilestoreID(fileStoreId,mode)
            })
          } else {
            console.log("Error In Acknowledgement form Download");
          }
        });
    } catch (exception) {
      alert('Some Error Occured while downloading Acknowledgement form!');
    }
  }
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


export const getRequiredDocData = async (action, state, dispatch) => {
  let tenantId =
    process.env.REACT_APP_NAME === "Citizen" ? JSON.parse(getUserInfo()).permanentCity : getTenantId();
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: tenantId,
      moduleDetails: [
        {
          moduleName: "FireNoc",
          masterDetails: [{ name: "Documents" }]
        }
      ]
    }
  };
  try {
    let payload = null;
    payload = await httpRequest(
      "post",
      "/egov-mdms-service/v1/_search",
      "_search",
      [],
      mdmsBody
    );
    dispatch(prepareFinalObject("searchScreenMdmsData", payload.MdmsRes));
  } catch (e) {
    console.log(e);
  }
};

export const getTextToLocalMapping = label => {

  const localisationLabels = getTransformedLocalStorgaeLabels();
  switch (label) {
    case "Service Request Id":
      return getLocaleLabels(
        "Service Request Id",
        "HC_COMMON_TABLE_COL_SERVICE_REQUEST_ID_LABEL",
        localisationLabels
      );
    case "Service Request Date":
      return getLocaleLabels(
        "Service Request Date",
        "HC_COMMON_TABLE_COL_SERVICE_REQUEST_DATE_LABEL",
        localisationLabels
      );
    case "Name Of Owner":
      return getLocaleLabels(
        "Name Of Owner",
        "HC_COMMON_TABLE_COL_OWNER_NAME_LABEL",
        localisationLabels
      );

      case "Type Of Service Request":
        return getLocaleLabels(
          "Type Of Service Request",
          "HC_COMMON_TABLE_COL_SERVICE_TYPE_LABEL",
          localisationLabels
        );

        case "Service Request Status":
        return getLocaleLabels(
          "Service Request Status",
          "HC_COMMON_TABLE_COL_SERVICE_REQUEST_STATUS_LABEL",
          localisationLabels
        );

        case "Search Results for Service Requests":
          return getLocaleLabels(
            "Search Results for Service Requests",
            "HC_SEARCH_RESULTS_FOR_SERVICE_REQUESTS",
            localisationLabels
          );
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