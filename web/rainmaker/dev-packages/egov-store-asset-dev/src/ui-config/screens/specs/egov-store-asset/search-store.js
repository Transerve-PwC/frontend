import {
  getBreak,
  getCommonHeader,
  getLabel,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import set from "lodash/set";
import { httpRequest } from "../../../../ui-utils";
import { searchForm } from "./searchStoreMasterResource/searchForm";
import { searchResults } from "./searchStoreMasterResource/searchResults";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import commonConfig from '../../../../config/common';
const hasButton = getQueryArg(window.location.href, "hasButton");
let enableButton = true;
//enableButton = hasButton && hasButton === "false" ? false : true;

const header = getCommonHeader({
  labelName: "Store Master",
  labelKey: "STORE_COMMON_STORE_MASTER",
});

const createStoreHandle = async (state, dispatch) => {
  dispatch(setRoute(`/egov-store-asset/createStore`));
};

const getMDMSData = async (action, state, dispatch) => {
  const tenantId = getTenantId();
  let mdmsBody = {

    MdmsCriteria: {
       tenantId: commonConfig.tenantId,
       moduleDetails: [
        {
          moduleName: "store-asset",
          masterDetails: [
            { name: "Department", filter: "[?(@.active == true)]" },
            { name: "Location", filter: "[?(@.active == true)]" },
          ],

        },
        {
          moduleName: "tenant",
          masterDetails: [{ name: "tenants" }],
        },
      ],
    },
  };
  try {
    const payload = await httpRequest(
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

const getData = async (action, state, dispatch) => {
  await getMDMSData(action, state, dispatch);
};

const storeMasterSearchAndResult = {
  uiFramework: "material-ui",
  name: "search-store",
  beforeInitScreen: (action, state, dispatch) => {
    getData(action, state, dispatch);
    //set search param blank
dispatch(prepareFinalObject("searchScreen",{}));
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Form",
      props: {
        className: "common-div-css",
        id: "search",
      },
      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",

          children: {
            header: {
              gridDefination: {
                xs: 12,
                sm: 6,
              },
              ...header,
            },
            newApplicationButton: {
              componentPath: "Button",
              gridDefination: {
                xs: 12,
                sm: 6,
                align: "right",
              },
              visible: enableButton,
              props: {
                variant: "contained",
                color: "primary",
                style: {
                  color: "white",
                  borderRadius: "2px",
                  width: "250px",
                  height: "48px",
                },
              },

              children: {
                plusIconInsideButton: {
                  uiFramework: "custom-atoms",
                  componentPath: "Icon",
                  props: {
                    iconName: "add",
                    style: {
                      fontSize: "24px",
                    },
                  },
                },

                buttonLabel: getLabel({
                  labelName: "Add Store",
                  labelKey: "STORE_ADD_NEW_STORE_BUTTON",
                }),
              },
              onClickDefination: {
                action: "condition",
                callBack: createStoreHandle,
              },
            },
          },
        },
        searchForm,
        breakAfterSearch: getBreak(),
        searchResults,
      },
    },
  },
};

export default storeMasterSearchAndResult;
