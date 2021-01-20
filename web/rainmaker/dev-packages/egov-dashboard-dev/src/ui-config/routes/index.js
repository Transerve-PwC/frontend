import React from "react";
import Loadable from 'react-loadable';
import LoadingIndicator from 'egov-ui-framework/ui-molecules/LoadingIndicator';
import * as mainRouteConstants from "./route-names";
import Main from '../../ui-views/Main'
const Loading = () => <LoadingIndicator/>;

const Landing = Loadable({
  loader: () => import('ui-views/Landing'),
  loading: Loading,
});


const mainRoutes = [
  {
    path: mainRouteConstants.LANDING,
    component: Landing
  },
  {
    path: mainRouteConstants.Main,
    component: Main
  },
];

export default mainRoutes;
