"use client";

import { useState, useEffect } from "react";
import {
  DollarSign,
  Search,
  Plus,
  Receipt,
  Users,
  Calendar,
  Building2,
  FileText,
  CheckCircle2,
  Clock,
  Printer,
  ChevronRight,
  TrendingDown,
  X,
  CreditCard,
  Banknote,
  Check,
} from "lucide-react";
import {
  DemoStore,
  DemoExpense,
  DemoBoiler,
  DemoVoucher,
  DemoStaffSalary,
  DemoSupplier,
  DemoWorker,
} from "../../demo-store";

export default function ExpensesConsolePage() {
  const [activeTab, setActiveTab] = useState<"EXPENSES" | "VOUCHERS" | "SALARIES">("EXPENSES");
  const [expenses, setExpenses] = useState<DemoExpense[]>([]);
  const [vouchers, setVouchers] = useState<DemoVoucher[]>([]);
  const [salaries, setSalaries] = useState<DemoStaffSalary[]>([]);
  const [boilers, setBoilers] = useState<DemoBoiler[]>([]);
  const [suppliers, setSuppliers] = useState<DemoSupplier[]>([]);
  const [staff, setStaff] = useState<DemoWorker[]>([]);

  // Search & Filters
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [monthFilter, setMonthFilter] = useState("All");

  // Modal 1: Quick Log Running Expense
  const [modalOpen, setModalOpen] = useState(false);
  const [targetBoilerId, setTargetBoilerId] = useState("");
  const [amount, setAmount] = useState("50.00");
  const [category, setCategory] = useState<DemoExpense["category"]>("Biomass Fuel");
  const [description, setDescription] = useState("");
  const [loggedBy, setLoggedBy] = useState("Operations Staff");

  // Modal 2: Create Financial Voucher
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [vchType, setVchType] = useState<DemoVoucher["type"]>("Payment Voucher");
  const [vchPayee, setVchPayee] = useState("");
  const [vchAmount, setVchAmount] = useState("500.00");
  const [vchCategory, setVchCategory] = useState("Biomass Fuel");
  const [vchBoilerId, setVchBoilerId] = useState("");
  const [vchPaymentMode, setVchPaymentMode] = useState<DemoVoucher["paymentMode"]>("Bank Transfer");
  const [vchRefDoc, setVchRefDoc] = useState("Invoice #2026-991");
  const [vchDesc, setVchDesc] = useState("");
  const [vchMonth, setVchMonth] = useState("October 2026");

  // Modal 3: View / Print Digital Voucher Receipt
  const [inspectVoucher, setInspectVoucher] = useState<DemoVoucher | null>(null);

  const refresh = () => {
    setExpenses(DemoStore.getExpenses());
    setVouchers(DemoStore.getVouchers());
    setSalaries(DemoStore.getStaffSalaries());
    const bList = DemoStore.getBoilers();
    setBoilers(bList);
    setSuppliers(DemoStore.getSuppliers());
    setStaff(DemoStore.getStaff());

    if (bList.length > 0 && !targetBoilerId && bList[0]) setTargetBoilerId(bList[0].id);
    if (bList.length > 0 && !vchBoilerId && bList[0]) setVchBoilerId(bList[0].id);
  };

  useEffect(() => {
    refresh();
    const unsub = DemoStore.subscribe(refresh);
    return () => unsub();
  }, []);

  // Filtered Expenses
  const filteredExpenses = expenses.filter((e) => {
    const matchesSearch =
      e.boilerModel.toLowerCase().includes(search.toLowerCase()) ||
      e.siteName.toLowerCase().includes(search.toLowerCase()) ||
      e.description.toLowerCase().includes(search.toLowerCase()) ||
      e.loggedBy.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;
    if (categoryFilter !== "All" && e.category !== categoryFilter) return false;
    return true;
  });

  // Filtered Vouchers
  const filteredVouchers = vouchers.filter((v) => {
    const matchesSearch =
      v.voucherNumber.toLowerCase().includes(search.toLowerCase()) ||
      v.payee.toLowerCase().includes(search.toLowerCase()) ||
      v.description.toLowerCase().includes(search.toLowerCase()) ||
      v.siteName.toLowerCase().includes(search.toLowerCase());
    const matchesMonth = monthFilter === "All" || v.month.includes(monthFilter);
    return matchesSearch && matchesMonth;
  });

  // Filtered Salaries
  const filteredSalaries = salaries.filter((s) => {
    const matchesSearch =
      s.workerName.toLowerCase().includes(search.toLowerCase()) ||
      s.role.toLowerCase().includes(search.toLowerCase()) ||
      s.siteName.toLowerCase().includes(search.toLowerCase());
    const matchesMonth = monthFilter === "All" || s.month.includes(monthFilter);
    return matchesSearch && matchesMonth;
  });

  // Totals
  const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const totalVouchersAmount = vouchers.reduce((acc, curr) => acc + curr.amount, 0);
  const totalSalaryPayroll = salaries.reduce((acc, curr) => acc + curr.netPayable, 0);

  // Actions
  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const b = boilers.find((item) => item.id === targetBoilerId) || boilers[0];
    if (!b) return;

    DemoStore.addExpense({
      boilerId: b.id,
      boilerModel: b.model,
      siteName: b.siteName,
      amount: parseFloat(amount) || 0,
      category,
      description: description || `${category} refill`,
      loggedBy: loggedBy || "Site Operator",
    });

    setDescription("");
    setModalOpen(false);
  };

  const handleCreateVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    const b = boilers.find((item) => item.id === vchBoilerId) || boilers[0];
    const user = DemoStore.getActiveUser();

    DemoStore.addVoucher({
      date: new Date().toISOString().slice(0, 10),
      month: vchMonth,
      type: vchType,
      payee: vchPayee || "Apex Operations Crew",
      amount: parseFloat(vchAmount) || 0,
      category: vchCategory,
      siteName: b ? b.siteName : "Central Enterprise Fleet",
      boilerId: b?.id,
      boilerModel: b?.model,
      paymentMode: vchPaymentMode,
      referenceDoc: vchRefDoc || "Invoice Ref #001",
      description: vchDesc || `${vchType} disbursement for ${vchCategory}`,
      status: "Approved",
      approvedBy: user.name,
      preparedBy: "Sarah Jenkins (Finance)",
    });

    setIsVoucherModalOpen(false);
    setVchDesc("");
    setVchPayee("");
  };

  const handleDisburseSalary = (salaryId: string, workerName: string, netAmount: number, siteName: string) => {
    const user = DemoStore.getActiveUser();
    const vch = DemoStore.addVoucher({
      date: new Date().toISOString().slice(0, 10),
      month: "October 2026",
      type: "Salary Voucher",
      payee: workerName,
      amount: netAmount,
      category: "Crew Allowance",
      siteName,
      paymentMode: "Bank Transfer",
      referenceDoc: `PAYROLL-SLIP-${Date.now().toString().slice(-4)}`,
      description: `Monthly wage disbursement for ${workerName}`,
      status: "Paid",
      approvedBy: user.name,
      preparedBy: "Sarah Jenkins (Finance)",
    });

    DemoStore.updateSalaryStatus(salaryId, "Disbursed", vch.voucherNumber);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-100 text-[#FF6600] uppercase tracking-wider">
              Financial Management
            </span>
            <span className="text-xs text-gray-500 font-medium">Monthly Expenses · Salaries · Vouchers</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 mt-1">
            Expenses, Vouchers & Salaries
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Operational cash burn, monthly workforce salary payrolls, and official financial vouchers.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsVoucherModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl transition-all shadow-sm"
          >
            <Receipt className="w-4 h-4 text-[#FF6600]" />
            <span>Create Voucher</span>
          </button>

          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-[#FF6600] hover:bg-[#E65C00] rounded-xl shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Log Running Expense</span>
          </button>
        </div>
      </div>

      {/* Top 3 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Running Expenses Logged
            </div>
            <div className="text-2xl sm:text-3xl font-black text-gray-900 font-mono tracking-tight mt-1">
              Rs. {totalSpent.toLocaleString("en-PK", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </div>
            <div className="text-[11px] text-gray-500 mt-1">{expenses.length} on-site transactions</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#FF6600]">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Financial Vouchers Total
            </div>
            <div className="text-2xl sm:text-3xl font-black text-gray-900 font-mono tracking-tight mt-1">
              Rs. {totalVouchersAmount.toLocaleString("en-PK", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{vouchers.length} Vouchers Issued & Approved</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <Receipt className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Monthly Salaries Outlay
            </div>
            <div className="text-2xl sm:text-3xl font-black text-gray-900 font-mono tracking-tight mt-1">
              Rs. {totalSalaryPayroll.toLocaleString("en-PK", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </div>
            <div className="text-[11px] text-purple-600 font-semibold mt-1 flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              <span>{salaries.length} Boiler Station Crew Members</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200 overflow-x-auto scrollbar-none gap-2">
        <button
          onClick={() => setActiveTab("EXPENSES")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold whitespace-nowrap border-b-2 transition-all ${
            activeTab === "EXPENSES"
              ? "border-[#FF6600] text-[#FF6600]"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Daily Running Expenses</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-gray-100 text-gray-600 font-semibold">
            {expenses.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("VOUCHERS")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold whitespace-nowrap border-b-2 transition-all ${
            activeTab === "VOUCHERS"
              ? "border-[#FF6600] text-[#FF6600]"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Financial Vouchers & Amounts</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-700 font-semibold">
            {vouchers.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("SALARIES")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold whitespace-nowrap border-b-2 transition-all ${
            activeTab === "SALARIES"
              ? "border-[#FF6600] text-[#FF6600]"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Monthly Staff Salaries & Payroll</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-purple-100 text-purple-700 font-semibold">
            {salaries.length} Staff
          </span>
        </button>
      </div>

      {/* TAB 1: RUNNING EXPENSES */}
      {activeTab === "EXPENSES" && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white p-3.5 rounded-2xl border border-gray-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto scrollbar-none">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider shrink-0 mr-1">
                Category:
              </span>
              {["All", "Biomass Fuel", "Water Treatment", "Lubricants & Oils", "Spare Parts", "Crew Allowance"].map(
                (c) => (
                  <button
                    key={c}
                    onClick={() => setCategoryFilter(c)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                      categoryFilter === c
                        ? "bg-[#181B20] text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {c}
                  </button>
                )
              )}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search expense description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6600]"
              />
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-gray-200/90 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAFBFD] border-b border-gray-200 text-gray-500 font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Boiler & Facility</th>
                    <th className="py-3 px-4">Expense Description</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4 text-right">Amount (PKR)</th>
                    <th className="py-3 px-4">Logged By</th>
                    <th className="py-3 px-4 text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredExpenses.map((exp) => (
                    <tr key={exp.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-gray-900">{exp.boilerModel}</div>
                        <div className="text-[10px] text-gray-500">{exp.siteName}</div>
                      </td>
                      <td className="py-3 px-4 font-medium text-gray-800">{exp.description}</td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-[10px] px-2 py-0.5 rounded-full bg-orange-50 text-[#FF6600] border border-orange-200">
                          {exp.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-extrabold text-sm text-gray-900">
                        Rs. {exp.amount.toLocaleString("en-PK")}
                      </td>
                      <td className="py-3 px-4 text-gray-600 font-medium">{exp.loggedBy}</td>
                      <td className="py-3 px-4 text-right text-gray-400 font-mono text-[11px]">
                        {exp.date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FINANCIAL VOUCHERS SYSTEM */}
      {activeTab === "VOUCHERS" && (
        <div className="space-y-4">
          {/* Controls */}
          <div className="bg-white p-3.5 rounded-2xl border border-gray-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Month:</span>
              <select
                value={monthFilter}
                onChange={(e) => setMonthFilter(e.target.value)}
                className="px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-[#FF6600]"
              >
                <option value="All">All Billing Periods</option>
                <option value="October 2026">October 2026</option>
                <option value="September 2026">September 2026</option>
              </select>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search voucher #, payee..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6600]"
              />
            </div>
          </div>

          {/* Vouchers Table */}
          <div className="bg-white rounded-2xl border border-gray-200/90 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAFBFD] border-b border-gray-200 text-gray-500 font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Voucher No & Date</th>
                    <th className="py-3 px-4">Voucher Type</th>
                    <th className="py-3 px-4">Payee (Beneficiary)</th>
                    <th className="py-3 px-4">Category & Station</th>
                    <th className="py-3 px-4 text-right">Voucher Amount</th>
                    <th className="py-3 px-4">Payment Method</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredVouchers.map((vch) => (
                    <tr key={vch.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-mono font-bold text-gray-900">{vch.voucherNumber}</div>
                        <div className="text-[10px] text-gray-500">{vch.date} ({vch.month})</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          vch.type === "Salary Voucher"
                            ? "bg-purple-50 text-purple-700 border border-purple-200"
                            : vch.type === "Fuel Purchase Voucher"
                            ? "bg-orange-50 text-[#FF6600] border border-orange-200"
                            : "bg-blue-50 text-blue-700 border border-blue-200"
                        }`}>
                          {vch.type}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-extrabold text-gray-900">{vch.payee}</div>
                        <div className="text-[10px] text-gray-500">{vch.description}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-gray-800">{vch.category}</div>
                        <div className="text-[10px] text-gray-500 line-clamp-1">{vch.siteName}</div>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-black text-sm text-gray-900">
                        Rs. {vch.amount.toLocaleString("en-PK", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-gray-700 text-[11px] flex items-center gap-1">
                          <Banknote className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{vch.paymentMode}</span>
                        </span>
                        <span className="text-[10px] text-gray-400 block font-mono">{vch.referenceDoc}</span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          vch.status === "Paid"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-blue-50 text-blue-700 border border-blue-200"
                        }`}>
                          {vch.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setInspectVoucher(vch)}
                          className="px-2.5 py-1 text-xs font-bold text-gray-700 bg-gray-100 hover:bg-orange-50 hover:text-[#FF6600] rounded-lg transition-colors border border-gray-200"
                        >
                          View Voucher
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MONTHLY STAFF SALARIES & PAYROLL */}
      {activeTab === "SALARIES" && (
        <div className="space-y-4">
          {/* Header Bar */}
          <div className="bg-white p-3.5 rounded-2xl border border-gray-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Payroll Month:</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-700">
                October 2026 Billing
              </span>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search worker, site..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6600]"
              />
            </div>
          </div>

          {/* Salaries Table */}
          <div className="bg-white rounded-2xl border border-gray-200/90 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAFBFD] border-b border-gray-200 text-gray-500 font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Employee & Designation</th>
                    <th className="py-3 px-4">Stationed Facility Boiler</th>
                    <th className="py-3 px-3 text-center">Daily Rate</th>
                    <th className="py-3 px-3 text-center">Shifts Worked</th>
                    <th className="py-3 px-3 text-right">Base Wages</th>
                    <th className="py-3 px-3 text-right">Overtime / Allowance</th>
                    <th className="py-3 px-4 text-right">Net Payable</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredSalaries.map((sal) => (
                    <tr key={sal.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-extrabold text-gray-900">{sal.workerName}</div>
                        <div className="text-[10px] text-gray-500 font-medium">{sal.workerCode} · {sal.role}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-gray-800">{sal.boilerModel}</div>
                        <div className="text-[10px] text-gray-500">{sal.siteName}</div>
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-gray-700">
                        Rs. {sal.dailyWageAmount.toLocaleString("en-PK")}/day
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-gray-900">
                        {sal.shiftsWorked} shifts
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-gray-700">
                        Rs. {sal.baseAmount.toLocaleString("en-PK")}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-emerald-600 font-semibold">
                        +Rs. {sal.overtimeBonus.toLocaleString("en-PK")}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-black text-sm text-gray-900">
                        Rs. {sal.netPayable.toLocaleString("en-PK")}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          sal.status === "Disbursed"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}>
                          {sal.status}
                        </span>
                        {sal.voucherNumber && (
                          <div className="text-[9px] text-gray-400 font-mono mt-0.5">
                            {sal.voucherNumber}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {sal.status !== "Disbursed" ? (
                          <button
                            onClick={() =>
                              handleDisburseSalary(sal.id, sal.workerName, sal.netPayable, sal.siteName)
                            }
                            className="px-2.5 py-1 text-[11px] font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-sm transition-all"
                          >
                            Disburse Salary
                          </button>
                        ) : (
                          <span className="text-[11px] text-emerald-600 font-bold flex items-center justify-end gap-1">
                            <Check className="w-3.5 h-3.5" /> Disbursed
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: QUICK LOG RUNNING EXPENSE */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-extrabold text-base text-gray-900">Log Running Expense</h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddExpense} className="space-y-3.5 mt-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Target Facility Boiler</label>
                <select
                  value={targetBoilerId}
                  onChange={(e) => setTargetBoilerId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6600]"
                >
                  {boilers.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.code} - {b.model} ({b.siteName})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Amount (PKR / Rs.)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs font-mono font-bold border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6600]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6600]"
                  >
                    <option value="Biomass Fuel">Biomass Fuel</option>
                    <option value="Water Treatment">Water Treatment</option>
                    <option value="Lubricants & Oils">Lubricants & Oils</option>
                    <option value="Spare Parts">Spare Parts</option>
                    <option value="Crew Allowance">Crew Allowance</option>
                    <option value="General Running">General Running</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Description / Memo</label>
                <input
                  type="text"
                  placeholder="e.g. Grate bar grease pack refill"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6600]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Logged By</label>
                <input
                  type="text"
                  value={loggedBy}
                  onChange={(e) => setLoggedBy(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6600]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#FF6600] hover:bg-[#E65C00] rounded-xl shadow-sm transition-all"
                >
                  Submit Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CREATE FINANCIAL VOUCHER */}
      {isVoucherModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="font-extrabold text-base text-gray-900">Create Financial Voucher</h3>
                <p className="text-xs text-gray-500">
                  Generate formal payment vouchers, cash vouchers, or fuel purchase allocations.
                </p>
              </div>
              <button
                onClick={() => setIsVoucherModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateVoucher} className="space-y-3.5 mt-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Voucher Type</label>
                  <select
                    value={vchType}
                    onChange={(e) => setVchType(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6600]"
                  >
                    <option value="Payment Voucher">Payment Voucher</option>
                    <option value="Fuel Purchase Voucher">Fuel Purchase Voucher</option>
                    <option value="Cash Voucher">Cash Voucher</option>
                    <option value="Salary Voucher">Salary Voucher</option>
                    <option value="Journal Voucher">Journal Voucher</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Accounting Month</label>
                  <input
                    type="text"
                    value={vchMonth}
                    onChange={(e) => setVchMonth(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6600]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Payee Name (Beneficiary)</label>
                <input
                  type="text"
                  placeholder="e.g. Indus Agro Biofuels Corp or Tariq Mahmood"
                  value={vchPayee}
                  onChange={(e) => setVchPayee(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6600]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Voucher Amount (PKR / Rs.)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={vchAmount}
                    onChange={(e) => setVchAmount(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs font-mono font-bold border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6600]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Payment Mode</label>
                  <select
                    value={vchPaymentMode}
                    onChange={(e) => setVchPaymentMode(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6600]"
                  >
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Petty Cash Float">Petty Cash Float</option>
                    <option value="Cheque">Crossed Cheque</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Expense Category</label>
                  <select
                    value={vchCategory}
                    onChange={(e) => setVchCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6600]"
                  >
                    <option value="Biomass Fuel">Biomass Fuel</option>
                    <option value="Water Treatment">Water Treatment</option>
                    <option value="Spare Parts">Spare Parts</option>
                    <option value="Crew Allowance">Crew Allowance</option>
                    <option value="General Running">General Running</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Target Boiler / Site</label>
                  <select
                    value={vchBoilerId}
                    onChange={(e) => setVchBoilerId(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6600]"
                  >
                    {boilers.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.code} - {b.model}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Supporting Reference Document
                </label>
                <input
                  type="text"
                  placeholder="e.g. Weighbridge Slip #441 / Invoice INV-091"
                  value={vchRefDoc}
                  onChange={(e) => setVchRefDoc(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6600]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Description & Narration
                </label>
                <input
                  type="text"
                  placeholder="e.g. Settlement for 25 Tonnes rice husk delivery"
                  value={vchDesc}
                  onChange={(e) => setVchDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6600]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsVoucherModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#FF6600] hover:bg-[#E65C00] rounded-xl shadow-sm transition-all"
                >
                  Issue Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: VIEW / DIGITAL VOUCHER RECEIPT */}
      {inspectVoucher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#FF6600] flex items-center justify-center text-white font-bold">
                  SB
                </div>
                <div>
                  <div className="font-extrabold text-sm text-gray-900">Stoker Boilers Operations</div>
                  <div className="text-[10px] text-gray-500">Official Financial Disbursement Voucher</div>
                </div>
              </div>
              <button
                onClick={() => setInspectVoucher(null)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200/80 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-400 font-bold block">VOUCHER NO</span>
                  <span className="font-mono font-black text-sm text-gray-900">{inspectVoucher.voucherNumber}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 font-bold block">DATE</span>
                  <span className="font-mono font-bold text-gray-900">{inspectVoucher.date}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-200">
                <span className="text-[10px] text-gray-400 font-bold block">PAID TO (BENEFICIARY)</span>
                <span className="font-extrabold text-gray-900 text-sm">{inspectVoucher.payee}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <span className="text-[10px] text-gray-400 font-bold block">DISBURSEMENT TYPE</span>
                  <span className="font-bold text-gray-800">{inspectVoucher.type}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold block">PAYMENT MODE</span>
                  <span className="font-bold text-emerald-700">{inspectVoucher.paymentMode}</span>
                </div>
              </div>

              <div className="pt-1">
                <span className="text-[10px] text-gray-400 font-bold block">FACILITY / DEPLOYMENT</span>
                <span className="text-gray-800">{inspectVoucher.siteName} ({inspectVoucher.boilerModel || "Fleet Depot"})</span>
              </div>

              <div className="pt-2 border-t border-gray-200 flex items-center justify-between">
                <span className="font-bold text-gray-700 uppercase">Total Disbursed:</span>
                <span className="font-mono font-black text-xl text-[#FF6600]">
                  Rs. {inspectVoucher.amount.toLocaleString("en-PK", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2 text-[11px] text-gray-500 border-t border-gray-100">
              <div>
                <span className="block font-bold text-gray-700">Prepared By:</span>
                <span>{inspectVoucher.preparedBy}</span>
              </div>
              <div className="text-right">
                <span className="block font-bold text-gray-700">Approved By:</span>
                <span className="text-emerald-600 font-bold">{inspectVoucher.approvedBy}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Voucher</span>
              </button>
              <button
                onClick={() => setInspectVoucher(null)}
                className="px-4 py-1.5 text-xs font-bold text-white bg-[#FF6600] rounded-xl hover:bg-[#E65C00]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
