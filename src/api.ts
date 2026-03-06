import type { Assignment, Member } from './Types';

const API_BASE_URL = 'http://localhost:3000';

type BackendErrorPayload = {
    message?: string;
};

function extractErrorMessage(error: unknown, fallback: string): string {
    return error instanceof Error ? error.message : fallback;
}

async function parseErrorResponse(response: Response): Promise<string> {
    try {
        const payload = (await response.json()) as BackendErrorPayload;
        if (payload.message && payload.message.trim().length > 0) {
            return payload.message;
        }
    } catch {
        // Ignore parse errors and return fallback below.
    }

    return `HTTP ${response.status}: ${response.statusText || 'Unknown error'}`;
}

async function request(path: string, options?: RequestInit): Promise<Response> {
    let response: Response;

    try {
        response = await fetch(`${API_BASE_URL}${path}`, options);
    } catch (error) {
        throw new Error(extractErrorMessage(error, 'Could not connect to the server'));
    }

    if (!response.ok) {
        throw new Error(await parseErrorResponse(response));
    }

    return response;
}

/**
 * Hämtar alla assignments och members från backend och mappar medlemsnamn
 * @returns Promise med assignments och Members
 */
export async function fetchAllData(): Promise<{ assignments: Assignment[]; members: Member[] }> {
    const response = await request('/data');
    const data: { assignments?: Assignment[]; members?: Member[] } = await response.json();

    if (!Array.isArray(data.assignments) || !Array.isArray(data.members)) {
        throw new Error('Invalid data format from backend');
    }

    return { assignments: data.assignments, members: data.members };
}

/**
 * Mappar assignedTo ID till medlemsnamn
 * @param assignments - Array av assignments
 * @param members - Array av members
 * @returns Assignments med tildelat medlemsnamn
 */
export function mapAssignedToNames(assignments: Assignment[], members: Member[]): Assignment[] {
    const memberMap = new Map<string, string>();
    members.forEach((member: Member) => {
        memberMap.set(member.id, member.name);
    });

    return assignments.map((assignment: Assignment) => ({
        ...assignment,
        assignedToName: assignment.assignedTo ? memberMap.get(assignment.assignedTo) : 'Unassigned'
    }));
}

/**
 * Lägger till en ny medlem
 * @param name - Medlemsnamn
 * @param category - Medlemskategori
 * @param role - Medlemsroll
 * @returns Response från servern
 */
export async function addMember(name: string, category: string, role: string): Promise<Response> {
    return request('/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, category, role })
    });
}

/**
 * Lägger till en ny assignment
 * @param title - Uppgiftens titel
 * @param description - Uppgiftens beskrivning
 * @param category - Uppgiftens kategori
 * @returns Response från servern
 */
export async function addAssignment(title: string, description: string, category: string): Promise<Response> {
    return request('/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, category })
    });
}

/**
 * Tilldelar en assignment till en medlem
 * @param assignmentId - Assignment ID
 * @param memberId - Medlem ID
 * @returns Response från servern
 */
export async function assignToMember(assignmentId: string, memberId: string): Promise<Response> {
    return request(`/assignments/${assignmentId}/assign`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId })
    });
}

/**
 * Uppdaterar en assignments status
 * @param assignmentId - Assignment ID
 * @param status - Ny status
 * @returns Response från servern
 */
export async function updateAssignmentStatus(assignmentId: string, status: string): Promise<Response> {
    return request(`/assignments/${assignmentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
    });
}

/**
 * Tar bort en assignment
 * @param assignmentId - Assignment ID
 * @returns Response från servern
 */
export async function deleteAssignment(assignmentId: string): Promise<Response> {
    return request(`/assignments/${assignmentId}`, {
        method: 'DELETE'
    });
}
