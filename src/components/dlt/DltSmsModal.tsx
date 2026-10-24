import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { DLT_CONFIG, DLT_TEMPLATES, DltTemplateExtended } from '../../data/dltData.ts';
import {
  dispatchDltSms,
  sendSmsOtp,
  verifySmsOtp,
  getSmsIpDiagnostics,
} from '../../services/apiService.ts';
import {
  X,
  ShieldCheck,
  Smartphone,
  Send,
  CheckCircle2,
  Building,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Copy,
  Check,
  Server,
  KeyRound,
  Radio,
  FileCheck,
  AlertTriangle,
  RotateCw,
} from 'lucide-react';

export const DltSmsModal: React.FC = () => {
  const { openDltModal, setOpenDltModal, userProfile, addNotification } = useApp();

  const [activeTab, setActiveTab] = useState<'templates' | 'test-otp' | 'diagnostics'>('templates');
  const [selectedTemplate, setSelectedTemplate] = useState<DltTemplateExtended>(DLT_TEMPLATES[0]);
  const [phoneNumber, setPhoneNumber] = useState(userProfile?.phone || '9831049814');
  const [isSending, setIsSending] = useState(false);
  const [dispatchedInfo, setDispatchedInfo] = useState<any>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // OTP Verification Test State
  const [otpPhone, setOtpPhone] = useState(userProfile?.phone || '9831049814');
  const [dispatchedOtp, setDispatchedOtp] = useState<string | null>(null);
  const [inputOtp, setInputOtp] = useState('');
  const [otpVerificationResult, setOtpVerificationResult] = useState<any>(null);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  // IP Diagnostics State
  const [ipData, setIpData] = useState<any>(null);
  const [isLoadingIp, setIsLoadingIp] = useState(false);

  useEffect(() => {
    if (openDltModal) {
      loadIpDiagnostics();
    }
  }, [openDltModal]);

  const loadIpDiagnostics = async () => {
    setIsLoadingIp(true);
    try {
      const data = await getSmsIpDiagnostics();
      setIpData(data);
    } catch {
      // ignore
    } finally {
      setIsLoadingIp(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!openDltModal) return null;

  const handleTestDispatch = async () => {
    setIsSending(true);
    setDispatchedInfo(null);

    const res = await dispatchDltSms({
      mobileNumber: phoneNumber,
      templateId: selectedTemplate.templateId,
      headerId: selectedTemplate.headerId,
      variables: [userProfile?.name || 'Vasu', '748291', '10 mins'],
    });

    setIsSending(false);
    setDispatchedInfo(res);
    addNotification(
      'DLT SMS Dispatched',
      `Sent ${selectedTemplate.templateName} to ${phoneNumber} via Jio DLT Header [${selectedTemplate.headerId}].`,
      'discount'
    );
  };

  const handleSendTestOtp = async () => {
    setIsSending(true);
    setOtpVerificationResult(null);
    setDispatchedOtp(null);

    const res = await sendSmsOtp({
      phone: otpPhone,
      purpose: 'user_phone_verification',
    });

    setIsSending(false);
    if (res?.success) {
      setDispatchedOtp(res.otp || null);
      if (res.otp) {
        setInputOtp(res.otp); // Pre-fill for instant test convenience
      }
      addNotification(
        'OTP Dispatched',
        `OTP dispatched to +91 ${res.phone} via Jio DLT Header [${res.header}].`,
        'payment'
      );
    }
  };

  const handleVerifyOtp = async () => {
    if (!inputOtp || inputOtp.length !== 6) return;
    setIsVerifyingOtp(true);
    const res = await verifySmsOtp({
      phone: otpPhone,
      otp: inputOtp,
    });
    setIsVerifyingOtp(false);
    setOtpVerificationResult(res);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs">
      <div className="bg-white dark:bg-stone-900 rounded-3xl w-full max-w-3xl max-h-[94vh] shadow-2xl border border-amber-300 dark:border-stone-700 flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-white/20">
              <ShieldCheck className="w-5 h-5 text-amber-200" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base leading-tight">
                  TRAI Jio DLT & MSG91 Telecom Gateway
                </h3>
                <span className="text-[10px] bg-emerald-500/30 border border-emerald-300/40 text-emerald-100 font-bold px-2 py-0.5 rounded-full">
                  LIVE DEPLOYED
                </span>
              </div>
              <p className="text-[11px] text-amber-100">
                Official Telecom Entity: {DLT_CONFIG.entityName} • Approved Header: {DLT_CONFIG.primaryHeader}
              </p>
            </div>
          </div>

          <button
            onClick={() => setOpenDltModal(false)}
            className="p-1.5 rounded-full hover:bg-white/20 text-white cursor-pointer transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-Nav Tabs */}
        <div className="flex border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 px-4 pt-2 gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('templates')}
            className={`px-3 py-2 text-xs font-bold rounded-t-xl transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'templates'
                ? 'bg-white dark:bg-stone-900 text-orange-600 dark:text-orange-400 border-t-2 border-orange-500 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>DLT Templates & Entity ({DLT_TEMPLATES.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('test-otp')}
            className={`px-3 py-2 text-xs font-bold rounded-t-xl transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'test-otp'
                ? 'bg-white dark:bg-stone-900 text-orange-600 dark:text-orange-400 border-t-2 border-orange-500 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Live OTP Messenger Test</span>
          </button>

          <button
            onClick={() => setActiveTab('diagnostics')}
            className={`px-3 py-2 text-xs font-bold rounded-t-xl transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'diagnostics'
                ? 'bg-white dark:bg-stone-900 text-orange-600 dark:text-orange-400 border-t-2 border-orange-500 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>MSG91 & IP Whitelisting</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs text-stone-700 dark:text-stone-300">
          {/* Registered Entity Information Banner */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-amber-500/20">
              <span className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                <Building className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                <span>Reliance Jio DLT Registered Entity Certificate</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[10px] flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                JIO TRUECONNECT ACTIVE
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-[11px]">
              <div className="bg-white/70 dark:bg-stone-800/80 p-2.5 rounded-xl border border-stone-200 dark:border-stone-700">
                <span className="text-stone-400 block text-[10px] uppercase">Principal Entity (PE) ID:</span>
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                    {DLT_CONFIG.principalEntityId}
                  </span>
                  <button
                    onClick={() => copyToClipboard(DLT_CONFIG.principalEntityId, 'pe_id')}
                    className="p-1 hover:bg-stone-100 dark:hover:bg-stone-700 rounded text-stone-500"
                    title="Copy PE ID"
                  >
                    {copiedId === 'pe_id' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>

              <div className="bg-white/70 dark:bg-stone-800/80 p-2.5 rounded-xl border border-stone-200 dark:border-stone-700">
                <span className="text-stone-400 block text-[10px] uppercase">Registered Entity Name:</span>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900 dark:text-stone-100">{DLT_CONFIG.entityName}</span>
                  <button
                    onClick={() => copyToClipboard(DLT_CONFIG.entityName, 'entity_name')}
                    className="p-1 hover:bg-stone-100 dark:hover:bg-stone-700 rounded text-stone-500"
                    title="Copy Entity Name"
                  >
                    {copiedId === 'entity_name' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>

              <div className="bg-white/70 dark:bg-stone-800/80 p-2.5 rounded-xl border border-stone-200 dark:border-stone-700">
                <span className="text-stone-400 block text-[10px] uppercase">Approved Sender ID (Header):</span>
                <div className="flex items-center justify-between">
                  <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-sm">
                    {DLT_CONFIG.primaryHeader}
                  </span>
                  <button
                    onClick={() => copyToClipboard(DLT_CONFIG.primaryHeader, 'header')}
                    className="p-1 hover:bg-stone-100 dark:hover:bg-stone-700 rounded text-stone-500"
                    title="Copy Header"
                  >
                    {copiedId === 'header' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>

              <div className="bg-white/70 dark:bg-stone-800/80 p-2.5 rounded-xl border border-stone-200 dark:border-stone-700">
                <span className="text-stone-400 block text-[10px] uppercase">Jio DLT Approved OTP Template:</span>
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-stone-800 dark:text-stone-200">
                    {DLT_CONFIG.jioDltConfig.approvedTemplateId}
                  </span>
                  <button
                    onClick={() => copyToClipboard(DLT_CONFIG.jioDltConfig.approvedTemplateId, 'jio_tmpl')}
                    className="p-1 hover:bg-stone-100 dark:hover:bg-stone-700 rounded text-stone-500"
                    title="Copy Jio Template ID"
                  >
                    {copiedId === 'jio_tmpl' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>

              <div className="bg-white/70 dark:bg-stone-800/80 p-2.5 rounded-xl border border-stone-200 dark:border-stone-700">
                <span className="text-stone-400 block text-[10px] uppercase">MSG91 v5 OTP Template ID:</span>
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-stone-800 dark:text-stone-200">
                    {DLT_CONFIG.msg91Config.templateId}
                  </span>
                  <button
                    onClick={() => copyToClipboard(DLT_CONFIG.msg91Config.templateId, 'msg91_tmpl')}
                    className="p-1 hover:bg-stone-100 dark:hover:bg-stone-700 rounded text-stone-500"
                    title="Copy MSG91 Template ID"
                  >
                    {copiedId === 'msg91_tmpl' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>

              <div className="bg-white/70 dark:bg-stone-800/80 p-2.5 rounded-xl border border-stone-200 dark:border-stone-700">
                <span className="text-stone-400 block text-[10px] uppercase">Helpline & Reg Address:</span>
                <span className="text-stone-700 dark:text-stone-300 font-semibold block truncate">
                  +91 {DLT_CONFIG.contactNumber} • Kolkata - 700015
                </span>
              </div>
            </div>

            {/* Quick Portal Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-2 border-t border-amber-500/20 text-[11px]">
              <span className="font-semibold text-stone-600 dark:text-stone-400">External Portals:</span>
              <a
                href={DLT_CONFIG.jioDltConfig.portalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-600/10 hover:bg-orange-600/20 text-orange-700 dark:text-orange-300 font-semibold border border-orange-500/30 transition"
              >
                <span>Jio DLT TrueConnect Portal</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href={DLT_CONFIG.msg91Config.portalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-500/30 transition"
              >
                <span>MSG91 Dashboard</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* TAB 1: Approved DLT Templates */}
          {activeTab === 'templates' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wide text-xs">
                  Approved Jio DLT SMS Templates (Sender: {DLT_CONFIG.primaryHeader})
                </h4>
                <span className="text-[11px] text-stone-500">
                  Click a template to test dispatch
                </span>
              </div>

              <div className="space-y-2.5">
                {DLT_TEMPLATES.map((tmpl) => (
                  <div
                    key={tmpl.templateId}
                    onClick={() => setSelectedTemplate(tmpl)}
                    className={`p-3.5 rounded-2xl border transition cursor-pointer ${
                      selectedTemplate.templateId === tmpl.templateId
                        ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-950/30 shadow-xs'
                        : 'border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5 flex-wrap gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-900 dark:text-stone-100">
                          {tmpl.templateName}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 text-[10px] font-semibold">
                          Header: {tmpl.headerId}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[10px] font-semibold">
                          {tmpl.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(tmpl.templateId, `tid_${tmpl.templateId}`);
                          }}
                          className="px-2 py-1 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded text-[10px] font-mono font-bold flex items-center gap-1 text-stone-700 dark:text-stone-300"
                        >
                          {copiedId === `tid_${tmpl.templateId}` ? (
                            <Check className="w-2.5 h-2.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-2.5 h-2.5" />
                          )}
                          <span>ID: {tmpl.templateId}</span>
                        </button>
                      </div>
                    </div>

                    <p className="text-[11px] text-stone-600 dark:text-stone-300 font-mono bg-white dark:bg-stone-950 p-2.5 rounded-xl border border-stone-200 dark:border-stone-800 leading-relaxed">
                      {tmpl.content}
                    </p>

                    {tmpl.variablesDesc && (
                      <div className="mt-1.5 text-[10px] text-stone-400 italic">
                        Variables: {tmpl.variablesDesc}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Template Dispatcher Card */}
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-3">
                <h4 className="font-bold text-stone-900 dark:text-stone-100 flex items-center justify-between">
                  <span>Send Selected Template via DLT Gateway ({selectedTemplate.headerId})</span>
                  <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400">
                    Template ID: {selectedTemplate.templateId}
                  </span>
                </h4>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Enter 10-digit mobile number"
                    className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-xs outline-hidden focus:border-orange-500"
                  />
                  <button
                    onClick={handleTestDispatch}
                    disabled={isSending}
                    className="py-2 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-xs transition"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSending ? 'Sending via Jio DLT...' : 'Send Live DLT SMS'}</span>
                  </button>
                </div>

                {dispatchedInfo && (
                  <div className="p-3 bg-white dark:bg-stone-900 rounded-xl border border-emerald-400 text-emerald-700 dark:text-emerald-300 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>DLT Delivery Status: {dispatchedInfo.deliveryStatus}</span>
                    </div>
                    <div className="text-[10px] text-stone-500 dark:text-stone-400 font-mono">
                      Message ID: {dispatchedInfo.messageId} • Header: {dispatchedInfo.dltHeader} • Entity: {DLT_CONFIG.entityName}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: Live OTP Verification Test */}
          {activeTab === 'test-otp' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5 text-xs uppercase">
                    <Radio className="w-4 h-4 text-emerald-600" />
                    <span>Live 6-Digit OTP Dispatch Test</span>
                  </h4>
                  <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-300 font-bold bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded">
                    Header: TWRSHI (Template: _TWLRSISIGNUPOTP)
                  </span>
                </div>

                <p className="text-[11px] text-stone-600 dark:text-stone-400 leading-relaxed">
                  Trigger a live OTP code using Jio DLT approved template. The backend routes the dispatch through MSG91 v5 OTP API when configured or simulates instant live telecom delivery.
                </p>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-2 text-stone-400 font-semibold text-xs">+91</span>
                    <input
                      type="tel"
                      value={otpPhone}
                      onChange={(e) => setOtpPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="9831049814"
                      className="w-full pl-10 pr-3 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-xs outline-hidden focus:border-emerald-500"
                    />
                  </div>
                  <button
                    onClick={handleSendTestOtp}
                    disabled={isSending || otpPhone.length < 10}
                    className="py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 transition"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSending ? 'Dispatching...' : 'Dispatch 6-Digit OTP'}</span>
                  </button>
                </div>

                {dispatchedOtp && (
                  <div className="p-3 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-stone-700 dark:text-stone-300">
                        Generated OTP Code (for testing verification):
                      </span>
                      <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-sm tracking-wider">
                        {dispatchedOtp}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        maxLength={6}
                        value={inputOtp}
                        onChange={(e) => setInputOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="Enter 6-digit OTP"
                        className="flex-1 px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-center font-mono font-bold text-sm tracking-widest outline-hidden"
                      />
                      <button
                        onClick={handleVerifyOtp}
                        disabled={isVerifyingOtp || inputOtp.length !== 6}
                        className="py-2 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{isVerifyingOtp ? 'Verifying...' : 'Verify OTP'}</span>
                      </button>
                    </div>

                    {otpVerificationResult && (
                      <div
                        className={`p-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 ${
                          otpVerificationResult.verified
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}
                      >
                        {otpVerificationResult.verified ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>{otpVerificationResult.message}</span>
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="w-4 h-4 text-rose-600" />
                            <span>{otpVerificationResult.message}</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: MSG91 & IP Whitelisting Diagnostics */}
          {activeTab === 'diagnostics' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5 text-xs uppercase">
                    <Server className="w-4 h-4 text-blue-500" />
                    <span>Container Outbound Public IP & MSG91 Whitelisting</span>
                  </h4>
                  <button
                    onClick={loadIpDiagnostics}
                    disabled={isLoadingIp}
                    className="p-1 text-stone-500 hover:text-stone-900 cursor-pointer"
                    title="Refresh IP"
                  >
                    <RotateCw className={`w-3.5 h-3.5 ${isLoadingIp ? 'animate-spin' : ''}`} />
                  </button>
                </div>

                <p className="text-[11px] text-stone-600 dark:text-stone-400 leading-relaxed">
                  MSG91 requires servers calling its API to be whitelisted under <span className="font-mono font-bold text-orange-600">IP Security</span>. If MSG91 returns HTTP 418, add this outbound IP address to your MSG91 Authkey.
                </p>

                <div className="p-3 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-stone-400 block uppercase">Current Container Outbound IP:</span>
                    <span className="font-mono text-sm font-black text-amber-600 dark:text-amber-400">
                      {ipData?.outboundIp || 'Checking...'}
                    </span>
                  </div>
                  {ipData?.outboundIp && ipData.outboundIp !== 'Unknown' && (
                    <button
                      onClick={() => copyToClipboard(ipData.outboundIp, 'outbound_ip')}
                      className="px-2.5 py-1.5 rounded-lg bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 font-bold text-xs flex items-center gap-1 cursor-pointer"
                    >
                      {copiedId === 'outbound_ip' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copy IP</span>
                    </button>
                  )}
                </div>

                <div className="space-y-2 text-[11px] text-stone-600 dark:text-stone-400 bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">
                  <span className="font-bold text-stone-900 dark:text-stone-100 block">
                    How to Whitelist in MSG91 (Under 2 Minutes):
                  </span>
                  <ol className="list-decimal pl-4 space-y-1">
                    <li>Log in to <a href="https://control.msg91.com" target="_blank" rel="noopener noreferrer" className="text-orange-600 underline font-semibold">control.msg91.com</a>.</li>
                    <li>Go to <strong>Authkey</strong> in your account profile.</li>
                    <li>Click <strong>Actions → IP Security</strong> on your active key.</li>
                    <li>Paste the Outbound IP shown above, or toggle IP restriction off for testing.</li>
                  </ol>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-stone-50 dark:bg-stone-950 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-[11px] text-stone-500 px-5 shrink-0">
          <span>Telecom Operator: Reliance Jio Infocomm Ltd • PE: 1201171886368224321 • Header ID: 1205174948652740996</span>
          <button
            onClick={() => setOpenDltModal(false)}
            className="px-4 py-1.5 rounded-xl bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold cursor-pointer transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
