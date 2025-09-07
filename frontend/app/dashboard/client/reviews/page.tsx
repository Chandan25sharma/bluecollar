"use client";

import { useState } from "react";

interface Review {
  id: string;
  service: string;
  provider: string;
  bookingId: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
  providerResponse?: string;
  responseDate?: string;
}

interface ServiceBooking {
  id: string;
  service: string;
  provider: string;
  date: string;
  completed: boolean;
  reviewed: boolean;
}

export default function ClientReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: "1",
      service: "Electrical Wiring Installation",
      provider: "John's Electrical Services",
      bookingId: "BK001",
      rating: 5,
      comment: "Excellent work! John arrived on time, was very professional, and completed the job efficiently. The quality of work exceeded my expectations. I would definitely hire again for future electrical needs.",
      date: "2023-10-16",
      helpful: 3,
      providerResponse: "Thank you for your kind words! We're delighted to hear you were satisfied with our service. Looking forward to assisting you with any future electrical needs.",
      responseDate: "2023-10-17"
    },
    {
      id: "2",
      service: "TV Mounting",
      provider: "Install Experts",
      bookingId: "BK006",
      rating: 4,
      comment: "Good service overall. The technician was knowledgeable and careful with my walls. Took a bit longer than expected but the result was good.",
      date: "2023-09-29",
      helpful: 1
    }
  ]);

  const [serviceBookings, setServiceBookings] = useState<ServiceBooking[]>([
    {
      id: "BK002",
      service: "Kitchen Plumbing Repair",
      provider: "Mike's Plumbing",
      date: "2023-10-20",
      completed: true,
      reviewed: false
    },
    {
      id: "BK003",
      service: "Furniture Assembly",
      provider: "Handyman Services",
      date: "2023-10-25",
      completed: false,
      reviewed: false
    },
    {
      id: "BK004",
      service: "Air Conditioning Service",
      provider: "Cool Air Experts",
      date: "2023-11-01",
      completed: false,
      reviewed: false
    }
  ]);

  const [newReview, setNewReview] = useState({
    bookingId: "",
    rating: 5,
    comment: "",
    service: "",
    provider: ""
  });

  const [activeTab, setActiveTab] = useState<"my-reviews" | "add-review">("my-reviews");
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingReviewId) {
      // Edit existing review
      setReviews(reviews.map(review => 
        review.id === editingReviewId 
          ? { ...review, rating: newReview.rating, comment: newReview.comment }
          : review
      ));
      setEditingReviewId(null);
    } else {
      // Add new review
      const selectedBooking = serviceBookings.find(booking => booking.id === newReview.bookingId);
      const newReviewObj: Review = {
        id: String(reviews.length + 1),
        service: selectedBooking?.service || "",
        provider: selectedBooking?.provider || "",
        bookingId: newReview.bookingId,
        rating: newReview.rating,
        comment: newReview.comment,
        date: new Date().toISOString().split('T')[0],
        helpful: 0
      };
      
      setReviews([...reviews, newReviewObj]);
      
      // Mark booking as reviewed
      setServiceBookings(serviceBookings.map(booking => 
        booking.id === newReview.bookingId 
          ? { ...booking, reviewed: true }
          : booking
      ));
    }
    
    setNewReview({ bookingId: "", rating: 5, comment: "", service: "", provider: "" });
  };

  const handleEditReview = (review: Review) => {
    setNewReview({
      bookingId: review.bookingId,
      rating: review.rating,
      comment: review.comment,
      service: review.service,
      provider: review.provider
    });
    setEditingReviewId(review.id);
    setActiveTab("add-review");
  };

  const handleDeleteReview = (id: string) => {
    setReviews(reviews.filter(review => review.id !== id));
  };

  const handleHelpful = (id: string) => {
    setReviews(reviews.map(review => 
      review.id === id 
        ? { ...review, helpful: review.helpful + 1 }
        : review
    ));
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`h-5 w-5 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  const completedBookings = serviceBookings.filter(booking => booking.completed && !booking.reviewed);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">My Reviews</h1>
      <p className="text-gray-600 mb-6">Manage and share your experiences with service providers</p>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("my-reviews")}
            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "my-reviews"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            My Reviews
          </button>
          <button
            onClick={() => setActiveTab("add-review")}
            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "add-review"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Add Review
          </button>
        </nav>
      </div>

      {/* My Reviews Tab */}
      {activeTab === "my-reviews" && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-gray-900">Your Reviews</h2>
            <div className="text-sm text-gray-500">
              {reviews.length} review{reviews.length !== 1 ? 's' : ''}
            </div>
          </div>

          {reviews.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No reviews yet</h3>
              <p className="mt-1 text-sm text-gray-500">You haven't reviewed any services yet.</p>
              <div className="mt-6">
                <button
                  onClick={() => setActiveTab("add-review")}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Write Your First Review
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h3 className="text-lg font-medium text-gray-900">{review.service}</h3>
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {review.bookingId}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">Service by {review.provider}</p>
                        
                        <div className="mt-3 flex items-center">
                          {renderStars(review.rating)}
                          <span className="ml-2 text-sm text-gray-500">{formatDate(review.date)}</span>
                        </div>
                        
                        <p className="mt-3 text-gray-700">{review.comment}</p>
                        
                        {review.providerResponse && (
                          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-start">
                              <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                                </svg>
                              </div>
                              <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900">Provider Response</p>
                                <p className="mt-1 text-sm text-gray-700">{review.providerResponse}</p>
                                {review.responseDate && (
                                  <p className="mt-1 text-xs text-gray-500">{formatDate(review.responseDate)}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="ml-4 flex-shrink-0">
                        <div className="relative inline-block text-left">
                          <button className="flex items-center text-gray-400 hover:text-gray-600">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                            </svg>
                          </button>
                          
                          <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 hidden">
                            <div className="py-1">
                              <button
                                onClick={() => handleEditReview(review)}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              >
                                Edit Review
                              </button>
                              <button
                                onClick={() => handleDeleteReview(review.id)}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              >
                                Delete Review
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex items-center justify-between">
                      <button
                        onClick={() => handleHelpful(review.id)}
                        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
                      >
                        <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905a3.61 3.61 0 01-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                        </svg>
                        Helpful ({review.helpful})
                      </button>
                      
                      <div className="text-sm text-gray-500">
                        {review.rating}/5 stars
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add Review Tab */}
      {activeTab === "add-review" && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              {editingReviewId ? "Edit Your Review" : "Write a Review"}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Share your experience to help others find the best service providers
            </p>
          </div>
          
          <form onSubmit={handleSubmitReview} className="p-6 space-y-6">
            {!editingReviewId && (
              <div>
                <label htmlFor="booking" className="block text-sm font-medium text-gray-700">
                  Select Booking to Review
                </label>
                <select
                  id="booking"
                  value={newReview.bookingId}
                  onChange={(e) => {
                    const selectedBooking = serviceBookings.find(booking => booking.id === e.target.value);
                    setNewReview({
                      ...newReview,
                      bookingId: e.target.value,
                      service: selectedBooking?.service || "",
                      provider: selectedBooking?.provider || ""
                    });
                  }}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  required
                >
                  <option value="">Select a completed service</option>
                  {completedBookings.map((booking) => (
                    <option key={booking.id} value={booking.id}>
                      {booking.service} by {booking.provider} ({booking.date})
                    </option>
                  ))}
                </select>
                {completedBookings.length === 0 && (
                  <p className="mt-2 text-sm text-gray-500">You don't have any completed services waiting for review.</p>
                )}
              </div>
            )}

            {newReview.bookingId && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    How would you rate this service?
                  </label>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewReview({ ...newReview, rating: star })}
                        className="focus:outline-none"
                      >
                        <svg
                          className={`h-8 w-8 ${star <= newReview.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                  <div className="mt-1 text-sm text-gray-500">
                    {newReview.rating} star{newReview.rating !== 1 ? 's' : ''}
                  </div>
                </div>

                <div>
                  <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
                    Your Review
                  </label>
                  <textarea
                    id="comment"
                    rows={4}
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Share details of your experience with this service provider..."
                    required
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Minimum 20 characters. Be specific about what you liked or didn't like.
                  </p>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setNewReview({ bookingId: "", rating: 5, comment: "", service: "", provider: "" });
                      setEditingReviewId(null);
                      if (editingReviewId) setActiveTab("my-reviews");
                    }}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={newReview.comment.length < 20}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {editingReviewId ? "Update Review" : "Submit Review"}
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      )}
    </div>
  );
}