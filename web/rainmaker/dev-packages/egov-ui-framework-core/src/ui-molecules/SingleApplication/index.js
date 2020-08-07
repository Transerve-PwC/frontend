import React from "react";
import { connect } from "react-redux";
import Label from "../../ui-containers/LabelContainer";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import get from "lodash/get";
import { withStyles } from "@material-ui/core/styles";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import "./index.css";
import { checkValueForNA } from "../../ui-config/screens/specs/utils";
import { localStorageSet } from "egov-ui-kit/utils/localStorageUtils";
import { httpRequest } from "egov-ui-framework/ui-utils/api";
import { convertEpochToDate } from "egov-ui-framework/ui-config/screens/specs/utils";
import { epochToDate, navigateToApplication, getApplicationType } from "egov-ui-kit/utils/commons";
import orderBy from "lodash/orderBy";
const styles = {
  card: {
    marginLeft: 8,
    marginRight: 8,
    borderRadius: "inherit"
  }
};


class SingleApplication extends React.Component {

  setBusinessServiceDataToLocalStorage = async (queryObject) => {
    const { toggleSnackbar } = this.props;
    try {
      const payload = await httpRequest("post", "egov-workflow-v2/egov-wf/businessservice/_search", "_search", queryObject);
      localStorageSet("businessServiceData", JSON.stringify(get(payload, "BusinessServices")));
      return get(payload, "BusinessServices");
    } catch (e) {
      toggleSnackbar(
        true,
        {
          labelName: "Not authorized to access Business Service!",
          labelKey: "ERR_NOT_AUTHORISED_BUSINESS_SERVICE",
        },
        "error"
      );
    }
  };

