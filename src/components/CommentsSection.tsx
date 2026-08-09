import React, { useState, useEffect, useMemo } from 'react';
import { 
  MessageSquare, Heart, Reply, Trash2, Edit2, Send, X, AlertCircle, 
  CheckCircle2, Lock, Sparkles, UserCheck
} from 'lucide-react';
import { 
  collection, query, where, orderBy, limit, addDoc, updateDoc, 
  deleteDoc, doc, setDoc, getDoc, onSnapshot, serverTimestamp 
} from 'firebase/firestore';
import { db, auth, googleProvider } from '../lib/firebase';
import { signInWithPopup } from 'firebase/auth';

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
}

interface CommentsSectionProps {
  pageId: string;
  pageTitle?: string;
}

export default function CommentsSection({ pageId, pageTitle = 'Discussion & Q&A' }: CommentsSectionProps) {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [userLikesMap, setUserLikesMap] = useState<Record<string, boolean>>({});
  const [newCommentText, setNewCommentText] = useState('');
  const [replyParentId, setReplyParentId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const currentUser = auth.currentUser;

  const showNotice = (message: string, type: 'success' | 'error' = 'success') => {
    setNotice({ message, type });
    setTimeout(() => setNotice(null), 4000);
  };

  // 1. Subscribe to Firestore Comments for this page
  useEffect(() => {
    setLoading(true);
    try {
      const q = query(
        collection(db, 'comments'),
        where('page_id', '==', pageId),
        orderBy('created_at', 'asc'),
        limit(100)
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const loaded: CommentItem[] = snapshot.docs.map((d) => ({
            id: d.id,
            ...d.data()
          })) as CommentItem[];

          setComments(loaded);
          setLoading(false);
        },
        (err: any) => {
          console.error('Firestore comments subscribe error:', err);
          if (err?.code === 'permission-denied') {
            showNotice('Permission denied while reading comments.', 'error');
          } else {
            showNotice('Failed to load comments. Please refresh.', 'error');
          }
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error('Query setup error:', err);
      setLoading(false);
    }
  }, [pageId]);

  // 2. Fetch User Likes for loaded comments if user is authenticated
  useEffect(() => {
    if (!currentUser || comments.length === 0) {
      setUserLikesMap({});
      return;
    }

    let isMounted = true;
    const fetchUserLikes = async () => {
      const likesState: Record<string, boolean> = {};
      for (const comment of comments) {
        try {
          const likeDocRef = doc(db, 'comments', comment.id, 'likes', currentUser.uid);
          const snap = await getDoc(likeDocRef);
          if (snap.exists()) {
            likesState[comment.id] = true;
          }
        } catch {
          // Ignore individual fetch errors
        }
      }
      if (isMounted) {
        setUserLikesMap(likesState);
      }
    };

    fetchUserLikes();
    return () => { isMounted = false; };
  }, [currentUser, comments]);

  // Handle Google Login Trigger
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      showNotice('Successfully signed in with Google!');
    } catch (err: any) {
      console.error('Login error:', err);
      showNotice('Sign-in failed. Please try again.', 'error');
    }
  };

  // Create New Comment or Reply
  const handleCreateComment = async (e: React.FormEvent, parentId: string | null = null) => {
    e.preventDefault();
    const textToSubmit = parentId ? replyText : newCommentText;
    
    if (!textToSubmit.trim()) {
      showNotice('Comment text cannot be empty.', 'error');
      return;
    }

    if (!currentUser) {
      await handleLogin();
      return;
    }

    setSubmitting(true);
    try {
      const commentPayload = {
        page_id: pageId,
        author_name: currentUser.displayName || 'Candidate',
        author_role: 'Candidate',
        author_uid: currentUser.uid,
        content: textToSubmit.trim(),
        likes_count: 0,
        parent_id: parentId || null,
        created_at: serverTimestamp()
      };

      await addDoc(collection(db, 'comments'), commentPayload);

      if (parentId) {
        setReplyText('');
        setReplyParentId(null);
        showNotice('Reply posted successfully!');
      } else {
        setNewCommentText('');
        showNotice('Comment posted successfully!');
      }
    } catch (err: any) {
      console.error('Error creating comment:', err);
      if (err?.code === 'permission-denied') {
        showNotice('Permission denied: Unable to post comment.', 'error');
      } else {
        showNotice('Failed to post comment. Please try again.', 'error');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Edit Comment (Updates ONLY content field to satisfy security rules)
  const handleSaveEdit = async (commentId: string) => {
    if (!editText.trim()) {
      showNotice('Edit content cannot be empty.', 'error');
      return;
    }

    if (!currentUser) {
      showNotice('Please sign in to edit your comment.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const commentRef = doc(db, 'comments', commentId);
      await updateDoc(commentRef, {
        content: editText.trim()
      });

      setEditingCommentId(null);
      setEditText('');
      showNotice('Comment updated successfully!');
    } catch (err: any) {
      console.error('Error updating comment:', err);
      if (err?.code === 'permission-denied') {
        showNotice('Permission denied: You can only edit your own comments.', 'error');
      } else {
        showNotice('Failed to update comment.', 'error');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Comment
  const handleDeleteComment = async (commentId: string) => {
    if (!currentUser) return;
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      await deleteDoc(doc(db, 'comments', commentId));
      showNotice('Comment deleted.');
    } catch (err: any) {
      console.error('Error deleting comment:', err);
      if (err?.code === 'permission-denied') {
        showNotice('Permission denied: You can only delete your own comments.', 'error');
      } else {
        showNotice('Failed to delete comment.', 'error');
      }
    }
  };

  // Toggle Like / Unlike (Uses comments/{commentId}/likes/{userId} subcollection)
  const handleToggleLike = async (commentId: string) => {
    if (!currentUser) {
      await handleLogin();
      return;
    }

    const isCurrentlyLiked = !!userLikesMap[commentId];
    const likeRef = doc(db, 'comments', commentId, 'likes', currentUser.uid);

    // Optimistic UI Update
    setUserLikesMap((prev) => ({ ...prev, [commentId]: !isCurrentlyLiked }));

    try {
      if (isCurrentlyLiked) {
        await deleteDoc(likeRef);
      } else {
        await setDoc(likeRef, {
          likedAt: serverTimestamp()
        });
      }
    } catch (err: any) {
      console.error('Error toggling like:', err);
      // Revert optimistic update on failure
      setUserLikesMap((prev) => ({ ...prev, [commentId]: isCurrentlyLiked }));
      if (err?.code === 'permission-denied') {
        showNotice('Permission denied while liking comment.', 'error');
      } else {
        showNotice('Action failed. Please try again.', 'error');
      }
    }
  };

  // Split Top-level Comments vs Replies
  const topLevelComments = useMemo(() => comments.filter((c) => !c.parent_id), [comments]);
  const repliesMap = useMemo(() => {
    const map: Record<string, CommentItem[]> = {};
    comments.forEach((c) => {
      if (c.parent_id) {
        if (!map[c.parent_id]) map[c.parent_id] = [];
        map[c.parent_id].push(c);
      }
    });
    return map;
  }, [comments]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 my-8">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-black text-slate-900 text-base sm:text-lg tracking-tight">
              {pageTitle}
            </h3>
            <p className="text-xs font-medium text-slate-500">
              Community Discussion ({comments.length} Comments)
            </p>
          </div>
        </div>

        {currentUser ? (
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            <UserCheck className="h-4 w-4 text-emerald-600" />
            <span className="text-xs font-bold text-slate-700 max-w-[120px] truncate">
              {currentUser.displayName || 'Logged In'}
            </span>
          </div>
        ) : (
          <button
            onClick={handleLogin}
            className="flex items-center gap-1.5 text-xs font-bold bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg transition-colors border border-blue-200"
          >
            <Lock className="h-3.5 w-3.5" /> Sign in to Discuss
          </button>
        )}
      </div>

      {/* Notice Banner */}
      {notice && (
        <div className={`mb-4 p-3 rounded-xl flex items-center justify-between text-xs font-bold ${
          notice.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
        }`}>
          <div className="flex items-center gap-2">
            {notice.type === 'error' ? <AlertCircle className="h-4 w-4 shrink-0" /> : <CheckCircle2 className="h-4 w-4 shrink-0" />}
            <span>{notice.message}</span>
          </div>
          <button onClick={() => setNotice(null)} className="opacity-70 hover:opacity-100">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Main Comment Input Box */}
      <form onSubmit={(e) => handleCreateComment(e, null)} className="mb-8">
        <div className="relative">
          <textarea
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            placeholder={currentUser ? "Share your thoughts or ask a question about this notification..." : "Click to sign in with Google and post a comment..."}
            rows={3}
            maxLength={2000}
            onClick={() => { if (!currentUser) handleLogin(); }}
            className="w-full rounded-xl border border-slate-300 p-3.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-xs"
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-[11px] text-slate-400 font-medium">
              {newCommentText.length}/2000 characters
            </span>
            <button
              type="submit"
              disabled={submitting || !newCommentText.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Send className="h-3.5 w-3.5" /> Post Comment
            </button>
          </div>
        </div>
      </form>

      {/* Comments Feed List */}
      {loading ? (
        <div className="text-center py-8 text-slate-400 text-xs font-medium">
          Loading discussion comments...
        </div>
      ) : topLevelComments.length === 0 ? (
        <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
          <Sparkles className="h-8 w-8 text-slate-300 mx-auto mb-2" />
          <p className="text-xs font-bold text-slate-600">No comments yet.</p>
          <p className="text-[11px] text-slate-400 mt-1">Be the first candidate to start the discussion!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {topLevelComments.map((comment) => {
            const isOwner = currentUser?.uid === comment.author_uid;
            const isLiked = !!userLikesMap[comment.id];
            const childReplies = repliesMap[comment.id] || [];

            return (
              <div key={comment.id} className="bg-slate-50/70 border border-slate-200 rounded-xl p-4 transition-all">
                {/* Author Bar */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center uppercase">
                      {comment.author_name.charAt(0)}
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 text-xs block">{comment.author_name}</span>
                      <span className="text-[10px] text-slate-500 block">{comment.author_role}</span>
                    </div>
                  </div>
                  
                  {isOwner && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingCommentId(comment.id);
                          setEditText(comment.content);
                        }}
                        className="p-1 text-slate-400 hover:text-blue-600 transition-colors"
                        title="Edit comment"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                        title="Delete comment"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Comment Content or Edit Form */}
                {editingCommentId === comment.id ? (
                  <div className="my-2 space-y-2">
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      rows={2}
                      maxLength={2000}
                      className="w-full rounded-lg border border-blue-400 p-2 text-xs text-slate-800 focus:outline-none"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSaveEdit(comment.id)}
                        disabled={submitting}
                        className="bg-blue-600 text-white font-bold px-3 py-1 rounded text-xs"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingCommentId(null)}
                        className="bg-slate-200 text-slate-700 font-bold px-3 py-1 rounded text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal whitespace-pre-wrap">
                    {comment.content}
                  </p>
                )}

                {/* Action Buttons Bar */}
                <div className="flex items-center gap-4 mt-3 pt-2 border-t border-slate-200/60">
                  <button
                    onClick={() => handleToggleLike(comment.id)}
                    className={`flex items-center gap-1 text-xs font-bold transition-colors ${
                      isLiked ? 'text-red-600' : 'text-slate-500 hover:text-red-500'
                    }`}
                  >
                    <Heart className={`h-3.5 w-3.5 ${isLiked ? 'fill-current text-red-600' : ''}`} />
                    <span>{isLiked ? '♥ Liked' : '♡ Like'}</span>
                  </button>

                  <button
                    onClick={() => setReplyParentId(replyParentId === comment.id ? null : comment.id)}
                    className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors"
                  >
                    <Reply className="h-3.5 w-3.5" />
                    <span>Reply</span>
                  </button>
                </div>

                {/* Inline Reply Form */}
                {replyParentId === comment.id && (
                  <form onSubmit={(e) => handleCreateComment(e, comment.id)} className="mt-3 pl-4 border-l-2 border-blue-500">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Write a reply..."
                        maxLength={2000}
                        className="flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <button
                        type="submit"
                        disabled={submitting || !replyText.trim()}
                        className="bg-blue-600 text-white font-bold px-3 py-1.5 rounded-lg text-xs"
                      >
                        Reply
                      </button>
                    </div>
                  </form>
                )}

                {/* Child Replies Feed */}
                {childReplies.length > 0 && (
                  <div className="mt-3 pl-4 space-y-2 border-l-2 border-slate-200">
                    {childReplies.map((reply) => {
                      const isReplyOwner = currentUser?.uid === reply.author_uid;
                      const isReplyLiked = !!userLikesMap[reply.id];

                      return (
                        <div key={reply.id} className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-xs text-slate-800">{reply.author_name}</span>
                            {isReplyOwner && (
                              <button
                                onClick={() => handleDeleteComment(reply.id)}
                                className="text-slate-400 hover:text-red-600 text-[10px]"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                          <p className="text-xs text-slate-600 whitespace-pre-wrap">{reply.content}</p>
                          <button
                            onClick={() => handleToggleLike(reply.id)}
                            className={`mt-2 flex items-center gap-1 text-[11px] font-bold ${
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
          })}
        </div>
      )}
    </div>
  );
}
