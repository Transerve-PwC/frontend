import React from "react";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import EditIcon from "@material-ui/icons/Edit";
import IconButton from "@material-ui/core/IconButton";
import Search from "@material-ui/icons/Search";
import Hidden from "@material-ui/core/Hidden";
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import TablePagination from "@material-ui/core/TablePagination";
import { withStyles } from "@material-ui/core/styles";
//import { Card } from "components";

import "./index.css";

const styles = {
  root: {
    background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
    border: 0,
    borderRadius: 3,
    boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
    color: "white",
    height: 48,
    padding: "0 30px"
  },
  headers: {
     fontSize: '11px',
    marginBottom : '1px',
    width: "200px",
    fontWeight: 600,
    letterSpacing: ".3px",
    lineHeight: "17px"
  },
  tableHeader: {
    whiteSpace :'nowrap', 
    wordBreak: 'keep-all', 
    padding: '4px 20px 4px 20px',
    wordBreak: 'initial',
    fontWeight: 400, 
    fontSize: '14px',
    color : 'rgb(0, 0, 0)',
    letterSpacing: ".3px",
    

  }, 
  tableValue: {
    
    padding: '4px 20px 4px 20px',
    whiteSpace :'nowrap', 
    wordBreak: 'keep-all', 
    fontWeight: 300, 
    fontSize: '14px',
    color : 'rgb(0, 0, 0)',
    letterSpacing: ".3px",
  }, 
  value: {
    width: '200px',
    fontSize: '11px',
    color: "#767676"
  }
};

class InboxData extends React.Component {
  state = {
    sortOrder: "asc",
    isSorting: false,
    page: 0,
    rowsPerPage: 10
  };


  onDialogClose = () => {
    this.setState({
      dialogOpen: false
    });
  };

  handleChangePage(event, newPage) {
    this.setState({ page: newPage });
    
  }

  handleChangeRowsPerPage(event) {
    this.setState({
      rowsPerPage: parseInt(event.target.value, 10),
      page: 0
    });
  }

  sortingTable = (order) => {
    
    const { sortOrder } = this.state;
    
    if (sortOrder !== order) {
      this.setState({
        sortOrder: order,
        isSorting: true
      });
    }
  };

  formatDate(date) {
    if (date != null) {
      let value = new Date(date);
      let d = value.getDate();
      let m = value.getMonth() + 1;
      let y = value.getFullYear();

      return d + "/" + m + "/" + y;
    } else {
      return "NA";
    }
  }

