Hooks.on("renderChatMessageHTML", (chatMessage, htmlElement, data) => {

  const contentElement = htmlElement.querySelector('.message-content');

  if (contentElement && contentElement.innerHTML) {
    let content = contentElement.innerHTML;


    const regex = /\[([^\]]+)\]\(#"\s*style="([^"]+)\)/g;

    // 임시 컨테이너를 사용하여 변환 및 이벤트 리스너 추가
    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = content; // 현재 내용을 임시 컨테이너에 넣습니다.

    // 임시 컨테이너 안의 HTML 문자열에서 패턴을 찾아 변환
    // replace 메소드를 문자열에 적용합니다.
    tempContainer.innerHTML = tempContainer.innerHTML.replace(regex, (match, innerText, styleContent) => {
      styleContent = styleContent.trim();
      return `<a href="#" style="${styleContent}" class="my-clickable-link">${innerText}</a>`; // 클래스 추가
    });

    // 변환된 HTML을 원래 요소에 적용합니다.
    contentElement.innerHTML = tempContainer.innerHTML;

    // *** 변환된 <a> 태그에 이벤트 리스너를 동적으로 추가합니다. ***
    // querySelectorAll을 사용하여 변환된 모든 <a> 태그를 찾습니다.
    const clickableLinks = contentElement.querySelectorAll('.my-clickable-link'); // 추가한 클래스 사용

    clickableLinks.forEach(link => {
      link.addEventListener('click', (event) => {
        event.preventDefault(); // 링크 클릭 시 기본 동작(페이지 이동)을 차단합니다.
        event.stopPropagation(); // 이벤트 버블링을 막습니다. (필요시)
        // 여기에 링크 클릭 시 실행하고 싶은 JavaScript 코드를 추가할 수 있습니다.
      });
    });

  } else {
      // .message-content 엘리먼트 또는 내용이 없는 경우
  }
});
