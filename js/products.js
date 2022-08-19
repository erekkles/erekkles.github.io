initialRender();

let products_retrieved = await getJSONData(`${PRODUCTS_URL}101${EXT_TYPE}`);
let products_html_container = document.getElementById('products_container');
let category_name_span = document.getElementById('category_name');

const { products } = products_retrieved.data;

category_name_span.textContent = products_retrieved.catName;

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

products.map((product, index) => createProductHtml(product))