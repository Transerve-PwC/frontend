import React from "react";
import MUIDataTable from "mui-datatables";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import Switch from '@material-ui/core/Switch';
//import Cities from "./cities";
import set from "lodash/set";
import get from "lodash/get";
import PropTypes from "prop-types";
import cloneDeep from "lodash/cloneDeep";
import { createMuiTheme, MuiThemeProvider, withStyles } from "@material-ui/core/styles";
import "./index.css";
import { connect } from "react-redux";


const customStyles = {
  PaymentPaidRow: {
    '& td': { backgroundColor: "#64C" }
  },
  NameCell: {
    fontWeight: 900
  },
  "MUIDataTable-responsiveScroll" : {
    scrollMaxHeight:"auto"
  },
};

class CustomizeTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: this.props.data,
      columns: this.props.columns,
      rowsSelected: [],
      title: this.props.title,
      options: this.props.options,
      customSortOrder: "asc",
      id: this.props.id === "undefined" ? 'mui-table' : this.props.id
    };

  }

  getMuiTheme = () =>
    createMuiTheme({
      overrides: {
        MUIDataTableBodyCell: {
          root: {
            "&:nth-child(2)": {
              color: "#2196F3",
              cursor: "pointer"
            }
          }
        },
        MuiTypography: {
          caption: {
            fontSize: "14px"
          }
        },
        MuiFormLabel: {
          root: {
            fontSize: "14px"
          }
        },
        MuiTableCell: {
          body: {
            fontSize: 14
          }
        }
      }
    });

  formatData = (data, columns) => {
    return (
      data &&
      [...data].reduce((acc, curr) => {
        let dataRow = [];
        // Object.keys(columns).forEach(column => {
        columns.forEach(column => {
          // Handling the case where column name is an object with options
          column = typeof column === "object" ? get(column, "name") : column;
          let columnValue = get(curr, `${column}`, "");
          if (get(columns, `${column}.format`, "")) {
            columnValue = columns[column].format(curr);
          }
          dataRow.push(columnValue);
        });
        let updatedAcc = [...acc];
        updatedAcc.push(dataRow);
        return updatedAcc;
      }, [])
    );
  };

  columnLocalisation = (localizationLabels, columns) => {
    const  localisationArray = Object.values(localizationLabels);
    const {columns : stateColumn} = this.state;
    const { title } = this.state;
    let columnName = [];
    let tempColumnName = "";
    columns.forEach(column => {
      // Handling the case where column name is an object with options
      tempColumnName = typeof column === "object" ? get(column, "name") : column;
      const locMessageObj =  localisationArray.find(locMessage => locMessage.code === tempColumnName);
      if (locMessageObj) {
        if (typeof column === "object") {
          const tempObject = {...column,name:locMessageObj.message,label:locMessageObj.message}
          // set(column, "name", locMessageObj.message);
          // set(column, "label", locMessageObj.message);
          columnName.push(tempObject);
        } else {
          columnName.push(locMessageObj.message);
        }
      }
      else{
        columnName.push(column);
      }
    });
    let oldColumnData = [...stateColumn];
    let newColumnData = [...columnName];
    const checkFlag = _.isEqual(newColumnData.sort(), oldColumnData.sort());
    if(!checkFlag){
      this.setState({columns : columnName});
    }
    const locMessageTitleObj = localisationArray.find(locMessage => locMessage.code === title);
    if (title && title != undefined && locMessageTitleObj != undefined) {
      if(locMessageTitleObj.message!=title)
        this.setState({title : locMessageTitleObj.message});
    }
    
  }
  
  
    componentDidUpdate (prevProps, prevState){
    const {localizationLabels} = this.props;
    const { data, columns } = this.props;
    this.columnLocalisation(localizationLabels, columns);
  }

  componentWillReceiveProps(nextProps) {
    const { data, columns, options } = nextProps;
    this.updateTable(data, columns, options);
  }

  componentDidMount() {
    const { data, columns, options } = this.props;
    this.updateTable(data, columns, options);
  }

  updateTable = (data, columns, options) => {
    // const updatedData = this.formatData(data, columns);
    // Column names should be array not keys of an object!
    // This is a quick fix, but correct this in other modules also!
    let fixedColumns = Array.isArray(columns) ? columns : Object.keys(columns);
    const updatedData = data; //this.formatData(data, fixedColumns);
    this.setState({
      data: updatedData,
      // columns: Object.keys(columns)
      columns: fixedColumns,
      options: options
    });
  };

  render() {

    const columns = [
      {
        name: "name",
        options: {
          filter: false,
          customBodyRender: (value, tableMeta, updateValue) => (
            <FormControlLabel
              value={value}
              control={<TextField value={value} />}
              onChange={event => updateValue(event.target.value)}
            />
          )
        }
      },
      {
        name: "Title",
        options: {
          filter: true,
        }
      },
      {
        name: "location",
        options: {
          filter: true,
          // customBodyRender: (value, tableMeta, updateValue) => {
          //   return (
          //     <Cities
          //       value={value}
          //       index={tableMeta.columnIndex}
          //       change={event => updateValue(event)}
          //     />
          //   );
          // },
        }
      },
      {
        name: "age",
        options: {
          filter: false,
          customBodyRender: (value, tableMeta, updateValue) => (
            <FormControlLabel
              control={<TextField value={value || ''} type='number' />}
              onChange={event => updateValue(event.target.value)}
            />
          )
        }
      },
      {
        name: "salary",
        options: {
          filter: true,
          customBodyRender: (value, tableMeta, updateValue) => {

            const nf = new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            });

            return nf.format(value);
          }
        }
      },
      {
        name: "Active",
        options: {
          filter: true,
          customBodyRender: (value, tableMeta, updateValue) => {

            return (
              <FormControlLabel
                label={value ? "Yes" : "No"}
                value={value ? "Yes" : "No"}
                control={
                  <Switch color="primary" checked={value} value={value ? "Yes" : "No"} />
                }
                onChange={event => {
                  updateValue(event.target.value === "Yes" ? false : true);
                }}
              />
            );

          }
        }
      }
    ];

    const data = [
      ["Robin Duncan", "Business Analyst", "Los Angeles", null, 77000, false],
      ["Mel Brooks", "Business Consultant", "Oklahoma City", 37, null, true],
      ["Harper White", "Attorney", "Pittsburgh", 52, 420000, false],
      ["Kris Humphrey", "Agency Legal Counsel", "Laredo", 30, 150000, true],
      ["Frankie Long", "Industrial Analyst", "Austin", 31, 170000, false],
      ["Brynn Robbins", "Business Analyst", "Norfolk", 22, 90000, true],
      ["Justice Mann", "Business Consultant", "Chicago", 24, 133000, false],
      ["Addison Navarro", "Business Management Analyst", "New York", 50, 295000, true],
      ["Jesse Welch", "Agency Legal Counsel", "Seattle", 28, 200000, false],
      ["Eli Mejia", "Commercial Specialist", "Long Beach", 65, 400000, true],
      ["Gene Leblanc", "Industrial Analyst", "Hartford", 34, 110000, false],
      ["Danny Leon", "Computer Scientist", "Newark", 60, 220000, true],
      ["Lane Lee", "Corporate Counselor", "Cincinnati", 52, 180000, false],
      ["Jesse Hall", "Business Analyst", "Baltimore", 44, 99000, true],
      ["Danni Hudson", "Agency Legal Counsel", "Tampa", 37, 90000, false],
      ["Terry Macdonald", "Commercial Specialist", "Miami", 39, 140000, true],
      ["Justice Mccarthy", "Attorney", "Tucson", 26, 330000, false],
      ["Silver Carey", "Computer Scientist", "Memphis", 47, 250000, true],
      ["Franky Miles", "Industrial Analyst", "Buffalo", 49, 190000, false],
      ["Glen Nixon", "Corporate Counselor", "Arlington", 44, 80000, true],
      ["Gabby Strickland", "Business Process Consultant", "Scottsdale", 26, 45000, false],
      ["Mason Ray", "Computer Scientist", "San Francisco", 39, 142000, true]
    ];

    const options1 = {
      filter: true,
      filterType: 'dropdown',
      responsive: 'scrollMaxHeight'
    };

    const options_new = {
      filter: true,
      download: true,
      viewColumns: false,
      responsive: 'scroll',
      selectableRows: false,
      disableToolbarSelect: false,
      resizableColumns: true,
      hover: true,
      fixedHeaderOptions: {
        xAxis: false,
        yAxis: true
      },

    }


    return (
      <MuiThemeProvider theme={this.getMuiTheme()}>
        <MUIDataTable id={this.state.id} title={this.state.title} data={this.state.data} columns={this.state.columns} options={this.state.options} />
      </MuiThemeProvider>
    );

  }
}

const mapStateToProps = (state, ownProps) => {
  let localizationLabels = get(
      state,
      "app.localizationLabels",
      []
  );
  return { localizationLabels };
};

// export default connect(mapStateToProps, null)(CustomizeTable);
// export default withStyles(customStyles)(CustomizeTable);
export default connect(mapStateToProps)((withStyles(customStyles)(CustomizeTable)));
