/**
 * onCreated: Account Profile View
 */
Template.accountPersonalIronman.onCreated(() => {
  let template = Template.instance();

  template.userHasPassword = ReactiveVar(false);

  Meteor.call("accounts/currentUserHasPassword", (error, result) => {
    template.userHasPassword.set(result);
  });
});

/**
 * Helpers: Account Profile View
 */
Template.accountPersonalIronman.helpers({

  /**
   * User has password
   * @return {Boolean} return true if the current user has a password, false otherwise
   */
  userHasPassword() {
    return Template.instance().userHasPassword.get();
  },

  /**
   * User's order history
   * @return {Array|null} an array of available orders for the user
   */
  userOrders() {
    const orderSub = Meteor.subscribe("AccountOrders", Meteor.userId());
    if (orderSub.ready()) {
      return ReactionCore.Collections.Orders.find({
        userId: Meteor.userId()
      }, {
        sort: {
          createdAt: -1
        },
        limit: 25
      });
    }
  },

  personal() {
    let account = ReactionCore.Collections.Accounts.findOne({userId: Meteor.userId()});
    let personal = {};
    try {
      personal = account.profile.personal;
    } catch(e) {}
    return personal;
  },

  /**
   * Returns the address book default view
   * @return {String} "addressBookGrid" || "addressBookAdd"
   */
  addressBookView: function () {
    let account = ReactionCore.Collections.Accounts.findOne();
    if (account.profile) {
      return "addressBookGrid";
    }
    return "addressBookAdd";
  }
});

AutoForm.hooks({
  accountPersonalAddForm: {
    onSubmit: function (insertDoc) {
      this.event.preventDefault();

      console.log(insertDoc);

      Meteor.call("accounts/personalUpsert", insertDoc, (error, result) => {
        if (error) {
          Alerts.toast("编辑信息出错啦", "error");
          this.done(new Error(error));
          return false;
        }
        if (result) {
          this.done();
        }
      });
    }
  }
});
