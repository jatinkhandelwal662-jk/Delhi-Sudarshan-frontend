// script.js - Gov-AI Dashboard Logic

// GLOBAL VARIABLE TO TRACK OPEN COMPLAINT
let currentItemIndex = null;

// --- 1. DATASETS ---
let data = [
    { 
        id: "SIG-9021", type: "Water Leakage", loc: "Defence Colony", status: "Pending", date: "2025-01-01",
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
        id: "SIG-7721", type: "Deep Pothole", loc: "Okhala NSIC", status: "Pending", date: "2025-11-20", // Overdue Trigger
        phone: "+91 88776 65544", dept: "PWD Delhi", 
        img: "", // Missing Photo Trigger
        desc: "A very deep pothole in the middle of the left lane. Two bikes slipped today morning. Urgent repair needed."
    },
    {   id:"SIG-7144",type:"Illegal Garbage Dump", loc:"Faridabad",status:"Pending", date: "2025-12-28",
        phone:"+91 98758 76412", dept:"MCD",
        img:"https://images.unsplash.com/photo-1673203300654-d973e8944910?q=80&w=1170&auto=format&fit=crop",
        desc:"Illegal garbage dumping in dwarka sector 3 causing problem major problems to nearby residents."
    },
    {   id:"SIG-5632", type:"Damaged Road Dividers", loc:"Janakpuri", status:"Solved", date: "2025-09-10",
        phone:"+91 98563 45442",dept:"PWD Delhi", img: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=400", desc:"Road divider is damaged."
    },
    {   id: "SIG-2904",type: "Contaminated Water",loc: "Govindpuri",status: "Solved", date: "2025-08-05",
        phone: "+91 98223 34456",dept: "Delhi Jal Board", img: "", desc: "Tap water is muddy."
    },
    {   id: "SIG-5102",type: "Power Fluctuations",loc: "CR Park Pocket-4",status: "Pending", date: "2025-01-10",
        phone: "+91 98456 22337",dept: "BSES Rajdhani", img:"https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=400", desc: "Voltage is fluctuating."
    },
    {  id: "SIG-3101",type: "Garbage Not Collected",loc: "CR Parlk Central Park",status: "Pending", date: "2025-12-29",
       phone: "+91 97654 25678",dept: "MCD", img:"", desc: "Garbage overflowing."
    },
    {  id: "SIG-4134",type: "Unsafe Barricades",loc: "ITO",status: "Solved", date: "2025-07-20",
       phone: "+91 97654 52233",dept: "PWD Delhi", img: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=400", desc: "Temporary barricades unstable."  
    },
    {  id: "SIG-1121",type: "Water Supply Timing",loc: "Saket",status: "Pending", date: "2025-02-15",
       phone: "+91 98134 52123",dept: "DJB", img: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=400", desc: "Water supply timings irregular."
    },
    { 
        id: "SIG-9101", type: "Garbage Overflow", loc: "Lajpat Nagar II", status: "Pending", date: "2026-01-01",
        phone: "+91 98991 12233", dept: "MCD", 
        img: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=400", 
        desc: "Dustbin near Central Market is overflowing onto the street."
    },
    { 
        id: "SIG-9102", type: "Dead Animal", loc: "Kalkaji Extension", status: "Solved", date: "2025-12-20",
        phone: "+91 99882 23344", dept: "MCD", 
        img: "", 
        desc: "Dead stray dog causing foul smell near Block K park."
    },
    { 
        id: "SIG-9103", type: "Construction Debris", loc: "Greater Kailash I", status: "Pending", date: "2025-12-30",
        phone: "+91 88771 12233", dept: "MCD", 
        img: "https://images.unsplash.com/photo-1590486803833-1c5c0c9e05c5?w=400", 
        desc: "Illegal dumping of construction waste (malba) on the sidewalk."
    },
    { 
        id: "SIG-9104", type: "Blocked Drain", loc: "South Ext Part 1", status: "Pending", date: "2025-12-28",
        phone: "+91 91234 56789", dept: "MCD", 
        img: "https://images.unsplash.com/photo-1621947081720-86970823b77a?w=400", 
        desc: "Small roadside drain blocked by plastic, water stagnating."
    },
    { 
        id: "SIG-9105", type: "Unswept Roads", loc: "Malviya Nagar", status: "Solved", date: "2025-11-15",
        phone: "+91 99112 23344", dept: "MCD", 
        img: "", 
        desc: "Safai karamchari has not visited Block B for 3 days."
    },
    { 
        id: "SIG-9106", type: "Public Toilet Dirty", loc: "Nehru Place", status: "Pending", date: "2026-01-02",
        phone: "+91 98110 09988", dept: "MCD", 
        img: "https://images.unsplash.com/photo-1584627404289-4e26214300e8?w=400", 
        desc: "Public toilet near electronics market is unusable and dirty."
    },
    { 
        id: "SIG-9107", type: "Illegal Hawker", loc: "Sarojini Nagar", status: "Pending", date: "2025-12-25",
        phone: "+91 77665 54433", dept: "MCD", 
        img: "", 
        desc: "Hawkers blocking the entry to the metro station."
    },
    { 
        id: "SIG-9108", type: "Park Maintenance", loc: "Defence Colony", status: "Solved", date: "2025-10-10",
        phone: "+91 99881 12299", dept: "MCD", 
        img: "https://images.unsplash.com/photo-1558611848-73f7eb4001a1?w=400", 
        desc: "Broken benches and overgrown grass in the C-Block park."
    },

    // --- PWD (Roads & Infrastructure) ---
    { 
        id: "SIG-9201", type: "Deep Pothole", loc: "Outer Ring Road, Chirag Delhi", status: "Pending", date: "2025-12-29",
        phone: "+91 98765 11223", dept: "PWD Delhi", 
        img: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=400", 
        desc: "Massive pothole on the flyover descent, dangerous for bikers."
    },
    { 
        id: "SIG-9202", type: "Broken Footpath", loc: "Hauz Khas", status: "Pending", date: "2025-12-31",
        phone: "+91 98100 22334", dept: "PWD Delhi", 
        img: "https://images.unsplash.com/photo-1596525166418-4e369f064858?w=400", 
        desc: "Tiles missing on the footpath near the market entrance."
    },
    { 
        id: "SIG-9203", type: "Fallen Signboard", loc: "Mehrauli-Badarpur Road", status: "Solved", date: "2025-11-25",
        phone: "+91 99551 12233", dept: "PWD Delhi", 
        img: "", 
        desc: "Direction signboard fell down due to wind."
    },
    { 
        id: "SIG-9204", type: "Waterlogging", loc: "Pul Prahladpur Underpass", status: "Pending", date: "2026-01-01",
        phone: "+91 88223 34455", dept: "PWD Delhi", 
        img: "https://images.unsplash.com/photo-1569254994521-dd685822e519?w=400", 
        desc: "Underpass starting to flood after light rain."
    },
    { 
        id: "SIG-9205", type: "Damaged Divider", loc: "August Kranti Marg", status: "Solved", date: "2025-09-15",
        phone: "+91 97112 23344", dept: "PWD Delhi", 
        img: "https://images.unsplash.com/photo-1625244675765-a89270da6728?w=400", 
        desc: "Car hit the divider, stones scattered on road."
    },
    { 
        id: "SIG-9206", type: "Speed Breaker Issue", loc: "Vasant Vihar", status: "Pending", date: "2025-12-27",
        phone: "+91 98115 56677", dept: "PWD Delhi", 
        img: "", 
        desc: "Unmarked speed breaker causing vehicles to jump."
    },
    { 
        id: "SIG-9207", type: "Manhole Cover Missing", loc: "Saket", status: "Pending", date: "2026-01-02",
        phone: "+91 99900 11223", dept: "PWD Delhi", 
        img: "https://images.unsplash.com/photo-1610444565860-a292d3429399?w=400", 
        desc: "Open manhole in front of PVR Anupam. Very risky."
    },

    // --- BSES Rajdhani (Electricity) ---
    { 
        id: "SIG-9301", type: "Street Light Off", loc: "Green Park", status: "Pending", date: "2025-12-28",
        phone: "+91 98188 77665", dept: "BSES Rajdhani", 
        img: "https://images.unsplash.com/photo-1566491450091-7e49fb44f2d2?w=400", 
        desc: "Entire row of street lights off in R-Block."
    },
    { 
        id: "SIG-9302", type: "Transformer Sparking", loc: "Okhla Phase 3", status: "Pending", date: "2026-01-01",
        phone: "+91 98711 22334", dept: "BSES Rajdhani", 
        img: "https://images.unsplash.com/photo-1497435334941-8c699ee63e03?w=400", 
        desc: "Loud sounds and sparks coming from the roadside transformer."
    },
    { 
        id: "SIG-9303", type: "Power Cut", loc: "Chhatarpur", status: "Solved", date: "2025-12-15",
        phone: "+91 99110 02233", dept: "BSES Rajdhani", 
        img: "", 
        desc: "No electricity for 6 hours in the Enclave area."
    },
    { 
        id: "SIG-9304", type: "Hanging Wires", loc: "Kotla Mubarakpur", status: "Pending", date: "2025-12-26",
        phone: "+91 98112 23344", dept: "BSES Rajdhani", 
        img: "https://images.unsplash.com/photo-1544724569-5f546fd6dd2d?w=400", 
        desc: "Loose electrical wires hanging very low over the street."
    },
    { 
        id: "SIG-9305", type: "Meter Box Open", loc: "Sarita Vihar", status: "Pending", date: "2025-12-30",
        phone: "+91 88001 12233", dept: "BSES Rajdhani", 
        img: "https://images.unsplash.com/photo-1555581292-127f311c977b?w=400", 
        desc: "Main meter box door is broken and accessible to kids."
    },
    { 
        id: "SIG-9306", type: "Voltage Fluctuation", loc: "Khanpur", status: "Solved", date: "2025-08-20",
        phone: "+91 99887 76655", dept: "BSES Rajdhani", 
        img: "", 
        desc: "High voltage surge damaged home appliances."
    },
    { 
        id: "SIG-9307", type: "Pole Bent", loc: "Sangam Vihar", status: "Pending", date: "2026-01-02",
        phone: "+91 98765 43211", dept: "BSES Rajdhani", 
        img: "https://images.unsplash.com/photo-1498625944586-531e84a224f8?w=400", 
        desc: "Electric pole bent after being hit by a truck."
    },

    // --- DJB (Water & Sewerage) ---
    { 
        id: "SIG-9401", type: "Pipeline Burst", loc: "Vasant Kunj Sector A", status: "Pending", date: "2026-01-01",
        phone: "+91 98101 23456", dept: "Delhi Jal Board (DJB)", 
        img: "https://images.unsplash.com/photo-1585664812328-da6248e3e46e?w=400", 
        desc: "Main supply pipe burst, gallons of water wasting."
    },
    { 
        id: "SIG-9402", type: "Dirty Water", loc: "Govindpuri", status: "Solved", date: "2025-12-10",
        phone: "+91 99552 23344", dept: "Delhi Jal Board (DJB)", 
        img: "https://images.unsplash.com/photo-1574706306550-13f5080e227d?w=400", 
        desc: "Tap water is black and smelling like sewage."
    },
    { 
        id: "SIG-9403", type: "No Water Supply", loc: "Safdarjung Enclave", status: "Pending", date: "2026-01-02",
        phone: "+91 98113 34455", dept: "Delhi Jal Board (DJB)", 
        img: "", 
        desc: "No water supply in Block B for the last 48 hours."
    },
    { 
        id: "SIG-9404", type: "Sewer Overflow", loc: "Bhogal", status: "Pending", date: "2025-12-29",
        phone: "+91 88002 23344", dept: "Delhi Jal Board (DJB)", 
        img: "https://images.unsplash.com/photo-1621947081720-86970823b77a?w=400", 
        desc: "Sewer water backflowing into ground floor houses."
    },
    { 
        id: "SIG-9405", type: "Tanker Request", loc: "Neb Sarai", status: "Solved", date: "2025-06-15",
        phone: "+91 99114 45566", dept: "Delhi Jal Board (DJB)", 
        img: "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=400", 
        desc: "Urgent need for water tanker, borewell dried up."
    },
    { 
        id: "SIG-9406", type: "Leakage at Meter", loc: "Jangpura", status: "Pending", date: "2025-12-27",
        phone: "+91 98712 23344", dept: "Delhi Jal Board (DJB)", 
        img: "https://images.unsplash.com/photo-1625126596350-c6c747754f73?w=400", 
        desc: "Water leaking from the connection point near meter."
    },
    { 
        id: "SIG-9407", type: "Low Pressure", loc: "East of Kailash", status: "Pending", date: "2025-12-31",
        phone: "+91 99998 87766", dept: "Delhi Jal Board (DJB)", 
        img: "", 
        desc: "Water pressure is too low to reach overhead tanks."
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
            labels: ['JAN', 'MAR', 'JUN', 'AUG', 'SEPT', 'NOV', 'DEC'],
            datasets: [{ label: 'Received', data: [12000, 15560, 18083, 21043, 19023, 24087, 28021], borderColor: '#2563eb', backgroundColor: 'rgba(37, 99, 235, 0.1)', borderWidth: 3, tension: 0.4, fill: true },
                       { label: 'Solved', data: [10000, 13078, 16008, 20099, 18008, 22056, 26000], borderColor: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderWidth: 3, tension: 0.4, fill: true }]
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
            datasets: [{ label: 'Received', data: [30050, 20765, 21021, 28987], backgroundColor: '#2563eb', borderRadius: 6 },
                       { label: 'Resolved', data: [20654, 15098, 18043, 28407], backgroundColor: '#10b981', borderRadius: 6 }]
        },
        options: { responsive: true, maintainAspectRatio: false, animation: { duration: 1000, easing: 'easeOutQuart' }, scales: { y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } }, x: { grid: { display: false } } } }
    });
}

