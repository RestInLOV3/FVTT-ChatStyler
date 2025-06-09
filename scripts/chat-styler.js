// Foundry의 채팅 메시지 렌더링 후크에 연결하여 메시지 내용 수정 (Foundry VTT v13+)
Hooks.on("renderChatMessageHTML", (chatMessage, htmlElement, data) => {
  // htmlElement는 네이티브 HTMLElement 입니다.

  const contentElement = htmlElement.querySelector('.message-content');

  if (contentElement && contentElement.innerHTML) {
    let content = contentElement.innerHTML; // .message-content 안의 현재 HTML 내용

    // --- 기존: 특정 패턴([내용](#" style="...))을 <a> 태그로 변환하는 로직 ---
    const styleLinkRegex = /\[([^\]]+)\]\(#"\s*style="([^"]+)\)/g; // 정확한 정규식 사용 (닫는 따옴표 포함)

    let processedContent = content.replace(styleLinkRegex, (match, innerText, styleContent) => {
      styleContent = styleContent.trim();
      return `<a href="#" style="${styleContent}" class="my-clickable-style-link">${innerText}</a>`; // 클래스 변경 (이미지 링크와 구분)
    });
    // ---------------------------------------------------------------------


    // --- 새로 추가: 이미지 링크를 <img> 태그로 변환하는 로직 ---
    // 이미지 링크를 찾는 정규 표현식 (간단한 예시)
    const imageLinkRegex = /(?<!<img src=")(https?:\/\/[^\s]+\.(png|jpe?g|gif|webp|bmp))\s*/gi; // 이미지 src 속성 안에 있는 링크는 제외하도록 수정 (lookbehind)

    // 이미지 링크를 <img> 태그로 치환 (변환된 processedContent에 다시 replace 적용)
    processedContent = processedContent.replace(imageLinkRegex, (match, imageUrl) => {
        console.log(`renderChatMessageHTML: 이미지 링크 발견: ${imageUrl}`);
        // 발견된 이미지 링크를 <img> 태그로 변환
        return `<img src="${imageUrl}" style="max-width: 100%; height: auto;"`;
    });
    // --------------------------------------------------------


    // 변환된 최종 HTML을 원래 요소에 적용합니다.
    contentElement.innerHTML = processedContent;


    // *** 변환된 <a> 태그에 이벤트 리스너를 동적으로 추가합니다. ***
    // (이미지 링크 변환과는 별개, 기존 스타일 링크 기능)
    // querySelectorAll을 사용하여 변환된 모든 <a> 태그를 찾습니다.
    // 클래스 이름이 my-clickable-style-link로 변경되었으니 해당 클래스 사용
    const clickableStyleLinks = contentElement.querySelectorAll('.my-clickable-style-link');

    clickableStyleLinks.forEach(link => {
      link.addEventListener('click', (event) => {
        console.log("스타일 링크 클릭됨! 기본 동작 차단!");
        event.preventDefault(); // 링크 클릭 시 기본 동작(페이지 이동)을 차단합니다.
        event.stopPropagation(); // 이벤트 버블링을 막습니다. (필요시)
        // 여기에 스타일 링크 클릭 시 실행하고 싶은 JavaScript 코드를 추가할 수 있습니다.
        // (현재는 페이지 이동만 막고 아무것도 하지 않음)
      });
    });

    // 참고: 이미지 태그에는 별도의 클릭 이벤트 리스너를 추가하지 않습니다.
    // 필요하다면 이미지 클릭 시 확대 등 기능을 여기에 추가할 수 있습니다.


  } else {
      // .message-content 엘리먼트 또는 내용이 없는 경우 (롤 결과 메시지 등)
      // 이런 메시지 유형에는 변환을 적용하지 않습니다.
  }
});
