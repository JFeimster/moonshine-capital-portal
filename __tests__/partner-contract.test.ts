import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  APPROVAL_STATUSES,
  FUNDING_AGENT_SOURCE_FORMS,
  NOTION_PARTNER_PROPERTIES,
  PARTNER_FIELD_GROUPS,
  PROFILE_STATUSES,
} from '../lib/partner-contract';

describe('canonical partner contract', () => {
  it('matches checked-in broker lifecycle schema enums', () => {
    const schema = JSON.parse(
      readFileSync(join(process.cwd(), 'data/schemas/broker-profile.schema.json'), 'utf8'),
    );

    expect(schema.properties.approvalStatus.enum).toEqual([...APPROVAL_STATUSES]);
    expect(schema.properties.profileStatus.enum).toEqual([...PROFILE_STATUSES]);
  });

  it('uses distinct Join and Profile traceability values', () => {
    expect(FUNDING_AGENT_SOURCE_FORMS).toEqual({
      join: 'funding_agent_join',
      profile: 'funding_agent_profile',
    });
  });

  it('keeps canonical identity separate from lifecycle and public profile fields', () => {
    expect(PARTNER_FIELD_GROUPS.identity).toEqual(['partnerId', 'referralCode', 'slug']);
    expect(PARTNER_FIELD_GROUPS.lifecycle).toEqual(['approvalStatus', 'profileStatus', 'reviewReason']);
    expect(PARTNER_FIELD_GROUPS.publicProfile).not.toContain('approvalStatus');
    expect(PARTNER_FIELD_GROUPS.publicProfile).not.toContain('partnerId');
  });

  it('locks the app-to-Notion lifecycle property names', () => {
    expect(NOTION_PARTNER_PROPERTIES.partnerId).toBe('Partner ID');
    expect(NOTION_PARTNER_PROPERTIES.approvalStatus).toBe('Approval Status');
    expect(NOTION_PARTNER_PROPERTIES.profileStatus).toBe('Profile Status');
    expect(NOTION_PARTNER_PROPERTIES.sourceForm).toBe('Source Form');
    expect(NOTION_PARTNER_PROPERTIES.tallyFormId).toBe('Tally Form ID');
  });
});
