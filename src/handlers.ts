import type { Member } from './Types';
import * as api from './api';
import { showErrorMessage, showSuccessMessage } from './rendering';

function getErrorMessage(error: unknown, fallback: string): string {
    return error instanceof Error && error.message ? error.message : fallback;
}

/**
 * Initialiserar alla form-event listeners
 * @param onDataUpdated - Funktion som körs när data uppdateras
 */
export function setupFormListeners(onDataUpdated: () => void): void {
    setupAddMemberForm(onDataUpdated);
    setupAddAssignmentForm(onDataUpdated);
}

/**
 * Sätter upp event listener för lägg till medlem-formuläret
 * @param onDataUpdated - Callback när medlem lagts till
 */
function setupAddMemberForm(onDataUpdated: () => void): void {
    const addMemberForm = document.getElementById('addMemberForm') as HTMLFormElement;
    if (!addMemberForm) {
        return;
    }

    addMemberForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = (document.getElementById('memberName') as HTMLInputElement).value;
        const category = (document.getElementById('memberCategory') as HTMLSelectElement).value;
        const role = (document.getElementById('memberRole') as HTMLSelectElement).value;
        
        try {
            await api.addMember(name, category, role);
            showSuccessMessage(`Member "${name}" added!`);
            addMemberForm.reset();
            onDataUpdated();
        } catch (error) {
            showErrorMessage(getErrorMessage(error, 'Failed to add member'));
        }
    });
}

/**
 * Sätter upp event listener för lägg till uppgift-formuläret
 * @param onDataUpdated - Callback när uppgift lagts till
 */
function setupAddAssignmentForm(onDataUpdated: () => void): void {
    const addAssignmentForm = document.getElementById('addAssignmentForm') as HTMLFormElement;
    if (!addAssignmentForm) {
        return;
    }

    addAssignmentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = (document.getElementById('assignmentTitle') as HTMLInputElement).value;
        const description = (document.getElementById('assignmentDescription') as HTMLTextAreaElement).value;
        const category = (document.getElementById('assignmentCategory') as HTMLSelectElement).value;
        
        try {
            await api.addAssignment(title, description, category);
            showSuccessMessage(`Assignment "${title}" added!`);
            addAssignmentForm.reset();
            onDataUpdated();
        } catch (error) {
            showErrorMessage(getErrorMessage(error, 'Failed to add assignment'));
        }
    });
}

/**
 * Hanterar tilldeling av en assignment till en medlem
 * @param assignmentId - ID på assignment som ska tilldelas
 * @param category - Kategori för filtrering av medlemmar
 * @param onDataUpdated - Callback när tilldeling lyckas
 */
export async function handleAssignAssignment(
    assignmentId: string,
    category: string,
    onDataUpdated: () => void
): Promise<void> {
    try {
        const data = await api.fetchAllData();
        const availableMembers = data.members.filter((member: Member) => member.category === category);
        
        if (availableMembers.length === 0) {
            showErrorMessage('No members available for this category');
            return;
        }
        
        const memberNames = availableMembers.map((member: Member) => member.name).join(', ');
        const selectedName = prompt(
            `Available members (${category}): ${memberNames}\nEnter member name:`
        );
        
        if (!selectedName) return;
        
        const member = availableMembers.find((availableMember: Member) => availableMember.name === selectedName);
        if (!member) {
            showErrorMessage('Member not found');
            return;
        }
        
        await api.assignToMember(assignmentId, member.id);
        showSuccessMessage(`Assigned to ${selectedName}`);
        onDataUpdated();
    } catch (error) {
        showErrorMessage(getErrorMessage(error, 'Failed to assign member'));
    }
}

/**
 * Hanterar uppdatering av assignment-status
 * @param assignmentId - ID på assignment
 * @param status - Ny status
 * @param onDataUpdated - Callback när uppdatering lyckas
 */
export async function handleUpdateStatus(
    assignmentId: string,
    status: string,
    onDataUpdated: () => void
): Promise<void> {
    try {
        await api.updateAssignmentStatus(assignmentId, status);
        showSuccessMessage('Status updated');
        onDataUpdated();
    } catch (error) {
        showErrorMessage(getErrorMessage(error, 'Failed to update status'));
    }
}

/**
 * Hanterar borttagning av en assignment
 * @param assignmentId - ID på assignment som ska tas bort
 * @param onDataUpdated - Callback när borttagning lyckas
 */
export async function handleDeleteAssignment(
    assignmentId: string,
    onDataUpdated: () => void
): Promise<void> {
    if (!confirm('Are you sure you want to delete this assignment?')) {
        return;
    }
    
    try {
        await api.deleteAssignment(assignmentId);
        showSuccessMessage('Assignment deleted');
        onDataUpdated();
    } catch (error) {
        showErrorMessage(getErrorMessage(error, 'Failed to delete assignment'));
    }
}
