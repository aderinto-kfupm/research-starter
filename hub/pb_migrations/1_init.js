/// <reference path="../pb_data/types.d.ts" />
// Schema + first admin + SMTP, all from env. Runs once per fresh pb_data.
migrate((app) => {
  const env = (k, d = "") => $os.getenv(k) || d;
  const isAdmin = "@request.auth.role = 'admin'";
  const canEdit = "@request.auth.role = 'admin' || @request.auth.role = 'collaborator'";
  const authed = "@request.auth.id != ''";
  const stamps = [
    new AutodateField({ name: "created", onCreate: true }),
    new AutodateField({ name: "updated", onCreate: true, onUpdate: true }),
  ];

  // --- users: invite-only, passwordless (emailed one-time code) ---
  const users = app.findCollectionByNameOrId("users");
  users.fields.add(new SelectField({
    name: "role", required: true, maxSelect: 1,
    values: ["admin", "collaborator", "viewer"],
  }));
  users.passwordAuth.enabled = false;
  users.otp.enabled = true;
  users.otp.length = 6;
  users.otp.duration = 600;
  users.listRule = authed;
  users.viewRule = authed;
  users.createRule = isAdmin;
  users.updateRule = isAdmin;
  users.deleteRule = isAdmin;
  app.save(users);

  // Collection({fields}) is ignored by the JS binding: add fields after construction.
  // Save once for the fields, then again for rules (rules may name those fields).
  const mk = (name, fields, rules, indexes = []) => {
    const c = new Collection({ type: "base", name });
    fields.concat(stamps).forEach((f) => c.fields.add(f));
    c.indexes = indexes;
    app.save(c);
    for (const k in rules) c[k] = rules[k];
    app.save(c);
  };
  const open = { listRule: authed, viewRule: authed };
  const editable = { ...open, createRule: canEdit, updateRule: canEdit, deleteRule: canEdit };

  // tasks: kanban + gantt share one table
  mk("tasks", [
    new TextField({ name: "title", required: true, max: 200 }),
    new SelectField({ name: "status", required: true, maxSelect: 1, values: ["todo", "doing", "review", "done"] }),
    new TextField({ name: "milestone", max: 100 }),
    new DateField({ name: "start" }),
    new DateField({ name: "due" }),
    new TextField({ name: "notes", max: 20000 }),
    new NumberField({ name: "pos" }),
  ], editable);

  // logs: dated research diary
  mk("logs", [
    new DateField({ name: "date", required: true }),
    new TextField({ name: "title", max: 200 }),
    new TextField({ name: "body", required: true, max: 20000 }),
    new RelationField({ name: "author", collectionId: users.id, maxSelect: 1 }),
  ], editable);

  // comments: ref is "task:<id>", "log:<id>" or "paper"
  mk("comments", [
    new TextField({ name: "ref", required: true, max: 50 }),
    new TextField({ name: "body", required: true, max: 5000 }),
    new RelationField({ name: "author", collectionId: users.id, maxSelect: 1, required: true }),
  ], {
    ...open,
    createRule: authed + " && @request.body.author = @request.auth.id",
    updateRule: "author = @request.auth.id",
    deleteRule: "author = @request.auth.id || " + isAdmin,
  }, ["CREATE INDEX idx_comments_ref ON comments (ref)"]);

  // docs: CI-published artifacts (PDF, figures). No write rules = superusers only.
  mk("docs", [
    new TextField({ name: "name", required: true, max: 200 }),
    new SelectField({ name: "kind", required: true, maxSelect: 1, values: ["paper", "figure", "review"] }),
    new TextField({ name: "commit", max: 40 }),
    new FileField({ name: "file", required: true, maxSelect: 1, maxSize: 52428800, protected: true }),
  ], open);

  // --- bootstrap from env ---
  const adminEmail = env("ADMIN_EMAIL");
  if (adminEmail) {
    const su = new Record(app.findCollectionByNameOrId("_superusers"));
    su.set("email", adminEmail);
    su.set("password", env("ADMIN_PASSWORD", $security.randomString(24)));
    app.save(su);

    const u = new Record(users);
    u.set("email", adminEmail);
    u.set("name", env("ADMIN_NAME", "Admin"));
    u.set("role", "admin");
    u.set("verified", true);
    u.set("password", $security.randomString(32)); // unused: password login is off
    app.save(u);
  }

  const s = app.settings();
  s.meta.appName = env("APP_NAME", "Research Hub");
  s.meta.appURL = env("APP_URL", "http://localhost:8090");
  s.meta.senderName = env("APP_NAME", "Research Hub");
  s.meta.senderAddress = env("SMTP_FROM", env("SMTP_USER", "noreply@example.com"));
  if (env("SMTP_HOST")) {
    s.smtp.enabled = true;
    s.smtp.host = env("SMTP_HOST");
    s.smtp.port = parseInt(env("SMTP_PORT", "465"));
    s.smtp.username = env("SMTP_USER");
    s.smtp.password = env("SMTP_PASS");
    s.smtp.tls = env("SMTP_PORT", "465") === "465";
  }
  app.save(s);
}, (app) => {});
