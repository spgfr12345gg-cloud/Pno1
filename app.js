// ลบระบบสลับหน้าเดิมออก เปลี่ยนมาใช้ระบบกดไลค์แบบปกติบนหน้าเว็บ
document.addEventListener('click', function(e) {
    const likeBtn = e.target.closest('.like-btn');
    if (!likeBtn) return;

    const isLiked = likeBtn.getAttribute('data-liked') === 'true';
    const countSpan = likeBtn.querySelector('.count');
    let currentCount = parseInt(countSpan.textContent);

    if (!isLiked) {
        likeBtn.setAttribute('data-liked', 'true');
        likeBtn.classList.add('liked');
        countSpan.textContent = currentCount + 1;
        if (typeof sendLikeToBackend === 'function') sendLikeToBackend(true);
    } else {
        likeBtn.setAttribute('data-liked', 'false');
        likeBtn.classList.remove('liked');
        countSpan.textContent = currentCount - 1;
        if (typeof sendLikeToBackend === 'function') sendLikeToBackend(false);
    }
});