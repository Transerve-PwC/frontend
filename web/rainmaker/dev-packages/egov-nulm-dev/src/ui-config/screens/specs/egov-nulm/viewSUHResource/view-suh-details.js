import {
  getCommonContainer,
  getCommonGrayCard,
  getCommonSubHeader,
  getLabel,
  getLabelWithValue
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";

const gotoCreatePage = (state, dispatch) => {
   const createUrl = `/egov-nulm/create-suh?step=0`;
  dispatch(setRoute(createUrl));
};

export const getSuhDetailsView = (isReview = true) => {
  return getCommonGrayCard({
    headerDiv: {
      uiFramework: "custom-atoms",
      componentPath: "Container",
      props: {
        style: { marginBottom: "10px" }
      },
      children: {
        header: {
          gridDefination: {
            xs: 12,
            sm: 10
          },
          ...getCommonSubHeader({
            labelName: "SUH Details",
            labelKey: "NULM_SUH_DETAILS"
          })
        },
        editSection: {
          componentPath: "Button",
          props: {
            color: "primary"
          },
          visible: isReview,
          gridDefination: {
            xs: 12,
            sm: 2,
            align: "right"
          },
          children: {
            editIcon: {
              uiFramework: "custom-atoms",
              componentPath: "Icon",
              props: {
                iconName: "edit"
              }
            },
            buttonLabel: getLabel({
              labelName: "Edit",
              labelKey: "HR_SUMMARY_EDIT"
            })
          },
          onClickDefination: {
            action: "condition",
            callBack: gotoCreatePage
          }
        }
      }
    },
    viewOne: getCommonContainer({
      nameOfShelter: getLabelWithValue(
        {
          labelName: "Name of shelter",
          labelKey: "NULM_SUH_OF_SHELTER"
        },
        { jsonPath: "NulmSuhRequest.nameOfShelter" }
      ),
      address: getLabelWithValue(
        {
          labelName: "Address",
          labelKey: "NULM_SUH_ADDRESS"
        },
        { jsonPath: "NulmSuhRequest.address" }
      ),
      shelterBackground: getLabelWithValue(
        {
          labelName: "Shelter background",
          labelKey: "NULM_SUH_SHELTER_BCKGROUND"
        },
        { jsonPath: "NulmSuhRequest.shelterBackground" }
      ),
      
      category: getLabelWithValue(
        {
          labelName: "category",
          labelKey: "NULM_SUH_CATEGORY"
        },
        { jsonPath: "NulmSuhRequest.category" }
      ),

      weatherCondition: getLabelWithValue(
        {
          labelName: "All weather conditioned classification",
          labelKey: "NULM_SUH_ALL_WEATHER_CONDITIONED_CLASSIFICATION"
        },
        { jsonPath: "NulmSuhRequest.weatherCondition" }
      ),

      shelterClassification: getLabelWithValue(
        {
          labelName: "classification of shelter",
          labelKey: "NULM_SUH_CLASSIFICATION_OF_SHELTER"
        },
        { jsonPath: "NulmSuhRequest.shelterClassification" }
      ),
      otherClassification: getLabelWithValue(
        {
          labelName: "Any other classification if any",
          labelKey: "NULM_SUH_ANY_OTHER_CLASSIFICATION_IF_ANY"
        },
        { jsonPath: "NulmSuhRequest.otherClassification" }
      ),
      ownership: getLabelWithValue(
        {
          labelName: "ownership",
          labelKey: "NULM_SUH_OWNERSHIP"
        },
        { jsonPath: "NulmSuhRequest.ownership" }
      ),

      operationAndManagementOfShelters: getLabelWithValue(
        {
          labelName: "Operation & management of shelters",
          labelKey: "NULM_SUH_OPERATION_MANAGEMENT_OF_SHELTERS"
        },
        { jsonPath: "NulmSuhRequest.operationAndManagementOfShelters" }
      ),
      area: getLabelWithValue(
        {
          labelName: "area",
          labelKey: "NULM_SUH_AREA_SQ_FT"
        },
        { jsonPath: "NulmSuhRequest.area" }
      ),
      capacity: getLabelWithValue(
        {
          labelName: "capacity",
          labelKey: "NULM_SUH_CAPACITY_NO_OF_BEDS"
        },
        { jsonPath: "NulmSuhRequest.capacity" }
      ),
      assignedTo: getLabelWithValue(
        {
          labelName: "Assign To",
          labelKey: "NULM_SUH_ASSIGN_TO"
        },
        { jsonPath: "NulmSuhRequest.assignedToName" }
      ),
    }),
  });
};
