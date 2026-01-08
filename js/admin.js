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

  const rows = data || [];

  // 先把 approved 的順位算出來（用 created_at 先後順序）
  const approvedIdsInOrder = rows
    .filter((r) => r.status === "approved")
    .map((r) => r.id);

  const rankMap = new Map();
  approvedIdsInOrder.forEach((id, idx) => rankMap.set(id, idx + 1));

  list.innerHTML = "";

  rows.forEach((item) => {
    // done 的不顯示（如果你想後台也不顯示，直接跳過）
    if (item.status === "done") return;

    const li = document.createElement("li");

    let badge = "";
    if (item.status === "pending") badge = "（待審核）";
    if (item.status === "approved") badge = `（第 ${rankMap.get(item.id)} 位）`;

    li.innerHTML = `
      <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap;">
        <b>${item.nickname}</b>
        <span>狀態：${item.status} ${badge}</span>
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
    const { error } = await supabase
      .from("queue")
      .update({ status: "approved" })
      .eq("id", id);

    if (error) {
      alert("通過失敗：" + error.message);
      return;
    }
  }

  if (action === "done") {
    // ✅ 方案1：標記 done
    const { error } = await supabase
      .from("queue")
      .update({ status: "done" })
      .eq("id", id);

    // ✅ 方案2：直接刪除（如果你希望完成就消失得更乾淨）
    // const { error } = await supabase.from("queue").delete().eq("id", id);

    if (error) {
      alert("完成失敗：" + error.message);
      return;
    }
  }

  loadAll();
});

loadAll();

