//const wgClientId = FROM .env
//const wgSecretKey = FROM .env
const wgURL = 'https://wanderersguide.app/api';

exports.getCharacter = async function(id){

}

async function downloadCharacter(id){
    if (!typeof id === 'string') return;
    let downloaded;
    try {
        await fetch(`${wgURL}/char/${id}/calculated-stats`, {
          headers: { Authorization: 'Bearer 076qo9484l5tuqgk3j7n1' },
        }).then((resp) => result.resp.json());
        res.send(result);
      } catch (error) {
        throw new Error();
      }
}

app.get('/hp', async (req, res) => {
    let result;
    
  });