import React, { useState, useEffect } from 'react';
import { Package, AlertTriangle, Plus, Search, CheckCircle2, RotateCw, DollarSign, Boxes, ShieldAlert } from 'lucide-react';
import { store } from '../../services/store';
import { useToast } from '../../components/ui/Toast';
import { InventoryItem } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { StatCard } from '../../components/ui/StatCard';

export const AdminInventoryPage: React.FC = () => {
  const { success, error } = useToast();
  const [inventory, setInventory] = useState<InventoryItem[]>(() => store.getInventory());
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);

  // Form
  const [partName, setPartName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('Displays');
  const [stock, setStock] = useState(10);
  const [threshold, setThreshold] = useState(5);
  const [unitCost, setUnitCost] = useState(50);
  const [sellingPrice, setSellingPrice] = useState(120);

  const refresh = () => {
    setInventory(store.getInventory());
  };

  useEffect(() => {
    const unsub = store.subscribe(refresh);
    return () => unsub();
  }, []);

  const handleRestock = (id: string, name: string) => {
    store.updateInventoryStock(id, 10);
    success('Stock Replenished', `Added +10 units to ${name}`);
    refresh();
  };

  const handleAddPart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partName.trim() || !sku.trim()) {
      error('Fields Required', 'Please enter part name and SKU.');
      return;
    }

    store.addInventoryItem({
      part_name: partName.trim(),
      part_number: sku.trim().toUpperCase(),
      sku: sku.trim().toUpperCase(),
      category,
      stock_quantity: Number(stock),
      min_stock: Number(threshold),
      reorder_threshold: Number(threshold),
      cost: Number(unitCost),
      unit_cost: Number(unitCost),
      retail_price: Number(sellingPrice),
      selling_price: Number(sellingPrice),
      supplier: 'OEM Authorized Global Supply'
    });

    success('Part Added', `${partName} logged into inventory system.`);
    setModalOpen(false);
    refresh();
  };

  const filtered = inventory.filter((i) => {
    const term = search.toLowerCase();
    const matchesSearch =
      (i.part_name || '').toLowerCase().includes(term) ||
      (i.sku || i.part_number || '').toLowerCase().includes(term) ||
      (i.category || '').toLowerCase().includes(term) ||
      (i.supplier || '').toLowerCase().includes(term);

    const matchesCat = categoryFilter === 'all' || i.category.toLowerCase().includes(categoryFilter.toLowerCase());

    return matchesSearch && matchesCat;
  });

  const totalUnits = inventory.reduce((sum, item) => sum + (item.stock_quantity || 0), 0);
  const totalValuation = inventory.reduce(
    (sum, item) => sum + (item.stock_quantity || 0) * (item.cost ?? item.unit_cost ?? 0),
    0
  );
  const lowStockCount = inventory.filter((item) => {
    const reorderLimit = item.reorder_threshold ?? item.min_stock ?? 5;
    return (item.stock_quantity || 0) <= reorderLimit;
  }).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Spare Parts &amp; OEM Components Inventory</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Track hardware component stock levels, supplier SKUs, and automatic reorder thresholds.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Part / SKU</span>
        </button>
      </div>

      {/* KPI Stats Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active SKU Catalog"
          value={inventory.length}
          subtitle="Distinct component codes"
          icon={Package}
          iconColor="text-blue-600"
          bgColor="bg-blue-50"
        />
        <StatCard
          title="Total Units On Hand"
          value={totalUnits}
          subtitle="Physical warehouse stock"
          icon={Boxes}
          iconColor="text-purple-600"
          bgColor="bg-purple-50"
        />
        <StatCard
          title="Low Stock Alerts"
          value={lowStockCount}
          subtitle={lowStockCount > 0 ? 'Requires vendor replenishment' : 'All buffer stocks optimal'}
          icon={AlertTriangle}
          iconColor="text-amber-500"
          bgColor="bg-amber-50"
        />
        <StatCard
          title="Inventory Cost Value"
          value={`$${totalValuation.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          subtitle="Wholesale stock asset valuation"
          icon={DollarSign}
          iconColor="text-emerald-600"
          bgColor="bg-emerald-50"
        />
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            <option value="Storage">Storage &amp; NVMe</option>
            <option value="Display">Displays &amp; Screens</option>
            <option value="Battery">Batteries</option>
            <option value="Logic">Logic &amp; Motherboards</option>
            <option value="Network">Networking</option>
          </select>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search part name, SKU, vendor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <th className="p-4">SKU / Component</th>
              <th className="p-4">Category</th>
              <th className="p-4">Stock Level</th>
              <th className="p-4">Wholesale Cost</th>
              <th className="p-4">Retail Price</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-400">
                  No parts found matching your search.
                </td>
              </tr>
            ) : (
              filtered.map((item) => {
                const itemSku = item.sku || item.part_number || 'N/A';
                const reorderLimit = item.reorder_threshold ?? item.min_stock ?? 5;
                const isLow = (item.stock_quantity || 0) <= reorderLimit;
                const cost = Number(item.cost ?? item.unit_cost ?? 0);
                const price = Number(item.retail_price ?? item.selling_price ?? 0);

                return (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-slate-900">{item.part_name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-mono text-[11px] text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                          {itemSku}
                        </span>
                        {item.supplier && (
                          <span className="text-[10px] text-slate-400 truncate max-w-[180px]">
                            • {item.supplier}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-semibold">
                        {item.category}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-black ${isLow ? 'text-rose-600' : 'text-slate-900'}`}>
                          {item.stock_quantity} units
                        </span>
                        {isLow && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                            <AlertTriangle className="w-3 h-3" />
                            Low Stock
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400">Reorder threshold: &le; {reorderLimit}</span>
                    </td>
                    <td className="p-4 font-semibold text-slate-700">${cost.toFixed(2)}</td>
                    <td className="p-4 font-bold text-slate-900">${price.toFixed(2)}</td>
                    <td className="p-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleRestock(item.id, item.part_name)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <RotateCw className="w-3 h-3" />
                        <span>Restock (+10)</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Add Part Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Hardware Component to Inventory"
        subtitle="Log OEM part specifications, SKU numbers, and safety reorder thresholds."
      >
        <form onSubmit={handleAddPart} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Part Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. M2 Logic Board 16GB"
                value={partName}
                onChange={(e) => setPartName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">SKU Code *</label>
              <input
                type="text"
                required
                placeholder="e.g. MLB-M2-16"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 font-mono uppercase"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500"
              >
                <option value="Displays">Displays</option>
                <option value="Batteries">Batteries</option>
                <option value="Motherboards">Motherboards / ICs</option>
                <option value="Storage">Storage &amp; NVMe</option>
                <option value="Networking">Networking &amp; Cables</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Initial Stock</label>
              <input
                type="number"
                min="1"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Reorder Level</label>
              <input
                type="number"
                min="1"
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Wholesale Cost ($)</label>
              <input
                type="number"
                min="1"
                step="0.5"
                value={unitCost}
                onChange={(e) => setUnitCost(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Retail Price ($)</label>
              <input
                type="number"
                min="1"
                step="0.5"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="text-xs font-semibold text-slate-600 px-4 py-2 rounded-xl hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-5 py-2 rounded-xl shadow-xs"
            >
              Save Part to Inventory
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

