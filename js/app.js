document.addEventListener('DOMContentLoaded', () => {

  const $desktop = $(window).innerWidth() > 900;

/*-------------------------Только цифры в инпут с ограниченным кол-вом символов--------------------------------------*/
  $('.js_input-only-num').bind("change keyup input click", function () {
    const $ths = $(this);
    const $text = $ths.attr('data-max') ? $ths.val().replace(/[^\d]/, "").slice(0,$ths.attr('data-max')) : $ths.val().replace(/[^\d]/, "");
    $ths.val($text);
  });


/*----------------------Слайдер от и до-------------------------------------------*/
  function sliderRange($id, $idMin, $idMax){
    const $ths = $($id)
    $ths.slider({
      range: true,
      min: parseInt($ths.attr('data-min')),
      max: parseInt($ths.attr('data-max')),
      values: [ parseInt($ths.attr('data-start-min')), parseInt($ths.attr('data-start-max')) ],
      slide: function( event, ui ) {
        $($idMin).text(ui.values[0].toLocaleString())
        $($idMax).text(ui.values[1].toLocaleString())
      }
    });
    $($idMin).text($ths.slider( "values", 0).toLocaleString())
    $($idMax).text($ths.slider( "values", 1).toLocaleString())
  }

//Инициализация
  sliderRange("#slider-range", '#slider-range-min', '#slider-range-max')


/*----------------------Слайдер от-------------------------------------------*/
  function sliderRangeMin($id, $idMin){
    const $ths = $($id)

    $ths.slider({
      range: "min",
      value: parseInt($ths.attr('data-start-min')),
      min: parseInt($ths.attr('data-min')),
      max: parseInt($ths.attr('data-max')),
      slide: function(event, ui) {
        $($idMin).text(ui.value)
      }
    });
    $($idMin).text($ths.slider("value"))
  }

//Инициализация
  sliderRangeMin("#slider-calls", '#slider-calls-min')
  sliderRangeMin("#slider-inet", '#slider-inet-min')


 /*---------------------Слайдер тарифов-------------------------------------------*/

  new Swiper(".js-tariffs-slider", {
  //slidesPerView: 'auto',


    mousewheel: {
      forceToAxis: true
    },
    navigation: {
      nextEl: ".tariffs-slider__next",
      prevEl: ".tariffs-slider__prev",
    },
    breakpoints: {

      0: {
        spaceBetween: 12,
        slidesPerView: 'auto',
      },

      900: {
        spaceBetween: 12,
        slidesPerView: 4,
      },

      1400: {
        spaceBetween: 20,
        slidesPerView: 4,
      },

      2000: {
        spaceBetween: 30,
        slidesPerView: 4,
      }
    }
  });


    /*-------------------------Маска для телефона--------------------------------------*/
  var options = {
   onKeyPress: function (cep, event, currentField, options) {
     var val = cep.replace(/[^\d;]/g, '')
   },
   onChange: function (cep, event, currentField, options) {
     var val = cep.replace(/[^\d;]/g, '')
     if (val.startsWith('78') || val.startsWith('77')) {
       currentField.val(val.replace(val.substr(0, 2), '+7 ('))
     }   
     if (val.length>10) {
       currentField.mask('+7 (000) 000-00-00', options);
     } else {
       currentField.mask('+7 (000) 000-00-000', options);
     }
   },
   clearIfNotMatch: true,
   watchDataMask: true
 }
 $("[data-mask]").mask("+7 (000) 000-00-00", options);



 /*---------------------Слайдер акций------------------------------------------*/

 new Swiper(".js-save-slider", {
  slidesPerView: 'auto',
  centeredSlides: true,
  initialSlide: 1,
  mousewheel: {
    forceToAxis: true
  },

  //   breakpoints: {

  //   0: {
  //     spaceBetween: 12,
  //   },

  //   900: {
  //     spaceBetween: 16,
  //   }
  // }
});


 /*---------------------Слайдер информации-------------------------------------------*/

 new Swiper(".js-informed-slider", {

  mousewheel: {
    forceToAxis: true
  },
  navigation: {
    nextEl: ".informed-slider__next",
    prevEl: ".informed-slider__prev",
  },
  breakpoints: {

    0: {
      spaceBetween: 12,
      slidesPerView: 'auto',
    },

    900: {
      spaceBetween: 12,
      slidesPerView: 3,
    },

    1400: {
      spaceBetween: 20,
      slidesPerView: 3,
    },

    2000: {
      spaceBetween: 30,
      slidesPerView: 3,
    }
  }
});


/*-------------------------Аккордион--------------------------------------*/
 $(".js_accordeon .accordeon__item").click(function() {
  const $ths = $(this);
  $ths.parents(".accordeon").find(".accordeon__text").not(this).slideUp(250).parent().removeClass("accordeon__item_active");
  $ths.find(".accordeon__text").not(":visible").slideDown(250).parent().addClass("accordeon__item_active");
});


/*-------------------------Слайдер баннеров--------------------------------------*/
 new Swiper(".js-cooperation-slider", {
  //direction: "vertical",
   mousewheel: {
    forceToAxis: true
  },
});


/*-------------------------Открыть меню в шапке--------------------------------------*/
 function closeMenu(){
  $('.header-menu').fadeOut(200);
  $('.header').removeClass('header_open');
  $('.header-menu__block').removeClass('header-menu__block_open');
  closeBlock()
}
function closeBlock(){
  $('.header-menu__block').removeClass('header-menu__block_open');
  $('.icon-text-button').removeClass('icon-text-button_active');
}

$('.js-open-menu').hover(function(){
 $('.header-menu').stop().fadeIn(200);
 $('.header').addClass('header_open');

 closeBlock()
 $($(this).attr('data-src') + '.header-menu__block').addClass('header-menu__block_open');
 $(this).addClass('icon-text-button_active');

})

$('.nav-list__link, .header_buttons, .logo').hover(function(){
  closeMenu()
})

$(document).on("click",".js-close-menu", function (e) {
  closeMenu()
})



  /*-------------------------Открыть закрыть моб меню--------------------------------------*/
$(document).on("click",".js-open-mobile-menu", function (e) {
 e.preventDefault();
 $('.menu-button').addClass('mobile-button_active');
 $('.menu').addClass('menu_open');
 $('body, html').addClass('no-scroll')
 $('.menu__shadow').stop().fadeIn(200);
})


$(document).on("click",".js-close-mobile-menu", function (e) {
  if($(e.target).hasClass('close-button') || $(e.target).hasClass('menu__shadow')){
   e.preventDefault();
   $('.menu-button').removeClass('mobile-button_active');
   $('.menu').removeClass('menu_open');
   $('body, html').removeClass('no-scroll')
   $('.menu__shadow').stop().fadeOut(200);
 }
})






 /*-------------------------Суб меню в моб меню--------------------------------------*/
$(document).on("click",".js-sub-menu a, .js-sub-menu span", function (e) {
  e.preventDefault();
  const $ths = $(this);
  $ths.parent().toggleClass('menu-list__li_sub_active')
  $ths.parent().find('.sub-menu-list').stop().slideToggle();
})


 /*------------------------Выбор оператора--------------------------------------*/
if($desktop){
  if($('.js-select').length){
    const $startWidth = $('.select-col').innerWidth();
    const $oneCheckboxWidth = $('.select-list li:first-child').innerWidth();
    $('.js-select').hover(function(){
    }, function(){
      let $count = 0;
      $('.js-select .image-checkbox').each(function(){
        if($(this).find('input').prop('checked')){
          $count = $count + 1;
        }
      })
      if($count > 1){
        const $width = $startWidth + ($count - 1) * $oneCheckboxWidth;
        $('.select-col').css('flex', '0 0 '+ $width +'px').css('max-width', $width + 'px')
      } else{
        $('.select-col').attr('style', '')
      }
      
    })


    $('.js-select input').change(function(){
      const $ths = $(this);
      if($ths.prop('checked')){
        $ths.parents('li').css('display','flex')
      } else {
        $ths.parents('li').css('display','')
      }
    })
  }
} else {

  //Открыть выбор опрератора
  $(document).on("click",".js-select-open", function () {
    $('.select__shadow').stop().fadeIn(150);
    $('body, html').addClass('no-scroll')
  })

  //Заркыть выбор оператора
  $(document).on("click",".js-select-close", function (e) {
    if($(e.target).hasClass('select__shadow') || $(e.target).hasClass('btn')){
      e.preventDefault();
      $('.select__shadow').stop().fadeOut(150);
      $('body, html').removeClass('no-scroll');
    }
  })

//Применить выбранные тарифы
  let $imgAry;
  let $additional;
  const $startHtml =  $('.select-button').html();
  $(document).on("click",".js-select-apply", function () {
    $imgAry = [];
    $additional = 0;
    $('.js-select .select-list li').each(function(){
      const $ths = $(this);
      if($ths.find('input').prop('checked')){
        $imgAry.push($ths.find('span').html())
      }
    })

    let $html = `<ul class="ul selected-list">`;
    if($imgAry.length){
      $imgAry.forEach(function($item, $i){

        if(!$('.select-col').parent().hasClass('tariffs-page__row')){
          //На странице номера
          if($i < 3){
            $html += `<li class="selected-list__item">${$item}</li>`
          } else {
            ++$additional
          }
        } else {
          //На странице оператора
          $html += `<li class="selected-list__item">${$item}</li>`
        }


        
      })
      if($additional > 0){
        $html += `<li class="selected-list__count">+${$additional}</li>`;
      }
      $html += `</ul>`
      $('.select-button').html($html);
      $('.select-col').attr('data-count', $imgAry.length > 3 ? 4 : $imgAry.length)
    } else {
      $('.select-button').html($startHtml);
      $('.select-col').attr('data-count', 0)
    }


  })
}

/*-------------------------Закрепить поиск--------------------------------------*/
if($('.selection__search').length){
  const $selectionSearchTop = $('.selection__search').offset().top;
  const $stop = $('.numbers').innerHeight() + $('.numbers').offset().top;
  $(document).on("scroll", function(){
    const $top = $(this).scrollTop();
    if($top > $selectionSearchTop - $('header').innerHeight()){
      if($top < $stop - $('header').innerHeight() * 2){
        $('.selection__search').addClass('selection__search_fixed')
      } else{
        $('.selection__search').removeClass('selection__search_fixed')
      }
    } else {
      $('.selection__search').removeClass('selection__search_fixed')
    }
  })
}


/*-------------------------Универсальный скрипт показать больше------------------------------------------------------*/
$(document).on("click",".js-more", function (e) {
 e.preventDefault();
 $(this).toggleClass('active').next().stop().slideToggle();
})


/*----------------------Кнопка вернуться назад------------------------------------*/
$(document).on("click",".js-back", function (e) {
  e.preventDefault();
  history.back();
})


/*-------------------------Действия на esc--------------------------------------*/
$(document).keyup(function(e) {
 if (e.keyCode == 27) {
   closeMenu()
 }
});


//const popUpElement = document.getElementById("pop-up");




 // $(document).on("click","11111111111111", function (e) {
 //   e.preventDefault();
 //  })





   //  /*----------------------Добавить и убавить-------------------------------------------*/
   // function changeQuantity($parentElement,$event = 'plus'){
   //    const $input = $parentElement.find('.js_input');
   //    let $count;
   //    if($event == 'minus'){
   //       $count = parseInt($input.val()) - 1;
   //       $count = $count < 1 ? 1 : $count;
   //    }
   //    if($event == 'plus'){
   //       $count = parseInt($input.val()) + 1;
   //    }
   //    $input.val($count);
   //    $input.change();
   //    $parentElement.find('.js_minus').prop("disabled",$count == 1);
   // }

   // $(document).on('click','.js_minus',function(e){
   //    e.preventDefault();
   //    changeQuantity($(this).parent(), 'minus');
   // });
   // $(document).on('click','.js_plus',function(e){
   //    e.preventDefault();
   //    changeQuantity($(this).parent());
   // });

   // $('.js_input').blur(function () {
   //    const $ths = $(this),
   //       $val = $ths.val();
   //    if ($val == "") {
   //       $ths.val("1");
   //    }
   //    $ths.parent().find('.js_minus').prop("disabled", parseInt($val) < 2 || $val == "");
   // });
   //  // input only number
   // $('.js_input').bind("change keyup input click", function () {
   //    const $ths = $(this);
   //    $ths.val($ths.val().replace(/[^\d]/, ""));
   // });



// 	$(document).mouseup(function (e){ 
// 		var div = $(".questions_text");
// 		if (!div.is(e.target)
// 			&& div.has(e.target).length === 0) {
// 			div.fadeOut(150); 
// 		$('.questions_text').fadeOut(150);
// 	}
// });
// 	$(document).keyup(function(e) {
// 		if (e.keyCode == 27) {
// 			$('.questions_text').fadeOut(150);
// 		}
// 	});








// Отфильтровывание списка по вводу в инпут
// $('.CmMSelectSearch input').keyup(function(){
//         var $ths = $(this);
//         var val_inp = $ths.val();

//         $ths.parent().next().find('.CmColorBgh').each(function(){
//             var val_title = $(this).text();
//             if (RegExp('\^'+val_inp,'i').test(val_title)||RegExp('\\s\\'+val_inp,'i').test(val_title)) {
//                 $(this).show();
//             }else{
//                 $(this).hide();
//             }
//         });
//     });


})
