// Foundry의 채팅 메시지 렌더링 후크에 연결하여 메시지 내용 수정
Hooks.on("renderChatMessage", (chatMessage, html, data) => {
  // 채팅 메시지의 HTML 콘텐츠를 가져옴
  let content = html.html();

  // 정규 표현식을 사용하여 markdown-like 형식의 태그를 검색
  // 패턴 설명:
  //   \[( [^\]]+ )\]       -> 대괄호 [] 안의 텍스트 (내용)
  //   \(#"\s*style="([^"]+)"\s*\) -> (#" style="..." ) 형식의 부분에서 style 속성 값 추출
  const regex = /\[([^\]]+)\]\(#"\s*style="([^"]+)"\s*\)/g;

  // 정규표현식에 일치하는 부분을 a 태그로 치환
  let newContent = content.replace(regex, (match, innerText, styleContent) => {
    // 불필요한 공백 제거
    styleContent = styleContent.trim();
    // a 태그 생성, href="#"로 설정하며 클릭 시 기본 동작(페이지 이동)을 막음
    return `<a href="#" style="${styleContent}" onclick="event.preventDefault();">${innerText}</a>`;
  });

  // 변환된 새로운 HTML을 적용하여 채팅 메시지 업데이트
  html.html(newContent);
});