window.onclick = function(event) {
    const modal = document.getElementById('analyzeModal');
    if (event.target == modal) modal.style.display = "none";
}

// --- 8. NOTIFICATION CENTER LOGIC ---
const notifications = [
    { id: "SIG-8902", msg: "Street Light repaired in Vasant Kunj Block C.", dept: "BSES Rajdhani", time: "10 mins ago", type: "solved" },
    { id: "SIG-5632", msg: "Road Divider reconstruction completed.", dept: "PWD Delhi", time: "1 hr ago", type: "solved" },
    { id: "SYS-ALERT", msg: "High traffic load detected in server.", dept: "System Admin", time: "2 hrs ago", type: "alert" }
];

function renderNotifications() {
    const list = document.getElementById('notifList');
    const badge = document.getElementById('notifCount');
    if(!list) return;

    list.innerHTML = ''; // Clear current list
    badge.innerText = notifications.length; // Update badge count

    notifications.forEach(n => {
        const item = `
            <div class="notif-card ${n.type}">
                <div class="n-top">
                    <span class="n-id">${n.id}</span>
                    <span class="n-time">${n.time}</span>
                </div>
                <p class="n-msg">${n.msg}</p>
                <span class="n-dept"><i class="ri-government-line"></i> ${n.dept}</span>
            </div>
        `;
        list.innerHTML += item;
    });
}

function toggleNotifPanel() {
    const panel = document.getElementById('notifPanel');
    panel.classList.toggle('active');
}

// --- 9. SIMULATE LIVE INCOMING NOTIFICATION ---
// This runs 5 seconds after the page loads to show the "Live" effect
setTimeout(() => {
    addNewNotification(
        "SIG-9021", 
        "✅ Water Leakage Fixed: Maintenance team has resolved the issue at Dwarka Sec-10.", 
        "Delhi Jal Board", 
        "Just Now", 
        "solved"
    );
}, 5000);

function addNewNotification(id, msg, dept, time, type) {
    // Add to top of array
    notifications.unshift({ id, msg, dept, time, type });
    renderNotifications();
    
    // Play a subtle sound or visual cue (Optional)
    const btn = document.querySelector('.notif-toggle-btn');
    btn.style.transform = "scale(1.2)";
    setTimeout(() => btn.style.transform = "scale(1)", 200);
}

// Initial Render
renderNotifications();

