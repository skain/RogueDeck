(function (window) {
	//object defs
	var rogueDeckManager = function () {
		var self = {};

		self.areaCards = (function (deck) {
			self.getFirstRoomCard = function () {
				return areaCard(null, null, 'room', 4);
			};

			self.createRandomAreaCard = function (curGameLevel) {
				var cardSizeInt = window.utils.getRandomNumber(10);
				var cardType = 'room';
				if (window.utils.getRandomNumber(10) < 7) {
					cardType = 'hallway';
				}

				//calculate random loot
				var cardLoot = [];
				if (cardType == 'room') {
					var numLoot = Math.floor(cardSizeInt / 2);
					for (var i = 0; i < numLoot; i++) {
						var lc = deck.lootCards.getRandomLootCard(curGameLevel);
						if (lc) {
							cardLoot.push(lc);
						}
					}
				}

				var cardMonsters = [];
				//calculate random monsters
				var numMonsters = Math.floor(cardSizeInt / 3); //allow for no monsters
				for (var i = 0; i < numMonsters; i++) {
					var mc = deck.monsterCards.getRandomMonsterForLevel(curGameLevel);

					if (mc) {
						cardMonsters.push(mc);
					}
				}

				return areaCard(cardMonsters, cardLoot, cardType, cardSizeInt, deck);
			};
		})(self);

		self.calculateForCurLevel = function (curGameLevel) {
			var median = Math.floor(curGameLevel / 2); 
			if (median > 5) {
				median = 5;
			}
			var min = 1, max = 5;

			if (median - 2 > min) {
				min = median - 2;
			}

			if (median + 2 < max) {
				max = median + 2;
			}

			return { min: min, max: max, median: median };
		};
		self.weaponCards = (function (deck) {
			var self = {};

			var getWeaponFromItem = function (item) {
				var w = weapon(item.name, item.modifier, []);
				var buffsRoll = window.utils.getRandomNumber(10);
				if (buffsRoll < 4) {
					w.buffs.push(deck.buffs.getRandomDamageBuff(1, 4));
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

			return self;
		})(self);

		self.armorCards = (function (deck) {
			var self = {};
			var getArmorFromItem = function (item) {

				var a = armor(item.name, item.modifier, []);
				var buffsRoll = window.utils.getRandomNumber(10);
				if (buffsRoll < 4) {
					a.buffs.push(deck.buffs.getRandomDefenseBuff(1, 4));
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
			return self
		})(self);

		self.buffs = (function (deck) {
			var self = {};

			self.getRandomDamageBuff = function (min, max) {
				var val = window.utils.getWeightedRandomNumber(min, max);
				//var val = self.getRandomBuffValue(min, max);
				return buff(val, null);
			};

			self.getRandomDefenseBuff = function (min, max) {
				var val = window.utils.getWeightedRandomNumber(min, max);
				return buff(null, val);
			};

			return self;
		})(self);

		self.lootCards = (function (deck) {
			var self = {};
			self.getRandomLootCard = function (level) {
				var type, verb, value, lc;
				var rnd = window.utils.getWeightedRandomNumber(1, 10);
				switch (rnd) {
					case 1:
						lc = null;
						break;
					case 2:
						//other thing
						lc = lootCard('useless thing', 'discard', null);
						break;
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
						var tier = window.utils.getDownwardWeightedRandomNumber(1, 5, level);
						if (rnd == 1) {
							//weapon
							var weapon = null;
							switch (tier) {
								case 1:
									weapon = deck.weaponCards.getRandomTier1Weapon();
									break;
								case 2:
									weapon = deck.weaponCards.getRandomTier2Weapon();
									break;
								case 3:
									weapon = deck.weaponCards.getRandomTier3Weapon();
									break;
								case 4:
									weapon = deck.weaponCards.getRandomTier4Weapon();
									break;
								case 5:
									weapon = deck.weaponCards.getRandomTier5Weapon();
									break;
							}
							lc = self.createFromItem(weapon, 'equip');
						} else {
							//armor
							var armor = null;
							switch (tier) {
								case 1:
									armor = deck.armorCards.getRandomTier1Armor();
									break;
								case 2:
									armor = deck.armorCards.getRandomTier2Armor();
									break;
								case 3:
									armor = deck.armorCards.getRandomTier3Armor();
									break;
								case 4:
									armor = deck.armorCards.getRandomTier4Armor();
									break;
								case 5:
									armor = deck.armorCards.getRandomTier5Armor();
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

			self.getRandomLootForLevel = function (curGameLevel) {
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
						var levelValues = deck.calculateForCurLevel(curGameLevel);
						var itemRoll = window.utils.getDownwardWeightedRandomNumber(levelValues.min, levelValues.max, levelValues.median);
						var rnd = window.utils.getRandomNumberBetween(1, 2);
						if (rnd == 1) {
							//weapon
							var weapon = null;
							switch (itemRoll) {
								case 1:
									weapon = deck.weaponCards.getRandomTier1Weapon();
									break;
								case 2:
									weapon = deck.weaponCards.getRandomTier2Weapon();
									break;
								case 3:
									weapon = deck.weaponCards.getRandomTier3Weapon();
									break;
								case 4:
									weapon = deck.weaponCards.getRandomTier4Weapon();
									break;
								case 5:
									weapon = deck.weaponCards.getRandomTier5Weapon();
									break;
							}
							lc = self.createFromItem(weapon, 'equip');
						} else {
							//armor
							var armor = null;
							switch (itemRoll) {
								case 1:
									armor = deck.armorCards.getRandomTier1Armor();
									break;
								case 2:
									armor = deck.armorCards.getRandomTier2Armor();
									break;
								case 3:
									armor = deck.armorCards.getRandomTier3Armor();
									break;
								case 4:
									armor = deck.armorCards.getRandomTier4Armor();
									break;
								case 5:
									armor = deck.armorCards.getRandomTier5Armor();
									break;
							}
							lc = self.createFromItem(armor, 'equip');

						}
						break;
				}
				return lc;
			};

			return self;
		})(self);

		self.monsterCards = (function (deck) {
			var self = {};
			function getMonsterFromItem(item, level) {
				var attack = item.modifier + window.utils.getRandomNumber(6);
				var defense = item.modifier + window.utils.getRandomNumber(6);
				var hp = item.modifier + window.utils.getRandomNumber(6);

				var m = monsterCard(item.name, level, item.name, attack, defense, hp);

				return m;
			}

			self.getRandomTier1Monster = function () {
				var item = rogueDeckDictionary.monsterTypes.getTier1MonsterType();
				return getMonsterFromItem(item, 1);
			};

			self.getRandomTier2Monster = function () {
				var item = rogueDeckDictionary.monsterTypes.getTier2MonsterType();
				return getMonsterFromItem(item, 2);
			};

			self.getRandomTier3Monster = function () {
				var item = rogueDeckDictionary.monsterTypes.getTier3MonsterType();
				return getMonsterFromItem(item, 3);
			};

			self.getRandomTier4Monster = function () {
				var item = rogueDeckDictionary.monsterTypes.getTier4MonsterType();
				return getMonsterFromItem(item, 4);
			};

			self.getRandomTier5Monster = function () {
				var item = rogueDeckDictionary.monsterTypes.getTier5MonsterType();
				return getMonsterFromItem(item, 5);
			};

			self.getRandomMonsterForLevel = function (curGameLevel) {
				var mc = null;
				
				var levelValues = deck.calculateForCurLevel(curGameLevel);


				var roll = window.utils.getDownwardWeightedRandomNumber(levelValues.min, levelValues.max, levelValues.median);
				switch (roll) {
					case 1:
						mc = deck.monsterCards.getRandomTier1Monster();
						break;
					case 2:
						mc = deck.monsterCards.getRandomTier2Monster();
						break;
					case 3:
						mc = deck.monsterCards.getRandomTier3Monster();
						break;
					case 4:
						mc = deck.monsterCards.getRandomTier4Monster();
						break;
					case 5:
						mc = deck.monsterCards.getRandomTier5Monster();
						break;
					default:
						throw 'Expected # between 1 and 5, got: ' + roll;
				}

				return mc;
			};

			return self;
		})(self);
		return self;
	};

	var cardWithImage = function () {
		var self = {};
		self.imageUrl = ko.observable();
		self.setImageUrl = function (searchStr) {
			searchStr = searchStr.replace(' ', '+');
			var imageSearch = null;
			var pageRandomized = false;
			var randomPageIndex = 1;
			function callback() {
				if (!pageRandomized) {
					pageRandomized = true;
					randomPageIndex = window.utils.getRandomNumberBetween(0, imageSearch.cursor.pages.length - 1);
					imageSearch.gotoPage(randomPageIndex);
					return;
				}
				// Check that we got results
				if (imageSearch.results && imageSearch.results.length > 0) {
					var index = window.utils.getRandomNumberBetween(0, imageSearch.results.length - 1);
					self.imageUrl(imageSearch.results[index].tbUrl);
				} else {
					if (randomPageIndex > -1) {
						randomPageIndex--;
						console.log(randomPageIndex);
						imageSearch.gotoPage(randomPageIndex);
					}
				}
			};

			function doImageSearch() {
				pageRandomized = false;
				randomPageIndex = 1;
				imageSearch = new google.search.ImageSearch();

				imageSearch.setSearchCompleteCallback(this, callback, null);

				imageSearch.execute(searchStr);

				// Include the required Google branding
				google.search.Search.getBranding('GoogleBranding');
			};

			doImageSearch();
		}

		return self;
	}

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
		var self = cardWithImage();
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
		self.setImageUrl(self.displayName());
		return self;
	}

	var monsterCard = function (type, level, name, attack, defense, hitPoints) {
		var self = cardWithImage();
		self.type = type || "Monster";
		self.name = ko.observable(name);
		self.attack = ko.observable(attack || 1);
		self.defense = ko.observable(defense || 1);
		self.hitPoints = ko.observable(hitPoints || 1);
		self.isMonster = true;
		self.setImageUrl(self.name());
		self.level = ko.observable(level);
		self.exp = Math.floor((self.attack() + self.defense() + self.hitPoints()) / 6); //avg / 2
		return self;
	}

	var areaCard = function (monsters, loot, type, sizeInt, deck) {
		var self = {};
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
			var lc = deck.lootCards.getRandomLootCard(monster.level());
			lc.droppedBy = monster.name() + ' dropped a ';
			self.loot.push(lc);
		}

		var numDoors = Math.max(1, Math.floor(self.sizeInt / 2));
		for (var i = 0; i < numDoors; i++) {
			self.doors.push(doorCard());
		}

		return self;
	};

	var weapon = function (name, baseDamage, buffs) {
		var self = {};
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

		return self;
	};

	var armor = function (name, baseDefense, buffs) {
		var self = {};
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

		return self;
	}

	var roguePlayer = function (name) {
		var self = {};
		self.name = ko.observable(name);
		self.type = 'Player';
		self.weapon = ko.observable();
		self.armor = ko.observable();
		self.strength = ko.observable(window.utils.getRandomNumberBetween(5, 15));
		self.vitality = ko.observable(window.utils.getRandomNumberBetween(5, 15));
		self.intelligence = ko.observable(window.utils.getRandomNumberBetween(5, 15));
		self.dexterity = ko.observable(window.utils.getRandomNumberBetween(5, 15));
		self.maxHitPoints = ko.computed(function () { return 15 + self.vitality() });
		self.hitPoints = ko.observable(self.maxHitPoints());
		self.maxStomach = ko.observable(20 + self.vitality());
		self.stomach = ko.observable(self.maxStomach());
		self.lootCards = ko.observableArray();
		self.defense = ko.computed(function () {
			var def = self.dexterity() + (self.armor && self.armor() ? self.armor().value.totalDefense() : 0);
			return def;
		});
		self.attack = ko.computed(function () {
			var att = self.strength() + (self.weapon && self.weapon() ? self.weapon().value.totalToHit() : 0);
			return att;
		});
		self.isPlayer = true;
		self.exp = ko.observable(0);
		self.level = ko.computed(function () {
			var comp = Math.floor((Math.log(self.exp() + 1) * 1.3) / 2);
			if (comp < 1) {
				comp = 1;
			}
			return comp;
		});
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
			if (curWeapon) {
				self.lootCards.unshift(curWeapon);
			}
		};

		self.equipArmor = function (lootCard) {
			var curArmor = self.armor();
			self.armor(lootCard);
			if (curArmor) {
				self.lootCards.unshift(curArmor);
			}
		};

		return self;
	}

	var buff = function (damage, defense) {
		var self = {};
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

		return self;
	};

	var rogueGame = function () {
		var self = {};
		self.currentAreaCard = ko.observable(null);
		self.player = ko.observable(null);
		self.messageLog = ko.observableArray();
		self.stepsTaken = ko.observable(0);
		self.gameLevel = ko.computed(function () {
			return Math.floor(self.stepsTaken() / 10) + 1;
		});

		var rogueDeck = rogueDeckManager();

		var getStartingArmor = function () {
			var armor = rogueDeck.armorCards.getRandomTier1Armor();
			return lootCard(armor.displayName(), 'equip', armor);
		};

		var getStartingWeapon = function () {
			var weapon = rogueDeck.weaponCards.getRandomTier1Weapon();
			return lootCard(weapon.displayName(), 'equip', weapon);
		};


		self.addMessageToLog = function (msg, level) {
			level = level || 'info';

			self.messageLog.unshift({ message: msg, level: level });
			if (self.messageLog().length == 7) {
				self.messageLog.pop();
			}
			//$.growl(msg, {
			//	type: level,
			//	template: {
			//		container: '<div class="col-md-2 alert growl-animated">'
			//	},
			//	position: {
			//		from: "top",
			//		align: "right"
			//	},
			//	fade_in: 800,
			//	pause_on_mouseover: true,
			//	delay: 3000
			//})
		};

		self.clearMessageLog = function () {
			self.messageLog.removeAll();
		};

		self.rerollCharacter = function () {
			self.addMessageToLog("Re-rolling character.", 'info');
			var player = roguePlayer("");
			player.equipWeapon(getStartingWeapon());
			player.equipArmor(getStartingArmor());
			self.player(player);
		};
		self.startNewGame = function () {
			self.hideAlertDiv();
			self.showGameDiv();
			self.addMessageToLog("New game begun.");
			self.stepsTaken(0);
			self.currentAreaCard(rogueDeck.getFirstRoomCard());
		};

		var processAttack = function (attacker, defender) {
			var attackerRoll = window.utils.getRandomNumber(10);
			var att = attacker.attack() + 2 * attacker.level();
			var def = defender.defense() + 2 * defender.level();

			var dmg = window.utils.calculateHit(att, def, attackerRoll);

			if (dmg > 0) {
				//process hit
				defender.hitPoints(defender.hitPoints() - dmg);
				if (defender.isPlayer) {
					bounceHP();
				}
				self.addMessageToLog(attacker.name() + ' hits ' + defender.name() + ' for ' + dmg + ' HP of damage.', attacker.isPlayer ? 'success' : 'danger');
			} else {
				//process miss
				self.addMessageToLog(attacker.name() + ' misses ' + defender.name(), attacker.isPlayer ? 'warning' : 'success');
			}
		};

		var processMonsterTurns = function () {
			var gameOver = false;
			for (var i = 0; i < self.currentAreaCard().monsters().length; i++) {
				var monster = self.currentAreaCard().monsters()[i];
				processAttack(monster, self.player());
				if (processEndGame()) {
					gameOver = true;
					break;
				}
			}
			return gameOver;
		};
		var processTurnCompletion = function () {
			processMonsterTurns();
			self.player().stomach(self.player().stomach() - 1);
			if (!processEndGame()) {
				if (self.player().stomach() < 1) {
					self.addMessageToLog('You are hungry! (-1 HP)');
					bounceStomach();
					self.player().hitPoints(self.player().hitPoints() - 1);
					processEndGame();
				}
			}
		};

		self.moveToNextArea = function (direction) {
			if (self.currentAreaCard().directionExists(direction)) {
				processTurnCompletion();
				self.currentAreaCard(rogueDeck.createRandomAreaCard(self.gameLevel()));
				self.addMessageToLog('You moved ' + direction);
				self.stepsTaken(self.stepsTaken() + 1);
				if (self.currentAreaCard().monsters().length > 0) {
					self.addMessageToLog('There are monsters here!', 'danger');
				}
				return true;
			} else {
				return false;
			}
		};

		self.tryMoveToNewArea = function (door) {
			if (!self.moveToNextArea(door.direction)) {
				window.rogueGame.addMessageToLog('You can\'t move that direction!');
			}
		};

		self.takeItem = function (lootCard) {
			self.addMessageToLog('You took the ' + lootCard.type);
			self.player().lootCards.unshift(lootCard);
			self.currentAreaCard().loot.remove(lootCard);
			processMonsterTurns();
		};

		self.useItem = function (lootCard) {
			self.addMessageToLog('You used the ' + lootCard.type);
			self.player().useLootCard(lootCard);
			processMonsterTurns();
		};

		var bounceElement = function ($element, callback) {
			window.utils.addAnimationWithCallback($element, 'animated bounce', callback);
		};

		var bounceHP = function (callback) {
			bounceElement($('.hitPointsContainer'), callback);
		};

		var bounceStomach = function (callback) {
			bounceElement($('.stomachContainer'), callback);
		};

		self.dropItem = function (lootCard) {
			self.addMessageToLog('You dropped the ' + lootCard.type);
			self.player().lootCards.remove(lootCard);
			self.currentAreaCard().loot.push(lootCard);
		};
		self.hideGameDiv = function () {
			$('#RogueGameDiv').addClass('displayNone');
		};
		self.showGameDiv = function () {
			$('#RogueGameDiv').removeClass('displayNone');
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
				window.bsKOModal.showAlertModal('You have died', msg + ' Click OK to start a new game.', function () {
					self.hideGameDiv();
					self.rerollCharacter();
					self.showCharacterCreationModal();
				});
				$('div.container:first').addClass('disabled');
			}

			return gameOver;
		};

		self.processPlayerAttack = function (monster) {
			processAttack(self.player(), monster);
			if (monster.hitPoints() < 1) {
				self.addMessageToLog('You killed the ' + monster.type);
				self.player().exp(self.player().exp() + monster.exp);
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


		self.runFromArea = function () {
			self.addMessageToLog('You attempt to run from the area!', 'warning');
			var gameOver = false;
			for (var i = 0; i < self.currentAreaCard().monsters().length; i++) {
				var monster = self.currentAreaCard().monsters()[i];
				var roll = window.utils.getRandomNumber(10);
				if (roll < 5) {
					processAttack(monster, self.player());
					if (processEndGame()) {
						gameOver = true;
						break;
					}
				}
			}

			if (!gameOver) {
				self.moveToNextArea(self.currentAreaCard().doors()[0].direction);
			}
		};

		self.showCharacterCreationModal = function () {
			window.bsKOModal.showCharacterCreationModal(self);
		};
		return self;
	}
	//end object defs

	window.rogueGame = rogueGame();
})(window);
