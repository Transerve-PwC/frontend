import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import get from "lodash/get";
import { downloadAcknowledgementForm } from "../../utils";
import "./index.css";
import { getSLADays, getServiceRequestStatus } from "egov-ui-kit/utils/localStorageUtils";


export const generatePdfFromDiv = (action, applicationNumber) => {
  
  let target = document.querySelector("#custom-atoms-div");
  html2canvas(target, {
    onclone: function (clonedDoc) {

    }
  }).then(canvas => {
    var data = canvas.toDataURL("image/jpeg", 1);
    var imgWidth = 200;
    var pageHeight = 295;
    var imgHeight = (canvas.height * imgWidth) / canvas.width;
    var heightLeft = imgHeight;
    var doc = new jsPDF("p", "mm");
    var position = 0;

    doc.addImage(data, "PNG", 5, 5 + position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      doc.addPage();
      doc.addImage(data, "PNG", 5, 5 + position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    if (action === "download") {
      doc.save(`preview-${applicationNumber}.pdf`);
    } else if (action === "print") {
      doc.autoPrint();
      window.open(doc.output("bloburl"), "_blank");
    }
  });

  
      
};
export const footerReviewTop = (
  action,
  state,
  dispatch,
  serviceRequestId,
  tenantId,
) => {
  /** MenuButton data based on status */
  let downloadMenu = [];
  let printMenu = [];
  let serviceRequestDownloadObject = {
    label: { labelName: "ServiceRequest", labelKey: "HC_SERVICEREQUEST" },
    link: () => {
      var { myRequestDetails } = state.screenConfiguration.preparedFinalObject;
      myRequestDetails["SLADays"] = getSLADays();
      myRequestDetails["Status"] = getServiceRequestStatus();
      const data= [myRequestDetails];
      downloadAcknowledgementForm(myRequestDetails,'print');
    },
    leftIcon: "assignment"
  };
  let serviceRequestPrintObject = {
    label: { labelName: "ServiceRequest", labelKey: "HC_SERVICEREQUEST" },
    link: () => {
      var { myRequestDetails } = state.screenConfiguration.preparedFinalObject;
      myRequestDetails["SLADays"] = getSLADays();
      myRequestDetails["Status"] = getServiceRequestStatus();
      const data= [myRequestDetails];
      downloadAcknowledgementForm(myRequestDetails,'print');
    },
    leftIcon: "assignment"
  };
  downloadMenu = [serviceRequestDownloadObject];
  printMenu = [serviceRequestPrintObject];
  /** END */

  return {
    rightdiv: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        style: { textAlign: "right", display: "flex", paddingRight: "8px", paddingLeft: "5px" }
      },
      children: {
        downloadMenu: {
          uiFramework: "custom-atoms-local",
          moduleName: "egov-hc",
          componentPath: "MenuButton",
          props: {
            data: {
              label: {labelName : "DOWNLOAD" , labelKey :"HC_DOWNLOAD"},
               leftIcon: "cloud_download",
              rightIcon: "arrow_drop_down",
              props: { variant: "outlined", style: { height: "45px", color : "#FE7A51" }, className: "tl-download-button" },
              menu: downloadMenu
            }
          }
        },
        printMenu: {
          uiFramework: "custom-atoms-local",
          moduleName: "egov-hc",
          componentPath: "MenuButton",
          props: {
            data: {
              label: {labelName : "PRINT" , labelKey :"HC_PRINT"},
              leftIcon: "print",
              rightIcon: "arrow_drop_down",
              props: { variant: "outlined", style: { height: "45px", color : "#FE7A51" }, className: "tl-print-button" },
              menu: printMenu
            }
          }
        }

      },
      
      
      
      
    }
  }
      
  
};
export const downloadPrintContainer = (
  state,
) => {
  
  /** MenuButton data based on status */
  let downloadMenu = [];
  let printMenu = [];


  let serviceRequestDownloadObject = {
    label: { labelName: "ServiceRequest", labelKey: "HC_SERVICEREQUEST" },
    link: () => {
      let document_list = get(
        state,
        "screenConfiguration.preparedFinalObject.documents_list",
        {}
      );
      var docs = "";
      var img_cnt =1;
      
      for(var i=0;i<document_list.length;i++)
      {
        if(document_list[i].length > 80)
        {
          var image_EditedName = "";
          image_EditedName = document_list[i].substring(0,40) + "......" + document_list[i].substring(document_list[i].length-5,document_list[i].length);
          document_list[i] = image_EditedName;
        }
      }
      for(var i=0;i<document_list.length;i++)
      {
        if(document_list[i].length <80){
          while(document_list[i].length<130){
            document_list[i] = document_list[i] + " ";
          }
        }
        
        docs = docs + "Document "+img_cnt + " -   " +document_list[i];
        img_cnt = img_cnt+1;
      }

      // for(var i=0;i<document_list.length;i++)
      // {
      //   document_list[i] = document_list[i].substring(0,50);
      // }


      var { myRequestDetails } = state.screenConfiguration.preparedFinalObject;
      myRequestDetails["SLADays"] = getSLADays();
      myRequestDetails["Status"] = getServiceRequestStatus();
      myRequestDetails["documents"] = docs;
      myRequestDetails["street_name"] = myRequestDetails["street_name"].toString().replace(/"/g, "''")
      myRequestDetails["landmark"] = myRequestDetails["landmark"].toString().replace(/"/g, "''")
      
      
      var str_eg = myRequestDetails["description"];
      str_eg = str_eg.toString().replace(/"/g, "''")
      str_eg = str_eg.toString().replace(/[\r\n]+/g," ");
      // myRequestDetails["description"] = myRequestDetails["description"].toString().replace(/"/g, "''")
      myRequestDetails["description"] =str_eg.toString();
      const data= [myRequestDetails];

      downloadAcknowledgementForm(data, "download");
    },
    leftIcon: "assignment"
  };
  let serviceRequestPrintObject = {
    label: { labelName: "ServiceRequest", labelKey: "HC_SERVICEREQUEST" },
    link: () => {
      let document_list = get(
        state,
        "screenConfiguration.preparedFinalObject.documents_list",
        {}
      );
      var docs = "";
      var img_cnt =1;
      
      for(var i=0;i<document_list.length;i++)
      {
        if(document_list[i].length > 80)
        {
          var image_EditedName = "";
          image_EditedName = document_list[i].substring(0,40) + "......" + document_list[i].substring(document_list[i].length-5,document_list[i].length);
          document_list[i] = image_EditedName;
        }
      }
      for(var i=0;i<document_list.length;i++)
      {
        if(document_list[i].length <80){
          while(document_list[i].length<130){
            document_list[i] = document_list[i] + " ";
          }
        }
        
        docs = docs + "Document "+img_cnt + " -   " +document_list[i];
        img_cnt = img_cnt+1;
      }

      // for(var i=0;i<document_list.length;i++)
      // {
      //   document_list[i] = document_list[i].substring(0,50);
      // }


      var { myRequestDetails } = state.screenConfiguration.preparedFinalObject;
      myRequestDetails["SLADays"] = getSLADays();
      myRequestDetails["Status"] = getServiceRequestStatus();
      myRequestDetails["documents"] = docs;
      myRequestDetails["street_name"] = myRequestDetails["street_name"].toString().replace(/"/g, "''")
      myRequestDetails["landmark"] = myRequestDetails["landmark"].toString().replace(/"/g, "''")
      
      
      var str_eg = myRequestDetails["description"];
      str_eg = str_eg.toString().replace(/"/g, "''")
      str_eg = str_eg.toString().replace(/[\r\n]+/g," ");
      // myRequestDetails["description"] = myRequestDetails["description"].toString().replace(/"/g, "''")
      myRequestDetails["description"] =str_eg.toString();
      const data= [myRequestDetails];

      downloadAcknowledgementForm(data, "print");
    },
    leftIcon: "assignment"
  };
  downloadMenu = [serviceRequestDownloadObject];
  printMenu = [serviceRequestPrintObject];
  /** END */

  return {
    rightdiv: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        style: { textAlign: "right", display: "flex", paddingRight: "8px", paddingLeft: "5px" }
      },
      children: {
        downloadMenu: {
          uiFramework: "custom-atoms-local",
          moduleName: "egov-tradelicence",
          componentPath: "MenuButton",
          props: {
            data: {
              label: {labelName : "DOWNLOAD" , labelKey :"HC_DOWNLOAD"},
               leftIcon: "cloud_download",
              rightIcon: "arrow_drop_down",
              props: { variant: "outlined", style: { height: "45px", color : "#FE7A51" }, className: "tl-download-button" },
              menu: downloadMenu
            }
          }
        },
        printMenu: {
          uiFramework: "custom-atoms-local",
          moduleName: "egov-tradelicence",
          componentPath: "MenuButton",
          props: {
            data: {
              label: {labelName : "PRINT" , labelKey :"HC_PRINT"},
              leftIcon: "print",
              rightIcon: "arrow_drop_down",
              props: { variant: "outlined", style: { height: "45px", color : "#FE7A51" }, className: "tl-print-button" },
              menu: printMenu
            }
          }
        }

      },
      
      
      
      
    }
  }
};

export const downloadPrintContainerScreenDownload= (serviceRequestId)=>{
  let downloadMenu = [];
  let printMenu = [];
  let applicationDownloadObject = {
    label: { labelName: "ServiceRequest", labelKey: "HC_SERVICEREQUEST" },
    link: () => {
      generatePdfFromDiv("download", serviceRequestId);
    },
    leftIcon: "assignment"
  };
  let applicationPrintObject = {
    label: { labelName: "ServiceRequest", labelKey: "HC_SERVICEREQUEST" },
    link: () => {
      generatePdfFromDiv("print", serviceRequestId);
    },
    leftIcon: "assignment"
  };
  downloadMenu = [applicationDownloadObject];
  printMenu = [applicationPrintObject];
  return {
    rightdiv: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        style: { textAlign: "right", display: "flex", paddingRight: "8px", paddingLeft: "5px" }
      },
      children: {
        downloadMenu: {
          uiFramework: "custom-atoms-local",
          moduleName: "egov-tradelicence",
          componentPath: "MenuButton",
          props: {
            data: {
              label: {labelName : "DOWNLOAD" , labelKey :"HC_DOWNLOAD"},
               leftIcon: "cloud_download",
              rightIcon: "arrow_drop_down",
              props: { variant: "outlined", style: { height: "45px", color : "#FE7A51" }, className: "tl-download-button" },
              menu: downloadMenu
            }
          }
        },
        printMenu: {
          uiFramework: "custom-atoms-local",
          moduleName: "egov-tradelicence",
          componentPath: "MenuButton",
          props: {
            data: {
              label: {labelName : "PRINT" , labelKey :"HC_PRINT"},
              leftIcon: "print",
              rightIcon: "arrow_drop_down",
              props: { variant: "outlined", style: { height: "45px", color : "#FE7A51" }, className: "tl-print-button" },
              menu: printMenu
            }
          }
        }

      },
      
      
      
      
    }
  }
}
