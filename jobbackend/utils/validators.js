const validateEmail = (email) => {

  return email.includes("@");

};

module.exports = {
  validateEmail,
};