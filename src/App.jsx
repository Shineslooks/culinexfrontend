import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { fetchProducts, addProduct, deleteProduct } from './api';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [ingredients, setIngredients] = useState([]);
  const [menus, setMenus] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- STATES ---
  const [ingredientData, setIngredientData] = useState({ name: '', category: 'Bahan Makanan', stock: '', unit: 'gram', totalCost: '' });
  const [menuData, setMenuData] = useState({ name: '', category: 'Main Course', margin: 2.5 });
  const [recipeItems, setRecipeItems] = useState([{ ingredient: '', amount: '' }]);
  const [transactionData, setTransactionData] = useState({ menuId: '', quantity: '' });

  const fetchData = async () => {
    try {
      const response = await fetchProducts();
      setIngredients(response.data);
      setMenus(menuRes.data);
      setIsLoading(false);
    } catch (err) { 
      console.error("Fetch error:", err); 
      setIsLoading(false); 
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (type, id, name) => {
    if (window.confirm(`⚠️ Hapus "${name}" secara permanen?`)) {
      try {
        await deleteProduct(id);
        fetchData();
      } catch (err) { alert("❌ Gagal: " + (err.response?.data?.message || err.message)); }
    }
  };

  // --- HANDLERS ---
  const handleIngredientSubmit = async (e) => {
    e.preventDefault();
    try {
      await addProduct(ingredientData);
      setIngredientData({ name: '', category: 'Bahan Makanan', stock: '', unit: 'gram', totalCost: '' });
      fetchData();
      alert("🚀 Material Synced!");
    } catch (err) { alert("❌ " + err.message); }
  };

  const handleMenuSubmit = async (e) => {
    e.preventDefault();
    if (recipeItems.some(item => !item.ingredient || !item.amount)) {
      return alert("⚠️ Lengkapi konfigurasi resep!");
    }
    try {
      const payload = { ...menuData, recipe: recipeItems };
      // Pastikan baris ini ADA dan TIDAK dikomentari:
      await axios.post(`${API_BASE_URL}/menus`, payload); 
      setMenuData({ name: '', category: 'Main Course', margin: 2.5 });
      setRecipeItems([{ ingredient: '', amount: '' }]);
      fetchData();
      alert("🧪 Recipe Compiled & Locked!");
    } catch (err) { alert("❌ " + (err.response?.data?.message || err.message)); }
  };

  const handleTransactionSubmit = async (e) => {
    e.preventDefault();
    try {
      // Placeholder for transaction submission
      // await addTransaction(transactionData);
      alert("❌ Transaction endpoint needs backend implementation");
      // setTransactionData({ menuId: '', quantity: '' });
      // fetchData();
      // alert("💸 Transaction Executed!");
    } catch (err) { alert("❌ " + err.message); }
  };

  // --- STYLING (Calibrated for Centering) ---
  const styles = {
    container: { display: 'flex', minHeight: '100vh', backgroundColor: '#020617', color: '#f8fafc', fontFamily: "'Orbitron', sans-serif" },
    sidebar: { width: '280px', backgroundColor: '#0f172a', borderRight: '1px solid #1e293b', display: 'flex', flexDirection: 'column', padding: '30px 20px', position: 'fixed', height: '100vh', zIndex: 100 },
    content: { 
      marginLeft: '280px', 
      flex: 1, 
      padding: '60px 20px', 
      backgroundColor: '#020617',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center' // Memastikan semua anak elemen berada di tengah secara horizontal
    },
    innerContainer: { width: '100%', maxWidth: '1000px', margin: '0 auto' }, // Wrapper untuk konten tiap tab
    navButton: (active) => ({
      padding: '15px 20px', marginBottom: '10px', borderRadius: '12px', cursor: 'pointer', border: 'none', textAlign: 'left', fontSize: '14px', fontWeight: 'bold', transition: '0.3s',
      backgroundColor: active ? '#3b82f6' : 'transparent', color: active ? 'white' : '#94a3b8', boxShadow: active ? '0 0 20px rgba(59, 130, 246, 0.4)' : 'none'
    }),
    glassCard: { background: 'rgba(30, 41, 59, 0.6)', backdropFilter: 'blur(12px)', borderRadius: '24px', padding: '35px', border: '1px solid rgba(255, 255, 255, 0.08)', boxShadow: '0 20px 50px rgba(0,0,0,0.3)', width: '100%', boxSizing: 'border-box' },
    input: { padding: '14px', borderRadius: '12px', border: '1px solid #334155', backgroundColor: '#0f172a', color: 'white', marginBottom: '12px', width: '100%', boxSizing: 'border-box' },
    btnPrimary: { padding: '16px', borderRadius: '12px', border: 'none', backgroundColor: '#3b82f6', color: 'white', fontWeight: 'bold', cursor: 'pointer', marginTop: '15px', transition: '0.2s', width: '100%' }
  };

  const chartData = ingredients.map(item => ({ name: item.name, value: item.stock * item.costPerUnit }));

  return (
    <div style={styles.container}>
      {/* --- SIDEBAR --- */}
      <div style={styles.sidebar}>
        <h2 style={{ color: '#3b82f6', letterSpacing: '3px', marginBottom: '50px', textAlign: 'center' }}>⚡Culinex - Culina Flow </h2>
        <button style={styles.navButton(activeTab === 'dashboard')} onClick={() => setActiveTab('dashboard')}>📊 CORE DASHBOARD</button>
        <button style={styles.navButton(activeTab === 'ingredients')} onClick={() => setActiveTab('ingredients')}>📦 GUDANG MATERIAL</button>
        <button style={styles.navButton(activeTab === 'menu')} onClick={() => setActiveTab('menu')}>🧪 LABORATORIUM RESEP</button>
        <button style={styles.navButton(activeTab === 'cashier')} onClick={() => setActiveTab('cashier')}>💳 KASIR</button>
        <div style={{ marginTop: 'auto', textAlign: 'center', fontSize: '11px', color: '#475569', opacity: 0.6 }}>SYSTEM V3.0.4 - ENCRYPTED</div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div style={styles.content}>
        
        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div style={styles.innerContainer}>
            <h1 style={{ marginBottom: '40px', fontSize: '36px', textAlign: 'center' }}>Operational Overview</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '25px', marginBottom: '40px' }}>
              <div style={styles.glassCard}><p style={{ color: '#94a3b8', fontSize: '13px', margin: '0 0 10px 0' }}>Total Aset</p><h2 style={{ color: '#10b981', margin: 0 }}>Rp {chartData.reduce((a, b) => a + b.value, 0).toLocaleString()}</h2></div>
              <div style={styles.glassCard}><p style={{ color: '#94a3b8', fontSize: '13px', margin: '0 0 10px 0' }}>Menu Terdaftar</p><h2 style={{ color: '#3b82f6', margin: 0 }}>{menus.length} Produk</h2></div>
              <div style={styles.glassCard}><p style={{ color: '#94a3b8', fontSize: '13px', margin: '0 0 10px 0' }}>Status Sistem</p><h2 style={{ color: '#f59e0b', margin: 0 }}>OPTIMAL</h2></div>
            </div>
            <div style={styles.glassCard}>
              <h3 style={{ marginBottom: '30px', textAlign: 'center' }}>Asset Distribution Analytics</h3>
              <div style={{ width: '100%', height: '400px' }}>
                <ResponsiveContainer>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" orientation='right' fontSize={12} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #3b82f6', borderRadius: '12px' }} />
                    <Bar dataKey="value" name="Aset (Rp)">
                      {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#3b82f6' : '#10b981'} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BAHAN BAKU */}
        {activeTab === 'ingredients' && (
          <div style={styles.innerContainer}>
            <h1 style={{ marginBottom: '40px', textAlign: 'center' }}>Material Management</h1>
            <div style={{ ...styles.glassCard, marginBottom: '40px' }}>
              <h3 style={{ marginBottom: '25px', color: '#3b82f6' }}>Add New Material</h3>
              <form onSubmit={handleIngredientSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <input style={styles.input} type="text" placeholder="Nama Material" required value={ingredientData.name} onChange={e => setIngredientData({...ingredientData, name: e.target.value})}/>
                <select style={styles.input} value={ingredientData.category} onChange={e => setIngredientData({...ingredientData, category: e.target.value})}>
                  <option value="Bahan Makanan">Bahan Makanan</option><option value="Bahan Minuman">Bahan Minuman</option>
                </select>
                <input style={styles.input} type="number" placeholder="Volume" required value={ingredientData.stock} onChange={e => setIngredientData({...ingredientData, stock: e.target.value})}/>
                <select style={styles.input} value={ingredientData.unit} onChange={e => setIngredientData({...ingredientData, unit: e.target.value})}>
                  <option value="gram">gram</option><option value="ml">ml</option><option value="pcs">pcs</option>
                </select>
                <input style={{...styles.input, gridColumn: 'span 2'}} type="number" placeholder="Credit Cost (Rp)" required value={ingredientData.totalCost} onChange={e => setIngredientData({...ingredientData, totalCost: e.target.value})}/>
                <button style={{...styles.btnPrimary, gridColumn: 'span 2'}} type="submit">SYNCHRONIZE TO DATABASE</button>
              </form>
            </div>
            <div style={styles.glassCard}>
              <h3 style={{ marginBottom: '20px' }}>Inventory List</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ color: '#64748b', textAlign: 'left', borderBottom: '1px solid #334155' }}>
                    <th style={{ padding: '15px' }}>MATERIAL</th><th>STATUS</th><th>UNIT COST</th><th style={{ textAlign: 'right' }}>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {ingredients.map(ing => (
                    <tr key={ing._id} style={{ borderBottom: '1px solid #1e293b' }}>
                      <td style={{ padding: '15px' }}>{ing.name}</td>
                      <td style={{ color: ing.stock < 500 ? '#ef4444' : '#10b981' }}>{ing.stock} {ing.unit}</td>
                      <td>Rp {ing.costPerUnit.toFixed(0)}</td>
                      <td style={{ textAlign: 'right' }}><button onClick={() => handleDelete('ingredient', ing._id, ing.name)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '18px' }}>🗑️</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: RAKIT MENU */}
        {activeTab === 'menu' && (
          <div style={styles.innerContainer}>
            <h1 style={{ marginBottom: '40px', textAlign: 'center' }}>Recipe Laboratory</h1>
            <div style={{ ...styles.glassCard, marginBottom: '40px' }}>
              <form onSubmit={handleMenuSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <input style={styles.input} type="text" placeholder="Product Identification Name" required value={menuData.name} onChange={e => setMenuData({...menuData, name: e.target.value})}/>
                <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '25px', borderRadius: '16px', border: '1px dashed #334155' }}>
                  <p style={{ fontSize: '12px', color: '#3b82f6', marginBottom: '20px', fontWeight: 'bold', letterSpacing: '1px' }}>COMPOUND CONFIGURATION:</p>
                  {recipeItems.map((item, index) => (
                    <div key={index} style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                      <select style={{...styles.input, flex: 2, marginBottom: 0}} required value={item.ingredient} onChange={e => {
                        const newRecipe = [...recipeItems]; newRecipe[index].ingredient = e.target.value; setRecipeItems(newRecipe);
                      }}>
                        <option value="" disabled>Select Material</option>
                        {ingredients.map(ing => <option key={ing._id} value={ing._id}>{ing.name}</option>)}
                      </select>
                      <input style={{...styles.input, flex: 1, marginBottom: 0}} type="number" placeholder="Qty" required value={item.amount} onChange={e => {
                        const newRecipe = [...recipeItems]; newRecipe[index].amount = e.target.value; setRecipeItems(newRecipe);
                      }}/>
                    </div>
                  ))}
                  <button type="button" onClick={() => setRecipeItems([...recipeItems, { ingredient: '', amount: '' }])} style={{ padding: '8px 20px', borderRadius: '10px', border: '1px solid #3b82f6', background: 'transparent', color: '#3b82f6', cursor: 'pointer', fontSize: '12px' }}>+ ADD COMPOUND</button>
                </div>
                <input style={styles.input} type="number" step="0.1" placeholder="Profit Margin (Default 2.5x)" value={menuData.margin} onChange={e => setMenuData({...menuData, margin: e.target.value})}/>
                <button style={styles.btnPrimary} type="submit">COMPILE & LOCK RECIPE</button>
              </form>
            </div>
            <div style={styles.glassCard}>
              <h3 style={{ marginBottom: '25px' }}>Compiled Ready Products</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                {menus.map(m => (
                  <div key={m._id} style={{ background: '#0f172a', padding: '25px', borderRadius: '20px', border: '1px solid #1e293b', position: 'relative', boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}>
                    <h4 style={{ margin: '0 0 12px 0', fontSize: '18px' }}>{m.name}</h4>
                    <p style={{ fontSize: '14px', color: '#10b981', fontWeight: 'bold', margin: 0 }}>Market Value: Rp {m.sellingPrice.toLocaleString()}</p>
                    <button onClick={() => handleDelete('menu', m._id, m.name)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '18px' }}>🗑️</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: KASIR */}
        {activeTab === 'cashier' && (
          <div style={{ ...styles.innerContainer, maxWidth: '700px' }}>
            <h1 style={{ marginBottom: '40px', textAlign: 'center' }}>Quantum POS Terminal</h1>
            <div style={styles.glassCard}>
              <form onSubmit={handleTransactionSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                <div><label style={{ fontSize: '11px', color: '#3b82f6', display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>PRODUCT IDENTIFICATION:</label>
                <select style={{...styles.input, fontSize: '18px', padding: '18px'}} required value={transactionData.menuId} onChange={e => setTransactionData({...transactionData, menuId: e.target.value})}>
                  <option value="" disabled>-- SELECT DISPATCH ITEM --</option>
                  {menus.map((m) => <option key={m._id} value={m._id}>{m.name} [Rp {m.sellingPrice.toLocaleString()}]</option>)}
                </select></div>
                <div><label style={{ fontSize: '11px', color: '#3b82f6', display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>ORDER QUANTITY:</label>
                <input style={{...styles.input, fontSize: '28px', textAlign: 'center', padding: '20px', border: '2px solid #3b82f6'}} type="number" placeholder="0" required value={transactionData.quantity} onChange={e => setTransactionData({...transactionData, quantity: e.target.value})}/></div>
                <button style={{...styles.btnPrimary, fontSize: '20px', padding: '25px', textShadow: '0 0 10px rgba(255,255,255,0.3)'}} type="submit">EXECUTE DISPATCH 💳</button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;