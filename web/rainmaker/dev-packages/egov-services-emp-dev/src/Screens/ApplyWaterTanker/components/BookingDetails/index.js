import React, { Component } from 'react';
import { Tabs, Card, TextField, Icon, Button } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";
import { connect } from "react-redux";
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { fetchApplicaionSector } from "../../../../redux/bookings/actions";
import "./index.css";
class BookingsDetails extends Component {

  state = {
    open: false, setOpen: false
  }

  componentDidMount = async () => {
    let { fetchApplicaionSector } = this.props;
    fetchApplicaionSector();
  }
  continue = e => {
    e.preventDefault();
    const { jobTitle, jobCompany, toggleSnackbarAndSetText, jobLocation, handleChange, approverName, comment, houseNo, address, locality, residenials } = this.props;

    if (houseNo == "" || address == "" || locality == "" || residenials == "" || approverName == "") {

      toggleSnackbarAndSetText(
        true,
        {
          labelName: "Error_Message_For_Water_tanker_Application",
          labelKey: `BK_Error_Message_For_Water_tanker_Application`
        },
        "warning"
      );
    } else {
      this.props.nextStep();

    }
  }

  back = e => {
    e.preventDefault();
    this.props.prevStep();
  }
  handleClose = () => {
    this.setState({
      setOpen: false
    })
  };

