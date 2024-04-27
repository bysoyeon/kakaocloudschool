const user = sessionStorage.getItem("user");

// 뒤로가기 버튼
let back = document.getElementsByClassName("profile-box")[0];

back.onclick = function () {
  window.location.href = `community-conlist.html`;
};

// 게시글 수정-삭제 버튼
const contentModBtn = document.getElementsByClassName("btn-rel")[0];
const contentDelBtn = document.getElementsByClassName("btn-rel")[1];

// 게시글 삭제 모달 버튼 (취소-확인)
const modalConCancel = document.getElementsByClassName("modal-btn-cancel")[0];
const modalConComplete =
  document.getElementsByClassName("modal-btn-complete")[0];
// 댓글 삭제 모달 버튼 (취소-확인))
const modalCmtCancel = document.getElementsByClassName("modal-btn-cancel")[1];
const modalCmtComplete =
  document.getElementsByClassName("modal-btn-complete")[1];

//댓글 등록 버튼
const cmtSubBtn = document.getElementsByClassName("comment-sub-btn")[0];
const comment = document.getElementsByClassName("comment-int")[0]; //댓글 입력창

//현재 페이지 url의 쿼리스트링을 가져옴.(?부터)
let queryString = window.location.search;
// console.log(queryString);

// 쿼리 문자열을 분석하여 객체로 변환
let params = new URLSearchParams(queryString);
// console.log(params);

// 특정 매개변수의 값을 가져오기
let post = params.get("post"); // 콘텐츠아이디 값

//----------------------------- 게시글 ---------------------------
// 게시글 수정
contentModBtn.onclick = function () {
  window.location.href = `community-modify.html?post=${post}`;
};

// 게시글 삭제 버튼 클릭 시 모달창 노출
contentDelBtn.onclick = function () {
  document.getElementsByClassName("modalBackground")[0].style.display = "block";

  modalConCancel.onclick = function () {
    // 취소
    document.getElementsByClassName("modalBackground")[0].style.display =
      "none";
    console.log("게시글 삭제 취소");
  };

  // 게시글 삭제 - 모달창
  modalConComplete.onclick = function () {
    // 완료
    document.getElementsByClassName("modalBackground")[0].style.display =
      "none";

    fetch("/api/board/remove", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ contentsId: post }),
    })
      .then((response) => {
        if (!response.errorCode) {
          alert("게시글이 삭제 되었습니다");
          window.location.href = `community-conlist.html`;
        } else {
          throw new Error("게시글 삭제 시 오류가 발생했습니다.");
        }
      })
      .catch((error) => {
        console.error("게시글 삭제 중 오류가 발생했습니다:", error);
        alert("게시글 삭제 중 오류가 발생했습니다. 다시 시도해주세요.");
      });

    console.log("게시글 삭제");
  };
};

// ----------------------------------- 댓글 --------------------------

// 댓글 입력 시 버튼 색상 변경
comment.onkeyup = function () {
  if (comment.value.length > 0) {
    cmtSubBtn.style.backgroundColor = "#7F6AEE";
    cmtSubBtn.classList.add("cursor");
  } else {
    cmtSubBtn.style.backgroundColor = "#ACA0EB";
    cmtSubBtn.classList.remove("cursor");
  }
};

//-------------------------- 댓글 등록 -------------------------
//댓글 등록 버튼
cmtSubBtn.onclick = function () {
  if (comment.value.length == 0) {
    alert("댓글을 입력하세요");
  } else {
    let newCmt = {
      contentsId: post,
      txt: comment.value,
      userNum: user,
    };

    // 새로운 댓글 등록
    fetch("/api/board/comment/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newCmt),
    })
      .then((response) => {
        if (!response.errorCode) {
          alert("댓글이 성공적으로 저장되었습니다.");
          location.reload();
          console.log("댓글 등록 완료");
        } else {
          throw new Error("댓글 저장이 실패되었습니다.");
        }
      })
      .catch((error) => {
        console.error("댓글 저장 중 오류가 발생했습니다:", error);
        alert("댓글 저장에 실패했습니다. 다시 시도해주세요.");
      });
  }
};
//-------------------------------------------------------------

let title = document.getElementsByClassName("con-title")[0]; //제목
let writer = document.getElementsByClassName("list-user")[0]; // 게시글 작성자
let date = document.getElementsByClassName("write-date")[0]; // 게시글 작성시간
let contentTxt = document.getElementsByClassName("detail-text")[0]; //게시글 내용

// 게시글 내용 불러와서 보여주기
function loadContent(item) {
  fetch(`/api/user/${item.user}`)
    .then((response) => response.json())
    .then((data) => {
      let nickname = data.nickname;

      title.innerHTML = item.title;
      writer.innerHTML = nickname;
      date.innerHTML = item.modifyDate;
      contentTxt.innerHTML = `<p>${item.txt}</p>`;
      document.getElementsByClassName("detail-view")[0].innerHTML =
        `<p style="font-size: 20px; font-weight: 700;">${item.view}</p>
         <p style="font-size: 16px; font-weight: 700;">조회수</p>`;
      document.getElementsByClassName("detail-view")[1].innerHTML =
        `<p style="font-size: 20px; font-weight: 700;">${item.comment}</p>
         <p style="font-size: 16px; font-weight: 700;">댓글</p>`;

      console.log("콘텐츠 가져오기 완료");
    });

  if (user == item.user) {
    document
      .getElementsByClassName("profile-right")[1]
      .classList.remove("hide");
  }
}

