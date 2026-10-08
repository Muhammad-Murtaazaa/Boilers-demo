"use client";

export interface DemoWorker {
  id: string;
  name: string;
  code: string;
  role: "Lead Boiler Operator" | "Biomass Fuel Feeder" | "Maintenance Specialist" | "Water Treatment Tech" | "Shift Supervisor";
  assignedBoilerId: string;
  assignedSite: string;
  shift: "Morning (06:00 - 14:00)" | "Evening (14:00 - 22:00)" | "Night (22:00 - 06:00)";
  status: "active" | "off_duty" | "on_leave";
  phone: string;
  avatar: string;
  dailyWage: string;
}

export interface DemoExpense {
  id: string;
  boilerId: string;
  boilerModel: string;
  siteName: string;
  amount: number;
  category: "Biomass Fuel" | "Water Treatment" | "Lubricants & Oils" | "Spare Parts" | "Crew Allowance" | "General Running";
  description: string;
  loggedBy: string;
  date: string;
  timestamp: string;
}

export interface DemoBoiler {
  id: string;
  code: string;
  model: string;
  clientName: string;
  siteName: string;
  siteLocation: string;
  image: string;
  status: "operational" | "maintenance" | "standby" | "issue";
  statusLabel: string;
  capacityKgPerHour: string;
  fuelType: string;
  installationDate: string;
  operatingHours: string;
  dailyRunningCost: number;
  leadOperatorName: string;
  lastUpdateMins: number;
  assignedWorkerIds: string[];
}

export interface DemoWorkOrder {
  id: string;
  code: string;
  boilerId: string;
  boilerModel: string;
  siteName: string;
  title: string;
  category: "Preventive" | "Corrective" | "Emergency Breakdown" | "Statutory Inspection";
  priority: "Emergency" | "High" | "Medium" | "Low";
  status: "Open" | "In Progress" | "Completed" | "Pending Parts";
  assignedTech: string;
  reportedDate: string;
  targetCompletionDate: string;
  completedDate?: string;
  description: string;
  downtimeHours: number;
  estimatedCost: number;
  partsUsed?: string;
}

export interface DemoPMSchedule {
  id: string;
  code: string;
  boilerId: string;
  boilerModel: string;
  siteName: string;
  taskName: string;
  frequencyDays: number;
  nextDueDate: string;
  lastDoneDate: string;
  criticality: "Critical" | "High" | "Medium";
  assignedRole: string;
  status: "Due Soon" | "Optimal" | "Overdue";
}

export interface DemoSupplier {
  id: string;
  code: string;
  name: string;
  category: "Biomass Fuel" | "Water Chemistry" | "Refractory & Piping" | "Valves & Controls";
  contactPerson: string;
  phone: string;
  email: string;
  rating: number;
  leadTimeDays: number;
  status: "Approved" | "Audited" | "Preferred";
  paymentTerms: string;
}

export interface DemoPurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  siteName: string;
  boilerId: string;
  boilerModel: string;
  issueDate: string;
  deliveryDate: string;
  items: Array<{ description: string; qty: number; uom: string; unitPrice: number; total: number }>;
  totalAmount: number;
  status: "Draft" | "Approved" | "In Transit" | "Received & Verified" | "Closed";
  paymentTerms: string;
}

export interface DemoSteamInvoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  siteName: string;
  boilerId: string;
  boilerModel: string;
  billingPeriod: string;
  steamTonnage: number;
  tariffPerTon: number;
  fuelSurcharge: number;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  status: "Paid" | "Pending" | "Overdue";
  dueDate: string;
  paidDate?: string;
}

export interface DemoWaterTest {
  id: string;
  sampleNumber: string;
  boilerId: string;
  boilerModel: string;
  siteName: string;
  testedAt: string;
  analyst: string;
  samplePoint: "Boiler Feed Water" | "Drum Water" | "Condensate Return" | "Softener Effluent";
  pH: number;
  tdsPpm: number;
  hardnessPpm: number;
  phosphatePpm: number;
  dissolvedOxygenPpb: number;
  status: "Compliant" | "Out of Spec" | "Action Required";
  correctiveAction?: string;
}

export interface DemoInventoryItem {
  id: string;
  sku: string;
  name: string;
  category: "Biofuel Bulk" | "Water Chemicals" | "Mechanical Spares" | "Sensors & Electrical";
  location: string;
  quantity: number;
  unit: string;
  reorderLevel: number;
  unitCost: number;
  totalValue: number;
  status: "Optimal" | "Low Stock" | "Critical";
}

