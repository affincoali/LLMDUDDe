// Agents Listing and Detail Pages
// Advanced filtering, search, and comprehensive agent details

import { getFooter } from './components/footer';

export const advancedAgentsListing = () => `
<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Browse AI Agents - AI Agents Directory</title>
    <meta name="description" content="Browse and filter thousands of AI agents by category, pricing, and features. Find the perfect AI tool for your needs.">
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        :root {
            --bg-primary: #ffffff;
            --bg-secondary: #f9fafb;
            --text-primary: #111827;
            --text-secondary: #6b7280;
            --border-color: #e5e7eb;
        }
        
        [data-theme="dark"] {
            --bg-primary: #1f2937;
            --bg-secondary: #111827;
            --text-primary: #f9fafb;
            --text-secondary: #d1d5db;
            --border-color: #374151;
        }
        
        body {
            background-color: var(--bg-secondary);
            color: var(--text-primary);
            transition: background-color 0.3s, color 0.3s;
        }
        
        .card {
            background-color: var(--bg-primary);
            border: 1px solid var(--border-color);
        }
        
        .card-hover {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .card-hover:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 24px rgba(0,0,0,0.15);
        }
        
        .skeleton {
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: loading 1.5s ease-in-out infinite;
        }
        
        [data-theme="dark"] .skeleton {
            background: linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%);
            background-size: 200% 100%;
        }
        
        @keyframes loading {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
        }
        
        .filter-sidebar {
            position: sticky;
            top: 80px;
            max-height: calc(100vh - 100px);
            overflow-y: auto;
        }
        
        .upvote-btn {
            transition: all 0.2s;
        }
        
        .upvote-btn:hover {
            transform: scale(1.1);
        }
        
        .upvote-btn.upvoted {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
    </style>
</head>
<body>
    <!-- Navigation with Dark Mode Toggle -->
    <nav class="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50 card">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16 items-center">
                <div class="flex items-center">
                    <a href="/" class="flex items-center">
                        <i class="fas fa-robot text-3xl text-purple-600 mr-3"></i>
                        <span class="text-xl font-bold">AI Agents Directory</span>
                    </a>
                </div>
                <div class="flex items-center space-x-4">
                    <button onclick="toggleDarkMode()" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                        <i id="theme-icon" class="fas fa-moon text-xl"></i>
                    </button>
                    <a href="/" class="text-gray-700 dark:text-gray-300 hover:text-purple-600">Home</a>
                    <a href="/agents" class="text-purple-600 font-semibold">Browse</a>
                    <a href="/categories" class="text-gray-700 dark:text-gray-300 hover:text-purple-600">Categories</a>
                </div>
            </div>
        </div>
    </nav>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Header with Search and View Toggle -->
        <div class="mb-8">
            <h1 class="text-4xl font-bold mb-4">Browse AI Agents</h1>
            <div class="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div class="flex-1 max-w-2xl">
                    <div class="relative">
                        <input 
                            type="text" 
                            id="search-input"
                            placeholder="Search agents by name, description, or tags..." 
                            class="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-600 focus:border-transparent card"
                        >
                        <i class="fas fa-search absolute right-4 top-4 text-gray-400"></i>
                    </div>
                </div>
                <div class="flex items-center space-x-4">
                    <select id="sort-select" class="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-600 card">
                        <option value="trending">Trending</option>
                        <option value="newest">Newest</option>
                        <option value="most-upvoted">Most Upvoted</option>
                        <option value="most-reviewed">Most Reviewed</option>
                        <option value="a-z">A-Z</option>
                    </select>
                    <div class="flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
                        <button id="grid-view-btn" onclick="setView('grid')" class="px-4 py-3 bg-purple-600 text-white">
                            <i class="fas fa-th"></i>
                        </button>
                        <button id="list-view-btn" onclick="setView('list')" class="px-4 py-3 card">
                            <i class="fas fa-list"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <!-- Left Sidebar Filters -->
            <div class="lg:col-span-1">
                <div class="card rounded-lg p-6 filter-sidebar">
                    <div class="flex justify-between items-center mb-6">
                        <h3 class="font-bold text-lg">Filters</h3>
                        <button onclick="clearFilters()" class="text-sm text-purple-600 hover:text-purple-700">
                            Clear All
                        </button>
                    </div>

                    <!-- Pricing Model -->
                    <div class="mb-6">
                        <h4 class="font-semibold mb-3">Pricing Model</h4>
                        <label class="flex items-center mb-2 cursor-pointer">
                            <input type="checkbox" name="pricing" value="FREE" class="mr-2 w-4 h-4 text-purple-600 rounded">
                            <span class="text-sm">Free</span>
                        </label>
                        <label class="flex items-center mb-2 cursor-pointer">
                            <input type="checkbox" name="pricing" value="FREEMIUM" class="mr-2 w-4 h-4 text-purple-600 rounded">
                            <span class="text-sm">Freemium</span>
                        </label>
                        <label class="flex items-center mb-2 cursor-pointer">
                            <input type="checkbox" name="pricing" value="PAID" class="mr-2 w-4 h-4 text-purple-600 rounded">
                            <span class="text-sm">Paid</span>
                        </label>
                        <label class="flex items-center mb-2 cursor-pointer">
                            <input type="checkbox" name="pricing" value="CONTACT" class="mr-2 w-4 h-4 text-purple-600 rounded">
                            <span class="text-sm">Contact for Pricing</span>
                        </label>
                    </div>

                    <!-- Open Source -->
                    <div class="mb-6">
                        <label class="flex items-center cursor-pointer">
                            <input type="checkbox" id="opensource-filter" class="mr-2 w-4 h-4 text-purple-600 rounded">
                            <span class="font-semibold">Open Source Only</span>
                        </label>
                    </div>

                    <!-- Categories -->
                    <div class="mb-6">
                        <h4 class="font-semibold mb-3">Categories</h4>
                        <div id="category-filters" class="space-y-2 max-h-64 overflow-y-auto">
                            <!-- Categories will be loaded here -->
                            <div class="text-sm text-gray-500">Loading...</div>
                        </div>
                    </div>

                    <button onclick="applyFilters()" class="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition">
                        Apply Filters
                    </button>
                </div>
            </div>

            <!-- Main Content -->
            <div class="lg:col-span-3">
                <!-- Results Count -->
                <div class="mb-6 flex items-center justify-between">
                    <p class="text-gray-600 dark:text-gray-400">
                        <span id="results-count">0</span> agents found
                    </p>
                </div>

                <!-- Agents Grid/List -->
                <div id="agents-container" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    <!-- Loading Skeletons - Reduced for faster perceived load -->
                    ${Array(6).fill(0).map(() => `
                        <div class="card rounded-lg overflow-hidden">
                            <div class="h-48 skeleton"></div>
                            <div class="p-4">
                                <div class="h-6 skeleton rounded mb-2"></div>
                                <div class="h-4 skeleton rounded mb-2"></div>
                                <div class="h-4 skeleton rounded w-2/3"></div>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <!-- Pagination -->
                <div id="pagination" class="mt-8 flex justify-center items-center space-x-2">
                    <!-- Pagination buttons will be added here -->
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
    <script>
        const API_BASE = '/api';
        let currentView = 'grid';
        let currentPage = 1;
        let currentFilters = {
            search: '',
            pricing: [],
            opensource: false,
            categories: [],
            sort: 'trending'
        };
        let agents = [];
        let allCategories = [];

        // Dark Mode
        function toggleDarkMode() {
            const html = document.documentElement;
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            const icon = document.getElementById('theme-icon');
            icon.className = newTheme === 'dark' ? 'fas fa-sun text-xl' : 'fas fa-moon text-xl';
        }

        // Initialize theme
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        if (savedTheme === 'dark') {
            document.getElementById('theme-icon').className = 'fas fa-sun text-xl';
        }

        // Set View
        function setView(view) {
            currentView = view;
            document.getElementById('grid-view-btn').className = view === 'grid' 
                ? 'px-4 py-3 bg-purple-600 text-white' 
                : 'px-4 py-3 card';
            document.getElementById('list-view-btn').className = view === 'list' 
                ? 'px-4 py-3 bg-purple-600 text-white' 
                : 'px-4 py-3 card';
            renderAgents();
        }

        // Load Categories
        async function loadCategories() {
            try {
                const response = await axios.get(API_BASE + '/categories');
                if (response.data.success) {
                    allCategories = response.data.data;
                    const container = document.getElementById('category-filters');
                    container.innerHTML = allCategories.map(cat => \`
                        <label class="flex items-center cursor-pointer">
                            <input type="checkbox" name="category" value="\${cat.id}" class="mr-2 w-4 h-4 text-purple-600 rounded">
                            <span class="text-sm">\${cat.icon || '📁'} \${cat.name}</span>
                        </label>
                    \`).join('');
                }
            } catch (error) {
                console.error('Error loading categories:', error);
            }
        }

        // Load Agents - OPTIMIZED: Use faster public API endpoint
        async function loadAgents() {
            try {
                // Use optimized public endpoint instead of slow /api/agents
                let url = API_BASE + '/public/agents';
                const response = await axios.get(url);
                
                if (response.data.success) {
                    agents = response.data.data;
                    applyFiltersAndSort();
                }
            } catch (error) {
                console.error('Error loading agents:', error);
                // Show error message
                document.getElementById('agents-container').innerHTML = \`
                    <div class="col-span-full text-center py-12">
                        <i class="fas fa-exclamation-triangle text-6xl text-red-500 mb-4"></i>
                        <h3 class="text-xl font-semibold mb-2">Failed to load agents</h3>
                        <p class="text-gray-600">Please refresh the page to try again</p>
                    </div>
                \`;
            }
        }

        // Apply Filters and Sort
        function applyFiltersAndSort() {
            let filtered = [...agents];

            // Search filter
            if (currentFilters.search) {
                const search = currentFilters.search.toLowerCase();
                filtered = filtered.filter(a => 
                    a.name.toLowerCase().includes(search) ||
                    (a.tagline && a.tagline.toLowerCase().includes(search)) ||
                    (a.description && a.description.toLowerCase().includes(search))
                );
            }

            // Pricing filter
            if (currentFilters.pricing.length > 0) {
                filtered = filtered.filter(a => currentFilters.pricing.includes(a.pricing_model));
            }

            // Open source filter
            if (currentFilters.opensource) {
                filtered = filtered.filter(a => a.is_open_source);
            }

            // Category filter (needs join table query - simplified for now)
            // In production, this would be a backend query

            // Sort
            switch (currentFilters.sort) {
                case 'newest':
                    filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                    break;
                case 'most-upvoted':
                    filtered.sort((a, b) => b.upvote_count - a.upvote_count);
                    break;
                case 'most-reviewed':
                    filtered.sort((a, b) => b.review_count - a.review_count);
                    break;
                case 'a-z':
                    filtered.sort((a, b) => a.name.localeCompare(b.name));
                    break;
                case 'trending':
                default:
                    filtered.sort((a, b) => b.view_count - a.view_count);
            }

            agents = filtered;
            document.getElementById('results-count').textContent = filtered.length;
            renderAgents();
        }

        // Render Agents
        function renderAgents() {
            const container = document.getElementById('agents-container');
            
            if (agents.length === 0) {
                container.innerHTML = \`
                    <div class="col-span-full text-center py-12">
                        <i class="fas fa-search text-6xl text-gray-300 mb-4"></i>
                        <h3 class="text-xl font-semibold mb-2">No agents found</h3>
                        <p class="text-gray-600">Try adjusting your filters or search query</p>
                    </div>
                \`;
                return;
            }

            if (currentView === 'grid') {
                container.className = 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6';
                container.innerHTML = agents.map(agent => createGridCard(agent)).join('');
            } else {
                container.className = 'space-y-4';
                container.innerHTML = agents.map(agent => createListCard(agent)).join('');
            }
        }

        // Create Grid Card
        function createGridCard(agent) {
            const logoHtml = agent.logo_url 
                ? \`<img src="\${agent.logo_url}" alt="\${agent.name}" loading="lazy" class="w-full h-full object-contain" onerror="this.onerror=null; this.src='https://storage.llmdude.com/uploads/1761722667625-3falg8084x7.png';">\`
                : \`<img src="https://storage.llmdude.com/uploads/1761722667625-3falg8084x7.png" alt="\${agent.name}" loading="lazy" class="w-full h-full object-contain">\`;
            
            return \`
                <div class="card rounded-lg overflow-hidden card-hover cursor-pointer" onclick="window.location='/agents/\${agent.slug}'">
                    <div class="h-48 bg-white flex items-center justify-center p-4">
                        \${logoHtml}
                    </div>
                    <div class="p-6">
                        <h3 class="text-xl font-bold mb-2 truncate">\${agent.name}</h3>
                        <p class="text-gray-600 dark:text-gray-400 text-sm mb-4 h-10 overflow-hidden">\${agent.tagline || ''}</p>
                        <div class="flex items-center justify-between mb-3">
                            <span class="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 text-xs font-semibold rounded-full">
                                \${agent.pricing_model}
                            </span>
                            \${agent.is_open_source ? '<span class="text-xs text-green-600"><i class="fas fa-code"></i> Open Source</span>' : ''}
                        </div>
                        <div class="flex items-center justify-between text-sm text-gray-500">
                            <span><i class="fas fa-eye text-purple-600"></i> \${agent.view_count || 0}</span>
                            <button onclick="event.stopPropagation(); upvoteAgent(\${agent.id})" class="upvote-btn px-3 py-1 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900">
                                <i class="fas fa-arrow-up"></i> \${agent.upvote_count || 0}
                            </button>
                        </div>
                    </div>
                </div>
            \`;
        }

        // Create List Card - Optimized and Clean
        function createListCard(agent) {
            const logoHtml = agent.logo_url 
                ? \`<img src="\${agent.logo_url}" alt="\${agent.name}" loading="lazy" class="w-full h-full object-contain rounded-lg" onerror="this.onerror=null; this.src='https://storage.llmdude.com/uploads/1761722667625-3falg8084x7.png';">\`
                : \`<img src="https://storage.llmdude.com/uploads/1761722667625-3falg8084x7.png" alt="\${agent.name}" loading="lazy" class="w-full h-full object-contain rounded-lg">\`;
            
            return \`
                <div class="card rounded-lg p-4 card-hover cursor-pointer" onclick="window.location='/agents/\${agent.slug}'">
                    <div class="flex gap-4">
                        <div class="w-20 h-20 flex-shrink-0 bg-white rounded-lg flex items-center justify-center p-2">
                            \${logoHtml}
                        </div>
                        <div class="flex-1 min-w-0">
                            <div class="flex items-start justify-between gap-2 mb-1">
                                <h3 class="text-lg font-bold truncate">\${agent.name}</h3>
                                <button onclick="event.stopPropagation(); upvoteAgent(\${agent.id})" class="upvote-btn px-3 py-1 text-sm rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900 flex-shrink-0">
                                    <i class="fas fa-arrow-up"></i> \${agent.upvote_count || 0}
                                </button>
                            </div>
                            <p class="text-gray-600 dark:text-gray-400 text-sm mb-2 truncate">\${agent.tagline || ''}</p>
                            <div class="flex items-center gap-3 text-xs">
                                <span class="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 font-semibold rounded">
                                    \${agent.pricing_model}
                                </span>
                                <span class="text-gray-500"><i class="fas fa-eye text-purple-600"></i> \${agent.view_count || 0}</span>
                                \${agent.is_open_source ? '<span class="text-green-600"><i class="fas fa-code"></i></span>' : ''}
                            </div>
                        </div>
                    </div>
                </div>
            \`;
        }

        // Upvote Agent
        async function upvoteAgent(id) {
            try {
                const response = await axios.post(API_BASE + '/public/' + id + '/upvote');
                if (response.data.success) {
                    // Find and update the agent
                    const agent = agents.find(a => a.id === id);
                    if (agent) {
                        if (response.data.action === 'upvoted') {
                            agent.upvote_count++;
                        } else {
                            agent.upvote_count--;
                        }
                        renderAgents();
                    }
                    showToast(response.data.action === 'upvoted' ? 'Upvoted!' : 'Upvote removed', 'success');
                }
            } catch (error) {
                console.error('Error upvoting:', error);
                showToast('Failed to upvote', 'error');
            }
        }

        // Apply Filters
        function applyFilters() {
            currentFilters.search = document.getElementById('search-input').value;
            currentFilters.pricing = Array.from(document.querySelectorAll('input[name="pricing"]:checked')).map(cb => cb.value);
            currentFilters.opensource = document.getElementById('opensource-filter').checked;
            currentFilters.categories = Array.from(document.querySelectorAll('input[name="category"]:checked')).map(cb => cb.value);
            currentFilters.sort = document.getElementById('sort-select').value;
            
            applyFiltersAndSort();
        }

        // Clear Filters
        function clearFilters() {
            document.getElementById('search-input').value = '';
            document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
            document.getElementById('sort-select').value = 'trending';
            currentFilters = {
                search: '',
                pricing: [],
                opensource: false,
                categories: [],
                sort: 'trending'
            };
            loadAgents();
        }

        // Search input handler
        let searchTimeout;
        document.getElementById('search-input').addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                applyFilters();
            }, 300);
        });

        // Sort change handler
        document.getElementById('sort-select').addEventListener('change', applyFilters);

        // Toast Notification
        function showToast(message, type = 'info') {
            const toast = document.createElement('div');
            toast.className = \`fixed bottom-4 right-4 px-6 py-4 rounded-lg shadow-lg z-50 animate-fade-in \${
                type === 'success' ? 'bg-green-500' : 
                type === 'error' ? 'bg-red-500' : 'bg-blue-500'
            } text-white\`;
            toast.textContent = message;
            document.body.appendChild(toast);
            setTimeout(() => {
                toast.remove();
            }, 3000);
        }

        // Initialize - Load categories and agents in parallel for faster page load
        document.addEventListener('DOMContentLoaded', async () => {
            // Load both simultaneously for better performance
            await Promise.all([
                loadCategories(),
                loadAgents()
            ]);
        });
    </script>

    ${getFooter()}
</body>
</html>
`;

