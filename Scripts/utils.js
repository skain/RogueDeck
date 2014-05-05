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

		utils.getItemName = function (item) {
			var buffs = '';
			if (item.buffs) {
				for (var i = 0; i < item.buffs().length; i++) {
					var buff = item.buffs()[i];
					if (buff.damage) {
						buffs = '';
						if (buff.damage > 0) {
							buffs = buffs + ' Dmg+' + buff.damage;
						} else if (buff.damage < 0) {
							buffs = buffs + ' Dmg' + buff.damage;
						}
					}

					if (buff.defense) {
						buffs = '';
						if (buff.defense > 0) {
							buffs = buffs + ' Def+' + buff.defense;
						} else if (buff.defense < 0) {
							buffs = buffs + ' Def' + buff.defense;
						}
					}
				}
			}

			return item.name() + buffs;
		};		

		utils.getRandomElementFromArray = function (array) {
			if (!array) {
				throw 'Array passed to getRandomeElementFromArray is undefined';
			}

			var index = utils.getRandomNumber(array.length - 1) - 1;
			return array[index];
		};
	};
})(window);