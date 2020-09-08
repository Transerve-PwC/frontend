export const samplematerialsSearch = () => {
  let res = {
    ResponseInfo: {
      apiId: "Rainmaker",
      ver: ".01",
      ts: null,
      resMsgId: "uief87324",
      msgId: "20170310130900|en_IN",
      status: "successful"
    },
    materials: [
      {
        id: "2",
        tenantId: "ch",
        code: "MAT02",
        name: "Iron Bars",
        description: "Iron Bars",
        oldCode: null,
        materialType: {
            id: "1",
            tenantId: null,
            name: null,
            code: "105",
            description: null,
           // storeMapping: null,
            parent: null,
            isParent: null,
            active: null,
            auditDetails: null
        },
        storeMapping:[
          {
            storecode:"storecode123",
            departmentNameCode:"Accounts",
            chartofAccountglCode:46130

          },
          {
            storecode:"storecode1234",
            departmentNameCode:"Accounts1",
            chartofAccountglCode:461302

          },
          {
            storecode:"storecode1235",
            departmentNameCode:"Accounts2",
            chartofAccountglCode:461303

          }
        ],
        baseUom: {
            id: "5",
            tenantId: null,
            name: null,
            code: "TON",
            description: null,
            baseUom: null,
            uomCategory: null,
            fromDate: null,
            toDate: null,
            conversionFactor: null,
            active: null,
            auditDetails: null
        },
        inventoryType: "inventoryType",
        status: true,
        inActiveDate: null,
        purchaseUom: null,
        expenseAccount: 12345,
        minQuantity: 0,
        maxQuantity: 12,
        stockingUom: 123,
        materialClass: "materialClass",
        reorderLevel: "reorderLevel",
        reorderQuantity: 2,
        lotControl: true,
        shelfLifeControl: false,
        serialNumber: 1234567,
        model: "M1",
        manufacturePartNo: "A7L-2450",
        techincalSpecs: "techincalSpecs",
        termsOfDelivery: "Fast",
        scrapable: true,
        assetCategory: "assetCategory",       
        auditDetails: null
    }
    ]
  };
  return res;
};

