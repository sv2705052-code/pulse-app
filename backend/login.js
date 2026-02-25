app.get("/login", async (req, res) => {
  res.send(`
<h1>Login User</h1>
<form action="/login" method="post">
<div>
  <label>
    Email <input type="text" name="email" required="true">
  </label>
</div>

<div>
  <label>
    Password <input type="password" name="password" required="true">
  </label>
</div>

<input value="Login" type="submit">
</form>
`);
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (fake_db[email].password === password) {
    res.status(200).send(`<h1>Welcome back, ${fake_db[email].name}!</h1>`);
  } else {
    res
      .status(401)
      .send(
        `<h1>Invalid credentials</h1><a href="/login"><button>Go to login...</button></a>`,
      );
  }
});