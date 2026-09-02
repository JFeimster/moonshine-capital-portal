import { createHmac, timingSafeEqual } from 'crypto';

export type TallyFormKind =
  | 'funding_agent_join'
  | 'funding_agent_profile'
  | 'funding_intake'
  | 'funding_application';

type TallyField = {
  key?: string;
  label?: string;
  type?: string;
  value?: unknown;
  answer?: unknown;
  questionId?: string;
  uuid?: string;
  options?: Array<Record<string, unknown>>;
};

type TallyPayloadData = {
  formId?: string;
  formName?: string;
  submissionId?: string;
  responseId?: string;
  createdAt?: string;
  fields?: TallyField[];
};

export type TallyWebhookPayload = {
  eventId?: string;
  eventType?: string;
  createdAt?: string;
  data?: TallyPayloadData;
};

type FieldDefinition = {
  questionUuid: string;
  labels: string[];
  choices?: Record<string, string>;
};

type FormMapping = {
  kind: TallyFormKind;
  fields: Record<string, FieldDefinition>;
  hidden: Record<string, string[]>;
};

export type ParsedTallySubmission = {
  eventId: string;
  eventType: string;
  formId: string;
  kind: TallyFormKind;
  submissionId: string;
  createdAt?: string;
  fields: Record<string, unknown>;
  hidden: Record<string, string>;
};

const choice = (entries: Array<[string, string]>) => Object.fromEntries(entries);

