import get from "lodash/get";
import find from "lodash/find";
import {
  handleScreenConfigurationFieldChange as handleField,
  toggleSnackbar,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getmiscellaneousreceiptnotesSearchResults } from "../../../../../ui-utils/storecommonsapi";
import { getTextToLocalMapping } from "./searchResults";
import { convertEpochToDate, convertDateToEpoch } from "../../utils/index";
import { validateFields } from "../../utils";
import { ReceiptType } from "../../../../../ui-utils/sampleResponses";
import { getTenantId,getOPMSTenantId } from "egov-ui-kit/utils/localStorageUtils";

export const getDeptName = (state, codes) => {
  let deptMdmsData = get(
    state.screenConfiguration.preparedFinalObject,
    "searchScreenMdmsData.common-masters.Department",
    []
  );
  let codeNames = codes.map((code) => {
    return get(find(deptMdmsData, { code: code }), "name", "");
  });
  return codeNames.join();
};

export const getDesigName = (state, codes) => {
  let desigMdmsData = get(
    state.screenConfiguration.preparedFinalObject,
    "searchScreenMdmsData.common-masters.Designation",
    []
  );
  let codeNames = codes.map((code) => {
    return get(find(desigMdmsData, { code: code }), "name", "");
  });
  return codeNames.join();
};

export const searchApiCall = async (state, dispatch) => {
  let { localisationLabels } = state.app || {};
  showHideTable(false, dispatch);
  const tenantId =
    get(state.screenConfiguration.preparedFinalObject, "searchScreen.ulb") ||
    getTenantId();
  let queryObject = [
    {
      key: "tenantId",
      value: tenantId,
    },
    // add default receiptType(remove from UI if exist) hard code in search query string
    {
      key: "receiptType",
      value: ReceiptType().StoreReceiptType.MISCELLANEOUS_RECEIPT_TYPE
    }
  ];
  let searchScreenObject = get(
    state.screenConfiguration.preparedFinalObject,
    "searchScreen",
    {}
  );
  const isSearchFormValid = validateFields(
    "components.div.children.searchForm.children.cardContent.children.searchFormContainer.children",
    state,
    dispatch,
    "search-material-receipt-misc"
  );

  if (!isSearchFormValid) {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Please fill valid fields to start search",
          labelKey: "ERR_FILL_VALID_FIELDS",
        },
        "warning"
      )
    );
  } else if (
    Object.keys(searchScreenObject).length == 0 ||
    Object.values(searchScreenObject).every(x => x === "")
  ) {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Please fill at least one field to start search",
          labelKey: "ERR_FILL_ONE_FIELDS",
        },
        "warning"
      )
    );
  } else {
    // Add selected search fields to queryobject
    for (var key in searchScreenObject) {
      if (
        searchScreenObject.hasOwnProperty(key) &&
        searchScreenObject[key].trim() !== ""
      ) {

        if (key === "receiptDate") {
          let  Dateselect = true;
           queryObject.push({
             key: key,
             value: convertDateToEpoch(searchScreenObject[key])
           });
         } 
         else
                 queryObject.push({ key: key, value: searchScreenObject[key].trim() });
      }
    }
    let response = await getmiscellaneousreceiptnotesSearchResults(queryObject, dispatch);
    try {

      if(response.MaterialReceipt.length===0)
      {
        dispatch(
              toggleSnackbar(
                true,
                { labelName: "No Records found for Input parameter", labelKey: "STORE_NO_RECORDS_FOUND" },
                "warning"
              )
            );
           
      }
      else{
      let data = response.MaterialReceipt.map((item) => {
       

        return {
          [getTextToLocalMapping("Material Receipt Number")]: get(item, "mrnNumber", "-") || "-",
          [getTextToLocalMapping("Store Name")]:  get(item, "receivingStore.code", "-") || "-", 
         [getTextToLocalMapping("Receipt Type")]: get(item, "receiptType", "-") || "-", 
        //  [getTextToLocalMapping("Indent Purpose")]: get(item, "indentPurpose", "-") || "-",  
          [getTextToLocalMapping("Status")]: get(item, "mrnStatus", "-") || "-",  
          id: item.id,       
         
        };
      });

      dispatch(
        handleField(
          "search-material-receipt-misc",
          "components.div.children.searchResults",
          "props.data",
          data
        )
      );
      dispatch(
        handleField(
          "search-material-receipt-misc",
          "components.div.children.searchResults",
          "props.title",
          `${getTextToLocalMapping("Search Results for Non-Indent Material Issue Note")} (${
            response.MaterialReceipt.length
          })`
        )
      );
      showHideTable(true, dispatch);
        }
    } catch (error) {
      dispatch(
        toggleSnackbar(
          true,
          { labelName: "Unable to parse search results!" },
          "error"
        )
      );
    }
  }
};

const showHideTable = (booleanHideOrShow, dispatch) => {
  dispatch(
    handleField(
      "search-material-receipt-misc",
      "components.div.children.searchResults",
      "visible",
      booleanHideOrShow
    )
  );
};