export const sampleSingleSearch = () => {
  return {
    ResponseInfo: {
      apiId: "Mihy",
      ver: ".01",
      ts: null,
      resMsgId: "uief87324",
      msgId: "20170310130900|en_IN",
      status: "successful"
    },
    FireNOCs: [
      {
        id: "af82e49e-c966-40ab-993f-9ead126b3583",
        tenantId: "pb.amritsar",
        fireNOCNumber: null,
        provisionFireNOCNumber: null,
        oldFireNOCNumber: null,
        dateOfApplied: null,
        fireNOCDetails: {
          id: "951ab026-0c77-4368-a944-10cf07287b86",
          applicationNumber: "PB-FN-2019-06-07-002024",
          status: "INITIATED",
          fireNOCType: "PROVISIONAL",
          applicationDate: null,
          financialYear: null,
          issuedDate: null,
          validFrom: null,
          validTo: null,
          action: "INITIATE",
          channel: null,
          noOfBuildings: "MULTIPLE",
          buildings: [
            {
              id: "5427ad45-2bf7-428b-bcc8-3c52c7747925",
              tenantId: "pb.amritsar",
              name: "dsrrh violet",
              usageType: "GROUP_A_RESIDENTIAL.SUBDIVISIONA-1",
              uoms: [
                {
                  code: "NO_OF_FLOORS",
                  value: 7,
                  isActiveUom: true,
                  active: true
                },
                {
                  code: "NO_OF_BASEMENTS",
                  value: 2,
                  isActiveUom: true,
                  active: true
                },
                {
                  code: "HEIGHT_OF_BUILDING",
                  value: 4500,
                  isActiveUom: true,
                  active: true
                }
              ],
              applicationDocuments: [
                {
                  tenantId: "pb.amritsar",
                  documentType: "BUILDING.BUILDING_PLAN.SITE_PLAN",
                  fileStoreId: "bcc598cf-04bf-45c8-bbf5-b1d3619b2d78"
                }
              ],
              usageTypeMajor: "GROUP_A_RESIDENTIAL"
            },
            {
              id: "c53ca061-4fe8-48c0-aec7-1eff3621d72a",
              tenantId: "pb.amritsar",
              name: "Dsrrh Indigo",
              usageType: "GROUP_A_RESIDENTIAL.SUBDIVISIONA-2",
              uoms: [
                {
                  code: "NO_OF_FLOORS",
                  value: 8,
                  isActiveUom: true,
                  active: true
                },
                {
                  code: "NO_OF_BASEMENTS",
                  value: 1,
                  isActiveUom: true,
                  active: true
                },
                {
                  code: "HEIGHT_OF_BUILDING",
                  value: 5000,
                  isActiveUom: true,
                  active: true
                }
              ],
              applicationDocuments: [],
              usageTypeMajor: "GROUP_A_RESIDENTIAL"
            }
          ],
          propertyDetails: {
            id: "968e8152-5d8f-4dd4-b5e6-1d750ee04313",
            propertyId: null,
            address: {
              tenantId: "pb.amritsar",
              doorNo: null,
              latitude: null,
              longitude: null,
              buildingName: null,
              city: "pb.amritsar",
              locality: {
                code: "SUN04"
              },
              pincode: "560102",
              street: null
            }
          },
          applicantDetails: {
            ownerShipType: "INDIVIDUAL.SINGLEOWNER",
            owners: [
              {
                id: 23442,
                userName: "9167765477",
                salutation: null,
                name: "Avijeet",
                gender: "MALE",
                mobileNumber: "9167765477",
                emailId: "avi7@gm.com",
                altContactNumber: null,
                pan: "bnhpp5432k",
                aadhaarNumber: null,
                permanentAddress: "Some correspondance address",
                permanentCity: null,
                permanentPinCode: null,
                correspondenceAddress: "Corresponding address",
                correspondenceCity: null,
                correspondencePinCode: null,
                addresses: [
                  {
                    pinCode: null,
                    city: null,
                    address: "Corresponding address",
                    type: "CORRESPONDENCE",
                    id: 52741,
                    tenantId: "pb",
                    userId: 23442,
                    addressType: "CORRESPONDENCE",
                    lastModifiedBy: null,
                    lastModifiedDate: null
                  },
                  {
                    pinCode: null,
                    city: null,
                    address: "Some correspondance address",
                    type: "PERMANENT",
                    id: 48685,
                    tenantId: "pb",
                    userId: 23442,
                    addressType: "PERMANENT",
                    lastModifiedBy: null,
                    lastModifiedDate: null
                  }
                ],
                active: true,
                locale: null,
                type: "CITIZEN",
                accountLocked: false,
                accountLockedDate: 0,
                fatherOrHusbandName: "A",
                signature: null,
                bloodGroup: null,
                photo: null,
                identificationMark: null,
                createdBy: 0,
                lastModifiedBy: 1,
                tenantId: "pb",
                roles: [
                  {
                    code: "CITIZEN",
                    name: "Citizen",
                    tenantId: "pb"
                  }
                ],
                uuid: "d9fb76e8-3c65-4e11-9f5f-2998c0f8b8a6",
                createdDate: 1532962200000,
                lastModifiedDate: 1560171420000,
                dob: "1991-06-28",
                pwdExpiryDate: 1541470800000
              }
            ],
            additionalDetail: {
              documents: [
                {
                  tenantId: "pb.amritsar",
                  documentType: "OWNER.IDENTITYPROOF",
                  fileStoreId: "89fe5959-79e1-4201-b8ca-bcbc4c23c828"
                }
              ]
            },
            ownerShipMajorType: "INDIVIDUAL"
          },
          additionalDetail: {
            documents: []
          },
          auditDetails: {
            createdBy: "52bb4f29-922a-4ba1-b3f1-33cfff16cd7e",
            lastModifiedBy: "",
            createdTime: "1559897605727",
            lastModifiedTime: "0"
          }
        },
        auditDetails: {
          createdBy: "52bb4f29-922a-4ba1-b3f1-33cfff16cd7e",
          lastModifiedBy: "",
          createdTime: "1559897605727",
          lastModifiedTime: "0"
        }
      }
    ]
  };
};

