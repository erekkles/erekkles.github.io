initialRender();

const product_title = $('#product_name');
const price_div = $('#price');
const description_div = $('#description');
const category_div = $('#category');
const soldCount_div = $('#soldCount');
const images_div = $('#images')
const comments_div = $('#comments_wrapper');
const new_comment_field = $('#commentField');
const score_field = $('#scoreField');
const send_button = $('#send_new_message');
const product_id = localStorage.getItem('productID');
let original_stars_markup = ['<span class="fa fa-star"></span>', '<span class="fa fa-star"></span>', '<span class="fa fa-star"></span>', '<span class="fa fa-star"></span>', '<span class="fa fa-star"></span>']

const { data: product_info } = await getJSONData(`${PRODUCT_INFO_URL}${product_id}${EXT_TYPE}`);
const { data: comments_info } = await getJSONData(`${PRODUCT_INFO_COMMENTS_URL}${product_id}${EXT_TYPE}`);

function showData() { 
    
    // Retrieve all the comments and images for this product
    const localComments = JSON.parse(localStorage.getItem(`${product_info.id}newComments`)) ?? [];
    const comment_list = [...comments_info, ...localComments];
    const { images } = product_info;    

    product_title.textContent = product_info.name;
    price_div.textContent = product_info.cost;
    description_div.textContent = product_info.description;
    category_div.textContent = product_info.category;
    soldCount_div.textContent = product_info.soldCount;

    // For each image create markup
    images.forEach((image) => {
        createImagesHtml(image)
    })


    // Show comments
    comment_list.forEach((comment) => {
        createCommentHtml(comment);
    })
}

function createImagesHtml(image) {
    const img_div = document.createElement('div');
    const img_tag = document.createElement('img');
    img_div.classList.add('col-3')
    img_tag.classList.add('img-thumbnail', 'w-100');
    img_tag.src = image;
    img_div.appendChild(img_tag)
    images_div.appendChild(img_div)
}

function createCommentHtml(comment) {
    const li = document.createElement('li');
    const li_p = document.createElement('p');
    const li_p_span = document.createElement('span');
    const p_text = document.createTextNode(` - ${comment.dateTime} - `)
    const li_comment = document.createTextNode(comment.description)

    li_p_span.textContent = comment.user

    li_p.classList.add('my-0')
    li.classList.add('list-group-item');
    li_p_span.classList.add('fw-bold');

    li_p.appendChild(li_p_span);
    li_p.appendChild(p_text);

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

    // Join the now modified stars' markup into a string, then add it to the DOM as adjacent HTML. 

    li_p.insertAdjacentHTML('beforeend', new_stars_markup);

    li.appendChild(li_p);
    li.appendChild(li_comment)

    comments_div.appendChild(li);
}

// Helper function to properly parse the date of the comment
function parseDate(date){
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day} ${hour < 10 ? '0' + hour : hour}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`
}

function submitNewComment() {
    // Get all the information for the new comment
    const product = product_info.id;
    const user = localStorage.getItem('name');
    const { value: description } = new_comment_field;
    const { value: score } = score_field;
    const date = new Date();
    const dateTime = parseDate(date)
    
    // Instantiate new comment
    const new_comment = {product, score, description, user, dateTime };

    // Find previous comments added by user
    const added_comments = JSON.parse(localStorage.getItem(`${product}newComments`));
    
    if(!added_comments) { 
        localStorage.setItem(`${product}newComments`, JSON.stringify([new_comment])); 
        createCommentHtml(new_comment);
        return;
    }
    
    // If there are previous comments, set the localStorage key to the union of previous comments and the new comment. 
    localStorage.setItem(`${product}newComments`, JSON.stringify([...added_comments, new_comment]));

    createCommentHtml(new_comment)
}

send_button.addEventListener('click', submitNewComment)

// First render
showData();