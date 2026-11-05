"use strict";
const pb = new PocketBase(location.origin);
const title = (window.HUB && HUB.title) || "Research Hub";
document.title = title;
const $app = document.getElementById("app");
const COLS = [["todo", "To do"], ["doing", "Doing"], ["review", "Review"], ["done", "Done"]];
const DAY = 864e5, PX = 18;

// ---------- helpers ----------
const h = (tag, attrs = {}, ...kids) => {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k.startsWith("on")) e.addEventListener(k.slice(2), v);
    else if (k === "class") e.className = v;
    else if (v !== false && v != null) e.setAttribute(k, v === true ? "" : v);
  }
  e.append(...kids.flat().filter((x) => x != null && x !== false));
  return e;
};
const me = () => pb.authStore.record;
const role = () => (me() || {}).role;
const canEdit = () => role() === "admin" || role() === "collaborator";
const day = (s) => (s ? s.slice(0, 10) : "");
const today = () => new Date().toISOString().slice(0, 10);
const ms = (s) => Date.parse(day(s));
const fmt = (s) => new Date(ms(s)).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
const field = (label, input) => h("div", { class: "field" }, h("label", {}, label), input);

// ---------- shell ----------
const routes = { board: viewBoard, roadmap: viewRoadmap, log: viewLog, paper: viewPaper, people: viewPeople };
let cur = null, timer = null, dragging = false, refreshBoard = null;

async function render() {
  if (!pb.authStore.isValid) return viewLogin();
  const name = location.hash.slice(1) || "board";
  const key = routes[name] && (name !== "people" || role() === "admin") ? name : "board";
  const tabs = Object.keys(routes).filter((k) => k !== "people" || role() === "admin");
  const main = h("main");
  $app.replaceChildren(
    h("header", {},
      h("span", { class: "brand" }, title),
      h("nav", {}, tabs.map((k) => h("a", { href: "#" + k, class: k === key ? "on" : "" }, k[0].toUpperCase() + k.slice(1)))),
      h("span", { class: "who" }, me().name || me().email, h("span", { class: "muted" }, role()),
        h("button", { class: "btn link", onclick: () => { pb.authStore.clear(); render(); } }, "Sign out"))),
    main);
  cur = key;
  refreshBoard = null;
  try { await routes[key](main); } catch (e) { main.append(h("p", { class: "err" }, e.message)); }
}
window.addEventListener("hashchange", render);

// live refresh when somebody else edits (not while a dialog is open)
function live() {
  const kick = () => { clearTimeout(timer); timer = setTimeout(() => {
    if (dragging || document.querySelector("dialog[open]") || document.querySelector("main textarea:focus,main input:focus")) return;
    if (cur === "board" && refreshBoard) refreshBoard().catch(() => {}); else if (/roadmap|log/.test(cur)) render();
  }, 300); };
  for (const c of ["tasks", "logs"]) pb.collection(c).subscribe("*", kick).catch(() => {});
}

// ---------- login (email -> 6 digit code) ----------
function viewLogin(otpId, email, msg) {
  const err = h("div", { class: "err" }, msg || "");
  const input = h("input", otpId
    ? { name: "code", inputmode: "numeric", autocomplete: "one-time-code", placeholder: "6-digit code", required: true, autofocus: true }
    : { name: "email", type: "email", placeholder: "you@university.edu", required: true, autofocus: true });
  const form = h("form", {
    onsubmit: async (e) => {
      e.preventDefault();
      try {
        if (!otpId) {
          const r = await pb.collection("users").requestOTP(input.value.trim());
          return viewLogin(r.otpId, input.value.trim());
        }
        await pb.collection("users").authWithOTP(otpId, input.value.trim());
        live(); render();
      } catch (x) { err.textContent = otpId ? "That code did not work." : x.status === 400 ? "This email is not a member of the research project." : "Could not send a code. Try again."; }
    },
  }, field(otpId ? "Code sent to " + email : "Email", input), h("button", { class: "btn primary" }, otpId ? "Sign in" : "Send code"), err,
    otpId && h("button", { type: "button", class: "btn link", onclick: () => viewLogin() }, "Use a different email"));
  $app.replaceChildren(h("div", { class: "login" }, h("h1", {}, title), h("p", { class: "muted" }, "Invite-only. Enter your email and we will send a sign-in code."), form));
}

