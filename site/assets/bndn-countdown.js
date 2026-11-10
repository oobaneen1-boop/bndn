/* Bandan · booklet launch-price countdown popup
 *
 * Main page and /site/booklet/:
 *  - Shows immediately on page open, with a dim backdrop.
 *  - Close with ×, «ربما لاحقاً», a click on the backdrop, or Esc.
 *  - Once per visit (sessionStorage): after she closes it, it stays closed
 *    for that visit; a new visit shows it again.
 *  - ?cd=1 forces it open (test override). It does not override the end date.
 *  - Ends 31 Dec 2026 23:59:59 Asia/Baghdad (UTC+3). After that it never appears.
 *  - CTA → Wayl product page (not WhatsApp).
 */
(function(){
  var END = new Date('2026-12-31T23:59:59+03:00').getTime();
  var KEY = 'bndn_faragh_cd_seen';
  var URL = 'https://bndn.thewayl.com/product/cmwarov8x00dk0j0tal6nyhxi';
  var ASSET = '/bndn/site/assets/';
  if (Date.now() > END) return;                       // launch price over → no popup
  try { if (sessionStorage.getItem(KEY) && !/[?&]cd=1/.test(location.search)) return; } catch(e){}

  var el = document.createElement('div');
  el.className = 'bd-cd';
  el.setAttribute('role','dialog'); el.setAttribute('aria-modal','true'); el.setAttribute('aria-labelledby','bdCdTitle');
  el.innerHTML =
    '<div class="bdc-shade" data-close></div>' +
    '<div class="bdc-card">' +
      '<button class="bdc-x" type="button" aria-label="إغلاق" data-close>×</button>' +
      '<img class="bdc-mono" src="'+ASSET+'bd-monogram.svg" alt="بندن"><div class="bdc-cover">' +
        '<img src="'+ASSET+'booklet-pages.jpg" alt="صفحات كتيّب كورس فنّ الفراغ"></div>' +
      '<div class="bdc-body">' +
        '<div class="bdc-eyebrow">كتيّب تفاعلي · سعر الإطلاق</div>' +
        '<h2 class="bdc-title" id="bdCdTitle">كورس فنّ الفراغ</h2>' +
        '<p class="bdc-text">فراغكِ ليس وقتاً ضائعاً… بل بداية. 43 صفحة تكتبين فيها وتتأمّلين، على إيقاعكِ.</p>' +
        '<div class="bdc-price"><span class="bdc-now">21,000 <small>دينار</small></span>' +
          '<span class="bdc-was">29,000 <small>دينار</small></span>' +
          '<span class="bdc-save">وفّري 8,000</span></div>' +
        '<div class="bdc-timer"><div class="bdc-lbl">سعر الإطلاق ينتهي بعد</div><div class="bdc-units">' +
          '<div class="bdc-u"><b data-u="d">0</b><span>أيام</span></div>' +
          '<div class="bdc-u"><b data-u="h">00</b><span>ساعات</span></div>' +
          '<div class="bdc-u"><b data-u="m">00</b><span>دقائق</span></div>' +
          '<div class="bdc-u"><b data-u="s">00</b><span>ثوانٍ</span></div>' +
        '</div></div>' +
        '<a class="bdc-cta" href="'+URL+'" target="_blank" rel="noopener">اطلبي الكتيّب الآن</a>' +
        '<button class="bdc-later" type="button" data-close>ربما لاحقاً</button>' +
        '<div class="bdc-after">بعد 31 كانون الأول يرجع السعر 29,000 دينار</div>' +
      '</div>' +
    '</div>';
  document.body.appendChild(el);

  var q = function(u){ return el.querySelector('[data-u="'+u+'"]'); };
  var D=q('d'),H=q('h'),M=q('m'),S=q('s'), timer;
  function pad(n){ return (n<10?'0':'')+n; }
  function tick(){
    var t = Math.max(0, Math.floor((END - Date.now())/1000) + 1);  // +1 so 23:59:59 itself still counts
    if (Date.now() > END){ close(); return; }
    D.textContent = Math.floor(t/86400);
    H.textContent = pad(Math.floor(t%86400/3600));
    M.textContent = pad(Math.floor(t%3600/60));
    S.textContent = pad(t%60);
  }
  function close(){
    el.classList.remove('open'); clearInterval(timer);
    document.documentElement.style.overflow='';
    try { sessionStorage.setItem(KEY,'1'); } catch(e){}
  }
  el.addEventListener('click', function(e){ if (e.target.closest('[data-close]')) close(); });
  el.querySelector('.bdc-cta').addEventListener('click', function(){ try{sessionStorage.setItem(KEY,'1');}catch(e){} });
  document.addEventListener('keydown', function(e){
    if (!el.classList.contains('open')) return;
    if (e.key==='Escape') close();
    // The booklet reader also listens for arrows and Esc. Keep those on the page behind the dialog.
    if (e.key==='Escape' || e.key==='ArrowLeft' || e.key==='ArrowRight') { e.preventDefault(); e.stopPropagation(); }
  }, true);

  tick(); timer = setInterval(tick, 1000);
  el.classList.add('open');                            // immediately, no delay
  document.documentElement.style.overflow='hidden';
  el.querySelector('.bdc-cta').focus({preventScroll:true});
})();
