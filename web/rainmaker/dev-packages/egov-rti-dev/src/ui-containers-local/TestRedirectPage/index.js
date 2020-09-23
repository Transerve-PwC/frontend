import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { httpRequest } from "egov-ui-framework/ui-utils/api";
import get from "lodash/get";
import set from "lodash/set";
//import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { getSearchResults } from "../../ui-utils/commons";
import React, { Component, Fragment } from 'react';
import { Formik, Field, ErrorMessage, Form } from 'formik';
import axios from 'axios'
import { Redirect } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Button, } from '@material-ui/core';
import MuiTextField from '@material-ui/core/TextField';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import '../ui-utils/opms/custom.css'
import $ from 'jquery';
import Label from "../../../utils/translationNode";
import { textAlign } from '@material-ui/system';
import MenuItem from '@material-ui/core/MenuItem';
import { resource } from './resource'
import { createYupSchema } from "../ui-utils/opms/yupSchemaCreator";
import { Payload } from '../ui-utils/opms/payload'
import * as Yup from 'yup';
import { Global_var } from '../../../utils/endpoint_OPMS'
import { Validation_NOCTPET, Validation_NOCSELLMEAT, Validation_NOCADD, Validation_NOCROADCUT } from '../ui-utils/opms/validation_json'
import { RenderFormikFeilds } from '../ui-utils/opms/FormikFunctionApply'
class TestRedirect extends Component {
  constructor(props) {
    //alert('aaa11')
    super(props)
    this.state = {
      color: [],
      ApplStatus: '',
      jsondata: this.props.JSONdata,
      col: [],
      data1: [],
      fileId_uploadPetPicture: '',
      fileId_VaccinationCertificate: '',
      applicationStatus: '',
      setOpen: 'false',
      getsteps: [],
      stepclasses: [],
      activestep: []
    }

    this.setupwizard = this.setupwizard.bind(this);
  }

  componentWillReceiveProps(nextprops) {
    //alert('aaa11')
    let data = this.props
    if (this.state.getsteps == '') {
      if (data) {
        this.props.getJSONdata('', localStorage.getItem('applicationType'));
      }

      this.setState({
        jsondata: this.props.JSONdata,
      })

      this.getSteppers(this.state.jsondata);
    }
  }

  componentDidMount() {
    //alert('aaa')
    // //alert(localStorage.getItem('applicationType'))

    let userData = localStorage.getItem("user-info")
    sessionStorage.setItem('uuid', this.props.userInfo.uuid)
    let data = this.props
    if (data) {
      this.props.getJSONdata('', localStorage.getItem('applicationType'));
    }

    console.log("Apply props")
    console.log(this.props)
    //$("#root").on('change', '#uploadVaccinationCertificate', function () {
    $("#root").on('change', "input[type='file']", function () {
      // //alert('inside file')
      // //alert($(this).attr('id'))
      var self = this;
      var fileExtension = ['pdf', 'jpg'];
      if ($.inArray($(this).val().split('.').pop().toLowerCase(), fileExtension) == -1) {
        //alert("Only" + " " + fileExtension.join(', ') + " formats are allowed  ");

      }
      else {
        let Efile = $(this).attr('id')
        var fd = new FormData();
        //  //alert($('#' + Efile)[0].files[0])
        var files = $('#' + Efile)[0].files[0];
        fd.append('file', files);
        fd.append('tenantId', 'ch');
        fd.append('module', 'PKH');
        fd.append('tag', 'NOC');
        const config = {
          headers: {
            'content-type': 'multipart/form-data'
          }
        }
        console.log(files)
        var reader = new FileReader();
        reader.readAsDataURL(this.files[0]);
        axios.post(Global_var.URL_FILEUPLOAD, fd, config).then((response) => {
          //  //alert(JSON.stringify(response))
          sessionStorage.setItem(Efile, response.data.files[0].fileStoreId)


        })
          .catch((error) => {
            console.log("Oops something went wrong !!");
          });
      }
    }
    );

  }