  render() {
    const { data, classes ,columnHideIndex, filterfun} = this.props;
    const emptyRows =
      this.state.rowsPerPage -
      Math.min(
        this.state.rowsPerPage,
        data.rows.length - this.state.page * this.state.rowsPerPage
      );
    const { formatDate } = this;
    const { isSorting } = this.state;
    let rest={disabled: false}
   
    return (
      <div>
       <Hidden >
        <div className="Container Flipped">
          <Table className="Content" size="small">
            <TableHead
              style={{
                backgroundColor: "#eee",
                borderBottom: "1px solid rgb(211, 211, 211)"
              }}
            >
              <TableRow>
                {data.headers.map((item, index) => {
                  // let classNames = `inbox-data-table-headcell inbox-data-table-headcell-${index}`;
                  if (columnHideIndex.includes(index)) return null;
                  else {
                  return (
                    <TableCell className={classes.tableHeader} style={{}}>{item}</TableCell>
                  );
                  }
                })}
              </TableRow>
            </TableHead>

            {data.rows.length === 0 ? (
              <TableBody>{"No Data Found"}</TableBody>
            ) : (
              <TableBody className={classes.body}>
                {console.log(data.rows, 'ooooo')}
                {filterfun
                  .fn(data.rows)
                  .slice(
                    this.state.page * this.state.rowsPerPage,
                    this.state.page * this.state.rowsPerPage +
                      this.state.rowsPerPage
                  )
                  .map((row, i) => {
                    var size = Object.keys(row).length - 1;

                    return (
                      <TableRow key={i} className="inbox-data-table-bodyrow">
                        {Object.entries(row).map(([key, value], i) => {
                          
                          
                          if (columnHideIndex.includes(i) && i!==size) return null;
                          else if(columnHideIndex.includes(i) && i===size) {
                            return(
                              <TableCell>
                                    <IconButton {...rest} onClick={()=> {
                                  
                                    this.props.handleEditClick(row)
                                    
                                    }}
                                    >
                                      <EditIcon
                                        size="small"
                                        style={{ fontSize: "20px" }}
                                      />
                                    </IconButton>
                                  </TableCell>
                            )
                          }
                          else {
                          if (key.toLowerCase().includes("date")) {
                            if(key.toLowerCase().includes("todate"))
                            {
                                if(value!==null) rest={disabled: true}
                                else rest={disabled: false}
                            }
                          
                            if (i === size) {
                              return (
                                <React.Fragment> 
                                  <TableCell className={classes.tableValue}>
                                    {formatDate(value)}{" "}
                                  </TableCell>
                                  <TableCell>
                                    <IconButton {...rest} onClick={()=> {
                                  
                                    this.props.handleEditClick(row)
                                    
                                    }}
                                    >
                                      <EditIcon
                                        size="small"
                                        style={{ fontSize: "20px" }}
                                      />
                                    </IconButton>
                                  </TableCell>
                                </React.Fragment> 
                              );
                            } else {
                              return (
                                <TableCell className={classes.tableValue}>
                                  {formatDate(value)}{" "}
                                </TableCell>
                              );
                            }
                          } else {
                            if (i === size) {
                              return (
                                <React.Fragment> 
                                  <TableCell className={classes.tableValue}>
                                    {value}{" "}
                                  </TableCell>
                                  <TableCell>
                                    <IconButton {...rest} onClick={()=>this.props.handleEditClick(row)}>
                                      <EditIcon
                                        size="small"
                                        style={{ fontSize: "20px" }}
                                      />
                                    </IconButton>
                                  </TableCell>
                                </React.Fragment> 
                              );
                            } else {
                              return (
                                <TableCell className={classes.tableValue}>
                                  {value==="" ? "-": ( value===false? "No": (value===true? "Yes" : value) )}
                                </TableCell>
                              );
                            }
                          }
                        }
                        })}
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={12} />
                  </TableRow>
                )}
              </TableBody>
            )}
          </Table>
          </div> 
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={data.rows.length}
            rowsPerPage={this.state.rowsPerPage}
            page={this.state.page}
            onChangePage={(e, newPage) => {
              this.handleChangePage(e, newPage);
            }}
            onChangeRowsPerPage={(e) => {
              this.handleChangeRowsPerPage(e);
            }}
          />
        </Hidden>
{/* 
        <Hidden only={["sm", "md", "lg", "xl"]} implementation="css">
        
      
    
          {data.rows.length === 0 ? (
            <Card textChildren={<h2> No Data Found</h2>} />
          ) : (
            filterfun.fn(data.rows).map((row, i) => {
              var size = Object.keys(row).length - 1;
              return (
                <Card style={{ margin: "10px", padding : '10px' }}>
                  {Object.entries(row).map(([key, value], i) => {
                    if (key.toLowerCase().includes("date")) {
                      if (i === size) {
                        return (
                          <React.Fragment> 
                            <CardContent style={{ padding: "0px" }}>
                              <div
                                style={{
                                  padding: "0px",
                                  display: "flex",
                                  justifyContent: "flex-start"
                                }}
                              >
                                <Typography
                                  className={classes.headers}
                                  variant="subtitle2"
                                >
                                  {data.headers[i]} :
                                </Typography>
                                <Typography
                                  className={classes.value}
                                  variant="subtitle2"
                                >
                                  {formatDate(value)}
                                </Typography>
                              </div>
                            </CardContent>
                            <CardContent style={{ padding: "0px" }}>
                              <div
                                style={{
                                  padding: "0px",
                                  display: "flex",
                                  justifyContent: "flex-end"
                                }}
                              >
                               
                                <IconButton  style={{ padding: '0px', width: '15px', height: '15px'}} onClick={()=>this.props.handleEditClick(row)}>
                                  <EditIcon
                                    size="small"
                                    style={{ fontSize: "15px" }}
                                  />
                                </IconButton>
                              </div>
                            </CardContent>
                          </React.Fragment> 
                        );
                      } else {
                        return (
                          <CardContent style={{ padding: "0px" }}>
                            <div
                              style={{
                                padding: "0px",
                                display: "flex",
                                justifyContent: "flex-start"
                              }}
                            >
                              <Typography
                                className={classes.headers}
                                variant="subtitle2"
                              >
                                {data.headers[i]} :
                              </Typography>
                              <Typography
                                className={classes.value}
                                variant="subtitle2"
                              >
                                {formatDate(value)}
                              </Typography>
                            </div>
                          </CardContent>
                        );
                      }
                    } else {
                      return (
                        <CardContent style={{ padding: "0px" }}>
                          <div
                            style={{
                              padding: "0px",
                              display: "flex",
                              justifyContent: "flex-start"
                            }}
                          >
                            <Typography
                              className={classes.headers}
                              variant="subtitle2"
                            >
                              {data.headers[i]} :
                            </Typography>
                            <Typography
                              className={classes.value}
                              variant="subtitle2"
                            >
                              {value===false? "No": (value===true? "Yes" : value) }
                            </Typography>
                          </div>
                        </CardContent>
                      );
                    }
                  })}
                </Card>
              );
            })
          )}
        </Hidden> */}
      </div>
    );
  }
}

export default withStyles(styles)(InboxData);
