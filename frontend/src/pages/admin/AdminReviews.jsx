import React, { useState, useEffect } from 'react';
import { Star, Check, X, Trash2, MessageSquare } from 'lucide-react';
import { adminApi } from '../../services/adminApi';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchReviews();
  }, [filter]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const approved = filter === 'all' ? null : filter === 'approved';
      const data = await adminApi.getReviews(approved);
      setReviews(data.reviews || []);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (reviewId, isApproved) => {
    try {
      await adminApi.approveReview(reviewId, isApproved);
      fetchReviews();
    } catch (err) {
      alert('Eroare: ' + err.message);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Sigur doriți să ștergeți această recenzie?')) return;
    try {
      await adminApi.deleteReview(reviewId);
      fetchReviews();
    } catch (err) {
      alert('Eroare: ' + err.message);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ro-RO', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="p-6" data-testid="admin-reviews">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
            Gestionare Recenzii
          </h1>
          <p className="text-gray-600 mt-1">Aprobă, respinge sau șterge recenziile clienților</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
        <div className="flex gap-2">
          {['all', 'approved', 'pending'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                filter === f ? 'bg-[#D4A847] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {f === 'all' ? 'Toate' : f === 'approved' ? 'Aprobate' : 'În așteptare'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4A847]"></div>
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
          <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900">Nicio recenzie</h3>
          <p className="text-gray-600 mt-1">Nu există recenzii cu acest filtru</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {reviews.map((review) => (
            <div 
              key={review.id} 
              className={`bg-white rounded-2xl p-6 shadow-sm ${
                !review.is_approved ? 'border-2 border-yellow-200' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{review.name}</h3>
                  <p className="text-sm text-gray-500">{formatDate(review.created_at)}</p>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <p className="text-gray-700 mb-4">"{review.text}"</p>

              <div className="flex items-center justify-between pt-4 border-t">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  review.is_approved 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {review.is_approved ? 'Aprobată' : 'În așteptare'}
                </span>

                <div className="flex gap-2">
                  {!review.is_approved && (
                    <button
                      onClick={() => handleApprove(review.id, true)}
                      className="p-2 hover:bg-green-50 rounded-lg transition-colors"
                      title="Aprobă"
                    >
                      <Check className="w-5 h-5 text-green-600" />
                    </button>
                  )}
                  {review.is_approved && (
                    <button
                      onClick={() => handleApprove(review.id, false)}
                      className="p-2 hover:bg-yellow-50 rounded-lg transition-colors"
                      title="Retrage aprobarea"
                    >
                      <X className="w-5 h-5 text-yellow-600" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(review.id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    title="Șterge"
                  >
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReviews;
