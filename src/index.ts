import rp from "request-promise-native";

const postUrl = "http://2captcha.com/in.php";

const getUrl = "http://2captcha.com/res.php";

const timer = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const captchaSolver = (key: string) => {
  const postCaptcha = async (image: string) => {
    const options = {
      method: "POST",
      url: postUrl,
      qs: {
        key: key,
        json: "1",
        method: "base64"
      },
      headers: {
        "cache-control": "no-cache",
        "content-type": "multipart/form-data"
      },
      formData: {
        body: image
      }
    };

    try {
      const postRequest = await rp(options);

      const JSONPost = JSON.parse(postRequest);

      return JSONPost.request;
    } catch (e) {
      throw new Error(e);
    }
  };

  const getCaptcha = async (id: string): Promise<string> => {
    const options = {
      method: "GET",
      url: getUrl,
      qs: {
        key: key,
        action: "get",
        id,
        json: "1"
      }
    };

    try {
      const getRequest = await rp(options);

      const JSONGet = JSON.parse(getRequest);

      if (JSONGet.status === 1) {
        return JSONGet.request;
      }

      await timer(1000);

      return getCaptcha(id);
    } catch (e) {
      throw new Error(e);
    }
  };

  const solveCaptcha = async (image: string) => {
    const id = await postCaptcha(image);

    await timer(5000);

    return getCaptcha(id);
  };

  const getBalance = async () => {
    const options = {
      method: "GET",
      url: getUrl,
      qs: {
        key: key,
        action: "getbalance",
        json: "1"
      }
    };

    try {
      const getBalance = await rp(options);

      const JSONBalance = JSON.parse(getBalance);

      return JSONBalance.request;
    } catch (e) {
      throw new Error(e);
    }
  };

  return {
    solve: solveCaptcha,
    balance: getBalance
  };
};

export default captchaSolver;
