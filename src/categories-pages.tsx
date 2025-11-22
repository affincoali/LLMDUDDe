// Categories Pages - All Categories & Category Detail
import { getHeader } from './components/header';
import { getFooter } from './components/footer';

export const categoriesPage = () => `
<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Browse Categories - AI Agents Directory</title>
    <meta name="description" content="Explore all AI agent categories. Find the perfect AI tools organized by functionality and use case.">
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
      
      .category-card {
        transition: all 0.3s ease;
        cursor: pointer;
      }
      
      .category-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
      }
      
      [data-theme="dark"] .category-card:hover {
        box-shadow: 0 12px 24px rgba(0, 0, 0, 0.5);
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
      
      .toast {
        position: fixed;
        bottom: 20px;
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
      .toast.info { background-color: #3b82f6; }
    </style>
</head>
<body>
    ${getHeader('categories')}

    <!-- Header -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="text-center mb-12">
            <h1 class="text-5xl font-bold mb-4">
                <i class="fas fa-folder-open text-blue-700 mr-3"></i>
                Browse Categories
            </h1>
            <p class="text-xl" style="color: var(--text-secondary)">
                Explore AI agents organized by functionality and use case
            </p>
        </div>
        
        <!-- Search Bar -->
        <div class="max-w-2xl mx-auto mb-8">
            <div class="relative">
                <input 
                    type="text" 
                    id="search-input" 
                    placeholder="Search categories..." 
                    class="card w-full px-6 py-4 pl-12 rounded-xl border focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                    style="color: var(--text-primary)"
                    oninput="filterCategories()"
                />
                <i class="fas fa-search absolute left-4 top-5 text-gray-400"></i>
            </div>
        </div>
        
        <!-- Sort Options -->
        <div class="flex justify-between items-center mb-8">
            <div class="text-lg font-semibold">
                <span id="category-count">Loading...</span> Categories
            </div>
            <div class="flex gap-4">
                <select 
                    id="sort-select" 
                    class="card px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-700"
                    style="color: var(--text-primary)"
                    onchange="sortCategories()"
                >
                    <option value="popular">Most Popular</option>
                    <option value="name-asc">Name (A-Z)</option>
                    <option value="name-desc">Name (Z-A)</option>
                    <option value="newest">Newest First</option>
                </select>
            </div>
        </div>
        
        <!-- Categories Grid -->
        <div id="categories-container" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <!-- Skeleton Loaders -->
            ${Array(8).fill(0).map(() => `
                <div class="card border rounded-xl p-6 skeleton">
                    <div class="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4"></div>
                    <div class="h-6 bg-gray-300 rounded mb-2"></div>
                    <div class="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
                </div>
            `).join('')}
        </div>
    </div>
    
    <!-- Footer -->
    ${getFooter()}

    <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
    <script>
      const API_BASE = '/api';
      let allCategories = [];
      let filteredCategories = [];
      
      // Toast Notification
      function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = \`toast \${type}\`;
        toast.innerHTML = \`
          <i class="fas \${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'} mr-2"></i>
          \${message}
        \`;
        document.body.appendChild(toast);
        
        setTimeout(() => {
          toast.remove();
        }, 3000);
      }
      
      // Load Categories
      async function loadCategories() {
        try {
          const response = await axios.get(\`\${API_BASE}/categories\`);
          
          if (response.data.success) {
            allCategories = response.data.data;
            filteredCategories = [...allCategories];
            renderCategories();
            updateCount();
          }
        } catch (error) {
          console.error('Error loading categories:', error);
          showToast('Failed to load categories', 'error');
          document.getElementById('categories-container').innerHTML = \`
            <div class="col-span-full text-center py-12">
              <i class="fas fa-exclamation-triangle text-6xl text-red-500 mb-4"></i>
              <p class="text-xl">Failed to load categories</p>
              <button onclick="loadCategories()" class="mt-4 px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800">
                Try Again
              </button>
            </div>
          \`;
        }
      }
      
      // Render Categories
      function renderCategories() {
        const container = document.getElementById('categories-container');
        
        if (filteredCategories.length === 0) {
          container.innerHTML = \`
            <div class="col-span-full text-center py-12">
              <i class="fas fa-search text-6xl mb-4" style="color: var(--text-secondary)"></i>
              <p class="text-xl" style="color: var(--text-secondary)">No categories found</p>
            </div>
          \`;
          return;
        }
        
        container.innerHTML = filteredCategories.map(category => createCategoryCard(category)).join('');
      }
      
      // Create Category Card
      function createCategoryCard(category) {
        const imageHtml = category.image_url 
          ? \`<img src="\${category.image_url}" alt="\${category.name}" class="w-24 h-24 object-cover rounded-lg mx-auto mb-4" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='block'"><div class="text-6xl mb-4" style="display:none">\${category.icon || '📁'}</div>\`
          : \`<div class="text-6xl mb-4">\${category.icon || '📁'}</div>\`;
        
        return \`
          <div class="card category-card border rounded-xl p-6 text-center" onclick="window.location='/categories/\${category.slug}'">
            \${imageHtml}
            <h3 class="text-xl font-bold mb-2">\${category.name}</h3>
            <p class="text-sm mb-4" style="color: var(--text-secondary)">
              \${category.description || 'Explore AI agents in this category'}
            </p>
            <div class="flex justify-center items-center gap-4 text-sm" style="color: var(--text-secondary)">
              <span>
                <i class="fas fa-robot text-blue-700 mr-1"></i>
                \${category.agent_count || 0} agents
              </span>
            </div>
          </div>
        \`;
      }
      
      // Filter Categories
      function filterCategories() {
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
          case 'popular':
            filteredCategories.sort((a, b) => (b.agent_count || 0) - (a.agent_count || 0));
            break;
          case 'name-asc':
            filteredCategories.sort((a, b) => a.name.localeCompare(b.name));
            break;
          case 'name-desc':
            filteredCategories.sort((a, b) => b.name.localeCompare(a.name));
            break;
          case 'newest':
            filteredCategories.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            break;
        }
        
        renderCategories();
        updateCount();
      }
      
      // Update Count
      function updateCount() {
        document.getElementById('category-count').textContent = filteredCategories.length;
      }
      
      // Initialize
      document.addEventListener('DOMContentLoaded', () => {
        loadCategories();
      });
    </script>
</body>
</html>
`;

