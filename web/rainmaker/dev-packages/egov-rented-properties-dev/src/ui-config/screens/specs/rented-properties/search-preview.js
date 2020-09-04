import {
    getCommonHeader,
    getCommonContainer,
    getLabel,
    getCommonCard,getTextField
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getQueryArg, setDocuments } from "egov-ui-framework/ui-utils/commons";
import { getSearchResults } from "../../../../ui-utils/commons";
import { downloadCertificateForm} from "../utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { getReviewOwner, getReviewProperty, getReviewAddress, getReviewRentDetails, getReviewPaymentDetails,getReviewGrantDetails ,getGrantDetails,getGrantDetailsAvailed} from "./applyResource/review-property";
import { getReviewDocuments } from "./applyResource/review-documents";
import { getUserInfo ,getTenantId} from "egov-ui-kit/utils/localStorageUtils";
import { prepareFinalObject, toggleSnackbar,handleScreenConfigurationFieldChange as handleField,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { editFooter,footerReviewTop } from "./applyResource/reviewFooter";
import { httpRequest } from "egov-ui-framework/ui-utils/api.js";

import set from "lodash/set"
import {applicationNumber} from './apply'
import { setApplicationNumberBox } from "../../../../ui-utils/apply";
const userInfo = JSON.parse(getUserInfo());
const {roles = []} = userInfo
const findItem = roles.find(item => item.code === "RP_CLERK");

let transitNumber = getQueryArg(window.location.href, "transitNumber");

export const headerrow = getCommonContainer({
  header: getCommonHeader({
    labelName: "Rented Properties",
    labelKey: "RP_COMMON_RENTED_PROPERTIES"
  }),
  applicationNumber : {
    ...applicationNumber,
    props: {
      ...applicationNumber.props,
      type: "RP_MASTER"
    }
  }
});
const reviewOwnerDetails = getReviewOwner(false);
const reviewPropertyDetails = getReviewProperty(false);
const reviewAddressDetails = getReviewAddress(false);
const reviewRentDetails = getReviewRentDetails(false);
const reviewPaymentDetails = getReviewPaymentDetails(false);
const reviewDocumentDetails = getReviewDocuments(false, "apply")
const grantDetailAvailed=getGrantDetailsAvailed(false)
const reviewGrantDetails = getReviewGrantDetails(false)
const grantDetail=getGrantDetails(false)
export const propertyReviewDetails = getCommonCard({
  reviewPropertyDetails,
  reviewAddressDetails,
  reviewOwnerDetails,
  reviewRentDetails,
  reviewPaymentDetails,
  reviewDocumentDetails,
  grantDetailAvailed,
  reviewGrantDetails,
  grantDetail
  
});

export const searchResults = async (action, state, dispatch, transitNumber) => {
  let queryObject = [
    { key: "transitNumber", value: transitNumber }
  ];
  let payload = await getSearchResults(queryObject);
  if(payload) {
    let properties = payload.Properties;
    // properties = properties[0].owners.filter(itemdat => itemdat.permanent === true)
    properties[0].owners = properties[0].owners.reverse()
    const grandDetails=properties[0].grantDetails
    let state = properties[0].masterDataState;
    let applicationDocuments = properties[0].propertyDetails.applicationDocuments || [];
    const removedDocs = applicationDocuments.filter(item => !item.active)
    applicationDocuments = applicationDocuments.filter(item => !!item.active)
    let {rentSummary} = properties[0]
    rentSummary = {
      balancePrincipal: !!rentSummary ? rentSummary.balancePrincipal.toFixed(2) : 0,
      balanceInterest: !!rentSummary ? rentSummary.balanceInterest.toFixed(2) : 0,
      balanceAmount: !!rentSummary ? rentSummary.balanceAmount.toFixed(2) : 0
    }
    
    properties[0].propertyDetails.interestRate = (properties[0].propertyDetails.interestRate).toString()
    properties[0].propertyDetails.rentIncrementPercentage = (properties[0].propertyDetails.rentIncrementPercentage).toString()
    properties[0].propertyDetails.rentIncrementPeriod = (properties[0].propertyDetails.rentIncrementPeriod).toString()

    properties = [{...properties[0], rentSummary, propertyDetails: {...properties[0].propertyDetails, applicationDocuments}}]
    dispatch(prepareFinalObject("Properties[0]", properties[0]));
    dispatch(
      prepareFinalObject(
        "PropertiesTemp[0].removedDocs",
        removedDocs
      )
    );
    await setDocuments(
      payload,
      "Properties[0].propertyDetails.applicationDocuments",
      "PropertiesTemp[0].reviewDocData",
      dispatch,'RP'
    );
    setApplicationNumberBox(state, dispatch, transitNumber, "search-preview")

    const getGrantDetailsAvailed = grandDetails !==null
    dispatch(
      handleField(
        "search-preview",
        "components.div.children.propertyReviewDetails.children.cardContent.children.grantDetailAvailed",
        "visible",
        getGrantDetailsAvailed
    ),
  );
  const isGrantDetails = grandDetails ===null
  dispatch(
    handleField(
      "search-preview",
      "components.div.children.propertyReviewDetails.children.cardContent.children.grantDetail",
      "visible",
      isGrantDetails
  ),
);
      const showEstimate = grandDetails !==null
      dispatch(
        handleField(
            "search-preview",
            "components.div.children.propertyReviewDetails.children.cardContent.children.reviewGrantDetails",
            "visible",
            showEstimate
        ),
      );
  
    if(state == "PM_APPROVED"){
      dispatch(
        handleField(
          "search-preview",
          "components.div.children.rightdiv",
          "visible",
          true
        )
      );
    }  
        
    if(state == 'PM_REJECTED'){
      let path = "components.div.children.headerDiv.children.searchButton"
      dispatch(
        handleField(
          "search-preview",
          path,
          "visible",
          false
        )
      );
      let tabs = [
        {
          tabButton: { labelName: "Property Details", labelKey: "RP_PROPERTY_DETAILS" }
        }
      ]
      const props = {
        tabs,
        activeIndex: 0,
        onTabChange
      }
      dispatch(
        handleField(
          "search-preview",
          "components.div.children.tabSection",
          "props",
          props
        )
      );

 
    }
    const footer = editFooter(
      action,
      state,
      dispatch,
      status,
      "applicationNumber",
      "tenantId",
      "OwnershipTransferRP"
    );
    process.env.REACT_APP_NAME != "Citizen"
        ? set(action, "screenConfig.components.div.children.footer", footer)
        : set(action, "screenConfig.components.div.children.footer", {});
  }
}

const beforeInitFn = async (action, state, dispatch, transitNumber) => {
  dispatch(prepareFinalObject("workflow.ProcessInstances", []))
  if(transitNumber){
    await searchResults(action, state, dispatch, transitNumber)
  }
}

export const onTabChange = async(tabIndex, dispatch, state) => {
  transitNumber = getQueryArg(window.location.href, "transitNumber");
  const tenantId = getQueryArg(window.location.href, "tenantId");
  let path = ""
  if(tabIndex === 0) {
    path = `/rented-properties/search-preview?transitNumber=${transitNumber}&tenantId=${tenantId}`
  } else if(tabIndex === 1) {
    path = `/rented-properties/property-transitImages?transitNumber=${transitNumber}&tenantId=${tenantId}`
  } else if(tabIndex === 2) {
    path = `/rented-properties/notices?transitNumber=${transitNumber}&tenantId=${tenantId}`
  } else if(tabIndex === 3) {
    path = `/rented-properties/rent-history?transitNumber=${transitNumber}&tenantId=${tenantId}`
  }
  dispatch(setRoute(path))
}

export const tabs = [
  {
    tabButton: { labelName: "Property Details", labelKey: "RP_PROPERTY_DETAILS" },
  },
  {
    tabButton: { labelName: "Transit Site Image", labelKey: "RP_TRANSIT_SITE_IMAGES" },
  },
  {
    tabButton: { labelName: "Notices", labelKey: "RP_NOTICES" },
  },
  {
    tabButton: {labelName: "Rent History", labelKey: "RP_COMMON_RENT_HISTORY"}
  }
]

const buttonComponent = (label) => ({
  componentPath: "Button",
  gridDefination: {
    xs: 12,
    sm: 2
  },
  props: {
    variant: "contained",
    style: {
      color: "white",
      backgroundColor: "#fe7a51",
      borderColor:"#fe7a51",
      borderRadius: "2px",
      height: "48px"
    }
  },
  children: {
    buttonLabel: getLabel({
      labelName: label,
      labelKey: label
    })
  },
  onClickDefination: {
    action: "condition",
    callBack: (state, dispatch) => {
      const { Properties, PropertiesTemp } = state.screenConfiguration.preparedFinalObject;
      const documents = PropertiesTemp[0].reviewDocData;
      set(Properties[0],"additionalDetails.documents",documents)
      downloadCertificateForm(Properties, [],'original');
    }
  }
})

const handleClose = (state,dispatch) => {
  dispatch(
    handleField(
      "search-preview",
      "components.div.children.adhocDialog",
      "props.open",
      false
  ),
)
};

const update = async (state, dispatch) => {
  const {Properties} = state.screenConfiguration.preparedFinalObject
  try {
  await httpRequest(
    "post",
    "/rp-services/property/_update",
    "",
    [],
    {"Properties": Properties}
  );
  dispatch(handleField(
    "search-preview",
    "components.div.children.adhocDialog",
    "props.open",
    false
  ))

  await searchResults(action, state, dispatch, transitNumber) 
} catch (error) {
  dispatch(
    toggleSnackbar(
      true,
      { labelName: error.message, labelKey: error.message },
      "error"
    )
  );
}
}


const phoneField = {
  label: {
    labelName: "phone number",
    labelKey: "RP_COMMON_PHONE_NUMBER"
  },
  placeholder: {
    labelName: "Enter Phone Number",
    labelKey: "RP_COMMON_PHONE_NUMBER_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 12
  },
  jsonPath: "Properties[0].owners[0].ownerDetails.phone",
  // pattern: getPattern("Amount")
}

const pincodeField = {
  label: {
    labelName: "Pincode",
    labelKey: "RP_COMMON_PINCODE_LABEL"
  },
  placeholder: {
    labelName: "Enter Pincode",
    labelKey: "RP_COMMON_PINCODE_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 12
  },
  jsonPath: "Properties[0].propertyDetails.address.pincode",
  // pattern: getPattern("Amount")
}

const areaField = {
  label: {
    labelName: "Area",
    labelKey: "RP_COMMON_AREA_LABEL"
  },
  placeholder: {
    labelName: "Enter Area",
    labelKey: "RP_COMMON_AREA_LABEL_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 12
  },
  jsonPath: "Properties[0].propertyDetails.address.area",
  // pattern: getPattern("Amount")
}

export const editPopup = getCommonContainer({
  header: {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    props: {
      style: {
        width: "100%",
        float: "right"
      }
    },
    children: {
      div1: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 10,
          sm: 10
        },
        props: {
          style: {
            width: "100%",
            float: "right"
          }
        },
        children: {
          div: getCommonHeader(
            {
              labelName: "Edit Fine Master",
              labelKey: "TL_FINE_MASTER_EDIT_HEADER"
            },
            {
              style: {
                fontSize: "20px"
              }
            }
          )
        }
      },
      div2: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 2,
          sm: 2
        },
        props: {
          style: {
            width: "100%",
            float: "right",
            cursor: "pointer"
          }
        },
        children: {
          closeButton: {
            componentPath: "Button",
            props: {
              style: {
                float: "right",
                color: "rgba(0, 0, 0, 0.60)"
              }
            },
            children: {
              previousButtonIcon: {
                uiFramework: "custom-atoms",
                componentPath: "Icon",
                props: {
                  iconName: "close"
                }
              }
            },
            onClickDefination: {
              action: "condition",
              callBack: (state, dispatch) => {
                handleClose(state, dispatch);
              }
            }
          }
        }
      }
    }
  },
  phoneNumber: getCommonContainer({
      phone: getTextField(phoneField)
    }),

  pinCode: getCommonContainer({
      rateField: getTextField(pincodeField)
  }),  

  area: getCommonContainer({
    rateField: getTextField(areaField)
}), 
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        style: {
          width: "100%",
          textAlign: "right"
        }
      },
      children: {
        updateButton: {
          componentPath: "Button",
          props: {
            variant: "contained",
            color: "primary",
            style: {
              width: "140px",
              height: "48px"
            }
          },
          children: {
            previousButtonLabel: getLabel({
              labelName: "UPDATE",
              labelKey: "TL_COMMON_UPDATE_BUTTON"
            })
          },
          onClickDefination: {
            action: "condition",
            callBack: update
          }
        }
      }
    }
})

