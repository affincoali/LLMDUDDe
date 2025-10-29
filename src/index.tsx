import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serveStatic } from 'hono/cloudflare-workers';
import type { Bindings } from './types';

// Import route handlers
import authRoutes from './routes/auth';
import agentRoutes from './routes/agents';
import categoryRoutes from './routes/categories';
import adminRoutes from './routes/admin';
import adminEnhancedRoutes from './routes/admin-enhanced';
import userRoutes from './routes/users';
import publicApiRoutes from './routes/public-api';
import leaderboardApiRoutes from './routes/leaderboard-api';
import landscapeApiRoutes from './routes/landscape-api';
import submitRoutes from './routes/submit';
import uploadRoutes from './routes/upload';
import reviewRoutes from './routes/reviews';
import savesRoutes from './routes/saves';
import { enhancedAdminDashboard, agentApprovalQueue } from './admin-ui';
import { 
  adminUsersPage, 
  adminAnalyticsPage, 
  adminAuditLogsPage, 
  adminCategoriesPage, 
  adminAllAgentsPage 
} from './admin-pages';
import { adminAgentCreatePage, adminAgentEditPage } from './admin-agent-forms';
import { adminComprehensiveEditPage } from './admin-comprehensive-form';
import { adminReviewsPage } from './admin-reviews';
import { enhancedHomepage } from './public-pages';
import { advancedAgentsListing, individualAgentPage } from './agents-pages';
import { enhancedAgentDetailPage } from './enhanced-agent-page';
import { redesignedAgentDetailPage } from './redesigned-agent-page';
import { modernAgentDetailPage } from './modern-agent-page';
import { enhancedCategoryDetailPage } from './enhanced-category-page';
import { categoriesPage, categoryDetailPage } from './categories-pages';
import { enhancedCategoriesPage, leaderboardPage, landscapePage } from './enhanced-pages';
import { loginPage, signupPage, forgotPasswordPage } from './auth-pages';
import { submitAgentForm } from './submit-form';
import { userDashboard } from './dashboard-page';
import { comprehensiveStatsPage } from './stats-page';

const app = new Hono<{ Bindings: Bindings }>();

// Enable CORS for API routes
app.use('/api/*', cors());

// Serve static files
app.use('/static/*', serveStatic({ root: './public' }));

// API Routes
app.route('/api/auth', authRoutes);
app.route('/api/agents', agentRoutes);
app.route('/api/categories', categoryRoutes);
app.route('/api/admin', adminRoutes);
app.route('/api/admin', adminEnhancedRoutes);
app.route('/api/users', userRoutes);
app.route('/api/public', publicApiRoutes);
app.route('/api/leaderboard', leaderboardApiRoutes);
app.route('/api/landscape', landscapeApiRoutes);
app.route('/api/submit', submitRoutes);
app.route('/api/upload', uploadRoutes);
app.route('/api/reviews', reviewRoutes);
app.route('/api/saves', savesRoutes);

// Tags endpoint for autocomplete
app.get('/api/tags', async (c) => {
  try {
    const { DB } = c.env;
    const tags = await DB.prepare(
      'SELECT id, name, slug FROM tags ORDER BY name ASC'
    ).all();
    
    return c.json({
      success: true,
      data: tags.results || []
    });
  } catch (error) {
    console.error('Error fetching tags:', error);
    return c.json({ success: false, error: 'Failed to fetch tags' }, 500);
  }
});

// Homepage - Enhanced
app.get('/', (c) => {
  return c.html(enhancedHomepage());
});

