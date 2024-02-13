import newsRepositories from "../repositories/news.repositories.js";

async function createNewsService({ title, banner, text }, userId) {
  if (!title || !banner || !text)
    throw new Error("Submit all fields for registration");

  const { id } = await newsRepositories.createNewsRepository(
    title,
    banner,
    text,
    userId
  );

  return {
    message: "News created successfully!",
    news: { id, title, banner, text },
  };
}

async function findAllNewsService(limit, offset, currentUrl) {
  limit = Number(limit);
  offset = Number(offset);

  if (!limit) {
    limit = 5;
  }

  if (!offset) {
    offset = 0;
  }

  const news = await newsRepositories.findAllNewsRepository(offset, limit);

  const total = await newsRepositories.countNews();

  const next = offset + limit;
  const nextUrl =
    next < total ? `${currentUrl}?limit=${limit}&offset=${next}` : null;

  const previous = offset - limit < 0 ? null : offset - limit;
  const previousUrl =
    previous != null ? `${currentUrl}?limit=${limit}&offset=${previous}` : null;

  news.shift();

  return {
    nextUrl,
    previousUrl,
    limit,
    offset,
    total,

    results: news.map((newsItem) => ({
      id: newsItem._id,
      title: newsItem.title,
      banner: newsItem.banner,
      text: newsItem.text,
      likes: newsItem.likes,
      comments: newsItem.comments,
      name: newsItem.user.name,
      username: newsItem.user.username,
      avatar: newsItem.user.avatar,
    })),
  };
}

async function topNewsService() {
  const newsItem = await newsRepositories.topNewsRepository();

  if (!newsItem) throw new Error("There is no registered news");

  return {
    news: {
      id: newsItem._id,
      title: newsItem.title,
      banner: newsItem.banner,
      text: newsItem.text,
      likes: newsItem.likes,
      comments: newsItem.comments,
      name: newsItem.user.name,
      username: newsItem.user.username,
      avatar: newsItem.user.avatar,
    },
  };
}

async function searchNewsService(title) {
  try {
    const foundNews = await newsRepositories.searchNewsRepository(title);

    if (foundNews.length === 0)
      throw new Error("There are no news with this title");

    return {
      foundNews: foundNews.map((newsItem) => ({
        id: newsItem._id,
        title: newsItem.title,
        banner: newsItem.banner,
        text: newsItem.text,
        likes: newsItem.likes,
        comments: newsItem.comments,
        name: newsItem.user.name,
        username: newsItem.user.username,
        avatar: newsItem.user.avatar,
      })),
    };
  } catch (error) {
    console.log(error);
  }
}

async function findNewsByIdService(id) {
  const newsItem = await newsRepositories.findNewsByIdRepository(id);

  if (!newsItem) throw new Error("News not found");

  return {
    id: newsItem._id,
    title: newsItem.title,
    banner: newsItem.banner,
    text: newsItem.text,
    likes: newsItem.likes,
    comments: newsItem.comments,
    name: newsItem.user.name,
    username: newsItem.user.username,
    avatar: newsItem.user.avatar,
  };
}

async function findNewsByUserIdService(id) {
  const news = await newsRepositories.findNewsByUserIdRepository(id);

  return {
    newsByUser: news.map((newsItem) => ({
      id: newsItem._id,
      title: newsItem.title,
      banner: newsItem.banner,
      text: newsItem.text,
      likes: newsItem.likes,
      comments: newsItem.comments,
      name: newsItem.user.name,
      username: newsItem.user.username,
      avatar: newsItem.user.avatar,
    })),
  };
}

async function updateNewsService(id, title, banner, text, userId) {
  if (!title && !banner && !text)
    throw new Error("Submit at least one field to update the news");

  const newsItem = await newsRepositories.findNewsByIdRepository(id);

  if (!newsItem) throw new Error("News not found");

  if (newsItem.user._id != userId)
    throw new Error("You didn't create this news");

  await newsRepositories.updateNewsRepository(id, title, banner, text);
}

async function deleteNewsService(id, userId) {
  const newsItem = await newsService.findNewsByIdService(id);

  if (!newsItem) throw new Error("News not found");

  if (newsItem.user._id != userId)
    throw new Error("You didn't create this news");

  await newsRepositories.deleteNewsRepository(id);
}

async function likeNewsService(id, userId) {
  const newsLiked = await newsService.likesService(id, userId);

  if (newsLiked.lastErrorObject.n === 0) {
    await newsService.likesDeleteService(id, userId);
    return { message: "Like successfully removed" };
  }

  return { message: "Like done successfully" };
}

async function commentNewsService(newsId, message, userId) {
  if (!message) throw new Error("Write a message to comment");

  const newsItem = await newsRepositories.findNewsByIdRepository(newsId);

  if (!newsItem) throw new Error("News not found");

  await newsRepositories.commentsRepository(newsId, message, userId);
}

async function commentDeleteNewsService(newsId, userId, idComment) {
  try {
    const newsItem = await newsRepositories.findNewsByIdRepository(newsId);

    if (!newsItem) throw new Error("News not found");

    await newsRepositories.commentsDeleteRepository(newsId, userId, idComment);
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
}

export default {
  createNewsService,
  findAllNewsService,
  topNewsService,
  searchNewsService,
  findNewsByIdService,
  findNewsByUserIdService,
  updateNewsService,
  deleteNewsService,
  likeNewsService,
  commentNewsService,
  commentDeleteNewsService,
};
