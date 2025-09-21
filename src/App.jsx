import "./App.css";

import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./pages/Login";
import WorkSpace from "./pages/WorkSpace";
import Layout from "./pages/Layout";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./services/AuthContext";
import PrivateRoute from "./services/PrivateRoute";
import MinesConsignorOwnerMaster from "./components/setupApplication/MinesConsignorOwnerMaster";
import ExporterConsigneeMaster from "./components/setupApplication/ExporterConsigneeMaster";
import VehiclePassingWeight from "./components/setupApplication/VehiclePassingWeight";
import TraderBillingPartyMaster from "./components/setupApplication/TraderBillingPartyMaster";
import BankAccountMaster from "./components/setupApplication/BankAccountMaster";
import FieldStaffFleetAgent from "./components/setupApplication/FieldStaffFleetAgent";
import TruckOwner from "./components/setupApplication/TruckOwner";
import TruckDetails from "./components/setupApplication/TruckDetails";
import PreInformation from "./components/setupApplication/PreInformation";
import ExcelUploader from "./components/setupApplication/ExcelUploader";
import ChallanHolder from "./components/setupApplication/ChallanHolder";
import TdsDeclarationData from "./components/setupApplication/TdsDeclarationData";
import OnershipTransfer from "./components/setupApplication/OnershipTransfer";
import PermitMasterFormi from "./components/challanInput/PermitMasterFormi";
import ChallanLoadingEntry from "./components/challanInput/ChallanLoadingEntry";
import ChallanUnLoadingEntry from "./components/challanInput/ChallanUnLoadingEntry";
import ExcelFileUploadDespatchDataFull from "./components/challanInput/ExcelFileUploadDespatchDataFull";
import ExcelFileUploadDespatchDataFullSelection from "./components/challanInput/ExcelFileUploadDespatchDataSelection";
import MarkChallanAsUnload from "./components/challanInput/MarkChallanAsUnload";
import UpdateVehicleRate from "./components/challanInput/UpdateVehicleRate";
import FreightVsAdvance from "./components/challanInput/FreightVsAdvance";
import InputAdvanceDataOnPermitWise from "./components/challanInput/InputAdvanceDataOnPermitWise";
import InputAdvanceDataOnSingleChallan from "./components/challanInput/InputAdvanceDataOnSingleChallan";
import UploadAdvanceDataFromExcel from "./components/challanInput/UploadAdvanceDataFromExcel";
import DeleteExcelData from "./components/challanInput/DeleteExcelData";
import CheckCancelledChallan from "./components/challanInput/CheckCancelledChallan";
import RemoveCancelledChallan from "./components/challanInput/RemoveCancelledChallan";
import ChallanStatus from "./components/challanInput/ChallanStatus";
import VehicleRateAnalysis from "./components/challanInput/VehicleRateAnalysis";
import ChallanReceivedEntry from "./components/challanPayment/ChallanReceivedEntry";
import ChallanPaymentSingle from "./components/challanPayment/ChallanPaymentSingle";
import ChallanPaymentBulk from "./components/challanPayment/ChallanPaymentBulk";
import LedgerPartyPayment from "./components/challanPayment/LedgerPartyPayment";
import ReferenceSummary from "./components/challanPayment/ReferenceSummary";
import PaymentReferenceList from "./components/challanPayment/PaymentReferenceList";
import PaymentReferenceDetails from "./components/challanPayment/PaymentReferenceDetails";
import ChallanStatusReceived from "./components/challanPayment/ChallanStatusReceived";
import PendingForProcess from "./components/challanPayment/PendingForProcess";
import LedgerCustomerChallan from "./components/challanPayment/LedgerCustomerChallan";
import ChallanHolderPayment from "./components/challanPayment/ChallanHolderPayment";
import PaymentSummary from "./components/challanPayment/PaymentSummary";
import PaymentDetailsChallanWise from "./components/challanPayment/PaymentDetailsChallanWise";
import NrTruckPosting from "./components/administration/NrTruckPosting";
import DespatchSummary from "./components/administration/DespatchSummary";
import ManageChallanHolderBankAccount from "./components/administration/ManageChallanHolderBankAccount";
import ManageLedgerCustomer from "./components/administration/ManageLedgerCustomer";
import ApplicationUser from "./components/administration/ApplicationUser";
import CompanyAndBankDetails from "./components/administration/CompanyAndBankDetails";
import RemoveFromBulkPayment from "./components/administration/RemoveFromBulkPayment";
import VerifyRemovedReference from "./components/administration/VerifyRemovedReference";
import FreightRateVerification from "./components/administration/FreightRateVerification";
import EntryJobPerformance from "./components/administration/EntryJobPerformance";
import StopPaymentProcess from "./components/administration/StopPaymentProcess";
import UpdateTpFormi from "./components/administration/UpdateTpFormi";
import DayWiseLoadingSummary from "./components/userSpecific/DayWiseLoadingSummary";
import DayWiseUnLoadingSummary from "./components/userSpecific/DayWiseUnLoadingSummary";
import DeliveryDays from "./components/userSpecific/DeliveryDays";
import ConsolidatedOnAll from "./components/userSpecific/ConsolidatedOnAll";
import PermitWiseLoadingWork from "./components/userSpecific/PermitWiseLoadingWork";
import PermitWiseUnLoadingWork from "./components/userSpecific/PermitWiseUnLoadingWork";
import Home from "./pages/Home";
import ExcelBulkUploadData from "./components/setupApplication/ExcelBulkUploadData";
import DieselIssued from "./components/hsdRegister/DieselIssued";
import HsdChallanReconsile from "./components/hsdRegister/HsdChallanReconsile";
import HsdBillReceivedFormat1 from "./components/hsdRegister/HsdBillReceivedFormat1";
import HsdBillReceivedFormat2 from "./components/hsdRegister/HsdBillReceivedFormat2";
import HsdBillReceivedFormat3 from "./components/hsdRegister/HsdBillReceivedFormat3";
import FillingStationPayment from "./components/hsdRegister/FillingStationPayment";
import FillingStationAdjustmentEntry from "./components/hsdRegister/FillingStationAdjustmentEntry";
import FillingStationLedger from "./components/hsdRegister/FillingStationLedger";
import MultiplePumpSetting from "./components/hsdRegister/MultiplePumpSetting";

