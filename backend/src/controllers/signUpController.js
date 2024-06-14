const signUpService = require("../services/signUpService");
const loginService = require("../services/loginService");
const mailer = require("./mailer");
let code;

const signUp = async (req, res) => {
  const { user_name,user_nickname, user_email, user_password } = req.body;
  try {
    const result = await signUpService.signUp(user_name,user_nickname, user_email, user_password);
    if (result.success) {
      res.status(200).json({
        message: "회원가입이 성공적으로 완료되었습니다.",
        user_id: result.id,
      });
    } else {
      res.status(400).json({ message: result.error });
    } 
  } catch (error) {
    console.error("Error in signUp controller:", error);
    res.status(500).json({ message: "서버 에러가 발생했습니다." });
  }
};

const auth = async (req, res) => {
  const email = req.body.email;
  code = signUpService.create_code();

  try {
    await mailer.sendMail(
      email,
      "<Core-view> 이메일 인증코드입니다",
      `<p>이메일 인증코드입니다. ${code}를 입력해주세요</p>`
    );
    res.status(200).send({ success: true, code: code });
  } catch (error) {
    console.error("Error in auth controller:", error);
    res.status(500).json({ message: "서버 에러가 발생했습니다." });
  }
};

const emailCheck = (req, res) => {
  let user_code = req.body.authcode;
  console.log(code);
  if (parseInt(user_code) !== parseInt(code)) {
    res.status(200).send({ success: false, message: user_code });
  } else {
    res.status(200).send({ success: true, message: "인증번호가 일치합니다." });
  }
};

const signUpOrLogin = async (req, res) => {
  const { email, username, nickname, password } = req.body;

  try {
    const existingUser = await signUpService.checkEmailExists(email);
    if (existingUser) {
      // 이미 존재하는 유저일 경우 로그인 처리
      const isAuthenticated = await loginService.authenticate(email, password);
      if (isAuthenticated) {
        return res.status(204).json({ user_id: existingUser.user_id });
      } else {
        return res.status(401).send("인증에 실패하였습니다. 올바른 사용자 이름과 비밀번호를 입력해주세요.");
      }
    } else {
      // 존재하지 않는 유저일 경우 회원가입 처리
      const result = await signUpService.signUp(username, nickname, email, password);
      if (result.success) {
        res.status(200).json({ user_id: result.id, message: "회원가입이 성공적으로 완료되었습니다." });
      } else {
        res.status(400).json({ message: result.error });
      }
    }
  } catch (error) {
    console.error("Error in signUpOrLogin controller:", error);
    res.status(500).json({ message: "서버 에러가 발생했습니다." });
  }
};

module.exports = { signUp, auth, emailCheck, signUpOrLogin };