const INITIAL_BOILERS: DemoBoiler[] = [
  {
    id: "blr-01",
    code: "BLR-8456-VWK",
    model: "Thermax SteamMax 5T",
    clientName: "Apex Textiles Ltd",
    siteName: "Apex Textile Mills - Sector 4",
    siteLocation: "Faisalabad Industrial Area, Site #04",
    image: "/boilers/boiler_steammax.jpg",
    status: "operational",
    statusLabel: "Operational",
    capacityKgPerHour: "5,000 kg/hr",
    fuelType: "Biomass Briquettes (Cotton Stalk)",
    installationDate: "12 Feb 2024",
    operatingHours: "2,150 hrs",
    dailyRunningCost: 142.50,
    leadOperatorName: "Liam Harper",
    lastUpdateMins: 2,
    assignedWorkerIds: ["emp-01", "emp-02", "emp-05"],
  },
  {
    id: "blr-02",
    code: "BLR-5678-DEF",
    model: "Volta Steam G-5000",
    clientName: "GreenBio Chemical Plant",
    siteName: "GreenBio Bio-Refinery Unit 2",
    siteLocation: "Sheikhupura Road, Zone B, Lahore",
    image: "/boilers/boiler_watertube.jpg",
    status: "operational",
    statusLabel: "Operational",
    capacityKgPerHour: "8,500 kg/hr",
    fuelType: "Wood Pellets (Grade A)",
    installationDate: "20 May 2023",
    operatingHours: "4,320 hrs",
    dailyRunningCost: 210.00,
    leadOperatorName: "Noah Bennett",
    lastUpdateMins: 5,
    assignedWorkerIds: ["emp-03", "emp-04"],
  },
  {
    id: "blr-03",
    code: "BLR-2345-JKL",
    model: "Eco-Steam Pro 800kW",
    clientName: "Prime Sugar Refineries",
    siteName: "Prime Mills - Boiler Bay C",
    siteLocation: "Sugar Mill Road, Multan",
    image: "/boilers/boiler_biomass.jpg",
    status: "maintenance",
    statusLabel: "In Maintenance",
    capacityKgPerHour: "3,200 kg/hr",
    fuelType: "Bagasse & Agricultural Pellets",
    installationDate: "10 Oct 2023",
    operatingHours: "1,510 hrs",
    dailyRunningCost: 85.00,
    leadOperatorName: "Logan Pierce",
    lastUpdateMins: 1,
    assignedWorkerIds: ["emp-06"],
  },
  {
    id: "blr-04",
    code: "BLR-9101-GHI",
    model: "AquaSteam G-2500 Pack",
    clientName: "SunGlow Food Processing",
    siteName: "SunGlow Dairy & Beverage Plant",
    siteLocation: "Kot Lakhpat Industrial Estate, Lahore",
    image: "/boilers/boiler_ecopack.jpg",
    status: "operational",
    statusLabel: "Operational",
    capacityKgPerHour: "2,500 kg/hr",
    fuelType: "Agri-Biomass Pellets",
    installationDate: "05 Dec 2024",
    operatingHours: "845 hrs",
    dailyRunningCost: 95.00,
    leadOperatorName: "Mason Clarke",
    lastUpdateMins: 10,
    assignedWorkerIds: ["emp-07", "emp-08"],
  },
  {
    id: "blr-05",
    code: "BLR-6789-MNO",
    model: "Thermax SteamMax 8T Heavy",
    clientName: "Crescent Paper Mills",
    siteName: "Crescent Mill Complex - Bay #1",
    siteLocation: "Gujranwala Road, Plant 1",
    image: "/boilers/boiler_steammax.jpg",
    status: "standby",
    statusLabel: "Standby",
    capacityKgPerHour: "8,000 kg/hr",
    fuelType: "Rice Husk Pellets",
    installationDate: "18 Jan 2024",
    operatingHours: "3,120 hrs",
    dailyRunningCost: 45.00,
    leadOperatorName: "Lucas Reed",
    lastUpdateMins: 7,
    assignedWorkerIds: ["emp-09"],
  },
  {
    id: "blr-06",
    code: "BLR-7890-STU",
    model: "Volta Steam Industrial 600",
    clientName: "Indus Dyeing & Bleaching",
    siteName: "Indus Wet Processing Zone",
    siteLocation: "Nooriabad Industrial Estate, Sindh",
    image: "/boilers/boiler_watertube.jpg",
    status: "operational",
    statusLabel: "Operational",
    capacityKgPerHour: "6,200 kg/hr",
    fuelType: "Wood Chips & Sawdust Briquettes",
    installationDate: "15 Apr 2023",
    operatingHours: "5,400 hrs",
    dailyRunningCost: 178.00,
    leadOperatorName: "Elijah Brooks",
    lastUpdateMins: 4,
    assignedWorkerIds: ["emp-10", "emp-11"],
  },
  {
    id: "blr-07",
    code: "BLR-8901-YZA",
    model: "Eco-Steam High-Output 1200",
    clientName: "National Pharma Laboratories",
    siteName: "National Pharma Clean Steam Site",
    siteLocation: "Hub River Industrial Zone, Hub",
    image: "/boilers/boiler_biomass.jpg",
    status: "issue",
    statusLabel: "Issue Detected",
    capacityKgPerHour: "1,200 kg/hr",
    fuelType: "High Purity Wood Pellets",
    installationDate: "02 Aug 2024",
    operatingHours: "610 hrs",
    dailyRunningCost: 110.00,
    leadOperatorName: "Jameson Cole",
    lastUpdateMins: 8,
    assignedWorkerIds: ["emp-12"],
  },
  {
    id: "blr-08",
    code: "BLR-3456-PQR",
    model: "AquaSteam Rapid Steam 1500",
    clientName: "Sultan Leather Tanneries",
    siteName: "Sultan Tannery Boiler House",
    siteLocation: "Kasur Tanneries Zone, Kasur",
    image: "/boilers/boiler_ecopack.jpg",
    status: "maintenance",
    statusLabel: "In Maintenance",
    capacityKgPerHour: "1,500 kg/hr",
    fuelType: "Densified Biomass Pellets",
    installationDate: "29 Nov 2023",
    operatingHours: "2,890 hrs",
    dailyRunningCost: 65.00,
    leadOperatorName: "Oliver Hayes",
    lastUpdateMins: 3,
    assignedWorkerIds: ["emp-13", "emp-14"],
  },
];

