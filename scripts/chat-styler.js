// Foundry의 채팅 메시지 렌더링 후크에 연결하여 메시지 내용 수정 (Foundry VTT v13+)
Hooks.on("renderChatMessageHTML", (chatMessage, htmlElement, data) => {
  const contentElement = htmlElement.querySelector('.message-content');

  if (contentElement && contentElement.innerHTML) {
    let content = contentElement.innerHTML; // .message-content 안의 현재 HTML 내용

    // --- 변환된 최종 HTML 내용을 저장할 변수 ---
    let finalContent = content; // 초기값은 원래 내용


    // --- 0. 기울임꼴, 굵게, 굵고 기울임꼴 변환 로직 추가 ---
    // 주의: 중첩되거나 복잡한 마크다운 문법에는 완벽하게 작동하지 않을 수 있습니다.
    // 간단한 *내용*, **내용**, ***내용*** 패턴에 대해 작동합니다.

    // 굵고 기울임꼴 (***내용***) - 가장 먼저 처리해야 ** 기능이나 * 기능으로 잘못 변환되지 않음
    const boldItalicRegex = /\*\*\*(.+?)\*\*\*/g; // *** 와 *** 사이의 모든 문자 (.+?)
    finalContent = finalContent.replace(boldItalicRegex, (match, innerText) => {
        // innerText는 *** 와 *** 사이의 내용입니다.
        return `<b><i>${innerText}</i></b>`; // 굵고 기울임꼴 HTML 태그
    });

    // 굵게 (**내용**) - *** 기능 처리 후에 처리
    const boldRegex = /\*\*(.+?)\*\*/g; // ** 와 ** 사이의 모든 문자 (.+?)
    finalContent = finalContent.replace(boldRegex, (match, innerText) => {
        // innerText는 ** 와 ** 사이의 내용입니다.
        return `<b>${innerText}</b>`; // 굵게 HTML 태그
    });

    // 기울임꼴 (*내용*) - ***, ** 기능 처리 후에 처리
    const italicRegex = /\*(.+?)\*/g; // * 와 * 사이의 모든 문자 (.+?)
    finalContent = finalContent.replace(italicRegex, (match, innerText) => {
        // innerText는 * 와 * 사이의 내용입니다.
        return `<i>${innerText}</i>`; // 기울임꼴 HTML 태그
    });
    // ---------------------------------------------------------------------


    // --- 1. 기존: 특정 패턴([내용](#" style="...))을 <a> 태그로 변환 ---
    // 이 로직은 마크다운 변환 로직 이후에 적용됩니다.
    const styleLinkRegex = /\[([^\]]+)\]\(#"\s*style="([^"]+)\s*\)/g;

    finalContent = finalContent.replace(styleLinkRegex, (match, innerText, styleContent) => {
      styleContent = styleContent.trim();
      return `<a href="#" style="${styleContent}" class="my-clickable-style-link">${innerText}</a>`;
    });
    // ---------------------------------------------------------------------

    // --- 2. 링크만 단독으로 입력된 경우 이미지 링크인지 확인하여 변환 ---
    // 이 로직은 다른 변환 로직 이후에 적용됩니다.
    const imageLinkOnlyRegex = /^\s*(https?:\/\/[^\s]+\.(png|jpe?g|gif|webp|bmp)(\?.*)?)\s*$/i;

    // 원본 contentElement.textContent의 앞뒤 공백 제거 후 테스트
    if (imageLinkOnlyRegex.test(contentElement.textContent.trim())) {
         const imageUrl = contentElement.textContent.trim().match(imageLinkOnlyRegex)[1];
         // console.log(`renderChatMessageHTML: 이미지 링크 단독 메시지 감지 및 이미지 변환: ${imageUrl}`);
         // 메시지 내용 전체를 이미지 태그로 대체
         // 이미지 태그에 클래스 추가 및 클릭 불가능 스타일 적용
         finalContent = `<img src="${imageUrl}" class="my-clickable-style-img" style="max-width: 100%; height: auto; pointer-events: none; cursor: default;">`;
    }
    // ---------------------------------------------------------------------


    // 변환된 최종 HTML을 원래 요소의 innerHTML에 적용합니다.
    contentElement.innerHTML = finalContent;


    // *** 변환된 <a> 태그 및 <img> 태그에 이벤트 리스너를 동적으로 추가합니다. ***
    const clickableElements = contentElement.querySelectorAll('.my-clickable-style-link, .my-clickable-style-img');

    clickableElements.forEach(element => {
      element.addEventListener('click', (event) => {
        console.log("클릭 가능한 요소 클릭됨! 기본 동작 차단!");
        event.preventDefault();
        event.stopPropagation();
      });
    });

  } else {
      // .message-content 엘리먼트 또는 내용이 없는 경우
  }
});
