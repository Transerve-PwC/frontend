import React from "react";
import Loadable from "react-loadable";
import LinearProgress from "egov-ui-framework/ui-atoms/LinearSpinner";

const Loading = () => <LinearProgress />;


const ApplicationNoContainer = Loadable({
  loader: () => import("./applicationNumber"),
  loading: () => <Loading />
});

const Checkbox = Loadable({
  loader: () => import("./Checkbox"),
  loading: () => <Loading />
});

const MapLocation = Loadable({
  loader: () => import("./MapLocation"),
  loading: () => <Loading />
});

const AutoSuggest = Loadable({
  loader: () => import("./AutoSuggest"),
  loading: () => <Loading />
});

const Asteric = Loadable({
  loader: () => import("./Asteric"),
  loading: () => <Loading />
});

const MenuButton = Loadable({
  loader: () => import("./MenuButton"),
  loading: () => <Loading />
});



const MyApplicationIcon = Loadable({
  loader: () => import("./Icons/MyApplicationIcon"),
  loading: () => <Loading />
});
const WithdrawRequestContainer = Loadable({
  loader: () => import("./withdrawRequest"),
  loading: () => <Loading />
});

export {
  ApplicationNoContainer,
  Checkbox,
  MapLocation,
  AutoSuggest,
  Asteric,
  MenuButton,  
  MyApplicationIcon,
  WithdrawRequestContainer
};
