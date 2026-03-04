type Assigment = {
    title: string,
    description: string,
    category: 'ux' | 'frontend' | 'backend',
    timestamp: string,
    member: undefined | 'Member' // gör type
}