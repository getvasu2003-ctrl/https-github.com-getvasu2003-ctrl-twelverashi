import React, { useState } from 'react';
import {
  Globe,
  X,
  CheckCircle2,
  AlertTriangle,
  Copy,
  ExternalLink,
  ShieldCheck,
  Server,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

interface CustomDomainModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomDomainModal: React.FC<CustomDomainModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [domainInput, setDomainInput] = useState('12rashi.com');
  const [activeProviderTab, setActiveProviderTab] = useState<'cloudflare' | 'firebase' | 'cloudrun'>('cloudflare');
  const [checking, setChecking] = useState(false);
  const [dnsResult, setDnsResult] = useState<any>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const appRunTarget = 'ais-pre-qftw3646tdn3quxrm6uisw-420412968442.asia-east1.run.app';
  const firebaseProject = 'light-diorama-nmn89';

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCheckDns = async () => {
    setChecking(true);
    setDnsResult(null);
    try {
      const res = await fetch('/api/domain/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: domainInput }),
      });
      const data = await res.json();
      setDnsResult(data);
    } catch (err: any) {
      setDnsResult({
        success: false,
        error: err.message || 'Failed to query DNS servers',
      });
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl text-stone-200">
        {/* Header */}
        <div className="sticky top-0 bg-stone-900/95 backdrop-blur border-b border-stone-800 p-5 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-600/20 text-orange-400 flex items-center justify-center border border-orange-500/30">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Custom Domain & DNS Mapping
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Production Ready
                </span>
              </h2>
              <p className="text-xs text-stone-400">
                Map your branded domain (e.g. 12rashi.com or app.12rashi.com) with automated SSL
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Target Host Details Banner */}
          <div className="bg-gradient-to-r from-orange-950/40 via-stone-800/50 to-amber-950/40 p-4 rounded-xl border border-orange-500/20 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-orange-400">
                Target Cloud Run Deployment
              </span>
              <p className="text-sm font-mono text-white select-all break-all">{appRunTarget}</p>
            </div>
            <button
              onClick={() => copyToClipboard(appRunTarget, 'target')}
              className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded-lg border border-stone-700 transition cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedKey === 'target' ? 'Copied!' : 'Copy Target URL'}</span>
            </button>
          </div>

          {/* Provider Tabs */}
          <div>
            <div className="flex border-b border-stone-800 text-xs font-semibold">
              <button
                onClick={() => setActiveProviderTab('cloudflare')}
                className={`py-3 px-4 border-b-2 transition cursor-pointer flex items-center gap-2 ${
                  activeProviderTab === 'cloudflare'
                    ? 'border-orange-500 text-orange-400 font-bold bg-orange-500/5'
                    : 'border-transparent text-stone-400 hover:text-stone-200'
                }`}
              >
                <span>Method 1: Cloudflare / DNS CNAME (Recommended)</span>
              </button>
              <button
                onClick={() => setActiveProviderTab('firebase')}
                className={`py-3 px-4 border-b-2 transition cursor-pointer flex items-center gap-2 ${
                  activeProviderTab === 'firebase'
                    ? 'border-orange-500 text-orange-400 font-bold bg-orange-500/5'
                    : 'border-transparent text-stone-400 hover:text-stone-200'
                }`}
              >
                <span>Method 2: Firebase Hosting</span>
              </button>
              <button
                onClick={() => setActiveProviderTab('cloudrun')}
                className={`py-3 px-4 border-b-2 transition cursor-pointer flex items-center gap-2 ${
                  activeProviderTab === 'cloudrun'
                    ? 'border-orange-500 text-orange-400 font-bold bg-orange-500/5'
                    : 'border-transparent text-stone-400 hover:text-stone-200'
                }`}
              >
                <span>Method 3: Google Cloud Run</span>
              </button>
            </div>

            {/* Tab 1: Cloudflare / CNAME */}
            {activeProviderTab === 'cloudflare' && (
              <div className="pt-5 space-y-4 text-xs">
                <p className="text-stone-300 leading-relaxed">
                  The fastest and most reliable way to map <strong className="text-white">12rashi.com</strong> or{' '}
                  <strong className="text-white">app.12rashi.com</strong> with free global CDN and instant SSL:
                </p>

                <div className="bg-stone-800/70 p-4 rounded-xl border border-stone-700/80 space-y-3">
                  <div className="font-semibold text-white text-sm">Add DNS Record at your Domain Registrar (GoDaddy, Namecheap, Cloudflare, etc.):</div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-xs">
                    <div className="bg-stone-900 p-2.5 rounded-lg border border-stone-700">
                      <span className="text-[10px] text-stone-400 uppercase font-bold block">Type</span>
                      <span className="font-mono font-bold text-amber-400">CNAME</span>
                    </div>
                    <div className="bg-stone-900 p-2.5 rounded-lg border border-stone-700">
                      <span className="text-[10px] text-stone-400 uppercase font-bold block">Name / Host</span>
                      <span className="font-mono font-bold text-white">@ (or app / www)</span>
                    </div>
                    <div className="bg-stone-900 p-2.5 rounded-lg border border-stone-700 md:col-span-2 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-stone-400 uppercase font-bold block">Value / Target</span>
                        <span className="font-mono text-orange-300 break-all select-all text-[11px]">{appRunTarget}</span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(appRunTarget, 'cname-val')}
                        className="p-1.5 hover:bg-stone-800 text-stone-400 hover:text-white rounded"
                        title="Copy"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 text-stone-400 text-[11px]">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>In Cloudflare, keep <strong>Proxy status: Proxied (Orange Cloud)</strong> and set SSL/TLS encryption to <strong>Full</strong>.</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Firebase Hosting */}
            {activeProviderTab === 'firebase' && (
              <div className="pt-5 space-y-4 text-xs">
                <p className="text-stone-300 leading-relaxed">
                  Your project <strong className="text-white">{firebaseProject}</strong> is already connected to Google Cloud Firestore. You can connect your custom domain directly in Firebase Console:
                </p>

                <div className="bg-stone-800/70 p-4 rounded-xl border border-stone-700/80 space-y-3">
                  <ol className="list-decimal list-inside space-y-2 text-stone-300">
                    <li>Go to the <a href={`https://console.firebase.google.com/project/${firebaseProject}/hosting`} target="_blank" rel="noreferrer" className="text-amber-400 underline inline-flex items-center gap-1 font-semibold">Firebase Hosting Console <ExternalLink className="w-3 h-3" /></a></li>
                    <li>Click <strong>&quot;Add custom domain&quot;</strong> and enter <strong>12rashi.com</strong></li>
                    <li>Add the two Google A-records in your domain DNS:</li>
                  </ol>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 font-mono text-xs">
                    <div className="bg-stone-900 p-2.5 rounded-lg border border-stone-700 flex justify-between items-center">
                      <div>
                        <span className="text-[10px] text-stone-400 block font-sans">A-Record 1</span>
                        <span className="text-emerald-400 font-bold">199.36.158.100</span>
                      </div>
                      <button onClick={() => copyToClipboard('199.36.158.100', 'a1')} className="p-1 hover:text-white text-stone-400">
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="bg-stone-900 p-2.5 rounded-lg border border-stone-700 flex justify-between items-center">
                      <div>
                        <span className="text-[10px] text-stone-400 block font-sans">A-Record 2</span>
                        <span className="text-emerald-400 font-bold">199.36.158.100</span>
                      </div>
                      <button onClick={() => copyToClipboard('199.36.158.100', 'a2')} className="p-1 hover:text-white text-stone-400">
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Cloud Run Domain Mapping */}
            {activeProviderTab === 'cloudrun' && (
              <div className="pt-5 space-y-4 text-xs">
                <p className="text-stone-300 leading-relaxed">
                  Map your domain directly to Cloud Run using Google Cloud CLI:
                </p>

                <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 font-mono text-[11px] text-amber-300 space-y-2">
                  <div className="flex justify-between items-center text-stone-400 font-sans text-xs">
                    <span>Terminal Command:</span>
                    <button
                      onClick={() => copyToClipboard(`gcloud beta run domain-mappings create --service ais-pre-qftw3646tdn3quxrm6uisw-420412968442 --domain ${domainInput} --region asia-east1`, 'cmd')}
                      className="text-stone-300 hover:text-white flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </button>
                  </div>
                  <p className="select-all break-all">
                    gcloud beta run domain-mappings create --service ais-pre-qftw3646tdn3quxrm6uisw-420412968442 --domain {domainInput} --region asia-east1
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Live DNS Propagation & Status Checker */}
          <div className="pt-4 border-t border-stone-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Server className="w-4 h-4 text-orange-400" />
                Live DNS Propagation & SSL Checker
              </h3>
              <span className="text-[11px] text-stone-400">Querying global public DNS</span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={domainInput}
                onChange={(e) => setDomainInput(e.target.value)}
                placeholder="Enter domain (e.g. 12rashi.com or app.12rashi.com)"
                className="flex-1 bg-stone-800 border border-stone-700 px-3.5 py-2 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500 font-mono"
              />
              <button
                onClick={handleCheckDns}
                disabled={checking}
                className="px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer transition disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${checking ? 'animate-spin' : ''}`} />
                <span>{checking ? 'Checking...' : 'Check Live DNS'}</span>
              </button>
            </div>

            {dnsResult && (
              <div className="bg-stone-800/80 p-4 rounded-xl border border-stone-700 text-xs space-y-2.5 animate-fade-in">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white font-mono">{dnsResult.domain}</span>
                  {dnsResult.isMapped ? (
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                      <CheckCircle2 className="w-3.5 h-3.5" /> DNS Pointing Successfully
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-amber-400 font-semibold bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                      <AlertTriangle className="w-3.5 h-3.5" /> Pending DNS Update or Propagation
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-stone-900 p-2.5 rounded-lg border border-stone-800">
                    <span className="text-stone-400 block font-semibold">Resolved A Records:</span>
                    <span className="font-mono text-stone-200">
                      {dnsResult.records?.a?.length ? dnsResult.records.a.join(', ') : 'None detected'}
                    </span>
                  </div>
                  <div className="bg-stone-900 p-2.5 rounded-lg border border-stone-800">
                    <span className="text-stone-400 block font-semibold">Resolved CNAME Records:</span>
                    <span className="font-mono text-stone-200">
                      {dnsResult.records?.cname?.length ? dnsResult.records.cname.join(', ') : 'None detected'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-900/90 border-t border-stone-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded-xl transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
