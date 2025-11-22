// About Us Page
import { getFooter } from './components/footer';

export const aboutPage = () => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>About Us - AI Agents Directory</title>
    <meta name="description" content="AI Agents Directory - Your comprehensive platform for discovering AI Agents, AI Apps, and AI Tools. Find, compare, and explore the best AI solutions.">
    <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🤖</text></svg>">
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f7f8fa; color: #1a1a1a; line-height: 1.6; }
        
        /* Header */
        .header { background: #fff; border-bottom: 1px solid #e5e7eb; padding: 16px 0; position: sticky; top: 0; z-index: 100; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
        .header-content { max-width: 1200px; margin: 0 auto; padding: 0 20px; display: flex; justify-content: space-between; align-items: center; }
        .logo { display: flex; align-items: center; gap: 12px; font-size: 20px; font-weight: 700; color: #1e40af; text-decoration: none; }
        .nav { display: flex; gap: 32px; align-items: center; }
        .nav a { color: #6b7280; text-decoration: none; font-weight: 500; transition: color 0.2s; }
        .nav a:hover { color: #1e40af; }
        .btn-primary { background: #1e40af; color: #fff; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: 600; transition: background 0.2s; }
        .btn-primary:hover { background: #1e3a8a; }
        
        /* Hero Section */
        .hero { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 80px 20px; text-align: center; }
        .hero h1 { font-size: 48px; font-weight: 800; margin-bottom: 16px; }
        .hero p { font-size: 20px; opacity: 0.95; max-width: 600px; margin: 0 auto; }
        
        /* Container */
        .container { max-width: 1200px; margin: 0 auto; padding: 60px 20px; }
        
        /* Content Sections */
        .section { background: white; border-radius: 16px; padding: 48px; margin-bottom: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
        .section h2 { font-size: 32px; font-weight: 700; color: #1a1a1a; margin-bottom: 20px; display: flex; align-items: center; gap: 12px; }
        .section h2 i { color: #1e40af; }
        .section p { font-size: 18px; line-height: 1.8; color: #4b5563; margin-bottom: 16px; }
        .section ul { list-style: none; padding: 0; margin: 24px 0; }
        .section li { font-size: 18px; color: #4b5563; padding: 12px 0; padding-left: 32px; position: relative; }
        .section li:before { content: "✓"; position: absolute; left: 0; color: #1e40af; font-weight: bold; font-size: 20px; }
        
        /* Stats Grid */
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 24px; margin: 40px 0; }
        .stat-card { background: linear-gradient(135deg, #f7f8fa 0%, #fff 100%); border: 1px solid #e5e7eb; border-radius: 12px; padding: 32px; text-align: center; transition: transform 0.3s, box-shadow 0.3s; }
        .stat-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(124, 58, 237, 0.15); border-color: #1e40af; }
        .stat-number { font-size: 48px; font-weight: 800; color: #1e40af; margin-bottom: 8px; }
        .stat-label { font-size: 16px; color: #6b7280; font-weight: 600; }
        
        /* Features Grid */
        .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; margin: 40px 0; }
        .feature-card { background: #f9fafb; border-radius: 12px; padding: 32px; transition: all 0.3s; }
        .feature-card:hover { background: white; box-shadow: 0 4px 16px rgba(0,0,0,0.08); }
        .feature-icon { width: 60px; height: 60px; background: linear-gradient(135deg, #1e40af 0%, #a855f7 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 28px; margin-bottom: 16px; }
        .feature-title { font-size: 20px; font-weight: 700; color: #1a1a1a; margin-bottom: 12px; }
        .feature-desc { font-size: 16px; color: #6b7280; line-height: 1.6; }
        
        /* CTA Section */
        .cta-section { background: linear-gradient(135deg, #1e40af 0%, #a855f7 100%); border-radius: 16px; padding: 60px 40px; text-align: center; color: white; }
        .cta-section h2 { font-size: 36px; font-weight: 800; margin-bottom: 16px; }
        .cta-section p { font-size: 18px; opacity: 0.95; margin-bottom: 32px; }
        .cta-buttons { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
        .btn-white { background: white; color: #1e40af; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 16px; transition: all 0.3s; display: inline-block; }
        .btn-white:hover { transform: translateY(-2px); box-shadow: 0 8px 16px rgba(0,0,0,0.2); }
        .btn-outline { background: transparent; color: white; padding: 14px 32px; border: 2px solid white; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 16px; transition: all 0.3s; display: inline-block; }
        .btn-outline:hover { background: white; color: #1e40af; }
        
        /* Responsive */
        @media (max-width: 768px) {
            .hero h1 { font-size: 32px; }
            .hero p { font-size: 16px; }
            .section { padding: 32px 24px; }
            .section h2 { font-size: 24px; }
            .section p, .section li { font-size: 16px; }
            .nav { display: none; }
        }
    </style>
</head>
<body>
    <!-- Header -->
    <div class="header">
        <div class="header-content">
            <a href="/" class="logo">
                🤖 AI Agents Directory
            </a>
            <nav class="nav">
                <a href="/">Home</a>
                <a href="/agents">Agents</a>
                <a href="/categories">Categories</a>
                <a href="/about">About</a>
                <a href="/submit" class="btn-primary">Submit Agent</a>
            </nav>
        </div>
    </div>

    <!-- Hero Section -->
    <div class="hero">
        <h1>About AI Agents Directory</h1>
        <p>Your comprehensive platform for discovering the best AI Agents, AI Apps, and AI Tools</p>
    </div>

    <!-- Main Content -->
    <div class="container">
        <!-- Mission Section -->
        <div class="section">
            <h2><i class="fas fa-rocket"></i>Our Mission</h2>
            <p>
                AI Agents Directory is your go-to platform for discovering, comparing, and exploring the latest AI agents, AI applications, and AI tools. 
                We help individuals and businesses find the perfect AI solution for their needs.
            </p>
            <p>
                In a rapidly evolving AI landscape, we make it simple to stay informed about cutting-edge technologies. 
                Whether you're looking for productivity tools, creative assistants, or business automation solutions, we've got you covered.
            </p>
        </div>

        <!-- What We Offer Section -->
        <div class="section">
            <h2><i class="fas fa-gift"></i>What We Offer</h2>
            <ul>
                <li>Comprehensive directory of AI Agents and AI Apps</li>
                <li>Detailed reviews, ratings, and user feedback</li>
                <li>Easy comparison between different AI solutions</li>
                <li>Free and premium AI tools categorized by use case</li>
                <li>Regular updates with the latest AI innovations</li>
                <li>Community-driven recommendations and insights</li>
            </ul>
        </div>

        <!-- Stats Section -->
        <div class="section">
            <h2><i class="fas fa-chart-line"></i>By The Numbers</h2>
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-number">500+</div>
                    <div class="stat-label">AI Agents Listed</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">50+</div>
                    <div class="stat-label">Categories</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">10K+</div>
                    <div class="stat-label">Monthly Visitors</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">1K+</div>
                    <div class="stat-label">User Reviews</div>
                </div>
            </div>
        </div>

        <!-- Features Section -->
        <div class="section">
            <h2><i class="fas fa-star"></i>Why Choose Us</h2>
            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-icon">🔍</div>
                    <div class="feature-title">Easy Discovery</div>
                    <div class="feature-desc">Browse and search through hundreds of AI agents with powerful filters and categories.</div>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">⭐</div>
                    <div class="feature-title">Verified Reviews</div>
                    <div class="feature-desc">Read authentic reviews from real users to make informed decisions.</div>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🆓</div>
                    <div class="feature-title">Free & Premium</div>
                    <div class="feature-desc">Discover both free and premium AI solutions that fit your budget.</div>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🚀</div>
                    <div class="feature-title">Latest Innovations</div>
                    <div class="feature-desc">Stay updated with the newest AI tools and technologies as they launch.</div>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">📊</div>
                    <div class="feature-title">Detailed Analytics</div>
                    <div class="feature-desc">Compare features, pricing, and performance across different platforms.</div>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">👥</div>
                    <div class="feature-title">Community Driven</div>
                    <div class="feature-desc">Join a community of AI enthusiasts sharing insights and recommendations.</div>
                </div>
            </div>
        </div>

        <!-- CTA Section -->
        <div class="cta-section">
            <h2>Ready to Discover AI Solutions?</h2>
            <p>Start exploring our directory of AI agents, apps, and tools today</p>
            <div class="cta-buttons">
                <a href="/agents" class="btn-white">Browse All Agents</a>
                <a href="/submit" class="btn-outline">Submit Your AI Agent</a>
            </div>
        </div>
    </div>

    ${getFooter()}
</body>
</html>
`;