// -----------------------------Quary-----------------------------------------------
import PermitMasterList from "./components/query/PermitMasterList";
import DailyLoadingSummary from "./components/query/DailyLoadingSummary";
import LoadingReportChallanWise from "./components/query/LoadingReportChallanWise";
import UnloadingReport from "./components/query/UnloadingReport";
import LoadingReportPermitDate from "./components/query/LoadingReportPermitDate";
import UnDelivedReport from "./components/query/UnloadingReport";
import NRChallanReport from "./components/query/NRChallanReport";
import CancelledChallanReport from "./components/query/CancelledChallanReport";
import CheckChallanAmount from "./components/query/CheckChallanAmount";
import FreightBalanceDue from "./components/query/FreightBalanceDue";
import TruckList from "./components/query/TruckList";
import TruckOwnerList from "./components/query/TruckOwnerList";
import ChallanHolderList from "./components/query/ChallanHolderList";
import TDSDeclarationStatus from "./components/query/TDSDeclarationStatus";
import TruckLoadindHistory from "./components/query/TruckLoadingHistory";
import OwnAndDiscountChallan from "./components/query/OwnChallan";
import PaymentLedgerQ from "./components/query/PaymentLedger";
import KnownTruckStatusQ from "./components/query/KnownTruckStatus";
import UnknownTruckStatus from "./components/query/UnknownTruckStatus";

