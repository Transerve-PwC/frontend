import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTextToLocalMappingVendorDetail, getTextToLocalMappingVendorErrorDetail } from "../../utils";
import { fetchVendorData } from "../../../../../ui-utils/commons";
import store from "ui-redux/store";

export const searchVendorResultApiResponse = async (action, state, dispatch) => {

  const response = await fetchVendorData();
  try {
    console.log("res", response)
    let dataarray = [];
    response.ResponseBody.map(function (item, index) {
      let temp = [];
      temp[0] = item['covNo'];
      temp[1] = item['name'];
      temp[2] = item['fatherSpouseName'];
      temp[3] = item['address'];
      temp[4] = item['contactNumber'];
      temp[5] = item['vendorCategory'];
      temp[6] = item['streetVendorArea'];
      temp[7] = item['transportMode'];
      temp[8] = item['isActive'] === false ? 'No' : 'Yes';
      // temp[8] = item['vendorUuid'];
      dataarray.push(temp);
    });
    // FOR CROSS CHECKING THE DATA WHEN UPLOAD
    let data = response.ResponseBody.map(item => ({
      [getTextToLocalMappingVendorDetail("covNo")]: item['covNo'] || "-",
      [getTextToLocalMappingVendorDetail("name")]: item['name'] || "-",
      [getTextToLocalMappingVendorDetail("fatherSpouseName")]: item['fatherSpouseName'] || "-",
      [getTextToLocalMappingVendorDetail("address")]: item['address'] || "-",
      [getTextToLocalMappingVendorDetail("contactNumber")]: item['contactNumber'] || "-",
      [getTextToLocalMappingVendorDetail("vendorCategory")]: item['vendorCategory'] || "-",
      [getTextToLocalMappingVendorDetail("streetVendorArea")]: item['streetVendorArea'] || "-",
      [getTextToLocalMappingVendorDetail("transportMode")]: item['transportMode'] || "-",
      [getTextToLocalMappingVendorDetail("vendorUuid")]: item['vendorUuid'] || "-",
      [getTextToLocalMappingVendorDetail("isActive")]: item['isActive']=== false ? 'No' : 'Yes' || "-",
    }));
    dispatch(prepareFinalObject('VendorMasterGrid', data));
    dispatch(
      handleField(
        "search",
        "components.div.children.serachVendorResultGrid",
        "props.data",
        dataarray
      )
    );

    showHideVendorTable(true, dispatch);
  }
  catch (error) {
    console.log(error);
  }

};

const showHideVendorTable = (booleanHideOrShow, dispatch) => {
  dispatch(
    handleField(
      "search",
      "components.div.children.serachVendorResultGrid",
      "visible",
      booleanHideOrShow
    )
  );
};

export const searchVendorResultErrorResponse = async (action, state, dispatch, dataerr) => {

  let datasto = localStorage.getItem('VendorMasterErrorGrid');
  var datastorage = JSON.parse(datasto)
  console.log("datastorage", datastorage)
  try {

    let data = datastorage.map(item => ({
      [getTextToLocalMappingVendorErrorDetail("covNo")]: item['covNo'] || "-",
      [getTextToLocalMappingVendorErrorDetail("name")]: item['name'] || "-",
      [getTextToLocalMappingVendorErrorDetail("fatherSpouseName")]: item['fatherSpouseName'] || "-",
      [getTextToLocalMappingVendorErrorDetail("address")]: item['address'] || "-",
      [getTextToLocalMappingVendorErrorDetail("contactNumber")]: item['contactNumber'] || "-",
      [getTextToLocalMappingVendorErrorDetail("vendorCategory")]: item['vendorCategory'] || "-",
      [getTextToLocalMappingVendorErrorDetail("streetVendorArea")]: item['streetVendorArea'] || "-",
      [getTextToLocalMappingVendorErrorDetail("transportMode")]: item['transportMode'] || "-",
      [getTextToLocalMappingVendorErrorDetail("remark")]: item['remark'] || "-",

    }));


    let dataarray = [];
    datastorage.map(function (item, index) {
      let temp = [];
      temp[0] = item['covNo'];
      temp[1] = item['name'];
      temp[2] = item['fatherSpouseName'];
      temp[3] = item['address'];
      temp[4] = item['contactNumber'];
      temp[5] = item['vendorCategory'];
      temp[6] = item['streetVendorArea'];
      temp[7] = item['transportMode'];
      temp[8] = item['remark'];

      dataarray.push(temp);
    });

    store.dispatch(
      handleField(
        "search",
        "components.adhocDialog.children.serachVendorErrorResultGrid",
        "props.data",
        dataarray
      )
    );
    showHideVendorErrorTable(true, store.dispatch);
    // }
  } catch (error) {
    console.log(error);
  }

};

const showHideVendorErrorTable = (booleanHideOrShow, dispatch) => {
  dispatch(
    handleField(
      "search",
      "components.adhocDialog.children.serachVendorErrorResultGrid",
      "visible",
      booleanHideOrShow
    )
  );
};