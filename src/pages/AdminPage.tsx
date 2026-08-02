import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, ShieldAlert, LogIn, LogOut, MessageSquare, Trash2, Edit3, 
  Search, RefreshCw, AlertTriangle, CheckCircle2, User, CornerDownRight, 
  Send, Terminal, Copy, Check, Filter, ArrowLeft, ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase, isSupabaseConfigured, CommentItem } from '../lib/supabase';
import { db } from '../lib/firebase';
import { collection, onSnapshot, doc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { Link } from 'react-router';

const ADMIN_EMAIL = 'anand.textme@gmail.com';

const SQL_SCHEMA = `-- Safe SQL script for Supabase SQL Editor:
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_id TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_role TEXT,
  content TEXT NOT NULL,
  likes_count INT DEFAULT 0,
  parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public select" ON public.comments;
DROP POLICY IF EXISTS "Allow public insert" ON public.comments;
DROP POLICY IF EXISTS "Allow public update" ON public.comments;
DROP POLICY IF EXISTS "Allow public delete" ON public.comments;

CREATE POLICY "Allow public select" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON public.comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON public.comments FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON public.comments FOR DELETE USING (true);`;

export default function AdminPage() {
  const { user, loginWithGoogle, logout } = useAuth();

  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedPageFilter, setSelectedPageFilter] = useState<string>('ALL');
  const [actionNotice, setActionNotice] = useState<string>('');
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleSignIn = async () => {
    setIsLoggingIn(true);
    setLoginError(null);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      console.error("Login error:", err);
      if (err.code === 'auth/popup-closed-by-user') {
        setLoginError("Sign-in window closed before finishing. Please click below to try again.");
      } else if (err.code === 'auth/popup-blocked') {
        setLoginError("Popups blocked by browser. Please allow popups or open in a new tab.");
      } else if (err.code === 'auth/unauthorized-domain') {
        const domain = typeof window !== 'undefined' ? window.location.hostname : 'this domain';
        setLoginError(`Firebase Auth Error (${domain}): Please ensure BOTH '${domain}' AND 'www.${domain.replace('www.', '')}' are added in Firebase Console -> Authentication -> Settings -> Authorised domains. (Allow 2-5 min for propagation).`);
      } else {
        setLoginError(err.message || "Failed to sign in. Please try again or open in a direct tab.");
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Editing Modal State
  const [editingComment, setEditingComment] = useState<CommentItem | null>(null);
  const [editAuthorName, setEditAuthorName] = useState<string>('');
  const [editAuthorRole, setEditAuthorRole] = useState<string>('');
  const [editContent, setEditContent] = useState<string>('');
  const [savingEdit, setSavingEdit] = useState<boolean>(false);

  // Admin Quick Reply State
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState<string>('');
  const [submittingReply, setSubmittingReply] = useState<boolean>(false);

  // SQL Copy State
  const [copiedSql, setCopiedSql] = useState<boolean>(false);

  const isAdmin = Boolean(user && user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase());

  // Load all comments from Firestore, Supabase, or localStorage
  const loadFromAllLocalKeys = () => {
    const allComments: CommentItem[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('nva_comments_')) {
        try {
          const item = localStorage.getItem(key);
          if (item) {
            const parsed = JSON.parse(item);
            if (Array.isArray(parsed)) {
              allComments.push(...parsed);
            }
          }
        } catch {
          // ignore
        }
      }
    }
    setComments(allComments);
  };

  useEffect(() => {
    if (!isAdmin) return;

    setLoading(true);
    let unsubscribe = () => {};

    try {
      unsubscribe = onSnapshot(
        collection(db, 'comments'),
        (snapshot) => {
          const list: CommentItem[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            list.push({
              id: docSnap.id,
              page_id: data.page_id || '',
              author_name: data.author_name || 'Anonymous',
              author_role: data.author_role || 'Aspirant',
              content: data.content || '',
              likes_count: data.likes_count || 0,
              parent_id: data.parent_id || null,
              created_at: data.created_at || new Date().toISOString(),
            });
          });
          list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          setComments(list);
          setLoading(false);
        },
        (error) => {
          console.warn('Firestore admin fetch notice:', error);
          loadFromAllLocalKeys();
          setLoading(false);
        }
      );
    } catch (err) {
      console.warn('Firestore admin exception:', err);
      loadFromAllLocalKeys();
      setLoading(false);
    }

    return () => unsubscribe();
  }, [isAdmin]);

  const showNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(''), 4000);
  };

  // Delete Comment Action
  const handleDeleteComment = async (commentId: string, pageId: string) => {
    if (!window.confirm('Are you sure you want to delete this comment permanently?')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'comments', commentId));
      showNotice('Comment deleted from live database successfully.');
    } catch (err: any) {
      console.warn("Firestore delete comment error:", err);
      if (isSupabaseConfigured && supabase) {
        try {
          await supabase.from('comments').delete().eq('id', commentId);
          showNotice('Comment deleted from Supabase.');
        } catch {
          // ignore
        }
      }
    }

    // Remove from local state fallback
    const updated = comments.filter((c) => c.id !== commentId && c.parent_id !== commentId);
    setComments(updated);

    const localKey = `nva_comments_${pageId}`;
    const stored = localStorage.getItem(localKey);
    if (stored) {
      try {
        const parsed: CommentItem[] = JSON.parse(stored);
        const filtered = parsed.filter((c) => c.id !== commentId && c.parent_id !== commentId);
        localStorage.setItem(localKey, JSON.stringify(filtered));
      } catch {
        // ignore
      }
    }
  };

  // Bulk Delete Page Comments
  const handleDeletePageComments = async (pageId: string) => {
    if (!window.confirm(`Are you sure you want to delete ALL comments for page "${pageId}"?`)) {
      return;
    }

    const targetComments = comments.filter((c) => c.page_id === pageId);
    for (const comment of targetComments) {
      try {
        await deleteDoc(doc(db, 'comments', comment.id));
      } catch {
        // ignore
      }
    }

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('comments').delete().eq('page_id', pageId);
      } catch {
        // ignore
      }
    }

    setComments((prev) => prev.filter((c) => c.page_id !== pageId));
    localStorage.removeItem(`nva_comments_${pageId}`);
    showNotice(`All comments for page "${pageId}" removed.`);
  };

  // Open Edit Modal
  const handleStartEdit = (comment: CommentItem) => {
    setEditingComment(comment);
    setEditAuthorName(comment.author_name);
    setEditAuthorRole(comment.author_role || '');
    setEditContent(comment.content);
  };

  // Save Comment Edit
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingComment) return;

    setSavingEdit(true);

    const updatedFields = {
      author_name: editAuthorName.trim(),
      author_role: editAuthorRole.trim() || 'Aspirant',
      content: editContent.trim(),
    };

    try {
      await updateDoc(doc(db, 'comments', editingComment.id), updatedFields);
      showNotice('Comment updated in live database.');
    } catch (err: any) {
      console.warn("Firestore edit error:", err);
      if (isSupabaseConfigured && supabase) {
        try {
          await supabase.from('comments').update(updatedFields).eq('id', editingComment.id);
          showNotice('Comment updated in Supabase.');
        } catch {
          // ignore
        }
      }
    }

    // Update Local State
    setComments((prev) =>
      prev.map((c) => (c.id === editingComment.id ? { ...c, ...updatedFields } : c))
    );

    setEditingComment(null);
    setSavingEdit(false);
  };

  // Submit Admin Official Reply
  const handleAdminReply = async (parentId: string, pageId: string) => {
    if (!replyContent.trim()) return;
    setSubmittingReply(true);

    const replyData = {
      page_id: pageId,
      author_name: 'Admin (NewVacancyAlert)',
      author_role: 'Official Admin',
      content: replyContent.trim(),
      likes_count: 0,
      parent_id: parentId,
      created_at: new Date().toISOString(),
    };

    try {
      await addDoc(collection(db, 'comments'), replyData);
      showNotice('Official Admin reply posted to live database!');
    } catch (err: any) {
      console.warn("Firestore admin reply error:", err);
      if (isSupabaseConfigured && supabase) {
        try {
          const { data } = await supabase.from('comments').insert([replyData]).select().single();
          if (data) setComments((prev) => [data, ...prev]);
          showNotice('Official Admin reply posted to Supabase!');
        } catch {
          // ignore
        }
      } else {
        const localItem: CommentItem = {
          id: 'local-' + Date.now(),
          ...replyData,
          created_at: new Date().toISOString(),
        };
        setComments((prev) => [localItem, ...prev]);
        showNotice('Admin reply saved locally.');
      }
    }

    setReplyingToId(null);
    setReplyContent('');
    setSubmittingReply(false);
  };

  const copySql = () => {
    navigator.clipboard.writeText(SQL_SCHEMA);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  // Filter & Search Logic
  const uniquePageIds = Array.from(new Set(comments.map((c) => c.page_id)));

  const filteredComments = comments.filter((c) => {
    const matchesPage = selectedPageFilter === 'ALL' || c.page_id === selectedPageFilter;
    const matchesSearch =
      !searchTerm ||
      c.author_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.page_id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesPage && matchesSearch;
  });

  const totalLikes = comments.reduce((acc, curr) => acc + (curr.likes_count || 0), 0);

  // -------------------------------------------------------------
  // 1. NOT LOGGED IN SCREEN
  // -------------------------------------------------------------
  if (!user) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 bg-slate-900 text-slate-100">
        <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-3xl p-6 sm:p-8 space-y-6 text-center shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-black text-white tracking-tight">Admin Comment Portal</h1>
            <p className="text-xs text-slate-400 font-medium">
              Restricted management dashboard for <strong>{ADMIN_EMAIL}</strong>. Please sign in with your authorized Google Account.
            </p>
          </div>

          {loginError && (
            <div className="p-3.5 bg-red-950/80 border border-red-800 text-red-200 rounded-2xl text-xs font-bold text-left flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p>{loginError}</p>
                <p className="text-[11px] text-slate-300 font-normal">
                  Tip: If using an embedded preview or strict browser (Safari/Incognito), allow popups for this site or open the URL in a direct browser tab.
                </p>
              </div>
            </div>
          )}

          <button
            type="button"
            disabled={isLoggingIn}
            onClick={handleSignIn}
            className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-black text-sm rounded-xl flex items-center justify-center gap-2 transition shadow-lg cursor-pointer active:scale-95"
          >
            {isLoggingIn ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
            )}
            <span>{isLoggingIn ? 'Opening Google Sign In...' : 'Sign In with Google'}</span>
          </button>

          <div className="pt-2">
            <Link to="/" className="text-xs text-slate-400 hover:text-white font-bold flex items-center justify-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Return to Main Portal
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 2. LOGGED IN BUT NOT AUTHORIZED EMAIL
  // -------------------------------------------------------------
  if (!isAdmin) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 bg-slate-900 text-slate-100">
        <div className="max-w-md w-full bg-slate-800 border border-red-900/50 rounded-3xl p-6 sm:p-8 space-y-6 text-center shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-red-600/20 text-red-400 border border-red-500/30 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-black text-white tracking-tight">Access Denied</h1>
            <p className="text-xs text-slate-300 font-medium leading-relaxed">
              You are currently signed in as <strong className="text-amber-400">{user.email}</strong>.
            </p>
            <p className="text-xs text-slate-400">
              Only authorized administrator account (<strong className="text-emerald-400">{ADMIN_EMAIL}</strong>) has privileges to manage Supabase discussions.
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <button
              type="button"
              onClick={() => logout()}
              className="w-full py-3 px-4 bg-slate-700 hover:bg-slate-600 text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out ({user.email})</span>
            </button>
            <button
              type="button"
              onClick={() => loginWithGoogle()}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Switch Google Account</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 3. AUTHORIZED ADMIN PANEL (anand.textme@gmail.com)
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      {/* Top Navigation Bar */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-black flex items-center justify-center shadow-lg">
              <ShieldCheck className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2">
                NewVacancyAlert Comments Console
              </h1>
              <div className="text-[11px] text-emerald-400 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Logged in as Admin ({user.email})</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={loadFromAllLocalKeys}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition cursor-pointer flex items-center gap-1.5 text-xs font-bold"
              title="Refresh comments"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-400' : ''}`} />
              <span className="hidden sm:inline">Sync</span>
            </button>

            <button
              type="button"
              onClick={() => logout()}
              className="px-3 py-2 bg-red-950/60 hover:bg-red-900/80 border border-red-800/80 text-red-300 hover:text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Notice Alert */}
        {actionNotice && (
          <div className="p-4 bg-emerald-950/80 border border-emerald-700/80 text-emerald-200 rounded-2xl flex items-center justify-between text-xs font-bold animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{actionNotice}</span>
            </div>
            <button onClick={() => setActionNotice('')} className="text-emerald-400 hover:text-white">✕</button>
          </div>
        )}

        {/* Dashboard Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-1">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5 text-blue-400" /> Total Comments
            </div>
            <div className="text-2xl font-black text-white">{comments.length}</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-1">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-purple-400" /> Active Pages
            </div>
            <div className="text-2xl font-black text-white">{uniquePageIds.length}</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-1">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Total Likes
            </div>
            <div className="text-2xl font-black text-white">{totalLikes}</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-1">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Terminal className="w-3.5 h-3.5 text-amber-400" /> Supabase Status
            </div>
            <div className="text-xs font-black text-emerald-400 mt-1 flex items-center gap-1">
              {isSupabaseConfigured ? 'Connected (Live)' : 'Local Storage Mode'}
            </div>
          </div>
        </div>

        {/* Supabase Schema Query Helper Banner */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Terminal className="w-4 h-4" /> Database DELETE & UPDATE RLS Policy
            </span>
            <button
              type="button"
              onClick={copySql}
              className="flex items-center gap-1 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs text-white rounded-lg font-bold transition cursor-pointer"
            >
              {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSql ? 'Copied' : 'Copy Full SQL'}</span>
            </button>
          </div>
          <p className="text-xs text-slate-400 font-medium">
            To ensure instant deletions & edits execute in Supabase without RLS errors, verify you have executed the <code className="text-amber-300">DELETE</code> policy in your Supabase SQL Editor.
          </p>
        </div>

        {/* Filter & Search Toolbar */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row gap-3 justify-between items-center">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search author, content, page ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-bold text-slate-400 shrink-0">Filter Page:</span>
            <select
              value={selectedPageFilter}
              onChange={(e) => setSelectedPageFilter(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="ALL">All Pages ({comments.length})</option>
              {uniquePageIds.map((pId) => (
                <option key={pId} value={pId}>
                  {pId} ({comments.filter((c) => c.page_id === pId).length})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Comments Feed / Table */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-2xl">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-xs font-bold text-slate-400">Loading Supabase comments...</p>
            </div>
          ) : filteredComments.length === 0 ? (
            <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
              <MessageSquare className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-sm font-black text-slate-300">No matching comments found.</p>
              <p className="text-xs text-slate-500">
                {searchTerm ? 'Try adjusting your search criteria.' : 'No candidates have submitted comments yet.'}
              </p>
            </div>
          ) : (
            filteredComments.map((comment) => (
              <div
                key={comment.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 sm:p-5 space-y-3 transition"
              >
                {/* Header info */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-blue-950 text-blue-300 border border-blue-800 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                      <ExternalLink className="w-3 h-3" /> Page: {comment.page_id}
                    </span>
                    {comment.parent_id && (
                      <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 text-[10px] font-bold">
                        Reply Thread
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-400">
                    <span>ID: {comment.id.slice(0, 8)}...</span>
                    <span>•</span>
                    <span>{new Date(comment.created_at).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Author & Content */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-black text-xs flex items-center justify-center shrink-0">
                    {comment.author_name.slice(0, 2).toUpperCase()}
                  </div>

                  <div className="flex-1 space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-white text-xs sm:text-sm">{comment.author_name}</span>
                      {comment.author_role && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {comment.author_role}
                        </span>
                      )}
                      <span className="text-xs text-slate-500 font-bold ml-auto">
                        ❤️ {comment.likes_count}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed pt-1 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                      {comment.content}
                    </p>
                  </div>
                </div>

                {/* Admin Quick Action Controls */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setReplyingToId(replyingToId === comment.id ? null : comment.id)}
                    className="px-3 py-1.5 bg-blue-900/60 hover:bg-blue-800 border border-blue-700 text-blue-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <CornerDownRight className="w-3.5 h-3.5" />
                    <span>Reply as Admin</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleStartEdit(comment)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteComment(comment.id, comment.page_id)}
                      className="px-3 py-1.5 bg-red-950/60 hover:bg-red-900/80 border border-red-800/80 text-red-300 hover:text-white rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeletePageComments(comment.page_id)}
                      className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-red-400 rounded-xl text-[10px] font-bold transition cursor-pointer"
                      title="Clear all comments on this page"
                    >
                      Clear Page Thread
                    </button>
                  </div>
                </div>

                {/* Admin Reply Input Box */}
                {replyingToId === comment.id && (
                  <div className="mt-3 bg-slate-950 border border-blue-800 p-3 rounded-xl space-y-2.5 animate-fadeIn">
                    <div className="text-[11px] font-black text-blue-400 flex items-center gap-1 uppercase tracking-wider">
                      <CornerDownRight className="w-3.5 h-3.5" /> Responding as Official Admin
                    </div>
                    <textarea
                      rows={2}
                      placeholder="Write official response or guidance..."
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-medium text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setReplyingToId(null)}
                        className="px-3 py-1.5 bg-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-bold"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        disabled={submittingReply || !replyContent.trim()}
                        onClick={() => handleAdminReply(comment.id, comment.page_id)}
                        className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white font-black text-xs rounded-lg flex items-center gap-1.5 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{submittingReply ? 'Sending...' : 'Post Admin Reply'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </main>

      {/* Editing Modal */}
      {editingComment && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-amber-400" /> Edit Comment
              </h3>
              <button
                onClick={() => setEditingComment(null)}
                className="text-slate-400 hover:text-white font-black text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">
                  Author Name
                </label>
                <input
                  type="text"
                  required
                  value={editAuthorName}
                  onChange={(e) => setEditAuthorName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">
                  Author Role
                </label>
                <input
                  type="text"
                  value={editAuthorRole}
                  onChange={(e) => setEditAuthorRole(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">
                  Comment Content
                </label>
                <textarea
                  required
                  rows={4}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-medium text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingComment(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{savingEdit ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
