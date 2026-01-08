// 假資料（之後會換成 Supabase）
const queueData = [
  { nickname: '小花', status: 'approved' },
  { nickname: '星星', status: 'approved' },
  { nickname: '貓咪', status: 'pending' }
];

const listEl = document.getElementById('queueList');

function renderQueue(data) {
  listEl.innerHTML = '';

  const approved = data.filter(item => item.status === 'approved');
  const pending = data.filter(item => item.status === 'pending');

  // 已通過：有順位
  approved.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'queue-item approved';

    card.innerHTML = `
      <div class="queue-rank">第 ${index + 1} 位</div>
      <div class="queue-name">${item.nickname}</div>
    `;

    listEl.appendChild(card);
  });

  // 待審核：排在最下面
  pending.forEach(item => {
    const card = document.createElement('div');
    card.className = 'queue-item pending';

    card.innerHTML = `
      <div class="queue-name">${item.nickname}</div>
      <span class="queue-badge">待審核</span>
    `;

    listEl.appendChild(card);
  });
}

// 初始渲染
renderQueue(queueData);
