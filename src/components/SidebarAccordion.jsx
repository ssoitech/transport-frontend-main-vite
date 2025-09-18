import React from "react";
import "./sidebar_accordion.css";
import { NavLink, useLocation } from "react-router-dom";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";
import "react-accessible-accordion/dist/fancy-example.css";
import {
  FaHome,
  FaTruck,
  FaFileAlt,
  FaMapMarkedAlt,
  FaChartPie,
  FaUsers,
  FaMoneyCheckAlt,
  FaCog,
  FaQuestionCircle,
  FaSignOutAlt,
} from "react-icons/fa";

function SidebarAccordion() {
  const location = useLocation();

  // Example user info
  const user = {
    name: "Rajan Kawnt Sharma",
    email: "rajanikants1506@example.com",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  };

  // Example logo
  const logo =
    "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg";

  // Example search handler
  const [search, setSearch] = React.useState("");

  // Sidebar sections and links with icons
  const sections = [
    {
      title: "Setup Application",
      links: [
        {
          to: "/passing-weight",
          label: "Passing Weight",
          icon: <FaTruck className="sidebar-icon" />,
        },
        {
          to: "/mines-consignor-master",
          label: "Mines/Consignor Master",
          icon: <FaFileAlt className="sidebar-icon" />,
        },
        {
          to: "/export-consignee-master",
          label: "Exporter/Consignee Master",
          icon: <FaFileAlt className="sidebar-icon" />,
        },
        {
          to: "/trader-billing-party-master",
          label: "Trader/Billing Party Master",
          icon: <FaFileAlt className="sidebar-icon" />,
        },
        {
          to: "/field-staff-fleet-agent",
          label: "Field Staff/Fleet Agent",
          icon: <FaUsers className="sidebar-icon" />,
        },
        {
          to: "/truck-owner",
          label: "Truck Owner",
          icon: <FaTruck className="sidebar-icon" />,
        },
        {
          to: "/truck-number",
          label: "Truck Number",
          icon: <FaTruck className="sidebar-icon" />,
        },
        {
          to: "/challan-holder",
          label: "Challan Holder",
          icon: <FaUsers className="sidebar-icon" />,
        },
        {
          to: "/tds-declaration-data",
          label: "TDS Declaration Data",
          icon: <FaMoneyCheckAlt className="sidebar-icon" />,
        },
        {
          to: "/account-master",
          label: "Bank Account",
          icon: <FaMoneyCheckAlt className="sidebar-icon" />,
        },
        {
          to: "/pre-information",
          label: "Pre Information",
          icon: <FaFileAlt className="sidebar-icon" />,
        },
        {
          to: "/ownership-transfer",
          label: "Ownership Transfer",
          icon: <FaFileAlt className="sidebar-icon" />,
        },
        {
          to: "/upload-bank-account",
          label: "Upload Bank Account",
          icon: <FaMoneyCheckAlt className="sidebar-icon" />,
        },
        {
          to: "/vehicle-number-upload",
          label: "Vehicle Number Upload",
          icon: <FaTruck className="sidebar-icon" />,
        },
      ],
    },
    {
      title: "Challan Input",
      links: [
        {
          to: "/permit-master-form-I",
          label: "Permit Master (Form-I)",
          icon: <FaFileAlt className="sidebar-icon" />,
        },
        {
          to: "/challan-loading-entry-manual",
          label: "Challan Loading Entry - Manually",
          icon: <FaFileAlt className="sidebar-icon" />,
        },
        {
          to: "/unloading-challan-entry-manual",
          label: "Challan Un-Loading Entry - Manually",
          icon: <FaFileAlt className="sidebar-icon" />,
        },
        {
          to: "/excel-file-upload-full",
          label: "Excel File Upload - Despatch Data (Full)",
          icon: <FaFileAlt className="sidebar-icon" />,
        },
        {
          to: "/excel-file-upload-selection",
          label: "Excel File Upload - Despatch Data (Selection)",
          icon: <FaFileAlt className="sidebar-icon" />,
        },
        {
          to: "/mark-challan-as-unloaded",
          label: "Mark Challan As Un-Loaded",
          icon: <FaFileAlt className="sidebar-icon" />,
        },
        {
          to: "/update-vehicle-rate",
          label: "Update Vehicle Rate (For Payment)",
          icon: <FaMoneyCheckAlt className="sidebar-icon" />,
        },
        {
          to: "/freight-vs-advance",
          label: "Freight vs Advance",
          icon: <FaMoneyCheckAlt className="sidebar-icon" />,
        },
        {
          to: "/input-advance-data-on-permitwise",
          label: "Input Advance Data On Permit Wise",
          icon: <FaMoneyCheckAlt className="sidebar-icon" />,
        },
        {
          to: "/input-advance-data-on-single-challan",
          label: "Input Advance Data On Single Challan",
          icon: <FaMoneyCheckAlt className="sidebar-icon" />,
        },
        {
          to: "/upload-advance-data-from-excel",
          label: "Upload Advance Data From Excel Without Bank",
          icon: <FaMoneyCheckAlt className="sidebar-icon" />,
        },
        {
          to: "/bank-advance-entry",
          label: "Bank Advance Entry",
          icon: <FaMoneyCheckAlt className="sidebar-icon" />,
        },
        {
          to: "/bank-advance-pending",
          label: "Bank Advance Pending",
          icon: <FaMoneyCheckAlt className="sidebar-icon" />,
        },
        {
          to: "/bank-advance-payment",
          label: "Bank Advance Payment",
          icon: <FaMoneyCheckAlt className="sidebar-icon" />,
        },
        {
          to: "/bank-advance-paid-report",
          label: "Bank Advance Paid Report",
          icon: <FaMoneyCheckAlt className="sidebar-icon" />,
        },
        {
          to: "/challan-status",
          label: "Challan Status",
          icon: <FaFileAlt className="sidebar-icon" />,
        },
        {
          to: "/vehicle-rate-analysis",
          label: "Vehicle Rate Analysis",
          icon: <FaChartPie className="sidebar-icon" />,
        },
      ],
    },
    {
      title: "Challan Payment",
      links: [
        {
          to: "/challan-received-entry",
          label: "Challan Received Entry",
          icon: <FaFileAlt className="sidebar-icon" />,
        },
        {
          to: "/challan-payment-single",
          label: "Challan Payment - Single",
          icon: <FaMoneyCheckAlt className="sidebar-icon" />,
        },
        {
          to: "/challan-payment-bulk",
          label: "Challan Payment - Bulk",
          icon: <FaMoneyCheckAlt className="sidebar-icon" />,
        },
        {
          to: "/ledger-party-payment",
          label: "Ledger Party Payment",
          icon: <FaMoneyCheckAlt className="sidebar-icon" />,
        },
        {
          to: "/reference-summary",
          label: "Reference Summary",
          icon: <FaFileAlt className="sidebar-icon" />,
        },
        {
          to: "/payment-reference-list",
          label: "Payment Reference List",
          icon: <FaFileAlt className="sidebar-icon" />,
        },
        {
          to: "/payment-reference-details",
          label: "Payment Reference Details",
          icon: <FaFileAlt className="sidebar-icon" />,
        },
        {
          to: "/challan-status-received",
          label: "Challan Status - Received",
          icon: <FaFileAlt className="sidebar-icon" />,
        },
        {
          to: "/pending-for-process",
          label: "Pending For Process",
          icon: <FaFileAlt className="sidebar-icon" />,
        },
        {
          to: "/ledger-customer-challan",
          label: "Ledger Customer Challan",
          icon: <FaFileAlt className="sidebar-icon" />,
        },
        {
          to: "/challan-holder-payment",
          label: "Challan Holder Payment",
          icon: <FaMoneyCheckAlt className="sidebar-icon" />,
        },
        {
          to: "/payment-summary",
          label: "Payment Summary",
          icon: <FaChartPie className="sidebar-icon" />,
        },
        {
          to: "/payment-details-challan-wise",
          label: "Payment Details (Challan Wise)",
          icon: <FaChartPie className="sidebar-icon" />,
        },
      ],
    },
    {
      title: "HSD Register",
      links: [
        {
          to: "/diesel-issued",
          label: "Diesel Issued *",
          icon: <FaTruck className="sidebar-icon" />,
        },
        {
          to: "/hsd-challan-reconsile",
          label: "HSD Challan Reconsile",
          icon: <FaFileAlt className="sidebar-icon" />,
        },
        {
          to: "/hsd-bill-received-format-1",
          label: "HSD Bill Received Format 1",
          icon: <FaFileAlt className="sidebar-icon" />,
        },
        {
          to: "/hsd-bill-received-format-2",
          label: "HSD Bill Received Format 2",
          icon: <FaFileAlt className="sidebar-icon" />,
        },
        {
          to: "/hsd-bill-received-format-3",
          label: "HSD Bill Received Format 3",
          icon: <FaFileAlt className="sidebar-icon" />,
        },
        {
          to: "/filling-station-payment",
          label: "Filling Station Payment",
          icon: <FaMoneyCheckAlt className="sidebar-icon" />,
        },
        {
          to: "/filling-station-adjustment-entry",
          label: "Filling Station Adjustment Entry",
          icon: <FaMoneyCheckAlt className="sidebar-icon" />,
        },
        {
          to: "/filling-station-ledger",
          label: "Filling Station Ledger",
          icon: <FaFileAlt className="sidebar-icon" />,
        },
        {
          to: "/multiple-pump-setting",
          label: "Multiple Pump Setting",
          icon: <FaCog className="sidebar-icon" />,
        },
      ],
    },
    {
      title: "Query",
      links: [
        {
          to: "/permit-master-list",
          label: "Permit Master List",
          icon: <FaFileAlt className="sidebar-icon" />,
        },
        {
          to: "/daily-loading-summary",
          label: "Daily Loading Summary",
          icon: <FaChartPie className="sidebar-icon" />,
        },
        {
          to: "/loading-report-challan-wise",
          label: "Loading Report - Challan Wise",
          icon: <FaChartPie className="sidebar-icon" />,
        },
        {
          to: "/unloading-report",
          label: "Unloading Report",
          icon: <FaChartPie className="sidebar-icon" />,
        },
        {
          to: "/loading-report-permit-vs-date",
          label: "Loading Report - Permit vs Date",
          icon: <FaChartPie className="sidebar-icon" />,
        },
        {
          to: "/undelivered-report",
          label: "Un-Delivered Report",
          icon: <FaChartPie className="sidebar-icon" />,
        },
        {
          to: "/nr-challan-report",
          label: "NR Challan Report",
          icon: <FaChartPie className="sidebar-icon" />,
        },
        {
          to: "/cancelled-challan-report",
          label: "Cancelled Challan Report",
          icon: <FaChartPie className="sidebar-icon" />,
        },
        {
          to: "/check-challan-amount",
          label: "Check Challan Amount",
          icon: <FaMoneyCheckAlt className="sidebar-icon" />,
        },
        {
          to: "/freight-balance-due",
          label: "Freight Balance Due",
          icon: <FaMoneyCheckAlt className="sidebar-icon" />,
        },
        {
          to: "/truck-list",
          label: "Truck List",
          icon: <FaTruck className="sidebar-icon" />,
        },
        {
          to: "/truck-owner-list",
          label: "Truck Owner List",
          icon: <FaTruck className="sidebar-icon" />,
        },
        {
          to: "/challan-holder-list",
          label: "Challan Holder List",
          icon: <FaUsers className="sidebar-icon" />,
        },
        {
          to: "/tds-declaration-status",
          label: "TDS Declaration Status",
          icon: <FaMoneyCheckAlt className="sidebar-icon" />,
        },
        {
          to: "/truck-owner-challan-holder-history",
          label: "Truck Owner / Challan Holder History",
          icon: <FaTruck className="sidebar-icon" />,
        },
        {
          to: "/truck-loading-history",
          label: "Truck Loading History",
          icon: <FaTruck className="sidebar-icon" />,
        },
        {
          to: "/own-and-discounted-challan",
          label: "Own & Discounted Challan",
          icon: <FaTruck className="sidebar-icon" />,
        },
        {
          to: "/payment-ledger",
          label: "Payment Ledger",
          icon: <FaMoneyCheckAlt className="sidebar-icon" />,
        },
        {
          to: "/known-truck-status",
          label: "Known Truck Status",
          icon: <FaTruck className="sidebar-icon" />,
        },
        {
          to: "/un-known-truck-status",
          label: "Un-Known Truck Status",
          icon: <FaTruck className="sidebar-icon" />,
        },
      ],
    },
    {
      title: "Report",
      links: [
        {
          to: "/daily-report",
          label: "Daily Report",
          icon: <FaChartPie className="sidebar-icon" />,
        },
        {
          to: "/payable-summary",
          label: "Payable Summary",
          icon: <FaChartPie className="sidebar-icon" />,
        },
        {
          to: "/advance-paid",
          label: "Advance Paid",
          icon: <FaChartPie className="sidebar-icon" />,
        },
        {
          to: "/received-vs-paid-vs-due",
          label: "Received vs Paid Vs Due",
          icon: <FaChartPie className="sidebar-icon" />,
        },
        {
          to: "/toll-gate-statement",
          label: "Toll Gate Statement",
          icon: <FaChartPie className="sidebar-icon" />,
        },
        {
          to: "/tds-collated-statement",
          label: "TDS Collated Statement",
          icon: <FaChartPie className="sidebar-icon" />,
        },
        {
          to: "/freight-paid-in-details",
          label: "Freight Paid-In Details",
          icon: <FaChartPie className="sidebar-icon" />,
        },
        {
          to: "/truck-wise-freight-paid",
          label: "Truck Wise Freight Paid",
          icon: <FaChartPie className="sidebar-icon" />,
        },
        {
          to: "/loading-material",
          label: "Loading material",
          icon: <FaFileAlt className="sidebar-icon" />,
        },
        {
          to: "/un-loading-material",
          label: "Un-Loading material",
          icon: <FaFileAlt className="sidebar-icon" />,
        },
        {
          to: "/freight-paid",
          label: "Fright Paid",
          icon: <FaMoneyCheckAlt className="sidebar-icon" />,
        },
        {
          to: "/permit-number-quantity",
          label: "Permit Number(Quantity)",
          icon: <FaFileAlt className="sidebar-icon" />,
        },
        {
          to: "/permit-number-payment",
          label: "Permit Number(Payment)",
          icon: <FaMoneyCheckAlt className="sidebar-icon" />,
        },
        {
          to: "/typeof-vehicle-used",
          label: "Type of Vehicle Used*",
          icon: <FaTruck className="sidebar-icon" />,
        },
        {
          to: "/truck-wise-freight",
          label: "Truck-Wise Freight",
          icon: <FaTruck className="sidebar-icon" />,
        },
        {
          to: "/owner-wise-freight",
          label: "Owner-Wise Freight",
          icon: <FaTruck className="sidebar-icon" />,
        },
        {
          to: "/job-perfomance",
          label: "Job Perfomance",
          icon: <FaChartPie className="sidebar-icon" />,
        },
        {
          to: "/all-permit-summary",
          label: "All Permit Status",
          icon: <FaFileAlt className="sidebar-icon" />,
        },
        {
          to: "/single-permit-status",
          label: "Single Permit Status",
          icon: <FaFileAlt className="sidebar-icon" />,
        },
        {
          to: "/permit-wise-freigh-payable",
          label: "Permit-Wise Freight Payable",
          icon: <FaMoneyCheckAlt className="sidebar-icon" />,
        },
        {
          to: "/month-wise-perfomance",
          label: "Month-Wise Perfomance",
          icon: <FaChartPie className="sidebar-icon" />,
        },
        {
          to: "/monthly-ddm-return",
          label: "Monthly DDM Return",
          icon: <FaChartPie className="sidebar-icon" />,
        },
      ],
    },
    {
      title: "Administration",
      links: [
        {
          to: "/nr-truck-posting",
          label: "NR Truck Posting",
          icon: <FaTruck className="sidebar-icon" />,
        },
        {
          to: "/despatch-summary",
          label: "Despatch Summary",
          icon: <FaFileAlt className="sidebar-icon" />,
        },
        {
          to: "/manage-challan-holder-bank-account",
          label: "Manage Challan Holder Bank A/C",
          icon: <FaMoneyCheckAlt className="sidebar-icon" />,
        },
        {
          to: "/application-user",
          label: "Application User",
          icon: <FaUsers className="sidebar-icon" />,
        },
        {
          to: "/company-and-bank-details",
          label: "Company & Bank Details",
          icon: <FaMoneyCheckAlt className="sidebar-icon" />,
        },
        {
          to: "/remove-from-bulk-payment",
          label: "Remove From Bulk Payment",
          icon: <FaMoneyCheckAlt className="sidebar-icon" />,
        },
        {
          to: "/verify-reference",
          label: "Verify Removed Reference from Bulk Payment",
          icon: <FaFileAlt className="sidebar-icon" />,
        },
        {
          to: "/freight-rate-verification",
          label: "Frieght Rate Verification",
          icon: <FaMoneyCheckAlt className="sidebar-icon" />,
        },
        {
          to: "/entry-job-performance",
          label: "Entry Job Performance",
          icon: <FaChartPie className="sidebar-icon" />,
        },
        {
          to: "/stop-payment-process",
          label: "Stop Payment Process",
          icon: <FaMoneyCheckAlt className="sidebar-icon" />,
        },
        {
          to: "/update-iform",
          label: "Update TP (Form-I)",
          icon: <FaFileAlt className="sidebar-icon" />,
        },
      ],
    },
    {
      title: "User Specific",
      links: [
        {
          to: "/day-wise-loading-summary",
          label: "Day-Wise Loading Summary",
          icon: <FaChartPie className="sidebar-icon" />,
        },
        {
          to: "/day-wise-un-loading-summary",
          label: "Day-Wise Un-Loading Summary",
          icon: <FaChartPie className="sidebar-icon" />,
        },
        {
          to: "/delivery-days",
          label: "Delivery Days",
          icon: <FaChartPie className="sidebar-icon" />,
        },
        {
          to: "/consolidated-on-all",
          label: "Consolidated On All",
          icon: <FaChartPie className="sidebar-icon" />,
        },
        {
          to: "/permit-wise-loading-work",
          label: "Permit Wise Loading Work",
          icon: <FaChartPie className="sidebar-icon" />,
        },
        {
          to: "/permit-wise-un-loading-work",
          label: "Permit Wise Un-Loading Work",
          icon: <FaChartPie className="sidebar-icon" />,
        },
      ],
    },
    {
      title: "Settings",
      links: [
        {
          to: "/settings",
          label: "Settings",
          icon: <FaCog className="sidebar-icon" />,
        },
        {
          to: "/help",
          label: "Help",
          icon: <FaQuestionCircle className="sidebar-icon" />,
        },
      ],
    },
  ];

  // Render links with icons
  const renderLinks = (links) => (
    <ul className="sidebar-ul">
      {links.map((link, idx) => (
        <li
          key={link.to}
          className={
            location.pathname === link.to
              ? "sidebar-ul-li active"
              : "sidebar-ul-li"
          }
        >
          {link.icon}
          <NavLink
            exact
            className="collapse-item text-decoration-none custom-text"
            to={link.to}
          >
            {link.label}
          </NavLink>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="inner-sidebar">
      {/* Logo and search */}
      <div className="sidebar-header">
        <img src={logo} alt="Logo" className="sidebar-logo" />
        <input
          className="sidebar-search"
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {/* Accordion sections */}
      {sections.map((section) => (
        <div key={section.title}>
          <Accordion allowMultipleExpanded allowZeroExpanded>
            <AccordionItem uuid={section.title}>
              <AccordionItemHeading>
                <AccordionItemButton className="sidebar-btn">
                  <div className="sidebar-section-title">{section.title}</div>
                </AccordionItemButton>
              </AccordionItemHeading>
              <AccordionItemPanel className="sidebar-body">
                {renderLinks(section.links)}
              </AccordionItemPanel>
            </AccordionItem>
          </Accordion>
        </div>
      ))}
      {/* User profile at bottom */}
      <div className="sidebar-profile">
        <img
          src={user.avatar}
          alt="avatar"
          className="sidebar-profile-avatar"
        />
        <div className="sidebar-profile-info">
          <div className="sidebar-profile-name">{user.name}</div>
          <div className="sidebar-profile-email">{user.email}</div>
        </div>
        <FaSignOutAlt className="sidebar-profile-logout" title="Logout" />
      </div>
    </div>
  );
}

export default SidebarAccordion;
