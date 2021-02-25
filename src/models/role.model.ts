
export class Role {
    id: number = 0;
    name: string = ''
    constructor(data?: any) {
        if (data) {
            this.id = data.id;
            this.name = data.name
        }
    }
}