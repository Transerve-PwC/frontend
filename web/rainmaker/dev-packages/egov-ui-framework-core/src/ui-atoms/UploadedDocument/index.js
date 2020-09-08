import React from "react";
import Icon from "@material-ui/core/Icon";
import Button from "@material-ui/core/Button";

const UploadedDocument = props => {
  const { document, removeDocument ,moduleName} = props;
 
  if(moduleName==="opms" || moduleName==="PR")
  {
  return (
    <Button
      variant="outlined"
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid rgba(5, 5, 5, 0.11999999731779099)",
        // minWidth: 300,
        minWidth: "auto",
        wordBreak: "break-all",
        justifyContent: "space-between"
      }}
    >
      {document.fileName}
      <Icon
        style={{ color: "#E54D42", marginLeft: "16px" }}
        onClick={removeDocument}
      >
        <i class="material-icons">highlight_off</i>
      </Icon>
    </Button>
  );
}

else{
  return (
    <Button
      variant="outlined"
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid rgba(5, 5, 5, 0.11999999731779099)",
        // minWidth: 300,
        minWidth: "auto",
          wordBreak: "break-all",
        justifyContent: "space-between"
      }}
    >
      {document.fileName}
      <Icon
        style={{ color: "#E54D42", marginLeft: "16px" }}
        onClick={removeDocument}
      >
        <i class="material-icons">highlight_off</i>
      </Icon>
    </Button>
  );
    }
};


export default UploadedDocument;