export const TALLY_FORM_MAPPINGS: Record<string, FormMapping> = {
  rjM6do: {
    kind: 'funding_agent_join',
    hidden: {
      utm_source: ['b0bfb994-adce-42eb-96c3-244731882519', 'utm_source'],
      utm_medium: ['83402809-88f5-4776-bebb-02c3fa25d0a4', 'utm_medium'],
      utm_campaign: ['ef52ffc5-7717-4613-b5fd-050b9a621d4e', 'utm_campaign'],
      utm_content: ['c00519db-9334-44eb-925b-8b393874ade5', 'utm_content'],
      utm_term: ['b24a3fc0-0746-4af3-851b-5e777dc37a78', 'utm_term'],
      ref: ['d7f3df51-0477-4307-b3f0-1170c5f134b6', 'ref'],
      referral_code: ['0410a379-3550-4ae3-a349-537c243f1286', 'referral_code'],
      source: ['60644aeb-ae19-4ede-bebf-1dc9e0259cd2', 'source'],
      campaign: ['8aaac49b-57e0-4ede-8119-281104441964', 'campaign'],
      originPage: ['ebb4f051-c1f0-45cd-8421-8d9c7d780150', 'originPage']
    },
    fields: {
      fullName: { questionUuid: 'a3213a38-01fe-46a4-8bec-bcad74db0c75', labels: ['Full name'] },
      email: { questionUuid: 'b46a1d1b-815f-457f-a394-05a68a3af832', labels: ['Email'] },
      phoneNumber: { questionUuid: 'c0beb98f-70af-44c8-807f-e578df9908e1', labels: ['Mobile phone'] },
      referralInput: { questionUuid: '9b6fa036-36e1-4ffe-9645-64eaa084c428', labels: ['Referring agent or referral code'] }
    }
  },
  '9qjWEE': {
    kind: 'funding_agent_profile',
    hidden: {
      partner_id: ['3b8367ae-25f2-4c26-8f4c-cd172c03b33a', 'partner_id'],
      referral_code: ['02a50dc3-8dad-442b-ace7-865de36adcdd', 'referral_code'],
      ref: ['e14d841b-d7f5-45a3-8b16-bc56f0eedb14', 'ref'],
      source: ['1b4cb0f2-6c96-4465-83f0-112f2876fb39', 'source'],
      utm_source: ['a35f3099-bfa9-4e4c-b6d6-69f3a633033d', 'utm_source'],
      utm_medium: ['a2849ccb-c043-448d-a434-1f7acd1082ad', 'utm_medium'],
      utm_campaign: ['abcfffd9-b44c-479a-bf04-59074cb407db', 'utm_campaign'],
      originPage: ['2dfd4d50-38f4-4f40-8ee7-83bf53011920', 'originPage']
    },
    fields: {
      email: { questionUuid: '4568b5d4-c9bd-4354-bf26-50b9fb15f1ed', labels: ['Email used when you joined'] },
      displayName: { questionUuid: 'a4b07992-fa5b-41a8-a4ef-adcecafdb77d', labels: ['Public display name'] },
      agencyName: { questionUuid: '61a34229-8252-49ae-a208-f4f26c769cf0', labels: ['Business or agency name'] },
      city: { questionUuid: '3f65cae2-ed9f-446d-8ae4-3bfa18159d01', labels: ['City'] },
      state: { questionUuid: 'f135a26e-660e-4f5a-a281-e5a01283149c', labels: ['State'] },
      shortBio: { questionUuid: '59a4353d-b434-4f86-8355-b06b18f198c3', labels: ['Tell prospective clients a little about yourself'] },
      profileImage: { questionUuid: 'd1c3b597-2648-436a-9c65-6a4efde69160', labels: ['Profile photo'] },
      websiteUrl: { questionUuid: '3bb501bb-d0e8-4394-8b42-179131f9cf2a', labels: ['Website'] },
      bookingUrl: { questionUuid: '3b6c1ced-e622-491d-bffd-23ab7ae5ba08', labels: ['Booking link'] },
      whyChooseYou: { questionUuid: '9aa71100-fcdd-4a80-b122-81a45d17d5f3', labels: ['Why should a client choose you?'] },
      fundingTypes: {
        questionUuid: 'b3dac573-4579-4f89-a908-520259bb1107',
        labels: ['Funding specialties'],
        choices: choice([
          ['fd222163-778f-45fa-95b7-51ab2c7829c2', 'Line of Credit'],
          ['6a105fbd-a40b-4080-aa8f-f36843b8842c', 'Working Capital / MCA'],
          ['e8ffead5-4b82-462c-b7f5-52759c3d8b6d', 'Term Loans'],
          ['482d976e-d6f7-49a3-99fb-8a14c8fdc7ac', 'Equipment Financing'],
          ['9287f7dd-805b-416e-83ea-6ff4c45d8628', 'SBA'],
          ['d6b81969-81b1-4ae7-89fb-4b66d122bf00', 'Invoice Factoring'],
          ['4317b27b-0e09-47ff-828a-10de78c84d0a', 'Revenue-Based Financing'],
          ['54be0147-2fcc-4366-8d5d-e02eecc410c6', 'Commercial Real Estate'],
          ['de230ad0-116d-474d-bb29-884f3fb4a211', 'Business Acquisition Financing']
        ])
      },
      markets: {
        questionUuid: 'e03751cc-0436-4058-ae3b-92bd63ab664f',
        labels: ['Service area'],
        choices: choice([
          ['2c32f33d-0f7c-48d4-b9a4-fed662c2526e', 'Local / regional'],
          ['590a9fb9-c4c7-4ad5-8314-cc45300f328e', 'Statewide'],
          ['cde8fcab-6322-4491-8d83-e84973db0efe', 'Nationwide'],
          ['0762dff7-090a-4e0f-9643-0460e9662a79', 'Remote / online']
        ])
      },
      primaryCtaLabel: {
        questionUuid: 'f3845ef5-a7d6-407f-93c2-19d553785fc3',
        labels: ['Primary profile CTA label'],
        choices: choice([
          ['f7f86dfb-6ba5-4b50-ab5d-5309d950523c', 'Apply for Funding'],
          ['50f7efc5-fd91-4b2d-9f7a-5e7c1502c31c', 'Book a Call'],
          ['824019b3-0611-4ca1-ac5a-3eeffab74247', 'Connect With Me'],
          ['ef17f442-44b9-4860-97ab-5aac4aae1e2c', 'Visit My Website']
        ])
      },
      primaryCtaLink: { questionUuid: '86e13e68-5872-4338-9ea6-3c6c86413ed2', labels: ['Primary profile CTA link'] },
      industries: {
        questionUuid: 'ee6557d6-c0bc-419e-94cf-0b34c0222b55',
        labels: ['Who do you primarily work with?'],
        choices: choice([
          ['fc7d1eee-6a7f-4834-897f-32964626aece', 'Local small businesses'],
          ['b303faea-9778-4e1d-957b-b13089f0cda9', 'Ecommerce / online sellers'],
          ['d65831cb-4271-4709-94d5-a2fcf1082cb5', 'Real estate investors / professionals'],
          ['0fd11377-52e4-49ff-99fc-4b27af20c365', 'Professional services'],
          ['5910d5e3-0865-4c57-90b0-bf9f6c251cf9', 'Restaurants / hospitality'],
          ['d5d37a3b-08d1-4306-94c3-a5d30834d071', 'Contractors / trades'],
          ['1d639518-6f46-4e53-b44d-45c386e961a6', 'Startups / entrepreneurs'],
          ['a32c7204-a9f7-4190-b7fe-c61d85eeeed2', 'Other']
        ])
      }
    }
  },
  dWvEqN: {
    kind: 'funding_intake',
    hidden: {
      risk_level: ['41865042-0b1f-4bb7-8745-9970e9aba0e0', 'risk_level'],
      estimated_funding_gap: ['2ab242e3-4cd1-48e9-980a-c76c0e232f98', 'estimated_funding_gap'],
      current_cash_balance: ['1d7c96dd-75ea-4c2b-bf32-97599fd176c5', 'current_cash_balance'],
      projected_cash_low_point: ['7f2cbdf7-73e1-4ce1-9fd0-bb57b40ac4d2', 'projected_cash_low_point'],
      projected_cash_low_point_week: ['7e9ce093-0e98-4d28-8d9d-7aa27775ff65', 'projected_cash_low_point_week'],
      suggested_working_capital_range_low: ['a87f0380-2cde-4281-b2fd-9789ce84528e', 'suggested_working_capital_range_low'],
      suggested_working_capital_range_high: ['210464db-7a48-471c-ac77-1f976b85397a', 'suggested_working_capital_range_high'],
      recommended_next_step: ['d2bb41e6-cee9-4f92-bb74-2ba282e6de38', 'recommended_next_step'],
      source: ['bf2beb53-a8dc-415b-90aa-c5b2e36c7149', 'source'],
      referral_partner: ['7dd85257-05ae-4e7b-b1c8-80806cba94bc', 'referral_partner'],
      session_id: ['51076086-b33b-4521-9e19-5cbe014f3049', 'session_id'],
      utm_source: ['f32f3fad-05fe-42c4-b1c5-7f9b50ef21b2', 'utm_source'],
      utm_medium: ['b4af53b1-2c2f-41a3-8544-b1e825990e7d', 'utm_medium'],
      utm_campaign: ['cf7a6afa-b91e-4ab7-bf3d-3cdaae570db3', 'utm_campaign'],
      utm_content: ['0d0bc9a0-d35f-4d0d-9d23-c462f0ce9873', 'utm_content'],
      partner_id: ['33ce0ad7-1dce-479d-99aa-fd33be0c6c2d', 'partner_id'],
      referral_code: ['2daf365f-44a8-497f-8624-c1e633b7e268', 'referral_code'],
      campaign: ['5ed16810-248d-409c-ba56-271fc17d2a97', 'campaign'],
      originPage: ['4f87c503-279b-4e91-8b5b-786be552d5e9', 'originPage']
    },
    fields: {
      requestedAmount: { questionUuid: '3d553258-4fca-4765-a8eb-455876f75e70', labels: ['How much funding do you need?'] },
      businessName: { questionUuid: '610cfff5-b10b-45f3-be29-f0282884c413', labels: ['Business name'] },
      businessUrl: { questionUuid: 'd0d62bdc-adb3-481b-8442-933d9d64ab73', labels: ['Business URL'] },
      timeInBusiness: { questionUuid: 'd18043fe-954e-4832-8c24-9997ecf36951', labels: ['Time in Business'] },
      averageMonthlyRevenue: { questionUuid: '487c4ab5-791a-41f9-9fc6-8239d24f1375', labels: ['Average monthly revenue / bank deposits over the last 3 months'] },
      bankAccountOwnership: { questionUuid: '5962281e-f520-4374-86f2-6a8c22384319', labels: ['Is the business bank account in a personal name or business name?'] },
      firstName: { questionUuid: '333605ed-6542-4ae1-96db-bfe95d38888e', labels: ['First name'] },
      lastName: { questionUuid: '9ef8671c-d154-44b3-85c3-c2797adef725', labels: ['Last name'] },
      email: { questionUuid: '9a7a2801-f406-4343-a310-ab27ed1fa63b', labels: ['Email address'] },
      phoneNumber: { questionUuid: 'c8773a2e-c921-4992-9e82-e01dbb769e36', labels: ['Phone number'] }
    }
  },
  w4R2Ad: {
    kind: 'funding_application',
    hidden: {
      source: ['0db3cae2-ead1-42e5-b96f-efbe0c600150', 'source'],
      referral_partner: ['20b3c5ee-9886-4a57-93fa-114f52fcb6e1', 'referral_partner'],
      partner_id: ['6ef96c87-e957-4525-8fe4-7588d9184762', 'partner_id'],
      referral_code: ['d6e17201-6759-4d5d-875f-dcb2123f68f4', 'referral_code'],
      utm_source: ['5cc59f82-15ed-4f48-9281-bf184f6878e2', 'utm_source'],
      utm_medium: ['20ce2cb5-38bf-40b9-957e-ced09d27220b', 'utm_medium'],
      utm_campaign: ['8d9dc1e0-3f20-4edb-95f9-900fffbac65f', 'utm_campaign'],
      utm_content: ['5805e0e9-66d3-4cf8-a640-a81d562cc2ff', 'utm_content'],
      campaign: ['0251dcea-8268-4910-b64e-5f15e99cbb72', 'campaign'],
      session_id: ['327980ff-75d9-4174-bb5d-d81bc5cc109d', 'session_id'],
      originPage: ['1bbebf48-daaf-4e4f-b080-461c1b6bcfd7', 'originPage']
    },
    fields: {
      requestedAmountRangeRaw: {
        questionUuid: 'd35989c8-f883-4513-b9a4-a6c06fd9b0af',
        labels: ['Desired amount of funding?'],
        choices: choice([
          ['d9458320-0c3a-43ab-b457-b8f3e5cb0916', '$0 - $25,000'],
          ['4f9a8c55-47be-47e7-902d-54c201bcde10', '$25,001 - $49,999'],
          ['9da1732e-d0fc-4538-977b-9250b1b8dfd5', '$50,000 - $99,999'],
          ['cf7737fa-5107-40f7-8c97-46649a729fa9', '$100,000 - $149,999'],
          ['2bf0a620-9b1b-4cc1-9d79-bfdee7e2c8de', '$150,000 - $199,999'],
          ['858c7a3f-7efc-41f9-bea0-f8f2e90eedb3', '$200,000 - $299,999'],
          ['25b8ed0a-c4ea-4ad2-97ab-9f9914b501e5', '$300,000 - $599,999'],
          ['cb829732-0cc5-4966-9613-a23b909a9b79', '$600,000 - $1,000,000'],
          ['02b88137-f790-416d-bbd1-6266513dd20d', '$1M - $5M'],
          ['d354010c-6808-47d2-aa6a-7e9edcaeecda', '$5M+']
        ])
      },
      firstName: { questionUuid: '651cbff8-9e8f-4114-b020-94c0df5bcef8', labels: ['What is your first name?'] },
      lastName: { questionUuid: 'c43e6de2-4ec3-4e56-ad9b-846fb1a0cdc6', labels: ['What is your last name?'] },
      phoneNumber: { questionUuid: '98a1c743-7b5f-4386-8652-f981c07d5d2c', labels: ['Phone number'] },
      email: { questionUuid: '6c8665cf-8bb3-4795-b785-5f3e146ff960', labels: ['Primary email'] }
    }
  }
};

