document.addEventListener("DOMContentLoaded", () => {
    const submitButton = document.getElementById("submitButton");
    submitButton.addEventListener("click", async (event) => {
        event.preventDefault();
        const input = document.getElementById("movieName").value;
        const div = document.getElementById("results");

        try {
            const response = await fetch(`/movie/${input}`);
            if (response.ok) {
                const data = await response.json();
                Array.from(div.childNodes).forEach(node => {
                    div.removeChild(node);
                });
                data.forEach(movie => {
                    var el = document.createElement("div");
                    el.className = "movie";
                    el.textContent = `${movie.title}. Released: ${movie.releaseDate}.`;
                    var href = document.createElement("img");
                    href.src = `https://image.tmdb.org/t/p/w500/${movie.poster}`;
                    el.appendChild(href);
                    div.appendChild(el);
                });
                div.style.display = "inline-block";
            } else {
                console.error("Error: " + response.status);
                alert(response.status);
            }
        } catch (error) {
            console.error("Error: " + error);
        }
    });
});