export const sampleDocUpload = () => {
  return {
    "0": {
      documentType: "OWNER",
      documentCode: "OWNER.IDENTITYPROOF",
      documents: [
        {
          fileName: "preview-PB-OPMS-2018-12-02-001113 (1).pdf",
          fileStoreId: "89fe5959-79e1-4201-b8ca-bcbc4c23c828"
        }
      ],
      dropdown: {
        value: "OWNER.IDENTITYPROOF.AADHAAR"
      }
    },
    "1": {
      documentType: "OWNER",
      documentCode: "OWNER.ADDRESSPROOF"
    },
    "2": {
      documentType: "BUILDING",
      documentCode: "Dsrrh Indigo",
      documentSubCode: "BUILDING.BUILDING_PLAN.SITE_PLAN"
    },
    "3": {
      documentType: "BUILDING",
      documentCode: "Dsrrh Indigo",
      documentSubCode: "BUILDING.BUILDING_PLAN.GROUND_FLOOR_PLAN"
    },
    "4": {
      documentType: "BUILDING",
      documentCode: "Dsrrh Indigo",
      documentSubCode: "BUILDING.BUILDING_PLAN.SECTION_PLAN"
    },
    "5": {
      documentType: "BUILDING",
      documentCode: "Dsrrh Indigo",
      documentSubCode: "BUILDING.BUILDING_PLAN.ELEVATION_PLAN"
    },
    "6": {
      documentType: "BUILDING",
      documentCode: "Dsrrh Indigo",
      documentSubCode: "BUILDING.BUILDING_PLAN.BUILTUP_AREA_STATEMENT"
    },
    "7": {
      documentType: "BUILDING",
      documentCode: "dsrrh violet",
      documentSubCode: "BUILDING.BUILDING_PLAN.SITE_PLAN",
      documents: [
        {
          fileName: "preview-PB-OPMS-2018-12-02-001113 (2).pdf",
          fileStoreId: "bcc598cf-04bf-45c8-bbf5-b1d3619b2d78"
        }
      ]
    },
    "8": {
      documentType: "BUILDING",
      documentCode: "dsrrh violet",
      documentSubCode: "BUILDING.BUILDING_PLAN.GROUND_FLOOR_PLAN"
    },
    "9": {
      documentType: "BUILDING",
      documentCode: "dsrrh violet",
      documentSubCode: "BUILDING.BUILDING_PLAN.SECTION_PLAN"
    },
    "10": {
      documentType: "BUILDING",
      documentCode: "dsrrh violet",
      documentSubCode: "BUILDING.BUILDING_PLAN.ELEVATION_PLAN"
    },
    "11": {
      documentType: "BUILDING",
      documentCode: "dsrrh violet",
      documentSubCode: "BUILDING.BUILDING_PLAN.BUILTUP_AREA_STATEMENT"
    },
    "12": {
      documentType: "BUILDING",
      documentCode: "BUILDING.FIRE_FIGHTING_PLAN"
    },
    "13": {
      documentType: "BUILDING",
      documentCode: "BUILDING.OWNERS_CHECKLIST"
    }
  };
};

