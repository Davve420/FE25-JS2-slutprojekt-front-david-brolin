import type { Assignment, AssignmentCallbacks, Member } from './Types';
import { Assignment as AssignmentClass } from './Classes';
import { isAdmin, isSameCategory, isOwnAssignment } from './auth';

/**
 * Renderar hela scrumboardet med alla kolumner och assignments
 * @param assignments - Array av assignments att rendera
 * @param callbacks - Callback-funktioner för assignment-åtgärder
 * @param members - Array av medlemmar för roll-logik
 */
export function renderScrumboard(assignments: Assignment[], callbacks: AssignmentCallbacks, members: Member[]): void {
    const board = document.getElementById('scrumboard') as HTMLDivElement;

    // Rensa tidigare innehåll
    board.innerHTML = '';

    // Skapa kolumner för Scrumboard
    const columns = ['new', 'doing', 'done'];
    const columnElements: { [key: string]: HTMLElement } = {};

    columns.forEach(columnName => {
        const column = createColumn(columnName);
        board.appendChild(column);
        columnElements[columnName] = column;
    });

    // Rendera assignments i rätt kolumn baserat på status
    assignments.forEach(assignmentData => {
        const assignment = new AssignmentClass(
            assignmentData.id,
            assignmentData.title,
            assignmentData.description,
            assignmentData.category,
            assignmentData.timestamp,
            assignmentData.assignedTo,
            callbacks,
            assignmentData.assignedToName,
            assignmentData.status
        );
        
        // Bestäm vilka knappar som ska visas baserat på roll och assignment-status
        const buttonsToShow = getButtonsForAssignment(assignmentData, members);
        const card = assignment.renderNewAssignment(buttonsToShow);
        
        // Lägg till highlight för samma kategori (för members)
        if (!isAdmin(members) && isSameCategory(assignmentData.category, members)) {
            card.classList.add('same-category');
        }
        
        const column = columnElements[assignment.status];
        if (column) {
            column.appendChild(card);
        }
    });
}

/**
 * Skapar en kolumn med header
 * @param columnName - Namn på kolumnen (new, doing, done)
 * @returns HTMLElement för kolumnen
 */
function createColumn(columnName: string): HTMLElement {
    const column = document.createElement('div');
    column.classList.add('column');

    // Skapa header-element med bättre namn
    const header = document.createElement('h2');
    header.textContent = getColumnDisplayName(columnName);
    column.appendChild(header);

    return column;
}

/**
 * Hämtar användarvänligt namn för kolumn baserat på status
 * @param columnName - Tekniskt namn (new, doing, done)
 * @returns Användarvänligt namn
 */
function getColumnDisplayName(columnName: string): string {
    const displayNames: { [key: string]: string } = {
        'new': 'new',
        'doing': 'doing',
        'done': 'done'
    };
    return displayNames[columnName] || columnName;
}

/**
 * Bestämmer vilka knappar som ska visas för ett assignment baserat på roll och status
 * @param assignment - Assignment-objekt
 * @param members - Lista av medlemmar
 * @returns Array av knapp-typer att visa
 */
function getButtonsForAssignment(assignment: Assignment, members: Member[]): string[] {
    const buttons: string[] = [];
    
    if (isAdmin(members)) {
        // Admin ser alla knappar
        if (assignment.status === 'new') {
            buttons.push('assign');
        } else if (assignment.status === 'doing') {
            buttons.push('done');
        } else if (assignment.status === 'done') {
            buttons.push('delete');
        }
    } else {
        // Member-logik
        if (assignment.status === 'new' && isSameCategory(assignment.category, members)) {
            buttons.push('assign');
        } else if (assignment.status === 'doing' && isOwnAssignment(assignment.assignedTo)) {
            buttons.push('done');
        }
        // Members kan INTE ta bort från done-kolumnen
    }
    
    return buttons;
}

/**
 * Visar ett success-meddelande för användaren
 * @param message - Meddelande som ska visas
 */
export function showSuccessMessage(message: string): void {
    console.log('✅ Lyckat:', message);
    // TODO: Implementera bättre feedback (toast notifications)
}

/**
 * Visar ett error-meddelande för användaren
 * @param message - Felmeddelande som ska visas
 */
export function showErrorMessage(message: string): void {
    console.error('❌ Fel:', message);
    alert(message); // Temporär lösning, kan bytas mot toast notifications senare
}
