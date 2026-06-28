import React, { useEffect, useState } from 'react';
import { shelterService } from '../../services/shelterService';
import { inventoryService } from '../../services/inventoryService';
import { Building2, Package, Plus, Trash2, Home } from 'lucide-react';

export default function NgoDashboard() {
  const [shelters, setShelters] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newItem, setNewItem] = useState({
    itemName: '',
    category: 'FOOD',
    quantity: 100,
    unit: 'kg',
  });

  useEffect(() => {
    fetchNgoData();
  }, []);

  const fetchNgoData = async () => {
    try {
      const [shRes, invRes] = await Promise.all([
        shelterService.getAllShelters(),
        inventoryService.getMyInventory(),
      ]);
      if (shRes.success) setShelters(shRes.data);
      if (invRes.success) setInventory(invRes.data);
    } catch (err) {
      console.error('Error fetching NGO operational data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      const res = await inventoryService.addInventoryItem(newItem);
      if (res.success) {
        setInventory([...inventory, res.data]);
        setNewItem({ itemName: '', category: 'FOOD', quantity: 100, unit: 'kg' });
      }
    } catch (err) {
      alert('Failed to add inventory item.');
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      const res = await inventoryService.deleteInventoryItem(id);
      if (res.success) {
        setInventory(inventory.filter(i => i.id !== id));
      }
    } catch (err) {
      alert('Failed to delete item.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 space-y-6">
      <div className="glass-panel p-6 rounded-2xl flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Building2 className="text-purple-400" size={28} />
            NGO Relief Operations & Resource Stockpile Manager
          </h1>
          <p className="text-xs text-slate-400 mt-1">Monitor shelter capacities and manage emergency food, medicine, and blanket stockpiles</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Home className="text-blue-400" size={20} />
            Relief Camps & Shelter Capacities ({shelters.length})
          </h2>

          <div className="space-y-3 max-h-[450px] overflow-y-auto pr-2">
            {shelters.map((s) => {
              const pct = Math.round((s.currentOccupancy / s.totalCapacity) * 100);
              return (
                <div key={s.id} className="glass-card p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-sm text-white">{s.name}</h3>
                    <span className="text-xs font-semibold text-slate-400">{s.currentOccupancy} / {s.totalCapacity} Occupied</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${pct > 85 ? 'bg-red-500' : pct > 50 ? 'bg-amber-500' : 'bg-green-500'}`}
                      style={{ width: `${Math.min(100, pct)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl space-y-4 flex flex-col">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Package className="text-emerald-400" size={20} />
            Stockpile Inventory ({inventory.length})
          </h2>

          <form onSubmit={handleAddItem} className="grid grid-cols-4 gap-2 glass-card p-3 rounded-xl border border-slate-800">
            <input
              type="text"
              placeholder="Item Name"
              required
              value={newItem.itemName}
              onChange={(e) => setNewItem({ ...newItem, itemName: e.target.value })}
              className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
            />
            <select
              value={newItem.category}
              onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
              className="px-2 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
            >
              <option value="FOOD">FOOD</option>
              <option value="MEDICINE">MEDICINE</option>
              <option value="WATER">WATER</option>
              <option value="BLANKETS">BLANKETS</option>
            </select>
            <input
              type="number"
              placeholder="Qty"
              required
              value={newItem.quantity}
              onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) })}
              className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
            />
            <button
              type="submit"
              className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg text-xs flex items-center justify-center space-x-1"
            >
              <Plus size={16} />
              <span>Add</span>
            </button>
          </form>

          <div className="flex-1 overflow-y-auto max-h-[350px] space-y-2 pr-2">
            {inventory.map((item) => (
              <div key={item.id} className="flex justify-between items-center glass-card p-3 rounded-xl border border-slate-800">
                <div>
                  <h4 className="font-bold text-xs text-white">{item.itemName}</h4>
                  <span className="text-[10px] text-emerald-400 font-semibold">{item.category}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-xs font-bold text-slate-200">{item.quantity} {item.unit}</span>
                  <button onClick={() => handleDeleteItem(item.id)} className="text-red-400 hover:text-red-300">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}