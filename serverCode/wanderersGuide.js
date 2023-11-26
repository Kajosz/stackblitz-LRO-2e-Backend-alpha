//const wgClientId = FROM .env
//const wgSecretKey = FROM .env
const wgURL = 'https://wanderersguide.app/api';

exports.getCharacter = async function(id, tokens){
    const characterData = await downloadCharacter(id, tokens);
    if (!characterData) return {};
    return compileStats(characterData);

}

async function downloadCharacter(id, tokens){
    if (!typeof id === 'string') return;
    let downloaded;
    try {
        await fetch(`${wgURL}/char/${id}/calculated-stats`, {
          headers: { Authorization: tokens[id] },
        }).then((resp) => resp.json())
          .then((json) => (downloaded = JSON.stringify(json)));
        return downloaded;
        
      } catch (error) {
        return null;
      }
}

exports.addNewCharacter = async function(req, res, database, addingCodes, tokens){
    const url = req.originalUrl;
    const indexQuestionMark = url.indexOf('?');
    if (indexQuestionMark < 0 || !url.includes('&')) {
      res.sendStatus(400);
      return;
    }

    const params = url.substring(indexQuestionMark + 1);
    const [rawCode, rowState] = params.split('&');
    const code = rawCode.substring(rawCode.indexOf('=') + 1);
    const state = rowState.substring(rowState.indexOf('=') + 1);

    if (!addingCodes.includes(code)){
        res.sendStatus(401);
        return;
    }

    if (!code || !state) {
        res.sendStatus(400);
        return;
    }

    addingCodes.splice(addingCodes.indexOf(code), 1);

    let result;
    const requestOptions = {
      method: 'POST',
      headers: { Authorization: wgSecretKey },
    };
    await fetch(
      `${wgURL}/oauth2/token?code=${code}&client_id=${wgClientID}`,
      requestOptions
    )
      .then((response) => (accessToken = response.json()))
      .then((json) => (result = JSON.stringify(json)));

    const characterData = {
      characterID: result.char_id,
      expireDate: result.expires_in,
      token: result.access_token,
    };

    tokens[result.char_id] = characterData;

    await database.addNewCharacter(tokens);
    res.redirect([200], frontEndUrl);
      
}

function compileStats(statistics) {
    const keyDictionary = getKeyDictionary();
    const { traits, ...generals } = JSON.parse(statistics.generalInfo);
    const generalInfo = compileObject(generals);
    const passiveStatistics = [
      prepareFeObject(statistics, 'totalAC'),
      prepareFeObject(statistics, 'totalClassDC'),
      prepareFeObject(statistics, 'totalSpeed'),
      prepareFeObject(statistics, 'totalPerception'),
    ];
    const DCs = [...passiveStatistics, ...compileDCs(statistics)];
    const abilities = JSON.parse(statistics.totalAbilityScores);
  
    const aboutSection = {
      DCs: DCs,
      abilities: abilities,
      generalInfo: generalInfo,
      traits: traits,
    };
  
    const savings = compileSkills(
      'saving throws and perception',
      JSON.parse(statistics.totalSaves)
    );
  
    return {aboutSection: aboutSection, savings:savings};
  
    function compileSkills(family, inp) {
      console.log(inp);
    }
  
    function compileObject(obj) {
      const result = [];
      Object.keys(obj).forEach((key) => {
        result.push(prepareFeObject(obj, key));
      });
      return result;
    }
  
    function prepareFeObject(objectReference, key) {
      return { Name: keyDictionary.get(key), value: objectReference[key] };
    }
  
    function compileDCs(stats) {
      const traditions = ['arcane', 'occult', 'primal', 'divine'];
      const compiled = [];
      traditions.forEach((trad) => {
        if (stats[`${trad}SpellProfMod`])
          compiled.push(prepareFeObject(stats, `${trad}SpellDC`));
      });
      return compiled;
    }
  
    function getKeyDictionary() {
      return new Map([
        ['totalAC', 'AC'],
        ['totalClassDC', 'class DC'],
        ['totalSpeed', 'speed'],
        ['totalPerception', 'perception'],
  
        ['arcaneSpellDC', 'arcane spellcasting DC'],
        ['primalSpellDC', 'primal spellcasting DC'],
        ['divineSpellDC', 'divine spellcasting DC'],
        ['occultSpellDC', 'occult spellcasting DC'],
  
        ['className', 'class'],
        ['heritageAncestryName', 'heritage'],
        ['backgroundName', 'background'],
        ['size', 'size'],
      ]);
    }
  }