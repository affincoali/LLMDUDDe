// Modern Agent Detail Page - Clean & Fast
import { getFooter } from './components/footer';

export const modernAgentDetailPage = (slug: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title id="page-title">Loading... - AI Agents Directory</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f7f8fa; color: #1a1a1a; line-height: 1.6; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        
        /* Header */
        .header { background: #fff; border-bottom: 1px solid #e5e7eb; padding: 16px 0; position: sticky; top: 0; z-index: 100; }
        .header-content { display: flex; justify-content: space-between; align-items: center; }
        .logo { display: flex; align-items: center; gap: 12px; font-size: 20px; font-weight: 700; color: #7c3aed; text-decoration: none; }
        .nav { display: flex; gap: 32px; align-items: center; }
        .nav a { color: #6b7280; text-decoration: none; font-weight: 500; }
        .nav a:hover { color: #7c3aed; }
        .btn-primary { background: #7c3aed; color: #fff; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: 600; }
        .btn-primary:hover { background: #6d28d9; }
        
        /* Breadcrumb */
        .breadcrumb { background: #fff; border-bottom: 1px solid #e5e7eb; padding: 12px 0; }
        .breadcrumb-list { display: flex; gap: 8px; align-items: center; font-size: 14px; color: #6b7280; }
        .breadcrumb-list a { color: #6b7280; text-decoration: none; }
        .breadcrumb-list a:hover { color: #7c3aed; }
        
        /* Main Content */
        .main { padding: 32px 0; }
        .grid { display: grid; grid-template-columns: 2fr 1fr; gap: 24px; }
        @media (max-width: 768px) { .grid { grid-template-columns: 1fr; } }
        
        /* Agent Header */
        .agent-header { background: #fff; border-radius: 12px; padding: 32px; margin-bottom: 24px; }
        .agent-top { display: flex; gap: 24px; align-items: start; margin-bottom: 24px; }
        .agent-logo { width: 96px; height: 96px; border-radius: 12px; object-fit: cover; flex-shrink: 0; }
        .agent-info { flex: 1; }
        .agent-name { font-size: 32px; font-weight: 700; margin-bottom: 8px; }
        .agent-tagline { font-size: 16px; color: #6b7280; margin-bottom: 16px; }
        .agent-stats { display: flex; gap: 16px; flex-wrap: wrap; }
        .stat-badge { display: inline-flex; align-items: center; gap: 6px; background: #f3f4f6; padding: 6px 12px; border-radius: 6px; font-size: 14px; }
        .badges { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px; }
        .badge { display: inline-flex; align-items: center; gap: 4px; padding: 4px 12px; border-radius: 6px; font-size: 13px; font-weight: 600; }
        .badge-category { background: #dbeafe; color: #1e40af; }
        .badge-opensource { background: #d1fae5; color: #065f46; }
        .badge-verified { background: #fef3c7; color: #92400e; }
        
        /* Action Buttons */
        .actions { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px; }
        .btn { padding: 12px 24px; border-radius: 8px; font-weight: 600; text-align: center; cursor: pointer; border: none; text-decoration: none; display: inline-block; }
        .btn-website { background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%); color: #fff; }
        .btn-upvote { background: #f3f4f6; color: #374151; }
        .btn-save { background: #f3f4f6; color: #374151; }
        .btn-share { background: #f3f4f6; color: #374151; }
        
        /* Tabs */
        .tabs { border-bottom: 2px solid #e5e7eb; margin-bottom: 24px; display: flex; gap: 32px; position: sticky; top: 73px; background: #f7f8fa; padding: 12px 0; z-index: 50; }
        .tab { padding: 12px 0; cursor: pointer; font-weight: 600; color: #6b7280; text-decoration: none; border-bottom: 3px solid transparent; margin-bottom: -2px; }
        .tab:hover { color: #7c3aed; }
        .tab.active { color: #7c3aed; border-bottom-color: #7c3aed; }
        html { scroll-behavior: smooth; }
        

        .section { background: #fff; border-radius: 12px; padding: 24px; margin-bottom: 16px; }
        .section-title { font-size: 20px; font-weight: 700; margin-bottom: 16px; }
        .feature-list { display: grid; gap: 12px; }
        .feature-item { display: flex; gap: 12px; padding: 16px; background: #f9fafb; border-radius: 8px; }
        .feature-icon { color: #7c3aed; font-size: 20px; flex-shrink: 0; }
        .feature-content h4 { font-weight: 600; margin-bottom: 4px; }
        .feature-content p { color: #6b7280; font-size: 14px; }
        
        /* Sidebar */
        .sidebar { }
        .sidebar-section { background: #fff; border-radius: 12px; padding: 20px; margin-bottom: 16px; }
        .sidebar-title { font-size: 16px; font-weight: 700; margin-bottom: 16px; }
        
        /* YouTube Video */
        .video-container { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 12px; }
        .video-container iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0; }
        
        /* Gallery Lightbox */
        .screenshots-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; }
        .screenshot-thumb { width: 100%; height: 150px; object-fit: cover; border-radius: 8px; cursor: pointer; transition: all 0.3s; }
        .screenshot-thumb:hover { transform: scale(1.05); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
        
        /* Lightbox Modal */
        .lightbox { display: none; position: fixed; z-index: 9999; left: 0; top: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.95); align-items: center; justify-content: center; }
        .lightbox.active { display: flex; }
        .lightbox-content { max-width: 90%; max-height: 90%; position: relative; }
        .lightbox-img { max-width: 100%; max-height: 90vh; object-fit: contain; border-radius: 8px; }
        .lightbox-close { position: absolute; top: -40px; right: 0; color: #fff; font-size: 36px; cursor: pointer; }
        .lightbox-prev, .lightbox-next { position: absolute; top: 50%; transform: translateY(-50%); background: rgba(255,255,255,0.2); color: #fff; padding: 16px; cursor: pointer; font-size: 24px; border-radius: 4px; }
        .lightbox-prev { left: -60px; }
        .lightbox-next { right: -60px; }
        .lightbox-prev:hover, .lightbox-next:hover { background: rgba(255,255,255,0.3); }
        
        /* Company Info - Enhanced Design */
        .info-grid { display: grid; gap: 16px; }
        .info-row { display: flex; align-items: center; gap: 12px; padding: 14px; background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%); border-radius: 10px; transition: all 0.3s; }
        .info-row:hover { transform: translateX(4px); box-shadow: 0 2px 8px rgba(124, 58, 237, 0.1); }
        .info-icon { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); color: #fff; border-radius: 8px; font-size: 16px; flex-shrink: 0; }
        .info-content { flex: 1; }
        .info-label { color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
        .info-value { font-weight: 600; font-size: 15px; color: #1f2937; }
        
        /* Social Links - Enhanced Design */
        .social-links { display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 12px; }
        .social-link { display: flex; align-items: center; justify-content: center; gap: 8px; padding: 12px; background: #fff; border: 2px solid #e5e7eb; border-radius: 10px; color: #374151; text-decoration: none; font-size: 18px; transition: all 0.3s; position: relative; overflow: hidden; }
        .social-link:before { content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%); transition: left 0.3s; }
        .social-link:hover { border-color: #7c3aed; color: #7c3aed; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(124, 58, 237, 0.2); }
        .social-link:hover:before { left: 0; }
        .social-link i { position: relative; z-index: 1; }
        .social-link.twitter:hover { border-color: #1da1f2; color: #1da1f2; }
        .social-link.linkedin:hover { border-color: #0077b5; color: #0077b5; }
        .social-link.github:hover { border-color: #333; color: #333; }
        .social-link.discord:hover { border-color: #5865f2; color: #5865f2; }
        
        /* Rating */
        .rating-summary { text-align: center; margin-bottom: 24px; }
        .rating-number { font-size: 48px; font-weight: 700; color: #7c3aed; }
        .rating-stars { color: #fbbf24; font-size: 24px; }
        .rating-bars { margin-top: 16px; }
        .rating-bar { display: flex; gap: 12px; align-items: center; margin-bottom: 8px; }
        .bar-label { width: 40px; font-size: 14px; color: #6b7280; }
        .bar-fill { flex: 1; height: 8px; background: #f3f4f6; border-radius: 4px; overflow: hidden; }
        .bar-progress { height: 100%; background: #10b981; transition: width 0.3s; }
        .bar-count { width: 40px; text-align: right; font-size: 14px; color: #6b7280; }
        
        /* Reviews */
        .review-card { padding: 20px; background: #f9fafb; border-radius: 8px; margin-bottom: 16px; }
        .review-header { display: flex; gap: 12px; margin-bottom: 12px; }
        .review-avatar { width: 48px; height: 48px; border-radius: 50%; background: #ddd; }
        .review-author { flex: 1; }
        .review-name { font-weight: 600; }
        .review-date { font-size: 13px; color: #6b7280; }
        .review-rating { color: #fbbf24; }
        
        /* Loading */
        .loading { text-align: center; padding: 60px 20px; }
        .spinner { width: 50px; height: 50px; border: 4px solid #f3f4f6; border-top-color: #7c3aed; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 16px; }
        @keyframes spin { to { transform: rotate(360deg); } }
        
        /* Toast */
        .toast { position: fixed; bottom: 24px; right: 24px; background: #1f2937; color: #fff; padding: 16px 24px; border-radius: 8px; z-index: 1000; animation: slideIn 0.3s; }
        @keyframes slideIn { from { transform: translateY(100px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    </style>
</head>
<body>
    <!-- Header -->
    <div class="header">
        <div class="container header-content">
            <a href="/" class="logo">
                <i class="fas fa-robot"></i>
                AI Agents Directory
            </a>
            <div class="nav">
                <a href="/">Home</a>
                <a href="/agents">Agents</a>
                <a href="/categories">Categories</a>
                <a href="/submit" class="btn-primary">Submit Agent</a>
            </div>
        </div>
    </div>

    <!-- Breadcrumb -->
    <div class="breadcrumb">
        <div class="container">
            <div class="breadcrumb-list">
                <a href="/">Home</a>
                <i class="fas fa-chevron-right" style="font-size: 10px;"></i>
                <a href="/categories">Categories</a>
                <i class="fas fa-chevron-right" style="font-size: 10px;"></i>
                <span id="breadcrumb-category">NSFW</span>
                <i class="fas fa-chevron-right" style="font-size: 10px;"></i>
                <span id="breadcrumb-agent">Loading...</span>
            </div>
        </div>
    </div>

    <!-- Loading State -->
    <div id="loading" class="loading">
        <div class="spinner"></div>
        <p>Loading agent details...</p>
    </div>

    <!-- Main Content (hidden initially) -->
    <div id="content" style="display: none;">
        <div class="main">
            <div class="container">
                <div class="grid">
                    <!-- Left Column -->
                    <div>
                        <!-- Agent Header -->
                        <div class="agent-header">
                            <div class="agent-top">
                                <img id="agent-logo" class="agent-logo" src="" alt="" onerror="this.src='https://storage.llmdude.com/uploads/1761722667625-3falg8084x7.png'">
                                <div class="agent-info">
                                    <h1 id="agent-name" class="agent-name">Agent Name</h1>
                                    <p id="agent-tagline" class="agent-tagline">Loading...</p>
                                    <div id="agent-badges" class="badges"></div>
                                    <div class="agent-stats">
                                        <div class="stat-badge">
                                            <i class="fas fa-eye"></i>
                                            <span id="view-count">0</span> views
                                        </div>
                                        <div class="stat-badge">
                                            <i class="fas fa-heart"></i>
                                            <span id="like-count">0</span> likes
                                        </div>
                                        <div class="stat-badge">
                                            <i class="fas fa-star" style="color: #fbbf24;"></i>
                                            <span id="rating-display">0.0</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Action Buttons -->
                            <div class="actions">
                                <a id="visit-btn" href="#" target="_blank" class="btn btn-website">
                                    <i class="fas fa-external-link-alt"></i> Visit Website
                                </a>
                                <button id="upvote-btn" class="btn btn-upvote" onclick="upvoteAgent()">
                                    <i class="fas fa-arrow-up"></i> Upvote (<span id="upvote-count">0</span>)
                                </button>
                                <button id="save-btn" class="btn btn-save" onclick="toggleSave()">
                                    <i class="fas fa-bookmark"></i> <span id="save-text">Save</span>
                                </button>
                                <button class="btn btn-share" onclick="shareAgent()">
                                    <i class="fas fa-share-alt"></i> Share
                                </button>
                            </div>
                        </div>

                        <!-- Jump Links -->
                        <div class="tabs">
                            <a href="#overview" class="tab active">Overview</a>
                            <a href="#features" class="tab">Features</a>
                            <a href="#usecases" class="tab">Use Cases</a>
                            <a href="#pricing" class="tab">Pricing</a>
                            <a href="#reviews" class="tab">Reviews</a>
                        </div>

                        <!-- All Content Visible -->
                        <div id="overview" class="section">
                            <h2 class="section-title">Overview</h2>
                            <div id="agent-description">Loading...</div>
                        </div>

                        <div id="features" class="section">
                            <h2 class="section-title">Key Features</h2>
                            <div id="features-list" class="feature-list"></div>
                        </div>

                        <div id="usecases" class="section">
                            <h2 class="section-title">Use Cases</h2>
                            <div id="usecases-list" class="feature-list"></div>
                        </div>

                        <div id="pricing" class="section">
                            <h2 class="section-title">Pricing</h2>
                            <div id="pricing-info">
                                <div class="feature-item">
                                    <div class="feature-content">
                                        <h4>Pricing Model: <span id="pricing-model">-</span></h4>
                                        <p id="pricing-details"></p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Screenshots Gallery -->
                        <div id="screenshots" class="section" style="display: none;">
                            <h2 class="section-title">Screenshots</h2>
                            <div id="screenshots-grid" class="screenshots-grid"></div>
                        </div>

                        <div id="reviews" class="section">
                            <h2 class="section-title">Reviews</h2>
                            <div id="reviews-list"></div>
                        </div>
                    </div>

                    <!-- Right Sidebar -->
                    <div class="sidebar">
                        <!-- YouTube Video -->
                        <div class="sidebar-section" id="video-section" style="display: none;">
                            <h3 class="sidebar-title"><i class="fab fa-youtube" style="margin-right: 8px; color: #ff0000;"></i>Video Demo</h3>
                            <div id="youtube-container" class="video-container"></div>
                        </div>

                        <!-- Company Info -->
                        <div class="sidebar-section">
                            <h3 class="sidebar-title"><i class="fas fa-building" style="margin-right: 8px; color: #7c3aed;"></i>Company Information</h3>
                            <div class="info-grid">
                                <div class="info-row">
                                    <div class="info-icon"><i class="fas fa-briefcase"></i></div>
                                    <div class="info-content">
                                        <div class="info-label">Company</div>
                                        <div class="info-value" id="company-name">-</div>
                                    </div>
                                </div>
                                <div class="info-row">
                                    <div class="info-icon"><i class="fas fa-calendar-alt"></i></div>
                                    <div class="info-content">
                                        <div class="info-label">Founded</div>
                                        <div class="info-value" id="company-founded">-</div>
                                    </div>
                                </div>
                                <div class="info-row">
                                    <div class="info-icon"><i class="fas fa-map-marker-alt"></i></div>
                                    <div class="info-content">
                                        <div class="info-label">Headquarters</div>
                                        <div class="info-value" id="company-hq">-</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Social Links -->
                        <div class="sidebar-section">
                            <h3 class="sidebar-title"><i class="fas fa-share-alt" style="margin-right: 8px; color: #7c3aed;"></i>Connect</h3>
                            <div id="social-links" class="social-links"></div>
                        </div>

                        <!-- Rating Summary -->
                        <div class="sidebar-section">
                            <h3 class="sidebar-title"><i class="fas fa-star" style="margin-right: 8px; color: #fbbf24;"></i>User Ratings</h3>
                            <div class="rating-summary">
                                <div class="rating-number" id="avg-rating">0.0</div>
                                <div class="rating-stars" id="rating-stars"></div>
                                <p style="color: #6b7280; font-size: 14px; margin-top: 8px;">
                                    <span id="review-count">0</span> reviews
                                </p>
                            </div>
                            <div class="rating-bars">
                                <div class="rating-bar">
                                    <span class="bar-label">5★</span>
                                    <div class="bar-fill"><div class="bar-progress" id="bar-5" style="width: 0%"></div></div>
                                    <span class="bar-count" id="count-5">0</span>
                                </div>
                                <div class="rating-bar">
                                    <span class="bar-label">4★</span>
                                    <div class="bar-fill"><div class="bar-progress" id="bar-4" style="width: 0%"></div></div>
                                    <span class="bar-count" id="count-4">0</span>
                                </div>
                                <div class="rating-bar">
                                    <span class="bar-label">3★</span>
                                    <div class="bar-fill"><div class="bar-progress" id="bar-3" style="width: 0%"></div></div>
                                    <span class="bar-count" id="count-3">0</span>
                                </div>
                                <div class="rating-bar">
                                    <span class="bar-label">2★</span>
                                    <div class="bar-fill"><div class="bar-progress" id="bar-2" style="width: 0%"></div></div>
                                    <span class="bar-count" id="count-2">0</span>
                                </div>
                                <div class="rating-bar">
                                    <span class="bar-label">1★</span>
                                    <div class="bar-fill"><div class="bar-progress" id="bar-1" style="width: 0%"></div></div>
                                    <span class="bar-count" id="count-1">0</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Lightbox Modal -->
    <div id="lightbox" class="lightbox" onclick="closeLightbox()">
        <div class="lightbox-content" onclick="event.stopPropagation()">
            <span class="lightbox-close" onclick="closeLightbox()">&times;</span>
            <span class="lightbox-prev" onclick="changeLightboxImage(-1)">&#10094;</span>
            <img id="lightbox-img" class="lightbox-img" src="" alt="">
            <span class="lightbox-next" onclick="changeLightboxImage(1)">&#10095;</span>
        </div>
    </div>

    ${getFooter()}

    <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
    <script>
        const API_BASE = '/api';
        const SLUG = '${slug}';
        let currentAgent = null;
        let isSaved = false;

        // Highlight active tab on scroll
        window.addEventListener('scroll', function() {
            const sections = ['overview', 'features', 'usecases', 'pricing', 'reviews'];
            let current = '';
            
            sections.forEach(section => {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    if (rect.top <= 150 && rect.bottom >= 150) {
                        current = section;
                    }
                }
            });
            
            if (current) {
                document.querySelectorAll('.tab').forEach(tab => {
                    tab.classList.remove('active');
                    if (tab.getAttribute('href') === '#' + current) {
                        tab.classList.add('active');
                    }
                });
            }
        });

        // Load agent data
        async function loadAgent() {
            try {
                const response = await axios.get(API_BASE + '/public/' + SLUG + '/details');
                
                if (!response.data.success) {
                    document.getElementById('loading').innerHTML = '<div class="loading"><p style="color: #ef4444;">Agent not found</p></div>';
                    return;
                }

                const data = response.data.data;
                currentAgent = data.agent;
                
                // Update page title
                document.getElementById('page-title').textContent = currentAgent.name + ' - AI Agents Directory';
                document.getElementById('breadcrumb-agent').textContent = currentAgent.name;
                document.getElementById('breadcrumb-category').textContent = currentAgent.category_names || 'NSFW';
                
                // Update agent info
                document.getElementById('agent-logo').src = currentAgent.logo_url || 'https://storage.llmdude.com/uploads/1761722667625-3falg8084x7.png';
                document.getElementById('agent-name').textContent = currentAgent.name;
                document.getElementById('agent-tagline').textContent = currentAgent.tagline || '';
                document.getElementById('view-count').textContent = currentAgent.view_count || 0;
                document.getElementById('like-count').textContent = currentAgent.upvote_count || 0;
                document.getElementById('upvote-count').textContent = currentAgent.upvote_count || 0;
                
                // Update badges
                let badges = '';
                if (currentAgent.category_names) {
                    badges += '<span class="badge badge-category"><i class="fas fa-tag"></i> ' + currentAgent.category_names + '</span>';
                }
                if (currentAgent.is_open_source) {
                    badges += '<span class="badge badge-opensource"><i class="fas fa-code-branch"></i> Open Source</span>';
                }
                if (currentAgent.is_verified) {
                    badges += '<span class="badge badge-verified"><i class="fas fa-check-circle"></i> Verified</span>';
                }
                document.getElementById('agent-badges').innerHTML = badges;
                
                // Visit button
                document.getElementById('visit-btn').href = currentAgent.website_url;
                
                // Description
                document.getElementById('agent-description').innerHTML = currentAgent.long_description || currentAgent.description || 'No description available.';
                
                // Features
                const features = data.features || [];
                let featuresHTML = '';
                if (features.length > 0) {
                    features.forEach(f => {
                        featuresHTML += '<div class="feature-item"><div class="feature-icon"><i class="fas fa-check-circle"></i></div><div class="feature-content"><h4>' + f.title + '</h4><p>' + (f.description || '') + '</p></div></div>';
                    });
                } else {
                    featuresHTML = '<p style="color: #6b7280;">No features listed.</p>';
                }
                document.getElementById('features-list').innerHTML = featuresHTML;
                
                // Use Cases
                const useCases = data.useCases || [];
                let useCasesHTML = '';
                if (useCases.length > 0) {
                    useCases.forEach((uc, i) => {
                        useCasesHTML += '<div class="feature-item"><div class="feature-icon"><strong>' + (i+1) + '</strong></div><div class="feature-content"><h4>' + uc.title + '</h4><p>' + (uc.description || '') + '</p></div></div>';
                    });
                } else {
                    useCasesHTML = '<p style="color: #6b7280;">No use cases listed.</p>';
                }
                document.getElementById('usecases-list').innerHTML = useCasesHTML;
                
                // Pricing
                document.getElementById('pricing-model').textContent = currentAgent.pricing_model || 'Contact';
                let pricingDetails = '';
                if (currentAgent.pricing_starts_at) pricingDetails += 'Starting at ' + currentAgent.pricing_starts_at + '<br>';
                if (currentAgent.free_plan_available) pricingDetails += '<span style="color: #10b981;"><i class="fas fa-check"></i> Free plan available</span><br>';
                if (currentAgent.free_trial_available) pricingDetails += '<span style="color: #10b981;"><i class="fas fa-check"></i> Free trial available</span>';
                document.getElementById('pricing-details').innerHTML = pricingDetails || 'Contact for pricing details';
                
                // YouTube Video
                if (currentAgent.youtube_url) {
                    const videoId = extractYouTubeID(currentAgent.youtube_url);
                    if (videoId) {
                        document.getElementById('video-section').style.display = 'block';
                        document.getElementById('youtube-container').innerHTML = 
                            '<iframe src="https://www.youtube.com/embed/' + videoId + '" ' +
                            'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" ' +
                            'allowfullscreen></iframe>';
                    }
                }
                
                // Screenshots Gallery with Lightbox
                const screenshots = data.screenshots || [];
                window.screenshotsData = screenshots; // Store globally for lightbox
                if (screenshots.length > 0) {
                    document.getElementById('screenshots').style.display = 'block';
                    let screenshotsHTML = '';
                    screenshots.forEach((s, index) => {
                        screenshotsHTML += '<img src="' + s.image_url + '" alt="' + (s.title || 'Screenshot') + '" ' +
                            'class="screenshot-thumb" onclick="openLightbox(' + index + ')">';
                    });
                    document.getElementById('screenshots-grid').innerHTML = screenshotsHTML;
                }
                
                // Company Info
                document.getElementById('company-name').textContent = currentAgent.company_name || currentAgent.name;
                document.getElementById('company-founded').textContent = currentAgent.founded_year || '-';
                document.getElementById('company-hq').textContent = currentAgent.headquarters || '-';
                
                // Social Links with enhanced styling
                let socialHTML = '';
                if (currentAgent.twitter_url) socialHTML += '<a href="' + currentAgent.twitter_url + '" target="_blank" class="social-link twitter" title="Twitter"><i class="fab fa-twitter"></i></a>';
                if (currentAgent.linkedin_url) socialHTML += '<a href="' + currentAgent.linkedin_url + '" target="_blank" class="social-link linkedin" title="LinkedIn"><i class="fab fa-linkedin"></i></a>';
                if (currentAgent.discord_url) socialHTML += '<a href="' + currentAgent.discord_url + '" target="_blank" class="social-link discord" title="Discord"><i class="fab fa-discord"></i></a>';
                if (currentAgent.github_url) socialHTML += '<a href="' + currentAgent.github_url + '" target="_blank" class="social-link github" title="GitHub"><i class="fab fa-github"></i></a>';
                if (socialHTML) {
                    document.getElementById('social-links').innerHTML = socialHTML;
                } else {
                    document.getElementById('social-links').innerHTML = '<p style="color: #6b7280; font-size: 14px; text-align: center;">No social links available</p>';
                }
                
                // Rating
                const reviewStats = data.reviewStats || {};
                const avgRating = reviewStats.average_rating || 0;
                const totalReviews = reviewStats.total_reviews || 0;
                document.getElementById('avg-rating').textContent = avgRating.toFixed(1);
                document.getElementById('rating-display').textContent = avgRating.toFixed(1);
                document.getElementById('review-count').textContent = totalReviews;
                
                let starsHTML = '';
                for (let i = 1; i <= 5; i++) {
                    starsHTML += i <= Math.round(avgRating) ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
                }
                document.getElementById('rating-stars').innerHTML = starsHTML;
                
                // Rating bars
                const total = totalReviews || 1;
                for (let i = 1; i <= 5; i++) {
                    const count = reviewStats['rating_' + i] || 0;
                    const percent = (count / total * 100).toFixed(0);
                    document.getElementById('bar-' + i).style.width = percent + '%';
                    document.getElementById('count-' + i).textContent = count;
                }
                
                // Reviews
                const reviews = data.reviews || [];
                let reviewsHTML = '';
                if (reviews.length > 0) {
                    reviews.forEach(r => {
                        let stars = '';
                        for (let i = 1; i <= 5; i++) {
                            stars += i <= r.rating ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
                        }
                        reviewsHTML += '<div class="review-card"><div class="review-header"><div class="review-avatar"></div><div class="review-author"><div class="review-name">' + r.user_name + '</div><div class="review-rating">' + stars + '</div><div class="review-date">' + new Date(r.created_at).toLocaleDateString() + '</div></div></div><p>' + r.comment + '</p></div>';
                    });
                } else {
                    reviewsHTML = '<p style="color: #6b7280;">No reviews yet. Be the first to review!</p>';
                }
                document.getElementById('reviews-list').innerHTML = reviewsHTML;
                
                // Check save status
                checkSaveStatus();
                
                // Track view
                axios.post(API_BASE + '/public/' + currentAgent.id + '/view').catch(console.error);
                
                // Show content
                document.getElementById('loading').style.display = 'none';
                document.getElementById('content').style.display = 'block';
                
            } catch (error) {
                console.error('Error loading agent:', error);
                document.getElementById('loading').innerHTML = '<div class="loading"><p style="color: #ef4444;">Error loading agent. Please try again.</p></div>';
            }
        }

        // Extract YouTube video ID from various URL formats
        function extractYouTubeID(url) {
            if (!url) return null;
            const patterns = [
                /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
                /youtube\.com\/embed\/([^&\n?#]+)/,
                /youtube\.com\/v\/([^&\n?#]+)/
            ];
            for (const pattern of patterns) {
                const match = url.match(pattern);
                if (match && match[1]) return match[1];
            }
            return null;
        }

        // Lightbox functionality
        let currentLightboxIndex = 0;
        
        function openLightbox(index) {
            currentLightboxIndex = index;
            const screenshots = window.screenshotsData || [];
            if (screenshots[index]) {
                document.getElementById('lightbox-img').src = screenshots[index].image_url;
                document.getElementById('lightbox').classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent background scrolling
            }
        }
        
        function closeLightbox() {
            document.getElementById('lightbox').classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        }
        
        function changeLightboxImage(direction) {
            const screenshots = window.screenshotsData || [];
            currentLightboxIndex += direction;
            
            // Loop around
            if (currentLightboxIndex < 0) currentLightboxIndex = screenshots.length - 1;
            if (currentLightboxIndex >= screenshots.length) currentLightboxIndex = 0;
            
            document.getElementById('lightbox-img').src = screenshots[currentLightboxIndex].image_url;
        }
        
        // Keyboard navigation for lightbox
        document.addEventListener('keydown', function(e) {
            const lightbox = document.getElementById('lightbox');
            if (lightbox.classList.contains('active')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') changeLightboxImage(-1);
                if (e.key === 'ArrowRight') changeLightboxImage(1);
            }
        });

        // Save/Bookmark functionality
        async function checkSaveStatus() {
            const token = localStorage.getItem('token');
            if (!token || !currentAgent) return;
            
            try {
                const res = await axios.get(API_BASE + '/saves/check/' + currentAgent.id, {
                    headers: { Authorization: 'Bearer ' + token }
                });
                if (res.data.success && res.data.saved) {
                    isSaved = true;
                    document.getElementById('save-text').textContent = 'Saved';
                    document.getElementById('save-btn').style.background = '#7c3aed';
                    document.getElementById('save-btn').style.color = '#fff';
                }
            } catch (error) {
                console.error('Error checking save status:', error);
            }
        }

        async function toggleSave() {
            const token = localStorage.getItem('token');
            if (!token) {
                showToast('Please login to save agents');
                setTimeout(() => window.location.href = '/login', 1500);
                return;
            }
            
            try {
                if (isSaved) {
                    await axios.delete(API_BASE + '/saves/' + currentAgent.id, {
                        headers: { Authorization: 'Bearer ' + token }
                    });
                    isSaved = false;
                    document.getElementById('save-text').textContent = 'Save';
                    document.getElementById('save-btn').style.background = '#f3f4f6';
                    document.getElementById('save-btn').style.color = '#374151';
                    showToast('Removed from saved list');
                } else {
                    await axios.post(API_BASE + '/saves/' + currentAgent.id, {}, {
                        headers: { Authorization: 'Bearer ' + token }
                    });
                    isSaved = true;
                    document.getElementById('save-text').textContent = 'Saved';
                    document.getElementById('save-btn').style.background = '#7c3aed';
                    document.getElementById('save-btn').style.color = '#fff';
                    showToast('Agent saved successfully!');
                }
            } catch (error) {
                showToast('Error saving agent');
            }
        }

        // Upvote
        async function upvoteAgent() {
            const token = localStorage.getItem('token');
            if (!token) {
                showToast('Please login to upvote');
                setTimeout(() => window.location.href = '/login', 1500);
                return;
            }
            
            try {
                await axios.post(API_BASE + '/agents/' + currentAgent.id + '/upvote', {}, {
                    headers: { Authorization: 'Bearer ' + token }
                });
                
                // Fetch updated count
                const res = await axios.get(API_BASE + '/public/' + currentAgent.id + '/vote-count');
                if (res.data.success) {
                    const newCount = res.data.data.upvote_count;
                    document.getElementById('upvote-count').textContent = newCount;
                    document.getElementById('like-count').textContent = newCount;
                    showToast('Upvote recorded!');
                }
            } catch (error) {
                showToast('Error upvoting agent');
            }
        }

        // Share
        function shareAgent() {
            const url = window.location.href;
            navigator.clipboard.writeText(url).then(() => {
                showToast('Link copied to clipboard!');
            });
        }

        // Toast notification
        function showToast(message) {
            const toast = document.createElement('div');
            toast.className = 'toast';
            toast.textContent = message;
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 3000);
        }

        // Load on page ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', loadAgent);
        } else {
            loadAgent();
        }
    </script>
</body>
</html>
`;