// ---------- comments (ref = "task:<id>" | "log:<id>" | "paper") ----------
async function comments(ref) {
  const box = h("div", { class: "cmts" });
  const load = async () => {
    const rows = await pb.collection("comments").getFullList({ filter: pb.filter("ref = {:r}", { r: ref }), sort: "created", expand: "author" });
    const t = h("textarea", { placeholder: "Add a comment", required: true });
    box.replaceChildren(
      ...rows.map((c) => h("div", { class: "cmt" },
        h("div", { class: "who2" }, c.expand?.author?.name || c.expand?.author?.email || "?", fmt(c.created),
          (c.author === me().id || role() === "admin") && h("button", { class: "btn link", onclick: async () => { await pb.collection("comments").delete(c.id); load(); } }, "delete")),
        h("div", { class: "body" }, c.body))),
      h("form", { class: "cmt-form", onsubmit: async (e) => { e.preventDefault(); await pb.collection("comments").create({ ref, body: t.value, author: me().id }); load(); } },
        t, h("button", { class: "btn" }, "Post")));
  };
  await load();
  return box;
}

// ---------- dialogs ----------
function openDialog(...body) {
  const d = h("dialog", {}, ...body);
  d.addEventListener("close", () => { d.remove(); render(); });
  document.body.append(d);
  d.showModal();
  return d;
}

async function taskDialog(t) {
  const ro = !canEdit();
  const f = {
    title: h("input", { value: t.title, required: true, disabled: ro }),
    status: h("select", { disabled: ro }, COLS.map(([v, l]) => h("option", { value: v, selected: v === t.status }, l))),
    milestone: h("input", { value: t.milestone || "", disabled: ro, placeholder: "e.g. Literature review" }),
    start: h("input", { type: "date", value: day(t.start), disabled: ro }),
    due: h("input", { type: "date", value: day(t.due), disabled: ro }),
    notes: h("textarea", { disabled: ro }, t.notes || ""),
  };
  const d = openDialog(
    h("form", {
      method: "dialog",
      onsubmit: async (e) => {
        if (ro) return;
        e.preventDefault();
        await pb.collection("tasks").update(t.id, Object.fromEntries(Object.entries(f).map(([k, el]) => [k, el.value])));
        d.close();
      },
    },
      field("Title", f.title),
      h("div", { class: "row2" }, field("Status", f.status), field("Milestone", f.milestone)),
      h("div", { class: "row2" }, field("Start", f.start), field("Due", f.due)),
      field("Notes", f.notes),
      h("div", { class: "foot" },
        !ro ? h("button", { type: "button", class: "btn danger", onclick: async () => { if (confirm("Delete this task?")) { await pb.collection("tasks").delete(t.id); d.close(); } } }, "Delete") : h("span"),
        h("span", {}, h("button", { type: "button", class: "btn", onclick: () => d.close() }, ro ? "Close" : "Cancel"), " ", !ro && h("button", { class: "btn primary" }, "Save")))),
    h("h2", {}, "Discussion"), await comments("task:" + t.id));
}

// ---------- board ----------
const toast = (msg) => { const t = h("div", { class: "toast" }, msg); document.body.append(t); setTimeout(() => t.remove(), 3500); };
const short = (s) => new Date(ms(s)).toLocaleDateString(undefined, { day: "numeric", month: "short", timeZone: "UTC" });
const P = (t) => t.pos || 0, byPos = (a, b) => P(a) - P(b);

