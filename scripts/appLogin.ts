const getURL = (path: string) => ["http://localhost:3000/api", path].join("/");
const id = () => (Math.random() + Date.now()).toString(36);
const req = async <T>(url: string, body: T) =>
  fetch(getURL(url), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

const main = async () => {
  const email = `test_${id()}@example.com`;
  const password = "pasword123";

  const userResp = await req("users", {
    email,
    password,
    location: {
      lat: 50,
      lng: 10,
      address: "Somewhere in Europe",
    },
  });
  if (!userResp.ok) {
    throw new Error(await userResp.text());
  }
  const resp = await req("auth/login", { email, password });
  if (!resp.ok) {
    throw new Error(await resp.text());
  }

  console.log("Login OK", await userResp.json(), await resp.json());
};

void main();
