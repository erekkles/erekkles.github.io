class Cart {
    constructor(articles) {
        this.articles = articles;
        this.subtotal_cost = articles.map(article => article.totalCost).reduce((prevCost, currCost) => prevCost + currCost);
        this.delivery_cost = (15 * this.subtotal_cost) / 100;
        this.total_cost = this.subtotal_cost + this.delivery_cost;
        this.delivery_options = {
            'premium': 15,
            'express': 7,
            'standard': 5
        }
    }

    #findSingleProductIndex(product_id) {
        return this.articles.findIndex(article => article.id == product_id);
    }
    
    findArticleById(product_id) {
        return this.articles.find(article => article.id == product_id);
    }

    updateSingleProductPrice(product_id, new_qty) {
        const product_index = this.#findSingleProductIndex(product_id);

        // return article without updating
        if(new_qty <= 0) return this.articles[product_index]; 

        this.articles[product_index].count = new_qty;

        this.articles[product_index].totalCost = this.articles[product_index].unitCost * this.articles[product_index].count;

        return this.articles[product_index];
    }

    updateSubtotalCost() {
        this.subtotal_cost = this.articles.map(article => article.totalCost).reduce((prevCost, currCost) => prevCost + currCost);

        return this.subtotal_cost;
    }

    updateDeliveryCost() {
        const selected_delivery = Array.from(document.querySelectorAll('input[type="radio"][name="delivery"]')).find(radio => radio.checked).id;

        this.delivery_cost = (this.delivery_options[selected_delivery] * this.subtotal_cost) / 100;

        return this.delivery_cost;
    }

    updateTotalCost() {
        this.total_cost = this.delivery_cost + this.subtotal_cost;

        return this.total_cost;
    }

}

export default Cart;