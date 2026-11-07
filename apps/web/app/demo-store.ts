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
  category: string;
  contactPerson: string;
  phone: string;
  email: string;
  address?: string;
  city?: string;
  rating: number;
  leadTimeDays: number;
  status: "Approved" | "Audited" | "Preferred" | "Inactive";
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
  items: Array<{ description: string; qty: number; uom: string; unitPrice: number; total: number; stockItemId?: string; category?: string }>;
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
  category: string;
  location: string;
  quantity: number;
  unit: string;
  reorderLevel: number;
  unitCost: number;
  totalValue: number;
  status: "Optimal" | "Low Stock" | "Critical";
}

// ===== USER REQUIREMENTS (PKR EDITIONS) =====

export interface DemoStockCategory {
  id: string;
  name: string;
  code: string;
  description: string;
  isPredefined?: boolean;
}

export interface DemoStockUnit {
  id: string;
  name: string;
  abbreviation: string;
  type: "Weight" | "Volume" | "Count" | "Length";
  isPredefined?: boolean;
}

export interface DemoStockMovement {
  id: string;
  movementNumber: string;
  type: "STOCK_IN" | "STOCK_OUT";
  itemId: string;
  itemSku: string;
  itemName: string;
  category: string;
  quantity: number;
  unit: string;
  siteName: string;
  boilerId?: string;
  boilerModel?: string;
  reference: string;
  vendorName?: string;
  issuedTo?: string;
  performedBy: string;
  date: string;
  timestamp: string;
  balanceAfter: number;
  notes?: string;
}

export interface DemoSteamRecord {
  id: string;
  recordNumber: string;
  date: string;
  shift: "Morning (06:00 - 14:00)" | "Evening (14:00 - 22:00)" | "Night (22:00 - 06:00)";
  boilerId: string;
  boilerModel: string;
  siteName: string;
  meterReadingInitial: number;
  meterReadingFinal: number;
  steamGeneratedTons: number;
  steamPressureBar: number;
  steamTemperatureC: number;
  fuelConsumedTons: number;
  fuelType: string;
  meterPhotoUrl: string;
  steamPhotoUrl: string;
  supervisorName: string;
  foremanName: string;
  notes?: string;
  timestamp: string;
}

export interface DemoVoucher {
  id: string;
  voucherNumber: string;
  date: string;
  month: string;
  type: "Payment Voucher" | "Cash Voucher" | "Salary Voucher" | "Fuel Purchase Voucher" | "Journal Voucher";
  payee: string;
  amount: number;
  category: string;
  siteName: string;
  boilerId?: string;
  boilerModel?: string;
  paymentMode: "Bank Transfer" | "Petty Cash Float" | "Cheque";
  referenceDoc: string;
  description: string;
  status: "Paid" | "Approved" | "Pending";
  approvedBy: string;
  preparedBy: string;
  timestamp: string;
}

export interface DemoStaffSalary {
  id: string;
  month: string;
  workerId: string;
  workerName: string;
  workerCode: string;
  role: string;
  siteName: string;
  boilerModel: string;
  dailyWageAmount: number;
  shiftsWorked: number;
  baseAmount: number;
  overtimeBonus: number;
  deductions: number;
  netPayable: number;
  status: "Disbursed" | "Approved" | "Pending";
  voucherNumber?: string;
  disbursedDate?: string;
}

export interface DemoMonthEndReconciliation {
  id: string;
  code: string;
  month: string;
  date: string;
  siteName: string;
  boilerModel: string;
  fuelType: string;
  unit: string;
  openingStock: number;
  receivedStock: number;
  consumedStock: number;
  bookClosingStock: number;
  physicalDipStock: number;
  varianceQuantity: number;
  variancePercentage: number;
  varianceReason: string;
  supervisorName: string;
  foremanName: string;
  status: "Reconciled" | "Discrepancy Under Audit" | "Pending Sign-off";
  signedOffDate: string;
}


export interface DemoFuelDispatch {
  id: string;
  dispatchNo: string;
  vendorId: string;
  vendorName: string;
  fuelType: string;
  targetSite: string;
  boilerId: string;
  boilerModel: string;
  vehicleNo: string;
  driverName: string;
  driverPhone: string;
  dispatchedTons: number;
  receivedTons: number;
  varianceTons: number;
  variancePct: number;
  ratePerTon: number;
  totalCostPkr: number;
  dispatchDate: string;
  deliveryDate: string;
  status: "Delivered & Verified" | "In Transit" | "Shortfall Under Dispute" | "Dispatched";
  weighbridgeSlipPhotoUrl: string;
  moisturePct: number;
  gcvKcalPerKg: number;
}

export interface DemoLedgerAccount {
  code: string;
  name: string;
  type: "Asset" | "Liability" | "Equity" | "Revenue" | "Expense";
  category: "Current Assets" | "Fixed Assets" | "Current Liabilities" | "Equity" | "Operating Revenue" | "Direct Operating Cost" | "Operating Expense";
  balance: number;
  normalBalance: "Debit" | "Credit";
  description: string;
}

export interface DemoJournalEntry {
  id: string;
  entryNo: string;
  date: string;
  sourceDoc: string;
  sourceType: "Fuel Delivery" | "Payroll Disbursement" | "Steam Invoice" | "Maintenance PO" | "Petty Cash Float" | "General Voucher";
  narration: string;
  debitAccountCode: string;
  debitAccountName: string;
  debitAmount: number;
  creditAccountCode: string;
  creditAccountName: string;
  creditAmount: number;
  postedBy: string;
  approvedBy: string;
  status: "Posted & Balanced" | "Audited";
  timestamp: string;
}

export interface DemoUserAccount {
  id: string;
  name: string;
  email: string;
  role: "Super Admin" | "Plant Manager" | "Site Supervisor" | "Boiler Foreman" | "Accounts & Finance";
  assignedSite: string;
  assignedBoilerId?: string;
  assignedBoilerModel?: string;
  phone: string;
  avatar: string;
  status: "Active" | "Inactive";
}

export interface DemoRolePermissions {
  boilers: { view: boolean; manage: boolean };
  steam: { view: boolean; log: boolean; approve: boolean };
  inventory: { view: boolean; stockInOut: boolean; manageItems: boolean };
  procurement: { view: boolean; createPO: boolean; manageVendors: boolean };
  expenses: { view: boolean; logExpense: boolean; manageVouchers: boolean };
  salaries: { view: boolean; processPayroll: boolean };
  settings: { view: boolean; editSettings: boolean; manageUsers: boolean };
}

// ===== INITIAL DATA (ALL IN PKR / RS.) =====

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
    dailyRunningCost: 42500,
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
    dailyRunningCost: 65000,
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
    dailyRunningCost: 28000,
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
    dailyRunningCost: 32000,
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
    dailyRunningCost: 15000,
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
    capacityKgPerHour: "6,000 kg/hr",
    fuelType: "Cotton Stalk Briquettes",
    installationDate: "14 Jul 2024",
    operatingHours: "1,890 hrs",
    dailyRunningCost: 45000,
    leadOperatorName: "Elijah Brooks",
    lastUpdateMins: 4,
    assignedWorkerIds: ["emp-10", "emp-11"],
  },
  {
    id: "blr-07",
    code: "BLR-1234-XYZ",
    model: "Eco-Steam High-Output 1200",
    clientName: "National Pharma Clean Steam",
    siteName: "National Pharma Clean Steam Site",
    siteLocation: "Sundar Industrial Estate, Lahore",
    image: "/boilers/boiler_biomass.jpg",
    status: "operational",
    statusLabel: "Operational",
    capacityKgPerHour: "4,000 kg/hr",
    fuelType: "White Biomass Pellets (Certified)",
    installationDate: "11 Aug 2024",
    operatingHours: "1,140 hrs",
    dailyRunningCost: 38000,
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
    dailyRunningCost: 22000,
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
    dailyWage: "Rs. 3,500",
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
    dailyWage: "Rs. 2,800",
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
    dailyWage: "Rs. 3,600",
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
    dailyWage: "Rs. 3,200",
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
    dailyWage: "Rs. 4,500",
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
    dailyWage: "Rs. 3,800",
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
    dailyWage: "Rs. 3,400",
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
    dailyWage: "Rs. 2,800",
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
    dailyWage: "Rs. 3,500",
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
    dailyWage: "Rs. 3,600",
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
    dailyWage: "Rs. 3,700",
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
    dailyWage: "Rs. 3,500",
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
    dailyWage: "Rs. 3,400",
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
    dailyWage: "Rs. 2,800",
  },
];

const INITIAL_EXPENSES: DemoExpense[] = [
  {
    id: "exp-01",
    boilerId: "blr-01",
    boilerModel: "Thermax SteamMax 5T",
    siteName: "Apex Textile Mills - Sector 4",
    amount: 28500,
    category: "Biomass Fuel",
    description: "Emergency bulk rice husk top-up (1 Tonne)",
    loggedBy: "Liam Harper",
    date: "Today, 10:45 AM",
    timestamp: new Date().toISOString(),
  },
  {
    id: "exp-02",
    boilerId: "blr-01",
    boilerModel: "Thermax SteamMax 5T",
    siteName: "Apex Textile Mills - Sector 4",
    amount: 14250,
    category: "Water Treatment",
    description: "Anti-scale phosphate chemical dosing batch #4",
    loggedBy: "Liam Harper",
    date: "Today, 08:15 AM",
    timestamp: new Date().toISOString(),
  },
  {
    id: "exp-03",
    boilerId: "blr-02",
    boilerModel: "Volta Steam G-5000",
    siteName: "GreenBio Bio-Refinery Unit 2",
    amount: 42000,
    category: "Biomass Fuel",
    description: "High-density wood pellet delivery 1.2 Tonnes",
    loggedBy: "Noah Bennett",
    date: "Today, 11:30 AM",
    timestamp: new Date().toISOString(),
  },
  {
    id: "exp-04",
    boilerId: "blr-02",
    boilerModel: "Volta Steam G-5000",
    siteName: "GreenBio Bio-Refinery Unit 2",
    amount: 21000,
    category: "Lubricants & Oils",
    description: "ID Fan high-temp grease replacement",
    loggedBy: "Noah Bennett",
    date: "Today, 09:20 AM",
    timestamp: new Date().toISOString(),
  },
  {
    id: "exp-05",
    boilerId: "blr-03",
    boilerModel: "Eco-Steam Pro 800kW",
    siteName: "Prime Mills - Boiler Bay C",
    amount: 25500,
    category: "Spare Parts",
    description: "Pressure gauge calibration & replacement dial",
    loggedBy: "Logan Pierce",
    date: "Today, 07:45 AM",
    timestamp: new Date().toISOString(),
  },
  {
    id: "exp-06",
    boilerId: "blr-04",
    boilerModel: "AquaSteam G-2500 Pack",
    siteName: "SunGlow Dairy & Beverage Plant",
    amount: 19500,
    category: "Biomass Fuel",
    description: "Agricultural pellets feed hopper load",
    loggedBy: "Mason Clarke",
    date: "Today, 09:10 AM",
    timestamp: new Date().toISOString(),
  },
  {
    id: "exp-07",
    boilerId: "blr-04",
    boilerModel: "AquaSteam G-2500 Pack",
    siteName: "SunGlow Dairy & Beverage Plant",
    amount: 9000,
    category: "Crew Allowance",
    description: "Shift overtime hot meal & tea allowance (3 operators)",
    loggedBy: "Mason Clarke",
    date: "Today, 11:05 AM",
    timestamp: new Date().toISOString(),
  },
  {
    id: "exp-08",
    boilerId: "blr-06",
    boilerModel: "Volta Steam Industrial 600",
    siteName: "Indus Wet Processing Zone",
    amount: 39000,
    category: "Biomass Fuel",
    description: "Dense cotton stalk briquette delivery batch B-12",
    loggedBy: "Elijah Brooks",
    date: "Today, 10:00 AM",
    timestamp: new Date().toISOString(),
  },
];

