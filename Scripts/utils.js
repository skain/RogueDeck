(function (window) {
	var utils = {};
	utils.getRandomNumber = function (max) {
		return Math.floor((Math.random() * max) + 1);
	};

	utils.getRandomNumberBetween = function (min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	};

	utils.calculateHit = function (attack, defense, roll) {
		console.log({ attack: attack, defense: defense, roll: roll, damage: (attack + roll) - defense });
		return (attack + roll) - defense;
	};

	utils.getBuffsFromArg = function (buffs) {
		return buffs ? (buffs instanceof Array ? buffs : [buffs]) : [];
	};

	utils.getRandomElementFromArray = function (array) {
		if (!array) {
			throw 'Array passed to getRandomeElementFromArray is undefined';
		}

		var index = utils.getRandomNumber(array.length - 1) - 1;
		return array[index];
	};

	utils.getWeightedRandomNumber = function (min, max) {
		if (!min) {
			throw 'min must be supplied';
		}

		if (!max) {
			throw 'max must be supplied';
		}
		var numNumbers = (max - min) + 1;
		var roll = Math.floor((Math.random() * 100) + 1);

		var pct = (3 / numNumbers); //percents get smaller as number of possible numbers goes up

		var remaining = 100;
		for (var i = 0; i < numNumbers; i++) {
			remaining = remaining - (remaining * pct);
			if (roll >= remaining) {
				return i + min;
			}
		}

		return min;
	};

	/*
		Given a range of numbers and a median, returns a random number with the highest probability of being the median, then descending probability for each number in the range working down from
		the median to the rangeMin, and finally further descending probablities for each number working up from the median to the rangeMax.

		If the median lies outside the range specified then number are weighted more heavily in that direction.

		Used mostly for finding things that are appropriate for a given level (where the current level would be the median value.)
	*/
	utils.getDownwardWeightedRandomNumber = function (rangeMin, rangeMax, median) {
		/*
			If roll=1 then result=median
			If roll<=(median-minRange) +1 then
			Result = median - (roll - 1)
			Else result=roll
		*/

		var roll = utils.getWeightedRandomNumber(rangeMin, rangeMax);
		var result = median;
		if (roll != rangeMin) {
			if (roll <= median) {
				var offset = roll - 1;
				result = median - offset;
			} else {
				result = roll;
			}
		}

		if (result < rangeMin) {
			result = rangeMin;
		}

		if (result > rangeMax) {
			result = rangeMax;
		}

		return result;
	};

	utils.testDW = function (median) {
		var result = [];
		for (var i = 0; i < 100; i++) {
			var roll = utils.getDownwardWeightedRandomNumber(1, 5, median);
			if (!result[roll - 1]) {
				result[roll - 1] = 0;
			}
			result[roll - 1]++;
		}
		console.log('testDW done');
		console.log(result);
	};
	//utils.hookPrefixedEvent = function (element, type, callback) {
	//	var pfx = ["webkit", "moz", "MS", "o", ""];
	//	for (var p = 0; p < pfx.length; p++) {
	//		if (!pfx[p]) type = type.toLowerCase();
	//		element.addEventListener(pfx[p] + type, callback, false);
	//	}
	//};
	utils.addAnimationWithCallback = function ($element, cssClass, callback) {
		$element.addClass(cssClass);
		$element.unbind('webkitAnimationEnd').bind('webkitAnimationEnd', function (animEvent) {
			$element.removeClass(cssClass);
			if (callback) {
				callback(animEvent);
			}
		});
	}
	window.utils = utils;
})(window);