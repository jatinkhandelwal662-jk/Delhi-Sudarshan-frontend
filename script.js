// script.js - Gov-AI Dashboard Logic (Final Jatin Code)

// GLOBAL VARIABLE TO TRACK OPEN COMPLAINT
let currentItemIndex = null;

// --- 1. DATASETS ---
let data = [
    { 
        id: "SIG-9021", type: "Water Leakage", loc: "Dwarka Sec-10", status: "Pending", 
        phone: "+91 98765 43210", dept: "Delhi Jal Board (DJB)", 
        img: "https://static.mywebsites360.com/abd167044a4d49a3823ff1bbbce34934/i/be984f7bd6d143aab1bee92b1f665c40/1/4SoifmQp45JMgBnHm9g4L/Leaking.jpg",
        desc: "Huge water leakage near the metro station gate 2. It has been flowing for 4 hours and causing traffic jam."
    },
    { 
        id: "SIG-8902", type: "Street Light", loc: "Vasant Kunj", status: "Solved", 
        phone: "+91 99887 76655", dept: "BSES Rajdhani", 
        img: "https://images.unsplash.com/photo-1566491450091-7e49fb44f2d2?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        desc: "Street lights in Block C are not working for the last 3 nights. It is very dark and unsafe for women."
    },
    { 
        id: "SIG-7721", type: "Deep Pothole", loc: "Ring Road", status: "Pending", 
        phone: "+91 88776 65544", dept: "PWD Delhi", 
        img: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=400",
        desc: "A very deep pothole in the middle of the left lane. Two bikes slipped today morning. Urgent repair needed."
    },
    {   id:"SIG-7144",type:"Illegal Garbage Dump", loc:"Dwarka Sector 3",status:"Pending",
        phone:"+91 98758 76412", dept:"MCD",
        img:"https://images.unsplash.com/photo-1673203300654-d973e8944910?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        desc:"Illegal garbage dumping in dwarka sector 3 causing problem major problems to nearby residents."
    },
    {   id:"SIG-5632", type:"Damaged Road Dividers", loc:"Janakpuri,Near Metro Station", status:"Solved",
        phone:"+91 98563 45442",dept:"PWD Delhi",
        img: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=400",
        desc:"Road divider is damaged in janakpuri causing frequent accidents."
    },
    {   id: "SIG-2904",type: "Contaminated Water Supply",loc: "Seelampur,Street-3",status: "Solved",
        phone: "+91 98223 34456",dept: "Delhi Jal Board (DJB)",
        img: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=400",
        desc: "Tap water is muddy and has a bad smell Which makes it unfit for human usage.Urgent inspection Needed."
    },
    {   id: "SIG-5102",type: "Frequent Power Fluctuations",loc: "Rohini Sector 5",status: "Pending",
        phone: "+91 98456 22337",dept: "BSES Rajdhani",
        img:"https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=400",
        desc: "Voltage is fluctuating multiple times a day causing damage to household appliances."
    },
    {  id: "SIG-3101",type: "Garbage Not Collected",loc: "Daryaganj,Central Book Market",status: "Pending",
       phone: "+91 97654 25678",dept: "MCD",
       img:"https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=400",
       desc: "Garbage has not been collected from the past 3 days. Waste is overflowing onto the road causing foul smell and attracting stray animals."
    },
    {  id: "SIG-4134",type: "Unsafe Temporary Barricades",loc: "ITO Ring Road Stretch",status: "Solved",
       phone: "+91 97654 52233",dept: "PWD Delhi",
       img: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=400",
       desc: "Temporary barricades were placed during repair work. They are unstable and poorly marked, need to replaced with proper signage barricades."  
    },
    {  id: "SIG-1121",type: "Irregular Water Supply Timing",loc: "Saket, Block E",status: "Pending",
       phone: "+91 98134 52123",dept: "Delhi Jal Board (DJB)",
       img: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=400",
       desc: "Water supply timings are highly irregular,making it difficult for residents to collect water and perform basic tasks."
    }
];

