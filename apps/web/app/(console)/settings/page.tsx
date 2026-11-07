"use client";

import { useState, useEffect } from "react";
import {
  Boxes,
  Plus,
  Trash2,
  Users,
  ShieldCheck,
  Sliders,
  CheckCircle2,
  Building2,
  Flame,
  Check,
  X,
  Lock,
  Tag,
  Scale,
  Sparkles,
} from "lucide-react";
import {
  DemoStore,
  DemoStockCategory,
  DemoStockUnit,
  DemoUserAccount,
  DemoRolePermissions,
  DemoBoiler,
} from "../../demo-store";

export default function SettingsConsolePage() {
  const [activeTab, setActiveTab] = useState<"CATEGORIES_UNITS" | "USERS" | "PERMISSIONS" | "GENERAL">("CATEGORIES_UNITS");
  
  // Data State
  const [categories, setCategories] = useState<DemoStockCategory[]>([]);
  const [units, setUnits] = useState<DemoStockUnit[]>([]);
  const [users, setUsers] = useState<DemoUserAccount[]>([]);
  const [permissions, setPermissions] = useState<Record<string, DemoRolePermissions>>({});
  const [boilers, setBoilers] = useState<DemoBoiler[]>([]);
  const [activeUser, setActiveUser] = useState<DemoUserAccount | null>(null);

  // General Settings State
  const [currency, setCurrency] = useState("PKR (Rs.)");
  const [tolerancePct, setTolerancePct] = useState("2.0");
  const [supervisorThreshold, setSupervisorThreshold] = useState("25000.00");
  const [autoApproveLimit, setAutoApproveLimit] = useState("5000.00");
  const [savedNotification, setSavedNotification] = useState("");

  // Modals
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [catName, setCatName] = useState("");
  const [catCode, setCatCode] = useState("");
  const [catDesc, setCatDesc] = useState("");

  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
  const [unitName, setUnitName] = useState("");
  const [unitAbbr, setUnitAbbr] = useState("");
  const [unitType, setUnitType] = useState<DemoStockUnit["type"]>("Weight");

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState<DemoUserAccount["role"]>("Boiler Foreman");
  const [userSite, setUserSite] = useState("Apex Textile Mills - Sector 4");
  const [userBoilerId, setUserBoilerId] = useState("");
  const [userPhone, setUserPhone] = useState("+92 300 ");

  const refreshData = () => {
    setCategories(DemoStore.getStockCategories());
    setUnits(DemoStore.getStockUnits());
    setUsers(DemoStore.getUserAccounts());
    setPermissions(DemoStore.getRolePermissions());
    const bList = DemoStore.getBoilers();
    setBoilers(bList);
    setActiveUser(DemoStore.getActiveUser());
    if (bList.length > 0 && !userBoilerId) {
      setUserBoilerId(bList[0]?.id || "");
    }
  };

  useEffect(() => {
    refreshData();
    const unsub = DemoStore.subscribe(refreshData);
    return () => unsub();
  }, []);

  const showSavedBadge = (msg: string) => {
    setSavedNotification(msg);
    setTimeout(() => setSavedNotification(""), 3500);
  };

  // Category Actions
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName || !catCode) return;
    DemoStore.addStockCategory({
      name: catName,
      code: catCode,
      description: catDesc || `${catName} industrial stock items`,
    });
    setCatName("");
    setCatCode("");
    setCatDesc("");
    setIsCatModalOpen(false);
    showSavedBadge("Stock category added successfully!");
  };

  const handleDeleteCategory = (id: string) => {
    if (confirm("Are you sure you want to delete this custom category?")) {
      DemoStore.deleteStockCategory(id);
      showSavedBadge("Category removed.");
    }
  };

  // Unit Actions
  const handleAddUnit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!unitName || !unitAbbr) return;
    DemoStore.addStockUnit({
      name: unitName,
      abbreviation: unitAbbr,
      type: unitType,
    });
    setUnitName("");
    setUnitAbbr("");
    setIsUnitModalOpen(false);
    showSavedBadge("Stock unit created successfully!");
  };

  const handleDeleteUnit = (id: string) => {
    if (confirm("Are you sure you want to delete this unit of measure?")) {
      DemoStore.deleteStockUnit(id);
      showSavedBadge("Stock unit deleted.");
    }
  };

  // User Actions
  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName || !userEmail) return;
    const selectedBoiler = boilers.find((b) => b.id === userBoilerId);
    DemoStore.addUserAccount({
      name: userName,
      email: userEmail,
      role: userRole,
      assignedSite: userSite,
      assignedBoilerId: selectedBoiler?.id,
      assignedBoilerModel: selectedBoiler?.model,
      phone: userPhone,
      avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 9999999)}?w=100&auto=format&fit=crop&q=80`,
      status: "Active",
    });
    setUserName("");
    setUserEmail("");
    setIsUserModalOpen(false);
    showSavedBadge(`User account for ${userName} (${userRole}) created!`);
  };

  // Permission Toggle
  const handleTogglePermission = (role: string, module: keyof DemoRolePermissions, action: string, currentVal: boolean) => {
    DemoStore.updateRolePermission(role, module, action, !currentVal);
    showSavedBadge(`Updated ${action} permission for ${role}`);
  };

  const rolesList: Array<DemoUserAccount["role"]> = [
    "Super Admin",
    "Plant Manager",
    "Site Supervisor",
    "Boiler Foreman",
    "Accounts & Finance",
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-100 text-[#FF6600] uppercase tracking-wider">
              Control Panel
            </span>
            <span className="text-xs text-gray-500 font-medium">Enterprise Configuration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 mt-1">
            Settings & Permissions
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Configure stock categories, units of measure, user role assignments, and granular security matrices.
          </p>
        </div>

        {savedNotification && (
          <div className="flex items-center gap-2 px-3.5 py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-xl shadow-sm animate-in fade-in slide-in-from-top duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{savedNotification}</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 overflow-x-auto scrollbar-none gap-2">
        <button
          onClick={() => setActiveTab("CATEGORIES_UNITS")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold whitespace-nowrap border-b-2 transition-all ${
            activeTab === "CATEGORIES_UNITS"
              ? "border-[#FF6600] text-[#FF6600]"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>Stock Categories & Units</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-gray-100 text-gray-600 font-semibold">
            {categories.length + units.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("USERS")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold whitespace-nowrap border-b-2 transition-all ${
            activeTab === "USERS"
              ? "border-[#FF6600] text-[#FF6600]"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User Accounts</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-gray-100 text-gray-600 font-semibold">
            {users.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("PERMISSIONS")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold whitespace-nowrap border-b-2 transition-all ${
            activeTab === "PERMISSIONS"
              ? "border-[#FF6600] text-[#FF6600]"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Role Permission Matrix</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-orange-100 text-[#FF6600] font-semibold">
            Customizable
          </span>
        </button>

        <button
          onClick={() => setActiveTab("GENERAL")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold whitespace-nowrap border-b-2 transition-all ${
            activeTab === "GENERAL"
              ? "border-[#FF6600] text-[#FF6600]"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Operations & Currency</span>
        </button>
      </div>

      {/* TAB 1: STOCK CATEGORIES & UNITS */}
      {activeTab === "CATEGORIES_UNITS" && (
        <div className="space-y-8">
          {/* Section A: Stock Categories */}
          <div className="bg-white rounded-2xl border border-gray-200/90 shadow-sm p-5 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-extrabold text-gray-900">
                    Stock Categories
                  </h2>
                  <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full font-medium">
                    Predefined & User Custom
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  Assigned when registering new stock items and referenced in procurement orders and shift stock disbursements.
                </p>
              </div>

              <button
                onClick={() => setIsCatModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-[#FF6600] hover:bg-[#E65C00] rounded-xl shadow-sm transition-all shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add Stock Category</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="p-4 rounded-xl border border-gray-200/80 hover:border-orange-300 bg-[#FAFBFD] transition-all hover:shadow-sm flex flex-col justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-xs text-gray-900">{cat.name}</span>
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-gray-200/70 text-gray-700">
                        {cat.code}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 line-clamp-2">{cat.description}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      {cat.isPredefined ? "System Predefined" : "User Defined"}
                    </span>
                    {!cat.isPredefined && (
                      <button
                        onClick={() => handleDeleteCategory(cat.id)}
                        className="text-gray-400 hover:text-rose-600 p-1 rounded transition-colors"
                        title="Delete custom category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section B: Stock Units of Measure */}
          <div className="bg-white rounded-2xl border border-gray-200/90 shadow-sm p-5 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-extrabold text-gray-900">
                    Units of Measure (UOM)
                  </h2>
                  <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full font-medium">
                    Standard & Custom Units
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  Used for bulk biomass weighments, chemical liquid volumes, spares counts, and boiler consumption.
                </p>
              </div>

              <button
                onClick={() => setIsUnitModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-[#181B20] hover:bg-black rounded-xl shadow-sm transition-all shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add Stock Unit</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3">
              {units.map((unit) => (
                <div
                  key={unit.id}
                  className="p-3.5 rounded-xl border border-gray-200/80 bg-[#FAFBFD] flex items-center justify-between hover:border-gray-300 transition-all"
                >
                  <div className="space-y-0.5">
                    <div className="text-xs font-extrabold text-gray-900">{unit.name}</div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[11px] font-bold text-[#FF6600]">
                        {unit.abbreviation}
                      </span>
                      <span className="text-[10px] text-gray-400">({unit.type})</span>
                    </div>
                  </div>

                  {!unit.isPredefined && (
                    <button
                      onClick={() => handleDeleteUnit(unit.id)}
                      className="text-gray-400 hover:text-rose-600 p-1"
                      title="Remove custom unit"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: USER ACCOUNTS & ASSIGNMENTS */}
      {activeTab === "USERS" && (
        <div className="bg-white rounded-2xl border border-gray-200/90 shadow-sm p-5 sm:p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-gray-900">
                Staff & Operator User Accounts
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Multi-user logins with designated roles: Super Admin, Site Supervisor, Boiler Foreman, and Finance.
              </p>
            </div>

            <button
              onClick={() => setIsUserModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-[#FF6600] hover:bg-[#E65C00] rounded-xl shadow-sm transition-all shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Register New User</span>
            </button>
          </div>

          <div className="overflow-x-auto border border-gray-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAFBFD] border-b border-gray-200 text-gray-500 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">System Role</th>
                  <th className="py-3 px-4">Stationed Facility & Boiler</th>
                  <th className="py-3 px-4">Contact Phone</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((u) => {
                  const isCurrentActive = activeUser?.id === u.id;
                  return (
                    <tr key={u.id} className={`hover:bg-gray-50/80 transition-colors ${isCurrentActive ? "bg-orange-50/40" : ""}`}>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={u.avatar}
                            alt={u.name}
                            className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-200"
                          />
                          <div>
                            <div className="font-extrabold text-gray-900 flex items-center gap-1.5">
                              <span>{u.name}</span>
                              {isCurrentActive && (
                                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-[#FF6600] text-white">
                                  Current User
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-gray-500">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-[11px] px-2.5 py-1 rounded-full bg-gray-100 text-gray-800 border border-gray-200">
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-800">{u.assignedSite}</div>
                        {u.assignedBoilerModel && (
                          <div className="text-[10px] text-[#FF6600] font-semibold mt-0.5">
                            Boiler: {u.assignedBoilerModel}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-gray-600 font-mono text-[11px]">
                        {u.phone}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          {u.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {!isCurrentActive ? (
                          <button
                            onClick={() => {
                              DemoStore.setActiveUser(u.id);
                              showSavedBadge(`Active session switched to ${u.name}`);
                            }}
                            className="px-2.5 py-1 text-[11px] font-bold text-[#FF6600] hover:bg-orange-50 rounded-lg transition-colors border border-orange-200"
                          >
                            Switch To
                          </button>
                        ) : (
                          <span className="text-[10px] font-bold text-gray-400">Active</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: CUSTOMIZABLE ROLE PERMISSIONS MATRIX */}
      {activeTab === "PERMISSIONS" && (
        <div className="bg-white rounded-2xl border border-gray-200/90 shadow-sm p-5 sm:p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-extrabold text-gray-900">
                  Granular Permission Matrix
                </h2>
                <span className="text-xs px-2 py-0.5 bg-orange-100 text-[#FF6600] rounded-full font-bold">
                  Live Customizable
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Toggle capabilities for each role across fleet boilers, steam records, inventory, procurement, vouchers, and payroll.
              </p>
            </div>

            <button
              onClick={() => showSavedBadge("Permissions verified and active across all sessions.")}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all shrink-0"
            >
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Verify Active Policy</span>
            </button>
          </div>

          <div className="overflow-x-auto border border-gray-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAFBFD] border-b border-gray-200 text-gray-500 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4 min-w-[200px]">System Module & Action</th>
                  {rolesList.map((r) => (
                    <th key={r} className="py-3 px-3 text-center min-w-[120px]">
                      {r}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {/* Fleet Boilers */}
                <tr className="bg-gray-50/50">
                  <td colSpan={6} className="py-2 px-4 font-extrabold text-[11px] text-gray-800 uppercase tracking-wider">
                    Boilers Fleet & Deployments
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 text-gray-700 font-medium">View Fleet & Telemetry</td>
                  {rolesList.map((r) => {
                    const isChecked = permissions[r]?.boilers?.view ?? true;
                    return (
                      <td key={r} className="py-2.5 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleTogglePermission(r, "boilers", "view", isChecked)}
                          className="w-4 h-4 text-[#FF6600] rounded focus:ring-orange-500 cursor-pointer"
                        />
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="py-2.5 px-4 text-gray-700 font-medium">Modify Status & Assign Staff</td>
                  {rolesList.map((r) => {
                    const isChecked = permissions[r]?.boilers?.manage ?? false;
                    return (
                      <td key={r} className="py-2.5 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleTogglePermission(r, "boilers", "manage", isChecked)}
                          className="w-4 h-4 text-[#FF6600] rounded focus:ring-orange-500 cursor-pointer"
                        />
                      </td>
                    );
                  })}
                </tr>

                {/* Steam Records */}
                <tr className="bg-gray-50/50">
                  <td colSpan={6} className="py-2 px-4 font-extrabold text-[11px] text-gray-800 uppercase tracking-wider">
                    Steam Production & Photo Proofs
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 text-gray-700 font-medium">View Daily, Weekly, Monthly Steam Records</td>
                  {rolesList.map((r) => {
                    const isChecked = permissions[r]?.steam?.view ?? true;
                    return (
                      <td key={r} className="py-2.5 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleTogglePermission(r, "steam", "view", isChecked)}
                          className="w-4 h-4 text-[#FF6600] rounded focus:ring-orange-500 cursor-pointer"
                        />
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="py-2.5 px-4 text-gray-700 font-medium">Log Shift Steam Reading & Upload 2 Photos</td>
                  {rolesList.map((r) => {
                    const isChecked = permissions[r]?.steam?.log ?? false;
                    return (
                      <td key={r} className="py-2.5 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleTogglePermission(r, "steam", "log", isChecked)}
                          className="w-4 h-4 text-[#FF6600] rounded focus:ring-orange-500 cursor-pointer"
                        />
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="py-2.5 px-4 text-gray-700 font-medium">Supervisor Sign-off & Audit</td>
                  {rolesList.map((r) => {
                    const isChecked = permissions[r]?.steam?.approve ?? false;
                    return (
                      <td key={r} className="py-2.5 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleTogglePermission(r, "steam", "approve", isChecked)}
                          className="w-4 h-4 text-[#FF6600] rounded focus:ring-orange-500 cursor-pointer"
                        />
                      </td>
                    );
                  })}
                </tr>

                {/* Inventory & Stock */}
                <tr className="bg-gray-50/50">
                  <td colSpan={6} className="py-2 px-4 font-extrabold text-[11px] text-gray-800 uppercase tracking-wider">
                    Warehouse Stock, Stock In / Out & Fuel Ending
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 text-gray-700 font-medium">Perform Stock In & Stock Out Movements</td>
                  {rolesList.map((r) => {
                    const isChecked = permissions[r]?.inventory?.stockInOut ?? false;
                    return (
                      <td key={r} className="py-2.5 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleTogglePermission(r, "inventory", "stockInOut", isChecked)}
                          className="w-4 h-4 text-[#FF6600] rounded focus:ring-orange-500 cursor-pointer"
                        />
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="py-2.5 px-4 text-gray-700 font-medium">Add New Stock Items & Month-End Reconcile</td>
                  {rolesList.map((r) => {
                    const isChecked = permissions[r]?.inventory?.manageItems ?? false;
                    return (
                      <td key={r} className="py-2.5 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleTogglePermission(r, "inventory", "manageItems", isChecked)}
                          className="w-4 h-4 text-[#FF6600] rounded focus:ring-orange-500 cursor-pointer"
                        />
                      </td>
                    );
                  })}
                </tr>

                {/* Procurement & Vendors */}
                <tr className="bg-gray-50/50">
                  <td colSpan={6} className="py-2 px-4 font-extrabold text-[11px] text-gray-800 uppercase tracking-wider">
                    Procurement & Vendor Directory
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 text-gray-700 font-medium">Create Purchase Orders (Auto Stock Populate)</td>
                  {rolesList.map((r) => {
                    const isChecked = permissions[r]?.procurement?.createPO ?? false;
                    return (
                      <td key={r} className="py-2.5 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleTogglePermission(r, "procurement", "createPO", isChecked)}
                          className="w-4 h-4 text-[#FF6600] rounded focus:ring-orange-500 cursor-pointer"
                        />
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="py-2.5 px-4 text-gray-700 font-medium">Add & Manage Vendors (5+ Profile Fields)</td>
                  {rolesList.map((r) => {
                    const isChecked = permissions[r]?.procurement?.manageVendors ?? false;
                    return (
                      <td key={r} className="py-2.5 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleTogglePermission(r, "procurement", "manageVendors", isChecked)}
                          className="w-4 h-4 text-[#FF6600] rounded focus:ring-orange-500 cursor-pointer"
                        />
                      </td>
                    );
                  })}
                </tr>

                {/* Expenses, Vouchers & Salaries */}
                <tr className="bg-gray-50/50">
                  <td colSpan={6} className="py-2 px-4 font-extrabold text-[11px] text-gray-800 uppercase tracking-wider">
                    Financials, Vouchers & Payroll
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 text-gray-700 font-medium">Issue Financial Vouchers & Approve Amounts</td>
                  {rolesList.map((r) => {
                    const isChecked = permissions[r]?.expenses?.manageVouchers ?? false;
                    return (
                      <td key={r} className="py-2.5 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleTogglePermission(r, "expenses", "manageVouchers", isChecked)}
                          className="w-4 h-4 text-[#FF6600] rounded focus:ring-orange-500 cursor-pointer"
                        />
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="py-2.5 px-4 text-gray-700 font-medium">Process Monthly Staff Wages & Payroll</td>
                  {rolesList.map((r) => {
                    const isChecked = permissions[r]?.salaries?.processPayroll ?? false;
                    return (
                      <td key={r} className="py-2.5 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleTogglePermission(r, "salaries", "processPayroll", isChecked)}
                          className="w-4 h-4 text-[#FF6600] rounded focus:ring-orange-500 cursor-pointer"
                        />
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: GENERAL & OPERATIONAL SETTINGS */}
      {activeTab === "GENERAL" && (
        <div className="bg-white rounded-2xl border border-gray-200/90 shadow-sm p-5 sm:p-6 space-y-6 max-w-3xl">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-gray-900">
              Operational Thresholds & Monetary Settings
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Set financial limits, default currency representation, and weighbridge tolerance limits.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              showSavedBadge("Operational parameters updated.");
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Base Currency</label>
                <input
                  type="text"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6600]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Weighbridge Shortfall Tolerance (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={tolerancePct}
                  onChange={(e) => setTolerancePct(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6600]"
                />
                <p className="text-[10px] text-gray-400 mt-0.5">
                  Truck deliveries exceeding this shortfall trigger dispute status.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Auto-Approve Running Expense Limit (PKR)
                </label>
                <input
                  type="number"
                  value={autoApproveLimit}
                  onChange={(e) => setAutoApproveLimit(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6600]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Site Supervisor Float Disbursement Limit (PKR)
                </label>
                <input
                  type="number"
                  value={supervisorThreshold}
                  onChange={(e) => setSupervisorThreshold(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6600]"
                />
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-[#FF6600] hover:bg-[#E65C00] rounded-xl shadow-sm transition-all"
              >
                Save Operational Controls
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: ADD STOCK CATEGORY */}
      {isCatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-extrabold text-base text-gray-900">Add New Stock Category</h3>
              <button
                onClick={() => setIsCatModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCategory} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Category Name</label>
                <input
                  type="text"
                  placeholder="e.g. Refractory Bricks & Castables"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6600]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Category Code</label>
                <input
                  type="text"
                  placeholder="e.g. REFR-BRK"
                  value={catCode}
                  onChange={(e) => setCatCode(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl uppercase focus:outline-none focus:border-[#FF6600]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Describe items falling in this inventory category..."
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6600]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCatModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-[#FF6600] hover:bg-[#E65C00] rounded-xl shadow-sm transition-all"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD STOCK UNIT */}
      {isUnitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-extrabold text-base text-gray-900">Add Unit of Measure</h3>
              <button
                onClick={() => setIsUnitModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddUnit} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Unit Name</label>
                <input
                  type="text"
                  placeholder="e.g. Metric Tonnes"
                  value={unitName}
                  onChange={(e) => setUnitName(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6600]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Abbreviation (Symbol)</label>
                <input
                  type="text"
                  placeholder="e.g. MT or Tonnes"
                  value={unitAbbr}
                  onChange={(e) => setUnitAbbr(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6600]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Measurement Type</label>
                <select
                  value={unitType}
                  onChange={(e) => setUnitType(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6600]"
                >
                  <option value="Weight">Weight (Mass)</option>
                  <option value="Volume">Volume (Liquid / Chemical)</option>
                  <option value="Count">Count (Units, Pairs, Sets)</option>
                  <option value="Length">Length (Piping / Cables)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUnitModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-[#FF6600] hover:bg-[#E65C00] rounded-xl shadow-sm transition-all"
                >
                  Create Unit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: REGISTER NEW USER ACCOUNT */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-extrabold text-base text-gray-900">Register User Account</h3>
              <button
                onClick={() => setIsUserModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-3.5 mt-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Asif Raza"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6600]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. asif.raza@stokerboilers.com"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6600]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">User Role</label>
                  <select
                    value={userRole}
                    onChange={(e) => setUserRole(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6600]"
                  >
                    <option value="Super Admin">Super Admin</option>
                    <option value="Plant Manager">Plant Manager</option>
                    <option value="Site Supervisor">Site Supervisor</option>
                    <option value="Boiler Foreman">Boiler Foreman</option>
                    <option value="Accounts & Finance">Accounts & Finance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6600]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Assigned Client Site</label>
                <select
                  value={userSite}
                  onChange={(e) => setUserSite(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6600]"
                >
                  <option value="Apex Textile Mills - Sector 4">Apex Textile Mills - Sector 4</option>
                  <option value="GreenBio Bio-Refinery Unit 2">GreenBio Bio-Refinery Unit 2</option>
                  <option value="Prime Mills - Boiler Bay C">Prime Mills - Boiler Bay C</option>
                  <option value="SunGlow Dairy & Beverage Plant">SunGlow Dairy & Beverage Plant</option>
                  <option value="Indus Wet Processing Zone">Indus Wet Processing Zone</option>
                  <option value="National Pharma Clean Steam Site">National Pharma Clean Steam Site</option>
                  <option value="Sultan Tannery Boiler House">Sultan Tannery Boiler House</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Assigned Facility Boiler</label>
                <select
                  value={userBoilerId}
                  onChange={(e) => setUserBoilerId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6600]"
                >
                  {boilers.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.code} - {b.model} ({b.siteName})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-[#FF6600] hover:bg-[#E65C00] rounded-xl shadow-sm transition-all"
                >
                  Register Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
