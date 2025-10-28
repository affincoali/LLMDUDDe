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

                    <div class="grid grid-cols-2 gap-3 mb-4">
                        <a id="visit-website-btn" href="#" target="_blank" onclick="trackClick()" class="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 text-center">
                            <i class="fas fa-external-link-alt mr-2"></i>Visit Website
                        </a>
                        <button id="upvote-btn" onclick="upvoteAgent()" class="px-6 py-3 bg-gray-200 dark:bg-gray-700 rounded-lg font-semibold hover:bg-gray-300 flex items-center justify-center gap-2">
                            <i class="fas fa-arrow-up"></i>
                            <span id="upvote-count">0</span>
                        </button>
                        <button id="save-btn" onclick="toggleSave()" class="px-6 py-3 bg-gray-200 dark:bg-gray-700 rounded-lg font-semibold hover:bg-gray-300 flex items-center justify-center gap-2">
                            <i class="far fa-bookmark"></i>
                            <span id="save-text">Save</span>
                        </button>
                        <button onclick="shareAgent()" class="px-6 py-3 border-2 border-purple-600 text-purple-600 rounded-lg font-semibold hover:bg-purple-50">
                            <i class="fas fa-share-alt mr-2"></i>Share
                        </button>
                    </div>
                    
                    <!-- Social Media Links -->
                    <div id="social-links" class="flex gap-3">
                        <!-- Social icons will be added here -->
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

        <!-- Reviews & Ratings Section -->
        <div class="section">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-3xl font-bold flex items-center">
                    <i class="fas fa-star text-purple-600 mr-3"></i>
                    Reviews & Ratings
                </h2>
                <div class="flex items-center gap-4">
                    <div class="text-right">
                        <div class="text-4xl font-bold" id="avg-rating">0.0</div>
                        <div class="text-yellow-500" id="star-display">☆☆☆☆☆</div>
                        <div class="text-sm" style="color:var(--text-secondary)" id="total-reviews">0 reviews</div>
                    </div>
                    <button onclick="showReviewForm()" id="write-review-btn" class="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium">
                        <i class="fas fa-pencil-alt mr-2"></i>Write a Review
                    </button>
                </div>
            </div>

            <!-- Review Form (hidden by default) -->
            <div id="review-form" class="card border rounded-lg p-6 mb-6 hidden">
                <h3 class="text-xl font-bold mb-4">Share Your Experience</h3>
                <div class="mb-4">
                    <label class="block mb-2 font-medium">Rate ${slug} <span class="text-red-500">*</span></label>
                    <div class="flex gap-2" id="rating-stars">
                        <button class="star-btn text-4xl text-gray-300 hover:text-yellow-500" data-rating="1">☆</button>
                        <button class="star-btn text-4xl text-gray-300 hover:text-yellow-500" data-rating="2">☆</button>
                        <button class="star-btn text-4xl text-gray-300 hover:text-yellow-500" data-rating="3">☆</button>
                        <button class="star-btn text-4xl text-gray-300 hover:text-yellow-500" data-rating="4">☆</button>
                        <button class="star-btn text-4xl text-gray-300 hover:text-yellow-500" data-rating="5">☆</button>
                    </div>
                    <p class="text-sm mt-1 text-red-500" id="rating-error" style="display:none">Please select a star rating</p>
                </div>
                <div class="mb-4">
                    <label class="block mb-2 font-medium">Review Title <span class="text-red-500">*</span></label>
                    <input type="text" id="review-title" placeholder="Summarize your experience" 
                           class="card w-full px-4 py-2 border rounded-lg" maxlength="100">
                    <p class="text-sm mt-1" style="color:var(--text-secondary)">100 characters remaining</p>
                </div>
                <div class="mb-4">
                    <label class="block mb-2 font-medium">Your Review <span class="text-red-500">*</span> (minimum 20 characters)</label>
                    <textarea id="review-summary" placeholder="What did you like or dislike? How was your experience with this AI agent?" 
                              class="card w-full px-4 py-2 border rounded-lg" rows="5" maxlength="2000"></textarea>
                    <p class="text-sm mt-1" style="color:var(--text-secondary)"><span id="review-char-count">0</span>/2000 characters remaining</p>
                </div>
                <div class="flex gap-4">
                    <button onclick="submitReview()" class="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 font-medium">
                        Login to Submit Review
                    </button>
                    <button onclick="hideReviewForm()" class="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                        Cancel
                    </button>
                </div>
            </div>

            <!-- Reviews List -->
            <div id="reviews-list" class="space-y-6">
                <div class="text-center py-12" style="color:var(--text-secondary)">
                    <i class="fas fa-spinner fa-spin text-4xl mb-4"></i>
                    <p>Loading reviews...</p>
                </div>
            </div>

            <!-- Load More Button -->
            <div id="load-more-container" class="text-center mt-6" style="display:none">
                <button onclick="loadMoreReviews()" class="px-6 py-3 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                    Load More Reviews
                </button>
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
                    const useCases = response.data.data.useCases || [];
                    const faqs = response.data.data.faqs || [];
                    const pricingPlans = response.data.data.pricingPlans || [];
                    const screenshots = response.data.data.screenshots || [];
                    const pros = response.data.data.pros || [];
                    const cons = response.data.data.cons || [];
                    const similar = response.data.data.similar || [];
                    
                    // Track view
                    axios.post(API_BASE + '/public/' + currentAgent.id + '/view').catch(err => console.error('View tracking error:', err));
                    
                    renderAgent(currentAgent, features, useCases, faqs, pricingPlans, screenshots, pros, cons, similar);
                    
                    // Check save status
                    await checkSaveStatus();
                    
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

        function renderAgent(agent, features, useCases, faqs, pricingPlans, screenshots, pros, cons, similar) {
            // Basic info
            document.getElementById('page-title').textContent = agent.name + ' - AI Agents Directory';
            document.getElementById('page-description').setAttribute('content', agent.tagline || agent.description);
            
            document.getElementById('agent-logo').innerHTML = agent.logo_url ? \`
                <img src="\${agent.logo_url}" alt="\${agent.name}" loading="lazy" class="w-20 h-20 rounded-lg object-cover" 
                    onerror="this.outerHTML='<span class=\\'text-5xl\\'>🤖</span>'">
            \` : '<span class="text-5xl">🤖</span>';
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
            
            // Check if already upvoted in session
            const upvoteKey = 'upvoted_' + agent.id;
            if (sessionStorage.getItem(upvoteKey)) {
                const upvoteBtn = document.getElementById('upvote-btn');
                if (upvoteBtn) {
                    upvoteBtn.classList.add('opacity-50', 'cursor-not-allowed');
                    upvoteBtn.innerHTML = '<i class="fas fa-check mr-2"></i>Upvoted';
                }
            }
            
            // Links
            document.getElementById('visit-website-btn').href = agent.website_url;
            
            // Social Media Links
            renderSocialLinks(agent);
            
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
                        <img src="\${s.image_url}" alt="\${s.title}" loading="lazy" class="w-full h-48 object-cover">
                        <div class="p-2 bg-gray-100 dark:bg-gray-800">
                            <p class="text-sm font-medium">\${s.title}</p>
                        </div>
                    </div>
                \`).join('');
            }
            
            // Pros & Cons
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
            
            // Load reviews
            loadReviews();
        }

        function extractYouTubeId(url) {
            if (!url) return null;
            // Extract YouTube video ID from various URL formats
            let videoId = null;
            
            // Check for youtu.be short links
            if (url.includes('youtu.be/')) {
                videoId = url.split('youtu.be/')[1].split(/[?&#]/)[0];
            }
            // Check for youtube.com/watch?v= format
            else if (url.includes('youtube.com/watch?v=')) {
                videoId = url.split('v=')[1].split(/[&#]/)[0];
            }
            // Check for youtube.com/embed/ format
            else if (url.includes('youtube.com/embed/')) {
                videoId = url.split('embed/')[1].split(/[?&#]/)[0];
            }
            // Check for youtube.com/v/ format
            else if (url.includes('youtube.com/v/')) {
                videoId = url.split('v/')[1].split(/[?&#]/)[0];
            }
            
            // Validate video ID is 11 characters
            return (videoId && videoId.length === 11) ? videoId : null;
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
                    <div class="mb-3 text-center flex items-center justify-center">
                        \${agent.logo_url ? \`
                            <img src="\${agent.logo_url}" alt="\${agent.name}" loading="lazy" class="w-16 h-16 rounded-lg object-cover" 
                                onerror="this.outerHTML='<span class=\\'text-4xl\\'>🤖</span>'">
                        \` : '<span class="text-4xl">🤖</span>'}
                    </div>
                    <h3 class="font-bold text-lg mb-2 text-center">\${agent.name}</h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400 text-center line-clamp-2">\${agent.tagline || agent.description}</p>
                    <div class="mt-4 flex items-center justify-between text-sm">
                        <span class="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 rounded text-xs">\${agent.pricing_model}</span>
                        <span class="text-gray-500"><i class="fas fa-arrow-up mr-1"></i>\${agent.upvote_count}</span>
                    </div>
                </a>
            \`).join('');
        }

        // Review Functions
        let selectedRating = 0;
        let currentReviewPage = 1;

        async function loadReviews() {
            if (!currentAgent) return;
            try {
                const res = await axios.get(\`\${API_BASE}/reviews/agent/\${currentAgent.id}?page=\${currentReviewPage}&limit=5\`);
                if (res.data.success) {
                    const {reviews, stats, pagination} = res.data.data;
                    
                    // Update stats
                    document.getElementById('avg-rating').textContent = (stats.average_rating || 0).toFixed(1);
                    const starDisplay = '★'.repeat(Math.round(stats.average_rating || 0)) + '☆'.repeat(5 - Math.round(stats.average_rating || 0));
                    document.getElementById('star-display').textContent = starDisplay;
                    document.getElementById('total-reviews').textContent = \`\${stats.total_reviews || 0} reviews\`;
                    
                    // Render reviews
                    if (reviews.length === 0 && currentReviewPage === 1) {
                        document.getElementById('reviews-list').innerHTML = \`
                            <div class="card border rounded-lg p-12 text-center">
                                <i class="fas fa-comments text-6xl text-gray-300 mb-4"></i>
                                <p class="text-xl mb-2" style="color:var(--text-primary)">No reviews yet</p>
                                <p style="color:var(--text-secondary)">Be the first to share your experience!</p>
                            </div>
                        \`;
                    } else {
                        const reviewsHtml = reviews.map(r => \`
                            <div class="card border rounded-lg p-6">
                                <div class="flex items-start gap-4">
                                    <div class="flex-shrink-0">
                                        <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                            \${r.user_name.charAt(0).toUpperCase()}
                                        </div>
                                    </div>
                                    <div class="flex-1">
                                        <div class="flex items-center justify-between mb-2">
                                            <div>
                                                <div class="font-bold">\${r.user_name}</div>
                                                <div class="text-yellow-500">\${'★'.repeat(r.rating)}\${'☆'.repeat(5-r.rating)}</div>
                                            </div>
                                            <div class="text-sm" style="color:var(--text-secondary)">
                                                \${new Date(r.created_at).toLocaleDateString('en-US', {year:'numeric', month:'long', day:'numeric'})}
                                            </div>
                                        </div>
                                        <h4 class="font-bold text-lg mb-2">\${r.review_title}</h4>
                                        <p style="color:var(--text-secondary)">\${r.review_summary}</p>
                                    </div>
                                </div>
                            </div>
                        \`).join('');
                        
                        if (currentReviewPage === 1) {
                            document.getElementById('reviews-list').innerHTML = reviewsHtml;
                        } else {
                            document.getElementById('reviews-list').innerHTML += reviewsHtml;
                        }
                        
                        // Show/hide load more button
                        if (currentReviewPage < pagination.pages) {
                            document.getElementById('load-more-container').style.display = 'block';
                        } else {
                            document.getElementById('load-more-container').style.display = 'none';
                        }
                    }
                }
            } catch (err) {
                console.error('Error loading reviews:', err);
            }
        }

        function loadMoreReviews() {
            currentReviewPage++;
            loadReviews();
        }

        function showReviewForm() {
            // Check if user is logged in
            const token = localStorage.getItem('token');
            if (!token) {
                showToast('Please login to write a review', 'error');
                setTimeout(() => window.location.href = '/login', 1500);
                return;
            }
            document.getElementById('review-form').classList.remove('hidden');
            document.getElementById('write-review-btn').style.display = 'none';
        }

        function hideReviewForm() {
            document.getElementById('review-form').classList.add('hidden');
            document.getElementById('write-review-btn').style.display = 'block';
            selectedRating = 0;
            document.querySelectorAll('.star-btn').forEach(btn => {
                btn.textContent = '☆';
                btn.classList.remove('text-yellow-500');
                btn.classList.add('text-gray-300');
            });
        }

        // Star rating selection
        document.addEventListener('DOMContentLoaded', () => {
            document.querySelectorAll('.star-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    selectedRating = parseInt(this.dataset.rating);
                    document.getElementById('rating-error').style.display = 'none';
                    
                    document.querySelectorAll('.star-btn').forEach((b, i) => {
                        if (i < selectedRating) {
                            b.textContent = '★';
                            b.classList.add('text-yellow-500');
                            b.classList.remove('text-gray-300');
                        } else {
                            b.textContent = '☆';
                            b.classList.remove('text-yellow-500');
                            b.classList.add('text-gray-300');
                        }
                    });
                });
            });
            
            // Character counter
            const summaryInput = document.getElementById('review-summary');
            const charCount = document.getElementById('review-char-count');
            if (summaryInput && charCount) {
                summaryInput.addEventListener('input', function() {
                    charCount.textContent = 2000 - this.value.length;
                });
            }
        });

        async function submitReview() {
            const token = localStorage.getItem('token');
            if (!token) {
                showToast('Please login to submit a review', 'error');
                setTimeout(() => window.location.href = '/login', 1500);
                return;
            }

            const title = document.getElementById('review-title').value.trim();
            const summary = document.getElementById('review-summary').value.trim();

            // Validation
            if (selectedRating === 0) {
                document.getElementById('rating-error').style.display = 'block';
                showToast('Please select a rating', 'error');
                return;
            }

            if (!title) {
                showToast('Please enter a review title', 'error');
                return;
            }

            if (summary.length < 20) {
                showToast('Review must be at least 20 characters', 'error');
                return;
            }

            try {
                const res = await axios.post(\`\${API_BASE}/reviews/submit\`, {
                    agent_id: currentAgent.id,
                    rating: selectedRating,
                    review_title: title,
                    review_summary: summary
                }, {
                    headers: { Authorization: \`Bearer \${token}\` }
                });

                if (res.data.success) {
                    showToast('Review submitted! It will appear after admin approval.', 'success');
                    hideReviewForm();
                    document.getElementById('review-title').value = '';
                    document.getElementById('review-summary').value = '';
                }
            } catch (err) {
                const msg = err.response?.data?.message || 'Failed to submit review';
                showToast(msg, 'error');
            }
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

        function renderSocialLinks(agent) {
            const socialContainer = document.getElementById('social-links');
            let links = [];
            
            if (agent.twitter_url) {
                links.push(\`<a href="\${agent.twitter_url}" target="_blank" class="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 transition" title="Twitter/X"><i class="fab fa-x-twitter"></i></a>\`);
            }
            if (agent.linkedin_url) {
                links.push(\`<a href="\${agent.linkedin_url}" target="_blank" class="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 transition" title="LinkedIn"><i class="fab fa-linkedin"></i></a>\`);
            }
            if (agent.discord_url) {
                links.push(\`<a href="\${agent.discord_url}" target="_blank" class="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 transition" title="Discord"><i class="fab fa-discord"></i></a>\`);
            }
            if (agent.github_url) {
                links.push(\`<a href="\${agent.github_url}" target="_blank" class="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 transition" title="GitHub"><i class="fab fa-github"></i></a>\`);
            }
            
            if (links.length > 0) {
                socialContainer.innerHTML = '<div class="text-sm text-gray-600 dark:text-gray-400 mb-2">Connect:</div>' + links.join('');
            }
        }

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
                showToast('Please login to save agents', 'error');
                setTimeout(() => window.location.href = '/login', 1500);
                return;
            }
            
            try {
                if (isSaved) {
                    await axios.delete(API_BASE + '/saves/' + currentAgent.id, {
                        headers: { Authorization: 'Bearer ' + token }
                    });
                    isSaved = false;
                    showToast('Agent removed from saved list', 'success');
                } else {
                    await axios.post(API_BASE + '/saves/' + currentAgent.id, {}, {
                        headers: { Authorization: 'Bearer ' + token }
                    });
                    isSaved = true;
                    showToast('Agent saved successfully!', 'success');
                }
                updateSaveButton();
            } catch (error) {
                const errMsg = error.response?.data?.error || 'Error saving agent';
                showToast(errMsg, 'error');
            }
        }

        function updateSaveButton() {
            const saveBtn = document.getElementById('save-btn');
            const saveText = document.getElementById('save-text');
            if (isSaved) {
                saveBtn.classList.add('bg-purple-600', 'text-white');
                saveBtn.classList.remove('bg-gray-200', 'dark:bg-gray-700');
                saveBtn.querySelector('i').className = 'fas fa-bookmark';
                saveText.textContent = 'Saved';
            } else {
                saveBtn.classList.remove('bg-purple-600', 'text-white');
                saveBtn.classList.add('bg-gray-200', 'dark:bg-gray-700');
                saveBtn.querySelector('i').className = 'far fa-bookmark';
                saveText.textContent = 'Save';
            }
        }

        async function upvoteAgent() {
            const token = localStorage.getItem('token');
            
            // Check if user is logged in
            if (!token) {
                showToast('Please login to upvote', 'error');
                setTimeout(() => window.location.href = '/login', 1500);
                return;
            }
            
            // Check if already upvoted in this session
            const upvoteKey = 'upvoted_' + currentAgent.id;
            if (sessionStorage.getItem(upvoteKey)) {
                showToast('You have already upvoted this agent in this session', 'info');
                return;
            }
            
            try {
                const response = await axios.post(
                    API_BASE + '/agents/' + currentAgent.id + '/upvote',
                    {},
                    { headers: { Authorization: 'Bearer ' + token } }
                );
                
                if (response.data.success) {
                    // Fetch updated vote count
                    const countRes = await axios.get(API_BASE + '/public/' + currentAgent.id + '/vote-count');
                    if (countRes.data.success) {
                        currentAgent.upvote_count = countRes.data.data.upvote_count;
                        document.getElementById('upvote-count').textContent = currentAgent.upvote_count;
                        document.getElementById('upvotes-display').textContent = currentAgent.upvote_count;
                    }
                    
                    // Mark as upvoted in session
                    sessionStorage.setItem(upvoteKey, 'true');
                    
                    // Update button state
                    const upvoteBtn = document.getElementById('upvote-btn');
                    if (upvoteBtn) {
                        upvoteBtn.classList.add('opacity-50', 'cursor-not-allowed');
                        upvoteBtn.innerHTML = '<i class="fas fa-check mr-2"></i>Upvoted';
                    }
                    
                    showToast('Upvote recorded!', 'success');
                }
            } catch (error) {
                const errMsg = error.response?.data?.error || error.response?.data?.message || 'Error recording upvote';
                showToast(errMsg, 'error');
                console.error('Upvote error:', error);
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
