const CATEGORIES_URL = "https://japceibal.github.io/emercado-api/cats/cat.json";
const PUBLISH_PRODUCT_URL = "https://japceibal.github.io/emercado-api/sell/publish.json";
const PRODUCTS_URL = "https://japceibal.github.io/emercado-api/cats_products/";
const PRODUCT_INFO_URL = "https://japceibal.github.io/emercado-api/products/";
const PRODUCT_INFO_COMMENTS_URL = "https://japceibal.github.io/emercado-api/products_comments/";
const CART_INFO_URL = "https://japceibal.github.io/emercado-api/user_cart/";
const CART_BUY_URL = "https://japceibal.github.io/emercado-api/cart/buy.json";
const EXT_TYPE = ".json";

const $ = selector => document.querySelector(selector);

let initialRender = function(){
  const name = window.localStorage.getItem('name')
  if(name) {
    const nav_item = document.querySelectorAll('.nav-item')[3];
    const a_element = document.createElement('a');
    const text = document.createTextNode(name);
    a_element.appendChild(text);
    a_element.classList.add('nav-link')

    nav_item.appendChild(a_element);
  }
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

