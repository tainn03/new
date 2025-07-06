import React, { useState } from 'react';

interface LoginFormData {
  email: string;
  password: string;
}

interface User {
  id: number;
  email: string;
  name: string;
}

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result: ApiResponse = await response.json();

      if (result.success && result.data) {
        setUser(result.data.user);
        setToken(result.data.token);
        localStorage.setItem('token', result.data.token);
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    setFormData({ email: '', password: '' });
  };

  const fetchProfile = async () => {
    if (!token) return;

    try {
      const response = await fetch('/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const result: ApiResponse = await response.json();

      if (result.success) {
        console.log('Profile data:', result.data);
      } else {
        setError(result.error || 'Failed to fetch profile');
      }
    } catch (err) {
      setError('Network error occurred');
    }
  };

  const fetchUsers = async () => {
    if (!token) return;

    try {
      const response = await fetch('/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const result: ApiResponse = await response.json();

      if (result.success) {
        console.log('Users data:', result.data);
      } else {
        setError(result.error || 'Failed to fetch users');
      }
    } catch (err) {
      setError('Network error occurred');
    }
  };

  if (user) {
    return (
      <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
        <h1>Welcome, {user.name}!</h1>
        <p>Email: {user.email}</p>
        <p>User ID: {user.id}</p>
        
        <div style={{ marginTop: '20px' }}>
          <button 
            onClick={fetchProfile}
            style={{ marginRight: '10px', padding: '10px 20px' }}
          >
            Fetch Profile
          </button>
          <button 
            onClick={fetchUsers}
            style={{ marginRight: '10px', padding: '10px 20px' }}
          >
            Fetch Users
          </button>
          <button 
            onClick={handleLogout}
            style={{ padding: '10px 20px', backgroundColor: '#dc3545', color: 'white' }}
          >
            Logout
          </button>
        </div>

        {error && (
          <div style={{ marginTop: '20px', color: 'red' }}>
            Error: {error}
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h1>Login</h1>
      
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column' }}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          required
          style={{ marginBottom: '10px', padding: '10px' }}
        />
        
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
          required
          style={{ marginBottom: '10px', padding: '10px' }}
        />
        
        <button 
          type="submit" 
          disabled={loading}
          style={{ padding: '10px', backgroundColor: '#007bff', color: 'white' }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      {error && (
        <div style={{ marginTop: '20px', color: 'red' }}>
          Error: {error}
        </div>
      )}

      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <p>Test credentials:</p>
        <p>Email: alice@example.com</p>
        <p>Password: password123</p>
        <small>Note: You'll need to register a user first using the register API endpoint.</small>
      </div>
    </div>
  );
};

export default LoginPage;
