const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const usersRepository = require("../repositories/usersRepository");

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

const register = async (email, password, name) => {
  const existingUser = await usersRepository.getUserByEmail(email);
  if (existingUser) {
    throw new Error("User already exists");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const userId = await usersRepository.createUser(email, passwordHash, name);

  return userId;
};

const login = async (email, password) => {
  const user = await usersRepository.getUserByEmail(email);
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isValid = await bcrypt.compare(password, user.password_hash);
  if (!isValid) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "1h",
  });

  return token;
};

const getProfile = async (userId) => {
  const user = await usersRepository.getUserById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

module.exports = {
  register,
  login,
  getProfile,
};
