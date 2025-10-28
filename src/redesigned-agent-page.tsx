// Redesigned Agent Detail Page - Dark Futuristic Theme
// Features: Save button, Social media links, Logo left + Media right, User dropdown menu

import { getFooter } from './components/footer';

export const redesignedAgentDetailPage = (slug: string) => `
<!DOCTYPE html>
<html lang="en" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title id="page-title">Agent Details - AI Agents Directory</title>
    <meta name="description" id="page-description" content="Detailed information about this AI agent">
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        /* Modern Dark Futuristic Theme */
        :root {
            /* Dark Theme Colors - Cyber Blue & Neon Accents */
            --primary: #00d4ff;        /* Cyan/Electric Blue */
            --primary-dark: #0099cc;
            --secondary: #7c3aed;      /* Keep some purple for gradients */
            --accent: #10b981;         /* Emerald green */
            --bg-dark: #0a0e27;        /* Deep space blue */
            --bg-darker: #060917;      /* Darker variant */
            --bg-card: #141b3a;        /* Card background */
            --border: #1e2749;         /* Border color */
            --text: #e2e8f0;           /* Light text */
            --text-muted: #94a3b8;     /* Muted text */
            --gradient: linear-gradient(135deg, #00d4ff 0%, #0099cc 100%);
            --gradient-alt: linear-gradient(135deg, #7c3aed 0%, #00d4ff 100%);
        }
        
        body {
            background: var(--bg-dark);
            color: var(--text);
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        
        /* Glassmorphism Cards */
        .glass-card {
            background: rgba(20, 27, 58, 0.6);
            backdrop-filter: blur(10px);
            border: 1px solid var(--border);
            border-radius: 16px;
        }
        
        /* Neon Glow Effect */
        .neon-glow {
            box-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
        }
        
        .neon-text {
            text-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
        }
        
        /* Gradient Buttons */
        .btn-primary {
            background: var(--gradient);
            color: var(--bg-dark);
            font-weight: 600;
            transition: all 0.3s ease;
        }
        
        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(0, 212, 255, 0.4);
        }
        
        /* Social Icon Buttons */
        .social-btn {
            width: 40px;
            height: 40px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--bg-card);
            border: 1px solid var(--border);
            transition: all 0.3s ease;
        }
        
        .social-btn:hover {
            border-color: var(--primary);
            background: rgba(0, 212, 255, 0.1);
            transform: translateY(-3px);
        }
        
        /* Media Container */
        .media-container {
            position: relative;
            border-radius: 16px;
            overflow: hidden;
            background: var(--bg-darker);
        }
        
        .media-container iframe,
        .media-container img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        /* Video Container */
        .video-wrapper {
            position: relative;
            padding-bottom: 56.25%;
            height: 0;
        }
        
        .video-wrapper iframe {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }
        
        /* Stats Badges */
        .stat-badge {
            background: rgba(0, 212, 255, 0.1);
            border: 1px solid rgba(0, 212, 255, 0.3);
            padding: 8px 16px;
            border-radius: 12px;
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }
        
        /* Feature Cards */
        .feature-card {
            background: var(--bg-card);
            border: 1px solid var(--border);
            border-left: 4px solid var(--primary);
            padding: 20px;
            border-radius: 12px;
            transition: all 0.3s ease;
        }
        
        .feature-card:hover {
            border-left-color: var(--accent);
            transform: translateX(5px);
        }
        
        /* User Dropdown */
        .user-dropdown {
            position: relative;
        }
        
        .user-dropdown-menu {
            position: absolute;
            right: 0;
            top: 100%;
            margin-top: 8px;
            background: var(--bg-card);
            border: 1px solid var(--border);
            border-radius: 12px;
            min-width: 200px;
            display: none;
            z-index: 50;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
        }
        
        .user-dropdown-menu.active {
            display: block;
        }
        
        .user-dropdown-item {
            padding: 12px 20px;
            display: flex;
            align-items: center;
            gap: 12px;
            transition: all 0.2s;
            border-bottom: 1px solid var(--border);
        }
        
        .user-dropdown-item:last-child {
            border-bottom: none;
        }
        
        .user-dropdown-item:hover {
            background: rgba(0, 212, 255, 0.1);
        }
        
        /* Save Button States */
        .btn-save {
            background: var(--bg-card);
            border: 2px solid var(--border);
            transition: all 0.3s ease;
        }
        
        .btn-save:hover {
            border-color: var(--primary);
            background: rgba(0, 212, 255, 0.1);
        }
        
        .btn-save.saved {
            background: var(--gradient);
            color: var(--bg-dark);
            border-color: var(--primary);
        }
        
        /* Use Case Cards */
        .use-case-card {
            background: var(--bg-card);
            border: 1px solid var(--border);
            padding: 24px;
            border-radius: 12px;
            position: relative;
            overflow: hidden;
        }
        
        .use-case-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 4px;
            height: 100%;
            background: var(--gradient);
        }
        
        /* Screenshot Gallery */
        .screenshot-item {
            border-radius: 12px;
            overflow: hidden;
            cursor: pointer;
            transition: transform 0.3s;
            border: 1px solid var(--border);
        }
        
        .screenshot-item:hover {
            transform: scale(1.05);
            border-color: var(--primary);
        }
        
        /* Responsive Nav */
        @media (max-width: 768px) {
            .mobile-hidden {
                display: none;
            }
        }
    </style>
</head>
<body>
    <!-- Navigation with User Dropdown -->
    <nav class="glass-card border-0 sticky top-0 z-50 backdrop-blur-md">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16 items-center">
                <a href="/" class="flex items-center gap-3">
                    <i class="fas fa-robot text-3xl neon-text" style="color: var(--primary)"></i>
                    <span class="text-xl font-bold">AI Agents Directory</span>
                </a>
                <div class="flex items-center gap-4">
                    <a href="/" class="mobile-hidden hover:text-cyan-400 transition">Home</a>
                    <a href="/agents" class="mobile-hidden hover:text-cyan-400 transition">Browse</a>
                    <a href="/categories" class="mobile-hidden hover:text-cyan-400 transition">Categories</a>
                    
                    <!-- User Dropdown or Login Button -->
                    <div id="auth-section">
                        <!-- Will be populated by JS -->
                    </div>
                </div>
            </div>
        </div>
    </nav>

    <div id="loading" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="text-center py-20">
            <i class="fas fa-spinner fa-spin text-6xl mb-4" style="color: var(--primary)"></i>
            <p class="text-gray-400">Loading agent details...</p>
        </div>
    </div>

    <div id="agent-content" class="hidden max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <!-- Hero Section: Logo Left + Media Right -->
        <div class="glass-card p-8">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <!-- Left Column: Logo + Info -->
                <div class="space-y-6">
                    <!-- Logo -->
                    <div id="agent-logo" class="w-32 h-32 rounded-2xl flex items-center justify-center neon-glow" 
                         style="background: var(--gradient)">
                        <span class="text-6xl">🤖</span>
                    </div>
                    
                    <!-- Name & Tagline -->
                    <div>
                        <h1 id="agent-name" class="text-5xl font-bold mb-3 neon-text">Agent Name</h1>
                        <p id="agent-tagline" class="text-xl text-gray-400 mb-4">Tagline</p>
                        <div id="agent-badges" class="flex flex-wrap gap-2 mb-4">
                            <!-- Badges -->
                        </div>
                    </div>
                    
                    <!-- Stats -->
                    <div class="flex flex-wrap gap-4">
                        <div class="stat-badge">
                            <i class="fas fa-eye" style="color: var(--primary)"></i>
                            <span id="view-count">0</span> views
                        </div>
                        <div class="stat-badge">
                            <i class="fas fa-arrow-up" style="color: var(--primary)"></i>
                            <span id="upvotes-display">0</span> upvotes
                        </div>
                        <div class="stat-badge">
                            <i class="fas fa-star text-yellow-500"></i>
                            <span id="review-count">0</span> reviews
                        </div>
                    </div>
                    
                    <!-- Categories -->
                    <div id="agent-categories" class="flex flex-wrap gap-2">
                        <!-- Categories -->
                    </div>
                    
                    <!-- Action Buttons -->
                    <div class="grid grid-cols-2 gap-4">
                        <a id="visit-website-btn" href="#" target="_blank" onclick="trackClick()" 
                           class="btn-primary px-6 py-4 rounded-xl text-center font-semibold flex items-center justify-center gap-2">
                            <i class="fas fa-external-link-alt"></i>
                            Visit Website
                        </a>
                        <button id="upvote-btn" onclick="upvoteAgent()" 
                                class="btn-save px-6 py-4 rounded-xl font-semibold flex items-center justify-center gap-2">
                            <i class="fas fa-arrow-up"></i>
                            <span id="upvote-text">Upvote</span>
                        </button>
                        <button id="save-btn" onclick="toggleSave()" 
                                class="btn-save px-6 py-4 rounded-xl font-semibold flex items-center justify-center gap-2">
                            <i class="far fa-bookmark"></i>
                            <span id="save-text">Save</span>
                        </button>
                        <button onclick="shareAgent()" 
                                class="btn-save px-6 py-4 rounded-xl font-semibold flex items-center justify-center gap-2">
                            <i class="fas fa-share-alt"></i>
                            Share
                        </button>
                    </div>
                    
                    <!-- Social Media Links -->
                    <div id="social-links" class="flex gap-3">
                        <!-- Social icons will be added here -->
                    </div>
                </div>
                
                <!-- Right Column: Media (Video/Screenshot/Thumbnail) -->
                <div id="media-column" class="media-container" style="min-height: 400px;">
                    <!-- Media will be loaded here -->
                </div>
            </div>
        </div>

        <!-- Description Section -->
        <div class="glass-card p-8">
            <h2 class="text-3xl font-bold mb-6 flex items-center gap-3">
                <i class="fas fa-info-circle" style="color: var(--primary)"></i>
                Overview
            </h2>
            <div id="agent-description" class="prose prose-invert max-w-none text-gray-300 leading-relaxed">
                <!-- Description -->
            </div>
        </div>

        <!-- Key Features -->
        <div class="glass-card p-8">
            <h2 class="text-3xl font-bold mb-6 flex items-center gap-3">
                <i class="fas fa-list-check" style="color: var(--primary)"></i>
                Key Features
            </h2>
            <div id="features-grid" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Features -->
            </div>
        </div>

        <!-- Use Cases -->
        <div id="use-cases-section" class="glass-card p-8 hidden">
            <h2 class="text-3xl font-bold mb-6 flex items-center gap-3">
                <i class="fas fa-lightbulb" style="color: var(--primary)"></i>
                Use Cases
            </h2>
            <div id="use-cases-list" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <!-- Use cases -->
            </div>
        </div>

        <!-- Pricing -->
        <div class="glass-card p-8">
            <h2 class="text-3xl font-bold mb-6 flex items-center gap-3">
                <i class="fas fa-dollar-sign" style="color: var(--primary)"></i>
                Pricing
            </h2>
            <div id="pricing-content">
                <!-- Pricing -->
            </div>
        </div>

        <!-- Screenshots Gallery -->
        <div id="screenshots-section" class="glass-card p-8 hidden">
            <h2 class="text-3xl font-bold mb-6 flex items-center gap-3">
                <i class="fas fa-images" style="color: var(--primary)"></i>
                Screenshots
            </h2>
            <div id="screenshots-gallery" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <!-- Screenshots -->
            </div>
        </div>

        <!-- Company Information -->
        <div id="company-section" class="glass-card p-8 hidden">
            <h2 class="text-3xl font-bold mb-6 flex items-center gap-3">
                <i class="fas fa-building" style="color: var(--primary)"></i>
                Company Information
            </h2>
            <div id="company-info" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <!-- Company info -->
            </div>
        </div>

        <!-- Reviews & Ratings -->
        <div class="glass-card p-8">
            <div class="flex justify-between items-center mb-6 flex-wrap gap-4">
                <h2 class="text-3xl font-bold flex items-center gap-3">
                    <i class="fas fa-star" style="color: var(--primary)"></i>
                    Reviews & Ratings
                </h2>
                <div class="flex items-center gap-6">
                    <div class="text-right">
                        <div class="text-4xl font-bold" id="avg-rating">0.0</div>
                        <div class="text-yellow-500 text-2xl" id="star-display">☆☆☆☆☆</div>
                        <div class="text-sm text-gray-400" id="total-reviews">0 reviews</div>
                    </div>
                    <button onclick="showReviewForm()" id="write-review-btn" 
                            class="btn-primary px-6 py-3 rounded-xl">
                        <i class="fas fa-pencil-alt mr-2"></i>Write a Review
                    </button>
                </div>
            </div>

            <!-- Review Form -->
            <div id="review-form" class="glass-card border p-6 mb-6 hidden">
                <h3 class="text-xl font-bold mb-4">Share Your Experience</h3>
                <div class="space-y-4">
                    <div>
                        <label class="block mb-2 font-medium">Rating <span class="text-red-500">*</span></label>
                        <div class="flex gap-2" id="rating-stars">
                            <button class="star-btn text-4xl text-gray-500 hover:text-yellow-500" data-rating="1">☆</button>
                            <button class="star-btn text-4xl text-gray-500 hover:text-yellow-500" data-rating="2">☆</button>
                            <button class="star-btn text-4xl text-gray-500 hover:text-yellow-500" data-rating="3">☆</button>
                            <button class="star-btn text-4xl text-gray-500 hover:text-yellow-500" data-rating="4">☆</button>
                            <button class="star-btn text-4xl text-gray-500 hover:text-yellow-500" data-rating="5">☆</button>
                        </div>
                    </div>
                    <div>
                        <label class="block mb-2 font-medium">Review Title</label>
                        <input type="text" id="review-title" placeholder="Summarize your experience" 
                               class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg">
                    </div>
                    <div>
                        <label class="block mb-2 font-medium">Your Review</label>
                        <textarea id="review-summary" placeholder="Share your detailed experience" 
                                  class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg" rows="5"></textarea>
                    </div>
                    <div class="flex gap-4">
                        <button onclick="submitReview()" class="btn-primary px-6 py-3 rounded-xl">
                            Submit Review
                        </button>
                        <button onclick="hideReviewForm()" class="btn-save px-6 py-3 rounded-xl">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>

            <!-- Reviews List -->
            <div id="reviews-list" class="space-y-4">
                <!-- Reviews -->
            </div>
        </div>

        <!-- Similar Agents -->
        <div class="glass-card p-8">
            <h2 class="text-3xl font-bold mb-6 flex items-center gap-3">
                <i class="fas fa-exchange-alt" style="color: var(--primary)"></i>
                Similar Agents
            </h2>
            <div id="similar-agents" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <!-- Similar agents -->
            </div>
        </div>
    </div>

    ${getFooter()}

    <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
    <script>
        const API_BASE = '/api';
        const SLUG = '${slug}';
        let currentAgent = null;
        let currentUser = null;
        let selectedRating = 0;
        let isSaved = false;

        // Check authentication on load
        async function checkAuth() {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await axios.get(API_BASE + '/auth/me', {
                        headers: { Authorization: 'Bearer ' + token }
                    });
                    if (response.data.success) {
                        currentUser = response.data.data;
                        renderUserDropdown();
                    } else {
                        renderLoginButton();
                    }
                } catch (error) {
                    renderLoginButton();
                }
            } else {
                renderLoginButton();
            }
        }

        function renderUserDropdown() {
            const authSection = document.getElementById('auth-section');
            authSection.innerHTML = \`
                <div class="user-dropdown">
                    <button onclick="toggleUserMenu()" class="flex items-center gap-2 px-4 py-2 rounded-xl btn-save">
                        <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" 
                             style="background: var(--gradient); color: var(--bg-dark)">
                            \${currentUser.name.charAt(0).toUpperCase()}
                        </div>
                        <i class="fas fa-chevron-down text-sm"></i>
                    </button>
                    <div id="user-menu" class="user-dropdown-menu">
                        <a href="/dashboard" class="user-dropdown-item">
                            <i class="fas fa-tachometer-alt"></i>
                            Dashboard
                        </a>
                        <a href="/dashboard#saved" class="user-dropdown-item">
                            <i class="fas fa-bookmark"></i>
                            Saved Agents
                        </a>
                        <button onclick="logout()" class="user-dropdown-item w-full text-left">
                            <i class="fas fa-sign-out-alt"></i>
                            Logout
                        </button>
                    </div>
                </div>
            \`;
        }

        function renderLoginButton() {
            const authSection = document.getElementById('auth-section');
            authSection.innerHTML = \`
                <a href="/login" class="btn-primary px-6 py-2 rounded-xl">
                    Login
                </a>
            \`;
        }

        function toggleUserMenu() {
            const menu = document.getElementById('user-menu');
            menu.classList.toggle('active');
        }

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.user-dropdown')) {
                const menu = document.getElementById('user-menu');
                if (menu) menu.classList.remove('active');
            }
        });

        function logout() {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/';
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
                    await checkSaveStatus();
                    await loadReviews();
                    
                    document.getElementById('loading').classList.add('hidden');
                    document.getElementById('agent-content').classList.remove('hidden');
                }
            } catch (error) {
                console.error('Error loading agent:', error);
                document.getElementById('loading').innerHTML = 
                    '<div class="text-center py-12"><p class="text-red-500">Error loading agent.</p></div>';
            }
        }

        function renderAgent(agent, features, useCases, screenshots, similar) {
            // Update page metadata
            document.getElementById('page-title').textContent = agent.name + ' - AI Agents Directory';
            document.getElementById('page-description').setAttribute('content', agent.tagline || agent.description);
            
            // Logo
            if (agent.logo_url) {
                document.getElementById('agent-logo').innerHTML = \`
                    <img src="\${agent.logo_url}" alt="\${agent.name}" class="w-full h-full object-cover rounded-2xl" 
                        onerror="this.outerHTML='<span class=\\'text-6xl\\'>🤖</span>'">
                \`;
            }
            
            // Name & Tagline
            document.getElementById('agent-name').textContent = agent.name;
            document.getElementById('agent-tagline').textContent = agent.tagline || '';
            
            // Badges
            let badges = [];
            if (agent.verified_status) {
                badges.push(\`<span class="px-3 py-1 rounded-full text-sm font-bold" style="background: var(--accent); color: white;">
                    <i class="fas fa-check-circle"></i> Verified
                </span>\`);
            }
            if (agent.is_open_source) {
                badges.push(\`<span class="px-3 py-1 rounded-full text-sm font-bold" style="background: var(--accent); color: white;">
                    <i class="fas fa-code-branch"></i> Open Source
                </span>\`);
            }
            document.getElementById('agent-badges').innerHTML = badges.join('');
            
            // Stats
            document.getElementById('view-count').textContent = agent.view_count || 0;
            document.getElementById('upvotes-display').textContent = agent.upvote_count || 0;
            document.getElementById('review-count').textContent = agent.review_count || 0;
            
            // Categories
            if (agent.category_names) {
                const categories = agent.category_names.split(',');
                document.getElementById('agent-categories').innerHTML = categories.map(cat => 
                    \`<span class="px-4 py-2 rounded-xl text-sm font-semibold" 
                           style="background: rgba(0, 212, 255, 0.1); border: 1px solid rgba(0, 212, 255, 0.3);">
                        \${cat}
                    </span>\`
                ).join('');
            }
            
            // Website link
            document.getElementById('visit-website-btn').href = agent.website_url;
            
            // Render Media (Priority: YouTube > Thumbnail > Screenshot > Placeholder)
            renderMedia(agent, screenshots);
            
            // Social Media Links
            renderSocialLinks(agent);
            
            // Description
            document.getElementById('agent-description').innerHTML = agent.long_description || agent.description || 'No description available.';
            
            // Features
            if (features.length > 0) {
                document.getElementById('features-grid').innerHTML = features.map(f => \`
                    <div class="feature-card">
                        <h4 class="font-semibold mb-2 flex items-center gap-2">
                            <i class="fas fa-check" style="color: var(--primary)"></i>
                            \${f.title || f.description}
                        </h4>
                        <p class="text-sm text-gray-400">\${f.description || ''}</p>
                    </div>
                \`).join('');
            } else {
                document.getElementById('features-grid').innerHTML = '<p class="text-gray-400">No features listed yet.</p>';
            }
            
            // Use Cases
            if (useCases.length > 0) {
                document.getElementById('use-cases-section').classList.remove('hidden');
                document.getElementById('use-cases-list').innerHTML = useCases.map(uc => \`
                    <div class="use-case-card">
                        <h4 class="font-semibold mb-2">\${uc.title}</h4>
                        <p class="text-sm text-gray-400">\${uc.description}</p>
                    </div>
                \`).join('');
            }
            
            // Pricing
            renderPricing(agent);
            
            // Screenshots
            if (screenshots.length > 0) {
                document.getElementById('screenshots-section').classList.remove('hidden');
                document.getElementById('screenshots-gallery').innerHTML = screenshots.map(s => \`
                    <div class="screenshot-item">
                        <img src="\${s.image_url}" alt="\${s.title}" class="w-full h-48 object-cover">
                    </div>
                \`).join('');
            }
            
            // Company Info
            if (agent.company_name) {
                document.getElementById('company-section').classList.remove('hidden');
                let companyHtml = [];
                if (agent.company_name) companyHtml.push(\`<div><div class="text-sm text-gray-400 mb-1">Company</div><div class="font-semibold">\${agent.company_name}</div></div>\`);
                if (agent.founded_year) companyHtml.push(\`<div><div class="text-sm text-gray-400 mb-1">Founded</div><div class="font-semibold">\${agent.founded_year}</div></div>\`);
                if (agent.headquarters) companyHtml.push(\`<div><div class="text-sm text-gray-400 mb-1">Headquarters</div><div class="font-semibold">\${agent.headquarters}</div></div>\`);
                document.getElementById('company-info').innerHTML = companyHtml.join('');
            }
            
            // Similar agents
            renderSimilarAgents(similar);
        }

        function renderMedia(agent, screenshots) {
            const mediaCol = document.getElementById('media-column');
            
            // Priority 1: YouTube Video
            if (agent.youtube_url) {
                const videoId = extractYouTubeId(agent.youtube_url);
                if (videoId) {
                    mediaCol.innerHTML = \`
                        <div class="video-wrapper">
                            <iframe src="https://www.youtube.com/embed/\${videoId}" 
                                    frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                    allowfullscreen class="rounded-2xl"></iframe>
                        </div>
                    \`;
                    return;
                }
            }
            
            // Priority 2: Thumbnail Image
            if (agent.video_thumbnail || agent.thumbnail_image) {
                const thumbUrl = agent.video_thumbnail || agent.thumbnail_image;
                mediaCol.innerHTML = \`
                    <img src="\${thumbUrl}" alt="\${agent.name}" class="w-full h-full object-cover rounded-2xl" 
                         onerror="this.style.display='none'">
                \`;
                return;
            }
            
            // Priority 3: First Screenshot
            if (screenshots && screenshots.length > 0) {
                mediaCol.innerHTML = \`
                    <img src="\${screenshots[0].image_url}" alt="\${agent.name}" class="w-full h-full object-cover rounded-2xl">
                \`;
                return;
            }
            
            // Priority 4: Cover Image
            if (agent.cover_image) {
                mediaCol.innerHTML = \`
                    <img src="\${agent.cover_image}" alt="\${agent.name}" class="w-full h-full object-cover rounded-2xl">
                \`;
                return;
            }
            
            // Fallback: Placeholder
            mediaCol.innerHTML = \`
                <div class="w-full h-full flex items-center justify-center" style="background: var(--gradient)">
                    <i class="fas fa-video text-8xl opacity-50" style="color: var(--bg-dark)"></i>
                </div>
            \`;
        }

        function extractYouTubeId(url) {
            if (!url) return null;
            let videoId = null;
            if (url.includes('youtu.be/')) {
                videoId = url.split('youtu.be/')[1].split(/[?&#]/)[0];
            } else if (url.includes('youtube.com/watch?v=')) {
                videoId = url.split('v=')[1].split(/[&#]/)[0];
            } else if (url.includes('youtube.com/embed/')) {
                videoId = url.split('embed/')[1].split(/[?&#]/)[0];
            }
            return (videoId && videoId.length === 11) ? videoId : null;
        }

        function renderSocialLinks(agent) {
            const socialContainer = document.getElementById('social-links');
            let links = [];
            
            if (agent.twitter_url) {
                links.push(\`
                    <a href="\${agent.twitter_url}" target="_blank" class="social-btn" title="Twitter/X">
                        <i class="fab fa-x-twitter"></i>
                    </a>
                \`);
            }
            
            if (agent.linkedin_url) {
                links.push(\`
                    <a href="\${agent.linkedin_url}" target="_blank" class="social-btn" title="LinkedIn">
                        <i class="fab fa-linkedin"></i>
                    </a>
                \`);
            }
            
            if (agent.discord_url) {
                links.push(\`
                    <a href="\${agent.discord_url}" target="_blank" class="social-btn" title="Discord">
                        <i class="fab fa-discord"></i>
                    </a>
                \`);
            }
            
            if (agent.github_url) {
                links.push(\`
                    <a href="\${agent.github_url}" target="_blank" class="social-btn" title="GitHub">
                        <i class="fab fa-github"></i>
                    </a>
                \`);
            }
            
            if (links.length > 0) {
                socialContainer.innerHTML = \`
                    <div class="text-sm text-gray-400 mb-2">Follow & Connect:</div>
                    <div class="flex gap-3">\${links.join('')}</div>
                \`;
            }
        }

        function renderPricing(agent) {
            let html = \`
                <div class="flex items-center gap-4 mb-4">
                    <span class="px-6 py-3 rounded-xl text-xl font-bold" 
                          style="background: var(--gradient); color: var(--bg-dark);">
                        \${agent.pricing_model}
                    </span>
            \`;
            
            if (agent.pricing_starts_at) {
                html += \`<span class="text-gray-400">Starting at \${agent.pricing_starts_at}</span>\`;
            }
            if (agent.free_plan_available) {
                html += \`<span class="px-3 py-1 rounded-full text-sm" style="background: var(--accent); color: white;">
                    <i class="fas fa-check"></i> Free Plan
                </span>\`;
            }
            html += '</div>';
            
            document.getElementById('pricing-content').innerHTML = html;
        }

        function renderSimilarAgents(agents) {
            if (!agents || agents.length === 0) {
                document.getElementById('similar-agents').innerHTML = '<p class="text-gray-400">No similar agents found.</p>';
                return;
            }
            
            document.getElementById('similar-agents').innerHTML = agents.map(agent => \`
                <a href="/agents/\${agent.slug}" class="glass-card p-6 rounded-xl hover:border-cyan-400 transition block">
                    <div class="text-center mb-4">
                        \${agent.logo_url ? \`
                            <img src="\${agent.logo_url}" alt="\${agent.name}" class="w-16 h-16 mx-auto rounded-lg object-cover">
                        \` : '<span class="text-4xl">🤖</span>'}
                    </div>
                    <h3 class="font-bold text-lg mb-2 text-center">\${agent.name}</h3>
                    <p class="text-sm text-gray-400 text-center line-clamp-2 mb-4">\${agent.tagline || ''}</p>
                    <div class="flex items-center justify-between text-sm">
                        <span class="stat-badge">\${agent.pricing_model}</span>
                        <span class="text-gray-400"><i class="fas fa-arrow-up mr-1"></i>\${agent.upvote_count}</span>
                    </div>
                </a>
            \`).join('');
        }

        // Save/Bookmark functionality
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
                    // Unsave
                    await axios.delete(API_BASE + '/saves/' + currentAgent.id, {
                        headers: { Authorization: 'Bearer ' + token }
                    });
                    isSaved = false;
                    showToast('Agent removed from saved list', 'success');
                } else {
                    // Save
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
                saveBtn.classList.add('saved');
                saveBtn.querySelector('i').className = 'fas fa-bookmark';
                saveText.textContent = 'Saved';
            } else {
                saveBtn.classList.remove('saved');
                saveBtn.querySelector('i').className = 'far fa-bookmark';
                saveText.textContent = 'Save';
            }
        }

        // Upvote functionality
        async function upvoteAgent() {
            const token = localStorage.getItem('token');
            if (!token) {
                showToast('Please login to upvote', 'error');
                setTimeout(() => window.location.href = '/login', 1500);
                return;
            }
            
            try {
                const response = await axios.post(
                    API_BASE + '/public/' + currentAgent.id + '/upvote',
                    {},
                    { headers: { Authorization: 'Bearer ' + token } }
                );
                
                if (response.data.success) {
                    // Fetch updated count
                    const countRes = await axios.get(API_BASE + '/public/' + currentAgent.id + '/vote-count');
                    if (countRes.data.success) {
                        const newCount = countRes.data.data.upvote_count;
                        currentAgent.upvote_count = newCount;
                        document.getElementById('upvotes-display').textContent = newCount;
                    }
                    
                    const action = response.data.action || 'upvoted';
                    if (action === 'upvoted') {
                        document.getElementById('upvote-btn').classList.add('saved');
                        document.getElementById('upvote-text').textContent = 'Upvoted';
                        showToast('Upvote recorded!', 'success');
                    } else {
                        document.getElementById('upvote-btn').classList.remove('saved');
                        document.getElementById('upvote-text').textContent = 'Upvote';
                        showToast('Upvote removed', 'success');
                    }
                }
            } catch (error) {
                const errMsg = error.response?.data?.error || 'Error recording upvote';
                showToast(errMsg, 'error');
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

        // Review functions
        async function loadReviews() {
            if (!currentAgent) return;
            try {
                const res = await axios.get(\`\${API_BASE}/reviews/agent/\${currentAgent.id}?page=1&limit=5\`);
                if (res.data.success) {
                    const {reviews, stats} = res.data.data;
                    
                    document.getElementById('avg-rating').textContent = (stats.average_rating || 0).toFixed(1);
                    const starDisplay = '★'.repeat(Math.round(stats.average_rating || 0)) + '☆'.repeat(5 - Math.round(stats.average_rating || 0));
                    document.getElementById('star-display').textContent = starDisplay;
                    document.getElementById('total-reviews').textContent = \`\${stats.total_reviews || 0} reviews\`;
                    
                    if (reviews.length === 0) {
                        document.getElementById('reviews-list').innerHTML = \`
                            <div class="glass-card border p-12 text-center">
                                <i class="fas fa-comments text-6xl mb-4 opacity-30"></i>
                                <p class="text-xl mb-2">No reviews yet</p>
                                <p class="text-gray-400">Be the first to share your experience!</p>
                            </div>
                        \`;
                    } else {
                        document.getElementById('reviews-list').innerHTML = reviews.map(r => \`
                            <div class="glass-card border p-6">
                                <div class="flex items-start gap-4">
                                    <div class="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl" 
                                         style="background: var(--gradient)">
                                        \${r.user_name.charAt(0).toUpperCase()}
                                    </div>
                                    <div class="flex-1">
                                        <div class="flex items-center justify-between mb-2">
                                            <div>
                                                <div class="font-bold">\${r.user_name}</div>
                                                <div class="text-yellow-500">\${'★'.repeat(r.rating)}\${'☆'.repeat(5-r.rating)}</div>
                                            </div>
                                            <div class="text-sm text-gray-400">
                                                \${new Date(r.created_at).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <h4 class="font-bold text-lg mb-2">\${r.review_title}</h4>
                                        <p class="text-gray-400">\${r.review_summary}</p>
                                    </div>
                                </div>
                            </div>
                        \`).join('');
                    }
                }
            } catch (err) {
                console.error('Error loading reviews:', err);
            }
        }

        function showReviewForm() {
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
                btn.classList.add('text-gray-500');
            });
        }

        async function submitReview() {
            const token = localStorage.getItem('token');
            if (!token) {
                showToast('Please login to submit a review', 'error');
                return;
            }

            const title = document.getElementById('review-title').value.trim();
            const summary = document.getElementById('review-summary').value.trim();

            if (selectedRating === 0) {
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
                    showToast('Review submitted successfully!', 'success');
                    hideReviewForm();
                    document.getElementById('review-title').value = '';
                    document.getElementById('review-summary').value = '';
                    await loadReviews();
                }
            } catch (err) {
                const msg = err.response?.data?.error || 'Failed to submit review';
                showToast(msg, 'error');
            }
        }

        // Star rating
        document.addEventListener('DOMContentLoaded', () => {
            document.querySelectorAll('.star-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    selectedRating = parseInt(this.dataset.rating);
                    document.querySelectorAll('.star-btn').forEach((b, i) => {
                        if (i < selectedRating) {
                            b.textContent = '★';
                            b.classList.add('text-yellow-500');
                            b.classList.remove('text-gray-500');
                        } else {
                            b.textContent = '☆';
                            b.classList.remove('text-yellow-500');
                            b.classList.add('text-gray-500');
                        }
                    });
                });
            });
        });

        function showToast(message, type = 'info') {
            const toast = document.createElement('div');
            const colors = {
                success: 'var(--accent)',
                error: '#ef4444',
                info: 'var(--primary)'
            };
            toast.style.cssText = \`
                position: fixed;
                bottom: 20px;
                right: 20px;
                padding: 16px 24px;
                border-radius: 12px;
                background: \${colors[type]};
                color: var(--bg-dark);
                font-weight: 600;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
                z-index: 9999;
            \`;
            toast.textContent = message;
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 3000);
        }

        // Initialize
        document.addEventListener('DOMContentLoaded', () => {
            checkAuth();
            loadAgent();
        });
    </script>
</body>
</html>
`;
