initialRender();

const catID = window.localStorage.getItem('catID')
const products_retrieved = await getJSONData(`${PRODUCTS_URL}${catID}${EXT_TYPE}`);
const products_html_container = document.getElementById('products_container');
const category_name_span = document.getElementById('category_name');
const min_price_range = document.getElementById('rangeFilterCountMin');
const max_price_range = document.getElementById('rangeFilterCountMax');
const sorting_container = document.getElementById('sorting_container');
// Storage of price-range filtered products to combine with the rest of the filters. 
let sorted_products_by_range = [];

const { products } = products_retrieved.data;

category_name_span.textContent = products_retrieved.data.catName;

function createProductHtml(product_info) {
    /*
     * I do it this way in order to avoid innerHTML and the security flaws associated with it.
    */

    // Create all the elements needed to show one product at catalog
    let li = document.createElement('li');
    let li_img = document.createElement('img');
    let li_div = document.createElement('div');
    let li_div__div = document.createElement('div');
    let li_div__div___h2 = document.createElement('h2');
    let li_div__div___small = document.createElement('small');
    let li_div__p = document.createElement('p');

    // Create all text nodes with that product info
    let h2_text = document.createTextNode(`${product_info.name} - ${product_info.currency} ${product_info.cost}`);
    let small_text = document.createTextNode(`${product_info.soldCount} vendidos`);
    let p_text = document.createTextNode(product_info.description);

    // Add bootstrap classes to the elements
    li.classList.add('d-flex', 'list-group-item', 'list-group-item-action', 'w-100', 'px-3', 'py-2');
    li_img.classList.add('w-25', 'img-thumbnail');
    li_div.classList.add('d-flex', 'flex-column', 'w-75', 'ps-4');
    li_div__div.classList.add('d-flex', 'w-100', 'justify-content-between');

    // Append text nodes to their respective elements
    li_div__div___h2.appendChild(h2_text);
    li_div__div___small.appendChild(small_text);
    li_div__p.appendChild(p_text);

    li_img.src = product_info.image;
    li_img.alt = `${product_info.name} ${product_info.description}`

    // Structure all elements
    li_div__div.appendChild(li_div__div___h2);
    li_div__div.appendChild(li_div__div___small);
    li_div.appendChild(li_div__div);
    li.appendChild(li_img);
    li.appendChild(li_div);
    li_div.appendChild(li_div__p);

    //Append all elements to DOM
    products_html_container.appendChild(li);
}

// Help function
function clearRangeFilter() {
    sorted_products_by_range = [];
    products_html_container.textContent = "";
    sortProducts('SORT_BY_LOWEST_PRICE', products).map(product => createProductHtml(product));
}

// To avoid usage of multiple addEventListeners I take advantage of the stopPropagation method to avoid event bubbling. 
sorting_container.addEventListener('click', function(e) {
    e.stopPropagation();
    
    const sort_criteria = e.target.getAttribute('data-criteria');
    if(!sort_criteria) return;
    if(sort_criteria == 'CLEAR_RANGE_FILTER') return clearRangeFilter();

    let filtered_products = sorted_products_by_range.length > 0 ? sortProducts(sort_criteria, sorted_products_by_range) : sortProducts(sort_criteria, products);

    if(sort_criteria === 'SORT_BY_PRICE_RANGE') sorted_products_by_range = filtered_products;

    products_html_container.textContent = "";
    filtered_products.map((product) => createProductHtml(product))
})

// Sorting function
function sortProducts(criteria, list_of_products) {
    let sorted_products;
    switch(criteria) {
        case 'SORT_BY_PRICE_RANGE':
            if(max_price_range.value < min_price_range.value) return alert('El precio mínimo debe ser menor que el precio máximo');
            sorted_products = list_of_products.filter((product) => product.cost <= max_price_range.value && product.cost >= min_price_range.value);
            break
        case 'SORT_BY_LOWEST_PRICE':
            sorted_products = list_of_products.sort((a, b) => a.cost < b.cost ? -1 : 1)
            break
        case 'SORT_BY_HIGHEST_PRICE':
            sorted_products = list_of_products.sort((a, b) => a.cost < b.cost ? 1 : -1)
            break
        case 'SORT_BY_RELEVANCE':
            sorted_products = list_of_products.sort((a, b) => a.soldCount < b.cost ? -1 : 1)
            break
    }
    return sorted_products;
}

// Initial render
products.map((product, index) => createProductHtml(product))