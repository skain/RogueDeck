(function (window) {
	window.rogueDeckDictionary = new function () {
		var self = this;

		var itemDetailModifier = function (name, minModifier, maxModifier) {
			var self = this;
			self.name = name;
			self.modifier = window.utils.getRandomNumberBetween(minModifier, maxModifier);
		}

		self.weaponTypes = new function () {
			var self = this;
			var tier1 = [
				new itemDetailModifier('Short Sword', 2, 4),
				new itemDetailModifier('Dagger', 2, 3),
				new itemDetailModifier('Club', 1, 5)
			];
			var tier2 = [
				new itemDetailModifier('Sword', 5, 7),
				new itemDetailModifier('Stilletto', 4, 5),
				new itemDetailModifier('Mace', 6, 10)
			];
			var tier3 = [
				new itemDetailModifier('Long Sword', 8, 10),
				new itemDetailModifier('Dirk', 6, 7),
				new itemDetailModifier('Hammer', 11, 15)
			];
			var tier4 = [
				new itemDetailModifier('Great Sword', 11, 13),
				new itemDetailModifier('Kris', 8, 9),
				new itemDetailModifier('Battle Axe', 16, 20)
			];

			self.getTier1WeaponType = function () {
				return window.utils.getRandomElementFromArray(tier1);
			}

			self.getTier2WeaponType = function () {
				return window.utils.getRandomElementFromArray(tier2);
			}

			self.getTier3WeaponType = function () {
				return window.utils.getRandomElementFromArray(tier3);
			}

			self.getTier4WeaponType = function () {
				return window.utils.getRandomElementFromArray(tier4);
			}
		};

		self.armorTypes = new function () {
			var self = this;
			var tier1 = [new itemDetailModifier('Cloth Armor', 1, 3)];
			var tier3 = [new itemDetailModifier('Chain Armor', 4, 6)];
			var tier4 = [new itemDetailModifier('Scale Armor', 7, 9)];
			var tier5 = [new itemDetailModifier('Plate Armor', 10, 12)];
			var tier2 = [new itemDetailModifier('Leather Armor', 13, 15)];

			self.getTier1ArmorType = function () {
				return window.utils.getRandomElementFromArray(tier1);
			};

			self.getTier2ArmorType = function () {
				return window.utils.getRandomElementFromArray(tier2);
			};

			self.getTier3ArmorType = function () {
				return window.utils.getRandomElementFromArray(tier3);
			};

			self.getTier4ArmorType = function () {
				return window.utils.getRandomElementFromArray(tier4);
			};
		};
	};
})(window);