  getSteppers = (stepdata) => {
    console.log("Getting steps 111: ")
    console.log(JSON.stringify(stepdata))
    var steps = []
    var stepclasses = []
    stepdata.map((item, index) => {
      if (this.state.getsteps.indexOf(item.sectionName) === -1) {
        if (item.sectionName) {

          var secname = item.sectionName
          var classname = secname.replace(/\s/g, "");
          this.state.getsteps.push(item.sectionName)

          this.state.stepclasses.push(classname)
        }
      }
    })


    console.log("Stepsss :")
    console.log(this.state.getsteps)
  }

  setupwizard = (wizardclasses) => {
    ////alert("class")
    setTimeout(function () {
      wizardclasses.map((item, index) => {

        var wrapclass = item + 'wrap'

        //$( "."+item ).wrapAll( "<div class='"+wrapclass+"' />");
        $("form > div").siblings("." + item).wrapAll("<div class='" + wrapclass + " stepdiv' />");
        console.log("vvvvv" + item)
        console.log(wrapclass)
        if (index > 0) {
          $("." + wrapclass).hide();
        }

      });
    }, 3000);

  }

  nextstep = (e) => {

    ////alert($(".stepdiv:visible").index());
    var numItems = $('.stepdiv').length

    var temp = $(".stepdiv:visible").index();

    //alert(numItems + " : " + temp)
    $(".stepdiv").hide()
    $('.stepdiv').eq(temp + 1).show();
    if (($('.stepdiv').eq(numItems - 1)).is(':visible')) {
      $(".next_step").attr("disabled", true);
      $(".prev_step").attr("disabled", false);
    }
    if (temp == (numItems - 2)) {

      $(".next_step").attr("disabled", true);
    }
  }

  prevstep = (e) => {

    ////alert($(".stepdiv:visible").index());
    var numItems = $('.stepdiv').length
    var temp = $(".stepdiv:visible").index();
    $(".stepdiv").hide()
    $('.stepdiv').eq(temp - 1).show();
    if (temp - 1 == 0) {
      $(".prev_step").attr("disabled", true);
      $(".next_step").attr("disabled", false);
    }

  }
  /*************To Render Feilds **************/
  renderFields(inputs) {
    var count = 0;
    if (count == 0) {
      // return (

      //   <h1>NOC Application</h1>

      // )
      //  //alert(JSON.stringify(inputs))
      var obj = inputs.length;
      //   //alert(obj - 2)
      var temp = inputs[obj - 2]
      if (obj > 0) {

      }

      return inputs.map(input => {


        count++;
        while (input.section <= temp.section) {
          if (input.inputType === 'dropdown') {
            return RenderFormikFeilds.renderSelect(input, input.section);
          }
          else if (input.inputType === "textbox") {
            return RenderFormikFeilds.renderTextFeild(input, input.section);
          }
          else if (input.inputType === 'file') {
            return RenderFormikFeilds.renderFile(input, input.section);
          }

        }


      })


    }
  }
  /*************To set Initial Values **************/

  getInitialValues(inputs) {
    const initialValues = {};
    inputs.forEach(field => {
      if (!initialValues[field['fieldName']]) {
        initialValues[field['fieldName']] = field.value;
      }
    });
    return initialValues;
  }