// 댓글 박스 삽입
function createCmtBox(c) {
  let newDiv = document.createElement("div");
  newDiv.classList.add("detail-comment");

  fetch(`/api/user/${c.userNum}`)
    .then((response) => response.json())
    .then((data) => {
      let nickname = data.nickname;

      if (c.userNum == user) {
        newDiv.innerHTML = `
          <div>
              <div class="list-profile">
                  <div class="profile-box">
                      <img class="profile-pic" src="images/graycircle.png" >
                  </div>
                  <p class="list-user">${nickname}</p>
                  <p class="write-date">${c.ModifyDate}</p>
              </div>
              <p class="cmt-content">${c.txt}</p>
          </div>
          <!--게시글을 작성한 유저인 경우에만 버튼 노출-->
          <div style="margin-left: auto;">
              <button class="btn-rel" data-edit-seq=${c.seq}>수정</button>
              <button class="btn-rel" data-remove-seq=${c.seq}>삭제</button>
          </div>`;
      } else {
        newDiv.innerHTML = `
          <div>
              <div class="list-profile">
                  <div class="profile-box">
                      <img class="profile-pic" src="images/graycircle.png" >
                  </div>
                  <p class="list-user">${nickname}</p>
                  <p class="write-date">${c.ModifyDate}</p>
              </div>
              <p class="cmt-content">${c.txt}</p>
          </div>`;
      }

      //newDiv를 'contents' 클래스를 가지고 있는 <article> 태그 안에 삽입
      document.querySelector("article.contents").append(newDiv);
    });
  // console.log("데이터 확인 : ", document.querySelector("[data-edit-seq]"));
}

// 게시글&댓글 불러오기
fetch(`/api/board/${post}`)
  .then((response) => response.json())
  .then((data) => {

    loadContent(data);

    // 불러온 게시글의 콘텐츠 아이디를 가지고 있는 댓글 목록만 불러오기
    let commentList = data.commentList;
    for (let k = 0; k < commentList.length; k++) {
      createCmtBox(commentList[k]);
    }

    // 댓글 수정버튼 클릭 이벤트 할당
    let commentEditBtns = document.querySelectorAll("[data-edit-seq]");

    commentEditBtns.forEach(function (btn) {
      console.log(btn);
      btn.on('click', function () {
        alert('Hello');
      });
      // 댓글 수정 버튼을 클릭하면
      btn.onclick = function () {
        alert('Hello');
        let seq = this.getAttribute("data-edit-seq");
        let modifyComment = commentList.find((x) => x.seq == seq);

        // 수정할 댓글을 댓글창에 노출하고 댓글등록 버튼을 수정버튼으로 변경
        comment.setAttribute("value", modifyComment.txt);
        cmtSubBtn.innerHTML = "댓글 수정";

        cmtSubBtn.onclick = function () {
          if (comment.value.length == 0) {
            alert("수정할 댓글을 입력하세요");
          } else {
            let modCmt = { seq: seq, txt: comment.value };

            fetch("/api/board/comment/modify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(modCmt),
            })
              .then((response) => {
                if (!response.errorCode) {
                  alert("댓글이 성공적으로 수정되었습니다.");
                  location.reload();
                  console.log("댓글 수정 완료");
                } else {
                  throw new Error("댓글 수정이 실패되었습니다.");
                }
              })
              .catch((error) => {
                console.error("댓글 수정 중 오류가 발생했습니다:", error);
                alert("댓글 수정에 실패했습니다. 다시 시도해주세요.");
              });
          }
        }; // 댓글 수정 작업 종료
      };

      // 댓글 삭제버튼 클릭 이벤트 할당
      let commentRemoveBtns = document.querySelectorAll("[data-remove-seq]");
      commentRemoveBtns.forEach(function (btn) {
        btn.onclick = function () {
          let removeSeq = this.getAttribute("data-remove-seq");
          document.getElementsByClassName("modalBackground")[1].style.display =
            "block";
          // 댓글 삭제 모달 - 취소버튼
          modalCmtCancel.onclick = function () {
            document.getElementsByClassName(
              "modalBackground"
            )[1].style.display = "none";
            console.log("댓글 삭제 취소");
          };

          // 댓글 삭제 모달 - 확인버튼(댓글 삭제처리)
          modalCmtComplete.onclick = function () {
            document.getElementsByClassName(
              "modalBackground"
            )[1].style.display = "none"; //모달창 미노출

            //댓글 삭제처리
            fetch("/api/board/comment/remove", {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                seq: removeSeq,
              }),
            })
              .then((response) => {
                if (!response.errorCode) {
                  alert("댓글이 삭제 되었습니다.");
                  location.reload();
                  console.log("댓글 삭제");
                } else {
                  throw new Error("댓글 삭제 시 오류가 발생했습니다.");
                }
              })
              .catch((error) => {
                console.error("댓글 삭제 중 오류가 발생했습니다:", error);
                alert("댓글 삭제 중 오류가 발생했습니다. 다시 시도해주세요.");
              });
          };
        };
      });
    });
  })
  .catch((error) => console.error("Fetch 오류:", error));
