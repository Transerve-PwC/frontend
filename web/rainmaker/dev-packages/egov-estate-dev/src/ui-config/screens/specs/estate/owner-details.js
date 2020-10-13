import {
    getCommonCard,
    getCommonContainer,
    getCommonTitle,
    getTextField,
    getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { 
  prepareFinalObject,
  handleScreenConfigurationFieldChange as handleField,
  toggleSnackbar
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getSearchResults, getSearchApplicationsResults } from "../../../../ui-utils/commons";
import { getOwnerDetails,getAllotmentDetails, getModeOfTransferDetailsForApprovedProperty, getCompanyDetails } from "./preview-resource/owner-properties";
import {onTabChange, headerrow, tabs} from './search-preview'
import { firmDetails } from "./applyResource/entityDetails";
import { mobileNumberField } from "./applyResource/ownerDetails";
import {
  getUserInfo
} from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import {
  validateFields
} from "../utils";


const userInfo = JSON.parse(getUserInfo());
const {
    roles = []
} = userInfo
const findItem = roles.find(item => item.code === "ES_EB_DISPATCH_OFFICER");

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
    let owners = properties[0].propertyDetails.owners;
    let currOwners = owners.filter(item => item.ownerDetails.isCurrentOwner == true);
    properties = [{...properties[0], propertyDetails: {...properties[0].propertyDetails, owners: currOwners}}]
    
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
          let ownerdetailsComponent = getOwnerDetails(false, index, !!findItem);
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

const callBackForSave = async (state, dispatch) => {
  const isOwnerInfoValid = validateFields(
    "components.adhocDialog.children.details.children",
    state,
    dispatch,
    "owner-details"
  )

  if (isOwnerInfoValid) {
    // update api call

    let message = {
      labelName: "Owner details updated successfully",
      labelKey: "ES_OWNER_DETAILS_UPDATE_SUCCESS"
    };
    dispatch(toggleSnackbar(true, message, "success"));
    dispatch(
      handleField(
        "owner-details",
        `components.adhocDialog`,
        "props.open",
        false
      )
    )
  }
}
const callBackForCancel = async (state, dispatch) => {
  dispatch(
    handleField(
      "owner-details",
      `components.adhocDialog`,
      "props.open",
      false
    )
  )

  let ownersTemp = get(
    state.screenConfiguration.preparedFinalObject,
    "ownersTemp",
    []
  )

  dispatch(
    prepareFinalObject("Properties[0].propertyDetails.owners", ownersTemp)
  )
}
const saveButton = {
  componentPath: "Button",
  props: {
    variant: "contained",
    color: "primary",
    style: {
      minWidth: "180px",
      height: "48px",
      margin: "15px 0px 0px 15px",
      borderRadius: "inherit",
    }
  },
  children: {
    saveButtonLabel: getLabel({
      labelName: "Save",
      labelKey: "ES_COMMON_BUTTON_SAVE"
    }),
    // saveButtonIcon: {
    //   uiFramework: "custom-atoms",
    //   componentPath: "Icon",
    //   props: {
    //     iconName: "keyboard_arrow_right"
    //   }
    // }
  },
  visible: true
}
const cancelButton = {
  componentPath: "Button",
  props: {
    variant: "contained",
    color: "primary",
    style: {
      minWidth: "180px",
      height: "48px",
      margin: "15px 0px 0px 0px",
      borderRadius: "inherit"
    }
  },
  children: {
    cancelButtonLabel: getLabel({
      labelName: "Cancel",
      labelKey: "ES_COMMON_BUTTON_CANCEL"
    }),
    // cancelButtonIcon: {
    //   uiFramework: "custom-atoms",
    //   componentPath: "Icon",
    //   props: {
    //     iconName: "keyboard_arrow_right"
    //   }
    // }
  },
  visible: true
}

const ownerHeader = getCommonTitle({
  labelName: "Edit Owner Details",
  labelKey: "ES_EDIT_OWNER_DETAILS_HEADER"
}, {
  style: {
    marginBottom: 18,
    marginTop: 18
  }
})

const addressField = {
  label: {
    labelName: "Address",
    labelKey: "ES_ADDRESS_LABEL"
  },
  placeholder: {
    labelName: "Enter Address",
    labelKey: "ES_ADDRESS_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 12
  },
  required: true,
  props: {
    multiline: true,
    rows: 2
  },
  maxLength: 150,
  jsonPath: "Properties[0].propertyDetails.owners[0].ownerDetails.address"
}
const editOwnerDetails = getCommonContainer({
  address: getTextField(addressField),
  mobileNumber: getTextField(mobileNumberField)
})

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
    },
    adhocDialog: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-estate",
      componentPath: "DialogContainer",
      props: {
        open: false,
        maxWidth: "sm",
        screenKey: "owner-details",
      },
      children: {
        header: ownerHeader,
        details: editOwnerDetails,
        cancelButton: {
          ...cancelButton,
          onClickDefination: {
            action: "condition",
            callBack: callBackForCancel
          }
        },
        saveButton: {
          ...saveButton,
          onClickDefination: {
            action: "condition",
            callBack: callBackForSave
          }
        }
      }
    }
  }
};

export default EstateOwnerDetails;