function cleanString(value: unknown): string {
  if (value === undefined || value === null) return '';
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (Array.isArray(value)) return value.map(cleanString).filter(Boolean).join(', ');
  if (typeof value === 'object') {
    const objectValue = value as Record<string, unknown>;
    for (const key of ['url', 'value', 'label', 'text', 'name', 'id']) {
      const candidate = cleanString(objectValue[key]);
      if (candidate) return candidate;
    }
  }
  return '';
}

function safeCompare(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

export function verifyTallyWebhookSignature(rawBody: string, signatureHeader: string | null): boolean {
  const secret = process.env.TALLY_SIGNING_SECRET || process.env.TALLY_WEBHOOK_SECRET;
  if (!secret || !signatureHeader) return false;

  const digest = createHmac('sha256', secret).update(rawBody).digest();
  const received = signatureHeader.trim().replace(/^sha256=/i, '');
  return safeCompare(digest.toString('base64'), received) || safeCompare(digest.toString('hex'), received);
}

function fieldIdentity(field: TallyField): string[] {
  return [field.key, field.questionId, field.uuid].map(cleanString).filter(Boolean);
}

function normalizeLabel(value: string): string {
  return value.trim().toLowerCase();
}

function findField(fields: TallyField[], definition: FieldDefinition): TallyField | undefined {
  const labels = new Set(definition.labels.map(normalizeLabel));
  return fields.find((field) =>
    fieldIdentity(field).includes(definition.questionUuid) ||
    (field.label ? labels.has(normalizeLabel(field.label)) : false)
  );
}

function decodeChoice(value: unknown, choices?: Record<string, string>): unknown {
  if (!choices) return value;
  if (Array.isArray(value)) return value.map((item) => decodeChoice(item, choices));
  if (value && typeof value === 'object') {
    const objectValue = value as Record<string, unknown>;
    const candidate = cleanString(objectValue.id || objectValue.value || objectValue.key || objectValue.label || objectValue.name);
    return choices[candidate] || candidate || value;
  }
  const candidate = cleanString(value);
  return choices[candidate] || candidate;
}

function fieldValue(field: TallyField | undefined, choices?: Record<string, string>): unknown {
  if (!field) return undefined;
  const raw = field.value !== undefined ? field.value : field.answer;
  return decodeChoice(raw, choices);
}

function hiddenValue(fields: TallyField[], aliases: string[]): string {
  const aliasSet = new Set(aliases.map(normalizeLabel));
  const match = fields.find((field) =>
    fieldIdentity(field).some((identity) => aliasSet.has(normalizeLabel(identity))) ||
    (field.label ? aliasSet.has(normalizeLabel(field.label)) : false)
  );
  return cleanString(match?.value !== undefined ? match.value : match?.answer);
}

export function parseTallySubmission(payload: TallyWebhookPayload): ParsedTallySubmission {
  const formId = cleanString(payload.data?.formId);
  const mapping = TALLY_FORM_MAPPINGS[formId];
  if (!formId || !mapping) throw new Error('Unsupported or missing Tally formId');

  const rawFields = Array.isArray(payload.data?.fields) ? payload.data?.fields || [] : [];
  const fields: Record<string, unknown> = {};
  for (const [name, definition] of Object.entries(mapping.fields)) {
    fields[name] = fieldValue(findField(rawFields, definition), definition.choices);
  }

  const hidden: Record<string, string> = {};
  for (const [name, aliases] of Object.entries(mapping.hidden)) {
    hidden[name] = hiddenValue(rawFields, aliases);
  }

  const eventId = cleanString(payload.eventId) || cleanString(payload.data?.responseId) || cleanString(payload.data?.submissionId);
  const submissionId = cleanString(payload.data?.submissionId) || cleanString(payload.data?.responseId) || eventId;
  if (!submissionId) throw new Error('Missing Tally submission identifier');

  return {
    eventId: eventId || submissionId,
    eventType: cleanString(payload.eventType) || 'FORM_RESPONSE',
    formId,
    kind: mapping.kind,
    submissionId,
    createdAt: cleanString(payload.data?.createdAt || payload.createdAt) || undefined,
    fields,
    hidden
  };
}

export function asString(value: unknown): string {
  return cleanString(value);
}

export function asStringList(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(cleanString).filter(Boolean);
  const single = cleanString(value);
  return single ? single.split(',').map((item) => item.trim()).filter(Boolean) : [];
}

export function firstUrl(value: unknown): string {
  if (Array.isArray(value)) {
    for (const item of value) {
      const candidate = firstUrl(item);
      if (candidate) return candidate;
    }
    return '';
  }
  if (value && typeof value === 'object') {
    const objectValue = value as Record<string, unknown>;
    for (const key of ['url', 'src', 'downloadUrl', 'value']) {
      const candidate = firstUrl(objectValue[key]);
      if (candidate) return candidate;
    }
    return '';
  }
  const candidate = cleanString(value);
  return /^https?:\/\//i.test(candidate) ? candidate : '';
}
