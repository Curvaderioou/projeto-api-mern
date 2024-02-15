import User from "../models/User.js";

const findByEmailUserRepository = (email) => User.findOne({ email: email });

const createUserRepository = ({
  name,
  username,
  email,
  password,
  avatar,
  background,
}) =>
  User.create({
    name,
    username,
    email,
    password,
    avatar,
    background,
  });

const findAllUserRepository = () => User.find();

const findByIdUserRepository = (idUser) => User.findById(idUser);

const updateUserRepository = async (
  id,
  name,
  username,
  email,
  password,
  avatar,
  background
) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: id },
      { name, username, email, password, avatar, background },
      { new: true } // Para retornar o documento atualizado
    );

    if (!updatedUser) {
      throw new Error("Usuário não encontrado");
    }

    return updatedUser;
  } catch (error) {
    throw new Error("Erro ao atualizar o usuário: " + error.message);
  }
};

export default {
  findByEmailUserRepository,
  createUserRepository,
  findAllUserRepository,
  findByIdUserRepository,
  updateUserRepository,
};
