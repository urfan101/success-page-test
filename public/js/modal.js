document.addEventListener("DOMContentLoaded", () => {
  const stories = [
    {
      video: "../assets/video/reels-1.mp4",
      avatar:
        "../assets/images/f-1.png",
      name: "Классический каркасный дом",
    },
    {
      video: "../assets/video/reels-2.mp4",
      avatar:
        "../assets/images/f-2.png",
      name: "каркасный дом а-фрейм",
    },
    {
      video: "../assets/video/reels-3.mp4",
      avatar:
        "../assets/images/f-3.png",
      name: "каркасный дом барнхаус",
    },
    {
      video: "../assets/video/reels-4.mp4",
      avatar:
        "../assets/images/f-4.png",
      name: "Каркасная баня от «Мари Каркас»",
    },    
  ];

  let currentIndex = 0;

  const storyModal = document.getElementById("storyModal");
  const video = document.getElementById("storyVideo");
  const userAvatar = document.getElementById("userAvatar");
  const userName = document.getElementById("userName");
  const progressBar = document.getElementById("progressBar");

  const closeModal = document.getElementById("closeModal");
  const prevButton = document.getElementById("prevButton");
  const nextButton = document.getElementById("nextButton");

  const carousel = document.getElementById("avatarCarousel");
  const avatars = carousel.querySelectorAll(".avatar");
  const scrollPrev = document.getElementById("prevBtn");
  const scrollNext = document.getElementById("nextBtn");

  const scrollAmount = 200;

  avatars.forEach((avatar, i) => {
    const clone = avatar.cloneNode(true);
    clone.addEventListener("click", () => {
      openStory(i);
    });
    carousel.appendChild(clone);
  });

  if (scrollPrev && scrollNext && carousel) {
    scrollPrev.addEventListener("click", () => {
      carousel.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    });

    scrollNext.addEventListener("click", () => {
      carousel.scrollBy({ left: scrollAmount, behavior: "smooth" });
    });
  }

  function openStory(index) {
    if (index < 0 || index >= stories.length) return;
    currentIndex = index;

    const story = stories[index];

    userAvatar.src = story.avatar;
    userName.textContent = story.name;
    video.src = story.video;
    video.muted = false;
    video.play();

    storyModal.style.display = "flex";

    video.ontimeupdate = () => {
      const progress = (video.currentTime / video.duration) * 100;
      progressBar.style.width = `${progress}%`;
    };

    video.onended = nextStory;
  }

  function nextStory() {
    currentIndex = (currentIndex + 1) % stories.length;
    openStory(currentIndex);
  }

  function prevStory() {
    currentIndex = (currentIndex - 1 + stories.length) % stories.length;
    openStory(currentIndex);
  }

  closeModal.addEventListener("click", () => {
    video.pause();
    storyModal.style.display = "none";
    progressBar.style.width = "0%";
  });

  if (prevButton && nextButton) {
    prevButton.addEventListener("click", prevStory);
    nextButton.addEventListener("click", nextStory);
  }

  let touchStartX = 0;
  let touchEndX = 0;

  storyModal.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  storyModal.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    if (touchStartX > touchEndX + 50) {
      nextStory();
    } else if (touchStartX + 50 < touchEndX) {
      prevStory();
    }
  });

  avatars.forEach((avatar, i) => {
    avatar.addEventListener("click", () => {
      openStory(i);
    });
  });

  const openVideoButton = document.getElementById("open-video");
  if (openVideoButton) {
    openVideoButton.addEventListener("click", () => {
      openStory(0);
    });
  }
});
