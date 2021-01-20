import { getCommonCard, getCommonContainer, getCommonHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { getEpochForDate, getTextToLocalMapping, sortByEpoch } from "../../utils";
import "./index.css";



const onRowClickServiceRequestsSearch = rowData => {
  switch (rowData[5]) {
    case "INITIATED":
      window.location.href = `apply?applicationNumber=${rowData[0]}&tenantId=${getTenantId()}`;
      break;
    default:
      window.location.href = `search-preview?applicationNumber=${
        rowData[0]
      }&tenantId=${getTenantId()}`;
      break;
  }
};

const APIGraphData = {"tenantId":"ch.chandigarh","requestInfo":{"apiId":"emp","ver":"1.0","ts":"Mon Dec 28 11:42:54 GMT 2020","resMsgId":"uief87324","msgId":"20170310130900","status":"200"},"reportResponses":[{"viewPath":null,"selectiveDownload":false,"reportHeader":[{"localisationRequired":false,"name":"citizen_mobile_app","label":"reports.rainmaker-pgr.citizen_mobile_app","type":"number","defaultValue":null,"isMandatory":false,"isLocalisationRequired":false,"localisationPrefix":"","showColumn":true,"total":false,"rowTotal":null,"columnTotal":null,"initialValue":null,"minValue":null,"maxValue":null},{"localisationRequired":false,"name":"citizen_web_app","label":"reports.rainmaker-pgr.citizen_web_app","type":"number","defaultValue":null,"isMandatory":false,"isLocalisationRequired":false,"localisationPrefix":"","showColumn":true,"total":false,"rowTotal":null,"columnTotal":null,"initialValue":null,"minValue":null,"maxValue":null},{"localisationRequired":false,"name":"counter_desktop","label":"reports.rainmaker-pgr.counter_desktop","type":"number","defaultValue":null,"isMandatory":false,"isLocalisationRequired":false,"localisationPrefix":"","showColumn":true,"total":false,"rowTotal":null,"columnTotal":null,"initialValue":null,"minValue":null,"maxValue":null}],"ttl":null,"reportData":[[256,64,43],[60,25,30],[40,75,70],[44,36,57]]}]};

export const dashboardSourceSearchResults =  getCommonCard({ 
  dashboardResult : getCommonContainer({
    customGraph: {
      uiFramework: "custom-molecules-local",
      moduleName: "egov-dashboard",
      componentPath: "ReportMoleculeBarPie",
      props: {
      formKey: `newapplication`,
      data : {"reportResponses": []}
      },
      style: {
        // minWidth: "1200px",
        // height: "500px",
        marginRight: "45px"
      },
      visible: true,
      // required: true
    }
  })
});


const header = getCommonHeader(
  {
      labelName: "My Service Requests",
      labelKey: "HC_MY_APPLICATIONS_HEADER"
  },
  {
      classes: {
          root: "common-header-cont"
      }
  }
);
