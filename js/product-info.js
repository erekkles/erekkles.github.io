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
const PRODUCT_ID = localStorage.getItem('productID');

let original_stars_markup = ['<span class="fa fa-star"></span>', '<span class="fa fa-star"></span>', '<span class="fa fa-star"></span>', '<span class="fa fa-star"></span>', '<span class="fa fa-star"></span>']

const { data: PRODUCT_INFO } = await getJSONData(`${PRODUCT_INFO_URL}${PRODUCT_ID}${EXT_TYPE}`);
const { data: COMMENTS_INFO } = await getJSONData(`${PRODUCT_INFO_COMMENTS_URL}${PRODUCT_ID}${EXT_TYPE}`);

function showData() { 

    const LOCAL_COMMENTS = JSON.parse(localStorage.getItem(`${PRODUCT_INFO.id}newComments`)) ?? [];
    const CURRENT_COMMENT_LIST = [...COMMENTS_INFO, ...LOCAL_COMMENTS];
    const { images: IMAGES } = PRODUCT_INFO;    

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
}

function createImagesHtml(image) {
    const IMG_DIV = document.createElement('div');
    const IMG_TAG = document.createElement('img');
    IMG_DIV.classList.add('col-3')
    IMG_TAG.classList.add('img-thumbnail', 'w-100');
    IMG_TAG.src = image;
    IMG_DIV.appendChild(IMG_TAG)
    IMAGES_DIV.appendChild(IMG_DIV)
}

function createCommentHtml(comment) {
    const LI = document.createElement('li');
    const LI_P = document.createElement('p');
    const LI_P_SPAN = document.createElement('span');
    const P_TEXT = document.createTextNode(` - ${comment.dateTime} - `)
    const LI_COMMENT = document.createTextNode(comment.description)

    LI_P_SPAN.textContent = comment.user

    LI_P.classList.add('my-0')
    LI.classList.add('list-group-item');
    LI_P_SPAN.classList.add('fw-bold');

    LI_P.appendChild(LI_P_SPAN);
    LI_P.appendChild(P_TEXT);

    /* Set stars score: Since we have the the markup for the regular (not filled) stars in the local variable 'original_stars_markup', in order to fill the stars based on the score of each 
    ** comment, we create an array that divides all the spans of the string in items of an array and through a for loop we access each span (using as limit of the loop the number of  
        ** comment's stars) and add the class 'checked' corresponding span, which will make the star be filled */
    let new_stars_markup = [];

    for(let i = 0; i < comment.score; i++) {
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

SEND_BUTTON.addEventListener('click', submitNewComment)

// First render
showData();