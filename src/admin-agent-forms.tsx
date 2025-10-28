// Agent Creation and Editing Forms for Admin Panel
// This file contains pages for admins to create and edit AI agents

import { getSidebar } from './admin-ui';
import { getFooter } from './components/footer';

export const adminAgentCreatePage = () => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Create New Agent - Admin Panel</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-gray-100">
    <div class="flex h-screen">
        ${getSidebar('agents-all')}
        
        <div class="flex-1 overflow-y-auto">
            <div class="p-8">
                <div class="flex justify-between items-center mb-8">
                    <div>
                        <h1 class="text-3xl font-bold">Create New AI Agent</h1>
                        <p class="text-gray-600 mt-2">Add a new AI agent to the directory</p>
                    </div>
                    <a href="/admin/agents-all" class="px-4 py-2 text-gray-600 hover:text-gray-800">
                        <i class="fas fa-times mr-2"></i>Cancel
                    </a>
                </div>

                <div class="bg-white rounded-lg shadow-lg p-8 max-w-4xl">
                    <form id="create-agent-form">
                        <!-- Basic Information -->
                        <div class="mb-8">
                            <h2 class="text-xl font-bold mb-4 flex items-center">
                                <i class="fas fa-info-circle text-blue-600 mr-2"></i>
                                Basic Information
                            </h2>
                            
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label class="block text-sm font-medium mb-2">Agent Name *</label>
                                    <input type="text" id="name" required 
                                        class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-600"
                                        placeholder="e.g., ChatGPT">
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium mb-2">Slug (URL-friendly) *</label>
                                    <input type="text" id="slug" required 
                                        class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-600"
                                        placeholder="e.g., chatgpt">
                                    <p class="text-xs text-gray-500 mt-1">Will be auto-generated if empty</p>
                                </div>
                            </div>

                            <div class="mt-6">
                                <label class="block text-sm font-medium mb-2">Tagline *</label>
                                <input type="text" id="tagline" required 
                                    class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-600"
                                    placeholder="Brief one-line description">
                            </div>

                            <div class="mt-6">
                                <label class="block text-sm font-medium mb-2">Description *</label>
                                <textarea id="description" required rows="6" 
                                    class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-600"
                                    placeholder="Detailed description of the AI agent..."></textarea>
                            </div>
                        </div>

                        <!-- Links & Media -->
                        <div class="mb-8">
                            <h2 class="text-xl font-bold mb-4 flex items-center">
                                <i class="fas fa-link text-green-600 mr-2"></i>
                                Links & Media
                            </h2>
                            
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label class="block text-sm font-medium mb-2">Website URL *</label>
                                    <input type="url" id="website_url" required 
                                        class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-600"
                                        placeholder="https://example.com">
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium mb-2">Logo/Icon URL or Emoji</label>
                                    <input type="text" id="logo_url" 
                                        class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-600"
                                        placeholder="🤖 or https://...">
                                    <div class="mt-2">
                                        <label class="block text-sm text-gray-600 mb-1">Or upload logo:</label>
                                        <input type="file" id="logo_upload" accept="image/*"
                                            class="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100">
                                        <div id="logo_preview" class="mt-2"></div>
                                    </div>
                                </div>
                            </div>

                            <div class="mt-6">
                                <label class="block text-sm font-medium mb-2">Cover Image URL</label>
                                <input type="text" id="cover_image_url" 
                                    class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-600"
                                    placeholder="https://...">
                                <div class="mt-2">
                                    <label class="block text-sm text-gray-600 mb-1">Or upload cover image:</label>
                                    <input type="file" id="cover_upload" accept="image/*"
                                        class="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100">
                                    <div id="cover_preview" class="mt-2"></div>
                                </div>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                <div>
                                    <label class="block text-sm font-medium mb-2">Demo URL</label>
                                    <input type="url" id="demo_url" 
                                        class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-600"
                                        placeholder="https://demo.example.com">
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium mb-2">Documentation URL</label>
                                    <input type="url" id="docs_url" 
                                        class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-600"
                                        placeholder="https://docs.example.com">
                                </div>
                            </div>
                        </div>

                        <!-- Pricing & Availability -->
                        <div class="mb-8">
                            <h2 class="text-xl font-bold mb-4 flex items-center">
                                <i class="fas fa-dollar-sign text-yellow-600 mr-2"></i>
                                Pricing & Availability
                            </h2>
                            
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label class="block text-sm font-medium mb-2">Pricing Model *</label>
                                    <select id="pricing_model" required 
                                        class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-600">
                                        <option value="FREE">Free</option>
                                        <option value="FREEMIUM">Freemium</option>
                                        <option value="PAID">Paid</option>
                                        <option value="CONTACT">Contact for Pricing</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium mb-2">Pricing Details</label>
                                    <input type="text" id="pricing_details" 
                                        class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-600"
                                        placeholder="e.g., $10/month or Free trial">
                                </div>
                            </div>

                            <div class="mt-6">
                                <label class="flex items-center">
                                    <input type="checkbox" id="is_open_source" class="mr-2">
                                    <span class="text-sm font-medium">This is an open source project</span>
                                </label>
                            </div>

                            <div class="mt-6">
                                <label class="flex items-center">
                                    <input type="checkbox" id="has_free_trial" class="mr-2">
                                    <span class="text-sm font-medium">Offers free trial</span>
                                </label>
                            </div>
                        </div>

                        <!-- Categories & Tags -->
                        <div class="mb-8">
                            <h2 class="text-xl font-bold mb-4 flex items-center">
                                <i class="fas fa-folder text-purple-600 mr-2"></i>
                                Categories & Tags
                            </h2>
                            
                            <div>
                                <label class="block text-sm font-medium mb-2">Categories * (hold Ctrl/Cmd to select multiple)</label>
                                <select id="category_ids" multiple required size="5"
                                    class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-600">
                                </select>
                                <p class="text-xs text-gray-500 mt-1">Hold Ctrl (Windows) or Cmd (Mac) to select multiple categories</p>
                            </div>

                            <div class="mt-6">
                                <label class="block text-sm font-medium mb-2">Tags (comma-separated)</label>
                                <input type="text" id="tags" 
                                    class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-600"
                                    placeholder="e.g., chatbot, ai, nlp">
                            </div>
                        </div>

                        <!-- Features -->
                        <div class="mb-8">
                            <h2 class="text-xl font-bold mb-4 flex items-center">
                                <i class="fas fa-star text-orange-600 mr-2"></i>
                                Features (JSON format)
                            </h2>
                            
                            <div>
                                <label class="block text-sm font-medium mb-2">Features List</label>
                                <textarea id="features" rows="4" 
                                    class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-600 font-mono text-sm"
                                    placeholder='["Feature 1", "Feature 2", "Feature 3"]'></textarea>
                                <p class="text-xs text-gray-500 mt-1">Enter as JSON array</p>
                            </div>
                        </div>

                        <!-- Admin Settings -->
                        <div class="mb-8">
                            <h2 class="text-xl font-bold mb-4 flex items-center">
                                <i class="fas fa-cog text-red-600 mr-2"></i>
                                Admin Settings
                            </h2>
                            
                            <div>
                                <label class="block text-sm font-medium mb-2">Status *</label>
                                <select id="status" required 
                                    class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-600">
                                    <option value="PENDING">Pending Review</option>
                                    <option value="APPROVED">Approved</option>
                                    <option value="REJECTED">Rejected</option>
                                </select>
                            </div>

                            <div class="mt-6">
                                <label class="block text-sm font-medium mb-2">Admin Notes (internal)</label>
                                <textarea id="admin_notes" rows="3" 
                                    class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-600"
                                    placeholder="Internal notes for admin team..."></textarea>
                            </div>

                            <div class="mt-6">
                                <label class="flex items-center">
                                    <input type="checkbox" id="is_featured" class="mr-2">
                                    <span class="text-sm font-medium">Feature this agent on homepage</span>
                                </label>
                            </div>
                        </div>

                        <!-- Submitter Information -->
                        <div class="mb-8">
                            <h2 class="text-xl font-bold mb-4 flex items-center">
                                <i class="fas fa-user text-indigo-600 mr-2"></i>
                                Submitter Information
                            </h2>
                            
                            <div>
                                <label class="block text-sm font-medium mb-2">Submitter Email</label>
                                <input type="email" id="submitter_email" 
                                    class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-600"
                                    placeholder="contact@example.com">
                            </div>
                        </div>

                        <!-- Action Buttons -->
                        <div class="flex space-x-4 pt-6 border-t">
                            <button type="submit" 
                                class="flex-1 bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700">
                                <i class="fas fa-plus mr-2"></i>Create Agent
                            </button>
                            <button type="button" onclick="window.location='/admin/agents-all'" 
                                class="px-8 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                                Cancel
                            </button>
                        </div>
                    </form>

                    <div id="success-message" class="hidden mt-6 p-4 bg-green-100 text-green-700 rounded-lg">
                        <i class="fas fa-check-circle mr-2"></i>
                        Agent created successfully! Redirecting...
                    </div>

                    <div id="error-message" class="hidden mt-6 p-4 bg-red-100 text-red-700 rounded-lg">
                        <i class="fas fa-exclamation-circle mr-2"></i>
                        <span id="error-text"></span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
    <script>
        const authToken = localStorage.getItem('auth_token');
        if (!authToken) window.location.href = '/';
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + authToken;

        // Load categories
        async function loadCategories() {
            try {
                const response = await axios.get('/api/categories');
                if (response.data.success) {
                    const select = document.getElementById('category_ids');
                    response.data.data.forEach(cat => {
                        const option = document.createElement('option');
                        option.value = cat.id;
                        option.textContent = cat.name;
                        select.appendChild(option);
                    });
                }
            } catch (error) {
                console.error('Error loading categories:', error);
            }
        }

        // Image upload handlers
        document.getElementById('logo_upload')?.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            if (file.size > 2 * 1024 * 1024) {
                alert('Logo must be less than 2MB');
                return;
            }
            
            const preview = document.getElementById('logo_preview');
            preview.innerHTML = '<div class="text-sm text-gray-500"><i class="fas fa-spinner fa-spin"></i> Uploading...</div>';
            
            try {
                const formData = new FormData();
                formData.append('file', file);
                
                const response = await axios.post('/api/upload/image', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                
                if (response.data.success) {
                    document.getElementById('logo_url').value = response.data.data.url;
                    preview.innerHTML = '<img src="' + response.data.data.url + '" class="w-16 h-16 object-cover rounded-lg border" /><p class="text-xs text-green-600 mt-1"><i class="fas fa-check"></i> Uploaded</p>';
                }
            } catch (error) {
                preview.innerHTML = '<p class="text-xs text-red-600"><i class="fas fa-times"></i> Upload failed</p>';
                alert('Failed to upload logo: ' + (error.response?.data?.error || error.message));
            }
        });

        document.getElementById('cover_upload')?.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            if (file.size > 5 * 1024 * 1024) {
                alert('Cover image must be less than 5MB');
                return;
            }
            
            const preview = document.getElementById('cover_preview');
            preview.innerHTML = '<div class="text-sm text-gray-500"><i class="fas fa-spinner fa-spin"></i> Uploading...</div>';
            
            try {
                const formData = new FormData();
                formData.append('file', file);
                
                const response = await axios.post('/api/upload/image', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                
                if (response.data.success) {
                    document.getElementById('cover_image_url').value = response.data.data.url;
                    preview.innerHTML = '<img src="' + response.data.data.url + '" class="w-full max-w-xs h-32 object-cover rounded-lg border" /><p class="text-xs text-green-600 mt-1"><i class="fas fa-check"></i> Uploaded</p>';
                }
            } catch (error) {
                preview.innerHTML = '<p class="text-xs text-red-600"><i class="fas fa-times"></i> Upload failed</p>';
                alert('Failed to upload cover: ' + (error.response?.data?.error || error.message));
            }
        });

        // Auto-generate slug from name
        document.getElementById('name').addEventListener('input', (e) => {
            const slug = e.target.value
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, '');
            document.getElementById('slug').value = slug;
        });

        // Handle form submission
        document.getElementById('create-agent-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const data = {
                name: document.getElementById('name').value,
                slug: document.getElementById('slug').value,
                tagline: document.getElementById('tagline').value,
                description: document.getElementById('description').value,
                website_url: document.getElementById('website_url').value,
                logo_url: document.getElementById('logo_url').value || null,
                cover_image: document.getElementById('cover_image_url')?.value || null,
                demo_url: document.getElementById('demo_url').value || null,
                docs_url: document.getElementById('docs_url').value || null,
                pricing_model: document.getElementById('pricing_model').value,
                pricing_details: document.getElementById('pricing_details').value || null,
                is_open_source: document.getElementById('is_open_source').checked,
                has_free_trial: document.getElementById('has_free_trial').checked,
                category_ids: Array.from(document.getElementById('category_ids').selectedOptions).map(opt => parseInt(opt.value)),
                tags: document.getElementById('tags').value || null,
                features: document.getElementById('features').value || null,
                status: document.getElementById('status').value,
                admin_notes: document.getElementById('admin_notes').value || null,
                is_featured: document.getElementById('is_featured').checked,
                submitter_email: document.getElementById('submitter_email').value || null
            };

            try {
                const response = await axios.post('/api/admin/agents/create', data);
                if (response.data.success) {
                    document.getElementById('success-message').classList.remove('hidden');
                    document.getElementById('error-message').classList.add('hidden');
                    setTimeout(() => {
                        window.location.href = '/admin/agents-all';
                    }, 1500);
                }
            } catch (error) {
                const errorMsg = error.response?.data?.error || 'Failed to create agent';
                document.getElementById('error-text').textContent = errorMsg;
                document.getElementById('error-message').classList.remove('hidden');
                document.getElementById('success-message').classList.add('hidden');
            }
        });

        function logout() {
            localStorage.removeItem('auth_token');
            window.location.href = '/';
        }

        // Initialize
        document.addEventListener('DOMContentLoaded', () => {
            loadCategories();
        });
    </script>
