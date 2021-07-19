var api_req_headers = {
	'Content-Type': 'application/json',
};
if (window.csrf_token)
	api_req_headers['X-Frappe-CSRF-Token'] = window.csrf_token;

get_cart();

// used to validate all url fetch responses
function validateResponse(res) {
    if(res.ok) return res.json();
    else {
        console.log('an error occured while fetching url')
    }
}

function get_cart(cart) {
    cart_name = get_data('cartName')

    const options = {
		method: 'GET',
		headers: api_req_headers,
	};

    let url = document.location.origin + '/api/resource/Cart/' + cart_name;

    fetch(url, options).then(validateResponse).then(res => {
        cart = res.data;
        show_cart(cart);
    });
}

function show_cart(cart) {
    cart_items = cart.items;
    grand_total = cart.grand_total;

    cart_items_doc = document.getElementById('cart_items');
    cart_items_doc.innerHTML = '';

    cart_items.forEach(cart_item => {
        var cart_item_slip_doc = document.createElement('DIV');
        cart_item_slip_doc.className = 'cart-item-slip';

        const options = {
            method: 'GET',
            headers: api_req_headers,
        };

        let url = document.location.origin + '/api/resource/Item/' + cart_item.item;

        fetch(url, options).then(validateResponse).then(res => {
            item = res.data;
            show_cart_item(item, cart_item.quantity, cart_item.amount, cart_item_slip_doc);
        });

        cart_items_doc.append(cart_item_slip_doc);
    });

    grand_total_element = document.getElementById('total_amount');
    grand_total_element.innerHTML = 'Grand Total: ' + grand_total + ' Rs';
}

function show_cart_item(item, quantity, amount, cart_item_slip_doc) {
    item_image_element = document.createElement('IMG');
    item_image_element.className = 'image';
    item_image_element.src = item.image;

    item_info_element = document.createElement('DIV');
    item_info_element.className = 'item-info';
    item_info_element.innerHTML = "" +
            "<div class='item-name'>" + item.name + "</div>" +
            "<div>" + item.description + "</div>" +
            "<div class='quantity'>" + "Qty: " + quantity + "</div>"

    amount_element = document.createElement('DIV');
    amount_element.className = 'amount';
    amount_element.innerHTML = amount + ' Rs';

    cart_item_slip_doc.append(item_image_element);
    cart_item_slip_doc.append(item_info_element);
    cart_item_slip_doc.append(amount_element);
}

function on_checkout_button_click() {

}

function get_data(key) {
    return $('#data_block').data()[key]
}