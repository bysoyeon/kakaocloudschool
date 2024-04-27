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

const pw = document.getElementsByClassName("input-box")[0];
const pwch = document.getElementsByClassName("input-box")[1];
const pwtxt = document.querySelectorAll(".helpertxt")[0];
const pwchtxt = document.querySelectorAll(".helpertxt")[1];

const button = document.getElementsByClassName("login-button")[0];

function strongPassword(str) {
  return /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*?_]).{8,20}$/.test(str);
}

//비밀번호 유효성 검사
pw.onkeyup = function () {
  if (pw.value.length > 0) {
    if (strongPassword(pw.value) == false) {
      pwtxt.innerText = "* 8~20자 영문, 숫자, 특수문자를 사용하세요.";
      pwtxt.style.opacity = 1;
    } else {
      pwtxt.style.opacity = 0;
      if (strongPassword(pw.value) == true) {
        button.style.backgroundColor = "#7F6AEE";
        button.classList.add("cursor");
      } else {
        button.style.backgroundColor = "#ACA0EB";
      }
    }
  } else {
    pwtxt.innerText = "* 비밀번호를 입력하세요.";
    pwtxt.style.opacity = 1;
  }
};

//비밀번호 확인 유효성 검사
pwch.onkeyup = function () {
  if (pw.value == pwch.value) {
    pwchtxt.innerText = "* 비밀번호가 확인되었습니다.";
    pwchtxt.style.opacity = 1;
    if (strongPassword(pw.value) == true) {
      button.style.backgroundColor = "#7F6AEE";
      button.classList.add("cursor");
    } else {
      button.style.backgroundColor = "#ACA0EB";
    }
  } else {
    pwchtxt.innerText = "* 비밀번호가 다릅니다.";
    pwchtxt.style.opacity = 1;
  }
};

const toast = document.getElementById("toast");

function toastOn() {
  toast.classList.add("active");
  setTimeout(function () {
    toast.classList.remove("active");
  }, 1000);
}

button.onclick = function () {
  if (pw.value == pwch.value && strongPassword(pw.value) == true) {
    fetch("/api/user/password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user: user, password: pw }),
    }).then((response) => {
      if (!response.errorCode) {
        toastOn();
        console.log("수정완료");
      } else {
        throw new Error("닉네임 수정 시 오류가 발생했습니다.");
      }
    });
  } else {
    alert("비밀번호를 확인하세요.");
  }
};
