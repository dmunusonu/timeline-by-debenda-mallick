// Select the timeline line element
const line = document.querySelector(".timeline-innerline");

// Select the timeline container and all individual timeline items
let target1 = document.querySelector(".timeline ul");
let target2 = document.querySelectorAll(".timeline ul li");
const timeline_events = document.querySelectorAll("ul li");

// Initialize counters for progress tracking
let i = 0;
let i2 = 1;

// Function to show a timeline event
function showTime(e) {
  e.setAttribute("done", "true"); // Mark the event as done
  e.querySelector(".timeline-point").style.background = "rgb(10, 181, 53)"; // Change the point color to green
  e.querySelector(".date").style.opacity = "100%"; // Make the date visible
  e.querySelector("p").style.opacity = "100%";
  e.querySelector("img").style.opacity="100%";
  e.querySelector("img").style.transform= "translateY(10px)" // Make the description visible
  e.querySelector("p").style.transform = "translateY(10px)"; // Animate the description text
}

// Function to hide a timeline event
function hideTime(e) {
  e.removeAttribute("done"); // Remove the done attribute
  e.querySelector(".timeline-point").style.background = "rgb(228, 228, 228)"; // Change the point color to gray
  e.querySelector(".date").style.opacity = "0%"; // Hide the date
  e.querySelector("p").style.opacity = "0%"; // Hide the description
  e.querySelector("p").style.transform = "translateY(-10px)"; // Reset the description position
  e.querySelector("img").style.opacity="0%";
  e.querySelector("img").style.transform= "translateY(-10px)" // Make the description visible

}

// Function to show timeline events one by one with a delay
function slowLoop() {
  setTimeout(function () {
    showTime(timeline_events[i]); // Show the current event
    timelineProgress(i + 1); // Update the timeline progress
    i++;
    if (i < timeline_events.length) {
      // Uncomment this line to continue the loop automatically
      // slowLoop();
    }
  }, 500); // Delay of 500 milliseconds
}

// Function to update the timeline progress bar
function timelineProgress(value) {
  let progress = `${(value / timeline_events.length)*100}%`; // Calculate progress percentage

  // Adjust the width or height of the progress line based on screen size
  if (window.matchMedia("(min-width: 728px)").matches) {
    line.style.width = progress;
    line.style.height = "10px";
  } else {
    line.style.height = progress;
    line.style.width = "10px";
  }
}

// Create an IntersectionObserver to observe when timeline elements enter the viewport
let observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.intersectionRatio > 0.9) { // If the element is mostly visible
        if (window.matchMedia("(min-width: 728px)").matches) {
          slowLoop(); // Trigger the slow loop on larger screens
        } else {
          showTime(entry.target); // Show the event immediately on smaller screens
          timelineProgress(i2); // Update the progress
          i2++;
        }
        observer.unobserve(entry.target); // Stop observing the element after it's displayed
      }
    });
  },
  { threshold: 1, rootMargin: "0px 0px -50px 0px" } // Observer settings
);

// Start observing the timeline based on screen size
if (window.matchMedia("(min-width: 728px)").matches) {
  observer.observe(target1); // Observe the entire timeline container on larger screens
} else {
  target2.forEach((t) => {
    observer.observe(t); // Observe individual timeline items on smaller screens
  });
}

// Add click event listeners to all timeline events
timeline_events.forEach((li, index) => {
  li.addEventListener("click", () => {
    if (li.getAttribute("done")) { // If the event is already done
      timelineProgress(index); // Update the timeline progress

      // Hide all events from the clicked point onward
      timeline_events.forEach((ev, idx) => {
        if (idx >= index) {
          hideTime(ev);
        }
      });
    } else {
      timelineProgress(index + 1); // Update the timeline progress

      // Show all events up to the clicked point
      timeline_events.forEach((ev, idx) => {
        if (idx <= index) {
          showTime(ev);
        }
      });
    }
  });
});

// Handle window resize event
var doit;
window.addEventListener("resize", () => {
  clearTimeout(doit); // Clear the timeout to debounce the resize event
  doit = setTimeout(resizeEnd, 1200); // Delay the resize handling
});

// Function to reset the timeline on resize
function resizeEnd() {
  i = 0; // Reset the counter
  slowLoop(); // Restart the slow loop to show events again
}


