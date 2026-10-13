/**
 * DEMO: sample data. Connection states and sync times are simulated.
 * Remove /lib/mock when connecting a real backend.
 */
import type { Connector, PipelineStatus } from "@/lib/schemas";
import { hoursAgo } from "./time";

export const mockConnectors: Connector[] = [
  { id: "con-sharepoint", name: "SharePoint", group: "document_systems", status: "online", lastSyncAt: hoursAgo(0.3), description: "Policy and procedure libraries", recordsIndexed: 4_812 },
  { id: "con-fileshare", name: "Network File Shares", group: "document_systems", status: "online", lastSyncAt: hoursAgo(2.5), description: "Departmental shared drives", recordsIndexed: 12_406 },
  { id: "con-records", name: "Records Management System", group: "document_systems", status: "needs_setup", lastSyncAt: null, description: "Signed contracts and board minutes", recordsIndexed: 0 },

  { id: "con-postgres", name: "PostgreSQL", group: "databases", status: "online", lastSyncAt: hoursAgo(0.1), description: "Asset register database", recordsIndexed: 88_120 },
  { id: "con-sqlserver", name: "SQL Server", group: "databases", status: "offline", lastSyncAt: hoursAgo(31), description: "Legacy finance data warehouse", recordsIndexed: 241_009 },
  { id: "con-oracle", name: "Oracle Database", group: "databases", status: "needs_setup", lastSyncAt: null, description: "Customer billing records", recordsIndexed: 0 },

  { id: "con-erp", name: "ERP Finance", group: "enterprise_apps", status: "online", lastSyncAt: hoursAgo(1), description: "Budgets, commitments and purchase orders", recordsIndexed: 31_550 },
  { id: "con-hr", name: "HR Information System", group: "enterprise_apps", status: "online", lastSyncAt: hoursAgo(4), description: "Roles, reporting lines and delegations", recordsIndexed: 3_204 },
  { id: "con-contracts", name: "Contract Management", group: "enterprise_apps", status: "online", lastSyncAt: hoursAgo(0.8), description: "Contract register and milestones", recordsIndexed: 1_146 },

  { id: "con-servicedesk", name: "Service Desk", group: "workflow_tools", status: "online", lastSyncAt: hoursAgo(0.2), description: "Incoming requests and tickets", recordsIndexed: 19_870 },
  { id: "con-email", name: "Shared Approval Mailbox", group: "workflow_tools", status: "offline", lastSyncAt: hoursAgo(9), description: "Email-based approval requests", recordsIndexed: 6_330 },
  { id: "con-forms", name: "Online Forms", group: "workflow_tools", status: "needs_setup", lastSyncAt: null, description: "Internal request forms", recordsIndexed: 0 },
];

export const mockPipelineStatus: PipelineStatus = {
  currentStage: "Analyze",
  description: "Connected sources are indexed and monitored. The platform is analysing approval patterns to prepare recommendations.",
};
