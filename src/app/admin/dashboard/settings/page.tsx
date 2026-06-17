'use client';
import { useState, useEffect, useCallback } from 'react';
import { Icon, type IconName } from '@/components/ui/Icon';
import Topbar from '@/components/admin/layout/Topbar';
import { useLang } from '@/hooks/admin/useLang';
import { useAdminAuthStore } from '@/store/admin/auth.store';
import { adminUsers } from '@/lib/admin/api';

// ── Password strength ──────────────────────────────────────────
function getStrength(pwd: string): { score: number; label: string; color: string } {
  const checks = [/[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/, /.{8}/];
  const score = checks.filter(r => r.test(pwd)).length;
  const map = [
    { label: 'Weak',   color: '#EF4444' },
    { label: 'Fair',   color: '#F59E0B' },
    { label: 'Good',   color: '#F59E0B' },
    { label: 'Strong', color: '#16A34A' },
  ];
  return { score, ...map[Math.max(0, score - 1)] ?? map[0] };
}

function PasswordStrengthBar({ password }: { password: string }) {
  if (!password) return null;
  const { score, label, color } = getStrength(password);
  return (
    <div style={{ marginTop: 6 }}>
      <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} style={{
            flex: 1, height: 3, borderRadius: 2,
            background: i <= score ? color : '#EAECEF',
            transition: 'background 0.2s',
          }} />
        ))}
      </div>
      <span style={{ fontSize: 11, color, fontFamily: 'JetBrains Mono, monospace' }}>{label}</span>
    </div>
  );
}

