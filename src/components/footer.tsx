// Universal Footer Component
// This footer appears on ALL pages of the site

export const getFooter = () => `
    <footer class="bg-gray-900 text-white py-12 mt-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                <div>
                    <div class="flex items-center mb-4">
                        <i class="fas fa-robot text-3xl text-purple-500 mr-3"></i>
                        <span class="text-xl font-bold">AI Agents Directory</span>
                    </div>
                    <p class="text-gray-400">
                        Discover the best AI agents and tools for your needs. Browse, compare, and find the perfect AI solution.
                    </p>
                </div>
                <div>
                    <h3 class="font-bold mb-4">Explore</h3>
                    <ul class="space-y-2 text-gray-400">
                        <li><a href="/agents" class="hover:text-white transition">Browse Agents</a></li>
                        <li><a href="/categories" class="hover:text-white transition">Categories</a></li>
                        <li><a href="/agents?sort=trending" class="hover:text-white transition">Trending</a></li>
                        <li><a href="/agents?pricing=FREE" class="hover:text-white transition">Free Agents</a></li>
                    </ul>
                </div>
                <div>
                    <h3 class="font-bold mb-4">Resources</h3>
                    <ul class="space-y-2 text-gray-400">
                        <li><a href="/submit" class="hover:text-white transition">Submit Agent</a></li>
                        <li><a href="/allstats" class="hover:text-white transition"><i class="fas fa-chart-line mr-1"></i>Statistics</a></li>
                        <li><a href="/login" class="hover:text-white transition">Login</a></li>
                        <li><a href="/signup" class="hover:text-white transition">Sign Up</a></li>
                        <li><a href="/dashboard" class="hover:text-white transition">Dashboard</a></li>
                    </ul>
                </div>
                <div>
                    <h3 class="font-bold mb-4">Connect</h3>
                    <div class="flex space-x-4 mb-4">
                        <a href="https://twitter.com" target="_blank" class="text-gray-400 hover:text-white transition text-xl">
                            <i class="fab fa-twitter"></i>
                        </a>
                        <a href="https://github.com" target="_blank" class="text-gray-400 hover:text-white transition text-xl">
                            <i class="fab fa-github"></i>
                        </a>
                        <a href="https://linkedin.com" target="_blank" class="text-gray-400 hover:text-white transition text-xl">
                            <i class="fab fa-linkedin"></i>
                        </a>
                        <a href="https://discord.com" target="_blank" class="text-gray-400 hover:text-white transition text-xl">
                            <i class="fab fa-discord"></i>
                        </a>
                    </div>
                    <p class="text-sm text-gray-400">
                        Join our community of AI enthusiasts
                    </p>
                </div>
            </div>
            <div class="border-t border-gray-800 pt-8 text-center text-gray-400">
                <p>&copy; 2025 AI Agents Directory. All rights reserved.</p>
                <p class="mt-2 text-sm">Built with ❤️ using Hono and Cloudflare Workers</p>
            </div>
        </div>
    </footer>
`;
