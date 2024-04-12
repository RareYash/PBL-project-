document.addEventListener("mousemove", function(event) {
    const magnifyingGlass = document.querySelector(".magnifying-glass");
    const magnifiedContent = document.querySelector(".magnifying-glass img");
    
    magnifyingGlass.style.display = "block";
    magnifyingGlass.style.top = (event.clientY - 60) + "px"; // Adjust the offset if needed
    magnifyingGlass.style.left = (event.clientX - 60) + "px"; // Adjust the offset if needed
    
    magnifiedContent.style.left = -event.clientX + "px";
    magnifiedContent.style.top = -event.clientY + "px";
});
