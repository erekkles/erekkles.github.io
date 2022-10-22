initialRender();

const PRODUCT_TITLE = $('#product_name');
const PRICE_DIV = $('#price');
const DESCRIPTION_DIV = $('#description');
const CATEGORY_DIV = $('#category');
const SOLD_COUNT_DIV = $('#soldCount');
const IMAGES_DIV = $('#images')
const COMMENTS_DIV = $('#comments_wrapper');
const NEW_COMMENT_FIELD = $('#commentField');
const SCORE_FIELD = $('#scoreField');
const SEND_BUTTON = $('#send_new_message');
const ADD_TO_CART_BUTTON = $('#addToCartBtn')
const RELATED_PRODUCTS_DIV = $('#relatedProducts')
const PRODUCT_ID = localStorage.getItem('productID');
let itemsInCart = JSON.parse(localStorage.getItem('cartItems'));

let original_stars_markup = ['<span class="fa fa-star"></span>', '<span class="fa fa-star"></span>', '<span class="fa fa-star"></span>', '<span class="fa fa-star"></span>', '<span class="fa fa-star"></span>']

const { data: PRODUCT_INFO } = await getJSONData(`${PRODUCT_INFO_URL}${PRODUCT_ID}${EXT_TYPE}`);
const { data: COMMENTS_INFO } = await getJSONData(`${PRODUCT_INFO_COMMENTS_URL}${PRODUCT_ID}${EXT_TYPE}`);

function showData() { 
    const LOCAL_COMMENTS = JSON.parse(localStorage.getItem(`${PRODUCT_INFO.id}newComments`)) ?? [];
    const CURRENT_COMMENT_LIST = [...COMMENTS_INFO, ...LOCAL_COMMENTS];
    const { images: IMAGES, relatedProducts: RELATED_PRODUCTS } = PRODUCT_INFO;    

    PRODUCT_TITLE.textContent = PRODUCT_INFO.name;
    PRICE_DIV.textContent = PRODUCT_INFO.cost;
    DESCRIPTION_DIV.textContent = PRODUCT_INFO.description;
    CATEGORY_DIV.textContent = PRODUCT_INFO.category;
    SOLD_COUNT_DIV.textContent = PRODUCT_INFO.soldCount;

    IMAGES.forEach((image) => {
        createImagesHtml(image)
    })

    CURRENT_COMMENT_LIST.forEach((comment) => {
        createCommentHtml(comment);
    })

    RELATED_PRODUCTS.forEach((product) => {
        createRelatedProductsHtml(product);
    })
}

function createImagesHtml(image) {
    const CAROUSEL = $('#carousel');
    const IS_CAROUSEL_ACTIVE = $('.active');

    const CAROUSEL_ITEM = document.createElement('div');
    const CAROUSEL_IMG = document.createElement('img');
    
    const IMG_DIV = document.createElement('div');
    const IMG_TAG = document.createElement('img');
    
    if(IS_CAROUSEL_ACTIVE) { 
        CAROUSEL_ITEM.classList.add('carousel-item')
    } else {
        CAROUSEL_ITEM.classList.add('carousel-item', 'active');
    }
    
    CAROUSEL_IMG.classList.add('d-block', 'w-100');
    IMG_DIV.classList.add('col-9')
    IMG_TAG.classList.add('img-thumbnail', 'w-100');
    
    CAROUSEL_IMG.src = image;
    CAROUSEL_IMG.alt = image.slice(4, -4); // This slice returns the relative route of the image without the parent folder (img/) and the extension (.jpg),
    IMG_TAG.src = image;
    
    CAROUSEL_ITEM.appendChild(CAROUSEL_IMG);
    CAROUSEL.appendChild(CAROUSEL_ITEM);

    IMG_DIV.appendChild(IMG_TAG)
    IMAGES_DIV.appendChild(IMG_DIV)
}

function createCommentHtml(comment) {
    const CURRENT_DATE_TIME = comment.CURRENT_DATE_TIME ?? comment.dateTime;
    const DESCRIPTION = comment.DESCRIPTION ?? comment.description;
    const USER = comment.USER ?? comment.user;
    const SCORE = comment.SCORE ?? comment.score;
    

    const LI = document.createElement('li');
    const LI_P = document.createElement('p');
    const LI_P_SPAN = document.createElement('span');
    const P_TEXT = document.createTextNode(` - ${CURRENT_DATE_TIME} - `)
    const LI_COMMENT = document.createTextNode(DESCRIPTION)

    LI_P_SPAN.textContent = USER

    LI_P.classList.add('my-0')
    LI.classList.add('list-group-item');
    LI_P_SPAN.classList.add('fw-bold');

    LI_P.appendChild(LI_P_SPAN);
    LI_P.appendChild(P_TEXT);

    /* Set stars score: Since we have the the markup for the regular (not filled) stars in the local variable 'original_stars_markup', in order to fill the stars based on the score of each 
    ** comment, we create an array that divides all the spans of the string in items of an array and through a for loop we access each span (using as limit of the loop the number of  
        ** comment's stars) and add the class 'checked' corresponding span, which will make the star be filled */
    let new_stars_markup = [];

    for(let i = 0; i < SCORE; i++) {
        // 13 represents the index of the start of the class' quoatation marks inside the following string: '<span class="fa fa-star">'
       new_stars_markup.push(original_stars_markup[i].slice(0, 13) + "checked " + original_stars_markup[i].slice(13));
    }

    for(let i = 0; new_stars_markup.length < 5; i++) {
        new_stars_markup.push(original_stars_markup[0]);
    }

    new_stars_markup = new_stars_markup.join(" ");  

    LI_P.insertAdjacentHTML('beforeend', new_stars_markup);

    LI.appendChild(LI_P);
    LI.appendChild(LI_COMMENT)

    COMMENTS_DIV.appendChild(LI);
}

