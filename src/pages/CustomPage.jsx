import { useParams } from "react-router-dom";
import BackButton from "../components/BackButton";

function CustomPage() {
  const { slug } = useParams();
  const customPages = JSON.parse(localStorage.getItem("customPages")) || [];
  
  const page = customPages.find((p) => p.slug === slug);

  if (!page) {
    return (
      <main className="page">
        <BackButton />
        <div style={{ textAlign: "center", padding: "50px" }}>
          <h2>404 — Page Not Found</h2>
          <p>The page you are looking for does not exist.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="page" style={{ maxWidth: "800px", margin: "0 auto", paddingBottom: "60px" }}>
      <BackButton />
      <div style={{ padding: "20px 5%" }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "20px" }}>{page.title}</h1>
        <div style={{ lineHeight: "1.8", color: "#ddd", whiteSpace: "pre-wrap", fontSize: "1.1rem" }}>
          {page.content}
        </div>
      </div>
    </main>
  );
}

export default CustomPage;