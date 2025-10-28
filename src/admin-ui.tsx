// Enhanced Admin UI Pages
// This file contains all admin panel HTML pages with improved functionality

export const enhancedAdminDashboard = () => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - AI Agents Directory</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
    <style>
        .stat-card {
            transition: transform 0.2s;
        }
        .stat-card:hover {
            transform: translateY(-2px);
        }
    </style>
</head>
<body class="bg-gray-100">
    <div class="flex h-screen">
        <!-- Sidebar -->
        <div class="bg-gray-900 text-white w-64 flex-shrink-0 overflow-y-auto">
            <div class="p-6">
                <h2 class="text-2xl font-bold flex items-center">
                    <i class="fas fa-shield-alt mr-2"></i>
                    Admin Panel
                </h2>
            </div>
            <nav class="mt-6">
                <a href="/admin" class="block px-6 py-3 bg-purple-600 border-l-4 border-purple-400">
                    <i class="fas fa-chart-line mr-2"></i> Dashboard
                </a>
                <a href="/admin/agents-queue" class="block px-6 py-3 hover:bg-gray-800">
                    <i class="fas fa-clock mr-2"></i> Approval Queue
                    <span id="pending-badge" class="ml-2 px-2 py-1 text-xs bg-red-500 rounded-full">0</span>
                </a>
                <a href="/admin/agents-all" class="block px-6 py-3 hover:bg-gray-800">
                    <i class="fas fa-robot mr-2"></i> All Agents
                </a>
                <a href="/admin/categories" class="block px-6 py-3 hover:bg-gray-800">
                    <i class="fas fa-folder mr-2"></i> Categories
                </a>
                <a href="/admin/users" class="block px-6 py-3 hover:bg-gray-800">
                    <i class="fas fa-users mr-2"></i> Users
                </a>
                <a href="/admin/analytics" class="block px-6 py-3 hover:bg-gray-800">
                    <i class="fas fa-chart-bar mr-2"></i> Analytics
                </a>
                <a href="/admin/audit-logs" class="block px-6 py-3 hover:bg-gray-800">
                    <i class="fas fa-history mr-2"></i> Audit Logs
                </a>
                <hr class="my-4 border-gray-700">
                <a href="/" class="block px-6 py-3 hover:bg-gray-800">
                    <i class="fas fa-home mr-2"></i> Back to Site
                </a>
                <a href="#" onclick="logout()" class="block px-6 py-3 hover:bg-gray-800 text-red-400">
                    <i class="fas fa-sign-out-alt mr-2"></i> Logout
                </a>
            </nav>
        </div>

        <!-- Main Content -->
        <div class="flex-1 overflow-y-auto">
            <div class="p-8">
                <!-- Header -->
                <div class="flex justify-between items-center mb-8">
                    <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <div class="flex items-center space-x-4">
                        <span class="text-sm text-gray-600" id="last-updated">Last updated: Loading...</span>
                        <button onclick="refreshDashboard()" class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                            <i class="fas fa-sync mr-2"></i>Refresh
                        </button>
                    </div>
                </div>

                <!-- Key Metrics Grid -->
                <div id="metrics-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <!-- Loading skeleton -->
                    <div class="bg-white rounded-lg shadow p-6 animate-pulse">
                        <div class="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                        <div class="h-8 bg-gray-200 rounded w-1/2"></div>
                    </div>
                </div>

                <!-- Charts Row -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <!-- Agent Status Distribution -->
                    <div class="bg-white rounded-lg shadow p-6">
                        <h3 class="text-lg font-semibold mb-4">Agent Status Distribution</h3>
                        <canvas id="status-chart"></canvas>
                    </div>

                    <!-- Category Distribution -->
                    <div class="bg-white rounded-lg shadow p-6">
                        <h3 class="text-lg font-semibold mb-4">Top Categories</h3>
                        <canvas id="category-chart"></canvas>
                    </div>
                </div>

                <!-- Recent Activity -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <!-- Recent Submissions -->
                    <div class="bg-white rounded-lg shadow">
                        <div class="p-6 border-b">
                            <h3 class="text-lg font-semibold">Recent Submissions</h3>
                        </div>
                        <div id="recent-submissions" class="divide-y max-h-96 overflow-y-auto">
                            <!-- Loading -->
                        </div>
                    </div>

                    <!-- Top Categories -->
                    <div class="bg-white rounded-lg shadow">
                        <div class="p-6 border-b">
                            <h3 class="text-lg font-semibold">Top Performing Categories</h3>
                        </div>
                        <div id="top-categories" class="divide-y max-h-96 overflow-y-auto">
                            <!-- Loading -->
                        </div>
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

        let statusChart, categoryChart;

        async function loadDashboard() {
            try {
                const response = await axios.get('/api/admin/dashboard');
                if (response.data.success) {
                    const { metrics, recent_submissions, top_categories } = response.data.data;
                    
                    // Update metrics cards
                    renderMetrics(metrics);
                    
                    // Update pending badge
                    document.getElementById('pending-badge').textContent = metrics.pending_agents;
                    
                    // Render charts
                    renderStatusChart(metrics);
                    renderCategoryChart(top_categories);
                    
                    // Render recent submissions
                    renderRecentSubmissions(recent_submissions);
                    
                    // Render top categories
                    renderTopCategories(top_categories);
                    
                    // Update timestamp
                    document.getElementById('last-updated').textContent = 
                        'Last updated: ' + new Date().toLocaleTimeString();
                }
            } catch (error) {
                console.error('Error loading dashboard:', error);
                if (error.response?.status === 401 || error.response?.status === 403) {
                    alert('Session expired or unauthorized. Please login again.');
                    localStorage.removeItem('auth_token');
                    window.location.href = '/';
                }
            }
        }

        function renderMetrics(metrics) {
            const grid = document.getElementById('metrics-grid');
            grid.innerHTML = \`
                <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white stat-card">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-sm font-medium opacity-90">Total Agents</h3>
                        <i class="fas fa-robot text-2xl opacity-75"></i>
                    </div>
                    <div class="text-3xl font-bold">\${metrics.total_agents}</div>
                    <div class="mt-2 text-sm opacity-90">
                        <span class="text-green-200">+\${metrics.agents_growth_30d}</span> last 30 days
                    </div>
                </div>

                <div class="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg shadow-lg p-6 text-white stat-card">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-sm font-medium opacity-90">Pending Review</h3>
                        <i class="fas fa-clock text-2xl opacity-75"></i>
                    </div>
                    <div class="text-3xl font-bold">\${metrics.pending_agents}</div>
                    <div class="mt-2 text-sm opacity-90">
                        Awaiting approval
                    </div>
                </div>

                <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white stat-card">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-sm font-medium opacity-90">Total Views</h3>
                        <i class="fas fa-eye text-2xl opacity-75"></i>
                    </div>
                    <div class="text-3xl font-bold">\${metrics.total_views.toLocaleString()}</div>
                    <div class="mt-2 text-sm opacity-90">
                        \${metrics.total_clicks.toLocaleString()} clicks
                    </div>
                </div>

                <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white stat-card">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-sm font-medium opacity-90">Community</h3>
                        <i class="fas fa-users text-2xl opacity-75"></i>
                    </div>
                    <div class="text-3xl font-bold">\${metrics.total_users}</div>
                    <div class="mt-2 text-sm opacity-90">
                        \${metrics.total_upvotes} upvotes, \${metrics.total_reviews} reviews
                    </div>
                </div>

                <div class="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg shadow-lg p-6 text-white stat-card">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-sm font-medium opacity-90">Approved</h3>
                        <i class="fas fa-check-circle text-2xl opacity-75"></i>
                    </div>
                    <div class="text-3xl font-bold">\${metrics.approved_agents}</div>
                    <div class="mt-2 text-sm opacity-90">
                        Live on platform
                    </div>
                </div>

                <div class="bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-lg p-6 text-white stat-card">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-sm font-medium opacity-90">Rejected</h3>
                        <i class="fas fa-times-circle text-2xl opacity-75"></i>
                    </div>
                    <div class="text-3xl font-bold">\${metrics.rejected_agents}</div>
                    <div class="mt-2 text-sm opacity-90">
                        Did not meet criteria
                    </div>
                </div>

                <div class="bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg shadow-lg p-6 text-white stat-card">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-sm font-medium opacity-90">Categories</h3>
                        <i class="fas fa-folder text-2xl opacity-75"></i>
                    </div>
                    <div class="text-3xl font-bold">\${metrics.total_categories}</div>
                    <div class="mt-2 text-sm opacity-90">
                        Active categories
                    </div>
                </div>

                <div class="bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg shadow-lg p-6 text-white stat-card">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-sm font-medium opacity-90">Revenue</h3>
                        <i class="fas fa-dollar-sign text-2xl opacity-75"></i>
                    </div>
                    <div class="text-3xl font-bold">$\${(metrics.total_sponsorship_revenue || 0).toFixed(0)}</div>
                    <div class="mt-2 text-sm opacity-90">
                        From sponsorships
                    </div>
                </div>
            \`;
        }

        function renderStatusChart(metrics) {
            const ctx = document.getElementById('status-chart');
            if (statusChart) statusChart.destroy();
            
            statusChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Approved', 'Pending', 'Rejected'],
                    datasets: [{
                        data: [
                            metrics.approved_agents,
                            metrics.pending_agents,
                            metrics.rejected_agents
                        ],
                        backgroundColor: [
                            'rgb(34, 197, 94)',
                            'rgb(234, 179, 8)',
                            'rgb(239, 68, 68)'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true
                }
            });
        }

        function renderCategoryChart(categories) {
            const ctx = document.getElementById('category-chart');
            if (categoryChart) categoryChart.destroy();
            
            const top5 = categories.slice(0, 5);
            
            categoryChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: top5.map(c => c.name),
                    datasets: [{
                        label: 'Agents',
                        data: top5.map(c => c.agent_count),
                        backgroundColor: 'rgb(147, 51, 234)'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }

        function renderRecentSubmissions(submissions) {
            const container = document.getElementById('recent-submissions');
            if (submissions.length === 0) {
                container.innerHTML = '<div class="p-6 text-center text-gray-500">No recent submissions</div>';
                return;
            }
            
            container.innerHTML = submissions.map(agent => \`
                <div class="p-4 hover:bg-gray-50 cursor-pointer" onclick="window.location='/admin/agents-queue?id=\${agent.id}'">
                    <div class="flex items-center justify-between">
                        <div class="flex-1">
                            <h4 class="font-semibold text-gray-900">\${agent.name}</h4>
                            <p class="text-sm text-gray-600">
                                Submitted by \${agent.submitter_name || 'Unknown'} • 
                                \${new Date(agent.submitted_at).toLocaleDateString()}
                            </p>
                        </div>
                        <span class="px-3 py-1 text-xs font-semibold rounded-full \${
                            agent.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            agent.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                        }">
                            \${agent.status}
                        </span>
                    </div>
                </div>
            \`).join('');
        }

        function renderTopCategories(categories) {
            const container = document.getElementById('top-categories');
            if (categories.length === 0) {
                container.innerHTML = '<div class="p-6 text-center text-gray-500">No categories</div>';
                return;
            }
            
            container.innerHTML = categories.slice(0, 10).map((cat, index) => \`
                <div class="p-4 flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <span class="text-2xl font-bold text-gray-300">#\${index + 1}</span>
                        <div class="text-2xl">\${cat.icon || '📁'}</div>
                        <div>
                            <h4 class="font-semibold">\${cat.name}</h4>
                            <p class="text-sm text-gray-600">\${cat.slug}</p>
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="text-2xl font-bold text-purple-600">\${cat.agent_count}</div>
                        <div class="text-xs text-gray-500">agents</div>
                    </div>
                </div>
            \`).join('');
        }

        function refreshDashboard() {
            loadDashboard();
        }

        function logout() {
            localStorage.removeItem('auth_token');
            window.location.href = '/';
        }

        // Initial load
        document.addEventListener('DOMContentLoaded', loadDashboard);

        // Auto-refresh every 30 seconds
        setInterval(loadDashboard, 30000);
    </script>
</body>
</html>
`;

export const agentApprovalQueue = () => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Approval Queue - Admin Panel</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        .agent-row:hover {
            background-color: #f9fafb;
        }
        .selected {
            background-color: #ede9fe !important;
        }
    </style>
</head>
<body class="bg-gray-100">
    <div class="flex h-screen">
        <!-- Sidebar (same as dashboard) -->
        ${getSidebar('agents-queue')}

        <!-- Main Content -->
        <div class="flex-1 overflow-y-auto">
            <div class="p-8">
                <div class="flex justify-between items-center mb-8">
                    <h1 class="text-3xl font-bold">Approval Queue</h1>
                    <div class="flex space-x-2">
                        <button id="bulk-approve-btn" disabled class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed">
                            <i class="fas fa-check mr-2"></i>Approve Selected
                        </button>
                        <button id="bulk-reject-btn" disabled class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed">
                            <i class="fas fa-times mr-2"></i>Reject Selected
                        </button>
                    </div>
                </div>

                <!-- Filters -->
                <div class="bg-white rounded-lg shadow p-4 mb-6">
                    <div class="flex space-x-4">
                        <input type="text" id="search-input" placeholder="Search agents..." 
                            class="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-600">
                        <select id="status-filter" class="px-4 py-2 border rounded-lg">
                            <option value="PENDING">Pending</option>
                            <option value="APPROVED">Approved</option>
                            <option value="REJECTED">Rejected</option>
                            <option value="">All Status</option>
                        </select>
                        <button onclick="loadAgents()" class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                            <i class="fas fa-search"></i>
                        </button>
                    </div>
                </div>

                <!-- Agents Table -->
                <div class="bg-white rounded-lg shadow overflow-hidden">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left">
                                    <input type="checkbox" id="select-all" class="rounded" onchange="toggleSelectAll()">
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Agent</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submitted By</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="agents-tbody" class="divide-y divide-gray-200">
                            <tr><td colspan="6" class="px-6 py-8 text-center text-gray-500">Loading...</td></tr>
                        </tbody>
                    </table>
                </div>

                <!-- Pagination -->
                <div id="pagination" class="mt-6 flex justify-between items-center">
                    <!-- Will be populated by JS -->
                </div>
            </div>
        </div>
    </div>

    <!-- Review Modal -->
    <div id="review-modal" class="hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div id="modal-content">
                <!-- Will be populated by JS -->
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
    <script>
        const authToken = localStorage.getItem('auth_token');
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + authToken;

        let selectedAgents = new Set();
        let currentPage = 1;
        let totalPages = 1;

        async function loadAgents() {
            try {
                const status = document.getElementById('status-filter').value;
                const search = document.getElementById('search-input').value;
                
                const params = new URLSearchParams({
                    page: currentPage,
                    limit: 20,
                    ...(status && { status }),
                    ...(search && { search })
                });

                const response = await axios.get('/api/admin/agents/all?' + params.toString());
                
                if (response.data.success) {
                    renderAgentsTable(response.data.data);
                    renderPagination(response.data.pagination);
                }
            } catch (error) {
                console.error('Error loading agents:', error);
            }
        }

        function renderAgentsTable(agents) {
            const tbody = document.getElementById('agents-tbody');
            
            if (agents.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" class="px-6 py-8 text-center text-gray-500">No agents found</td></tr>';
                return;
            }

            tbody.innerHTML = agents.map(agent => \`
                <tr class="agent-row \${selectedAgents.has(agent.id) ? 'selected' : ''}" data-agent-id="\${agent.id}">
                    <td class="px-6 py-4">
                        <input type="checkbox" class="agent-checkbox rounded" 
                            value="\${agent.id}" 
                            \${selectedAgents.has(agent.id) ? 'checked' : ''}
                            onchange="toggleAgent(\${agent.id})">
                    </td>
                    <td class="px-6 py-4">
                        <div class="flex items-center">
                            <div class="h-10 w-10 flex-shrink-0 rounded-lg overflow-hidden">
                                \${agent.logo_url ? \`
                                    <img src="\${agent.logo_url}" alt="\${agent.name}" loading="lazy" class="w-full h-full object-cover" onerror="this.style.display='none'; this.parentElement.innerHTML='<div class=\\'bg-gradient-to-br from-purple-400 to-indigo-600 w-full h-full flex items-center justify-center text-2xl\\'>🤖</div>';">
                                \` : \`
                                    <div class="bg-gradient-to-br from-purple-400 to-indigo-600 w-full h-full flex items-center justify-center text-2xl">📦</div>
                                \`}
                            </div>
                            <div class="ml-4">
                                <div class="font-semibold text-gray-900">\${agent.name}</div>
                                <div class="text-sm text-gray-500">\${agent.tagline || 'No tagline'}</div>
                            </div>
                        </div>
                    </td>
                    <td class="px-6 py-4">
                        <div class="text-sm">
                            <div class="font-medium text-gray-900">\${agent.submitter_name || 'Unknown'}</div>
                            <div class="text-gray-500">\${agent.submitter_email || ''}</div>
                        </div>
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-500">
                        \${new Date(agent.submitted_at).toLocaleDateString()}
                    </td>
                    <td class="px-6 py-4">
                        <span class="px-3 py-1 text-xs font-semibold rounded-full \${
                            agent.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            agent.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                        }">
                            \${agent.status}
                        </span>
                    </td>
                    <td class="px-6 py-4 text-right text-sm font-medium space-x-2">
                        <button onclick="viewAgent(\${agent.id})" class="text-purple-600 hover:text-purple-900">
                            <i class="fas fa-eye"></i> Review
                        </button>
                        \${agent.status === 'PENDING' ? \`
                            <button onclick="quickApprove(\${agent.id})" class="text-green-600 hover:text-green-900">
                                <i class="fas fa-check"></i>
                            </button>
                            <button onclick="quickReject(\${agent.id})" class="text-red-600 hover:text-red-900">
                                <i class="fas fa-times"></i>
                            </button>
                        \` : ''}
                    </td>
                </tr>
            \`).join('');
        }

        function renderPagination(pagination) {
            currentPage = pagination.page;
            totalPages = pagination.totalPages;
            
            const container = document.getElementById('pagination');
            container.innerHTML = \`
                <div class="text-sm text-gray-700">
                    Showing <span class="font-medium">\${((pagination.page - 1) * pagination.limit) + 1}</span>
                    to <span class="font-medium">\${Math.min(pagination.page * pagination.limit, pagination.total)}</span>
                    of <span class="font-medium">\${pagination.total}</span> results
                </div>
                <div class="flex space-x-2">
                    <button \${pagination.page === 1 ? 'disabled' : ''} 
                        onclick="changePage(\${pagination.page - 1})"
                        class="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                        Previous
                    </button>
                    <button \${pagination.page === pagination.totalPages ? 'disabled' : ''}
                        onclick="changePage(\${pagination.page + 1})"
                        class="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                        Next
                    </button>
                </div>
            \`;
        }

        function changePage(page) {
            currentPage = page;
            loadAgents();
        }

        function toggleAgent(agentId) {
            if (selectedAgents.has(agentId)) {
                selectedAgents.delete(agentId);
            } else {
                selectedAgents.add(agentId);
            }
            updateBulkButtons();
        }

        function toggleSelectAll() {
            const selectAll = document.getElementById('select-all');
            const checkboxes = document.querySelectorAll('.agent-checkbox');
            
            checkboxes.forEach(cb => {
                const agentId = parseInt(cb.value);
                if (selectAll.checked) {
                    selectedAgents.add(agentId);
                    cb.checked = true;
                } else {
                    selectedAgents.delete(agentId);
                    cb.checked = false;
                }
            });
            updateBulkButtons();
        }

        function updateBulkButtons() {
            const approveBtn = document.getElementById('bulk-approve-btn');
            const rejectBtn = document.getElementById('bulk-reject-btn');
            const hasSelection = selectedAgents.size > 0;
            
            approveBtn.disabled = !hasSelection;
            rejectBtn.disabled = !hasSelection;
        }

        async function bulkApprove() {
            if (selectedAgents.size === 0) return;
            
            if (!confirm(\`Approve \${selectedAgents.size} agent(s)?\`)) return;
            
            try {
                const response = await axios.post('/api/admin/agents/bulk-action', {
                    agent_ids: Array.from(selectedAgents),
                    action: 'approve'
                });
                
                if (response.data.success) {
                    alert('Agents approved successfully');
                    selectedAgents.clear();
                    loadAgents();
                }
            } catch (error) {
                alert('Error: ' + (error.response?.data?.error || 'Failed to approve agents'));
            }
        }

        async function bulkReject() {
            if (selectedAgents.size === 0) return;
            
            const reason = prompt(\`Enter rejection reason for \${selectedAgents.size} agent(s):\`);
            if (!reason) return;
            
            try {
                const response = await axios.post('/api/admin/agents/bulk-action', {
                    agent_ids: Array.from(selectedAgents),
                    action: 'reject',
                    rejection_reason: reason
                });
                
                if (response.data.success) {
                    alert('Agents rejected successfully');
                    selectedAgents.clear();
                    loadAgents();
                }
            } catch (error) {
                alert('Error: ' + (error.response?.data?.error || 'Failed to reject agents'));
            }
        }

        async function quickApprove(agentId) {
            if (!confirm('Approve this agent?')) return;
            
            try {
                const response = await axios.put(\`/api/admin/agents/\${agentId}/approve\`);
                if (response.data.success) {
                    alert('Agent approved!');
                    loadAgents();
                }
            } catch (error) {
                alert('Error: ' + (error.response?.data?.error || 'Failed to approve'));
            }
        }

        async function quickReject(agentId) {
            const reason = prompt('Enter rejection reason:');
            if (!reason) return;
            
            try {
                const response = await axios.put(\`/api/admin/agents/\${agentId}/reject-with-reason\`, {
                    reason
                });
                if (response.data.success) {
                    alert('Agent rejected');
                    loadAgents();
                }
            } catch (error) {
                alert('Error: ' + (error.response?.data?.error || 'Failed to reject'));
            }
        }

        async function viewAgent(agentId) {
            try {
                const response = await axios.get(\`/api/admin/agents/\${agentId}\`);
                if (response.data.success) {
                    const agent = response.data.data;
                    showReviewModal(agent);
                }
            } catch (error) {
                alert('Error loading agent: ' + (error.response?.data?.error || 'Unknown error'));
            }
        }
        
        function showReviewModal(agent) {
            const modal = document.getElementById('review-modal');
            const content = document.getElementById('modal-content');
            
            content.innerHTML = \`
                <div class="p-6 border-b border-gray-200">
                    <div class="flex justify-between items-start">
                        <div>
                            <h2 class="text-2xl font-bold mb-2">\${agent.name}</h2>
                            <p class="text-gray-600">\${agent.tagline || 'No tagline'}</p>
                            <div class="flex items-center gap-4 mt-3 text-sm">
                                <span class="px-3 py-1 rounded-full \${
                                    agent.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                    agent.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                    'bg-red-100 text-red-800'
                                }">
                                    \${agent.status}
                                </span>
                                <span class="text-gray-500">
                                    <i class="far fa-calendar mr-1"></i>
                                    \${new Date(agent.submitted_at).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                        <button onclick="closeReviewModal()" class="text-gray-400 hover:text-gray-600">
                            <i class="fas fa-times text-2xl"></i>
                        </button>
                    </div>
                </div>
                
                <div class="p-6 max-h-[60vh] overflow-y-auto">
                    <!-- Logo & Basic Info -->
                    <div class="grid md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <h3 class="font-semibold text-gray-700 mb-3">Logo</h3>
                            <div class="flex items-center gap-4">
                                \${agent.logo_url ? \`
                                    <img src="\${agent.logo_url}" alt="\${agent.name}" loading="lazy" class="w-20 h-20 rounded-lg object-cover border" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                                    <div class="w-20 h-20 rounded-lg bg-gradient-to-br from-purple-400 to-indigo-600 flex items-center justify-center text-3xl" style="display:none;">🤖</div>
                                \` : \`
                                    <div class="w-20 h-20 rounded-lg bg-gradient-to-br from-purple-400 to-indigo-600 flex items-center justify-center text-3xl">🤖</div>
                                \`}
                                <div class="text-sm text-gray-500">
                                    <p>\${agent.logo_url || 'No logo uploaded'}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div>
                            <h3 class="font-semibold text-gray-700 mb-3">Pricing</h3>
                            <div class="space-y-2 text-sm">
                                <p><strong>Model:</strong> \${agent.pricing_model || 'N/A'}</p>
                                <p><strong>Starts at:</strong> \${agent.pricing_starts_at || 'N/A'}</p>
                                <p><strong>Free Plan:</strong> \${agent.free_plan_available ? 'Yes' : 'No'}</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Description -->
                    <div class="mb-6">
                        <h3 class="font-semibold text-gray-700 mb-3">Description</h3>
                        <div class="bg-gray-50 rounded-lg p-4 text-sm text-gray-700">
                            \${agent.description || 'No description provided'}
                        </div>
                    </div>
                    
                    <!-- URL & Links -->
                    <div class="grid md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <h3 class="font-semibold text-gray-700 mb-3">Website</h3>
                            <a href="\${agent.website_url}" target="_blank" class="text-blue-600 hover:underline text-sm break-all">
                                \${agent.website_url || 'No website'}
                            </a>
                        </div>
                        <div>
                            <h3 class="font-semibold text-gray-700 mb-3">Submitter</h3>
                            <div class="text-sm text-gray-700">
                                <p>\${agent.submitter_name || 'Unknown'}</p>
                                <p class="text-gray-500">\${agent.submitter_email || ''}</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Categories -->
                    <div class="mb-6">
                        <h3 class="font-semibold text-gray-700 mb-3">Categories</h3>
                        <div class="text-sm text-gray-700">
                            \${agent.category_names || 'No categories assigned'}
                        </div>
                    </div>
                    
                    <!-- Admin Notes -->
                    \${agent.admin_notes ? \`
                        <div class="mb-6">
                            <h3 class="font-semibold text-gray-700 mb-3">Admin Notes</h3>
                            <div class="bg-yellow-50 rounded-lg p-4 text-sm text-gray-700">
                                \${agent.admin_notes}
                            </div>
                        </div>
                    \` : ''}
                </div>
                
                <div class="p-6 border-t border-gray-200 bg-gray-50">
                    <div class="flex flex-wrap gap-3">
                        <button onclick="editAgent(\${agent.id})" class="flex-1 sm:flex-none px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            <i class="fas fa-edit mr-2"></i>
                            Edit Agent
                        </button>
                        \${agent.status === 'PENDING' ? \`
                            <button onclick="approveFromModal(\${agent.id})" class="flex-1 sm:flex-none px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">
                                <i class="fas fa-check mr-2"></i>
                                Approve
                            </button>
                            <button onclick="rejectFromModal(\${agent.id})" class="flex-1 sm:flex-none px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700">
                                <i class="fas fa-times mr-2"></i>
                                Reject
                            </button>
                        \` : ''}
                        <button onclick="closeReviewModal()" class="flex-1 sm:flex-none px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
                            Close
                        </button>
                    </div>
                </div>
            \`;
            
            modal.classList.remove('hidden');
        }
        
        function closeReviewModal() {
            document.getElementById('review-modal').classList.add('hidden');
        }
        
        function editAgent(agentId) {
            window.location.href = \`/admin/agents/\${agentId}/edit-full\`;
        }
        
        async function approveFromModal(agentId) {
            if (!confirm('Approve this agent?')) return;
            
            try {
                const response = await axios.put(\`/api/admin/agents/\${agentId}/approve\`);
                if (response.data.success) {
                    alert('Agent approved successfully!');
                    closeReviewModal();
                    loadAgents();
                }
            } catch (error) {
                alert('Error: ' + (error.response?.data?.error || 'Failed to approve'));
            }
        }
        
        async function rejectFromModal(agentId) {
            const reason = prompt('Enter rejection reason:');
            if (!reason) return;
            
            try {
                const response = await axios.put(\`/api/admin/agents/\${agentId}/reject-with-reason\`, {
                    reason
                });
                if (response.data.success) {
                    alert('Agent rejected successfully');
                    closeReviewModal();
                    loadAgents();
                }
            } catch (error) {
                alert('Error: ' + (error.response?.data?.error || 'Failed to reject'));
            }
        }

        document.getElementById('bulk-approve-btn').addEventListener('click', bulkApprove);
        document.getElementById('bulk-reject-btn').addEventListener('click', bulkReject);
        document.getElementById('search-input').addEventListener('keyup', (e) => {
            if (e.key === 'Enter') loadAgents();
        });

        document.addEventListener('DOMContentLoaded', loadAgents);
    </script>
</body>
</html>
`;

export function getSidebar(activePage: string) {
  return `
        <div class="bg-gray-900 text-white w-64 flex-shrink-0 overflow-y-auto">
            <div class="p-6">
                <h2 class="text-2xl font-bold flex items-center">
                    <i class="fas fa-shield-alt mr-2"></i>
                    Admin Panel
                </h2>
            </div>
            <nav class="mt-6">
                <a href="/admin" class="block px-6 py-3 ${activePage === 'dashboard' ? 'bg-purple-600 border-l-4 border-purple-400' : 'hover:bg-gray-800'}">
                    <i class="fas fa-chart-line mr-2"></i> Dashboard
                </a>
                <a href="/admin/agents-queue" class="block px-6 py-3 ${activePage === 'agents-queue' ? 'bg-purple-600 border-l-4 border-purple-400' : 'hover:bg-gray-800'}">
                    <i class="fas fa-clock mr-2"></i> Approval Queue
                </a>
                <a href="/admin/agents-all" class="block px-6 py-3 ${activePage === 'agents-all' ? 'bg-purple-600 border-l-4 border-purple-400' : 'hover:bg-gray-800'}">
                    <i class="fas fa-robot mr-2"></i> All Agents
                </a>
                <a href="/admin/categories" class="block px-6 py-3 ${activePage === 'categories' ? 'bg-purple-600 border-l-4 border-purple-400' : 'hover:bg-gray-800'}">
                    <i class="fas fa-folder mr-2"></i> Categories
                </a>
                <a href="/admin/users" class="block px-6 py-3 ${activePage === 'users' ? 'bg-purple-600 border-l-4 border-purple-400' : 'hover:bg-gray-800'}">
                    <i class="fas fa-users mr-2"></i> Users
                </a>
                <a href="/admin/analytics" class="block px-6 py-3 ${activePage === 'analytics' ? 'bg-purple-600 border-l-4 border-purple-400' : 'hover:bg-gray-800'}">
                    <i class="fas fa-chart-bar mr-2"></i> Analytics
                </a>
                <a href="/admin/audit-logs" class="block px-6 py-3 ${activePage === 'audit-logs' ? 'bg-purple-600 border-l-4 border-purple-400' : 'hover:bg-gray-800'}">
                    <i class="fas fa-history mr-2"></i> Audit Logs
                </a>
                <hr class="my-4 border-gray-700">
                <a href="/" class="block px-6 py-3 hover:bg-gray-800">
                    <i class="fas fa-home mr-2"></i> Back to Site
                </a>
                <a href="#" onclick="logout()" class="block px-6 py-3 hover:bg-gray-800 text-red-400">
                    <i class="fas fa-sign-out-alt mr-2"></i> Logout
                </a>
            </nav>
        </div>
  `;
}
