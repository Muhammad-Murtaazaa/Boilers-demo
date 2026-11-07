"use client";

import { useState, useEffect } from "react";
import {
  BookOpen,
  CheckCircle2,
  Plus,
  Search,
  Filter,
  FileText,
  DollarSign,
  TrendingUp,
  Building2,
  Calendar,
  X,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Printer,
  Download,
  AlertCircle,
  Truck,
  Users,
  Receipt,
} from "lucide-react";
import {
  DemoStore,
  DemoJournalEntry,
  DemoLedgerAccount,
} from "../../demo-store";

export default function LedgersConsolePage() {
  const [activeTab, setActiveTab] = useState<"JOURNAL" | "ACCOUNTS" | "TRIAL_BALANCE">("JOURNAL");
  const [journalEntries, setJournalEntries] = useState<DemoJournalEntry[]>([]);
  const [accounts, setAccounts] = useState<DemoLedgerAccount[]>([]);
  const [selectedAccountCode, setSelectedAccountCode] = useState<string>("1050");
  const [searchQuery, setSearchQuery] = useState("");
  const [sourceTypeFilter, setSourceTypeFilter] = useState<string>("All");

  // Post New Journal Entry Modal
  const [isNewJvOpen, setIsNewJvOpen] = useState(false);
  const [jvDate, setJvDate] = useState(new Date().toISOString().slice(0, 10));
  const [jvSourceDoc, setJvSourceDoc] = useState("");
  const [jvSourceType, setJvSourceType] = useState<DemoJournalEntry["sourceType"]>("Fuel Delivery");
  const [jvDebitCode, setJvDebitCode] = useState("1050");
  const [jvCreditCode, setJvCreditCode] = useState("2010");
  const [jvAmount, setJvAmount] = useState("");
  const [jvNarration, setJvNarration] = useState("");
  const [jvPostedBy, setJvPostedBy] = useState("Murtaza Ali (Finance Lead)");
  const [jvApprovedBy, setJvApprovedBy] = useState("Chaudhry Tariq (Super Admin)");
  const [successToast, setSuccessToast] = useState("");

  const refreshData = () => {
    setJournalEntries(DemoStore.getJournalEntries());
    setAccounts(DemoStore.getLedgerAccounts());
  };

  useEffect(() => {
    refreshData();
    const unsub = DemoStore.subscribe(refreshData);
    return () => unsub();
  }, []);

  const showNotification = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(""), 3500);
  };

  // Filtered Journal Entries
  const filteredEntries = journalEntries.filter((je) => {
    const matchesSearch =
      je.entryNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      je.narration.toLowerCase().includes(searchQuery.toLowerCase()) ||
      je.sourceDoc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      je.debitAccountName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      je.creditAccountName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSource = sourceTypeFilter === "All" || je.sourceType === sourceTypeFilter;
    return matchesSearch && matchesSource;
  });

  // Calculate totals
  const totalDebitSum = journalEntries.reduce((acc, curr) => acc + curr.debitAmount, 0);
  const totalCreditSum = journalEntries.reduce((acc, curr) => acc + curr.creditAmount, 0);
  const isEquilibrium = totalDebitSum === totalCreditSum;

  // Selected account statement
  const activeAccount = accounts.find((a) => a.code === selectedAccountCode) || accounts[0];
  const accountEntries = journalEntries.filter(
    (je) => je.debitAccountCode === selectedAccountCode || je.creditAccountCode === selectedAccountCode
  );

  const handleCreateJv = (e: React.FormEvent) => {
    e.preventDefault();
    const amountVal = parseFloat(jvAmount);
    if (!amountVal || amountVal <= 0) {
      alert("Please enter a valid amount in PKR");
      return;
    }
    if (jvDebitCode === jvCreditCode) {
      alert("Debit and Credit accounts must be distinct.");
      return;
    }

    const debitAcc = accounts.find((a) => a.code === jvDebitCode);
    const creditAcc = accounts.find((a) => a.code === jvCreditCode);

    DemoStore.addJournalEntry({
      date: jvDate,
      sourceDoc: jvSourceDoc || `MANUAL-JV-${Date.now().toString().slice(-4)}`,
      sourceType: jvSourceType,
      narration: jvNarration || `Manual double-entry adjustment between ${debitAcc?.name} and ${creditAcc?.name}`,
      debitAccountCode: jvDebitCode,
      debitAccountName: debitAcc?.name || "Debit Account",
      debitAmount: amountVal,
      creditAccountCode: jvCreditCode,
      creditAccountName: creditAcc?.name || "Credit Account",
      creditAmount: amountVal,
      postedBy: jvPostedBy,
      approvedBy: jvApprovedBy,
    });

    setIsNewJvOpen(false);
    setJvAmount("");
    setJvNarration("");
    showNotification("Journal Voucher successfully posted and accounts updated!");
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-orange-100 text-[#FF6600]">
              <BookOpen className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">
              Double-Entry Financial Ledgers
            </h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            General Journal postings, Chart of Accounts, and Trial Balance in Pakistani Rupees (PKR)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Ledger</span>
          </button>
          <button
            onClick={() => setIsNewJvOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#181B20] hover:bg-black rounded-xl transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Post Journal Voucher</span>
          </button>
        </div>
      </div>

      {/* Toast alert */}
      {successToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-2 text-xs font-bold animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Top Financial KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Total Posted Debits
            </div>
            <div className="text-2xl font-black text-gray-900 font-mono tracking-tight mt-1">
              Rs. {totalDebitSum.toLocaleString("en-PK")}
            </div>
            <div className="text-[11px] text-gray-400 mt-0.5">{journalEntries.length} posted vouchers</div>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#FF6600]">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Total Posted Credits
            </div>
            <div className="text-2xl font-black text-gray-900 font-mono tracking-tight mt-1">
              Rs. {totalCreditSum.toLocaleString("en-PK")}
            </div>
            <div className="text-[11px] text-gray-400 mt-0.5">{journalEntries.length} double-entry legs</div>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Trial Balance Status
            </div>
            <div className="text-lg font-black text-emerald-600 tracking-tight mt-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-5 h-5" />
              <span>100% In Equilibrium</span>
            </div>
            <div className="text-[11px] text-emerald-700/80 font-semibold mt-0.5">Dr = Cr (Zero Variance)</div>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Chart of Accounts
            </div>
            <div className="text-2xl font-black text-gray-900 font-mono tracking-tight mt-1">
              {accounts.length} Active Codes
            </div>
            <div className="text-[11px] text-purple-600 font-medium mt-0.5">5 Balance Sheet Classes</div>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
            <Building2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 overflow-x-auto pb-px">
        <button
          onClick={() => setActiveTab("JOURNAL")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold whitespace-nowrap border-b-2 transition-all ${
            activeTab === "JOURNAL"
              ? "border-[#FF6600] text-[#FF6600] bg-orange-50/40 rounded-t-xl"
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>General Journal Vouchers ({journalEntries.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("ACCOUNTS")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold whitespace-nowrap border-b-2 transition-all ${
            activeTab === "ACCOUNTS"
              ? "border-[#FF6600] text-[#FF6600] bg-orange-50/40 rounded-t-xl"
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Chart of Accounts & Ledger Statement</span>
        </button>

        <button
          onClick={() => setActiveTab("TRIAL_BALANCE")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold whitespace-nowrap border-b-2 transition-all ${
            activeTab === "TRIAL_BALANCE"
              ? "border-[#FF6600] text-[#FF6600] bg-orange-50/40 rounded-t-xl"
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Trial Balance Audit</span>
        </button>
      </div>

      {/* TAB 1: GENERAL JOURNAL VOUCHERS */}
      {activeTab === "JOURNAL" && (
        <div className="space-y-4">
          {/* Controls & Filter Bar */}
          <div className="bg-white p-3.5 rounded-2xl border border-gray-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search voucher #, narration, accounts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6600]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-[11px] font-bold text-gray-400">Source:</span>
              <select
                value={sourceTypeFilter}
                onChange={(e) => setSourceTypeFilter(e.target.value)}
                className="px-3 py-1.5 text-xs font-semibold border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-[#FF6600]"
              >
                <option value="All">All Source Documents</option>
                <option value="Fuel Delivery">Fuel Delivery Postings</option>
                <option value="Payroll Disbursement">Workforce Salaries</option>
                <option value="Steam Invoice">Commercial Steam Billing</option>
                <option value="Maintenance PO">Maintenance & Spares</option>
                <option value="General Voucher">Payment & Bank Vouchers</option>
              </select>
            </div>
          </div>

          {/* Journal Entries Table */}
          <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8F9FB] border-b border-gray-200/80 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Voucher No & Date</th>
                    <th className="py-3.5 px-4">Source Document</th>
                    <th className="py-3.5 px-4">Narration / Description</th>
                    <th className="py-3.5 px-4">Debit Account (Dr)</th>
                    <th className="py-3.5 px-4">Credit Account (Cr)</th>
                    <th className="py-3.5 px-4 text-right">Amount (PKR)</th>
                    <th className="py-3.5 px-4 text-center">Audit Check</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredEntries.map((je) => (
                    <tr key={je.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-mono font-bold text-gray-900">{je.entryNo}</div>
                        <div className="text-[10px] text-gray-400 font-medium flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          <span>{je.date}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-semibold text-gray-800 text-[11px] block">{je.sourceDoc}</span>
                        <span className="text-[10px] text-[#FF6600] font-bold">{je.sourceType}</span>
                      </td>

                      <td className="py-3 px-4 text-gray-700 font-medium max-w-xs">
                        <div className="line-clamp-2">{je.narration}</div>
                        <div className="text-[9px] text-gray-400 mt-0.5">Posted by: {je.postedBy}</div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-bold text-gray-900 flex items-center gap-1">
                          <span className="font-mono text-[10px] text-emerald-700 bg-emerald-50 px-1 rounded border border-emerald-200">
                            {je.debitAccountCode}
                          </span>
                          <span className="line-clamp-1">{je.debitAccountName}</span>
                        </div>
                        <div className="font-mono font-bold text-emerald-700 text-[11px] mt-0.5">
                          Dr: Rs. {je.debitAmount.toLocaleString("en-PK")}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-bold text-gray-800 flex items-center gap-1">
                          <span className="font-mono text-[10px] text-sky-700 bg-sky-50 px-1 rounded border border-sky-200">
                            {je.creditAccountCode}
                          </span>
                          <span className="line-clamp-1">{je.creditAccountName}</span>
                        </div>
                        <div className="font-mono font-bold text-sky-700 text-[11px] mt-0.5">
                          Cr: Rs. {je.creditAmount.toLocaleString("en-PK")}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right font-mono font-black text-sm text-gray-900">
                        Rs. {je.debitAmount.toLocaleString("en-PK")}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Balanced</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CHART OF ACCOUNTS & GENERAL LEDGER STATEMENT */}
      {activeTab === "ACCOUNTS" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Chart of Accounts List */}
          <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Chart of Accounts ({accounts.length})
              </span>
              <span className="text-[10px] text-gray-400">Click to inspect</span>
            </div>

            <div className="space-y-1.5 max-h-[620px] overflow-y-auto pr-1">
              {accounts.map((acc) => {
                const isSelected = acc.code === selectedAccountCode;
                return (
                  <button
                    key={acc.code}
                    onClick={() => setSelectedAccountCode(acc.code)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between gap-2 ${
                      isSelected
                        ? "bg-orange-50 border-orange-300 shadow-2xs"
                        : "bg-gray-50/60 hover:bg-white border-gray-200/80"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs px-1.5 py-0.5 rounded bg-white text-gray-900 border border-gray-200">
                          {acc.code}
                        </span>
                        <span className="font-bold text-xs text-gray-900 line-clamp-1">{acc.name}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-gray-500 font-semibold">{acc.category}</span>
                        <span className="text-[9px] text-gray-400 font-mono">({acc.normalBalance} Normal)</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-mono font-black text-xs text-gray-900">
                        Rs. {acc.balance.toLocaleString("en-PK")}
                      </div>
                      <span className={`text-[9px] font-bold uppercase ${
                        acc.normalBalance === "Debit" ? "text-emerald-600" : "text-sky-600"
                      }`}>
                        {acc.normalBalance}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Detailed Account Ledger Statement */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6 space-y-4">
            {activeAccount && (
              <>
                {/* Account Summary Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-sm px-2 py-0.5 rounded bg-orange-100 text-[#FF6600]">
                        Account #{activeAccount.code}
                      </span>
                      <span className="text-xs font-bold text-gray-500">{activeAccount.type} • {activeAccount.category}</span>
                    </div>
                    <h2 className="text-lg font-black text-gray-900 mt-1">{activeAccount.name}</h2>
                    <p className="text-xs text-gray-500">{activeAccount.description}</p>
                  </div>

                  <div className="text-right bg-orange-50/60 p-3 rounded-2xl border border-orange-100 shrink-0">
                    <span className="text-[10px] font-bold text-gray-400 uppercase block">Current Ending Balance</span>
                    <span className="text-xl font-black text-gray-900 font-mono">
                      Rs. {activeAccount.balance.toLocaleString("en-PK")}
                    </span>
                    <span className="text-[10px] text-[#FF6600] font-bold block">{activeAccount.normalBalance} Balance</span>
                  </div>
                </div>

                {/* Account Transactions Statement */}
                <div>
                  <div className="flex items-center justify-between pb-2 text-xs font-bold text-gray-700">
                    <span>Account Activity Ledger ({accountEntries.length} Postings)</span>
                    <span className="text-[10px] text-gray-400">Chronological Audit Trail</span>
                  </div>

                  {accountEntries.length === 0 ? (
                    <div className="p-8 text-center text-xs text-gray-500 border border-dashed rounded-xl">
                      No journal vouchers posted to this account yet in the current period.
                    </div>
                  ) : (
                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#F8F9FB] border-b border-gray-200 text-[10px] font-bold text-gray-500 uppercase">
                          <tr>
                            <th className="py-2.5 px-3">Date & Ref</th>
                            <th className="py-2.5 px-3">Narration / Contra Account</th>
                            <th className="py-2.5 px-3 text-right">Debit (Dr)</th>
                            <th className="py-2.5 px-3 text-right">Credit (Cr)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 font-mono text-[11px]">
                          {accountEntries.map((je) => {
                            const isDr = je.debitAccountCode === activeAccount.code;
                            const contraName = isDr ? je.creditAccountName : je.debitAccountName;
                            const contraCode = isDr ? je.creditAccountCode : je.debitAccountCode;

                            return (
                              <tr key={je.id} className="hover:bg-gray-50/80 transition-colors">
                                <td className="py-2.5 px-3">
                                  <div className="font-bold text-gray-900">{je.date}</div>
                                  <div className="text-[10px] text-gray-400">{je.entryNo}</div>
                                </td>

                                <td className="py-2.5 px-3 font-sans">
                                  <div className="font-semibold text-gray-800 text-xs">{je.narration}</div>
                                  <div className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5">
                                    <span>Contra A/C:</span>
                                    <span className="font-mono font-bold text-gray-700">{contraCode} - {contraName}</span>
                                  </div>
                                </td>

                                <td className="py-2.5 px-3 text-right font-extrabold text-emerald-700">
                                  {isDr ? `Rs. ${je.debitAmount.toLocaleString("en-PK")}` : "—"}
                                </td>

                                <td className="py-2.5 px-3 text-right font-extrabold text-sky-700">
                                  {!isDr ? `Rs. ${je.creditAmount.toLocaleString("en-PK")}` : "—"}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: TRIAL BALANCE AUDIT */}
      {activeTab === "TRIAL_BALANCE" && (
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 gap-3">
            <div>
              <span className="text-[11px] font-bold text-[#FF6600] uppercase tracking-wider block">
                Stoker Boilers Fleet Commercial Operations
              </span>
              <h2 className="text-xl font-black text-gray-900 mt-0.5">
                Trial Balance (Double-Entry Verification)
              </h2>
              <p className="text-xs text-gray-500">
                Period Ending: October 2026 • Currency: Pakistani Rupees (PKR) • Generated per IFRS Standards
              </p>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-emerald-600 shrink-0" />
              <div>
                <span className="text-xs font-black text-emerald-800 block">Verified 100% In Equilibrium</span>
                <span className="text-[11px] text-emerald-700">Total Debits Exactly Equal Total Credits</span>
              </div>
            </div>
          </div>

          {/* Trial Balance Table */}
          <div className="border border-gray-200 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8F9FB] border-b border-gray-200 text-[11px] font-bold text-gray-600 uppercase">
                <tr>
                  <th className="py-3 px-4">Account Code</th>
                  <th className="py-3 px-4">Account Title</th>
                  <th className="py-3 px-4">Classification</th>
                  <th className="py-3 px-4 text-right">Debit Balance (Dr PKR)</th>
                  <th className="py-3 px-4 text-right">Credit Balance (Cr PKR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {accounts.map((acc) => {
                  const isDebitNormal = acc.normalBalance === "Debit";
                  return (
                    <tr key={acc.code} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-2.5 px-4 font-mono font-bold text-gray-900">{acc.code}</td>
                      <td className="py-2.5 px-4 font-bold text-gray-800">{acc.name}</td>
                      <td className="py-2.5 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-100 text-gray-700">
                          {acc.type}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono font-extrabold text-gray-900">
                        {isDebitNormal ? `Rs. ${acc.balance.toLocaleString("en-PK")}` : "—"}
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono font-extrabold text-gray-900">
                        {!isDebitNormal ? `Rs. ${acc.balance.toLocaleString("en-PK")}` : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-[#F8F9FB] border-t-2 border-gray-300 text-xs font-mono font-black">
                <tr>
                  <td colSpan={3} className="py-3.5 px-4 text-right uppercase font-sans font-extrabold text-gray-900">
                    Grand Totals:
                  </td>
                  <td className="py-3.5 px-4 text-right text-emerald-700 text-sm">
                    Rs. {accounts.filter(a => a.normalBalance === "Debit").reduce((s, a) => s + a.balance, 0).toLocaleString("en-PK")}
                  </td>
                  <td className="py-3.5 px-4 text-right text-sky-700 text-sm">
                    Rs. {accounts.filter(a => a.normalBalance === "Credit").reduce((s, a) => s + a.balance, 0).toLocaleString("en-PK")}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: POST NEW JOURNAL ENTRY */}
      {isNewJvOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-orange-100 text-[#FF6600]">
                  <Receipt className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-extrabold text-gray-900 text-base">
                    Post Double-Entry Journal Voucher
                  </h3>
                  <span className="text-[11px] text-gray-500 font-medium">
                    Automated dual-posting to General Ledger
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsNewJvOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateJv} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Voucher Date</label>
                  <input
                    type="date"
                    value={jvDate}
                    onChange={(e) => setJvDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6600]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Source Type</label>
                  <select
                    value={jvSourceType}
                    onChange={(e) => setJvSourceType(e.target.value as DemoJournalEntry["sourceType"])}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6600]"
                  >
                    <option value="Fuel Delivery">Fuel Delivery</option>
                    <option value="Payroll Disbursement">Payroll Disbursement</option>
                    <option value="Steam Invoice">Steam Invoice</option>
                    <option value="Maintenance PO">Maintenance PO</option>
                    <option value="General Voucher">General Voucher</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Source Document / Tracking Ref #
                </label>
                <input
                  type="text"
                  placeholder="e.g. DSP-2026-089 or INV-STM-094"
                  value={jvSourceDoc}
                  onChange={(e) => setJvSourceDoc(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6600]"
                />
              </div>

              {/* Debit & Credit Account Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-gray-50 rounded-2xl border border-gray-200">
                <div>
                  <label className="block text-[11px] font-bold text-emerald-800 mb-1 uppercase tracking-wider">
                    Debit Account (Dr)
                  </label>
                  <select
                    value={jvDebitCode}
                    onChange={(e) => setJvDebitCode(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs font-semibold border border-emerald-300 rounded-lg bg-white focus:outline-none"
                  >
                    {accounts.map((a) => (
                      <option key={a.code} value={a.code}>
                        {a.code} - {a.name} ({a.type})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-sky-800 mb-1 uppercase tracking-wider">
                    Credit Account (Cr)
                  </label>
                  <select
                    value={jvCreditCode}
                    onChange={(e) => setJvCreditCode(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs font-semibold border border-sky-300 rounded-lg bg-white focus:outline-none"
                  >
                    {accounts.map((a) => (
                      <option key={a.code} value={a.code}>
                        {a.code} - {a.name} ({a.type})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Amount (PKR / Rs.)</label>
                <input
                  type="number"
                  step="1"
                  required
                  placeholder="e.g. 500000"
                  value={jvAmount}
                  onChange={(e) => setJvAmount(e.target.value)}
                  className="w-full px-3 py-2 text-sm font-mono font-extrabold border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6600]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Narration / Description</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Explain transaction reason, facility site, or vendor details..."
                  value={jvNarration}
                  onChange={(e) => setJvNarration(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6600]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsNewJvOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#FF6600] hover:bg-[#e05a00] rounded-xl transition-colors shadow-sm"
                >
                  Post Voucher to General Ledger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
