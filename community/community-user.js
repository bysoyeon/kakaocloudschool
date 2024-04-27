const user = sessionStorage.getItem("user");

// 뒤로가기 버튼
let back = document.getElementsByClassName("profile-box")[0];

back.onclick = function () {
  window.location.href = `community-conlist.html`;
};
//프로필 박스 클릭 시 옵션 리스트 노출
profile = document.getElementsByClassName("profile-box")[1];
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

nickname = document.getElementsByClassName("input-box")[0];
nicknametxt = document.getElementsByClassName("helpertxt")[1];
button = document.getElementsByClassName("login-button")[0];

// 로그인 유저의 아이디, 닉네임 보여주기
window.addEventListener("load", function () {
  //document 안의 이미지, js 파일 포함 전부 로드가 되었을 경우 실행할 코드
  fetch(`/api/user/${user}`)
    .then((response) => response.json())
    .then((data) => {
      let userNick = data.nickname;
      let userEmail = data.id;
      // console.log(userNick);
      document.querySelector(".usermail").innerText = userEmail;
      nickname.setAttribute("value", userNick);
    })
    .catch((error) => console.error("불러오기 실패", error));
});

//닉네임 유효성 검사 정규식
function korEngNum(str) {
  return /^[ㄱ-ㅎ가-힣a-zA-Z0-9]+$/;
}

//닉네임 유효성 검사
nickname.onkeyup = function () {
  if (nickname.value.length == 0) {
    nicknametxt.innerText = "* 닉네임을 입력하세요.";
    nicknametxt.style.opacity = 1;
  } else if (nickname.value.length < 11) {
    if (nickname.value.includes(" ") == false) {
      nicknametxt.style.opacity = 0;
      console.log("닉네임 유효성 검사 완료");
      button.classList.add("cursor");
    } else {
      nicknametxt.innerText = "* 띄어쓰기를 제거해주세요.";
      nicknametxt.style.opacity = 1;
    }
  } else {
    nicknametxt.innerText = "* 닉네임은 최대 10자까지 가능합니다.";
    nicknametxt.style.opacity = 1;
    alert("닉네임은 최대 10자까지 가능합니다.");
  }
};

const toast = document.getElementById("toast");

function toastOn() {
  toast.classList.add("active");
  setTimeout(function () {
    toast.classList.remove("active");
  }, 1000);
}

// 수정하기 버튼
button.onclick = function () {
  if (nickname.value.length !== 0 && nickname.value.includes(" ") == false) {
    fetch("/api/user/modifyNickname", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user: user, nickname: nickname.value }),
    }).then((response) => {
      if (!response.errorCode) {
        toastOn();
        console.log("수정완료");
      } else {
        throw new Error("닉네임 수정 시 오류가 발생했습니다.");
      }
    });
  } else {
    alert("닉네임을 확인하세요.");
  }
};

// 회원탈퇴 모달 버튼 (취소-확인)
const modalCancel = document.getElementsByClassName("modal-btn-cancel")[0];
const modalComplete = document.getElementsByClassName("modal-btn-complete")[0];
const leave = document.getElementsByClassName("txtlink")[0];

leave.onclick = function () {
  document.getElementsByClassName("modalBackground")[0].style.display = "block";
};

modalCancel.onclick = function () {
  document.getElementsByClassName("modalBackground")[0].style.display = "none";
  console.log("회원탈퇴 취소");
};

modalComplete.onclick = function () {
  window.location.href = "index.html";
  console.log("회원탈퇴 완료");
};

// 프로필 이미지 변경 버튼 클릭 시
document.getElementsByClassName("btn-change")[0].onclick = function () {
  alert("아직 할 줄 몰라요");
};
