/**
 * memberForm events
 *
 */
Template.addGuestForm.events({
  "submit form": function (event, template) {
    event.preventDefault();

    let newMemberEmail = template.$('input[name="email"]').val();
    let newMemberName = template.$('input[name="name"]').val();

    return Meteor.call("accounts/inviteGuest", ReactionCore.getShopId(),
      newMemberEmail, newMemberName, function (error, result) {
        if (error) {
          let message = error.reason || 'Unknown error';
          Alerts.toast(message, "error", {
            html: true,
            timeout: 10000
          });
          return false;
        }
        if (result) {
          Alerts.toast("账号添加成功", "success");

          template.$("input[type=text], input[type=email]").val("");
          $(".settings-account-list").show();

          return true;
        }
      }
    );
  }
});
