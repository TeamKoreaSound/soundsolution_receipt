import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase, isAllowedEmail, ALLOWED_EMAIL_DOMAIN } from './supabaseClient';

type Mode = 'login' | 'signup';

export default function AuthGate({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'info'; text: string } | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!isAllowedEmail(email)) {
      setMessage({ type: 'error', text: `@${ALLOWED_EMAIL_DOMAIN} 이메일만 가입/로그인할 수 있습니다.` });
      return;
    }
    if (password.length < 6) {
      setMessage({ type: 'error', text: '비밀번호는 6자 이상이어야 합니다.' });
      return;
    }
    setBusy(true);
    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ email: email.trim(), password });
        if (error) throw error;
        setMessage({ type: 'info', text: '가입 완료! 등록하신 이메일로 인증 링크가 발송되었습니다. 확인 후 로그인해주세요.' });
        setMode('login');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setMessage({ type: 'error', text: msg });
    } finally {
      setBusy(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email.trim()) {
      setMessage({ type: 'error', text: '이메일을 입력한 후 "비밀번호 찾기"를 눌러주세요.' });
      return;
    }
    setBusy(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: window.location.origin,
      });
      if (error) throw error;
      setMessage({ type: 'info', text: '비밀번호 재설정 링크를 이메일로 보냈습니다.' });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setMessage({ type: 'error', text: msg });
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
        로딩 중...
      </div>
    );
  }

  if (!session) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg-primary)', padding: '20px' }}>
        <form onSubmit={handleSubmit} style={{
          width: '400px', maxWidth: '100%', padding: '40px', background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)',
          display: 'flex', flexDirection: 'column', gap: '16px',
        }}>
          <div style={{ textAlign: 'center', marginBottom: '8px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)' }}>SOUND SOLUTION</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>영수증 정리 시스템</p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="button" onClick={() => { setMode('login'); setMessage(null); }}
              style={{
                flex: 1, padding: '8px', borderRadius: 'var(--radius-md)',
                background: mode === 'login' ? 'var(--accent-primary)' : 'transparent',
                color: mode === 'login' ? '#0f1115' : 'var(--text-secondary)',
                border: `1px solid ${mode === 'login' ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                cursor: 'pointer', fontWeight: 600,
              }}>로그인</button>
            <button type="button" onClick={() => { setMode('signup'); setMessage(null); }}
              style={{
                flex: 1, padding: '8px', borderRadius: 'var(--radius-md)',
                background: mode === 'signup' ? 'var(--accent-primary)' : 'transparent',
                color: mode === 'signup' ? '#0f1115' : 'var(--text-secondary)',
                border: `1px solid ${mode === 'signup' ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                cursor: 'pointer', fontWeight: 600,
              }}>회원가입</button>
          </div>

          <div className="flex-col" style={{ gap: '6px' }}>
            <label style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>이메일 (@{ALLOWED_EMAIL_DOMAIN})</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              placeholder={`yourname@${ALLOWED_EMAIL_DOMAIN}`} style={{ padding: '10px 12px', fontSize: '14px' }} />
          </div>
          <div className="flex-col" style={{ gap: '6px' }}>
            <label style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>비밀번호 (6자 이상)</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
              minLength={6} style={{ padding: '10px 12px', fontSize: '14px' }} />
          </div>

          {message && (
            <div style={{
              padding: '10px 12px', borderRadius: 'var(--radius-md)', fontSize: '13px',
              background: message.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(74, 222, 128, 0.1)',
              color: message.type === 'error' ? '#ef4444' : 'var(--accent-primary)',
              border: `1px solid ${message.type === 'error' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(74, 222, 128, 0.3)'}`,
            }}>{message.text}</div>
          )}

          <button type="submit" disabled={busy} className="btn-primary"
            style={{ padding: '12px', fontSize: '14px', fontWeight: 600, opacity: busy ? 0.6 : 1, cursor: busy ? 'not-allowed' : 'pointer' }}>
            {busy ? '처리 중...' : (mode === 'login' ? '로그인' : '회원가입')}
          </button>

          {mode === 'login' && (
            <button type="button" onClick={handlePasswordReset} disabled={busy}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '12px', cursor: 'pointer', textDecoration: 'underline' }}>
              비밀번호를 잊으셨나요?
            </button>
          )}
        </form>
      </div>
    );
  }

  return <>{children}</>;
}

export function LogoutButton() {
  const [email, setEmail] = useState<string | null>(null);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
  }, []);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: 'var(--text-muted)' }}>
      <span>{email}</span>
      <button onClick={() => supabase.auth.signOut()}
        style={{
          padding: '6px 12px', fontSize: '12px', borderRadius: 'var(--radius-md)',
          background: 'transparent', color: 'var(--text-secondary)',
          border: '1px solid var(--border-color)', cursor: 'pointer',
        }}>로그아웃</button>
    </div>
  );
}
