/**
 * data-loader.js
 * Fetches portfolio data from data/data.json and dynamically renders
 * the hero, experience, projects, and studies sections.
 */

// ── Helpers ─────────────────────────────────────────────────────────
const MONTH_NAMES = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

/**
 * Converts "2026-01" → "Jan, 2026" or returns "Present" as-is.
 */
function formatDate(dateStr) {
    if (!dateStr || dateStr === 'Present') return 'Present';
    const [year, month] = dateStr.split('-');
    return `${MONTH_NAMES[parseInt(month, 10) - 1]}, ${year}`;
}

/**
 * Escapes HTML entities to prevent XSS when inserting user text.
 */
function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// ── SVG Icon Pool (cycled for project cards) ────────────────────────
const PROJECT_ICONS = [
    // Archive / data box
    `<svg class="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"></path>
    </svg>`,
    // Bar chart
    `<svg class="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"></path>
    </svg>`,
    // Cube / 3D
    `<svg class="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"></path>
    </svg>`,
    // Database
    `<svg class="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"></path>
    </svg>`
];

const GITHUB_ICON_SVG = `<svg class="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.82 1.102.82 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"></path>
</svg>`;

const YOUTUBE_ICON_SVG = `<svg class="w-4 h-4 mr-1.5 text-brand" fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"></path>
</svg>`;

// ── Render Functions ────────────────────────────────────────────────

function renderHero(data) {
    // About text
    const aboutEl = document.getElementById('about-text');
    if (aboutEl && data.about) {
        aboutEl.textContent = data.about;
    }
}

function renderExperience(jobs) {
    const container = document.getElementById('experience-cards');
    if (!container || !jobs) return;

    container.innerHTML = jobs.map(job => {
        const startFormatted = formatDate(job.startDate);
        const endFormatted = formatDate(job.endDate);
        const bullets = job.description
            .map(d => `<li class="flex items-start"><span class="mr-2 text-brand">▹</span> ${escapeHtml(d)}</li>`)
            .join('\n');

        return `
        <div class="w-[80vw] sm:w-[70vw] md:w-[400px] flex-shrink-0 snap-start flex flex-col">
            <div class="w-4 h-4 bg-brand rounded-full border-2 border-[#121212] shadow-sm mb-8"></div>
            <div class="bg-brand-surface/95 backdrop-blur-sm p-6 border border-white/10 rounded-custom shadow-sm 
                        h-[500px] md:h-[420px] flex flex-col overflow-y-auto">
                <div class="flex flex-col mb-4">
                    <span class="text-xs font-mono text-brand/60 uppercase tracking-widest mb-1">${escapeHtml(startFormatted)} — ${escapeHtml(endFormatted)}</span>
                    <h3 class="text-lg font-bold text-white">${escapeHtml(job.position)}</h3>
                    <p class="text-sm font-medium text-slate-500">${escapeHtml(job.company)} — ${escapeHtml(job.location)}</p>
                </div>
                <ul class="list-none space-y-2 text-slate-400 text-sm flex-grow">
                    ${bullets}
                </ul>
            </div>
        </div>`;
    }).join('\n');
}

function renderProjects(projects, maxCount = 3) {
    const container = document.getElementById('project-cards');
    if (!container || !projects) return;

    const visibleProjects = projects.slice(0, maxCount);

    container.innerHTML = visibleProjects.map((project, index) => {
        const icon = PROJECT_ICONS[index % PROJECT_ICONS.length];

        const techTags = project.stack
            .map(t => `<span>${escapeHtml(t)}</span>`)
            .join(' ');

        // Build link buttons
        let links = '';
        if (project.youtube) {
            links += `<a class="flex items-center text-xs font-bold text-slate-300 hover:text-brand transition-colors"
                         href="${escapeHtml(project.youtube)}" target="_blank">${YOUTUBE_ICON_SVG} Demo</a>`;
        }
        if (project.github) {
            links += `<a class="flex items-center text-xs font-bold text-slate-300 hover:text-brand transition-colors"
                         href="${escapeHtml(project.github)}" target="_blank">${GITHUB_ICON_SVG} GitHub</a>`;
        }

        return `
        <div class="min-w-[85vw] md:min-w-[400px] h-[520px] md:h-[450px] bg-brand-surface border border-white/10 p-8 rounded-custom shadow-sm hover:shadow-md transition-shadow group flex flex-col snap-start">
            <div class="flex-grow">
                <div class="mb-6 text-brand">${icon}</div>
                <h3 class="academic-title text-xl font-bold mb-3 text-white group-hover:text-brand transition-colors">
                    ${escapeHtml(project.name)}</h3>
                <p class="text-slate-400 text-sm mb-6">${escapeHtml(project.description)}</p>
            </div>
            <div class="flex flex-wrap gap-2 text-[10px] font-mono uppercase tracking-widest text-slate-300 mb-6">
                ${techTags}
            </div>
            <div class="flex items-center space-x-4 border-t border-white/5 pt-4 mt-auto">
                ${links}
            </div>
        </div>`;
    }).join('\n');
}

function renderStudies(studies) {
    if (!studies) return;

    // Core education
    const coreContainer = document.getElementById('core-education-items');
    if (coreContainer && studies['core-education']) {
        coreContainer.innerHTML = studies['core-education'].map(item => `
            <div class="min-w-[300px] border-l-2 border-brand/20 pl-6 snap-start">
                <h4 class="font-bold text-lg text-white mb-1">${escapeHtml(item.title)}</h4>
                <p class="text-brand italic mb-2">${escapeHtml(item.institution)}</p>
                <p class="text-sm text-slate-500">${escapeHtml(item.description)}</p>
            </div>
        `).join('\n');
    }

    // Certifications
    const certContainer = document.getElementById('certification-items');
    if (certContainer && studies.certifications) {
        certContainer.innerHTML = studies.certifications.map(item => `
            <div class="min-w-[280px] border-l-2 border-brand/20 pl-6 snap-start">
                <h4 class="font-bold text-lg text-white mb-1">${escapeHtml(item.title)}</h4>
                <p class="text-brand italic mb-2">${escapeHtml(item.institution)}</p>
                <p class="text-sm text-slate-500">${escapeHtml(item.description)}</p>
            </div>
        `).join('\n');
    }
}

// ── Role Rotation (moved from main.js) ──────────────────────────────

function setupRoleRotation(roles) {
    const roleElement = document.getElementById('role-text');
    if (!roleElement || !roles || roles.length === 0) return;

    let currentIndex = 0;

    function updateRole() {
        roleElement.style.opacity = 0;
        setTimeout(() => {
            currentIndex = (currentIndex + 1) % roles.length;
            roleElement.textContent = roles[currentIndex];
            roleElement.style.opacity = 1;
        }, 200);
    }

    setInterval(updateRole, 2000);
}

// ── Main Entry Point ────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('data/data.json');
        if (!response.ok) throw new Error(`Failed to load data: ${response.status}`);
        const data = await response.json();

        renderHero(data);
        renderExperience(data.jobs);
        renderProjects(data.projects, 3);
        renderStudies(data.studies);
        setupRoleRotation(data.roles);
    } catch (error) {
        console.error('Portfolio data loading failed:', error);
    }
});
