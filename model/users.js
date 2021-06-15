const User = require('./schemas/user');

const findById = async id => {
  return await User.findOne({ _id: id });
};
const findByEmail = async email => {
  return await User.findOne({ email });
};

const getUserByVerifyToken = async token => {
  return await User.findOne({ verifyToken: token });
};

const create = async ({ email, password, subscription }) => {
  const user = new User({ email, password, subscription });
  return await user.save();
};
const updateToken = async (id, token) => {
  return await User.updateOne({ _id: id }, { token });
};

const updateAvatar = async (id, avatar, userIdImg = null) => {
  return await User.updateOne({ _id: id }, { avatar, userIdImg });
};
const updateVerifyToken = async (id, verify, token) => {
  return await User.updateOne({ _id: id }, { verify, verifyToken: token });
};
module.exports = {
  findById,
  findByEmail,
  getUserByVerifyToken,
  create,
  updateToken,
  updateAvatar,
  updateVerifyToken,
};
/* < form  action = " / profile " method = " post " enctype = " multipart / form-data " > 
  < input  type = " file " name = " avatar " />
 </ form > */
