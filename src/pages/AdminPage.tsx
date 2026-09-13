import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router';
import * as ReactHelmetAsync from 'react-helmet-async';
const { Helmet } = (ReactHelmetAsync as any).default || ReactHelmetAsync;
import {
  Shield, Lock, Search, Filter, ArrowUpDown, ArrowUp, ArrowDown,
  Trash2, ExternalLink, Copy, Check, Eye, AlertTriangle, AlertCircle,
  CheckCircle2, User, LogOut, Clock, Calendar, Briefcase, Building2,
  MessageSquare, Flag, RefreshCw, Layers, Sparkles, ChevronLeft,
  ChevronRight, X, Download, Home, GraduationCap, Flame, ThumbsUp,
  FileText, CornerDownRight, CheckSquare, Square, SlidersHorizontal,
  Plus, ChevronDown, Hash, Sliders, Send, Users, Bell, MapPin,
  TrendingUp, BarChart2, XCircle
} from 'lucide-react';
import {
  collection, query, orderBy, limit, deleteDoc, doc, getDocs,
  onSnapshot, Timestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { JOBS_DATA, JobEntry } from '../data/jobsData';
import jobsIndexData from '../data/jobs-index-generated.json';
import { getJobUploadDate } from '../utils/jobUploadDate';
import { JobAlertSubscription, TelegramLink } from '../types/alertTypes';

interface CommentRecord {
  id: string;
  page_id: string;
  author_name: string;
  author_role: string;
  author_uid: string;
  content: string;
  likes_count: number;
  parent_id: string | null;
  created_at: any;
  status?: string;
}

interface ReportRecord {
  id: string;
  commentId: string;
  reporterUid: string;
  reason: string;
  description: string;
  status: string;
  createdAt: any;
}

const ADMIN_EMAIL = 'anand.textme@gmail.com';

// Helper to extract numerical vacancies from JobEntry
function getVacanciesCount(job: JobEntry): number {
  const indexInfo = (jobsIndexData as Record<string, any>)[job.id || ''];
  if (indexInfo && typeof indexInfo.vacancies === 'number') {
    return indexInfo.vacancies;
  }
  if (indexInfo && typeof indexInfo.vacancies === 'string') {
    const clean = indexInfo.vacancies.replace(/,/g, '');
    const m = clean.match(/(\d+)/);
    if (m) return parseInt(m[1], 10);
  }

  // Extract from title 't'
  const title = job.t || '';
  const matchCommas = title.match(/(\d{1,3}(?:,\d{3})+)/);
  if (matchCommas) {
    return parseInt(matchCommas[1].replace(/,/g, ''), 10);
  }
  const matchNum = title.match(/(?:for|for\s+|apply\s+for\s+|total\s+|of\s+)?(\d{1,6})\s*(?:posts|vacancies|positions|posts\b|vacancies\b)/i);
  if (matchNum) {
    return parseInt(matchNum[1], 10);
  }
  const anyNumMatch = title.match(/\b(\d{2,6})\b/);
  if (anyNumMatch) {
    const num = parseInt(anyNumMatch[1], 10);
    // Ignore year numbers like 2024, 2025, 2026, 2027 unless preceded by vacancy context
    if (num < 2020 || num > 2030) {
      return num;
    }
  }
  return 0;
}

// Parse date string into timestamp for sorting & status
function parseDateStrToTimestamp(dStr?: string): number {
  if (!dStr) return 0;
  const clean = dStr.trim();
  // Support DD-MM-YYYY or DD/MM/YYYY
  const matchDmy = clean.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})$/);
  if (matchDmy) {
    const d = new Date(parseInt(matchDmy[3], 10), parseInt(matchDmy[2], 10) - 1, parseInt(matchDmy[1], 10));
    return d.getTime();
  }
  // Support e.g. "28 August 2026" or "August 28, 2026"
  const d = new Date(clean);
  if (!isNaN(d.getTime())) {
    return d.getTime();
  }
  return 0;
}

// Check if job application date is expired
function isJobExpired(lastDateStr?: string): boolean {
  if (!lastDateStr) return false;
  const ts = parseDateStrToTimestamp(lastDateStr);
  if (ts === 0) return false;
  const now = Date.now();
  // End of the day for lastDate
  return ts + 24 * 60 * 60 * 1000 < now;
}

export type SortColumnKey = 'vacancies' | 'uploadDate' | 'lastDate' | 'title' | 'board' | 'status';

export interface SortLevel {
  column: SortColumnKey;
  order: 'asc' | 'desc';
}

