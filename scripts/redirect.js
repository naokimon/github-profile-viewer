const form = document.getElementById("search-form");


form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const query = e.target.search.value;

    window.location.replace(`../user.html?user=${query}`);
})