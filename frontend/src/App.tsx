
import React, { useState, useEffect } from 'react';
import { auth, generate, wallet } from './api';
import { 
  Sparkles, Image as ImageIcon, Wallet, LogOut, Loader2, 
  Zap, CreditCard, LayoutGrid, User, Plus, Wand2, History,
  Download, Share2, AlertCircle, CheckCircle2
} from 'lucide-react';

export default function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('generate');
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem('token'));
  
  // Auth State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoginView, setIsLoginView] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Generate State
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [model, setModel] = useState('v1');
  const [aspectRatio, setAspectRatio] = useState('1:1');

  // Wallet & History State
  const [packages, setPackages] = useState([]);
  const [history, setHistory] = useState([
    { id: 1, url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=60', prompt: 'Cyberpunk city', date: '2 mins ago' },
    { id: 2, url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=60', prompt: 'Floating islands', date: '1 hour ago' },
    { id: 3, url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=500&auto=format&fit=crop&q=60', prompt: 'Neon samurai', date: '2 days ago' },
  ]);

  useEffect(() => {
    if (isAuth) {
      fetchProfile();
      fetchPackages();
    }
  }, [isAuth]);

  const fetchProfile = async () => {
    try {
      const res = await auth.getProfile();
      setUser(res.data);
    } catch (e) {
      logout();
    }
  };

  const fetchPackages = async () => {
    try {
      const res = await wallet.getPackages();
      setPackages(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    try {
      const res = isLoginView 
        ? await auth.login(email, password)
        : await auth.register(name, email, password);
      
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      setIsAuth(true);
    } catch (e) {
      setAuthError(e.response?.data?.msg || 'Authentication Failed');
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuth(false);
    setUser(null);
  };

  const handleGenerate = async () => {
    if (!prompt) return;
    setGenerating(true);
    setGeneratedImage(null);
    try {
      const res = await generate.createImage(prompt, model, aspectRatio);
      if (res.data.success) {
        setGeneratedImage(res.data.imageUrl);
        setHistory([
          { id: Date.now(), url: res.data.imageUrl, prompt: prompt, date: 'Just now' },
          ...history
        ]);
        fetchProfile(); // Update points
      }
    } catch (e) {
      alert(e.response?.data?.msg || 'Generation Failed');
    } finally {
      setGenerating(false);
    }
  };

  if (!isAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-[-20%] left-[-20%] w-[50%] h-[50%] bg-indigo-600/20 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-[-20%] right-[-20%] w-[50%] h-[50%] bg-purple-600/20 blur-[100px] rounded-full"></div>

        <div className="w-full max-w-md bg-zinc-900/50 backdrop-blur-xl rounded-2xl p-8 border border-zinc-800 shadow-2xl relative z-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/20">
              <Sparkles size={32} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">{isLoginView ? 'Welcome Back' : 'Create Account'}</h1>
            <p className="text-zinc-400 mt-2">Join Rupantar AI Creative Platform</p>
          </div>
          
          <form onSubmit={handleAuth} className="space-y-4">
            {!isLoginView && (
              <div className="space-y-1">
                 <label className="text-xs text-zinc-500 uppercase font-bold ml-1">Full Name</label>
                 <input 
                    type="text" 
                    className="w-full bg-zinc-950/80 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:border-indigo-500 outline-none transition-all"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                 />
              </div>
            )}
            <div className="space-y-1">
                 <label className="text-xs text-zinc-500 uppercase font-bold ml-1">Email Address</label>
                 <input 
                    type="email" 
                    className="w-full bg-zinc-950/80 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:border-indigo-500 outline-none transition-all"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                 />
            </div>
            <div className="space-y-1">
                 <label className="text-xs text-zinc-500 uppercase font-bold ml-1">Password</label>
                 <input 
                    type="password" 
                    className="w-full bg-zinc-950/80 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:border-indigo-500 outline-none transition-all"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                 />
            </div>
            
            {authError && (
               <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 text-sm">
                  <AlertCircle size={16} /> {authError}
               </div>
            )}

            <button 
              type="submit" 
              disabled={authLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 py-3.5 rounded-lg font-bold text-white transition-all transform hover:scale-[1.02] active:scale-[0.98] flex justify-center items-center gap-2 shadow-lg shadow-indigo-600/20"
            >
              {authLoading ? <Loader2 className="animate-spin" /> : (isLoginView ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <p className="mt-6 text-center text-zinc-500 text-sm">
            {isLoginView ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => setIsLoginView(!isLoginView)} className="text-indigo-400 font-medium hover:underline hover:text-indigo-300 transition-colors">
              {isLoginView ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 bg-zinc-950/50 backdrop-blur-xl border-r border-zinc-800 p-6 flex flex-col z-20">
        <div className="flex items-center gap-3 mb-10">
           <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-600/20">
             <Sparkles className="text-white" size={20} />
           </div>
           <span className="font-bold text-xl tracking-tight">Rupantar AI</span>
        </div>
        
        <nav className="flex-1 space-y-2">
          <button 
            onClick={() => setActiveTab('generate')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-medium ${activeTab === 'generate' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100'}`}
          >
            <Wand2 size={20} /> Generate
          </button>
          <button 
            onClick={() => setActiveTab('gallery')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-medium ${activeTab === 'gallery' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100'}`}
          >
            <History size={20} /> History
          </button>
          <button 
            onClick={() => setActiveTab('wallet')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-medium ${activeTab === 'wallet' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100'}`}
          >
            <Wallet size={20} /> Credits & Plans
          </button>
        </nav>

        <div className="mt-auto pt-6 border-t border-zinc-900">
          <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 mb-4">
             <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-zinc-500 uppercase">Credits</span>
                <span className="text-indigo-400 font-bold">{user?.points}</span>
             </div>
             <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 w-[40%]"></div>
             </div>
             <button onClick={() => setActiveTab('wallet')} className="text-xs text-indigo-400 mt-2 hover:underline">Top up wallet</button>
          </div>

          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">
              {user?.name?.charAt(0)}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="font-medium text-sm truncate text-white">{user?.name}</p>
              <p className="text-xs text-zinc-500 truncate">{user?.email}</p>
            </div>
            <button onClick={logout} className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-red-400 transition-colors">
               <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto relative">
        {/* Background Ambient Light */}
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
           <div className="absolute top-[-10%] right-[10%] w-[40%] h-[40%] bg-indigo-900/10 blur-[120px] rounded-full"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto">
        
        {activeTab === 'generate' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-3 py-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-900/30 border border-indigo-500/30 text-indigo-300 text-xs font-medium mb-2">
                 <Sparkles size={12} /> New SDXL Lightning Model Available
              </div>
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
                Dream it. Create it.
              </h2>
              <p className="text-zinc-400 max-w-lg mx-auto text-lg">Turn your wildest ideas into stunning visuals in seconds with Rupantar AI.</p>
            </div>

            <div className="bg-zinc-900/80 backdrop-blur-md p-1 rounded-2xl border border-zinc-800 shadow-2xl max-w-3xl mx-auto">
              <div className="p-6">
                 <div className="relative">
                    <textarea 
                      placeholder="Describe your imagination... (e.g. A futuristic cyberpunk city with neon lights in rain, 8k resolution)" 
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 h-32 text-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none resize-none mb-4 text-white placeholder:text-zinc-600 transition-all"
                      value={prompt}
                      onChange={e => setPrompt(e.target.value)}
                    />
                    <div className="absolute bottom-6 right-4 flex gap-2">
                       <button className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-2 py-1 rounded transition-colors">Cyberpunk</button>
                       <button className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-2 py-1 rounded transition-colors">Portrait</button>
                       <button className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-2 py-1 rounded transition-colors">3D Render</button>
                    </div>
                 </div>
                 
                 <div className="flex flex-wrap gap-4 justify-between items-center pt-2 border-t border-zinc-800/50">
                    <div className="flex gap-4">
                       <div className="flex flex-col gap-1">
                          <label className="text-[10px] uppercase font-bold text-zinc-500">Model</label>
                          <select 
                            value={model} 
                            onChange={e => setModel(e.target.value)}
                            className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-300 outline-none focus:border-indigo-500 hover:border-zinc-700 transition-colors"
                          >
                            <option value="v1">Rupantar V1 (Fast)</option>
                            <option value="v2">Rupantar Pro (HD)</option>
                            <option value="v3">Artistic Mode</option>
                          </select>
                       </div>
                       <div className="flex flex-col gap-1">
                          <label className="text-[10px] uppercase font-bold text-zinc-500">Aspect Ratio</label>
                          <select 
                            value={aspectRatio} 
                            onChange={e => setAspectRatio(e.target.value)}
                            className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-300 outline-none focus:border-indigo-500 hover:border-zinc-700 transition-colors"
                          >
                            <option value="1:1">Square (1:1)</option>
                            <option value="16:9">Landscape (16:9)</option>
                            <option value="9:16">Portrait (9:16)</option>
                          </select>
                       </div>
                    </div>

                    <button 
                      onClick={handleGenerate}
                      disabled={generating || !prompt}
                      className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-indigo-600/20 transform hover:-translate-y-0.5 active:translate-y-0"
                    >
                      {generating ? <Loader2 className="animate-spin" /> : <Wand2 size={20} />}
                      {generating ? 'Creating Magic...' : 'Generate Art'}
                      <span className="bg-indigo-700 px-2 py-0.5 rounded text-xs opacity-80 ml-1">5pts</span>
                    </button>
                 </div>
              </div>
            </div>

            {generatedImage && (
              <div className="bg-zinc-900 p-3 rounded-2xl border border-zinc-800 animate-in fade-in zoom-in duration-700 max-w-3xl mx-auto shadow-2xl shadow-indigo-500/10">
                <div className="relative group">
                   <img src={generatedImage} alt="Result" className="w-full rounded-xl" />
                   <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 rounded-xl backdrop-blur-sm">
                      <button className="bg-white text-black p-3 rounded-full hover:scale-110 transition-transform"><Download size={24} /></button>
                      <button className="bg-white text-black p-3 rounded-full hover:scale-110 transition-transform"><Share2 size={24} /></button>
                   </div>
                </div>
                <div className="p-4 flex justify-between items-center">
                   <div className="flex items-center gap-2 text-green-400 text-sm font-medium">
                      <CheckCircle2 size={16} /> Generated Successfully
                   </div>
                   <p className="text-xs text-zinc-500 font-mono">{(Math.random() * 2 + 1).toFixed(2)}s generation time</p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'gallery' && (
           <div className="space-y-6 animate-in fade-in duration-500">
              <div className="flex justify-between items-end mb-4">
                 <div>
                    <h2 className="text-3xl font-bold text-white">Your History</h2>
                    <p className="text-zinc-400">Manage and download your past creations</p>
                 </div>
                 <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-1 flex gap-1">
                    <button className="p-2 bg-zinc-800 rounded hover:bg-zinc-700 text-white"><LayoutGrid size={16}/></button>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {history.map((item) => (
                    <div key={item.id} className="group relative bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-lg hover:shadow-indigo-500/10 transition-all hover:border-indigo-500/30">
                       <div className="aspect-square overflow-hidden bg-zinc-950 relative">
                          <img src={item.url} alt={item.prompt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                             <div className="flex gap-2 justify-end">
                                <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md p-2 rounded-full text-white"><Download size={16}/></button>
                                <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md p-2 rounded-full text-white"><Share2 size={16}/></button>
                             </div>
                          </div>
                       </div>
                       <div className="p-4">
                          <p className="text-sm font-medium text-white truncate mb-1">{item.prompt}</p>
                          <p className="text-xs text-zinc-500">{item.date}</p>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        )}

        {activeTab === 'wallet' && (
          <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
             <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 rounded-3xl p-8 border border-indigo-500/30 flex justify-between items-center shadow-2xl">
               <div>
                 <h2 className="text-3xl font-bold text-white mb-2">Credit Store</h2>
                 <p className="text-indigo-200 max-w-md">Top up your wallet to keep creating amazing art. Credits never expire.</p>
               </div>
               <div className="bg-black/30 backdrop-blur-md px-8 py-6 rounded-2xl border border-white/10 text-center min-w-[200px]">
                  <p className="text-xs text-indigo-300 uppercase font-bold tracking-wider mb-1">Your Balance</p>
                  <div className="flex items-center justify-center gap-2">
                     <p className="text-4xl font-bold text-white">{user?.points}</p>
                     <Zap size={24} className="text-yellow-400 fill-yellow-400" />
                  </div>
               </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {packages.map((pkg) => (
                  <div key={pkg._id} className={`p-8 rounded-3xl border transition-all duration-300 transform hover:-translate-y-2 ${pkg.isPopular ? 'bg-zinc-900 border-indigo-500 shadow-2xl shadow-indigo-900/20 relative scale-105 z-10' : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'}`}>
                     {pkg.isPopular && (
                       <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                         MOST POPULAR
                       </div>
                     )}
                     <h3 className="text-xl font-bold mb-4 text-white">{pkg.name}</h3>
                     <div className="flex items-baseline gap-1 mb-6">
                        <span className="text-4xl font-bold text-white">₹{pkg.price}</span>
                        <span className="text-zinc-500 font-medium">/ pack</span>
                     </div>
                     <ul className="space-y-4 mb-8">
                        <li className="flex gap-3 text-sm text-zinc-300 items-center"><div className="p-1 bg-yellow-500/20 rounded-full"><Zap size={12} className="text-yellow-500" /></div> {pkg.points} Generation Credits</li>
                        {pkg.bonusPoints > 0 && <li className="flex gap-3 text-sm text-green-400 items-center font-bold"><div className="p-1 bg-green-500/20 rounded-full"><Plus size={12} className="text-green-500" /></div> {pkg.bonusPoints} Bonus Credits</li>}
                        <li className="flex gap-3 text-sm text-zinc-300 items-center"><div className="p-1 bg-purple-500/20 rounded-full"><ImageIcon size={12} className="text-purple-500" /></div> Commercial Usage Rights</li>
                     </ul>
                     <button className={`w-full py-4 rounded-xl font-bold transition-all shadow-lg ${pkg.isPopular ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/25' : 'bg-white text-black hover:bg-zinc-200'}`}>
                        Buy Now
                     </button>
                  </div>
                ))}
             </div>
          </div>
        )}
        </div>
      </main>
    </div>
  );
}
