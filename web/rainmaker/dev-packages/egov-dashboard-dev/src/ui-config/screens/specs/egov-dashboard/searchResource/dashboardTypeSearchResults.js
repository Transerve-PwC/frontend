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

const APIGraphData = {"reportResponses":[{"reportHeader":[{"localisationRequired":false,"name":"department","label":"reports.rainmaker-pgr.department","type":"string","defaultValue":null,"isMandatory":false,"isLocalisationRequired":false,"localisationPrefix":"","showColumn":true,"total":false,"rowTotal":null,"columnTotal":null,"initialValue":null,"minValue":null,"maxValue":null},{"localisationRequired":false,"name":"category","label":"reports.rainmaker-pgr.category","type":"string","defaultValue":null,"isMandatory":false,"isLocalisationRequired":false,"localisationPrefix":"","showColumn":true,"total":false,"rowTotal":null,"columnTotal":null,"initialValue":null,"minValue":null,"maxValue":null},{"localisationRequired":false,"name":"complainttype","label":"reports.rainmaker-pgr.complainttype","type":"string","defaultValue":null,"isMandatory":false,"isLocalisationRequired":false,"localisationPrefix":"","showColumn":true,"total":false,"rowTotal":null,"columnTotal":null,"initialValue":null,"minValue":null,"maxValue":null},{"localisationRequired":false,"name":"open","label":"reports.rainmaker-pgr.status.open","type":"string","defaultValue":null,"isMandatory":false,"isLocalisationRequired":false,"localisationPrefix":"","showColumn":true,"total":true,"rowTotal":null,"columnTotal":null,"initialValue":null,"minValue":null,"maxValue":null},{"localisationRequired":false,"name":"assigned","label":"reports.rainmaker-pgr.status.assigned","type":"string","defaultValue":null,"isMandatory":false,"isLocalisationRequired":false,"localisationPrefix":"","showColumn":true,"total":true,"rowTotal":null,"columnTotal":null,"initialValue":null,"minValue":null,"maxValue":null},{"localisationRequired":false,"name":"closed","label":"reports.rainmaker-pgr.status.closed","type":"string","defaultValue":null,"isMandatory":false,"isLocalisationRequired":false,"localisationPrefix":"","showColumn":true,"total":true,"rowTotal":null,"columnTotal":null,"initialValue":null,"minValue":null,"maxValue":null},{"localisationRequired":false,"name":"reassignrequested","label":"reports.rainmaker-pgr.status.reassignrequested","type":"string","defaultValue":null,"isMandatory":false,"isLocalisationRequired":false,"localisationPrefix":"","showColumn":true,"total":true,"rowTotal":null,"columnTotal":null,"initialValue":null,"minValue":null,"maxValue":null},{"localisationRequired":false,"name":"rejected","label":"reports.rainmaker-pgr.status.rejected","type":"string","defaultValue":null,"isMandatory":false,"isLocalisationRequired":false,"localisationPrefix":"","showColumn":true,"total":true,"rowTotal":null,"columnTotal":null,"initialValue":null,"minValue":null,"maxValue":null},{"localisationRequired":false,"name":"autoescalated","label":"reports.rainmaker-pgr.autoescalated","type":"string","defaultValue":null,"isMandatory":false,"isLocalisationRequired":false,"localisationPrefix":"","showColumn":true,"total":true,"rowTotal":null,"columnTotal":null,"initialValue":null,"minValue":null,"maxValue":null},{"localisationRequired":false,"name":"reopened","label":"reports.rainmaker-pgr.status.reopened","type":"string","defaultValue":null,"isMandatory":false,"isLocalisationRequired":false,"localisationPrefix":"","showColumn":true,"total":true,"rowTotal":null,"columnTotal":null,"initialValue":null,"minValue":null,"maxValue":null},{"localisationRequired":false,"name":"total","label":"reports.rainmaker-pgr.total","type":"string","defaultValue":null,"isMandatory":false,"isLocalisationRequired":false,"localisationPrefix":"","showColumn":true,"total":true,"rowTotal":null,"columnTotal":null,"initialValue":null,"minValue":null,"maxValue":null}],"reportData":[[null,"Accounts Branch","DEP016_Accounts Branch_01",89,8,1,1,8,0,1,108],[null,"Accounts Branch","DEP016_Accounts Branch_02",1,1,0,0,0,0,0,2],[null,"Advertisement","DEP017_Advertisement_01",0,1,0,0,0,0,0,1],["Birth And Death","Birth Certificate","DEP07_Birth Certificate_01",0,0,1,0,1,5,0,7],["Birth And Death","Birth Certificate","DEP07_Birth Certificate_03",0,0,0,0,1,0,0,1],[null,"Booking Branch","DEP017_Booking Branch_01",0,0,0,0,0,0,1,1],[null,"Computer Cell","DEP012_Computer Cell_01",1,0,1,0,0,0,0,2],["Birth And Death","Death Certificate","DEP07_Birth Certificate_04",0,0,2,0,1,1,0,4],["Birth And Death","Death Certificate","DEP07_Birth Certificate_05",0,0,0,0,1,1,0,2],["Building And Roads","Disposal Of Malwa","DEP02_Disposal Of Malwa_01",0,0,20,0,4,22,1,47],["Enforcement","Encroachment","DEP05_Encroachment_01",0,1,0,0,0,0,0,1],["Horticulture","Horticulture","DEP03_Horticulture_03",0,1,1,0,1,0,0,3],["Horticulture","Horticulture","DEP03_Horticulture_07",0,1,0,0,0,0,0,1],["Horticulture","Horticulture","DEP03_Horticulture_11",0,0,0,0,0,3,0,3],["Horticulture","Horticulture","DEP03_Horticulture_15",0,0,0,0,0,1,0,1],["Tax Branch","House Tax","DEP13_House Tax_01",1,0,0,0,0,0,0,1],["Health And Sanitation","MOH","DEP06_MOH_01",0,1,0,0,0,0,0,1],["Health And Sanitation","MOH","DEP06_MOH_12",0,0,0,0,0,1,0,1],["Water Supply And Sewerage","Metering","DEP01_Metering_01",0,0,4,0,2,0,0,6],["Water Supply And Sewerage","Metering","DEP01_Metering_02",1,0,0,0,0,0,0,1],["Water Supply And Sewerage","Metering","DEP01_Metering_03",0,0,1,0,0,0,0,1],["Others","Others","DEP26_Others_01",2,0,0,0,0,0,0,2],["Parking Branch","Parking Branch","DEP19_Parking Branch_08",0,1,0,0,0,0,0,1],["Pension Branch","Pension Branch","DEP22_Pension Branch_01",1,1,0,0,0,0,0,2],["Building And Roads","Road Berm","DEP02_Road Berm_01",0,1,0,0,0,0,0,1],["Building And Roads","Roads","DEP02_Roads_01",0,0,26,0,1,35,1,63],["Building And Roads","Roads","DEP02_Roads_02",0,0,4,0,0,4,0,8],["Building And Roads","Roads","DEP02_Roads_03",0,0,3,0,0,5,0,8],["Building And Roads","Roads","DEP02_Roads_04",0,0,0,0,0,5,0,5],["Health And Sanitation","Sanitation","DEP06_Sanitation_01",0,0,0,0,0,2,0,2],["Water Supply And Sewerage","Sewerage","DEP01_Sewerage_01",0,0,3,0,0,9,0,12],["Water Supply And Sewerage","Sewerage","DEP01_Sewerage_04",0,0,0,0,0,1,0,1],["Water Supply And Sewerage","Sewerage","DEP01_Sewerage_07",0,0,1,0,0,0,0,1],["Water Supply And Sewerage","Stormwater","DEP01_Stormwater_01",0,0,3,0,0,0,0,3],["Health And Sanitation","Stray Dogs","DEP06_Stray Dogs_01",1,0,0,0,0,0,0,1],["Electrical","Street Light","DEP04_Street Light_01",0,0,0,0,0,1,0,1],["Electrical","Street Light","DEP04_Street Light_02",0,0,0,0,0,1,0,1],["Electrical","Street Light","DEP04_Street Light_03",0,0,0,0,0,1,0,1],["Electrical","Street Light","DEP04_Street Light_08",0,0,0,0,0,1,0,1],["Swarna Jayanti Shahari Rozgar Yojana(NULM)","Swarna Jayanti Shahari Rozgar Yojana(NULM)","DEP15_Swarna Jayanti Shahari Rozgar Yojana_01",0,0,1,0,0,0,0,1],["Swarna Jayanti Shahari Rozgar Yojana(NULM)","Swarna Jayanti Shahari Rozgar Yojana(NULM)","DEP15_Swarna Jayanti Shahari Rozgar Yojana_04",0,0,0,0,1,0,0,1],["Water Supply And Sewerage","Water Supply","DEP01_Water Supply_01",0,0,10,0,2,8,0,20],["Water Supply And Sewerage","Water Supply","DEP01_Water Supply_02",0,0,1,0,0,1,0,2],["Water Supply And Sewerage","Water Supply","DEP01_Water Supply_03",0,0,1,0,0,0,0,1],["Water Supply And Sewerage","Water Supply","DEP01_Water Supply_07",0,0,10,0,4,1,0,15],["Water Supply And Sewerage","Water Supply","DEP01_Water Supply_11",0,0,1,0,0,0,0,1],["Water Supply And Sewerage","Water Supply","DEP01_Water Supply_15",0,0,1,0,0,1,0,2],[null,null,"DEP016_Accounts Branch_01",1,0,0,0,0,0,0,1],["Water Supply And Sewerage",null,"DEP01_Sewerage_01",0,0,1,0,0,0,0,1],["Water Supply And Sewerage",null,"DEP01_Stormwater_01",0,0,0,0,0,1,0,1],["Water Supply And Sewerage",null,"DEP01_Tertiary Water_01",0,0,0,0,0,1,0,1],["Water Supply And Sewerage",null,"DEP01_Water Supply_01",0,0,0,0,0,2,0,2],["Water Supply And Sewerage",null,"DEP01_Water Supply_03",0,0,1,0,0,1,0,2],["Water Supply And Sewerage",null,"DEP01_Water Supply_04",0,0,0,0,0,1,0,1],["Water Supply And Sewerage",null,"DEP01_public Community Toilet_01",1,0,0,0,0,0,0,1],["Water Supply And Sewerage",null,"DEP01_public Community Toilet_03",1,0,0,0,0,0,0,1],["Horticulture",null,"DEP03_Horticulture_02",1,0,0,0,0,0,0,1]]}]};

export const dashboardTypeSearchResults =  getCommonCard({ 
  dashboardResult : getCommonContainer({
    customGraph: {
      uiFramework: "custom-molecules-local",
      moduleName: "egov-dashboard",
      componentPath: "ReportMolecule",
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
