"use client";

import { useState, useEffect } from "react";
import {
  FileText,
  DollarSign,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Printer,
  Download,
  AlertCircle,
  Building,
  Flame,
  Check,
  X,
  CreditCard,
  Send,
  Eye,
  Receipt,
} from "lucide-react";
import { DemoStore, DemoSteamInvoice, DemoBoiler } from "../../demo-store";

export default function InvoicingPage() {
  const [invoices, setInvoices] = useState<DemoSteamInvoice[]>([]);
  const [boilers, setBoilers] = useState<DemoBoiler[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  // New Invoice Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [invBoilerId, setInvBoilerId] = useState("");
  const [invPeriod, setInvPeriod] = useState("October 2026");
  const [invTonnage, setInvTonnage] = useState("1250.0");
  const [invTariff, setInvTariff] = useState("37.00");
  const [invSurcharge, setInvSurcharge] = useState("1100.00");
  const [invDueDate, setInvDueDate] = useState(new Date().toISOString().slice(0, 10));

  // Invoice Preview Modal
  const [previewInvoice, setPreviewInvoice] = useState<DemoSteamInvoice | null>(null);

  const refreshData = () => {
    setInvoices(DemoStore.getInvoices());
    const bList = DemoStore.getBoilers();
    setBoilers(bList);
    if (bList.length > 0 && bList[0] && !invBoilerId) {
      setInvBoilerId(bList[0].id);
    }
  };

  useEffect(() => {
    refreshData();
    const unsub = DemoStore.subscribe(refreshData);
    return () => unsub();
  }, []);

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedB = boilers.find((b) => b.id === invBoilerId) || boilers[0];
    if (!selectedB) return;
    const tons = parseFloat(invTonnage) || 0;
    const tariff = parseFloat(invTariff) || 0;
    const surcharge = parseFloat(invSurcharge) || 0;
    const subtotal = Number((tons * tariff + surcharge).toFixed(2));
    const tax = Number((subtotal * 0.16).toFixed(2));
    const total = Number((subtotal + tax).toFixed(2));

    DemoStore.addInvoice({
      clientName: selectedB.clientName,
      siteName: selectedB.siteName,
      boilerId: selectedB.id,
      boilerModel: selectedB.model,
      billingPeriod: invPeriod,
      steamTonnage: tons,
      tariffPerTon: tariff,
      fuelSurcharge: surcharge,
      subtotal,
      taxAmount: tax,
      totalAmount: total,
      status: "Pending",
      dueDate: invDueDate,
    });

    setIsModalOpen(false);
  };

  const filteredInvoices = invoices.filter((inv) => {
    const matchesFilter = statusFilter === "All" || inv.status === statusFilter;
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.siteName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.boilerModel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalBilled = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const totalTonnage = invoices.reduce((sum, inv) => sum + inv.steamTonnage, 0);
  const outstandingAmount = invoices
    .filter((inv) => inv.status !== "Paid")
    .reduce((sum, inv) => sum + inv.totalAmount, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-100 text-[#FF6600] uppercase tracking-wider">
              Steam-as-a-Service Billing
            </span>
            <span className="text-xs text-gray-500 font-medium">Enterprise Module</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 mt-1">
            Commercial Steam Invoicing (AR)
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Automated metered billing based on telemetry steam generation, tariff rate schedules, and fuel surcharges.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#FF6600] hover:bg-[#E65C00] rounded-xl shadow-sm hover:shadow transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Generate Steam Invoice</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Gross Billed</span>
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#FF6600] flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-gray-900">${totalBilled.toFixed(2)}</div>
            <div className="text-[11px] font-medium text-emerald-600 mt-1">Across {invoices.length} industrial contracts</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Steam Delivered</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-gray-900">{totalTonnage.toLocaleString()} Tonnes</div>
            <div className="text-[11px] font-medium text-blue-600 mt-1">High-pressure saturated steam</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Outstanding AR</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-rose-600">${outstandingAmount.toFixed(2)}</div>
            <div className="text-[11px] font-medium text-gray-500 mt-1">Pending client reconciliation</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Avg Steam Tariff</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-gray-900">$37.38 / Ton</div>
            <div className="text-[11px] font-medium text-gray-500 mt-1">Contract indexed to biomass index</div>
          </div>
        </div>
      </div>

      {/* Invoices List Container */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden p-4 sm:p-6 space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search invoices, clients, sites..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-[#FF6600]"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {["All", "Pending", "Paid", "Overdue"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  statusFilter === status
                    ? "bg-[#181B20] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Invoice Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-3">Invoice #</th>
                <th className="py-3 px-3">Client & Operating Site</th>
                <th className="py-3 px-3">Billing Cycle</th>
                <th className="py-3 px-3">Steam Output</th>
                <th className="py-3 px-3">Tariff & Surcharge</th>
                <th className="py-3 px-3">Total Due (Inc Tax)</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredInvoices.map((inv) => {
                const statusBadge =
                  inv.status === "Paid"
                    ? "bg-emerald-100 text-emerald-800"
                    : inv.status === "Overdue"
                    ? "bg-rose-100 text-rose-800"
                    : "bg-amber-100 text-amber-800";

                return (
                  <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-gray-900">{inv.invoiceNumber}</td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-gray-900">{inv.clientName}</div>
                      <div className="text-[10px] text-gray-400">{inv.siteName}</div>
                    </td>
                    <td className="py-3 px-3 font-medium text-gray-700">{inv.billingPeriod}</td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-gray-900">{inv.steamTonnage.toLocaleString()}</span> Tonnes
                    </td>
                    <td className="py-3 px-3 text-gray-600">
                      <div>${inv.tariffPerTon.toFixed(2)} / t</div>
                      <div className="text-[10px] text-gray-400">+${inv.fuelSurcharge.toFixed(2)} fuel</div>
                    </td>
                    <td className="py-3 px-3 font-extrabold text-gray-900 text-sm">
                      ${inv.totalAmount.toFixed(2)}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${statusBadge}`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setPreviewInvoice(inv)}
                          title="View Statement"
                          className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {inv.status !== "Paid" && (
                          <button
                            onClick={() => DemoStore.markInvoicePaid(inv.id)}
                            className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
                          >
                            <Check className="w-3 h-3" />
                            <span>Mark Paid</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create Steam Invoice */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-gray-100 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#FF6600] flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Generate Commercial Steam Bill</h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Target Client Boiler Unit</label>
                <select
                  value={invBoilerId}
                  onChange={(e) => setInvBoilerId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {boilers.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.clientName} — {b.model} ({b.siteName})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Billing Period</label>
                  <input
                    type="text"
                    required
                    value={invPeriod}
                    onChange={(e) => setInvPeriod(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Payment Due Date</label>
                  <input
                    type="date"
                    required
                    value={invDueDate}
                    onChange={(e) => setInvDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Steam Output (Tons)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={invTonnage}
                    onChange={(e) => setInvTonnage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Tariff ($/Ton)</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={invTariff}
                    onChange={(e) => setInvTariff(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Fuel Surcharge ($)</label>
                  <input
                    type="number"
                    step="10"
                    value={invSurcharge}
                    onChange={(e) => setInvSurcharge(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Calculated Summary */}
              <div className="p-3 bg-gray-50 rounded-xl space-y-1.5 border border-gray-200">
                <div className="flex justify-between text-gray-600">
                  <span>Steam Energy Subtotal:</span>
                  <span className="font-semibold text-gray-900">
                    ${((parseFloat(invTonnage) || 0) * (parseFloat(invTariff) || 0) + (parseFloat(invSurcharge) || 0)).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Sales Tax (16% Provincial):</span>
                  <span className="font-semibold text-gray-900">
                    ${(((parseFloat(invTonnage) || 0) * (parseFloat(invTariff) || 0) + (parseFloat(invSurcharge) || 0)) * 0.16).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-gray-900 pt-1 border-t border-gray-200">
                  <span>Total Amount Due:</span>
                  <span className="text-[#FF6600]">
                    ${(((parseFloat(invTonnage) || 0) * (parseFloat(invTariff) || 0) + (parseFloat(invSurcharge) || 0)) * 1.16).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-[#FF6600] hover:bg-[#E65C00] rounded-xl shadow-sm"
                >
                  Issue Commercial Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Invoice Statement Preview */}
      {previewInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-gray-100 p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FF6600] flex items-center justify-center text-white">
                  <Flame className="w-6 h-6 fill-white text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-gray-900">Stoker Boilers Operations</h3>
                  <p className="text-xs text-gray-500">Steam-as-a-Service Energy Utility</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-gray-900">{previewInvoice.invoiceNumber}</div>
                <div className="text-xs text-gray-500">Due: {previewInvoice.dueDate}</div>
                <span
                  className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    previewInvoice.status === "Paid"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {previewInvoice.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-gray-50 p-3 rounded-xl">
                <div className="font-semibold text-gray-500 uppercase tracking-wider text-[10px]">Billed To:</div>
                <div className="text-sm font-bold text-gray-900 mt-1">{previewInvoice.clientName}</div>
                <div className="text-gray-600 mt-0.5">{previewInvoice.siteName}</div>
                <div className="text-gray-500 text-[11px] mt-1">Stationed Boiler: {previewInvoice.boilerModel}</div>
              </div>

              <div className="bg-gray-50 p-3 rounded-xl">
                <div className="font-semibold text-gray-500 uppercase tracking-wider text-[10px]">Payment Settlement:</div>
                <div className="text-xs font-medium text-gray-900 mt-1">Stoker Energy Utilities Ltd</div>
                <div className="text-gray-600 mt-0.5">IBAN: PK36MEZN00010048291039</div>
                <div className="text-gray-500 text-[11px] mt-1">Meezan Bank Ltd, Corporate Branch</div>
              </div>
            </div>

            {/* Line Items */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-500 uppercase text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">Service Description</th>
                    <th className="py-2.5 px-3 text-right">Quantity</th>
                    <th className="py-2.5 px-3 text-right">Tariff Rate</th>
                    <th className="py-2.5 px-3 text-right">Line Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-800">
                  <tr>
                    <td className="py-2.5 px-3">High-Pressure Saturated Steam Supply ({previewInvoice.billingPeriod})</td>
                    <td className="py-2.5 px-3 text-right">{previewInvoice.steamTonnage.toLocaleString()} Tonnes</td>
                    <td className="py-2.5 px-3 text-right">${previewInvoice.tariffPerTon.toFixed(2)} / t</td>
                    <td className="py-2.5 px-3 text-right font-medium">
                      ${(previewInvoice.steamTonnage * previewInvoice.tariffPerTon).toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3">Biomass Fuel Price Indexation Surcharge</td>
                    <td className="py-2.5 px-3 text-right">1 Job</td>
                    <td className="py-2.5 px-3 text-right">${previewInvoice.fuelSurcharge.toFixed(2)}</td>
                    <td className="py-2.5 px-3 text-right font-medium">${previewInvoice.fuelSurcharge.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex flex-col items-end text-xs space-y-1">
              <div className="flex justify-between w-64 text-gray-600">
                <span>Subtotal:</span>
                <span className="font-semibold text-gray-900">${previewInvoice.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between w-64 text-gray-600">
                <span>Sales Tax (16%):</span>
                <span className="font-semibold text-gray-900">${previewInvoice.taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between w-64 text-base font-extrabold text-gray-900 pt-2 border-t border-gray-200">
                <span>Total Amount:</span>
                <span className="text-[#FF6600]">${previewInvoice.totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Print Statement</span>
              </button>

              <button
                onClick={() => setPreviewInvoice(null)}
                className="px-5 py-2 text-xs font-bold text-white bg-[#181B20] hover:bg-black rounded-xl"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
