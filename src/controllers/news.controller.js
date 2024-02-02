import { response } from "express";
import {
  createService,
  findAllService,
  countNews,
  topNewsService,
  findByIdService,
  searchByTitleService,
  byUserService,
  updateService,
  eraseService,
  likeNewsService,
  deleteLikeNewsService,
  addCommentService,
  deleteCommentService,
} from "../services/news.service.js";

export const create = async (req, res) => {
  try {
    const { title, text, banner } = req.body;
    if (!title || !text || !banner) {
      res.status(400).send({ message: "Preencha todos os campos" });
    }
    await createService({
      title,
      text,
      banner,
      user: req.userId,
    });
    res.status(201).send({ message: "Notícia criada com sucesso!" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
  res.status(201);
};
export const findAll = async (req, res) => {
  try {
    let { limit, offset } = req.query;
    limit = Number(limit);
    offset = Number(offset);
    if (!limit) {
      limit = 5;
    }
    if (!offset) {
      offset = 1;
    }
    const news = await findAllService(offset, limit);
    const total = await countNews();
    const currentUrl = req.baseUrl;
    const next = offset + limit;
    const nextUrl =
      next < total ? `${currentUrl}?limit=${limit}&offset=${next}` : null;
    const previous = offset - limit < 0 ? null : offset - limit;
    const previousUrl =
      previous != null
        ? `${currentUrl}?limit=${limit}&offset=${previous}`
        : null;
    // if (news.length === 0) {
    //   return res.status(400).send({ message: "Não há notícias" });
    // }
    res.send({
      nextUrl,
      previousUrl,
      limit,
      offset,
      total,

      results: news.map((item) => ({
        id: item._id,
        title: item.title,
        text: item.text,
        banner: item.banner,
        likes: item.likes,
        comments: item.comments,
        name: item.user.name,
        userName: item.user.username,
        userAvatar: item.user.avatar,
      })),
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
export const topNews = async (req, res) => {
  try {
    const news = await topNewsService();
    if (!news) {
      return res.status(400).send({ message: "Não há notícias registradas" });
    }
    res.send({
      news: {
        id: news._id,
        title: news.title,
        text: news.text,
        banner: news.banner,
        likes: news.likes,
        comments: news.comments,
        name: news.user.name,
        userName: news.user.username,
        userAvatar: news.user.avatar,
      },
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
export const findById = async (req, res) => {
  try {
    const { id } = req.params;
    const news = await findByIdService(id);
    return res.send({
      news: {
        id: news._id,
        title: news.title,
        text: news.text,
        banner: news.banner,
        likes: news.likes,
        comments: news.comments,
        name: news.user.name,
        userName: news.user.username,
        userAvatar: news.user.avatar,
      },
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
export const searchByTitle = async (req, res) => {
  try {
    const { title } = req.query;
    const news = await searchByTitleService(title);
    if (news.lenght === 0) {
      return res
        .status(400)
        .send({ message: "Não há notícias com esse título" });
    }
    return res.send({
      results: news.map((item) => ({
        id: item._id,
        title: item.title,
        text: item.text,
        banner: item.banner,
        likes: item.likes,
        comments: item.comments,
        name: item.user.name,
        userName: item.user.username,
        userAvatar: item.user.avatar,
      })),
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
export const byUser = async (req, res) => {
  try {
    const id = req.userId;
    const news = await byUserService(id);
    return res.send({
      results: news.map((item) => ({
        id: item._id,
        title: item.title,
        text: item.text,
        banner: item.banner,
        likes: item.likes,
        comments: item.comments,
        name: item.user.name,
        userName: item.user.username,
        userAvatar: item.user.avatar,
      })),
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
export const update = async (req, res) => {
  try {
    const { title, text, banner } = req.body;
    const { id } = req.params;
    if (!title && !banner && !text) {
      return res.status(400).send({ message: "Preencha pelo menos um campo" });
    }
    const news = await findByIdService(id);
    if (news.user._id != req.userId) {
      return res
        .status(400)
        .send({ message: "Você não pode alterar essa notícia" });
    }
    await updateService(id, title, text, banner);
    return res.send({ message: "Notícia atualizado com sucesso" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
export const erase = async (req, res) => {
  try {
    const { id } = req.params;
    const news = await findByIdService(id);
    if (news.user._id != req.userId) {
      return res
        .status(400)
        .send({ message: "Você não pode deletar essa notícia" });
    }
    await eraseService(id);
    return res.send({ message: "Notícia deletada com sucesso" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
export const likeNews = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const newsLiked = await likeNewsService(id, userId);
    if (!newsLiked) {
      await deleteLikeNewsService(id, userId);
      return res.status(200).send({ message: "like removido com sucesso" });
    }
    res.send("Curtido- com sucesso");
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
export const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const { comment } = req.body;

    if (!comment) {
      return res.status(400).send({ message: "Escreva algo para comentar" });
    }
    await addCommentService(id, comment, userId);
    res.send({ message: "Comentário adicionado com sucesso" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
export const deleteComment = async (req, res) => {
  try {
    const { idNews, idComment } = req.params;
    const userId = req.userId;

    const commentDeleted = await deleteCommentService(
      idNews,
      idComment,
      userId
    );
    const commentFinder = commentDeleted.comments.find(
      (comment) => comment.idComment === idComment
    );
    if (!commentFinder) {
      return response
        .status(404)
        .send({ message: "O comentário não encontrado" });
    }
    if (commentFinder.userId != userId) {
      return res
        .status(400)
        .send({ message: "Você não pode deletar esse comentário" });
    }
    res.send({ message: "Comentário removido com sucesso" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
