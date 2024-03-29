import newsService from "../services/news.service.js";

async function createNewsController(req, res) {
  const { title, banner, text } = req.body;
  const userId = req.userId;

  try {
    const news = await newsService.createNewsService(
      { title, banner, text },
      userId
    );
    return res.status(201).send(news);
  } catch (e) {
    res.status(500).send(e.message);
  }
}

async function findAllNewsController(req, res) {
  const { limit, offset } = req.query;
  const currentUrl = req.baseUrl;

  try {
    const news = await newsService.findAllNewsService(
      limit,
      offset,
      currentUrl
    );
    return res.send(news);
  } catch (e) {
    res.status(500).send(e.message);
  }
}

async function topNewsController(req, res) {
  try {
    const news = await newsService.topNewsService();
    return res.send(news);
  } catch (e) {
    res.status(500).send(e.message);
  }
}

async function searchNewsController(req, res) {
  const { title } = req.query;

  try {
    const foundnews = await newsService.searchNewsService(title);

    return res.send(foundnews);
  } catch (e) {
    res.status(500).send(e.message);
  }
}

async function findNewsByIdController(req, res) {
  const { id } = req.params;

  try {
    const news = await newsService.findNewsByIdService(id);
    return res.send(news);
  } catch (e) {
    res.status(404).send(e.message);
  }
}

async function findNewsByUserIdController(req, res) {
  const id = req.userId;
  try {
    const news = await newsService.findNewsByUserIdService(id);
    return res.send(news);
  } catch (e) {
    return res.status(500).send(e.message);
  }
}

async function updateNewsController(req, res) {
  const { title, banner, text } = req.body;
  const { id } = req.params;
  const userId = req.userId;

  try {
    const response = await newsService.updateNewsService(
      id,
      title,
      banner,
      text,
      userId
    );

    return res.send(response);
  } catch (e) {
    return res.status(500).send(e.message);
  }
}

async function deleteNewsController(req, res) {
  const { id } = req.params;
  const userId = req.userId;

  try {
    await newsService.deleteNewsService(id, userId);
    return res.send({ message: "news deleted successfully" });
  } catch (err) {
    return res.status(500).send(err.message);
  }
}

async function likeNewsController(req, res) {
  const { id } = req.params;
  const userId = req.userId;

  try {
    const response = await newsService.likeNewsService(id, userId);
    return res.send(response);
  } catch (e) {
    return res.status(500).send(e.message);
  }
}

async function commentNewsController(req, res) {
  const { id: newsId } = req.params;
  const { message } = req.body;
  const userId = req.userId;

  try {
    await newsService.commentNewsService(newsId, message, userId);

    return res.send({
      message: "Comment successfully completed!",
    });
  } catch (e) {
    return res.status(500).send(e.message);
  }
}

async function commentDeleteNewsController(req, res) {
  const { id: newsId, idComment: idComment } = req.params; // Altere _id para id
  const userId = req.userId;
  // return res.send(id);
  try {
    await newsService.commentDeleteNewsService(newsId, userId, idComment); // Chama o serviço para excluir o comentário
    return res.send({
      message: `Comment successfully deleted ${(newsId, idComment)}`, // Use newsId e idComment aqui
    });
  } catch (e) {
    return res.status(500).send(e.message);
  }
}

export default {
  createNewsController,
  findAllNewsController,
  topNewsController,
  searchNewsController,
  findNewsByIdController,
  findNewsByUserIdController,
  updateNewsController,
  deleteNewsController,
  likeNewsController,
  commentNewsController,
  commentDeleteNewsController,
};
