import News from "../models/News.js";

function createNewsRepository(title, banner, text, userId) {
  return News.create({ title, banner, text, user: userId });
}

function findAllNewsRepository(offset, limit) {
  return News.find()
    .sort({ _id: -1 })
    .skip(offset)
    .limit(limit)
    .populate("user");
}

function topNewsRepository() {
  return News.findOne().sort({ _id: -1 }).populate("user");
}

function findNewsByIdRepository(id) {
  return News.findById(id).populate("user");
}

function countNews() {
  return News.countDocuments();
}

function searchNewsRepository(title) {
  return News.find({
    title: { $regex: `${title || ""}`, $options: "i" },
  })
    .sort({ _id: -1 })
    .populate("user");
}

function findNewsByUserIdRepository(id) {
  return News.find({
    user: id,
  })
    .sort({ _id: -1 })
    .populate("user");
}

function updateNewsRepository(id, title, banner, text) {
  return News.findOneAndUpdate(
    {
      _id: id,
    },
    {
      title,
      banner,
      text,
    },
    {
      rawResult: true,
    }
  );
}

function deleteNewsRepository(id) {
  return News.findOneAndDelete({ _id: id });
}

function likesRepository(id, userId) {
  return News.findOneAndUpdate(
    {
      _id: id,
      "likes.userId": { $nin: [userId] },
    },
    {
      $push: {
        likes: { userId, created: new Date() },
      },
    },
    {
      rawResult: true,
    }
  );
}

function likesDeleteRepository(id, userId) {
  return News.findOneAndUpdate(
    {
      _id: id,
    },
    {
      $pull: {
        likes: {
          userId: userId,
        },
      },
    }
  );
}

function commentsRepository(id, message, userId) {
  let idComment = Math.floor(Date.now() * Math.random()).toString(36);
  return News.findOneAndUpdate(
    {
      _id: id,
    },
    {
      $push: {
        comments: { idComment, userId, message, createdAt: new Date() },
      },
    },
    {
      rawResult: true,
    }
  );
}

async function commentsUpdateRepository(id, userId, idComment, updatedMessage) {
  try {
    // Verifica se a mensagem está vazia
    if (!updatedMessage.trim()) {
      // Se a mensagem estiver vazia, exclui o comentário
      return await News.findOneAndUpdate(
        { _id: id },
        { $pull: { comments: { idComment: idComment, userId: userId } } },
        { new: true }
      );
    } else {
      // Se a mensagem não estiver vazia, atualiza o comentário
      return await News.findOneAndUpdate(
        { _id: id, "comments.idComment": idComment, "comments.userId": userId },
        { $set: { "comments.$.message": updatedMessage } },
        { new: true }
      );
    }
  } catch (error) {
    console.error("Erro ao atualizar o comentário:", error);
    throw error;
  }
}

export default {
  createNewsRepository,
  findAllNewsRepository,
  topNewsRepository,
  findNewsByIdRepository,
  searchNewsRepository,
  findNewsByUserIdRepository,
  updateNewsRepository,
  deleteNewsRepository,
  likesRepository,
  likesDeleteRepository,
  commentsRepository,
  commentsUpdateRepository,
  countNews,
};
