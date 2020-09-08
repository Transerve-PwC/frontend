import {
    getCommonContainer,
    getCommonGrayCard,
    getCommonSubHeader,
    getLabel,
    getLabelWithValue
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  

  
  const materialTypeMapCard = {
    uiFramework: "custom-containers",
    componentPath: "MultiItem",
    props: {
      className: "review-hr",
      scheama: getCommonGrayCard({
        materialTypeMapCardContainer: getCommonContainer({
            storeName: getLabelWithValue(
            {
              labelName: "Store Name",
              labelKey: "STORE_DETAILS_STORE_NAME"
            },
            { jsonPath: "materialTypes[0].storeMapping[0].store.name",
            }
          ),
          departmentName: getLabelWithValue(
            {
              labelName: "Department Name",
              labelKey: "STORE_DETAILS_DEPARTMENT_NAME"
            },
            { jsonPath: "materialTypes[0].storeMapping[0].store.department.name",
            }
          ),
          // stckInHand: getLabelWithValue(
          //   { labelName: "Stock-In-Hand Code", labelKey: "STORE_DETAILS_STORE_STCK_HAND" },
          //   {
          //     jsonPath: "materialTypes[0].storeMapping[0].chartofAccount.glcode",
          //   }
          // ),
        }),
      }),
  
      items: [],
      hasAddItem: false,
      isReviewPage: true,
      sourceJsonPath: "materialTypes[0].storeMapping",
      prefixSourceJsonPath:
        "children.cardContent.children.materialTypeMapCardContainer.children",
      afterPrefixJsonPath: "children.value.children.key"
    },
    type: "array"
  };
  
  export const materialTypeStoreMapView =   getCommonGrayCard({
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
              labelName: "Map Material Type to Store",
              labelKey: "STORE_COMMON_MAP_MATERIAL_TYPE_TO_STORE"
            })
          },
          
        }
      },
      viewOne: materialTypeMapCard
    });

  