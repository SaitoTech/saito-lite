var mySwiper = new Swiper('.sectionWrapperMobile2', {
        loop: true, // 循环模式选项
        // 如果需要分页器
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        },
        //设置自动轮播
        autoplay: false
})

var mySwiper1 = new Swiper('.sectionWrapperMobile5', {
        loop: true, // 循环模式选项
        // 如果需要分页器
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        },
        //设置自动轮播
        autoplay: false,
        slidesPerView: 3,
        centeredSlides: true,
        spaceBetween: 10,
        paginationClickable: true,
})