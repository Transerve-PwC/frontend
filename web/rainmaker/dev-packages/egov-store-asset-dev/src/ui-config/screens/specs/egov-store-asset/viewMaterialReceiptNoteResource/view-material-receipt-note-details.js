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
    ? `/egov-ui-framework/egov-store-asset/createMaterialReceiptNote?step=1`
    : `/egov-store-asset/createMaterialReceiptNote?step=1`;
    dispatch(setRoute(createUrl));
  };
  
  const MaterialIssueCard = {
    uiFramework: "custom-containers",
    componentPath: "MultiItem",
    props: {
      className: "review-hr",
      scheama: getCommonGrayCard({
        MaterialIssueCardContainer: getCommonContainer({
          PONo: getLabelWithValue(
            {
              labelName: "PO No",
                  labelKey: "STORE_MATERIAL_RECEIPT_PO_NUMBER"
            },
          // {
          //   props:{
          //     visible:false
          //   },
          // },
            { jsonPath: "materialReceipt[0].receiptDetails[0].purchaseOrderDetail.purchaseOrderNumber",          
          }
          ),
          MaterialName: getLabelWithValue(
            {
              labelName: "Material Nmae",
              labelKey: "STORE_MATERIAL_NAME"
            },
            { jsonPath: "materialReceipt[0].receiptDetails[0].material.name"
            
           }
          ),
          MaterialNameDesc: getLabelWithValue(
            {
              labelName: "Material Description",
                  labelKey: "STORE_MATERIAL_DESCRIPTION"
            },
            { jsonPath: "materialReceipt[0].receiptDetails[0].material.description"
            
           }
          ),
          UOMName: getLabelWithValue(
            {
              labelName: "UOM",
                  labelKey: "STORE_MATERIAL_INDENT_NOTE_UOM_NAME"
            },
            { jsonPath: "materialReceipt[0].receiptDetails[0].uom.name"
            
           }
          ),
          // AvailableQty: getLabelWithValue(
          //   { labelName: "Available Qty",
          //   labelKey: "STORE_MATERIAL_RECEIPT_AVAILABLE_QTY"},
          //   {
          //     jsonPath: "materialReceipt[0].receiptDetails[0].AvailableQty"
             
          //   }
          // ),
          // OrderedQty: getLabelWithValue(
          //   { labelName: "Ordered Qty",
          //   labelKey: "STORE_MATERIAL_RECEIPT_ORDERED_QTY"},
          //   {
          //     jsonPath: "materialReceipt[0].receiptDetails[0].orderQuantity"
             
          //   }
          // ),
          // QtyasperChallan: getLabelWithValue(
          //   {  labelName: "Qty. as per Challan",
          //   labelKey: "STORE_MATERIAL_RECEIPT_QTY_AS_PER_CHALLAN"},
          //   {
          //     jsonPath: "materialReceipt[0].receiptDetails[0].QtyasperChallan"
             
          //   }
          // ),
          // Rateperunit: getLabelWithValue(
          //   {  labelName: "Qty Rate per unit",
          //   labelKey: "STORE_MATERIAL_RECEIPT_RATE_PER_UNIT"},
          //   {
          //     jsonPath: "materialReceipt[0].receiptDetails[0].Rateperunit"
             
          //   }
          // ),
         
          receivedQty: getLabelWithValue(
            {   labelName: "Qty. Received",
            labelKey: "STORE_MATERIAL_RECEIPT_QTY_RECEIVED"},
            {
              jsonPath: "materialReceipt[0].receiptDetails[0].receivedQty",
             
            }
          ),
          acceptedQty: getLabelWithValue(
            {   labelName: "Qty. Accepted",
            labelKey: "STORE_MATERIAL_RECEIPT_QTY_ACCEPTED"},
            {
              jsonPath: "materialReceipt[0].receiptDetails[0].acceptedQty",
             
            }
          ),
         
          UnitRate: getLabelWithValue(
            {   labelName: "Unit Rate",
            labelKey: "STORE_MATERIAL_RECEIPT_UNIT_RATE"},
            {
              jsonPath: "materialReceipt[0].receiptDetails[0].unitRate",
             
            }
          ),
          //  TotalPrice: getLabelWithValue(
          //   {    labelName: "Total Price",
          //   labelKey: "STORE_MATERIAL_RECEIPT_TOTAL_PRICE" },
          //   {
          //     jsonPath: "materialReceipt[0].receiptDetails[0].TotalPrice",
             
          //   }
          // ),
          // QtyRejected: getLabelWithValue(
          //   {   labelName: "Qty. Rejected",
          //   labelKey: "STORE_MATERIAL_RECEIPT_QTY_REJECTED"},
          //   {
          //     jsonPath: "materialReceipt[0].receiptDetails[0].QtyRejected",
             
          //   }
          // ),
          Rejectionremarks: getLabelWithValue(
            {   labelName: "Rejection remarks",
            labelKey: "STORE_MATERIAL_RECEIPT_REJECTION_REMARKS"},
            {
              jsonPath: "materialReceipt[0].receiptDetails[0].rejectionRemark",
             
            }
          ),
          // ValueofQtyaccepted: getLabelWithValue(
          //   {    labelName: "Value of Qty. accepted",
          //   labelKey: "STORE_MATERIAL_RECEIPT_VALUE_OF_QTY_ACCEPTED"},
          //   {
          //     jsonPath: "materialReceipt[0].receiptDetails[0].acceptedQty",
             
          //   }
          // ),
          LOTNO: getLabelWithValue(
            {   labelName: "LOT No",
            labelKey: "STORE_MATERIAL_RECEIPT_LOT_NO"},
            {
              jsonPath: "materialReceipt[0].receiptDetails[0].lotNo",
             
            }
          ),
          SerialNo: getLabelWithValue(
            {   labelName: "Serial No.",
            labelKey: "STORE_MATERIAL_RECEIPT_SERIAL_NO"},
            {
              jsonPath: "materialReceipt[0].receiptDetails[0].serialNo",
             
            }
          ),
          BatchNo: getLabelWithValue(
            {   labelName: "Batch No.",
            labelKey: "STORE_MATERIAL_RECEIPT_QTY_RECEIVED"},
            {
              jsonPath: "materialReceipt[0].receiptDetails[0].batchNo",
             
            }
          ),
          ManufacturerDate: getLabelWithValue(
            {   labelName: "Manufacturer Date",
            labelKey: "STORE_MATERIAL_RECEIPT_MANUFACTURER_DATE"},
            {
              jsonPath: "materialReceipt[0].receiptDetails[0].manufactureDate",
             
            }
          ),
          expiryDate: getLabelWithValue(
            {   labelName: "Expiry Date",
            labelKey: "STORE_MATERIAL_RECEIPT_EXPIRY_DATE"},
            {
              jsonPath: "materialReceipt[0].receiptDetails[0].expiryDate",
             
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
  export const getReceiptNoteDetailsView = (isReview = true) => {
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
              labelName: "Material Receipt Details",
              labelKey: "STORE_MATERIAL_RECEIPT_MATERIAL_RECEIPT_DETAILS"
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
      viewOne: MaterialIssueCard
    });
  };
  