const INITIAL_WORK_ORDERS: DemoWorkOrder[] = [
  {
    id: "wo-101",
    code: "WO-2026-041",
    boilerId: "blr-03",
    boilerModel: "Eco-Steam Pro 800kW",
    siteName: "Prime Mills - Boiler Bay C",
    title: "Feedwater Multistage Pump Impeller Wear & Seal Replacement",
    category: "Emergency Breakdown",
    priority: "Emergency",
    status: "In Progress",
    assignedTech: "Logan Pierce",
    reportedDate: "2026-10-06",
    targetCompletionDate: "2026-10-08",
    description: "Feed pump P-101 pressure dropped from 14 bar to 6.2 bar. Cavitation suspected. Complete teardown and mechanical seal renewal required.",
    downtimeHours: 8.5,
    estimatedCost: 252000,
    partsUsed: "Grundfos CRN mechanical seal kit, silicon carbide bushing",
  },
  {
    id: "wo-102",
    code: "WO-2026-038",
    boilerId: "blr-03",
    boilerModel: "Eco-Steam Pro 800kW",
    siteName: "Prime Mills - Boiler Bay C",
    title: "Stoker Grate Bar Drive Bearing Alignment & Greasing",
    category: "Preventive",
    priority: "High",
    status: "Open",
    assignedTech: "Logan Pierce",
    reportedDate: "2026-10-05",
    targetCompletionDate: "2026-10-07",
    description: "Excessive vibration detected on bagasse feeder drive shaft. Replace pillow block bearings and align flexible coupling.",
    downtimeHours: 6.0,
    estimatedCost: 156000,
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
    estimatedCost: 87000,
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
    estimatedCost: 25500,
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
    code: "VEN-PAB-01",
    name: "Punjab Agro Biomass Energy Pvt Ltd",
    category: "Grade-A Biomass Pellets",
    contactPerson: "Chaudhry Tariq Gujjar (Managing Director)",
    phone: "+92 300 8472911",
    email: "dispatch@punjabagro-biomass.pk",
    address: "Plot 42-B, Industrial Estate, Sheikhupura Road",
    city: "Lahore",
    rating: 4.9,
    leadTimeDays: 2,
    status: "Preferred",
    paymentTerms: "Net 30 Days",
  },
  {
    id: "sup-02",
    code: "VEN-IAF-02",
    name: "Indus Agri-Fuels & Wood Waste Co.",
    category: "Cotton Stalk Briquettes",
    contactPerson: "Mian Imran Ashraf (Logistics Head)",
    phone: "+92 321 6654321",
    email: "sales@indusagrifuels.com.pk",
    address: "Jhang Bypass Road, Small Industrial Estate",
    city: "Faisalabad",
    rating: 4.8,
    leadTimeDays: 2,
    status: "Preferred",
    paymentTerms: "Net 15 Days",
  },
  {
    id: "sup-03",
    code: "VEN-CBE-03",
    name: "Chenab Bio-Energy Corp",
    category: "Wheat Straw & Husk Pellets",
    contactPerson: "Haji Mohammad Rafiq (Supply Lead)",
    phone: "+92 333 4455667",
    email: "supply@chenabbioenergy.pk",
    address: "G.T. Road, Small Industrial Zone",
    city: "Gujranwala",
    rating: 4.7,
    leadTimeDays: 3,
    status: "Approved",
    paymentTerms: "50% Advance & 50% Weighbridge",
  },
  {
    id: "sup-04",
    code: "VEN-KBP-04",
    name: "Kohinoor Bio-Power & Coal Suppliers",
    category: "Bio-Coal 70/30 Fuel Blend",
    contactPerson: "Engr. Naveed Akhtar (Technical Director)",
    phone: "+92 301 7788990",
    email: "orders@kohinoorbiopower.com",
    address: "Phase 2, Industrial Estate, Multan Road",
    city: "Multan",
    rating: 4.9,
    leadTimeDays: 4,
    status: "Approved",
    paymentTerms: "Net 30 Days",
  },
  {
    id: "sup-05",
    code: "VEN-MAB-05",
    name: "Mehran Agro Biomass Enterprises",
    category: "Sugarcane Bagasse Pellets",
    contactPerson: "Rasheed Memon (Chief Operations)",
    phone: "+92 302 3344556",
    email: "dispatch@mehranbiomass.com",
    address: "Kotri Industrial Area, Jamshoro",
    city: "Hyderabad",
    rating: 4.6,
    leadTimeDays: 5,
    status: "Approved",
    paymentTerms: "Net 15 Days",
  },
  {
    id: "sup-06",
    code: "VEN-NBM-06",
    name: "National Biomass & Briquetting Mills",
    category: "Hardwood & Rice Husk Pellets",
    contactPerson: "Malik Zafar Iqbal (Plant Head)",
    phone: "+92 300 1234567",
    email: "contact@nationalbiomass.pk",
    address: "Sahiwal Agro-Industrial Hub, Bypass Road",
    city: "Sahiwal",
    rating: 4.8,
    leadTimeDays: 3,
    status: "Preferred",
    paymentTerms: "Net 30 Days",
  },
];

const INITIAL_PURCHASE_ORDERS: DemoPurchaseOrder[] = [
  {
    id: "po-101",
    poNumber: "PO-2026-108",
    supplierId: "sup-01",
    supplierName: "Punjab Agro Biomass Energy Pvt Ltd",
    siteName: "Riverside Mill (RVR-01)",
    boilerId: "blr-01",
    boilerModel: "Thermax SteamMax 5T",
    issueDate: "2026-10-04",
    deliveryDate: "2026-10-07",
    items: [
      { description: "Grade-A Compressed Biomass Pellets (<8% moisture)", qty: 35, uom: "Tonnes", unitPrice: 28500, total: 997500, stockItemId: "inv-01", category: "Grade-A Biomass Pellets" },
      { description: "Dense Rice Husk Briquettes 90mm", qty: 15, uom: "Tonnes", unitPrice: 22000, total: 330000, stockItemId: "inv-02", category: "Rice Husk Briquettes" },
    ],
    totalAmount: 1327500,
    status: "In Transit",
    paymentTerms: "Net 30 Days",
  },
  {
    id: "po-102",
    poNumber: "PO-2026-109",
    supplierId: "sup-02",
    supplierName: "Indus Agri-Fuels & Wood Waste Co.",
    siteName: "Faisalabad Weaving Complex (FSD-02)",
    boilerId: "blr-02",
    boilerModel: "Volta Steam G-5000",
    issueDate: "2026-10-05",
    deliveryDate: "2026-10-08",
    items: [
      { description: "High-Calorific Cotton Stalk Briquettes", qty: 30, uom: "Tonnes", unitPrice: 24500, total: 735000, stockItemId: "inv-02", category: "Cotton Stalk Briquettes" },
      { description: "Sawdust Compressed Micro-Pellets", qty: 10, uom: "Tonnes", unitPrice: 27000, total: 270000, category: "Biomass Pellets" },
    ],
    totalAmount: 1005000,
    status: "Approved",
    paymentTerms: "Net 15 Days",
  },
  {
    id: "po-103",
    poNumber: "PO-2026-110",
    supplierId: "sup-03",
    supplierName: "Chenab Bio-Energy Corp",
    siteName: "Highland Biofuels Plant (HLD-03)",
    boilerId: "blr-03",
    boilerModel: "Babcock Wanson B-300",
    issueDate: "2026-10-02",
    deliveryDate: "2026-10-05",
    items: [
      { description: "Sun-Cured Wheat Straw & Agro Pellets", qty: 40, uom: "Tonnes", unitPrice: 21500, total: 860000, category: "Wheat Straw Pellets" },
    ],
    totalAmount: 860000,
    status: "Received & Verified",
    paymentTerms: "50% Advance & 50% Weighbridge",
  },
  {
    id: "po-104",
    poNumber: "PO-2026-111",
    supplierId: "sup-04",
    supplierName: "Kohinoor Bio-Power & Coal Suppliers",
    siteName: "Prime Cotton Spinning Mills (PCM-04)",
    boilerId: "blr-04",
    boilerModel: "Cleaver-Brooks CB-200",
    issueDate: "2026-10-03",
    deliveryDate: "2026-10-06",
    items: [
      { description: "Clean Bio-Coal 70/30 Fuel Blend (High GCV 5,100 kcal)", qty: 25, uom: "Tonnes", unitPrice: 34500, total: 862500, category: "Bio-Coal Blend" },
    ],
    totalAmount: 862500,
    status: "Received & Verified",
    paymentTerms: "Net 30 Days",
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
    tariffPerTon: 10950,
    fuelSurcharge: 375000,
    subtotal: 15929475,
    taxAmount: 2548716,
    totalAmount: 18478191,
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
    tariffPerTon: 10500,
    fuelSurcharge: 630000,
    subtotal: 23520000,
    taxAmount: 3763200,
    totalAmount: 27283200,
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
    tariffPerTon: 11400,
    fuelSurcharge: 285000,
    subtotal: 10431000,
    taxAmount: 1668960,
    totalAmount: 12099960,
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
    tariffPerTon: 12000,
    fuelSurcharge: 180000,
    subtotal: 9182400,
    taxAmount: 1469184,
    totalAmount: 10651584,
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
    unitCost: 28500,
    totalValue: 1382250,
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
    unitCost: 37500,
    totalValue: 825000,
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
    unitCost: 19500,
    totalValue: 702000,
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
    unitCost: 23400,
    totalValue: 187200,
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
    unitCost: 84000,
    totalValue: 336000,
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
    unitCost: 13500,
    totalValue: 27000,
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
    unitCost: 34500,
    totalValue: 241500,
    status: "Optimal",
  },
];

// Predefined Stock Categories
const INITIAL_STOCK_CATEGORIES: DemoStockCategory[] = [
  { id: "cat-01", name: "Biofuel Bulk", code: "BIO-BULK", description: "Solid biomass fuel including rice husk, wood pellets, bagasse, and briquettes", isPredefined: true },
  { id: "cat-02", name: "Water Chemicals", code: "WTR-CHEM", description: "Boiler feed treatment, scale inhibitors, oxygen scavengers, and resin", isPredefined: true },
  { id: "cat-03", name: "Mechanical Spares", code: "MECH-SPARE", description: "Pumps, impellers, stoker chain links, grate bars, and bearings", isPredefined: true },
  { id: "cat-04", name: "Valves & Controls", code: "VLV-CTRL", description: "Safety relief valves, blowdown valves, steam traps, and sight glasses", isPredefined: true },
  { id: "cat-05", name: "Sensors & Electrical", code: "ELEC-SENS", description: "PT100 RTD thermocouples, pressure transmitters, water level probes", isPredefined: true },
  { id: "cat-06", name: "Refractory & Piping", code: "REFR-PIPE", description: "High-alumina refractory fire bricks, insulating castables, ceramic ropes", isPredefined: true },
  { id: "cat-07", name: "Lubricants & Oils", code: "LUB-OIL", description: "High-temperature synthetic gear oils, bearing grease, stoker lube", isPredefined: true },
];

