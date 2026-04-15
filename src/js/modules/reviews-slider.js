import Swiper from 'swiper';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

function reviewsSlider() {
	const sliderElement = document.querySelector('.reviews__slider');

	if (!sliderElement) {
		return;
	}

	new Swiper(sliderElement, {
		modules: [Autoplay],
		slidesPerView: 4,
		spaceBetween: 16,
		loop: true,
		speed: 5200,
		allowTouchMove: false,
		autoplay: {
			delay: 1,
			disableOnInteraction: false,
			pauseOnMouseEnter: false,
		},
		breakpoints: {
			320: {
				slidesPerView: 1.2,
				spaceBetween: 12,
			},
			821: {
				slidesPerView: 2.2,
				spaceBetween: 14,
			},
			1221: {
				slidesPerView: 4,
				spaceBetween: 16,
			},
		},
	});
}

export default reviewsSlider;
