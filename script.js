const wrapper = document.querySelector(".wrapper");

const menu_btn = document.querySelector(".menu_btn");
const back_btn = document.querySelector(".back_btn");

const toggle_btn = () => {
    wrapper.classList.toggle("show-categoria");
};

menu_btn.addEventListener("click", toggle_btn);

back_btn.addEventListener("click", toggle_btn);
