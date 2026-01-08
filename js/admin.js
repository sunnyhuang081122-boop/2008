import { supabase } from "../supabase.js";

const list = document.getElementById("adminList");

async function loadAll() {
  const { data, error } = await supabase
    .from("queue")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    alert("讀取失敗：" + error.message);
    return;
  }

  list.innerHTML = "";
  (data || []).forEach((item) => {
    const li = document.createElement("li");

    const numText =
      item.status === "approved" && item.queue_number
        ? `（第 ${item.queue_number} 單）`
        : "";

    li.innerHTML = `
      <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap;">
        <b>${item.nickname}</b>
        <span>狀態：${item.status}${numText}</span>
        <button data-id="${item.id}" data-action="approve">通過</button>
        <button data-id="${item.id}" data-action="done">完成</button>
      </div>
    `;
    list.appendChild(li);
  });
}

list.addEventListener("click", async (e) => {
  if (e.target.tagName !== "BUTTON") return;

  const id = e.target.dataset.id;
  const action = e.target.dataset.action;

  if (action === "approve") {
    // 1) 算下一個 queue_number
    const { data: approvedList, error: countErr } = await supabase
      .from("queue")
      .select("id")
      .eq("status", "approved");

    if (countErr) {
      alert("計算排單數量失敗：" + countErr.message);
      return;
    }

    const nextNumber = (approvedList?.length || 0) + 1;

    // 2) 更新狀態 + 寫入 queue_number
    const { error: upErr } = await supabase
      .from("queue")
      .update({ status: "approved", queue_number: nextNumber })
      .eq("id", id);

    if (upErr) {
      alert("通過失敗：" + upErr.message);
      return;
    }
  }

  if (action === "done") {
    const { error: upErr } = await supabase
      .from("queue")
      .update({ status: "done" })
      .eq("id", id);

    if (upErr) {
      alert("完成失敗：" + upErr.message);
      return;
    }
  }

  loadAll();
});

loadAll();

