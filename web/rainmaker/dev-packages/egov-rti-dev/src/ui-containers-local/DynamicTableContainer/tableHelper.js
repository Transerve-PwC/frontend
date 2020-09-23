import React from "react";
import TextField from '@material-ui/core/TextField';
export const getTextField = value => {
  return (
    <TextField id="outlined-basic" label="Outlined" variant="outlined" value={value}/>
    // <input
    //   type="text"
    //   value={value}
    //   onChange={() => alert("toggle not possible")}
    // />
  );
};

export const getCheckbox = isTrue => {
  return (
    <input
      type="checkbox"
      checked={isTrue}
      onChange={() => alert("toggle not possible")}
    />
  );
};

export const getLabel = value => {
  return value;
};

export const getButton = (label, handleClick) => {
  return <button onClick={handleClick}>{label}</button>;
};
