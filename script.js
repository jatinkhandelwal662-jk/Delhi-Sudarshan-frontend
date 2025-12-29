// script.js - Gov-AI Dashboard Logic (Fixed & Failsafe)

// --- 1. ROBUST LOADER LOGIC ---
document.addEventListener("DOMContentLoaded", () => {
    
    // A. Tech Text Animation (Cycles through "Connecting...", "Optimizing...")
    const statusText = document.querySelector('.changing-text');
    if (statusText) {
        const states = ["CONNECTING...", "UPLOADING VOICE...", "OPTIMIZING...", "COMPLETE"];
        let step = 0;
        const interval = setInterval(() => {
            if (step < states.length) {
                statusText.innerText = states[step];
                step++;
            } else {
                clearInterval(interval);
            }
        }, 800);
    }

    // B. Failsafe Loader Removal (Forces open after 4 seconds max)
    setTimeout(() => {
        removeLoader();
    }, 4000); 
});

// Helper function to remove loader smoothly
function removeLoader() {
    const loader = document.getElementById('cinematic-loader'); // Checks for Resn-style loader
    const fallbackLoader = document.getElementById('loader-screen'); // Checks for simple loader
    
    const target = loader || fallbackLoader;

    if (target) {
        target.classList.add('loader-hidden'); // Triggers CSS blur-out
        target.style.opacity = '0'; // Fallback fade
        
        // Completely remove from screen after animation
        setTimeout(() => {
            target.style.display = 'none';
        }, 800);
    }
}


// --- 2. DATASETS (Mock Data) ---
const data = [
    { 
        id: "SIG-9021", type: "Water Leakage", loc: "Dwarka Sec-10", status: "Pending", 
        phone: "+91 98765 43210", dept: "Delhi Jal Board (DJB)", 
        img: "https://images.unsplash.com/photo-1583329007477-ff5d587c638e?w=400",
        desc: "Huge water leakage near the metro station gate 2. It has been flowing for 4 hours and causing traffic jam."
    },
    { 
        id: "SIG-8902", type: "Street Light", loc: "Vasant Kunj", status: "Solved", 
        phone: "+91 99887 76655", dept: "BSES Rajdhani", 
        img: "https://images.unsplash.com/photo-1572508589584-94d7782098d7?w=400",
        desc: "Street lights in Block C are not working for the last 3 nights. It is very dark and unsafe for women."
    },
    { 
        id: "SIG-7721", type: "Deep Pothole", loc: "Ring Road", status: "Pending", 
        phone: "+91 88776 65544", dept: "PWD Delhi", 
        img: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=400",
        desc: "A very deep pothole in the middle of the left lane. Two bikes slipped today morning. Urgent repair needed."
    }
];


// --- 3. INITIALIZATION ---
// Runs immediately to render the table and main graph
renderTable();
initMainChart();


// --- 4. TAB SWITCHING LOGIC (With Chart Fix) ---
function openTab(tabName) {
    // Hide all views
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active-view');
    });
    
    // Show target view
    const targetView = document.getElementById(tabName);
    if(targetView) {
        targetView.classList.add('active-view');
    }

    // Update Sidebar Buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Find clicked button
    const clickedBtn = Array.from(document.querySelectorAll('.nav-btn'))
        .find(b => b.onclick && b.onclick.toString().includes(tabName));
    if(clickedBtn) clickedBtn.classList.add('active');

    // === CRITICAL FIX: Load Department Graph ONLY when tab is visible ===
    if (tabName === 'reports') {
        // Wait 100ms for the div to become visible, then draw chart
        setTimeout(initDeptChart, 100);
    }
}


// --- 5. CHARTS LOGIC ---

// Chart 1: Main Dashboard (Line Chart)
function initMainChart() {
    const ctx = document.getElementById('mainChart');
    if(!ctx) return;

    new Chart(ctx.getContext('2d'), {
        type: 'line',
        data: {
            labels: ['1st', '5th', '10th', '15th', '20th', '25th', '30th'],
            datasets: [
                {
                    label: 'Received',
                    data: [120, 150, 180, 210, 190, 240, 280],
                    borderColor: '#2563eb', backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    borderWidth: 3, tension: 0.4, fill: true
                },
                {
                    label: 'Solved',
                    data: [100, 130, 160, 200, 180, 220, 260],
                    borderColor: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderWidth: 3, tension: 0.4, fill: true
                }
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { position: 'top' } },
            scales: { x: { grid: { display: false } }, y: { beginAtZero: true } }
        }
    });
}

// Chart 2: Department Reports (Bar Chart)
function initDeptChart() {
    const ctx = document.getElementById('deptChart');
    if(!ctx) return;

    // Destroy old chart if it exists to prevent glitches
    if (window.myDeptChart instanceof Chart) {
        window.myDeptChart.destroy();
    }

    window.myDeptChart = new Chart(ctx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: ['PWD (Roads)', 'Delhi Jal Board', 'BSES Power', 'MCD (East)', 'Traffic Police'],
            datasets: [
                {
                    label: 'Received',
                    data: [450, 320, 210, 380, 150],
                    backgroundColor: '#2563eb', 
                    borderRadius: 6,
                },
                {
                    label: 'Resolved',
                    data: [300, 280, 200, 370, 120],
                    backgroundColor: '#10b981', 
                    borderRadius: 6,
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 1000, easing: 'easeOutQuart' },
            plugins: { legend: { position: 'top', align: 'end' } },
            scales: {
                y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
                x: { grid: { display: false } }
            }
        }
    });
}


// --- 6. TABLE & MODAL LOGIC ---
function renderTable() {
    const tbody = document.getElementById('tableBody');
    if(!tbody) return;
    tbody.innerHTML = '';

    data.forEach((item, index) => {
        let statusClass = item.status === 'Pending' ? 'st-pending' : 'st-solved';
        const row = `
            <tr>
                <td style="font-family: monospace; color: var(--primary); font-weight:600;">${item.id}</td>
                <td>${item.type}</td>
                <td>${item.loc}</td>
                <td><span class="status-badge ${statusClass}">${item.status}</span></td>
                <td><button class="btn-action" onclick="openAnalyzeModal(${index})">Analyze</button></td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

function openAnalyzeModal(index) {
    const item = data[index];
    document.getElementById('m-type').innerText = item.type;
    document.getElementById('m-status').innerText = item.status;
    document.getElementById('m-phone').innerText = item.phone;
    document.getElementById('m-region').innerText = item.loc;
    document.getElementById('m-dept').innerText = item.dept;
    document.getElementById('m-photo').src = item.img;
    document.getElementById('m-desc').innerText = item.desc;
    document.getElementById('analyzeModal').style.display = 'flex';
}

function closeAnalyzeModal() {
    document.getElementById('analyzeModal').style.display = 'none';
}

function updateStatus(action) {
    alert(action === 'Rejected' ? "Complaint Rejected (Spam)" : "Complaint Approved & Assigned");
    closeAnalyzeModal();
}

// Close modal on outside click
window.onclick = function(event) {
    const modal = document.getElementById('analyzeModal');
    if (event.target == modal) modal.style.display = "none";
}