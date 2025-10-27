// Enhanced Agent Detail Page
// Comprehensive layout inspired by aiagentsdirectory.com/agent/playai
// Features: YouTube video, FAQs, Use Cases, Screenshots, Company Info, and more

import { getFooter } from './components/footer';

export const enhancedAgentDetailPage = (slug: string) => `
<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title id="page-title">Agent Details - AI Agents Directory</title>
    <meta name="description" id="page-description" content="Detailed information about this AI agent">
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
        }
        
        .card {
            background-color: var(--bg-primary);
            border: 1px solid var(--border-color);
        }
        
        .video-container {
            position: relative;
            padding-bottom: 56.25%; /* 16:9 */
            height: 0;
            overflow: hidden;
            max-width: 100%;
            background: #000;
            border-radius: 12px;
        }
        
        .video-container iframe {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }
        
        .section {
            background: var(--bg-primary);
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 24px;
            border: 1px solid var(--border-color);
        }
        
        .feature-card {
            padding: 16px;
            background: var(--bg-secondary);
            border-radius: 8px;
            border-left: 4px solid #7c3aed;
        }
        
        .faq-item {
            border-bottom: 1px solid var(--border-color);
            padding: 16px 0;
        }
        
        .faq-item:last-child {
            border-bottom: none;
        }
        
        .faq-question {
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-weight: 600;
        }
        
        .faq-answer {
            display: none;
            padding-top: 12px;
            color: var(--text-secondary);
        }
        
        .faq-answer.active {
            display: block;
        }
        
        .screenshot-gallery {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 16px;
        }
        
        .screenshot-item {
            border-radius: 8px;
            overflow: hidden;
            cursor: pointer;
            transition: transform 0.2s;
        }
        
        .screenshot-item:hover {
            transform: scale(1.05);
        }
        
        .badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 0.875rem;
            font-weight: 600;
        }
        
        .badge-verified {
            background: #22c55e;
            color: white;
        }
        
        .badge-featured {
            background: #f59e0b;
            color: white;
        }
        
        .pros-cons-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 24px;
        }
        
        @media (max-width: 768px) {
            .pros-cons-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <!-- Navigation -->
    <nav class="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50 card border-0">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16 items-center">
                <a href="/" class="flex items-center">
                    <i class="fas fa-robot text-3xl text-purple-600 mr-3"></i>
                    <span class="text-xl font-bold">AI Agents Directory</span>
                </a>
                <div class="flex items-center space-x-4">
                    <button onclick="toggleDarkMode()" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                        <i id="theme-icon" class="fas fa-moon text-xl"></i>
                    </button>
                    <a href="/" class="text-gray-700 dark:text-gray-300 hover:text-purple-600">Home</a>
                    <a href="/agents" class="text-gray-700 dark:text-gray-300 hover:text-purple-600">Browse</a>
                    <a href="/categories" class="text-gray-700 dark:text-gray-300 hover:text-purple-600">Categories</a>
                </div>
            </div>
        </div>
    </nav>

    <div id="loading" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="text-center py-12">
            <i class="fas fa-spinner fa-spin text-6xl text-purple-600 mb-4"></i>
            <p class="text-gray-600">Loading agent details...</p>
        </div>
    </div>

    <div id="agent-content" class="hidden max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Hero Section with Video -->
        <div class="section">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Left: Agent Info -->
                <div class="lg:col-span-2">
                    <div class="flex items-start gap-6 mb-6">
                        <div id="agent-logo" class="w-24 h-24 flex-shrink-0 bg-gradient-to-br from-purple-400 to-indigo-600 rounded-lg flex items-center justify-center">
                            <span class="text-5xl">🤖</span>
                        </div>
                        <div class="flex-1">
                            <div class="flex items-start justify-between mb-2">
                                <div>
                                    <h1 id="agent-name" class="text-4xl font-bold mb-2">Agent Name</h1>
                                    <p id="agent-tagline" class="text-xl text-gray-600 dark:text-gray-400 mb-3">Tagline</p>
                                    <div id="agent-badges" class="flex flex-wrap gap-2">
                                        <!-- Badges loaded here -->
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div id="agent-categories" class="flex flex-wrap gap-2 mb-6">
                        <!-- Categories -->
                    </div>

                    <div class="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400 mb-6">
                        <span><i class="fas fa-eye text-purple-600"></i> <span id="view-count">0</span> views</span>
                        <span><i class="fas fa-arrow-up text-purple-600"></i> <span id="upvotes-display">0</span> upvotes</span>
                        <span><i class="fas fa-star text-yellow-500"></i> <span id="review-count">0</span> reviews</span>
                    </div>

                    <div class="flex gap-4">
                        <a id="visit-website-btn" href="#" target="_blank" onclick="trackClick()" class="flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 text-center">
                            <i class="fas fa-external-link-alt mr-2"></i>Visit Website
                        </a>
                        <button id="upvote-btn" onclick="upvoteAgent()" class="px-6 py-3 bg-gray-200 dark:bg-gray-700 rounded-lg font-semibold hover:bg-gray-300 flex items-center gap-2">
                            <i class="fas fa-arrow-up"></i>
                            <span id="upvote-count">0</span>
                        </button>
                        <button onclick="shareAgent()" class="px-6 py-3 border-2 border-purple-600 text-purple-600 rounded-lg font-semibold hover:bg-purple-50">
                            <i class="fas fa-share-alt"></i>
                        </button>
                    </div>
                </div>

                <!-- Right: Video -->
                <div class="lg:col-span-1">
                    <div id="video-container">
                        <!-- YouTube video or placeholder -->
                    </div>
                </div>
            </div>
        </div>

        <!-- Overview Section -->
        <div class="section">
            <h2 class="text-3xl font-bold mb-4 flex items-center">
                <i class="fas fa-info-circle text-purple-600 mr-3"></i>
                Overview
            </h2>
            <div id="agent-description" class="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
                <!-- Description -->
            </div>
        </div>

        <!-- Key Features Section -->
        <div class="section">
            <h2 class="text-3xl font-bold mb-6 flex items-center">
                <i class="fas fa-list-check text-purple-600 mr-3"></i>
                Key Features
            </h2>
            <div id="features-grid" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Features loaded here -->
            </div>
        </div>

        <!-- Use Cases Section -->
        <div class="section" id="use-cases-section" style="display: none;">
            <h2 class="text-3xl font-bold mb-6 flex items-center">
                <i class="fas fa-lightbulb text-purple-600 mr-3"></i>
                Use Cases
            </h2>
            <div id="use-cases-list" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <!-- Use cases loaded here -->
            </div>
        </div>

        <!-- Pricing Section -->
        <div class="section">
            <h2 class="text-3xl font-bold mb-6 flex items-center">
                <i class="fas fa-dollar-sign text-purple-600 mr-3"></i>
                Pricing
            </h2>
            <div id="pricing-content">
                <!-- Pricing info -->
            </div>
        </div>

        <!-- Screenshots Gallery -->
        <div class="section" id="screenshots-section" style="display: none;">
            <h2 class="text-3xl font-bold mb-6 flex items-center">
                <i class="fas fa-images text-purple-600 mr-3"></i>
                Screenshots
            </h2>
            <div id="screenshots-gallery" class="screenshot-gallery">
                <!-- Screenshots loaded here -->
            </div>
        </div>

        <!-- Pros & Cons -->
        <div class="section" id="pros-cons-section" style="display: none;">
            <h2 class="text-3xl font-bold mb-6 flex items-center">
                <i class="fas fa-balance-scale text-purple-600 mr-3"></i>
                Pros & Cons
            </h2>
            <div class="pros-cons-grid">
                <div>
                    <h3 class="text-xl font-bold text-green-600 mb-4"><i class="fas fa-check-circle mr-2"></i>Pros</h3>
                    <ul id="pros-list" class="space-y-2">
                        <!-- Pros loaded here -->
                    </ul>
                </div>
                <div>
                    <h3 class="text-xl font-bold text-red-600 mb-4"><i class="fas fa-times-circle mr-2"></i>Cons</h3>
                    <ul id="cons-list" class="space-y-2">
                        <!-- Cons loaded here -->
                    </ul>
                </div>
            </div>
        </div>

        <!-- FAQ Section -->
        <div class="section" id="faq-section" style="display: none;">
            <h2 class="text-3xl font-bold mb-6 flex items-center">
                <i class="fas fa-question-circle text-purple-600 mr-3"></i>
                Frequently Asked Questions
            </h2>
            <div id="faq-list">
                <!-- FAQs loaded here -->
            </div>
        </div>

        <!-- Company Information -->
        <div class="section" id="company-section" style="display: none;">
            <h2 class="text-3xl font-bold mb-6 flex items-center">
                <i class="fas fa-building text-purple-600 mr-3"></i>
                Company Information
            </h2>
            <div id="company-info" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <!-- Company info loaded here -->
            </div>
        </div>

        <!-- Alternative Agents -->
        <div class="section">
            <h2 class="text-3xl font-bold mb-6 flex items-center">
                <i class="fas fa-exchange-alt text-purple-600 mr-3"></i>
                Similar Agents
            </h2>
            <div id="similar-agents" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <!-- Similar agents loaded here -->
            </div>
        </div>
    </div>

    ${getFooter()}

    <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
    <script>
        const API_BASE = '/api';
        const SLUG = '${slug}';
        let currentAgent = null;

        // Dark Mode
        function toggleDarkMode() {
            const html = document.documentElement;
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            document.getElementById('theme-icon').className = newTheme === 'dark' ? 'fas fa-sun text-xl' : 'fas fa-moon text-xl';
        }

        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        if (savedTheme === 'dark') {
            document.getElementById('theme-icon').className = 'fas fa-sun text-xl';
        }

        // Load Agent Details
        async function loadAgent() {
            try {
                const response = await axios.get(API_BASE + '/public/' + SLUG + '/details');
                if (response.data.success) {
                    currentAgent = response.data.data.agent;
                    const features = response.data.data.features || [];
                    const useCases = response.data.data.use_cases || [];
                    const faqs = response.data.data.faqs || [];
                    const pricingPlans = response.data.data.pricing_plans || [];
                    const screenshots = response.data.data.screenshots || [];
                    const prosCons = response.data.data.pros_cons || [];
                    const similar = response.data.data.similar || [];
                    
                    // Track view
                    axios.post(API_BASE + '/public/' + currentAgent.id + '/view');
                    
                    renderAgent(currentAgent, features, useCases, faqs, pricingPlans, screenshots, prosCons, similar);
                    
                    // Start vote count polling
                    startVoteCountPolling();
                    
                    document.getElementById('loading').classList.add('hidden');
                    document.getElementById('agent-content').classList.remove('hidden');
                }
            } catch (error) {
                console.error('Error loading agent:', error);
                document.getElementById('loading').innerHTML = '<div class="text-center py-12"><p class="text-red-600">Error loading agent. Please try again.</p></div>';
            }
        }

        function renderAgent(agent, features, useCases, faqs, pricingPlans, screenshots, prosCons, similar) {
            // Basic info
            document.getElementById('page-title').textContent = agent.name + ' - AI Agents Directory';
            document.getElementById('page-description').setAttribute('content', agent.tagline || agent.description);
            
            document.getElementById('agent-logo').innerHTML = \`<span class="text-5xl">\${agent.logo_url || '🤖'}</span>\`;
            document.getElementById('agent-name').textContent = agent.name;
            document.getElementById('agent-tagline').textContent = agent.tagline || '';
            
            // Badges
            let badges = [];
            if (agent.verified_status) {
                badges.push('<span class="badge badge-verified"><i class="fas fa-check-circle"></i>Verified</span>');
            }
            if (agent.is_featured && agent.is_featured !== 'NONE') {
                badges.push('<span class="badge badge-featured"><i class="fas fa-star"></i>Featured</span>');
            }
            if (agent.is_open_source) {
                badges.push('<span class="badge" style="background: #10b981; color: white;"><i class="fas fa-code-branch"></i>Open Source</span>');
            }
            document.getElementById('agent-badges').innerHTML = badges.join('');
            
            // Categories
            if (agent.category_names) {
                const categories = agent.category_names.split(',');
                document.getElementById('agent-categories').innerHTML = categories.map(cat => 
                    \`<span class="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 text-sm font-semibold rounded-full">\${cat}</span>\`
                ).join('');
            }
            
            // Stats
            document.getElementById('view-count').textContent = agent.view_count || 0;
            document.getElementById('upvotes-display').textContent = agent.upvote_count || 0;
            document.getElementById('upvote-count').textContent = agent.upvote_count || 0;
            document.getElementById('review-count').textContent = agent.review_count || 0;
            
            // Links
            document.getElementById('visit-website-btn').href = agent.website_url;
            
            // YouTube Video
            if (agent.youtube_url) {
                const videoId = extractYouTubeId(agent.youtube_url);
                if (videoId) {
                    document.getElementById('video-container').innerHTML = \`
                        <div class="video-container">
                            <iframe src="https://www.youtube.com/embed/\${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                        </div>
                    \`;
                } else {
                    renderVideoPlaceholder();
                }
            } else {
                renderVideoPlaceholder();
            }
            
            // Description
            document.getElementById('agent-description').innerHTML = \`<p>\${agent.long_description || agent.description || 'No description available.'}</p>\`;
            
            // Features
            if (features.length > 0) {
                document.getElementById('features-grid').innerHTML = features.map(f => \`
                    <div class="feature-card">
                        <h4 class="font-semibold mb-2"><i class="fas fa-check text-purple-600 mr-2"></i>\${f.title || f.description}</h4>
                        <p class="text-sm text-gray-600 dark:text-gray-400">\${f.description || ''}</p>
                    </div>
                \`).join('');
            } else {
                document.getElementById('features-grid').innerHTML = '<p class="text-gray-600">No features listed yet.</p>';
            }
            
            // Use Cases
            if (useCases.length > 0) {
                document.getElementById('use-cases-section').style.display = 'block';
                document.getElementById('use-cases-list').innerHTML = useCases.map(uc => \`
                    <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <h4 class="font-semibold mb-2"><i class="fas fa-arrow-right text-purple-600 mr-2"></i>\${uc.title}</h4>
                        <p class="text-sm text-gray-600 dark:text-gray-400">\${uc.description}</p>
                    </div>
                \`).join('');
            }
            
            // Pricing
            renderPricing(agent, pricingPlans);
            
            // Screenshots
            if (screenshots.length > 0) {
                document.getElementById('screenshots-section').style.display = 'block';
                document.getElementById('screenshots-gallery').innerHTML = screenshots.map(s => \`
                    <div class="screenshot-item">
                        <img src="\${s.image_url}" alt="\${s.title}" class="w-full h-48 object-cover">
                        <div class="p-2 bg-gray-100 dark:bg-gray-800">
                            <p class="text-sm font-medium">\${s.title}</p>
                        </div>
                    </div>
                \`).join('');
            }
            
            // Pros & Cons
            const pros = prosCons.filter(pc => pc.type === 'PRO');
            const cons = prosCons.filter(pc => pc.type === 'CON');
            if (pros.length > 0 || cons.length > 0) {
                document.getElementById('pros-cons-section').style.display = 'block';
                document.getElementById('pros-list').innerHTML = pros.map(p => \`<li class="flex items-start gap-2"><i class="fas fa-check text-green-600 mt-1"></i><span>\${p.description}</span></li>\`).join('');
                document.getElementById('cons-list').innerHTML = cons.map(c => \`<li class="flex items-start gap-2"><i class="fas fa-times text-red-600 mt-1"></i><span>\${c.description}</span></li>\`).join('');
            }
            
            // FAQs
            if (faqs.length > 0) {
                document.getElementById('faq-section').style.display = 'block';
                document.getElementById('faq-list').innerHTML = faqs.map((faq, i) => \`
                    <div class="faq-item">
                        <div class="faq-question" onclick="toggleFaq(\${i})">
                            <span>\${faq.question}</span>
                            <i class="fas fa-chevron-down" id="faq-icon-\${i}"></i>
                        </div>
                        <div class="faq-answer" id="faq-answer-\${i}">
                            <p>\${faq.answer}</p>
                        </div>
                    </div>
                \`).join('');
            }
            
            // Company Info
            if (agent.company_name) {
                document.getElementById('company-section').style.display = 'block';
                let companyHtml = [];
                if (agent.company_name) companyHtml.push(\`<div><div class="text-sm text-gray-600 mb-1">Company</div><div class="font-semibold">\${agent.company_name}</div></div>\`);
                if (agent.founded_year) companyHtml.push(\`<div><div class="text-sm text-gray-600 mb-1">Founded</div><div class="font-semibold">\${agent.founded_year}</div></div>\`);
                if (agent.headquarters) companyHtml.push(\`<div><div class="text-sm text-gray-600 mb-1">Headquarters</div><div class="font-semibold">\${agent.headquarters}</div></div>\`);
                if (agent.company_size) companyHtml.push(\`<div><div class="text-sm text-gray-600 mb-1">Company Size</div><div class="font-semibold">\${agent.company_size}</div></div>\`);
                document.getElementById('company-info').innerHTML = companyHtml.join('');
            }
            
            // Similar agents
            renderSimilarAgents(similar);
        }

        function extractYouTubeId(url) {
            const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
            const match = url.match(regExp);
            return (match && match[7].length === 11) ? match[7] : null;
        }

        function renderVideoPlaceholder() {
            document.getElementById('video-container').innerHTML = \`
                <div class="bg-gradient-to-br from-purple-400 to-indigo-600 rounded-lg p-8 text-center text-white">
                    <i class="fas fa-video text-6xl mb-4 opacity-50"></i>
                    <p class="text-lg">No video available</p>
                </div>
            \`;
        }

        function renderPricing(agent, pricingPlans) {
            let html = \`<div class="mb-6"><p class="text-2xl font-bold text-purple-600">\${agent.pricing_model}</p>\`;
            if (agent.pricing_starts_at) {
                html += \`<p class="text-gray-600">Starting at \${agent.pricing_starts_at}</p>\`;
            }
            if (agent.free_plan_available) {
                html += \`<p class="text-green-600 mt-2"><i class="fas fa-check-circle mr-2"></i>Free plan available</p>\`;
            }
            if (agent.free_trial_available) {
                html += \`<p class="text-green-600"><i class="fas fa-check-circle mr-2"></i>Free trial: \${agent.free_trial_days || 'Available'} days</p>\`;
            }
            html += \`</div>\`;
            
            if (pricingPlans.length > 0) {
                html += \`<div class="grid grid-cols-1 md:grid-cols-3 gap-4">\`;
                pricingPlans.forEach(plan => {
                    html += \`
                        <div class="border-2 \${plan.is_popular ? 'border-purple-600' : 'border-gray-200'} rounded-lg p-6">
                            \${plan.is_popular ? '<div class="text-purple-600 font-bold mb-2">MOST POPULAR</div>' : ''}
                            <h4 class="text-xl font-bold mb-2">\${plan.name}</h4>
                            <p class="text-3xl font-bold mb-4">\${plan.price}<span class="text-sm text-gray-600">/\${plan.billing_period}</span></p>
                            <ul class="space-y-2 mb-6">
                                \${plan.features_list ? JSON.parse(plan.features_list).map(f => \`<li class="flex items-center gap-2"><i class="fas fa-check text-green-600"></i><span>\${f}</span></li>\`).join('') : ''}
                            </ul>
                            \${plan.cta_url ? \`<a href="\${plan.cta_url}" target="_blank" class="block w-full py-2 px-4 bg-purple-600 text-white text-center rounded-lg hover:bg-purple-700">\${plan.cta_text || 'Get Started'}</a>\` : ''}
                        </div>
                    \`;
                });
                html += \`</div>\`;
            }
            
            document.getElementById('pricing-content').innerHTML = html;
        }

        function renderSimilarAgents(agents) {
            if (!agents || agents.length === 0) {
                document.getElementById('similar-agents').innerHTML = '<p class="text-gray-600">No similar agents found.</p>';
                return;
            }
            
            document.getElementById('similar-agents').innerHTML = agents.map(agent => \`
                <a href="/agents/\${agent.slug}" class="card p-4 rounded-lg hover:shadow-lg transition">
                    <div class="text-4xl mb-3 text-center">\${agent.logo_url || '🤖'}</div>
                    <h3 class="font-bold text-lg mb-2 text-center">\${agent.name}</h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400 text-center line-clamp-2">\${agent.tagline || agent.description}</p>
                    <div class="mt-4 flex items-center justify-between text-sm">
                        <span class="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 rounded text-xs">\${agent.pricing_model}</span>
                        <span class="text-gray-500"><i class="fas fa-arrow-up mr-1"></i>\${agent.upvote_count}</span>
                    </div>
                </a>
            \`).join('');
        }

        function toggleFaq(index) {
            const answer = document.getElementById('faq-answer-' + index);
            const icon = document.getElementById('faq-icon-' + index);
            
            if (answer.classList.contains('active')) {
                answer.classList.remove('active');
                icon.className = 'fas fa-chevron-down';
            } else {
                // Close all other FAQs
                document.querySelectorAll('.faq-answer').forEach(a => a.classList.remove('active'));
                document.querySelectorAll('[id^="faq-icon-"]').forEach(i => i.className = 'fas fa-chevron-down');
                
                answer.classList.add('active');
                icon.className = 'fas fa-chevron-up';
            }
        }

        async function upvoteAgent() {
            try {
                const response = await axios.post(API_BASE + '/public/' + currentAgent.id + '/upvote');
                if (response.data.success) {
                    currentAgent.upvote_count = response.data.data.upvote_count;
                    document.getElementById('upvote-count').textContent = currentAgent.upvote_count;
                    document.getElementById('upvotes-display').textContent = currentAgent.upvote_count;
                    showToast('Upvote recorded!', 'success');
                }
            } catch (error) {
                showToast(error.response?.data?.error || 'Error recording upvote', 'error');
            }
        }

        function trackClick() {
            if (currentAgent) {
                axios.post(API_BASE + '/public/' + currentAgent.id + '/click').catch(console.error);
            }
        }

        function shareAgent() {
            const url = window.location.href;
            if (navigator.share) {
                navigator.share({
                    title: currentAgent.name,
                    text: currentAgent.tagline,
                    url: url
                }).catch(console.error);
            } else {
                navigator.clipboard.writeText(url);
                showToast('Link copied to clipboard!', 'success');
            }
        }

        // Real-time vote count update
        let voteCountInterval = null;
        async function updateVoteCount() {
            if (!currentAgent) return;
            try {
                const response = await axios.get(API_BASE + '/public/' + currentAgent.id + '/vote-count');
                if (response.data.success) {
                    const newCount = response.data.data.upvote_count;
                    if (newCount !== currentAgent.upvote_count) {
                        currentAgent.upvote_count = newCount;
                        document.getElementById('upvotes-display').textContent = newCount;
                        document.getElementById('upvote-count').textContent = newCount;
                    }
                }
            } catch (error) {
                console.error('Error fetching vote count:', error);
            }
        }

        function startVoteCountPolling() {
            if (voteCountInterval) clearInterval(voteCountInterval);
            voteCountInterval = setInterval(updateVoteCount, 3000);
        }

        function showToast(message, type = 'info') {
            const toast = document.createElement('div');
            toast.className = \`fixed bottom-4 right-4 px-6 py-4 rounded-lg shadow-lg z-50 \${
                type === 'success' ? 'bg-green-500' : 
                type === 'error' ? 'bg-red-500' : 'bg-blue-500'
            } text-white\`;
            toast.textContent = message;
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 3000);
        }

        // Initialize
        document.addEventListener('DOMContentLoaded', loadAgent);
    </script>
</body>
</html>
`;