  handleOpen = () => {
    this.setState({
      setOpen: true
    })
  };
  render() {
    const { jobTitle, jobCompany, jobLocation, applicationSector, handleChange, approverName, comment, houseNo, address, locality, residenials } = this.props;

    let sectorData = [];
    sectorData.push(applicationSector);
    let arrayData = [];
    let y = sectorData.forEach((item, index) => {
      if (item) {
        let finalValues = Object.values(item);
        finalValues.forEach((event) => {
          arrayData.push(event);
        })
      }
    })

    const hintTextStyle = {
      letterSpacing: "0.7px",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      width: "90%",
      overflow: "hidden"
    };
    return (

      <div style={{ float: 'left', width: '100%', padding: '36px 15px' }}>
        <div className="col-xs-12" style={{ background: '#fff', padding: '15px 0' }}>

          <div className="col-sm-6 col-xs-6">

            <TextField
              id="houseNo"
              name="houseNo"
              type="text"

              value={houseNo}
              hintText={
                <Label
                  label="BK_MYBK_CITIZEN_HOUSE_NUMBER_PLACEHOLDER"
                  color="rgba(0, 0, 0, 0.3799999952316284)"
                  fontSize={16}
                  labelStyle={hintTextStyle}
                />
              }
              floatingLabelText={
                <Label
                  key={0}
                  label="BK_MYBK_CREATE_HOUSE_NUMBER"
                  color="rgba(0,0,0,0.60)"
                  fontSize="12px"
                />
              }
              onChange={handleChange('houseNo')}
              underlineStyle={{ bottom: 7 }}
              underlineFocusStyle={{ bottom: 7 }}
              hintStyle={{ width: "100%" }}
            />
          </div>

          <div className="col-sm-6 col-xs-6">
            <TextField
              id="address"
              name="address"
              type="text"
              value={address}
              hintText={
                <Label
                  label="BK_MYBK_NAME_CITIZEN_ADDRESS_PLACEHOLDER"
                  color="rgba(0, 0, 0, 0.3799999952316284)"
                  fontSize={16}
                  labelStyle={hintTextStyle}
                />
              }
              floatingLabelText={
                <Label
                  key={0}
                  label="BK_MYBK_CREATE_CITIZEN_ADDRESS"
                  color="rgba(0,0,0,0.60)"
                  fontSize="12px"
                />
              }
              onChange={handleChange('address')}
              underlineStyle={{ bottom: 7 }}
              underlineFocusStyle={{ bottom: 7 }}
              hintStyle={{ width: "100%" }}
            />
          </div>

          <div className="col-sm-6 col-xs-6">

            <FormControl style={{ width: '100%' }}>
              <InputLabel shrink style={{ width: '100%' }} id="demo-controlled-open-select-label">Locality</InputLabel>
              <Select
                maxWidth={false}
                labelId="demo-controlled-open-select-label-Locality"
                id="demo-controlled-open-select-locality"
                open={this.state.SetOpen}
                onClose={() => this.handleClose()}
                onOpen={() => this.handleOpen()}
                value={locality}
                displayEmpty
                onChange={handleChange('locality')}
              >
                <MenuItem value=""disabled>Locality</MenuItem>
                {arrayData.map((child, index) => (
                  <MenuItem value={child.name}>{child.name}</MenuItem>
                ))}

              </Select>
            </FormControl>

          </div>

          <div className="col-sm-6 col-xs-6">
            <FormControl style={{ width: '100%' }}>
              <InputLabel shrink style={{ width: '100%' }} id="demo-controlled-open-select-label">Residentials/Commercials</InputLabel>
              <Select
                maxWidth={false}
                labelId="demo-controlled-open-select-label"
                id="demo-controlled-open-select"
                open={this.state.SetOpen}
                displayEmpty
                onClose={() => this.handleClose()}
                onOpen={() => this.handleOpen()}
                value={residenials}
                onChange={handleChange('residenials')}
              >
                <MenuItem value="" disabled>Residential/Commercial</MenuItem>
                <MenuItem value='Residential'>Residential</MenuItem>
                <MenuItem value='Commercial'>Commercial</MenuItem>
              </Select>
            </FormControl>


          </div>

          <div className="col-sm-6 col-xs-6">

            <TextField
              id="approver-name"
              name="approver-name"
              type="text"

              value={approverName}
              hintText={
                <Label
                  label="BK_MYBK_APPROVER_NAME_PLACEHOLDER"
                  color="rgba(0, 0, 0, 0.3799999952316284)"
                  fontSize={16}
                  labelStyle={hintTextStyle}
                />
              }
              floatingLabelText={
                <Label
                  key={0}
                  label="BK_MYBK_CREATE_APPROVER_NAME"
                  color="rgba(0,0,0,0.60)"
                  fontSize="12px"
                />
              }
              onChange={handleChange('approverName')}
              underlineStyle={{ bottom: 7 }}
              underlineFocusStyle={{ bottom: 7 }}
              hintStyle={{ width: "100%" }}
            />
          </div>
          <div className="col-sm-6 col-xs-6">

            <TextField
              id="comemnt"
              name="comment"
              type="text"

              value={comment}
              hintText={
                <Label
                  label="BK_MYBK_ADD_COMMENTS_PLACEHOLDER"
                  color="rgba(0, 0, 0, 0.3799999952316284)"
                  fontSize={16}
                  labelStyle={hintTextStyle}
                />
              }
              floatingLabelText={
                <Label
                  key={0}
                  label="BK_MYBK_CREATE_COMMENT"
                  color="rgba(0,0,0,0.60)"
                  fontSize="12px"
                />
              }
              onChange={handleChange('comment')}
              underlineStyle={{ bottom: 7 }}
              underlineFocusStyle={{ bottom: 7 }}
              hintStyle={{ width: "100%" }}
            />
          </div>

          <div className="col-sm-12 col-xs-12" style={{ textAlign: 'right' }}>

            <Button
              className="responsive-action-button"
              primary={true}
              label={<Label buttonLabel={true} label="BK_CORE_COMMON_GOBACK" />}
              fullWidth={true}
              onClick={this.back}
              style={{ marginRight: 18 }}
              startIcon={<ArrowBackIosIcon />}
            />
            <Button
              className="responsive-action-button"
              primary={true}
              label={<Label buttonLabel={true} label="BK_CORE_COMMON_GONEXT" />}
              fullWidth={true}
              onClick={this.continue}
              startIcon={<ArrowForwardIosIcon />}
            />
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => {
  const { bookings, common, auth, form } = state;
  console.log('state in bookdetails==', state)

  let { complaintSector, applicationSector } = bookings;

  return {
    applicationSector
  }
}
const mapDispatchToProps = dispatch => {
  return {
    toggleSnackbarAndSetText: (open, message, error) =>
      dispatch(toggleSnackbarAndSetText(open, message, error)),
    fetchApplicaionSector: () => dispatch(fetchApplicaionSector()),
  }
}


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BookingsDetails);
