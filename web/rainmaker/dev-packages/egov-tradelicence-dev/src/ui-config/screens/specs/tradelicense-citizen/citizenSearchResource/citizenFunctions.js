import React from 'react';
import { getSearchResults, organizeLicenseData, getCount } from "../../../../../ui-utils/commons";
import { httpRequest } from "../../../../../ui-utils";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import commonConfig from "config/common.js";
import set from "lodash/set";
import TradeLicenseIcon from "../../../../../ui-atoms-local/Icons/TradeLicenseIcon";
import FormIcon from '../../../../../ui-atoms-local/Icons/FormIcon';
import { getUserInfo } from "egov-ui-kit/utils/localStorageUtils";

const getMdmsData = async (dispatch, body) => {
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: commonConfig.tenantId,
      moduleDetails: body
    }
  };
  try {
    let payload = await httpRequest(
      "post",
      "/egov-mdms-service/v1/_search",
      "_search",
      [],
      mdmsBody
    );
    return payload;
  } catch (e) {
    console.log(e);
  }
};

export const getTradeTypes = async (action, state, dispatch) => {
  const cityPayload = [{
    moduleName: "tenant", 
    masterDetails: [{name: "citymodule"}]
  }]
  const mdmsRes = await getMdmsData(dispatch, cityPayload);
  let tenants =
    mdmsRes &&
    mdmsRes.MdmsRes &&
    mdmsRes.MdmsRes.tenant.citymodule.find(item => {
      if (item.code === "TL") return true;
    });
  dispatch(
    prepareFinalObject(
      "applyScreenMdmsData.common-masters.citiesByModule.TL",
      tenants
    )
  );

  const {licensesCount = 0} = await getCount() || {};
  dispatch(
    prepareFinalObject("myApplicationsCount", licensesCount)
  );

  const permanentCity = JSON.parse(getUserInfo()).permanentCity

  const cardItems = [
    {
      label: {
          labelKey: "Apply",
          labelName: "Apply"
      },
      icon: <TradeLicenseIcon />,
      route: tenants.tenants.length > 1 ? {
        screenKey: "home",
        jsonPath: "components.cityPickerDialog"
      } : !!tenants.tenants.length ? `apply?tenantId=${tenants.tenants[0].code}` : `apply?tenantId=${permanentCity}`
    },
    {
      label: {
          labelKey: "TL_MY_APPLICATIONS",
          labelName: "My Applications"
      },
      icon: <FormIcon />,
      route: "my-applications"
    }
  ]
  dispatch(
    handleField(
      "home",
      "components.div.children.applyCard.props",
      "items",
      cardItems
    )
  );
}

export const fetchData = async (action, state, dispatch) => {
  const queryObject = [{
    key: "limit",
    value: 100
  }]
  const response = await getSearchResults(queryObject);
  try {
    /*Mseva 1.0 */
    // let data =
    //   response &&
    //   response.Licenses.map(item => ({
    //     [get(textToLocalMapping, "Application No")]:
    //       item.applicationNumber || "-",
    //     [get(textToLocalMapping, "License No")]: item.licenseNumber || "-",
    //     [get(textToLocalMapping, "Trade Name")]: item.tradeName || "-",
    //     [get(textToLocalMapping, "Owner Name")]:
    //       item.tradeLicenseDetail.owners[0].name || "-",
    //     [get(textToLocalMapping, "Application Date")]:
    //       convertEpochToDate(item.applicationDate) || "-",
    //     tenantId: item.tenantId,
    //     [get(textToLocalMapping, "Status")]:
    //       get(textToLocalMapping, item.status) || "-"
    //   }));

    // dispatch(
    //   handleField(
    //     "home",
    //     "components.div.children.applyCard.children.searchResults",
    //     "props.data",
    //     data
    //   )
    // );
    /*Mseva 2.0 */

    if (response && response.Licenses && response.Licenses.length > 0) {
      const licenses = organizeLicenseData(response.Licenses)
      dispatch(prepareFinalObject("actualResults", licenses));
      dispatch(prepareFinalObject("searchResults", licenses));
      dispatch(
        prepareFinalObject("myApplicationsCount", response.Licenses.length)
      );
    }
  } catch (error) {
    console.log(error);
  }
};
