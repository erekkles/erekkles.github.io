initialRender();

const product_title = $('#product_name')
const price_div = $('#price');
const description_div = $('#description');
const category_div = $('#category');
const soldCount_div = $('#soldCount');
const images_div = $('#images')
const comments_div = $('#comments_wrapper');
const product_id = localStorage.getItem('productID');
let original_stars_markup = `<span class="fa fa-star"></span>.<span class="fa fa-star"></span>.<span class="fa fa-star"></span>.<span class="fa fa-star"></span>.<span class="fa fa-star"></span>`

// Fetch all the product and comment information
const { data: product_info } = await getJSONData(`${PRODUCT_INFO_URL}${product_id}${EXT_TYPE}`);
const { data: comments_info } = await getJSONData(`${PRODUCT_INFO_COMMENTS_URL}${product_id}${EXT_TYPE}`);

const showData = () => { 

    // Show product-related information
    const { images } = product_info;

    product_title.textContent = product_info.name;
    price_div.textContent = product_info.cost;
    description_div.textContent = product_info.description;
    category_div.textContent = product_info.category;
    soldCount_div.textContent = product_info.soldCount;

    // For each image create markup
    images.forEach((image) => {
        const img_div = document.createElement('div');
        const img_tag = document.createElement('img');
        img_div.classList.add('col-3')
        img_tag.classList.add('img-thumbnail', 'w-100');
        img_tag.src = image;
        img_div.appendChild(img_tag)
        images_div.appendChild(img_div)
    })

    // Show comments
    comments_info.forEach((comment) => {
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
        let stars_markup_array = original_stars_markup.split(".");
        for(let i = 0; i < comment.score; i++) {
            // 13 represents the index of the start of the class' quoatation marks inside the following string: '<span class="fa fa-star">'
            stars_markup_array[i] = stars_markup_array[i].slice(0, 13) + "checked " + stars_markup_array[i].slice(13);
        }

        // Join the now modified stars' markup into a string, then add it to the DOM as adjacent HTML. 
        let new_stars_markup = stars_markup_array.join(" ")

        li_p.insertAdjacentHTML('beforeend', new_stars_markup);

        li.appendChild(li_p);
        li.appendChild(li_comment)

        comments_div.appendChild(li);

    })
}

showData();