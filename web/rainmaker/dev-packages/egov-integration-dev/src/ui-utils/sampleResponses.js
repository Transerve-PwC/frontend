export const sampleeofficestat = () => {
  let res = {
    ResponseInfo: {
      apiId: "Rainmaker",
      ver: ".01",
      ts: null,
      resMsgId: "uief87324",
      msgId: "20170310130900|en_IN",
      status: "successful"
    },
    ResponseBody:{
    totalFilesPendingCnt:3,
    totalFilesClosed  :23,
    totalReceiptsPending  :4,
    totalReceiptsClosed: 5,  
    totalVIPReceiptsPending :7,
    VipReceipts:{
      Row:{
        Column:[
          {
            name:"DepartmentId",
            content:34
          },
          {
            name:"DepartmentName",
            content:"Food and Supplies"
          },
          {
            name:"OrgId",
            content:34
          },
          {
            name:"OrgName",
            content:"EStablishment-FSCA"
          },
          {
            name:"EmployeeName",
            content:"RENU SHARMA"
          },
          {
            name:"MarkingAbbr",
            content:"SA(RS)-ESTT-FSCA"
          },
          {
            name:"PostDetailId",
            content:212
          },
          {
            name:"NumberOfElectronicVipreceipt",
            content:0
          },
          {
            name:"NumberOfPhysicalVipreceipt",
            content:34
          },
          {
            name:"Total",
            content:1
          }

        ]
      }
    },
    FileHierarchy:{
      Row:{
        Column:[
          {
            name:"Id",
            content:37
          },
          {
            name:"Sectionname",
            content:"EStablishment-FSCA"
          },
          {
            name:"NumberOfElectronicFilesPending",
            content:0
          },
          {
            name:"NumberOfPhysicalFilesPending",
            content:0
          },
          {
            name:"Total",
            content:34
          },
          

        ]
      }
    },
    ReceiptPending:{
      Row:{
        Column:[
          {
            name:"Departmentid",
            content:34
          },
          {
            name:"DepartmentName",
            content:"Food and Supplies"
          },
          {
            name:"OrgId",
            content:37
          },
          {
            name:"OrgName",
            content:"EStablishment-FSCA"
          },
          {
            name:"EmployeeName",
            content:"RENU SHARMA"
          },
          {
            name:"MarkingAbbr",
            content:"SA(RS)-ESTT-FSCA"
          },
          {
            name:"PostDetailId",
            content:212
          },
          {
            name:"ElectronicReceipt",
            content:1672
          },
          {
            name:"PhysicalReceipt",
            content:5
          },
          {
            name:"Total",
            content:1677
          }

        ]
      }
    },
    
    FilePending:{

    },
    FileClosed:{

    },
    
    ReceiptClosed:{
      Row:{
        Column:[
          {
            name:"Departmentid",
            content:34
          },
          {
            name:"DepartmentName",
            content:"Food and Supplies"
          },
          {
            name:"OrgId",
            content:37
          },
          {
            name:"OrgName",
            content:"EStablishment-FSCA"
          },
          {
            name:"EmployeeName",
            content:"RENU SHARMA"
          },
          {
            name:"MarkingAbbr",
            content:"SA(RS)-ESTT-FSCA"
          },
          {
            name:"PostDetailId",
            content:212
          },
          {
            name:"ElectronicReceipt",
            content:133
          },
          {
            name:"PhysicalReceipt",
            content:0
          },
          {
            name:"Total",
            content:133
          }

        ]
      }
    },

   }
  };
  return res;
};
export const samplePaySlip = () => {
  let res = {
    ResponseInfo: {
      apiId: "Rainmaker",
      ver: ".01",
      ts: null,
      resMsgId: "uief87324",
      msgId: "20170310130900|en_IN",
      status: "successful"
    },
    PaySlip:{
      DDOCode:'00003',
      DDOName  :'Ministry of Health',
      EmployeeCode  :'1975010001Z',
      Name: 'Om Parkash',  
      FatherName :'S/o Sri Gajey Singh',
      Designation:'Sanitary Jamadar',
      PayCommission:'5th Pay Commission (State)',
      PayScale:'4900-10680-Grade Pay(1650)',
      Allowances_Deductions:{
        ItemType:[
          "A",
          "A",
          "A",
          "A",
          "A",
          "A",
          "A",
          "A",
          "D",
          "D",
        ],
        Value:[
          16620,
          24257,
          120,
          60,
          300,
          500,
          250,
          831,
          103,
          100
        ],
        ItemName:[
          "BASIC PAY",
          "Dearness Allowance",
          "City Compensatory Allowance",
          "Washing Allowance",
          "Conveyance Allowance",
          "Medical Allowance",
          "Mobile Allowance",
          "IR UT PB HP",
          "Licence Fee/HRR",
          "Advance Tax"
        ]

      },
      Allowances_Deductions_:[
        {
          ItemType:'A',
          ItemName:'BASIC PAY',
          Value:16620,
        },
        {
          ItemType:'A',
          ItemName:'Dearness Allowance',
          Value:24257,
        },
        {
          ItemType:'A',
          ItemName:'City Compensatory Allowance',
          Value:120,
        },
        {
          ItemType:'A',
          ItemName:'Washing Allowance',
          Value:60,
        },
        {
          ItemType:'A',
          ItemName:'Conveyance Allowance',
          Value:300,
        },
        {
          ItemType:'A',
          ItemName:'Medical Allowance',
          Value:500,
        },
        {
          ItemType:'A',
          ItemName:'Mobile Allowance',
          Value:250,
        },
        {
          ItemType:'A',
          ItemName:'IR UT PB HP',
          Value:250,
        },
        {
          ItemType:'D',
          ItemName:'Licence Fee/HRR',
          Value:250,
        }

      ]

   }
  };
  return res;
};
