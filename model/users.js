const User = require('./schemas/user');

const finById = async id => {
  return await User.findOne({ _id: id });
};
const finByEmail = async email => {
  return await User.findOne({ email });
};

const create = async options => {
  const user = new User(options);
  return await user.save();
};
const updateToken = async (id, token) => {
  return await User.updateOne({ _id: id }, { token });
};

module.exports = {
  finById,
  finByEmail,
  create,
  updateToken,
};
