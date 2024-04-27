const user = sessionStorage.getItem("user");

//게시글 작성 버튼
let editBtn = document.querySelector(".btn-edit");
//마우스 오버 시 색상 변경
editBtn.onmouseover = function () {
  editBtn.style.backgroundColor = "#7F6AEE";
};
editBtn.onmouseout = function () {
  editBtn.style.backgroundColor = "#ACA0EB";
};

editBtn.onclick = function () {
  window.location.href = `community-edit.html`;
};

//프로필 박스 클릭 시 옵션 리스트 노출
profile = document.getElementsByClassName("profile-pic")[0];
option = document.getElementsByClassName("opt-pos")[0];

profile.onmouseover = function () {
  profile.classList.add("cursor");
};

profile.onclick = function () {
  option.classList.toggle("hide");
};
// 옵션박스 회원정보수정,비밀번호수정 클릭
document.getElementsByClassName("opt-box")[0].onclick = function () {
  window.location.href = `community-user.html`;
};
document.getElementsByClassName("opt-box")[1].onclick = function () {
  window.location.href = `community-password.html`;
};

//콘텐츠 목록 div 박스 추가
function createBox(item) {
  let newDiv = document.createElement("div");
  newDiv.classList.add("content-box", "cursor");

  fetch(`/api/user/${item.user}`)
    .then((response) => response.json())
    .then((data) => {
      let nickname = data.nickname;
      newDiv.innerHTML = `
      <div>
      <p class="con-title">${item.title}</p>
      <p class="con-react">좋아요 ${item.like}   댓글 ${item.comment}   조회수 ${item.view}</p>
      <p class="write-date" style="float: right;">${item.modifyDate}</p>
      <div style="clear: both;"></div>
      </div>
      <hr class="horizontal-rule" >
      <div class="list-profile">
      <div class="profile-box">
          <img class="profile-pic" src="images/graycircle.png" >
      </div>
      <p class="list-user">${nickname}</p>
      </div>`;
    });

  //newDiv를 'contents' 클래스를 가지고 있는 <article> 태그 안에 삽입
  document.querySelector("article.contents").append(newDiv);

  // 클릭 시 해당 게시글로 이동
  newDiv.onclick = function () {
    window.location.href = `community-detail.html?post=${item.contentsId}`;
  };
}

fetch("/api/board/list")
  .then((response) => response.json())
  .then((data) => {
    console.log(data);

    //콘텐츠 개수만큼 반복
    for (let i = 0; i < data.length; i++) {
      //삭제 여부 확인
      if (data[i].delete == "n") {
        createBox(data[i]);
      }
    }
  });
