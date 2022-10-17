initialRender();

const CART_PRODUCTS = await getJSONData(CART_INFO_URL + '25801' + EXT_TYPE);

const PRODUCTS_CONTAINER_DIV = $('#products-container'); 
const OPTIONS_FORM = $('#optionsForm');
const USER_ADDED_ARTICLES = JSON.parse(localStorage.getItem('cartItems'));
const SUBTOTAL_P = $('#subtotalPrice');
const DELIVERY_COST_P = $('#deliveryCost');
const TOTAL_COST_P = $('#totalCost');
let deliveryCost;
let subtotal;
let totalCost;

let { articles: articles_information } = CART_PRODUCTS.data;


if(USER_ADDED_ARTICLES) articles_information = [...articles_information, ...USER_ADDED_ARTICLES];

let articles = articles_information.map(function(article) {
  return {
    ...article, 
    totalCost: article.count * article.unitCost
  }
})

articles.forEach((article) => {
    const { id, name, count, unitCost, currency, image, totalCost } = article;

    let htmlToAdd = `
        <tr>
            <th scope="row" style="width:100px;">
              <img src="${image}" alt="${name}" class="w-100">
            </th>
            <td>
              ${name}
            </td>
            <td>
              ${currency} ${unitCost}
            </td>
            <td>
              <input value="${count}" type="number" class="form-control" id="${id}" />
            </td>
            <td>
              <b data-priceOf="${id}">${currency} ${totalCost}</b>
            </td>
        </tr>
    `

    PRODUCTS_CONTAINER_DIV.insertAdjacentHTML('beforeEnd', htmlToAdd)
});

function changeProductPrice(e) {
  e.stopPropagation()

  const { id: PRODUCT_ID, value: NEW_AMOUNT } = e.target;

  if(!NEW_AMOUNT || NEW_AMOUNT <= 0) return e.target.value = 1;

  const PRODUCT_INDEX = articles.findIndex(article => article.id == PRODUCT_ID);

  let product = articles[PRODUCT_INDEX];

  const { unitCost: PRODUCT_PRICE } = product;

  const NEW_PRICE = PRODUCT_PRICE * Number(NEW_AMOUNT);

  product.count = Number(NEW_AMOUNT);
  product.totalCost = NEW_PRICE;

  renderNewProductPrice(NEW_PRICE, PRODUCT_ID)
}

function renderNewProductPrice(new_price, prod_id) {
  const PRICE_CONTAINER = $(`b[data-priceOf='${prod_id}']`);
  
  PRICE_CONTAINER.textContent = `USD ${new_price}`;
}

function renderSubTotalAmount() {
  subtotal = articles.map(article => article.totalCost).reduce((prevCost, currCost) => prevCost + currCost);
  SUBTOTAL_P.textContent = `USD ${subtotal}`
}

function renderDeliveryCost() {
  const SUBTOTAL = articles.map(article => article.totalCost).reduce((prevCost, currCost) => prevCost + currCost);
  const CHECKED_RADIO_VALUE = Array.from(document.querySelectorAll('input[type="radio"][name="delivery"]')).find(radio => radio.checked).id;

  switch(CHECKED_RADIO_VALUE) {
    case "premium":
      deliveryCost = (15 * SUBTOTAL) / 100;
      break;
    case "express":
      deliveryCost = (7 * SUBTOTAL) / 100;
      break;
    case "standard":
      deliveryCost = (5 * SUBTOTAL) / 100;
      break;
  }

  DELIVERY_COST_P.textContent = `USD ${deliveryCost}`
}

function renderTotalCost() {
  totalCost = deliveryCost + subtotal;
  TOTAL_COST_P.textContent = `USD ${totalCost}`
} 


PRODUCTS_CONTAINER_DIV.addEventListener('change', function(e) {
  changeProductPrice(e);
  renderSubTotalAmount();
  renderDeliveryCost();
  renderTotalCost();
})  

OPTIONS_FORM.addEventListener('click', function() {
  renderSubTotalAmount();
  renderDeliveryCost();
  renderTotalCost();
})

// Initial render
renderSubTotalAmount();
renderDeliveryCost();
renderTotalCost();