function parseDate(date){
    const YEAR = date.getFullYear();
    const MONTH = date.getMonth() + 1;
    const DAY = date.getDate();
    const HOUR = date.getHours();
    const MINUTES = date.getMinutes();
    const SECONDS = date.getSeconds();

    return `${YEAR}-${MONTH < 10 ? '0' + MONTH : MONTH}-${DAY < 10 ? '0' + DAY : DAY} ${HOUR < 10 ? '0' + HOUR : HOUR}:${MINUTES < 10 ? '0' + MINUTES : MINUTES}:${SECONDS < 10 ? '0' + SECONDS : SECONDS}`
}

function createRelatedProductsHtml(product) {
    const { name: PRODUCT_NAME, image: PRODUCT_IMG, id: PRODUCT_ID } = product;
    
    const CARD_DIV = document.createElement('div');
    const IMG_TAG = document.createElement('img');
    const CARD_BODY_DIV = document.createElement('div');
    const P_TITLE = document.createElement('p');
    const ID_HOLDER = document.createElement('div');
    const TITLE_TEXT = document.createTextNode(PRODUCT_NAME);

    CARD_DIV.classList.add('card', 'mx-1', 'position-relative');
    IMG_TAG.classList.add('card-img-top');
    CARD_BODY_DIV.classList.add('card-body');
    ID_HOLDER.classList.add('w-100', 'h-100', 'position-absolute', 'top-0');
    P_TITLE.classList.add('card-text');

    ID_HOLDER.id = PRODUCT_ID;
    CARD_DIV.style.width = '18rem';
    IMG_TAG.src = PRODUCT_IMG;
    IMG_TAG.alt = PRODUCT_NAME + ' picture';

    P_TITLE.appendChild(TITLE_TEXT);
    CARD_BODY_DIV.appendChild(P_TITLE);
    CARD_DIV.appendChild(ID_HOLDER);
    CARD_DIV.appendChild(IMG_TAG);
    CARD_DIV.appendChild(CARD_BODY_DIV);

    RELATED_PRODUCTS_DIV.appendChild(CARD_DIV);
}

function submitNewComment() {
    const PRODUCT = PRODUCT_INFO.id;
    const USER = localStorage.getItem('name');
    const { value: DESCRIPTION } = NEW_COMMENT_FIELD;
    const { value: SCORE } = SCORE_FIELD;
    const DATE = new Date();
    const CURRENT_DATE_TIME = parseDate(DATE)
    
    const NEW_COMMENT = {PRODUCT, SCORE, DESCRIPTION, USER, CURRENT_DATE_TIME };

    const PREVIOUSLY_ADDED_COMMENTS = JSON.parse(localStorage.getItem(`${PRODUCT}newComments`));
    
    if(!PREVIOUSLY_ADDED_COMMENTS) { 
        localStorage.setItem(`${PRODUCT}newComments`, JSON.stringify([NEW_COMMENT])); 
        createCommentHtml(NEW_COMMENT);
        return;
    }
    
    localStorage.setItem(`${PRODUCT}newComments`, JSON.stringify([...PREVIOUSLY_ADDED_COMMENTS, NEW_COMMENT]));

    createCommentHtml(NEW_COMMENT)
}

SEND_BUTTON.addEventListener('click', submitNewComment);

ADD_TO_CART_BUTTON.addEventListener('click', () => {
    const CURRENT_ITEM = {
        id: PRODUCT_INFO.id,
        name: PRODUCT_INFO.name,
        count: 1,
        unitCost: PRODUCT_INFO.cost,
        currency: PRODUCT_INFO.currency,
        image: PRODUCT_INFO.images[0]
    }

    const repeated_item_index = itemsInCart.findIndex(item => item.id == CURRENT_ITEM.id);

    if(itemsInCart !== null && repeated_item_index == -1) {
        itemsInCart = [
            ...itemsInCart, 
            CURRENT_ITEM
        ]
    } else if (itemsInCart !== null && repeated_item_index != -1) {
        itemsInCart[repeated_item_index].count += 1;
    }

    localStorage.setItem('cartItems', JSON.stringify(itemsInCart ?? CURRENT_ITEM))
})

RELATED_PRODUCTS_DIV.addEventListener('click', (e) => {
    e.stopPropagation();
    redirectToProductPage(e.target.id);
})

// First render
showData();