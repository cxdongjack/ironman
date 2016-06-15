

const orderFilters = [{
  name: "new",
  label: "New"
}, {
  name: "processing",
  label: "Processing"
}, {
  name: "completed",
  label: "Completed"
}];

const OrderHelper =  {
  makeQuery(filter) {
    let query = {};

    if (filter.get('product')) {
      query['items.productId'] = filter.get('product');
    }

    if (filter.get('search')) {
      _.extend(query, filter.get('search'));
    }

    return query;
  }
};

Template.ordersIronman.onCreated(function () {
  this.state = new ReactiveDict();
  this.filter = new ReactiveDict();
  this.state.setDefault({
    orders: [],
    products: []
  });

  // Watch for updates to the subscription and query params
  // fetch available orders
  this.autorun(() => {
    this.subscribe("Orders");
    const filter = 'processing';
    const query = OrderHelper.makeQuery(this.filter);
    console.log('query', query);
    const orders = ReactionCore.Collections.Orders.find(query).fetch();

    this.state.set("orders", orders);
  });

  this.autorun(() => {
    this.subscribe("Products", 3, {});
    const products = ReactionCore.Collections.Products.find().fetch();
    this.state.set('products', products);
  });

});

/**
 * orders helpers
 */
Template.ordersIronman.helpers({
  stringify(order) {
    return JSON.stringify(order);
  },

  orders() {
    return Template.instance().state.get("orders") || false;
  },

  products() {
    return Template.instance().state.get("products") || false;
  },

  activeClassname(productId) {
    if (productId == Template.instance().filter.get('product')) {
      return 'label-success';
    }
    return 'label-default';
  }
} );

Template.ordersIronman.events({
  "click [data-product]": (event, instance) => {
    event.preventDefault();
    const id = event.currentTarget.getAttribute("data-product");
    instance.filter.set("product", id);
  },

  "submit form": (event, instance) => {
    event.preventDefault();
    const val = $('input', event.currentTarget).val();
    instance.filter.set("search", { $or: [ { userId: val }, { email: { $regex: val } }]} );
  }

});