const INITIAL_STAFF: DemoWorker[] = [
  {
    id: "emp-01",
    code: "EMP-101",
    name: "Liam Harper",
    role: "Lead Boiler Operator",
    assignedBoilerId: "blr-01",
    assignedSite: "Apex Textile Mills - Sector 4",
    shift: "Morning (06:00 - 14:00)",
    status: "active",
    phone: "+92 300 8472911",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    dailyWage: "$35.00",
  },
  {
    id: "emp-02",
    code: "EMP-102",
    name: "Ali Asghar",
    role: "Biomass Fuel Feeder",
    assignedBoilerId: "blr-01",
    assignedSite: "Apex Textile Mills - Sector 4",
    shift: "Morning (06:00 - 14:00)",
    status: "active",
    phone: "+92 301 9876543",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    dailyWage: "$28.00",
  },
  {
    id: "emp-03",
    code: "EMP-103",
    name: "Noah Bennett",
    role: "Lead Boiler Operator",
    assignedBoilerId: "blr-02",
    assignedSite: "GreenBio Bio-Refinery Unit 2",
    shift: "Morning (06:00 - 14:00)",
    status: "active",
    phone: "+92 321 4455667",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
    dailyWage: "$36.00",
  },
  {
    id: "emp-04",
    code: "EMP-104",
    name: "Zubair Khan",
    role: "Water Treatment Tech",
    assignedBoilerId: "blr-02",
    assignedSite: "GreenBio Bio-Refinery Unit 2",
    shift: "Evening (14:00 - 22:00)",
    status: "active",
    phone: "+92 333 5551212",
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&auto=format&fit=crop&q=80",
    dailyWage: "$32.00",
  },
  {
    id: "emp-05",
    code: "EMP-105",
    name: "Tariq Mahmood",
    role: "Shift Supervisor",
    assignedBoilerId: "blr-01",
    assignedSite: "Apex Textile Mills - Sector 4",
    shift: "Morning (06:00 - 14:00)",
    status: "active",
    phone: "+92 300 1234567",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80",
    dailyWage: "$45.00",
  },
  {
    id: "emp-06",
    code: "EMP-106",
    name: "Logan Pierce",
    role: "Maintenance Specialist",
    assignedBoilerId: "blr-03",
    assignedSite: "Prime Mills - Boiler Bay C",
    shift: "Morning (06:00 - 14:00)",
    status: "active",
    phone: "+92 302 7788990",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80",
    dailyWage: "$38.00",
  },
  {
    id: "emp-07",
    code: "EMP-107",
    name: "Mason Clarke",
    role: "Lead Boiler Operator",
    assignedBoilerId: "blr-04",
    assignedSite: "SunGlow Dairy & Beverage Plant",
    shift: "Morning (06:00 - 14:00)",
    status: "active",
    phone: "+92 306 1122334",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80",
    dailyWage: "$34.00",
  },
  {
    id: "emp-08",
    code: "EMP-108",
    name: "Farhan Saeed",
    role: "Biomass Fuel Feeder",
    assignedBoilerId: "blr-04",
    assignedSite: "SunGlow Dairy & Beverage Plant",
    shift: "Evening (14:00 - 22:00)",
    status: "active",
    phone: "+92 307 4455889",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80",
    dailyWage: "$28.00",
  },
  {
    id: "emp-09",
    code: "EMP-109",
    name: "Lucas Reed",
    role: "Lead Boiler Operator",
    assignedBoilerId: "blr-05",
    assignedSite: "Crescent Mill Complex - Bay #1",
    shift: "Night (22:00 - 06:00)",
    status: "off_duty",
    phone: "+92 312 9988776",
    avatar: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=100&auto=format&fit=crop&q=80",
    dailyWage: "$35.00",
  },
  {
    id: "emp-10",
    code: "EMP-110",
    name: "Elijah Brooks",
    role: "Lead Boiler Operator",
    assignedBoilerId: "blr-06",
    assignedSite: "Indus Wet Processing Zone",
    shift: "Morning (06:00 - 14:00)",
    status: "active",
    phone: "+92 314 5566778",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80",
    dailyWage: "$36.00",
  },
  {
    id: "emp-11",
    code: "EMP-111",
    name: "Bilal Warraich",
    role: "Maintenance Specialist",
    assignedBoilerId: "blr-06",
    assignedSite: "Indus Wet Processing Zone",
    shift: "Morning (06:00 - 14:00)",
    status: "active",
    phone: "+92 315 2233445",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80",
    dailyWage: "$37.00",
  },
  {
    id: "emp-12",
    code: "EMP-112",
    name: "Jameson Cole",
    role: "Lead Boiler Operator",
    assignedBoilerId: "blr-07",
    assignedSite: "National Pharma Clean Steam Site",
    shift: "Morning (06:00 - 14:00)",
    status: "active",
    phone: "+92 316 8899001",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    dailyWage: "$35.00",
  },
  {
    id: "emp-13",
    code: "EMP-113",
    name: "Oliver Hayes",
    role: "Lead Boiler Operator",
    assignedBoilerId: "blr-08",
    assignedSite: "Sultan Tannery Boiler House",
    shift: "Morning (06:00 - 14:00)",
    status: "active",
    phone: "+92 318 4433221",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    dailyWage: "$34.00",
  },
  {
    id: "emp-14",
    code: "EMP-114",
    name: "Rashid Minhas",
    role: "Biomass Fuel Feeder",
    assignedBoilerId: "blr-08",
    assignedSite: "Sultan Tannery Boiler House",
    shift: "Evening (14:00 - 22:00)",
    status: "active",
    phone: "+92 319 6677889",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
    dailyWage: "$28.00",
  },
];

const INITIAL_EXPENSES: DemoExpense[] = [
  {
    id: "exp-01",
    boilerId: "blr-01",
    boilerModel: "Thermax SteamMax 5T",
    siteName: "Apex Textile Mills - Sector 4",
    amount: 85.00,
    category: "Biomass Fuel",
    description: "Daily briquette loading top-up (2.5 tons batch)",
    loggedBy: "Liam Harper",
    date: "Today, 10:45 AM",
    timestamp: new Date().toISOString(),
  },
  {
    id: "exp-02",
    boilerId: "blr-01",
    boilerModel: "Thermax SteamMax 5T",
    siteName: "Apex Textile Mills - Sector 4",
    amount: 32.50,
    category: "Water Treatment",
    description: "Water softener conditioning additive",
    loggedBy: "Ali Asghar",
    date: "Today, 08:30 AM",
    timestamp: new Date().toISOString(),
  },
  {
    id: "exp-03",
    boilerId: "blr-01",
    boilerModel: "Thermax SteamMax 5T",
    siteName: "Apex Textile Mills - Sector 4",
    amount: 25.00,
    category: "Crew Allowance",
    description: "Morning boiler crew food & hydration stipend",
    loggedBy: "Tariq Mahmood",
    date: "Today, 07:15 AM",
    timestamp: new Date().toISOString(),
  },
  {
    id: "exp-04",
    boilerId: "blr-02",
    boilerModel: "Volta Steam G-5000",
    siteName: "GreenBio Bio-Refinery Unit 2",
    amount: 140.00,
    category: "Biomass Fuel",
    description: "Wood pellets feed bin refilling",
    loggedBy: "Noah Bennett",
    date: "Today, 11:10 AM",
    timestamp: new Date().toISOString(),
  },
  {
    id: "exp-05",
    boilerId: "blr-02",
    boilerModel: "Volta Steam G-5000",
    siteName: "GreenBio Bio-Refinery Unit 2",
    amount: 70.00,
    category: "Lubricants & Oils",
    description: "Feed auger high-temp synthetic gearbox oil",
    loggedBy: "Zubair Khan",
    date: "Today, 09:20 AM",
    timestamp: new Date().toISOString(),
  },
];

