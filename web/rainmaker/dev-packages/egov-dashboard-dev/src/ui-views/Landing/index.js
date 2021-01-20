//import './custom.css'
import React, { Component, Fragment } from 'react';
import { Redirect, Link } from 'react-router-dom';
import axios from 'axios';





class Landing extends Component {
    constructor(props) {
        super(props)

    }
    setName = (e, type, Name) => {

        localStorage.setItem('applicationType', type)
        localStorage.setItem('applicationName', Name)
        //alert(localStorage.getItem('applicationType')
       // )

    }

    componentDidMount() {
     
        this.props.getLandindData();
    }

    render() {
        return (
            <div>

               
                <section class="landing-sec mt-30">
                    <div class="container-page">

                        <div class="lan-list">
                            <div class="row">
                         
                                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                    {this.props.Landingdata.map((anObjectMapped, index) => {
                                        return (
                                            <div class="col-lg-3 col-md-3 col-sm-6 col-xs-6">
                                                <a onClick={(e) => {
                                                    this.setName(e, anObjectMapped.code, anObjectMapped.name)
                                                }}>
                                                    <Link to="/Main" lable="NocPet"> <a>
                                                        <div class="lan-menu active">
                                                            <h4>{anObjectMapped.name}</h4>
                                                            <span class="icon"><i class="fa fa-paw" aria-hidden="true"></i>
                                                            </span>
                                                        </div>
                                                    </a></Link>
                                                </a>
                                            </div>
                                        );
                                    })}


                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        );
    }

}
export default Landing;
