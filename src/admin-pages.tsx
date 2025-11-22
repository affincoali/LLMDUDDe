// Complete Admin Panel Pages - All Missing Pages
// This file contains all admin UI pages that were missing

import { getSidebar } from './admin-ui';
import { getFooter } from './components/footer';

// Also export getSidebar from this file for convenience
export { getSidebar };

export const adminUsersPage = () => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User Management - Admin Panel</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-gray-100">
    <div class="flex h-screen">
        ${getSidebar('users')}
        
        <div class="flex-1 overflow-y-auto">
            <div class="p-8">
                <div class="flex justify-between items-center mb-8">
                    <h1 class="text-3xl font-bold">User Management</h1>
                </div>

                <!-- Filters -->
                <div class="bg-white rounded-lg shadow p-4 mb-6 flex space-x-4">
                    <input type="text" id="search-input" placeholder="Search by name or email..." 
                        class="flex-1 px-4 py-2 border rounded-lg">
                    <select id="role-filter" class="px-4 py-2 border rounded-lg">
                        <option value="">All Roles</option>
                        <option value="USER">User</option>
                        <option value="MODERATOR">Moderator</option>
                        <option value="ADMIN">Admin</option>
                    </select>
                    <button onclick="loadUsers()" class="px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800">
                        <i class="fas fa-search mr-2"></i>Search
                    </button>
                </div>

                <!-- Users Table -->
                <div class="bg-white rounded-lg shadow overflow-hidden">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stats</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="users-tbody" class="divide-y divide-gray-200">
                            <tr><td colspan="5" class="px-6 py-8 text-center text-gray-500">Loading...</td></tr>
                        </tbody>
                    </table>
                </div>

                <!-- Pagination -->
                <div id="pagination" class="mt-6 flex justify-between items-center"></div>
            </div>
        </div>
    </div>

    <!-- Role Change Modal -->
    <div id="role-modal" class="hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div class="bg-white rounded-xl p-8 max-w-md w-full mx-4">
            <h3 class="text-2xl font-bold mb-4">Change User Role</h3>
            <p class="text-gray-600 mb-4">Select new role for <span id="user-name" class="font-semibold"></span>:</p>
            <select id="new-role" class="w-full px-4 py-2 border rounded-lg mb-6">
                <option value="USER">User</option>
                <option value="MODERATOR">Moderator</option>
                <option value="ADMIN">Admin</option>
            </select>
            <div class="flex space-x-4">
                <button onclick="hideRoleModal()" class="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
                <button onclick="saveRole()" class="flex-1 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800">Save</button>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
    <script>
        const authToken = localStorage.getItem('auth_token');
        if (!authToken) window.location.href = '/';
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + authToken;

        let currentPage = 1;
        let selectedUserId = null;

        async function loadUsers() {
            try {
                const search = document.getElementById('search-input').value;
                const role = document.getElementById('role-filter').value;
                
                const params = new URLSearchParams({
                    page: currentPage,
                    limit: 20,
                    ...(search && { search }),
                    ...(role && { role })
                });

                const response = await axios.get('/api/admin/users?' + params.toString());
                
                if (response.data.success) {
                    renderUsersTable(response.data.data);
                    renderPagination(response.data.pagination);
                }
            } catch (error) {
                console.error('Error loading users:', error);
                if (error.response?.status === 403) {
                    alert('Admin access required');
                    window.location.href = '/admin';
                }
            }
        }

        function renderUsersTable(users) {
            const tbody = document.getElementById('users-tbody');
            
            if (users.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" class="px-6 py-8 text-center text-gray-500">No users found</td></tr>';
                return;
            }

            tbody.innerHTML = users.map(user => \`
                <tr class="hover:bg-gray-50">
                    <td class="px-6 py-4">
                        <div class="flex items-center">
                            <div class="h-10 w-10 flex-shrink-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                                \${user.name.charAt(0).toUpperCase()}
                            </div>
                            <div class="ml-4">
                                <div class="font-semibold text-gray-900">\${user.name}</div>
                                <div class="text-sm text-gray-500">\${user.email}</div>
                            </div>
                        </div>
                    </td>
                    <td class="px-6 py-4">
                        <span class="px-3 py-1 text-xs font-semibold rounded-full \${
                            user.role === 'ADMIN' ? 'bg-red-100 text-red-800' :
                            user.role === 'MODERATOR' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                        }">
                            \${user.role}
                        </span>
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-500">
                        <div><i class="fas fa-robot mr-1"></i> \${user.agents_count || 0} agents</div>
                        <div><i class="fas fa-arrow-up mr-1"></i> \${user.upvotes_count || 0} upvotes</div>
                        <div><i class="fas fa-star mr-1"></i> \${user.reviews_count || 0} reviews</div>
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-500">
                        \${new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td class="px-6 py-4 text-right text-sm font-medium">
                        <button onclick="showRoleModal(\${user.id}, '\${user.name}', '\${user.role}')" 
                            class="text-blue-700 hover:text-purple-900 mr-3">
                            <i class="fas fa-user-edit"></i> Role
                        </button>
                        <a href="/admin/users/\${user.id}" class="text-blue-600 hover:text-blue-900">
                            <i class="fas fa-eye"></i> View
                        </a>
                    </td>
                </tr>
            \`).join('');
        }

        function renderPagination(pagination) {
            const container = document.getElementById('pagination');
            container.innerHTML = \`
                <div class="text-sm text-gray-700">
                    Showing \${((pagination.page - 1) * pagination.limit) + 1} to \${Math.min(pagination.page * pagination.limit, pagination.total)} of \${pagination.total}
                </div>
                <div class="flex space-x-2">
                    <button \${pagination.page === 1 ? 'disabled' : ''} 
                        onclick="changePage(\${pagination.page - 1})"
                        class="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50">Previous</button>
                    <button \${pagination.page === pagination.totalPages ? 'disabled' : ''}
                        onclick="changePage(\${pagination.page + 1})"
                        class="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50">Next</button>
                </div>
            \`;
        }

        function changePage(page) {
            currentPage = page;
            loadUsers();
        }

        function showRoleModal(userId, userName, currentRole) {
            selectedUserId = userId;
            document.getElementById('user-name').textContent = userName;
            document.getElementById('new-role').value = currentRole;
            document.getElementById('role-modal').classList.remove('hidden');
        }

        function hideRoleModal() {
            document.getElementById('role-modal').classList.add('hidden');
            selectedUserId = null;
        }

        async function saveRole() {
            const newRole = document.getElementById('new-role').value;
            
            try {
                const response = await axios.put(\`/api/admin/users/\${selectedUserId}/role\`, { role: newRole });
                if (response.data.success) {
                    alert('Role updated successfully!');
                    hideRoleModal();
                    loadUsers();
                }
            } catch (error) {
                alert('Error: ' + (error.response?.data?.error || 'Failed to update role'));
            }
        }

        function logout() {
            localStorage.removeItem('auth_token');
            window.location.href = '/';
        }

        document.addEventListener('DOMContentLoaded', loadUsers);
        document.getElementById('search-input').addEventListener('keyup', (e) => {
            if (e.key === 'Enter') loadUsers();
        });
    </script>
${getFooter()}
</body>
</html>
`;

export const adminAnalyticsPage = () => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Analytics - Admin Panel</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
</head>
<body class="bg-gray-100">
    <div class="flex h-screen">
        ${getSidebar('analytics')}
        
        <div class="flex-1 overflow-y-auto">
            <div class="p-8">
                <div class="flex justify-between items-center mb-8">
                    <h1 class="text-3xl font-bold">Analytics</h1>
                    <select id="days-filter" onchange="loadAnalytics()" class="px-4 py-2 border rounded-lg">
                        <option value="7">Last 7 days</option>
                        <option value="30" selected>Last 30 days</option>
                        <option value="90">Last 90 days</option>
                    </select>
                </div>

                <!-- Charts Grid -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <div class="bg-white rounded-lg shadow p-6">
                        <h3 class="text-lg font-semibold mb-4">Top Categories</h3>
                        <canvas id="categories-chart"></canvas>
                    </div>

                    <div class="bg-white rounded-lg shadow p-6">
                        <h3 class="text-lg font-semibold mb-4">Pricing Model Distribution</h3>
                        <canvas id="pricing-chart"></canvas>
                    </div>
                </div>

                <div class="bg-white rounded-lg shadow p-6">
                    <h3 class="text-lg font-semibold mb-4">Agent Submissions Over Time</h3>
                    <canvas id="growth-chart"></canvas>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
    <script>
        const authToken = localStorage.getItem('auth_token');
        if (!authToken) window.location.href = '/';
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + authToken;

        let categoriesChart, pricingChart, growthChart;

        async function loadAnalytics() {
            try {
                const days = document.getElementById('days-filter').value;
                const response = await axios.get(\`/api/admin/analytics?days=\${days}\`);
                
                if (response.data.success) {
                    const { top_categories, pricing_distribution, growth_trend } = response.data.data;
                    renderCategoriesChart(top_categories);
                    renderPricingChart(pricing_distribution);
                    renderGrowthChart(growth_trend);
                }
            } catch (error) {
                console.error('Error loading analytics:', error);
            }
        }

        function renderCategoriesChart(data) {
            const ctx = document.getElementById('categories-chart');
            if (categoriesChart) categoriesChart.destroy();
            
            categoriesChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: data.map(c => c.name),
                    datasets: [{
                        label: 'Agents',
                        data: data.map(c => c.count),
                        backgroundColor: 'rgba(147, 51, 234, 0.8)'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true
                }
            });
        }

        function renderPricingChart(data) {
            const ctx = document.getElementById('pricing-chart');
            if (pricingChart) pricingChart.destroy();
            
            pricingChart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: data.map(p => p.model),
                    datasets: [{
                        data: data.map(p => p.count),
                        backgroundColor: [
                            'rgba(34, 197, 94, 0.8)',
                            'rgba(59, 130, 246, 0.8)',
                            'rgba(234, 179, 8, 0.8)',
                            'rgba(239, 68, 68, 0.8)'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true
                }
            });
        }

        function renderGrowthChart(data) {
            const ctx = document.getElementById('growth-chart');
            if (growthChart) growthChart.destroy();
            
            growthChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: data.map(d => new Date(d.date).toLocaleDateString()),
                    datasets: [{
                        label: 'New Submissions',
                        data: data.map(d => d.count),
                        borderColor: 'rgba(147, 51, 234, 1)',
                        backgroundColor: 'rgba(147, 51, 234, 0.1)',
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true
                }
            });
        }

        function logout() {
            localStorage.removeItem('auth_token');
            window.location.href = '/';
        }

        document.addEventListener('DOMContentLoaded', loadAnalytics);
    </script>
${getFooter()}
</body>
</html>
`;

export const adminAuditLogsPage = () => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Audit Logs - Admin Panel</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-gray-100">
    <div class="flex h-screen">
        ${getSidebar('audit-logs')}
        
        <div class="flex-1 overflow-y-auto">
            <div class="p-8">
                <h1 class="text-3xl font-bold mb-8">Audit Logs</h1>

                <!-- Filters -->
                <div class="bg-white rounded-lg shadow p-4 mb-6 grid grid-cols-4 gap-4">
                    <select id="action-filter" class="px-4 py-2 border rounded-lg">
                        <option value="">All Actions</option>
                        <option value="APPROVE">Approve</option>
                        <option value="REJECT">Reject</option>
                        <option value="APPROVE_WITH_EDITS">Approve with Edits</option>
                        <option value="BULK_APPROVE">Bulk Approve</option>
                        <option value="BULK_REJECT">Bulk Reject</option>
                        <option value="UPDATE_USER_ROLE">Update Role</option>
                    </select>
                    <select id="entity-filter" class="px-4 py-2 border rounded-lg">
                        <option value="">All Entities</option>
                        <option value="agent">Agents</option>
                        <option value="user">Users</option>
                        <option value="category">Categories</option>
                    </select>
                    <input type="number" id="user-filter" placeholder="User ID" class="px-4 py-2 border rounded-lg">
                    <button onclick="loadLogs()" class="px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800">
                        <i class="fas fa-search mr-2"></i>Filter
                    </button>
                </div>

                <!-- Logs Table -->
                <div class="bg-white rounded-lg shadow overflow-hidden">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Entity</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
                            </tr>
                        </thead>
                        <tbody id="logs-tbody" class="divide-y divide-gray-200">
                            <tr><td colspan="5" class="px-6 py-8 text-center text-gray-500">Loading...</td></tr>
                        </tbody>
                    </table>
                </div>

                <div id="pagination" class="mt-6 flex justify-between items-center"></div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
    <script>
        const authToken = localStorage.getItem('auth_token');
        if (!authToken) window.location.href = '/';
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + authToken;

        let currentPage = 1;

        async function loadLogs() {
            try {
                const action = document.getElementById('action-filter').value;
                const entityType = document.getElementById('entity-filter').value;
                const userId = document.getElementById('user-filter').value;
                
                const params = new URLSearchParams({
                    page: currentPage,
                    limit: 50,
                    ...(action && { action }),
                    ...(entityType && { entity_type: entityType }),
                    ...(userId && { user_id: userId })
                });

                const response = await axios.get('/api/admin/audit-logs?' + params.toString());
                
                if (response.data.success) {
                    renderLogsTable(response.data.data);
                    renderPagination(response.data.pagination);
                }
            } catch (error) {
                console.error('Error loading logs:', error);
                if (error.response?.status === 403) {
                    alert('Admin-only feature');
                    window.location.href = '/admin';
                }
            }
        }

        function renderLogsTable(logs) {
            const tbody = document.getElementById('logs-tbody');
            
            if (logs.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" class="px-6 py-8 text-center text-gray-500">No logs found</td></tr>';
                return;
            }

            tbody.innerHTML = logs.map(log => {
                const details = log.details ? JSON.parse(log.details) : {};
                return \`
                    <tr class="hover:bg-gray-50">
                        <td class="px-6 py-4 text-sm text-gray-500">
                            \${new Date(log.created_at).toLocaleString()}
                        </td>
                        <td class="px-6 py-4 text-sm">
                            <div class="font-medium">\${log.user_name || 'Unknown'}</div>
                            <div class="text-gray-500">\${log.user_email || ''}</div>
                        </td>
                        <td class="px-6 py-4">
                            <span class="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                                \${log.action}
                            </span>
                        </td>
                        <td class="px-6 py-4 text-sm text-gray-900">
                            \${log.entity_type}
                            \${log.entity_id ? \` #\${log.entity_id}\` : ''}
                        </td>
                        <td class="px-6 py-4 text-sm text-gray-500">
                            <button onclick="showDetails(\${JSON.stringify(details).replace(/"/g, '&quot;')})" 
                                class="text-blue-600 hover:text-blue-900">
                                View Details
                            </button>
                        </td>
                    </tr>
                \`;
            }).join('');
        }

        function renderPagination(pagination) {
            const container = document.getElementById('pagination');
            container.innerHTML = \`
                <div class="text-sm text-gray-700">Page \${pagination.page} of \${pagination.totalPages}</div>
                <div class="flex space-x-2">
                    <button \${pagination.page === 1 ? 'disabled' : ''} 
                        onclick="changePage(\${pagination.page - 1})"
                        class="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50">Previous</button>
                    <button \${pagination.page === pagination.totalPages ? 'disabled' : ''}
                        onclick="changePage(\${pagination.page + 1})"
                        class="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50">Next</button>
                </div>
            \`;
        }

        function changePage(page) {
            currentPage = page;
            loadLogs();
        }

        function showDetails(details) {
            alert('Details:\\n' + JSON.stringify(details, null, 2));
        }

        function logout() {
            localStorage.removeItem('auth_token');
            window.location.href = '/';
        }

        document.addEventListener('DOMContentLoaded', loadLogs);
    </script>
${getFooter()}
</body>
</html>
`;

export const adminCategoriesPage = () => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Categories - Admin Panel</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-gray-100">
    <div class="flex h-screen">
        ${getSidebar('categories')}
        
        <div class="flex-1 overflow-y-auto">
            <div class="p-8">
                <div class="flex justify-between items-center mb-8">
                    <h1 class="text-3xl font-bold">Categories</h1>
                    <button onclick="showCreateModal()" class="px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800">
                        <i class="fas fa-plus mr-2"></i>New Category
                    </button>
                </div>

                <!-- Categories List -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="categories-grid">
                    <div class="text-center py-12 text-gray-500">Loading...</div>
                </div>
            </div>
        </div>
    </div>

    <!-- Create/Edit Modal -->
    <div id="category-modal" class="hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-xl p-8 max-w-md w-full">
            <h3 class="text-2xl font-bold mb-6" id="modal-title">New Category</h3>
            <form id="category-form">
                <div class="mb-4">
                    <label class="block text-sm font-medium mb-2">Name *</label>
                    <input type="text" id="cat-name" required class="w-full px-4 py-2 border rounded-lg">
                </div>
                <div class="mb-4">
                    <label class="block text-sm font-medium mb-2">Icon (Emoji)</label>
                    <input type="text" id="cat-icon" placeholder="📁" class="w-full px-4 py-2 border rounded-lg">
                </div>
                <div class="mb-4">
                    <label class="block text-sm font-medium mb-2">Category Image (Optional)</label>
                    <input type="file" id="cat-image" accept="image/*" class="w-full px-4 py-2 border rounded-lg text-sm">
                    <input type="text" id="cat-image-url" placeholder="Or paste URL" class="w-full px-4 py-2 border rounded-lg mt-2 text-sm">
                </div>
                <div class="mb-4">
                    <label class="block text-sm font-medium mb-2">Description</label>
                    <textarea id="cat-description" rows="3" class="w-full px-4 py-2 border rounded-lg"></textarea>
                </div>
                <div class="mb-6">
                    <label class="block text-sm font-medium mb-2">Color</label>
                    <input type="color" id="cat-color" value="#9333ea" class="w-full h-10 rounded-lg">
                </div>
                <div class="flex space-x-4">
                    <button type="button" onclick="hideCategoryModal()" class="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
                    <button type="submit" class="flex-1 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800">Save</button>
                </div>
            </form>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
    <script>
        const authToken = localStorage.getItem('auth_token');
        if (!authToken) window.location.href = '/';
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + authToken;

        async function loadCategories() {
            try {
                const response = await axios.get('/api/admin/categories');
                if (response.data.success) {
                    renderCategories(response.data.data);
                }
            } catch (error) {
                console.error('Error loading categories:', error);
                showToast('Failed to load categories', 'error');
            }
        }

        function renderCategories(categories) {
            const grid = document.getElementById('categories-grid');
            if (categories.length === 0) {
                grid.innerHTML = '<div class="col-span-3 text-center py-12 text-gray-500">No categories yet</div>';
                return;
            }

            grid.innerHTML = categories.map(cat => \`
                <div class="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
                    <div class="flex items-center justify-between mb-4">
                        \${cat.image_url ? \`<img src="\${cat.image_url}" alt="\${cat.name}" loading="lazy" class="w-16 h-16 object-cover rounded-lg" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='block'">\` : ''}<div class="text-4xl" style="display:\${cat.image_url?'none':'block'}">\${cat.icon||'📁'}</div>
                        <span class="px-3 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                            \${cat.agent_count} agents
                        </span>
                    </div>
                    <h3 class="text-xl font-bold mb-2">\${cat.name}</h3>
                    <p class="text-sm text-gray-600 mb-4">\${cat.description||'No description'}</p>
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-2">
                            <div class="w-6 h-6 rounded-full" style="background-color:\${cat.color||'#9333ea'}"></div>
                            <span class="text-xs text-gray-500">\${cat.slug}</span>
                        </div>
                        <div class="flex space-x-2">
                            <button onclick="showEditModal(\${cat.id})" class="text-blue-600 hover:text-blue-900 text-sm"><i class="fas fa-edit"></i></button>
                            <button onclick="deleteCategory(\${cat.id},'\${cat.name}',\${cat.agent_count})" class="text-red-600 hover:text-red-900 text-sm"><i class="fas fa-trash"></i></button>
                        </div>
                    </div>
                </div>
            \`).join('');
        }

        let editingCategoryId = null;

        function showCreateModal() {
            editingCategoryId = null;
            document.getElementById('modal-title').textContent = 'New Category';
            document.getElementById('category-form').reset();
            document.getElementById('cat-color').value = '#9333ea';
            document.getElementById('category-modal').classList.remove('hidden');
        }

        async function showEditModal(categoryId) {
            try {
                const response = await axios.get('/api/admin/categories/' + categoryId);
                if (response.data.success) {
                    const cat = response.data.data;
                    editingCategoryId = categoryId;
                    document.getElementById('modal-title').textContent = 'Edit Category';
                    document.getElementById('cat-name').value = cat.name;
                    document.getElementById('cat-icon').value = cat.icon || '';
                    document.getElementById('cat-image-url').value = cat.image_url || '';
                    document.getElementById('cat-description').value = cat.description || '';
                    document.getElementById('cat-color').value = cat.color || '#9333ea';
                    document.getElementById('category-modal').classList.remove('hidden');
                }
            } catch (error) {
                showToast('Failed to load category details', 'error');
            }
        }

        function hideCategoryModal() {
            document.getElementById('category-modal').classList.add('hidden');
        }

        async function deleteCategory(categoryId, categoryName, agentCount) {
            if (agentCount > 0) {
                showToast('Cannot delete "' + categoryName + '" - it has ' + agentCount + ' associated agents', 'error');
                return;
            }
            
            if (!confirm('Are you sure you want to delete "' + categoryName + '"?')) {
                return;
            }
            
            try {
                const response = await axios.delete('/api/admin/categories/' + categoryId);
                if (response.data.success) {
                    showToast('Category deleted successfully!', 'success');
                    loadCategories();
                }
            } catch (error) {
                showToast(error.response?.data?.error || 'Failed to delete category', 'error');
            }
        }

        function showToast(message, type = 'info') {
            const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
            const toast = document.createElement('div');
            toast.className = 'fixed top-4 right-4 ' + bgColor + ' text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-opacity';
            toast.textContent = message;
            document.body.appendChild(toast);
            setTimeout(function() {
                toast.style.opacity = '0';
                setTimeout(function() { toast.remove(); }, 300);
            }, 3000);
        }

        document.getElementById('category-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('cat-name').value.trim();
            const icon = document.getElementById('cat-icon').value.trim();
            const description = document.getElementById('cat-description').value.trim();
            const color = document.getElementById('cat-color').value;
            const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
            let imageUrl = document.getElementById('cat-image-url').value.trim();
            
            if (!name) {
                showToast('Category name is required', 'error');
                return;
            }
            
            // Handle image upload if file selected
            const imageFile = document.getElementById('cat-image').files[0];
            if (imageFile) {
                try {
                    const fd = new FormData();
                    fd.append('file', imageFile);
                    const uploadRes = await axios.post('/api/upload/image', fd);
                    if (uploadRes.data.success) imageUrl = uploadRes.data.data.url;
                } catch (err) {
                    showToast('Image upload failed', 'error');
                    return;
                }
            }
            
            try {
                const data = { name, slug, icon, description, color, image_url: imageUrl || null };
                const response = editingCategoryId
                    ? await axios.put('/api/admin/categories/' + editingCategoryId, data)
                    : await axios.post('/api/admin/categories', data);
                
                if (response.data.success) {
                    hideCategoryModal();
                    loadCategories();
                    showToast(editingCategoryId ? 'Category updated!' : 'Category created!', 'success');
                }
            } catch (error) {
                showToast(error.response?.data?.error || 'Failed to save category', 'error');
            }
        });

        function logout() {
            localStorage.removeItem('auth_token');
            window.location.href = '/';
        }

        document.addEventListener('DOMContentLoaded', loadCategories);
    </script>
${getFooter()}
</body>
</html>
`;

export const adminAllAgentsPage = () => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>All Agents - Admin Panel</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-gray-100">
    <div class="flex h-screen">
        ${getSidebar('agents-all')}
        
        <div class="flex-1 overflow-y-auto">
            <div class="p-8">
                <div class="flex justify-between items-center mb-8">
                    <h1 class="text-3xl font-bold">All Agents</h1>
                    <button onclick="window.location='/admin/agents/create'" class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                        <i class="fas fa-plus mr-2"></i>Create New Agent
                    </button>
                </div>

                <!-- Filters -->
                <div class="bg-white rounded-lg shadow p-4 mb-6 flex space-x-4">
                    <input type="text" id="search-input" placeholder="Search agents..." class="flex-1 px-4 py-2 border rounded-lg">
                    <select id="status-filter" class="px-4 py-2 border rounded-lg">
                        <option value="">All Status</option>
                        <option value="PENDING">Pending</option>
                        <option value="APPROVED">Approved</option>
                        <option value="REJECTED">Rejected</option>
                    </select>
                    <button onclick="loadAgents()" class="px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800">
                        <i class="fas fa-search"></i>
                    </button>
                </div>

                <!-- Agents Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="agents-grid">
                    <div class="text-center py-12 text-gray-500">Loading...</div>
                </div>

                <div id="pagination" class="mt-6 flex justify-between items-center"></div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
    <script>
        const authToken = localStorage.getItem('auth_token');
        if (!authToken) window.location.href = '/';
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + authToken;

        let currentPage = 1;

        async function loadAgents() {
            try {
                const search = document.getElementById('search-input').value;
                const status = document.getElementById('status-filter').value;
                
                const params = new URLSearchParams({
                    page: currentPage,
                    limit: 12,
                    ...(search && { search }),
                    ...(status && { status })
                });

                const response = await axios.get('/api/admin/agents/all?' + params.toString());
                
                if (response.data.success) {
                    renderAgentsGrid(response.data.data);
                    renderPagination(response.data.pagination);
                }
            } catch (error) {
                console.error('Error loading agents:', error);
            }
        }

        function renderAgentsGrid(agents) {
            const grid = document.getElementById('agents-grid');
            
            if (agents.length === 0) {
                grid.innerHTML = '<div class="col-span-3 text-center py-12 text-gray-500">No agents found</div>';
                return;
            }

            grid.innerHTML = agents.map(agent => \`
                <div class="bg-white rounded-lg shadow overflow-hidden hover:shadow-xl transition">
                    <div class="h-40 bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center p-4">
                        <img 
                            src="\${agent.logo_url || 'https://storage.llmdude.com/uploads/1761722667625-3falg8084x7.png'}" 
                            alt="\${agent.name}" 
                            class="w-32 h-32 object-contain"
                            loading="lazy"
                            onerror="this.onerror=null; this.src='https://storage.llmdude.com/uploads/1761722667625-3falg8084x7.png';"
                        />
                    </div>
                    <div class="p-4">
                        <div class="flex items-center justify-between mb-2">
                            <h3 class="font-bold text-lg">\${agent.name}</h3>
                            <span class="px-2 py-1 text-xs font-semibold rounded-full \${
                                agent.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                agent.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                'bg-red-100 text-red-800'
                            }">
                                \${agent.status}
                            </span>
                        </div>
                        <p class="text-sm text-gray-600 mb-3 line-clamp-2">\${agent.tagline || 'No tagline'}</p>
                        <div class="flex items-center justify-between text-sm text-gray-500 mb-3">
                            <span><i class="fas fa-eye"></i> \${agent.view_count}</span>
                            <span><i class="fas fa-arrow-up"></i> \${agent.upvote_count}</span>
                            <span class="px-2 py-1 bg-gray-100 rounded text-xs">\${agent.pricing_model}</span>
                        </div>
                        <div class="flex space-x-2 mb-2">
                            <button onclick="window.location='/admin/agents/\${agent.id}/edit-full'" 
                                class="flex-1 px-3 py-2 text-sm bg-blue-700 text-white rounded hover:bg-blue-800">
                                <i class="fas fa-edit"></i> Edit Full
                            </button>
                            <a href="/agents/\${agent.slug}" target="_blank"
                                class="flex-1 px-3 py-2 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-center">
                                <i class="fas fa-eye"></i> View
                            </a>
                        </div>
                        <button onclick="window.location='/admin/agents/\${agent.id}/edit'" 
                            class="w-full px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
                            Quick Edit
                        </button>
                    </div>
                </div>
            \`).join('');
        }

        function renderPagination(pagination) {
            const container = document.getElementById('pagination');
            container.innerHTML = \`
                <div class="text-sm text-gray-700">
                    Page \${pagination.page} of \${pagination.totalPages} (\${pagination.total} total)
                </div>
                <div class="flex space-x-2">
                    <button \${pagination.page === 1 ? 'disabled' : ''} 
                        onclick="changePage(\${pagination.page - 1})"
                        class="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50">Previous</button>
                    <button \${pagination.page === pagination.totalPages ? 'disabled' : ''}
                        onclick="changePage(\${pagination.page + 1})"
                        class="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50">Next</button>
                </div>
            \`;
        }

        function changePage(page) {
            currentPage = page;
            loadAgents();
        }

        function logout() {
            localStorage.removeItem('auth_token');
            window.location.href = '/';
        }

        document.addEventListener('DOMContentLoaded', loadAgents);
        document.getElementById('search-input').addEventListener('keyup', (e) => {
            if (e.key === 'Enter') loadAgents();
        });
    </script>
${getFooter()}
</body>
</html>
`;
