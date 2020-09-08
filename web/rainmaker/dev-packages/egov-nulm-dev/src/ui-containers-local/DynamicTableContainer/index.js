import React from "react";
import {
  TEXT,
  CHECKBOX,
  LABEL,
  ACTION_ADD,
  ACTION_SUB,
  BUTTON
} from "./constant";
import { connect } from "react-redux";
import { getTextField, getCheckbox, getLabel, getButton } from "./tableHelper";
import get from "lodash/get";
//import MaterialTable from "material-table";
/*
header =[
    {type, name},
    {type, name},
    {type, name},
]

data = [
        [1, 'abc', 'Y']
        []
    ]

each colm has format {
    value
}
*/

class Table extends React.Component {
  prepareTableHeader = () => {
    const { header, isDynamicRowReqr } = this.props;

    const tableHeading = header.map((colm, headIndex) => (
      <th key={headIndex}>{colm.name}</th>
    ));

    if (isDynamicRowReqr) {
      tableHeading.push(<th key={tableHeading.length}>Actions</th>);
    }

    return <tr>{tableHeading}</tr>;
  };

  prepareTableColumByType(colm, index, type) {
    const {columnProp}  = this.props.header[0]
    switch (type) {
      case TEXT:
        return <td key={index}>{getTextField(colm)}</td>;

      case CHECKBOX:
        return <td key={index}>{getCheckbox(colm)}</td>;

      case LABEL:
        return <td key={index}>{getLabel(colm)}</td>;

      case BUTTON:
        return <td key={index}>{getButton(colm.label, colm.handleClick)}</td>;

      default:
        break;
    }
  }

  addRow = () => {
    alert("add");
  };

  deleteRow = () => {
    alert("delete");
  };

  prepareTableRow = (row, rowIndex, actionLabel = ACTION_SUB) => {
    const { isDynamicRowReqr, header } = this.props;

    const tableRows = row.map((colm, colmIndex) =>
      this.prepareTableColumByType(colm, colmIndex, header[colmIndex].type)
    );

    if (isDynamicRowReqr) {
      const colm = {
        label: actionLabel,
        handleClick: actionLabel === ACTION_ADD ? this.addRow : this.deleteRow
      };

      tableRows.push(
        this.prepareTableColumByType(colm, tableRows.length, BUTTON)
      );
    }

    return <tr key={rowIndex}>{tableRows}</tr>;
  };

  prepareNewDummyRow = () => {
    const { header, data } = this.props;

    const row = Array(header.length).fill("");
    return this.prepareTableRow(row, data.length, ACTION_ADD);
  };

  render() {
    const { data = [] } = this.props;

    const tableHeader = this.prepareTableHeader();

    return (
      <div>
        <table border="1">
          <thead>{tableHeader}</thead>

          <tbody>
            {data.map((row, index) => this.prepareTableRow(row, index))}
            {this.prepareNewDummyRow()}
          </tbody>
        </table>
      </div>
    );
  }
}

 const mapStateToProps = (state, ownprops) => {
  const {screenName , jsonPath} = ownprops;
  const {} = state ;
  let data = get(state.screenConfiguration.screenConfig[screenName],jsonPath, [] ) ;
  return data;
 }

 const mapDispatchToProps = (state, ownprops) => {
 // console.log("dp", state)
}


export default connect(mapStateToProps,mapDispatchToProps)(Table);

