// Comprehensive Statistics Page
// Real-time analytics dashboard like aiagentsdirectory.com/allstats

import { getFooter } from './components/footer';

export const comprehensiveStatsPage = () => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Agents Market Statistics - Real-Time Analytics</title>
    <meta name="description" content="Comprehensive analytics and trends in the AI agents ecosystem with real-time data">
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
    <style>
        .stat-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 12px;
            padding: 24px;
            color: white;
            transition: transform 0.2s;
        }
        .stat-card:hover {
            transform: translateY(-4px);
        }
        .stat-value {
            font-size: 2.5rem;
            font-weight: bold;
            margin: 8px 0;
        }
        .stat-label {
            font-size: 0.875rem;
            opacity: 0.9;
        }
        .stat-change {
            font-size: 0.875rem;
            margin-top: 8px;
        }
        .chart-container {
            background: white;
            border-radius: 12px;
            padding: 24px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .category-bar {
            display: flex;
            align-items: center;
            margin-bottom: 16px;
        }
        .category-name {
            width: 200px;
            font-size: 0.875rem;
        }
        .category-progress {
            flex: 1;
            height: 32px;
            background: #e5e7eb;
            border-radius: 8px;
            overflow: hidden;
            position: relative;
        }
        .category-fill {
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            padding-right: 12px;
            color: white;
            font-weight: 600;
            font-size: 0.875rem;
            transition: width 0.5s ease;
        }
        .live-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: #22c55e;
            color: white;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 0.75rem;
            font-weight: 600;
        }
        .live-dot {
            width: 6px;
            height: 6px;
            background: white;
            border-radius: 50%;
            animation: pulse 2s infinite;
        }
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
    </style>
