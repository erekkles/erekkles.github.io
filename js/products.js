initialRender();
authorizeUser();

const catID = window.localStorage.getItem('catID')
const products_retrieved = await getJSONData(`${PRODUCTS_URL}${catID}${EXT_TYPE}`);
const products_html_container = document.getElementById('products_container');
const category_name_span = document.getElementById('category_name');
const min_price_range = document.getElementById('rangeFilterCountMin');
const max_price_range = document.getElementById('rangeFilterCountMax');
const sorting_container = document.getElementById('sorting_container');
const searchbar = document.getElementById('searchbar');
const { origin } = window.location; 
let sorted_products_by_range = [];

const { products } = products_retrieved.data;

category_name_span.textContent = products_retrieved.data.catName;

products_html_container.addEventListener('click', (e) => {
    e.stopPropagation();   
    redirectToProductPage(e.target.id);
})

function createProductHtml(product_info) {
    let li = document.createElement('li');
    let layer = document.createElement('div');
    let li_img = document.createElement('img');
    let li_div = document.createElement('div');
    let li_div__div = document.createElement('div');
    let li_div__div___h2 = document.createElement('h2');
    let li_div__div___small = document.createElement('small');
    let li_div__p = document.createElement('p');

    let h2_text = document.createTextNode(`${product_info.name} - ${product_info.currency} ${product_info.cost}`);
    let small_text = document.createTextNode(`${product_info.soldCount} vendidos`);
    let p_text = document.createTextNode(product_info.description);

    li.classList.add('d-flex', 'position-relative', 'list-group-item', 'list-group-item-action', 'w-100', 'px-3', 'py-2');
    layer.classList.add('position-absolute', 'w-100', 'h-100', 'top-0', 'start-0')
    li_img.classList.add('w-25', 'img-thumbnail');
    li_div.classList.add('d-flex', 'flex-column', 'w-75', 'ps-4');
    li_div__div.classList.add('d-flex', 'w-100', 'justify-content-between');

    li_div__div___h2.appendChild(h2_text);
    li_div__div___small.appendChild(small_text);
    li_div__p.appendChild(p_text);

    li_img.src = product_info.image;
    li_img.alt = `${product_info.name} ${product_info.description}`
    layer.id = `${product_info.id}`

    li_div__div.appendChild(li_div__div___h2);
    li_div__div.appendChild(li_div__div___small);
    li_div.appendChild(li_div__div);
    li.appendChild(li_img);
    li.appendChild(li_div);
    li.appendChild(layer)
    li_div.appendChild(li_div__p);

    products_html_container.appendChild(li);
}

function clearRangeFilter() {
    sorted_products_by_range = [];
    products_html_container.textContent = "";
    sortProducts('SORT_BY_LOWEST_PRICE', products).forEach(product => createProductHtml(product));
}

sorting_container.addEventListener('click', function(e) {
    e.stopPropagation();
    
    const sort_criteria = e.target.getAttribute('data-criteria');
    if(!sort_criteria) return;
    if(sort_criteria == 'CLEAR_RANGE_FILTER') return clearRangeFilter();

    let filtered_products = sorted_products_by_range.length > 0 ? sortProducts(sort_criteria, sorted_products_by_range) : sortProducts(sort_criteria, products);

    if(filtered_products.length == 0) return;

    // If the sort criteria is by range, save the filtered products in the auxiliar sorted by price-range array to be able to combine filters.
    if(sort_criteria === 'SORT_BY_PRICE_RANGE') sorted_products_by_range = filtered_products;

    products_html_container.textContent = "";
    filtered_products.forEach((product) => createProductHtml(product))
})

searchbar.addEventListener('input', function(e) {
    if(searchbar.value.length <= 0) {
        return sorted_products_by_range.length > 0 ? sorted_products_by_range.forEach((product) => createProductHtml(product)) : products.forEach((product) => createProductHtml(product));
    };

    const sort_criteria = 'SORT_BY_TEXT';
    const text = e.target.value.toLowerCase();

    let filtered_products = sorted_products_by_range.length > 0 ? sortProducts(sort_criteria, sorted_products_by_range, text) : sortProducts(sort_criteria, products, text);

    products_html_container.textContent = "";
    filtered_products.map((product) => createProductHtml(product))
})

function sortProducts(criteria, list_of_products, optional_text_search) {
    let sorted_products;
    switch(criteria) {
        case 'SORT_BY_PRICE_RANGE':
            if(max_price_range.value < min_price_range.value) return alert('El precio mínimo debe ser menor que el precio máximo');
            if(max_price_range.value.length <= 0 || min_price_range.value <= 0) return alert('Los campos están vacios');
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
        case 'SORT_BY_TEXT':
            sorted_products = list_of_products.filter((product) => product.name.toLowerCase().includes(optional_text_search) || product.description.toLowerCase().includes(optional_text_search));
            break
    }
    return sorted_products;
}

// Initial render
products.forEach((product) => createProductHtml(product))