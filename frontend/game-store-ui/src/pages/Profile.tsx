import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { useAuth } from "../context/AuthContext";
import { userService } from "../api/user";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Lock, Camera, AlertTriangle, Mail, KeyRound, Save, Shield } from "lucide-react";
import defaultAvatar from "../assets/icon.png";

const PRIMARY_COLOR = "#6c5ce7";

export function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"personal" | "security">("personal");

  // --- ESTADOS DADOS PESSOAIS ---
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  // --- ESTADOS SEGURANÇA ---
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setNickname(user.nickname || "");
      setAvatarUrl(user.avatarUrl || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatarUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  async function handleSavePersonal(e: FormEvent) {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
      await userService.updateProfile(user.id, { name, nickname, avatarUrl });
      alert("Dados atualizados com sucesso!");
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Erro ao atualizar perfil.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveSecurity(e: FormEvent) {
    e.preventDefault();
    if (!user) return;

    if (newPassword && newPassword.length < 6) {
      alert("A nova senha deve ter no mínimo 6 caracteres.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("As senhas não conferem!");
      return;
    }

    if (!confirm("Tem certeza que deseja alterar seus dados de acesso?"))
      return;

    setLoading(true);

    try {
      const payload: any = { email };
      if (newPassword) payload.password = newPassword;

      await userService.updateProfile(user.id, payload);
      alert("Dados de segurança atualizados! Por favor, faça login novamente.");
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Erro ao atualizar segurança.");
    } finally {
      setLoading(false);
    }
  }

  // Styles Helpers
  const inputContainerStyle = {
    position: 'relative' as const,
    marginBottom: '1rem'
  };

  const iconInputStyle = {
    position: 'absolute' as const,
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#888',
    pointerEvents: 'none' as const
  };

  return (
    <div style={{ padding: "2rem", minHeight: "100vh", backgroundColor: "#121212", color: "white", display: "flex", justifyContent: "center", alignItems: 'flex-start', paddingTop: '4rem' }}>
      
      <div style={{ maxWidth: "900px", width: "100%", display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        
        {/* --- COLUNA DA ESQUERDA --- */}
        <div style={{ flex: 1, minWidth: '280px' }}>
            
            {/* Botão Voltar */}
            <button onClick={() => navigate("/")} style={{ background: "transparent", border: "1px solid #333", borderRadius: '8px', color: "#ccc", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", padding: '8px 16px', marginBottom: '1.5rem', fontSize: '0.9rem', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#fff'; e.currentTarget.style.color = '#fff'; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.color = '#ccc'; }}>
                <ArrowLeft size={18} /> Voltar para Loja
            </button>

            {/* Card do Avatar */}
            <div style={{ background: "#1e1e1e", borderRadius: "12px", padding: "2rem", display: 'flex', flexDirection: 'column', alignItems: 'center', border: '1px solid #333', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
                <div style={{ position: 'relative', width: "120px", height: "120px", marginBottom: "1rem" }}>
                    <img 
                        src={avatarUrl || defaultAvatar} 
                        alt="Avatar" 
                        style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", border: `3px solid ${PRIMARY_COLOR}` }} 
                    />
                    <label style={{ position: 'absolute', bottom: 0, right: 0, background: PRIMARY_COLOR, width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '3px solid #1e1e1e' }}>
                        <Camera size={18} color="white" />
                        <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
                    </label>
                </div>
                
                <h2 style={{ margin: '0 0 5px 0', fontSize: '1.4rem' }}>{name || "Usuário"}</h2>
                <span style={{ color: '#888', fontSize: '0.9rem' }}>@{nickname || "nickname"}</span>
            </div>

            {/* Menu de Navegação Vertical (Abas) */}
            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button 
                    onClick={() => setActiveTab("personal")}
                    style={{ 
                        padding: '12px 16px', borderRadius: '8px', border: 'none', background: activeTab === 'personal' ? '#2d2d2d' : 'transparent', 
                        color: activeTab === 'personal' ? PRIMARY_COLOR : '#ccc', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px',
                        fontSize: '1rem', fontWeight: activeTab === 'personal' ? 'bold' : 'normal', transition: 'all 0.2s', textAlign: 'left'
                    }}
                >
                    <User size={20} /> Dados Pessoais
                </button>
                <button 
                    onClick={() => setActiveTab("security")}
                    style={{ 
                        padding: '12px 16px', borderRadius: '8px', border: 'none', background: activeTab === 'security' ? 'rgba(239, 68, 68, 0.1)' : 'transparent', 
                        color: activeTab === 'security' ? '#ef4444' : '#ccc', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px',
                        fontSize: '1rem', fontWeight: activeTab === 'security' ? 'bold' : 'normal', transition: 'all 0.2s', textAlign: 'left'
                    }}
                >
                    <Shield size={20} /> Segurança e Login
                </button>
            </div>
        </div>

        {/* --- COLUNA DA DIREITA --- */}
        <div style={{ flex: 2, minWidth: '300px' }}>
            <div style={{ background: "#1e1e1e", borderRadius: "12px", border: '1px solid #333', padding: "2rem", minHeight: '400px' }}>
                
                {/* --- ABA PESSOAL --- */}
                {activeTab === "personal" && (
                    <form onSubmit={handleSavePersonal} style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
                        <h2 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <User size={24} color={PRIMARY_COLOR} /> Editar Perfil
                        </h2>

                        <div style={inputContainerStyle}>
                            <label style={labelStyle}>Nome Completo</label>
                            <div style={{ position: 'relative' }}>
                                <User size={18} style={iconInputStyle} />
                                <input required value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} placeholder="Seu nome" />
                            </div>
                        </div>

                        <div style={inputContainerStyle}>
                            <label style={labelStyle}>Apelido (Nickname)</label>
                            <div style={{ position: 'relative' }}>
                                <span style={{ ...iconInputStyle, fontSize: '1.2rem', fontWeight: 'bold' }}>@</span>
                                <input value={nickname} onChange={(e) => setNickname(e.target.value)} style={inputStyle} placeholder="Como quer ser chamado" />
                            </div>
                        </div>

                        <button type="submit" disabled={loading} style={{ ...buttonStyle, background: PRIMARY_COLOR, marginTop: '1rem' }}>
                            {loading ? "Salvando..." : <><Save size={18} /> Salvar Alterações</>}
                        </button>
                    </form>
                )}

                {/* --- ABA DE SEGURANÇA --- */}
                {activeTab === "security" && (
                    <form onSubmit={handleSaveSecurity} style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
                        <h2 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px', color: '#ef4444' }}>
                            <Lock size={24} /> Segurança
                        </h2>

                        <div style={{ fontSize: "0.9rem", color: "#ffcccb", marginBottom: "1.5rem", padding: "12px", background: "rgba(239, 68, 68, 0.1)", borderRadius: "6px", border: "1px solid rgba(239, 68, 68, 0.2)", display: "flex", gap: "10px" }}>
                            <AlertTriangle size={20} style={{ flexShrink: 0 }} />
                            <span>Atenção: Ao alterar seu e-mail ou senha, você precisará fazer login novamente.</span>
                        </div>

                        <div style={inputContainerStyle}>
                            <label style={labelStyle}>E-mail de Acesso</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={18} style={iconInputStyle} />
                                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
                            </div>
                        </div>

                        <hr style={{ borderColor: "#333", margin: "1.5rem 0", opacity: 0.5 }} />

                        <div style={inputContainerStyle}>
                            <label style={labelStyle}>Nova Senha</label>
                            <div style={{ position: 'relative' }}>
                                <KeyRound size={18} style={iconInputStyle} />
                                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Deixe em branco para manter a atual" style={inputStyle} />
                            </div>
                        </div>

                        <div style={inputContainerStyle}>
                            <label style={labelStyle}>Confirmar Nova Senha</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={18} style={iconInputStyle} />
                                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repita a nova senha" style={inputStyle} />
                            </div>
                        </div>

                        <button type="submit" disabled={loading} style={{ ...buttonStyle, background: "#ef4444", marginTop: '1rem' }}>
                            {loading ? "Processando..." : "Atualizar Segurança"}
                        </button>
                    </form>
                )}

            </div>
        </div>

      </div>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}

// Estilos
const inputStyle = {
  width: "100%",
  padding: "12px 12px 12px 40px", // Espaço para o ícone
  borderRadius: "8px",
  border: "1px solid #444",
  backgroundColor: "#2a2a2a",
  color: "white",
  fontSize: "0.95rem",
  outline: "none",
  boxSizing: "border-box" as const,
  transition: 'border-color 0.2s'
};

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  fontSize: "0.9rem",
  color: "#ccc",
  fontWeight: 500
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  color: "white",
  border: "none",
  borderRadius: "8px",
  fontWeight: "bold",
  fontSize: "1rem",
  cursor: "pointer",
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
  transition: 'opacity 0.2s'
};