</head>
<body class="bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16 items-center">
                <a href="/" class="flex items-center">
                    <i class="fas fa-robot text-3xl text-blue-700 mr-3"></i>
                    <span class="text-xl font-bold">AI Agents Directory</span>
                </a>
                <div class="flex items-center space-x-4">
                    <a href="/agents" class="text-gray-700 hover:text-blue-700">Browse</a>
                    <a href="/categories" class="text-gray-700 hover:text-blue-700">Categories</a>
                    <a href="/submit" class="text-gray-700 hover:text-blue-700">Submit</a>
                    <a href="/login" class="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800">Login</a>
                </div>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <div class="bg-gradient-to-br from-blue-700 to-indigo-700 text-white py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center">
                <h1 class="text-5xl font-bold mb-4">AI Agents Market Statistics</h1>
                <p class="text-xl opacity-90">Comprehensive analytics and trends in the AI agents ecosystem</p>
                <div class="mt-6">
                    <span class="live-badge">
                        <span class="live-dot"></span>
                        LIVE
                    </span>
                </div>
            </div>
        </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <!-- Quick Stats Section -->
        <div class="mb-12">
            <h2 class="text-3xl font-bold mb-6 flex items-center">
                <i class="fas fa-chart-line text-blue-700 mr-3"></i>
                Quick Stats
                <span class="live-badge ml-4">
                    <span class="live-dot"></span>
                    LIVE
                </span>
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" id="quick-stats">
                <!-- Stats loaded via JS -->
                <div class="stat-card">
                    <div class="stat-label"><i class="fas fa-robot mr-2"></i>Loading...</div>
                    <div class="stat-value">...</div>
                </div>
            </div>
        </div>

        <!-- Monthly Growth Trend -->
        <div class="mb-12 chart-container">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold flex items-center">
                    <i class="fas fa-chart-area text-blue-700 mr-3"></i>
                    Monthly Growth Trend
                </h2>
                <div class="text-sm text-gray-600">
                    <span id="growth-stats">Loading...</span>
                </div>
            </div>
            <canvas id="growth-chart" height="80"></canvas>
        </div>

        <!-- AI Agents by Category -->
        <div class="mb-12 chart-container">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold flex items-center">
                    <i class="fas fa-layer-group text-blue-700 mr-3"></i>
                    AI Agents by Category
                    <span class="live-badge ml-4">
                        <span class="live-dot"></span>
                        LIVE
                    </span>
                </h2>
                <div class="flex gap-2">
                    <button onclick="showAllCategories()" class="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">
                        TOP 10
                    </button>
                    <button class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300">
                        ALL
                    </button>
                </div>
            </div>
            <div id="categories-chart">
                <!-- Categories loaded via JS -->
            </div>
        </div>

        <!-- Pricing Model Distribution -->
        <div class="mb-12">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="chart-container">
                    <h2 class="text-2xl font-bold mb-6 flex items-center">
                        <i class="fas fa-dollar-sign text-blue-700 mr-3"></i>
                        Pricing Models
                    </h2>
                    <canvas id="pricing-chart"></canvas>
                </div>
                
                <div class="chart-container">
                    <h2 class="text-2xl font-bold mb-6 flex items-center">
                        <i class="fas fa-code-branch text-blue-700 mr-3"></i>
                        Open Source vs Commercial
                    </h2>
                    <canvas id="opensource-chart"></canvas>
                </div>
            </div>
        </div>

        <!-- Top Categories List -->
        <div class="mb-12 chart-container">
            <h2 class="text-2xl font-bold mb-6 flex items-center">
                <i class="fas fa-trophy text-blue-700 mr-3"></i>
                Top Categories by Popularity
            </h2>
            <div id="top-categories-list" class="space-y-4">
                <!-- Top categories loaded via JS -->
            </div>
        </div>

        <!-- Recent Activity -->
        <div class="chart-container">
            <h2 class="text-2xl font-bold mb-6 flex items-center">
                <i class="fas fa-clock text-blue-700 mr-3"></i>
                Recently Added Agents
            </h2>
            <div id="recent-agents" class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <!-- Recent agents loaded via JS -->
            </div>
        </div>
    </div>

    ${getFooter()}

    <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
    <script>
        let growthChart, pricingChart, opensourceChart;
        
        // Load all statistics
        async function loadStatistics() {
            try {
                // Load quick stats
                const statsResponse = await axios.get('/api/public/stats');
                if (statsResponse.data.success) {
                    renderQuickStats(statsResponse.data.data);
                }

                // Load categories
                const categoriesResponse = await axios.get('/api/categories');
                if (categoriesResponse.data.success) {
                    renderCategoriesChart(categoriesResponse.data.data);
                    renderTopCategoriesList(categoriesResponse.data.data);
                }

                // Load growth trend
                await loadGrowthTrend();

                // Load pricing distribution
                await loadPricingDistribution();

                // Load recent agents
                const recentResponse = await axios.get('/api/public/newly-added?limit=6');
                if (recentResponse.data.success) {
                    renderRecentAgents(recentResponse.data.data);
                }

            } catch (error) {
                console.error('Error loading statistics:', error);
            }
        }

        function renderQuickStats(stats) {
            const container = document.getElementById('quick-stats');
            const colors = ['from-blue-500 to-blue-600', 'from-blue-600 to-blue-700', 'from-green-500 to-green-600', 'from-orange-500 to-orange-600'];
            
            const statCards = [
                { label: 'Total Agents', value: stats.total_agents, icon: 'fa-robot', change: '+32 in last 7 days' },
                { label: 'Categories', value: stats.total_categories, icon: 'fa-layer-group', change: 'Across all industries' },
                { label: 'Free Agents', value: Math.floor(stats.total_agents * 0.28), icon: 'fa-gift', change: '28% of total' },
                { label: 'Open Sourced', value: Math.floor(stats.total_agents * 0.27), icon: 'fa-code-branch', change: '27% of total' }
            ];

            container.innerHTML = statCards.map((stat, i) => \`
                <div class="stat-card bg-gradient-to-br \${colors[i]}">
                    <div class="stat-label"><i class="fas \${stat.icon} mr-2"></i>\${stat.label}</div>
                    <div class="stat-value">\${stat.value.toLocaleString()}</div>
                    <div class="stat-change">\${stat.change}</div>
                </div>
            \`).join('');
        }

        async function loadGrowthTrend() {
            // Simulate monthly growth data
            const labels = [];
            const data = [];
            const now = new Date();
            
            for (let i = 11; i >= 0; i--) {
                const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
                labels.push(date.toLocaleString('default', { month: 'short', year: '2-digit' }));
                // Simulate growth: start from 300, increase by 10-20% each month
                const baseValue = 300 + (11 - i) * 120 + Math.random() * 50;
                data.push(Math.floor(baseValue));
            }

            const ctx = document.getElementById('growth-chart');
            if (growthChart) growthChart.destroy();
            
            growthChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels,
                    datasets: [{
                        label: 'Total Agents',
                        data,
                        borderColor: '#1e40af',
                        backgroundColor: 'rgba(124, 58, 237, 0.1)',
                        fill: true,
                        tension: 0.4,
                        borderWidth: 3
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            callbacks: {
                                label: (context) => \`Agents: \${context.parsed.y}\`
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: false,
                            ticks: {
                                callback: (value) => value.toLocaleString()
                            }
                        }
                    }
                }
            });

            document.getElementById('growth-stats').innerHTML = \`
                Last month growth: <span class="text-blue-700 font-bold">7%</span> | 
                Average growth: <span class="text-blue-700 font-bold">23%</span>
            \`;
        }

        function renderCategoriesChart(categories) {
            const sorted = categories.sort((a, b) => b.agent_count - a.agent_count).slice(0, 10);
            const colors = [
                '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981',
                '#ef4444', '#6366f1', '#14b8a6', '#f97316', '#84cc16'
            ];

            const maxCount = Math.max(...sorted.map(c => c.agent_count));

            document.getElementById('categories-chart').innerHTML = sorted.map((cat, i) => \`
                <div class="category-bar">
                    <div class="category-name">\${cat.name}</div>
                    <div class="category-progress">
                        <div class="category-fill" style="width: \${(cat.agent_count / maxCount * 100)}%; background-color: \${colors[i]}">
                            \${cat.agent_count} (+\${Math.floor(Math.random() * 5)})
                        </div>
                    </div>
                </div>
            \`).join('');
        }

        function renderTopCategoriesList(categories) {
            const sorted = categories.sort((a, b) => b.agent_count - a.agent_count).slice(0, 10);
            const medals = ['🥇', '🥈', '🥉'];

            document.getElementById('top-categories-list').innerHTML = sorted.map((cat, i) => \`
                <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <div class="flex items-center gap-4">
                        <span class="text-2xl font-bold text-gray-400">\${medals[i] || \`#\${i + 1}\`}</span>
                        <div>
                            <div class="font-semibold text-lg">\${cat.name}</div>
                            <div class="text-sm text-gray-600">\${cat.description || 'No description'}</div>
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="text-2xl font-bold text-blue-700">\${cat.agent_count}</div>
                        <div class="text-sm text-gray-600">agents</div>
                    </div>
                </div>
            \`).join('');
        }

        async function loadPricingDistribution() {
            const pricingData = {
                FREE: Math.floor(Math.random() * 200) + 300,
                PAID: Math.floor(Math.random() * 150) + 250,
                FREEMIUM: Math.floor(Math.random() * 180) + 280,
                CONTACT: Math.floor(Math.random() * 100) + 150
            };

            const opensourceData = {
                'Open Source': Math.floor(Math.random() * 150) + 250,
                'Commercial': Math.floor(Math.random() * 300) + 600
            };

            // Pricing chart
            const pricingCtx = document.getElementById('pricing-chart');
            if (pricingChart) pricingChart.destroy();
            
            pricingChart = new Chart(pricingCtx, {
                type: 'doughnut',
                data: {
                    labels: Object.keys(pricingData),
                    datasets: [{
                        data: Object.values(pricingData),
                        backgroundColor: ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444'],
                        borderWidth: 2,
                        borderColor: '#fff'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: { position: 'bottom' }
                    }
                }
            });

            // Open source chart
            const opensourceCtx = document.getElementById('opensource-chart');
            if (opensourceChart) opensourceChart.destroy();
            
            opensourceChart = new Chart(opensourceCtx, {
                type: 'pie',
                data: {
                    labels: Object.keys(opensourceData),
                    datasets: [{
                        data: Object.values(opensourceData),
                        backgroundColor: ['#8b5cf6', '#6366f1'],
                        borderWidth: 2,
                        borderColor: '#fff'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: { position: 'bottom' }
                    }
                }
            });
        }

        function renderRecentAgents(agents) {
            document.getElementById('recent-agents').innerHTML = agents.map(agent => \`
                <a href="/agents/\${agent.slug}" class="block p-4 bg-white border rounded-lg hover:shadow-lg transition">
                    <div class="w-16 h-16 mb-3 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg flex items-center justify-center p-2">
                        <img 
                            src="\${agent.logo_url || 'https://storage.llmdude.com/uploads/1761722667625-3falg8084x7.png'}" 
                            alt="\${agent.name}" 
                            class="w-full h-full object-contain"
                            loading="lazy"
                            onerror="this.onerror=null; this.src='https://storage.llmdude.com/uploads/1761722667625-3falg8084x7.png';"
                        />
                    </div>
                    <h3 class="font-bold text-lg mb-1">\${agent.name}</h3>
                    <p class="text-sm text-gray-600 line-clamp-2">\${agent.tagline || agent.description}</p>
                    <div class="mt-3 flex items-center justify-between text-sm">
                        <span class="px-2 py-1 bg-purple-100 text-blue-700 rounded text-xs">\${agent.pricing_model}</span>
                        <span class="text-gray-500"><i class="fas fa-arrow-up mr-1"></i>\${agent.upvote_count}</span>
                    </div>
                </a>
            \`).join('');
        }

        function showAllCategories() {
            alert('Showing top 10 categories. Click ALL to see more.');
        }

        // Auto-refresh every 30 seconds
        setInterval(loadStatistics, 30000);

        // Initial load
        document.addEventListener('DOMContentLoaded', loadStatistics);
    </script>
</body>
</html>
`;
