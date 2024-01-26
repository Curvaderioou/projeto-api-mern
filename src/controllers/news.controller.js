import { createService, findAllService } from "../services/news.service.js";

const create = async (req, res) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.send(401);
    }
    const parts = authorization.split(" ");
    if (parts.length !== 2) {
      return res.send(401);
    }
    const [schema, token] = parts;
    if (schema !== "Bearer") {
      return res.send(401);
    }
    const { title, text, banner } = req.body;
    if (!title || !text || !banner) {
      res.status(400).send({ message: "Preencha todos os campos" });
    }
    await createService({
      title,
      text,
      banner,
      user: { _id: "65b2a251c6159fa8a07cece1" },
    });
    res.status(201).send({ message: "Notícia criada com sucesso!" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
  res.status(201);
};
const findAll = async (req, res) => {
  const news = await findAllService();
  if (news.length === 0) {
    return res.status(400).send({ message: "Não há notícias" });
  }
  res.send(news);
};
export { create, findAll };