export const sampleGetBill = () => {
  return {
    ResposneInfo: null,
    Bill: [
      {
        id: "b8378732-c1d0-4910-8d65-f3b027c48d8c",
        mobileNumber: null,
        payerName: null,
        payerAddress: null,
        payerEmail: null,
        isActive: true,
        isCancelled: null,
        additionalDetails: null,
        taxAndPayments: [
          {
            businessService: "FIRENOC",
            taxAmount: 16500,
            amountPaid: null
          }
        ],
        billDetails: [
          {
            id: "31dd68b0-ded3-45de-b241-de96d73b487c",
            tenantId: "pb.amritsar",
            demandId: "02f07856-978f-4a6b-acb9-8ad635699c4f",
            bill: "b8378732-c1d0-4910-8d65-f3b027c48d8c",
            businessService: "FIRENOC",
            billNumber: null,
            billDate: 1560258084110,
            consumerCode: "PB-FN-1234",
            consumerType: "FIRENOC",
            expiryDate: 1560258084110,
            minimumAmount: null,
            totalAmount: 16500,
            fromPeriod: 1554076799000,
            toPeriod: 1585679399000,
            collectedAmount: 0,
            collectionModesNotAllowed: ["DD"],
            partPaymentAllowed: false,
            isAdvanceAllowed: false,
            additionalDetails: null,
            billAccountDetails: [
              {
                id: "48417f1e-f8ac-4469-8e31-b801731884db",
                tenantId: "pb.amritsar",
                billDetail: "31dd68b0-ded3-45de-b241-de96d73b487c",
                demandDetailId: "b15dcc8b-3748-4835-97fa-a9e42e632ecc",
                order: 3,
                amount: 16500,
                adjustedAmount: 0,
                isActualDemand: true,
                glcode: null,
                taxHeadCode: "FIRENOC_FEES",
                additionalDetails: null,
                purpose: "CURRENT"
              }
            ],
            status: null
          }
        ],
        tenantId: "pb.amritsar",
        auditDetails: {
          createdBy: "ed8cebbc-750c-4e03-98b5-488d6e506395",
          lastModifiedBy: "ed8cebbc-750c-4e03-98b5-488d6e506395",
          createdTime: 1560258084110,
          lastModifiedTime: 1560258084110
        }
      }
    ],
    ResponseInfo: {
      apiId: "string",
      ver: "string",
      ts: null,
      resMsgId: "uief87324",
      msgId: "string",
      status: "successful"
    }
  };
};
export const IndentConfiguration =()=>{

  return{
    IssueType:{
      
      INDENTISSUE:"INDENTISSUE",
      NONINDENTISSUE:"NONINDENTISSUE",
      MATERIALOUTWARD:"MATERIALOUTWARD",
  },
  materialIssueStatus:"CREATED",
    
  }
}

export const NonIndentConfiguration =()=>{
  return{
    IssueType:{
      
      INDENTISSUE:"INDENTISSUE",
      NONINDENTISSUE:"NONINDENTISSUE",
      MATERIALOUTWARD:"MATERIALOUTWARD",
  },
  materialIssueStatus:"CREATED",
  issuePurpose :"RETURNTOSUPPLIER"
    
  }
}

export const WorkFllowStatus = () => {
  return {
    
    WorkFllowStatus: [
      {
        code:"CREATED",
        value:"CREATED",
      },
      // {
      //   code:"REJECTED",
      //   value:"REJECTED",
      // },
      {
        code:"APPROVED",
        value:"APPROVED",
      }

    ]
  }
}

export const UserRoles = () => {
  return {
    
    UserRoles: [
     "SACP",
     "SAJE",
     "SACT",
     "MOH",
     "SASP",
     "SASO",
     "SACSI"

    ]
  }
}

export const ReceiptType = () => {
  return {
    
    StoreReceiptType: 
      {
        PURCHASE_RECEIPT_TYPE:"PURCHASE RECEIPT",
        MISCELLANEOUS_RECEIPT_TYPE:"MISCELLANEOUS RECEIPT",
        INWARDRECEIPT_RECEIPT_TYPE:"INWARD RECEIPT",
        OPENINGBALANCE_RECEIPT_TYPE:"OPENING BALANCE",
      },
  }
}

export const IndentConfigType = () => {
  return {
    
    IndntType: 
      {
        INEDENT:"Indent",
        INDENT_TFR:"Transfer Indent",
        
      },
      indentStatus:"APPROVED"
  }
}

