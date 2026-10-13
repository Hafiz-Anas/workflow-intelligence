import { AlertTriangle, FileText, Gauge, ListOrdered, Network, PlugZap, type LucideIcon } from "lucide-react";

export interface NavItem {
  /** Full screen name, used for page titles, tooltips and screen readers. */
  label: string;
  /** Compact label that fits the sidebar on one line. */
  shortLabel: string;
  href: string;
  /** Path prefix used to decide the active state. */
  match: string;
  icon: LucideIcon;
}

export const navItems: NavItem[] = [
  { label: "Priority Queue", shortLabel: "Priority Queue", href: "/priority-queue", match: "/priority-queue", icon: ListOrdered },
  { label: "Decision Brief", shortLabel: "Decision Brief", href: "/decision-brief", match: "/decision-brief", icon: FileText },
  { label: "Authority and Routing Map", shortLabel: "Authority & Routing", href: "/authority-map", match: "/authority-map", icon: Network },
  { label: "Bottlenecks and Performance", shortLabel: "Bottlenecks", href: "/bottlenecks", match: "/bottlenecks", icon: Gauge },
  { label: "Risk Matrix", shortLabel: "Risk Matrix", href: "/risk-matrix", match: "/risk-matrix", icon: AlertTriangle },
  { label: "Connectors and Policy Library", shortLabel: "Connectors & Policies", href: "/connectors", match: "/connectors", icon: PlugZap },
];
