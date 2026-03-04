class Assigment{
    public title: string;
    public description: string;
    public category: 'ux' | 'frontend' | 'backend';
    public timestamp: string;
    public member: undefined | 'Member'

    constructor(title:string, description:string, category:'ux' | 'frontend' | 'backend', timestamp:string, member:undefined | 'Member'){
        this.title = title;
        this.description = description;
        this.category = category;
        this.timestamp = timestamp;
        this.member = member;
    }
}