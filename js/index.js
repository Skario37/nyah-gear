window.onload = function() {
  window.classAttr = {};
  window.classInfo = {};
  window.currentClass = "none";
  window.currentRace = "PC_ALL";

  window.gear_categories = []
  window.gear_equipment_types = ["mace", "dagger", "sword", "polearm", "greatsword", "bow", "spellbook", "orb", "gun", "cannon", "keyblade", "harp"];
  window.gear_armor_type = "";
  window.gear_file = "";

}

async function fetchByName(name, option) {
  var response = await fetch('xml/' + name + '.xml')
  var data = await response.text();
  var parser = new DOMParser()
  var xmlDOM = parser.parseFromString(data, "application/xml")
  return Array.from(xmlDOM.querySelectorAll(option))
}

// Handle level
handleLevel = async (e) => {
  if(e.value > 65) e.value = 65;
  else if(e.value < 9) e.value = 9;

  modifyStats(await getClassAttributes());
  showClassInfo();
}

// Handle class
handleClass = async (e) => {
  window.currentClass = e;
  
  var dropdownClass = document.getElementById('dropdownClass');
  e === 'none' ? dropdownClass.style.backgroundImage = "url(img/" + e + ".png)" : dropdownClass.style.backgroundImage = "url(img/icon-class_" + e + ".png)";
  
  switch (e) {
    case "gladiator":
      window.gear_equipment_types = ["mace", "dagger", "sword", "polearm", "greatsword", "bow", "shield"];
      break;
    case "templar":
      window.gear_equipment_types = ["mace", "sword", "greatsword", "shield"];
      break;
    case "ranger":
      window.gear_equipment_types = ["dagger", "sword", "bow"];
      break;
    case "assassin":
      window.gear_equipment_types = ["dagger", "sword", "bow"];
      break;
    case "spiritmaster":
      window.gear_equipment_types = ["spellbook", "orb"];
      break;
    case "sorcerer":
      window.gear_equipment_types = ["spellbook", "orb"];
      break;
    case "cleric":
      window.gear_equipment_types = ["mace", "staff", "shield"];
      break;
    case "chanter":
      window.gear_equipment_types = ["mace", "staff", "shield"];
      break;
    case "gunslinger":
      window.gear_equipment_types = ["gun", "cannon"];
      break;
    case "aethertech":
      window.gear_equipment_types = ["gun", "keyblade"];
      break;
    case "songweaver":
      window.gear_equipment_types = ["harp"];
      break;
    case "none":
    default:
      window.gear_equipment_types = ["mace", "staff", "dagger", "sword", "polearm", "greatsword", "bow", "spellbook", "orb", "gun", "cannon", "keyblade", "harp", "shield"];
      break;
  }

  modifyBackgroundClass();
  showGearList(await getGearList());
  modifyStats(await getClassAttributes());
  showClassInfo();
}

// Handle Race
handleRace = async (e) => {
  switch(e) {
    case 'asmodian':
      window.currentRace = "ASMODIANS";
      break;
    case 'elysian':
      window.currentRace = "ELYOS";
      break;
    case 'aion':
    default:
      window.currentRace = "PC_ALL";
      break;
  }

  var dropdownRace = document.getElementById('dropdownRace');
  dropdownRace.style.backgroundImage = "url(img/" + e + ".png)";

  
  modifyBackgroundClass();
  showGearList(await getGearList());
  modifyStats(await getClassAttributes());
  showClassInfo();
}

/* GET CLASS ATTRIBUTES */
async function getClassAttributes() {
  if (window.currentClass === "none") return [];
  
  var classs = await fetchByName('player/' + window.currentClass, 'player_stats');
  var classInfo = classs.filter(classNode => classNode.getAttribute('level') === document.getElementById('level').value);
  return classInfo[0].children[0].attributes;
}

/* CHANGE BACKGROUND */
function modifyBackgroundClass() {
  var backgroundClass = document.getElementById('bookmark');
  if (window.currentClass === 'none') {
    backgroundClass.style.backgroundImage = "url(img/" + window.currentClass + ".png)"
  } else {
    if(window.currentRace === "PC_ALL") {
      backgroundClass.style.backgroundImage = "url(img/class_" + window.currentClass + ".png)";
    } else if (window.currentRace === "ASMODIANS") {
      backgroundClass.style.backgroundImage = "url(img/class_" + window.currentClass + "-a.png)";
    } else if (window.currentRace === "ELYOS") {
      backgroundClass.style.backgroundImage = "url(img/class_" + window.currentClass + "-e.png)";
    }
  }
}

/* SHOW CLASS INFO */
function showClassInfo() {
  var classInfoNode = document.getElementById("classInfo");
  var classInfoWrapper = document.getElementById("classInfoWrapper");
  if (classInfoWrapper) classInfoWrapper.remove();
  classInfoWrapper = document.createElement('div');
  classInfoWrapper.setAttribute("id", "classInfoWrapper");
  classInfoNode.appendChild(classInfoWrapper);

  var info = window.classInfo;

  for (var prop in info) {
    let label = document.createElement('p');
    label.setAttribute("id", "label_" + prop);
    label.innerHTML = prop + ": " + info[prop];

    classInfoWrapper.appendChild(label);
  }
}

