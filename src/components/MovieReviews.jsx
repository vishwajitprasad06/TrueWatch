import { useState, useEffect } from "react";
import { Star, Send, Heart } from "lucide-react";

function MovieReviews({ movieId }) {
  const [rating, setRating] = useState(5);
  const [commentText, setCommentText] = useState("");
  const [reviews, setReviews] = useState([]);
  const [likedReviews, setLikedReviews] = useState({});

  useEffect(() => {
    if (movieId) {
      const allReviews = JSON.parse(localStorage.getItem("movieReviews")) || {};
      setReviews(allReviews[movieId] || []);

      // User ke liked reviews local storage se load karein
      const savedLikes = JSON.parse(localStorage.getItem(`likedReviews_${movieId}`)) || {};
      setLikedReviews(savedLikes);
    }
  }, [movieId]);

// Handle Review Form Submit
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    // Logged-in user fetch karein
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const userName = currentUser ? currentUser.name : "Guest User";

    const newReview = {
      id: Date.now(),
      userName: userName,
      userInitial: userName.charAt(0).toUpperCase(),
      rating: Number(rating),
      text: commentText,
      date: new Date().toLocaleDateString(),
      likes: 0,
    };

    const allReviews = JSON.parse(localStorage.getItem("movieReviews")) || {};
    const movieReviews = allReviews[movieId] || [];
    const updatedMovieReviews = [newReview, ...movieReviews];

    allReviews[movieId] = updatedMovieReviews;
    localStorage.setItem("movieReviews", JSON.stringify(allReviews));

    setReviews(updatedMovieReviews);
    setCommentText("");
    setRating(5);
    alert("Review posted successfully! ⭐");
  };

  // Handle Heart Like Button (One like per user per review)
  const handleLike = (reviewId) => {
    if (likedReviews[reviewId]) {
      alert("You have already liked this review!");
      return;
    }

    const updatedReviews = reviews.map((rev) => {
      if (rev.id === reviewId) {
        return { ...rev, likes: (rev.likes || 0) + 1 };
      }
      return rev;
    });

    setReviews(updatedReviews);

    // Update in LocalStorage
    const allReviews = JSON.parse(localStorage.getItem("movieReviews")) || {};
    allReviews[movieId] = updatedReviews;
    localStorage.setItem("movieReviews", JSON.stringify(allReviews));

    // Mark as liked for this user
    const updatedLikes = { ...likedReviews, [reviewId]: true };
    setLikedReviews(updatedLikes);
    localStorage.setItem(`likedReviews_${movieId}`, JSON.stringify(updatedLikes));
  };

  return (
    <section style={{ maxWidth: "900px", margin: "40px auto 0 auto", padding: "0 5%" }}>
      
      {/* Light Horizontal Line Separator */}
      <hr style={{ border: "none", height: "1px", background: "#292929", marginBottom: "35px" }} />

      <h3 style={{ marginBottom: "20px", fontSize: "20px" }}>User Ratings & Reviews ({reviews.length})</h3>

      {/* Add Review Form */}
      <form onSubmit={handleReviewSubmit} style={{ background: "#171717", padding: "20px", borderRadius: "12px", border: "1px solid #292929", marginBottom: "30px", display: "flex", flexDirection: "column", gap: "15px" }}>
        
        {/* Clickable Horizontal Stars */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "14px", color: "#aaa" }}>Your Rating:</span>
          <div style={{ display: "flex", gap: "6px", cursor: "pointer" }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={22}
                fill={star <= rating ? "#f59e0b" : "transparent"}
                color={star <= rating ? "#f59e0b" : "#666"}
                onClick={() => setRating(star)}
              />
            ))}
          </div>
          <span style={{ color: "#f59e0b", fontSize: "14px", fontWeight: "bold", marginLeft: "5px" }}>({rating}/5)</span>
        </div>

        <textarea
          rows="3"
          placeholder="Write your review or thoughts about this content..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          style={{ background: "#111", border: "1px solid #333", borderRadius: "8px", padding: "12px", color: "white", fontSize: "14px", outline: "none", resize: "vertical" }}
          required
        />

        <button
          type="submit"
          style={{ background: "#e50914", color: "white", border: "none", padding: "10px 20px", borderRadius: "8px", fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", width: "fit-content", cursor: "pointer" }}
        >
          <Send size={16} /> Post Review
        </button>
      </form>

      {/* Reviews List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        {reviews.length > 0 ? (
          reviews.map((rev) => {
            const isLiked = likedReviews[rev.id];
            return (
              <div key={rev.id} style={{ background: "#171717", border: "1px solid #222", padding: "15px", borderRadius: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <strong style={{ fontSize: "15px", color: "white" }}>{rev.userName}</strong>
                  <span style={{ fontSize: "12px", color: "#888" }}>{rev.date}</span>
                </div>
                
                {/* Review Card Stars */}
                <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "8px", color: "#f59e0b", fontSize: "13px" }}>
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} size={14} fill="#f59e0b" />
                  ))}
                  <span style={{ color: "#aaa", marginLeft: "6px" }}>({rev.rating}/5)</span>
                </div>

                <p style={{ color: "#ddd", fontSize: "14px", margin: "0 0 12px 0", lineHeight: "1.5" }}>{rev.text}</p>

                {/* Heart Like Button */}
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <button
                    onClick={() => handleLike(rev.id)}
                    style={{
                      background: "#111",
                      color: isLiked ? "#e50914" : "#ccc",
                      border: "1px solid #333",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "13px",
                      fontWeight: "bold",
                      transition: "all 0.2s"
                    }}
                  >
                    <Heart size={16} fill={isLiked ? "#e50914" : "transparent"} color={isLiked ? "#e50914" : "#ccc"} /> 
                    <span>{rev.likes || 0}</span>
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div style={{ textAlign: "center", padding: "30px", background: "#171717", borderRadius: "10px", border: "1px solid #222", color: "#888" }}>
            <p style={{ margin: 0 }}>No reviews yet forth this title. Be the first one to share your review!</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default MovieReviews;