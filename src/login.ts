import * as api from './api';
import { saveUserSession } from './auth';
import type { Member } from './Types';

/**
 * Initierar login-sidan
 */
async function initLogin(): Promise<void> {
    const adminBtn = document.getElementById('admin-login-btn') as HTMLButtonElement;
    const memberBtn = document.getElementById('member-login-btn') as HTMLButtonElement;
    const memberSelection = document.getElementById('member-selection') as HTMLDivElement;
    const memberButtons = document.getElementById('member-buttons') as HTMLDivElement;
    const backBtn = document.getElementById('back-to-login-btn') as HTMLButtonElement;

    let allMembers: Member[] = [];

    // Hämta medlemmar
    try {
        const data = await api.fetchAllData();
        allMembers = data.members;
    } catch (error) {
        console.error('Fel vid hämtning av medlemmar:', error);
    }

    // Admin-knapp - visa endast admin-medlemmar
    adminBtn.addEventListener('click', () => {
        const adminMembers = allMembers.filter(m => m.role === 'admin');
        createMemberButtons(adminMembers, memberButtons, 'admin');
        adminBtn.style.display = 'none';
        memberBtn.style.display = 'none';
        memberSelection.classList.remove('hidden');
        (memberSelection.querySelector('h3') as HTMLElement).textContent = 'Select Admin Member';
    });

    // Member-knapp - visa endast member-medlemmar
    memberBtn.addEventListener('click', () => {
        const memberMembers = allMembers.filter(m => m.role === 'member');
        createMemberButtons(memberMembers, memberButtons, 'member');
        adminBtn.style.display = 'none';
        memberBtn.style.display = 'none';
        memberSelection.classList.remove('hidden');
        (memberSelection.querySelector('h3') as HTMLElement).textContent = 'Select Team Member';
    });

    // Tillbaka-knapp
    backBtn.addEventListener('click', () => {
        memberSelection.classList.add('hidden');
        adminBtn.style.display = 'block';
        memberBtn.style.display = 'block';
    });
}

/**
 * Skapar knappar för varje medlem
 */
function createMemberButtons(members: Member[], container: HTMLDivElement, memberType: 'admin' | 'member' = 'member'): void {
    container.innerHTML = '';
    members.forEach(member => {
        const btn = document.createElement('button');
        btn.className = 'member-btn';
        btn.textContent = `${member.name} (${member.category})`;
        btn.addEventListener('click', () => {
            saveUserSession({ role: memberType, memberId: member.id });
            window.location.href = './index.html';
        });
        container.appendChild(btn);
    });
}

// Starta login när sidan laddas
document.addEventListener('DOMContentLoaded', initLogin);