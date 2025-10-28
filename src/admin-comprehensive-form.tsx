// COMPREHENSIVE Agent Creation and Editing Form for Admin Panel
// This form includes ALL database fields organized in logical sections

import { getSidebar } from './admin-ui';

export const adminComprehensiveEditPage = (agentId: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Edit Agent - Comprehensive Admin Panel</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        .tab-button {
            padding: 12px 24px;
            border-bottom: 3px solid transparent;
            transition: all 0.3s;
        }
        .tab-button.active {
            border-bottom-color: #7c3aed;
            color: #7c3aed;
            font-weight: 600;
        }
        .tab-content {
            display: none;
        }
        .tab-content.active {
            display: block;
        }
        .field-group {
            margin-bottom: 20px;
        }
        .dynamic-list-item {
            background: #f9fafb;
            padding: 16px;
            border-radius: 8px;
            margin-bottom: 12px;
            border: 1px solid #e5e7eb;
        }
        .upload-area {
            transition: all 0.3s ease;
        }
        .upload-area:hover {
            border-color: #7c3aed !important;
            background-color: #f5f3ff;
        }
    </style>
</head>
<body class="bg-gray-100">
    <div class="flex h-screen">
        ${getSidebar('agents-all')}
        
        <div class="flex-1 overflow-y-auto">
            <div class="p-8">
                <div class="flex justify-between items-center mb-8">
                    <div>
                        <h1 class="text-3xl font-bold">Edit AI Agent - Comprehensive</h1>
                        <p class="text-gray-600 mt-2">Complete control over all agent data</p>
                    </div>
                    <a href="/admin/agents-all" class="px-4 py-2 text-gray-600 hover:text-gray-800">
                        <i class="fas fa-times mr-2"></i>Cancel
                    </a>
                </div>

                <div id="loading" class="text-center py-12">
                    <i class="fas fa-spinner fa-spin text-4xl text-purple-600"></i>
                    <p class="text-gray-600 mt-4">Loading agent data...</p>
                </div>

                <div id="edit-container" class="hidden">
                    <!-- Tab Navigation -->
                    <div class="bg-white rounded-t-lg shadow-lg mb-0">
                        <div class="flex overflow-x-auto border-b">
                            <button class="tab-button active" onclick="switchTab('basic')">
                                <i class="fas fa-info-circle mr-2"></i>Basic Info
                            </button>
                            <button class="tab-button" onclick="switchTab('media')">
                                <i class="fas fa-image mr-2"></i>Media & Links
                            </button>
                            <button class="tab-button" onclick="switchTab('pricing')">
                                <i class="fas fa-dollar-sign mr-2"></i>Pricing & Plans
                            </button>
                            <button class="tab-button" onclick="switchTab('company')">
                                <i class="fas fa-building mr-2"></i>Company Info
                            </button>
                            <button class="tab-button" onclick="switchTab('technical')">
                                <i class="fas fa-code mr-2"></i>Technical
                            </button>
                            <button class="tab-button" onclick="switchTab('features')">
                                <i class="fas fa-star mr-2"></i>Features
                            </button>
                            <button class="tab-button" onclick="switchTab('usecases')">
                                <i class="fas fa-lightbulb mr-2"></i>Use Cases
                            </button>
                            <button class="tab-button" onclick="switchTab('faqs')">
                                <i class="fas fa-question-circle mr-2"></i>FAQs
                            </button>
                            <button class="tab-button" onclick="switchTab('proscons')">
                                <i class="fas fa-balance-scale mr-2"></i>Pros & Cons
                            </button>
                            <button class="tab-button" onclick="switchTab('screenshots')">
                                <i class="fas fa-camera mr-2"></i>Screenshots
                            </button>
                            <button class="tab-button" onclick="switchTab('admin')">
                                <i class="fas fa-shield-alt mr-2"></i>Admin
                            </button>
                        </div>
                    </div>

                    <form id="edit-form" class="bg-white rounded-b-lg shadow-lg p-8">
                        <!-- TAB 1: BASIC INFO -->
                        <div id="tab-basic" class="tab-content active">
                            <h2 class="text-2xl font-bold mb-6">Basic Information</h2>
                            
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div class="field-group">
                                    <label class="block text-sm font-medium mb-2">Agent Name *</label>
                                    <input type="text" id="name" required class="w-full px-4 py-2 border rounded-lg">
                                </div>
                                
                                <div class="field-group">
                                    <label class="block text-sm font-medium mb-2">Slug (URL) *</label>
                                    <input type="text" id="slug" required class="w-full px-4 py-2 border rounded-lg">
                                </div>
                            </div>

                            <div class="field-group">
                                <label class="block text-sm font-medium mb-2">Tagline *</label>
                                <input type="text" id="tagline" required class="w-full px-4 py-2 border rounded-lg">
                            </div>

                            <div class="field-group">
                                <label class="block text-sm font-medium mb-2">Short Description *</label>
                                <textarea id="description" required rows="4" class="w-full px-4 py-2 border rounded-lg"></textarea>
                            </div>

                            <div class="field-group">
                                <label class="block text-sm font-medium mb-2">Long Description</label>
                                <textarea id="long_description" rows="8" class="w-full px-4 py-2 border rounded-lg"></textarea>
                            </div>

                            <div class="field-group">
                                <label class="block text-sm font-medium mb-2">Categories * (hold Ctrl/Cmd for multiple)</label>
                                <select id="category_ids" multiple required size="5" class="w-full px-4 py-2 border rounded-lg"></select>
                                <p class="text-xs text-gray-500 mt-1">Hold Ctrl (Windows) or Cmd (Mac) to select multiple</p>
                            </div>

                            <div class="field-group">
                                <label class="block text-sm font-medium mb-2">Tags (comma-separated)</label>
                                <input type="text" id="tags_input" placeholder="chatbot, ai, voice" class="w-full px-4 py-2 border rounded-lg">
                            </div>

                            <div class="field-group">
                                <label class="block text-sm font-medium mb-2">Keywords (comma-separated, for SEO)</label>
                                <input type="text" id="keywords" placeholder="ai agent, chatbot, automation" class="w-full px-4 py-2 border rounded-lg">
                            </div>

                            <div class="field-group">
                                <label class="block text-sm font-medium mb-2">Meta Title (for SEO)</label>
                                <input type="text" id="meta_title" class="w-full px-4 py-2 border rounded-lg">
                            </div>

                            <div class="field-group">
                                <label class="block text-sm font-medium mb-2">Meta Description (for SEO)</label>
                                <textarea id="meta_description" rows="2" class="w-full px-4 py-2 border rounded-lg"></textarea>
                            </div>
                        </div>

                        <!-- TAB 2: MEDIA & LINKS -->
                        <div id="tab-media" class="tab-content">
                            <h2 class="text-2xl font-bold mb-6">Media & Links</h2>
                            
                            <div class="field-group">
                                <label class="block text-sm font-medium mb-2">Website URL *</label>
                                <input type="url" id="website_url" required class="w-full px-4 py-2 border rounded-lg">
                            </div>

                            <div class="field-group">
                                <label class="block text-sm font-medium mb-2">Logo <span class="text-red-500">*</span></label>
                                <div class="upload-area" id="admin-logo-upload-area" onclick="document.getElementById('admin-logo-upload').click()" 
                                     style="border: 2px dashed #d1d5db; border-radius: 8px; padding: 2rem; text-align: center; cursor: pointer; transition: all 0.3s;">
                                    <i class="fas fa-cloud-upload-alt text-4xl mb-2" style="color: #7c3aed;"></i>
                                    <p style="color: #6b7280;">Drag & drop or click to upload logo</p>
                                    <p class="text-sm" style="color: #9ca3af;">Max 2MB • Square format recommended (500x500px)</p>
                                </div>
                                <input 
                                    type="file" 
                                    id="admin-logo-upload" 
                                    accept="image/*" 
                                    style="display: none;"
                                    onchange="handleAdminLogoUpload(event)"
                                />
                                <div id="admin-logo-preview" class="mt-3"></div>
                                <div class="mt-2">
                                    <label class="block text-xs text-gray-600 mb-1">Or paste URL/Emoji:</label>
                                    <input type="text" id="logo_url" placeholder="🤖 or https://..." class="w-full px-3 py-2 border rounded-lg text-sm">
                                </div>
                            </div>

                            <div class="field-group">
                                <label class="block text-sm font-medium mb-2">Cover Image</label>
                                <div class="upload-area" id="admin-cover-upload-area" onclick="document.getElementById('admin-cover-upload').click()" 
                                     style="border: 2px dashed #d1d5db; border-radius: 8px; padding: 2rem; text-align: center; cursor: pointer; transition: all 0.3s;">
                                    <i class="fas fa-image text-4xl mb-2" style="color: #7c3aed;"></i>
                                    <p style="color: #6b7280;">Drag & drop or click to upload cover image</p>
                                    <p class="text-sm" style="color: #9ca3af;">Max 5MB • Recommended: 1200x630px</p>
                                </div>
                                <input 
                                    type="file" 
                                    id="admin-cover-upload" 
                                    accept="image/*" 
                                    style="display: none;"
                                    onchange="handleAdminCoverUpload(event)"
                                />
                                <div id="admin-cover-preview" class="mt-3"></div>
                                <div class="mt-2">
                                    <label class="block text-xs text-gray-600 mb-1">Or paste URL:</label>
                                    <input type="url" id="cover_image" class="w-full px-3 py-2 border rounded-lg text-sm">
                                </div>
                            </div>

                            <div class="field-group">
                                <label class="block text-sm font-medium mb-2">YouTube Video URL</label>
                                <input type="url" id="youtube_url" placeholder="https://www.youtube.com/watch?v=..." class="w-full px-4 py-2 border rounded-lg">
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div class="field-group">
                                    <label class="block text-sm font-medium mb-2">Demo Video URL</label>
                                    <input type="url" id="demo_video_url" class="w-full px-4 py-2 border rounded-lg">
                                </div>

                                <div class="field-group">
                                    <label class="block text-sm font-medium mb-2">Video Thumbnail URL</label>
                                    <input type="url" id="video_thumbnail" class="w-full px-4 py-2 border rounded-lg">
                                </div>
                            </div>

                            <h3 class="text-xl font-bold mt-8 mb-4">Social Media Links</h3>
                            
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div class="field-group">
                                    <label class="block text-sm font-medium mb-2"><i class="fab fa-twitter mr-2"></i>Twitter/X URL</label>
                                    <input type="url" id="twitter_url" class="w-full px-4 py-2 border rounded-lg">
                                </div>

                                <div class="field-group">
                                    <label class="block text-sm font-medium mb-2"><i class="fab fa-linkedin mr-2"></i>LinkedIn URL</label>
                                    <input type="url" id="linkedin_url" class="w-full px-4 py-2 border rounded-lg">
                                </div>

                                <div class="field-group">
                                    <label class="block text-sm font-medium mb-2"><i class="fab fa-facebook mr-2"></i>Facebook URL</label>
                                    <input type="url" id="facebook_url" class="w-full px-4 py-2 border rounded-lg">
                                </div>

                                <div class="field-group">
                                    <label class="block text-sm font-medium mb-2"><i class="fab fa-discord mr-2"></i>Discord URL</label>
                                    <input type="url" id="discord_url" class="w-full px-4 py-2 border rounded-lg">
                                </div>

                                <div class="field-group">
                                    <label class="block text-sm font-medium mb-2"><i class="fab fa-github mr-2"></i>GitHub URL</label>
                                    <input type="url" id="github_url" class="w-full px-4 py-2 border rounded-lg">
                                </div>
                            </div>
                        </div>

                        <!-- TAB 3: PRICING & PLANS -->
                        <div id="tab-pricing" class="tab-content">
                            <h2 class="text-2xl font-bold mb-6">Pricing & Plans</h2>
                            
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div class="field-group">
                                    <label class="block text-sm font-medium mb-2">Pricing Model *</label>
                                    <select id="pricing_model" required class="w-full px-4 py-2 border rounded-lg">
                                        <option value="FREE">Free</option>
                                        <option value="FREEMIUM">Freemium</option>
                                        <option value="PAID">Paid</option>
                                        <option value="CONTACT">Contact for Pricing</option>
                                    </select>
                                </div>

                                <div class="field-group">
                                    <label class="block text-sm font-medium mb-2">Pricing Starts At</label>
                                    <input type="text" id="pricing_starts_at" placeholder="$10/month" class="w-full px-4 py-2 border rounded-lg">
                                </div>
                            </div>

                            <div class="field-group">
                                <label class="block text-sm font-medium mb-2">Pricing Details</label>
                                <textarea id="pricing_details" rows="3" class="w-full px-4 py-2 border rounded-lg"></textarea>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                <label class="flex items-center">
                                    <input type="checkbox" id="free_plan_available" class="mr-2">
                                    <span class="text-sm font-medium">Free Plan Available</span>
                                </label>

                                <label class="flex items-center">
                                    <input type="checkbox" id="free_trial_available" class="mr-2">
                                    <span class="text-sm font-medium">Free Trial Available</span>
                                </label>

                                <label class="flex items-center">
                                    <input type="checkbox" id="is_open_source" class="mr-2">
                                    <span class="text-sm font-medium">Open Source</span>
                                </label>
                            </div>

                            <div class="field-group">
                                <label class="block text-sm font-medium mb-2">Free Trial Days</label>
                                <input type="number" id="free_trial_days" class="w-full px-4 py-2 border rounded-lg">
                            </div>

                            <h3 class="text-xl font-bold mt-8 mb-4">Pricing Plans</h3>
                            <div id="pricing-plans-container"></div>
                            <button type="button" onclick="addPricingPlan()" class="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                                <i class="fas fa-plus mr-2"></i>Add Pricing Plan
                            </button>
                        </div>

                        <!-- TAB 4: COMPANY INFO -->
                        <div id="tab-company" class="tab-content">
                            <h2 class="text-2xl font-bold mb-6">Company Information</h2>
                            
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div class="field-group">
                                    <label class="block text-sm font-medium mb-2">Company Name</label>
                                    <input type="text" id="company_name" class="w-full px-4 py-2 border rounded-lg">
                                </div>

                                <div class="field-group">
                                    <label class="block text-sm font-medium mb-2">Company Website</label>
                                    <input type="url" id="company_website" class="w-full px-4 py-2 border rounded-lg">
                                </div>

                                <div class="field-group">
                                    <label class="block text-sm font-medium mb-2">Founded Year</label>
                                    <input type="number" id="founded_year" min="1900" max="2100" class="w-full px-4 py-2 border rounded-lg">
                                </div>

                                <div class="field-group">
                                    <label class="block text-sm font-medium mb-2">Company Size</label>
                                    <select id="company_size" class="w-full px-4 py-2 border rounded-lg">
                                        <option value="">Select...</option>
                                        <option value="1-10">1-10 employees</option>
                                        <option value="11-50">11-50 employees</option>
                                        <option value="51-200">51-200 employees</option>
                                        <option value="201-500">201-500 employees</option>
                                        <option value="501-1000">501-1000 employees</option>
                                        <option value="1001+">1001+ employees</option>
                                    </select>
                                </div>

                                <div class="field-group">
                                    <label class="block text-sm font-medium mb-2">Headquarters</label>
                                    <input type="text" id="headquarters" placeholder="San Francisco, CA" class="w-full px-4 py-2 border rounded-lg">
                                </div>
                            </div>
                        </div>

                        <!-- TAB 5: TECHNICAL -->
                        <div id="tab-technical" class="tab-content">
                            <h2 class="text-2xl font-bold mb-6">Technical Details</h2>
                            
                            <div class="field-group">
                                <label class="flex items-center">
                                    <input type="checkbox" id="api_available" class="mr-2">
                                    <span class="text-sm font-medium">API Available</span>
                                </label>
                            </div>

                            <div class="field-group">
                                <label class="block text-sm font-medium mb-2">API Documentation URL</label>
                                <input type="url" id="api_documentation_url" class="w-full px-4 py-2 border rounded-lg">
                            </div>

                            <div class="field-group">
                                <label class="block text-sm font-medium mb-2">Supported Platforms (comma-separated)</label>
                                <input type="text" id="supported_platforms" placeholder="Web, iOS, Android, API" class="w-full px-4 py-2 border rounded-lg">
                            </div>

                            <div class="field-group">
                                <label class="block text-sm font-medium mb-2">Supported Languages (comma-separated)</label>
                                <input type="text" id="supported_languages" placeholder="English, Spanish, French" class="w-full px-4 py-2 border rounded-lg">
                            </div>

                            <div class="field-group">
                                <label class="block text-sm font-medium mb-2">Supported Integrations (comma-separated)</label>
                                <input type="text" id="supported_integrations" placeholder="Slack, Discord, Zapier" class="w-full px-4 py-2 border rounded-lg">
                            </div>

                            <div class="field-group">
                                <label class="block text-sm font-medium mb-2">Alternatives (comma-separated slugs)</label>
                                <input type="text" id="alternatives" placeholder="chatgpt, claude, gemini" class="w-full px-4 py-2 border rounded-lg">
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div class="field-group">
                                    <label class="block text-sm font-medium mb-2">Trust Score (0-10)</label>
                                    <input type="number" id="trust_score" min="0" max="10" step="0.1" class="w-full px-4 py-2 border rounded-lg">
                                </div>

                                <div class="field-group">
                                    <label class="block text-sm font-medium mb-2">Uptime Percentage</label>
                                    <input type="number" id="uptime_percentage" min="0" max="100" step="0.01" class="w-full px-4 py-2 border rounded-lg">
                                </div>

                                <label class="flex items-center">
                                    <input type="checkbox" id="verified" class="mr-2">
                                    <span class="text-sm font-medium">Verified Agent</span>
                                </label>
                            </div>
                        </div>

                        <!-- TAB 6: FEATURES -->
                        <div id="tab-features" class="tab-content">
                            <h2 class="text-2xl font-bold mb-6">Features</h2>
                            <p class="text-gray-600 mb-4">Add the key features of this AI agent</p>
                            
                            <div id="features-container"></div>
                            <button type="button" onclick="addFeature()" class="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                                <i class="fas fa-plus mr-2"></i>Add Feature
                            </button>
                        </div>

                        <!-- TAB 7: USE CASES -->
                        <div id="tab-usecases" class="tab-content">
                            <h2 class="text-2xl font-bold mb-6">Use Cases</h2>
                            <p class="text-gray-600 mb-4">Describe practical applications of this AI agent</p>
                            
                            <div id="usecases-container"></div>
                            <button type="button" onclick="addUseCase()" class="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                                <i class="fas fa-plus mr-2"></i>Add Use Case
                            </button>
                        </div>

                        <!-- TAB 8: FAQs -->
                        <div id="tab-faqs" class="tab-content">
                            <h2 class="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
                            <p class="text-gray-600 mb-4">Add common questions and answers</p>
                            
                            <div id="faqs-container"></div>
                            <button type="button" onclick="addFAQ()" class="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                                <i class="fas fa-plus mr-2"></i>Add FAQ
                            </button>
                        </div>

                        <!-- TAB 9: PROS & CONS -->
                        <div id="tab-proscons" class="tab-content">
                            <h2 class="text-2xl font-bold mb-6">Pros & Cons</h2>
                            
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 class="text-lg font-bold mb-4 text-green-600">Pros</h3>
                                    <div id="pros-container"></div>
                                    <button type="button" onclick="addPro()" class="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                                        <i class="fas fa-plus mr-2"></i>Add Pro
                                    </button>
                                </div>

                                <div>
                                    <h3 class="text-lg font-bold mb-4 text-red-600">Cons</h3>
                                    <div id="cons-container"></div>
                                    <button type="button" onclick="addCon()" class="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                                        <i class="fas fa-plus mr-2"></i>Add Con
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- TAB 10: SCREENSHOTS -->
                        <div id="tab-screenshots" class="tab-content">
                            <h2 class="text-2xl font-bold mb-6">Screenshots</h2>
                            <p class="text-gray-600 mb-4">Add screenshots to showcase the agent</p>
                            
                            <div id="screenshots-container"></div>
                            <button type="button" onclick="addScreenshot()" class="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                                <i class="fas fa-plus mr-2"></i>Add Screenshot
                            </button>
                        </div>

                        <!-- TAB 11: ADMIN SETTINGS -->
                        <div id="tab-admin" class="tab-content">
                            <h2 class="text-2xl font-bold mb-6">Admin Settings</h2>
                            
                            <div class="field-group">
                                <label class="block text-sm font-medium mb-2">Status *</label>
                                <select id="status" required class="w-full px-4 py-2 border rounded-lg">
                                    <option value="PENDING">Pending Review</option>
                                    <option value="APPROVED">Approved</option>
                                    <option value="REJECTED">Rejected</option>
                                </select>
                            </div>

                            <div class="field-group">
                                <label class="block text-sm font-medium mb-2">Featured Tier</label>
                                <select id="featured_tier" class="w-full px-4 py-2 border rounded-lg">
                                    <option value="NONE">None</option>
                                    <option value="FEATURED">Featured</option>
                                    <option value="PREMIUM">Premium Featured</option>
                                    <option value="SPONSORED">Sponsored</option>
                                </select>
                            </div>

                            <div class="field-group">
                                <label class="block text-sm font-medium mb-2">Admin Notes (internal)</label>
                                <textarea id="admin_notes" rows="3" class="w-full px-4 py-2 border rounded-lg"></textarea>
                            </div>

                            <div class="field-group">
                                <label class="block text-sm font-medium mb-2">Rejection Reason</label>
                                <textarea id="rejection_reason" rows="2" class="w-full px-4 py-2 border rounded-lg"></textarea>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div class="field-group">
                                    <label class="block text-sm font-medium mb-2">View Count</label>
                                    <input type="number" id="view_count" readonly class="w-full px-4 py-2 border rounded-lg bg-gray-100">
                                </div>

                                <div class="field-group">
                                    <label class="block text-sm font-medium mb-2">Upvote Count</label>
                                    <input type="number" id="upvote_count" readonly class="w-full px-4 py-2 border rounded-lg bg-gray-100">
                                </div>

                                <div class="field-group">
                                    <label class="block text-sm font-medium mb-2">Review Count</label>
                                    <input type="number" id="review_count" readonly class="w-full px-4 py-2 border rounded-lg bg-gray-100">
                                </div>

                                <div class="field-group">
                                    <label class="block text-sm font-medium mb-2">Click Count</label>
                                    <input type="number" id="click_count" readonly class="w-full px-4 py-2 border rounded-lg bg-gray-100">
                                </div>
                            </div>
                        </div>

                        <!-- Action Buttons -->
                        <div class="flex space-x-4 pt-6 mt-6 border-t">
                            <button type="submit" class="flex-1 bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700">
                                <i class="fas fa-save mr-2"></i>Save All Changes
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
        let agentData = null;
        let features = [];
        let useCases = [];
        let faqs = [];
        let pros = [];
        let cons = [];
        let screenshots = [];
        let pricingPlans = [];

        // Tab switching
        function switchTab(tabName) {
            document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            
            event.target.classList.add('active');
            document.getElementById('tab-' + tabName).classList.add('active');
        }

        // Dynamic list functions
        function addFeature() {
            const id = Date.now();
            const html = \`
                <div class="dynamic-list-item" id="feature-\${id}">
                    <div class="flex justify-between items-start mb-2">
                        <label class="block text-sm font-medium">Feature Title</label>
                        <button type="button" onclick="removeItem('feature-\${id}')" class="text-red-600 hover:text-red-800">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                    <input type="text" class="feature-title w-full px-4 py-2 border rounded-lg mb-2" placeholder="Feature name">
                    <label class="block text-sm font-medium mb-2">Description</label>
                    <textarea class="feature-description w-full px-4 py-2 border rounded-lg" rows="2" placeholder="Describe this feature"></textarea>
                </div>
            \`;
            document.getElementById('features-container').insertAdjacentHTML('beforeend', html);
        }

        function addUseCase() {
            const id = Date.now();
            const html = \`
                <div class="dynamic-list-item" id="usecase-\${id}">
                    <div class="flex justify-between items-start mb-2">
                        <label class="block text-sm font-medium">Use Case Title</label>
                        <button type="button" onclick="removeItem('usecase-\${id}')" class="text-red-600 hover:text-red-800">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                    <input type="text" class="usecase-title w-full px-4 py-2 border rounded-lg mb-2" placeholder="Use case name">
                    <label class="block text-sm font-medium mb-2">Description</label>
                    <textarea class="usecase-description w-full px-4 py-2 border rounded-lg" rows="2" placeholder="Describe this use case"></textarea>
                </div>
            \`;
            document.getElementById('usecases-container').insertAdjacentHTML('beforeend', html);
        }

        function addFAQ() {
            const id = Date.now();
            const html = \`
                <div class="dynamic-list-item" id="faq-\${id}">
                    <div class="flex justify-between items-start mb-2">
                        <label class="block text-sm font-medium">Question</label>
                        <button type="button" onclick="removeItem('faq-\${id}')" class="text-red-600 hover:text-red-800">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                    <input type="text" class="faq-question w-full px-4 py-2 border rounded-lg mb-2" placeholder="Question">
                    <label class="block text-sm font-medium mb-2">Answer</label>
                    <textarea class="faq-answer w-full px-4 py-2 border rounded-lg" rows="2" placeholder="Answer"></textarea>
                </div>
            \`;
            document.getElementById('faqs-container').insertAdjacentHTML('beforeend', html);
        }

        function addPro() {
            const id = Date.now();
            const html = \`
                <div class="dynamic-list-item" id="pro-\${id}">
                    <div class="flex justify-between items-start">
                        <input type="text" class="pro-content flex-1 px-4 py-2 border rounded-lg" placeholder="Pro">
                        <button type="button" onclick="removeItem('pro-\${id}')" class="ml-2 text-red-600 hover:text-red-800">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            \`;
            document.getElementById('pros-container').insertAdjacentHTML('beforeend', html);
        }

        function addCon() {
            const id = Date.now();
            const html = \`
                <div class="dynamic-list-item" id="con-\${id}">
                    <div class="flex justify-between items-start">
                        <input type="text" class="con-content flex-1 px-4 py-2 border rounded-lg" placeholder="Con">
                        <button type="button" onclick="removeItem('con-\${id}')" class="ml-2 text-red-600 hover:text-red-800">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            \`;
            document.getElementById('cons-container').insertAdjacentHTML('beforeend', html);
        }

        function addScreenshot() {
            const id = Date.now();
            const html = \`
                <div class="dynamic-list-item" id="screenshot-\${id}">
                    <div class="flex justify-between items-start mb-2">
                        <label class="block text-sm font-medium">Screenshot</label>
                        <button type="button" onclick="removeItem('screenshot-\${id}')" class="text-red-600 hover:text-red-800">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                    <input type="url" class="screenshot-url w-full px-4 py-2 border rounded-lg mb-2" placeholder="Image URL">
                    <input type="text" class="screenshot-title w-full px-4 py-2 border rounded-lg mb-2" placeholder="Title (optional)">
                    <input type="text" class="screenshot-description w-full px-4 py-2 border rounded-lg" placeholder="Description (optional)">
                </div>
            \`;
            document.getElementById('screenshots-container').insertAdjacentHTML('beforeend', html);
        }

        function addPricingPlan() {
            const id = Date.now();
            const html = \`
                <div class="dynamic-list-item" id="plan-\${id}">
                    <div class="flex justify-between items-start mb-2">
                        <label class="block text-sm font-medium">Pricing Plan</label>
                        <button type="button" onclick="removeItem('plan-\${id}')" class="text-red-600 hover:text-red-800">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input type="text" class="plan-name w-full px-4 py-2 border rounded-lg" placeholder="Plan name (e.g., Pro)">
                        <input type="text" class="plan-price w-full px-4 py-2 border rounded-lg" placeholder="Price (e.g., $29)">
                        <input type="text" class="plan-billing w-full px-4 py-2 border rounded-lg" placeholder="Billing (e.g., /month)">
                    </div>
                    <textarea class="plan-features w-full px-4 py-2 border rounded-lg mt-2" rows="2" placeholder="Features (one per line)"></textarea>
                    <label class="flex items-center mt-2">
                        <input type="checkbox" class="plan-popular mr-2">
                        <span class="text-sm">Mark as popular</span>
                    </label>
                </div>
            \`;
            document.getElementById('pricing-plans-container').insertAdjacentHTML('beforeend', html);
        }

        function removeItem(id) {
            document.getElementById(id).remove();
        }

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

        // Load agent data
        async function loadAgentData() {
            try {
                const response = await axios.get(\`/api/admin/agents/\${agentId}/comprehensive\`);
                if (response.data.success) {
                    agentData = response.data.data;
                    populateForm();
                    document.getElementById('loading').classList.add('hidden');
                    document.getElementById('edit-container').classList.remove('hidden');
                }
            } catch (error) {
                console.error('Error loading agent:', error);
                alert('Error loading agent data');
                window.location.href = '/admin/agents-all';
            }
        }

        function populateForm() {
            const agent = agentData;
            
            // Basic info
            document.getElementById('name').value = agent.name || '';
            document.getElementById('slug').value = agent.slug || '';
            document.getElementById('tagline').value = agent.tagline || '';
            document.getElementById('description').value = agent.description || '';
            document.getElementById('long_description').value = agent.long_description || '';
            document.getElementById('keywords').value = agent.keywords || '';
            document.getElementById('meta_title').value = agent.meta_title || '';
            document.getElementById('meta_description').value = agent.meta_description || '';
            
            // Select categories
            if (agent.category_ids && agent.category_ids.length > 0) {
                const select = document.getElementById('category_ids');
                agent.category_ids.forEach(catId => {
                    const option = select.querySelector('option[value="' + catId + '"]');
                    if (option) option.selected = true;
                });
            }
            
            // Media & links
            document.getElementById('website_url').value = agent.website_url || '';
            document.getElementById('logo_url').value = agent.logo_url || '';
            document.getElementById('cover_image').value = agent.cover_image || '';
            document.getElementById('youtube_url').value = agent.youtube_url || '';
            document.getElementById('demo_video_url').value = agent.demo_video_url || '';
            document.getElementById('video_thumbnail').value = agent.video_thumbnail || '';
            document.getElementById('twitter_url').value = agent.twitter_url || '';
            document.getElementById('linkedin_url').value = agent.linkedin_url || '';
            document.getElementById('facebook_url').value = agent.facebook_url || '';
            document.getElementById('discord_url').value = agent.discord_url || '';
            document.getElementById('github_url').value = agent.github_url || '';
            
            // Pricing
            document.getElementById('pricing_model').value = agent.pricing_model || 'FREE';
            document.getElementById('pricing_starts_at').value = agent.pricing_starts_at || '';
            document.getElementById('pricing_details').value = agent.pricing_details || '';
            document.getElementById('free_plan_available').checked = agent.free_plan_available || false;
            document.getElementById('free_trial_available').checked = agent.free_trial_available || false;
            document.getElementById('is_open_source').checked = agent.is_open_source || false;
            document.getElementById('free_trial_days').value = agent.free_trial_days || '';
            
            // Company
            document.getElementById('company_name').value = agent.company_name || '';
            document.getElementById('company_website').value = agent.company_website || '';
            document.getElementById('founded_year').value = agent.founded_year || '';
            document.getElementById('company_size').value = agent.company_size || '';
            document.getElementById('headquarters').value = agent.headquarters || '';
            
            // Technical
            document.getElementById('api_available').checked = agent.api_available || false;
            document.getElementById('api_documentation_url').value = agent.api_documentation_url || '';
            document.getElementById('supported_platforms').value = agent.supported_platforms || '';
            document.getElementById('supported_languages').value = agent.supported_languages || '';
            document.getElementById('supported_integrations').value = agent.supported_integrations || '';
            document.getElementById('alternatives').value = agent.alternatives || '';
            document.getElementById('trust_score').value = agent.trust_score || '';
            document.getElementById('uptime_percentage').value = agent.uptime_percentage || '';
            document.getElementById('verified').checked = agent.verified || false;
            
            // Admin
            document.getElementById('status').value = agent.status || 'PENDING';
            document.getElementById('featured_tier').value = agent.featured_tier || 'NONE';
            document.getElementById('admin_notes').value = agent.admin_notes || '';
            document.getElementById('rejection_reason').value = agent.rejection_reason || '';
            document.getElementById('view_count').value = agent.view_count || 0;
            document.getElementById('upvote_count').value = agent.upvote_count || 0;
            document.getElementById('review_count').value = agent.review_count || 0;
            document.getElementById('click_count').value = agent.click_count || 0;
            
            // Load dynamic lists
            if (agent.features && agent.features.length > 0) {
                agent.features.forEach(f => {
                    addFeature();
                    const items = document.querySelectorAll('#features-container .dynamic-list-item');
                    const last = items[items.length - 1];
                    last.querySelector('.feature-title').value = f.title;
                    last.querySelector('.feature-description').value = f.description || '';
                });
            }
            
            if (agent.use_cases && agent.use_cases.length > 0) {
                agent.use_cases.forEach(uc => {
                    addUseCase();
                    const items = document.querySelectorAll('#usecases-container .dynamic-list-item');
                    const last = items[items.length - 1];
                    last.querySelector('.usecase-title').value = uc.title;
                    last.querySelector('.usecase-description').value = uc.description || '';
                });
            }
            
            if (agent.faqs && agent.faqs.length > 0) {
                agent.faqs.forEach(faq => {
                    addFAQ();
                    const items = document.querySelectorAll('#faqs-container .dynamic-list-item');
                    const last = items[items.length - 1];
                    last.querySelector('.faq-question').value = faq.question;
                    last.querySelector('.faq-answer').value = faq.answer;
                });
            }
            
            if (agent.pros && agent.pros.length > 0) {
                agent.pros.forEach(pro => {
                    addPro();
                    const items = document.querySelectorAll('#pros-container .dynamic-list-item');
                    const last = items[items.length - 1];
                    last.querySelector('.pro-content').value = pro.content;
                });
            }
            
            if (agent.cons && agent.cons.length > 0) {
                agent.cons.forEach(con => {
                    addCon();
                    const items = document.querySelectorAll('#cons-container .dynamic-list-item');
                    const last = items[items.length - 1];
                    last.querySelector('.con-content').value = con.content;
                });
            }
            
            if (agent.screenshots && agent.screenshots.length > 0) {
                agent.screenshots.forEach(ss => {
                    addScreenshot();
                    const items = document.querySelectorAll('#screenshots-container .dynamic-list-item');
                    const last = items[items.length - 1];
                    last.querySelector('.screenshot-url').value = ss.image_url;
                    last.querySelector('.screenshot-title').value = ss.title || '';
                    last.querySelector('.screenshot-description').value = ss.description || '';
                });
            }
            
            if (agent.pricing_plans && agent.pricing_plans.length > 0) {
                agent.pricing_plans.forEach(plan => {
                    addPricingPlan();
                    const items = document.querySelectorAll('#pricing-plans-container .dynamic-list-item');
                    const last = items[items.length - 1];
                    last.querySelector('.plan-name').value = plan.name;
                    last.querySelector('.plan-price').value = plan.price;
                    last.querySelector('.plan-billing').value = plan.billing_period || '';
                    last.querySelector('.plan-features').value = plan.features || '';
                    last.querySelector('.plan-popular').checked = plan.is_popular || false;
                });
            }
        }

        // Image Upload Handlers
        async function handleAdminLogoUpload(event) {
            const file = event.target.files[0];
            if (!file) return;
            
            if (file.size > 2 * 1024 * 1024) {
                alert('Logo file size must be less than 2MB');
                return;
            }
            
            // Show loading state
            document.getElementById('admin-logo-preview').innerHTML = \`
                <div style="text-align: center; padding: 1.5rem; background: #f9fafb; border-radius: 8px;">
                    <i class="fas fa-spinner fa-spin" style="font-size: 2rem; color: #7c3aed;"></i>
                    <p style="margin-top: 0.5rem; color: #6b7280;">Uploading logo...</p>
                </div>
            \`;
            
            try {
                // Upload to server
                const uploadFormData = new FormData();
                uploadFormData.append('file', file);
                
                const response = await axios.post('/api/upload/image', uploadFormData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                
                if (response.data.success) {
                    const imageUrl = response.data.data.url;
                    document.getElementById('logo_url').value = imageUrl;
                    document.getElementById('admin-logo-preview').innerHTML = \`
                        <div style="background: #f9fafb; border-radius: 8px; padding: 1rem;">
                            <img src="\${imageUrl}" style="max-width: 150px; max-height: 150px; border-radius: 8px; margin: 0 auto; display: block;" alt="Logo preview" />
                            <div style="margin-top: 0.75rem; font-size: 0.875rem; color: #10b981; text-align: center;">
                                <i class="fas fa-check-circle"></i> Logo uploaded successfully
                            </div>
                        </div>
                    \`;
                } else {
                    throw new Error(response.data.error || 'Upload failed');
                }
            } catch (error) {
                console.error('Logo upload error:', error);
                document.getElementById('admin-logo-preview').innerHTML = \`
                    <div style="color: #ef4444; text-align: center; padding: 1rem; background: #fef2f2; border-radius: 8px;">
                        <i class="fas fa-exclamation-circle"></i> Upload failed. Please try again.
                    </div>
                \`;
                alert('Failed to upload logo: ' + (error.response?.data?.error || error.message));
            }
        }

        async function handleAdminCoverUpload(event) {
            const file = event.target.files[0];
            if (!file) return;
            
            if (file.size > 5 * 1024 * 1024) {
                alert('Cover image file size must be less than 5MB');
                return;
            }
            
            // Show loading state
            document.getElementById('admin-cover-preview').innerHTML = \`
                <div style="text-align: center; padding: 1.5rem; background: #f9fafb; border-radius: 8px;">
                    <i class="fas fa-spinner fa-spin" style="font-size: 2rem; color: #7c3aed;"></i>
                    <p style="margin-top: 0.5rem; color: #6b7280;">Uploading cover image...</p>
                </div>
            \`;
            
            try {
                // Upload to server
                const uploadFormData = new FormData();
                uploadFormData.append('file', file);
                
                const response = await axios.post('/api/upload/image', uploadFormData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                
                if (response.data.success) {
                    const imageUrl = response.data.data.url;
                    document.getElementById('cover_image').value = imageUrl;
                    document.getElementById('admin-cover-preview').innerHTML = \`
                        <div style="background: #f9fafb; border-radius: 8px; padding: 1rem;">
                            <img src="\${imageUrl}" style="max-width: 100%; max-height: 200px; border-radius: 8px; margin: 0 auto; display: block;" alt="Cover preview" />
                            <div style="margin-top: 0.75rem; font-size: 0.875rem; color: #10b981; text-align: center;">
                                <i class="fas fa-check-circle"></i> Cover image uploaded successfully
                            </div>
                        </div>
                    \`;
                } else {
                    throw new Error(response.data.error || 'Upload failed');
                }
            } catch (error) {
                console.error('Cover upload error:', error);
                document.getElementById('admin-cover-preview').innerHTML = \`
                    <div style="color: #ef4444; text-align: center; padding: 1rem; background: #fef2f2; border-radius: 8px;">
                        <i class="fas fa-exclamation-circle"></i> Upload failed. Please try again.
                    </div>
                \`;
                alert('Failed to upload cover image: ' + (error.response?.data?.error || error.message));
            }
        }

        // Form submission
        document.getElementById('edit-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Collect all data
            const data = {
                // Basic
                name: document.getElementById('name').value,
                slug: document.getElementById('slug').value,
                tagline: document.getElementById('tagline').value,
                description: document.getElementById('description').value,
                long_description: document.getElementById('long_description').value || null,
                keywords: document.getElementById('keywords').value || null,
                meta_title: document.getElementById('meta_title').value || null,
                meta_description: document.getElementById('meta_description').value || null,
                
                category_ids: Array.from(document.getElementById('category_ids').selectedOptions).map(opt => parseInt(opt.value)),
                tags_input: document.getElementById('tags_input').value || null,
                
                // Media
                website_url: document.getElementById('website_url').value,
                logo_url: document.getElementById('logo_url').value || null,
                cover_image: document.getElementById('cover_image').value || null,
                youtube_url: document.getElementById('youtube_url').value || null,
                demo_video_url: document.getElementById('demo_video_url').value || null,
                video_thumbnail: document.getElementById('video_thumbnail').value || null,
                twitter_url: document.getElementById('twitter_url').value || null,
                linkedin_url: document.getElementById('linkedin_url').value || null,
                facebook_url: document.getElementById('facebook_url').value || null,
                discord_url: document.getElementById('discord_url').value || null,
                github_url: document.getElementById('github_url').value || null,
                
                // Pricing
                pricing_model: document.getElementById('pricing_model').value,
                pricing_starts_at: document.getElementById('pricing_starts_at').value || null,
                pricing_details: document.getElementById('pricing_details').value || null,
                free_plan_available: document.getElementById('free_plan_available').checked,
                free_trial_available: document.getElementById('free_trial_available').checked,
                is_open_source: document.getElementById('is_open_source').checked,
                free_trial_days: parseInt(document.getElementById('free_trial_days').value) || null,
                
                // Company
                company_name: document.getElementById('company_name').value || null,
                company_website: document.getElementById('company_website').value || null,
                founded_year: parseInt(document.getElementById('founded_year').value) || null,
                company_size: document.getElementById('company_size').value || null,
                headquarters: document.getElementById('headquarters').value || null,
                
                // Technical
                api_available: document.getElementById('api_available').checked,
                api_documentation_url: document.getElementById('api_documentation_url').value || null,
                supported_platforms: document.getElementById('supported_platforms').value || null,
                supported_languages: document.getElementById('supported_languages').value || null,
                supported_integrations: document.getElementById('supported_integrations').value || null,
                alternatives: document.getElementById('alternatives').value || null,
                trust_score: parseFloat(document.getElementById('trust_score').value) || null,
                uptime_percentage: parseFloat(document.getElementById('uptime_percentage').value) || null,
                verified: document.getElementById('verified').checked,
                
                // Admin
                status: document.getElementById('status').value,
                featured_tier: document.getElementById('featured_tier').value,
                admin_notes: document.getElementById('admin_notes').value || null,
                rejection_reason: document.getElementById('rejection_reason').value || null,
                
                // Dynamic lists
                features: Array.from(document.querySelectorAll('#features-container .dynamic-list-item')).map(item => ({
                    title: item.querySelector('.feature-title').value,
                    description: item.querySelector('.feature-description').value || null
                })),
                
                use_cases: Array.from(document.querySelectorAll('#usecases-container .dynamic-list-item')).map(item => ({
                    title: item.querySelector('.usecase-title').value,
                    description: item.querySelector('.usecase-description').value || null
                })),
                
                faqs: Array.from(document.querySelectorAll('#faqs-container .dynamic-list-item')).map(item => ({
                    question: item.querySelector('.faq-question').value,
                    answer: item.querySelector('.faq-answer').value
                })),
                
                pros: Array.from(document.querySelectorAll('#pros-container .dynamic-list-item')).map(item => ({
                    content: item.querySelector('.pro-content').value
                })),
                
                cons: Array.from(document.querySelectorAll('#cons-container .dynamic-list-item')).map(item => ({
                    content: item.querySelector('.con-content').value
                })),
                
                screenshots: Array.from(document.querySelectorAll('#screenshots-container .dynamic-list-item')).map(item => ({
                    image_url: item.querySelector('.screenshot-url').value,
                    title: item.querySelector('.screenshot-title').value || null,
                    description: item.querySelector('.screenshot-description').value || null
                })),
                
                pricing_plans: Array.from(document.querySelectorAll('#pricing-plans-container .dynamic-list-item')).map(item => ({
                    name: item.querySelector('.plan-name').value,
                    price: item.querySelector('.plan-price').value,
                    billing_period: item.querySelector('.plan-billing').value || null,
                    features: item.querySelector('.plan-features').value,
                    is_popular: item.querySelector('.plan-popular').checked
                }))
            };

            try {
                const response = await axios.put(\`/api/admin/agents/\${agentId}/comprehensive\`, data);
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

        // Initialize drag and drop for image uploads
        function initializeDragAndDrop() {
            ['admin-logo-upload-area', 'admin-cover-upload-area'].forEach(areaId => {
                const area = document.getElementById(areaId);
                if (!area) return;

                area.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    area.style.borderColor = '#7c3aed';
                    area.style.backgroundColor = '#f5f3ff';
                });

                area.addEventListener('dragleave', (e) => {
                    e.preventDefault();
                    area.style.borderColor = '#d1d5db';
                    area.style.backgroundColor = 'transparent';
                });

                area.addEventListener('drop', (e) => {
                    e.preventDefault();
                    area.style.borderColor = '#d1d5db';
                    area.style.backgroundColor = 'transparent';
                    
                    const files = e.dataTransfer.files;
                    if (files.length > 0) {
                        const inputId = areaId.replace('-area', '');
                        const input = document.getElementById(inputId);
                        if (input) {
                            input.files = files;
                            input.dispatchEvent(new Event('change'));
                        }
                    }
                });
            });
        }

        // Initialize
        document.addEventListener('DOMContentLoaded', async () => {
            await loadCategories();
            await loadAgentData();
            initializeDragAndDrop();
        });
    </script>
</body>
</html>
`;
