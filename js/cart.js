import Cart from './modules/cartModule.js';

initialRender();
authorizeUser();

const options_form = $('#optionsForm');
const products_table = $('#products-container');

const user_added_articles = JSON.parse(localStorage.getItem('cartItems'));

const myCart = new Cart(
  user_added_articles.map(function(article) {
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
      return true;
    } else {
      modal_warning.classList.remove('d-none');
      modal_warning.classList.add('d-block');
      return false;
    }
  }

  function checkPaymentInputs() {
    const modal_warning = $('#modalWarning')
    const payment_inputs = [$('#cardNumber'), $('#secCode'), $('#dueOn'), $('#accountNumber')].filter((input) => input.disabled == false);

    if(!payment_inputs.some(input => input.value == '')) {
      modal_warning.classList.remove('d-block');
      modal_warning.classList.add('d-none');
      return true;
    } else {
      modal_warning.classList.remove('d-none');
      modal_warning.classList.add('d-block');
      return false;
    }
  }

  function checkDeliveryInputs() {
    const delivery_inputs = [$('#doorNumber'), $('#street'), $('#cornerStreet')];

    return delivery_inputs.every(input => input.value != '');
  }

  function renderProducts() {
    products_table.textContent = '';

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
              <td>
                <button class="btn btn-outline-danger" data-article="${id}">
                  <i class="fas fa-trash-alt" data-article="${id}"></i>
                </button>
              </td>
          </tr>
      `

      products_table.insertAdjacentHTML('beforeEnd', htmlToAdd)
    });    
  }

  function alertOrderPlacedSuccesfully() {
    const success_alert = new bootstrap.Alert($('#alertOrderPlaced'));
    success_alert._element.classList.add('show');
    setTimeout(() => success_alert._element.classList.remove('show'), 3000);
  }

  function alertProductDeleted() {
    const delete_alert = new bootstrap.Alert($('#alertProductDeleted'));
    delete_alert._element.classList.add('show');
    setTimeout(() => delete_alert._element.classList.remove('show'), 3000)
  }

  return {
    renderNewProductPrice,
    renderAllCosts,
    disablePaymentMethod,
    getPaymentMethod,
    isPaymentMethod,
    checkPaymentInputs,
    checkDeliveryInputs,
    renderProducts,
    alertOrderPlacedSuccesfully,
    alertProductDeleted
  }
}

// Handle user interactions

products_table.addEventListener('change', (e) => {
  e.stopPropagation();

  if(e.target.value <= 0) e.target.value = 1;

  const updatedProduct = myCart.updateSingleProductPrice(e.target.id, Number(e.target.value))

  cartRenderer().renderNewProductPrice(updatedProduct.id);
  cartRenderer().renderAllCosts();
}); 

products_table.addEventListener('click', (e) => {
  const article_id = e.target.getAttribute('data-article');

  if(!article_id) return;

  myCart.deleteArticle(article_id);
  cartRenderer().alertProductDeleted();
  cartRenderer().renderAllCosts();
  cartRenderer().renderProducts();
})

$('#deliveryOptions').addEventListener('click', (e) => {
  e.stopPropagation();
  cartRenderer().renderAllCosts();
});

options_form.addEventListener('submit', (e) => {
  e.preventDefault();
  e.stopPropagation();
 
  cartRenderer().renderAllCosts();

  if(cartRenderer().isPaymentMethod() && cartRenderer().checkPaymentInputs() && cartRenderer().checkDeliveryInputs()) {
    cartRenderer().alertOrderPlacedSuccesfully()
  } 
  
  options_form.classList.add('was-validated');
});

$('#modal').addEventListener('click', (e) => {
  e.stopPropagation();
  cartRenderer().disablePaymentMethod();  
  $('#selectedPaymentMethod').textContent = cartRenderer().getPaymentMethod();
})

// Initial render
cartRenderer().renderProducts();
cartRenderer().renderAllCosts();