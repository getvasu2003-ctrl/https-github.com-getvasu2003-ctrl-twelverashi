import { DLTTemplate } from '../types/astrology.ts';

export interface TelecomGatewayConfig {
  telecomOperator: string;
  entityName: string;
  principalEntityId: string;
  registeredAddress: string;
  contactNumber: string;
  supportEmail: string;
  primaryHeader: string;
  telecomHeaders: {
    primary: string;
    transactional: string;
    promotional: string;
    service: string;
  };
  msg91Config: {
    templateId: string;
    senderId: string;
    route: string;
    portalUrl: string;
  };
  jioDltConfig: {
    portalUrl: string;
    operator: string;
    approvedTemplateId: string;
    approvedHeader: string;
    headerRegistrationId: string;
  };
}

export const DLT_CONFIG: TelecomGatewayConfig = {
  telecomOperator: 'Reliance Jio Infocomm Ltd (Jio DLT - TrueConnect)',
  entityName: '12RASHIINFOTECH',
  principalEntityId: '1201171886368224321',
  registeredAddress: 'Laxman Apartment, 3rd Floor, Pulin Khatick Road, Kolkata - 700015, West Bengal, India',
  contactNumber: '9831049814',
  supportEmail: '12rashi.com@gmail.com',
  primaryHeader: 'TWRSHI',
  telecomHeaders: {
    primary: 'TWRSHI',
    transactional: 'TWRSHI',
    promotional: 'GUNE36',
    service: 'TWRSHI',
  },
  msg91Config: {
    templateId: '6935bfc0a6240e24e80be279',
    senderId: 'TWRSHI',
    route: 'v5/otp',
    portalUrl: 'https://control.msg91.com',
  },
  jioDltConfig: {
    portalUrl: 'https://trueconnect.jio.com',
    operator: 'Reliance Jio Infocomm Ltd',
    approvedTemplateId: '6935bfc0a6240e24e80be279',
    approvedHeader: 'TWRSHI',
    headerRegistrationId: '1205174948652740996',
  },
};

export interface DltTemplateExtended extends DLTTemplate {
  msg91TemplateId?: string;
  isApproved?: boolean;
  variablesDesc?: string;
  category?: 'OTP' | 'Consultation' | 'Transit' | 'Remedy' | 'Matrimonial';
}

export const DLT_TEMPLATES: DltTemplateExtended[] = [
  {
    templateId: '6935bfc0a6240e24e80be279',
    templateName: '_TWLRSISIGNUPOTP',
    headerId: 'TWRSHI (ID: 1205174948652740996)',
    type: 'Service Implicit',
    content: 'Dear Customer , Your OTP to login to 12Rashi is ##OTP## .OTP valid for 3 mins. To',
    entityId: DLT_CONFIG.principalEntityId,
    msg91TemplateId: '6935bfc0a6240e24e80be279',
    isApproved: true,
    category: 'OTP',
    variablesDesc: '##OTP## = 6-digit OTP code (Valid for 3 mins)',
  },
  {
    templateId: '1277178992387137267',
    templateName: 'DLT_36GUNE_OTP_VERIFICATION',
    headerId: 'GUNE36',
    type: 'Service Implicit',
    content: 'Your 36GUNE Matrimonial verification code is {#var#}. Valid for 10 minutes. Do not share this OTP with anyone. - 12RASHIINFOTECH',
    entityId: DLT_CONFIG.principalEntityId,
    msg91TemplateId: '6935bfc0a6240e24e80be279',
    isApproved: true,
    category: 'OTP',
    variablesDesc: '{#var#} = 6-digit OTP code',
  },
  {
    templateId: '1207161829038472912',
    templateName: 'DLT_12RASHI_CONSULT_CONNECT',
    headerId: 'GUNE36',
    type: 'Service Implicit',
    content: 'Pranam {#var#}! Your live consultation with {#var#} on 12Rashi is confirmed. Please join within 2 minutes: {#var#}. Helpline: 9831049814 - 12Rashi',
    entityId: DLT_CONFIG.principalEntityId,
    isApproved: true,
    category: 'Consultation',
    variablesDesc: '{#var#} = Client Name, {#var#} = Astrologer Name, {#var#} = Meeting Link',
  },
  {
    templateId: '1207161829038472913',
    templateName: 'DLT_12RASHI_TRANSIT_ALERT',
    headerId: 'RSHINF',
    type: 'Service Explicit',
    content: 'Daily Jyotish Transit Alert: Moon transitions into {#var#} today. Auspicious Shubh Muhurat starts at {#var#}. Check remedies on 12Rashi app now. - 12Rashi',
    entityId: DLT_CONFIG.principalEntityId,
    isApproved: true,
    category: 'Transit',
    variablesDesc: '{#var#} = Rashi Sign, {#var#} = Time Window',
  },
  {
    templateId: '1207161829038472914',
    templateName: 'DLT_12RASHI_SANKALP_CONFIRMED',
    headerId: 'GUNE36',
    type: 'Service Implicit',
    content: 'Namaste {#var#}, your sacred Vedic Pooja Sankalp & Mantra Jaap {#var#} has been consecrated at {#var#}. View your digital certificate on 12Rashi. - 12Rashi Kolkata',
    entityId: DLT_CONFIG.principalEntityId,
    isApproved: true,
    category: 'Remedy',
    variablesDesc: '{#var#} = Devotee Name, {#var#} = Mantra Name, {#var#} = Temple Location',
  },
  {
    templateId: '1277178992387137270',
    templateName: 'DLT_36GUNE_MATCH_INTEREST_ALERT',
    headerId: 'GUNE36',
    type: 'Service Implicit',
    content: 'Namaste! A verified member has expressed interest in your 36GUNE matrimonial biodata. Visit www.36gune.com to view full Kundli. - 12RASHIINFOTECH',
    entityId: DLT_CONFIG.principalEntityId,
    isApproved: true,
    category: 'Matrimonial',
    variablesDesc: 'Direct broadcast notification template',
  },
  {
    templateId: '1277178992387137271',
    templateName: 'DLT_36GUNE_VIP_SUBSCRIPTION_ACTIVE',
    headerId: 'GUNE36',
    type: 'Service Implicit',
    content: 'Congratulations! Your 36GUNE {#var#} VIP membership is active under 12RASHIINFOTECH. Unlock direct verified phone & video chats. - 12RASHIINFOTECH',
    entityId: DLT_CONFIG.principalEntityId,
    isApproved: true,
    category: 'Matrimonial',
    variablesDesc: '{#var#} = Gold / Platinum Tier',
  },
];
