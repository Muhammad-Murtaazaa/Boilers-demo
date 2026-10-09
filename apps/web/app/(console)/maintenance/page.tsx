"use client";

import { useState, useEffect } from "react";
import {
  Wrench,
  Calendar,
  CheckCircle2,
  Clock,
  Plus,
  ShieldCheck,
  Search,
  Check,
  Flame,
  ArrowUpRight,
  TrendingUp,
  FileText,
  X,
} from "lucide-react";
import { DemoStore, DemoWorkOrder, DemoPMSchedule, DemoBoiler } from "../../demo-store";

export default function MaintenancePage() {
  const [activeTab, setActiveTab] = useState<"WORK_ORDERS" | "SCHEDULES" | "CERTIFICATES">("WORK_ORDERS");
  const [workOrders, setWorkOrders] = useState<DemoWorkOrder[]>([]);
  const [schedules, setSchedules] = useState<DemoPMSchedule[]>([]);
  const [boilers, setBoilers] = useState<DemoBoiler[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  // New Work Order Modal
  const [isWoModalOpen, setIsWoModalOpen] = useState(false);
  const [woBoilerId, setWoBoilerId] = useState("");
  const [woTitle, setWoTitle] = useState("");
  const [woCategory, setWoCategory] = useState<DemoWorkOrder["category"]>("Preventive");
  const [woPriority, setWoPriority] = useState<DemoWorkOrder["priority"]>("High");
  const [woTech, setWoTech] = useState("Liam Harper");
  const [woTargetDate, setWoTargetDate] = useState(new Date().toISOString().slice(0, 10));
  const [woDescription, setWoDescription] = useState("");
  const [woDowntime, setWoDowntime] = useState("3.5");
  const [woCost, setWoCost] = useState("350.00");
  const [woParts, setWoParts] = useState("High-Temp Flange Gaskets, Bearing Grease");

  // New PM Schedule Modal
  const [isPmModalOpen, setIsPmModalOpen] = useState(false);
  const [pmBoilerId, setPmBoilerId] = useState("");
  const [pmTaskName, setPmTaskName] = useState("");
  const [pmFrequency, setPmFrequency] = useState("30");
  const [pmCriticality, setPmCriticality] = useState<DemoPMSchedule["criticality"]>("High");
  const [pmRole, setPmRole] = useState("Maintenance Specialist");

  const refreshData = () => {
    setWorkOrders(DemoStore.getWorkOrders());
    setSchedules(DemoStore.getPMSchedules());
    const bList = DemoStore.getBoilers();
    setBoilers(bList);
    if (bList.length > 0 && bList[0] && !woBoilerId) {
      setWoBoilerId(bList[0].id);
      setPmBoilerId(bList[0].id);
    }
  };

  useEffect(() => {
    refreshData();
    const unsub = DemoStore.subscribe(refreshData);
    return () => unsub();
  }, []);

  const handleCreateWorkOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedB = boilers.find((b) => b.id === woBoilerId) || boilers[0];
    if (!selectedB) return;
    DemoStore.addWorkOrder({
      boilerId: selectedB.id,
      boilerModel: selectedB.model,
      siteName: selectedB.siteName,
      title: woTitle,
      category: woCategory,
      priority: woPriority,
      status: "In Progress",
      assignedTech: woTech,
      reportedDate: new Date().toISOString().slice(0, 10),
      targetCompletionDate: woTargetDate,
      description: woDescription,
      downtimeHours: parseFloat(woDowntime) || 0,
      estimatedCost: parseFloat(woCost) || 0,
      partsUsed: woParts,
    });
    setIsWoModalOpen(false);
    setWoTitle("");
    setWoDescription("");
  };

  const handleCreatePMSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedB = boilers.find((b) => b.id === pmBoilerId) || boilers[0];
    if (!selectedB) return;
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + parseInt(pmFrequency || "30"));

    DemoStore.addPMSchedule({
      boilerId: selectedB.id,
      boilerModel: selectedB.model,
      siteName: selectedB.siteName,
      taskName: pmTaskName,
      frequencyDays: parseInt(pmFrequency) || 30,
      nextDueDate: nextDate.toISOString().slice(0, 10),
      lastDoneDate: new Date().toISOString().slice(0, 10),
      criticality: pmCriticality,
      assignedRole: pmRole,
      status: "Optimal",
    });
    setIsPmModalOpen(false);
    setPmTaskName("");
  };

  const filteredWorkOrders = workOrders.filter((wo) => {
    const matchesFilter = statusFilter === "All" || wo.status === statusFilter;
    const matchesSearch =
      wo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wo.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wo.siteName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wo.boilerModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wo.assignedTech.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const activeWoCount = workOrders.filter((w) => w.status !== "Completed").length;
  const emergencyCount = workOrders.filter((w) => w.priority === "Emergency" && w.status !== "Completed").length;
  const totalCost = workOrders.reduce((sum, w) => sum + (w.estimatedCost || 0), 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-100 text-[#FF6600] uppercase tracking-wider">
              CMMS Plant Engineering
            </span>
            <span className="text-xs text-gray-500 font-medium">Enterprise Module</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 mt-1">
            Plant Maintenance & Work Orders
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Preventive routines, breakdown overhauls, IBR statutory inspections, and spare parts utilization.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPmModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-xl shadow-sm transition-all"
          >
            <Calendar className="w-4 h-4 text-gray-500" />
            <span>Schedule PM</span>
          </button>
          <button
            onClick={() => setIsWoModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#FF6600] hover:bg-[#E65C00] rounded-xl shadow-sm hover:shadow transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Work Order</span>
          </button>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Active Work Orders</span>
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#FF6600] flex items-center justify-center">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-gray-900">{activeWoCount}</div>
            <div className="flex items-center gap-1 text-[11px] font-medium text-amber-600 mt-1">
              <Clock className="w-3 h-3" />
              <span>{emergencyCount} Emergency priority</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Fleet Uptime</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-gray-900">99.4%</div>
            <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 mt-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>+0.3% vs target SLA</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">MTTR (Avg Repair)</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-gray-900">3.4 hrs</div>
            <div className="text-[11px] font-medium text-gray-500 mt-1">Industry benchmark: 4.8 hrs</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Maintenance Spend MTD</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-gray-900">${totalCost.toFixed(2)}</div>
            <div className="text-[11px] font-medium text-gray-500 mt-1">Parts & specialist contractor costs</div>
          </div>
        </div>
      </div>

      {/* Main Tabs Container */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
        {/* Navigation Tabs Bar */}
        <div className="flex border-b border-gray-200 bg-gray-50/60 px-4 sm:px-6 pt-3 gap-6">
          <button
            onClick={() => setActiveTab("WORK_ORDERS")}
            className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === "WORK_ORDERS"
                ? "border-[#FF6600] text-[#FF6600]"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>Work Orders ({workOrders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("SCHEDULES")}
            className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === "SCHEDULES"
                ? "border-[#FF6600] text-[#FF6600]"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Preventive Schedules ({schedules.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("CERTIFICATES")}
            className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === "CERTIFICATES"
                ? "border-[#FF6600] text-[#FF6600]"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Statutory & IBR Compliance</span>
          </button>
        </div>

        {/* Tab 1: Work Orders */}
        {activeTab === "WORK_ORDERS" && (
          <div className="p-4 sm:p-6 space-y-4">
            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search work orders, boilers, sites..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-[#FF6600]"
                />
              </div>

              <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                {["All", "In Progress", "Pending Parts", "Completed"].map((status) => (
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

            {/* Work Orders List Cards */}
            <div className="grid grid-cols-1 gap-3">
              {filteredWorkOrders.map((wo) => {
                const priorityBadgeClass =
                  wo.priority === "Emergency"
                    ? "bg-rose-100 text-rose-700 border-rose-200"
                    : wo.priority === "High"
                    ? "bg-orange-100 text-[#FF6600] border-orange-200"
                    : wo.priority === "Medium"
                    ? "bg-amber-100 text-amber-700 border-amber-200"
                    : "bg-gray-100 text-gray-700 border-gray-200";

                const statusBadgeClass =
                  wo.status === "Completed"
                    ? "bg-emerald-100 text-emerald-800"
                    : wo.status === "In Progress"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-purple-100 text-purple-800";

                return (
                  <div
                    key={wo.id}
                    className="p-4 sm:p-5 rounded-2xl border border-gray-200/90 hover:border-orange-300 hover:shadow-sm transition-all bg-white flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded-lg border border-gray-200">
                          {wo.code}
                        </span>
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${priorityBadgeClass}`}>
                          {wo.priority}
                        </span>
                        <span className="text-[11px] font-semibold text-gray-600 bg-gray-100 px-2.5 py-0.5 rounded-full">
                          {wo.category}
                        </span>
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${statusBadgeClass}`}>
                          {wo.status}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-sm sm:text-base font-bold text-gray-900">{wo.title}</h3>
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{wo.description}</p>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 pt-1">
                        <span className="font-medium text-gray-900 flex items-center gap-1">
                          <Flame className="w-3.5 h-3.5 text-[#FF6600]" />
                          {wo.boilerModel}
                        </span>
                        <span>•</span>
                        <span>Site: {wo.siteName}</span>
                        <span>•</span>
                        <span>Tech: <strong className="text-gray-700">{wo.assignedTech}</strong></span>
                        {wo.partsUsed && (
                          <>
                            <span>•</span>
                            <span className="text-gray-600">Parts: {wo.partsUsed}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 pt-3 md:pt-0 border-gray-100 gap-2 shrink-0">
                      <div className="text-left md:text-right">
                        <div className="text-sm font-extrabold text-gray-900">${wo.estimatedCost.toFixed(2)}</div>
                        <div className="text-[11px] text-gray-500">Est. Downtime: {wo.downtimeHours}h</div>
                      </div>

                      {wo.status !== "Completed" ? (
                        <button
                          onClick={() => DemoStore.updateWorkOrderStatus(wo.id, "Completed")}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Complete</span>
                        </button>
                      ) : (
                        <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Closed
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}

              {filteredWorkOrders.length === 0 && (
                <div className="text-center py-12 text-gray-400 text-xs">
                  No work orders found matching your criteria.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Preventive Schedules */}
        {activeTab === "SCHEDULES" && (
          <div className="p-4 sm:p-6 space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500 uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-3">Schedule Code</th>
                    <th className="py-3 px-3">Preventive Task Routine</th>
                    <th className="py-3 px-3">Target Boiler Unit</th>
                    <th className="py-3 px-3">Frequency</th>
                    <th className="py-3 px-3">Next Due Date</th>
                    <th className="py-3 px-3">Criticality</th>
                    <th className="py-3 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {schedules.map((sc) => (
                    <tr key={sc.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-gray-900">{sc.code}</td>
                      <td className="py-3 px-3 font-semibold text-gray-900">{sc.taskName}</td>
                      <td className="py-3 px-3 text-gray-600">
                        <div>{sc.boilerModel}</div>
                        <div className="text-[10px] text-gray-400">{sc.siteName}</div>
                      </td>
                      <td className="py-3 px-3 text-gray-700">Every {sc.frequencyDays} days</td>
                      <td className="py-3 px-3 font-medium text-gray-900">{sc.nextDueDate}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            sc.criticality === "Critical"
                              ? "bg-rose-100 text-rose-700"
                              : sc.criticality === "High"
                              ? "bg-orange-100 text-[#FF6600]"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {sc.criticality}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            sc.status === "Overdue"
                              ? "bg-rose-100 text-rose-700"
                              : sc.status === "Due Soon"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {sc.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Statutory & IBR Compliance */}
        {activeTab === "CERTIFICATES" && (
          <div className="p-4 sm:p-6 space-y-4">
            <div className="p-4 rounded-xl bg-orange-50 border border-orange-200 text-xs text-orange-900 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#FF6600] shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold">Boiler Safety Act & IBR Statutory Mandates</strong>
                <p className="mt-0.5 text-orange-800">
                  Industrial boilers operating at pressures exceeding 1.0 bar (15 psi) require annual hydrostatic certification by the Directorate of Boiler Inspection. Non-compliance results in statutory shutdown.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {boilers.map((b) => (
                <div key={b.id} className="p-4 rounded-2xl border border-gray-200 bg-white space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-extrabold text-sm text-gray-900">{b.model}</div>
                      <div className="font-mono text-xs text-gray-500">{b.code}</div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      IBR Valid
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 bg-gray-50 p-3 rounded-xl">
                    <div>
                      <div className="text-[10px] text-gray-400 font-medium">Design Pressure</div>
                      <div className="font-bold text-gray-900">16.0 Bar (Hydro 24 Bar)</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-400 font-medium">Inspectorate Seal</div>
                      <div className="font-bold text-gray-900">IBR-PK-2026-904</div>
                    </div>
                    <div className="mt-1">
                      <div className="text-[10px] text-gray-400 font-medium">Last Hydro Test</div>
                      <div className="font-medium text-gray-900">{b.installationDate}</div>
                    </div>
                    <div className="mt-1">
                      <div className="text-[10px] text-gray-400 font-medium">Annual Inspection Due</div>
                      <div className="font-bold text-orange-600">Nov 2026</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-xs">
                    <span className="text-gray-500">Facility: {b.siteName}</span>
                    <button className="text-[#FF6600] font-bold hover:underline flex items-center gap-1">
                      <span>View Certificate</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal: Create Work Order */}
      {isWoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-gray-100 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#FF6600] flex items-center justify-center">
                  <Wrench className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Create Maintenance Work Order</h2>
              </div>
              <button
                onClick={() => setIsWoModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateWorkOrder} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Target Boiler Deployment</label>
                <select
                  value={woBoilerId}
                  onChange={(e) => setWoBoilerId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {boilers.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.model} — {b.siteName} ({b.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Work Order Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Economizer Tube Descaling / Burner Nozzle Replacement"
                  value={woTitle}
                  onChange={(e) => setWoTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Work Order Category</label>
                  <select
                    value={woCategory}
                    onChange={(e) => setWoCategory(e.target.value as DemoWorkOrder["category"])}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="Preventive">Preventive Maintenance</option>
                    <option value="Corrective">Corrective Repair</option>
                    <option value="Emergency Breakdown">Emergency Breakdown</option>
                    <option value="Statutory Inspection">Statutory Inspection</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Priority Level</label>
                  <select
                    value={woPriority}
                    onChange={(e) => setWoPriority(e.target.value as DemoWorkOrder["priority"])}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="Emergency">Emergency</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Assigned Lead Technician</label>
                  <input
                    type="text"
                    required
                    value={woTech}
                    onChange={(e) => setWoTech(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Target Completion Date</label>
                  <input
                    type="date"
                    required
                    value={woTargetDate}
                    onChange={(e) => setWoTargetDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Est. Downtime (Hours)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={woDowntime}
                    onChange={(e) => setWoDowntime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Estimated Cost ($)</label>
                  <input
                    type="number"
                    step="1"
                    value={woCost}
                    onChange={(e) => setWoCost(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Spare Parts & Consumables Required</label>
                <input
                  type="text"
                  placeholder="e.g. Spiral Wound Gaskets, Descaler Chemical, Bearing 6205"
                  value={woParts}
                  onChange={(e) => setWoParts(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Root Cause & Diagnostic Notes</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detail symptoms, alarms triggered, pressure/temperature fluctuations..."
                  value={woDescription}
                  onChange={(e) => setWoDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsWoModalOpen(false)}
                  className="px-4 py-2 font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-[#FF6600] hover:bg-[#E65C00] rounded-xl shadow-sm"
                >
                  Dispatch Work Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Schedule PM */}
      {isPmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-gray-100 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#FF6600] flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Add Preventive Routine</h2>
              </div>
              <button
                onClick={() => setIsPmModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePMSchedule} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Target Boiler Deployment</label>
                <select
                  value={pmBoilerId}
                  onChange={(e) => setPmBoilerId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {boilers.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.model} ({b.siteName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Preventive Task Routine Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Monthly Soot Blower Packing Check"
                  value={pmTaskName}
                  onChange={(e) => setPmTaskName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Cycle Frequency (Days)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={pmFrequency}
                    onChange={(e) => setPmFrequency(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Criticality</label>
                  <select
                    value={pmCriticality}
                    onChange={(e) => setPmCriticality(e.target.value as DemoPMSchedule["criticality"])}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Assigned Qualified Role</label>
                <input
                  type="text"
                  required
                  value={pmRole}
                  onChange={(e) => setPmRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsPmModalOpen(false)}
                  className="px-4 py-2 font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-[#FF6600] hover:bg-[#E65C00] rounded-xl shadow-sm"
                >
                  Save Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
