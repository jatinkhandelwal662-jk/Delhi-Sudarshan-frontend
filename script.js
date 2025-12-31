// script.js - Gov-AI Dashboard Logic

// GLOBAL VARIABLE TO TRACK OPEN COMPLAINT
let currentItemIndex = null;

// --- 1. DATASETS ---
let data = [
    { 
        id: "SIG-9021", type: "Water Leakage", loc: "Dwarka Sec-10", status: "Pending", date: "2025-01-01",
        phone: "+91 98765 43210", dept: "Delhi Jal Board (DJB)", 
        img: "https://static.mywebsites360.com/abd167044a4d49a3823ff1bbbce34934/i/be984f7bd6d143aab1bee92b1f665c40/1/4SoifmQp45JMgBnHm9g4L/Leaking.jpg",
        desc: "Huge water leakage near the metro station gate 2. It has been flowing for 4 hours and causing traffic jam."
    },
    { 
        id: "SIG-8902", type: "Street Light", loc: "Vasant Kunj", status: "Solved", date: "2025-10-15",
        phone: "+91 99887 76655", dept: "BSES Rajdhani", 
        img: "https://images.unsplash.com/photo-1566491450091-7e49fb44f2d2?q=80&w=1170&auto=format&fit=crop",
        desc: "Street lights in Block C are not working for the last 3 nights. It is very dark and unsafe for women."
    },
    { 
        id: "SIG-7721", type: "Deep Pothole", loc: "Ring Road", status: "Pending", date: "2025-11-20", // Overdue Trigger
        phone: "+91 88776 65544", dept: "PWD Delhi", 
        img: "", // Missing Photo Trigger
        desc: "A very deep pothole in the middle of the left lane. Two bikes slipped today morning. Urgent repair needed."
    },
    {   id:"SIG-7144",type:"Illegal Garbage Dump", loc:"Dwarka Sector 3",status:"Pending", date: "2025-12-28",
        phone:"+91 98758 76412", dept:"MCD",
        img:"https://images.unsplash.com/photo-1673203300654-d973e8944910?q=80&w=1170&auto=format&fit=crop",
        desc:"Illegal garbage dumping in dwarka sector 3 causing problem major problems to nearby residents."
    },
    {   id:"SIG-5632", type:"Damaged Road Dividers", loc:"Janakpuri", status:"Solved", date: "2025-09-10",
        phone:"+91 98563 45442",dept:"PWD Delhi", img: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=400", desc:"Road divider is damaged."
    },
    {   id: "SIG-2904",type: "Contaminated Water",loc: "Seelampur",status: "Solved", date: "2025-08-05",
        phone: "+91 98223 34456",dept: "Delhi Jal Board", img: "", desc: "Tap water is muddy."
    },
    {   id: "SIG-5102",type: "Power Fluctuations",loc: "Rohini Sec 5",status: "Pending", date: "2025-01-10",
        phone: "+91 98456 22337",dept: "BSES Rajdhani", img:"https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=400", desc: "Voltage is fluctuating."
    },
    {  id: "SIG-3101",type: "Garbage Not Collected",loc: "Daryaganj",status: "Pending", date: "2025-12-29",
       phone: "+91 97654 25678",dept: "MCD", img:"", desc: "Garbage overflowing."
    },
    {  id: "SIG-4134",type: "Unsafe Barricades",loc: "ITO",status: "Solved", date: "2025-07-20",
       phone: "+91 97654 52233",dept: "PWD Delhi", img: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=400", desc: "Temporary barricades unstable."  
    },
    {  id: "SIG-1121",type: "Water Supply Timing",loc: "Saket",status: "Pending", date: "2025-02-15",
       phone: "+91 98134 52123",dept: "DJB", img: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=400", desc: "Water supply timings irregular."
    }
];

