import type { AssignmentCallbacks } from './Types';

export class Assignment{
    public id: string;
    public title: string;
    public description: string;
    public category: 'ux' | 'dev-frontend' | 'dev-backend';
    public timestamp: string;
    public assignedTo: string | undefined;
    private callbacks: AssignmentCallbacks;
    assignedToName?: string
    public status: 'new' | 'doing' | 'done';
    

    constructor(id: string, title:string, description:string, category:'ux' | 'dev-frontend' | 'dev-backend', timestamp:string, assignedTo: string | undefined, callbacks: AssignmentCallbacks, assignedToName?: string, status: 'new' | 'doing' | 'done' = 'new'){
        this.id = id;
        this.title = title;
        this.description = description;
        this.category = category;
        this.timestamp = timestamp;
        this.assignedTo = assignedTo;
        this.callbacks = callbacks;
        this.assignedToName = assignedToName;
        this.status = status;
        
    }
    renderNewAssignment(buttonsToShow: string[] = []): HTMLElement {
        const assignmentWrapper = document.createElement('div');
        assignmentWrapper.classList.add('assignment');

        const titleH3 = document.createElement('h3');
        titleH3.textContent = this.title;

        const descriptionP = document.createElement('p');
        descriptionP.textContent = this.description;

        const categoryP = document.createElement('p');
        categoryP.textContent = `Category: ${this.category}`;

        const assignedP = document.createElement('p');
        assignedP.textContent = `Assigned to: ${this.assignedToName || 'Unassigned'}`;

        const statusP = document.createElement('p');
        statusP.textContent = `Status: ${this.status}`;

        const timestampP = document.createElement('p');
        timestampP.textContent = `Date: ${this.timestamp.split('T')[0]}`;

        // Lägg till knappar baserat på vilka som ska visas
        if (buttonsToShow.includes('assign')) {
            const assignBtn = document.createElement('button');
            assignBtn.textContent = 'Assign';
            assignBtn.addEventListener('click', () => this.assignAssignment());
            assignmentWrapper.appendChild(assignBtn);
        }
        
        if (buttonsToShow.includes('done')) {
            const doneBtn = document.createElement('button');
            doneBtn.textContent = 'Mark as Done';
            doneBtn.addEventListener('click', () => this.updateStatus('done'));
            assignmentWrapper.appendChild(doneBtn);
        }
        
        if (buttonsToShow.includes('delete')) {
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', () => this.deleteAssignment());
            assignmentWrapper.appendChild(deleteBtn);
        }

        assignmentWrapper.append(titleH3, descriptionP, categoryP, statusP, assignedP, timestampP);

        return assignmentWrapper;
    }

    // Metoder för åtgärder
    assignAssignment() {
        this.callbacks.onAssign(this.id, this.category);
    }

    updateStatus(newStatus: string) {
        this.callbacks.onUpdateStatus(this.id, newStatus);
    }

    deleteAssignment() {
        this.callbacks.onDelete(this.id);
    }
}