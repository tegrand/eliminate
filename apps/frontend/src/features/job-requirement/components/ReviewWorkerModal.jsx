import { useState } from "react";
import { Star, X } from "lucide-react";
import { reviewsApi } from "../../../api/reviews.api";
import { toast } from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function ReviewWorkerModal({ worker, job, onClose, onSuccess }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data) => reviewsApi.createReview(data),
    onSuccess: () => {
      toast.success("Review submitted successfully");
      queryClient.invalidateQueries(["reviews", worker.id]);
      if (onSuccess) onSuccess();
      onClose();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to submit review");
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please provide a star rating");
      return;
    }
    mutation.mutate({
      targetWorkerId: worker.id,
      rating,
      comment
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Review Worker</h2>
          <p className="text-sm text-gray-500 mb-6">
            Rate your experience working with <span className="font-semibold text-gray-700">{worker.firstName} {worker.lastName}</span>
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Star Rating */}
            <div className="flex flex-col items-center justify-center space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <span className="text-sm font-semibold text-gray-600 uppercase tracking-widest">Select Rating</span>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star 
                      className={`w-8 h-8 ${
                        star <= (hoverRating || rating)
                          ? "fill-amber-400 text-amber-400" 
                          : "text-gray-300 fill-transparent"
                      } transition-colors`} 
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs font-medium text-gray-400">
                {rating === 0 ? "Click to rate" : `${rating} out of 5 stars`}
              </span>
            </div>

            {/* Comment */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Additional Comments (Optional)</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience working with this person..."
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow resize-none text-sm"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={mutation.isPending}
                className="px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center min-w-[120px]"
              >
                {mutation.isPending ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