// ------------------Report-----------------------------
import DailyReport from "./components/report/DailyReport";
import PayableSummary from "./components/report/PayableSummary";
import AdvancePaid from "./components/report/AdvancePaid";
import RecivedVsPaidVSDue from "./components/report/ReceivedVspaidVsDue";
import TdsCollatedStatement from "./components/report/TdsCollectedStatement";
import FreightPaidInDetails from "./components/report/FreightPaidInDetails";
import TruckWiseFreightPaid from "./components/report/TruckWiseFreightPaid";
import TollGateStatement from "./components/report/TollGateStatement";
import LoadingMaterial from "./components/report/LoadingMaterial";
import UnLoadingMaterial from "./components/report/UnLoadingMaterial";
import FreightPaid from "./components/report/FreightPaid";
import PermitNumberQuantity from "./components/report/PermitNumberQuantity";
import PermitNumberPayment from "./components/report/PermitNumberPayment";
import TypeOfVehicleUsed from "./components/report/TypeOfVehicleUsed";
import TruckWiseFreight from "./components/report/TruckWiseFreight";
import OwnerWiseFreight from "./components/report/OwnerWiseFreight";
import JobPerfomance from "./components/report/JobPerfomance";
import AllPermitSummary from "./components/report/AllPermitSummary";
import SinglePermitStatus from "./components/report/SinglePermitStatus";
import PermitWiseFreightPayable from "./components/report/PermitWiseFreightPayable";
import MonthWisePerfomance from "./components/report/MonthWisePerfomance";
import MonthlyDdmReturn from "./components/report/MonthlyDdmReturn";
import UploadBankAccount from "./components/setupApplication/UploadBankAccount";
import VehicleNumberUpload from "./components/setupApplication/VehicleNumberUpload";
import PermitMasterReadOnlyDynamicPage from "./components/challanInput/PermitMasterReadOnlyDynamicPage";
import First from "./components/billing/setupApplicationBilling/First";
import BillingLayout from "./pages/BillingLayout";
import BankAdvanceEntry from "./components/challanInput/bankAdvanceProcess/BankAdvanceEntry";
import BankAdvancePaidReport from "./components/challanInput/bankAdvanceProcess/BankAdvancePaidReport";
import BankAdvancePayment from "./components/challanInput/bankAdvanceProcess/BankAdvancePayment";
import BankAdvancePending from "./components/challanInput/bankAdvanceProcess/BankAdvancePending";
// -----------------------------------------

