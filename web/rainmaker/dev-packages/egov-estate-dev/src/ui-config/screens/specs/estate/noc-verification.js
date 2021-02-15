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
  WF_ALLOTMENT_OF_SITE
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
    dispatch(prepareFinalObject("Applications", Applications))
    dispatch(prepareFinalObject("temp[0].removedDocs", removedDocs))
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

const hardCopyDocumentsReceivedDateField = {
  label: {
    labelName: "Hard copy document(s) received date",
    labelKey: "ES_HARD_COPY_DOCUMENTS_RECEIVED_DATE_LABEL"
  },
  placeholder: {
    labelName: "Enter hard copy document(s) received date",
    labelKey: "ES_HARD_COPY_DOCUMENTS_RECEIVED_DATE_PLACEHOLDER"
  },
  pattern: getPattern("Date"),
  jsonPath: "Applications[0].hardCopyDocumentsReceivedDate",
  props: {
    inputProps: {
      max: getTodaysDateInYMD()
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
    ),
    so: getLabelWithValue(
      soLabel, {
        jsonPath: "Applications[0].applicationDetails.owner.transferorDetails.guardianName"
      }
    )
  })
})

const propertyDetails = getCommonCard(propertyInfo(false))

const header = getCommonHeader({
  labelName: "NOC Verification",
  labelKey: "ES_NOC_VERIFICATION_HEADER"
});

const getWhetherWholeHouseHasBeenPurchasedRadioButton = {
  uiFramework: "custom-containers",
  componentPath: "RadioGroupContainer",
  gridDefination: {
    xs: 12,
    sm: 6,
  },
  jsonPath: "Applications[0].applicationDetails.wholeHousePurchased",
  props: {
    label: {
      name: "Whether whole house has been purchased?",
      key: "ES_WHOLE_HOUSE_PURCHASED_LABEL"
    },
    buttons: [{
        labelName: "Yes",
        labelKey: "ES_COMMON_YES",
        value: "true",
      },
      {
        label: "No",
        labelKey: "ES_COMMON_NO",
        value: "false",
      }
    ],
    jsonPath: "Applications[0].applicationDetails.wholeHousePurchased",
    required: true,
  },
  required: true,
  type: "array",
  afterFieldChange: (action, state, dispatch) => {
    dispatch(
      handleField(
        "noc-verification",
        "components.div.children.detailsContainer.children.nocVerificationDetails.children.cardContent.children.detailsContainer.children.sizeOfAreaPurchased",
        "props.disabled",
        (action.value != "false")
      )
    )
    dispatch(
      handleField(
        "noc-verification",
        "components.div.children.detailsContainer.children.nocVerificationDetails.children.cardContent.children.detailsContainer.children.sizeOfAreaPurchased",
        "props.required",
        (action.value != "true")
      )
    )
  }
};