async function viewBoard(main) {
  const load = () => pb.collection("tasks").getFullList({ sort: "pos,created" });
  let tasks = await load(), q = "", adding = null, drawing = false, suppress = false;
  const edit = canEdit();
  const board = h("div", { class: "board" });
  refreshBoard = async () => { tasks = await load(); draw(); };

  // pos is a float: land between neighbours, or at the end when beforeId is empty
  const moveTask = async (t, status, beforeId) => {
    const col = tasks.filter((x) => x.status === status && x.id !== t.id).sort(byPos);
    const i = beforeId ? col.findIndex((x) => x.id === beforeId) : -1;
    const pos = i < 0 ? (col.length ? P(col.at(-1)) : 0) + 1 : i === 0 ? P(col[0]) - 1 : (P(col[i - 1]) + P(col[i])) / 2;
    Object.assign(t, { status, pos });
    draw();
    try { await pb.collection("tasks").update(t.id, { status, pos }); }
    catch { toast("Could not save that move."); refreshBoard(); }
  };

  // pointer-based drag (mouse/pen): ghost follows cursor, a line shows the landing spot, Esc cancels
  const startDrag = (e, c, t) => {
    if (e.button !== 0 || e.pointerType === "touch") return;
    const x0 = e.clientX, y0 = e.clientY, r = c.getBoundingClientRect();
    let ghost = null, esc = false;
    const ph = h("div", { class: "ph" });
    const at = (ev) => {
      const col = document.elementFromPoint(ev.clientX, ev.clientY)?.closest(".col");
      if (!col) return null;
      const before = [...col.querySelectorAll(".card:not(.drag)")].find((k) => { const b = k.getBoundingClientRect(); return ev.clientY < b.top + b.height / 2; });
      return { col, before };
    };
    const clear = () => document.querySelectorAll(".col.over").forEach((x) => x.classList.remove("over"));
    const onMove = (ev) => {
      if (!ghost) {
        if (Math.hypot(ev.clientX - x0, ev.clientY - y0) < 5) return;
        dragging = true;
        ghost = c.cloneNode(true);
        ghost.className = "card ghost";
        ghost.style.width = r.width + "px";
        document.body.append(ghost);
        document.body.classList.add("grabbing");
        c.classList.add("drag");
      }
      ghost.style.transform = `translate(${ev.clientX - (x0 - r.left)}px,${ev.clientY - (y0 - r.top)}px) rotate(1.5deg)`;
      clear();
      const g = at(ev);
      if (!g) return ph.remove();
      g.col.classList.add("over");
      g.col.querySelector(".cards").insertBefore(ph, g.before || null);
    };
    const onKey = (ev) => { if (ev.key === "Escape") { esc = true; onUp(ev); } };
    const onUp = async (ev) => {
      removeEventListener("pointermove", onMove); removeEventListener("pointerup", onUp); removeEventListener("keydown", onKey);
      if (!ghost) return;
      const g = esc ? null : at(ev);
      ghost.remove(); ph.remove(); clear(); c.classList.remove("drag");
      document.body.classList.remove("grabbing");
      dragging = false; suppress = true; setTimeout(() => (suppress = false));
      if (g) await moveTask(t, g.col.dataset.st, g.before?.dataset.id);
    };
    addEventListener("pointermove", onMove); addEventListener("pointerup", onUp); addEventListener("keydown", onKey);
  };

  const card = (t) => {
    const late = t.due && t.status !== "done" && day(t.due) < today();
    const c = h("div", { class: "card" + (t.status === "done" ? " done" : ""), tabindex: 0, "data-id": t.id,
      onclick: () => !suppress && taskDialog(t),
      onkeydown: (e) => { if (e.key === "Enter" && e.target === c) taskDialog(t); } },
      h("div", { class: "t" }, t.title),
      (t.milestone || t.due || t.notes) && h("div", { class: "meta" },
        t.milestone && h("span", { class: "chip" }, t.milestone),
        t.due && h("span", { class: "chip" + (late ? " late" : "") }, (late ? "Overdue · " : "") + short(t.due)),
        t.notes && h("span", { class: "chip", title: "Has notes" }, "≡")));
    if (edit) c.addEventListener("pointerdown", (e) => startDrag(e, c, t));
    return c;
  };

  const addBox = (st) => {
    const i = h("textarea", { class: "add", rows: 2, placeholder: "Task title. Enter to add, Esc to close." });
    i.addEventListener("keydown", async (e) => {
      if (e.key === "Escape") { adding = null; return draw(); }
      if (e.key !== "Enter" || e.shiftKey) return;
      e.preventDefault();
      const title = i.value.trim();
      if (!title) return;
      i.disabled = true;
      try {
        const pos = Math.max(0, ...tasks.filter((x) => x.status === st).map(P)) + 1;
        tasks.push(await pb.collection("tasks").create({ title, status: st, pos }));
      } catch { toast("Could not add the task."); }
      draw(true);
    });
    i.addEventListener("blur", () => { if (!drawing && !i.value.trim()) { adding = null; draw(); } });
    return i;
  };

  const draw = (focus) => {
    drawing = true;
    const needle = q.trim().toLowerCase();
    const hit = (t) => !needle || `${t.title} ${t.milestone || ""}`.toLowerCase().includes(needle);
    let box;
    board.replaceChildren(...COLS.map(([st, label]) => {
      const all = tasks.filter((t) => t.status === st).sort(byPos), items = all.filter(hit);
      if (adding === st) box = addBox(st);
      return h("section", { class: "col s-" + st, "data-st": st },
        h("h3", {}, h("i", { class: "dot" }), label, h("span", { class: "count" }, needle ? `${items.length}/${all.length}` : all.length)),
        h("div", { class: "cards", "data-st": st }, items.map(card)),
        edit && (adding === st ? box : h("button", { class: "btn link addbtn", onclick: () => { adding = st; draw(true); } }, "+ Add task")));
    }));
    drawing = false;
    if (focus && box) box.focus();
  };

  const search = h("input", { class: "search", type: "search", placeholder: "Filter tasks", "aria-label": "Filter tasks" });
  search.addEventListener("input", () => { q = search.value; draw(); });
  main.append(h("div", { class: "bar" }, h("h2", {}, "Board"), search), board);
  draw();
}

