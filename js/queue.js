import{supabase}from'../supabase.js';const list=document.getElementById('queueList');const btn=document.getElementById('join');async function loadQueue(){const{data}=await supabase.from('queue').select('*').eq('status','approved').order('created_at');list.innerHTML='';data&&data.forEach((item,index)=>{const li=document.createElement('li');li.textContent=`第 ${index+1} 位：${item.nickname}`;list.appendChild(li)})}btn.addEventListener('click',async()=>{const nickname=document.getElementById('nickname').value;if(!nickname)return alert('請輸入暱稱');await supabaseconst { data, error } = await supabase
  .from('queue')
  .insert([
    {
      nickname: nickname,
      status: 'pending'
    }
  ])
  .select();

alert(
  "insert 測試結果\n" +
  "data 筆數：" + (data ? data.length : 0) + "\n" +
  "error：" + (error ? error.message : "沒有")
);

console.log("insert data:", data);
console.log("insert error:", error);
alert('已送出，等待審核');document.getElementById('nickname').value=''});loadQueue();
