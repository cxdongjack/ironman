/**
 * get method use publish
 * methor.method('account/person')
 * args : person detail
 * updateAndInsert the person detail
 * like address book case
 */
describe("A suite", function() {
  it("contains spec with an expectation", function() {
    expect(true).toBe(true);
  });
});

faker.reaction.personal = function() {
  return {
    fullName: 'ironman',
    phone: '18888888888'
  };
}

describe("profilePersonUpsert", function () {
  beforeEach(function () {
    return ReactionCore.Collections.Accounts.remove({});
  });

  it(
    "should allow user to upsert its personal",
    done => {
      let account = Factory.create("account");

      spyOn(Meteor, "userId").and.returnValue(account.userId);

      // insert
      const personal = faker.reaction.personal();
      personal.fullName = 'testName';
      expect(account.profile.personal).toBeUndefined();
      Meteor.call("accounts/personalUpsert", personal);
      account = ReactionCore.Collections.Accounts.findOne(account._id);
      expect(account.profile.personal.fullName).toEqual('testName');

      //// update
      personal.fullName = 'testName2';
      Meteor.call("accounts/personalUpsert", personal);
      account = ReactionCore.Collections.Accounts.findOne(account._id);
      expect(account.profile.personal.fullName).toEqual('testName2');

      return done();
    }
  );

  it(
    "should allow Admin to upsert personal to other users",
    done => {
      let account = Factory.create("account");
      spyOn(ReactionCore, "hasPermission").and.returnValue(true);

      // insert
      const personal = faker.reaction.personal();
      personal.fullName = 'testName';
      Meteor.call("accounts/personalUpsert", personal, account.userId);
      account = ReactionCore.Collections.Accounts.findOne(account._id);
      expect(account.profile.personal.fullName).toEqual('testName');

      // update
      personal.fullName = 'testName2';
      Meteor.call("accounts/personalUpsert", personal, account.userId);
      account = ReactionCore.Collections.Accounts.findOne(account._id);
      expect(account.profile.personal.fullName).toEqual('testName2');

      return done();
    }
  );

  it(
    "should throw error if wrong arguments were passed",
    function (done) {
      spyOn(ReactionCore.Collections.Accounts, "upsert");

      expect(function () {
        return Meteor.call("accounts/personalUpsert", 123456);
      }).toThrow();

      // 目前所有参数都是可选的
      //expect(function () {
        //return Meteor.call("accounts/personalUpsert", {});
      //}).toThrow();

      expect(function () {
        return Meteor.call("accounts/personalUpsert", null);
      }).toThrow();

      expect(function () {
        return Meteor.call("accounts/personalUpsert");
      }).toThrow();

      expect(function () {
        return Meteor.call("accounts/personalUpsert", "asdad", 123);
      }).toThrow();

      expect(ReactionCore.Collections.Accounts.upsert).not.toHaveBeenCalled();

      return done();
    }
  );

  it(
    "should not let non-Admin add address to another user",
    function (done) {
      const account = Factory.create("account");
      const account2 = Factory.create("account");
      spyOn(Meteor, "userId").and.returnValue(account.userId);
      spyOn(ReactionCore.Collections.Accounts, "upsert");

      expect(function () {
        return Meteor.call("accounts/personalUpsert", faker.reaction.personal(),
          account2.userId);
      }).toThrow();
      expect(ReactionCore.Collections.Accounts.upsert).not.toHaveBeenCalled();

      return done();
    }
  );

});

