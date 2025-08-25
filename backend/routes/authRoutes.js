const router = require("express").Router();
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

router.post("/guest", (req, res) => {
  try {
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "서버 설정 오류 : JWT_SECRET이 없습니다." });
    }

    const uid = req.body?.deviceId ? String(req.body.deviceId) : uuidv4();

    const token = jwt.sign(
      { uid, role: "guest" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("auth", token, {
      httpOnly: true,
      sameSite: "lax",   // ✅ dev(HTTP) 권장
      secure: false,     // ✅ dev(HTTP)에서는 false
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    return res.status(200).json({ message: "게스트 인증 완료", uid });
  } catch (error) {
    console.error("게스트 인증 오류", error);
    return res.status(500).json({ message: "게스트 인증 중 오류 발생" });
  }
});

// 선택: 쿠키로 세션 확인
router.get("/me", (req, res) => {
  const secret = process.env.JWT_SECRET;
  try {
    const token = req.cookies?.auth;
    if (!token) return res.status(401).json({ ok: false, reason: "NO_COOKIE" });
    const payload = jwt.verify(token, secret);
    return res.json({ ok: true, payload });
  } catch {
    return res.status(401).json({ ok: false, reason: "INVALID_TOKEN" });
  }
});

module.exports = router;