  onCardClick = async (item) => {
    const { moduleName, toggleSnackbar, setRoute } = this.props;
    if (moduleName === "TL") {
      const wfCode = get(item, "workflowCode");
      const businessServiceQueryObject = [
        { key: "tenantId", value: get(item, "tenantId") },
        {
          key: "businessServices",
          value: !!wfCode ? wfCode : "NewTL"
        }
      ];
      await this.setBusinessServiceDataToLocalStorage(businessServiceQueryObject);
      switch (item.status) {
        case "INITIATED":
        case "MODIFIED":
        case "PENDINGCLARIFICATION":
          setRoute(`/tradelicense-citizen/apply?applicationNumber=${item.applicationNumber}&tenantId=${item.tenantId}`);
          break
        default:
          setRoute(`/tradelicence/search-preview?applicationNumber=${item.applicationNumber}&tenantId=${item.tenantId}`);
      }
    } else if (moduleName === "FIRENOC") {
      switch (item.fireNOCDetails.status) {
        case "INITIATED":
          setRoute(`/fire-noc/apply?applicationNumber=${item.fireNOCDetails.applicationNumber}&tenantId=${item.tenantId}`);
        default:
          setRoute(`/fire-noc/search-preview?applicationNumber=${item.fireNOCDetails.applicationNumber}&tenantId=${item.tenantId}`);
      }
    } else if (moduleName === "BPAREG") {
      if (item.serviceType === "BPAREG") {
        switch (item.status) {
          case "INITIATED":
            setRoute(`/bpastakeholder-citizen/apply?applicationNumber=${item.applicationNumber}&tenantId=${item.tenantId}`);
          default:
            setRoute(`/bpastakeholder/search-preview?applicationNumber=${item.applicationNumber}&tenantId=${item.tenantId}`);
        }
      } else {
        switch (item.status) {
          case "Initiated":
            setRoute(`/egov-bpa/apply?applicationNumber=${item.applicationNumber}&tenantId=${item.tenantId}`);
            break;
          default:
            setRoute(`/egov-bpa/search-preview?applicationNumber=${item.applicationNumber}&tenantId=${item.tenantId}`);
        }
      }
    } else if (moduleName === "PT-MUTATION") {
      if (item.acknowldgementNumber) {
        const businessService = await getApplicationType(item.acknowldgementNumber, item.tenantId)
        console.log("businessService-----", businessService);
        if (businessService) {
          // navigateToApplication(businessService, this.props.history, item.acknowldgementNumber, item.tenantId, item.propertyId);
          if (businessService == 'PT.MUTATION') {
            setRoute("/pt-mutation/search-preview?applicationNumber=" + item.acknowldgementNumber + "&propertyId=" + item.propertyId + "&tenantId=" + item.tenantId);
          } else if (businessService == 'PT.CREATE') {
            setRoute("/property-tax/application-preview?propertyId=" + item.propertyId + "&applicationNumber=" + item.acknowldgementNumber + "&tenantId=" + item.tenantId + "&type=property");
          } else {
            console.log('Navigation Error');
          }
        } else {
          toggleSnackbar(
            true,
            {
              labelName: "Business service returns empty response!",
              labelKey: "Business service returns empty response!",
            },
            "error"
          );
        }
      }
    } else if (moduleName === "PET-NOC") {
      switch (item.status) {
        case "INITIATED":
          setRoute(`/egov-opms/apply?applicationNumber=${item.applicationNumber}&tenantId=${item.tenantId}`);
        default:
          setRoute(`/egov-opms/search-preview?applicationNumber=${item.applicationId}&tenantId=${item.tenantId}`);
      }
    } else if (moduleName === "SELL-MEAT-NOC") {
      switch (item.status) {
        case "INITIATED":
          setRoute(`/egov-opms/apply?applicationNumber=${item.applicationNumber}&tenantId=${item.tenantId}`);
        default:
          setRoute(`/egov-opms/sellmeatnoc-search-preview?applicationNumber=${item.applicationId}&tenantId=${item.tenantId}`);
      }
    } else if (moduleName === "HC") {
      switch (item.status) {
        case "INITIATED":
          setRoute(`/egov-hc/search-preview?applicationNumber=${item.serviceRequestId}&tenantId=ch.chandigarh&serviceType=${item.service_type}`);
        default:
          setRoute(`/egov-hc/search-preview?applicationNumber=${item.service_request_id}&tenantId=ch.chandigarh&serviceType=${item.service_type}`);
      }
    } else if (moduleName === "ADVERTISEMENT-NOC") {
      switch (item.status) {
        case "INITIATED":
          setRoute(`/egov-opms/apply?applicationNumber=${item.applicationNumber}&tenantId=${item.tenantId}`);
        default:
          setRoute(`/egov-opms/advertisementnoc-search-preview?applicationNumber=${item.applicationId}&tenantId=${item.tenantId}`);
      }
    } else if (moduleName === "ROADCUT-NOC") {
      switch (item.status) {
        case "INITIATED":
          setRoute(`/egov-opms/apply?applicationNumber=${item.applicationNumber}&tenantId=${item.tenantId}`);
        default:
          setRoute(`/egov-opms/roadcutnoc-search-preview?applicationNumber=${item.applicationId}&tenantId=${item.tenantId}`);
      }
    } else if (moduleName === "EGOV-ECHALLAN") {
      switch (item.status) {
        case "INITIATED":
          setRoute(`/egov-echallan/apply?challanNumber=${item.challanId}&tenantId=${item.tenantId}`);
        default:
          setRoute(`/egov-echallan/search-preview?challanNumber=${item.challanId}&tenantId=${item.tenantId}`);
      }
    } else if(moduleName === "OWNERSHIPTRANSFERRP") {
      switch (item.applicationState) {
        case "OT_DRAFTED": 
          setRoute(`/rented-properties-citizen/ownership-apply?applicationNumber=${item.ownerDetails.applicationNumber}&tenantId=${item.tenantId}`)
          break;
          case "OT_PENDINGCLVERIFICATION": 
          setRoute(`/rented-properties-citizen/ownership-apply?applicationNumber=${item.ownerDetails.applicationNumber}&tenantId=${item.tenantId}`)
          break;
        default:
          setRoute(`/rented-properties/ownership-search-preview?applicationNumber=${item.ownerDetails.applicationNumber}&tenantId=${item.tenantId}`)
      }
    }
    else if(moduleName === "DUPLICATECOPYOFALLOTMENTLETTERRP") {
      switch (item.state) {
        case "DC_DRAFTED": 
          setRoute(`/rented-properties-citizen/duplicate-copy-apply?applicationNumber=${item.applicationNumber}&tenantId=${item.tenantId}`)
          break;
          case "DC_PENDINGCLVERIFICATION": 
          setRoute(`/rented-properties-citizen/duplicate-copy-apply?applicationNumber=${item.applicationNumber}&tenantId=${item.tenantId}`)
          break;
        default:
          setRoute(`/rented-properties/search-duplicate-copy-preview?applicationNumber=${item.applicationNumber}&tenantId=${item.tenantId}`)
      }
    } else if(moduleName === "MORTGAGERP") {
      switch(item.state) {
        case "MG_DRAFTED": 
        setRoute(`/rented-properties-citizen/mortage-apply?applicationNumber=${item.applicationNumber}&tenantId=${item.tenantId}`)
        break;
        case "MG_PENDINGCLVERIFICATION": 
        setRoute(`/rented-properties-citizen/mortage-apply?applicationNumber=${item.applicationNumber}&tenantId=${item.tenantId}`)
        break;
        default:
          setRoute(`/rented-properties/mortgage-search-preview?applicationNumber=${item.applicationNumber}&tenantId=${item.tenantId}`)
    }
   } 
  };

