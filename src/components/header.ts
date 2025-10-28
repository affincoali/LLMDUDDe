// Universal Header Component
// Used across all pages for consistency

export const getHeader = (activePage: string = '') => `
<nav class="card border-b sticky top-0 z-40 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">
            <a href="/" class="flex items-center space-x-3">
                <i class="fas fa-robot text-3xl text-purple-600"></i>
                <span class="text-xl font-bold">AI Agents Directory</span>
            </a>
            
            <div class="hidden md:flex items-center space-x-6">
                <a href="/" class="${activePage === 'home' ? 'text-purple-600 font-semibold' : 'hover:text-purple-600'}">Home</a>
                <a href="/agents" class="${activePage === 'agents' ? 'text-purple-600 font-semibold' : 'hover:text-purple-600'}">Agents</a>
                <a href="/categories" class="${activePage === 'categories' ? 'text-purple-600 font-semibold' : 'hover:text-purple-600'}">Categories</a>
                <a href="/leaderboard" class="${activePage === 'leaderboard' ? 'text-purple-600 font-semibold' : 'hover:text-purple-600'}">Leaderboard</a>
                <a href="/landscape" class="${activePage === 'landscape' ? 'text-purple-600 font-semibold' : 'hover:text-purple-600'}">Landscape</a>
                <a href="/submit" class="${activePage === 'submit' ? 'text-purple-600 font-semibold' : 'hover:text-purple-600'}">Submit</a>
                <button onclick="toggleDarkMode()" class="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700">
                    <i id="theme-icon" class="fas fa-moon"></i>
                </button>
            </div>
            
            <!-- Mobile Menu Button -->
            <button class="md:hidden p-2" onclick="toggleMobileMenu()">
                <i class="fas fa-bars text-xl"></i>
            </button>
        </div>
        
        <!-- Mobile Menu -->
        <div id="mobile-menu" class="hidden md:hidden pb-4">
            <a href="/" class="block py-2 ${activePage === 'home' ? 'text-purple-600 font-semibold' : 'hover:text-purple-600'}">Home</a>
            <a href="/agents" class="block py-2 ${activePage === 'agents' ? 'text-purple-600 font-semibold' : 'hover:text-purple-600'}">Agents</a>
            <a href="/categories" class="block py-2 ${activePage === 'categories' ? 'text-purple-600 font-semibold' : 'hover:text-purple-600'}">Categories</a>
            <a href="/leaderboard" class="block py-2 ${activePage === 'leaderboard' ? 'text-purple-600 font-semibold' : 'hover:text-purple-600'}">Leaderboard</a>
            <a href="/landscape" class="block py-2 ${activePage === 'landscape' ? 'text-purple-600 font-semibold' : 'hover:text-purple-600'}">Landscape</a>
            <a href="/submit" class="block py-2 ${activePage === 'submit' ? 'text-purple-600 font-semibold' : 'hover:text-purple-600'}">Submit</a>
            <button onclick="toggleDarkMode()" class="mt-2 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 w-full text-left">
                <i class="fas fa-moon mr-2"></i> Toggle Dark Mode
            </button>
        </div>
    </div>
</nav>

<script>
// Universal JavaScript for all pages
function toggleDarkMode() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    const icon = document.getElementById('theme-icon');
    if (icon) {
        icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    if (menu) {
        menu.classList.toggle('hidden');
    }
}

// Initialize theme on page load
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    const icon = document.getElementById('theme-icon');
    if (icon) {
        icon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

// Auto-initialize theme
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
} else {
    initTheme();
}
</script>
`;
