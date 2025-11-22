// Authentication Pages - Login, Signup, Forgot Password, User Dashboard
import { getHeader } from './components/header';

export const loginPage = () => `
<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - AI Agents Directory</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <style>
      :root {
        --bg-primary: #ffffff;
        --bg-secondary: #f9fafb;
        --text-primary: #111827;
        --text-secondary: #6b7280;
        --border-color: #e5e7eb;
        --card-bg: #ffffff;
      }
      
      [data-theme="dark"] {
        --bg-primary: #1f2937;
        --bg-secondary: #111827;
        --text-primary: #f9fafb;
        --text-secondary: #9ca3af;
        --border-color: #374151;
        --card-bg: #374151;
      }
      
      * {
        transition: background-color 0.3s ease, color 0.3s ease;
      }
      
      body {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: var(--text-primary);
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .auth-card {
        background-color: var(--card-bg);
        border-color: var(--border-color);
      }
      
      .btn-primary {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        transition: transform 0.2s;
      }
      
      .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
      }
      
      .toast {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        animation: slideIn 0.3s ease;
      }
      
      @keyframes slideIn {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      
      .toast.success { background-color: #10b981; }
      .toast.error { background-color: #ef4444; }
    </style>
</head>
<body>
    <div class="w-full max-w-md mx-4">
        <!-- Logo & Title -->
        <div class="text-center mb-8">
            <a href="/" class="inline-flex items-center justify-center gap-3 mb-6">
                <i class="fas fa-robot text-5xl text-white"></i>
                <span class="text-3xl font-bold text-white">AI Agents</span>
            </a>
            <h1 class="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p class="text-white/80">Sign in to manage your AI agents</p>
        </div>
        
        <!-- Login Card -->
        <div class="auth-card rounded-2xl shadow-2xl p-8">
            <form id="login-form" class="space-y-6">
                <!-- Email -->
                <div>
                    <label class="block text-sm font-medium mb-2">Email Address</label>
                    <input 
                        type="email" 
                        id="email" 
                        required 
                        class="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                        style="background-color: var(--bg-secondary); color: var(--text-primary); border-color: var(--border-color)"
                        placeholder="you@example.com"
                    />
                    <span id="email-error" class="text-red-500 text-sm hidden"></span>
                </div>
                
                <!-- Password -->
                <div>
                    <label class="block text-sm font-medium mb-2">Password</label>
                    <div class="relative">
                        <input 
                            type="password" 
                            id="password" 
                            required 
                            class="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                            style="background-color: var(--bg-secondary); color: var(--text-primary); border-color: var(--border-color)"
                            placeholder="Enter your password"
                        />
                        <button type="button" onclick="togglePassword()" class="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                            <i id="password-icon" class="fas fa-eye"></i>
                        </button>
                    </div>
                    <span id="password-error" class="text-red-500 text-sm hidden"></span>
                </div>
                
                <!-- Remember Me & Forgot Password -->
                <div class="flex items-center justify-between">
                    <label class="flex items-center">
                        <input type="checkbox" id="remember" class="rounded border-gray-300 text-blue-700 focus:ring-blue-700">
                        <span class="ml-2 text-sm" style="color: var(--text-secondary)">Remember me</span>
                    </label>
                    <a href="/forgot-password" class="text-sm text-blue-700 hover:text-blue-800 font-medium">
                        Forgot password?
                    </a>
                </div>
                
                <!-- Submit Button -->
                <button 
                    type="submit" 
                    id="submit-btn"
                    class="w-full btn-primary text-white py-3 rounded-lg font-semibold"
                >
                    <span id="btn-text">Sign In</span>
                    <i id="btn-loader" class="fas fa-spinner fa-spin hidden ml-2"></i>
                </button>
            </form>
            
            <!-- Divider -->
            <div class="relative my-6">
                <div class="absolute inset-0 flex items-center">
                    <div class="w-full border-t" style="border-color: var(--border-color)"></div>
                </div>
                <div class="relative flex justify-center text-sm">
                    <span class="px-4" style="background-color: var(--card-bg); color: var(--text-secondary)">Or continue with</span>
                </div>
            </div>
            
            <!-- OAuth Buttons -->
            <button 
                onclick="loginWithGoogle()" 
                class="w-full flex items-center justify-center gap-3 px-4 py-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                style="border-color: var(--border-color)"
            >
                <svg class="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Sign in with Google</span>
            </button>
            
            <!-- Sign Up Link -->
            <p class="mt-6 text-center text-sm" style="color: var(--text-secondary)">
                Don't have an account? 
                <a href="/signup" class="text-blue-700 hover:text-blue-800 font-semibold">Sign up</a>
            </p>
        </div>
        
        <!-- Demo Credentials -->
        <div class="mt-6 text-center text-sm text-white/80">
            <p class="mb-2">Demo Accounts:</p>
            <p>Admin: admin@aiagents.directory / admin123</p>
            <p>User: user@example.com / user123</p>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
    <script>
      const API_BASE = '/api';
      
      function togglePassword() {
        const input = document.getElementById('password');
        const icon = document.getElementById('password-icon');
        
        if (input.type === 'password') {
          input.type = 'text';
          icon.className = 'fas fa-eye-slash';
        } else {
          input.type = 'password';
          icon.className = 'fas fa-eye';
        }
      }
      
      function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = \`toast \${type}\`;
        toast.innerHTML = \`
          <i class="fas \${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} mr-2"></i>
          \${message}
        \`;
        document.body.appendChild(toast);
        
        setTimeout(() => toast.remove(), 3000);
      }
      
      function loginWithGoogle() {
        showToast('Google OAuth integration coming soon!', 'info');
        // TODO: Implement Google OAuth via NextAuth or similar
      }
      
      document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const remember = document.getElementById('remember').checked;
        
        // Clear errors
        document.getElementById('email-error').classList.add('hidden');
        document.getElementById('password-error').classList.add('hidden');
        
        // Show loading
        const submitBtn = document.getElementById('submit-btn');
        const btnText = document.getElementById('btn-text');
        const btnLoader = document.getElementById('btn-loader');
        
        submitBtn.disabled = true;
        btnText.textContent = 'Signing in...';
        btnLoader.classList.remove('hidden');
        
        try {
          const response = await axios.post(\`\${API_BASE}/auth/login\`, {
            email,
            password
          });
          
          if (response.data.success) {
            // Store token
            localStorage.setItem('auth_token', response.data.data.token);
            if (remember) {
              localStorage.setItem('remember_me', 'true');
            }
            
            showToast('Login successful! Redirecting...', 'success');
            
            // Redirect based on role
            setTimeout(() => {
              const role = response.data.data.user.role;
              window.location.href = role === 'ADMIN' ? '/admin' : '/dashboard';
            }, 1000);
          }
        } catch (error) {
          console.error('Login error:', error);
          
          const errorMsg = error.response?.data?.error || 'Login failed. Please try again.';
          showToast(errorMsg, 'error');
          
          if (errorMsg.includes('email')) {
            document.getElementById('email-error').textContent = errorMsg;
            document.getElementById('email-error').classList.remove('hidden');
          } else if (errorMsg.includes('password')) {
            document.getElementById('password-error').textContent = errorMsg;
            document.getElementById('password-error').classList.remove('hidden');
          }
        } finally {
          submitBtn.disabled = false;
          btnText.textContent = 'Sign In';
          btnLoader.classList.add('hidden');
        }
      });
    </script>
    
    <!-- Minimal Footer -->
    <div style="position: fixed; bottom: 0; left: 0; right: 0; text-align: center; padding: 16px; color: rgba(255,255,255,0.7); font-size: 13px; background: rgba(0,0,0,0.1);">
        <p>&copy; 2025 AI Agents Directory. All rights reserved.</p>
    </div>
</body>
</html>
`;

