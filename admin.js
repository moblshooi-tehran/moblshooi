const ADMIN_PASSWORD = 'alireza1378';

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const pass = document.getElementById('adminPassword').value;
    if (pass === ADMIN_PASSWORD) {
        sessionStorage.setItem('adminLoggedIn', 'true');
        showAdminPanel();
    } else {
        alert('رمز عبور اشتباه است!');
    }
});

function showAdminPanel() {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
    loadAllData();
}

function logout() {
    sessionStorage.removeItem('adminLoggedIn');
    location.reload();
}

if (sessionStorage.getItem('adminLoggedIn') === 'true') {
    showAdminPanel();
}

function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');
}

function loadAllData() {
    loadOrders();
    loadEmployees();
    loadGalleryAdmin();
    loadReviewsAdmin();
    loadStats();
}

function loadStats() {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const employees = JSON.parse(localStorage.getItem('employees') || '[]');
    const gallery = JSON.parse(localStorage.getItem('gallery') || '[]');
    
    document.getElementById('totalOrders').textContent = orders.length;
    document.getElementById('newOrders').textContent = orders.filter(o => o.status === 'جدید').length;
    document.getElementById('totalEmployees').textContent = employees.length;
    document.getElementById('totalGallery').textContent = gallery.length;
}

function loadOrders() {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const tbody = document.getElementById('ordersTable');
    
    if (orders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;">هنوز سفارشی ثبت نشده</td></tr>';
        return;
    }
    
    tbody.innerHTML = orders.map((o, i) => `
        <tr>
            <td>${o.orderNumber}</td>
            <td>${o.name}</td>
            <td>${o.phone}</td>
            <td>${o.sofaType}</td>
            <td>${o.quantity}</td>
            <td>${o.date}</td>
            <td><span class="status-badge status-${o.status === 'جدید' ? 'new' : 'done'}">${o.status}</span></td>
            <td>
                <select onchange="updateOrderStatus(${i}, this.value)" class="btn-action btn-edit">
                    <option value="جدید" ${o.status === 'جدید' ? 'selected' : ''}>جدید</option>
                    <option value="در حال انجام" ${o.status === 'در حال انجام' ? 'selected' : ''}>در حال انجام</option>
                    <option value="انجام شده" ${o.status === 'انجام شده' ? 'selected' : ''}>انجام شده</option>
                    <option value="لغو شده" ${o.status === 'لغو شده' ? 'selected' : ''}>لغو شده</option>
                </select>
                <button class="btn-action btn-delete-small" onclick="deleteOrder(${i})">حذف</button>
            </td>
        </tr>
    `).join('');
}

function updateOrderStatus(index, status) {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders[index].status = status;
    localStorage.setItem('orders', JSON.stringify(orders));
    loadOrders();
    loadStats();
}

function deleteOrder(index) {
    if (!confirm('آیا مطمئن هستید؟')) return;
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.splice(index, 1);
    localStorage.setItem('orders', JSON.stringify(orders));
    loadOrders();
    loadStats();
}

function loadEmployees() {
    const employees = JSON.parse(localStorage.getItem('employees') || '[]');
    const tbody = document.getElementById('employeesTable');
    
    if (employees.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">هنوز کارمندی ثبت نشده</td></tr>';
        return;
    }
    
    tbody.innerHTML = employees.map((e, i) => `
        <tr>
            <td>${e.name}</td>
            <td>${e.phone}</td>
            <td>${e.role}</td>
            <td><button class="btn-action btn-delete-small" onclick="deleteEmployee(${i})">حذف</button></td>
        </tr>
    `).join('');
}

function addEmployee() {
    const name = document.getElementById('empName').value;
    const phone = document.getElementById('empPhone').value;
    const role = document.getElementById('empRole').value;
    
    if (!name || !phone) {
        alert('نام و تلفن الزامی است');
        return;
    }
    
    const employees = JSON.parse(localStorage.getItem('employees') || '[]');
    employees.push({ name, phone, role });
    localStorage.setItem('employees', JSON.stringify(employees));
    
    document.getElementById('empName').value = '';
    document.getElementById('empPhone').value = '';
    document.getElementById('empRole').value = '';
    
    loadEmployees();
    loadStats();
    alert('✅ کارمند اضافه شد');
}

function deleteEmployee(index) {
    if (!confirm('حذف شود؟')) return;
    const employees = JSON.parse(localStorage.getItem('employees') || '[]');
    employees.splice(index, 1);
    localStorage.setItem('employees', JSON.stringify(employees));
    loadEmployees();
    loadStats();
}

function loadGalleryAdmin() {
    const gallery = JSON.parse(localStorage.getItem('gallery') || '[]');
    const container = document.getElementById('galleryList');
    
    if (gallery.length === 0) {
        container.innerHTML = '<p style="grid-column:1/-1;text-align:center;">هنوز نمونه‌کاری ثبت نشده</p>';
        return;
    }
    
    container.innerHTML = gallery.map((item, i) => `
        <div class="gallery-item">
            <img src="${item.image}" alt="${item.title}" onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'">
            <div class="gallery-item-info">
                <h4>${item.title}</h4>
                <button class="btn-action btn-delete-small" style="width:100%;" onclick="deleteGalleryItem(${i})">حذف</button>
            </div>
        </div>
    `).join('');
}

function addGalleryItem() {
    const title = document.getElementById('galleryTitle').value;
    const image = document.getElementById('galleryImage').value;
    
    if (!title || !image) {
        alert('عنوان و لینک تصویر الزامی است');
        return;
    }
    
    const gallery = JSON.parse(localStorage.getItem('gallery') || '[]');
    gallery.push({ title, image });
    localStorage.setItem('gallery', JSON.stringify(gallery));
    
    document.getElementById('galleryTitle').value = '';
    document.getElementById('galleryImage').value = '';
    
    loadGalleryAdmin();
    loadStats();
    alert('✅ نمونه کار اضافه شد');
}

function deleteGalleryItem(index) {
    if (!confirm('حذف شود؟')) return;
    const gallery = JSON.parse(localStorage.getItem('gallery') || '[]');
    gallery.splice(index, 1);
    localStorage.setItem('gallery', JSON.stringify(gallery));
    loadGalleryAdmin();
    loadStats();
}

function loadReviewsAdmin() {
    const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    const tbody = document.getElementById('reviewsTable');
    
    if (reviews.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">هنوز نظری ثبت نشده</td></tr>';
        return;
    }
    
    tbody.innerHTML = reviews.map((r, i) => `
        <tr>
            <td>${r.name}</td>
            <td>${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</td>
            <td>${r.text}</td>
            <td>${r.date}</td>
            <td><button class="btn-action btn-delete-small" onclick="deleteReview(${i})">حذف</button></td>
        </tr>
    `).join('');
}

function deleteReview(index) {
    if (!confirm('حذف شود؟')) return;
    const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    reviews.splice(index, 1);
    localStorage.setItem('reviews', JSON.stringify(reviews));
    loadReviewsAdmin();
}