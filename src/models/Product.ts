export default class Product {
    private id?: string;
    private categoryId: string;
    private title: string;
    private description: string | null;
    private price: number;
    private image: string | null;
    private available: boolean;
    private active: boolean;

    constructor(
        categoryId: string,
        title: string,
        description: string | null,
        price: number,
        image: string | null,
        available: boolean,
        active: boolean,
        id?: string
    ) {
        this.categoryId = categoryId;
        this.title = title;
        this.description = description;
        this.price = price;
        this.image = image;
        this.available = available;
        this.active = active;

        if (id) {
            this.id = id;
        }
    }

    getId() {
        return this.id;
    }

    getTitle() {
        return this.title;
    }

    getPrice() {
        return this.price;
    }

    isAvailable() {
        return this.available;
    }

    isActive() {
        return this.active;
    }

    markAsAvailable() {
        this.available = true;
    }

    markAsUnavailable() {
        this.available = false;
    }

    activate() {
        this.active = true;
    }

    deactivate() {
        this.active = false;
    }

    // Dados no formato das colunas da tabela "products"
    toDatabase() {
        return {
            category_id: this.categoryId,
            title: this.title,
            description: this.description,
            price: this.price,
            image: this.image,
            available: this.available,
            active: this.active,
        };
    }
}