const rentedPropertiesDetailPreview = {
  uiFramework: "material-ui",
  name: "search-preview",
  beforeInitScreen: (action, state, dispatch) => {
    transitNumber = getQueryArg(window.location.href, "transitNumber");
    beforeInitFn(action, state, dispatch, transitNumber);
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
            header: {
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
            moduleName: "egov-rented-properties",
            componentPath: "CustomTabContainer",
            props: {
              tabs,
              activeIndex: 0,
              onTabChange
            },
            type: "array",
          },
          rightdiv: {
            visible:false,
            uiFramework: "custom-atoms",
            componentPath: "Container",
            props: {
              style: { justifyContent: "flex-end", marginTop: 10 }
            },
            gridDefination: {
              xs: 12,
              sm: 12,
              align: "right",
            },
            children: {
              allotmentButton: buttonComponent("Download Original Allotment Letter"),
            }
          },
          taskStatus: {
            uiFramework: "custom-containers-local",
            moduleName: "egov-rented-properties",
            componentPath: "WorkFlowContainer",
            props: {
              dataPath: "Properties",
              moduleName: "MasterRP",
              updateUrl: "/rp-services/property/_update"
            }
          },
          adhocDialog: {
            uiFramework: "custom-containers-local",
            moduleName: "egov-rented-properties",
            componentPath: "DialogContainer",
            props: {
              open: false,
              screenKey: "search-preview"
            },
            children: {
              popup: editPopup
            }
          },
        propertyReviewDetails
      }
    }
  }
};

export default rentedPropertiesDetailPreview;