export const categoryDetailPage = (slug: string) => `
<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title id="page-title">Category - AI Agents Directory</title>
    <meta name="description" content="Explore AI agents in this category">
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
      
      .agent-card {
        transition: all 0.3s ease;
        cursor: pointer;
      }
      
      .agent-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
      }
      
      [data-theme="dark"] .agent-card:hover {
        box-shadow: 0 12px 24px rgba(0, 0, 0, 0.5);
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
      
      .toast {
        position: fixed;
        bottom: 20px;
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
      .toast.info { background-color: #3b82f6; }
      
      .breadcrumb {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 24px;
      }
      
      .breadcrumb a {
        color: var(--text-secondary);
      }
      
      .breadcrumb a:hover {
        color: #9333ea;
      }
    </style>
</head>
<body>
    ${getHeader('categories')}

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <!-- Breadcrumb -->
        <div class="breadcrumb">
            <a href="/"><i class="fas fa-home"></i> Home</a>
            <i class="fas fa-chevron-right text-xs" style="color: var(--text-secondary)"></i>
            <a href="/categories">Categories</a>
            <i class="fas fa-chevron-right text-xs" style="color: var(--text-secondary)"></i>
            <span id="breadcrumb-category">Loading...</span>
        </div>
        
        <!-- Category Header -->
        <div class="card border rounded-xl p-8 mb-8 text-center">
            <img id="category-image" src="" alt="" class="w-32 h-32 object-cover rounded-lg mx-auto mb-4" loading="lazy" style="display:none" onerror="this.style.display='none';document.getElementById('category-icon').style.display='block'">
            <div class="text-8xl mb-4" id="category-icon">📁</div>
            <h1 class="text-5xl font-bold mb-4" id="category-name">Loading...</h1>
            <p class="text-xl mb-6" style="color: var(--text-secondary)" id="category-description">
                Loading category description...
            </p>
            <div class="flex justify-center items-center gap-8 text-lg" style="color: var(--text-secondary)">
                <span>
                    <i class="fas fa-robot text-blue-700 mr-2"></i>
                    <strong id="agent-count">0</strong> Agents
                </span>
                <span>
                    <i class="fas fa-calendar text-blue-700 mr-2"></i>
                    Created <span id="created-date">-</span>
                </span>
            </div>
        </div>
        
        <!-- Filter and Sort Bar -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div class="flex gap-4 w-full md:w-auto">
                <input 
                    type="text" 
                    id="search-input" 
                    placeholder="Search agents in this category..." 
                    class="card flex-1 md:w-80 px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-700"
                    style="color: var(--text-primary)"
                    oninput="filterAgents()"
                />
            </div>
            
            <div class="flex gap-4 w-full md:w-auto">
                <select 
                    id="pricing-filter" 
                    class="card px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-700"
                    style="color: var(--text-primary)"
                    onchange="filterAgents()"
                >
                    <option value="">All Pricing</option>
                    <option value="FREE">Free</option>
                    <option value="FREEMIUM">Freemium</option>
                    <option value="PAID">Paid</option>
                    <option value="CONTACT">Contact</option>
                </select>
                
                <select 
                    id="sort-select" 
                    class="card px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-700"
                    style="color: var(--text-primary)"
                    onchange="sortAgents()"
                >
                    <option value="popular">Most Popular</option>
                    <option value="newest">Newest</option>
                    <option value="name-asc">Name (A-Z)</option>
                    <option value="upvotes">Most Upvoted</option>
                </select>
            </div>
        </div>
        
        <!-- Agents Grid -->
        <div id="agents-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <!-- Skeleton Loaders -->
            ${Array(6).fill(0).map(() => `
                <div class="card border rounded-xl overflow-hidden skeleton">
                    <div class="h-48 bg-gray-300"></div>
                    <div class="p-6">
                        <div class="h-6 bg-gray-300 rounded mb-2"></div>
                        <div class="h-4 bg-gray-300 rounded mb-4"></div>
                        <div class="flex justify-between">
                            <div class="h-4 bg-gray-300 rounded w-16"></div>
                            <div class="h-6 bg-gray-300 rounded w-20"></div>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
        
        <!-- Related Categories -->
        <div class="mt-16">
            <h2 class="text-3xl font-bold mb-6">
                <i class="fas fa-sitemap text-blue-700 mr-3"></i>
                Related Categories
            </h2>
            <div id="related-categories" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <!-- Related categories will be loaded here -->
            </div>
        </div>
    </div>
    
    <!-- Footer -->
    ${getFooter()}

    <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
    <script>
      const API_BASE = '/api';
      const CATEGORY_SLUG = '${slug}';
      let categoryData = null;
      let allAgents = [];
      let filteredAgents = [];
      
      // Toast Notification
      function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = \`toast \${type}\`;
        toast.innerHTML = \`
          <i class="fas \${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'} mr-2"></i>
          \${message}
        \`;
        document.body.appendChild(toast);
        
        setTimeout(() => {
          toast.remove();
        }, 3000);
      }
      
      // Load Category Details
      async function loadCategory() {
        try {
          const response = await axios.get(\`\${API_BASE}/categories?slug=\${CATEGORY_SLUG}\`);
          
          if (response.data.success && response.data.data.length > 0) {
            categoryData = response.data.data[0];
            
            // Update page
            document.getElementById('page-title').textContent = \`\${categoryData.name} - AI Agents Directory\`;
            document.getElementById('breadcrumb-category').textContent = categoryData.name;
            
            // Display image if available, otherwise show icon
            if (categoryData.image_url) {
              const imgEl = document.getElementById('category-image');
              imgEl.src = categoryData.image_url;
              imgEl.alt = categoryData.name;
              imgEl.style.display = 'block';
              document.getElementById('category-icon').style.display = 'none';
            } else {
              document.getElementById('category-icon').textContent = categoryData.icon || '📁';
            }
            
            document.getElementById('category-name').textContent = categoryData.name;
            document.getElementById('category-description').textContent = categoryData.description || 'Explore AI agents in this category';
            document.getElementById('agent-count').textContent = categoryData.agent_count || 0;
            
            if (categoryData.created_at) {
              const date = new Date(categoryData.created_at);
              document.getElementById('created-date').textContent = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
            }
            
            // Load agents in this category
            await loadAgents();
            await loadRelatedCategories();
          } else {
            showToast('Category not found', 'error');
            setTimeout(() => window.location.href = '/categories', 2000);
          }
        } catch (error) {
          console.error('Error loading category:', error);
          showToast('Failed to load category', 'error');
        }
      }
      
      // Load Agents
      async function loadAgents() {
        try {
          // Get category detail which includes agents
          const response = await axios.get(\`\${API_BASE}/categories/\${CATEGORY_SLUG}\`);
          
          if (response.data.success) {
            // Get agents directly from category response
            allAgents = response.data.data.agents || [];
            filteredAgents = [...allAgents];
            renderAgents();
          }
        } catch (error) {
          console.error('Error loading agents:', error);
          showToast('Failed to load agents', 'error');
        }
      }
      
      // Render Agents
      function renderAgents() {
        const container = document.getElementById('agents-container');
        
        if (filteredAgents.length === 0) {
          container.innerHTML = \`
            <div class="col-span-full text-center py-12">
              <i class="fas fa-robot text-6xl mb-4" style="color: var(--text-secondary)"></i>
              <p class="text-xl" style="color: var(--text-secondary)">No agents found in this category</p>
            </div>
          \`;
          return;
        }
        
        container.innerHTML = filteredAgents.map(agent => createAgentCard(agent)).join('');
      }
      
      // Create Agent Card
      function createAgentCard(agent) {
        const fallbackImage = 'https://storage.llmdude.com/uploads/1761722667625-3falg8084x7.png';
        const logoUrl = agent.logo_url || fallbackImage;
        
        return \`
          <div class="card agent-card border rounded-xl overflow-hidden" onclick="window.location='/agents/\${agent.slug}'">
            <div class="h-48 bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center p-4">
              <img 
                src="\${logoUrl}" 
                alt="\${agent.name}" 
                class="w-32 h-32 object-contain"
                loading="lazy"
                onerror="this.onerror=null; this.src='\${fallbackImage}';"
              />
            </div>
            <div class="p-6">
              <h3 class="text-xl font-bold mb-2">\${agent.name}</h3>
              <p class="text-sm mb-4 line-clamp-2" style="color: var(--text-secondary)">
                \${agent.tagline || 'AI Agent'}
              </p>
              <div class="flex items-center justify-between">
                <div class="flex gap-4 text-sm" style="color: var(--text-secondary)">
                  <span title="Upvotes">
                    <i class="fas fa-arrow-up text-blue-700"></i> \${agent.upvote_count || 0}
                  </span>
                  <span title="Views">
                    <i class="fas fa-eye text-blue-700"></i> \${agent.view_count || 0}
                  </span>
                </div>
                <span class="px-3 py-1 bg-purple-100 text-blue-800 text-xs font-semibold rounded-full">
                  \${agent.pricing_model}
                </span>
              </div>
            </div>
          </div>
        \`;
      }
      
      // Filter Agents
      function filterAgents() {
        const searchTerm = document.getElementById('search-input').value.toLowerCase();
        const pricingFilter = document.getElementById('pricing-filter').value;
        
        filteredAgents = allAgents.filter(agent => {
          const matchesSearch = searchTerm === '' || 
            agent.name.toLowerCase().includes(searchTerm) ||
            (agent.tagline && agent.tagline.toLowerCase().includes(searchTerm));
          
          const matchesPricing = pricingFilter === '' || agent.pricing_model === pricingFilter;
          
          return matchesSearch && matchesPricing;
        });
        
        sortAgents();
      }
      
      // Sort Agents
      function sortAgents() {
        const sortValue = document.getElementById('sort-select').value;
        
        switch(sortValue) {
          case 'popular':
            filteredAgents.sort((a, b) => (b.view_count || 0) - (a.view_count || 0));
            break;
          case 'newest':
            filteredAgents.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            break;
          case 'name-asc':
            filteredAgents.sort((a, b) => a.name.localeCompare(b.name));
            break;
          case 'upvotes':
            filteredAgents.sort((a, b) => (b.upvote_count || 0) - (a.upvote_count || 0));
            break;
        }
        
        renderAgents();
      }
      
      // Load Related Categories
      async function loadRelatedCategories() {
        try {
          const response = await axios.get(\`\${API_BASE}/categories\`);
          
          if (response.data.success) {
            // Get categories excluding current one
            const related = response.data.data
              .filter(cat => cat.slug !== CATEGORY_SLUG)
              .sort(() => 0.5 - Math.random())
              .slice(0, 6);
            
            const container = document.getElementById('related-categories');
            container.innerHTML = related.map(cat => \`
              <a href="/categories/\${cat.slug}" class="card border rounded-lg p-4 text-center hover:shadow-lg transition">
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
      document.addEventListener('DOMContentLoaded', () => {
        loadCategory();
      });
    </script>
</body>
</html>
`;
