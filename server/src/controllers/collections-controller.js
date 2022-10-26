import { Router } from "express";
import multer from "multer";
import Collection from "../models/Collection.js";
import CollectionImage from "../models/CollectionImage.js";
import User from "../models/User.js";
import { imagekit } from "../imagekit.js";

import { isAuthenticated } from "../services/auth-service.js";

const upload = multer({
  storage: multer.memoryStorage(),
});

const collectionsController = Router();

collectionsController.post(
  "/",
  isAuthenticated,
  upload.array("images"),
  async (req, res) => {
    const userId = req.userId;
    const images = [];

    const user = await User.findById(userId);
    if (user) {
      const newCollection = new Collection({
        title: req.body.title,
      });

      const savedCollection = await newCollection.save();

      try {
        for (const file of req.files) {
          const uploadResult = await imagekit.upload({
            file: file.buffer,
            fileName: `${userId}-${savedCollection._id}-${file.originalname}`,
          });

          images.push({
            url: uploadResult.url,
            imageId: uploadResult.fileId,
          });
        }

        for (const image of images) {
          const newCollectionImage = new CollectionImage({
            url: image.url,
            imageId: image.imageId,
          });
          const savedCollectionImage = await newCollectionImage.save();
          savedCollection.images.push(savedCollectionImage._id);
          await savedCollection.save();
        }
        user.collections.push(savedCollection._id);
        await user.save();

        return res.status(201).json({
          message: "Collection created successfully",
          collection: savedCollection,
        });
      } catch (error) {
        // delete the images from imagekit
        for (const image of images) {
          await imagekit.deleteFile(image.imageId);
        }

        // delete the collection images from the database
        await CollectionImage.deleteMany({
          _id: { $in: savedCollection.images },
        });

        // delete the collction from the database
        await Collection.findByIdAndDelete(savedCollection._id);

        return res.status(500).json({ message: "Something went wrong" });
      }
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  }
);

collectionsController.get("/", isAuthenticated, async (req, res) => {
  const userId = req.userId;
  const user = await User.findById(userId);
  if (user) {
    return res.status(200).json({
      message: "Collections fetched successfully",
      collections: user.collections,
    });
  } else {
    return res.status(404).json({ message: "User not found" });
  }
});

collectionsController.get(
  "/:collectionId",
  isAuthenticated,
  async (req, res) => {
    const userId = req.userId;
    const collectionId = req.params.collectionId;
    const user = await User.findById(userId);
    if (user) {
      let collection = await Collection.findById(collectionId);

      const images = [];

      //   return;
      if (collection) {
        for (const imageId of collection.images) {
          const image = await CollectionImage.findById(imageId);
          images.push(image);
        }
        const response = {
          _id: collection._id,
          title: collection.title,
          images: images,
        };
        return res.status(200).json(response);
      } else {
        return res.status(404).json({ message: "Collection not found" });
      }
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  }
);

collectionsController.put(
  "/:collectionId",
  isAuthenticated,
  async (req, res) => {
    const userId = req.userId;
    const collectionId = req.params.collectionId;
    const { title, images } = req.body;
    const user = await User.findById(userId);
    if (user) {
      let collection = await Collection.findById(collectionId);
      if (collection) {
        // delete images from imagekit
        for (const imageId of images) {
          await imagekit.deleteFile(imageId);
        }

        for (const imageId of images) {
          await CollectionImage.deleteOne({ imageId: imageId });
        }

        // update the collection
        collection.title = title;
        await collection.save();
        return res.status(200).json({
          message: "Collection updated successfully",
        });
      } else {
        return res.status(404).json({ message: "Collection not found" });
      }
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  }
);

collectionsController.delete(
  "/:collectionId",
  isAuthenticated,
  async (req, res) => {
    const userId = req.userId;
    const collectionId = req.params.collectionId;
    const user = await User.findById(userId);
    if (user) {
      let collection = await Collection.findById(collectionId);
      if (collection) {
        // delete images from imagekit
        for (const imageId of collection.images) {
          const collectionImage = await CollectionImage.findById(imageId);
          if (collectionImage) {
            await imagekit.deleteFile(collectionImage.imageId);
          }
          await CollectionImage.findByIdAndDelete(imageId);
        }
        // delete the collection from the database
        await Collection.findByIdAndDelete(collectionId);
        user.collections.pull(collectionId);
        await user.save();

        return res.status(200).json({
          message: "Collection deleted successfully",
        });
      } else {
        return res.status(404).json({ message: "Collection not found" });
      }
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  }
);

export default collectionsController;
