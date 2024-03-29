const url = (path: string) => ["http://localhost:3000/api", path].join("/");

const id = () => (Math.random() + Date.now()).toString(36);

const main = async () => {
  const email = `test_${id()}@example.com`;
  const password = "pasword123";
  const ri: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  };
  const userResp = await fetch(url("users"), ri);
  const resp = await fetch(url("auth/login"), ri);

  console.log("Login OK", await userResp.json(), await resp.json());
};

void main();
