(function (window) {
	window.utils = new function() {
		var utils = this;
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

			var pct = (2 / numNumbers); //percents get smaller as number of possible numbers goes up

			var remaining = 100;
			for (var i = 0; i < numNumbers; i++) {
				remaining = remaining - (remaining * pct);
				if (roll >= remaining) {
					return i + min;
				}
			}

			return min;
		};
	};
})(window);