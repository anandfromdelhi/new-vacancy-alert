import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  MessageSquare, Heart, Reply, Trash2, Edit2, Send, X, AlertCircle,
  CheckCircle2, Lock, Sparkles, UserCheck, Flag, ShieldAlert, Ban,
  ChevronDown, Clock, ChevronUp
} from 'lucide-react';
import {
  collection, query, where, orderBy, limit, addDoc, updateDoc,
  deleteDoc, doc, setDoc, getDoc, getDocs, startAfter, onSnapshot,
  serverTimestamp, QueryDocumentSnapshot, DocumentData
} from 'firebase/firestore';
import { db, auth, googleProvider } from '../lib/firebase';
import { signInWithPopup, onAuthStateChanged, User } from 'firebase/auth';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface CommentItem {
  id: string;
  page_id: string;
  author_name: string;
  author_role: string;
  author_uid: string;
  content: string;
  likes_count: number;
  parent_id: string | null;
  created_at: any;
  status?: string; // undefined | 'approved' | 'hidden' | 'deleted'
}

interface CommentsSectionProps {
  pageId?: string;
  pageTitle?: string;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onCountChange?: (count: number) => void;
  hideFloatingButton?: boolean;
}

const REPORT_REASONS = ['Spam', 'Advertising', 'Abusive', 'Offensive', 'Misleading', 'Other'];
const PAGE_SIZE = 20;

/**
 * Visibility rule:
 *   Show when: status is missing, undefined, or 'approved'
 *   Hide when: status === 'hidden' || status === 'deleted'
 */
function isCommentVisible(c: CommentItem): boolean {
  return c.status !== 'hidden' && c.status !== 'deleted';
}

// ─────────────────────────────────────────────────────────────────────────────
// Floating Comments Button — rendered outside the drawer (Desktop only)
// ─────────────────────────────────────────────────────────────────────────────

interface FloatingButtonProps {
  count: number;
  onClick: () => void;
}

