import React, { useState, useRef } from 'react';
import { Settings, Users, Mail, BarChart2, Zap, Upload, Bold, Italic, List, Link as LinkIcon, Eraser, Clock } from 'lucide-react';
import * as XLSX from 'xlsx';

// Types
interface Config {
  kurs: number;
  costPer1k: number;
  senderName: string;
  senderEmail: string;
  accessKey: string;
  secretKey: string;
}

interface Recipient {
  nama: string;
  email: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState('koneksi');
  const [config, setConfig] = useState<Config>({
    kurs: 16000,
    costPer1k: 0.1,
    senderName: '',
    senderEmail: '',
    accessKey: '',
    secretKey: ''
  });
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [campaign, setCampaign] = useState({
    subject: '',
    body: 'Halo {{nama}},\n\nTulis pesan Anda di sini...'
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans">
      <div className="max-w-5xl mx-auto pt-12 pb-24 px-6">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <div className="text-orange-500">
              <Zap size={32} fill="currentColor" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">SES Turbo Cost</h1>
              <p className="text-gray-500 text-sm">Blast Berkecepatan Tinggi & Estimasi Biaya</p>
            </div>
          </div>

          <div className="flex items-center bg-white rounded-2xl p-1.5 shadow-sm border border-gray-100">
            <button 
              onClick={() => setActiveTab('koneksi')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === 'koneksi' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'}`}
            >
              <Settings size={18} />
              Koneksi
            </button>
            <button 
              onClick={() => setActiveTab('database')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === 'database' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'}`}
            >
              <Users size={18} />
              Database
            </button>
            <button 
              onClick={() => setActiveTab('editor')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === 'editor' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'}`}
            >
              <Mail size={18} />
              Editor
            </button>
            <button 
              onClick={() => setActiveTab('monitor')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === 'monitor' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'}`}
            >
              <BarChart2 size={18} />
              Monitor
            </button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {activeTab === 'koneksi' && <KoneksiTab config={config} setConfig={setConfig} />}
          {activeTab === 'database' && <DatabaseTab recipients={recipients} setRecipients={setRecipients} config={config} />}
          {activeTab === 'editor' && <EditorTab campaign={campaign} setCampaign={setCampaign} recipients={recipients} config={config} />}
          {activeTab === 'monitor' && <MonitorTab />}
        </div>
      </div>
    </div>
  );
}

function KoneksiTab({ config, setConfig }: { config: Config, setConfig: React.Dispatch<React.SetStateAction<Config>> }) {
  return (
    <div className="bg-white rounded-[2rem] p-10 shadow-sm border border-gray-100">
      <div className="flex items-center gap-4 mb-10">
        <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
          <Settings size={28} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Konfigurasi Sistem</h2>
      </div>

      <div className="bg-[#fff9f2] border border-orange-100 rounded-3xl p-8 mb-8">
        <div className="flex items-start gap-4 mb-6">
          <div className="text-orange-500 mt-1">
            <Clock size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Kalkulator Biaya SES</h3>
            <p className="text-sm text-orange-800/70 mt-1 font-medium">
              AWS SES mengenakan tarif standar $0.10 per 1,000 email. Masukkan kurs saat ini untuk estimasi biaya Rupiah.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6 ml-10">
          <div>
            <label className="block text-xs font-bold text-orange-900/60 uppercase tracking-wider mb-2">KURS USD KE IDR</label>
            <input 
              type="number" 
              className="w-full border border-orange-200 rounded-2xl px-5 py-4 font-semibold text-gray-800 focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 bg-white transition-all" 
              value={config.kurs} 
              onChange={e => setConfig({...config, kurs: Number(e.target.value)})} 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-orange-900/60 uppercase tracking-wider mb-2">COST / 1K EMAIL ($)</label>
            <input 
              type="number" 
              step="0.1"
              className="w-full border border-orange-200 rounded-2xl px-5 py-4 font-semibold text-gray-800 focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 bg-white transition-all" 
              value={config.costPer1k} 
              onChange={e => setConfig({...config, costPer1k: Number(e.target.value)})} 
            />
          </div>
        </div>
      </div>

      <div className="bg-gray-50/50 border border-gray-100 rounded-3xl p-8 mb-8">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">Nama Pengirim</label>
            <input 
              type="text" 
              placeholder="Contoh: Marketing Team" 
              className="w-full border border-gray-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 bg-white transition-all" 
              value={config.senderName} 
              onChange={e => setConfig({...config, senderName: e.target.value})} 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">Email Verified (SES)</label>
            <input 
              type="email" 
              placeholder="verified@domain.com" 
              className="w-full border border-gray-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 bg-white transition-all" 
              value={config.senderEmail} 
              onChange={e => setConfig({...config, senderEmail: e.target.value})} 
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 px-2">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-3">AWS Access Key ID</label>
          <input 
            type="text" 
            placeholder="AKIA..." 
            className="w-full border border-gray-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 bg-white transition-all" 
            value={config.accessKey} 
            onChange={e => setConfig({...config, accessKey: e.target.value})} 
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-3">AWS Secret Access Key</label>
          <input 
            type="password" 
            placeholder="Secret Key" 
            className="w-full border border-gray-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 bg-white transition-all" 
            value={config.secretKey} 
            onChange={e => setConfig({...config, secretKey: e.target.value})} 
          />
        </div>
      </div>
    </div>
  );
}

function DatabaseTab({ recipients, setRecipients, config }: { recipients: Recipient[], setRecipients: React.Dispatch<React.SetStateAction<Recipient[]>>, config: Config }) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);
      
      const parsedRecipients = data.map((row: any) => {
        const keys = Object.keys(row);
        const nameKey = keys.find(k => k.toLowerCase().includes('nama') || k.toLowerCase().includes('name'));
        const emailKey = keys.find(k => k.toLowerCase().includes('email'));
        
        return {
          nama: nameKey ? row[nameKey] : 'Unknown',
          email: emailKey ? row[emailKey] : ''
        };
      }).filter(r => r.email);

      setRecipients(parsedRecipients);
    };
    reader.readAsBinaryString(file);
  };

  const totalCost = (recipients.length / 1000) * config.costPer1k * config.kurs;

  return (
    <div className="bg-white rounded-[2rem] p-10 shadow-sm border border-gray-100">
      <div className="flex items-center gap-4 mb-10">
        <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
          <Users size={28} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Database Penerima</h2>
      </div>

      {recipients.length === 0 ? (
        <div 
          className="border-2 border-dashed border-indigo-100 rounded-[2rem] p-20 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-indigo-50/30 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="w-20 h-20 bg-white rounded-3xl shadow-sm border border-gray-100 flex items-center justify-center text-indigo-600 mb-6">
            <Upload size={36} />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">Klik untuk Upload Excel</h3>
          <p className="text-gray-500 font-medium">Sistem akan menghitung biaya otomatis setelah file dimuat.</p>
          <input type="file" className="hidden" ref={fileInputRef} accept=".xlsx, .xls, .csv" onChange={handleFileUpload} />
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-2 gap-6 mb-10">
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-lg shadow-indigo-500/20">
              <div className="relative z-10">
                <div className="text-indigo-100 text-xs font-bold tracking-widest uppercase mb-3">Total Penerima</div>
                <div className="text-6xl font-extrabold mb-3">{recipients.length}</div>
                <div className="text-indigo-100 text-sm font-medium">Siap untuk diproses secara paralel</div>
              </div>
              <Users size={160} className="absolute -bottom-10 -right-10 text-indigo-400 opacity-20" />
            </div>
            <div className="bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-lg shadow-emerald-500/20">
              <div className="relative z-10">
                <div className="text-emerald-100 text-xs font-bold tracking-widest uppercase mb-3">Estimasi Biaya</div>
                <div className="text-6xl font-extrabold mb-3">Rp {totalCost.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                <div className="text-emerald-100 text-sm font-medium">Estimasi kurs: Rp {config.kurs.toLocaleString('id-ID')} / $1</div>
              </div>
              <div className="absolute -bottom-10 -right-4 text-emerald-300 opacity-20 text-[12rem] font-black leading-none">1</div>
            </div>
          </div>

          <div className="border border-gray-100 rounded-3xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50/80 border-b border-gray-100">
                <tr>
                  <th className="px-8 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Nama</th>
                  <th className="px-8 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recipients.slice(0, 5).map((r, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-5 text-sm font-bold text-gray-800">{r.nama}</td>
                    <td className="px-8 py-5 text-sm font-medium text-gray-500">{r.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {recipients.length > 5 && (
              <div className="px-8 py-4 bg-gray-50/50 text-center text-sm font-medium text-gray-500 border-t border-gray-100">
                Menampilkan 5 dari {recipients.length} penerima
              </div>
            )}
          </div>
          
          <div className="mt-6 flex justify-end">
            <button 
              onClick={() => setRecipients([])}
              className="text-red-500 text-sm font-bold hover:text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
            >
              Hapus Data
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function EditorTab({ campaign, setCampaign, recipients, config }: { campaign: any, setCampaign: any, recipients: Recipient[], config: Config }) {
  const totalCost = (recipients.length / 1000) * config.costPer1k * config.kurs;

  return (
    <div className="bg-white rounded-[2rem] p-10 shadow-sm border border-gray-100">
      <div className="flex items-center gap-4 mb-10">
        <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
          <Mail size={28} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Editor Kampanye</h2>
      </div>

      <div className="mb-8">
        <input 
          type="text" 
          placeholder="Subjek Email..." 
          className="w-full border border-gray-200 rounded-2xl px-6 py-5 text-lg font-medium text-gray-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 bg-white transition-all"
          value={campaign.subject}
          onChange={e => setCampaign({...campaign, subject: e.target.value})}
        />
      </div>

      <div className="border border-gray-200 rounded-3xl overflow-hidden mb-10">
        <div className="bg-gray-50/80 border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-5 text-gray-500">
            <button className="hover:text-gray-800 transition-colors"><Bold size={20} /></button>
            <button className="hover:text-gray-800 transition-colors"><Italic size={20} /></button>
            <button className="hover:text-gray-800 transition-colors"><List size={20} /></button>
            <button className="hover:text-gray-800 transition-colors"><LinkIcon size={20} /></button>
            <button className="hover:text-gray-800 transition-colors"><Eraser size={20} /></button>
          </div>
          <button 
            className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-xl text-xs font-bold tracking-wider hover:bg-indigo-200 transition-colors"
            onClick={() => setCampaign({...campaign, body: campaign.body + '{{NAMA}}'})}
          >
            VARIABEL: {'{{NAMA}}'}
          </button>
        </div>
        <textarea 
          className="w-full h-80 p-8 focus:outline-none resize-none text-gray-700 leading-relaxed"
          value={campaign.body}
          onChange={e => setCampaign({...campaign, body: e.target.value})}
        />
      </div>

      <div className="bg-[#0f172a] rounded-[2rem] p-8 flex items-center justify-between text-white shadow-xl shadow-slate-900/20">
        <div>
          <div className="text-slate-400 text-xs font-bold tracking-widest uppercase mb-2">Status Kampanye</div>
          <div className="text-2xl font-bold mb-2">{recipients.length} Penerima Terdaftar</div>
          <div className="text-emerald-400 text-sm font-semibold flex items-center gap-2">
            Estimasi Biaya: Rp {totalCost.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            <LinkIcon size={14} />
          </div>
        </div>
        <button className="bg-white/10 hover:bg-white/20 border border-white/10 text-white px-8 py-5 rounded-2xl font-bold flex items-center gap-3 transition-all hover:scale-105 active:scale-95">
          <Zap size={24} className="text-yellow-400" />
          LUNCURKAN BLASTING
        </button>
      </div>
    </div>
  );
}

function MonitorTab() {
  return (
    <div className="bg-white rounded-[2rem] p-10 shadow-sm border border-gray-100 min-h-[500px]">
      <div className="flex items-center gap-4 mb-10">
        <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
          <BarChart2 size={28} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Dashboard Monitoring</h2>
      </div>

      <div className="flex flex-col items-center justify-center h-80 text-gray-400">
        <BarChart2 size={64} className="mb-6 opacity-20" />
        <p className="font-semibold text-lg">Mulai pengiriman untuk melihat metrik</p>
      </div>
    </div>
  );
}
