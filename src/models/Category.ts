export default class Category {
    private id?: string;
    private name: string;
    private description: string | null;
    private icon: string | null;
    private displayOrder: number;
    private active: boolean;

    constructor(
        name: string,
        description: string | null,
        icon: string | null,
        displayOrder: number,
        active: boolean,
        id?: string
    ) {
        this.name = name;
        this.description = description;
        this.icon = icon;
        this.displayOrder = displayOrder;
        this.active = active;

        if (id) {
            this.id = id;
        }
    }

    getId() {
        return this.id;
    }

    getName() {
        return this.name;
    }

    isActive() {
        return this.active;
    }

    activate() {
        this.active = true;
    }

    deactivate() {
        this.active = false;
    }

    // Dados no formato das colunas da tabela "categories"
    toDatabase() {
        return {
            name: this.name,
            description: this.description,
            icon: this.icon,
            display_order: this.displayOrder,
            active: this.active,
        };
    }
}
