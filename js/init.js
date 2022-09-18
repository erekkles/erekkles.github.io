const CATEGORIES_URL = "https://japceibal.github.io/emercado-api/cats/cat.json";
const PUBLISH_PRODUCT_URL = "https://japceibal.github.io/emercado-api/sell/publish.json";
const PRODUCTS_URL = "https://japceibal.github.io/emercado-api/cats_products/";
const PRODUCT_INFO_URL = "https://japceibal.github.io/emercado-api/products/";
const PRODUCT_INFO_COMMENTS_URL = "https://japceibal.github.io/emercado-api/products_comments/";
const CART_INFO_URL = "https://japceibal.github.io/emercado-api/user_cart/";
const CART_BUY_URL = "https://japceibal.github.io/emercado-api/cart/buy.json";
const EXT_TYPE = ".json";

const $ = selector => document.querySelector(selector);

const NAVBAR_DROPDOWN = $('.dropdown');

if(NAVBAR_DROPDOWN) {
  NAVBAR_DROPDOWN.addEventListener('click', (e) => {
    e.stopPropagation();
    const ACTION = e.target.getAttribute('data-action');
    
    switch(ACTION) {
      case 'GO_TO_MY_CART':
        window.location.href = `${origin}/cart.html`;
        break;
      case 'GO_TO_MY_PROFILE':
        window.location.href = `${origin}/my-profile.html`;
        break;
      case 'SIGN_OFF':
        revokeSessionCredentials();
        window.location.href = origin;
        break;
      case 'SIGN_IN':
        window.location.href = `${origin}/login.html`
        break;
    }
  })
}

let initialRender = function(){
  const NAME = window.localStorage.getItem('name');
  const DROPDOWN_NAME_DIV = $('#dropdownMenuLink');
  const DROPDOWN_ACTION_LIST = $('#dropdownActionList')

  if(!NAME) {
    const ASK_TO_LOGIN_TEXT = document.createTextNode('Iniciar sesión');
    DROPDOWN_NAME_DIV.appendChild(ASK_TO_LOGIN_TEXT);
    DROPDOWN_NAME_DIV.setAttribute('data-action', 'SIGN_IN');
    DROPDOWN_ACTION_LIST.remove();
  } else {
    const NAME_TEXT = document.createTextNode(NAME);
    
    DROPDOWN_NAME_DIV.appendChild(NAME_TEXT);
  }
}

let revokeSessionCredentials = function() {
  localStorage.removeItem('isLogged');
  localStorage.removeItem('name');
}

let redirectToProductPage = function(id) {
  localStorage.setItem('productID', id);
  window.location.href = `${origin}/product-info.html`
}

let showSpinner = function(){
  $("#spinner-wrapper").style.display = "block";
}

let hideSpinner = function(){
  $("#spinner-wrapper").style.display = "none";
}

let getJSONData = function(url){
    let result = {};
    showSpinner();
    return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }else{
        throw Error(response.statusText);
      }
    })
    .then(function(response) {
          result.status = 'ok';
          result.data = response;
          hideSpinner();
          return result;
    })
    .catch(function(error) {
        result.status = 'error';
        result.data = error;
        hideSpinner();
        return result;
    });
}

