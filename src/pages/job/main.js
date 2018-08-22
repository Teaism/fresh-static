/*
* @Author: fanger
* @Date:   2018-04-16 12:34:35
 * @Last Modified by: Teaism
 * @Last Modified time: 2018-08-22 15:10:35
*/


// import '../../assets/scss/common.scss';
import './style.scss';


$(function () {


	// 职位过滤展开收起
	$('.filter-wrap .more-btn').click(function () {
		$(this).parent('.filter-wrap').toggleClass('showall');
		if ($(this).text() === '展开') {
			$(this).text('收起')
		} else {
			$(this).text('展开')
		}
	})

	// 职位过滤选择项
	$('.filter-wrap .filter-item, .filter-wrap .filter-all').click(function () {
		$('.post-item').hide();

		console.log('------------------')

		if ($(this).text() === '全部') {
			$(this).addClass('cur');
			$(this).siblings('.filter-item').removeClass('cur');
			CurSignFilter();
		} else {
			$(this).toggleClass('cur');

			if ($(this).parent('.filter-wrap').find('.filter-item.cur').length) {
				$(this).siblings('.filter-all').removeClass('cur');
				CurSignFilter()

			} else {
				$(this).siblings('.filter-all').addClass('cur');
				CurSignFilter();
			}
		}
	})

	// 职位过滤选中时
	function CurSignFilter() {

		let jobtype = '', joborg = '', jobaddress = '';
		let arr = []

		if ($('.filter-jobtype .filter-item.cur').length) {
			filterThree();
		} else if ($('.filter-joborg .filter-item.cur').length) {
			filterTWo()
		} else {
			filterOne()
		}

		function filterThree() {

			$('.filter-jobtype .filter-item.cur').each(function (index, ele) {
				jobtype = $(ele).data('jobtype') ? '[data-jobtype="' + $(ele).data('jobtype') + '"]' : '';

				if ($('.filter-joborg .filter-item.cur').length) {
					filterTWo()
				} else {
					filterOne()
				}
			})
		}

		function filterTWo() {
			$('.filter-joborg .filter-item.cur').each(function (index, ele) {
				joborg = $(ele).data('joborg') ? '[data-joborg="' + $(ele).data('joborg') + '"]' : '';

				$('.filter-jobaddress .filter-item.cur').each(function (index, ele) {
					jobaddress = $(ele).data('jobaddress') ? '[data-jobaddress="' + $(ele).data('jobaddress') + '"]' : '';
				})
				arr.push(jobtype + joborg + jobaddress)
				console.log(arr.join())
				$('.post-item' + arr.join()).show()

			})
		}

		function filterOne() {
			$('.filter-jobaddress .filter-item.cur').each(function (index, ele) {
				jobaddress = $(ele).data('jobaddress') ? '[data-jobaddress="' + $(ele).data('jobaddress') + '"]' : '';
			})
			arr.push(jobtype + joborg + jobaddress)
			console.log(arr.join())
			$('.post-item' + arr.join()).show()
		}

	}

})
