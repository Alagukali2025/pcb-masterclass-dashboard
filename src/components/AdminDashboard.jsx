import React, { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';
import { 
  Users, 
  Search, 
  UserPlus, 
  Clock, 
  Mail, 
  ShieldCheck, 
  Activity,
  ArrowRight,
  ExternalLink,
  Filter
} from 'lucide-react';
import { Navigate } from 'react-router-dom';

export default function AdminDashboard() {
  const { userData, isLoggedIn, loading: authLoading } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    recent: 0
  });

  useEffect(() => {
    if (userData?.isOwner) {
      fetchProfiles();
    }
  }, [userData]);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('last_login', { ascending: false });

      if (error) throw error;

      setProfiles(data);
      
      // Calculate Stats
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);
      
      setStats({
        total: data.length,
        recent: data.filter(p => new Date(p.last_login) > oneDayAgo).length
      });
    } catch (error) {
      console.error('Error fetching profiles:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredProfiles = profiles.filter(p => 
    p.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Security Guard: Check if user is owner
  if (authLoading) return <div className="admin-loading">Verifying Authorization...</div>;
  if (!isLoggedIn || !userData?.isOwner) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="admin-container fade-in">
      <div className="admin-header-section">
        <div className="admin-title-group">
          <div className="admin-badge">
            <ShieldCheck size={16} />
            <span>OWNER CONTROL PANEL</span>
          </div>
          <h1>Engineering Hub Management</h1>
          <p>Global monitor for registered PCB designers and engineers.</p>
        </div>
        
        <div className="admin-stats-grid">
          <div className="stat-card glass-morphism">
            <div className="stat-icon-box users">
              <Users size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-label">TOTAL ENGINEERS</span>
              <span className="stat-value">{stats.total}</span>
            </div>
          </div>
          
          <div className="stat-card glass-morphism">
            <div className="stat-icon-box activity">
              <Activity size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-label">ACTIVE (24H)</span>
              <span className="stat-value">{stats.recent}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="admin-controls-bar glass-morphism">
        <div className="search-box-admin">
          <Search size={18} className="search-icon-admin" />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="admin-action-btn secondary" onClick={fetchProfiles}>
          <Clock size={16} />
          <span>Refresh Data</span>
        </button>
      </div>

      <div className="admin-table-wrapper glass-morphism">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ENGINEER</th>
              <th>CONTACT / ID</th>
              <th>LAST ACTIVE</th>
              <th>JOINED ON</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="table-loader">Syncing with secure vault...</td>
              </tr>
            ) : filteredProfiles.length === 0 ? (
              <tr>
                <td colSpan="5" className="table-empty">No engineers found matching your search.</td>
              </tr>
            ) : (
              filteredProfiles.map((profile) => (
                <tr key={profile.id} className="admin-row">
                  <td>
                    <div className="admin-user-cell">
                      <div className="admin-avatar-small">
                        {profile.avatar_url ? (
                          <img src={profile.avatar_url} alt="" />
                        ) : (
                          profile.full_name?.substring(0, 2).toUpperCase() || '??'
                        )}
                      </div>
                      <div className="admin-user-info">
                        <span className="admin-user-name">{profile.full_name || 'Anonymous User'}</span>
                        <span className="admin-user-sub">{profile.industry || 'General Engineering'}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="admin-id-cell">
                      <span className="admin-email"><Mail size={12} /> {profile.email}</span>
                      <span className="admin-uuid">{profile.id.substring(0, 13)}...</span>
                    </div>
                  </td>
                  <td>
                    <span className="admin-date">
                      {new Date(profile.last_login).toLocaleDateString()} 
                      <small>{new Date(profile.last_login).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</small>
                    </span>
                  </td>
                  <td>
                    <span className="admin-date-muted">
                      {new Date(profile.created_at).toLocaleDateString()}
                    </span>
                  </td>
                  <td>
                    <span className="status-pill active">Verified</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
