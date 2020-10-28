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
     const createUrl = `/egov-nulm/log-maintenance?step=0`;
    dispatch(setRoute(createUrl));
  };
  
  export const getpropertyLocationDetailsView = (isReview = true) => {
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
              labelName: "Property location Details",
              labelKey: "PT_COMMON_PROPERTY_LOCATION_DETAILS"
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
        city: getLabelWithValue(
          {
            labelName: "City",
            labelKey: "PT_COMMON_CITY"
          },
          { jsonPath: "Properties[0].address.city" }
        ),
        localityOrMohalla: getLabelWithValue(
          {
            labelName: "Locality/Mohalla",
            labelKey: "PT_COMMON_LOCALITY_OR_MOHALLA"
          },
          { jsonPath: "Properties[0].address.locality.name" }
        ),
        doorNo: getLabelWithValue(
          {
            labelName: "House/Door No.",
            labelKey: "PT_COMMON_DOOR_NO_LABEL"
          },
          { jsonPath: "Properties[0].address.doorNo" }
        ),
      }),
    });
  };
  