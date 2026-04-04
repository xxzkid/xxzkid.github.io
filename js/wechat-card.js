document.addEventListener('DOMContentLoaded', function () {
  var postContent = document.querySelector('.post-content')
  if (!postContent) return

  var card = `
    <div style="
      border: 1px solid #e0e0e0;
      border-radius: 16px;
      padding: 24px 28px;
      margin: 48px 0 20px;
      display: flex;
      align-items: center;
      gap: 24px;
      background: linear-gradient(135deg, #f5f7fa 0%, #e8f4fd 100%);
      box-shadow: 0 2px 12px rgba(0,0,0,0.06);
    ">
      <div style="flex-shrink:0;text-align:center;">
        <img 
          src="/img/qrcode-wydz.jpg" 
          style="
            width: 110px;
            height: 110px;
            border-radius: 12px;
            display: block;
            border: 3px solid #fff;
            box-shadow: 0 2px 8px rgba(0,0,0,0.12);
          "
        >
        <div style="
          margin-top: 8px;
          font-size: 11px;
          color: #888;
        ">扫码关注</div>
      </div>
      <div style="flex:1;">
        <div style="
          font-weight: 700;
          font-size: 17px;
          margin-bottom: 10px;
          color: #222;
          display: flex;
          align-items: center;
          gap: 8px;
        ">
          <span style="
            background: #07C160;
            color: white;
            font-size: 11px;
            font-weight: 500;
            padding: 2px 8px;
            border-radius: 20px;
          ">公众号</span>
          Apache王也道长
        </div>
        <div style="color:#555;font-size:14px;line-height:1.9;">
          📌 Java / 后端 / Docker 实战教程<br>
          📌 工具推荐与效率提升<br>
          📌 第一时间获取更新推送
        </div>
        <div style="margin-top:14px;">
        <!-- 
          <a href="https://chromewebstore.google.com" 
             target="_blank" 
             style="
               display: inline-block;
               background: #1a73e8;
               color: white;
               font-size: 13px;
               padding: 6px 16px;
               border-radius: 20px;
               text-decoration: none;
               font-weight: 500;
             ">
            📚 试用 Word Book 单词插件 →
          </a>
        -->
        </div>
      </div>
    </div>
  `

  postContent.insertAdjacentHTML('beforeend', card)
})