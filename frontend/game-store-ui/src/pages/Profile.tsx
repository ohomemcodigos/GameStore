import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../api/user';
import { useNavigate } from 'react-router-dom';

export function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'personal' | 'security'>('personal');

  // --- ESTADOS DADOS PESSOAIS ---
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  // --- ESTADOS SEGURANÇA ---
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Carregar dados iniciais
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setNickname(user.nickname || '');
      setAvatarUrl(user.avatarUrl || '');
      setEmail(user.email || '');
    }
  }, [user]);

  // Upload de Imagem
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatarUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // --- SALVAR DADOS PESSOAIS (Sem senha) ---
  async function handleSavePersonal(e: FormEvent) {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
      // Envia APENAS dados visuais
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

  // --- SALVAR SEGURANÇA (Email e Senha) ---
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

    // Confirmação extra para segurança
    if (!confirm("Tem certeza que deseja alterar seus dados de acesso?")) return;

    setLoading(true);

    try {
      const payload: any = { email };
      if (newPassword) payload.password = newPassword;

      await userService.updateProfile(user.id, payload);
      
      alert("Dados de segurança atualizados! Por favor, faça login novamente.");
      // Aqui poderíamos deslogar o usuário por segurança
      // authService.logout(); 
      window.location.reload();

    } catch (error) {
      console.error(error);
      alert("Erro ao atualizar segurança.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: '2rem', minHeight: '100vh', backgroundColor: '#1a1a1a', color: 'white', display: 'flex', justifyContent: 'center' }}>
      <div style={{ maxWidth: '600px', width: '100%' }}>
        
        {/* Cabeçalho */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem', borderBottom: '1px solid #333', paddingBottom: '10px' }}>
            <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: '#aaa', cursor: 'pointer', fontSize: '1.2rem' }}>←</button>
            <h1>Meu Perfil</h1>
        </div>

        <div style={{ background: '#252525', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>
            
            {/* --- ABAS DE NAVEGAÇÃO --- */}
            <div style={{ display: 'flex', borderBottom: '1px solid #444' }}>
                <button 
                    onClick={() => setActiveTab('personal')}
                    style={{ ...tabStyle, background: activeTab === 'personal' ? '#333' : 'transparent', color: activeTab === 'personal' ? '#4ade80' : '#ccc', borderBottom: activeTab === 'personal' ? '2px solid #4ade80' : 'none' }}
                >
                    👤 Dados Pessoais
                </button>
                <button 
                    onClick={() => setActiveTab('security')}
                    style={{ ...tabStyle, background: activeTab === 'security' ? '#333' : 'transparent', color: activeTab === 'security' ? '#ff4757' : '#ccc', borderBottom: activeTab === 'security' ? '2px solid #ff4757' : 'none' }}
                >
                    🔒 Segurança
                </button>
            </div>

            <div style={{ padding: '2rem' }}>
                
                {/* === FORMULÁRIO 1: DADOS PESSOAIS === */}
                {activeTab === 'personal' && (
                    <form onSubmit={handleSavePersonal}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
                            <div style={{ 
                                width: '100px', height: '100px', borderRadius: '50%', overflow: 'hidden', 
                                border: '3px solid #4ade80', marginBottom: '10px', background: '#000'
                            }}>
                                <img src={avatarUrl || "https://placehold.co/150?text=User"} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <label style={{ background: '#444', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>
                                Alterar Foto
                                <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                            </label>
                        </div>

                        <div style={{ display: 'grid', gap: '1rem' }}>
                            <div>
                                <label style={labelStyle}>Nome Completo</label>
                                <input required value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
                            </div>
                            <div>
                                <label style={labelStyle}>Apelido</label>
                                <input value={nickname} onChange={e => setNickname(e.target.value)} placeholder="" style={inputStyle} />
                            </div>
                        </div>

                        <button type="submit" disabled={loading} style={buttonStyle}>
                            {loading ? 'Salvando...' : 'Salvar Perfil'}
                        </button>
                    </form>
                )}

                {/* === FORMULÁRIO 2: SEGURANÇA === */}
                {activeTab === 'security' && (
                    <form onSubmit={handleSaveSecurity}>
                        <p style={{ fontSize: '0.9rem', color: '#aaa', marginBottom: '1.5rem', padding: '10px', background: 'rgba(255,0,0,0.1)', borderRadius: '4px' }}>
                            ⚠️ Cuidado ao alterar estes dados. Você precisará usar o novo email/senha no próximo login.
                        </p>

                        <div style={{ display: 'grid', gap: '1rem' }}>
                            <div>
                                <label style={labelStyle}>E-mail de Acesso</label>
                                <input required type="email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
                            </div>

                            <hr style={{ borderColor: '#444', margin: '1rem 0', width: '100%' }} />

                            <div>
                                <label style={labelStyle}>Nova Senha</label>
                                <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Digite para alterar" style={inputStyle} />
                            </div>
                            <div>
                                <label style={labelStyle}>Confirmar Nova Senha</label>
                                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Repita a senha" style={inputStyle} />
                            </div>
                        </div>

                        <button type="submit" disabled={loading} style={{ ...buttonStyle, background: '#e74c3c' }}>
                            {loading ? 'Salvando...' : 'Atualizar Segurança'}
                        </button>
                    </form>
                )}

            </div>
        </div>
      </div>
    </div>
  );
}

// Estilos
const inputStyle = {
  width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #444', 
  backgroundColor: '#333', color: 'white', fontSize: '1rem', boxSizing: 'border-box' as const
};

const labelStyle = {
    display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#aaa'
};

const tabStyle = {
    flex: 1, padding: '15px', cursor: 'pointer', border: 'none', fontSize: '1rem', fontWeight: 'bold', transition: 'all 0.2s'
};

const buttonStyle = {
    marginTop: '2rem', width: '100%', padding: '12px', 
    background: '#4ade80', color: 'white', border: 'none', 
    borderRadius: '4px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer'
};