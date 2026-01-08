alert("admin.js 有跑");

import { supabase } from "../supabase.js";

const list = document.getElementById("adminList");

async function loadAll() {
  const { data, error } = await supabase
    .from("queue")
    .select("*")
    .order("created_at", { ascending: true });

  alert(
    "data 筆數：" + (data ? data.length : "null") +
    "\nerror：" + (error ? error.message : "沒有")
  );

  list.innerHTML = "";
  (data || []).forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = `${item.nickname}（${item.status}）
      <button data-id="${item.id}" data-action="approve">通過</button>
      <button data-id="${item.id}" data-action="done">完成</button>`;
    list.appendChild(li);
  });
}

list.addEventListener("click", async (e) => {
  if (e.target.tagName !== "BUTTON") return;

  const id = e.target.dataset.id;
  const action = e.target.dataset.action;
  const status = action === "approve" ? "approved" : "done";

  const { error } = await supabase.from("queue").update({ status }).eq("id", id);

  if (error) alert("更新失敗：" + error.message);

  loadAll();
});

// ✅ 只呼叫一次
loadAll();
