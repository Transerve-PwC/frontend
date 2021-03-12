import React from "react";
import Loadable from "react-loadable";
import LinearProgress from "egov-ui-framework/ui-atoms/LinearSpinner";

const Loading = () => <LinearProgress />;

const RadioButtonsGroup = Loadable({
  loader: () => import("./RadioGroup"),
  loading: () => <Loading />
});


const CustomTab = Loadable({
  loader: () => import("./CustomTab"),
  loading: () => <Loading />
});

const SingleApplication = Loadable({
  loader: () => import("./SingleApplication"),
  loading: () => <Loading />
});

const UploadSingleFile = Loadable({
  loader: () => import("./UploadSingleFile"),
  loading: () => <Loading />
});

const DocumentList = Loadable({
  loader: () => import("./DocumentList"),
  loading: () => <Loading />
});

const SummaryDetails = Loadable({
  loader: () => import("./SummaryDetails"),
  loading: () => <Loading />
});

const DividerWithLabel = Loadable({
  loader: () => import("./DividerWithLabel"),
  loading: () => <Loading />
});


const FeesEstimateCard = Loadable({
  loader: () => import("./FeesEstimateCard"),
  loading: () => <Loading />
});

const HowItWorks = Loadable({
  loader: () => import("./HowItWorks"),
  loading: () => <Loading />
});
const MultiItemsWithImage = Loadable({
  loader: () => import("./MultiItemsWithImage"),
  loading: () => <Loading />
});
const TaskDialog = Loadable({
  loader: () => import("./TaskDialog"),
  loading: () => <Loading />
});

const TaskStatusComponents = Loadable({
  loader: () => import("./TaskStatusComponents"),
  loading: () => <Loading />
});
const Footer = Loadable({
  loader: () => import("./Footer"),
  loading: () => <Loading />
});
const BookingCalendar = Loadable({
  loader: () => import("./BookingCalendar"),
  loading: () => <Loading />
});
const RoomDetailsComponents = Loadable({
  loader: () => import("./RoomDetailsComponents"),
  loading: () => <Loading />
});
const BookingMedia = Loadable({
  loader: () => import("./BookingMedia"),
  loading: () => <Loading />
});
const ImageList = Loadable({
  loader: () => import("./ImageList"),
  loading: () => <Loading />
});
const BookingTimeSlot = Loadable({
  loader: () => import("./BookingTimeSlot"),
  loading: () => <Loading />
});

const SelectedTimeSlotInfo = Loadable({
  loader: () => import("./SelectedTimeSlotInfo"),
  loading: () => <Loading />
});

export {
  RadioButtonsGroup,
  CustomTab,
  UploadSingleFile,
  DocumentList,
  SummaryDetails,
  FeesEstimateCard,
  DividerWithLabel,
  HowItWorks,
  MultiItemsWithImage,
  TaskDialog,
  TaskStatusComponents,
  Footer,
  BookingCalendar,
  BookingMedia,
  ImageList,
  BookingTimeSlot,
  SelectedTimeSlotInfo,
  RoomDetailsComponents,
  SingleApplication
};
