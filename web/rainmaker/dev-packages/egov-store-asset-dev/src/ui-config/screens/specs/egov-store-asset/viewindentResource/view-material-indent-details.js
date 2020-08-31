import {
    getCommonContainer,
    getCommonGrayCard,
    getCommonSubHeader,
    getLabel,
    getLabelWithValue
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
  import {  checkValueForNA } from "../../utils";
  const gotoCreatePage = (state, dispatch) => {
    const createUrl =
    process.env.REACT_APP_SELF_RUNNING === "true"
    ? `/egov-ui-framework/egov-store-asset/creatindent?step=1`
    : `/egov-store-asset/creatindent?step=1`;
    dispatch(setRoute(createUrl));
  };
  
  const storeCard = {
    uiFramework: "custom-containers",
    componentPath: "MultiItem",
    props: {
      className: "review-hr",
      scheama: getCommonGrayCard({
        storeCardContainer: getCommonContainer({
          MaterialName: getLabelWithValue(
            {
              labelName: "Material Nmae",
                  labelKey: "STORE_MATERIAL_NAME"
            },
            { jsonPath: "indents[0].indentDetails[0].material.name",          
          }
          ),
          // MaterialDescription: getLabelWithValue(
          //   {
          //     labelName: "Material Description",
          //         labelKey: "STORE_MATERIAL_DESCRIPTION"
          //   },
          //   { jsonPath: "indents[0].storeMapping[0].MaterialDescription"
            
          //  }
          // ),
          UOMName: getLabelWithValue(
            { labelName: "UOM Name",
            labelKey: "STORE_MATERIAL_INDENT_NOTE_UOM_NAME"},
            {
              jsonPath: "indents[0].indentDetails[0].uom.name"
             
            }
          ),
          AssestCode: getLabelWithValue(
            {  labelName: "Assest Code",
            labelKey: "STORE_MATERIAL_INDENT_NOTE_ASSEST_CODE" },
            {
              jsonPath: "indents[0].indentDetails[0].asset.code",
              callBack: checkValueForNA
             
            }
          ),
          ProjectCode: getLabelWithValue(
            { labelName: "Project Code",
            labelKey: "STORE_MATERIAL_INDENT_NOTE_PROJECT_CODE" },
            {
              jsonPath: "indents[0].indentDetails[0].project.code",
              callBack: checkValueForNA
             
            }
          ),
          // indentQuantity: getLabelWithValue(
          //   {   labelName: "indentQuantity",
          //   labelKey: "STORE_MATERIAL_INDENT_QUANTITY" },
          //   {
          //     jsonPath: "indents[0].indentDetails[0].indentQuantity",
             
          //   }
          // ),
          QuantityRequired: getLabelWithValue(
            {   labelName: "QuantityRequired",
            labelKey: "STORE_MATERIAL_INDENT_QUANTITY_REQUIRED" },
            {
              jsonPath: "indents[0].indentDetails[0].userQuantity",
             
            }
          )
        })
      }),
  
      items: [],
      hasAddItem: false,
      isReviewPage: true,
      sourceJsonPath: "indents[0].indentDetails",
      prefixSourceJsonPath:
        "children.cardContent.children.storeCardContainer.children",
      afterPrefixJsonPath: "children.value.children.key"
    },
    type: "array"
  };
  export const getIndentDetailsView = (isReview = true) => {
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
              labelName: "Material Map Indent Details",
              labelKey: "STORE_MATERIAL_MAP_INDENT_DETAILS"
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
                labelKey: "STORE_SUMMARY_EDIT"
              })
            },
            onClickDefination: {
              action: "condition",
              callBack: gotoCreatePage
            }
          }
        }
      },
      viewOne: storeCard
    });
  };
  