
import React, { Component, Fragment } from 'react';
import Label from "../../../utils/translationNode";
import { Button, } from '@material-ui/core';
import MuiTextField from '@material-ui/core/TextField';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import { textAlign } from '@material-ui/system';
import MenuItem from '@material-ui/core/MenuItem';
import { Formik, Field, ErrorMessage, Form } from 'formik';

export const RenderFormikFeilds = {
    renderSelect,
    renderTextFeild,
    renderFile,
    renderViewData,
    renderFileData,
    renderRemarkData
}


function renderSelect(input, section) {


    return (

        <div>
            {input.displaySequence == 1 && input.section == section ?
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 input-height">
                    <h2> {input.sectionName} </h2>
                </div> : ""
            }

            <div>
                <Label style={{ marginBottom: "12px" }} req={input.mandatory} bold={true} dark={true} fontSize={10} label={input.fieldName} />
                <Field
                    name={input.fieldName}
                    render={(props) => {
                        const { errors, touched } = props.form;
                        const hasError = errors[input.fieldName] && touched[input.fieldName] ? 'hasError' : '';
                        const { field } = props;
                        const defaultOption = <option key='default' value='Please Select'>Please Select</option>;
                        const options = input.dropdownData.map((anObjectMapped, index) => {
                            return (
                                <option value={anObjectMapped.id} >{anObjectMapped.name}</option>
                            );
                        })
                        const selectOptions = [...options];
                        return (
                            <Select defaultValue='none'
                                id="Select" value={field.value} {...field}>
                                <option value="none" disabled >
                                    Select {input.displayName}
                                </option>

                                {

                                    selectOptions
                                }
                            </Select>
                        );
                    }}
                />
                <span className='errormsgdiv' style={{ color: "red" }}>
                    {
                        <ErrorMessage
                            name={input.fieldName}
                        />}
                </span>
            </div>
        </div>
    );
}

function renderTextFeild(input, section) {

    return (

        <div>
            {input.displaySequence == 1 && input.section == section ?
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 input-height">
                    <h2> {input.sectionName} </h2>
                </div> : ""
            }

            <div>

                <Label style={{ marginBottom: "12px" }} bold={true} dark={false} fontSize={10} color1={true} req={input.mandatory} label={input.fieldName}
                />


                <Field
                    name={input.fieldName}
                    component={TextField}
                    render={(props) => {
                        const { errors, touched } = props.form;
                        const hasError = errors[input.fieldName] && touched[input.fieldName] ? 'hasError' : '';
                        let palce = 'Enter' + ' ' + input.displayName
                        const { field } = props;
                        let name = input.fieldName;
                        return (
                            <div>
                                <TextField
                                    {...field}
                                    type='text'
                                    placeholder={palce}
                                    id={hasError}
                                />
                                <span className='errormsgdiv' style={{ color: "red" }}>
                                    {
                                        <ErrorMessage
                                            name={input.fieldName}
                                        />}
                                </span>
                            </div>
                        );
                    }}
                />

            </div>

        </div>


    );
}


function renderFile(input, section) {

    let language = "english"
    return (
        <div>
            {input.displaySequence == 1 && input.section == section ?
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 input-height">
                    <h2> {input.sectionName} </h2>
                </div> : ""
            }

            <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 input-height">

                <Label style={{ marginBottom: "12px" }} bold={true} dark={true} fontSize={10} label={input.fieldName} req={input.mandatory} />
                <Field
                    name={input.fieldName}
                    render={(props) => {
                        const { errors, touched } = props.form;
                        const hasError = errors[input.fieldName] && touched[input.fieldName] ? 'hasError' : '';
                        let palce = "Enter" + " " + input.label;
                        const { field } = props;
                        let name = input.fieldName;

                        return (
                            <div>

                                <input id={input.fieldName} onChange={RenderFormikFeilds.fileUpload} name="file" type="file" multiple {...field} name={input.fieldName} />

                                <div class="file-line">




                                </div>
                                <span className='errormsgdiv' style={{ color: "red", fontSize: "9px" }}>
                                    {
                                        <ErrorMessage
                                            name={input.fieldName}
                                        />}
                                </span>
                            </div>
                        );
                    }}
                />
            </div>
        </div>
    );
}






function renderViewData(input, section) {
    console.log(input)
    return (

        <div>

            {input.displaySequence == 1 && input.section == section ?

                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 input-height">
                    <h2> {input.sectionName} </h2>
                </div> : ""
            }

            <div className="col-md-3 col-sm-3">
                <span className="appl-lable">{input.displayName}</span>
                <p className="data-field">{input.value}</p>
            </div>

        </div>




    );
}


function renderFileData(input, section) {
    let language = "english"
    return (

        <div>
            {input.displaySequence == 1 && input.section == section ?
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 input-height">
                    <h2> {input.sectionName} </h2>
                </div> : ""
            }
            <div className="col-md-3 col-sm-3">
                <span className="appl-lable">{input.displayName}</span>
                <a href="" id='file-download' title={input.value[0].fileStoreId}><p className="data-field">{input.value[0].fileStoreId}</p></a>
            </div>
        </div>




    );
}

function renderRemarkData(input, section) {
    let data = []
    for (let i = 0; i < input.value.length; i++) {
        data.push(input.value[i])
    }

    let language = "english"
    return (
        < div >
            {
                input.section == section ?
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 input-height">
                        <h2> {input.sectionName} </h2>
                    </div> : ""
            }
            < div className="col-md-12 col-sm-12" >
                <span className="appl-lable">{input.displayName}</span>
                {/* <a href="" id='file-download' title={input.value[0].fileStoreId}><p className="data-field">{input.value[0].fileStoreId}</p></a> */}
                {data.map((anObjectMapped, index) => {
                    return (


                        <div className="col-md-12 col-sm-12">
                            <div className="col-md-6 col-sm-6">

                                <span className="appl-lable">Rolecode</span>
                                <br />
                                <span className="appl-lable">{anObjectMapped.rolecode}</span>
                            </div>
                            <div className="col-md-6 col-sm-6">

                                <span className="appl-lable">Application Status</span>
                                <br />

                                <span className="appl-lable">{anObjectMapped.applicationstatus}</span>
                            </div>



                        </div>



                    );
                })
                }
                <a href="#" id='viewremarks' >
                    <p className="data-field">View Details</p>
                </a>

            </div >
        </div >




    );
}

