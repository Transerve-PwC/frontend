import React from "react";
import { getCurrentAssignee, getServiceRequestStatus, getHCRoles } from "egov-ui-kit/utils/localStorageUtils";

const stylesHidden = {
  backgroundColor: "rgb(254, 122, 81)",
  color: "rgba(255, 255, 255, 0.8700000047683716)",
  marginLeft: "8px",
  paddingLeft: "19px",
  paddingRight: "19px",
  textAlign: "center",
  verticalAlign: "middle",
  lineHeight: "35px",
  fontSize: "16px",
  marginTop: "5px",
  display: "none"
};

const styles = {
  backgroundColor: "rgb(254, 122, 81)",
  color: "rgba(255, 255, 255, 0.8700000047683716)",
  marginLeft: "8px",
  paddingLeft: "19px",
  paddingRight: "19px",
  textAlign: "center",
  verticalAlign: "middle",
  lineHeight: "35px",
  fontSize: "16px",
  marginTop: "5px",
 
};
// const { number } = props;/ssss
// getCommonValuesFromHCRoles = (roleArray, HCRoles)=> {
//   var commonRoles =[]
//   roleArray.map(function (element) {
//      HCRoles[0].map(function (elementHCRole) {
//       if(elementHCRole.code === element)

//       {
//         if (!commonRoles.includes(elementHCRole))
//        { 
//          commonRoles.push(elementHCRole.name)
//        }
//      }
//      else{
//       commonRoles.push(element)
//      }
//      }) 
//     });


// return commonRoles
// }
function CurrentAssignee(props) {
  if(getServiceRequestStatus() == "COMPLETED" || getServiceRequestStatus() == "REJECTED" )
  {return <div style={stylesHidden}>Assigned To : N/A</div>;}
  else{var HCRoles = []
    var roleArray=[]
    var finalCurrentAssigneeString = ""
    var commonRolesFromFilter = []
    try {
      HCRoles = JSON.parse(getHCRoles())
      roleArray = getCurrentAssignee().split(",")

    commonRolesFromFilter = HCRoles.filter(function (role) {
      
      if (roleArray.includes(role.code) )
     { 
      var index = roleArray.indexOf(role.code);
      if (index >= 0) {
        roleArray.splice( index, 1 );
      }
      return role.name
      
    }
  
     
  });

  var finalRoleNamesList=[]
  finalRoleNamesList = commonRolesFromFilter.map(element => element.name )

    var finalArrayFromConcat = [...roleArray,...finalRoleNamesList ]
      let uniqueAssignee = [...new Set(finalArrayFromConcat)];
      finalCurrentAssigneeString = uniqueAssignee.join(",")
    } catch (error) {
      finalCurrentAssigneeString = getCurrentAssignee()
    }
   }

    
    return <div style={styles}>Assigned To : {finalCurrentAssigneeString}</div>;

}


export default CurrentAssignee;
