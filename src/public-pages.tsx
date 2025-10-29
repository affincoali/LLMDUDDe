// Public-Facing Frontend Pages
// Modern, high-converting pages with advanced features
import { getHeader } from './components/header';
import { getFooter } from './components/footer';

export const enhancedHomepage = () => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Agents Directory - The x402-Ready AI Agents Marketplace</title>
    <meta name="description" content="Browse AI Apps capable of autonomous payments. Discover 1800+ AI agents across 72 categories.">
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        .gradient-bg {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .card-hover {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .card-hover:hover {
            transform: translateY(-8px);
            box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        }
        .scroll-container {
            display: flex;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            scrollbar-width: none;
            -ms-overflow-style: none;
        }
        .scroll-container::-webkit-scrollbar {
            display: none;
        }
        .scroll-item {
            flex: 0 0 auto;
            scroll-snap-align: start;
        }
        .skeleton {
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: loading 1.5s ease-in-out infinite;
        }
        @keyframes loading {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
        }
        .badge-glow {
            animation: glow 2s ease-in-out infinite;
        }
        @keyframes glow {
            0%, 100% { box-shadow: 0 0 5px rgba(102, 126, 234, 0.5); }
            50% { box-shadow: 0 0 20px rgba(102, 126, 234, 0.8); }
        }
        .hero-animation {
            animation: fadeInUp 0.8s ease-out;
        }
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    </style>
</head>
<body class="bg-gray-50">
    ${getHeader('home')}

    <!-- Hero Section -->
    <div class="gradient-bg text-white py-20 lg:py-28 hero-animation">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center max-w-4xl mx-auto">
                <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                    The x402-Ready AI Agents Marketplace
                </h1>
                <p class="text-xl md:text-2xl mb-8 text-gray-100">
                    Browse AI Apps capable of autonomous payments, seamless integrations, and intelligent automation
                </p>
                
                <!-- Search Bar -->
                <div class="max-w-2xl mx-auto mb-8">
                    <div class="relative">
                        <input 
                            type="text" 
                            id="hero-search"
                            placeholder="Search for AI agents, tools, or categories..." 
                            class="w-full px-6 py-4 pr-14 rounded-full text-gray-900 focus:outline-none focus:ring-4 focus:ring-purple-300 shadow-xl text-base"
                            autocomplete="off"
                        >
                        <button 
                            onclick="performSearch()"
                            class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-purple-600 text-white w-10 h-10 rounded-full hover:bg-purple-700 transition flex items-center justify-center"
                        >
                            <i class="fas fa-search"></i>
                        </button>
                    </div>
                    <!-- Search Results Dropdown -->
                    <div id="search-results" class="hidden mt-3 bg-white rounded-xl shadow-2xl text-left max-h-96 overflow-y-auto border border-gray-200 z-50">
                        <!-- Results will be inserted here -->
                    </div>
                </div>

                <!-- Quick Stats -->
                <div class="flex flex-wrap justify-center gap-6 text-sm md:text-base">
                    <div class="flex items-center space-x-2">
                        <i class="fas fa-robot text-2xl"></i>
                        <span id="stat-agents" class="font-semibold">Loading...</span>
                        <span class="opacity-90">Agents</span>
                    </div>
                    <div class="flex items-center space-x-2">
                        <i class="fas fa-folder text-2xl"></i>
                        <span id="stat-categories" class="font-semibold">Loading...</span>
                        <span class="opacity-90">Categories</span>
                    </div>
                    <div class="flex items-center space-x-2">
                        <i class="fas fa-gift text-2xl"></i>
                        <span id="stat-free" class="font-semibold">Loading...</span>
                        <span class="opacity-90">Free</span>
                    </div>
                    <div class="flex items-center space-x-2">
                        <i class="fas fa-code text-2xl"></i>
                        <span id="stat-opensource" class="font-semibold">Loading...</span>
                        <span class="opacity-90">Open Source</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Newly Added Section -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="flex justify-between items-center mb-8">
            <h2 class="text-3xl font-bold text-gray-900 flex items-center">
                <i class="fas fa-sparkles text-purple-600 mr-3"></i>
                Newly Added
            </h2>
            <a href="/agents?sort=newest" class="text-purple-600 font-semibold hover:text-purple-700 transition">
                View All <i class="fas fa-arrow-right ml-1"></i>
            </a>
        </div>
        
        <div class="relative">
            <div id="newly-added-container" class="scroll-container space-x-6 pb-4">
                <!-- Loading Skeletons -->
                <div class="scroll-item w-80 h-80 bg-gray-200 rounded-lg skeleton"></div>
                <div class="scroll-item w-80 h-80 bg-gray-200 rounded-lg skeleton"></div>
                <div class="scroll-item w-80 h-80 bg-gray-200 rounded-lg skeleton"></div>
            </div>
            <button onclick="scrollLeft('newly-added-container')" class="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition">
                <i class="fas fa-chevron-left text-purple-600"></i>
            </button>
            <button onclick="scrollRight('newly-added-container')" class="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition">
                <i class="fas fa-chevron-right text-purple-600"></i>
            </button>
        </div>
    </div>

    <!-- Trending Section -->
    <div class="bg-white py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center mb-8">
                <h2 class="text-3xl font-bold text-gray-900 flex items-center">
                    <i class="fas fa-fire text-orange-500 mr-3"></i>
                    Trending This Week
                </h2>
                <a href="/agents?sort=trending" class="text-purple-600 font-semibold hover:text-purple-700 transition">
                    View All <i class="fas fa-arrow-right ml-1"></i>
                </a>
            </div>
            
            <div class="relative">
                <div id="trending-container" class="scroll-container space-x-6 pb-4">
                    <!-- Loading Skeletons -->
                    <div class="scroll-item w-80 h-80 bg-gray-200 rounded-lg skeleton"></div>
                    <div class="scroll-item w-80 h-80 bg-gray-200 rounded-lg skeleton"></div>
                    <div class="scroll-item w-80 h-80 bg-gray-200 rounded-lg skeleton"></div>
                </div>
                <button onclick="scrollLeft('trending-container')" class="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition">
                    <i class="fas fa-chevron-left text-purple-600"></i>
                </button>
                <button onclick="scrollRight('trending-container')" class="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition">
                    <i class="fas fa-chevron-right text-purple-600"></i>
                </button>
            </div>
        </div>
    </div>

    <!-- Popular Categories Grid -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="text-center mb-12">
            <h2 class="text-3xl font-bold text-gray-900 mb-3">
                <i class="fas fa-th text-purple-600 mr-3"></i>
                Popular Categories
            </h2>
            <p class="text-gray-600">Explore AI agents by category</p>
        </div>
        
        <div id="categories-grid" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <!-- Loading Skeletons -->
            ${Array(12).fill(0).map(() => '<div class="h-32 bg-gray-200 rounded-lg skeleton"></div>').join('')}
        </div>
    </div>

    <!-- Newsletter Section -->
    <div class="bg-gradient-to-br from-purple-600 to-indigo-700 text-white py-16">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <i class="fas fa-envelope text-5xl mb-6 opacity-90"></i>
            <h2 class="text-3xl md:text-4xl font-bold mb-4">
                Stay Ahead of the Curve
            </h2>
            <p class="text-xl mb-8 opacity-90">
                Get weekly updates on the latest AI agents and tools
            </p>
            
            <form id="newsletter-form" class="max-w-md mx-auto">
                <div class="flex gap-3">
                    <input 
                        type="email" 
                        id="newsletter-email"
                        placeholder="Enter your email" 
                        required
                        class="flex-1 px-6 py-4 rounded-lg text-gray-900 focus:outline-none focus:ring-4 focus:ring-purple-300"
                    >
                    <button 
                        type="submit"
                        class="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition whitespace-nowrap"
                    >
                        Subscribe
                    </button>
                </div>
            </form>
            
            <div id="newsletter-message" class="hidden mt-4 p-4 rounded-lg"></div>
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
                <p class="text-sm text-gray-500">admin@aiagents.directory / admin123</p>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
    <script>
        const API_BASE = '/api';
        let searchTimeout = null;

        // Load enhanced stats
        async function loadStats() {
            try {
                const response = await axios.get(API_BASE + '/agents/stats');
                if (response.data.success) {
                    const stats = response.data.data;
                    document.getElementById('stat-agents').textContent = stats.total_agents || 0;
                    document.getElementById('stat-categories').textContent = stats.total_categories || 0;
                    
                    // Calculate free and open source from agents
                    const agentsResponse = await axios.get(API_BASE + '/agents?status=APPROVED&limit=1000');
                    if (agentsResponse.data.success) {
                        const agents = agentsResponse.data.data;
                        const freeCount = agents.filter(a => a.pricing_model === 'FREE' || a.pricing_model === 'FREEMIUM').length;
                        const osCount = agents.filter(a => a.is_open_source).length;
                        document.getElementById('stat-free').textContent = freeCount;
                        document.getElementById('stat-opensource').textContent = osCount;
                    }
                }
            } catch (error) {
                console.error('Error loading stats:', error);
            }
        }

        // Load newly added agents
        async function loadNewlyAdded() {
            try {
                const response = await axios.get(API_BASE + '/public/newly-added?limit=6');
                if (response.data.success) {
                    const agents = response.data.data;
                    const container = document.getElementById('newly-added-container');
                    container.innerHTML = agents.map(agent => createAgentCard(agent)).join('');
                }
            } catch (error) {
                console.error('Error loading newly added:', error);
            }
        }

        // Load trending agents
        async function loadTrending() {
            try {
                const response = await axios.get(API_BASE + '/public/trending?limit=6');
                if (response.data.success) {
                    const agents = response.data.data;
                    const container = document.getElementById('trending-container');
                    container.innerHTML = agents.map(agent => createAgentCard(agent)).join('');
                }
            } catch (error) {
                console.error('Error loading trending:', error);
            }
        }

        // Load popular categories
        async function loadCategories() {
            try {
                const response = await axios.get(API_BASE + '/public/categories/popular?limit=12');
                if (response.data.success) {
                    const categories = response.data.data;
                    const grid = document.getElementById('categories-grid');
                    grid.innerHTML = categories.map((cat, index) => {
                        const imageOrIcon = cat.image_url 
                            ? \`<img src="\${cat.image_url}" alt="\${cat.name}" class="w-16 h-16 object-cover rounded-lg" loading="lazy" onerror="this.outerHTML='<div class=\\'text-4xl\\'>\${cat.icon || '📁'}</div>'">\`
                            : \`<div class="text-4xl">\${cat.icon || '📁'}</div>\`;
                        
                        return \`
                        <a href="/categories/\${cat.slug}" class="bg-white rounded-lg p-6 hover:shadow-xl transition card-hover border-2 border-gray-100">
                            <div class="flex items-center justify-between mb-3">
                                \${imageOrIcon}
                                \${index < 3 ? \`<div class="text-2xl">\${['🥇','🥈','🥉'][index]}</div>\` : ''}
                            </div>
                            <h3 class="font-bold text-gray-900 mb-1">\${cat.name}</h3>
                            <div class="flex items-center justify-between text-sm">
                                <span class="text-gray-600">\${cat.agent_count} agents</span>
                                \${cat.recent_additions > 0 ? \`<span class="text-green-600 badge-glow px-2 py-1 bg-green-100 rounded">+\${cat.recent_additions} new</span>\` : ''}
                            </div>
                        </a>
                        \`;
                    }).join('');
                }
            } catch (error) {
                console.error('Error loading categories:', error);
            }
        }

        // Create agent card HTML
        function createAgentCard(agent) {
            const logoHtml = agent.logo_url 
                ? \`<img src="\${agent.logo_url}" alt="\${agent.name}" loading="lazy" class="w-full h-full object-contain p-4" 
                        onerror="this.onerror=null; this.src='https://storage.llmdude.com/uploads/1761722667625-3falg8084x7.png';">\`
                : \`<img src="https://storage.llmdude.com/uploads/1761722667625-3falg8084x7.png" alt="\${agent.name}" loading="lazy" class="w-full h-full object-contain p-4">\`;
            
            return \`
                <div class="scroll-item w-80 bg-white rounded-lg shadow-md overflow-hidden card-hover cursor-pointer" onclick="window.location='/agents/\${agent.slug}'">
                    <div class="h-48 bg-white flex items-center justify-center overflow-hidden">
                        \${logoHtml}
                    </div>
                    <div class="p-6">
                        <h3 class="text-xl font-bold text-gray-900 mb-2 truncate">\${agent.name}</h3>
                        <p class="text-gray-600 text-sm mb-4 h-10 overflow-hidden">\${agent.tagline || ''}</p>
                        <div class="flex items-center justify-between mb-3">
                            <span class="px-3 py-1 bg-purple-100 text-purple-600 text-xs font-semibold rounded-full">
                                \${agent.pricing_model}
                            </span>
                            \${agent.is_open_source ? '<span class="text-xs text-green-600"><i class="fas fa-code"></i> Open Source</span>' : ''}
                        </div>
                        <div class="flex items-center justify-between text-sm text-gray-500">
                            <span><i class="fas fa-eye text-purple-600"></i> \${agent.view_count || 0}</span>
                            <span><i class="fas fa-arrow-up text-purple-600"></i> \${agent.upvote_count || 0}</span>
                        </div>
                    </div>
                </div>
            \`;
        }

        // Search functionality - real-time as user types
        document.getElementById('hero-search').addEventListener('input', (e) => {
            const query = e.target.value.trim();
            
            clearTimeout(searchTimeout);
            
            if (query.length < 2) {
                document.getElementById('search-results').classList.add('hidden');
                return;
            }
            
            searchTimeout = setTimeout(async () => {
                await performSearchQuery(query);
            }, 300);
        });

        // Search on Enter key
        document.getElementById('hero-search').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch();
            }
        });

        // Perform search function
        async function performSearch() {
            const query = document.getElementById('hero-search').value.trim();
            if (query.length >= 2) {
                await performSearchQuery(query);
            }
        }

        // Search query function
        async function performSearchQuery(query) {
            try {
                const response = await axios.get(API_BASE + '/public/search?q=' + encodeURIComponent(query) + '&limit=10');
                if (response.data.success) {
                    const results = response.data.data;
                    const resultsDiv = document.getElementById('search-results');
                    
                    if (results.length === 0) {
                        resultsDiv.innerHTML = \`
                            <div class="p-6 text-center">
                                <i class="fas fa-search text-4xl text-gray-300 mb-3"></i>
                                <p class="text-gray-500">No results found for "\${query}"</p>
                                <p class="text-sm text-gray-400 mt-2">Try different keywords</p>
                            </div>
                        \`;
                    } else {
                        resultsDiv.innerHTML = \`
                            <div class="p-3 bg-gray-50 border-b border-gray-200">
                                <p class="text-sm font-semibold text-gray-700">Found \${results.length} result\${results.length !== 1 ? 's' : ''}</p>
                            </div>
                        \` + results.map(agent => {
                            const logoHtml = agent.logo_url 
                                ? \`<img src="\${agent.logo_url}" alt="\${agent.name}" loading="lazy" class="w-12 h-12 rounded-lg object-contain" 
                                        onerror="this.onerror=null; this.src='https://storage.llmdude.com/uploads/1761722667625-3falg8084x7.png';">\`
                                : \`<img src="https://storage.llmdude.com/uploads/1761722667625-3falg8084x7.png" alt="\${agent.name}" loading="lazy" class="w-12 h-12 rounded-lg object-contain">\`;
                            
                            return \`
                            <a href="/agents/\${agent.slug}" class="flex items-center p-4 hover:bg-purple-50 transition border-b border-gray-100 last:border-b-0 cursor-pointer">
                                <div class="mr-4 flex-shrink-0 bg-white p-1 rounded-lg">
                                    \${logoHtml}
                                </div>
                                <div class="flex-1 min-w-0">
                                    <div class="font-semibold text-gray-900 mb-1">\${agent.name}</div>
                                    <div class="text-sm text-gray-600 truncate">\${agent.tagline || 'No description available'}</div>
                                    <div class="flex items-center gap-3 mt-2 text-xs text-gray-500">
                                        <span><i class="fas fa-eye text-purple-600"></i> \${agent.view_count || 0}</span>
                                        <span><i class="fas fa-arrow-up text-purple-600"></i> \${agent.upvote_count || 0}</span>
                                    </div>
                                </div>
                                <span class="text-xs bg-purple-100 text-purple-600 px-3 py-1 rounded-full font-semibold ml-3 flex-shrink-0">\${agent.pricing_model || 'N/A'}</span>
                            </a>
                        \`;
                        }).join('');
                    }
                    
                    resultsDiv.classList.remove('hidden');
                }
            } catch (error) {
                console.error('Search error:', error);
                const resultsDiv = document.getElementById('search-results');
                resultsDiv.innerHTML = \`
                    <div class="p-6 text-center">
                        <i class="fas fa-exclamation-triangle text-4xl text-red-300 mb-3"></i>
                        <p class="text-red-500">Search failed</p>
                        <p class="text-sm text-gray-500 mt-2">Please try again</p>
                    </div>
                \`;
                resultsDiv.classList.remove('hidden');
            }
        }

        // Newsletter subscription
        document.getElementById('newsletter-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('newsletter-email').value;
            const messageDiv = document.getElementById('newsletter-message');
            
            try {
                const response = await axios.post(API_BASE + '/public/newsletter/subscribe', { email });
                if (response.data.success) {
                    messageDiv.className = 'mt-4 p-4 rounded-lg bg-white text-green-600';
                    messageDiv.textContent = response.data.message;
                    document.getElementById('newsletter-form').reset();
                } else {
                    messageDiv.className = 'mt-4 p-4 rounded-lg bg-white text-red-600';
                    messageDiv.textContent = response.data.error || 'Subscription failed';
                }
                messageDiv.classList.remove('hidden');
                setTimeout(() => messageDiv.classList.add('hidden'), 5000);
            } catch (error) {
                messageDiv.className = 'mt-4 p-4 rounded-lg bg-white text-red-600';
                messageDiv.textContent = 'Subscription failed. Please try again.';
                messageDiv.classList.remove('hidden');
            }
        });

        // Scroll functions
        function scrollLeft(containerId) {
            const container = document.getElementById(containerId);
            container.scrollBy({ left: -400, behavior: 'smooth' });
        }

        function scrollRight(containerId) {
            const container = document.getElementById(containerId);
            container.scrollBy({ left: 400, behavior: 'smooth' });
        }

        // Login functions
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
                    localStorage.setItem('auth_token', response.data.data.token);
                    alert('Login successful!');
                    hideLogin();
                    window.location.href = '/admin';
                }
            } catch (error) {
                alert('Login failed: ' + (error.response?.data?.error || 'Unknown error'));
            }
        }

        // Hide search results when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('#hero-search') && !e.target.closest('#search-results')) {
                document.getElementById('search-results').classList.add('hidden');
            }
        });

        // Initialize page
        document.addEventListener('DOMContentLoaded', () => {
            loadStats();
            loadNewlyAdded();
            loadTrending();
            loadCategories();
        });
    </script>

    ${getFooter()}

</body>
</html>
`;
