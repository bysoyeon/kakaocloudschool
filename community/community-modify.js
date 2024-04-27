const user = sessionStorage.getItem("user");

let title = document.getElementsByClassName("mod-titleint")[0];
let content = document.getElementsByClassName("mod-conint")[0];

let modify = document.getElementsByClassName("modify-button")[0];
let back = document.getElementsByClassName("profile-box")[0];

//뒤로가기
back.onclick = function () {
  window.location.href = `community-detail.html?post=${post}`;
};

//현재 페이지 url의 쿼리스트링을 가져옴.(?부터)
let queryString = window.location.search;
console.log(queryString);

// 쿼리 문자열을 분석하여 객체로 변환
let params = new URLSearchParams(queryString);
console.log(params);

// 특정 매개변수의 값을 가져오기
let post = params.get("post"); // 콘텐츠아이디 값

//수정할 게시글 불러오기
fetch(`/api/board/${post}`)
  .then((response) => response.json())
  .then((data) => {
    title.value = item.title; // 인풋박스의 value 속성 값 변경
    content.innerHTML = item.txt;
  })
  .catch((error) => console.error("Fetch 오류:", error));

content.onkeyup = function () {
  if (title.value.length > 0 && content.value.length > 0) {
    modify.style.backgroundColor = "#7F6AEE";
  } else {
    modify.style.backgroundColor = "#ACA0EB";
  }
};

//게시글 수정하기 버튼
modify.onclick = function () {
  if (title.value.length !== 0 && content.value.length !== 0) {
    let modifyContent = {
      contentsId: post,
      title: title.value,
      txt: content.value,
    };

    fetch("/api/board/modify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(modifyContent),
    })
      .then((response) => {
        if (!response.errorCode) {
          window.location.href = `community-detail.html?user=${user}&post=${post}`;
        } else {
          throw new Error("게시글 수정이 실패되었습니다.");
        }
      })
      .catch((error) => {
        console.error("게시글 수정 중 오류가 발생했습니다.", error);
        alert("게시글 수정에 실패했습니다. 다시 시도해주세요.");
      });
  } else {
    alert("제목 및 내용을 모두 입력하세요.");
  }
};

title.onkeyup = function () {
  if (title.value.length < 27) {
    console.log("게시글 제목 입력");
    if (title.value.length > 0 && content.value.length > 0) {
      modify.style.backgroundColor = "#7F6AEE";
    } else {
      modify.style.backgroundColor = "#ACA0EB";
    }
  } else {
    console.log("입력 글자 수 초과(최대 26글자)");
    alert("제목은 최대 26글자까지 입력 가능합니다.");
  }
};
