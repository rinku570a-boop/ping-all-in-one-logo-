
import React, { useState, useEffect, useMemo } from 'react';
import { 
  UserRole, CustomerStatus, ServiceType, Customer, Payment, 
  Expense, Staff, Package, InventoryItem, SupportTicket, TicketStatus 
} from './types';
import { APP_NAME, CURRENCY, ICONS, CATEGORIES, ZONES, Logo } from './constants';
import { getBusinessInsights } from './geminiService';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';

// Seed Data for Staff/Collectors
const SEEDED_STAFF: Staff[] = [
  { id: 'S1', name: 'করিম মিয়া', role: UserRole.COLLECTOR, phone: '01711111111', area: 'BR', salary: 12000 },
  { id: 'S2', name: 'রহিম আলী', role: UserRole.COLLECTOR, phone: '01822222222', area: 'DG', salary: 12000 },
];

const SEEDED_CUSTOMERS: Customer[] = [
  { id: 'anu0382', name: 'mdmamun', phone: '01832571839', area: 'BR', packageId: 'P1', serviceType: ServiceType.INTERNET, dueAmount: 500, status: CustomerStatus.ACTIVE, address: 'Pingonline', connectionDate: '2024-01-01' },
  { id: 'anu0381', name: 'rafibapary', phone: '01827752043', area: 'DG', packageId: 'P1', serviceType: ServiceType.INTERNET, dueAmount: 0, status: CustomerStatus.ACTIVE, address: 'Pingonline', connectionDate: '2024-01-01' },
  { id: 'anu0380', name: 'israfillbapary', phone: '01833547154', area: 'ME', packageId: 'P1', serviceType: ServiceType.INTERNET, dueAmount: 500, status: CustomerStatus.ACTIVE, address: 'Pingonline', connectionDate: '2024-01-01' },
  { id: 'anu0379', name: 'samiya', phone: '01957354984', area: 'AG', packageId: 'P1', serviceType: ServiceType.INTERNET, dueAmount: 0, status: CustomerStatus.ACTIVE, address: 'Pingonline', connectionDate: '2024-01-01' },
  { id: 'anu0325', name: 'nasirmollah', phone: '01912377495', area: 'DG', packageId: 'P1', serviceType: ServiceType.DISH, dueAmount: 600, status: CustomerStatus.ACTIVE, address: 'Pingonline', connectionDate: '2024-01-01' }
];

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<{ name: string; role: UserRole; area?: string } | null>(null);
  const [view, setView] = useState<'login' | 'app' | 'customer_portal'>('login');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'customers' | 'invoices' | 'expenses' | 'reports' | 'manual'>('dashboard');
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<string>(new Date().toLocaleTimeString());
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Data States
  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('isp_customers');
    return saved ? JSON.parse(saved) : SEEDED_CUSTOMERS;
  });
  const [payments, setPayments] = useState<Payment[]>(() => {
    const saved = localStorage.getItem('isp_payments');
    return saved ? JSON.parse(saved) : [];
  });
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('isp_expenses');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    setIsSyncing(true);
    localStorage.setItem('isp_customers', JSON.stringify(customers));
    localStorage.setItem('isp_payments', JSON.stringify(payments));
    localStorage.setItem('isp_expenses', JSON.stringify(expenses));
    setTimeout(() => {
      setIsSyncing(false);
      setLastSynced(new Date().toLocaleTimeString());
    }, 500);
  }, [customers, payments, expenses]);

  const addPayment = (customerId: string, amount: number) => {
    const newPayment: Payment = {
      id: `INV-${Date.now().toString().slice(-6)}`,
      customerId,
      amount,
      date: new Date().toISOString().split('T')[0],
      method: 'নগদ',
      collectorId: currentUser?.name || 'Admin'
    };

    setPayments([newPayment, ...payments]);
    setCustomers(customers.map(c => 
      c.id === customerId ? { ...c, dueAmount: Math.max(0, c.dueAmount - amount) } : c
    ));
    
    alert(isOnline 
      ? `সফলভাবে ${amount} ${CURRENCY} পেমেন্ট গ্রহণ করা হয়েছে।` 
      : `অফলাইন মোড: ${amount} ${CURRENCY} পেমেন্ট ডিভাইসে সেভ করা হয়েছে।`
    );
  };

  const login = (role: UserRole, staffId?: string) => {
    if (role === UserRole.COLLECTOR && staffId) {
      const staff = SEEDED_STAFF.find(s => s.id.toUpperCase() === staffId.toUpperCase());
      if (staff) {
        setCurrentUser({ name: staff.name, role, area: staff.area });
        setView('app');
        setActiveTab('customers');
      } else {
        alert('সঠিক আইডি প্রদান করুন (S1 অথবা S2)');
      }
    } else {
      setCurrentUser({ name: role === UserRole.ADMIN ? 'মালিক সাহেব' : 'ম্যানেজার', role });
      setView('app');
      setActiveTab('dashboard');
    }
  };

  if (view === 'login') {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="bg-slate-900 p-10 rounded-[40px] shadow-2xl w-full max-w-md border border-slate-800 text-center animate-in fade-in zoom-in duration-500">
          <Logo className="w-56 h-56 mx-auto mb-2" textColor="text-white" />
          <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.4em] mb-12">Business Solution</p>
          <div className="space-y-4">
            <button onClick={() => login(UserRole.ADMIN)} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/10">অ্যাডমিন লগইন</button>
            <button onClick={() => {
              const id = prompt('কালেক্টর আইডি দিন (S1, S2)');
              if (id) login(UserRole.COLLECTOR, id);
            }} className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/10">কালেক্টর লগইন</button>
            <div className="pt-6 border-t border-slate-800 mt-6">
              <button onClick={() => setView('customer_portal')} className="w-full py-4 bg-slate-800 text-slate-300 rounded-2xl font-black hover:bg-slate-700 transition-all">গ্রাহক পোর্টাল (বিল চেক)</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'customer_portal') {
    return <CustomerPortal onBack={() => setView('login')} customers={customers} payments={payments} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-['Hind_Siliguri']">
      <aside className="hidden md:flex flex-col w-80 bg-white border-r border-slate-200 p-8 sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-12">
          <Logo className="w-12 h-12" iconOnly />
          <div className="flex flex-col">
            <h2 className="text-xl font-black text-slate-800 leading-none">PING</h2>
            <p className="text-[10px] font-bold text-slate-400 tracking-[0.2em]">ONLINE</p>
          </div>
        </div>
        <nav className="space-y-2 flex-1">
          {currentUser?.role !== UserRole.COLLECTOR && (
            <NavItem active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<ICONS.Dashboard className="w-5 h-5"/>} label="ড্যাশবোর্ড" />
          )}
          <NavItem active={activeTab === 'customers'} onClick={() => setActiveTab('customers')} icon={<ICONS.Users className="w-5 h-5"/>} label={currentUser?.role === UserRole.COLLECTOR ? "আমার গ্রাহক" : "গ্রাহক তালিকা"} />
          <NavItem active={activeTab === 'invoices'} onClick={() => setActiveTab('invoices')} icon={<ICONS.Invoice className="w-5 h-5"/>} label="পেমেন্ট হিস্ট্রি" />
          {currentUser?.role !== UserRole.COLLECTOR && (
            <>
              <NavItem active={activeTab === 'expenses'} onClick={() => setActiveTab('expenses')} icon={<ICONS.Expense className="w-5 h-5"/>} label="খরচ ও ব্যয়" />
              <NavItem active={activeTab === 'reports'} onClick={() => setActiveTab('reports')} icon={<ICONS.Report className="w-5 h-5"/>} label="আর্থিক রিপোর্ট" />
            </>
          )}
          <NavItem active={activeTab === 'manual'} onClick={() => setActiveTab('manual')} icon={<ICONS.Help className="w-5 h-5"/>} label="নির্দেশিকা" />
        </nav>
        <div className="mt-auto pt-6 border-t border-slate-100">
           <div className={`mb-4 flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${isOnline ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600 animate-pulse'}`}>
              <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
              {isOnline ? 'Online - Sync Active' : 'Offline - Local Only'}
           </div>
           <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold uppercase">{currentUser?.name[0]}</div>
              <div><p className="text-xs font-black text-slate-800">{currentUser?.name}</p><p className="text-[10px] font-bold text-slate-400 uppercase">{currentUser?.role}</p></div>
           </div>
           <button onClick={() => setView('login')} className="w-full py-3 bg-rose-50 text-rose-600 rounded-xl font-black text-xs hover:bg-rose-100">লগ আউট</button>
        </div>
      </aside>

      <main className="flex-1 p-6 lg:p-12 overflow-y-auto h-screen custom-scrollbar pb-32">
        {currentUser?.role === UserRole.COLLECTOR && activeTab === 'customers' ? (
          <CollectorView currentUser={currentUser} customers={customers} payments={payments} onMakePayment={addPayment} />
        ) : (
          <>
            {activeTab === 'dashboard' && <DashboardView customers={customers} payments={payments} expenses={expenses} />}
            {activeTab === 'customers' && <CustomersView customers={customers} onMakePayment={addPayment} />}
            {activeTab === 'invoices' && <InvoicesView payments={payments} customers={customers} />}
            {activeTab === 'expenses' && <ExpensesView expenses={expenses} onAddExpense={(e: any) => setExpenses([e, ...expenses])} onDeleteExpense={(id: string) => setExpenses(expenses.filter(ex => ex.id !== id))} />}
            {activeTab === 'reports' && <ReportsView payments={payments} expenses={expenses} />}
            {activeTab === 'manual' && <ManualView />}
          </>
        )}
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around p-4 z-[100] shadow-2xl">
        {currentUser?.role !== UserRole.COLLECTOR && <button onClick={() => setActiveTab('dashboard')} className={`p-3 rounded-2xl ${activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}><ICONS.Dashboard/></button>}
        <button onClick={() => setActiveTab('customers')} className={`p-3 rounded-2xl ${activeTab === 'customers' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}><ICONS.Users/></button>
        <button onClick={() => setActiveTab('invoices')} className={`p-3 rounded-2xl ${activeTab === 'invoices' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}><ICONS.Invoice/></button>
        <button onClick={() => setView('login')} className="p-3 rounded-2xl text-rose-500"><svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg></button>
      </nav>
    </div>
  );
};

// Sub-components
const CollectorView = ({ currentUser, customers, payments, onMakePayment }: any) => {
  const [search, setSearch] = useState('');
  const myCustomers = customers.filter((c: any) => c.area === currentUser.area && (c.name.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase())));
  const today = new Date().toISOString().split('T')[0];
  const total = payments.filter((p: any) => p.collectorId === currentUser.name && p.date === today).reduce((acc: number, p: any) => acc + p.amount, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div><h2 className="text-3xl font-black text-slate-800">স্বাগতম, {currentUser.name}!</h2><p className="font-bold text-slate-500">জোন: <span className="text-blue-600">{currentUser.area}</span></p></div>
        <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 text-center"><p className="text-[10px] font-black text-emerald-600 uppercase mb-1">আজকের কালেকশন</p><p className="text-4xl font-black text-emerald-700">{total} {CURRENCY}</p></div>
      </div>
      <input type="text" placeholder="কাস্টমার খুঁজুন..." value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-white border border-slate-200 p-5 rounded-2xl font-bold shadow-sm outline-none" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myCustomers.map((c: any) => (
          <div key={c.id} className="bg-white p-8 rounded-[36px] border border-slate-200 shadow-sm">
            <h3 className="text-xl font-black text-slate-800 mb-1">{c.name}</h3>
            <p className="text-xs font-bold text-slate-400 mb-6">ID: {c.id} | Phone: {c.phone}</p>
            <div className="flex justify-between items-end">
              <div><p className="text-[10px] font-black text-slate-400 uppercase">বকেয়া বিল</p><p className="text-2xl font-black text-rose-600">{c.dueAmount} {CURRENCY}</p></div>
              <button disabled={c.dueAmount === 0} onClick={() => { const amt = prompt(`${c.name} এর পেমেন্ট`, c.dueAmount.toString()); if (amt) onMakePayment(c.id, Number(amt)); }} className={`px-6 py-3 rounded-xl font-black text-xs ${c.dueAmount > 0 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>টাকা গ্রহণ</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CustomerPortal = ({ onBack, customers, payments }: any) => {
  const [query, setQuery] = useState('');
  const [customer, setCustomer] = useState<Customer | null>(null);
  const find = () => {
    const c = customers.find((cust: any) => cust.id === query || cust.phone === query);
    if (c) setCustomer(c); else alert('গ্রাহক পাওয়া যায়নি');
  };
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white p-12 rounded-[40px] shadow-xl border border-slate-200 text-center animate-in zoom-in duration-500">
        <button onClick={onBack} className="mb-8 text-slate-500 font-bold block text-left">← লগইন স্ক্রিনে ফিরুন</button>
        <Logo className="w-32 h-32 mx-auto mb-2" />
        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-10">Customer Care Portal</p>
        <div className="flex gap-4 mb-10"><input type="text" placeholder="আইডি বা ফোন নম্বর দিন" value={query} onChange={e => setQuery(e.target.value)} className="flex-1 bg-slate-50 border border-slate-200 p-5 rounded-2xl font-bold" /><button onClick={find} className="bg-blue-600 text-white px-10 rounded-2xl font-black">চেক করুন</button></div>
        {customer && (
          <div className="bg-blue-50 p-8 rounded-3xl border border-blue-100 animate-in slide-in-from-bottom text-left">
            <h3 className="text-2xl font-black text-blue-900 mb-1">{customer.name}</h3>
            <p className="text-blue-700 font-bold mb-6">আইডি: {customer.id} | এলাকা: {customer.area}</p>
            <div className="grid grid-cols-2 gap-8">
              <div><p className="text-[10px] font-black text-blue-400 uppercase">বকেয়া বিল</p><p className="text-4xl font-black text-blue-900">{customer.dueAmount} {CURRENCY}</p></div>
              <div><p className="text-[10px] font-black text-blue-400 uppercase">সার্ভিস</p><p className="text-xl font-black text-blue-900">{customer.serviceType}</p></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const DashboardView = ({ customers, payments, expenses }: any) => {
  const totalIn = payments.reduce((acc: number, p: any) => acc + p.amount, 0);
  const totalEx = expenses.reduce((acc: number, e: any) => acc + e.amount, 0);
  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <StatsCard title="মোট গ্রাহক" value={customers.length} color="blue" />
        <StatsCard title="মোট কালেকশন" value={`${totalIn} ${CURRENCY}`} color="emerald" />
        <StatsCard title="মোট খরচ" value={`${totalEx} ${CURRENCY}`} color="rose" />
        <StatsCard title="নিট লাভ" value={`${totalIn - totalEx} ${CURRENCY}`} color="amber" />
      </div>
      <div className="bg-white p-10 rounded-[40px] border border-slate-200">
        <h3 className="text-xl font-black mb-8 flex items-center gap-3"><div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>জোন ভিত্তিক গ্রাহক</h3>
        <div className="space-y-4">
          {ZONES.map(z => {
            const count = customers.filter((c:any) => c.area === z).length;
            const per = customers.length ? (count / customers.length) * 100 : 0;
            return (
              <div key={z}>
                <div className="flex justify-between text-xs font-black mb-1"><span>{z} জোন</span><span>{count} জন</span></div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden"><div className="bg-blue-600 h-full" style={{width: `${per}%`}}></div></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const CustomersView = ({ customers, onMakePayment }: any) => {
  const [service, setService] = useState(ServiceType.INTERNET);
  const filtered = customers.filter((c:any) => c.serviceType === service);
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center"><h2 className="text-3xl font-black text-slate-800">গ্রাহক তালিকা</h2><div className="flex bg-slate-200 p-1.5 rounded-2xl gap-1"><button onClick={() => setService(ServiceType.INTERNET)} className={`px-6 py-2 rounded-xl text-sm font-black ${service === ServiceType.INTERNET ? 'bg-white text-blue-600' : 'text-slate-500'}`}>ইন্টারনেট</button><button onClick={() => setService(ServiceType.DISH)} className={`px-6 py-2 rounded-xl text-sm font-black ${service === ServiceType.DISH ? 'bg-white text-blue-600' : 'text-slate-500'}`}>ডিস</button></div></div>
      <div className="bg-white rounded-[40px] border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50"><tr><th className="p-6 text-xs font-black uppercase text-slate-400">নাম</th><th className="p-6 text-xs font-black uppercase text-slate-400">জোন</th><th className="p-6 text-xs font-black uppercase text-slate-400 text-right">বকেয়া</th><th className="p-6 text-xs font-black uppercase text-slate-400 text-center">অ্যাকশন</th></tr></thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((c:any) => (
              <tr key={c.id} className="hover:bg-slate-50">
                <td className="p-6 font-black">{c.name}<br/><span className="text-[10px] text-slate-400 font-bold">{c.id}</span></td>
                <td className="p-6"><span className="bg-slate-100 px-3 py-1 rounded-lg text-[10px] font-black">{c.area}</span></td>
                <td className="p-6 text-right font-black text-rose-600">{c.dueAmount} {CURRENCY}</td>
                <td className="p-6 text-center"><button onClick={() => { const amt = prompt(`${c.name} পেমেন্ট`, c.dueAmount.toString()); if (amt) onMakePayment(c.id, Number(amt)); }} className="bg-emerald-600 text-white px-5 py-2 rounded-xl text-xs font-black">পেমেন্ট</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const InvoicesView = ({ payments, customers }: any) => {
  const [selected, setSelected] = useState<any>(null);
  if (selected) {
    const c = customers.find((cu:any) => cu.id === selected.customerId);
    return (
      <div className="animate-in zoom-in duration-300">
        <button onClick={() => setSelected(null)} className="no-print mb-6 font-bold text-slate-500">← ফিরে যান</button>
        <div id="printable-invoice" className="bg-white p-10 rounded-3xl border border-slate-200 max-w-sm mx-auto text-center shadow-2xl">
          <Logo className="w-24 h-24 mx-auto mb-2" iconOnly />
          <p className="text-[10px] font-black tracking-widest text-slate-400 mb-6 uppercase">Ping Online Official</p>
          <p className="text-[10px] font-bold text-slate-400 border-b pb-4 mb-4">রিসিট নং: #{selected.id}</p>
          <div className="text-left space-y-2 mb-8 text-sm">
            <p className="font-bold">তারিখ: {selected.date}</p>
            <p className="font-bold">গ্রাহক: {c?.name}</p>
            <p className="font-bold">আইডি: {c?.id}</p>
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase mb-1">পরিমাণ</p>
          <p className="text-4xl font-black text-slate-900 mb-8">{selected.amount} {CURRENCY}</p>
          <button onClick={() => window.print()} className="no-print w-full bg-slate-900 text-white py-4 rounded-2xl font-black">প্রিন্ট রিসিট</button>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-black text-slate-800">পেমেন্ট হিস্ট্রি</h2>
      <div className="bg-white rounded-[40px] border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50"><tr><th className="p-6 text-xs font-black uppercase text-slate-400">তারিখ</th><th className="p-6 text-xs font-black uppercase text-slate-400">গ্রাহক</th><th className="p-6 text-xs font-black uppercase text-slate-400 text-right">পরিমাণ</th><th className="p-6 text-xs font-black uppercase text-slate-400 text-center">রিসিট</th></tr></thead>
          <tbody className="divide-y divide-slate-100">
            {payments.map((p:any) => (<tr key={p.id}>
              <td className="p-6 font-bold text-slate-500">{p.date}</td>
              <td className="p-6 font-black">{customers.find((c:any)=>c.id===p.customerId)?.name}</td>
              <td className="p-6 text-right font-black text-emerald-600">{p.amount} {CURRENCY}</td>
              <td className="p-6 text-center"><button onClick={() => setSelected(p)} className="bg-slate-100 px-4 py-2 rounded-xl text-xs font-black">দেখুন</button></td>
            </tr>))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ExpensesView = ({ expenses, onAddExpense, onDeleteExpense }: any) => {
  const [amt, setAmt] = useState('');
  const [desc, setDesc] = useState('');
  const add = () => { if (amt) { onAddExpense({ id: Math.random().toString(36).substr(2,9), category: 'অন্যান্য', amount: Number(amt), description: desc, date: new Date().toISOString().split('T')[0] }); setAmt(''); setDesc(''); } };
  return (
    <div className="space-y-10">
      <div className="bg-white p-10 rounded-[40px] border border-slate-200"><h3 className="text-2xl font-black mb-6">নতুন খরচ</h3><div className="flex gap-4"><input type="number" placeholder="পরিমাণ" value={amt} onChange={e=>setAmt(e.target.value)} className="bg-slate-50 border p-4 rounded-2xl font-bold w-40" /><input type="text" placeholder="বিবরণ" value={desc} onChange={e=>setDesc(e.target.value)} className="flex-1 bg-slate-50 border p-4 rounded-2xl font-bold" /><button onClick={add} className="bg-slate-900 text-white px-8 rounded-2xl font-black">যুক্ত করুন</button></div></div>
      <div className="bg-white rounded-[40px] border border-slate-200 overflow-hidden"><table className="w-full text-left"><thead className="bg-slate-50"><tr><th className="p-6 text-xs font-black uppercase text-slate-400">তারিখ</th><th className="p-6 text-xs font-black uppercase text-slate-400">বিবরণ</th><th className="p-6 text-xs font-black uppercase text-slate-400 text-right">পরিমাণ</th><th className="p-6 text-xs font-black uppercase text-slate-400 text-center">অ্যাকশন</th></tr></thead><tbody className="divide-y divide-slate-100">{expenses.map((e:any) => (<tr key={e.id}><td className="p-6 font-bold">{e.date}</td><td className="p-6 font-black">{e.description}</td><td className="p-6 text-right font-black text-rose-600">{e.amount} {CURRENCY}</td><td className="p-6 text-center"><button onClick={() => onDeleteExpense(e.id)} className="text-rose-500 font-bold">মুছে ফেলুন</button></td></tr>))}</tbody></table></div>
    </div>
  );
};

const ReportsView = ({ payments, expenses }: any) => {
  const in_ = payments.reduce((a:any,p:any)=>a+p.amount, 0);
  const ex_ = expenses.reduce((a:any,e:any)=>a+e.amount, 0);
  return (
    <div className="space-y-10"><div className="grid grid-cols-1 md:grid-cols-3 gap-8"><ReportCard label="মোট আয়" value={in_} color="emerald" icon="৳" /><ReportCard label="মোট ব্যয়" value={ex_} color="rose" icon="−" /><ReportCard label="নিট লাভ" value={in_-ex_} color="blue" icon="=" /></div></div>
  );
};

const ManualView = () => (
  <div className="space-y-10 max-w-3xl mx-auto"><h2 className="text-4xl font-black text-center mb-16">Ping Online গাইড</h2><ManualCard title="অফলাইন বিলিং" content="ইন্টারনেট না থাকলেও বিল সংগ্রহ করা যাবে। ডাটা ফোনে জমা থাকবে এবং পরে অনলাইন হলে অটো সেভ হবে।" /><ManualCard title="পকেট প্রিন্টার" content="যেকোনো পকেট বা থার্মাল প্রিন্টার দিয়ে রিসিট প্রিন্ট করতে পারবেন। রিসিট ভিউতে গিয়ে 'প্রিন্ট' বাটন ব্যবহার করুন।" /></div>
);

// Helpers
const StatsCard = ({ title, value, color }: any) => {
  const colors:any = { blue: 'bg-blue-600', emerald: 'bg-emerald-600', rose: 'bg-rose-600', amber: 'bg-amber-500' };
  return (<div className={`${colors[color]} p-8 rounded-[36px] text-white shadow-xl`}><p className="text-white/70 text-[10px] font-black uppercase mb-1">{title}</p><p className="text-3xl font-black">{value}</p></div>);
};
const NavItem = ({ active, onClick, icon, label }: any) => (<button onClick={onClick} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${active ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}>{icon}<span className="font-black text-sm">{label}</span></button>);
const ReportCard = ({ label, value, color, icon }: any) => { const cMap:any = { blue: 'bg-blue-50 text-blue-600', emerald: 'bg-emerald-50 text-emerald-600', rose: 'bg-rose-50 text-rose-600' }; return (<div className="bg-white p-10 rounded-[40px] border border-slate-200 text-center"><div className={`w-12 h-12 ${cMap[color]} rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-black`}>{icon}</div><p className="text-[10px] font-black text-slate-400 uppercase mb-1">{label}</p><h4 className={`text-4xl font-black ${color==='rose'?'text-rose-600':color==='emerald'?'text-emerald-600':'text-blue-600'}`}>{value} {CURRENCY}</h4></div>); };
const ManualCard = ({ title, content }: any) => (<div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm"><h3 className="text-xl font-black mb-2 text-slate-800">{title}</h3><p className="font-bold text-slate-500">{content}</p></div>);

export default App;
