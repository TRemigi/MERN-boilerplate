const { Schema, model } = require('mongoose');
const moment = require('moment');
const otherCollectionSchema = require('./OtherCollection');

const collectionSchema = new Schema(
  {
    collectionText: {
      type: String,
      required: 'You need to create a collection!',
      minlength: 1,
      maxlength: 280
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: timestamp => moment(timestamp).format('MMM Do, YYYY [at] hh:mm a')
    },
    username: {
      type: String,
      required: true
    },
    otherCollections: [otherCollectionSchema]
  },
  {
    toJSON: {
      getters: true
    }
  }
);

collectionSchema.virtual('otherCollectionsCount').get(function() {
  return this.otherCollections.length;
});

const Collection = model('Collection', collectionSchema);

module.exports = Collection;
