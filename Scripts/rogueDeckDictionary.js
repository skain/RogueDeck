(function (window) {
	window.rogueDeckDictionary = (function () {
		var self = {};

		var itemDetailModifier = function (name, minModifier, maxModifier) {
			var self = {};
			self.name = name;
			self.modifier = window.utils.getRandomNumberBetween(minModifier, maxModifier);
			return self;
		}

		self.weaponTypes = (function () {
			var self = {};
			var tier1 = [
				itemDetailModifier('Short Sword', 2, 4),
				itemDetailModifier('Dagger', 2, 3),
				itemDetailModifier('Club', 1, 5)
			];
			var tier2 = [
				itemDetailModifier('Sword', 5, 7),
				itemDetailModifier('Stilletto', 4, 5),
				itemDetailModifier('Mace', 6, 10)
			];
			var tier3 = [
				itemDetailModifier('Long Sword', 8, 10),
				itemDetailModifier('Dirk', 6, 7),
				itemDetailModifier('Hammer', 11, 15)
			];
			var tier4 = [
				itemDetailModifier('Great Sword', 11, 13),
				itemDetailModifier('Kris', 8, 9),
				itemDetailModifier('Battle Axe', 16, 20)
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

			return self;
		})();

		self.monsterTypes = (function () {
			var self = {};
			function getTier1ItemDetail(name) {
				return itemDetailModifier(name, 1, 3);
			}

			function getTier2ItemDetail(name) {
				return itemDetailModifier(name, 4, 7);
			}

			function getTier3ItemDetail(name) {
				return itemDetailModifier(name, 8, 13);
			}

			function getTier4ItemDetail(name) {
				return itemDetailModifier(name, 14, 20);
			}

			function getTier5ItemDetail(name) {
				return itemDetailModifier(name, 21, 30);
			}

			var tier1 = [
				getTier1ItemDetail('Rat'),
				getTier1ItemDetail('Skeleton'),
				getTier1ItemDetail('Giant Ant'),
				getTier1ItemDetail('Ghoul'),
				getTier1ItemDetail('Gnome'),
				getTier1ItemDetail('Troglodyte'),
				getTier1ItemDetail('Wolf')
			];

			var tier2 = [
				getTier2ItemDetail('Ape'),
				getTier2ItemDetail('Bat'),
				getTier2ItemDetail('Bugbear'),
				getTier2ItemDetail('Lizardman'),
				getTier2ItemDetail('Satyr'),
				getTier2ItemDetail('Giant Spider'),
				getTier2ItemDetail('Banshee')
			];

			var tier3 = [
				getTier3ItemDetail('Basilisk'),
				getTier3ItemDetail('Vampire Bat'),
				getTier3ItemDetail('Centaur'),
				getTier3ItemDetail('Cockatrice'),
				getTier3ItemDetail('Imp'),
				getTier3ItemDetail('Dryad'),
				getTier3ItemDetail('Earth Elemental'),
				getTier3ItemDetail('Water Elemental'),
				getTier3ItemDetail('Fire Elemental'),
				getTier3ItemDetail('Air Elemental'),
				getTier3ItemDetail('Earth Golem')
			];

			var tier4 = [
				getTier4ItemDetail('Sphinx'),
				getTier4ItemDetail('Chimera'),
				getTier4ItemDetail('Chupacabra'),
				getTier4ItemDetail('Hellcat'),
				getTier4ItemDetail('Doppelganger'),
				getTier4ItemDetail('Iron Golem')
			];

			var tier5 = [
				getTier5ItemDetail('Fallen Angel'),
				getTier5ItemDetail('Disembodied Brain'),
				getTier5ItemDetail('Mountain Giant'),
				getTier5ItemDetail('Dragon'),
				getTier5ItemDetail('Fire Golem')
			];

			self.getTier1MonsterType = function () {
				return window.utils.getRandomElementFromArray(tier1);
			}

			self.getTier2MonsterType = function () {
				return window.utils.getRandomElementFromArray(tier2);
			}

			self.getTier3MonsterType = function () {
				return window.utils.getRandomElementFromArray(tier3);
			}

			self.getTier4MonsterType = function () {
				return window.utils.getRandomElementFromArray(tier4);
			}

			self.getTier5MonsterType = function () {
				return window.utils.getRandomElementFromArray(tier5);
			}
			return self;
		})();

		self.armorTypes = (function () {
			var self = {};
			var tier1 = [itemDetailModifier('Cloth Armor', 1, 3)];
			var tier2 = [itemDetailModifier('Leather Armor', 4, 6)];
			var tier3 = [itemDetailModifier('Chain Armor', 7, 9)];
			var tier4 = [itemDetailModifier('Scale Armor', 10, 12)];
			var tier5 = [itemDetailModifier('Plate Armor', 13, 15)];

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

			self.getTier5ArmorType = function () {
				return window.utils.getRandomElementFromArray(tier5);
			};

			return self;
		})();

		return self;
	})();
})(window);