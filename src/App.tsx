// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import liff from '@line/liff'; // 🚀 เพิ่มบรรทัดนี้เข้าไปครับ
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  Navigate
} from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
  getDoc,
  setDoc,
  serverTimestamp,
  query,
  orderBy,
  where,
  getDocs
} from 'firebase/firestore';
import {
  LayoutDashboard,
  GitMerge,
  Users,
  Package,
  FileText,
  ChevronLeft,
  Plus,
  Trash2,
  PackageSearch,
  AlertCircle,
  UploadCloud,
  Clock,
  Edit2,
  Search,
  BellRing,
  Calendar,
  RefreshCw,
  X,
  Activity,
  Mail,
  Send,
  CheckCircle,
  CheckCheck,
  Eye,
  History,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Truck,
  MapPin,
  Settings,
  Shield,
  UserPlus,
  Key,
  Briefcase,
  LogOut,
  Lock,
  BookOpen,    // 🚀 เติมคำนี้
  ArrowRight   // 🚀 เติมคำนี้
} from 'lucide-react';

import * as XLSX from 'xlsx';
import emailjs from '@emailjs/browser';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// ==========================================
// 1. Firebase Configuration
// ==========================================
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: 'vmis-eeca8.firebaseapp.com',
  projectId: 'vmis-eeca8',
  storageBucket: 'vmis-eeca8.firebasestorage.app',
  messagingSenderId: '602652412992',
  appId: '1:602652412992:web:b52d0a2d82a96b33f863a5',
  measurementId: 'G-41PQJWS30E',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

