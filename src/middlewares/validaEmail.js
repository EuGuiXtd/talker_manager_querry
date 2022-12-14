const validaEmail = (req, res, next) => {
    const { email } = req.body;
    function validateEmail(emal) {
        const re = /\S+@\S+\.\S+/;
        return re.test(emal);
    }
    if (!email) {
      return res.status(400).json({ message: 'O campo "email" é obrigatório' });
    }
    if (validateEmail(email) === false) {
      return res.status(400).json({ message: 'O "email" deve ter o formato "email@email.com"' });
    }
    next();
};  
module.exports = validaEmail;