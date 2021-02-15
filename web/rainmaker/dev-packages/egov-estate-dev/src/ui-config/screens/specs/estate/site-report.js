import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject,
  toggleSnackbar
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  getCommonHeader,
  getCommonCard,
  getCommonContainer,
  getTextField,
  getSelectField,
  getPattern,
  getCommonGrayCard,
  getCommonTitle,
  getLabel,
  getCommonSubHeader,
  getLabelWithValue,
  getDateField,
  getTodaysDateInYMD
} from "egov-ui-framework/ui-config/screens/specs/utils";
import commonConfig from "config/common.js";
import {
  httpRequest
} from "../../../../ui-utils";
import get from "lodash/get";
import {
  ESTATE_SERVICES_MDMS_MODULE
} from "../../../../ui-constants";
import {
  getSearchApplicationsResults
} from "../../../../ui-utils/commons";
import {
  getQueryArg
} from "egov-ui-framework/ui-utils/commons";
import {
  _getPattern,
  validateFields,
  displayCustomErr
} from "../utils"
import {
 getStatusList
} from "./searchResource/functions";
import {
  getTenantId
} from "egov-ui-kit/utils/localStorageUtils";
import store from "../../../../ui-redux/store";
import { getMdmsData } from "./apply";

export const setSampleSiteMapDoc = async (action, state, dispatch) => {
  const documentTypePayload = [{
    moduleName: ESTATE_SERVICES_MDMS_MODULE,
    masterDetails: [{
      name: "sampleSiteMap"
    }]
  }]
  const documentRes = await getMdmsData(dispatch, documentTypePayload);
  const {
    EstateServices
  } = documentRes && documentRes.MdmsRes ? documentRes.MdmsRes : {}
  const {
    sampleSiteMap = []
  } = EstateServices || {}
  const findMasterItem = sampleSiteMap.find(item => item.code === "MasterEst")
  const masterDocuments = !!findMasterItem ? findMasterItem.documentList : [];
  if (masterDocuments.length) {
    var documentTypes = [{
      name: masterDocuments[0].code,
      required: masterDocuments[0].required,
      jsonPath: `Applications[0].applicationDetails.sampleSiteMap[0]`,
      statement: "SAMPLE_SITE_MAP_DESC"
    }]
  

    dispatch(
      handleField(
        action.screenKey,
        `components.div.children.detailsContainer.children.documentDetails.children.cardContent.children.documentList`,
        "props.inputProps",
        masterDocuments
      )
    );
    dispatch(prepareFinalObject(`ApplicationsTemp[0].applicationDetails.sampleSiteMap`, documentTypes));
  }
}

const beforeInitFn = async (action, state, dispatch) => {
  dispatch(prepareFinalObject("workflow.ProcessInstances", []))
  const applicationNumber = getQueryArg(window.location.href, "applicationNumber");
  const branchType = getQueryArg(window.location.href, "branchType");

  if (!applicationNumber) {
    return;
  }
  const queryObject = [
    { key: "applicationNumber", value: applicationNumber },
    { key: "branchType", value: branchType },
    { key: "tenantId", value: getTenantId() },
  ]
  const response = await getSearchApplicationsResults(queryObject);
  try {
    let {
      Applications = []
    } = response;
    let {
      applicationDocuments,
      workFlowBusinessService,
      state: applicationState,
      billingBusinessService: businessService
    } = Applications[0];
    applicationDocuments = applicationDocuments || [];
    const statusQueryObject = [{
        key: "tenantId",
        value: getTenantId()
      },
      {
        key: "businessServices",
        value: workFlowBusinessService
      }
    ]
    getStatusList(state, dispatch, statusQueryObject);
    const removedDocs = applicationDocuments.filter(item => !item.isActive)
    applicationDocuments = applicationDocuments.filter(item => !!item.isActive)
    Applications = [{
      ...Applications[0],
      applicationDocuments
    }]
    dispatch(prepareFinalObject("Applications", Applications));
    dispatch(prepareFinalObject("temp[0].removedDocs", removedDocs));

    setSampleSiteMapDoc(action, state, dispatch);
  } catch (error) {
    return false;
  }
}

