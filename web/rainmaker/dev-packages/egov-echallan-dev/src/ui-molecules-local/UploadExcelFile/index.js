import React, { Component } from "react";
//import React from 'react'
import * as XLSX from "xlsx";
import store from "ui-redux/store";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject,
  toggleSnackbar,
  toggleSpinner
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTenantId, lSRemoveItem, lSRemoveItemlocal } from "egov-ui-kit/utils/localStorageUtils";
import "./index.css";
import { createVendorDetails } from "../../ui-utils/commons";
import { searchVendorResultErrorResponse } from "../../ui-config/screens/specs/egov-echallan-vendor-master/searchResource/searchResultApiResponse";

class UploadExcelFile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // file: null
      file: [],
      errordata: [],
      isuploaded: false
    };
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.fileUpload = this.fileUpload.bind(this);
  }
  onFormSubmit(e) {
    e.preventDefault(); // Stop form submit  
    setTimeout(() => store.dispatch(toggleSpinner()), 7000);

    if (this.state.isuploaded) {
      this.setState({ isuploaded: false });
      if (this.state.file.length > 0) {
        // lSRemoveItem('eChallanMasterGrid');
        // lSRemoveItemlocal('eChallanMasterGrid');
        this.fileUpload(this.state.file).then(response => {
          store.dispatch(toggleSnackbar(
            true, { labelName: "Excel uploaded successfully!", labelKey: "" },
            "success")); //EC_EXCEL_UPLOADED_SUCCESS_TOASTER   

          if (this.state.errordata.length > 0) {
            setTimeout(() => store.dispatch(toggleSnackbar(
              true,
              {
                labelName: "File contains few records with error which are not uploaded.",
                labelKey: ""
              },
              "error"
            )), 3000);
            setTimeout(() => window.location.reload(), 4000);
          } else {
            setTimeout(() => window.location.reload(), 2000);
          }
          store.dispatch(toggleSpinner());

        });
      } else {
        store.dispatch(toggleSnackbar(
          true,
          {
            labelName: "Please choose file!",
            labelKey: "EC_EXCEL_CHOOSE_FILE_TOASTER"
          },
          "warning"
        ));
        store.dispatch(toggleSpinner());
      }
    } else {
      store.dispatch(toggleSnackbar(
        true,
        {
          labelName: "Please choose file!",
          labelKey: "EC_EXCEL_CHOOSE_FILE_TOASTER"
        },
        "warning"
      ));
      store.dispatch(toggleSpinner());
    }
  }

  onChange(e) {
    let files = e.target.files;
    if (files[0].name.split('.')[1] === ('xlsx' || 'xls')) {
      store.dispatch(toggleSpinner());
      var f = files[0];
      let reader = new FileReader();
      reader.onload = e => {
        // evt = on_file_select event
        /* Parse data */

        const bstr = e.target.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        /* Get first worksheet */
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        /* Convert array of arrays */
        const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
        //console.log("data", data);
        lSRemoveItem('eChallanMasterGrid');
        lSRemoveItemlocal('eChallanMasterGrid');
        let getData = [];
        let getErrorData = [];
        let headerFlag = false;

        //data.forEach(element => {

        if (
          data[1][0] === "Sr. No." &&
          data[1][1] === "Pass No." &&
          data[1][2] === "COV No" &&
          data[1][3] === "Name" &&
          data[1][4] === "Father's Name/Spouse Name" &&
          data[1][5] === "Residential Address" &&
          data[1][6] === "Mobile Number" &&
          data[1][7] === "Category of Vendor" &&
          data[1][8] === "Area of Street Vending Sector/Village" &&
          data[1][9] === "Mode of Transport (Cycle/Rikshaw/Cutomised Rikshaw)" &&
          data[1][10] === "Active (Yes/No)"

        ) {
          headerFlag = true;
        }
        //});

        let message = "";
        let splicedata = data
        splicedata.splice(0, 2);
        if (headerFlag) {

          splicedata.forEach(element => {
            if (element.length > 0) {
              message = "";
              if (
                element[0] >= 1 &&
                element[2] !== undefined &&
                element[3] !== undefined &&
                element[4] !== undefined &&
                element[5] !== undefined &&
                element[6] !== undefined
              ) {
                message = "";
              }
              if (element[2] === undefined || element[2] === "") {
                message += "COV number is not present, ";
              }
              if (element[3] === undefined || element[3] === "") {
                message += "Name is not present, ";
              }
              if (element[4] === undefined || element[4] === "") {
                message += "Father / Spouse  is not present, ";
              } //element[0] >= 1 && 
              if (element[5] === undefined || element[5] === "") {
                message += "Address is not present, ";
              }
              if (element[6] === undefined || element[6] === "") {
                message += "Mobile / Contact Number is not present, ";
              }

              if (message.toString().trim() === "" && headerFlag) {
                if (element[2] !== "") {
                  let activestatus = (element[10] === 'No' ||element[10] === 'nO' || element[10] === 'no' || element[10] === 'NO') ? false : true;
                  let data_process = {
                    passNo: element[1],
                    covNo: element[2],
                    name: element[3],
                    fatherSpouseName: element[4] || "-",
                    address: element[5],
                    contactNumber: element[6],
                    vendorCategory: element[7] || "-",
                    streetVendorArea: element[8] || "-",
                    transportMode: element[9] || "-",
                    isActive: activestatus,
                    tenantId: getTenantId(),
                    vendorUuid: '',
                  };
                  getData.push(data_process);
                }

              }
              else {
                let data_process = {
                  passNo: element[1] || " ",
                  covNo: element[2] || " ",
                  name: element[3] || " ",
                  fatherSpouseName: element[4] || "-",
                  address: element[5] || "-",
                  contactNumber: element[6] || "-",
                  vendorCategory: element[7] || "-",
                  streetVendorArea: element[8] || "-",
                  transportMode: element[9] || "-",
                  isActive: element[10] || "-",
                  remark: message
                };
                getErrorData.push(data_process);
              }
            }
          });

        } else {
          store.dispatch(toggleSnackbar(
            true,
            {
              labelName: "Please provide valid file!",
              labelKey: "EC_EXCEL_PROVIDE_VALID_FILE_TOASTER"
            },
            "warning"
          ));
        }

        localStorage.setItem('VendorMasterErrorGrid', JSON.stringify(getErrorData));
        const state = store.getState();
        searchVendorResultErrorResponse('', state, store.dispatch);

        let stated = store.getState();
        let insertedVendorList = [];
        let updatedVendorList = [];
        let existingRecords = stated.screenConfiguration.preparedFinalObject.VendorMasterGrid;
        getData.forEach(rec => {
          existingRecords.find(function (existingRecord, index) {

            if (rec["covNo"].toString().trim() === existingRecord["COV Number"].toString().trim()) {

              rec["vendorUuid"] = existingRecord["Vendor Id"]
              updatedVendorList.push(rec);
            }
          });
        });

        getData.find(function (rec, index) {
          if (rec["vendorUuid"] === '') {
            insertedVendorList.push(rec);
          }
        });

        const uniqueVendor = [];
        const map = new Map();
        for (const item of insertedVendorList) {
          if (!map.has(item.covNo)) {
            map.set(item.covNo, true);    // set any value to Map
            uniqueVendor.push({
              fatherSpouseName: item.fatherSpouseName,
              address: item.address,
              contactNumber: item.contactNumber,
              covNo: item.covNo,
              isActive: item.isActive,
              name: item.name,
              passNo: item.passNo,
              streetVendorArea: item.streetVendorArea,
              tenantId: item.tenantId,
              transportMode: item.transportMode,
              vendorCategory: item.vendorCategory,
              vendorUuid: item.vendorUuid,
            });
          }
        }

        this.setState({ fileInsert: uniqueVendor });
        this.setState({ fileUpdate: updatedVendorList });

        this.setState({ file: getData });
        this.setState({ errordata: getErrorData });
        this.setState({ isuploaded: true });
      };
      store.dispatch(toggleSpinner());
      reader.readAsBinaryString(f);
    } else {

      this.state = {
        // file: null
        file: [],
        errordata: [],
        isuploaded: false
      };

      store.dispatch(toggleSnackbar(
        true,
        {
          labelName: "Please provide valid file!",
          labelKey: "EC_EXCEL_PROVIDE_VALID_FILE_TOASTER"
        },
        "warning"
      ));
      e.target.value = null;
    }
  }
  async fileUpload(file) {
    let ExcelUpload = {
      insert: this.state.fileInsert,
      update: this.state.fileUpdate,
    }
    let response = await createVendorDetails(ExcelUpload);
    return response;

  }

  render() {
    return (
      <form onSubmit={this.onFormSubmit}>
        <div>
          <div
            className="col-md-6"></div>
          <div
            className="col-md-4 col-sm-10 col-xs-12">
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={this.onChange}
              style={{
                margin: "20px 0px",
                borderRadius: "2px",
                minWidth: "200px",
                maxWidth: "250px",
                wordBreak: "break-all",
                // height: "50px",
                // float: "right"

              }}
            />
          </div>

          <div className="col-md-2 col-sm-2 col-xs-12 ">
            <button
              type="submit"
              className="MuiButtonBase-root-47 MuiButton-root-21 MuiButton-contained-32 MuiButton-containedPrimary-33 MuiButton-raised-35 MuiButton-raisedPrimary-36 uploadExcelBtn"
              style={{
                color: "white",
                margin: "8px",
                backgroundColor: "rgb(249,122,81)",
                //backgroundColor: "rgba(0, 0, 0, 0.6000000238418579)",
                borderRadius: "2px",
                minWidth: "200px",
                height: "48px",
                float: "right"
              }}
            >
              UPLOAD
            </button>
          </div>

        </div>
      </form>
    );
  }
}

export default UploadExcelFile;