// ---------- roadmap (gantt) ----------
async function viewRoadmap(main) {
  const tasks = (await pb.collection("tasks").getFullList({ sort: "start,due" })).filter((t) => t.due || t.start);
  main.append(h("div", { class: "bar" }, h("h2", {}, "Roadmap"),
    h("div", { class: "legend" }, h("span", {}, "outline: to do"), h("span", {}, "solid: doing"), h("span", {}, "hatched: review"), h("span", {}, "grey: done"))));
  if (!tasks.length) return main.append(h("p", { class: "empty" }, "Tasks with a start or due date appear here. Set dates from a card on the Board."));

  const s = (t) => ms(t.start || t.due), e = (t) => ms(t.due || t.start) + DAY;
  let min = Math.min(...tasks.map(s), Date.now()) - 7 * DAY;
  min -= ((new Date(min).getUTCDay() + 6) % 7) * DAY; // back to Monday so weekly gridlines align
  const max = Math.max(...tasks.map(e), Date.now()) + 14 * DAY;
  const W = Math.ceil((max - min) / DAY) * PX, x = (t) => ((t - min) / DAY) * PX;
  const trk = `width:${W}px;background-size:${7 * PX}px 100%`;

  const head = h("div", { class: "g-trk g-grid", style: trk });
  for (let d = new Date(min); +d < max; d = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 1))) {
    const first = Math.max(+d, min);
    head.append(h("span", { class: "g-month", style: `left:${x(first)}px` }, d.toLocaleDateString(undefined, { month: "short", year: "2-digit", timeZone: "UTC" })));
  }
  const rows = [h("div", { class: "g-row g-head" }, h("div", { class: "g-lab" }, "Task"), head)];
  for (const [name, ts] of Map.groupBy(tasks, (t) => t.milestone || "No milestone")) {
    const a = Math.min(...ts.map(s)), b = Math.max(...ts.map(e));
    rows.push(h("div", { class: "g-row g-grp" }, h("div", { class: "g-lab" }, name),
      h("div", { class: "g-trk", style: `width:${W}px` }, h("div", { class: "g-span", style: `left:${x(a)}px;width:${x(b) - x(a)}px` }))));
    for (const t of ts) {
      rows.push(h("div", { class: "g-row" }, h("div", { class: "g-lab", title: t.title }, t.title),
        h("div", { class: "g-trk g-grid", style: trk },
          h("div", { class: "g-bar s-" + t.status, title: `${t.title}\n${fmt(t.start || t.due)} to ${fmt(t.due || t.start)}`,
            style: `left:${x(s(t))}px;width:${x(e(t)) - x(s(t))}px`, onclick: () => taskDialog(t) }))));
    }
  }
  const g = h("div", { class: "gantt" }, rows, h("div", { class: "g-today", style: `left:${220 + x(Date.now())}px` }));
  main.append(g);
  g.scrollLeft = Math.max(0, x(Date.now()) - 200);
}

