import { getHeader } from './components/header';

export const adminReviewsPage = () => {
  return `
<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Manage Reviews - Admin Panel</title>
<script src="https://cdn.tailwindcss.com"></script>
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
<link href="/static/styles.css" rel="stylesheet">
<style>
:root[data-theme="light"]{--bg-primary:#fff;--bg-secondary:#f9fafb;--text-primary:#1f2937;--text-secondary:#6b7280;--border-color:#e5e7eb;--card-bg:#fff}
:root[data-theme="dark"]{--bg-primary:#1f2937;--bg-secondary:#111827;--text-primary:#f9fafb;--text-secondary:#d1d5db;--border-color:#374151;--card-bg:#374151}
body{background:var(--bg-secondary);color:var(--text-primary);min-height:100vh;transition:all .3s}
.card{background:var(--card-bg);color:var(--text-primary)}
.status-badge{padding:4px 12px;border-radius:12px;font-size:12px;font-weight:600}
.status-pending{background:#fef3c7;color:#92400e}
.status-approved{background:#d1fae5;color:#065f46}
.status-rejected{background:#fee2e2;color:#991b1b}
.star-rating{color:#fbbf24}
</style>
</head>
<body>
${getHeader('admin')}
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
<div class="flex justify-between items-center mb-8">
<h1 class="text-3xl font-bold"><i class="fas fa-star mr-3"></i>Review Management</h1>
<button onclick="window.location='/admin/agents-all'" class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"><i class="fas fa-arrow-left mr-2"></i>Back to Admin</button>
</div>

<div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
<div class="card border rounded-lg p-6"><div class="flex items-center justify-between mb-2"><span style="color:var(--text-secondary)">Pending</span><i class="fas fa-clock text-yellow-500 text-2xl"></i></div><p class="text-3xl font-bold" id="stat-pending">0</p></div>
<div class="card border rounded-lg p-6"><div class="flex items-center justify-between mb-2"><span style="color:var(--text-secondary)">Approved</span><i class="fas fa-check-circle text-green-500 text-2xl"></i></div><p class="text-3xl font-bold" id="stat-approved">0</p></div>
<div class="card border rounded-lg p-6"><div class="flex items-center justify-between mb-2"><span style="color:var(--text-secondary)">Rejected</span><i class="fas fa-times-circle text-red-500 text-2xl"></i></div><p class="text-3xl font-bold" id="stat-rejected">0</p></div>
<div class="card border rounded-lg p-6"><div class="flex items-center justify-between mb-2"><span style="color:var(--text-secondary)">Avg Rating</span><i class="fas fa-star text-yellow-500 text-2xl"></i></div><p class="text-3xl font-bold" id="stat-avg">0.0</p></div>
</div>

<div class="card border rounded-lg p-6 mb-6">
<div class="flex flex-col md:flex-row gap-4 mb-4">
<select id="status-filter" class="card px-4 py-2 rounded-lg border" onchange="loadReviews()">
<option value="">All Status</option>
<option value="PENDING">Pending</option>
<option value="APPROVED">Approved</option>
<option value="REJECTED">Rejected</option>
</select>
<button onclick="loadReviews()" class="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800"><i class="fas fa-sync mr-2"></i>Refresh</button>
</div>
</div>

<div class="card border rounded-lg overflow-hidden">
<div class="overflow-x-auto">
<table class="w-full">
<thead class="bg-gray-100 dark:bg-gray-800">
<tr>
<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Agent</th>
<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">User</th>
<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Rating</th>
<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Review</th>
<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Date</th>
<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
</tr>
</thead>
<tbody id="reviews-table" class="divide-y" style="border-color:var(--border-color)">
<tr><td colspan="7" class="px-6 py-4 text-center">Loading reviews...</td></tr>
</tbody>
</table>
</div>
</div>

<div id="pagination" class="flex justify-center items-center gap-4 mt-6"></div>
</div>

<div id="edit-modal" class="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50">
<div class="card rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
<h2 class="text-2xl font-bold mb-4">Edit Review</h2>
<div class="mb-4">
<label class="block mb-2 font-medium">Rating</label>
<select id="edit-rating" class="card w-full px-4 py-2 border rounded-lg">
<option value="5">5 Stars - Excellent</option>
<option value="4">4 Stars - Good</option>
<option value="3">3 Stars - Average</option>
<option value="2">2 Stars - Poor</option>
<option value="1">1 Star - Terrible</option>
</select>
</div>
<div class="mb-4">
<label class="block mb-2 font-medium">Review Title</label>
<input type="text" id="edit-title" class="card w-full px-4 py-2 border rounded-lg" maxlength="100">
</div>
<div class="mb-4">
<label class="block mb-2 font-medium">Review Summary</label>
<textarea id="edit-summary" class="card w-full px-4 py-2 border rounded-lg" rows="5" maxlength="2000"></textarea>
<p class="text-sm mt-1" style="color:var(--text-secondary)"><span id="char-count">0</span>/2000 characters</p>
</div>
<div class="flex gap-4">
<button onclick="saveReviewEdit()" class="flex-1 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800">Save Changes</button>
<button onclick="closeEditModal()" class="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">Cancel</button>
</div>
</div>
</div>

<script>
const API_BASE='/api';
let currentPage=1;
let currentEditId=null;

async function loadStats(){
  try{
    const res=await axios.get(\`\${API_BASE}/admin/reviews/stats\`);
    if(res.data.success){
      document.getElementById('stat-pending').textContent=res.data.data.pending;
      document.getElementById('stat-approved').textContent=res.data.data.approved;
      document.getElementById('stat-rejected').textContent=res.data.data.rejected;
      document.getElementById('stat-avg').textContent=res.data.data.average_rating.toFixed(1);
    }
  }catch(err){
    console.error('Error loading stats:',err);
  }
}

async function loadReviews(page=1){
  try{
    currentPage=page;
    const status=document.getElementById('status-filter').value;
    let url=\`\${API_BASE}/admin/reviews?page=\${page}&limit=20\`;
    if(status)url+=\`&status=\${status}\`;
    
    const res=await axios.get(url);
    if(res.data.success){
      const tbody=document.getElementById('reviews-table');
      const reviews=res.data.data.reviews;
      
      if(reviews.length===0){
        tbody.innerHTML='<tr><td colspan="7" class="px-6 py-4 text-center">No reviews found</td></tr>';
        return;
      }
      
      tbody.innerHTML=reviews.map(r=>\`
        <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
          <td class="px-6 py-4"><a href="/agents/\${r.agent_slug}" class="text-blue-700 hover:underline font-medium">\${r.agent_name}</a></td>
          <td class="px-6 py-4"><div>\${r.user_name}</div><div class="text-sm" style="color:var(--text-secondary)">\${r.user_email}</div></td>
          <td class="px-6 py-4"><div class="star-rating">\${'★'.repeat(r.rating)}\${'☆'.repeat(5-r.rating)}</div></td>
          <td class="px-6 py-4"><div class="font-medium mb-1">\${r.review_title}</div><div class="text-sm" style="color:var(--text-secondary)">\${r.review_summary.substring(0,80)}...</div></td>
          <td class="px-6 py-4"><span class="status-badge status-\${r.status.toLowerCase()}">\${r.status}</span></td>
          <td class="px-6 py-4 text-sm">\${new Date(r.created_at).toLocaleDateString()}</td>
          <td class="px-6 py-4"><div class="flex gap-2">
            \${r.status==='PENDING'?\`<button onclick="approveReview(\${r.id})" class="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"><i class="fas fa-check"></i></button><button onclick="rejectReview(\${r.id})" class="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"><i class="fas fa-times"></i></button>\`:''}\
            <button onclick="editReview(\${r.id},\${r.rating},'\${r.review_title.replace(/'/g,"\\\\'")}','\${r.review_summary.replace(/'/g,"\\\\'")}','\${r.agent_name}')" class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"><i class="fas fa-edit"></i></button>
            <button onclick="deleteReview(\${r.id})" class="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"><i class="fas fa-trash"></i></button>
          </div></td>
        </tr>
      \`).join('');
      
      renderPagination(res.data.data.pagination);
    }
  }catch(err){
    console.error('Error loading reviews:',err);
    showToast('Failed to load reviews','error');
  }
}

function renderPagination(p){
  const div=document.getElementById('pagination');
  if(p.pages<=1){div.innerHTML='';return;}
  let html='<div class="flex gap-2">';
  if(p.page>1)html+=\`<button onclick="loadReviews(\${p.page-1})" class="px-4 py-2 border rounded-lg hover:bg-gray-100">Previous</button>\`;
  html+=\`<span class="px-4 py-2">Page \${p.page} of \${p.pages}</span>\`;
  if(p.page<p.pages)html+=\`<button onclick="loadReviews(\${p.page+1})" class="px-4 py-2 border rounded-lg hover:bg-gray-100">Next</button>\`;
  html+='</div>';
  div.innerHTML=html;
}

async function approveReview(id){
  if(!confirm('Approve this review?'))return;
  try{
    await axios.put(\`\${API_BASE}/admin/reviews/\${id}/approve\`);
    showToast('Review approved!','success');
    loadReviews(currentPage);
    loadStats();
  }catch(err){
    showToast('Failed to approve review','error');
  }
}

async function rejectReview(id){
  if(!confirm('Reject this review?'))return;
  try{
    await axios.put(\`\${API_BASE}/admin/reviews/\${id}/reject\`);
    showToast('Review rejected','success');
    loadReviews(currentPage);
    loadStats();
  }catch(err){
    showToast('Failed to reject review','error');
  }
}

function editReview(id,rating,title,summary,agentName){
  currentEditId=id;
  document.getElementById('edit-rating').value=rating;
  document.getElementById('edit-title').value=title;
  document.getElementById('edit-summary').value=summary;
  updateCharCount();
  document.getElementById('edit-modal').classList.remove('hidden');
  document.getElementById('edit-modal').classList.add('flex');
}

function closeEditModal(){
  document.getElementById('edit-modal').classList.add('hidden');
  document.getElementById('edit-modal').classList.remove('flex');
}

async function saveReviewEdit(){
  const rating=document.getElementById('edit-rating').value;
  const title=document.getElementById('edit-title').value;
  const summary=document.getElementById('edit-summary').value;
  
  if(!title||!summary){
    showToast('All fields are required','error');
    return;
  }
  
  try{
    await axios.put(\`\${API_BASE}/admin/reviews/\${currentEditId}\`,{rating:parseInt(rating),review_title:title,review_summary:summary});
    showToast('Review updated!','success');
    closeEditModal();
    loadReviews(currentPage);
  }catch(err){
    showToast('Failed to update review','error');
  }
}

async function deleteReview(id){
  if(!confirm('Delete this review permanently?'))return;
  try{
    await axios.delete(\`\${API_BASE}/admin/reviews/\${id}\`);
    showToast('Review deleted','success');
    loadReviews(currentPage);
    loadStats();
  }catch(err){
    showToast('Failed to delete review','error');
  }
}

function updateCharCount(){
  const summary=document.getElementById('edit-summary').value;
  document.getElementById('char-count').textContent=summary.length;
}

document.getElementById('edit-summary').addEventListener('input',updateCharCount);

function showToast(msg,type){
  const t=document.createElement('div');
  t.className=\`fixed top-4 right-4 px-6 py-3 rounded-lg text-white z-50 \${type==='success'?'bg-green-600':'bg-red-600'}\`;
  t.textContent=msg;
  document.body.appendChild(t);
  setTimeout(()=>t.remove(),3000);
}

loadStats();
loadReviews();
</script>
${getFooter()}
</body>
</html>
  `;
};
