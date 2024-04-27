let id = document.getElementsByClassName("input-box")[0];
let pw = document.getElementsByClassName("input-box")[1];
let loginbtn = document.getElementsByClassName("login-button")[0];

function loginEmail(str) {
  return /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-za-z0-9\-]+/.test(str);
}

function strongPassword(str) {
  return /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*?_]).{8,20}$/.test(str);
}

//아이디 유효성 검사
id.onkeyup = function () {
  //값을 입력한 경우
  if (id.value.length > 0) {
    //이메일 형식이 아닌 경우
    if (loginEmail(id.value) === false) {
      document.querySelector(".helpertxt").innerText =
        "* 올바른 이메일 주소 형식을 입력하세요. (예: example@example.com)";
      document.querySelector(".helpertxt").style.opacity = 1;
    } else {
      document.querySelector(".helpertxt").style.opacity = 0;
      //아이디, 비번 모두 유효성 검사 통과하면 버튼 색상 변경
      if (loginEmail(id.value) == true && strongPassword(pw.value) == true) {
        loginbtn.style.backgroundColor = "#7F6AEE";
      }
    }
  }
};

//비밀번호 유효성 검사
pw.onkeyup = function () {
  if (pw.value.length > 0) {
    if (strongPassword(pw.value) === false) {
      document.querySelector(".helpertxt").innerText =
        "* 8~20자 영문, 숫자, 특수문자를 사용하세요.";
      document.querySelector(".helpertxt").style.opacity = 1;
    } else {
      document.querySelector(".helpertxt").style.opacity = 0;
      //아이디, 비번 모두 유효성 검사 통과하면 버튼 색상 변경
      if (loginEmail(id.value) == true && strongPassword(pw.value) == true) {
        loginbtn.style.backgroundColor = "#7F6AEE";
        loginbtn.classList.add("cursor");
      }
    }
  } else {
    document.querySelector(".helpertxt").innerText = "* 비밀번호를 입력하세요.";
    document.querySelector(".helpertxt").style.opacity = 1;
  }
};

//로그인 버튼 클릭
loginbtn.onclick = function () {
  const loginInf = {
    id: id.value,
    pw: pw.value,
  };
  fetch("/api/user/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginInf),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data) {
        sessionStorage.setItem("user", data.user); // 세션 정보 확인 필요
        window.location.href = "community-conlist.html";
      } else {
        console.log("id, pw가 일치하지 않습니다.");
      }
    });
};