  onButtonCLick = () => {
    const { setRoute, homeURL } = this.props;
    setRoute(homeURL);
  };
  generatevalidity = (item) => {
    const validFrom = item.validFrom ? convertEpochToDate(get(item, "validFrom")) : "NA";
    const validTo = item.validTo ? convertEpochToDate(get(item, "validTo")) : "NA";
    const validity = validFrom + " - " + validTo;
    return validity;
  }
  generateLabelKey = (content, item) => {
    let LabelKey = "";
    if (content.prefix && content.suffix) {
      LabelKey = `${content.prefix}${get(item, content.jsonPath, "").replace(
        /[._:-\s\/]/g,
        "_"
      )}${content.suffix}`;
    } else if (content.prefix) {
      LabelKey = `${content.prefix}${get(item, content.jsonPath, "").replace(
        /[._:-\s\/]/g,
        "_"
      )}`;
    } else if (content.suffix) {
      LabelKey = `${get(item, content.jsonPath, "").replace(/[._:-\s\/]/g, "_")}${
        content.suffix
        }`;
    } else if (content.callBack) {
      LabelKey = content.callBack(get(item, content.jsonPath, ""))
    } else {
      LabelKey = content.label === "PT_MUTATION_CREATION_DATE" ? `${epochToDate(get(item, content.jsonPath, ""))}` : `${get(item, content.jsonPath, "")}`;
    }
    return LabelKey;
  };

  render() {
    const { searchResults, classes, contents, moduleName, setRoute } = this.props;
    return (
      <div className="application-card">
        {searchResults && searchResults.length > 0 ? (
          searchResults.map(item => {
            return (
              <Card className={classes.card}>
                <CardContent>
                  <div>
                    {contents.map(content => {
                      return (
                        <Grid container style={{ marginBottom: 12 }}>
                          <Grid item xs={6}>
                            <Label
                              labelKey={content.label}
                              fontSize={14}
                              style={{
                                fontSize: 14,
                                color: "rgba(0, 0, 0, 0.60"
                              }}
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <Label
                              labelKey={this.generateLabelKey(content, item)}
                              fontSize={14}
                              checkValueForNA={checkValueForNA}
                              style={{
                                fontSize: 14,
                                color: "rgba(0, 0, 0, 0.87"
                              }}
                            />
                          </Grid>
                        </Grid>
                      );
                    })}
                    {moduleName === "TL" &&
                      <div>
                        <Grid container style={{ marginBottom: 12 }}>
                          <Grid item xs={6}>
                            <Label
                              labelKey="TL_COMMON_TABLE_VALIDITY"
                              fontSize={14}
                              style={{
                                fontSize: 14,
                                color: "rgba(0, 0, 0, 0.60"
                              }}
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <Label
                              labelKey={this.generatevalidity(item)}
                              fontSize={14}
                              checkValueForNA={checkValueForNA}
                              style={{
                                fontSize: 14,
                                color: "rgba(0, 0, 0, 0.87"
                              }}
                            />
                          </Grid>
                        </Grid>
                      </div>
                    }

                    {/* <Link to={this.onCardClick(item)}> */}
                    <div style={{ cursor: "pointer" }} onClick={() => {
                      const url = this.onCardClick(item);
                      // setRoute(url);
                    }}>
                      <Label
                        labelKey={moduleName === "EGOV-ECHALLAN" ? "EC_VIEW_DETAILS" : "TL_VIEW_DETAILS"}
                        textTransform={"uppercase"}
                        style={{
                          color: "#fe7a51",
                          fontSize: 14,
                          textTransform: "uppercase"
                        }}
                      />
                    </div>
                    {/* </Link> */}
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
            <div className="no-assessment-message-cont">
              <Label
                labelKey={"No results Found!"}
                style={{ marginBottom: 10 }}
              />
              <Button
                style={{
                  height: 36,
                  lineHeight: "auto",
                  minWidth: "inherit"
                }}
                className="assessment-button"
                variant="contained"
                color="primary"
                onClick={this.onButtonCLick}
              >
                <Label labelKey={`${moduleName}_NEW_APPLICATION`} />
              </Button>
            </div>
          )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const searchResultsRaw = get(
    state.screenConfiguration.preparedFinalObject,
    "searchResults",
    []
  );
  let searchResults = orderBy(
    searchResultsRaw,
    ["auditDetails.lastModifiedTime"],
    ["desc"]);
  searchResults = searchResults ? searchResults : searchResultsRaw;
  const screenConfig = get(state.screenConfiguration, "screenConfig");
  return { screenConfig, searchResults };
};

const mapDispatchToProps = dispatch => {
  return {
    setRoute: path => dispatch(setRoute(path)),
    toggleSnackbar: (open, message, type) => dispatch(toggleSnackbar(open, message, type))
  };
};

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SingleApplication)
);