// ==========================================
// 🌟 Helper Format Time
// ==========================================
const formatTrackingDate = (fsTimestamp: any) => {
  if (!fsTimestamp) return '-';
  const date = fsTimestamp.toDate ? fsTimestamp.toDate() : new Date(fsTimestamp);
  const d = String(date.getDate()).padStart(2, '0');
  const m = date.toLocaleString('en-US', { month: 'short' });
  const y = date.getFullYear();
  const h = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${d}/${m}/${y} ${h}:${min}`;
};

// ==========================================
// 2. Components
// ==========================================
const DollarSign = ({ size, className }: { size: number; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="12" y1="1" x2="12" y2="23"></line>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
  </svg>
);

interface AppIconProps {
  icon: React.ElementType;
  label: string;
  color: string;
  path: string;
  badge?: number;
}

const AppIcon: React.FC<AppIconProps> = ({ icon: Icon, label, color, path, badge }) => (
  <Link
    to={path}
    className={`relative w-full aspect-[5/4] ${color} rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group overflow-hidden flex flex-col items-center justify-center`}
  >
    <Icon size={160} className="absolute -right-8 -bottom-8 text-white/10 group-hover:rotate-12 transition-transform duration-500 pointer-events-none" />
    <div className="bg-white/20 p-4 rounded-3xl mb-3 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300 shadow-inner">
      <Icon size={40} className="text-white drop-shadow-md" />
    </div>
    <span className="text-white font-bold text-sm md:text-lg tracking-wide drop-shadow-sm px-2 relative z-10 text-center">{label}</span>
    {badge !== undefined && badge > 0 && (
      <div className="absolute top-4 right-4 bg-white text-red-600 text-xs md:text-sm font-extrabold px-2 py-1 rounded-full shadow-lg min-w-[1.5rem] text-center z-20 animate-pulse border-2 border-red-100">
        {badge > 99 ? '99+' : badge}
      </div>
    )}
  </Link>
);

const PageTemplate = ({ title, children }: { title: string; children?: React.ReactNode }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('ต้องการออกจากระบบใช่หรือไม่?')) {
      localStorage.removeItem('vmi_user');
      window.location.href = '/login';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')} className="p-2 hover:bg-slate-100 rounded-xl text-slate-600 flex items-center gap-2 font-medium transition-colors">
            <ChevronLeft size={20} /><span className="hidden md:inline">กลับหน้าหลัก</span>
          </button>
          <div className="h-6 w-px bg-slate-200 mx-2"></div>
          <h2 className="text-lg font-bold text-slate-800">{title}</h2>
        </div>

        <button onClick={handleLogout} className="p-2 hover:bg-red-50 text-red-500 rounded-xl flex items-center gap-2 font-bold transition-colors text-sm">
          <LogOut size={18} />
          <span className="hidden md:inline">ออกจากระบบ</span>
        </button>
      </div>
      <main className="p-4 md:p-6 w-full max-w-[100vw] flex-1 overflow-hidden flex flex-col">
        {children || <p className="text-slate-500">กำลังรอข้อมูล...</p>}
      </main>
    </div>
  );
};

// ==========================================
// 🌟 ระบบ Authentication & Login
// ==========================================
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = localStorage.getItem('vmi_user');
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const LoginView = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    try {
      if (cleanEmail === 'admin@vmi.com' && cleanPassword === 'admin1234') {
        localStorage.setItem('vmi_user', JSON.stringify({ name: 'Admin', role: 'Admin' }));
        window.location.href = '/';
        return;
      }

      const q = query(collection(db, 'users'), where('email', '==', cleanEmail));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        alert('ไม่พบอีเมลนี้ในระบบ กรุณาติดต่อผู้ดูแล');
        setLoading(false);
        return;
      }

      let isValid = false;
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        if (userData.password === cleanPassword) {
          isValid = true;
          localStorage.setItem('vmi_user', JSON.stringify({ id: doc.id, name: userData.name, role: userData.role }));
          window.location.href = '/';
        }
      });

      if (!isValid) alert('รหัสผ่านไม่ถูกต้อง');

    } catch (error) {
      alert('ระบบมีปัญหา กรุณาลองใหม่');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6 font-sans relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl max-w-sm w-full relative z-10 border border-white/50 backdrop-blur-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
            <Lock className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800">VMI System</h1>
          <p className="text-sm text-slate-500 mt-2">ลงชื่อเข้าใช้งานระบบ</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
            <input required type="text" value={email} onChange={e => setEmail(e.target.value)} className="w-full border border-slate-300 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-shadow bg-slate-50 focus:bg-white" placeholder="admin@vmi.com" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
            <input required type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full border border-slate-300 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-shadow bg-slate-50 focus:bg-white" placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/30 transition-all flex justify-center items-center gap-2">
            {loading ? <Clock className="animate-spin" size={20} /> : 'เข้าสู่ระบบ'}
          </button>
        </form>

        <div className="mt-6 text-center text-[10px] text-slate-400 font-mono">
          <p>Default User: admin@vmi.com</p>
          <p>Pass: admin1234</p>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 🌟 หน้า Acknowledge
// ==========================================
const AcknowledgeView = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [supplierName, setSupplierName] = useState('');
  const hasProcessed = useRef(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const logId = urlParams.get('id');

    if (!logId) { setStatus('error'); return; }

    const confirmAcknowledge = async () => {
      if (hasProcessed.current) return;
      hasProcessed.current = true;

      try {
        const docRef = doc(db, 'email_logs', logId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setSupplierName(data.supplier_name || 'ซัพพลายเออร์');

          if (!data.acknowledged) {
            await updateDoc(docRef, { acknowledged: true, acknowledged_at: serverTimestamp() });
            if (data.items && Array.isArray(data.items)) {
              const updatePromises = data.items.map((item: any) => {
                if (item.product_id) {
                  return updateDoc(doc(db, 'products', item.product_id), { is_acknowledged: true, acknowledged_at: serverTimestamp() }).catch((e) => console.log(e));
                }
                return Promise.resolve();
              });
              await Promise.all(updatePromises);
            }
            await addDoc(collection(db, 'tracking'), {
              log_id: logId,
              supplier_name: data.supplier_name || 'ไม่ระบุชื่อ',
              supplier_email: data.supplier_email || '',
              items: data.items || [],
              current_status: 1, 
              status_timestamps: { step_1: serverTimestamp(), step_2: null, step_3: null, step_4: null },
              createdAt: serverTimestamp(), updatedAt: serverTimestamp()
            });
          }
          setStatus('success');
        } else {
          setStatus('error');
        }
      } catch (error) { setStatus('error'); }
    };
    confirmAcknowledge();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6 font-sans">
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl max-w-md w-full text-center border border-slate-100">
        {status === 'loading' && (
          <div className="flex flex-col items-center">
            <Clock className="animate-spin text-blue-500 mb-4" size={64} />
            <h2 className="text-xl font-bold text-slate-700">กำลังตรวจสอบข้อมูล...</h2>
          </div>
        )}
        {status === 'success' && (
          <div className="flex flex-col items-center animate-slide-down">
            <CheckCircle className="text-emerald-500 mb-6 drop-shadow-md" size={80} />
            <h2 className="text-2xl font-black text-slate-800 mb-2">รับทราบการจัดส่งเรียบร้อย!</h2>
            <p className="text-slate-600 mb-6 leading-relaxed">ขอบคุณ <b>{supplierName}</b><br />ระบบได้บันทึกการยืนยันและสร้างเลข Tracking เรียบร้อยแล้ว</p>
            <button onClick={() => window.close()} className="px-8 py-3 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl w-full">ปิดหน้าต่างนี้</button>
          </div>
        )}
        {status === 'error' && (
          <div className="flex flex-col items-center animate-slide-down">
            <AlertTriangle className="text-red-500 mb-6 drop-shadow-md" size={80} />
            <h2 className="text-2xl font-black text-slate-800 mb-2">ไม่พบข้อมูล</h2>
            <p className="text-slate-600">ลิงก์อาจหมดอายุ หรือมีการยืนยันไปแล้วก่อนหน้านี้</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 🌟 หน้า HomeView
// ==========================================
const HomeView = () => {
  const [lowStockCount, setLowStockCount] = useState(0);
  const [activeTrackingCount, setActiveTrackingCount] = useState(0);

  useEffect(() => {
    const unsubProd = onSnapshot(query(collection(db, 'products')), (snapshot) => {
      setLowStockCount(snapshot.docs.filter((doc) => { const d = doc.data(); return d.available_qty <= d.min_stock && d.min_stock > 0 && !d.is_emailed; }).length);
    });
    const unsubTrack = onSnapshot(query(collection(db, 'tracking')), (snapshot) => {
      setActiveTrackingCount(snapshot.docs.filter((doc) => { const d = doc.data(); return d.current_status >= 1 && d.current_status < 4; }).length);
    });
    return () => { unsubProd(); unsubTrack(); };
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 relative flex flex-col items-center justify-center p-6">
      <div className="mb-10 text-center flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-2 tracking-tight bg-gradient-to-r from-blue-700 via-blue-600 to-blue-800 bg-clip-text text-transparent drop-shadow-sm">
          VMI System
        </h1>
        <p className="text-slate-500 font-medium text-sm md:text-base">
          ระบบบริหารจัดการสินค้าคงคลัง (Vendor Managed Inventory)
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 max-w-5xl w-full">
        <AppIcon icon={LayoutDashboard} label="Dashboard" path="/dashboard" color="bg-gradient-to-br from-blue-500 to-blue-600" />
        <AppIcon icon={GitMerge} label="Workflow" path="/workflow" color="bg-gradient-to-br from-indigo-500 to-indigo-600" badge={lowStockCount} />
        <AppIcon icon={Truck} label="Tracking" path="/tracking" color="bg-gradient-to-br from-cyan-500 to-cyan-600" badge={activeTrackingCount} />
        <AppIcon icon={Package} label="Stock Mgt." path="/stock" color="bg-gradient-to-br from-orange-500 to-orange-600" badge={lowStockCount} />
        <AppIcon icon={Users} label="Supplier Mgt." path="/suppliers" color="bg-gradient-to-br from-emerald-500 to-emerald-600" />
        <AppIcon icon={FileText} label="Reports" path="/reports" color="bg-gradient-to-br from-slate-600 to-slate-700" />
        <AppIcon icon={Settings} label="Settings" path="/settings" color="bg-gradient-to-br from-slate-700 to-slate-800" />
      </div>
    </div>
  );
};

// ==========================================
// 🌟 หน้า Tracking View 
// ==========================================
const TrackingView = () => {
  const [trackings, setTrackings] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'tracking'), orderBy('updatedAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTrackings(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const simulateLineOAUpdate = async (id: string, newStatus: number) => {
    try {
      const stepKey = `step_${newStatus}`;
      await updateDoc(doc(db, 'tracking', id), {
        current_status: newStatus,
        [`status_timestamps.${stepKey}`]: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } catch (e) {
      console.error("Update Tracking Error", e);
    }
  };

  const StatusStepper = ({ currentStatus, timestamps }: any) => {
    const steps = [
      { id: 1, label: 'เตรียมจัดส่ง' }, { id: 2, label: 'กำลังจัดส่ง' }, { id: 3, label: 'ถึงโรงงาน' }, { id: 4, label: 'โรงงานรับสินค้า' }
    ];

    return (
      <div className="flex items-center w-full my-6">
        {steps.map((step, index) => {
          const isActive = currentStatus >= step.id;
          const isCurrent = currentStatus === step.id;
          const time = timestamps?.[`step_${step.id}`];

          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center flex-1 relative z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border-2 shadow-sm transition-all duration-300 
                  ${isActive ? 'bg-cyan-500 border-cyan-500 text-white' : 'bg-white border-slate-300 text-slate-400'} 
                  ${isCurrent ? 'ring-4 ring-cyan-200 scale-110' : ''}`}
                >
                  {isActive ? <CheckCircle size={16} /> : step.id}
                </div>
                <div className="mt-2 text-center w-full flex flex-col items-center">
                  <p className={`text-[11px] font-bold ${isActive ? 'text-slate-800' : 'text-slate-400'}`}>{step.label}</p>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5 leading-tight">{formatTrackingDate(time)}</p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-1 rounded-full -mx-6 z-0 ${currentStatus > step.id ? 'bg-cyan-500' : 'bg-slate-200'}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  return (
    <PageTemplate title="Delivery Tracking">
      <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-200 flex-1 flex flex-col overflow-hidden">
        <div className="space-y-6 flex flex-col h-full relative">
          <div>
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Truck className="text-cyan-500" /> Tracking Board
            </h3>
            <p className="text-sm text-slate-500 mt-1">ติดตามสถานะการจัดส่ง (จำลองการรับค่าจาก Line OA Flex Message)</p>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-6 space-y-4">
            {trackings.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <MapPin size={48} className="mb-4 opacity-50" />
                <p>ยังไม่มีรายการจัดส่งในขณะนี้</p>
              </div>
            ) : (
              trackings.map((track) => (
                <div key={track.id} className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-lg text-cyan-900">{track.supplier_name}</h4>
                      <p className="text-xs text-slate-500 font-mono">T-ID: {track.id}</p>
                    </div>
                    {track.current_status === 4 ? (
                      <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold border border-emerald-200 flex items-center gap-1">
                        <CheckCheck size={14}/> โรงงานรับสินค้าแล้ว
                      </span>
                    ) : (
                      <span className="bg-cyan-100 text-cyan-700 px-3 py-1 rounded-full text-xs font-bold border border-cyan-200 flex items-center gap-1 animate-pulse">
                        <Truck size={14}/> กำลังดำเนินการจัดส่ง
                      </span>
                    )}
                  </div>

                  <StatusStepper currentStatus={track.current_status} timestamps={track.status_timestamps} />

                  <div className="mt-6 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <p className="text-xs font-bold text-slate-500 mb-2">รายการสินค้าในเที่ยวนี้ ({track.items?.length || 0}):</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {track.items?.map((item: any, idx: number) => (
                        <div key={idx} className="bg-white px-3 py-2 rounded-lg border border-slate-200 text-sm flex justify-between items-center shadow-sm">
                          <span className="font-mono font-bold text-slate-700 truncate mr-2" title={item.description}>{item.part_no}</span>
                          <span className="text-red-600 font-bold bg-red-50 px-2 rounded">ขาด {((item.min || 0) - (item.qty || 0)).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-2 items-center">
                    <span className="text-xs font-bold text-slate-400 mr-2 uppercase">Line OA Simulator:</span>
                    <button onClick={() => simulateLineOAUpdate(track.id, 2)} disabled={track.current_status >= 2} className="text-[11px] px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 font-bold border border-blue-200 disabled:opacity-50 transition-colors">กด กำลังจัดส่ง</button>
                    <button onClick={() => simulateLineOAUpdate(track.id, 3)} disabled={track.current_status >= 3} className="text-[11px] px-3 py-1.5 rounded-lg bg-orange-50 text-orange-700 font-bold border border-orange-200 disabled:opacity-50 transition-colors">กด ถึงโรงงาน</button>
                    <button onClick={() => simulateLineOAUpdate(track.id, 4)} disabled={track.current_status >= 4} className="text-[11px] px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 disabled:opacity-50 transition-colors">กด โรงงานรับสินค้า</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </PageTemplate>
  );
};

// ==========================================
// 🌟 หน้า Dashboard
// ==========================================
const DashboardView = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);

  const currentYear = new Date().getFullYear();
  const yearsList = Array.from({ length: 5 }, (_, i) => (currentYear - i).toString());

  const [viewingProductList, setViewingProductList] = useState<{ title: string; items: any[]; } | null>(null);
  const [viewingConsumptionPart, setViewingConsumptionPart] = useState<any | null>(null);
  const [viewYear, setViewYear] = useState<string>(currentYear.toString());

  useEffect(() => {
    const unsubProd = onSnapshot(query(collection(db, 'products')), (s) => setProducts(s.docs.map((d) => ({ id: d.id, ...d.data() }))));
    const unsubSup = onSnapshot(query(collection(db, 'suppliers')), (s) => setSuppliers(s.docs.map((d) => ({ id: d.id, ...d.data() }))));
    const unsubLog = onSnapshot(query(collection(db, 'email_logs'), orderBy('sent_at', 'desc')), (s) => setLogs(s.docs.map((d) => ({ id: d.id, ...d.data() }))));
    return () => { unsubProd(); unsubSup(); unsubLog(); };
  }, []);

  const totalProducts = products.length;
  const zeroStockProducts = products.filter((p) => p.available_qty <= 0 && p.min_stock > 0);
  const lowStockProducts = products.filter((p) => p.available_qty <= p.min_stock && p.available_qty > 0 && p.min_stock > 0);
  const normalStockProducts = products.filter((p) => p.available_qty > p.min_stock || p.min_stock === 0);

  const uniqueSuppliers = new Set(suppliers.map((s) => s.vendor_no).filter(Boolean));
  const totalSuppliers = uniqueSuppliers.size;

  const stockHealthData = [
    { name: 'Normal (ปกติ)', value: normalStockProducts.length, color: '#10b981', items: normalStockProducts },
    { name: 'Low Stock (ต่ำกว่า Min)', value: lowStockProducts.length, color: '#f59e0b', items: lowStockProducts },
    { name: 'Out of Stock (ของหมด)', value: zeroStockProducts.length, color: '#ef4444', items: zeroStockProducts },
  ];

  const supplierLowStockCount = products.reduce((acc, p) => {
    if (p.available_qty <= p.min_stock && p.min_stock > 0) {
      const sup = p.supplier_name || 'Unassigned';
      acc[sup] = (acc[sup] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const supplierChartData = Object.entries(supplierLowStockCount)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const getSupplierAvgWeek = (matchedSup: any) => {
    if (!matchedSup) return 0;
    const dataObj = matchedSup.yearly_data || matchedSup.monthly_data || {};
    const yearKeys = Object.keys(dataObj).filter((k) => !isNaN(Number(k)));
    if (yearKeys.length > 0) {
      const maxYear = Math.max(...yearKeys.map(Number));
      const yearData = dataObj[maxYear];
      const values = MONTHS.map((m) => yearData[m] || 0);
      const total = values.reduce((sum, val) => sum + val, 0);
      const activeMonths = values.filter((v) => v > 0).length || 1;
      const avgMonth = total > 0 ? total / activeMonths : 0;
      return total > 0 ? avgMonth / 4 : 0;
    }
    return 0;
  };

  const getForecastOrderDays = (availableQty: number, minStock: number, avgWeek: number) => {
    if (availableQty <= minStock) return -1;
    if (avgWeek <= 0) return 999;
    const daysToReachMin = ((availableQty - minStock) / avgWeek) * 7;
    return daysToReachMin - 7;
  };

  const getForecastOrderDate = (availableQty: number, minStock: number, avgWeek: number) => {
    if (availableQty <= minStock) return { text: 'สั่งด่วน (ของขาด)', urgent: true };
    if (avgWeek <= 0) return { text: 'ไม่มีประวัติเบิกใช้', urgent: false };
    const daysToReachMin = ((availableQty - minStock) / avgWeek) * 7;
    const orderDays = daysToReachMin - 7;
    if (orderDays <= 0) return { text: 'สั่งด่วน (ครบกำหนด)', urgent: true };
    const orderDate = new Date();
    orderDate.setDate(orderDate.getDate() + orderDays);
    return {
      text: orderDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      urgent: orderDays <= 3,
    };
  };

  const urgentItems = products
    .filter((p) => p.min_stock > 0)
    .map((p) => {
      const matchedSup = suppliers.find((s) => s.part_no === p.part_no);
      const avgWeek = getSupplierAvgWeek(matchedSup);
      const orderDays = getForecastOrderDays(p.available_qty, p.min_stock, avgWeek);
      return { ...p, orderDays };
    })
    .sort((a, b) => a.orderDays - b.orderDays)
    .slice(0, 5);

  const handleRowClick = (product: any) => {
    const matchedSup = suppliers.find((s) => s.part_no === product.part_no);
    if (matchedSup) {
      setViewingConsumptionPart({ product, supplier: matchedSup });
      const dataObj = matchedSup.yearly_data || matchedSup.monthly_data || {};
      const yearKeys = Object.keys(dataObj).filter((k) => !isNaN(Number(k)));
      if (yearKeys.length > 0) {
        setViewYear(Math.max(...yearKeys.map(Number)).toString());
      } else {
        setViewYear(currentYear.toString());
      }
    } else {
      setViewingConsumptionPart({ product, supplier: null });
      setViewYear(currentYear.toString());
    }
  };

  const handlePieClick = (data: any, index: number) => {
    const selectedData = stockHealthData[index];
    setViewingProductList({ title: selectedData.name, items: selectedData.items });
  };

  const KpiCard = ({ title, value, subtext, icon: Icon, colorClass, bgClass, onClick }: any) => (
    <div
      onClick={onClick}
      className={`bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 transition-all ${
        onClick ? 'cursor-pointer hover:shadow-md hover:scale-105 hover:border-blue-300' : 'hover:shadow-md'
      }`}
    >
      <div className={`p-4 rounded-xl ${bgClass} ${colorClass}`}>
        <Icon size={28} />
      </div>
      <div>
        <p className="text-sm font-bold text-slate-500 uppercase tracking-wide">{title}</p>
        <div className="flex items-baseline gap-2">
          <p className="text-2xl font-black text-slate-800">{value}</p>
          {subtext && <p className="text-xs font-bold text-slate-400">{subtext}</p>}
        </div>
      </div>
    </div>
  );

  return (
    <PageTemplate title="Executive Dashboard">
      <div className="h-full flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-2 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 shrink-0">
          <KpiCard title="Total Parts" value={totalProducts.toLocaleString()} subtext="รายการ" icon={PackageSearch} colorClass="text-blue-600" bgClass="bg-blue-50" />
          <KpiCard onClick={() => setViewingProductList({ title: 'Low Stock (ทั้งหมดที่ต่ำกว่า Min)', items: [...lowStockProducts, ...zeroStockProducts] })} title="Low Stock" value={(lowStockProducts.length + zeroStockProducts.length).toLocaleString()} subtext="รายการ (คลิกเพื่อดู)" icon={AlertTriangle} colorClass="text-orange-600" bgClass="bg-orange-50" />
          <KpiCard title="Active Suppliers" value={totalSuppliers.toLocaleString()} subtext="บริษัท" icon={Users} colorClass="text-emerald-600" bgClass="bg-emerald-50" />
          <KpiCard title="PO Sent" value={logs.length.toLocaleString()} subtext="ครั้ง" icon={Mail} colorClass="text-indigo-600" bgClass="bg-indigo-50" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 shrink-0">
          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex flex-col">
            <h4 className="font-bold text-lg text-slate-700 mb-4 flex items-center gap-2"><Activity className="text-emerald-500" /> Stock Health Status</h4>
            <div className="flex-1 min-h-[250px] flex items-center justify-center">
              {totalProducts === 0 ? (
                <p className="text-slate-400">ไม่มีข้อมูลสินค้า</p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={stockHealthData} innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value" onClick={handlePieClick} className="cursor-pointer hover:opacity-80">
                      {stockHealthData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} รายการ (คลิกเพื่อดู)`, 'จำนวน']} />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex flex-col">
            <h4 className="font-bold text-lg text-slate-700 mb-4 flex items-center gap-2"><BarChart3 className="text-blue-500" /> Top 5 Suppliers (ของขาดมากสุด)</h4>
            <div className="flex-1 min-h-[250px]">
              {supplierChartData.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-400">ไม่มีรายการของขาด</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={supplierChartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 11 }} />
                    <Tooltip cursor={{ fill: '#f1f5f9' }} formatter={(value) => [`${value} รายการ`, 'ของขาด']} />
                    <Bar dataKey="count" fill="#f59e0b" radius={[0, 4, 4, 0]} barSize={20}>
                      {supplierChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={index === 0 ? '#ef4444' : '#f59e0b'} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 shrink-0">
          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
            <h4 className="font-bold text-lg text-slate-700 mb-4 flex items-center gap-2"><AlertCircle className="text-red-500" /> Watchlist: สั่งของด่วน</h4>
            <div className="overflow-hidden rounded-xl border border-slate-100">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600 text-xs uppercase font-bold">
                  <tr><th className="p-3">Part No</th><th className="p-3">Supplier</th><th className="p-3 text-right">Available</th><th className="p-3 text-center">Status</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {urgentItems.length === 0 ? (
                    <tr><td colSpan={4} className="p-6 text-center text-slate-400">ไม่มีสินค้ารอสั่งด่วน</td></tr>
                  ) : (
                    urgentItems.map((p) => (
                      <tr key={p.id} onClick={() => handleRowClick(p)} className="hover:bg-slate-50 cursor-pointer transition-colors">
                        <td className="p-3 font-mono font-bold text-slate-700">{p.part_no}</td>
                        <td className="p-3 text-slate-600 truncate max-w-[120px]">{p.supplier_name}</td>
                        <td className="p-3 text-right font-mono font-bold text-red-600">{p.available_qty}</td>
                        <td className="p-3 text-center">
                          {p.orderDays <= 0 ? <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-[10px] font-bold">ของขาดแล้ว</span> : <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-[10px] font-bold">สั่งใน {Math.ceil(p.orderDays)} วัน</span>}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
            <h4 className="font-bold text-lg text-slate-700 mb-4 flex items-center gap-2"><Clock className="text-indigo-500" /> Recent Replenishments</h4>
            <div className="overflow-hidden rounded-xl border border-slate-100">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600 text-xs uppercase font-bold">
                  <tr><th className="p-3">เวลาที่ส่ง</th><th className="p-3">Supplier</th><th className="p-3 text-center">จำนวน</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {logs.slice(0, 5).length === 0 ? (
                    <tr><td colSpan={3} className="p-6 text-center text-slate-400">ยังไม่มีประวัติการแจ้งเตือน</td></tr>
                  ) : (
                    logs.slice(0, 5).map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50">
                        <td className="p-3 font-mono text-slate-500 text-xs">{log.sent_at?.toDate ? log.sent_at.toDate().toLocaleString('th-TH', { dateStyle: 'short', timeStyle: 'short' }) : '...'}</td>
                        <td className="p-3 font-bold text-indigo-700 truncate max-w-[150px]">{log.supplier_name}</td>
                        <td className="p-3 text-center"><span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs font-bold">{log.items?.length || 0} รายการ</span></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {viewingProductList && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[80vh] animate-slide-down">
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2"><PackageSearch className="text-blue-500" size={20} /> รายการสินค้า: {viewingProductList.title}</h3>
                <button onClick={() => setViewingProductList(null)} className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"><X size={20} /></button>
              </div>
              <div className="p-0 overflow-y-auto custom-scrollbar flex-1">
                <table className="w-full text-left whitespace-nowrap text-sm">
                  <thead className="bg-slate-100 text-slate-600 text-[11px] uppercase font-bold sticky top-0 shadow-sm">
                    <tr><th className="p-3 pl-6">Part No</th><th className="p-3">Description</th><th className="p-3 text-right">Available</th><th className="p-3 text-center">Min Stock</th><th className="p-3 text-center">Status</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {viewingProductList.items.map((p: any) => (
                      <tr key={p.id} onClick={() => handleRowClick(p)} className="hover:bg-slate-50 cursor-pointer transition-colors">
                        <td className="p-3 pl-6 font-mono font-bold text-slate-700 flex items-center gap-2">
                          {p.part_no} {p.is_acknowledged ? <span className="text-[9px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-200 font-bold">Acked</span> : p.is_emailed ? <span className="text-[9px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded border border-orange-200 font-bold">Sent</span> : null}
                        </td>
                        <td className="p-3 text-slate-800"><div className="truncate w-48">{p.description}</div></td>
                        <td className="p-3 text-right font-mono font-bold text-blue-600">{p.available_qty}</td>
                        <td className="p-3 text-center font-mono font-bold text-red-500">{p.min_stock}</td>
                        <td className="p-3 text-center">
                          {p.available_qty <= p.min_stock ? <span className="px-2 py-1 bg-red-100 text-red-700 text-[10px] rounded font-bold">ต่ำกว่ากำหนด</span> : <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] rounded font-bold">ปกติ</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {viewingConsumptionPart && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[90vh] animate-slide-down">
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><Activity size={24} /></div>
                  <div>
                    <h3 className="font-bold text-xl text-slate-800">{viewingConsumptionPart.product.part_no}</h3>
                    <p className="text-sm text-slate-500">{viewingConsumptionPart.product.description}</p>
                  </div>
                </div>
                <button onClick={() => setViewingConsumptionPart(null)} className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"><X size={24} /></button>
              </div>

              <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-slate-50/50">
                {(() => {
                  const sup = viewingConsumptionPart.supplier;
                  const product = viewingConsumptionPart.product;
                  const yearData = sup ? sup.yearly_data?.[viewYear] || sup.monthly_data?.[viewYear] || {} : {};
                  const values = MONTHS.map((m) => yearData[m] || 0);
                  const total = values.reduce((sum, val) => sum + val, 0);
                  const activeMonths = values.filter((v) => v > 0).length || 1;
                  const avgMonth = total > 0 ? total / activeMonths : 0;
                  const avgWeek = total > 0 ? avgMonth / 4 : 0;
                  const autoMin = avgWeek * 2;
                  const autoMax = avgWeek * 4;
                  const forecast = getForecastOrderDate(product.available_qty, product.min_stock, avgWeek);

                  return (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl flex justify-between items-center">
                          <div>
                            <p className="text-xs font-bold text-orange-600 mb-1 uppercase tracking-wide">Available Qty (ยอดใช้ได้จริง)</p>
                            <p className="text-3xl font-mono font-extrabold text-orange-800">{product.available_qty?.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                          </div>
                          <PackageSearch size={40} className="text-orange-200" />
                        </div>
                        <div className={`${forecast.urgent ? 'bg-red-50 border-red-200' : 'bg-purple-50 border-purple-100'} border p-4 rounded-xl flex justify-between items-center`}>
                          <div>
                            <p className={`text-xs font-bold mb-1 uppercase tracking-wide ${forecast.urgent ? 'text-red-600' : 'text-purple-600'}`}>Reorder date (ต้องสั่งของภายใน)</p>
                            <p className={`text-3xl font-bold ${forecast.urgent ? 'text-red-700' : 'text-purple-800'}`}>{forecast.text}</p>
                          </div>
                          <Clock size={40} className={forecast.urgent ? 'text-red-200' : 'text-purple-200'} />
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-6 gap-4">
                        <div>
                          <h4 className="font-bold text-lg text-slate-700">ประวัติการใช้งาน (Consumption)</h4>
                          {sup && <p className="text-sm text-emerald-600 font-bold">Supplier: {sup.vendor_name}</p>}
                        </div>
                        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl shadow-sm">
                          <Calendar size={18} className="text-emerald-600" />
                          <span className="text-sm font-bold text-slate-600">เลือกปี:</span>
                          <select className="bg-transparent font-bold text-emerald-800 outline-none text-sm cursor-pointer" value={viewYear} onChange={(e) => setViewYear(e.target.value)}>
                            {yearsList.map((y) => <option key={y} value={y}>ปี {y}</option>)}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3">
                        {MONTHS.map((m) => (
                          <div key={m} className="bg-white border border-slate-200 p-3 rounded-xl shadow-sm flex flex-col items-center justify-center">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">{m}</span>
                            <span className="text-lg font-mono font-bold text-slate-700">{yearData[m] > 0 ? yearData[m].toLocaleString(undefined, { maximumFractionDigits: 2 }) : '-'}</span>
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
                          <p className="text-xs font-bold text-blue-600 mb-1">Avg Month</p>
                          <p className="text-xl font-mono font-bold text-blue-800">{avgMonth > 0 ? avgMonth.toLocaleString(undefined, { maximumFractionDigits: 1 }) : '0'}</p>
                        </div>
                        <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
                          <p className="text-xs font-bold text-blue-600 mb-1">Avg Week</p>
                          <p className="text-xl font-mono font-bold text-blue-800">{avgWeek > 0 ? avgWeek.toLocaleString(undefined, { maximumFractionDigits: 1 }) : '0'}</p>
                        </div>
                        <div className="bg-red-50 border border-red-100 p-4 rounded-xl">
                          <p className="text-xs font-bold text-red-600 mb-1">Min Stock (Wk×2)</p>
                          <p className="text-xl font-mono font-bold text-red-800">{autoMin > 0 ? autoMin.toLocaleString(undefined, { maximumFractionDigits: 1 }) : '0'}</p>
                        </div>
                        <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl">
                          <p className="text-xs font-bold text-emerald-600 mb-1">Max Stock (Wk×4)</p>
                          <p className="text-xl font-mono font-bold text-emerald-800">{autoMax > 0 ? autoMax.toLocaleString(undefined, { maximumFractionDigits: 1 }) : '0'}</p>
                        </div>
                      </div>

                      {!sup && <div className="text-center p-4 bg-orange-50 text-orange-600 rounded-xl font-bold text-sm">ไม่พบประวัติการใช้งาน (ยังไม่มีการผูก Supplier สำหรับสินค้านี้)</div>}
                    </div>
                  );
                })()}
              </div>

              <div className="px-6 py-4 border-t border-slate-100 bg-white flex justify-end">
                <button onClick={() => setViewingConsumptionPart(null)} className="px-8 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold transition-colors shadow-md">
                  ปิดหน้าต่าง
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageTemplate>
  );
};

// ==========================================
// 🌟 หน้า Workflow (ระบบจัดการใบสั่งของ & ส่ง Email)
// ==========================================
const WorkflowView = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [sendingEmailId, setSendingEmailId] = useState<string | null>(null);

  useEffect(() => {
    const qProd = query(collection(db, 'products'));
    const unsubProd = onSnapshot(qProd, (snapshot) => setProducts(snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))));
    const qSup = query(collection(db, 'suppliers'));
    const unsubSup = onSnapshot(qSup, (snapshot) => setSuppliers(snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))));
    return () => { unsubProd(); unsubSup(); };
  }, []);

  const lowStockProducts = products.filter((p) => p.available_qty <= p.min_stock && p.min_stock > 0);

  const ordersBySupplier = lowStockProducts.reduce((acc, product) => {
    const supName = product.supplier_name || 'รอการผูกข้อมูล';
    if (!acc[supName]) acc[supName] = [];
    acc[supName].push(product);
    return acc;
  }, {} as Record<string, any[]>);

  const handleSendEmail = async (supplierName: string, items: any[]) => {
    const matchedSup = suppliers.find((s) => s.vendor_name === supplierName);
    const supplierEmail = matchedSup?.supplier_email || '';

    if (!supplierEmail) {
      alert(`⚠️ ไม่พบ Email ของซัพพลายเออร์ "${supplierName}"\nกรุณาไปเพิ่ม Email ในเมนู Supplier Mgt. ก่อนครับ`);
      return;
    }

    setSendingEmailId(supplierName);

    let currentUserName = 'System';
    try {
      const userStr = localStorage.getItem('vmi_user');
      if (userStr) currentUserName = JSON.parse(userStr).name;
    } catch (e) {}

    try {
      const logRef = await addDoc(collection(db, 'email_logs'), {
        supplier_name: supplierName,
        supplier_email: supplierEmail,
        items: items.map((i) => ({
          product_id: i.id,
          part_no: i.part_no,
          description: i.description,
          qty: i.available_qty,
          min: i.min_stock,
        })),
        sent_at: serverTimestamp(),
        acknowledged: false,
        acknowledged_at: null,
        sent_by: currentUserName,
      });

      const ackLink = `${window.location.origin}/acknowledge?id=${logRef.id}`;
      const subject = `[VMI System] แจ้งเติมสต็อกสินค้าด่วน - ${supplierName}`;

      let body = `<div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">`;
      body += `<p>เรียน ทีมงาน <b>${supplierName}</b>,</p>`;
      body += `<p>ระบบ VMI ตรวจพบว่าสินค้าของท่านมียอดคงเหลือต่ำกว่าจุดสั่งซื้อ (Min Stock)<br/>`;
      body += `โปรดดำเนินการจัดเตรียมและจัดส่งสินค้าดังต่อไปนี้ ภายใน 5 วันทำการ:</p>`;
      body += `<div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin-bottom: 20px;">`;
      items.forEach((item, index) => {
        const orderQty = item.min_stock - item.available_qty;
        body += `<p style="margin: 0 0 10px 0;">`;
        body += `<b>${index + 1}. P/N: ${item.part_no}</b><br/>`;
        body += `ชื่อสินค้า: ${item.description}<br/>`;
        body += `ยอดคงเหลือปัจจุบัน: <span style="color:#ef4444; font-weight:bold;">${item.available_qty.toLocaleString()}</span> | จุดสั่งซื้อ (Min): ${item.min_stock.toLocaleString()}<br/>`;
        body += `<span style="color:#10b981; font-weight:bold;">>>> จำนวนที่แนะนำให้ส่ง: ${orderQty > 0 ? orderQty.toLocaleString() : 'ตรวจสอบยอด'}</span>`;
        body += `</p>`;
      });
      body += `</div>`;
      body += `<p>📌 <b>รบกวนกดปุ่มด้านล่างนี้ เพื่อยืนยันว่าท่าน "รับทราบ" การแจ้งเตือนนี้แล้วครับ:</b></p>`;
      body += `<p><a href="${ackLink}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">✅ คลิกเพื่อรับทราบการจัดส่ง</a></p>`;
      body += `<br/><p>ขอบคุณครับ<br/>ฝ่ายจัดซื้อ / แผนกคลังสินค้า<br/>`;
      body += `<span style="color:#94a3b8; font-size: 12px;">(ผู้ทำรายการ: ${currentUserName})</span></p>`;
      body += `</div>`;

      const serviceId = 'service_ym7bjkn';
      const templateId = 'template_g2denka';
      const publicKey = 'mZ-fOmq0CV0gZQvdF';
      const templateParams = { supplier_email: supplierEmail, subject: subject, message: body };
      await emailjs.send(serviceId, templateId, templateParams, publicKey);

      const updatePromises = items.map((item) => updateDoc(doc(db, 'products', item.id), { is_emailed: true, last_emailed_at: serverTimestamp(), is_acknowledged: false, acknowledged_at: null }));
      await Promise.all(updatePromises);
      alert(`✅ ส่ง Email และแนบลิงก์ยืนยันให้ Supplier สำเร็จ!`);
    } catch (error) {
      console.error('EmailJS Error:', error);
      alert(`❌ การส่ง Email ล้มเหลว กรุณาตรวจสอบการตั้งค่า EmailJS`);
    } finally {
      setSendingEmailId(null);
    }
  };

  return (
    <PageTemplate title="Workflow & Replenishment">
      <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-200 flex-1 flex flex-col overflow-hidden">
        <div className="space-y-6 flex flex-col h-full">
          <div>
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2"><GitMerge className="text-indigo-500" /> ระบบแจ้งอนุมัติและสั่งของ (PO/PR)</h3>
            <p className="text-sm text-slate-500 mt-1">กดปุ่มส่ง Email เพื่อแจ้ง Supplier อัตโนมัติ (ระบบจะลดแจ้งเตือนให้ทันทีที่ส่งสำเร็จ)</p>
          </div>

          {Object.keys(ordersBySupplier).length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-10 flex flex-col items-center justify-center text-center">
              <div className="bg-green-100 text-green-600 p-4 rounded-full mb-4"><PackageSearch size={40} /></div>
              <h4 className="text-xl font-bold text-slate-700">สต็อกสินค้าอยู่ในเกณฑ์ปกติ</h4>
              <p className="text-slate-500 mt-2">ยังไม่มีสินค้าที่ต่ำกว่าจุดสั่งซื้อ (Min Stock) ในขณะนี้</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-y-auto custom-scrollbar pb-10">
              {Object.entries(ordersBySupplier).map(([supplierName, items]) => {
                const matchedSup = suppliers.find((s) => s.vendor_name === supplierName);
                const hasEmail = !!matchedSup?.supplier_email;
                const isSending = sendingEmailId === supplierName;
                const unemailedItems = items.filter((i) => !i.is_emailed);
                const unacknowledgedItems = items.filter((i) => i.is_emailed && !i.is_acknowledged);
                const hasUnemailed = unemailedItems.length > 0;
                const hasUnacknowledged = unacknowledgedItems.length > 0;
                const isAllAcknowledged = !hasUnemailed && !hasUnacknowledged;
                const emailedDates = items.map((i) => i.last_emailed_at).filter(Boolean);
                const latestDate = emailedDates.length > 0 ? new Date(Math.max(...emailedDates.map((d) => d.toDate ? d.toDate().getTime() : new Date(d).getTime()))).toLocaleString('th-TH') : null;

                return (
                  <div key={supplierName} className="bg-white border border-indigo-100 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                    <div className="bg-indigo-50/50 p-4 border-b border-indigo-100 flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-lg text-indigo-900">{supplierName}</h4>
                        <p className="text-sm text-indigo-600 flex items-center gap-1 mt-1"><Mail size={14} /> {hasEmail ? matchedSup.supplier_email : 'ยังไม่ได้ตั้งค่า Email'}</p>
                      </div>
                      {hasUnemailed ? <span className="bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full animate-pulse shrink-0 border border-red-200">รอส่งแจ้งเตือน {unemailedItems.length} รายการ</span> : hasUnacknowledged ? <span className="bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full animate-pulse shrink-0 border border-orange-200 flex items-center gap-1"><Clock size={12} /> รอการตอบรับ {unacknowledgedItems.length} รายการ</span> : <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full shrink-0 flex items-center gap-1 border border-emerald-200"><CheckCheck size={14} /> รับทราบครบแล้ว</span>}
                    </div>

                    <div className="p-4 flex-1 overflow-y-auto max-h-[250px] bg-slate-50/30">
                      <ul className="space-y-3">
                        {items.map((item, idx) => (
                          <li key={idx} className={`bg-white p-3 rounded-xl border shadow-sm flex justify-between items-center gap-2 ${item.is_acknowledged ? 'border-emerald-200 bg-emerald-50/30' : item.is_emailed ? 'border-orange-200 bg-orange-50/30' : 'border-slate-100'}`}>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-sm text-slate-800 font-mono flex items-center gap-2">
                                {item.part_no}
                                {item.is_acknowledged ? <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-200 font-bold">รับทราบแล้ว</span> : item.is_emailed ? <span className="text-[10px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded border border-orange-200 font-bold">รอตอบรับ</span> : null}
                              </p>
                              <p className="text-xs text-slate-500 truncate">{item.description}</p>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-xs text-slate-400">Available / Min</p>
                              <p className="text-sm font-bold text-red-600 font-mono">{item.available_qty} <span className="text-slate-400">/</span> {item.min_stock}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 border-t border-slate-100 bg-white">
                      {latestDate && <p className="text-xs text-slate-500 mb-3 font-bold flex items-center justify-center gap-1">ส่ง Email ล่าสุดเมื่อ: {latestDate}</p>}
                      <button
                        onClick={() => handleSendEmail(supplierName, items)}
                        disabled={isSending || !hasEmail || isAllAcknowledged}
                        className={`w-full flex items-center justify-center gap-2 font-bold py-2.5 rounded-xl transition-all shadow-sm border ${isSending ? 'bg-indigo-400 cursor-not-allowed text-white' : (!hasEmail || isAllAcknowledged) ? 'bg-slate-200 text-slate-500 cursor-not-allowed border-transparent' : hasUnemailed ? 'bg-indigo-600 hover:bg-indigo-700 text-white border-transparent' : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'}`}
                      >
                        {isSending ? <><Clock className="animate-spin" size={18} /> กำลังส่ง Email...</> : isAllAcknowledged ? <><CheckCheck size={18} /> ซัพพลายเออร์รับทราบครบแล้ว</> : hasUnemailed ? <><Send size={18} /> ส่ง Email แจ้ง Supplier</> : <><RefreshCw size={18} /> ส่ง Email แจ้งซ้ำอีกครั้ง</>}
                      </button>
                      {!hasEmail && <p className="text-xs text-center text-red-500 mt-2">กรุณาเพิ่ม Email ในหน้า Supplier Management ก่อน</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </PageTemplate>
  );
};

// ==========================================
// 🌟 หน้า Supplier Management
// ==========================================
const SupplierManagementView = () => {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const currentYear = new Date().getFullYear();
  const yearsList = Array.from({ length: 5 }, (_, i) => (currentYear - i).toString());
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [formYear, setFormYear] = useState(currentYear.toString());

  const defaultForm = { vendor_no: '', vendor_name: '', supplier_email: '', part_no: '', description: '', uom: '', where_used: '', yearly_data: {} as Record<string, Record<string, number>> };
  const [formData, setFormData] = useState(defaultForm);

  useEffect(() => {
    const q = query(collection(db, 'suppliers'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => { setSuppliers(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))); });
    return () => unsubscribe();
  }, []);

  const getUniqueValues = (field: string) => Array.from(new Set(suppliers.map((s) => s[field]).filter(Boolean)));
  const uniqueVendorNos = getUniqueValues('vendor_no');
  const uniqueVendorNames = getUniqueValues('vendor_name');
  const uniquePartNos = getUniqueValues('part_no');
  const uniqueDescriptions = getUniqueValues('description');
  const uniqueUOMs = getUniqueValues('uom');
  const uniqueWhereUseds = getUniqueValues('where_used');

  const calculateAverages = (yearData: Record<string, number> = {}) => {
    const values = MONTHS.map((m) => yearData[m] || 0);
    const total = values.reduce((sum, val) => sum + val, 0);
    const activeMonths = values.filter((v) => v > 0).length || 1;
    const avgMonth = total > 0 ? total / activeMonths : 0;
    const avgWeek = total > 0 ? avgMonth / 4 : 0;
    return { avgMonth, avgWeek };
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.vendor_no || !formData.part_no) return;
    try {
      const updatedYearlyData = { ...formData.yearly_data };
      Object.keys(updatedYearlyData).forEach((year) => {
        const { avgWeek } = calculateAverages(updatedYearlyData[year]);
        updatedYearlyData[year].min = avgWeek * 2;
        updatedYearlyData[year].max = avgWeek * 4;
      });

      const payload = { vendor_no: formData.vendor_no, vendor_name: formData.vendor_name, supplier_email: formData.supplier_email, part_no: formData.part_no, description: formData.description, uom: formData.uom, where_used: formData.where_used, yearly_data: updatedYearlyData, updatedAt: serverTimestamp() };

      if (editingId) await updateDoc(doc(db, 'suppliers', editingId), payload);
      else await addDoc(collection(db, 'suppliers'), { ...payload, createdAt: serverTimestamp() });

      setFormData(defaultForm); setIsAdding(false); setEditingId(null);
    } catch (error) { alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล'); }
  };

  const startEdit = (sup: any) => {
    setFormData({ vendor_no: sup.vendor_no || '', vendor_name: sup.vendor_name || '', supplier_email: sup.supplier_email || '', part_no: sup.part_no || '', description: sup.description || '', uom: sup.uom || '', where_used: sup.where_used || '', yearly_data: sup.yearly_data || sup.monthly_data || {} });
    setEditingId(sup.id); setFormYear(selectedYear); setIsAdding(true); window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('ลบข้อมูลนี้ใช่หรือไม่?')) await deleteDoc(doc(db, 'suppliers', id));
  };

  const handleYearlyChange = (month: string, val: string) => {
    const numVal = Number(val) || 0;
    setFormData((prev) => ({ ...prev, yearly_data: { ...prev.yearly_data, [formYear]: { ...(prev.yearly_data?.[formYear] || {}), [month]: numVal } } }));
  };

  const handleVendorNoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputVal = e.target.value;
    const matchedSupplier = suppliers.find((s) => s.vendor_no === inputVal && s.vendor_name);
    setFormData((prev) => ({ ...prev, vendor_no: inputVal, vendor_name: matchedSupplier ? matchedSupplier.vendor_name : prev.vendor_name, supplier_email: matchedSupplier ? matchedSupplier.supplier_email || '' : prev.supplier_email }));
  };

  const filteredSuppliers = suppliers.filter((sup) => {
    const term = searchTerm.toLowerCase();
    return sup.vendor_name?.toLowerCase().includes(term) || sup.part_no?.toLowerCase().includes(term) || sup.vendor_no?.toLowerCase().includes(term);
  });

  const currentFormYearData = formData.yearly_data?.[formYear] || {};
  const { avgWeek: formAvgWeek } = calculateAverages(currentFormYearData);
  const formAutoMin = formAvgWeek * 2;
  const formAutoMax = formAvgWeek * 4;

  return (
    <PageTemplate title="Supplier Management">
      <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-200 flex-1 flex flex-col overflow-hidden">
        <div className="space-y-6 flex flex-col h-full">
          <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 shrink-0">
            <div>
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2"><Users className="text-emerald-500" /> Supplier & Forecast</h3>
              <p className="text-sm text-slate-500 mt-1">จัดการฐานข้อมูลและประวัติการเบิกใช้ย้อนหลัง</p>
            </div>
            <div className="flex flex-col md:flex-row gap-3 w-full xl:w-auto items-stretch md:items-center">
              <div className="flex items-center bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-1.5 shadow-sm">
                <Calendar size={18} className="text-emerald-600 mr-2" />
                <select className="bg-transparent font-bold text-emerald-800 outline-none cursor-pointer text-sm" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                  {yearsList.map((y) => <option key={y} value={y}>ข้อมูลตารางปี {y}</option>)}
                </select>
              </div>
              <div className="relative w-full md:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search size={18} className="text-slate-400" /></div>
                <input type="text" placeholder="ค้นหา Vendor, P/N..." className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <button onClick={() => { setFormData(defaultForm); setEditingId(null); setFormYear(selectedYear); setIsAdding(!isAdding); }} className="flex-1 md:flex-none justify-center bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors shadow-sm">
                <Plus size={18} /> <span>เพิ่มข้อมูล</span>
              </button>
            </div>
          </div>

          {isAdding && (
            <form onSubmit={handleSave} className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-200 grid grid-cols-1 md:grid-cols-4 xl:grid-cols-6 gap-4 animate-slide-down shrink-0 shadow-inner">
              <div className="md:col-span-4 xl:col-span-6 border-b border-emerald-200 pb-2 mb-2">
                <h4 className="font-bold text-emerald-800 flex items-center gap-2">{editingId ? <Edit2 size={18} /> : <Plus size={18} />} {editingId ? 'แก้ไขข้อมูล Supplier' : 'เพิ่มข้อมูล Supplier ใหม่'}</h4>
              </div>

              <datalist id="vendorNos">{uniqueVendorNos.map((v) => <option key={v as string} value={v as string} />)}</datalist>
              <datalist id="vendorNames">{uniqueVendorNames.map((v) => <option key={v as string} value={v as string} />)}</datalist>
              <datalist id="partNos">{uniquePartNos.map((v) => <option key={v as string} value={v as string} />)}</datalist>
              <datalist id="descriptions">{uniqueDescriptions.map((v) => <option key={v as string} value={v as string} />)}</datalist>
              <datalist id="uoms">{uniqueUOMs.map((v) => <option key={v as string} value={v as string} />)}</datalist>
              <datalist id="whereUseds">{uniqueWhereUseds.map((v) => <option key={v as string} value={v as string} />)}</datalist>

              <div><label className="block text-xs font-bold text-slate-700 mb-1">Vendor No *</label><input required list="vendorNos" className="w-full border border-slate-300 p-2 rounded-lg outline-none focus:ring-2 focus:ring-emerald-400" value={formData.vendor_no} onChange={handleVendorNoChange} placeholder="ค้นหา..." /></div>
              <div className="md:col-span-2"><label className="block text-xs font-bold text-slate-700 mb-1">Vendor Name</label><input list="vendorNames" className="w-full border border-slate-300 p-2 rounded-lg outline-none focus:ring-2 focus:ring-emerald-400 bg-white" value={formData.vendor_name} onChange={(e) => setFormData({ ...formData, vendor_name: e.target.value })} placeholder="ค้นหา..." /></div>
              <div className="md:col-span-1 xl:col-span-3"><label className="block text-xs font-bold text-slate-700 mb-1">Supplier Email (สำหรับส่ง PO)</label><input type="email" className="w-full border border-slate-300 p-2 rounded-lg outline-none focus:ring-2 focus:ring-emerald-400 bg-white" value={formData.supplier_email} onChange={(e) => setFormData({ ...formData, supplier_email: e.target.value })} placeholder="email@company.com" /></div>

              <div><label className="block text-xs font-bold text-slate-700 mb-1">P/N (Part No) *</label><input required list="partNos" className="w-full border border-slate-300 p-2 rounded-lg outline-none focus:ring-2 focus:ring-emerald-400" value={formData.part_no} onChange={(e) => setFormData({ ...formData, part_no: e.target.value })} placeholder="ค้นหา..." /></div>
              <div className="md:col-span-2"><label className="block text-xs font-bold text-slate-700 mb-1">Part Description</label><input list="descriptions" className="w-full border border-slate-300 p-2 rounded-lg outline-none focus:ring-2 focus:ring-emerald-400" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="ค้นหา..." /></div>
              <div><label className="block text-xs font-bold text-slate-700 mb-1">UOM</label><input list="uoms" className="w-full border border-slate-300 p-2 rounded-lg outline-none focus:ring-2 focus:ring-emerald-400" placeholder="เช่น PCS" value={formData.uom} onChange={(e) => setFormData({ ...formData, uom: e.target.value })} /></div>
              <div className="md:col-span-2"><label className="block text-xs font-bold text-slate-700 mb-1">Where Used</label><input list="whereUseds" className="w-full border border-slate-300 p-2 rounded-lg outline-none focus:ring-2 focus:ring-emerald-400" placeholder="ค้นหา..." value={formData.where_used} onChange={(e) => setFormData({ ...formData, where_used: e.target.value })} /></div>

              <div className="md:col-span-4 xl:col-span-6 mt-2 bg-white p-4 rounded-xl border border-emerald-100 shadow-sm">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-emerald-100 pb-3 mb-4 gap-2">
                  <label className="text-sm font-bold text-emerald-800">บันทึก Forecast / Consumption ของปีนั้นๆ</label>
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
                    <span className="text-xs font-bold text-slate-500">เลือกปีที่ต้องการบันทึก:</span>
                    <select className="bg-transparent font-bold text-blue-600 outline-none cursor-pointer text-sm" value={formYear} onChange={(e) => setFormYear(e.target.value)}>
                      {yearsList.map((y) => <option key={y} value={y}>ปี {y}</option>)}
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 md:grid-cols-6 xl:grid-cols-12 gap-2 mb-4">
                  {MONTHS.map((month) => (
                    <div key={month}>
                      <label className="block text-[10px] font-bold text-slate-500 text-center uppercase mb-1">{month}</label>
                      <input type="number" step="any" className="w-full border border-slate-300 p-1.5 rounded text-center text-sm outline-none focus:ring-2 focus:ring-emerald-400 bg-slate-50" placeholder="0" value={formData.yearly_data?.[formYear]?.[month] || ''} onChange={(e) => handleYearlyChange(month, e.target.value)} />
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-emerald-50">
                  <div><label className="block text-[11px] font-bold text-red-700 mb-1">Min Stock ปี {formYear} (Avg Wk × 2)</label><input type="text" disabled className="w-full border border-red-200 p-2 rounded-lg bg-red-50 text-red-600 font-bold cursor-not-allowed" value={formAutoMin > 0 ? formAutoMin.toLocaleString(undefined, { maximumFractionDigits: 1 }) : '0'} /></div>
                  <div><label className="block text-[11px] font-bold text-emerald-700 mb-1">Max Stock ปี {formYear} (Avg Wk × 4)</label><input type="text" disabled className="w-full border border-emerald-200 p-2 rounded-lg bg-emerald-50 text-emerald-600 font-bold cursor-not-allowed" value={formAutoMax > 0 ? formAutoMax.toLocaleString(undefined, { maximumFractionDigits: 1 }) : '0'} /></div>
                </div>
              </div>

              <div className="md:col-span-4 xl:col-span-6 flex justify-end gap-2 mt-2">
                <button type="button" onClick={() => { setIsAdding(false); setEditingId(null); }} className="px-6 py-2.5 bg-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-300 transition-colors">ยกเลิก</button>
                <button type="submit" className="bg-emerald-600 text-white px-8 py-2.5 rounded-xl font-bold hover:bg-emerald-700 shadow-md transition-colors">{editingId ? 'อัปเดตข้อมูล' : 'บันทึกข้อมูล'}</button>
              </div>
            </form>
          )}

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex-1 overflow-hidden flex flex-col min-h-[400px]">
            <div className="overflow-x-auto overflow-y-auto flex-1 custom-scrollbar">
              <table className="w-full text-left whitespace-nowrap text-sm min-w-max">
                <thead className="bg-slate-100 text-slate-600 text-[11px] uppercase font-bold border-b border-slate-200 sticky top-0 z-10 shadow-sm">
                  <tr>
                    <th className="p-3 sticky left-0 bg-slate-100 z-20 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">Vendor No</th><th className="p-3">Vendor Name</th><th className="p-3">Email</th><th className="p-3">P/N</th><th className="p-3">Part Description</th>
                    {MONTHS.map((m) => <th key={m} className="p-3 text-center text-emerald-700 bg-emerald-50/50 border-l border-white">{m}</th>)}
                    <th className="p-3 text-center bg-blue-50 text-blue-800 border-l border-white">Avg Month</th><th className="p-3 text-center bg-blue-50 text-blue-800">Avg Week</th><th className="p-3 border-l border-slate-200">UOM</th><th className="p-3">Where Used</th><th className="p-3 text-center text-red-700 bg-red-50/30">Min (Wkx2)</th><th className="p-3 text-center text-emerald-700 bg-emerald-50/30">Max (Wkx4)</th><th className="p-3 text-center sticky right-0 bg-slate-100 shadow-[-2px_0_5px_rgba(0,0,0,0.02)] z-20">Manage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSuppliers.length === 0 ? <tr><td colSpan={24} className="p-8 text-center text-slate-400">ยังไม่มีข้อมูลซัพพลายเออร์</td></tr> : 
                    filteredSuppliers.map((sup) => {
                      const yearData = sup.yearly_data?.[selectedYear] || sup.monthly_data?.[selectedYear] || {};
                      const { avgMonth, avgWeek } = calculateAverages(yearData);
                      const autoMin = avgWeek * 2;
                      const autoMax = avgWeek * 4;

                      return (
                        <tr key={sup.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-3 font-mono font-bold text-slate-700 sticky left-0 bg-white shadow-[2px_0_5px_rgba(0,0,0,0.02)] z-10">{sup.vendor_no}</td>
                          <td className="p-3 font-bold text-slate-800">{sup.vendor_name}</td>
                          <td className="p-3 text-slate-500 text-xs">{sup.supplier_email || '-'}</td>
                          <td className="p-3 font-mono text-emerald-600 font-bold">{sup.part_no}</td>
                          <td className="p-3 text-slate-600"><div className="truncate w-40" title={sup.description}>{sup.description}</div></td>
                          {MONTHS.map((m) => <td key={m} className="p-3 text-center font-mono text-slate-600 border-l border-slate-50">{yearData[m] > 0 ? yearData[m].toLocaleString(undefined, { maximumFractionDigits: 2 }) : '-'}</td>)}
                          <td className="p-3 text-center font-mono font-bold text-blue-700 bg-blue-50/20 border-l border-slate-100">{avgMonth > 0 ? avgMonth.toLocaleString(undefined, { maximumFractionDigits: 1 }) : '-'}</td>
                          <td className="p-3 text-center font-mono font-bold text-blue-700 bg-blue-50/20">{avgWeek > 0 ? avgWeek.toLocaleString(undefined, { maximumFractionDigits: 1 }) : '-'}</td>
                          <td className="p-3 text-slate-500 border-l border-slate-100">{sup.uom}</td><td className="p-3 text-slate-500">{sup.where_used}</td>
                          <td className="p-3 text-center font-mono font-bold text-red-600 bg-red-50/10 border-l border-slate-50">{autoMin > 0 ? autoMin.toLocaleString(undefined, { maximumFractionDigits: 1 }) : '-'}</td>
                          <td className="p-3 text-center font-mono font-bold text-emerald-600 bg-emerald-50/10 border-l border-slate-50">{autoMax > 0 ? autoMax.toLocaleString(undefined, { maximumFractionDigits: 1 }) : '-'}</td>
                          <td className="p-3 text-center sticky right-0 bg-white shadow-[-2px_0_5px_rgba(0,0,0,0.02)] z-10 border-l border-slate-100">
                            <div className="flex justify-center gap-1">
                              <button onClick={() => startEdit(sup)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg"><Edit2 size={16} /></button>
                              <button onClick={() => handleDelete(sup.id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
};

// ==========================================
// 🌟 หน้า Stock Management
// ==========================================
const StockManagementView = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]); 
  const [isAdding, setIsAdding] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false); 
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(''); 
  const [showOnlyLowStock, setShowOnlyLowStock] = useState(false);
  const [lastUploadTime, setLastUploadTime] = useState<any>(null); 

  const currentYear = new Date().getFullYear();
  const yearsList = Array.from({ length: 5 }, (_, i) => (currentYear - i).toString());

  const [viewingConsumptionPart, setViewingConsumptionPart] = useState<any | null>(null);
  const [viewYear, setViewYear] = useState<string>(currentYear.toString());

  const defaultForm = { part_no: '', description: '', site: 'TH10', config_id: '*', project_id: '*', on_hand_qty: '', supply: '', demand: '', available_qty: '', min_stock: '0', supplier_name: '' };
  const [formData, setFormData] = useState(defaultForm);

  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => { setProducts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))); });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const qSup = query(collection(db, 'suppliers'));
    const unsubSup = onSnapshot(qSup, (snapshot) => { setSuppliers(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))); });
    return () => unsubSup();
  }, []);

  useEffect(() => {
    const unsubMeta = onSnapshot(doc(db, 'system', 'meta'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.last_stock_upload) setLastUploadTime(data.last_stock_upload);
      }
    });
    return () => unsubMeta();
  }, []);

  const getSupplierAvgWeek = (matchedSup: any) => {
    if (!matchedSup) return 0;
    const dataObj = matchedSup.yearly_data || matchedSup.monthly_data || {};
    const yearKeys = Object.keys(dataObj).filter((k) => !isNaN(Number(k)));
    if (yearKeys.length > 0) {
      const maxYear = Math.max(...yearKeys.map(Number));
      const yearData = dataObj[maxYear];
      const values = MONTHS.map((m) => yearData[m] || 0);
      const total = values.reduce((sum, val) => sum + val, 0);
      const activeMonths = values.filter((v) => v > 0).length || 1;
      const avgMonth = total > 0 ? total / activeMonths : 0;
      return total > 0 ? avgMonth / 4 : 0;
    }
    return 0;
  };

  const getLatestMinStock = (matchedSup: any) => {
    const avgWeek = getSupplierAvgWeek(matchedSup);
    return avgWeek > 0 ? avgWeek * 2 : 0;
  };

  const getForecastOrderDate = (availableQty: number, minStock: number, avgWeek: number) => {
    if (availableQty <= minStock) return { text: 'สั่งด่วน (ของขาด)', urgent: true };
    if (avgWeek <= 0) return { text: 'ไม่มีประวัติเบิกใช้', urgent: false };
    const daysToReachMin = ((availableQty - minStock) / avgWeek) * 7;
    const orderDays = daysToReachMin - 7;
    if (orderDays <= 0) return { text: 'สั่งด่วน (ครบกำหนด)', urgent: true };
    const orderDate = new Date();
    orderDate.setDate(orderDate.getDate() + orderDays);
    return { text: orderDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }), urgent: orderDays <= 3 };
  };

  const handleAutoSync = async () => {
    setIsSyncing(true);
    let syncedCount = 0;
    for (const product of products) {
      const matchedSup = suppliers.find((s) => s.part_no === product.part_no);
      if (matchedSup) {
        const vendorName = matchedSup.vendor_name || 'ไม่ระบุชื่อ';
        const latestMin = getLatestMinStock(matchedSup);
        if (product.supplier_name !== vendorName || product.min_stock !== latestMin) {
          await updateDoc(doc(db, 'products', product.id), { supplier_name: vendorName, min_stock: latestMin, updatedAt: serverTimestamp() });
          syncedCount++;
        }
      }
    }
    setIsSyncing(false);
    if (syncedCount > 0) alert(`✅ ผูกข้อมูลสำเร็จ! ระบบอัปเดตให้ ${syncedCount} รายการเรียบร้อยแล้ว`);
    else alert(`ℹ️ ข้อมูลทั้งหมดถูกผูกตรงกันเรียบร้อยแล้ว`);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsImporting(true);
    let parsedData: any[] = [];
    try {
      const arrayBuffer = await file.arrayBuffer();
      const data = new Uint8Array(arrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
      for (const row of jsonData) {
        const getVal = (searchStr: string) => {
          const target = searchStr.toLowerCase().replace(/[^a-z0-9]/g, '');
          const key = Object.keys(row).find((k) => k.toLowerCase().replace(/[^a-z0-9]/g, '') === target);
          return key ? row[key] : undefined;
        };
        const part_no = String(getVal('Part No') || '').trim();
        if (part_no) {
          parsedData.push({
            part_no, description: String(getVal('Description') || '').trim(), site: String(getVal('Site') || '').trim(), config_id: String(getVal('Configuration ID') || '').trim(), project_id: String(getVal('Project ID') || '').trim(),
            on_hand_qty: Number(String(getVal('On Hand Qty') || '0').replace(/,/g, '')) || 0, supply: Number(String(getVal('Supply') || '0').replace(/,/g, '')) || 0, demand: Number(String(getVal('Demand') || '0').replace(/,/g, '')) || 0,
            available_qty: Number(String(getVal('Available Qty') || '0').replace(/,/g, '')) || 0,
          });
        }
      }
      if (parsedData.length === 0) throw new Error('ไม่พบ Part No');

      let added = 0, updated = 0;
      for (const item of parsedData) {
        const existing = products.find((p) => p.part_no === item.part_no);
        const matchedSup = suppliers.find((s) => s.part_no === item.part_no);
        const supName = matchedSup ? matchedSup.vendor_name || 'ไม่ระบุชื่อ' : 'รอการผูกข้อมูล';
        const minStk = getLatestMinStock(matchedSup);

        let isEmailed = existing ? existing.is_emailed || false : false;
        let lastEmailedAt = existing ? existing.last_emailed_at || null : null;
        let isAcknowledged = existing ? existing.is_acknowledged || false : false;
        let acknowledgedAt = existing ? existing.acknowledged_at || null : null;

        if (item.available_qty > minStk) {
          isEmailed = false;
          lastEmailedAt = null;
          isAcknowledged = false;
          acknowledgedAt = null;
        }

        if (existing) {
          await updateDoc(doc(db, 'products', existing.id), { ...item, supplier_name: supName, min_stock: minStk, is_emailed: isEmailed, last_emailed_at: lastEmailedAt, is_acknowledged: isAcknowledged, acknowledged_at: acknowledgedAt, updatedAt: serverTimestamp() });
          updated++;
        } else {
          await addDoc(collection(db, 'products'), { ...item, min_stock: minStk, supplier_name: supName, is_emailed: false, last_emailed_at: null, is_acknowledged: false, acknowledged_at: null, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
          added++;
        }
      }

      await setDoc(doc(db, 'system', 'meta'), { last_stock_upload: serverTimestamp() }, { merge: true });

      let currentUserName = 'System';
      try {
        const userStr = localStorage.getItem('vmi_user');
        if (userStr) currentUserName = JSON.parse(userStr).name;
      } catch (e) {}

      await addDoc(collection(db, 'upload_logs'), {
        uploaded_at: serverTimestamp(),
        total_records: parsedData.length,
        added_count: added,
        updated_count: updated,
        uploaded_by: currentUserName, 
      });

      alert(`✅ อัปโหลดเสร็จสิ้น!\nข้อมูลทั้งหมด: ${parsedData.length} รายการ\nเพิ่มใหม่: ${added} | อัปเดต: ${updated}`);
    } catch (error: any) { alert('❌ เกิดข้อผิดพลาด: ' + error.message); } finally { setIsImporting(false); if (e.target) e.target.value = ''; }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.part_no || !formData.description) return;
    try {
      const newAvail = Number(formData.available_qty);
      const minStk = Number(formData.min_stock);

      let isEmailed = false;
      let lastEmailedAt = null;
      let isAcknowledged = false;
      let acknowledgedAt = null;

      if (editingId) {
        const existing = products.find((p) => p.id === editingId);
        if (existing) {
          isEmailed = existing.is_emailed || false;
          lastEmailedAt = existing.last_emailed_at || null;
          isAcknowledged = existing.is_acknowledged || false;
          acknowledgedAt = existing.acknowledged_at || null;
        }
      }

      if (newAvail > minStk) {
        isEmailed = false;
        lastEmailedAt = null;
        isAcknowledged = false;
        acknowledgedAt = null;
      }

      const payload = { ...formData, on_hand_qty: Number(formData.on_hand_qty), supply: Number(formData.supply), demand: Number(formData.demand), available_qty: newAvail, min_stock: minStk, is_emailed: isEmailed, last_emailed_at: lastEmailedAt, is_acknowledged: isAcknowledged, acknowledged_at: acknowledgedAt, updatedAt: serverTimestamp() };

      if (editingId) {
        await updateDoc(doc(db, 'products', editingId), payload);
      } else {
        await addDoc(collection(db, 'products'), { ...payload, supplier_name: formData.supplier_name || 'รอการผูกข้อมูล', createdAt: serverTimestamp() });
      }
      setFormData(defaultForm); setIsAdding(false); setEditingId(null);
    } catch (error) { alert('Error'); }
  };

  const startEdit = (p: any) => { setFormData({ ...defaultForm, ...p }); setEditingId(p.id); setIsAdding(true); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const handleDelete = async (id: string) => { if (window.confirm('ยืนยันการลบ?')) await deleteDoc(doc(db, 'products', id)); };

  const handleRowClick = (product: any, e?: React.MouseEvent) => {
    if (e && (e.target as HTMLElement).closest('button')) return;
    const matchedSup = suppliers.find((s) => s.part_no === product.part_no);
    if (matchedSup) {
      setViewingConsumptionPart({ product, supplier: matchedSup });
      const dataObj = matchedSup.yearly_data || matchedSup.monthly_data || {};
      const yearKeys = Object.keys(dataObj).filter((k) => !isNaN(Number(k)));
      if (yearKeys.length > 0) {
        setViewYear(Math.max(...yearKeys.map(Number)).toString());
      } else {
        setViewYear(currentYear.toString());
      }
    } else {
      setViewingConsumptionPart({ product, supplier: null });
      setViewYear(currentYear.toString());
    }
  };

  const allLowStock = products.filter((p) => p.available_qty <= p.min_stock && p.min_stock > 0);
  const unemailedLowStock = allLowStock.filter((p) => !p.is_emailed);
  const lowStockCount = unemailedLowStock.length;

  const filteredProducts = products.filter((p) => {
    const term = searchTerm.toLowerCase();
    const matchSearch = p.part_no?.toLowerCase().includes(term) || p.description?.toLowerCase().includes(term) || p.supplier_name?.toLowerCase().includes(term);
    return matchSearch && (showOnlyLowStock ? p.available_qty <= p.min_stock : true);
  });

  return (
    <PageTemplate title="Stock Management">
      <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-200 flex-1 flex flex-col overflow-hidden">
        <div className="space-y-6 flex flex-col h-full relative">
          <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 shrink-0">
            <div>
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2"><PackageSearch className="text-orange-500" /> ERP Inventory Sync</h3>
              <div className="flex items-center gap-3 mt-1">
                <p className="text-sm text-slate-500">จัดการสต็อกและรายการสินค้า (VMI)</p>
                {lastUploadTime && (
                  <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold flex items-center gap-1 border border-blue-200">
                    <Clock size={12} /> อัปเดตล่าสุด: {formatTrackingDate(lastUploadTime)}
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-3 w-full xl:w-auto items-stretch md:items-center">
              <div className="relative w-full md:w-56">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center"><Search size={18} className="text-slate-400" /></div>
                <input type="text" placeholder="ค้นหา Part No, ซัพพลายเออร์" className="w-full pl-10 pr-4 py-2 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <button onClick={handleAutoSync} disabled={isSyncing} className={`justify-center ${isSyncing ? 'bg-slate-400' : 'bg-emerald-500 hover:bg-emerald-600'} text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors whitespace-nowrap`}>
                {isSyncing ? <Clock className="animate-spin" size={18} /> : <RefreshCw size={18} />} <span>ผูก Supplier</span>
              </button>
              <label className={`justify-center ${isImporting ? 'bg-slate-400' : 'bg-blue-600 hover:bg-blue-700'} text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 cursor-pointer whitespace-nowrap`}>
                <UploadCloud size={18} /><span>นำเข้า ERP</span>
                <input type="file" accept=".csv, .xlsx, .xls" className="hidden" onChange={handleFileUpload} disabled={isImporting} />
              </label>
              <button onClick={() => { setFormData(defaultForm); setEditingId(null); setIsAdding(!isAdding); }} className="justify-center bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 whitespace-nowrap">
                <Plus size={18} /> <span>เพิ่ม Manual</span>
              </button>
            </div>
          </div>

          {allLowStock.length > 0 && (
            <div onClick={() => setShowOnlyLowStock(!showOnlyLowStock)} className={`cursor-pointer p-4 rounded-2xl border flex items-center justify-between shadow-sm shrink-0 ${showOnlyLowStock ? 'bg-red-600 text-white' : 'bg-red-50 text-red-800 border-red-200'}`}>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-full"><BellRing size={24} /></div>
                <div>
                  <h4 className="font-bold text-lg">แจ้งเตือนระดับสต็อก!</h4>
                  <p className="text-sm">
                    พบสินค้า <span className="font-bold">{allLowStock.length}</span> รายการที่ต่ำกว่า Min Stock
                    <span className={`ml-2 px-2 py-0.5 rounded text-xs font-bold ${showOnlyLowStock ? 'bg-white/30' : 'bg-red-200'}`}>
                      รอแจ้งซัพพลายเออร์ {unemailedLowStock.length} รายการ
                    </span>
                  </p>
                </div>
              </div>
              <div className={`font-bold text-sm px-4 py-2 rounded-xl ${showOnlyLowStock ? 'bg-black/20' : 'bg-red-600 text-white'}`}>
                {showOnlyLowStock ? 'ยกเลิกกรอง' : 'ดูรายการ'}
              </div>
            </div>
          )}

          {isAdding && (
            <form onSubmit={handleSaveProduct} className="bg-orange-50/50 p-6 rounded-2xl border border-orange-200 grid grid-cols-1 md:grid-cols-4 gap-4 shrink-0 animate-slide-down">
              <div className="md:col-span-4 border-b border-orange-200 pb-2 mb-2">
                <h4 className="font-bold text-orange-800 flex items-center gap-2">
                  {editingId ? <Edit2 size={18} /> : <Plus size={18} />} {editingId ? 'แก้ไขข้อมูลสินค้า' : 'เพิ่มสินค้าใหม่'}
                </h4>
              </div>
              <div><label className="block text-xs font-bold text-slate-700 mb-1">Part No. *</label><input required disabled={!!editingId} className="w-full border p-2.5 rounded-xl outline-none disabled:bg-slate-100" placeholder="เช่น 100085" value={formData.part_no} onChange={(e) => setFormData({ ...formData, part_no: e.target.value })} /></div>
              <div className="md:col-span-3"><label className="block text-xs font-bold text-slate-700 mb-1">Description *</label><input required className="w-full border p-2.5 rounded-xl outline-none" placeholder="ชื่อสินค้า" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} /></div>
              <div><label className="block text-xs font-bold text-slate-700 mb-1">Site</label><input className="w-full border p-2.5 rounded-xl outline-none" placeholder="TH10" value={formData.site} onChange={(e) => setFormData({ ...formData, site: e.target.value })} /></div>
              <div><label className="block text-xs font-bold text-slate-700 mb-1">Config ID</label><input className="w-full border p-2.5 rounded-xl outline-none" placeholder="*" value={formData.config_id} onChange={(e) => setFormData({ ...formData, config_id: e.target.value })} /></div>
              <div><label className="block text-xs font-bold text-slate-700 mb-1">Project ID</label><input className="w-full border p-2.5 rounded-xl outline-none" placeholder="*" value={formData.project_id} onChange={(e) => setFormData({ ...formData, project_id: e.target.value })} /></div>
              <div><label className="block text-xs font-bold text-slate-700 mb-1">Supplier Name</label><input className="w-full border p-2.5 rounded-xl outline-none focus:ring-2 focus:ring-orange-400" placeholder="ชื่อ Supplier" value={formData.supplier_name} onChange={(e) => setFormData({ ...formData, supplier_name: e.target.value })} /></div>
              <div><label className="block text-xs font-bold text-slate-700 mb-1">On Hand Qty</label><input type="number" step="any" className="w-full border p-2.5 rounded-xl outline-none" value={formData.on_hand_qty} onChange={(e) => setFormData({ ...formData, on_hand_qty: e.target.value })} /></div>
              <div><label className="block text-xs font-bold text-slate-700 mb-1">Supply</label><input type="number" step="any" className="w-full border p-2.5 rounded-xl outline-none" value={formData.supply} onChange={(e) => setFormData({ ...formData, supply: e.target.value })} /></div>
              <div><label className="block text-xs font-bold text-slate-700 mb-1">Demand</label><input type="number" step="any" className="w-full border p-2.5 rounded-xl outline-none" value={formData.demand} onChange={(e) => setFormData({ ...formData, demand: e.target.value })} /></div>
              <div className="bg-blue-50 p-2 rounded-xl"><label className="block text-xs font-bold text-blue-800 mb-1">Available Qty *</label><input required type="number" step="any" className="w-full border p-2 rounded-lg outline-none" value={formData.available_qty} onChange={(e) => setFormData({ ...formData, available_qty: e.target.value })} /></div>
              <div className="bg-red-50 p-2 rounded-xl"><label className="block text-xs font-bold text-red-800 mb-1">Min Stock</label><input required type="number" step="any" className="w-full border p-2 rounded-lg outline-none" value={formData.min_stock} onChange={(e) => setFormData({ ...formData, min_stock: e.target.value })} /></div>
              <div className="md:col-span-2 flex justify-end gap-2 mt-4 items-end">
                <button type="button" onClick={() => { setIsAdding(false); setEditingId(null); setFormData(defaultForm); }} className="px-6 py-2.5 text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-xl font-bold transition-colors">ยกเลิก</button>
                <button type="submit" className="bg-orange-600 text-white px-8 py-2.5 rounded-xl font-bold hover:bg-orange-700 shadow-md transition-colors">{editingId ? 'อัปเดตข้อมูล' : 'บันทึกข้อมูล'}</button>
              </div>
            </form>
          )}

          <div className="bg-white rounded-2xl border border-slate-200 flex-1 overflow-hidden flex flex-col min-h-[300px]">
            <div className="overflow-x-auto overflow-y-auto flex-1 custom-scrollbar">
              <table className="w-full text-left whitespace-nowrap text-sm min-w-max">
                <thead className="bg-slate-100 text-slate-600 text-[11px] uppercase font-bold sticky top-0 z-10 shadow-sm">
                  <tr>
                    <th className="p-3 sticky left-0 bg-slate-100 z-20 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">Part No</th>
                    <th className="p-3">Description</th><th className="p-3">Site</th><th className="p-3">Config ID</th><th className="p-3">Project ID</th>
                    <th className="p-3 text-right">On Hand</th><th className="p-3 text-right">Supply</th><th className="p-3 text-right">Demand</th>
                    <th className="p-3 text-right text-blue-700 bg-blue-50/50">Available Qty</th>
                    <th className="p-3 border-l border-slate-200">Supplier</th>
                    <th className="p-3 text-center">Min Stock</th><th className="p-3 text-center">Status</th><th className="p-3 text-center border-l border-white bg-orange-50 text-orange-800">Reorder date</th>
                    <th className="p-3 text-center sticky right-0 bg-slate-100 shadow-[-5px_0_10px_rgba(0,0,0,0.02)] z-20">Manage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map((p) => {
                    const matchedSup = suppliers.find((s) => s.part_no === p.part_no);
                    const avgWeek = getSupplierAvgWeek(matchedSup);
                    const forecast = getForecastOrderDate(p.available_qty, p.min_stock, avgWeek);

                    return (
                      <tr key={p.id} onClick={(e) => handleRowClick(p, e)} className={`cursor-pointer transition-colors ${p.available_qty <= p.min_stock ? 'bg-red-50/30 hover:bg-red-50' : 'hover:bg-slate-50'}`}>
                        <td className="p-3 font-mono font-bold text-slate-700 sticky left-0 bg-white shadow-[2px_0_5px_rgba(0,0,0,0.02)] z-10 flex items-center gap-2">
                          {p.part_no} 
                          {p.is_acknowledged ? (
                            <span className="text-[9px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-200" title="รับทราบแล้ว">Acked</span>
                          ) : p.is_emailed ? (
                            <span className="text-[9px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded border border-orange-200" title="รอการตอบรับ">Sent</span>
                          ) : null}
                        </td>
                        <td className="p-3 text-slate-800"><div className="truncate max-w-[200px]" title={p.description}>{p.description}</div></td>
                        <td className="p-3 text-slate-500">{p.site}</td><td className="p-3 text-slate-500">{p.config_id}</td><td className="p-3 text-slate-500">{p.project_id}</td>
                        <td className="p-3 text-right font-mono text-slate-600">{p.on_hand_qty?.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                        <td className="p-3 text-right font-mono text-slate-600">{p.supply?.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                        <td className="p-3 text-right font-mono text-slate-600">{p.demand?.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                        <td className="p-3 text-right font-mono font-bold text-blue-600 bg-blue-50/20">{p.available_qty?.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                        <td className="p-3 border-l border-slate-50">
                          {p.supplier_name === 'รอการผูกข้อมูล' ? <span className="text-orange-500 italic bg-orange-50 px-2 rounded text-xs">รอการผูก</span> : <span className="text-emerald-700 font-bold bg-emerald-50 px-2 rounded text-xs">{p.supplier_name}</span>}
                        </td>
                        <td className="p-3 text-center font-mono font-bold text-red-500 border-l border-slate-50">{p.min_stock?.toLocaleString(undefined, { maximumFractionDigits: 1 })}</td>
                        <td className="p-3 text-center">
                          {p.available_qty <= p.min_stock ? <span className="px-2 py-1 bg-red-100 text-red-700 text-[10px] rounded font-bold">ต่ำกว่ากำหนด</span> : <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] rounded font-bold">ปกติ</span>}
                        </td>
                        <td className="p-3 text-center border-l border-slate-50">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold inline-block w-full ${forecast.urgent ? 'bg-red-100 text-red-700' : 'bg-orange-50 text-orange-700'}`}>{forecast.text}</span>
                        </td>
                        <td className="p-3 text-center sticky right-0 bg-white shadow-[-2px_0_5px_rgba(0,0,0,0.02)] z-10 border-l border-slate-50">
                          <div className="flex justify-center gap-1">
                            <button onClick={() => startEdit(p)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg"><Edit2 size={16} /></button>
                            <button onClick={() => handleDelete(p.id)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {viewingConsumptionPart && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[90vh] animate-slide-down">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><Activity size={24} /></div>
                    <div>
                      <h3 className="font-bold text-xl text-slate-800">{viewingConsumptionPart.product.part_no}</h3>
                      <p className="text-sm text-slate-500">{viewingConsumptionPart.product.description}</p>
                    </div>
                  </div>
                  <button onClick={() => setViewingConsumptionPart(null)} className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"><X size={24} /></button>
                </div>

                <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-slate-50/50">
                  {(() => {
                    const sup = viewingConsumptionPart.supplier;
                    const product = viewingConsumptionPart.product;
                    const yearData = sup ? sup.yearly_data?.[viewYear] || sup.monthly_data?.[viewYear] || {} : {};
                    const values = MONTHS.map((m) => yearData[m] || 0);
                    const total = values.reduce((sum, val) => sum + val, 0);
                    const activeMonths = values.filter((v) => v > 0).length || 1;
                    const avgMonth = total > 0 ? total / activeMonths : 0;
                    const avgWeek = total > 0 ? avgMonth / 4 : 0;
                    const autoMin = avgWeek * 2;
                    const autoMax = avgWeek * 4;
                    const forecast = getForecastOrderDate(product.available_qty, product.min_stock, avgWeek);

                    return (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl flex justify-between items-center">
                            <div>
                              <p className="text-xs font-bold text-orange-600 mb-1 uppercase tracking-wide">Available Qty (ยอดใช้ได้จริง)</p>
                              <p className="text-3xl font-mono font-extrabold text-orange-800">{product.available_qty?.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                            </div>
                            <PackageSearch size={40} className="text-orange-200" />
                          </div>
                          <div className={`${forecast.urgent ? 'bg-red-50 border-red-200' : 'bg-purple-50 border-purple-100'} border p-4 rounded-xl flex justify-between items-center`}>
                            <div>
                              <p className={`text-xs font-bold mb-1 uppercase tracking-wide ${forecast.urgent ? 'text-red-600' : 'text-purple-600'}`}>Reorder date (ต้องสั่งของภายใน)</p>
                              <p className={`text-3xl font-bold ${forecast.urgent ? 'text-red-700' : 'text-purple-800'}`}>{forecast.text}</p>
                            </div>
                            <Clock size={40} className={forecast.urgent ? 'text-red-200' : 'text-purple-200'} />
                          </div>
                        </div>

                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-6 gap-4">
                          <div>
                            <h4 className="font-bold text-lg text-slate-700">ประวัติการใช้งาน (Consumption)</h4>
                            {sup && <p className="text-sm text-emerald-600 font-bold">Supplier: {sup.vendor_name}</p>}
                          </div>
                          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl shadow-sm">
                            <Calendar size={18} className="text-emerald-600" />
                            <span className="text-sm font-bold text-slate-600">เลือกปี:</span>
                            <select className="bg-transparent font-bold text-emerald-800 outline-none text-sm cursor-pointer" value={viewYear} onChange={(e) => setViewYear(e.target.value)}>
                              {yearsList.map((y) => <option key={y} value={y}>ปี {y}</option>)}
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3">
                          {MONTHS.map((m) => (
                            <div key={m} className="bg-white border border-slate-200 p-3 rounded-xl shadow-sm flex flex-col items-center justify-center">
                              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">{m}</span>
                              <span className="text-lg font-mono font-bold text-slate-700">{yearData[m] > 0 ? yearData[m].toLocaleString(undefined, { maximumFractionDigits: 2 }) : '-'}</span>
                            </div>
                          ))}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
                            <p className="text-xs font-bold text-blue-600 mb-1">Avg Month</p>
                            <p className="text-xl font-mono font-bold text-blue-800">{avgMonth > 0 ? avgMonth.toLocaleString(undefined, { maximumFractionDigits: 1 }) : '0'}</p>
                          </div>
                          <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
                            <p className="text-xs font-bold text-blue-600 mb-1">Avg Week</p>
                            <p className="text-xl font-mono font-bold text-blue-800">{avgWeek > 0 ? avgWeek.toLocaleString(undefined, { maximumFractionDigits: 1 }) : '0'}</p>
                          </div>
                          <div className="bg-red-50 border border-red-100 p-4 rounded-xl">
                            <p className="text-xs font-bold text-red-600 mb-1">Min Stock (Wk×2)</p>
                            <p className="text-xl font-mono font-bold text-red-800">{autoMin > 0 ? autoMin.toLocaleString(undefined, { maximumFractionDigits: 1 }) : '0'}</p>
                          </div>
                          <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl">
                            <p className="text-xs font-bold text-emerald-600 mb-1">Max Stock (Wk×4)</p>
                            <p className="text-xl font-mono font-bold text-emerald-800">{autoMax > 0 ? autoMax.toLocaleString(undefined, { maximumFractionDigits: 1 }) : '0'}</p>
                          </div>
                        </div>

                        {!sup && <div className="text-center p-4 bg-orange-50 text-orange-600 rounded-xl font-bold text-sm">ไม่พบประวัติการใช้งาน (ยังไม่มีการผูก Supplier สำหรับสินค้านี้)</div>}
                      </div>
                    );
                  })()}
                </div>

                <div className="px-6 py-4 border-t border-slate-100 bg-white flex justify-end">
                  <button onClick={() => setViewingConsumptionPart(null)} className="px-8 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold transition-colors shadow-md">
                    ปิดหน้าต่าง
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageTemplate>
  );
};

// ==========================================
// 🌟 หน้า Reports
// ==========================================
// ==========================================
// 🌟 หน้า Reports & Manual
// ==========================================
const ReportsView = () => {
  // 🚀 เปลี่ยนค่าเริ่มต้นให้โชว์หน้าคู่มือเป็นหน้าแรก
  const [activeReport, setActiveReport] = useState('system_manual');
  const [logs, setLogs] = useState<any[]>([]);
  const [uploadLogs, setUploadLogs] = useState<any[]>([]);
  const [viewingLogDetails, setViewingLogDetails] = useState<any | null>(null);

  // 🚀 เพิ่มเมนู คู่มือการใช้งาน เข้าไปเป็นอันดับแรก
  const reportList = [
    { id: 'system_manual', title: 'คู่มือและ Flow การทำงาน', icon: BookOpen },
    { id: 'email_logs', title: 'ประวัติการส่ง Email (Logs)', icon: History },
    { id: 'upload_logs', title: 'ประวัติการอัปโหลด (Upload Logs)', icon: UploadCloud },
    { id: 'stock_value', title: 'มูลค่าสต็อกคงเหลือ (เร็วๆ นี้)', icon: DollarSign },
    { id: 'supplier_perf', title: 'ประสิทธิภาพ Supplier (เร็วๆ นี้)', icon: TrendingUp },
    { id: 'forecast_demand', title: 'แนวโน้มการเบิกใช้ (เร็วๆ นี้)', icon: BarChart3 },
  ];

  useEffect(() => {
    const qEmail = query(collection(db, 'email_logs'), orderBy('sent_at', 'desc'));
    const unsubEmail = onSnapshot(qEmail, (snapshot) => {
      setLogs(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    const qUpload = query(collection(db, 'upload_logs'), orderBy('uploaded_at', 'desc'));
    const unsubUpload = onSnapshot(qUpload, (snapshot) => {
      setUploadLogs(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => { unsubEmail(); unsubUpload(); };
  }, []);

  return (
    <PageTemplate title="Reports & System Manual">
      <div className="flex flex-col lg:flex-row gap-6 h-full p-4 md:p-6 max-h-[calc(100vh-64px)] overflow-hidden">
        
        {/* Sidebar สำหรับเลือกรายงาน / คู่มือ */}
        <div className="w-full lg:w-72 bg-white border border-slate-200 rounded-2xl p-4 shrink-0 shadow-sm flex flex-col">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">Menu</h3>
          <div className="space-y-2 overflow-y-auto">
            {reportList.map((rep) => {
              const IconComp = rep.icon;
              const isActive = activeReport === rep.id;
              // ล็อกเมนูที่ยังไม่เปิดใช้ (ยกเว้น manual, email, upload)
              const isFuture = rep.id !== 'email_logs' && rep.id !== 'upload_logs' && rep.id !== 'system_manual';
              return (
                <button 
                  key={rep.id} 
                  onClick={() => !isFuture && setActiveReport(rep.id)} 
                  disabled={isFuture} 
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-sm text-left 
                    ${isActive ? 'bg-slate-800 text-white shadow-md' : isFuture ? 'text-slate-400 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  <IconComp size={18} className={isActive ? (rep.id === 'system_manual' ? 'text-emerald-400' : 'text-indigo-400') : ''} />
                  <span className="flex-1">{rep.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* พื้นที่แสดง Content ขวามือ */}
        <div className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col overflow-hidden relative">
          
          {/* ===================================== */}
          {/* 🚀 1. หน้าคู่มือการใช้งาน & Flow (เมนูใหม่) */}
          {/* ===================================== */}
{/* ===================================== */}
          {/* 🚀 1. หน้าคู่มือการใช้งานแบบละเอียด (Detailed Manual) */}
          {/* ===================================== */}
          {activeReport === 'system_manual' && (
            <div className="flex flex-col h-full">
              <div className="p-4 md:p-6 border-b border-slate-100 bg-emerald-50/30 flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2"><BookOpen className="text-emerald-600" /> คู่มือการใช้งานแบบละเอียด (Standard Operating Procedure)</h3>
                  <p className="text-sm text-slate-500 mt-1">ขั้นตอนการปฏิบัติงานสำหรับเจ้าหน้าที่จัดซื้อและคลังสินค้า</p>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 bg-white">
                
                {/* 1. สรุป Flow การทำงานหลัก */}
                <div className="mb-12">
                  <h4 className="font-bold text-lg text-indigo-700 mb-4 border-l-4 border-indigo-500 pl-3">1. แผนผังวงจรการทำงาน (System Lifecycle)</h4>
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col md:flex-row items-center justify-around gap-4 text-center">
                    <div className="flex flex-col items-center gap-2 w-32">
                      <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shadow-lg">1</div>
                      <p className="text-xs font-bold">Import Stock</p>
                      <p className="text-[10px] text-slate-500">อัปเดตสต็อก 2 ครั้ง/สัปดาห์</p>
                    </div>
                    <ArrowRight className="hidden md:block text-slate-300" />
                    <div className="flex flex-col items-center gap-2 w-32">
                      <div className="w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold shadow-lg">2</div>
                      <p className="text-xs font-bold">Auto Forecast</p>
                      <p className="text-[10px] text-slate-500">ระบบคำนวณ Min/Max & วันสั่งของ</p>
                    </div>
                    <ArrowRight className="hidden md:block text-slate-300" />
                    <div className="flex flex-col items-center gap-2 w-32">
                      <div className="w-12 h-12 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold shadow-lg">3</div>
                      <p className="text-xs font-bold">Notify Supplier</p>
                      <p className="text-[10px] text-slate-500">ส่งเมลแจ้งเติมของ (PO/PR)</p>
                    </div>
                    <ArrowRight className="hidden md:block text-slate-300" />
                    <div className="flex flex-col items-center gap-2 w-32">
                      <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold shadow-lg">4</div>
                      <p className="text-xs font-bold">Tracking</p>
                      <p className="text-[10px] text-slate-500">ติดตามสถานะขนส่งจนถึงคลัง</p>
                    </div>
                  </div>
                </div>

                {/* 2. รายละเอียดการใช้งานแยกตามเมนู */}
                <div className="space-y-8">
                  <h4 className="font-bold text-lg text-indigo-700 mb-4 border-l-4 border-indigo-500 pl-3">2. วิธีใช้งานและข้อควรระวัง (Operational Guide)</h4>
                  
                  {/* เมนู 1 */}
                  <div className="group">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-orange-100 text-orange-600 rounded-lg group-hover:bg-orange-500 group-hover:text-white transition-colors"><Package size={20}/></div>
                      <h5 className="font-bold text-slate-800">หน้าจัดการสต็อก (Stock Mgt.)</h5>
                    </div>
                    <div className="ml-11 space-y-2 text-sm text-slate-600">
                      <p>✅ <b>การนำเข้าไฟล์:</b> ไฟล์ Excel จาก ERP ต้องมีหัวตาราง (Header) ชื่อ: <code className="bg-slate-100 px-1 rounded text-red-500">Part No</code>, <code className="bg-slate-100 px-1 rounded text-red-500">Description</code>, และ <code className="bg-slate-100 px-1 rounded text-red-500">Available Qty</code></p>
                      <p>✅ <b>ความถี่:</b> ควรอัปโหลดทุกวันอังคารและพฤหัสบดีเพื่อให้ข้อมูล Reorder Date แม่นยำ</p>
                      <p className="text-amber-600 font-medium">⚠️ <b>ข้อควรระวัง:</b> หาก Available Qty ต่ำกว่า Min Stock ระบบจะส่งรายการไปที่หน้า Workflow ทันที</p>
                    </div>
                  </div>

                  {/* เมนู 2 */}
                  <div className="group">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg group-hover:bg-indigo-500 group-hover:text-white transition-colors"><GitMerge size={20}/></div>
                      <h5 className="font-bold text-slate-800">หน้าแจ้งสั่งของ (Workflow)</h5>
                    </div>
                    <div className="ml-11 space-y-2 text-sm text-slate-600">
                      <p>✅ <b>การส่งเมล:</b> ระบบจะรวมรายการที่ขาดแยกตามชื่อซัพพลายเออร์ ให้ตรวจสอบ Email ปลายทางก่อนกดปุ่ม</p>
                      <p>✅ <b>สถานะ Sent:</b> เมื่อส่งแล้ว ปุ่มจะเปลี่ยนเป็น "ส่งซ้ำ" และรายการจะขึ้นป้ายสีส้มว่ารอตอบรับ</p>
                      <p>✅ <b>การล็อคปุ่ม:</b> หากซัพพลายเออร์กดยืนยันแล้ว ปุ่มจะเปลี่ยนเป็นสีเทาและกดส่งไม่ได้อีก เพื่อป้องกันการส่งของซ้ำซ้อน</p>
                    </div>
                  </div>

                  {/* เมนู 3 */}
                  <div className="group">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg group-hover:bg-emerald-500 group-hover:text-white transition-colors"><Users size={20}/></div>
                      <h5 className="font-bold text-slate-800">หน้าจัดการซัพพลายเออร์ (Supplier Mgt.)</h5>
                    </div>
                    <div className="ml-11 space-y-2 text-sm text-slate-600">
                      <p>✅ <b>การตั้งค่า Min/Max:</b> ระบบจะคำนวณจากประวัติการเบิกใช้ 12 เดือนล่าสุด (Avg Weekly Usage × 2)</p>
                      <p>✅ <b>Email:</b> ต้องระบุ Email ที่ถูกต้องเพื่อให้ระบบ Workflow ส่งข้อมูลถึงมือซัพพลายเออร์ได้</p>
                    </div>
                  </div>

                  {/* เมนู 4 */}
                  <div className="group">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-cyan-100 text-cyan-600 rounded-lg group-hover:bg-cyan-500 group-hover:text-white transition-colors"><Truck size={20}/></div>
                      <h5 className="font-bold text-slate-800">หน้าติดตามสถานะ (Tracking)</h5>
                    </div>
                    <div className="ml-11 space-y-2 text-sm text-slate-600">
                      <p>✅ <b>Tracking ID:</b> จะถูกสร้างขึ้นอัตโนมัติทันทีที่ซัพพลายเออร์กดยืนยันรับทราบ</p>
                      <p>✅ <b>การรับของ:</b> เมื่อสินค้าถึงโรงงาน ให้เจ้าหน้าที่คลังสินค้ากดปุ่ม "4. โรงงานรับสินค้า" เพื่อเป็นการจบใบงาน (Close Job)</p>
                    </div>
                  </div>
                </div>

                {/* 3. ส่วนความช่วยเหลือ */}
                <div className="mt-12 p-6 bg-blue-50 rounded-2xl border border-blue-100">
                  <div className="flex items-center gap-3 text-blue-800 mb-2">
                    <AlertCircle size={24} />
                    <h5 className="font-bold">ต้องการความช่วยเหลือเพิ่มเติม?</h5>
                  </div>
                  <p className="text-sm text-blue-700">หากพบปัญหาการใช้งานระบบ หรือข้อมูลสต็อกไม่ตรงกับความเป็นจริง กรุณาติดต่อแผนก IT (เบอร์ภายใน 1234) หรือผู้ดูแลระบบ VMI</p>
                </div>

              </div>
            </div>
          )}

          {/* ===================================== */}
          {/* 2. รายงาน: ประวัติการส่งอีเมล */}
          {/* ===================================== */}
          {activeReport === 'email_logs' && (
            <div className="flex flex-col h-full">
              <div className="p-4 md:p-6 border-b border-slate-100 bg-slate-50/50">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2"><History className="text-indigo-600" /> ประวัติการส่งแจ้งเตือน (Email Logs)</h3>
                <p className="text-sm text-slate-500 mt-1">ประวัติการส่งใบสั่งของและสถานะการรับทราบจาก Supplier</p>
              </div>
              <div className="flex-1 overflow-x-auto overflow-y-auto custom-scrollbar p-0">
                <table className="w-full text-left whitespace-nowrap text-sm min-w-max">
                  <thead className="bg-slate-100 text-slate-600 text-[11px] uppercase font-bold sticky top-0 z-10 shadow-sm">
                    <tr><th className="p-4 pl-6">วันที่ส่ง (Date/Time)</th><th className="p-4">ผู้ส่ง (Sent By)</th><th className="p-4">ชื่อซัพพลายเออร์ (Supplier)</th><th className="p-4 text-center">จำนวนที่แจ้ง</th><th className="p-4 text-center">สถานะตอบรับ</th><th className="p-4 text-center pr-6">จัดการ</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {logs.length === 0 ? (
                      <tr><td colSpan={6} className="p-10 text-center text-slate-400">ยังไม่มีประวัติการส่ง Email ในระบบ</td></tr>
                    ) : (
                      logs.map((log) => {
                        const sentDate = log.sent_at?.toDate ? log.sent_at.toDate().toLocaleString('th-TH') : 'กำลังบันทึก...';
                        return (
                          <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                            <td className="p-4 pl-6 font-mono text-slate-600">{sentDate}</td>
                            <td className="p-4 text-slate-600">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600">{log.sent_by ? log.sent_by.charAt(0).toUpperCase() : 'S'}</div>
                                {log.sent_by || 'System'}
                              </div>
                            </td>
                            <td className="p-4 font-bold text-slate-800">{log.supplier_name}<div className="text-xs font-normal text-indigo-500 mt-0.5">{log.supplier_email}</div></td>
                            <td className="p-4 text-center font-bold text-red-600">{log.items?.length || 0} รายการ</td>
                            <td className="p-4 text-center">
                              {log.acknowledged ? (
                                <div className="flex flex-col items-center"><span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-bold flex items-center gap-1"><CheckCircle size={12} /> รับทราบแล้ว</span><span className="text-[10px] text-slate-400 mt-1 font-mono">{log.acknowledged_at?.toDate ? log.acknowledged_at.toDate().toLocaleString('th-TH') : ''}</span></div>
                              ) : (
                                <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-bold animate-pulse">รอการตอบรับ</span>
                              )}
                            </td>
                            <td className="p-4 text-center pr-6"><button onClick={() => setViewingLogDetails(log)} className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"><Eye size={14} /> ดูรายละเอียด</button></td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===================================== */}
          {/* 3. รายงาน: ประวัติการอัปโหลดไฟล์ Excel */}
          {/* ===================================== */}
          {activeReport === 'upload_logs' && (
            <div className="flex flex-col h-full">
              <div className="p-4 md:p-6 border-b border-slate-100 bg-slate-50/50">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2"><UploadCloud className="text-blue-600" /> ประวัติการนำเข้า ERP (Upload Logs)</h3>
                <p className="text-sm text-slate-500 mt-1">ประวัติการอัปโหลดไฟล์ Excel เพื่ออัปเดตยอดสต็อกและจำนวนสินค้า</p>
              </div>
              <div className="flex-1 overflow-x-auto overflow-y-auto custom-scrollbar p-0">
                <table className="w-full text-left whitespace-nowrap text-sm min-w-max">
                  <thead className="bg-slate-100 text-slate-600 text-[11px] uppercase font-bold sticky top-0 z-10 shadow-sm">
                    <tr><th className="p-4 pl-6">วันที่และเวลา (Date/Time)</th><th className="p-4 text-center">รวมทั้งหมด (Total)</th><th className="p-4 text-center text-emerald-600">สินค้าใหม่ (New)</th><th className="p-4 text-center text-blue-600">อัปเดตยอด (Updated)</th><th className="p-4 pr-6">ผู้ทำรายการ (By)</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {uploadLogs.length === 0 ? (
                      <tr><td colSpan={5} className="p-10 text-center text-slate-400">ยังไม่มีประวัติการอัปโหลดไฟล์</td></tr>
                    ) : (
                      uploadLogs.map((log) => {
                        const uploadDate = log.uploaded_at?.toDate ? log.uploaded_at.toDate().toLocaleString('th-TH') : 'กำลังบันทึก...';
                        return (
                          <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                            <td className="p-4 pl-6 font-mono text-slate-600">{uploadDate}</td>
                            <td className="p-4 text-center font-bold text-slate-700">{log.total_records?.toLocaleString() || 0}</td>
                            <td className="p-4 text-center font-bold text-emerald-600 bg-emerald-50/30">+{log.added_count?.toLocaleString() || 0}</td>
                            <td className="p-4 text-center font-bold text-blue-600 bg-blue-50/30">{log.updated_count?.toLocaleString() || 0}</td>
                            <td className="p-4 pr-6 text-slate-600">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">{log.uploaded_by ? log.uploaded_by.charAt(0).toUpperCase() : 'S'}</div>
                                {log.uploaded_by || 'System Admin'}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Modal ดูรายละเอียดอีเมล */}
        {viewingLogDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[80vh] animate-slide-down">
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl"><Mail size={24} /></div>
                  <div><h3 className="font-bold text-lg text-slate-800">รายละเอียดใบแจ้งเตือน</h3><p className="text-sm text-slate-500">ส่งถึง: {viewingLogDetails.supplier_name} ({viewingLogDetails.supplier_email})</p></div>
                </div>
                <button onClick={() => setViewingLogDetails(null)} className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"><X size={24} /></button>
              </div>
              <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-slate-50/50">
                <p className="text-sm font-bold text-slate-700 mb-3">รายการสินค้าที่แจ้งให้มาส่ง (ทั้งหมด {viewingLogDetails.items?.length} รายการ):</p>
                <div className="space-y-2">
                  {viewingLogDetails.items?.map((item: any, idx: number) => (
                    <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
                      <div><p className="font-bold text-sm text-slate-800 font-mono">{item.part_no}</p><p className="text-xs text-slate-500">{item.description}</p></div>
                      <div className="text-right"><p className="text-[10px] text-slate-400">แจ้งเตือนตอนยอดเหลือ</p><p className="text-sm font-bold text-red-600 font-mono">{item.qty?.toLocaleString()} <span className="text-slate-400 text-xs font-normal">/ Min: {item.min?.toLocaleString()}</span></p></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="px-6 py-4 border-t border-slate-100 bg-white flex justify-end">
                <button onClick={() => setViewingLogDetails(null)} className="px-8 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold transition-colors shadow-md">ปิดหน้าต่าง</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageTemplate>
  );
};

// ==========================================
// 🌟 หน้า Settings (ตั้งค่าระบบและผู้ใช้งาน)
// ==========================================
const SettingsView = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [usersList, setUsersList] = useState<any[]>([]);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', role: 'User', password: '' });

  useEffect(() => {
    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      setUsersList(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'users'), {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        password: formData.password, 
        status: 'Active',
        createdAt: serverTimestamp()
      });
      setFormData({ name: '', email: '', role: 'User', password: '' });
      setIsAddingUser(false);
      alert('เพิ่มผู้ใช้งานสำเร็จ! (สามารถนำไปใช้ Login ได้ทันที)');
    } catch(e) {
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
  };

  const handleDeleteUser = async (id: string) => {
    if(window.confirm('คุณแน่ใจหรือไม่ที่จะลบผู้ใช้นี้ออกจากระบบ?')) {
      await deleteDoc(doc(db, 'users', id));
    }
  };

  return (
    <PageTemplate title="System Settings">
      <div className="flex flex-col lg:flex-row gap-6 h-full p-4 md:p-6 max-h-[calc(100vh-64px)] overflow-hidden">
        
        <div className="w-full lg:w-72 bg-white border border-slate-200 rounded-2xl p-4 shrink-0 shadow-sm flex flex-col">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">Settings Menu</h3>
          <div className="space-y-2 overflow-y-auto">
            <button onClick={() => setActiveTab('users')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-sm text-left ${activeTab === 'users' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}>
              <Users size={18} className={activeTab === 'users' ? 'text-blue-400' : ''} />
              <span className="flex-1">จัดการผู้ใช้งาน (Users)</span>
            </button>
            <button onClick={() => setActiveTab('general')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-sm text-left ${activeTab === 'general' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}>
              <Settings size={18} className={activeTab === 'general' ? 'text-emerald-400' : ''} />
              <span className="flex-1">ตั้งค่าทั่วไป (General)</span>
            </button>
          </div>
        </div>

        <div className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col overflow-hidden relative">
          {activeTab === 'users' && (
            <>
              <div className="p-4 md:p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div>
                  <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2"><Shield className="text-blue-600" /> จัดการสิทธิ์และผู้ใช้งาน</h3>
                  <p className="text-sm text-slate-500 mt-1">เพิ่มหรือลบพนักงานที่สามารถเข้าใช้งานระบบ VMI ได้</p>
                </div>
                <button onClick={() => setIsAddingUser(!isAddingUser)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors shadow-sm">
                  <UserPlus size={18} /> เพิ่มผู้ใช้ใหม่
                </button>
              </div>

              {isAddingUser && (
                <form onSubmit={handleSaveUser} className="p-6 bg-blue-50/50 border-b border-blue-100 grid grid-cols-1 md:grid-cols-2 gap-4 animate-slide-down shrink-0">
                  <div><label className="block text-xs font-bold text-slate-700 mb-1">ชื่อ - นามสกุล *</label><input required type="text" className="w-full border border-slate-300 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-400" placeholder="ระบุชื่อจริง" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
                  <div><label className="block text-xs font-bold text-slate-700 mb-1">Email / Username *</label><input required type="email" className="w-full border border-slate-300 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-400" placeholder="email@company.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} /></div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">รหัสผ่าน (Password) *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Key size={16} className="text-slate-400" /></div>
                      <input required type="password" minLength={6} className="w-full border border-slate-300 pl-9 pr-4 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-400" placeholder="อย่างน้อย 6 ตัวอักษร" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">สิทธิ์การใช้งาน (Role)</label>
                    <select className="w-full border border-slate-300 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 font-bold text-slate-700 bg-white" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                      <option value="Admin">Administrator (ผู้ดูแลระบบ)</option><option value="User">User (ผู้ใช้งานทั่วไป)</option><option value="Viewer">Viewer (ดูได้อย่างเดียว)</option>
                    </select>
                  </div>
                  <div className="md:col-span-2 flex justify-end gap-2 mt-2">
                    <button type="button" onClick={() => setIsAddingUser(false)} className="px-6 py-2.5 bg-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-300 transition-colors">ยกเลิก</button>
                    <button type="submit" className="bg-emerald-600 text-white px-8 py-2.5 rounded-xl font-bold hover:bg-emerald-700 shadow-md transition-colors">บันทึกข้อมูลผู้ใช้</button>
                  </div>
                </form>
              )}

              <div className="flex-1 overflow-x-auto overflow-y-auto custom-scrollbar p-0">
                <table className="w-full text-left whitespace-nowrap text-sm min-w-max">
                  <thead className="bg-slate-100 text-slate-600 text-[11px] uppercase font-bold sticky top-0 z-10 shadow-sm">
                    <tr><th className="p-4 pl-6">ชื่อ (Name)</th><th className="p-4">อีเมล (Email)</th><th className="p-4 text-center">สิทธิ์ (Role)</th><th className="p-4 text-center">สถานะ</th><th className="p-4 text-center pr-6">จัดการ</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {usersList.length === 0 ? (
                      <tr><td colSpan={5} className="p-10 text-center text-slate-400">ยังไม่มีข้อมูลผู้ใช้งานในระบบ</td></tr>
                    ) : (
                      usersList.map((u) => (
                        <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-4 pl-6 font-bold text-slate-800 flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">{u.name?.charAt(0).toUpperCase()}</div>{u.name}</td>
                          <td className="p-4 text-slate-600">{u.email}</td>
                          <td className="p-4 text-center"><span className={`px-3 py-1 rounded-full text-xs font-bold ${u.role === 'Admin' ? 'bg-purple-100 text-purple-700 border border-purple-200' : 'bg-slate-100 text-slate-700 border border-slate-200'}`}>{u.role}</span></td>
                          <td className="p-4 text-center"><span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-bold flex items-center justify-center gap-1 w-20 mx-auto"><CheckCircle size={12} /> {u.status}</span></td>
                          <td className="p-4 text-center pr-6"><button onClick={() => handleDeleteUser(u.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18} /></button></td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {activeTab === 'general' && (
            <div className="p-10 flex flex-col items-center justify-center h-full text-center">
              <Briefcase size={64} className="text-slate-300 mb-6" />
              <h3 className="text-2xl font-bold text-slate-700 mb-2">ตั้งค่าระบบทั่วไป</h3>
              <p className="text-slate-500 max-w-md">พื้นที่นี้เตรียมไว้สำหรับการตั้งค่าอื่นๆ ในอนาคต เช่น ข้อมูลบริษัท, โลโก้ หรือการเชื่อมต่อ API ภายนอก</p>
              <div className="mt-8 px-6 py-3 bg-slate-100 text-slate-500 rounded-xl font-bold text-sm border border-slate-200 border-dashed">🚧 Coming Soon</div>
            </div>
          )}
        </div>
      </div>
    </PageTemplate>
  );
};

// ==========================================
// 📱 หน้าลงทะเบียน Line สำหรับ Supplier (LIFF)
// ==========================================
const LineRegisterView = () => {
  const [profile, setProfile] = useState<any>(null);
  const [vendorNo, setVendorNo] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const LIFF_ID = "2009131430-9spfjff5"; 

  // ฟังก์ชันดึง Profile แบบบังคับ (Force)
  const fetchUserProfile = async () => {
    try {
      if (liff.isLoggedIn()) {
        const userProfile = await liff.getProfile();
        setProfile(userProfile);
        setErrorMsg('');
        return userProfile;
      }
    } catch (err) {
      console.error("Fetch Profile Error:", err);
      setErrorMsg("ไม่สามารถดึงข้อมูลโปรไฟล์ได้: " + err.message);
    }
    return null;
  };

  useEffect(() => {
    const initLiff = async () => {
      try {
        await liff.init({ liffId: LIFF_ID });
        if (!liff.isLoggedIn()) {
          liff.login();
        } else {
          await fetchUserProfile(); // รอจนกว่าจะได้ Profile
        }
      } catch (err) {
        setErrorMsg("LIFF Init Failed: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    initLiff();
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 🚀 จุดสำคัญ: ถ้ากดแล้วยังไม่มี ID ให้ลองดึงใหม่อีกรอบทันที
    let currentProfile = profile;
    if (!currentProfile) {
      currentProfile = await fetchUserProfile();
    }

    if (!currentProfile?.userId) {
      return alert("ยังดึง LINE ID ไม่ได้ กรุณากดปุ่ม 'ลองดึงข้อมูลใหม่อีกครั้ง' หรือปิดหน้านี้แล้วเปิดใหม่ครับ");
    }

    if (!vendorNo || !fullName) return alert("กรุณากรอกข้อมูลให้ครบถ้วน");

    try {
      const q = query(collection(db, 'suppliers'), where('vendor_no', '==', vendorNo.trim()));
      const snap = await getDocs(q);

      if (snap.empty) {
        alert("ไม่พบรหัสซัพพลายเออร์ '" + vendorNo + "' ในระบบ");
        return;
      }

      await setDoc(doc(db, 'line_users', currentProfile.userId), {
        line_user_id: currentProfile.userId,
        line_username: currentProfile.displayName || 'Unknown',
        line_picture: currentProfile.pictureUrl || '',
        full_name: fullName,
        vendor_no: vendorNo.trim(),
        registered_at: serverTimestamp()
      });

      setSuccess(true);
    } catch (err: any) {
      alert("Firebase Error: " + err.message);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <RefreshCw className="animate-spin text-blue-600 mb-4" size={40} />
      <p className="font-bold">กำลังเชื่อมต่อ LINE...</p>
    </div>
  );

  if (success) return (
    <div className="min-h-screen bg-emerald-50 flex flex-col items-center justify-center p-6 text-center">
      <CheckCircle className="text-emerald-500 mb-4" size={80} />
      <h1 className="text-2xl font-bold">ลงทะเบียนสำเร็จ!</h1>
      <button onClick={() => liff.closeWindow()} className="mt-8 bg-slate-800 text-white px-8 py-3 rounded-2xl font-bold">ปิดหน้าต่าง</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border overflow-hidden mt-4">
        {/* ส่วนแสดงผลสถานะการดึง ID */}
        <div className={`p-4 text-center ${profile ? 'bg-emerald-500' : 'bg-rose-500'} text-white`}>
          <p className="text-xs font-bold uppercase tracking-widest">
            {profile ? "✅ เชื่อมต่อ LINE ID สำเร็จ" : "❌ ยังดึง LINE ID ไม่ได้"}
          </p>
          <p className="text-[10px] opacity-80 break-all font-mono">
            ID: {profile?.userId || "Waiting..."}
          </p>
        </div>

        <div className="p-8 space-y-6">
          <div className="text-center">
            {profile?.pictureUrl && (
              <img src={profile.pictureUrl} className="w-20 h-20 rounded-full mx-auto mb-2 border-4 border-slate-100 shadow-md" alt="Profile" />
            )}
            <h2 className="text-xl font-bold">สวัสดีคุณ {profile?.displayName || 'ซัพพลายเออร์'}</h2>
            {!profile && (
              <button onClick={fetchUserProfile} className="text-blue-600 text-xs font-bold underline mt-2">
                ลองดึงข้อมูลโปรไฟล์ใหม่อีกครั้ง
              </button>
            )}
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">รหัสซัพพลายเออร์ (Vendor No)</label>
              <input required type="text" value={vendorNo} onChange={e => setVendorNo(e.target.value)} className="w-full border p-4 rounded-2xl focus:border-blue-500 outline-none font-bold" placeholder="เช่น V001" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">ชื่อ-นามสกุล</label>
              <input required type="text" value={fullName} onChange={e => setFullName(e.target.value)} className="w-full border p-4 rounded-2xl focus:border-blue-500 outline-none font-bold" placeholder="ระบุชื่อจริง" />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg active:scale-95 transition-transform">
              ยืนยันการลงทะเบียน
            </button>
          </form>
        </div>
      </div>
      {errorMsg && <p className="mt-4 text-rose-500 text-xs text-center">{errorMsg}</p>}
    </div>
  );
};
// ==========================================
// 4. Main Application Router
// ==========================================
// ==========================================
// 4. Main Application Router
// ==========================================
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginView />} />
        <Route path="/acknowledge" element={<AcknowledgeView />} />
        
        {/* 🚀 เพิ่มบรรทัดนี้เพื่อให้หน้าลงทะเบียน LINE ใช้งานได้ */}
        <Route path="/register" element={<LineRegisterView />} />

        <Route path="/" element={<ProtectedRoute><HomeView /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardView /></ProtectedRoute>} />
        <Route path="/workflow" element={<ProtectedRoute><WorkflowView /></ProtectedRoute>} />
        <Route path="/tracking" element={<ProtectedRoute><TrackingView /></ProtectedRoute>} /> 
        <Route path="/suppliers" element={<ProtectedRoute><SupplierManagementView /></ProtectedRoute>} />
        <Route path="/stock" element={<ProtectedRoute><StockManagementView /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><ReportsView /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsView /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}