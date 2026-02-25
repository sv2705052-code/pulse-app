app.get("/register", async (_, res) => {
  res.send(`
<h1>Register User</h1>
<form action="/register" method="post">
<div>
  <label>
    Email <input type="text" name="email" required="true">
  </label>
</div>

<div>
  <label>
    Username <input type="text" name="username" required="true">
  </label>
</div>

<div>
  <label>
    Password <input type="password" name="password" required="true">
  </label>
</div>

<div>
  <label>
    Confirm Password <input type="password" name="confirmPassword" required="true">
  </label>
</div>

<input value="Register" type="submit">
</form>
`);
});

app.post("/register", async (req, res) => {
  try {
    const { email, username, password } = req.body;

    if (fake_db[email] !== undefined) {
      res
        .status(409)
        .send(
          `<h1>User already exists</h1><a href="/register"><button>Back to user registration...</button></a>`,
        );
    } else {
      fake_db[email] = { name: username, password: password };
      res
        .status(201)
        .send(
          `<h1>User registered!</h1><a href="/login"><button>Go to login...</button></a>`,
        );
    }
  } catch (error) {
    res.status(500).send(`Unexpected server error: ${error}`);
  }
});