/* MODIFY STATS */
function modifyStats(classAttr) {
  for (var i = 0; i < classAttr.length; i++) {
    var attr = classAttr[i];
    if (window.classInfo[attr.name]) {
      window.classInfo[attr.name] -= window.classAttr[attr.name];
      window.classInfo[attr.name] += parseInt(attr.value);
    } else {
      window.classInfo[attr.name] = parseInt(attr.value);
    }
    window.classAttr[attr.name] = parseInt(attr.value);
  }
}

handleGear = async (e) => {
  window.slotId = e.parentNode.id;

  switch (window.slotId) {
    case "tRHand":
      window.gear_categories = ["SWORD", "DAGGER", "MACE", "ORB", "SPELLBOOK", "GREATSWORD", "POLEARM", "STAFF", "BOW", "GUN", "CANNON", "HARP", "KEYBLADE"];
      window.gear_armor_type = "";
      window.gear_file = "weapons";
      break;
    case "tLHand":
      window.gear_categories = ["SHIELD", "SWORD", "DAGGER", "MACE", "ORB", "SPELLBOOK", "GREATSWORD", "POLEARM", "STAFF", "BOW", "GUN", "CANNON", "HARP", "KEYBLADE"];
      window.gear_armor_type = "";
      window.gear_file = "weapons";
      break;
    case "tJacket":
      window.gear_categories = ["JACKET"];
      window.gear_armor_type = "";
      window.gear_file = "jacket";
      break;
    case "tPants":
      window.gear_categories = ["PANTS"];
      window.gear_armor_type = "";
      window.gear_file = "pants";
      break;
    case "tShoulders":
      window.gear_categories = ["SHOULDERS"];
      window.gear_armor_type = "";
      window.gear_file = "shoulders";
      break;
    case "tGloves":
      window.gear_categories = ["GLOVES"];
      window.gear_armor_type = "";
      window.gear_file = "gloves";
      break;
    case "tShoes":
      window.gear_categories = ["SHOES"];
      window.gear_armor_type = "";
      window.gear_file = "shoes";
      break;
    case "tHelmet":
      window.gear_categories = ["HELMET"];
      window.gear_armor_type = "";
      window.gear_file = "accessories";
      break;
    case "tNecklace":
      window.gear_categories = ["NECKLACE"];
      window.gear_armor_type = "";
      window.gear_file = "accessories";
      break;
    case "tREarrings":
    case "tLEarrings":
      window.gear_categories = ["EARRINGS"];
      window.gear_armor_type = "";
      window.gear_file = "accessories";
      break;
    case "tRRings":
    case "tLRings":
      window.gear_categories = ["RINGS"];
      window.gear_armor_type = "";
      window.gear_file = "accessories";
      break;
    case "tBelt":
      window.gear_categories = ["BELT"];
      window.gear_armor_type = "";
      window.gear_file = "accessories";
      break;
    case "tWings":
      window.gear_categories = ["NONE"];
      window.gear_armor_type = "WING";
      window.gear_file = "accessories";
      break;
    default:
      break;
  }

  showGearList(await getGearList())
}

handleQualityFilter = async () => {
  showGearList(await getGearList())
}

handleLevelFilter = async (e) => {
  var minlevel = document.getElementById("levelmin-filter")
  var maxlevel = document.getElementById("levelmax-filter")
  if (e.id === minlevel.id) {
    if (minlevel.value < 1) minlevel.value = 1
    else if (minlevel.value > 65) minlevel.value = 65
    else if (minlevel.value > maxlevel.value) minlevel.value = maxlevel.value
  } else if (e.id === maxlevel.id) {
    if (maxlevel.value < 1) maxlevel.value = 1
    else if (maxlevel.value > 65) maxlevel.value = 65
    else if (maxlevel.value < minlevel.value) maxlevel.value = minlevel.value
  } 
  showGearList(await getGearList())
}

