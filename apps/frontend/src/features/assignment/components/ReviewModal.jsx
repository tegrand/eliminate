import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { X, Star, Loader2, MessageSquare } from "lucide-react";
import api from "../../../api/axios";
import toast from "react-hot-toast";

export default function ReviewModal({ isOpen, onClose, target, assignmentId }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  const submitReviewMutation = useMutation({
    mutationFn: (data) => api.post("/reviews", data),
    onSuccess: () => {
      toast.success("Review submitted successfully!");
      onClose();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to submit review");
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a rating.");
      return;
    }

    submitReviewMutation.mutate({
      rating,
      comment,
      assignmentId,
      targetWorkerId: target?.workerId || undefined,
      targetAgencyId: target?.agencyId || undefined,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[85vh] flex flex-col overflow-hidden animate-slide-up">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gray-50/50">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Rate & Review</h2>
            <p className="text-xs text-gray-500">Share your experience with {target?.name || "them"}.</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          <form id="review-form" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Star Rating */}
            <div className="flex flex-col items-center justify-center space-y-2">
              <span className="text-sm font-bold text-gray-700">Overall Rating</span>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 transition-transform hover:scale-110 focus:outline-none"
                  >
                    <Star 
                      className={`w-10 h-10 ${
                        star <= (hoverRating || rating) 
                          ? "fill-amber-400 text-amber-400" 
                          : "fill-gray-100 text-gray-200"
                      } transition-colors`} 
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs font-medium text-amber-600 h-4">
                {rating === 1 ? "Poor" : rating === 2 ? "Fair" : rating === 3 ? "Good" : rating === 4 ? "Very Good" : rating === 5 ? "Excellent!" : ""}
              </span>
            </div>

            {/* Comment */}
            <div>
              <label className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-gray-400" /> Write a Review
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                placeholder="What did you like or dislike? How was their performance?"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-100 focus:border-amber-500 transition-all resize-none"
              ></textarea>
            </div>
            
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            form="review-form"
            disabled={submitReviewMutation.isPending || rating === 0}
            className="px-6 py-2.5 bg-amber-500 text-white text-sm font-bold rounded-xl hover:bg-amber-600 shadow-sm shadow-amber-200 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {submitReviewMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            Submit Review
          </button>
        </div>
      </div>
    </div>
  );
}
