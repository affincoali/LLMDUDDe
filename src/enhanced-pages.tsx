// Enhanced Pages - Categories Main, Leaderboard, and Landscape
import { getHeader } from './components/header';

export const enhancedCategoriesPage = () => `
<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Agents Categories - Browse 72 Categories | AI Agents Directory</title>
    <meta name="description" content="Explore collection of AI agent categories, tailored for various applications. Discover 1832+ AI agents across 72 categories.">
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
      
      * {
        transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
      }
      
      body {
        background-color: var(--bg-secondary);
        color: var(--text-primary);
      }
      
      .card {
        background-color: var(--card-bg);
        border-color: var(--border-color);
      }
      
      .stat-card {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        transition: transform 0.3s ease;
      }
      
      .stat-card:hover {
        transform: translateY(-4px);
      }
      
      .category-card {
        transition: all 0.3s ease;
        cursor: pointer;
        position: relative;
      }
      
      .category-card:hover {
        transform: translateY(-8px);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
      }
      
      [data-theme="dark"] .category-card:hover {
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
      }
      
      .medal {
        position: absolute;
        top: -10px;
        right: -10px;
        font-size: 2rem;
        animation: bounce 2s infinite;
      }
      
      @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
      
      .growth-badge {
        display: inline-flex;
        align-items: center;
        padding: 4px 8px;
        background-color: #10b981;
        color: white;
        border-radius: 9999px;
        font-size: 0.75rem;
        font-weight: 600;
      }
      
      .skeleton {
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: loading 1.5s infinite;
      }
      
      [data-theme="dark"] .skeleton {
        background: linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%);
        background-size: 200% 100%;
      }
      
      @keyframes loading {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
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
                    <a href="/leaderboard" class="hover:text-purple-600">Leaderboard</a>
                    <a href="/landscape" class="hover:text-purple-600">Landscape</a>
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
                <a href="/leaderboard" class="block py-2 hover:text-purple-600">Leaderboard</a>
                <a href="/landscape" class="block py-2 hover:text-purple-600">Landscape</a>
                <a href="/submit" class="block py-2 hover:text-purple-600">Submit</a>
            </div>
        </div>
    </nav>

    <!-- Header -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="text-center mb-12">
            <h1 class="text-5xl md:text-6xl font-bold mb-6">
                AI Agents Categories
            </h1>
            <p class="text-xl md:text-2xl mb-8" style="color: var(--text-secondary)">
                Explore collection of AI agent categories, tailored for various applications
            </p>
            
            <!-- Search Input -->
            <div class="max-w-2xl mx-auto">
                <div class="relative">
                    <input 
                        type="text" 
                        id="search-input" 
                        placeholder="Search categories..." 
                        class="card w-full px-6 py-4 pl-14 rounded-xl border focus:ring-2 focus:ring-purple-600 focus:border-transparent text-lg"
                        style="color: var(--text-primary)"
                        oninput="searchCategories()"
                    />
                    <i class="fas fa-search absolute left-5 top-5 text-gray-400 text-xl"></i>
                </div>
            </div>
        </div>
        
        <!-- Live Stats Cards -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            <div class="stat-card rounded-xl p-6 text-center">
                <div class="text-4xl font-bold mb-2" id="stat-total-agents">1832</div>
                <div class="text-sm opacity-90 mb-1">Total Agents</div>
                <div class="text-xs opacity-75" id="stat-agents-growth">+39 in 30d</div>
            </div>
            
            <div class="stat-card rounded-xl p-6 text-center" style="background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)">
                <div class="text-4xl font-bold mb-2" id="stat-categories">72</div>
                <div class="text-sm opacity-90">Categories</div>
            </div>
            
            <div class="stat-card rounded-xl p-6 text-center" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%)">
                <div class="text-4xl font-bold mb-2" id="stat-free">458</div>
                <div class="text-sm opacity-90 mb-1">Free Agents</div>
                <div class="text-xs opacity-75" id="stat-free-percent">25%</div>
            </div>
            
            <div class="stat-card rounded-xl p-6 text-center" style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)">
                <div class="text-4xl font-bold mb-2" id="stat-opensource">490</div>
                <div class="text-sm opacity-90 mb-1">Open Source</div>
                <div class="text-xs opacity-75" id="stat-opensource-percent">27%</div>
            </div>
        </div>
        
        <!-- Sort Options -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div class="text-lg font-semibold">
                <span id="category-count">Loading...</span> Categories
            </div>
            
            <select 
                id="sort-select" 
                class="card px-4 py-2 rounded-lg border focus:ring-2 focus:ring-purple-600"
                style="color: var(--text-primary)"
                onchange="sortCategories()"
            >
                <option value="most-agents">Most Agents</option>
                <option value="alphabetical">Alphabetical (A-Z)</option>
                <option value="newest">Newest</option>
            </select>
        </div>
        
        <!-- Categories Grid -->
        <div id="categories-container" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
            <!-- Skeleton Loaders -->
            ${Array(12).fill(0).map(() => `
                <div class="card border rounded-xl p-6 skeleton">
                    <div class="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-4"></div>
                    <div class="h-6 bg-gray-300 rounded mb-2"></div>
                    <div class="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
                </div>
            `).join('')}
        </div>
        
        <!-- CTAs -->
        <div class="grid md:grid-cols-2 gap-6 mb-16">
            <div class="card border rounded-xl p-8 text-center hover:shadow-lg transition">
                <i class="fas fa-magic text-5xl text-purple-600 mb-4"></i>
                <h3 class="text-2xl font-bold mb-3">Need Custom AI Agent?</h3>
                <p class="mb-6" style="color: var(--text-secondary)">
                    Can't find what you're looking for? Request a custom AI agent tailored to your needs.
                </p>
                <a href="/request" class="inline-block bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700">
                    Request Agent
                </a>
            </div>
            
            <div class="card border rounded-xl p-8 text-center hover:shadow-lg transition">
                <i class="fas fa-plus-circle text-5xl text-green-600 mb-4"></i>
                <h3 class="text-2xl font-bold mb-3">Have an AI Agent?</h3>
                <p class="mb-6" style="color: var(--text-secondary)">
                    Share your AI agent with the community and reach thousands of potential users.
                </p>
                <a href="/submit" class="inline-block bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700">
                    Submit Agent
                </a>
            </div>
        </div>
        
        <!-- SEO Content -->
        <div class="card border rounded-xl p-8">
            <h2 class="text-3xl font-bold mb-6">Why Browse AI Agents by Category?</h2>
            
            <div class="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                    <h3 class="text-xl font-semibold mb-3">
                        <i class="fas fa-check-circle text-green-600 mr-2"></i>
                        Find What You Need Faster
                    </h3>
                    <p style="color: var(--text-secondary)">
                        Our 72 carefully curated categories help you discover the perfect AI agent for your specific use case. 
                        From code assistants to content creators, find specialized tools in seconds.
                    </p>
                </div>
                
                <div>
                    <h3 class="text-xl font-semibold mb-3">
                        <i class="fas fa-lightbulb text-yellow-600 mr-2"></i>
                        Discover New Possibilities
                    </h3>
                    <p style="color: var(--text-secondary)">
                        Explore categories you haven't considered before. Each category showcases innovative AI agents 
                        that might inspire new workflows and solutions for your projects.
                    </p>
                </div>
                
                <div>
                    <h3 class="text-xl font-semibold mb-3">
                        <i class="fas fa-users text-blue-600 mr-2"></i>
                        Community Validated
                    </h3>
                    <p style="color: var(--text-secondary)">
                        All agents are reviewed by our community. Browse by category to see the most popular and 
                        highly-rated tools in each space, backed by real user reviews.
                    </p>
                </div>
                
                <div>
                    <h3 class="text-xl font-semibold mb-3">
                        <i class="fas fa-chart-line text-purple-600 mr-2"></i>
                        Stay Updated
                    </h3>
                    <p style="color: var(--text-secondary)">
                        See growth indicators for each category. Discover trending categories and emerging AI tools 
                        before they become mainstream.
                    </p>
                </div>
            </div>
            
            <div class="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6">
                <h3 class="text-xl font-semibold mb-3">Popular Categories</h3>
                <p style="color: var(--text-secondary)" class="mb-4">
                    Our most active categories include Code Assistants, Content Creation, Data Analysis, 
                    Customer Support, and Marketing Tools. Each category features dozens of specialized 
                    AI agents with unique capabilities and pricing models.
                </p>
                <p style="color: var(--text-secondary)">
                    Whether you're looking for free open-source tools or premium enterprise solutions, 
                    our category system makes it easy to compare options and find the best fit for your needs.
                </p>
            </div>
        </div>
    </div>
    
    <!-- Footer -->
    <footer class="card border-t mt-20 py-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center" style="color: var(--text-secondary)">
            <p>&copy; 2024 AI Agents Directory. All rights reserved.</p>
        </div>
    </footer>

    <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
    <script>
      const API_BASE = '/api';
      let allCategories = [];
      let filteredCategories = [];
      
      // Dark Mode
      function toggleDarkMode() {
        const html = document.documentElement;
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        const icon = document.getElementById('theme-icon');
        icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
      }
      
      function initTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        const icon = document.getElementById('theme-icon');
        icon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
      }
      
      function toggleMobileMenu() {
        const menu = document.getElementById('mobile-menu');
        menu.classList.toggle('hidden');
      }
      
      // Load Stats
      async function loadStats() {
        try {
          const response = await axios.get(\`\${API_BASE}/public/stats\`);
          if (response.data.success) {
            const stats = response.data.data;
            document.getElementById('stat-total-agents').textContent = stats.total_agents || 1832;
            document.getElementById('stat-categories').textContent = stats.total_categories || 72;
            
            // Calculate free and open source percentages
            const freeCount = Math.round((stats.total_agents || 1832) * 0.25);
            const osCount = Math.round((stats.total_agents || 1832) * 0.27);
            
            document.getElementById('stat-free').textContent = freeCount;
            document.getElementById('stat-free-percent').textContent = '25%';
            document.getElementById('stat-opensource').textContent = osCount;
            document.getElementById('stat-opensource-percent').textContent = '27%';
          }
        } catch (error) {
          console.error('Error loading stats:', error);
        }
      }
      
      // Load Categories
      async function loadCategories() {
        try {
          const response = await axios.get(\`\${API_BASE}/categories\`);
          
          if (response.data.success) {
            allCategories = response.data.data;
            filteredCategories = [...allCategories];
            renderCategories();
          }
        } catch (error) {
          console.error('Error loading categories:', error);
        }
      }
      
      // Render Categories
      function renderCategories() {
        const container = document.getElementById('categories-container');
        document.getElementById('category-count').textContent = filteredCategories.length;
        
        if (filteredCategories.length === 0) {
          container.innerHTML = \`
            <div class="col-span-full text-center py-12">
              <i class="fas fa-search text-6xl mb-4" style="color: var(--text-secondary)"></i>
              <p class="text-xl" style="color: var(--text-secondary)">No categories found</p>
            </div>
          \`;
          return;
        }
        
        container.innerHTML = filteredCategories.map((cat, index) => createCategoryCard(cat, index)).join('');
      }
      
      // Create Category Card
      function createCategoryCard(category, index) {
        const agentCount = category.agent_count || 0;
        const growth = category.growth_30d || 0;
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';
        
        return \`
          <div class="card category-card border rounded-xl p-6 text-center relative" onclick="window.location='/categories/\${category.slug}'">
            \${medal ? \`<div class="medal">\${medal}</div>\` : ''}
            
            <div class="text-6xl mb-4">
              \${category.icon || '📁'}
            </div>
            
            <h3 class="text-xl font-bold mb-2">\${category.name}</h3>
            
            <p class="text-sm mb-4" style="color: var(--text-secondary)">
              \${category.description || 'Explore AI agents in this category'}
            </p>
            
            <div class="flex justify-center items-center gap-3 mb-3">
              <span class="font-bold text-2xl text-purple-600">\${agentCount}</span>
              <span class="text-sm" style="color: var(--text-secondary)">agents</span>
            </div>
            
            \${growth > 0 ? \`
              <div class="growth-badge">
                <i class="fas fa-arrow-up mr-1"></i>
                +\${growth} in 30d
              </div>
            \` : ''}
          </div>
        \`;
      }
      
      // Search Categories
      function searchCategories() {
        const searchTerm = document.getElementById('search-input').value.toLowerCase();
        
        if (searchTerm === '') {
          filteredCategories = [...allCategories];
        } else {
          filteredCategories = allCategories.filter(cat => 
            cat.name.toLowerCase().includes(searchTerm) ||
            (cat.description && cat.description.toLowerCase().includes(searchTerm))
          );
        }
        
        sortCategories();
      }
      
      // Sort Categories
      function sortCategories() {
        const sortValue = document.getElementById('sort-select').value;
        
        switch(sortValue) {
          case 'most-agents':
            filteredCategories.sort((a, b) => (b.agent_count || 0) - (a.agent_count || 0));
            break;
          case 'alphabetical':
            filteredCategories.sort((a, b) => a.name.localeCompare(b.name));
            break;
          case 'newest':
            filteredCategories.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            break;
        }
        
        renderCategories();
      }
      
      // Initialize
      document.addEventListener('DOMContentLoaded', () => {
        initTheme();
        loadStats();
        loadCategories();
      });
    </script>
</body>
</html>
`;

