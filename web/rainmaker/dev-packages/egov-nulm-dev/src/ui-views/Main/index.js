import React, { Component, Fragment } from 'react';
// import './custom.css'
import { Redirect, Link } from 'react-router-dom';

class NocBtn extends Component {
    constructor(props) {
        super(props)
        this.state = {
            color: [],
            col: [],
            data1: [],
            fileId: '',
            setOpen: 'false'
        }
    }



    render() {
        return (
            <div>
                <section class="landing-sec mt-30">
                    <div class="container-page">
                        <div class="lan-list">
                            <div class="row">
                                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">

                                    <Link to="/citizen/Apply" lable="NocPet">

                                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                            <div class="lan-menu active">
                                                <span class="icon"><i class="fa fa-plus-square-o" aria-hidden="true"></i>
                                                </span>
                                                <h4>Apply for  NOC</h4>

                                            </div>
                                        </div>
                                    </Link>
                                    <Link to="/citizen/my-applications" lable="NocPet">

                                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                            <div class="lan-menu active">
                                                <span class="icon"><i class="fa fa-files-o" aria-hidden="true"></i>

                                                </span>
                                                <h4>My Applications</h4>

                                            </div>
                                        </div>
                                    </Link>
                                </div>

                            </div>
                        </div>
                    </div>
                </section>
            </div>
        );
    }

}
export default NocBtn;

