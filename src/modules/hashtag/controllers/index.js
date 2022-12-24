import searchTag from "./searchTag.js";
import getPostsByTag from "./getPostsByTag.js";
import getTrendingTags from "./getTrendingTags.js";

const tagController = {};

tagController.searchTag = searchTag;
tagController.getPostsByTag = getPostsByTag;
tagController.getTrendingTags = getTrendingTags;

export default tagController;