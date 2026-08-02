import React, { useState, useEffect, useCallback } from 'react';
import { 
  MessageSquare, Send, ThumbsUp, Reply, CornerDownRight, 
  ShieldCheck, AlertCircle, CheckCircle2, Copy, Check, Terminal, 
  ChevronDown, ChevronUp, X, ArrowLeft, LogIn, User as UserIcon, RefreshCw, Trash2
} from 'lucide-react';
import { supabase, isSupabaseConfigured, CommentItem } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot, addDoc, doc, updateDoc, deleteDoc, increment } from 'firebase/firestore';

interface CommentsSectionProps {
  pageId: string;
  pageTitle?: string;
}

export default function CommentsSection({ pageId, pageTitle = 'Discussion & Q&A' }: CommentsSectionProps) {
  const { user, loginWithGoogle, openLoginModal } = useAuth();

  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [authorRole, setAuthorRole] = useState<string>('Aspirant');
  const [content, setContent] = useState<string>('');
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setIsLoggingIn(true);
    setLoginError(null);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      console.error("Login error:", err);
      if (err.code === 'auth/popup-closed-by-user') {
        setLoginError("Sign-in popup was closed before completing. Please try again.");
      } else if (err.code === 'auth/popup-blocked') {
        setLoginError("Popups blocked by browser settings. Please allow popups or open in a direct tab.");
      } else if (err.code === 'auth/unauthorized-domain') {
        const domain = typeof window !== 'undefined' ? window.location.hostname : 'this domain';
        setLoginError(`Domain Unauthorized (${domain}): Make sure BOTH '${domain}' AND 'www.${domain.replace('www.', '')}' are added in Firebase Console -> Authentication -> Settings -> Authorised domains.`);
      } else {
        setLoginError(err.message || "Sign-in failed. Please try again.");
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Drawer / Overlay visibility
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Fetch comments from localStorage fallback
  const loadFromLocalStorage = useCallback(() => {
    const stored = localStorage.getItem(`nva_comments_${pageId}`);
    if (stored) {
      try {
        setComments(JSON.parse(stored));
      } catch {
        setComments([]);
      }
    } else {
      setComments([]);
    }
  }, [pageId]);

  // Subscribe to real-time comments from Firestore
  useEffect(() => {
    setLoading(true);
    let unsubscribe = () => {};

    try {
      const q = query(
        collection(db, 'comments'),
        where('page_id', '==', pageId)
      );

      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const list: CommentItem[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            const rawParentId = data.parent_id;
            let parentId: string | null = null;
            if (rawParentId && typeof rawParentId === 'string') {
              const trimmed = rawParentId.trim().toLowerCase();
              if (trimmed !== '' && trimmed !== 'null' && trimmed !== 'undefined') {
                parentId = rawParentId.trim();
              }
            }
            list.push({
              id: docSnap.id,
              page_id: data.page_id || pageId,
              author_name: data.author_name || 'Anonymous',
              author_role: data.author_role || 'Aspirant',
              author_uid: data.author_uid || '',
              author_email: data.author_email || '',
              content: data.content || '',
              likes_count: data.likes_count || 0,
              parent_id: parentId,
              created_at: data.created_at || new Date().toISOString(),
            });
          });
          // Sort descending by created_at date
          list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          setComments(list);
          setLoading(false);
        },
        (error) => {
          console.warn('Firestore subscription notice, falling back to local storage:', error);
          loadFromLocalStorage();
          setLoading(false);
        }
      );
    } catch (err) {
      console.warn('Firestore subscription exception:', err);
      loadFromLocalStorage();
      setLoading(false);
    }

    return () => {
      unsubscribe();
    };
  }, [pageId, loadFromLocalStorage]);

  // Save to local storage as fallback
  const saveLocalFallback = (newComment: CommentItem) => {
    const updated = [newComment, ...comments];
    setComments(updated);
    localStorage.setItem(`nva_comments_${pageId}`, JSON.stringify(updated));
  };

  // Submit comment (Guarded by Google Auth)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      openLoginModal(
        undefined,
        'Google Login Required',
        'Please sign in with your Google account to post comments and join the candidate community.'
      );
      return;
    }

    const displayName = user.displayName || user.email || 'Anonymous Candidate';
    if (!content.trim()) return;

    setSubmitting(true);
    setSuccessMsg('');

    const newCommentData = {
      page_id: pageId,
      author_name: displayName,
      author_role: authorRole.trim() || 'Aspirant',
      author_uid: user.uid || '',
      author_email: user.email || '',
      content: content.trim(),
      likes_count: 0,
      parent_id: replyToId || null,
      created_at: new Date().toISOString(),
    };

    try {
      // Save directly to global Firestore database
      await addDoc(collection(db, 'comments'), newCommentData);
    } catch (err) {
      console.error("Firestore comment submission failed, trying fallbacks:", err);
      if (isSupabaseConfigured && supabase) {
        try {
          const { data } = await supabase.from('comments').insert([newCommentData]).select().single();
          if (data) {
            setComments((prev) => [data, ...prev]);
          } else {
            saveLocalFallback({ id: 'local-' + Date.now(), ...newCommentData });
          }
        } catch {
          saveLocalFallback({ id: 'local-' + Date.now(), ...newCommentData });
        }
      } else {
        saveLocalFallback({ id: 'local-' + Date.now(), ...newCommentData });
      }
    }

    setContent('');
    setReplyToId(null);
    setSubmitting(false);
    setSuccessMsg('Your comment has been posted!');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  // Like comment
  const handleLike = async (commentId: string) => {
    if (likedComments.has(commentId)) return;

    const newLiked = new Set(likedComments);
    newLiked.add(commentId);
    setLikedComments(newLiked);

    setComments((prev) =>
      prev.map((c) => (c.id === commentId ? { ...c, likes_count: c.likes_count + 1 } : c))
    );

    try {
      const commentRef = doc(db, 'comments', commentId);
      await updateDoc(commentRef, {
        likes_count: increment(1)
      });
    } catch (err) {
      console.warn("Firestore like update error:", err);
      if (isSupabaseConfigured && supabase) {
        try {
          const comment = comments.find((c) => c.id === commentId);
          if (comment) {
            await supabase
              .from('comments')
              .update({ likes_count: comment.likes_count + 1 })
              .eq('id', commentId);
          }
        } catch {
          // Fallback silently
        }
      }
    }
  };

  // Check if a comment was authored by the current user
  const isOwnComment = (comment: CommentItem) => {
    if (!user) return false;
    if (comment.author_uid && user.uid && comment.author_uid === user.uid) return true;
    if (comment.author_email && user.email && comment.author_email.toLowerCase() === user.email.toLowerCase()) return true;
    if (user.displayName && comment.author_name === user.displayName) return true;
    if (user.email && comment.author_name === user.email) return true;
    return false;
  };

  // Delete self comment or reply
  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm("Are you sure you want to delete your comment?")) return;

    // Optimistic local update (remove comment and any replies referencing it)
    setComments((prev) => prev.filter((c) => c.id !== commentId && c.parent_id !== commentId));

    try {
      const commentRef = doc(db, 'comments', commentId);
      await deleteDoc(commentRef);
    } catch (err) {
      console.warn("Firestore delete comment error:", err);
      if (isSupabaseConfigured && supabase) {
        try {
          await supabase.from('comments').delete().eq('id', commentId);
        } catch {
          // Fallback silently
        }
      }
    }

    // Update local storage fallback if used
    const stored = localStorage.getItem(`nva_comments_${pageId}`);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as CommentItem[];
        const filtered = parsed.filter((c) => c.id !== commentId && c.parent_id !== commentId);
        localStorage.setItem(`nva_comments_${pageId}`, JSON.stringify(filtered));
      } catch {
        // Ignore fallback errors
      }
    }
  };

  // Organize comments into top-level and replies
  const topLevelComments = comments.filter((c) => {
    if (!c.parent_id) return true;
    if (typeof c.parent_id === 'string') {
      const trimmed = c.parent_id.trim().toLowerCase();
      if (trimmed === '' || trimmed === 'null' || trimmed === 'undefined') return true;
    }
    // If parent_id doesn't match any existing comment ID, treat as top-level so it is displayed
    return !comments.some((p) => p.id === c.parent_id);
  });

  const getReplies = (parentId: string) => 
    comments.filter((c) => c.parent_id && c.parent_id === parentId && c.id !== parentId);

  // Time formatting
  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const diffMs = Date.now() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return 'Recently';
    }
  };

  const getAvatarGradient = (name: string) => {
    const gradients = [
      'from-blue-600 to-indigo-700',
      'from-purple-600 to-pink-600',
      'from-emerald-600 to-teal-700',
      'from-amber-500 to-orange-600',
      'from-indigo-600 to-cyan-600',
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % gradients.length;
    return gradients[index];
  };

  // Render Inner Comment Content (Used both in inline and in drawer/mobile full view)
  const renderCommentsContent = () => (
    <div className="space-y-6">
      {/* Header Info & Database Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-[11px] font-black uppercase tracking-wider mb-2">
            <MessageSquare className="w-3.5 h-3.5 text-blue-600" /> Community Comments
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Comments ({comments.length})
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
            Ask questions, share exam tips, and discuss with fellow candidates.
          </p>
        </div>

        {/* Database Status Badge */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Live Q&A Connected
          </span>
        </div>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-emerald-800 text-xs font-bold animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Comments List (Appears FIRST) */}
      <div className="space-y-4 pt-1">
        {loading ? (
          <div className="text-center py-8 text-slate-400 font-bold text-xs space-y-2">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p>Loading comments...</p>
          </div>
        ) : topLevelComments.length === 0 ? (
          <div className="text-center py-8 bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-6">
            <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-700">No comments yet.</p>
            <p className="text-[11px] font-medium text-slate-500 mt-0.5">
              Be the first candidate to post a comment on <strong>{pageTitle}</strong>!
            </p>
          </div>
        ) : (
          topLevelComments.map((comment) => {
            const replies = getReplies(comment.id);
            const initials = comment.author_name.slice(0, 2).toUpperCase();

            return (
              <div key={comment.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${getAvatarGradient(comment.author_name)} text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs`}>
                    {initials}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-900 text-xs">{comment.author_name}</span>
                        {comment.author_role && comment.author_role !== 'Aspirant' && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-100 text-blue-800">
                            {comment.author_role}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-semibold text-slate-400">
                        {formatTime(comment.created_at)}
                      </span>
                    </div>

                    <p className="text-xs font-medium text-slate-700 leading-relaxed pt-0.5">
                      {comment.content}
                    </p>

                    <div className="flex items-center justify-between pt-2 text-[11px] font-bold text-slate-500">
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() => handleLike(comment.id)}
                          className={`flex items-center gap-1 hover:text-blue-600 transition cursor-pointer ${
                            likedComments.has(comment.id) ? 'text-blue-600 font-black' : ''
                          }`}
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span>{comment.likes_count} Likes</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setReplyToId(comment.id)}
                          className="flex items-center gap-1 hover:text-blue-600 transition cursor-pointer"
                        >
                          <Reply className="w-3.5 h-3.5" />
                          <span>Reply</span>
                        </button>
                      </div>

                      {isOwnComment(comment) && (
                        <button
                          type="button"
                          onClick={() => handleDeleteComment(comment.id)}
                          className="flex items-center gap-1 text-red-500 hover:text-red-700 transition cursor-pointer text-[11px] font-bold"
                          title="Delete your comment"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {replies.length > 0 && (
                  <div className="ml-5 sm:ml-8 pt-2 border-l-2 border-blue-200 pl-3 space-y-2.5">
                    {replies.map((reply) => (
                      <div key={reply.id} className="flex items-start gap-2 text-xs bg-white p-2.5 rounded-xl border border-slate-200">
                        <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${getAvatarGradient(reply.author_name)} text-white font-black text-[9px] flex items-center justify-center shrink-0`}>
                          {reply.author_name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1 space-y-0.5">
                          <div className="flex justify-between items-center">
                            <span className="font-black text-slate-900 text-[11px]">{reply.author_name}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] text-slate-400 font-semibold">{formatTime(reply.created_at)}</span>
                              {isOwnComment(reply) && (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteComment(reply.id)}
                                  className="text-red-500 hover:text-red-700 transition cursor-pointer flex items-center gap-0.5"
                                  title="Delete your reply"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  <span className="text-[10px] font-bold">Delete</span>
                                </button>
                              )}
                            </div>
                          </div>
                          <p className="text-slate-700 font-medium text-[11px]">{reply.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Compact Comment Form (Placed BELOW comments list) */}
      {user ? (
        <form onSubmit={handleSubmit} className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 sm:p-4 space-y-3 mt-4">
          {replyToId && (
            <div className="flex items-center justify-between bg-blue-50 text-blue-800 px-3 py-1.5 rounded-xl text-xs font-bold border border-blue-200">
              <span className="flex items-center gap-1.5">
                <CornerDownRight className="w-3.5 h-3.5 text-blue-600" /> Replying to comment
              </span>
              <button
                type="button"
                onClick={() => setReplyToId(null)}
                className="text-blue-600 hover:text-blue-900 font-black cursor-pointer text-xs"
              >
                Cancel Reply
              </button>
            </div>
          )}

          {/* Compact User Header with Icon & Name */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || 'User'} className="w-7 h-7 rounded-full border border-slate-300 object-cover shrink-0" />
              ) : (
                <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center shrink-0">
                  {(user.displayName || user.email || 'U')[0].toUpperCase()}
                </div>
              )}
              <span className="text-xs font-black text-slate-900 truncate">{user.displayName || user.email}</span>
            </div>

            <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Signed in
            </span>
          </div>

          {/* Textarea & Post Button Row */}
          <div className="space-y-2">
            <textarea
              required
              rows={2}
              placeholder="Write a comment..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl font-medium text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            />

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting || !content.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-300 text-white font-black text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submitting ? 'Posting...' : 'Post Comment'}</span>
              </button>
            </div>
          </div>
        </form>
      ) : (
        /* Compact Google Login Requirement Box */
        <div className="bg-slate-900 text-white rounded-2xl p-3.5 sm:p-4 border border-slate-800 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
              <UserIcon className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-black text-white truncate">Join the conversation</p>
              <p className="text-[10px] text-slate-400 truncate">Sign in with Google to post comments</p>
            </div>
          </div>

          <button
            type="button"
            disabled={isLoggingIn}
            onClick={handleGoogleSignIn}
            className="px-3.5 py-2 bg-white hover:bg-slate-100 disabled:bg-slate-200 text-slate-900 font-black text-xs rounded-xl flex items-center justify-center gap-2 transition cursor-pointer shrink-0"
          >
            {isLoggingIn ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
            ) : (
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
            )}
            <span>Sign In with Google</span>
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* 1. Main Inline Component Container */}
      <div className="bg-white border-2 border-slate-200 rounded-3xl p-5 sm:p-8 shadow-xs my-8">
        {renderCommentsContent()}
      </div>

      {/* 2. Floating Action Button for Mobile View (Icon only, slightly above bottom sticky bar) */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 z-50 sm:hidden w-11 h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl border-2 border-white flex items-center justify-center active:scale-95 transition-all cursor-pointer shadow-blue-500/30"
        aria-label="Open Comments"
        title="Open Comments"
      >
        <MessageSquare className="w-5 h-5 text-amber-300 shrink-0" />
        {comments.length > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-amber-400 text-blue-950 font-extrabold text-[10px] flex items-center justify-center border-2 border-white shadow-xs">
            {comments.length}
          </span>
        )}
      </button>

      {/* 3. Floating Sidebar Trigger for Desktop View (Right edge toggle tab) */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="hidden sm:flex fixed right-0 top-1/2 -translate-y-1/2 z-40 items-center gap-2 px-3.5 py-3 bg-blue-900 hover:bg-blue-800 text-white font-black text-xs rounded-l-2xl shadow-2xl border-l-2 border-y-2 border-blue-400 cursor-pointer transition-all active:scale-95 group"
        aria-label="Toggle Side Comments Drawer"
      >
        <MessageSquare className="w-4 h-4 text-amber-300 group-hover:scale-110 transition-transform" />
        <span className="tracking-wide">Comments ({comments.length})</span>
      </button>

      {/* 4. Full Page View overlay for Mobile View */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-white sm:hidden flex flex-col h-full w-full animate-fadeIn">
          {/* Top Sticky Header for Mobile */}
          <div className="sticky top-0 bg-blue-900 text-white p-4 border-b border-blue-800 flex items-center justify-between shrink-0 shadow-md">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl bg-blue-800 hover:bg-blue-700 text-white cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="text-center px-2 flex-1 min-w-0">
              <h2 className="text-sm font-black truncate text-white">{pageTitle}</h2>
              <div className="text-[10px] text-blue-200 font-bold">Candidate Q&A & Comments</div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl bg-blue-800 hover:bg-blue-700 text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Mobile Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {renderCommentsContent()}
          </div>
        </div>
      )}

      {/* 5. Desktop Side Drawer */}
      {isOpen && (
        <div className="hidden sm:block fixed inset-0 z-50">
          {/* Backdrop */}
          <div 
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity" 
          />
          
          {/* Slide-over Drawer */}
          <div className="absolute right-0 top-0 bottom-0 w-[480px] max-w-[90vw] bg-white border-l border-slate-200 shadow-2xl flex flex-col animate-slideInRight">
            {/* Header */}
            <div className="bg-slate-900 text-white p-5 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="space-y-0.5">
                <div className="inline-flex items-center gap-1.5 text-amber-400 font-black text-[10px] uppercase tracking-wider">
                  <MessageSquare className="w-3.5 h-3.5" /> Sidebar Comments
                </div>
                <h3 className="text-base font-black text-white truncate max-w-[360px]">{pageTitle}</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {renderCommentsContent()}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