export default function AdminPage() {
  const { user, loading, loginWithGoogle, logout, openLoginModal } = useAuth();

  // Authentication check
  const isAuthorized = Boolean(
    user && user.email && user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()
  );

  // Navigation tabs: 'jobs' | 'comments' | 'reports' | 'tools' | 'alerts'
  const [activeTab, setActiveTab] = useState<'jobs' | 'comments' | 'reports' | 'tools' | 'alerts'>('jobs');

  // -------------------------------------------------------------
  // Jobs State & Multi-Level Filters (Excel-style)
  // -------------------------------------------------------------
  const [jobSearch, setJobSearch] = useState('');
  const [jobSortPreset, setJobSortPreset] = useState<string>('combo-upload-vacancies');
  const [sortLevels, setSortLevels] = useState<SortLevel[]>([
    { column: 'uploadDate', order: 'desc' },
    { column: 'vacancies', order: 'desc' }
  ]);
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);
  const [openColumnFilter, setOpenColumnFilter] = useState<SortColumnKey | null>(null);
  const [minVacanciesFilter, setMinVacanciesFilter] = useState<number | null>(null);
  const [uploadDateFilter, setUploadDateFilter] = useState<'all' | '7days' | '30days' | 'this_month' | 'this_year'>('all');
  const [lastDateFilter, setLastDateFilter] = useState<'all' | 'active_7days' | 'active_15days' | 'active_30days' | 'expired'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'expired'>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [qualificationFilter, setQualificationFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const [selectedJob, setSelectedJob] = useState<JobEntry | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  // -------------------------------------------------------------
  // Comments State & Filters
  // -------------------------------------------------------------
  const [comments, setComments] = useState<CommentRecord[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentSearch, setCommentSearch] = useState('');
  const [commentTypeFilter, setCommentTypeFilter] = useState<'all' | 'parent' | 'reply'>('all');
  const [commentPageFilter, setCommentPageFilter] = useState('all');
  const [commentSortBy, setCommentSortBy] = useState<'newest' | 'oldest' | 'likes'>('newest');
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);
  const [deleteConfirmComment, setDeleteConfirmComment] = useState<CommentRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // -------------------------------------------------------------
  // Reports State
  // -------------------------------------------------------------
  const [reports, setReports] = useState<ReportRecord[]>([]);
  const [loadingReports, setLoadingReports] = useState(false);

  // -------------------------------------------------------------
  // Telegram & Alert Subscriptions State
  // -------------------------------------------------------------
  const [telegramLinks, setTelegramLinks] = useState<TelegramLink[]>([]);
  const [alertSubscriptions, setAlertSubscriptions] = useState<JobAlertSubscription[]>([]);
  const [loadingAlerts, setLoadingAlerts] = useState(false);
  const [subscriberSearch, setSubscriberSearch] = useState('');
  const [subscriberStatusFilter, setSubscriberStatusFilter] = useState<'all' | 'connected' | 'not_connected'>('all');
  const [subscriberQualFilter, setSubscriberQualFilter] = useState('all');
  const [subscriberLocFilter, setSubscriberLocFilter] = useState('all');
  const [subscriberPage, setSubscriberPage] = useState(1);
  const SUBSCRIBER_PAGE_SIZE = 25;
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    showToast(`Copied ${label} to clipboard!`);
    setTimeout(() => setCopiedText(null), 2500);
  };

  // Trigger Toast Notification
  const showToast = useCallback((text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  }, []);

  // Fetch / Listen to Comments (Only if Authorized)
  useEffect(() => {
    if (!isAuthorized) return;

    setLoadingComments(true);
    const q = query(collection(db, 'comments'), orderBy('created_at', 'desc'), limit(300));
    const unsubscribe = onSnapshot(
      q,
      snapshot => {
        const list: CommentRecord[] = snapshot.docs.map(d => ({
          id: d.id,
          ...d.data()
        } as CommentRecord));
        setComments(list);
        setLoadingComments(false);
      },
      err => {
        console.error('Error fetching comments:', err);
        setLoadingComments(false);
        showToast('Error loading real-time comments', 'error');
      }
    );

    return () => unsubscribe();
  }, [isAuthorized, showToast]);

  // Fetch Reports (Only if Authorized)
  useEffect(() => {
    if (!isAuthorized) return;

    setLoadingReports(true);
    const q = query(collection(db, 'commentReports'), orderBy('createdAt', 'desc'), limit(100));
    const unsubscribe = onSnapshot(
      q,
      snapshot => {
        const list: ReportRecord[] = snapshot.docs.map(d => ({
          id: d.id,
          ...d.data()
        } as ReportRecord));
        setReports(list);
        setLoadingReports(false);
      },
      err => {
        console.error('Error fetching reports:', err);
        setLoadingReports(false);
      }
    );

    return () => unsubscribe();
  }, [isAuthorized]);

  // Fetch Telegram Links & Alert Subscriptions (Only if Authorized)
  useEffect(() => {
    if (!isAuthorized) return;

    setLoadingAlerts(true);
    const unsubTg = onSnapshot(
      collection(db, 'telegram_links'),
      snapshot => {
        const list: TelegramLink[] = snapshot.docs.map(d => ({
          userId: d.id,
          ...(d.data() as any)
        }));
        setTelegramLinks(list);
        setLoadingAlerts(false);
      },
      err => {
        console.error('Error fetching telegram_links:', err);
        setLoadingAlerts(false);
      }
    );

    const unsubAlerts = onSnapshot(
      collection(db, 'job_alert_subscriptions'),
      snapshot => {
        const list: JobAlertSubscription[] = snapshot.docs.map(d => ({
          id: d.id,
          ...(d.data() as any)
        }));
        setAlertSubscriptions(list);
        setLoadingAlerts(false);
      },
      err => {
        console.error('Error fetching job_alert_subscriptions:', err);
        setLoadingAlerts(false);
      }
    );

    return () => {
      unsubTg();
      unsubAlerts();
    };
  }, [isAuthorized]);

  // Delete Comment Action
  const handleDeleteComment = async (comment: CommentRecord) => {
    try {
      setDeletingCommentId(comment.id);
      await deleteDoc(doc(db, 'comments', comment.id));
      showToast('Comment deleted successfully!');
      setDeleteConfirmComment(null);
    } catch (err: any) {
      console.error('Error deleting comment:', err);
      showToast('Failed to delete comment: ' + (err.message || 'Permission denied'), 'error');
    } finally {
      setDeletingCommentId(null);
    }
  };

  // Dismiss Report Action
  const handleDismissReport = async (reportId: string) => {
    try {
      await deleteDoc(doc(db, 'commentReports', reportId));
      showToast('Report dismissed.');
    } catch (err: any) {
      console.error('Error dismissing report:', err);
      showToast('Failed to dismiss report', 'error');
    }
  };

  // Copy Link Handler
  const handleCopyLink = (slug: string) => {
    const url = `https://newvacancyalert.in/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2500);
  };

  // Preset Sort Handlers
  const applySortPreset = (preset: string) => {
    setJobSortPreset(preset);
    setCurrentPage(1);
    switch (preset) {
      case 'combo-vacancies-upload':
        setSortLevels([
          { column: 'vacancies', order: 'desc' },
          { column: 'uploadDate', order: 'desc' }
        ]);
        break;
      case 'combo-upload-vacancies':
        setSortLevels([
          { column: 'uploadDate', order: 'desc' },
          { column: 'vacancies', order: 'desc' }
        ]);
        break;
      case 'combo-lastdate-vacancies':
        setSortLevels([
          { column: 'lastDate', order: 'asc' },
          { column: 'vacancies', order: 'desc' }
        ]);
        break;
      case 'vacancies-desc':
        setSortLevels([{ column: 'vacancies', order: 'desc' }]);
        break;
      case 'vacancies-asc':
        setSortLevels([{ column: 'vacancies', order: 'asc' }]);
        break;
      case 'upload-desc':
        setSortLevels([{ column: 'uploadDate', order: 'desc' }]);
        break;
      case 'upload-asc':
        setSortLevels([{ column: 'uploadDate', order: 'asc' }]);
        break;
      case 'lastdate-soon':
        setSortLevels([{ column: 'lastDate', order: 'asc' }]);
        break;
      case 'lastdate-late':
        setSortLevels([{ column: 'lastDate', order: 'desc' }]);
        break;
      case 'title-asc':
        setSortLevels([{ column: 'title', order: 'asc' }]);
        break;
      case 'board-asc':
        setSortLevels([{ column: 'board', order: 'asc' }]);
        break;
      case 'custom':
        setIsSortModalOpen(true);
        break;
      default:
        break;
    }
  };

  // Clickable Header Sort Handler (Shift+Click to Multi-Sort like Excel)
  const handleColumnHeaderClick = (column: SortColumnKey, isShiftKey: boolean) => {
    setCurrentPage(1);
    setJobSortPreset('custom');
    setSortLevels(prev => {
      const idx = prev.findIndex(l => l.column === column);
      if (isShiftKey) {
        if (idx >= 0) {
          const nextOrder = prev[idx].order === 'desc' ? 'asc' : 'desc';
          const clone = [...prev];
          clone[idx] = { column, order: nextOrder };
          return clone;
        } else {
          return [...prev, { column, order: 'desc' }];
        }
      } else {
        if (idx === 0) {
          const nextOrder = prev[0].order === 'desc' ? 'asc' : 'desc';
          return [{ column, order: nextOrder }, ...prev.slice(1)];
        } else if (idx > 0) {
          const item = prev[idx];
          const others = prev.filter((_, i) => i !== idx);
          return [item, ...others];
        } else {
          return [{ column, order: 'desc' }];
        }
      }
    });
  };

  // -------------------------------------------------------------
  // Jobs Calculations & Filtering
  // -------------------------------------------------------------
  const enrichedJobs = useMemo(() => {
    return JOBS_DATA.map((job, idx) => {
      const vacancies = getVacanciesCount(job);
      const uploadDateStr = getJobUploadDate(job.id, job.d);
      const uploadTimestamp = parseDateStrToTimestamp(uploadDateStr);
      const lastDateTimestamp = parseDateStrToTimestamp(job.l);
      const expired = isJobExpired(job.l);
      return {
        ...job,
        index: idx + 1,
        vacancies,
        uploadDateStr,
        uploadTimestamp,
        lastDateTimestamp,
        expired
      };
    });
  }, []);

  // Summary Metrics
  const metrics = useMemo(() => {
    const totalJobs = enrichedJobs.length;
    let totalVacancies = 0;
    let activeCount = 0;
    let expiredCount = 0;

    enrichedJobs.forEach(j => {
      totalVacancies += j.vacancies;
      if (j.expired) expiredCount++;
      else activeCount++;
    });

    return {
      totalJobs,
      totalVacancies,
      activeCount,
      expiredCount,
      totalComments: comments.length,
      totalReports: reports.length
    };
  }, [enrichedJobs, comments, reports]);

  // -------------------------------------------------------------
  // Telegram & Alert Subscriptions Analytics
  // -------------------------------------------------------------
  interface CandidateProfile {
    userId: string;
    email: string;
    name?: string;
    telegram?: TelegramLink;
    subscriptions: JobAlertSubscription[];
    activeSubscriptionsCount: number;
    lastActive: string;
  }

  const alertAnalytics = useMemo(() => {
    const activeTelegramUsers = telegramLinks.filter(t => t.isActive).length;
    const totalTelegramUsers = telegramLinks.length;
    const activeSubscriptions = alertSubscriptions.filter(s => s.isActive);
    const totalSubscriptions = alertSubscriptions.length;

    // Group into Candidate Profiles
    const profileMap = new Map<string, CandidateProfile>();

    telegramLinks.forEach(tg => {
      profileMap.set(tg.userId, {
        userId: tg.userId,
        email: '',
        name: tg.telegramFirstName || '',
        telegram: tg,
        subscriptions: [],
        activeSubscriptionsCount: 0,
        lastActive: tg.connectedAt || tg.updatedAt || ''
      });
    });

    alertSubscriptions.forEach(sub => {
      let profile = profileMap.get(sub.userId);
      if (!profile) {
        profile = {
          userId: sub.userId,
          email: sub.userEmail || '',
          name: sub.userName || '',
          subscriptions: [],
          activeSubscriptionsCount: 0,
          lastActive: sub.createdAt || ''
        };
        profileMap.set(sub.userId, profile);
      } else {
        if (!profile.email && sub.userEmail) profile.email = sub.userEmail;
        if (!profile.name && sub.userName) profile.name = sub.userName;
        if (sub.createdAt && (!profile.lastActive || sub.createdAt > profile.lastActive)) {
          profile.lastActive = sub.createdAt;
        }
      }
      profile.subscriptions.push(sub);
      if (sub.isActive) {
        profile.activeSubscriptionsCount++;
      }
    });

    const candidates = Array.from(profileMap.values()).sort((a, b) => {
      // Sort by active telegram first, then active subscriptions count, then lastActive
      if (a.telegram?.isActive && !b.telegram?.isActive) return -1;
      if (!a.telegram?.isActive && b.telegram?.isActive) return 1;
      if (b.activeSubscriptionsCount !== a.activeSubscriptionsCount) {
        return b.activeSubscriptionsCount - a.activeSubscriptionsCount;
      }
      return (b.lastActive || '').localeCompare(a.lastActive || '');
    });

    // Top Qualifications
    const qualCountMap = new Map<string, { slug: string; label: string; count: number }>();
    // Top Locations
    const locCountMap = new Map<string, { slug: string; label: string; count: number }>();
    // Top Combinations
    const comboCountMap = new Map<string, { qualLabel: string; locLabel: string; count: number }>();
    // Top Source Jobs
    const sourceJobMap = new Map<string, { title: string; count: number }>();

    activeSubscriptions.forEach(sub => {
      const qSlug = sub.qualification || 'other';
      const qLabel = sub.qualificationLabel || sub.qualification || 'General';
      const qCurr = qualCountMap.get(qSlug) || { slug: qSlug, label: qLabel, count: 0 };
      qCurr.count++;
      qualCountMap.set(qSlug, qCurr);

      const lSlug = sub.location || 'all-india';
      const lLabel = sub.locationLabel || sub.location || 'All India';
      const lCurr = locCountMap.get(lSlug) || { slug: lSlug, label: lLabel, count: 0 };
      lCurr.count++;
      locCountMap.set(lSlug, lCurr);

      const cKey = `${qLabel} • ${lLabel}`;
      const cCurr = comboCountMap.get(cKey) || { qualLabel: qLabel, locLabel: lLabel, count: 0 };
      cCurr.count++;
      comboCountMap.set(cKey, cCurr);

      if (sub.sourceJobTitle) {
        const jCurr = sourceJobMap.get(sub.sourceJobTitle) || { title: sub.sourceJobTitle, count: 0 };
        jCurr.count++;
        sourceJobMap.set(sub.sourceJobTitle, jCurr);
      }
    });

    const totalActiveSubs = activeSubscriptions.length;

    const topQualifications = Array.from(qualCountMap.values())
      .sort((a, b) => b.count - a.count)
      .map(item => ({
        ...item,
        percentage: totalActiveSubs > 0 ? Math.round((item.count / totalActiveSubs) * 100) : 0
      }));

    const topLocations = Array.from(locCountMap.values())
      .sort((a, b) => b.count - a.count)
      .map(item => ({
        ...item,
        percentage: totalActiveSubs > 0 ? Math.round((item.count / totalActiveSubs) * 100) : 0
      }));

    const topCombinations = Array.from(comboCountMap.entries())
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 8)
      .map(([key, val]) => ({ key, ...val }));

    const topSourceJobs = Array.from(sourceJobMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    const connectedCandidatesCount = candidates.filter(c => c.telegram?.isActive).length;

    return {
      totalTelegramUsers,
      activeTelegramUsers,
      totalSubscriptions,
      activeSubscriptions: totalActiveSubs,
      totalCandidates: candidates.length,
      connectedCandidatesCount,
      coveredLocationsCount: locCountMap.size,
      candidates,
      topQualifications,
      topLocations,
      topCombinations,
      topSourceJobs
    };
  }, [telegramLinks, alertSubscriptions]);

  // Filtered Candidates
  const filteredCandidates = useMemo(() => {
    let list = alertAnalytics.candidates;

    if (subscriberSearch.trim()) {
      const q = subscriberSearch.trim().toLowerCase();
      list = list.filter(c => {
        const inEmail = (c.email || '').toLowerCase().includes(q);
        const inName = (c.name || '').toLowerCase().includes(q);
        const inUid = c.userId.toLowerCase().includes(q);
        const inTgUser = (c.telegram?.telegramUsername || '').toLowerCase().includes(q);
        const inTgFirst = (c.telegram?.telegramFirstName || '').toLowerCase().includes(q);
        const inTgChat = (c.telegram?.telegramChatId || '').toLowerCase().includes(q);
        const inSub = c.subscriptions.some(s =>
          (s.qualificationLabel || '').toLowerCase().includes(q) ||
          (s.locationLabel || '').toLowerCase().includes(q) ||
          (s.sourceJobTitle || '').toLowerCase().includes(q)
        );
        return inEmail || inName || inUid || inTgUser || inTgFirst || inTgChat || inSub;
      });
    }

    if (subscriberStatusFilter === 'connected') {
      list = list.filter(c => Boolean(c.telegram?.isActive));
    } else if (subscriberStatusFilter === 'not_connected') {
      list = list.filter(c => !c.telegram?.isActive);
    }

    if (subscriberQualFilter !== 'all') {
      list = list.filter(c => c.subscriptions.some(s => s.qualification === subscriberQualFilter));
    }

    if (subscriberLocFilter !== 'all') {
      list = list.filter(c => c.subscriptions.some(s => s.location === subscriberLocFilter));
    }

    return list;
  }, [alertAnalytics.candidates, subscriberSearch, subscriberStatusFilter, subscriberQualFilter, subscriberLocFilter]);

  const paginatedCandidates = useMemo(() => {
    const startIndex = (subscriberPage - 1) * SUBSCRIBER_PAGE_SIZE;
    return filteredCandidates.slice(startIndex, startIndex + SUBSCRIBER_PAGE_SIZE);
  }, [filteredCandidates, subscriberPage]);

  const totalCandidatePages = Math.ceil(filteredCandidates.length / SUBSCRIBER_PAGE_SIZE) || 1;

  // Unique Boards list for Excel Filter
  const allBoardsList = useMemo(() => {
    const set = new Set<string>();
    enrichedJobs.forEach(j => {
      if (j.b) set.add(j.b);
    });
    return Array.from(set).sort();
  }, [enrichedJobs]);

  // Filtered & Sorted Jobs
  const filteredJobs = useMemo(() => {
    let list = [...enrichedJobs];

    // Search
    if (jobSearch.trim()) {
      const queryLower = jobSearch.trim().toLowerCase();
      list = list.filter(j =>
        (j.t && j.t.toLowerCase().includes(queryLower)) ||
        (j.b && j.b.toLowerCase().includes(queryLower)) ||
        (j.id && j.id.toLowerCase().includes(queryLower)) ||
        (j.q && j.q.toLowerCase().includes(queryLower)) ||
        (j.a && j.a.toLowerCase().includes(queryLower))
      );
    }

    // Status filter
    if (statusFilter === 'active') {
      list = list.filter(j => !j.expired);
    } else if (statusFilter === 'expired') {
      list = list.filter(j => j.expired);
    }

    // Board filter
    if (categoryFilter !== 'all') {
      list = list.filter(j => j.b === categoryFilter);
    }

    // Qualification filter
    if (qualificationFilter !== 'all') {
      const qLower = qualificationFilter.toLowerCase();
      list = list.filter(j => j.q && j.q.toLowerCase().includes(qLower));
    }

    // Min Vacancies filter
    if (minVacanciesFilter !== null && minVacanciesFilter > 0) {
      list = list.filter(j => j.vacancies >= minVacanciesFilter);
    }

    // Upload Date filter preset
    if (uploadDateFilter !== 'all') {
      const now = Date.now();
      const ONE_DAY = 24 * 60 * 60 * 1000;
      if (uploadDateFilter === '7days') {
        list = list.filter(j => j.uploadTimestamp >= now - 7 * ONE_DAY);
      } else if (uploadDateFilter === '30days') {
        list = list.filter(j => j.uploadTimestamp >= now - 30 * ONE_DAY);
      } else if (uploadDateFilter === 'this_month') {
        const thisMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime();
        list = list.filter(j => j.uploadTimestamp >= thisMonthStart);
      } else if (uploadDateFilter === 'this_year') {
        const thisYearStart = new Date(new Date().getFullYear(), 0, 1).getTime();
        list = list.filter(j => j.uploadTimestamp >= thisYearStart);
      }
    }

    // Last Date filter preset
    if (lastDateFilter !== 'all') {
      const now = Date.now();
      const ONE_DAY = 24 * 60 * 60 * 1000;
      if (lastDateFilter === 'expired') {
        list = list.filter(j => j.expired);
      } else if (lastDateFilter === 'active_7days') {
        list = list.filter(j => !j.expired && j.lastDateTimestamp > 0 && j.lastDateTimestamp <= now + 7 * ONE_DAY);
      } else if (lastDateFilter === 'active_15days') {
        list = list.filter(j => !j.expired && j.lastDateTimestamp > 0 && j.lastDateTimestamp <= now + 15 * ONE_DAY);
      } else if (lastDateFilter === 'active_30days') {
        list = list.filter(j => !j.expired && j.lastDateTimestamp > 0 && j.lastDateTimestamp <= now + 30 * ONE_DAY);
      }
    }

    // Multi-Level Sort
    list.sort((a, b) => {
      for (const level of sortLevels) {
        let diff = 0;
        switch (level.column) {
          case 'vacancies':
            diff = a.vacancies - b.vacancies;
            break;
          case 'uploadDate':
            diff = a.uploadTimestamp - b.uploadTimestamp;
            break;
          case 'lastDate':
            if (a.lastDateTimestamp === 0 && b.lastDateTimestamp !== 0) diff = 1;
            else if (b.lastDateTimestamp === 0 && a.lastDateTimestamp !== 0) diff = -1;
            else diff = a.lastDateTimestamp - b.lastDateTimestamp;
            break;
          case 'title':
            diff = (a.t || '').localeCompare(b.t || '');
            break;
          case 'board':
            diff = (a.b || '').localeCompare(b.b || '');
            break;
          case 'status':
            diff = (a.expired ? 1 : 0) - (b.expired ? 1 : 0);
            break;
          default:
            diff = 0;
        }
        if (diff !== 0) {
          return level.order === 'asc' ? diff : -diff;
        }
      }
      return 0;
    });

    return list;
  }, [
    enrichedJobs,
    jobSearch,
    statusFilter,
    categoryFilter,
    qualificationFilter,
    minVacanciesFilter,
    uploadDateFilter,
    lastDateFilter,
    sortLevels
  ]);

  // Paginated Jobs
  const paginatedJobs = useMemo(() => {
    if (pageSize >= 9999) return filteredJobs;
    const start = (currentPage - 1) * pageSize;
    return filteredJobs.slice(start, start + pageSize);
  }, [filteredJobs, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredJobs.length / pageSize) || 1;

  // -------------------------------------------------------------
  // Filtered & Sorted Comments
  // -------------------------------------------------------------
  const filteredComments = useMemo(() => {
    let list = [...comments];

    if (commentSearch.trim()) {
      const qLower = commentSearch.trim().toLowerCase();
      list = list.filter(c =>
        (c.content && c.content.toLowerCase().includes(qLower)) ||
        (c.author_name && c.author_name.toLowerCase().includes(qLower)) ||
        (c.author_uid && c.author_uid.toLowerCase().includes(qLower)) ||
        (c.page_id && c.page_id.toLowerCase().includes(qLower))
      );
    }

    if (commentTypeFilter === 'parent') {
      list = list.filter(c => !c.parent_id);
    } else if (commentTypeFilter === 'reply') {
      list = list.filter(c => !!c.parent_id);
    }

    if (commentPageFilter !== 'all') {
      list = list.filter(c => c.page_id === commentPageFilter);
    }

    list.sort((a, b) => {
      if (commentSortBy === 'likes') {
        return (b.likes_count || 0) - (a.likes_count || 0);
      }
      const aTime = a.created_at?.toMillis ? a.created_at.toMillis() : (new Date(a.created_at).getTime() || 0);
      const bTime = b.created_at?.toMillis ? b.created_at.toMillis() : (new Date(b.created_at).getTime() || 0);
      if (commentSortBy === 'oldest') {
        return aTime - bTime;
      }
      return bTime - aTime;
    });

    return list;
  }, [comments, commentSearch, commentTypeFilter, commentPageFilter, commentSortBy]);

  // Unique pages with comments
  const commentPagesList = useMemo(() => {
    const set = new Set<string>();
    comments.forEach(c => {
      if (c.page_id) set.add(c.page_id);
    });
    return Array.from(set).sort();
  }, [comments]);

  // -------------------------------------------------------------
  // GUARD: UNAUTHORIZED / NOT LOGGED IN AS ANAND
  // -------------------------------------------------------------
  if (loading) {
    return (
      <div className="w-full min-h-[75vh] flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-bold text-slate-600">Verifying session...</span>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="w-full bg-slate-50 min-h-[80vh] py-16 px-4 flex flex-col items-center justify-center">
        <Helmet>
          <title>Page Not Found | NewVacancyAlert</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>

        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-slate-200 text-center space-y-6">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <Search className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-black text-slate-900">
              Page Not Found
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              The page you are looking for does not exist or has been moved. Explore active recruitment notifications or return to the homepage.
            </p>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <Link
              to="/"
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl text-sm transition shadow-sm"
            >
              <Home className="w-4 h-4" />
              Return to Homepage
            </Link>

            {/* Discreet Admin Login Trigger */}
            <div className="pt-4 border-t border-slate-100 flex flex-col items-center gap-2">
              {user ? (
                <div className="text-center space-y-2">
                  <p className="text-[11px] text-slate-400">
                    Logged in as <span className="font-semibold text-slate-600">{user.email}</span>
                  </p>
                  <button
                    onClick={() => logout()}
                    className="text-xs text-blue-600 hover:underline font-bold"
                  >
                    Switch Google Account
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => openLoginModal(undefined, 'Admin Sign In', 'Sign in with anand.textme@gmail.com to access the admin portal.')}
                  className="text-xs text-slate-400 hover:text-blue-600 transition flex items-center gap-1.5 font-medium"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Admin Access Sign In</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // AUTHORIZED ADMIN DASHBOARD VIEW
  // -------------------------------------------------------------
  return (
    <div className="w-full bg-slate-100/70 min-h-screen pb-20">
      <Helmet>
        <title>Admin Dashboard | NewVacancyAlert</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-2xl text-sm font-bold text-white transition-all transform animate-bounce ${
          toastMessage.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'
        }`}>
          {toastMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmComment && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Confirm Comment Deletion</h3>
                <p className="text-xs text-slate-500">This will permanently remove the comment from Firestore.</p>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
              <div className="flex justify-between text-slate-500 font-medium">
                <span>Author: <strong className="text-slate-800">{deleteConfirmComment.author_name}</strong></span>
                <span>Page: <strong className="text-slate-800">{deleteConfirmComment.page_id}</strong></span>
              </div>
              <p className="text-slate-700 italic border-t border-slate-200/60 pt-1.5 whitespace-pre-wrap">
                "{deleteConfirmComment.content}"
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmComment(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteComment(deleteConfirmComment)}
                disabled={deletingCommentId === deleteConfirmComment.id}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
              >
                {deletingCommentId === deleteConfirmComment.id ? 'Deleting...' : 'Yes, Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Job Details Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-sm">Job Quick Inspector</h3>
                  <span className="text-[11px] text-slate-400">ID: {selectedJob.id}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedJob(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[11px] uppercase tracking-wider font-extrabold text-slate-400 block mb-1">Title</span>
                <p className="font-bold text-slate-900 text-sm">{selectedJob.t}</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 block">Total Vacancies</span>
                  <span className="font-black text-blue-600 text-sm">{selectedJob.vacancies.toLocaleString()} Posts</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Upload Date</span>
                  <span className="font-bold text-slate-700">{selectedJob.uploadDateStr}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Last Date</span>
                  <span className={`font-bold ${selectedJob.expired ? 'text-red-600' : 'text-emerald-600'}`}>
                    {selectedJob.l} {selectedJob.expired ? '(Expired)' : '(Active)'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Advt Number</span>
                  <span className="font-bold text-slate-700 truncate block">{selectedJob.a || 'N/A'}</span>
                </div>
              </div>

              <div>
                <span className="text-[11px] uppercase tracking-wider font-extrabold text-slate-400 block mb-1">Board / Organization</span>
                <p className="font-semibold text-slate-800">{selectedJob.b}</p>
              </div>

              <div>
                <span className="text-[11px] uppercase tracking-wider font-extrabold text-slate-400 block mb-1">Qualification</span>
                <p className="font-medium text-slate-700 bg-amber-50/70 border border-amber-200/60 p-2.5 rounded-lg">
                  {selectedJob.q}
                </p>
              </div>

              {selectedJob.desc && (
                <div>
                  <span className="text-[11px] uppercase tracking-wider font-extrabold text-slate-400 block mb-1">Overview Description</span>
                  <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
                    {selectedJob.desc}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                onClick={() => handleCopyLink(selectedJob.id || '')}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition flex items-center gap-1.5"
              >
                {copiedSlug === selectedJob.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSlug === selectedJob.id ? 'Copied Link!' : 'Copy Site URL'}</span>
              </button>

              <div className="flex items-center gap-2">
                {selectedJob.u && (
                  <a
                    href={selectedJob.u}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-bold transition flex items-center gap-1"
                  >
                    <span>Official Portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                <Link
                  to={`/${selectedJob.id}`}
                  target="_blank"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-sm"
                >
                  <span>Open Live Page</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Excel Custom Multi-Level Sort Modal */}
      {isSortModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-sm">
                  <SlidersHorizontal className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">Excel Multi-Level Sort</h3>
                  <p className="text-[11px] text-slate-500">Configure hierarchical sorting criteria for vacancy listings</p>
                </div>
              </div>
              <button
                onClick={() => setIsSortModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Presets Row */}
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Quick Sort Presets</span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    setSortLevels([
                      { column: 'vacancies', order: 'desc' },
                      { column: 'uploadDate', order: 'desc' }
                    ]);
                    setJobSortPreset('combo-vacancies-upload');
                  }}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border flex items-center gap-1.5 transition ${
                    sortLevels.length === 2 && sortLevels[0].column === 'vacancies' && sortLevels[1].column === 'uploadDate'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  <span>🔥 Post High to Low + 🆕 Newest First</span>
                </button>
                <button
                  onClick={() => {
                    setSortLevels([
                      { column: 'uploadDate', order: 'desc' },
                      { column: 'vacancies', order: 'desc' }
                    ]);
                    setJobSortPreset('combo-upload-vacancies');
                  }}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border flex items-center gap-1.5 transition ${
                    sortLevels.length === 2 && sortLevels[0].column === 'uploadDate' && sortLevels[1].column === 'vacancies'
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5 text-indigo-500" />
                  <span>🆕 Newest First + 🔥 Post High to Low</span>
                </button>
                <button
                  onClick={() => {
                    setSortLevels([
                      { column: 'lastDate', order: 'asc' },
                      { column: 'vacancies', order: 'desc' }
                    ]);
                    setJobSortPreset('combo-lastdate-vacancies');
                  }}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border flex items-center gap-1.5 transition ${
                    sortLevels.length === 2 && sortLevels[0].column === 'lastDate' && sortLevels[1].column === 'vacancies'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                  <span>⏰ Last Date Soonest + 🔥 Post High to Low</span>
                </button>
              </div>
            </div>

            {/* Sort Level Rows List */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Active Sort Levels (Evaluated in Order)</span>
              
              {sortLevels.map((lvl, idx) => (
                <div key={idx} className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-2xs">
                    {idx + 1}
                  </div>

                  <span className="text-xs font-bold text-slate-500 w-16 shrink-0">
                    {idx === 0 ? 'Sort by' : 'Then by'}
                  </span>

                  {/* Column Select */}
                  <select
                    value={lvl.column}
                    onChange={e => {
                      const updated = [...sortLevels];
                      updated[idx].column = e.target.value as SortColumnKey;
                      setSortLevels(updated);
                      setJobSortPreset('custom');
                    }}
                    className="flex-1 py-1.5 px-2.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 font-bold focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="vacancies">Total Posts / Vacancies</option>
                    <option value="uploadDate">Upload Date</option>
                    <option value="lastDate">Application Last Date</option>
                    <option value="title">Job Title</option>
                    <option value="board">Organization / Board</option>
                    <option value="status">Status (Active / Expired)</option>
                  </select>

                  {/* Order Select */}
                  <select
                    value={lvl.order}
                    onChange={e => {
                      const updated = [...sortLevels];
                      updated[idx].order = e.target.value as 'asc' | 'desc';
                      setSortLevels(updated);
                      setJobSortPreset('custom');
                    }}
                    className="w-36 py-1.5 px-2.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 font-bold focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    {lvl.column === 'vacancies' && (
                      <>
                        <option value="desc">High to Low (Largest)</option>
                        <option value="asc">Low to High (Smallest)</option>
                      </>
                    )}
                    {lvl.column === 'uploadDate' && (
                      <>
                        <option value="desc">Newest to Oldest</option>
                        <option value="asc">Oldest to Newest</option>
                      </>
                    )}
                    {lvl.column === 'lastDate' && (
                      <>
                        <option value="asc">Closing Soonest</option>
                        <option value="desc">Closing Latest</option>
                      </>
                    )}
                    {(lvl.column === 'title' || lvl.column === 'board') && (
                      <>
                        <option value="asc">A to Z</option>
                        <option value="desc">Z to A</option>
                      </>
                    )}
                    {lvl.column === 'status' && (
                      <>
                        <option value="asc">Active First</option>
                        <option value="desc">Expired First</option>
                      </>
                    )}
                  </select>

                  {/* Delete Level */}
                  {sortLevels.length > 1 && (
                    <button
                      onClick={() => {
                        const updated = sortLevels.filter((_, i) => i !== idx);
                        setSortLevels(updated);
                        setJobSortPreset('custom');
                      }}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Remove Sort Level"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}

              {sortLevels.length < 5 && (
                <button
                  onClick={() => {
                    const availableCols: SortColumnKey[] = ['vacancies', 'uploadDate', 'lastDate', 'title', 'board'];
                    const used = new Set(sortLevels.map(l => l.column));
                    const nextCol = availableCols.find(c => !used.has(c)) || 'uploadDate';
                    setSortLevels([...sortLevels, { column: nextCol, order: 'desc' }]);
                    setJobSortPreset('custom');
                  }}
                  className="w-full py-2 border-2 border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 rounded-xl text-xs font-bold text-slate-600 hover:text-blue-600 flex items-center justify-center gap-1.5 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Another Sort Level</span>
                </button>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                onClick={() => {
                  setSortLevels([
                    { column: 'uploadDate', order: 'desc' },
                    { column: 'vacancies', order: 'desc' }
                  ]);
                  setJobSortPreset('combo-upload-vacancies');
                }}
                className="px-3.5 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition"
              >
                Reset to Default
              </button>

              <button
                onClick={() => setIsSortModalOpen(false)}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
              >
                Apply & Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs w-full">
        <div className="w-full max-w-[98vw] 2xl:max-w-[99vw] mx-auto px-3 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-slate-900 text-lg sm:text-xl tracking-tight">
                  NewVacancyAlert Admin
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-700 border border-emerald-300">
                  Super Admin
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                <User className="w-3 h-3 text-slate-400" />
                {user?.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/"
              target="_blank"
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white text-slate-700 text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Live Site</span>
            </Link>
            <button
              onClick={() => logout()}
              className="px-3.5 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition flex items-center gap-1.5 border border-red-200"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="w-full max-w-[98vw] 2xl:max-w-[99vw] mx-auto px-3 sm:px-6 lg:px-8 flex items-center gap-1 overflow-x-auto border-t border-slate-100 pt-1">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`flex items-center gap-2 py-2.5 px-4 text-xs font-black uppercase tracking-wider border-b-2 transition whitespace-nowrap ${
              activeTab === 'jobs'
                ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Job Vacancies ({metrics.totalJobs})</span>
          </button>

          <button
            onClick={() => setActiveTab('comments')}
            className={`flex items-center gap-2 py-2.5 px-4 text-xs font-black uppercase tracking-wider border-b-2 transition whitespace-nowrap ${
              activeTab === 'comments'
                ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Comments Moderation ({metrics.totalComments})</span>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`flex items-center gap-2 py-2.5 px-4 text-xs font-black uppercase tracking-wider border-b-2 transition whitespace-nowrap ${
              activeTab === 'reports'
                ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Flag className="w-4 h-4" />
            <span>Reported Comments ({metrics.totalReports})</span>
          </button>

          <button
            onClick={() => setActiveTab('alerts')}
            className={`flex items-center gap-2 py-2.5 px-4 text-xs font-black uppercase tracking-wider border-b-2 transition whitespace-nowrap ${
              activeTab === 'alerts'
                ? 'border-sky-600 text-sky-600 bg-sky-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Send className="w-4 h-4 text-sky-500" />
            <span>Telegram & Alerts ({alertAnalytics.activeTelegramUsers})</span>
          </button>

          <button
            onClick={() => setActiveTab('tools')}
            className={`flex items-center gap-2 py-2.5 px-4 text-xs font-black uppercase tracking-wider border-b-2 transition whitespace-nowrap ${
              activeTab === 'tools'
                ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Site Overview & Tools</span>
          </button>
        </div>
      </header>

      {/* Main Content Area - Full Screen Responsive Width */}
      <main className="w-full max-w-[98vw] 2xl:max-w-[99vw] mx-auto px-2 sm:px-4 lg:px-6 pt-6 space-y-6">
        {/* Metric Cards Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 sm:gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Total Jobs</span>
              <Briefcase className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-slate-900">{metrics.totalJobs.toLocaleString()}</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Total Posts</span>
              <Flame className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-blue-700">{metrics.totalVacancies.toLocaleString()}</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Active Jobs</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-emerald-600">{metrics.activeCount.toLocaleString()}</p>
          </div>

          {/* Telegram Users Metric Card */}
          <div
            onClick={() => setActiveTab('alerts')}
            className={`bg-white p-4 rounded-2xl border shadow-xs cursor-pointer transition hover:scale-[1.01] ${
              activeTab === 'alerts'
                ? 'border-sky-500 ring-2 ring-sky-500/20 bg-sky-50/20'
                : 'border-slate-200 hover:border-sky-400'
            }`}
          >
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-sky-700 flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Telegram Users
              </span>
              <Send className="w-4 h-4 text-sky-500" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-sky-700">
              {loadingAlerts ? '...' : alertAnalytics.activeTelegramUsers.toLocaleString()}
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">
              {alertAnalytics.activeSubscriptions} active alert rules
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Expired Jobs</span>
              <Clock className="w-4 h-4 text-rose-500" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-rose-600">{metrics.expiredCount.toLocaleString()}</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Comments</span>
              <MessageSquare className="w-4 h-4 text-indigo-500" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-indigo-600">{metrics.totalComments.toLocaleString()}</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Flagged Reports</span>
              <Flag className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-amber-600">{metrics.totalReports.toLocaleString()}</p>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* TAB 1: ALL JOBS MANAGEMENT TABLE */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'jobs' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-4 sm:p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                  <span>Job Vacancies Directory</span>
                  <span className="text-xs bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-full">
                    {filteredJobs.length} matches
                  </span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Excel-style multi-level sorting and filtering for all live and archived government vacancy notices.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsSortModalOpen(true)}
                  className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-blue-200 shadow-2xs"
                  title="Configure Multi-Level Sort"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Custom Sort ({sortLevels.length} Levels)</span>
                </button>

                <button
                  onClick={() => {
                    const csvContent = "data:text/csv;charset=utf-8," + 
                      ["ID,Title,Board,Vacancies,UploadDate,LastDate,Status,Qualification,Link"].join(",") + "\n" +
                      filteredJobs.map(j => `"${j.id}","${(j.t||'').replace(/"/g, '""')}","${(j.b||'').replace(/"/g, '""')}",${j.vacancies},"${j.uploadDateStr}","${j.l}","${j.expired ? 'Expired' : 'Active'}","${(j.q||'').replace(/"/g, '""')}","https://newvacancyalert.in/${j.id}"`).join("\n");
                    const encodedUri = encodeURI(csvContent);
                    const link = document.createElement("a");
                    link.setAttribute("href", encodedUri);
                    link.setAttribute("download", "newvacancyalert_jobs_export.csv");
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-slate-200 shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Filter & Multi-Sort Controls Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 bg-slate-50/80 p-3.5 rounded-xl border border-slate-200">
              {/* Search Bar */}
              <div className="lg:col-span-2 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by title, board, ID, qualification..."
                  value={jobSearch}
                  onChange={e => {
                    setJobSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              {/* Excel Multi-Sort Preset Selector */}
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1 flex items-center justify-between">
                  <span>Excel Sorting Preset</span>
                  <button
                    onClick={() => setIsSortModalOpen(true)}
                    className="text-blue-600 hover:underline text-[10px] font-bold lowercase"
                  >
                    edit
                  </button>
                </label>
                <select
                  value={jobSortPreset}
                  onChange={e => applySortPreset(e.target.value)}
                  className="w-full py-1.5 px-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 font-bold focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                >
                  <option value="combo-upload-vacancies">🆕 Newest First + 🔥 Post High to Low (Default)</option>
                  <option value="combo-vacancies-upload">🔥 Post High to Low + 🆕 Newest First</option>
                  <option value="combo-lastdate-vacancies">⏰ Last Date Soon + 🔥 Post High to Low</option>
                  <option value="upload-desc">🆕 Upload Date: Newest First Only</option>
                  <option value="vacancies-desc">🔥 Post High to Low (Vacancies Only)</option>
                  <option value="vacancies-asc">📉 Post Low to High (Vacancies Only)</option>
                  <option value="upload-asc">⏳ Upload Date: Oldest First</option>
                  <option value="lastdate-soon">⏰ Last Date: Expiring Soonest</option>
                  <option value="title-asc">🔤 Title (A to Z)</option>
                  <option value="board-asc">🏢 Board / Org (A to Z)</option>
                  <option value="custom">⚙️ Custom ({sortLevels.length} Levels)...</option>
                </select>
              </div>

              {/* Min Vacancies Filter */}
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">
                  Min Vacancies
                </label>
                <select
                  value={minVacanciesFilter === null ? 'all' : String(minVacanciesFilter)}
                  onChange={e => {
                    const val = e.target.value;
                    setMinVacanciesFilter(val === 'all' ? null : parseInt(val, 10));
                    setCurrentPage(1);
                  }}
                  className="w-full py-1.5 px-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 font-bold focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Post Counts</option>
                  <option value="500">≥ 500+ Posts</option>
                  <option value="1000">≥ 1,000+ Posts</option>
                  <option value="5000">≥ 5,000+ Posts</option>
                  <option value="10000">≥ 10,000+ Posts</option>
                  <option value="20000">≥ 20,000+ Posts</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={e => {
                    setStatusFilter(e.target.value as any);
                    setCurrentPage(1);
                  }}
                  className="w-full py-1.5 px-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 font-bold focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active Only</option>
                  <option value="expired">Expired Only</option>
                </select>
              </div>

              {/* Qualification Filter */}
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">
                  Qualification
                </label>
                <select
                  value={qualificationFilter}
                  onChange={e => {
                    setQualificationFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full py-1.5 px-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 font-bold focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Qualifications</option>
                  <option value="10th">10th Pass</option>
                  <option value="12th">12th Pass</option>
                  <option value="ITI">ITI</option>
                  <option value="Diploma">Diploma</option>
                  <option value="Graduate">Graduation / Degree</option>
                  <option value="B.Tech">B.Tech / Engineering</option>
                  <option value="Post">Post Graduate / Master</option>
                </select>
              </div>
            </div>

            {/* Active Sort & Filters Pill Bar */}
            <div className="flex flex-wrap items-center gap-2 pt-1 pb-1">
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5 text-blue-600" />
                <span>Active Sort Rules:</span>
              </span>

              {sortLevels.map((lvl, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200/80 shadow-2xs"
                >
                  <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-black flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span>
                    {lvl.column === 'vacancies' && 'Total Posts'}
                    {lvl.column === 'uploadDate' && 'Upload Date'}
                    {lvl.column === 'lastDate' && 'Last Date'}
                    {lvl.column === 'title' && 'Job Title'}
                    {lvl.column === 'board' && 'Board'}
                    {lvl.column === 'status' && 'Status'}
                  </span>
                  <span className="text-[10px] text-blue-600 font-medium">
                    ({lvl.order === 'desc' ? 'High/Newest' : 'Low/Oldest'})
                  </span>
                </span>
              ))}

              {minVacanciesFilter !== null && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  <span>Min {minVacanciesFilter.toLocaleString()}+ Posts</span>
                  <button
                    onClick={() => setMinVacanciesFilter(null)}
                    className="hover:text-amber-950 transition"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {(jobSearch || statusFilter !== 'all' || qualificationFilter !== 'all' || minVacanciesFilter !== null || sortLevels.length > 2 || jobSortPreset !== 'combo-upload-vacancies') && (
                <button
                  onClick={() => {
                    setJobSearch('');
                    setStatusFilter('all');
                    setQualificationFilter('all');
                    setMinVacanciesFilter(null);
                    setUploadDateFilter('all');
                    setLastDateFilter('all');
                    applySortPreset('combo-upload-vacancies');
                  }}
                  className="text-xs text-red-600 hover:text-red-700 font-bold ml-auto transition flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reset All Filters & Sort</span>
                </button>
              )}
            </div>

            {/* Jobs Data Table with Clickable Sort Headers & Excel Badges */}
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-black text-slate-600 uppercase tracking-wider select-none">
                    <th className="py-3 px-3 text-center w-12">#</th>
                    
                    {/* Status Column */}
                    <th
                      onClick={(e) => handleColumnHeaderClick('status', e.shiftKey)}
                      className="py-3 px-3 w-28 cursor-pointer hover:bg-slate-100 transition group"
                      title="Click to sort by Status. Hold Shift to multi-sort."
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span>Status</span>
                        {(() => {
                          const idx = sortLevels.findIndex(l => l.column === 'status');
                          if (idx === -1) return <ArrowUpDown className="w-3 h-3 text-slate-300 group-hover:text-slate-500" />;
                          return (
                            <span className="inline-flex items-center gap-0.5 px-1 py-0.5 rounded text-[9px] font-black bg-blue-600 text-white">
                              #{idx + 1} {sortLevels[idx].order === 'desc' ? '▼' : '▲'}
                            </span>
                          );
                        })()}
                      </div>
                    </th>

                    {/* Upload Date Column */}
                    <th
                      onClick={(e) => handleColumnHeaderClick('uploadDate', e.shiftKey)}
                      className="py-3 px-3 w-36 cursor-pointer hover:bg-slate-100 transition group"
                      title="Click to sort by Upload Date. Hold Shift to multi-sort."
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span>Upload Date</span>
                        {(() => {
                          const idx = sortLevels.findIndex(l => l.column === 'uploadDate');
                          if (idx === -1) return <ArrowUpDown className="w-3 h-3 text-slate-300 group-hover:text-slate-500" />;
                          return (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-black bg-blue-600 text-white shadow-2xs">
                              #{idx + 1} {sortLevels[idx].order === 'desc' ? '▼' : '▲'}
                            </span>
                          );
                        })()}
                      </div>
                    </th>

                    {/* Job Title Column */}
                    <th
                      onClick={(e) => handleColumnHeaderClick('title', e.shiftKey)}
                      className="py-3 px-3 min-w-[260px] cursor-pointer hover:bg-slate-100 transition group"
                      title="Click to sort alphabetically by Title. Hold Shift to multi-sort."
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span>Job Title & Post</span>
                        {(() => {
                          const idx = sortLevels.findIndex(l => l.column === 'title');
                          if (idx === -1) return <ArrowUpDown className="w-3 h-3 text-slate-300 group-hover:text-slate-500" />;
                          return (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-black bg-blue-600 text-white shadow-2xs">
                              #{idx + 1} {sortLevels[idx].order === 'desc' ? '▼' : '▲'}
                            </span>
                          );
                        })()}
                      </div>
                    </th>

                    {/* Job URL Column */}
                    <th className="py-3 px-3 min-w-[240px]">
                      <span>Job URL</span>
                    </th>

                    {/* Organization / Board Column */}
                    <th
                      onClick={(e) => handleColumnHeaderClick('board', e.shiftKey)}
                      className="py-3 px-3 min-w-[180px] cursor-pointer hover:bg-slate-100 transition group"
                      title="Click to sort by Organization / Board. Hold Shift to multi-sort."
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span>Organization / Board</span>
                        {(() => {
                          const idx = sortLevels.findIndex(l => l.column === 'board');
                          if (idx === -1) return <ArrowUpDown className="w-3 h-3 text-slate-300 group-hover:text-slate-500" />;
                          return (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-black bg-blue-600 text-white shadow-2xs">
                              #{idx + 1} {sortLevels[idx].order === 'desc' ? '▼' : '▲'}
                            </span>
                          );
                        })()}
                      </div>
                    </th>

                    {/* Total Posts Column */}
                    <th
                      onClick={(e) => handleColumnHeaderClick('vacancies', e.shiftKey)}
                      className="py-3 px-3 text-center w-32 cursor-pointer hover:bg-slate-100 transition group bg-blue-50/40"
                      title="Click to sort by Total Vacancies. Hold Shift to multi-sort."
                    >
                      <div className="flex items-center justify-center gap-1.5">
                        <span>Total Posts</span>
                        {(() => {
                          const idx = sortLevels.findIndex(l => l.column === 'vacancies');
                          if (idx === -1) return <ArrowUpDown className="w-3 h-3 text-slate-300 group-hover:text-slate-500" />;
                          return (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-black bg-blue-600 text-white shadow-2xs">
                              #{idx + 1} {sortLevels[idx].order === 'desc' ? '▼' : '▲'}
                            </span>
                          );
                        })()}
                      </div>
                    </th>

                    {/* Qualification Column */}
                    <th className="py-3 px-3 min-w-[160px]">
                      <span>Qualification</span>
                    </th>

                    {/* Last Date Column */}
                    <th
                      onClick={(e) => handleColumnHeaderClick('lastDate', e.shiftKey)}
                      className="py-3 px-3 w-32 cursor-pointer hover:bg-slate-100 transition group"
                      title="Click to sort by Last Date. Hold Shift to multi-sort."
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span>Last Date</span>
                        {(() => {
                          const idx = sortLevels.findIndex(l => l.column === 'lastDate');
                          if (idx === -1) return <ArrowUpDown className="w-3 h-3 text-slate-300 group-hover:text-slate-500" />;
                          return (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-black bg-blue-600 text-white shadow-2xs">
                              #{idx + 1} {sortLevels[idx].order === 'desc' ? '▼' : '▲'}
                            </span>
                          );
                        })()}
                      </div>
                    </th>

                    <th className="py-3 px-3 text-center w-36">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/70">
                  {paginatedJobs.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="py-12 text-center text-slate-400 font-medium">
                        No job notifications matched the selected filters.
                      </td>
                    </tr>
                  ) : (
                    paginatedJobs.map((job, idx) => {
                      const absoluteIndex = (currentPage - 1) * pageSize + idx + 1;
                      return (
                        <tr key={job.id || idx} className="hover:bg-blue-50/30 transition">
                          {/* Index */}
                          <td className="py-3 px-3 text-center font-bold text-slate-400">
                            {absoluteIndex}
                          </td>

                          {/* Status Badge */}
                          <td className="py-3 px-3">
                            {job.expired ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                                Expired
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                Active
                              </span>
                            )}
                          </td>

                          {/* Upload Date */}
                          <td className="py-3 px-3">
                            <span className="font-semibold text-slate-700 whitespace-nowrap">
                              {job.uploadDateStr}
                            </span>
                          </td>

                          {/* Job Title */}
                          <td className="py-3 px-3">
                            <Link
                              to={`/${job.id}`}
                              target="_blank"
                              className="font-bold text-blue-900 hover:text-blue-600 transition block leading-snug"
                            >
                              {job.t}
                            </Link>
                            <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                              /{job.id}
                            </span>
                          </td>

                          {/* Job URL & Copy Button */}
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/90 rounded-lg p-1.5 w-full min-w-[240px] max-w-[450px]">
                              <span
                                className="text-[11px] font-mono text-slate-600 truncate flex-1 select-all"
                                title={`https://newvacancyalert.in/${job.id}`}
                              >
                                https://newvacancyalert.in/{job.id}
                              </span>
                              <button
                                onClick={() => handleCopyLink(job.id || '')}
                                className={`px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 transition shrink-0 ${
                                  copiedSlug === job.id
                                    ? 'bg-emerald-600 text-white shadow-xs'
                                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs'
                                }`}
                                title="Copy Full URL"
                              >
                                {copiedSlug === job.id ? (
                                  <>
                                    <Check className="w-3 h-3 text-white" />
                                    <span>Copied</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3 text-slate-500" />
                                    <span>Copy</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </td>

                          {/* Board */}
                          <td className="py-3 px-3">
                            <span className="font-medium text-slate-700 leading-tight block">
                              {job.b}
                            </span>
                          </td>

                          {/* Total Posts */}
                          <td className="py-3 px-3 text-center">
                            <span className="inline-block px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-black text-xs border border-blue-200/60 shadow-2xs">
                              {job.vacancies > 0 ? job.vacancies.toLocaleString() : 'N/A'}
                            </span>
                          </td>

                          {/* Qualification */}
                          <td className="py-3 px-3">
                            <span className="text-[11px] text-slate-600 font-medium line-clamp-2" title={job.q}>
                              {job.q}
                            </span>
                          </td>

                          {/* Last Date */}
                          <td className="py-3 px-3 whitespace-nowrap">
                            <span className={`font-bold ${job.expired ? 'text-slate-400' : 'text-slate-800'}`}>
                              {job.l}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-3 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => setSelectedJob(job)}
                                className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                title="Quick Inspect"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleCopyLink(job.id || '')}
                                className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                                title="Copy Link"
                              >
                                {copiedSlug === job.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                              </button>
                              <Link
                                to={`/${job.id}`}
                                target="_blank"
                                className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                title="Open Live Page"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </Link>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2 text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-2">
                <span>Showing {filteredJobs.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredJobs.length)} of {filteredJobs.length} entries</span>
                <select
                  value={pageSize}
                  onChange={e => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="py-1 px-2 border border-slate-300 rounded-lg bg-white text-slate-800 font-bold"
                >
                  <option value={15}>15 / page</option>
                  <option value={25}>25 / page</option>
                  <option value={50}>50 / page</option>
                  <option value={100}>100 / page</option>
                  <option value={9999}>All jobs</option>
                </select>
              </div>

              {pageSize < 9999 && totalPages > 1 && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="px-3 py-1 font-bold text-slate-700 bg-slate-100 rounded-lg">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 2: COMMENTS MANAGEMENT & MODERATION */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'comments' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-4 sm:p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-indigo-600" />
                  <span>Comments Moderation & Management</span>
                  <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-full border border-indigo-200">
                    {filteredComments.length} loaded
                  </span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real-time feed of all user comments posted across recruitment notices and articles.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-medium">
                  Auto-sync active
                </span>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
              </div>
            </div>

            {/* Comment Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-50/80 p-3.5 rounded-xl border border-slate-200">
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search text, author, UID, page..."
                  value={commentSearch}
                  onChange={e => setCommentSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              {/* Type Filter */}
              <div>
                <select
                  value={commentTypeFilter}
                  onChange={e => setCommentTypeFilter(e.target.value as any)}
                  className="w-full py-2 px-2.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 font-bold focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">All Comments & Replies</option>
                  <option value="parent">Parent Comments Only</option>
                  <option value="reply">Replies Only</option>
                </select>
              </div>

              {/* Specific Page Filter */}
              <div>
                <select
                  value={commentPageFilter}
                  onChange={e => setCommentPageFilter(e.target.value)}
                  className="w-full py-2 px-2.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 font-bold focus:outline-hidden focus:ring-2 focus:ring-indigo-500 truncate"
                >
                  <option value="all">All Job Pages ({commentPagesList.length})</option>
                  {commentPagesList.map(p => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Filter */}
              <div>
                <select
                  value={commentSortBy}
                  onChange={e => setCommentSortBy(e.target.value as any)}
                  className="w-full py-2 px-2.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 font-bold focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="newest">🕒 Newest Comments First</option>
                  <option value="oldest">⏳ Oldest Comments First</option>
                  <option value="likes">❤️ Most Liked Comments</option>
                </select>
              </div>
            </div>

            {/* Comments List */}
            {loadingComments ? (
              <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-400">
                <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs font-bold">Loading comments from Firestore...</span>
              </div>
            ) : filteredComments.length === 0 ? (
              <div className="py-12 text-center text-slate-400 font-medium">
                No comments found matching the filters.
              </div>
            ) : (
              <div className="space-y-3">
                {filteredComments.map(comment => {
                  const isReply = Boolean(comment.parent_id);
                  const dateFormatted = comment.created_at?.toDate 
                    ? comment.created_at.toDate().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
                    : (comment.created_at ? new Date(comment.created_at).toLocaleString() : 'Just now');

                  return (
                    <div
                      key={comment.id}
                      className={`p-4 rounded-xl border transition-all ${
                        isReply
                          ? 'bg-slate-50/90 border-slate-200 ml-4 sm:ml-8'
                          : 'bg-white border-slate-200 shadow-2xs hover:border-slate-300'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-600 to-blue-600 text-white font-black text-xs flex items-center justify-center uppercase shrink-0">
                            {comment.author_name ? comment.author_name.charAt(0) : 'U'}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-900 text-xs">
                                {comment.author_name || 'Anonymous User'}
                              </span>
                              <span className="text-[10px] px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded-md font-medium">
                                {comment.author_role || 'Job Aspirant'}
                              </span>
                              {isReply && (
                                <span className="inline-flex items-center gap-0.5 text-[10px] bg-amber-50 text-amber-700 px-1.5 py-0.2 rounded font-bold border border-amber-200">
                                  <CornerDownRight className="w-2.5 h-2.5" /> Reply
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400">
                              <span>UID: <code className="font-mono text-[9px] text-slate-500">{comment.author_uid?.slice(0, 10)}...</code></span>
                              <span>•</span>
                              <span>{dateFormatted}</span>
                            </div>
                          </div>
                        </div>

                        {/* Page Link & Actions */}
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/${comment.page_id}`}
                            target="_blank"
                            className="text-[11px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-2 py-1 rounded-lg border border-blue-200/60 flex items-center gap-1 transition"
                            title="Open Job Page"
                          >
                            <span className="max-w-[140px] truncate">/{comment.page_id}</span>
                            <ExternalLink className="w-3 h-3 shrink-0" />
                          </Link>

                          <button
                            onClick={() => setDeleteConfirmComment(comment)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Delete Comment"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Content Body */}
                      <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap pl-9">
                        {comment.content}
                      </p>

                      {/* Footer Info */}
                      <div className="flex items-center gap-3 mt-2 pl-9 pt-1.5 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="w-3 h-3 text-red-500" />
                          <span>{comment.likes_count || 0} Likes</span>
                        </span>
                        <span className="text-slate-300">|</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          ID: {comment.id}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 3: REPORTED COMMENTS */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'reports' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-4 sm:p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <Flag className="w-5 h-5 text-amber-600" />
                  <span>Flagged & Reported Comments</span>
                  <span className="text-xs bg-amber-50 text-amber-700 font-bold px-2 py-0.5 rounded-full border border-amber-200">
                    {reports.length} pending
                  </span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  User-submitted moderation reports for abusive, spam, or misleading content.
                </p>
              </div>
            </div>

            {loadingReports ? (
              <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-400">
                <div className="w-8 h-8 border-3 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs font-bold">Loading reports...</span>
              </div>
            ) : reports.length === 0 ? (
              <div className="py-12 text-center text-slate-400 font-medium">
                🎉 No reported comments! The platform discussions are completely clean.
              </div>
            ) : (
              <div className="space-y-3">
                {reports.map(rep => {
                  const targetComment = comments.find(c => c.id === rep.commentId);
                  const reportTime = rep.createdAt?.toDate 
                    ? rep.createdAt.toDate().toLocaleString('en-IN')
                    : 'Recent';

                  return (
                    <div key={rep.id} className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-md bg-amber-600 text-white font-black text-xs uppercase tracking-wider">
                            {rep.reason}
                          </span>
                          <span className="text-xs text-slate-500 font-medium">
                            Reported on {reportTime}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDismissReport(rep.id)}
                            className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-bold transition"
                          >
                            Dismiss Report
                          </button>
                          {targetComment && (
                            <button
                              onClick={() => setDeleteConfirmComment(targetComment)}
                              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-2xs"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete Comment</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {rep.description && (
                        <p className="text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-amber-200/80">
                          <strong className="text-slate-900 block mb-0.5">Reporter Note:</strong>
                          {rep.description}
                        </p>
                      )}

                      {targetComment ? (
                        <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs">
                          <div className="flex items-center justify-between text-slate-500 mb-1">
                            <span className="font-bold text-slate-800">{targetComment.author_name} ({targetComment.author_role})</span>
                            <span>Page: <Link to={`/${targetComment.page_id}`} target="_blank" className="text-blue-600 underline">/{targetComment.page_id}</Link></span>
                          </div>
                          <p className="text-slate-800 whitespace-pre-wrap">{targetComment.content}</p>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-500 italic">
                          (Target comment ID: {rep.commentId} has already been deleted or is not in recent cache)
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 4: TELEGRAM SUBSCRIBERS & TOP SUBSCRIBED SECTIONS */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'alerts' && (
          <div className="space-y-6">
            {/* Top Alert Subscriptions Header Bar */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 border border-sky-100 shadow-2xs">
                    <Send className="w-6 h-6 text-sky-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-xl font-black text-slate-900 tracking-tight">
                        Telegram Subscribers & Alert Insights
                      </h2>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        Live Firestore Sync
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Real-time breakdown of connected Telegram candidates, high-demand qualifications, top states, and alert conversion sources.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start md:self-auto">
                  <button
                    onClick={() => {
                      showToast('Subscriber list synced from Firestore!');
                    }}
                    className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition flex items-center gap-1.5 shadow-2xs"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loadingAlerts ? 'animate-spin text-sky-600' : 'text-slate-400'}`} />
                    <span>Refresh</span>
                  </button>
                </div>
              </div>

              {/* 4 KPI Hero Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-slate-100">
                <div className="bg-sky-50/50 rounded-xl p-3.5 border border-sky-100/80">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-sky-900">Active Telegram Users</span>
                    <Send className="w-4 h-4 text-sky-600" />
                  </div>
                  <p className="text-2xl font-black text-sky-700">
                    {alertAnalytics.activeTelegramUsers.toLocaleString()}
                  </p>
                  <p className="text-[11px] text-sky-600/80 font-semibold mt-0.5">
                    {alertAnalytics.totalTelegramUsers} total connected accounts
                  </p>
                </div>

                <div className="bg-purple-50/50 rounded-xl p-3.5 border border-purple-100/80">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-purple-900">Active Alert Rules</span>
                    <Bell className="w-4 h-4 text-purple-600" />
                  </div>
                  <p className="text-2xl font-black text-purple-700">
                    {alertAnalytics.activeSubscriptions.toLocaleString()}
                  </p>
                  <p className="text-[11px] text-purple-600/80 font-semibold mt-0.5">
                    {alertAnalytics.totalSubscriptions} total subscriptions configured
                  </p>
                </div>

                <div className="bg-blue-50/50 rounded-xl p-3.5 border border-blue-100/80">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-900">Total Candidates</span>
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="text-2xl font-black text-blue-700">
                    {alertAnalytics.totalCandidates.toLocaleString()}
                  </p>
                  <p className="text-[11px] text-blue-600/80 font-semibold mt-0.5">
                    {alertAnalytics.connectedCandidatesCount} with Telegram active
                  </p>
                </div>

                <div className="bg-emerald-50/50 rounded-xl p-3.5 border border-emerald-100/80">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-900">State / Area Reach</span>
                    <MapPin className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-2xl font-black text-emerald-700">
                    {alertAnalytics.coveredLocationsCount.toLocaleString()}
                  </p>
                  <p className="text-[11px] text-emerald-600/80 font-semibold mt-0.5">
                    States & UTs actively tracked
                  </p>
                </div>
              </div>
            </div>

            {/* Top Subscribed Sections Analytics (Grid of Qualifications & Locations) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Card 1: Top Qualifications in Demand */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 text-sm">Top Subscribed Qualifications</h3>
                      <p className="text-[11px] text-slate-500">Highest alert demand across candidate profiles</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    {alertAnalytics.topQualifications.length} types
                  </span>
                </div>

                {alertAnalytics.topQualifications.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 text-xs font-medium">
                    No qualification alert subscriptions created yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {alertAnalytics.topQualifications.slice(0, 7).map((item, idx) => (
                      <div key={item.slug} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className={`w-5 h-5 rounded-md flex items-center justify-center font-black text-[10px] ${
                              idx === 0
                                ? 'bg-amber-100 text-amber-800 font-black'
                                : idx === 1
                                ? 'bg-slate-200 text-slate-700'
                                : idx === 2
                                ? 'bg-amber-50 text-amber-700'
                                : 'bg-slate-100 text-slate-500'
                            }`}>
                              #{idx + 1}
                            </span>
                            <span className="font-bold text-slate-800">{item.label}</span>
                          </div>
                          <div className="flex items-center gap-2 font-mono">
                            <span className="font-bold text-slate-900">{item.count}</span>
                            <span className="text-[10px] text-slate-400">({item.percentage}%)</span>
                          </div>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                            style={{ width: `${Math.max(item.percentage, 4)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Card 2: Top Locations in Demand */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 text-sm">Top Subscribed States & Regions</h3>
                      <p className="text-[11px] text-slate-500">Highest alert density by geographical location</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    {alertAnalytics.topLocations.length} locations
                  </span>
                </div>

                {alertAnalytics.topLocations.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 text-xs font-medium">
                    No location alert subscriptions created yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {alertAnalytics.topLocations.slice(0, 7).map((item, idx) => (
                      <div key={item.slug} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className={`w-5 h-5 rounded-md flex items-center justify-center font-black text-[10px] ${
                              idx === 0
                                ? 'bg-emerald-100 text-emerald-800'
                                : idx === 1
                                ? 'bg-slate-200 text-slate-700'
                                : idx === 2
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-slate-100 text-slate-500'
                            }`}>
                              #{idx + 1}
                            </span>
                            <span className="font-bold text-slate-800">{item.label}</span>
                          </div>
                          <div className="flex items-center gap-2 font-mono">
                            <span className="font-bold text-slate-900">{item.count}</span>
                            <span className="text-[10px] text-slate-400">({item.percentage}%)</span>
                          </div>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                            style={{ width: `${Math.max(item.percentage, 4)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Top Combinations & Top Source Jobs Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Qualification + Location Combinations */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 text-sm">Top Alert Combinations</h3>
                      <p className="text-[11px] text-slate-500">Most frequent Qualification + State alert pairs</p>
                    </div>
                  </div>
                </div>

                {alertAnalytics.topCombinations.length === 0 ? (
                  <div className="py-6 text-center text-slate-400 text-xs font-medium">
                    No combination data available yet.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {alertAnalytics.topCombinations.map((combo) => (
                      <div
                        key={combo.key}
                        className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-sky-50/40 transition flex items-center justify-between gap-2"
                      >
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-slate-800 truncate block">
                            {combo.qualLabel}
                          </span>
                          <span className="text-[10px] text-slate-500 flex items-center gap-1 font-medium">
                            <MapPin className="w-2.5 h-2.5 text-slate-400" />
                            {combo.locLabel}
                          </span>
                        </div>
                        <span className="px-2 py-1 rounded-lg bg-white border border-slate-200 font-mono text-xs font-black text-sky-700 shrink-0 shadow-2xs">
                          {combo.count}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Top Source Jobs Driving Alert Subscriptions */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                      <Flame className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 text-sm">Top Source Vacancies Driving Signups</h3>
                      <p className="text-[11px] text-slate-500">Recruitment notification pages where candidates activated alerts</p>
                    </div>
                  </div>
                </div>

                {alertAnalytics.topSourceJobs.length === 0 ? (
                  <div className="py-6 text-center text-slate-400 text-xs font-medium">
                    Subscriptions are direct or from general landing pages.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {alertAnalytics.topSourceJobs.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="min-w-0">
                          <p className="font-bold text-slate-800 truncate">{item.title}</p>
                          <span className="text-[10px] text-slate-400 font-medium">Source Post</span>
                        </div>
                        <span className="px-2 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-xs font-mono font-black shrink-0">
                          +{item.count} alerts
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Candidate Directory (Subscribers List) */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-5 sm:p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-black text-slate-900 text-base tracking-tight flex items-center gap-2">
                    <Users className="w-5 h-5 text-sky-600" />
                    <span>Candidate Subscribers Directory</span>
                    <span className="text-xs bg-sky-100 text-sky-800 font-bold px-2 py-0.5 rounded-full">
                      {filteredCandidates.length} Candidates
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Direct list of registered candidates, linked Telegram profiles, and configured qualification/state alerts.
                  </p>
                </div>

                {/* Status Filter Tabs */}
                <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl self-start md:self-auto">
                  <button
                    onClick={() => { setSubscriberStatusFilter('all'); setSubscriberPage(1); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      subscriberStatusFilter === 'all'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    All ({alertAnalytics.candidates.length})
                  </button>
                  <button
                    onClick={() => { setSubscriberStatusFilter('connected'); setSubscriberPage(1); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                      subscriberStatusFilter === 'connected'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Send className="w-3 h-3" />
                    <span>Telegram Active ({alertAnalytics.connectedCandidatesCount})</span>
                  </button>
                  <button
                    onClick={() => { setSubscriberStatusFilter('not_connected'); setSubscriberPage(1); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      subscriberStatusFilter === 'not_connected'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Not Connected ({alertAnalytics.candidates.length - alertAnalytics.connectedCandidatesCount})
                  </button>
                </div>
              </div>

              {/* Search and Filters Toolbar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Search */}
                <div className="lg:col-span-2 relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search candidate email, name, Telegram username, chat ID, qualification..."
                    value={subscriberSearch}
                    onChange={e => { setSubscriberSearch(e.target.value); setSubscriberPage(1); }}
                    className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-xs text-slate-800 font-medium"
                  />
                  {subscriberSearch && (
                    <button
                      onClick={() => setSubscriberSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Qualification Filter */}
                <div>
                  <select
                    value={subscriberQualFilter}
                    onChange={e => { setSubscriberQualFilter(e.target.value); setSubscriberPage(1); }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white"
                  >
                    <option value="all">All Qualifications ({alertAnalytics.topQualifications.length})</option>
                    {alertAnalytics.topQualifications.map(q => (
                      <option key={q.slug} value={q.slug}>
                        {q.label} ({q.count})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Location Filter */}
                <div>
                  <select
                    value={subscriberLocFilter}
                    onChange={e => { setSubscriberLocFilter(e.target.value); setSubscriberPage(1); }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white"
                  >
                    <option value="all">All States & UTs ({alertAnalytics.topLocations.length})</option>
                    {alertAnalytics.topLocations.map(l => (
                      <option key={l.slug} value={l.slug}>
                        {l.label} ({l.count})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Table of Candidates */}
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-black tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Candidate Profile</th>
                      <th className="py-3 px-4">Telegram Connection</th>
                      <th className="py-3 px-4">Subscribed Alerts</th>
                      <th className="py-3 px-4">Last Activity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedCandidates.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-12 text-center text-slate-400">
                          <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                          <p className="font-bold text-sm text-slate-600">No candidates match your criteria</p>
                          <p className="text-xs text-slate-400 mt-1">Try clearing or broadening your search filters</p>
                        </td>
                      </tr>
                    ) : (
                      paginatedCandidates.map(c => {
                        const tg = c.telegram;
                        const hasTelegram = Boolean(tg && tg.isActive);

                        return (
                          <tr key={c.userId} className="hover:bg-slate-50/80 transition">
                            {/* Candidate Profile */}
                            <td className="py-3.5 px-4">
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-black text-slate-900 text-xs">
                                    {c.name || (c.email ? c.email.split('@')[0] : 'Candidate')}
                                  </span>
                                </div>
                                {c.email ? (
                                  <p className="text-xs text-slate-500 font-medium">{c.email}</p>
                                ) : (
                                  <p className="text-[11px] text-slate-400 italic">No email stored</p>
                                )}
                                <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
                                  <span>UID: {c.userId.slice(0, 10)}...</span>
                                  <button
                                    onClick={() => handleCopyText(c.userId, 'User UID')}
                                    className="hover:text-slate-700 transition"
                                    title="Copy UID"
                                  >
                                    <Copy className="w-2.5 h-2.5" />
                                  </button>
                                </div>
                              </div>
                            </td>

                            {/* Telegram Connection */}
                            <td className="py-3.5 px-4">
                              {hasTelegram ? (
                                <div className="space-y-1">
                                  <div className="flex items-center gap-1.5">
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                      <Check className="w-3 h-3" />
                                      Connected
                                    </span>
                                    {tg?.telegramUsername && (
                                      <a
                                        href={`https://t.me/${tg.telegramUsername}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-sky-600 hover:text-sky-800 font-bold hover:underline"
                                      >
                                        <Send className="w-3 h-3" />
                                        <span>@{tg.telegramUsername}</span>
                                      </a>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                                    <span className="font-mono">Chat ID: {tg?.telegramChatId}</span>
                                    <button
                                      onClick={() => handleCopyText(tg?.telegramChatId || '', 'Telegram Chat ID')}
                                      className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-700"
                                      title="Copy Chat ID"
                                    >
                                      <Copy className="w-3 h-3" />
                                    </button>
                                  </div>
                                  {tg?.telegramFirstName && (
                                    <p className="text-[10px] text-slate-400">Name: {tg.telegramFirstName}</p>
                                  )}
                                </div>
                              ) : tg && !tg.isActive ? (
                                <div>
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                    <AlertTriangle className="w-3 h-3" />
                                    Disconnected
                                  </span>
                                  <p className="text-[10px] text-slate-400 mt-1">Previously linked</p>
                                </div>
                              ) : (
                                <div>
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                                    <XCircle className="w-3 h-3 text-slate-400" />
                                    Not Linked
                                  </span>
                                </div>
                              )}
                            </td>

                            {/* Subscribed Alerts */}
                            <td className="py-3.5 px-4 max-w-xs">
                              {c.subscriptions.length === 0 ? (
                                <span className="text-[11px] text-slate-400 italic">No alert rules configured</span>
                              ) : (
                                <div className="space-y-1.5">
                                  <div className="flex items-center gap-1.5">
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-50 text-purple-700 border border-purple-200">
                                      {c.activeSubscriptionsCount} Active / {c.subscriptions.length} Total
                                    </span>
                                  </div>
                                  <div className="flex flex-wrap gap-1">
                                    {c.subscriptions.slice(0, 3).map(sub => (
                                      <span
                                        key={sub.id}
                                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                                          sub.isActive
                                            ? 'bg-slate-100 text-slate-800 border border-slate-200'
                                            : 'bg-slate-50 text-slate-400 line-through'
                                        }`}
                                      >
                                        <span>{sub.qualificationLabel || sub.qualification}</span>
                                        <span className="text-slate-400">•</span>
                                        <span className="text-slate-600">{sub.locationLabel || sub.location}</span>
                                      </span>
                                    ))}
                                    {c.subscriptions.length > 3 && (
                                      <span className="text-[10px] text-slate-400 font-bold px-1 py-0.5">
                                        +{c.subscriptions.length - 3} more
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}
                            </td>

                            {/* Last Activity */}
                            <td className="py-3.5 px-4 whitespace-nowrap text-slate-500 text-xs">
                              {c.lastActive ? (
                                <div>
                                  <p className="font-medium text-slate-700">
                                    {new Date(c.lastActive).toLocaleDateString(undefined, {
                                      day: 'numeric',
                                      month: 'short',
                                      year: 'numeric'
                                    })}
                                  </p>
                                  <p className="text-[10px] text-slate-400 font-mono">
                                    {new Date(c.lastActive).toLocaleTimeString([], {
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </p>
                                </div>
                              ) : (
                                <span className="text-slate-400 text-[11px]">—</span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {totalCandidatePages > 1 && (
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <span className="text-xs text-slate-500 font-medium">
                    Showing {(subscriberPage - 1) * SUBSCRIBER_PAGE_SIZE + 1} to{' '}
                    {Math.min(subscriberPage * SUBSCRIBER_PAGE_SIZE, filteredCandidates.length)} of{' '}
                    {filteredCandidates.length} candidates
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setSubscriberPage(p => Math.max(p - 1, 1))}
                      disabled={subscriberPage === 1}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>Previous</span>
                    </button>
                    <span className="text-xs font-bold text-slate-700 px-2">
                      Page {subscriberPage} of {totalCandidatePages}
                    </span>
                    <button
                      onClick={() => setSubscriberPage(p => Math.min(p + 1, totalCandidatePages))}
                      disabled={subscriberPage === totalCandidatePages}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 5: SITE OVERVIEW & TOOLS */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'tools' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-6 p-4 sm:p-6">
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-600" />
                <span>Site Diagnostics & Quick Tools</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Quick diagnostic links and operational endpoints for site maintenance.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <a
                href="/rss.xml"
                target="_blank"
                className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50/60 transition group block"
              >
                <div className="flex items-center justify-between text-blue-600 mb-1">
                  <span className="font-black text-sm text-slate-900 group-hover:text-blue-600">RSS / XML Feed</span>
                  <ExternalLink className="w-4 h-4" />
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Direct RSS XML feed for push syndication and search engine discovery.
                </p>
              </a>

              <Link
                to="/articles"
                target="_blank"
                className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50/60 transition group block"
              >
                <div className="flex items-center justify-between text-blue-600 mb-1">
                  <span className="font-black text-sm text-slate-900 group-hover:text-blue-600">Articles & Study Guides</span>
                  <ExternalLink className="w-4 h-4" />
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Exams calendar, salary calculator, and specialized prep articles hub.
                </p>
              </Link>

              <Link
                to="/marketing-partner"
                target="_blank"
                className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50/60 transition group block"
              >
                <div className="flex items-center justify-between text-blue-600 mb-1">
                  <span className="font-black text-sm text-slate-900 group-hover:text-blue-600">Marketing Partners Hub</span>
                  <ExternalLink className="w-4 h-4" />
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Affiliate partner registration and click tracking dashboard portal.
                </p>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
