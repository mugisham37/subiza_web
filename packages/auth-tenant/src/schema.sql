-- Prompt 03 schema. Composite FKs on (tenant_id, parent_id).
-- Application role is neither table owner nor BYPASSRLS.
-- audit_events: INSERT + SELECT only. No UPDATE. No DELETE. 7-year retention.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE people (
  id          text PRIMARY KEY,
  e164        text NOT NULL UNIQUE,
  name        text NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE tenants (
  id              text PRIMARY KEY,
  name            text NOT NULL,
  type            text NOT NULL,
  owner_person_id text NOT NULL REFERENCES people(id),
  language        text NOT NULL,
  created_at      timestamptz NOT NULL DEFAULT now(),
  last_active_at  timestamptz NOT NULL DEFAULT now(),
  recycled_suspect boolean NOT NULL DEFAULT false,
  UNIQUE (id)
);

CREATE UNIQUE INDEX tenants_tenant_id ON tenants (id);

CREATE TABLE members (
  id         text PRIMARY KEY,
  tenant_id  text NOT NULL REFERENCES tenants(id),
  person_id  text NOT NULL REFERENCES people(id),
  role       text NOT NULL,
  removed_at timestamptz,
  UNIQUE (tenant_id, id),
  UNIQUE (tenant_id, person_id)
);

CREATE TABLE verifications (
  id           text PRIMARY KEY,
  e164         text NOT NULL,
  hmac         text NOT NULL,
  channel      text NOT NULL,
  created_at   timestamptz NOT NULL,
  expires_at   timestamptz NOT NULL,
  consumed_at  timestamptz,
  attempts     integer NOT NULL DEFAULT 0,
  sms_sends    integer NOT NULL DEFAULT 0,
  sms_failures integer NOT NULL DEFAULT 0,
  voice_sends  integer NOT NULL DEFAULT 0
);

CREATE TABLE sessions (
  id           text PRIMARY KEY,
  person_id    text NOT NULL REFERENCES people(id),
  tenant_id    text REFERENCES tenants(id),
  member_id    text,
  strength     text NOT NULL,
  recovered_at timestamptz,
  created_at   timestamptz NOT NULL,
  expires_at   timestamptz NOT NULL,
  FOREIGN KEY (tenant_id, member_id) REFERENCES members (tenant_id, id)
);

CREATE TABLE consent_records (
  id           text PRIMARY KEY,
  tenant_id    text NOT NULL,
  person_id    text NOT NULL,
  purpose      text NOT NULL,
  text_version text NOT NULL,
  language     text NOT NULL,
  granted_at   timestamptz NOT NULL,
  ip           text NOT NULL,
  action       text NOT NULL,
  revoked_at   timestamptz,
  UNIQUE (tenant_id, id),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);

CREATE TABLE recovery_requests (
  id                  text PRIMARY KEY,
  e164                text NOT NULL,
  kind                text NOT NULL,
  created_at          timestamptz NOT NULL,
  earliest_execute_at timestamptz NOT NULL,
  evidence_tier       text NOT NULL,
  status              text NOT NULL,
  cooldown_hours      integer NOT NULL
);

CREATE TABLE passkey_credentials (
  id         text PRIMARY KEY,
  person_id  text NOT NULL REFERENCES people(id),
  public_key text NOT NULL,
  created_at timestamptz NOT NULL
);

CREATE TABLE audit_events (
  id          text PRIMARY KEY,
  at          timestamptz NOT NULL,
  tenant_id   text,
  actor_type  text NOT NULL,
  actor_id    text NOT NULL,
  on_behalf_of text,
  action      text NOT NULL,
  capability  text,
  outcome     text NOT NULL,
  before      jsonb,
  after       jsonb,
  reason      text
);

ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE consent_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON tenants
  USING (id = current_setting('app.tenant_id', true));

CREATE POLICY member_isolation ON members
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE POLICY consent_isolation ON consent_records
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE POLICY session_isolation ON sessions
  USING (tenant_id IS NULL OR tenant_id = current_setting('app.tenant_id', true));

-- SET LOCAL app.tenant_id = '<id>'; inside the same transaction as the mutation.
-- Never SET (pooled connections leak tenant context).
-- Application role: GRANT INSERT, SELECT ON audit_events TO subiza_app;
-- REVOKE UPDATE, DELETE ON audit_events FROM subiza_app;
