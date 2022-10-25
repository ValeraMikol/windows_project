import checkNumInputs from "./checknumInputs";

const closeModal = (item) => {
  item.closest(".popup_calc_end").style.display = "none";
  document.body.style.overflow = "scroll";
};

const clearState = (state) => {
  state = {};
};

const forms = (state) => {
  const form = document.querySelectorAll("form"),
    input = document.querySelectorAll("input");

  checkNumInputs('input[name="user_phone"]');

  const messages = {
    loading: "Загрузка...",
    succes: "Спасибо Мы скоро свяжемся!",
    failure: "Что-то пошло не так!",
  };

  let postData = async (url, data) => {
    document.querySelector(".status").textContent = messages.loading;
    let res = await fetch(url, {
      method: "POST",
      body: data,
    });

    return await res.text();
  };

  const clearInputs = () => {
    input.forEach((item) => {
      item.value = "";
    });
  };

  form.forEach((item) => {
    item.addEventListener("submit", (e) => {
      e.preventDefault();

      let statusMessage = document.createElement("div");
      statusMessage.classList.add("status");
      item.appendChild(statusMessage);

      let formData = new FormData(item);
      if (item.getAttribute("data-calc") == "end") {
        for (let key in state) {
          formData.append(key, state[key]);
        }
      }

      postData("assets/server.php", formData)
        .then((res) => {
          console.log(res);
          statusMessage.textContent = messages.succes;
        })
        .catch(() => {
          statusMessage.textContent = messages.failure;
        })
        .finally(() => {
          clearInputs();
          setTimeout(() => {
            statusMessage.remove();
          }, 5000);
          if (item.getAttribute("data-calc") === "end") {
            closeModal(item);
          }
          clearState(state);
        });
    });
  });
};

export default forms;