export const signupPage = () => `
<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign Up - AI Agents Directory</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <style>
      :root {
        --bg-primary: #ffffff;
        --bg-secondary: #f9fafb;
        --text-primary: #111827;
        --text-secondary: #6b7280;
        --border-color: #e5e7eb;
        --card-bg: #ffffff;
      }
      
      [data-theme="dark"] {
        --bg-primary: #1f2937;
        --bg-secondary: #111827;
        --text-primary: #f9fafb;
        --text-secondary: #9ca3af;
        --border-color: #374151;
        --card-bg: #374151;
      }
      
      * {
        transition: background-color 0.3s ease, color 0.3s ease;
      }
      
      body {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: var(--text-primary);
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 40px 0;
      }
      
      .auth-card {
        background-color: var(--card-bg);
        border-color: var(--border-color);
      }
      
      .btn-primary {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        transition: transform 0.2s;
      }
      
      .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
      }
      
      .password-strength {
        height: 4px;
        border-radius: 2px;
        transition: all 0.3s;
      }
      
      .strength-weak { background-color: #ef4444; width: 33%; }
      .strength-medium { background-color: #f59e0b; width: 66%; }
      .strength-strong { background-color: #10b981; width: 100%; }
      
      .toast {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        animation: slideIn 0.3s ease;
      }
      
      @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      
      .toast.success { background-color: #10b981; }
      .toast.error { background-color: #ef4444; }
    </style>
</head>
<body>
    <div class="w-full max-w-md mx-4">
        <!-- Logo & Title -->
        <div class="text-center mb-8">
            <a href="/" class="inline-flex items-center justify-center gap-3 mb-6">
                <i class="fas fa-robot text-5xl text-white"></i>
                <span class="text-3xl font-bold text-white">AI Agents</span>
            </a>
            <h1 class="text-3xl font-bold text-white mb-2">Create Account</h1>
            <p class="text-white/80">Join the AI Agents community</p>
        </div>
        
        <!-- Signup Card -->
        <div class="auth-card rounded-2xl shadow-2xl p-8">
            <form id="signup-form" class="space-y-5">
                <!-- Name -->
                <div>
                    <label class="block text-sm font-medium mb-2">Full Name</label>
                    <input 
                        type="text" 
                        id="name" 
                        required 
                        minlength="2"
                        class="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                        style="background-color: var(--bg-secondary); color: var(--text-primary); border-color: var(--border-color)"
                        placeholder="John Doe"
                    />
                    <span id="name-error" class="text-red-500 text-sm hidden"></span>
                </div>
                
                <!-- Email -->
                <div>
                    <label class="block text-sm font-medium mb-2">Email Address</label>
                    <input 
                        type="email" 
                        id="email" 
                        required 
                        class="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                        style="background-color: var(--bg-secondary); color: var(--text-primary); border-color: var(--border-color)"
                        placeholder="you@example.com"
                    />
                    <span id="email-error" class="text-red-500 text-sm hidden"></span>
                </div>
                
                <!-- Password -->
                <div>
                    <label class="block text-sm font-medium mb-2">Password</label>
                    <div class="relative">
                        <input 
                            type="password" 
                            id="password" 
                            required 
                            minlength="8"
                            class="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                            style="background-color: var(--bg-secondary); color: var(--text-primary); border-color: var(--border-color)"
                            placeholder="Min 8 characters"
                            oninput="checkPasswordStrength()"
                        />
                        <button type="button" onclick="togglePassword('password')" class="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                            <i id="password-icon" class="fas fa-eye"></i>
                        </button>
                    </div>
                    <div class="mt-2">
                        <div class="password-strength" id="password-strength"></div>
                        <p id="password-strength-text" class="text-xs mt-1" style="color: var(--text-secondary)">
                            Password strength: <span id="strength-label">-</span>
                        </p>
                    </div>
                    <span id="password-error" class="text-red-500 text-sm hidden"></span>
                </div>
                
                <!-- Confirm Password -->
                <div>
                    <label class="block text-sm font-medium mb-2">Confirm Password</label>
                    <div class="relative">
                        <input 
                            type="password" 
                            id="confirm-password" 
                            required 
                            class="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                            style="background-color: var(--bg-secondary); color: var(--text-primary); border-color: var(--border-color)"
                            placeholder="Re-enter password"
                        />
                        <button type="button" onclick="togglePassword('confirm-password')" class="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                            <i id="confirm-password-icon" class="fas fa-eye"></i>
                        </button>
                    </div>
                    <span id="confirm-password-error" class="text-red-500 text-sm hidden"></span>
                </div>
                
                <!-- Terms Acceptance -->
                <div>
                    <label class="flex items-start">
                        <input type="checkbox" id="terms" required class="mt-1 rounded border-gray-300 text-blue-700 focus:ring-blue-700">
                        <span class="ml-2 text-sm" style="color: var(--text-secondary)">
                            I agree to the <a href="/terms" class="text-blue-700 hover:text-blue-800 font-medium">Terms of Service</a> 
                            and <a href="/privacy" class="text-blue-700 hover:text-blue-800 font-medium">Privacy Policy</a>
                        </span>
                    </label>
                    <span id="terms-error" class="text-red-500 text-sm hidden"></span>
                </div>
                
                <!-- Submit Button -->
                <button 
                    type="submit" 
                    id="submit-btn"
                    class="w-full btn-primary text-white py-3 rounded-lg font-semibold"
                >
                    <span id="btn-text">Create Account</span>
                    <i id="btn-loader" class="fas fa-spinner fa-spin hidden ml-2"></i>
                </button>
            </form>
            
            <!-- Divider -->
            <div class="relative my-6">
                <div class="absolute inset-0 flex items-center">
                    <div class="w-full border-t" style="border-color: var(--border-color)"></div>
                </div>
                <div class="relative flex justify-center text-sm">
                    <span class="px-4" style="background-color: var(--card-bg); color: var(--text-secondary)">Or continue with</span>
                </div>
            </div>
            
            <!-- OAuth Buttons -->
            <button 
                onclick="signupWithGoogle()" 
                class="w-full flex items-center justify-center gap-3 px-4 py-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                style="border-color: var(--border-color)"
            >
                <svg class="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Sign up with Google</span>
            </button>
            
            <!-- Login Link -->
            <p class="mt-6 text-center text-sm" style="color: var(--text-secondary)">
                Already have an account? 
                <a href="/login" class="text-blue-700 hover:text-blue-800 font-semibold">Sign in</a>
            </p>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
    <script>
      const API_BASE = '/api';
      
      function togglePassword(inputId) {
        const input = document.getElementById(inputId);
        const icon = document.getElementById(inputId + '-icon');
        
        if (input.type === 'password') {
          input.type = 'text';
          icon.className = 'fas fa-eye-slash';
        } else {
          input.type = 'password';
          icon.className = 'fas fa-eye';
        }
      }
      
      function checkPasswordStrength() {
        const password = document.getElementById('password').value;
        const strengthBar = document.getElementById('password-strength');
        const strengthLabel = document.getElementById('strength-label');
        
        let strength = 0;
        if (password.length >= 8) strength++;
        if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
        if (password.match(/[0-9]/)) strength++;
        if (password.match(/[^a-zA-Z0-9]/)) strength++;
        
        strengthBar.className = 'password-strength';
        
        if (strength <= 1) {
          strengthBar.classList.add('strength-weak');
          strengthLabel.textContent = 'Weak';
          strengthLabel.style.color = '#ef4444';
        } else if (strength <= 3) {
          strengthBar.classList.add('strength-medium');
          strengthLabel.textContent = 'Medium';
          strengthLabel.style.color = '#f59e0b';
        } else {
          strengthBar.classList.add('strength-strong');
          strengthLabel.textContent = 'Strong';
          strengthLabel.style.color = '#10b981';
        }
      }
      
      function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = \`toast \${type}\`;
        toast.innerHTML = \`
          <i class="fas \${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} mr-2"></i>
          \${message}
        \`;
        document.body.appendChild(toast);
        
        setTimeout(() => toast.remove(), 3000);
      }
      
      function signupWithGoogle() {
        showToast('Google OAuth integration coming soon!', 'info');
      }
      
      document.getElementById('signup-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const terms = document.getElementById('terms').checked;
        
        // Clear errors
        ['name', 'email', 'password', 'confirm-password', 'terms'].forEach(id => {
          document.getElementById(id + '-error').classList.add('hidden');
        });
        
        // Validate password match
        if (password !== confirmPassword) {
          document.getElementById('confirm-password-error').textContent = 'Passwords do not match';
          document.getElementById('confirm-password-error').classList.remove('hidden');
          return;
        }
        
        // Validate terms
        if (!terms) {
          document.getElementById('terms-error').textContent = 'You must accept the terms';
          document.getElementById('terms-error').classList.remove('hidden');
          return;
        }
        
        // Show loading
        const submitBtn = document.getElementById('submit-btn');
        const btnText = document.getElementById('btn-text');
        const btnLoader = document.getElementById('btn-loader');
        
        submitBtn.disabled = true;
        btnText.textContent = 'Creating account...';
        btnLoader.classList.remove('hidden');
        
        try {
          const response = await axios.post(\`\${API_BASE}/auth/register\`, {
            name,
            email,
            password
          });
          
          if (response.data.success) {
            showToast('Account created successfully! Please log in.', 'success');
            
            setTimeout(() => {
              window.location.href = '/login';
            }, 1500);
          }
        } catch (error) {
          console.error('Signup error:', error);
          
          const errorMsg = error.response?.data?.error || 'Signup failed. Please try again.';
          showToast(errorMsg, 'error');
          
          if (errorMsg.includes('email')) {
            document.getElementById('email-error').textContent = errorMsg;
            document.getElementById('email-error').classList.remove('hidden');
          }
        } finally {
          submitBtn.disabled = false;
          btnText.textContent = 'Create Account';
          btnLoader.classList.add('hidden');
        }
      });
    </script>
    
    <!-- Minimal Footer -->
    <div style="position: fixed; bottom: 0; left: 0; right: 0; text-align: center; padding: 16px; color: rgba(255,255,255,0.7); font-size: 13px; background: rgba(0,0,0,0.1);">
        <p>&copy; 2025 AI Agents Directory. All rights reserved.</p>
    </div>
</body>
</html>
`;

