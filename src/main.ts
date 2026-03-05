import type { AssignmentCallbacks, Member } from './Types';
import * as api from './api';
import { renderScrumboard, showErrorMessage } from './rendering';
import * as handlers from './handlers';
import { getUserSession, clearUserSession, isAdmin, getCurrentMember } from './auth';

/**
 * Initierar hela appen och laddar data
 */
async function initApp(): Promise<void> {
    // Kontrollera om användaren är inloggad
    const session = getUserSession();
    if (!session) {
        window.location.href = './login.html';
        return;
    }

    try {
        const data = await api.fetchAllData();
        const assignments = api.mapAssignedToNames(data.assignments, data.members);
        
        const callbacks: AssignmentCallbacks = {
            onAssign: (id: string, category: string) => handlers.handleAssignAssignment(id, category, initApp),
            onUpdateStatus: (id: string, status: string) => handlers.handleUpdateStatus(id, status, initApp),
            onDelete: (id: string) => handlers.handleDeleteAssignment(id, initApp)
        };
        
        renderScrumboard(assignments, callbacks, data.members);
        setupUIBasedOnRole(data.members);
        setupLogout();
    } catch (error) {
        console.error('Fel vid initialisering:', error);
        showErrorMessage('Kunde inte ladda data. Kontrollera att backend-servern körs.');
    }
}

/**
 * Ställer in UI baserat på användarens roll
 */
function setupUIBasedOnRole(members: Member[]): void {
    const adminForms = document.getElementById('admin-forms') as HTMLDivElement;
    const logoutBtn = document.getElementById('logout-btn') as HTMLButtonElement;

    if (isAdmin(members)) {
        adminForms.style.display = 'flex';
        handlers.setupFormListeners(initApp);
    } else {
        adminForms.style.display = 'none';
    }

    logoutBtn.style.display = 'block';
    setupUserInfo(members);
}
function setupUserInfo(members: Member[]): void {
    const app = document.getElementById('app') as HTMLDivElement;
    const header = document.getElementById('header') as HTMLDivElement;
    const currentMember = getCurrentMember(members);

    const existingUserInfo = app.querySelector('.user-info-display');
    if (existingUserInfo) {
        existingUserInfo.remove();
    }

    if (!currentMember) return;

    const userInfo = document.createElement('div');
    userInfo.className = 'user-info-display';

    const nameElement = document.createElement('span');
    nameElement.className = 'user-display-name';
    nameElement.textContent = currentMember.name;

    const categoryElement = document.createElement('span');
    categoryElement.className = 'user-category-display';
    categoryElement.textContent = currentMember.category;

    userInfo.appendChild(nameElement);

    if (currentMember.role === 'admin') {
        const roleElement = document.createElement('span');
        roleElement.className = 'user-role-inline';
        roleElement.textContent = 'ADMIN';
        userInfo.appendChild(roleElement);
    }

    userInfo.appendChild(categoryElement);

    app.insertBefore(userInfo, header.nextSibling);
}
function setupLogout(): void {
    const logoutBtn = document.getElementById('logout-btn') as HTMLButtonElement;
    logoutBtn.addEventListener('click', () => {
        clearUserSession();
        window.location.href = './login.html';
    });
}

// Starta appen när sidan laddas
document.addEventListener('DOMContentLoaded', () => {
    initApp();
    // Setup form listeners only if we have data loaded
    // This will be called after initApp completes
});

