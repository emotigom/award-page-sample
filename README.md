const button = document.querySelector("#messageButton");
const message = document.querySelector("#messageText");

if (button && message) {
  button.addEventListener("click", () => {
    message.textContent = "좋아요. 미리보기에서 바뀐 내용을 확인하고 제출해 봅시다.";
  });
}
