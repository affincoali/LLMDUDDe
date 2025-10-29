// Modern Agent Detail Page - Matches aiagentsdirectory.com design
import { getFooter } from './components/footer';

export const modernAgentDetailPage = (slug: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title id="page-title">Agent Details - AI Agents Directory</title>
    <meta name="description" id="page-description" content="Detailed information about this AI agent">
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        .tab-active {
            border-bottom: 3px solid #7c3aed;
            color: #7c3aed;
            font-weight: 600;
        }
        .badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 0.875rem;
            font-weight: 500;
        }
        .image-gallery {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
        }
        .image-gallery img {
            width: 100%;
            height: 200px;
            object-fit: cover;
            border-radius: 12px;
            cursor: pointer;
            transition: transform 0.2s;
        }
        .image-gallery img:hover {
            transform: scale(1.05);
        }
        .stats-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 8px 16px;
            background: #f3f4f6;
            border-radius: 8px;
            font-size: 0.875rem;
        }
        .btn-primary {
            background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
            color: white;
            padding: 12px 24px;
            border-radius: 10px;
            font-weight: 600;
            transition: all 0.3s;
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }
        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(124, 58, 237, 0.3);
        }
        .btn-secondary {
            background: #f3f4f6;
            color: #374151;
            padding: 12px 24px;
            border-radius: 10px;
            font-weight: 600;
            transition: all 0.3s;
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }
        .btn-secondary:hover {
            background: #e5e7eb;
        }
        .feature-card {
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            padding: 20px;
            transition: all 0.3s;
        }
        .feature-card:hover {
            border-color: #7c3aed;
            box-shadow: 0 4px 12px rgba(124, 58, 237, 0.1);
        }
        .review-card {
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 16px;
        }
        .progress-bar {
            width: 100%;
            height: 8px;
            background: #f3f4f6;
            border-radius: 4px;
            overflow: hidden;
        }
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #10b981 0%, #059669 100%);
            transition: width 0.3s;
        }
    </style>
