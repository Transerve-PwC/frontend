import React, { Fragment } from 'react';
import {
    BrowserRouter as Router,
    Route,
    Link,
    withRouter,
    Switch,

} from 'react-router-dom';

import Main from '../../ui-views/Main'
import Landing from '../../ui-containers-local/Landing'


const Router1 = () => (

    <Fragment>


        <Router>
        <div>
               
                <Route exact  path='/Main' component={Main} ></Route>
                <Route exact path='/' component={Landing}></Route>
                </div>   
        </Router>
    </Fragment>
);

export default Router1;
