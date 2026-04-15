// import { Fancybox } from '@fancyapps/ui';
// import '@fancyapps/ui/dist/fancybox/fancybox.css';

import mobileNav from "./modules/mobile-nav.js";
import reviewsSlider from "./modules/reviews-slider.js";

document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector("[data-fancybox]")) {
    Fancybox.bind("[data-fancybox]", {});
  }

  mobileNav();
  reviewsSlider();
});