// --- 2. LOADER & INIT ---
document.addEventListener("DOMContentLoaded", () => {
    checkOverdue(); 
    
    const statusText = document.querySelector('.changing-text');
    if (statusText) {
        const states = ["RECEIVING CITIZEN CALL...", "TRANSCRIBING AUDIO...", "EXTRACTING LOCATION...", "GENERATING REPORT...", "SYSTEM READY."];
        let step = 0;
        const interval = setInterval(() => {
            if (step < states.length) { statusText.innerText = states[step]; step++; } 
            else { clearInterval(interval); }
        }, 800);
    }
    setTimeout(() => { removeLoader(); }, 4500); 
    renderTable(); 
    initMainChart();
});

function removeLoader() {
    const loader = document.getElementById('loader-screen');
    if (loader) { loader.style.opacity = '0'; setTimeout(() => { loader.style.display = 'none'; }, 800); }
}

// --- 3. OVERDUE LOGIC ---
function checkOverdue() {
    const today = new Date("2025-12-31"); 
    
    data.forEach(item => {
        if(item.date) {
            const complaintDate = new Date(item.date);
            const diffTime = Math.abs(today - complaintDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
            
            if (item.status === 'Pending' && diffDays > 7) {
                item.status = 'Overdue';
            }
        }
    });
}

// --- 4. FILTER & RENDER ---
function filterTable() {
    const filterValue = document.getElementById('statusFilter').value;
    let filteredData = [];
    
    if (filterValue === 'All') {
        filteredData = data;
    } else if (filterValue === 'NoEvidence') {
        filteredData = data.filter(item => !item.img || item.img === "");
    } else {
        filteredData = data.filter(item => item.status === filterValue);
    }
    renderTable(filteredData);
}

function renderTable(dataset) {
    const tbody = document.getElementById('tableBody');
    if(!tbody) return;
    tbody.innerHTML = '';
    const displayData = dataset || data;

    if (displayData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:20px; color:#64748b;">No records found.</td></tr>';
        return;
    }

    displayData.forEach((item) => {
        let statusClass = 'st-pending'; 
        if (item.status === 'Solved') statusClass = 'st-solved';     
        if (item.status === 'Rejected') statusClass = 'st-rejected'; 
        if (item.status === 'Overdue') statusClass = 'st-overdue'; 
        
        let rowClass = "";
        if (item.status === 'Overdue') rowClass = "row-overdue";
        if (!item.img || item.img === "") rowClass += " row-no-photo"; 

        const originalIndex = data.indexOf(item);

        const row = `
            <tr class="${rowClass}">
                <td style="font-family: monospace; color: var(--primary); font-weight:600;">${item.id}</td>
                <td>${item.type}</td>
                <td>${item.loc}</td>
                <td><span class="status-badge ${statusClass}">${item.status}</span></td>
                <td><button class="btn-action" onclick="openAnalyzeModal(${originalIndex})">Analyze</button></td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

// --- 5. MODAL LOGIC (FIXED) ---
function openAnalyzeModal(index) {
    currentItemIndex = index;
    const item = data[index];

    if(document.getElementById('m-type')) document.getElementById('m-type').innerText = item.type;
    if(document.getElementById('m-status')) document.getElementById('m-status').innerText = item.status;
    if(document.getElementById('m-phone')) document.getElementById('m-phone').innerText = item.phone;
    if(document.getElementById('m-region')) document.getElementById('m-region').innerText = item.loc;
    if(document.getElementById('m-dept')) document.getElementById('m-dept').innerText = item.dept;
    if(document.getElementById('m-desc')) document.getElementById('m-desc').innerText = item.desc;
    
    // SAFETY CHECK: Only set Date if HTML element exists
    const dateElem = document.getElementById('m-date');
    if (dateElem) {
        dateElem.innerText = item.date || "N/A";
    }
    
    const imgElem = document.getElementById('m-photo');
    if (imgElem) {
        if (!item.img || item.img === "") {
            imgElem.style.display = 'none'; 
        } else {
            imgElem.style.display = 'block';
            imgElem.src = item.img;
        }
    }
    
    const approveBtn = document.querySelector('.modal-action-btn.primary');
    if(approveBtn) approveBtn.style.display = 'none'; 
    
    const rejectBtn = document.querySelector('.modal-action-btn.danger');
    if(rejectBtn) {
        rejectBtn.style.width = '100%'; 
        rejectBtn.style.opacity = '1';
        rejectBtn.style.cursor = 'pointer';

        if (item.status === 'Solved') {
            rejectBtn.style.opacity = '0.5'; rejectBtn.style.cursor = 'not-allowed';
            rejectBtn.innerHTML = '<i class="ri-checkbox-circle-line"></i> Complaint Closed';
            rejectBtn.onclick = function() { alert("Complaint closed already"); };
        } else if (item.status === 'Rejected') {
            rejectBtn.style.opacity = '0.5'; rejectBtn.style.cursor = 'not-allowed';
            rejectBtn.innerHTML = '<i class="ri-spam-line"></i> Already Rejected';
            rejectBtn.onclick = function() { alert("Complaint already marked as Rejected."); };
        } else {
            rejectBtn.innerHTML = '<i class="ri-spam-line"></i> Reject';
            rejectBtn.onclick = function() { updateStatus('Rejected'); };
        }
    }
    document.getElementById('analyzeModal').style.display = 'flex';
}

function closeAnalyzeModal() { document.getElementById('analyzeModal').style.display = 'none'; }

function updateStatus(action) {
    if (currentItemIndex === null) return;
    if (action === 'Rejected') {
        data[currentItemIndex].status = 'Rejected';
        alert("⚠️ Complaint Marked as Spam.\n\n🔄 System Update: Caller flagged. AI model is retraining to filter this pattern.");
        filterTable(); 
        closeAnalyzeModal();
    } 
}

// --- 6. CHARTS ---
function openTab(tabName) {
    document.querySelectorAll('.view').forEach(view => view.classList.remove('active-view'));
    const targetView = document.getElementById(tabName);
    if(targetView) targetView.classList.add('active-view');
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    const clickedBtn = Array.from(document.querySelectorAll('.nav-btn')).find(b => b.onclick && b.onclick.toString().includes(tabName));
    if(clickedBtn) clickedBtn.classList.add('active');
    if (tabName === 'reports') { setTimeout(initDeptChart, 100); }
}

function initMainChart() {
    const ctx = document.getElementById('mainChart');
    if(!ctx) return;
    if(window.myMainChart) window.myMainChart.destroy(); 
    window.myMainChart = new Chart(ctx.getContext('2d'), {
        type: 'line',
        data: {
            labels: ['1st', '5th', '10th', '15th', '20th', '25th', '30th'],
            datasets: [{ label: 'Received', data: [120, 150, 180, 210, 190, 240, 280], borderColor: '#2563eb', backgroundColor: 'rgba(37, 99, 235, 0.1)', borderWidth: 3, tension: 0.4, fill: true },
                       { label: 'Solved', data: [100, 130, 160, 200, 180, 220, 260], borderColor: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderWidth: 3, tension: 0.4, fill: true }]
        },
        options: { responsive: true, maintainAspectRatio: false, scales: { x: { grid: { display: false }, title: { display: true, text: 'Date of Month', font: { weight: 'bold' } } }, y: { beginAtZero: true, title: { display: true, text: 'Number of Complaints', font: { weight: 'bold' } } } } }
    });
}

function initDeptChart() {
    const ctx = document.getElementById('deptChart');
    if(!ctx) return;
    if (window.myDeptChart instanceof Chart) window.myDeptChart.destroy();
    window.myDeptChart = new Chart(ctx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: ['PWD', 'Delhi Jal Board', 'BSES Rajdhani', 'MCD (South)'],
            datasets: [{ label: 'Received', data: [450, 320, 210, 380], backgroundColor: '#2563eb', borderRadius: 6 },
                       { label: 'Resolved', data: [300, 280, 200, 370], backgroundColor: '#10b981', borderRadius: 6 }]
        },
        options: { responsive: true, maintainAspectRatio: false, animation: { duration: 1000, easing: 'easeOutQuart' }, scales: { y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } }, x: { grid: { display: false } } } }
    });
}

window.onclick = function(event) {
    const modal = document.getElementById('analyzeModal');
    if (event.target == modal) modal.style.display = "none";
}