// Predefined Stock Units
const INITIAL_STOCK_UNITS: DemoStockUnit[] = [
  { id: "unit-01", name: "Tonnes", abbreviation: "Tonnes", type: "Weight", isPredefined: true },
  { id: "unit-02", name: "Kilograms", abbreviation: "kg", type: "Weight", isPredefined: true },
  { id: "unit-03", name: "Litres", abbreviation: "L", type: "Volume", isPredefined: true },
  { id: "unit-04", name: "25L Drums", abbreviation: "Drums", type: "Volume", isPredefined: true },
  { id: "unit-05", name: "50kg Bags", abbreviation: "Bags", type: "Weight", isPredefined: true },
  { id: "unit-06", name: "Units / Pieces", abbreviation: "Units", type: "Count", isPredefined: true },
  { id: "unit-07", name: "Gasket Sets", abbreviation: "Sets", type: "Count", isPredefined: true },
  { id: "unit-08", name: "Meters", abbreviation: "m", type: "Length", isPredefined: true },
];

// Initial Stock Movements (Stock In & Stock Out)
const INITIAL_STOCK_MOVEMENTS: DemoStockMovement[] = [
  {
    id: "sm-01",
    movementNumber: "SM-IN-2026-101",
    type: "STOCK_IN",
    itemId: "inv-01",
    itemSku: "SKU-FUEL-RH",
    itemName: "Rice Husk Biofuel Bulk (Grade A)",
    category: "Biofuel Bulk",
    quantity: 25.0,
    unit: "Tonnes",
    siteName: "Apex Textile Mills - Sector 4",
    reference: "PO-2026-108",
    vendorName: "Indus Agro Biofuels Corp",
    performedBy: "Tariq Mahmood (Supervisor)",
    date: "2026-10-06 09:30",
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
    balanceAfter: 48.5,
    notes: "Weighbridge gross verified with moisture <9.5%",
  },
  {
    id: "sm-02",
    movementNumber: "SM-OUT-2026-088",
    type: "STOCK_OUT",
    itemId: "inv-01",
    itemSku: "SKU-FUEL-RH",
    itemName: "Rice Husk Biofuel Bulk (Grade A)",
    category: "Biofuel Bulk",
    quantity: 5.2,
    unit: "Tonnes",
    siteName: "Apex Textile Mills - Sector 4",
    boilerId: "blr-01",
    boilerModel: "Thermax SteamMax 5T",
    reference: "Shift Consumption Day 06",
    issuedTo: "Liam Harper (Lead Operator)",
    performedBy: "Liam Harper",
    date: "2026-10-06 14:00",
    timestamp: new Date(Date.now() - 3600000 * 18).toISOString(),
    balanceAfter: 43.3,
    notes: "Issued directly to stoker feed bunker for morning & evening run",
  },
  {
    id: "sm-03",
    movementNumber: "SM-IN-2026-102",
    type: "STOCK_IN",
    itemId: "inv-03",
    itemSku: "SKU-CHEM-O2",
    itemName: "DEHA Oxygen Scavenger (25L Drum)",
    category: "Water Chemicals",
    quantity: 10,
    unit: "Drums",
    siteName: "GreenBio Bio-Refinery Unit 2",
    reference: "PO-2026-109",
    vendorName: "Apex Water Care Specialty Chemicals",
    performedBy: "Zubair Khan (Chemist)",
    date: "2026-10-05 11:15",
    timestamp: new Date(Date.now() - 3600000 * 48).toISOString(),
    balanceAfter: 36,
    notes: "Batch certificate of analysis checked. Purity compliant.",
  },
  {
    id: "sm-04",
    movementNumber: "SM-OUT-2026-089",
    type: "STOCK_OUT",
    itemId: "inv-05",
    itemSku: "SKU-VLV-DN50",
    itemName: "DN50 Class 300 Safety Relief Valve",
    category: "Mechanical Spares",
    quantity: 1,
    unit: "Units",
    siteName: "Sultan Tannery Boiler House",
    boilerId: "blr-08",
    boilerModel: "AquaSteam Rapid Steam 1500",
    reference: "WO-2026-035",
    issuedTo: "Oliver Hayes",
    performedBy: "Logan Pierce (Tech)",
    date: "2026-10-04 16:45",
    timestamp: new Date(Date.now() - 3600000 * 72).toISOString(),
    balanceAfter: 4,
    notes: "Dispatched to boiler room for inspectorate bench calibration replacement",
  },
  {
    id: "sm-05",
    movementNumber: "SM-OUT-2026-090",
    type: "STOCK_OUT",
    itemId: "inv-04",
    itemSku: "SKU-CHEM-PHOS",
    itemName: "Trisodium Phosphate Scale Inhibitor (50kg)",
    category: "Water Chemicals",
    quantity: 2,
    unit: "Bags",
    siteName: "Faisalabad Weaving Complex",
    boilerId: "blr-01",
    boilerModel: "Thermax SteamMax 5T",
    reference: "Shift Dosing Routine",
    issuedTo: "Ali Asghar",
    performedBy: "Tariq Mahmood",
    date: "2026-10-06 08:00",
    timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
    balanceAfter: 8,
    notes: "Mixed in dosing tank for chemical conditioning",
  },
];

