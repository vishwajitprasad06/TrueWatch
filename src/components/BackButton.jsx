import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

function BackButton() {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <button className="back-btn" onClick={handleBack}>
      <ArrowLeft size={18} />
      <span>Back</span>
    </button>
  );
}

export default BackButton;