const sizeOfAreaPurchasedField = {
  label: {
    labelName: "The size of area purchased",
    labelKey: "ES_AREA_PURCHASED_LABEL"
  },
  placeholder: {
    labelName: "Enter the size of area purchased",
    labelKey: "ES_AREA_PURCHASED_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  pattern: _getPattern("areaOfProperty"),
  minLength: 2,
  maxLength: 150,
  props: {
    disabled: true
  },
  jsonPath: "Applications[0].applicationDetails.areaPurchased",
  afterFieldChange: (action, state, dispatch) => {
    if (action.value.length > 150) {
        displayCustomErr(action.componentJsonpath, dispatch, "ES_ERR_MAXLENGTH_150", action.screenKey);
    }
    else if(action.value.length < 2){
        displayCustomErr(action.componentJsonpath, dispatch, "ES_ERR_SIZE_OF_PROPERTY_MINLENGTH_2", action.screenKey);
    }
    else {
        displayCustomErr(action.componentJsonpath, dispatch,"ES_ERR_SIZE_OF_PROPERTY_NUMBER",action.screenKey);
    }
}
}

const khasraNoField = {
  label: {
    labelName: "Khasra No.",
    labelKey: "ES_KHASRA_NO_LABEL"
  },
  placeholder: {
    labelName: "Enter Khasra No.",
    labelKey: "ES_KHASRA_NO_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  required: true,
  minLength: 2,
  maxLength: 150,
  pattern:_getPattern("numeric-firstdigit-nonzero"),
  jsonPath: "Applications[0].applicationDetails.khasraNo",
  afterFieldChange: (action, state, dispatch) => {
    if (action.value.length > 150) {
        displayCustomErr(action.componentJsonpath, dispatch, "ES_ERR_MAXLENGTH_150", action.screenKey);
    }
    else if(action.value.length < 2){
        displayCustomErr(action.componentJsonpath, dispatch, "ES_ERR_KHARSA_NO_MINLENGTH_2", action.screenKey);
    }
    else {
        displayCustomErr(action.componentJsonpath, dispatch,"ES_ERR_KHARSA_NO_NUMBER",action.screenKey);
    }
}
}

const hadbastNoField = {
  label: {
    labelName: "Hadbast No.",
    labelKey: "ES_HADBAST_NO_LABEL"
  },
  placeholder: {
    labelName: "Enter Hadbast No.",
    labelKey: "ES_HADBAST_NO_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  required: true,
  minLength: 2,
  maxLength: 150,
  pattern:_getPattern("numeric-firstdigit-nonzero"),
  jsonPath: "Applications[0].applicationDetails.hadbastNo",
  afterFieldChange: (action, state, dispatch) => {
    if (action.value.length > 150) {
        displayCustomErr(action.componentJsonpath, dispatch, "ES_ERR_MAXLENGTH_150", action.screenKey);
    }
    else if(action.value.length < 2){
        displayCustomErr(action.componentJsonpath, dispatch, "ES_ERR_HADBAST_NO_MINLENGTH_2", action.screenKey);
    }
    else {
        displayCustomErr(action.componentJsonpath, dispatch,"ES_ERR_HADBAST_NO_NUMBER",action.screenKey);
    }
}
}

const mutationNoField = {
  label: {
    labelName: "Mutation No.",
    labelKey: "ES_MUTATION_NO_LABEL"
  },
  placeholder: {
    labelName: "Enter Mutation No.",
    labelKey: "ES_MUTATION_NO_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  required: true,
  minLength: 2,
  maxLength: 150,
  pattern:_getPattern("numeric-firstdigit-nonzero"),
  jsonPath: "Applications[0].applicationDetails.mutationNo",
  afterFieldChange: (action, state, dispatch) => {
    if (action.value.length > 150) {
        displayCustomErr(action.componentJsonpath, dispatch, "ES_ERR_MAXLENGTH_150", action.screenKey);
    }
    else if(action.value.length < 2){
        displayCustomErr(action.componentJsonpath, dispatch, "ES_ERR_MUTATION_NO_MINLENGTH_2", action.screenKey);
    }
    else {
        displayCustomErr(action.componentJsonpath, dispatch,"ES_ERR_MUTATION_NO_NUMBER",action.screenKey);
    }
}
}

const khewatNoField = {
  label: {
    labelName: "Khewat No.",
    labelKey: "ES_KHEWAT_NO_LABEL"
  },
  placeholder: {
    labelName: "Enter Khewat No.",
    labelKey: "ES_KHEWAT_NO_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  required: true,
  minLength: 2,
  maxLength: 150,
  pattern:_getPattern("numeric-firstdigit-nonzero"),
  jsonPath: "Applications[0].applicationDetails.khewatNo",
  afterFieldChange: (action, state, dispatch) => {
    if (action.value.length > 150) {
        displayCustomErr(action.componentJsonpath, dispatch, "ES_ERR_MAXLENGTH_150", action.screenKey);
    }
    else if(action.value.length < 2){
        displayCustomErr(action.componentJsonpath, dispatch, "ES_ERR_KHEWAT_NO_MINLENGTH_2", action.screenKey);
    }
    else {
        displayCustomErr(action.componentJsonpath, dispatch,"ES_ERR_KHEWAT_NO_NUMBER",action.screenKey);
    }
}
}

const housesOfEastField = {
  label: {
    labelName: "Area/ House under consideration is bounded by the houses of East",
    labelKey: "ES_HOUSES_OF_EAST_LABEL"
  },
  placeholder: {
    labelName: "Enter Area/ House under consideration is bounded by the houses of East",
    labelKey: "ES_HOUSES_OF_EAST_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  required: true,
  minLength: 2,
  maxLength: 150,
  pattern:_getPattern("numeric-firstdigit-nonzero"),
  jsonPath: "Applications[0].applicationDetails.boundedOnEast",
  afterFieldChange: (action, state, dispatch) => {
    if (action.value.length > 150) {
        displayCustomErr(action.componentJsonpath, dispatch, "ES_ERR_MAXLENGTH_150", action.screenKey);
    }
    else if(action.value.length < 2){
        displayCustomErr(action.componentJsonpath, dispatch, "ES_ERR_HOUSE_OF_EAST_MINLENGTH_2", action.screenKey);
    }
    else {
        displayCustomErr(action.componentJsonpath, dispatch,"ES_ERR_HOUSE_OF_EAST_NUMBER",action.screenKey);
    }
}
}

const housesOfWestField = {
  label: {
    labelName: "Area/ House under consideration is bounded by the houses of West",
    labelKey: "ES_HOUSES_OF_WEST_LABEL"
  },
  placeholder: {
    labelName: "Enter Area/ House under consideration is bounded by the houses of West",
    labelKey: "ES_HOUSES_OF_WEST_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  required: true,
  minLength: 2,
  maxLength: 150,
  pattern:_getPattern("numeric-firstdigit-nonzero"),
  jsonPath: "Applications[0].applicationDetails.boundedOnWest",
  afterFieldChange: (action, state, dispatch) => {
    if (action.value.length > 150) {
        displayCustomErr(action.componentJsonpath, dispatch, "ES_ERR_MAXLENGTH_150", action.screenKey);
    }
    else if(action.value.length < 2){
        displayCustomErr(action.componentJsonpath, dispatch, "ES_ERR_HOUSE_OF_EAST_MINLENGTH_2", action.screenKey);
    }
    else {
        displayCustomErr(action.componentJsonpath, dispatch,"ES_ERR_HOUSE_OF_EAST_NUMBER",action.screenKey);
    }
}
}

const housesOfNorthField = {
  label: {
    labelName: "Area/ House under consideration is bounded by the houses of North",
    labelKey: "ES_HOUSES_OF_NORTH_LABEL"
  },
  placeholder: {
    labelName: "Enter Area/ House under consideration is bounded by the houses of North",
    labelKey: "ES_HOUSES_OF_NORTH_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  required: true,
  minLength: 2,
  maxLength: 150,
  pattern:_getPattern("numeric-firstdigit-nonzero"),
  jsonPath: "Applications[0].applicationDetails.boundedOnNorth",
  afterFieldChange: (action, state, dispatch) => {
    if (action.value.length > 150) {
        displayCustomErr(action.componentJsonpath, dispatch, "ES_ERR_MAXLENGTH_150", action.screenKey);
    }
    else if(action.value.length < 2){
        displayCustomErr(action.componentJsonpath, dispatch, "ES_ERR_HOUSE_OF_EAST_MINLENGTH_2", action.screenKey);
    }
    else {
        displayCustomErr(action.componentJsonpath, dispatch,"ES_ERR_HOUSE_OF_EAST_NUMBER",action.screenKey);
    }
}
}

const housesOfSouthField = {
  label: {
    labelName: "Area/ House under consideration is bounded by the houses of South",
    labelKey: "ES_HOUSES_OF_SOUTH_LABEL"
  },
  placeholder: {
    labelName: "Enter Area/ House under consideration is bounded by the houses of South",
    labelKey: "ES_HOUSES_OF_SOUTH_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  required: true,
  minLength: 2,
  maxLength: 150,
  pattern:_getPattern("numeric-firstdigit-nonzero"),
  jsonPath: "Applications[0].applicationDetails.boundedOnSouth",
  afterFieldChange: (action, state, dispatch) => {
    if (action.value.length > 150) {
        displayCustomErr(action.componentJsonpath, dispatch, "ES_ERR_MAXLENGTH_150", action.screenKey);
    }
    else if(action.value.length < 2){
        displayCustomErr(action.componentJsonpath, dispatch, "ES_ERR_HOUSE_OF_EAST_MINLENGTH_2", action.screenKey);
    }
    else {
        displayCustomErr(action.componentJsonpath, dispatch,"ES_ERR_HOUSE_OF_EAST_NUMBER",action.screenKey);
    }
}
}

const widthOfFrontElevationOfHouseField = {
  label: {
    labelName: "Width of the front elevation of house (in ft.)",
    labelKey: "ES_WIDTH_OF_FRONT_ELEVATION_OF_HOUSE_LABEL"
  },
  placeholder: {
    labelName: "Enter width of the front elevation of house (in ft.)",
    labelKey: "ES_WIDTH_OF_FRONT_ELEVATION_OF_HOUSE_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  required: true,
  minLength: 2,
  maxLength: 150,
  pattern:_getPattern("numeric-firstdigit-nonzero"),
  jsonPath: "Applications[0].applicationDetails.frontElevationWidth",
  afterFieldChange: (action, state, dispatch) => {
    if (action.value.length > 150) {
        displayCustomErr(action.componentJsonpath, dispatch, "ES_ERR_MAXLENGTH_150", action.screenKey);
    }
    else if(action.value.length < 2){
        displayCustomErr(action.componentJsonpath, dispatch, "ES_ERR_WIDTH_MINLENGTH_2", action.screenKey);
    }
    else {
        displayCustomErr(action.componentJsonpath, dispatch,"ES_ERR_WIDTH_NUMBER",action.screenKey);
    }
}
}

const totalWidthOfPublicStreetField = {
  label: {
    labelName: "Total width of the public street (in ft.)",
    labelKey: "ES_TOTAL_WIDTH_OF_PUBLIC_STREET_LABEL"
  },
  placeholder: {
    labelName: "Enter total width of the public street (in ft.)",
    labelKey: "ES_TOTAL_WIDTH_OF_PUBLIC_STREET_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  required: true,
  minLength: 2,
  maxLength: 150,
  pattern:_getPattern("numeric-firstdigit-nonzero"),
  jsonPath: "Applications[0].applicationDetails.streetWidth",
  afterFieldChange: (action, state, dispatch) => {
    if (action.value.length > 150) {
        displayCustomErr(action.componentJsonpath, dispatch, "ES_ERR_MAXLENGTH_150", action.screenKey);
    }
    else if(action.value.length < 2){
        displayCustomErr(action.componentJsonpath, dispatch, "ES_ERR_WIDTH_OF_PUBLIC_STREET_MINLENGTH_2", action.screenKey);
    }
    else {
        displayCustomErr(action.componentJsonpath, dispatch,"ES_ERR_WIDTH_OF_PUBLIC_STREET_NUMBER",action.screenKey);
    }
}
}

const getWhetherThereIsStreetOnOtherSideOfHouseRadioButton = {
  uiFramework: "custom-containers",
  componentPath: "RadioGroupContainer",
  gridDefination: {
    xs: 12,
    sm: 6,
  },
  jsonPath: "Applications[0].applicationDetails.otherSideStreet",
  props: {
    label: {
      name: "Whether there is street on the other side of house?",
      key: "ES_WHETHER_THERE_IS_STREET_ON_OTHER_SIDE_OF_HOUSE_LABEL"
    },
    buttons: [{
        labelName: "Yes",
        labelKey: "ES_COMMON_YES",
        value: "true",
      },
      {
        label: "No",
        labelKey: "ES_COMMON_NO",
        value: "false",
      }
    ],
    jsonPath: "Applications[0].applicationDetails.otherSideStreet",
    required: true,
  },
  required: true,
  type: "array",
  afterFieldChange: (action, state, dispatch) => {
    dispatch(
      handleField(
        "noc-verification",
        "components.div.children.detailsContainer.children.nocVerificationDetails.children.cardContent.children.detailsContainer.children.widthOfStreetWithLengthOfHouse",
        "visible",
        !!(action.value == "true")
      )
    )
  }
};

const widthOfStreetWithLengthOfHouseField = {
  label: {
    labelName: "Width of the same with the length of house adjoining to that side of street",
    labelKey: "ES_WIDTH_OF_THE_STREET_WITH_LENGTH_OF_HOUSE_LABEL"
  },
  placeholder: {
    labelName: "Enter width of the same with the length of house adjoining to that side of street",
    labelKey: "ES_WIDTH_OF_THE_STREET_WITH_LENGTH_OF_HOUSE_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  // required: true,
  visible: false,
  jsonPath: "Applications[0].applicationDetails.sameWidthOfSideStreet",
  pattern:_getPattern("width"),
  afterFieldChange: (action, state, dispatch) => {
    if (action.value.length > 50) {
        displayCustomErr(action.componentJsonpath, dispatch, "ES_ERR_MAXLENGTH_50", action.screenKey);
    }
    // else if(action.value.length < 2){
    //     displayCustomErr(action.componentJsonpath, dispatch, "ES_ERR_WIDTH_MINLENGTH_2", action.screenKey);
    // }
    else {
        displayCustomErr(action.componentJsonpath, dispatch,"ES_ERR_WIDTH_NUMBER",action.screenKey);
    }
}
}

const getWhetherAreaOfHouseAtSiteIsSameRadioButton = {
  uiFramework: "custom-containers",
  componentPath: "RadioGroupContainer",
  gridDefination: {
    xs: 12,
    sm: 6,
  },
  jsonPath: "Applications[0].applicationDetails.areaIsSame",
  props: {
    label: {
      name: "Whether the area of the house at site is the same",
      key: "ES_WHETHER_AREA_OF_HOUSE_AT_SITE_IS_SAME_LABEL"
    },
    buttons: [{
        labelName: "Yes",
        labelKey: "ES_COMMON_YES",
        value: "true",
      },
      {
        label: "No",
        labelKey: "ES_COMMON_NO",
        value: "false",
      }
    ],
    jsonPath: "Applications[0].applicationDetails.areaIsSame",
    required: true,
  },
  required: true,
  type: "array",
};

const variationDetailField = {
  label: {
    labelName: "If there are any variations given, detail thereof",
    labelKey: "ES_VARIATION_DETAIL_LABEL"
  },
  placeholder: {
    labelName: "Enter If there are any variations given, detail thereof",
    labelKey: "ES_VARIATION_DETAIL_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  pattern:_getPattern("variationdetail"),
  minLength: 0,
  maxLength: 150,
  required: false,
  jsonPath: "Applications[0].applicationDetails.varations",
  afterFieldChange: (action, state, dispatch) => {
    if (action.value.length > 150) {
        displayCustomErr(action.componentJsonpath, dispatch, "ES_ERR_MAXLENGTH_150", action.screenKey);
    }
    // else if(action.value.length < 2){
    //     displayCustomErr(action.componentJsonpath, dispatch, "ES_ERR_VALIDATION_DETAIL_MINLENGTH_2", action.screenKey);
    // }
    else {
        displayCustomErr(action.componentJsonpath, dispatch,"ES_ERR_VALIDATION_DETAIL_NUMBER",action.screenKey);
    }
}
}

const getWhetherHouseWithinLalLakirRadioButton = {
  uiFramework: "custom-containers",
  componentPath: "RadioGroupContainer",
  gridDefination: {
    xs: 12,
    sm: 6,
  },
  jsonPath: "Applications[0].applicationDetails.lalLakirOrUnacquiredAbadi",
  props: {
    label: {
      name: "Whether the house/ plot is within the Lal Lakir or within the unacquired abadi area?",
      key: "ES_WHETHER_HOUSE_WITHIN_LAL_LAKIR_LABEL"
    },
    buttons: [{
        labelName: "Yes",
        labelKey: "ES_COMMON_YES",
        value: "true",
      },
      {
        label: "No",
        labelKey: "ES_COMMON_NO",
        value: "false",
      }
    ],
    jsonPath: "Applications[0].applicationDetails.lalLakirOrUnacquiredAbadi",
    required: true,
  },
  required: true,
  type: "array",
};

const getElectricityMeterExistRadioButton = {
  uiFramework: "custom-containers",
  componentPath: "RadioGroupContainer",
  gridDefination: {
    xs: 12,
    sm: 6,
  },
  jsonPath: "Applications[0].applicationDetails.electricityMeterExists",
  props: {
    label: {
      name: "Whether electricity meter exists?",
      key: "ES_WHETHER_ELECTRICITY_METER_EXIST_LABEL"
    },
    buttons: [{
        labelName: "Yes",
        labelKey: "ES_COMMON_YES",
        value: "true",
      },
      {
        label: "No",
        labelKey: "ES_COMMON_NO",
        value: "false",
      }
    ],
    jsonPath: "Applications[0].applicationDetails.electricityMeterExists",
    required: true,
  },
  required: true,
  type: "array",
};

const getWaterMeterExistRadioButton = {
  uiFramework: "custom-containers",
  componentPath: "RadioGroupContainer",
  gridDefination: {
    xs: 12,
    sm: 6,
  },
  jsonPath: "Applications[0].applicationDetails.waterMeterExists",
  props: {
    label: {
      name: "Whether water meter exists?",
      key: "ES_WHETHER_WATER_METER_EXIST_LABEL"
    },
    buttons: [{
        labelName: "Yes",
        labelKey: "ES_COMMON_YES",
        value: "true",
      },
      {
        label: "No",
        labelKey: "ES_COMMON_NO",
        value: "false",
      }
    ],
    jsonPath: "Applications[0].applicationDetails.waterMeterExists",
    required: true,
  },
  required: true,
  type: "array",
};

const heightOfBuildingField = {
  label: {
    labelName: "The height of the building excluding mumty",
    labelKey: "ES_HEIGHT_OF_BUILDING_LABEL"
  },
  placeholder: {
    labelName: "Enter The height of the building excluding mumty",
    labelKey: "ES_HEIGHT_OF_BUILDING_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  required: true,
  minLength: 2,
  maxLength: 150,
  pattern:_getPattern("numeric-firstdigit-nonzero"),
  jsonPath: "Applications[0].applicationDetails.heightExcludingMumty",
  afterFieldChange: (action, state, dispatch) => {
    if (action.value.length > 150) {
        displayCustomErr(action.componentJsonpath, dispatch, "ES_ERR_MAXLENGTH_150", action.screenKey);
    }
    else if(action.value.length < 2){
        displayCustomErr(action.componentJsonpath, dispatch, "ES_ERR_HIEGHT_OF_BUILDING_MINLENGTH_2", action.screenKey);
    }
    else {
        displayCustomErr(action.componentJsonpath, dispatch,"ES_ERR_HIEGHT_OF_BUILDING_NUMBER",action.screenKey);
    }
}
}

const heightOfMumtyField = {
  label: {
    labelName: "The height of mumty",
    labelKey: "ES_HEIGHT_OF_MUMTY_LABEL"
  },
  placeholder: {
    labelName: "Enter The height of mumty",
    labelKey: "ES_HEIGHT_OF_MUMTY_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  required: true,
  minLength: 2,
  maxLength: 150,
  pattern:_getPattern("numeric-firstdigit-nonzero"),
  jsonPath: "Applications[0].applicationDetails.heightofMumty",
  afterFieldChange: (action, state, dispatch) => {
    if (action.value.length > 150) {
        displayCustomErr(action.componentJsonpath, dispatch, "ES_ERR_MAXLENGTH_150", action.screenKey);
    }
    else if(action.value.length < 2){
      displayCustomErr(action.componentJsonpath, dispatch, "ES_ERR_HIEGHT_OF_MUNTY_MINLENGTH_2", action.screenKey);
  }
    else {
        displayCustomErr(action.componentJsonpath, dispatch,"ES_ERR_HIEGHT_OF_BUILDING_NUMBER",action.screenKey);
    }
}
}

const getCattleKeptInPremisesRadioButton = {
  uiFramework: "custom-containers",
  componentPath: "RadioGroupContainer",
  gridDefination: {
    xs: 12,
    sm: 6,
  },
  jsonPath: "Applications[0].applicationDetails.milkCattleInPremises",
  props: {
    label: {
      name: "Are any milk cattle kept in the premises?",
      key: "ES_CATTLE_KEPT_IN_PREMISES_LABEL"
    },
    buttons: [{
        labelName: "Yes",
        labelKey: "ES_COMMON_YES",
        value: "true",
      },
      {
        label: "No",
        labelKey: "ES_COMMON_NO",
        value: "false",
      }
    ],
    jsonPath: "Applications[0].applicationDetails.milkCattleInPremises",
    required: true,
  },
  required: true,
  type: "array",
};

const getAnyCantileverRadioButton = {
  uiFramework: "custom-containers",
  componentPath: "RadioGroupContainer",
  gridDefination: {
    xs: 12,
    sm: 6,
  },
  jsonPath: "Applications[0].applicationDetails.cantileverOrprojection",
  props: {
    label: {
      name: "Is there any cantilever/ projection more than 3 feet over hanging structure existing at site falling over the Govt. land public street?",
      key: "ES_ANY_CANTILEVER_LABEL"
    },
    buttons: [{
        labelName: "Yes",
        labelKey: "ES_COMMON_YES",
        value: "true",
      },
      {
        label: "No",
        labelKey: "ES_COMMON_NO",
        value: "false",
      }
    ],
    jsonPath: "Applications[0].applicationDetails.cantileverOrprojection",
    required: true,
  },
  required: true,
  type: "array",
  afterFieldChange: (action, state, dispatch) => {
    dispatch(
      handleField(
        "noc-verification",
        "components.div.children.detailsContainer.children.nocVerificationDetails.children.cardContent.children.detailsContainer.children.cantileverDetails",
        "visible", 
        !!(action.value == "true")
      )
    )
  }
};

const cantileverDetailsField = {
  label: {
    labelName: "Cantilever Details",
    labelKey: "ES_CANTILEVER_DETAILS_LABEL"
  },
  placeholder: {
    labelName: "Enter Cantilever Details",
    labelKey: "ES_CANTILEVER_DETAILS_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  required: false,
  visible: false,
  minLength: 0,
  maxLength: 150,
  pattern:_getPattern("variationdetail"),
  jsonPath: "Applications[0].applicationDetails.cantileverOrprojectionDetails",
  afterFieldChange: (action, state, dispatch) => {
    if (action.value.length > 150) {
        displayCustomErr(action.componentJsonpath, dispatch, "ES_ERR_MAXLENGTH_150", action.screenKey);
    }
    else {
        displayCustomErr(action.componentJsonpath, dispatch,"ES_ERR_CANTLIVER_DETAILS",action.screenKey);
    }
}
}

const getAnyCommercialActivityGoingOnRadioButton = {
  uiFramework: "custom-containers",
  componentPath: "RadioGroupContainer",
  gridDefination: {
    xs: 12,
    sm: 6,
  },
  jsonPath: "Applications[0].applicationDetails.commercialActivity",
  props: {
    label: {
      name: "Whether any commercial activity is going on Ground/ 1st floor/ 2nd floor of the house?",
      key: "ES_ANY_COMMERCIAL_ACTIVITY_GOING_ON_LABEL"
    },
    buttons: [{
        labelName: "Yes",
        labelKey: "ES_COMMON_YES",
        value: "true",
      },
      {
        label: "No",
        labelKey: "ES_COMMON_NO",
        value: "false",
      }
    ],
    jsonPath: "Applications[0].applicationDetails.commercialActivity",
    required: true,
  },
  required: true,
  type: "array",
};

const getAnyBasementsOnRadioButton = {
  uiFramework: "custom-containers",
  componentPath: "RadioGroupContainer",
  gridDefination: {
    xs: 12,
    sm: 6,
  },
  jsonPath: "Applications[0].applicationDetails.basement",
  props: {
    label: {
      name: "Whether there exist any basements to the house?",
      key: "ES_ANY_BASEMENTS_LABEL"
    },
    buttons: [{
        labelName: "Yes",
        labelKey: "ES_COMMON_YES",
        value: "true",
      },
      {
        label: "No",
        labelKey: "ES_COMMON_NO",
        value: "false",
      }
    ],
    jsonPath: "Applications[0].applicationDetails.basement",
    required: true,
  },
  required: true,
  type: "array",
};

const otherViolationDetailsField = {
  label: {
    labelName: "Other violation, if any, give details thereof",
    labelKey: "ES_OTHER_VIOLATION_DETAILS_LABEL"
  },
  placeholder: {
    labelName: "Enter other violation",
    labelKey: "ES_OTHER_VIOLATION_DETAILS_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  required: true,
  minLength: 5,
  maxLength: 150,
  jsonPath: "Applications[0].applicationDetails.otherViolations",
  afterFieldChange: (action, state, dispatch) => {
    if (action.value.length > 150) {
        displayCustomErr(action.componentJsonpath, dispatch, "ES_ERR_MAXLENGTH_150", action.screenKey);
    }
    else if(action.value.length < 5){
        displayCustomErr(action.componentJsonpath, dispatch, "ES_ERR_OTHER_VIOLATION_DETAIL_5", action.screenKey);
    }
    else {
        displayCustomErr(action.componentJsonpath, dispatch,"ES_ERR_OTHER_VIOLATION_DETAIL",action.screenKey);
    }
}
}

const getRecommendedForIssueOfNocOnRadioButton = {
  uiFramework: "custom-containers",
  componentPath: "RadioGroupContainer",
  gridDefination: {
    xs: 12,
    sm: 6,
  },
  jsonPath: "Applications[0].applicationDetails.issueOfNoc",
  props: {
    label: {
      name: "Whether recommended for issue of NOC or not?",
      key: "ES_RECOMMENDED_FOR_ISSUE_OF_NOC_LABEL"
    },
    buttons: [{
        labelName: "Yes",
        labelKey: "ES_COMMON_YES",
        value: "true",
      },
      {
        label: "No",
        labelKey: "ES_COMMON_NO",
        value: "false",
      }
    ],
    jsonPath: "Applications[0].applicationDetails.issueOfNoc",
    required: true,
  },
  required: true,
  type: "array",
  afterFieldChange: (action, state, dispatch) => {
    dispatch(
      handleField(
        "noc-verification",
        "components.div.children.detailsContainer.children.nocVerificationDetails.children.cardContent.children.detailsContainer.children.reasonForNotIssuingNoc",
        "visible",
        !!(action.value == "false")
      )
    )
  }
};

const reasonForNotIssuingNocField = {
  label: {
    labelName: "Reason for not issuing NOC",
    labelKey: "ES_REASON_FOR_NOT_ISSUING_NOC_LABEL"
  },
  placeholder: {
    labelName: "Enter reason for not issuing NOC",
    labelKey: "ES_REASON_FOR_NOT_ISSUING_NOC_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  pattern: _getPattern("NocReason"),
  // required: true,
  // minLength: 5,
  // maxLength: 150,
  jsonPath: "Applications[0].applicationDetails.issueOfNocDetails",
  errorMessage:"ES_ERR_REASON_FOR_NOC",
  afterFieldChange: (action, state, dispatch) => {
if(action.value.length ===0){
  dispatch(
    handleField(
      action.screenKey,
      "components.div.children.detailsContainer.children.nocVerificationDetails.children.cardContent.children.detailsContainer.children.reasonForNotIssuingNoc",
      "props.error",
      false
    )
  )
  dispatch(
    handleField(
      action.screenKey,
      "components.div.children.detailsContainer.children.nocVerificationDetails.children.cardContent.children.detailsContainer.children.reasonForNotIssuingNoc",
      "props.helperText",
      ""
    )
  )
}
  }
}

const getArchitectsReportRadioButton = {
  uiFramework: "custom-containers",
  componentPath: "RadioGroupContainer",
  gridDefination: {
    xs: 12,
    sm: 6,
  },
  jsonPath: "Applications[0].applicationDetails.ArchitectsReport",
  props: {
    label: {
      name: "Architect’s report, whether recommended for NOC or not?",
      key: "ES_ARCHITECTS_REPORT_LABEL"
    },
    buttons: [{
        labelName: "Yes",
        labelKey: "ES_COMMON_YES",
        value: "true",
      },
      {
        label: "No",
        labelKey: "ES_COMMON_NO",
        value: "false",
      }
    ],
    jsonPath: "Applications[0].applicationDetails.architectsReport",
    required: true,
  },
  required: true,
  type: "array",
};

const getFireNocRadioButton = {
  uiFramework: "custom-containers",
  componentPath: "RadioGroupContainer",
  gridDefination: {
    xs: 12,
    sm: 6,
  },
  jsonPath: "Applications[0].applicationDetails.fireNoc",
  props: {
    label: {
      name: "Fire NOC for commercial buildings?",
      key: "ES_FIRE_NOC_LABEL"
    },
    buttons: [{
        labelName: "Yes",
        labelKey: "ES_COMMON_YES",
        value: "true",
      },
      {
        label: "No",
        labelKey: "ES_COMMON_NO",
        value: "false",
      }
    ],
    jsonPath: "Applications[0].applicationDetails.fireNoc",
    required: true,
  },
  required: true,
  type: "array",
};

const dateOfVisitField = {
  label: {
    labelName: "Date of Visit",
    labelKey: "ES_DATE_OF_VISIT_LABEL"
  },
  placeholder: {
    labelName: "Enter Date of Visit",
    labelKey: "ES_DATE_OF_VISIT_PLACEHOLDER"
  },
  required: true,
  pattern: getPattern("Date"),
  jsonPath: "Applications[0].applicationDetails.dateOfVisit",
  props: {
    inputProps: {
      max: getTodaysDateInYMD()
    }
  }
}

export const commentField = {
  label: {
    labelName: "Comment",
    labelKey: "ES_COMMENT_LABEL"
  },
  placeholder: {
    labelName: "Enter Comment",
    labelKey: "ES_COMMENT_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  // required: true,
  props: {
    multiline: true,
    rows: 2
  },
  jsonPath: "Applications[0].comments",
  errorMessage:"ERR_COURT_DETAILS_250_CHARACTERS",
  pattern: _getPattern("courtCase")
}

export const nocVerificationDetails = getCommonCard({
  detailsContainer: getCommonContainer({
    hardCopyDocumentsReceivedDate: getDateField(hardCopyDocumentsReceivedDateField),
    houseHasBeenPurchased: getWhetherWholeHouseHasBeenPurchasedRadioButton,
    sizeOfAreaPurchased: getTextField(sizeOfAreaPurchasedField),
    khasraNo: getTextField(khasraNoField),
    hadbastNo: getTextField(hadbastNoField),
    mutationNo: getTextField(mutationNoField),
    khewatNo: getTextField(khewatNoField),
    housesOfEast: getTextField(housesOfEastField),
    housesOfWest: getTextField(housesOfWestField),
    housesOfNorth: getTextField(housesOfNorthField),
    housesOfSouth: getTextField(housesOfSouthField),
    widthOfFrontElevationOfHouse: getTextField(widthOfFrontElevationOfHouseField),
    totalWidthOfPublicStreet: getTextField(totalWidthOfPublicStreetField),
    streetOnOtherSideOfHouse: getWhetherThereIsStreetOnOtherSideOfHouseRadioButton,
    widthOfStreetWithLengthOfHouse: getTextField(widthOfStreetWithLengthOfHouseField),
    areaOfHouseAtSiteIsSame: getWhetherAreaOfHouseAtSiteIsSameRadioButton,
    variationDetail: getTextField(variationDetailField),
    houseWithinLalLakir: getWhetherHouseWithinLalLakirRadioButton,
    electricityMeterExists: getElectricityMeterExistRadioButton,
    waterMeterExists: getWaterMeterExistRadioButton,
    heightOfBuilding: getTextField(heightOfBuildingField),
    heightOfMumty: getTextField(heightOfMumtyField),
    cattleKeptInPremises: getCattleKeptInPremisesRadioButton,
    anyCantilever: getAnyCantileverRadioButton,
    cantileverDetails: getTextField(cantileverDetailsField),
    commercialActivityGoingOn: getAnyCommercialActivityGoingOnRadioButton,
    anyBasements: getAnyBasementsOnRadioButton,
    otherViolationDetails: getTextField(otherViolationDetailsField),
    recommendedForIssueOfNoc: getRecommendedForIssueOfNocOnRadioButton,
    reasonForNotIssuingNoc: getTextField(reasonForNotIssuingNocField),
    architectsReport: getArchitectsReportRadioButton,
    fireNoc: getFireNocRadioButton,
    dateOfVisit: getDateField(dateOfVisitField),
    comment: getTextField(commentField)
  })
})

const detailsContainer = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form1"
  },
  children: {
    propertyDetails,
    nocVerificationDetails
  },
  visible: true
}

const validateNocForm = (state) => {
  const isNocVerificationDetailValid = validateFields(
    "components.div.children.detailsContainer.children.nocVerificationDetails.children.cardContent.children.detailsContainer.children",
    state,
    store.dispatch,
    "noc-verification"
  )

  return isNocVerificationDetailValid;
}

const nocVerification = {
  uiFramework: "material-ui",
  name: "noc-verification",
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
            screenName: "noc-verification",
            validateFn: validateNocForm,
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

export default nocVerification;