export const leaderboardPage = () => `
<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Agents Leaderboard 2025 - Top Rated & Most Popular | AI Agents Directory</title>
    <meta name="description" content="Discover the most popular and trending AI agents based on views, upvotes, and verified user reviews. Updated daily.">
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
        background-color: var(--bg-secondary);
        color: var(--text-primary);
      }
      
      .card {
        background-color: var(--card-bg);
        border-color: var(--border-color);
      }
      
      .tab {
        padding: 12px 24px;
        cursor: pointer;
        border-bottom: 3px solid transparent;
        transition: all 0.3s;
      }
      
      .tab:hover {
        background-color: var(--hover-bg, #f3f4f6);
      }
      
      .tab.active {
        border-bottom-color: #8b5cf6;
        color: #8b5cf6;
        font-weight: 600;
      }
      
      .rank-medal {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        font-weight: bold;
        font-size: 1.125rem;
      }
      
      .rank-1 { background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%); color: #000; }
      .rank-2 { background: linear-gradient(135deg, #c0c0c0 0%, #e8e8e8 100%); color: #000; }
      .rank-3 { background: linear-gradient(135deg, #cd7f32 0%, #e8a57c 100%); color: #fff; }
      
      .leaderboard-row {
        transition: all 0.3s;
        cursor: pointer;
      }
      
      .leaderboard-row:hover {
        background-color: var(--hover-bg, #f9fafb);
        transform: translateX(4px);
      }
      
      .skeleton {
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: loading 1.5s infinite;
      }
      
      [data-theme="dark"] .skeleton {
        background: linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%);
      }
      
      @keyframes loading {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
      
      .change-up { color: #10b981; }
      .change-down { color: #ef4444; }
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
                    <a href="/categories" class="hover:text-purple-600">Categories</a>
                    <a href="/leaderboard" class="text-purple-600 font-semibold">Leaderboard</a>
                    <a href="/landscape" class="hover:text-purple-600">Landscape</a>
                    <a href="/submit" class="hover:text-purple-600">Submit</a>
                    <button onclick="toggleDarkMode()" class="p-2 rounded-lg">
                        <i id="theme-icon" class="fas fa-moon"></i>
                    </button>
                </div>
                
                <button class="md:hidden p-2" onclick="toggleMobileMenu()">
                    <i class="fas fa-bars text-xl"></i>
                </button>
            </div>
            
            <div id="mobile-menu" class="hidden md:hidden pb-4">
                <a href="/" class="block py-2">Home</a>
                <a href="/agents" class="block py-2">Agents</a>
                <a href="/categories" class="block py-2">Categories</a>
                <a href="/leaderboard" class="block py-2 text-purple-600 font-semibold">Leaderboard</a>
                <a href="/landscape" class="block py-2">Landscape</a>
                <a href="/submit" class="block py-2">Submit</a>
            </div>
        </div>
    </nav>

    <!-- Header -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="text-center mb-12">
            <h1 class="text-5xl md:text-6xl font-bold mb-6">
                <i class="fas fa-trophy text-yellow-500 mr-3"></i>
                AI Agents Leaderboard 2025
            </h1>
            <p class="text-xl md:text-2xl mb-4" style="color: var(--text-secondary)">
                Discover the most popular and trending AI agents based on views, upvotes, and verified user reviews
            </p>
            <p class="text-sm" style="color: var(--text-secondary)">
                <i class="fas fa-sync-alt mr-2"></i>
                Last updated: <span id="last-updated">Today</span>
            </p>
        </div>
        
        <!-- Filters -->
        <div class="card border rounded-xl p-6 mb-8">
            <div class="flex flex-col md:flex-row gap-4">
                <div class="flex-1">
                    <label class="block text-sm font-medium mb-2">Time Range</label>
                    <select id="time-range" class="card w-full px-4 py-2 rounded-lg border" onchange="loadLeaderboard()">
                        <option value="all">All Time</option>
                        <option value="30d">Last 30 Days</option>
                        <option value="7d">Last 7 Days</option>
                    </select>
                </div>
                
                <div class="flex-1">
                    <label class="block text-sm font-medium mb-2">Category</label>
                    <select id="category-filter" class="card w-full px-4 py-2 rounded-lg border" onchange="loadLeaderboard()">
                        <option value="">All Categories</option>
                    </select>
                </div>
            </div>
        </div>
        
        <!-- Tabs -->
        <div class="card border rounded-xl overflow-hidden mb-8">
            <div class="flex border-b" style="border-color: var(--border-color)">
                <div class="tab active" data-tab="views" onclick="switchTab('views')">
                    <i class="fas fa-eye mr-2"></i>
                    View Leaders
                </div>
                <div class="tab" data-tab="upvotes" onclick="switchTab('upvotes')">
                    <i class="fas fa-arrow-up mr-2"></i>
                    Upvote Leaders
                </div>
                <div class="tab" data-tab="reviews" onclick="switchTab('reviews')">
                    <i class="fas fa-star mr-2"></i>
                    Review Leaders
                </div>
            </div>
            
            <!-- Tab Content -->
            <div id="tab-content" class="p-6">
                <!-- Loading State -->
                <div id="loading-state" class="space-y-4">
                    ${Array(10).fill(0).map(() => `
                        <div class="flex items-center gap-4 p-4 border rounded-lg skeleton">
                            <div class="w-12 h-12 bg-gray-300 rounded-full"></div>
                            <div class="w-16 h-16 bg-gray-300 rounded-lg"></div>
                            <div class="flex-1">
                                <div class="h-6 bg-gray-300 rounded mb-2 w-1/3"></div>
                                <div class="h-4 bg-gray-300 rounded w-1/2"></div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <!-- Leaderboard Table -->
                <div id="leaderboard-table" class="hidden">
                    <!-- Will be populated by JS -->
                </div>
            </div>
        </div>
        
        <!-- SEO Content -->
        <div class="card border rounded-xl p-8">
            <h2 class="text-3xl font-bold mb-6">About the AI Agents Leaderboard</h2>
            
            <div class="grid md:grid-cols-3 gap-6 mb-8">
                <div>
                    <h3 class="text-xl font-semibold mb-3">
                        <i class="fas fa-eye text-blue-600 mr-2"></i>
                        View Leaders
                    </h3>
                    <p style="color: var(--text-secondary)">
                        Ranked by total page views, showing which AI agents are getting the most attention 
                        from our community. Higher views indicate strong interest and discovery.
                    </p>
                </div>
                
                <div>
                    <h3 class="text-xl font-semibold mb-3">
                        <i class="fas fa-arrow-up text-purple-600 mr-2"></i>
                        Upvote Leaders
                    </h3>
                    <p style="color: var(--text-secondary)">
                        Sorted by upvote count, representing community endorsement. More upvotes mean 
                        users find the tool valuable and worth recommending to others.
                    </p>
                </div>
                
                <div>
                    <h3 class="text-xl font-semibold mb-3">
                        <i class="fas fa-star text-yellow-600 mr-2"></i>
                        Review Leaders
                    </h3>
                    <p style="color: var(--text-secondary)">
                        Based on the number of verified user reviews. Agents with more reviews have 
                        been extensively tested by the community with detailed feedback.
                    </p>
                </div>
            </div>
            
            <div class="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6">
                <h3 class="text-xl font-semibold mb-3">How Rankings Are Calculated</h3>
                <p style="color: var(--text-secondary)" class="mb-4">
                    Our leaderboard is updated daily based on real user interactions. We track views, 
                    upvotes, and reviews to provide an accurate picture of which AI agents are truly 
                    making an impact in the community.
                </p>
                <p style="color: var(--text-secondary)">
                    Use the time range filter to discover rising stars in the "Last 7 Days" or see 
                    all-time favorites with "All Time". Category filters help you find the best agents 
                    in your specific area of interest.
                </p>
            </div>
        </div>
    </div>
    
    <!-- Footer -->
    <footer class="card border-t mt-20 py-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center" style="color: var(--text-secondary)">
            <p>&copy; 2024 AI Agents Directory. All rights reserved.</p>
        </div>
    </footer>

    <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
    <script>
      const API_BASE = '/api';
      let currentTab = 'views';
      
      function toggleDarkMode() {
        const html = document.documentElement;
        const theme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        document.getElementById('theme-icon').className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
      }
      
      function initTheme() {
        const theme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', theme);
        document.getElementById('theme-icon').className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
      }
      
      function toggleMobileMenu() {
        document.getElementById('mobile-menu').classList.toggle('hidden');
      }
      
      function switchTab(tab) {
        currentTab = tab;
        
        // Update tab styles
        document.querySelectorAll('.tab').forEach(t => {
          t.classList.remove('active');
          if (t.dataset.tab === tab) {
            t.classList.add('active');
          }
        });
        
        loadLeaderboard();
      }
      
      async function loadCategories() {
        try {
          const response = await axios.get(\`\${API_BASE}/categories\`);
          if (response.data.success) {
            const select = document.getElementById('category-filter');
            response.data.data.forEach(cat => {
              const option = document.createElement('option');
              option.value = cat.slug;
              option.textContent = cat.name;
              select.appendChild(option);
            });
          }
        } catch (error) {
          console.error('Error loading categories:', error);
        }
      }
      
      async function loadLeaderboard() {
        const timeRange = document.getElementById('time-range').value;
        const category = document.getElementById('category-filter').value;
        
        document.getElementById('loading-state').classList.remove('hidden');
        document.getElementById('leaderboard-table').classList.add('hidden');
        
        try {
          const response = await axios.get(
            \`\${API_BASE}/leaderboard/\${currentTab}?timeRange=\${timeRange}&category=\${category}&limit=50\`
          );
          
          if (response.data.success) {
            renderLeaderboard(response.data.data);
          }
        } catch (error) {
          console.error('Error loading leaderboard:', error);
        }
      }
      
      function renderLeaderboard(agents) {
        document.getElementById('loading-state').classList.add('hidden');
        document.getElementById('leaderboard-table').classList.remove('hidden');
        
        const table = document.getElementById('leaderboard-table');
        
        if (agents.length === 0) {
          table.innerHTML = '<p class="text-center py-12" style="color: var(--text-secondary)">No agents found</p>';
          return;
        }
        
        table.innerHTML = \`
          <div class="space-y-2">
            \${agents.map((agent, index) => createLeaderboardRow(agent, index + 1)).join('')}
          </div>
        \`;
      }
      
      function createLeaderboardRow(agent, rank) {
        const isTop3 = rank <= 3;
        const rankClass = isTop3 ? \`rank-\${rank}\` : '';
        const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : '';
        
        let metricDisplay = '';
        if (currentTab === 'views') {
          metricDisplay = \`
            <div class="text-right">
              <div class="font-bold text-lg">\${(agent.view_count || 0).toLocaleString()}</div>
              <div class="text-sm" style="color: var(--text-secondary)">views</div>
            </div>
          \`;
        } else if (currentTab === 'upvotes') {
          metricDisplay = \`
            <div class="text-right">
              <div class="font-bold text-lg">\${(agent.upvote_count || 0).toLocaleString()}</div>
              <div class="text-sm" style="color: var(--text-secondary)">upvotes</div>
            </div>
            <button onclick="upvoteAgent(\${agent.id}, event)" class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
              <i class="fas fa-arrow-up"></i>
            </button>
          \`;
        } else if (currentTab === 'reviews') {
          metricDisplay = \`
            <div class="text-right">
              <div class="font-bold text-lg">\${(agent.review_count || 0).toLocaleString()}</div>
              <div class="text-sm" style="color: var(--text-secondary)">reviews</div>
              <div class="text-yellow-500 text-sm mt-1">
                \${'★'.repeat(Math.round(agent.average_rating || 0))}
                \${'☆'.repeat(5 - Math.round(agent.average_rating || 0))}
              </div>
            </div>
          \`;
        }
        
        return \`
          <div class="leaderboard-row card border rounded-lg p-4" onclick="window.location='/agents/\${agent.slug}'">
            <div class="flex items-center gap-4">
              <div class="rank-medal \${rankClass}">
                \${medal || rank}
              </div>
              
              <div class="w-16 h-16 flex items-center justify-center text-4xl bg-gradient-to-br from-purple-400 to-indigo-600 rounded-lg">
                \${agent.logo_url || '🤖'}
              </div>
              
              <div class="flex-1 min-w-0">
                <h3 class="font-bold text-lg truncate">\${agent.name}</h3>
                <p class="text-sm truncate" style="color: var(--text-secondary)">
                  \${agent.tagline || ''}
                </p>
                <div class="flex gap-2 mt-1">
                  \${agent.category_names ? agent.category_names.split(',').slice(0, 2).map(cat => 
                    \`<span class="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded">\${cat.trim()}</span>\`
                  ).join('') : ''}
                </div>
              </div>
              
              <div class="flex items-center gap-4">
                \${metricDisplay}
              </div>
            </div>
          </div>
        \`;
      }
      
      async function upvoteAgent(id, event) {
        event.stopPropagation();
        try {
          await axios.post(\`\${API_BASE}/public/\${id}/upvote\`);
          loadLeaderboard();
        } catch (error) {
          console.error('Error upvoting:', error);
        }
      }
      
      document.addEventListener('DOMContentLoaded', () => {
        initTheme();
        loadCategories();
        loadLeaderboard();
        
        const now = new Date();
        document.getElementById('last-updated').textContent = now.toLocaleDateString('en-US', { 
          month: 'long', day: 'numeric', year: 'numeric' 
        });
      });
    </script>
</body>
</html>
`;


export const landscapePage = () => `
<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Agents Market Landscape October 2025 - Interactive Ecosystem Map</title>
    <meta name="description" content="Interactive ecosystem map of AI agents, tools, and assistants. Explore 72 categories and 1832+ AI agents visually.">
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
        background-color: var(--bg-secondary);
        color: var(--text-primary);
      }
      
      .card {
        background-color: var(--card-bg);
        border-color: var(--border-color);
      }
      
      #landscape-canvas {
        width: 100%;
        height: 500px;
        background-color: var(--bg-primary);
        border-radius: 12px;
        position: relative;
        overflow: hidden;
        cursor: grab;
        touch-action: none;
      }
      
      @media (min-width: 768px) {
        #landscape-canvas {
          height: 700px;
          border-radius: 16px;
        }
      }
      
      @media (min-width: 1024px) {
        #landscape-canvas {
          height: 800px;
        }
      }
      
      #landscape-canvas:active {
        cursor: grabbing;
      }
      
      .category-node {
        position: absolute;
        padding: 12px;
        border-radius: 8px;
        border: 2px solid rgba(139, 92, 246, 0.3);
        background-color: var(--card-bg);
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        user-select: none;
      }
      
      @media (min-width: 768px) {
        .category-node {
          padding: 16px;
          border-radius: 12px;
        }
      }
      
      .category-node:hover {
        transform: scale(1.05);
        box-shadow: 0 12px 24px rgba(139, 92, 246, 0.3);
        z-index: 10;
      }
      
      .category-node.selected {
        border-color: #8b5cf6;
        border-width: 3px;
        box-shadow: 0 12px 24px rgba(139, 92, 246, 0.5);
      }
      
      .node-icon {
        font-size: 1.5rem;
        margin-bottom: 4px;
        text-align: center;
      }
      
      @media (min-width: 768px) {
        .node-icon {
          font-size: 2rem;
          margin-bottom: 8px;
        }
      }
      
      .node-name {
        font-weight: 600;
        font-size: 0.75rem;
        margin-bottom: 2px;
        text-align: center;
        line-height: 1.2;
      }
      
      @media (min-width: 768px) {
        .node-name {
          font-size: 0.875rem;
          margin-bottom: 4px;
        }
      }
      
      .node-count {
        font-size: 0.625rem;
        color: var(--text-secondary);
        text-align: center;
      }
      
      @media (min-width: 768px) {
        .node-count {
          font-size: 0.75rem;
        }
      }
      
      .side-panel {
        position: fixed;
        right: 0;
        top: 64px;
        width: 100%;
        height: calc(100vh - 64px);
        background-color: var(--card-bg);
        border-left: 1px solid var(--border-color);
        transform: translateX(100%);
        transition: transform 0.3s ease;
        overflow-y: auto;
        z-index: 50;
        box-shadow: -4px 0 16px rgba(0, 0, 0, 0.1);
      }
      
      @media (min-width: 640px) {
        .side-panel {
          width: 90%;
          max-width: 400px;
        }
      }
      
      @media (min-width: 768px) {
        .side-panel {
          width: 400px;
        }
      }
      
      .side-panel.open {
        transform: translateX(0);
      }
      
      .controls-panel {
        position: absolute;
        bottom: 10px;
        left: 10px;
        background-color: var(--card-bg);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        padding: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        z-index: 20;
      }
      
      @media (min-width: 768px) {
        .controls-panel {
          bottom: 20px;
          left: 20px;
          border-radius: 12px;
          padding: 16px;
        }
      }
      
      .minimap {
        position: absolute;
        top: 10px;
        right: 10px;
        width: 120px;
        height: 90px;
        background-color: var(--card-bg);
        border: 1px solid var(--border-color);
        border-radius: 6px;
        overflow: hidden;
        z-index: 20;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }
      
      @media (min-width: 768px) {
        .minimap {
          top: 20px;
          right: 20px;
          width: 180px;
          height: 135px;
          border-radius: 8px;
        }
      }
      
      @media (min-width: 1024px) {
        .minimap {
          width: 200px;
          height: 150px;
        }
      }
      
      .agent-item {
        padding: 12px;
        border-bottom: 1px solid var(--border-color);
        cursor: pointer;
        transition: background-color 0.2s;
      }
      
      .agent-item:hover {
        background-color: var(--hover-bg, #f3f4f6);
      }
    </style>
</head>
<body>
    ${getHeader('landscape')}

    <!-- Header -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div class="text-center mb-6 md:mb-8">
            <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4">
                <i class="fas fa-project-diagram text-purple-600 mr-2 md:mr-3"></i>
                AI Agents Market Landscape
            </h1>
            <p class="text-base sm:text-lg md:text-xl lg:text-2xl mb-3 md:mb-4 px-4" style="color: var(--text-secondary)">
                Interactive ecosystem map of AI agents, tools, and assistants
            </p>
            <div class="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm px-4" style="color: var(--text-secondary)">
                <span><strong>Date:</strong> October 2025</span>
                <span><strong>Categories:</strong> <span id="total-categories">72</span></span>
                <span><strong>Agents:</strong> <span id="total-agents">1832+</span></span>
            </div>
        </div>
        
        <!-- Landscape Canvas -->
        <div class="relative mb-12">
            <div id="landscape-canvas" class="card border">
                <!-- Nodes will be rendered here -->
            </div>
            
            <!-- Minimap -->
            <div class="minimap">
                <canvas id="minimap-canvas" width="200" height="150"></canvas>
            </div>
            
            <!-- Controls -->
            <div class="controls-panel">
                <div class="flex flex-col gap-2">
                    <button onclick="zoomIn()" class="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm">
                        <i class="fas fa-search-plus mr-1 md:mr-2"></i>
                        <span class="hidden sm:inline">Zoom In</span>
                        <span class="sm:hidden">+</span>
                    </button>
                    <button onclick="zoomOut()" class="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm">
                        <i class="fas fa-search-minus mr-1 md:mr-2"></i>
                        <span class="hidden sm:inline">Zoom Out</span>
                        <span class="sm:hidden">−</span>
                    </button>
                    <button onclick="resetView()" class="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm">
                        <i class="fas fa-undo mr-1 md:mr-2"></i>
                        <span class="hidden sm:inline">Reset</span>
                        <span class="sm:hidden">↺</span>
                    </button>
                    <div class="mt-1 md:mt-2">
                        <label class="block text-xs mb-1">Filter</label>
                        <select id="filter-pricing" class="card w-full px-2 py-1 text-xs md:text-sm rounded border" onchange="filterNodes()">
                            <option value="">All</option>
                            <option value="free">Free</option>
                            <option value="opensource">Open Source</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Search Box -->
        <div class="mb-8">
            <input 
                type="text" 
                id="search-category" 
                placeholder="Search categories..." 
                class="card w-full px-6 py-4 rounded-xl border focus:ring-2 focus:ring-purple-600"
                style="color: var(--text-primary)"
                oninput="searchCategory()"
            />
        </div>
        
        <!-- Instructions -->
        <div class="card border rounded-xl p-4 md:p-6 mb-8 md:mb-12">
            <h3 class="text-lg md:text-xl font-bold mb-3 md:mb-4">
                <i class="fas fa-info-circle text-blue-600 mr-2"></i>
                How to Use the Landscape
            </h3>
            <div class="grid sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                <div>
                    <h4 class="font-semibold mb-2 text-sm md:text-base">🖱️ Navigate</h4>
                    <p class="text-xs md:text-sm" style="color: var(--text-secondary)">
                        Click/tap and drag to pan around the map. Use zoom controls to get closer or see the big picture.
                    </p>
                </div>
                <div>
                    <h4 class="font-semibold mb-2 text-sm md:text-base">🎯 Explore</h4>
                    <p class="text-xs md:text-sm" style="color: var(--text-secondary)">
                        Click/tap any category node to see agents in that category. Larger nodes mean more agents.
                    </p>
                </div>
                <div class="sm:col-span-2 md:col-span-1">
                    <h4 class="font-semibold mb-2 text-sm md:text-base">🔍 Search</h4>
                    <p class="text-xs md:text-sm" style="color: var(--text-secondary)">
                        Use the search box above to highlight specific categories instantly.
                    </p>
                </div>
            </div>
        </div>
        
        <!-- SEO Content -->
        <div class="card border rounded-xl p-4 md:p-6 lg:p-8">
            <h2 class="text-2xl md:text-3xl font-bold mb-4 md:mb-6">AI Agents Landscape October 2025: Your Complete Guide</h2>
            
            <div class="mb-6 md:mb-8">
                <h3 class="text-xl md:text-2xl font-semibold mb-3 md:mb-4">What is the AI Agents Landscape?</h3>
                <p style="color: var(--text-secondary)" class="mb-4">
                    The AI Agents Landscape is an interactive visualization of the entire ecosystem of AI-powered agents, 
                    tools, and assistants available in 2025. With over 1,832 AI agents organized across 72 categories, 
                    this map helps you understand the market structure and discover new possibilities.
                </p>
            </div>
            
            <div class="grid sm:grid-cols-2 gap-4 md:gap-6 lg:gap-8 mb-6 md:mb-8">
                <div>
                    <h3 class="text-lg md:text-xl font-semibold mb-2 md:mb-3">
                        <i class="fas fa-check-circle text-green-600 mr-2"></i>
                        Benefits of the Landscape View
                    </h3>
                    <ul class="space-y-1.5 md:space-y-2 text-sm md:text-base" style="color: var(--text-secondary)">
                        <li>• <strong>Visual Overview:</strong> See the entire market at a glance</li>
                        <li>• <strong>Category Relationships:</strong> Understand how different AI categories relate</li>
                        <li>• <strong>Market Insights:</strong> Identify saturated vs. emerging categories</li>
                        <li>• <strong>Quick Discovery:</strong> Find relevant tools faster through visual browsing</li>
                    </ul>
                </div>
                
                <div>
                    <h3 class="text-lg md:text-xl font-semibold mb-2 md:mb-3">
                        <i class="fas fa-users text-blue-600 mr-2"></i>
                        Who Benefits Most?
                    </h3>
                    <ul class="space-y-1.5 md:space-y-2 text-sm md:text-base" style="color: var(--text-secondary)">
                        <li>• <strong>Developers:</strong> Find integration opportunities</li>
                        <li>• <strong>Investors:</strong> Identify market gaps and trends</li>
                        <li>• <strong>Researchers:</strong> Map the AI ecosystem</li>
                        <li>• <strong>Business Leaders:</strong> Discover competitive solutions</li>
                    </ul>
                </div>
            </div>
            
            <div class="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 md:p-6">
                <h3 class="text-lg md:text-xl font-semibold mb-2 md:mb-3">Latest Trends (October 2025)</h3>
                <ul class="space-y-2" style="color: var(--text-secondary)">
                    <li>• <strong>Code Assistants:</strong> Most crowded category with 150+ agents</li>
                    <li>• <strong>Content Creation:</strong> Fastest growing with 39 new agents this month</li>
                    <li>• <strong>Data Analysis:</strong> Emerging category with high-value enterprise solutions</li>
                    <li>• <strong>Customer Support:</strong> Strong adoption in SMB market</li>
                </ul>
            </div>
        </div>
    </div>
    
    <!-- Side Panel -->
    <div id="side-panel" class="side-panel">
        <div class="p-6">
            <div class="flex justify-between items-start mb-4">
                <div>
                    <h2 class="text-2xl font-bold" id="panel-category-name">Category</h2>
                    <p class="text-sm" style="color: var(--text-secondary)" id="panel-category-desc">Select a category to see agents</p>
                </div>
                <button onclick="closePanel()" class="text-gray-400 hover:text-gray-600">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>
            
            <div class="mb-4">
                <div class="flex items-center gap-4 text-sm">
                    <span>
                        <i class="fas fa-robot text-purple-600 mr-1"></i>
                        <strong id="panel-agent-count">0</strong> agents
                    </span>
                    <span class="text-green-600">
                        <i class="fas fa-arrow-up mr-1"></i>
                        <strong id="panel-growth">0</strong> in 30d
                    </span>
                </div>
            </div>
            
            <div id="panel-agents-list" class="space-y-2">
                <!-- Agents will be loaded here -->
            </div>
        </div>
    </div>
    
    <!-- Footer -->
    <footer class="card border-t mt-20 py-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center" style="color: var(--text-secondary)">
            <p>&copy; 2024 AI Agents Directory. All rights reserved.</p>
        </div>
    </footer>

    <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
    <script>
      const API_BASE = '/api';
      let nodes = [];
      let scale = 1;
      let panX = 0;
      let panY = 0;
      let isDragging = false;
      let startX, startY;
      let selectedCategory = null;
      
      function toggleDarkMode() {
        const html = document.documentElement;
        const theme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        document.getElementById('theme-icon').className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
      }
      
      function initTheme() {
        const theme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', theme);
        document.getElementById('theme-icon').className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
      }
      
      function toggleMobileMenu() {
        document.getElementById('mobile-menu').classList.toggle('hidden');
      }
      
      async function loadLandscape() {
        try {
          const response = await axios.get(\`\${API_BASE}/landscape/data\`);
          
          if (response.data.success) {
            nodes = response.data.data.nodes;
            
            // Update stats
            document.getElementById('total-categories').textContent = response.data.data.stats.totalCategories;
            document.getElementById('total-agents').textContent = response.data.data.stats.totalAgents + '+';
            
            renderNodes();
            drawMinimap();
          }
        } catch (error) {
          console.error('Error loading landscape:', error);
        }
      }
      
      function renderNodes() {
        const canvas = document.getElementById('landscape-canvas');
        canvas.innerHTML = '';
        
        const canvasWidth = canvas.offsetWidth;
        const canvasHeight = canvas.offsetHeight;
        
        // Calculate grid layout
        const cols = Math.ceil(Math.sqrt(nodes.length * (canvasWidth / canvasHeight)));
        const rows = Math.ceil(nodes.length / cols);
        const cellWidth = canvasWidth / cols;
        const cellHeight = canvasHeight / rows;
        
        nodes.forEach((node, index) => {
          const col = index % cols;
          const row = Math.floor(index / cols);
          
          // Calculate position with some randomness for organic feel
          const baseX = col * cellWidth + cellWidth / 2;
          const baseY = row * cellHeight + cellHeight / 2;
          const randomX = (Math.random() - 0.5) * 40;
          const randomY = (Math.random() - 0.5) * 40;
          
          node.x = baseX + randomX;
          node.y = baseY + randomY;
          
          const nodeEl = document.createElement('div');
          nodeEl.className = 'category-node';
          nodeEl.style.left = (node.x * scale + panX) + 'px';
          nodeEl.style.top = (node.y * scale + panY) + 'px';
          nodeEl.style.width = node.size + 'px';
          nodeEl.dataset.slug = node.id;
          
          nodeEl.innerHTML = \`
            <div class="node-icon">\${node.icon}</div>
            <div class="node-name">\${node.name}</div>
            <div class="node-count">\${node.agentCount} agents</div>
          \`;
          
          nodeEl.onclick = () => selectCategory(node);
          canvas.appendChild(nodeEl);
        });
      }
      
      async function selectCategory(node) {
        selectedCategory = node;
        
        // Highlight selected node
        document.querySelectorAll('.category-node').forEach(el => {
          el.classList.remove('selected');
          if (el.dataset.slug === node.id) {
            el.classList.add('selected');
          }
        });
        
        // Update panel
        document.getElementById('panel-category-name').textContent = node.name;
        document.getElementById('panel-category-desc').textContent = node.description || 'Explore agents in this category';
        document.getElementById('panel-agent-count').textContent = node.agentCount;
        document.getElementById('panel-growth').textContent = node.growth30d || 0;
        
        // Load agents
        try {
          const response = await axios.get(\`\${API_BASE}/landscape/category/\${node.id}\`);
          if (response.data.success) {
            renderAgents(response.data.data);
          }
        } catch (error) {
          console.error('Error loading agents:', error);
        }
        
        // Open panel
        document.getElementById('side-panel').classList.add('open');
      }
      
      function renderAgents(agents) {
        const list = document.getElementById('panel-agents-list');
        
        if (agents.length === 0) {
          list.innerHTML = '<p class="text-center py-8" style="color: var(--text-secondary)">No agents found</p>';
          return;
        }
        
        list.innerHTML = agents.map(agent => \`
          <div class="agent-item card border rounded-lg" onclick="window.location='/agents/\${agent.slug}'">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 flex items-center justify-center text-2xl bg-gradient-to-br from-purple-400 to-indigo-600 rounded-lg">
                \${agent.logo_url || '🤖'}
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="font-semibold truncate">\${agent.name}</h4>
                <p class="text-xs truncate" style="color: var(--text-secondary)">\${agent.tagline || ''}</p>
                <div class="flex gap-2 mt-1">
                  <span class="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded">\${agent.pricing_model}</span>
                  \${agent.is_open_source ? '<span class="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded">Open Source</span>' : ''}
                </div>
              </div>
              <i class="fas fa-chevron-right text-gray-400"></i>
            </div>
          </div>
        \`).join('');
      }
      
      function closePanel() {
        document.getElementById('side-panel').classList.remove('open');
        document.querySelectorAll('.category-node').forEach(el => {
          el.classList.remove('selected');
        });
      }
      
      function zoomIn() {
        scale = Math.min(scale * 1.2, 3);
        renderNodes();
        drawMinimap();
      }
      
      function zoomOut() {
        scale = Math.max(scale / 1.2, 0.5);
        renderNodes();
        drawMinimap();
      }
      
      function resetView() {
        scale = 1;
        panX = 0;
        panY = 0;
        renderNodes();
        drawMinimap();
      }
      
      function searchCategory() {
        const term = document.getElementById('search-category').value.toLowerCase();
        
        document.querySelectorAll('.category-node').forEach(el => {
          const node = nodes.find(n => n.id === el.dataset.slug);
          if (term === '' || node.name.toLowerCase().includes(term)) {
            el.style.opacity = '1';
            el.style.transform = '';
          } else {
            el.style.opacity = '0.3';
            el.style.transform = 'scale(0.9)';
          }
        });
      }
      
      function filterNodes() {
        // Placeholder for filtering functionality
        renderNodes();
      }
      
      function drawMinimap() {
        const canvas = document.getElementById('minimap-canvas');
        const ctx = canvas.getContext('2d');
        
        ctx.clearRect(0, 0, 200, 150);
        ctx.fillStyle = '#f3f4f6';
        ctx.fillRect(0, 0, 200, 150);
        
        nodes.forEach(node => {
          const x = (node.x / 1200) * 200;
          const y = (node.y / 800) * 150;
          ctx.fillStyle = node.color || '#8b5cf6';
          ctx.beginPath();
          ctx.arc(x, y, 3, 0, Math.PI * 2);
          ctx.fill();
        });
      }
      
      // Pan functionality
      const canvas = document.getElementById('landscape-canvas');
      canvas.addEventListener('mousedown', (e) => {
        if (e.target === canvas) {
          isDragging = true;
          startX = e.clientX - panX;
          startY = e.clientY - panY;
        }
      });
      
      canvas.addEventListener('mousemove', (e) => {
        if (isDragging) {
          panX = e.clientX - startX;
          panY = e.clientY - startY;
          renderNodes();
        }
      });
      
      canvas.addEventListener('mouseup', () => {
        isDragging = false;
      });
      
      canvas.addEventListener('mouseleave', () => {
        isDragging = false;
      });
      
      document.addEventListener('DOMContentLoaded', () => {
        initTheme();
        loadLandscape();
      });
    </script>
</body>
</html>
`;