const INITIAL_WORK_ORDERS: DemoWorkOrder[] = [
  {
    id: "wo-101",
    code: "WO-2026-041",
    boilerId: "blr-07",
    boilerModel: "Eco-Steam High-Output 1200",
    siteName: "National Pharma Clean Steam Site",
    title: "Primary Economizer Tube Descaling & Flue Gas Seal Inspection",
    category: "Emergency Breakdown",
    priority: "Emergency",
    status: "In Progress",
    assignedTech: "Liam Harper",
    reportedDate: "2026-10-06",
    targetCompletionDate: "2026-10-08",
    description: "Flue gas temp spiking above 240°C indicates soot buildup and possible tube scale. Urgent inspection and hydro wash required.",
    downtimeHours: 4.5,
    estimatedCost: 380.00,
    partsUsed: "High-Temp Spiral Gaskets (2 sets), Alkaline Descaler",
  },
  {
    id: "wo-102",
    code: "WO-2026-039",
    boilerId: "blr-03",
    boilerModel: "Eco-Steam Pro 800kW",
    siteName: "Prime Mills - Boiler Bay C",
    title: "Rotary Biomass Feeder Auger Bearing Overhaul",
    category: "Preventive",
    priority: "High",
    status: "In Progress",
    assignedTech: "Logan Pierce",
    reportedDate: "2026-10-05",
    targetCompletionDate: "2026-10-07",
    description: "Excessive vibration detected on bagasse feeder drive shaft. Replace pillow block bearings and align flexible coupling.",
    downtimeHours: 6.0,
    estimatedCost: 520.00,
    partsUsed: "SKF Pillow Block Bearings UCP210 (2 units), Synthetic Gear Grease",
  },
  {
    id: "wo-103",
    code: "WO-2026-035",
    boilerId: "blr-08",
    boilerModel: "AquaSteam Rapid Steam 1500",
    siteName: "Sultan Tannery Boiler House",
    title: "Dual Spring Safety Relief Valve (DN50) Annual Bench Calibration",
    category: "Statutory Inspection",
    priority: "Medium",
    status: "Pending Parts",
    assignedTech: "Oliver Hayes",
    reportedDate: "2026-10-03",
    targetCompletionDate: "2026-10-09",
    description: "Statutory 16-bar pop-off certification test witnessed by Boiler Inspectorate. Waiting on factory test bench calibration kit.",
    downtimeHours: 2.0,
    estimatedCost: 290.00,
    partsUsed: "DN50 Safety Valve Calibration Seal Kit",
  },
  {
    id: "wo-104",
    code: "WO-2026-030",
    boilerId: "blr-01",
    boilerModel: "Thermax SteamMax 5T",
    siteName: "Apex Textile Mills - Sector 4",
    title: "Main Steam Stop Valve Packing Gland Re-torque & Leak Arrest",
    category: "Corrective",
    priority: "Low",
    status: "Completed",
    assignedTech: "Liam Harper",
    reportedDate: "2026-09-28",
    targetCompletionDate: "2026-09-29",
    completedDate: "2026-09-29",
    description: "Minor steam vapor leak detected at bonnet flange during 8-bar test. Packing gland tightened and graphite ring added.",
    downtimeHours: 1.0,
    estimatedCost: 85.00,
    partsUsed: "Graphite Ribbon Packing 12mm",
  },
];

const INITIAL_PM_SCHEDULES: DemoPMSchedule[] = [
  {
    id: "pm-01",
    code: "PMS-W01",
    boilerId: "blr-01",
    boilerModel: "Thermax SteamMax 5T",
    siteName: "Apex Textile Mills - Sector 4",
    taskName: "Weekly Biomass Grate Bar & Ash Hopper Clearing",
    frequencyDays: 7,
    nextDueDate: "2026-10-10",
    lastDoneDate: "2026-10-03",
    criticality: "High",
    assignedRole: "Biomass Fuel Feeder",
    status: "Optimal",
  },
  {
    id: "pm-02",
    code: "PMS-M02",
    boilerId: "blr-02",
    boilerModel: "Volta Steam G-5000",
    siteName: "GreenBio Bio-Refinery Unit 2",
    taskName: "Monthly Water Softener Resin Backwash & Hardness Test",
    frequencyDays: 30,
    nextDueDate: "2026-10-08",
    lastDoneDate: "2026-09-08",
    criticality: "Critical",
    assignedRole: "Water Treatment Tech",
    status: "Due Soon",
  },
  {
    id: "pm-03",
    code: "PMS-Q03",
    boilerId: "blr-04",
    boilerModel: "AquaSteam G-2500 Pack",
    siteName: "SunGlow Dairy & Beverage Plant",
    taskName: "Quarterly Induced Draft (ID) Fan Dynamic Balancing & Belt Tension",
    frequencyDays: 90,
    nextDueDate: "2026-10-15",
    lastDoneDate: "2026-07-15",
    criticality: "Medium",
    assignedRole: "Maintenance Specialist",
    status: "Optimal",
  },
  {
    id: "pm-04",
    code: "PMS-A04",
    boilerId: "blr-07",
    boilerModel: "Eco-Steam High-Output 1200",
    siteName: "National Pharma Clean Steam Site",
    taskName: "Statutory Boiler Inspectorate Hydraulic Pressure Test (24 Bar)",
    frequencyDays: 365,
    nextDueDate: "2026-10-04",
    lastDoneDate: "2025-10-04",
    criticality: "Critical",
    assignedRole: "Lead Boiler Operator",
    status: "Overdue",
  },
];

const INITIAL_SUPPLIERS: DemoSupplier[] = [
  {
    id: "sup-01",
    code: "VEN-AGRO-01",
    name: "Indus Agro Biofuels Corp",
    category: "Biomass Fuel",
    contactPerson: "Tariq Cheema",
    phone: "+92 300 5544332",
    email: "procurement@indusagrofuels.com",
    rating: 4.9,
    leadTimeDays: 2,
    status: "Preferred",
    paymentTerms: "Net 30 Days",
  },
  {
    id: "sup-02",
    code: "VEN-CHEM-02",
    name: "Apex Water Care Specialty Chemicals",
    category: "Water Chemistry",
    contactPerson: "Dr. Naeem Farooq",
    phone: "+92 321 7766554",
    email: "industrial@apexwatercare.com",
    rating: 4.8,
    leadTimeDays: 3,
    status: "Approved",
    paymentTerms: "Net 15 Days",
  },
  {
    id: "sup-03",
    code: "VEN-MECH-03",
    name: "Crescent Valves & Steam Fittings Ltd",
    category: "Valves & Controls",
    contactPerson: "Mian Saeed",
    phone: "+92 333 1122334",
    email: "sales@crescentvalves.pk",
    rating: 4.7,
    leadTimeDays: 5,
    status: "Audited",
    paymentTerms: "Immediate Float / Cash on Delivery",
  },
  {
    id: "sup-04",
    code: "VEN-REFR-04",
    name: "National Refractory & Castables",
    category: "Refractory & Piping",
    contactPerson: "Kamran Siddiqui",
    phone: "+92 301 9988776",
    email: "kamran@nationalrefractory.com",
    rating: 4.6,
    leadTimeDays: 7,
    status: "Approved",
    paymentTerms: "Net 30 Days",
  },
];