  render() {
    let role = sessionStorage.getItem('role')
    role = role.toUpperCase()
    const { history } = this.props;
    var step = "<Stepper steps={ ["

    const initialValues = this.getInitialValues(this.props.JSONdata);
    return (
      <div>
        <div class="container-page">
          <div class="row no-margin">
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt-20">
              <h3 class="header-title-18"> {localStorage.getItem('applicationName')}</h3>
              <div className="stepsbar">
                {
                  this.state.getsteps.map((label, index) => {

                    return (
                      <div className="step">
                        <span className='spanindex'>{++index}</span>
                        <div className='spanstep'>{label}</div>
                        <div class="step-bar-right"></div>
                      </div>
                    );


                  })
                }
                {/* <div class="nextbutton">
                  <button class="prev_step" onClick={this.prevstep} >Previous</button>
                   <button class="next_step" onClick={this.nextstep} >Next</button>
                  </div> */}
              </div>
            </div>
            <div className="ViewApplicationCard">
              <div class="row no-margin">
                <Formik
                  enableReinitialize
                  onSubmit={(values, formikBag: FormikBag) => {
                    var applname = localStorage.getItem('applicationType')
                    var data = Payload[applname]
                    Object.keys(data).forEach(function (key) {
                      if (values.hasOwnProperty(key)) {

                        if (data[key] == "file") {
                          data[key] = [
                            {
                              "fileStoreId": sessionStorage.getItem("fileId_VaccinationCertificate")
                            }
                          ]

                        }
                        else {
                          data[key] = values[key]

                        }
                      }
                      else {

                        if (data[key] == "file") {
                          // //alert(key)
                          data[key] = [
                            {
                              "fileStoreId": sessionStorage.getItem(key)
                            }
                          ]

                        }
                      }
                    })

                    let payload = {
                      "applicationType": localStorage.getItem('applicationType'),
                      "tenantId": localStorage.getItem("tenant-id"),
                      "applicationStatus": this.state.applicationStatus,
                      "dataPayload": data,
                      "auditDetails": {
                        "createdBy": 1,
                        "lastModifiedBy": 1,
                        "createdTime": 1578894136873,
                        "lastModifiedTime": 1578894136873
                      }
                    }

                    this.props.submitForm(payload, history)


                  }
                  }
                  validationSchema={localStorage.getItem('applicationType') == "PETNOC" ? Validation_NOCTPET : localStorage.getItem('applicationType') == "SELLMEATNOC" ? Validation_NOCSELLMEAT : localStorage.getItem('applicationType') == "ADVERTISEMENTNOC" ? Validation_NOCADD : localStorage.getItem('applicationType') == "ROADCUT" ? Validation_NOCROADCUT : ''}

                  initialValues={initialValues}
                  render={(errors, status, touched, form, props, handleSubmit) => {

                    this.props.getdata(this.props.JSONdata);

                    return <div>
                      <Form>
                        {this.renderFields(this.props.JSONdata)}
                        <div id="custom-button-footer">
                          <div class="row no-margin">
                            <div class="footer-button pull-right mt-20 mb-20">
                              <button class="btn-1 prev_step" onClick={this.prevstep}>Previous</button>
                              <button class="btn-1">Cancel</button>
                              <button class="btn-1" type="submit" onClick={(e) => {
                                this.setState({
                                  applicationStatus: 'DRAFT'
                                });
                                localStorage.setItem('applicationStatus', 'DRAFT')
                                this.props.handleSubmit
                              }} >Save As Draft</button>
                              <button class="btn-1" id="submit" onClick={(e) => {
                                this.setState({
                                  applicationStatus: 'INITIATE'
                                });
                                this.props.handleSubmit

                              }} type="submit">Submit</button>
                              {/* <button class="btn-1" type="submit" onClick={(e) => {
                            this.setState({
                              applicationStatus: 'DRAFT'
                            })
                            //localStorage.setItem('applicationStatus', 'DRAFT')
                          }} >Save As Draft</button>
                          <button class="btn-1" id="submit" onClick={(e) => {
                            this.setState({
                              applicationStatus: 'INITIATE'
                            })
                          }} type="submit">Submit</button> */}
                              <button class="btn-1 next_step" onClick={this.nextstep}>Next</button>
                            </div>
                          </div>
                        </div>
                      </Form>
                    </div>
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        { /* <HorizontalLinearStepper {...this.props} /> */}
        {this.setupwizard(this.state.stepclasses)}
      </div>
    );
  }

}

const mapDispatchToProps = dispatch => {
  return {
    setRoute: route => dispatch(setRoute(route))
  };
};

export default connect(
  null,
  mapDispatchToProps
)(withRouter(TestRedirect));
