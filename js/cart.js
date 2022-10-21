import Cart from './modules/cartModule.js';

initialRender();

const options_form = $('#optionsForm');

const user_added_articles = JSON.parse(localStorage.getItem('cartItems'));
const cart_products = await getJSONData(CART_INFO_URL + '25801' + EXT_TYPE);
let { articles: articles_information } = cart_products.data;

if(user_added_articles) articles_information = [...articles_information, ...user_added_articles];

const myCart = new Cart(
  articles_information.map(function(article) {
    return {
      ...article, 
      totalCost: article.count * article.unitCost
    }
  })
);

// Rendering methods
function cartRenderer() {
  function renderNewProductPrice(product_id) {
    const product = myCart.findArticleById(product_id);
  
    const price_container = $(`b[data-priceOf='${product.id}']`);
    
    price_container.textContent = `${product.currency} ${product.totalCost}`;
  }

  function renderAllCosts() {
    const subtotal_p = $('#subtotalPrice');
    const delivery_cost_p = $('#deliveryCost');
    const total_cost_p = $('#totalCost');
  
    subtotal_p.textContent = `USD ${myCart.updateSubtotalCost()}`
    delivery_cost_p.textContent = `USD ${myCart.updateDeliveryCost()}`
    total_cost_p.textContent = `USD ${myCart.updateTotalCost()}`
  }

  function disablePaymentMethod() {
    const credit_card_checkbox = $('#creditCard');
    const bank_transfer_checkbox = $('#bankTransfer');

    if(!credit_card_checkbox.checked) {
        $('#cardNumber').disabled = true;
        $('#secCode').disabled = true;
        $('#dueOn').disabled = true;
        $('#accountNumber').disabled = false;
    }

    if(!bank_transfer_checkbox.checked) {
      $('#accountNumber').disabled = true;
      $('#cardNumber').disabled = false;
      $('#secCode').disabled = false;
      $('#dueOn').disabled = false;
    }
  }

  function getPaymentMethod() {
    return $('#creditCard').checked ? 'Tarjeta de crédito' : 'Transferencia bancaria';
  }

  function isPaymentMethod() {
    const modal_warning = $('#modalWarning')

    if($('#creditCard').checked || $('#bankTransfer').checked) {
      modal_warning.classList.remove('d-block');
      modal_warning.classList.add('d-none');
    } else {
      modal_warning.classList.remove('d-none');
      modal_warning.classList.add('d-block');
    }
  }

  function checkPaymentInputs() {
    const modal_warning = $('#modalWarning')
    const payment_inputs = [$('#cardNumber'), $('#secCode'), $('#dueOn'), $('#accountNumber')].filter((input) => input.disabled == false);

    if(payment_inputs.some(input => input.value == '')) {
      modal_warning.classList.remove('d-none');
      modal_warning.classList.add('d-block');
    } else {
      modal_warning.classList.remove('d-block');
      modal_warning.classList.add('d-none');
    }
  }

  return {
    renderNewProductPrice,
    renderAllCosts,
    disablePaymentMethod,
    getPaymentMethod,
    isPaymentMethod,
    checkPaymentInputs
  }
}

// Handle user interactions

$('#products-container').addEventListener('change', (e) => {
  e.stopPropagation();

  if(e.target.value <= 0) e.target.value = 1;

  const updatedProduct = myCart.updateSingleProductPrice(e.target.id, Number(e.target.value))

  cartRenderer().renderNewProductPrice(updatedProduct.id);
  cartRenderer().renderAllCosts();
});  

$('#deliveryOptions').addEventListener('click', (e) => {
  e.stopPropagation();
  cartRenderer().renderAllCosts();
});

options_form.addEventListener('submit', (e) => {
  e.preventDefault();
  e.stopPropagation();
 
  cartRenderer().renderAllCosts();
  cartRenderer().isPaymentMethod();
  cartRenderer().checkPaymentInputs();
  options_form.classList.add('was-validated');
});

$('#modal').addEventListener('click', (e) => {
  e.stopPropagation();
  cartRenderer().disablePaymentMethod();  
  $('#selectedPaymentMethod').textContent = cartRenderer().getPaymentMethod();
})

// Initial render
myCart.articles.forEach((article) => {
  const { id, name, count, unitCost, currency, image, totalCost } = article;

  let htmlToAdd = `
      <tr id="product-id-${id}">
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

  $('#products-container').insertAdjacentHTML('beforeEnd', htmlToAdd)
});

cartRenderer().renderAllCosts();