// Old Homepage (backup - keeping for reference)
app.get('/old', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>AI Agents Directory - Discover the Best AI Tools</title>
        <meta name="description" content="Browse, compare, and discover the best AI agents and tools. Comprehensive directory with reviews, ratings, and detailed information.">
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <style>
          .gradient-bg {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }
          .card-hover {
            transition: transform 0.3s, box-shadow 0.3s;
          }
          .card-hover:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.15);
          }
        </style>
    </head>
    <body class="bg-gray-50">
        <!-- Navigation -->
        <nav class="bg-white shadow-sm sticky top-0 z-50">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between h-16 items-center">
                    <div class="flex items-center">
                        <i class="fas fa-robot text-3xl text-purple-600 mr-3"></i>
                        <span class="text-xl font-bold text-gray-900">AI Agents Directory</span>
                    </div>
                    <div class="hidden md:flex items-center space-x-6">
                        <a href="/" class="text-gray-700 hover:text-purple-600">Home</a>
                        <a href="/agents" class="text-gray-700 hover:text-purple-600">Agents</a>
                        <a href="/categories" class="text-gray-700 hover:text-purple-600">Categories</a>
                        <a href="/submit" class="text-gray-700 hover:text-purple-600">Submit</a>
                        <button onclick="showLogin()" class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
                            Login
                        </button>
                    </div>
                </div>
            </div>
        </nav>

        <!-- Hero Section -->
        <div class="gradient-bg text-white py-20">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h1 class="text-5xl font-bold mb-6">
                    Discover the Best AI Agents
                </h1>
                <p class="text-xl mb-8 text-gray-100">
                    Browse, compare, and find the perfect AI tools for your needs
                </p>
                <div class="flex justify-center gap-4">
                    <button onclick="loadAgents()" class="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100">
                        Browse Agents
                    </button>
                    <a href="/submit" class="bg-purple-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-900">
                        Submit Your Agent
                    </a>
                </div>
            </div>
        </div>

        <!-- Stats Section -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
            <div class="bg-white rounded-xl shadow-lg p-8 grid grid-cols-1 md:grid-cols-4 gap-6">
                <div class="text-center">
                    <div class="text-4xl font-bold text-purple-600" id="total-agents">-</div>
                    <div class="text-gray-600 mt-2">AI Agents</div>
                </div>
                <div class="text-center">
                    <div class="text-4xl font-bold text-purple-600" id="total-categories">-</div>
                    <div class="text-gray-600 mt-2">Categories</div>
                </div>
                <div class="text-center">
                    <div class="text-4xl font-bold text-purple-600" id="total-reviews">-</div>
                    <div class="text-gray-600 mt-2">Reviews</div>
                </div>
                <div class="text-center">
                    <div class="text-4xl font-bold text-purple-600" id="total-upvotes">-</div>
                    <div class="text-gray-600 mt-2">Upvotes</div>
                </div>
            </div>
        </div>

        <!-- Featured Agents Section -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h2 class="text-3xl font-bold text-gray-900 mb-8">Featured AI Agents</h2>
            <div id="agents-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <!-- Agents will be loaded here -->
            </div>
            <div class="text-center mt-8">
                <button onclick="loadAgents()" class="text-purple-600 font-semibold hover:text-purple-700">
                    View All Agents →
                </button>
            </div>
        </div>

        <!-- Categories Section -->
        <div class="bg-white py-16">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 class="text-3xl font-bold text-gray-900 mb-8">Browse by Category</h2>
                <div id="categories-grid" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <!-- Categories will be loaded here -->
                </div>
            </div>
        </div>

        <!-- Login Modal -->
        <div id="login-modal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-xl p-8 max-w-md w-full mx-4">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-2xl font-bold">Login</h3>
                    <button onclick="hideLogin()" class="text-gray-400 hover:text-gray-600">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
                <form onsubmit="handleLogin(event)">
                    <div class="mb-4">
                        <label class="block text-gray-700 mb-2">Email</label>
                        <input type="email" id="login-email" required class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600">
                    </div>
                    <div class="mb-6">
                        <label class="block text-gray-700 mb-2">Password</label>
                        <input type="password" id="login-password" required class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600">
                    </div>
                    <button type="submit" class="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700">
                        Login
                    </button>
                </form>
                <div class="mt-4 text-center">
                    <p class="text-gray-600">Demo credentials:</p>
                    <p class="text-sm text-gray-500">Admin: admin@aiagents.directory / admin123</p>
                </div>
            </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script>
          const API_BASE = '/api';
          let authToken = localStorage.getItem('auth_token');

          // Load stats
          async function loadStats() {
            try {
              const response = await axios.get(API_BASE + '/agents/stats');
              if (response.data.success) {
                const stats = response.data.data;
                document.getElementById('total-agents').textContent = stats.total_agents || 0;
                document.getElementById('total-categories').textContent = stats.total_categories || 0;
                document.getElementById('total-reviews').textContent = stats.total_reviews || 0;
                document.getElementById('total-upvotes').textContent = stats.total_upvotes || 0;
              }
            } catch (error) {
              console.error('Error loading stats:', error);
            }
          }

          // Load featured agents
          async function loadFeaturedAgents() {
            try {
              const response = await axios.get(API_BASE + '/agents?limit=6&status=APPROVED');
              if (response.data.success) {
                const agents = response.data.data;
                const grid = document.getElementById('agents-grid');
                grid.innerHTML = agents.map(agent => \`
                  <div class="bg-white rounded-lg shadow-md overflow-hidden card-hover cursor-pointer" onclick="window.location='/agents/\${agent.slug}'">
                    <div class="h-48 bg-gradient-to-br from-purple-400 to-indigo-600 flex items-center justify-center">
                      <span class="text-6xl">\${agent.logo_url || '🤖'}</span>
                    </div>
                    <div class="p-6">
                      <h3 class="text-xl font-bold text-gray-900 mb-2">\${agent.name}</h3>
                      <p class="text-gray-600 text-sm mb-4 line-clamp-2">\${agent.tagline || ''}</p>
                      <div class="flex items-center justify-between">
                        <span class="text-sm text-gray-500">
                          <i class="fas fa-arrow-up text-purple-600"></i> \${agent.upvote_count}
                        </span>
                        <span class="text-sm text-gray-500">
                          <i class="fas fa-eye text-purple-600"></i> \${agent.view_count}
                        </span>
                        <span class="px-3 py-1 bg-purple-100 text-purple-600 text-xs font-semibold rounded-full">
                          \${agent.pricing_model}
                        </span>
                      </div>
                    </div>
                  </div>
                \`).join('');
              }
            } catch (error) {
              console.error('Error loading agents:', error);
            }
          }

          // Load categories
          async function loadCategories() {
            try {
              const response = await axios.get(API_BASE + '/categories');
              if (response.data.success) {
                const categories = response.data.data.slice(0, 6);
                const grid = document.getElementById('categories-grid');
                grid.innerHTML = categories.map(cat => \`
                  <a href="/categories/\${cat.slug}" class="bg-gray-100 rounded-lg p-6 text-center hover:bg-gray-200 transition">
                    <div class="text-4xl mb-2">\${cat.icon || '📁'}</div>
                    <div class="font-semibold text-gray-900">\${cat.name}</div>
                    <div class="text-sm text-gray-500 mt-1">\${cat.agent_count} agents</div>
                  </a>
                \`).join('');
              }
            } catch (error) {
              console.error('Error loading categories:', error);
            }
          }

          function showLogin() {
            document.getElementById('login-modal').classList.remove('hidden');
          }

          function hideLogin() {
            document.getElementById('login-modal').classList.add('hidden');
          }

          async function handleLogin(event) {
            event.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            try {
              const response = await axios.post(API_BASE + '/auth/login', { email, password });
              if (response.data.success) {
                authToken = response.data.data.token;
                localStorage.setItem('auth_token', authToken);
                alert('Login successful!');
                hideLogin();
                window.location.href = '/admin';
              }
            } catch (error) {
              alert('Login failed: ' + (error.response?.data?.error || 'Unknown error'));
            }
          }

          function loadAgents() {
            window.location.href = '/agents';
          }

          // Initialize
          document.addEventListener('DOMContentLoaded', () => {
            loadStats();
            loadFeaturedAgents();
            loadCategories();
          });
        </script>
    </body>
    </html>
  `);
});

// Agents listing page - Enhanced version
app.get('/agents', (c) => {
  return c.html(advancedAgentsListing());
});

// Agent detail page - Modern version matching aiagentsdirectory.com design
app.get('/agents/:slug', (c) => {
  const slug = c.req.param('slug');
  return c.html(modernAgentDetailPage(slug));
});

// Agent detail page - Enhanced version (kept for reference)
app.get('/agents-enhanced/:slug', (c) => {
  const slug = c.req.param('slug');
  return c.html(enhancedAgentDetailPage(slug));
});

// Agent detail page - Old version (kept for reference)
app.get('/agents-old/:slug', (c) => {
  const slug = c.req.param('slug');
  return c.html(individualAgentPage(slug));
});

// Categories page - KEEPING OLD FOR BACKWARD COMPATIBILITY
// Use /categories-old for simple version
app.get('/categories-old', (c) => {
  return c.html(categoriesPage());
});

// Categories page - Enhanced version with stats
app.get('/categories', (c) => {
  return c.html(enhancedCategoriesPage());
});

// Category detail page - Enhanced version
app.get('/categories/:slug', (c) => {
  const slug = c.req.param('slug');
  return c.html(enhancedCategoryDetailPage(slug));
});

// Category detail page - Old version (kept for reference)
app.get('/categories-old/:slug', (c) => {
  const slug = c.req.param('slug');
  return c.html(categoryDetailPage(slug));
});

// Leaderboard page
app.get('/leaderboard', (c) => {
  return c.html(leaderboardPage());
});

// Landscape page
app.get('/landscape', (c) => {
  return c.html(landscapePage());
});

// Authentication pages
app.get('/login', (c) => {
  return c.html(loginPage());
});

app.get('/signup', (c) => {
  return c.html(signupPage());
});

app.get('/forgot-password', (c) => {
  return c.html(forgotPasswordPage());
});

// Submit agent page - Multi-step form
app.get('/submit', (c) => {
  return c.html(submitAgentForm());
});

// User Dashboard (protected route)
app.get('/dashboard', (c) => {
  return c.html(userDashboard());
});

// Statistics Page (public)
app.get('/allstats', (c) => {
  return c.html(comprehensiveStatsPage());
});

// Admin pages
app.get('/admin', (c) => {
  return c.html(enhancedAdminDashboard());
});

app.get('/admin/agents-queue', (c) => {
  return c.html(agentApprovalQueue());
});

app.get('/admin/agents-all', (c) => {
  return c.html(adminAllAgentsPage());
});

app.get('/admin/reviews', (c) => {
  return c.html(adminReviewsPage());
});

app.get('/admin/agents/create', (c) => {
  return c.html(adminAgentCreatePage());
});

app.get('/admin/agents/:id/edit', (c) => {
  const agentId = c.req.param('id');
  return c.html(adminAgentEditPage(agentId));
});

// Comprehensive edit form with ALL fields
app.get('/admin/agents/:id/edit-full', (c) => {
  const agentId = c.req.param('id');
  return c.html(adminComprehensiveEditPage(agentId));
});

app.get('/admin/users', (c) => {
  return c.html(adminUsersPage());
});

app.get('/admin/analytics', (c) => {
  return c.html(adminAnalyticsPage());
});

app.get('/admin/audit-logs', (c) => {
  return c.html(adminAuditLogsPage());
});

app.get('/admin/categories', (c) => {
  return c.html(adminCategoriesPage());
});

// Legacy admin dashboard (old version, kept for backward compatibility)
app.get('/admin/legacy', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Admin Dashboard</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    </head>
    <body class="bg-gray-100">
        <div class="flex h-screen">
            <!-- Sidebar -->
            <div class="bg-gray-900 text-white w-64 flex-shrink-0">
                <div class="p-6">
                    <h2 class="text-2xl font-bold">Admin Panel</h2>
                </div>
                <nav class="mt-6">
                    <a href="/admin" class="block px-6 py-3 bg-purple-600">
                        <i class="fas fa-chart-line mr-2"></i> Dashboard
                    </a>
                    <a href="/admin/agents" class="block px-6 py-3 hover:bg-gray-800">
                        <i class="fas fa-robot mr-2"></i> Agents
                    </a>
                    <a href="/admin/categories" class="block px-6 py-3 hover:bg-gray-800">
                        <i class="fas fa-folder mr-2"></i> Categories
                    </a>
                    <a href="/admin/users" class="block px-6 py-3 hover:bg-gray-800">
                        <i class="fas fa-users mr-2"></i> Users
                    </a>
                    <a href="/" class="block px-6 py-3 hover:bg-gray-800">
                        <i class="fas fa-home mr-2"></i> Back to Site
                    </a>
                </nav>
            </div>

            <!-- Main Content -->
            <div class="flex-1 overflow-y-auto">
                <div class="p-8">
                    <h1 class="text-3xl font-bold mb-8">Dashboard</h1>
                    
                    <div id="stats-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <!-- Stats will be loaded here -->
                    </div>

                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div class="bg-white rounded-lg shadow p-6">
                            <h3 class="text-xl font-bold mb-4">Pending Submissions</h3>
                            <div id="pending-agents">Loading...</div>
                        </div>

                        <div class="bg-white rounded-lg shadow p-6">
                            <h3 class="text-xl font-bold mb-4">Recent Reviews</h3>
                            <div id="recent-reviews">Loading...</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script>
          const authToken = localStorage.getItem('auth_token');
          if (!authToken) {
            window.location.href = '/';
          }

          axios.defaults.headers.common['Authorization'] = 'Bearer ' + authToken;

          async function loadDashboard() {
            try {
              const response = await axios.get('/api/admin/stats');
              if (response.data.success) {
                const stats = response.data.data;
                document.getElementById('stats-grid').innerHTML = \`
                  <div class="bg-blue-50 rounded-lg p-6">
                    <div class="text-3xl font-bold text-blue-600">\${stats.total_agents}</div>
                    <div class="text-gray-600">Total Agents</div>
                  </div>
                  <div class="bg-yellow-50 rounded-lg p-6">
                    <div class="text-3xl font-bold text-yellow-600">\${stats.pending_agents}</div>
                    <div class="text-gray-600">Pending Review</div>
                  </div>
                  <div class="bg-green-50 rounded-lg p-6">
                    <div class="text-3xl font-bold text-green-600">\${stats.total_users}</div>
                    <div class="text-gray-600">Total Users</div>
                  </div>
                  <div class="bg-purple-50 rounded-lg p-6">
                    <div class="text-3xl font-bold text-purple-600">\${stats.total_reviews}</div>
                    <div class="text-gray-600">Total Reviews</div>
                  </div>
                \`;
              }
            } catch (error) {
              console.error('Error loading stats:', error);
              if (error.response?.status === 401 || error.response?.status === 403) {
                alert('Unauthorized access');
                window.location.href = '/';
              }
            }
          }

          async function loadPendingAgents() {
            try {
              const response = await axios.get('/api/admin/agents/pending');
              if (response.data.success) {
                const agents = response.data.data;
                const container = document.getElementById('pending-agents');
                
                if (agents.length === 0) {
                  container.innerHTML = '<p class="text-gray-500">No pending submissions</p>';
                } else {
                  container.innerHTML = agents.map(agent => \`
                    <div class="border-b py-3">
                      <a href="/admin/agents/\${agent.id}" class="font-semibold text-purple-600 hover:underline">
                        \${agent.name}
                      </a>
                      <p class="text-sm text-gray-600">\${agent.tagline || ''}</p>
                    </div>
                  \`).join('');
                }
              }
            } catch (error) {
              console.error('Error loading pending agents:', error);
            }
          }

          document.addEventListener('DOMContentLoaded', () => {
            loadDashboard();
            loadPendingAgents();
          });
        </script>
    </body>
    </html>
  `);
});

export default app;
