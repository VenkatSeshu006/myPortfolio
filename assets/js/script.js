'use strict';



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });



// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

select.addEventListener("click", function () { elementToggleFunc(this); });

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);

  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {

  for (let i = 0; i < filterItems.length; i++) {

    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }

  }

}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {

  filterBtn[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;

  });

}



// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");
const formStatus = document.querySelector("[data-form-status]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {

    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }

  });
}

form.addEventListener("submit", async function (event) {
  if (!window.location.protocol.startsWith("http")) return;

  event.preventDefault();
  formBtn.setAttribute("disabled", "");
  formStatus.className = "form-status";
  formStatus.textContent = "Sending your message...";

  try {
    const response = await fetch(form.getAttribute("action") || window.location.pathname, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(new FormData(form)).toString()
    });

    if (!response.ok) {
      throw new Error(`Form submission failed with status ${response.status}`);
    }

    form.reset();
    formBtn.setAttribute("disabled", "");
    formStatus.className = "form-status is-success";
    formStatus.textContent = "Thanks for reaching out. Your message has been sent successfully.";
  } catch (error) {
    formStatus.className = "form-status is-error";
    formStatus.textContent = "We could not send your message. Please try again or contact me directly.";
    if (form.checkValidity()) formBtn.removeAttribute("disabled");
    console.error("Netlify form submission failed:", error);
  }
});


// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {

    for (let i = 0; i < pages.length; i++) {
      if (this.innerHTML.toLowerCase() === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }

  });
}



// Interactive Grid Background Animation - Performance Optimized
document.addEventListener('DOMContentLoaded', function() {
  
  // Create interactive background container
  const interactiveBg = document.createElement('div');
  interactiveBg.className = 'interactive-bg';
  document.body.appendChild(interactiveBg);
  
  // Create enhanced cursor effects
  const cursorGlow = document.createElement('div');
  cursorGlow.className = 'cursor-glow';
  document.body.appendChild(cursorGlow);
  
  // Colors for grid cells
  const colors = ['purple', 'pink', 'cyan', 'orange', 'green'];
  const gridCells = [];
  let isAnimating = false;
  
  // Performance variables
  let mouseX = 0;
  let mouseY = 0;
  let lastUpdateTime = 0;
  const updateThreshold = 16; // ~60fps
  
  // Calculate grid dimensions based on viewport
  function calculateGridSize() {
    const cellSize = 50;
    const gap = 2;
    const padding = 20;
    
    // Device-specific optimization for lower-end devices
    const isLowEndDevice = window.devicePixelRatio <= 1 || window.innerWidth < 1024;
    const maxCols = isLowEndDevice ? 20 : 25;
    const maxRows = isLowEndDevice ? 12 : 15;
    
    const cols = Math.min(Math.floor((window.innerWidth - padding * 2) / (cellSize + gap)), maxCols);
    const rows = Math.min(Math.floor((window.innerHeight - padding * 2) / (cellSize + gap)), maxRows);
    
    return { cols, rows };
  }
  
  // Create grid cells
  function createGrid() {
    // Clear existing grid
    interactiveBg.innerHTML = '';
    gridCells.length = 0;
    
    const { cols, rows } = calculateGridSize();
    
    // Update CSS grid
    interactiveBg.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    interactiveBg.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    
    // Create cells with pre-calculated positions
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const cell = document.createElement('div');
        const colorClass = colors[Math.floor(Math.random() * colors.length)];
        cell.className = `grid-cell ${colorClass}`;
        
        interactiveBg.appendChild(cell);
        gridCells.push({
          element: cell,
          row: row,
          col: col,
          color: colorClass,
          isHighlighted: false,
          opacity: 0.05
        });
      }
    }
    
    // Pre-calculate cell positions for performance
    setTimeout(() => {
      gridCells.forEach(cell => {
        const rect = cell.element.getBoundingClientRect();
        cell.centerX = rect.left + rect.width / 2;
        cell.centerY = rect.top + rect.height / 2;
      });
    }, 100);
  }
  
  // Throttled update function for performance
  function updateGrid() {
    if (isAnimating) return;
    isAnimating = true;
    
    requestAnimationFrame(() => {
      const currentTime = performance.now();
      
      gridCells.forEach(cell => {
        if (!cell.centerX || !cell.centerY) return; // Skip if positions not calculated
        
        const distance = Math.sqrt(
          Math.pow(mouseX - cell.centerX, 2) + 
          Math.pow(mouseY - cell.centerY, 2)
        );
        
        const maxDistance = 120; // Reduced for better performance
        let newOpacity = 0.05;
        let shouldHighlight = false;
        
        if (distance < maxDistance) {
          const intensity = 1 - (distance / maxDistance);
          newOpacity = 0.1 + (intensity * 0.6);
          shouldHighlight = intensity > 0.5;
        }
        
        // Only update if there's a significant change
        if (Math.abs(cell.opacity - newOpacity) > 0.05 || cell.isHighlighted !== shouldHighlight) {
          cell.element.style.opacity = newOpacity;
          cell.opacity = newOpacity;
          
          if (shouldHighlight !== cell.isHighlighted) {
            cell.element.classList.toggle('highlight', shouldHighlight);
            cell.isHighlighted = shouldHighlight;
          }
        }
      });
      
      isAnimating = false;
    });
  }
  
  // Optimized mouse movement tracking
  let mouseMoveTimeout;
  document.addEventListener('mousemove', function(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Update cursor glow immediately for responsiveness
    cursorGlow.style.transform = `translate(${mouseX - 150}px, ${mouseY - 150}px)`;
    
    // Throttle grid updates
    const currentTime = performance.now();
    if (currentTime - lastUpdateTime > updateThreshold) {
      updateGrid();
      lastUpdateTime = currentTime;
    }
  });
  
  // Handle window resize with debouncing
  let resizeTimeout;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      createGrid();
    }, 300);
  });
  
  // Simplified touch support
  document.addEventListener('touchmove', function(e) {
    if (e.touches.length > 0) {
      mouseX = e.touches[0].clientX;
      mouseY = e.touches[0].clientY;
      cursorGlow.style.transform = `translate(${mouseX - 150}px, ${mouseY - 150}px)`;
      updateGrid();
    }
  }, { passive: true });
  
  // Simplified random animation
  function animateRandomCells() {
    const randomCells = gridCells
      .filter(() => Math.random() < 0.01) // Reduced frequency
      .slice(0, 2); // Fewer cells
    
    randomCells.forEach(cell => {
      cell.element.classList.add('pulse');
      setTimeout(() => {
        cell.element.classList.remove('pulse');
      }, 1500);
    });
  }
  
  // Reduced frequency of random animations
  setInterval(animateRandomCells, 10000);
  
  // Initialize
  createGrid();
  
});