// ── Shared input component ──────────────────────────────────────
function Field({
  label, type = 'text', value, onChange, placeholder, disabled,
  show, onToggleShow, error,
}: {
  label: string; type?: string; value: string;
  onChange: (v: string) => void; placeholder?: string; disabled?: boolean;
  show?: boolean; onToggleShow?: () => void; error?: string;
}) {
  const isPassword = type === 'password';
  const inputType = isPassword && show ? 'text' : type;
  return (
    <label style={{ display: 'block' }}>
      <div className="mono" style={{ fontSize: 10, color: '#4B5563', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
      <div style={{ position: 'relative' }}>
        <input
          type={inputType}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          style={{
            width: '100%', padding: isPassword ? '11px 42px 11px 14px' : '11px 14px',
            background: disabled ? '#F3F4F6' : '#F7F8FA',
            border: `1px solid ${error ? '#EF4444' : '#EAECEF'}`, borderRadius: 4,
            color: disabled ? '#9097A1' : '#111827', fontFamily: 'inherit', fontSize: 14,
            outline: 'none', boxSizing: 'border-box' as const,
          }}
          onFocus={e => !disabled && (e.currentTarget.style.borderColor = '#2563EB')}
          onBlur={e => !disabled && (e.currentTarget.style.borderColor = error ? '#EF4444' : '#EAECEF')}
        />
        {isPassword && onToggleShow && (
          <button type="button" onClick={onToggleShow} style={{
            position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
            background: 'none', border: 'none', color: '#9097A1', cursor: 'pointer', padding: 0,
          }}>
            {show ? <Icon name="eye" size={15} stroke={1.6} /> : <Icon name="eye" size={15} stroke={1.6} />}
          </button>
        )}
      </div>
      {error && <p style={{ color: '#EF4444', fontSize: 11, marginTop: 4, fontFamily: 'JetBrains Mono, monospace' }}>{error}</p>}
    </label>
  );
}

// ── Toast ───────────────────────────────────────────────────────
function useToast() {
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const show = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };
  return { toast, show };
}

// ── Avatar ──────────────────────────────────────────────────────
const COLORS = ['#2563EB','#16A34A','#60a5fa','#a78bfa','#F59E0B'];
function avatar(name: string) {
  let h = 0; for (const c of name) h = (h * 31 + c.charCodeAt(0)) & 0xffffff;
  return { color: COLORS[Math.abs(h) % COLORS.length], initials: name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() };
}

// ── Modal ───────────────────────────────────────────────────────
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
      <div style={{ background: '#FFFFFF', border: '1px solid #EAECEF', borderRadius: 8, padding: 28, width: '100%', maxWidth: 460, margin: 16, boxShadow: '0 24px 64px rgba(0,0,0,0.7)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#111827' }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#9097A1', cursor: 'pointer', padding: 4 }}>
            <Icon name="x" size={18} stroke={1.6} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────
type Tab = 'account' | 'users';

export default function SettingsPage() {
  const { t } = useLang();
  const { user, setUser } = useAdminAuthStore();
  const { toast, show } = useToast();
  const [tab, setTab] = useState<Tab>('account');

  // Profile state
  const [name, setName]   = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [saving, setSaving] = useState(false);

  // Password state
  const [curPwd, setCurPwd]       = useState('');
  const [newPwd, setNewPwd]       = useState('');
  const [confPwd, setConfPwd]     = useState('');
  const [showCur, setShowCur]     = useState(false);
  const [showNew, setShowNew]     = useState(false);
  const [showConf, setShowConf]   = useState(false);
  const [pwdSaving, setPwdSaving] = useState(false);
  const [pwdErrors, setPwdErrors] = useState<Record<string, string>>({});

  // Admin users state
  const [admins, setAdmins]           = useState<any[]>([]);
  const [loadingAdmins, setLoadingAdmins] = useState(false);
  const [showAddModal, setShowAddModal]   = useState(false);
  const [resetTarget, setResetTarget]     = useState<any | null>(null);
  const [deleteTarget, setDeleteTarget]   = useState<any | null>(null);

  // Add modal fields
  const [addName, setAddName]     = useState('');
  const [addEmail, setAddEmail]   = useState('');
  const [addPwd, setAddPwd]       = useState('');
  const [addConfPwd, setAddConfPwd] = useState('');
  const [addSaving, setAddSaving] = useState(false);
  const [addErrors, setAddErrors] = useState<Record<string, string>>({});

  // Reset modal fields
  const [resetPwd, setResetPwd]   = useState('');
  const [resetConf, setResetConf] = useState('');
  const [resetSaving, setResetSaving] = useState(false);

  useEffect(() => {
    if (user) { setName(user.name); setEmail(user.email); }
  }, [user]);

  const loadAdmins = useCallback(async () => {
    setLoadingAdmins(true);
    try {
      const res = await adminUsers.list();
      if (res.success) setAdmins(res.data);
    } catch { show('Failed to load admins', false); }
    finally { setLoadingAdmins(false); }
  }, []);

  useEffect(() => {
    if (tab === 'users') loadAdmins();
  }, [tab, loadAdmins]);

  // ── Save profile ────────────────────────────────────
  async function handleSaveProfile() {
    setSaving(true);
    try {
      const res = await adminUsers.updateOwnProfile({ name: name.trim(), email: email.trim() });
      if (res.success) {
        if (user) setUser({ ...user, name: res.data.name, email: res.data.email });
        show(t('settings.saved'));
      }
    } catch (e: any) { show(e.response?.data?.message ?? 'Failed to save', false); }
    finally { setSaving(false); }
  }

  // ── Change own password ─────────────────────────────
  async function handleChangePwd() {
    const errs: Record<string, string> = {};
    if (!curPwd) errs.cur = 'Required';
    const { score } = getStrength(newPwd);
    if (score < 4) errs.new = t('settings.pwdWeak');
    if (newPwd !== confPwd) errs.conf = t('settings.pwdMismatch');
    if (Object.keys(errs).length) { setPwdErrors(errs); return; }
    setPwdErrors({});
    setPwdSaving(true);
    try {
      await adminUsers.changeOwnPassword(curPwd, newPwd);
      show(t('settings.saved'));
      setCurPwd(''); setNewPwd(''); setConfPwd('');
    } catch (e: any) { show(e.response?.data?.message ?? 'Failed', false); }
    finally { setPwdSaving(false); }
  }

  // ── Add admin ───────────────────────────────────────
  async function handleAddAdmin() {
    const errs: Record<string, string> = {};
    if (!addName.trim()) errs.name = 'Required';
    if (!addEmail.trim()) errs.email = 'Required';
    const { score } = getStrength(addPwd);
    if (score < 4) errs.pwd = t('settings.pwdWeak');
    if (addPwd !== addConfPwd) errs.conf = t('settings.pwdMismatch');
    if (Object.keys(errs).length) { setAddErrors(errs); return; }
    setAddErrors({});
    setAddSaving(true);
    try {
      await adminUsers.create({ name: addName.trim(), email: addEmail.trim(), password: addPwd });
      show(t('settings.adminCreated'));
      setShowAddModal(false);
      setAddName(''); setAddEmail(''); setAddPwd(''); setAddConfPwd('');
      loadAdmins();
    } catch (e: any) { show(e.response?.data?.message ?? 'Failed', false); }
    finally { setAddSaving(false); }
  }

  // ── Reset password ──────────────────────────────────
  async function handleResetPwd() {
    if (!resetTarget) return;
    const { score } = getStrength(resetPwd);
    if (score < 4 || resetPwd !== resetConf) { show(t('settings.pwdWeak'), false); return; }
    setResetSaving(true);
    try {
      await adminUsers.resetPassword(resetTarget.id, resetPwd);
      show(t('settings.pwdReset'));
      setResetTarget(null); setResetPwd(''); setResetConf('');
    } catch (e: any) { show(e.response?.data?.message ?? 'Failed', false); }
    finally { setResetSaving(false); }
  }

  // ── Delete admin ────────────────────────────────────
  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await adminUsers.delete(deleteTarget.id);
      show(t('settings.adminDeleted'));
      setDeleteTarget(null);
      loadAdmins();
    } catch (e: any) { show(e.response?.data?.message ?? 'Failed', false); }
  }

  const TABS: { key: Tab; icon: IconName; label: string }[] = [
    { key: 'account', icon: 'user',   label: t('settings.myAccount') },
    { key: 'users',   icon: 'shield', label: t('settings.adminUsers') },
  ];

  const btnOrange: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
    padding: '11px 20px', background: '#2563EB', color: '#fff',
    border: 'none', borderRadius: 4, fontSize: 13, fontWeight: 600,
    cursor: 'pointer', fontFamily: 'inherit', transition: 'opacity 0.15s',
  };
  const btnGhost: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
    padding: '9px 16px', background: 'transparent', color: '#4B5563',
    border: '1px solid #EAECEF', borderRadius: 4, fontSize: 13, fontWeight: 500,
    cursor: 'pointer', fontFamily: 'inherit',
  };

  return (
    <div className="flex flex-col">
      <Topbar title={t('settings.title')} />

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: 20, right: 24, zIndex: 100,
          padding: '12px 20px', borderRadius: 6, fontSize: 13, fontWeight: 500,
          background: toast.ok ? 'rgba(52,211,153,0.15)' : 'rgba(251,113,133,0.15)',
          border: `1px solid ${toast.ok ? 'rgba(52,211,153,0.3)' : 'rgba(251,113,133,0.3)'}`,
          color: toast.ok ? '#16A34A' : '#EF4444',
          display: 'flex', alignItems: 'center', gap: 8, backdropFilter: 'blur(8px)',
        }}>
          {toast.ok ? <Icon name="check" size={14} /> : <Icon name="x" size={14} />} {toast.msg}
        </div>
      )}

      <div style={{ padding: 32, display: 'grid', gridTemplateColumns: '200px 1fr', gap: 32, alignItems: 'start' }}>
        {/* Sidebar Tabs */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {TABS.map(({ key, icon, label }) => (
            <button key={key} onClick={() => setTab(key)} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px', borderRadius: 5, textAlign: 'left',
              background: tab === key ? '#F3F4F6' : 'transparent',
              borderLeft: `2px solid ${tab === key ? '#2563EB' : 'transparent'}`,
              border: `1px solid ${tab === key ? '#EAECEF' : 'transparent'}`,
              color: tab === key ? '#111827' : '#4B5563',
              fontSize: 13, fontWeight: tab === key ? 600 : 500,
              cursor: 'pointer', fontFamily: 'inherit',
            }}>
              <Icon name={icon} size={15} stroke={1.6} />
              {label}
            </button>
          ))}
        </nav>

        {/* Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* ── MY ACCOUNT ── */}
          {tab === 'account' && (
            <>
              {/* Profile Card */}
              <div style={{ background: '#FFFFFF', border: '1px solid #EAECEF', borderRadius: 6, padding: 24 }}>
                <div className="mono" style={{ fontSize: 11, color: '#9097A1', marginBottom: 20, textTransform: 'uppercase' }}>
                  {t('settings.profile')}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                  <Field label={t('settings.fullName')} value={name} onChange={setName} />
                  <Field label={t('settings.email')} type="email" value={email} onChange={setEmail} />
                </div>
                <button onClick={handleSaveProfile} disabled={saving} style={{ ...btnOrange, opacity: saving ? 0.6 : 1 }}>
                  {saving ? '…' : t('settings.saveProfile')}
                </button>
              </div>

              {/* Change Password Card */}
              <div style={{ background: '#FFFFFF', border: '1px solid #EAECEF', borderRadius: 6, padding: 24 }}>
                <div className="mono" style={{ fontSize: 11, color: '#9097A1', marginBottom: 20, textTransform: 'uppercase' }}>
                  {t('settings.changePwd')}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
                  <Field label={t('settings.currentPwd')} type="password"
                    value={curPwd} onChange={setCurPwd}
                    show={showCur} onToggleShow={() => setShowCur(v => !v)}
                    error={pwdErrors.cur} />
                  <div>
                    <Field label={t('settings.newPwd')} type="password"
                      value={newPwd} onChange={setNewPwd}
                      show={showNew} onToggleShow={() => setShowNew(v => !v)}
                      error={pwdErrors.new} />
                    <PasswordStrengthBar password={newPwd} />
                  </div>
                  <Field label={t('settings.confirmPwd')} type="password"
                    value={confPwd} onChange={setConfPwd}
                    show={showConf} onToggleShow={() => setShowConf(v => !v)}
                    error={pwdErrors.conf} />
                </div>
                <button onClick={handleChangePwd} disabled={pwdSaving} style={{ ...btnOrange, opacity: pwdSaving ? 0.6 : 1 }}>
                  <Icon name="key" size={14} stroke={1.6} />
                  {pwdSaving ? '…' : t('settings.updatePwd')}
                </button>
              </div>
            </>
          )}

          {/* ── ADMIN USERS ── */}
          {tab === 'users' && (
            <div style={{ background: '#FFFFFF', border: '1px solid #EAECEF', borderRadius: 6, overflow: 'hidden' }}>
              {/* Header */}
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #EAECEF', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div className="mono" style={{ fontSize: 11, color: '#9097A1', textTransform: 'uppercase' }}>
                  {t('settings.adminUsers')}
                </div>
                <button onClick={() => setShowAddModal(true)} style={btnOrange}>
                  <Icon name="plus" size={14} stroke={2} />
                  {t('settings.addAdmin')}
                </button>
              </div>

              {/* Table header */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 120px 100px', padding: '10px 20px', background: '#F3F4F6', borderBottom: '1px solid #EAECEF', gap: 12 }}>
                {['Admin', 'Email', t('settings.joinedLabel'), ''].map((h, i) => (
                  <div key={i} className="mono" style={{ fontSize: 10, color: '#9097A1' }}>{h}</div>
                ))}
              </div>

              {/* Rows */}
              {loadingAdmins ? (
                <div style={{ padding: 32, textAlign: 'center', color: '#9097A1', fontSize: 13 }}>Loading…</div>
              ) : admins.length === 0 ? (
                <div style={{ padding: 32, textAlign: 'center', color: '#9097A1', fontSize: 13 }}>{t('settings.noAdmins')}</div>
              ) : admins.map(a => {
                const { color, initials } = avatar(a.name);
                const isMe = a.id === user?.id;
                const joined = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(a.createdAt));
                return (
                  <div key={a.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 120px 100px', padding: '14px 20px', borderBottom: '1px solid #F3F4F6', alignItems: 'center', gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 16, background: color + '22', color, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', flexShrink: 0 }}>
                        {initials}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{a.name}</div>
                        {isMe && (
                          <span className="mono" style={{ fontSize: 9, padding: '2px 6px', background: 'rgba(37,99,235,0.12)', color: '#2563EB', borderRadius: 3 }}>
                            {t('settings.youBadge')}
                          </span>
                        )}
                      </div>
                    </div>
                    <div style={{ fontSize: 12, color: '#4B5563', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.email}</div>
                    <div className="mono" style={{ fontSize: 11, color: '#9097A1' }}>{joined}</div>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => { setResetTarget(a); setResetPwd(''); setResetConf(''); }}
                        title={t('settings.resetPwd')}
                        style={{ width: 30, height: 30, borderRadius: 4, background: 'transparent', border: '1px solid #EAECEF', color: '#4B5563', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Icon name="refresh" size={13} stroke={1.6} />
                      </button>
                      <button
                        onClick={() => !isMe && setDeleteTarget(a)}
                        disabled={isMe}
                        title={isMe ? 'Cannot delete yourself' : t('settings.deleteAdmin')}
                        style={{ width: 30, height: 30, borderRadius: 4, background: 'transparent', border: '1px solid #EAECEF', color: isMe ? '#D6DAE1' : '#EF4444', cursor: isMe ? 'not-allowed' : 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', opacity: isMe ? 0.4 : 1 }}
                      >
                        <Icon name="trash" size={13} stroke={1.6} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Add Admin Modal ── */}
      {showAddModal && (
        <Modal title={t('settings.addAdmin')} onClose={() => { setShowAddModal(false); setAddErrors({}); }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Field label={t('settings.fullName')} value={addName} onChange={setAddName} error={addErrors.name} />
            <Field label={t('settings.email')} type="email" value={addEmail} onChange={setAddEmail} error={addErrors.email} />
            <div>
              <Field label={t('settings.newPwd')} type="password" value={addPwd} onChange={setAddPwd} show={showNew} onToggleShow={() => setShowNew(v => !v)} error={addErrors.pwd} />
              <PasswordStrengthBar password={addPwd} />
            </div>
            <Field label={t('settings.confirmPwd')} type="password" value={addConfPwd} onChange={setAddConfPwd} show={showConf} onToggleShow={() => setShowConf(v => !v)} error={addErrors.conf} />
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 24 }}>
            <button onClick={() => { setShowAddModal(false); setAddErrors({}); }} style={btnGhost}>{t('common.cancel')}</button>
            <button onClick={handleAddAdmin} disabled={addSaving} style={{ ...btnOrange, opacity: addSaving ? 0.6 : 1 }}>
              {addSaving ? '…' : t('settings.addAdmin')}
            </button>
          </div>
        </Modal>
      )}

      {/* ── Reset Password Modal ── */}
      {resetTarget && (
        <Modal title={`${t('settings.resetPwd')} — ${resetTarget.name}`} onClose={() => setResetTarget(null)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <Field label={t('settings.newPwd')} type="password" value={resetPwd} onChange={setResetPwd} show={showNew} onToggleShow={() => setShowNew(v => !v)} />
              <PasswordStrengthBar password={resetPwd} />
            </div>
            <Field label={t('settings.confirmPwd')} type="password" value={resetConf} onChange={setResetConf} show={showConf} onToggleShow={() => setShowConf(v => !v)} />
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 24 }}>
            <button onClick={() => setResetTarget(null)} style={btnGhost}>{t('common.cancel')}</button>
            <button onClick={handleResetPwd} disabled={resetSaving} style={{ ...btnOrange, opacity: resetSaving ? 0.6 : 1 }}>
              <Icon name="key" size={14} stroke={1.6} />
              {resetSaving ? '…' : t('settings.resetPwd')}
            </button>
          </div>
        </Modal>
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteTarget && (
        <Modal title={t('settings.deleteAdmin')} onClose={() => setDeleteTarget(null)}>
          <p style={{ color: '#4B5563', fontSize: 13, margin: '0 0 24px' }}>
            {t('settings.confirmDelete')}: <strong style={{ color: '#111827' }}>{deleteTarget.name}</strong>?
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button onClick={() => setDeleteTarget(null)} style={btnGhost}>{t('common.cancel')}</button>
            <button onClick={handleDelete} style={{ ...btnOrange, background: '#EF4444' }}>
              <Icon name="trash" size={14} stroke={1.6} />
              {t('settings.deleteAdmin')}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
