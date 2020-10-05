import {
    getCommonCard
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { prepareFinalObject,handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getSearchResults, getSearchApplicationsResults } from "../../../../ui-utils/commons";
import { getOwnerDetails,getAllotmentDetails, getModeOfTransferDetailsForApprovedProperty, getCompanyDetails } from "./preview-resource/owner-properties";
import {onTabChange, headerrow, tabs} from './search-preview'
import { firmDetails } from "./applyResource/entityDetails";


let fileNumber = getQueryArg(window.location.href, "fileNumber");


// const OwnerDetails = getOwnerDetails(false);
// const AllotmentDetails = getAllotmentDetails(false);


// export const propertyReviewDetails = getCommonCard({
//   OwnerDetails,
//   AllotmentDetails
// });

const ownerContainer = {
  uiFramework: "custom-atoms",
  componentPath: "Div",
  props: {
    id: "docs"
  },
  children: {
  }
}

const entityContainer = {
  uiFramework: "custom-atoms",
  componentPath: "Div",
  props: {
    id: "docs"
  },
  children: {
  }
}


async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

export const searchResults = async (action, state, dispatch, fileNumber) => {
  let queryObject = [
    { key: "fileNumber", value: fileNumber },
    {key: "relations", value: "owner"}
  ];
  let payload = await getSearchResults(queryObject);
  if(payload) {
    let properties = payload.Properties;
    dispatch(prepareFinalObject("Properties", properties));

    let applicationState = properties[0].state;
    let entityType = properties[0].propertyDetails.entityType;
    let companyDetails;
    let firmDetails;

    if (entityType == "ET.PUBLIC_LIMITED_COMPANY" || entityType == "ET.PRIVATE_LIMITED_COMPANY") {
      companyDetails = getCompanyDetails(false);
    }
    else if (entityType == "ET.PARTNERSHIP_FIRM" || entityType == "ET.PROPRIETORSHIP") {
      firmDetails = getFirmDetails(false);
    }

    let containers={}
    if(properties[0].propertyDetails.owners){
      // properties[0].propertyDetails.owners.forEach((element,index) => { 
      await asyncForEach(properties[0].propertyDetails.owners, async (element,index) => {
        if (!!element.ownerDetails.isCurrentOwner) {
          let ownerdetailsComponent = getOwnerDetails(false,index);
          let allotmentDetailsComponent = getAllotmentDetails(false,index);

          if (applicationState == "PS_PM_APPROVED") {
            let ownerId = element.id;
            let queryObject = [
              { key: "ownerId", value: ownerId }
            ]
            let payload = await getSearchApplicationsResults(queryObject);
            let modeOfTransferArr = [];

            if (payload.Applications && payload.Applications.length) {
              payload.Applications.map(item => {
                modeOfTransferArr.push({
                  applicationNumber: item.applicationNumber,
                  branchType: item.branchType,
                  moduleType: item.moduleType,
                  applicationType: item.applicationType
                })
              })

              dispatch(
                prepareFinalObject(`Properties[0].propertyDetails.owners[${index}].ownerDetails.modeOfTransfer`, modeOfTransferArr)
              )
    
              var modeOfTransferComponent = getModeOfTransferDetailsForApprovedProperty();
            }
          }

          if (!!modeOfTransferComponent) {
            containers[index] = getCommonCard({
              ownerdetailsComponent,
              allotmentDetailsComponent,
              modeOfTransferComponent
            });
          }
          else {
            containers[index] = getCommonCard({
              ownerdetailsComponent,
              allotmentDetailsComponent
            });  
          }
        }
      });
    }
    let entityDetails = companyDetails ? companyDetails : firmDetails ? firmDetails : {};

    dispatch(
      handleField(
        "owner-details",
        "components.div.children.entityContainer",
        "children",
        entityDetails
      )
    );

    dispatch(
      handleField(
        "owner-details",
        "components.div.children.ownerContainer",
        "children",
        containers
      )
    );
  }
}

const beforeInitFn = async (action, state, dispatch, fileNumber) => {
  dispatch(prepareFinalObject("workflow.ProcessInstances", []))
  if(fileNumber){
      await searchResults(action, state, dispatch, fileNumber)
  }
}


const EstateOwnerDetails = {
  uiFramework: "material-ui",
  name: "owner-details",
  beforeInitScreen: (action, state, dispatch) => {
    fileNumber = getQueryArg(window.location.href, "filenumber");
    beforeInitFn(action, state, dispatch, fileNumber);
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        className: "common-div-css search-preview"
      },
      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",
          children: {
            header1: {
              gridDefination: {
                xs: 12,
                sm: 8
              },
             ...headerrow
            },
            }
          },
          tabSection: {
            uiFramework: "custom-containers-local",
            moduleName: "egov-estate",
            componentPath: "CustomTabContainer",
            props: {
              tabs,
              activeIndex: 2,
              onTabChange
            },
            type: "array",
          },
          ownerContainer,
          entityContainer
      }
    }
  }
};

export default EstateOwnerDetails;