// Route config array for protected routes
const protectedRoutes = [
  { path: "/work-space", element: WorkSpace, layout: Layout },
  {
    path: "/permit-master-view-details/:encodedId",
    element: PermitMasterReadOnlyDynamicPage,
  },
  { path: "/passing-weight", element: VehiclePassingWeight, layout: Layout },
  {
    path: "/mines-consignor-master",
    element: MinesConsignorOwnerMaster,
    layout: Layout,
  },
  {
    path: "/export-consignee-master",
    element: ExporterConsigneeMaster,
    layout: Layout,
  },
  {
    path: "/trader-billing-party-master",
    element: TraderBillingPartyMaster,
    layout: Layout,
  },
  {
    path: "/field-staff-fleet-agent",
    element: FieldStaffFleetAgent,
    layout: Layout,
  },
  { path: "/truck-owner", element: TruckOwner, layout: Layout },
  { path: "/truck-number", element: TruckDetails, layout: Layout },
  { path: "/challan-holder", element: ChallanHolder, layout: Layout },
  {
    path: "/tds-declaration-data",
    element: TdsDeclarationData,
    layout: Layout,
  },
  { path: "/account-master", element: BankAccountMaster, layout: Layout },
  { path: "/pre-information", element: PreInformation, layout: Layout },
  { path: "/ownership-transfer", element: OnershipTransfer, layout: Layout },
  { path: "/upload-bank-account", element: UploadBankAccount, layout: Layout },
  {
    path: "/vehicle-number-upload",
    element: VehicleNumberUpload,
    layout: Layout,
  },
  {
    path: "/excel-bulk-upload-data",
    element: ExcelBulkUploadData,
    layout: Layout,
  },
  { path: "/permit-master-form-I", element: PermitMasterFormi, layout: Layout },
  {
    path: "/challan-loading-entry-manual",
    element: ChallanLoadingEntry,
    layout: Layout,
  },
  {
    path: "/unloading-challan-entry-manual",
    element: ChallanUnLoadingEntry,
    layout: Layout,
  },
  {
    path: "/excel-file-upload-full",
    element: ExcelFileUploadDespatchDataFull,
    layout: Layout,
  },
  {
    path: "/excel-file-upload-selection",
    element: ExcelFileUploadDespatchDataFullSelection,
    layout: Layout,
  },
  {
    path: "/mark-challan-as-unloaded",
    element: MarkChallanAsUnload,
    layout: Layout,
  },
  { path: "/update-vehicle-rate", element: UpdateVehicleRate, layout: Layout },
  { path: "/freight-vs-advance", element: FreightVsAdvance, layout: Layout },
  {
    path: "/input-advance-data-on-permitwise",
    element: InputAdvanceDataOnPermitWise,
    layout: Layout,
  },
  {
    path: "/input-advance-data-on-single-challan",
    element: InputAdvanceDataOnSingleChallan,
    layout: Layout,
  },
  {
    path: "/upload-advance-data-from-excel",
    element: UploadAdvanceDataFromExcel,
    layout: Layout,
  },
  { path: "/bank-advance-entry", element: BankAdvanceEntry, layout: Layout },
  {
    path: "/bank-advance-paid-report",
    element: BankAdvancePaidReport,
    layout: Layout,
  },
  {
    path: "/bank-advance-payment",
    element: BankAdvancePayment,
    layout: Layout,
  },
  {
    path: "/bank-advance-pending",
    element: BankAdvancePending,
    layout: Layout,
  },
  { path: "/delete-excel-data", element: DeleteExcelData, layout: Layout },
  {
    path: "/check-cancelled-challan",
    element: CheckCancelledChallan,
    layout: Layout,
  },
  {
    path: "/remove-cancelled-challan",
    element: RemoveCancelledChallan,
    layout: Layout,
  },
  { path: "/challan-status", element: ChallanStatus, layout: Layout },
  {
    path: "/vehicle-rate-analysis",
    element: VehicleRateAnalysis,
    layout: Layout,
  },
  {
    path: "/challan-received-entry",
    element: ChallanReceivedEntry,
    layout: Layout,
  },
  {
    path: "/challan-payment-single",
    element: ChallanPaymentSingle,
    layout: Layout,
  },
  {
    path: "/challan-payment-bulk",
    element: ChallanPaymentBulk,
    layout: Layout,
  },
  {
    path: "/ledger-party-payment",
    element: LedgerPartyPayment,
    layout: Layout,
  },
  { path: "/reference-summary", element: ReferenceSummary, layout: Layout },
  {
    path: "/payment-reference-list",
    element: PaymentReferenceList,
    layout: Layout,
  },
  {
    path: "/payment-reference-details",
    element: PaymentReferenceDetails,
    layout: Layout,
  },
  {
    path: "/challan-status-received",
    element: ChallanStatusReceived,
    layout: Layout,
  },
  { path: "/pending-for-process", element: PendingForProcess, layout: Layout },
  {
    path: "/ledger-customer-challan",
    element: LedgerCustomerChallan,
    layout: Layout,
  },
  {
    path: "/challan-holder-payment",
    element: ChallanHolderPayment,
    layout: Layout,
  },
  { path: "/payment-summary", element: PaymentSummary, layout: Layout },
  {
    path: "/payment-details-challan-wise",
    element: PaymentDetailsChallanWise,
    layout: Layout,
  },
  { path: "/diesel-issued", element: DieselIssued, layout: Layout },
  {
    path: "/hsd-challan-reconsile",
    element: HsdChallanReconsile,
    layout: Layout,
  },
  {
    path: "/hsd-bill-received-format-1",
    element: HsdBillReceivedFormat1,
    layout: Layout,
  },
  {
    path: "/hsd-bill-received-format-2",
    element: HsdBillReceivedFormat2,
    layout: Layout,
  },
  {
    path: "/hsd-bill-received-format-3",
    element: HsdBillReceivedFormat3,
    layout: Layout,
  },
  {
    path: "/filling-station-payment",
    element: FillingStationPayment,
    layout: Layout,
  },
  {
    path: "/filling-station-adjustment-entry",
    element: FillingStationAdjustmentEntry,
    layout: Layout,
  },
  {
    path: "/filling-station-ledger",
    element: FillingStationLedger,
    layout: Layout,
  },
  {
    path: "/multiple-pump-setting",
    element: MultiplePumpSetting,
    layout: Layout,
  },
  { path: "/billing-work-space", element: WorkSpace, layout: BillingLayout },
  { path: "/billing-start", element: First, layout: BillingLayout },
];

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          {/* Protected routes mapped from config */}
          {protectedRoutes.map(({ path, element, layout }, idx) => (
            <Route
              key={path}
              path={path}
              element={<PrivateRoute element={element} layout={layout} />}
            />
          ))}
          {/* Add catch-all 404 route */}
          <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
