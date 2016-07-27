import * as Collections from "/lib/collections";

/**
 * Reaction Account Methods
 */
Meteor.methods({
  /**
   * accounts/inviteGuest
   * create new guest users
   * (not consumers) to secure access in the dashboard
   * to permissions as specified in packages/roles
   * @param {String} shopId - shop to invite user
   * @param {String} email - email of invitee
   * @param {String} name - name to address email
   * @returns {Boolean} returns true
   */
  "accounts/inviteGuest": function (shopId, email, name) {
    let currentUserName;
    let shop;
    let token;
    let user;
    let userId;
    check(shopId, String);
    check(email, String);
    check(name, String);
    this.unblock();
    shop = ReactionCore.Collections.Shops.findOne(shopId);

    if (!ReactionCore.hasPermission("reaction-accounts", Meteor.userId(), shopId)) {
      throw new Meteor.Error(403, "Access denied");
    }

    // everything cool? invite user
    if (shop && email && name) {
      let currentUser = Meteor.user();

      user = Meteor.users.findOne({
        "emails.address": email
      });

      if (!user) {
        userId = Accounts.createUser({
          email: email,
          username: name,
          password: name
        });
        user = Meteor.users.findOne(userId);
        if (!user) {
          throw new Error("Can't find user");
        }
      } else {
          throw new Meteor.Error(403, "创建失败，用户已存在");
      }
    } else {
      throw new Meteor.Error(403, "Access denied");
    }
    return true;
  },
  /**
   * accounts/personalUpsert
   * @description update existing address in user's profile
   * @param {Object} address - address
   * @param {String|null} [accountUserId] - `account.userId` used by admin to
   * edit users
   * @param {shipping|billing} [type] - name of selected address type
   * @return {Number} The number of affected documents
   */
  "accounts/personalUpsert": function (personal, accountUserId) {
    check(personal, ReactionCore.Schemas.Personal);
    check(accountUserId, Match.Optional(String));

    // security, check for admin access.
    if (typeof accountUserId === "string") { // if this will not be a String -
      // `check` will not pass it.
      if (!ReactionCore.hasAdminAccess()) {
        throw new Meteor.Error(403, "Access denied");
      }
    }
    this.unblock();

    const userId = accountUserId || Meteor.userId();
    // required default id
    if (!personal._id) {
      personal._id = Random.id();
    }
    // clean schema
    ReactionCore.Schemas.Personal.clean(personal);

    return ReactionCore.Collections.Accounts.upsert({
      userId: userId
    }, {
      $set: {
        "profile.personal": personal
      }
    });
  },
  /**
   *  order/createOrder
   *  @summary add items to order
   *  @param {String} productId - productId to add to Cart
   *  @param {String} variantId - product variant _id
   *  @param {Number} [itemQty] - qty to add to cart
   *  @return {Number|Object} Mongo insert response
   */
  "order/createOrder": function (productId, variantId) {
    check(productId, String);
    check(variantId, Array);

    const order = {workflow: {}};
    // userId
    order.userId = this.userId;

    // set new workflow status
    order.workflow.status = "new";
    order.workflow.workflow = ["coreOrderWorkflow/created"];

    // items
    let product;
    let variants = [];
    Collections.Products.find(
      { _id: { $in: [productId].concat(variantId)}})
    .forEach(doc => {
      if (doc.type === "simple") {
        product = doc;
      } else {
        variants.push(doc);
      }
    });

    order.items = variants.map(function(variant) {
      return {
        _id: Random.id(),
        shopId: product.shopId,
        productId: productId,
        quantity: 1,
        variants: variant,
        title: product.title,
        type: product.type
      };
    });

    // insert new reaction order
    const orderId = Collections.Orders.insert(order);

    return Collections.Orders.findOne(orderId);
  },


});
