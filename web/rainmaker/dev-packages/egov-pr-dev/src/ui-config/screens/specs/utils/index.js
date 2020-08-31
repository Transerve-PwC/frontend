import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { validate } from "egov-ui-framework/ui-redux/screen-configuration/utils";
import { getUserInfo, getTenantId, getapplicationType, localStorageGet, lSRemoveItem, lSRemoveItemlocal, getapplicationNumber } from "egov-ui-kit/utils/localStorageUtils";
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
import isUndefined from "lodash/isUndefined";
import store from "../../../../ui-redux/store";



import {
  getCommonCard,
  getCommonValue,
  getCommonCaption,
  getPattern
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { sampleGetBill } from "../../../../ui-utils/sampleResponses";
//import RichTextEditor from 'react-rte';

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

export const getTodaysDateInYMD = () => {
  let date = new Date();
  //date = date.valueOf();
  //let month = date.getMonth() + 1;
  let month = date.getMonth() < 10 ? `0${date.getMonth()+1}` : date.getMonth()+1;
  
  let day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  date = `${date.getFullYear()}-${month}-${day}`;
  // date = epochToYmdDate(dsssate);
  return date;
};

export const getStartDateValue = (state) => {
  
//  const state = store.getState();
  console.log(state)
 let startDate= get(state,"screenConfiguration.preparedFinalObject.eventDetails[0].startDate",{});
 
  //startDate=startDate.split(" ")
 // alert(startDate[0])
  
  return startDate[0];
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
export const validateFieldsForGenPress = (
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
  //subjectemail break headeremail EmailContent headersms
  for (var variable in fields) {
    if(variable==="documentsSummary" || variable==="MultipleDocumentDetails" || variable==="subjectemail" || variable==="break" || variable==="headeremail" || variable==="EmailContent" || variable==="headersms")
{
}
else{
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

export const gotoApplyWithStepPressMaster = (state, dispatch, step) => {
 // alert("edit clicked") ;
  // const applicationNumber = getQueryArg(window.location.href, "applicationNumber");
  // const applicationNumberQueryString = applicationNumber ? `&applicationNumber=${applicationNumber}` : ``;
  // const tetantQueryString = applicationNumber ? `&tenantId=${getTenantId()}` : ``;
  // const applicationTpye = getapplicationType();
  // let applyUrl = '';

     const presstId=getQueryArg(window.location.href, "presstId");
  //alert(presstId)
 //  const applicationNumber = getQueryArg(window.location.href, "applicationNumber");
   const applicationNumberQueryString = presstId ? `&presstId=${presstId}` : ``;
   const tetantQueryString = presstId ? `&tenantId=${getTenantId()}` : ``;
//   const applicationTpye = getapplicationType();
   let applyUrl = ''

  /// alert(applicationNumberQueryString)
              
 applyUrl = process.env.REACT_APP_SELF_RUNNING === "true"
    ? `/egov-ui-framework/egov-pr/pressDetailsMasterCreate?step=${step}${applicationNumberQueryString}`
    :
      `/egov-pr/pressDetailsMasterCreate?step=${step}${applicationNumberQueryString}${tetantQueryString}` 
   //   `/egov-pr/apply?step=${step}${applicationNumberQueryString}${tetantQueryString}` 
      


 dispatch(setRoute(applyUrl));


  // dispatch(setRoute(applyUrl));
};
// export const gotoApplyWithStepPressMaster = (state, dispatch, step) => {
  // //alert("edit clicked") ;
  // const presstId=getQueryArg(window.location.href, "presstId");
  // // alert(presstId)
 // //  const applicationNumber = getQueryArg(window.location.href, "applicationNumber");
   // const applicationNumberQueryString = presstId ? `&presstId=${presstId}` : ``;
   // const tetantQueryString = presstId ? `&tenantId=${getTenantId()}` : ``;
// //   const applicationTpye = getapplicationType();
   // let applyUrl = ''

  // /// alert(applicationNumberQueryString)
              
 // applyUrl = process.env.REACT_APP_SELF_RUNNING === "true"
    // ? `/egov-ui-framework/egov-pr/pressDetailsMasterCreate?step=${step}${applicationNumberQueryString}`
    // :
      // `/egov-pr/pressDetailsMasterCreate?step=${step}${applicationNumberQueryString}${tetantQueryString}` 
   // //   `/egov-pr/apply?step=${step}${applicationNumberQueryString}${tetantQueryString}` 
      


 // dispatch(setRoute(applyUrl));
// };
export const gotoApplyWithStep = (state, dispatch, step) => {
  const eventuuId=getQueryArg(window.location.href, "eventuuId");
 // alert(eventuuId)
//  const applicationNumber = getQueryArg(window.location.href, "applicationNumber");
  const applicationNumberQueryString = eventuuId ? `&eventuuId=${eventuuId}` : ``;
  const tetantQueryString = eventuuId ? `&tenantId=${getTenantId()}` : ``;
  const applicationTpye = getapplicationType();
  let applyUrl = '';

  applyUrl = process.env.REACT_APP_SELF_RUNNING === "true"
    ? `/egov-ui-framework/egov-pr/apply?step=${step}${applicationNumberQueryString}`
    :
      `/egov-pr/apply?step=${step}${applicationNumberQueryString}${tetantQueryString}` 
    //   applicationTpye === `SELLMEATNOC` ?
    //     `/egov-pr/applysellmeat?step=${step}${applicationNumberQueryString}${tetantQueryString}` :
    //     applicationTpye === `ROADCUTNOC` ?
    //       `/egov-pr/applyroadcuts?step=${step}${applicationNumberQueryString}${tetantQueryString}` :
    //       applicationTpye === `ADVERTISEMENTNOC` ?
    //         `/egov-pr/advertisementApply?step=${step}${applicationNumberQueryString}${tetantQueryString}` : ``
    // ;



  dispatch(setRoute(applyUrl));
};



export const gotoApplyWithStepPressNote = (state, dispatch, step) => {
  const pressnoteuuId=getQueryArg(window.location.href, "pressnoteuuId");
 // alert(eventuuId)
//  const applicationNumber = getQueryArg(window.location.href, "applicationNumber");
  const applicationNumberQueryString = pressnoteuuId ? `&pressnoteuuId=${pressnoteuuId}` : ``;
  const tetantQueryString = pressnoteuuId ? `&tenantId=${getTenantId()}` : ``;
  const applicationTpye = getapplicationType();
  let applyUrl = '';

  applyUrl = process.env.REACT_APP_SELF_RUNNING === "true"
    ? `/egov-ui-framework/egov-pr/apply?step=${step}${applicationNumberQueryString}`
    :
      `/egov-pr/generatepressNote?step=${step}${applicationNumberQueryString}${tetantQueryString}` 
    //   applicationTpye === `SELLMEATNOC` ?
    //     `/egov-pr/applysellmeat?step=${step}${applicationNumberQueryString}${tetantQueryString}` :
    //     applicationTpye === `ROADCUTNOC` ?
    //       `/egov-pr/applyroadcuts?step=${step}${applicationNumberQueryString}${tetantQueryString}` :
    //       applicationTpye === `ADVERTISEMENTNOC` ?
    //         `/egov-pr/advertisementApply?step=${step}${applicationNumberQueryString}${tetantQueryString}` : ``
    // ;



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

export const getDetailsForOwner = async (state, dispatch, fieldInfo) => {
  try {
    const cardIndex = fieldInfo && fieldInfo.index ? fieldInfo.index : "0";
    const ownerNo = get(
      state.screenConfiguration.preparedFinalObject,
      `PublicRelations[0].PublicRelationDetails.applicantDetails.owners[${cardIndex}].mobileNumber`,
      ""
    );
    if (!ownerNo.match(getPattern("MobileNo"))) {
      dispatch(
        toggleSnackbar(
          true,
          {
            labelName: "Incorrect Number!",
            labelKey: "ERR_MOBILE_NUMBER_INCORRECT"
          },
          "error"
        )
      );
      return;
    }
    const owners = get(
      state.screenConfiguration.preparedFinalObject,
      `PublicRelations[0].PublicRelationDetails.applicantDetails.owners`,
      []
    );
    //owners from search call before modification.
    const oldOwnersArr = get(
      state.screenConfiguration.preparedFinalObject,
      "PublicRelations[0].PublicRelationDetails.applicantDetails.owners",
      []
    );
    //Same no search on Same index
    if (ownerNo === owners[cardIndex].userName) {
      dispatch(
        toggleSnackbar(
          true,
          {
            labelName: "Owner has been added already!",
            labelKey: "ERR_OWNER_ALREADY_ADDED_TOGGLE_MSG"
          },
          "error"
        )
      );
      return;
    }

    //Same no search in whole array
    const matchingOwnerIndex = owners.findIndex(
      item => item.userName === ownerNo
    );
    if (matchingOwnerIndex > -1) {
      if (
        !isUndefined(owners[matchingOwnerIndex].userActive) &&
        owners[matchingOwnerIndex].userActive === false
      ) {
        //rearrange
        dispatch(
          prepareFinalObject(
            `PublicRelations[0].PublicRelationDetails.applicantDetails.owners[${matchingOwnerIndex}].userActive`,
            true
          )
        );
        dispatch(
          prepareFinalObject(
            `PublicRelations[0].PublicRelationDetails.applicantDetails.owners[${cardIndex}].userActive`,
            false
          )
        );
        //Delete if current card was not part of oldOwners array - no need to save.
        if (
          oldOwnersArr.findIndex(
            item => owners[cardIndex].userName === item.userName
          ) == -1
        ) {
          owners.splice(cardIndex, 1);
          dispatch(
            prepareFinalObject(
              `PublicRelations[0].PublicRelationDetails.applicantDetails.owners`,
              owners
            )
          );
        }
      } else {
        dispatch(
          toggleSnackbar(
            true,
            {
              labelName: "Owner already added!",
              labelKey: "ERR_OWNER_ALREADY_ADDED_1"
            },
            "error"
          )
        );
      }
      return;
    } else {
      //New number search only
      let payload = await httpRequest(
        "post",
        "/user/_search?tenantId=pb",
        "_search",
        [],
        {
          tenantId: "pb",
          userName: `${ownerNo}`
        }
      );
      if (payload && payload.user && payload.user.hasOwnProperty("length")) {
        if (payload.user.length === 0) {
          dispatch(
            toggleSnackbar(
              true,
              {
                labelName: "This mobile number is not registered!",
                labelKey: "ERR_MOBILE_NUMBER_NOT_REGISTERED"
              },
              "info"
            )
          );
        } else {
          const userInfo =
            payload.user &&
            payload.user[0] &&
            JSON.parse(JSON.stringify(payload.user[0]));
          if (userInfo && userInfo.createdDate) {
            userInfo.createdDate = convertDateTimeToEpoch(userInfo.createdDate);
            userInfo.lastModifiedDate = convertDateTimeToEpoch(
              userInfo.lastModifiedDate
            );
            userInfo.pwdExpiryDate = convertDateTimeToEpoch(
              userInfo.pwdExpiryDate
            );
          }
          let currOwnersArr = get(
            state.screenConfiguration.preparedFinalObject,
            "PublicRelations[0].PublicRelationDetails.applicantDetails.owners",
            []
          );

          currOwnersArr[cardIndex] = userInfo;
          // if (oldOwnersArr.length > 0) {
          //   currOwnersArr.push({
          //     ...oldOwnersArr[cardIndex],
          //     userActive: false
          //   });
          // }
          dispatch(
            prepareFinalObject(
              `PublicRelations[0].PublicRelationDetails.applicantDetails.owners`,
              currOwnersArr
            )
          );
        }
      }
    }
  } catch (e) {
    dispatch(
      toggleSnackbar(
        true,
        { labelName: e.message, labelKey: e.message },
        "info"
      )
    );
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
      { key: "businessService", value: localStorageGet("modulecode") }
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
            "tenantId": getTenantId()
          },
          "applicationNumber": applicationNumber,
          "tenantId": getTenantId()
        }
      ]
    };

    // Get Receipt
    let payload = await httpRequest(
      "post",
      "/pr-calculator/v1/_calculate",
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
            "applicationType": getapplicationType(),  //"PRSCP",
            "owners": [userInfo],
            "tenantId": getTenantId(),
          },
          "applicationNumber": applicationNumber,
          "tenantId": getTenantId()
        }
      ]
    };

    // Get Receipt
    let payload = await httpRequest(
      "post",
      "/pr-calculator/v1/_calculate",
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
        { key: "businessService", value: localStorageGet("modulecode") }
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

export const getRequiredDocData = async (action, state, dispatch) => {
  let tenantId =
    process.env.REACT_APP_NAME === "Citizen" ? JSON.parse(getUserInfo()).permanentCity : getTenantId();
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: tenantId,
      moduleDetails: [
        {
          moduleName: "PublicRelation",
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
   

    case "PR_CREATEDON":
    return getLocaleLabels(
      "PR_CREATEDON",
      "PR_CREATEDON",
      localisationLabels
    );
    case "PR_CREATORNAME":
    return getLocaleLabels(
      "PR_CREATORNAME",
      "PR_CREATORNAME",
      localisationLabels
    );
    case "PR_TOTALCOMMITTEEMEMBER":
    return getLocaleLabels(
      "PR_TOTALCOMMITTEEMEMBER",
      "PR_TOTALCOMMITTEEMEMBER",
      localisationLabels
    );


    case "Month":
    return getLocaleLabels(
      "Month",
      "REPORT_MONTH",
      localisationLabels
    );
    case "tenderNoticeStatus":
    return getLocaleLabels(
      "tenderNoticeStatus",
      "TENDER_STATUS",
      localisationLabels
    );
    case "select Employee":
    return getLocaleLabels(
      "select Employee",
      "select Employee",
      localisationLabels
    );
    case "Designation":
    return getLocaleLabels(
      "Designation",
      "Designation",
      localisationLabels
    );
    case "Aggregate By Event Type":
    return getLocaleLabels(
      "Aggregate By Event Type",
      "PR_AGGREGATE_BY_EVENT_TYPE",
      localisationLabels
    );
    case "Aggregate By Department":
    return getLocaleLabels(
      "Aggregate By Department",
      "PR_AGGREGATE_BY_DEPARTMENT",
      localisationLabels
    );

  case "Year":
    return getLocaleLabels(
      "Year",
      "Year",
      localisationLabels
    );
  case "New Events":
    return getLocaleLabels(
      "New Events",
      "PR_NEW_EVENTS",
      localisationLabels
    );
  case "Ongoing Events":
    return getLocaleLabels(
      "Ongoing Events",
      "PR_ONGOING_EVENTS",
      localisationLabels
    );
  case "Closed Events":
    return getLocaleLabels(
      "Closed Events",
      "PR_CLOSED_EVENTS",
      localisationLabels
    );
  case "Archived Events":
    return getLocaleLabels(
      "Archived Events",
      "PR_ARCHIVED_EVENTS",
      localisationLabels
    );
    case "Archived":
    return getLocaleLabels(
      "Archived",
      "Archived",
      localisationLabels
    );
  case "Number Events":
    return getLocaleLabels(
      "Number Events",
      "PR_NUMBER_EVENTS",
      localisationLabels
    );
  case "Locality Name":
    return getLocaleLabels(
      "Locality Name",
      "PR_LOCALITY_NAME",
      localisationLabels
    );
  case "Department Name":
    return getLocaleLabels(
      "Department Name",
      "PR_DEPARTMENT_NAME",
      localisationLabels
    );
    case "Number Uploads":
    return getLocaleLabels(
      "Number Uploads",
      "PR_NUMBER_UPLOADS",
      localisationLabels
    );
    case "Press Id":
    return getLocaleLabels(
      "Press Id",
      "Press Id",
      localisationLabels
    );
    case "Tender Notice ID":
    return getLocaleLabels(
      "Tender Notice ID",
      "Tender Notice ID",
      localisationLabels
    );
	case "Guest ID":
    return getLocaleLabels(
      "Guest ID",
      "Guest ID",
      localisationLabels
    );
	case "Guest Action":
    return getLocaleLabels(
      "Guest Action",
      "Guest Action",
      localisationLabels
    );
    case "Subject":
    return getLocaleLabels(
      "Subject",
      "Subject",
      localisationLabels
    );
    case "Date":
    return getLocaleLabels(
      "Date",
      "Date",
      localisationLabels
    );
    case "File Number":
    return getLocaleLabels(
      "File Number",
      "File Number",
      localisationLabels
    );


    case "Tender Notice Id":
    return getLocaleLabels(
      "Tender Notice Id",
      "Tender Notice Id",
      localisationLabels
    );
    case "Department User":
    return getLocaleLabels(
      "Department User",
      "Department User",
      localisationLabels
    );
    case "Publication Name":
    return getLocaleLabels(
      "Publication Name",
      "Publication Name",
      localisationLabels
    );


    case "Size of Publication":
    return getLocaleLabels(
      "Size of Publication",
      "Size of Publication",
      localisationLabels
    );



 case "Type of the Press":
      return getLocaleLabels(
        "Type of the Press",
        "Type of the Press",
        localisationLabels
      )
      case "Mobile Number":
        return getLocaleLabels(
          "Mobile Number",
          "Mobile Number",
          localisationLabels
        )
        case "Press master UUID":
        return getLocaleLabels(
          "Press master UUID",
          "Press master UUID",
          localisationLabels
        )  





    case "Email ID":
    return getLocaleLabels(
      "Email ID",
      "Email ID",
      localisationLabels
    );
    case "Employee Name":
    return getLocaleLabels(
      "Employee Name",
      "Employee Name",
      localisationLabels
    );
    case "Department":
    return getLocaleLabels(
      "Department",
      "Department",
      localisationLabels
    );
    case "Guest Type":
      return getLocaleLabels(
        "Guest Type",
        "Guest Type",
        localisationLabels
      );
	case "Guest Name":
      return getLocaleLabels(
        "Guest Name",
        "Guest Name",
        localisationLabels
      );  
	 case "Guest Email":
      return getLocaleLabels(
        "Guest Email",
        "Guest Email",
        localisationLabels
      );   
	  case "Guest Mobile Number":
      return getLocaleLabels(
        "Guest Mobile Number",
        "Guest Mobile Number",
        localisationLabels
      );  
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

    // case "Status":
    //   return getLocaleLabels(
    //     "Status",
    //     "NOC_COMMON_TABLE_COL_STATUS_LABEL",
    //     localisationLabels
    //   );

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
     
//event

case "Event UUID":
return getLocaleLabels(
  "Event_UUID",
  "eventDetailUuid",
  localisationLabels
);
case "Event Id":
return getLocaleLabels(
  "Event_Id",
  "PR_EVENTID",
  localisationLabels
);
case "Committee":
return getLocaleLabels(
  "Committee",
  "Committee",
  localisationLabels
);
case "Budget":
return getLocaleLabels(
  "Budget",
  "PR_BUDGET",
  localisationLabels
);
case "Event Title":
return getLocaleLabels(
  "Event_Titled",
  "PR_EVENTTITLE",
  localisationLabels
);
case "Organizer Department":
return getLocaleLabels(
  "Organizer_Department",
  "PR_ORGANIZER",
  localisationLabels
);
case "Organizer Employee":
return getLocaleLabels(
  "Organizer_Employee",
  "PR_ORGANIZER_EMPLOYEE",
  localisationLabels
);

case "Date & Time":
return getLocaleLabels(
  "Date_Time",
  "PR_DATETIME",
  localisationLabels
);
case "Commitiee":
return getLocaleLabels(
  "Commitiee",
  "committeeUuid",
  localisationLabels
);
case "Budjet":
return getLocaleLabels(
  "Budjet",
  "eventBudget",
  localisationLabels
);
case "Schedule Status":
return getLocaleLabels(
  "Schedule Status",
  "PR_SCHEDULE STATUS",
  localisationLabels
);
case "Event Status":
return getLocaleLabels(
  "Event_Status",
  "PR_EVENTSTATUS",
  localisationLabels
);


case "Committee Id":
return getLocaleLabels(
  "Committee Id",
  "Committee Id",
  localisationLabels
);
case "Committee Name":
return getLocaleLabels(
  "Committee Name",
  "Committee Name",
  localisationLabels
);







// master press details
case "Name":
return getLocaleLabels(
  "Name",
  "Name",
  localisationLabels
);
case "Personnel Name":
return getLocaleLabels(
  "Personnel Name",
  "PR_PERSONNELNAME",
  localisationLabels
);



case "Publication name":
return getLocaleLabels(
  "Publication_name",
  "PR_PUBLICATIONNAME",
  localisationLabels
);

case "Type of the press":
return getLocaleLabels(
  "Type_of_the_press",
  "PR_TYPEOFTHEPRESS",
  localisationLabels
);


case "Email Id":
return getLocaleLabels(
  "Email_Id",
  "PR_EMAILID",
  localisationLabels
);

case "Mobile No":
return getLocaleLabels(
  "Mobile_No",
  "PR_MOBILE_NO",
  localisationLabels
);



case "Guest Name":
return getLocaleLabels(
  "Guest Name",
  "Guest Name",
  localisationLabels
);
case "Email":
return getLocaleLabels(
  "Email",
  "Email",
  localisationLabels
);
case "Contact No.":
return getLocaleLabels(
  "Contact No.",
  "Contact No.",
  localisationLabels
);

case "Department Id":
return getLocaleLabels(
  "Department Id",
  "Department Id",
  localisationLabels
);
case "Employee ID":
return getLocaleLabels(
  "Employee ID",
  "Employee ID",
  localisationLabels
);













    case "INITIATED":
      return getLocaleLabels("Initiated,", "NOC_INITIATED", localisationLabels);
    case "APPLIED":
      getLocaleLabels("Applied", "NOC_APPLIED", localisationLabels);
    case "PAID":
      getLocaleLabels("Paid", "WF_NEWTL_PENDINGAPPROVAL", localisationLabels);

    case "APPROVED":
      return getLocaleLabels("Approved", "NOC_APPROVED", localisationLabels);
    case "REJECTED":
      return getLocaleLabels("Rejected", "NOC_REJECTED", localisationLabels);
    case "CANCELLED":
      return getLocaleLabels("Cancelled", "NOC_CANCELLED", localisationLabels);
    case "PENDINGAPPROVAL ":
      return getLocaleLabels(
        "Pending for Approval",
        "WF_PublicRelation_PENDINGAPPROVAL",
        localisationLabels
      );
    case "PENDINGPAYMENT":
      return getLocaleLabels(
        "Pending payment",
        "WF_PublicRelation_PENDINGPAYMENT",
        localisationLabels
      );
    case "DOCUMENTVERIFY":
      return getLocaleLabels(
        "Pending for Document Verification",
        "WF_PublicRelation_DOCUMENTVERIFY",
        localisationLabels
      );
    case "FIELDINSPECTION":
      return getLocaleLabels(
        "Pending for Field Inspection",
        "WF_PublicRelation_FIELDINSPECTION",
        localisationLabels
      );

    case "Search Results for PUBLIC-RELATIONS Applications":
      return getLocaleLabels(
        "Search Results for PUBLIC-RELATIONS Applications",
        "NOC_HOME_SEARCH_RESULTS_TABLE_HEADING",
        localisationLabels
      );

    case "MY_APPLICATIONS":
      return getLocaleLabels(
        "My Applications",
        "TL_MY_APPLICATIONS",
        localisationLabels
      );
  }
};

/*
export const showHideAdhocPopupopms = (state, dispatch, screenKey,type) => {
  
  localStorage.setItem('updateNocType',type)
 // //alert(  localStorage.getItem('updateNocType')+type)
   // set(
        //   state,
        //   "screenConfig.components.adhocDialog.children.popup",
        //   adhocPopup2
        // );
   ////alert(JSON.stringify( state.screenConfiguration.screenConfig[screenKey]))
   
   setTimeout(function(){ 
    let toggle = get(
      state.screenConfiguration.screenConfig[screenKey],
      "components.adhocDialog.props.open",
      false
    );
    dispatch(
      handleField(screenKey, "components.adhocDialog", "props.open", !toggle)
    ); 

    }, 500);
  
 };

*/

export const showHideAdhocPopupopmsReject = (state, dispatch, screenKey, type) => {

  setTimeout(function () {
   if(type == "press" || type == "PRESS")
   {
		let toggle = get(
		  state.screenConfiguration.screenConfig[screenKey],
		  "components.adhocDialogpress.props.open",
		  false
		);
		dispatch(
		  handleField(screenKey, "components.adhocDialogpress", "props.open", !toggle)
		);
	}
	else if(type == "external")
   {
		let toggle = get(
		  state.screenConfiguration.screenConfig[screenKey],
		  "components.adhocDialogexternal.props.open",
		  false
		);
		console.log("togglllllllllllllleeeeeeeee");
		console.log(toggle);
		dispatch(
		  handleField(screenKey, "components.adhocDialogexternal", "props.open", !toggle)
		);
  }
  else if(type == "pressMaster")
  {
   let toggle = get(
     state.screenConfiguration.screenConfig[screenKey],
     "components.adhocDialog.props.open",
     false
   );
   console.log("togglllllllllllllleeeeeeeee");
   console.log(toggle);
   dispatch(
     handleField(screenKey, "components.adhocDialog", "props.open", !toggle)
   );
 }
	else
   {
		let toggle = get(
		  state.screenConfiguration.screenConfig[screenKey],
		  "components.adhocDialoginternal.props.open",
		  false
		);
		dispatch(
		  handleField(screenKey, "components.adhocDialoginternal", "props.open", !toggle)
		);
	}
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
      { key: "tenantId", value: getTenantId() },
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
            "tenantId": getTenantId()
          },
          "applicationNumber": getapplicationNumber(),
          "tenantId": getTenantId(),
        }
      ]
    };
    
    // Get Receipt
    let payload = await httpRequest("post", "/pr-calculator/v1/_calculate", "",
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


export const gotoApplyWithTender = (state, dispatch, step) => {
 // alert("edit clicked") ;

let tenderNoticeUuid= getQueryArg(window.location.href, "tenderuuId")
let tenderNoticeId= getQueryArg(window.location.href, "tenderId")
 // const applicationNumber=getQueryArg(window.location.href, "applicationNumber");
 // alert(eventuuId)
//  const applicationNumber = getQueryArg(window.location.href, "applicationNumber");
  const applicationNumberQueryString = tenderNoticeId ? `&tenderId=${tenderNoticeId}` : ``;
  const applicationNumberQueryStringuuid = tenderNoticeUuid ? `&tenderUuId=${tenderNoticeUuid}` : ``;
  
  //const tetantQueryString = applicationNumber ? `&tenantId=${getTenantId()}` : ``;
 // const applicationTpye = getapplicationType();
  let applyUrl = '';

  applyUrl = process.env.REACT_APP_SELF_RUNNING === "true"
    ? `/egov-ui-framework/egov-pr/pressDetailsMasterCreate?${applicationNumberQueryString}${applicationNumberQueryStringuuid}`
    :
      `/egov-pr/tenderMaster?${applicationNumberQueryString}${applicationNumberQueryStringuuid}` 

   dispatch(setRoute(applyUrl));
};



export const getfullwidthLabelWithValue = (label, value, props = {}) => {
  return {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    gridDefination: {
      xs: 12,
      sm: 12
    },
    props: {
      style: {
        wordBreak : "break-word",
		border : "1px solid #000",
		padding : "10px",
		width : "100%"
      },
      ...props
    },
    children: {
      label: getCommonCaption(label),
      value: getCommonValue(value)
    }
  };
};

export const getsocialmediaLabelWithValue = (label, value, props = {}) => {
  return {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    gridDefination: {
      xs: 12,
      sm: 12
    },
    props: {
      style: {
        wordBreak : "break-word",
		paddingRight : "20px",
		width : "100%",
		cursor: "pointer"
      },
      ...props
    },
    children: {
      label: getCommonCaption(label),
      value: getCommonValue(value)
    }
  };
};

export const gotoApplyWithStepCommitteeMaster = (state, dispatch, step) => {
  
  const CommitteeId=getQueryArg(window.location.href, "committeeUUID");
  
   const applicationNumberQueryString = CommitteeId ? `&committeeUUID=${CommitteeId}` : ``;
   const tetantQueryString = CommitteeId ? `&tenantId=${getTenantId()}` : ``;
   let applyUrl = ''

              
 applyUrl = process.env.REACT_APP_SELF_RUNNING === "true"
    ? `/egov-ui-framework/egov-opms/pressDetailsMasterCreate?step=${step}${applicationNumberQueryString}`
    :
      `/egov-pr/createCommitteeMaster?step=${step}${applicationNumberQueryString}${tetantQueryString}` 
      


 dispatch(setRoute(applyUrl));
};


export const getCommonValuewithlink = (value) => {
  return <a href="value"> value</a>;
};