export const headerDiv = {
  uiFramework: "custom-atoms",
  componentPath: "Container",
  props: {
    style: {
      marginBottom: "10px"
    }
  }
}

const houseNumberLabel = {
  labelName: "House Number",
  labelKey: "ES_HOUSE_NUMBER_LABEL"
}
const mohallaLabel = {
  labelName: "Mohalla",
  labelKey: "ES_MOHALLA_LABEL"
}
const villageLabel = {
  labelName: "Village",
  labelKey: "ES_VILLAGE_LABEL"
}
const ownedByLabel = {
  labelName: "Owned By",
  labelKey: "ES_OWNED_BY_LABEL"
}
const soLabel = {
  labelName: "S/O",
  labelKey: "ES_SO_LABEL"
}

const propertyInfo = () => ({
  headerDiv: {
    ...headerDiv,
    children: {
      header: {
        gridDefination: {
          xs: 12,
          sm: 10
        },
        ...getCommonSubHeader({
          labelName: "Property INFO",
          labelKey: "ES_PROPERTY_INFO_HEADER"
        })
      },
    }
  },
  viewFour: getCommonContainer({
    houseNumber: getLabelWithValue(
      houseNumberLabel, {
        jsonPath: "Applications[0].property.propertyDetails.houseNumber"
      }
    ),
    mohalla: getLabelWithValue(
      mohallaLabel, {
        jsonPath: "Applications[0].property.propertyDetails.mohalla"
      }
    ),
    village: getLabelWithValue(
      villageLabel, {
        jsonPath: "Applications[0].property.propertyDetails.village"
      }
    ),
    ownedBy: getLabelWithValue(
      ownedByLabel, {
        jsonPath: "Applications[0].applicationDetails.owner.transferorDetails.ownerName"
      }
    )
  })
})

const propertyDetails = getCommonCard(propertyInfo(false))

const header = getCommonHeader({
  labelName: "Site Report",
  labelKey: "ES_SITE_REPORT_HEADER"
});

