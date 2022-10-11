initialRender();

const CART_PRODUCTS = await getJSONData(CART_INFO_URL + '25801' + EXT_TYPE);

const PRODUCTS_CONTAINER_DIV = $('#products-container'); 
let { articles } = CART_PRODUCTS.data;
const USER_ADDED_ARTICLES = JSON.parse(localStorage.getItem('cartItems'));

if(USER_ADDED_ARTICLES) articles = [...articles, ...USER_ADDED_ARTICLES];

articles.forEach((article) => {
    const { id, name, count, unitCost, currency, image } = article;

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
              <input value="${count}" type="number" class="form-control" id="${id}", data-price="${unitCost}"/>
            </td>
            <td>
              <b data-priceOf="${id}">${currency} ${(unitCost * count)}</b>
            </td>
        </tr>
    `

    PRODUCTS_CONTAINER_DIV.insertAdjacentHTML('beforeEnd', htmlToAdd)
});

function changeSubTotalPrice(e) {
  e.stopPropagation()

  const { id: PRODUCT_ID, value: NEW_AMOUNT } = e.target;

  if(!NEW_AMOUNT || NEW_AMOUNT <= 0) return e.target.value = 1;

  const PRODUCT_PRICE = Number(e.target.getAttribute('data-price'));

  const PRICE_CONTAINER = $(`b[data-priceOf='${PRODUCT_ID}']`);

  const NEW_PRICE = PRODUCT_PRICE * Number(NEW_AMOUNT);

  PRICE_CONTAINER.textContent = `USD ${NEW_PRICE}`;
}

PRODUCTS_CONTAINER_DIV.addEventListener('change', (e) => changeSubTotalPrice(e))