// ---------- log ----------
async function viewLog(main) {
  const logs = await pb.collection("logs").getFullList({ sort: "-date,-created", expand: "author" });
  main.append(h("div", { class: "bar" }, h("h2", {}, "Research log"),
    canEdit() && h("button", { class: "btn primary", onclick: () => logDialog() }, "New entry")));
  if (!logs.length) main.append(h("p", { class: "empty" }, "No entries yet."));
  for (const l of logs) {
    const slot = h("div");
    const toggle = h("button", { class: "btn link", onclick: async () => { slot.childElementCount ? slot.replaceChildren() : slot.append(await comments("log:" + l.id)); } }, "Discussion");
    main.append(h("div", { class: "entry" }, h("div", { class: "date" }, fmt(l.date)),
      h("div", {}, l.title && h("h3", {}, l.title), h("div", { class: "body" }, l.body),
        h("div", { class: "muted", style: "margin-top:8px;font-size:12px;display:flex;gap:12px" }, l.expand?.author?.name || "",
          toggle, canEdit() && h("button", { class: "btn link", onclick: () => logDialog(l) }, "Edit")), slot)));
  }
}
function logDialog(l = {}) {
  const f = {
    date: h("input", { type: "date", value: day(l.date) || today(), required: true }),
    title: h("input", { value: l.title || "", placeholder: "Optional" }),
    body: h("textarea", { required: true, style: "min-height:160px" }, l.body || ""),
  };
  const d = openDialog(h("form", {
    method: "dialog",
    onsubmit: async (e) => {
      e.preventDefault();
      const data = { date: f.date.value, title: f.title.value, body: f.body.value };
      if (l.id) await pb.collection("logs").update(l.id, data); else await pb.collection("logs").create({ ...data, author: me().id });
      d.close();
    },
  }, field("Date", f.date), field("Title", f.title), field("What happened", f.body),
    h("div", { class: "foot" },
      l.id ? h("button", { type: "button", class: "btn danger", onclick: async () => { if (confirm("Delete this entry?")) { await pb.collection("logs").delete(l.id); d.close(); } } }, "Delete") : h("span"),
      h("span", {}, h("button", { type: "button", class: "btn", onclick: () => d.close() }, "Cancel"), " ", h("button", { class: "btn primary" }, "Save")))));
}

// ---------- paper ----------
async function viewPaper(main) {
  const docs = await pb.collection("docs").getFullList({ sort: "-created" });
  const token = docs.length ? await pb.files.getToken() : "";
  main.append(h("div", { class: "bar" }, h("h2", {}, "Paper")));
  for (const [k, label] of [["paper", "Manuscript"], ["review", "Literature and reviews"], ["figure", "Figures"]]) {
    const rows = docs.filter((d) => d.kind === k);
    if (!rows.length) continue;
    main.append(h("h3", { style: "margin:18px 0 8px" }, label),
      h("div", { class: "list" }, rows.map((d) => h("div", {},
        h("a", { class: "grow", href: pb.files.getURL(d, d.file, { token }), target: "_blank", rel: "noopener" }, d.name),
        h("span", { class: "muted mono" }, d.commit || ""), h("span", { class: "muted" }, fmt(d.created))))));
  }
  if (!docs.length) main.append(h("p", { class: "empty" }, "Nothing published yet. CI uploads the PDF here on every push (see hub/README.md)."));
  main.append(h("h3", { style: "margin:28px 0 8px" }, "Feedback on the manuscript"), await comments("paper"));
}

// ---------- people (admin) ----------
async function viewPeople(main) {
  const users = await pb.collection("users").getFullList({ sort: "created" });
  const roles = ["viewer", "collaborator", "admin"];
  const email = h("input", { type: "email", placeholder: "Email", required: true });
  const name = h("input", { placeholder: "Name" });
  const r = h("select", {}, roles.map((v) => h("option", { value: v }, v)));
  main.append(h("div", { class: "bar" }, h("h2", {}, "People")),
    h("form", { class: "inv", onsubmit: async (e) => {
      e.preventDefault();
      const pw = crypto.randomUUID() + crypto.randomUUID(); // unused: sign-in is by emailed code
      await pb.collection("users").create({ email: email.value, name: name.value, role: r.value, password: pw, passwordConfirm: pw, emailVisibility: true, verified: true });
      render();
    } }, email, name, r, h("button", { class: "btn primary" }, "Invite")),
    h("div", { class: "list" }, users.map((u) => h("div", {},
      h("span", { class: "grow" }, u.name || "", " ", h("span", { class: "muted" }, u.email)),
      h("select", { disabled: u.id === me().id, onchange: (e) => pb.collection("users").update(u.id, { role: e.target.value }) },
        roles.map((v) => h("option", { value: v, selected: v === u.role }, v))),
      u.id !== me().id && h("button", { class: "btn link danger", onclick: async () => { if (confirm("Remove " + u.email + "?")) { await pb.collection("users").delete(u.id); render(); } } }, "Remove")))));
}

// ---------- boot ----------
(async () => {
  if (pb.authStore.isValid) { try { await pb.collection("users").authRefresh(); live(); } catch { pb.authStore.clear(); } }
  render();
})();
