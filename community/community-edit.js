const user = sessionStorage.getItem("user");

//뒤로가기 버튼
let back = document.getElementsByClassName("profile-box")[0];

back.onclick = function () {
  window.location.href = `community-conlist.html`;
};

const title = document.getElementsByClassName("mod-titleint")[0];
const content = document.getElementsByClassName("mod-conint")[0];

const upload = document.getElementsByClassName("login-button")[0];

upload.onclick = function () {
  if (title.value.length !== 0 && content.value.length !== 0) {
    // 게시글 등록 기능 구현 필요
    let newContent = {
      title: title.value,
      txt: content.value,
      user: user,
    };
    /*
    // 새로운 게시글 등록 - 에러남.
    fetch("api/board/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newContent),
    })
      .then((response) => {
        let resData = response;
        console.log(resData);
        if (!response.errorCode) {
          alert("게시글이 성공적으로 저장되었습니다.");
          let post = resData.contentsId;
          console.log(post);
          window.location.href = `community-detail.html?post=${post}`; //post 스트링 쿼리 추가 필요
          console.log("게시글 등록 완료");
        } else {
          throw new Error("게시글 저장이 실패되었습니다.");
        }
      })
      .catch((error) => {
        console.error("게시글 저장 중 오류가 발생했습니다.", error);
        alert("게시글 등록에 실패했습니다. 다시 시도해주세요.");
      });
*/

    // 새로운 게시글 등록 - GPT
    fetch("api/board/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newContent),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("서버 응답 오류: " + response.status);
        }
        return response.json(); // JSON 데이터 추출
      })
      .then((resData) => {
        console.log(resData);
        if (!resData.errorCode) {
          alert("게시글이 성공적으로 저장되었습니다.");
          let post = resData.contentsId;
          console.log(post);
          window.location.href = `community-detail.html?post=${post}`;
          console.log("게시글 등록 완료");
        } else {
          throw new Error("게시글 저장이 실패되었습니다.");
        }
      })
      .catch((error) => {
        console.error("게시글 저장 중 오류가 발생했습니다.", error);
        alert("게시글 등록에 실패했습니다. 다시 시도해주세요.");
      });
  } else {
    alert("제목 및 내용을 모두 입력하세요.");
  }
};

title.onkeyup = function () {
  if (title.value.length < 27) {
    console.log("게시글 제목 입력");
    if (title.value.length > 0 && content.value.length > 0) {
      upload.style.backgroundColor = "#7F6AEE";
    } else {
      upload.style.backgroundColor = "#ACA0EB";
    }
  } else {
    console.log("입력 글자 수 초과(최대 26글자)");
    alert("제목은 최대 26글자까지 입력 가능합니다.");
  }
};

content.onkeyup = function () {
  if (title.value.length > 0 && content.value.length > 0) {
    upload.style.backgroundColor = "#7F6AEE";
  } else {
    upload.style.backgroundColor = "#ACA0EB";
  }
};