const INITIAL_PURCHASE_ORDERS: DemoPurchaseOrder[] = [
  {
    id: "po-101",
    poNumber: "PO-2026-108",
    supplierId: "sup-01",
    supplierName: "Indus Agro Biofuels Corp",
    siteName: "Apex Textile Mills - Sector 4",
    boilerId: "blr-01",
    boilerModel: "Thermax SteamMax 5T",
    issueDate: "2026-10-04",
    deliveryDate: "2026-10-07",
    items: [
      { description: "Rice Husk Biofuel Bulk (Grade A, <10% moisture)", qty: 25, uom: "Tonnes", unitPrice: 95.00, total: 2375.00 },
      { description: "Dense Cotton Stalk Briquettes 90mm", qty: 10, uom: "Tonnes", unitPrice: 110.00, total: 1100.00 },
    ],
    totalAmount: 3475.00,
    status: "In Transit",
    paymentTerms: "Net 30 Days",
  },
  {
    id: "po-102",
    poNumber: "PO-2026-109",
    supplierId: "sup-02",
    supplierName: "Apex Water Care Specialty Chemicals",
    siteName: "GreenBio Bio-Refinery Unit 2",
    boilerId: "blr-02",
    boilerModel: "Volta Steam G-5000",
    issueDate: "2026-10-05",
    deliveryDate: "2026-10-09",
    items: [
      { description: "Catalyzed Oxygen Scavenger Drum 25L (DEHA)", qty: 8, uom: "Drums", unitPrice: 65.00, total: 520.00 },
      { description: "Polymeric Sludge Conditioner 20L", qty: 5, uom: "Drums", unitPrice: 85.00, total: 425.00 },
    ],
    totalAmount: 945.00,
    status: "Approved",
    paymentTerms: "Net 15 Days",
  },
  {
    id: "po-103",
    poNumber: "PO-2026-110",
    supplierId: "sup-03",
    supplierName: "Crescent Valves & Steam Fittings Ltd",
    siteName: "Riverside Mill (Site Storage)",
    boilerId: "blr-01",
    boilerModel: "Thermax SteamMax 5T",
    issueDate: "2026-10-02",
    deliveryDate: "2026-10-05",
    items: [
      { description: "DN50 Class 300 Cast Steel Safety Relief Valve", qty: 2, uom: "Units", unitPrice: 280.00, total: 560.00 },
      { description: "Spiral Wound Flange Gaskets 2-inch ANSI 300", qty: 12, uom: "Sets", unitPrice: 18.50, total: 222.00 },
    ],
    totalAmount: 782.00,
    status: "Received & Verified",
    paymentTerms: "Immediate Float / Cash on Delivery",
  },
];

const INITIAL_INVOICES: DemoSteamInvoice[] = [
  {
    id: "inv-01",
    invoiceNumber: "INV-STM-2026-091",
    clientName: "Apex Textiles Ltd",
    siteName: "Apex Textile Mills - Sector 4",
    boilerId: "blr-01",
    boilerModel: "Thermax SteamMax 5T",
    billingPeriod: "September 2026",
    steamTonnage: 1420.5,
    tariffPerTon: 36.50,
    fuelSurcharge: 1250.00,
    subtotal: 53098.25,
    taxAmount: 8495.72,
    totalAmount: 61593.97,
    status: "Paid",
    dueDate: "2026-10-15",
    paidDate: "2026-10-05",
  },
  {
    id: "inv-02",
    invoiceNumber: "INV-STM-2026-092",
    clientName: "GreenBio Chemical Plant",
    siteName: "GreenBio Bio-Refinery Unit 2",
    boilerId: "blr-02",
    boilerModel: "Volta Steam G-5000",
    billingPeriod: "September 2026",
    steamTonnage: 2180.0,
    tariffPerTon: 35.00,
    fuelSurcharge: 2100.00,
    subtotal: 78400.00,
    taxAmount: 12544.00,
    totalAmount: 90944.00,
    status: "Pending",
    dueDate: "2026-10-20",
  },
  {
    id: "inv-03",
    invoiceNumber: "INV-STM-2026-093",
    clientName: "Prime Sugar Refineries",
    siteName: "Prime Mills - Boiler Bay C",
    boilerId: "blr-03",
    boilerModel: "Eco-Steam Pro 800kW",
    billingPeriod: "August 2026",
    steamTonnage: 890.0,
    tariffPerTon: 38.00,
    fuelSurcharge: 950.00,
    subtotal: 34770.00,
    taxAmount: 5563.20,
    totalAmount: 40333.20,
    status: "Overdue",
    dueDate: "2026-09-25",
  },
  {
    id: "inv-04",
    invoiceNumber: "INV-STM-2026-094",
    clientName: "SunGlow Food Processing",
    siteName: "SunGlow Dairy & Beverage Plant",
    boilerId: "blr-04",
    boilerModel: "AquaSteam G-2500 Pack",
    billingPeriod: "September 2026",
    steamTonnage: 750.2,
    tariffPerTon: 40.00,
    fuelSurcharge: 600.00,
    subtotal: 30608.00,
    taxAmount: 4897.28,
    totalAmount: 35505.28,
    status: "Pending",
    dueDate: "2026-10-25",
  },
];

