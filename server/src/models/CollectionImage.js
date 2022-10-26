import mongoose from "mongoose";

const collectionImageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },

  imageId: {
    type: String,
    required: true,
  },
});

const CollectionImage = mongoose.model(
  "CollectionImage",
  collectionImageSchema
);

export default CollectionImage;
