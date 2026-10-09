"use client";

import { useState, useEffect } from "react";
import {
  TestTube2,
  Droplets,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Search,
  ShieldCheck,
  X,
  Activity,
} from "lucide-react";
import { DemoStore, DemoWaterTest, DemoBoiler } from "../../demo-store";

export default function LabPage() {
  const [waterTests, setWaterTests] = useState<DemoWaterTest[]>([]);
  const [boilers, setBoilers] = useState<DemoBoiler[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  // New Test Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [labBoilerId, setLabBoilerId] = useState("");
  const [labPoint, setLabPoint] = useState<DemoWaterTest["samplePoint"]>("Boiler Feed Water");
  const [labAnalyst, setLabAnalyst] = useState("Zubair Khan (Chemist)");
  const [labPH, setLabPH] = useState("9.2");
  const [labTDS, setLabTDS] = useState("2100");
  const [labHardness, setLabHardness] = useState("0.5");
  const [labPhosphate, setLabPhosphate] = useState("40.0");
  const [labOxygen, setLabOxygen] = useState("5.0");
  const [labAction, setLabAction] = useState("Chemical dosing pump feed rates normal.");

  const refreshData = () => {
    setWaterTests(DemoStore.getWaterTests());
    const bList = DemoStore.getBoilers();
    setBoilers(bList);
    if (bList.length > 0 && bList[0] && !labBoilerId) {
      setLabBoilerId(bList[0].id);
    }
  };

  useEffect(() => {
    refreshData();
    const unsub = DemoStore.subscribe(refreshData);
    return () => unsub();
  }, []);

  const handleCreateTest = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedB = boilers.find((b) => b.id === labBoilerId) || boilers[0];
    if (!selectedB) return;
    const ph = parseFloat(labPH) || 0;
    const tds = parseFloat(labTDS) || 0;
    const hardness = parseFloat(labHardness) || 0;

    let status: DemoWaterTest["status"] = "Compliant";
    if (tds > 3000 || hardness > 2.0 || ph > 11.5 || ph < 8.0) {
      status = "Action Required";
    } else if (tds > 2500 || hardness > 1.0) {
      status = "Out of Spec";
    }

    DemoStore.addWaterTest({
      boilerId: selectedB.id,
      boilerModel: selectedB.model,
      siteName: selectedB.siteName,
      analyst: labAnalyst,
      samplePoint: labPoint,
      pH: ph,
      tdsPpm: tds,
      hardnessPpm: hardness,
      phosphatePpm: parseFloat(labPhosphate) || 0,
      dissolvedOxygenPpb: parseFloat(labOxygen) || 0,
      status,
      correctiveAction: labAction,
    });

    setIsModalOpen(false);
  };

  const filteredTests = waterTests.filter((test) => {
    const matchesFilter = statusFilter === "All" || test.status === statusFilter;
    const matchesSearch =
      test.sampleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.boilerModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.siteName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.analyst.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const compliantCount = waterTests.filter((t) => t.status === "Compliant").length;
  const criticalCount = waterTests.filter((t) => t.status === "Action Required").length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-100 text-[#FF6600] uppercase tracking-wider">
              Water Chemistry & Quality Lab
            </span>
            <span className="text-xs text-gray-500 font-medium">Enterprise Module</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 mt-1">
            Boiler Feed Water & Chemistry Lab
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Routine chemical testing, hardness titration, oxygen scavenging monitoring, and blowdown TDS management.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#FF6600] hover:bg-[#E65C00] rounded-xl shadow-sm hover:shadow transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Log Water Analysis Test</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Water Quality Index</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-gray-900">96.2%</div>
            <div className="text-[11px] font-medium text-emerald-600 mt-1">
              {compliantCount} compliant samples
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Chemistry Alarms</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-rose-600">{criticalCount} Urgent</div>
            <div className="text-[11px] font-medium text-gray-500 mt-1">1 unit requires blowdown adjustment</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Condensate Recovery</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Droplets className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-gray-900">86.5%</div>
            <div className="text-[11px] font-medium text-blue-600 mt-1">Avg return purity &lt;20 ppm TDS</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Softener Cycles</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-gray-900">0.0 ppm</div>
            <div className="text-[11px] font-medium text-gray-500 mt-1">Zero hardness at boiler feed inlet</div>
          </div>
        </div>
      </div>

      {/* Recommended Operating Ranges Guide */}
      <div className="bg-gradient-to-r from-orange-50/70 to-amber-50/70 border border-orange-200/70 p-4 rounded-2xl">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="w-4 h-4 text-[#FF6600]" />
          <span className="font-bold text-xs text-gray-900">Standard ASME & ABMA Boiler Chemistry Guidelines</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-gray-700">
          <div className="bg-white/80 p-2.5 rounded-xl border border-orange-100">
            <span className="text-[10px] text-gray-500 font-semibold block">Feed Water pH:</span>
            <strong className="text-gray-900 font-bold">8.5 – 9.5</strong>
          </div>
          <div className="bg-white/80 p-2.5 rounded-xl border border-orange-100">
            <span className="text-[10px] text-gray-500 font-semibold block">Drum Water Max TDS:</span>
            <strong className="text-gray-900 font-bold">&lt; 3,000 ppm</strong>
          </div>
          <div className="bg-white/80 p-2.5 rounded-xl border border-orange-100">
            <span className="text-[10px] text-gray-500 font-semibold block">Total Feed Hardness:</span>
            <strong className="text-gray-900 font-bold">&lt; 1.0 ppm CaCO3</strong>
          </div>
          <div className="bg-white/80 p-2.5 rounded-xl border border-orange-100">
            <span className="text-[10px] text-gray-500 font-semibold block">Phosphate Reserve:</span>
            <strong className="text-gray-900 font-bold">30 – 50 ppm</strong>
          </div>
        </div>
      </div>

      {/* Test Log Table Container */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden p-4 sm:p-6 space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search tests, boilers, analysts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-[#FF6600]"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {["All", "Compliant", "Action Required"].map((status) => (
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

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-3">Sample Code</th>
                <th className="py-3 px-3">Target Boiler & Site</th>
                <th className="py-3 px-3">Sampling Point</th>
                <th className="py-3 px-3">pH Level</th>
                <th className="py-3 px-3">TDS (ppm)</th>
                <th className="py-3 px-3">Hardness</th>
                <th className="py-3 px-3">Phosphate</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Action Recorded</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTests.map((test) => {
                const statusBadge =
                  test.status === "Compliant"
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-rose-100 text-rose-800";

                return (
                  <tr key={test.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-gray-900">
                      <div>{test.sampleNumber}</div>
                      <div className="text-[10px] text-gray-400 font-normal">{test.testedAt}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-gray-900">{test.boilerModel}</div>
                      <div className="text-[10px] text-gray-500">{test.siteName}</div>
                    </td>
                    <td className="py-3 px-3 font-medium text-gray-700">{test.samplePoint}</td>
                    <td className="py-3 px-3 font-bold text-gray-900">{test.pH.toFixed(1)}</td>
                    <td className="py-3 px-3">
                      <span className={`font-bold ${test.tdsPpm > 3000 ? "text-rose-600" : "text-gray-900"}`}>
                        {test.tdsPpm.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`font-bold ${test.hardnessPpm > 2 ? "text-rose-600" : "text-gray-900"}`}>
                        {test.hardnessPpm} ppm
                      </span>
                    </td>
                    <td className="py-3 px-3 text-gray-700">{test.phosphatePpm} ppm</td>
                    <td className="py-3 px-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${statusBadge}`}>
                        {test.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-gray-600 max-w-xs truncate">
                      {test.correctiveAction || "None"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Log Water Test */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-gray-100 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#FF6600] flex items-center justify-center">
                  <TestTube2 className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Record Water Analysis Test</h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTest} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Target Boiler Deployment</label>
                  <select
                    value={labBoilerId}
                    onChange={(e) => setLabBoilerId(e.target.value)}
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
                  <label className="block font-semibold text-gray-700 mb-1">Sample Point</label>
                  <select
                    value={labPoint}
                    onChange={(e) => setLabPoint(e.target.value as DemoWaterTest["samplePoint"])}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="Boiler Feed Water">Boiler Feed Water</option>
                    <option value="Drum Water">Boiler Drum Water</option>
                    <option value="Condensate Return">Condensate Return</option>
                    <option value="Softener Effluent">Water Softener Effluent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Chemist / Lab Analyst</label>
                <input
                  type="text"
                  required
                  value={labAnalyst}
                  onChange={(e) => setLabAnalyst(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">pH Level</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={labPH}
                    onChange={(e) => setLabPH(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">TDS (ppm)</label>
                  <input
                    type="number"
                    step="10"
                    required
                    value={labTDS}
                    onChange={(e) => setLabTDS(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Hardness (ppm)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={labHardness}
                    onChange={(e) => setLabHardness(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Phosphate PO4 (ppm)</label>
                  <input
                    type="number"
                    step="1"
                    value={labPhosphate}
                    onChange={(e) => setLabPhosphate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Dissolved O2 (ppb)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={labOxygen}
                    onChange={(e) => setLabOxygen(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Corrective Action & Dosage Adjustments</label>
                <textarea
                  rows={2}
                  value={labAction}
                  onChange={(e) => setLabAction(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
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
                  Commit Lab Result
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