export const forgotPasswordPage = () => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Forgot Password - AI Agents Directory</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <style>
      body {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .btn-primary {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }
    </style>
</head>
<body>
    <div class="w-full max-w-md mx-4">
        <div class="text-center mb-8">
            <a href="/" class="inline-flex items-center justify-center gap-3 mb-6">
                <i class="fas fa-robot text-5xl text-white"></i>
                <span class="text-3xl font-bold text-white">AI Agents</span>
            </a>
            <h1 class="text-3xl font-bold text-white mb-2">Forgot Password?</h1>
            <p class="text-white/80">Enter your email to reset your password</p>
        </div>
        
        <div class="bg-white rounded-2xl shadow-2xl p-8">
            <div id="form-container">
                <form id="forgot-form" class="space-y-6">
                    <div>
                        <label class="block text-sm font-medium mb-2 text-gray-700">Email Address</label>
                        <input 
                            type="email" 
                            id="email" 
                            required 
                            class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                            placeholder="you@example.com"
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        id="submit-btn"
                        class="w-full btn-primary text-white py-3 rounded-lg font-semibold hover:opacity-90"
                    >
                        Send Reset Link
                    </button>
                </form>
            </div>
            
            <div id="success-message" class="hidden text-center">
                <i class="fas fa-check-circle text-6xl text-green-500 mb-4"></i>
                <h3 class="text-xl font-bold mb-2">Check Your Email</h3>
                <p class="text-gray-600 mb-6">
                    We've sent a password reset link to <strong id="email-sent"></strong>
                </p>
                <p class="text-sm text-gray-500">
                    Didn't receive the email? Check your spam folder or <a href="#" onclick="resetForm()" class="text-blue-700 hover:text-blue-800 font-medium">try again</a>.
                </p>
            </div>
            
            <p class="mt-6 text-center text-sm text-gray-600">
                Remember your password? 
                <a href="/login" class="text-blue-700 hover:text-blue-800 font-semibold">Sign in</a>
            </p>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
    <script>
      const API_BASE = '/api';
      
      document.getElementById('forgot-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const submitBtn = document.getElementById('submit-btn');
        
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        
        try {
          const response = await axios.post(\`\${API_BASE}/auth/forgot-password\`, { email });
          
          if (response.data.success) {
            document.getElementById('form-container').classList.add('hidden');
            document.getElementById('success-message').classList.remove('hidden');
            document.getElementById('email-sent').textContent = email;
          }
        } catch (error) {
          alert(error.response?.data?.error || 'Failed to send reset link');
        } finally {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Reset Link';
        }
      });
      
      function resetForm() {
        document.getElementById('form-container').classList.remove('hidden');
        document.getElementById('success-message').classList.add('hidden');
        document.getElementById('email').value = '';
      }
    </script>
    
    <!-- Minimal Footer -->
    <div style="position: fixed; bottom: 0; left: 0; right: 0; text-align: center; padding: 16px; color: rgba(255,255,255,0.7); font-size: 13px; background: rgba(0,0,0,0.1);">
        <p>&copy; 2025 AI Agents Directory. All rights reserved.</p>
    </div>
</body>
</html>
`;
