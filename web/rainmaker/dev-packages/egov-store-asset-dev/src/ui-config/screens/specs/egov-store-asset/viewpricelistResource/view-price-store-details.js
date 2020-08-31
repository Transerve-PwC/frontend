import {
    getCommonContainer,
    getCommonGrayCard,
    getCommonSubHeader,
    getLabel,
    getLabelWithValue
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
  
  const gotoCreatePage = (state, dispatch) => {
    const createUrl =
    process.env.REACT_APP_SELF_RUNNING === "true"
    ? `/egov-ui-framework/egov-store-asset/createpricelist?step=1`
    : `/egov-store-asset/createpricelist?step=1`;
    dispatch(setRoute(createUrl));
  };
  
  const pricestoreCard = {
    uiFramework: "custom-containers",
    componentPath: "MultiItem",
    props: {
      className: "review-hr",
      scheama: getCommonGrayCard({
        pricestoreCardContainer: getCommonContainer({
          materialcode: getLabelWithValue(
            {
              labelName: "Material Code",
                labelKey: "STORE_MATERIAL_NAME"
            },
            { jsonPath: "priceLists[0].priceListDetails[0].material.name",          
          }
          ),
          quantity: getLabelWithValue(
            {
              labelName: "quantity",
                    labelKey: "STORE_PRICE_QUANTITY"
            },
            { jsonPath: "priceLists[0].priceListDetails[0].quantity"
            
           }
          ),
          ratePerUnit: getLabelWithValue(
            { labelName: "Rate",
            labelKey: "STORE_PRICE_RATE_PER_UNIT"},
            {
              jsonPath: "priceLists[0].priceListDetails[0].ratePerUnit"
             
            }
          ),
          uomcode: getLabelWithValue(
            {  labelName: "UOM Name", labelKey: "STORE_MATERIAL_INDENT_NOTE_UOM_NAME" },
            {
              jsonPath: "priceLists[0].priceListDetails[0].uom.name",
             
            }
          )
        })
      }),
  
      items: [],
      hasAddItem: false,
      isReviewPage: true,
     // screenKey:"view-price-list",
      sourceJsonPath: "priceLists[0].priceListDetails",
      prefixSourceJsonPath:
        "children.cardContent.children.pricestoreCardContainer.children",
      afterPrefixJsonPath: "children.value.children.key"
    },
    type: "array"
  };
  export const getStoreDetailsView = (isReview = true) => {
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
              labelName: "Material Map Store Details",
              labelKey: "STORE_MATERIAL_MAP_STORE_DETAILS"
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
      viewOne: pricestoreCard
    });
  };
  