async function getGearList() {
  if (window.gear_file === "") return;
  // Prepare quality
  var superior_quality = document.getElementById("filter-epic-quality")
  var fabled_quality = document.getElementById("filter-unique-quality")
  var eternal_quality = document.getElementById("filter-legend-quality")
  var mythical_quality = document.getElementById("filter-mythic-quality")
  var quality_filter = []
  if (superior_quality.checked) quality_filter.push("EPIC")
  if (fabled_quality.checked) quality_filter.push("UNIQUE")
  if (eternal_quality.checked) quality_filter.push("LEGEND")
  if (mythical_quality.checked) quality_filter.push("MYTHIC")

  // Prepare level
  var minlevel = document.getElementById("levelmin-filter")
  var maxlevel = document.getElementById("levelmax-filter")  

  // Prepare name
  var name = document.getElementById("search-filter")

  // Prepare gear
  var gear = [];
  if (window.gear_file === "weapons") {
    for (var i = 0; i < window.gear_equipment_types.length; i++) {
      gear = [...gear, ...await fetchByName(window.gear_equipment_types[i], "item_template")]
    }
  } else {
    gear = [...gear, ...await fetchByName(gear_file, "item_template")]
  }

  // Filter gear category
  if (window.gear_armor_type.length > 0) {
    gear = gear.filter(gearNode => window.gear_armor_type === gearNode.getAttribute('armor_type'))
  } else {
    gear = gear.filter(gearNode => window.gear_categories.includes(gearNode.getAttribute('category')))
  }

  // Filter race
  if (window.currentRace != "PC_ALL") {
    gear = gear.filter(gearNode => window.currentRace === gearNode.getAttribute('race') || "PC_ALL" === gearNode.getAttribute('race'))
  }
  
  // Filter quality
  gear = gear.filter(gearNode => quality_filter.includes(gearNode.getAttribute('quality')))
  
  // Filter level
  gear = gear.filter(gearNode => gearNode.getAttribute('level') >= minlevel.value)
  gear = gear.filter(gearNode => gearNode.getAttribute('level') <= maxlevel.value)

  // Filter name
  if (name.value.length > 0) {
    console.log(name.value)
    gear = gear.filter(gearNode => gearNode.getAttribute('name').toLowerCase().includes(name.value.toLowerCase()))
  }

  return gear;
}



function sortGearList(gearList) {
  if (window.gear_file === "") return;
  // Get option
  var sort = document.getElementById("stats-sort");

  switch(sort.value) {
    case "quality":
      // common rare epic unique legend mythic
      let quality_arr = ["COMMON", "RARE", "EPIC", "UNIQUE", "LEGEND", "MYTHIC"]
      gearList.sort(function(a, b) {
        return b.getAttribute('level') - a.getAttribute('level') || quality_arr.indexOf(b.getAttribute('quality')) - quality_arr.indexOf(a.getAttribute('quality'))
      });
      break
    case "MAXHP":
    case "PHYSICAL_ATTACK":
    case "BOOST_MAGICAL_SKILL":
    case "PHYSICAL_CRITICAL":
    case "MAGICAL_CRITICAL":
    case "PHYSICAL_ACCURACY":
    case "MAGICAL_ACCURACY":
    case "ATTACK_SPEED":
    case "BOOST_CASTING_TIME":
    case "PVP_ATTACK_RATIO":
    case "PVP_DEFEND_RATIO":
    case "PARRY":
    case "BLOCK":
    case "MAGIC_SKILL_BOOST_RESIST":
    case "CONCENTRATION":
    case "HEAL_BOOST":
    case "MAGICAL_RESIST":
      gearList.sort(function(a, b) {
        return b.getAttribute('high_stat') - a.getAttribute('high_stat')
      });
      break;
    default:
      gearList.sort(function(a, b) {
        return b.getAttribute('level') - a.getAttribute('level')
      });
      break;
  }

  return gearList
}

function showGearList(gearL) {
  if (window.gear_file === "") return;
  var gearList = []
  gearL = gearL.forEach(gear => {
    gear.setAttribute('high_stat', getStatByOption(gear))
    gearList.push(gear)
  })
  gearList = sortGearList(gearList)
  var wrapper = document.getElementById('gearWrapper')
  var tbody = document.getElementById('gearList')
  if (tbody) tbody.remove()
  tbody = document.createElement('tbody')
  tbody.setAttribute('id', 'gearList')
  tbody.classList.add("d-block") 
  wrapper.appendChild(tbody)

  gearList.forEach(gear => {
    let tr = document.createElement('tr')
    tr.classList.add(gear.getAttribute('quality'))
    tr.classList.add("d-flex")
    tr.classList.add("justify-content-between") 
    tr.setAttribute('data-slot', slotId);
    tr.addEventListener("click", handleAttribute(gear))

    let tdlevel = document.createElement('td')
    let tdname = document.createElement('td')
    let tdstat = document.createElement('td')

    tdlevel.innerText = gear.getAttribute('level')
    tdname.innerText = gear.getAttribute('name')
    tdstat.innerText = getStatByOption(gear)

    // Append
    tbody.appendChild(tr)
    tr.appendChild(tdlevel)
    tr.appendChild(tdname)
    tr.appendChild(tdstat)
  });
}

function getStatByOption(gear) {
  var stat = 0;
  var sort = document.getElementById("stats-sort");
  
  switch (sort.value) {
    case "quality":
      stat = gear.getAttribute("quality").toLowerCase();
      break;
    default:
      gear.childNodes.forEach(child => {
        if (child.nodeName === "modifiers") {
          child.childNodes.forEach(statChild => {
          
            if (statChild.nodeName != "#text") {
              if (statChild.getAttribute('name') === sort.value) stat = parseInt(statChild.getAttribute('value'));
            }
          })
        }
        if (child.nodeName === "weapon_stats") {
          if (child.getAttribute(sort.value.toLowerCase())) stat += parseInt(child.getAttribute(sort.value.toLowerCase()));
        }
      })
      break;
  }
  return stat;
}

handleSort = async () => {
  showGearList(await getGearList())
}

handleSearch = async () => {
  showGearList(await getGearList())
}

handleAttribute = (gear) => {
  //console.log(gear)
}