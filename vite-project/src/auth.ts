import type { Member } from './Types';

/**
 * Lagrar användarens roll och valda medlem i localStorage
 */
export interface UserSession {
    role: 'admin' | 'member';
    memberId?: string; // Endast för member-roll
}

/**
 * Sparar användarsession i localStorage
 * @param session - Session-objekt att spara
 */
export function saveUserSession(session: UserSession): void {
    localStorage.setItem('scrumboard_session', JSON.stringify(session));
}

/**
 * Hämtar användarsession från localStorage
 * @returns UserSession eller null om ingen session finns
 */
export function getUserSession(): UserSession | null {
    const session = localStorage.getItem('scrumboard_session');
    return session ? JSON.parse(session) : null;
}

/**
 * Rensar användarsession från localStorage
 */
export function clearUserSession(): void {
    localStorage.removeItem('scrumboard_session');
}

/**
 * Kontrollerar om användaren är admin (antingen genom session eller medlemsroll)
 * @param members - Lista av alla medlemmar för att kontrollera medlemsroll
 * @returns true om admin, false annars
 */
export function isAdmin(members?: Member[]): boolean {
    const session = getUserSession();
    if (!session) return false;
    
    // Om session säger admin, eller om den valda medlemmen har admin-roll
    if (session.role === 'admin') return true;
    
    if (session.memberId && members) {
        const member = members.find(m => m.id === session.memberId);
        return member?.role === 'admin';
    }
    
    return false;
}

/**
 * Hämtar den valda medlemmen för member-roll eller admin-medlemmen för admin-roll
 * @param members - Lista av alla medlemmar
 * @returns Member-objekt eller null
 */
export function getCurrentMember(members: Member[]): Member | null {
    const session = getUserSession();
    if (!session) return null;

    if (session.memberId) {
        return members.find(m => m.id === session.memberId) || null;
    }

    if (session.role === 'admin') {
        return members.find(m => m.role === 'admin') || null;
    }

    return null;
}

/**
 * Kontrollerar om en assignment tillhör den nuvarande medlemmen
 * @param assignmentAssignedTo - ID på den som assignment är tilldelad till
 * @returns true om assignment tillhör nuvarande medlem
 */
export function isOwnAssignment(assignmentAssignedTo: string | undefined): boolean {
    const session = getUserSession();
    if (session?.role === 'member' && session.memberId) {
        return assignmentAssignedTo === session.memberId;
    }
    return false;
}

/**
 * Kontrollerar om en assignment är i samma kategori som den nuvarande medlemmen
 * @param assignmentCategory - Kategori på assignment
 * @param members - Lista av medlemmar
 * @returns true om kategorin matchar
 */
export function isSameCategory(assignmentCategory: string, members: Member[]): boolean {
    const currentMember = getCurrentMember(members);
    return currentMember?.category === assignmentCategory;
}