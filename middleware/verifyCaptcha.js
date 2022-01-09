import nextConnect from "next-connect";

async function verifyCaptcha(req, res, next) {
  const { captcha } = req.body;

  try {
    // Ping the hcaptcha verify API to verify the captcha code you received
    const response = await fetch(
      `https://www.google.com/recaptcha/api/siteverify`,

      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
        },
        body: `response=${captcha}&secret=${process.env.RECAPTCHA_SECRET_KEY}`,
        method: "POST",
      }
    );
    const captchaValidation = await response.json();

    /**
     * {
     *    "success": true|false,     // is the passcode valid, and does it meet security criteria you specified, e.g. sitekey?
     *    "challenge_ts": timestamp, // timestamp of the challenge (ISO format yyyy-MM-dd'T'HH:mm:ssZZ)
     *    "hostname": string,        // the hostname of the site where the challenge was solved
     *    "credit": true|false,      // optional: whether the response will be credited
     *    "error-codes": [...]       // optional: any error codes
     *    "score": float,            // ENTERPRISE feature: a score denoting malicious activity.
     *    "score_reason": [...]      // ENTERPRISE feature: reason(s) for score. See BotStop.com for details.
     *  }
     */
    if (captchaValidation.success) {
      // Replace this with the API that will save the data received
      // to your backend

      return next();

      // Return 200 if everything is successful
    }

    return res.status(422).json({
      message: "رمز التفعيل غير صحيح",
    });
  } catch (error) {
    return res.status(422).json({ message: "هناك خطأ ما" });
  }
}
const verfiy = nextConnect();
verfiy.use(verifyCaptcha);
export default verfiy;
