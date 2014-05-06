(function (window) {
	//object defs
	var rogueDeckManager = function () {
		var self = this;

		self.createRandomLootCard = function () {
			var rnd = window.utils.getRandomNumber(10);
			var type, verb, value;
			if (rnd < 3) {
				type = 'food';
				verb = 'eat';
				value = 10;
			} else if (rnd < 5) {
				type = 'health potion';
				verb = 'use';
				var size = window.utils.getRandomNumber(10);
				if (size < 5) {
					type = 'small ' + type;
					value = 10;
				} else if (size < 8) {
					type = 'medium ' + type;
					value = 20;
				} else {
					type = 'large ' + type;
					value = 30;
				}
			} else {
				type = 'other thing';
				verb = 'use';
			}

			return new lootCard(self, type, verb, value);
		}

		self.createRandomMonsterCard = function () {
			var attack = window.utils.getRandomNumberBetween(5, 15);
			var defense = window.utils.getRandomNumberBetween(5, 15);
			var hitPoints = window.utils.getRandomNumberBetween(3, 15);

			return new monsterCard(self, 'Monster', 'Monster!', attack, defense, hitPoints);
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
						var lc = self.createRandomLootCard();
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

			return new areaCard(self, cardMonsters, cardLoot, cardType, cardSizeInt);
		};
	};

	var doorCard = function (direction) {
		var self = this;
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
	}

	var lootCard = function (deck, type, verb, value) {
		var self = this;
		self.deck = deck;
		self.type = type;
		self.verb = verb;
		self.value = value;
		self.droppedBy = 'There is a ';
	}

	var monsterCard = function (deck, type, name, attack, defense, hitPoints) {
		var self = this;
		self.deck = deck;
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

	var areaCard = function (deck, monsters, loot, type, sizeInt) {
		var self = this;
		self.deck = deck;
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
			var lc = deck.createRandomLootCard();
			lc.droppedBy = monster.name() + ' dropped a ';
			self.loot.push(lc);
		}

		var numDoors = Math.max(1, Math.floor(self.sizeInt / 2));
		for (var i = 0; i < numDoors; i++) {
			self.doors.push(new doorCard());
		}

	};

	var weapon = function (name, baseDamage, buffs) {
		var self = this;
		self.baseDamage = baseDamage;
		self.buffs = ko.observableArray(window.utils.getBuffsFromArg(buffs));
		self.name = ko.observable(name);
		self.displayName = ko.computed(function () {
			return window.utils.getItemName(self);
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
	};

	var armor = function (name, baseDefense, buffs) {
		var self = this;
		self.baseDefense = baseDefense;
		self.buffs = ko.observableArray(window.utils.getBuffsFromArg(buffs));
		self.name = ko.observable(name);
		self.displayName = ko.computed(function () {
			return window.utils.getItemName(self);
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
		self.armor = ko.observable(armorFactory.getRandomTier1Armor());
		self.defense = ko.computed(function () {
			return self.dexterity() + self.armor().totalDefense();
		});
		self.weapon = ko.observable(weaponFactory.getRandomTier1Weapon());
		self.attack = ko.computed(function () {
			return self.strength() + self.weapon().totalToHit();
		});
		self.isPlayer = true;

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
					window.rogueGame.addMessageToLog('Nothing happened');
			}
		}
	}

	var buff = function (damage, defense) {
		var self = this;
		self.damage = damage;
		self.defense = defense;
	};

	var rogueGame = function () {
		var self = this;
		self.currentAreaCard = ko.observable(null);
		self.player = ko.observable(null);
		self.messageLog = ko.observableArray();
		self.curTurnIndex = ko.observable(0);

		var rogueDeck = new rogueDeckManager();

		self.addMessageToLog = function (msg, level) {
			level = level || 'info';

			self.curTurnIndex(self.curTurnIndex() + 1);
			self.messageLog.unshift({ message: msg, level: level, index: self.curTurnIndex() });
			if (self.messageLog().length == 7) {
				self.messageLog.pop();
			}
		}

		self.clearMessageLog = function () {
			self.messageLog.removeAll();
		};

		self.rerollCharacter = function () {
			self.addMessageToLog("Re-rolling character.", 'info');
			self.curTurnIndex(0);
			self.startGameAndGetFirstRoom();
		};
		self.startGameAndGetFirstRoom = function () {
			self.addMessageToLog("New game begun.");
			self.player(new roguePlayer("Steve"));
			self.currentAreaCard(rogueDeck.createRandomAreaCard(true));
		};

		var processMonsterTurns = function () {
			for (var i = 0; i < self.currentAreaCard().monsters().length; i++) {
				var monster = self.currentAreaCard().monsters()[i];
				monster.processAttack(monster, self.player());
				processEndGame();
			}
		}
		var processTurnCompletion = function () {
			processMonsterTurns();
			self.player().stomach(self.player().stomach() - 1);
			if (self.player().stomach() < 1) {
				self.addMessageToLog('You are hungry! (-1 HP)');
				self.player().hitPoints(self.player().hitPoints() - 1);
			}
		}

		self.moveToNextArea = function (direction) {
			if (self.currentAreaCard().directionExists(direction)) {
				processTurnCompletion();
				self.currentAreaCard(rogueDeck.createRandomAreaCard(false));
				self.addMessageToLog('You moved ' + direction);
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
			processTurnCompletion();
		};

		self.useItem = function (lootCard) {
			self.addMessageToLog('You used the ' + lootCard.type);
			self.player().useLootCard(lootCard);
			processTurnCompletion();
		};

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

		self.getRandomTier1Weapon = function () {
			var item = rogueDeckDictionary.weaponTypes.getTier1WeaponType();
			var w = new weapon(item.name, item.modifier, []);
			var buffsRoll = window.utils.getRandomNumber(10);
			if (buffsRoll < 4) {
				w.buffs.push(buffFactory.getRandomDamageBuff(1,4));
			}

			return w;
		};
	}

	var armorFactory = new function () {
		var self = this;

		self.getRandomTier1Armor = function () {
			var item = rogueDeckDictionary.armorTypes.getTier1ArmorType();
			var a = new armor(item.name, item.modifier, []);
			var buffsRoll = window.utils.getRandomNumber(10);
			if (buffsRoll < 4) {
				a.buffs.push(buffFactory.getRandomDefenseBuff(1, 4));
			}

			return a;
		};
	};

	var buffFactory = new function () {
		var self = this;
		self.getRandomBuffValue = function (min, max) {
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

		self.getRandomDamageBuff = function (min, max) {
			var val = self.getRandomBuffValue(min, max);
			return new buff(val, null);
		};

		self.getRandomDefenseBuff = function (min, max) {
			var val = self.getRandomBuffValue(min, max);
			return new buff(null, val);
		};
	};
	//end factories

	window.rogueGame = new rogueGame();
})(window);