// Initial Steam Records (Daily, Weekly, Monthly with 2 photos: Meter reading & Steam output)
const INITIAL_STEAM_RECORDS: DemoSteamRecord[] = [
  {
    id: "stm-01",
    recordNumber: "STM-2026-101",
    date: "2026-10-07",
    shift: "Morning (06:00 - 14:00)",
    boilerId: "blr-01",
    boilerModel: "Thermax SteamMax 5T",
    siteName: "Apex Textile Mills - Sector 4",
    meterReadingInitial: 14520.4,
    meterReadingFinal: 14558.9,
    steamGeneratedTons: 38.5,
    steamPressureBar: 8.4,
    steamTemperatureC: 172.5,
    fuelConsumedTons: 7.9,
    fuelType: "Biomass Briquettes (Cotton Stalk)",
    meterPhotoUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80",
    steamPhotoUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80",
    supervisorName: "Tariq Mahmood",
    foremanName: "Liam Harper",
    notes: "Steam flow rate steady at 4.8 t/h. Flue gas O2 stable at 4.2%.",
    timestamp: new Date().toISOString(),
  },
  {
    id: "stm-02",
    recordNumber: "STM-2026-100",
    date: "2026-10-06",
    shift: "Night (22:00 - 06:00)",
    boilerId: "blr-01",
    boilerModel: "Thermax SteamMax 5T",
    siteName: "Apex Textile Mills - Sector 4",
    meterReadingInitial: 14488.2,
    meterReadingFinal: 14520.4,
    steamGeneratedTons: 32.2,
    steamPressureBar: 8.2,
    steamTemperatureC: 171.0,
    fuelConsumedTons: 6.8,
    fuelType: "Biomass Briquettes (Cotton Stalk)",
    meterPhotoUrl: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80",
    steamPhotoUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80",
    supervisorName: "Tariq Mahmood",
    foremanName: "Ali Asghar",
    notes: "Night shift weaving plant load at 75%. Grate bar auto-stoker nominal.",
    timestamp: new Date(Date.now() - 3600000 * 14).toISOString(),
  },
  {
    id: "stm-03",
    recordNumber: "STM-2026-099",
    date: "2026-10-06",
    shift: "Evening (14:00 - 22:00)",
    boilerId: "blr-02",
    boilerModel: "Volta Steam G-5000",
    siteName: "GreenBio Bio-Refinery Unit 2",
    meterReadingInitial: 28410.0,
    meterReadingFinal: 28472.5,
    steamGeneratedTons: 62.5,
    steamPressureBar: 10.5,
    steamTemperatureC: 185.0,
    fuelConsumedTons: 11.2,
    fuelType: "Wood Pellets (Grade A)",
    meterPhotoUrl: "https://images.unsplash.com/photo-1618042164219-62c820f10723?w=800&auto=format&fit=crop&q=80",
    steamPhotoUrl: "https://images.unsplash.com/photo-1581092446327-9b52bd1570c2?w=800&auto=format&fit=crop&q=80",
    supervisorName: "Zubair Khan",
    foremanName: "Noah Bennett",
    notes: "High pressure steam delivery for ethanol distillation column. Excellent boiler efficiency.",
    timestamp: new Date(Date.now() - 3600000 * 22).toISOString(),
  },
  {
    id: "stm-04",
    recordNumber: "STM-2026-098",
    date: "2026-10-05",
    shift: "Morning (06:00 - 14:00)",
    boilerId: "blr-04",
    boilerModel: "AquaSteam G-2500 Pack",
    siteName: "SunGlow Dairy & Beverage Plant",
    meterReadingInitial: 9812.3,
    meterReadingFinal: 9831.5,
    steamGeneratedTons: 19.2,
    steamPressureBar: 6.8,
    steamTemperatureC: 164.0,
    fuelConsumedTons: 4.1,
    fuelType: "Agri-Biomass Pellets",
    meterPhotoUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80",
    steamPhotoUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80",
    supervisorName: "Mason Clarke",
    foremanName: "Farhan Saeed",
    notes: "Clean pasteurization steam cycles run between 09:00 and 13:00.",
    timestamp: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
  {
    id: "stm-05",
    recordNumber: "STM-2026-097",
    date: "2026-10-04",
    shift: "Morning (06:00 - 14:00)",
    boilerId: "blr-06",
    boilerModel: "Volta Steam Industrial 600",
    siteName: "Indus Wet Processing Zone",
    meterReadingInitial: 16540.0,
    meterReadingFinal: 16584.2,
    steamGeneratedTons: 44.2,
    steamPressureBar: 9.1,
    steamTemperatureC: 178.0,
    fuelConsumedTons: 8.9,
    fuelType: "Cotton Stalk Briquettes",
    meterPhotoUrl: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80",
    steamPhotoUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80",
    supervisorName: "Elijah Brooks",
    foremanName: "Bilal Warraich",
    notes: "Dyeing vats running at capacity. Continuous blowdown checked.",
    timestamp: new Date(Date.now() - 3600000 * 72).toISOString(),
  },
  {
    id: "stm-06",
    recordNumber: "STM-2026-096",
    date: "2026-10-03",
    shift: "Morning (06:00 - 14:00)",
    boilerId: "blr-07",
    boilerModel: "Eco-Steam High-Output 1200",
    siteName: "National Pharma Clean Steam Site",
    meterReadingInitial: 8120.0,
    meterReadingFinal: 8148.8,
    steamGeneratedTons: 28.8,
    steamPressureBar: 7.5,
    steamTemperatureC: 168.0,
    fuelConsumedTons: 5.6,
    fuelType: "White Biomass Pellets (Certified)",
    meterPhotoUrl: "https://images.unsplash.com/photo-1618042164219-62c820f10723?w=800&auto=format&fit=crop&q=80",
    steamPhotoUrl: "https://images.unsplash.com/photo-1581092446327-9b52bd1570c2?w=800&auto=format&fit=crop&q=80",
    supervisorName: "Jameson Cole",
    foremanName: "Jameson Cole",
    notes: "High purity steam autoclave cycles for vial sterilization complete.",
    timestamp: new Date(Date.now() - 3600000 * 96).toISOString(),
  },
  {
    id: "stm-07",
    recordNumber: "STM-2026-095",
    date: "2026-09-28",
    shift: "Morning (06:00 - 14:00)",
    boilerId: "blr-01",
    boilerModel: "Thermax SteamMax 5T",
    siteName: "Apex Textile Mills - Sector 4",
    meterReadingInitial: 14190.0,
    meterReadingFinal: 14227.0,
    steamGeneratedTons: 37.0,
    steamPressureBar: 8.5,
    steamTemperatureC: 173.0,
    fuelConsumedTons: 7.6,
    fuelType: "Biomass Briquettes (Cotton Stalk)",
    meterPhotoUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80",
    steamPhotoUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80",
    supervisorName: "Tariq Mahmood",
    foremanName: "Liam Harper",
    notes: "End of September baseline run.",
    timestamp: new Date(Date.now() - 3600000 * 220).toISOString(),
  },
];

// Initial Financial Vouchers (in PKR)
const INITIAL_VOUCHERS: DemoVoucher[] = [
  {
    id: "vch-01",
    voucherNumber: "VCH-2026-081",
    date: "2026-10-06",
    month: "October 2026",
    type: "Fuel Purchase Voucher",
    payee: "Indus Agro Biofuels Corp",
    amount: 712500,
    category: "Biomass Fuel",
    siteName: "Apex Textile Mills - Sector 4",
    boilerId: "blr-01",
    boilerModel: "Thermax SteamMax 5T",
    paymentMode: "Bank Transfer",
    referenceDoc: "PO-2026-108 / Weighbridge Slip #441",
    description: "Bulk Rice Husk delivery 25 Tonnes @ Rs. 28,500/Tonne",
    status: "Paid",
    approvedBy: "Farooq Ahmed (Director)",
    preparedBy: "Sarah Jenkins (Finance)",
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: "vch-02",
    voucherNumber: "VCH-2026-082",
    date: "2026-10-05",
    month: "October 2026",
    type: "Salary Voucher",
    payee: "Apex Mill Operating Crew (3 Staff)",
    amount: 555000,
    category: "Crew Allowance",
    siteName: "Apex Textile Mills - Sector 4",
    boilerId: "blr-01",
    boilerModel: "Thermax SteamMax 5T",
    paymentMode: "Bank Transfer",
    referenceDoc: "PAYROLL-2026-SEP-01",
    description: "Monthly operating shift wages for Lead Operator, Feeder & Supervisor",
    status: "Paid",
    approvedBy: "Farooq Ahmed (Director)",
    preparedBy: "Sarah Jenkins (Finance)",
    timestamp: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
  {
    id: "vch-03",
    voucherNumber: "VCH-2026-083",
    date: "2026-10-04",
    month: "October 2026",
    type: "Payment Voucher",
    payee: "Crescent Valves & Steam Fittings Ltd",
    amount: 234000,
    category: "Spare Parts",
    siteName: "Apex Textile Mills - Sector 4",
    boilerId: "blr-01",
    boilerModel: "Thermax SteamMax 5T",
    paymentMode: "Cheque",
    referenceDoc: "PO-2026-110",
    description: "DN50 Safety Relief Valves and High-Temp Flange Gaskets",
    status: "Approved",
    approvedBy: "Zubair Khan (Plant Manager)",
    preparedBy: "Sarah Jenkins (Finance)",
    timestamp: new Date(Date.now() - 3600000 * 72).toISOString(),
  },
  {
    id: "vch-04",
    voucherNumber: "VCH-2026-084",
    date: "2026-10-03",
    month: "October 2026",
    type: "Payment Voucher",
    payee: "Apex Water Care Specialty Chemicals",
    amount: 283500,
    category: "Water Treatment",
    siteName: "GreenBio Bio-Refinery Unit 2",
    boilerId: "blr-02",
    boilerModel: "Volta Steam G-5000",
    paymentMode: "Bank Transfer",
    referenceDoc: "PO-2026-109",
    description: "Oxygen Scavengers DEHA (8 Drums) and Sludge Conditioner",
    status: "Paid",
    approvedBy: "Farooq Ahmed (Director)",
    preparedBy: "Sarah Jenkins (Finance)",
    timestamp: new Date(Date.now() - 3600000 * 96).toISOString(),
  },
  {
    id: "vch-05",
    voucherNumber: "VCH-2026-085",
    date: "2026-10-02",
    month: "October 2026",
    type: "Cash Voucher",
    payee: "Tariq Mahmood (Site Supervisor)",
    amount: 150000,
    category: "General Running",
    siteName: "Apex Textile Mills - Sector 4",
    boilerId: "blr-01",
    boilerModel: "Thermax SteamMax 5T",
    paymentMode: "Petty Cash Float",
    referenceDoc: "FLOAT-REQ-042",
    description: "Site petty cash replenishment for local lubricants, tea allowance and diesel for backup generator",
    status: "Paid",
    approvedBy: "Zubair Khan (Plant Manager)",
    preparedBy: "Tariq Mahmood",
    timestamp: new Date(Date.now() - 3600000 * 120).toISOString(),
  },
  {
    id: "vch-06",
    voucherNumber: "VCH-2026-086",
    date: "2026-09-30",
    month: "September 2026",
    type: "Salary Voucher",
    payee: "GreenBio Plant Operating Crew (2 Staff)",
    amount: 426000,
    category: "Crew Allowance",
    siteName: "GreenBio Bio-Refinery Unit 2",
    boilerId: "blr-02",
    boilerModel: "Volta Steam G-5000",
    paymentMode: "Bank Transfer",
    referenceDoc: "PAYROLL-2026-SEP-02",
    description: "September month wages for Noah Bennett and Zubair Khan",
    status: "Paid",
    approvedBy: "Farooq Ahmed (Director)",
    preparedBy: "Sarah Jenkins (Finance)",
    timestamp: new Date(Date.now() - 3600000 * 180).toISOString(),
  },
];

// Initial Staff Salaries (in PKR)
const INITIAL_SALARIES: DemoStaffSalary[] = [
  {
    id: "sal-01",
    month: "October 2026",
    workerId: "emp-01",
    workerName: "Liam Harper",
    workerCode: "EMP-101",
    role: "Lead Boiler Operator",
    siteName: "Apex Textile Mills - Sector 4",
    boilerModel: "Thermax SteamMax 5T",
    dailyWageAmount: 3500,
    shiftsWorked: 26,
    baseAmount: 91000,
    overtimeBonus: 12000,
    deductions: 0,
    netPayable: 103000,
    status: "Approved",
    voucherNumber: "VCH-2026-082",
    disbursedDate: "2026-10-05",
  },
  {
    id: "sal-02",
    month: "October 2026",
    workerId: "emp-02",
    workerName: "Ali Asghar",
    workerCode: "EMP-102",
    role: "Biomass Fuel Feeder",
    siteName: "Apex Textile Mills - Sector 4",
    boilerModel: "Thermax SteamMax 5T",
    dailyWageAmount: 2800,
    shiftsWorked: 26,
    baseAmount: 72800,
    overtimeBonus: 8500,
    deductions: 0,
    netPayable: 81300,
    status: "Approved",
    voucherNumber: "VCH-2026-082",
    disbursedDate: "2026-10-05",
  },
  {
    id: "sal-03",
    month: "October 2026",
    workerId: "emp-05",
    workerName: "Tariq Mahmood",
    workerCode: "EMP-105",
    role: "Shift Supervisor",
    siteName: "Apex Textile Mills - Sector 4",
    boilerModel: "Thermax SteamMax 5T",
    dailyWageAmount: 4500,
    shiftsWorked: 26,
    baseAmount: 117000,
    overtimeBonus: 15000,
    deductions: 0,
    netPayable: 132000,
    status: "Approved",
    voucherNumber: "VCH-2026-082",
    disbursedDate: "2026-10-05",
  },
  {
    id: "sal-04",
    month: "October 2026",
    workerId: "emp-03",
    workerName: "Noah Bennett",
    workerCode: "EMP-103",
    role: "Lead Boiler Operator",
    siteName: "GreenBio Bio-Refinery Unit 2",
    boilerModel: "Volta Steam G-5000",
    dailyWageAmount: 3600,
    shiftsWorked: 25,
    baseAmount: 90000,
    overtimeBonus: 9500,
    deductions: 0,
    netPayable: 99500,
    status: "Approved",
  },
  {
    id: "sal-05",
    month: "October 2026",
    workerId: "emp-04",
    workerName: "Zubair Khan",
    workerCode: "EMP-104",
    role: "Water Treatment Tech",
    siteName: "GreenBio Bio-Refinery Unit 2",
    boilerModel: "Volta Steam G-5000",
    dailyWageAmount: 3200,
    shiftsWorked: 26,
    baseAmount: 83200,
    overtimeBonus: 7000,
    deductions: 0,
    netPayable: 90200,
    status: "Approved",
  },
  {
    id: "sal-06",
    month: "October 2026",
    workerId: "emp-06",
    workerName: "Logan Pierce",
    workerCode: "EMP-106",
    role: "Maintenance Specialist",
    siteName: "Prime Mills - Boiler Bay C",
    boilerModel: "Eco-Steam Pro 800kW",
    dailyWageAmount: 3800,
    shiftsWorked: 24,
    baseAmount: 91200,
    overtimeBonus: 14000,
    deductions: 0,
    netPayable: 105200,
    status: "Pending",
  },
  {
    id: "sal-07",
    month: "October 2026",
    workerId: "emp-07",
    workerName: "Mason Clarke",
    role: "Lead Boiler Operator",
    workerCode: "EMP-107",
    siteName: "SunGlow Dairy & Beverage Plant",
    boilerModel: "AquaSteam G-2500 Pack",
    dailyWageAmount: 3400,
    shiftsWorked: 26,
    baseAmount: 88400,
    overtimeBonus: 6000,
    deductions: 0,
    netPayable: 94400,
    status: "Pending",
  },
  {
    id: "sal-08",
    month: "October 2026",
    workerId: "emp-10",
    workerName: "Elijah Brooks",
    workerCode: "EMP-110",
    role: "Lead Boiler Operator",
    siteName: "Indus Wet Processing Zone",
    boilerModel: "Volta Steam Industrial 600",
    dailyWageAmount: 3600,
    shiftsWorked: 26,
    baseAmount: 93600,
    overtimeBonus: 11000,
    deductions: 0,
    netPayable: 104600,
    status: "Pending",
  },
];

// Initial Month-End Fuel Reconciliation
const INITIAL_MONTH_END: DemoMonthEndReconciliation[] = [
  {
    id: "rec-01",
    code: "REC-2026-SEP-APX",
    month: "September 2026",
    date: "2026-09-30",
    siteName: "Apex Textile Mills - Sector 4",
    boilerModel: "Thermax SteamMax 5T",
    fuelType: "Rice Husk Bulk (Grade A)",
    unit: "Tonnes",
    openingStock: 35.0,
    receivedStock: 120.0,
    consumedStock: 107.5,
    bookClosingStock: 47.5,
    physicalDipStock: 46.8,
    varianceQuantity: -0.7,
    variancePercentage: -1.47,
    varianceReason: "Normal handling loss and silo ambient moisture loss (<2.0% allowable)",
    supervisorName: "Tariq Mahmood",
    foremanName: "Liam Harper",
    status: "Reconciled",
    signedOffDate: "2026-10-01",
  },
  {
    id: "rec-02",
    code: "REC-2026-SEP-GBIO",
    month: "September 2026",
    date: "2026-09-30",
    siteName: "GreenBio Bio-Refinery Unit 2",
    boilerModel: "Volta Steam G-5000",
    fuelType: "Wood Pellets (Grade A)",
    unit: "Tonnes",
    openingStock: 28.0,
    receivedStock: 180.0,
    consumedStock: 186.0,
    bookClosingStock: 22.0,
    physicalDipStock: 21.6,
    varianceQuantity: -0.4,
    variancePercentage: -1.82,
    varianceReason: "Enclosed silo storage. High correlation with automated weigh-feeder.",
    supervisorName: "Zubair Khan",
    foremanName: "Noah Bennett",
    status: "Reconciled",
    signedOffDate: "2026-10-01",
  },
  {
    id: "rec-03",
    code: "REC-2026-SEP-PRM",
    month: "September 2026",
    date: "2026-09-30",
    siteName: "Prime Mills - Boiler Bay C",
    boilerModel: "Eco-Steam Pro 800kW",
    fuelType: "Bagasse & Agricultural Pellets",
    unit: "Tonnes",
    openingStock: 42.0,
    receivedStock: 65.0,
    consumedStock: 74.0,
    bookClosingStock: 33.0,
    physicalDipStock: 32.2,
    varianceQuantity: -0.8,
    variancePercentage: -2.42,
    varianceReason: "Open yard bagasse storage affected by rain moisture fluctuation.",
    supervisorName: "Logan Pierce",
    foremanName: "Logan Pierce",
    status: "Reconciled",
    signedOffDate: "2026-10-02",
  },
  {
    id: "rec-04",
    code: "REC-2026-OCT-APX",
    month: "October 2026 (Mid-Month Check)",
    date: "2026-10-06",
    siteName: "Apex Textile Mills - Sector 4",
    boilerModel: "Thermax SteamMax 5T",
    fuelType: "Rice Husk Bulk (Grade A)",
    unit: "Tonnes",
    openingStock: 46.8,
    receivedStock: 25.0,
    consumedStock: 23.3,
    bookClosingStock: 48.5,
    physicalDipStock: 48.5,
    varianceQuantity: 0.0,
    variancePercentage: 0.0,
    varianceReason: "Mid-month physical dip matched book balance exactly.",
    supervisorName: "Tariq Mahmood",
    foremanName: "Liam Harper",
    status: "Reconciled",
    signedOffDate: "2026-10-06",
  },
];

// Initial User Accounts
const INITIAL_USERS: DemoUserAccount[] = [
  {
    id: "usr-01",
    name: "Farooq Ahmed",
    email: "farooq.ahmed@stokerboilers.com",
    role: "Super Admin",
    assignedSite: "Headquarters & Global Fleet",
    phone: "+92 300 1122334",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    status: "Active",
  },
  {
    id: "usr-02",
    name: "Sarah Jenkins",
    email: "sarah.jenkins@stokerboilers.com",
    role: "Accounts & Finance",
    assignedSite: "Corporate Finance Desk",
    phone: "+92 321 8899776",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
    status: "Active",
  },
  {
    id: "usr-03",
    name: "Tariq Mahmood",
    email: "tariq.mahmood@stokerboilers.com",
    role: "Site Supervisor",
    assignedSite: "Apex Textile Mills - Sector 4",
    assignedBoilerId: "blr-01",
    assignedBoilerModel: "Thermax SteamMax 5T",
    phone: "+92 300 1234567",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80",
    status: "Active",
  },
  {
    id: "usr-04",
    name: "Zubair Khan",
    email: "zubair.khan@stokerboilers.com",
    role: "Plant Manager",
    assignedSite: "GreenBio Bio-Refinery Unit 2",
    assignedBoilerId: "blr-02",
    assignedBoilerModel: "Volta Steam G-5000",
    phone: "+92 333 5551212",
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&auto=format&fit=crop&q=80",
    status: "Active",
  },
  {
    id: "usr-05",
    name: "Liam Harper",
    email: "liam.harper@stokerboilers.com",
    role: "Boiler Foreman",
    assignedSite: "Apex Textile Mills - Sector 4",
    assignedBoilerId: "blr-01",
    assignedBoilerModel: "Thermax SteamMax 5T",
    phone: "+92 300 8472911",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    status: "Active",
  },
  {
    id: "usr-06",
    name: "Oliver Hayes",
    email: "oliver.hayes@stokerboilers.com",
    role: "Boiler Foreman",
    assignedSite: "Sultan Tannery Boiler House",
    assignedBoilerId: "blr-08",
    assignedBoilerModel: "AquaSteam Rapid Steam 1500",
    phone: "+92 318 4433221",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
    status: "Active",
  },
];

// Initial Role Permissions Matrix
const INITIAL_ROLE_PERMISSIONS: Record<string, DemoRolePermissions> = {
  "Super Admin": {
    boilers: { view: true, manage: true },
    steam: { view: true, log: true, approve: true },
    inventory: { view: true, stockInOut: true, manageItems: true },
    procurement: { view: true, createPO: true, manageVendors: true },
    expenses: { view: true, logExpense: true, manageVouchers: true },
    salaries: { view: true, processPayroll: true },
    settings: { view: true, editSettings: true, manageUsers: true },
  },
  "Plant Manager": {
    boilers: { view: true, manage: true },
    steam: { view: true, log: true, approve: true },
    inventory: { view: true, stockInOut: true, manageItems: true },
    procurement: { view: true, createPO: true, manageVendors: true },
    expenses: { view: true, logExpense: true, manageVouchers: true },
    salaries: { view: true, processPayroll: true },
    settings: { view: true, editSettings: false, manageUsers: false },
  },
  "Site Supervisor": {
    boilers: { view: true, manage: true },
    steam: { view: true, log: true, approve: true },
    inventory: { view: true, stockInOut: true, manageItems: true },
    procurement: { view: true, createPO: false, manageVendors: false },
    expenses: { view: true, logExpense: true, manageVouchers: false },
    salaries: { view: true, processPayroll: false },
    settings: { view: true, editSettings: false, manageUsers: false },
  },
  "Boiler Foreman": {
    boilers: { view: true, manage: false },
    steam: { view: true, log: true, approve: false },
    inventory: { view: true, stockInOut: true, manageItems: false },
    procurement: { view: true, createPO: false, manageVendors: false },
    expenses: { view: true, logExpense: true, manageVouchers: false },
    salaries: { view: false, processPayroll: false },
    settings: { view: false, editSettings: false, manageUsers: false },
  },
  "Accounts & Finance": {
    boilers: { view: true, manage: false },
    steam: { view: true, log: false, approve: false },
    inventory: { view: true, stockInOut: false, manageItems: false },
    procurement: { view: true, createPO: true, manageVendors: true },
    expenses: { view: true, logExpense: true, manageVouchers: true },
    salaries: { view: true, processPayroll: true },
    settings: { view: true, editSettings: true, manageUsers: false },
  },
};


const INITIAL_FUEL_DISPATCHES: DemoFuelDispatch[] = [
  {
    id: "disp-01",
    dispatchNo: "DSP-2026-081",
    vendorId: "sup-01",
    vendorName: "Punjab Agro Biomass Energy Pvt Ltd",
    fuelType: "Grade-A Biomass Pellets",
    targetSite: "Riverside Mill (RVR-01)",
    boilerId: "blr-01",
    boilerModel: "Thermax SteamMax 5T",
    vehicleNo: "LES-9921 (Hino 500)",
    driverName: "Rasheed Ahmed",
    driverPhone: "+92 300 7861122",
    dispatchedTons: 32.5,
    receivedTons: 32.1,
    varianceTons: -0.4,
    variancePct: -1.2,
    ratePerTon: 28500,
    totalCostPkr: 914850,
    dispatchDate: "2026-10-05",
    deliveryDate: "2026-10-06",
    status: "Delivered & Verified",
    weighbridgeSlipPhotoUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop&q=80",
    moisturePct: 8.4,
    gcvKcalPerKg: 4250,
  },
  {
    id: "disp-02",
    dispatchNo: "DSP-2026-082",
    vendorId: "sup-02",
    vendorName: "Indus Agri-Fuels & Wood Waste Co.",
    fuelType: "Cotton Stalk Briquettes",
    targetSite: "Faisalabad Weaving Complex (FSD-02)",
    boilerId: "blr-02",
    boilerModel: "Volta Steam G-5000",
    vehicleNo: "FD-4410 (Bedford Heavy)",
    driverName: "Gulzar Hussain",
    driverPhone: "+92 321 4455889",
    dispatchedTons: 28.0,
    receivedTons: 27.6,
    varianceTons: -0.4,
    variancePct: -1.4,
    ratePerTon: 24500,
    totalCostPkr: 676200,
    dispatchDate: "2026-10-05",
    deliveryDate: "2026-10-06",
    status: "Delivered & Verified",
    weighbridgeSlipPhotoUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80",
    moisturePct: 9.1,
    gcvKcalPerKg: 3980,
  },
  {
    id: "disp-03",
    dispatchNo: "DSP-2026-083",
    vendorId: "sup-03",
    vendorName: "Chenab Bio-Energy Corp",
    fuelType: "Wheat Straw & Husk Pellets",
    targetSite: "Highland Biofuels Plant (HLD-03)",
    boilerId: "blr-03",
    boilerModel: "Babcock Wanson B-300",
    vehicleNo: "GA-8822 (Isuzu Forward)",
    driverName: "Tariq Mahmood",
    driverPhone: "+92 333 5522114",
    dispatchedTons: 35.0,
    receivedTons: 34.5,
    varianceTons: -0.5,
    variancePct: -1.4,
    ratePerTon: 21500,
    totalCostPkr: 741750,
    dispatchDate: "2026-10-04",
    deliveryDate: "2026-10-05",
    status: "Delivered & Verified",
    weighbridgeSlipPhotoUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80",
    moisturePct: 7.8,
    gcvKcalPerKg: 3850,
  },
  {
    id: "disp-04",
    dispatchNo: "DSP-2026-084",
    vendorId: "sup-04",
    vendorName: "Kohinoor Bio-Power & Coal Suppliers",
    fuelType: "Bio-Coal 70/30 Fuel Blend",
    targetSite: "Prime Cotton Spinning Mills (PCM-04)",
    boilerId: "blr-04",
    boilerModel: "Cleaver-Brooks CB-200",
    vehicleNo: "MN-1290 (Master Super)",
    driverName: "Zubair Khan",
    driverPhone: "+92 301 9911223",
    dispatchedTons: 25.0,
    receivedTons: 24.8,
    varianceTons: -0.2,
    variancePct: -0.8,
    ratePerTon: 34500,
    totalCostPkr: 855600,
    dispatchDate: "2026-10-04",
    deliveryDate: "2026-10-05",
    status: "Delivered & Verified",
    weighbridgeSlipPhotoUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80",
    moisturePct: 6.2,
    gcvKcalPerKg: 5100,
  },
  {
    id: "disp-05",
    dispatchNo: "DSP-2026-085",
    vendorId: "sup-01",
    vendorName: "Punjab Agro Biomass Energy Pvt Ltd",
    fuelType: "Grade-A Biomass Pellets",
    targetSite: "Riverside Mill (RVR-01)",
    boilerId: "blr-01",
    boilerModel: "Thermax SteamMax 5T",
    vehicleNo: "LES-9921 (Hino 500)",
    driverName: "Rasheed Ahmed",
    driverPhone: "+92 300 7861122",
    dispatchedTons: 30.0,
    receivedTons: 29.8,
    varianceTons: -0.2,
    variancePct: -0.7,
    ratePerTon: 28500,
    totalCostPkr: 849300,
    dispatchDate: "2026-10-03",
    deliveryDate: "2026-10-04",
    status: "Delivered & Verified",
    weighbridgeSlipPhotoUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop&q=80",
    moisturePct: 8.1,
    gcvKcalPerKg: 4280,
  },
  {
    id: "disp-06",
    dispatchNo: "DSP-2026-086",
    vendorId: "sup-06",
    vendorName: "National Biomass & Briquetting Mills",
    fuelType: "Hardwood & Rice Husk Pellets",
    targetSite: "Highland Biofuels Plant (HLD-03)",
    boilerId: "blr-03",
    boilerModel: "Babcock Wanson B-300",
    vehicleNo: "SL-5510 (Hino Ranger)",
    driverName: "Altaf Hussain",
    driverPhone: "+92 304 6622119",
    dispatchedTons: 26.0,
    receivedTons: 25.7,
    varianceTons: -0.3,
    variancePct: -1.1,
    ratePerTon: 26000,
    totalCostPkr: 668200,
    dispatchDate: "2026-10-03",
    deliveryDate: "2026-10-04",
    status: "Delivered & Verified",
    weighbridgeSlipPhotoUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80",
    moisturePct: 8.5,
    gcvKcalPerKg: 4100,
  },
  {
    id: "disp-07",
    dispatchNo: "DSP-2026-087",
    vendorId: "sup-05",
    vendorName: "Mehran Agro Biomass Enterprises",
    fuelType: "Sugarcane Bagasse Pellets",
    targetSite: "Faisalabad Weaving Complex (FSD-02)",
    boilerId: "blr-02",
    boilerModel: "Volta Steam G-5000",
    vehicleNo: "FD-4410 (Bedford Heavy)",
    driverName: "Gulzar Hussain",
    driverPhone: "+92 321 4455889",
    dispatchedTons: 32.0,
    receivedTons: 31.4,
    varianceTons: -0.6,
    variancePct: -1.9,
    ratePerTon: 19500,
    totalCostPkr: 612300,
    dispatchDate: "2026-10-02",
    deliveryDate: "2026-10-03",
    status: "Delivered & Verified",
    weighbridgeSlipPhotoUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80",
    moisturePct: 9.8,
    gcvKcalPerKg: 3750,
  },
  {
    id: "disp-08",
    dispatchNo: "DSP-2026-088",
    vendorId: "sup-01",
    vendorName: "Punjab Agro Biomass Energy Pvt Ltd",
    fuelType: "Grade-A Biomass Pellets",
    targetSite: "Riverside Mill (RVR-01)",
    boilerId: "blr-01",
    boilerModel: "Thermax SteamMax 5T",
    vehicleNo: "LES-9921 (Hino 500)",
    driverName: "Rasheed Ahmed",
    driverPhone: "+92 300 7861122",
    dispatchedTons: 20.0,
    receivedTons: 0,
    varianceTons: 0,
    variancePct: 0,
    ratePerTon: 28500,
    totalCostPkr: 570000,
    dispatchDate: "2026-10-07",
    deliveryDate: "2026-10-08",
    status: "In Transit",
    weighbridgeSlipPhotoUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop&q=80",
    moisturePct: 8.2,
    gcvKcalPerKg: 4250,
  },
];


const INITIAL_LEDGER_ACCOUNTS: DemoLedgerAccount[] = [
  { code: "1010", name: "Habib Bank Ltd (Main Operating A/C)", type: "Asset", category: "Current Assets", balance: 14850000, normalBalance: "Debit", description: "Primary centralized treasury and vendor disbursements" },
  { code: "1020", name: "Petty Cash Float - Riverside Mill (RVR)", type: "Asset", category: "Current Assets", balance: 127500, normalBalance: "Debit", description: "Stationed supervisor Tariq Mahmood float custody" },
  { code: "1021", name: "Petty Cash Float - Faisalabad (FSD)", type: "Asset", category: "Current Assets", balance: 135000, normalBalance: "Debit", description: "Stationed supervisor Ali Asghar float custody" },
  { code: "1050", name: "Raw Biomass Fuel Stock Inventory", type: "Asset", category: "Current Assets", balance: 4132500, normalBalance: "Debit", description: "Central and site silo reserves (Tonnage @ landed cost)" },
  { code: "1060", name: "Water Chemicals & Mechanical Spares", type: "Asset", category: "Current Assets", balance: 845000, normalBalance: "Debit", description: "Descalers, salt bags, safety valves, gaskets" },
  { code: "2010", name: "Accounts Payable - Fuel Vendors", type: "Liability", category: "Current Liabilities", balance: 3412000, normalBalance: "Credit", description: "Unsettled fuel invoices (Punjab Agro, Indus Agri, etc.)" },
  { code: "2020", name: "Accrued Workforce Salaries & Wages", type: "Liability", category: "Current Liabilities", balance: 218000, normalBalance: "Credit", description: "Monthly staff payroll payables awaiting bank transfer" },
  { code: "3010", name: "Owner / Shareholder Equity Capital", type: "Equity", category: "Equity", balance: 12000000, normalBalance: "Credit", description: "Stoker Boilers Fleet initial commercial equity" },
  { code: "3020", name: "Retained Operational Earnings", type: "Equity", category: "Equity", balance: 4460000, normalBalance: "Credit", description: "Accumulated commercial earnings" },
  { code: "4010", name: "Commercial High-Pressure Steam Revenue", type: "Revenue", category: "Operating Revenue", balance: 18478191, normalBalance: "Credit", description: "Billed steam deliveries to industrial clients" },
  { code: "5010", name: "Boiler Fuel Combustion & Biomass Expense", type: "Expense", category: "Direct Operating Cost", balance: 12450000, normalBalance: "Debit", description: "Direct biomass consumed during steam production" },
  { code: "5020", name: "Boiler Station Crew Wages & Overtime", type: "Expense", category: "Direct Operating Cost", balance: 1840000, normalBalance: "Debit", description: "Lead operators, fuel feeders, water lab techs" },
  { code: "5030", name: "Water Treatment Softener & Descaling", type: "Expense", category: "Direct Operating Cost", balance: 520000, normalBalance: "Debit", description: "Chemical dosing and blowdown treatments" },
  { code: "5040", name: "Plant Repair & Preventive Maintenance", type: "Expense", category: "Operating Expense", balance: 642000, normalBalance: "Debit", description: "Valves, seals, refractories, electrical overhauls" },
];

const INITIAL_JOURNAL_ENTRIES: DemoJournalEntry[] = [
  {
    id: "je-01",
    entryNo: "JV-2026-00108",
    date: "2026-10-06",
    sourceDoc: "Fuel Dispatch #DSP-2026-081",
    sourceType: "Fuel Delivery",
    narration: "Biomass delivery received from Punjab Agro (32.1t @ Rs. 28,500/t) at Riverside Mill",
    debitAccountCode: "1050",
    debitAccountName: "Raw Biomass Fuel Stock Inventory",
    debitAmount: 914850,
    creditAccountCode: "2010",
    creditAccountName: "Accounts Payable - Fuel Vendors",
    creditAmount: 914850,
    postedBy: "Murtaza Ali (Finance Lead)",
    approvedBy: "Chaudhry Tariq (Super Admin)",
    status: "Posted & Balanced",
    timestamp: "2026-10-06 14:45",
  },
  {
    id: "je-02",
    entryNo: "JV-2026-00107",
    date: "2026-10-06",
    sourceDoc: "Fuel Dispatch #DSP-2026-082",
    sourceType: "Fuel Delivery",
    narration: "Cotton stalk briquettes received from Indus Agri-Fuels (27.6t @ Rs. 24,500/t) at FSD",
    debitAccountCode: "1050",
    debitAccountName: "Raw Biomass Fuel Stock Inventory",
    debitAmount: 676200,
    creditAccountCode: "2010",
    creditAccountName: "Accounts Payable - Fuel Vendors",
    creditAmount: 676200,
    postedBy: "Murtaza Ali (Finance Lead)",
    approvedBy: "Chaudhry Tariq (Super Admin)",
    status: "Posted & Balanced",
    timestamp: "2026-10-06 11:20",
  },
  {
    id: "je-03",
    entryNo: "JV-2026-00106",
    date: "2026-10-05",
    sourceDoc: "Payment Voucher #VCH-2026-091",
    sourceType: "General Voucher",
    narration: "HBL Bank transfer settlement to Punjab Agro for September fuel dispatches",
    debitAccountCode: "2010",
    debitAccountName: "Accounts Payable - Fuel Vendors",
    debitAmount: 712500,
    creditAccountCode: "1010",
    creditAccountName: "Habib Bank Ltd (Main Operating A/C)",
    creditAmount: 712500,
    postedBy: "Murtaza Ali (Finance Lead)",
    approvedBy: "Chaudhry Tariq (Super Admin)",
    status: "Posted & Balanced",
    timestamp: "2026-10-05 16:30",
  },
  {
    id: "je-04",
    entryNo: "JV-2026-00105",
    date: "2026-10-05",
    sourceDoc: "Monthly Payroll #SAL-2026-09",
    sourceType: "Payroll Disbursement",
    narration: "Disbursed monthly wages for 6 boiler operators and shift crew",
    debitAccountCode: "5020",
    debitAccountName: "Boiler Station Crew Wages & Overtime",
    debitAmount: 588200,
    creditAccountCode: "1010",
    creditAccountName: "Habib Bank Ltd (Main Operating A/C)",
    creditAmount: 588200,
    postedBy: "Murtaza Ali (Finance Lead)",
    approvedBy: "Chaudhry Tariq (Super Admin)",
    status: "Posted & Balanced",
    timestamp: "2026-10-05 15:00",
  },
  {
    id: "je-05",
    entryNo: "JV-2026-00104",
    date: "2026-10-04",
    sourceDoc: "Fuel Dispatch #DSP-2026-083",
    sourceType: "Fuel Delivery",
    narration: "Wheat straw pellets delivery from Chenab Bio-Energy (34.5t @ Rs. 21,500/t) at HLD",
    debitAccountCode: "1050",
    debitAccountName: "Raw Biomass Fuel Stock Inventory",
    debitAmount: 741750,
    creditAccountCode: "2010",
    creditAccountName: "Accounts Payable - Fuel Vendors",
    creditAmount: 741750,
    postedBy: "Murtaza Ali (Finance Lead)",
    approvedBy: "Chaudhry Tariq (Super Admin)",
    status: "Posted & Balanced",
    timestamp: "2026-10-04 17:15",
  },
  {
    id: "je-06",
    entryNo: "JV-2026-00103",
    date: "2026-10-04",
    sourceDoc: "Fuel Dispatch #DSP-2026-084",
    sourceType: "Fuel Delivery",
    narration: "Bio-coal blend from Kohinoor Bio-Power (24.8t @ Rs. 34,500/t) at Prime Cotton",
    debitAccountCode: "1050",
    debitAccountName: "Raw Biomass Fuel Stock Inventory",
    debitAmount: 855600,
    creditAccountCode: "2010",
    creditAccountName: "Accounts Payable - Fuel Vendors",
    creditAmount: 855600,
    postedBy: "Murtaza Ali (Finance Lead)",
    approvedBy: "Chaudhry Tariq (Super Admin)",
    status: "Posted & Balanced",
    timestamp: "2026-10-04 12:40",
  },
  {
    id: "je-07",
    entryNo: "JV-2026-00102",
    date: "2026-10-03",
    sourceDoc: "Expense #EXP-0991",
    sourceType: "Maintenance PO",
    narration: "Replaced high-pressure steam relief valve gasket and flange seals",
    debitAccountCode: "5040",
    debitAccountName: "Plant Repair & Preventive Maintenance",
    debitAmount: 22500,
    creditAccountCode: "1020",
    creditAccountName: "Petty Cash Float - Riverside Mill (RVR)",
    creditAmount: 22500,
    postedBy: "Tariq Mahmood (Supervisor)",
    approvedBy: "Murtaza Ali (Finance Lead)",
    status: "Posted & Balanced",
    timestamp: "2026-10-03 14:10",
  },
  {
    id: "je-08",
    entryNo: "JV-2026-00101",
    date: "2026-10-02",
    sourceDoc: "Invoice #INV-STM-2026-091",
    sourceType: "Steam Invoice",
    narration: "Commercial steam sales invoice billed to Apex Textiles for September production",
    debitAccountCode: "1010",
    debitAccountName: "Habib Bank Ltd (Main Operating A/C)",
    debitAmount: 18478191,
    creditAccountCode: "4010",
    creditAccountName: "Commercial High-Pressure Steam Revenue",
    creditAmount: 18478191,
    postedBy: "Murtaza Ali (Finance Lead)",
    approvedBy: "Chaudhry Tariq (Super Admin)",
    status: "Posted & Balanced",
    timestamp: "2026-10-02 09:30",
  },
];

const STORAGE_KEYS = {
  BOILERS: "stoker_demo_boilers_pkr_v1",
  STAFF: "stoker_demo_staff_pkr_v1",
  EXPENSES: "stoker_demo_expenses_pkr_v1",
  WORK_ORDERS: "stoker_demo_work_orders_pkr_v1",
  PM_SCHEDULES: "stoker_demo_pm_schedules_pkr_v1",
  SUPPLIERS: "stoker_demo_suppliers_pkr_v1",
  PURCHASE_ORDERS: "stoker_demo_purchase_orders_pkr_v1",
  INVOICES: "stoker_demo_invoices_pkr_v1",
  WATER_TESTS: "stoker_demo_water_tests_pkr_v1",
  INVENTORY: "stoker_demo_inventory_pkr_v1",
  STOCK_CATEGORIES: "stoker_demo_stock_categories_pkr_v1",
  STOCK_UNITS: "stoker_demo_stock_units_pkr_v1",
  STOCK_MOVEMENTS: "stoker_demo_stock_movements_pkr_v1",
  STEAM_RECORDS: "stoker_demo_steam_records_pkr_v1",
  VOUCHERS: "stoker_demo_vouchers_pkr_v1",
  SALARIES: "stoker_demo_salaries_pkr_v1",
  MONTH_END: "stoker_demo_month_end_pkr_v1",
  USERS: "stoker_demo_users_pkr_v1",
  ACTIVE_USER_ID: "stoker_demo_active_user_id_pkr_v1",
  PERMISSIONS: "stoker_demo_permissions_pkr_v1",
  FUEL_DISPATCHES: "stoker_demo_fuel_dispatches_pkr_v2",
  JOURNAL_ENTRIES: "stoker_demo_journal_entries_pkr_v2",
  LEDGER_ACCOUNTS: "stoker_demo_ledger_accounts_pkr_v2",
};

export const DemoStore = {
  // ===== Boilers =====
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

  // ===== Staff =====
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

  // ===== Expenses =====
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

  // ===== Suppliers & Vendors =====
  getSuppliers(): DemoSupplier[] {
    if (typeof window === "undefined") return INITIAL_SUPPLIERS;
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SUPPLIERS);
      if (!saved) {
        localStorage.setItem(STORAGE_KEYS.SUPPLIERS, JSON.stringify(INITIAL_SUPPLIERS));
    localStorage.setItem(STORAGE_KEYS.FUEL_DISPATCHES, JSON.stringify(INITIAL_FUEL_DISPATCHES));
    localStorage.setItem(STORAGE_KEYS.JOURNAL_ENTRIES, JSON.stringify(INITIAL_JOURNAL_ENTRIES));
    localStorage.setItem(STORAGE_KEYS.LEDGER_ACCOUNTS, JSON.stringify(INITIAL_LEDGER_ACCOUNTS));
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

  updateSupplier(id: string, updates: Partial<DemoSupplier>): void {
    if (typeof window === "undefined") return;
    const current = this.getSuppliers();
    const updated = current.map((s) => (s.id === id ? { ...s, ...updates } : s));
    localStorage.setItem(STORAGE_KEYS.SUPPLIERS, JSON.stringify(updated));
    this.notify();
  },

  deleteSupplier(id: string): void {
    if (typeof window === "undefined") return;
    const current = this.getSuppliers().filter((s) => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.SUPPLIERS, JSON.stringify(current));
    this.notify();
  },

  // ===== Purchase Orders =====
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

  // ===== Invoices =====
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

  // ===== Stock Categories (Settings) =====
  getStockCategories(): DemoStockCategory[] {
    if (typeof window === "undefined") return INITIAL_STOCK_CATEGORIES;
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STOCK_CATEGORIES);
      if (!saved) {
        localStorage.setItem(STORAGE_KEYS.STOCK_CATEGORIES, JSON.stringify(INITIAL_STOCK_CATEGORIES));
        return INITIAL_STOCK_CATEGORIES;
      }
      return JSON.parse(saved);
    } catch {
      return INITIAL_STOCK_CATEGORIES;
    }
  },

  addStockCategory(cat: Omit<DemoStockCategory, "id">): DemoStockCategory {
    const current = this.getStockCategories();
    const newCat: DemoStockCategory = {
      ...cat,
      id: `cat-${Date.now()}`,
      code: cat.code.toUpperCase().replace(/\s+/g, "-"),
    };
    const updated = [...current, newCat];
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.STOCK_CATEGORIES, JSON.stringify(updated));
      this.notify();
    }
    return newCat;
  },

  deleteStockCategory(id: string): void {
    if (typeof window === "undefined") return;
    const current = this.getStockCategories().filter((c) => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.STOCK_CATEGORIES, JSON.stringify(current));
    this.notify();
  },

  // ===== Stock Units (Settings) =====
  getStockUnits(): DemoStockUnit[] {
    if (typeof window === "undefined") return INITIAL_STOCK_UNITS;
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STOCK_UNITS);
      if (!saved) {
        localStorage.setItem(STORAGE_KEYS.STOCK_UNITS, JSON.stringify(INITIAL_STOCK_UNITS));
        return INITIAL_STOCK_UNITS;
      }
      return JSON.parse(saved);
    } catch {
      return INITIAL_STOCK_UNITS;
    }
  },

  addStockUnit(unit: Omit<DemoStockUnit, "id">): DemoStockUnit {
    const current = this.getStockUnits();
    const newUnit: DemoStockUnit = {
      ...unit,
      id: `unit-${Date.now()}`,
    };
    const updated = [...current, newUnit];
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.STOCK_UNITS, JSON.stringify(updated));
      this.notify();
    }
    return newUnit;
  },

  deleteStockUnit(id: string): void {
    if (typeof window === "undefined") return;
    const current = this.getStockUnits().filter((u) => u.id !== id);
    localStorage.setItem(STORAGE_KEYS.STOCK_UNITS, JSON.stringify(current));
    this.notify();
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

  getInventoryItemById(id: string): DemoInventoryItem | undefined {
    return this.getInventory().find((item) => item.id === id);
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

  updateInventoryItem(id: string, updates: Partial<DemoInventoryItem>): void {
    if (typeof window === "undefined") return;
    const current = this.getInventory();
    const updated = current.map((item) => {
      if (item.id === id) {
        const next = { ...item, ...updates };
        next.totalValue = Number((next.quantity * next.unitCost).toFixed(2));
        if (next.quantity <= next.reorderLevel * 0.5) next.status = "Critical";
        else if (next.quantity <= next.reorderLevel) next.status = "Low Stock";
        else next.status = "Optimal";
        return next;
      }
      return item;
    });
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(updated));
    this.notify();
  },

  // ===== Stock Movements (Stock In & Stock Out) =====
  getStockMovements(): DemoStockMovement[] {
    if (typeof window === "undefined") return INITIAL_STOCK_MOVEMENTS;
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STOCK_MOVEMENTS);
      if (!saved) {
        localStorage.setItem(STORAGE_KEYS.STOCK_MOVEMENTS, JSON.stringify(INITIAL_STOCK_MOVEMENTS));
        return INITIAL_STOCK_MOVEMENTS;
      }
      return JSON.parse(saved);
    } catch {
      return INITIAL_STOCK_MOVEMENTS;
    }
  },

  recordStockIn(data: {
    itemId: string;
    quantity: number;
    reference: string;
    vendorName?: string;
    siteName: string;
    performedBy: string;
    notes?: string;
  }): DemoStockMovement | null {
    if (typeof window === "undefined") return null;
    const inventory = this.getInventory();
    const item = inventory.find((i) => i.id === data.itemId);
    if (!item) return null;

    const newQty = Number((item.quantity + data.quantity).toFixed(2));
    this.updateInventoryItem(item.id, { quantity: newQty });

    const movements = this.getStockMovements();
    const nextNum = `SM-IN-2026-${(movements.length + 105).toString()}`;
    const now = new Date();
    const dateStr = `${now.toISOString().slice(0, 10)} ${now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;

    const newMovement: DemoStockMovement = {
      id: `sm-${Date.now()}`,
      movementNumber: nextNum,
      type: "STOCK_IN",
      itemId: item.id,
      itemSku: item.sku,
      itemName: item.name,
      category: item.category,
      quantity: data.quantity,
      unit: item.unit,
      siteName: data.siteName,
      reference: data.reference,
      vendorName: data.vendorName,
      performedBy: data.performedBy,
      date: dateStr,
      timestamp: now.toISOString(),
      balanceAfter: newQty,
      notes: data.notes,
    };

    const updatedMovements = [newMovement, ...movements];
    localStorage.setItem(STORAGE_KEYS.STOCK_MOVEMENTS, JSON.stringify(updatedMovements));
    this.notify();
    return newMovement;
  },

  recordStockOut(data: {
    itemId: string;
    quantity: number;
    boilerId?: string;
    boilerModel?: string;
    siteName: string;
    reference: string;
    issuedTo: string;
    performedBy: string;
    notes?: string;
  }): DemoStockMovement | null {
    if (typeof window === "undefined") return null;
    const inventory = this.getInventory();
    const item = inventory.find((i) => i.id === data.itemId);
    if (!item) return null;

    const newQty = Math.max(0, Number((item.quantity - data.quantity).toFixed(2)));
    this.updateInventoryItem(item.id, { quantity: newQty });

    const movements = this.getStockMovements();
    const nextNum = `SM-OUT-2026-${(movements.length + 105).toString()}`;
    const now = new Date();
    const dateStr = `${now.toISOString().slice(0, 10)} ${now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;

    const newMovement: DemoStockMovement = {
      id: `sm-${Date.now()}`,
      movementNumber: nextNum,
      type: "STOCK_OUT",
      itemId: item.id,
      itemSku: item.sku,
      itemName: item.name,
      category: item.category,
      quantity: data.quantity,
      unit: item.unit,
      siteName: data.siteName,
      boilerId: data.boilerId,
      boilerModel: data.boilerModel,
      reference: data.reference,
      issuedTo: data.issuedTo,
      performedBy: data.performedBy,
      date: dateStr,
      timestamp: now.toISOString(),
      balanceAfter: newQty,
      notes: data.notes,
    };

    const updatedMovements = [newMovement, ...movements];
    localStorage.setItem(STORAGE_KEYS.STOCK_MOVEMENTS, JSON.stringify(updatedMovements));
    this.notify();
    return newMovement;
  },

  // ===== Steam Records (Daily, Weekly, Monthly) =====
  getSteamRecords(): DemoSteamRecord[] {
    if (typeof window === "undefined") return INITIAL_STEAM_RECORDS;
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STEAM_RECORDS);
      if (!saved) {
        localStorage.setItem(STORAGE_KEYS.STEAM_RECORDS, JSON.stringify(INITIAL_STEAM_RECORDS));
        return INITIAL_STEAM_RECORDS;
      }
      return JSON.parse(saved);
    } catch {
      return INITIAL_STEAM_RECORDS;
    }
  },

  addSteamRecord(record: Omit<DemoSteamRecord, "id" | "recordNumber" | "timestamp">): DemoSteamRecord {
    const current = this.getSteamRecords();
    const nextNum = `STM-2026-${(current.length + 102).toString().padStart(3, "0")}`;
    const newRecord: DemoSteamRecord = {
      ...record,
      id: `stm-${Date.now()}`,
      recordNumber: nextNum,
      timestamp: new Date().toISOString(),
    };
    const updated = [newRecord, ...current];
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.STEAM_RECORDS, JSON.stringify(updated));
      this.notify();
    }
    return newRecord;
  },

  // ===== Financial Vouchers =====
  getVouchers(): DemoVoucher[] {
    if (typeof window === "undefined") return INITIAL_VOUCHERS;
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.VOUCHERS);
      if (!saved) {
        localStorage.setItem(STORAGE_KEYS.VOUCHERS, JSON.stringify(INITIAL_VOUCHERS));
        return INITIAL_VOUCHERS;
      }
      return JSON.parse(saved);
    } catch {
      return INITIAL_VOUCHERS;
    }
  },

  addVoucher(voucher: Omit<DemoVoucher, "id" | "voucherNumber" | "timestamp">): DemoVoucher {
    const current = this.getVouchers();
    const nextNum = `VCH-2026-${(current.length + 87).toString().padStart(3, "0")}`;
    const newVoucher: DemoVoucher = {
      ...voucher,
      id: `vch-${Date.now()}`,
      voucherNumber: nextNum,
      timestamp: new Date().toISOString(),
    };
    const updated = [newVoucher, ...current];
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.VOUCHERS, JSON.stringify(updated));
      this.notify();
    }
    return newVoucher;
  },

  updateVoucherStatus(id: string, status: DemoVoucher["status"]): void {
    if (typeof window === "undefined") return;
    const current = this.getVouchers();
    const updated = current.map((v) => (v.id === id ? { ...v, status } : v));
    localStorage.setItem(STORAGE_KEYS.VOUCHERS, JSON.stringify(updated));
    this.notify();
  },

  // ===== Staff Salaries & Payroll =====
  getStaffSalaries(): DemoStaffSalary[] {
    if (typeof window === "undefined") return INITIAL_SALARIES;
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SALARIES);
      if (!saved) {
        localStorage.setItem(STORAGE_KEYS.SALARIES, JSON.stringify(INITIAL_SALARIES));
        return INITIAL_SALARIES;
      }
      return JSON.parse(saved);
    } catch {
      return INITIAL_SALARIES;
    }
  },

  updateSalaryStatus(id: string, status: DemoStaffSalary["status"], voucherNumber?: string): void {
    if (typeof window === "undefined") return;
    const current = this.getStaffSalaries();
    const updated = current.map((s) =>
      s.id === id
        ? {
            ...s,
            status,
            voucherNumber: voucherNumber || s.voucherNumber,
            disbursedDate: status === "Disbursed" ? new Date().toISOString().slice(0, 10) : s.disbursedDate,
          }
        : s
    );
    localStorage.setItem(STORAGE_KEYS.SALARIES, JSON.stringify(updated));
    this.notify();
  },

  // ===== Month-End Fuel Reconciliation =====
  getMonthEndReconciliations(): DemoMonthEndReconciliation[] {
    if (typeof window === "undefined") return INITIAL_MONTH_END;
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MONTH_END);
      if (!saved) {
        localStorage.setItem(STORAGE_KEYS.MONTH_END, JSON.stringify(INITIAL_MONTH_END));
        return INITIAL_MONTH_END;
      }
      return JSON.parse(saved);
    } catch {
      return INITIAL_MONTH_END;
    }
  },

  addMonthEndReconciliation(rec: Omit<DemoMonthEndReconciliation, "id" | "code" | "signedOffDate">): DemoMonthEndReconciliation {
    const current = this.getMonthEndReconciliations();
    const nextCode = `REC-2026-${(current.length + 5).toString().padStart(3, "0")}`;
    const newRec: DemoMonthEndReconciliation = {
      ...rec,
      id: `rec-${Date.now()}`,
      code: nextCode,
      signedOffDate: new Date().toISOString().slice(0, 10),
    };
    const updated = [newRec, ...current];
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.MONTH_END, JSON.stringify(updated));
      this.notify();
    }
    return newRec;
  },

  // ===== User Accounts & Role Permissions =====
  getUserAccounts(): DemoUserAccount[] {
    if (typeof window === "undefined") return INITIAL_USERS;
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USERS);
      if (!saved) {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
        return INITIAL_USERS;
      }
      return JSON.parse(saved);
    } catch {
      return INITIAL_USERS;
    }
  },

  getActiveUser(): DemoUserAccount {
    const users = this.getUserAccounts();
    const fallback = INITIAL_USERS[0] as DemoUserAccount;
    if (typeof window === "undefined") return users[0] || fallback;
    try {
      const activeId = localStorage.getItem(STORAGE_KEYS.ACTIVE_USER_ID);
      const found = users.find((u) => u.id === activeId);
      return found || users[0] || fallback;
    } catch {
      return users[0] || fallback;
    }
  },

  setActiveUser(userId: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.ACTIVE_USER_ID, userId);
    this.notify();
  },

  addUserAccount(user: Omit<DemoUserAccount, "id">): DemoUserAccount {
    const current = this.getUserAccounts();
    const newUser: DemoUserAccount = {
      ...user,
      id: `usr-${Date.now()}`,
    };
    const updated = [...current, newUser];
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updated));
      this.notify();
    }
    return newUser;
  },

  updateUserAccount(id: string, updates: Partial<DemoUserAccount>): void {
    if (typeof window === "undefined") return;
    const current = this.getUserAccounts();
    const updated = current.map((u) => (u.id === id ? { ...u, ...updates } : u));
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updated));
    this.notify();
  },

  getRolePermissions(): Record<string, DemoRolePermissions> {
    if (typeof window === "undefined") return INITIAL_ROLE_PERMISSIONS;
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PERMISSIONS);
      if (!saved) {
        localStorage.setItem(STORAGE_KEYS.PERMISSIONS, JSON.stringify(INITIAL_ROLE_PERMISSIONS));
        return INITIAL_ROLE_PERMISSIONS;
      }
      return JSON.parse(saved);
    } catch {
      return INITIAL_ROLE_PERMISSIONS;
    }
  },

  updateRolePermission(role: string, module: keyof DemoRolePermissions, action: string, value: boolean): void {
    if (typeof window === "undefined") return;
    const current = this.getRolePermissions();
    const rolePerms = current[role] ? { ...current[role] } : { ...INITIAL_ROLE_PERMISSIONS["Super Admin"] };
    // @ts-ignore
    rolePerms[module] = { ...rolePerms[module], [action]: value };
    const updated = { ...current, [role]: rolePerms };
    localStorage.setItem(STORAGE_KEYS.PERMISSIONS, JSON.stringify(updated));
    this.notify();
  },

  // ===== Global Reset =====

  // ===== Fuel Dispatches & Logistics =====
  getFuelDispatches(): DemoFuelDispatch[] {
    if (typeof window === "undefined") return INITIAL_FUEL_DISPATCHES;
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FUEL_DISPATCHES);
      if (!saved) {
        localStorage.setItem(STORAGE_KEYS.FUEL_DISPATCHES, JSON.stringify(INITIAL_FUEL_DISPATCHES));
        return INITIAL_FUEL_DISPATCHES;
      }
      return JSON.parse(saved);
    } catch {
      return INITIAL_FUEL_DISPATCHES;
    }
  },

  addFuelDispatch(dispatch: Omit<DemoFuelDispatch, "id" | "dispatchNo">): DemoFuelDispatch {
    const current = this.getFuelDispatches();
    const nextNo = `DSP-2026-${(current.length + 89).toString().padStart(3, "0")}`;
    const newDisp: DemoFuelDispatch = {
      ...dispatch,
      id: `disp-${Date.now()}`,
      dispatchNo: nextNo,
    };
    const updated = [newDisp, ...current];
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.FUEL_DISPATCHES, JSON.stringify(updated));
      this.notify();
    }
    return newDisp;
  },

  // ===== General Ledger & Journal Accounting =====
  getLedgerAccounts(): DemoLedgerAccount[] {
    if (typeof window === "undefined") return INITIAL_LEDGER_ACCOUNTS;
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LEDGER_ACCOUNTS);
      if (!saved) {
        localStorage.setItem(STORAGE_KEYS.LEDGER_ACCOUNTS, JSON.stringify(INITIAL_LEDGER_ACCOUNTS));
        return INITIAL_LEDGER_ACCOUNTS;
      }
      return JSON.parse(saved);
    } catch {
      return INITIAL_LEDGER_ACCOUNTS;
    }
  },

  getJournalEntries(): DemoJournalEntry[] {
    if (typeof window === "undefined") return INITIAL_JOURNAL_ENTRIES;
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.JOURNAL_ENTRIES);
      if (!saved) {
        localStorage.setItem(STORAGE_KEYS.JOURNAL_ENTRIES, JSON.stringify(INITIAL_JOURNAL_ENTRIES));
        return INITIAL_JOURNAL_ENTRIES;
      }
      return JSON.parse(saved);
    } catch {
      return INITIAL_JOURNAL_ENTRIES;
    }
  },

  addJournalEntry(entry: Omit<DemoJournalEntry, "id" | "entryNo" | "status" | "timestamp">): DemoJournalEntry {
    const current = this.getJournalEntries();
    const nextNo = `JV-2026-${(current.length + 109).toString().padStart(5, "0")}`;
    const newEntry: DemoJournalEntry = {
      ...entry,
      id: `je-${Date.now()}`,
      entryNo: nextNo,
      status: "Posted & Balanced",
      timestamp: new Date().toISOString().slice(0, 16).replace("T", " "),
    };
    const updated = [newEntry, ...current];

    // Update account balances
    const accounts = this.getLedgerAccounts();
    const updatedAccounts = accounts.map((acc) => {
      if (acc.code === entry.debitAccountCode) {
        return {
          ...acc,
          balance: acc.normalBalance === "Debit" ? acc.balance + entry.debitAmount : acc.balance - entry.debitAmount,
        };
      }
      if (acc.code === entry.creditAccountCode) {
        return {
          ...acc,
          balance: acc.normalBalance === "Credit" ? acc.balance + entry.creditAmount : acc.balance - entry.creditAmount,
        };
      }
      return acc;
    });

    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.JOURNAL_ENTRIES, JSON.stringify(updated));
      localStorage.setItem(STORAGE_KEYS.LEDGER_ACCOUNTS, JSON.stringify(updatedAccounts));
      this.notify();
    }
    return newEntry;
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
    localStorage.setItem(STORAGE_KEYS.STOCK_CATEGORIES, JSON.stringify(INITIAL_STOCK_CATEGORIES));
    localStorage.setItem(STORAGE_KEYS.STOCK_UNITS, JSON.stringify(INITIAL_STOCK_UNITS));
    localStorage.setItem(STORAGE_KEYS.STOCK_MOVEMENTS, JSON.stringify(INITIAL_STOCK_MOVEMENTS));
    localStorage.setItem(STORAGE_KEYS.STEAM_RECORDS, JSON.stringify(INITIAL_STEAM_RECORDS));
    localStorage.setItem(STORAGE_KEYS.VOUCHERS, JSON.stringify(INITIAL_VOUCHERS));
    localStorage.setItem(STORAGE_KEYS.SALARIES, JSON.stringify(INITIAL_SALARIES));
    localStorage.setItem(STORAGE_KEYS.MONTH_END, JSON.stringify(INITIAL_MONTH_END));
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    localStorage.setItem(STORAGE_KEYS.PERMISSIONS, JSON.stringify(INITIAL_ROLE_PERMISSIONS));
    localStorage.setItem(STORAGE_KEYS.ACTIVE_USER_ID, INITIAL_USERS[0]?.id || "usr-01");
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
