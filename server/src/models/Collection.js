import mongoose from "mongoose";

const collectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  images: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "CollectionImage",
    default: [],
  },
});

const Collection = mongoose.model("Collection", collectionSchema);

export default Collection;
