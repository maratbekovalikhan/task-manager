exports.getProfile = async (req, res) => {
  res.json(req.user);
};

exports.updateProfile = async (req, res) => {
  const { username, email } = req.body;

  if (username) req.user.username = username;
  if (email) req.user.email = email;

  await req.user.save();
  res.json(req.user);
};
