import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface PageHeaderProps {
  title: string;
  destination?: string; // Opcional: para onde volta (padrão é home '/')
}

export function PageHeader({ title, destination = "/" }: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginBottom: "2rem",
        borderBottom: "1px solid #333",
        paddingBottom: "10px",
      }}
    >
      <button
        onClick={() => navigate(destination)}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          padding: "0",
          color: "white",
        }}
        aria-label="Voltar"
      >
        <ArrowLeft size={28} />
      </button>
      <h1 style={{ margin: 0 }}>{title}</h1>
    </div>
  );
}