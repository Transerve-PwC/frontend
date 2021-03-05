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
const MapLocatorEdit = Loadable({
  loader: () => import("./MapLocatorEdit"),
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

const ImageUploadMolecule = Loadable({
  loader: () => import("./ImageUploadMolecule"),
  loading: () => <Loading />
});

const ReportMolecule = Loadable({
  loader: () => import("./ReportMolecule"),
  loading: () => <Loading />
});

const ReportMoleculeBarPie = Loadable({
  loader: () => import("./ReportMoleculeBarPie"),
  loading: () => <Loading />
});

const HorizontalBarMolecule = Loadable({
  loader: () => import("./HorizontalBarMolecule"),
  loading: () => <Loading />
});


const DashboardPIEGraph = Loadable({
  loader: () => import("./DashboardPIEGraph"),
  loading: () => <Loading />
});

const DescriptionDashboard = Loadable({
  loader: () => import("./DescriptionDashboard"),
  loading: () => <Loading />
});

const HCDashboard = Loadable({
  loader: () => import("./HCDashboard"),
  loading: () => <Loading />
});

const ReportPreview = Loadable({
  loader: () => import("./ReportPreview"),
  loading: () => <Loading />
});

const DashboardEchallan = Loadable({
  loader: () => import("./DashboardEchallan"),
  loading: () => <Loading />
});

const DashboardSportCulture = Loadable({
  loader: () => import("./DashboardSportCulture"),
  loading: () => <Loading />
});

const DashboardPublicRelation = Loadable({
  loader: () => import("./DashboardPublicRelation"),
  loading: () => <Loading />
});

const DashboardTradeLicense = Loadable({
  loader: () => import("./DashboardTradeLicense"),
  loading: () => <Loading />
});

const DashboardEaawas = Loadable({
  loader: () => import("./DashboardEaawas"),
  loading: () => <Loading />
});

const DashboardOPMS = Loadable({
  loader: () => import("./DashboardOPMS"),
  loading: () => <Loading />
});

const DashboardOSBM = Loadable({
  loader: () => import("./DashboardOSBM"),
  loading: () => <Loading />
});

const DashboardStoreIndent = Loadable({
  loader: () => import("./DashboardStoreIndent"),
  loading: () => <Loading />
});

const DashboardStoreManagement = Loadable({
  loader: () => import("./DashboardStoreManagement"),
  loading: () => <Loading />
});

const DashboardWNS = Loadable({
  loader: () => import("./DashboardWNS"),
  loading: () => <Loading />
});

const DashboardWork = Loadable({
  loader: () => import("./DashboardWork"),
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
  ImageUploadMolecule,
  MapLocatorEdit,
  ReportMolecule,
  ReportMoleculeBarPie,
  HorizontalBarMolecule,
  DashboardPIEGraph,
  DescriptionDashboard,
  HCDashboard,
  ReportPreview,
  DashboardEchallan,
  DashboardSportCulture,
  DashboardPublicRelation,
  DashboardTradeLicense,
  DashboardEaawas,
  DashboardOPMS,
  DashboardOSBM,
  DashboardStoreIndent,
  DashboardStoreManagement,
  DashboardWNS,
  DashboardWork
};
