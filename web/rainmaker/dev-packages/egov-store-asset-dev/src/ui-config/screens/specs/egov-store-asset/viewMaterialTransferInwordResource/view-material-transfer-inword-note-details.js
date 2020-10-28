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
    const IndentId = getQueryArg(window.location.href, "IndentId");
    const createUrl =
    process.env.REACT_APP_SELF_RUNNING === "true"
    ? `/egov-ui-framework/egov-store-asset/createMaterialTransferInword?step=1`
    : `/egov-store-asset/createMaterialTransferInword?step=1`;
    dispatch(setRoute(createUrl));
  };
  
  const MaterialTransferCard = {
    uiFramework: "custom-containers",
    componentPath: "MultiItem",
    props: {
      className: "review-hr",
      scheama: getCommonGrayCard({
        MaterialIssueCardContainer: getCommonContainer({
         
          MaterialName: getLabelWithValue(
            {
              labelName: "Material Nmae",
              labelKey: "STORE_MATERIAL_NAME"
            },
            { jsonPath: "transferInwards[0].receiptDetails[0].material.name"
            
           }
          ),

         
          // QtyIssued: getLabelWithValue(
          //   { labelName: "Available Qty",
          //   labelKey: "STORE_MATERIAL_RECEIPT_AVAILABLE_QTY"},
          //   {
          //     jsonPath: "transferInwards[0].receiptDetails[0].quantityIssued"
             
          //   }
          // ),
          QtyReceiced: getLabelWithValue(
            { labelName: "Ordered Qty",
            labelKey: "STORE_MATERIAL_RECEIPT_ORDERED_QTY"},
            {
              jsonPath: "transferInwards[0].receiptDetails[0].userReceivedQty"
             
            }
          ),
          UOMName: getLabelWithValue(
            {
              labelName: "UOM",
                  labelKey: "STORE_MATERIAL_INDENT_NOTE_UOM_NAME"
            },
            { jsonPath: "transferInwards[0].receiptDetails[0].uom.name"
            
           }
          ),
           UnitRate: getLabelWithValue(
            {
              labelName: "Unit Rate",
                  labelKey: "STORE_MATERIAL_RECEIPT_UNIT_RATE"
            },
            { jsonPath: "transferInwards[0].receiptDetails[0].unitRate"
            
           }
          ),
          TotalValue: getLabelWithValue(
            {    labelName: "Total Price",
            labelKey: "STORE_MATERIAL_RECEIPT_TOTAL_PRICE" },
            {
              jsonPath: "transferInwards[0].receiptDetails[0].totalValue",
             
            }
          ),
          
          Remark: getLabelWithValue(
            {   labelName: "Remark",
            labelKey: "STORE_MATERIAL_INDENT_NOTE_REMARK"},
            {
              jsonPath: "transferInwards[0].receiptDetails[0].rejectionRemark",
             
            }
          ),
          
        })
      }),
  
      items: [],
      hasAddItem: false,
      isReviewPage: true,
      sourceJsonPath: "materialReceipt[0].receiptDetails",
      prefixSourceJsonPath:
        "children.cardContent.children.MaterialIssueCardContainer.children",
      afterPrefixJsonPath: "children.value.children.key"
    },
    type: "array"
  };
  export const getMaterialTransferNoteDetailsView = (isReview = true) => {
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
              labelName: "Material Transfer Inward Details",
              labelKey: "STORE_MATERIAL_TRANSFER_INWARD_DETAILS"
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
      viewOne: MaterialTransferCard
    });
  };
  