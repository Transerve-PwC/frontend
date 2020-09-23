

export const DashbordData = () => {
  let Dashbord = {
    ResponseInfo: {
      apiId: "Rainmaker",
      ver: ".01",
      ts: null,
      resMsgId: "uief87324",
      msgId: "20170310130900|en_IN",
      status: "successful"
    },
    complaintSources:[
      {
        heading:"Complaint By Status",
        aggregations:[
          {
            key:"open",
            value:10,
          },
          {
            key:"Closed",
            value:40,
          },
          {
            key:"resolved",
            value:20,
          },
          {
            key:"reassignrequested",
            value:5,
          } 
        ]
      },
      {
        heading:"Complaint By Channel",
        aggregations:[
          {
            key:"web",
            value:40,
          },
          {
            key:"whatsup",
            value:15,
          },
          {
            key:"apps",
            value:10,
          },
        ]
      },
      {
        heading:"Complaint By Department",
        aggregations:[
          {
            key:"Operation & Maintenance",
            value:25,
          },
          {
            key:"Helth & Sanitation",
            value:30,
          },
          {
            key:"Street Light",
            value:38,
          },
          {
            key:"Accounts Branch",
            value:15,
          } 
        ]
      }
    ]
  };
  return Dashbord;
}