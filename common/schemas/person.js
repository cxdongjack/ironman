/**
* Iron Person
*/

ReactionCore.Schemas.Person = new SimpleSchema({
  _id: {
    type: String,
    defaultValue: Random.id(),
    optional: true
  },
  fullName: {
    type: String,
    label: "Full name"
  },
});

// /**
// * ReactionCore Schemas Accounts
// */
//
// ReactionCore.Schemas.Accounts = new SimpleSchema({
//   "userId": {
//     type: String,
//     regEx: SimpleSchema.RegEx.Id,
//     index: 1,
//     label: "Accounts ShopId"
//   },
//   "sessions": {
//     type: [String],
//     optional: true,
//     index: 1
//   },
//   "shopId": {
//     type: String,
//     autoValue: ReactionCore.shopIdAutoValue,
//     regEx: SimpleSchema.RegEx.Id,
//     index: 1
//   },
//   "emails": {
//     type: [ReactionCore.Schemas.Email],
//     optional: true
//   },
//   "acceptsMarketing": {
//     type: Boolean,
//     defaultValue: false,
//     optional: true
//   },
//   "state": {
//     type: String,
//     defaultValue: "new",
//     optional: true
//   },
//   "note": {
//     type: String,
//     optional: true
//   },
//   "profile": {
//     type: Object,
//     optional: true
//   },
//   "profile.addressBook": {
//     type: [ReactionCore.Schemas.Address],
//     optional: true
//   },
//   "metafields": {
//     type: [ReactionCore.Schemas.Metafield],
//     optional: true
//   },
//   "createdAt": {
//     type: Date,
//     autoValue: function() {
//       if (this.isInsert) {
//         return new Date;
//       } else if (this.isUpsert) {
//         return {
//           $setOnInsert: new Date
//         };
//       }
//     }
//   },
//   "updatedAt": {
//     type: Date,
//     autoValue: function() {
//       if (this.isUpdate) {
//         return {
//           $set: new Date
//         };
//       } else if (this.isUpsert) {
//         return {
//           $setOnInsert: new Date
//         };
//       }
//     },
//     optional: true
//   }
// });
