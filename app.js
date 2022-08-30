fetch('products.json')
    // act on the response
    .then(response => {
        if (!response.ok) {
            throw new Error(`Http problem: ${response.status}`);
        }
        return response.json();
    })
    // act on the json
    .then(json => initialise(json))
    // act on the error
    .catch(err => console.error(`Fetch problem: ${err.message}`));
    

function initialise(products) {
    
    // get the UI elements
    const category = document.querySelector('#category');
    const searchTerm = document.querySelector('#searchTerm');
    const filterBtn = document.querySelector('#filter-products');
    const displayMain = document.querySelector('#display-products');

    // store the last category and no search has been made
    let lastCategory = category.value;
    let lastSearch = '';

    // create variables to filtering by category, and products to be displayed
    // after searching by category 
    let categoryGroup;
    let finalGroup;

    // set to display all products
    finalGroup = products;
    updateDisplay();

    // set both groups back to empty arrays
    categoryGroup = [];
    finalGroup = [];
 
    // set an event listener for the category search 
    filterBtn.addEventListener('click', selectCategory);

    function selectCategory(e) {
        // prevent the form from submitting
        e.preventDefault();

        // set the groups to empty arrays again
        categoryGroup = [];
        finalGroup = [];

        // check if the current category and search are the same as the
        // the last
        if (category.value === lastCategory && searchTerm.value.trim() === lastSearch) {
            return;
        } else {
            // store the current category and search in their variables
            lastCategory = category.value;
            lastSearch = searchTerm.value.trim();

            // show all the products if the category is all
            if (category.value === 'All') {
                categoryGroup = products;
                selectProducts();
            } else {
                // show the category selected
                const lowerCaseType = category.value.toLowerCase();
                categoryGroup = products.filter(product => product.type === lowerCaseType);
                selectProducts();
            }
        }
    }

    // filter for the search
    function selectProducts() {

        // if no search, don't filter anymore
        if (searchTerm.value.trim() === '') {
            finalGroup = categoryGroup;
        } else {
            // change the search term to lower case
            // and filter it
            const lowerCaseSearchTerm = searchTerm.value.trim().toLowerCase();
            finalGroup = categoryGroup.filter(product => product.name.includes(lowerCaseSearchTerm));
        }
        // update the display
        updateDisplay();
    }

    function updateDisplay() {
        // remove te other display
        while(displayMain.firstChild) {
            displayMain.removeChild(displayMain.firstChild);
        }

        // if no product maches
        if (finalGroup.length === 0) {
            const para = document.createElement('p');
            para.textContent = "No results to display!";
            displayMain.appendChild(para);
        } else {
            // loop through the finalgroup and fetch product
            for (const product of finalGroup) {
                fetchBlob(product);
            }
        }
    }

    // fetch the blob (images)
    function fetchBlob(product) {
        // make the url
        const url = `images/${product.image}`;

        // fetch the product using the blob
        fetch(url)
            // with the response, show error if any
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error: ${response.status}`);
                }
                // with the response, change the response to blob
                return response.blob();
            })
            // with the blob, get each product
            .then(blob => showProduct(blob, product))
            // with the error, get the error
            .catch(err => console.error(`Fetch problem: ${err.message}`));
    }

    function showProduct(blob, product) {
        // create a temporary internal url
        const objectURL = URL.createObjectURL(blob);

        // create section, h2, p, img elements
        const section = document.createElement('section');
        const heading = document.createElement('h2');
        const para = document.createElement('p');
        const image = document.createElement('img');

        // set the attribute of the section
        section.setAttribute('class', product.type);

        // change the h2 name to the product name, and also the capital version
        heading.textContent = product.name.replace(product.name.charAt(0), product.name.charAt(0).toUpperCase());

        // add the price to the paragraph and leave you answer in two decimal places
        para.textContent = `$${product.price.toFixed(2)}`;

        // set the image source to the url, and the alt to the name
        image.src = objectURL;
        image.alt = product.name;

        
        displayMain.appendChild(section);
        section.appendChild(heading);
        section.appendChild(para);
        section.appendChild(image);
    }
}