${getFooter()}
</body>
</html>
`;

export const adminAgentEditPage = (agentId: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Edit Agent - Admin Panel</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-gray-100">
    <div class="flex h-screen">
        ${getSidebar('agents-all')}
        
        <div class="flex-1 overflow-y-auto">
            <div class="p-8">
                <div class="flex justify-between items-center mb-8">
                    <div>
                        <h1 class="text-3xl font-bold">Edit AI Agent</h1>
                        <p class="text-gray-600 mt-2">Update agent information</p>
                    </div>
                    <a href="/admin/agents-all" class="px-4 py-2 text-gray-600 hover:text-gray-800">
                        <i class="fas fa-times mr-2"></i>Cancel
                    </a>
                </div>

                <div id="loading" class="text-center py-12">
                    <i class="fas fa-spinner fa-spin text-4xl text-purple-600"></i>
                    <p class="text-gray-600 mt-4">Loading agent data...</p>
                </div>

                <div id="edit-form-container" class="hidden bg-white rounded-lg shadow-lg p-8 max-w-4xl">
                    <form id="edit-agent-form">
                        <!-- Same form structure as create page -->
                        <div class="mb-8">
                            <h2 class="text-xl font-bold mb-4 flex items-center">
                                <i class="fas fa-info-circle text-blue-600 mr-2"></i>
                                Basic Information
                            </h2>
                            
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label class="block text-sm font-medium mb-2">Agent Name *</label>
                                    <input type="text" id="name" required 
                                        class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-600">
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium mb-2">Slug (URL-friendly) *</label>
                                    <input type="text" id="slug" required 
                                        class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-600">
                                </div>
                            </div>

                            <div class="mt-6">
                                <label class="block text-sm font-medium mb-2">Tagline *</label>
                                <input type="text" id="tagline" required 
                                    class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-600">
                            </div>

                            <div class="mt-6">
                                <label class="block text-sm font-medium mb-2">Description *</label>
                                <textarea id="description" required rows="6" 
                                    class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-600"></textarea>
                            </div>
                        </div>

                        <div class="mb-8">
                            <h2 class="text-xl font-bold mb-4 flex items-center">
                                <i class="fas fa-link text-green-600 mr-2"></i>
                                Links & Media
                            </h2>
                            
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label class="block text-sm font-medium mb-2">Website URL *</label>
                                    <input type="url" id="website_url" required 
                                        class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-600">
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium mb-2">Logo/Icon URL or Emoji</label>
                                    <input type="text" id="logo_url" 
                                        class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-600">
                                    <div class="mt-2">
                                        <label class="block text-sm text-gray-600 mb-1">Or upload logo:</label>
                                        <input type="file" id="logo_upload" accept="image/*"
                                            class="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100">
                                        <div id="logo_preview" class="mt-2"></div>
                                    </div>
                                </div>
                            </div>

                            <div class="mt-6">
                                <label class="block text-sm font-medium mb-2">Cover Image URL</label>
                                <input type="text" id="cover_image_url" 
                                    class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-600">
                                <div class="mt-2">
                                    <label class="block text-sm text-gray-600 mb-1">Or upload cover image:</label>
                                    <input type="file" id="cover_upload" accept="image/*"
                                        class="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100">
                                    <div id="cover_preview" class="mt-2"></div>
                                </div>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                <div>
                                    <label class="block text-sm font-medium mb-2">Demo URL</label>
                                    <input type="url" id="demo_url" 
                                        class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-600">
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium mb-2">Documentation URL</label>
                                    <input type="url" id="docs_url" 
                                        class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-600">
                                </div>
                            </div>
                        </div>

                        <div class="mb-8">
                            <h2 class="text-xl font-bold mb-4 flex items-center">
                                <i class="fas fa-dollar-sign text-yellow-600 mr-2"></i>
                                Pricing & Availability
                            </h2>
                            
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label class="block text-sm font-medium mb-2">Pricing Model *</label>
                                    <select id="pricing_model" required 
                                        class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-600">
                                        <option value="FREE">Free</option>
                                        <option value="FREEMIUM">Freemium</option>
                                        <option value="PAID">Paid</option>
                                        <option value="CONTACT">Contact for Pricing</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium mb-2">Pricing Details</label>
                                    <input type="text" id="pricing_details" 
                                        class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-600">
                                </div>
                            </div>

                            <div class="mt-6">
                                <label class="flex items-center">
                                    <input type="checkbox" id="is_open_source" class="mr-2">
                                    <span class="text-sm font-medium">This is an open source project</span>
                                </label>
                            </div>

                            <div class="mt-6">
                                <label class="flex items-center">
                                    <input type="checkbox" id="has_free_trial" class="mr-2">
                                    <span class="text-sm font-medium">Offers free trial</span>
                                </label>
                            </div>
                        </div>

                        <div class="mb-8">
                            <h2 class="text-xl font-bold mb-4 flex items-center">
                                <i class="fas fa-folder text-purple-600 mr-2"></i>
                                Categories & Tags
                            </h2>
                            
                            <div>
                                <label class="block text-sm font-medium mb-2">Categories * (hold Ctrl/Cmd to select multiple)</label>
                                <select id="category_ids" multiple required size="5"
                                    class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-600">
                                </select>
                                <p class="text-xs text-gray-500 mt-1">Hold Ctrl (Windows) or Cmd (Mac) to select multiple categories</p>
                            </div>

                            <div class="mt-6">
                                <label class="block text-sm font-medium mb-2">Tags (comma-separated)</label>
                                <input type="text" id="tags" 
                                    class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-600">
                            </div>
                        </div>

                        <div class="mb-8">
                            <h2 class="text-xl font-bold mb-4 flex items-center">
                                <i class="fas fa-star text-orange-600 mr-2"></i>
                                Features (JSON format)
                            </h2>
                            
                            <div>
                                <label class="block text-sm font-medium mb-2">Features List</label>
                                <textarea id="features" rows="4" 
                                    class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-600 font-mono text-sm"></textarea>
                            </div>
                        </div>

                        <div class="mb-8">
                            <h2 class="text-xl font-bold mb-4 flex items-center">
                                <i class="fas fa-cog text-red-600 mr-2"></i>
                                Admin Settings
                            </h2>
                            
                            <div>
                                <label class="block text-sm font-medium mb-2">Status *</label>
                                <select id="status" required 
                                    class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-600">
                                    <option value="PENDING">Pending Review</option>
                                    <option value="APPROVED">Approved</option>
                                    <option value="REJECTED">Rejected</option>
                                </select>
                            </div>

                            <div class="mt-6">
                                <label class="block text-sm font-medium mb-2">Admin Notes (internal)</label>
                                <textarea id="admin_notes" rows="3" 
                                    class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-600"></textarea>
                            </div>

                            <div class="mt-6">
                                <label class="block text-sm font-medium mb-2">Rejection Reason (if rejected)</label>
                                <textarea id="rejection_reason" rows="2" 
                                    class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-600"></textarea>
                            </div>

                            <div class="mt-6">
                                <label class="flex items-center">
                                    <input type="checkbox" id="is_featured" class="mr-2">
                                    <span class="text-sm font-medium">Feature this agent on homepage</span>
                                </label>
                            </div>
                        </div>

                        <div class="mb-8">
                            <h2 class="text-xl font-bold mb-4 flex items-center">
                                <i class="fas fa-user text-indigo-600 mr-2"></i>
                                Submitter Information
                            </h2>
                            
                            <div>
                                <label class="block text-sm font-medium mb-2">Submitter Email</label>
                                <input type="email" id="submitter_email" 
                                    class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-600">
                            </div>
                        </div>

                        <div class="flex space-x-4 pt-6 border-t">
                            <button type="submit" 
                                class="flex-1 bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700">
                                <i class="fas fa-save mr-2"></i>Save Changes
                            </button>
                            <button type="button" onclick="window.location='/admin/agents-all'" 
                                class="px-8 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                                Cancel
                            </button>
                        </div>
                    </form>

                    <div id="success-message" class="hidden mt-6 p-4 bg-green-100 text-green-700 rounded-lg">
                        <i class="fas fa-check-circle mr-2"></i>
                        Agent updated successfully! Redirecting...
                    </div>

                    <div id="error-message" class="hidden mt-6 p-4 bg-red-100 text-red-700 rounded-lg">
                        <i class="fas fa-exclamation-circle mr-2"></i>
                        <span id="error-text"></span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
    <script>
        const authToken = localStorage.getItem('auth_token');
        if (!authToken) window.location.href = '/';
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + authToken;

        const agentId = ${agentId};

        async function loadCategories() {
            try {
                const response = await axios.get('/api/categories');
                if (response.data.success) {
                    const select = document.getElementById('category_id');
                    response.data.data.forEach(cat => {
                        const option = document.createElement('option');
                        option.value = cat.id;
                        option.textContent = cat.name;
                        select.appendChild(option);
                    });
                }
            } catch (error) {
                console.error('Error loading categories:', error);
            }
        }

        async function loadAgentData() {
            try {
                const response = await axios.get(\`/api/admin/agents/\${agentId}\`);
                if (response.data.success) {
                    const agent = response.data.data;
                    
                    // Populate form fields
                    document.getElementById('name').value = agent.name || '';
                    document.getElementById('slug').value = agent.slug || '';
                    document.getElementById('tagline').value = agent.tagline || '';
                    document.getElementById('description').value = agent.description || '';
                    document.getElementById('website_url').value = agent.website_url || '';
                    document.getElementById('logo_url').value = agent.logo_url || '';
                    document.getElementById('cover_image_url').value = agent.cover_image || '';
                    document.getElementById('demo_url').value = agent.demo_url || '';
                    document.getElementById('docs_url').value = agent.docs_url || '';
                    document.getElementById('pricing_model').value = agent.pricing_model || 'FREE';
                    document.getElementById('pricing_details').value = agent.pricing_details || '';
                    document.getElementById('is_open_source').checked = agent.is_open_source || false;
                    document.getElementById('has_free_trial').checked = agent.has_free_trial || false;
                    
                    // Load existing categories (after categories are loaded)
                    if (agent.category_ids && agent.category_ids.length > 0) {
                        const select = document.getElementById('category_ids');
                        agent.category_ids.forEach(catId => {
                            const option = select.querySelector('option[value="' + catId + '"]');
                            if (option) option.selected = true;
                        });
                    }
                    
                    document.getElementById('tags').value = agent.tags || '';
                    document.getElementById('features').value = agent.features || '';
                    document.getElementById('status').value = agent.status || 'PENDING';
                    document.getElementById('admin_notes').value = agent.admin_notes || '';
                    document.getElementById('rejection_reason').value = agent.rejection_reason || '';
                    document.getElementById('is_featured').checked = agent.is_featured || false;
                    document.getElementById('submitter_email').value = agent.submitter_email || '';
                    
                    // Show form
                    document.getElementById('loading').classList.add('hidden');
                    document.getElementById('edit-form-container').classList.remove('hidden');
                }
            } catch (error) {
                alert('Error loading agent: ' + (error.response?.data?.error || 'Unknown error'));
                window.location.href = '/admin/agents-all';
            }
        }

        document.getElementById('edit-agent-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const data = {
                name: document.getElementById('name').value,
                slug: document.getElementById('slug').value,
                tagline: document.getElementById('tagline').value,
                description: document.getElementById('description').value,
                website_url: document.getElementById('website_url').value,
                logo_url: document.getElementById('logo_url').value || null,
                cover_image: document.getElementById('cover_image_url')?.value || null,
                demo_url: document.getElementById('demo_url').value || null,
                docs_url: document.getElementById('docs_url').value || null,
                pricing_model: document.getElementById('pricing_model').value,
                pricing_details: document.getElementById('pricing_details').value || null,
                is_open_source: document.getElementById('is_open_source').checked,
                has_free_trial: document.getElementById('has_free_trial').checked,
                category_ids: Array.from(document.getElementById('category_ids').selectedOptions).map(opt => parseInt(opt.value)),
                tags: document.getElementById('tags').value || null,
                features: document.getElementById('features').value || null,
                status: document.getElementById('status').value,
                admin_notes: document.getElementById('admin_notes').value || null,
                rejection_reason: document.getElementById('rejection_reason').value || null,
                is_featured: document.getElementById('is_featured').checked,
                submitter_email: document.getElementById('submitter_email').value || null
            };

            try {
                const response = await axios.put(\`/api/admin/agents/\${agentId}\`, data);
                if (response.data.success) {
                    document.getElementById('success-message').classList.remove('hidden');
                    document.getElementById('error-message').classList.add('hidden');
                    setTimeout(() => {
                        window.location.href = '/admin/agents-all';
                    }, 1500);
                }
            } catch (error) {
                const errorMsg = error.response?.data?.error || 'Failed to update agent';
                document.getElementById('error-text').textContent = errorMsg;
                document.getElementById('error-message').classList.remove('hidden');
                document.getElementById('success-message').classList.add('hidden');
            }
        });

        function logout() {
            localStorage.removeItem('auth_token');
            window.location.href = '/';
        }

        // Image upload handlers
        document.getElementById('logo_upload')?.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            if (file.size > 2 * 1024 * 1024) {
                alert('Logo must be less than 2MB');
                return;
            }
            
            const preview = document.getElementById('logo_preview');
            preview.innerHTML = '<div class="text-sm text-gray-500"><i class="fas fa-spinner fa-spin"></i> Uploading...</div>';
            
            try {
                const formData = new FormData();
                formData.append('file', file);
                
                const response = await axios.post('/api/upload/image', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                
                if (response.data.success) {
                    document.getElementById('logo_url').value = response.data.data.url;
                    preview.innerHTML = '<img src="' + response.data.data.url + '" class="w-16 h-16 object-cover rounded-lg border" /><p class="text-xs text-green-600 mt-1"><i class="fas fa-check"></i> Uploaded</p>';
                }
            } catch (error) {
                preview.innerHTML = '<p class="text-xs text-red-600"><i class="fas fa-times"></i> Upload failed</p>';
                alert('Failed to upload logo: ' + (error.response?.data?.error || error.message));
            }
        });

        document.getElementById('cover_upload')?.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            if (file.size > 5 * 1024 * 1024) {
                alert('Cover image must be less than 5MB');
                return;
            }
            
            const preview = document.getElementById('cover_preview');
            preview.innerHTML = '<div class="text-sm text-gray-500"><i class="fas fa-spinner fa-spin"></i> Uploading...</div>';
            
            try {
                const formData = new FormData();
                formData.append('file', file);
                
                const response = await axios.post('/api/upload/image', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                
                if (response.data.success) {
                    document.getElementById('cover_image_url').value = response.data.data.url;
                    preview.innerHTML = '<img src="' + response.data.data.url + '" class="w-full max-w-xs h-32 object-cover rounded-lg border" /><p class="text-xs text-green-600 mt-1"><i class="fas fa-check"></i> Uploaded</p>';
                }
            } catch (error) {
                preview.innerHTML = '<p class="text-xs text-red-600"><i class="fas fa-times"></i> Upload failed</p>';
                alert('Failed to upload cover: ' + (error.response?.data?.error || error.message));
            }
        });

        // Initialize
        document.addEventListener('DOMContentLoaded', () => {
            loadCategories();
            loadAgentData();
        });
    </script>
${getFooter()}
</body>
</html>
`;