</head>
<body class="bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16 items-center">
                <div class="flex items-center gap-8">
                    <a href="/" class="flex items-center">
                        <i class="fas fa-robot text-3xl text-purple-600 mr-3"></i>
                        <span class="text-xl font-bold">AI Agents Directory</span>
                    </a>
                    <div class="hidden md:flex items-center space-x-6">
                        <a href="/" class="text-gray-700 hover:text-purple-600 transition">Home</a>
                        <a href="/agents" class="text-gray-700 hover:text-purple-600 transition">Agents</a>
                        <a href="/categories" class="text-gray-700 hover:text-purple-600 transition">Categories</a>
                    </div>
                </div>
                <div class="flex items-center gap-4">
                    <a href="/login" class="text-gray-700 hover:text-purple-600 transition">Login</a>
                    <a href="/submit" class="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition">
                        Submit Agent
                    </a>
                </div>
            </div>
        </div>
    </nav>

    <!-- Breadcrumb -->
    <div class="bg-white border-b">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div class="flex items-center gap-2 text-sm">
                <a href="/" class="text-gray-600 hover:text-purple-600">Home</a>
                <i class="fas fa-chevron-right text-gray-400 text-xs"></i>
                <a href="/categories" class="text-gray-600 hover:text-purple-600">Categories</a>
                <i class="fas fa-chevron-right text-gray-400 text-xs"></i>
                <span id="breadcrumb-category" class="text-gray-600">NSFW</span>
                <i class="fas fa-chevron-right text-gray-400 text-xs"></i>
                <span id="breadcrumb-agent" class="text-gray-900 font-medium">Loading...</span>
            </div>
        </div>
    </div>

    <div id="loading" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="text-center py-20">
            <i class="fas fa-spinner fa-spin text-6xl text-purple-600 mb-4"></i>
            <p class="text-gray-600">Loading agent details...</p>
        </div>
    </div>

    <div id="agent-content" class="hidden">
        <!-- Main Content -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Left Column (2/3) -->
                <div class="lg:col-span-2">
                    <!-- Agent Header -->
                    <div class="bg-white rounded-xl p-8 shadow-sm mb-6">
                        <div class="flex items-start gap-6">
                            <!-- Logo -->
                            <div id="agent-logo" class="w-24 h-24 flex-shrink-0 bg-gradient-to-br from-purple-400 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                                <span class="text-5xl">🤖</span>
                            </div>
                            
                            <!-- Info -->
                            <div class="flex-1">
                                <div class="flex items-start justify-between mb-3">
                                    <div>
                                        <h1 id="agent-name" class="text-4xl font-bold mb-2">Agent Name</h1>
                                        <div class="flex flex-wrap items-center gap-3 mb-3">
                                            <span id="rating-badge" class="badge bg-yellow-100 text-yellow-800">
                                                <i class="fas fa-star"></i>
                                                <span>4.3</span>
                                                <span class="text-gray-600">(9)</span>
                                            </span>
                                            <a href="#" class="text-purple-600 hover:text-purple-700 text-sm font-medium">Write a Review</a>
                                        </div>
                                        <div id="agent-badges" class="flex flex-wrap gap-2">
                                            <!-- Badges will be loaded here -->
                                        </div>
                                    </div>
                                    <button onclick="shareAgent()" class="p-2 hover:bg-gray-100 rounded-lg transition">
                                        <i class="fas fa-share-alt text-gray-600"></i>
                                    </button>
                                </div>
                                
                                <p id="agent-tagline" class="text-gray-600 text-lg mb-4">Agent tagline goes here</p>
                                
                                <!-- Stats -->
                                <div class="flex flex-wrap gap-4 mb-4">
                                    <div class="stats-badge">
                                        <i class="fas fa-eye text-gray-600"></i>
                                        <span id="view-count">0</span>
                                    </div>
                                    <div class="stats-badge">
                                        <i class="fas fa-thumbs-up text-gray-600"></i>
                                        <span id="like-count">0</span>
                                    </div>
                                    <div class="stats-badge">
                                        <i class="fas fa-times text-gray-600"></i>
                                        <span>0</span>
                                    </div>
                                </div>
                                
                                <!-- Action Buttons -->
                                <div class="flex flex-wrap gap-3">
                                    <a id="visit-website-btn" href="#" target="_blank" class="btn-primary">
                                        <i class="fas fa-external-link-alt"></i>
                                        Visit Website
                                    </a>
                                    <button onclick="toggleSave()" id="save-btn" class="btn-secondary">
                                        <i class="far fa-bookmark"></i>
                                        <span id="save-text">Save</span>
                                    </button>
                                    <button class="btn-secondary">
                                        <i class="fas fa-times"></i>
                                    </button>
                                    <button onclick="copyLink()" class="btn-secondary">
                                        Copy
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Tabs -->
                    <div class="bg-white rounded-xl shadow-sm mb-6">
                        <div class="border-b">
                            <div class="flex gap-8 px-8 overflow-x-auto">
                                <button onclick="switchTab('overview')" id="tab-overview" class="py-4 tab-active whitespace-nowrap">
                                    <i class="fas fa-info-circle mr-2"></i>Overview
                                </button>
                                <button onclick="switchTab('features')" id="tab-features" class="py-4 text-gray-600 hover:text-purple-600 whitespace-nowrap">
                                    <i class="fas fa-list-check mr-2"></i>Features
                                </button>
                                <button onclick="switchTab('use-cases')" id="tab-use-cases" class="py-4 text-gray-600 hover:text-purple-600 whitespace-nowrap">
                                    <i class="fas fa-lightbulb mr-2"></i>Use Cases
                                </button>
                                <button onclick="switchTab('pricing')" id="tab-pricing" class="py-4 text-gray-600 hover:text-purple-600 whitespace-nowrap">
                                    <i class="fas fa-dollar-sign mr-2"></i>Pricing
                                </button>
                                <button onclick="switchTab('alternatives')" id="tab-alternatives" class="py-4 text-gray-600 hover:text-purple-600 whitespace-nowrap">
                                    <i class="fas fa-exchange-alt mr-2"></i>Alternatives
                                </button>
                                <button onclick="switchTab('reviews')" id="tab-reviews" class="py-4 text-gray-600 hover:text-purple-600 whitespace-nowrap">
                                    <i class="fas fa-star mr-2"></i>Reviews <span id="review-count-tab" class="ml-1 text-gray-500">0</span>
                                </button>
                            </div>
                        </div>

                        <!-- Tab Content -->
                        <div class="p-8">
                            <!-- Overview Tab -->
                            <div id="content-overview">
                                <h2 class="text-2xl font-bold mb-4">Overview</h2>
                                <div id="agent-description" class="prose max-w-none text-gray-700 leading-relaxed">
                                    <p>Loading description...</p>
                                </div>
                            </div>

                            <!-- Features Tab -->
                            <div id="content-features" class="hidden">
                                <h2 class="text-2xl font-bold mb-6">Key Features</h2>
                                <div id="features-grid" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <!-- Features will be loaded here -->
                                </div>
                            </div>

                            <!-- Use Cases Tab -->
                            <div id="content-use-cases" class="hidden">
                                <h2 class="text-2xl font-bold mb-6">Use Cases</h2>
                                <div id="use-cases-list" class="space-y-4">
                                    <!-- Use cases will be loaded here -->
                                </div>
                            </div>

                            <!-- Pricing Tab -->
                            <div id="content-pricing" class="hidden">
                                <h2 class="text-2xl font-bold mb-6">Pricing</h2>
                                <div id="pricing-content">
                                    <!-- Pricing will be loaded here -->
                                </div>
                            </div>

                            <!-- Alternatives Tab -->
                            <div id="content-alternatives" class="hidden">
                                <h2 class="text-2xl font-bold mb-6">Alternative AI Agents</h2>
                                <div id="alternatives-grid" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <!-- Alternatives will be loaded here -->
                                </div>
                            </div>

                            <!-- Reviews Tab -->
                            <div id="content-reviews" class="hidden">
                                <div class="flex justify-between items-center mb-6">
                                    <h2 class="text-2xl font-bold">Reviews & Ratings</h2>
                                    <button onclick="showReviewForm()" class="btn-primary">
                                        <i class="fas fa-pencil-alt"></i>
                                        Write a Review
                                    </button>
                                </div>
                                
                                <!-- Rating Summary -->
                                <div class="bg-gray-50 rounded-xl p-6 mb-6">
                                    <div class="flex items-center gap-8">
                                        <div class="text-center">
                                            <div class="text-5xl font-bold mb-2" id="avg-rating">0.0</div>
                                            <div class="text-yellow-500 text-2xl mb-1" id="star-display">☆☆☆☆☆</div>
                                            <div class="text-sm text-gray-600" id="total-reviews">0 reviews</div>
                                        </div>
                                        <div class="flex-1">
                                            <div class="space-y-2">
                                                <div class="flex items-center gap-3">
                                                    <span class="text-sm w-8">5★</span>
                                                    <div class="flex-1 progress-bar">
                                                        <div id="progress-5" class="progress-fill" style="width: 0%"></div>
                                                    </div>
                                                    <span class="text-sm text-gray-600 w-8" id="count-5">0</span>
                                                </div>
                                                <div class="flex items-center gap-3">
                                                    <span class="text-sm w-8">4★</span>
                                                    <div class="flex-1 progress-bar">
                                                        <div id="progress-4" class="progress-fill" style="width: 0%"></div>
                                                    </div>
                                                    <span class="text-sm text-gray-600 w-8" id="count-4">0</span>
                                                </div>
                                                <div class="flex items-center gap-3">
                                                    <span class="text-sm w-8">3★</span>
                                                    <div class="flex-1 progress-bar">
                                                        <div id="progress-3" class="progress-fill" style="width: 0%"></div>
                                                    </div>
                                                    <span class="text-sm text-gray-600 w-8" id="count-3">0</span>
                                                </div>
                                                <div class="flex items-center gap-3">
                                                    <span class="text-sm w-8">2★</span>
                                                    <div class="flex-1 progress-bar">
                                                        <div id="progress-2" class="progress-fill" style="width: 0%"></div>
                                                    </div>
                                                    <span class="text-sm text-gray-600 w-8" id="count-2">0</span>
                                                </div>
                                                <div class="flex items-center gap-3">
                                                    <span class="text-sm w-8">1★</span>
                                                    <div class="flex-1 progress-bar">
                                                        <div id="progress-1" class="progress-fill" style="width: 0%"></div>
                                                    </div>
                                                    <span class="text-sm text-gray-600 w-8" id="count-1">0</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Reviews List -->
                                <div id="reviews-list" class="space-y-4">
                                    <!-- Reviews will be loaded here -->
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Right Column (1/3) -->
                <div class="lg:col-span-1">
                    <!-- Image Gallery -->
                    <div class="bg-white rounded-xl p-6 shadow-sm mb-6">
                        <h3 class="font-bold text-lg mb-4">Screenshots</h3>
                        <div id="image-gallery" class="image-gallery">
                            <!-- Images will be loaded here -->
                        </div>
                    </div>

                    <!-- Company Info -->
                    <div id="company-section" class="bg-white rounded-xl p-6 shadow-sm mb-6 hidden">
                        <h3 class="font-bold text-lg mb-4">Company Information</h3>
                        <div id="company-info" class="space-y-3 text-sm">
                            <!-- Company info will be loaded here -->
                        </div>
                    </div>

                    <!-- Social Links -->
                    <div id="social-section" class="bg-white rounded-xl p-6 shadow-sm hidden">
                        <h3 class="font-bold text-lg mb-4">Connect</h3>
                        <div id="social-links" class="flex flex-wrap gap-3">
                            <!-- Social links will be loaded here -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    ${getFooter()}

    <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
    <script>
        const API_BASE = '/api';
        const SLUG = '${slug}';
        let currentAgent = null;
        let currentTab = 'overview';
        let isSaved = false;

        // Tab switching
        function switchTab(tab) {
            currentTab = tab;
            
            // Update tab buttons
            document.querySelectorAll('[id^="tab-"]').forEach(btn => {
                btn.classList.remove('tab-active', 'text-purple-600');
                btn.classList.add('text-gray-600');
            });
            document.getElementById('tab-' + tab).classList.add('tab-active');
            document.getElementById('tab-' + tab).classList.remove('text-gray-600');
            
            // Update content
            document.querySelectorAll('[id^="content-"]').forEach(content => {
                content.classList.add('hidden');
            });
            document.getElementById('content-' + tab).classList.remove('hidden');
        }

        // Load agent details
        async function loadAgent() {
            try {
                const response = await axios.get(API_BASE + '/public/' + SLUG + '/details');
                if (response.data.success) {
                    currentAgent = response.data.data.agent;
                    const features = response.data.data.features || [];
                    const useCases = response.data.data.useCases || [];
                    const screenshots = response.data.data.screenshots || [];
                    const similar = response.data.data.similar || [];
                    
                    // Track view
                    axios.post(API_BASE + '/public/' + currentAgent.id + '/view').catch(console.error);
                    
                    renderAgent(currentAgent, features, useCases, screenshots, similar);
                    await loadReviews();
                    await checkSaveStatus();
                    
                    document.getElementById('loading').classList.add('hidden');
                    document.getElementById('agent-content').classList.remove('hidden');
                }
            } catch (error) {
                console.error('Error loading agent:', error);
                document.getElementById('loading').innerHTML = '<div class="text-center py-12"><p class="text-red-600">Error loading agent.</p></div>';
            }
        }

        function renderAgent(agent, features, useCases, screenshots, similar) {
            // Update meta
            document.getElementById('page-title').textContent = agent.name + ' - AI Agents Directory';
            document.getElementById('breadcrumb-agent').textContent = agent.name;
            
            // Logo
            if (agent.logo_url) {
                document.getElementById('agent-logo').innerHTML = \`<img src="\${agent.logo_url}" alt="\${agent.name}" class="w-full h-full object-cover rounded-xl" onerror="this.outerHTML='<span class=\\'text-5xl\\'>🤖</span>'">\`;
            }
            
            // Basic info
            document.getElementById('agent-name').textContent = agent.name;
            document.getElementById('agent-tagline').textContent = agent.tagline || '';
            document.getElementById('view-count').textContent = agent.view_count || 0;
            document.getElementById('like-count').textContent = agent.upvote_count || 0;
            
            // Badges
            let badges = [];
            badges.push(\`<span class="badge bg-blue-100 text-blue-800"><i class="fas fa-tag"></i>\${agent.category_names || 'NSFW'}</span>\`);
            if (agent.is_open_source) {
                badges.push('<span class="badge bg-green-100 text-green-800"><i class="fas fa-code-branch"></i>Open Source</span>');
            }
            document.getElementById('agent-badges').innerHTML = badges.join('');
            
            // Website
            document.getElementById('visit-website-btn').href = agent.website_url;
            
            // Description
            document.getElementById('agent-description').innerHTML = agent.long_description || agent.description || 'No description available.';
            
            // Features
            if (features.length > 0) {
                document.getElementById('features-grid').innerHTML = features.map(f => \`
                    <div class="feature-card">
                        <div class="flex items-start gap-3">
                            <i class="fas fa-check-circle text-purple-600 text-xl mt-1"></i>
                            <div>
                                <h4 class="font-semibold mb-1">\${f.title}</h4>
                                <p class="text-sm text-gray-600">\${f.description || ''}</p>
                            </div>
                        </div>
                    </div>
                \`).join('');
            } else {
                document.getElementById('features-grid').innerHTML = '<p class="text-gray-600">No features listed.</p>';
            }
            
            // Use Cases
            if (useCases.length > 0) {
                document.getElementById('use-cases-list').innerHTML = useCases.map((uc, i) => \`
                    <div class="feature-card">
                        <div class="flex items-start gap-3">
                            <div class="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center font-bold flex-shrink-0">
                                \${i + 1}
                            </div>
                            <div>
                                <h4 class="font-semibold mb-1">\${uc.title}</h4>
                                <p class="text-sm text-gray-600">\${uc.description}</p>
                            </div>
                        </div>
                    </div>
                \`).join('');
            } else {
                document.getElementById('use-cases-list').innerHTML = '<p class="text-gray-600">No use cases listed.</p>';
            }
            
            // Pricing
            document.getElementById('pricing-content').innerHTML = \`
                <div class="feature-card">
                    <div class="flex items-center gap-4 mb-4">
                        <span class="text-3xl font-bold text-purple-600">\${agent.pricing_model}</span>
                        \${agent.pricing_starts_at ? \`<span class="text-gray-600">Starting at \${agent.pricing_starts_at}</span>\` : ''}
                    </div>
                    \${agent.free_plan_available ? '<p class="text-green-600"><i class="fas fa-check mr-2"></i>Free plan available</p>' : ''}
                    \${agent.free_trial_available ? '<p class="text-green-600"><i class="fas fa-check mr-2"></i>Free trial available</p>' : ''}
                </div>
            \`;
            
            // Screenshots
            if (screenshots.length > 0) {
                document.getElementById('image-gallery').innerHTML = screenshots.map(s => \`
                    <img src="\${s.image_url}" alt="\${s.title}" onclick="openImage('\${s.image_url}')">
                \`).join('');
            } else if (agent.video_thumbnail) {
                document.getElementById('image-gallery').innerHTML = \`<img src="\${agent.video_thumbnail}" alt="Thumbnail" class="col-span-2">\`;
            }
            
            // Alternatives
            if (similar.length > 0) {
                document.getElementById('alternatives-grid').innerHTML = similar.map(a => \`
                    <a href="/agents/\${a.slug}" class="feature-card block">
                        <div class="flex items-center gap-4">
                            <img src="\${a.logo_url || 'https://via.placeholder.com/50'}" alt="\${a.name}" class="w-12 h-12 rounded-lg">
                            <div>
                                <h4 class="font-semibold">\${a.name}</h4>
                                <p class="text-sm text-gray-600">\${a.tagline || ''}</p>
                            </div>
                        </div>
                    </a>
                \`).join('');
            } else {
                document.getElementById('alternatives-grid').innerHTML = '<p class="text-gray-600">No alternatives found.</p>';
            }
            
            // Company info
            if (agent.company_name) {
                document.getElementById('company-section').classList.remove('hidden');
                let companyHtml = [];
                if (agent.company_name) companyHtml.push(\`<div class="flex justify-between"><span class="text-gray-600">Company</span><span class="font-medium">\${agent.company_name}</span></div>\`);
                if (agent.founded_year) companyHtml.push(\`<div class="flex justify-between"><span class="text-gray-600">Founded</span><span class="font-medium">\${agent.founded_year}</span></div>\`);
                if (agent.headquarters) companyHtml.push(\`<div class="flex justify-between"><span class="text-gray-600">Location</span><span class="font-medium">\${agent.headquarters}</span></div>\`);
                document.getElementById('company-info').innerHTML = companyHtml.join('');
            }
            
            // Social links
            let socialLinks = [];
            if (agent.twitter_url) socialLinks.push(\`<a href="\${agent.twitter_url}" target="_blank" class="btn-secondary"><i class="fab fa-x-twitter"></i></a>\`);
            if (agent.linkedin_url) socialLinks.push(\`<a href="\${agent.linkedin_url}" target="_blank" class="btn-secondary"><i class="fab fa-linkedin"></i></a>\`);
            if (agent.discord_url) socialLinks.push(\`<a href="\${agent.discord_url}" target="_blank" class="btn-secondary"><i class="fab fa-discord"></i></a>\`);
            if (agent.github_url) socialLinks.push(\`<a href="\${agent.github_url}" target="_blank" class="btn-secondary"><i class="fab fa-github"></i></a>\`);
            
            if (socialLinks.length > 0) {
                document.getElementById('social-section').classList.remove('hidden');
                document.getElementById('social-links').innerHTML = socialLinks.join('');
            }
        }

        // Reviews
        async function loadReviews() {
            if (!currentAgent) return;
            try {
                const res = await axios.get(\`\${API_BASE}/reviews/agent/\${currentAgent.id}?page=1&limit=10\`);
                if (res.data.success) {
                    const {reviews, stats} = res.data.data;
                    
                    document.getElementById('avg-rating').textContent = (stats.average_rating || 0).toFixed(1);
                    const starDisplay = '★'.repeat(Math.round(stats.average_rating || 0)) + '☆'.repeat(5 - Math.round(stats.average_rating || 0));
                    document.getElementById('star-display').textContent = starDisplay;
                    document.getElementById('total-reviews').textContent = \`\${stats.total_reviews || 0} reviews\`;
                    document.getElementById('review-count-tab').textContent = stats.total_reviews || 0;
                    
                    // Rating breakdown
                    const total = stats.total_reviews || 1;
                    for (let i = 1; i <= 5; i++) {
                        const count = stats[\`rating_\${i}\`] || 0;
                        const percent = (count / total * 100).toFixed(0);
                        document.getElementById(\`progress-\${i}\`).style.width = percent + '%';
                        document.getElementById(\`count-\${i}\`).textContent = count;
                    }
                    
                    if (reviews.length > 0) {
                        document.getElementById('reviews-list').innerHTML = reviews.map(r => \`
                            <div class="review-card">
                                <div class="flex items-start gap-4">
                                    <div class="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                                        \${r.user_name.charAt(0).toUpperCase()}
                                    </div>
                                    <div class="flex-1">
                                        <div class="flex items-center justify-between mb-2">
                                            <div>
                                                <div class="font-bold">\${r.user_name}</div>
                                                <div class="text-yellow-500 text-sm">\${'★'.repeat(r.rating)}\${'☆'.repeat(5-r.rating)}</div>
                                            </div>
                                            <div class="text-sm text-gray-500">
                                                \${new Date(r.created_at).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <h4 class="font-semibold mb-2">\${r.review_title}</h4>
                                        <p class="text-gray-600">\${r.review_summary}</p>
                                    </div>
                                </div>
                            </div>
                        \`).join('');
                    } else {
                        document.getElementById('reviews-list').innerHTML = '<div class="text-center py-12 text-gray-500">No reviews yet. Be the first to review!</div>';
                    }
                }
            } catch (err) {
                console.error('Error loading reviews:', err);
            }
        }

        // Save functionality
        let isSaved = false;
        async function checkSaveStatus() {
            const token = localStorage.getItem('token');
            if (!token || !currentAgent) return;
            
            try {
                const response = await axios.get(API_BASE + '/saves/check/' + currentAgent.id, {
                    headers: { Authorization: 'Bearer ' + token }
                });
                if (response.data.success && response.data.saved) {
                    isSaved = true;
                    updateSaveButton();
                }
            } catch (error) {
                console.error('Error checking save status:', error);
            }
        }

        async function toggleSave() {
            const token = localStorage.getItem('token');
            if (!token) {
                window.location.href = '/login';
                return;
            }
            
            try {
                if (isSaved) {
                    await axios.delete(API_BASE + '/saves/' + currentAgent.id, {
                        headers: { Authorization: 'Bearer ' + token }
                    });
                    isSaved = false;
                } else {
                    await axios.post(API_BASE + '/saves/' + currentAgent.id, {}, {
                        headers: { Authorization: 'Bearer ' + token }
                    });
                    isSaved = true;
                }
                updateSaveButton();
            } catch (error) {
                console.error('Error saving agent:', error);
            }
        }

        function updateSaveButton() {
            const saveBtn = document.getElementById('save-btn');
            if (isSaved) {
                saveBtn.querySelector('i').className = 'fas fa-bookmark';
                document.getElementById('save-text').textContent = 'Saved';
            } else {
                saveBtn.querySelector('i').className = 'far fa-bookmark';
                document.getElementById('save-text').textContent = 'Save';
            }
        }

        function shareAgent() {
            if (navigator.share && currentAgent) {
                navigator.share({
                    title: currentAgent.name,
                    text: currentAgent.tagline,
                    url: window.location.href
                }).catch(console.error);
            } else {
                copyLink();
            }
        }

        function copyLink() {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }

        function openImage(url) {
            window.open(url, '_blank');
        }

        function showReviewForm() {
            const token = localStorage.getItem('token');
            if (!token) {
                window.location.href = '/login';
                return;
            }
            alert('Review form will be implemented here');
        }

        // Initialize
        document.addEventListener('DOMContentLoaded', loadAgent);
    </script>
</body>
</html>
`;
