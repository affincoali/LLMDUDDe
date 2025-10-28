import { getFooter } from './components/footer';

export const submitAgentForm = () => `
<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Submit AI Agent - GenSpark AI Directory</title>
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
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        }

        .form-container {
            background: var(--bg-primary);
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            max-width: 900px;
            margin: 2rem auto;
            padding: 2rem;
        }

        .progress-container {
            display: flex;
            justify-content: space-between;
            margin-bottom: 3rem;
            position: relative;
        }

        .progress-line {
            position: absolute;
            top: 20px;
            left: 0;
            right: 0;
            height: 2px;
            background: var(--border-color);
            z-index: 0;
        }

        .progress-line-active {
            position: absolute;
            top: 20px;
            left: 0;
            height: 2px;
            background: var(--accent);
            z-index: 1;
            transition: width 0.3s ease;
        }

        .step-indicator {
            position: relative;
            z-index: 2;
            display: flex;
            flex-direction: column;
            align-items: center;
            flex: 1;
        }

        .step-circle {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: var(--bg-primary);
            border: 2px solid var(--border-color);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            color: var(--text-secondary);
            transition: all 0.3s ease;
        }

        .step-circle.active {
            background: var(--accent);
            border-color: var(--accent);
            color: white;
        }

        .step-circle.completed {
            background: #10b981;
            border-color: #10b981;
            color: white;
        }

        .step-label {
            margin-top: 0.5rem;
            font-size: 0.75rem;
            color: var(--text-secondary);
            text-align: center;
        }

        .step-content {
            display: none;
        }

        .step-content.active {
            display: block;
            animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
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

        .form-label .required {
            color: #ef4444;
        }

        .form-input {
            width: 100%;
            padding: 0.75rem 1rem;
            border: 2px solid var(--border-color);
            border-radius: 8px;
            background: var(--bg-primary);
            color: var(--text-primary);
            font-size: 1rem;
            transition: all 0.2s ease;
        }

        .form-input:focus {
            outline: none;
            border-color: var(--accent);
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .form-input.error {
            border-color: #ef4444;
        }

        .error-message {
            color: #ef4444;
            font-size: 0.875rem;
            margin-top: 0.25rem;
            display: none;
        }

        .error-message.visible {
            display: block;
        }

        .char-counter {
            font-size: 0.875rem;
            color: var(--text-secondary);
            text-align: right;
            margin-top: 0.25rem;
        }

        .rich-text-editor {
            min-height: 200px;
            border: 2px solid var(--border-color);
            border-radius: 8px;
            padding: 1rem;
            background: var(--bg-primary);
            color: var(--text-primary);
            overflow-y: auto;
        }

        .rich-text-editor:focus {
            outline: none;
            border-color: var(--accent);
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .editor-toolbar {
            display: flex;
            gap: 0.5rem;
            margin-bottom: 0.5rem;
            padding: 0.5rem;
            background: var(--bg-secondary);
            border-radius: 8px;
        }

        .editor-btn {
            padding: 0.5rem;
            border: none;
            background: transparent;
            color: var(--text-primary);
            cursor: pointer;
            border-radius: 4px;
            transition: background 0.2s ease;
        }

        .editor-btn:hover {
            background: var(--border-color);
        }

        .editor-btn.active {
            background: var(--accent);
            color: white;
        }

        .upload-area {
            border: 2px dashed var(--border-color);
            border-radius: 8px;
            padding: 2rem;
            text-align: center;
            cursor: pointer;
            transition: all 0.2s ease;
            background: var(--bg-secondary);
        }

        .upload-area:hover {
            border-color: var(--accent);
            background: rgba(59, 130, 246, 0.05);
        }

        .upload-area.dragover {
            border-color: var(--accent);
            background: rgba(59, 130, 246, 0.1);
        }

        .preview-image {
            max-width: 200px;
            max-height: 200px;
            border-radius: 8px;
            margin-top: 1rem;
            object-fit: cover;
        }

        .screenshots-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 1rem;
            margin-top: 1rem;
        }

        .screenshot-item {
            position: relative;
        }

        .screenshot-item img {
            width: 100%;
            height: 150px;
            object-fit: cover;
            border-radius: 8px;
        }

        .screenshot-remove {
            position: absolute;
            top: 0.5rem;
            right: 0.5rem;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            border: none;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .tag-input-container {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            padding: 0.75rem;
            border: 2px solid var(--border-color);
            border-radius: 8px;
            min-height: 48px;
            background: var(--bg-primary);
        }

        .tag-item {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.25rem 0.75rem;
            background: var(--accent);
            color: white;
            border-radius: 20px;
            font-size: 0.875rem;
        }

        .tag-remove {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            font-size: 1rem;
        }

        .tag-input {
            flex: 1;
            min-width: 200px;
            border: none;
            outline: none;
            background: transparent;
            color: var(--text-primary);
        }

        .autocomplete-dropdown {
            position: absolute;
            background: var(--bg-primary);
            border: 2px solid var(--border-color);
            border-radius: 8px;
            max-height: 200px;
            overflow-y: auto;
            z-index: 10;
            display: none;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .autocomplete-dropdown.visible {
            display: block;
        }

        .autocomplete-item {
            padding: 0.75rem;
            cursor: pointer;
            transition: background 0.2s ease;
        }

        .autocomplete-item:hover {
            background: var(--bg-secondary);
        }

        .feature-item, .usecase-item {
            display: flex;
            gap: 0.5rem;
            margin-bottom: 0.5rem;
        }

        .feature-item input, .usecase-item input {
            flex: 1;
        }

        .remove-btn {
            padding: 0.75rem 1rem;
            background: #ef4444;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: background 0.2s ease;
        }

        .remove-btn:hover {
            background: #dc2626;
        }

        .add-btn {
            padding: 0.5rem 1rem;
            background: var(--accent);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            margin-top: 0.5rem;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            transition: background 0.2s ease;
        }

        .add-btn:hover {
            background: var(--accent-hover);
        }

        .review-card {
            background: var(--bg-secondary);
            border-radius: 12px;
            padding: 1.5rem;
            margin-bottom: 1rem;
        }

        .review-section {
            margin-bottom: 1.5rem;
        }

        .review-section h3 {
            font-size: 1.125rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
            color: var(--text-primary);
        }

        .review-value {
            color: var(--text-secondary);
        }

        .navigation-buttons {
            display: flex;
            justify-content: space-between;
            margin-top: 2rem;
            gap: 1rem;
        }

        .btn {
            padding: 0.75rem 2rem;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
        }

        .btn-secondary {
            background: var(--bg-secondary);
            color: var(--text-primary);
        }

        .btn-secondary:hover {
            background: var(--border-color);
        }

        .btn-primary {
            background: var(--accent);
            color: white;
        }

        .btn-primary:hover {
            background: var(--accent-hover);
        }

        .btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .save-draft-btn {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            padding: 0.75rem 1.5rem;
            background: white;
            color: var(--accent);
            border: 2px solid var(--accent);
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            transition: all 0.2s ease;
        }

        .save-draft-btn:hover {
            background: var(--accent);
            color: white;
        }

        .success-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        }

        .success-modal.visible {
            display: flex;
        }

        .success-modal-content {
            background: var(--bg-primary);
            border-radius: 16px;
            padding: 3rem;
            max-width: 500px;
            text-align: center;
            animation: modalSlideIn 0.3s ease;
        }

        @keyframes modalSlideIn {
            from { transform: scale(0.9); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }

        .checkbox-label {
            display: flex;
            align-items: start;
            gap: 0.75rem;
            cursor: pointer;
        }

        .checkbox-label input {
            margin-top: 0.25rem;
        }

        @media (max-width: 768px) {
            .form-container {
                margin: 1rem;
                padding: 1.5rem;
            }

            .progress-container {
                overflow-x: auto;
            }

            .step-label {
                font-size: 0.65rem;
            }

            .navigation-buttons {
                flex-direction: column;
            }
        }
    </style>
</head>
<body>
    <div class="form-container">
        <!-- Header -->
        <div class="text-center mb-8">
            <h1 class="text-3xl font-bold mb-2" style="color: var(--text-primary);">
                <i class="fas fa-plus-circle mr-2" style="color: var(--accent);"></i>
                Submit AI Agent
            </h1>
            <p style="color: var(--text-secondary);">Share your AI agent with the community</p>
        </div>

        <!-- Progress Indicator -->
        <div class="progress-container">
            <div class="progress-line"></div>
            <div class="progress-line-active" id="progress-line-active" style="width: 0%;"></div>
            
            <div class="step-indicator">
                <div class="step-circle active" data-step="1">1</div>
                <div class="step-label">Basic Info</div>
            </div>
            <div class="step-indicator">
                <div class="step-circle" data-step="2">2</div>
                <div class="step-label">Visual Assets</div>
            </div>
            <div class="step-indicator">
                <div class="step-circle" data-step="3">3</div>
                <div class="step-label">Categories</div>
            </div>
            <div class="step-indicator">
                <div class="step-circle" data-step="4">4</div>
                <div class="step-label">Features</div>
            </div>
            <div class="step-indicator">
                <div class="step-circle" data-step="5">5</div>
                <div class="step-label">Additional</div>
            </div>
            <div class="step-indicator">
                <div class="step-circle" data-step="6">6</div>
                <div class="step-label">Review</div>
            </div>
        </div>

        <!-- Step 1: Basic Information -->
        <div class="step-content active" data-step="1">
            <h2 class="text-2xl font-bold mb-6" style="color: var(--text-primary);">Basic Information</h2>
            
            <div class="form-group">
                <label class="form-label">
                    Agent Name <span class="required">*</span>
                </label>
                <input 
                    type="text" 
                    id="agent-name" 
                    class="form-input" 
                    placeholder="e.g., GPT-4 Vision Assistant"
                    minlength="3"
                    required
                />
                <div class="error-message" id="agent-name-error">Agent name must be at least 3 characters</div>
            </div>

            <div class="form-group">
                <label class="form-label">
                    Website URL <span class="required">*</span>
                </label>
                <input 
                    type="url" 
                    id="website-url" 
                    class="form-input" 
                    placeholder="https://example.com"
                    pattern="https://.*"
                    required
                />
                <div class="error-message" id="website-url-error">Please enter a valid HTTPS URL</div>
            </div>

            <div class="form-group">
                <label class="form-label">
                    Tagline <span class="required">*</span>
                </label>
                <input 
                    type="text" 
                    id="tagline" 
                    class="form-input" 
                    placeholder="Brief description of your AI agent (max 100 characters)"
                    maxlength="100"
                    required
                />
                <div class="char-counter">
                    <span id="tagline-count">0</span>/100
                </div>
                <div class="error-message" id="tagline-error">Tagline is required</div>
            </div>

            <div class="form-group">
                <label class="form-label">
                    Description <span class="required">*</span>
                </label>
                <div class="editor-toolbar">
                    <button class="editor-btn" onclick="formatText('bold')" type="button" title="Bold">
                        <i class="fas fa-bold"></i>
                    </button>
                    <button class="editor-btn" onclick="formatText('italic')" type="button" title="Italic">
                        <i class="fas fa-italic"></i>
                    </button>
                    <button class="editor-btn" onclick="formatText('underline')" type="button" title="Underline">
                        <i class="fas fa-underline"></i>
                    </button>
                    <button class="editor-btn" onclick="formatText('insertUnorderedList')" type="button" title="Bullet List">
                        <i class="fas fa-list-ul"></i>
                    </button>
                    <button class="editor-btn" onclick="formatText('insertOrderedList')" type="button" title="Numbered List">
                        <i class="fas fa-list-ol"></i>
                    </button>
                    <button class="editor-btn" onclick="formatText('createLink')" type="button" title="Insert Link">
                        <i class="fas fa-link"></i>
                    </button>
                </div>
                <div 
                    id="description-editor" 
                    class="rich-text-editor" 
                    contenteditable="true"
                    placeholder="Describe your AI agent, its capabilities, and use cases..."
                ></div>
                <div class="error-message" id="description-error">Description is required</div>
            </div>

            <div class="form-group">
                <label class="form-label">
                    Pricing Model <span class="required">*</span>
                </label>
                <select id="pricing-model" class="form-input">
                    <option value="">Select pricing model</option>
                    <option value="FREE">Free</option>
                    <option value="FREEMIUM">Freemium</option>
                    <option value="PAID">Paid</option>
                    <option value="CONTACT">Contact for Pricing</option>
                </select>
                <div class="error-message" id="pricing-error">Please select a pricing model</div>
            </div>

            <div class="form-group">
                <label class="checkbox-label">
                    <input type="checkbox" id="is-open-source" onchange="toggleGithubUrl()"/>
                    <span>Open Source Project</span>
                </label>
            </div>

            <div class="form-group" id="github-url-group" style="display: none;">
                <label class="form-label">
                    GitHub Repository URL
                </label>
                <input 
                    type="url" 
                    id="github-url" 
                    class="form-input" 
                    placeholder="https://github.com/username/repo"
                    pattern="https://github.com/.*"
                />
                <div class="error-message" id="github-url-error">Please enter a valid GitHub URL</div>
            </div>
        </div>

        <!-- Step 2: Visual Assets -->
        <div class="step-content" data-step="2">
            <h2 class="text-2xl font-bold mb-6" style="color: var(--text-primary);">Visual Assets</h2>
            
            <div class="form-group">
                <label class="form-label">
                    Logo <span class="required">*</span>
                </label>
                <div class="upload-area" id="logo-upload-area" onclick="document.getElementById('logo-upload').click()">
                    <i class="fas fa-cloud-upload-alt text-4xl mb-2" style="color: var(--accent);"></i>
                    <p style="color: var(--text-secondary);">
                        Drag & drop or click to upload logo
                    </p>
                    <p class="text-sm" style="color: var(--text-secondary);">
                        Max 2MB • Square format recommended (500x500px)
                    </p>
                </div>
                <input 
                    type="file" 
                    id="logo-upload" 
                    accept="image/*" 
                    style="display: none;"
                    onchange="handleLogoUpload(event)"
                />
                <div id="logo-preview" class="text-center"></div>
                <div class="error-message" id="logo-error">Logo is required</div>
            </div>

            <div class="form-group">
                <label class="form-label">
                    Cover Image
                </label>
                <div class="upload-area" id="cover-upload-area" onclick="document.getElementById('cover-upload').click()">
                    <i class="fas fa-image text-4xl mb-2" style="color: var(--accent);"></i>
                    <p style="color: var(--text-secondary);">
                        Drag & drop or click to upload cover image
                    </p>
                    <p class="text-sm" style="color: var(--text-secondary);">
                        Max 5MB • Recommended: 1200x630px
                    </p>
                </div>
                <input 
                    type="file" 
                    id="cover-upload" 
                    accept="image/*" 
                    style="display: none;"
                    onchange="handleCoverUpload(event)"
                />
                <div id="cover-preview" class="text-center"></div>
            </div>

            <div class="form-group">
                <label class="form-label">
                    Screenshots (Up to 5)
                </label>
                <div class="upload-area" id="screenshots-upload-area" onclick="document.getElementById('screenshots-upload').click()">
                    <i class="fas fa-images text-4xl mb-2" style="color: var(--accent);"></i>
                    <p style="color: var(--text-secondary);">
                        Drag & drop or click to upload screenshots
                    </p>
                    <p class="text-sm" style="color: var(--text-secondary);">
                        Max 5 images • Each max 5MB
                    </p>
                </div>
                <input 
                    type="file" 
                    id="screenshots-upload" 
                    accept="image/*" 
                    multiple
                    max="5"
                    style="display: none;"
                    onchange="handleScreenshotsUpload(event)"
                />
                <div id="screenshots-preview" class="screenshots-grid"></div>
            </div>
        </div>

        <!-- Step 3: Categorization -->
        <div class="step-content" data-step="3">
            <h2 class="text-2xl font-bold mb-6" style="color: var(--text-primary);">Categorization</h2>
            
            <div class="form-group">
                <label class="form-label">
                    Categories (1-3) <span class="required">*</span>
                </label>
                <p class="text-sm mb-2" style="color: var(--text-secondary);">
                    Select 1 to 3 categories that best describe your AI agent
                </p>
                <div id="categories-container" class="space-y-2"></div>
                <div class="error-message" id="categories-error">Please select at least 1 category</div>
            </div>

            <div class="form-group">
                <label class="form-label">
                    Tags (Up to 10)
                </label>
                <p class="text-sm mb-2" style="color: var(--text-secondary);">
                    Add relevant tags to help users find your agent
                </p>
                <div class="position-relative">
                    <div class="tag-input-container" onclick="document.getElementById('tag-input').focus()">
                        <div id="selected-tags"></div>
                        <input 
                            type="text" 
                            id="tag-input" 
                            class="tag-input" 
                            placeholder="Type and press Enter..."
                            onkeydown="handleTagInput(event)"
                            oninput="handleTagAutocomplete(event)"
                        />
                    </div>
                    <div class="autocomplete-dropdown" id="tag-autocomplete"></div>
                </div>
                <p class="text-sm mt-2" style="color: var(--text-secondary);">
                    <span id="tag-count">0</span>/10 tags
                </p>
            </div>
        </div>

        <!-- Step 4: Features & Use Cases -->
        <div class="step-content" data-step="4">
            <h2 class="text-2xl font-bold mb-6" style="color: var(--text-primary);">Features & Use Cases</h2>
            
            <div class="form-group">
                <label class="form-label">
                    Key Features (Up to 10)
                </label>
                <p class="text-sm mb-2" style="color: var(--text-secondary);">
                    List the main features of your AI agent
                </p>
                <div id="features-list">
                    <div class="feature-item">
                        <input type="text" class="form-input" placeholder="Feature 1" />
                        <button type="button" class="remove-btn" onclick="removeFeature(this)" style="display: none;">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
                <button type="button" class="add-btn" onclick="addFeature()">
                    <i class="fas fa-plus"></i>
                    Add Feature
                </button>
            </div>

            <div class="form-group">
                <label class="form-label">
                    Use Cases (Up to 5)
                </label>
                <p class="text-sm mb-2" style="color: var(--text-secondary);">
                    Describe practical use cases for your AI agent
                </p>
                <div id="usecases-list">
                    <div class="usecase-item">
                        <input type="text" class="form-input" placeholder="Use case 1" />
                        <button type="button" class="remove-btn" onclick="removeUseCase(this)" style="display: none;">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
                <button type="button" class="add-btn" onclick="addUseCase()">
                    <i class="fas fa-plus"></i>
                    Add Use Case
                </button>
            </div>
        </div>

        <!-- Step 5: Additional Information -->
        <div class="step-content" data-step="5">
            <h2 class="text-2xl font-bold mb-6" style="color: var(--text-primary);">Additional Information</h2>
            
            <div class="form-group">
                <label class="form-label">Social Links</label>
                <p class="text-sm mb-2" style="color: var(--text-secondary);">
                    Help users connect with you on social media
                </p>
                
                <div class="space-y-3">
                    <div class="flex items-center gap-2">
                        <i class="fab fa-twitter text-xl" style="color: #1DA1F2; width: 24px;"></i>
                        <input type="url" id="twitter-url" class="form-input" placeholder="https://twitter.com/username" />
                    </div>
                    <div class="flex items-center gap-2">
                        <i class="fab fa-github text-xl" style="width: 24px;"></i>
                        <input type="url" id="github-social-url" class="form-input" placeholder="https://github.com/username" />
                    </div>
                    <div class="flex items-center gap-2">
                        <i class="fab fa-linkedin text-xl" style="color: #0077B5; width: 24px;"></i>
                        <input type="url" id="linkedin-url" class="form-input" placeholder="https://linkedin.com/in/username" />
                    </div>
                    <div class="flex items-center gap-2">
                        <i class="fab fa-discord text-xl" style="color: #5865F2; width: 24px;"></i>
                        <input type="url" id="discord-url" class="form-input" placeholder="https://discord.gg/invite" />
                    </div>
                </div>
            </div>

            <div class="form-group">
                <label class="form-label">Affiliate Program</label>
                <p class="text-sm mb-2" style="color: var(--text-secondary);">
                    Do you offer an affiliate or referral program?
                </p>
                <select id="has-affiliate" class="form-input" onchange="toggleAffiliateUrl()">
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                </select>
            </div>

            <div class="form-group" id="affiliate-url-group" style="display: none;">
                <label class="form-label">
                    Affiliate Program URL
                </label>
                <input 
                    type="url" 
                    id="affiliate-url" 
                    class="form-input" 
                    placeholder="https://example.com/affiliate"
                />
            </div>

            <div class="form-group">
                <label class="checkbox-label">
                    <input type="checkbox" id="allow-backlink" checked/>
                    <span>
                        Allow GenSpark AI Directory to include a "dofollow" backlink to our directory from your website. 
                        This helps with SEO and increases your agent's visibility.
                    </span>
                </label>
            </div>
        </div>

        <!-- Step 6: Review & Submit -->
        <div class="step-content" data-step="6">
            <h2 class="text-2xl font-bold mb-6" style="color: var(--text-primary);">Review & Submit</h2>
            
            <div class="review-card">
                <div class="review-section">
                    <h3>Basic Information</h3>
                    <p><strong>Agent Name:</strong> <span class="review-value" id="review-name"></span></p>
                    <p><strong>Website:</strong> <span class="review-value" id="review-url"></span></p>
                    <p><strong>Tagline:</strong> <span class="review-value" id="review-tagline"></span></p>
                    <p><strong>Pricing:</strong> <span class="review-value" id="review-pricing"></span></p>
                    <p><strong>Open Source:</strong> <span class="review-value" id="review-opensource"></span></p>
                </div>

                <div class="review-section">
                    <h3>Visual Assets</h3>
                    <div class="flex gap-4">
                        <div>
                            <p class="mb-2"><strong>Logo:</strong></p>
                            <img id="review-logo" style="max-width: 100px; border-radius: 8px;" />
                        </div>
                        <div>
                            <p class="mb-2"><strong>Cover:</strong></p>
                            <img id="review-cover" style="max-width: 200px; border-radius: 8px;" />
                        </div>
                    </div>
                </div>

                <div class="review-section">
                    <h3>Categorization</h3>
                    <p><strong>Categories:</strong> <span class="review-value" id="review-categories"></span></p>
                    <p><strong>Tags:</strong> <span class="review-value" id="review-tags"></span></p>
                </div>

                <div class="review-section">
                    <h3>Features & Use Cases</h3>
                    <p><strong>Features:</strong></p>
                    <ul id="review-features" class="list-disc ml-6" style="color: var(--text-secondary);"></ul>
                    <p class="mt-2"><strong>Use Cases:</strong></p>
                    <ul id="review-usecases" class="list-disc ml-6" style="color: var(--text-secondary);"></ul>
                </div>
            </div>

            <div class="form-group">
                <label class="checkbox-label">
                    <input type="checkbox" id="accept-terms" required/>
                    <span>
                        I agree to the <a href="/terms" target="_blank" style="color: var(--accent);">Terms of Service</a> 
                        and <a href="/privacy" target="_blank" style="color: var(--accent);">Privacy Policy</a>. 
                        I confirm that I have the right to submit this AI agent and that all information provided is accurate.
                    </span>
                </label>
                <div class="error-message" id="terms-error">You must accept the terms to continue</div>
            </div>
        </div>

        <!-- Navigation Buttons -->
        <div class="navigation-buttons">
            <button class="btn btn-secondary" id="prev-btn" onclick="previousStep()" disabled>
                <i class="fas fa-arrow-left"></i>
                Back
            </button>
            <button class="btn btn-primary" id="next-btn" onclick="nextStep()">
                Next
                <i class="fas fa-arrow-right"></i>
            </button>
            <button class="btn btn-primary" id="submit-btn" onclick="submitForm()" style="display: none;">
                <span id="submit-text">Submit for Review</span>
                <i id="submit-loader" class="fas fa-spinner fa-spin" style="display: none;"></i>
            </button>
        </div>
    </div>

    <!-- Save Draft Button -->
    <button class="save-draft-btn" onclick="saveDraft()">
        <i class="fas fa-save mr-2"></i>
        Save Draft
    </button>

    <!-- Success Modal -->
    <div class="success-modal" id="success-modal">
        <div class="success-modal-content">
            <i class="fas fa-check-circle text-6xl mb-4" style="color: #10b981;"></i>
            <h2 class="text-2xl font-bold mb-2" style="color: var(--text-primary);">
                Thank You for Submitting!
            </h2>
            <p class="mb-4" style="color: var(--text-secondary);">
                Your AI agent has been submitted successfully and is now under review.
            </p>
            <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4">
                <p class="text-sm" style="color: var(--text-secondary);">
                    <i class="fas fa-clock mr-2"></i>
                    <strong>Expected Approval Time:</strong> 24-48 hours
                </p>
            </div>
            <p class="mb-6 text-sm" style="color: var(--text-secondary);">
                You'll receive an email notification once your submission is reviewed. 
                You can track the status in your dashboard.
            </p>
            <button class="btn btn-primary" onclick="window.location.href='/dashboard'">
                Go to Dashboard
                <i class="fas fa-arrow-right"></i>
            </button>
        </div>
    </div>

    <script>
        let currentStep = 1;
        const totalSteps = 6;
        let formData = {
            categories: [],
            tags: [],
            features: [],
            useCases: [],
            screenshots: []
        };

        // Popular tags for autocomplete
        // Categories and tags loaded from database
        let categories = [];
        let availableTags = [];

        // Load categories from database
        async function loadCategories() {
            try {
                const response = await axios.get('/api/categories');
                if (response.data.success) {
                    categories = response.data.data;
                    renderCategories();
                }
            } catch (error) {
                console.error('Error loading categories:', error);
                showToast('Failed to load categories', 'error');
            }
        }

        // Load tags from database
        async function loadTags() {
            try {
                const response = await axios.get('/api/tags');
                if (response.data.success) {
                    availableTags = response.data.data.map(tag => tag.name);
                }
            } catch (error) {
                console.error('Error loading tags:', error);
            }
        }

        // Initialize on page load
        window.addEventListener('DOMContentLoaded', async () => {
            loadDraft();
            await loadCategories();
            await loadTags();
            updateProgressBar();
            
            // Character counter for tagline
            document.getElementById('tagline').addEventListener('input', (e) => {
                document.getElementById('tagline-count').textContent = e.target.value.length;
            });

            // Drag and drop handlers
            setupDragAndDrop();
        });

        function loadDraft() {
            const draft = localStorage.getItem('agent_submission_draft');
            if (draft) {
                try {
                    const data = JSON.parse(draft);
                    if (confirm('A draft submission was found. Would you like to continue from where you left off?')) {
                        formData = data;
                        // Convert category IDs from strings to numbers if needed
                        if (formData.categories && Array.isArray(formData.categories)) {
                            formData.categories = formData.categories.map(id => 
                                typeof id === 'string' ? parseInt(id) : id
                            );
                        }
                        populateFormFromData();
                    }
                } catch (e) {
                    console.error('Failed to load draft:', e);
                }
            }
        }

        function saveDraft() {
            collectCurrentStepData();
            localStorage.setItem('agent_submission_draft', JSON.stringify(formData));
            
            // Show toast notification
            const toast = document.createElement('div');
            toast.style.cssText = 'position: fixed; top: 2rem; right: 2rem; background: #10b981; color: white; padding: 1rem 1.5rem; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.2); z-index: 1000;';
            toast.innerHTML = '<i class="fas fa-check mr-2"></i> Draft saved successfully!';
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 3000);
        }

        function autoSave() {
            collectCurrentStepData();
            localStorage.setItem('agent_submission_draft', JSON.stringify(formData));
        }

        function populateFormFromData() {
            if (formData.name) document.getElementById('agent-name').value = formData.name;
            if (formData.websiteUrl) document.getElementById('website-url').value = formData.websiteUrl;
            if (formData.tagline) {
                document.getElementById('tagline').value = formData.tagline;
                document.getElementById('tagline-count').textContent = formData.tagline.length;
            }
            if (formData.description) document.getElementById('description-editor').innerHTML = formData.description;
            if (formData.pricingModel) document.getElementById('pricing-model').value = formData.pricingModel;
            if (formData.isOpenSource) {
                document.getElementById('is-open-source').checked = true;
                toggleGithubUrl();
                if (formData.githubUrl) document.getElementById('github-url').value = formData.githubUrl;
            }
            
            // Populate other fields...
        }

        function nextStep() {
            if (!validateCurrentStep()) {
                return;
            }

            collectCurrentStepData();
            autoSave();

            if (currentStep < totalSteps) {
                currentStep++;
                updateStepDisplay();
                updateProgressBar();
                window.scrollTo(0, 0);
            }
        }

        function previousStep() {
            if (currentStep > 1) {
                collectCurrentStepData();
                currentStep--;
                updateStepDisplay();
                updateProgressBar();
                window.scrollTo(0, 0);
            }
        }

        function updateStepDisplay() {
            // Hide all steps
            document.querySelectorAll('.step-content').forEach(step => {
                step.classList.remove('active');
            });

            // Show current step
            document.querySelector(\`.step-content[data-step="\${currentStep}"]\`).classList.add('active');

            // Update step circles
            document.querySelectorAll('.step-circle').forEach((circle, index) => {
                const stepNum = index + 1;
                circle.classList.remove('active', 'completed');
                
                if (stepNum < currentStep) {
                    circle.classList.add('completed');
                    circle.innerHTML = '<i class="fas fa-check"></i>';
                } else if (stepNum === currentStep) {
                    circle.classList.add('active');
                    circle.textContent = stepNum;
                } else {
                    circle.textContent = stepNum;
                }
            });

            // Update navigation buttons
            document.getElementById('prev-btn').disabled = currentStep === 1;
            
            if (currentStep === totalSteps) {
                document.getElementById('next-btn').style.display = 'none';
                document.getElementById('submit-btn').style.display = 'inline-flex';
                populateReview();
            } else {
                document.getElementById('next-btn').style.display = 'inline-flex';
                document.getElementById('submit-btn').style.display = 'none';
            }
        }

        function updateProgressBar() {
            const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;
            document.getElementById('progress-line-active').style.width = progress + '%';
        }

        function validateCurrentStep() {
            let isValid = true;

            // Clear previous errors
            document.querySelectorAll('.error-message').forEach(msg => msg.classList.remove('visible'));
            document.querySelectorAll('.form-input').forEach(input => input.classList.remove('error'));

            if (currentStep === 1) {
                // Validate basic information
                const name = document.getElementById('agent-name').value.trim();
                if (name.length < 3) {
                    showError('agent-name', 'agent-name-error');
                    isValid = false;
                }

                const url = document.getElementById('website-url').value.trim();
                if (!url.startsWith('https://')) {
                    showError('website-url', 'website-url-error');
                    isValid = false;
                }

                const tagline = document.getElementById('tagline').value.trim();
                if (!tagline) {
                    showError('tagline', 'tagline-error');
                    isValid = false;
                }

                const description = document.getElementById('description-editor').textContent.trim();
                if (description.length < 50) {
                    showError('description-editor', 'description-error');
                    document.getElementById('description-error').textContent = 'Description must be at least 50 characters';
                    isValid = false;
                }

                const pricing = document.getElementById('pricing-model').value;
                if (!pricing) {
                    showError('pricing-model', 'pricing-error');
                    isValid = false;
                }

                const isOpenSource = document.getElementById('is-open-source').checked;
                if (isOpenSource) {
                    const githubUrl = document.getElementById('github-url').value.trim();
                    if (githubUrl && !githubUrl.startsWith('https://github.com/')) {
                        showError('github-url', 'github-url-error');
                        isValid = false;
                    }
                }
            } else if (currentStep === 2) {
                // Validate visual assets - logo is required
                if (!formData.logoUrl && !document.getElementById('logo-preview').innerHTML) {
                    showError('logo-upload-area', 'logo-error');
                    isValid = false;
                }
            } else if (currentStep === 3) {
                // Validate categories - at least 1 required
                if (formData.categories.length === 0) {
                    document.getElementById('categories-error').classList.add('visible');
                    isValid = false;
                }
            } else if (currentStep === 6) {
                // Validate terms acceptance
                if (!document.getElementById('accept-terms').checked) {
                    document.getElementById('terms-error').classList.add('visible');
                    isValid = false;
                }
            }

            return isValid;
        }

        function showError(inputId, errorId) {
            document.getElementById(inputId).classList.add('error');
            document.getElementById(errorId).classList.add('visible');
        }

        function collectCurrentStepData() {
            if (currentStep === 1) {
                formData.name = document.getElementById('agent-name').value.trim();
                formData.websiteUrl = document.getElementById('website-url').value.trim();
                formData.tagline = document.getElementById('tagline').value.trim();
                formData.description = document.getElementById('description-editor').innerHTML;
                formData.pricingModel = document.getElementById('pricing-model').value;
                formData.isOpenSource = document.getElementById('is-open-source').checked;
                formData.githubUrl = document.getElementById('github-url').value.trim();
            } else if (currentStep === 4) {
                // Collect features
                formData.features = [];
                document.querySelectorAll('#features-list .feature-item input').forEach(input => {
                    if (input.value.trim()) {
                        formData.features.push(input.value.trim());
                    }
                });

                // Collect use cases
                formData.useCases = [];
                document.querySelectorAll('#usecases-list .usecase-item input').forEach(input => {
                    if (input.value.trim()) {
                        formData.useCases.push(input.value.trim());
                    }
                });
            } else if (currentStep === 5) {
                formData.socialLinks = {
                    twitter: document.getElementById('twitter-url').value.trim(),
                    github: document.getElementById('github-social-url').value.trim(),
                    linkedin: document.getElementById('linkedin-url').value.trim(),
                    discord: document.getElementById('discord-url').value.trim()
                };
                formData.hasAffiliate = document.getElementById('has-affiliate').value === 'yes';
                formData.affiliateUrl = document.getElementById('affiliate-url').value.trim();
                formData.allowBacklink = document.getElementById('allow-backlink').checked;
            }
        }

        function populateReview() {
            document.getElementById('review-name').textContent = formData.name || 'N/A';
            document.getElementById('review-url').textContent = formData.websiteUrl || 'N/A';
            document.getElementById('review-tagline').textContent = formData.tagline || 'N/A';
            document.getElementById('review-pricing').textContent = formData.pricingModel || 'N/A';
            document.getElementById('review-opensource').textContent = formData.isOpenSource ? 'Yes' : 'No';

            if (formData.logoUrl) {
                document.getElementById('review-logo').src = formData.logoUrl;
            }
            if (formData.coverUrl) {
                document.getElementById('review-cover').src = formData.coverUrl;
            }

            document.getElementById('review-categories').textContent = formData.categories.map(id => {
                const cat = categories.find(c => c.id === parseInt(id));
                return cat ? cat.name : '';
            }).join(', ') || 'N/A';

            document.getElementById('review-tags').textContent = formData.tags.join(', ') || 'N/A';

            const featuresList = document.getElementById('review-features');
            featuresList.innerHTML = formData.features.map(f => \`<li>\${f}</li>\`).join('') || '<li>None</li>';

            const usecasesList = document.getElementById('review-usecases');
            usecasesList.innerHTML = formData.useCases.map(u => \`<li>\${u}</li>\`).join('') || '<li>None</li>';
        }

        async function submitForm() {
            if (!validateCurrentStep()) {
                return;
            }

            collectCurrentStepData();
            
            // Collect acceptTerms from step 6
            formData.acceptTerms = document.getElementById('accept-terms').checked;
            
            // Ensure categories are numbers, not strings (convert if needed)
            if (formData.categories && Array.isArray(formData.categories)) {
                formData.categories = formData.categories.map(id => 
                    typeof id === 'string' ? parseInt(id) : id
                );
            }
            
            // Check payload size to prevent network errors
            const payloadSize = JSON.stringify(formData).length;
            const maxSize = 1 * 1024 * 1024; // 1MB limit for HTTP request
            
            if (payloadSize > maxSize) {
                const sizeMB = (payloadSize / (1024 * 1024)).toFixed(2);
                alert(\`Request payload is too large (\${sizeMB}MB). Please reduce image sizes or remove some images. Maximum allowed: 1MB.\`);
                return;
            }

            // Show loading state
            document.getElementById('submit-text').style.display = 'none';
            document.getElementById('submit-loader').style.display = 'inline-block';
            document.getElementById('submit-btn').disabled = true;

            try {
                const token = localStorage.getItem('auth_token');
                if (!token) {
                    alert('You must be logged in to submit an agent. Redirecting to login...');
                    window.location.href = '/login?redirect=/submit';
                    return;
                }

                const response = await axios.post('/api/submit', formData, {
                    headers: {
                        'Authorization': 'Bearer ' + token,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.data.success) {
                    // Clear draft
                    localStorage.removeItem('agent_submission_draft');
                    
                    // Show success modal
                    document.getElementById('success-modal').classList.add('visible');
                } else {
                    throw new Error(response.data.error || 'Submission failed');
                }
            } catch (error) {
                console.error('Submission error:', error);
                alert('Failed to submit agent: ' + (error.response?.data?.error || error.message));
                
                // Reset button state
                document.getElementById('submit-text').style.display = 'inline';
                document.getElementById('submit-loader').style.display = 'none';
                document.getElementById('submit-btn').disabled = false;
            }
        }

        // Rich text editor functions
        function formatText(command, value = null) {
            event.preventDefault();
            document.execCommand(command, false, value);
            document.getElementById('description-editor').focus();
        }

        // Toggle GitHub URL field
        function toggleGithubUrl() {
            const isChecked = document.getElementById('is-open-source').checked;
            document.getElementById('github-url-group').style.display = isChecked ? 'block' : 'none';
        }

        // Image upload handlers
        function handleLogoUpload(event) {
            const file = event.target.files[0];
            if (file && file.size <= 2 * 1024 * 1024) { // 2MB limit
                const reader = new FileReader();
                reader.onload = (e) => {
                    formData.logoUrl = e.target.result;
                    document.getElementById('logo-preview').innerHTML = \`
                        <img src="\${e.target.result}" class="preview-image" alt="Logo preview" />
                    \`;
                };
                reader.readAsDataURL(file);
            } else {
                alert('Logo file size must be less than 2MB');
            }
        }

        function handleCoverUpload(event) {
            const file = event.target.files[0];
            if (file && file.size <= 5 * 1024 * 1024) { // 5MB limit
                const reader = new FileReader();
                reader.onload = (e) => {
                    formData.coverUrl = e.target.result;
                    document.getElementById('cover-preview').innerHTML = \`
                        <img src="\${e.target.result}" class="preview-image" alt="Cover preview" />
                    \`;
                };
                reader.readAsDataURL(file);
            } else {
                alert('Cover image file size must be less than 5MB');
            }
        }

        function handleScreenshotsUpload(event) {
            const files = Array.from(event.target.files).slice(0, 5); // Max 5 screenshots
            const previewContainer = document.getElementById('screenshots-preview');
            
            files.forEach((file, index) => {
                if (file.size <= 5 * 1024 * 1024) { // 5MB limit per file
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const screenshotId = 'screenshot-' + Date.now() + '-' + index;
                        formData.screenshots.push(e.target.result);
                        
                        const div = document.createElement('div');
                        div.className = 'screenshot-item';
                        div.innerHTML = \`
                            <img src="\${e.target.result}" alt="Screenshot \${index + 1}" />
                            <button class="screenshot-remove" onclick="removeScreenshot(this, '\${screenshotId}')">
                                <i class="fas fa-times"></i>
                            </button>
                        \`;
                        previewContainer.appendChild(div);
                    };
                    reader.readAsDataURL(file);
                }
            });
        }

        function removeScreenshot(btn, id) {
            btn.parentElement.remove();
            // Update formData.screenshots array
        }

        // Drag and drop setup
        function setupDragAndDrop() {
            ['logo-upload-area', 'cover-upload-area', 'screenshots-upload-area'].forEach(areaId => {
                const area = document.getElementById(areaId);
                
                area.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    area.classList.add('dragover');
                });

                area.addEventListener('dragleave', () => {
                    area.classList.remove('dragover');
                });

                area.addEventListener('drop', (e) => {
                    e.preventDefault();
                    area.classList.remove('dragover');
                    
                    const files = e.dataTransfer.files;
                    if (areaId === 'logo-upload-area' && files.length > 0) {
                        document.getElementById('logo-upload').files = files;
                        handleLogoUpload({ target: { files } });
                    } else if (areaId === 'cover-upload-area' && files.length > 0) {
                        document.getElementById('cover-upload').files = files;
                        handleCoverUpload({ target: { files } });
                    } else if (areaId === 'screenshots-upload-area') {
                        document.getElementById('screenshots-upload').files = files;
                        handleScreenshotsUpload({ target: { files } });
                    }
                });
            });
        }

        // Categories rendering
        function renderCategories() {
            const container = document.getElementById('categories-container');
            container.innerHTML = categories.map(cat => \`
                <label class="checkbox-label">
                    <input 
                        type="checkbox" 
                        value="\${cat.id}" 
                        onchange="handleCategoryChange(this)"
                        \${formData.categories.includes(cat.id.toString()) ? 'checked' : ''}
                    />
                    <span>\${cat.name}</span>
                </label>
            \`).join('');
        }

        function handleCategoryChange(checkbox) {
            const categoryId = parseInt(checkbox.value); // Convert string to number
            
            if (checkbox.checked) {
                if (formData.categories.length < 3) {
                    formData.categories.push(categoryId);
                } else {
                    checkbox.checked = false;
                    alert('You can select a maximum of 3 categories');
                }
            } else {
                formData.categories = formData.categories.filter(id => id !== categoryId);
            }
        }

        // Tags handling
        function handleTagInput(event) {
            if (event.key === 'Enter' || event.key === ',') {
                event.preventDefault();
                const input = event.target;
                const tag = input.value.trim().replace(',', '');
                
                if (tag && formData.tags.length < 10 && !formData.tags.includes(tag)) {
                    formData.tags.push(tag);
                    renderTags();
                    input.value = '';
                    document.getElementById('tag-autocomplete').classList.remove('visible');
                } else if (formData.tags.length >= 10) {
                    alert('Maximum 10 tags allowed');
                }
            }
        }

        function handleTagAutocomplete(event) {
            const input = event.target.value.toLowerCase();
            const dropdown = document.getElementById('tag-autocomplete');
            
            if (input.length < 2) {
                dropdown.classList.remove('visible');
                return;
            }

            const matches = availableTags.filter(tag => 
                tag.toLowerCase().includes(input) && !formData.tags.includes(tag)
            );

            if (matches.length > 0) {
                dropdown.innerHTML = matches.slice(0, 5).map(tag => \`
                    <div class="autocomplete-item" onclick="selectTag('\${tag}')">
                        \${tag}
                    </div>
                \`).join('');
                dropdown.classList.add('visible');
            } else {
                dropdown.classList.remove('visible');
            }
        }

        function selectTag(tag) {
            if (formData.tags.length < 10 && !formData.tags.includes(tag)) {
                formData.tags.push(tag);
                renderTags();
                document.getElementById('tag-input').value = '';
                document.getElementById('tag-autocomplete').classList.remove('visible');
            }
        }

        function renderTags() {
            const container = document.getElementById('selected-tags');
            container.innerHTML = formData.tags.map(tag => \`
                <div class="tag-item">
                    <span>\${tag}</span>
                    <button class="tag-remove" onclick="removeTag('\${tag}')">×</button>
                </div>
            \`).join('');
            document.getElementById('tag-count').textContent = formData.tags.length;
        }

        function removeTag(tag) {
            formData.tags = formData.tags.filter(t => t !== tag);
            renderTags();
        }

        // Features and use cases
        function addFeature() {
            const container = document.getElementById('features-list');
            if (container.children.length < 10) {
                const div = document.createElement('div');
                div.className = 'feature-item';
                div.innerHTML = \`
                    <input type="text" class="form-input" placeholder="Feature \${container.children.length + 1}" />
                    <button type="button" class="remove-btn" onclick="removeFeature(this)">
                        <i class="fas fa-times"></i>
                    </button>
                \`;
                container.appendChild(div);
            } else {
                alert('Maximum 10 features allowed');
            }
        }

        function removeFeature(btn) {
            btn.parentElement.remove();
        }

        function addUseCase() {
            const container = document.getElementById('usecases-list');
            if (container.children.length < 5) {
                const div = document.createElement('div');
                div.className = 'usecase-item';
                div.innerHTML = \`
                    <input type="text" class="form-input" placeholder="Use case \${container.children.length + 1}" />
                    <button type="button" class="remove-btn" onclick="removeUseCase(this)">
                        <i class="fas fa-times"></i>
                    </button>
                \`;
                container.appendChild(div);
            } else {
                alert('Maximum 5 use cases allowed');
            }
        }

        function removeUseCase(btn) {
            btn.parentElement.remove();
        }

        function toggleAffiliateUrl() {
            const hasAffiliate = document.getElementById('has-affiliate').value === 'yes';
            document.getElementById('affiliate-url-group').style.display = hasAffiliate ? 'block' : 'none';
        }
    </script>

    ${getFooter()}
</body>
</html>
`;
