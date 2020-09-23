
import React, { Component } from "react";
import { connect } from "react-redux";
//import TableData from "./components/TableData";
import Label from "egov-ui-kit/utils/translationNode";
import ServiceList from "egov-ui-kit/common/common/ServiceList";
//import FilterDialog from "./components/FilterDialog";
import MenuButton from "egov-ui-framework/ui-molecules/MenuButton";
import Grid from "@material-ui/core/Grid";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { fetchLocalizationLabel } from "egov-ui-kit/redux/app/actions";
import { getTenantId, getLocale } from "egov-ui-kit/utils/localStorageUtils";
import LoadingIndicator from "egov-ui-framework/ui-molecules/LoadingIndicator";
import CustomPieChart from './components/CustomPieChart';
import CustomTooltip from './components/CustomTooltip';
import CustomBarChart from './components/CustomBarChart';
import { toggleSnackbar,prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { httpRequest } from "egov-ui-framework/ui-utils/api";
import {DashbordData } from "./utils/sampleResponses";
import get from "lodash/get";
//import StackedBarChart from './components/StackedBarChart';
import { formatChartData, formatComplaintsOpenClosed, calcSlaBreachPerc, extractUniqItems } from './utils/index';
//import "./index.css";
class DashbordContainer extends Component {
    constructor(props) {
        super(props);
    
        // this.handleChange = this.handleChange.bind(this);
        // this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSlaBreachPieClick = this.handleSlaBreachPieClick.bind(this);
        // this.handleComplaintSourcePieClick = this.handleComplaintSourcePieClick.bind(this);
        // this.handleGisNav = this.handleGisNav.bind(this);
      }
    state = {
        actionList: [],
        hasWorkflow: false,
        filterPopupOpen: false
      };
      componentDidMount = async () => {
        const {fetchLocalizationLabel} = this.props
        const tenantId = getTenantId();
        fetchLocalizationLabel(getLocale(), tenantId, tenantId);
        //get data from api
       
        const queryObject = [
                   { key: "tenantId", value: tenantId }
        ];
        try {
        //   const payload = await httpRequest(
        //     "post",
        //     "egov-workflow-v2/egov-wf/process/_search",
        //     "",
        //     queryObject
        //   );
        //   const payload = await httpRequest("post", "store-asset-services/indents/_search", "", queryObject, {} );

         
        //   if (payload && payload.indents.length > 0) {          

         
        //     const DashbordData_ = DashbordData()
        //     prepareFinalObject("Dashbord", DashbordData_);
        //   } else {
        //     toggleSnackbar(
        //       true,
        //       {
        //         labelName: "Workflow returned empty object !",
        //         labelKey: "WRR_WORKFLOW_ERROR"
        //       },
        //       "error"
        //     );
        //   }
        } catch (e) {
          toggleSnackbar(
            true,
            {
              labelName: "Workflow returned empty object !",
              labelKey: "WRR_WORKFLOW_ERROR"
            },
            "error"
          );
        }
      }
      handleSlaBreachPieClick(data) {
        const { dispatch } = this.props;
        // dispatch(addConstraint(ES_MAPPING.SLA_IS_BREACHED, data.name.toString()));
        // dispatch(refreshDashboardData('complaint'));
      }
     
      componentWillReceiveProps(nextProps) {
        const { menu } = nextProps;
        const workflowList = menu && menu.filter((item) => item.name === "rainmaker-common-workflow");
        if (workflowList && workflowList.length > 0) {
          this.setState({
            hasWorkflow: true,
          });
        } else {
          this.setState({
            hasWorkflow: false,
          });
        }
    
        const list = menu && menu.filter((item) => item.url === "card");
        this.setState({
          actionList: list,
        });
      }
    
      handleClose = () => {
        this.setState({ filterPopupOpen: false });
      };
    
      onPopupOpen = () => {
        this.setState({ filterPopupOpen: true });
      }
    render() {
        const { name, history, setRoute, menu,Loading,APIData } = this.props;
        const { actionList, hasWorkflow } = this.state;
        const {isLoading}=Loading;
        let data =[];
        let apidata = APIData;
        console.log(apidata)
        console.log("apidata")
       // const DashbordData = DashbordData()
       //alert(hasWorkflow)
       data.push(
        {
            key:"open",
            doc_count:10
        },
        {
            key:"Closed",
            doc_count:40
        },
        {
            key:"resolved",
            doc_count:20
        },
        {
            key:"reassignrequested",
            doc_count:5
        }
    )
    let data_c =[];
    data_c.push(
        {
            key:"web",
            doc_count:70
        },
        {
            key:"whatsup",
            doc_count:30
        },
        
    )
    let data_d =[];
    data_d.push(
        {
            key:"Operation & Maintenance",
            doc_count:25
        },
        {
            key:"Helth & Sanitation",
            doc_count:30
        },
        {
            key:"Street Light",
            doc_count:48
        },
        {
            key:"Accounts Branch",
            doc_count:15}
    )
        
        return (
            <div>
                <div className="rainmaker-topHeader" style={{ marginTop: 15, justifyContent: "space-between" }}>
            {Loading&&isLoading&&<LoadingIndicator></LoadingIndicator>}
          {/* <div className="rainmaker-topHeader flex">
            <Label className="landingPageHeader flex-child" label={"CS_LANDING_PAGE_WELCOME_TEXT"} />
            <Label className="landingPageUser flex-child" label={name} />,
          </div> */}
         
        </div>
        {/* <div>
            
        {
            data&&(
                <div style={{display:"flex",marginLeft:"10px"}}>
                
          <Grid item xs={4}>
            <CustomPieChart
              onClick={this.handleSlaBreachPieClick}
              data={formatChartData(data)}
              heading="Complaint By Status"
              tooltip={
                <CustomTooltip
                  formatLabel={label => (label === 0 ? 'Within SLA' : 'SLA Breached')}
                />
              }
            />
          </Grid>
          <Grid item xs={4}>    
            <CustomPieChart
              onClick={this.handleSlaBreachPieClick}
              data={formatChartData(data_c)}
              heading="Complaint By Channel"
              tooltip={
                <CustomTooltip
                  formatLabel={label => (label === 0 ? 'Within SLA' : 'SLA Breached')}
                />
              }
            />
          </Grid>
          <Grid item xs={4}>
            <CustomPieChart
              onClick={this.handleSlaBreachPieClick}
              data={formatChartData(data_d)}
              heading="Complaint By Department"
              tooltip={
                <CustomTooltip
                  formatLabel={label => (label === 0 ? 'Within SLA' : 'SLA Breached')}
                />
              }
            />
          </Grid>

        
          </div>
            )
        }
        </div> */}
        <div>
            {
                APIData &&(
                    <div style={{display:"flex",paddingLeft:"10px"}}>
                        {
                            APIData.length==0?(
                                <div></div>
                            ):(
                                APIData.complaintSources.map((item,i)=>{
                                    return(
                                    
                                        <Grid item xs={4} style={{paddingRight:"10px"}}>
                                        <CustomPieChart
                                          onClick={this.handleSlaBreachPieClick}
                                          data={formatChartData(item.aggregations)}
                                          heading={item.heading}
                                          tooltip={
                                            <CustomTooltip
                                              formatLabel={label => (label === 0 ? 'Within SLA' : 'Value')}
                                            />
                                          }
                                        />
                                      </Grid>
                                      
                                        )
                            
                            })
                           )
                        }
                        
                       

                    </div>
                )
            }
           
        </div>
        <div>
            {
                APIData &&(
                    <div style={{display:"flex",paddingLeft:"10px"}}>
                        {
                            APIData.length==0?(
                                <div></div>
                            ):(
                                APIData.complaintSources.map((item,i)=>{
                                    return(
                                    
                                      <Grid item lg={4} sm={12} xs={12}>
                                      <CustomBarChart
                                        data={formatChartData(item.aggregations)}
                                        heading={item.heading}
                                      />
                                    </Grid>
                                      
                                        )
                            
                            })
                           )
                        }
                        
                       

                    </div>
                )
            }
           
        </div>

            </div>
    );
    }
}
    const mapStateToProps = (state) => {
    const { auth, app ,screenConfiguration} = state;
    const { menu } = app;
    const { userInfo } = auth;
    const name = auth && userInfo.name;
    const { preparedFinalObject } = screenConfiguration;
    const { Loading={}} = preparedFinalObject;
    const {isLoading}=Loading;
    let APIData = get(
        state,
        "screenConfiguration.preparedFinalObject.APIData",
        []
      );
    return { name, menu ,Loading,isLoading,APIData};
    };

    const mapDispatchToProps = (dispatch) => {
    return {
    setRoute: url => dispatch(setRoute(url)),
    fetchLocalizationLabel: (locale,tenantId,module) => dispatch(fetchLocalizationLabel(locale,tenantId,module)),
    };
    }

    export default connect(
    mapStateToProps, mapDispatchToProps
    )(DashbordContainer);
