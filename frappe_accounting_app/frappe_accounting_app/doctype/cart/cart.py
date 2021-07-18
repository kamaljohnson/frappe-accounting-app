# Copyright (c) 2021, Kamal Johnson and contributors
# For license information, please see license.txt

import frappe
from frappe.website.website_generator import WebsiteGenerator
from frappe import _
from frappe_accounting_app.www.home.index import get_session_customer

class Cart(WebsiteGenerator):
	pass

@frappe.whitelist(allow_guest=False)
def add_item_to_cart(item_name):
	"""
	Checks if the session customer has an active cart else creates one.
	creates a cart item entry and adds it the the active cart.
	"""

	customer = get_session_customer(frappe.session.user)

	active_carts = frappe.get_all(
		'Cart',
		filters = {
			'customer': ['=', customer.name],
			'status': ['=', 'Active']
		}
	)
	cart_item_added_flag = False

	if len(active_carts) != 0:
		# create cart item and add it to the active cart.
		active_cart = frappe.get_doc('Cart', active_carts[0].name)

		for cart_item in active_cart.items:
			if cart_item.item == item_name:
				# cart item present in cart. so updating quantity
				cart_item.quantity += 1
				cart_item.save()
				cart_item_added_flag = True
				break;

		if not cart_item_added_flag:
			# cart item not present in cart, so creating new one.
			cart_item = frappe.get_doc({
				'doctype': 'Cart Item',
				'item': item_name,
				'quantity': 1
			})

			active_cart.append('items', cart_item)
			active_cart.save()
			cart_item_added_flag = True
	else:
		cart_item = frappe.get_doc({
			'doctype': 'Cart Item',
			'item': item_name,
			'quantity': 1
		})
		cart = frappe.get_doc({
			'doctype': 'Cart',
			'customer': customer.name,
			'items': [cart_item]
		})
		cart.insert()
		frappe.db.commit()
		cart_item_added_flag = True

	msg = 'Added item to cart' if cart_item_added_flag else 'Could not add item to cart'
	frappe.msgprint(msg=_(msg), alert=True)