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

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />

          {/* Protect the dashboard route */}
          <Route
            path="/work-space"
            element={
              <PrivateRoute
                element={WorkSpace}
                layout={Layout} // Pass the layout component
              />
            }
          />

          <Route
            path="/permit-master-view-details/:encodedId" // Dynamic route
            element={<PrivateRoute element={PermitMasterReadOnlyDynamicPage} />}
          />

          <Route
            path="/passing-weight"
            element={
              <PrivateRoute
                element={VehiclePassingWeight}
                layout={Layout} // Pass the layout component
              />
            }
          />

          <Route
            exact="true"
            path="/mines-consignor-master"
            element={
              <PrivateRoute
                element={MinesConsignorOwnerMaster}
                layout={Layout} // Pass the layout component
              />
            }
          />

          <Route
            exact="true"
            path="/export-consignee-master"
            element={
              <PrivateRoute
                element={ExporterConsigneeMaster}
                layout={Layout} // Pass the layout component
              />
            }
          />

          <Route
            exact="true"
            path="/trader-billing-party-master"
            element={
              <PrivateRoute
                element={TraderBillingPartyMaster}
                layout={Layout} // Pass the layout component
              />
            }
          />

          <Route
            exact="true"
            path="/field-staff-fleet-agent"
            element={
              <PrivateRoute
                element={FieldStaffFleetAgent}
                layout={Layout} // Pass the layout component
              />
            }
          />

          <Route
            exact="true"
            path="/truck-owner"
            element={
              <PrivateRoute
                element={TruckOwner}
                layout={Layout} // Pass the layout component
              />
            }
          />

          <Route
            exact="true"
            path="/truck-number"
            element={
              <PrivateRoute
                element={TruckDetails}
                layout={Layout} // Pass the layout component
              />
            }
          />

          <Route
            exact="true"
            path="/challan-holder"
            element={
              <PrivateRoute
                element={ChallanHolder}
                layout={Layout} // Pass the layout component
              />
            }
          />

          <Route
            exact="true"
            path="/tds-declaration-data"
            element={
              <PrivateRoute
                element={TdsDeclarationData}
                layout={Layout} // Pass the layout component
              />
            }
          />

          <Route
            exact="true"
            path="/account-master"
            element={
              <PrivateRoute
                element={BankAccountMaster}
                layout={Layout} // Pass the layout component
              />
            }
          />

          <Route
            exact="true"
            path="/pre-information"
            element={
              <PrivateRoute
                element={PreInformation}
                layout={Layout} // Pass the layout component
              />
            }
          />

          <Route
            exact="true"
            path="/ownership-transfer"
            element={
              <PrivateRoute
                element={OnershipTransfer}
                layout={Layout} // Pass the layout component
              />
            }
          />

          <Route
            exact="true"
            path="/upload-bank-account"
            element={
              <PrivateRoute
                element={UploadBankAccount}
                layout={Layout} // Pass the layout component
              />
            }
          />

          <Route
            exact="true"
            path="/vehicle-number-upload"
            element={
              <PrivateRoute
                element={VehicleNumberUpload}
                layout={Layout} // Pass the layout component
              />
            }
          />

          <Route
            exact="true"
            path="/excel-bulk-upload-data"
            element={
              <PrivateRoute
                element={ExcelBulkUploadData}
                layout={Layout} // Pass the layout component
              />
            }
          />

          {/* challan input tab routes */}
          <Route
            exact="true"
            path="/permit-master-form-I"
            element={
              <PrivateRoute
                element={PermitMasterFormi}
                layout={Layout} // Pass the layout component
              />
            }
          />

          <Route
            exact="true"
            path="/challan-loading-entry-manual"
            element={
              <PrivateRoute
                element={ChallanLoadingEntry}
                layout={Layout} // Pass the layout component
              />
            }
          />

          <Route
            exact="true"
            path="/unloading-challan-entry-manual"
            element={
              <PrivateRoute
                element={ChallanUnLoadingEntry}
                layout={Layout} // Pass the layout component
              />
            }
          />

          <Route
            exact="true"
            path="/excel-file-upload-full"
            element={
              <PrivateRoute
                element={ExcelFileUploadDespatchDataFull}
                layout={Layout} // Pass the layout component
              />
            }
          />

          <Route
            exact="true"
            path="/excel-file-upload-selection"
            element={
              <PrivateRoute
                element={ExcelFileUploadDespatchDataFullSelection}
                layout={Layout} // Pass the layout component
              />
            }
          />

          <Route
            exact="true"
            path="/mark-challan-as-unloaded"
            element={
              <PrivateRoute
                element={MarkChallanAsUnload}
                layout={Layout} // Pass the layout component
              />
            }
          />

          <Route
            exact="true"
            path="/update-vehicle-rate"
            element={
              <PrivateRoute
                element={UpdateVehicleRate}
                layout={Layout} // Pass the layout component
              />
            }
          />

          <Route
            exact="true"
            path="/freight-vs-advance"
            element={
              <PrivateRoute
                element={FreightVsAdvance}
                layout={Layout} // Pass the layout component
              />
            }
          />

          <Route
            exact="true"
            path="/input-advance-data-on-permitwise"
            element={
              <PrivateRoute
                element={InputAdvanceDataOnPermitWise}
                layout={Layout} // Pass the layout component
              />
            }
          />
          <Route
            exact="true"
            path="/input-advance-data-on-single-challan"
            element={
              <PrivateRoute
                element={InputAdvanceDataOnSingleChallan}
                layout={Layout} // Pass the layout component
              />
            }
          />

          <Route
            exact="true"
            path="/upload-advance-data-from-excel"
            element={
              <PrivateRoute
                element={UploadAdvanceDataFromExcel}
                layout={Layout} // Pass the layout component
              />
            }
          />

          {/* Bank advance section start */}

          <Route
            exact="true"
            path="/bank-advance-entry"
            element={
              <PrivateRoute
                element={BankAdvanceEntry}
                layout={Layout} // Pass the layout component
              />
            }
          />

          <Route
            exact="true"
            path="/bank-advance-paid-report"
            element={
              <PrivateRoute
                element={BankAdvancePaidReport}
                layout={Layout} // Pass the layout component
              />
            }
          />

          <Route
            exact="true"
            path="/bank-advance-payment"
            element={
              <PrivateRoute
                element={BankAdvancePayment}
                layout={Layout} // Pass the layout component
              />
            }
          />

          <Route
            exact="true"
            path="/bank-advance-pending"
            element={
              <PrivateRoute
                element={BankAdvancePending}
                layout={Layout} // Pass the layout component
              />
            }
          />

          {/* Bank advance section end */}

          <Route
            exact="true"
            path="/delete-excel-data"
            element={
              <PrivateRoute
                element={DeleteExcelData}
                layout={Layout} // Pass the layout component
              />
            }
          />

          <Route
            exact="true"
            path="/check-cancelled-challan"
            element={
              <PrivateRoute
                element={CheckCancelledChallan}
                layout={Layout} // Pass the layout component
              />
            }
          />

          <Route
            exact="true"
            path="/remove-cancelled-challan"
            element={
              <PrivateRoute
                element={RemoveCancelledChallan}
                layout={Layout} // Pass the layout component
              />
            }
          />

          <Route
            exact="true"
            path="/challan-status"
            element={
              <PrivateRoute
                element={ChallanStatus}
                layout={Layout} // Pass the layout component
              />
            }
          />

          <Route
            exact="true"
            path="/vehicle-rate-analysis"
            element={
              <PrivateRoute
                element={VehicleRateAnalysis}
                layout={Layout} // Pass the layout component
              />
            }
          />

          <Route
            exact="true"
            path="/challan-received-entry"
            element={
              <PrivateRoute
                element={ChallanReceivedEntry}
                layout={Layout} // Pass the layout component
              />
            }
          />

          <Route
            exact="true"
            path="/challan-payment-single"
            element={
              <PrivateRoute
                element={ChallanPaymentSingle}
                layout={Layout} // Pass the layout component
              />
            }
          />
          <Route
            exact="true"
            path="/challan-payment-bulk"
            element={
              <PrivateRoute
                element={ChallanPaymentBulk}
                layout={Layout} // Pass the layout component
              />
            }
          />

          <Route
            exact="true"
            path="/ledger-party-payment"
            element={
              <PrivateRoute
                element={LedgerPartyPayment}
                layout={Layout} // Pass the layout component
              />
            }
          />

          <Route
            exact="true"
            path="/reference-summary"
            element={
              <PrivateRoute
                element={ReferenceSummary}
                layout={Layout} // Pass the layout component
              />
            }
          />

          <Route
            exact="true"
            path="/payment-reference-list"
            element={
              <PrivateRoute
                element={PaymentReferenceList}
                layout={Layout} // Pass the layout component
              />
            }
          />
          <Route
            exact="true"
            path="/payment-reference-details"
            element={
              <PrivateRoute
                element={PaymentReferenceDetails}
                layout={Layout} // Pass the layout component
              />
            }
          />

          <Route
            exact="true"
            path="/challan-status-received"
            element={
              <PrivateRoute
                element={ChallanStatusReceived}
                layout={Layout} // Pass the layout component
              />
            }
          />

          <Route
            exact="true"
            path="/pending-for-process"
            element={
              <PrivateRoute
                element={PendingForProcess}
                layout={Layout} // Pass the layout component
              />
            }
          />

          <Route
            exact="true"
            path="/ledger-customer-challan"
            element={
              <PrivateRoute
                element={LedgerCustomerChallan}
                layout={Layout} // Pass the layout component
              />
            }
          />

          <Route
            exact="true"
            path="/challan-holder-payment"
            element={
              <PrivateRoute
                element={ChallanHolderPayment}
                layout={Layout} // Pass the layout component
              />
            }
          />

          <Route
            exact="true"
            path="/payment-summary"
            element={
              <PrivateRoute
                element={PaymentSummary}
                layout={Layout} // Pass the layout component
              />
            }
          />

          <Route
            exact="true"
            path="/payment-details-challan-wise"
            element={
              <PrivateRoute
                element={PaymentDetailsChallanWise}
                layout={Layout} // Pass the layout component
              />
            }
          />

          {/* HSD Register section */}

          <Route
            exact="true"
            path="/diesel-issued"
            element={
              <PrivateRoute
                element={DieselIssued}
                layout={Layout} // Pass the layout component
              />
            }
          />

          <Route
            exact="true"
            path="/hsd-challan-reconsile"
            element={
              <PrivateRoute
                element={HsdChallanReconsile}
                layout={Layout} // Pass the layout component
              />
            }
          />

          <Route
            exact="true"
            path="/hsd-bill-received-format-1"
            element={
              <PrivateRoute
                element={HsdBillReceivedFormat1}
                layout={Layout} // Pass the layout component
              />
            }
          />

          <Route
            exact="true"
            path="/hsd-bill-received-format-2"
            element={
              <PrivateRoute
                element={HsdBillReceivedFormat2}
                layout={Layout} // Pass the layout component
              />
            }
          />

          <Route
            exact="true"
            path="/hsd-bill-received-format-3"
            element={
              <PrivateRoute
                element={HsdBillReceivedFormat3}
                layout={Layout} // Pass the layout component
              />
            }
          />

          <Route
            exact="true"
            path="/filling-station-payment"
            element={
              <PrivateRoute
                element={FillingStationPayment}
                layout={Layout} // Pass the layout component
              />
            }
          />

          <Route
            exact="true"
            path="/filling-station-adjustment-entry"
            element={
              <PrivateRoute
                element={FillingStationAdjustmentEntry}
                layout={Layout} // Pass the layout component
              />
            }
          />

          <Route
            exact="true"
            path="/filling-station-ledger"
            element={
              <PrivateRoute
                element={FillingStationLedger}
                layout={Layout} // Pass the layout component
              />
            }
          />

          <Route
            exact="true"
            path="/multiple-pump-setting"
            element={
              <PrivateRoute
                element={MultiplePumpSetting}
                layout={Layout} // Pass the layout component
              />
            }
          />

          {/* HSD Register section End */}

          {/* Queary Section   start*/}
          <Route
            exact
            path="/permit-master-list"
            element={
              <Layout>
                <PermitMasterList />
              </Layout>
            }
          />
          <Route
            exact
            path="/daily-loading-summary"
            element={
              <Layout>
                <DailyLoadingSummary />
              </Layout>
            }
          />
          <Route
            exact
            path="/loading-report-challan-wise"
            element={
              <Layout>
                <LoadingReportChallanWise />
              </Layout>
            }
          />
          <Route
            exact
            path="/unloading-report"
            element={
              <Layout>
                <UnloadingReport />
              </Layout>
            }
          />
          <Route
            exact
            path="/loading-report-permit-vs-date"
            element={
              <Layout>
                <LoadingReportPermitDate />
              </Layout>
            }
          />
          <Route
            exact
            path="/undelivered-report"
            element={
              <Layout>
                <UnDelivedReport />
              </Layout>
            }
          />
          <Route
            exact
            path="/nr-challan-report"
            element={
              <Layout>
                <NRChallanReport />
              </Layout>
            }
          />
          <Route
            exact
            path="/cancelled-challan-report"
            element={
              <Layout>
                <CancelledChallanReport />
              </Layout>
            }
          />
          <Route
            exact
            path="/check-challan-amount"
            element={
              <Layout>
                <CheckChallanAmount />
              </Layout>
            }
          />
          <Route
            exact
            path="/freight-balance-due"
            element={
              <Layout>
                <FreightBalanceDue />
              </Layout>
            }
          />
          <Route
            exact
            path="/truck-list"
            element={
              <Layout>
                <TruckList />
              </Layout>
            }
          />
          <Route
            exact
            path="/truck-owner-list"
            element={
              <Layout>
                <TruckOwnerList />
              </Layout>
            }
          />
          <Route
            exact
            path="/challan-holder-list"
            element={
              <Layout>
                <ChallanHolderList />
              </Layout>
            }
          />
          <Route
            exact
            path="/tds-declaration-status"
            element={
              <Layout>
                <TDSDeclarationStatus />
              </Layout>
            }
          />

          <Route
            exact
            path="/truck-loading-history"
            element={
              <Layout>
                <TruckLoadindHistory />
              </Layout>
            }
          />
          <Route
            exact
            path="/own-and-discounted-challan"
            element={
              <Layout>
                <OwnAndDiscountChallan />
              </Layout>
            }
          />
          <Route
            exact
            path="/payment-ledger"
            element={
              <Layout>
                <PaymentLedgerQ />
              </Layout>
            }
          />
          <Route
            exact
            path="/known-truck-status"
            element={
              <Layout>
                <KnownTruckStatusQ />
              </Layout>
            }
          />
          <Route
            exact
            path="/un-known-truck-status"
            element={
              <Layout>
                <UnknownTruckStatus />
              </Layout>
            }
          />
          {/* queary section end  */}

          {/* report section start */}

          {/* --------------------------------------Report Start------------------------------ */}
          <Route
            exact
            path="/daily-report"
            element={
              <Layout>
                <DailyReport />
              </Layout>
            }
          />
          <Route
            exact
            path="/payable-summary"
            element={
              <Layout>
                <PayableSummary />
              </Layout>
            }
          />
          <Route
            exact
            path="/advance-paid"
            element={
              <Layout>
                <AdvancePaid />
              </Layout>
            }
          />
          <Route
            exact
            path="/received-vs-paid-vs-due"
            element={
              <Layout>
                <RecivedVsPaidVSDue />
              </Layout>
            }
          />
          <Route
            exact
            path="/toll-gate-statement"
            element={
              <Layout>
                <TollGateStatement />
              </Layout>
            }
          />
          <Route
            exact
            path="/tds-collated-statement"
            element={
              <Layout>
                <TdsCollatedStatement />
              </Layout>
            }
          />
          <Route
            exact
            path="/freight-paid-in-details"
            element={
              <Layout>
                <FreightPaidInDetails />
              </Layout>
            }
          />
          <Route
            exact
            path="/truck-wise-freight-paid"
            element={
              <Layout>
                <TruckWiseFreightPaid />
              </Layout>
            }
          />
          <Route
            exact
            path="/loading-material"
            element={
              <Layout>
                <LoadingMaterial />
              </Layout>
            }
          />
          <Route
            exact
            path="/un-loading-material"
            element={
              <Layout>
                <UnLoadingMaterial />
              </Layout>
            }
          />
          <Route
            exact
            path="/freight-paid"
            element={
              <Layout>
                <FreightPaid />
              </Layout>
            }
          />
          <Route
            exact
            path="/permit-number-quantity"
            element={
              <Layout>
                <PermitNumberQuantity />
              </Layout>
            }
          />
          <Route
            exact
            path="/permit-number-payment"
            element={
              <Layout>
                <PermitNumberPayment />
              </Layout>
            }
          />
          <Route
            exact
            path="/typeof-vehicle-used"
            element={
              <Layout>
                <TypeOfVehicleUsed />
              </Layout>
            }
          />
          <Route
            exact
            path="/truck-wise-freight"
            element={
              <Layout>
                <TruckWiseFreight />
              </Layout>
            }
          />
          <Route
            exact
            path="/owner-wise-freight"
            element={
              <Layout>
                <OwnerWiseFreight />
              </Layout>
            }
          />
          <Route
            exact
            path="/job-perfomance"
            element={
              <Layout>
                <JobPerfomance />
              </Layout>
            }
          />
          <Route
            exact
            path="/all-permit-summary"
            element={
              <Layout>
                <AllPermitSummary />
              </Layout>
            }
          />
          <Route
            exact
            path="/single-permit-status"
            element={
              <Layout>
                <SinglePermitStatus />
              </Layout>
            }
          />
          <Route
            exact
            path="/permit-wise-freigh-payable"
            element={
              <Layout>
                <PermitWiseFreightPayable />
              </Layout>
            }
          />
          <Route
            exact
            path="/month-wise-perfomance"
            element={
              <Layout>
                <MonthWisePerfomance />
              </Layout>
            }
          />
          <Route
            exact
            path="/monthly-ddm-return"
            element={
              <Layout>
                <MonthlyDdmReturn />
              </Layout>
            }
          />
          {/* ---------------report------------------------------------------------------------------------------------- */}

          {/* report section end */}

          {/* Administration */}

          <Route
            exact="true"
            path="/nr-truck-posting"
            element={
              <PrivateRoute
                element={NrTruckPosting}
                layout={Layout} // Pass the layout component
              />
            }
          />

          <Route
            exact="true"
            path="/despatch-summary"
            element={
              <PrivateRoute
                element={DespatchSummary}
                layout={Layout} // Pass the layout component
              />
            }
          />
          <Route
            exact="true"
            path="/manage-challan-holder-bank-account"
            element={
              <PrivateRoute
                element={ManageChallanHolderBankAccount}
                layout={Layout} // Pass the layout component
              />
            }
          />

          <Route
            exact="true"
            path="/manage-ledger-customer"
            element={
              <PrivateRoute
                element={ManageLedgerCustomer}
                layout={Layout} // Pass the layout component
              />
            }
          />

          <Route
            exact="true"
            path="/application-user"
            element={
              <PrivateRoute
                element={ApplicationUser}
                layout={Layout} // Pass the layout component
              />
            }
          />

          <Route
            exact="true"
            path="/company-and-bank-details"
            element={
              <PrivateRoute
                element={CompanyAndBankDetails}
                layout={Layout} // Pass the layout component
              />
            }
          />

          <Route
            exact="true"
            path="/remove-from-bulk-payment"
            element={
              <PrivateRoute
                element={RemoveFromBulkPayment}
                layout={Layout} // Pass the layout component
              />
            }
          />

          <Route
            exact="true"
            path="/verify-reference"
            element={
              <PrivateRoute
                element={VerifyRemovedReference}
                layout={Layout} // Pass the layout component
              />
            }
          />

          <Route
            exact="true"
            path="/freight-rate-verification"
            element={
              <PrivateRoute
                element={FreightRateVerification}
                layout={Layout} // Pass the layout component
              />
            }
          />

          <Route
            exact="true"
            path="/entry-job-performance"
            element={
              <PrivateRoute
                element={EntryJobPerformance}
                layout={Layout} // Pass the layout component
              />
            }
          />

          <Route
            exact="true"
            path="/stop-payment-process"
            element={
              <PrivateRoute
                element={StopPaymentProcess}
                layout={Layout} // Pass the layout component
              />
            }
          />

          <Route
            exact="true"
            path="/update-iform"
            element={
              <PrivateRoute
                element={UpdateTpFormi}
                layout={Layout} // Pass the layout component
              />
            }
          />

          {/* User Specific */}

          <Route
            exact="true"
            path="/day-wise-loading-summary"
            element={
              <PrivateRoute
                element={DayWiseLoadingSummary}
                layout={Layout} // Pass the layout component
              />
            }
          />

          <Route
            exact="true"
            path="/day-wise-un-loading-summary"
            element={
              <PrivateRoute
                element={DayWiseUnLoadingSummary}
                layout={Layout} // Pass the layout component
              />
            }
          />

          <Route
            exact="true"
            path="/delivery-days"
            element={
              <PrivateRoute
                element={DeliveryDays}
                layout={Layout} // Pass the layout component
              />
            }
          />

          <Route
            exact="true"
            path="/consolidated-on-all"
            element={
              <PrivateRoute
                element={ConsolidatedOnAll}
                layout={Layout} // Pass the layout component
              />
            }
          />

          <Route
            exact="true"
            path="/permit-wise-loading-work"
            element={
              <PrivateRoute
                element={PermitWiseLoadingWork}
                layout={Layout} // Pass the layout component
              />
            }
          />
          <Route
            exact="true"
            path="/permit-wise-un-loading-work"
            element={
              <PrivateRoute
                element={PermitWiseUnLoadingWork}
                layout={Layout} // Pass the layout component
              />
            }
          />

          {/* billing section routes start*/}

          <Route
            path="/billing-work-space"
            element={
              <PrivateRoute
                element={WorkSpace}
                layout={BillingLayout} // Pass the layout component
              />
            }
          />

          <Route
            exact="true"
            path="/billing-start"
            element={
              <PrivateRoute
                element={First}
                layout={BillingLayout} // Pass the layout component
              />
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