function FloatingCommentsButton(_props: FloatingButtonProps) {
  // Side floating button removed per user request (accessed via bottom dock & inline section)
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Single Comment Card
// ─────────────────────────────────────────────────────────────────────────────

interface CommentCardProps {
  key?: React.Key;
  comment: CommentItem;
  replies: CommentItem[];
  currentUser: User | null;
  isLiked: boolean;
  isReported: boolean;
  isEditing: boolean;
  editText: string;
  replyParentId: string | null;
  replyText: string;
  submitting: boolean;
  onToggleLike: (id: string) => void;
  onSetReply: (id: string | null) => void;
  onSetReplyText: (t: string) => void;
  onSubmitReply: (e: React.FormEvent, parentId: string) => void;
  onStartEdit: (id: string, content: string) => void;
  onCancelEdit: () => void;
  onSetEditText: (t: string) => void;
  onSaveEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onReport: (id: string) => void;
  onBlock: (uid: string, name: string) => void;
  userLikesMap: Record<string, boolean>;
}

function CommentCard({
  comment, replies, currentUser,
  isLiked, isReported, isEditing, editText, replyParentId, replyText,
  submitting,
  onToggleLike, onSetReply, onSetReplyText, onSubmitReply,
  onStartEdit, onCancelEdit, onSetEditText, onSaveEdit,
  onDelete, onReport, onBlock,
  userLikesMap,
}: CommentCardProps) {
  const isOwner = currentUser?.uid === comment.author_uid;

  return (
    <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-3.5 transition-all">
      {/* Author Row */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-black text-xs
                          flex items-center justify-center uppercase shrink-0">
            {comment.author_name.charAt(0)}
          </div>
          <div>
            <span className="font-bold text-slate-900 text-xs block leading-tight">
              {comment.author_name}
            </span>
            <span className="text-[10px] text-slate-400 block">{comment.author_role}</span>
          </div>
        </div>

        <div className="flex items-center gap-0.5">
          {!isOwner && currentUser && (
            <button
              onClick={() => onBlock(comment.author_uid, comment.author_name)}
              className="p-1.5 text-slate-300 hover:text-amber-500 transition-colors"
              title="Block user"
            >
              <Ban className="h-3.5 w-3.5" />
            </button>
          )}
          {!isOwner && (
            <button
              onClick={() => !isReported && onReport(comment.id)}
              disabled={isReported}
              className={`p-1.5 transition-colors ${
                isReported ? 'text-amber-400' : 'text-slate-300 hover:text-amber-500'
              }`}
              title={isReported ? 'Already reported' : 'Report comment'}
            >
              <Flag className="h-3.5 w-3.5" />
            </button>
          )}
          {isOwner && (
            <>
              <button
                onClick={() => onStartEdit(comment.id, comment.content)}
                className="p-1.5 text-slate-300 hover:text-blue-600 transition-colors"
                title="Edit"
              >
                <Edit2 className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => onDelete(comment.id)}
                className="p-1.5 text-slate-300 hover:text-red-500 transition-colors"
                title="Delete"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Content / Edit form */}
      {isEditing ? (
        <div className="space-y-2 my-2">
          <textarea
            value={editText}
            onChange={e => onSetEditText(e.target.value)}
            rows={2}
            maxLength={2000}
            className="w-full rounded-lg border border-blue-400 p-2 text-xs text-slate-800
                       focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <div className="flex gap-2">
            <button
              onClick={() => onSaveEdit(comment.id)}
              disabled={submitting}
              className="bg-blue-600 text-white font-bold px-3 py-1 rounded-lg text-xs"
            >Save</button>
            <button
              onClick={onCancelEdit}
              className="bg-slate-200 text-slate-700 font-bold px-3 py-1 rounded-lg text-xs"
            >Cancel</button>
          </div>
        </div>
      ) : (
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
          {comment.content}
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4 mt-2.5 pt-2 border-t border-slate-200/60">
        <button
          onClick={() => onToggleLike(comment.id)}
          className={`flex items-center gap-1 text-xs font-bold transition-colors ${
            isLiked ? 'text-red-600' : 'text-slate-400 hover:text-red-500'
          }`}
        >
          <Heart className={`h-3.5 w-3.5 ${isLiked ? 'fill-current' : ''}`} />
          <span>{isLiked ? '♥ Liked' : '♡ Like'}</span>
        </button>
        <button
          onClick={() => onSetReply(replyParentId === comment.id ? null : comment.id)}
          className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors"
        >
          <Reply className="h-3.5 w-3.5" />
          <span>Reply {replies.length > 0 ? `(${replies.length})` : ''}</span>
        </button>
      </div>

      {/* Inline Reply Form */}
      {replyParentId === comment.id && (
        <form
          onSubmit={e => onSubmitReply(e, comment.id)}
          className="mt-2.5 pl-3 border-l-2 border-blue-400"
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={replyText}
              onChange={e => onSetReplyText(e.target.value)}
              placeholder="Write a reply…"
              maxLength={2000}
              className="flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-xs
                         text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={submitting || !replyText.trim()}
              className="bg-blue-600 text-white font-bold px-3 py-1.5 rounded-lg text-xs
                         disabled:opacity-50"
            >Reply</button>
          </div>
        </form>
      )}

      {/* Replies */}
      {replies.length > 0 && (
        <div className="mt-2.5 pl-3.5 space-y-2 border-l-2 border-slate-200">
          {replies.map(reply => {
            const isReplyOwner = currentUser?.uid === reply.author_uid;
            const isReplyLiked = !!userLikesMap[reply.id];
            return (
              <div key={reply.id} className="bg-white p-2.5 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-slate-800">{reply.author_name}</span>
                  {isReplyOwner && (
                    <button
                      onClick={() => onDelete(reply.id)}
                      className="text-[10px] text-slate-400 hover:text-red-500"
                    >Delete</button>
                  )}
                </div>
                <p className="text-xs text-slate-600 whitespace-pre-wrap">{reply.content}</p>
                <button
                  onClick={() => onToggleLike(reply.id)}
                  className={`mt-1.5 flex items-center gap-1 text-[11px] font-bold ${
                    isReplyLiked ? 'text-red-600' : 'text-slate-400 hover:text-red-500'
                  }`}
                >
                  <Heart className={`h-3 w-3 ${isReplyLiked ? 'fill-current' : ''}`} />
                  <span>{isReplyLiked ? '♥ Liked' : '♡ Like'}</span>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main CommentsSection (Drawer + Floating Button)
// ─────────────────────────────────────────────────────────────────────────────

export default function CommentsSection({
  pageId: rawPageId,
  pageTitle = 'Discussion & Q&A',
  isOpen: externalIsOpen,
  onOpenChange,
  onCountChange,
  hideFloatingButton = false,
}: CommentsSectionProps) {
  // Safe pageId resolution
  const pageId = rawPageId || (typeof window !== 'undefined' ? (window.location.pathname.replace(/^\//, '') || 'home') : 'home');

  // ── Auth ──────────────────────────────────────────────────────────────────
  const [currentUser, setCurrentUser] = useState<User | null>(auth.currentUser);
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => setCurrentUser(u));
    return unsub;
  }, []);

  // ── Drawer open state ─────────────────────────────────────────────────────
  const [internalDrawerOpen, setInternalDrawerOpen] = useState(false);
  const drawerOpen = externalIsOpen !== undefined ? externalIsOpen : internalDrawerOpen;

  const setDrawerOpen = useCallback((open: boolean) => {
    if (onOpenChange) {
      onOpenChange(open);
    }
    setInternalDrawerOpen(open);
  }, [onOpenChange]);

  // ── Comments list ─────────────────────────────────────────────────────────
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState(true);

  // ── Pagination cursor (for "load older" — going DESC so cursor is oldest) ─
  const [oldestDoc, setOldestDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  // ── Interaction maps ──────────────────────────────────────────────────────
  const [userLikesMap, setUserLikesMap] = useState<Record<string, boolean>>({});
  const [userReportsMap, setUserReportsMap] = useState<Record<string, boolean>>({});
  const [blockedUsers, setBlockedUsers] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('nv_user_blocks') || '[]'); } catch { return []; }
  });

  // ── Input states ──────────────────────────────────────────────────────────
  const [newCommentText, setNewCommentText] = useState('');
  const [replyParentId, setReplyParentId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  // ── Report modal ──────────────────────────────────────────────────────────
  const [reportingCommentId, setReportingCommentId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState('Spam');
  const [reportDescription, setReportDescription] = useState('');

  // ── Anti-spam ─────────────────────────────────────────────────────────────
  const [lastPostTs, setLastPostTs] = useState(0);
  const [lastPostText, setLastPostText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // ── Notices ───────────────────────────────────────────────────────────────
  const [notice, setNotice] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const showNotice = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setNotice({ message, type });
    setTimeout(() => setNotice(null), 4000);
  }, []);

  const listRef = useRef<HTMLDivElement>(null);
  const unsubRef = useRef<(() => void) | null>(null);

  // ─────────────────────────────────────────────────────────────────────────
  // 1. onSnapshot listener — newest 20 DESC
  //    This satisfies: realtime updates, immediate appearance, no page refresh
  //    Required index: page_id ASC + created_at DESC  (composite)
  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    // Tear down previous listener
    if (unsubRef.current) { unsubRef.current(); unsubRef.current = null; }
    setComments([]);
    setOldestDoc(null);
    setHasMore(false);
    setLoading(true);

    if (!pageId) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'comments'),
      where('page_id', '==', pageId),
      orderBy('created_at', 'desc'),
      limit(PAGE_SIZE)
    );

    const unsub = onSnapshot(
      q,
      snapshot => {
        const loaded: CommentItem[] = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as CommentItem));
        setComments(loaded);
        if (snapshot.docs.length > 0) {
          setOldestDoc(snapshot.docs[snapshot.docs.length - 1]);
        }
        setHasMore(snapshot.docs.length === PAGE_SIZE);
        setLoading(false);
      },
      err => {
        console.error('Comments listener error:', err);
        setLoading(false);
        if (err?.code === 'permission-denied') {
          showNotice('Permission denied while reading comments.', 'error');
        }
      }
    );

    unsubRef.current = unsub;
    return () => { unsub(); unsubRef.current = null; };
  }, [pageId, showNotice]);

  // ─────────────────────────────────────────────────────────────────────────
  // 2. Load OLDER comments (cursor = oldestDoc, DESC → older)
  // ─────────────────────────────────────────────────────────────────────────
  const handleLoadMore = useCallback(async () => {
    if (!oldestDoc || !hasMore || loadingMore) return;
    setLoadingMore(true);
    try {
      const q = query(
        collection(db, 'comments'),
        where('page_id', '==', pageId),
        orderBy('created_at', 'desc'),
        startAfter(oldestDoc),
        limit(PAGE_SIZE)
      );
      const snapshot = await getDocs(q);
      const next: CommentItem[] = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as CommentItem));

      setComments(prev => {
        const ids = new Set(prev.map(c => c.id));
        return [...prev, ...next.filter(c => !ids.has(c.id))];
      });
      if (snapshot.docs.length > 0) {
        setOldestDoc(snapshot.docs[snapshot.docs.length - 1]);
      }
      setHasMore(snapshot.docs.length === PAGE_SIZE);
    } catch (err) {
      console.error('Load more error:', err);
      showNotice('Failed to load older comments.', 'error');
    } finally {
      setLoadingMore(false);
    }
  }, [oldestDoc, hasMore, loadingMore, pageId, showNotice]);

  // ─────────────────────────────────────────────────────────────────────────
  // 3. Fetch user interaction states (likes + reports) for current batch
  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!currentUser || comments.length === 0) {
      setUserLikesMap({});
      setUserReportsMap({});
      return;
    }
    let alive = true;
    (async () => {
      const likes: Record<string, boolean> = {};
      const reports: Record<string, boolean> = {};
      for (const c of comments) {
        try {
          const lSnap = await getDoc(doc(db, 'comments', c.id, 'likes', currentUser.uid));
          if (lSnap.exists()) likes[c.id] = true;

          const rSnap = await getDoc(doc(db, 'commentReports', `${c.id}_${currentUser.uid}`));
          if (rSnap.exists()) reports[c.id] = true;
        } catch { /* ignore */ }
      }
      if (alive) { setUserLikesMap(likes); setUserReportsMap(reports); }
    })();
    return () => { alive = false; };
  }, [currentUser?.uid, comments.length]); // only refetch when user changes or batch size changes

  // ─────────────────────────────────────────────────────────────────────────
  // 4. Derived: visible + sorted newest→oldest for display
  // ─────────────────────────────────────────────────────────────────────────
  const visibleComments = useMemo(() =>
    comments.filter(c => !blockedUsers.includes(c.author_uid) && isCommentVisible(c)),
    [comments, blockedUsers]
  );

  // DESC query already returns newest first; replies nested inside parent
  const topLevel = useMemo(() => visibleComments.filter(c => !c.parent_id), [visibleComments]);
  const repliesMap = useMemo(() => {
    const m: Record<string, CommentItem[]> = {};
    visibleComments.forEach(c => {
      if (c.parent_id) {
        (m[c.parent_id] = m[c.parent_id] || []).push(c);
      }
    });
    // Sort replies oldest-first within each parent
    Object.values(m).forEach(arr => arr.sort((a, b) => {
      const at = a.created_at?.seconds ?? 0;
      const bt = b.created_at?.seconds ?? 0;
      return at - bt;
    }));
    return m;
  }, [visibleComments]);

  const visibleCount = visibleComments.length;

  useEffect(() => {
    onCountChange?.(visibleCount);
  }, [visibleCount, onCountChange]);

  // ─────────────────────────────────────────────────────────────────────────
  // 5. Auth helpers
  // ─────────────────────────────────────────────────────────────────────────
  const handleLogin = useCallback(async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      showNotice('Signed in with Google!');
    } catch (err: any) {
      console.error(err);
      showNotice('Sign-in failed.', 'error');
    }
  }, [showNotice]);

  // ─────────────────────────────────────────────────────────────────────────
  // 6. Anti-spam guard
  // ─────────────────────────────────────────────────────────────────────────
  const checkAntiSpam = useCallback((text: string): boolean => {
    const now = Date.now();
    if (now - lastPostTs < 10000) {
      showNotice(`Please wait ${Math.ceil((10000 - (now - lastPostTs)) / 1000)}s before posting again.`, 'error');
      return false;
    }
    if (text.trim().toLowerCase() === lastPostText.trim().toLowerCase()) {
      showNotice('Duplicate comment. Please modify your text.', 'error');
      return false;
    }
    return true;
  }, [lastPostTs, lastPostText, showNotice]);

  // ─────────────────────────────────────────────────────────────────────────
  // 7. Create comment / reply
  //    NO status field added → existing rules accept it
  //    → immediately visible (no pending state)
  // ─────────────────────────────────────────────────────────────────────────
  const handleCreateComment = useCallback(async (e: React.FormEvent, parentId: string | null = null) => {
    e.preventDefault();
    const text = parentId ? replyText : newCommentText;

    if (!text.trim()) { showNotice('Comment cannot be empty.', 'error'); return; }
    if (text.length > 2000) { showNotice('Comment exceeds 2000 characters.', 'error'); return; }
    if (!currentUser) { await handleLogin(); return; }
    if (!checkAntiSpam(text)) return;

    setSubmitting(true);
    try {
      await addDoc(collection(db, 'comments'), {
        page_id: pageId,
        author_name: currentUser.displayName || 'Candidate',
        author_role: 'Candidate',
        author_uid: currentUser.uid,
        content: text.trim(),
        likes_count: 0,
        parent_id: parentId || null,
        created_at: serverTimestamp(),
      });
      // onSnapshot listener will pick up the new document automatically.
      // No local state mutation needed — avoids duplicates.
      setLastPostTs(Date.now());
      setLastPostText(text.trim());
      if (parentId) { setReplyText(''); setReplyParentId(null); showNotice('Reply posted!'); }
      else { setNewCommentText(''); showNotice('Comment posted!'); }
    } catch (err: any) {
      console.error(err);
      showNotice(
        err?.code === 'permission-denied'
          ? 'Permission denied: Unable to post.'
          : 'Failed to post. Please try again.',
        'error'
      );
    } finally {
      setSubmitting(false);
    }
  }, [replyText, newCommentText, currentUser, pageId, handleLogin, checkAntiSpam, showNotice]);

  // ─────────────────────────────────────────────────────────────────────────
  // 8. Edit (content only)
  // ─────────────────────────────────────────────────────────────────────────
  const handleSaveEdit = useCallback(async (commentId: string) => {
    if (!editText.trim() || !currentUser) return;
    setSubmitting(true);
    try {
      await updateDoc(doc(db, 'comments', commentId), { content: editText.trim() });
      // onSnapshot will update the list automatically
      setEditingCommentId(null);
      setEditText('');
      showNotice('Comment updated!');
    } catch (err: any) {
      console.error(err);
      showNotice('Failed to update comment.', 'error');
    } finally { setSubmitting(false); }
  }, [editText, currentUser, showNotice]);

  // ─────────────────────────────────────────────────────────────────────────
  // 9. Delete
  // ─────────────────────────────────────────────────────────────────────────
  const handleDeleteComment = useCallback(async (commentId: string) => {
    if (!currentUser || !window.confirm('Delete this comment?')) return;
    try {
      await deleteDoc(doc(db, 'comments', commentId));
      // onSnapshot removes it automatically
      showNotice('Comment deleted.');
    } catch (err: any) {
      console.error(err);
      showNotice('Failed to delete.', 'error');
    }
  }, [currentUser, showNotice]);

  // ─────────────────────────────────────────────────────────────────────────
  // 10. Like / Unlike
  // ─────────────────────────────────────────────────────────────────────────
  const handleToggleLike = useCallback(async (commentId: string) => {
    if (!currentUser) { await handleLogin(); return; }
    const liked = !!userLikesMap[commentId];
    const likeRef = doc(db, 'comments', commentId, 'likes', currentUser.uid);
    setUserLikesMap(prev => ({ ...prev, [commentId]: !liked }));
    try {
      if (liked) await deleteDoc(likeRef);
      else await setDoc(likeRef, { likedAt: serverTimestamp() });
    } catch (err: any) {
      console.error(err);
      setUserLikesMap(prev => ({ ...prev, [commentId]: liked }));
      showNotice('Action failed.', 'error');
    }
  }, [currentUser, userLikesMap, handleLogin, showNotice]);

  // ─────────────────────────────────────────────────────────────────────────
  // 11. Report
  // ─────────────────────────────────────────────────────────────────────────
  const handleSubmitReport = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportingCommentId || !currentUser) return;
    if (userReportsMap[reportingCommentId]) {
      showNotice('You have already reported this comment.', 'error');
      setReportingCommentId(null);
      return;
    }
    setSubmitting(true);
    try {
      await setDoc(doc(db, 'commentReports', `${reportingCommentId}_${currentUser.uid}`), {
        commentId: reportingCommentId,
        reporterUid: currentUser.uid,
        reason: reportReason,
        description: reportDescription.trim().slice(0, 500),
        status: 'pending',
        createdAt: serverTimestamp(),
      });
      setUserReportsMap(prev => ({ ...prev, [reportingCommentId]: true }));
      showNotice('Comment reported. Thank you.');
      setReportingCommentId(null);
      setReportDescription('');
    } catch (err: any) {
      console.error(err);
      showNotice('Failed to submit report.', 'error');
    } finally { setSubmitting(false); }
  }, [reportingCommentId, currentUser, userReportsMap, reportReason, reportDescription, showNotice]);

  // ─────────────────────────────────────────────────────────────────────────
  // 12. Block user (local, localStorage)
  // ─────────────────────────────────────────────────────────────────────────
  const handleBlockUser = useCallback((uid: string, name: string) => {
    if (!window.confirm(`Block comments from ${name}? You will no longer see their posts.`)) return;
    const updated = [...blockedUsers, uid];
    setBlockedUsers(updated);
    try { localStorage.setItem('nv_user_blocks', JSON.stringify(updated)); } catch {}
    showNotice(`${name} blocked.`);
  }, [blockedUsers, showNotice]);

  // ─────────────────────────────────────────────────────────────────────────
  // Drawer body — shared between desktop drawer and mobile bottom-sheet
  // ─────────────────────────────────────────────────────────────────────────
  const DrawerBody = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 shrink-0">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-blue-600" />
          <span className="font-black text-sm text-slate-900">
            {pageTitle}
          </span>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
            {visibleCount}
          </span>
        </div>
        <button
          onClick={() => setDrawerOpen(false)}
          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Auth bar */}
      <div className="px-4 py-2 border-b border-slate-100 shrink-0">
        {currentUser ? (
          <div className="flex items-center gap-2 text-xs text-slate-600 font-semibold">
            <UserCheck className="h-3.5 w-3.5 text-emerald-500" />
            <span className="truncate max-w-[200px]">{currentUser.displayName}</span>
          </div>
        ) : (
          <button
            onClick={handleLogin}
            className="flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50
                       hover:bg-blue-100 px-3 py-1.5 rounded-lg border border-blue-200 transition-colors"
          >
            <Lock className="h-3.5 w-3.5" /> Sign in with Google to comment
          </button>
        )}
      </div>

      {/* Notice */}
      {notice && (
        <div className={`mx-4 mt-2 p-2.5 rounded-xl flex items-center justify-between text-xs font-bold shrink-0 ${
          notice.type === 'error'
            ? 'bg-red-50 text-red-700 border border-red-200'
            : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
        }`}>
          <div className="flex items-center gap-1.5">
            {notice.type === 'error'
              ? <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              : <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />}
            {notice.message}
          </div>
          <button onClick={() => setNotice(null)}><X className="h-3 w-3" /></button>
        </div>
      )}

      {/* Comment input */}
      <div className="px-4 py-3 border-b border-slate-100 shrink-0">
        <form onSubmit={e => handleCreateComment(e, null)}>
          <textarea
            value={newCommentText}
            onChange={e => setNewCommentText(e.target.value)}
            placeholder={
              currentUser
                ? 'Share your thoughts or ask a question…'
                : 'Sign in above to post a comment…'
            }
            rows={2}
            maxLength={2000}
            disabled={!currentUser}
            onClick={() => { if (!currentUser) handleLogin(); }}
            className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-xs
                       text-slate-800 placeholder-slate-400 resize-none
                       focus:outline-none focus:ring-2 focus:ring-blue-500
                       disabled:bg-slate-50 disabled:cursor-pointer transition-all"
          />
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-[10px] text-slate-400">{newCommentText.length}/2000</span>
            <button
              type="submit"
              disabled={submitting || !newCommentText.trim() || !currentUser}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50
                         text-white font-bold px-3.5 py-1.5 rounded-xl text-xs
                         flex items-center gap-1.5 transition-colors"
            >
              <Send className="h-3.5 w-3.5" /> Post
            </button>
          </div>
        </form>
      </div>

      {/* Comments list — scrollable */}
      <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {loading ? (
          <div className="text-center py-10 text-slate-400 text-xs">Loading comments…</div>
        ) : topLevel.length === 0 ? (
          <div className="text-center py-10">
            <Sparkles className="h-8 w-8 text-slate-200 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-600">No comments yet.</p>
            <p className="text-[11px] text-slate-400 mt-1">Be the first to start the discussion!</p>
          </div>
        ) : (
          <>
            {topLevel.map(comment => (
              <CommentCard
                key={comment.id}
                comment={comment}
                replies={repliesMap[comment.id] || []}
                currentUser={currentUser}
                isLiked={!!userLikesMap[comment.id]}
                isReported={!!userReportsMap[comment.id]}
                isEditing={editingCommentId === comment.id}
                editText={editText}
                replyParentId={replyParentId}
                replyText={replyText}
                submitting={submitting}
                onToggleLike={handleToggleLike}
                onSetReply={setReplyParentId}
                onSetReplyText={setReplyText}
                onSubmitReply={handleCreateComment}
                onStartEdit={(id, content) => { setEditingCommentId(id); setEditText(content); }}
                onCancelEdit={() => setEditingCommentId(null)}
                onSetEditText={setEditText}
                onSaveEdit={handleSaveEdit}
                onDelete={handleDeleteComment}
                onReport={setReportingCommentId}
                onBlock={handleBlockUser}
                userLikesMap={userLikesMap}
              />
            ))}

            {/* Load older comments */}
            {hasMore && (
              <div className="text-center pt-2">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="bg-slate-100 hover:bg-slate-200 disabled:opacity-50
                             text-slate-700 font-bold px-4 py-2 rounded-xl text-xs
                             flex items-center gap-1.5 mx-auto border border-slate-200 transition-colors"
                >
                  <ChevronDown className="h-4 w-4" />
                  {loadingMore ? 'Loading…' : 'Load older comments'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Floating button — visible on desktop when not explicitly hidden */}
      {!hideFloatingButton && (
        <FloatingCommentsButton count={visibleCount} onClick={() => setDrawerOpen(true)} />
      )}

      {/* ── Desktop drawer — right side, ~400px ─────────────────────────── */}
      {drawerOpen && (
        <>
          {/* Overlay (click to close) */}
          <div
            className="hidden md:block fixed inset-0 z-40 bg-slate-900/20"
            onClick={() => setDrawerOpen(false)}
          />
          {/* Drawer */}
          <div
            className="hidden md:flex fixed right-0 top-0 bottom-0 z-50
                       w-[400px] max-w-[95vw] bg-white shadow-2xl
                       flex-col border-l border-slate-200
                       animate-in slide-in-from-right duration-300"
          >
            {DrawerBody}
          </div>
        </>
      )}

      {/* ── Mobile bottom-sheet ──────────────────────────────────────────── */}
      {drawerOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 z-40 bg-slate-900/30"
            onClick={() => setDrawerOpen(false)}
          />
          {/* Bottom sheet: stops above sticky nav (bottom-[64px]) */}
          <div
            className="md:hidden fixed left-0 right-0 bottom-[64px] z-50
                       bg-white rounded-t-2xl shadow-2xl border-t border-slate-200
                       flex flex-col
                       max-h-[82vh]
                       animate-in slide-in-from-bottom duration-300"
          >
            {/* Pull handle */}
            <div className="flex justify-center pt-2 pb-1 shrink-0">
              <div className="w-10 h-1 rounded-full bg-slate-300" />
            </div>
            {DrawerBody}
          </div>
        </>
      )}

      {/* ── Report Modal ─────────────────────────────────────────────────── */}
      {reportingCommentId && (
        <div className="fixed inset-0 bg-slate-900/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-amber-600 font-black text-sm">
                <ShieldAlert className="h-5 w-5" /> Report Comment
              </div>
              <button onClick={() => setReportingCommentId(null)}>
                <X className="h-4 w-4 text-slate-400 hover:text-slate-600" />
              </button>
            </div>
            <form onSubmit={handleSubmitReport} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Reason</label>
                <select
                  value={reportReason}
                  onChange={e => setReportReason(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-blue-500"
                >
                  {REPORT_REASONS.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Details ({reportDescription.length}/500)
                </label>
                <textarea
                  value={reportDescription}
                  onChange={e => setReportDescription(e.target.value)}
                  placeholder="Optional: additional context for moderators…"
                  rows={3}
                  maxLength={500}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setReportingCommentId(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >Cancel</button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl"
                >Submit Report</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