const INITIAL_WATER_TESTS: DemoWaterTest[] = [
  {
    id: "lab-01",
    sampleNumber: "LAB-2026-088",
    boilerId: "blr-01",
    boilerModel: "Thermax SteamMax 5T",
    siteName: "Apex Textile Mills - Sector 4",
    testedAt: "Today, 08:30 AM",
    analyst: "Zubair Khan (Chemist)",
    samplePoint: "Boiler Feed Water",
    pH: 9.1,
    tdsPpm: 2150,
    hardnessPpm: 0.5,
    phosphatePpm: 42.0,
    dissolvedOxygenPpb: 4.8,
    status: "Compliant",
    correctiveAction: "Dosing pump rate nominal at 1.8 L/hr.",
  },
  {
    id: "lab-02",
    sampleNumber: "LAB-2026-089",
    boilerId: "blr-07",
    boilerModel: "Eco-Steam High-Output 1200",
    siteName: "National Pharma Clean Steam Site",
    testedAt: "Yesterday, 04:15 PM",
    analyst: "Jameson Cole",
    samplePoint: "Drum Water",
    pH: 11.2,
    tdsPpm: 3450,
    hardnessPpm: 3.8,
    phosphatePpm: 18.0,
    dissolvedOxygenPpb: 14.2,
    status: "Action Required",
    correctiveAction: "Excessive TDS (>3000) and elevated hardness. Continuous blowdown valve opened 2.5 turns. Pre-softener regeneration initiated.",
  },
  {
    id: "lab-03",
    sampleNumber: "LAB-2026-090",
    boilerId: "blr-02",
    boilerModel: "Volta Steam G-5000",
    siteName: "GreenBio Bio-Refinery Unit 2",
    testedAt: "Today, 10:00 AM",
    analyst: "Zubair Khan (Chemist)",
    samplePoint: "Condensate Return",
    pH: 8.8,
    tdsPpm: 120,
    hardnessPpm: 0.0,
    phosphatePpm: 35.0,
    dissolvedOxygenPpb: 2.1,
    status: "Compliant",
    correctiveAction: "Condensate recovery purity optimal. 88% return rate.",
  },
];

const INITIAL_INVENTORY: DemoInventoryItem[] = [
  {
    id: "inv-01",
    sku: "SKU-FUEL-RH",
    name: "Rice Husk Biofuel Bulk (Grade A)",
    category: "Biofuel Bulk",
    location: "Central Warehouse #1 (Bay A)",
    quantity: 48.5,
    unit: "Tonnes",
    reorderLevel: 15.0,
    unitCost: 95.00,
    totalValue: 4607.50,
    status: "Optimal",
  },
  {
    id: "inv-02",
    sku: "SKU-FUEL-WP",
    name: "Densified Pine Wood Pellets 8mm",
    category: "Biofuel Bulk",
    location: "Riverside Mill (Site Storage)",
    quantity: 22.0,
    unit: "Tonnes",
    reorderLevel: 10.0,
    unitCost: 125.00,
    totalValue: 2750.00,
    status: "Optimal",
  },
  {
    id: "inv-03",
    sku: "SKU-CHEM-O2",
    name: "DEHA Oxygen Scavenger (25L Drum)",
    category: "Water Chemicals",
    location: "Central Warehouse #1 (Chem Bay)",
    quantity: 36,
    unit: "Drums",
    reorderLevel: 12,
    unitCost: 65.00,
    totalValue: 2340.00,
    status: "Optimal",
  },
  {
    id: "inv-04",
    sku: "SKU-CHEM-PHOS",
    name: "Trisodium Phosphate Scale Inhibitor (50kg)",
    category: "Water Chemicals",
    location: "Faisalabad Weaving Complex",
    quantity: 8,
    unit: "Bags",
    reorderLevel: 10,
    unitCost: 78.00,
    totalValue: 624.00,
    status: "Low Stock",
  },
  {
    id: "inv-05",
    sku: "SKU-VLV-DN50",
    name: "DN50 Class 300 Safety Relief Valve",
    category: "Mechanical Spares",
    location: "Central Warehouse #1 (Spares Rack)",
    quantity: 4,
    unit: "Units",
    reorderLevel: 2,
    unitCost: 280.00,
    totalValue: 1120.00,
    status: "Optimal",
  },
  {
    id: "inv-06",
    sku: "SKU-GSK-300",
    name: "Spiral Wound Flange Gasket Set 16-bar",
    category: "Mechanical Spares",
    location: "National Pharma Site Depot",
    quantity: 2,
    unit: "Sets",
    reorderLevel: 6,
    unitCost: 45.00,
    totalValue: 90.00,
    status: "Critical",
  },
  {
    id: "inv-07",
    sku: "SKU-SNS-TEMP",
    name: "PT100 RTD High-Temp Flue Sensor",
    category: "Sensors & Electrical",
    location: "Central Warehouse #1 (Electronics)",
    quantity: 7,
    unit: "Units",
    reorderLevel: 3,
    unitCost: 115.00,
    totalValue: 805.00,
    status: "Optimal",
  },
];

const STORAGE_KEYS = {
  BOILERS: "stoker_demo_boilers_v2",
  STAFF: "stoker_demo_staff_v2",
  EXPENSES: "stoker_demo_expenses_v2",
  WORK_ORDERS: "stoker_demo_work_orders_v1",
  PM_SCHEDULES: "stoker_demo_pm_schedules_v1",
  SUPPLIERS: "stoker_demo_suppliers_v1",
  PURCHASE_ORDERS: "stoker_demo_purchase_orders_v1",
  INVOICES: "stoker_demo_invoices_v1",
  WATER_TESTS: "stoker_demo_water_tests_v1",
  INVENTORY: "stoker_demo_inventory_v1",
};

