import React, { useState, useEffect } from 'react';
import {
  Star,
  Search,
  CheckCircle2,
  Archive,
  AlertCircle,
  Eye,
  MessageSquare,
  ThumbsUp,
  UserCheck,
  Award
} from 'lucide-react';
import { store } from '../../services/store';
import { useToast } from '../../components/ui/Toast';
import { Review } from '../../types';
import { StatCard } from '../../components/ui/StatCard';

interface AdminReviewsPageProps {
  onNavigate?: (page: string, param?: string) => void;
}

export const AdminReviewsPage: React.FC<AdminReviewsPageProps> = () => {
  const { success } = useToast();
  const [reviews, setReviews] = useState<Review[]>(() => store.getReviews());
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'under_review' | 'archived'>('all');
  const [ratingFilter, setRatingFilter] = useState<string>('all');

  const refresh = () => {
    setReviews(store.getReviews());
  };

  useEffect(() => {
    const unsub = store.subscribe(refresh);
    return () => unsub();
  }, []);

  const handleStatusChange = (id: string, newStatus: Review['status']) => {
    store.updateReviewStatus(id, newStatus);
    success('Review Status Updated', `Marked review as ${newStatus.replace('_', ' ')}.`);
    refresh();
  };

  const filtered = reviews.filter((r) => {
    const term = search.toLowerCase();
    const matchesSearch =
      (r.customer_name || '').toLowerCase().includes(term) ||
      (r.service_name || '').toLowerCase().includes(term) ||
      (r.technician_name || '').toLowerCase().includes(term) ||
      (r.review_text || '').toLowerCase().includes(term);

    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    const matchesRating = ratingFilter === 'all' || r.rating.toString() === ratingFilter;

    return matchesSearch && matchesStatus && matchesRating;
  });

  const totalReviews = reviews.length || 1;
  const avgRating = (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(2);
  const fiveStarCount = reviews.filter((r) => r.rating === 5).length;
  const publishedCount = reviews.filter((r) => r.status === 'published').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Customer CSAT &amp; Service Reviews</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified repair testimonials, technician performance feedback, and moderation management.
          </p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Overall CSAT Score"
          value={`${avgRating} / 5.0`}
          subtitle="Aggregated client satisfaction"
          icon={Star}
          iconColor="text-amber-500"
          bgColor="bg-amber-50"
        />
        <StatCard
          title="Total Verified Reviews"
          value={reviews.length}
          subtitle="Post-service verified submissions"
          icon={MessageSquare}
          iconColor="text-blue-600"
          bgColor="bg-blue-50"
        />
        <StatCard
          title="5-Star Perfection Rate"
          value={`${Math.round((fiveStarCount / totalReviews) * 100)}%`}
          subtitle={`${fiveStarCount} top-tier repair evaluations`}
          icon={Award}
          iconColor="text-emerald-600"
          bgColor="bg-emerald-50"
        />
        <StatCard
          title="Publicly Published"
          value={`${publishedCount} of ${reviews.length}`}
          subtitle="Visible on public showcase"
          icon={CheckCircle2}
          iconColor="text-cyan-600"
          bgColor="bg-cyan-50"
        />
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Moderation States</option>
            <option value="published">Published Live</option>
            <option value="under_review">Under Review</option>
            <option value="archived">Archived</option>
          </select>

          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Star Ratings</option>
            <option value="5">5 Stars Only</option>
            <option value="4">4 Stars Only</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search feedback text, client, tech..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Reviews Cards List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 text-xs shadow-xs">
            No customer reviews found matching the current filter.
          </div>
        ) : (
          filtered.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="space-y-2 max-w-3xl">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= rev.rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>

                  <span className="text-xs font-bold text-slate-900">{rev.customer_name}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs text-slate-500">{rev.service_name}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {new Date(rev.created_at).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-xs text-slate-700 italic leading-relaxed">
                  "{rev.review_text || rev.comment}"
                </p>

                {rev.technician_name && (
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <UserCheck className="w-3.5 h-3.5 text-blue-500" />
                    <span>Servicing Technician: <strong className="text-slate-700">{rev.technician_name}</strong></span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                <span
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border ${
                    rev.status === 'published'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : rev.status === 'under_review'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  {rev.status.replace('_', ' ')}
                </span>

                {rev.status !== 'published' && (
                  <button
                    type="button"
                    onClick={() => handleStatusChange(rev.id, 'published')}
                    className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-2.5 py-1.5 rounded-lg transition-colors shadow-xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Publish</span>
                  </button>
                )}

                {rev.status !== 'archived' && (
                  <button
                    type="button"
                    onClick={() => handleStatusChange(rev.id, 'archived')}
                    className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs px-2.5 py-1.5 rounded-lg transition-colors"
                  >
                    <Archive className="w-3.5 h-3.5" />
                    <span>Archive</span>
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
