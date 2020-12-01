import React, { Component } from "react";
import { Tabs, Card, TextField, Icon, Button } from "components";

import get from "lodash/get";
import MenuButton from "egov-ui-framework/ui-molecules/MenuButton";
import FloatingActionButton from "material-ui/FloatingActionButton";
import { SortDialog, Screen } from "modules/common";
import { fetchApplications, fetchApplicationType } from "egov-ui-kit/redux/bookings/actions";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import Label from "egov-ui-kit/utils/translationNode";
import { transformComplaintForComponent } from "egov-ui-kit/utils/commons";
import { httpRequest } from "egov-ui-kit/utils/api";
import { connect } from "react-redux";
import orderby from "lodash/orderBy";
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";
import isEmpty from "lodash/isEmpty";
import isEqual from "lodash/isEqual";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";

import "./index.css";
import ShowField from "./showField";
import MenuItem from '@material-ui/core/MenuItem';

import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

class example extends Component {

  downloadApplicationButton = async (e) => {
  this.props.history.push(`/egov-services/create-success`);
  
  }

  render() {

    return(
      <div>
          <Label
                label="BK_MYBK_PCC_APPLICATION_REQUEST"
                color="rgba(0, 0, 0, 0.3799999952316284)"
                fontSize={16}
              />
                <Label
                label="BK_CS_COMMON_SEND_MESSAGE"
                color="rgba(0, 0, 0, 0.3799999952316284)"
                fontSize={16}
              />
                <Label
                label="BK_MYBK_PCC_APPLICATION_REQUEST"
                color="rgba(0, 0, 0, 0.3799999952316284)"
                fontSize={16}
              />
                <Label
                label="BK_ES_APPLICATION_CREATED_SUCCESS_MESSAGE"
                color="rgba(0, 0, 0, 0.3799999952316284)"
                fontSize={16}
        
              />
              <Label
                label="BK_MYBK_NAME_CITIZEN_PLACEHOLDER"
                color="rgba(0, 0, 0, 0.3799999952316284)"
                fontSize={16}
              
              />
      <Label label={"BK_MYBK_PCC_APPLICATION_REQUEST"} />
      <Label label={"BK_MYBK_PCC_APPLICATION_REQUEST"} />
      <Label label={"BK_CS_COMMON_SEND_MESSAGE"} />
      <Label label={"BK_ES_APPLICATION_CREATED_SUCCESS_MESSAGE"} />
      <Button
            className="responsive-action-button"
            primary={true}
            label={<Label buttonLabel={true} label="GO" />}
            fullWidth={true}
            onClick={this.downloadApplicationButton}
            style={{ marginRight: 18 }}
          />
      </div>
    )

  }

}

export default example;