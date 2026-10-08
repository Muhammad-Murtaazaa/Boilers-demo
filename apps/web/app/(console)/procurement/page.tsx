"use client";

import { useState, useEffect } from "react";
import {
  ShoppingBag,
  Truck,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Building,
  DollarSign,
  FileText,
  Star,
  Flame,
  ArrowRight,
  Filter,
  Check,
  X,
  Phone,
  Mail,
  AlertTriangle,
} from "lucide-react";
import { DemoStore, DemoPurchaseOrder, DemoSupplier, DemoBoiler } from "../../demo-store";

export default function ProcurementPage() {
  const [activeTab, setActiveTab] = useState<"ORDERS" | "SUPPLIERS" | "WEIGHBRIDGE">("ORDERS");
  const [purchaseOrders, setPurchaseOrders] = useState<DemoPurchaseOrder[]>([]);
  const [suppliers, setSuppliers] = useState<DemoSupplier[]>([]);
  const [boilers, setBoilers] = useState<DemoBoiler[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  // New PO Modal
  const [isPoModalOpen, setIsPoModalOpen] = useState(false);
  const [poSupplierId, setPoSupplierId] = useState("");
  const [poBoilerId, setPoBoilerId] = useState("");
  const [poTerms, setPoTerms] = useState("Net 30 Days");
  const [poItems, setPoItems] = useState([
    { description: "Rice Husk Biofuel Bulk (Grade A, <10% moisture)", qty: "20", uom: "Tonnes", unitPrice: "95.00" },
  ]);

  // New Supplier Modal
  const [isSupModalOpen, setIsSupModalOpen] = useState(false);
  const [supName, setSupName] = useState("");
  const [supCategory, setSupCategory] = useState<DemoSupplier["category"]>("Biomass Fuel");
  const [supContact, setSupContact] = useState("");
  const [supPhone, setSupPhone] = useState("");
  const [supEmail, setSupEmail] = useState("");
  const [supTerms, setSupTerms] = useState("Net 30 Days");

  const refreshData = () => {
    setPurchaseOrders(DemoStore.getPurchaseOrders());
    const sups = DemoStore.getSuppliers();
    setSuppliers(sups);
    const bList = DemoStore.getBoilers();
    setBoilers(bList);
    if (sups.length > 0 && sups[0] && !poSupplierId) {
      setPoSupplierId(sups[0].id);
    }
    if (bList.length > 0 && bList[0] && !poBoilerId) {
      setPoBoilerId(bList[0].id);
    }
  };

  useEffect(() => {
    refreshData();
    const unsub = DemoStore.subscribe(refreshData);
    return () => unsub();
  }, []);

  const handleAddLineItem = () => {
    setPoItems([...poItems, { description: "", qty: "1", uom: "Units", unitPrice: "0.00" }]);
  };

  const handleRemoveLineItem = (index: number) => {
    if (poItems.length > 1) {
      setPoItems(poItems.filter((_, i) => i !== index));
    }
  };

  const handleCreatePO = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedSup = suppliers.find((s) => s.id === poSupplierId) || suppliers[0];
    const selectedB = boilers.find((b) => b.id === poBoilerId) || boilers[0];
    if (!selectedSup || !selectedB) return;

    const lines = poItems.map((item) => {
      const q = parseFloat(item.qty) || 0;
      const p = parseFloat(item.unitPrice) || 0;
      return {
        description: item.description,
        qty: q,
        uom: item.uom,
        unitPrice: p,
        total: Number((q * p).toFixed(2)),
      };
    });

    const totalAmt = lines.reduce((acc, curr) => acc + curr.total, 0);
    const deliveryD = new Date();
    deliveryD.setDate(deliveryD.getDate() + (selectedSup.leadTimeDays || 3));

    DemoStore.addPurchaseOrder({
      supplierId: selectedSup.id,
      supplierName: selectedSup.name,
      siteName: selectedB.siteName,
      boilerId: selectedB.id,
      boilerModel: selectedB.model,
      issueDate: new Date().toISOString().slice(0, 10),
      deliveryDate: deliveryD.toISOString().slice(0, 10),
      items: lines,
      totalAmount: totalAmt,
      status: "Approved",
      paymentTerms: poTerms,
    });

    setIsPoModalOpen(false);
  };

  const handleCreateSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    DemoStore.addSupplier({
      name: supName,
      category: supCategory,
      contactPerson: supContact,
      phone: supPhone,
      email: supEmail,
      rating: 4.8,
      leadTimeDays: 3,
      status: "Approved",
      paymentTerms: supTerms,
    });
    setIsSupModalOpen(false);
    setSupName("");
    setSupContact("");
    setSupPhone("");
    setSupEmail("");
  };

  const filteredOrders = purchaseOrders.filter((po) => {
    const matchesFilter = statusFilter === "All" || po.status === statusFilter;
    const matchesSearch =
      po.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      po.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      po.siteName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      po.boilerModel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalPoSpend = purchaseOrders.reduce((sum, po) => sum + po.totalAmount, 0);
  const openOrdersCount = purchaseOrders.filter((po) => po.status !== "Closed" && po.status !== "Received & Verified").length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-100 text-[#FF6600] uppercase tracking-wider">
              Procurement & Supply Chain
            </span>
            <span className="text-xs text-gray-500 font-medium">Enterprise Module</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 mt-1">
            Fuel & Spare Parts Procurement
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Manage biomass fuel purchase contracts, vendor ratings, delivery lead times, and weighbridge verification.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSupModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-xl shadow-sm transition-all"
          >
            <Building className="w-4 h-4 text-gray-500" />
            <span>Onboard Supplier</span>
          </button>
          <button
            onClick={() => setIsPoModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#FF6600] hover:bg-[#E65C00] rounded-xl shadow-sm hover:shadow transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Purchase Order</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Open PO Commitments</span>
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#FF6600] flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-gray-900">${totalPoSpend.toFixed(2)}</div>
            <div className="text-[11px] font-medium text-gray-500 mt-1">{openOrdersCount} orders active / in transit</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Biofuel In-Transit</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-gray-900">35.0 Tonnes</div>
            <div className="text-[11px] font-medium text-blue-600 mt-1">2 Hino trucks arriving today</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Qualified Suppliers</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Building className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-gray-900">{suppliers.length} Vendors</div>
            <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 mt-1">
              <Star className="w-3 h-3 fill-emerald-600 text-emerald-600" />
              <span>4.8/5.0 Quality Rating</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Average Fuel Price</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-gray-900">$95.00/t</div>
            <div className="text-[11px] font-medium text-gray-500 mt-1">Rice husk baseline benchmark</div>
          </div>
        </div>
      </div>

      {/* Main Tabs Container */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
        {/* Navigation Tabs Bar */}
        <div className="flex border-b border-gray-200 bg-gray-50/60 px-4 sm:px-6 pt-3 gap-6">
          <button
            onClick={() => setActiveTab("ORDERS")}
            className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === "ORDERS"
                ? "border-[#FF6600] text-[#FF6600]"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Purchase Orders ({purchaseOrders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("SUPPLIERS")}
            className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === "SUPPLIERS"
                ? "border-[#FF6600] text-[#FF6600]"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            <Building className="w-4 h-4" />
            <span>Approved Suppliers ({suppliers.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("WEIGHBRIDGE")}
            className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === "WEIGHBRIDGE"
                ? "border-[#FF6600] text-[#FF6600]"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Weighbridge & GRN Matching</span>
          </button>
        </div>

        {/* Tab 1: Purchase Orders */}
        {activeTab === "ORDERS" && (
          <div className="p-4 sm:p-6 space-y-4">
            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search POs, vendors, sites..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-[#FF6600]"
                />
              </div>

              <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                {["All", "Approved", "In Transit", "Received & Verified"].map((status) => (
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

            {/* PO Cards */}
            <div className="grid grid-cols-1 gap-3">
              {filteredOrders.map((po) => {
                const statusBadgeClass =
                  po.status === "Received & Verified"
                    ? "bg-emerald-100 text-emerald-800"
                    : po.status === "In Transit"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-orange-100 text-orange-800";

                return (
                  <div
                    key={po.id}
                    className="p-4 sm:p-5 rounded-2xl border border-gray-200/90 hover:border-orange-300 hover:shadow-sm transition-all bg-white flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded-lg border border-gray-200">
                          {po.poNumber}
                        </span>
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${statusBadgeClass}`}>
                          {po.status}
                        </span>
                        <span className="text-[11px] font-medium text-gray-500">
                          Terms: {po.paymentTerms}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-sm sm:text-base font-bold text-gray-900">{po.supplierName}</h3>
                        <div className="text-xs text-gray-600 mt-1 space-y-0.5">
                          {po.items.map((line, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <span className="font-semibold text-gray-800">
                                {line.qty} {line.uom}
                              </span>
                              <span>× {line.description}</span>
                              <span className="text-gray-400">(@${line.unitPrice.toFixed(2)})</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 pt-1">
                        <span className="font-medium text-gray-900 flex items-center gap-1">
                          <Flame className="w-3.5 h-3.5 text-[#FF6600]" />
                          Destination: {po.boilerModel}
                        </span>
                        <span>•</span>
                        <span>Site: {po.siteName}</span>
                        <span>•</span>
                        <span>Expected Delivery: {po.deliveryDate}</span>
                      </div>
                    </div>

                    <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 pt-3 md:pt-0 border-gray-100 gap-2 shrink-0">
                      <div className="text-left md:text-right">
                        <div className="text-base font-extrabold text-gray-900">${po.totalAmount.toFixed(2)}</div>
                        <div className="text-[11px] text-gray-500">Issued: {po.issueDate}</div>
                      </div>

                      {po.status !== "Received & Verified" ? (
                        <button
                          onClick={() => DemoStore.updatePOStatus(po.id, "Received & Verified")}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Accept & Receive (GRN)</span>
                        </button>
                      ) : (
                        <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> GRN Stocked
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Approved Suppliers */}
        {activeTab === "SUPPLIERS" && (
          <div className="p-4 sm:p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {suppliers.map((s) => (
                <div key={s.id} className="p-4 rounded-2xl border border-gray-200 bg-white space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-sm text-gray-900">{s.name}</div>
                      <div className="text-xs text-[#FF6600] font-semibold">{s.category}</div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {s.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 bg-gray-50 p-3 rounded-xl">
                    <div>
                      <div className="text-[10px] text-gray-400 font-medium">Contact Person</div>
                      <div className="font-bold text-gray-900">{s.contactPerson}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-400 font-medium">Lead Time</div>
                      <div className="font-bold text-gray-900">{s.leadTimeDays} days</div>
                    </div>
                    <div className="mt-1">
                      <div className="text-[10px] text-gray-400 font-medium">Phone</div>
                      <div className="text-gray-900">{s.phone}</div>
                    </div>
                    <div className="mt-1">
                      <div className="text-[10px] text-gray-400 font-medium">Terms</div>
                      <div className="font-medium text-gray-900">{s.paymentTerms}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-xs">
                    <span className="text-gray-500 font-mono text-[11px]">{s.code}</span>
                    <div className="flex items-center gap-1 text-amber-600 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>{s.rating} Rating</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Weighbridge & GRN Matching */}
        {activeTab === "WEIGHBRIDGE" && (
          <div className="p-4 sm:p-6 space-y-4">
            <div className="p-4 rounded-xl bg-orange-50 border border-orange-200 text-xs text-orange-900 flex items-start gap-3">
              <Truck className="w-5 h-5 text-[#FF6600] shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold">Automated Dispute Protection (&gt;2% Variance Rule)</strong>
                <p className="mt-0.5 text-orange-800">
                  Deliveries with net weighbridge discrepancies exceeding 2.0% between supplier dispatch slip and on-site gross-tare weighment automatically trigger vendor debit notes and hold payment approval.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500 uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-3">Delivery Ticket</th>
                    <th className="py-3 px-3">Supplier & Material</th>
                    <th className="py-3 px-3">Vehicle #</th>
                    <th className="py-3 px-3">Dispatched Wt</th>
                    <th className="py-3 px-3">Weighed Wt</th>
                    <th className="py-3 px-3">Variance</th>
                    <th className="py-3 px-3">GRN Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr className="hover:bg-gray-50">
                    <td className="py-3 px-3 font-mono font-bold text-gray-900">DEL-RVR-004</td>
                    <td className="py-3 px-3 font-medium text-gray-900">
                      <div>Indus Agro Biofuels</div>
                      <div className="text-[10px] text-gray-400">Rice Husk Bulk</div>
                    </td>
                    <td className="py-3 px-3 text-gray-700">LES-9921 (Hino 500)</td>
                    <td className="py-3 px-3">10,000 kg</td>
                    <td className="py-3 px-3 font-bold text-gray-900">9,800 kg</td>
                    <td className="py-3 px-3 text-emerald-700 font-semibold">-200 kg (-2.0%)</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        Accepted
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="py-3 px-3 font-mono font-bold text-gray-900">DEL-FSD-001</td>
                    <td className="py-3 px-3 font-medium text-gray-900">
                      <div>GreenBio Fuels</div>
                      <div className="text-[10px] text-gray-400">Cotton Briquettes</div>
                    </td>
                    <td className="py-3 px-3 text-gray-700">FD-4410 (Bedford)</td>
                    <td className="py-3 px-3">10,000 kg</td>
                    <td className="py-3 px-3 font-bold text-rose-700">9,450 kg</td>
                    <td className="py-3 px-3 text-rose-700 font-bold">-550 kg (-5.5%)</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                        Auto-Disputed
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Create Purchase Order */}
      {isPoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-gray-100 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#FF6600] flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Create Purchase Order</h2>
              </div>
              <button
                onClick={() => setIsPoModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePO} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Approved Vendor</label>
                  <select
                    value={poSupplierId}
                    onChange={(e) => setPoSupplierId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {suppliers.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.category})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Destination Facility</label>
                  <select
                    value={poBoilerId}
                    onChange={(e) => setPoBoilerId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {boilers.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.model} — {b.siteName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Commercial Payment Terms</label>
                <select
                  value={poTerms}
                  onChange={(e) => setPoTerms(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="Net 30 Days">Net 30 Days</option>
                  <option value="Net 15 Days">Net 15 Days</option>
                  <option value="Immediate Cash on Delivery">Immediate Cash on Delivery</option>
                  <option value="Advance Bank Transfer">Advance Bank Transfer</option>
                </select>
              </div>

              {/* Line Items */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900">PO Line Items</span>
                  <button
                    type="button"
                    onClick={handleAddLineItem}
                    className="text-[#FF6600] font-bold hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Item
                  </button>
                </div>

                {poItems.map((item, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-xl space-y-2 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-gray-500">Item #{index + 1}</span>
                      {poItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveLineItem(index)}
                          className="text-rose-600 hover:text-rose-800 text-[11px] font-semibold"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="Item description (e.g. Rice Husk Bulk Grade A)"
                      value={item.description}
                      onChange={(e) => {
                        const copy = [...poItems];
                        if (copy[index]) {
                          copy[index].description = e.target.value;
                          setPoItems(copy);
                        }
                      }}
                      className="w-full px-3 py-1.5 rounded-lg border border-gray-300 bg-white"
                    />
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-[10px] text-gray-400">Quantity</label>
                        <input
                          type="number"
                          step="0.1"
                          required
                          value={item.qty}
                          onChange={(e) => {
                            const copy = [...poItems];
                            if (copy[index]) {
                              copy[index].qty = e.target.value;
                              setPoItems(copy);
                            }
                          }}
                          className="w-full px-2 py-1 rounded-lg border border-gray-300 bg-white"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-400">UoM</label>
                        <input
                          type="text"
                          required
                          value={item.uom}
                          onChange={(e) => {
                            const copy = [...poItems];
                            if (copy[index]) {
                              copy[index].uom = e.target.value;
                              setPoItems(copy);
                            }
                          }}
                          className="w-full px-2 py-1 rounded-lg border border-gray-300 bg-white"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-400">Unit Price ($)</label>
                        <input
                          type="number"
                          step="0.01"
                          required
                          value={item.unitPrice}
                          onChange={(e) => {
                            const copy = [...poItems];
                            if (copy[index]) {
                              copy[index].unitPrice = e.target.value;
                              setPoItems(copy);
                            }
                          }}
                          className="w-full px-2 py-1 rounded-lg border border-gray-300 bg-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsPoModalOpen(false)}
                  className="px-4 py-2 font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-[#FF6600] hover:bg-[#E65C00] rounded-xl shadow-sm"
                >
                  Authorize & Issue PO
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Onboard Supplier */}
      {isSupModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-gray-100 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#FF6600] flex items-center justify-center">
                  <Building className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Onboard Approved Supplier</h2>
              </div>
              <button
                onClick={() => setIsSupModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSupplier} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Company / Legal Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Punjab Biomass Aggregators Ltd"
                  value={supName}
                  onChange={(e) => setSupName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Supply Category</label>
                <select
                  value={supCategory}
                  onChange={(e) => setSupCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="Biomass Fuel">Biomass Fuel (Rice Husk, Briquettes, Wood Pellets)</option>
                  <option value="Water Chemistry">Water Chemistry Chemicals (Inhibitors, Biocides)</option>
                  <option value="Valves & Controls">Valves & Controls (Safety valves, Actuators)</option>
                  <option value="Refractory & Piping">Refractory & Piping (Castables, Insulation)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Contact Person</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tariq Mehmood"
                  value={supContact}
                  onChange={(e) => setSupContact(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Phone</label>
                  <input
                    type="text"
                    required
                    placeholder="+92 300 1234567"
                    value={supPhone}
                    onChange={(e) => setSupPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="sales@vendor.com"
                    value={supEmail}
                    onChange={(e) => setSupEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsSupModalOpen(false)}
                  className="px-4 py-2 font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-[#FF6600] hover:bg-[#E65C00] rounded-xl shadow-sm"
                >
                  Save Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
