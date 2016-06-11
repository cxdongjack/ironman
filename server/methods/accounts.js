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

});
