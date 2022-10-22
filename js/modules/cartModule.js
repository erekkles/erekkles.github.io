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

    #saveCart() {
        return localStorage.setItem('cartItems', JSON.stringify(this.articles));
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

        this.#saveCart();

        return this.articles[product_index];
    }

    deleteArticle(product_id) {
        const product_index = this.#findSingleProductIndex(product_id);

        this.articles.splice(product_index, 1);

        this.#saveCart();

        return this.articles;
    }

    updateSubtotalCost() {
        if(this.articles.length <= 0) {
            this.subtotal_cost = 0;
        } else {
            this.subtotal_cost = Math.round(this.articles.map(article => {
                if(article.currency == "UYU") return article.totalCost / 40;
                return article.totalCost;
            }).reduce((prevCost, currCost) => prevCost + currCost));
        }

        this.#saveCart();

        return this.subtotal_cost;
    }

    updateDeliveryCost() {
        if(this.articles.length <= 0) {
            this.delivery_cost = 0;
        } else {
            const selected_delivery = Array.from(document.querySelectorAll('input[type="radio"][name="delivery"]')).find(radio => radio.checked).id;
    
            this.delivery_cost = Math.round((this.delivery_options[selected_delivery] * this.subtotal_cost) / 100);
        }

        this.#saveCart();

        return this.delivery_cost;
    }

    updateTotalCost() {
        if(this.articles.length <= 0) {
            this.total_cost = 0;
        } else {
            this.total_cost = Math.round(this.delivery_cost + this.subtotal_cost);
        }

        this.#saveCart();

        return this.total_cost;
    }

}

export default Cart;