export const DemoStore = {
  getBoilers(): DemoBoiler[] {
    if (typeof window === "undefined") return INITIAL_BOILERS;
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BOILERS);
      if (!saved) {
        localStorage.setItem(STORAGE_KEYS.BOILERS, JSON.stringify(INITIAL_BOILERS));
        return INITIAL_BOILERS;
      }
      return JSON.parse(saved);
    } catch {
      return INITIAL_BOILERS;
    }
  },

  getBoilerById(id: string): DemoBoiler | undefined {
    return this.getBoilers().find((b) => b.id === id);
  },

  updateBoilerStatus(id: string, status: DemoBoiler["status"]): void {
    if (typeof window === "undefined") return;
    const boilers = this.getBoilers();
    const updated = boilers.map((b) => {
      if (b.id === id) {
        let statusLabel = "Operational";
        if (status === "maintenance") statusLabel = "In Maintenance";
        if (status === "standby") statusLabel = "Standby";
        if (status === "issue") statusLabel = "Issue Detected";
        return { ...b, status, statusLabel, lastUpdateMins: 0 };
      }
      return b;
    });
    localStorage.setItem(STORAGE_KEYS.BOILERS, JSON.stringify(updated));
    this.notify();
  },

  getStaff(): DemoWorker[] {
    if (typeof window === "undefined") return INITIAL_STAFF;
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STAFF);
      if (!saved) {
        localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(INITIAL_STAFF));
        return INITIAL_STAFF;
      }
      return JSON.parse(saved);
    } catch {
      return INITIAL_STAFF;
    }
  },

  getStaffForBoiler(boilerId: string): DemoWorker[] {
    return this.getStaff().filter((s) => s.assignedBoilerId === boilerId);
  },

  addStaff(worker: Omit<DemoWorker, "id" | "code">): DemoWorker {
    const current = this.getStaff();
    const nextCode = `EMP-${(current.length + 101).toString()}`;
    const newWorker: DemoWorker = {
      ...worker,
      id: `emp-${Date.now()}`,
      code: nextCode,
    };
    const updated = [newWorker, ...current];
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(updated));
      const boilers = this.getBoilers();
      const updatedBoilers = boilers.map((b) => {
        if (b.id === worker.assignedBoilerId) {
          return {
            ...b,
            assignedWorkerIds: Array.from(new Set([...b.assignedWorkerIds, newWorker.id])),
          };
        }
        return b;
      });
      localStorage.setItem(STORAGE_KEYS.BOILERS, JSON.stringify(updatedBoilers));
      this.notify();
    }
    return newWorker;
  },

  updateStaff(id: string, updates: Partial<DemoWorker>): void {
    if (typeof window === "undefined") return;
    const staff = this.getStaff();
    const updated = staff.map((s) => (s.id === id ? { ...s, ...updates } : s));
    localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(updated));
    this.notify();
  },

  deleteStaff(id: string): void {
    if (typeof window === "undefined") return;
    const staff = this.getStaff().filter((s) => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(staff));
    const boilers = this.getBoilers().map((b) => ({
      ...b,
      assignedWorkerIds: b.assignedWorkerIds.filter((wid) => wid !== id),
    }));
    localStorage.setItem(STORAGE_KEYS.BOILERS, JSON.stringify(boilers));
    this.notify();
  },

  getExpenses(): DemoExpense[] {
    if (typeof window === "undefined") return INITIAL_EXPENSES;
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EXPENSES);
      if (!saved) {
        localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(INITIAL_EXPENSES));
        return INITIAL_EXPENSES;
      }
      return JSON.parse(saved);
    } catch {
      return INITIAL_EXPENSES;
    }
  },

  getExpensesForBoiler(boilerId: string): DemoExpense[] {
    return this.getExpenses().filter((e) => e.boilerId === boilerId);
  },

  addExpense(expense: Omit<DemoExpense, "id" | "date" | "timestamp">): DemoExpense {
    const current = this.getExpenses();
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const newExpense: DemoExpense = {
      ...expense,
      id: `exp-${Date.now()}`,
      date: `Today, ${timeStr}`,
      timestamp: now.toISOString(),
    };
    const updated = [newExpense, ...current];

    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(updated));
      const boilers = this.getBoilers();
      const updatedBoilers = boilers.map((b) => {
        if (b.id === expense.boilerId) {
          return {
            ...b,
            dailyRunningCost: Number((b.dailyRunningCost + expense.amount).toFixed(2)),
            lastUpdateMins: 0,
          };
        }
        return b;
      });
      localStorage.setItem(STORAGE_KEYS.BOILERS, JSON.stringify(updatedBoilers));
      this.notify();
    }
    return newExpense;
  },

  // ===== Plant Maintenance (CMMS) =====
  getWorkOrders(): DemoWorkOrder[] {
    if (typeof window === "undefined") return INITIAL_WORK_ORDERS;
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WORK_ORDERS);
      if (!saved) {
        localStorage.setItem(STORAGE_KEYS.WORK_ORDERS, JSON.stringify(INITIAL_WORK_ORDERS));
        return INITIAL_WORK_ORDERS;
      }
      return JSON.parse(saved);
    } catch {
      return INITIAL_WORK_ORDERS;
    }
  },

  addWorkOrder(wo: Omit<DemoWorkOrder, "id" | "code">): DemoWorkOrder {
    const current = this.getWorkOrders();
    const nextCode = `WO-2026-${(current.length + 42).toString().padStart(3, "0")}`;
    const newWo: DemoWorkOrder = {
      ...wo,
      id: `wo-${Date.now()}`,
      code: nextCode,
    };
    const updated = [newWo, ...current];
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.WORK_ORDERS, JSON.stringify(updated));
      this.notify();
    }
    return newWo;
  },

  updateWorkOrderStatus(id: string, status: DemoWorkOrder["status"]): void {
    if (typeof window === "undefined") return;
    const list = this.getWorkOrders();
    const updated = list.map((item) =>
      item.id === id
        ? {
            ...item,
            status,
            completedDate: status === "Completed" ? new Date().toISOString().slice(0, 10) : item.completedDate,
          }
        : item
    );
    localStorage.setItem(STORAGE_KEYS.WORK_ORDERS, JSON.stringify(updated));
    this.notify();
  },

  getPMSchedules(): DemoPMSchedule[] {
    if (typeof window === "undefined") return INITIAL_PM_SCHEDULES;
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PM_SCHEDULES);
      if (!saved) {
        localStorage.setItem(STORAGE_KEYS.PM_SCHEDULES, JSON.stringify(INITIAL_PM_SCHEDULES));
        return INITIAL_PM_SCHEDULES;
      }
      return JSON.parse(saved);
    } catch {
      return INITIAL_PM_SCHEDULES;
    }
  },

  addPMSchedule(pm: Omit<DemoPMSchedule, "id" | "code">): DemoPMSchedule {
    const current = this.getPMSchedules();
    const nextCode = `PMS-${(current.length + 5).toString().padStart(3, "0")}`;
    const newPm: DemoPMSchedule = {
      ...pm,
      id: `pm-${Date.now()}`,
      code: nextCode,
    };
    const updated = [newPm, ...current];
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.PM_SCHEDULES, JSON.stringify(updated));
      this.notify();
    }
    return newPm;
  },

  // ===== Procurement & Suppliers =====
  getSuppliers(): DemoSupplier[] {
    if (typeof window === "undefined") return INITIAL_SUPPLIERS;
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SUPPLIERS);
      if (!saved) {
        localStorage.setItem(STORAGE_KEYS.SUPPLIERS, JSON.stringify(INITIAL_SUPPLIERS));
        return INITIAL_SUPPLIERS;
      }
      return JSON.parse(saved);
    } catch {
      return INITIAL_SUPPLIERS;
    }
  },

  addSupplier(supplier: Omit<DemoSupplier, "id" | "code">): DemoSupplier {
    const current = this.getSuppliers();
    const nextCode = `VEN-${(current.length + 5).toString().padStart(3, "0")}`;
    const newSup: DemoSupplier = {
      ...supplier,
      id: `sup-${Date.now()}`,
      code: nextCode,
    };
    const updated = [newSup, ...current];
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.SUPPLIERS, JSON.stringify(updated));
      this.notify();
    }
    return newSup;
  },

  getPurchaseOrders(): DemoPurchaseOrder[] {
    if (typeof window === "undefined") return INITIAL_PURCHASE_ORDERS;
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PURCHASE_ORDERS);
      if (!saved) {
        localStorage.setItem(STORAGE_KEYS.PURCHASE_ORDERS, JSON.stringify(INITIAL_PURCHASE_ORDERS));
        return INITIAL_PURCHASE_ORDERS;
      }
      return JSON.parse(saved);
    } catch {
      return INITIAL_PURCHASE_ORDERS;
    }
  },

  addPurchaseOrder(po: Omit<DemoPurchaseOrder, "id" | "poNumber">): DemoPurchaseOrder {
    const current = this.getPurchaseOrders();
    const nextPoNum = `PO-2026-${(current.length + 111).toString()}`;
    const newPo: DemoPurchaseOrder = {
      ...po,
      id: `po-${Date.now()}`,
      poNumber: nextPoNum,
    };
    const updated = [newPo, ...current];
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.PURCHASE_ORDERS, JSON.stringify(updated));
      this.notify();
    }
    return newPo;
  },

  updatePOStatus(id: string, status: DemoPurchaseOrder["status"]): void {
    if (typeof window === "undefined") return;
    const list = this.getPurchaseOrders();
    const updated = list.map((item) => (item.id === id ? { ...item, status } : item));
    localStorage.setItem(STORAGE_KEYS.PURCHASE_ORDERS, JSON.stringify(updated));
    this.notify();
  },

  // ===== Steam Invoices (AR) =====
  getInvoices(): DemoSteamInvoice[] {
    if (typeof window === "undefined") return INITIAL_INVOICES;
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INVOICES);
      if (!saved) {
        localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(INITIAL_INVOICES));
        return INITIAL_INVOICES;
      }
      return JSON.parse(saved);
    } catch {
      return INITIAL_INVOICES;
    }
  },

  addInvoice(inv: Omit<DemoSteamInvoice, "id" | "invoiceNumber">): DemoSteamInvoice {
    const current = this.getInvoices();
    const nextInv = `INV-STM-2026-${(current.length + 95).toString().padStart(3, "0")}`;
    const newInv: DemoSteamInvoice = {
      ...inv,
      id: `inv-${Date.now()}`,
      invoiceNumber: nextInv,
    };
    const updated = [newInv, ...current];
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(updated));
      this.notify();
    }
    return newInv;
  },

  markInvoicePaid(id: string): void {
    if (typeof window === "undefined") return;
    const list = this.getInvoices();
    const updated = list.map((item) =>
      item.id === id
        ? {
            ...item,
            status: "Paid" as const,
            paidDate: new Date().toISOString().slice(0, 10),
          }
        : item
    );
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(updated));
    this.notify();
  },

  // ===== Water Chemistry & Lab =====
  getWaterTests(): DemoWaterTest[] {
    if (typeof window === "undefined") return INITIAL_WATER_TESTS;
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WATER_TESTS);
      if (!saved) {
        localStorage.setItem(STORAGE_KEYS.WATER_TESTS, JSON.stringify(INITIAL_WATER_TESTS));
        return INITIAL_WATER_TESTS;
      }
      return JSON.parse(saved);
    } catch {
      return INITIAL_WATER_TESTS;
    }
  },

  addWaterTest(test: Omit<DemoWaterTest, "id" | "sampleNumber" | "testedAt">): DemoWaterTest {
    const current = this.getWaterTests();
    const nextNum = `LAB-2026-${(current.length + 91).toString().padStart(3, "0")}`;
    const nowStr = `Today, ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    const newTest: DemoWaterTest = {
      ...test,
      id: `lab-${Date.now()}`,
      sampleNumber: nextNum,
      testedAt: nowStr,
    };
    const updated = [newTest, ...current];
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.WATER_TESTS, JSON.stringify(updated));
      this.notify();
    }
    return newTest;
  },

  // ===== Inventory =====
  getInventory(): DemoInventoryItem[] {
    if (typeof window === "undefined") return INITIAL_INVENTORY;
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INVENTORY);
      if (!saved) {
        localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(INITIAL_INVENTORY));
        return INITIAL_INVENTORY;
      }
      return JSON.parse(saved);
    } catch {
      return INITIAL_INVENTORY;
    }
  },

  addInventoryItem(item: Omit<DemoInventoryItem, "id" | "totalValue" | "status">): DemoInventoryItem {
    const current = this.getInventory();
    const totalVal = Number((item.quantity * item.unitCost).toFixed(2));
    let status: DemoInventoryItem["status"] = "Optimal";
    if (item.quantity <= item.reorderLevel * 0.5) status = "Critical";
    else if (item.quantity <= item.reorderLevel) status = "Low Stock";

    const newItem: DemoInventoryItem = {
      ...item,
      id: `inv-${Date.now()}`,
      totalValue: totalVal,
      status,
    };
    const updated = [newItem, ...current];
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(updated));
      this.notify();
    }
    return newItem;
  },

  resetStore(): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.BOILERS, JSON.stringify(INITIAL_BOILERS));
    localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(INITIAL_STAFF));
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(INITIAL_EXPENSES));
    localStorage.setItem(STORAGE_KEYS.WORK_ORDERS, JSON.stringify(INITIAL_WORK_ORDERS));
    localStorage.setItem(STORAGE_KEYS.PM_SCHEDULES, JSON.stringify(INITIAL_PM_SCHEDULES));
    localStorage.setItem(STORAGE_KEYS.SUPPLIERS, JSON.stringify(INITIAL_SUPPLIERS));
    localStorage.setItem(STORAGE_KEYS.PURCHASE_ORDERS, JSON.stringify(INITIAL_PURCHASE_ORDERS));
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(INITIAL_INVOICES));
    localStorage.setItem(STORAGE_KEYS.WATER_TESTS, JSON.stringify(INITIAL_WATER_TESTS));
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(INITIAL_INVENTORY));
    this.notify();
  },

  notify(): void {
    if (typeof window === "undefined") return;
    window.dispatchEvent(new Event("stoker_demo_store_changed"));
  },

  subscribe(callback: () => void): () => void {
    if (typeof window === "undefined") return () => {};
    const handler = () => callback();
    window.addEventListener("stoker_demo_store_changed", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("stoker_demo_store_changed", handler);
      window.removeEventListener("storage", handler);
    };
  },
};