const particularsOfHouseField = {
  label: {
    labelName: "Particular of House/Shop in question",
    labelKey: "ES_PARTICULARS_OF_HOUSE_OR_SHOP_LABEL"
  },
  placeholder: {
    labelName: "Enter particular of House/Shop in question",
    labelKey: "ES_PARTICULARS_OF_HOUSE_OR_SHOP_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  // required: true,
  // minLength: 5,
  // maxLength: 250,
  jsonPath: "Applications[0].applicationDetails.siteReport.particularsOfHouse",
  errorMessage:"ERR_COURT_DETAILS_250_CHARACTERS",
  pattern: _getPattern("courtCase"),
}

const houseAreaField = {
  label: {
    labelName: "Shop/House falls in which area (Abadi/ Lal Dora/ Acquired/ Un acquired Ousters Abadi/ Other",
    labelKey: "ES_HOUSE_AREA_LABEL"
  },
  placeholder: {
    labelName: "Enter Shop/House falls in which area",
    labelKey: "ES_HOUSE_AREA_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  // required: true,
  // minLength: 5,
  // maxLength: 250,
  jsonPath: "Applications[0].applicationDetails.siteReport.houseArea",
  errorMessage:"ERR_COURT_DETAILS_250_CHARACTERS",
  pattern: _getPattern("courtCase"),
}

const ownershipField = {
  label: {
    labelName: "Ownership",
    labelKey: "ES_OWNERSHIP_LABEL"
  },
  placeholder: {
    labelName: "Enter Ownership",
    labelKey: "ES_OWNERSHIP_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  // required: true,
  // minLength: 5,
  // maxLength: 250,
  jsonPath: "Applications[0].applicationDetails.siteReport.ownership",
  errorMessage:"ERR_COURT_DETAILS_250_CHARACTERS",
  pattern: _getPattern("courtCase")
}

const possessionField = {
  label: {
    labelName: "Possession",
    labelKey: "ES_POSSESSION_LABEL"
  },
  placeholder: {
    labelName: "Enter Possession",
    labelKey: "ES_POSSESSION_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  // required: true,
  // minLength: 5,
  // maxLength: 250,
  jsonPath: "Applications[0].applicationDetails.siteReport.possession",
  errorMessage:"ERR_COURT_DETAILS_250_CHARACTERS",
  pattern: _getPattern("courtCase")
}

const modeOfOwnershipField = {
  label: {
    labelName: "How become the owner (by way of sale deed/ WILL/ Ancestral/ Other)",
    labelKey: "ES_MODE_OF_OWNERSHIP_LABEL"
  },
  placeholder: {
    labelName: "Enter how become the owner",
    labelKey: "ES_MODE_OF_OWNERSHIP_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  // required: true,
  // minLength: 5,
  // maxLength: 250,
  jsonPath: "Applications[0].applicationDetails.siteReport.modeOfOwnership",
  errorMessage:"ERR_COURT_DETAILS_250_CHARACTERS",
  pattern: _getPattern("courtCase")
}

const heightField = {
  label: {
    labelName: "Height",
    labelKey: "ES_HEIGHT_LABEL"
  },
  placeholder: {
    labelName: "Enter Height",
    labelKey: "ES_HEIGHT_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  // required: true,
  // minLength: 5,
  // maxLength: 250,
  jsonPath: "Applications[0].applicationDetails.siteReport.height",
  pattern:_getPattern("height"),
  afterFieldChange: (action, state, dispatch) => {
    if (action.value.length > 7) {
      displayCustomErr(action.componentJsonpath, dispatch, "ES_ERR_MAXLENGTH_7", action.screenKey);
    } else {
      displayCustomErr(action.componentJsonpath, dispatch,"ES_ERR_HIEGHT_FIELD", action.screenKey);
    }
  }
}

const cantileverField = {
  label: {
    labelName: "Cantilever",
    labelKey: "ES_CANTILEVER_LABEL"
  },
  placeholder: {
    labelName: "Enter Cantilever",
    labelKey: "ES_CANTILEVER_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  // required: true,
  // minLength: 5,
  // maxLength: 250,
  jsonPath: "Applications[0].applicationDetails.siteReport.cantilever",
  errorMessage:"ERR_COURT_DETAILS_250_CHARACTERS",
  pattern: _getPattern("courtCase"),
}

const noOfFloorsField = {
  label: {
    labelName: "No. of floors",
    labelKey: "ES_NUMBER_OF_FLOORS_LABEL"
  },
  placeholder: {
    labelName: "Enter No. of floors",
    labelKey: "ES_NUMBER_OF_FLOORS_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  // required: true,
  // minLength: 5,
  // maxLength: 250,
  jsonPath: "Applications[0].applicationDetails.siteReport.noOfFloors",
  pattern:_getPattern("height"),
  afterFieldChange: (action, state, dispatch) => {
    if (action.value.length > 7) {
      displayCustomErr(action.componentJsonpath, dispatch, "ES_ERR_MAXLENGTH_7", action.screenKey);
    } else {
      displayCustomErr(action.componentJsonpath, dispatch,"ES_ERR_NO_OF_FLOORS_FIELD", action.screenKey);
    }
  }
}

const encroachmentField = {
  label: {
    labelName: "Encroachment adjoining public land (if any)",
    labelKey: "ES_ENCROACHMENT_LABEL"
  },
  placeholder: {
    labelName: "Enter Encroachment adjoining public land (if any)",
    labelKey: "ES_ENCROACHMENT_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  // required: true,
  // minLength: 5,
  // maxLength: 250,
  jsonPath: "Applications[0].applicationDetails.siteReport.encroachment",
  pattern: _getPattern("alphabet"),
  afterFieldChange: (action, state, dispatch) => {
    if (action.value.length > 150) {
      displayCustomErr(action.componentJsonpath, dispatch, "ES_ERR_MAXLENGTH_150", action.screenKey);
    } else {
      displayCustomErr(action.componentJsonpath, dispatch,"ES_ERR_ENROCHMENT_FIELD", action.screenKey);
    }
  }
}

const violationField = {
  label: {
    labelName: "Any other violation",
    labelKey: "ES_VIOLATION_LABEL"
  },
  placeholder: {
    labelName: "Enter any other violation",
    labelKey: "ES_VIOLATION_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  // required: true,
  // minLength: 5,
  // maxLength: 250,
  jsonPath: "Applications[0].applicationDetails.siteReport.violation",
  errorMessage:"ERR_COURT_DETAILS_250_CHARACTERS",
  pattern: _getPattern("courtCase"),
}

const dimensionOfBuildingField = {
  label: {
    labelName: "Dimension of the building/site",
    labelKey: "ES_DIMENSION_OF_BUILDING_LABEL"
  },
  placeholder: {
    labelName: "Enter Dimension of the building/site",
    labelKey: "ES_DIMENSION_OF_BUILDING_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  // required: true,
  // minLength: 5,
  // maxLength: 250,
  jsonPath: "Applications[0].applicationDetails.siteReport.dimensionOfBuilding",
  pattern:_getPattern("height"),
  afterFieldChange: (action, state, dispatch) => {
    if (action.value.length > 7) {
      displayCustomErr(action.componentJsonpath, dispatch, "ES_ERR_MAXLENGTH_7", action.screenKey);
    } else {
      displayCustomErr(action.componentJsonpath, dispatch,"ES_ERR_DIMENSIONS_FIELD", action.screenKey);
    }
  }
}

const areaField = {
  label: {
    labelName: "Area",
    labelKey: "ES_AREA_LABEL"
  },
  placeholder: {
    labelName: "Enter Area",
    labelKey: "ES_AREA_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  // required: true,
  // minLength: 5,
  // maxLength: 250,
  jsonPath: "Applications[0].applicationDetails.siteReport.area",
  pattern:_getPattern("height"),
  afterFieldChange: (action, state, dispatch) => {
    if (action.value.length > 7) {
      displayCustomErr(action.componentJsonpath, dispatch, "ES_ERR_MAXLENGTH_7", action.screenKey);
    } else {
      displayCustomErr(action.componentJsonpath, dispatch,"ES_ERR_AREA", action.screenKey);
    }
  }
}

const excessAreaField = {
  label: {
    labelName: "Excess Area",
    labelKey: "ES_EXCESS_AREA_LABEL"
  },
  placeholder: {
    labelName: "Enter Excess Area",
    labelKey: "ES_EXCESS_AREA_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  // required: true,
  // minLength: 5,
  // maxLength: 250,
  jsonPath: "Applications[0].applicationDetails.siteReport.excessArea",
  pattern:_getPattern("height"),
  afterFieldChange: (action, state, dispatch) => {
    if (action.value.length > 7) {
      displayCustomErr(action.componentJsonpath, dispatch, "ES_ERR_MAXLENGTH_7", action.screenKey);
    } else {
      displayCustomErr(action.componentJsonpath, dispatch,"ES_ERR_AREA", action.screenKey);
    }
  }
}

const isCommercialActivityRadioButton = {
  uiFramework: "custom-containers-local",
  moduleName: "egov-estate",
  componentPath: "RadioGroupContainer",
  gridDefination: {
    xs: 12,
    sm: 6,
  },
  jsonPath: "Applications[0].applicationDetails.siteReport.isCommercialActivity",
  props: {
    label: {
      name: "Commercial Activity?",
      key: "ES_IS_COMMERCIAL_ACTIVITY_LABEL"
    },
    buttons: [{
        labelName: "Yes",
        labelKey: "ES_COMMON_YES",
        value: true,
      },
      {
        label: "No",
        labelKey: "ES_COMMON_NO",
        value: false,
      }
    ],
    jsonPath: "Applications[0].applicationDetails.siteReport.isCommercialActivity",
    // required: true,
  },
  // required: true,
  type: "array",
  afterFieldChange: (action, state, dispatch) => {
    dispatch(
      handleField(
        action.screenKey,
        "components.div.children.detailsContainer.children.buldingDetails.children.cardContent.children.detailsContainer.children.commercialActivityArea",
        "props.disabled",
        (action.value == "false")
      )
    )
  }
};

const commercialActivityAreaField = {
  label: {
    labelName: "Commercial Activity Area",
    labelKey: "ES_COMMERCIAL_ACTIVITY_AREA_LABEL"
  },
  placeholder: {
    labelName: "Enter Commercial Activity Area",
    labelKey: "ES_COMMERCIAL_ACTIVITY_AREA_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  props: {
    disabled: true
  },
  // required: true,
  // minLength: 5,
  // maxLength: 250,
  jsonPath: "Applications[0].applicationDetails.siteReport.commercialActivityArea",
  pattern:_getPattern("height"),
  afterFieldChange: (action, state, dispatch) => {
    if (action.value.length > 7) {
      displayCustomErr(action.componentJsonpath, dispatch, "ES_ERR_MAXLENGTH_7", action.screenKey);
    } else {
      displayCustomErr(action.componentJsonpath, dispatch,"ES_ERR_AREA", action.screenKey);
    }
  }
}

const dairyOrKeepingCattleRadioButton = {
  uiFramework: "custom-containers-local",
  moduleName: "egov-estate",
  componentPath: "RadioGroupContainer",
  gridDefination: {
    xs: 12,
    sm: 6,
  },
  jsonPath: "Applications[0].applicationDetails.siteReport.dairyOrKeepingCattle",
  props: {
    label: {
      name: "Running diary or keeping cattle ?",
      key: "ES_DAIRY_OR_KEEPING_CATTLE_LABEL"
    },
    buttons: [{
        labelName: "Running Dairy",
        labelKey: "ES_COMMON_RUNNING_DAIRY",
        value: true,
      },
      {
        label: "Keeping Cattle",
        labelKey: "ES_COMMON_KEEPING_CATTLE",
        value: false,
      }
    ],
    jsonPath: "Applications[0].applicationDetails.siteReport.runningDairy",
    // required: true,
  },
  // required: true,
  type: "array"
};

const developmentChargesField = {
  label: {
    labelName: "Development charges if any (with rate per sq. ft.)",
    labelKey: "ES_DEVELOPMENT_CHARGES_LABEL"
  },
  placeholder: {
    labelName: "Enter Development charges",
    labelKey: "ES_DEVELOPMENT_CHARGES_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  required: true,
  minLength: 2,
  maxLength: 50,
  jsonPath: "Applications[0].applicationDetails.siteReport.developmentCharges",
  pattern:_getPattern("numeric"),
  afterFieldChange: (action, state, dispatch) => {
    if (action.value.length > 50) {
      displayCustomErr(action.componentJsonpath, dispatch, "ES_ERR_MAXLENGTH_50", action.screenKey);
    } else if(action.value.length < 2) {
      displayCustomErr(action.componentJsonpath, dispatch,"ES_ERR_MIN_CHARGES", action.screenKey);
    }
    else{
      displayCustomErr(action.componentJsonpath, dispatch,"ES_ERR_CHARGES", action.screenKey);
    }
  }
}

const compositionFeesField = {
  label: {
    labelName: "Composition fees if any (with rate per sq. yds.)",
    labelKey: "ES_COMPOSITION_FEES_LABEL"
  },
  placeholder: {
    labelName: "Enter Composition fees",
    labelKey: "ES_COMPOSITION_FEES_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  required: true,
  minLength: 2,
  maxLength: 50,
  jsonPath: "Applications[0].applicationDetails.siteReport.compositionFees",
  pattern:_getPattern("numeric"),
  afterFieldChange: (action, state, dispatch) => {
    if (action.value.length > 50) {
      displayCustomErr(action.componentJsonpath, dispatch, "ES_ERR_MAXLENGTH_50", action.screenKey);
    } else if(action.value.length < 2) {
      displayCustomErr(action.componentJsonpath, dispatch,"ES_ERR_MIN_COMPOSITION_FEES", action.screenKey);
    }
    else{
      displayCustomErr(action.componentJsonpath, dispatch,"ES_ERR_COMPOSITION_FEES", action.screenKey);
    }
  }
}

const compositionFeesUnauthorizedField = {
  label: {
    labelName: "Composition fee for unauthorized construction if any (with per sq. ft.)",
    labelKey: "ES_COMPOSITION_FEES_UNAUTHORIZED_LABEL"
  },
  placeholder: {
    labelName: "Enter Composition fees for unauthorized construction if any (with per sq. ft.)",
    labelKey: "ES_COMPOSITION_FEES_UNAUTHORIZED_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  required: true,
  minLength: 2,
  maxLength: 50,
  pattern:_getPattern("numeric"),
  jsonPath: "Applications[0].applicationDetails.siteReport.compositionFeeUnauthorized",
  afterFieldChange: (action, state, dispatch) => {
    if (action.value.length > 50) {
      displayCustomErr(action.componentJsonpath, dispatch, "ES_ERR_MAXLENGTH_50", action.screenKey);
    } else if(action.value.length < 2) {
      displayCustomErr(action.componentJsonpath, dispatch,"ES_ERR_MIN_COMPOSITION_FEES", action.screenKey);
    }
    else{
      displayCustomErr(action.componentJsonpath, dispatch,"ES_ERR_COMPOSITION_FEES", action.screenKey);
    }
  }
}

const conversionChargesField = {
  label: {
    labelName: "Conversion charges if any (with rate per sq. yds.)",
    labelKey: "ES_CONVERSION_CHARGES_LABEL"
  },
  placeholder: {
    labelName: "Enter conversion charges if any (with rate per sq. yds.)",
    labelKey: "ES_CONVERSION_CHARGES_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  required: true,
  minLength: 2,
  maxLength: 50,
  pattern:_getPattern("numeric"),
  jsonPath: "Applications[0].applicationDetails.siteReport.conversionCharges",
  afterFieldChange: (action, state, dispatch) => {
    if (action.value.length > 50) {
      displayCustomErr(action.componentJsonpath, dispatch, "ES_ERR_MAXLENGTH_50", action.screenKey);
    } else if(action.value.length < 2) {
      displayCustomErr(action.componentJsonpath, dispatch,"ES_ERR_MIN_CONVERSION_FEES", action.screenKey);
    }
    else{
      displayCustomErr(action.componentJsonpath, dispatch,"ES_ERR_CONVERSION_FEES", action.screenKey);
    }
  }
}

const totalChargesField = {
  label: {
    labelName: "Total charges",
    labelKey: "ES_TOTAL_CHARGES_LABEL"
  },
  placeholder: {
    labelName: "Enter total charges",
    labelKey: "ES_TOTAL_CHARGES_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  required: true,
  minLength: 2,
  maxLength: 50,
  pattern:_getPattern("numeric"),
  jsonPath: "Applications[0].applicationDetails.siteReport.totalChanges",
  afterFieldChange: (action, state, dispatch) => {
    if (action.value.length > 50) {
      displayCustomErr(action.componentJsonpath, dispatch, "ES_ERR_MAXLENGTH_50", action.screenKey);
    } else if(action.value.length < 2) {
      displayCustomErr(action.componentJsonpath, dispatch,"ES_ERR_MIN_COMPOSITION_FEES", action.screenKey);
    }
    else{
      displayCustomErr(action.componentJsonpath, dispatch,"ES_ERR_COMPOSITION_FEES", action.screenKey);
    }
  }
}

const dateOfInspectionField = {
  label: {
    labelName: "Date of Inspection",
    labelKey: "ES_DATE_OF_INSPECTION_LABEL"
  },
  placeholder: {
    labelName: "Enter date of inspection",
    labelKey: "ES_DATE_OF_INSPECTION_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  props: {
    inputProps: {
      max: getTodaysDateInYMD()
    }
  },
  required: true,
  minLength: 2,
  maxLength: 50,
  jsonPath: "Applications[0].applicationDetails.siteReport.dateOfInspection"
}

export const siteReportDetails = getCommonCard({
  detailsContainer: getCommonContainer({
    particularsOfHouse: getTextField(particularsOfHouseField),
    houseArea: getTextField(houseAreaField),
    ownership: getTextField(ownershipField),
    possession: getTextField(possessionField),
    modeOfOwnershipField: getTextField(modeOfOwnershipField),
  })
})

const buildingDetailsHeader = getCommonTitle({
  labelName: "Building Details",
  labelKey: "ES_BUILDING_DETAILS_HEADER"
}, {
  style: {
    marginBottom: 18,
    marginTop: 18
  }
})
export const buldingDetails = getCommonCard({
  header: buildingDetailsHeader,
  detailsContainer: getCommonContainer({
    height: getTextField(heightField),
    cantilever: getTextField(cantileverField),
    noOfFloors: getTextField(noOfFloorsField),
    encroachment: getTextField(encroachmentField),
    violation: getTextField(violationField),
    dimensionOfBuilding: getTextField(dimensionOfBuildingField),
    area: getTextField(areaField),
    excessArea: getTextField(excessAreaField),
    isCommercialActivity: isCommercialActivityRadioButton,
    commercialActivityArea: getTextField(commercialActivityAreaField),
    runningDairy: dairyOrKeepingCattleRadioButton,
  })
})


const chargesHeader = getCommonTitle({
  labelName: "Charges",
  labelKey: "ES_CHARGES_HEADER"
}, {
  style: {
    marginBottom: 18,
    marginTop: 18
  }
})
export const charges = getCommonCard({
  header: chargesHeader,
  detailsContainer: getCommonContainer({
    developmentCharges: getTextField(developmentChargesField),
    compositionFees: getTextField(compositionFeesField),
    compositionFeeUnauthorized: getTextField(compositionFeesUnauthorizedField),
    conversionCharges: getTextField(conversionChargesField),
    totalChanges: getTextField(totalChargesField),
    dateOfInspection: getDateField(dateOfInspectionField)
  })
})

const documentList = {
  uiFramework: "custom-containers-local",
  moduleName: "egov-estate",
  componentPath: "DocumentListContainer",
  props: {
    buttonLabel: {
      labelName: "UPLOAD FILE",
      labelKey: "ES_BUTTON_UPLOAD_FILE"
    },
    inputProps: [],
    documentTypePrefix: "ES_",
    documentsJsonPath: "ApplicationsTemp[0].applicationDetails.sampleSiteMap",
    uploadedDocumentsJsonPath: "ApplicationsTemp[0].applicationDetails.sampleSiteMapUploadedDocInRedux",
    tenantIdJsonPath: "Applications[0].tenantId",
    removedJsonPath: "ApplicationsTemp[0].applicationDetails.sampleSiteMapRemovedDoc",
    // excelUrl: "/est-services/auctions/_parse?"
  }
};

export const documentDetails = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Upload Sample Site Map",
      labelKey: "ES_UPLOAD_SAMPLE_SITE_MAP_HEADER"
    },
    {
      style: {
        marginBottom: "18px"
      }
    }
  ),
  documentList
})

const detailsContainer = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "site_report_form"
  },
  children: {
    propertyDetails,
    siteReportDetails,
    buldingDetails,
    charges,
    documentDetails
  },
  visible: true
}

const validateSiteReportForm = (state) => {
  const isSiteReportValid = validateFields(
    "components.div.children.detailsContainer.children.siteReportDetails.children.cardContent.children.detailsContainer.children",
    state,
    store.dispatch,
    "site-report"
  )
  const isBuildingDetailsValid = validateFields(
    "components.div.children.detailsContainer.children.buldingDetails.children.cardContent.children.detailsContainer.children",
    state,
    store.dispatch,
    "site-report"
  )
  const isChargesValid = validateFields(
    "components.div.children.detailsContainer.children.charges.children.cardContent.children.detailsContainer.children",
    state,
    store.dispatch,
    "site-report"
  )

  return (isSiteReportValid && isBuildingDetailsValid && isChargesValid);
}

const siteReport = {
  uiFramework: "material-ui",
  name: "site-report",
  beforeInitScreen: (action, state, dispatch) => {
    beforeInitFn(action, state, dispatch);
    return action
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
        taskStatus: {
          uiFramework: "custom-containers-local",
          moduleName: "egov-estate",
          componentPath: "WorkFlowContainer",
          props: {
            dataPath: "Applications",
            // moduleName: WF_ALLOTMENT_OF_SITE,
            screenName: "site-report",
            validateFn: validateSiteReportForm,
            updateUrl: "/est-services/application/_update",
            style: {
              wordBreak: "break-word"
            }
          }
        },
        detailsContainer
      }
    }
  }
}

export default siteReport;