import React from "react";
import Loadable from "react-loadable";
import LinearProgress from "egov-ui-framework/ui-atoms/LinearSpinner";

const Loading = () => <LinearProgress />;
const TestMolecules = Loadable({
  loader: () => import("./TestMolecules"),
  loading: () => <Loading />
});
const RadioButtonsGroup = Loadable({
  loader: () => import("./RadioGroup"),
  loading: () => <Loading />
});

const Tooltip = Loadable({
  loader: () => import("./Tooltip"),
  loading: () => <Loading />
});

const CustomTab = Loadable({
  loader: () => import("./CustomTab"),
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

const DividerWithLabel = Loadable({
  loader: () => import("./DividerWithLabel"),
  loading: () => <Loading />
});

const MapLocator = Loadable({
  loader: () => import("./MapLocator"),
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

const ImageUploadViolatorImageMolecule = Loadable({
  loader: () => import("./ImageUploadViolatorImage"),
  loading: () => <Loading />
});

const ImageUploadViolatorIdProofMolecule = Loadable({
  loader: () => import("./ImageUploadViolatorIdProof"),
  loading: () => <Loading />
});

const ImageUploadViolationMolecule = Loadable({
  loader: () => import("./ImageUploadViolation"),
  loading: () => <Loading />
});

const CustomizeTable = Loadable({
  loader: () => import("./CustomizeTable"),
  loading: () => <Loading />
});

const Table = Loadable({
  loader: () => import("./Table"),
  loading: () => <Loading />
});

const UploadExcelFile = Loadable({
  loader: () => import("./UploadExcelFile"),
  loading: () => <Loading />
});

const SampleDownload = Loadable({
  loader: () => import("./SampleDownload"),
  loading: () => <Loading />
});

const CustomizedLandingPage = Loadable({
  loader: () => import("./CustomizedLandingPage"),
  loading: () => <Loading />
});

export {
  TestMolecules,
  RadioButtonsGroup,
  Tooltip,
  CustomTab,
  UploadSingleFile,
  DocumentList,
  MapLocator,
  FeesEstimateCard,
  DividerWithLabel,
  HowItWorks,
  ImageUploadViolatorImageMolecule,
  ImageUploadViolatorIdProofMolecule,
  ImageUploadViolationMolecule,
  UploadExcelFile,
  CustomizeTable,
  CustomizedLandingPage,
  SampleDownload,
  Table
};