export const InventoryData = () => {
  let Inventory = {
    ResponseInfo: {
      apiId: "Rainmaker",
      ver: ".01",
      ts: null,
      resMsgId: "uief87324",
      msgId: "20170310130900|en_IN",
      status: "successful"
    },
    InventoryHeaderData: [
      {
        Title:
        {
          key:"MUNICIPAL_CORPORATION_CHANDIGARH",
          value:"MUNICIPAL CORPORATION CHANDIGARH",
        },
        SubTitle:
        {
          key:"STORE_INVENTORY_REGISTER",
          value:"Inventory Register",
        },
        StoreName:
        {
          key:"STORE_DETAILS_STORE_NAME",
          value:"Store 01",
        },
        DepartmentName:
        {
          key:"STORE_DETAILS_DEPARTMENT_NAME",
          value:"Department 01",
        },
        MaterialName:
        {
          key:"STORE_MATERIAL_NAME",
          value:"Cemment",
        },
        Rowdata:[
          {
            key:"STORE_COL_SL_NUMBER",
            value:"Sr No.",
           
          },
          {
            key:"STORE_COL_OPENNING_BALENCE",
            value:"Opening Balance",
            data:[
              {
                key:"",
                value:"Qty.",
              },
              {
                key:"",
                value:"Unit",
              },
              {
                key:"",
                value:"Value",
              },
            ],
          },
          {
            key:"STORE_COL_RECEIPT",
            value:"Receipt",
            data:[
              {
                key:"",
                value:"Receipt Date",
              },
              {
                key:"",
                value:"Material Receipt No.",
              },
              {
                key:"",
                value:"Department",
              },
              {
                key:"",
                value:"Purchase Qty.",
              },
              {
                key:"",
                value:"Purchase Unit",
              },
              {
                key:"",
                value:"Rate per Unit",
              },
              {
                key:"",
                value:"Total value of Inventory",
              },
              
            ],
          },
          {
            key:"STORE_COL_RECEIPT",
            value:"Issue",
            data:[
              {
                key:"",
                value:"Issue Date",
              },
              {
                key:"",
                value:"Issue No.",
              },
              {
                key:"",
                value:"Issued Department Name",
              },
              {
                key:"",
                value:"Issued Qty.",
              },
              {
                key:"",
                value:"Issued Qty Unit",
              },
              {
                key:"",
                value:"Rate per Unit",
              },
              {
                key:"",
                value:"Total Value",
              },
            ],
          },
          {
            key:"STORE_COL_BALENCE",
            value:"Balance",
            data:[
              {
                key:"",
                value:"Qty.",
              },
              {
                key:"",
                value:"Unit",
              },
              {
                key:"",
                value:"Value",
              },
            ],
          },
        ]     

      }
     
    ],
    InventoryRowdata: [
      {
        srNo:"1",
     openingQty:"500.00",
     openingUom:"NOS",
     openingRate:"35.00",   
     receiptDate:"01-01-1970",
     receiptNo:"R1",
     receiptDepartment:"DEP_03",
     receiptPurchaseQty:"0",
     receiptPurchaseUom:"",
     receiptPurchaseUnitRate:"0",
     receiptTotalValue:"0",
     issuedDate:"25-08-2020",
     issuedNo:"MRIN-2020-106",
     issuedToDepartment:"DEP_03",
     issuedQty:"5.00",
     issuedUom:"TON",
     issuedUnitRate:"35.00",
     issuedTotalValue:"175.0000",
     balanceQty:"495.00",
     balanceUom:"NOS",
     balanceTotalValue:"17325.0000"
    },
    {
      srNo:"2",
      openingQty:"500.00",
      openingUom:"NOS",
      openingRate:"35.00",   
      receiptDate:"01-01-1970",
      receiptNo:"R2",
      receiptDepartment:"DEP_03",
      receiptPurchaseQty:"0",
      receiptPurchaseUom:"",
      receiptPurchaseUnitRate:"0",
      receiptTotalValue:"0",
      issuedDate:"25-08-2020",
      issuedNo:"MRIN-2020-106",
      issuedToDepartment:"DEP_03",
      issuedQty:"5.00",
      issuedUom:"TON",
      issuedUnitRate:"35.00",
      issuedTotalValue:"175.0000",
      balanceQty:"495.00",
      balanceUom:"NOS",
      balanceTotalValue:"17325.0000"
    }
    ]
  };
  return Inventory;
}