// Enhanced Category Detail Page with Modern UI
import { getFooter } from './components/footer';

export const enhancedCategoryDetailPage = (slug: string) => `
<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title id="page-title">Category - AI Agents Directory</title>
    <meta name="description" id="page-description" content="Explore AI agents in this category">
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
            --hover-bg: #f3f4f6;
            --purple-600: #9333ea;
            --purple-700: #7e22ce;
        }
        
        [data-theme="dark"] {
            --bg-primary: #1f2937;
            --bg-secondary: #111827;
            --text-primary: #f9fafb;
            --text-secondary: #9ca3af;
            --border-color: #374151;
            --card-bg: #374151;
            --hover-bg: #4b5563;
        }
        
        body {
            background-color: var(--bg-secondary);
            color: var(--text-primary);
        }
        
        .card {
            background-color: var(--card-bg);
            border-color: var(--border-color);
        }
        
        /* Enhanced Agent Card */
        .enhanced-agent-card {
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 24px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            cursor: pointer;
            display: flex;
            flex-direction: column;
            height: 100%;
        }
        
        .enhanced-agent-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 20px 40px rgba(147, 51, 234, 0.15);
            border-color: var(--purple-600);
        }
        
        [data-theme="dark"] .enhanced-agent-card:hover {
            box-shadow: 0 20px 40px rgba(147, 51, 234, 0.3);
        }
        
        .agent-logo {
            width: 64px;
            height: 64px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2.5rem;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 12px;
            margin-bottom: 16px;
        }
        
        .badge {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
        }
        
        .badge-free { background: #d1fae5; color: #065f46; }
        .badge-freemium { background: #dbeafe; color: #1e40af; }
        .badge-paid { background: #fce7f3; color: #9f1239; }
        .badge-verified { background: #ddd6fe; color: #5b21b6; }
        .badge-featured { background: #fef3c7; color: #92400e; }
        .badge-opensource { background: #d1fae5; color: #065f46; }
        
        [data-theme="dark"] .badge-free { background: #065f46; color: #d1fae5; }
        [data-theme="dark"] .badge-freemium { background: #1e40af; color: #dbeafe; }
        [data-theme="dark"] .badge-paid { background: #9f1239; color: #fce7f3; }
        
        .category-hero {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 60px 0;
            margin-bottom: 40px;
            border-radius: 0 0 24px 24px;
        }
        
        .filter-chip {
            padding: 8px 16px;
            border-radius: 20px;
            border: 2px solid var(--border-color);
            background: var(--card-bg);
            cursor: pointer;
            transition: all 0.2s;
            font-size: 0.875rem;
            font-weight: 500;
        }
        
        .filter-chip:hover {
            border-color: var(--purple-600);
            color: var(--purple-600);
        }
        
        .filter-chip.active {
            background: var(--purple-600);
            border-color: var(--purple-600);
            color: white;
        }
        
        .stats-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            color: var(--text-secondary);
            font-size: 0.875rem;
        }
        
        .agent-description {
            color: var(--text-secondary);
            line-height: 1.6;
            flex-grow: 1;
            margin: 12px 0;
        }
        
        .action-button {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 10px 20px;
            border-radius: 8px;
            font-weight: 600;
            transition: all 0.2s;
            text-decoration: none;
        }
        
        .action-button-primary {
            background: var(--purple-600);
            color: white;
        }
        
        .action-button-primary:hover {
            background: var(--purple-700);
            transform: scale(1.05);
        }
        
        .skeleton {
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: loading 1.5s infinite;
            border-radius: 8px;
        }
        
        @keyframes loading {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
        }
        
        .breadcrumb {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 16px;
            font-size: 0.875rem;
        }
        
        .breadcrumb a {
            color: rgba(255, 255, 255, 0.8);
            text-decoration: none;
        }
        
        .breadcrumb a:hover {
            color: white;
        }
        
        .empty-state {
            text-align: center;
            padding: 60px 20px;
        }
        
        .empty-state i {
            font-size: 4rem;
            color: var(--text-secondary);
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <!-- Navigation -->
    <nav class="card border-b sticky top-0 z-40 shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16 items-center">
                <a href="/" class="flex items-center space-x-3">
                    <i class="fas fa-robot text-3xl text-purple-600"></i>
                    <span class="text-xl font-bold">AI Agents Directory</span>
                </a>
                
                <div class="hidden md:flex items-center space-x-6">
                    <a href="/" class="hover:text-purple-600">Home</a>
                    <a href="/agents" class="hover:text-purple-600">Agents</a>
                    <a href="/categories" class="text-purple-600 font-semibold">Categories</a>
                    <a href="/submit" class="hover:text-purple-600">Submit</a>
                    <button onclick="toggleDarkMode()" class="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700">
                        <i id="theme-icon" class="fas fa-moon"></i>
                    </button>
                </div>
                
                <button class="md:hidden p-2" onclick="toggleMobileMenu()">
                    <i class="fas fa-bars text-xl"></i>
                </button>
            </div>
            
            <div id="mobile-menu" class="hidden md:hidden pb-4">
                <a href="/" class="block py-2 hover:text-purple-600">Home</a>
                <a href="/agents" class="block py-2 hover:text-purple-600">Agents</a>
                <a href="/categories" class="block py-2 text-purple-600 font-semibold">Categories</a>
                <a href="/submit" class="block py-2 hover:text-purple-600">Submit</a>
            </div>
        </div>
    </nav>

    <!-- Category Hero Section -->
    <div class="category-hero">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="breadcrumb">
                <a href="/"><i class="fas fa-home"></i> Home</a>
                <i class="fas fa-chevron-right text-xs"></i>
                <a href="/categories">Categories</a>
                <i class="fas fa-chevron-right text-xs"></i>
                <span id="breadcrumb-category">Loading...</span>
            </div>
            
            <div class="flex items-center gap-6 mb-6">
                <div id="category-icon-container" class="w-20 h-20 flex items-center justify-center">
                    <div class="text-7xl" id="category-icon">📁</div>
                </div>
                <div>
                    <h1 class="text-5xl font-bold mb-2" id="category-name">Loading...</h1>
                    <p class="text-xl opacity-90" id="category-description">Loading category description...</p>
                </div>
            </div>
            
            <div class="flex flex-wrap gap-6 text-lg">
                <div class="flex items-center gap-2">
                    <i class="fas fa-robot"></i>
                    <strong id="agent-count">0</strong> Agents
                </div>
                <div class="flex items-center gap-2">
                    <i class="fas fa-fire"></i>
                    <span id="trending-count">0</span> Trending
                </div>
            </div>
        </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <!-- Filters Section -->
        <div class="mb-8">
            <div class="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-6">
                <div class="flex-1 max-w-md">
                    <div class="relative">
                        <i class="fas fa-search absolute left-4 top-3.5 text-gray-400"></i>
                        <input 
                            type="text" 
                            id="search-input" 
                            placeholder="Search agents..." 
                            class="card w-full pl-12 pr-4 py-3 rounded-xl border-2 focus:border-purple-600 focus:outline-none"
                            style="color: var(--text-primary)"
                            oninput="filterAgents()"
                        />
                    </div>
                </div>
                
                <div class="flex flex-wrap gap-3">
                    <select 
                        id="sort-select" 
                        class="card px-4 py-2.5 rounded-xl border-2 focus:border-purple-600 focus:outline-none"
                        style="color: var(--text-primary)"
                        onchange="sortAgents()"
                    >
                        <option value="popular">Most Popular</option>
                        <option value="newest">Newest First</option>
                        <option value="name">Name (A-Z)</option>
                        <option value="upvotes">Most Upvoted</option>
                    </select>
                </div>
            </div>
            
            <!-- Filter Chips -->
            <div class="flex flex-wrap gap-3 mb-4">
                <div class="filter-chip active" data-filter="all" onclick="setFilter('all')">
                    <i class="fas fa-th mr-1"></i> All
                </div>
                <div class="filter-chip" data-filter="FREE" onclick="setFilter('FREE')">
                    <i class="fas fa-gift mr-1"></i> Free
                </div>
                <div class="filter-chip" data-filter="FREEMIUM" onclick="setFilter('FREEMIUM')">
                    <i class="fas fa-star-half-alt mr-1"></i> Freemium
                </div>
                <div class="filter-chip" data-filter="PAID" onclick="setFilter('PAID')">
                    <i class="fas fa-dollar-sign mr-1"></i> Paid
                </div>
                <div class="filter-chip" data-filter="opensource" onclick="setFilter('opensource')">
                    <i class="fas fa-code-branch mr-1"></i> Open Source
                </div>
            </div>
            
            <div class="flex items-center justify-between">
                <p style="color: var(--text-secondary)">
                    Showing <strong id="showing-count">0</strong> of <strong id="total-count">0</strong> agents
                </p>
                <button onclick="clearFilters()" class="text-purple-600 hover:text-purple-700 font-semibold text-sm">
                    <i class="fas fa-times-circle mr-1"></i> Clear Filters
                </button>
            </div>
        </div>

        <!-- Loading State -->
        <div id="loading-state" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${Array(6).fill(0).map(() => `
                <div class="card border rounded-xl p-6">
                    <div class="skeleton h-16 w-16 rounded-xl mb-4"></div>
                    <div class="skeleton h-6 w-3/4 mb-2"></div>
                    <div class="skeleton h-4 w-full mb-2"></div>
                    <div class="skeleton h-4 w-2/3 mb-4"></div>
                    <div class="flex gap-2 mb-4">
                        <div class="skeleton h-6 w-20"></div>
                        <div class="skeleton h-6 w-16"></div>
                    </div>
                    <div class="skeleton h-10 w-full"></div>
                </div>
            `).join('')}
        </div>

        <!-- Agents Grid -->
        <div id="agents-grid" class="hidden grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Agents will be loaded here -->
        </div>

        <!-- Empty State -->
        <div id="empty-state" class="hidden empty-state">
            <i class="fas fa-search"></i>
            <h3 class="text-2xl font-bold mb-2">No agents found</h3>
            <p style="color: var(--text-secondary)">Try adjusting your filters or search query</p>
            <button onclick="clearFilters()" class="mt-4 action-button action-button-primary">
                <i class="fas fa-redo"></i> Clear Filters
            </button>
        </div>

        <!-- Related Categories -->
        <div id="related-categories" class="mt-16">
            <h2 class="text-3xl font-bold mb-6">
                <i class="fas fa-layer-group text-purple-600 mr-2"></i>
                Related Categories
            </h2>
            <div id="related-grid" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <!-- Related categories will be loaded here -->
            </div>
        </div>
    </div>

    ${getFooter()}

    <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
    <script>
        const API_BASE = '/api';
        const CATEGORY_SLUG = '${slug}';
        
        let currentCategory = null;
        let allAgents = [];
        let filteredAgents = [];
        let activeFilter = 'all';
        let searchQuery = '';
        
        // Dark Mode
        function toggleDarkMode() {
            const html = document.documentElement;
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            document.getElementById('theme-icon').className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
        
        // Mobile Menu
        function toggleMobileMenu() {
            const menu = document.getElementById('mobile-menu');
            menu.classList.toggle('hidden');
        }
        
        // Apply saved theme
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        document.getElementById('theme-icon').className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        
        // Load category and agents
        async function loadCategory() {
            try {
                // Use the category detail endpoint which now returns agents
                const response = await axios.get(API_BASE + '/categories/' + CATEGORY_SLUG);
                if (response.data.success) {
                    currentCategory = response.data.data;
                    
                    document.getElementById('page-title').textContent = currentCategory.name + ' - AI Agents Directory';
                    document.getElementById('page-description').setAttribute('content', currentCategory.description || '');
                    document.getElementById('breadcrumb-category').textContent = currentCategory.name;
                    // Handle both icon (emoji) and image_url
                    if (currentCategory.image_url) {
                        document.getElementById('category-icon-container').innerHTML = \`<img src="\${currentCategory.image_url}" alt="\${currentCategory.name}" class="w-20 h-20 object-contain" onerror="this.parentElement.innerHTML='<div class=\\\\'text-7xl\\\\'>📁</div>'">\`;
                    } else {
                        document.getElementById('category-icon').textContent = currentCategory.icon || '📁';
                    }
                    document.getElementById('category-name').textContent = currentCategory.name;
                    document.getElementById('category-description').textContent = currentCategory.description || 'Explore AI agents in this category';
                    
                    // Get agents directly from the category response
                    allAgents = currentCategory.agents || [];
                    document.getElementById('agent-count').textContent = allAgents.length;
                    
                    loadAgentsFromData();
                }
            } catch (error) {
                console.error('Error loading category:', error);
            }
        }
        
        function loadAgentsFromData() {
            try {
                if (allAgents.length > 0) {
                    // Agents already loaded from category endpoint
                    allAgents = allAgents;
                    
                    document.getElementById('total-count').textContent = allAgents.length;
                    document.getElementById('trending-count').textContent = Math.min(5, allAgents.length);
                    
                    filterAgents();
                    loadRelatedCategories();
                    
                    document.getElementById('loading-state').classList.add('hidden');
                    document.getElementById('agents-grid').classList.remove('hidden');
                }
            } catch (error) {
                console.error('Error loading agents:', error);
                document.getElementById('loading-state').classList.add('hidden');
            }
        }
        
        function setFilter(filter) {
            activeFilter = filter;
            
            // Update chips
            document.querySelectorAll('.filter-chip').forEach(chip => {
                chip.classList.remove('active');
            });
            document.querySelector(\`[data-filter="\${filter}"]\`).classList.add('active');
            
            filterAgents();
        }
        
        function filterAgents() {
            searchQuery = document.getElementById('search-input').value.toLowerCase();
            
            filteredAgents = allAgents.filter(agent => {
                // Search filter
                const matchesSearch = !searchQuery || 
                    agent.name.toLowerCase().includes(searchQuery) ||
                    agent.tagline?.toLowerCase().includes(searchQuery) ||
                    agent.description?.toLowerCase().includes(searchQuery);
                
                // Pricing filter
                const matchesFilter = activeFilter === 'all' || 
                    activeFilter === agent.pricing_model ||
                    (activeFilter === 'opensource' && agent.is_open_source);
                
                return matchesSearch && matchesFilter;
            });
            
            renderAgents();
        }
        
        function sortAgents() {
            const sortBy = document.getElementById('sort-select').value;
            
            filteredAgents.sort((a, b) => {
                switch(sortBy) {
                    case 'popular':
                        return (b.view_count || 0) - (a.view_count || 0);
                    case 'newest':
                        return new Date(b.created_at) - new Date(a.created_at);
                    case 'name':
                        return a.name.localeCompare(b.name);
                    case 'upvotes':
                        return (b.upvote_count || 0) - (a.upvote_count || 0);
                    default:
                        return 0;
                }
            });
            
            renderAgents();
        }
        
        function renderAgents() {
            const grid = document.getElementById('agents-grid');
            const emptyState = document.getElementById('empty-state');
            
            document.getElementById('showing-count').textContent = filteredAgents.length;
            
            if (filteredAgents.length === 0) {
                grid.classList.add('hidden');
                emptyState.classList.remove('hidden');
                return;
            }
            
            grid.classList.remove('hidden');
            emptyState.classList.add('hidden');
            
            grid.innerHTML = filteredAgents.map(agent => \`
                <div class="enhanced-agent-card" onclick="window.location='/agents/\${agent.slug}'">
                    <div class="agent-logo">
                        <img 
                            src="\${agent.logo_url || 'https://storage.llmdude.com/uploads/1761722667625-3falg8084x7.png'}" 
                            alt="\${agent.name}" 
                            class="w-full h-full object-contain"
                            loading="lazy"
                            onerror="this.onerror=null; this.src='https://storage.llmdude.com/uploads/1761722667625-3falg8084x7.png';"
                        />
                    </div>
                    
                    <h3 class="text-xl font-bold mb-2">\${agent.name}</h3>
                    
                    <p class="agent-description">
                        \${agent.tagline || agent.description || 'AI agent'}
                    </p>
                    
                    <div class="flex flex-wrap gap-2 mb-4">
                        \${getPricingBadge(agent.pricing_model)}
                        \${agent.verified ? '<span class="badge badge-verified"><i class="fas fa-check-circle"></i> Verified</span>' : ''}
                        \${agent.featured_tier && agent.featured_tier !== 'NONE' ? '<span class="badge badge-featured"><i class="fas fa-star"></i> Featured</span>' : ''}
                        \${agent.is_open_source ? '<span class="badge badge-opensource"><i class="fas fa-code-branch"></i> Open Source</span>' : ''}
                    </div>
                    
                    <div class="flex items-center justify-between mb-4 text-sm" style="color: var(--text-secondary)">
                        <span class="stats-badge">
                            <i class="fas fa-arrow-up"></i> \${agent.upvote_count || 0}
                        </span>
                        <span class="stats-badge">
                            <i class="fas fa-eye"></i> \${agent.view_count || 0}
                        </span>
                        <span class="stats-badge">
                            <i class="fas fa-star"></i> \${agent.review_count || 0}
                        </span>
                    </div>
                    
                    <a href="/agents/\${agent.slug}" class="action-button action-button-primary" onclick="event.stopPropagation()">
                        <i class="fas fa-arrow-right"></i>
                        View Details
                    </a>
                </div>
            \`).join('');
        }
        
        function getPricingBadge(model) {
            const badges = {
                'FREE': '<span class="badge badge-free"><i class="fas fa-gift"></i> Free</span>',
                'FREEMIUM': '<span class="badge badge-freemium"><i class="fas fa-star-half-alt"></i> Freemium</span>',
                'PAID': '<span class="badge badge-paid"><i class="fas fa-dollar-sign"></i> Paid</span>',
                'CONTACT': '<span class="badge badge-paid"><i class="fas fa-envelope"></i> Contact</span>'
            };
            return badges[model] || '';
        }
        
        function clearFilters() {
            document.getElementById('search-input').value = '';
            document.getElementById('sort-select').value = 'popular';
            setFilter('all');
        }
        
        async function loadRelatedCategories() {
            try {
                const response = await axios.get(API_BASE + '/categories');
                if (response.data.success) {
                    const related = response.data.data
                        .filter(cat => cat.id !== currentCategory.id)
                        .slice(0, 6);
                    
                    document.getElementById('related-grid').innerHTML = related.map(cat => \`
                        <a href="/categories/\${cat.slug}" class="card border rounded-xl p-4 text-center hover:shadow-lg transition">
                            <div class="text-4xl mb-2">\${cat.icon || '📁'}</div>
                            <div class="font-semibold text-sm">\${cat.name}</div>
                            <div class="text-xs mt-1" style="color: var(--text-secondary)">\${cat.agent_count || 0} agents</div>
                        </a>
                    \`).join('');
                }
            } catch (error) {
                console.error('Error loading related categories:', error);
            }
        }
        
        // Initialize
        document.addEventListener('DOMContentLoaded', loadCategory);
    </script>
</body>
</html>
`;
