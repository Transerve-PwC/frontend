import {
  getCommonHeader,
  getCommonContainer
} from "egov-ui-framework/ui-config/screens/specs/utils";
import get from "lodash/get";
import { PriceListReviewDetails } from "./viewpricelistResource/pricelist-review";
import { masterViewFooter } from "./viewpricelistResource/footer";
import { getPriceLstData } from "./viewpricelistResource/functions";
import { getQueryArg ,getFileUrlFromAPI } from "egov-ui-framework/ui-utils/commons";  
import { showHideAdhocPopup } from "../utils";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { httpRequest } from "../../../../ui-utils";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getstoreTenantId } from "../../../../ui-utils/storecommonsapi";
export const header = getCommonContainer({
  header: getCommonHeader({
    labelName: `View Price List`,
    labelKey: "STORE_VIEW_PRICE_LIST"
  })
});
const masterView = PriceListReviewDetails(false);
const getMdmsData = async (action, state, dispatch, tenantId) => {
  const tenant =   getstoreTenantId();
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: tenant,
      moduleDetails: [
        {
          moduleName: "store-asset",
          masterDetails: [
            { name: "Material" }, //filter: "[?(@.active == true)]" },           
                      
          ],
        },
        {
          moduleName: "egov-hrms",
          masterDetails: [
            {
              name: "DeactivationReason",
              filter: "[?(@.active == true)]"
            }
          ]
        },
        {
          moduleName: "common-masters",
          masterDetails: [
            { name: "UOM", filter: "[?(@.active == true)]" },
           
          ]
        },
       
      ]
    }
  };
  try {
    const payload = await httpRequest(
      "post",
      "/egov-mdms-service/v1/_search",
      "_search",
      [],
      mdmsBody
    );
    dispatch(prepareFinalObject("viewScreenMdmsData", payload.MdmsRes));
  } catch (e) {
    console.log(e);
  }
};
const getFileUrl = async (action,dispatch,tenantId,fileStoreId)=>{

  //fileStoreId = "242e3bc6-7f42-444e-b562-6f23468f6e72"
  getFileUrlFromAPI(fileStoreId,tenantId).then(async(fileRes) => {
    console.log(fileRes)
    console.log("fileRes")
  });

  // const queryObject = [
  // 	{ key: "tenantId", value: tenantId },
  //  // { key: "tenantId", value: tenantId || commonConfig.tenantId.length > 2 ? commonConfig.tenantId.split('.')[0] : commonConfig.tenantId },
  //   { key: "fileStoreIds", value: fileStoreId }
  // ];
   let FileURL = "";
  // try {
  //   const fileUrl = await httpRequest(
  //     "get",
  //     "/filestore/v1/files/url",
  //     "",
  //     queryObject
  //   );
  //   FileURL = fileUrl;
  //   console.log(fileUrl)
  //   return fileUrl;
  // } catch (e) {
  //   console.log(e);
  // }
  let  documentsPreview= [
    {
      title: "STORE_DOCUMENT_TYPE_RATE_CONTRACT_QUATION",
      linkText: "VIEW", 
      link:FileURL,//"https://chstage.blob.core.windows.net/fileshare/ch/undefined/July/15/1594826295177document.pdf?sig=R3nzPxT9MRMfROREe6LHEwuGfeVxB%2FKneAeWrDJZvOs%3D&st=2020-07-15T15%3A21%3A01Z&se=2020-07-16T15%3A21%3A01Z&sv=2016-05-31&sp=r&sr=b",
        
    },]
   
  dispatch(
    prepareFinalObject("documentsPreview", documentsPreview)
  );
}

const screenConfig = {
  uiFramework: "material-ui",
  name: "view-price-list",
  beforeInitScreen: (action, state, dispatch) => {
    let id = getQueryArg(window.location.href, "id");
    let tenantId = getQueryArg(window.location.href, "tenantId");
   
   // showHideAdhocPopup(state, dispatch);
    getMdmsData(action, state, dispatch, tenantId);
    getPriceLstData(state, dispatch, id, tenantId);
  //   let fileStoreId = get(state, "screenConfiguration.preparedFinalObject.priceLists[0].fileStoreId",0) 
  //  getFileUrl(action,dispatch,tenantId,fileStoreId);
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        className: "common-div-css"
      },
      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",
          children: {
            header: {
              gridDefination: {
                xs: 12,
                sm: 10
              },
              ...header
            }
          }
        },
        masterView,
        footer: masterViewFooter()
      }
    },
   
    
  }
};

export default screenConfig;