// --- 2. LOADER & INITIALIZATION ---
document.addEventListener("DOMContentLoaded", () => {
    
    // STORYTELLING STATUS UPDATES
    const statusText = document.querySelector('.changing-text');
    if (statusText) {
        const states = [
            "RECEIVING CITIZEN CALL...",   
            "TRANSCRIBING AUDIO (HINDI)...", 
            "EXTRACTING LOCATION DATA...",   
            "GENERATING OFFICER REPORT...",  
            "SYSTEM READY."                 
        ];
        
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

    // FAILSAFE REMOVAL
    setTimeout(() => {
        removeLoader();
    }, 4500); 

    // INITIAL RENDER
    renderTable();
    initMainChart();
});

function removeLoader() {
    const loader = document.getElementById('cinematic-loader') || document.getElementById('loader-screen');
    if (loader) {
        loader.classList.add('loader-hidden'); 
        loader.style.opacity = '0'; 
        setTimeout(() => {
            loader.style.display = 'none';
        }, 800);
    }
}

// --- 3. RENDER TABLE ---
function renderTable() {
    const tbody = document.getElementById('tableBody');
    if(!tbody) return;
    tbody.innerHTML = '';

    data.forEach((item, index) => {
        let statusClass = 'st-pending'; 
        if (item.status === 'Solved') statusClass = 'st-solved';     
        if (item.status === 'Rejected') statusClass = 'st-rejected'; 
        if (item.status === 'Approved') statusClass = 'st-approved';

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

// --- 4. OPEN ANALYZE MODAL (UPDATED LOGIC) ---
function openAnalyzeModal(index) {
    currentItemIndex = index;
    const item = data[index];

    // Populate Data
    document.getElementById('m-type').innerText = item.type;
    document.getElementById('m-status').innerText = item.status;
    document.getElementById('m-phone').innerText = item.phone;
    document.getElementById('m-region').innerText = item.loc;
    document.getElementById('m-dept').innerText = item.dept;
    document.getElementById('m-photo').src = item.img;
    document.getElementById('m-desc').innerText = item.desc;
    
    // --- HIDE APPROVE BUTTON ---
    const approveBtn = document.querySelector('.modal-action-btn.primary');
    if(approveBtn) approveBtn.style.display = 'none'; 
    
    // --- SMART REJECT BUTTON LOGIC ---
    const rejectBtn = document.querySelector('.modal-action-btn.danger');
    if(rejectBtn) {
        rejectBtn.style.width = '100%'; 

        if (item.status === 'Solved') {
            // IF SOLVED: Fade button and prevent clicking
            rejectBtn.style.opacity = '0.5';
            rejectBtn.style.cursor = 'not-allowed';
            rejectBtn.innerHTML = '<i class="ri-checkbox-circle-line"></i> Complaint Closed';
            rejectBtn.onclick = function() {
                alert("Complaint closed already");
            };
        } else {
            // IF PENDING: Show bright red button and allow reject
            rejectBtn.style.opacity = '1';
            rejectBtn.style.cursor = 'pointer';
            rejectBtn.innerHTML = '<i class="ri-spam-line"></i> Reject';
            rejectBtn.onclick = function() {
                updateStatus('Rejected');
            };
        }
    }

    // Show Modal
    document.getElementById('analyzeModal').style.display = 'flex';
}

function closeAnalyzeModal() {
    document.getElementById('analyzeModal').style.display = 'none';
}

// --- 5. REJECT LOGIC ---
function updateStatus(action) {
    if (currentItemIndex === null) return;

    if (action === 'Rejected') {
        data[currentItemIndex].status = 'Rejected';
        
        // Simulation Alert
        alert("⚠️ Complaint Marked as SPAM.\n\n🔄 System Update: Caller flagged. AI model is retraining to filter this pattern.");
        
        renderTable();
        closeAnalyzeModal();
    } 
}

// --- 6. TABS & CHARTS ---
function openTab(tabName) {
    document.querySelectorAll('.view').forEach(view => view.classList.remove('active-view'));
    const targetView = document.getElementById(tabName);
    if(targetView) targetView.classList.add('active-view');

    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    
    const clickedBtn = Array.from(document.querySelectorAll('.nav-btn'))
        .find(b => b.onclick && b.onclick.toString().includes(tabName));
    if(clickedBtn) clickedBtn.classList.add('active');

    if (tabName === 'reports') {
        setTimeout(initDeptChart, 100);
    }
}

// CHART 1: MAIN DASHBOARD
function initMainChart() {
    const ctx = document.getElementById('mainChart');
    if(!ctx) return;

    if(window.myMainChart) window.myMainChart.destroy(); 

    window.myMainChart = new Chart(ctx.getContext('2d'), {
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
            scales: { 
                x: { 
                    grid: { display: false },
                    title: {
                        display: true,
                        text: 'Date of Month', 
                        font: { weight: 'bold' }
                    }
                }, 
                y: { 
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Complaints', 
                        font: { weight: 'bold' }
                    }
                } 
            }
        }
    });
}

// CHART 2: DEPARTMENT REPORTS
function initDeptChart() {
    const ctx = document.getElementById('deptChart');
    if(!ctx) return;

    if (window.myDeptChart instanceof Chart) {
        window.myDeptChart.destroy();
    }

    window.myDeptChart = new Chart(ctx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: ['PWD', 'Delhi Jal Board', 'BSES Rajdhani', 'MCD (South)'],
            datasets: [
                {
                    label: 'Received',
                    data: [450, 320, 210, 380], 
                    backgroundColor: '#2563eb', 
                    borderRadius: 6,
                },
                {
                    label: 'Resolved',
                    data: [300, 280, 200, 370], 
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

window.onclick = function(event) {
    const modal = document.getElementById('analyzeModal');
    if (event.target == modal) modal.style.display = "none";
}
