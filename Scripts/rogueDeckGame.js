(function (window) {
	//object defs
	var rogueDeckManager = function () {
		var self = this;

		self.createRandomMonsterCard = function () {
			var attack = window.utils.getRandomNumberBetween(5, 15);
			var defense = window.utils.getRandomNumberBetween(5, 15);
			var hitPoints = window.utils.getRandomNumberBetween(3, 15);

			return new monsterCard('Monster', 'Monster!', attack, defense, hitPoints);
		}

		self.createRandomAreaCard = function (isFirstCard) {
			var cardSizeInt = window.utils.getRandomNumber(10);
			//var cardDoors = self.utils.doorUtils.getDoors(Math.floor(cardSizeInt / 2));
			var cardType = 'room';
			if (!isFirstCard) {
				if (window.utils.getRandomNumber(10) < 7) {
					cardType = 'hallway';
				}

				//calculate random loot
				var cardLoot = [];
				if (cardType == 'room') {
					var numLoot = Math.floor(cardSizeInt / 2);
					for (var i = 0; i < numLoot; i++) {
						var lc = lootFactory.getRandomLootCard();
						if (lc) {
							cardLoot.push(lc);
						}
					}
				}

				var cardMonsters = [];
				//calculate random monsters
				var numMonsters = Math.floor(cardSizeInt / 3); //allow for no monsters
				for (var i = 0; i < numMonsters; i++) {
					var mc = self.createRandomMonsterCard();
					if (mc) {
						cardMonsters.push(mc);
					}
				}
			}

			return new areaCard(cardMonsters, cardLoot, cardType, cardSizeInt);
		};
	};

	var doorCard = function (direction) {
		var self = {};
		self.getRandomDirection = function () {
			var rnd = window.utils.getRandomNumber(4);
			switch (rnd) {
				case 1:
					return 'North';
				case 2:
					return 'East';
				case 3:
					return 'South';
				case 4:
					return 'West';
			}
		};
		self.direction = direction || self.getRandomDirection();

		return self;
	}

	var lootCard = function (type, verb, value) {
		var self = {};
		self.type = type;
		self.verb = verb;
		self.value = value;
		self.droppedBy = 'There is a ';
		self.imageUrl = ko.observable();
		self.displayName = ko.computed(function () {
			if (self.value && self.value.displayName) {
				return self.value.displayName();
			}

			return type;
		});
		self.description = ko.computed(function () {
			if (self.value && self.value.description) {
				return self.value.description();
			}

			return null;
		});
		var setImageUrl = function () {
			var imageSearch = null;
			function callback() {
				// Check that we got results
				if (imageSearch.results && imageSearch.results.length > 0) {
					var index = window.utils.getRandomNumberBetween(0, imageSearch.results.length - 1);
					self.imageUrl(imageSearch.results[index].tbUrl);
				}
			};

			function doImageSearch() {
				imageSearch = new google.search.ImageSearch();

				imageSearch.setSearchCompleteCallback(this, callback, null);

				imageSearch.execute(self.displayName());
				var page = window.utils.getRandomNumberBetween(0, 100);
				imageSearch.gotoPage(page);
				console.log(page);

				// Include the required Google branding
				google.search.Search.getBranding('GoogleBranding');
			};

			doImageSearch();
		};

		setImageUrl();

		return self;
	}

	var monsterCard = function (type, name, attack, defense, hitPoints) {
		var self = this;
		self.type = type || "Monster";
		self.name = ko.observable(name);
		self.attack = ko.observable(attack || 1);
		self.defense = ko.observable(defense || 1);
		self.hitPoints = ko.observable(hitPoints || 1);
		self.fightLog = ko.observable('');
		self.processAttack = function (attacker, defender) {
			var attackerRoll = window.utils.getRandomNumber(10);
			this.fightLog('<br />' + attacker.name() + ' rolls ' + attackerRoll + this.fightLog());
			var dmg = window.utils.calculateHit(attacker.attack(), defender.defense(), attackerRoll);

			if (dmg > 0) {
				//process hit
				defender.hitPoints(defender.hitPoints() - dmg);
				this.fightLog('<br />' + defender.name() + ' takes ' + dmg + ' damage.' + this.fightLog());
				window.rogueGame.addMessageToLog(attacker.name() + ' hits ' + defender.name() + ' for ' + dmg + ' HP of damage.', attacker.isPlayer ? 'success' : 'danger');
			} else {
				//process miss
				this.fightLog('<br />' + attacker.name() + ' misses.' + this.fightLog());
				window.rogueGame.addMessageToLog(attacker.name() + ' misses ' + defender.name(), attacker.isPlayer ? 'warning' : 'success');
			}
		}
	}

	var areaCard = function (monsters, loot, type, sizeInt) {
		var self = this;
		self.monsters = ko.observableArray(monsters || []);
		self.loot = ko.observableArray(loot || []);
		self.doors = ko.observableArray([]);
		self.type = type || 'room';
		self.sizeInt = sizeInt || 1;

		if (self.sizeInt < 4) {
			self.sizeText = 'small';
		} else if (self.sizeInt < 9) {
			self.sizeText = 'medium';
		} else {
			self.sizeText = 'large';
		}

		if (self.type == 'hallway') {
			switch (self.sizeText) {
				case 'small':
					self.sizeText = 'short';
					break;
				case 'large':
					self.sizeText = 'long';
					break;
			}
		}

		self.directionExists = function (direction) {
			direction = direction.substr(0, 1).toLowerCase();
			for (var i = 0; i < self.doors().length; i++) {
				if (self.doors()[i].direction.substr(0, 1).toLowerCase() == direction) {
					return true;
				}
			}

			return false;
		}

		self.addMonsterDrop = function (monster) {
			var lc = lootFactory.getRandomLootCard();
			lc.droppedBy = monster.name() + ' dropped a ';
			self.loot.push(lc);
		}

		var numDoors = Math.max(1, Math.floor(self.sizeInt / 2));
		for (var i = 0; i < numDoors; i++) {
			self.doors.push(doorCard());
		}

	};

	var weapon = function (name, baseDamage, buffs) {
		var self = this;
		self.baseDamage = baseDamage;
		self.buffs = ko.observableArray(window.utils.getBuffsFromArg(buffs));
		self.name = ko.observable(name);
		self.displayName = ko.computed(function () {
			return self.name();
		});
		self.totalToHit = ko.computed(function () {
			var dmg = self.baseDamage;
			for (var i = 0; i < self.buffs().length; i++) {
				var buff = self.buffs()[i];
				if (buff.damage) {
					dmg += buff.damage;
				}
			}
			return dmg;
		});
		self.isWeapon = true;
		self.description = ko.computed(function () {
			return 'Dmg: ' + self.totalToHit();
		})
	};

	var armor = function (name, baseDefense, buffs) {
		var self = this;
		self.baseDefense = baseDefense;
		self.buffs = ko.observableArray(window.utils.getBuffsFromArg(buffs));
		self.name = ko.observable(name);
		self.displayName = ko.computed(function () {
			return self.name();
		});
		self.totalDefense = ko.computed(function () {
			var def = self.baseDefense;
			for (var i = 0; i < self.buffs().length; i++) {
				var buff = self.buffs()[i];
				if (buff.defense) {
					def += buff.defense;
				}
			}
			return def;
		});
		self.isArmor = true;
		self.description = ko.computed(function () {
			return 'Def: ' + self.totalDefense();
		});
	}

	var roguePlayer = function (name) {
		var self = this;
		self.name = ko.observable(name);
		self.type = 'Player';
		self.strength = ko.observable(window.utils.getRandomNumberBetween(5, 15));
		self.vitality = ko.observable(window.utils.getRandomNumberBetween(5, 15));
		self.intelligence = ko.observable(window.utils.getRandomNumberBetween(5, 15));
		self.dexterity = ko.observable(window.utils.getRandomNumberBetween(5, 15));
		self.maxHitPoints = ko.computed(function () { return 15 + self.vitality() });
		self.hitPoints = ko.observable(self.maxHitPoints());
		self.maxStomach = ko.observable(20 + self.vitality());
		self.stomach = ko.observable(self.maxStomach());
		self.lootCards = ko.observableArray();
		self.armor = ko.observable(getStartingArmor());
		self.defense = ko.computed(function () {
			return self.dexterity() + self.armor().value.totalDefense();
		});
		self.weapon = ko.observable(getStartingWeapon());
		self.attack = ko.computed(function () {
			return self.strength() + self.weapon().value.totalToHit();
		});
		self.isPlayer = true;

		function getStartingArmor() {
			var armor = armorFactory.getRandomTier1Armor();
			return lootCard(armor.displayName(), 'equip', armor);
		}

		function getStartingWeapon() {
			var weapon = weaponFactory.getRandomTier1Weapon();
			return lootCard(weapon.displayName(), 'equip', weapon);
		}
		self.useLootCard = function (lootCard) {
			if (self.lootCards.indexOf(lootCard) < 0) {
				window.rogueGame.addMessageToLog('You can\'t use that loot card!');
				return;
			}

			self.lootCards.remove(lootCard);

			switch (lootCard.type) {
				case "food":
					var gained = lootCard.value;
					if ((self.stomach() + gained) > self.maxStomach()) {
						gained = self.maxStomach() - self.stomach();
						self.stomach(self.maxStomach());
					} else {
						self.stomach(self.stomach() + lootCard.value);
					}
					window.rogueGame.addMessageToLog('You gained ' + gained + '/' + lootCard.value + ' stomach. Mmm, that was good.');
					break;
				case "small health potion":
				case "medium health potion":
				case "large health potion":
					var gained = lootCard.value;
					if ((self.hitPoints() + gained) > self.maxHitPoints()) {
						gained = self.maxHitPoints() - self.hitPoints();
						self.hitPoints(self.maxHitPoints());
					} else {
						self.hitPoints(self.hitPoints() + lootCard.value);
					}
					window.rogueGame.addMessageToLog('You gained ' + gained + '/' + lootCard.value + ' hit points.');
					break;
				default:
					if (lootCard.verb == 'equip') {
						self.equipLootCard(lootCard);
						self.lootCards.remove(lootCard);
					} else {
						window.rogueGame.addMessageToLog('Nothing happened');
					}
					break;
			}
		};

		self.equipLootCard = function (lootCard) {
			if (lootCard.value.isWeapon) {
				self.equipWeapon(lootCard);
			} else if (lootCard.value.isArmor) {
				self.equipArmor(lootCard);
			}
		};

		self.equipWeapon = function (lootCard) {
			var curWeapon = self.weapon();
			self.weapon(lootCard);
			self.lootCards.push(curWeapon);
		};

		self.equipArmor = function (lootCard) {
			var curArmor = self.armor();
			self.armor(lootCard);
			self.lootCards.push(curArmor);
		};
	}

	var buff = function (damage, defense) {
		var self = this;
		self.damage = damage;
		self.defense = defense;
		self.displayName = ko.computed(function () {
			var buffs = '';
			if (self.damage) {
				if (self.damage > 0) {
					buffs = buffs + ' Dmg+' + self.damage;
				} else if (self.damage < 0) {
					buffs = buffs + ' Dmg' + self.damage;
				}
			}

			if (self.defense) {
				if (self.defense > 0) {
					buffs = buffs + ' Def+' + self.defense;
				} else if (self.defense < 0) {
					buffs = buffs + ' Def' + self.defense;
				}
			}

			return buffs;
		})
	};

	var rogueGame = function () {
		var self = this;
		self.currentAreaCard = ko.observable(null);
		self.player = ko.observable(null);
		self.messageLog = ko.observableArray();
		self.curTurnIndex = ko.observable(0);
		self.stepsTaken = ko.observable(0);

		var rogueDeck = new rogueDeckManager();

		self.addMessageToLog = function (msg, level) {
			level = level || 'info';

			self.messageLog.unshift({ message: msg, level: level });
			if (self.messageLog().length == 7) {
				self.messageLog.pop();
			}
		}

		self.clearMessageLog = function () {
			self.messageLog.removeAll();
		};

		self.rerollCharacter = function () {
			self.addMessageToLog("Re-rolling character.", 'info');
			self.startGameAndGetFirstRoom();
		};
		self.startGameAndGetFirstRoom = function () {
			self.addMessageToLog("New game begun.");
			self.player(new roguePlayer("Steve"));
			self.curTurnIndex(0);
			self.stepsTaken(0);
			self.currentAreaCard(rogueDeck.createRandomAreaCard(true));
		};

		var processMonsterTurns = function () {
			var gameOver = false;
			for (var i = 0; i < self.currentAreaCard().monsters().length; i++) {
				var monster = self.currentAreaCard().monsters()[i];
				monster.processAttack(monster, self.player());
				if (processEndGame()) {
					gameOver = true;
					break;
				}
			}
			return gameOver;
		}
		var processTurnCompletion = function () {
			processMonsterTurns();
			self.player().stomach(self.player().stomach() - 1);
			if (processEndGame()) {
				if (self.player().stomach() < 1) {
					self.addMessageToLog('You are hungry! (-1 HP)');
					self.player().hitPoints(self.player().hitPoints() - 1);
					processEndGame();
				}
			}
		}

		self.moveToNextArea = function (direction) {
			if (self.currentAreaCard().directionExists(direction)) {
				processTurnCompletion();
				self.currentAreaCard(rogueDeck.createRandomAreaCard(false));
				self.addMessageToLog('You moved ' + direction);
				self.stepsTaken(self.stepsTaken() + 1);
				if (self.currentAreaCard().monsters().length > 0) {
					self.addMessageToLog('There are monsters here!', 'danger');
				}
				return true;
			} else {
				return false;
			}
		}

		self.tryMoveToNewArea = function (door) {
			if (!self.moveToNextArea(door.direction)) {
				window.rogueGame.addMessageToLog('You can\'t move that direction!');
			}
		};

		self.takeItem = function (lootCard) {
			self.addMessageToLog('You took the ' + lootCard.type);
			self.player().lootCards.push(lootCard);
			self.currentAreaCard().loot.remove(lootCard);
			processMonsterTurns();
		};

		self.useItem = function (lootCard) {
			self.addMessageToLog('You used the ' + lootCard.type);
			self.player().useLootCard(lootCard);
			processMonsterTurns();
		};

		self.dropItem = function (lootCard) {
			self.addMessageToLog('You dropped the ' + lootCard.type);
			self.player().lootCards.remove(lootCard);
			self.currentAreaCard().loot.push(lootCard);
		}

		var processEndGame = function () {
			var gameOver = false;
			var msg, logLevel;
			if (self.player().hitPoints() < 1) {
				msg = 'You have died from your injuries.';
				logLevel = 'danger';
				gameOver = true;
			}

			if (gameOver) {
				window.rogueGame.addMessageToLog(msg, logLevel);
				var $alertDiv = $('#AlertDiv');
				$('#AlertMsg').text(msg);
				$alertDiv.show();
				$('div.container:first').addClass('disabled');
			}

			return gameOver;
		};

		self.processPlayerAttack = function (monster) {
			monster.processAttack(self.player(), monster);
			if (monster.hitPoints() < 1) {
				window.rogueGame.addMessageToLog('You killed the ' + monster.type);
				self.currentAreaCard().monsters.remove(monster);
				self.currentAreaCard().addMonsterDrop(monster);
			}
			processEndGame();
			processTurnCompletion();
		};

		self.hideAlertDiv = function () {
			$('#AlertDiv').hide();
			$('div.container:first').removeClass('disabled');
		};

		self.startNewGame = function () {
			self.hideAlertDiv();
			self.curTurnIndex(0);
			window.rogueGame.startGameAndGetFirstRoom();
		}
	};
	//end object defs

	//factories
	var weaponFactory = new function () {
		var self = this;

		var getWeaponFromItem = function (item) {
			var w = new weapon(item.name, item.modifier, []);
			var buffsRoll = window.utils.getRandomNumber(10);
			if (buffsRoll < 4) {
				w.buffs.push(buffFactory.getRandomDamageBuff(1, 4));
			}

			return w;
		};

		self.getRandomTier1Weapon = function () {
			var item = rogueDeckDictionary.weaponTypes.getTier1WeaponType();
			return getWeaponFromItem(item);
		};


		self.getRandomTier2Weapon = function () {
			var item = rogueDeckDictionary.weaponTypes.getTier2WeaponType();
			return getWeaponFromItem(item);
		};

		self.getRandomTier3Weapon = function () {
			var item = rogueDeckDictionary.weaponTypes.getTier3WeaponType();
			return getWeaponFromItem(item);
		};

		self.getRandomTier4Weapon = function () {
			var item = rogueDeckDictionary.weaponTypes.getTier4WeaponType();
			return getWeaponFromItem(item);
		};

		self.getRandomTier5Weapon = function () {
			var item = rogueDeckDictionary.weaponTypes.getTier5WeaponType();
			return getWeaponFromItem(item);
		};

		window.weaponFactory = self;
	}

	var armorFactory = new function () {
		var self = this;
		var getArmorFromItem = function (item) {

			var a = new armor(item.name, item.modifier, []);
			var buffsRoll = window.utils.getRandomNumber(10);
			if (buffsRoll < 4) {
				a.buffs.push(buffFactory.getRandomDefenseBuff(1, 4));
			}

			return a;
		};

		self.getRandomTier1Armor = function () {
			var item = rogueDeckDictionary.armorTypes.getTier1ArmorType();
			return getArmorFromItem(item);
		};

		self.getRandomTier2Armor = function () {
			var item = rogueDeckDictionary.armorTypes.getTier2ArmorType();
			return getArmorFromItem(item);
		};

		self.getRandomTier3Armor = function () {
			var item = rogueDeckDictionary.armorTypes.getTier3ArmorType();
			return getArmorFromItem(item);
		};

		self.getRandomTier4Armor = function () {
			var item = rogueDeckDictionary.armorTypes.getTier4ArmorType();
			return getArmorFromItem(item);
		};

		self.getRandomTier5Armor = function () {
			var item = rogueDeckDictionary.armorTypes.getTier5ArmorType();
			return getArmorFromItem(item);
		};
	};

	var buffFactory = new function () {
		var self = this;

		self.getRandomDamageBuff = function (min, max) {
			var val = window.utils.getWeightedRandomNumber(min, max);
			//var val = self.getRandomBuffValue(min, max);
			return new buff(val, null);
		};

		self.getRandomDefenseBuff = function (min, max) {
			var val = window.utils.getWeightedRandomNumber(min, max);
			return new buff(null, val);
		};
	};

	var lootFactory = new function () {
		var self = this;
		self.getRandomLootCard = function () {
			var type, verb, value, lc;
			var rnd = window.utils.getWeightedRandomNumber(1, 10);
			switch (rnd) {
				case 1:
					//other thing
					lc = lootCard('useless thing', 'discard', null);
					break;
				case 2:
				case 3:
					//food
					lc = lootCard('food', 'eat', 10);
					break;
				case 4:
					//health
					type = 'health potion';
					verb = 'use'
					var size = window.utils.getWeightedRandomNumber(1, 3);
					switch (size) {
						case 1:
							type = 'small ' + type;
							value = 10;
							break;
						case 2:
							type = 'medium ' + type;
							value = 20;
							break;
						case 3:
							type = 'large ' + type;
							value = 30;
							break;
					}
					lc = lootCard(type, verb, value);
					break;
				case 5:
				case 6:
				case 7:
				case 8:
				case 9:
				case 10:
					//weapon or armor
					var rnd = window.utils.getRandomNumberBetween(1, 2);
					var tier = window.utils.getWeightedRandomNumber(1, 5);
					if (rnd == 1) {
						//weapon
						var weapon = null;
						switch (tier) {
							case 1:
								weapon = weaponFactory.getRandomTier1Weapon();
								break;
							case 2:
								weapon = weaponFactory.getRandomTier2Weapon();
								break;
							case 3:
								weapon = weaponFactory.getRandomTier3Weapon();
								break;
							case 4:
								weapon = weaponFactory.getRandomTier4Weapon();
								break;
							case 5:
								weapon = weaponFactory.getRandomTier5Weapon();
								break;
						}
						lc = self.createFromItem(weapon, 'equip');
					} else {
						//armor
						var armor = null;
						switch (tier) {
							case 1:
								armor = armorFactory.getRandomTier1Armor();
								break;
							case 2:
								armor = armorFactory.getRandomTier2Armor();
								break;
							case 3:
								armor = armorFactory.getRandomTier3Armor();
								break;
							case 4:
								armor = armorFactory.getRandomTier4Armor();
								break;
							case 5:
								armor = armorFactory.getRandomTier5Armor();
								break;
						}
						lc = self.createFromItem(armor, 'equip');

					}
					break;
			}
			return lc;
		};

		self.createFromItem = function (item, verb) {
			return lootCard(item.displayName(), verb, item);
		};
	}
	//end factories

	window.rogueGame = new rogueGame();
})(window);