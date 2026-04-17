// import { Fancybox } from '@fancyapps/ui';
// import '@fancyapps/ui/dist/fancybox/fancybox.css';

import mobileNav from "./modules/mobile-nav.js";
import callbackForm from "./modules/callback-form.js";
import phoneMask from "./modules/phone-mask.js";
import reviewsSlider from "./modules/reviews-slider.js";

document.addEventListener("DOMContentLoaded", () => {
  mobileNav();
  callbackForm();
  phoneMask();
  reviewsSlider();
});
