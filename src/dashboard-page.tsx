export const userDashboard = () => `
<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Dashboard - GenSpark AI Directory</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
    <style>
        [data-theme="light"] {
            --bg-primary: #ffffff;
            --bg-secondary: #f8fafc;
            --text-primary: #1e293b;
            --text-secondary: #64748b;
            --border-color: #e2e8f0;
            --accent: #3b82f6;
            --accent-hover: #2563eb;
        }

        [data-theme="dark"] {
            --bg-primary: #0f172a;
            --bg-secondary: #1e293b;
            --text-primary: #f1f5f9;
            --text-secondary: #94a3b8;
            --border-color: #334155;
            --accent: #3b82f6;
            --accent-hover: #60a5fa;
        }

        body {
            background: var(--bg-secondary);
            min-height: 100vh;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        }

        .dashboard-container {
            display: flex;
            min-height: 100vh;
        }

        .sidebar {
            width: 250px;
            background: var(--bg-primary);
            border-right: 1px solid var(--border-color);
            padding: 2rem 0;
            position: fixed;
            height: 100vh;
            overflow-y: auto;
        }

        .sidebar-header {
            padding: 0 1.5rem;
            margin-bottom: 2rem;
        }

        .sidebar-nav {
            display: flex;
            flex-direction: column;
        }

        .sidebar-link {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1rem 1.5rem;
            color: var(--text-secondary);
            text-decoration: none;
            transition: all 0.2s ease;
            border-left: 3px solid transparent;
        }

        .sidebar-link:hover {
            background: var(--bg-secondary);
            color: var(--text-primary);
        }

        .sidebar-link.active {
            background: rgba(59, 130, 246, 0.1);
            color: var(--accent);
            border-left-color: var(--accent);
        }

        .main-content {
            flex: 1;
            margin-left: 250px;
            padding: 2rem;
        }

        .content-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
        }

        .content-section {
            display: none;
        }

        .content-section.active {
            display: block;
            animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .card {
            background: var(--bg-primary);
            border-radius: 12px;
            padding: 1.5rem;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            margin-bottom: 1.5rem;
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
        }

        .stat-card {
            background: var(--bg-primary);
            border-radius: 12px;
            padding: 1.5rem;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            display: flex;
            align-items: center;
            gap: 1rem;
        }

        .stat-icon {
            width: 50px;
            height: 50px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
        }

        .stat-icon.blue { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
        .stat-icon.green { background: rgba(16, 185, 129, 0.1); color: #10b981; }
        .stat-icon.purple { background: rgba(139, 92, 246, 0.1); color: #8b5cf6; }
        .stat-icon.orange { background: rgba(251, 146, 60, 0.1); color: #fb923c; }

        .stat-info h3 {
            font-size: 1.75rem;
            font-weight: bold;
            color: var(--text-primary);
            margin-bottom: 0.25rem;
        }

        .stat-info p {
            font-size: 0.875rem;
            color: var(--text-secondary);
        }

        .table-container {
            overflow-x: auto;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        thead {
            background: var(--bg-secondary);
        }

        th {
            padding: 1rem;
            text-align: left;
            font-weight: 600;
            color: var(--text-primary);
            border-bottom: 2px solid var(--border-color);
        }

        td {
            padding: 1rem;
            border-bottom: 1px solid var(--border-color);
            color: var(--text-secondary);
        }

        tr:hover {
            background: var(--bg-secondary);
        }

        .badge {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            font-size: 0.875rem;
            font-weight: 600;
        }

        .badge-pending {
            background: rgba(251, 191, 36, 0.1);
            color: #fbbf24;
        }

        .badge-approved {
            background: rgba(16, 185, 129, 0.1);
            color: #10b981;
        }

        .badge-rejected {
            background: rgba(239, 68, 68, 0.1);
            color: #ef4444;
        }

        .btn {
            padding: 0.5rem 1rem;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            text-decoration: none;
        }

        .btn-primary {
            background: var(--accent);
            color: white;
        }

        .btn-primary:hover {
            background: var(--accent-hover);
        }

        .btn-secondary {
            background: var(--bg-secondary);
            color: var(--text-primary);
        }

        .btn-secondary:hover {
            background: var(--border-color);
        }

        .btn-sm {
            padding: 0.375rem 0.75rem;
            font-size: 0.875rem;
        }

        .btn-danger {
            background: #ef4444;
            color: white;
        }

        .btn-danger:hover {
            background: #dc2626;
        }

        .grid {
            display: grid;
            gap: 1.5rem;
        }

        .grid-3 {
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        }

        .agent-card {
            background: var(--bg-primary);
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .agent-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .agent-card-image {
            width: 100%;
            height: 180px;
            object-fit: cover;
        }

        .agent-card-content {
            padding: 1.5rem;
        }

        .agent-card-title {
            font-size: 1.125rem;
            font-weight: bold;
            color: var(--text-primary);
            margin-bottom: 0.5rem;
        }

        .agent-card-tagline {
            font-size: 0.875rem;
            color: var(--text-secondary);
            margin-bottom: 1rem;
        }

        .agent-card-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .review-item {
            background: var(--bg-primary);
            border-radius: 12px;
            padding: 1.5rem;
            margin-bottom: 1rem;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .review-header {
            display: flex;
            justify-content: space-between;
            align-items: start;
            margin-bottom: 1rem;
        }

        .review-agent-info {
            display: flex;
            align-items: center;
            gap: 1rem;
        }

        .review-agent-logo {
            width: 50px;
            height: 50px;
            border-radius: 8px;
            object-fit: cover;
        }

        .review-rating {
            display: flex;
            gap: 0.25rem;
            margin-bottom: 0.5rem;
        }

        .star {
            color: #fbbf24;
        }

        .star.empty {
            color: var(--border-color);
        }

        .form-group {
            margin-bottom: 1.5rem;
        }

        .form-label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 600;
            color: var(--text-primary);
        }

        .form-input, .form-textarea {
            width: 100%;
            padding: 0.75rem 1rem;
            border: 2px solid var(--border-color);
            border-radius: 8px;
            background: var(--bg-primary);
            color: var(--text-primary);
            font-size: 1rem;
            transition: all 0.2s ease;
        }

        .form-input:focus, .form-textarea:focus {
            outline: none;
            border-color: var(--accent);
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .form-textarea {
            min-height: 120px;
            resize: vertical;
        }

        .avatar-upload {
            display: flex;
            align-items: center;
            gap: 1.5rem;
        }

        .avatar-preview {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            object-fit: cover;
            border: 3px solid var(--border-color);
        }

        .checkbox-group {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        .checkbox-label {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            cursor: pointer;
        }

        .empty-state {
            text-align: center;
            padding: 4rem 2rem;
            color: var(--text-secondary);
        }

        .empty-state i {
            font-size: 4rem;
            margin-bottom: 1rem;
            opacity: 0.3;
        }

        .action-buttons {
            display: flex;
            gap: 0.5rem;
        }

        .topbar {
            background: var(--bg-primary);
            border-bottom: 1px solid var(--border-color);
            padding: 1rem 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: sticky;
            top: 0;
            z-index: 100;
        }

        .user-menu {
            display: flex;
            align-items: center;
            gap: 1rem;
        }

        .user-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            object-fit: cover;
        }

        @media (max-width: 768px) {
            .sidebar {
                transform: translateX(-100%);
                z-index: 200;
            }

            .sidebar.mobile-open {
                transform: translateX(0);
            }

            .main-content {
                margin-left: 0;
            }

            .stats-grid {
                grid-template-columns: 1fr;
            }

            .mobile-menu-btn {
                display: block;
            }
        }
    </style>
</head>
<body>
    <!-- Top Bar -->
    <div class="topbar">
        <div style="display: flex; align-items: center; gap: 1rem;">
            <button class="btn btn-secondary mobile-menu-btn" onclick="toggleMobileSidebar()" style="display: none;">
                <i class="fas fa-bars"></i>
            </button>
            <h1 style="font-size: 1.5rem; font-weight: bold; color: var(--text-primary);">
                <i class="fas fa-tachometer-alt mr-2" style="color: var(--accent);"></i>
                Dashboard
            </h1>
        </div>
        <div class="user-menu">
            <button class="btn btn-primary btn-sm" onclick="window.location.href='/submit'">
                <i class="fas fa-plus"></i>
                Submit Agent
            </button>
            <img src="https://ui-avatars.com/api/?name=User&background=3b82f6&color=fff" alt="User Avatar" class="user-avatar" id="user-avatar" />
            <button class="btn btn-secondary btn-sm" onclick="logout()">
                <i class="fas fa-sign-out-alt"></i>
                Logout
            </button>
        </div>
    </div>

    <div class="dashboard-container">
        <!-- Sidebar -->
        <aside class="sidebar" id="sidebar">
            <div class="sidebar-header">
                <p style="color: var(--text-secondary); font-size: 0.875rem;">Welcome back,</p>
                <h2 style="color: var(--text-primary); font-weight: bold;" id="user-name">User</h2>
            </div>
            
            <nav class="sidebar-nav">
                <a href="#overview" class="sidebar-link active" onclick="showSection('overview', this)">
                    <i class="fas fa-chart-line"></i>
                    Overview
                </a>
                <a href="#submissions" class="sidebar-link" onclick="showSection('submissions', this)">
                    <i class="fas fa-list-alt"></i>
                    My Submissions
                </a>
                <a href="#upvotes" class="sidebar-link" onclick="showSection('upvotes', this)">
                    <i class="fas fa-heart"></i>
                    My Upvotes
                </a>
                <a href="#reviews" class="sidebar-link" onclick="showSection('reviews', this)">
                    <i class="fas fa-star"></i>
                    My Reviews
                </a>
                <a href="#settings" class="sidebar-link" onclick="showSection('settings', this)">
                    <i class="fas fa-cog"></i>
                    Settings
                </a>
            </nav>
        </aside>

        <!-- Main Content -->
        <main class="main-content">
            <!-- Overview Section -->
            <section class="content-section active" id="overview">
                <div class="content-header">
                    <h2 style="font-size: 1.875rem; font-weight: bold; color: var(--text-primary);">Overview</h2>
                </div>

                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon blue">
                            <i class="fas fa-robot"></i>
                        </div>
                        <div class="stat-info">
                            <h3 id="stat-submissions">0</h3>
                            <p>Total Submissions</p>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon green">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <div class="stat-info">
                            <h3 id="stat-approved">0</h3>
                            <p>Approved</p>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon purple">
                            <i class="fas fa-heart"></i>
                        </div>
                        <div class="stat-info">
                            <h3 id="stat-upvotes">0</h3>
                            <p>Total Upvotes</p>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon orange">
                            <i class="fas fa-star"></i>
                        </div>
                        <div class="stat-info">
                            <h3 id="stat-reviews">0</h3>
                            <p>Reviews Written</p>
                        </div>
                    </div>
                </div>

                <div class="card">
                    <h3 style="font-size: 1.25rem; font-weight: bold; color: var(--text-primary); margin-bottom: 1rem;">
                        Recent Activity
                    </h3>
                    <div id="recent-activity">
                        <div class="empty-state">
                            <i class="fas fa-inbox"></i>
                            <p>No recent activity</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- My Submissions Section -->
            <section class="content-section" id="submissions">
                <div class="content-header">
                    <h2 style="font-size: 1.875rem; font-weight: bold; color: var(--text-primary);">My Submissions</h2>
                    <button class="btn btn-primary" onclick="window.location.href='/submit'">
                        <i class="fas fa-plus"></i>
                        Submit New Agent
                    </button>
                </div>

                <div class="card">
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Agent Name</th>
                                    <th>Status</th>
                                    <th>Submitted</th>
                                    <th>Views</th>
                                    <th>Upvotes</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="submissions-table-body">
                                <tr>
                                    <td colspan="6">
                                        <div class="empty-state">
                                            <i class="fas fa-robot"></i>
                                            <p>No submissions yet</p>
                                            <button class="btn btn-primary" onclick="window.location.href='/submit'" style="margin-top: 1rem;">
                                                <i class="fas fa-plus"></i>
                                                Submit Your First Agent
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            <!-- My Upvotes Section -->
            <section class="content-section" id="upvotes">
                <div class="content-header">
                    <h2 style="font-size: 1.875rem; font-weight: bold; color: var(--text-primary);">My Upvotes</h2>
                </div>

                <div class="grid grid-3" id="upvotes-grid">
                    <div class="empty-state">
                        <i class="fas fa-heart"></i>
                        <p>You haven't upvoted any agents yet</p>
                        <button class="btn btn-primary" onclick="window.location.href='/'" style="margin-top: 1rem;">
                            <i class="fas fa-search"></i>
                            Explore Agents
                        </button>
                    </div>
                </div>
            </section>

            <!-- My Reviews Section -->
            <section class="content-section" id="reviews">
                <div class="content-header">
                    <h2 style="font-size: 1.875rem; font-weight: bold; color: var(--text-primary);">My Reviews</h2>
                </div>

                <div id="reviews-list">
                    <div class="empty-state">
                        <i class="fas fa-star"></i>
                        <p>You haven't written any reviews yet</p>
                        <button class="btn btn-primary" onclick="window.location.href='/'" style="margin-top: 1rem;">
                            <i class="fas fa-search"></i>
                            Find Agents to Review
                        </button>
                    </div>
                </div>
            </section>

            <!-- Settings Section -->
            <section class="content-section" id="settings">
                <div class="content-header">
                    <h2 style="font-size: 1.875rem; font-weight: bold; color: var(--text-primary);">Account Settings</h2>
                </div>

                <!-- Profile Settings -->
                <div class="card">
                    <h3 style="font-size: 1.25rem; font-weight: bold; color: var(--text-primary); margin-bottom: 1rem;">
                        Profile Information
                    </h3>
                    <form id="profile-form" onsubmit="updateProfile(event)">
                        <div class="form-group">
                            <label class="form-label">Profile Picture</label>
                            <div class="avatar-upload">
                                <img 
                                    src="https://ui-avatars.com/api/?name=User&background=3b82f6&color=fff" 
                                    alt="Avatar" 
                                    class="avatar-preview" 
                                    id="avatar-preview"
                                />
                                <div>
                                    <input type="file" id="avatar-upload" accept="image/*" style="display: none;" onchange="handleAvatarUpload(event)" />
                                    <button type="button" class="btn btn-secondary" onclick="document.getElementById('avatar-upload').click()">
                                        <i class="fas fa-upload"></i>
                                        Upload Photo
                                    </button>
                                    <p class="text-sm" style="color: var(--text-secondary); margin-top: 0.5rem;">
                                        JPG, PNG or GIF. Max size 2MB.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Full Name</label>
                            <input type="text" id="name" class="form-input" placeholder="John Doe" required />
                        </div>

                        <div class="form-group">
                            <label class="form-label">Email Address</label>
                            <input type="email" id="email" class="form-input" placeholder="john@example.com" required />
                        </div>

                        <div class="form-group">
                            <label class="form-label">Bio</label>
                            <textarea id="bio" class="form-textarea" placeholder="Tell us about yourself..."></textarea>
                        </div>

                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save"></i>
                            Save Changes
                        </button>
                    </form>
                </div>

                <!-- Change Password -->
                <div class="card">
                    <h3 style="font-size: 1.25rem; font-weight: bold; color: var(--text-primary); margin-bottom: 1rem;">
                        Change Password
                    </h3>
                    <form id="password-form" onsubmit="changePassword(event)">
                        <div class="form-group">
                            <label class="form-label">Current Password</label>
                            <input type="password" id="current-password" class="form-input" required />
                        </div>

                        <div class="form-group">
                            <label class="form-label">New Password</label>
                            <input type="password" id="new-password" class="form-input" minlength="8" required />
                        </div>

                        <div class="form-group">
                            <label class="form-label">Confirm New Password</label>
                            <input type="password" id="confirm-password" class="form-input" minlength="8" required />
                        </div>

                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-key"></i>
                            Change Password
                        </button>
                    </form>
                </div>

                <!-- Email Preferences -->
                <div class="card">
                    <h3 style="font-size: 1.25rem; font-weight: bold; color: var(--text-primary); margin-bottom: 1rem;">
                        Email Preferences
                    </h3>
                    <div class="checkbox-group">
                        <label class="checkbox-label">
                            <input type="checkbox" id="email-newsletter" checked />
                            <span>Newsletter and product updates</span>
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" id="email-submissions" checked />
                            <span>Submission status updates</span>
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" id="email-upvotes" checked />
                            <span>When someone upvotes my agent</span>
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" id="email-reviews" checked />
                            <span>When someone reviews my agent</span>
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" id="email-marketing" />
                            <span>Marketing and promotional emails</span>
                        </label>
                    </div>
                    <button class="btn btn-primary" onclick="saveEmailPreferences()" style="margin-top: 1rem;">
                        <i class="fas fa-save"></i>
                        Save Preferences
                    </button>
                </div>

                <!-- Danger Zone -->
                <div class="card" style="border: 2px solid #ef4444;">
                    <h3 style="font-size: 1.25rem; font-weight: bold; color: #ef4444; margin-bottom: 1rem;">
                        Danger Zone
                    </h3>
                    <p style="color: var(--text-secondary); margin-bottom: 1rem;">
                        Once you delete your account, there is no going back. All your submissions, upvotes, and reviews will be permanently deleted.
                    </p>
                    <button class="btn btn-danger" onclick="confirmDeleteAccount()">
                        <i class="fas fa-trash"></i>
                        Delete Account
                    </button>
                </div>
            </section>
        </main>
    </div>

    <script>
        let userData = null;

        // Initialize dashboard
        window.addEventListener('DOMContentLoaded', async () => {
            // Check authentication
            const token = localStorage.getItem('auth_token');
            if (!token) {
                window.location.href = '/login?redirect=/dashboard';
                return;
            }

            try {
                await loadUserData();
                await loadSubmissions();
                await loadUpvotes();
                await loadReviews();
                updateStats();
            } catch (error) {
                console.error('Failed to load dashboard data:', error);
                if (error.response?.status === 401) {
                    localStorage.removeItem('auth_token');
                    window.location.href = '/login?redirect=/dashboard';
                }
            }
        });

        async function loadUserData() {
            const token = localStorage.getItem('auth_token');
            const response = await axios.get('/api/user/profile', {
                headers: { Authorization: 'Bearer ' + token }
            });
            
            userData = response.data.data;
            document.getElementById('user-name').textContent = userData.name;
            document.getElementById('name').value = userData.name;
            document.getElementById('email').value = userData.email;
            
            if (userData.avatar) {
                document.getElementById('user-avatar').src = userData.avatar;
                document.getElementById('avatar-preview').src = userData.avatar;
            }
            
            if (userData.bio) {
                document.getElementById('bio').value = userData.bio;
            }
        }

        async function loadSubmissions() {
            const token = localStorage.getItem('auth_token');
            const response = await axios.get('/api/user/submissions', {
                headers: { Authorization: 'Bearer ' + token }
            });
            
            const submissions = response.data.data;
            const tbody = document.getElementById('submissions-table-body');
            
            if (submissions.length === 0) {
                return; // Keep empty state
            }
            
            tbody.innerHTML = submissions.map(sub => \`
                <tr>
                    <td>
                        <div style="display: flex; align-items: center; gap: 0.75rem;">
                            <img src="\${sub.logo_url}" alt="\${sub.name}" style="width: 40px; height: 40px; border-radius: 8px; object-fit: cover;" />
                            <strong style="color: var(--text-primary);">\${sub.name}</strong>
                        </div>
                    </td>
                    <td>
                        <span class="badge badge-\${sub.status.toLowerCase()}">
                            \${sub.status}
                        </span>
                    </td>
                    <td>\${new Date(sub.created_at).toLocaleDateString()}</td>
                    <td>\${sub.view_count || 0}</td>
                    <td>\${sub.upvote_count || 0}</td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn btn-secondary btn-sm" onclick="viewAgent(\${sub.id})">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn btn-secondary btn-sm" onclick="editAgent(\${sub.id})">
                                <i class="fas fa-edit"></i>
                            </button>
                            \${sub.status === 'PENDING' ? \`
                                <button class="btn btn-danger btn-sm" onclick="deleteAgent(\${sub.id})">
                                    <i class="fas fa-trash"></i>
                                </button>
                            \` : ''}
                        </div>
                    </td>
                </tr>
            \`).join('');
        }

        async function loadUpvotes() {
            const token = localStorage.getItem('auth_token');
            const response = await axios.get('/api/user/upvotes', {
                headers: { Authorization: 'Bearer ' + token }
            });
            
            const upvotes = response.data.data;
            const grid = document.getElementById('upvotes-grid');
            
            if (upvotes.length === 0) {
                return; // Keep empty state
            }
            
            grid.innerHTML = upvotes.map(agent => \`
                <div class="agent-card">
                    <img src="\${agent.logo_url}" alt="\${agent.name}" class="agent-card-image" />
                    <div class="agent-card-content">
                        <h3 class="agent-card-title">\${agent.name}</h3>
                        <p class="agent-card-tagline">\${agent.tagline}</p>
                        <div class="agent-card-footer">
                            <button class="btn btn-secondary btn-sm" onclick="window.location.href='/agent/\${agent.slug}'">
                                View Details
                            </button>
                            <button class="btn btn-danger btn-sm" onclick="removeUpvote(\${agent.id})">
                                <i class="fas fa-heart-broken"></i>
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            \`).join('');
        }

        async function loadReviews() {
            const token = localStorage.getItem('auth_token');
            const response = await axios.get('/api/user/reviews', {
                headers: { Authorization: 'Bearer ' + token }
            });
            
            const reviews = response.data.data;
            const container = document.getElementById('reviews-list');
            
            if (reviews.length === 0) {
                return; // Keep empty state
            }
            
            container.innerHTML = reviews.map(review => \`
                <div class="review-item">
                    <div class="review-header">
                        <div class="review-agent-info">
                            <img src="\${review.agent_logo}" alt="\${review.agent_name}" class="review-agent-logo" />
                            <div>
                                <h4 style="font-weight: bold; color: var(--text-primary);">\${review.agent_name}</h4>
                                <div class="review-rating">
                                    \${Array(5).fill(0).map((_, i) => 
                                        \`<i class="fas fa-star \${i < review.rating ? 'star' : 'star empty'}"></i>\`
                                    ).join('')}
                                </div>
                            </div>
                        </div>
                        <div class="action-buttons">
                            <button class="btn btn-secondary btn-sm" onclick="editReview(\${review.id})">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-danger btn-sm" onclick="deleteReview(\${review.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    <p style="color: var(--text-secondary);">\${review.comment}</p>
                    <p class="text-sm" style="color: var(--text-secondary); margin-top: 1rem;">
                        <i class="fas fa-calendar"></i>
                        \${new Date(review.created_at).toLocaleDateString()}
                    </p>
                </div>
            \`).join('');
        }

        function updateStats() {
            // Update stats from loaded data
            const token = localStorage.getItem('auth_token');
            
            axios.get('/api/user/stats', {
                headers: { Authorization: 'Bearer ' + token }
            }).then(response => {
                const stats = response.data.data;
                document.getElementById('stat-submissions').textContent = stats.total_submissions || 0;
                document.getElementById('stat-approved').textContent = stats.approved_submissions || 0;
                document.getElementById('stat-upvotes').textContent = stats.total_upvotes || 0;
                document.getElementById('stat-reviews').textContent = stats.total_reviews || 0;
            });
        }

        function showSection(sectionId, linkElement) {
            // Hide all sections
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.remove('active');
            });
            
            // Remove active class from all links
            document.querySelectorAll('.sidebar-link').forEach(link => {
                link.classList.remove('active');
            });
            
            // Show selected section
            document.getElementById(sectionId).classList.add('active');
            linkElement.classList.add('active');
            
            // Close mobile sidebar if open
            document.getElementById('sidebar').classList.remove('mobile-open');
        }

        function toggleMobileSidebar() {
            document.getElementById('sidebar').classList.toggle('mobile-open');
        }

        async function updateProfile(event) {
            event.preventDefault();
            
            const token = localStorage.getItem('auth_token');
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                bio: document.getElementById('bio').value
            };
            
            try {
                await axios.patch('/api/user/profile', formData, {
                    headers: { Authorization: 'Bearer ' + token }
                });
                
                alert('Profile updated successfully!');
                await loadUserData();
            } catch (error) {
                alert('Failed to update profile: ' + error.response?.data?.error);
            }
        }

        async function changePassword(event) {
            event.preventDefault();
            
            const newPassword = document.getElementById('new-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            
            if (newPassword !== confirmPassword) {
                alert('New passwords do not match!');
                return;
            }
            
            const token = localStorage.getItem('auth_token');
            const data = {
                currentPassword: document.getElementById('current-password').value,
                newPassword: newPassword
            };
            
            try {
                await axios.post('/api/user/change-password', data, {
                    headers: { Authorization: 'Bearer ' + token }
                });
                
                alert('Password changed successfully!');
                document.getElementById('password-form').reset();
            } catch (error) {
                alert('Failed to change password: ' + error.response?.data?.error);
            }
        }

        function handleAvatarUpload(event) {
            const file = event.target.files[0];
            if (file && file.size <= 2 * 1024 * 1024) { // 2MB limit
                const reader = new FileReader();
                reader.onload = (e) => {
                    document.getElementById('avatar-preview').src = e.target.result;
                    // Upload to server here
                };
                reader.readAsDataURL(file);
            } else {
                alert('File size must be less than 2MB');
            }
        }

        async function saveEmailPreferences() {
            const token = localStorage.getItem('auth_token');
            const preferences = {
                newsletter: document.getElementById('email-newsletter').checked,
                submissions: document.getElementById('email-submissions').checked,
                upvotes: document.getElementById('email-upvotes').checked,
                reviews: document.getElementById('email-reviews').checked,
                marketing: document.getElementById('email-marketing').checked
            };
            
            try {
                await axios.patch('/api/user/email-preferences', preferences, {
                    headers: { Authorization: 'Bearer ' + token }
                });
                
                alert('Email preferences saved successfully!');
            } catch (error) {
                alert('Failed to save preferences: ' + error.response?.data?.error);
            }
        }

        function confirmDeleteAccount() {
            if (confirm('Are you sure you want to delete your account? This action cannot be undone!')) {
                if (confirm('This will permanently delete all your data. Are you absolutely sure?')) {
                    deleteAccount();
                }
            }
        }

        async function deleteAccount() {
            const token = localStorage.getItem('auth_token');
            
            try {
                await axios.delete('/api/user/account', {
                    headers: { Authorization: 'Bearer ' + token }
                });
                
                localStorage.removeItem('auth_token');
                alert('Your account has been deleted.');
                window.location.href = '/';
            } catch (error) {
                alert('Failed to delete account: ' + error.response?.data?.error);
            }
        }

        async function removeUpvote(agentId) {
            const token = localStorage.getItem('auth_token');
            
            try {
                await axios.delete(\`/api/agents/\${agentId}/upvote\`, {
                    headers: { Authorization: 'Bearer ' + token }
                });
                
                await loadUpvotes();
                updateStats();
            } catch (error) {
                alert('Failed to remove upvote: ' + error.response?.data?.error);
            }
        }

        function viewAgent(id) {
            window.location.href = \`/agent/\${id}\`;
        }

        function editAgent(id) {
            window.location.href = \`/edit/\${id}\`;
        }

        async function deleteAgent(id) {
            if (confirm('Are you sure you want to delete this submission?')) {
                const token = localStorage.getItem('auth_token');
                
                try {
                    await axios.delete(\`/api/agents/\${id}\`, {
                        headers: { Authorization: 'Bearer ' + token }
                    });
                    
                    await loadSubmissions();
                    updateStats();
                } catch (error) {
                    alert('Failed to delete submission: ' + error.response?.data?.error);
                }
            }
        }

        function editReview(id) {
            // Implement edit review modal
            alert('Edit review functionality coming soon!');
        }

        async function deleteReview(id) {
            if (confirm('Are you sure you want to delete this review?')) {
                const token = localStorage.getItem('auth_token');
                
                try {
                    await axios.delete(\`/api/reviews/\${id}\`, {
                        headers: { Authorization: 'Bearer ' + token }
                    });
                    
                    await loadReviews();
                    updateStats();
                } catch (error) {
                    alert('Failed to delete review: ' + error.response?.data?.error);
                }
            }
        }

        function logout() {
            localStorage.removeItem('auth_token');
            window.location.href = '/login';
        }
    </script>
</body>
</html>
`;
